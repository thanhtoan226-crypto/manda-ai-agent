from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from typing import Optional

from app.schemas.pulse import PulseReportListResponse, PulseReportInfo, PulseReportStatusUpdate
from app.schemas.chat import ChatRequest
from app.services.pulse_service import PulseService
from app.services.mock_data import DRILL_DOWN_CONTENT

router = APIRouter(tags=["pulse"])


@router.get("/reports", response_model=PulseReportListResponse)
async def list_reports(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    time_frame: Optional[str] = Query(None),
):
    service = PulseService()
    reports = await service.list_reports(status=status, category=category, time_frame=time_frame)
    return PulseReportListResponse(reports=reports, total=len(reports))


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


@router.get("/reports/{report_id}/drill-down")
async def drill_down(report_id: str, chip_id: str = Query(...)):
    service = PulseService()
    report = await service.get_report(report_id)
    agent_id = report.agent_id if report else ""
    key = f"{agent_id}::{chip_id}" if agent_id else chip_id
    content = DRILL_DOWN_CONTENT.get(key) or DRILL_DOWN_CONTENT.get(chip_id)
    if not content:
        return {"content": "No additional detail available for this section."}
    return {"content": content}


@router.post("/reports/{report_id}/chat/stream")
async def pulse_chat_stream(report_id: str, request: ChatRequest):
    service = PulseService()
    report = await service.get_report(report_id)
    agent_id = report.agent_id if report else "agent-1on1"
    chat_request = ChatRequest(
        message=request.message,
        agent_id=agent_id,
        mode=request.mode or "coaching",
        conversation_id=request.conversation_id,
    )
    from app.services.chat_service import ChatService

    chat_service = ChatService()
    return StreamingResponse(
        chat_service.stream_message_for_agent(chat_request),
        media_type="text/event-stream",
    )
