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


def test_invalid_email_user_signup():
    with pytest.raises(ValueError) as exc_info:
        UserSignUpRequest(
            email="invalid-email",
            full_name="Test User",
            password="StrongPassword123!"
        )
    assert "value is not a valid email address" in str(exc_info.value)