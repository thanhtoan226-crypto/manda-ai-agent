from typing import Any, Optional
from pydantic import BaseModel


class SessionSummary(BaseModel):
    id: str
    agent_id: str
    title: str
    created_at: str
    updated_at: str
    preview: str
    mode: Optional[str] = None
    subject: Optional[str] = None


class SessionListResponse(BaseModel):
    sessions: list[SessionSummary]


class SessionCreateRequest(BaseModel):
    agent_id: str
    title: Optional[str] = None
    subject: Optional[str] = None


class ChipInfo(BaseModel):
    id: str
    label: str
    enabled: bool


class ContentModule(BaseModel):
    id: str
    title: str
    chips: list[ChipInfo]
    content: dict[str, Any]


class ChatMessageSchema(BaseModel):
    id: str
    role: str
    content: str
    timestamp: Optional[str] = None


class SessionDetail(BaseModel):
    id: str
    agent_id: str
    title: str
    created_at: str
    updated_at: str
    preview: str
    mode: Optional[str] = None
    modules: list[ContentModule]
    messages: list[ChatMessageSchema]


class ApplyChatRequest(BaseModel):
    content: str
