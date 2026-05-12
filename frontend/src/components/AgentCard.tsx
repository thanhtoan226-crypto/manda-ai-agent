"use client";

import { Star, Play, CalendarClock, UserCheck, BarChart3, HeartPulse, FileText, Bot, Target, Calculator, UserPlus, GitBranch, Shield, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent } from "@/types/agent";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "user-check": UserCheck,
  "bar-chart-3": BarChart3,
  "heart-pulse": HeartPulse,
  "file-text": FileText,
  "target": Target,
  "calculator": Calculator,
  "user-plus": UserPlus,
  "git-branch": GitBranch,
  "shield": Shield,
  "shield-check": ShieldCheck,
};

const INTEGRATION_ICONS: Record<string, string> = {
  outlook: "M",
  gmail: "G",
  slack: "S",
  teams: "T",
};

const CARD_GRADIENTS = [
  "from-[#0a3542] to-[#195160]",
  "from-[#1a3a5c] to-[#2a5a7c]",
  "from-[#0d4a4a] to-[#1a6b6b]",
  "from-[#2a3a5c] to-[#3a5a8c]",
  "from-[#1a4050] to-[#2a6070]",
  "from-[#0a2a42] to-[#1a4a62]",
];

interface AgentCardProps {
  agent: Agent;
  onRun: (agent: Agent) => void;
  onSchedule: (agent: Agent) => void;
  onToggleFavorite: (agentId: string) => void;
}

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AgentCard({ agent, onRun, onSchedule, onToggleFavorite }: AgentCardProps) {
  const Icon = ICON_MAP[agent.icon] || Bot;
  const gradientIndex = Math.abs(hashCode(agent.id)) % CARD_GRADIENTS.length;
  const gradient = CARD_GRADIENTS[gradientIndex];

  return (
    <div className="group flex-shrink-0 w-64 rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-[#0a3542]/20 transition-all bg-white">
      {/* Gradient header with icon */}
      <div className={cn("relative h-20 bg-gradient-to-br flex items-center justify-center", gradient)}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
          <Icon size={22} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(agent.id);
          }}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-md transition-colors"
        >
          <Star
            size={14}
            className={cn(
              "transition-colors",
              agent.is_favorite ? "fill-yellow-400 text-yellow-400" : "text-white/60"
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-[#0a3542] text-sm leading-snug mb-0.5">{agent.name}</h3>
        {agent.purpose && <p className="text-xs text-[#0a3542]/50 mb-2">For: {agent.purpose}</p>}
        <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">{agent.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(agent.tags ?? []).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#0a3542]/5 text-[#0a3542]/60 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Integrations + last generated */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1">
            {(agent.integrations ?? []).map((integ) => (
              <span
                key={integ}
                className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500"
                title={integ.charAt(0).toUpperCase() + integ.slice(1)}
              >
                {INTEGRATION_ICONS[integ] || integ[0].toUpperCase()}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-slate-400">
            {agent.last_generated ? formatRelativeDate(agent.last_generated) : "Not generated"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onRun(agent)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#0a3542] text-white rounded-lg text-xs font-semibold hover:bg-[#195160] transition-colors"
          >
            <Play size={12} />
            Run
          </button>
          <button
            onClick={() => onSchedule(agent)}
            className="flex items-center justify-center gap-1 px-2.5 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            <CalendarClock size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}
