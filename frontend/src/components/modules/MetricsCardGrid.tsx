"use client";

import {
  Clock,
  Calendar,
  Users,
  PieChart,
  Mail,
  Globe,
  Rocket,
  UserCheck,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ArrowUpDown,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  TrendingUp,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MetricData {
  label: string;
  value: string;
  median?: string;
  position?: string;
}

interface MetricsCardGridProps {
  metrics: MetricData[];
  summaryText?: string;
}

const METRIC_ICONS: Record<string, typeof Clock> = {
  "monthly meeting": Clock,
  "% of working time": Calendar,
  "meetings per month": Users,
  "top meeting category": PieChart,
  "outside-hours": Clock,
  "meetings organised": Users,
  "response rate": Mail,
  "external meeting": Globe,
  "speedy meeting": Rocket,
  "large meeting": UserCheck,
  "total meeting cost": Activity,
  "avg meeting hours": Clock,
  "meeting growth": TrendingUp,
  "avg quality": SlidersHorizontal,
  "agenda usage": SlidersHorizontal,
  "1-on-1 coverage": UserCheck,
  "after-hours": Clock,
  "team size": Users,
  "team meeting": Users,
  "recurring meeting": Clock,
  "monthly recurring": Clock,
  "avg meeting size": Users,
  "declining attendance": ArrowDownRight,
  "calendar from recurring": Calendar,
  "meeting count": Users,
};

function getIcon(label: string) {
  const lower = label.toLowerCase();
  for (const [key, Icon] of Object.entries(METRIC_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return Activity;
}

type PositionCategory = "green" | "dark-green" | "gray" | "red" | "blue";

function categorizePosition(position?: string): PositionCategory {
  if (!position) return "gray";
  const lower = position.toLowerCase();

  // Dark green — top performers
  if (
    lower.includes("top of cohort") ||
    lower.includes("top performer") ||
    lower.includes("exceptional")
  ) {
    return "dark-green";
  }

  // Green — above median / positive signals
  if (
    lower.includes("above median") ||
    lower.includes("above peer") ||
    lower.includes("slightly above") ||
    lower.includes("active organiser") ||
    lower.includes("active organizer") ||
    lower.includes("positive signal") ||
    lower.includes("minimal")
  ) {
    return "green";
  }

  // Red — below median
  if (lower.includes("below median") || lower.includes("below peer")) {
    return "red";
  }

  // Blue — informational / contextual
  if (
    lower.includes("heavy") ||
    lower.includes("above typical") ||
    lower.includes("high alignment") ||
    lower.includes("above avg")
  ) {
    return "blue";
  }

  // Gray — middle / neutral
  return "gray";
}

const BADGE_STYLES: Record<PositionCategory, string> = {
  "dark-green": "bg-emerald-100 text-emerald-800",
  green: "bg-green-100 text-green-800",
  gray: "bg-slate-100 text-slate-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-800",
};

const BADGE_ICONS: Record<PositionCategory, typeof ArrowUpRight> = {
  "dark-green": CheckCircle2,
  green: ArrowUpRight,
  gray: Minus,
  red: ArrowDownRight,
  blue: TrendingUp,
};

function MetricCard({ metric }: { metric: MetricData }) {
  const Icon = getIcon(metric.label);
  const category = categorizePosition(metric.position);
  const badgeStyle = BADGE_STYLES[category];
  const BadgeIcon = BADGE_ICONS[category];
  const showMedian = metric.median && metric.median !== "—";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Top: Label + Icon */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-slate-600 font-medium leading-snug pr-2">{metric.label}</p>
        <div className="w-[18px] h-[18px] shrink-0 flex items-center justify-center mt-0.5">
          <Icon size={18} className="text-slate-400" />
        </div>
      </div>

      {/* Middle: Value */}
      <p className="text-2xl font-bold text-[#0a3542] mb-1">{metric.value}</p>

      {/* Lower-middle: Peer Median */}
      {showMedian && (
        <p className="text-xs text-slate-400 mb-3">
          Peer Median: {metric.median}
        </p>
      )}
      {!showMedian && <div className="h-4 mb-3" />}

      {/* Bottom: Position Badge — pushes to bottom via mt-auto */}
      <div className="mt-auto">
        {metric.position ? (
          <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", badgeStyle)}>
            <BadgeIcon size={12} />
            {metric.position}
          </div>
        ) : (
          <div className="h-6" />
        )}
      </div>
    </div>
  );
}

export default function MetricsCardGrid({ metrics, summaryText }: MetricsCardGridProps) {
  return (
    <div>
      {/* Title + Summary */}
      <div className="mb-4">
        {summaryText && (
          <div className="prose prose-sm max-w-none prose-p:my-0 prose-p:text-sm prose-p:text-slate-700 mb-3">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{summaryText}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex items-center justify-between mb-4">
        <div />
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <SlidersHorizontal size={15} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <LayoutGrid size={15} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <List size={15} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <ArrowUpDown size={15} />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            <Search size={15} />
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <MetricCard key={i} metric={metric} />
        ))}
      </div>
    </div>
  );
}
