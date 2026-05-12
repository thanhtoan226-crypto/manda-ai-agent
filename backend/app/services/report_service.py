from typing import Optional
from app.schemas.report import ReportResponse, ReportUpdateRequest
from app.services.mock_data import REPORTS


class ReportService:
    async def get_report(self, session_id: str) -> Optional[ReportResponse]:
        report = REPORTS.get(session_id)
        if not report:
            return None
        return ReportResponse(**report)

    async def update_report(self, session_id: str, request: ReportUpdateRequest) -> Optional[ReportResponse]:
        report = REPORTS.get(session_id)
        if not report:
            return None
        report["markdown"] = request.markdown
        from datetime import datetime
        report["updated_at"] = datetime.now().isoformat()
        return ReportResponse(**report)
