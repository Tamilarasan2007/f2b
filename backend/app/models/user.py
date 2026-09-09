from sqlalchemy import Column, Integer, String, Boolean, Index
from app.database.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20), nullable=True)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # FARMER, DRIVER, BUYER, COLLECTION_POINT_OPERATOR, ADMIN
    is_active = Column(Boolean, default=True)

    __table_args__ = (
        Index("ix_users_role", "role"),
    )
