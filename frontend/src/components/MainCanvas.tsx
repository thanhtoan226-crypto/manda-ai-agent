"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  FileText,
  MessageCircle,
  EyeOff,
  Eye,
  CalendarClock,
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
  Shield,
  HelpCircle,
  Sparkles,
  Send,
  X,
} from "lucide-react";
import type { ContentModule, ChatMessage } from "@/types/session";
import { streamChat } from "@/lib/api";

// --- Agent Configuration ---

interface AgentMode {
  id: string;
  label: string;
  description: string;
}

interface AgentConfig {
  firstStep: string;
  subjectLabel: string;
  subjects: string[] | Record<string, string[]>;
  modes: AgentMode[];
  tableHeaders: { key: string; label: string }[];
  badgeLabels: { cost: string; alignment: string };
  verifySource: string;
  stepLabels: { subject: string };
}

const AGENT_CONFIGS: Record<string, AgentConfig> = {
  "agent-1on1": {
    firstStep: "select-employee",
    subjectLabel: "Select a direct report",
    subjects: [
      "Chris Petersen",
      "Mart Thompson",
      "Damien Nguyen",
      "Jessie Martinez",
      "Johnny Walsh",
      "Jackson Lee",
    ],
    modes: [
      { id: "coaching", label: "Coaching & Support", description: "Strengths-first, warm tone, for growth and wellbeing" },
      { id: "performance", label: "Performance Review Prep", description: "Evidence-based, balanced, for formal reviews" },
      { id: "workload", label: "Workload Concern", description: "Volume/trend data, caring but factual, for capacity signals" },
      { id: "investigation", label: "Investigation", description: "Direct/factual, data-driven, for engagement concerns" },
    ],
    tableHeaders: [
      { key: "meeting", label: "Meeting" },
      { key: "hours", label: "Frequency" },
      { key: "cost", label: "Cost" },
      { key: "intent", label: "Attendees" },
      { key: "alignment", label: "Priority" },
    ],
    badgeLabels: { cost: "Cost", alignment: "Priority" },
    verifySource: "Source: Calendar integration (Outlook + Google Calendar)\n- Period: Last 30 days\n- Confidence: 94%\n- Sample size: 118 meetings analyzed\n- Methodology: Peer comparison against 69 Engineering Managers at REA Group",
    stepLabels: { subject: "Subject" },
  },
  "agent-executive": {
    firstStep: "select-scope",
    subjectLabel: "Select target scope",
    subjects: [
      "Company-wide",
      "Engineering",
      "Product",
      "Design",
      "Marketing",
      "Sales",
      "Operations",
    ],
    modes: [
      { id: "talent", label: "Talent Focus", description: "People-centric signals: engagement, burnout risk, 1-on-1 coverage" },
      { id: "board-ready", label: "Board-Ready", description: "Executive summary with key metrics, trends, and cost impact" },
      { id: "capacity", label: "Capacity Review", description: "Workload distribution, meeting overload, and resource utilisation" },
      { id: "risk", label: "Risk Assessment", description: "Red flags: declining quality, attendance drops, compliance gaps" },
    ],
    tableHeaders: [
      { key: "meeting", label: "Team" },
      { key: "hours", label: "Hrs/Employee" },
      { key: "cost", label: "Cost" },
      { key: "intent", label: "Large Meeting %" },
      { key: "alignment", label: "Health" },
    ],
    badgeLabels: { cost: "Cost", alignment: "Health" },
    verifySource: "Source: Organization-wide calendar analytics\n- Period: Last month\n- Confidence: 91%\n- Sample size: 2,847 employees across 7 departments\n- Methodology: Department-level aggregation with per-capita normalization",
    stepLabels: { subject: "Scope" },
  },
  "agent-recurring": {
    firstStep: "skip-to-timeframe",
    subjectLabel: "Your recurring meetings",
    subjects: [],
    modes: [
      { id: "cost", label: "Cost Optimisation", description: "Focus on time and money waste, consolidation opportunities" },
      { id: "quality", label: "Quality Review", description: "Focus on agenda usage, purpose clarity, and desired outcomes" },
      { id: "attendance", label: "Attendance & Engagement", description: "Focus on declining rates, no-response patterns, and participation" },
    ],
    tableHeaders: [
      { key: "meeting", label: "Meeting" },
      { key: "hours", label: "Frequency" },
      { key: "cost", label: "Cost" },
      { key: "intent", label: "Avg Attendees" },
      { key: "alignment", label: "Verdict" },
    ],
    badgeLabels: { cost: "Cost", alignment: "Verdict" },
    verifySource: "Source: Recurring meeting audit from calendar data\n- Period: Last quarter\n- Confidence: 93%\n- Sample size: 14 recurring meetings analyzed\n- Methodology: Cost modeling with blended rate of $120/hr/attendee",
    stepLabels: { subject: "Scope" },
  },
  "agent-team-health": {
    firstStep: "select-department",
    subjectLabel: "Select department and team",
    subjects: {
      Engineering: ["Platform", "Frontend", "Backend", "Data", "DevOps"],
      Product: ["Search", "Marketplace", "Payments"],
      Design: ["UX Research", "Product Design", "Brand"],
      Marketing: ["Growth", "Content", "Analytics"],
      Sales: ["Enterprise", "SMB", "Partnerships"],
    },
    modes: [
      { id: "coaching", label: "Coaching & Support", description: "Team morale and wellbeing focus, strengths-first framing" },
      { id: "performance", label: "Performance Review", description: "Team metrics vs benchmarks, evaluative comparison" },
      { id: "workload", label: "Workload Concern", description: "Capacity and burnout signals across the team" },
      { id: "investigation", label: "Investigation", description: "Engagement and participation patterns, direct factual framing" },
    ],
    tableHeaders: [
      { key: "meeting", label: "Member" },
      { key: "hours", label: "Meeting Hours" },
      { key: "cost", label: "Load" },
      { key: "intent", label: "After-Hours" },
      { key: "alignment", label: "Status" },
    ],
    badgeLabels: { cost: "Load", alignment: "Status" },
    verifySource: "Source: Team meeting health analytics\n- Period: Last month\n- Confidence: 90%\n- Sample size: 12 team members, 286 meetings\n- Methodology: Team-level comparison against org-wide benchmarks",
    stepLabels: { subject: "Team" },
  },
};

