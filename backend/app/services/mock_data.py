"""In-memory mock data store. All demo data lives here."""

import uuid
from typing import Optional
from datetime import datetime, timedelta

# --- Agents ---

AGENTS = [
    {
        "id": "agent-1on1",
        "name": "1-on-1 Prep Brief",
        "description": "Generate manager prep briefs for upcoming 1-on-1s",
        "icon": "user-check",
        "category": "People Management",
        "purpose": "People Manager",
        "tags": ["1-on-1", "Coaching", "Benchmarks", "Investigation"],
        "integrations": ["outlook", "teams", "google-calendar"],
        "is_favorite": True,
        "usage_count": 142,
        "last_used": datetime.now().isoformat(),
        "last_generated": datetime.now().isoformat(),
    },
    {
        "id": "agent-executive",
        "name": "Executive Digest Agent",
        "description": "Generate executive-level dashboards and signal reports for company-wide or department-level meeting analytics",
        "icon": "bar-chart-3",
        "category": "Leadership & Strategy",
        "purpose": "Senior Leader",
        "tags": ["Board-Ready", "Talent", "Capacity", "Risk"],
        "integrations": ["outlook", "google-calendar"],
        "is_favorite": True,
        "usage_count": 98,
        "last_used": (datetime.now() - timedelta(days=2)).isoformat(),
        "last_generated": (datetime.now() - timedelta(days=2)).isoformat(),
    },
    {
        "id": "agent-recurring",
        "name": "Recurring Meeting Audit",
        "description": "Review all recurring meetings for cost, quality, and attendance with actionable recommendations",
        "icon": "repeat",
        "category": "Productivity & Efficiency",
        "purpose": "Team Lead",
        "tags": ["Cost", "Quality", "Attendance", "Audit"],
        "integrations": ["outlook", "teams", "slack"],
        "is_favorite": False,
        "usage_count": 67,
        "last_used": (datetime.now() - timedelta(days=5)).isoformat(),
        "last_generated": (datetime.now() - timedelta(days=5)).isoformat(),
    },
    {
        "id": "agent-team-health",
        "name": "Team Health Check",
        "description": "Measure team health related to meeting patterns with engagement, workload, and collaboration insights",
        "icon": "heart-pulse",
        "category": "People Management",
        "purpose": "People Manager",
        "tags": ["Wellness", "Engagement", "Workload", "Monitor"],
        "integrations": ["outlook", "teams", "google-calendar", "slack"],
        "is_favorite": False,
        "usage_count": 55,
        "last_used": (datetime.now() - timedelta(days=10)).isoformat(),
        "last_generated": (datetime.now() - timedelta(days=10)).isoformat(),
    },
]

# --- Agent-specific conversation modes ---

AGENT_MODES = {
    "agent-1on1": [
        {"id": "coaching", "label": "Coaching & Support", "description": "Strengths-first, warm tone, for growth and wellbeing"},
        {"id": "performance", "label": "Performance Review Prep", "description": "Evidence-based, balanced, for formal reviews"},
        {"id": "workload", "label": "Workload Concern", "description": "Volume/trend data, caring but factual, for capacity signals"},
        {"id": "investigation", "label": "Investigation", "description": "Direct/factual, data-driven, for engagement concerns"},
    ],
    "agent-executive": [
        {"id": "talent", "label": "Talent Focus", "description": "People-centric signals: engagement, burnout risk, 1-on-1 coverage"},
        {"id": "board-ready", "label": "Board-Ready", "description": "Executive summary with key metrics, trends, and cost impact"},
        {"id": "capacity", "label": "Capacity Review", "description": "Workload distribution, meeting overload, and resource utilisation"},
        {"id": "risk", "label": "Risk Assessment", "description": "Red flags: declining quality, attendance drops, compliance gaps"},
    ],
    "agent-recurring": [
        {"id": "cost", "label": "Cost Optimisation", "description": "Focus on time and money waste, consolidation opportunities"},
        {"id": "quality", "label": "Quality Review", "description": "Focus on agenda usage, purpose clarity, and desired outcomes"},
        {"id": "attendance", "label": "Attendance & Engagement", "description": "Focus on declining rates, no-response patterns, and participation"},
    ],
    "agent-team-health": [
        {"id": "coaching", "label": "Coaching & Support", "description": "Team morale and wellbeing focus, strengths-first framing"},
        {"id": "performance", "label": "Performance Review", "description": "Team metrics vs benchmarks, evaluative comparison"},
        {"id": "workload", "label": "Workload Concern", "description": "Capacity and burnout signals across the team"},
        {"id": "investigation", "label": "Investigation", "description": "Engagement and participation patterns, direct factual framing"},
    ],
}

# For backward compatibility, keep a global list (used by sessions that don't specify an agent)
CONVERSATION_MODES = AGENT_MODES["agent-1on1"]

# --- Subject options per agent ---

AGENT_SUBJECTS = {
    "agent-1on1": {
        "type": "employee",
        "label": "Select a direct report",
        "options": [
            "Chris Petersen",
            "Mart Thompson",
            "Damien Nguyen",
            "Jessie Martinez",
            "Johnny Walsh",
            "Jackson Lee",
        ],
    },
    "agent-executive": {
        "type": "scope",
        "label": "Select target scope",
        "options": [
            "Company-wide",
            "Engineering",
            "Product",
            "Design",
            "Marketing",
            "Sales",
            "Operations",
        ],
    },
    "agent-recurring": {
        "type": "auto",
        "label": "Your recurring meetings",
        "options": [],
    },
    "agent-team-health": {
        "type": "department-team",
        "label": "Select department and team",
        "departments": {
            "Engineering": ["Platform", "Frontend", "Backend", "Data", "DevOps"],
            "Product": ["Search", "Marketplace", "Payments"],
            "Design": ["UX Research", "Product Design", "Brand"],
            "Marketing": ["Growth", "Content", "Analytics"],
            "Sales": ["Enterprise", "SMB", "Partnerships"],
        },
    },
}

# --- Sessions ---

SESSIONS: list[dict] = [
    {
        "id": "session-1",
        "agent_id": "agent-1on1",
        "title": "1:1 Prep Brief: Chris Petersen",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "preview": "Chris's response rate of 99.2% is exceptional vs peer median of 80.2%...",
        "mode": "coaching",
    },
    {
        "id": "session-2",
        "agent_id": "agent-executive",
        "title": "Executive Digest: Engineering (Last Month)",
        "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "preview": "Engineering dept meeting cost up 5.1% MoM, driven by cross-team alignment meetings...",
        "mode": "board-ready",
    },
    {
        "id": "session-3",
        "agent_id": "agent-recurring",
        "title": "Recurring Meeting Audit: Last Quarter",
        "created_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=3)).isoformat(),
        "preview": "3 meetings with declining attendance, 2 candidates for elimination...",
        "mode": "cost",
    },
    {
        "id": "session-4",
        "agent_id": "agent-team-health",
        "title": "Team Health Check: Platform Team (Last Month)",
        "created_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "preview": "Platform team avg 24.3 meeting hrs/member vs org median 18.4...",
        "mode": "coaching",
    },
]

# --- Content Modules ---

