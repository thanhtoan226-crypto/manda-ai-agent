"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Activity } from "lucide-react";
import AgentCarousel from "@/components/AgentCarousel";
import ScheduleModal from "@/components/ScheduleModal";
import RecentReportCard from "@/components/RecentReportCard";
import { fetchAgents, toggleFavorite, fetchPulseReports } from "@/lib/api";
import type { Agent } from "@/types/agent";
import type { PulseReport } from "@/types/pulse";

export default function AgentHub() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleAgent, setScheduleAgent] = useState<Agent | null>(null);
  const [recentReports, setRecentReports] = useState<PulseReport[]>([]);
  const reportsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAgents()
      .then((res) => setAgents(res.agents ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));

    fetchPulseReports()
      .then((res) => {
        const sorted = (res.reports as PulseReport[]).sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setRecentReports(sorted.slice(0, 10));
      })
      .catch(console.error);
  }, []);

  const handleRun = useCallback(
    (agent: Agent) => {
      router.push(`/workbench?agentId=${agent.id}`);
    },
    [router]
  );

  const handleSchedule = useCallback((agent: Agent) => {
    setScheduleAgent(agent);
  }, []);

  const handleToggleFavorite = useCallback(async (agentId: string) => {
    try {
      const updated = await toggleFavorite(agentId);
      setAgents((prev) =>
        prev.map((a) => (a.id === agentId ? { ...a, is_favorite: updated.is_favorite } : a))
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  const scrollReports = (direction: "left" | "right") => {
    if (!reportsScrollRef.current) return;
    reportsScrollRef.current.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  const popular = [...agents].sort((a, b) => b.usage_count - a.usage_count);
  const salesPerformance = agents.filter((a) => a.category === "People Management");
  const marketIntelligence = agents.filter((a) => a.category === "Leadership & Strategy");
  const clientSuccess = agents.filter((a) => a.category === "Productivity & Efficiency");

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-64 h-80 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0a3542] mb-1">Browse Agents</h1>
        <p className="text-slate-500 text-sm">
          Browse and launch AI-powered agents to generate insights and reports.
        </p>
      </div>

      {/* Your Pulse — Recent Reports */}
      {recentReports.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[#3b82f6]" />
              <h2 className="text-sm font-semibold text-[#0a3542] uppercase tracking-wide">
                Your Pulse
              </h2>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => scrollReports("left")}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0a3542] transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollReports("right")}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0a3542] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          <div
            ref={reportsScrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
          >
            {recentReports.map((report) => (
              <RecentReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      )}

      {/* Agent Carousels */}
      <AgentCarousel
        title="Most Popular"
        agents={popular}
        onRun={handleRun}
        onSchedule={handleSchedule}
        onToggleFavorite={handleToggleFavorite}
      />
      <AgentCarousel
        title="People Management"
        agents={salesPerformance}
        onRun={handleRun}
        onSchedule={handleSchedule}
        onToggleFavorite={handleToggleFavorite}
      />
      <AgentCarousel
        title="Leadership & Strategy"
        agents={marketIntelligence}
        onRun={handleRun}
        onSchedule={handleSchedule}
        onToggleFavorite={handleToggleFavorite}
      />
      <AgentCarousel
        title="Productivity & Efficiency"
        agents={clientSuccess}
        onRun={handleRun}
        onSchedule={handleSchedule}
        onToggleFavorite={handleToggleFavorite}
      />
      <AgentCarousel
        title="Build Your Own"
        agents={[]}
        comingSoon
        onRun={handleRun}
        onSchedule={handleSchedule}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        open={!!scheduleAgent}
        onClose={() => setScheduleAgent(null)}
        sessionId=""
      />
    </div>
  );
}
