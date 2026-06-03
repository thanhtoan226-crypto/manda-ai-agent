"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn, badgeClass } from "@/lib/utils";
import { AGENT_CONFIGS, type AgentConfig } from "@/lib/agent-config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  EyeOff,
  Eye,
  Search,
  Shield,
  HelpCircle,
  Loader2,
} from "lucide-react";
import type { ContentModule } from "@/types/session";
import MetricsCardGrid from "./MetricsCardGrid";

const DEFAULT_AGENT_CONFIG = AGENT_CONFIGS["agent-1on1"];

function PulseItemBlock({
  itemId,
  text,
  chipId,
  chipLabel,
  itemIndex,
  excluded,
  onToggleUnpin,
  onDrillDown,
  onVerify,
  loadingItemId,
  drillDownContent,
  errorItemId,
  onAskQuestion,
  rowData,
  config,
}: {
  itemId: string;
  text: string;
  chipId: string;
  chipLabel: string;
  itemIndex: number;
  excluded: boolean;
  onToggleUnpin: (itemId: string) => void;
  onDrillDown: (itemId: string, chipId: string, itemIndex: number) => void;
  onVerify: (itemId: string, chipId: string, itemIndex: number) => void;
  loadingItemId: string | null;
  drillDownContent: Record<string, string>;
  errorItemId: string | null;
  onAskQuestion: (chipId: string, chipLabel: string, question: string) => void;
  rowData?: Record<string, string>;
  config: AgentConfig;
}) {
  const isLoading = loadingItemId === itemId;
  const hasError = errorItemId === itemId;
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
        excluded ? "border-slate-200 bg-slate-50/50 opacity-60" : "border-slate-200 bg-slate-50/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {rowData ? (
            <div>
              <p className={cn("text-sm font-medium text-[#0a3542]", excluded && "line-through")}>
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
            <p className={cn("text-sm text-slate-700", excluded && "line-through")}>{text}</p>
          )}
        </div>
        <button
          onClick={() => onToggleUnpin(itemId)}
          className="shrink-0 p-1.5 rounded hover:bg-slate-100 transition-colors"
          title={excluded ? "Include in report" : "Exclude from report"}
        >
          {excluded ? <Eye size={14} className="text-slate-400" /> : <EyeOff size={14} className="text-slate-300" />}
        </button>
      </div>

      {drillDownContent[itemId] && (
        <div className="mt-3 pl-4 border-l-2 border-[#3b82f6]/30">
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{drillDownContent[itemId]}</p>
        </div>
      )}

      {hasError && !drillDownContent[itemId] && (
        <div className="mt-3 pl-4 border-l-2 border-red-300">
          <p className="text-sm text-red-500">Unable to load content. Please try again.</p>
        </div>
      )}

      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-100">
        <button
          onClick={() => onDrillDown(itemId, chipId, itemIndex)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? <Loader2 size={12} className="text-slate-400 animate-spin" /> : <Search size={12} className="text-slate-400" />}
          Drill down
        </button>
        <button
          onClick={() => onVerify(itemId, chipId, itemIndex)}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-md transition-colors disabled:opacity-50"
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
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] resize-none h-20"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => {
                    setQuestionPopupOpen(false);
                    setQuestionText("");
                  }}
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
                  className="px-3 py-1.5 text-sm bg-[#3b82f6] text-white rounded-lg hover:bg-[#3b82f6]/90 disabled:opacity-50"
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

interface PulseModuleViewProps {
  module: ContentModule;
  reportId: string;
  agentId: string;
  excludedItemIds: Set<string>;
  onToggleUnpin: (itemId: string) => void;
  onDrillDown: (chipId: string, itemIndex: number, onChunk: (content: string) => void) => Promise<void>;
  onVerify: (chipId: string, itemIndex: number, onChunk: (content: string) => void) => Promise<void>;
  onAskQuestion: (chipId: string, chipLabel: string, question: string) => void;
}

