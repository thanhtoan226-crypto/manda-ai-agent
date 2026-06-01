import type { PulseReport } from "@/types/pulse";
import { MOCK_MODULES_BY_AGENT } from "./mock-content";

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

const AGENT_NAME_TO_ID: Record<string, string> = {
  "1-on-1 Prep Brief": "agent-1on1",
  "Executive Digest Agent": "agent-executive",
  "Recurring Meeting Audit": "agent-recurring",
  "Team Health Check": "agent-team-health",
};

export const MOCK_DRILL_DOWN: Record<string, string> = {
  "chip-data":
    "Detailed metric breakdown: Chris's response rate of 99.2% places him in the top 5% of all Engineering Managers. His monthly meeting hours of 62.5 are in the 43rd percentile. Speedy meeting adoption at 37.3% is 65% above the peer median.",
  "chip-strengths":
    "Additional strength context: Chris's minimal outside-hours meetings (0.5 hrs) have been consistent for 4 consecutive months. His good recurring/ad-hoc balance suggests he protects time for both structured coordination and emergent needs.",
  "chip-patterns":
    "Detailed breakdown of patterns: The March spike (79.4 hrs) was driven by a GWS Technical Discovery project that added 15+ ad-hoc meetings. April's recovery to 62.5 hrs suggests the spike was project-driven, not structural.",
  "chip-cal-data":
    "Meeting category analysis: Alignment dominates because Chris manages cross-team dependencies across 4 product squads. The Supporting Individuals category (18.5%) includes 4 regular 1:1s with direct reports.",
  "chip-meetings":
    "Recurring meeting cost analysis: The Due Diligence standup at $5,700/mo is the single highest-cost recurring meeting. The SETI JPD refinement has the best quality score (0.98) among his recurring meetings.",
  "chip-organized":
    "Meetings organized analysis: Chris's organised meetings have a 65.2% quality score overall. The low agenda usage (17.4%) is concentrated in his recurring standups.",
  "chip-adhoc":
    "Ad-hoc meetings have a quality score of 69.2% vs 62.3% for recurring — likely because they tend to be smaller and more focused.",
  "chip-1on1-coverage":
    "1:1 coverage deep-dive: Despite the 75% reschedule rate, all 1:1s are happening — Chris is committed but juggling a dynamic calendar. The 45-minute average duration is appropriate for coaching conversations.",
  "chip-starters":
    "Quarterly trend for discussion: Chris's Q1 meeting hours were Jan 52.7, Feb 54.8, Mar 79.4, Apr 62.5. The trend line suggests a new baseline around 60-65 hrs/month.",
  "chip-signals":
    "Signal analysis: The 1-on-1 coverage gap (74.6% vs 82.1% median) affects approximately 18 managers across Engineering. The correlation between low 1-on-1 coverage and team attrition was statistically significant.",
  "chip-trends":
    "Trend projection: At +5.1% MoM growth, Engineering will hit 22+ hours per employee by Q3 2026, crossing the burnout threshold.",
  "chip-cost-breakdown":
    "Cost breakdown detail: Alignment meetings ($4,220/mo) include 3 weekly cross-team syncs and 1 daily standup.",
  "chip-quick-wins":
    "Quick win implementation: Shortening 3 meetings from 60 to 30 min requires only organizer action. Moving 2 meetings to bi-weekly should be proposed at the next sprint retrospective.",
  "chip-workload":
    "Workload analysis: Jordan's 31.4 hrs includes 8 after-hours meetings from on-call rotation overlap. The 94% variation between highest and lowest member workload suggests uneven distribution.",
  "chip-1on1-quality":
    "1-on-1 quality analysis: The 68.4% coverage rate means 4 team members had fewer than 2 scheduled 1:1s in the past month.",
  "chip-collab":
    "Collaboration pattern detail: The 38% cross-team meeting rate is above the Engineering average of 29%, indicating strong external collaboration.",
  "chip-discussion":
    "Discussion context: These starters are calibrated for a Coaching & Support mode. The 1-on-1 coverage gap is the highest-impact item.",
  "chip-red-flags":
    "Risk assessment: Platform quality score (61.2%) has been declining for 3 consecutive months.",
  "chip-meeting-cards":
    "Meeting card detail: The Weekly Sprint Sync has the highest ROI — 78% quality score with clear agenda and consistent attendance.",
  "chip-recommendations":
    "Recommendation impact: If all recommendations are implemented, estimated savings are $6,720/month and 14 hours/month.",
};

