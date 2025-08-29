from pydantic import BaseModel,EmailStr,ConfigDict,Field,field_validator
import re

class UserSignUpRequest(BaseModel):
    email: EmailStr
    full_name: str | None = None
    password: str = Field(...,min_length=8,max_length=26)

    @field_validator('password')
    def validate_password(cls, value: str) -> str:
        if not re.search(r'[0-9]', value):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise ValueError('Password must contain at least one special character')
        return value