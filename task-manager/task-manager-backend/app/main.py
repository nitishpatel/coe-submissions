# app/main.py
from __future__ import annotations
from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.middleware import setup_middlewares

app = FastAPI(title="Task Manager API", version="0.1.0")

setup_middlewares(app)
app.include_router(api_router, prefix="/api")
