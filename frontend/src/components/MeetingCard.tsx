"use client";

import Link from "next/link";
import { User, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEETING_COLORS } from "@/lib/constants";
import type { Meeting } from "@/types/meeting";

function formatMeetingTime(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const dateStr = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const startStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  const endStr = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${dateStr} \u00b7 ${startStr} \u2013 ${endStr}`;
}

function getDuration(startTime: string, endTime: string): string {
  const ms = new Date(endTime).getTime() - new Date(startTime).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  const color = MEETING_COLORS[meeting.category_color] || MEETING_COLORS.BLUE;
  const preview = meeting.description
    ? meeting.description.length > 100
      ? meeting.description.slice(0, 100) + "\u2026"
      : meeting.description
    : null;

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <div
        className={cn(
          "bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer",
          "border-l-4",
          color.border
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={cn("w-2.5 h-2.5 rounded-full", color.dot)} />
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", color.bg, color.text)}>
              {meeting.category_color}
            </span>
          </div>
          {meeting.is_manda_created && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0a3542] text-[#00cca2]">
              MANDA
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-[#0a3542] mb-1 line-clamp-2">
          {meeting.title}
        </h3>

        <p className="text-xs text-slate-500 mb-3">
          {formatMeetingTime(meeting.start_time, meeting.end_time)}
          <span className="text-slate-300 mx-1">|</span>
          {getDuration(meeting.start_time, meeting.end_time)}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
          <span className="flex items-center gap-1">
            <User size={12} />
            {meeting.organiser}
          </span>
          {meeting.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {meeting.location.length > 20
                ? meeting.location.slice(0, 20) + "\u2026"
                : meeting.location}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
          <Users size={12} />
          <span>{meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? "s" : ""}</span>
        </div>

        {preview && (
          <p className="text-xs text-slate-400 line-clamp-2">{preview}</p>
        )}
      </div>
    </Link>
  );
}
