from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, UniqueConstraint, TIMESTAMP, Date, text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # plain password or hashed
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    transactions = relationship("Transaction", back_populates="user")

class PendingSignup(Base):
    __tablename__ = "pending_signups"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    verification_code = Column(String, nullable=False)
    expires_at = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    __table_args__ = (UniqueConstraint('email', name='uq_pending_email'),)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    receiver = Column(String, nullable=False)
    category = Column(String, nullable=False)
    amount = Column(BigInteger, nullable=False)
    source = Column(String)  # manual | receipt_scan
    date = Column(Date, nullable=False)  # ✅ NEW field
    created_at = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    user = relationship("User", back_populates="transactions")
