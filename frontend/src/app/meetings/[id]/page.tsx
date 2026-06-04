"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, MapPin, Users, Clock, Trash2, CheckCircle, HelpCircle, XCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEETING_COLORS } from "@/lib/constants";
import { fetchMeeting, deleteMeeting } from "@/lib/api";
import type { Meeting } from "@/types/meeting";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "accepted":
      return <CheckCircle size={12} className="text-green-500" />;
    case "tentative":
      return <HelpCircle size={12} className="text-amber-500" />;
    case "declined":
      return <XCircle size={12} className="text-red-400" />;
    default:
      return <MinusCircle size={12} className="text-slate-300" />;
  }
}

function renderDescription(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ol key={`list-${listKey++}`} className="ml-4 list-decimal space-y-0.5 mb-3">
          {currentList.map((item, i) => (
            <li key={i} className="text-sm text-slate-600">{item}</li>
          ))}
        </ol>
      );
      currentList = [];
    }
  };

  for (const line of lines) {
    if (/^\d+\.\s/.test(line)) {
      currentList.push(line.replace(/^\d+\.\s/, ""));
      continue;
    }

    flushList();

    if (line.startsWith("**") && line.endsWith("**")) {
      const heading = line.replace(/\*\*/g, "");
      elements.push(
        <h3 key={`h-${elements.length}`} className="text-sm font-semibold text-[#0a3542] mt-3 mb-1">
          {heading}
        </h3>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={`p-${elements.length}`} className="text-sm text-slate-600 mb-2">
          {line}
        </p>
      );
    }
  }

  flushList();
  return elements;
}

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  const loadMeeting = useCallback(async () => {
    if (!id) return;
    try {
      const m = await fetchMeeting(id);
      setMeeting(m);
      setError(null);
    } catch {
      setError("Meeting not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMeeting();
  }, [loadMeeting]);

  const handleDelete = async () => {
    if (!meeting || !confirm("Delete this meeting?")) return;
    try {
      await deleteMeeting(meeting.id);
      router.push("/meetings");
    } catch {
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">Loading...</div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg font-medium text-[#0a3542]">Meeting not found</p>
        <Link href="/meetings" className="text-sm text-[#3b82f6] hover:underline mt-2">
          Back to My Meetings
        </Link>
      </div>
    );
  }

  const color = MEETING_COLORS[meeting.category_color] || MEETING_COLORS.BLUE;

  return (
    <div className="p-8 overflow-y-auto h-full max-w-4xl mx-auto">
      <Link
        href="/meetings"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0a3542] mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Meetings
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className={cn("h-1.5", color.dot)} />
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-[#0a3542]">{meeting.title}</h1>
                {meeting.is_manda_created && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0a3542] text-[#00cca2]">
                    MANDA
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDate(meeting.start_time)}
                </span>
                <span>
                  {formatTime(meeting.start_time)} &ndash; {formatTime(meeting.end_time)}
                </span>
                <span className="text-slate-300">|</span>
                <span>{getDuration(meeting.start_time, meeting.end_time)}</span>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
              title="Delete meeting"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {meeting.location && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
              <MapPin size={14} />
              {meeting.location}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-6">
            <User size={14} />
            Organised by {meeting.organiser}
          </div>

          {meeting.attendees.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-[#0a3542] mb-2 flex items-center gap-1.5">
                <Users size={14} />
                Attendees ({meeting.attendees.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {meeting.attendees.map((att, i) => (
                  <div key={i} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                    <StatusIcon status={att.status} />
                    <span className="text-xs text-slate-700 flex-1">{att.name}</span>
                    <span className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded",
                      att.type === "required" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                    )}>
                      {att.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {meeting.description && (
            <div>
              <h2 className="text-sm font-semibold text-[#0a3542] mb-2">Description</h2>
              <div className="bg-slate-50 rounded-lg p-4">
                {renderDescription(meeting.description)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
