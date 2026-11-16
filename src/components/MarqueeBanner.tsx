import React from "react";
import { MARQUEE_ITEMS } from "../data/portfolioData.ts";

export const MarqueeBanner: React.FC = () => {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="w-full overflow-hidden border-y border-[#DFD9CE] bg-[#EDE8DF] py-3 relative select-none shadow-[inset_0_2px_4px_rgba(24,24,27,0.04)]">
      {/* Left/Right Fade Vignettes */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#EDE8DF] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#EDE8DF] to-transparent z-10 pointer-events-none" />

      <div className="flex w-max animate-marquee items-center gap-8">
        {items.map((item, idx) => {
          const dots = ["bg-[#2563EB]", "bg-[#16A34A]", "bg-[#EA580C]"];
          const dot = dots[idx % 3];
          return (
            <div key={idx} className="flex items-center gap-8 shrink-0">
              <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.18em] text-[#3F3F46] uppercase flex items-center gap-2">
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
