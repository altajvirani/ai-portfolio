import React, { useState } from "react";
import {
  Trophy,
  Award,
  Medal,
  Sparkles,
  Zap,
  ShieldCheck,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  FileText,
  Building2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  AWARDS_DATA,
  EDUCATION_ITEMS,
  CERTIFICATION_ITEMS,
} from "../data/portfolioData.ts";
import { HoverPopup } from "./HoverPopup.tsx";

export const AwardsEducation: React.FC = () => {
  const [expandedEduKey, setExpandedEduKey] = useState<string | null>("batch-topper");

  const getAwardStyles = (accent: "emerald" | "purple" | "cyan" | "amber") => {
    switch (accent) {
      case "amber":
        return {
          border: "border-slate-800 hover:border-amber-400/55",
          accentText: "text-amber-300",
          iconBox: "bg-amber-500/15 border-amber-500/35 text-amber-300",
          button:
            "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/35 text-amber-200",
        };
      case "emerald":
        return {
          border: "border-slate-800 hover:border-emerald-400/55",
          accentText: "text-emerald-300",
          iconBox: "bg-emerald-500/15 border-emerald-500/35 text-emerald-300",
          button:
            "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/35 text-emerald-200",
        };
      case "purple":
        return {
          border: "border-slate-800 hover:border-purple-400/55",
          accentText: "text-purple-300",
          iconBox: "bg-purple-500/15 border-purple-500/35 text-purple-300",
          button:
            "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/35 text-purple-200",
        };
      case "cyan":
      default:
        return {
          border: "border-slate-800 hover:border-cyan-400/55",
          accentText: "text-cyan-300",
          iconBox: "bg-cyan-500/15 border-cyan-500/35 text-cyan-300",
          button:
            "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/35 text-cyan-200",
        };
    }
  };

  const getAwardIcon = (id: string) => {
    switch (id) {
      case "problem-solver-2026":
        return <Award className="w-5 h-5" />;
      case "spot-nov-2025":
        return <Trophy className="w-5 h-5" />;
      case "spot-aug-2025":
        return <Sparkles className="w-5 h-5" />;
      case "spot-jul-2025":
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const toggleEdu = (key: string) => {
    setExpandedEduKey((prev) => (prev === key ? null : key));
  };

  return (
    <section
      id="honors"
      className="scroll-mt-16 py-20 sm:py-24 border-b border-slate-800/80 relative bg-[#0d131f] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 space-y-14 relative z-10">
        {/* SUBSECTION 1: HONORS & AWARDS */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Recognition</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
                Honors & Awards
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-sm font-sans">
              Verified professional awards, academic distinctions, and industry
              certifications.
            </p>
          </div>

          {/* Balanced 2x2 Grid for 4 Verified Resume Awards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AWARDS_DATA.map((award, idx) => {
              const styles = getAwardStyles(award.accentColor);
              return (
                <motion.article
                  key={award.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ y: -3 }}
                  transition={{
                    duration: 0.3,
                    delay: idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950 border ${styles.border} transition-colors duration-300 flex flex-col justify-between gap-5 shadow-lg group`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-xl border transition-transform duration-200 group-hover:scale-105 group-hover:rotate-3 shrink-0 ${styles.iconBox}`}
                        >
                          {getAwardIcon(award.id)}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 tabular-nums">
                            <span className={`font-semibold ${styles.accentText}`}>
                              {award.date}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{award.category}</span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                            {award.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {award.reason}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>
                        {award.organization} · {award.impactHighlight}
                      </span>
                    </span>

                    {award.documentUrl ? (
                      <HoverPopup
                        align="right"
                        content={
                          <div className="space-y-1 text-xs font-mono">
                            <div className="font-semibold text-white">
                              Verified Certificate
                            </div>
                            <p className="text-[11px] text-slate-300 font-sans">
                              {award.subtitle} ({award.date}) — opens official
                              award record.
                            </p>
                          </div>
                        }
                      >
                        <motion.a
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          href={award.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${styles.button}`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Certificate</span>
                          <ExternalLink className="w-3 h-3" />
                        </motion.a>
                      </HoverPopup>
                    ) : (
                      <HoverPopup
                        align="right"
                        content={
                          <div className="space-y-1 text-xs font-mono">
                            <div className="font-semibold text-amber-300">
                              Internal Peer Nomination
                            </div>
                            <p className="text-[11px] text-slate-300 font-sans">
                              Recognized for {award.impactHighlight.toLowerCase()}.
                            </p>
                          </div>
                        }
                      >
                        <span className="text-[11px] font-mono text-amber-300/90 cursor-default">
                          Nominated Distinction
                        </span>
                      </HoverPopup>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* SUBSECTION 2: EDUCATION & CERTIFICATIONS (Layout Preserved, Interactive & Visually Upgraded) */}
        <div className="pt-10 border-t border-slate-800/80 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>Credentials</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                Education & Certifications
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-sans">
              Select any credential row to inspect coursework focus and performance
              metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Column: Academic Credentials & Training Rank (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
              {/* Interactive Batch Topper Distinction */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
                className={`rounded-xl bg-gradient-to-r from-amber-500/12 via-slate-900 to-slate-950 border transition-colors ${
                  expandedEduKey === "batch-topper"
                    ? "border-amber-400/60 shadow-[0_0_24px_rgba(245,158,11,0.14)]"
                    : "border-amber-500/30 hover:border-amber-400/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleEdu("batch-topper")}
                  aria-expanded={expandedEduKey === "batch-topper"}
                  className="w-full p-4 sm:p-5 text-left flex flex-col gap-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 shrink-0">
                        <Medal className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-mono text-amber-300 font-semibold uppercase tracking-wider">
                          Technical Training Distinction
                        </div>
                        <h4 className="text-sm sm:text-base font-bold font-display text-white leading-snug">
                          #1 Batch Topper · Orchard Training Program
                        </h4>
                        <p className="text-xs text-slate-300 truncate">
                          Full-Stack .NET & Cloud Microservices · LTM
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right tabular-nums">
                        <span className="block text-sm font-mono font-bold text-amber-300">
                          94.67%
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          Aggregate
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-amber-300 transition-transform duration-200 ${
                          expandedEduKey === "batch-topper" ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Animated Aggregate Progress Bar */}
                  <div className="h-1.5 w-full rounded-full bg-slate-800/90 overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 0.9467 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      style={{ originX: 0 }}
                      className="h-full w-full rounded-full bg-gradient-to-r from-amber-400 to-cyan-400"
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {expandedEduKey === "batch-topper" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-amber-500/20 text-xs text-slate-300 space-y-1.5 font-sans">
                        <p className="flex items-start gap-2 pt-2">
                          <span className="text-amber-400 shrink-0">▸</span>
                          <span>
                            Ranked #1 across cohort evaluations covering C#, ASP.NET
                            Core, Entity Framework, SQL Server, JWT/OAuth, and
                            cloud-ready REST APIs.
                          </span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Interactive Academic Degree Cards */}
              {EDUCATION_ITEMS.map((item, idx) => {
                const rowKey = `edu-${idx}`;
                const isOpen = expandedEduKey === rowKey;
                const progressRatio = (item.percentageValue ?? 85) / 100;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className={`rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border transition-colors ${
                      isOpen
                        ? "border-purple-400/60 shadow-[0_0_24px_rgba(168,85,247,0.12)]"
                        : "border-slate-800 hover:border-purple-500/45"
                    }`}
                  >
                    <div
                      onClick={() => toggleEdu(rowKey)}
                      className="p-4 sm:p-5 space-y-3 cursor-pointer"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-bold text-white font-display text-sm sm:text-base flex items-center gap-2">
                            <span>{item.degree}</span>
                          </h4>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {item.institution}{" "}
                            <span className="text-slate-500">·</span>{" "}
                            <span className="font-mono text-slate-400 tabular-nums whitespace-nowrap">
                              {item.duration}
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                            <span className="font-mono text-cyan-300 text-xs font-bold tabular-nums">
                              {item.grade}
                            </span>
                            {item.documentUrl && (
                              <HoverPopup
                                align="right"
                                content={
                                  <div className="text-xs font-mono text-slate-200">
                                    Open verified academic transcript
                                  </div>
                                }
                              >
                                <a
                                  href={item.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-xs font-mono text-purple-300 hover:text-purple-200 hover:underline whitespace-nowrap"
                                >
                                  <span>Transcript</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </HoverPopup>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleEdu(rowKey);
                            }}
                            aria-label={`Toggle details for ${item.degree}`}
                            aria-expanded={isOpen}
                            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
                          >
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isOpen ? "rotate-180 text-purple-300" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Animated Performance Gauge */}
                      <div className="h-1.5 w-full rounded-full bg-slate-800/90 overflow-hidden">
                        <motion.div
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: progressRatio }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.7,
                            delay: idx * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{ originX: 0 }}
                          className="h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400"
                        />
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && item.highlights && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.2,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <ul className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-800/80 space-y-1.5">
                            {item.highlights.map((hl, hIdx) => (
                              <li
                                key={hIdx}
                                className="text-xs text-slate-300 flex items-start gap-2 font-sans"
                              >
                                <span
                                  aria-hidden="true"
                                  className="text-purple-400 shrink-0 mt-0.5"
                                >
                                  ▸
                                </span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Column: Verified Certifications (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 flex flex-col justify-between gap-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                    Certifications
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                  Verified
                </span>
              </div>

              <div className="space-y-3 grow flex flex-col justify-center">
                {CERTIFICATION_ITEMS.map((cert, idx) => (
                  <HoverPopup
                    key={idx}
                    align="center"
                    className="w-full"
                    content={
                      <div className="space-y-1 text-xs font-mono">
                        <div className="font-semibold text-cyan-300">
                          {cert.issuer} Credential
                        </div>
                        <p className="text-[11px] text-slate-300 font-sans">
                          {cert.focus || "Verified credential record"}
                        </p>
                      </div>
                    }
                  >
                    <motion.a
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.14 }}
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-start justify-between gap-3 p-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400/50 transition-colors text-xs font-mono text-slate-200 hover:text-white group"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div className="space-y-1 min-w-0">
                          <span className="block font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors leading-snug">
                            {cert.name}
                          </span>
                          <span className="block text-[11px] text-slate-400">
                            {cert.issuer}
                          </span>
                          {cert.focus && (
                            <span className="block text-[11px] text-slate-400/90 font-sans leading-snug pt-0.5">
                              {cert.focus}
                            </span>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                    </motion.a>
                  </HoverPopup>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
