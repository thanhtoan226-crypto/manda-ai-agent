"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Bot,
  Activity,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Clock,
  Shield,
  MessageCircle,
  BookOpen,
  Settings,
  Star,
  LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INSIGHT_ITEMS = [
  { label: "Time in Meetings", icon: Clock, slug: "time-in-meetings" },
  { label: "Meeting Effectiveness", icon: BarChart3, slug: "meeting-effectiveness" },
  { label: "People Managers", icon: Users, slug: "people-managers" },
  { label: "External Meetings", icon: Activity, slug: "external-meetings" },
  { label: "Employee Wellness", icon: MessageCircle, slug: "employee-wellness" },
  { label: "Meeting Data", icon: Shield, slug: "meeting-data" },
];

export default function Sidebar({
  collapsed,
  onCollapse,
}: {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();
  const [agentsOpen, setAgentsOpen] = useState(true);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const isAgentsActive = pathname === "/" || pathname.startsWith("/workbench") || pathname.startsWith("/pulse");

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 bottom-0 bg-[#0a3542] text-white flex flex-col z-50 border-r border-[#1f242f] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo + Collapse */}
      <div className="flex items-center justify-between px-6 pt-8 pb-6">
        {!collapsed && (
          <Image src="/Logo.svg" alt="Projectmanda" width={160} height={29} priority />
        )}
        <button
          onClick={() => onCollapse(!collapsed)}
          className={cn(
            "flex items-center justify-center w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0",
            collapsed ? "mx-auto" : ""
          )}
        >
          <ChevronLeft
            size={14}
            className={cn("transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-4">
        <div className="flex flex-col gap-2">
          <NavItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/coming-soon?title=Dashboard"
            active={false}
            collapsed={collapsed}
          />
          <NavItem
            icon={Users}
            label="My Team"
            href="/coming-soon?title=My Team"
            active={false}
            collapsed={collapsed}
          />
          <NavItem
            icon={Calendar}
            label="My Meetings"
            href="/coming-soon?title=My Meetings"
            active={false}
            collapsed={collapsed}
          />
          <NavItem
            icon={MessageSquare}
            label="My Manda"
            href="/coming-soon?title=My Manda"
            active={false}
            collapsed={collapsed}
          />

          {/* Agents group */}
          <CollapsibleGroup
            icon={Bot}
            label="Agents"
            open={agentsOpen}
            onToggle={() => setAgentsOpen(!agentsOpen)}
            active={isAgentsActive}
            collapsed={collapsed}
          >
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-colors",
                pathname === "/"
                  ? "text-[#00cca2] bg-[#195160]"
                  : "text-[#cecfd2] hover:text-white hover:bg-white/5"
              )}
            >
              <Star size={14} />
              Browse Agents
            </Link>
            <Link
              href="/pulse"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-colors",
                pathname.startsWith("/pulse")
                  ? "text-[#00cca2] bg-[#195160]"
                  : "text-[#cecfd2] hover:text-white hover:bg-white/5"
              )}
            >
              <Activity size={14} />
              Pulse
            </Link>
          </CollapsibleGroup>

          {/* Insights group */}
          <CollapsibleGroup
            icon={BarChart3}
            label="Insights"
            open={insightsOpen}
            onToggle={() => setInsightsOpen(!insightsOpen)}
            active={insightsOpen}
            collapsed={collapsed}
          >
            {INSIGHT_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={`/coming-soon?title=${encodeURIComponent(item.label)}`}
                className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-[#cecfd2] hover:text-white transition-colors"
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            ))}
          </CollapsibleGroup>

          <NavItem
            icon={Shield}
            label="Organisational Compliance"
            href="/coming-soon?title=Organisational Compliance"
            active={false}
            collapsed={collapsed}
          />
          <NavItem
            icon={MessageCircle}
            label="Feedback"
            href="/coming-soon?title=Feedback"
            active={false}
            collapsed={collapsed}
          />
          <NavItem
            icon={BookOpen}
            label="Learning"
            href="/coming-soon?title=Learning"
            active={false}
            collapsed={collapsed}
          />
          <NavItem
            icon={Settings}
            label="Settings"
            href="/coming-soon?title=Settings"
            active={false}
            collapsed={collapsed}
          />
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 pb-8">
        <NavItem
          icon={LifeBuoy}
          label="Support"
          href="/coming-soon?title=Support"
          active={false}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  active,
  collapsed,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  href: string;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-full text-sm font-semibold transition-colors",
        active
          ? "bg-[#195160] text-[#00cca2]"
          : "text-[#cecfd2] hover:bg-white/5 hover:text-white",
        collapsed && "justify-center px-0"
      )}
      title={collapsed ? label : undefined}
    >
      <span className="shrink-0"><Icon size={18} /></span>
      {!collapsed && label}
    </Link>
  );
}

function CollapsibleGroup({
  icon: Icon,
  label,
  open,
  onToggle,
  active,
  collapsed,
  children,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  open: boolean;
  onToggle: () => void;
  active: boolean;
  collapsed: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2 rounded-full text-sm font-semibold transition-colors",
          active
            ? "bg-[#195160] text-[#00cca2]"
            : "text-[#cecfd2] hover:bg-white/5",
          collapsed && "justify-center px-0"
        )}
        title={collapsed ? label : undefined}
      >
        <span className="shrink-0"><Icon size={18} /></span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </>
        )}
      </button>
      {!collapsed && open && (
        <div className="ml-7 mt-2 flex flex-col gap-1">
          {children}
        </div>
      )}
    </div>
  );
}
