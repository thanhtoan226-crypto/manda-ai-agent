"""LLM-backed action service for Pulse report items.

Provides streaming LLM responses for Drill Down, Verify, and contextual Chat
actions on report insight items. Falls back to mock responses when LLM is
not configured.
"""

from __future__ import annotations

import asyncio
import json
from typing import AsyncGenerator

from app.core.llm import is_llm_configured
from app.schemas.pulse import PulseReportInfo

# Fallback verify responses per agent when LLM not configured
VERIFY_FALLBACK: dict[str, str] = {
    "agent-1on1": (
        "Data source: Outlook/Exchange calendar data synced via Microsoft Graph API. "
        "Time period: As specified in the report header. "
        "Confidence: Medium — based on meeting metadata (acceptance rates, attendee lists, duration) "
        "but does not include email or chat activity. "
        "Sample size: Single employee vs peer group of 50-70 Engineering Managers. "
        "Methodology: Calendar event analysis with AI-categorized meeting types and peer benchmarking."
    ),
    "agent-executive": (
        "Data source: Aggregated Outlook/Exchange calendar data via Microsoft Graph API. "
        "Time period: As specified in the report header. "
        "Confidence: High — based on aggregate department-level data with large sample sizes. "
        "Sample size: Full organisation or specified department. "
        "Methodology: Aggregated calendar analytics with AI-categorized meeting types and cost modelling "
        "based on attendee seniority and hourly rates."
    ),
    "agent-recurring": (
        "Data source: Outlook/Exchange calendar data via Microsoft Graph API. "
        "Time period: As specified in the report header. "
        "Confidence: High — recurring meetings are stable patterns with consistent data. "
        "Sample size: All recurring meetings for the specified user. "
        "Methodology: Recurring meeting pattern analysis with quality scoring (agenda usage, attendance, "
        "outcome clarity) and cost estimation based on attendee count and duration."
    ),
    "agent-team-health": (
        "Data source: Aggregated Outlook/Exchange calendar data via Microsoft Graph API. "
        "Time period: As specified in the report header. "
        "Confidence: Medium — team-level aggregates provide statistical reliability, but individual "
        "variation within the team may be significant. "
        "Sample size: Full team as specified in the report. "
        "Methodology: Team calendar analytics with wellness indicators (after-hours load, 1:1 coverage) "
        "and peer benchmarking against organisational medians."
    ),
}

# Action-specific system prompts
DRILL_DOWN_SYSTEM_PROMPT = """You are Manda, an AI meeting analytics assistant. The user wants to drill deeper into a specific insight from their report.

Provide additional context, deeper analysis, and related signals. Ground your response in the data provided. Structure your response as:
- **Deeper analysis**: Expand on the insight with related patterns
- **Related signals**: Point to other data points that connect to this insight
- **Implications**: What this could mean in practice

Keep your response concise (3-5 paragraphs). Use specific data points where possible."""

VERIFY_SYSTEM_PROMPT = """You are Manda, an AI meeting analytics assistant. The user wants to verify the source and reliability of a specific insight.

Provide a structured verification response:
- **Data source**: Where the data comes from (calendar system, API, etc.)
- **Time period**: The period covered
- **Confidence level**: High / Medium / Low with explanation
- **Sample size**: The population or dataset size
- **Methodology**: How the metric or pattern was derived
- **Limitations**: What this data does not capture

Be transparent about limitations. Do not fabricate specific technical details about data pipelines."""


def _get_item_text(report: PulseReportInfo, chip_id: str, item_index: int) -> str:
    """Extract specific item text from a report's module data."""
    if not report.modules:
        return ""
    for module in report.modules:
        content = module.content.get(chip_id)
        if content:
            items = content.get("items", [])
            if 0 <= item_index < len(items):
                return str(items[item_index])
            return json.dumps(content, default=str)[:500]
    return ""


