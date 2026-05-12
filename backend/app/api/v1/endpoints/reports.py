from fastapi import APIRouter, HTTPException

from app.schemas.report import ReportResponse, ReportUpdateRequest
from app.services.report_service import ReportService

router = APIRouter()


@router.get("/{session_id}", response_model=ReportResponse)
async def get_report(session_id: str):
    service = ReportService()
    result = await service.get_report(session_id)
    if not result:
        raise HTTPException(status_code=404, detail="Report not found")
    return result


@router.put("/{session_id}", response_model=ReportResponse)
async def update_report(session_id: str, request: ReportUpdateRequest):
    service = ReportService()
    result = await service.update_report(session_id, request)
    if not result:
        raise HTTPException(status_code=404, detail="Report not found")
    return result
