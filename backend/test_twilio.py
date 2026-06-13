
import os
from dotenv import load_dotenv
from twilio.rest import Client

# Load env variables
load_dotenv()

def test_sms():
    print("Testing Twilio SMS Configuration...")
    
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    api_key = os.getenv("TWILIO_API_KEY")
    api_secret = os.getenv("TWILIO_API_SECRET")
    from_number = os.getenv("TWILIO_PHONE_NUMBER")
    
    # Target number (hardcoded to the user's provided number for testing)
    to_number = "+919390745902" 

    print(f"Account SID: {account_sid}")
    print(f"API Key: {api_key}")
    print(f"From Number: {from_number}")
    print(f"To Number: {to_number}")

    if not account_sid or not from_number:
        print("ERROR: Missing Account SID or From Number in .env")
        return

    try:
        client = None
        if api_key and api_secret:
            print("Using API Key authentication...")
            client = Client(api_key, api_secret, account_sid)
        else:
            print("Using Auth Token authentication (if available)...")
            auth_token = os.getenv("TWILIO_AUTH_TOKEN")
            if auth_token:
                client = Client(account_sid, auth_token)
            else:
                print("ERROR: No Auth Token or API Key/Secret found.")
                return

        message = client.messages.create(
            body="Test Code from Task Masters: 123456",
            from_=from_number,
            to=to_number
        )
        print(f"SUCCESS: SMS sent! Message SID: {message.sid}")
    
    except Exception as e:
        print(f"FAILED: Twilio Error: {e}")

if __name__ == "__main__":
    test_sms()
