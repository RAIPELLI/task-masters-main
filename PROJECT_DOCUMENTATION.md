# Task Masters - Project Documentation

## 1. Project Overview
Task Masters is a comprehensive platform designed to connect service seekers ("Masters") with skilled professionals ("Workers"). The application facilitates the entire process from finding a worker to booking, completing tasks, and providing reviews. It features AI-powered capabilities for worker matching and an conversational AI agent to assist with bookings.

## 2. Technology Stack

### Frontend
- **Framework**: React (via Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix Primitives)
- **Routing**: React Router
- **HTTP Client**: Axios (or fetch)

### Backend
- **Framework**: FastAPI (Python)
- **Database ORM**: SQLAlchemy
- **Database**: SQLite (default) / PostgreSQL compatible
- **Authentication**: OAuth2 with JWT (JSON Web Tokens)
- **Validation**: Pydantic

## 3. Project Structure

### Root Directory
- `/backend`: Contains the Python FastAPI server and database logic.
- `/src`: Contains the React frontend source code.
- `/public`: Static assets.

### Backend Structure (`/backend`)
- `main.py`: Core application entry point. Defines API routes for authentication, users, workers, bookings, and AI features.
- `models.py`: Defines database schemas using SQLAlchemy (User, WorkerProfile, Booking, Review, etc.).
- `schemas.py`: Pydantic models for data validation and serialization (request/response bodies).
- `auth.py`: Handles password hashing and JWT token generation/verification.
- `database.py`: Database connection settings (session management).
- `run.py`: Script to launch the Uvicorn server.
- `requirements.txt`: Python dependencies.

### Frontend Structure (`/src`)
- `components/`: Reusable UI components.
    - `auth/`: Login/Signup forms.
    - `bookings/`: Booking management (BookingCard, etc.).
    - `chat/`: Chat interface components.
    - `shared/`: Common UI elements (Navbar, Footer).
    - `workers/`: Worker profile and listing components.
- `contexts/`: React Context providers (e.g., AuthContext).
- `pages/`: Main application pages (Home, Dashboard, WorkerSearch, etc.).
- `hooks/`: Custom React hooks.
- `types/`: TypeScript type definitions (`index.ts`).
- `lib/`: Utility functions and configuration (e.g., `utils.ts`).

## 4. Key Features

### User Management
- **Roles**: Users can sign up as "Master" (client) or "Worker".
- **Profiles**: 
    - Masters have basic profiles.
    - Workers have detailed profiles including skills, hourly rate, location, and bio.

### Booking System
- **Create Booking**: Masters can request bookings with specific workers.
- **Status Workflow**: Bookings go through states: `pending` -> `confirmed` -> `completed` (or `cancelled`).
- **Reviews**: Masters can rate and review workers after booking completion.

### AI Integration
- **Worker Matching**: Intelligent recommendation system to match masters with the best workers based on skills, location, and rating.
- **Booking Agent**: An AI-powered chatbot that can understand natural language requests to find workers and manage bookings.

### Developer Tools
- **Mock Data**: Setup for data initialization.
- **Linting/Formatting**: ESLint and Prettier configuration.

## 5. Setup & execution

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python run.py
   # or
   uvicorn main:app --reload
   ```
   *Server runs on http://localhost:8000 (API docs at /docs)*

### Frontend
1. Navigate to the root directory (or remain in root):
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *Frontend typically runs on http://localhost:8080 or http://localhost:5173 depending on config.*

## 6. Recent Development Notes
- **Database**: Issues with `penalty_amount` and `cancellation_reason` columns were recently addressed.
- **Port Conflicts**: Standard port for backend is 8000; ensure no other process is using it (e.g., PID 8844).
