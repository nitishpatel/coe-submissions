import jwt
from app.core.config import config
from datetime import datetime, timedelta

class JWTService:
    def __init__(self):
        self.secret_key = config.jwt_secret
        self.algorithm = config.jwt_algorithm

    def encode(self, payload: dict) -> str:
        to_encode = payload.copy()
        expire = datetime.now() + timedelta(minutes=30)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def decode(self, token: str) -> dict:
        try:
            return jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")