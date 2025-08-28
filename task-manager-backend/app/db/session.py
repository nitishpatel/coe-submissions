from __future__ import annotations
from contextlib import contextmanager
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import config

def _engine_kwargs(url: str) -> dict:
    kwargs: dict = {"pool_pre_ping": True}
    if url.startswith("sqlite+"):
        # sqlite for unit tests / quick demos
        kwargs.update({"connect_args": {"check_same_thread": False}})
    return kwargs


DATABASE_URL = config.postgres_url

engine = create_engine(DATABASE_URL, **_engine_kwargs(DATABASE_URL))

# expire_on_commit=False keeps ORM objects usable after commit in service layer
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency:
        from fastapi import Depends
        def route(db: Session = Depends(get_db)): ...
    """
    db: Session = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@contextmanager
def session_scope() -> Generator[Session, None, None]:
    """
    Non-FastAPI contexts (CLI, scripts, seeds):
        with session_scope() as db:
            ...
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
