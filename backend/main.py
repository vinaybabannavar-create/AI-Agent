import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.routes import router as auth_router
from analysis.manager import run_analysis
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Agents Builder System")

# Get frontend URL from environment variable
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
allowed_origins = [frontend_url]

# Allow multiple origins for development
if frontend_url == "http://localhost:3000":
    allowed_origins.append("http://127.0.0.1:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")

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
    return run_analysis()
