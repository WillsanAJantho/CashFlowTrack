# # core/security.py
# from datetime import datetime, timedelta
# from jose import jwt, JWTError
# from passlib.context import CryptContext
# import os

# # Load secret key from env or fallback
# SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 60

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def get_password_hash(password: str) -> str:
#     return pwd_context.hash(password)

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     return pwd_context.verify(plain_password, hashed_password)

# def create_access_token(data: dict, expires_delta: timedelta = None):
#     """Generate a new JWT access token"""
#     to_encode = data.copy()
#     expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# def verify_access_token(token: str):
#     """Decode and validate JWT access token"""
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id: str = payload.get("sub")
#         if user_id is None:
#             raise JWTError("Token missing subject")
#         return user_id
#     except JWTError:
#         return None

# core/security.py

# backend/core/security.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import os

# 🔑 JWT Config
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme → matches tokenUrl in your auth routes
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ---- Token Schema ----
class TokenData(BaseModel):
    id: int | None = None
    email: str | None = None

# ---- Create Access Token ----
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Generates a JWT token with id + email inside payload
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ---- Verify Token ----
def verify_access_token(token: str, credentials_exception):
    """
    Decodes and validates JWT. Returns dict with user info.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        email: str = payload.get("email")
        if user_id is None or email is None:
            raise credentials_exception
        return {"id": user_id, "email": email}
    except JWTError:
        raise credentials_exception

# ---- Dependency to use in routes ----
def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency for protected routes.
    Usage: user: dict = Depends(get_current_user)
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return verify_access_token(token, credentials_exception)