MODULES_1ON1 = [
    {
        "id": "module-glance",
        "title": "At a Glance",
        "chips": [
            {"id": "chip-data", "label": "Data Interpreter", "enabled": True},
            {"id": "chip-strengths", "label": "Strengths to Acknowledge", "enabled": False},
            {"id": "chip-patterns", "label": "Patterns Worth Discussing", "enabled": False},
        ],
        "content": {
            "chip-data": {
                "metrics": [
                    {"label": "Monthly meeting hours", "value": "62.5", "median": "66.4", "position": "Middle of pack (43rd of 69)"},
                    {"label": "% of working time in meetings", "value": "38.5%", "median": "35.4%", "position": "Slightly above median"},
                    {"label": "Meetings per month", "value": "118", "median": "129", "position": "Below median"},
                    {"label": "Top meeting category", "value": "Alignment (49.9%)", "median": "—", "position": "Heavy alignment load"},
                    {"label": "Outside-hours meetings", "value": "0.5 hrs", "median": "—", "position": "Minimal - positive signal"},
                    {"label": "Meetings organised (% of total)", "value": "39%", "median": "—", "position": "Active organiser"},
                    {"label": "Response rate to invitations", "value": "99.2%", "median": "80.2%", "position": "Top of cohort"},
                    {"label": "External meeting %", "value": "23.7%", "median": "—", "position": "Above typical for EM role"},
                    {"label": "Speedy meeting adoption", "value": "37.3%", "median": "22.7%", "position": "Above peer median"},
                    {"label": "Large meeting % (8+ attendees)", "value": "37.3%", "median": "28.3%", "position": "Above median"},
                ],
                "text": "Chris is a **solid performer** vs. peers across most metrics. Exceptional response rate and speedy meeting adoption stand out as clear strengths.",
            },
            "chip-strengths": {
                "items": [
                    "Exceptional response rate (99.2%) — Chris responds to almost every meeting invitation he receives. The EM peer median is around 80%. This signals strong calendar discipline and respect for colleagues' planning needs.",
                    "Minimal outside-hours impact — Only 0.5 hours outside work hours in April (a single meeting). Despite a busy calendar, Chris is maintaining clear boundaries. This is worth protecting.",
                    "Strong speedy meeting adoption (37.3%) — Chris uses 25-minute or 50-minute formats more than most of his peers (median 22.7%). He's practising intentional meeting design rather than defaulting to 30/60 minute blocks.",
                    "Good recurring/ad-hoc balance (55/45 split) — A healthy mix suggesting he's not over-committed to standing meetings but still has structure. The 55% recurring is right in the optimal range.",
                ]
            },
            "chip-patterns": {
                "items": [
                    "Meeting load spiked significantly in March (79.4 hrs, 49% of time) before settling back in April (62.5 hrs, 38.5%). The 4-month trend: Jan 52.7 hrs, Feb 54.8 hrs, Mar 79.4 hrs, Apr 62.5 hrs. March was driven by ad-hoc meetings nearly doubling.",
                    "Almost half his meeting time is Alignment meetings (49.9%, 31.2 hours). Key forums: SETI JPD refinement (weekly, 12 people), Due Diligence stakeholder stand up (weekly, 33-35 people), ETech Weekly Wednesday Update (weekly, 42 people).",
                    "Wednesday is by far the heaviest day (18.3 hrs across the month, 29% of weekly time in meetings). Day distribution: Mon 7.4 hrs, Tue 16.2 hrs, Wed 18.3 hrs, Thu 15.6 hrs, Fri 4.5 hrs.",
                    "High external meeting engagement (23.7%) across 16 unique companies — primarily Google (6 meetings, 4.5 hrs), Atlassian (8 meetings, 4.2 hrs), and Searce (4 meetings, 3.7 hrs). Above typical for an EM role.",
                ]
            },
        },
    },
    {
        "id": "module-calendar",
        "title": "Calendar Deep-Dive",
        "chips": [
            {"id": "chip-cal-data", "label": "Data Interpreter", "enabled": True},
            {"id": "chip-meetings", "label": "Top Recurring Time Commitments", "enabled": False},
            {"id": "chip-organized", "label": "Meetings Organized", "enabled": False},
            {"id": "chip-adhoc", "label": "Ad-hoc Meetings", "enabled": False},
            {"id": "chip-1on1-coverage", "label": "1:1 Coverage", "enabled": False},
            {"id": "chip-starters", "label": "Discussion Starters", "enabled": False},
        ],
        "content": {
            "chip-cal-data": {
                "headers": [
                    {"key": "meeting", "label": "Category"},
                    {"key": "hours", "label": "Hours"},
                    {"key": "cost", "label": "% of Meeting Time"},
                    {"key": "intent", "label": "Meetings"},
                ],
                "table": [
                    {"meeting": "Alignment", "hours": "31.2", "cost": "49.9%", "intent": "61"},
                    {"meeting": "Supporting Individuals", "hours": "11.6", "cost": "18.5%", "intent": "22"},
                    {"meeting": "Decision Making", "hours": "5.5", "cost": "8.8%", "intent": "12"},
                    {"meeting": "Learning & Sharing", "hours": "5.5", "cost": "8.8%", "intent": "8"},
                    {"meeting": "Planning", "hours": "3.9", "cost": "6.3%", "intent": "6"},
                    {"meeting": "Uncategorised", "hours": "2.6", "cost": "4.1%", "intent": "6"},
                    {"meeting": "Evaluation", "hours": "1.2", "cost": "1.9%", "intent": "2"},
                    {"meeting": "Fostering Connections", "hours": "1.0", "cost": "1.6%", "intent": "1"},
                ],
            },
            "chip-meetings": {
                "table": [
                    {"meeting": "Due Diligence stakeholder stand up", "hours": "Weekly", "cost": "~$5,700/mo", "intent": "33-35", "alignment": "High"},
                    {"meeting": "ETech Weekly Wednesday Update", "hours": "Weekly", "cost": "~$3,400/mo", "intent": "42", "alignment": "Medium"},
                    {"meeting": "SETI JPD refinement", "hours": "Recurring", "cost": "~$1,500/occ", "intent": "12", "alignment": "High"},
                    {"meeting": "Apps Team Standup", "hours": "Weekly", "cost": "~$1,800/mo", "intent": "11", "alignment": "Medium"},
                    {"meeting": "ETech Apps Stand up (2026)", "hours": "Weekly", "cost": "~$2,200/mo", "intent": "12", "alignment": "Medium"},
                    {"meeting": "Enterprise App Leads Weekly", "hours": "Weekly", "cost": "~$760/mo", "intent": "4", "alignment": "High"},
                    {"meeting": "Apps Team: JPD Prioritisation", "hours": "Weekly", "cost": "~$1,640/mo", "intent": "9", "alignment": "Medium"},
                ],
            },
            "chip-organized": {
                "table": [
                    {"meeting": "Apps Team Standup", "hours": "Weekly", "cost": "11 attendees", "intent": "62%", "alignment": "Medium"},
                    {"meeting": "Enterprise App Leads Weekly", "hours": "Weekly", "cost": "4 attendees", "intent": "78%", "alignment": "High"},
                    {"meeting": "Apps Team: JPD Prioritisation", "hours": "Weekly", "cost": "9 attendees", "intent": "98%", "alignment": "High"},
                    {"meeting": "1:1s with Direct Reports", "hours": "Various", "cost": "1 attendee", "intent": "—", "alignment": "—"},
                    {"meeting": "Ad-hoc Vendor Coordination", "hours": "Ad-hoc", "cost": "2-4 attendees", "intent": "69%", "alignment": "Medium"},
                ],
                "text": "Chris organises **46 meetings (39% of his total)**. Quality score: 65.2% overall. Ad-hoc meetings score higher (69.2%) than recurring ones (62.3%). Agenda usage is low at **17.4%**, though context clarity is high at **91.3%**.\n\nChris's organised meeting quality varies considerably. His JPD Prioritisation meeting stands out with a 98% quality score and consistent agenda usage — this should be the model for his other recurring meetings. The Apps Team Standup scores lowest among his organised meetings, and the lack of agenda (17.4% overall usage) is a drag on quality. The high context clarity (91.3%) suggests Chris communicates purpose well when creating meetings, but doesn't formalise it with agendas. Recommendation: adopt the JPD Prioritisation format (agenda + desired outcomes) as the standard for all meetings he organises.",
            },
            "chip-adhoc": {
                "items": [
                    "**53 ad-hoc meetings** in April, accounting for **28.2 hrs (45% of total meeting time)**",
                    "Vendor coordination (Google, Atlassian, Searce): 14 meetings, 10.2 hrs",
                    "Cross-team alignment syncs: 12 meetings, 7.8 hrs",
                    "1:1 check-ins (beyond recurring): 9 meetings, 3.8 hrs",
                    "Project-specific workshops: 8 meetings, 4.2 hrs",
                    "Interview panels: 6 meetings, 1.6 hrs",
                    "Other: 4 meetings, 0.6 hrs",
                ],
                "text": "Ad-hoc meetings have a quality score of **69.2%** vs **62.3%** for recurring — likely because they tend to be smaller (avg 3.2 attendees) and more focused. Speedy meeting adoption is strong at **44.1%** for ad-hoc vs **31.2%** for recurring.\n\nChris's ad-hoc meeting pattern reveals two important signals. First, the vendor coordination cluster (10.2 hrs) is substantial and suggests he's carrying significant external relationship management load — this is typically a senior+ or principal EM responsibility. Second, the cross-team alignment syncs (7.8 hrs) indicate he's a connector between teams, which is valuable but can become a bottleneck. The higher quality scores on ad-hoc vs recurring (69.2% vs 62.3%) suggest Chris is more intentional when creating one-off meetings than when maintaining standing ones. The 9 ad-hoc 1:1 check-ins beyond his recurring cadence show he's responsive to team needs, but also that his recurring 1:1 schedule may not fully cover what his reports need.",
            },
            "chip-1on1-coverage": {
                "items": [
                    "Recurring 1:1 coverage: **100%** — Chris has weekly or fortnightly 1:1s scheduled with all direct reports",
                    "Cancellation rate: **0%** — no 1:1s were cancelled in April, showing strong commitment to these meetings",
                    "Reschedule rate: **75%** — 3 of 4 meetings were rescheduled, suggesting flexibility rather than avoidance (the meetings happen, just at different times)",
                    "Average duration: **45 mins** with direct reports",
                    "Broader team: Chris runs 1:1s with Mart (weekly), Damien (fortnightly), Jessie (fortnightly), Johnny (fortnightly), and Jackson (ad-hoc check-ins)",
                ]
            },
            "chip-starters": {
                "items": [
                    '"March was significantly busier than your other months — was that a one-off project spike, or is there an underlying trend we should watch?"',
                    '"You\'re in several large recurring forums (Due Diligence at 35 people, ETech Wednesday at 42 people). Do these still need you weekly, or could you attend fortnightly or get a summary?"',
                    '"Your external vendor work is quite extensive — Google, Atlassian, Searce, AvePoint, Salesforce. Is this sustainable, or would it help to bring someone else into some of these relationships?"',
                    '"Your speedy meeting adoption is good — you\'re using 25-minute slots for most of your ad-hoc meetings. Have you considered shifting some of your recurring standups from 30 to 25 minutes too?"',
                    '"You\'re doing a lot of the coordination and alignment work for the team. Is that energising for you, or would you prefer more time in Planning and Decision Making categories?"',
                    '"The JPD Prioritisation meeting has great quality scores (0.98) with an agenda. Some of your other recurring meetings (Apps Team Standup) have lower quality scores. Would it help to bring the same structure to those?"',
                    '"How are things going with the team members you\'re supporting? I can see regular 1:1s with Mart, Damien, Jessie, and Johnny — are you feeling good about the cadence and quality of those conversations?"',
                ]
            },
        },
    },
]

