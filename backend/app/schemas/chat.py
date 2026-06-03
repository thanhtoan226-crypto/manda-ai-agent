from typing import Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    id: Optional[str] = None
    role: str
    content: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=10000)
    conversation_id: Optional[str] = None
    agent_id: Optional[str] = None
    session_id: Optional[str] = None
    mode: Optional[str] = None
    chip_id: Optional[str] = None
    item_index: Optional[int] = None


class ChatResponse(BaseModel):
    message: ChatMessage
    conversation_id: str
