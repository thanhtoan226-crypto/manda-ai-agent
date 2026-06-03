"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  User,
  Pin,
  Archive,
  Sparkles,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_BORDER_COLORS } from "@/lib/constants";
import {
  fetchPulseReport,
  updatePulseReportStatus,
  updatePulseReportMarkdown,
  streamPulseDrillDown,
  streamPulseVerify,
} from "@/lib/api";
import type { PulseReport, ReportCategory } from "@/types/pulse";
import type { ChatMessage } from "@/types/session";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import PulseModuleView from "@/components/modules/PulseModuleView";
import PulseChatDrawer from "@/components/modules/ChatDrawer";

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = params.reportId as string;
  const fromPage = searchParams.get("from") || "/pulse";

  const [report, setReport] = useState<PulseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [excludedItemIds, setExcludedItemIds] = useState<Set<string>>(new Set());
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [editingReport, setEditingReport] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPulseReport(reportId);
        if (!cancelled) {
          setReport(data);
          if (data) setReportMarkdown(data.markdown);
        }
      } catch {
        if (!cancelled) setError("Unable to load report. Please check your connection and try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  useEffect(() => {
    if (report && report.status === "unread") {
      updatePulseReportStatus(report.id, "read").catch(() => {
        setToast("Failed to mark as read");
        setTimeout(() => setToast(null), 3000);
      });
      setReport((prev) => (prev ? { ...prev, status: "read" } : prev));
    }
  }, [report?.id, report?.status]);

  const handleStatusChange = (status: string) => {
    if (!report) return;
    updatePulseReportStatus(report.id, status).catch(() => {
      setToast("Failed to update status");
      setTimeout(() => setToast(null), 3000);
    });
    setReport((prev) =>
      prev ? { ...prev, status: status as PulseReport["status"] } : prev
    );
    const labels: Record<string, string> = {
      focus: "Pinned to focus",
      archived: "Archived",
      read: "Marked as read",
    };
    setToast(labels[status] || "Status updated");
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  const handleToggleUnpin = useCallback((itemId: string) => {
    setExcludedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  }, []);

  const handleDrillDown = useCallback(
    async (chipId: string, itemIndex: number, onChunk: (content: string) => void) => {
      await streamPulseDrillDown(reportId, chipId, itemIndex, (data) => {
        if (data.type === "text" && data.content) onChunk(data.content);
      });
    },
    [reportId]
  );

  const handleVerify = useCallback(
    async (chipId: string, itemIndex: number, onChunk: (content: string) => void) => {
      await streamPulseVerify(reportId, chipId, itemIndex, (data) => {
        if (data.type === "text" && data.content) onChunk(data.content);
      });
    },
    [reportId]
  );

  const handleAskQuestion = useCallback(
    (chipId: string, chipLabel: string, question: string) => {
      const userMsg: ChatMessage = {
        id: `msg-q-${crypto.randomUUID().slice(0, 8)}`,
        role: "user",
        content: `[${chipLabel}] ${question}`,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, userMsg]);
      setChatOpen(true);
    },
    []
  );

  const handleApplyToReport = useCallback((content: string) => {
    const newMarkdown = reportMarkdown + "\n\n" + content;
    setReportMarkdown(newMarkdown);
    updatePulseReportMarkdown(reportId, newMarkdown).catch(() => {});
    setToast("Content applied to report");
    setTimeout(() => setToast(null), 3000);
  }, [reportId, reportMarkdown]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg font-medium text-[#0a3542]">Something went wrong</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 text-sm bg-[#3b82f6] text-white rounded-lg hover:bg-[#3b82f6]/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg font-medium text-[#0a3542]">Report not found</p>
        <p className="text-sm mt-1">
          This report may have been removed or the link is incorrect.
        </p>
        <button
          onClick={() => router.push(fromPage)}
          className="mt-4 text-sm text-[#00cca2] hover:underline"
        >
          Back to Reports
        </button>
      </div>
    );
  }

  const category = report.category as ReportCategory;
  const colorClass = CATEGORY_COLORS[category] || "bg-slate-100 text-slate-700";
  const borderClass = CATEGORY_BORDER_COLORS[category] || "border-l-slate-400";
  const hasModules = report.modules && report.modules.length > 0;

  return (
    <div className="h-full relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0a3542] text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          {toast}
        </div>
      )}

      {/* Scrollable content */}
      <div
        className={cn(
          "p-8 overflow-y-auto h-full",
          hasModules ? "max-w-5xl" : "max-w-3xl"
        )}
      >
        {/* Back button */}
        <button
          onClick={() => router.push(fromPage)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0a3542] transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          {fromPage === "/" ? "Back to Browse Agents" : "Back to Pulse"}
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full border",
                colorClass
              )}
            >
              {report.category}
            </span>
            {report.status === "focus" && (
              <span className="flex items-center gap-1 text-xs text-[#3b82f6] font-medium">
                <Pin size={12} />
                Pinned
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#0a3542] mb-2">
            {report.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <User size={14} />
                {report.agent_name}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatFullDate(report.updated_at)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {hasModules && (
                <>
                  <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                      chatOpen
                        ? "border-[#3b82f6]/30 text-[#3b82f6] bg-[#3b82f6]/5"
                        : "border-slate-200 text-slate-500 hover:text-[#3b82f6] hover:border-[#3b82f6]/30"
                    )}
                  >
                    <Sparkles size={12} />
                    Chat
                  </button>
                  <button
                    onClick={() => setEditingReport(!editingReport)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                      editingReport
                        ? "border-[#3b82f6]/30 text-[#3b82f6] bg-[#3b82f6]/5"
                        : "border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
                    )}
                  >
                    <FileText size={12} />
                    {editingReport ? "Module View" : "Edit Template"}
                  </button>
                  <button
                    onClick={() => {
                      setToast("Google Docs export coming soon");
                      setTimeout(() => setToast(null), 3000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#3b82f6] text-white hover:bg-[#3b82f6]/90 transition-colors"
                  >
                    Convert to Google Docs
                  </button>
                </>
              )}
              <button
                onClick={() =>
                  handleStatusChange(
                    report.status === "focus" ? "read" : "focus"
                  )
                }
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                  report.status === "focus"
                    ? "border-[#3b82f6]/30 text-[#3b82f6] bg-[#3b82f6]/5 hover:bg-[#3b82f6]/10"
                    : "border-slate-200 text-slate-500 hover:text-[#3b82f6] hover:border-[#3b82f6]/30"
                )}
              >
                <Pin size={12} />
                {report.status === "focus" ? "Unpin" : "Pin to Focus"}
              </button>
              <button
                onClick={() => handleStatusChange("archived")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
              >
                <Archive size={12} />
                Archive
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mb-6" />

        {/* Report content */}
        {hasModules ? (
          /* Structured module layout */
          editingReport ? (
            <div>
              <p className="text-xs text-slate-400 mb-2">
                Editing raw markdown. Switch to Module View to see structured layout.
              </p>
              <textarea
                value={reportMarkdown}
                onChange={(e) => setReportMarkdown(e.target.value)}
                className="w-full min-h-[600px] p-6 bg-white rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:border-[#3b82f6] resize-none"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {report.modules!.map((module) => (
                <PulseModuleView
                  key={module.id}
                  module={module}
                  reportId={report.id}
                  agentId={report.agent_id || "agent-1on1"}
                  excludedItemIds={excludedItemIds}
                  onToggleUnpin={handleToggleUnpin}
                  onDrillDown={handleDrillDown}
                  onVerify={handleVerify}
                  onAskQuestion={handleAskQuestion}
                />
              ))}
            </div>
          )
        ) : (
          /* Markdown fallback */
          <div
            className={cn(
              "pl-4 border-l-4",
              borderClass,
              "prose prose-sm max-w-none prose-headings:text-[#0a3542] prose-h1:text-xl prose-h1:font-bold prose-h2:text-base prose-h2:font-semibold prose-h2:border-l-3 prose-h2:border-l-[#00cca2] prose-h2:pl-3 prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-sm prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-p:text-slate-600 prose-p:text-sm prose-li:text-slate-600 prose-li:text-sm prose-table:text-sm prose-th:text-slate-500 prose-th:font-medium prose-td:text-slate-600 prose-strong:text-[#0a3542] prose-strong:font-semibold prose-hr:border-slate-200"
            )}
          >
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{report.markdown}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Chat Drawer */}
      {chatOpen && hasModules && (
        <PulseChatDrawer
          reportId={report.id}
          messages={chatMessages}
          onMessagesUpdate={setChatMessages}
          onApplyToReport={handleApplyToReport}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}
