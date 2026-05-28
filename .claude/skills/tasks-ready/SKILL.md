---
name: tasks-ready
description: Run after completing a task to verify backend and frontend are working correctly before marking work as done
---

# Tasks-Ready: Post-Task Verification

Run these checks after completing any implementation task. No task is done until verification passes.

## Backend Steps

### 1. Lint & Format
```bash
cd backend && ruff check . && ruff format --check .
```
Fix any issues before proceeding. If `ruff` not found, try via Docker: `docker compose exec backend ruff check .`

### 2. Syntax Validation
```bash
cd backend && python3 -c "import py_compile; py_compile.compile('app/main.py', doraise=True)" && echo "Syntax OK"
```
Catches syntax errors. For full import validation, use Docker:
```bash
docker compose exec backend python -c "from app.main import app; print('Imports OK')"
```

### 3. Data Consistency (if mock data changed)
```bash
cd backend && python3 -c "
from app.services.mock_data import LEARNING_MODULES, MOCK_TOPIC_CONTENT
all_ids = {t['id'] for m in LEARNING_MODULES for t in m['topics']}
content_ids = set(MOCK_TOPIC_CONTENT.keys())
missing = all_ids - content_ids
extra = content_ids - all_ids
assert not missing, f'Missing content for topics: {missing}'
assert not extra, f'Extra content keys: {extra}'
print(f'All {len(all_ids)} topics have matching content')
"
```

### 4. Tests
```bash
cd backend && pytest
```

## Frontend Steps

### 1. Type Check
```bash
cd frontend && npx tsc --noEmit
```
Zero errors required.

### 2. Build
```bash
cd frontend && npm run build
```
Build must complete without errors. This also catches type errors.

### 3. Lint (if ESLint configured)
```bash
cd frontend && npm run lint
```
Skip if no `.eslintrc*` or `eslint.config.*` exists yet.

### 4. Visual Check (if UI changed)
```bash
cd frontend && npm run dev
```
Open the affected pages in browser and verify:
- No console errors
- Layout renders correctly
- Interactive elements work (buttons, toggles, navigation)

## Docker (full integration test)

```bash
docker compose up --build
```
Verify all services start and health checks pass. Use when backend + frontend changes need end-to-end validation.

## Checklist

- [ ] Backend syntax check passes
- [ ] Mock data keys match topic IDs (if changed)
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] Visual verification (if UI changed)
