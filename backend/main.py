from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload
from typing import List
import models, schemas, auth, database
from database import engine, get_db
import os
from dotenv import load_dotenv
from openai import OpenAI
import datetime
import random
import string
from notifications import send_email, send_sms

load_dotenv()


try:
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        client = OpenAI(api_key=api_key)
    else:
        client = None
        print("WARNING: OPENAI_API_KEY not found. AI features will be disabled.")
except Exception as e:
    client = None
    print(f"WARNING: Failed to initialize OpenAI client: {e}")


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="WorkHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Routes
@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        name=user.name,
        phone=user.phone,
        role=user.role, 
        avatar=user.avatar,
        location=user.location,
        age=user.age,
        specialties=user.specialties,
        hourly_rate=user.hourly_rate,
        is_available=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(get_db)): # Simplified for demo, usually uses OAuth2PasswordRequestForm
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    res = {"access_token": access_token, "token_type": "bearer"}
    print(f"Login success for {user.email}")
    return res

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/stats", response_model=schemas.GlobalStats)
def get_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func
    worker_count = db.query(models.User).filter(models.User.role == "worker").count()
    job_count = db.query(models.Booking).filter(models.Booking.status == "completed").count()
    avg_rating = db.query(func.avg(models.User.rating)).filter(models.User.role == "worker").scalar() or 0.0
    city_count = db.query(func.count(func.distinct(models.User.location))).filter(models.User.location.isnot(None)).scalar() or 0
    
    return {
        "worker_count": worker_count,
        "job_count": job_count,
        "avg_rating": round(float(avg_rating), 1),
        "city_count": city_count
    }

# Worker Routes

def get_recommended_workers_logic(db: Session, current_user: models.User, specialty: str = None):
    query = db.query(models.User).filter(models.User.role == "worker", models.User.is_available == True)
    workers = query.all()
    
    if specialty:
        # Case-insensitive check
        workers = [w for w in workers if w.specialties and isinstance(w.specialties, list) and any(specialty.lower() in s.lower() for s in w.specialties)]
    
    recommended = []
    for w in workers:
        score = 0.0
        
        # 1. Location match (Distance proxy) - Weight: 50 (Dominant factor)
        is_local = False
        if w.location and current_user.location:
            if w.location.lower().strip() == current_user.location.lower().strip():
                score += 50
                is_local = True
            elif current_user.location.lower().strip() in w.location.lower() or w.location.lower() in current_user.location.lower():
                score += 30
                is_local = True
        
        # 2. Rating (Weight: 30)
        score += (w.rating / 5.0) * 30 if w.rating else 0
        
        # 3. Synergy Bonus (Location + High Rating) - Weight: 10
        # This explicitly rewards "Highly Rated AND Near" as requested
        if is_local and w.rating and w.rating >= 4.0:
            score += 10

        # 4. Experience (Completed Jobs, Weight: 10)
        exp_score = min(w.completed_jobs / 10.0, 1.0) * 10 if w.completed_jobs else 0
        score += exp_score
        
        # 5. Random slight variation for "Smart" feel (Weight: 5)
        import random
        score += random.uniform(0, 5)
        
        w.match_score = round(score, 1)
        recommended.append(w)
    
    recommended.sort(key=lambda x: x.match_score, reverse=True)
    return recommended


@app.get("/workers", response_model=List[schemas.UserResponse])
def get_workers(specialty: str = None, db: Session = Depends(get_db)):
    query = db.query(models.User).filter(models.User.role == "worker")
    workers = query.all()
    if specialty:
        workers = [w for w in workers if w.specialties and isinstance(w.specialties, list) and specialty in w.specialties]
    return workers

