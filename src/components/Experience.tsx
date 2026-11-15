import React, { useRef, useState, useEffect } from "react";
import { Briefcase, Building2, Calendar, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { WORK_EXPERIENCE } from "../data/portfolioData.ts";
import { TECH_NODES, getDomainStyle } from "../data/skillsData.tsx";

interface ExperienceProps {
  onSelectSkill: (skillId: string) => void;
}

export const Experience: React.FC<ExperienceProps> = ({ onSelectSkill }) => {
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeId, setActiveId] = useState<string>(WORK_EXPERIENCE[0].id);

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

  const scrollToMilestone = (id: string) => {
    setActiveId(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const getAccentBorder = (accent: string) => {
    switch (accent) {
      case "emerald":
        return "border-emerald-400/60 bg-emerald-400/15 text-emerald-300";
      case "purple":
        return "border-purple-400/60 bg-purple-400/15 text-purple-300";
      case "sky":
        return "border-sky-400/60 bg-sky-400/15 text-sky-300";
      default:
        return "border-cyan-400/60 bg-cyan-400/15 text-cyan-300";
    }
  };

  return (
    <section
      id="experience"
      className="scroll-mt-16 py-20 sm:py-24 border-b border-slate-800/80 relative bg-[#0d131f]"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Section Header (Generalized) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Career Timeline</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              Work Experience
            </h2>
          </div>
          <p className="text-sm text-slate-300 max-w-sm">
            Chronological progression across engineering roles, delivered
            platforms, and production systems.
          </p>
        </div>

        {/* Chronological Scroll Timeline Layout */}
        <div
          ref={timelineContainerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative"
        >
          {/* Left Column: Sticky Chronological Index & Scroll Progress Rail */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/75 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                  Timeline Navigator
                </span>
                <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                  {WORK_EXPERIENCE.length} Milestones
                </span>
              </div>

              <div className="relative pl-5 space-y-3">
                {/* Base Track */}
                <div
                  aria-hidden="true"
                  className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-800 rounded-full"
                />
                {/* Scroll-driven animated progress bar */}
                <motion.div
                  aria-hidden="true"
                  style={{ scaleY: smoothProgress, originY: 0 }}
                  className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-400 via-emerald-400 to-purple-400 rounded-full shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                />

                {WORK_EXPERIENCE.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToMilestone(item.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer relative ${
                        isActive
                          ? "bg-slate-800/90 border-cyan-400/50 text-white shadow-[0_0_16px_rgba(56,189,248,0.12)]"
                          : "bg-slate-950/50 border-slate-800/70 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[19px] top-4 w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                          isActive
                            ? "bg-cyan-400 border-white shadow-[0_0_8px_#38bdf8]"
                            : "bg-slate-900 border-slate-600"
                        }`}
                      />
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono tabular-nums">
                        <span className={isActive ? "text-cyan-300 font-semibold" : "text-slate-400"}>
                          {item.period}
                        </span>
                        <span className="text-slate-400 shrink-0">
                          {item.organization}
                        </span>
                      </div>
                      <div className="text-xs font-display font-bold mt-1 text-current">
                        {item.projectName}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.role}
                        {item.businessUnit ? ` · ${item.businessUnit}` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Column: Scroll-Revealed Layered Timeline Cards */}
          <div className="lg:col-span-8 relative pl-6 sm:pl-9 space-y-8">
            {/* Vertical Chronological Spine */}
            <div
              aria-hidden="true"
              className="absolute left-2 sm:left-3 top-3 bottom-3 w-px bg-gradient-to-b from-cyan-500/60 via-emerald-500/40 to-purple-500/40"
            />

            {WORK_EXPERIENCE.map((item, idx) => {
              const isActive = item.id === activeId;
              const badgeAccent = getAccentBorder(item.accentColor);
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
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.45,
                    delay: idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950 border transition-all duration-300 space-y-5 shadow-xl ${
                    isActive
                      ? "border-cyan-400/50 shadow-[0_0_28px_rgba(56,189,248,0.12)]"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {/* Timeline Spine Node Marker */}
                  <div
                    aria-hidden="true"
                    className={`absolute -left-[22px] sm:-left-[30px] top-7 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-cyan-400 border-white shadow-[0_0_12px_rgba(56,189,248,0.8)] scale-110"
                        : "bg-slate-950 border-slate-500"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                  </div>

                  {/* Card Header: Time, Organization, Role & Project */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{item.organization}</span>
                        </span>
                        {item.businessUnit && (
                          <>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-300">
                              {item.businessUnit}
                            </span>
                          </>
                        )}
                        <span className="text-slate-600">·</span>
                        <span className="text-cyan-300">{item.role}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                        {item.projectName}
                      </h3>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono whitespace-nowrap shrink-0 tabular-nums ${badgeAccent}`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  {/* Concise Summary */}
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {item.summary}
                  </p>

                  {/* Concise Contribution Layers */}
                  <div className="space-y-4">
                    {item.keyContributions.map((contrib, cIdx) => (
                      <div
                        key={cIdx}
                        className="pt-3 border-t border-slate-800/60 first:pt-0 first:border-t-0 space-y-2"
                      >
                        <h4 className="text-xs font-mono text-cyan-300 font-semibold tracking-wide">
                          {contrib.area}
                        </h4>
                        <ul className="space-y-1.5">
                          {contrib.points.map((pt, pIdx) => (
                            <li
                              key={pIdx}
                              className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed font-sans"
                            >
                              <span
                                aria-hidden="true"
                                className="text-cyan-400 font-mono mt-0.5 shrink-0"
                              >
                                ▸
                              </span>
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Shared Skills Chips — Exact Style from Skills Section, Linked to Activate & Scroll */}
                  <div className="pt-4 border-t border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Technologies & Concepts</span>
                      <span className="text-slate-400">
                        Click any skill to inspect in Skills map
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {linkedNodes.map((node) => {
                        const style = getDomainStyle(node.category);
                        return (
                          <button
                            key={node.id}
                            type="button"
                            onClick={() => onSelectSkill(node.id)}
                            title={`Inspect ${node.name} in Skills section`}
                            className={`px-3 py-2 rounded-xl text-xs font-mono text-left transition-all flex items-center gap-2 cursor-pointer border group ${style.pillBg}`}
                          >
                            <span className="shrink-0">{node.logo}</span>
                            <span className="font-semibold">{node.name}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </button>
                        );
                      })}
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
