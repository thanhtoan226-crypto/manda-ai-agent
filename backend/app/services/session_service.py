from typing import Optional

from app.schemas.session import SessionSummary, SessionListResponse, SessionDetail, ContentModule, ChipInfo
from app.schemas.report import PinnedItem, PinRequest
from app.services.mock_data import (
    SESSIONS, CONTENT_MODULES, PINNED_ITEMS, CHAT_MESSAGES,
    create_session as _create_session, DRILL_DOWN_CONTENT,
)


class SessionService:
    async def list_sessions(self, agent_id: Optional[str] = None) -> SessionListResponse:
        sessions = SESSIONS
        if agent_id:
            sessions = [s for s in sessions if s["agent_id"] == agent_id]
        return SessionListResponse(
            sessions=[SessionSummary(**s) for s in sessions]
        )

    async def get_session(self, session_id: str) -> Optional[SessionDetail]:
        session = next((s for s in SESSIONS if s["id"] == session_id), None)
        if not session:
            return None
        modules = CONTENT_MODULES.get(session_id, [])
        messages = CHAT_MESSAGES.get(session_id, [])
        return SessionDetail(
            **session,
            modules=[ContentModule(
                id=m["id"],
                title=m["title"],
                chips=[ChipInfo(**c) for c in m["chips"]],
                content=m["content"],
            ) for m in modules],
            messages=messages,
        )

    async def create_session(self, agent_id: str, title: Optional[str] = None) -> SessionDetail:
        session = _create_session(agent_id, title)
        return SessionDetail(
            **session,
            modules=[],
            messages=[],
        )

    async def pin_item(self, session_id: str, request: PinRequest) -> Optional[PinnedItem]:
        if session_id not in PINNED_ITEMS:
            PINNED_ITEMS[session_id] = []
        pin_id = f"pin-{len(PINNED_ITEMS[session_id]) + 1}"
        item = PinnedItem(
            id=pin_id,
            module_id=request.module_id,
            chip_id=request.chip_id,
            title=request.title,
            content=request.content,
        )
        # Check if already pinned
        existing = next(
            (p for p in PINNED_ITEMS[session_id]
             if p["module_id"] == request.module_id and p["chip_id"] == request.chip_id),
            None,
        )
        if existing:
            # Unpin
            PINNED_ITEMS[session_id].remove(existing)
            return None
        PINNED_ITEMS[session_id].append(item.model_dump())
        return item

    async def get_pinned(self, session_id: str) -> list[PinnedItem]:
        items = PINNED_ITEMS.get(session_id, [])
        return [PinnedItem(**p) for p in items]

    async def set_mode(self, session_id: str, mode: str) -> Optional[SessionSummary]:
        session = next((s for s in SESSIONS if s["id"] == session_id), None)
        if not session:
            return None
        session["mode"] = mode
        return SessionSummary(**session)

    async def get_drill_down(self, chip_id: str) -> Optional[str]:
        return DRILL_DOWN_CONTENT.get(chip_id)
