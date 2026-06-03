export interface AgentMode {
  id: string;
  label: string;
  description: string;
}

export interface AgentConfig {
  firstStep: string;
  subjectLabel: string;
  subjects: string[] | Record<string, string[]>;
  modes: AgentMode[];
  tableHeaders: { key: string; label: string }[];
  badgeLabels: { cost: string; alignment: string };
  verifySource: string;
  stepLabels: { subject: string };
}

export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  "agent-1on1": {
    firstStep: "select-employee",
    subjectLabel: "Select a direct report",
    subjects: [
      "Chris Petersen",
      "Mart Thompson",
      "Damien Nguyen",
      "Jessie Martinez",
      "Johnny Walsh",
      "Jackson Lee",
    ],
    modes: [
      { id: "coaching", label: "Coaching & Support", description: "Strengths-first, warm tone, for growth and wellbeing" },
      { id: "performance", label: "Performance Review Prep", description: "Evidence-based, balanced, for formal reviews" },
      { id: "workload", label: "Workload Concern", description: "Volume/trend data, caring but factual, for capacity signals" },
      { id: "investigation", label: "Investigation", description: "Direct/factual, data-driven, for engagement concerns" },
    ],
    tableHeaders: [
      { key: "meeting", label: "Meeting" },
      { key: "hours", label: "Frequency" },
      { key: "cost", label: "Cost" },
      { key: "intent", label: "Attendees" },
      { key: "alignment", label: "Priority" },
    ],
    badgeLabels: { cost: "Cost", alignment: "Priority" },
    verifySource: "Source: Calendar integration (Outlook + Google Calendar)\n- Period: Last 30 days\n- Confidence: 94%\n- Sample size: 118 meetings analyzed\n- Methodology: Peer comparison against 69 Engineering Managers at REA Group",
    stepLabels: { subject: "Subject" },
  },
  "agent-executive": {
    firstStep: "select-scope",
    subjectLabel: "Select target scope",
    subjects: [
      "Company-wide",
      "Engineering",
      "Product",
      "Design",
      "Marketing",
      "Sales",
      "Operations",
    ],
    modes: [
      { id: "talent", label: "Talent Focus", description: "People-centric signals: engagement, burnout risk, 1-on-1 coverage" },
      { id: "board-ready", label: "Board-Ready", description: "Executive summary with key metrics, trends, and cost impact" },
      { id: "capacity", label: "Capacity Review", description: "Workload distribution, meeting overload, and resource utilisation" },
      { id: "risk", label: "Risk Assessment", description: "Red flags: declining quality, attendance drops, compliance gaps" },
    ],
    tableHeaders: [
      { key: "meeting", label: "Team" },
      { key: "hours", label: "Hrs/Employee" },
      { key: "cost", label: "Cost" },
      { key: "intent", label: "Large Meeting %" },
      { key: "alignment", label: "Health" },
    ],
    badgeLabels: { cost: "Cost", alignment: "Health" },
    verifySource: "Source: Organization-wide calendar analytics\n- Period: Last month\n- Confidence: 91%\n- Sample size: 2,847 employees across 7 departments\n- Methodology: Department-level aggregation with per-capita normalization",
    stepLabels: { subject: "Scope" },
  },
  "agent-recurring": {
    firstStep: "skip-to-timeframe",
    subjectLabel: "Your recurring meetings",
    subjects: [],
    modes: [
      { id: "cost", label: "Cost Optimisation", description: "Focus on time and money waste, consolidation opportunities" },
      { id: "quality", label: "Quality Review", description: "Focus on agenda usage, purpose clarity, and desired outcomes" },
      { id: "attendance", label: "Attendance & Engagement", description: "Focus on declining rates, no-response patterns, and participation" },
    ],
    tableHeaders: [
      { key: "meeting", label: "Meeting" },
      { key: "hours", label: "Frequency" },
      { key: "cost", label: "Cost" },
      { key: "intent", label: "Avg Attendees" },
      { key: "alignment", label: "Verdict" },
    ],
    badgeLabels: { cost: "Cost", alignment: "Verdict" },
    verifySource: "Source: Recurring meeting audit from calendar data\n- Period: Last quarter\n- Confidence: 93%\n- Sample size: 14 recurring meetings analyzed\n- Methodology: Cost modeling with blended rate of $120/hr/attendee",
    stepLabels: { subject: "Scope" },
  },
  "agent-team-health": {
    firstStep: "select-department",
    subjectLabel: "Select department and team",
    subjects: {
      Engineering: ["Platform", "Frontend", "Backend", "Data", "DevOps"],
      Product: ["Search", "Marketplace", "Payments"],
      Design: ["UX Research", "Product Design", "Brand"],
      Marketing: ["Growth", "Content", "Analytics"],
      Sales: ["Enterprise", "SMB", "Partnerships"],
    },
    modes: [
      { id: "coaching", label: "Coaching & Support", description: "Team morale and wellbeing focus, strengths-first framing" },
      { id: "performance", label: "Performance Review", description: "Team metrics vs benchmarks, evaluative comparison" },
      { id: "workload", label: "Workload Concern", description: "Capacity and burnout signals across the team" },
      { id: "investigation", label: "Investigation", description: "Engagement and participation patterns, direct factual framing" },
    ],
    tableHeaders: [
      { key: "meeting", label: "Member" },
      { key: "hours", label: "Meeting Hours" },
      { key: "cost", label: "Load" },
      { key: "intent", label: "After-Hours" },
      { key: "alignment", label: "Status" },
    ],
    badgeLabels: { cost: "Load", alignment: "Status" },
    verifySource: "Source: Team meeting health analytics\n- Period: Last month\n- Confidence: 90%\n- Sample size: 12 team members, 286 meetings\n- Methodology: Team-level comparison against org-wide benchmarks",
    stepLabels: { subject: "Team" },
  },
};
