from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

import models, schemas
from database import get_db
from core.security import get_current_user  # ✅ JWT dependency

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
)


# ---------------- CREATE ----------------
@router.post("/", response_model=schemas.TransactionResponse)
def create_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    new_tx = models.Transaction(
        user_id=user["id"],  # from JWT
        receiver=transaction.receiver,
        category=transaction.category,
        amount=transaction.amount,
        source=transaction.source,
        date=transaction.date,
    )
    db.add(new_tx)
    db.commit()
    db.refresh(new_tx)
    return new_tx


# ---------------- READ (all for current user) ----------------
@router.get("/", response_model=List[schemas.TransactionResponse])
def get_transactions(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    txs = db.query(models.Transaction).filter(models.Transaction.user_id == user["id"]).all()
    return txs


# ---------------- READ (by ID) ----------------
@router.get("/{transaction_id}", response_model=schemas.TransactionResponse)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    tx = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.user_id == user["id"]
    ).first()

    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    return tx


# ---------------- UPDATE ----------------
@router.put("/{transaction_id}", response_model=schemas.TransactionResponse)
def update_transaction(
    transaction_id: int,
    updated_tx: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    tx = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.user_id == user["id"]
    ).first()

    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    tx.receiver = updated_tx.receiver
    tx.category = updated_tx.category
    tx.amount = updated_tx.amount
    tx.source = updated_tx.source
    tx.date = updated_tx.date

    db.commit()
    db.refresh(tx)
    return tx


# ---------------- DELETE ----------------
@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    tx = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.user_id == user["id"]
    ).first()

    if not tx:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    db.delete(tx)
    db.commit()
    return None
