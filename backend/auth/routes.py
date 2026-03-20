from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import os

router = APIRouter()
USERS_FILE = "users.json"

class UserAuth(BaseModel):
    email: str
    password: str
    name: str = None

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

@router.post("/signup")
def signup(user: UserAuth):
    users = load_users()
    if any(u["email"] == user.email for u in users):
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = user.dict()
    users.append(new_user)
    save_users(users)
    return {"message": "user created", "user": {"name": user.name, "email": user.email}}

@router.post("/login")
def login(user: UserAuth):
    users = load_users()
    found_user = next((u for u in users if u["email"] == user.email and u["password"] == user.password), None)
    
    if not found_user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "token": "fake-jwt-token",
        "user": {"name": found_user.get("name", "User"), "email": found_user["email"]}
    }
