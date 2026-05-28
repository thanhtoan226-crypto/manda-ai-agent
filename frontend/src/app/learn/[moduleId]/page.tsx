"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchLearningModule, updateTopicProgress } from "@/lib/api";
import type { LearningModule, TopicMeta } from "@/types/learning";

export default function ModulePage() {
  const params = useParams();
  const moduleId = params.moduleId as string;
  const [moduleData, setModuleData] = useState<LearningModule | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const loadModule = useCallback(async () => {
    try {
      const data = await fetchLearningModule(moduleId);
      setModuleData(data);
    } catch {
      // fetchLearningModule falls back to mock
    } finally {
      setInitialized(true);
    }
  }, [moduleId]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleToggleComplete = async (topic: TopicMeta) => {
    let newCompleted = false;
    // Optimistic update — derive toggle from current state, not stale closure
    setModuleData((prev) => {
      if (!prev) return prev;
      const current = prev.topics.find((t) => t.id === topic.id);
      newCompleted = current ? !current.completed : !topic.completed;
      const updatedTopics = prev.topics.map((t) =>
        t.id === topic.id ? { ...t, completed: newCompleted } : t
      );
      const completedCount = updatedTopics.filter((t) => t.completed).length;
      return {
        ...prev,
        topics: updatedTopics,
        progress_percent: prev.topics.length
          ? Math.round((completedCount / prev.topics.length) * 100)
          : 0,
      };
    });

    try {
      await updateTopicProgress(moduleId, topic.id, newCompleted);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast(newCompleted ? "Marked as completed" : "Marked as incomplete");
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    } catch {
      // Revert on error — toggle back from current state
      setModuleData((prev) => {
        if (!prev) return prev;
        const updatedTopics = prev.topics.map((t) =>
          t.id === topic.id ? { ...t, completed: !newCompleted } : t
        );
        const completedCount = updatedTopics.filter((t) => t.completed).length;
        return {
          ...prev,
          topics: updatedTopics,
          progress_percent: prev.topics.length
            ? Math.round((completedCount / prev.topics.length) * 100)
            : 0,
        };
      });
    }
  };

  if (!initialized) {
    return <div className="flex items-center justify-center h-full text-slate-400">Loading...</div>;
  }

  if (!moduleData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg font-medium text-[#0a3542]">Module not found</p>
        <Link href="/learn" className="mt-4 text-sm text-[#00cca2] hover:underline">
          Back to Learning
        </Link>
      </div>
    );
  }

  const completedCount = moduleData.topics.filter((t) => t.completed).length;

  return (
    <div className="p-8 overflow-y-auto h-full max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0a3542] text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Back button */}
      <Link
        href="/learn"
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0a3542] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Learning
      </Link>

      {/* Module header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a3542] mb-1">{moduleData.title}</h1>
        <p className="text-slate-500 text-sm mb-4">{moduleData.description}</p>

        {/* Progress bar */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#0a3542]">Progress</span>
            <span className="text-sm text-slate-500">
              {completedCount} of {moduleData.topics.length} topics
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00cca2] rounded-full transition-all duration-500"
              style={{ width: `${moduleData.progress_percent}%` }}
            />
          </div>
          <div className="text-right mt-1">
            <span className="text-xs font-semibold text-[#00cca2]">{moduleData.progress_percent}%</span>
          </div>
        </div>
      </div>

      {/* Topic list */}
      <div className="flex flex-col gap-2">
        {moduleData.topics.map((topic) => (
          <div
            key={topic.id}
            className={cn(
              "bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 transition-all",
              topic.completed ? "border-l-4 border-l-[#00cca2]" : "hover:border-slate-300"
            )}
          >
            {/* Completion toggle */}
            <button
              onClick={() => handleToggleComplete(topic)}
              className="shrink-0 focus:outline-none"
              title={topic.completed ? "Mark as incomplete" : "Mark as completed"}
            >
              {topic.completed ? (
                <CheckCircle2 size={22} className="text-[#00cca2]" />
              ) : (
                <Circle size={22} className="text-slate-300 hover:text-slate-400" />
              )}
            </button>

            {/* Topic info */}
            <Link
              href={`/learn/${moduleId}/${topic.id}`}
              className="flex-1 min-w-0"
            >
              <h3
                className={cn(
                  "font-medium text-sm mb-0.5 text-[#0a3542]",
                  topic.completed && "line-through opacity-70"
                )}
              >
                {topic.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">{topic.description}</p>
            </Link>

            {/* Time + chevron */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={12} />
                {topic.estimated_minutes}m
              </span>
              <Link href={`/learn/${moduleId}/${topic.id}`}>
                <ChevronRight size={16} className="text-slate-300" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
