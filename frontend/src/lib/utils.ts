import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function badgeClass(value: string | undefined) {
  if (!value) return "bg-slate-100 text-slate-700";
  const lower = value.toLowerCase();
  if (["high", "keep", "overloaded"].includes(lower)) return "bg-red-100 text-red-700";
  if (["medium", "merge", "above avg"].includes(lower)) return "bg-yellow-100 text-yellow-700";
  if (["low", "eliminate", "under-utilised"].includes(lower)) return "bg-green-100 text-green-700";
  if (["optimal"].includes(lower)) return "bg-emerald-100 text-emerald-700";
  return "bg-slate-100 text-slate-700";
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
