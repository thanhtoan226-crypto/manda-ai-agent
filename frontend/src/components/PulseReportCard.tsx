"use client";

import Link from "next/link";
import { Clock, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_BORDER_COLORS } from "@/lib/mock-pulse-data";
import type { PulseReport } from "@/types/pulse";
import type { ReportCategory } from "@/lib/mock-pulse-data";

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PulseReportCard({ report }: { report: PulseReport }) {
  const category = report.category as ReportCategory;
  const colorClass = CATEGORY_COLORS[category] || "bg-slate-100 text-slate-700 border-slate-200";
  const borderClass = CATEGORY_BORDER_COLORS[category] || "border-l-slate-400";

  return (
    <Link href={`/pulse/${report.id}`} className="block">
      <div
        className={cn(
          "bg-white rounded-xl border border-slate-200 border-l-4 px-5 py-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer",
          borderClass
        )}
      >
        <div className="flex items-center gap-4">
          {/* Left: Category badge */}
          <span
            className={cn(
              "text-xs font-medium px-2.5 py-1 rounded-full border shrink-0",
              colorClass
            )}
          >
            {report.category}
          </span>

          {/* Center: Title + preview */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#0a3542] text-sm truncate">
                {report.title}
              </h3>
              {report.status === "unread" && (
                <span className="w-2 h-2 rounded-full bg-[#00cca2] shrink-0" />
              )}
            </div>
            <p className="text-slate-500 text-xs leading-relaxed truncate mt-0.5">
              {report.preview}
            </p>
          </div>

          {/* Right: Meta + chevron */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-end gap-0.5">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <User size={12} />
                {report.agent_name}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={12} />
                {formatRelativeDate(report.updated_at)}
              </span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
