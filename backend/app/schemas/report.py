from pydantic import BaseModel


class PinnedItem(BaseModel):
    id: str
    module_id: str
    chip_id: str
    title: str
    content: str


class PinRequest(BaseModel):
    module_id: str
    chip_id: str
    title: str
    content: str


class PinResponse(BaseModel):
    pinned: list[PinnedItem]


class ReportResponse(BaseModel):
    session_id: str
    title: str
    markdown: str
    updated_at: str


class ReportUpdateRequest(BaseModel):
    markdown: str
