from fastapi import APIRouter

from app.database import test_database_connection

router = APIRouter()


@router.get("/")
def root():
    return {
        "message": "Welcome to DairyFlow API",
        "status": "running",
    }


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "DairyFlow",
    }


@router.get("/db-test")
def database_test():
    try:
        result = test_database_connection()

        return {
            "status": "success",
            "message": "Successfully connected to the configured database.",
            "test_result": result,
        }

    except Exception:
        return {
            "status": "error",
            "message": "Database connection failed. Check your database configuration.",
        }
