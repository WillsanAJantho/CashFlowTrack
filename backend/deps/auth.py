# deps/auth.py
from fastapi import Depends, HTTPException, status, Header
from typing import Optional
from sqlalchemy.orm import Session

from database import SessionLocal
import crud
from utils.jwt import decode_access_token

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    # Expect "Authorization: Bearer <token>"
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header")

    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    # sub can be user id (str) or email; we'll store user_id in token
    user_id = payload["sub"]
    user = crud.get_user_by_id(db, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user
