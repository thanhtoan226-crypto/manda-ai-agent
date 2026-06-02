from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import router as v1_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Manda AI Agent API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")


@app.on_event("startup")
async def startup():
    from app.services.report_loader import (
        seed_chris_peterson_report,
        seed_recurring_meeting_audit_report,
        seed_executive_digest_report,
        seed_team_health_check_report,
    )

    seed_chris_peterson_report()
    seed_recurring_meeting_audit_report()
    seed_executive_digest_report()
    seed_team_health_check_report()


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.VERSION}
