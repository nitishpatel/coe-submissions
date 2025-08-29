import pytest
from app.schemas.user import UserSignUpRequest

def test_successful_user_signup():
    user = UserSignUpRequest(
        email="test@example.in",
        full_name="Test User",
        password="StrongPassword123!"
    )
    assert user.email == "test@example.in"
    assert user.full_name == "Test User"
    assert user.password == "StrongPassword123!"


