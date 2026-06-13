import os
import datetime
from openai import OpenAI
import json

# Use the environment variable instead of hardcoding the key.
# Set OPENAI_API_KEY in backend/.env or in your runtime environment.
client = OpenAI()

def test_voice_logic():
    try:
        transcript = "Book a plumber for tomorrow at 10am to fix a leak in the kitchen"
        print(f"Testing transcript: {transcript}")
        
        current_time = datetime.datetime.now().isoformat()
        
        system_prompt = f"""
        You are a smart booking assistant for Task Masters.
        Current time: {current_time}
        Extract the following information from the user's request into a JSON structure:
        - action: "book", "search", or "unknown"
        - specialty: string (e.g. Electrician, Plumber, Cleaner, Carpenter, Painter, etc.) - map to closest standard specialty if possible.
        - location: string or null
        - scheduled_date: ISO 8601 datetime string (YYYY-MM-DDTHH:MM:SS) if a specific time is mentioned (e.g. "tomorrow at 10am"), or null. Calculate based on current time.
        - job_details: succinct summary of the work needed (e.g. "fix a leak")
        - message: a short, friendly confirmation message to show the user (e.g. "Looking for plumbers available tomorrow at 10am...").

        Return ONLY a raw JSON object string. Do not include markdown formatting (like ```json).
        """

        print("Sending request to OpenAI...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": transcript}
            ],
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        content = response.choices[0].message.content
        print(f"Received content: {content}")
        
        data = json.loads(content)
        print("Parsed JSON successfully:")
        print(json.dumps(data, indent=2))
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_voice_logic()
