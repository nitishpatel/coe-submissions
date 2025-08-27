from fastapi import FastAPI
from pydantic import BaseModel,StringConstraints
from typing_extensions import Annotated
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/movie/")
def create_movie(movie: dict):
    return {"movie": movie}

@app.put("/movie/{movie_id}")
def update_movie(movie_id: int, movie: dict):
    return {"movie_id": movie_id, "movie": movie}

@app.delete("/movie/{movie_id}")
def delete_movie(movie_id: int):
    return {"message": f"Movie with ID {movie_id} deleted"}

# Path Parameters
@app.get("/movie/{movie_id}/")
def read_movie(movie_id: int):
    return {"movie_id": movie_id, "title": "Inception", "director": "Christopher Nolan"}

# Query Parameters
@app.get("/movie/")
def read_movies(director: str = None):
    if director:
        return {"movies": [{"id": 1, "title": "Inception", "director": director}]}
    return {"movies": [{"id": 1, "title": "Inception", "director": "Christopher Nolan"}]}

# Path and Query Parameters
@app.get("/get-movie/{movie_id}/")
def get_movie(movie_id: int, director: str = None):
    if director:
        return {"movie_id": movie_id, "title": "Inception", "director": director}
    return {"movie_id": movie_id, "title": "Inception", "director": "Christopher Nolan"}


VALIDATED_STR = Annotated[
    str,
    StringConstraints(min_length=2, max_length=20)
]

class Movie(BaseModel):
    title: VALIDATED_STR
    director: VALIDATED_STR

@app.post("/movie-validation/")
def validate_movie(movie: Movie):
    return {"movie": movie}

async def pydantic_validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": [{"msg": "Field required", "type": "value_error.missing"}]},
    )
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import uuid

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

app.add_exception_handler(RequestValidationError, pydantic_validation_exception_handler)