MODULES_EXECUTIVE = [
    {
        "id": "module-glance",
        "title": "At a Glance",
        "chips": [
            {"id": "chip-data", "label": "Data Interpreter", "enabled": True},
            {"id": "chip-signals", "label": "Key Signals", "enabled": False},
            {"id": "chip-trends", "label": "Trends Worth Noting", "enabled": False},
        ],
        "content": {
            "chip-data": {
                "metrics": [
                    {"label": "Total meeting cost", "value": "$2,847,500", "median": "$2,410,000"},
                    {"label": "Avg meeting hours per employee", "value": "18.4", "median": "16.2"},
                    {"label": "Meeting growth trend", "value": "+5.1%", "median": "+2.3%"},
                    {"label": "Large meeting % (8+ attendees)", "value": "28.4%", "median": "24.1%"},
                    {"label": "Avg quality score", "value": "67.4%", "median": "71.2%"},
                    {"label": "Agenda usage", "value": "58.2%", "median": "63.4%"},
                    {"label": "Speedy meeting adoption", "value": "62.3%", "median": "55.8%"},
                    {"label": "1-on-1 coverage rate", "value": "74.6%", "median": "82.1%"},
                    {"label": "External meeting %", "value": "23.7%", "median": "19.8%"},
                    {"label": "After-hours meeting hours", "value": "142", "median": "98"},
                ],
                "text": "Engineering department shows **moderate concern** — meeting costs are rising above benchmark, 1-on-1 coverage is below median, but speedy meeting adoption is a positive signal.",
            },
            "chip-signals": {
                "items": [
                    "Speedy meeting adoption at 62.3% exceeds org median (55.8%) — Engineering teams are actively using 25/50 minute formats, reducing schedule fragmentation across the department.",
                    "1-on-1 coverage at 74.6% is below the org median of 82.1% — approximately 18 managers have inconsistent or missing 1-on-1 cadences with their direct reports. This is a retention risk.",
                    "Meeting cost of $2.85M is 18% above the org median per-capita — driven primarily by large cross-team alignment meetings averaging 15+ attendees.",
                ]
            },
            "chip-trends": {
                "items": [
                    "Meeting growth trend of +5.1% MoM exceeds the org benchmark of +2.3% — if unchecked, Engineering will hit 22+ hours per employee by Q3, crossing the burnout threshold.",
                    "After-hours meeting hours (142) are 45% above org median (98) — concentrated in the Platform and DevOps teams, likely driven by on-call overlap with standups.",
                    "Quality scores have declined 3.8 points over the last quarter — the drop correlates with a 12% increase in large meetings, suggesting size is impacting meeting effectiveness.",
                ]
            },
        },
    },
    {
        "id": "module-department",
        "title": "Department Breakdown",
        "chips": [
            {"id": "chip-dept-data", "label": "Data Interpreter", "enabled": True},
            {"id": "chip-cost-centers", "label": "Top Cost Centers", "enabled": False},
            {"id": "chip-red-flags", "label": "Red Flags & Recommendations", "enabled": False},
        ],
        "content": {
            "chip-dept-data": {
                "items": [
                    "Platform: $890K cost, 22.1 hrs/employee, 34% large meetings, quality 61.2%",
                    "Frontend: $620K cost, 19.4 hrs/employee, 28% large meetings, quality 72.8%",
                    "Backend: $540K cost, 17.8 hrs/employee, 22% large meetings, quality 69.4%",
                    "Data: $410K cost, 16.2 hrs/employee, 19% large meetings, quality 74.1%",
                    "DevOps: $387K cost, 21.6 hrs/employee, 31% large meetings, quality 58.9%",
                ],
            },
            "chip-cost-centers": {
                "table": [
                    {"meeting": "Platform Team", "hours": "22.1 hrs/emp", "cost": "$890K", "intent": "34% large", "alignment": "Low"},
                    {"meeting": "DevOps Team", "hours": "21.6 hrs/emp", "cost": "$387K", "intent": "31% large", "alignment": "Low"},
                    {"meeting": "Frontend Team", "hours": "19.4 hrs/emp", "cost": "$620K", "intent": "28% large", "alignment": "Medium"},
                    {"meeting": "Backend Team", "hours": "17.8 hrs/emp", "cost": "$540K", "intent": "22% large", "alignment": "Medium"},
                    {"meeting": "Data Team", "hours": "16.2 hrs/emp", "cost": "$410K", "intent": "19% large", "alignment": "High"},
                ],
            },
            "chip-red-flags": {
                "items": [
                    "Platform team quality score (61.2%) is 10+ points below org median — 4 of their 6 weekly standups have no agenda and declining attendance. Recommend consolidating to 2 standups with required agendas.",
                    "DevOps after-hours meeting load is 3x the org average — on-call engineers are attending standups during off-hours. Recommend async standup format for on-call rotation.",
                    "1-on-1 coverage gap in Platform team — only 58% of direct reports have weekly 1-on-1s vs 82% org median. Flag 3 managers with inconsistent cadence.",
                    "Cross-team alignment meetings account for 41% of Engineering meeting cost — recommend quarterly audit of recurring multi-team syncs with >15 attendees.",
                ]
            },
        },
    },
]

