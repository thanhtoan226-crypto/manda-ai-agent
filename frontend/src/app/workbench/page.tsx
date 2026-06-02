"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SessionPanel from "@/components/SessionPanel";
import MainCanvas from "@/components/MainCanvas";
import ScheduleModal from "@/components/ScheduleModal";
import {
  fetchSessions,
  fetchSession,
  createSession,
  setSessionMode,
  fetchDrillDown,
  fetchReport,
  updateReport,
  streamContent,
  streamChat,
  applyChatToReport,
} from "@/lib/api";
import { MOCK_MODULES_BY_AGENT, MOCK_MODULES, personalizeModules } from "@/lib/mock-content";
import type {
  SessionSummary,
  SessionDetail,
  ContentModule,
  ChatMessage,
  Report,
} from "@/types/session";

function WorkbenchContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId") || "agent-1on1";

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
  const [toast, setToast] = useState<string | null>(null);
  const [sessionCollapsed, setSessionCollapsed] = useState(true);

  const activeMode = sessionDetail?.mode || sessions.find((s) => s.id === activeSessionId)?.mode || null;
  const sessionTitle = sessionDetail?.title || sessions.find((s) => s.id === activeSessionId)?.title || "Workbench";

  // Load sessions + create a new one if coming from agent card
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const res = await fetchSessions(agentId || undefined);
        if (cancelled) return;
        const existing = res.sessions ?? [];
        setSessions(existing);

        if (agentId) {
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
          if (existing.length > 0) {
            setActiveSessionId(existing[0].id);
          }
        }
      } catch {
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

  // Load active session detail
  useEffect(() => {
    if (!activeSessionId || useMock) return;
    fetchSession(activeSessionId)
      .then((detail) => {
        setSessionDetail(detail);
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
        agent_id: agentId,
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
      const detail = await createSession(agentId);
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
    async (mode: string, subject?: string | null) => {
      const agentModules = MOCK_MODULES_BY_AGENT[agentId] || MOCK_MODULES;

      if (useMock) {
        setSessionDetail((prev) =>
          prev ? { ...prev, mode } : { id: `mock-session-${Date.now()}`, agent_id: agentId, title: "New Session", created_at: new Date().toISOString(), updated_at: new Date().toISOString(), preview: "", mode, modules: [], messages: [] }
        );
        setSessions((prev) =>
          prev.map((s) => s.id === activeSessionId ? { ...s, mode } : s)
        );
        setModules([]);
        setExcludedItemIds(new Set());
        await new Promise((r) => setTimeout(r, 1500));
        setModules(subject ? personalizeModules(agentModules, subject) : agentModules);
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
        }, subject);
        const detail = await fetchSession(activeSessionId);
        setModules(detail.modules ?? []);
      } catch (e) {
        console.error(e);
        setSessionDetail((prev) => prev ? { ...prev, mode } : null);
        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, mode } : s))
        );
        setModules(subject ? personalizeModules(agentModules, subject) : agentModules);
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
      return `Drill-down data for ${chipId}:\n\n- Raw data source: Calendar integration data\n- Time period: Last 30 days\n- Confidence level: 92%\n- Data points analyzed: 347\n- Last updated: ${new Date().toLocaleString()}`;
    }
    const result = await fetchDrillDown(activeSessionId || "0", chipId);
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

      if (useMock || !activeSessionId) {
        await new Promise((r) => setTimeout(r, 1200));
        const assistantMsg: ChatMessage = {
          id: `msg-ask-reply-${Date.now()}`,
          role: "assistant",
          content: `Based on the analysis of ${chipLabel.toLowerCase()}, this observation is supported by multiple data points from the last 30 days of calendar and meeting data. I recommend reviewing the specific metrics in the Data Interpreter section for detailed numbers and trends.`,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        return;
      }

      const assistantId = `msg-ask-reply-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      try {
        await streamChat(activeSessionId, `[${chipLabel}] ${question}`, activeMode || undefined, (chunk) => {
          if (chunk.type === "text" && chunk.content) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk.content }
                  : m
              )
            );
          }
        });
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content || "[Error: Could not get response]" }
              : m
          )
        );
      }
    },
    [agentId, activeSessionId, activeMode, useMock]
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
      if (useMock) {
        setReport((prev) =>
          prev
            ? { ...prev, markdown: prev.markdown + "\n\n" + content }
            : null
        );
        setToast("Report updated");
        setTimeout(() => setToast(null), 3000);
        return;
      }
      if (!activeSessionId) return;
      try {
        await applyChatToReport(activeSessionId, content);
        const updated = await fetchReport(activeSessionId);
        setReport(updated);
        setToast("Report updated");
        setTimeout(() => setToast(null), 3000);
      } catch (e) {
        console.error(e);
      }
    },
    [activeSessionId, useMock]
  );

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
        collapsed={sessionCollapsed}
        onToggleCollapse={() => setSessionCollapsed(!sessionCollapsed)}
      />
      <MainCanvas
        sessionTitle={sessionTitle}
        sessionId={activeSessionId || ""}
        agentId={agentId}
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
        chatMessages={messages}
        onChatMessagesUpdate={setMessages}
        onApplyToReport={handleApplyToReport}
        showToast={(msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); }}
      />
      <ScheduleModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        sessionId={activeSessionId || ""}
      />
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0a3542] text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50 animate-in fade-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
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
