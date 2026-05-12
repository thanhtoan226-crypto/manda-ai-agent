"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SessionPanel from "@/components/SessionPanel";
import MainCanvas from "@/components/MainCanvas";
import ChatPanel from "@/components/ChatPanel";
import ScheduleModal from "@/components/ScheduleModal";
import {
  fetchSessions,
  fetchSession,
  createSession,
  pinItem,
  fetchPinned,
  setSessionMode,
  fetchDrillDown,
  fetchReport,
  updateReport,
  streamContent,
} from "@/lib/api";
import { MOCK_MODULES } from "@/lib/mock-content";
import type {
  SessionSummary,
  SessionDetail,
  ContentModule,
  ChatMessage,
  Report,
} from "@/types/session";

function WorkbenchContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");

  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionDetail, setSessionDetail] = useState<SessionDetail | null>(null);
  const [modules, setModules] = useState<ContentModule[]>([]);
  const [excludedItemIds, setExcludedItemIds] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [report, setReport] = useState<Report | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load sessions + create a new one if coming from agent card
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // Fetch existing sessions for sidebar
        const res = await fetchSessions(agentId || undefined);
        if (cancelled) return;
        const existing = res.sessions ?? [];
        setSessions(existing);

        if (agentId) {
          // Coming from "Run" button — always create a fresh session
          try {
            const detail = await createSession(agentId);
            if (cancelled) return;
            const summary: SessionSummary = {
              id: detail.id,
              agent_id: detail.agent_id,
              title: detail.title,
              created_at: detail.created_at,
              updated_at: detail.updated_at,
              preview: detail.preview,
              mode: detail.mode,
            };
            setActiveSessionId(detail.id);
            setSessions([summary, ...existing]);
            setModules([]);
            setMessages([]);
            setExcludedItemIds(new Set());
          } catch {
            // API create failed — use mock
            if (cancelled) return;
            setUseMock(true);
            const mockSession: SessionSummary = {
              id: `mock-session-${Date.now()}`,
              agent_id: agentId,
              title: "New Session",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              preview: "",
              mode: null,
            };
            setActiveSessionId(mockSession.id);
            setSessions([mockSession, ...existing]);
            setModules([]);
            setMessages([]);
            setExcludedItemIds(new Set());
          }
        } else {
          // No agentId — just show existing sessions, pick first if any
          if (existing.length > 0) {
            setActiveSessionId(existing[0].id);
          }
        }
      } catch {
        // API unavailable — use mock
        if (cancelled) return;
        setUseMock(true);
        const mockSession: SessionSummary = {
          id: `mock-session-${Date.now()}`,
          agent_id: agentId || "",
          title: "New Session",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          preview: "",
          mode: null,
        };
        setActiveSessionId(mockSession.id);
        setSessions([mockSession]);
        setModules([]);
        setMessages([]);
        setExcludedItemIds(new Set());
      }
      setInitialized(true);
    }

    init();
    return () => { cancelled = true; };
  }, [agentId]);

  // Load active session detail (skip if using mock or session has no mode)
  useEffect(() => {
    if (!activeSessionId || useMock) return;
    fetchSession(activeSessionId)
      .then((detail) => {
        setSessionDetail(detail);
        // Only load modules if session already has a mode (existing content)
        if (detail.mode) {
          setModules(detail.modules ?? []);
        } else {
          setModules([]);
        }
        setMessages(detail.messages ?? []);
      })
      .catch(console.error);
    fetchReport(activeSessionId)
      .then(setReport)
      .catch(console.error);
  }, [activeSessionId, useMock]);

  const handleNewSession = useCallback(async () => {
    if (useMock) {
      const newMock: SessionSummary = {
        id: `mock-session-${Date.now()}`,
        agent_id: agentId || "agent-1on1",
        title: "New Session",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        preview: "",
        mode: null,
      };
      setActiveSessionId(newMock.id);
      setSessions((prev) => [newMock, ...prev]);
      setModules([]);
      setMessages([]);
      setExcludedItemIds(new Set());
      setSessionDetail(null);
      return;
    }
    try {
      const detail = await createSession(agentId || "agent-1on1");
      setActiveSessionId(detail.id);
      setSessions((prev) => [
        {
          id: detail.id,
          agent_id: detail.agent_id,
          title: detail.title,
          created_at: detail.created_at,
          updated_at: detail.updated_at,
          preview: detail.preview,
          mode: detail.mode,
        },
        ...prev,
      ]);
      setModules([]);
      setMessages([]);
      setExcludedItemIds(new Set());
      setSessionDetail(null);
    } catch (e) {
      console.error(e);
    }
  }, [agentId, useMock]);

  const handleSelectSession = useCallback((id: string) => {
    setActiveSessionId(id);
  }, []);

  const handleSetMode = useCallback(
    async (mode: string) => {
      if (useMock) {
        setSessionDetail((prev) =>
          prev ? { ...prev, mode } : { id: `mock-session-${Date.now()}`, agent_id: agentId || "", title: "New Session", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), preview: "", mode, modules: [], messages: [] }
        );
        setSessions((prev) =>
          prev.map((s) => s.id === activeSessionId ? { ...s, mode } : s)
        );
        setModules([]);
        setExcludedItemIds(new Set());
        await new Promise((r) => setTimeout(r, 1500));
        setModules(MOCK_MODULES);
        return;
      }

      if (!activeSessionId) return;
      try {
        await setSessionMode(activeSessionId, mode);
        setSessionDetail((prev) => prev ? { ...prev, mode } : null);
        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, mode } : s))
        );
        setModules([]);
        setExcludedItemIds(new Set());
        await streamContent(activeSessionId, mode, (chunk) => {
          if (chunk.type === "module" && chunk.module) {
            setModules((prev) => [...prev, chunk.module as ContentModule]);
          }
        });
        const detail = await fetchSession(activeSessionId);
        setModules(detail.modules ?? []);
      } catch (e) {
        console.error(e);
        // Fallback to mock content if streaming fails
        setSessionDetail((prev) =>
          prev ? { ...prev, mode } : null
        );
        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, mode } : s))
        );
        setModules(MOCK_MODULES);
      }
    },
    [activeSessionId, agentId, useMock]
  );

  const handleToggleUnpin = useCallback((itemId: string) => {
    setExcludedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleDrillDown = useCallback(async (chipId: string): Promise<string> => {
    if (useMock) {
      await new Promise((r) => setTimeout(r, 800));
      return `Drill-down data for ${chipId}:\n\n- Raw data source: Meeting analytics + email metadata\n- Time period: Last 30 days\n- Confidence level: 89%\n- Data points analyzed: 234\n- Last updated: ${new Date().toLocaleString()}`;
    }
    const result = await fetchDrillDown(chipId);
    return result.content;
  }, [useMock]);

  const handleAskQuestion = useCallback(
    async (chipId: string, chipLabel: string, question: string) => {
      const userMsg: ChatMessage = {
        id: `msg-ask-${Date.now()}`,
        role: "user",
        content: `[${chipLabel}] ${question}`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);

      await new Promise((r) => setTimeout(r, 1200));

      const MOCK_ANSWERS: Record<string, string> = {
        "chip-strengths": "Based on the analysis, the key driver behind these strengths is the consistent investment in strategic alignment through Q4 Planning sessions, combined with a 100% 1-on-1 adherence rate. The data shows Chris's meetings with highest intent-to-alignment ratio are the ones he organizes himself, indicating strong meeting design skills.",
        "chip-patterns": "The primary driver of this pattern is the 34% increase in reactive ad-hoc meetings over the quarter. These sessions, while individually low-cost, accumulate to consume 5 hours/week and have the lowest alignment scores. The pattern suggests Chris may be acting as a de facto escalation point, which could be addressed through delegation or structured office hours.",
        "chip-meetings": "The meetings Chris organizes reveal a strategic focus — Q4 Planning and 1-on-1s have high alignment scores. However, the Urgent Ad-hoc sessions (5 hrs/week) represent a reactive pattern with low alignment. Consider: 1) Capping ad-hoc sessions at 2 hrs/week, 2) Converting recurring ad-hocs to scheduled blocks, 3) Delegating response ownership for urgent items.",
        "chip-starters": "Here are suggested discussion approaches:\n\n1. Meeting load awareness: \"I noticed you're spending 25 hours in meetings vs. the team median of 15. Let's explore which ones are giving you the most leverage.\"\n\n2. Deep work protection: \"Your deep work time has dropped to 4 hours. What would an ideal week look like if we protected 8-10 hours?\"\n\n3. Ad-hoc meeting strategy: \"38% of your meetings are reactive ad-hocs. Could we set up structured office hours to handle these more efficiently?\"",
        "chip-data": "The data interpretation covers the last 30 days of meeting analytics, cross-referenced with peer benchmarks (team of 8 engineering managers). Key statistical highlights: meeting hours at 83rd percentile, deep work hours at 12th percentile, 1-on-1 coverage at 100% vs. 75% team average.",
      };

      const answer = MOCK_ANSWERS[chipId] || "Based on the analysis, this observation is supported by multiple data points from the last 30 days. The trend correlates with a shift in meeting patterns that favors responsiveness over focused work time. Implementing structured deep-work blocks and meeting budgets could improve the balance between strategic and reactive time allocation.";

      const assistantMsg: ChatMessage = {
        id: `msg-ask-reply-${Date.now()}`,
        role: "assistant",
        content: answer,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    },
    []
  );

  const handleUpdateReport = useCallback(
    async (markdown: string) => {
      if (useMock) return;
      if (!activeSessionId) return;
      try {
        const updated = await updateReport(activeSessionId, markdown);
        setReport(updated);
      } catch (e) {
        console.error(e);
      }
    },
    [activeSessionId, useMock]
  );

  const handleApplyToReport = useCallback(
    async (content: string) => {
      // Chat "Apply to report" — handled via excludedItemIds in the new model
      // For chat suggestions, they're always included (no exclusion tracking)
      // This is a no-op in the new model since all content is included by default
    },
    [activeSessionId, useMock]
  );

  const activeMode = sessionDetail?.mode || sessions.find((s) => s.id === activeSessionId)?.mode || null;
  const sessionTitle = sessionDetail?.title || sessions.find((s) => s.id === activeSessionId)?.title || "Workbench";

  if (!initialized) {
    return <div className="flex items-center justify-center h-full text-slate-400">Loading...</div>;
  }

  return (
    <div className="flex h-full min-h-0">
      <SessionPanel
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={handleSelectSession}
        onNewSession={handleNewSession}
      />
      <MainCanvas
        sessionTitle={sessionTitle}
        sessionId={activeSessionId || ""}
        agentName=""
        mode={activeMode}
        modules={modules}
        excludedItemIds={excludedItemIds}
        onSetMode={handleSetMode}
        onToggleUnpin={handleToggleUnpin}
        onDrillDown={handleDrillDown}
        reportMarkdown={report?.markdown || ""}
        onUpdateReport={handleUpdateReport}
        onOpenSchedule={() => setScheduleOpen(true)}
        onAskQuestion={handleAskQuestion}
      />
      <ChatPanel
        sessionId={activeSessionId || ""}
        mode={activeMode}
        messages={messages}
        onMessagesUpdate={setMessages}
        onApplyToReport={handleApplyToReport}
      />
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        sessionId={activeSessionId || ""}
      />
    </div>
  );
}

export default function WorkbenchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-slate-400">Loading...</div>}>
      <WorkbenchContent />
    </Suspense>
  );
}
