from fastapi import HTTPException,status
from typing import Optional,TypeVar

T = TypeVar("T")

def get_or_404(obj: Optional[T], detail: str = "Not found") -> T:
    if obj is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)
    return obj