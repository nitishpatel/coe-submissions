import pytest
from app.services.jwt import JWTService
import jwt

@pytest.fixture
def jwt_service():
    return JWTService()

def test_jwt_encode_decode(jwt_service: JWTService):
    payload = {"user_id": "12345"}
    token = jwt_service.encode(payload)
    assert isinstance(token, str)
    decoded_payload = jwt_service.decode(token)
    assert decoded_payload["user_id"] == "12345"
    assert "exp" in decoded_payload

def test_jwt_expired_token(jwt_service: JWTService, monkeypatch):
    payload = {"user_id": "12345"}
    token = jwt_service.encode(payload)
    # Simulate token expiration by manipulating the system time
    monkeypatch.setattr("jwt.decode", lambda *args, **kwargs: (_ for _ in ()).throw(jwt.ExpiredSignatureError))
    with pytest.raises(ValueError) as exc_info:
        jwt_service.decode(token)
    assert str(exc_info.value) == "Token has expired"

def test_jwt_invalid_token(jwt_service: JWTService):
    invalid_token = "invalid.token.string"
    with pytest.raises(ValueError) as exc_info:
        jwt_service.decode(invalid_token)
    assert str(exc_info.value) == "Invalid token"
