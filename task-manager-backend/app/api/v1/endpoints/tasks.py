from __future__ import annotations
from fastapi import APIRouter, HTTPException, status, Depends
from app.api.deps import DB,current_user,pagination_params
from app.schemas.task import TaskCreate, TaskUpdate, TaskRead
from app.services.task import TaskService
from app.schemas.common import PaginationParams

router = APIRouter(tags=["tasks"])

@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: DB,user=Depends(current_user)):
    return TaskService().create(db, payload)

@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: str, db: DB,user=Depends(current_user)):
    t = TaskService().get(db, task_id)
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    return t

@router.get("", response_model=list[TaskRead])
def list_tasks(db: DB,user=Depends(current_user),pagination:PaginationParams=Depends(pagination_params)):
    return TaskService().list(db,limit=pagination.limit, offset=pagination.offset)

@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: str, payload: TaskUpdate, db: DB,user=Depends(current_user)):
    t = TaskService().update(db, task_id, payload)
    if not t:
        raise HTTPException(status_code=404, detail="Task not found")
    return t

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: DB,user=Depends(current_user)):
    if not TaskService().delete(db, task_id):
        raise HTTPException(status_code=404, detail="Task not found")
