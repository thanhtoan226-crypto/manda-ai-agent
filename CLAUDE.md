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

Frontend works standalone with mock data — no backend required. The API layer (`frontend/src/lib/api.ts`) gracefully falls back to mock imports when the backend is unavailable.

## Architecture

Monorepo with **frontend/** (Next.js 15) and **backend/** (FastAPI).

### Frontend → Backend
- Next.js rewrites proxy `/api/*` → `http://localhost:8000/api/*` (in `next.config.ts`)
- Backend API prefix: `/api/v1`
- SSE streaming for chat and content generation
- Workbench page tracks `useMock` flag — set to `true` when API calls fail, activating client-side mock data

### Backend Structure
```
backend/app/
  main.py                 # FastAPI app, CORS, router mounting
  core/config.py          # pydantic-settings (env-based, includes LLM_ vars)
  core/llm.py             # LLM client singleton (ChatOpenAI from langchain-openai)
  agents/graph.py         # LangGraph StateGraph (gather_context → generate_module loop)
  agents/prompts.py       # Agent+mode prompt templates (~15 variants)
  agents/context.py       # Context builder (assembles agent/subject/data context)
  api/v1/endpoints/       # Routers: agents, chat, sessions, reports, schedule, pulse
  schemas/                # Pydantic request/response models (agent, session, pulse, content)
  services/               # Business logic (LLM-backed with mock fallback)
  services/mock_data.py   # In-memory demo data (AGENTS, AGENT_MODES, etc.) used as fallback
  services/content_loader.py  # Reads/parses/caches learning MD files from disk
backend/data/learning/    # Learning content: modules.json + 30 topic MD files with YAML frontmatter
```

Services are instantiated per-request. When `LLM_API_KEY` is set, chat and content generation use real LLM calls via Z.AI (OpenAI-compatible). When empty, all responses fall back to mock data from `mock_data.py`. All state is in-memory — no database yet.

### Learning Content Architecture
- **Source of truth**: MD files in `backend/data/learning/` (one per topic, with YAML frontmatter for metadata)
- **Module registry**: `backend/data/learning/modules.json` defines module-level metadata and topic ordering
- **Content loader**: `backend/app/services/content_loader.py` reads/parses/caches MD files using `python-frontmatter`
- **LLM-generated content**: When a topic has no pre-written MD file, the LLM generates content and `save_topic_content()` persists it to disk
- **Frontend mock**: Only module metadata kept client-side in `mock-learning-data.ts`; topic content requires backend connection

### Frontend Structure
```
frontend/src/
  app/                    # Next.js App Router (all "use client")
    page.tsx              # / = Agent Hub
    workbench/page.tsx    # /workbench = three-panel workbench (main feature)
    pulse/                # /pulse = report feed, /[reportId] = report detail
  components/             # All custom, no UI library
  lib/
    api.ts                # All API calls + SSE helper + mock fallbacks
    utils.ts              # cn() (clsx + tailwind-merge)
    mock-*.ts             # Client-side mock data
  types/                  # TypeScript interfaces matching backend schemas
```

### Key Data Flow
1. Agent Hub (`/`) → click "Run" → `/workbench?agentId=...`
2. Workbench: SessionPanel | MainCanvas | ChatPanel
3. MainCanvas: agent-specific guided conversation → content modules
   - 1-on-1: employee → timeframe → mode → generate
   - Executive: scope → timeframe → mode → generate
   - Recurring: timeframe → mode → generate (auto-scoped)
   - Team Health: department → team → timeframe → mode → generate
4. Content modules: each module has Data Interpreter + agent-specific insight sections
5. Each insight item is an individual block with Drill down / Verify / Ask a question + Unpin toggle
6. Report View: all content minus excluded items

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

Mock data schemas and sample reports are in `docs/data/`. When `LLM_API_KEY` is configured, these serve as fallback data, not the primary source.

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

- AI responses use real LLM integration (Z.AI via langchain-openai). Set `LLM_API_KEY` in `.env` to enable; falls back to mock data when empty.
- LangGraph agent graph orchestrates content generation: gather_context → generate_module loop with structured output
- No authentication, no database migrations, no real Google Docs export
- Backend `models/`, `tools/`, `utils/` directories are empty
- Test directories exist but have no tests
- LLM env vars: `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`, `LLM_TIMEOUT`, `LLM_MAX_TOKENS`
