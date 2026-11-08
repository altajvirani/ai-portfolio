import React from 'react';
import { BookOpen, ShieldCheck, ExternalLink, Github, FileText, Layers, Smartphone, Sparkles, Store } from 'lucide-react';
import { PERSONAL_PROJECTS } from '../data/portfolioData.ts';

export const ProjectsResearch: React.FC = () => {
  const getBadgeStyle = (accent?: string) => {
    switch (accent) {
      case 'emerald':
        return {
          badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
          dot: 'text-emerald-400',
          hoverBorder: 'hover:border-emerald-400/40',
          titleHover: 'group-hover:text-emerald-200',
          docBtn: 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-200',
        };
      case 'purple':
        return {
          badge: 'bg-purple-500/15 border-purple-500/30 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
          dot: 'text-purple-400',
          hoverBorder: 'hover:border-purple-400/40',
          titleHover: 'group-hover:text-purple-200',
          docBtn: 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/40 text-purple-200',
        };
      case 'sky':
        return {
          badge: 'bg-sky-500/15 border-sky-500/30 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.2)]',
          dot: 'text-sky-400',
          hoverBorder: 'hover:border-sky-400/40',
          titleHover: 'group-hover:text-sky-200',
          docBtn: 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-500/40 text-sky-200',
        };
      default:
        return {
          badge: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.2)]',
          dot: 'text-cyan-400',
          hoverBorder: 'hover:border-cyan-400/40',
          titleHover: 'group-hover:text-cyan-200',
          docBtn: 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-500/40 text-cyan-200',
        };
    }
  };

  return (
    <section id="projects" className="py-20 sm:py-24 border-b border-slate-800/80 relative bg-[#0d131f]">
      {/* Subtle ambient tricolor glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Research, Tooling & Intellectual Property</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              Featured Projects & Publications
            </h2>
          </div>
          <p className="text-sm text-slate-300 max-w-md">
            Peer-reviewed IEEE publication, Govt. of India approved copyright, official VS Code Marketplace extension, and open-source mobile platforms.
          </p>
        </div>

        {/* 4 Featured Projects Grid (2x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PERSONAL_PROJECTS.map((project) => {
            const style = getBadgeStyle(project.accentColor);
            return (
              <div
                key={project.id}
                className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 ${style.hoverBorder} transition-all duration-300 flex flex-col justify-between space-y-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] group`}
              >
                <div className="space-y-4">
                  {/* Header Badge */}
                  {project.publicationOrCopyright && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${style.badge}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{project.publicationOrCopyright}</span>
                    </div>
                  )}

                  <div>
                    <h3 className={`text-2xl sm:text-3xl font-bold font-display text-white ${style.titleHover} transition-colors`}>
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      {project.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                    <h4 className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Key Highlights</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {project.highlights.map((h, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 font-sans">
                          <span className={`${style.dot} mt-0.5 shrink-0`}>▸</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technologies & Links Footer */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-800/80 border border-slate-700 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {project.documentUrl && (
                      <a
                        href={project.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3.5 py-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${style.docBtn}`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Verified Document</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}

                    {project.marketplaceUrl && (
                      <a
                        href={project.marketplaceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 text-xs font-mono text-purple-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Store className="w-3.5 h-3.5 text-purple-400" />
                        <span>VS Code Marketplace</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
