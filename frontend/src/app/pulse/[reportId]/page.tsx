"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_REPORTS, CATEGORY_COLORS } from "@/lib/mock-pulse-data";
import type { ReportCategory } from "@/lib/mock-pulse-data";

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
  const report = MOCK_REPORTS.find((r) => r.id === reportId);

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
  const colorClass = CATEGORY_COLORS[category] || "bg-slate-100 text-slate-700 border-slate-200";

  // Split markdown into sections by ## headers
  const sections = report.markdown
    .split("\n")
    .filter((line) => line.trim() !== "");

  return (
    <div className="p-8 overflow-y-auto h-full max-w-3xl">
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
          {report.status === "unread" && (
            <span className="flex items-center gap-1 text-xs text-[#00cca2] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00cca2]" />
              New
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-[#0a3542] mb-2">{report.title}</h1>
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
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200 mb-6" />

      {/* Report content */}
      <div className="prose prose-sm max-w-none">
        {sections.map((line, i) => {
          if (line.startsWith("# ")) {
            return (
              <h1 key={i} className="text-xl font-bold text-[#0a3542] mb-4">
                {line.replace(/^# /, "")}
              </h1>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h2 key={i} className="text-base font-semibold text-[#0a3542] mt-6 mb-3 border-l-3 border-l-[#00cca2] pl-3">
                {line.replace(/^## /, "")}
              </h2>
            );
          }
          if (line.startsWith("### ")) {
            return (
              <h3 key={i} className="text-sm font-semibold text-[#0a3542] mt-4 mb-2">
                {line.replace(/^### /, "")}
              </h3>
            );
          }
          if (line.startsWith("- ")) {
            return (
              <div key={i} className="flex gap-2 text-sm text-slate-600 mb-1 ml-2">
                <span className="text-slate-300 mt-0.5">•</span>
                <span className="whitespace-pre-wrap">{line.replace(/^- /, "")}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(line)) {
            return (
              <div key={i} className="text-sm text-slate-600 mb-1 ml-2 whitespace-pre-wrap">
                {line}
              </div>
            );
          }
          return (
            <p key={i} className="text-sm text-slate-600 mb-2 whitespace-pre-wrap">
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}
