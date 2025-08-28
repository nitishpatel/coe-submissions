from app.services.task import TaskService
from app.schemas.task import TaskCreate

def test_service_create_and_get(db):
    svc = TaskService()
    created = svc.create(db, TaskCreate(title="Day 3 - Task"))
    assert created.id is not None
    assert created.title == "Day 3 - Task"
    got = svc.get(db, created.id)
    assert got is not None and got.title == "Day 3 - Task"
