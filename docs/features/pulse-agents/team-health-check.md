# AI Agent name: Team Health Check

Measures team health related to meeting patterns, providing team leads and managers with engagement, workload, and collaboration insights.

## Flow
AI agent starts conversation with the introduction. Then ask users to collect information:
1. **Select department** — User picks a department from a list (narrows down team selection)
2. **Select team** — User picks a team within the selected department
3. **Select time frame** — e.g. "Last month", "Last quarter", custom range
4. **Select mode** — Conversation mode that shapes the report focus:
   - **Coaching & Support** — Team morale and wellbeing focus, strengths-first framing
   - **Performance Review** — Team metrics vs benchmarks, evaluative comparison
   - **Workload Concern** — Capacity and burnout signals across the team
   - **Investigation** — Engagement and participation patterns, direct factual framing
5. **Confirm & Generate** — AI produces structured report

## Report Structure

```
Title: Team Health Check: {Team Name} ({Time Frame})
├── Team Snapshot
│   ├── Metrics Table (team vs org median)
│   ├── Strengths to Build On
│   └── Areas of Concern
└── Meeting Health Indicators
    ├── Workload Distribution
    ├── 1-on-1 Coverage & Quality
    ├── Collaboration Patterns
    └── Discussion Starters for Team Lead
```

### Team Snapshot

Metrics table comparing the team against organisation median:

| Field | Example |
|-------|---------|
| Team size | 12 |
| Avg meeting hours per member | 24.3 |
| % of working time in meetings | 38.5% |
| Team meeting count | 286 |
| Avg quality score | 62.1% |
| 1-on-1 coverage rate | 68.4% |
| External meeting % | 18.2% |
| After-hours meetings (team total) | 8.5 hrs |
| Speedy meeting adoption | 55.6% |
| Large meeting % (8+ attendees) | 31.2% |

**Strengths to Build On** — Positive team patterns with data-backed evidence and coaching prompts for the team lead.

**Areas of Concern** — Risk patterns: overloaded members, low 1-on-1 coverage, declining attendance, with specific data points.

### Meeting Health Indicators

**Workload Distribution** — Per-member breakdown: meeting hours, after-hours meetings, back-to-back days, and focus time blocks. Highlights the most overloaded and most underutilised team members.

**1-on-1 Coverage & Quality** — Team-wide 1-on-1 stats: coverage rate, cancellation rate, reschedule rate, avg duration. Flags members missing regular 1-on-1s with their manager.

**Collaboration Patterns** — Internal vs external meeting split, cross-team collaboration frequency, meeting clustering (are meetings concentrated on certain days?), and isolation signals (members with low meeting engagement).

**Discussion Starters for Team Lead** — Quoted prompts the manager can use in team check-ins, 1-on-1s, or retrospectives. Tailored to the selected mode.

## Item Interactions

Each insight item supports:
- **Drill down** — Generates one deeper level of content (max 1 level)
- **Verify** — Generates data-backed evidence for the insight
- **Ask a question** — Opens popup, answer appears in AI Chat panel
- **Unpin** — Excludes item from Report View

## Store
- Generated reports store in `docs/data`. E.g `team-health-check-product-search-may-2026.md`
