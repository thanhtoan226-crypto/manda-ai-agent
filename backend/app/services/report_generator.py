import asyncio
import logging
import re
import uuid
from datetime import datetime, timezone

from langchain_core.messages import HumanMessage, SystemMessage

from app.agents.context import build_context
from app.agents.prompts import get_prompt
from app.core.llm import get_llm, is_llm_configured
from app.services.md_parser import parse_report_modules
from app.services.mock_data import AGENTS
from app.services.report_loader import is_protected_report, save_report
from app.services.template_loader import get_template_body_sanitized

logger = logging.getLogger(__name__)

AGENT_REPORT_CATEGORY = {
    "agent-1on1": "People & Culture",
    "agent-executive": "Meetings",
    "agent-recurring": "Meetings",
    "agent-team-health": "Wellness",
}

AGENT_NAME_MAP = {a["id"]: a["name"] for a in AGENTS}

AGENT_TITLE_TEMPLATE = {
    "agent-1on1": "1:1 Prep Brief: {subject}",
    "agent-executive": "Executive Digest: {subject} ({date_range})",
    "agent-recurring": "Recurring Meeting Audit: {subject} ({date_range})",
    "agent-team-health": "Team Health Check: {subject} ({date_range})",
}

DEFAULT_SUBJECTS = {
    "agent-1on1": "Employee",
    "agent-executive": "Company-wide",
    "agent-recurring": "User",
    "agent-team-health": "Team",
}


def _extract_preview(markdown_body: str, max_length: int = 200) -> str:
    text = re.sub(r"[#|*\-_>`]", "", markdown_body)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:max_length].rsplit(" ", 1)[0] if len(text) > max_length else text


async def generate_report_md(agent_id: str, mode: str, subject: str | None = None) -> str:
    """Generate a full Pulse report in Markdown using LLM.

    Returns the markdown body (no frontmatter).
    """
    template_body = get_template_body_sanitized(agent_id)
    prompt_config = get_prompt(agent_id, mode)
    context = build_context(agent_id, subject, mode)
    agent_name = AGENT_NAME_MAP.get(agent_id, "Manda Agent")

    system_prompt = f"""{prompt_config.system_prompt}

You are generating a Pulse report for Manda, an AI meeting analytics assistant.

CRITICAL — VARIED CONTENT, NOT JUST VARIED NUMBERS:
Below is a REFERENCE TEMPLATE. Use it ONLY as a structural skeleton. You must generate a
COMPLETELY DIFFERENT report with:
- DIFFERENT narrative arc: tell a different story about a different person/team. Do not
  reproduce the template's insights with swapped numbers.
- DIFFERENT specific insights: highlight different patterns, flag different concerns,
  acknowledge different strengths. If the template flags "high external meetings" and
  "Wednesday clustering", flag entirely different patterns (e.g., "low 1-on-1 coverage"
  and "meeting quality declining in large forums").
- DIFFERENT recommendations: suggest different actions. Do not paraphrase the template's
  recommendations.
- DIFFERENT names, meeting titles, and examples: invent realistic but different specifics.
- DIFFERENT numbers: all metrics, costs, percentages, and counts must differ from the template.
- Ensure all numbers are internally consistent across sections — breakdowns must add up to totals.
- BANNED patterns from the template — do NOT reproduce these even with different numbers:
  * "Alignment meeting overload" as the dominant category — use a different category dominance
  * "Wednesday is the heaviest day" — use a different day-of-week clustering
  * "Vendor relationship burden" — use different external engagement patterns
  * "Spike in [month] followed by recovery" — use a different trend shape
  * "99%+ response rate as top strength" — choose a different standout metric
  * "Speedy adoption above peer median" — vary which metric stands out
  * Specific names from the template (Chris, Mart, Damien, Jessie, Johnny, etc.) — invent entirely different names
  * Specific meeting names from the template — invent entirely different meeting names
  * Specific vendor names from the template — invent entirely different vendor names

Structural rules (follow these exactly):
- Use the same ## section headings as the template
- Use the same ### chip headings as the template
- Include the same types of tables with the same column headers
- Follow the same content patterns (numbered items for patterns with "You might ask"
  follow-ups, hyphen items for strengths)
- Include "LLM Feedback" paragraphs where the template has them
- End with a "## Context and Trends" section with bold labels

STRUCTURAL SKELETON (all data is placeholder):
---
{template_body}
---

DATA CONTEXT:
{context}

{prompt_config.content_instructions}

Generate the full report now. Output ONLY the markdown body (no YAML frontmatter, no # title
line — start with the subtitle line like "Prepared ...")."""

    llm = get_llm()
    if not llm:
        raise RuntimeError("LLM is not configured")

    report_llm = llm.bind(max_tokens=8192)

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(
            content=f"Generate a {agent_name} report in {prompt_config.tone} tone for {mode} mode. Generation ID: {uuid.uuid4().hex[:8]}. Produce entirely original content — do not reproduce patterns from any previous report."
        ),
    ]

    # Retry up to 3 times on rate limit errors
    max_retries = 3
    for attempt in range(max_retries):
        try:
            result = await report_llm.ainvoke(messages)
            break
        except Exception as e:
            if "429" in str(e) and attempt < max_retries - 1:
                wait = 2 ** (attempt + 1)
                logger.warning(
                    "Rate limited, retrying in %ds (attempt %d/%d)", wait, attempt + 1, max_retries
                )
                await asyncio.sleep(wait)
            else:
                raise
    md_body = result.content if isinstance(result.content, str) else str(result.content)

    # Strip any accidental frontmatter or title line the LLM might add
    if md_body.startswith("---"):
        _, _, md_body = md_body.partition("---\n")
        if md_body.startswith("---"):
            md_body = md_body[3:]

    return md_body.strip()


