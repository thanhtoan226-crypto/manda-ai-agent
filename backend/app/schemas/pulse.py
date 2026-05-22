from pydantic import BaseModel


class PulseReportInfo(BaseModel):
    id: str
    title: str
    agent_name: str
    category: str
    status: str
    preview: str
    markdown: str
    created_at: str
    updated_at: str


class PulseReportListResponse(BaseModel):
    reports: list[PulseReportInfo]
    total: int


class PulseReportStatusUpdate(BaseModel):
    status: str
