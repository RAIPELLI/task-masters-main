
from sqlalchemy import text
from database import engine

def add_completion_otp():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE bookings ADD COLUMN completion_otp VARCHAR"))
            conn.commit()
            print("Successfully added completion_otp column")
        except Exception as e:
            print(f"Error adding column: {e}")

if __name__ == "__main__":
    add_completion_otp()
