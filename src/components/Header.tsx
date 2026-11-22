import React, { useState, useEffect } from "react";
import { Menu, X, Link as LinkIcon, Command } from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { computeActiveSections } from "../utils/portfolioHelpers.ts";

const SECTION_IDS = [
  "hero",
  "experience",
  "projects",
  "skills",
  "honors",
  "contact",
];

const NAV_LINKS = [
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Skills", id: "skills" },
  { label: "Honors", id: "honors" },
  { label: "Contact", id: "contact" },
];

interface HeaderProps {
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenShortcuts }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>(["hero"]);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  useEffect(() => {
    let rafId = 0;

    const updateActive = () => {
      const metrics = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { id, top: rect.top, bottom: rect.bottom };
      }).filter((m): m is { id: string; top: number; bottom: number } => m !== null);

      const nextActive = computeActiveSections(
        metrics,
        window.innerHeight,
        window.scrollY,
        document.documentElement.scrollHeight,
      );

      setActiveSections((prev) =>
        prev.length === nextActive.length &&
        prev.every((val, idx) => val === nextActive[idx])
          ? prev
          : nextActive,
      );
    };

    const handleScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl backdrop-saturate-150 bg-[#F7F4EE]/84 border-b border-[#DCD5C9] shadow-[0_4px_20px_rgba(24,24,27,0.05),inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Zone */}
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-xl shrink-0"
        >
          <img
            src="/assets/monogram-badge.png"
            alt="Altaj Virani monogram"
            className="h-9 w-9 object-contain shrink-0 drop-shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:-rotate-3"
          />
          <span className="flex flex-col justify-center leading-tight">
            <span className="text-base font-extrabold font-display tracking-tight text-[#18181B] group-hover:text-[#2563EB] transition-colors whitespace-nowrap">
              ALTAJ VIRANI
            </span>
            <span className="block text-[10px] font-mono tracking-widest text-[#52525B] uppercase whitespace-nowrap">
              Azure AI Engineer
            </span>
          </span>
        </button>

        {/* Desktop Navigation inside recessed hardware tray */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl skeuo-well"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSections.includes(link.id);
            return (
              <motion.button
                key={link.id}
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ y: 1, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                onClick={() => scrollTo(link.id)}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : "false"}
                className={`relative px-3.5 py-1.5 text-xs font-mono tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 rounded-xl ${
                  isActive
                    ? "skeuo-btn-cobalt text-white font-semibold"
                    : "text-[#52525B] hover:text-[#18181B] hover:bg-white/75"
                }`}
              >
                <span>{link.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Desktop Right Actions: Resume */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ y: 1, scale: 0.98 }}
            href="https://flowcv.com/resume/gg0rtbkh7jul"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-mono font-semibold skeuo-btn-dark skeuo-sheen rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 text-white"
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#93C5FD]" />
            <span>Resume</span>
          </motion.a>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <a
            href="https://flowcv.com/resume/gg0rtbkh7jul"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center skeuo-btn-dark rounded-xl text-white"
          >
            <LinkIcon className="w-4 h-4 text-[#93C5FD]" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center skeuo-btn-ivory rounded-xl text-[#18181B] cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Hairline Cobalt Scroll Reading Gauge */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: smoothProgress, originX: 0 }}
        className="h-[2px] w-full bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#10B981]"
      />

      {/* Frosted Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Mobile navigation"
            className="md:hidden border-b border-[#DCD5C9] bg-[#FAF8F3]/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-lg"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSections.includes(link.id);
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollTo(link.id)}
                  aria-current={isActive ? "page" : undefined}
                  data-active={isActive ? "true" : "false"}
                  className={`w-full min-h-[44px] text-left py-2.5 px-3.5 text-sm font-mono rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "skeuo-btn-cobalt text-white font-semibold"
                      : "skeuo-btn-ivory text-[#3F3F46]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2">
              <a
                href="https://flowcv.com/resume/gg0rtbkh7jul"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] py-2.5 text-xs font-mono font-semibold text-center skeuo-btn-dark skeuo-sheen rounded-xl flex items-center justify-center gap-2 text-white"
              >
                <LinkIcon className="w-4 h-4 text-[#93C5FD]" />
                <span>Resume</span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
