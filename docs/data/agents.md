# Agent Mock Data

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

10 mock reports with varied categories, statuses, and dates. Category color mapping:
- People & Culture → blue
- Meetings → amber
- Wellness → emerald
- Compliance → purple

## Agents

```json
[
  {
    "id": "agent-1on1",
    "name": "1-on-1 Prep Report",
    "description": "Generate manager prep briefs for upcoming 1-on-1s",
    "icon": "user-check",
    "category": "Management",
    "is_favorite": true,
    "usage_count": 142
  },
  {
    "id": "agent-workload",
    "name": "Workload Analyzer",
    "description": "Analyze team capacity and burnout risks",
    "icon": "bar-chart-3",
    "category": "Analytics",
    "is_favorite": false,
    "usage_count": 98
  },
  {
    "id": "agent-sentiment",
    "name": "Team Sentiment",
    "description": "Surface engagement and morale signals from team data",
    "icon": "heart-pulse",
    "category": "Analytics",
    "is_favorite": true,
    "usage_count": 67
  },
  {
    "id": "agent-review",
    "name": "Review Writer",
    "description": "Draft performance review summaries",
    "icon": "file-text",
    "category": "Management",
    "is_favorite": false,
    "usage_count": 55
  }
]
```
