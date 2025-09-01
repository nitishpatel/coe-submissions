import pytest
from app.schemas.task import TaskRead
from datetime import date,datetime
from app.models.task import Task

@pytest.fixture
def make_task(authenticated_client,):
    def _make_task(title="Test Task", description="Test Description"):
        response = authenticated_client.post("/api/v1/tasks", json={"title": title, "description": description})
        return response
    return _make_task


def test_task_create_api(authenticated_client, make_task,):
    response = make_task()
    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"

def test_task_list_api(authenticated_client, make_task):
    make_task()
    response = authenticated_client.get("/api/v1/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert isinstance(response.json(), list)

    for i in range(3):
        make_task(title=f"Task {i}")

    response = authenticated_client.get("/api/v1/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 4
    assert isinstance(response.json(), list)

def test_task_update_api(authenticated_client,make_task):
    make_task()
    task = authenticated_client.get("/api/v1/tasks").json()[0]
    update_response = authenticated_client.patch(f"/api/v1/tasks/{task['id']}", json={"title": "Updated Task", "description": "Updated Description"})
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated Task"


def test_task_delete_api(authenticated_client, make_task):
    make_task()
    task = authenticated_client.get("/api/v1/tasks").json()[0]
    delete_response = authenticated_client.delete(f"/api/v1/tasks/{task['id']}")
    assert delete_response.status_code == 204

def test_get_invalid_task(authenticated_client):
    response = authenticated_client.get("/api/v1/tasks/invalid_id")
    assert response.status_code == 404

def test_get_valid_task(authenticated_client, make_task):
    make_task()
    task = authenticated_client.get("/api/v1/tasks").json()[0]
    response = authenticated_client.get(f"/api/v1/tasks/{task['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == task["id"]

def test_update_invalid_task(authenticated_client):
    response = authenticated_client.patch("/api/v1/tasks/invalid_id", json={"title": "Updated Task"})
    assert response.status_code == 404

def test_delete_invalid_task(authenticated_client):
    response = authenticated_client.delete("/api/v1/tasks/invalid_id")
    assert response.status_code == 404

def test_task_create_unauthenticated(client):
    response = client.post("/api/v1/tasks", json={"title": "Test Task", "description": "Test Description"})
    assert response.status_code == 401

def test_task_list_unauthenticated(client):
    response = client.get("/api/v1/tasks")
    assert response.status_code == 401

def test_task_update_unauthenticated(client):
    response = client.patch("/api/v1/tasks/some_id", json={"title": "Updated Task"})
    assert response.status_code == 401

def test_task_delete_unauthenticated(client):
    response = client.delete("/api/v1/tasks/some_id")
    assert response.status_code == 401

def test_task_list_pagination(authenticated_client, make_task):
    for i in range(15):
        make_task(title=f"Task {i}")

    response = authenticated_client.get("/api/v1/tasks?page=1&limit=10")
    assert response.status_code == 200
    assert len(response.json()) == 10

    response = authenticated_client.get("/api/v1/tasks?page=2&limit=10")
    assert response.status_code == 200
    assert len(response.json()) == 5

def test_task_list_pagination_invalid_params(authenticated_client):
    response = authenticated_client.get("/api/v1/tasks?page=0&limit=10")
    assert response.status_code == 422

    response = authenticated_client.get("/api/v1/tasks?page=1&limit=0")
    assert response.status_code == 422

    response = authenticated_client.get("/api/v1/tasks?page=1&limit=101")
    assert response.status_code == 422

def test_task_list_empty(authenticated_client):
    response = authenticated_client.get("/api/v1/tasks?page=1&limit=10")
    assert response.status_code == 200
    assert response.json() == []

def test_task_pagination_beyond_range(authenticated_client, make_task):
    for i in range(5):
        make_task(title=f"Task {i}")

    response = authenticated_client.get("/api/v1/tasks?page=2&limit=10")
    assert response.status_code == 200
    assert response.json() == []

def test_task_pagination_exact_limit(authenticated_client, make_task):
    for i in range(10):
        make_task(title=f"Task {i}")

    response = authenticated_client.get("/api/v1/tasks?page=1&limit=10")
    assert response.status_code == 200
    assert len(response.json()) == 10

    response = authenticated_client.get("/api/v1/tasks?page=2&limit=10")
    assert response.status_code == 200
    assert response.json() == []

def test_task_filter_by_status(authenticated_client, make_task):
    make_task(title="Task 1", description="Desc 1")
    make_task(title="Task 2", description="Desc 2")
    tasks = authenticated_client.get("/api/v1/tasks").json()
    task_id = tasks[0]['id']
    authenticated_client.patch(f"/api/v1/tasks/{task_id}", json={"status": "in_progress"})

    response = authenticated_client.get("/api/v1/tasks?task_status=in_progress")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]['status'] == "in_progress"

    response = authenticated_client.get("/api/v1/tasks?task_status=todo")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]['status'] == "todo"

def test_task_filter_by_invalid_status(authenticated_client):
    response = authenticated_client.get("/api/v1/tasks?task_status=invalid_status")
    assert response.status_code == 422

class FixedDatetime(datetime):
    @classmethod
    def utcnow(cls):
        return datetime(2023, 1, 1, 0, 0, 0)

def test_task_filter_by_date_range_from(authenticated_client, make_task,monkeypatch,db):
    make_task(title="Task 1", description="Desc 1")
    make_task(title="Task 2", description="Desc 2")
    db.query(Task).update({Task.created_at: FixedDatetime.utcnow()})
    make_task(title="Task 3", description="Desc 3")
    make_task(title="Task 4", description="Desc 4")
    today = date.today().isoformat()
    response = authenticated_client.get(f"/api/v1/tasks?date_from={today}")
    assert response.status_code == 200
    assert len(response.json()) == 2