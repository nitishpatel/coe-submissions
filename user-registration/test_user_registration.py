import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_success_user_registration(client):
    response = client.post("/register", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "password123",
        "dob": "2000-01-01"
    })

    assert response.status_code == 201
    assert response.json() == {
        "id": 1,
        "username": "testuser",
        "email": "testuser@example.com",
        "dob": "2000-01-01"
    }
