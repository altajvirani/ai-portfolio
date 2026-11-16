import React from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { TechNode, getDomainStyle } from "../data/skillsData.tsx";
import { HoverPopup } from "./HoverPopup.tsx";

interface SkillChipProps {
  node: TechNode;
  onSelect: (skillId: string) => void;
  stopPropagation?: boolean;
  compact?: boolean;
  alignPopup?: "center" | "left" | "right";
}

export const SkillChip: React.FC<SkillChipProps> = ({
  node,
  onSelect,
  stopPropagation = false,
  compact = false,
  alignPopup = "left",
}) => {
  const style = getDomainStyle(node.category);

  const popupContent = (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 border-b border-[#E5DFD5] pb-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#18181B] truncate">
          <span className="shrink-0">{node.logo}</span>
          <span className="truncate">{node.shortName || node.name}</span>
        </span>
        <span className="text-[10px] font-mono font-semibold text-[#2563EB] shrink-0">
          {node.level}
        </span>
      </div>
      <p className="text-[11px] text-[#3F3F46] leading-snug font-sans">
        {node.role}
      </p>
      <div className="text-[10px] font-mono text-[#71717A] flex items-center justify-between pt-0.5">
        <span>{node.categoryLabel}</span>
        <span className="text-[#2563EB] font-semibold">Inspect ↗</span>
      </div>
    </div>
  );

  return (
    <HoverPopup content={popupContent} align={alignPopup}>
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97, y: 1 }}
        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => {
          if (stopPropagation) e.stopPropagation();
          onSelect(node.id);
        }}
        data-linked-skill-chip={node.id}
        title={`Inspect ${node.name} in Skills section`}
        className={`${
          compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs"
        } rounded-xl font-mono text-left transition-colors flex items-center gap-2 cursor-pointer border group ${style.pillBg}`}
      >
        <span className="shrink-0">{node.logo}</span>
        <span className="font-semibold leading-snug">{node.name}</span>
        <ArrowUpRight className="w-3 h-3 shrink-0 opacity-55 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </motion.button>
    </HoverPopup>
  );
};
