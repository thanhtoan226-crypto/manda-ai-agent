"""In-memory mock data store. All demo data lives here."""

import uuid
from typing import Optional
from datetime import datetime, timedelta

AGENTS = [
    {
        "id": "agent-1on1",
        "name": "1-on-1 Prep Report",
        "description": "Generate manager prep briefs for upcoming 1-on-1s",
        "icon": "user-check",
        "category": "Management",
        "is_favorite": True,
        "usage_count": 142,
        "last_used": datetime.now().isoformat(),
    },
    {
        "id": "agent-workload",
        "name": "Workload Analyzer",
        "description": "Analyze team capacity and burnout risks",
        "icon": "bar-chart-3",
        "category": "Analytics",
        "is_favorite": False,
        "usage_count": 98,
        "last_used": (datetime.now() - timedelta(days=2)).isoformat(),
    },
    {
        "id": "agent-sentiment",
        "name": "Team Sentiment",
        "description": "Surface engagement and morale signals from team data",
        "icon": "heart-pulse",
        "category": "Analytics",
        "is_favorite": True,
        "usage_count": 67,
        "last_used": (datetime.now() - timedelta(days=5)).isoformat(),
    },
    {
        "id": "agent-review",
        "name": "Review Writer",
        "description": "Draft performance review summaries",
        "icon": "file-text",
        "category": "Management",
        "is_favorite": False,
        "usage_count": 55,
        "last_used": (datetime.now() - timedelta(days=10)).isoformat(),
    },
]

CONVERSATION_MODES = [
    {"id": "coaching", "label": "Coaching & Support", "description": "Mentoring-focused insights"},
    {"id": "performance", "label": "Performance Review Prep", "description": "Review-ready data"},
    {"id": "workload", "label": "Workload Concern", "description": "Capacity and burnout signals"},
    {"id": "investigation", "label": "Investigation", "description": "Deep-dive exploration"},
]

SESSIONS: list[dict] = [
    {
        "id": "session-1",
        "agent_id": "agent-1on1",
        "title": "1:1 Prep: Chris Peterson",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "preview": "Chris is an Outlier in meeting hours vs. peers...",
        "mode": "coaching",
    },
    {
        "id": "session-2",
        "agent_id": "agent-1on1",
        "title": "1:1 Prep: Sarah Chen",
        "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "preview": "Sarah's deep work time has improved this month...",
        "mode": "performance",
    },
    {
        "id": "session-3",
        "agent_id": "agent-workload",
        "title": "Q4 Team Capacity",
        "created_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "preview": "Team is at 92% capacity with 3 pending PTO requests...",
        "mode": "workload",
    },
    {
        "id": "session-4",
        "agent_id": "agent-sentiment",
        "title": "Engineering Morale Check",
        "created_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "preview": "Overall sentiment score: 7.2/10 this quarter...",
        "mode": "investigation",
    },
]

DEFAULT_MODULES = [
    {
        "id": "module-glance",
        "title": "At a Glance",
        "chips": [
            {"id": "chip-data", "label": "Data Interpreter", "enabled": True, "disabled": False},
            {"id": "chip-strengths", "label": "Strengths to Acknowledge", "enabled": False, "disabled": False},
            {"id": "chip-patterns", "label": "Patterns Worth Discussing", "enabled": False, "disabled": False},
            {"id": "chip-more", "label": "More", "enabled": False, "disabled": True},
        ],
        "content": {
            "chip-data": {
                "metrics": [
                    {"label": "Meeting hours/week", "value": "25 hrs", "median": "15 hrs"},
                    {"label": "Deep Work hours/week", "value": "4 hrs", "median": "12 hrs"},
                    {"label": "1-on-1s held", "value": "8", "median": "6"},
                ],
                "text": "Chris is an **Outlier** in meeting hours vs. peers. Heavily involved in Q4 Planning and Urgent Ad-hoc sessions → low Deep Work scores.",
            },
            "chip-strengths": {
                "items": [
                    "Chris consistently drives strategic alignment in Q4 Planning — his meetings have the highest intent-to-alignment ratio on the team.",
                    "He maintains regular 1-on-1s with all 8 direct reports, showing strong investment in team development.",
                ]
            },
            "chip-patterns": {
                "items": [
                    "Chris's meeting load (25 hrs/week) is 67% above the peer median (15 hrs), primarily driven by reactive ad-hoc sessions.",
                    "Deep Work time has dropped to 4 hrs/week — well below the 12 hr peer median — suggesting capacity risk.",
                ]
            },
        },
    },
    {
        "id": "module-calendar",
        "title": "Calendar Deep-Dive",
        "chips": [
            {"id": "chip-cal-data", "label": "Data Interpreter", "enabled": True, "disabled": False},
            {"id": "chip-meetings", "label": "Meetings He Organizes", "enabled": False, "disabled": False},
            {"id": "chip-discussion", "label": "Discussion Starters", "enabled": False, "disabled": False},
        ],
        "content": {
            "chip-cal-data": {
                "text": "Chris organizes a significant volume of meetings, with strategic alignment highest in Q4 Planning sessions.",
            },
            "chip-meetings": {
                "table": [
                    {"meeting": "Q4 Planning", "hours": "6", "cost": "High", "intent": "Strategic Alignment", "alignment": "High"},
                    {"meeting": "Urgent Ad-hoc", "hours": "5", "cost": "Medium", "intent": "Reactive", "alignment": "Low"},
                    {"meeting": "1-on-1s", "hours": "4", "cost": "Low", "intent": "Development", "alignment": "High"},
                    {"meeting": "Sprint Reviews", "hours": "3", "cost": "Medium", "intent": "Operational", "alignment": "Medium"},
                ]
            },
            "chip-discussion": {
                "items": [
                    "Consider delegating urgent ad-hoc sessions — they consume 5 hrs/week with low strategic alignment.",
                    "Sprint Reviews could be shortened or made async to reclaim deep work time.",
                ]
            },
        },
    },
]

