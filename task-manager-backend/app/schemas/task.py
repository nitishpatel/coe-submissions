from pydantic import BaseModel, Field,ConfigDict
from datetime import datetime
from app.models.task import TaskStatus
from enum import Enum
from app.schemas.common import SortOrder,DateRange

class TaskBase(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = None
    status: TaskStatus = TaskStatus.TODO

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    description: str | None = None
    status: TaskStatus | None = None

class TaskRead(TaskBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TaskSortBy(str, Enum):
    CREATED_AT = "created_at"
    STATUS = "status"
class TaskFilter(BaseModel):
    status: TaskStatus | None = None
    sort_by:  TaskSortBy | None = None
    order: SortOrder | None = SortOrder.ASC
    date_range: DateRange | None = None