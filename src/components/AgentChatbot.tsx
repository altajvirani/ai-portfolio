import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  FileText,
  X,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { ChatMessage } from "../types.ts";
import { MarkdownRenderer } from "./MarkdownRenderer.tsx";
import { TactileSpinner, SkeuoSkeleton } from "./TactileUI.tsx";

interface AgentChatbotProps {
  isModal?: boolean;
  onCloseModal?: () => void;
  initialQuery?: string;
}

const SUGGESTED_QUERIES = [
  "How did Altaj cut Key Vault calls 35x?",
  "What is Altaj’s role with agentic AI and MCP?",
  "What awards has Altaj won?",
  "Tell me about SnapWright VS Code extension",
  "Summarize his IEEE research and AutoQA AI",
  "What is his education & Azure certification stack?",
];

export const AgentChatbot: React.FC<AgentChatbotProps> = ({
  isModal = false,
  onCloseModal,
  initialQuery = "",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hi! I am Altaj Virani's AI Twin, grounded directly in his canonical profile and resume documents.\n\nAsk me anything about enterprise agentic AI, Model Context Protocol (MCP), Azure Container Apps optimization, SnapWright, Nivesh, IEEE research, awards, or engineering experience.`,
      sources: ["altaj-virani-resume.pdf"],
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );

  useEffect(() => {
    if (!isModal || !onCloseModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModal, onCloseModal]);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        text: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          conversationId: conversationIdRef.current,
        }),
      });

      if (!res.ok) {
        let errMessage =
          "The chat service is momentarily unreachable. Please check your connection and try again, or reach out directly via the Contact section below.";
        try {
          const errData = await res.json();
          if (errData?.error) {
            errMessage = errData.error;
          }
        } catch {
          // ignore
        }
        throw new Error(errMessage);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          data.answer ||
          "The AI Twin is momentarily unavailable. Please reach out directly via the Contact section below.",
        sources: data.sources || ["altaj-virani-resume.pdf"],
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "The chat service is momentarily unreachable. Please check your connection and try again, or reach out directly via the Contact section below.";
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: errorMessage,
        sources: ["altaj-virani-resume.pdf"],
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        copied = false;
      }
    }
    if (!copied) {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      } catch {
        // Silent ignore
      }
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    conversationIdRef.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: `Conversation reset. Ask any question about Altaj Virani's enterprise AI engineering, MCP toolkits, projects, awards, or Azure cloud systems.`,
        sources: ["altaj-virani-resume.pdf"],
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const containerContent = (
    <div className="flex flex-col h-full skeuo-card rounded-2xl overflow-hidden border-2 border-white shadow-[0_24px_60px_rgba(24,24,27,0.28)]">
      {/* Top Studio Header Bar */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#EFF6FF] via-[#FAF8F3] to-[#ECFDF5] border-b border-[#DCD5C9] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl skeuo-btn-cobalt flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#18181B] font-display flex items-center gap-2 flex-wrap">
              <span>Altaj AI Twin</span>
              <span className="text-[10px] font-mono text-[#047857] px-2 py-0.5 rounded-md bg-[#D1FAE5] border border-[#6EE7B7] font-bold">
                Agent Grounded
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-[#15803D] px-2 py-0.5 rounded-md bg-[#F0FDF4] border border-[#86EFAC] font-bold">
                <Shield className="w-2.5 h-2.5 text-[#16A34A]" />
                Cloudflare Protected
              </span>
            </div>
            <div className="text-[11px] text-[#52525B] font-mono truncate">
              Sources:{" "}
              <span className="text-[#2563EB] font-semibold">
                altaj-virani-resume.pdf
              </span>{" "}
              (
              <span className="text-[#047857] font-semibold">
                Markdown / PDF
              </span>
              )
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClear}
            className="min-w-[38px] min-h-[38px] flex items-center justify-center skeuo-btn-ivory rounded-xl text-[#52525B] hover:text-[#18181B] transition-colors cursor-pointer"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {isModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="min-w-[38px] min-h-[38px] flex items-center justify-center skeuo-btn-ivory rounded-xl text-[#52525B] hover:text-[#DC2626] transition-colors cursor-pointer"
              aria-label="Close chat modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Prompt Keycaps */}
      <div className="px-3.5 sm:px-4 py-2.5 bg-[#EFE9DC] border-b border-[#DCD5C9] overflow-x-auto overflow-y-hidden horizontal-scroll-track flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-mono text-[#EA580C] whitespace-nowrap shrink-0 flex items-center gap-1 font-bold">
          <Sparkles className="w-3 h-3" />
          Prompts:
        </span>
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="px-2.5 py-1.5 text-xs font-mono skeuo-btn-ivory text-[#27272A] hover:border-[#2563EB]/60 rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 bg-[#F7F3EA] paper-grain">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                  isUser
                    ? "skeuo-btn-tangerine text-white"
                    : "skeuo-btn-cobalt text-white"
                }`}
              >
                {isUser ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5" />
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? "bg-gradient-to-b from-[#EFF6FF] to-[#DBEAFE] text-[#1E3A8A] border border-[#93C5FD] shadow-sm"
                    : "skeuo-card text-[#27272A]"
                }`}
              >
                {isUser ? (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                ) : (
                  <MarkdownRenderer content={msg.content} />
                )}

                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-[#E5DFD5] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#52525B]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <FileText className="w-3 h-3 text-[#2563EB] shrink-0" />
                      <span>Sources:</span>
                      {msg.sources?.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[#2563EB] font-semibold underline underline-offset-2"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="inline-flex items-center gap-1 text-[#52525B] hover:text-[#18181B] transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#16A34A]" />
                          <span className="text-[#16A34A] font-semibold">
                            Copied
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5 sm:gap-3">
            <div className="w-7 h-7 rounded-lg skeuo-btn-cobalt text-white shrink-0 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="max-w-[88%] sm:max-w-[78%] rounded-xl p-3.5 sm:p-4 skeuo-card space-y-3">
              <div className="flex items-center gap-2.5">
                <TactileSpinner size="sm" />
                <div className="space-y-0.5">
                  <div className="text-xs font-mono font-bold text-[#1E3A8A]">
                    Reasoning over canonical grounding documents…
                  </div>
                  <div className="text-[10px] font-mono text-[#64748B]">
                    Grounded in canonical profile data via Agent Grounding Engine
                  </div>
                </div>
              </div>

              {/* Shimmering Response Skeletons */}
              <div className="space-y-2 pt-2 border-t border-[#E5DFD5]">
                <SkeuoSkeleton className="h-3.5 w-11/12 rounded" />
                <SkeuoSkeleton className="h-3.5 w-4/5 rounded" />
                <SkeuoSkeleton className="h-3.5 w-3/4 rounded opacity-75" />
                <SkeuoSkeleton className="h-3 w-1/2 rounded opacity-50" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-[#FAF8F3] border-t border-[#DCD5C9] flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Altaj's experience, agentic AI, MCP, awards..."
          disabled={isLoading}
          className="flex-1 min-w-0 skeuo-well rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#18181B] placeholder-[#71717A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="min-h-[42px] px-4 py-2.5 rounded-xl skeuo-btn-cobalt skeuo-sheen font-mono font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-45 cursor-pointer shrink-0"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Altaj AI Twin Assistant"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#18181B]/45 backdrop-blur-sm"
        onClick={onCloseModal}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          className="relative w-full max-w-4xl h-[86vh] sm:h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {containerContent}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <section
      id="agent-console"
      className="py-20 border-b border-[#DFD9CE] relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-[600px] w-full">{containerContent}</div>
      </div>
    </section>
  );
};

// Backwards-compatibility alias for previous imports
export const RAGChatbot = AgentChatbot;
