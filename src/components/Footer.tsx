import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#0d131f] pt-10 pb-24 sm:py-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <span className="text-sm font-extrabold font-display text-white tracking-tight">
            ALTAJ VIRANI
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            Azure AI Engineer · Agentic Platforms & Cloud Systems
          </p>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-xs text-slate-400 font-mono">
            © {new Date().getFullYear()} Altaj Virani. All rights reserved.
          </span>

          <button
            onClick={scrollToTop}
            className="p-2 text-xs font-mono text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};
