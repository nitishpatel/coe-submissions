from __future__ import annotations
from typing import Generator, Annotated
from fastapi import Depends, Header, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.jwt import JWTService
from app.repositories.user import SqlAlchemyUserRepository

DB = Annotated[Session, Depends(get_db)]

def get_jwt_service() -> JWTService:
    return JWTService()

def get_bearer_token(
    authorization: str | None = Header(default=None),
) -> str:
    if authorization is None or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing authorization token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return authorization[len("Bearer ") :]

def get_user_repo() -> SqlAlchemyUserRepository:
    return SqlAlchemyUserRepository()

def current_user(
    db: DB,
    token: str = Depends(get_bearer_token),
    jwt_service: JWTService = Depends(get_jwt_service),
    user_repo: SqlAlchemyUserRepository = Depends(get_user_repo)
):
    try:
        payload = jwt_service.decode(token)
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )  from e

    user = user_repo.get(db, user_id=user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def pagination_params(
        skip: int = Query(0, ge=0),
        limit: int = Query(10, ge=1, le=100)
    ) -> dict[str, int]:
    return {"skip": skip, "limit": limit}