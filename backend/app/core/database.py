import json
import sqlite3
import logging
from pathlib import Path

from app.core.config import settings

logger = logging.getLogger(__name__)

DB_PATH = Path(settings.REPORTS_DATA_DIR).parent / "manda.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn


def _needs_migration(conn: sqlite3.Connection) -> bool:
    try:
        cols = [row[1] for row in conn.execute("PRAGMA table_info(meetings)").fetchall()]
        return "purpose" in cols
    except Exception:
        return False


def _migrate(conn: sqlite3.Connection) -> None:
    logger.info("Migrating meetings table: merging purpose/outcomes/agenda into description")
    rows = conn.execute(
        "SELECT id, description, purpose, desired_outcomes, agenda FROM meetings"
    ).fetchall()
    for row in rows:
        parts: list[str] = []
        if row["description"]:
            parts.append(row["description"])
        if row["purpose"]:
            parts.append(f"\n**Purpose**\n{row['purpose']}")
        if row["desired_outcomes"]:
            parts.append(f"\n**Desired Outcomes**\n{row['desired_outcomes']}")
        if row["agenda"]:
            try:
                items = json.loads(row["agenda"])
                if isinstance(items, list) and items:
                    agenda_text = "\n".join(f"{i + 1}. {item}" for i, item in enumerate(items))
                    parts.append(f"\n**Agenda**\n{agenda_text}")
            except (json.JSONDecodeError, TypeError):
                if row["agenda"]:
                    parts.append(f"\n**Agenda**\n{row['agenda']}")
        merged = "\n".join(parts) if parts else row["description"] or ""
        conn.execute("UPDATE meetings SET description = ? WHERE id = ?", (merged, row["id"]))

    conn.execute("ALTER TABLE meetings DROP COLUMN purpose")
    conn.execute("ALTER TABLE meetings DROP COLUMN desired_outcomes")
    conn.execute("ALTER TABLE meetings DROP COLUMN agenda")
    conn.commit()
    logger.info("Migration complete: dropped purpose, desired_outcomes, agenda columns")


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = get_connection()
    try:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS meetings (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                organiser TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                location TEXT,
                category_color TEXT NOT NULL DEFAULT 'BLUE',
                is_manda_created INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS meeting_attendees (
                id TEXT PRIMARY KEY,
                meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                type TEXT NOT NULL DEFAULT 'required',
                status TEXT NOT NULL DEFAULT 'no_response'
            );

            CREATE TABLE IF NOT EXISTS manda_meeting_settings (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                auto_color TEXT NOT NULL DEFAULT 'BLUE',
                personality TEXT NOT NULL DEFAULT 'formal',
                context_prompt TEXT NOT NULL DEFAULT '',
                enabled_templates TEXT NOT NULL DEFAULT '[]',
                company_branding_enabled INTEGER NOT NULL DEFAULT 0,
                brand_color TEXT,
                brand_header_text TEXT,
                brand_footer_text TEXT,
                safety_checks TEXT NOT NULL DEFAULT '["missing_agenda","missing_purpose_outcome"]',
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS meeting_templates (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                content TEXT NOT NULL,
                is_builtin INTEGER NOT NULL DEFAULT 0,
                user_id TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            """
        )
        conn.commit()

        if _needs_migration(conn):
            _migrate(conn)

        logger.info("Database initialized at %s", DB_PATH)
    finally:
        conn.close()


def seed_meetings() -> None:
    conn = get_connection()
    try:
        count = conn.execute("SELECT COUNT(*) FROM meetings").fetchone()[0]
        if count > 0:
            return

        from datetime import datetime, timezone, timedelta

        now = datetime.now(timezone.utc)

        meetings = [
            {
                "id": "meet-001",
                "title": "Weekly Engineering Sync",
                "description": (
                    "Weekly sync to align on engineering priorities, blockers, and cross-team dependencies.\n\n"
                    "**Purpose**\n"
                    "Align engineering teams on weekly priorities and unblock dependencies\n\n"
                    "**Desired Outcomes**\n"
                    "Clear priorities for the week, resolved blockers, updated roadmap\n\n"
                    "**Agenda**\n"
                    "1. Team updates (5 min each)\n"
                    "2. Blockers and dependencies\n"
                    "3. Roadmap review\n"
                    "4. Action items and owners"
                ),
                "organiser": "Sarah Chen",
                "start_time": (now + timedelta(days=1, hours=10)).isoformat(),
                "end_time": (now + timedelta(days=1, hours=11)).isoformat(),
                "location": "Microsoft Teams",
                "category_color": "BLUE",
                "is_manda_created": 0,
            },
            {
                "id": "meet-002",
                "title": "Q3 Planning Session",
                "description": (
                    "Quarterly planning to set Q3 priorities, allocate resources, "
                    "and align leadership on strategic goals.\n\n"
                    "**Purpose**\n"
                    "Define Q3 priorities and resource allocation\n\n"
                    "**Desired Outcomes**\n"
                    "Approved Q3 roadmap, resource assignments, risk register update\n\n"
                    "**Agenda**\n"
                    "1. Q2 retrospective highlights\n"
                    "2. Q3 OKR proposal\n"
                    "3. Resource allocation discussion\n"
                    "4. Risk assessment\n"
                    "5. Sign-off and next steps"
                ),
                "organiser": "James Mitchell",
                "start_time": (now + timedelta(days=3, hours=14)).isoformat(),
                "end_time": (now + timedelta(days=3, hours=16)).isoformat(),
                "location": "Conference Room A",
                "category_color": "PURPLE",
                "is_manda_created": 1,
            },
            {
                "id": "meet-003",
                "title": "1-on-1 with Alex Rivera",
                "description": (
                    "Regular 1-on-1 to discuss career growth, current projects, and any concerns.\n\n"
                    "**Purpose**\n"
                    "Support Alex's growth and address any concerns\n\n"
                    "**Desired Outcomes**\n"
                    "Action items for career development, project updates, resolved concerns\n\n"
                    "**Agenda**\n"
                    "1. Check-in on wellbeing\n"
                    "2. Project updates\n"
                    "3. Career development discussion\n"
                    "4. Feedback exchange"
                ),
                "organiser": "Sarah Chen",
                "start_time": (now + timedelta(days=2, hours=11)).isoformat(),
                "end_time": (now + timedelta(days=2, hours=11, minutes=30)).isoformat(),
                "location": "Microsoft Teams",
                "category_color": "GREEN",
                "is_manda_created": 0,
            },
            {
                "id": "meet-004",
                "title": "Product Design Review",
                "description": (
                    "Review latest design mockups for the dashboard redesign "
                    "and gather feedback from stakeholders.\n\n"
                    "**Purpose**\n"
                    "Get stakeholder alignment on dashboard redesign direction\n\n"
                    "**Desired Outcomes**\n"
                    "Approved design direction, identified changes, assigned follow-ups\n\n"
                    "**Agenda**\n"
                    "1. Design walkthrough\n"
                    "2. Stakeholder feedback\n"
                    "3. Technical feasibility check\n"
                    "4. Next steps and timeline"
                ),
                "organiser": "Emily Park",
                "start_time": (now + timedelta(days=4, hours=15)).isoformat(),
                "end_time": (now + timedelta(days=4, hours=16)).isoformat(),
                "location": "Zoom",
                "category_color": "AMBER",
                "is_manda_created": 1,
            },
            {
                "id": "meet-005",
                "title": "Sprint Retrospective",
                "description": (
                    "Sprint 14 retrospective to discuss what went well, what didn't, "
                    "and improvements for next sprint.\n\n"
                    "**Purpose**\n"
                    "Identify process improvements for the team\n\n"
                    "**Desired Outcomes**\n"
                    "Top 3 action items for process improvement, team sentiment check\n\n"
                    "**Agenda**\n"
                    "1. What went well\n"
                    "2. What could be improved\n"
                    "3. Action items for next sprint"
                ),
                "organiser": "Marcus Thompson",
                "start_time": (now + timedelta(days=5, hours=10)).isoformat(),
                "end_time": (now + timedelta(days=5, hours=11)).isoformat(),
                "location": "Microsoft Teams",
                "category_color": "BLUE",
                "is_manda_created": 0,
            },
            {
                "id": "meet-006",
                "title": "Client Onboarding Kickoff",
                "description": (
                    "Kickoff meeting for new enterprise client onboarding covering "
                    "timeline, deliverables, and team introductions.\n\n"
                    "**Purpose**\n"
                    "Align on client onboarding timeline and responsibilities\n\n"
                    "**Desired Outcomes**\n"
                    "Confirmed onboarding timeline, assigned account team, risk mitigation plan\n\n"
                    "**Agenda**\n"
                    "1. Team introductions\n"
                    "2. Timeline and milestones\n"
                    "3. Responsibilities and RACI\n"
                    "4. Risk identification\n"
                    "5. Q&A"
                ),
                "organiser": "Sarah Chen",
                "start_time": (now + timedelta(days=6, hours=9)).isoformat(),
                "end_time": (now + timedelta(days=6, hours=10, minutes=30)).isoformat(),
                "location": "Conference Room B",
                "category_color": "RED",
                "is_manda_created": 1,
            },
        ]

        attendees_data = [
            (
                "meet-001",
                [
                    ("att-011", "Sarah Chen", "sarah.chen@acme.com", "required", "accepted"),
                    ("att-012", "Alex Rivera", "alex.rivera@acme.com", "required", "accepted"),
                    ("att-013", "Marcus Thompson", "marcus.t@acme.com", "required", "tentative"),
                    ("att-014", "Emily Park", "emily.park@acme.com", "optional", "no_response"),
                    ("att-015", "David Kim", "david.kim@acme.com", "required", "accepted"),
                    ("att-016", "Lisa Wang", "lisa.wang@acme.com", "optional", "declined"),
                    ("att-017", "Tom Baker", "tom.baker@acme.com", "required", "accepted"),
                    ("att-018", "Nina Patel", "nina.patel@acme.com", "required", "accepted"),
                ],
            ),
            (
                "meet-002",
                [
                    ("att-021", "James Mitchell", "james.m@acme.com", "required", "accepted"),
                    ("att-022", "Sarah Chen", "sarah.chen@acme.com", "required", "accepted"),
                    ("att-023", "Marcus Thompson", "marcus.t@acme.com", "required", "no_response"),
                    ("att-024", "Emily Park", "emily.park@acme.com", "optional", "tentative"),
                    ("att-025", "David Kim", "david.kim@acme.com", "required", "accepted"),
                ],
            ),
            (
                "meet-003",
                [
                    ("att-031", "Sarah Chen", "sarah.chen@acme.com", "required", "accepted"),
                    ("att-032", "Alex Rivera", "alex.rivera@acme.com", "required", "accepted"),
                ],
            ),
            (
                "meet-004",
                [
                    ("att-041", "Emily Park", "emily.park@acme.com", "required", "accepted"),
                    ("att-042", "Sarah Chen", "sarah.chen@acme.com", "required", "tentative"),
                    ("att-043", "Alex Rivera", "alex.rivera@acme.com", "optional", "accepted"),
                    ("att-044", "Marcus Thompson", "marcus.t@acme.com", "required", "accepted"),
                    ("att-045", "James Mitchell", "james.m@acme.com", "optional", "no_response"),
                ],
            ),
            (
                "meet-005",
                [
                    ("att-051", "Marcus Thompson", "marcus.t@acme.com", "required", "accepted"),
                    ("att-052", "Alex Rivera", "alex.rivera@acme.com", "required", "accepted"),
                    ("att-053", "David Kim", "david.kim@acme.com", "required", "accepted"),
                    ("att-054", "Lisa Wang", "lisa.wang@acme.com", "optional", "declined"),
                    ("att-055", "Tom Baker", "tom.baker@acme.com", "required", "accepted"),
                ],
            ),
            (
                "meet-006",
                [
                    ("att-061", "Sarah Chen", "sarah.chen@acme.com", "required", "accepted"),
                    ("att-062", "Emily Park", "emily.park@acme.com", "required", "accepted"),
                    ("att-063", "James Mitchell", "james.m@acme.com", "required", "no_response"),
                    ("att-064", "David Kim", "david.kim@acme.com", "optional", "accepted"),
                ],
            ),
        ]

        for m in meetings:
            conn.execute(
                """
                INSERT INTO meetings (id, title, description, organiser, start_time, end_time,
                    location, category_color, is_manda_created, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    m["id"],
                    m["title"],
                    m["description"],
                    m["organiser"],
                    m["start_time"],
                    m["end_time"],
                    m["location"],
                    m["category_color"],
                    m["is_manda_created"],
                    now.isoformat(),
                    now.isoformat(),
                ),
            )

        for meeting_id, attendees in attendees_data:
            for att_id, name, email, att_type, status in attendees:
                conn.execute(
                    """
                    INSERT INTO meeting_attendees (id, meeting_id, name, email, type, status)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (att_id, meeting_id, name, email, att_type, status),
                )

        conn.commit()
        logger.info("Seeded %d meetings with attendees", len(meetings))
    finally:
        conn.close()


def seed_templates() -> None:
    conn = get_connection()
    try:
        count = conn.execute("SELECT COUNT(*) FROM meeting_templates").fetchone()[0]
        if count > 0:
            return

        from datetime import datetime, timezone

        now = datetime.now(timezone.utc).isoformat()

        templates = [
            (
                "tmpl-1on1",
                "1-on-1 Meeting",
                "Regular 1-on-1 meeting between manager and direct report.",
                True,
            ),
            (
                "tmpl-standup",
                "Team Standup",
                "Daily team standup to share updates and blockers.",
                True,
            ),
            (
                "tmpl-kickoff",
                "Project Kickoff",
                "Kickoff meeting to align on project goals, timeline, and roles.",
                True,
            ),
            (
                "tmpl-quarterly",
                "Quarterly Review",
                "Quarterly business review to assess progress and plan ahead.",
                True,
            ),
            (
                "tmpl-brainstorm",
                "Brainstorming Session",
                "Creative brainstorming session to generate ideas and solutions.",
                True,
            ),
            (
                "tmpl-retro",
                "Retrospective",
                "Sprint retrospective to reflect and improve team processes.",
                True,
            ),
        ]

        for tid, name, content, is_builtin in templates:
            conn.execute(
                """
                INSERT INTO meeting_templates (id, name, content, is_builtin, user_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, NULL, ?, ?)
                """,
                (tid, name, content, int(is_builtin), now, now),
            )

        conn.commit()
        logger.info("Seeded %d meeting templates", len(templates))
    finally:
        conn.close()


def seed_settings() -> None:
    conn = get_connection()
    try:
        count = conn.execute("SELECT COUNT(*) FROM manda_meeting_settings").fetchone()[0]
        if count > 0:
            return

        from datetime import datetime, timezone

        now = datetime.now(timezone.utc).isoformat()

        conn.execute(
            """
            INSERT INTO manda_meeting_settings (
                id, user_id, auto_color, personality, context_prompt,
                enabled_templates, company_branding_enabled, brand_color,
                brand_header_text, brand_footer_text, safety_checks, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                "settings-default",
                "user-default",
                "BLUE",
                "formal",
                "",
                json.dumps(
                    [
                        "tmpl-1on1",
                        "tmpl-standup",
                        "tmpl-kickoff",
                        "tmpl-quarterly",
                        "tmpl-brainstorm",
                        "tmpl-retro",
                    ]
                ),
                0,
                None,
                None,
                None,
                json.dumps(["missing_agenda", "missing_purpose_outcome"]),
                now,
            ),
        )

        conn.commit()
        logger.info("Seeded default meeting settings")
    finally:
        conn.close()
