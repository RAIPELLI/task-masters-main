from pydantic import BaseModel, EmailStr, ConfigDict
from pydantic.alias_generators import to_camel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    WORKER = "worker"
    MASTER = "master"

class BookingStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    QUOTED = "quoted"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class UserBase(BaseSchema):
    email: EmailStr
    name: str
    phone: Optional[str] = None
    role: UserRole
    avatar: Optional[str] = None
    location: Optional[str] = None
    age: Optional[int] = None

class UserCreate(UserBase):
    password: str
    specialties: Optional[List[str]] = None
    hourly_rate: Optional[float] = None

class UserLogin(BaseSchema):
    email: EmailStr
    password: str
    role: UserRole

class UserUpdate(BaseSchema):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None
    is_available: Optional[bool] = None
    specialties: Optional[List[str]] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None
    age: Optional[int] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    penalty_amount: float = 0.0
    # Worker fields
    specialties: Optional[List[str]] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None
    rating: float = 0.0
    review_count: int = 0
    age: Optional[int] = None
    is_available: bool = True
    completed_jobs: int = 0
    match_score: Optional[float] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseSchema):
    email: Optional[str] = None

class BookingBase(BaseSchema):
    worker_id: int
    specialty: str
    location: str
    job_details: str
    scheduled_date: Optional[datetime] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseSchema):
    status: Optional[BookingStatus] = None
    quoted_price: Optional[float] = None
    scheduled_date: Optional[datetime] = None
    rating: Optional[int] = None
    review: Optional[str] = None
    cancellation_reason: Optional[str] = None
    completion_otp: Optional[str] = None

class BookingResponse(BaseSchema):
    id: int
    master_id: int
    worker_id: int
    master_name: Optional[str] = None
    worker_name: Optional[str] = None
    specialty: str
    location: str
    job_details: str
    status: BookingStatus
    quoted_price: Optional[float] = None
    scheduled_date: Optional[datetime] = None
    rating: Optional[int] = None
    review: Optional[str] = None
    cancellation_reason: Optional[str] = None
    created_at: datetime

class MessageCreate(BaseSchema):
    receiver_id: int
    content: str

class MessageResponse(BaseSchema):
    id: int
    sender_id: int
    receiver_id: int
    content: str
    timestamp: datetime
    is_read: bool

class GlobalStats(BaseSchema):
    worker_count: int
    job_count: int
    avg_rating: float
    city_count: int

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class VoiceBookingRequest(BaseModel):
    transcript: str

class VoiceBookingResponse(BaseModel):
    action: str  # "book", "search", "error"
    specialty: Optional[str] = None
    location: Optional[str] = None
    scheduled_date: Optional[str] = None  # ISO format string
    job_details: Optional[str] = None
    message: str
    booking_id: Optional[int] = None
    worker_name: Optional[str] = None
