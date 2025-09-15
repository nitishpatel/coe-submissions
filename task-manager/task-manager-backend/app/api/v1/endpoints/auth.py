from fastapi import APIRouter, Depends, HTTPException, status
from app.services.auth import AuthService
from app.api.deps import DB
from app.schemas.user import UserSignUpRequest, UserRead, UserLoginRequest, LoginResponse

router = APIRouter(tags=["auth"])

@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignUpRequest, db: DB):
    try:
        return AuthService().signup(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=LoginResponse)
def login(payload: UserLoginRequest, db: DB):
    login_reponse = AuthService().login(db, payload)
    if not login_reponse:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return login_reponse