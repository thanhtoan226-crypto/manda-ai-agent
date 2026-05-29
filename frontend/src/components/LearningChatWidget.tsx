"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, BookOpen } from "lucide-react";
import { streamLearningChat } from "@/lib/api";
import type { ChatMessage } from "@/types/session";

interface LearningChatWidgetProps {
  moduleId?: string;
  topicId?: string;
  topicTitle?: string;
  moduleTitle?: string;
}

export default function LearningChatWidget({
  moduleId,
  topicId,
  topicTitle,
  moduleTitle,
}: LearningChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset conversation when topic/module changes
  useEffect(() => {
    setMessages([]);
  }, [topicId, moduleId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    try {
      await streamLearningChat(trimmed, moduleId, topicId, (chunk) => {
        if (chunk.type === "text" && chunk.content) {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk.content,
              };
            }
            return updated;
          });
        }
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last.role === "assistant" && !last.content) {
          updated[updated.length - 1] = {
            ...last,
            content: "Sorry, I couldn't connect. Please try again.",
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, moduleId, topicId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const contextLabel = topicTitle
    ? `Topic: ${topicTitle}`
    : moduleTitle
      ? `Module: ${moduleTitle}`
      : "Learning Assistant";

  return (
    <>
      {/* FAB Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open learning chat"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1ADEB0] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#1ADEB0]/90 active:scale-95"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#0a3542] px-4 py-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#1ADEB0]" />
              <div>
                <p className="text-sm font-semibold text-white">Manda</p>
                <p className="text-xs text-white/60">{contextLabel}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <p className="text-center text-sm text-slate-400">
                  {topicTitle
                    ? `Ask me anything about "${topicTitle}"`
                    : "Ask me anything about learning!"}
                </p>
              </div>
            )}
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-[#1ADEB0]/10 text-[#0a3542]"
                        : "bg-slate-50 text-slate-700"
                    }`}
                  >
                    {msg.content ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#1ADEB0]" />
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#1ADEB0] [animation-delay:0.2s]" />
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#1ADEB0] [animation-delay:0.4s]" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                disabled={isStreaming}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0a3542] placeholder:text-slate-400 focus:border-[#1ADEB0] focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1ADEB0] text-white transition-colors hover:bg-[#1ADEB0]/90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
