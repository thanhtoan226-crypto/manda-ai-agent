# Manda AI Agent — Documentation

Collect data from integrations (Google Calendar, Teams, Outlook) to analyze meeting health and provide organizational insights.

## Features

| Feature | Doc | Status |
|---------|-----|--------|
| My Dashboard | [features/dashboard.md](features/dashboard.md) | Spec |
| Insights | [features/insights.md](features/insights.md) | Spec |
| AI Agents (Workbench) | [features/agents-feature.md](features/agents-feature.md) | MVP |
| 1-on-1 Prep Report | [features/pulse-agents/1on1-prep-brief.md](features/pulse-agents/1on1-prep-brief.md) | MVP |
| Executive Digest | [features/pulse-agents/executive-digest.md](features/pulse-agents/executive-digest.md) | MVP |
| Recurring Meeting Audit | [features/pulse-agents/recurring-meeting-audit.md](features/pulse-agents/recurring-meeting-audit.md) | MVP |
| Team Health Check | [features/pulse-agents/team-health-check.md](features/pulse-agents/team-health-check.md) | MVP |
| Intent Modes | [features/modes.md](features/modes.md) | MVP |

## Planned

- My Team
- My Manda
- Compliance
- Feedback
- Learning
- Reports
- Integration
- Settings

## Reference Data & Samples

| Data | Doc |
|------|-----|
| Agent definitions & pulse reports | [data/agents.md](data/agents.md) |
| 1-on-1 sample report | [data/1on1-prep-brief-Chris-Peterson.md](data/1on1-prep-brief-Chris-Peterson.md) |
| Report MD template | [data/sample-report.md](data/sample-report.md) |

## Environment Setup

Copy `backend/.env.example` to `backend/.env` and set your LLM API key:

```bash
cp backend/.env.example backend/.env
# Edit .env and set LLM_API_KEY=your-z-ai-api-key
```

When `LLM_API_KEY` is set, the backend uses real LLM calls (via Z.AI OpenAI-compatible API). When empty, all AI responses fall back to mock data — no API key required for local development.
