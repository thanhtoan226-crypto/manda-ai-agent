import hashlib
import random

from app.services.mock_data import AGENTS, AGENT_MODES, AGENT_SUBJECTS


def _seeded_random(agent_id: str, subject: str | None, mode: str) -> random.Random:
    seed_str = f"{agent_id}:{subject or ''}:{mode}"
    seed = int(hashlib.sha256(seed_str.encode()).hexdigest()[:8], 16)
    return random.Random(seed)


_ROLE_PROFILES = [
    {
        "role": "Product Manager with 3-5 direct reports",
        "focus": "sprint ceremonies, stakeholder alignment, and roadmap reviews",
    },
    {
        "role": "Engineering Manager with 4-6 direct reports",
        "focus": "technical alignment, code reviews, and architecture decisions",
    },
    {
        "role": "Design Lead with 2-4 direct reports",
        "focus": "design critiques, user research syncs, and cross-functional alignment",
    },
    {
        "role": "Data Science Manager with 3-5 direct reports",
        "focus": "model reviews, data pipeline coordination, and insight presentations",
    },
    {
        "role": "Marketing Manager with 5-7 direct reports",
        "focus": "campaign planning, agency syncs, and performance reviews",
    },
    {
        "role": "Operations Manager with 4-6 direct reports",
        "focus": "process improvement, vendor management, and cross-team coordination",
    },
]

_METRIC_RANGES = {
    "meeting_hours": [(40, 55), (55, 70), (70, 85)],
    "response_rate": [(75, 85), (85, 93), (93, 99)],
    "speedy_adoption": [(15, 25), (25, 40), (40, 55)],
    "external_pct": [(10, 18), (18, 28), (28, 38)],
    "after_hours": [(0.5, 3), (3, 8), (8, 15)],
}

_EXEC_PROFILES = [
    {"cost_range": "$400K-$550K", "departments": 6, "focus": "cost containment"},
    {"cost_range": "$550K-$750K", "departments": 7, "focus": "quality improvement"},
    {"cost_range": "$750K-$950K", "departments": 8, "focus": "coverage gaps"},
    {"cost_range": "$350K-$500K", "departments": 5, "focus": "meeting overload"},
]

_RECURRING_PROFILES = [
    {"meetings": "8-10", "recurring_pct": "45-55%", "focus": "consolidation opportunities"},
    {"meetings": "11-14", "recurring_pct": "55-65%", "focus": "attendance decline"},
    {"meetings": "15-20", "recurring_pct": "65-75%", "focus": "cost overrun"},
    {"meetings": "6-9", "recurring_pct": "35-45%", "focus": "quality degradation"},
]

_TEAM_PROFILES = [
    {"size": "8-12", "workload": "evenly distributed", "concern": "burnout risk"},
    {"size": "15-20", "workload": "top-heavy", "concern": "isolation signals"},
    {"size": "20-35", "workload": "bimodal split", "concern": "meeting quality decline"},
    {"size": "35-50", "workload": "clustered around leads", "concern": "1-on-1 coverage gaps"},
]

_BANNED_PATTERNS = (
    "Do NOT reproduce these specific patterns from the reference: "
    "'alignment meeting overload as top category', "
    "'Wednesday is the heaviest day', "
    "'vendor relationship burden with Google/Atlassian/Searce', "
    "'March spike followed by April recovery', "
    "'99%+ response rate as top strength', "
    "'speedy adoption above peer median as the standout', "
    "'Due Diligence standup with 33+ people', "
    "'ETech Wednesday Update with 42 people', "
    "'Searce offshore coordination driving after-hours load'."
)


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
    rng = _seeded_random(agent_id, subject, "data")
    if agent_id == "agent-1on1":
        return _employee_data_context(subject or "Employee", rng)
    elif agent_id == "agent-executive":
        return _executive_data_context(subject or "Company-wide", rng)
    elif agent_id == "agent-recurring":
        return _recurring_data_context(rng)
    elif agent_id == "agent-team-health":
        return _team_health_data_context(subject or "Team", rng)
    return ""


