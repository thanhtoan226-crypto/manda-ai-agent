from app.services.mock_data import AGENTS, AGENT_MODES, AGENT_SUBJECTS


def build_context(agent_id: str, subject: str | None, mode: str) -> str:
    """Build a context string for the LLM prompt based on agent, subject, and mode."""
    agent = next((a for a in AGENTS if a["id"] == agent_id), None)
    if not agent:
        return ""

    agent_name = agent["name"]
    agent_purpose = agent.get("purpose", "")

    # Find mode label
    modes = AGENT_MODES.get(agent_id, [])
    mode_label = next((m["label"] for m in modes if m["id"] == mode), mode)

    parts = [f"Agent: {agent_name}", f"Purpose: {agent_purpose}", f"Selected mode: {mode_label}"]

    # Add subject context
    subject_config = AGENT_SUBJECTS.get(agent_id, {})
    subject_type = subject_config.get("type", "")

    if subject and subject_type == "employee":
        parts.append(f"Employee being analysed: {subject}")
    elif subject and subject_type == "scope":
        parts.append(f"Scope: {subject}")
    elif subject and subject_type == "department-team":
        parts.append(f"Department/Team: {subject}")
    elif subject_type == "auto":
        parts.append("Analysing all recurring meetings for this user")

    # Add sample data context (MVP: from mock data)
    parts.append(_get_sample_data_context(agent_id, subject))

    return "\n".join(parts)


def _get_sample_data_context(agent_id: str, subject: str | None) -> str:
    """Return narrative data context for the LLM to invent realistic numbers."""
    if agent_id == "agent-1on1":
        return _employee_data_context(subject or "Employee")
    elif agent_id == "agent-executive":
        return _executive_data_context(subject or "Company-wide")
    elif agent_id == "agent-recurring":
        return _recurring_data_context()
    elif agent_id == "agent-team-health":
        return _team_health_data_context(subject or "Team")
    return ""


def _employee_data_context(employee: str) -> str:
    return (
        f"Analyse meeting patterns for {employee}, an Engineering Manager with 5-8 direct "
        "reports. Invent realistic meeting analytics data covering: total meeting hours per "
        "month, response rate, outside-hours load, speedy meeting adoption, meeting "
        "organization rate, quality scores, 1-on-1 coverage and cancellation/reschedule rates, "
        "external engagement percentage, large meeting percentage, recent monthly trends with "
        "spikes, and heaviest day of the week. Include peer median comparisons. Ensure all "
        "numbers are internally consistent across sections — the breakdowns must add up to the "
        "totals."
    )


def _executive_data_context(scope: str) -> str:
    return (
        f"Produce a weekly executive digest for scope '{scope}'. Invent realistic department "
        "meeting analytics covering: total meeting cost, average meeting hours per employee, "
        "meeting cost growth rate, quality score, agenda usage, 1-on-1 coverage, large meeting "
        "percentage, cross-team alignment costs, and top cost centers. Include week-over-week "
        "comparisons with change percentages. Break down 6-8 departments with varied metrics. "
        "Ensure all numbers are internally consistent across sections."
    )


def _recurring_data_context() -> str:
    return (
        "Audit recurring meetings for this user over the past 90 days. Invent realistic data "
        "covering: total recurring meetings, monthly recurring cost, total recurring time, "
        "recurring ratio vs benchmark, individual meeting costs with frequency and attendee "
        "counts, average quality score with peer comparison, agenda usage, attendance trends, "
        "and verdict recommendations (Keep/Merge/Shorten/Eliminate). Ensure all numbers are "
        "internally consistent — individual meeting costs must sum to the total."
    )


def _team_health_data_context(team: str) -> str:
    return (
        f"Perform a team health check for the {team} team. Invent realistic data covering: "
        "average meeting hours per member, after-hours meetings, 1-on-1 coverage, meeting "
        "quality score with trend, response rate, cross-team meeting ratio, back-to-back "
        "frequency, collaboration score, and engagement trends. Include workload distribution "
        "with top/bottom 5 members, collaboration patterns, and isolation signals. Ensure all "
        "numbers are internally consistent across sections."
    )
