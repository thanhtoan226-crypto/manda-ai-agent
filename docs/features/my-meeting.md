# Feature: My Meetings

## Overview

A **My Meetings** page where users browse all their meetings (as attendee or organiser) displayed as a card grid. Users can click a card to view meeting details, or create a new meeting via the **New Meeting** form. The form simulates the Outlook/Microsoft Teams meeting creation experience, with a **Manda AI Plugin** panel on the right that assists with generating and refining meeting descriptions using GLM-5.1.

---

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/meetings` | My Meetings | Card grid of all user meetings |
| `/meetings/new` | New Meeting | Meeting creation form with Manda AI Plugin |
| `/meetings/[id]` | Meeting Detail | Read-only view of a single meeting |

---

## Page 1: My Meetings

### Layout

Full-width card grid with a sticky header bar.

### Header Bar

- Page title: "My Meetings"
- **New Meeting** button (top-right) → navigates to `/meetings/new`

### Filters

- **Time Frame** dropdown: Today, This Week, This Month, All Time
- **Role** dropdown: All, Organiser, Attendee
- **Search** text input: filters by meeting title

### Meeting Card Grid

Responsive grid layout:

- Mobile (xs): 1 column
- Tablet (sm): 2 columns
- Desktop (md+): 3 columns

#### Meeting Card

```
┌──────────────────────────────────────┐
│ ●  Category Color  │  Manda Badge    │
│                                      │
│  Weekly Engineering Sync             │
│  Thu, Jun 4 2026 · 10:00 – 11:00 AM │
│                                      │
│  👤 Sarah Chen    📍 Teams          │
│  👥 8 attendees                      │
│                                      │
│  Brief preview of agenda or descri…  │
└──────────────────────────────────────┘
```

Each card shows:

- **Color indicator** — left border or dot, colored by meeting category (or Manda-assigned color if created via Manda)
- **Manda AI badge** — small pill badge "Manda" shown only if the meeting was created via Manda AI
- **Meeting title** — truncated to 2 lines
- **Date & time** — formatted date, start–end time, duration
- **Organiser** — name with person icon
- **Location** — Teams/Zoom link or physical room with location icon
- **Attendee count** — number with group icon
- **Description preview** — first ~100 characters of description, truncated
- **Click** → navigates to `/meetings/[id]`

### Empty State

"You have no meetings yet. Create your first meeting with Manda AI."

---

## Page 2: New Meeting

### Layout

One-panel layout for Meeting Form initially. There is a button on top named Manda AI, clicking to display Manda AI Plugin on the right.

Two-panel layout simulating the Outlook/Teams meeting creation experience:

```
┌──────────────────────────────┬─────────────────────────┐
│                              │  Manda AI Plugin        │
│  Meeting Form                │  ┌──────┬──────────┐   │
│  (Left Panel)                │  │ Main │ Settings │   │
│                              │  └──────┴──────────┘   │
│                              │                         │
│                              │  Plugin Content         │
│                              │                         │
└──────────────────────────────┴─────────────────────────┘
```

- **Left panel** (~65% width): Standard meeting form
- **Right panel** (~35% width): Manda AI Plugin

### Left Panel: Meeting Form

Mimics Outlook/Teams meeting creation fields:

| Field | Type | Description |
|-------|------|-------------|
| Add Title | Text input | Add title |
| Attendees | Multi-select with search | Add required and optional attendees |
| Date & Time | Date picker + time pickers | Start date, start time, end time |
| Duration | Auto-calculated | Derived from start/end time |
| Location | Text input | Add a room or location |
| Teams Meeting | Toggle |  |
| Description | Rich text area | Meeting description containing Purpose, Desired Outcomes, and Agenda as structured sections |

The **Description** field is the single rich text area where all meeting content lives. Purpose, Desired Outcomes, and Agenda are structured sections **within** the description, not separate fields. The Manda AI Plugin generates these sections directly into the description.

Attendees: Create data for employee with email ending with @advizia.com.au (E.g toannguyen@advizia.com.au, tiennguyen@advizia.com.au, minhhoang@advizia.com.au, tuyennguyen@advizia.com.au)

Teams Meeting Toggle: turn on to add a meeting link in the description. Sample:
  Microsoft Teams meeting
  Join: https://teams.microsoft.com/meet/41499543630243?p=iVNZXvSTLErEBVOXil
  Meeting ID: 414 995 436 302 43
  Passcode: 43Hc6U3T

### Right Panel: Manda AI Plugin

A sidebar panel with two tabs: **Main** and **Settings**.

---

### Plugin Tab: Main

The primary AI assistance interface. Two workflows available simultaneously:

#### Workflow A: Generate from Prompt

User describes their meeting idea in natural language, and Manda AI generates a structured description into the left panel.

1. **Toggle switches** for which sections to include in the description:
   - ☐ Purpose (default: on)
   - ☐ Desired Outcomes (default: on)
   - ☐ Agenda (default: on)
2. **General Meeting** - Dropdown to select description tones:
    | Item | Description|
    |-------|------|
    | General Meeting | Purposed, desired outcomes, and question-based agenda |
    | Casual Invite | Friendly, conversational meeting invitation |
    | 1:1 Check-in | Employee-driven: priorities, blockers, growth |
    | Decision Meeting | Context, options, criteria, and decision |

3. **Prompt textarea** — User types their meeting idea (e.g., "Quarterly planning session for the product team, we need to align on Q3 priorities and resource allocation")
4. **Generate** button → Manda AI generates a structured description with the selected sections and populates the description field in the left panel. It should follow template/style mentioned in General Meeting.
5. Generated content streams into the description field via SSE
6. Having additional options: Reapply template, Improve Writing, Shorten, More formal, More casual, Regenerate title.

#### Workflow B: Rewrite / Structure Existing Content

User writes or pastes a meeting description directly into the left panel, then uses Manda AI to improve it.

1. User enters content in the **Description** field on the left panel
2. **Prompt input** — User types what they want (e.g., "Make it more formal", "Add structure", "Make it concise")
3. **Enter button** (icon: ↵ or send icon) — Submits the prompt to rewrite/structure the description
4. Manda AI rewrites the description and updates the left panel field via SSE

#### Visual Layout of Main Tab

```
┌─────────────────────────────────┐
│  Generate Meeting               │
│                                 │
│  ☑ Purpose                      │
│  ☑ Outcomes                     │
│  ☑ Agenda                       │
│                                 │
│  ┌─────────────────────────────┐│
│  │ Describe your meeting idea… ││
│  │                             ││
│  └─────────────────────────────┘│
│  [ Generate ]                   │
│                                 │
│  ─── or rewrite existing ───    │
│                                 │
│  ┌───────────────────┐ ┌────┐   │
│  │ Your prompt…      │ │ ↵  │   │
│  └───────────────────┘ └────┘   │
└─────────────────────────────────┘
```

---

### Plugin Tab: Settings

Configuration for Manda AI behavior when creating meetings.

#### Meeting Color

- **Label**: "Auto-assign color to Manda meetings"
- **Control**: Color picker with preset swatches (BLUE, GREEN, PURPLE, RED, ORANGE, YELLOW) + custom color input
- **Default**: None
- **Behavior**: Any meeting created via Manda AI automatically gets this color applied

#### Personality

- **Label**: "Set your personality"
- **Control**: Radio button group or segmented control
- **Options**:
  - Formal — Professional, structured, corporate tone
  - Casual — Friendly, conversational, relaxed tone
  - Corporate — Executive-style, concise, business-focused
  - Friendly — Warm, approachable, encouraging tone
  - Direct — No-nonsense, concise, action-oriented
- **Default**: Formal
- **Behavior**: Influences the tone and style of all AI-generated meeting content

#### Context Prompt

- **Label**: "Add context prompt"
- **Control**: Textarea (multi-line, max 500 characters)
- **Placeholder**: "e.g., I'm just the EA so I don't actually attend meetings, keep that in mind when producing the invites"
- **Default**: Empty
- **Behavior**: Appended to the system prompt for all Manda AI generation calls, giving the model persistent context about the user's role or preferences

#### Templates

- **Label**: "Select templates to show"
- **Control**: Checklist of available templates + "Create Custom" option
- **Available Templates**:
  - 1-on-1 Meeting
  - Team Standup
  - Project Kickoff
  - Quarterly Review
  - Brainstorming Session
  - Retrospective
- **Create Custom**: Opens a sub-form with fields:
  - Template name
  - Template content (rich text)
  - Save / Cancel
- **Default**: All templates checked
- **Behavior**: Selected templates appear as quick-start options in the Main tab (user can click a template to pre-fill the meeting form)

#### Company Branding

- **Label**: "Apply company branding/theme to meeting invites"
- **Control**: Toggle switch (on/off)
- **When enabled**: Shows sub-options:
  - Company logo upload (placeholder for MVP)
  - Primary brand color (color picker)
  - Header/Footer text (text input)
- **Default**: Off
- **Behavior**: Applies branding elements to the meeting description and any exported invite

#### Safety Checks

- **Label**: "Prevent me sending if missing"
- **Control**: Multi-select checklist
- **Options**:
  - ☐ Critical items that need resolving
  - ☐ Missing agenda
  - ☐ Missing purpose/outcome
  - ☐ No attendees added
  - ☐ Missing location/Teams link
  - ☐ Meeting exceeds 60 minutes with no breaks
- **Default**: "Missing agenda" and "Missing purpose/outcome" checked
- **Behavior**: When the user attempts to save/send the meeting, Manda validates the form against selected checks. If any checked item is missing, a blocking dialog appears listing the issues. User must acknowledge or fix before proceeding.

---

## Page 3: Meeting Detail

Read-only view of a single meeting. Accessed by clicking a meeting card on the My Meetings page.

### Layout

Centered content area (max-width 4xl) with back navigation.

### Header

- Back button → returns to `/meetings`
- Meeting title (large)
- Date, time, duration
- Location
- Organiser name + avatar
- Manda AI badge (if created via Manda)
- Category color indicator

### Content Sections

- **Attendees** — List of required and optional attendees with status (accepted, tentative, declined, no response)
- **Description** — Full meeting description rendered from markdown. This may contain structured sections such as Purpose, Desired Outcomes, and Agenda as headings within the description.
- **Meeting Notes** — Placeholder for MVP (coming soon)

### Actions

- **Edit** button → navigates to edit mode (out of scope for MVP)
- **Delete** button → confirmation dialog, then removes meeting

---

## LLM Integration

### Model

**GLM-5.1** — used for all Manda AI generation and rewrite operations.

### Endpoints

Both endpoints use **SSE streaming** for real-time content delivery, consistent with the existing `/sessions/{id}/chat/stream` pattern.

#### Generate Description

```
POST /api/v1/meetings/generate-description
```

**Request:**
```json
{
  "prompt": "Quarterly planning session for the product team...",
  "generate_purpose": true,
  "generate_outcomes": true,
  "generate_agenda": true,
  "personality": "formal",
  "context_prompt": "I'm just the EA so I don't actually attend meetings",
  "template": "project-kickoff"
}
```

**Response (SSE):**
```json
{
  "field": "description",
  "content": "Join us for our quarterly planning session..."
}
```

All generated content streams into a single `description` field. Purpose, Desired Outcomes, and Agenda are included as structured sections within the description text based on the toggle flags.

#### Rewrite Description

```
POST /api/v1/meetings/rewrite-description
```

**Request:**
```json
{
  "current_description": "we need to talk about q3 stuff...",
  "prompt": "Make it more formal and structured",
  "personality": "formal",
  "context_prompt": "I'm just the EA..."
}
```

**Response (SSE):**
```json
{
  "field": "description",
  "content": "You are invited to our Q3 Planning Session..."
}
```

---

## Data Storage

SQLite3 database, accessed via Python's built-in `sqlite3` module. Database file: `backend/data/manda.db`.

### Tables

```sql
CREATE TABLE meetings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    organiser TEXT NOT NULL,
    start_time TEXT NOT NULL,             -- ISO 8601 UTC
    end_time TEXT NOT NULL,               -- ISO 8601 UTC
    location TEXT,
    category_color TEXT NOT NULL DEFAULT 'BLUE',
    is_manda_created INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,             -- ISO 8601 UTC
    updated_at TEXT NOT NULL              -- ISO 8601 UTC
);

