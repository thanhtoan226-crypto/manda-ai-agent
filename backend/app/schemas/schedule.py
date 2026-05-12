from typing import Optional
from pydantic import BaseModel


class ScheduleRequest(BaseModel):
    frequency: str  # daily, weekly, bi-weekly, monthly
    day_of_week: Optional[str] = None
    time: str
    recipients: str  # comma-separated emails


class ScheduleResponse(BaseModel):
    id: str
    session_id: str
    frequency: str
    day_of_week: Optional[str] = None
    time: str
    recipients: str
