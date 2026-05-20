export interface PulseReport {
  id: string;
  title: string;
  agent_name: string;
  category: string;
  status: "focus" | "unread" | "archived" | "all";
  preview: string;
  markdown: string;
  created_at: string;
  updated_at: string;
}