def _employee_data_context(employee: str, rng: random.Random) -> str:
    profile = rng.choice(_ROLE_PROFILES)
    hours = rng.choice(_METRIC_RANGES["meeting_hours"])
    resp = rng.choice(_METRIC_RANGES["response_rate"])
    speedy = rng.choice(_METRIC_RANGES["speedy_adoption"])
    external = rng.choice(_METRIC_RANGES["external_pct"])
    after_hrs = rng.choice(_METRIC_RANGES["after_hours"])
    top_cat = rng.choice(["Decision Making", "Planning", "Supporting Individuals", "Alignment"])

    return (
        f"Analyse meeting patterns for {employee}, a {profile['role']}. "
        f"Their primary meeting focus areas are {profile['focus']}. "
        f"Generate data with these constraints: monthly meeting hours in the {hours[0]}-{hours[1]} range, "
        f"response rate {resp[0]}-{resp[1]}%, speedy meeting adoption {speedy[0]}-{speedy[1]}%, "
        f"external meeting percentage {external[0]}-{external[1]}%, "
        f"after-hours meetings {after_hrs[0]}-{after_hrs[1]} hours, "
        f"top meeting category is {top_cat}. "
        f"Include peer median comparisons. Ensure all numbers are internally consistent across "
        f"sections — the breakdowns must add up to the totals. {_BANNED_PATTERNS}"
    )


def _executive_data_context(scope: str, rng: random.Random) -> str:
    profile = rng.choice(_EXEC_PROFILES)
    growth_dir = rng.choice(["accelerating", "decelerating", "stable", "volatile"])
    standout_metric = rng.choice(
        [
            "after-hours surge",
            "quality score decline",
            "large meeting creep",
            "cross-team cost imbalance",
            "agenda usage drop",
        ]
    )

    return (
        f"Produce a weekly executive digest for scope '{scope}'. "
        f"Generate data with these constraints: total weekly meeting cost in the {profile['cost_range']} range, "
        f"break down {profile['departments']} departments with varied metrics, "
        f"meeting growth trend is {growth_dir}, "
        f"the key signal to highlight is {standout_metric}. "
        f"Include week-over-week comparisons with change percentages. "
        f"Ensure all numbers are internally consistent across sections. {_BANNED_PATTERNS}"
    )


def _recurring_data_context(rng: random.Random) -> str:
    profile = rng.choice(_RECURRING_PROFILES)
    quality = rng.choice(
        [
            ("45-55%", "below peer median"),
            ("55-65%", "near peer median"),
            ("65-75%", "above peer median"),
        ]
    )
    verdict_mix = rng.choice(
        [
            "majority Keep with few Optimise actions",
            "balanced mix of Keep, Merge, and Eliminate",
            "several Eliminate and Shorten candidates",
        ]
    )

    return (
        f"Audit recurring meetings for this user over the past 90 days. "
        f"Generate data with these constraints: total recurring meetings in the {profile['meetings']} range, "
        f"recurring ratio {profile['recurring_pct']} of calendar, "
        f"primary audit focus is {profile['focus']}, "
        f"average quality score {quality[0]} ({quality[1]}), "
        f"verdict distribution should show {verdict_mix}. "
        f"Ensure all numbers are internally consistent — individual meeting costs must sum to the total. "
        f"{_BANNED_PATTERNS}"
    )


def _team_health_data_context(team: str, rng: random.Random) -> str:
    profile = rng.choice(_TEAM_PROFILES)
    avg_hrs = rng.choice(["16-22 hrs", "22-28 hrs", "28-35 hrs"])
    after_hrs = rng.choice(
        [
            "moderate (20-35 hrs team total)",
            "elevated (35-55 hrs team total)",
            "high (55-70 hrs team total)",
        ]
    )
    collab = rng.choice(
        ["strong technical collaboration", "healthy cross-team engagement", "emerging silo risks"]
    )

    return (
        f"Perform a team health check for the {team} team. "
        f"Generate data with these constraints: team size {profile['size']} members, "
        f"workload pattern is {profile['workload']}, "
        f"primary health concern is {profile['concern']}, "
        f"average meeting hours per member {avg_hrs}, "
        f"after-hours meeting load is {after_hrs}, "
        f"collaboration culture shows {collab}. "
        f"Include workload distribution with top/bottom members, collaboration patterns, "
        f"and isolation signals. Ensure all numbers are internally consistent across sections. "
        f"{_BANNED_PATTERNS}"
    )
