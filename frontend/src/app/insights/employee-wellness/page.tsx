"use client";

import { Heart, Construction } from "lucide-react";

export default function EmployeeWellnessPage() {
  return (
    <div className="p-8 overflow-y-auto h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart size={28} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-[#0a3542] mb-2">Employee Wellness</h2>
        <p className="text-slate-500 text-sm max-w-md">
          This dashboard is coming soon. It will provide insights into work-life balance indicators,
          meeting overload, focus time, and after-hours collaboration patterns.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-slate-400 text-xs">
          <Construction size={14} />
          Under development
        </div>
      </div>
    </div>
  );
}
