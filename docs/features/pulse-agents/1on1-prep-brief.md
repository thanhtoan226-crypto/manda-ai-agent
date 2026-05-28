# AI Agent name: 1-on-1 Prep Brief

Generates manager prep briefs for upcoming 1-on-1 meetings with direct reports.

## Flow

1. **Select object** — User picks a direct report from a list
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

| Field | Example | EM Peer Median | Position
|-------|---------|---------|---------|
| Monthly meeting hours | {number} | {number} | {feedback} |
| % of working time in meetings | {number}  | {number} | {feedback} |
| Meetings per month | {number}  | {number} | {feedback} |
| Top meeting category | Alignment {number}  | {number} | {feedback} |
| Outside-hours meetings | {number}  hrs | {number} | {feedback} |
| Meetings organised (% of total) | {number} % | {number} | {feedback} |
| Response rate | {number} % | {number} | {feedback} |
| External meeting % | {number}% | {number} | {feedback} |
| Speedy meeting adoption | {number} % | {number} | {feedback} |
| Large meeting % (8+ attendees) | {number} % | {number} | {feedback} |

**Strengths to Acknowledge** — Positive patterns with data-backed evidence and coaching prompts.

**Patterns Worth Discussing** — Concerning trends with specific data points and suggested conversation starters.

### Calendar Deep-Dive

Meeting Category Breakdown

| Category | Hours | % of Meeting Time | Meetings
|-------|---------|---------|---------|
| Alignment | {number} | {number}% | {number} |
| Supporting Individuals | {number} | {number}% | {number} |
| Decision Making | {number} | {number}% | {number} |
| Learning & Sharing | {number} | {number}% | {number} |
| Planning | {number} | {number}% | {number} |
| Uncategorised | {number} | {number}% | {number} |
| Evaluation | {number} | {number}% | {number} |
| Fostering Connections | {number} | {number}%| {number} |



**Recurring Meeting** — Feedback for recurring meetings

**Ad-hoc Meetings** - Feedback for Ad-hoc Meetings

**Meetings He Organizes** — Feedback for Meetings the employee runs, with quality scores, agenda usage, and context clarity.

**Discussion Starters** — Quoted prompts the manager can use in the 1-on-1 conversation.

## Item Interactions

Each insight item supports:
- **Drill down** — Generates one deeper level of content (max 1 level)
- **Verify** — Generates data-backed evidence for the insight
- **Ask a question** — Opens popup, answer appears in AI Chat panel
- **Unpin** — Excludes item from Report View
- highlight text within a graph (nodes, labels, or notes) and use an LLM to rewrite it via a contextual pop-up menu.
All those features use LLM APIs to return response.

## Mock Data

For 1on1-prep-brief, copy data from `1on1-prep-brief-Chris-Peterson.md` to apply for any employee selected in that 1on1-prep-brief report. Remember to change the employee name in the report detail.
