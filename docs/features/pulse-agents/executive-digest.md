# Executive Digest Agent

Generates executive-level dashboards and signal reports for company-wide or department-level meeting analytics.

## Flow
AI agent starts conversation with the introduction. Then ask users to collect information:
1. **Select target** — User picks a scope: "Company-wide" or a specific department from a list
2. **Select time frame** — e.g. "Last month", "Last quarter", custom range
3. **Select mode** — Conversation mode that shapes the report focus:
   - **Talent Focus** — People-centric signals: engagement, burnout risk, 1-on-1 coverage
   - **Board-Ready** — Executive summary with key metrics, trends, and cost impact
   - **Capacity Review** — Workload distribution, meeting overload, and resource utilisation
   - **Risk Assessment** — Red flags: declining quality, attendance drops, compliance gaps
4. **Confirm & Generate** — AI produces structured report

## Report Structure

```
Title: Executive Digest: {Scope Name} ({Time Frame})
├── At a Glance
│   ├── Metrics Table (current vs previous period)
│   ├── Key Signals
│   └── Trends Worth Noting
└── Department Breakdown
    ├── Department Comparison Table
    ├── Top Cost Centers
    └── Red Flags & Recommendations
```

### At a Glance

Metrics table comparing current period against previous period:

| Field | Example |
|-------|---------|
| Total meeting cost | $2,847,500 |
| Avg meeting hours per employee | 18.4 |
| Meeting growth trend | +5.1% |
| Large meeting % (8+ attendees) | 28.4% |
| Avg quality score | 67.4% |
| Agenda usage | 58.2% |
| Speedy meeting adoption | 62.3% |
| 1-on-1 coverage rate | 74.6% |
| External meeting % | 23.7% |
| After-hours meeting hours | 142 |

**Key Signals** — Top 3–5 positive or notable patterns with data-backed evidence and executive framing.

**Trends Worth Noting** — Concerning or emerging trends with specific data points and business impact.

### Department Breakdown

**Department Comparison Table** — Per-department metrics: total cost, avg hours per employee, meeting count, quality score, large meeting %, 1-on-1 coverage.

**Top Cost Centers** — Departments or teams with highest meeting cost, broken down by recurring vs ad-hoc, with cost-per-employee.

**Red Flags & Recommendations** — Actionable items: departments with declining quality, teams over threshold for meeting overload, low 1-on-1 coverage units, and suggested interventions.

## Item Interactions

Each insight item supports:
- **Drill down** — Generates one deeper level of content (max 1 level)
- **Verify** — Generates data-backed evidence for the insight
- **Ask a question** — Opens popup, answer appears in AI Chat panel
- **Unpin** — Excludes item from Report View

## Store
- Generated reports store in `docs/data`. E.g `executive-digest-engineering-q1-2026.md`
