from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import test_database_connection

app = FastAPI(
    title="DairyFlow API",
    description="Backend API for DairyFlow dairy management system",
    version="1.0.0",
)

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to DairyFlow API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "DairyFlow",
    }


@app.get("/db-test")
def database_test():
    try:
        result = test_database_connection()

        return {
            "status": "success",
            "message": "Successfully connected to Neon PostgreSQL!",
            "test_result": result,
        }

    except Exception:
        return {
            "status": "error",
            "message": "Database connection failed. Check your database configuration.",
        }