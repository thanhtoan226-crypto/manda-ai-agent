import re
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import frontmatter

from app.core.config import settings

DATA_DIR = Path(settings.REPORTS_DATA_DIR)

PROTECTED_REPORTS = {"1on1-prep-brief-Chris-Peterson.md"}

_reports_cache: Optional[dict[str, dict]] = None
_cache_mtime: Optional[float] = None


def is_protected_report(filename: str) -> bool:
    return filename in PROTECTED_REPORTS


def _latest_data_mtime() -> Optional[float]:
    """Get the most recent modification time of any MD file in the data dir."""
    if not DATA_DIR.exists():
        return None
    mtimes = [f.stat().st_mtime for f in DATA_DIR.glob("*.md")]
    return max(mtimes) if mtimes else None


def _load_reports() -> dict[str, dict]:
    global _reports_cache, _cache_mtime

    # In DEBUG mode, auto-invalidate cache if MD files changed
    if _reports_cache is not None:
        if settings.DEBUG:
            current_mtime = _latest_data_mtime()
            if current_mtime and _cache_mtime and current_mtime > _cache_mtime:
                _reports_cache = None
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
    _cache_mtime = _latest_data_mtime()
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


def generate_report_filename(title: str) -> str:
    """Create a safe filename from a report title, with a short UUID suffix."""
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    slug = re.sub(r"-+", "-", slug)
    short_id = uuid.uuid4().hex[:6]
    return f"{slug}-{short_id}.md"


def save_report(frontmatter_dict: dict, markdown_body: str) -> dict:
    """Write a new report MD file to the data dir and update the cache."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    filename = generate_report_filename(frontmatter_dict.get("title", "report"))
    if is_protected_report(filename):
        raise ValueError(f"Cannot overwrite protected report: {filename}")
    filepath = DATA_DIR / filename

    post = frontmatter.Post(markdown_body, **frontmatter_dict)
    filepath.write_text(frontmatter.dumps(post), encoding="utf-8")

    report_id = frontmatter_dict.get("id", filepath.stem)
    report = {
        "id": report_id,
        "title": frontmatter_dict.get("title", ""),
        "agent_name": frontmatter_dict.get("agent_name", ""),
        "agent_id": frontmatter_dict.get("agent_id", ""),
        "category": frontmatter_dict.get("category", ""),
        "status": frontmatter_dict.get("status", "unread"),
        "preview": frontmatter_dict.get("preview", ""),
        "markdown": markdown_body,
        "created_at": frontmatter_dict.get("created_at", ""),
        "updated_at": frontmatter_dict.get("updated_at", ""),
    }

    cache = _load_reports()
    cache[report_id] = report

    global _cache_mtime
    _cache_mtime = _latest_data_mtime()

    return report


def seed_report(target_filename: str, template_filename: str) -> None:
    """Copy a template to the reports dir if it doesn't already exist."""
    target = DATA_DIR / target_filename
    if target.exists():
        return

    template_path = Path(settings.TEMPLATES_DATA_DIR) / template_filename
    if not template_path.exists():
        return

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    shutil.copy2(template_path, target)

    global _cache_mtime
    _cache_mtime = None


def seed_chris_peterson_report() -> None:
    """Copy the Chris Peterson report from docs/data/ if it doesn't exist in reports."""
    seed_report("1on1-prep-brief-Chris-Peterson.md", "sample-1on1-prep-brief.md")


def seed_recurring_meeting_audit_report() -> None:
    """Copy the Recurring Meeting Audit report from docs/data/ if it doesn't exist."""
    seed_report(
        "recurring-meeting-audit-sarah-chen-may-2026.md",
        "sample-recurring-meeting-audit.md",
    )


def seed_executive_digest_report() -> None:
    """Copy the Executive Digest report from docs/data/ if it doesn't exist."""
    seed_report(
        "executive-digest-weekly-1-7-jun-2026.md",
        "sample-executive-digest-weekly.md",
    )


def seed_team_health_check_report() -> None:
    """Copy the Team Health Check report from docs/data/ if it doesn't exist."""
    seed_report(
        "team-health-check-engineering-may-2026.md",
        "sample-team-health-check-engineering.md",
    )
