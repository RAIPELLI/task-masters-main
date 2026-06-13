
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_email(to_email, subject, body):
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print("SMTP credentials not set. Skipping email.")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USERNAME, to_email, text)
        server.quit()
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

# Placeholder for SMS function
def send_sms(to_phone, message):
    # Retrieve API keys from env
    TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
    TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
    TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
    
    # Optional API Key support
    TWILIO_API_KEY = os.getenv("TWILIO_API_KEY")
    TWILIO_API_SECRET = os.getenv("TWILIO_API_SECRET")

    # Hardcoded fallback for user credentials if env is missing (for immediate fix)
    # Note: Ideally these should be in .env only
    if not TWILIO_API_KEY and not TWILIO_AUTH_TOKEN:
         # Check if we should use the provided credentials directly (as a fallback)
         # Using the provided SID (SK...) as API Key SID and Key as Secret
         pass

    if TWILIO_ACCOUNT_SID and TWILIO_PHONE_NUMBER:
        if TWILIO_ACCOUNT_SID.startswith("AC...") or TWILIO_ACCOUNT_SID == "AC":
            print("Twilio Error: TWILIO_ACCOUNT_SID is still the placeholder. Please update .env with your actual Account SID.")
            return

        try:
            from twilio.rest import Client
            
            if TWILIO_API_KEY and TWILIO_API_SECRET:
                client = Client(TWILIO_API_KEY, TWILIO_API_SECRET, TWILIO_ACCOUNT_SID)
            elif TWILIO_AUTH_TOKEN:
                client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
            else:
                 print("Twilio Error: Missing Auth Token or API Key/Secret")
                 return

            # Ensure phone number has country code if missing (defaulting to +91 for India as per context)
            if not to_phone.startswith('+'):
                to_phone = f"+91{to_phone}"
                
            message = client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=to_phone
            )
            print(f"SMS sent to {to_phone} via Twilio SID: {message.sid}")
        except Exception as e:
            print(f"Twilio SMS Failed: {e}")
    else:
        # Implementation depends on the provider (Twilio, Msg91, etc.)
        # For now, just print to console
        print(f"Mock SMS to {to_phone}: {message}")
        print("To enable real SMS, set TWILIO_ACCOUNT_SID, TWILIO_PHONE_NUMBER, and AUTH credentials in .env")
