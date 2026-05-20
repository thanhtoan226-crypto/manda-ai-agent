"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
  trend?: "up" | "down" | "flat";
}

export default function MetricCard({ label, value, change, trend }: MetricCardProps) {
  const isCost = label.toLowerCase().includes("cost");
  const isPositive = (trend === "up" && !isCost) || (trend === "down" && isCost);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-[#0a3542]">{value}</p>
      {change !== undefined && (
        <div className={cn("flex items-center gap-1 mt-2 text-sm font-medium", {
          "text-emerald-600": isPositive,
          "text-red-500": !isPositive && trend !== "flat",
          "text-slate-400": trend === "flat",
        })}>
          {trend === "up" && <TrendingUp size={14} />}
          {trend === "down" && <TrendingDown size={14} />}
          {trend === "flat" && <Minus size={14} />}
          {change > 0 ? "+" : ""}{change.toFixed(1)}%
        </div>
      )}
    </div>
  );
}
