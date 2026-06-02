"""Parse markdown report body into ContentModule structures.

Reads the markdown content from report MD files and extracts structured
module/chip data that the frontend can render with Data Interpreter,
insight chips, and table chips.

Action Button Grouping Rules:
- Rule 1: Numbered items (1., 2., 3.) → grouped by number, one action button group
- Rule 2: Hyphenated items (- ) → each hyphen is a separate item with own action buttons
"""

from __future__ import annotations

import re
from typing import Optional

from app.schemas.session import ChipInfo, ContentModule

# ---------------------------------------------------------------------------
# ID mapping: MD section headings → module/chip IDs
# ---------------------------------------------------------------------------

AGENT_MODULE_MAP: dict[str, dict] = {
    "agent-1on1": {
        "modules": {
            "at a glance": "module-glance",
            "calendar deep-dive": "module-calendar",
        },
        "chips": {
            ("module-glance", "data interpreter"): "chip-data",
            ("module-glance", "strengths to acknowledge"): "chip-strengths",
            ("module-glance", "patterns worth discussing"): "chip-patterns",
            ("module-calendar", "data interpreter"): "chip-cal-data",
            ("module-calendar", "meeting category breakdown"): "chip-cal-data",
            ("module-calendar", "top recurring time commitments"): "chip-meetings",
            ("module-calendar", "meetings he organises"): "chip-organized",
            ("module-calendar", "ad-hoc meetings"): "chip-adhoc",
            ("module-calendar", "1:1 coverage"): "chip-1on1-coverage",
            ("module-calendar", "discussion starters"): "chip-starters",
        },
    },
    "agent-executive": {
        "modules": {
            "at a glance": "module-glance",
            "department breakdown": "module-department",
        },
        "chips": {
            ("module-glance", "data interpreter"): "chip-data",
            ("module-glance", "key signals"): "chip-signals",
            ("module-glance", "trends worth noting"): "chip-trends",
            ("module-department", "data interpreter"): "chip-dept-data",
            ("module-department", "department comparison table"): "chip-dept-data",
            ("module-department", "top cost centers"): "chip-cost-centers",
            ("module-department", "red flags & recommendations"): "chip-red-flags",
        },
    },
    "agent-recurring": {
        "modules": {
            "recurring meeting summary": "module-summary",
            "meeting-by-meeting breakdown": "module-breakdown",
        },
        "chips": {
            ("module-summary", "data interpreter"): "chip-data",
            ("module-summary", "time & cost breakdown"): "chip-cost-breakdown",
            ("module-summary", "quick wins"): "chip-quick-wins",
            ("module-breakdown", "data interpreter"): "chip-breakdown-data",
            ("module-breakdown", "meeting cards"): "chip-meeting-cards",
            ("module-breakdown", "recommendations"): "chip-recommendations",
        },
    },
    "agent-team-health": {
        "modules": {
            "team snapshot": "module-snapshot",
            "meeting health indicators": "module-health",
        },
        "chips": {
            ("module-snapshot", "data interpreter"): "chip-data",
            ("module-snapshot", "strengths to build on"): "chip-strengths",
            ("module-snapshot", "areas of concern"): "chip-concerns",
            ("module-health", "data interpreter"): "chip-health-data",
            ("module-health", "workload distribution"): "chip-workload",
            ("module-health", "1-on-1 coverage & quality"): "chip-1on1-quality",
            ("module-health", "1:1 coverage & quality"): "chip-1on1-quality",
            ("module-health", "collaboration patterns"): "chip-collab",
            ("module-health", "discussion starters for team lead"): "chip-discussion",
            ("module-health", "discussion starters"): "chip-discussion",
        },
    },
}


def _slug(text: str) -> str:
    """Generate a slug from text for use as an ID."""
    slug = re.sub(r"[^\w\s-]", "", text.lower())
    slug = re.sub(r"[\s_]+", "-", slug).strip("-")
    return slug or "unknown"


def _normalize_heading(text: str) -> str:
    """Normalize a heading for mapping lookup: lowercase, strip parenthetical suffixes."""
    normalized = re.sub(r"\s*\(.*?\)\s*$", "", text.lower()).strip()
    return normalized


def _get_module_id(agent_id: str, module_title: str) -> str:
    agent_map = AGENT_MODULE_MAP.get(agent_id, {})
    modules_map = agent_map.get("modules", {})
    normalized = _normalize_heading(module_title)
    return modules_map.get(normalized, f"module-{_slug(module_title)}")


def _get_chip_id(agent_id: str, module_id: str, chip_label: str) -> str:
    agent_map = AGENT_MODULE_MAP.get(agent_id, {})
    chips_map = agent_map.get("chips", {})
    normalized = _normalize_heading(chip_label)
    return chips_map.get((module_id, normalized), f"chip-{_slug(chip_label)}")


# ---------------------------------------------------------------------------
# Markdown parsing helpers
# ---------------------------------------------------------------------------

