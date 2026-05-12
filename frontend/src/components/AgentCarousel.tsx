"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import AgentCard from "@/components/AgentCard";
import type { Agent } from "@/types/agent";

interface AgentCarouselProps {
  title: string;
  agents: Agent[];
  comingSoon?: boolean;
  onRun: (agent: Agent) => void;
  onSchedule: (agent: Agent) => void;
  onToggleFavorite: (agentId: string) => void;
}

export default function AgentCarousel({
  title,
  agents,
  comingSoon,
  onRun,
  onSchedule,
  onToggleFavorite,
}: AgentCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (agents.length === 0 && !comingSoon) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-[#0a3542] uppercase tracking-wide">{title}</h2>
          {comingSoon && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
              Coming Soon
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => scroll("left")}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0a3542] transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0a3542] transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
      >
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onRun={onRun}
            onSchedule={onSchedule}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
        {comingSoon && (
          <div className="flex-shrink-0 w-64 rounded-xl border border-dashed border-slate-300 flex items-center justify-center h-[340px] bg-slate-50/50">
            <div className="text-center">
              <Sparkles size={24} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400 font-medium">Build Your Own Agent</p>
              <p className="text-xs text-slate-300 mt-1">Custom agents coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
