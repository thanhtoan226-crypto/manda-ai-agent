from typing import Optional
import uuid
from app.schemas.schedule import ScheduleRequest, ScheduleResponse
from app.services.mock_data import SCHEDULES


class ScheduleService:
    async def create_schedule(self, session_id: str, request: ScheduleRequest) -> ScheduleResponse:
        schedule_id = f"schedule-{uuid.uuid4().hex[:8]}"
        schedule = ScheduleResponse(
            id=schedule_id,
            session_id=session_id,
            frequency=request.frequency,
            day_of_week=request.day_of_week,
            time=request.time,
            recipients=request.recipients,
        )
        SCHEDULES[session_id] = schedule.model_dump()
        return schedule

    async def get_schedule(self, session_id: str) -> Optional[ScheduleResponse]:
        schedule = SCHEDULES.get(session_id)
        if not schedule:
            return None
        return ScheduleResponse(**schedule)
