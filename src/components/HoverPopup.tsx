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
      className={`relative inline-flex ${open ? "z-50" : ""} ${className}`}
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
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 460, damping: 28 }}
            className={`hidden md:block pointer-events-none absolute bottom-full mb-2.5 z-50 w-64 p-3 rounded-xl skeuo-glass shadow-xl text-left ${alignClasses}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
