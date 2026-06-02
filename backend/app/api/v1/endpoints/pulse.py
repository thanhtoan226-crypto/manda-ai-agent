from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional

from app.schemas.pulse import (
    PulseReportListResponse,
    PulseReportInfo,
    PulseReportStatusUpdate,
    GenerateReportRequest,
)
from app.schemas.chat import ChatRequest
from app.services.pulse_service import PulseService
from app.services.pulse_action_service import PulseActionService

router = APIRouter(tags=["pulse"])


class ActionRequest(BaseModel):
    chip_id: str
    item_index: int = 0


@router.get("/reports", response_model=PulseReportListResponse)
async def list_reports(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    time_frame: Optional[str] = Query(None),
):
    service = PulseService()
    reports = await service.list_reports(status=status, category=category, time_frame=time_frame)
    return PulseReportListResponse(reports=reports, total=len(reports))


@router.post("/reports/generate", response_model=PulseReportInfo)
async def generate_report(request: GenerateReportRequest):
    """Generate a new Pulse report via LLM and save it to disk."""
    from app.services.report_generator import generate_and_save_report

    try:
        report = await generate_and_save_report(
            agent_id=request.agent_id,
            mode=request.mode,
            subject=request.subject,
        )
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        if "429" in str(e):
            raise HTTPException(status_code=503, detail="Rate limit exceeded. Please try again later.")
        raise

    if not report:
        raise HTTPException(status_code=500, detail="Report generation failed")

    service = PulseService()
    enriched = service._enrich_with_modules(report)
    return PulseReportInfo(**enriched)


@router.get("/reports/{report_id}", response_model=PulseReportInfo)
async def get_report(report_id: str):
    service = PulseService()
    report = await service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.put("/reports/{report_id}/status", response_model=PulseReportInfo)
async def update_report_status(report_id: str, body: PulseReportStatusUpdate):
    service = PulseService()
    report = await service.update_status(report_id, body.status)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/reports/{report_id}/drill-down")
async def drill_down(report_id: str, body: ActionRequest):
    """Stream a drill-down response for a specific insight item."""
    service = PulseService()
    report = await service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    action_service = PulseActionService()
    return StreamingResponse(
        action_service.stream_drill_down(report, body.chip_id, body.item_index),
        media_type="text/event-stream",
    )


@router.post("/reports/{report_id}/verify")
async def verify(report_id: str, body: ActionRequest):
    """Stream a verification response for a specific insight item."""
    service = PulseService()
    report = await service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    action_service = PulseActionService()
    return StreamingResponse(
        action_service.stream_verify(report, body.chip_id, body.item_index),
        media_type="text/event-stream",
    )


@router.post("/reports/{report_id}/chat/stream")
async def pulse_chat_stream(report_id: str, request: ChatRequest):
    service = PulseService()
    report = await service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")

    agent_id = report.agent_id or "agent-1on1"

    # Build enhanced message with chip/item context if provided
    message = request.message
    if request.chip_id:
        action_service = PulseActionService()
        item_text = action_service.get_item_text(report, request.chip_id, request.item_index or 0)
        if item_text:
            message = f"[Context: Discussing insight from '{request.chip_id}' section]\n\n{request.message}\n\nInsight being discussed: {item_text[:300]}"

    chat_request = ChatRequest(
        message=message,
        agent_id=agent_id,
        mode=request.mode or "coaching",
        conversation_id=request.conversation_id,
        chip_id=request.chip_id,
        item_index=request.item_index,
    )
    from app.services.chat_service import ChatService

    chat_service = ChatService()
    return StreamingResponse(
        chat_service.stream_message_for_agent(chat_request),
        media_type="text/event-stream",
    )
