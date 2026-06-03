from typing import Literal, Optional
from pydantic import BaseModel, Field


class ScheduleRequest(BaseModel):
    frequency: Literal["daily", "weekly", "bi-weekly", "monthly"]
    day_of_week: Optional[str] = None
    time: str = Field(pattern=r"^\d{2}:\d{2}$")
    recipients: str = Field(min_length=1)


class ScheduleResponse(BaseModel):
    id: str
    session_id: str
    frequency: str
    day_of_week: Optional[str] = None
    time: str
    recipients: str
