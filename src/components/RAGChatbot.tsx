import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Copy, Check, FileText, ChevronDown, Maximize2, Minimize2, X } from 'lucide-react';
import { ChatMessage } from '../types.ts';

interface RAGChatbotProps {
  isModal?: boolean;
  onCloseModal?: () => void;
  initialQuery?: string;
}

const SUGGESTED_QUERIES = [
  'How did Altaj cut Key Vault calls 35x in Azure Container Apps?',
  'What is Altaj’s role with Viki AI and Model Context Protocol (MCP)?',
  'Tell me about his SnapWright VS Code extension',
  'Explain his Nivesh startup crowdfunding platform',
  'How did he diagnose and eliminate 2,640 monthly OOM errors?',
  'Summarize his IEEE research paper on T5 question answering'
];

export const RAGChatbot: React.FC<RAGChatbotProps> = ({
  isModal = false,
  onCloseModal,
  initialQuery = ''
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am Altaj Virani's AI Representative, augmented directly with his verified resume documents (altaj-virani-resume.pdf and altaj-virani_ltm-resume.pdf).\n\nAsk me anything about his enterprise agentic AI architectures (Viki AI, MCP toolkits), high-scale Azure cloud optimizations (35x Key Vault reduction, zero-OOM compute), his published SnapWright VS Code extension, Nivesh crowdfunding app, or his IEEE publication!`,
      sources: ['altaj-virani-resume.pdf', 'altaj-virani_ltm-resume.pdf'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      // Build history for RAG context
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.answer || 'No response generated from the knowledge base.',
        sources: data.sources || ['altaj-virani-resume.pdf'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      console.warn('Chat error, using direct grounded knowledge fallback:', err);
      const queryLower = query.toLowerCase();
      let fallbackContent = `Based on Altaj Virani's verified resume documents:\n\n`;
      
      if (queryLower.includes('snapwright') || queryLower.includes('vscode') || queryLower.includes('pagefactory')) {
        fallbackContent += `• **SnapWright**: An open-source Visual Studio Code extension published on the official marketplace (\`altajvirani.snapwright\`).\n• **Architecture**: Implements an automated PageFactory and Page Object Model (POM) pattern generator for web test suites, featuring smart class-name detection and import consolidation to eliminate memory leaks.\n• **Adoption**: Led the migration of internal Copilot Studio automation frameworks to adopt SnapWright, significantly improving pipeline efficiency.\n\n[Source: altaj-virani-resume.pdf (Page 2) & VS Code Marketplace]`;
      } else if (queryLower.includes('nivesh') || queryLower.includes('crowdfunding') || queryLower.includes('startup')) {
        fallbackContent += `• **Nivesh**: An open-source Android mobile application designed to democratize venture seed capital and startup crowdfunding.\n• **Capabilities**: Connects early-stage startup founders with micro-investors through transparent equity tracking, real-time fundraising metrics, and milestone dashboards.\n• **Stack**: Built with native Android Java, Material Design UI, REST APIs, and Firebase.\n\n[Source: Verified Project Portfolios & GitHub (altajvirani/Nivesh)]`;
      } else if (queryLower.includes('key vault') || queryLower.includes('35x') || queryLower.includes('cache')) {
        fallbackContent += `• **Azure Key Vault Caching**: Cut calls 35× (from 2,807 down to 79/day) by replacing repeated certificate downloads with a shared 12-hour cache across three .NET services on Azure Container Apps.\n• **Reliability**: Eliminated ~13% failed lookups and enforced strict TLS validation with 16 unit tests.\n\n[Source: altaj-virani-resume.pdf (Page 1)]`;
      } else if (queryLower.includes('viki') || queryLower.includes('mcp') || queryLower.includes('agent')) {
        fallbackContent += `• **Viki AI Enterprise Platform**: Led cross-team adoption of Microsoft's internal agentic operations platform across Azure Networking tracks.\n• **Model Context Protocol (MCP)**: Co-developed custom MCP server toolkits and domain agents enabling 20+ specialized agents to call 250+ integrated networking tools.\n\n[Source: altaj-virani_ltm-resume.pdf (Page 3)]`;
      } else if (queryLower.includes('oom') || queryLower.includes('memory') || queryLower.includes('kql')) {
        fallbackContent += `• **Root-Cause Analysis**: Diagnosed 2,640 monthly OOM errors in Azure Container Apps via KQL and Application Insights, uncovering .NET runtime limits (780 MB cap).\n• **Compute Migration**: Drove migration to dedicated auto-scaling compute, sustaining zero errors thereafter.\n\n[Source: altaj-virani-resume.pdf (Page 1)]`;
      } else if (queryLower.includes('ieee') || queryLower.includes('paper') || queryLower.includes('t5') || queryLower.includes('publication')) {
        fallbackContent += `• **IEEE ICSCSS (2023) Paper**: 'Automatic Question Answer Generation using T5 and NLP'.\n• Combines Google's T5 model with Named Entity Recognition, POS tagging, and Sense2Vec for automated question synthesis and distractor generation.\n\n[Source: altaj-virani-resume.pdf (Page 2)]`;
      } else {
        fallbackContent += `• **Profile**: Azure AI Engineer in Microsoft Business Unit (MSBU).\n• **Core Strengths**: Model Context Protocol (MCP), Viki AI agent orchestration, Hybrid RAG with HNSW vector indexing (80% troubleshooting acceleration), high-scale Azure cloud infrastructure, SnapWright VS Code extension, and Nivesh mobile platform.\n\n[Source: altaj-virani_ltm-resume.pdf & altaj-virani-resume.pdf]`;
      }

      const fallbackMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
        sources: ['altaj-virani-resume.pdf', 'altaj-virani_ltm-resume.pdf'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Conversation reset. Ask any question about Altaj Virani's enterprise AI engineering, MCP toolkits, or Azure cloud systems.`,
        sources: ['altaj-virani-resume.pdf'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const containerContent = (
    <div className="flex flex-col h-full bg-[#0d131f] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.15)] overflow-hidden">
      {/* Top Console Bar */}
      <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <Bot className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-display flex items-center gap-2">
              <span>Altaj AI Twin</span>
              <span className="text-[10px] font-mono text-emerald-300 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                RAG Grounded
              </span>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Knowledge Base: <span className="text-cyan-300">altaj-virani-resume.pdf</span> & <span className="text-purple-300">ltm-resume.pdf</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          {isModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close chat modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-mono text-cyan-400 whitespace-nowrap shrink-0 flex items-center gap-1 font-semibold">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          Suggested:
        </span>
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="px-2.5 py-1 text-xs font-mono text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs ${
                  isUser
                    ? 'bg-purple-900/60 border border-purple-500/40 text-purple-200'
                    : 'bg-gradient-to-tr from-cyan-400 to-purple-400 text-slate-950 font-bold'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-slate-950" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-purple-950/60 text-white border border-purple-500/40'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Sources & Action footer for assistant messages */}
                {!isUser && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <FileText className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span className="text-slate-400">Sources:</span>
                      {msg.sources?.map((s, idx) => (
                        <span key={idx} className="text-cyan-300 underline underline-offset-2">
                          {s}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
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
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-white text-slate-950 shrink-0 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-slate-950 animate-spin" />
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Retrieving relevant chunks & formulating grounded response...</span>
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
        className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Altaj's experience, MCP, Viki AI, 35x Key Vault optimization..."
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-40 cursor-pointer"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5 text-slate-950" />
        </button>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onCloseModal}
      >
        <div
          className="relative w-full max-w-4xl h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {containerContent}
        </div>
      </div>
    );
  }

  return (
    <section id="rag-console" className="py-20 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Interactive Retrieval-Augmented Generation
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Grounded AI Portfolio Terminal
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Query Altaj's actual resume documents in real time via Gemini and our hybrid knowledge engine.
          </p>
        </div>

        <div className="h-[600px] w-full">
          {containerContent}
        </div>
      </div>
    </section>
  );
};
