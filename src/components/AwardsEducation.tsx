import React from "react";
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
} from "lucide-react";
import {
  AWARDS_DATA,
  EDUCATION_ITEMS,
  CERTIFICATION_ITEMS,
} from "../data/portfolioData.ts";

export const AwardsEducation: React.FC = () => {
  const getAwardStyles = (accent: "emerald" | "purple" | "cyan" | "amber") => {
    switch (accent) {
      case "amber":
        return {
          border: "border-slate-800 hover:border-amber-400/50",
          accentText: "text-amber-300",
          iconBox: "bg-amber-500/15 border-amber-500/35 text-amber-300",
          button:
            "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/35 text-amber-200",
        };
      case "emerald":
        return {
          border: "border-slate-800 hover:border-emerald-400/50",
          accentText: "text-emerald-300",
          iconBox: "bg-emerald-500/15 border-emerald-500/35 text-emerald-300",
          button:
            "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/35 text-emerald-200",
        };
      case "purple":
        return {
          border: "border-slate-800 hover:border-purple-400/50",
          accentText: "text-purple-300",
          iconBox: "bg-purple-500/15 border-purple-500/35 text-purple-300",
          button:
            "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/35 text-purple-200",
        };
      case "cyan":
      default:
        return {
          border: "border-slate-800 hover:border-cyan-400/50",
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

  return (
    <section
      id="honors"
      className="scroll-mt-16 py-20 sm:py-24 border-b border-slate-800/80 relative bg-[#0d131f] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-14 relative z-10">
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
            {AWARDS_DATA.map((award) => {
              const styles = getAwardStyles(award.accentColor);
              return (
                <article
                  key={award.id}
                  className={`p-6 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950 border ${styles.border} transition-all duration-300 flex flex-col justify-between gap-5 shadow-lg group`}
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl border ${styles.iconBox}`}>
                          {getAwardIcon(award.id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 tabular-nums">
                            <span className={`font-semibold ${styles.accentText}`}>
                              {award.date}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{award.category}</span>
                          </div>
                          <h3 className="text-xl font-bold font-display text-white mt-0.5">
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
                      <a
                        href={award.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${styles.button}`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Certificate</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-amber-300/90">
                        Nominated Distinction
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* SUBSECTION 2: EDUCATION & CERTIFICATIONS */}
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
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Column: Academic Credentials & Training Rank (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
              {/* Batch Topper Distinction */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 shrink-0">
                    <Medal className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-amber-300 font-semibold uppercase tracking-wider">
                      Technical Training Distinction
                    </div>
                    <h4 className="text-sm sm:text-base font-bold font-display text-white">
                      #1 Batch Topper · Orchard Training Program
                    </h4>
                    <p className="text-xs text-slate-300">
                      Full-Stack .NET & Cloud Microservices · LTM
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-right tabular-nums">
                  <span className="block text-sm font-mono font-bold text-amber-300">
                    94.67%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Aggregate
                  </span>
                </div>
              </div>

              {/* Degrees */}
              {EDUCATION_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-white font-display text-sm sm:text-base">
                      {item.degree}
                    </h4>
                    <p className="text-xs text-slate-300">
                      {item.institution}{" "}
                      <span className="text-slate-500">·</span>{" "}
                      <span className="font-mono text-slate-400 tabular-nums">
                        {item.duration}
                      </span>
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span className="font-mono text-cyan-300 text-xs font-bold tabular-nums">
                      {item.grade}
                    </span>
                    {item.documentUrl && (
                      <a
                        href={item.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-purple-300 hover:text-purple-200 hover:underline whitespace-nowrap"
                      >
                        <span>Transcript</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Verified Certifications (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 flex flex-col justify-between gap-5 shadow-lg">
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
                  <a
                    key={idx}
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start justify-between gap-3 p-4 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400/50 transition-all text-xs font-mono text-slate-200 hover:text-white group"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="block font-semibold text-slate-100 group-hover:text-cyan-200 transition-colors leading-snug">
                          {cert.name}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {cert.issuer}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
