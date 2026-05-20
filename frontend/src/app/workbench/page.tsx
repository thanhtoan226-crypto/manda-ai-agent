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
        agent_id: agentId || "agent-listing",
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
      const detail = await createSession(agentId || "agent-listing");
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
      return `Drill-down data for ${chipId}:\n\n- Raw data source: MLS + CRM transaction data\n- Time period: Last 30 days\n- Confidence level: 92%\n- Data points analyzed: 347\n- Last updated: ${new Date().toLocaleString()}`;
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
        "chip-strengths": "Based on the analysis, the key driver behind these strengths is Sarah's exceptional pricing strategy combined with her client communication discipline. Her list-to-close ratio of 98.2% comes from accurate initial pricing that minimizes negotiation rounds, while her client satisfaction scores reflect a proactive communication approach where she updates clients even when there's no new development.",
        "chip-patterns": "The primary driver of the March conversion dip was the 40% spike in new listings without a corresponding increase in follow-up capacity. Sarah was managing 15 active listings during the spring surge, well above her optimal 8-10 range. The data shows conversion efficiency drops sharply above 10 active listings, suggesting a capacity ceiling that could be addressed through a showing assistant or transaction coordinator.",
        "chip-meetings": "Sarah's active deals reveal a strategic focus on single-family homes, which command higher commissions but take longer to close. The 142 Oak Ridge Dr negotiation has been ongoing for 12 days with a $15K gap — consider proposing a creative compromise such as including closing cost credits. The Harbor View listing at $892K has had only 3 showings in 21 days, suggesting it may be priced above the current market ceiling for the neighborhood.",
        "chip-starters": "Here are suggested discussion approaches:\n\n1. Pipeline optimization: \"Your pipeline is strong at $2.84M, but the single-family concentration creates longer close cycles. Would shifting 20% of focus to condos improve cash flow velocity?\"\n\n2. Inspection fallout: \"Two deals fell through during inspection contingency in March. Have you considered recommending pre-listing inspections to reduce buyer surprise?\"\n\n3. Showing strategy: \"Your weekday showings convert 3x better than weekend open houses. What if we made weekday private showings the priority and used weekends purely for lead generation?\"",
        "chip-data": "The data interpretation covers the last 30 days of listing and transaction data from MLS and CRM, cross-referenced with peer benchmarks (team of 12 agents at Horizon Realty Group). Key statistical highlights: closings at 90th percentile, days on market at 15th percentile (lower is better), client satisfaction at 92nd percentile, commission per deal at 78th percentile with volume making up the difference.",
      };

      const answer = MOCK_ANSWERS[chipId] || "Based on the analysis, this observation is supported by multiple data points from the last 30 days of MLS and CRM transaction data. The trend correlates with seasonal market patterns where spring inventory surges create both opportunity and capacity strain. Implementing a structured pipeline management system with clear follow-up cadences could help maintain conversion quality during high-volume periods.";

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
