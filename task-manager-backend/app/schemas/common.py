from pydantic import BaseModel

class PaginationParams(BaseModel):
    offset: int = 0
    limit: int = 10

    @property
    def skip(self) -> int:
        return self.offset
    @property
    def page_size(self) -> int:
        return self.limit