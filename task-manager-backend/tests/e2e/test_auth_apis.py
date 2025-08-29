import pytest
from app.schemas.user import UserRead,LoginResponse


@pytest.fixture
def user_signup(client):
    def _user_signup(email="test@example.in", full_name="Test User", password="securepassword123!"):
        response = client.post(
            "/api/v1/auth/signup", json={"email": email, "full_name": full_name, "password": password})
        return response
    return _user_signup


def test_user_signup_api(client, user_signup):
    response = user_signup(email="test1@example.in")
    assert response.status_code == 201
    assert UserRead.model_validate(response.json())
    assert response.json()["email"] == "test1@example.in"


def test_should_not_allow_duplicate_email_signup(client, user_signup):
    response1 = user_signup(email="test@example.com")
    assert response1.status_code == 201
    response2 = user_signup(email="test@example.com")
    assert response2.status_code == 400
    assert response2.json()["detail"] == "Email already exists"


def test_login_api_success(client, user_signup):
    email = "test@example.com"
    password = "securepassword123!"
    user_signup(email=email, password=password)
    response = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    assert LoginResponse.model_validate(response.json())
    assert response.json()["user"]["email"] == email