export default function PulseModuleView({
  module,
  reportId,
  agentId,
  excludedItemIds,
  onToggleUnpin,
  onDrillDown,
  onVerify,
  onAskQuestion,
}: PulseModuleViewProps) {
  const [drillDownContent, setDrillDownContent] = useState<Record<string, string>>({});
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [errorItemId, setErrorItemId] = useState<string | null>(null);

  const config = AGENT_CONFIGS[agentId] || DEFAULT_AGENT_CONFIG;

  const handleDrillDown = useCallback(
    async (itemId: string, chipId: string, itemIndex: number) => {
      setLoadingItemId(itemId);
      setErrorItemId(null);
      setDrillDownContent((prev) => ({ ...prev, [itemId]: "" }));
      try {
        await onDrillDown(chipId, itemIndex, (content) => {
          setDrillDownContent((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || "") + content,
          }));
        });
      } catch {
        setErrorItemId(itemId);
      } finally {
        setLoadingItemId(null);
      }
    },
    [onDrillDown]
  );

  const handleVerify = useCallback(
    async (itemId: string, chipId: string, itemIndex: number) => {
      setLoadingItemId(itemId);
      setErrorItemId(null);
      setDrillDownContent((prev) => ({ ...prev, [itemId]: "" }));
      try {
        await onVerify(chipId, itemIndex, (content) => {
          setDrillDownContent((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || "") + content,
          }));
        });
      } catch {
        setErrorItemId(itemId);
      } finally {
        setLoadingItemId(null);
      }
    },
    [onVerify]
  );

  const isDataChip = (chip: { id: string }) => {
    if (chip.id.endsWith("-data") || chip.id === "chip-data") return true;
    const chipContent = module.content[chip.id];
    if (chipContent && typeof chipContent === "object" && "metrics" in (chipContent as Record<string, unknown>)) return true;
    return false;
  };

  const dataChips = module.chips.filter(isDataChip);
  const insightChips = module.chips.filter((chip) => !isDataChip(chip));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-[#0a3542] mb-4 text-lg">{module.title}</h3>

      {/* Data chips: use MetricsCardGrid for metrics, ChipContent for tables/items */}
      {dataChips.map((chip) => {
        const dataContent = module.content[chip.id];
        if (!dataContent || typeof dataContent !== "object") return null;

        const d = dataContent as Record<string, unknown>;

        // Metrics → card grid
        if (d.metrics && Array.isArray(d.metrics)) {
          return (
            <MetricsCardGrid
              key={chip.id}
              metrics={d.metrics as Array<{ label: string; value: string; median?: string; position?: string }>}
              summaryText={d.text as string | undefined}
            />
          );
        }

        // Items → simple list
        if (d.items && Array.isArray(d.items)) {
          return (
            <div key={chip.id} className="mb-4">
              <ul className="space-y-2">
                {(d.items as string[]).map((item, i) => (
                  <li key={i} className="text-sm text-slate-700 pl-4 border-l-2 border-[#3b82f6]/20">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        // Table → ChipContent-style table
        if (d.table && Array.isArray(d.table)) {
          const customHeaders = d.headers as Array<{ key: string; label: string }> | undefined;
          const headers = customHeaders || config.tableHeaders;
          return (
            <div key={chip.id} className="overflow-x-auto mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    {headers.map((h, i) => (
                      <th
                        key={h.key}
                        className={cn("py-2 px-3 text-slate-500 font-medium", i === 0 ? "text-left" : "text-right")}
                      >
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
                            <span className="font-medium text-[#0a3542]">{row[h.key] ?? "—"}</span>
                          ) : !customHeaders && (h.key === "cost" || h.key === "alignment") ? (
                            row[h.key] ? (
                              <span className={cn("px-2 py-0.5 rounded-full text-xs", badgeClass(row[h.key]))}>
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

        // Text only
        if (d.text) {
          return (
            <div key={chip.id} className="prose prose-sm max-w-none prose-p:my-0 prose-p:text-sm prose-p:text-slate-700 prose-p:whitespace-pre-wrap mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{String(d.text)}</ReactMarkdown>
            </div>
          );
        }

        return null;
      })}

      {/* Insight chips: ItemBlock components */}
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
                    <PulseItemBlock
                      key={itemId}
                      itemId={itemId}
                      text={item}
                      chipId={chip.id}
                      chipLabel={chip.label}
                      itemIndex={index}
                      excluded={excludedItemIds.has(itemId)}
                      onToggleUnpin={onToggleUnpin}
                      onDrillDown={handleDrillDown}
                      onVerify={handleVerify}
                      loadingItemId={loadingItemId}
                      drillDownContent={drillDownContent}
                      errorItemId={errorItemId}
                      onAskQuestion={onAskQuestion}
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
                    <PulseItemBlock
                      key={itemId}
                      itemId={itemId}
                      text={row.meeting}
                      chipId={chip.id}
                      chipLabel={chip.label}
                      itemIndex={index}
                      excluded={excludedItemIds.has(itemId)}
                      onToggleUnpin={onToggleUnpin}
                      onDrillDown={handleDrillDown}
                      onVerify={handleVerify}
                      loadingItemId={loadingItemId}
                      drillDownContent={drillDownContent}
                      errorItemId={errorItemId}
                      onAskQuestion={onAskQuestion}
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
}
