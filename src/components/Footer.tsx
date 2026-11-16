import React, { useState } from "react";
import {
  ArrowUp,
  Bot,
  Command,
  Copy,
  Check,
  Stamp,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SOCIAL_LINKS } from "../data/portfolioData.ts";

interface FooterProps {
  onOpenChat?: () => void;
  onOpenShortcuts?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenChat,
  onOpenShortcuts,
}) => {
  const [stamps, setStamps] = useState(0);
  const [justStamped, setJustStamped] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleStamp = () => {
    setStamps((s) => s + 1);
    setJustStamped(true);
    setTimeout(() => setJustStamped(false), 700);
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
    setTimeout(() => setCopiedEmail(false), 1800);
  };

  return (
    <footer className="relative border-t border-[#D8D0C1] bg-[#EFEAE0] paper-grain pt-0 pb-24 sm:pb-20 overflow-hidden">
      {/* Top Air-Mail Stationery Trim */}
      <div aria-hidden="true" className="h-1.5 w-full airmail-border" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        {/* Top Row: Studio Card + Interactive Action Dock */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Identity & Colophon */}
          <div className="md:col-span-5 space-y-2.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2.5">
              <img
                src="/assets/monogram-badge.png"
                alt="Altaj Virani monogram"
                className="h-8 w-8 object-contain"
              />
              <div>
                <span className="text-base font-extrabold font-display text-[#18181B] tracking-tight block">
                  ALTAJ VIRANI
                </span>
                <span className="text-[11px] font-mono text-[#52525B] block">
                  Azure AI Engineer · Mumbai, India
                </span>
              </div>
            </div>
            <p className="text-xs text-[#52525B] max-w-md mx-auto md:mx-0 leading-relaxed font-sans">
              Designed &amp; engineered with paper-craft tactility, interactive
              systems diagrams, and a resume-grounded AI Twin.
            </p>
          </div>

          {/* Interactive Action Dock */}
          <div className="md:col-span-7 flex flex-wrap items-center justify-center md:justify-end gap-2.5">
            {onOpenShortcuts && (
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenShortcuts}
                className="min-h-[40px] px-3.5 py-2 rounded-xl skeuo-btn-ivory text-xs font-mono font-bold text-[#18181B] inline-flex items-center gap-2 cursor-pointer"
              >
                <Command className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Shortcuts</span>
                <kbd className="px-1.5 py-0.5 rounded keycap-badge text-[10px]">
                  ⌘K
                </kbd>
              </motion.button>
            )}

            {onOpenChat && (
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenChat}
                className="min-h-[40px] px-3.5 py-2 rounded-xl skeuo-btn-cobalt skeuo-sheen text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Twin</span>
              </motion.button>
            )}

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleCopyEmail}
              className="min-h-[40px] px-3.5 py-2 rounded-xl skeuo-btn-ivory text-xs font-mono font-semibold text-[#18181B] inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#059669]" />
                  <span className="text-[#059669]">Email Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>Copy Email</span>
                </>
              )}
            </motion.button>

            {/* Tactile Postage Stamp Micro-Interaction */}
            <motion.button
              type="button"
              whileHover={{ y: -2, rotate: -2 }}
              whileTap={{ scale: 0.9, rotate: 4 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              onClick={handleStamp}
              className="relative min-h-[40px] px-3.5 py-2 rounded-xl paper-kraft text-xs font-mono font-bold text-[#78350F] inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Stamp className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{stamps > 0 ? `Stamped · ${stamps}` : "Leave Stamp"}</span>

              <AnimatePresence>
                {justStamped && (
                  <motion.span
                    initial={{ opacity: 0, y: 0, scale: 0.7 }}
                    animate={{ opacity: 1, y: -26, scale: 1.05 }}
                    exit={{ opacity: 0, y: -38 }}
                    transition={{ duration: 0.45 }}
                    className="absolute -top-2 right-2 px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#10B981] text-[10px] font-bold text-[#047857] shadow-xs pointer-events-none flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>+1</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={scrollToTop}
              className="min-h-[40px] px-3.5 py-2 text-xs font-mono font-bold skeuo-btn-ivory rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#2563EB]" />
            </motion.button>
          </div>
        </div>

        {/* Bottom Strip: Quick Section Pills & Copyright */}
        <div className="pt-6 border-t border-[#D8D0C1] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              { id: "experience", label: "Experience" },
              { id: "projects", label: "Projects" },
              { id: "skills", label: "Skills" },
              { id: "honors", label: "Honors" },
              { id: "contact", label: "Contact" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold text-[#52525B] hover:text-[#18181B] hover:bg-white/75 transition-colors cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#52525B] font-mono">
            © {new Date().getFullYear()} Altaj Virani.
          </span>
        </div>
      </div>
    </footer>
  );
};
