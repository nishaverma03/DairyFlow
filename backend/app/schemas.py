from decimal import Decimal
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

Quantity = Annotated[Decimal, Field(gt=0, max_digits=9, decimal_places=3)]
Rate = Annotated[Decimal, Field(ge=0, max_digits=9, decimal_places=2)]


class Input(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class CustomerInput(Input):
    name: Annotated[str, StringConstraints(min_length=1, max_length=120)]
    phone: Annotated[str, StringConstraints(pattern=r"^[0-9]{10}$")]
    milk: Quantity
    rate: Rate | None = None


class CustomerView(CustomerInput):
    model_config = ConfigDict(from_attributes=True)
    id: int
    rate: Rate


class RateInput(Input):
    rate: Rate


class AttendanceInput(Input):
    status: Literal["Present", "Absent"]
