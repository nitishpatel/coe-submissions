import pytest
from app.schemas.task import TaskCreate, TaskStatus, TaskUpdate

def test_task_create_requires_title():
    with pytest.raises(Exception):
        TaskCreate(title="", description="A task without a title")


def test_task_create_with_default_status():
    task = TaskCreate(title="Sample Task")
    assert task.status == TaskStatus.TODO


def test_task_title_min_and_max_length():
    with pytest.raises(Exception):
        TaskCreate(title="A", description="Invalid description")
    with pytest.raises(Exception):
        TaskCreate(title="A" * 201, description="Invalid description")

def test_task_create_with_invalid_status():
    with pytest.raises(Exception):
        TaskCreate(title="Valid Title", status="INVALID_STATUS")