CREATE TABLE meeting_attendees (
    id TEXT PRIMARY KEY,
    meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'required',  -- 'required' | 'optional'
    status TEXT NOT NULL DEFAULT 'no_response',  -- 'accepted' | 'tentative' | 'declined' | 'no_response'
);

CREATE TABLE manda_meeting_settings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    auto_color TEXT NOT NULL DEFAULT 'BLUE',
    personality TEXT NOT NULL DEFAULT 'formal',
    context_prompt TEXT NOT NULL DEFAULT '',
    enabled_templates TEXT NOT NULL DEFAULT '[]',   -- JSON array of template IDs
    company_branding_enabled INTEGER NOT NULL DEFAULT 0,
    brand_color TEXT,
    brand_header_text TEXT,
    brand_footer_text TEXT,
    safety_checks TEXT NOT NULL DEFAULT '["missing_agenda","missing_purpose_outcome"]',  -- JSON array
    updated_at TEXT NOT NULL
);

CREATE TABLE meeting_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_builtin INTEGER NOT NULL DEFAULT 0,
    user_id TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/meetings/` | List user meetings (with filters: time_frame, role, search) |
| GET | `/api/v1/meetings/{id}` | Get meeting detail (includes attendees) |
| POST | `/api/v1/meetings/` | Create new meeting |
| DELETE | `/api/v1/meetings/{id}` | Delete a meeting |
| POST | `/api/v1/meetings/generate-description` | AI-generate meeting description (SSE) |
| POST | `/api/v1/meetings/rewrite-description` | AI-rewrite existing description (SSE) |
| GET | `/api/v1/meetings/settings` | Get Manda plugin settings for current user |
| PUT | `/api/v1/meetings/settings` | Update Manda plugin settings |
| GET | `/api/v1/meetings/templates` | List available meeting templates |
| POST | `/api/v1/meetings/templates` | Create custom template |
| DELETE | `/api/v1/meetings/templates/{id}` | Delete a custom template |

---

## Data Models

### Meeting

```python
class Meeting(BaseModel):
    id: str
    title: str
    description: str | None = None
    organiser: str
    attendees: list[Attendee]
    start_time: datetime
    end_time: datetime
    location: str | None = None
    category_color: str = "BLUE"
    is_manda_created: bool = False
    created_at: datetime
    updated_at: datetime
