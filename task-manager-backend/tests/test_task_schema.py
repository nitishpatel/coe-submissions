import pytest
from app.schemas.task import TaskCreate, TaskStatus, TaskUpdate

def test_task_create_requires_title():
    with pytest.raises(Exception):
        TaskCreate(title="", description="A task without a title")


def test_task_create_with_default_status():
    task = TaskCreate(title="Sample Task")
    assert task.status == TaskStatus.TODO


