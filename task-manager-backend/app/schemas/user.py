from pydantic import BaseModel,EmailStr,ConfigDict

class UserSignUpRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str