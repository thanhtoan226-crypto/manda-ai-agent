import re
from pathlib import Path

import frontmatter

from app.core.config import settings

TEMPLATES_DIR = Path(settings.TEMPLATES_DATA_DIR)

AGENT_TEMPLATE_MAP = {
    "agent-1on1": "sample-1on1-prep-brief.md",
    "agent-executive": "sample-executive-digest-weekly.md",
    "agent-recurring": "sample-recurring-meeting-audit.md",
    "agent-team-health": "sample-team-health-check-engineering.md",
}

_templates_cache: dict[str, str] = {}
_cache_mtime: float | None = None


def _latest_data_mtime() -> float:
    mtime = 0.0
    for f in TEMPLATES_DIR.glob("*.md"):
        mtime = max(mtime, f.stat().st_mtime)
    return mtime


def _invalidate_if_stale():
    global _cache_mtime, _templates_cache
    if settings.DEBUG:
        current = _latest_data_mtime()
        if _cache_mtime is not None and current > _cache_mtime:
            _templates_cache.clear()
            _cache_mtime = current


def get_template(agent_id: str) -> str:
    """Return the full template MD content (frontmatter + body) for an agent."""
    _invalidate_if_stale()

    if agent_id in _templates_cache:
        return _templates_cache[agent_id]

    filename = AGENT_TEMPLATE_MAP.get(agent_id)
    if not filename:
        raise ValueError(f"No template mapped for agent_id: {agent_id}")

    filepath = TEMPLATES_DIR / filename
    if not filepath.exists():
        raise FileNotFoundError(f"Template file not found: {filepath}")

    content = filepath.read_text(encoding="utf-8")

    global _cache_mtime
    if _cache_mtime is None:
        _cache_mtime = _latest_data_mtime()

    _templates_cache[agent_id] = content
    return content


def get_template_body(agent_id: str) -> str:
    """Return just the markdown body (no frontmatter) for an agent template."""
    content = get_template(agent_id)
    post = frontmatter.loads(content)
    return post.content


def get_template_path(agent_id: str) -> Path | None:
    """Return the file path for an agent template, or None if not mapped."""
    filename = AGENT_TEMPLATE_MAP.get(agent_id)
    if not filename:
        return None
    return TEMPLATES_DIR / filename


# Specific names/words to strip per agent to prevent LLM anchoring on template data
_NAMES_TO_SANITIZE = [
    "Chris Peterson", "Chris", "Chris's",
    "Sarah Chen", "Sarah", "Sarah's",
    "Mart Thompson", "Mart", "Mart's",
    "Damien Kowalski", "Damien", "Damien's",
    "Jessie Chen", "Jessie", "Jessie's",
    "Johnny Tran", "Johnny", "Johnny's",
    "Jackson", "Jackson's",
    "Lin Wei", "Lin", "Lin's",
    "Alex Morrison", "Alex", "Alex's",
    "Sam Patel", "Sam", "Sam's",
    "Priya Sharma", "Priya", "Priya's",
    "Taylor Brooks", "Taylor", "Taylor's",
    "Luke Fletcher", "Luke", "Luke's",
]

_VENDORS = ["Google", "Atlassian", "Searce", "Salesforce", "AvePoint", "Tableau"]

_MEETINGS = [
    r"Due Diligence stakeholder stand up",
    r"ETech Weekly Wednesday (?:Team )?Update",
    r"SETI JPD refinement",
    r"Apps Team Standup",
    r"ETech Apps Stand up(?: \(2026 Series\))?",
    r"Enterprise App Leads Weekly",
    r"Apps Team:? JPD Prioritisation(?: and Backlog clean up)?",
    r"GWS Technical Discovery",
    r"Q3 Planning Kick-?off",
    r"Product-Eng Alignment",
    r"Data Platform Roadmap",
    r"Searce offshore coordination",
    r"Google Workspace Discovery",
    r"Catch-up",
    r"Status Update",
    r"Tech Debt Review",
    r"Cross-team Sync",
    r"Vendor Alignment",
    r"Sprint Review Prep",
    r"Weekly Sprint Sync",
    r"Sprint Planning",
    r"Daily Standup",
    r"Team Retrospective",
]


def get_template_body_sanitized(agent_id: str) -> str:
    """Return the template body with specific data stripped to prevent LLM anchoring.

    Removes specific names, dollar amounts, vendor names, meeting names, and
    other concrete data that the LLM would otherwise copy. The structural skeleton
    (headings, table headers, content patterns) is preserved.
    """
    body = get_template_body(agent_id)

    # Replace dollar amounts: $9,780, $5,700, $687,200 → $[COST]
    body = re.sub(r"\$\d{1,3}(?:,\d{3})+(?:\.\d+)?", "$[COST]", body)
    body = re.sub(r"\$\d+(?:\.\d+)?(?=/(?:mo|month|week|hr))", "$[COST]", body)

    # Replace specific meeting names (before generic word substitutions)
    for meeting in _MEETINGS:
        body = re.sub(meeting, "[MEETING]", body, flags=re.IGNORECASE)

    # Replace vendor names
    for vendor in _VENDORS:
        body = re.sub(rf"\b{re.escape(vendor)}\b", "[VENDOR]", body)

    # Replace person names — longer names first to avoid partial matches
    sorted_names = sorted(_NAMES_TO_SANITIZE, key=len, reverse=True)
    for name in sorted_names:
        body = re.sub(rf"\b{re.escape(name)}\b", "[NAME]", body)

    # Replace "REA Group" company name
    body = re.sub(r"\bREA Group\b", "[COMPANY]", body)

    # Replace specific metric-like decimal numbers in table rows (e.g., "62.5", "99.2")
    # Only target numbers that look like metrics (in table cells or after specific keywords)
    body = re.sub(r"\b(\d{1,3}\.\d)(?=\s|%|\)|\s*hr)", "[METRIC]", body)

    return body