def _parse_table(lines: list[str]) -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    """Parse a markdown pipe table into headers and rows."""
    if not lines:
        return [], []

    table_lines: list[str] = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("|") and stripped.endswith("|"):
            table_lines.append(stripped)
        elif table_lines:
            break

    if len(table_lines) < 2:
        return [], []

    def split_row(row: str) -> list[str]:
        return [cell.strip() for cell in row.strip("|").split("|")]

    header_cells = split_row(table_lines[0])

    headers = []
    keys = []
    for cell in header_cells:
        key = _slug(cell)
        keys.append(key)
        headers.append({"key": key, "label": cell})

    rows = []
    for line in table_lines[2:]:
        cells = split_row(line)
        row = {}
        for i, key in enumerate(keys):
            row[key] = cells[i] if i < len(cells) else ""
        rows.append(row)

    return headers, rows


def _parse_metrics_table(lines: list[str]) -> list[dict[str, str]]:
    """Parse a metrics table (typically 4 columns: Metric, Value, Median, Position)."""
    _, rows = _parse_table(lines)
    metrics = []
    for row in rows:
        keys = list(row.keys())
        if len(keys) >= 4:
            metrics.append({
                "label": row[keys[0]],
                "value": row[keys[1]],
                "median": row[keys[2]],
                "position": row[keys[3]],
            })
        elif len(keys) >= 2:
            metrics.append({
                "label": row[keys[0]],
                "value": row[keys[1]],
                "median": row.get(keys[2], "—"),
                "position": row.get(keys[3], ""),
            })
    return metrics


def _extract_text_outside_tables(lines: list[str]) -> str:
    """Extract non-table, non-empty lines as text content."""
    text_parts: list[str] = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if text_parts and text_parts[-1] != "":
                text_parts.append("")
            continue
        if stripped.startswith("|") and stripped.endswith("|"):
            continue
        if re.match(r"^\|[-:\s|]+\|$", stripped):
            continue
        text_parts.append(stripped)
    return "\n".join(text_parts).strip()


def _clean_item(text: str) -> str:
    """Clean an item string: strip markdown number prefix, collapse whitespace."""
    text = text.strip()
    # Remove leading number prefix like "1. " or "2. "
    text = re.sub(r"^\d+\.\s+", "", text)
    # Collapse multiple blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def _split_numbered_items(text: str) -> list[str]:
    """Split text into numbered item groups (Rule 1).

    Each numbered item (1. ..., 2. ...) and all its sub-content
    (indented paragraphs, "You might ask") form one group.
    """
    items: list[str] = []
    lines = text.split("\n")
    current_item: list[str] = []

    for line in lines:
        if re.match(r"^\d+\.\s", line):
            if current_item:
                items.append(_clean_item("\n".join(current_item)))
            current_item = [line]
        elif current_item:
            current_item.append(line)

    if current_item:
        items.append(_clean_item("\n".join(current_item)))

    return [item for item in items if item]


def _split_hyphen_items(text: str) -> list[str]:
    """Split text into hyphen item groups (Rule 2)."""
    items: list[str] = []
    lines = text.split("\n")
    current_item: list[str] = []

    for line in lines:
        stripped = line.strip()
        if stripped.startswith("- "):
            if current_item:
                items.append(" ".join(current_item).strip())
            current_item = [stripped[2:]]
        elif current_item and stripped:
            current_item.append(stripped)
        elif not stripped and current_item:
            items.append(" ".join(current_item).strip())
            current_item = []

    if current_item:
        items.append(" ".join(current_item).strip())

    return [item for item in items if item]


def _has_numbered_items(text: str) -> bool:
    return bool(re.search(r"^\d+\.\s", text, re.MULTILINE))


def _has_hyphen_items(text: str) -> bool:
    return bool(re.search(r"^- ", text, re.MULTILINE))


def _has_table(lines: list[str]) -> bool:
    return any(
        line.strip().startswith("|") and line.strip().endswith("|") and "|" in line[1:-1]
        for line in lines
    )


def _split_at_llm_feedback(text: str) -> tuple[str, str]:
    """Split text at **LLM Feedback:** marker."""
    match = re.search(r"\*\*LLM Feedback:\*\*", text)
    if match:
        return text[:match.start()].strip(), text[match.start():].strip()
    return text, ""


# ---------------------------------------------------------------------------
# Chip content parsing
# ---------------------------------------------------------------------------

def _parse_chip_content(
    section_title: str,
    section_lines: list[str],
) -> dict:
    """Parse a ### section into chip content dict."""
    full_text = "\n".join(section_lines)
    has_table = _has_table(section_lines)
    has_numbered = _has_numbered_items(full_text)
    has_hyphens = _has_hyphen_items(full_text)
    before_feedback, feedback_text = _split_at_llm_feedback(full_text)

    if has_table and not has_numbered and not has_hyphens:
        headers, rows = _parse_table(section_lines)
        result: dict = {}
        if headers:
            result["headers"] = headers
        result["table"] = rows
        if feedback_text:
            result["text"] = feedback_text
        return result

    if has_numbered:
        items = _split_numbered_items(before_feedback)
        result = {"items": items}
        if feedback_text:
            result["text"] = feedback_text
        return result

    if has_hyphens:
        items = _split_hyphen_items(before_feedback)
        result = {"items": items}
        if feedback_text:
            result["text"] = feedback_text
        return result

    return {"items": [full_text.strip()]} if full_text.strip() else {"items": []}


