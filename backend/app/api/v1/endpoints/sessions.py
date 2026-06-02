from typing import Optional

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.schemas.session import SessionListResponse, SessionDetail, SessionCreateRequest, ApplyChatRequest
from app.schemas.report import PinRequest, PinnedItem
from app.services.session_service import SessionService
from app.services.chat_service import ChatService

router = APIRouter()


@router.get("/", response_model=SessionListResponse)
async def list_sessions(agent_id: Optional[str] = None):
    service = SessionService()
    return await service.list_sessions(agent_id)


@router.get("/{session_id}", response_model=SessionDetail)
async def get_session(session_id: str):
    service = SessionService()
    result = await service.get_session(session_id)
    if not result:
        raise HTTPException(status_code=404, detail="Session not found")
    return result


@router.post("/", response_model=SessionDetail)
async def create_session(request: SessionCreateRequest):
    service = SessionService()
    return await service.create_session(request.agent_id, request.title, request.subject)


@router.post("/{session_id}/pin")
async def pin_item(session_id: str, request: PinRequest):
    service = SessionService()
    result = await service.pin_item(session_id, request)
    if result is None:
        return {"unpinned": True}
    return result


@router.get("/{session_id}/pinned", response_model=list[PinnedItem])
async def get_pinned(session_id: str):
    service = SessionService()
    return await service.get_pinned(session_id)


@router.put("/{session_id}/mode")
async def set_mode(session_id: str, mode: str):
    service = SessionService()
    result = await service.set_mode(session_id, mode)
    if not result:
        raise HTTPException(status_code=404, detail="Session not found")
    return result


@router.post("/{session_id}/content/stream")
async def stream_initial_content(
    session_id: str, mode: str = "coaching", subject: Optional[str] = None
):
    service = ChatService()
    return StreamingResponse(
        service.stream_initial_content(session_id, mode, subject),
        media_type="text/event-stream",
    )


@router.get("/{session_id}/drill-down")
async def get_drill_down(session_id: str, chip_id: str):
    service = SessionService()
    result = await service.get_drill_down(session_id, chip_id)
    if not result:
        raise HTTPException(status_code=404, detail="Drill-down content not found")
    return {"content": result}


@router.post("/{session_id}/apply-chat")
async def apply_chat(session_id: str, request: ApplyChatRequest):
    service = SessionService()
    result = await service.apply_chat(session_id, request.content)
    if not result:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "applied", "session_id": session_id}