export const MOCK_PULSE_REPORTS: PulseReport[] = [
  {
    id: "pulse-1",
    title: "1-on-1 Prep: Chris Petersen",
    agent_name: "1-on-1 Prep Brief",
    agent_id: "agent-1on1",
    category: "People & Culture",
    status: "focus",
    preview:
      "Exceptional response rate (99.2%) and minimal outside-hours impact. Alignment meetings dominate at 49.9% of meeting time.",
    modules: MOCK_MODULES_BY_AGENT["agent-1on1"] || null,
    markdown:
      "# 1-on-1 Prep Brief: Chris Petersen\n\n## At a Glance\n\n| Metric | Chris | EM Peer Median |\n|--------|-------|----------------|\n| Monthly meeting hours | 62.5 | 66.4 |\n| Response rate | 99.2% | 80.2% |\n| Speedy meeting adoption | 37.3% | 22.7% |\n\n## Strengths\n\n- Exceptional response rate (99.2%)\n- Minimal outside-hours impact\n- Strong speedy meeting adoption\n\n## Patterns\n\n- Meeting load spiked in March (79.4 hrs)\n- Alignment meetings dominate at 49.9%\n- Wednesday is heaviest day (29% of weekly time)",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "pulse-2",
    title: "Executive Digest: Engineering (April)",
    agent_name: "Executive Digest Agent",
    agent_id: "agent-executive",
    category: "Meetings",
    status: "unread",
    preview:
      "Engineering dept meeting cost up 5.1% MoM, driven by cross-team alignment. 1-on-1 coverage at 74.6% below org median.",
    modules: MOCK_MODULES_BY_AGENT["agent-executive"] || null,
    markdown:
      "# Executive Digest: Engineering (April 2026)\n\n## At a Glance\n\n| Metric | Engineering | Org Median |\n|--------|-------------|------------|\n| Total meeting cost | $2,847,500 | $2,410,000 |\n| Avg hrs/employee | 18.4 | 16.2 |\n| 1-on-1 coverage | 74.6% | 82.1% |\n\n## Key Signals\n\n- Speedy meeting adoption at 62.3% exceeds org median\n- 1-on-1 coverage gap affects ~18 managers\n- Meeting cost 18% above median per-capita",
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "pulse-3",
    title: "Team Health Check: Platform Team",
    agent_name: "Team Health Check",
    agent_id: "agent-team-health",
    category: "Wellness",
    status: "unread",
    preview:
      "Platform team avg 24.3 meeting hrs/member vs org median 18.4. After-hours meetings at 2.7x org average.",
    modules: MOCK_MODULES_BY_AGENT["agent-team-health"] || null,
    markdown:
      "# Team Health Check: Platform Team\n\n## Team Snapshot\n\n| Metric | Platform | Org Median |\n|--------|----------|------------|\n| Avg meeting hrs/member | 24.3 | 18.4 |\n| 1-on-1 coverage | 68.4% | 82.1% |\n| After-hours meetings | 8.5 hrs | 3.2 hrs |\n\n## Areas of Concern\n\n- After-hours meetings 2.7x org median\n- 1-on-1 coverage gap affects 4 members\n- Quality scores below org median",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "pulse-4",
    title: "1-on-1 Prep: Damien Nguyen",
    agent_name: "1-on-1 Prep Brief",
    agent_id: "agent-1on1",
    category: "People & Culture",
    status: "focus",
    preview:
      "Damien maintains excellent 1:1 cadence with zero cancellations. External meetings are well-managed at 15% of total time.",
    modules: MOCK_MODULES_BY_AGENT["agent-1on1"] || null,
    markdown:
      "# 1-on-1 Prep Brief: Damien Nguyen\n\n## At a Glance\n\n| Metric | Damien | Peer Median |\n|--------|--------|-------------|\n| Monthly meeting hours | 48.2 | 66.4 |\n| External meeting % | 15% | 23.7% |\n| 1:1 cancellation rate | 0% | 12% |\n\n## Strengths\n\n- Zero 1:1 cancellations\n- Low external meeting engagement — focused\n- Strong agenda usage (72%)",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "pulse-5",
    title: "Recurring Meeting Audit: Last Quarter",
    agent_name: "Recurring Meeting Audit",
    agent_id: "agent-recurring",
    category: "Meetings",
    status: "focus",
    preview:
      "14 recurring meetings totaling 42.5 hrs/month. 3 with declining attendance, 2 candidates for elimination.",
    modules: MOCK_MODULES_BY_AGENT["agent-recurring"] || null,
    markdown:
      "# Recurring Meeting Audit\n\n## Summary\n\n| Metric | You | Peer Median |\n|--------|-----|-------------|\n| Monthly recurring hours | 42.5 | 34.2 |\n| % of calendar from recurring | 61.2% | 52.4% |\n\n## Recommendations\n\n- Keep 6 meetings\n- Merge 2 meetings\n- Eliminate 2 meetings\n\nPotential savings: $6,720/month",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "pulse-6",
    title: "Wellness Check: Jessie Martinez",
    agent_name: "Team Health Check",
    agent_id: "agent-team-health",
    category: "Wellness",
    status: "unread",
    preview:
      "Jessie has 3.2 hours of outside-hours meetings this month and back-to-back clustering on Wednesdays.",
    modules: null,
    markdown:
      "# Wellness Check: Jessie Martinez\n\n## Outside-Hours Impact\n\n3.2 hours outside work hours this month (vs. 0.5 hrs peer median)\n\n## Calendar Density\n\n- Wednesday: 9.2 hrs in meetings\n- Back-to-back blocks: 4 on Wednesday alone\n- Focus time: 3 hrs/week (peer median: 12 hrs)\n\n## Recommendations\n\n- Revisit Wednesday calendar density\n- Set working hours boundary in calendar",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "pulse-7",
    title: "Compliance: Fair Meeting Practices",
    agent_name: "Recurring Meeting Audit",
    agent_id: "agent-recurring",
    category: "Compliance",
    status: "archived",
    modules: null,
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
    agent_id: "agent-1on1",
    category: "People & Culture",
    status: "archived",
    modules: null,
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
    agent_id: "agent-executive",
    category: "Meetings",
    status: "archived",
    modules: null,
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
    agent_id: "agent-team-health",
    category: "Wellness",
    status: "archived",
    modules: null,
    preview:
      "DevOps team after-hours load is 3x org average. On-call overlap with standups is the primary driver.",
    markdown:
      "# Team Health Check: DevOps Team\n\n## Concerns\n\n- After-hours load driven by on-call + standup overlap\n- Lowest quality score among Engineering teams (58.9%)\n- 1-on-1 coverage at 62% — critical gap\n\n## Recommendation\n\nMove to async standup format for on-call rotation members.",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];
