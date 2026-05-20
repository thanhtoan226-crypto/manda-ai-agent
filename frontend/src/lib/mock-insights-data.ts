import type {
  FilterOptions,
  HoursOverTimePoint,
  HoursByPoint,
  RecurringVsAdhoc,
  MeetingSizeDistribution,
  MeetingDurationDistribution,
  AcceptanceBySize,
  OrganiserRow,
  QualityOverTimePoint,
  RecurringVsAdhocQuality,
} from "@/types/insights";

// ─── Filter Options (REA Group style) ───────────────────────────────────────

export const FILTER_OPTIONS: FilterOptions = {
  companies: ["REA Group", "Realestate.com.au", "RealCommercial.com.au", "Mortgage Choice", "Hometrack Australia"],
  countries: ["Australia", "New Zealand", "Singapore", "India"],
  roles: ["CEO", "CFO", "CTO", "VP", "Director", "Head of", "Senior Manager", "Manager", "Team Lead", "Senior", "Mid-Level", "Junior"],
  teams: [
    "Property Search", "Consumer Product", "Agent Platform", "Data Platform",
    "Revenue & Billing", "Brand & Creative", "People Partners", "Finance Ops",
    "Legal & Risk", "Growth & Acquisition",
  ],
  departments: [
    "Product & Design", "Engineering", "Sales & Partnerships",
    "Marketing", "Finance", "People & Culture",
    "Legal & Compliance", "Data & Analytics",
  ],
  employees: [
    "Sarah Chen", "James Mitchell", "Priya Sharma", "Liam O'Brien",
    "Emily Watson", "Raj Patel", "Megan Thompson", "David Liu",
    "Jessica Brown", "Tom Anderson", "Aisha Mohamed", "Chris Taylor",
    "Natasha Petrov", "Ben Harper", "Zoe Williams", "Marcus Nguyen",
    "Hannah Scott", "Daniel Kim", "Olivia Jones", "Ryan Kapoor",
  ],
};

// ─── Time in Meetings ───────────────────────────────────────────────────────

export const TIME_IN_MEETINGS_METRICS = {
  totalEmployeeCost: 2847500,
  totalEmployeeHours: 12480,
  totalMeetings: 18640,
  percentEmployeeTime: 34.2,
};

export const HOURS_OVER_TIME: HoursOverTimePoint[] = [
  { period: "Jul 2025", recurring: 680, adhoc: 290 },
  { period: "Aug 2025", recurring: 710, adhoc: 310 },
  { period: "Sep 2025", recurring: 695, adhoc: 285 },
  { period: "Oct 2025", recurring: 740, adhoc: 330 },
  { period: "Nov 2025", recurring: 760, adhoc: 345 },
  { period: "Dec 2025", recurring: 620, adhoc: 260 },
  { period: "Jan 2026", recurring: 700, adhoc: 300 },
  { period: "Feb 2026", recurring: 730, adhoc: 320 },
  { period: "Mar 2026", recurring: 755, adhoc: 335 },
  { period: "Apr 2026", recurring: 770, adhoc: 350 },
  { period: "May 2026", recurring: 785, adhoc: 360 },
];

export const HOURS_BY_DAY: HoursByPoint[] = [
  { label: "Mon", value: 2840 },
  { label: "Tue", value: 3120 },
  { label: "Wed", value: 2960 },
  { label: "Thu", value: 2680 },
  { label: "Fri", value: 1820 },
];

export const HOURS_BY_HOUR: HoursByPoint[] = [
  { label: "7am", value: 120 },
  { label: "8am", value: 580 },
  { label: "9am", value: 1240 },
  { label: "10am", value: 1860 },
  { label: "11am", value: 1680 },
  { label: "12pm", value: 520 },
  { label: "1pm", value: 960 },
  { label: "2pm", value: 1740 },
  { label: "3pm", value: 1560 },
  { label: "4pm", value: 1320 },
  { label: "5pm", value: 640 },
  { label: "6pm", value: 160 },
];

export const RECURRING_VS_ADHOC: RecurringVsAdhoc = {
  recurring: 7245,
  adhoc: 5235,
};

// ─── Meeting Effectiveness — Size & Adoption ────────────────────────────────

export const SIZE_ADOPTION_METRICS = {
  largeMeetingCost: 892400,
  largeMeetingPctMeetings: 28.4,
  largeMeetingPctEmployeeTime: 41.6,
  speedyAdoption: 62.3,
  responseRate: 74.8,
};

export const LARGE_MEETINGS_OVER_TIME: HoursOverTimePoint[] = [
  { period: "Jul 2025", recurring: 420, adhoc: 180 },
  { period: "Aug 2025", recurring: 445, adhoc: 195 },
  { period: "Sep 2025", recurring: 430, adhoc: 170 },
  { period: "Oct 2025", recurring: 460, adhoc: 210 },
  { period: "Nov 2025", recurring: 475, adhoc: 220 },
  { period: "Dec 2025", recurring: 380, adhoc: 160 },
  { period: "Jan 2026", recurring: 440, adhoc: 190 },
  { period: "Feb 2026", recurring: 455, adhoc: 200 },
  { period: "Mar 2026", recurring: 470, adhoc: 215 },
  { period: "Apr 2026", recurring: 480, adhoc: 225 },
  { period: "May 2026", recurring: 495, adhoc: 230 },
];

