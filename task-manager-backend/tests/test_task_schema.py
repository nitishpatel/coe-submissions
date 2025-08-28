import pytest
from app.schemas.task import TaskCreate, TaskStatus, TaskUpdate

def test_task_create_requires_title():
    with pytest.raises(Exception):
        TaskCreate(title="", description="A task without a title")


def test_task_create_with_default_status():
    task = TaskCreate(title="Sample Task")
    assert task.status == TaskStatus.TODO

def test_task_update_fields():
    task = TaskCreate(title="Sample Task")
    task_dict = task.dict()
    assert task_dict["title"] == "Sample Task"
    assert task_dict["status"] == TaskStatus.TODO

