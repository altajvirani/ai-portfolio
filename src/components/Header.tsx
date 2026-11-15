import React, { useState, useEffect } from "react";
import { Menu, X, Link as LinkIcon } from "lucide-react";
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

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSections, setActiveSections] = useState<string[]>(["hero"]);

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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0d131f]/90 border-b border-slate-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Brand Zone */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg shrink-0"
        >
          <img
            src="/assets/monogram-badge.png"
            alt="Altaj Virani monogram"
            className="h-9 w-9 object-contain shrink-0"
          />
          <span className="flex flex-col justify-center leading-tight">
            <span className="text-base font-extrabold font-display tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
              ALTAJ VIRANI
            </span>
            <span className="block text-[10px] font-mono tracking-widest text-slate-400 uppercase whitespace-nowrap">
              Azure AI Engineer
            </span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-5">
          {NAV_LINKS.map((link) => {
            const isActive = activeSections.includes(link.id);
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : "false"}
                className={`relative px-2.5 py-1.5 text-xs font-mono tracking-wide transition-all cursor-pointer whitespace-nowrap shrink-0 rounded-lg ${
                  isActive
                    ? "text-cyan-300 font-semibold bg-cyan-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Primary Action: Resume */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href="https://flowcv.com/resume/gg0rtbkh7jul"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-mono font-medium text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-400/50 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <a
            href="https://flowcv.com/resume/gg0rtbkh7jul"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume"
            className="p-2.5 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/80 rounded-lg"
          >
            <LinkIcon className="w-4 h-4 text-cyan-400" />
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-2.5 text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/80 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-b border-slate-800 bg-[#0d131f]/98 px-6 py-4 space-y-2 animate-fadeIn"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSections.includes(link.id);
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive ? "true" : "false"}
                className={`w-full text-left py-2.5 px-3 text-sm font-mono rounded-lg transition-all flex items-center justify-between cursor-pointer border ${
                  isActive
                    ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-200 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                    : "border-transparent border-b-slate-800/60 text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300">
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
              className="w-full py-2.5 text-xs font-mono font-medium text-center text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center justify-center gap-2"
            >
              <LinkIcon className="w-4 h-4 text-cyan-400" />
              <span>Resume</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
