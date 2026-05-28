from fastapi import APIRouter

from app.api.v1.endpoints import chat, agents, sessions, reports, schedule, pulse, learning

router = APIRouter()
router.include_router(agents.router, prefix="/agents", tags=["agents"])
router.include_router(chat.router, prefix="/chat", tags=["chat"])
router.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
router.include_router(reports.router, prefix="/reports", tags=["reports"])
router.include_router(schedule.router, prefix="/schedule", tags=["schedule"])
router.include_router(pulse.router, prefix="/pulse", tags=["pulse"])
router.include_router(learning.router, prefix="/learning", tags=["learning"])
