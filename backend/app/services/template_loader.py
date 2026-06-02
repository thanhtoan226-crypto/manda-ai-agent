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
