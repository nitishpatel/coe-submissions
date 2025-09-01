from pydantic import BaseModel
from datetime import date
from enum import Enum

class PaginationParams(BaseModel):
    offset: int = 0
    limit: int = 10

    @property
    def skip(self) -> int:
        return self.offset
    @property
    def page_size(self) -> int:
        return self.limit

class SortOrder(str,Enum):
    ASC = "asc"
    DESC = "desc"

class DateRange(BaseModel):
    date_from: date | None = None
    date_to: date | None = None

    def is_valid(self) -> bool:
        if self.date_from and self.date_to:
            return self.date_from <= self.date_to
        return True