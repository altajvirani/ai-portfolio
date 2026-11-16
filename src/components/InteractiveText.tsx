import React, { useState } from "react";
import { motion } from "motion/react";

type HighlightTone = "amber" | "cobalt" | "mint" | "violet";

interface InteractiveEmphasisProps {
  children: React.ReactNode;
  tone?: HighlightTone;
  className?: string;
}

const HIGHLIGHT_STYLES: Record<HighlightTone, string> = {
  amber:
    "from-[#FEF3C7]/90 via-[#FDE68A]/75 to-[#FEF3C7]/90 decoration-[#F59E0B]",
  cobalt:
    "from-[#DBEAFE]/90 via-[#BFDBFE]/80 to-[#DBEAFE]/90 decoration-[#2563EB]",
  mint:
    "from-[#D1FAE5]/90 via-[#A7F3D0]/80 to-[#D1FAE5]/90 decoration-[#10B981]",
  violet:
    "from-[#EDE9FE]/90 via-[#DDD6FE]/80 to-[#EDE9FE]/90 decoration-[#7C3AED]",
};

/**
 * 60fps tactile cursor-responsive emphasis phrase with spring lift and
 * animated highlighter marker sweep on pointer hover.
 */
export const InteractiveEmphasis: React.FC<InteractiveEmphasisProps> = ({
  children,
  tone = "amber",
  className = "",
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{
        y: hovered ? -2 : 0,
        scale: hovered ? 1.025 : 1,
      }}
      transition={{ type: "spring", stiffness: 460, damping: 24 }}
      className={`relative isolate inline-block font-editorial italic font-semibold cursor-default px-1 rounded-md ${className}`}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          scaleX: hovered ? 1 : 0.94,
          scaleY: hovered ? 1.18 : 0.34,
          opacity: hovered ? 0.95 : 0.65,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 26 }}
        style={{ originY: 1, originX: 0 }}
        className={`absolute inset-x-0 bottom-0.5 h-[82%] rounded-md bg-gradient-to-r ${HIGHLIGHT_STYLES[tone]} -z-10 pointer-events-none`}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );
};

interface MagneticTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Cursor-reactive magnetic typography wrapper for titles and hero display text.
 */
export const MagneticTitle: React.FC<MagneticTextProps> = ({
  children,
  className = "",
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 6;
    const ny = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 4;
    setOffset({ x: nx, y: ny });
  };

  return (
    <motion.div
      onPointerMove={handleMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
