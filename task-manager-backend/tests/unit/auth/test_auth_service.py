import pytest
from app.services.auth import AuthService
from app.schemas.user import UserSignUpRequest,UserRead,LoginResponse,UserLoginRequest

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

def test_login_success(auth_service: AuthService, db):
    email = "test@example.com"
    password = "securepassword123!"
    sign_up_req = UserSignUpRequest(
        email=email,
        password=password,
    )
    auth_service.signup(db, sign_up_req)
    login_req = UserLoginRequest(
        email=email,
        password=password
    )
    response = auth_service.login(db, login_req)
    assert isinstance(response, LoginResponse)

def test_login_invalid_email(auth_service: AuthService, db):
    login_req = UserLoginRequest(
        email="user_not_exist@gmail.com",
        password="somepassword"
    )
    response = auth_service.login(db, login_req)
    assert response is None

def test_invalid_password(auth_service: AuthService, db):
    email = "test@example.in"
    password = "securepassword123!"
    sign_up_req = UserSignUpRequest(
        email=email,
        password=password,
    )
    auth_service.signup(db, sign_up_req)
    login_req = UserLoginRequest(
        email=email,
        password="wrongpassword"
    )
    response = auth_service.login(db, login_req)
    assert response is None