const DEFAULT_CONFIG = AGENT_CONFIGS["agent-1on1"];

const TIME_FRAMES = ["Last week", "Last month", "Last quarter", "Last 6 months"];

type ConversationStep =
  | "select-employee"
  | "select-scope"
  | "select-department"
  | "select-team"
  | "skip-to-timeframe"
  | "select-timeframe"
  | "select-mode"
  | "confirm"
  | "generating"
  | "content";

// --- Main Component ---

interface MainCanvasProps {
  sessionTitle: string;
  sessionId: string;
  agentId: string;
  agentName: string;
  mode: string | null;
  modules: ContentModule[];
  excludedItemIds: Set<string>;
  onSetMode: (mode: string) => void;
  onToggleUnpin: (itemId: string) => void;
  onDrillDown: (chipId: string) => Promise<string>;
  reportMarkdown: string;
  onUpdateReport: (markdown: string) => void;
  onOpenSchedule: () => void;
  onAskQuestion: (chipId: string, chipLabel: string, question: string) => void;
  chatMessages: ChatMessage[];
  onChatMessagesUpdate: (messages: ChatMessage[]) => void;
  onApplyToReport: (content: string) => void;
  showToast: (message: string) => void;
}

export default function MainCanvas({
  sessionTitle,
  sessionId,
  agentId,
  agentName,
  mode,
  modules,
  excludedItemIds,
  onSetMode,
  onToggleUnpin,
  onDrillDown,
  reportMarkdown,
  onUpdateReport,
  onOpenSchedule,
  onAskQuestion,
  chatMessages,
  onChatMessagesUpdate,
  onApplyToReport,
  showToast,
}: MainCanvasProps) {
  const [viewMode, setViewMode] = useState<"conversation" | "report">("conversation");
  const [drillDownContent, setDrillDownContent] = useState<Record<string, string>>({});
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const config = AGENT_CONFIGS[agentId] || DEFAULT_CONFIG;

  // Reset drill-down state when switching sessions
  useEffect(() => {
    setDrillDownContent({});
    setLoadingItemId(null);
  }, [sessionId]);

  const handleDrillDown = useCallback(
    async (itemId: string, chipId: string) => {
      setLoadingItemId(itemId);
      try {
        const content = await onDrillDown(chipId);
        setDrillDownContent((prev) => ({ ...prev, [itemId]: content }));
      } finally {
        setLoadingItemId(null);
      }
    },
    [onDrillDown]
  );

  const handleActionContent = useCallback(
    (itemId: string, content: string) => {
      setDrillDownContent((prev) => ({ ...prev, [itemId]: content }));
    },
    []
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-navy">{sessionTitle}</h2>
          {excludedItemIds.size > 0 && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              <EyeOff size={12} />
              {excludedItemIds.size} excluded
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSchedule}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <CalendarClock size={15} />
            Schedule
          </button>
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors",
              chatOpen
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Sparkles size={15} />
            Chat
          </button>
          <button
            onClick={() => setViewMode(viewMode === "conversation" ? "report" : "conversation")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            {viewMode === "conversation" ? (
              <>
                <FileText size={15} />
                Report View
              </>
            ) : (
              <>
                <MessageCircle size={15} />
                Conversation View
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === "conversation" ? (
          <ConversationView
            key={sessionId}
            config={config}
            mode={mode}
            modules={modules}
            excludedItemIds={excludedItemIds}
            onSetMode={onSetMode}
            onToggleUnpin={onToggleUnpin}
            loadingItemId={loadingItemId}
            drillDownContent={drillDownContent}
            onDrillDown={handleDrillDown}
            onActionContent={handleActionContent}
            onAskQuestion={onAskQuestion}
          />
        ) : (
          <ReportView
            markdown={reportMarkdown}
            modules={modules}
            excludedItemIds={excludedItemIds}
            config={config}
            editing={editingReport}
            onToggleEdit={() => setEditingReport(!editingReport)}
            onUpdate={onUpdateReport}
            showToast={showToast}
          />
        )}
      </div>

      {/* Chat Drawer */}
      {chatOpen && (
        <ChatDrawer
          sessionId={sessionId}
          mode={mode}
          messages={chatMessages}
          onMessagesUpdate={onChatMessagesUpdate}
          onApplyToReport={onApplyToReport}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

// --- Conversation View ---

function ConversationView({
  config,
  mode,
  modules,
  excludedItemIds,
  onSetMode,
  onToggleUnpin,
  loadingItemId,
  drillDownContent,
  onDrillDown,
  onActionContent,
  onAskQuestion,
}: {
  config: AgentConfig;
  mode: string | null;
  modules: ContentModule[];
  excludedItemIds: Set<string>;
  onSetMode: (mode: string) => void;
  onToggleUnpin: (itemId: string) => void;
  loadingItemId: string | null;
  drillDownContent: Record<string, string>;
  onDrillDown: (itemId: string, chipId: string) => void;
  onActionContent: (itemId: string, content: string) => void;
  onAskQuestion: (chipId: string, chipLabel: string, question: string) => void;
}) {
  const hasContent = mode !== null && modules.length > 0;
  const [step, setStep] = useState<ConversationStep>(
    hasContent ? "content" : (config.firstStep as ConversationStep)
  );
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [customTimeFrame, setCustomTimeFrame] = useState("");

  useEffect(() => {
    if (mode !== null && modules.length > 0) {
      setStep("content");
    }
  }, [mode, modules]);

  useEffect(() => {
    if (mode !== null && modules.length === 0 && step !== "generating") {
      setStep("generating");
    }
  }, [mode, modules, step]);

  const handleGenerate = () => {
    if (selectedMode) {
      onSetMode(selectedMode);
      setStep("generating");
    }
  };

  // Build step list dynamically based on agent config
  const stepList = (() => {
    const steps: { key: ConversationStep; label: string }[] = [];
    if (config.firstStep === "select-employee") {
      steps.push({ key: "select-employee", label: config.stepLabels.subject });
    } else if (config.firstStep === "select-scope") {
      steps.push({ key: "select-scope", label: config.stepLabels.subject });
    } else if (config.firstStep === "select-department") {
      steps.push({ key: "select-department", label: "Department" });
      steps.push({ key: "select-team", label: "Team" });
    }
    // skip-to-timeframe agents have no subject step
    steps.push({ key: "select-timeframe", label: "Time Frame" });
    steps.push({ key: "select-mode", label: "Mode" });
    steps.push({ key: "confirm", label: "Confirm" });
    return steps;
  })();

  const stepOrder: ConversationStep[] = [
    ...stepList.map((s) => s.key),
    "generating",
    "content",
  ];
  const currentStepIndex = stepOrder.indexOf(step);

  // Content view
  if (step === "content") {
    return (
      <div className="p-6 space-y-6">
        {modules.map((module) => {
          const dataChips = module.chips.filter(
            (chip) => chip.id.endsWith("-data") || chip.id === "chip-data"
          );
          const insightChips = module.chips.filter(
            (chip) => !chip.id.endsWith("-data") && chip.id !== "chip-data"
          );

          return (
            <div key={module.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-navy mb-3">{module.title}</h3>

              {dataChips.map((chip) => {
                const dataContent = module.content[chip.id];
                return dataContent ? (
                  <ChipContent key={chip.id} data={dataContent} config={config} />
                ) : null;
              })}

              {insightChips.map((chip) => {
                const chipContent = module.content[chip.id];
                if (!chipContent || typeof chipContent !== "object") return null;

                const d = chipContent as Record<string, unknown>;
                const items = Array.isArray(d.items) ? (d.items as string[]) : null;
                const table = Array.isArray(d.table) ? (d.table as Array<Record<string, string>>) : null;

                return (
                  <div key={chip.id} className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-500 mb-3">{chip.label}</h4>

                    {items && (
                      <div className="space-y-3">
                        {items.map((item, index) => {
                          const itemId = `${module.id}::${chip.id}::${index}`;
                          return (
                            <ItemBlock
                              key={itemId}
                              itemId={itemId}
                              text={item}
                              chipId={chip.id}
                              chipLabel={chip.label}
                              excluded={excludedItemIds.has(itemId)}
                              onToggleUnpin={onToggleUnpin}
                              onDrillDown={onDrillDown}
                              onActionContent={onActionContent}
                              onAskQuestion={onAskQuestion}
                              loadingItemId={loadingItemId}
                              drillDownContent={drillDownContent}
                              config={config}
                            />
                          );
                        })}
                      </div>
                    )}

                    {table && (
                      <div className="space-y-3">
                        {table.map((row, index) => {
                          const itemId = `${module.id}::${chip.id}::${index}`;
                          return (
                            <ItemBlock
                              key={itemId}
                              itemId={itemId}
                              text={row.meeting}
                              chipId={chip.id}
                              chipLabel={chip.label}
                              excluded={excludedItemIds.has(itemId)}
                              onToggleUnpin={onToggleUnpin}
                              onDrillDown={onDrillDown}
                              onActionContent={onActionContent}
                              onAskQuestion={onAskQuestion}
                              loadingItemId={loadingItemId}
                              drillDownContent={drillDownContent}
                              rowData={row}
                              config={config}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // Generating
  if (step === "generating") {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="animate-pulse-glow h-4 w-4 bg-accent rounded-full" />
          <span className="text-sm text-slate-500">Generating content...</span>
        </div>
      </div>
    );
  }

  // Step navigation
  const goBack = (targetStep: ConversationStep) => setStep(targetStep);

  // Summary text for confirm step
  const subjectDisplay = config.firstStep === "select-department"
    ? `${selectedDepartment} → ${selectedSubject}`
    : selectedSubject;
  const scopeLabel = config.firstStep === "skip-to-timeframe"
    ? "Your recurring meetings"
    : subjectDisplay;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {stepList.map((s, i) => {
          const stepIdx = stepOrder.indexOf(s.key);
          const isActive = currentStepIndex === stepIdx;
          const isDone = currentStepIndex > stepIdx;
          return (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && <div className={cn("w-8 h-px", isDone ? "bg-accent" : "bg-slate-200")} />}
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                    isDone ? "bg-accent text-white" : isActive ? "bg-[#0a3542] text-white" : "bg-slate-200 text-slate-400"
                  )}
                >
                  {isDone ? <Check size={12} /> : i + 1}
                </div>
                <span className={cn("text-xs font-medium", isActive ? "text-[#0a3542]" : "text-slate-400")}>
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step: Select Employee (1-on-1) */}
      {step === "select-employee" && (
        <div>
          <div className="mb-6">
            <p className="text-slate-500 text-sm mb-1">AI Agent</p>
            <h3 className="text-lg font-semibold text-[#0a3542]">{config.subjectLabel}</h3>
            <p className="text-sm text-slate-500 mt-1">
              You have {Array.isArray(config.subjects) ? config.subjects.length : 0} direct reports. Select one to start the report.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(Array.isArray(config.subjects) ? config.subjects : []).map((name) => (
              <button
                key={name}
                onClick={() => {
                  setSelectedSubject(name);
                  setStep("select-timeframe");
                }}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all",
                  selectedSubject === name
                    ? "border-accent bg-accent/5"
                    : "border-slate-200 hover:border-accent/30 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0a3542]/10 flex items-center justify-center text-xs font-semibold text-[#0a3542]">
                    {name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className="text-sm font-medium text-[#0a3542]">{name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Select Scope (Executive Digest) */}
      {step === "select-scope" && (
        <div>
          <div className="mb-6">
            <p className="text-slate-500 text-sm mb-1">AI Agent</p>
            <h3 className="text-lg font-semibold text-[#0a3542]">{config.subjectLabel}</h3>
            <p className="text-sm text-slate-500 mt-1">Choose company-wide or a specific department.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(Array.isArray(config.subjects) ? config.subjects : []).map((scope) => (
              <button
                key={scope}
                onClick={() => {
                  setSelectedSubject(scope);
                  setStep("select-timeframe");
                }}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all",
                  selectedSubject === scope
                    ? "border-accent bg-accent/5"
                    : "border-slate-200 hover:border-accent/30 hover:shadow-sm"
                )}
              >
                <span className="text-sm font-medium text-[#0a3542]">{scope}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Select Department (Team Health Check) */}
      {step === "select-department" && (
        <div>
          <div className="mb-6">
            <p className="text-slate-500 text-sm mb-1">AI Agent</p>
            <h3 className="text-lg font-semibold text-[#0a3542]">Select a department</h3>
            <p className="text-sm text-slate-500 mt-1">Choose the department to narrow down team selection.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(config.subjects as Record<string, string[]>).map((dept) => (
              <button
                key={dept}
                onClick={() => {
                  setSelectedDepartment(dept);
                  setStep("select-team");
                }}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all",
                  selectedDepartment === dept
                    ? "border-accent bg-accent/5"
                    : "border-slate-200 hover:border-accent/30 hover:shadow-sm"
                )}
              >
                <span className="text-sm font-medium text-[#0a3542]">{dept}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Select Team (Team Health Check) */}
      {step === "select-team" && selectedDepartment && (
        <div>
          <div className="mb-6">
            <button onClick={() => goBack("select-department")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0a3542] mb-4">
              <ChevronLeft size={14} />
              Back
            </button>
            <h3 className="text-lg font-semibold text-[#0a3542]">Select a team in {selectedDepartment}</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {((config.subjects as Record<string, string[]>)[selectedDepartment] || []).map((team) => (
              <button
                key={team}
                onClick={() => {
                  setSelectedSubject(team);
                  setStep("select-timeframe");
                }}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all",
                  selectedSubject === team
                    ? "border-accent bg-accent/5"
                    : "border-slate-200 hover:border-accent/30 hover:shadow-sm"
                )}
              >
                <span className="text-sm font-medium text-[#0a3542]">{team}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Select Time Frame */}
      {step === "select-timeframe" && (
        <div>
          <div className="mb-6">
            {config.firstStep !== "skip-to-timeframe" && (
              <button
                onClick={() => goBack(stepOrder[0] as ConversationStep)}
                className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0a3542] mb-4"
              >
                <ChevronLeft size={14} />
                Back
              </button>
            )}
            <h3 className="text-lg font-semibold text-[#0a3542]">What time frame would you like to analyze?</h3>
            <p className="text-sm text-slate-500 mt-1">
              For: {scopeLabel || "Your meetings"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {TIME_FRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setSelectedTimeFrame(tf);
                  setStep("select-mode");
                }}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all",
                  selectedTimeFrame === tf
                    ? "border-accent bg-accent/5"
                    : "border-slate-200 hover:border-accent/30 hover:shadow-sm"
                )}
              >
                <span className="text-sm font-medium text-[#0a3542]">{tf}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs text-slate-400 mb-2">Or enter a custom time frame:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTimeFrame}
                onChange={(e) => setCustomTimeFrame(e.target.value)}
                placeholder="e.g. April 2026, Q1 2026"
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => {
                  if (customTimeFrame.trim()) {
                    setSelectedTimeFrame(customTimeFrame.trim());
                    setCustomTimeFrame("");
                    setStep("select-mode");
                  }
                }}
                className="px-3 py-2 bg-[#0a3542] text-white rounded-lg text-sm font-medium hover:bg-[#195160]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step: Select Mode */}
      {step === "select-mode" && (
        <div>
          <div className="mb-6">
            <button onClick={() => goBack("select-timeframe")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0a3542] mb-4">
              <ChevronLeft size={14} />
              Back
            </button>
            <h3 className="text-lg font-semibold text-[#0a3542]">Select a conversation mode</h3>
            <p className="text-sm text-slate-500 mt-1">
              {scopeLabel} — {selectedTimeFrame}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {config.modes.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMode(m.id);
                  setStep("confirm");
                }}
                className={cn(
                  "text-left p-5 rounded-xl border transition-all",
                  selectedMode === m.id
                    ? "border-accent bg-accent/5"
                    : "border-slate-200 hover:border-accent/40 hover:shadow-md"
                )}
              >
                <h4 className="font-medium text-[#0a3542] mb-1">{m.label}</h4>
                <p className="text-sm text-slate-500">{m.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: Confirm */}
      {step === "confirm" && (
        <div>
          <div className="mb-6">
            <button onClick={() => goBack("select-mode")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0a3542] mb-4">
              <ChevronLeft size={14} />
              Back
            </button>
            <h3 className="text-lg font-semibold text-[#0a3542]">Confirm your selection</h3>
            <p className="text-sm text-slate-500 mt-1">Review and confirm to generate the report.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 space-y-4">
            {config.firstStep !== "skip-to-timeframe" && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{config.stepLabels.subject}</span>
                  <span className="text-sm font-medium text-[#0a3542]">{subjectDisplay}</span>
                </div>
                <div className="border-t border-slate-100" />
              </>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Time Frame</span>
              <span className="text-sm font-medium text-[#0a3542]">{selectedTimeFrame}</span>
            </div>
            <div className="border-t border-slate-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Mode</span>
              <span className="text-sm font-medium text-[#0a3542]">
                {config.modes.find((m) => m.id === selectedMode)?.label}
              </span>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-[#0a3542] text-white rounded-xl text-sm font-semibold hover:bg-[#195160] transition-colors flex items-center justify-center gap-2"
          >
            Generate Report
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

// --- Item Block ---

function ItemBlock({
  itemId,
  text,
  chipId,
  chipLabel,
  excluded,
  onToggleUnpin,
  onDrillDown,
  onActionContent,
  onAskQuestion,
  loadingItemId,
  drillDownContent,
  rowData,
  config,
}: {
  itemId: string;
  text: string;
  chipId: string;
  chipLabel: string;
  excluded: boolean;
  onToggleUnpin: (itemId: string) => void;
  onDrillDown: (itemId: string, chipId: string) => void;
  onActionContent: (itemId: string, content: string) => void;
  onAskQuestion: (chipId: string, chipLabel: string, question: string) => void;
  loadingItemId: string | null;
  drillDownContent: Record<string, string>;
  rowData?: Record<string, string>;
  config: AgentConfig;
}) {
  const isLoading = loadingItemId === itemId;
  const [questionPopupOpen, setQuestionPopupOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!questionPopupOpen) return;
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setQuestionPopupOpen(false);
        setQuestionText("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [questionPopupOpen]);

  const badgeClass = (value: string | undefined) => {
    if (!value) return "bg-slate-100 text-slate-700";
    const lower = value.toLowerCase();
    if (["high", "keep", "overloaded"].includes(lower)) return "bg-red-100 text-red-700";
    if (["medium", "merge", "above avg"].includes(lower)) return "bg-yellow-100 text-yellow-700";
    if (["low", "eliminate", "under-utilised"].includes(lower)) return "bg-green-100 text-green-700";
    if (["optimal"].includes(lower)) return "bg-emerald-100 text-emerald-700";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-all",
        excluded
          ? "border-slate-200 bg-slate-50/50 opacity-60"
          : "border-slate-200 bg-slate-50/30"
      )}
    >
      {/* Item content */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {rowData ? (
            <div>
              <p className={cn("text-sm font-medium text-navy", excluded && "line-through")}>
                {rowData.meeting}
              </p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {rowData.hours && <span className="text-xs text-slate-500">{rowData.hours}</span>}
                {rowData.hours && rowData.cost && <span className="text-xs text-slate-300">|</span>}
                {rowData.cost && (
                  <span className={cn("px-1.5 py-0.5 rounded text-xs", badgeClass(rowData.cost))}>
                    {config.badgeLabels.cost}: {rowData.cost}
                  </span>
                )}
                {rowData.intent && <span className="text-xs text-slate-500">{rowData.intent}</span>}
                {rowData.alignment && (
                  <span className={cn("px-1.5 py-0.5 rounded text-xs", badgeClass(rowData.alignment))}>
                    {config.badgeLabels.alignment}: {rowData.alignment}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <p className={cn("text-sm text-slate-700", excluded && "line-through")}>
              {text}
            </p>
          )}
        </div>

        {/* Unpin / Include toggle */}
        <button
          onClick={() => onToggleUnpin(itemId)}
          className="shrink-0 p-1.5 rounded hover:bg-slate-100 transition-colors"
          title={excluded ? "Include in report" : "Exclude from report"}
        >
          {excluded ? (
            <Eye size={14} className="text-slate-400" />
          ) : (
            <EyeOff size={14} className="text-slate-300" />
          )}
        </button>
      </div>

      {/* Drill-down content */}
      {drillDownContent[itemId] && (
        <div className="mt-3 pl-4 border-l-2 border-accent/30">
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{drillDownContent[itemId]}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-100">
        <button
          onClick={() => onDrillDown(itemId, chipId)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
        >
          <Search size={12} className="text-slate-400" />
          Drill down
        </button>
        <button
          onClick={() => onActionContent(itemId, config.verifySource)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Shield size={12} className="text-slate-400" />
          Verify
        </button>
        <div className="relative" ref={popupRef}>
          <button
            onClick={() => setQuestionPopupOpen(!questionPopupOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
          >
            <HelpCircle size={12} className="text-slate-400" />
            Ask a question
          </button>
          {questionPopupOpen && (
            <div className="absolute left-0 bottom-7 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-10 w-72">
              <p className="text-xs font-medium text-slate-700 mb-2">Ask a question about this insight</p>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && questionText.trim()) {
                    e.preventDefault();
                    onAskQuestion(chipId, chipLabel, questionText.trim());
                    setQuestionPopupOpen(false);
                    setQuestionText("");
                  }
                  if (e.key === "Escape") {
                    setQuestionPopupOpen(false);
                    setQuestionText("");
                  }
                }}
                placeholder="Type your question..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent resize-none h-20"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => { setQuestionPopupOpen(false); setQuestionText(""); }}
                  className="px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (questionText.trim()) {
                      onAskQuestion(chipId, chipLabel, questionText.trim());
                      setQuestionPopupOpen(false);
                      setQuestionText("");
                    }
                  }}
                  disabled={!questionText.trim()}
                  className="px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50"
                >
                  Ask
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Chip Content ---

function ChipContent({ data, config }: { data: unknown; config: AgentConfig }) {
  if (!data || typeof data !== "object") return <p className="text-sm text-slate-600">{String(data)}</p>;

  const d = data as Record<string, unknown>;

  if (d.metrics && Array.isArray(d.metrics)) {
    const hasPosition = (d.metrics as Array<Record<string, string>>).some((m) => m.position);
    return (
      <div>
        {d.text ? (
          <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">
            {String(d.text as string).replace(/\*\*/g, "")}
          </p>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 pr-4 text-slate-500 font-medium">Metric</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">Value</th>
                <th className="text-right py-2 px-4 text-slate-500 font-medium">Peer Median</th>
                {hasPosition && (
                  <th className="text-left py-2 pl-4 text-slate-500 font-medium">Position</th>
                )}
              </tr>
            </thead>
            <tbody>
              {(d.metrics as Array<Record<string, string>>).map((m, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-navy">{m.label}</td>
                  <td className="py-2 px-4 text-right font-medium text-navy">{m.value}</td>
                  <td className="py-2 px-4 text-right text-slate-400">{m.median}</td>
                  {hasPosition && (
                    <td className="py-2 pl-4 text-sm text-slate-500">{m.position || "—"}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (d.items && Array.isArray(d.items)) {
    return (
      <ul className="space-y-2">
        {(d.items as string[]).map((item, i) => (
          <li key={i} className="text-sm text-slate-700 pl-4 border-l-2 border-accent/20">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (d.table && Array.isArray(d.table)) {
    const customHeaders = d.headers as Array<{ key: string; label: string }> | undefined;
    const headers = customHeaders || config.tableHeaders;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              {headers.map((h, i) => (
                <th key={h.key} className={cn("py-2 px-3 text-slate-500 font-medium", i === 0 ? "text-left" : "text-right")}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(d.table as Array<Record<string, string>>).map((row, i) => (
              <tr key={i} className="border-b border-slate-100">
                {headers.map((h, hi) => (
                  <td key={h.key} className={cn("py-2 px-3", hi === 0 ? "text-left" : "text-right")}>
                    {hi === 0 ? (
                      <span className="font-medium text-navy">{row[h.key] ?? "—"}</span>
                    ) : !customHeaders && (h.key === "cost" || h.key === "alignment") ? (
                      row[h.key] ? (
                        <span className={cn("px-2 py-0.5 rounded-full text-xs", badgeClassForValue(row[h.key]))}>
                          {row[h.key]}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )
                    ) : (
                      <span className="text-slate-600">{row[h.key] ?? "—"}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (d.text) {
    return <p className="text-sm text-slate-700 whitespace-pre-wrap">{String(d.text)}</p>;
  }

  return <p className="text-sm text-slate-400">No content available</p>;
}

function badgeClassForValue(value: string | undefined): string {
  if (!value) return "bg-slate-100 text-slate-700";
  const lower = value.toLowerCase();
  if (["high", "keep", "overloaded"].includes(lower)) return "bg-red-100 text-red-700";
  if (["medium", "merge", "above avg"].includes(lower)) return "bg-yellow-100 text-yellow-700";
  if (["low", "eliminate", "under-utilised"].includes(lower)) return "bg-green-100 text-green-700";
  if (["optimal"].includes(lower)) return "bg-emerald-100 text-emerald-700";
  return "bg-slate-100 text-slate-700";
}

// --- Report View ---

function ReportView({
  markdown,
  modules,
  excludedItemIds,
  config,
  editing,
  onToggleEdit,
  onUpdate,
  showToast,
}: {
  markdown: string;
  modules: ContentModule[];
  excludedItemIds: Set<string>;
  config: AgentConfig;
  editing: boolean;
  onToggleEdit: () => void;
  onUpdate: (markdown: string) => void;
  showToast: (message: string) => void;
}) {
  const reportTitle = markdown.split("\n").find(l => l.startsWith("# "))?.replace(/^#\s*/, "") || "Report";

  const renderModuleReport = (module: ContentModule) => {
    const dataChips = module.chips.filter(
      (chip) => chip.id.endsWith("-data") || chip.id === "chip-data"
    );
    const insightChips = module.chips.filter(
      (chip) => !chip.id.endsWith("-data") && chip.id !== "chip-data" 
    );

    return (
      <div key={module.id} className="mb-8">
        <h2 className="text-lg font-bold text-navy mb-4">{module.title}</h2>

        {dataChips.map((chip) => {
          const dataContent = module.content[chip.id];
          return dataContent ? (
            <div key={chip.id} className="mb-4">
              <ChipContent data={dataContent} config={config} />
            </div>
          ) : null;
        })}

        {insightChips.map((chip) => {
          const chipContent = module.content[chip.id];
          if (!chipContent || typeof chipContent !== "object") return null;

          const d = chipContent as Record<string, unknown>;
          const items = Array.isArray(d.items) ? (d.items as string[]) : null;
          const table = Array.isArray(d.table) ? (d.table as Array<Record<string, string>>) : null;
          const customHeaders = d.headers as Array<{ key: string; label: string }> | undefined;
          const headers = customHeaders || config.tableHeaders;

          return (
            <div key={chip.id} className="mb-4">
              <h3 className="font-semibold text-navy mb-2">{chip.label}</h3>

              {items && (
                <ul className="space-y-2">
                  {items
                    .filter((_: string, index: number) => !excludedItemIds.has(`${module.id}::${chip.id}::${index}`))
                    .map((item: string, i: number) => (
                      <li key={i} className="text-sm text-slate-700 pl-4 border-l-2 border-accent/20">
                        {item}
                      </li>
                    ))}
                </ul>
              )}

              {table && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        {headers.map((h, i) => (
                          <th key={h.key} className={cn("py-2 px-3 text-slate-500 font-medium", i === 0 ? "text-left" : "text-right")}>
                            {h.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table
                        .filter((_: Record<string, string>, index: number) => !excludedItemIds.has(`${module.id}::${chip.id}::${index}`))
                        .map((row: Record<string, string>, i: number) => (
                          <tr key={i} className="border-b border-slate-100">
                            {headers.map((h, hi) => (
                              <td key={h.key} className={cn("py-2 px-3", hi === 0 ? "text-left" : "text-right")}>
                                {hi === 0 ? (
                                  <span className="font-medium text-navy">{row[h.key] ?? "—"}</span>
                                ) : !customHeaders && (h.key === "cost" || h.key === "alignment") ? (
                                  row[h.key] ? (
                                    <span className={cn("px-2 py-0.5 rounded-full text-xs", badgeClassForValue(row[h.key]))}>
                                      {row[h.key]}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">—</span>
                                  )
                                ) : (
                                  <span className="text-slate-600">{row[h.key] ?? "—"}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={onToggleEdit}
          className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          {editing ? "Preview" : "Edit Template"}
        </button>
        <button
          onClick={() => showToast("Google Docs export coming soon")}
          className="px-3 py-1.5 text-sm bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          Convert to Google Docs
        </button>
      </div>

      {editing ? (
        <textarea
          value={markdown}
          onChange={(e) => onUpdate(e.target.value)}
          className="w-full min-h-[600px] p-6 bg-white rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:border-accent resize-none"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm min-h-[600px]">
          <div className="space-y-6">
            <h1 className="text-xl font-bold text-navy border-b border-slate-200 pb-4">
              {reportTitle}
            </h1>
            {modules.map((module) => renderModuleReport(module))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- Chat Drawer ---

function ChatDrawer({
  sessionId,
  mode,
  messages,
  onMessagesUpdate,
  onApplyToReport,
  onClose,
}: {
  sessionId: string;
  mode: string | null;
  messages: ChatMessage[];
  onMessagesUpdate: (messages: ChatMessage[]) => void;
  onApplyToReport: (content: string) => void;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [appliedMessages, setAppliedMessages] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `msg-local-${crypto.randomUUID().slice(0, 8)}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    onMessagesUpdate(newMessages);
    setInput("");
    setIsStreaming(true);

    const assistantId = `msg-local-${crypto.randomUUID().slice(0, 8)}`;
    const assistantTemplate: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    onMessagesUpdate([...newMessages, assistantTemplate]);

    let accumulatedContent = "";
    try {
      await streamChat(sessionId, userMsg.content, mode || undefined, (chunk) => {
        if (chunk.type === "text" && chunk.content) {
          accumulatedContent += chunk.content;
          onMessagesUpdate([
            ...newMessages,
            { ...assistantTemplate, content: accumulatedContent },
          ]);
        }
      });
    } catch {
      onMessagesUpdate([
        ...newMessages,
        { ...assistantTemplate, content: accumulatedContent + " [Error: Could not get response]" },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, sessionId, mode, onMessagesUpdate]);

  const handleApply = useCallback(
    (message: ChatMessage) => {
      onApplyToReport(message.content);
      setAppliedMessages((prev) => new Set(prev).add(message.id || ""));
    },
    [onApplyToReport]
  );

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 border-l border-slate-200 bg-white flex flex-col h-full shadow-lg z-10">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent" />
          <h3 className="font-medium text-sm text-navy">AI Chat</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400">Ask follow-up questions about the report.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id || msg.content.slice(0, 20)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm",
              msg.role === "user"
                ? "bg-accent/10 text-navy ml-6"
                : "bg-slate-50 text-slate-700 mr-2"
            )}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
            {msg.role === "assistant" && msg.content && !isStreaming && (
              <div className="mt-2 flex items-center gap-2">
                {appliedMessages.has(msg.id || "") ? (
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <Check size={12} />
                    Applied
                  </span>
                ) : (
                  <button
                    onClick={() => handleApply(msg)}
                    className="text-xs text-accent hover:text-accent/80 font-medium"
                  >
                    Apply to Report
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {isStreaming && (
          <div className="flex items-center gap-2 px-3">
            <div className="animate-pulse-glow h-2 w-2 bg-accent rounded-full" />
            <span className="text-xs text-slate-400">AI is typing...</span>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask a follow-up..."
            disabled={isStreaming}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-accent disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="p-2 bg-accent text-white rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
