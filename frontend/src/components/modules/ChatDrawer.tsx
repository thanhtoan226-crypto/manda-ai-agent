"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, X, Check, Send } from "lucide-react";
import type { ChatMessage } from "@/types/session";
import { streamPulseChat } from "@/lib/api";

interface PulseChatDrawerProps {
  reportId: string;
  messages: ChatMessage[];
  onMessagesUpdate: (messages: ChatMessage[]) => void;
  onApplyToReport: (content: string) => void;
  onClose: () => void;
}

export default function PulseChatDrawer({
  reportId,
  messages,
  onMessagesUpdate,
  onApplyToReport,
  onClose,
}: PulseChatDrawerProps) {
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
      await streamPulseChat(reportId, userMsg.content, (chunk) => {
        if (chunk.type === "text" && chunk.content) {
          accumulatedContent += chunk.content;
          onMessagesUpdate([...newMessages, { ...assistantTemplate, content: accumulatedContent }]);
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
  }, [input, isStreaming, messages, reportId, onMessagesUpdate]);

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
          <Sparkles size={16} className="text-[#3b82f6]" />
          <h3 className="font-medium text-sm text-[#0a3542]">AI Chat</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-[#0a3542] hover:bg-slate-50 rounded-lg transition-colors"
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
              msg.role === "user" ? "bg-[#3b82f6]/10 text-[#0a3542] ml-6" : "bg-slate-50 text-slate-700 mr-2"
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
                    className="text-xs text-[#3b82f6] hover:text-[#3b82f6]/80 font-medium"
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
            <div className="animate-pulse h-2 w-2 bg-[#3b82f6] rounded-full" />
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
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#3b82f6] disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="p-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#3b82f6]/90 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
