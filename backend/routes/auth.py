# routes/auth.py
# from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
# from sqlalchemy.orm import Session
# from fastapi.security import OAuth2PasswordRequestForm
# from datetime import datetime, timedelta

# from database import SessionLocal
# import schemas, crud
# from mail import send_verification_email
# from core.security import create_access_token, verify_access_token
# from fastapi.security import OAuth2PasswordBearer

# router = APIRouter(prefix="/auth", tags=["Auth"])

# # ---------- DB Dependency ----------
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# # ---------- JWT Setup ----------
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     payload = verify_access_token(token)
#     if not payload:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid or expired token",
#         )

#     user_id: str = payload.get("sub")
#     user = crud.get_user_by_id(db, int(user_id))
#     if not user:
#         raise HTTPException(status_code=401, detail="User not found")
#     return user

# # ---------- Register (Step 1: Start) ----------
# @router.post("/register-start", response_model=schemas.RegisterStartResponse)
# async def register_start(payload: schemas.RegisterStartRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
#     if crud.get_user_by_email(db, payload.email):
#         raise HTTPException(status_code=400, detail="Email is already in use")

#     hashed = crud.hash_password(payload.password)
#     pending = crud.create_pending_signup(db, email=payload.email, hashed_password=hashed, ttl_minutes=10)

#     background_tasks.add_task(send_verification_email, payload.email, pending.verification_code)

#     return {"message": "Verification code sent to your email"}

# # ---------- Register (Step 2: Verify) ----------
# @router.post("/register-verify", response_model=schemas.RegisterVerifyResponse)
# def register_verify(payload: schemas.RegisterVerifyRequest, db: Session = Depends(get_db)):
#     pending = crud.get_pending_by_email(db, payload.email)
#     if not pending:
#         raise HTTPException(status_code=400, detail="No pending verification for this email")

#     if pending.expires_at < datetime.utcnow():
#         crud.delete_pending(db, payload.email)
#         raise HTTPException(status_code=400, detail="Verification code expired. Please restart signup.")

#     if pending.verification_code != payload.code.strip():
#         raise HTTPException(status_code=400, detail="Incorrect verification code")

#     user = crud.create_user_from_pending(db, pending.email, pending.hashed_password)
#     crud.delete_pending(db, payload.email)

#     return {"message": "Email verified. Account created successfully."}

# # ---------- Register (Resend Code) ----------
# @router.post("/register-resend", response_model=schemas.RegisterStartResponse)
# async def register_resend(payload: schemas.RegisterStartRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
#     if crud.get_user_by_email(db, payload.email):
#         raise HTTPException(status_code=400, detail="Email already registered")

#     hashed = crud.hash_password(payload.password)
#     pending = crud.create_pending_signup(db, email=payload.email, hashed_password=hashed, ttl_minutes=10)
#     background_tasks.add_task(send_verification_email, payload.email, pending.verification_code)

#     return {"message": "A new verification code has been sent"}

# # ---------- Login (with JWT) ----------
# # @router.post("/login")
# # def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
# #     user = crud.get_user_by_email(db, email=form_data.username)
# #     if not user or not crud.verify_password(form_data.password, user.password):
# #         raise HTTPException(status_code=401, detail="Invalid credentials")

# #     token = create_access_token(data={"sub": str(user.id)})
# #     return {
# #         "access_token": token,
# #         "token_type": "bearer",
# #         "user": {"id": user.id, "email": user.email},
# #     }

# @router.post("/login")
# def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, payload.email)
#     if not db_user or not crud.verify_password(payload.password, db_user.password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     token = create_access_token({"sub": str(db_user.id)})
#     return {
#         "id": db_user.id,
#         "email": db_user.email,
#         "access_token": token,
#         "token_type": "bearer"
#     }

# # ---------- Protected Example ----------
# @router.get("/me", response_model=schemas.UserResponse)
# def read_me(current_user=Depends(get_current_user)):
#     return current_user

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime

from database import SessionLocal
import schemas, crud
from mail import send_verification_email
from core.security import create_access_token, verify_access_token
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

# ---------- DB Dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------- JWT Setup ----------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user_id: int = payload.get("id")   # ✅ match with security.py
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# ---------- Register (Step 1: Start) ----------
@router.post("/register-start", response_model=schemas.RegisterStartResponse)
async def register_start(payload: schemas.RegisterStartRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, payload.email):
        raise HTTPException(status_code=400, detail="Email is already in use")

    hashed = crud.hash_password(payload.password)
    pending = crud.create_pending_signup(db, email=payload.email, hashed_password=hashed, ttl_minutes=10)

    background_tasks.add_task(send_verification_email, payload.email, pending.verification_code)

    return {"message": "Verification code sent to your email"}

# ---------- Register (Step 2: Verify) ----------
@router.post("/register-verify", response_model=schemas.RegisterVerifyResponse)
def register_verify(payload: schemas.RegisterVerifyRequest, db: Session = Depends(get_db)):
    pending = crud.get_pending_by_email(db, payload.email)
    if not pending:
        raise HTTPException(status_code=400, detail="No pending verification for this email")

    if pending.expires_at < datetime.utcnow():
        crud.delete_pending(db, payload.email)
        raise HTTPException(status_code=400, detail="Verification code expired. Please restart signup.")

    if pending.verification_code != payload.code.strip():
        raise HTTPException(status_code=400, detail="Incorrect verification code")

    user = crud.create_user_from_pending(db, pending.email, pending.hashed_password)
    crud.delete_pending(db, payload.email)

    return {"message": "Email verified. Account created successfully."}

# ---------- Register (Resend Code) ----------
@router.post("/register-resend", response_model=schemas.RegisterStartResponse)
async def register_resend(payload: schemas.RegisterStartRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, payload.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = crud.hash_password(payload.password)
    pending = crud.create_pending_signup(db, email=payload.email, hashed_password=hashed, ttl_minutes=10)
    background_tasks.add_task(send_verification_email, payload.email, pending.verification_code)

    return {"message": "A new verification code has been sent"}

# ---------- Login (with JWT) ----------
# @router.post("/login", response_model=schemas.TokenResponse)
# def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, payload.email)
#     if not db_user or not crud.verify_password(payload.password, db_user.password):
#         raise HTTPException(status_code=401, detail="Invalid credentials")

#     # ✅ Consistent payload with security.py
#     token = create_access_token({"id": db_user.id, "email": db_user.email})

#     return {
#         "access_token": token,
#         "token_type": "bearer",
#         "user": {"id": db_user.id, "email": db_user.email}
#     }

@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, payload.email)
    if not db_user or not crud.verify_password(payload.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # ✅ Create JWT
    token = create_access_token({"id": db_user.id, "email": db_user.email})

    # ✅ Return only serializable data
    return JSONResponse(content={
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": db_user.id, "email": db_user.email}
    })

# ---------- Protected Example ----------
@router.get("/me", response_model=schemas.UserResponse)
def read_me(current_user=Depends(get_current_user)):
    return current_user
