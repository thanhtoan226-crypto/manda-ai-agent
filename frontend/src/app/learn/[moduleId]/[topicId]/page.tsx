"use client";

import LearningChatWidget from "@/components/LearningChatWidget";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, Circle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchTopicContent, updateTopicProgress } from "@/lib/api";
import type { TopicContent } from "@/types/learning";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const topicId = params.topicId as string;
  const [topic, setTopic] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchTopicContent(moduleId, topicId);
        if (!cancelled) setTopic(data);
      } catch {
        // fetchTopicContent falls back to mock
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [moduleId, topicId]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleToggleComplete = async () => {
    if (!topic) return;
    const newCompleted = !topic.completed;

    setTopic((prev) => (prev ? { ...prev, completed: newCompleted } : prev));

    try {
      await updateTopicProgress(moduleId, topicId, newCompleted);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast(newCompleted ? "Marked as completed" : "Marked as incomplete");
      toastTimerRef.current = setTimeout(() => setToast(null), 3000);
    } catch {
      setTopic((prev) => (prev ? { ...prev, completed: !newCompleted } : prev));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <div className="flex items-center gap-2">
          <div className="animate-pulse-glow h-4 w-4 bg-accent rounded-full" />
          <span>Loading topic...</span>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg font-medium text-[#0a3542]">Topic not found</p>
        <Link
          href={`/learn/${moduleId}`}
          className="mt-4 text-sm text-[#00cca2] hover:underline"
        >
          Back to module
        </Link>
      </div>
    );
  }

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
        href={`/learn/${moduleId}`}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#0a3542] transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to {topic.module_title}
      </Link>

      {/* Topic header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {topic.module_title}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} />
            {topic.estimated_minutes} min read
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#0a3542] mb-3">{topic.title}</h1>

        {/* Mark as done button */}
        <button
          onClick={handleToggleComplete}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            topic.completed
              ? "bg-[#00cca2]/10 text-[#00cca2] border border-[#00cca2]/30 hover:bg-[#00cca2]/20"
              : "bg-[#0a3542] text-white hover:bg-[#195160]"
          )}
        >
          {topic.completed ? (
            <>
              <CheckCircle2 size={16} />
              Completed
            </>
          ) : (
            <>
              <Circle size={16} />
              Mark as Done
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200 mb-6" />

      {/* Content */}
      <div
        className={cn(
          "prose prose-sm max-w-none",
          "prose-headings:text-[#0a3542]",
          "prose-h1:text-xl prose-h1:font-bold",
          "prose-h2:text-base prose-h2:font-semibold prose-h2:border-l-3 prose-h2:border-l-[#00cca2] prose-h2:pl-3 prose-h2:mt-6 prose-h2:mb-3",
          "prose-h3:text-sm prose-h3:font-semibold prose-h3:mt-4 prose-h3:mb-2",
          "prose-p:text-slate-600 prose-p:text-sm",
          "prose-li:text-slate-600 prose-li:text-sm",
          "prose-table:text-sm prose-th:text-slate-500 prose-th:font-medium prose-td:text-slate-600",
          "prose-strong:text-[#0a3542] prose-strong:font-semibold",
          "prose-hr:border-slate-200",
          "[&_blockquote]:border-l-4 [&_blockquote]:rounded-r-lg [&_blockquote]:py-3 [&_blockquote]:px-4 [&_blockquote]:not-italic",
          "[&_blockquote]:bg-blue-50 [&_blockquote]:border-blue-400 [&_blockquote]:text-slate-700 [&_blockquote]:text-sm"
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{topic.markdown}</ReactMarkdown>
      </div>
      <LearningChatWidget
        moduleId={moduleId}
        topicId={topicId}
        topicTitle={topic.title}
        moduleTitle={topic.module_title}
      />
    </div>
  );
}
