"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Search, CalendarDays } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fetchMeetings } from "@/lib/api";
import MeetingCard from "@/components/MeetingCard";
import type { Meeting } from "@/types/meeting";

type TimeFrame = "all-time" | "today" | "this-week" | "this-month";
type Role = "all" | "organiser" | "attendee";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("all-time");
  const [role, setRole] = useState<Role>("all");
  const [search, setSearch] = useState("");

  const loadMeetings = useCallback(async () => {
    try {
      const res = await fetchMeetings({
        time_frame: timeFrame,
        role: role,
        search: search || undefined,
      });
      setMeetings(res.meetings || []);
      setError(null);
    } catch {
      setError("Unable to load meetings. Please check your connection.");
    } finally {
      setInitialized(true);
    }
  }, [timeFrame, role, search]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const sortedMeetings = useMemo(
    () => [...meetings].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()),
    [meetings]
  );

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-lg font-medium text-[#0a3542]">Something went wrong</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={loadMeetings}
          className="mt-4 px-4 py-2 text-sm bg-[#3b82f6] text-white rounded-lg hover:bg-[#3b82f6]/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0a3542] mb-1">My Meetings</h1>
          <p className="text-slate-500 text-sm">
            View and manage all your meetings in one place.
          </p>
        </div>
        <Link
          href="/meetings/new"
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors",
            "bg-[#0a3542] text-white hover:bg-[#0a3542]/90"
          )}
        >
          <Plus size={16} />
          New Meeting
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search meetings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
          />
        </div>
        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
        >
          <option value="all-time">All Time</option>
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
        </select>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
        >
          <option value="all">All Roles</option>
          <option value="organiser">Organiser</option>
          <option value="attendee">Attendee</option>
        </select>
      </div>

      {sortedMeetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <CalendarDays size={40} className="mb-3" />
          <p className="text-sm font-medium">No meetings found</p>
          <p className="text-xs mt-1">
            {search ? "Try a different search term" : "Create your first meeting with Manda AI"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      )}
    </div>
  );
}
