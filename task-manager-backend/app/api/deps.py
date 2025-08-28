from __future__ import annotations
from typing import Generator, Annotated
from fastapi import Depends, Header, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db

DB = Annotated[Session, Depends(get_db)]