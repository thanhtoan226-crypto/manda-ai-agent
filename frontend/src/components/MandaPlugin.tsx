"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Settings2, Send, Loader2, Palette, MessageSquare, FileText, Shield, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MEETING_COLORS, PERSONALITY_OPTIONS, SAFETY_CHECK_OPTIONS } from "@/lib/constants";
import {
  fetchMeetingSettings,
  updateMeetingSettings,
  fetchMeetingTemplates,
  streamGenerateDescription,
  streamRewriteDescription,
} from "@/lib/api";
import type { MandaMeetingSettings, MeetingTemplate } from "@/types/meeting";

type PluginTab = "main" | "settings";

interface MandaPluginProps {
  description: string;
  onGeneratedContent: (field: string, content: string) => void;
  onSettingsChange?: (settings: MandaMeetingSettings) => void;
}

export default function MandaPlugin({ description, onGeneratedContent, onSettingsChange }: MandaPluginProps) {
  const [activeTab, setActiveTab] = useState<PluginTab>("main");
  const [settings, setSettings] = useState<MandaMeetingSettings | null>(null);
  const [templates, setTemplates] = useState<MeetingTemplate[]>([]);

  const [generatePurpose, setGeneratePurpose] = useState(true);
  const [generateOutcomes, setGenerateOutcomes] = useState(true);
  const [generateAgenda, setGenerateAgenda] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [rewritePrompt, setRewritePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

  const loadSettings = useCallback(async () => {
    try {
      const s = await fetchMeetingSettings();
      setSettings(s);
      onSettingsChange?.(s);
    } catch {
      const defaults: MandaMeetingSettings = {
        id: "",
        auto_color: "BLUE",
        personality: "formal",
        context_prompt: "",
        enabled_templates: [],
        company_branding_enabled: false,
        brand_color: null,
        brand_header_text: null,
        brand_footer_text: null,
        safety_checks: ["missing_agenda", "missing_purpose_outcome"],
      };
      setSettings(defaults);
    }
  }, [onSettingsChange]);

  const loadTemplates = useCallback(async () => {
    try {
      const t = await fetchMeetingTemplates();
      setTemplates(t);
    } catch {
      setTemplates([]);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    loadTemplates();
  }, [loadSettings, loadTemplates]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    let accumulated = "";
    try {
      await streamGenerateDescription(
        {
          prompt: prompt.trim(),
          generate_purpose: generatePurpose,
          generate_outcomes: generateOutcomes,
          generate_agenda: generateAgenda,
          personality: settings?.personality || "formal",
          context_prompt: settings?.context_prompt || "",
        },
        (data) => {
          if (data.content) {
            accumulated += data.content;
            onGeneratedContent("description", accumulated);
          }
        }
      );
    } catch {
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRewrite = async () => {
    if (!rewritePrompt.trim() || !description.trim() || isRewriting) return;
    setIsRewriting(true);
    try {
      let fullContent = "";
      await streamRewriteDescription(
        {
          current_description: description,
          prompt: rewritePrompt.trim(),
          personality: settings?.personality || "formal",
          context_prompt: settings?.context_prompt || "",
        },
        (data) => {
          if (data.field === "description" && data.content) {
            fullContent += data.content;
            onGeneratedContent("description", fullContent);
          }
        }
      );
    } catch {
    } finally {
      setIsRewriting(false);
    }
  };

  const handleSettingUpdate = async (updates: Partial<MandaMeetingSettings>) => {
    if (!settings) return;
    try {
      const updated = await updateMeetingSettings(updates);
      setSettings(updated);
      onSettingsChange?.(updated);
    } catch {
    }
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("main")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors",
            activeTab === "main"
              ? "text-[#0a3542] border-b-2 border-[#0a3542]"
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Sparkles size={14} />
          Main
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors",
            activeTab === "settings"
              ? "text-[#0a3542] border-b-2 border-[#0a3542]"
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          <Settings2 size={14} />
          Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "main" ? (
          <MainTab
            generatePurpose={generatePurpose}
            generateOutcomes={generateOutcomes}
            generateAgenda={generateAgenda}
            onTogglePurpose={() => setGeneratePurpose(!generatePurpose)}
            onToggleOutcomes={() => setGenerateOutcomes(!generateOutcomes)}
            onToggleAgenda={() => setGenerateAgenda(!generateAgenda)}
            prompt={prompt}
            onPromptChange={setPrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            rewritePrompt={rewritePrompt}
            onRewritePromptChange={setRewritePrompt}
            onRewrite={handleRewrite}
            isRewriting={isRewriting}
            hasDescription={!!description.trim()}
            templates={templates}
            onSelectTemplate={(t) => {
              onGeneratedContent("description", t.content);
            }}
          />
        ) : (
          <SettingsTab
            settings={settings}
            onUpdate={handleSettingUpdate}
            templates={templates}
          />
        )}
      </div>
    </div>
  );
}

function MainTab({
  generatePurpose,
  generateOutcomes,
  generateAgenda,
  onTogglePurpose,
  onToggleOutcomes,
  onToggleAgenda,
  prompt,
  onPromptChange,
  onGenerate,
  isGenerating,
  rewritePrompt,
  onRewritePromptChange,
  onRewrite,
  isRewriting,
  hasDescription,
  templates,
  onSelectTemplate,
}: {
  generatePurpose: boolean;
  generateOutcomes: boolean;
  generateAgenda: boolean;
  onTogglePurpose: () => void;
  onToggleOutcomes: () => void;
  onToggleAgenda: () => void;
  prompt: string;
  onPromptChange: (v: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  rewritePrompt: string;
  onRewritePromptChange: (v: string) => void;
  onRewrite: () => void;
  isRewriting: boolean;
  hasDescription: boolean;
  templates: MeetingTemplate[];
  onSelectTemplate: (t: MeetingTemplate) => void;
}) {
  return (
    <div className="space-y-4">
      {templates.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-2 block">Quick Start Templates</label>
          <div className="flex flex-wrap gap-1.5">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTemplate(t)}
                className="text-[10px] font-medium px-2 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-4">
        <label className="text-xs font-semibold text-[#0a3542] mb-2 block">Generate Meeting</label>

        <div className="flex flex-wrap gap-3 mb-3">
          <Toggle label="Purpose" checked={generatePurpose} onChange={onTogglePurpose} />
          <Toggle label="Outcomes" checked={generateOutcomes} onChange={onToggleOutcomes} />
          <Toggle label="Agenda" checked={generateAgenda} onChange={onToggleAgenda} />
        </div>

        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Describe your meeting idea..."
          rows={4}
          className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20 resize-none"
        />
        <button
          onClick={onGenerate}
          disabled={!prompt.trim() || isGenerating}
          className={cn(
            "w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors",
            prompt.trim() && !isGenerating
              ? "bg-[#0a3542] text-white hover:bg-[#0a3542]/90"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
        >
          {isGenerating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={14} />
              Generate
            </>
          )}
        </button>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <label className="text-xs font-semibold text-slate-400 mb-2 block">
          &#8212;&#8212; or rewrite existing &#8212;&#8212;
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={rewritePrompt}
            onChange={(e) => onRewritePromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onRewrite();
            }}
            placeholder="e.g., Make it more formal..."
            disabled={!hasDescription}
            className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20 disabled:bg-slate-50 disabled:text-slate-300"
          />
          <button
            onClick={onRewrite}
            disabled={!rewritePrompt.trim() || !hasDescription || isRewriting}
            className={cn(
              "flex items-center justify-center w-9 h-9 rounded-lg text-xs transition-colors",
              rewritePrompt.trim() && hasDescription && !isRewriting
                ? "bg-[#0a3542] text-white hover:bg-[#0a3542]/90"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            {isRewriting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({
  settings,
  onUpdate,
  templates,
}: {
  settings: MandaMeetingSettings | null;
  onUpdate: (updates: Partial<MandaMeetingSettings>) => void;
  templates: MeetingTemplate[];
}) {
  if (!settings) return <div className="text-xs text-slate-400">Loading settings...</div>;

  return (
    <div className="space-y-5">
      <SettingSection icon={Palette} label="Meeting Color">
        <p className="text-[10px] text-slate-400 mb-2">Auto-assign color to Manda meetings</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MEETING_COLORS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => onUpdate({ auto_color: key })}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all",
                val.dot,
                settings.auto_color === key
                  ? "border-[#0a3542] scale-110"
                  : "border-transparent hover:scale-105"
              )}
              title={key}
            />
          ))}
        </div>
      </SettingSection>

      <SettingSection icon={MessageSquare} label="Personality">
        <div className="flex flex-wrap gap-1.5">
          {PERSONALITY_OPTIONS.map((p) => (
            <button
              key={p.value}
              onClick={() => onUpdate({ personality: p.value })}
              className={cn(
                "text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors",
                settings.personality === p.value
                  ? "bg-[#0a3542] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </SettingSection>

      <SettingSection icon={FileText} label="Context Prompt">
        <textarea
          value={settings.context_prompt}
          onChange={(e) => onUpdate({ context_prompt: e.target.value })}
          placeholder="e.g., I'm just the EA so I don't actually attend meetings..."
          rows={3}
          maxLength={500}
          className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20 resize-none"
        />
        <p className="text-[10px] text-slate-300 mt-1">{settings.context_prompt.length}/500</p>
      </SettingSection>

      <SettingSection icon={FileText} label="Templates">
        <div className="space-y-1.5">
          {templates.map((t) => {
            const enabled = settings.enabled_templates.includes(t.id);
            return (
              <label key={t.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => {
                    const next = enabled
                      ? settings.enabled_templates.filter((id) => id !== t.id)
                      : [...settings.enabled_templates, t.id];
                    onUpdate({ enabled_templates: next });
                  }}
                  className="rounded border-slate-300 text-[#0a3542] focus:ring-[#0a3542]/20"
                />
                <span className="text-xs text-slate-600">{t.name}</span>
                {t.is_builtin && (
                  <span className="text-[9px] text-slate-300">built-in</span>
                )}
              </label>
            );
          })}
        </div>
      </SettingSection>

      <SettingSection icon={Building2} label="Company Branding">
        <Toggle
          label="Apply company branding"
          checked={settings.company_branding_enabled}
          onChange={() => onUpdate({ company_branding_enabled: !settings.company_branding_enabled })}
        />
        {settings.company_branding_enabled && (
          <div className="mt-3 space-y-2">
            <input
              type="text"
              value={settings.brand_header_text || ""}
              onChange={(e) => onUpdate({ brand_header_text: e.target.value })}
              placeholder="Header text"
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
            />
            <input
              type="text"
              value={settings.brand_footer_text || ""}
              onChange={(e) => onUpdate({ brand_footer_text: e.target.value })}
              placeholder="Footer text"
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0a3542]/20"
            />
          </div>
        )}
      </SettingSection>

      <SettingSection icon={Shield} label="Safety Checks">
        <p className="text-[10px] text-slate-400 mb-2">Prevent sending if missing</p>
        <div className="space-y-1.5">
          {SAFETY_CHECK_OPTIONS.map((opt) => {
            const checked = settings.safety_checks.includes(opt.value);
            return (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? settings.safety_checks.filter((v) => v !== opt.value)
                      : [...settings.safety_checks, opt.value];
                    onUpdate({ safety_checks: next });
                  }}
                  className="rounded border-slate-300 text-[#0a3542] focus:ring-[#0a3542]/20"
                />
                <span className="text-xs text-slate-600">{opt.label}</span>
              </label>
            );
          })}
        </div>
      </SettingSection>
    </div>
  );
}

function SettingSection({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={12} className="text-slate-400" />
        <span className="text-xs font-semibold text-[#0a3542]">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        onClick={onChange}
        className={cn(
          "relative inline-flex h-4 w-7 items-center rounded-full transition-colors",
          checked ? "bg-[#0a3542]" : "bg-slate-200"
        )}
      >
        <span
          className={cn(
            "inline-block h-3 w-3 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-3.5" : "translate-x-0.5"
          )}
        />
      </button>
      <span className="text-xs text-slate-600">{label}</span>
    </label>
  );
}
