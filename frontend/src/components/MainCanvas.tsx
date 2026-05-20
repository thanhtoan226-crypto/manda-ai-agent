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
} from "lucide-react";
import type { ContentModule } from "@/types/session";

interface MainCanvasProps {
  sessionTitle: string;
  sessionId: string;
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
}

const MODES = [
  { id: "coaching", label: "Coaching & Support", description: "Strengths-first, warm tone, for growth and wellbeing" },
  { id: "performance", label: "Performance Review Prep", description: "Evidence-based, balanced, for formal reviews" },
  { id: "workload", label: "Workload Concern", description: "Volume/trend data, caring but factual, for capacity signals" },
  { id: "investigation", label: "Investigation", description: "Direct/factual, data-driven, for engagement concerns" },
];

const DIRECT_REPORTS = [
  "Mart Thompson",
  "Damien Nguyen",
  "Jessie Martinez",
  "Johnny Walsh",
  "Jackson Lee",
];

const TIME_FRAMES = ["Last week", "Last month", "Last quarter", "Last 6 months"];

type ConversationStep = "select-employee" | "select-timeframe" | "select-mode" | "confirm" | "generating" | "content";

export default function MainCanvas({
  sessionTitle,
  sessionId,
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
}: MainCanvasProps) {
  const [viewMode, setViewMode] = useState<"conversation" | "report">("conversation");
  const [drillDownContent, setDrillDownContent] = useState<Record<string, string>>({});
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState(false);

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
    <div className="flex-1 flex flex-col h-full bg-slate-50">
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
            editing={editingReport}
            onToggleEdit={() => setEditingReport(!editingReport)}
            onUpdate={onUpdateReport}
          />
        )}
      </div>
    </div>
  );
}

