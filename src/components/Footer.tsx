import React, { useState } from "react";
import { ArrowUp, Stamp, Sparkles, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FooterProps {
  onOpenChat?: () => void;
  onOpenShortcuts?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const [stamps, setStamps] = useState(0);
  const [justStamped, setJustStamped] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStamp = () => {
    setStamps((s) => s + 1);
    setJustStamped(true);
    setTimeout(() => setJustStamped(false), 700);
  };

  return (
    <footer className="relative border-t border-[#D8D0C1] bg-[#EFEAE0] paper-grain pt-0 pb-32 sm:pb-20 overflow-hidden">
      {/* Top Air-Mail Stationery Trim */}
      <div aria-hidden="true" className="h-1.5 w-full airmail-border" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        {/* Top Row: Studio Card + Interactive Action Dock */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Identity & Colophon */}
          <div className="md:col-span-7 space-y-2.5 text-center md:text-left">
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
              systems diagrams, and a grounded AI Twin.
            </p>
          </div>

          {/* Action Dock (Postage Stamp + Top) */}
          <div className="md:col-span-5 flex items-center justify-center md:justify-end gap-2.5">
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

        {/* Bottom Strip: Copyright & Cloudflare Defense Badge */}
        <div className="pt-6 border-t border-[#D8D0C1] flex flex-col sm:flex-row items-center sm:justify-between gap-3 text-xs text-[#52525B] font-mono text-center sm:text-left">
          <span className="text-[11px] sm:text-xs leading-relaxed max-w-sm sm:max-w-none">
            © {new Date().getFullYear()} Altaj Virani. Grounded in verified
            engineering experience.
          </span>
        </div>
      </div>
    </footer>
  );
};
