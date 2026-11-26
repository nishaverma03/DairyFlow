import os
import ssl
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import URL, create_engine, event, text
from sqlalchemy.engine import make_url

BACKEND = Path(__file__).resolve().parents[1]
load_dotenv(BACKEND / ".env")


@lru_cache(maxsize=1)
def get_engine():
    raw = os.getenv("DATABASE_URL")
    url = make_url(raw) if raw else URL.create("sqlite", database=str(BACKEND / "dairyflow.sqlite3"))
    if url.get_backend_name() == "sqlite":
        engine = create_engine(url, connect_args={"timeout": 15})

        @event.listens_for(engine, "connect")
        def enable_constraints(connection, _):
            connection.execute("PRAGMA foreign_keys=ON")

        return engine

    if url.get_backend_name() not in {"postgresql", "postgres"}:
        raise ValueError("DATABASE_URL must use SQLite or PostgreSQL")
    url = url.set(drivername="postgresql+pg8000").difference_update_query(["sslmode", "channel_binding"])
    return create_engine(url, pool_pre_ping=True, connect_args={"ssl_context": ssl.create_default_context()})


def test_database_connection():
    with get_engine().connect() as connection:
        return connection.execute(text("SELECT 1")).scalar_one()
