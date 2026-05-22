from typing import Optional
from app.schemas.pulse import PulseReportInfo
from app.services.mock_data import PULSE_REPORTS


class PulseService:
    async def list_reports(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        time_frame: Optional[str] = None,
    ) -> list[PulseReportInfo]:
        reports = PULSE_REPORTS
        if status and status != "all":
            reports = [r for r in reports if r["status"] == status]
        if category and category != "All Types":
            reports = [r for r in reports if r["category"] == category]
        return [PulseReportInfo(**r) for r in reports]

    async def get_report(self, report_id: str) -> Optional[PulseReportInfo]:
        report = next((r for r in PULSE_REPORTS if r["id"] == report_id), None)
        if not report:
            return None
        return PulseReportInfo(**report)

    async def update_status(self, report_id: str, status: str) -> Optional[PulseReportInfo]:
        report = next((r for r in PULSE_REPORTS if r["id"] == report_id), None)
        if not report:
            return None
        report["status"] = status
        return PulseReportInfo(**report)
