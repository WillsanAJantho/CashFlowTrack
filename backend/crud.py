# from sqlalchemy.orm import Session
# import models, schemas
# from passlib.context import CryptContext

# # Setup password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # Users
# def create_user(db: Session, user: schemas.UserCreate):
#     hashed_password = pwd_context.hash(user.password)  # ✅ hash before saving
#     db_user = models.User(email=user.email, password=hashed_password)
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# def get_user_by_email(db: Session, email: str):
#     return db.query(models.User).filter(models.User.email == email).first()

# def get_user_by_id(db: Session, user_id: int):
#     return db.query(models.User).filter(models.User.id == user_id).first()

# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
#     db_user = db.query(models.User).filter(models.User.id == user_id).first()
#     if not db_user:
#         return None
    
#     # ✅ check old password before updating
#     if not verify_password(user_update.old_password, db_user.password):
#         raise ValueError("Old password is incorrect")

#     # Update email
#     db_user.email = user_update.email

#     # ✅ Hash the new password (schema ensures it’s strong)
#     hashed_password = pwd_context.hash(user_update.new_password)
#     db_user.password = hashed_password

#     db.commit()
#     db.refresh(db_user)
#     return db_user

from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext
from datetime import datetime, timedelta
import random

# Setup password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ---------- Pending Signup (for email verification) ----------
def create_pending_signup(db: Session, email: str, hashed_password: str, ttl_minutes: int = 10):
    """Create or replace a pending signup entry with verification code."""
    # Remove any existing pending signup for this email
    db.query(models.PendingSignup).filter(models.PendingSignup.email == email).delete()

    # Generate 6-digit code
    code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=ttl_minutes)

    pending = models.PendingSignup(
        email=email,
        hashed_password=hashed_password,
        verification_code=code,
        expires_at=expires_at,
    )
    db.add(pending)
    db.commit()
    db.refresh(pending)
    return pending

def get_pending_by_email(db: Session, email: str):
    """Fetch pending signup by email (if any)."""
    return db.query(models.PendingSignup).filter(models.PendingSignup.email == email).first()

def delete_pending(db: Session, email: str):
    """Delete pending signup for an email."""
    db.query(models.PendingSignup).filter(models.PendingSignup.email == email).delete()
    db.commit()

def create_user_from_pending(db: Session, email: str, hashed_password: str):
    """Move a verified pending signup into the real users table."""
    user = models.User(email=email, password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ---------- Users (existing flow) ----------
def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = hash_password(user.password)
    db_user = models.User(email=user.email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def update_user(db: Session, user_id: int, user_update: schemas.UserUpdate):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        return None

    # ✅ verify old password before updating
    if not verify_password(user_update.old_password, db_user.password):
        raise ValueError("Old password is incorrect")

    # Update email
    db_user.email = user_update.email

    # ✅ Hash the new password (validated in schema)
    hashed_password = hash_password(user_update.new_password)
    db_user.password = hashed_password

    db.commit()
    db.refresh(db_user)
    return db_user


# Transactions
def create_transaction(db: Session, transaction: schemas.TransactionCreate, user_id: int):
    db_txn = models.Transaction(user_id=user_id, **transaction.dict())
    db.add(db_txn)
    db.commit()
    db.refresh(db_txn)
    return db_txn

def get_transactions(db: Session, user_id: int):
    return db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()
