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
  core/config.py          # pydantic-settings (env-based)
  agents/graph.py         # LangGraph StateGraph (TODO: no nodes yet)
  api/v1/endpoints/       # Routers: agents, chat, sessions, reports, schedule
  schemas/                # Pydantic request/response models
  services/               # Business logic (all return mock data)
  services/mock_data.py   # All in-memory demo data (AGENTS, SESSIONS, CONTENT_MODULES, etc.)
```

Services are instantiated per-request. All data is in-memory via `mock_data.py` dicts — no database yet.

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
3. MainCanvas: guided conversation (employee → timeframe → mode → generate) → content modules
4. Content modules: each module has Data Interpreter + insight sections (Strengths, Patterns, Meetings, Discussion Starters)
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

## Feature Spec

The full UI/UX specification is in `docs/feature-AI-agents.md` — covers all pages, interactions, mock data schemas, and API endpoints.

## Current State

- **All AI responses are mocked** — no real LLM integration
- LangGraph agent graph has no nodes/edges yet
- No authentication, no database migrations, no real Google Docs export
- Backend `models/`, `tools/`, `utils/` directories are empty
- Test directories exist but have no tests
