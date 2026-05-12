export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  agent_id?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  conversation_id: string;
}
