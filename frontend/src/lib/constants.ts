export const REPORT_CATEGORIES = [
  "People & Culture",
  "Meetings",
  "Wellness",
  "Compliance",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "People & Culture": "bg-blue-100 text-blue-700",
  Meetings: "bg-amber-100 text-amber-700",
  Wellness: "bg-emerald-100 text-emerald-700",
  Compliance: "bg-purple-100 text-purple-700",
};

export const CATEGORY_BORDER_COLORS: Record<string, string> = {
  "People & Culture": "border-l-blue-500",
  Meetings: "border-l-amber-500",
  Wellness: "border-l-emerald-500",
  Compliance: "border-l-purple-500",
};

export const MEETING_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  BLUE: { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-700", dot: "bg-blue-500" },
  GREEN: { bg: "bg-green-100", border: "border-green-300", text: "text-green-700", dot: "bg-green-500" },
  RED: { bg: "bg-red-100", border: "border-red-300", text: "text-red-700", dot: "bg-red-500" },
  YELLOW: { bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-700", dot: "bg-yellow-500" },
  PURPLE: { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-700", dot: "bg-purple-500" },
  ORANGE: { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-700", dot: "bg-orange-500" },
};

export const PERSONALITY_OPTIONS = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "corporate", label: "Corporate" },
  { value: "friendly", label: "Friendly" },
  { value: "direct", label: "Direct" },
] as const;

export const SAFETY_CHECK_OPTIONS = [
  { value: "missing_agenda", label: "Missing agenda" },
  { value: "missing_purpose_outcome", label: "Missing purpose/outcome" },
  { value: "missing_description", label: "Missing description" },
  { value: "missing_attendees", label: "No attendees added" },
  { value: "missing_duration", label: "Missing duration" },
] as const;
