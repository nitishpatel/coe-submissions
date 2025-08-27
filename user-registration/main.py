from fastapi import FastAPI
from pydantic import BaseModel, EmailStr, Field
app = FastAPI()

# In Memory DB
users_db = []

class User(BaseModel):
    username: str
    email: str
    password: str
    dob: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    dob: str

@app.post("/register",response_model=UserResponse,status_code=201)
def register_user(user: User):
    user_id = len(users_db) + 1
    users_db.append({**user.model_dump(), "id": user_id})
    return UserResponse(**users_db[-1])