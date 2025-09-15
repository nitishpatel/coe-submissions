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

def test_full_name_non_mandatory_field():
    user = UserSignUpRequest(
        email="test@example.in",
        password="StrongPassword123!"
    )
    assert user.email == "test@example.in"
    assert user.full_name is None
    assert user.password == "StrongPassword123!"

def test_password_minimum_length():
    with pytest.raises(ValidationError) as exc_info:
        UserSignUpRequest(
            email="test@example.in",
            full_name="Test User",
            password="123"
        )
    errors = exc_info.value.errors()
    assert errors[0]["loc"] == ("password",)
    assert errors[0]["type"] == "string_too_short"

def test_password_maximum_length():
    long_password = "A" * 27
    with pytest.raises(ValidationError) as exc_info:
        UserSignUpRequest(
            email="test@example.in",
            full_name="Test User",
            password=long_password
        )
    errors = exc_info.value.errors()
    assert errors[0]["loc"] == ("password",)
    assert errors[0]["type"] == "string_too_long"

def test_password_min_1_digit_and_special_character():
    password = "Password"
    with pytest.raises(ValidationError) as exc_info:
        UserSignUpRequest(
            email="test@example.com",
            full_name="Test User",
            password=password
        )
    errors = exc_info.value.errors()
    assert errors[0]["loc"] == ("password",)
    assert errors[0]["type"] == "value_error"

    password = "Password1"
    with pytest.raises(ValidationError) as exc_info:
        UserSignUpRequest(
            email="test@example.com",
            full_name="Test User",
            password=password
        )
    errors = exc_info.value.errors()
    assert errors[0]["loc"] == ("password",)
    assert errors[0]["type"] == "value_error"

    password = "Password!"
    with pytest.raises(ValidationError) as exc_info:
        UserSignUpRequest(
            email="test@exmaple.com",
            full_name="Test User",
            password=password
        )
    errors = exc_info.value.errors()
    assert errors[0]["loc"] == ("password",)
    assert errors[0]["type"] == "value_error"
    password = "Password1!"
    user = UserSignUpRequest(
        email="test@example.co",
        full_name="Test User",
        password=password
    )
    assert user.email == "test@example.co"
    assert user.full_name == "Test User"
    assert user.password == "Password1!"
