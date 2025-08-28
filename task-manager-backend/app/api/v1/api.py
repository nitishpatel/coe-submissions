from fastapi import APIRouter, Depends
from app.api.v1.endpoints import tasks

api_router = APIRouter(prefix="/v1")

api_router.include_router(tasks.router, prefix="/tasks")
