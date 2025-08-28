# app/repositories/task_repo.py
from __future__ import annotations
from typing import Protocol, Sequence
from sqlalchemy.orm import Session
from app.models.task import Task, TaskStatus

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

    def list(self, db: Session, *, limit: int, offset: int):
        return (
            db.query(Task)
            .order_by(Task.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )

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
