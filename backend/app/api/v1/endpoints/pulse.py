from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from app.schemas.pulse import PulseReportListResponse, PulseReportInfo, PulseReportStatusUpdate
from app.services.pulse_service import PulseService

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
