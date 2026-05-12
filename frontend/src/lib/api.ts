import type {
  AgentListResponse,
  AgentDetailResponse,
} from "@/types/agent";
import type {
  SessionListResponse,
  SessionDetail,
  PinnedItem,
  Report,
  ScheduleConfig,
} from "@/types/session";

const API_BASE = "/api/v1";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Shared SSE consumption helper
async function consumeSSE(
  res: Response,
  onChunk: (data: Record<string, unknown>) => void
): Promise<void> {
  if (!res.ok || !res.body) throw new Error(`API error: ${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          onChunk(data);
          if (data.type === "done") return;
        } catch {
          // Skip malformed SSE data lines
        }
      }
    }
  }

  // Process any remaining buffer
  if (buffer.startsWith("data: ")) {
    try {
      const data = JSON.parse(buffer.slice(6));
      onChunk(data);
    } catch {
      // Skip malformed SSE data lines
    }
  }
}

// Agents
export async function fetchAgents(): Promise<AgentListResponse> {
  try {
    return await apiFetch<AgentListResponse>("/agents/");
  } catch {
    // Fallback to mock data when API is unavailable
    const { MOCK_AGENTS } = await import("@/lib/mock-agents");
    return { agents: MOCK_AGENTS };
  }
}

export async function fetchAgent(agentId: string): Promise<AgentDetailResponse> {
  return apiFetch<AgentDetailResponse>(`/agents/${agentId}`);
}

export async function toggleFavorite(agentId: string): Promise<AgentListResponse["agents"][0]> {
  return apiFetch(`/agents/${agentId}/favorite`, { method: "PUT" });
}

// Sessions
export async function fetchSessions(agentId?: string): Promise<SessionListResponse> {
  const params = agentId ? `?agent_id=${agentId}` : "";
  return apiFetch<SessionListResponse>(`/sessions/${params}`);
}

export async function fetchSession(sessionId: string): Promise<SessionDetail> {
  return apiFetch<SessionDetail>(`/sessions/${sessionId}`);
}

export async function createSession(agentId: string, title?: string): Promise<SessionDetail> {
  return apiFetch<SessionDetail>("/sessions/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agent_id: agentId, title }),
  });
}

export async function pinItem(
  sessionId: string,
  moduleId: string,
  chipId: string,
  title: string,
  content: string
): Promise<PinnedItem | { unpinned: boolean }> {
  return apiFetch(`/sessions/${sessionId}/pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ module_id: moduleId, chip_id: chipId, title, content }),
  });
}

export async function fetchPinned(sessionId: string): Promise<PinnedItem[]> {
  return apiFetch<PinnedItem[]>(`/sessions/${sessionId}/pinned`);
}

export async function setSessionMode(sessionId: string, mode: string): Promise<void> {
  await apiFetch(`/sessions/${sessionId}/mode?mode=${mode}`, { method: "PUT" });
}

export async function fetchDrillDown(chipId: string): Promise<{ content: string }> {
  return apiFetch(`/sessions/0/drill-down?chip_id=${chipId}`);
}

// Reports
export async function fetchReport(sessionId: string): Promise<Report> {
  return apiFetch<Report>(`/reports/${sessionId}`);
}

export async function updateReport(sessionId: string, markdown: string): Promise<Report> {
  return apiFetch<Report>(`/reports/${sessionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown }),
  });
}

// Schedule
export async function createSchedule(
  sessionId: string,
  config: ScheduleConfig
): Promise<unknown> {
  return apiFetch(`/schedule/${sessionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
}

// Chat streaming
export async function streamChat(
  sessionId: string,
  message: string,
  mode?: string,
  onChunk?: (data: { type: string; content?: string; conversation_id?: string }) => void
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId, mode }),
  });
  await consumeSSE(res, (data) => {
    onChunk?.(data as { type: string; content?: string; conversation_id?: string });
  });
}

// Content streaming (when selecting a mode)
export async function streamContent(
  sessionId: string,
  mode: string,
  onChunk?: (data: { type: string; module?: unknown }) => void
): Promise<void> {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/content/stream?mode=${mode}`, {
    method: "POST",
  });
  await consumeSSE(res, (data) => {
    onChunk?.(data as { type: string; module?: unknown });
  });
}
