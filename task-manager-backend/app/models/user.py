from uuid import uuid4
from datetime import datetime

from sqlalchemy import func,String,Text,Index,UniqueConstraint

from sqlalchemy.orm import Mapped,mapped_column
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
        nullable=False,
    )

    email : Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    full_name : Mapped[str | None] = mapped_column(String(255), nullable=True)
    hashed_password : Mapped[str] = mapped_column(Text(), nullable=False)
    is_active : Mapped[bool] = mapped_column(nullable=False, default=True)
    is_superuser : Mapped[bool] = mapped_column(nullable=False, default=False)
    created_at : Mapped[datetime] = mapped_column(
        nullable=False,
        server_default=func.now(),
    )
    updated_at : Mapped[datetime] = mapped_column(
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email!r} is_active={self.is_active}>"

    __table_args__ = (
        UniqueConstraint('email', name='uq_user_email'),
        Index('ix_user_email', 'email'),
    )
