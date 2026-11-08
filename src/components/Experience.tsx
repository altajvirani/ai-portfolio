import React, { useState } from 'react';
import { Briefcase, Calendar, Building } from 'lucide-react';
import { WORK_EXPERIENCE } from '../data/portfolioData.ts';

export const Experience: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(WORK_EXPERIENCE[0].id);

  const selectedProject = WORK_EXPERIENCE.find((p) => p.id === selectedProjectId) || WORK_EXPERIENCE[0];

  return (
    <section id="experience" className="py-20 border-b border-slate-800/80 relative bg-[#0d131f]">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
              <span>Work Experience · LTM (Microsoft Business Unit)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
              Engineering History
            </h2>
          </div>
          <p className="text-sm text-slate-300 max-w-sm">
            Three distinct engineering tracks delivered across Microsoft Business Unit engagements.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-700/80 rounded-xl overflow-x-auto shadow-inner">
          {WORK_EXPERIENCE.map((project) => {
            const isSelected = project.id === selectedProjectId;
            return (
              <button
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-400/60 text-white font-bold shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                }`}
              >
                <span>{project.projectName}</span>
                <span className="text-[10px] text-slate-400">({project.period.split(' – ')[0]})</span>
              </button>
            );
          })}
        </div>

        {/* Project Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 hover:border-cyan-500/30 transition-all space-y-6 shadow-xl">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                <Building className="w-3.5 h-3.5" />
                <span>{selectedProject.businessUnit}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">{selectedProject.role}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                {selectedProject.projectName}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 self-start sm:self-auto">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedProject.period}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-200 leading-relaxed font-sans">
            {selectedProject.description}
          </p>

          {/* Key Contributions: Concise & Sharp */}
          <div className="space-y-4 pt-1">
            {selectedProject.keyContributions.map((contrib, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5">
                <h4 className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">
                  {contrib.area}
                </h4>
                <ul className="space-y-2">
                  {contrib.points.map((pt, j) => (
                    <li key={j} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2.5 leading-relaxed font-sans">
                      <span className="text-cyan-400 font-mono mt-0.5 shrink-0">▸</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-2">Technologies:</span>
            {selectedProject.technologies.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-[11px] font-mono text-slate-300 bg-slate-800/80 border border-slate-700 rounded-md"
              >
                {t}
              </span>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
