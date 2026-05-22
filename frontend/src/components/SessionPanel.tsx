"use client";

import { cn } from "@/lib/utils";
import { Plus, MessageSquare, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { SessionSummary } from "@/types/session";

interface SessionPanelProps {
  sessions: SessionSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewSession: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
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
  collapsed,
  onToggleCollapse,
}: SessionPanelProps) {
  const groups = groupByDate(sessions);

  if (collapsed) {
    return (
      <div className="w-12 border-r border-slate-200 bg-white flex flex-col items-center py-3 gap-2 h-full">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-lg transition-colors"
          title="Expand session history"
        >
          <PanelLeftOpen size={18} />
        </button>
        <button
          onClick={onNewSession}
          className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
          title="New Session"
        >
          <Plus size={18} />
        </button>
        <div className="flex-1 overflow-y-auto w-full flex flex-col items-center gap-1 pt-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => onSelect(session.id)}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors",
                activeId === session.id
                  ? "bg-accent/10 text-accent"
                  : "text-slate-400 hover:bg-slate-50 hover:text-navy"
              )}
              title={session.title}
            >
              <MessageSquare size={14} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-lg transition-colors"
          title="Collapse session history"
        >
          <PanelLeftClose size={16} />
        </button>
        <button
          onClick={onNewSession}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
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
