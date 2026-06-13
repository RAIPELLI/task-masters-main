
from sqlalchemy import text
from database import engine

def check_master_phone():
    with engine.connect() as conn:
        # Get the latest booking
        result = conn.execute(text("SELECT id, master_id FROM bookings ORDER BY id DESC LIMIT 1")).fetchone()
        if not result:
            print("No bookings found.")
            return
        
        booking_id, master_id = result
        print(f"Latest Booking ID: {booking_id}, Master ID: {master_id}")
        
        # Get master details
        master = conn.execute(text(f"SELECT id, name, email, phone FROM users WHERE id = {master_id}")).fetchone()
        if master:
            print(f"Master Details: ID={master[0]}, Name={master[1]}, Email={master[2]}, Phone={master[3]}")
            if not master[3]:
                print("WARNING: This master has NO phone number!")
        else:
            print("Master user not found!")

if __name__ == "__main__":
    check_master_phone()
