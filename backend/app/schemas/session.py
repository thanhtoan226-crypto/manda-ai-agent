from typing import Optional
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
    content: dict


class SessionDetail(BaseModel):
    id: str
    agent_id: str
    title: str
    created_at: str
    updated_at: str
    preview: str
    mode: Optional[str] = None
    modules: list[ContentModule]
    messages: list[dict]


class ApplyChatRequest(BaseModel):
    content: str
