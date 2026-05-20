"use client";

import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 p-5", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#0a3542]">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
