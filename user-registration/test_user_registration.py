import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_success_user_registration():
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

def test_username_mandatory():
    response = client.post("/register", json={
        "email": "testuser@example.com",
        "password": "password123",
        "dob": "2000-01-01"
    })

    assert response.status_code == 422
    response_json = response.json()
    assert response_json['errors']['username'][0]['code'] == 'required'
    assert response_json['errors']['username'][0]['message'] == 'Field required'

def test_username_min_max_length():
    response = client.post("/register", json={
        "username": "a",
        "email": "testuser@example.com",
        "password": "password123",
        "dob": "2000-01-01"
    })

    assert response.status_code == 422
    response_json = response.json()
    assert response_json['errors']['username'][0]['code'] == 'invalid'
    assert response_json['errors']['username'][0]['message'] == 'String should have at least 2 characters'

    response = client.post("/register", json={
        "username": "a" * 21,
        "email": "testuser@example.com",
        "password": "password123",
        "dob": "2000-01-01"
    })

    assert response.status_code == 422
    response_json = response.json()
    assert response_json['errors']['username'][0]['code'] == 'invalid'
    assert response_json['errors']['username'][0]['message'] == 'String should have at most 20 characters'


def test_email_mandatory():
    response = client.post("/register", json={
        "username": "testuser",
        "password": "password123",
        "dob": "2000-01-01"
    })

    assert response.status_code == 422
    response_json = response.json()
    assert response_json['errors']['email'][0]['code'] == 'required'
    assert response_json['errors']['email'][0]['message'] == 'Field required'


def test_invalid_email_format():
    response = client.post("/register", json={
        "username": "testuser",
        "email": "invalid-email",
        "password": "password123",
        "dob": "2000-01-01"
    })

    assert response.status_code == 422
    response_json = response.json()
    assert response_json['errors']['email'][0]['code'] == 'invalid'
    assert response_json['errors']['email'][0]['message'] == 'value is not a valid email address: An email address must have an @-sign.'


def test_password_mandatory():
    response = client.post("/register", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "dob": "2000-01-01"
    })

    assert response.status_code == 422
    response_json = response.json()
    assert response_json['errors']['password'][0]['code'] == 'required'
    assert response_json['errors']['password'][0]['message'] == 'Field required'

def test_password_min_max_length():
    response = client.post("/register", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "pass",
        "dob": "2000-01-01"
    })

    assert response.status_code == 422
    response_json = response.json()
    assert response_json['errors']['password'][0]['code'] == 'invalid'
    assert response_json['errors']['password'][0]['message'] == 'String should have at least 8 characters'

    response = client.post("/register", json={
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "a" * 21,
        "dob": "2000-01-01"
    })

    assert response.status_code == 422
    response_json = response.json()
    assert response_json['errors']['password'][0]['code'] == 'invalid'
    assert response_json['errors']['password'][0]['message'] == 'String should have at most 20 characters'