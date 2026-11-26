from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.management import router as management_router
from app.api.routes import router
from app.database import get_engine
from app.models import Base


@asynccontextmanager
async def lifespan(app):
    engine = get_engine()
    Base.metadata.create_all(engine)
    try:
        yield
    finally:
        engine.dispose()


app = FastAPI(
    lifespan=lifespan,
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

app.include_router(router)
app.include_router(management_router)
