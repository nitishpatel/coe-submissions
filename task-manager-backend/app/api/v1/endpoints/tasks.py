from __future__ import annotations
from fastapi import APIRouter, HTTPException, status, Depends,Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import date

from app.api.deps import DB,current_user,pagination_params
from app.services.task import TaskService
from app.core.utils import get_or_404
from app.schemas.task import TaskFilter,TaskSortBy,TaskStatus,TaskCreate, TaskUpdate, TaskRead
from app.schemas.common import SortOrder,DateRange,PaginationParams


router = APIRouter(tags=["tasks"])


def task_filter_params(
    task_status: TaskStatus | None = Query(None),
    sort_by: TaskSortBy | None = Query(None),
    order: SortOrder = Query(SortOrder.ASC),
    date_from: date | None = Query(None, alias="date_from"),
    date_to: date | None = Query(None, alias="date_to"),
) -> TaskFilter:
    date_range = None
    if date_from or date_to:
        date_range = DateRange(date_from=date_from, date_to=date_to)
    return TaskFilter(
        status=task_status,
        sort_by=sort_by,
        order=order,
        date_range=date_range,
    )



def get_task_service() -> TaskService:
    return TaskService()

@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: DB,user=Depends(current_user),service: TaskService = Depends(get_task_service)):
    return service.create(db, payload)

@router.get("/{task_id}", response_model=TaskRead)
def get_task(task_id: str, db: DB,user=Depends(current_user),service: TaskService = Depends(get_task_service)):
    return get_or_404(service.get(db, task_id), detail="Task not found")


@router.get("", response_model=list[TaskRead],)
def list_tasks(db: DB,user=Depends(current_user),pagination:PaginationParams=Depends(pagination_params),filters=Depends(task_filter_params),service: TaskService = Depends(get_task_service)):
    if filters and filters.date_range:
            if not filters.date_range.is_valid():
                return JSONResponse(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    content={"detail": "Invalid date range: 'date_from' cannot be after 'date_to'."},
                )
    return service.list(db,limit=pagination.limit, offset=pagination.offset,filters=filters)

@router.patch("/{task_id}", response_model=TaskRead)
def update_task(task_id: str, payload: TaskUpdate, db: DB,user=Depends(current_user),service: TaskService = Depends(get_task_service)):
    return get_or_404(service.update(db, task_id, payload), detail="Task not found")


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: DB,user=Depends(current_user),service: TaskService = Depends(get_task_service)):
    return get_or_404(service.delete(db, task_id) or None, detail="Task not found")
