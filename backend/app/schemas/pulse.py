from typing import Optional

from pydantic import BaseModel

from app.schemas.session import ContentModule


class PulseReportInfo(BaseModel):
    id: str
    title: str
    agent_name: str
    agent_id: str = ""
    category: str
    status: str
    preview: str
    markdown: str
    modules: Optional[list[ContentModule]] = None
    created_at: str
    updated_at: str


class PulseReportListResponse(BaseModel):
    reports: list[PulseReportInfo]
    total: int


class PulseReportStatusUpdate(BaseModel):
    status: str