CONTENT_MODULES: dict[str, list[dict]] = {
    "session-1": DEFAULT_MODULES,
}

PINNED_ITEMS: dict[str, list[dict]] = {
    "session-1": [
        {
            "id": "pin-1",
            "module_id": "module-glance",
            "chip_id": "chip-data",
            "title": "At a Glance — Data Interpreter",
            "content": "Chris is an Outlier in meeting hours vs. peers. Meeting hours/week: 25 hrs (peer median: 15 hrs). Deep Work hours/week: 4 hrs (peer median: 12 hrs). 1-on-1s held: 8 (peer median: 6).",
        },
    ]
}

CHAT_MESSAGES: dict[str, list[dict]] = {
    "session-1": [
        {
            "id": "msg-1",
            "role": "user",
            "content": "I want to see Chris Peterson data last month.",
            "timestamp": datetime.now().isoformat(),
        },
        {
            "id": "msg-2",
            "role": "assistant",
            "content": "I've pulled Chris Peterson's data for last month. You can see the highlights in the modules above. Would you like me to drill deeper into any specific area?",
            "timestamp": datetime.now().isoformat(),
        },
    ]
}

REPORTS: dict[str, dict] = {
    "session-1": {
        "session_id": "session-1",
        "title": "1:1 Prep Brief: Chris Peterson",
        "markdown": "# 1:1 Prep Brief: Chris Peterson\n\n## Executive Summary\n\nChris is an Outlier in meeting hours vs. peers, with 25 hrs/week compared to the peer median of 15 hrs. Deep Work time has dropped to 4 hrs/week.\n\n## Metrics\n\n| Metric | Chris | Peer Median |\n|--------|-------|-------------|\n| Meeting hours/week | 25 hrs | 15 hrs |\n| Deep Work hours/week | 4 hrs | 12 hrs |\n| 1-on-1s held | 8 | 6 |\n\n## Deep-Dive Insights\n\nChris's meeting load is 67% above peer median, primarily driven by reactive ad-hoc sessions with low strategic alignment.\n",
        "updated_at": datetime.now().isoformat(),
    }
}

SCHEDULES: dict[str, dict] = {}

DRILL_DOWN_CONTENT: dict[str, str] = {
    "chip-data": "Detailed metric breakdown: Chris's meeting hours show a 67% variance from the peer median across all categories. The largest contributor is reactive ad-hoc sessions at 5 hrs/week.",
    "chip-strengths": "Additional strength context: Chris's strategic alignment score of 92% is in the top quartile for Engineering Managers. His 1-on-1 cadence has been consistent for 6 consecutive months.",
    "chip-patterns": "Detailed breakdown of ad-hoc meeting patterns: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "chip-cal-data": "Calendar analysis deep-dive: Chris's meeting distribution shows 40% strategic, 35% reactive, and 25% developmental. The reactive category has grown 15% month-over-month.",
    "chip-meetings": "Meeting organizer analysis: Chris initiates 78% of his meetings, significantly above the peer average of 45%. Suggests a delegation opportunity for operational meetings.",
    "chip-discussion": "Quarterly trend analysis: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
}


def create_session(agent_id: str, title: Optional[str] = None) -> dict:
    session_id = f"session-{uuid.uuid4().hex[:8]}"
    agent = next((a for a in AGENTS if a["id"] == agent_id), None)
    session_title = title or f"New Session — {agent['name']}" if agent else "New Session"
    session = {
        "id": session_id,
        "agent_id": agent_id,
        "title": session_title,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "preview": "",
        "mode": None,
    }
    SESSIONS.append(session)
    CONTENT_MODULES[session_id] = []
    PINNED_ITEMS[session_id] = []
    CHAT_MESSAGES[session_id] = []
    REPORTS[session_id] = {
        "session_id": session_id,
        "title": session_title,
        "markdown": f"# {session_title}\n\n## Executive Summary\n\n{{executive_summary}}\n\n## Metrics\n\n{{pinned_metrics}}\n\n## Deep-Dive Insights\n\n{{pinned_insights}}\n",
        "updated_at": datetime.now().isoformat(),
    }
    return session
