"""In-memory mock data store. All demo data lives here."""

import uuid
from typing import Optional
from datetime import datetime, timedelta

AGENTS = [
    {
        "id": "agent-listing",
        "name": "Listing Performance Coach",
        "description": "Analyze listing performance and identify optimization opportunities across your portfolio",
        "icon": "trending-up",
        "category": "Sales Performance",
        "is_favorite": True,
        "usage_count": 142,
        "last_used": datetime.now().isoformat(),
    },
    {
        "id": "agent-pipeline",
        "name": "Pipeline Health Analyzer",
        "description": "Monitor deal pipeline health, conversion rates, and velocity bottlenecks",
        "icon": "git-branch",
        "category": "Sales Performance",
        "is_favorite": False,
        "usage_count": 98,
        "last_used": (datetime.now() - timedelta(days=2)).isoformat(),
    },
    {
        "id": "agent-client",
        "name": "Client Relationship Coach",
        "description": "Prepare for client meetings and track relationship health scores",
        "icon": "heart-handshake",
        "category": "Client Success",
        "is_favorite": True,
        "usage_count": 67,
        "last_used": (datetime.now() - timedelta(days=5)).isoformat(),
    },
    {
        "id": "agent-openhouse",
        "name": "Open House Optimizer",
        "description": "Optimize open house strategies with data-driven attendance and conversion insights",
        "icon": "home",
        "category": "Market Intelligence",
        "is_favorite": False,
        "usage_count": 55,
        "last_used": (datetime.now() - timedelta(days=10)).isoformat(),
    },
    {
        "id": "agent-commission",
        "name": "Commission & Goals Tracker",
        "description": "Track progress toward commission targets and quarterly goals",
        "icon": "dollar-sign",
        "category": "Sales Performance",
        "is_favorite": False,
        "usage_count": 89,
        "last_used": (datetime.now() - timedelta(days=1)).isoformat(),
    },
    {
        "id": "agent-market",
        "name": "Market Intelligence Agent",
        "description": "Analyze local market trends, comparable sales, and pricing guidance",
        "icon": "bar-chart-3",
        "category": "Market Intelligence",
        "is_favorite": False,
        "usage_count": 73,
        "last_used": (datetime.now() - timedelta(days=3)).isoformat(),
    },
    {
        "id": "agent-team",
        "name": "Team Performance Review",
        "description": "Broker and manager view of team performance metrics and KPIs",
        "icon": "users",
        "category": "Sales Performance",
        "is_favorite": True,
        "usage_count": 112,
        "last_used": (datetime.now() - timedelta(hours=5)).isoformat(),
    },
    {
        "id": "agent-lead",
        "name": "Lead Conversion Analyzer",
        "description": "Evaluate lead source ROI and conversion funnel performance",
        "icon": "target",
        "category": "Client Success",
        "is_favorite": False,
        "usage_count": 41,
        "last_used": (datetime.now() - timedelta(days=7)).isoformat(),
    },
]

CONVERSATION_MODES = [
    {"id": "coaching", "label": "Coaching & Growth", "description": "Strengths-first, warm tone, for developing agents"},
    {"id": "performance", "label": "Performance Review", "description": "Evidence-based, balanced, for formal reviews"},
    {"id": "pipeline", "label": "Pipeline Concern", "description": "Volume/trend data, caring but factual, for stalled deals"},
    {"id": "market", "label": "Market Investigation", "description": "Direct/factual, data-driven, for market analysis"},
]

