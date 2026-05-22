import type { PulseReport } from "@/types/pulse";

export const REPORT_CATEGORIES = [
  "People & Culture",
  "Meetings",
  "Wellness",
  "Compliance",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "People & Culture": "bg-blue-100 text-blue-700",
  Meetings: "bg-amber-100 text-amber-700",
  Wellness: "bg-emerald-100 text-emerald-700",
  Compliance: "bg-purple-100 text-purple-700",
};

export const CATEGORY_BORDER_COLORS: Record<string, string> = {
  "People & Culture": "border-l-blue-500",
  Meetings: "border-l-amber-500",
  Wellness: "border-l-emerald-500",
  Compliance: "border-l-purple-500",
};

export const MOCK_PULSE_REPORTS: PulseReport[] = [
  {
    id: "pulse-1",
    title: "1-on-1 Prep: Chris Petersen",
    agent_name: "1-on-1 Prep Brief",
    category: "People & Culture",
    status: "focus",
    preview:
      "Exceptional response rate (99.2%) and minimal outside-hours impact. Alignment meetings dominate at 49.9% of meeting time.",
    markdown:
      "# 1-on-1 Prep Brief: Chris Petersen\n\n## At a Glance\n\n| Metric | Chris | EM Peer Median |\n|--------|-------|----------------|\n| Monthly meeting hours | 62.5 | 66.4 |\n| Response rate | 99.2% | 80.2% |\n| Speedy meeting adoption | 37.3% | 22.7% |\n\n## Strengths\n\n- Exceptional response rate (99.2%)\n- Minimal outside-hours impact\n- Strong speedy meeting adoption\n\n## Patterns\n\n- Meeting load spiked in March (79.4 hrs)\n- Alignment meetings dominate at 49.9%\n- Wednesday is heaviest day (29% of weekly time)",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "pulse-2",
    title: "Executive Digest: Engineering (April)",
    agent_name: "Executive Digest Agent",
    category: "Meetings",
    status: "unread",
    preview:
      "Engineering dept meeting cost up 5.1% MoM, driven by cross-team alignment. 1-on-1 coverage at 74.6% below org median.",
    markdown:
      "# Executive Digest: Engineering (April 2026)\n\n## At a Glance\n\n| Metric | Engineering | Org Median |\n|--------|-------------|------------|\n| Total meeting cost | $2,847,500 | $2,410,000 |\n| Avg hrs/employee | 18.4 | 16.2 |\n| 1-on-1 coverage | 74.6% | 82.1% |\n\n## Key Signals\n\n- Speedy meeting adoption at 62.3% exceeds org median\n- 1-on-1 coverage gap affects ~18 managers\n- Meeting cost 18% above median per-capita",
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "pulse-3",
    title: "Team Health Check: Platform Team",
    agent_name: "Team Health Check",
    category: "Wellness",
    status: "unread",
    preview:
      "Platform team avg 24.3 meeting hrs/member vs org median 18.4. After-hours meetings at 2.7x org average.",
    markdown:
      "# Team Health Check: Platform Team\n\n## Team Snapshot\n\n| Metric | Platform | Org Median |\n|--------|----------|------------|\n| Avg meeting hrs/member | 24.3 | 18.4 |\n| 1-on-1 coverage | 68.4% | 82.1% |\n| After-hours meetings | 8.5 hrs | 3.2 hrs |\n\n## Areas of Concern\n\n- After-hours meetings 2.7x org median\n- 1-on-1 coverage gap affects 4 members\n- Quality scores below org median",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "pulse-4",
    title: "1-on-1 Prep: Damien Nguyen",
    agent_name: "1-on-1 Prep Brief",
    category: "People & Culture",
    status: "focus",
    preview:
      "Damien maintains excellent 1:1 cadence with zero cancellations. External meetings are well-managed at 15% of total time.",
    markdown:
      "# 1-on-1 Prep Brief: Damien Nguyen\n\n## At a Glance\n\n| Metric | Damien | Peer Median |\n|--------|--------|-------------|\n| Monthly meeting hours | 48.2 | 66.4 |\n| External meeting % | 15% | 23.7% |\n| 1:1 cancellation rate | 0% | 12% |\n\n## Strengths\n\n- Zero 1:1 cancellations\n- Low external meeting engagement — focused\n- Strong agenda usage (72%)",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "pulse-5",
    title: "Recurring Meeting Audit: Last Quarter",
    agent_name: "Recurring Meeting Audit",
    category: "Meetings",
    status: "focus",
    preview:
      "14 recurring meetings totaling 42.5 hrs/month. 3 with declining attendance, 2 candidates for elimination.",
    markdown:
      "# Recurring Meeting Audit\n\n## Summary\n\n| Metric | You | Peer Median |\n|--------|-----|-------------|\n| Monthly recurring hours | 42.5 | 34.2 |\n| % of calendar from recurring | 61.2% | 52.4% |\n\n## Recommendations\n\n- Keep 6 meetings\n- Merge 2 meetings\n- Eliminate 2 meetings\n\nPotential savings: $6,720/month",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "pulse-6",
    title: "Wellness Check: Jessie Martinez",
    agent_name: "Team Health Check",
    category: "Wellness",
    status: "unread",
    preview:
      "Jessie has 3.2 hours of outside-hours meetings this month and back-to-back clustering on Wednesdays.",
    markdown:
      "# Wellness Check: Jessie Martinez\n\n## Outside-Hours Impact\n\n3.2 hours outside work hours this month (vs. 0.5 hrs peer median)\n\n## Calendar Density\n\n- Wednesday: 9.2 hrs in meetings\n- Back-to-back blocks: 4 on Wednesday alone\n- Focus time: 3 hrs/week (peer median: 12 hrs)\n\n## Recommendations\n\n- Revisit Wednesday calendar density\n- Set working hours boundary in calendar",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "pulse-7",
    title: "Compliance: Fair Meeting Practices",
    agent_name: "Recurring Meeting Audit",
    category: "Compliance",
    status: "archived",
    preview:
      "2 meetings flagged for no agenda. Compliance gap in vendor sync documentation.",
    markdown:
      "# Compliance: Fair Meeting Practices\n\n## 1:1 Coverage\n\n- 100% of managers meeting minimum 1:1 cadence\n- 2 managers with reschedule rates > 50%\n\n## Outside-Hours Policy\n\n- 3 employees with recurring outside-hours meetings\n- All flagged for HR review",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "pulse-8",
    title: "1-on-1 Prep: Johnny Walsh",
    agent_name: "1-on-1 Prep Brief",
    category: "People & Culture",
    status: "archived",
    preview:
      "Johnny's meeting patterns show strong development focus. Ad-hoc meetings are well-structured with 85% agenda usage.",
    markdown:
      "# 1-on-1 Prep Brief: Johnny Walsh\n\n## At a Glance\n\n| Metric | Johnny | Peer Median |\n|--------|--------|-------------|\n| Monthly meeting hours | 55.0 | 66.4 |\n| Agenda usage | 85% | 45% |\n| Ad-hoc quality score | 78% | 62% |\n\n## Strengths\n\n- Highest agenda usage in the team\n- Well-structured ad-hoc meetings",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "pulse-9",
    title: "Executive Digest: Company-wide (Q1)",
    agent_name: "Executive Digest Agent",
    category: "Meetings",
    status: "archived",
    preview:
      "Company-wide meeting cost $12.4M in Q1. Quality scores improving +2.1 pts from Q4.",
    markdown:
      "# Executive Digest: Company-wide (Q1 2026)\n\n## At a Glance\n\nTotal company meeting cost: $12.4M in Q1, up 3.2% from Q4. Quality scores improved to 69.8% (+2.1 pts).\n\n## Department Comparison\n\n| Department | Cost | Hrs/Employee | Quality |\n|------------|------|-------------|--------|\n| Engineering | $2.85M | 18.4 | 67.4% |\n| Product | $1.92M | 16.1 | 72.8% |\n| Sales | $2.41M | 22.3 | 61.2% |",
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "pulse-10",
    title: "Team Health Check: DevOps Team",
    agent_name: "Team Health Check",
    category: "Wellness",
    status: "archived",
    preview:
      "DevOps team after-hours load is 3x org average. On-call overlap with standups is the primary driver.",
    markdown:
      "# Team Health Check: DevOps Team\n\n## Concerns\n\n- After-hours load driven by on-call + standup overlap\n- Lowest quality score among Engineering teams (58.9%)\n- 1-on-1 coverage at 62% — critical gap\n\n## Recommendation\n\nMove to async standup format for on-call rotation members.",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];
