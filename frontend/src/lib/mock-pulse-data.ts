import type { PulseReport } from "@/types/pulse";

export const REPORT_CATEGORIES = [
  "People & Culture",
  "Meetings",
  "Wellness",
  "Compliance",
] as const;

export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

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
    id: "report-1",
    title: "1-on-1 Prep: Chris Petersen",
    agent_name: "1-on-1 Prep Report",
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
    id: "report-2",
    title: "Workload Review: Mart Thompson",
    agent_name: "Workload Analyzer",
    category: "Meetings",
    status: "unread",
    preview:
      "Mart's meeting load has increased 34% over the past quarter, with back-to-back meetings on Tuesdays and Thursdays.",
    markdown:
      "# Workload Review: Mart Thompson\n\n## Meeting Volume\n\n- Weekly meeting hours: 22.4 hrs (peer median: 15 hrs)\n- Back-to-back days: Tuesday, Thursday\n- Focus time: 6 hrs/week (peer median: 12 hrs)\n\n## Recommendations\n\n- Protect focus blocks on Monday and Friday\n- Delegate recurring syncs where possible\n- Consider async updates for standups",
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "report-3",
    title: "Team Sentiment Pulse — April",
    agent_name: "Team Sentiment",
    category: "People & Culture",
    status: "unread",
    preview:
      "Overall team sentiment is positive (7.2/10). Response rates remain high but meeting overload signals in engineering subgroup.",
    markdown:
      "# Team Sentiment Pulse — April\n\n## Overall Score\n\n7.2/10 — Slightly above org average (6.8/10)\n\n## Key Signals\n\n- Positive: Strong cross-team collaboration signals\n- Neutral: Meeting load steady vs. March\n- Concern: Engineering subgroup showing burnout indicators",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "report-4",
    title: "1-on-1 Prep: Damien Nguyen",
    agent_name: "1-on-1 Prep Report",
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
    id: "report-5",
    title: "Meeting Effectiveness: Q1 Review",
    agent_name: "Workload Analyzer",
    category: "Meetings",
    status: "all",
    preview:
      "Large meeting costs have decreased 12% QoQ. Speedy meeting adoption at 28% across the team, up from 19%.",
    markdown:
      "# Meeting Effectiveness: Q1 Review\n\n## Key Metrics\n\n- Large meeting cost: Down 12% QoQ\n- Speedy meeting adoption: 28% (up from 19%)\n- Average response rate: 76%\n\n## Trends\n\n- 25-minute format gaining traction\n- Recurring meetings show lower quality scores than ad-hoc",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "report-6",
    title: "Wellness Check: Jessie Martinez",
    agent_name: "Team Sentiment",
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
    id: "report-7",
    title: "Compliance: Fair Meeting Practices",
    agent_name: "1-on-1 Prep Report",
    category: "Compliance",
    status: "all",
    preview:
      "All managers meeting the minimum 1:1 cadence requirement. 2 managers have reschedule rates above 50%.",
    markdown:
      "# Compliance: Fair Meeting Practices\n\n## 1:1 Coverage\n\n- 100% of managers meeting minimum 1:1 cadence\n- 2 managers with reschedule rates > 50%\n\n## Outside-Hours Policy\n\n- 3 employees with recurring outside-hours meetings\n- All flagged for HR review",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "report-8",
    title: "1-on-1 Prep: Johnny Walsh",
    agent_name: "1-on-1 Prep Report",
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
    id: "report-9",
    title: "Burnout Risk Assessment — Engineering",
    agent_name: "Workload Analyzer",
    category: "Wellness",
    status: "all",
    preview:
      "3 of 8 engineers in the team showing 2+ burnout indicators. Wednesday is the most overloaded day across the team.",
    markdown:
      "# Burnout Risk Assessment — Engineering\n\n## At-Risk Indicators\n\n3 of 8 engineers showing 2+ burnout indicators:\n- Outside-hours meetings\n- Back-to-back clustering\n- Focus time below 5 hrs/week\n\n## Team Patterns\n\n- Wednesday most overloaded day\n- Average meeting load: 22 hrs/week (org median: 15 hrs)",
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: "report-10",
    title: "Compliance: Meeting Policy Adherence",
    agent_name: "Workload Analyzer",
    category: "Compliance",
    status: "archived",
    preview:
      "87% of meetings comply with the 25-minute default policy. Large meetings (8+ attendees) show lower agenda usage at 23%.",
    markdown:
      "# Meeting Policy Adherence\n\n## Speedy Meeting Adoption\n\n87% of new meetings use 25-minute format\n\n## Large Meeting Compliance\n\n- Agenda usage for 8+ attendee meetings: 23%\n- Policy requires agenda for all meetings with 10+ attendees\n- 4 meetings non-compliant this month",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

export const MOCK_REPORTS = MOCK_PULSE_REPORTS;
