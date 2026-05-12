from typing import Optional
from pydantic import BaseModel


class ChatMessage(BaseModel):
    id: Optional[str] = None
    role: str
    content: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    agent_id: Optional[str] = None
    session_id: Optional[str] = None
    mode: Optional[str] = None


class ChatResponse(BaseModel):
    message: ChatMessage
    conversation_id: str
