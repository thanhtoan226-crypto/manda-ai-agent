from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class Attendee(BaseModel):
    id: str = ""
    name: str
    email: str
    type: Literal["required", "optional"] = "required"
    status: Literal["accepted", "tentative", "declined", "no_response"] = "no_response"


class Meeting(BaseModel):
    id: str
    title: str
    description: str | None = None
    organiser: str
    attendees: list[Attendee] = Field(default_factory=list)
    start_time: datetime
    end_time: datetime
    location: str | None = None
    category_color: str = "BLUE"
    is_manda_created: bool = False
    created_at: datetime
    updated_at: datetime


class MeetingListResponse(BaseModel):
    meetings: list[Meeting]
    total: int


class MeetingCreateRequest(BaseModel):
    title: str
    description: str | None = None
    organiser: str
    attendees: list[Attendee] = Field(default_factory=list)
    start_time: datetime
    end_time: datetime
    location: str | None = None
    category_color: str = "BLUE"
    is_manda_created: bool = False


class GenerateDescriptionRequest(BaseModel):
    prompt: str
    generate_purpose: bool = True
    generate_outcomes: bool = True
    generate_agenda: bool = True
    personality: Literal["formal", "casual", "corporate", "friendly", "direct"] = "formal"
    context_prompt: str = ""
    template: str | None = None


class RewriteDescriptionRequest(BaseModel):
    current_description: str
    prompt: str
    personality: Literal["formal", "casual", "corporate", "friendly", "direct"] = "formal"
    context_prompt: str = ""


class MandaMeetingSettings(BaseModel):
    id: str = ""
    auto_color: str = "BLUE"
    personality: Literal["formal", "casual", "corporate", "friendly", "direct"] = "formal"
    context_prompt: str = ""
    enabled_templates: list[str] = Field(
        default_factory=lambda: [
            "tmpl-1on1",
            "tmpl-standup",
            "tmpl-kickoff",
            "tmpl-quarterly",
            "tmpl-brainstorm",
            "tmpl-retro",
        ]
    )
    company_branding_enabled: bool = False
    brand_color: str | None = None
    brand_header_text: str | None = None
    brand_footer_text: str | None = None
    safety_checks: list[str] = Field(
        default_factory=lambda: ["missing_agenda", "missing_purpose_outcome"]
    )


class MandaMeetingSettingsUpdate(BaseModel):
    auto_color: str | None = None
    personality: Literal["formal", "casual", "corporate", "friendly", "direct"] | None = None
    context_prompt: str | None = None
    enabled_templates: list[str] | None = None
    company_branding_enabled: bool | None = None
    brand_color: str | None = None
    brand_header_text: str | None = None
    brand_footer_text: str | None = None
    safety_checks: list[str] | None = None


class MeetingTemplate(BaseModel):
    id: str
    name: str
    content: str
    is_builtin: bool = False
    user_id: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class MeetingTemplateCreateRequest(BaseModel):
    name: str
    content: str
