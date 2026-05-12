import type { ContentModule } from "@/types/session";

export const MOCK_MODULES: ContentModule[] = [
  {
    id: "module-glance",
    title: "At a Glance",
    chips: [
      { id: "chip-data", label: "Data Interpreter", enabled: true, disabled: false },
      { id: "chip-strengths", label: "Strengths to Acknowledge", enabled: true, disabled: false },
      { id: "chip-patterns", label: "Patterns Worth Discussing", enabled: true, disabled: false },
      { id: "chip-more", label: "More", enabled: false, disabled: true },
    ],
    content: {
      "chip-data": {
        metrics: [
          { label: "Monthly meeting hours", value: "62.5", median: "66.4" },
          { label: "% working time in meetings", value: "38.5%", median: "35.4%" },
          { label: "Meetings per month", value: "118", median: "129" },
          { label: "Top meeting category", value: "Alignment (49.9%)", median: "—" },
          { label: "Outside-hours meetings", value: "0.5 hrs (1)", median: "—" },
          { label: "Meetings organised (% of total)", value: "39%", median: "—" },
          { label: "Response rate to invitations", value: "99.2%", median: "80.2%" },
          { label: "External meeting %", value: "23.7%", median: "—" },
          { label: "Speedy meeting adoption", value: "37.3%", median: "22.7%" },
          { label: "Large meeting % (8+ attendees)", value: "37.3%", median: "28.3%" },
        ],
      },
      "chip-strengths": {
        items: [
          "Exceptional response rate (99.2%) — Chris responds to almost every meeting invitation he receives. The EM peer median is around 80%. This signals strong calendar discipline and respect for colleagues' planning needs.",
          "Minimal outside-hours impact — Only 0.5 hours outside work hours in April (a single meeting). Despite a busy calendar, Chris is maintaining clear boundaries.",
          "Strong speedy meeting adoption (37.3%) — Chris uses 25-minute or 50-minute formats more than most of his peers (median 22.7%). He's practising intentional meeting design rather than defaulting to 30/60 minute blocks.",
          "Good recurring/ad-hoc balance (55/45 split) — A healthy mix suggesting he's not over-committed to standing meetings but still has structure.",
        ],
      },
      "chip-patterns": {
        items: [
          "Meeting load spiked significantly in March (79.4 hrs, 49% of time) before settling back in April (62.5 hrs, 38.5%). 4-month trend: Jan 52.7 hrs, Feb 54.8 hrs, Mar 79.4 hrs, Apr 62.5 hrs. March was driven by ad-hoc meetings nearly doubling (48 hrs vs ~30 hrs in other months).",
          "Almost half his meeting time is Alignment meetings (49.9%, 31.2 hours). The second highest category is Supporting Individuals at 18.5% (11.6 hrs). Key alignment meetings include SETI JPD refinement, Due Diligence stakeholder stand up, ETech Weekly Wednesday Update, and Apps Team Standup.",
          "Wednesday is by far the heaviest day (18.3 hrs across the month, 29% of weekly time in meetings). Day-of-week distribution: Mon 7.4 hrs, Tue 16.2 hrs, Wed 18.3 hrs, Thu 15.6 hrs, Fri 4.5 hrs.",
          "High external meeting engagement (23.7%) across 16 unique companies — primarily Google (6 meetings, 4.5 hrs), Atlassian (8 meetings, 4.2 hrs), and Searce (4 meetings, 3.7 hrs).",
        ],
      },
    },
  },
  {
    id: "module-calendar",
    title: "Calendar Deep-Dive",
    chips: [
      { id: "chip-data", label: "Data Interpreter", enabled: true, disabled: false },
      { id: "chip-meetings", label: "Meetings He Organizes", enabled: true, disabled: false },
      { id: "chip-starters", label: "Discussion Starters", enabled: true, disabled: false },
    ],
    content: {
      "chip-data": {
        items: [
          "Alignment: 31.2 hrs (49.9%), 61 meetings",
          "Supporting Individuals: 11.6 hrs (18.5%), 22 meetings",
          "Decision Making: 5.5 hrs (8.8%), 12 meetings",
          "Learning & Sharing: 5.5 hrs (8.8%), 8 meetings",
          "Planning: 3.9 hrs (6.3%), 6 meetings",
          "Uncategorised: 2.6 hrs (4.1%), 6 meetings",
          "Evaluation: 1.2 hrs (1.9%), 2 meetings",
          "Fostering Connections: 1.0 hrs (1.6%), 1 meeting",
        ],
      },
      "chip-meetings": {
        table: [
          { meeting: "Due Diligence stakeholder stand up", hours: "Weekly", cost: "High", intent: "Medium", alignment: "High" },
          { meeting: "ETech Weekly Wednesday Team Update", hours: "Weekly", cost: "High", intent: "Medium", alignment: "High" },
          { meeting: "SETI JPD refinement", hours: "Recurring", cost: "Medium", intent: "High", alignment: "High" },
          { meeting: "Apps Team Standup", hours: "Weekly", cost: "Medium", intent: "High", alignment: "High" },
          { meeting: "ETech Apps Stand up 2026 Series", hours: "Weekly", cost: "Medium", intent: "Medium", alignment: "High" },
          { meeting: "Enterprise App Leads Weekly", hours: "Weekly", cost: "Low", intent: "High", alignment: "High" },
          { meeting: "Apps Team: JPD Prioritisation", hours: "Weekly", cost: "Medium", intent: "High", alignment: "Medium" },
        ],
      },
      "chip-starters": {
        items: [
          "\"Your meeting load spiked in March at nearly 50% of working time. What drove that surge, and is there a risk of it recurring?\"",
          "\"Several of your largest meetings (Due Diligence stand up, ETech Wednesday Update) involve 30+ people. Are those forums still the right size for the decisions being made?\"",
          "\"You have significant vendor meeting time with Google and Searce. Could some of that be delegated to free up your calendar for strategic work?\"",
          "\"Your speedy meeting adoption is above median — great practice. Have you considered expanding that to more recurring meetings?\"",
          "\"Almost half your time is in Alignment meetings. Is the balance right between aligning and executing?\"",
          "\"With a 37% large-meeting share, there may be information-dump sessions that could be replaced with async updates. Want to audit one together?\"",
          "\"You're spending 18.5% of meeting time Supporting Individuals — that's a positive. Are those interactions giving you what you need to support your team effectively?\"",
        ],
      },
    },
  },
];
