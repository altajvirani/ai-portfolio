import React from 'react';
import { MARQUEE_ITEMS } from '../data/portfolioData.ts';
import { Sparkles } from 'lucide-react';

export const MarqueeBanner: React.FC = () => {
  // Duplicate array to ensure seamless infinite loop
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="w-full overflow-hidden border-y border-slate-800/80 bg-slate-900/40 backdrop-blur-sm py-3.5 relative select-none">
      {/* Left/Right Vignette gradients for smooth fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#0d131f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#0d131f] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee items-center gap-8">
        {items.map((item, idx) => {
          const dots = [
            'bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]',
            'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]',
            'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
          ];
          const dot = dots[idx % 3];
          return (
            <div key={idx} className="flex items-center gap-8 shrink-0">
              <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.2em] text-slate-300 hover:text-emerald-300 transition-colors uppercase flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                <span>{item}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
