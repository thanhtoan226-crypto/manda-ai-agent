from pathlib import Path
from typing import Optional

import frontmatter

from app.core.config import settings

DATA_DIR = Path(settings.REPORTS_DATA_DIR)

_reports_cache: Optional[dict[str, dict]] = None


def _load_reports() -> dict[str, dict]:
    global _reports_cache
    if _reports_cache is not None:
        return _reports_cache

    cache: dict[str, dict] = {}
    if not DATA_DIR.exists():
        _reports_cache = cache
        return cache

    for filepath in sorted(DATA_DIR.glob("*.md")):
        post = frontmatter.load(filepath)
        report_id = post.get("id", filepath.stem)
        cache[report_id] = {
            "id": report_id,
            "title": post.get("title", ""),
            "agent_name": post.get("agent_name", ""),
            "agent_id": post.get("agent_id", ""),
            "category": post.get("category", ""),
            "status": post.get("status", "unread"),
            "preview": post.get("preview", ""),
            "markdown": post.content,
            "created_at": post.get("created_at", ""),
            "updated_at": post.get("updated_at", ""),
        }

    _reports_cache = cache
    return cache


def get_reports() -> list[dict]:
    cache = _load_reports()
    return list(cache.values())


def get_report(report_id: str) -> Optional[dict]:
    cache = _load_reports()
    return cache.get(report_id)


def update_report_status(report_id: str, status: str) -> Optional[dict]:
    cache = _load_reports()
    report = cache.get(report_id)
    if report:
        report["status"] = status
    return report


def reload_reports() -> None:
    global _reports_cache
    _reports_cache = None
