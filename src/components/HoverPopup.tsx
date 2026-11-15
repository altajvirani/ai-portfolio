import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface HoverPopupProps {
  content: React.ReactNode;
  children: React.ReactNode;
  align?: "center" | "left" | "right";
  className?: string;
}

export const HoverPopup: React.FC<HoverPopupProps> = ({
  content,
  children,
  align = "center",
  className = "",
}) => {
  const [open, setOpen] = useState(false);

  const alignClasses =
    align === "left"
      ? "left-0"
      : align === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}

      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`hidden md:block pointer-events-none absolute bottom-full mb-2.5 z-50 w-64 p-3 rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/90 shadow-[0_12px_32px_rgba(0,0,0,0.65)] text-left ${alignClasses}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
