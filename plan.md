# Manda AI Agent — Code Review & Improvement Plan

## Priority 1: Bugs (Must Fix)

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 1 | **`useMemo` mutates array in-place** — `reports.sort()` mutates the original state | `pulse/page.tsx:56` | Use `[...reports].sort(...)` |
| 2 | **Duplicate pin IDs** — `pin-{len+1}` reuses IDs after unpins | `session_service.py:54` | Use `uuid4().hex[:8]` for pin IDs |
| 3 | **Operator precedence bug in session title** — `title or f"..." if agent else "..."` parses wrong | `mock_data.py:825` | Add explicit parentheses |
| 4 | **`chat_service._llm_stream` word spacing breaks on duplicate words** — `text.index(word)` returns first occurrence | `chat_service.py:281` | Use `enumerate(words)` |
| 5 | **`ScheduleModal` state not reset on reopen** — stale data persists | `ScheduleModal.tsx:25` | Reset state when `open` changes |
| 6 | **Empty `sessionId` passed to `ScheduleModal`** | `page.tsx:192` | Pass actual session ID or disable modal |
| 7 | **Fire-and-forget `asyncio.create_task` can be GC'd** | `chat_service.py:231-239` | Store task reference; add error handling |
| 8 | **Report status update not persisted to disk** | `report_loader.py:80-85` | Write frontmatter back to disk |
| 9 | **`handleApplyToReport` only updates local state** — changes lost on reload | `pulse/[reportId]/page.tsx:139-143` | Call backend API to persist |
| 10 | **Docker `BACKEND_URL` wrong at build time** — API calls fail in containers | `docker-compose.yml`, `frontend/Dockerfile` | Add build arg for `BACKEND_URL` |

## Priority 2: Security & Docker

| # | Issue | Location | Fix |
|---|-------|----------|-----|
| 11 | **No `.dockerignore`** — secrets, `.venv`, `.git` baked into images | Both Dockerfiles | Create `.dockerignore` files |
| 12 | **Redis exposed on host without auth** | `docker-compose.yml:25-26` | Remove `ports`; add `--requirepass` |
| 13 | **Both Dockerfiles run as root** | `backend/Dockerfile`, `frontend/Dockerfile` | Add non-root `USER` directives |
| 14 | **No health checks** | `docker-compose.yml` | Add health checks to all services |
| 15 | **CORS too permissive** — `allow_methods=["*"]`, `allow_headers=["*"]` + credentials | `main.py:16-17` | Restrict to specific origins/methods |
| 16 | **No rate limiting on LLM endpoints** | All endpoints | Add rate limiting middleware |
| 17 | **No `max_length` on chat message** | `chat.py`, `schemas/chat.py` | Add `max_length` constraint |

## Priority 3: Code Quality & DRY

| # | Issue | Fix |
|---|-------|-----|
| 18 | **3 duplicate Chat UI components** (`ChatPanel.tsx`, `MainCanvas.tsx` ChatDrawer, `modules/ChatDrawer.tsx`) | Extract to single shared `ChatDrawer` component |
| 19 | **`badgeClass` function duplicated 3x** (`MainCanvas.tsx` 2x, `PulseModuleView.tsx`) | Extract to `lib/utils.ts` |
| 20 | **`AGENT_CONFIGS` duplicated 2x** (`MainCanvas.tsx`, `PulseModuleView.tsx`) | Extract to `lib/agent-config.ts` |
| 21 | **`get_llm()` and `get_llm_streaming()` are near-identical** (`llm.py`) | Refactor to single factory with `streaming` param |
| 22 | **`stream_message` and `stream_message_for_agent` duplicate streaming logic** (`chat_service.py`) | Extract shared streaming implementation |
| 23 | **Mock data personalization `.replace()` chains duplicated 2x** (`chat_service.py`) | Extract to shared helper |
| 24 | **Production code imports from mock files** (`CATEGORY_COLORS` from `mock-pulse-data.ts`) | Move constants to `lib/constants.ts` |

## Priority 4: Type Safety

| # | Issue | Fix |
|---|-------|-----|
| 25 | **`ContentModule.content` is `Record<string, unknown>`** — forces unsafe casts everywhere | Define discriminated union types |
| 26 | **`ChatMessage.id` is optional but used as React key** | Make `id` required |
| 27 | **Duplicate `ChatMessage` type** (`types/chat.ts` vs `types/session.ts`) | Consolidate to one definition |
| 28 | **Multiple unsafe `as` type assertions** across frontend | Replace with proper type guards |
| 29 | **Untyped dicts in schemas** (`session.py` `content: dict`, `messages: list[dict]`) | Add proper types |

## Priority 5: Performance

| # | Issue | Fix |
|---|-------|-----|
| 30 | **SSE streaming recreates full message array per chunk** (O(n) per chunk) | Use `useRef` + batched updates |
| 31 | **String concatenation in loop** (`full_response += chunk` in `chat_service.py`) | Use list + `''.join()` |
| 32 | **Missing `useMemo` for derived agent lists** (`page.tsx:83-86`) | Add `useMemo` |
| 33 | **Uncleaned `setTimeout` calls** (5+ locations) — memory leak on unmount | Return cleanup from `useEffect` |

## Priority 6: Missing Error Handling & Validation

| # | Issue | Fix |
|---|-------|-----|
| 34 | **No validation of `mode` path param** (`sessions.py:51`) | Validate against allowed modes |
| 35 | **`frequency`, `time`, `recipients` unvalidated** (`schedule.py`) | Add `Literal` types and format validation |
| 36 | **Silently swallowed errors** (`updatePulseReportStatus.catch(() => {})`, bare `except: pass`) | Add user-facing error feedback |
| 37 | **No API error body in `apiFetch`** (`api.ts:25`) | Include response body in error message |
| 38 | **`context.py` uses `random.choice()` — non-deterministic context** | Seed based on inputs or use deterministic approach |

## Priority 7: Configuration & Cleanup

| # | Issue | Fix |
|---|-------|-----|
| 39 | **Dead dependencies**: `langchain-anthropic`, `langgraph` in `requirements.txt` | Remove unused packages |
| 40 | **`python-dotenv` redundant** with `pydantic-settings` | Remove from requirements |
| 41 | **`pyproject.toml` has no `[project.dependencies]`** — conflicts with `requirements.txt` | Consolidate to `pyproject.toml` |
| 42 | **`@app.on_event("startup")` deprecated** | Migrate to `lifespan` context manager |
| 43 | **Inconsistent timezone usage** (`datetime.now()` vs `datetime.now(timezone.utc)`) | Use UTC everywhere |
| 44 | **Test deps in production Docker image** | Separate `requirements-dev.txt` |
| 45 | **`agents.md` is empty** | Populate with project conventions |

## Implementation Order

1. Bugs first (items 1-10) — fix actual broken behavior
2. Security & Docker (items 11-17) — prevent vulnerabilities
3. DRY extraction (items 18-24) — reduce duplication before it spreads
4. Type safety (items 25-29) — catch bugs at compile time
5. Performance (items 30-33) — improve UX
6. Validation & error handling (items 34-38) — harden the API
7. Config & cleanup (items 39-45) — reduce technical debt
