import pytest
from app.services.auth import AuthService
from app.schemas.user import UserSignUpRequest,UserRead

@pytest.fixture
def auth_service():
    return AuthService(repo=None, hasher=None)

def test_signup(auth_service: AuthService, db):
    req = UserSignUpRequest(
        email="test@example.com",
        full_name="Test User",
        password="securepassword123!"
    )
    user = auth_service.signup(db, req)
    assert isinstance(user, UserRead)

def test_duplicate_email_signup(auth_service: AuthService, db):
    req = UserSignUpRequest(
        email="test@example.com",
        full_name="Test User",
        password="securepassword123!"
    )
    auth_service.signup(db, req)
    with pytest.raises(ValueError) as exc_info:
        auth_service.signup(db, req)
    assert str(exc_info.value) == "Email already exists"