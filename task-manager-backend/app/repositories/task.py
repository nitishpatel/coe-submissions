# app/repositories/task_repo.py
from __future__ import annotations
from typing import Protocol, Sequence
from sqlalchemy.orm import Session
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskFilter
from sqlalchemy import asc, desc
from app.schemas.common import SortOrder
from datetime import datetime,time

class TaskRepository(Protocol):
    def create(self, db: Session, *, title: str, description: str | None, status: TaskStatus) -> Task: ...
    def get(self, db: Session, task_id: str) -> Task | None: ...
    def list(self, db: Session, *, limit: int, offset: int) -> Sequence[Task]: ...
    def update(self, db: Session, task: Task, *, title: str | None, description: str | None, status: TaskStatus | None) -> Task: ...
    def delete(self, db: Session, task: Task) -> None: ...

class SqlAlchemyTaskRepository:
    def create(self, db: Session, *, title: str, description: str | None, status: TaskStatus) -> Task:
        task = Task(title=title, description=description, status=status)
        db.add(task)
        db.flush()  # populate PK/timestamps
        return task

    def get(self, db: Session, task_id: str) -> Task | None:
        return db.get(Task, task_id)

    def list(self, db: Session, *, limit: int, offset: int, filters: TaskFilter | None = None):
        query = db.query(Task)

        if filters is not None:
            if filters.status:
                query = query.filter(Task.status == filters.status)
            if filters.date_range:
                if filters.date_range.date_from:
                    start = datetime.combine(filters.date_range.date_from, time.min)
                    query = query.filter(Task.created_at >= start)
                if filters.date_range.date_to:
                    end = datetime.combine(filters.date_range.date_to, time.max)
                    query = query.filter(Task.created_at <= end)

        else:
            # default sort if no filters
            query = query.order_by(Task.created_at.desc())

        return query.offset(offset).limit(limit).all()


    def update(self, db: Session, task: Task, *, title: str | None, description: str | None, status: TaskStatus | None) -> Task:
        if title is not None:
            task.title = title
        if description is not None:
            task.description = description
        if status is not None:
            task.status = status
        db.flush()
        return task

    def delete(self, db: Session, task: Task) -> None:
        db.delete(task)
        db.flush()
