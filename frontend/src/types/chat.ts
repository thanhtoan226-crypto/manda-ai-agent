import type { ChatMessage } from "./session";

export type { ChatMessage };

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  agent_id?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  conversation_id: string;
}
