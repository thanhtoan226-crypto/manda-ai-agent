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
    """Return sample meeting data context for the LLM. MVP uses mock data."""
    if agent_id == "agent-1on1":
        return _employee_data_context(subject or "Chris Petersen")
    elif agent_id == "agent-executive":
        return _executive_data_context(subject or "Engineering")
    elif agent_id == "agent-recurring":
        return _recurring_data_context()
    elif agent_id == "agent-team-health":
        return _team_health_data_context(subject or "Platform")
    return ""


def _employee_data_context(employee: str) -> str:
    return f"""Meeting data for {employee} (last 30 days):
- Total meeting hours: 62.5 hrs/month (38.5% of working time)
- Response rate: 99.2% (peer median: 80.2%)
- Outside-hours meetings: 0.5 hrs
- Speedy meeting adoption: 37.3% (peer median: 22.7%)
- Meetings organized: 39% of total
- Quality score of organized meetings: 65.2%
- 1:1 cancellation rate: 0%
- 1:1 reschedule rate: 75%
- External engagement: 23.7% of meeting time across 16 companies
- Large meetings (8+ attendees): 37.3% (peer median: 28.3%)
- March spike: 79.4 hrs (49% of time)
- Wednesday is heaviest day: 18.3 hrs/month"""


def _executive_data_context(scope: str) -> str:
    return f"""Department meeting analytics for {scope} (last 30 days):
- Total meeting cost: $2.85M
- Average meeting hours per employee: 18.4 hrs (org median: 16.2 hrs)
- Meeting cost growth: +5.1% MoM
- Quality score: 67.4% (org median: 69.2%)
- Agenda usage: 58.2% (org median: 61.5%)
- 1-on-1 coverage: 74.6% (org median: 82.1%)
- Large meetings (8+ attendees): 28.4%
- Cross-team alignment meetings: 41% of meeting cost
- Platform team highest cost center: $890K
- DevOps after-hours meetings: 3x org average"""


def _recurring_data_context() -> str:
    return """Recurring meeting data (last 90 days):
- Total recurring meetings: 14
- Monthly recurring meeting cost: $9,780
- Total recurring meeting time: 42.5 hrs/month
- Recurring meeting ratio: 61.2% of calendar (benchmark: 52%)
- Top cost items:
  - Weekly Sprint Sync: $7,360/mo
  - 1-on-1s: $2,880/mo
  - Tech Debt Review: $3,200/mo
- Average quality score: 54.8% (peer median: 62.1%)
- Agenda usage: 42.1% (peer median: 58.3%)
- 3 meetings with declining attendance (-12% to -18% over 3 months)
- Best performers: Sprint Planning (78%), Team Retrospective (74%), 1-on-1s (82%)
- Worst performers: 'Catch-up' (28%), 'Status update' (31%)"""


def _team_health_data_context(team: str) -> str:
    return f"""Team health data for {team} team (last 30 days):
- Average meeting hours per member: 24.3 hrs (org median: 18.4 hrs)
- After-hours meetings: 2.8 hrs/member (org median: 0.9 hrs)
- 1-on-1 coverage: 68.2% (org median: 82.1%)
- Meeting quality score: 61.2% (declining 3.8 pts over quarter)
- Response rate: 88.4% (org median: 81.6%)
- Cross-team meeting ratio: 45%
- Back-to-back meeting days: avg 2.3/week per member
- Collaboration score: 72.1% (org median: 69.8%)
- Engagement trend: stable for 60% of team, declining for 20%, improving for 20%"""
