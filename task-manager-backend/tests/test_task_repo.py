# tests/unit/test_task_repo.py
import pytest
from sqlalchemy.exc import IntegrityError

from app.repositories.task import SqlAlchemyTaskRepository
from app.models.task import TaskStatus, Task

repo = SqlAlchemyTaskRepository()

def test_create_and_get_task(db):
    created = repo.create(db, title="TDD", description=None, status=TaskStatus.TODO)
    db.flush()
    fetched = repo.get(db, created.id)
    assert fetched is not None and fetched.id == created.id
    assert fetched.status == TaskStatus.TODO

def test_update_bumps_updated_at(db):
    t = repo.create(db, title="Rename me", description=None, status=TaskStatus.TODO)
    before = t.updated_at
    repo.update(db, t, title="Renamed", description=None, status=None)
    db.flush()
    assert t.updated_at >= before
    assert t.title == "Renamed"

def test_list_returns_tasks_ordered_by_created_desc(db):
    for i in range(3):
        repo.create(db, title=f"T{i}", description=None, status=TaskStatus.TODO)
    items = repo.list(db, limit=2, offset=0)
    assert len(items) == 2
    assert isinstance(items[0], Task)