@app.get("/workers/recommend", response_model=List[schemas.UserResponse])
def recommend_workers(specialty: str = None, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return get_recommended_workers_logic(db, current_user, specialty)

@app.patch("/users/me", response_model=schemas.UserResponse)
def update_user_me(update_data: schemas.UserUpdate, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

# WebSocket Manager
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"WebSocket connected: User {user_id}")

    def disconnect(self, user_id: int):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"WebSocket disconnected: User {user_id}")

    async def send_personal_message(self, message: str, user_id: int):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_text(message)
                print(f"Notification sent to User {user_id}")
            except Exception as e:
                print(f"Failed to send notification: {e}")
                self.disconnect(user_id)

manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            # Keep connection alive, maybe handle incoming pings or messages if needed
            data = await websocket.receive_text()
            # print(f"Received from {user_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(user_id)

# Booking Routes
@app.post("/bookings", response_model=schemas.BookingResponse)
async def create_booking(booking: schemas.BookingCreate, background_tasks: BackgroundTasks, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    try:
        print(f"Creating booking: master={current_user.email}, worker_id={booking.worker_id}")
        if current_user.role != "master":
            raise HTTPException(status_code=403, detail="Only masters can create bookings")
        
        worker = db.query(models.User).filter(models.User.id == booking.worker_id, models.User.role == "worker").first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")

        db_booking = models.Booking(
            master_id=current_user.id,
            worker_id=booking.worker_id,
            specialty=booking.specialty,
            location=booking.location,
            job_details=booking.job_details,
            scheduled_date=booking.scheduled_date,
            status="pending"
        )
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        print(f"Booking saved with ID: {db_booking.id}")
        
        # Notify the worker via WebSocket (Background Task)
        message = f"New Booking Request! {current_user.name} wants to hire you for {booking.specialty}."
        background_tasks.add_task(manager.send_personal_message, message, booking.worker_id)
        
        # Add names for response
        response_data = schemas.BookingResponse.model_validate(db_booking)
        response_data.master_name = current_user.name
        response_data.worker_name = worker.name
        print(f"Returning response for booking {db_booking.id}")
        return response_data
    except Exception as e:
        print(f"CREATE BOOKING ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise e

@app.get("/bookings", response_model=List[schemas.BookingResponse])
def get_bookings(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "worker":
        bookings = db.query(models.Booking).options(joinedload(models.Booking.master), joinedload(models.Booking.worker)).filter(models.Booking.worker_id == current_user.id).all()
    else:
        bookings = db.query(models.Booking).options(joinedload(models.Booking.master), joinedload(models.Booking.worker)).filter(models.Booking.master_id == current_user.id).all()
    
    result = []
    for b in bookings:
        resp = schemas.BookingResponse.model_validate(b)
        resp.master_name = b.master.name if b.master else "Unknown"
        resp.worker_name = b.worker.name if b.worker else "Unknown"
        result.append(resp)
    return result

@app.patch("/bookings/{booking_id}", response_model=schemas.BookingResponse)
def update_booking(booking_id: int, update_data: schemas.BookingUpdate, background_tasks: BackgroundTasks, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if current_user.id not in [booking.master_id, booking.worker_id]:
        raise HTTPException(status_code=403, detail="Not authorized to update this booking")

    # If rating is provided, ensure it's from the master and for a completed booking
    if update_data.rating is not None:
        if current_user.id != booking.master_id:
            raise HTTPException(status_code=403, detail="Only the customer can rate the service")
        if booking.status != "completed":
            raise HTTPException(status_code=400, detail="Can only rate completed bookings")

    # Debugging
    print(f"DEBUG: Updating booking {booking_id}. Payload: {update_data}")
    print(f"DEBUG: Current Booking Status: {booking.status}, OTP: {booking.completion_otp}")

    # Check for completion flow
    if update_data.status == "completed" and booking.status != "completed":
        if not update_data.completion_otp:
            # Step 1: Generate and Send OTP
            otp = "".join(random.choices(string.digits, k=6))
            booking.completion_otp = otp
            db.commit()
            
            # Send OTP to Master (Customer)
            notification_msg = f"Your worker {current_user.name} wants to complete the job. Please provide this OTP to them: {otp}"
            background_tasks.add_task(manager.send_personal_message, notification_msg, booking.master_id)
            
            # Send Email and SMS
            try:
                if booking.master:
                    print(f"DEBUG: Master found for booking {booking.id}: {booking.master.name} (ID: {booking.master.id})")
                    print(f"DEBUG: Master Email: {booking.master.email}, Phone: {booking.master.phone}")
                    
                    email_subject = "Task Masters - Job Completion OTP"
                    email_body = f"Hello {booking.master.name},\n\nYour worker {current_user.name} has requested to mark the job '{booking.specialty}' as completed.\n\nPlease provide the following OTP to them to verify completion:\n\nOTP: {otp}\n\nThank you,\nTask Masters Team"
                    background_tasks.add_task(send_email, booking.master.email, email_subject, email_body)
                    
                    if booking.master.phone:
                        sms_msg = f"Task Masters: OTP for job completion is {otp}. Share this with your worker {current_user.name}."
                        print(f"DEBUG: Queueing SMS to {booking.master.phone}")
                        background_tasks.add_task(send_sms, booking.master.phone, sms_msg)
                    else:
                        print(f"DEBUG: No phone number for master {booking.master.id}, skipping SMS.")
                else:
                     print(f"DEBUG: Booking {booking.id} has no master relation loaded!")
            except Exception as notify_err:
                print(f"ERROR Sending Notification (Email/SMS): {notify_err}")
                # Don't raise, continue so flow works even if notifications fail

            print(f"OTP {otp} generated for Booking {booking.id} and sent to Master {booking.master_id} (Email/SMS queued)")
            
            # Return special response indicating OTP required (client should handle this)
            # We can't easily change the return type schema here without breaking things, 
            # so we might need a specific endpoint OR rely on the client noticing status didn't change to completed yet?
            # Better: The client calls this, gets 200 OK but status is NOT completed yet?
            # Or we raise a specific HTTP exception "OTP Required" or return a specific message?
            # For simplicity, let's update status to 'pending_completion' or just keeping it as confirmed but returning a signal?
            # Let's assume the client will handle the "initiate" call separately or we just return the object.
            # But the client needs to know OTP was sent.
            # Using a custom header or detail might be tricky.
            # Let's try this: detailed error/message or field in response?
            
            # Since we modify the booking to store OTP but NOT status=completed, the update below will do the rest.
            # Wait, we need to prevent status=completed in the loop below if OTP is missing.
            pass
        else:
             # Step 2: Verify OTP
            if booking.completion_otp != update_data.completion_otp:
                raise HTTPException(status_code=400, detail="Invalid OTP")
            
            # OTP Correct: Clear OTP and allow status update
            booking.completion_otp = None
            # Status will be updated in the loop below
    
    prev_status = booking.status
    
    for field, value in update_data.model_dump(exclude_unset=True).items():
        if field == "status" and value == "completed":
             if not update_data.completion_otp:
                 # Skip updating status if this was the "initiate" call
                 continue
                 
        # Check for penalty application BEFORE updating status
        if field == "status" and value == "cancelled" and booking.status == "confirmed":
            # Determine who is cancelling (current_user)
            user_to_penalize = db.query(models.User).filter(models.User.id == current_user.id).first()
            if user_to_penalize:
                current_penalty = user_to_penalize.penalty_amount if user_to_penalize.penalty_amount is not None else 0.0
                user_to_penalize.penalty_amount = current_penalty + 50.0
                print(f"Applying penalty. User {user_to_penalize.id} penalty increased to {user_to_penalize.penalty_amount}")
                db.add(user_to_penalize)
        
        # Explicitly handle cancellation_reason if passed in update_data
        if field == "cancellation_reason":
             setattr(booking, field, value)

        if field == "completion_otp":
            continue

        setattr(booking, field, value)

    # Update worker completed jobs when the booking transitions to completed
    if prev_status != "completed" and booking.status == "completed":
        worker = db.query(models.User).filter(models.User.id == booking.worker_id).first()
        if worker:
            worker.completed_jobs = (worker.completed_jobs or 0) + 1
            db.add(worker)
            print(f"Incremented completed_jobs for worker {worker.id} to {worker.completed_jobs}")

    db.commit()
    db.refresh(booking)

    # Notifications Logic
    try:
        if current_user.id == booking.worker_id:
            # Worker updated something -> Notify Master
            notification_msg = ""
            if booking.status == "quoted":
                notification_msg = f"Worker {current_user.name} has sent a quote: ₹{booking.quoted_price}"
            elif booking.status == "accepted":
                notification_msg = f"Worker {current_user.name} accepted your request!"
            elif booking.status == "completed":
                notification_msg = f"Task completed by {current_user.name}!"
            elif booking.status == "cancelled":
                notification_msg = f"Worker {current_user.name} cancelled the booking."
            
            # For OTP "initiated", we already sent a message above.
            
            if notification_msg:
                background_tasks.add_task(manager.send_personal_message, notification_msg, booking.master_id)
        
        elif current_user.id == booking.master_id:
            # Master updated something -> Notify Worker
            notification_msg = ""
            if booking.status == "confirmed":
                notification_msg = f"Great news! {current_user.name} confirmed the booking!"
            elif booking.status == "cancelled":
                notification_msg = f"Customer {current_user.name} cancelled the booking."
            
            if notification_msg:
                background_tasks.add_task(manager.send_personal_message, notification_msg, booking.worker_id)
                
    except Exception as e:
        print(f"Notification Error: {e}")

    # If rating was updated, recalculate worker's average rating
    if update_data.rating is not None:
        worker = db.query(models.User).filter(models.User.id == booking.worker_id).first()
        if worker:
            from sqlalchemy import func
            stats = db.query(
                func.avg(models.Booking.rating),
                func.count(models.Booking.rating)
            ).filter(
                models.Booking.worker_id == worker.id,
                models.Booking.rating.isnot(None)
            ).first()
            
            worker.rating = round(float(stats[0] or 0), 1)
            worker.review_count = int(stats[1] or 0)
            db.commit()
    
    resp = schemas.BookingResponse.model_validate(booking)
    resp.master_name = booking.master.name if booking.master else "Unknown"
    resp.worker_name = booking.worker.name if booking.worker else "Unknown"
    return resp

# Messaging Routes
@app.post("/messages", response_model=schemas.MessageResponse)
def send_message(message: schemas.MessageCreate, background_tasks: BackgroundTasks, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    db_message = models.Message(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    # Notify the receiver via WebSocket
    notification_msg = f"New message from {current_user.name}: {message.content[:30]}..."
    background_tasks.add_task(manager.send_personal_message, notification_msg, message.receiver_id)
    
    return db_message

@app.get("/messages/{user_id}", response_model=List[schemas.MessageResponse])
def get_messages(user_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    messages = db.query(models.Message).filter(
        ((models.Message.sender_id == current_user.id) & (models.Message.receiver_id == user_id)) |
        ((models.Message.sender_id == user_id) & (models.Message.receiver_id == current_user.id))
    ).order_by(models.Message.timestamp.asc()).all()
    return messages

# Handle /api prefix redirects or aliases if needed by frontend
@app.get("/api/messaging/messages/{user_id}", response_model=List[schemas.MessageResponse])
def get_messages_api_alias(user_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    return get_messages(user_id, current_user, db)

@app.post("/chat")
def chat(request: schemas.ChatRequest, current_user: models.User = Depends(auth.get_current_user_optional), db: Session = Depends(get_db)):
    try:
        # 1. System Prompt enabling "Agent" behavior
        current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
        
        system_prompt = {
            "role": "system",
            "content": f"""
            You are the Task Masters intelligent Assistant.
            Current Time: {current_time}
            User: {current_user.name if current_user else 'Guest'} (ID: {current_user.id if current_user else 'None'})
            User Location: {current_user.location if current_user and current_user.location else 'Unknown'}

            Your Goal: Help users find workers and answer their questions.
            
            CAPABILITIES:
            1. Search Workers: If user needs help, suggest workers based on specialty.
            2. Guide: Explain how to use the 'Book Now' button in the Workers tab.
            
            PROTOCOL:
            - If user asks for a worker, suggest 1-2 top rated ones if you know them.
            - If user wants to book, tell them: "You seem interested in [Worker Name]. You can view their full profile and book them directly from the 'Workers' page!"
            - Do NOT promise to book for them. You cannot create bookings.
            - Text response MUST be friendly.
            """
        }
        
        # Prepare messages
        api_messages = [system_prompt]
        for msg in request.messages:
            api_messages.append({"role": msg.role, "content": msg.content})
            
        final_content = ""
        
        try:
            # --- OPENAI BRANCH ---
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=api_messages,
                temperature=0.7,
                max_tokens=600
            )
            final_content = response.choices[0].message.content
            
        except Exception as openai_error:
            print(f"Chat Fallback (No OpenAI Key?): {openai_error}")
            
            # --- FALLBACK AGENT LOGIC ---
            user_text = request.messages[-1].content.lower()
            
            # 1. Detection
            specialties = [
                "electrician", "plumber", "cleaner", "carpenter", "painter", 
                "ac repair", "appliance repair", "mason", "welder", "gardener"
            ]
            found_specialty = next((s for s in specialties if s in user_text), None)
            
            if found_specialty:
                top_workers = db.query(models.User).filter(
                    models.User.role == "worker",
                    models.User.is_available == True
                ).all()
                matches = [w for w in top_workers if w.specialties and any(found_specialty in s.lower() for s in w.specialties)]
                
                if matches:
                    w = matches[0]
                    final_content = f"I found {w.name}, a great {found_specialty} (Rate: ₹{w.hourly_rate}/hr). You can book them directly from the 'Workers' tab!"
                else:
                    final_content = f"I checked, but I couldn't find any available {found_specialty}s at the moment."
            else:
                final_content = "I'm your Assistant. Tell me what you need (e.g., 'Find a Plumber') and I'll help you find the best expert!"

        return {"content": final_content}

    except Exception as e:
        print(f"CRITICAL CHAT ERROR: {str(e)}")
        # import traceback
        # traceback.print_exc()
        raise HTTPException(status_code=500, detail="Agent offline")

@app.post("/voice-booking", response_model=schemas.VoiceBookingResponse)
def voice_booking(request: schemas.VoiceBookingRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    try:
        import datetime
        import json
        
        transcript_lower = request.transcript.lower()
        
        # Try OpenAI first
        try:
            current_time = datetime.datetime.now().isoformat()
            
            system_prompt = f"""
            You are a premium, highly efficient booking assistant for Task Masters.
            Current time: {current_time}
            
            USER INTENT: The user wants to book a service, specifically mentioning time and quality (e.g., "high rated").
            
            Extract the following information from the user's request into a JSON structure:
            - action: "book" (if user wants to book), "search" (if just browsing), or "unknown"
            - specialty: string (e.g. Electrician, Plumber, Cleaner, Carpenter, Painter, etc.) - map to closest standard specialty.
            - location: string or null
            - scheduled_date: ISO 8601 datetime string (YYYY-MM-DDTHH:MM:SS) if a specific time is mentioned. 
               - "tomorrow at 12pm" -> calculate relative to {current_time}.
               - "now", "today", "asap" -> use current time: {current_time} + 1 hour as default.
               - "this evening" -> {current_time[:10]}T18:00:00.
            - job_details: succinct summary of why they need the help (e.g. "fix a leak", "routine checkup")
            - message: a sophisticated, friendly confirmation message (e.g. "Certainly! Searching for the highest-rated plumbers available today...").

            Return ONLY a raw JSON object string.
            """

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": request.transcript}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            
            content = response.choices[0].message.content
            data = json.loads(content)
            
        except Exception as openai_error:
            print(f"OpenAI API Error (falling back to keywords): {openai_error}")
            
            # Smart Fallback Logic
            specialties = {
                "plumber": "Plumber",
                "electrician": "Electrician",
                "cleaner": "Cleaner", 
                "cleaning": "Cleaner",
                "carpenter": "Carpenter",
                "painter": "Painter",
                "ac": "AC Repair",
            }
            
            found_specialty = None
            for key, val in specialties.items():
                if key in transcript_lower:
                    found_specialty = val
                    break
            
            if found_specialty:
                now_plus_one = (datetime.datetime.now() + datetime.timedelta(hours=1)).isoformat()
                data = {
                    "action": "book",
                    "specialty": found_specialty,
                    "location": None,
                    "scheduled_date": now_plus_one,
                    "job_details": request.transcript,
                    "message": f"I've found our best {found_specialty} for you! Booking for as soon as possible..."
                }
            else:
                data = {
                    "action": "search",
                    "specialty": None,
                    "location": None,
                    "scheduled_date": None,
                    "job_details": None,
                    "message": "I heard you, but I'm not sure which service you need. Could you specify the type of worker?"
                }

        # Auto-booking logic
        if data.get("action") == "book" and data.get("specialty"):
            specialty = data["specialty"]
            
            # Find recommended workers (Logic already favors rating and location)
            recommended = get_recommended_workers_logic(db, current_user, specialty)
            
            if recommended:
                # Pick the absolute best one (highest score, which weights rating heavily)
                best_worker = recommended[0]
                
                # Check for date
                scheduled_date = None
                if data.get("scheduled_date"):
                    try:
                        scheduled_date = datetime.datetime.fromisoformat(data["scheduled_date"])
                    except Exception:
                        pass
                
                if scheduled_date:
                    # Create the booking automatically
                    db_booking = models.Booking(
                        master_id=current_user.id,
                        worker_id=best_worker.id,
                        specialty=specialty,
                        location=data.get("location") or current_user.location or "Address On File",
                        job_details=data.get("job_details") or "Requested via Voice Assistant",
                        scheduled_date=scheduled_date,
                        status="pending"
                    )
                    db.add(db_booking)
                    db.commit()
                    db.refresh(db_booking)
                    
                    data["action"] = "booking_created"
                    data["booking_id"] = db_booking.id
                    data["worker_name"] = best_worker.name
                    
                    time_str = scheduled_date.strftime('%B %d at %I:%M %p')
                    data["message"] = f"Perfect! I've automatically booked the highest-rated {specialty} near you: {best_worker.name}, who has a {best_worker.rating} star rating. Your appointment is set for {time_str}. You can view the details in your bookings."
                else:
                    # Fallback if no date found - prompt the user
                    data["message"] = f"I found our top-rated {specialty}: {best_worker.name} ({best_worker.rating}★). When exactly would you like to schedule the visit?"
                    data["action"] = "search"
            
            else:
                 # No worker found
                 data["message"] = f"I've searched our network, but unfortunately, there are no available {specialty}s at this moment. Would you like me to look for something else?"
                 data["action"] = "search"

        return data


    except Exception as e:
        print(f"VOICE ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        # Return error schema, not raise exception, so frontend can handle gracefully
        return {
            "action": "error",
            "message": "Sorry, I couldn't quite catch that. Please try again.",
            "specialty": None,
            "location": None,
            "scheduled_date": None,
            "job_details": None
        }

# Serve static frontend files from production build
frontend_dist = os.path.join(os.path.dirname(__file__), '..', 'frontend_dist')
if os.path.exists(frontend_dist):
    app.mount('/', StaticFiles(directory=frontend_dist, html=True), name='frontend')
    print(f'Frontend files mounted from {frontend_dist}')
else:
    # Frontend production build not found; continue without mounting static files
    print(f'No frontend production build found at {frontend_dist}. Skipping static mount.')
