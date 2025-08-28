from __future__ import annotations

import pytest
from typing import Generator

from sqlalchemy import create_engine, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, Session

from fastapi.testclient import TestClient

from app.db.base import Base
from app.main import app
from app.db.session import get_db


@pytest.fixture(scope="session")
def sqlite_engine() -> Engine:
    # check_same_thread=False allows the same connection to be used in different threads (TestClient)
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        pool_pre_ping=True,
        future=True,
    )
    # Create schema once for the whole session
    Base.metadata.create_all(bind=engine)
    return engine


@pytest.fixture(scope="session")
def sqlite_sessionmaker(sqlite_engine: Engine):
    return sessionmaker(bind=sqlite_engine, autoflush=False, autocommit=False, expire_on_commit=False)


@pytest.fixture()
def db(sqlite_engine: Engine, sqlite_sessionmaker) -> Generator[Session, None, None]:
    """
    Each test runs inside a transaction with a nested SAVEPOINT so changes are rolled back.
    This keeps tests isolated and fast.
    """
    # Start outer transaction
    connection = sqlite_engine.connect()
    transaction = connection.begin()

    # New Session bound to the same connection
    session: Session = sqlite_sessionmaker(bind=connection)

    # Start a nested transaction (SAVEPOINT) so test-level commits don't end the outer txn
    nested = connection.begin_nested()

    # Restart SAVEPOINT after each commit so nested tx stays usable
    @event.listens_for(session, "after_transaction_end")
    def _restart_savepoint(session, trans):
        nonlocal nested
        if trans.nested and not trans._parent.nested:  # pragma: no cover
            nested = connection.begin_nested()

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture()
def client(db: Session) -> Generator[TestClient, None, None]:
    def _override_get_db():
        try:
            yield db
            db.commit()
        except Exception:
            db.rollback()
            raise
    app.dependency_overrides[get_db] = _override_get_db
    try:
        with TestClient(app) as c:
            yield c
    finally:
        app.dependency_overrides.pop(get_db, None)
