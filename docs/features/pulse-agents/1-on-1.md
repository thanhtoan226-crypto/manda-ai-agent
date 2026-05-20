# 1-on-1 Prep Report Agent

Generates manager prep briefs for upcoming 1-on-1 meetings with direct reports.

## Flow

1. **Select subject** — User picks a direct report from a list
2. **Select time frame** — e.g. "Last month", "Last quarter", custom range
3. **Select mode** — Conversation mode that shapes the report focus:
   - **Coaching & Support** — Mentoring-focused insights
   - **Performance Review Prep** — Review-ready data
   - **Workload Concern** — Capacity and burnout signals
   - **Investigation** — Deep-dive exploration
4. **Confirm & Generate** — AI produces structured report

## Report Structure

```
Title: 1:1 Prep Brief: {Employee Name}
├── At a Glance
│   ├── Metrics Table (employee vs peer median)
│   ├── Strengths to Acknowledge
│   └── Patterns Worth Discussing
└── Calendar Deep-Dive
    ├── Category Breakdown
    ├── Top Recurring Time Commitments
    ├── Meetings Organized
    ├── 1:1 Coverage
    └── Discussion Starters
```

### At a Glance

Metrics table comparing the employee against peer median:

| Field | Example |
|-------|---------|
| Monthly meeting hours | 62.5 |
| % of working time in meetings | 38.5% |
| Meetings per month | 118 |
| Top meeting category | Alignment (49.9%) |
| Outside-hours meetings | 0.5 hrs |
| Meetings organised (% of total) | 39% |
| Response rate | 99.2% |
| External meeting % | 23.7% |
| Speedy meeting adoption | 37.3% |
| Large meeting % (8+ attendees) | 37.3% |

**Strengths to Acknowledge** — Positive patterns with data-backed evidence and coaching prompts.

**Patterns Worth Discussing** — Concerning trends with specific data points and suggested conversation starters.

### Calendar Deep-Dive

**Category Breakdown** — Hours, % of meeting time, and meeting count per category (Alignment, Supporting Individuals, Decision Making, etc.)

**Top Recurring Time Commitments** — Highest-cost recurring meetings with frequency, attendee count, and monthly cost.

**Meetings Organized** — Meetings the employee runs, with quality scores, agenda usage, and context clarity.

**1:1 Coverage** — Recurring 1:1 stats: coverage rate, cancellation rate, reschedule rate, average duration.

**Discussion Starters** — Quoted prompts the manager can use in the 1-on-1 conversation.

## Item Interactions

Each insight item supports:
- **Drill down** — Generates one deeper level of content (max 1 level)
- **Verify** — Generates data-backed evidence for the insight
- **Ask a question** — Opens popup, answer appears in AI Chat panel
- **Unpin** — Excludes item from Report View

## Mock Data

Full sample report: [../../mockdata/1-on-1.md](../../mockdata/1-on-1.md)
