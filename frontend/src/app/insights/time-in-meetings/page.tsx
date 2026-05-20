"use client";

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import MetricCard from "@/components/insights/MetricCard";
import ChartCard from "@/components/insights/ChartCard";
import FilterBar from "@/components/insights/FilterBar";
import type { InsightFilter } from "@/types/insights";
import {
  TIME_IN_MEETINGS_METRICS,
  HOURS_OVER_TIME,
  HOURS_BY_DAY,
  HOURS_BY_HOUR,
  RECURRING_VS_ADHOC,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/mock-insights-data";

const COLORS = {
  recurring: "#3b82f6",
  adhoc: "#1ADEB0",
};

const PIE_COLORS = ["#3b82f6", "#1ADEB0"];

const pieData = [
  { name: "Recurring", value: RECURRING_VS_ADHOC.recurring },
  { name: "Ad-Hoc", value: RECURRING_VS_ADHOC.adhoc },
];

export default function TimeInMeetingsPage() {
  const [filters, setFilters] = useState<InsightFilter>({
    company: "",
    country: "",
    role: "",
    team: "",
    department: "",
    employee: "",
    timeFrame: "month",
  });

  const [groupBy, setGroupBy] = useState<"grouped" | "stacked" | "none">("grouped");

  return (
    <div className="p-8 overflow-y-auto h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0a3542] mb-1">Time in Meetings</h1>
        <p className="text-slate-500 text-sm">
          Understand how employee time is allocated across recurring and ad-hoc meetings.
        </p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Employee Cost"
          value={formatCurrency(TIME_IN_MEETINGS_METRICS.totalEmployeeCost)}
          change={4.2}
          trend="up"
        />
        <MetricCard
          label="Total Employee Hours"
          value={formatNumber(TIME_IN_MEETINGS_METRICS.totalEmployeeHours)}
          change={3.8}
          trend="up"
        />
        <MetricCard
          label="Total Number of Meetings"
          value={formatNumber(TIME_IN_MEETINGS_METRICS.totalMeetings)}
          change={5.1}
          trend="up"
        />
        <MetricCard
          label="% of Employee Time"
          value={formatPercent(TIME_IN_MEETINGS_METRICS.percentEmployeeTime)}
          change={1.2}
          trend="up"
        />
      </div>

      {/* Hours Over Time */}
      <ChartCard
        title="Employee Hours Over Time"
        subtitle="Recurring vs Ad-Hoc meetings"
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          {(["grouped", "stacked", "none"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setGroupBy(mode)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                groupBy === mode
                  ? "bg-[#0a3542] text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={HOURS_OVER_TIME}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
            />
            <Legend />
            {groupBy !== "none" && (
              <Bar
                dataKey="recurring"
                name="Recurring"
                fill={COLORS.recurring}
                stackId={groupBy === "stacked" ? "stack" : undefined}
                radius={groupBy === "stacked" ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              />
            )}
            {groupBy !== "none" && (
              <Bar
                dataKey="adhoc"
                name="Ad-Hoc"
                fill={COLORS.adhoc}
                stackId={groupBy === "stacked" ? "stack" : undefined}
                radius={groupBy === "stacked" ? [4, 4, 0, 0] : [4, 4, 0, 0]}
              />
            )}
            {groupBy === "none" && (
              <Line
                type="monotone"
                dataKey="recurring"
                name="Recurring"
                stroke={COLORS.recurring}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            )}
            {groupBy === "none" && (
              <Line
                type="monotone"
                dataKey="adhoc"
                name="Ad-Hoc"
                stroke={COLORS.adhoc}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* By Day & By Hour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Employee Hours by Day of Week">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={HOURS_BY_DAY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="value" name="Hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Employee Hours by Hour of Day">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={HOURS_BY_HOUR}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="value" name="Hours" fill="#1ADEB0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Pie Chart */}
      <ChartCard title="Recurring vs Ad-Hoc Meeting Hours" className="mb-6">
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }}
                formatter={((value: number) => formatNumber(value) + " hrs") as never}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
