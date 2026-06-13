
import sqlite3

def add_cancellation_reason_column():
    conn = sqlite3.connect('backend/workhub.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE bookings ADD COLUMN cancellation_reason STRING")
        print("Successfully added cancellation_reason column to bookings table.")
    except sqlite3.OperationalError as e:
        if "duplicate column" in str(e):
            print("Column cancellation_reason already exists.")
        else:
            print(f"Error adding column: {e}")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    add_cancellation_reason_column()
