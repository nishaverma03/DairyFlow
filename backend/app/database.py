import os
import ssl

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not configured in the .env file")

# Switch to the pg8000 driver
DATABASE_URL = DATABASE_URL.replace(
    "postgresql+psycopg://",
    "postgresql+pg8000://",
)

# Parse the database URL
database_url = make_url(DATABASE_URL)

# Remove parameters unsupported by pg8000
query_parameters = dict(database_url.query)
query_parameters.pop("sslmode", None)
query_parameters.pop("channel_binding", None)

database_url = database_url.set(query=query_parameters)

# Configure secure SSL connection
ssl_context = ssl.create_default_context()

engine = create_engine(
    database_url,
    pool_pre_ping=True,
    connect_args={
        "ssl_context": ssl_context,
    },
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


def test_database_connection():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return result.scalar()