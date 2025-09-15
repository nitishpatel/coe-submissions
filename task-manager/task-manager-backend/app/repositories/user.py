from typing import Protocol, Sequence
from sqlalchemy.orm import Session
from app.models.user import User


class UserRepository(Protocol):
    def create(self, db: Session, *, email: str, full_name: str |
               None, hashed_password: str) -> User: ...

    def get(self, db: Session, user_id: str) -> User | None: ...
    def get_by_email(self, db: Session, email: str) -> User | None: ...


class SqlAlchemyUserRepository(
    UserRepository,
):
    def create(self, db: Session, *, email: str, full_name: str | None, hashed_password: str) -> User:
        user = User(
            email=email,
            full_name=full_name,
            hashed_password=hashed_password,
        )
        db.add(user)
        db.flush()
        return user

    def get(self, db: Session, user_id: str) -> User | None:
        return db.get(User, user_id)

    def get_by_email(self, db: Session, email: str) -> User | None:
        return db.query(User).filter(User.email == email).first()
