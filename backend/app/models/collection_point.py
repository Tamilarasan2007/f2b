from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class CollectionPoint(Base, TimestampMixin):
    __tablename__ = "collection_points"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    operator_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    address = Column(String(500), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    operator = relationship("User", backref="collection_points")
