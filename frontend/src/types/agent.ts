export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  purpose?: string;
  tags?: string[];
  integrations?: string[];
  is_favorite: boolean;
  usage_count: number;
  last_used: string | null;
  last_generated?: string | null;
}

export interface AgentListResponse {
  agents: Agent[];
}

export interface ConversationMode {
  id: string;
  label: string;
  description: string;
}

export interface AgentDetailResponse {
  agent: Agent;
  modes: ConversationMode[];
}

export const AGENT_CATEGORIES = [
  "People Management",
  "Leadership & Strategy",
  "Productivity & Efficiency",
] as const;

export type AgentCategory = (typeof AGENT_CATEGORIES)[number];
