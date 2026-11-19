import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Command,
  Search,
  Bot,
  Briefcase,
  BookOpen,
  Cpu,
  Trophy,
  Mail,
  Copy,
  Check,
  ExternalLink,
  X,
  ArrowUp,
  CornerDownLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SOCIAL_LINKS } from "../data/portfolioData.ts";

export interface ShortcutPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  onSelectSkill: (skillId: string) => void;
}

interface ShortcutAction {
  id: string;
  label: string;
  hint: string;
  group: "Sections" | "Quick Actions" | "Top Skills";
  shortcutKeys: string[];
  icon: React.ReactNode;
  run: () => void;
}

export const ShortcutPalette: React.FC<ShortcutPaletteProps> = ({
  isOpen,
  onClose,
  onOpenChat,
  onSelectSkill,
}) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToSection = (id: string) => {
    onClose();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(SOCIAL_LINKS.email);
      } else {
        throw new Error("fallback");
      }
    } catch {
      const ta = document.createElement("textarea");
      ta.value = SOCIAL_LINKS.email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedEmail(true);
    setTimeout(() => {
      setCopiedEmail(false);
      onClose();
    }, 650);
  };

  const actions: ShortcutAction[] = useMemo(
    () => [
      {
        id: "ask-twin",
        label: "Ask AI Twin (Resume Assistant)",
        hint: "Chat grounded in Altaj's resume & projects",
        group: "Quick Actions",
        shortcutKeys: ["A"],
        icon: <Bot className="w-4 h-4 text-[#2563EB]" />,
        run: () => {
          onClose();
          setTimeout(onOpenChat, 80);
        },
      },
      {
        id: "copy-email",
        label: copiedEmail ? "Email Copied!" : "Copy Direct Email",
        hint: SOCIAL_LINKS.email,
        group: "Quick Actions",
        shortcutKeys: ["C"],
        icon: copiedEmail ? (
          <Check className="w-4 h-4 text-[#059669]" />
        ) : (
          <Copy className="w-4 h-4 text-[#EA580C]" />
        ),
        run: () => void handleCopyEmail(),
      },
      {
        id: "open-whatsapp",
        label: "Chat on WhatsApp",
        hint: "Direct messaging (+91 73039 34303)",
        group: "Quick Actions",
        shortcutKeys: ["W"],
        icon: <ExternalLink className="w-4 h-4 text-[#059669]" />,
        run: () => {
          onClose();
          window.open(SOCIAL_LINKS.whatsapp, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "nav-top",
        label: "Scroll to Top (Hero)",
        hint: "Back to overview & interactive origami studio",
        group: "Sections",
        shortcutKeys: ["1"],
        icon: <ArrowUp className="w-4 h-4 text-[#2563EB]" />,
        run: () => scrollToSection("hero"),
      },
      {
        id: "nav-experience",
        label: "Go to Work Experience",
        hint: "AI platform, Power Apps & training milestones",
        group: "Sections",
        shortcutKeys: ["2"],
        icon: <Briefcase className="w-4 h-4 text-[#2563EB]" />,
        run: () => scrollToSection("experience"),
      },
      {
        id: "nav-projects",
        label: "Go to Featured Projects",
        hint: "AutoQAGen (IEEE), AutoQA AI, SnapWright, Nivesh",
        group: "Sections",
        shortcutKeys: ["3"],
        icon: <BookOpen className="w-4 h-4 text-[#059669]" />,
        run: () => scrollToSection("projects"),
      },
      {
        id: "nav-skills",
        label: "Go to Skills Ecosystem",
        hint: "Interactive stack & linked dependencies",
        group: "Sections",
        shortcutKeys: ["4"],
        icon: <Cpu className="w-4 h-4 text-[#7C3AED]" />,
        run: () => scrollToSection("skills"),
      },
      {
        id: "nav-honors",
        label: "Go to Honors & Credentials",
        hint: "Spot awards, Problem Solver badge & B.E.",
        group: "Sections",
        shortcutKeys: ["5"],
        icon: <Trophy className="w-4 h-4 text-[#D97706]" />,
        run: () => scrollToSection("honors"),
      },
      {
        id: "nav-contact",
        label: "Go to Contact & Connections",
        hint: "Send inquiry or open developer profiles",
        group: "Sections",
        shortcutKeys: ["6"],
        icon: <Mail className="w-4 h-4 text-[#EA580C]" />,
        run: () => scrollToSection("contact"),
      },
      {
        id: "skill-mcp",
        label: "Inspect Skill: Model Context Protocol (MCP)",
        hint: "Agentic tool calling & CLI plugins",
        group: "Top Skills",
        shortcutKeys: ["M"],
        icon: <Cpu className="w-4 h-4 text-[#2563EB]" />,
        run: () => {
          onClose();
          setTimeout(() => onSelectSkill("mcp"), 80);
        },
      },
      {
        id: "skill-rag",
        label: "Inspect Skill: Hybrid RAG & HNSW",
        hint: "Semantic retrieval pipeline",
        group: "Top Skills",
        shortcutKeys: ["R"],
        icon: <Cpu className="w-4 h-4 text-[#0284C7]" />,
        run: () => {
          onClose();
          setTimeout(() => onSelectSkill("rag"), 80);
        },
      },
      {
        id: "skill-aca",
        label: "Inspect Skill: Azure Container Apps",
        hint: "Microservice runtime & auto-scaling",
        group: "Top Skills",
        shortcutKeys: ["K"],
        icon: <Cpu className="w-4 h-4 text-[#059669]" />,
        run: () => {
          onClose();
          setTimeout(() => onSelectSkill("container-apps"), 80);
        },
      },
    ],
    [copiedEmail, onClose, onOpenChat, onSelectSkill],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.hint.toLowerCase().includes(q) ||
        a.group.toLowerCase().includes(q),
    );
  }, [actions, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) =>
          filtered.length ? (prev + 1) % filtered.length : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) =>
          filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0,
        );
      } else if (e.key === "Enter" && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].run();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, filtered, activeIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Navigation & Shortcuts"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4 bg-[#18181B]/45 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl paper-cutout bg-[#FAF7F0] overflow-hidden shadow-[0_24px_60px_rgba(24,24,27,0.28)]"
          >
            {/* Header & Search Input */}
            <div className="p-3.5 sm:p-4 bg-white border-b border-[#E5DFD5] flex items-center gap-3">
              <div className="p-2 rounded-xl skeuo-btn-cobalt text-white shrink-0">
                <Command className="w-4 h-4" />
              </div>
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <Search className="w-4 h-4 text-[#71717A] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Jump to section, inspect skill, or run shortcut..."
                  className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#18181B] placeholder-[#71717A] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close shortcuts palette"
                className="p-2 rounded-xl skeuo-btn-ivory text-[#52525B] hover:text-[#18181B] cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[56vh] overflow-y-auto p-2.5 sm:p-3 space-y-1.5 paper-grain">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs font-mono text-[#52525B]">
                  No matching shortcuts found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={item.run}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                        isActive
                          ? "bg-white border border-[#2563EB]/60 ring-2 ring-[#2563EB]/15 shadow-xs"
                          : "hover:bg-white/75 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-[#F7F4EE] border border-[#DCD5C9] shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-display font-bold text-[#18181B] truncate">
                            {item.label}
                          </div>
                          <div className="text-[11px] font-mono text-[#52525B] truncate">
                            {item.hint}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-wider text-[#71717A] mr-1">
                          {item.group}
                        </span>
                        {item.shortcutKeys.map((k) => (
                          <kbd
                            key={k}
                            className="px-2 py-0.5 rounded-md keycap-badge text-[10px] font-mono font-bold text-[#18181B]"
                          >
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Key Hints */}
            <div className="px-4 py-2.5 bg-[#EFEAE0] border-t border-[#DCD5C9] flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono text-[#52525B]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded keycap-badge font-bold text-[#18181B]">
                    ↑↓
                  </kbd>
                  <span>Navigate</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded keycap-badge font-bold text-[#18181B] inline-flex items-center">
                    <CornerDownLeft className="w-2.5 h-2.5" />
                  </kbd>
                  <span>Open</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded keycap-badge font-bold text-[#18181B]">
                    Esc
                  </kbd>
                  <span>Close</span>
                </span>
              </div>
              <span>
                Global: <strong className="text-[#2563EB]">⌘K / Ctrl+K</strong> or{" "}
                <strong className="text-[#2563EB]">1–6</strong>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
