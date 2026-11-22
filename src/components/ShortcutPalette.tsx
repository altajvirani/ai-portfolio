import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Command,
  Search,
  Bot,
  FileText,
  Mail,
  Copy,
  Check,
  ExternalLink,
  X,
  CornerDownLeft,
  Code2,
  Award,
  ShieldCheck,
  Sparkles,
  Zap,
  Cpu,
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
  group:
    | "Primary Actions"
    | "Featured Work & IP"
    | "Engineering Deep Dives"
    | "Direct Channels";
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
      // 1. Primary Actions
      {
        id: "ask-twin",
        label: "Ask AI Twin (Resume Grounded Assistant)",
        hint: "Instant answers on Altaj's architecture, tools & metrics",
        group: "Primary Actions",
        shortcutKeys: ["A"],
        icon: <Bot className="w-4 h-4 text-[#2563EB]" />,
        run: () => {
          onClose();
          setTimeout(onOpenChat, 80);
        },
      },
      {
        id: "view-resume",
        label: "View / Download Official Resume (PDF)",
        hint: "FlowCV verified resume with live credentials",
        group: "Primary Actions",
        shortcutKeys: ["R"],
        icon: <FileText className="w-4 h-4 text-[#EA580C]" />,
        run: () => {
          onClose();
          window.open(
            "https://flowcv.com/resume/gg0rtbkh7jul",
            "_blank",
            "noopener,noreferrer",
          );
        },
      },
      {
        id: "send-inquiry",
        label: "Send Direct Inquiry / Message Altaj",
        hint: "Jump directly to the interactive inquiry dispatch form",
        group: "Primary Actions",
        shortcutKeys: ["I"],
        icon: <Mail className="w-4 h-4 text-[#059669]" />,
        run: () => {
          scrollToSection("contact");
          setTimeout(() => {
            document.getElementById("contact-message")?.focus();
          }, 350);
        },
      },
      {
        id: "copy-email",
        label: copiedEmail
          ? "Email Copied to Clipboard!"
          : "Copy Direct Email Address",
        hint: SOCIAL_LINKS.email,
        group: "Primary Actions",
        shortcutKeys: ["C"],
        icon: copiedEmail ? (
          <Check className="w-4 h-4 text-[#059669]" />
        ) : (
          <Copy className="w-4 h-4 text-[#7C3AED]" />
        ),
        run: () => void handleCopyEmail(),
      },

      // 2. Featured Work & Intellectual Property
      {
        id: "project-snapwright",
        label: "SnapWright VS Code Extension",
        hint: "Visual Studio Marketplace: PageFactory POM generator for Playwright",
        group: "Featured Work & IP",
        shortcutKeys: ["S"],
        icon: <Code2 className="w-4 h-4 text-[#2563EB]" />,
        run: () => {
          onClose();
          window.open(
            "https://marketplace.visualstudio.com/items?itemName=altajvirani.snapwright",
            "_blank",
            "noopener,noreferrer",
          );
        },
      },
      {
        id: "project-ieee",
        label: "IEEE NLP Research Publication",
        hint: "Automatic Question Answer Generation using T5 & NER (IEEE ICSCSS 2023)",
        group: "Featured Work & IP",
        shortcutKeys: ["P"],
        icon: <Award className="w-4 h-4 text-[#D97706]" />,
        run: () => {
          onClose();
          window.open(
            "https://drive.google.com/file/d/1lef8moQmUvzgtEttF1r9qbtEL74lxP0r/view?usp=sharing",
            "_blank",
            "noopener,noreferrer",
          );
        },
      },
      {
        id: "project-autoqa",
        label: "AutoQA AI (Govt of India Copyright)",
        hint: "Privacy-first offline document QA tool with TF-IDF & cosine ranking",
        group: "Featured Work & IP",
        shortcutKeys: ["Q"],
        icon: <ShieldCheck className="w-4 h-4 text-[#059669]" />,
        run: () => {
          onClose();
          window.open(
            "https://drive.google.com/file/d/1ae07j8Z6j2pZGD-Qdy74iskDIWAOfpcJ/view",
            "_blank",
            "noopener,noreferrer",
          );
        },
      },
      {
        id: "project-nivesh",
        label: "Nivesh Venture Seed & Crowdfunding",
        hint: "Open-source Android mobile app with transparent milestone tracking",
        group: "Featured Work & IP",
        shortcutKeys: ["N"],
        icon: <Sparkles className="w-4 h-4 text-[#EA580C]" />,
        run: () => {
          onClose();
          window.open(
            "https://github.com/altajvirani/Nivesh",
            "_blank",
            "noopener,noreferrer",
          );
        },
      },

      // 3. Engineering Deep Dives & Milestones
      {
        id: "eng-keyvault",
        label: "Azure Key Vault 35× Call Reduction",
        hint: "Production incident: 2,807 down to 79 calls/day via shared caching",
        group: "Engineering Deep Dives",
        shortcutKeys: ["K"],
        icon: <Zap className="w-4 h-4 text-[#2563EB]" />,
        run: () => scrollToSection("exp-ltm-software-engineer-network-ai"),
      },
      {
        id: "eng-oom",
        label: "Production Memory RCA (2,640 OOMs Eliminated)",
        hint: "Traced KQL telemetry, resolved runtime limits, dedicated auto-scaling compute",
        group: "Engineering Deep Dives",
        shortcutKeys: ["O"],
        icon: <Cpu className="w-4 h-4 text-[#059669]" />,
        run: () => scrollToSection("exp-ltm-software-engineer-network-ai"),
      },
      {
        id: "eng-cred-azure",
        label: "Microsoft Certified: Azure AI Fundamentals (AI-900)",
        hint: "Official verified credential record on Microsoft Learn",
        group: "Engineering Deep Dives",
        shortcutKeys: ["M"],
        icon: <Award className="w-4 h-4 text-[#7C3AED]" />,
        run: () => {
          onClose();
          window.open(
            "https://learn.microsoft.com/api/credentials/share/en-in/altajvirani/C0872E8742B2D90?sharingId=48999C5125E08B64",
            "_blank",
            "noopener,noreferrer",
          );
        },
      },

      // 4. Direct Channels
      {
        id: "social-linkedin",
        label: "Connect on LinkedIn",
        hint: "linkedin.com/in/altajvirani (endorsements & network)",
        group: "Direct Channels",
        shortcutKeys: ["L"],
        icon: <ExternalLink className="w-4 h-4 text-[#2563EB]" />,
        run: () => {
          onClose();
          window.open(SOCIAL_LINKS.linkedin, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "social-github",
        label: "Explore GitHub Profile",
        hint: "github.com/altajvirani (repositories & open source)",
        group: "Direct Channels",
        shortcutKeys: ["G"],
        icon: <ExternalLink className="w-4 h-4 text-[#18181B]" />,
        run: () => {
          onClose();
          window.open(SOCIAL_LINKS.github, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "social-whatsapp",
        label: "Message Directly on WhatsApp",
        hint: "+91 73039 34303 (opens WhatsApp conversation)",
        group: "Direct Channels",
        shortcutKeys: ["W"],
        icon: <ExternalLink className="w-4 h-4 text-[#16A34A]" />,
        run: () => {
          onClose();
          window.open(SOCIAL_LINKS.whatsapp, "_blank", "noopener,noreferrer");
        },
      },
    ],
    [copiedEmail, onClose, onOpenChat],
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
          aria-label="Quick Actions & Shortcuts"
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
                  placeholder="Search actions, projects, resume, incidents, credentials..."
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
                Global: <strong className="text-[#2563EB]">⌘K / Ctrl+K</strong>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

