"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User, Pin, Archive, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_BORDER_COLORS } from "@/lib/mock-pulse-data";
import { fetchPulseReport, updatePulseReportStatus } from "@/lib/api";
import type { PulseReport, ReportCategory } from "@/types/pulse";
import ReactMarkdown from "react-markdown";

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
  const reportId = params.reportId as string;
  const [report, setReport] = useState<PulseReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPulseReport(reportId);
        if (!cancelled) setReport(data);
      } catch {
        // fetchPulseReport already falls back to mock
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [reportId]);

  useEffect(() => {
    if (report && report.status === "unread") {
      updatePulseReportStatus(report.id, "read").catch(() => {});
      setReport((prev) => prev ? { ...prev, status: "read" } : prev);
    }
  }, [report?.id, report?.status]);

  const handleStatusChange = (status: string) => {
    if (!report) return;
    updatePulseReportStatus(report.id, status).catch(() => {});
    setReport((prev) => prev ? { ...prev, status: status as PulseReport["status"] } : prev);
    const labels: Record<string, string> = { focus: "Pinned to focus", archived: "Archived", read: "Marked as read" };
    setToast(labels[status] || "Status updated");
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-slate-400">Loading...</div>;
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg font-medium text-[#0a3542]">Report not found</p>
        <p className="text-sm mt-1">This report may have been removed or the link is incorrect.</p>
        <button
          onClick={() => router.push("/pulse")}
          className="mt-4 text-sm text-[#00cca2] hover:underline"
        >
          Back to Pulse
        </button>
      </div>
    );
  }

  const category = report.category as ReportCategory;
  const colorClass = CATEGORY_COLORS[category] || "bg-slate-100 text-slate-700";
  const borderClass = CATEGORY_BORDER_COLORS[category] || "border-l-slate-400";

  return (
    <div className="p-8 overflow-y-auto h-full max-w-3xl relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0a3542] text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-in fade-in">
          {toast}
        </div>
      )}

      {/* Back button */}
      <button
        onClick={() => router.push("/pulse")}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0a3542] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Pulse
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
            <span className="flex items-center gap-1 text-xs text-accent font-medium">
              <Pin size={12} />
              Pinned
            </span>
          )}
          {report.status === "unread" && (
            <span className="flex items-center gap-1 text-xs text-[#00cca2] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00cca2]" />
              New
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-[#0a3542] mb-2">{report.title}</h1>
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
            <button
              onClick={() => handleStatusChange(report.status === "focus" ? "read" : "focus")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                report.status === "focus"
                  ? "border-accent/30 text-accent bg-accent/5 hover:bg-accent/10"
                  : "border-slate-200 text-slate-500 hover:text-accent hover:border-accent/30"
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
      <div className={cn(
        "pl-4 border-l-4",
        borderClass,
        "prose prose-sm max-w-none prose-headings:text-[#0a3542] prose-h1:text-xl prose-h1:font-bold prose-h2:text-base prose-h2:font-semibold prose-h2:border-l-3 prose-h2:border-l-[#00cca2] prose-h2:pl-3 prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-sm prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2 prose-p:text-slate-600 prose-p:text-sm prose-li:text-slate-600 prose-li:text-sm prose-table:text-sm prose-th:text-slate-500 prose-th:font-medium prose-td:text-slate-600 prose-strong:text-[#0a3542] prose-strong:font-semibold prose-hr:border-slate-200"
      )}>
        <ReactMarkdown>{report.markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
