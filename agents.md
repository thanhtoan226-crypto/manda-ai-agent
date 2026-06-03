# AGENTS.md

## Commands

### Backend (from `backend/`)
```bash
source .venv/bin/activate
uvicorn app.main:app --reload    # Dev server on :8000
pytest                            # Run all tests
ruff check .                      # Lint
ruff format .                     # Format
```

### Frontend (from `frontend/`)
```bash
npm run dev          # Dev server on :3000
npm run build        # Production build (also catches type errors)
npm run lint         # ESLint
npx tsc --noEmit     # Type check only
```

### Docker
```bash
docker compose up    # All services: backend(:8001), frontend(:3000), redis
```

## Architecture

Monorepo with **frontend/** (Next.js 15) and **backend/** (FastAPI).

- Frontend proxies `/api/*` → `http://localhost:8000/api/*`
- Backend API prefix: `/api/v1`
- SSE streaming for chat and content generation
- 4 MVP agents: 1-on-1 Prep, Executive Digest, Recurring Meeting Audit, Team Health Check

## Conventions

### Backend
- Ruff: `line-length = 100`, `target-version = "py311"`
- Pydantic v2 schemas with snake_case fields
- Relative imports within `app.` package
- Use `datetime.now(timezone.utc)` for all timestamps (never naive `datetime.now()`)
- Production deps in `requirements.txt`, dev deps in `requirements-dev.txt`

### Frontend
- All pages are `"use client"` — no server component data fetching
- Path alias: `@/*` → `./src/*`
- Types use `interface` (not `type`), snake_case for JSON API fields, camelCase for TS properties
- Shared utilities in `lib/utils.ts` (`cn`, `badgeClass`, `formatRelativeDate`)
- Shared agent config in `lib/agent-config.ts` (`AGENT_CONFIGS`)
- Shared constants in `lib/constants.ts` (`CATEGORY_COLORS`, etc.)
- No state management library — React `useState`/`useCallback` only
- Icons: `lucide-react`

### API
- RESTful under `/api/v1`
- SSE for streaming endpoints
- Pydantic models for all request/response types
