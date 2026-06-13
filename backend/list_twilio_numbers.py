
import os
from dotenv import load_dotenv
from twilio.rest import Client

load_dotenv()

def list_incoming_numbers():
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    api_key = os.getenv("TWILIO_API_KEY")
    api_secret = os.getenv("TWILIO_API_SECRET")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")

    print("Fetching Twilio Phone Numbers for Account:", account_sid)

    try:
        # Initialize Client
        if api_key and api_secret:
            client = Client(api_key, api_secret, account_sid)
        elif auth_token:
            client = Client(account_sid, auth_token)
        else:
            print("Error: No valid credentials found.")
            return

        incoming_phone_numbers = client.incoming_phone_numbers.list(limit=20)

        if not incoming_phone_numbers:
            print("No phone numbers found in this Twilio account!")
            print("Please go to https://console.twilio.com/ and buy a number (or get a trial number).")
        else:
            print(f"Found {len(incoming_phone_numbers)} number(s):")
            for record in incoming_phone_numbers:
                print(f"- {record.phone_number} ({record.friendly_name})")

    except Exception as e:
        print(f"Error fetching numbers: {e}")

if __name__ == "__main__":
    list_incoming_numbers()