def _get_chip_content_summary(report: PulseReportInfo, chip_id: str) -> str:
    """Get a text summary of a chip's content for LLM context."""
    if not report.modules:
        return ""
    for module in report.modules:
        content = module.content.get(chip_id)
        if content:
            return json.dumps(content, default=str)[:1000]
    return ""


async def _stream_mock_text(text: str) -> AsyncGenerator[str, None]:
    """Stream mock text word by word as SSE events."""
    words = text.split(" ")
    for i, word in enumerate(words):
        chunk = word if i == 0 else f" {word}"
        data = json.dumps({"type": "text", "content": chunk})
        yield f"data: {data}\n\n"
        if i % 10 == 0:
            await asyncio.sleep(0.01)


async def _stream_done() -> AsyncGenerator[str, None]:
    """Emit the SSE done event."""
    yield f"data: {json.dumps({'type': 'done'})}\n\n"


async def stream_drill_down(
    report: PulseReportInfo, chip_id: str, item_index: int
) -> AsyncGenerator[str, None]:
    """Stream a drill-down response for a specific insight item."""
    from app.services.mock_data import DRILL_DOWN_CONTENT

    item_text = _get_item_text(report, chip_id, item_index)
    chip_summary = _get_chip_content_summary(report, chip_id)
    user_message = (
        f"Drill deeper into this insight from the report "
        f"'{report.title}' (agent: {report.agent_name}):\n\n"
        f"Insight: {item_text}\n\n"
        f"Section context: {chip_summary[:500]}"
    )

    if is_llm_configured():
        from langchain_core.messages import HumanMessage, SystemMessage
        from app.core.llm import get_llm_streaming

        llm = get_llm_streaming()
        if llm:
            messages = [
                SystemMessage(content=DRILL_DOWN_SYSTEM_PROMPT),
                HumanMessage(content=user_message),
            ]
            async for chunk in llm.astream(messages):
                if chunk.content:
                    data = json.dumps({"type": "text", "content": chunk.content})
                    yield f"data: {data}\n\n"
            async for event in _stream_done():
                yield event
            return

    # Fallback to mock content
    content = DRILL_DOWN_CONTENT.get(chip_id, "No additional detail available for this section.")
    async for event in _stream_mock_text(content):
        yield event
    async for event in _stream_done():
        yield event


async def stream_verify(
    report: PulseReportInfo, chip_id: str, item_index: int
) -> AsyncGenerator[str, None]:
    """Stream a verification response for a specific insight item."""
    item_text = _get_item_text(report, chip_id, item_index)
    user_message = (
        f"Verify the source and reliability of this insight from the report "
        f"'{report.title}' (agent: {report.agent_name}):\n\n"
        f"Insight: {item_text}"
    )

    if is_llm_configured():
        from langchain_core.messages import HumanMessage, SystemMessage
        from app.core.llm import get_llm_streaming

        llm = get_llm_streaming()
        if llm:
            messages = [
                SystemMessage(content=VERIFY_SYSTEM_PROMPT),
                HumanMessage(content=user_message),
            ]
            async for chunk in llm.astream(messages):
                if chunk.content:
                    data = json.dumps({"type": "text", "content": chunk.content})
                    yield f"data: {data}\n\n"
            async for event in _stream_done():
                yield event
            return

    # Fallback to mock verify content
    content = VERIFY_FALLBACK.get(report.agent_id or "agent-1on1", VERIFY_FALLBACK["agent-1on1"])
    async for event in _stream_mock_text(content):
        yield event
    async for event in _stream_done():
        yield event


class PulseActionService:
    """Thin wrapper exposing module-level streaming functions as instance methods."""

    def stream_drill_down(self, report: PulseReportInfo, chip_id: str, item_index: int):
        return stream_drill_down(report, chip_id, item_index)

    def stream_verify(self, report: PulseReportInfo, chip_id: str, item_index: int):
        return stream_verify(report, chip_id, item_index)

    def get_item_text(self, report: PulseReportInfo, chip_id: str, item_index: int) -> str:
        return _get_item_text(report, chip_id, item_index)
