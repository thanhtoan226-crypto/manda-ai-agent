from typing import Optional

from app.schemas.pulse import PulseReportInfo
from app.schemas.session import ChipInfo, ContentModule
from app.services import report_loader
from app.services.mock_data import AGENT_MODULES


class PulseService:
    def _enrich_with_modules(self, report: dict) -> dict:
        report = dict(report)
        agent_id = report.get("agent_id", "")
        if agent_id and agent_id in AGENT_MODULES:
            raw_modules = AGENT_MODULES[agent_id]
            modules = []
            for m in raw_modules:
                chips = [ChipInfo(**c) for c in m.get("chips", [])]
                modules.append(ContentModule(id=m["id"], title=m["title"], chips=chips, content=m["content"]))
            report["modules"] = modules
        return report

    async def list_reports(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        time_frame: Optional[str] = None,
    ) -> list[PulseReportInfo]:
        reports = report_loader.get_reports()
        if status and status != "all":
            reports = [r for r in reports if r["status"] == status]
        if category and category != "All Types":
            reports = [r for r in reports if r["category"] == category]
        return [PulseReportInfo(**self._enrich_with_modules(r)) for r in reports]

    async def get_report(self, report_id: str) -> Optional[PulseReportInfo]:
        report = report_loader.get_report(report_id)
        if not report:
            return None
        return PulseReportInfo(**self._enrich_with_modules(report))

    async def update_status(self, report_id: str, status: str) -> Optional[PulseReportInfo]:
        report = report_loader.update_report_status(report_id, status)
        if not report:
            return None
        return PulseReportInfo(**self._enrich_with_modules(report))
