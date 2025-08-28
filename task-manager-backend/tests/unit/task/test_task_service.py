from app.services.task import TaskService
from app.schemas.task import TaskCreate,TaskUpdate

def test_service_create_and_get(db):
    svc = TaskService()
    created = svc.create(db, TaskCreate(title="Day 3 - Task"))
    assert created.id is not None
    assert created.title == "Day 3 - Task"
    got = svc.get(db, created.id)
    assert got is not None and got.title == "Day 3 - Task"

def test_service_task_update(db):
    svc = TaskService()
    created = svc.create(db, TaskCreate(title="Day 3 - Task"))
    assert created.id is not None
    assert created.title == "Day 3 - Task"
    updated = svc.update(db, created.id, TaskUpdate(title="Day 3 - Task Updated"))
    assert updated is not None
    assert updated.title == "Day 3 - Task Updated"

def test_service_task_delete(db):
    svc = TaskService()
    created = svc.create(db, TaskCreate(title="Day 3 - Task"))
    deleted = svc.delete(db, created.id)   # pass id
    assert deleted is True
    assert svc.get(db, created.id) is None
