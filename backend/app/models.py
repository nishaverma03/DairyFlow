from datetime import date
from decimal import Decimal

from sqlalchemy import Boolean, Date, ForeignKey, Numeric, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class Customer(Base):
    __tablename__ = "dairy_customers"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(10), unique=True)
    milk: Mapped[Decimal] = mapped_column(Numeric(9, 3))
    rate: Mapped[Decimal] = mapped_column(Numeric(9, 2))
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class Attendance(Base):
    __tablename__ = "dairy_attendance"

    customer_id: Mapped[int] = mapped_column(ForeignKey(Customer.id), primary_key=True)
    day: Mapped[date] = mapped_column(Date, primary_key=True)
    status: Mapped[str] = mapped_column(String(7))
    milk: Mapped[Decimal] = mapped_column(Numeric(9, 3))
    rate: Mapped[Decimal] = mapped_column(Numeric(9, 2))


class MilkRate(Base):
    __tablename__ = "dairy_rates"

    day: Mapped[date] = mapped_column(Date, primary_key=True)
    rate: Mapped[Decimal] = mapped_column(Numeric(9, 2))