export const MEETINGS_BY_SIZE: MeetingSizeDistribution[] = [
  { size: "1-on-1", count: 6420 },
  { size: "2–4", count: 5840 },
  { size: "5–8", count: 3860 },
  { size: "9–15", count: 1640 },
  { size: "16–30", count: 620 },
  { size: "30+", count: 260 },
];

export const MEETINGS_BY_DURATION: MeetingDurationDistribution[] = [
  { duration: "15 min", count: 4280 },
  { duration: "30 min", count: 6820 },
  { duration: "45 min", count: 2140 },
  { duration: "60 min", count: 3960 },
  { duration: "90+ min", count: 1440 },
];

export const ACCEPTANCE_BY_SIZE: AcceptanceBySize[] = [
  { size: "1-on-1", accepted: 88, declined: 5, noResponse: 7 },
  { size: "2–4", accepted: 82, declined: 8, noResponse: 10 },
  { size: "5–8", accepted: 74, declined: 12, noResponse: 14 },
  { size: "9–15", accepted: 65, declined: 18, noResponse: 17 },
  { size: "16–30", accepted: 58, declined: 22, noResponse: 20 },
  { size: "30+", accepted: 52, declined: 26, noResponse: 22 },
];

export const ORGANISERS_TABLE: OrganiserRow[] = [
  { organiser: "Sarah Chen", company: "REA Group", totalMeetings: 142, totalHours: 186, totalCost: 42400, avgAcceptanceRate: 88 },
  { organiser: "James Mitchell", company: "Realestate.com.au", totalMeetings: 128, totalHours: 164, totalCost: 37200, avgAcceptanceRate: 85 },
  { organiser: "Priya Sharma", company: "REA Group", totalMeetings: 115, totalHours: 152, totalCost: 34800, avgAcceptanceRate: 82 },
  { organiser: "Liam O'Brien", company: "RealCommercial.com.au", totalMeetings: 108, totalHours: 140, totalCost: 31600, avgAcceptanceRate: 79 },
  { organiser: "Emily Watson", company: "REA Group", totalMeetings: 96, totalHours: 124, totalCost: 28200, avgAcceptanceRate: 84 },
  { organiser: "Raj Patel", company: "Mortgage Choice", totalMeetings: 92, totalHours: 118, totalCost: 26800, avgAcceptanceRate: 76 },
  { organiser: "Megan Thompson", company: "Realestate.com.au", totalMeetings: 88, totalHours: 112, totalCost: 25400, avgAcceptanceRate: 81 },
  { organiser: "David Liu", company: "Hometrack Australia", totalMeetings: 84, totalHours: 108, totalCost: 24600, avgAcceptanceRate: 78 },
];

// ─── Meeting Effectiveness — Quality ────────────────────────────────────────

export const QUALITY_METRICS = {
  qualityScore: 67.4,
  agendaUsage: 58.2,
  desiredOutcomes: 44.8,
  hasPurpose: 72.6,
  contextClarity: 51.3,
};

export const QUALITY_OVER_TIME: QualityOverTimePoint[] = [
  { period: "Jul 2025", qualityScore: 62.1, agendaUsage: 52.4, desiredOutcomes: 40.2, hasPurpose: 68.4, contextClarity: 46.8 },
  { period: "Aug 2025", qualityScore: 63.5, agendaUsage: 53.8, desiredOutcomes: 41.6, hasPurpose: 69.2, contextClarity: 48.2 },
  { period: "Sep 2025", qualityScore: 64.2, agendaUsage: 54.6, desiredOutcomes: 42.1, hasPurpose: 70.0, contextClarity: 49.0 },
  { period: "Oct 2025", qualityScore: 65.0, agendaUsage: 55.8, desiredOutcomes: 43.0, hasPurpose: 70.8, contextClarity: 49.8 },
  { period: "Nov 2025", qualityScore: 65.8, agendaUsage: 56.4, desiredOutcomes: 43.6, hasPurpose: 71.4, contextClarity: 50.4 },
  { period: "Dec 2025", qualityScore: 64.6, agendaUsage: 55.0, desiredOutcomes: 42.4, hasPurpose: 70.2, contextClarity: 49.2 },
  { period: "Jan 2026", qualityScore: 65.4, agendaUsage: 56.2, desiredOutcomes: 43.2, hasPurpose: 71.0, contextClarity: 50.0 },
  { period: "Feb 2026", qualityScore: 66.2, agendaUsage: 57.0, desiredOutcomes: 43.8, hasPurpose: 71.8, contextClarity: 50.8 },
  { period: "Mar 2026", qualityScore: 66.8, agendaUsage: 57.6, desiredOutcomes: 44.2, hasPurpose: 72.2, contextClarity: 51.0 },
  { period: "Apr 2026", qualityScore: 67.0, agendaUsage: 58.0, desiredOutcomes: 44.6, hasPurpose: 72.4, contextClarity: 51.2 },
  { period: "May 2026", qualityScore: 67.4, agendaUsage: 58.2, desiredOutcomes: 44.8, hasPurpose: 72.6, contextClarity: 51.3 },
];

export const RECURRING_VS_ADHOC_QUALITY: RecurringVsAdhocQuality[] = [
  { category: "Quality Score", recurring: 72.8, adhoc: 58.4 },
  { category: "Agenda Usage", recurring: 66.4, adhoc: 44.2 },
  { category: "Desired Outcomes", recurring: 52.6, adhoc: 32.8 },
  { category: "Has Purpose", recurring: 78.2, adhoc: 62.4 },
  { category: "Context Clarity", recurring: 60.8, adhoc: 36.2 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-AU").format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
