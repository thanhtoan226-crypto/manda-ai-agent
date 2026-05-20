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
          { label: "% of working time in meetings", value: "38.5%", median: "35.4%" },
          { label: "Meetings per month", value: "118", median: "129" },
          { label: "Top meeting category", value: "Alignment (49.9%)", median: "—" },
          { label: "Outside-hours meetings", value: "0.5 hrs", median: "—" },
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
          "Minimal outside-hours impact — Only 0.5 hours outside work hours in April (a single meeting). Despite a busy calendar, Chris is maintaining clear boundaries. This is worth protecting.",
          "Strong speedy meeting adoption (37.3%) — Chris uses 25-minute or 50-minute formats more than most of his peers (median 22.7%). He's practising intentional meeting design rather than defaulting to 30/60 minute blocks.",
          "Good recurring/ad-hoc balance (55/45 split) — A healthy mix suggesting he's not over-committed to standing meetings but still has structure. The 55% recurring is right in the optimal range.",
        ],
      },
      "chip-patterns": {
        items: [
          "Meeting load spiked significantly in March (79.4 hrs, 49% of time) before settling back in April (62.5 hrs, 38.5%). The 4-month trend: Jan 52.7 hrs, Feb 54.8 hrs, Mar 79.4 hrs, Apr 62.5 hrs. March was driven by ad-hoc meetings nearly doubling.",
          "Almost half his meeting time is Alignment meetings (49.9%, 31.2 hours). Key forums: SETI JPD refinement (weekly, 12 people), Due Diligence stakeholder stand up (weekly, 33-35 people), ETech Weekly Wednesday Update (weekly, 42 people).",
          "Wednesday is by far the heaviest day (18.3 hrs across the month, 29% of weekly time in meetings). Day distribution: Mon 7.4 hrs, Tue 16.2 hrs, Wed 18.3 hrs, Thu 15.6 hrs, Fri 4.5 hrs.",
          "High external meeting engagement (23.7%) across 16 unique companies — primarily Google (6 meetings, 4.5 hrs), Atlassian (8 meetings, 4.2 hrs), and Searce (4 meetings, 3.7 hrs). Above typical for an EM role.",
        ],
      },
    },
  },
  {
    id: "module-calendar",
    title: "Calendar Deep-Dive",
    chips: [
      { id: "chip-data", label: "Data Interpreter", enabled: true, disabled: false },
      { id: "chip-meetings", label: "Top Recurring Commitments", enabled: true, disabled: false },
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
          { meeting: "Due Diligence stakeholder stand up", hours: "Weekly", cost: "33-35", intent: "~$5,700/mo", alignment: "High" },
          { meeting: "ETech Weekly Wednesday Update", hours: "Weekly", cost: "42", intent: "~$3,400/mo", alignment: "Medium" },
          { meeting: "SETI JPD refinement", hours: "Recurring", cost: "12", intent: "~$1,500/occ", alignment: "High" },
          { meeting: "Apps Team Standup", hours: "Weekly", cost: "11", intent: "~$1,800/mo", alignment: "Medium" },
          { meeting: "ETech Apps Stand up (2026)", hours: "Weekly", cost: "12", intent: "~$2,200/mo", alignment: "Medium" },
          { meeting: "Enterprise App Leads Weekly", hours: "Weekly", cost: "4", intent: "~$760/mo", alignment: "High" },
          { meeting: "Apps Team: JPD Prioritisation", hours: "Weekly", cost: "9", intent: "~$1,640/mo", alignment: "Medium" },
        ],
      },
      "chip-starters": {
        items: [
          "\"March was significantly busier than your other months — was that a one-off project spike, or is there an underlying trend we should watch?\"",
          "\"You're in several large recurring forums (Due Diligence at 35 people, ETech Wednesday at 42 people). Do these still need you weekly, or could you attend fortnightly or get a summary?\"",
          "\"Your external vendor work is quite extensive — Google, Atlassian, Searce, AvePoint, Salesforce. Is this sustainable, or would it help to bring someone else into some of these relationships?\"",
          "\"Your speedy meeting adoption is good — you're using 25-minute slots for most of your ad-hoc meetings. Have you considered shifting some of your recurring standups from 30 to 25 minutes too?\"",
          "\"You're doing a lot of the coordination and alignment work for the team. Is that energising for you, or would you prefer more time in Planning and Decision Making categories?\"",
          "\"The JPD Prioritisation meeting has great quality scores (0.98) with an agenda. Some of your other recurring meetings (Apps Team Standup) have lower quality scores. Would it help to bring the same structure to those?\"",
          "\"How are things going with the team members you're supporting? I can see regular 1:1s with Mart, Damien, Jessie, and Johnny — are you feeling good about the cadence and quality of those conversations?\"",
        ],
      },
    },
  },
];
