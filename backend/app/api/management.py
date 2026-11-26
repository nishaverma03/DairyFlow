import os
import secrets
from calendar import monthrange
from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_engine
from app.models import Attendance, Customer, MilkRate
from app.schemas import AttendanceInput, CustomerInput, CustomerView, RateInput

bearer = HTTPBearer(auto_error=False)


def require_manager(credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]):
    key = os.getenv("DAIRYFLOW_MANAGER_KEY")
    if not key:
        raise HTTPException(503, "Set DAIRYFLOW_MANAGER_KEY in backend/.env and restart")
    if not credentials or not secrets.compare_digest(credentials.credentials.encode(), key.encode()):
        raise HTTPException(401, "Manager key required", headers={"WWW-Authenticate": "Bearer"})


router = APIRouter(prefix="/api", dependencies=[Depends(require_manager)], tags=["Dairy management"])


def session():
    with Session(get_engine()) as db:
        yield db


DB = Annotated[Session, Depends(session)]
Year = Annotated[int, Path(ge=1, le=9999)]
Month = Annotated[int, Path(ge=1, le=12)]


def active_customer(db, customer_id):
    customer = db.get(Customer, customer_id)
    if not customer or not customer.active:
        raise HTTPException(404, "Customer not found")
    return customer


def effective_rate(db, day):
    rate = db.scalar(select(MilkRate.rate).where(MilkRate.day <= day).order_by(MilkRate.day.desc()).limit(1))
    return Decimal("60.00") if rate is None else rate


def insert_for(db, model):
    return (sqlite_insert if db.get_bind().dialect.name == "sqlite" else pg_insert)(model)


@router.get("/rates/{day}")
def read_rate(day: date, db: DB):
    return {"day": day, "rate": effective_rate(db, day)}


@router.put("/rates/{day}")
def save_rate(day: date, body: RateInput, db: DB):
    stmt = insert_for(db, MilkRate).values(day=day, rate=body.rate)
    db.execute(stmt.on_conflict_do_update(index_elements=["day"], set_={"rate": body.rate}))
    db.commit()
    return {"day": day, "rate": body.rate}


@router.get("/customers", response_model=list[CustomerView])
def list_customers(db: DB):
    return db.scalars(select(Customer).where(Customer.active.is_(True)).order_by(Customer.id)).all()


@router.get("/customers/{customer_id}", response_model=CustomerView)
def read_customer(customer_id: int, db: DB):
    return active_customer(db, customer_id)


def save_customer(db, customer):
    db.add(customer)
    try:
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(409, "Phone number already belongs to a customer") from error
    return customer


@router.post("/customers", response_model=CustomerView, status_code=201)
def add_customer(body: CustomerInput, db: DB):
    values = body.model_dump()
    if values["rate"] is None:
        values["rate"] = effective_rate(db, date.today())
    return save_customer(db, Customer(**values))


@router.put("/customers/{customer_id}", response_model=CustomerView)
def update_customer(customer_id: int, body: CustomerInput, db: DB):
    customer = active_customer(db, customer_id)
    for field, value in body.model_dump(exclude_none=True).items():
        setattr(customer, field, value)
    return save_customer(db, customer)


@router.delete("/customers/{customer_id}", status_code=204)
def archive_customer(customer_id: int, db: DB):
    customer = db.get(Customer, customer_id)
    if not customer:
        raise HTTPException(404, "Customer not found")
    customer.active = False
    db.commit()
    return Response(status_code=204)


@router.put("/customers/{customer_id}/attendance/{day}")
def mark_attendance(customer_id: int, day: date, body: AttendanceInput, db: DB):
    customer = active_customer(db, customer_id)
    stmt = insert_for(db, Attendance).values(customer_id=customer_id, day=day, status=body.status,
                                            milk=customer.milk, rate=customer.rate)
    db.execute(stmt.on_conflict_do_update(index_elements=["customer_id", "day"], set_={"status": body.status}))
    db.commit()
    return {"customer_id": customer_id, "day": day, "status": body.status}


@router.delete("/customers/{customer_id}/attendance/{day}", status_code=204)
def clear_attendance(customer_id: int, day: date, db: DB):
    active_customer(db, customer_id)
    db.execute(delete(Attendance).where(Attendance.customer_id == customer_id, Attendance.day == day))
    db.commit()
    return Response(status_code=204)


def month_bounds(year, month):
    return date(year, month, 1), date(year, month, monthrange(year, month)[1])


@router.get("/customers/{customer_id}/attendance/{year}/{month}")
def monthly_attendance(customer_id: int, year: Year, month: Month, db: DB):
    if db.get(Customer, customer_id) is None:
        raise HTTPException(404, "Customer not found")
    rows = db.scalars(select(Attendance).where(Attendance.customer_id == customer_id,
                      Attendance.day.between(*month_bounds(year, month))).order_by(Attendance.day))
    return [{"day": r.day, "status": r.status, "milk": r.milk, "rate": r.rate} for r in rows]


@router.get("/reports/{year}/{month}")
def monthly_report(year: Year, month: Month, db: DB):
    rows = db.execute(select(Attendance, Customer.name).join(Customer).where(
        Attendance.day.between(*month_bounds(year, month))).order_by(Customer.id, Attendance.day))
    customers = {}
    for record, name in rows:
        item = customers.setdefault(record.customer_id, {"customer_id": record.customer_id, "name": name,
            "present": 0, "absent": 0, "litres": Decimal("0.000"), "amount": Decimal("0.00")})
        if record.status == "Present":
            item["present"] += 1
            item["litres"] += record.milk
            item["amount"] += (record.milk * record.rate).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
        else:
            item["absent"] += 1
    return {"year": year, "month": month, "customers": list(customers.values()),
            "total_litres": sum(item["litres"] for item in customers.values()),
            "total_amount": sum(item["amount"] for item in customers.values())}
