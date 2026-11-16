import React, { useRef, useState, useEffect } from "react";
import { Briefcase, Building2, Calendar, ChevronDown } from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { WORK_EXPERIENCE } from "../data/portfolioData.ts";
import { TECH_NODES } from "../data/skillsData.tsx";
import { SkillChip } from "./SkillChip.tsx";
import { InteractiveEmphasis, MagneticTitle } from "./InteractiveText.tsx";

interface ExperienceProps {
  onSelectSkill: (skillId: string) => void;
}

function getExperienceTheme(accent: string) {
  switch (accent) {
    case "emerald":
      return {
        cardSurface:
          "paper-grid-mint border-[#A7F3D0] shadow-[0_8px_22px_-8px_rgba(5,150,105,0.16)]",
        activeRing:
          "border-[#059669]/70 ring-2 ring-[#10B981]/25 shadow-[0_14px_30px_-8px_rgba(5,150,105,0.24)]",
        tapeClass: "washi-tape-mint",
        badge: "bg-[#ECFDF5] border-[#6EE7B7] text-[#065F46]",
        well: "bg-white/88 border border-[#A7F3D0]/80 shadow-[inset_0_1px_2px_rgba(5,150,105,0.06),0_2px_6px_rgba(5,150,105,0.05)]",
        titleText: "text-[#047857]",
        bulletText: "text-[#059669]",
        marker: "bg-[#059669] shadow-[0_0_0_2px_#059669]",
        dot: "bg-[#059669]",
      };
    case "sky":
      return {
        cardSurface:
          "paper-lined-amber border-[#FDE68A] shadow-[0_8px_22px_-8px_rgba(217,119,6,0.16)]",
        activeRing:
          "border-[#D97706]/70 ring-2 ring-[#F59E0B]/25 shadow-[0_14px_30px_-8px_rgba(217,119,6,0.24)]",
        tapeClass: "washi-tape-amber",
        badge: "bg-[#FFFBEB] border-[#FCD34D] text-[#92400E]",
        well: "bg-white/90 border border-[#FDE68A] shadow-[inset_0_1px_2px_rgba(180,83,9,0.06),0_2px_6px_rgba(180,83,9,0.05)]",
        titleText: "text-[#B45309]",
        bulletText: "text-[#D97706]",
        marker: "bg-[#D97706] shadow-[0_0_0_2px_#D97706]",
        dot: "bg-[#D97706]",
      };
    case "purple":
      return {
        cardSurface:
          "paper-grid-violet border-[#DDD6FE] shadow-[0_8px_22px_-8px_rgba(124,58,237,0.16)]",
        activeRing:
          "border-[#7C3AED]/70 ring-2 ring-[#8B5CF6]/25 shadow-[0_14px_30px_-8px_rgba(124,58,237,0.24)]",
        tapeClass: "washi-tape-blue",
        badge: "bg-[#F5F3FF] border-[#C4B5FD] text-[#5B21B6]",
        well: "bg-white/88 border border-[#DDD6FE]/85 shadow-[inset_0_1px_2px_rgba(124,58,237,0.06),0_2px_6px_rgba(124,58,237,0.05)]",
        titleText: "text-[#6D28D9]",
        bulletText: "text-[#7C3AED]",
        marker: "bg-[#7C3AED] shadow-[0_0_0_2px_#7C3AED]",
        dot: "bg-[#7C3AED]",
      };
    default:
      return {
        cardSurface:
          "paper-grid-cobalt border-[#BFDBFE] shadow-[0_8px_22px_-8px_rgba(37,99,235,0.16)]",
        activeRing:
          "border-[#2563EB]/75 ring-2 ring-[#3B82F6]/25 shadow-[0_14px_30px_-8px_rgba(37,99,235,0.24)]",
        tapeClass: "washi-tape-blue",
        badge: "bg-[#EFF6FF] border-[#93C5FD] text-[#1E40AF]",
        well: "bg-white/88 border border-[#BFDBFE]/85 shadow-[inset_0_1px_2px_rgba(37,99,235,0.06),0_2px_6px_rgba(37,99,235,0.05)]",
        titleText: "text-[#1D4ED8]",
        bulletText: "text-[#2563EB]",
        marker: "bg-[#2563EB] shadow-[0_0_0_2px_#2563EB]",
        dot: "bg-[#2563EB]",
      };
  }
}