MODULES_RECURRING = [
    {
        "id": "module-summary",
        "title": "Recurring Meeting Summary",
        "chips": [
            {"id": "chip-data", "label": "Data Interpreter", "enabled": True},
            {"id": "chip-cost-breakdown", "label": "Time & Cost Breakdown", "enabled": False},
            {"id": "chip-quick-wins", "label": "Quick Wins", "enabled": False},
        ],
        "content": {
            "chip-data": {
                "metrics": [
                    {"label": "Total recurring meetings", "value": "14", "median": "11"},
                    {"label": "Monthly recurring hours", "value": "42.5", "median": "34.2"},
                    {"label": "Monthly recurring cost", "value": "$9,780", "median": "$7,200"},
                    {"label": "% of calendar from recurring", "value": "61.2%", "median": "52.4%"},
                    {"label": "Avg meeting size", "value": "6.3", "median": "5.1"},
                    {"label": "Avg quality score", "value": "54.8%", "median": "62.1%"},
                    {"label": "Avg agenda usage", "value": "42.1%", "median": "58.3%"},
                    {"label": "Avg response rate", "value": "72.4%", "median": "81.6%"},
                    {"label": "Meetings with declining attendance", "value": "3", "median": "1"},
                ],
                "text": "Your recurring meeting portfolio shows **significant optimization opportunity** — 61.2% of calendar is recurring (above the 52% benchmark), with below-average quality scores and agenda usage.",
            },
            "chip-cost-breakdown": {
                "items": [
                    "Alignment: 18.2 hrs (42.8%), $4,220/mo — largest recurring category",
                    "Decision Making: 8.5 hrs (20.0%), $1,960/mo — second highest cost",
                    "Supporting Individuals: 6.3 hrs (14.8%), $1,440/mo — includes 1-on-1s",
                    "Planning: 5.1 hrs (12.0%), $1,180/mo — sprint ceremonies",
                    "Learning & Sharing: 2.8 hrs (6.6%), $640/mo — team retrospectives",
                    "Uncategorised: 1.6 hrs (3.8%), $340/mo — no clear purpose tagged",
                ],
            },
            "chip-quick-wins": {
                "items": [
                    "3 meetings could be shortened from 60 to 30 min — saves 6 hrs/month ($1,380): Daily standup, Sprint review prep, Vendor alignment sync",
                    "2 weekly meetings could move to bi-weekly — saves 4 hrs/month ($920): Tech debt review, Cross-team sync",
                    "1 meeting has no agenda and declining attendance — candidate for elimination: 'Catch-up' with 35% response rate and 0% agenda usage",
                ]
            },
        },
    },
    {
        "id": "module-breakdown",
        "title": "Meeting-by-Meeting Breakdown",
        "chips": [
            {"id": "chip-breakdown-data", "label": "Data Interpreter", "enabled": True},
            {"id": "chip-meeting-cards", "label": "Meeting Cards", "enabled": False},
            {"id": "chip-recommendations", "label": "Recommendations", "enabled": False},
        ],
        "content": {
            "chip-breakdown-data": {
                "items": [
                    "Keep (6 meetings): Weekly 1-on-1s, Sprint Planning, Team Retrospective — all show high attendance and quality",
                    "Merge (2 meetings): Tech debt review + Cross-team sync overlap in attendees and topics — combine into one 45-min session",
                    "Eliminate (2 meetings): 'Catch-up' and 'Status update' — declining attendance, no agenda, low quality scores",
                ],
            },
            "chip-meeting-cards": {
                "table": [
                    {"meeting": "Weekly Sprint Sync", "hours": "Weekly (4x/mo)", "cost": "$7,360/mo", "intent": "8 avg", "alignment": "Keep"},
                    {"meeting": "1-on-1: Direct Reports", "hours": "Weekly (4x/mo)", "cost": "$2,880/mo", "intent": "2 avg", "alignment": "Keep"},
                    {"meeting": "Team Retrospective", "hours": "Bi-weekly (2x/mo)", "cost": "$1,440/mo", "intent": "6 avg", "alignment": "Keep"},
                    {"meeting": "Tech Debt Review", "hours": "Weekly (4x/mo)", "cost": "$3,200/mo", "intent": "8 avg", "alignment": "Merge"},
                    {"meeting": "Cross-team Sync", "hours": "Weekly (4x/mo)", "cost": "$2,560/mo", "intent": "6 avg", "alignment": "Merge"},
                    {"meeting": "Vendor Alignment", "hours": "Weekly (4x/mo)", "cost": "$1,920/mo", "intent": "5 avg", "alignment": "Keep"},
                    {"meeting": "'Catch-up'", "hours": "Weekly (4x/mo)", "cost": "$4,800/mo", "intent": "12 avg", "alignment": "Eliminate"},
                ],
            },
            "chip-recommendations": {
                "items": [
                    "Keep: Weekly Sprint Sync — high quality score (78%), strong attendance (92%), clear agenda. This meeting is working well.",
                    "Merge: Tech Debt Review + Cross-team Sync — 6 shared attendees and overlapping topics (both discuss technical priorities). Combine into one 45-min 'Technical Priorities Sync' — saves $1,920/mo and 4 hrs/month.",
                    "Eliminate: 'Catch-up' — 35% response rate, 0% agenda usage, declining attendance (-18% over 3 months). Replace with async Slack update.",
                    "Eliminate: 'Status update' — 42% response rate, no desired outcomes tagged, quality score 28%. The information shared is already available in the project dashboard.",
                ]
            },
        },
    },
]

