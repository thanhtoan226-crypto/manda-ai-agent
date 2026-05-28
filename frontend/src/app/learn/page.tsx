"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  Server,
  Plug,
  Database,
  Bug,
  Rocket,
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchLearningModules } from "@/lib/api";
import type { LearningModule } from "@/types/learning";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  server: Server,
  plug: Plug,
  database: Database,
  bug: Bug,
  rocket: Rocket,
};

const MODULE_COLORS = [
  { bg: "bg-blue-50", border: "border-l-blue-500", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700" },
  { bg: "bg-purple-50", border: "border-l-purple-500", icon: "text-purple-600", badge: "bg-purple-100 text-purple-700" },
  { bg: "bg-emerald-50", border: "border-l-emerald-500", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700" },
  { bg: "bg-amber-50", border: "border-l-amber-500", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700" },
  { bg: "bg-rose-50", border: "border-l-rose-500", icon: "text-rose-600", badge: "bg-rose-100 text-rose-700" },
];

export default function LearningPage() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [overallPercent, setOverallPercent] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const loadModules = useCallback(async () => {
    try {
      const res = await fetchLearningModules();
      setModules(res.modules);
      setOverallPercent(res.overall_progress_percent);
    } catch {
      // fetchLearningModules falls back to mock
    } finally {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    loadModules();
  }, [loadModules]);

  if (!initialized) {
    return <div className="flex items-center justify-center h-full text-slate-400">Loading...</div>;
  }

  const totalTopics = modules.reduce((s, m) => s + m.topics.length, 0);
  const completedTopics = modules.reduce((s, m) => s + m.topics.filter((t) => t.completed).length, 0);

  return (
    <div className="p-8 overflow-y-auto h-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={24} className="text-[#0a3542]" />
          <h1 className="text-2xl font-bold text-[#0a3542]">Learning</h1>
        </div>
        <p className="text-slate-500 text-sm">
          Build your technical literacy with structured, easy-to-follow guides.
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-[#0a3542]">Overall Progress</span>
          <span className="text-sm text-slate-500">
            {completedTopics} of {totalTopics} topics completed
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00cca2] rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <div className="text-right mt-1">
          <span className="text-xs font-semibold text-[#00cca2]">{overallPercent}%</span>
        </div>
      </div>

      {/* Module grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod, idx) => {
          const colors = MODULE_COLORS[idx % MODULE_COLORS.length];
          const Icon = ICON_MAP[mod.icon] || Server;
          const completedCount = mod.topics.filter((t) => t.completed).length;

          return (
            <Link
              key={mod.id}
              href={`/learn/${mod.id}`}
              className={cn(
                "bg-white rounded-xl border border-slate-200 p-5 border-l-4 transition-all hover:shadow-md hover:border-slate-300",
                colors.border
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("p-2.5 rounded-lg shrink-0", colors.bg)}>
                  <Icon size={20} className={colors.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#0a3542] mb-1">{mod.title}</h3>
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{mod.description}</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", colors.badge)}>
                      {mod.topics.length} topics
                    </span>
                    <span className="text-xs text-slate-400">
                      {completedCount}/{mod.topics.length} done
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00cca2] rounded-full transition-all duration-500"
                      style={{ width: `${mod.progress_percent}%` }}
                    />
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 shrink-0 mt-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
