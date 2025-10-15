# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# import schemas, crud
# from database import SessionLocal
# import random


# router = APIRouter(prefix="/users", tags=["Users"])

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # @router.post("/", response_model=schemas.UserResponse)
# # def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
# #     db_user = crud.get_user_by_email(db, email=user.email)
# #     if db_user:
# #         raise HTTPException(status_code=400, detail="Email already registered")
# #     return crud.create_user(db=db, user=user)

# @router.post("/", response_model=schemas.UserResponse)
# def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=user.email)
#     if db_user:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     new_user = crud.create_user(db=db, user=user)
#     new_user.is_verified = False
#     db.commit()

#     # Generate verification code
#     code = str(random.randint(100000, 999999))
#     crud.save_verification_code(db, new_user.id, code)

#     # Send email
#     send_email(user.email, code)

#     return {"message": "Verification code sent", "user_id": new_user.id}

# @router.post("/verify")
# def verify_user(data: dict, db: Session = Depends(get_db)):
#     user_id = data["user_id"]
#     code = data["code"]

#     if not crud.verify_code(db, user_id, code):
#         raise HTTPException(status_code=400, detail="Invalid or expired code")

#     user = crud.get_user_by_id(db, user_id)
#     user.is_verified = True
#     db.commit()
#     return {"message": "Account verified successfully!"}



# @router.post("/login")
# def login(user: dict, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=user["email"])
#     if not db_user or not crud.verify_password(user["password"], db_user.password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     return {
#         "id": db_user.id,
#         "email": db_user.email,
#         "access_token": "fake-jwt-token",  # later replace with real JWT
#         "token_type": "bearer"
#     }

# @router.put("/{user_id}", response_model=schemas.UserResponse)
# def update_user_route(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_id(db, user_id)
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")

#     # Verify old password if password change is requested
#     if user_update.new_password:
#         if not crud.verify_password(user_update.old_password, db_user.password):
#             raise HTTPException(status_code=400, detail="Old password is incorrect")

#     updated_user = crud.update_user(db, user_id, user_update)
#     return updated_user

# routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import schemas, crud
from core.security import create_access_token, verify_access_token
from datetime import timedelta
import random
from mail import send_verification_email
from fastapi import BackgroundTasks

router = APIRouter(prefix="/users", tags=["Users"])

# Dependency to get DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- REGISTER ----------
@router.post("/", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = crud.create_user(db=db, user=user)
    new_user.is_verified = False
    db.commit()

    # Generate verification code
    code = str(random.randint(100000, 999999))
    crud.save_verification_code(db, new_user.id, code)

    # Send verification email
    background_tasks.add_task(send_verification_email, user.email, code)

    return {"message": "Verification code sent", "user_id": new_user.id}


# ---------- VERIFY ----------
@router.post("/verify")
def verify_user(data: dict, db: Session = Depends(get_db)):
    user_id = data["user_id"]
    code = data["code"]

    if not crud.verify_code(db, user_id, code):
        raise HTTPException(status_code=400, detail="Invalid or expired code")

    user = crud.get_user_by_id(db, user_id)
    user.is_verified = True
    db.commit()
    return {"message": "Account verified successfully!"}


# ---------- LOGIN ----------
@router.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user["email"])
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not crud.verify_password(user["password"], db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not getattr(db_user, "is_verified", False):
        raise HTTPException(status_code=403, detail="Account not verified")

    # Create JWT token
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": str(db_user.id)}, expires_delta=access_token_expires
    )

    return {
        "id": db_user.id,
        "email": db_user.email,
        "access_token": access_token,
        "token_type": "bearer"
    }


# ---------- UPDATE ----------
@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user_route(user_id: int, user_update: schemas.UserUpdate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify old password if password change is requested
    if user_update.new_password:
        if not crud.verify_password(user_update.old_password, db_user.password):
            raise HTTPException(status_code=400, detail="Old password is incorrect")

    updated_user = crud.update_user(db, user_id, user_update)
    return updated_user
