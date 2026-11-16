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
import { InteractiveEmphasis, MagneticTitle } from "./InteractiveText.tsx";

export const AwardsEducation: React.FC = () => {
  const [expandedEduKey, setExpandedEduKey] = useState<string | null>(
    "batch-topper",
  );
  const [mobileCredTab, setMobileCredTab] = useState<
    "academic" | "certifications"
  >("academic");

  const getAwardStyles = (accent: "emerald" | "purple" | "cyan" | "amber") => {
    switch (accent) {
      case "amber":
        return {
          cardSurface:
            "paper-lined-amber border-[#FCD34D] hover:border-[#D97706]",
          topRail: "from-[#F59E0B] to-[#D97706]",
          tapeClass: "washi-tape-amber",
          ctaBtn: "skeuo-btn-tangerine",
          accentText: "text-[#B45309]",
          iconBox:
            "bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border-[#F59E0B] text-[#92400E]",
          badge: "bg-[#FFFBEB] border-[#F59E0B] text-[#92400E]",
        };
      case "emerald":
        return {
          cardSurface:
            "paper-grid-mint border-[#A7F3D0] hover:border-[#059669]",
          topRail: "from-[#10B981] to-[#059669]",
          tapeClass: "washi-tape-mint",
          ctaBtn: "skeuo-btn-mint",
          accentText: "text-[#047857]",
          iconBox:
            "bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] border-[#10B981] text-[#065F46]",
          badge: "bg-[#ECFDF5] border-[#34D399] text-[#065F46]",
        };
      case "purple":
        return {
          cardSurface:
            "paper-grid-violet border-[#DDD6FE] hover:border-[#7C3AED]",
          topRail: "from-[#8B5CF6] to-[#6D28D9]",
          tapeClass: "washi-tape-blue",
          ctaBtn: "skeuo-btn-violet",
          accentText: "text-[#6D28D9]",
          iconBox:
            "bg-gradient-to-br from-[#EDE9FE] to-[#DDD6FE] border-[#8B5CF6] text-[#5B21B6]",
          badge: "bg-[#F5F3FF] border-[#A78BFA] text-[#5B21B6]",
        };
      case "cyan":
      default:
        return {
          cardSurface:
            "paper-grid-cobalt border-[#BFDBFE] hover:border-[#2563EB]",
          topRail: "from-[#3B82F6] to-[#2563EB]",
          tapeClass: "washi-tape-blue",
          ctaBtn: "skeuo-btn-cobalt",
          accentText: "text-[#1D4ED8]",
          iconBox:
            "bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] border-[#3B82F6] text-[#1E3A8A]",
          badge: "bg-[#EFF6FF] border-[#60A5FA] text-[#1E40AF]",
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

  const academicColumn = (
    <div className="flex flex-col justify-between gap-3.5">
      {/* Interactive Batch Topper Distinction (Kraft Card Stock) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.24 }}
        className={`rounded-2xl paper-cutout paper-kraft transition-all ${
          expandedEduKey === "batch-topper"
            ? "ring-2 ring-[#D97706]/30"
            : "hover:border-[#B8945D]"
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
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FCD34D] border border-[#D97706] text-[#78350F] shadow-xs shrink-0">
                <Medal className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-mono text-[#92400E] font-bold uppercase tracking-wider">
                  Technical Training Distinction
                </div>
                <h4 className="text-sm sm:text-base font-bold font-display text-[#18181B] leading-snug">
                  #1 Batch Topper · Orchard Training Program
                </h4>
                <p className="text-xs text-[#4A2E12] truncate">
                  Full-Stack .NET &amp; Cloud Microservices · LTM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className="text-right tabular-nums">
                <span className="block text-sm font-mono font-bold text-[#92400E]">
                  94.67%
                </span>
                <span className="text-[10px] font-mono text-[#5C3A1B] uppercase font-semibold">
                  Aggregate
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[#92400E] transition-transform duration-200 ${
                  expandedEduKey === "batch-topper" ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {/* Recessed Aggregate Well Bar */}
          <div className="h-2.5 w-full rounded-full bg-white/80 border border-[#C9A673] overflow-hidden p-0.5 shadow-inner">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 0.9467 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: 0 }}
              className="h-full w-full rounded-full bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#10B981]"
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
              <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-[#C9A673]/50 text-xs text-[#27272A] space-y-1.5 font-sans">
                <p className="flex items-start gap-2 pt-2 leading-relaxed">
                  <span className="text-[#B45309] font-bold shrink-0">▸</span>
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
        const degreeSurface =
          idx === 0
            ? "paper-grid-cobalt border-[#BFDBFE]"
            : "paper-grid-mint border-[#A7F3D0]";

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.24, delay: idx * 0.04 }}
            className={`rounded-2xl paper-cutout ${degreeSurface} transition-all ${
              isOpen
                ? "ring-2 ring-[#2563EB]/20"
                : "hover:border-[#2563EB]/50"
            }`}
          >
            <div
              onClick={() => toggleEdu(rowKey)}
              className="p-4 sm:p-5 space-y-3 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-[#18181B] font-display text-sm sm:text-base">
                    {item.degree}
                  </h4>
                  <p className="text-xs text-[#3F3F46] leading-relaxed">
                    {item.institution}{" "}
                    <span className="text-[#A1A1AA]">·</span>{" "}
                    <span className="font-mono text-[#52525B] tabular-nums whitespace-nowrap">
                      {item.duration}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                    <span className="font-mono text-[#1E40AF] text-xs font-bold tabular-nums px-2.5 py-0.5 rounded-md bg-white border border-[#93C5FD] shadow-xs">
                      {item.grade}
                    </span>
                    {item.documentUrl && (
                      <HoverPopup
                        align="right"
                        content={
                          <div className="text-xs font-mono text-[#18181B] font-semibold">
                            Open verified academic transcript
                          </div>
                        }
                      >
                        <a
                          href={item.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#6D28D9] hover:underline whitespace-nowrap"
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
                    className="p-1.5 rounded-lg skeuo-btn-ivory text-[#3F3F46] cursor-pointer"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#2563EB]" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Recessed Performance Gauge */}
              <div className="h-2.5 w-full rounded-full bg-white/85 border border-[#D4CEC3] overflow-hidden p-0.5 shadow-inner">
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
                  className="h-full w-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#0EA5E9] to-[#10B981]"
                />
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isOpen && item.highlights && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="px-4 sm:px-5 pb-4 pt-2.5 border-t border-black/10 space-y-1.5">
                    {item.highlights.map((hl, hIdx) => (
                      <li
                        key={hIdx}
                        className="text-xs text-[#27272A] flex items-start gap-2 font-sans leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="text-[#2563EB] font-bold shrink-0 mt-0.5"
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
  );

  const certificationsColumn = (
    <div className="p-5 sm:p-6 rounded-2xl paper-cutout paper-grid-violet border-[#DDD6FE] flex flex-col justify-between gap-5 h-full">
      <div className="flex items-center justify-between border-b border-[#DDD6FE] pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6D28D9]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#4C1D95] font-bold">
            Certifications
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] border border-[#86EFAC] text-[11px] font-mono text-[#166534] font-bold shadow-xs">
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
                <div className="font-bold text-[#2563EB]">
                  {cert.issuer} Credential
                </div>
                <p className="text-[11px] text-[#52525B] font-sans">
                  {cert.focus || "Verified credential record"}
                </p>
              </div>
            }
          >
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-start justify-between gap-3 p-4 rounded-xl bg-white paper-cutout-sm hover:-translate-y-0.5 transition-all text-xs font-mono group"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="space-y-1 min-w-0">
                  <span className="block font-bold text-[#18181B] group-hover:text-[#2563EB] transition-colors leading-snug">
                    {cert.name}
                  </span>
                  <span className="block text-[11px] text-[#6D28D9] font-semibold">
                    {cert.issuer}
                  </span>
                  {cert.focus && (
                    <span className="block text-[11px] text-[#52525B] font-sans leading-snug pt-0.5">
                      {cert.focus}
                    </span>
                  )}
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#2563EB] shrink-0 mt-0.5 transition-colors" />
            </a>
          </HoverPopup>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="honors"
      className="scroll-mt-16 py-16 sm:py-24 border-b border-[#DFD9CE] relative bg-[#FAF7F0] paper-grain overflow-x-clip"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-14 relative z-10">
        {/* SUBSECTION 1: HONORS & AWARDS */}
        <div className="space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold mb-2 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#D97706]" />
                <span>Recognition</span>
              </div>
              <MagneticTitle>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#18181B] tracking-tight">
                  Honors &amp;{" "}
                  <InteractiveEmphasis tone="amber" className="text-[#B45309]">
                    Awards
                  </InteractiveEmphasis>
                </h2>
              </MagneticTitle>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[#52525B] max-w-sm font-sans leading-relaxed">
                Verified professional awards, academic distinctions, and
                industry certifications.
              </p>
              <span className="md:hidden text-[11px] font-mono font-bold text-[#1E3A8A] bg-[#EFF6FF] border border-[#93C5FD] px-2.5 py-1 rounded-full shrink-0 shadow-xs">
                Swipe 1–{AWARDS_DATA.length}
              </span>
            </div>
          </div>

          {/* Mobile Horizontal Snap Deck / Desktop 2x2 Grid */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible no-scrollbar">
            {AWARDS_DATA.map((award, idx) => {
              const styles = getAwardStyles(award.accentColor);
              return (
                <motion.article
                  key={award.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  whileHover={{ y: -4 }}
                  transition={{
                    duration: 0.28,
                    delay: idx * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none p-5 sm:p-6 pt-6 sm:pt-7 rounded-2xl paper-cutout ${styles.cardSurface} transition-all flex flex-col justify-between gap-5 group relative overflow-hidden`}
                >
                  {/* Top Foil Accent Rail */}
                  <div
                    aria-hidden="true"
                    className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${styles.topRail}`}
                  />

                  {/* Decorative Corner Washi Tab */}
                  <span
                    aria-hidden="true"
                    className={`hidden sm:block absolute top-2 right-6 w-12 h-3 rounded-[2px] rotate-2 pointer-events-none ${styles.tapeClass}`}
                  />

                  <div className="space-y-3.5 relative">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl border-2 shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6 shrink-0 ${styles.iconBox}`}
                      >
                        {getAwardIcon(award.id)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#52525B] tabular-nums">
                          <span className={`font-bold ${styles.accentText}`}>
                            {award.date}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{award.category}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold font-display text-[#18181B] mt-0.5">
                          {award.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#27272A] leading-relaxed font-sans font-medium">
                      {award.reason}
                    </p>
                  </div>

                  <div className="pt-3.5 border-t border-black/10 flex flex-wrap items-center justify-between gap-3 relative">
                    <span className="text-xs font-mono text-[#3F3F46] flex items-center gap-1.5 min-w-0">
                      <Building2 className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
                      <span className="truncate font-semibold">
                        {award.organization} · {award.impactHighlight}
                      </span>
                    </span>

                    {award.documentUrl ? (
                      <HoverPopup
                        align="right"
                        content={
                          <div className="space-y-1 text-xs font-mono">
                            <div className="font-bold text-[#18181B]">
                              Verified Certificate
                            </div>
                            <p className="text-[11px] text-[#52525B] font-sans">
                              {award.subtitle} ({award.date}) — opens official
                              award record.
                            </p>
                          </div>
                        }
                      >
                        <a
                          href={award.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`min-h-[36px] px-3 py-1.5 rounded-xl ${styles.ctaBtn} skeuo-sheen text-xs font-mono font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0`}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Certificate</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </HoverPopup>
                    ) : (
                      <HoverPopup
                        align="right"
                        content={
                          <div className="space-y-1 text-xs font-mono">
                            <div className="font-bold text-[#B45309]">
                              Internal Peer Nomination
                            </div>
                            <p className="text-[11px] text-[#52525B] font-sans">
                              Recognized for {award.impactHighlight.toLowerCase()}.
                            </p>
                          </div>
                        }
                      >
                        <span
                          className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg border shadow-xs ${styles.badge} cursor-default`}
                        >
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

        {/* SUBSECTION 2: EDUCATION & CERTIFICATIONS */}
        <div className="pt-10 border-t border-[#DFD9CE] space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold mb-1.5 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                <span>Credentials</span>
              </div>
              <MagneticTitle>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-[#18181B] tracking-tight">
                  Education &amp;{" "}
                  <InteractiveEmphasis tone="violet" className="text-[#6D28D9]">
                    Certifications
                  </InteractiveEmphasis>
                </h3>
              </MagneticTitle>
            </div>
            <p className="text-xs sm:text-sm text-[#52525B] font-sans">
              Select any credential row to inspect coursework focus and
              performance metrics.
            </p>
          </div>

          {/* Mobile Segmented Switcher (< lg) */}
          <div className="lg:hidden p-1 rounded-2xl skeuo-well grid grid-cols-2 gap-1 relative">
            <button
              type="button"
              onClick={() => setMobileCredTab("academic")}
              className={`relative min-h-[42px] py-2 px-3 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                mobileCredTab === "academic" ? "text-white" : "text-[#52525B]"
              }`}
            >
              {mobileCredTab === "academic" && (
                <motion.span
                  layoutId="cred-tab-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className="absolute inset-0 rounded-xl skeuo-btn-cobalt"
                />
              )}
              <span className="relative z-10">
                Academic &amp; Rank ({EDUCATION_ITEMS.length + 1})
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMobileCredTab("certifications")}
              className={`relative min-h-[42px] py-2 px-3 rounded-xl text-xs font-mono font-bold transition-colors cursor-pointer ${
                mobileCredTab === "certifications"
                  ? "text-white"
                  : "text-[#52525B]"
              }`}
            >
              {mobileCredTab === "certifications" && (
                <motion.span
                  layoutId="cred-tab-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className="absolute inset-0 rounded-xl skeuo-btn-violet"
                />
              )}
              <span className="relative z-10">
                Certifications ({CERTIFICATION_ITEMS.length})
              </span>
            </button>
          </div>

          {/* Mobile Single Active Panel (< lg) */}
          <div className="lg:hidden">
            {mobileCredTab === "academic" ? academicColumn : certificationsColumn}
          </div>

          {/* Desktop 7/5 Side-by-Side Layout (lg+) */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7">{academicColumn}</div>
            <div className="lg:col-span-5">{certificationsColumn}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
