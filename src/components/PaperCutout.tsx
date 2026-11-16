import React from "react";
import { motion } from "motion/react";

type CutoutTone = "amber" | "cobalt" | "mint" | "kraft" | "violet";

interface PaperCutoutProps {
  children: React.ReactNode;
  tone?: CutoutTone;
  tape?: "amber" | "blue" | "mint" | "none";
  rotate?: number;
  draggable?: boolean;
  onClick?: () => void;
  className?: string;
}

const TONE_CLASSES: Record<CutoutTone, string> = {
  amber:
    "bg-gradient-to-br from-[#FFFDF2] to-[#FEF3C7] text-[#78350F]",
  cobalt:
    "bg-gradient-to-br from-[#F8FAFF] to-[#DBEAFE] text-[#1E3A8A]",
  mint:
    "bg-gradient-to-br from-[#F4FDF8] to-[#D1FAE5] text-[#064E3B]",
  kraft:
    "paper-kraft text-[#5C3A1B]",
  violet:
    "bg-gradient-to-br from-[#FAF7FF] to-[#EDE9FE] text-[#4C1D95]",
};

const TAPE_CLASSES: Record<"amber" | "blue" | "mint", string> = {
  amber: "washi-tape-amber",
  blue: "washi-tape-blue",
  mint: "washi-tape-mint",
};

/**
 * Interactive die-cut paper cutout sticker / note card with crisp white
 * cut rim, optional translucent masking tape, and tactile spring physics.
 */
export const PaperCutout: React.FC<PaperCutoutProps> = ({
  children,
  tone = "amber",
  tape = "amber",
  rotate = -2,
  draggable = true,
  onClick,
  className = "",
}) => {
  return (
    <motion.div
      drag={draggable}
      dragSnapToOrigin
      dragElastic={0.28}
      initial={{ rotate }}
      whileHover={{ scale: 1.05, rotate: 0, y: -3 }}
      whileTap={{ scale: 0.96 }}
      whileDrag={{ scale: 1.08, rotate: 0, zIndex: 40 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
      onClick={onClick}
      className={`relative select-none rounded-2xl paper-cutout px-3.5 py-2.5 ${TONE_CLASSES[tone]} ${
        draggable ? "cursor-grab active:cursor-grabbing" : onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {tape !== "none" && (
        <span
          aria-hidden="true"
          className={`absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 rounded-[2px] -rotate-2 pointer-events-none ${TAPE_CLASSES[tape]}`}
        />
      )}
      {children}
    </motion.div>
  );
};
