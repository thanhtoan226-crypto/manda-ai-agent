from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.schemas.meeting import (
    MeetingCreateRequest,
    MandaMeetingSettingsUpdate,
    MeetingTemplateCreateRequest,
    GenerateDescriptionRequest,
    RewriteDescriptionRequest,
)
from app.services.meeting_service import MeetingService
from app.services.meeting_llm_service import MeetingLLMService

router = APIRouter()


@router.get("/")
async def list_meetings(
    time_frame: str = Query("all-time", description="Time frame filter"),
    role: str = Query("all", description="Role filter: all, organiser, attendee"),
    search: Optional[str] = Query(None, description="Search by title"),
):
    service = MeetingService()
    return await service.list_meetings(time_frame=time_frame, role=role, search=search)


@router.post("/")
async def create_meeting(request: MeetingCreateRequest):
    service = MeetingService()
    return await service.create_meeting(request)


@router.post("/generate-description")
async def generate_description(request: GenerateDescriptionRequest):
    service = MeetingLLMService()
    return StreamingResponse(
        service.generate_description(request),
        media_type="text/event-stream",
    )


@router.post("/rewrite-description")
async def rewrite_description(request: RewriteDescriptionRequest):
    service = MeetingLLMService()
    return StreamingResponse(
        service.rewrite_description(request),
        media_type="text/event-stream",
    )


@router.get("/settings")
async def get_settings():
    service = MeetingService()
    return await service.get_settings()


@router.put("/settings")
async def update_settings(update: MandaMeetingSettingsUpdate):
    service = MeetingService()
    return await service.update_settings("user-default", update)


@router.get("/templates")
async def list_templates():
    service = MeetingService()
    return await service.list_templates()


@router.post("/templates")
async def create_template(request: MeetingTemplateCreateRequest):
    service = MeetingService()
    return await service.create_template(request.name, request.content)


@router.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    service = MeetingService()
    deleted = await service.delete_template(template_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Template not found or is built-in")
    return {"status": "deleted", "template_id": template_id}


@router.get("/{meeting_id}")
async def get_meeting(meeting_id: str):
    service = MeetingService()
    result = await service.get_meeting(meeting_id)
    if not result:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return result


@router.delete("/{meeting_id}")
async def delete_meeting(meeting_id: str):
    service = MeetingService()
    deleted = await service.delete_meeting(meeting_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return {"status": "deleted", "meeting_id": meeting_id}