MODULES_TEAM_HEALTH = [
    {
        "id": "module-snapshot",
        "title": "Team Snapshot",
        "chips": [
            {"id": "chip-data", "label": "Data Interpreter", "enabled": True},
            {"id": "chip-strengths", "label": "Strengths to Build On", "enabled": False},
            {"id": "chip-concerns", "label": "Areas of Concern", "enabled": False},
        ],
        "content": {
            "chip-data": {
                "metrics": [
                    {"label": "Team size", "value": "12", "median": "10"},
                    {"label": "Avg meeting hours per member", "value": "24.3", "median": "18.4"},
                    {"label": "% of working time in meetings", "value": "38.5%", "median": "29.4%"},
                    {"label": "Team meeting count", "value": "286", "median": "210"},
                    {"label": "Avg quality score", "value": "62.1%", "median": "67.8%"},
                    {"label": "1-on-1 coverage rate", "value": "68.4%", "median": "82.1%"},
                    {"label": "External meeting %", "value": "18.2%", "median": "19.8%"},
                    {"label": "After-hours meetings (team total)", "value": "8.5 hrs", "median": "3.2 hrs"},
                    {"label": "Speedy meeting adoption", "value": "55.6%", "median": "55.8%"},
                    {"label": "Large meeting % (8+ attendees)", "value": "31.2%", "median": "24.1%"},
                ],
                "text": "The Platform team shows **elevated meeting load** with below-average quality scores. Meeting hours per member are 32% above the org median, and 1-on-1 coverage is a significant gap.",
            },
            "chip-strengths": {
                "items": [
                    "Speedy meeting adoption (55.6%) is on par with org median — the team is already using shorter meeting formats for most ad-hoc meetings.",
                    "External meeting % (18.2%) is healthy and below org median — the team is focused inward on collaboration rather than spread thin across external commitments.",
                    "Two team members (Alex, Sam) have exceptional quality scores (>80%) — they model good meeting practices including consistent agenda usage and clear desired outcomes.",
                ]
            },
            "chip-concerns": {
                "items": [
                    "After-hours meetings total 8.5 hrs/month for the team — 2.7x the org median. Concentrated in 3 on-call team members who attend standups during off-hours.",
                    "1-on-1 coverage at 68.4% is 14 points below org median — approximately 4 team members lack consistent weekly 1-on-1s with their manager.",
                    "Average quality score (62.1%) is 5.7 points below org median — driven by 4 large recurring meetings with no agenda and declining attendance.",
                    "Large meeting % (31.2%) exceeds org median — the team's 3 cross-team syncs average 12+ attendees, diluting individual contribution quality.",
                ]
            },
        },
    },
    {
        "id": "module-health",
        "title": "Meeting Health Indicators",
        "chips": [
            {"id": "chip-health-data", "label": "Data Interpreter", "enabled": True},
            {"id": "chip-workload", "label": "Workload Distribution", "enabled": False},
            {"id": "chip-1on1-quality", "label": "1-on-1 Coverage & Quality", "enabled": False},
            {"id": "chip-collab", "label": "Collaboration Patterns", "enabled": False},
            {"id": "chip-discussion", "label": "Discussion Starters for Team Lead", "enabled": False},
        ],
        "content": {
            "chip-health-data": {
                "items": [
                    "Workload range: 16.2 hrs (lowest member) to 31.4 hrs (highest member) — 94% variation",
                    "1-on-1 coverage: 68.4%, cancellation rate: 12%, reschedule rate: 28%",
                    "Internal vs External split: 82% internal, 18% external",
                    "Meeting clustering: 42% of meetings concentrate on Tue/Wed, with minimal Fri meetings",
                ],
            },
            "chip-workload": {
                "table": [
                    {"meeting": "Jordan (Lead)", "hours": "31.4 hrs", "cost": "High", "intent": "8 after-hrs", "alignment": "Overloaded"},
                    {"meeting": "Alex", "hours": "27.8 hrs", "cost": "Medium", "intent": "2 after-hrs", "alignment": "Above avg"},
                    {"meeting": "Sam", "hours": "24.6 hrs", "cost": "Medium", "intent": "0 after-hrs", "alignment": "Optimal"},
                    {"meeting": "Riley", "hours": "22.1 hrs", "cost": "Medium", "intent": "1 after-hrs", "alignment": "Optimal"},
                    {"meeting": "Casey", "hours": "16.2 hrs", "cost": "Low", "intent": "0 after-hrs", "alignment": "Under-utilised"},
                ],
            },
            "chip-1on1-quality": {
                "items": [
                    "Team-wide 1:1 coverage rate: **68.4%** — 14 points below org median (82.1%). Approximately 4 team members lack consistent weekly 1:1s.",
                    "Cancellation rate: **12%** — slightly above org average (8%). Cancellations concentrated in weeks with sprint deadlines.",
                    "Reschedule rate: **28%** — higher than ideal. The team lead (Jordan) reschedules most often due to conflicting stakeholder meetings.",
                    "Average 1:1 duration: **30 mins** — below the recommended 45 mins for meaningful coaching conversations.",
                    "Members missing regular 1:1s: Casey, Riley, and 2 others have had 0 or 1 scheduled 1:1 in the past month. This is a retention risk.",
                ]
            },
            "chip-collab": {
                "items": [
                    "Cross-team collaboration is strong — 38% of meetings include members from other teams, indicating healthy information flow.",
                    "Isolation signal: Casey has the lowest meeting count and attends 0 cross-team meetings. Worth exploring whether this is intentional (deep work focus) or a disengagement signal.",
                    "Meeting clustering on Tue/Wed creates 'meeting marathon' days — team averages 5.2 hours of meetings on Tuesdays. Recommend spreading meetings more evenly across the week.",
                ]
            },
            "chip-discussion": {
                "items": [
                    '"Jordan is carrying a heavy meeting load, especially with after-hours overlap. Would it help to redistribute some of the on-call meeting coverage?"',
                    '"1-on-1 coverage is below where it should be — 4 team members are missing regular check-ins. Could we establish a consistent cadence this sprint?"',
                    '"The quality scores on your large recurring meetings are below average. Would it help to add agendas or split them into smaller focused sessions?"',
                    '"Casey has the lightest meeting load on the team — is this by design, or would they benefit from more collaboration opportunities?"',
                    '"Tuesday is a meeting marathon for the team. Would staggering some meetings to Thursday help create more focus time?"',
                ]
            },
        },
    },
]

DEFAULT_MODULES = MODULES_1ON1

CONTENT_MODULES: dict[str, list[dict]] = {
    "session-1": MODULES_1ON1,
    "session-2": MODULES_EXECUTIVE,
    "session-3": MODULES_RECURRING,
    "session-4": MODULES_TEAM_HEALTH,
}

# Map agent_id to modules for new sessions
AGENT_MODULES: dict[str, list[dict]] = {
    "agent-1on1": MODULES_1ON1,
    "agent-executive": MODULES_EXECUTIVE,
    "agent-recurring": MODULES_RECURRING,
    "agent-team-health": MODULES_TEAM_HEALTH,
}

PINNED_ITEMS: dict[str, list[dict]] = {
    "session-1": [
        {
            "id": "pin-1",
            "module_id": "module-glance",
            "chip_id": "chip-data",
            "title": "At a Glance — Data Interpreter",
            "content": "Chris shows solid performance vs. peers. Monthly meeting hours: 62.5 (peer median: 66.4). Response rate: 99.2% (peer median: 80.2%). Speedy meeting adoption: 37.3% (peer median: 22.7%).",
        },
    ]
}

CHAT_MESSAGES: dict[str, list[dict]] = {
    "session-1": [
        {
            "id": "msg-1",
            "role": "user",
            "content": "I want to see Chris Petersen's meeting data for last month.",
            "timestamp": datetime.now().isoformat(),
        },
        {
            "id": "msg-2",
            "role": "assistant",
            "content": "I've pulled Chris Petersen's meeting data for last month. You can see the highlights in the modules above. His response rate and speedy meeting adoption are standout strengths. Would you like me to drill deeper into any specific area?",
            "timestamp": datetime.now().isoformat(),
        },
    ],
    "session-2": [
        {
            "id": "msg-3",
            "role": "user",
            "content": "Show me the Engineering department digest for last month.",
            "timestamp": (datetime.now() - timedelta(days=1)).isoformat(),
        },
        {
            "id": "msg-4",
            "role": "assistant",
            "content": "Here's the Engineering department digest. Meeting costs are 18% above org median per-capita, primarily driven by large alignment meetings. The 1-on-1 coverage gap is the most concerning signal. Want me to break down specific teams?",
            "timestamp": (datetime.now() - timedelta(days=1)).isoformat(),
        },
    ],
}

