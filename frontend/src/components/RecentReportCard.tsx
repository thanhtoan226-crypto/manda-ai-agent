"use client";

import Link from "next/link";
import { Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORY_COLORS, CATEGORY_BORDER_COLORS } from "@/lib/mock-pulse-data";
import type { PulseReport, ReportCategory } from "@/types/pulse";

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

export default function RecentReportCard({ report, from = "/" }: { report: PulseReport; from?: string }) {
  const category = report.category as ReportCategory;
  const colorClass = CATEGORY_COLORS[category] || "bg-slate-100 text-slate-700";
  const borderClass = CATEGORY_BORDER_COLORS[category] || "border-l-slate-400";

  return (
    <Link href={`/pulse/${report.id}?from=${encodeURIComponent(from)}`} className="block flex-shrink-0 w-64">
      <div
        className={cn(
          "bg-white rounded-xl border border-slate-200 border-l-4 px-4 py-3 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer h-[160px] flex flex-col justify-between",
          borderClass
        )}
      >
        <div>
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 inline-block mb-2",
              colorClass
            )}
          >
            {report.category}
          </span>
          <h3 className="font-semibold text-[#0a3542] text-sm leading-snug line-clamp-2">
            {report.title}
          </h3>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <User size={10} />
            {report.agent_name}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatRelativeDate(report.updated_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
