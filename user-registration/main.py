from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field,field_validator
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import uuid
import re
app = FastAPI()


def _normalize_errors(items: list[dict]) -> dict[str, list[dict]]:
    # Convert Pydantic’s “loc/type/msg” to a UI-friendly map
    def field_from_loc(loc):
        # drop transport layers like "body", "query", "path"
        parts = [str(p) for p in loc if p not in ("body", "query", "path")]
        return ".".join(parts) or "non_field_errors"

    CODE_MAP = {
        "missing": "required",
        "value_error.missing": "required",             # Pydantic v1
        "string_type": "invalid_type",
        "int_type": "invalid_type",
        "none_required": "required",
    }

    out: dict[str, list[dict]] = {}
    for e in items:
        field = field_from_loc(e.get("loc", []))
        code = CODE_MAP.get(e.get("type", ""), "invalid")
        msg = e.get("msg", "Invalid value.")
        out.setdefault(field, []).append({"code": code, "message": msg})
    return out


async def pydantic_validation_exception_handler(request, exc: RequestValidationError):
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    payload = {
        "title": "Request validation failed",
        "status": 422,
        "request_id": request_id,
        "errors": _normalize_errors(exc.errors()),
    }
    return JSONResponse(payload, status_code=422, media_type="application/problem+json")

app.add_exception_handler(RequestValidationError,
                          pydantic_validation_exception_handler)


# In Memory DB
users_db = []

_digit_re = re.compile(r"\d")
_special_re = re.compile(r"[^A-Za-z0-9]")

class User(BaseModel):
    username: str = Field(..., min_length=2, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=20,
                          description="8-20 chars, must include at least one number and one special character",)
    dob: str

    @field_validator("password")
    @classmethod
    def password_policy(cls, v: str) -> str:
        # length is already enforced by Field, but guard anyway if you want custom msgs
        if len(v) < 8 or len(v) > 20:
            raise ValueError("Password must be 8–20 characters long")
        if not _digit_re.search(v):
            raise ValueError("Password must include at least one number")
        if not _special_re.search(v):
            raise ValueError("Password must include at least one special character")
        return v

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    dob: str


@app.post("/register", response_model=UserResponse, status_code=201)
def register_user(user: User):
    user_id = len(users_db) + 1
    users_db.append({**user.model_dump(), "id": user_id})
    return UserResponse(**users_db[-1])
