from database import engine, SessionLocal
from models import User, Booking
from sqlalchemy.orm import Session

def check_db():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print("USERS:")
        for u in users:
            print(f"ID: {u.id}, Email: {u.email}, Role: {u.role}")
        
        bookings = db.query(Booking).all()
        print("\nBOOKINGS:")
        for b in bookings:
            print(f"ID: {b.id}, Master: {b.master_id}, Worker: {b.worker_id}, Status: {b.status}")
    finally:
        db.close()

if __name__ == "__main__":
    check_db()
    
