import type { ContentModule } from "@/types/session";

const MODULES_1ON1: ContentModule[] = [
  {
    id: "module-glance",
    title: "At a Glance",
    chips: [
      { id: "chip-data", label: "Data Interpreter", enabled: true },
      { id: "chip-strengths", label: "Strengths to Acknowledge", enabled: true },
      { id: "chip-patterns", label: "Patterns Worth Discussing", enabled: true },
    ],
    content: {
      "chip-data": {
        metrics: [
          { label: "Monthly meeting hours", value: "62.5", median: "66.4", position: "Middle of pack (43rd of 69)" },
          { label: "% of working time in meetings", value: "38.5%", median: "35.4%", position: "Slightly above median" },
          { label: "Meetings per month", value: "118", median: "129", position: "Below median" },
          { label: "Top meeting category", value: "Alignment (49.9%)", median: "—", position: "Heavy alignment load" },
          { label: "Outside-hours meetings", value: "0.5 hrs", median: "—", position: "Minimal - positive signal" },
          { label: "Meetings organised (% of total)", value: "39%", median: "—", position: "Active organiser" },
          { label: "Response rate to invitations", value: "99.2%", median: "80.2%", position: "Top of cohort" },
          { label: "External meeting %", value: "23.7%", median: "—", position: "Above typical for EM role" },
          { label: "Speedy meeting adoption", value: "37.3%", median: "22.7%", position: "Above peer median" },
          { label: "Large meeting % (8+ attendees)", value: "37.3%", median: "28.3%", position: "Above median" },
        ],
        text: "Chris is a **solid performer** vs. peers across most metrics. Exceptional response rate and speedy meeting adoption stand out as clear strengths.",
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
      { id: "chip-cal-data", label: "Data Interpreter", enabled: true },
      { id: "chip-meetings", label: "Top Recurring Commitments", enabled: true },
      { id: "chip-organized", label: "Meetings Organized", enabled: true },
      { id: "chip-adhoc", label: "Ad-hoc Meetings", enabled: true },
      { id: "chip-1on1-coverage", label: "1:1 Coverage", enabled: true },
      { id: "chip-starters", label: "Discussion Starters", enabled: true },
    ],
    content: {
      "chip-cal-data": {
        headers: [
          { key: "meeting", label: "Category" },
          { key: "hours", label: "Hours" },
          { key: "cost", label: "% of Meeting Time" },
          { key: "intent", label: "Meetings" },
        ],
        table: [
          { meeting: "Alignment", hours: "31.2", cost: "49.9%", intent: "61" },
          { meeting: "Supporting Individuals", hours: "11.6", cost: "18.5%", intent: "22" },
          { meeting: "Decision Making", hours: "5.5", cost: "8.8%", intent: "12" },
          { meeting: "Learning & Sharing", hours: "5.5", cost: "8.8%", intent: "8" },
          { meeting: "Planning", hours: "3.9", cost: "6.3%", intent: "6" },
          { meeting: "Uncategorised", hours: "2.6", cost: "4.1%", intent: "6" },
          { meeting: "Evaluation", hours: "1.2", cost: "1.9%", intent: "2" },
          { meeting: "Fostering Connections", hours: "1.0", cost: "1.6%", intent: "1" },
        ],
      },
      "chip-meetings": {
        table: [
          { meeting: "Due Diligence stakeholder stand up", hours: "Weekly", cost: "~$5,700/mo", intent: "33-35", alignment: "High" },
          { meeting: "ETech Weekly Wednesday Update", hours: "Weekly", cost: "~$3,400/mo", intent: "42", alignment: "Medium" },
          { meeting: "SETI JPD refinement", hours: "Recurring", cost: "~$1,500/occ", intent: "12", alignment: "High" },
          { meeting: "Apps Team Standup", hours: "Weekly", cost: "~$1,800/mo", intent: "11", alignment: "Medium" },
          { meeting: "ETech Apps Stand up (2026)", hours: "Weekly", cost: "~$2,200/mo", intent: "12", alignment: "Medium" },
          { meeting: "Enterprise App Leads Weekly", hours: "Weekly", cost: "~$760/mo", intent: "4", alignment: "High" },
          { meeting: "Apps Team: JPD Prioritisation", hours: "Weekly", cost: "~$1,640/mo", intent: "9", alignment: "Medium" },
        ],
      },
      "chip-organized": {
        table: [
          { meeting: "Apps Team Standup", hours: "Weekly", cost: "11 attendees", intent: "62%", alignment: "Medium" },
          { meeting: "Enterprise App Leads Weekly", hours: "Weekly", cost: "4 attendees", intent: "78%", alignment: "High" },
          { meeting: "Apps Team: JPD Prioritisation", hours: "Weekly", cost: "9 attendees", intent: "98%", alignment: "High" },
          { meeting: "1:1s with Direct Reports", hours: "Various", cost: "1 attendee", intent: "—", alignment: "— " },
          { meeting: "Ad-hoc Vendor Coordination", hours: "Ad-hoc", cost: "2-4 attendees", intent: "69%", alignment: "Medium" },
        ],
        text: "Chris organises **46 meetings (39% of his total)**. Quality score: 65.2% overall. Ad-hoc meetings score higher (69.2%) than recurring ones (62.3%). Agenda usage is low at **17.4%**, though context clarity is high at **91.3%**.\n\nChris's organised meeting quality varies considerably. His JPD Prioritisation meeting stands out with a 98% quality score and consistent agenda usage — this should be the model for his other recurring meetings. The Apps Team Standup scores lowest among his organised meetings, and the lack of agenda (17.4% overall usage) is a drag on quality. The high context clarity (91.3%) suggests Chris communicates purpose well when creating meetings, but doesn't formalise it with agendas. Recommendation: adopt the JPD Prioritisation format (agenda + desired outcomes) as the standard for all meetings he organises.",
      },
      "chip-adhoc": {
        items: [
          "**53 ad-hoc meetings** in April, accounting for **28.2 hrs (45% of total meeting time)**",
          "Vendor coordination (Google, Atlassian, Searce): 14 meetings, 10.2 hrs",
          "Cross-team alignment syncs: 12 meetings, 7.8 hrs",
          "1:1 check-ins (beyond recurring): 9 meetings, 3.8 hrs",
          "Project-specific workshops: 8 meetings, 4.2 hrs",
          "Interview panels: 6 meetings, 1.6 hrs",
          "Other: 4 meetings, 0.6 hrs",
        ],
        text: "Ad-hoc meetings have a quality score of **69.2%** vs **62.3%** for recurring — likely because they tend to be smaller (avg 3.2 attendees) and more focused. Speedy meeting adoption is strong at **44.1%** for ad-hoc vs **31.2%** for recurring.\n\nChris's ad-hoc meeting pattern reveals two important signals. First, the vendor coordination cluster (10.2 hrs) is substantial and suggests he's carrying significant external relationship management load — this is typically a senior+ or principal EM responsibility. Second, the cross-team alignment syncs (7.8 hrs) indicate he's a connector between teams, which is valuable but can become a bottleneck. The higher quality scores on ad-hoc vs recurring (69.2% vs 62.3%) suggest Chris is more intentional when creating one-off meetings than when maintaining standing ones. The 9 ad-hoc 1:1 check-ins beyond his recurring cadence show he's responsive to team needs, but also that his recurring 1:1 schedule may not fully cover what his reports need.",
      },
      "chip-1on1-coverage": {
        items: [
          "Recurring 1:1 coverage: **100%** — Chris has weekly or fortnightly 1:1s scheduled with all direct reports",
          "Cancellation rate: **0%** — no 1:1s were cancelled in April, showing strong commitment to these meetings",
          "Reschedule rate: **75%** — 3 of 4 meetings were rescheduled, suggesting flexibility rather than avoidance (the meetings happen, just at different times)",
          "Average duration: **45 mins** with direct reports",
          "Broader team: Chris runs 1:1s with Mart (weekly), Damien (fortnightly), Jessie (fortnightly), Johnny (fortnightly), and Jackson (ad-hoc check-ins)",
        ],
      },
      "chip-starters": {
        items: [
          '"March was significantly busier than your other months — was that a one-off project spike, or is there an underlying trend we should watch?"',
          '"You\'re in several large recurring forums (Due Diligence at 35 people, ETech Wednesday at 42 people). Do these still need you weekly, or could you attend fortnightly or get a summary?"',
          '"Your external vendor work is quite extensive — Google, Atlassian, Searce, AvePoint, Salesforce. Is this sustainable, or would it help to bring someone else into some of these relationships?"',
          '"Your speedy meeting adoption is good — you\'re using 25-minute slots for most of your ad-hoc meetings. Have you considered shifting some of your recurring standups from 30 to 25 minutes too?"',
          '"You\'re doing a lot of the coordination and alignment work for the team. Is that energising for you, or would you prefer more time in Planning and Decision Making categories?"',
          '"The JPD Prioritisation meeting has great quality scores (0.98) with an agenda. Some of your other recurring meetings (Apps Team Standup) have lower quality scores. Would it help to bring the same structure to those?"',
          '"How are things going with the team members you\'re supporting? I can see regular 1:1s with Mart, Damien, Jessie, and Johnny — are you feeling good about the cadence and quality of those conversations?"',
        ],
      },
    },
  },
];

const MODULES_EXECUTIVE: ContentModule[] = [
  {
    id: "module-glance",
    title: "At a Glance",
    chips: [
      { id: "chip-data", label: "Data Interpreter", enabled: true },
      { id: "chip-signals", label: "Key Signals", enabled: true },
      { id: "chip-trends", label: "Trends Worth Noting", enabled: true },
    ],
    content: {
      "chip-data": {
        metrics: [
          { label: "Total meeting cost", value: "$2,847,500", median: "$2,410,000" },
          { label: "Avg meeting hours per employee", value: "18.4", median: "16.2" },
          { label: "Meeting growth trend", value: "+5.1%", median: "+2.3%" },
          { label: "Large meeting % (8+ attendees)", value: "28.4%", median: "24.1%" },
          { label: "Avg quality score", value: "67.4%", median: "71.2%" },
          { label: "Agenda usage", value: "58.2%", median: "63.4%" },
          { label: "Speedy meeting adoption", value: "62.3%", median: "55.8%" },
          { label: "1-on-1 coverage rate", value: "74.6%", median: "82.1%" },
          { label: "External meeting %", value: "23.7%", median: "19.8%" },
          { label: "After-hours meeting hours", value: "142", median: "98" },
        ],
        text: "Engineering department shows **moderate concern** — meeting costs are rising above benchmark, 1-on-1 coverage is below median, but speedy meeting adoption is a positive signal.",
      },
      "chip-signals": {
        items: [
          "Speedy meeting adoption at 62.3% exceeds org median (55.8%) — Engineering teams are actively using 25/50 minute formats, reducing schedule fragmentation across the department.",
          "1-on-1 coverage at 74.6% is below the org median of 82.1% — approximately 18 managers have inconsistent or missing 1-on-1 cadences with their direct reports. This is a retention risk.",
          "Meeting cost of $2.85M is 18% above the org median per-capita — driven primarily by large cross-team alignment meetings averaging 15+ attendees.",
        ],
      },
      "chip-trends": {
        items: [
          "Meeting growth trend of +5.1% MoM exceeds the org benchmark of +2.3% — if unchecked, Engineering will hit 22+ hours per employee by Q3, crossing the burnout threshold.",
          "After-hours meeting hours (142) are 45% above org median (98) — concentrated in the Platform and DevOps teams, likely driven by on-call overlap with standups.",
          "Quality scores have declined 3.8 points over the last quarter — the drop correlates with a 12% increase in large meetings, suggesting size is impacting meeting effectiveness.",
        ],
      },
    },
  },
  {
    id: "module-department",
    title: "Department Breakdown",
    chips: [
      { id: "chip-dept-data", label: "Data Interpreter", enabled: true },
      { id: "chip-cost-centers", label: "Top Cost Centers", enabled: true },
      { id: "chip-red-flags", label: "Red Flags & Recommendations", enabled: true },
    ],
    content: {
      "chip-dept-data": {
        items: [
          "Platform: $890K cost, 22.1 hrs/employee, 34% large meetings, quality 61.2%",
          "Frontend: $620K cost, 19.4 hrs/employee, 28% large meetings, quality 72.8%",
          "Backend: $540K cost, 17.8 hrs/employee, 22% large meetings, quality 69.4%",
          "Data: $410K cost, 16.2 hrs/employee, 19% large meetings, quality 74.1%",
          "DevOps: $387K cost, 21.6 hrs/employee, 31% large meetings, quality 58.9%",
        ],
      },
      "chip-cost-centers": {
        table: [
          { meeting: "Platform Team", hours: "22.1 hrs/emp", cost: "$890K", intent: "34% large", alignment: "Low" },
          { meeting: "DevOps Team", hours: "21.6 hrs/emp", cost: "$387K", intent: "31% large", alignment: "Low" },
          { meeting: "Frontend Team", hours: "19.4 hrs/emp", cost: "$620K", intent: "28% large", alignment: "Medium" },
          { meeting: "Backend Team", hours: "17.8 hrs/emp", cost: "$540K", intent: "22% large", alignment: "Medium" },
          { meeting: "Data Team", hours: "16.2 hrs/emp", cost: "$410K", intent: "19% large", alignment: "High" },
        ],
      },
      "chip-red-flags": {
        items: [
          "Platform team quality score (61.2%) is 10+ points below org median — 4 of their 6 weekly standups have no agenda and declining attendance. Recommend consolidating to 2 standups with required agendas.",
          "DevOps after-hours meeting load is 3x the org average — on-call engineers are attending standups during off-hours. Recommend async standup format for on-call rotation.",
          "1-on-1 coverage gap in Platform team — only 58% of direct reports have weekly 1-on-1s vs 82% org median. Flag 3 managers with inconsistent cadence.",
          "Cross-team alignment meetings account for 41% of Engineering meeting cost — recommend quarterly audit of recurring multi-team syncs with >15 attendees.",
        ],
      },
    },
  },
];

const MODULES_RECURRING: ContentModule[] = [
  {
    id: "module-summary",
    title: "Recurring Meeting Summary",
    chips: [
      { id: "chip-data", label: "Data Interpreter", enabled: true },
      { id: "chip-cost-breakdown", label: "Time & Cost Breakdown", enabled: true },
      { id: "chip-quick-wins", label: "Quick Wins", enabled: true },
    ],
    content: {
      "chip-data": {
        metrics: [
          { label: "Total recurring meetings", value: "14", median: "11" },
          { label: "Monthly recurring hours", value: "42.5", median: "34.2" },
          { label: "Monthly recurring cost", value: "$9,780", median: "$7,200" },
          { label: "% of calendar from recurring", value: "61.2%", median: "52.4%" },
          { label: "Avg meeting size", value: "6.3", median: "5.1" },
          { label: "Avg quality score", value: "54.8%", median: "62.1%" },
          { label: "Avg agenda usage", value: "42.1%", median: "58.3%" },
          { label: "Avg response rate", value: "72.4%", median: "81.6%" },
          { label: "Meetings with declining attendance", value: "3", median: "1" },
        ],
        text: "Your recurring meeting portfolio shows **significant optimization opportunity** — 61.2% of calendar is recurring (above the 52% benchmark), with below-average quality scores and agenda usage.",
      },
      "chip-cost-breakdown": {
        items: [
          "Alignment: 18.2 hrs (42.8%), $4,220/mo — largest recurring category",
          "Decision Making: 8.5 hrs (20.0%), $1,960/mo — second highest cost",
          "Supporting Individuals: 6.3 hrs (14.8%), $1,440/mo — includes 1-on-1s",
          "Planning: 5.1 hrs (12.0%), $1,180/mo — sprint ceremonies",
          "Learning & Sharing: 2.8 hrs (6.6%), $640/mo — team retrospectives",
          "Uncategorised: 1.6 hrs (3.8%), $340/mo — no clear purpose tagged",
        ],
      },
      "chip-quick-wins": {
        items: [
          "3 meetings could be shortened from 60 to 30 min — saves 6 hrs/month ($1,380): Daily standup, Sprint review prep, Vendor alignment sync",
          "2 weekly meetings could move to bi-weekly — saves 4 hrs/month ($920): Tech debt review, Cross-team sync",
          "1 meeting has no agenda and declining attendance — candidate for elimination: 'Catch-up' with 35% response rate and 0% agenda usage",
        ],
      },
    },
  },
  {
    id: "module-breakdown",
    title: "Meeting-by-Meeting Breakdown",
    chips: [
      { id: "chip-breakdown-data", label: "Data Interpreter", enabled: true },
      { id: "chip-meeting-cards", label: "Meeting Cards", enabled: true },
      { id: "chip-recommendations", label: "Recommendations", enabled: true },
    ],
    content: {
      "chip-breakdown-data": {
        items: [
          "Keep (6 meetings): Weekly 1-on-1s, Sprint Planning, Team Retrospective — all show high attendance and quality",
          "Merge (2 meetings): Tech debt review + Cross-team sync overlap in attendees and topics — combine into one 45-min session",
          "Eliminate (2 meetings): 'Catch-up' and 'Status update' — declining attendance, no agenda, low quality scores",
        ],
      },
      "chip-meeting-cards": {
        table: [
          { meeting: "Weekly Sprint Sync", hours: "Weekly (4x/mo)", cost: "$7,360/mo", intent: "8 avg", alignment: "Keep" },
          { meeting: "1-on-1: Direct Reports", hours: "Weekly (4x/mo)", cost: "$2,880/mo", intent: "2 avg", alignment: "Keep" },
          { meeting: "Team Retrospective", hours: "Bi-weekly (2x/mo)", cost: "$1,440/mo", intent: "6 avg", alignment: "Keep" },
          { meeting: "Tech Debt Review", hours: "Weekly (4x/mo)", cost: "$3,200/mo", intent: "8 avg", alignment: "Merge" },
          { meeting: "Cross-team Sync", hours: "Weekly (4x/mo)", cost: "$2,560/mo", intent: "6 avg", alignment: "Merge" },
          { meeting: "Vendor Alignment", hours: "Weekly (4x/mo)", cost: "$1,920/mo", intent: "5 avg", alignment: "Keep" },
          { meeting: "'Catch-up'", hours: "Weekly (4x/mo)", cost: "$4,800/mo", intent: "12 avg", alignment: "Eliminate" },
        ],
      },
      "chip-recommendations": {
        items: [
          "Keep: Weekly Sprint Sync — high quality score (78%), strong attendance (92%), clear agenda. This meeting is working well.",
          "Merge: Tech Debt Review + Cross-team Sync — 6 shared attendees and overlapping topics. Combine into one 45-min 'Technical Priorities Sync' — saves $1,920/mo and 4 hrs/month.",
          "Eliminate: 'Catch-up' — 35% response rate, 0% agenda usage, declining attendance (-18% over 3 months). Replace with async Slack update.",
          "Eliminate: 'Status update' — 42% response rate, no desired outcomes tagged, quality score 28%. The information shared is already available in the project dashboard.",
        ],
      },
    },
  },
];

const MODULES_TEAM_HEALTH: ContentModule[] = [
  {
    id: "module-snapshot",
    title: "Team Snapshot",
    chips: [
      { id: "chip-data", label: "Data Interpreter", enabled: true },
      { id: "chip-strengths", label: "Strengths to Build On", enabled: true },
      { id: "chip-concerns", label: "Areas of Concern", enabled: true },
    ],
    content: {
      "chip-data": {
        metrics: [
          { label: "Team size", value: "12", median: "10" },
          { label: "Avg meeting hours per member", value: "24.3", median: "18.4" },
          { label: "% of working time in meetings", value: "38.5%", median: "29.4%" },
          { label: "Team meeting count", value: "286", median: "210" },
          { label: "Avg quality score", value: "62.1%", median: "67.8%" },
          { label: "1-on-1 coverage rate", value: "68.4%", median: "82.1%" },
          { label: "External meeting %", value: "18.2%", median: "19.8%" },
          { label: "After-hours meetings (team total)", value: "8.5 hrs", median: "3.2 hrs" },
          { label: "Speedy meeting adoption", value: "55.6%", median: "55.8%" },
          { label: "Large meeting % (8+ attendees)", value: "31.2%", median: "24.1%" },
        ],
        text: "The Platform team shows **elevated meeting load** with below-average quality scores. Meeting hours per member are 32% above the org median, and 1-on-1 coverage is a significant gap.",
      },
      "chip-strengths": {
        items: [
          "Speedy meeting adoption (55.6%) is on par with org median — the team is already using shorter meeting formats for most ad-hoc meetings.",
          "External meeting % (18.2%) is healthy and below org median — the team is focused inward on collaboration rather than spread thin across external commitments.",
          "Two team members (Alex, Sam) have exceptional quality scores (>80%) — they model good meeting practices including consistent agenda usage and clear desired outcomes.",
        ],
      },
      "chip-concerns": {
        items: [
          "After-hours meetings total 8.5 hrs/month for the team — 2.7x the org median. Concentrated in 3 on-call team members who attend standups during off-hours.",
          "1-on-1 coverage at 68.4% is 14 points below org median — approximately 4 team members lack consistent weekly 1-on-1s with their manager.",
          "Average quality score (62.1%) is 5.7 points below org median — driven by 4 large recurring meetings with no agenda and declining attendance.",
          "Large meeting % (31.2%) exceeds org median — the team's 3 cross-team syncs average 12+ attendees, diluting individual contribution quality.",
        ],
      },
    },
  },
  {
    id: "module-health",
    title: "Meeting Health Indicators",
    chips: [
      { id: "chip-health-data", label: "Data Interpreter", enabled: true },
      { id: "chip-workload", label: "Workload Distribution", enabled: true },
      { id: "chip-1on1-quality", label: "1-on-1 Coverage & Quality", enabled: true },
      { id: "chip-collab", label: "Collaboration Patterns", enabled: true },
      { id: "chip-discussion", label: "Discussion Starters for Team Lead", enabled: true },
    ],
    content: {
      "chip-health-data": {
        items: [
          "Workload range: 16.2 hrs (lowest member) to 31.4 hrs (highest member) — 94% variation",
          "1-on-1 coverage: 68.4%, cancellation rate: 12%, reschedule rate: 28%",
          "Internal vs External split: 82% internal, 18% external",
          "Meeting clustering: 42% of meetings concentrate on Tue/Wed, with minimal Fri meetings",
        ],
      },
      "chip-workload": {
        table: [
          { meeting: "Jordan (Lead)", hours: "31.4 hrs", cost: "High", intent: "8 after-hrs", alignment: "Overloaded" },
          { meeting: "Alex", hours: "27.8 hrs", cost: "Medium", intent: "2 after-hrs", alignment: "Above avg" },
          { meeting: "Sam", hours: "24.6 hrs", cost: "Medium", intent: "0 after-hrs", alignment: "Optimal" },
          { meeting: "Riley", hours: "22.1 hrs", cost: "Medium", intent: "1 after-hrs", alignment: "Optimal" },
          { meeting: "Casey", hours: "16.2 hrs", cost: "Low", intent: "0 after-hrs", alignment: "Under-utilised" },
        ],
      },
      "chip-1on1-quality": {
        items: [
          "Team-wide 1:1 coverage rate: **68.4%** — 14 points below org median (82.1%). Approximately 4 team members lack consistent weekly 1:1s.",
          "Cancellation rate: **12%** — slightly above org average (8%). Cancellations concentrated in weeks with sprint deadlines.",
          "Reschedule rate: **28%** — higher than ideal. The team lead (Jordan) reschedules most often due to conflicting stakeholder meetings.",
          "Average 1:1 duration: **30 mins** — below the recommended 45 mins for meaningful coaching conversations.",
          "Members missing regular 1:1s: Casey, Riley, and 2 others have had 0 or 1 scheduled 1:1 in the past month. This is a retention risk.",
        ],
      },
      "chip-collab": {
        items: [
          "Cross-team collaboration is strong — 38% of meetings include members from other teams, indicating healthy information flow.",
          "Isolation signal: Casey has the lowest meeting count and attends 0 cross-team meetings. Worth exploring whether this is intentional (deep work focus) or a disengagement signal.",
          "Meeting clustering on Tue/Wed creates 'meeting marathon' days — team averages 5.2 hours of meetings on Tuesdays. Recommend spreading meetings more evenly across the week.",
        ],
      },
      "chip-discussion": {
        items: [
          '"Jordan is carrying a heavy meeting load, especially with after-hours overlap. Would it help to redistribute some of the on-call meeting coverage?"',
          '"1-on-1 coverage is below where it should be — 4 team members are missing regular check-ins. Could we establish a consistent cadence this sprint?"',
          '"The quality scores on your large recurring meetings are below average. Would it help to add agendas or split them into smaller focused sessions?"',
          '"Casey has the lightest meeting load on the team — is this by design, or would they benefit from more collaboration opportunities?"',
          '"Tuesday is a meeting marathon for the team. Would staggering some meetings to Thursday help create more focus time?"',
        ],
      },
    },
  },
];

export const MOCK_MODULES = MODULES_1ON1;

export const MOCK_MODULES_BY_AGENT: Record<string, ContentModule[]> = {
  "agent-1on1": MODULES_1ON1,
  "agent-executive": MODULES_EXECUTIVE,
  "agent-recurring": MODULES_RECURRING,
  "agent-team-health": MODULES_TEAM_HEALTH,
};