function ConversationView({
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
    hasContent ? "content" : "select-employee"
  );
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
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

  const steps = [
    { key: "select-employee", label: "Subject" },
    { key: "select-timeframe", label: "Time Frame" },
    { key: "select-mode", label: "Mode" },
    { key: "confirm", label: "Confirm" },
  ] as const;

  const stepOrder: ConversationStep[] = ["select-employee", "select-timeframe", "select-mode", "confirm", "generating", "content"];
  const currentStepIndex = stepOrder.indexOf(step);

  // Content view
  if (step === "content") {
    return (
      <div className="p-6 space-y-6">
        {modules.map((module) => {
          const dataContent = module.content["chip-data"];
          const insightChips = module.chips.filter(
            (chip) => chip.id !== "chip-data" && !chip.disabled
          );

          return (
            <div key={module.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-navy mb-3">{module.title}</h3>

              {/* Data Interpreter content */}
              {dataContent ? <ChipContent data={dataContent} /> : null}

              {/* Insight sections */}
              {insightChips.map((chip) => {
                const chipContent = module.content[chip.id];
                if (!chipContent || typeof chipContent !== "object") return null;

                const d = chipContent as Record<string, unknown>;
                const items = Array.isArray(d.items) ? (d.items as string[]) : null;
                const table = Array.isArray(d.table) ? (d.table as Array<Record<string, string>>) : null;

                return (
                  <div key={chip.id} className="mt-6">
                    <h4 className="text-sm font-semibold text-slate-500 mb-3">{chip.label}</h4>

                    {/* Items type */}
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
                            />
                          );
                        })}
                      </div>
                    )}

                    {/* Table type - each row is its own block */}
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

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => {
          const stepIdx = stepOrder.indexOf(s.key as ConversationStep);
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

      {/* Step 1: Select Employee */}
      {step === "select-employee" && (
        <div>
          <div className="mb-6">
            <p className="text-slate-500 text-sm mb-1">AI Agent</p>
            <h3 className="text-lg font-semibold text-[#0a3542]">Select a direct report</h3>
            <p className="text-sm text-slate-500 mt-1">
              You have {DIRECT_REPORTS.length} direct reports. Select one to start the report.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {DIRECT_REPORTS.map((name) => (
              <button
                key={name}
                onClick={() => {
                  setSelectedEmployee(name);
                  setStep("select-timeframe");
                }}
                className={cn(
                  "text-left p-4 rounded-xl border transition-all",
                  selectedEmployee === name
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

      {/* Step 2: Select Time Frame */}
      {step === "select-timeframe" && (
        <div>
          <div className="mb-6">
            <button onClick={() => setStep("select-employee")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0a3542] mb-4">
              <ChevronLeft size={14} />
              Back
            </button>
            <h3 className="text-lg font-semibold text-[#0a3542]">What time frame would you like to analyze?</h3>
            <p className="text-sm text-slate-500 mt-1">
              For: {selectedEmployee}
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

      {/* Step 3: Select Mode */}
      {step === "select-mode" && (
        <div>
          <div className="mb-6">
            <button onClick={() => setStep("select-timeframe")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0a3542] mb-4">
              <ChevronLeft size={14} />
              Back
            </button>
            <h3 className="text-lg font-semibold text-[#0a3542]">Select a conversation mode</h3>
            <p className="text-sm text-slate-500 mt-1">
              {selectedEmployee} — {selectedTimeFrame}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {MODES.map((m) => (
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

      {/* Step 4: Confirm */}
      {step === "confirm" && (
        <div>
          <div className="mb-6">
            <button onClick={() => setStep("select-mode")} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#0a3542] mb-4">
              <ChevronLeft size={14} />
              Back
            </button>
            <h3 className="text-lg font-semibold text-[#0a3542]">Confirm your selection</h3>
            <p className="text-sm text-slate-500 mt-1">Review and confirm to generate the report.</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Subject</span>
              <span className="text-sm font-medium text-[#0a3542]">{selectedEmployee}</span>
            </div>
            <div className="border-t border-slate-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Time Frame</span>
              <span className="text-sm font-medium text-[#0a3542]">{selectedTimeFrame}</span>
            </div>
            <div className="border-t border-slate-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Mode</span>
              <span className="text-sm font-medium text-[#0a3542]">
                {MODES.find((m) => m.id === selectedMode)?.label}
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
                <span className="text-xs text-slate-500">{rowData.hours}</span>
                <span className="text-xs text-slate-300">|</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-xs",
                  rowData.cost === "High" ? "bg-red-100 text-red-700" :
                  rowData.cost === "Medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-green-100 text-green-700"
                )}>
                  Stage: {rowData.cost}
                </span>
                <span className="text-xs text-slate-500">Days: {rowData.intent}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-xs",
                  rowData.alignment === "High" ? "bg-green-100 text-green-700" :
                  rowData.alignment === "Medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                )}>
                  Probability: {rowData.alignment}
                </span>
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
          onClick={() =>
            onActionContent(
              itemId,
              "Data backed for this insight:\n\n- Source: MLS + CRM transaction database\n- Period: Last 30 days\n- Confidence: 92%\n- Sample size: 347 data points\n- Methodology: Peer comparison against brokerage median"
            )
          }
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

function ChipContent({ data }: { data: unknown }) {
  if (!data || typeof data !== "object") return <p className="text-sm text-slate-600">{String(data)}</p>;

  const d = data as Record<string, unknown>;

  if (d.metrics && Array.isArray(d.metrics)) {
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
                <th className="text-right py-2 pl-4 text-slate-500 font-medium">Peer Median</th>
              </tr>
            </thead>
            <tbody>
              {(d.metrics as Array<Record<string, string>>).map((m, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-2 pr-4 text-navy">{m.label}</td>
                  <td className="py-2 px-4 text-right font-medium text-navy">{m.value}</td>
                  <td className="py-2 pl-4 text-right text-slate-400">{m.median}</td>
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
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 pr-3 text-slate-500 font-medium">Property</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Price</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Stage</th>
              <th className="text-center py-2 px-3 text-slate-500 font-medium">Days in Stage</th>
              <th className="text-center py-2 pl-3 text-slate-500 font-medium">Probability</th>
            </tr>
          </thead>
          <tbody>
            {(d.table as Array<Record<string, string>>).map((row, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2 pr-3 text-navy font-medium">{row.meeting}</td>
                <td className="py-2 px-3 text-center">{row.hours}</td>
                <td className="py-2 px-3 text-center">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    row.cost === "High" ? "bg-red-100 text-red-700" :
                    row.cost === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  )}>
                    {row.cost}
                  </span>
                </td>
                <td className="py-2 px-3 text-center text-slate-600">{row.intent}</td>
                <td className="py-2 pl-3 text-center">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    row.alignment === "High" ? "bg-green-100 text-green-700" :
                    row.alignment === "Medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {row.alignment}
                  </span>
                </td>
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

function ReportView({
  markdown,
  modules,
  excludedItemIds,
  editing,
  onToggleEdit,
  onUpdate,
}: {
  markdown: string;
  modules: ContentModule[];
  excludedItemIds: Set<string>;
  editing: boolean;
  onToggleEdit: () => void;
  onUpdate: (markdown: string) => void;
}) {
  const reportTitle = markdown.split("\n")[0]?.replace(/^#\s*/, "") || "Report";

  const renderModuleReport = (module: ContentModule) => {
    const dataContent = module.content["chip-data"];
    const insightChips = module.chips.filter(
      (chip) => chip.id !== "chip-data" && !chip.disabled
    );

    return (
      <div key={module.id} className="mb-8">
        <h2 className="text-lg font-bold text-navy mb-4">{module.title}</h2>

        {/* Data Interpreter content */}
        {dataContent ? (
          <div className="mb-4">
            <ChipContent data={dataContent} />
          </div>
        ) : null}

        {/* Insight sections */}
        {insightChips.map((chip) => {
          const chipContent = module.content[chip.id];
          if (!chipContent || typeof chipContent !== "object") return null;

          const d = chipContent as Record<string, unknown>;
          const items = Array.isArray(d.items) ? (d.items as string[]) : null;
          const table = Array.isArray(d.table) ? (d.table as Array<Record<string, string>>) : null;

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
                        <th className="text-left py-2 pr-3 text-slate-500 font-medium">Meeting</th>
                        <th className="text-center py-2 px-3 text-slate-500 font-medium">Hours</th>
                        <th className="text-center py-2 px-3 text-slate-500 font-medium">Cost</th>
                        <th className="text-center py-2 px-3 text-slate-500 font-medium">Intent</th>
                        <th className="text-center py-2 pl-3 text-slate-500 font-medium">Alignment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table
                        .filter((_: Record<string, string>, index: number) => !excludedItemIds.has(`${module.id}::${chip.id}::${index}`))
                        .map((row: Record<string, string>, i: number) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="py-2 pr-3 text-navy font-medium">{row.meeting}</td>
                            <td className="py-2 px-3 text-center">{row.hours}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs",
                                row.cost === "High" ? "bg-red-100 text-red-700" :
                                row.cost === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-green-100 text-green-700"
                              )}>
                                {row.cost}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center text-slate-600">{row.intent}</td>
                            <td className="py-2 pl-3 text-center">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs",
                                row.alignment === "High" ? "bg-green-100 text-green-700" :
                                row.alignment === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              )}>
                                {row.alignment}
                              </span>
                            </td>
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
          onClick={() => alert("Coming soon")}
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
