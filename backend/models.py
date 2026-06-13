from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Enum, JSON
from sqlalchemy.orm import relationship
from database import Base
import enum
import datetime

class UserRole(str, enum.Enum):
    WORKER = "worker"
    MASTER = "master"

class BookingStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    QUOTED = "quoted"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    phone = Column(String, nullable=True)
    role = Column(String) # "worker" or "master"
    avatar = Column(String, nullable=True)
    location = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    penalty_amount = Column(Float, default=0.0)

    # Worker specific fields
    specialties = Column(JSON, nullable=True) # List of strings
    bio = Column(String, nullable=True)
    hourly_rate = Column(Float, nullable=True)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    is_available = Column(Boolean, default=True)
    completed_jobs = Column(Integer, default=0)

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    master_id = Column(Integer, ForeignKey("users.id"))
    worker_id = Column(Integer, ForeignKey("users.id"))
    specialty = Column(String)
    location = Column(String)
    job_details = Column(String)
    status = Column(String, default="pending")
    quoted_price = Column(Float, nullable=True)
    scheduled_date = Column(DateTime, nullable=True)
    rating = Column(Integer, nullable=True)
    review = Column(String, nullable=True)
    cancellation_reason = Column(String, nullable=True)
    completion_otp = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    master = relationship("User", foreign_keys=[master_id])
    worker = relationship("User", foreign_keys=[worker_id])

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    is_read = Column(Boolean, default=False)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
