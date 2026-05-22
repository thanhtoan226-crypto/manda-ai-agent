from fastapi import APIRouter, HTTPException

from app.schemas.schedule import ScheduleRequest, ScheduleResponse
from app.services.schedule_service import ScheduleService

router = APIRouter()


@router.post("/{session_id}", response_model=ScheduleResponse)
async def create_schedule(session_id: str, request: ScheduleRequest):
    service = ScheduleService()
    return await service.create_schedule(session_id, request)


@router.get("/{session_id}", response_model=ScheduleResponse)
async def get_schedule(session_id: str):
    service = ScheduleService()
    result = await service.get_schedule(session_id)
    if not result:
        raise HTTPException(status_code=404, detail="No schedule found")
    return result
