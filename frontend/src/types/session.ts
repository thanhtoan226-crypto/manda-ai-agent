export interface SessionSummary {
  id: string;
  agent_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  preview: string;
  mode: string | null;
}

export interface SessionListResponse {
  sessions: SessionSummary[];
}

export interface ChipInfo {
  id: string;
  label: string;
  enabled: boolean;
  disabled: boolean;
}

export interface ContentModule {
  id: string;
  title: string;
  chips: ChipInfo[];
  content: Record<string, unknown>;
}

export interface SessionDetail {
  id: string;
  agent_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  preview: string;
  mode: string | null;
  modules: ContentModule[];
  messages: ChatMessage[];
}

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface PinnedItem {
  id: string;
  module_id: string;
  chip_id: string;
  title: string;
  content: string;
}

export interface Report {
  session_id: string;
  title: string;
  markdown: string;
  updated_at: string;
}

export interface ScheduleConfig {
  frequency: string;
  day_of_week: string | null;
  time: string;
  minutes_before: number | null;
  recipients: string;
}
