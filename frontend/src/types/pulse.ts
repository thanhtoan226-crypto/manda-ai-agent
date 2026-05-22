export type ReportCategory = "People & Culture" | "Meetings" | "Wellness" | "Compliance";
export type ReportStatus = "focus" | "unread" | "archived" | "read";

export interface PulseReport {
  id: string;
  title: string;
  agent_name: string;
  category: ReportCategory;
  status: ReportStatus;
  preview: string;
  markdown: string;
  created_at: string;
  updated_at: string;
}
