"use client";

import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import MetricCard from "@/components/insights/MetricCard";
import ChartCard from "@/components/insights/ChartCard";
import FilterBar from "@/components/insights/FilterBar";
import DataTable from "@/components/insights/DataTable";
import type { InsightFilter } from "@/types/insights";
import {
  SIZE_ADOPTION_METRICS,
  LARGE_MEETINGS_OVER_TIME,
  MEETINGS_BY_SIZE,
  MEETINGS_BY_DURATION,
  ACCEPTANCE_BY_SIZE,
  ORGANISERS_TABLE,
  QUALITY_METRICS,
  QUALITY_OVER_TIME,
  RECURRING_VS_ADHOC_QUALITY,
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/lib/mock-insights-data";

type Tab = "size-adoption" | "quality";

export default function MeetingEffectivenessPage() {
  const [tab, setTab] = useState<Tab>("size-adoption");
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
        <h1 className="text-2xl font-bold text-[#0a3542] mb-1">Meeting Effectiveness</h1>
        <p className="text-slate-500 text-sm">
          Analyse meeting size, adoption rates, and preparation quality across the organisation.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit mb-6">
        <button
          onClick={() => setTab("size-adoption")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            tab === "size-adoption"
              ? "bg-white text-[#0a3542] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          Size & Adoption
        </button>
        <button
          onClick={() => setTab("quality")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-colors",
            tab === "quality"
              ? "bg-white text-[#0a3542] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          Quality
        </button>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {tab === "size-adoption" && <SizeAdoptionTab groupBy={groupBy} setGroupBy={setGroupBy} />}
      {tab === "quality" && <QualityTab />}
    </div>
  );
}

function SizeAdoptionTab({
  groupBy,
  setGroupBy,
}: {
  groupBy: "grouped" | "stacked" | "none";
  setGroupBy: (v: "grouped" | "stacked" | "none") => void;
}) {
  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard
          label="Large Meeting Cost"
          value={formatCurrency(SIZE_ADOPTION_METRICS.largeMeetingCost)}
          change={6.4}
          trend="up"
        />
        <MetricCard
          label="Large Meeting % of Meetings"
          value={formatPercent(SIZE_ADOPTION_METRICS.largeMeetingPctMeetings)}
          change={2.1}
          trend="up"
        />
        <MetricCard
          label="Large Meeting % of Employee Time"
          value={formatPercent(SIZE_ADOPTION_METRICS.largeMeetingPctEmployeeTime)}
          change={3.4}
          trend="up"
        />
        <MetricCard
          label="Speedy Meeting Adoption"
          value={formatPercent(SIZE_ADOPTION_METRICS.speedyAdoption)}
          change={8.2}
          trend="up"
        />
        <MetricCard
          label="Response Rate"
          value={formatPercent(SIZE_ADOPTION_METRICS.responseRate)}
          change={1.8}
          trend="up"
        />
      </div>

      {/* Large Meetings Over Time */}
      <ChartCard title="Large Meeting Count Over Time" subtitle="Recurring vs Ad-Hoc" className="mb-6">
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
          <BarChart data={LARGE_MEETINGS_OVER_TIME}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
            <Legend />
            {groupBy !== "none" && (
              <Bar
                dataKey="recurring"
                name="Recurring"
                fill="#3b82f6"
                stackId={groupBy === "stacked" ? "stack" : undefined}
                radius={groupBy === "stacked" ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              />
            )}
            {groupBy !== "none" && (
              <Bar
                dataKey="adhoc"
                name="Ad-Hoc"
                fill="#1ADEB0"
                stackId={groupBy === "stacked" ? "stack" : undefined}
                radius={groupBy === "stacked" ? [4, 4, 0, 0] : [4, 4, 0, 0]}
              />
            )}
            {groupBy === "none" && (
              <Line type="monotone" dataKey="recurring" name="Recurring" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            )}
            {groupBy === "none" && (
              <Line type="monotone" dataKey="adhoc" name="Ad-Hoc" stroke="#1ADEB0" strokeWidth={2} dot={{ r: 3 }} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* By Size, Duration, Acceptance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ChartCard title="Meetings by Size">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MEETINGS_BY_SIZE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis dataKey="size" type="category" tick={{ fontSize: 12 }} stroke="#94a3b8" width={60} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="count" name="Meetings" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Meetings by Duration">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MEETINGS_BY_DURATION}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="duration" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Bar dataKey="count" name="Meetings" fill="#1ADEB0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Acceptance Rate by Meeting Size">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ACCEPTANCE_BY_SIZE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="size" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Legend />
              <Bar dataKey="accepted" name="Accepted" fill="#3b82f6" stackId="a" />
              <Bar dataKey="declined" name="Declined" fill="#ef4444" stackId="a" />
              <Bar dataKey="noResponse" name="No Response" fill="#94a3b8" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Organisers Table */}
      <ChartCard title="Top Organisers by Company">
        <DataTable
          headers={["Organiser", "Company", "Meetings", "Hours", "Cost", "Acceptance Rate"]}
          rows={ORGANISERS_TABLE.map((r) => [
            r.organiser,
            r.company,
            formatNumber(r.totalMeetings),
            formatNumber(r.totalHours),
            formatCurrency(r.totalCost),
            formatPercent(r.avgAcceptanceRate),
          ])}
        />
      </ChartCard>
    </>
  );
}

function QualityTab() {
  const [qualityGroupBy, setQualityGroupBy] = useState<"grouped" | "stacked" | "none">("grouped");

  const qualityMetricKeys = ["agendaUsage", "desiredOutcomes", "hasPurpose", "contextClarity"] as const;
  const qualityMetricColors: Record<string, string> = {
    qualityScore: "#3b82f6",
    agendaUsage: "#1ADEB0",
    desiredOutcomes: "#f59e0b",
    hasPurpose: "#8b5cf6",
    contextClarity: "#ef4444",
  };

  return (
    <>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard
          label="Quality Score"
          value={formatPercent(QUALITY_METRICS.qualityScore)}
          change={3.2}
          trend="up"
        />
        <MetricCard
          label="Agenda Usage"
          value={formatPercent(QUALITY_METRICS.agendaUsage)}
          change={2.8}
          trend="up"
        />
        <MetricCard
          label="Desired Outcomes"
          value={formatPercent(QUALITY_METRICS.desiredOutcomes)}
          change={4.6}
          trend="up"
        />
        <MetricCard
          label="Has Purpose"
          value={formatPercent(QUALITY_METRICS.hasPurpose)}
          change={1.4}
          trend="up"
        />
        <MetricCard
          label="Context Clarity"
          value={formatPercent(QUALITY_METRICS.contextClarity)}
          change={3.1}
          trend="up"
        />
      </div>

      {/* Quality Score Over Time */}
      <ChartCard title="Quality Score Over Time" subtitle="All preparation metrics" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {(["grouped", "stacked", "none"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setQualityGroupBy(mode)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                qualityGroupBy === mode
                  ? "bg-[#0a3542] text-white"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={QUALITY_OVER_TIME}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
            <Legend />
            <Line type="monotone" dataKey="qualityScore" name="Quality Score" stroke={qualityMetricColors.qualityScore} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="agendaUsage" name="Agenda Usage" stroke={qualityMetricColors.agendaUsage} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="desiredOutcomes" name="Desired Outcomes" stroke={qualityMetricColors.desiredOutcomes} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="hasPurpose" name="Has Purpose" stroke={qualityMetricColors.hasPurpose} strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="contextClarity" name="Context Clarity" stroke={qualityMetricColors.contextClarity} strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Recurring vs Ad-Hoc Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Preparation Metrics Over Time" subtitle="Recurring meetings only">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={QUALITY_OVER_TIME}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Legend />
              {qualityMetricKeys.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                  stroke={qualityMetricColors[key]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Recurring vs Ad-Hoc Preparation Quality">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={RECURRING_VS_ADHOC_QUALITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13 }} />
              <Legend />
              <Bar dataKey="recurring" name="Recurring" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="adhoc" name="Ad-Hoc" fill="#1ADEB0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Organisers Table */}
      <ChartCard title="Organisers by Company">
        <DataTable
          headers={["Organiser", "Company", "Meetings", "Hours", "Cost", "Acceptance Rate"]}
          rows={ORGANISERS_TABLE.map((r) => [
            r.organiser,
            r.company,
            formatNumber(r.totalMeetings),
            formatNumber(r.totalHours),
            formatCurrency(r.totalCost),
            formatPercent(r.avgAcceptanceRate),
          ])}
        />
      </ChartCard>
    </>
  );
}
