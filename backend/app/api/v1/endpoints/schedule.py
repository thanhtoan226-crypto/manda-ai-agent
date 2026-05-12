from typing import Union
from fastapi import APIRouter

from app.schemas.schedule import ScheduleRequest, ScheduleResponse
from app.services.schedule_service import ScheduleService

router = APIRouter()


@router.post("/{session_id}", response_model=ScheduleResponse)
async def create_schedule(session_id: str, request: ScheduleRequest):
    service = ScheduleService()
    return await service.create_schedule(session_id, request)


@router.get("/{session_id}")
async def get_schedule(session_id: str):
    service = ScheduleService()
    result = await service.get_schedule(session_id)
    if not result:
        return {"message": "No schedule found"}
    return result
