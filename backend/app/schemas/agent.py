from typing import Optional
from pydantic import BaseModel


class AgentInfo(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    category: str
    purpose: Optional[str] = None
    tags: list[str] = []
    integrations: list[str] = []
    is_favorite: bool
    usage_count: int
    last_used: Optional[str] = None
    last_generated: Optional[str] = None


class AgentListResponse(BaseModel):
    agents: list[AgentInfo]


class ConversationMode(BaseModel):
    id: str
    label: str
    description: str


class AgentDetailResponse(BaseModel):
    agent: AgentInfo
    modes: list[ConversationMode]