export const Experience: React.FC<ExperienceProps> = ({ onSelectSkill }) => {
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const mobileTabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeId, setActiveId] = useState<string>(WORK_EXPERIENCE[0].id);
  const [expandedCardId, setExpandedCardId] = useState<string>(
    WORK_EXPERIENCE[0].id,
  );

  const { scrollYProgress } = useScroll({
    target: timelineContainerRef,
    offset: ["start 65%", "end 70%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const id = visible[0].target.getAttribute("data-timeline-id");
          if (id) setActiveId(id);
        }
      },
      { threshold: [0.25, 0.55], rootMargin: "-15% 0px -35% 0px" },
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Automatically slide the mobile horizontal tab track so activeId stays smoothly centered in view
  useEffect(() => {
    const container = mobileTrackRef.current;
    const activeTab = mobileTabRefs.current[activeId];
    if (!container || !activeTab) return;
    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    const targetLeft =
      container.scrollLeft +
      (tabRect.left - containerRect.left) -
      container.clientWidth / 2 +
      tabRect.width / 2;
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, [activeId]);

  const scrollToMilestone = (id: string) => {
    setActiveId(id);
    setExpandedCardId(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section
      id="experience"
      className="scroll-mt-16 py-16 sm:py-24 border-b border-[#DFD9CE] relative bg-[#F7F4EE] paper-grain"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Career Timeline</span>
            </div>
            <MagneticTitle>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#18181B] tracking-tight">
                Work{" "}
                <InteractiveEmphasis tone="cobalt" className="text-[#1D4ED8]">
                  Experience
                </InteractiveEmphasis>
              </h2>
            </MagneticTitle>
          </div>
          <p className="text-sm text-[#52525B] max-w-sm leading-relaxed">
            Chronological progression across engineering roles, delivered
            platforms, and production systems.
          </p>
        </div>

        {/* Mobile Sticky Transit Stop Bar — auto-slides horizontally to keep activeId centered */}
        <div
          ref={mobileTrackRef}
          data-mobile-exp-track="true"
          className="lg:hidden sticky top-16 z-20 -mx-4 px-4 py-2.5 bg-[#F7F4EE]/86 backdrop-blur-xl backdrop-saturate-150 border-y border-[#DCD5C9] shadow-[0_6px_16px_rgba(24,24,27,0.06)] flex items-center gap-2 overflow-x-auto no-scrollbar"
        >
          {WORK_EXPERIENCE.map((item) => {
            const isActive = item.id === activeId;
            const theme = getExperienceTheme(item.accentColor);
            return (
              <button
                key={item.id}
                ref={(el) => {
                  mobileTabRefs.current[item.id] = el;
                }}
                type="button"
                data-mobile-exp-tab={item.id}
                data-active={isActive ? "true" : "false"}
                onClick={() => scrollToMilestone(item.id)}
                className={`min-h-[38px] px-3 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? "skeuo-btn-cobalt skeuo-sheen text-white font-bold"
                    : "skeuo-btn-ivory text-[#3F3F46]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isActive ? "bg-white" : theme.dot
                  }`}
                />
                <span>{item.period.split("–")[0].trim()}</span>
                <span className="opacity-70">·</span>
                <span className="max-w-[140px] truncate">{item.projectName}</span>
              </button>
            );
          })}
        </div>

        {/* Chronological Scroll Timeline Layout */}
        <div
          ref={timelineContainerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative"
        >
          {/* Desktop Left Column: Sticky Textured Route Index (Hidden on mobile < lg) */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="p-5 rounded-2xl paper-kraft space-y-4 relative">
              <div className="flex items-center justify-between border-b border-[#C9A673]/50 pb-3">
                <span className="text-xs font-mono font-bold text-[#4A2E12] uppercase tracking-wider">
                  Timeline Navigator
                </span>
                <span className="text-[11px] font-mono font-bold text-[#1E3A8A] bg-white border border-[#93C5FD] px-2 py-0.5 rounded-full shadow-xs">
                  Chronological
                </span>
              </div>

              <div className="relative pl-5 space-y-3">
                {/* Base Recessed Route Groove */}
                <div
                  aria-hidden="true"
                  className="absolute left-1.5 top-2 bottom-2 w-1 bg-[#D6B88C] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.16)]"
                />
                {/* Scroll-driven tricolor progress fill */}
                <motion.div
                  aria-hidden="true"
                  style={{ scaleY: smoothProgress, originY: 0 }}
                  className="absolute left-1.5 top-2 bottom-2 w-1 bg-gradient-to-b from-[#2563EB] via-[#10B981] to-[#F59E0B] rounded-full"
                />

                {WORK_EXPERIENCE.map((item) => {
                  const isActive = item.id === activeId;
                  const theme = getExperienceTheme(item.accentColor);
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98, y: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      onClick={() => scrollToMilestone(item.id)}
                      className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer relative ${
                        isActive
                          ? "paper-cutout-sm bg-white text-[#18181B]"
                          : "bg-white/65 hover:bg-white/90 border border-[#C9A673]/55 text-[#52525B] hover:text-[#18181B]"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[20px] top-4 w-3 h-3 rounded-full border-2 transition-all ${
                          isActive
                            ? `${theme.marker} border-white`
                            : "bg-[#FAF8F3] border-[#A1A1AA]"
                        }`}
                      />
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono tabular-nums">
                        <span
                          className={
                            isActive
                              ? `${theme.titleText} font-bold`
                              : "text-[#52525B] font-medium"
                          }
                        >
                          {item.period}
                        </span>
                        <span className="text-[#71717A] shrink-0">
                          {item.organization}
                        </span>
                      </div>
                      <div className="text-xs font-display font-bold mt-1 text-[#18181B]">
                        {item.projectName}
                      </div>
                      <div className="text-[11px] text-[#52525B] mt-0.5">
                        {item.role}
                        {item.businessUnit ? ` · ${item.businessUnit}` : ""}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Column: Scroll-Revealed Tactile Paper-Stock Timeline Cards */}
          <div className="lg:col-span-8 relative pl-0 lg:pl-9 space-y-7 sm:space-y-9">
            {/* Desktop Vertical Chronological Spine */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute left-3 top-3 bottom-3 w-0.5 bg-[#D9D2C5]"
            />

            {WORK_EXPERIENCE.map((item, idx) => {
              const isActive = item.id === activeId;
              const isMobileExpanded = expandedCardId === item.id;
              const theme = getExperienceTheme(item.accentColor);
              const linkedNodes = item.skillIds
                .map((id) => TECH_NODES.find((n) => n.id === id))
                .filter((n): n is NonNullable<typeof n> => Boolean(n));

              return (
                <motion.article
                  key={item.id}
                  data-timeline-id={item.id}
                  ref={(el) => {
                    cardRefs.current[item.id] = el;
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  whileHover={{ y: -3 }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative p-5 sm:p-7 rounded-2xl paper-cutout ${theme.cardSurface} transition-all duration-300 space-y-4 sm:space-y-5 ${
                    isActive ? theme.activeRing : ""
                  }`}
                >
                  {/* Decorative Translucent Masking Washi Tape Corner Strip */}
                  <span
                    aria-hidden="true"
                    className={`hidden sm:block absolute -top-2.5 right-10 w-16 h-4 rounded-[2px] rotate-2 pointer-events-none ${theme.tapeClass}`}
                  />

                  {/* Desktop Spine Station Marker */}
                  <div
                    aria-hidden="true"
                    className={`hidden lg:flex absolute -left-[32px] top-7 w-4 h-4 rounded-full border-2 border-white items-center justify-center transition-all ${
                      isActive
                        ? `${theme.marker} scale-110`
                        : "bg-[#FAF8F3] border-[#A1A1AA]"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-black/10 pb-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-mono text-[#52525B]">
                        <span className="inline-flex items-center gap-1.5 font-bold text-[#18181B]">
                          <Building2
                            className={`w-3.5 h-3.5 ${theme.bulletText}`}
                          />
                          <span>{item.organization}</span>
                        </span>
                        {item.businessUnit && (
                          <>
                            <span className="text-[#A1A1AA]">·</span>
                            <span>{item.businessUnit}</span>
                          </>
                        )}
                        <span className="text-[#A1A1AA]">·</span>
                        <span className={`${theme.titleText} font-semibold`}>
                          {item.role}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-[#18181B] tracking-tight">
                        {item.projectName}
                      </h3>
                    </div>

                    <div
                      className={`self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-bold whitespace-nowrap shrink-0 tabular-nums shadow-xs ${theme.badge}`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  {/* Concise Summary */}
                  <p className="text-sm text-[#27272A] leading-relaxed font-sans font-medium">
                    {item.summary}
                  </p>

                  {/* Mobile Toggle for Detailed Contributions — Clean label without number */}
                  <div className="sm:hidden">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCardId(isMobileExpanded ? "" : item.id)
                      }
                      aria-expanded={isMobileExpanded}
                      className="w-full min-h-[42px] px-3.5 py-2 rounded-xl skeuo-btn-ivory text-xs font-mono font-bold text-[#18181B] flex items-center justify-between cursor-pointer"
                    >
                      <span>
                        {isMobileExpanded
                          ? "Hide Delivery Highlights"
                          : "View Delivery Highlights"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 ${theme.bulletText} transition-transform duration-200 ${
                          isMobileExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Desktop Contribution Layers (Always visible sm+) */}
                  <div className="hidden sm:grid sm:grid-cols-1 gap-3">
                    {item.keyContributions.map((contrib, cIdx) => (
                      <motion.div
                        key={cIdx}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 420, damping: 28 }}
                        className={`p-4 rounded-xl ${theme.well} space-y-2`}
                      >
                        <h4
                          className={`text-xs font-mono ${theme.titleText} font-bold tracking-wide`}
                        >
                          {contrib.area}
                        </h4>
                        <ul className="space-y-1.5">
                          {contrib.points.map((pt, pIdx) => (
                            <li
                              key={pIdx}
                              className="text-xs sm:text-sm text-[#27272A] flex items-start gap-2.5 leading-relaxed font-sans"
                            >
                              <span
                                aria-hidden="true"
                                className={`${theme.bulletText} font-mono mt-0.5 shrink-0 font-bold`}
                              >
                                ▸
                              </span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mobile Collapsible Contribution Layers */}
                  <AnimatePresence initial={false}>
                    {isMobileExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="sm:hidden overflow-hidden space-y-2.5"
                      >
                        {item.keyContributions.map((contrib, cIdx) => (
                          <div
                            key={cIdx}
                            className={`p-3.5 rounded-xl ${theme.well} space-y-1.5`}
                          >
                            <h4
                              className={`text-xs font-mono ${theme.titleText} font-bold tracking-wide`}
                            >
                              {contrib.area}
                            </h4>
                            <ul className="space-y-1.5">
                              {contrib.points.map((pt, pIdx) => (
                                <li
                                  key={pIdx}
                                  className="text-xs text-[#27272A] flex items-start gap-2 leading-relaxed font-sans"
                                >
                                  <span
                                    aria-hidden="true"
                                    className={`${theme.bulletText} font-mono mt-0.5 shrink-0 font-bold`}
                                  >
                                    ▸
                                  </span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shared Skills Chips */}
                  <div className="pt-4 border-t border-black/10 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#52525B]">
                      <span className="font-bold text-[#18181B]">
                        Technologies &amp; Concepts
                      </span>
                      <span className="hidden sm:inline">
                        Click any skill to inspect in Skills map
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {linkedNodes.map((node) => (
                        <SkillChip
                          key={node.id}
                          node={node}
                          onSelect={onSelectSkill}
                        />
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
