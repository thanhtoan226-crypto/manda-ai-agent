"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createMeeting, fetchMeetingSettings } from "@/lib/api";
import MandaPlugin from "@/components/MandaPlugin";
import type { MandaMeetingSettings, Attendee } from "@/types/meeting";

export default function NewMeetingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [organiser] = useState("Sarah Chen");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendeeInput, setAttendeeInput] = useState("");
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [settings, setSettings] = useState<MandaMeetingSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [safetyErrors, setSafetyErrors] = useState<string[]>([]);
  const [showPlugin, setShowPlugin] = useState(false);

  const handleSettingsChange = useCallback((s: MandaMeetingSettings) => {
    setSettings(s);
  }, []);

  const handleGeneratedContent = useCallback((_field: string, content: string) => {
    setDescription(content);
  }, []);

  const addAttendee = () => {
    if (!attendeeInput.trim()) return;
    const parts = attendeeInput.trim().split("<");
    const name = parts[0].trim();
    const email =
      parts.length > 1
        ? parts[1].replace(">", "").trim()
        : `${name.toLowerCase().replace(/\s+/g, ".")}@advizia.com.au`;
    setAttendees([
      ...attendees,
      { id: "", name, email, type: "required", status: "no_response" },
    ]);
    setAttendeeInput("");
  };

  const removeAttendee = (index: number) =>
    setAttendees(attendees.filter((_, i) => i !== index));

  const runSafetyChecks = (): string[] => {
    if (!settings) return [];
    const errors: string[] = [];
    for (const check of settings.safety_checks) {
      if (
        check === "missing_agenda" &&
        !description.toLowerCase().includes("agenda")
      ) {
        errors.push("Missing agenda");
      }
      if (
        check === "missing_purpose_outcome" &&
        (!description.toLowerCase().includes("purpose") ||
          !description.toLowerCase().includes("outcome"))
      ) {
        errors.push("Missing purpose/outcome");
      }
      if (check === "missing_description" && !description.trim()) {
        errors.push("Missing description");
      }
      if (check === "missing_attendees" && attendees.length === 0) {
        errors.push("No attendees added");
      }
      if (check === "missing_duration" && (!startTime || !endTime)) {
        errors.push("Missing duration");
      }
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = runSafetyChecks();
    if (errors.length > 0) {
      setSafetyErrors(errors);
      return;
    }
    setSafetyErrors([]);
    setSaving(true);
    try {
      const s = settings || (await fetchMeetingSettings());
      const meeting = await createMeeting({
        title: title || "Untitled Meeting",
        description: description || null,
        organiser,
        attendees,
        start_time: startTime
          ? new Date(startTime).toISOString()
          : new Date().toISOString(),
        end_time: endTime
          ? new Date(endTime).toISOString()
          : new Date(Date.now() + 3600000).toISOString(),
        location: location || null,
        category_color: s.auto_color,
        is_manda_created: true,
      });
      router.push(`/meetings/${meeting.id}`);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-8 overflow-y-auto">
        <button
          onClick={() => router.push("/meetings")}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0a3542] mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Meetings
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0a3542]">New Meeting</h1>
          <button
            onClick={() => setShowPlugin(!showPlugin)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              showPlugin
                ? "bg-[#0a3542] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Manda AI
          </button>
        </div>

        {safetyErrors.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={14} className="text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">
                Safety checks failed
              </span>
            </div>
            <ul className="ml-6 list-disc">
              {safetyErrors.map((err, i) => (
                <li key={i} className="text-xs text-amber-600">
                  {err}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSafetyErrors([])}
              className="mt-2 text-xs text-amber-600 hover:text-amber-800 underline"
            >
              Dismiss and send anyway
            </button>
          </div>
        )}

        <div className="space-y-5 max-w-2xl">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Start
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                End
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Teams link or room name"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Attendees
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addAttendee();
                }}
                placeholder="Name or Name <email>"
                className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
              />
              <button
                onClick={addAttendee}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
            {attendees.length > 0 && (
              <div className="space-y-1">
                {attendees.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg"
                  >
                    <span className="text-xs text-slate-600">
                      {att.name} ({att.email})
                    </span>
                    <button
                      onClick={() => removeAttendee(i)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Meeting description with Purpose, Desired Outcomes, and Agenda..."
              rows={12}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className={cn(
                "px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                saving
                  ? "bg-slate-100 text-slate-400"
                  : "bg-[#0a3542] text-white hover:bg-[#0a3542]/90"
              )}
            >
              {saving ? "Saving..." : "Create Meeting"}
            </button>
            <button
              onClick={() => router.push("/meetings")}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {showPlugin && (
        <div className="w-80 shrink-0">
          <MandaPlugin
            description={description}
            onGeneratedContent={handleGeneratedContent}
            onSettingsChange={handleSettingsChange}
          />
        </div>
      )}
    </div>
  );
}