def _generate_mock_report_md(agent_id: str, subject: str | None = None) -> str:
    """Generate a fallback report using the template when LLM is unavailable."""
    try:
        md_body = get_template_body_sanitized(agent_id)
    except (ValueError, FileNotFoundError):
        md_body = f"## Report\n\nGenerated report for {agent_id}."

    if subject:
        md_body = md_body.replace("[NAME]", subject)
        first_name = subject.split()[0] if subject.split() else subject
        md_body = md_body.replace("[NAME]'s", f"{first_name}'s")
    else:
        md_body = md_body.replace("[NAME]", DEFAULT_SUBJECTS.get(agent_id, "User"))

    md_body = md_body.replace("[MEETING]", "Weekly Sync")
    md_body = md_body.replace("[VENDOR]", "PartnerOrg")
    md_body = md_body.replace("[COMPANY]", "Acme Corp")
    md_body = md_body.replace("[COST]", "$0")
    md_body = md_body.replace("[METRIC]", "0.0")

    return md_body


def _build_report_dict(
    agent_id: str, subject: str | None, md_body: str, is_fallback: bool = False
) -> dict:
    """Build a report dict with frontmatter, save to disk, and parse modules."""
    report_id = f"pulse-{uuid.uuid4().hex[:8]}"
    agent_name = AGENT_NAME_MAP.get(agent_id, "Manda Agent")
    category = AGENT_REPORT_CATEGORY.get(agent_id, "Meetings")

    display_subject = subject or DEFAULT_SUBJECTS.get(agent_id, "Report")
    now = datetime.now(timezone.utc)
    date_range = now.strftime("%-d %b %Y")
    title_template = AGENT_TITLE_TEMPLATE.get(agent_id, "{subject} Report ({date_range})")
    title = title_template.format(subject=display_subject, date_range=date_range)

    preview = _extract_preview(md_body)
    timestamp = now.isoformat()

    frontmatter_dict = {
        "id": report_id,
        "title": title,
        "agent_name": agent_name,
        "agent_id": agent_id,
        "category": category,
        "status": "unread",
        "preview": preview,
        "created_at": timestamp,
        "updated_at": timestamp,
        "is_fallback": is_fallback,
    }

    report = save_report(frontmatter_dict, md_body)
    logger.info(
        "Generated and saved report %s for %s (%s)%s",
        report_id,
        agent_id,
        display_subject,
        " [FALLBACK]" if is_fallback else "",
    )

    try:
        modules = parse_report_modules(md_body, agent_id, title)
        report["modules"] = [
            {
                "id": m.id,
                "title": m.title,
                "chips": [{"id": c.id, "label": c.label, "enabled": c.enabled} for c in m.chips],
                "content": m.content,
            }
            for m in modules
        ]
    except Exception:
        report["modules"] = None

    return report


async def generate_and_save_report(
    agent_id: str,
    mode: str,
    subject: str | None = None,
) -> dict:
    """Generate a report via LLM (with mock fallback), save to disk, return the report dict."""
    if agent_id == "agent-1on1" and subject:
        filename = f"1on1-prep-brief-{subject.replace(' ', '-')}.md"
        if is_protected_report(filename):
            from app.services.report_loader import get_report

            logger.info("Skipping generation for protected report: %s", filename)
            existing = get_report("pulse-1")
            if existing:
                return existing

    if not is_llm_configured():
        md_body = _generate_mock_report_md(agent_id, subject)
        return _build_report_dict(agent_id, subject, md_body, is_fallback=True)

    try:
        md_body = await generate_report_md(agent_id, mode, subject)
        return _build_report_dict(agent_id, subject, md_body, is_fallback=False)
    except Exception as e:
        logger.warning("LLM report generation failed for %s: %s — using mock fallback", agent_id, e)
        md_body = _generate_mock_report_md(agent_id, subject)
        return _build_report_dict(agent_id, subject, md_body, is_fallback=True)
