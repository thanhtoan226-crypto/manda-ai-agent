import json
import uuid
from datetime import datetime, timezone
from typing import Optional

from langchain_core.messages import SystemMessage, HumanMessage

from app.core.llm import get_llm, is_llm_configured
from app.agents.prompts import get_prompt
from app.agents.context import build_context
from app.schemas.session import (
    SessionSummary,
    SessionListResponse,
    SessionDetail,
    ContentModule,
    ChipInfo,
)
from app.schemas.report import PinnedItem, PinRequest
from app.services.mock_data import (
    SESSIONS,
    CONTENT_MODULES,
    PINNED_ITEMS,
    CHAT_MESSAGES,
    REPORTS,
    create_session as _create_session,
    DRILL_DOWN_CONTENT,
)


class SessionService:
    async def list_sessions(self, agent_id: Optional[str] = None) -> SessionListResponse:
        sessions = SESSIONS
        if agent_id:
            sessions = [s for s in sessions if s["agent_id"] == agent_id]
        return SessionListResponse(sessions=[SessionSummary(**s) for s in sessions])

    async def get_session(self, session_id: str) -> Optional[SessionDetail]:
        session = next((s for s in SESSIONS if s["id"] == session_id), None)
        if not session:
            return None
        modules = CONTENT_MODULES.get(session_id, [])
        messages = CHAT_MESSAGES.get(session_id, [])
        return SessionDetail(
            **session,
            modules=[
                ContentModule(
                    id=m["id"],
                    title=m["title"],
                    chips=[ChipInfo(**c) for c in m["chips"]],
                    content=m["content"],
                )
                for m in modules
            ],
            messages=messages,
        )

    async def create_session(
        self, agent_id: str, title: Optional[str] = None, subject: Optional[str] = None
    ) -> SessionDetail:
        session = _create_session(agent_id, title, subject)
        return SessionDetail(
            **session,
            modules=[],
            messages=[],
        )

    async def pin_item(self, session_id: str, request: PinRequest) -> Optional[PinnedItem]:
        if session_id not in PINNED_ITEMS:
            PINNED_ITEMS[session_id] = []
        pin_id = f"pin-{uuid.uuid4().hex[:8]}"
        item = PinnedItem(
            id=pin_id,
            module_id=request.module_id,
            chip_id=request.chip_id,
            title=request.title,
            content=request.content,
        )
        # Check if already pinned
        existing = next(
            (
                p
                for p in PINNED_ITEMS[session_id]
                if p["module_id"] == request.module_id and p["chip_id"] == request.chip_id
            ),
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

    async def get_drill_down(self, session_id: str, chip_id: str) -> Optional[str]:
        if not is_llm_configured():
            return DRILL_DOWN_CONTENT.get(chip_id)

        llm = get_llm()
        if not llm:
            return DRILL_DOWN_CONTENT.get(chip_id)

        session = next((s for s in SESSIONS if s["id"] == session_id), None)
        agent_id = session["agent_id"] if session else "agent-1on1"
        mode = session.get("mode", "coaching") if session else "coaching"

        prompt_config = get_prompt(agent_id, mode)
        context = build_context(agent_id, None, mode)

        # Find the chip content from the session's modules
        chip_content = self._find_chip_content(session_id, chip_id)
        if not chip_content:
            return DRILL_DOWN_CONTENT.get(chip_id)

        messages = [
            SystemMessage(
                content=f"{prompt_config.system_prompt}\n\n{context}\n\nProvide a deeper drill-down analysis of the following insight. Expand on the data, add context, and suggest specific actions."
            ),
            HumanMessage(content=f"Drill deeper into this insight:\n\n{chip_content}"),
        ]
        result = await llm.ainvoke(messages)
        return result.content

    def _find_chip_content(self, session_id: str, chip_id: str) -> Optional[str]:
        """Find and format chip content from the session's modules for drill-down context."""
        modules = CONTENT_MODULES.get(session_id, [])
        for module in modules:
            content = module.get("content", {})
            if chip_id in content:
                chip_data = content[chip_id]
                return (
                    json.dumps(chip_data, indent=2)
                    if isinstance(chip_data, dict)
                    else str(chip_data)
                )
        return None

    async def apply_chat(self, session_id: str, content: str) -> bool:
        if session_id not in REPORTS:
            return False
        report = REPORTS[session_id]
        report["markdown"] += f"\n\n{content}"
        report["updated_at"] = datetime.now(timezone.utc).isoformat()
        return True
