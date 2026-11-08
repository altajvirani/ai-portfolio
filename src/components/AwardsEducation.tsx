import React from 'react';
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
  Calendar
} from 'lucide-react';
import { AWARDS_DATA, EDUCATION_ITEMS, CERTIFICATION_ITEMS } from '../data/portfolioData.ts';

export const AwardsEducation: React.FC = () => {
  const getAwardStyles = (accent: 'emerald' | 'purple' | 'cyan') => {
    switch (accent) {
      case 'emerald':
        return {
          glow: 'from-emerald-500/15 to-transparent',
          border: 'border-slate-800 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
          badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          iconBox: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
          button: 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-200 hover:border-emerald-400',
          titleHover: 'group-hover:text-emerald-200',
          dot: 'bg-emerald-400',
          cornerBorder: 'border-emerald-400/60',
        };
      case 'purple':
        return {
          glow: 'from-purple-500/15 to-transparent',
          border: 'border-slate-800 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
          badge: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
          iconBox: 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
          button: 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/40 text-purple-200 hover:border-purple-400',
          titleHover: 'group-hover:text-purple-200',
          dot: 'bg-purple-400',
          cornerBorder: 'border-purple-400/60',
        };
      case 'cyan':
      default:
        return {
          glow: 'from-cyan-500/15 to-transparent',
          border: 'border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]',
          badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
          iconBox: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.3)]',
          button: 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/40 text-cyan-200 hover:border-cyan-400',
          titleHover: 'group-hover:text-cyan-200',
          dot: 'bg-cyan-400',
          cornerBorder: 'border-cyan-400/60',
        };
    }
  };

  const getAwardIcon = (id: string) => {
    switch (id) {
      case 'spot-nov-2025':
        return <Trophy className="w-5 h-5 text-emerald-300" />;
      case 'spot-aug-2025':
        return <Sparkles className="w-5 h-5 text-purple-300" />;
      case 'spot-jul-2025':
      default:
        return <Zap className="w-5 h-5 text-cyan-300" />;
    }
  };

  return (
    <section id="honors" className="py-20 sm:py-24 border-b border-slate-800/80 relative bg-[#0d131f] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 space-y-16 relative z-10">
        
        {/* ============================================================== */}
        {/* SUBSECTION 1: CORPORATE HONORS & SPOT AWARDS                    */}
        {/* ============================================================== */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-400" />
                <span>Accolades & Spot Recognitions · Microsoft Business Unit</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
                Honors & Corporate Awards
              </h2>
            </div>
            <p className="text-sm text-slate-300 max-w-md font-sans">
              Verified corporate spot recognitions awarded within Microsoft Business Unit (LTM) for breakthrough AI innovations, enterprise GenAI systems, and developer automation tooling.
            </p>
          </div>

          {/* 3-Column Standout Award Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {AWARDS_DATA.map((award) => {
              const styles = getAwardStyles(award.accentColor);
              return (
                <div
                  key={award.id}
                  className={`relative p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950 border ${styles.border} transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl group`}
                >
                  {/* Subtle top corner cyber accents */}
                  <div className={`absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 ${styles.cornerBorder} pointer-events-none`} />
                  <div className={`absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 ${styles.cornerBorder} pointer-events-none`} />

                  <div className="space-y-5">
                    {/* Header: Insignia + Date */}
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${styles.iconBox}`}>
                        {getAwardIcon(award.id)}
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-700/80 text-[11px] font-mono text-slate-300">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{award.date}</span>
                      </div>
                    </div>

                    {/* Category Chip */}
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border ${styles.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} animate-pulse`} />
                      <span>{award.category}</span>
                    </div>

                    {/* Title & Organization */}
                    <div>
                      <h3 className={`text-2xl font-bold font-display text-white ${styles.titleHover} transition-colors tracking-tight`}>
                        {award.title}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{award.organization}</span>
                      </p>
                    </div>

                    {/* Reason / Citation */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {award.reason}
                    </p>

                    {/* Impact Tag */}
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-[11.5px] font-mono text-slate-200 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{award.impactHighlight}</span>
                    </div>
                  </div>

                  {/* Verified Document CTA Button */}
                  {award.documentUrl && (
                    <div className="pt-4 border-t border-slate-800">
                      <a
                        href={award.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2.5 px-4 rounded-xl border text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${styles.button}`}
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span>View Award Certificate</span>
                        <ExternalLink className="w-3 h-3 ml-0.5 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* SUBSECTION 2: ACADEMIC CREDENTIALS & CERTIFICATIONS             */}
        {/* ============================================================== */}
        <div className="pt-10 border-t border-slate-800/80 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-purple-400" />
                <span>Academic Pedigree & Professional Validation</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
                Academic History & Certifications
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md font-sans">
              Direct verification links to official academic degree transcripts, polytechnic diplomas, and industry cloud certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Academic Credentials & Batch Topper Honor (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* #1 Batch Topper Honor Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/30 flex items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0">
                    <Medal className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                      Academic Trainee Distinction
                    </div>
                    <h4 className="text-sm sm:text-base font-bold font-display text-white">
                      #1 Batch Topper · Orchard Engineering Program
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Microsoft Business Unit (MSBU) · Full-Stack .NET & Cloud Microservices
                    </p>
                  </div>
                </div>
                <div className="shrink-0 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-center">
                  <span className="block text-xs font-mono font-bold text-amber-300">94.67%</span>
                  <span className="text-[10px] font-mono text-amber-200/80 uppercase">Aggregate</span>
                </div>
              </div>

              {/* Degrees List */}
              <div className="space-y-3.5">
                {EDUCATION_ITEMS.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-purple-500/40 transition-all space-y-3 shadow-md group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-bold text-white font-display text-sm sm:text-base group-hover:text-purple-300 transition-colors">
                        {item.degree}
                      </h4>
                      <span className="self-start sm:self-auto font-mono text-cyan-300 text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30">
                        {item.grade}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {item.institution} · <span className="font-mono text-slate-400">{item.duration}</span>
                    </p>

                    {item.documentUrl && (
                      <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                        <a
                          href={item.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-300 hover:text-purple-200 hover:underline cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Official Certificate Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Professional Certifications & Standards (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-5 shadow-xl">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                      Industry Certifications
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30">
                    Verified
                  </span>
                </div>

                <div className="space-y-3">
                  {CERTIFICATION_ITEMS.map((cert, idx) => (
                    <a
                      key={idx}
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-400/50 transition-all text-xs font-mono text-slate-200 hover:text-white group cursor-pointer shadow-sm"
                    >
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div>
                          <span className="block font-medium text-slate-200 group-hover:text-cyan-200 transition-colors leading-snug">
                            {cert.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            Issued by {cert.issuer}
                          </span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>

                {/* Credential Verification Seal Box */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                    <span>Verifiable Credentials Guarantee</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    All corporate spot awards, intellectual property registrations, and academic degrees link directly to official Google Drive certificates and Microsoft Learn credentials.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
