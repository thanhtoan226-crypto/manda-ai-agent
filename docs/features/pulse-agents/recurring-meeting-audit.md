# Recurring Meeting Audit Agent

Reviews all recurring meetings created by the user, providing cost, quality, and attendance insights with actionable recommendations.

## Flow
AI agent starts conversation with the introduction. Then ask users to collect information:
1. **Select target** — Automatically scoped to the user's own recurring meetings (no manual selection needed)
2. **Select time frame** — e.g. "Last month", "Last quarter", custom range
3. **Select mode** — Conversation mode that shapes the report focus:
   - **Cost Optimisation** — Focus on time and money waste, consolidation opportunities
   - **Quality Review** — Focus on agenda usage, purpose clarity, and desired outcomes
   - **Attendance & Engagement** — Focus on declining rates, no-response patterns, and participation
4. **Confirm & Generate** — AI produces structured report

## Report Structure

```
Title: Recurring Meeting Audit: {User Name} ({Time Frame})
├── Recurring Meeting Summary
│   ├── Metrics Table (user's recurring meetings)
│   ├── Time & Cost Breakdown
│   └── Quick Wins
└── Meeting-by-Meeting Breakdown
    ├── Meeting Cards (one per recurring meeting)
    └── Recommendations (Keep / Merge / Eliminate)
```

### Recurring Meeting Summary

Metrics table for the user's recurring meeting portfolio:

| Field | Example |
|-------|---------|
| Total recurring meetings | 14 |
| Monthly recurring hours | 42.5 |
| Monthly recurring cost | $9,780 |
| % of calendar from recurring | 61.2% |
| Avg meeting size | 6.3 attendees |
| Avg quality score | 54.8% |
| Avg agenda usage | 42.1% |
| Avg response rate | 72.4% |
| Meetings with declining attendance | 3 |

**Time & Cost Breakdown** — Hours and cost split by meeting category (Alignment, Decision Making, Supporting Individuals, etc.) with recurring vs ad-hoc comparison.

**Quick Wins** — Immediate actions: meetings that could be shortened, bi-weekly instead of weekly, or removed entirely based on low attendance/quality.

### Meeting-by-Meeting Breakdown

**Meeting Cards** — One card per recurring meeting showing:

| Field | Example |
|-------|---------|
| Meeting name | Weekly Sprint Sync |
| Frequency | Weekly (4x/month) |
| Duration | 60 min |
| Avg attendees | 8 |
| Monthly hours | 32 |
| Monthly cost | $7,360 |
| Quality score | 48.2% |
| Agenda usage | 25% |
| Response rate | 65% |
| Declining trend | Yes (-12% attendance) |

**Recommendations** — Per-meeting verdict with reasoning:
- **Keep** — Meeting is effective: high attendance, good quality score, clear purpose
- **Merge** — Overlaps with another recurring meeting; combine for efficiency
- **Eliminate** — Low attendance, no agenda, declining engagement; cancel or make async

Each recommendation includes the data points that support it.

## Item Interactions

Each insight item supports:
- **Drill down** — Generates one deeper level of content (max 1 level)
- **Verify** — Generates data-backed evidence for the insight
- **Ask a question** — Opens popup, answer appears in AI Chat panel
- **Unpin** — Excludes item from Report View

## Store
- Generated reports store in `docs/data`. E.g `recurring-meeting-audit-sarah-chen-may-2026.md`
