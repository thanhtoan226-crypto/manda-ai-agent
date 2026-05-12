"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AgentCarousel from "@/components/AgentCarousel";
import ScheduleModal from "@/components/ScheduleModal";
import { fetchAgents, toggleFavorite } from "@/lib/api";
import type { Agent } from "@/types/agent";

export default function AgentHub() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleAgent, setScheduleAgent] = useState<Agent | null>(null);

  useEffect(() => {
    fetchAgents()
      .then((res) => setAgents(res.agents ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
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

  const favorites = agents.filter((a) => a.is_favorite);
  const popular = [...agents].sort((a, b) => b.usage_count - a.usage_count);
  const peopleManagement = agents.filter((a) => a.category === "People Management");
  const leadershipStrategy = agents.filter((a) => a.category === "Leadership & Strategy");
  const productivityEfficiency = agents.filter((a) => a.category === "Productivity & Efficiency");

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

      {/* Carousels */}
      <AgentCarousel
        title="Your Pulse"
        agents={favorites}
        onRun={handleRun}
        onSchedule={handleSchedule}
        onToggleFavorite={handleToggleFavorite}
      />
      <AgentCarousel
        title="Most Popular"
        agents={popular}
        onRun={handleRun}
        onSchedule={handleSchedule}
        onToggleFavorite={handleToggleFavorite}
      />
      <AgentCarousel
        title="People Management"
        agents={peopleManagement}
        onRun={handleRun}
        onSchedule={handleSchedule}
        onToggleFavorite={handleToggleFavorite}
      />
      <AgentCarousel
        title="Leadership & Strategy"
        agents={leadershipStrategy}
        onRun={handleRun}
        onSchedule={handleSchedule}
        onToggleFavorite={handleToggleFavorite}
      />
      <AgentCarousel
        title="Productivity & Efficiency"
        agents={productivityEfficiency}
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
