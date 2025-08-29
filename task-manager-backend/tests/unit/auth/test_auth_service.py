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
