import React from "react";
import { ArrowDown, Mail } from "lucide-react";

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative py-16 sm:py-20 md:py-28 border-b border-slate-800/80 overflow-hidden bg-[#0d131f]"
    >
      {/* Background radial gradients for ambient depth with neon green integration */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-emerald-500/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500/12 rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-14">
          {/* Left Column: Bold Liquid Chrome Typography & Actions */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            {/* Role Tag Pill with neon green pulse */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-400/35 text-xs font-mono text-slate-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-cyan-300 font-semibold">
                Azure AI Engineer
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">
                Agentic AI Platform & Solutions
              </span>
            </div>

            {/* Headline with Liquid Chrome Gradient */}
            <div className="space-y-3">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight leading-[1.08] text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-slate-200 drop-shadow-[0_2px_24px_rgba(56,189,248,0.25)]">
                Altaj Virani
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold font-display tracking-tight bg-gradient-to-r from-cyan-300 via-emerald-300 to-purple-300 bg-clip-text text-transparent">
                Building Intelligent Platforms & Scalable Cloud Systems
              </p>
            </div>

            {/* Concise Pitch - Secondary color in clear slate-300 */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto md:mx-0 font-sans">
              Software Engineer specializing in enterprise agentic platforms,
              cloud reliability, and high-scale distributed systems. Focused on
              practical LLM integration, runtime stability, and automated
              engineering workflows.
            </p>

            {/* Simple Primary Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <button
                onClick={() => scrollTo("experience")}
                className="px-6 py-3 text-xs font-mono font-semibold text-slate-950 bg-gradient-to-r from-white via-emerald-50 to-cyan-50 hover:opacity-95 rounded-xl transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Experience</span>
                <ArrowDown className="w-3.5 h-3.5 text-slate-950" />
              </button>

              <button
                onClick={() => scrollTo("contact")}
                className="px-6 py-3 text-xs font-mono font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400/50 rounded-xl transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Get in Touch</span>
              </button>
            </div>
          </div>

          {/* Right Column: Creative Cropped Headshot with Light Open to Work Chip */}
          <div className="shrink-0 relative group">
            {/* Outer ambient specular glow with tricolor gradients */}
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-cyan-500/25 via-emerald-500/25 to-purple-500/25 blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Creative Container Card */}
            <div className="relative w-72 h-84 sm:w-80 sm:h-96 lg:w-[330px] lg:h-[396px] rounded-2xl p-1.5 bg-gradient-to-b from-white/30 via-emerald-500/20 to-slate-800 border border-slate-700/80 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              {/* Image Frame with calibrated top crop */}
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 relative">
                {/* Refined, smaller attractive 'Open to work' Chip element with active radar pulse */}
                <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-emerald-400 shadow-[0_2px_12px_rgba(16,185,129,0.35)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                  </span>
                  <span className="text-[10.5px] font-mono font-bold text-slate-900 tracking-tight leading-none">
                    Open to work
                  </span>
                </div>

                <img
                  src="/assets/1000181295-clean_34605519.png"
                  alt="Altaj Virani Headshot"
                  className="w-full h-full object-cover object-[center_12%] scale-130 transition-transform duration-700 group-hover:scale-135"
                  loading="eager"
                />

                {/* Cybernetic Corner Accents */}
                <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400/80 pointer-events-none" />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400/80 pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400/80 pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400/80 pointer-events-none" />

                {/* Creative Left & Right HUD bottom labels */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent pt-8 pb-2.5 px-2 sm:px-2.5">
                  <div className="flex items-center justify-between gap-3 p-1.5 px-2 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-lg">
                    {/* Left: Role */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                      <span className="text-[10.5px] font-mono font-bold text-white tracking-tight whitespace-nowrap">
                        LTM (MSFT BU) · Mumbai
                      </span>
                    </div>

                    {/* Right: Location & Business Unit */}
                    <div className="flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-[9.5px] font-mono text-emerald-300 font-semibold whitespace-nowrap">
                      <span>2.5+ YOE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
