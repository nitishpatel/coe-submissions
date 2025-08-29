import pytest
from app.schemas.user import UserRead

@pytest.fixture
def user_signup(client):
    def _user_signup(email="test@example.in", full_name="Test User", password="securepassword123!"):
        response = client.post("/api/v1/auth/signup", json={"email": email, "full_name": full_name, "password": password})
        return response
    return _user_signup

def test_user_signup_api(client, user_signup):
    response = user_signup(email="test1@example.in")
    assert response.status_code == 201
    assert UserRead.model_validate(response.json())
    assert response.json()["email"] == "test1@example.in"
