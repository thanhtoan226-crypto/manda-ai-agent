# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (from `frontend/`)
```bash
npm run dev          # Dev server on :3000
npm run build        # Production build (also catches type errors)
npm run lint         # ESLint
npx tsc --noEmit     # Type check only
```

### Backend (from `backend/`)
```bash
uvicorn app.main:app --reload    # Dev server on :8000
pytest                            # Run all tests (currently empty)
ruff check .                      # Lint
ruff format .                     # Format
```

### Docker
```bash
docker compose up    # All services: backend(:8000), frontend(:3000), redis(:6379)
```

Frontend requires a running backend for Pulse reports. The API layer (`frontend/src/lib/api.ts`) throws errors when the backend is unavailable — callers handle errors with UI feedback. The workbench page still tracks `useMock` for its own mock fallback.

## Architecture

Monorepo with **frontend/** (Next.js 15) and **backend/** (FastAPI).

### Frontend → Backend
- Next.js rewrites proxy `/api/*` → `http://localhost:8000/api/*` (in `next.config.ts`)
- Backend API prefix: `/api/v1`
- SSE streaming for chat and content generation
- Workbench page tracks `useMock` flag — set to `true` when API calls fail, activating client-side mock data
- Pulse reports require backend — no frontend mock fallback; errors shown with retry UI

### Backend Structure
```
backend/app/
  main.py                 # FastAPI app, CORS, router mounting, startup seeding
  core/config.py          # pydantic-settings (env-based, includes LLM_ vars)
  core/llm.py             # LLM client singleton (ChatOpenAI from langchain-openai)
  agents/prompts.py       # Agent+mode prompt templates (~15 variants)
  agents/context.py       # Context builder (narrative directives for LLM to invent data)
  api/v1/endpoints/       # Routers: agents, chat, sessions, reports, schedule, pulse
  schemas/                # Pydantic request/response models (agent, session, pulse, content)
  services/               # Business logic (LLM-backed with backend mock fallback)
  services/mock_data.py   # In-memory demo data (AGENTS, AGENT_MODES, DRILL_DOWN_CONTENT) used as fallback
  services/pulse_action_service.py  # LLM-backed drill-down, verify, chat actions (SSE streaming)
  services/report_generator.py  # LLM-backed report generation from templates, saves to disk
  services/template_loader.py   # Loads/caches template MD files from docs/data/
  services/report_loader.py     # Reads/parses/caches report MD files from backend/data/reports/
  services/md_parser.py   # Parses report markdown into ContentModule structures
  services/content_loader.py  # Reads/parses/caches learning MD files from disk
backend/data/learning/    # Learning content: modules.json + 30 topic MD files with YAML frontmatter
```

Services are instantiated per-request. When `OPENROUTER_API_KEY` is set, chat and content generation use real LLM calls via OpenRouter (OpenAI-compatible, default model `moonshotai/kimi-k2.6:free`). Falls back to `LLM_API_KEY` if OpenRouter is not configured. When neither is set, all responses fall back to mock data from `mock_data.py`. All state is in-memory — no database yet.

### Learning Content Architecture
- **Source of truth**: MD files in `backend/data/learning/` (one per topic, with YAML frontmatter for metadata)
- **Module registry**: `backend/data/learning/modules.json` defines module-level metadata and topic ordering
- **Content loader**: `backend/app/services/content_loader.py` reads/parses/caches MD files using `python-frontmatter`
- **LLM-generated content**: When a topic has no pre-written MD file, the LLM generates content and `save_topic_content()` persists it to disk
- **Frontend mock**: Only module metadata kept client-side in `mock-learning-data.ts`; topic content requires backend connection

### Report Data Architecture
- **Templates**: MD files in `docs/data/` (one per agent type) serve as structural + content references for LLM generation
- **Template loader**: `backend/app/services/template_loader.py` reads/caches template MD files from `docs/data/`
- **Generated reports**: MD files in `backend/data/reports/` (one per report, with YAML frontmatter for metadata)
- **Report generation**: `backend/app/services/report_generator.py` loads template, builds LLM prompt with varied-content instructions, generates full markdown report, saves to disk
- **Report loader**: `backend/app/services/report_loader.py` reads/parses/caches MD files using `python-frontmatter`
- **Protected reports**: `PROTECTED_REPORTS` set in `report_loader.py` — files that must never be overwritten (e.g., Chris Peterson's 1on1 report). `is_protected_report()` checks this; `save_report()` refuses to overwrite protected files.
- **Seeded reports**: `seed_report()` copies templates to reports dir on startup. Currently seeds: Chris Peterson (1on1) and Recurring Meeting Audit (Sarah Chen)
- **Frontmatter fields**: `id`, `title`, `agent_name`, `agent_id`, `category`, `status`, `preview`, `created_at`, `updated_at`
- **Module enrichment**: `PulseService._enrich_with_modules()` parses report markdown via `md_parser.py` into `ContentModule[]`; falls back to `AGENT_MODULES` from `mock_data.py` if parsing fails
- **Markdown body**: Full report content (tables, headings, lists, bullet points)
- **In-memory status**: `update_report_status()` mutates the cache (not persisted to disk until DB is added)
- **Frontend mock**: `mock-pulse-data.ts` only contains display helpers (category colors/labels); no mock report or drill-down data
- **Report detail navigation**: Back button is context-aware via `?from=` query param (returns to Browse Agents or Pulse)

### Pulse Action Architecture
- **Generate**: `POST /reports/generate` — generates a full Pulse report via LLM using template as structural reference, saves MD to `backend/data/reports/`. Accepts `agent_id`, `mode`, `subject`. Returns `PulseReportInfo`.
- **Drill-down**: `POST /reports/{id}/drill-down` — SSE stream via `PulseActionService.stream_drill_down()`, LLM-powered with mock fallback
- **Verify**: `POST /reports/{id}/verify` — SSE stream via `PulseActionService.stream_verify()`, LLM-powered with mock fallback
- **Chat**: `POST /reports/{id}/chat/stream` — SSE stream via `ChatService.stream_message_for_agent()`, LLM-powered with mock fallback
- **Session flow**: After workbench streams modules, `ChatService.stream_initial_content()` fire-and-forget calls `generate_and_save_report()` to persist a Pulse report in the background
- **Subject passing**: `selectedSubject` flows from MainCanvas → workbench page → `streamContent()` API → backend `sessions.py` → `chat_service.py` → `build_context()` + `generate_and_save_report()`. The LLM prompt includes the employee/team name so generated reports are personalized.
- **Frontend**: All three actions use SSE streaming with progressive text rendering. No frontend mock fallbacks — errors display with retry UI.

### Frontend Structure
```
frontend/src/
  app/                    # Next.js App Router (all "use client")
    page.tsx              # / = Agent Hub
    workbench/page.tsx    # /workbench = three-panel workbench (main feature)
    pulse/                # /pulse = report feed, /[reportId] = report detail
  components/             # All custom, no UI library
    modules/              # Shared module rendering components (MetricsCardGrid, PulseModuleView, ChatDrawer)
  lib/
    api.ts                # All API calls + SSE helper (no pulse mock fallbacks)
    utils.ts              # cn() (clsx + tailwind-merge)
    mock-*.ts             # Client-side mock data (agents, learning, content; not pulse)
  types/                  # TypeScript interfaces matching backend schemas
```

### Key Data Flow
1. Agent Hub (`/`) → "Your Pulse" shows recent reports; click agent "Run" → `/workbench?agentId=...`
2. Workbench: SessionPanel | MainCanvas | ChatPanel
3. MainCanvas: agent-specific guided conversation → content modules
   - 1-on-1: employee → timeframe → mode → generate
   - Executive: scope → timeframe → mode → generate
   - Recurring: timeframe → mode → generate (auto-scoped)
   - Team Health: department → team → timeframe → mode → generate
4. Content modules: each module has Data Interpreter + agent-specific insight sections
5. Each insight item is an individual block with Drill down / Verify / Ask a question + Unpin toggle
6. Report View: all content minus excluded items
7. Pulse Report Detail (`/pulse/[reportId]`): when report has `modules`, renders structured layout (MetricsCardGrid for data chips, PulseModuleView for insight chips, ChatDrawer for AI chat); falls back to ReactMarkdown when no modules

## Conventions

### Styling
- Tailwind CSS v4 with `@tailwindcss/postcss`
- Custom theme in `globals.css` via `@theme` block: navy (`#0f172a`), accent (`#3b82f6`), teal (`#1ADEB0`) plus light variants
- Brand dark `#0a3542` used directly in classes (sidebar, step indicators) — not a `@theme` variable
- `cn()` from `@/lib/utils` for conditional class merging
- Icons: `lucide-react`
- No component library

### Frontend
- All pages are `"use client"` — no server component data fetching
- Path alias: `@/*` → `./src/*`
- Types use `interface` (not `type`), snake_case for JSON API fields, camelCase for TS properties
- Components/files: PascalCase
- No state management library — React `useState`/`useCallback` only
- Excluded items tracked as `Set<string>` with IDs formatted `{moduleId}::{chipId}::{index}`

### Backend
- Ruff: `line-length = 100`, `target-version = "py311"`
- pytest: `asyncio_mode = "auto"`, `testpaths = ["tests"]`
- Pydantic v2 schemas with snake_case fields
- Relative imports within `app.` package

### API
- RESTful under `/api/v1`
- SSE for streaming endpoints
- Pydantic models for all request/response types

## Feature Specs

All feature specs are in `docs/features/`:
- `agents-feature.md` — Workbench pages, agent cards, content modules, report view, chat panel, schedule
- `pulse-agents/1on1-prep-brief.md` — 1-on-1 Prep Report flow and report structure
- `pulse-agents/executive-digest.md` — Executive Digest flow and report structure
- `pulse-agents/recurring-meeting-audit.md` — Recurring Meeting Audit flow and report structure
- `pulse-agents/team-health-check.md` — Team Health Check flow and report structure
- `modes.md` — Intent modes per agent with tone/framing guidance

Mock data schemas are in `docs/data/`. Pulse reports are in `backend/data/reports/` (MD files with YAML frontmatter). When `OPENROUTER_API_KEY` or `LLM_API_KEY` is configured, mock data serves as fallback, not the primary source.

## Agents

4 MVP agents, each with agent-specific config via `AGENT_CONFIGS` (frontend) and `AGENT_MODES`/`AGENT_SUBJECTS`/`AGENT_MODULES` (backend):

| Agent | ID | First Step | Modes |
|-------|----|-----------|-------|
| 1-on-1 Prep Report | `agent-1on1` | select-employee | Coaching, Performance Review, Workload, Investigation |
| Executive Digest | `agent-executive` | select-scope | Talent Focus, Board-Ready, Capacity, Risk |
| Recurring Meeting Audit | `agent-recurring` | skip-to-timeframe | Cost Optimisation, Quality Review, Attendance |
| Team Health Check | `agent-team-health` | select-department | Coaching, Performance Review, Workload, Investigation |

Browse categories: People Management, Leadership & Strategy, Productivity & Efficiency
Report categories: People & Culture, Meetings, Wellness, Compliance

## Current State

- AI responses use real LLM integration (OpenRouter via langchain-openai). Set `OPENROUTER_API_KEY` in `.env` to enable (model: `moonshotai/kimi-k2.6:free`); falls back to `LLM_API_KEY` if OpenRouter not set; falls back to backend mock data when neither is set.
- Report generation uses templates from `docs/data/` as structural references. The LLM generates varied content (different numbers AND insights). Reports saved as MD files to `backend/data/reports/` via `report_generator.py`. Chris Peterson's report is protected — never regenerated.
- Context builder (`agents/context.py`) uses narrative directives instead of hardcoded data — tells the LLM what to invent rather than providing fixed numbers.
- Pulse reports served from `backend/data/reports/` MD files via `report_loader.py`. Reports enriched with structured module data via `md_parser.py`. Frontend has no mock fallback — requires running backend.
- Both workbench and Pulse report detail pages render metrics using `MetricsCardGrid` (card grid layout, not plain tables). Data chip detection uses both chip ID and content shape (`metrics` key) for robustness.
- Pulse API endpoints: `GET /reports`, `GET /reports/{id}`, `PUT /reports/{id}/status`, `POST /reports/generate`, `POST /reports/{id}/drill-down`, `POST /reports/{id}/verify`, `POST /reports/{id}/chat/stream`
- Session content streaming: `POST /sessions/{id}/content/stream?mode=&subject=` — subject (employee/team name) flows from frontend to LLM prompt for personalized generation
- "Your Pulse" on Browse Agents page shows recent reports (not favorited agents). Back navigation from report detail is context-aware (`?from=` query param).
- No authentication, no database migrations, no real Google Docs export
- Backend `models/`, `tools/`, `utils/` directories are empty
- Test directories exist but have no tests
- LLM env vars: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `LLM_TIMEOUT`, `LLM_MAX_TOKENS`
- Report generator has rate-limit retry (3 attempts, exponential backoff) for free-tier LLM APIs
- Protected reports: `1on1-prep-brief-Chris-Peterson.md` is never regenerated. `PROTECTED_REPORTS` set in `report_loader.py` controls this.
