# Agent Reference Data

## Pulse Reports

```typescript
interface PulseReport {
  id: string;
  title: string;
  agent_name: string;
  category: string;         // "People & Culture" | "Meetings" | "Wellness" | "Compliance"
  status: "focus" | "unread" | "archived";
  preview: string;          // short excerpt shown on card
  markdown: string;         // full report content
  created_at: string;
  updated_at: string;
}
```

10 sample reports with varied categories, statuses, and dates. Category color mapping:
- People & Culture → blue
- Meetings → amber
- Wellness → emerald
- Compliance → purple

## Agents

4 MVP agents, each with a corresponding spec in `docs/features/pulse-agents/`.

| Agent | Browse Category | Report Category | Spec |
|-------|----------------|-----------------|------|
| 1-on-1 Prep Report | People Management | People & Culture | [1on1-prep-brief.md](../features/pulse-agents/1on1-prep-brief.md) |
| Executive Digest | Leadership & Strategy | Meetings | [executive-digest.md](../features/pulse-agents/executive-digest.md) |
| Recurring Meeting Audit | Productivity & Efficiency | Meetings | [recurring-meeting-audit.md](../features/pulse-agents/recurring-meeting-audit.md) |
| Team Health Check | People Management | Wellness | [team-health-check.md](../features/pulse-agents/team-health-check.md) |

```json
[
  {
    "id": "agent-1on1",
    "name": "1-on-1 Prep Report",
    "description": "Generate manager prep briefs for upcoming 1-on-1s",
    "icon": "user-check",
    "category": "People Management",
    "is_favorite": true,
    "usage_count": 142
  },
  {
    "id": "agent-executive",
    "name": "Executive Digest",
    "description": "Generate executive-level dashboards and signal reports for company-wide or department-level meeting analytics",
    "icon": "bar-chart-3",
    "category": "Leadership & Strategy",
    "is_favorite": true,
    "usage_count": 98
  },
  {
    "id": "agent-recurring",
    "name": "Recurring Meeting Audit",
    "description": "Review all recurring meetings for cost, quality, and attendance with actionable recommendations",
    "icon": "repeat",
    "category": "Productivity & Efficiency",
    "is_favorite": false,
    "usage_count": 67
  },
  {
    "id": "agent-team-health",
    "name": "Team Health Check",
    "description": "Measure team health related to meeting patterns with engagement, workload, and collaboration insights",
    "icon": "heart-pulse",
    "category": "People Management",
    "is_favorite": false,
    "usage_count": 55
  }
]
```

### Category Systems

Two separate category systems serve different purposes:

1. **Browse Categories** — group agents on the Browse Agents landing page carousel (People Management, Leadership & Strategy, Productivity & Efficiency)
2. **Report Categories** — classify generated reports in the Pulse feed for filtering (People & Culture, Meetings, Wellness, Compliance)