def _parse_data_interpreter(lines: list[str]) -> dict:
    """Parse the Data Interpreter section (pre-### content or first table section).

    Detects metrics tables (4+ cols with Position/Change column) vs category
    tables and returns the appropriate content structure.
    """
    if not _has_table(lines):
        text = _extract_text_outside_tables(lines)
        if text:
            return {"items": [text]}
        return {"items": []}

    headers, rows = _parse_table(lines)
    text = _extract_text_outside_tables(lines)

    if rows and len(headers) >= 3:
        # Check for metrics-style table (has Position or Change column)
        has_position_col = any(
            h["label"].lower() in ("position", "change")
            for h in headers
        )
        if has_position_col:
            metrics = _parse_metrics_table(lines)
            result: dict = {"metrics": metrics}
            if text:
                result["text"] = text
            return result

    # Category/regular table
    result = {}
    if headers:
        result["headers"] = headers
    result["table"] = rows
    if text:
        result["text"] = text
    return result


# ---------------------------------------------------------------------------
# Main parser
# ---------------------------------------------------------------------------

def parse_report_modules(
    markdown_body: str,
    agent_id: str,
    report_title: Optional[str] = None,
) -> list[ContentModule]:
    """Parse markdown body into a list of ContentModule objects.

    Splits on ## headings for modules, ### headings for chips.
    When no content exists before the first ###, the first table-containing
    ### section becomes the Data Interpreter chip.
    """
    modules: list[ContentModule] = []
    lines = markdown_body.split("\n")

    # Split into sections by ## headings (skip # title and horizontal rules)
    module_sections: list[tuple[str, list[str]]] = []
    current_title: Optional[str] = None
    current_lines: list[str] = []

    for line in lines:
        if line.startswith("## "):
            if current_title is not None:
                module_sections.append((current_title, current_lines))
            current_title = line[3:].strip()
            current_lines = []
        elif line.startswith("# ") or line.startswith("---"):
            continue
        elif current_title is not None:
            current_lines.append(line)

    if current_title is not None:
        module_sections.append((current_title, current_lines))

    for module_title, module_lines in module_sections:
        module_id = _get_module_id(agent_id, module_title)

        # Within each module, split on ### headings
        chip_sections: list[tuple[str, list[str]]] = []
        pre_chip_lines: list[str] = []
        chip_title: Optional[str] = None
        chip_lines: list[str] = []

        for line in module_lines:
            if line.startswith("### "):
                if chip_title is not None:
                    chip_sections.append((chip_title, chip_lines))
                chip_title = line[4:].strip()
                chip_lines = []
            elif chip_title is not None:
                chip_lines.append(line)
            else:
                pre_chip_lines.append(line)

        if chip_title is not None:
            chip_sections.append((chip_title, chip_lines))

        # Build chips
        chips: list[ChipInfo] = []
        content: dict = {}

        # Determine Data Interpreter content
        has_pre_chip_content = any(
            line.strip() and not line.strip().startswith("|")
            for line in pre_chip_lines
        ) or _has_table(pre_chip_lines)

        if has_pre_chip_content:
            # Pre-### content becomes the Data Interpreter
            data_chip_id = _get_chip_id(agent_id, module_id, "Data Interpreter")
            data_content = _parse_data_interpreter(pre_chip_lines)
            chips.append(ChipInfo(id=data_chip_id, label="Data Interpreter", enabled=True))
            content[data_chip_id] = data_content
            sections_to_process = chip_sections
        elif chip_sections:
            # No pre-### content: first table-containing section becomes Data Interpreter
            first_title, first_lines = chip_sections[0]
            data_chip_id = _get_chip_id(agent_id, module_id, "Data Interpreter")
            data_content = _parse_data_interpreter(first_lines)
            chips.append(ChipInfo(id=data_chip_id, label="Data Interpreter", enabled=True))
            content[data_chip_id] = data_content
            sections_to_process = chip_sections[1:]
        else:
            # No sections at all
            data_chip_id = _get_chip_id(agent_id, module_id, "Data Interpreter")
            chips.append(ChipInfo(id=data_chip_id, label="Data Interpreter", enabled=True))
            content[data_chip_id] = {"items": []}
            sections_to_process = []

        # Process remaining ### chip sections
        for section_title, section_lines in sections_to_process:
            chip_id = _get_chip_id(agent_id, module_id, section_title)
            chip_content = _parse_chip_content(section_title, section_lines)
            # Use normalized label (strip parenthetical) for display
            display_label = re.sub(r"\s*\(.*?\)\s*$", "", section_title).strip()
            chips.append(ChipInfo(id=chip_id, label=display_label, enabled=False))
            content[chip_id] = chip_content

        modules.append(ContentModule(
            id=module_id,
            title=module_title,
            chips=chips,
            content=content,
        ))

    # Remove "Context and Trends" — not a structured module
    if modules and modules[-1].title.lower().startswith("context and trend"):
        modules.pop()

    return modules
