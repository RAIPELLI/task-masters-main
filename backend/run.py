import subprocess
import sys
import os

def run():
    print("Setting up WorkHub Backend...")
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Install requirements
    print("Installing requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Start the server
    print("Starting FastAPI server at http://localhost:8000")
    subprocess.check_call([sys.executable, "-m", "uvicorn", "main:app", "--reload", "--port", "8000"])

if __name__ == "__main__":
    run()
