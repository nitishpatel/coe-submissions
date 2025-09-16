import pytest
from app.schemas.task import TaskRead
from datetime import date,datetime,timedelta
from app.models.task import Task
import time

@pytest.fixture
def make_task(authenticated_client,):
    def _make_task(title="Test Task", description="Test Description"):
        response = authenticated_client.post("/api/v1/tasks", json={"title": title, "description": description})
        return response
    return _make_task


def test_task_create_api(make_task):
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

def test_task_filter_by_date_range_to(authenticated_client, make_task,monkeypatch,db):
    make_task(title="Task 1", description="Desc 1")
    make_task(title="Task 2", description="Desc 2")
    db.query(Task).update({Task.created_at: FixedDatetime.utcnow()})
    make_task(title="Task 3", description="Desc 3")
    make_task(title="Task 4", description="Desc 4")
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    response = authenticated_client.get(f"/api/v1/tasks?date_to={yesterday}")
    assert response.status_code == 200
    assert len(response.json()) == 2

def test_task_filter_by_date_range_from_to(authenticated_client, make_task,monkeypatch,db):
    make_task(title="Task 1", description="Desc 1")
    make_task(title="Task 2", description="Desc 2")
    db.query(Task).update({Task.created_at: FixedDatetime.utcnow()})
    make_task(title="Task 3", description="Desc 3")
    make_task(title="Task 4", description="Desc 4")
    yesterday = (date.today() - timedelta(days=1)).isoformat()
    today = date.today().isoformat()
    response = authenticated_client.get(f"/api/v1/tasks?date_from={yesterday}&date_to={today}")
    assert response.status_code == 200
    assert len(response.json()) == 2

def test_task_filter_by_invalid_date_range(authenticated_client):
    response = authenticated_client.get("/api/v1/tasks?date_from=2023-13-01")
    assert response.status_code == 422

    response = authenticated_client.get("/api/v1/tasks?date_to=2023-01-32")
    assert response.status_code == 422

def test_task_filter_by_date_range_from_greater_than_to(authenticated_client):
    response = authenticated_client.get("/api/v1/tasks?date_from=2023-01-10&date_to=2023-01-01")
    assert response.status_code == 422


def test_task_filter_combined(authenticated_client, make_task,monkeypatch,db):
    make_task(title="Task 1", description="Desc 1")
    make_task(title="Task 2", description="Desc 2")

    tasks = authenticated_client.get("/api/v1/tasks").json()
    task_id = tasks[0]['id']

    authenticated_client.patch(f"/api/v1/tasks/{task_id}", json={"status": "in_progress"})

    db.query(Task).filter(
        Task.id == tasks[1]['id']
    ).update({Task.created_at: FixedDatetime.utcnow()})

    make_task(title="Task 3", description="Desc 3")
    make_task(title="Task 4", description="Desc 4")

    yesterday = (date.today() - timedelta(days=1)).isoformat()
    today = date.today().isoformat()
    response = authenticated_client.get(f"/api/v1/tasks?task_status=in_progress&date_from={yesterday}&date_to={today}")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]['status'] == "in_progress"

def test_task_sorting_by_created_at_asc(authenticated_client, make_task):
    make_task(title="Task A", description="Desc A")
    make_task(title="Task B", description="Desc B")
    make_task(title="Task C", description="Desc C")

    response = authenticated_client.get("/api/v1/tasks?sort_by=created_at&order=asc")
    assert response.status_code == 200
    tasks = response.json()
    assert tasks[0]['title'] == "Task A"
    assert tasks[1]['title'] == "Task B"
    assert tasks[2]['title'] == "Task C"

def test_task_sorting_by_created_at_desc(authenticated_client, make_task, db):
    t1 = make_task(title="Task A").json()
    t2 = make_task(title="Task B").json()
    t3 = make_task(title="Task C").json()

    base = datetime(2023, 1, 1)
    db.query(Task).filter(Task.id == t1["id"]).update({"created_at": base})
    db.query(Task).filter(Task.id == t2["id"]).update({"created_at": base + timedelta(seconds=1)})
    db.query(Task).filter(Task.id == t3["id"]).update({"created_at": base + timedelta(seconds=2)})
    db.commit()

    response = authenticated_client.get("/api/v1/tasks?sort_by=created_at&order=desc")
    assert [t['title'] for t in response.json()] == ["Task C", "Task B", "Task A"]

def test_task_sort_by_status_asc(authenticated_client, make_task):
    t1 = make_task(title="Task A", description="Desc A").json()
    t2 = make_task(title="Task B", description="Desc B").json()
    t3 = make_task(title="Task C", description="Desc C").json()

    authenticated_client.patch(f"/api/v1/tasks/{t1['id']}", json={"status": "done"})
    authenticated_client.patch(f"/api/v1/tasks/{t2['id']}", json={"status": "todo"})
    authenticated_client.patch(f"/api/v1/tasks/{t3['id']}", json={"status": "in_progress"})

    response = authenticated_client.get("/api/v1/tasks?sort_by=status&order=asc")
    assert response.status_code == 200
    tasks = response.json()

    statuses = [t["status"] for t in tasks]

    assert statuses == ["done", "in_progress", "todo"]

def test_task_sort_by_status_desc(authenticated_client,make_task):
    t1 = make_task(title="Task A", description="Desc A").json()
    t2 = make_task(title="Task B", description="Desc B").json()
    t3 = make_task(title="Task C", description="Desc C").json()

    authenticated_client.patch(f"/api/v1/tasks/{t1['id']}", json={"status": "done"})
    authenticated_client.patch(f"/api/v1/tasks/{t2['id']}", json={"status": "todo"})
    authenticated_client.patch(f"/api/v1/tasks/{t3['id']}", json={"status": "in_progress"})

    response = authenticated_client.get("/api/v1/tasks?sort_by=status&order=desc")
    assert response.status_code == 200
    tasks = response.json()

    statuses = [t["status"] for t in tasks]

    assert statuses == ["todo","in_progress","done"]