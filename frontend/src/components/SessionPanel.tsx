"use client";

import { cn } from "@/lib/utils";
import { Plus, MessageSquare } from "lucide-react";
import type { SessionSummary } from "@/types/session";

interface SessionPanelProps {
  sessions: SessionSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewSession: () => void;
}

function groupByDate(sessions: SessionSummary[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const thisWeek = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; sessions: SessionSummary[] }[] = [
    { label: "Today", sessions: [] },
    { label: "Yesterday", sessions: [] },
    { label: "This Week", sessions: [] },
    { label: "Older", sessions: [] },
  ];

  for (const session of sessions) {
    const date = new Date(session.created_at);
    if (date >= today) groups[0].sessions.push(session);
    else if (date >= yesterday) groups[1].sessions.push(session);
    else if (date >= thisWeek) groups[2].sessions.push(session);
    else groups[3].sessions.push(session);
  }

  return groups.filter((g) => g.sessions.length > 0);
}

export default function SessionPanel({
  sessions,
  activeId,
  onSelect,
  onNewSession,
}: SessionPanelProps) {
  const groups = groupByDate(sessions);

  return (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          New Session
        </button>
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 mb-2">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelect(session.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    activeId === session.id
                      ? "bg-accent/10 border border-accent/20"
                      : "hover:bg-slate-50 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={14} className={activeId === session.id ? "text-accent" : "text-slate-400"} />
                    <span className={cn(
                      "text-sm font-medium truncate",
                      activeId === session.id ? "text-accent" : "text-navy"
                    )}>
                      {session.title}
                    </span>
                  </div>
                  {session.preview && (
                    <p className="text-xs text-slate-400 truncate pl-5">
                      {session.preview}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">
            No sessions yet. Start a new one!
          </p>
        )}
      </div>
    </div>
  );
}
