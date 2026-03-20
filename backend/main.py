import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from chat.endpoints import router as chat_router

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="AI Agents Builder System")

# Get frontend URL from environment variable
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(chat_router, prefix="/chat")

@app.get("/health")
def health_check():
    """Health check endpoint for deployment monitoring"""
    return {
        "status": "healthy",
        "service": "AI Agents Builder System",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

@app.post("/analyze")
def analyze():
    from analysis.manager import run_analysis
    return run_analysis()
