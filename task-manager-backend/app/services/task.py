from __future__ import annotations
from sqlalchemy.orm import Session
from app.schemas.task import TaskCreate, TaskUpdate, TaskRead,TaskFilter
from app.repositories.task import TaskRepository, SqlAlchemyTaskRepository
from app.models.task import Task

class TaskService:
    def __init__(self, repo: TaskRepository | None = None):
        self.repo = repo or SqlAlchemyTaskRepository()

    def create(self, db: Session, data: TaskCreate) -> TaskRead:
        task = self.repo.create(db, title=data.title, description=data.description, status=data.status)
        return TaskRead.model_validate(task)

    def get(self, db: Session, task_id: str) -> TaskRead | None:
        t = self.repo.get(db, task_id)
        return TaskRead.model_validate(t) if t else None

    def list(self, db: Session, limit: int = 20, offset: int = 0,filters:TaskFilter|None=None) -> list[TaskRead]:
        tasks = self.repo.list(db, limit=limit, offset=offset,filters=filters)
        return [TaskRead.model_validate(t) for t in tasks]

    def update(self, db: Session, task_id: str, data: TaskUpdate) -> TaskRead | None:
        t: Task | None = self.repo.get(db, task_id)
        if not t:
            return None
        t = self.repo.update(db, t, title=data.title, description=data.description, status=data.status)
        return TaskRead.model_validate(t)

    def delete(self, db: Session, task_id: str) -> bool:
        t = self.repo.get(db, task_id)
        if not t:
            return False
        self.repo.delete(db, t)
        return True
