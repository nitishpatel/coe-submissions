import pytest
from app.schemas.task import TaskRead

@pytest.fixture
def make_task(client):
    def _make_task(title="Test Task", description="Test Description"):
        response = client.post("/api/v1/tasks", json={"title": title, "description": description})
        return response
    return _make_task

def test_task_create_api(client, make_task):
    response = make_task()
    assert response.status_code == 201
    assert response.json()["title"] == "Test Task"

def test_task_list_api(client, make_task):
    make_task()
    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert isinstance(response.json(), list)

    for i in range(3):
        make_task(title=f"Task {i}")

    response = client.get("/api/v1/tasks")
    assert response.status_code == 200
    assert len(response.json()) == 4
    assert isinstance(response.json(), list)

def test_task_update_api(client,make_task):
    make_task()
    task = client.get("/api/v1/tasks").json()[0]
    update_response = client.patch(f"/api/v1/tasks/{task['id']}", json={"title": "Updated Task", "description": "Updated Description"})
    assert update_response.status_code == 200
    assert update_response.json()["title"] == "Updated Task"


def test_task_delete_api(client, make_task):
    make_task()
    task = client.get("/api/v1/tasks").json()[0]
    delete_response = client.delete(f"/api/v1/tasks/{task['id']}")
    assert delete_response.status_code == 204
