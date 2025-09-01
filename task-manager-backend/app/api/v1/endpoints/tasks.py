from __future__ import annotations
from fastapi import APIRouter, HTTPException, status, Depends
from app.api.deps import DB,current_user,pagination_params
from app.schemas.task import TaskCreate, TaskUpdate, TaskRead
from app.services.task import TaskService
from app.schemas.common import PaginationParams
from app.core.utils import get_or_404

router = APIRouter(tags=["tasks"])

def get_task_service() -> TaskService:
    return TaskService()

@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: DB,user=Depends(current_user),service: TaskService = Depends(get_task_service)):
    return service.create(db, payload)

@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: str, db: DB,user=Depends(current_user),service: TaskService = Depends(get_task_service)):
    return get_or_404(service.get(db, task_id), detail="Task not found")


@router.get("", response_model=list[TaskRead],)
def list_tasks(db: DB,user=Depends(current_user),pagination:PaginationParams=Depends(pagination_params),service: TaskService = Depends(get_task_service)):
    return service.list(db,limit=pagination.limit, offset=pagination.offset)

@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: str, payload: TaskUpdate, db: DB,user=Depends(current_user),service: TaskService = Depends(get_task_service)):
    return get_or_404(service.update(db, task_id, payload), detail="Task not found")


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: DB,user=Depends(current_user),service: TaskService = Depends(get_task_service)):
    return get_or_404(service.delete(db, task_id) or None, detail="Task not found")
