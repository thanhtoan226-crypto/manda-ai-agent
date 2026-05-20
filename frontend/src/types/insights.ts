export interface InsightFilter {
  company: string;
  country: string;
  role: string;
  team: string;
  department: string;
  employee: string;
  timeFrame: "day" | "week" | "month" | "quarter" | "year";
}

export interface MetricValue {
  label: string;
  value: string;
  change?: number; // percentage change
  trend?: "up" | "down" | "flat";
}

// Time in Meetings
export interface TimeInMeetingsMetrics {
  totalEmployeeCost: number;
  totalEmployeeHours: number;
  totalMeetings: number;
  percentEmployeeTime: number;
}

export interface HoursOverTimePoint {
  period: string;
  recurring: number;
  adhoc: number;
}

export interface HoursByPoint {
  label: string;
  value: number;
}

export interface RecurringVsAdhoc {
  recurring: number;
  adhoc: number;
}

// Meeting Effectiveness — Size & Adoption
export interface SizeAdoptionMetrics {
  largeMeetingCost: number;
  largeMeetingPctMeetings: number;
  largeMeetingPctEmployeeTime: number;
  speedyAdoption: number;
  responseRate: number;
}

export interface MeetingSizeDistribution {
  size: string;
  count: number;
}

export interface MeetingDurationDistribution {
  duration: string;
  count: number;
}

export interface AcceptanceBySize {
  size: string;
  accepted: number;
  declined: number;
  noResponse: number;
}

export interface OrganiserRow {
  organiser: string;
  company: string;
  totalMeetings: number;
  totalHours: number;
  totalCost: number;
  avgAcceptanceRate: number;
}

// Meeting Effectiveness — Quality
export interface QualityMetrics {
  qualityScore: number;
  agendaUsage: number;
  desiredOutcomes: number;
  hasPurpose: number;
  contextClarity: number;
}

export interface QualityOverTimePoint {
  period: string;
  qualityScore: number;
  agendaUsage: number;
  desiredOutcomes: number;
  hasPurpose: number;
  contextClarity: number;
}

export interface RecurringVsAdhocQuality {
  category: string;
  recurring: number;
  adhoc: number;
}

// Filter options
export interface FilterOptions {
  companies: string[];
  countries: string[];
  roles: string[];
  teams: string[];
  departments: string[];
  employees: string[];
}
