"use client";

import { Star, Play, CalendarClock, UserCheck, BarChart3, HeartPulse, FileText, Bot, Target, Calculator, UserPlus, GitBranch, Shield, ShieldCheck, TrendingUp, HeartHandshake, Home, DollarSign, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Agent } from "@/types/agent";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "user-check": UserCheck,
  "bar-chart-3": BarChart3,
  "heart-pulse": HeartPulse,
  "repeat": Repeat,
  "file-text": FileText,
  "target": Target,
  "calculator": Calculator,
  "user-plus": UserPlus,
  "git-branch": GitBranch,
  "shield": Shield,
  "shield-check": ShieldCheck,
  "trending-up": TrendingUp,
  "heart-handshake": HeartHandshake,
  "home": Home,
  "dollar-sign": DollarSign,
};

function IntegrationIcon({ name }: { name: string }) {
  const size = 28;
  switch (name) {
    case "outlook":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="14" height="16" rx="2" fill="#0078D4" />
          <rect x="4" y="6" width="10" height="12" rx="1" fill="#0364B8" />
          <path d="M9 12L2 7v10l7-5z" fill="#0078D4" />
          <path d="M15 7l7-3v16l-7-3V7z" fill="#0364B8" />
          <path d="M22 4L9 12l13 8V4z" fill="#0078D4" />
          <path d="M22 4L9 12l13 8V4z" fill="white" fillOpacity="0.15" />
          <rect x="13" y="9" width="10" height="6" rx="1" fill="#0078D4" />
          <path d="M13 9l9 3-9 3V9z" fill="#50E6FF" />
        </svg>
      );
    case "teams":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="1" y="7" width="13" height="12" rx="2" fill="#6264A7" />
          <circle cx="5.5" cy="10" r="1.8" fill="white" />
          <rect x="3" y="14" width="9" height="3" rx="1" fill="white" fillOpacity="0.3" />
          <circle cx="17" cy="7.5" r="3" fill="#7B83EB" />
          <circle cx="17" cy="7" r="1.5" fill="white" />
          <rect x="14" y="12" width="8" height="7" rx="2" fill="#7B83EB" />
          <circle cx="18" cy="14" r="1.3" fill="white" />
          <rect x="15.5" y="16.5" width="5" height="1.5" rx="0.5" fill="white" fillOpacity="0.3" />
        </svg>
      );
    case "google-calendar":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#4285F4" />
          <rect x="5" y="5" width="14" height="14" rx="1" fill="white" />
          <path d="M3 5a2 2 0 012-2h4v4H3V5z" fill="#1a73e8" />
          <path d="M15 3h4a2 2 0 012 2v2h-6V3z" fill="#EA4335" />
          <path d="M3 15h6v6H5a2 2 0 01-2-2v-4z" fill="#34A853" />
          <path d="M15 15h6v4a2 2 0 01-2 2h-4v-6z" fill="#FBBC04" />
          <text x="12" y="15.5" textAnchor="middle" fill="#4285F4" fontSize="7" fontWeight="700" fontFamily="system-ui">
            31
          </text>
        </svg>
      );
    case "gmail":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" fill="#F5F5F5" />
          <path d="M2 7l10 6 10-6v12a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" fill="#EA4335" />
          <path d="M2 7l10 6 10-6" stroke="#white" strokeWidth="0" />
          <path d="M2 7l10 5 10-5v0a2 2 0 00-2-2H4a2 2 0 00-2 2z" fill="#D93025" />
          <path d="M2 7l10 5 10-5" fill="none" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case "slack":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="8" y="1" width="4" height="10" rx="2" fill="#E01E5A" />
          <rect x="1" y="8" width="10" height="4" rx="2" fill="#36C5F0" />
          <rect x="12" y="13" width="4" height="10" rx="2" fill="#2EB67D" />
          <rect x="13" y="12" width="10" height="4" rx="2" fill="#ECB22E" />
        </svg>
      );
    default:
      return (
        <span className="text-[10px] font-bold text-slate-500">
          {name[0].toUpperCase()}
        </span>
      );
  }
}

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
                className="w-8 h-8 rounded flex items-center justify-center bg-slate-100 hover:bg-slate-50 transition-colors"
                title={integ.charAt(0).toUpperCase() + integ.slice(1)}
              >
                <IntegrationIcon name={integ} />
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