REPORTS: dict[str, dict] = {
    "session-1": {
        "session_id": "session-1",
        "title": "1:1 Prep Brief: Chris Petersen",
        "markdown": "# 1:1 Prep Brief: Chris Petersen\n\n## At a Glance\n\nChris shows solid performance vs. peers. Exceptional response rate (99.2%) and speedy meeting adoption (37.3%) stand out.\n\n| Metric | Chris | EM Peer Median |\n|--------|-------|----------------|\n| Monthly meeting hours | 62.5 | 66.4 |\n| % of working time in meetings | 38.5% | 35.4% |\n| Response rate | 99.2% | 80.2% |\n| Speedy meeting adoption | 37.3% | 22.7% |\n| External meeting % | 23.7% | — |\n\n## Calendar Deep-Dive\n\nAlignment meetings dominate at 49.9% of meeting time. Wednesday is the heaviest day (18.3 hrs). 3 recurring meetings have 30+ attendees.\n",
        "updated_at": datetime.now().isoformat(),
    },
    "session-2": {
        "session_id": "session-2",
        "title": "Executive Digest: Engineering (Last Month)",
        "markdown": "# Executive Digest: Engineering (Last Month)\n\n## At a Glance\n\nEngineering department shows moderate concern — meeting costs rising above benchmark, 1-on-1 coverage below median.\n\n| Metric | Engineering | Org Median |\n|--------|-------------|------------|\n| Total meeting cost | $2,847,500 | $2,410,000 |\n| Avg hrs/employee | 18.4 | 16.2 |\n| Meeting growth trend | +5.1% | +2.3% |\n| 1-on-1 coverage | 74.6% | 82.1% |\n\n## Department Breakdown\n\nPlatform team is the highest cost center at $890K with the lowest quality score (61.2%). DevOps shows concerning after-hours load.\n",
        "updated_at": (datetime.now() - timedelta(days=1)).isoformat(),
    },
    "session-3": {
        "session_id": "session-3",
        "title": "Recurring Meeting Audit: Last Quarter",
        "markdown": "# Recurring Meeting Audit\n\n## Summary\n\n14 recurring meetings totaling 42.5 hrs/month and $9,780/month. 61.2% of calendar is recurring (above 52% benchmark). 3 meetings with declining attendance.\n\n## Recommendations\n\n- **Keep** 6 meetings (high quality and attendance)\n- **Merge** 2 meetings (overlapping attendees and topics)\n- **Eliminate** 2 meetings (no agenda, declining engagement)\n\nPotential savings: $6,720/month and 14 hrs/month.\n",
        "updated_at": (datetime.now() - timedelta(days=3)).isoformat(),
    },
    "session-4": {
        "session_id": "session-4",
        "title": "Team Health Check: Platform Team",
        "markdown": "# Team Health Check: Platform Team (Last Month)\n\n## Team Snapshot\n\n12 members averaging 24.3 meeting hrs/month — 32% above org median. After-hours meetings at 2.7x org average.\n\n| Metric | Platform Team | Org Median |\n|--------|--------------|------------|\n| Avg meeting hrs/member | 24.3 | 18.4 |\n| 1-on-1 coverage | 68.4% | 82.1% |\n| Quality score | 62.1% | 67.8% |\n| After-hours meetings | 8.5 hrs | 3.2 hrs |\n\n## Discussion Starters\n\n- Jordan is overloaded with 31.4 hrs and 8 after-hours meetings\n- 1-on-1 coverage gap affects 4 team members\n- Tuesday meeting clustering creates marathon days\n",
        "updated_at": (datetime.now() - timedelta(days=7)).isoformat(),
    },
}

SCHEDULES: dict[str, dict] = {}

DRILL_DOWN_CONTENT: dict[str, str] = {
    # 1-on-1 drill-downs
    "chip-data": "Detailed metric breakdown: Chris's response rate of 99.2% places him in the top 5% of all Engineering Managers at REA Group. His monthly meeting hours of 62.5 are in the 43rd percentile — middle of pack. Speedy meeting adoption at 37.3% is 65% above the peer median, indicating intentional meeting design.",
    "chip-strengths": "Additional strength context: Chris's minimal outside-hours meetings (0.5 hrs) have been consistent for 4 consecutive months. His good recurring/ad-hoc balance suggests he protects time for both structured coordination and emergent needs. The 99.2% response rate is not just a recent spike — it's been above 97% for 6 months running.",
    "chip-patterns": "Detailed breakdown of patterns: The March spike (79.4 hrs) was driven by a GWS Technical Discovery project that added 15+ ad-hoc meetings. April's recovery to 62.5 hrs suggests the spike was project-driven, not structural. The Wednesday clustering (18.3 hrs) is partly due to 3 large recurring forums all scheduling on Wednesdays.",
    "chip-cal-data": "Meeting category analysis: Alignment dominates because Chris manages cross-team dependencies across 4 product squads. The Supporting Individuals category (18.5%) includes 4 regular 1:1s with direct reports. Decision Making at 8.8% is lower than typical for EMs — worth exploring whether he's involved in enough decisions or relies too heavily on alignment forums.",
    "chip-meetings": "Recurring meeting cost analysis: The Due Diligence standup at $5,700/mo is the single highest-cost recurring meeting. Chris's attendance is primarily informational — he could potentially receive a summary instead. The SETI JPD refinement has the best quality score (0.98) among his recurring meetings.",
    "chip-organized": "Meetings organized analysis: Chris's organised meetings have a 65.2% quality score overall. The low agenda usage (17.4%) is concentrated in his recurring standups — ad-hoc meetings he creates score higher because they tend to have clearer context. The Apps Team: JPD Prioritisation meeting is the standout with a 98% quality score, driven by consistent agenda usage and clear desired outcomes.",
    "chip-1on1-coverage": "1:1 coverage deep-dive: Despite the 75% reschedule rate, all 1:1s are happening — Chris is committed but juggling a dynamic calendar. The 45-minute average duration is appropriate for coaching conversations. The broader team 1:1 cadence (Mart weekly, Damien/Jessie/Johnny fortnightly) suggests Chris adapts frequency to each report's needs. Jackson's ad-hoc check-ins may indicate a newer team member who hasn't yet settled into a regular cadence.",
    "chip-starters": "Quarterly trend for discussion: Chris's Q1 meeting hours were Jan 52.7, Feb 54.8, Mar 79.4, Apr 62.5. The trend line suggests a new baseline around 60-65 hrs/month, which is 10-15% above his Jan/Feb levels. His external engagement (Google, Atlassian, Searce) may decrease once the current discovery phase completes.",
    # Executive digest drill-downs
    "chip-signals": "Signal analysis: The 1-on-1 coverage gap (74.6% vs 82.1% median) affects approximately 18 managers across Engineering. The correlation between low 1-on-1 coverage and team attrition in Q1 was statistically significant (p<0.05). The speedy meeting adoption bright spot suggests the team is receptive to meeting design improvements.",
    "chip-trends": "Trend projection: At +5.1% MoM growth, Engineering will hit 22+ hours per employee by Q3 2026, crossing the 20-hour burnout threshold identified in organizational research. The quality score decline (3.8 points over the quarter) follows a pattern seen in 3 other departments that exceeded 20 hrs/employee.",
    "chip-cost-centers": "Cost center deep-dive: Platform team's $890K cost is driven by 6 weekly cross-team syncs averaging 12+ attendees at blended rate of ~$120/hr/person. DevOps's after-hours load is concentrated in 3 on-call engineers who attend standups during rotation. Frontend team has the best balance of cost and quality.",
    "chip-red-flags": "Risk assessment: Platform quality score (61.2%) has been declining for 3 consecutive months. The 3 managers with inconsistent 1-on-1 cadence have received 2x more skip-level escalation requests than the Engineering average. The cross-team meeting cost ($1.17M) represents 41% of total Engineering meeting spend.",
    # Recurring audit drill-downs
    "chip-cost-breakdown": "Cost breakdown detail: Alignment meetings ($4,220/mo) include 3 weekly cross-team syncs and 1 daily standup. Decision Making ($1,960/mo) is split between Sprint Planning and Tech Debt Review. The uncategorised meetings ($340/mo) have no tagged purpose — these are prime candidates for elimination or reclassification.",
    "chip-quick-wins": "Quick win implementation: Shortening 3 meetings from 60 to 30 min requires only organizer action (no attendee approval needed). Moving 2 meetings to bi-weekly should be proposed at the next sprint retrospective. The 'Catch-up' elimination should be paired with a Slack status update channel to prevent information gaps.",
    "chip-meeting-cards": "Meeting card detail: The Weekly Sprint Sync has the highest ROI — 78% quality score with clear agenda and consistent attendance. The 'Catch-up' meeting has the worst metrics across all dimensions: 35% response rate, 0% agenda, -18% attendance trend over 3 months, and no tagged desired outcomes.",
    "chip-recommendations": "Recommendation impact: If all recommendations are implemented, estimated savings are $6,720/month and 14 hours/month. The merge of Tech Debt Review + Cross-team Sync alone saves $1,920/month. The elimination of the 'Catch-up' saves $4,800/month — the highest single-item savings.",
    # Team health drill-downs
    "chip-workload": "Workload analysis: Jordan's 31.4 hrs includes 8 after-hours meetings from on-call rotation overlap. The 94% variation between highest (31.4) and lowest (16.2) member workload suggests uneven meeting distribution. Casey's 16.2 hrs may indicate under-utilisation or intentional deep-work protection.",
    "chip-1on1-quality": "1-on-1 quality analysis: The 68.4% coverage rate means 4 team members had fewer than 2 scheduled 1:1s in the past month. The 12% cancellation rate spikes to 25% during sprint weeks (weeks 2 and 4 of each sprint). The 30-minute average duration may be too short — teams with 45-minute 1:1s report 23% higher satisfaction scores. Jordan's high reschedule rate is driven by stakeholder conflicts that could be resolved with a fixed 1:1 time slot.",
    "chip-collab": "Collaboration pattern detail: The 38% cross-team meeting rate is above the Engineering average of 29%, indicating strong external collaboration. Casey's 0 cross-team meetings could signal either deep-work focus or isolation — context from the manager would clarify. Tuesday clustering affects 8 of 12 team members.",
    "chip-discussion": "Discussion context: These starters are calibrated for a Coaching & Support mode. In Performance Review mode, the framing would shift to evaluative language with explicit benchmarking. The 1-on-1 coverage gap is the highest-impact item — research shows consistent 1-on-1s reduce voluntary attrition by 20-30%.",
}


