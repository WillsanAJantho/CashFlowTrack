from pydantic import BaseModel, EmailStr, validator
from datetime import datetime, date
from typing import Optional
import re

# -------- AUTH --------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# A slim version of user for login/response
class UserLite(BaseModel):
    id: int
    email: EmailStr

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserLite

# -------- USERS --------
class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @validator("password")
    def validate_password(cls, v):
        # Strong password: at least 8 chars, one uppercase, one lowercase, one number, one special char
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[@$!%*?&]", v):
            raise ValueError("Password must contain at least one special character (@$!%*?&)")
        return v

class UserUpdate(BaseModel):
    email: EmailStr
    old_password: str   # ✅ required to verify before update
    new_password: str       # ✅ new password (must be strong)

    @validator("new_password")
    def validate_password(cls, v):
        # Strong password: at least 8 chars, one uppercase, one lowercase, one number, one special char
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[@$!%*?&]", v):
            raise ValueError("Password must contain at least one special character (@$!%*?&)")
        return v
    
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        orm_mode = True


# ---------- EMAIL VERIFICATION ----------
class RegisterStartRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterStartResponse(BaseModel):
    message: str

class RegisterVerifyRequest(BaseModel):
    email: EmailStr
    code: str

class RegisterVerifyResponse(BaseModel):
    message: str



# -------- TRANSACTIONS --------
# Shared fields
class TransactionBase(BaseModel):
    receiver: str
    category: str
    amount: int
    source: Optional[str] = None
    date: date


# Used when creating a transaction
class TransactionCreate(TransactionBase):
    pass


# Used when returning data from DB
class TransactionResponse(TransactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True  # Pydantic v2 replacement for orm_mode