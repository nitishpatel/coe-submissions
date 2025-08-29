import pytest
from app.schemas.user import UserSignUpRequest
from pydantic import ValidationError


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
    errors = exc_info.value.errors()
    assert errors[0]["loc"] == ("email",)
    assert errors[0]["type"] == "value_error"

def test_email_mandatory_field():
    with pytest.raises(ValidationError) as exc_info:
        UserSignUpRequest(
            full_name="Test User",
            password="StrongPassword123!"
        )
    errors = exc_info.value.errors()
    assert errors[0]["loc"] == ("email",)
    assert errors[0]["type"] == "missing"
