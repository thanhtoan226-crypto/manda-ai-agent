import json
import uuid
import logging
from datetime import datetime, timezone

from app.core.database import get_connection
from app.schemas.meeting import (
    Meeting,
    MeetingCreateRequest,
    MeetingListResponse,
    MeetingTemplate,
    MandaMeetingSettings,
    MandaMeetingSettingsUpdate,
    Attendee,
)

logger = logging.getLogger(__name__)


class MeetingService:
    async def list_meetings(
        self,
        time_frame: str = "all-time",
        role: str = "all",
        search: str | None = None,
    ) -> MeetingListResponse:
        conn = get_connection()
        try:
            query = "SELECT * FROM meetings WHERE 1=1"
            params: list[str] = []

            if time_frame != "all-time":
                now = datetime.now(timezone.utc)
                if time_frame == "today":
                    start = now.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
                    query += " AND start_time >= ?"
                    params.append(start)
                elif time_frame == "this-week":
                    start = now.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
                    query += " AND start_time >= ?"
                    params.append(start)
                elif time_frame == "this-month":
                    start = now.replace(
                        day=1, hour=0, minute=0, second=0, microsecond=0
                    ).isoformat()
                    query += " AND start_time >= ?"
                    params.append(start)

            if search:
                query += " AND title LIKE ?"
                params.append(f"%{search}%")

            query += " ORDER BY start_time ASC"

            rows = conn.execute(query, params).fetchall()
            meetings = []
            for row in rows:
                meeting = self._row_to_meeting(row, conn)
                meetings.append(meeting)

            if role != "all":
                if role == "organiser":
                    meetings = [m for m in meetings if m.organiser == "Sarah Chen"]
                elif role == "attendee":
                    meetings = [m for m in meetings if m.organiser != "Sarah Chen"]

            return MeetingListResponse(meetings=meetings, total=len(meetings))
        finally:
            conn.close()

    async def get_meeting(self, meeting_id: str) -> Meeting | None:
        conn = get_connection()
        try:
            row = conn.execute("SELECT * FROM meetings WHERE id = ?", (meeting_id,)).fetchone()
            if not row:
                return None
            return self._row_to_meeting(row, conn)
        finally:
            conn.close()

    async def create_meeting(self, request: MeetingCreateRequest) -> Meeting:
        conn = get_connection()
        try:
            now = datetime.now(timezone.utc)
            meeting_id = f"meet-{uuid.uuid4().hex[:8]}"

            conn.execute(
                """
                INSERT INTO meetings (id, title, description, organiser, start_time, end_time,
                    location, category_color, is_manda_created, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    meeting_id,
                    request.title,
                    request.description,
                    request.organiser,
                    request.start_time.isoformat(),
                    request.end_time.isoformat(),
                    request.location,
                    request.category_color,
                    int(request.is_manda_created),
                    now.isoformat(),
                    now.isoformat(),
                ),
            )

            for att in request.attendees:
                att_id = f"att-{uuid.uuid4().hex[:8]}"
                conn.execute(
                    """
                    INSERT INTO meeting_attendees (id, meeting_id, name, email, type, status)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    (att_id, meeting_id, att.name, att.email, att.type, att.status),
                )

            conn.commit()

            return Meeting(
                id=meeting_id,
                title=request.title,
                description=request.description,
                organiser=request.organiser,
                attendees=request.attendees,
                start_time=request.start_time,
                end_time=request.end_time,
                location=request.location,
                category_color=request.category_color,
                is_manda_created=request.is_manda_created,
                created_at=now,
                updated_at=now,
            )
        finally:
            conn.close()

    async def delete_meeting(self, meeting_id: str) -> bool:
        conn = get_connection()
        try:
            cursor = conn.execute("DELETE FROM meetings WHERE id = ?", (meeting_id,))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

    async def get_settings(self, user_id: str = "user-default") -> MandaMeetingSettings:
        conn = get_connection()
        try:
            row = conn.execute(
                "SELECT * FROM manda_meeting_settings WHERE user_id = ?", (user_id,)
            ).fetchone()
            if not row:
                now = datetime.now(timezone.utc).isoformat()
                settings_id = f"settings-{uuid.uuid4().hex[:8]}"
                conn.execute(
                    """
                    INSERT INTO manda_meeting_settings (
                        id, user_id, auto_color, personality, context_prompt,
                        enabled_templates, company_branding_enabled, brand_color,
                        brand_header_text, brand_footer_text, safety_checks, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        settings_id,
                        user_id,
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
                return MandaMeetingSettings(id=settings_id, user_id=user_id)

            return MandaMeetingSettings(
                id=row["id"],
                auto_color=row["auto_color"],
                personality=row["personality"],
                context_prompt=row["context_prompt"],
                enabled_templates=json.loads(row["enabled_templates"]),
                company_branding_enabled=bool(row["company_branding_enabled"]),
                brand_color=row["brand_color"],
                brand_header_text=row["brand_header_text"],
                brand_footer_text=row["brand_footer_text"],
                safety_checks=json.loads(row["safety_checks"]),
            )
        finally:
            conn.close()

    async def update_settings(
        self, user_id: str, update: MandaMeetingSettingsUpdate
    ) -> MandaMeetingSettings:
        current = await self.get_settings(user_id)

        updated = MandaMeetingSettings(
            id=current.id,
            auto_color=update.auto_color if update.auto_color is not None else current.auto_color,
            personality=(
                update.personality if update.personality is not None else current.personality
            ),
            context_prompt=(
                update.context_prompt
                if update.context_prompt is not None
                else current.context_prompt
            ),
            enabled_templates=(
                update.enabled_templates
                if update.enabled_templates is not None
                else current.enabled_templates
            ),
            company_branding_enabled=(
                update.company_branding_enabled
                if update.company_branding_enabled is not None
                else current.company_branding_enabled
            ),
            brand_color=update.brand_color
            if update.brand_color is not None
            else current.brand_color,
            brand_header_text=(
                update.brand_header_text
                if update.brand_header_text is not None
                else current.brand_header_text
            ),
            brand_footer_text=(
                update.brand_footer_text
                if update.brand_footer_text is not None
                else current.brand_footer_text
            ),
            safety_checks=(
                update.safety_checks if update.safety_checks is not None else current.safety_checks
            ),
        )

        conn = get_connection()
        try:
            now = datetime.now(timezone.utc).isoformat()
            conn.execute(
                """
                UPDATE manda_meeting_settings
                SET auto_color=?, personality=?, context_prompt=?,
                    enabled_templates=?, company_branding_enabled=?, brand_color=?,
                    brand_header_text=?, brand_footer_text=?, safety_checks=?, updated_at=?
                WHERE user_id=?
                """,
                (
                    updated.auto_color,
                    updated.personality,
                    updated.context_prompt,
                    json.dumps(updated.enabled_templates),
                    int(updated.company_branding_enabled),
                    updated.brand_color,
                    updated.brand_header_text,
                    updated.brand_footer_text,
                    json.dumps(updated.safety_checks),
                    now,
                    user_id,
                ),
            )
            conn.commit()
            return updated
        finally:
            conn.close()

    async def list_templates(self) -> list[MeetingTemplate]:
        conn = get_connection()
        try:
            rows = conn.execute(
                "SELECT * FROM meeting_templates ORDER BY is_builtin DESC, name ASC"
            ).fetchall()
            return [
                MeetingTemplate(
                    id=row["id"],
                    name=row["name"],
                    content=row["content"],
                    is_builtin=bool(row["is_builtin"]),
                    user_id=row["user_id"],
                    created_at=row["created_at"],
                    updated_at=row["updated_at"],
                )
                for row in rows
            ]
        finally:
            conn.close()

    async def create_template(
        self, name: str, content: str, user_id: str | None = None
    ) -> MeetingTemplate:
        conn = get_connection()
        try:
            now = datetime.now(timezone.utc)
            tid = f"tmpl-{uuid.uuid4().hex[:8]}"
            conn.execute(
                """
                INSERT INTO meeting_templates (id, name, content, is_builtin, user_id, created_at, updated_at)
                VALUES (?, ?, ?, 0, ?, ?, ?)
                """,
                (tid, name, content, user_id, now.isoformat(), now.isoformat()),
            )
            conn.commit()
            return MeetingTemplate(
                id=tid,
                name=name,
                content=content,
                is_builtin=False,
                user_id=user_id,
                created_at=now,
                updated_at=now,
            )
        finally:
            conn.close()

    async def delete_template(self, template_id: str) -> bool:
        conn = get_connection()
        try:
            cursor = conn.execute(
                "DELETE FROM meeting_templates WHERE id = ? AND is_builtin = 0",
                (template_id,),
            )
            conn.commit()
            return cursor.rowcount > 0
        finally:
            conn.close()

    def _row_to_meeting(self, row, conn) -> Meeting:
        attendee_rows = conn.execute(
            "SELECT * FROM meeting_attendees WHERE meeting_id = ?", (row["id"],)
        ).fetchall()
        attendees = [
            Attendee(
                id=att["id"],
                name=att["name"],
                email=att["email"],
                type=att["type"],
                status=att["status"],
            )
            for att in attendee_rows
        ]

        return Meeting(
            id=row["id"],
            title=row["title"],
            description=row["description"],
            organiser=row["organiser"],
            attendees=attendees,
            start_time=datetime.fromisoformat(row["start_time"]),
            end_time=datetime.fromisoformat(row["end_time"]),
            location=row["location"],
            category_color=row["category_color"],
            is_manda_created=bool(row["is_manda_created"]),
            created_at=datetime.fromisoformat(row["created_at"]),
            updated_at=datetime.fromisoformat(row["updated_at"]),
        )