SESSIONS: list[dict] = [
    {
        "id": "session-1",
        "agent_id": "agent-listing",
        "title": "Listing Review: Sarah Mitchell",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "preview": "Sarah's list-to-close ratio is exceptional at 98.2% vs peer median of 94.5%...",
        "mode": "coaching",
    },
    {
        "id": "session-2",
        "agent_id": "agent-pipeline",
        "title": "Pipeline Review: Sarah Mitchell",
        "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "preview": "3 deals stalled in negotiation stage for over 14 days...",
        "mode": "pipeline",
    },
    {
        "id": "session-3",
        "agent_id": "agent-client",
        "title": "Client Prep: Thompson Family",
        "created_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "preview": "Thompson family showing satisfaction score 4.8/5 across 12 viewings...",
        "mode": "coaching",
    },
    {
        "id": "session-4",
        "agent_id": "agent-market",
        "title": "Q1 Market Analysis",
        "created_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "preview": "Median home price up 8.3% YoY in the greater metro area...",
        "mode": "market",
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
                    {"label": "Monthly closings", "value": "7", "median": "4"},
                    {"label": "Total pipeline value", "value": "$2.84M", "median": "$1.6M"},
                    {"label": "Avg days on market", "value": "18", "median": "32"},
                    {"label": "List-to-close ratio", "value": "98.2%", "median": "94.5%"},
                    {"label": "Lead conversion rate", "value": "12.4%", "median": "8.1%"},
                    {"label": "Showings per listing", "value": "14", "median": "9"},
                    {"label": "Client satisfaction score", "value": "4.8/5", "median": "4.2/5"},
                    {"label": "Active listings count", "value": "11", "median": "6"},
                    {"label": "Commission earned YTD", "value": "$142K", "median": "$78K"},
                    {"label": "Deals in escrow", "value": "4", "median": "2"},
                ],
                "text": "Sarah is a **Top Performer** vs. peers across most metrics. Exceptional list-to-close ratio and pipeline velocity, with strong client satisfaction scores.",
            },
            "chip-strengths": {
                "items": [
                    "Exceptional list-to-close ratio of 98.2% vs peer median of 94.5% — Sarah consistently prices homes accurately and manages the closing process efficiently, minimizing price reductions.",
                    "Average days on market of 18 vs peer median of 32 — Sarah's listings sell nearly twice as fast, driven by strong staging advice and strategic pricing.",
                    "Lead conversion rate of 12.4% vs peer median of 8.1% — Sarah excels at qualifying leads early and maintaining consistent follow-up through the funnel.",
                    "Client satisfaction score of 4.8/5 vs peer median of 4.2 — Top-quartile client experience, with particularly high marks on communication responsiveness.",
                ]
            },
            "chip-patterns": {
                "items": [
                    "March showed 40% spike in new listings but conversion dipped to 3.1% — the volume opportunity may have diluted follow-up quality on existing pipeline.",
                    "Single Family homes represent 65% of pipeline but only 45% of closings — Condo deals close faster with less negotiation time.",
                    "Sarah's Tuesday and Thursday showings generate 3x more offers than weekend open houses — suggests weekday buyers are more qualified and further along in their journey.",
                    "Pipeline value peaked at $3.2M in March before settling to $2.84M in April — 2 deals fell through during inspection contingency, totaling $620K in lost pipeline.",
                ]
            },
        },
    },
    {
        "id": "module-calendar",
        "title": "Pipeline Deep-Dive",
        "chips": [
            {"id": "chip-cal-data", "label": "Data Interpreter", "enabled": True, "disabled": False},
            {"id": "chip-meetings", "label": "Top Active Deals", "enabled": False, "disabled": False},
            {"id": "chip-discussion", "label": "Discussion Starters", "enabled": False, "disabled": False},
        ],
        "content": {
            "chip-cal-data": {
                "items": [
                    "Single Family: $1.84M (65%), 18 listings",
                    "Condo/Townhouse: $620K (22%), 11 listings",
                    "Commercial: $280K (10%), 3 listings",
                    "Multi-Family: $100K (3%), 2 listings",
                ],
            },
            "chip-meetings": {
                "table": [
                    {"meeting": "142 Oak Ridge Dr", "hours": "$485,000", "cost": "Negotiation", "intent": "12 days", "alignment": "High"},
                    {"meeting": "88 Sunset Blvd #4B", "hours": "$325,000", "cost": "Under Contract", "intent": "8 days", "alignment": "High"},
                    {"meeting": "2100 Pine Valley Way", "hours": "$675,000", "cost": "Showing", "intent": "5 days", "alignment": "Medium"},
                    {"meeting": "55 Harbor View Ln", "hours": "$892,000", "cost": "Listing", "intent": "21 days", "alignment": "Medium"},
                    {"meeting": "330 Maple Creek Ct", "hours": "$415,000", "cost": "Inspection", "intent": "3 days", "alignment": "Low"},
                ],
            },
            "chip-discussion": {
                "items": [
                    "Your single family listings dominate the pipeline but have longer close times — worth exploring whether to shift mix toward condos for faster revenue?",
                    "Two deals fell through during inspection in March — would it help to build a pre-inspection checklist for sellers?",
                    "Your weekday showings convert significantly better — should we reconsider your open house scheduling strategy?",
                    "The Thompson family listing at 142 Oak Ridge has been in negotiation for 12 days — do you want me to prepare a counter-offer analysis?",
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
            "content": "Sarah is a Top Performer vs. peers across most metrics. Monthly closings: 7 (peer median: 4). Total pipeline value: $2.84M (peer median: $1.6M). List-to-close ratio: 98.2% (peer median: 94.5%). Commission earned YTD: $142K (peer median: $78K).",
        },
    ]
}

CHAT_MESSAGES: dict[str, list[dict]] = {
    "session-1": [
        {
            "id": "msg-1",
            "role": "user",
            "content": "I want to see Sarah Mitchell's listing performance for last month.",
            "timestamp": datetime.now().isoformat(),
        },
        {
            "id": "msg-2",
            "role": "assistant",
            "content": "I've pulled Sarah Mitchell's listing data for last month. You can see the highlights in the modules above. Would you like me to drill deeper into any specific area?",
            "timestamp": datetime.now().isoformat(),
        },
    ]
}

REPORTS: dict[str, dict] = {
    "session-1": {
        "session_id": "session-1",
        "title": "Listing Performance Brief: Sarah Mitchell",
        "markdown": "# Listing Performance Brief: Sarah Mitchell\n\n## Executive Summary\n\nSarah is a Top Performer vs. peers across most metrics. Exceptional list-to-close ratio of 98.2% and pipeline velocity with average 18 days on market.\n\n## Metrics\n\n| Metric | Sarah | Peer Median |\n|--------|-------|-------------|\n| Monthly closings | 7 | 4 |\n| Total pipeline value | $2.84M | $1.6M |\n| Avg days on market | 18 | 32 |\n| List-to-close ratio | 98.2% | 94.5% |\n| Lead conversion rate | 12.4% | 8.1% |\n| Commission earned YTD | $142K | $78K |\n\n## Pipeline Deep-Dive\n\nSingle Family homes represent 65% of pipeline but only 45% of closings. Condo deals close faster with less negotiation. Two deals fell through during inspection contingency in March.\n",
        "updated_at": datetime.now().isoformat(),
    }
}

SCHEDULES: dict[str, dict] = {}

DRILL_DOWN_CONTENT: dict[str, str] = {
    "chip-data": "Detailed metric breakdown: Sarah's closings are at the 90th percentile for agents in the greater metro area. Her list-to-close ratio of 98.2% places her in the top 5% of all Horizon Realty Group agents. Pipeline value has grown 22% quarter-over-quarter.",
    "chip-strengths": "Additional strength context: Sarah's client satisfaction score of 4.8/5 has been consistent for 6 consecutive months. Her repeat and referral rate of 34% is nearly double the brokerage average of 18%, indicating strong relationship-driven business.",
    "chip-patterns": "Detailed breakdown of pipeline patterns: The March spike in new listings coincided with the spring selling season, but conversion dropped because Sarah was spread thin across 15 active listings. The data suggests an optimal active listing count of 8-10 for maximum conversion efficiency.",
    "chip-cal-data": "Property type analysis deep-dive: Single Family homes have an average close time of 42 days vs. 28 days for Condos. Commercial properties are the most profitable per deal but have the longest close time at 67 days. Multi-Family is underrepresented in the portfolio with only 3% of pipeline.",
    "chip-meetings": "Deal stage analysis: The 142 Oak Ridge Dr negotiation has been ongoing for 12 days with a price gap of $15K between buyer and seller. The 55 Harbor View Ln listing at $892K has had 21 days on market with only 3 showings — may need a price adjustment or improved marketing.",
    "chip-discussion": "Quarterly trend analysis: Sarah's Q1 closings were 18 vs. 14 in Q4, a 28% increase. Her average commission per deal rose from $18.2K to $20.4K. The data suggests her pricing strategy is improving alongside volume, which is unusual — most agents trade volume for margin.",
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
