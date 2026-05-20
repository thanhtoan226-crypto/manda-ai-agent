"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InsightFilter } from "@/types/insights";
import { FILTER_OPTIONS } from "@/lib/mock-insights-data";

interface FilterBarProps {
  filters: InsightFilter;
  onChange: (filters: InsightFilter) => void;
}

const TIME_FRAMES: { value: InsightFilter["timeFrame"]; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const update = (key: keyof InsightFilter, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <FilterSelect
        label="Company"
        value={filters.company}
        options={FILTER_OPTIONS.companies}
        onChange={(v) => update("company", v)}
      />
      <FilterSelect
        label="Country"
        value={filters.country}
        options={FILTER_OPTIONS.countries}
        onChange={(v) => update("country", v)}
      />
      <FilterSelect
        label="Department"
        value={filters.department}
        options={FILTER_OPTIONS.departments}
        onChange={(v) => update("department", v)}
      />
      <FilterSelect
        label="Team"
        value={filters.team}
        options={FILTER_OPTIONS.teams}
        onChange={(v) => update("team", v)}
      />
      <FilterSelect
        label="Employee"
        value={filters.employee}
        options={FILTER_OPTIONS.employees}
        onChange={(v) => update("employee", v)}
      />

      <div className="ml-auto flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-0.5">
        {TIME_FRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => update("timeFrame", tf.value)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
              filters.timeFrame === tf.value
                ? "bg-[#0a3542] text-white"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {tf.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6] cursor-pointer"
      >
        <option value="">All {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}
