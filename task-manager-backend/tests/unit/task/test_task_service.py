import pytest
from app.services.task import TaskService
from app.schemas.task import TaskCreate,TaskUpdate

@pytest.fixture
def task_service(db):
    return TaskService()

def test_service_create_and_get(task_service, db):
    created = task_service.create(db, TaskCreate(title="Day 3 - Task"))
    assert created.id is not None
    assert created.title == "Day 3 - Task"
    got = task_service.get(db, created.id)
    assert got is not None and got.title == "Day 3 - Task"

def test_service_task_update(task_service, db):
    created = task_service.create(db, TaskCreate(title="Day 3 - Task"))
    assert created.id is not None
    assert created.title == "Day 3 - Task"
    updated = task_service.update(db, created.id, TaskUpdate(title="Day 3 - Task Updated"))
    assert updated is not None
    assert updated.title == "Day 3 - Task Updated"

def test_service_task_delete(task_service, db):
    created = task_service.create(db, TaskCreate(title="Day 3 - Task"))
    deleted = task_service.delete(db, created.id)   # pass id
    assert deleted is True
    assert task_service.get(db, created.id) is None

def test_service_list(task_service, db):
    for i in range(5):
        task_service.create(db, TaskCreate(title=f"Task {i}"))
    tasks = task_service.list(db)
    assert len(tasks) == 5
    assert all(task.title.startswith("Task") for task in tasks)


def test_task_title_min_max_length(db):
    with pytest.raises(Exception):
        task_service.create(db, TaskCreate(title="A"))
    with pytest.raises(Exception):
        task_service.create(db, TaskCreate(title="A" * 201))