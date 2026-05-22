"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Activity, Inbox, Archive, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { REPORT_CATEGORIES } from "@/lib/mock-pulse-data";
import type { ReportCategory } from "@/types/pulse";
import { fetchPulseReports } from "@/lib/api";
import PulseReportCard from "@/components/PulseReportCard";
import type { PulseReport } from "@/types/pulse";

type Tab = "focus" | "all" | "unread" | "archived";

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { key: "focus", label: "Focus", icon: Eye },
  { key: "all", label: "All", icon: Inbox },
  { key: "unread", label: "Unread", icon: Activity },
  { key: "archived", label: "Archived", icon: Archive },
];

type TimeFrame = "this-week" | "this-month" | "all-time";
const PAGE_SIZE = 6;

function PulseContent() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | "all">("all");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("all-time");
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState<PulseReport[]>([]);
  const [initialized, setInitialized] = useState(false);

  const loadReports = useCallback(async () => {
    try {
      const statusFilter = activeTab === "all" ? undefined : activeTab;
      const categoryParam = categoryFilter === "all" ? undefined : categoryFilter;
      const res = await fetchPulseReports({
        status: statusFilter,
        category: categoryParam,
        time_frame: timeFrame,
      });
      setReports((res.reports as PulseReport[]) || []);
    } catch {
      // fetchPulseReports already falls back to mock data
    } finally {
      setInitialized(true);
    }
  }, [activeTab, categoryFilter, timeFrame]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filteredReports = useMemo(() => {
    return reports.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [reports]);

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedReports = filteredReports.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );
  const startIndex = (safePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safePage * PAGE_SIZE, filteredReports.length);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };
  const handleStatusChange = useCallback((reportId: string, status: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: status as PulseReport["status"] } : r))
    );
  }, []);

  const handleCategoryChange = (val: ReportCategory | "all") => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };
  const handleTimeFrameChange = (val: TimeFrame) => {
    setTimeFrame(val);
    setCurrentPage(1);
  };

  if (!initialized) {
    return <div className="flex items-center justify-center h-full text-slate-400">Loading...</div>;
  }

  return (
    <div className="p-8 overflow-y-auto h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a3542] mb-1">Pulse</h1>
        <p className="text-slate-500 text-sm">
          View and manage your generated reports in one place.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-slate-100 rounded-full p-1 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors",
                activeTab === tab.key
                  ? "bg-white text-[#0a3542] shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filters + Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter size={12} />
            Filters
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value as ReportCategory | "all")}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
          >
            <option value="all">All Types</option>
            {REPORT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={timeFrame}
            onChange={(e) => handleTimeFrameChange(e.target.value as TimeFrame)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
          >
            <option value="all-time">All Time</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
          </select>
        </div>
        <span className="text-xs text-slate-400">
          {filteredReports.length > 0
            ? `${startIndex}-${endIndex} of ${filteredReports.length} reports`
            : "0 reports"}
        </span>
      </div>

      {/* Report list */}
      {filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Inbox size={40} className="mb-3" />
          <p className="text-sm font-medium">No {activeTab} reports</p>
          <p className="text-xs mt-1">
            {activeTab === "focus"
              ? "Pin important reports to keep them in focus"
              : activeTab === "unread"
              ? "You're all caught up"
              : activeTab === "archived"
              ? "No archived reports yet"
              : "Generate your first report from an agent"}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {paginatedReports.map((report) => (
              <PulseReportCard key={report.id} report={report} onStatusChange={handleStatusChange} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#0a3542] hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-semibold transition-colors",
                    safePage === page
                      ? "bg-[#0a3542] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-[#0a3542] hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PulsePage() {
  return <PulseContent />;
}
