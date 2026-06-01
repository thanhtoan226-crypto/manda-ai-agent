import type { ContentModule } from "./session";

export type ReportCategory = "People & Culture" | "Meetings" | "Wellness" | "Compliance";
export type ReportStatus = "focus" | "unread" | "archived" | "read";

export interface PulseReport {
  id: string;
  title: string;
  agent_name: string;
  agent_id: string;
  category: ReportCategory;
  status: ReportStatus;
  preview: string;
  markdown: string;
  modules: ContentModule[] | null;
  created_at: string;
  updated_at: string;
}
