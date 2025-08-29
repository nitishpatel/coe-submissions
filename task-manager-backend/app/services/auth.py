import bcrypt
from typing import Protocol
from dataclasses import dataclass
from sqlalchemy.exc import IntegrityError
from app.repositories.user import UserRepository, SqlAlchemyUserRepository
from app.schemas.user import UserSignUpRequest, UserRead, LoginResponse,UserLoginRequest
from app.services.password import PasswordHasher, BcryptPasswordHasher
from app.services.jwt import JWTService

class DuplicateEmailError(ValueError):
    pass


@dataclass(slots=True)
class AuthService:
    repo: UserRepository
    hasher: PasswordHasher
    jwt_service: JWTService


    def __init__(self, repo: UserRepository | None = None, hasher: PasswordHasher | None = None):
        self.repo = repo or SqlAlchemyUserRepository()
        self.hasher = hasher or BcryptPasswordHasher()
        self.jwt_service = JWTService()

    def signup(self, db, req: UserSignUpRequest):
        try:
            hashed_password = self.hasher.hash(req.password)
            email = req.email.lower()
            user = self.repo.create(
                db=db,
                email=email,
                full_name=req.full_name,
                hashed_password=hashed_password
            )
            db.commit()
        except IntegrityError as e:
            if "unique constraint" in str(e).lower():
                raise DuplicateEmailError("Email already exists") from e

        return UserRead.model_validate(user)

    def login(self, db, req:UserLoginRequest) -> UserRead | None:
        email = req.email.lower()
        user = self.repo.get_by_email(db=db, email=email)
        if user and self.hasher.verify(req.password, user.hashed_password):
            payload = {
                "user_id": user.id,
            }
            token = self.jwt_service.encode(payload)
            user.token = token
            response = {
                "user": UserRead.model_validate(user),
                "access_token": token,
                "token_type": "bearer"
            }
            return LoginResponse.model_validate(response)
        return None