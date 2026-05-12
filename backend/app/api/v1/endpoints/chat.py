from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def create_chat(request: ChatRequest):
    service = ChatService()
    response = await service.process_message(request)
    return response


@router.post("/stream")
async def stream_chat(request: ChatRequest):
    service = ChatService()
    return StreamingResponse(
        service.stream_message(request),
        media_type="text/event-stream",
    )
