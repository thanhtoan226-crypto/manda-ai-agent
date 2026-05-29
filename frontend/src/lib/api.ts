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
import type { PulseReport, ReportStatus } from "@/types/pulse";
import type {
  LearningModuleListResponse,
  LearningModule,
  TopicContent,
  TopicMeta,
  LearningProgressSummary,
} from "@/types/learning";

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
  try {
    return await apiFetch<AgentDetailResponse>(`/agents/${agentId}`);
  } catch {
    const { MOCK_AGENTS } = await import("@/lib/mock-agents");
    const agent = MOCK_AGENTS.find((a) => a.id === agentId);
    if (!agent) throw new Error(`Agent ${agentId} not found`);
    return { agent, modes: [] };
  }
}

export async function toggleFavorite(agentId: string): Promise<AgentListResponse["agents"][0]> {
  try {
    return await apiFetch(`/agents/${agentId}/favorite`, { method: "PUT" });
  } catch {
    const { MOCK_AGENTS } = await import("@/lib/mock-agents");
    const agent = MOCK_AGENTS.find((a) => a.id === agentId);
    if (agent) agent.is_favorite = !agent.is_favorite;
    return agent!;
  }
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

export async function fetchDrillDown(sessionId: string, chipId: string): Promise<{ content: string }> {
  return apiFetch(`/sessions/${sessionId}/drill-down?chip_id=${chipId}`);
}

// Reports
export async function fetchReport(sessionId: string): Promise<Report> {
  return apiFetch<Report>(`/reports/${sessionId}`);
}

export async function applyChatToReport(sessionId: string, content: string): Promise<void> {
  await apiFetch(`/sessions/${sessionId}/apply-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
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

// Pulse Reports
export async function fetchPulseReports(filters?: {
  status?: string;
  category?: string;
  time_frame?: string;
}): Promise<{ reports: PulseReport[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.category) params.set("category", filters.category);
    if (filters?.time_frame) params.set("time_frame", filters.time_frame);
    const qs = params.toString() ? `?${params.toString()}` : "";
    return await apiFetch(`/pulse/reports${qs}`);
  } catch {
    const { MOCK_PULSE_REPORTS } = await import("@/lib/mock-pulse-data");
    return { reports: MOCK_PULSE_REPORTS, total: MOCK_PULSE_REPORTS.length };
  }
}

export async function fetchPulseReport(reportId: string): Promise<PulseReport | null> {
  try {
    return await apiFetch(`/pulse/reports/${reportId}`);
  } catch {
    const { MOCK_PULSE_REPORTS } = await import("@/lib/mock-pulse-data");
    return MOCK_PULSE_REPORTS.find((r) => r.id === reportId) || null;
  }
}

export async function updatePulseReportStatus(
  reportId: string,
  status: ReportStatus | string
): Promise<PulseReport | null> {
  try {
    return await apiFetch(`/pulse/reports/${reportId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  } catch {
    const { MOCK_PULSE_REPORTS } = await import("@/lib/mock-pulse-data");
    const report = MOCK_PULSE_REPORTS.find((r) => r.id === reportId);
    if (report) report.status = status as ReportStatus;
    return report ?? null;
  }
}

// Learning
export async function fetchLearningModules(): Promise<LearningModuleListResponse> {
  try {
    return await apiFetch<LearningModuleListResponse>("/learning/modules");
  } catch {
    const { MOCK_LEARNING_MODULES } = await import("@/lib/mock-learning-data");
    const total = MOCK_LEARNING_MODULES.reduce((s, m) => s + m.topics.length, 0);
    const done = MOCK_LEARNING_MODULES.reduce(
      (s, m) => s + m.topics.filter((t) => t.completed).length,
      0
    );
    return {
      modules: MOCK_LEARNING_MODULES,
      overall_progress_percent: total ? Math.round((done / total) * 100) : 0,
    };
  }
}

export async function fetchLearningModule(moduleId: string): Promise<LearningModule | null> {
  try {
    return await apiFetch<LearningModule>(`/learning/modules/${moduleId}`);
  } catch {
    const { MOCK_LEARNING_MODULES } = await import("@/lib/mock-learning-data");
    return MOCK_LEARNING_MODULES.find((m) => m.id === moduleId) || null;
  }
}

export async function fetchTopicContent(
  moduleId: string,
  topicId: string
): Promise<TopicContent | null> {
  try {
    return await apiFetch<TopicContent>(`/learning/modules/${moduleId}/topics/${topicId}`);
  } catch {
    const { MOCK_LEARNING_MODULES } = await import("@/lib/mock-learning-data");
    const mod = MOCK_LEARNING_MODULES.find((m) => m.id === moduleId);
    const topic = mod?.topics.find((t) => t.id === topicId);
    if (!mod || !topic) return null;
    return {
      topic_id: topic.id,
      title: topic.title,
      module_id: mod.id,
      module_title: mod.title,
      markdown: `# ${topic.title}\n\nContent requires backend connection.`,
      completed: topic.completed,
      estimated_minutes: topic.estimated_minutes,
    };
  }
}

export async function updateTopicProgress(
  moduleId: string,
  topicId: string,
  completed: boolean
): Promise<TopicMeta | null> {
  try {
    return await apiFetch(`/learning/modules/${moduleId}/topics/${topicId}/progress`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
  } catch {
    const { MOCK_LEARNING_MODULES } = await import("@/lib/mock-learning-data");
    for (const mod of MOCK_LEARNING_MODULES) {
      const topic = mod.topics.find((t) => t.id === topicId);
      if (topic) {
        topic.completed = completed;
        return topic;
      }
    }
    return null;
  }
}

export async function fetchLearningProgress(): Promise<LearningProgressSummary> {
  try {
    return await apiFetch<LearningProgressSummary>("/learning/progress");
  } catch {
    const { MOCK_LEARNING_MODULES } = await import("@/lib/mock-learning-data");
    const total = MOCK_LEARNING_MODULES.reduce((s, m) => s + m.topics.length, 0);
    const completed = MOCK_LEARNING_MODULES.reduce(
      (s, m) => s + m.topics.filter((t) => t.completed).length,
      0
    );
    return {
      total_topics: total,
      completed_topics: completed,
      overall_percent: total ? Math.round((completed / total) * 100) : 0,
      modules: MOCK_LEARNING_MODULES.map((m) => ({
        module_id: m.id,
        module_title: m.title,
        completed: m.topics.filter((t) => t.completed).length,
        total: m.topics.length,
        progress_percent: m.topics.length
          ? Math.round((m.topics.filter((t) => t.completed).length / m.topics.length) * 100)
          : 0,
      })),
    };
  }
}

// Learning Chat
export async function streamLearningChat(
  message: string,
  moduleId?: string,
  topicId?: string,
  onChunk?: (data: { type: string; content?: string }) => void
): Promise<void> {
  const res = await fetch(`${API_BASE}/learning/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, module_id: moduleId, topic_id: topicId }),
  });
  await consumeSSE(res, (data) => {
    onChunk?.(data as { type: string; content?: string });
  });
}
