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
