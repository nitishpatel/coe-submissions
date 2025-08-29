import bcrypt
from typing import Protocol
from dataclasses import dataclass
from sqlalchemy.exc import IntegrityError
from app.repositories.user import UserRepository, SqlAlchemyUserRepository
from app.schemas.user import UserSignUpRequest, UserRead
from app.services.password import PasswordHasher, BcryptPasswordHasher


class DuplicateEmailError(ValueError):
    pass


@dataclass(slots=True)
class AuthService:
    repo: UserRepository
    hasher: PasswordHasher

    def __init__(self, repo: UserRepository | None = None, hasher: PasswordHasher | None = None):
        self.repo = repo or SqlAlchemyUserRepository()
        self.hasher = hasher or BcryptPasswordHasher()

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