```

### Attendee

```python
class Attendee(BaseModel):
    name: str
    email: str
    type: Literal["required", "optional"]
    status: Literal["accepted", "tentative", "declined", "no_response"] = "no_response"
```

### MandaMeetingSettings

```python
class MandaMeetingSettings(BaseModel):
    auto_color: str = "BLUE"
    personality: Literal["formal", "casual", "corporate", "friendly", "direct"] = "formal"
    context_prompt: str = ""
    enabled_templates: list[str] = ["1-on-1", "team-standup", "project-kickoff", "quarterly-review", "brainstorming", "retrospective"]
    company_branding_enabled: bool = False
    brand_color: str | None = None
    brand_header_text: str | None = None
    brand_footer_text: str | None = None
    safety_checks: list[str] = ["missing_agenda", "missing_purpose_outcome"]
```

---

## Sidebar Navigation Update

The existing "My Meetings" sidebar item (currently pointing to `/coming-soon?title=My Meetings`) should be updated:

| Item | Route | Change |
|------|-------|--------|
| My Meetings | `/meetings` | Replace coming-soon placeholder |

---

## Out of Scope (MVP)

- Real calendar integration (Outlook/Teams API sync)
- Real attendee email delivery
- Meeting edit flow
- Meeting notes / collaborative editing
- Recurring meeting series creation
- File attachments
