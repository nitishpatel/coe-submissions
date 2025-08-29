from pydantic import BaseModel,EmailStr,ConfigDict,Field

class UserSignUpRequest(BaseModel):
    email: EmailStr
    full_name: str | None = None
    password: str = Field(...,min_length=8,max_length=26)
