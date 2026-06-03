"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createSchedule } from "@/lib/api";

interface ScheduleModalProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
}

const FREQUENCIES = ["Daily", "Weekly", "Bi-weekly", "Monthly", "Before the meeting"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DEFAULT_STATE = {
  frequency: "Weekly",
  dayOfWeek: "Monday",
  time: "09:00",
  minutesBefore: 30,
  recipients: "",
  saving: false,
  saved: false,
};

export default function ScheduleModal({ open, onClose, sessionId }: ScheduleModalProps) {
  const [frequency, setFrequency] = useState(DEFAULT_STATE.frequency);
  const [dayOfWeek, setDayOfWeek] = useState(DEFAULT_STATE.dayOfWeek);
  const [time, setTime] = useState(DEFAULT_STATE.time);
  const [minutesBefore, setMinutesBefore] = useState(DEFAULT_STATE.minutesBefore);
  const [recipients, setRecipients] = useState(DEFAULT_STATE.recipients);
  const [saving, setSaving] = useState(DEFAULT_STATE.saving);
  const [saved, setSaved] = useState(DEFAULT_STATE.saved);

  useEffect(() => {
    if (open) {
      setFrequency(DEFAULT_STATE.frequency);
      setDayOfWeek(DEFAULT_STATE.dayOfWeek);
      setTime(DEFAULT_STATE.time);
      setMinutesBefore(DEFAULT_STATE.minutesBefore);
      setRecipients(DEFAULT_STATE.recipients);
      setSaving(DEFAULT_STATE.saving);
      setSaved(DEFAULT_STATE.saved);
    }
  }, [open]);

  if (!open) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await createSchedule(sessionId, {
        frequency: frequency.toLowerCase(),
        day_of_week: frequency !== "Daily" && frequency !== "Monthly" && frequency !== "Before the meeting" ? dayOfWeek : null,
        time,
        minutes_before: frequency === "Before the meeting" ? minutesBefore : null,
        recipients,
      });
      setSaved(true);
      const timer = setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 id="schedule-modal-title" className="text-lg font-semibold text-navy">Schedule Report</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        {saved ? (
          <div className="text-center py-6">
            <div className="text-green-500 text-lg mb-2">Schedule saved!</div>
            <p className="text-sm text-slate-500">Your report will be generated at the configured interval.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {(frequency === "Weekly" || frequency === "Bi-weekly") && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Day of Week</label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {frequency === "Before the meeting" ? (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Minutes Before</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={5}
                    max={480}
                    value={minutesBefore}
                    onChange={(e) => setMinutesBefore(Math.max(5, Math.min(480, Number(e.target.value) || 5)))}
                    className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent"
                  />
                  <span className="text-sm text-slate-500">min before the meeting</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Recipients</label>
              <input
                type="text"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                placeholder="email@example.com, another@example.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