# --- Pulse Reports ---

PULSE_REPORTS: list[dict] = [
    {
        "id": "pulse-1",
        "title": "1:1 Prep Brief: Chris Petersen",
        "agent_name": "1-on-1 Prep Brief",
        "category": "People & Culture",
        "status": "focus",
        "preview": "Exceptional response rate (99.2%) and strong speedy meeting adoption (37.3%) stand out as clear strengths.",
        "markdown": "# 1:1 Prep Brief: Chris Petersen\n\nPrepared 6 May 2026 — Data from 1 April to 30 April 2026\nMode: Coaching & Support\nPeer Group: 69 Engineering Managers at REA Group\n\n---\n\n## At a Glance\n\n| Metric | Chris | EM Peer Median | Position |\n|--------|-------|----------------|----------|\n| Monthly meeting hours | 62.5 | 66.4 | Middle of pack (43rd of 69) |\n| % of working time in meetings | 38.5% | 35.4% | Slightly above median |\n| Meetings per month | 118 | 129 | Below median |\n| Response rate to invitations | 99.2% | 80.2% | Top of cohort |\n| Speedy meeting adoption | 37.3% | 22.7% | Above peer median |\n\n### Strengths to Acknowledge\n\n- **Exceptional response rate (99.2%)** — Chris responds to almost every meeting invitation he receives\n- **Minimal outside-hours impact** — Only 0.5 hours outside work hours in April\n- **Strong speedy meeting adoption (37.3%)** — Uses 25/50-minute formats more than peers\n- **Good recurring/ad-hoc balance (55/45 split)** — Healthy mix of structured and flexible meetings\n\n### Patterns Worth Discussing\n\n1. Meeting load spiked in March (79.4 hrs) before settling back in April (62.5 hrs)\n2. Almost half meeting time is Alignment (49.9%, 31.2 hours)\n3. Wednesday is the heaviest day (18.3 hrs, 29% of weekly meeting time)\n4. High external meeting engagement (23.7%) across 16 unique companies\n\n## Calendar Deep-Dive\n\n### Top Recurring Time Commitments\n\n| Meeting | Frequency | Attendees | Monthly Cost |\n|---------|-----------|-----------|-------------|\n| Due Diligence stakeholder stand up | Weekly | 33-35 | ~$5,700/month |\n| ETech Weekly Wednesday Update | Weekly | 42 | ~$3,400/month |\n| SETI JPD refinement | Recurring | 12 | ~$1,500/occurrence |\n\n### Discussion Starters\n\n- \"March was significantly busier — was that a one-off project spike, or is there an underlying trend?\"\n- \"You're in several large recurring forums. Do these still need you weekly?\"\n- \"Your external vendor work is quite extensive — is this sustainable?\"\n",
        "created_at": (datetime.now() - timedelta(hours=2)).isoformat(),
        "updated_at": (datetime.now() - timedelta(hours=2)).isoformat(),
    },
    {
        "id": "pulse-2",
        "title": "Executive Digest: Engineering (April 2026)",
        "agent_name": "Executive Digest Agent",
        "category": "Meetings",
        "status": "unread",
        "preview": "Engineering dept meeting cost up 5.1% MoM, driven by cross-team alignment meetings. 1-on-1 coverage at 74.6% is below org median.",
        "markdown": "# Executive Digest: Engineering (April 2026)\n\n## At a Glance\n\n| Metric | Engineering | Org Median |\n|--------|-------------|------------|\n| Total meeting cost | $2,847,500 | $2,410,000 |\n| Avg hrs/employee | 18.4 | 16.2 |\n| Meeting growth trend | +5.1% | +2.3% |\n| 1-on-1 coverage | 74.6% | 82.1% |\n\n## Key Signals\n\n- Speedy meeting adoption at 62.3% exceeds org median\n- 1-on-1 coverage gap affects ~18 managers\n- Meeting cost 18% above median per-capita\n\n## Department Breakdown\n\nPlatform team is the highest cost center at $890K with quality score 61.2%.\n",
        "created_at": (datetime.now() - timedelta(hours=5)).isoformat(),
        "updated_at": (datetime.now() - timedelta(hours=5)).isoformat(),
    },
    {
        "id": "pulse-3",
        "title": "Team Health Check: Platform Team",
        "agent_name": "Team Health Check",
        "category": "Wellness",
        "status": "unread",
        "preview": "Platform team avg 24.3 meeting hrs/member vs org median 18.4. After-hours meetings at 2.7x org average.",
        "markdown": "# Team Health Check: Platform Team\n\n## Team Snapshot\n\n| Metric | Platform Team | Org Median |\n|--------|--------------|------------|\n| Avg meeting hrs/member | 24.3 | 18.4 |\n| 1-on-1 coverage | 68.4% | 82.1% |\n| Quality score | 62.1% | 67.8% |\n| After-hours meetings | 8.5 hrs | 3.2 hrs |\n\n## Areas of Concern\n\n- After-hours meetings total 8.5 hrs/month — 2.7x org median\n- 1-on-1 coverage at 68.4% is 14 points below org median\n- Average quality score 5.7 points below org median\n",
        "created_at": (datetime.now() - timedelta(days=1)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=1)).isoformat(),
    },
    {
        "id": "pulse-4",
        "title": "Recurring Meeting Audit: Last Quarter",
        "agent_name": "Recurring Meeting Audit",
        "category": "Meetings",
        "status": "focus",
        "preview": "14 recurring meetings totaling 42.5 hrs/month. 3 with declining attendance, 2 candidates for elimination.",
        "markdown": "# Recurring Meeting Audit\n\n## Summary\n\n14 recurring meetings totaling 42.5 hrs/month and $9,780/month.\n\n| Metric | You | Peer Median |\n|--------|-----|-------------|\n| Monthly recurring hours | 42.5 | 34.2 |\n| % of calendar from recurring | 61.2% | 52.4% |\n| Avg quality score | 54.8% | 62.1% |\n\n## Recommendations\n\n- **Keep** 6 meetings\n- **Merge** 2 meetings\n- **Eliminate** 2 meetings\n\nPotential savings: $6,720/month and 14 hrs/month.\n",
        "created_at": (datetime.now() - timedelta(days=1, hours=3)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=1, hours=3)).isoformat(),
    },
    {
        "id": "pulse-5",
        "title": "1:1 Prep Brief: Mart Thompson",
        "agent_name": "1-on-1 Prep Brief",
        "category": "People & Culture",
        "status": "unread",
        "preview": "Mart's meeting hours dropped 15% this month. Response rate holding steady at 94.8%.",
        "markdown": "# 1:1 Prep Brief: Mart Thompson\n\n## At a Glance\n\nMart's meeting hours decreased from 58.2 to 49.4 this month, primarily from reduced ad-hoc meetings. Response rate stable at 94.8%.\n\n### Strengths\n\n- Consistent response rate (94.8%)\n- Reduced meeting load suggests improved focus time\n- Good use of speedy meeting formats for 1:1s\n\n### Patterns\n\n- Ad-hoc meeting count dropped 30% — may indicate reduced cross-team engagement\n- Friday meeting time nearly zero — protecting deep work day\n",
        "created_at": (datetime.now() - timedelta(days=2)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=2)).isoformat(),
    },
    {
        "id": "pulse-6",
        "title": "Executive Digest: Company-wide (Q1 2026)",
        "agent_name": "Executive Digest Agent",
        "category": "Meetings",
        "status": "archived",
        "preview": "Company-wide meeting cost $12.4M in Q1. Quality scores improving +2.1 pts from Q4.",
        "markdown": "# Executive Digest: Company-wide (Q1 2026)\n\n## At a Glance\n\nTotal company meeting cost: $12.4M in Q1, up 3.2% from Q4. Quality scores improved to 69.8% (+2.1 pts).\n\n## Department Comparison\n\n| Department | Cost | Hrs/Employee | Quality |\n|------------|------|-------------|--------|\n| Engineering | $2.85M | 18.4 | 67.4% |\n| Product | $1.92M | 16.1 | 72.8% |\n| Sales | $2.41M | 22.3 | 61.2% |\n",
        "created_at": (datetime.now() - timedelta(days=14)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=14)).isoformat(),
    },
    {
        "id": "pulse-7",
        "title": "Team Health Check: Frontend Team",
        "agent_name": "Team Health Check",
        "category": "Wellness",
        "status": "archived",
        "preview": "Frontend team shows healthy meeting patterns. Quality score 72.8% exceeds org median.",
        "markdown": "# Team Health Check: Frontend Team\n\n## Team Snapshot\n\nFrontend team averaging 19.4 meeting hrs/member — close to org median. Quality score of 72.8% exceeds the org median of 67.8%.\n\n### Strengths\n\n- Quality score above org median\n- Strong 1-on-1 coverage (89.2%)\n- Good meeting size distribution\n",
        "created_at": (datetime.now() - timedelta(days=21)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=21)).isoformat(),
    },
    {
        "id": "pulse-8",
        "title": "Recurring Meeting Audit: Last Month",
        "agent_name": "Recurring Meeting Audit",
        "category": "Compliance",
        "status": "archived",
        "preview": "2 meetings flagged for no agenda. Compliance gap in vendor sync documentation.",
        "markdown": "# Recurring Meeting Audit: Last Month\n\n## Summary\n\n2 meetings flagged for compliance: no agenda and no tagged desired outcomes. Vendor sync meetings lack documentation required by policy.\n\n## Action Items\n\n- Add agendas to 2 vendor sync meetings\n- Tag desired outcomes for all recurring meetings\n",
        "created_at": (datetime.now() - timedelta(days=28)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=28)).isoformat(),
    },
    {
        "id": "pulse-9",
        "title": "1:1 Prep Brief: Damien Nguyen",
        "agent_name": "1-on-1 Prep Brief",
        "category": "People & Culture",
        "status": "archived",
        "preview": "Damien's external meeting engagement is 31.2% — above typical for his role level. Speedy adoption at 45%.",
        "markdown": "# 1:1 Prep Brief: Damien Nguyen\n\n## At a Glance\n\nDamien's external meeting engagement at 31.2% is notable for a senior engineer. Speedy meeting adoption at 45% is excellent.\n\n### Strengths\n\n- Excellent speedy meeting adoption (45%)\n- Strong external engagement indicating cross-org influence\n- Zero after-hours meetings\n\n### Patterns\n\n- External engagement may be pulling focus from internal commitments\n- Tuesday/Wednesday clustering creates back-to-back days\n",
        "created_at": (datetime.now() - timedelta(days=35)).isoformat(),
        "updated_at": (datetime.now() - timedelta(days=35)).isoformat(),
    },
    {
        "id": "pulse-10",
        "title": "Team Health Check: DevOps Team",
        "agent_name": "Team Health Check",
        "category": "Wellness",
        "status": "unread",
        "preview": "DevOps team after-hours load is 3x org average. On-call overlap with standups is the primary driver.",
        "markdown": "# Team Health Check: DevOps Team\n\n## Team Snapshot\n\nDevOps team after-hours meetings are 3x org average. Quality score of 58.9% is below org median.\n\n### Concerns\n\n- After-hours load driven by on-call + standup overlap\n- Lowest quality score among Engineering teams\n- 1-on-1 coverage at 62% — critical gap\n\n### Recommendation\n\nMove to async standup format for on-call rotation members.\n",
        "created_at": (datetime.now() - timedelta(hours=8)).isoformat(),
        "updated_at": (datetime.now() - timedelta(hours=8)).isoformat(),
    },
]


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
        "markdown": f"# {session_title}\n\n## At a Glance\n\n{{executive_summary}}\n\n## Metrics\n\n{{pinned_metrics}}\n\n## Deep-Dive Insights\n\n{{pinned_insights}}\n",
        "updated_at": datetime.now().isoformat(),
    }
    return session
