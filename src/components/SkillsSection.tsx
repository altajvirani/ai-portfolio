import React, { useState, useEffect } from "react";
import {
  Cpu,
  Network,
  ArrowRight,
  ShieldCheck,
  Cloud,
  Bot,
  Code2,
  Info,
  Link2,
  Check,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  TECH_NODES,
  SKILL_LAYERS,
  getDomainStyle,
  SkillDomainId,
} from "../data/skillsData.tsx";
import {
  filterSkillNodes,
  resolveActiveNodeForFilter,
} from "../utils/portfolioHelpers.ts";
import { HoverPopup } from "./HoverPopup.tsx";
import { InteractiveEmphasis, MagneticTitle } from "./InteractiveText.tsx";

interface SkillsSectionProps {
  selectedNodeId: string;
  onSelectNodeId: (id: string) => void;
  filterCategory: string;
  onFilterCategoryChange: (cat: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  selectedNodeId,
  onSelectNodeId,
  filterCategory,
  onFilterCategoryChange,
}) => {
  const effectiveSelectedId = resolveActiveNodeForFilter(
    TECH_NODES,
    selectedNodeId,
    filterCategory,
  );
  const selectedNode =
    TECH_NODES.find((n) => n.id === effectiveSelectedId) || TECH_NODES[0];

  const [mobileOpenLayer, setMobileOpenLayer] = useState<SkillDomainId>(
    selectedNode.category,
  );

  useEffect(() => {
    setMobileOpenLayer(selectedNode.category);
  }, [selectedNode.category, selectedNode.id]);

  const visibleNodes = filterSkillNodes(TECH_NODES, filterCategory);
  const visibleLayers =
    filterCategory === "all"
      ? SKILL_LAYERS
      : SKILL_LAYERS.filter((layer) => layer.id === filterCategory);

  const handleFilterClick = (catId: string) => {
    onFilterCategoryChange(catId);
    const nextNodeId = resolveActiveNodeForFilter(
      TECH_NODES,
      selectedNodeId,
      catId,
    );
    if (nextNodeId && nextNodeId !== selectedNodeId) {
      onSelectNodeId(nextNodeId);
    }
    if (catId !== "all") {
      setMobileOpenLayer(catId as SkillDomainId);
    }
  };

  const handleInspectConnection = (connId: string) => {
    const target = TECH_NODES.find((n) => n.id === connId);
    if (!target) return;
    if (filterCategory !== "all" && target.category !== filterCategory) {
      onFilterCategoryChange("all");
    }
    onSelectNodeId(connId);
  };

  const getLayerIcon = (id: SkillDomainId) => {
    switch (id) {
      case "agentic":
        return <Bot className="w-4 h-4 text-[#2563EB]" />;
      case "cloud":
        return <Cloud className="w-4 h-4 text-[#0284C7]" />;
      case "backend":
        return <Code2 className="w-4 h-4 text-[#059669]" />;
      case "security":
        return <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />;
    }
  };

  const renderNodeKeycap = (node: (typeof TECH_NODES)[number]) => {
    const isSelected = node.id === selectedNode.id;
    const isConnected =
      !isSelected && selectedNode.connections.includes(node.id);
    const style = getDomainStyle(node.category);

    const nodePopup = (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-2 border-b border-[#E5DFD5] pb-1">
          <span className="text-[11px] font-mono font-bold text-[#18181B] truncate">
            {node.shortName || node.name}
          </span>
          <span className="text-[10px] font-mono font-bold text-[#2563EB] shrink-0">
            {node.level}
          </span>
        </div>
        <p className="text-[11px] text-[#3F3F46] leading-snug font-sans">
          {node.role}
        </p>
        <div className="text-[10px] font-mono text-[#D97706] font-semibold flex items-center justify-between">
          <span>{node.connections.length} linked dependencies</span>
          <span className="text-[#2563EB]">Click to focus</span>
        </div>
      </div>
    );

    return (
      <HoverPopup key={node.id} content={nodePopup} align="left">
        <motion.button
          type="button"
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.96, y: 1 }}
          transition={{ type: "spring", stiffness: 460, damping: 24 }}
          data-skill-id={node.id}
          data-state={isSelected ? "selected" : isConnected ? "linked" : "idle"}
          aria-pressed={isSelected}
          onClick={() => onSelectNodeId(node.id)}
          className={`max-w-full px-3 py-2 rounded-xl text-xs font-mono text-left transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
            isSelected
              ? style.selectedBg
              : isConnected
                ? style.linkedBg
                : `${style.pillBg} opacity-88 hover:opacity-100`
          }`}
        >
          {isSelected ? (
            <span className="shrink-0 p-1 rounded-md bg-white/95 shadow-xs flex items-center justify-center">
              {node.logo}
            </span>
          ) : (
            <span className="shrink-0 flex items-center justify-center">
              {node.logo}
            </span>
          )}

          <span className="font-semibold leading-snug">{node.name}</span>

          {isSelected && (
            <span className="ml-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white text-[#18181B] text-[9px] font-bold uppercase tracking-wider shrink-0 shadow-xs">
              <Check className="w-2.5 h-2.5 stroke-[3] text-[#2563EB]" />
              Active
            </span>
          )}

          {isConnected && (
            <span className="ml-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#D97706] text-white text-[9px] font-bold uppercase tracking-wider shrink-0 shadow-xs">
              <Link2 className="w-2.5 h-2.5" />
              Linked
            </span>
          )}
        </motion.button>
      </HoverPopup>
    );
  };

  const selectedStyle = getDomainStyle(selectedNode.category);

  return (
    <section
      id="skills"
      className="scroll-mt-16 py-16 sm:py-24 border-b border-[#DFD9CE] relative bg-[#F7F4EE] paper-grain"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-7 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Technical Capabilities &amp; Relationships</span>
            </div>
            <MagneticTitle>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#18181B] tracking-tight">
                Skills &amp;{" "}
                <InteractiveEmphasis tone="cobalt" className="text-[#1D4ED8]">
                  Systems
                </InteractiveEmphasis>{" "}
                Ecosystem
              </h2>
            </MagneticTitle>
          </div>

          <p className="text-sm text-[#52525B] max-w-sm leading-relaxed">
            Filter by domain or select any skill to inspect its role and linked
            dependencies.
          </p>
        </div>

        {/* Working Domain Filter Bar with Spring Sliding Pill */}
        <div
          role="group"
          aria-label="Filter skills by domain"
          className="flex items-center gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible no-scrollbar"
        >
          <span className="text-xs font-mono font-bold text-[#52525B] mr-1 shrink-0">
            Filter:
          </span>
          {[
            { id: "all", label: `All (${TECH_NODES.length})`, btnClass: "skeuo-btn-dark" },
            { id: "agentic", label: "Agentic AI & LLMs", dot: "bg-[#2563EB]", btnClass: "skeuo-btn-cobalt" },
            { id: "cloud", label: "Cloud & Infrastructure", dot: "bg-[#0284C7]", btnClass: "skeuo-btn-cobalt" },
            { id: "backend", label: "Languages & Core", dot: "bg-[#059669]", btnClass: "skeuo-btn-mint" },
            { id: "security", label: "Security & Quality", dot: "bg-[#7C3AED]", btnClass: "skeuo-btn-violet" },
          ].map((cat) => {
            const isActive = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleFilterClick(cat.id)}
                className={`relative min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "text-white font-bold"
                    : "skeuo-btn-ivory text-[#3F3F46]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="skills-filter-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    className={`absolute inset-0 rounded-xl ${cat.btnClass} -z-0`}
                  />
                )}
                {cat.dot && (
                  <span
                    className={`relative z-10 w-2 h-2 rounded-full ${cat.dot} ${
                      isActive ? "ring-2 ring-white/50 bg-white" : ""
                    }`}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Node Canvas + Studio Spec Clipboard Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Interactive Systems Node Map (8 cols on lg, order-2 on mobile) */}
          <div className="order-2 lg:order-1 lg:col-span-8 p-4 sm:p-7 rounded-2xl paper-cutout bg-[#FFFFFF] space-y-5 sm:space-y-6">
            {/* Map Header with Clear Visual Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD5] pb-4">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-mono font-bold text-[#18181B] uppercase tracking-wider">
                  Interactive Stack ({visibleNodes.length} Shown)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#18181B]">
                  <span className="w-3 h-3 rounded bg-[#2563EB] border border-[#1D4ED8] shadow-xs" />
                  <span>Selected</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-[#92400E]">
                  <span className="w-3 h-3 rounded bg-[#FEF3C7] border-2 border-dashed border-[#D97706]" />
                  <span>Linked</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#52525B]">
                  <span className="w-3 h-3 rounded bg-white border border-[#D9D2C5]" />
                  <span>Other</span>
                </span>
              </div>
            </div>

            {/* Domain Layers: Collapsible trays on < lg, all open on lg+ */}
            <div className="space-y-4 sm:space-y-5">
              {visibleLayers.map((layer) => {
                const layerStyle = getDomainStyle(layer.id);
                const layerNodes = visibleNodes.filter(
                  (n) => n.category === layer.id,
                );
                const isMobileLayerOpen =
                  filterCategory !== "all" || mobileOpenLayer === layer.id;

                return (
                  <div
                    key={layer.id}
                    data-skill-layer={layer.id}
                    className={`p-3.5 sm:p-5 rounded-xl border space-y-3 transition-colors ${layerStyle.layerPanel}`}
                  >
                    {/* Layer Header */}
                    <button
                      type="button"
                      onClick={() => setMobileOpenLayer(layer.id)}
                      className="w-full lg:pointer-events-none flex items-center justify-between gap-2 text-xs font-mono text-left cursor-pointer lg:cursor-default"
                    >
                      <span
                        className={`${layerStyle.layerTitle} font-bold flex items-center gap-2 min-w-0 leading-snug`}
                      >
                        <span className="shrink-0">{getLayerIcon(layer.id)}</span>
                        <span>
                          {layer.layerNumber}. {layer.title}
                        </span>
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`hidden sm:inline text-[10px] px-2 py-0.5 rounded whitespace-nowrap ${layerStyle.layerTag}`}
                        >
                          {layer.shortTag}
                        </span>
                        <span
                          className={`lg:hidden text-[10px] px-2 py-0.5 rounded-full font-bold ${layerStyle.layerTag}`}
                        >
                          {layerNodes.length}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 lg:hidden transition-transform duration-200 text-[#52525B] ${
                            isMobileLayerOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>

                    {/* Desktop: Always rendered */}
                    <div className="hidden lg:flex flex-wrap gap-2.5 pt-1">
                      {layerNodes.map((node) => renderNodeKeycap(node))}
                    </div>

                    {/* Mobile (< lg): Collapsible tray */}
                    <AnimatePresence initial={false}>
                      {isMobileLayerOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="lg:hidden overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-2 pt-1.5">
                            {layerNodes.map((node) => renderNodeKeycap(node))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (Top on Mobile): Studio Spec Clipboard Inspector */}
          <aside
            id="skill-inspector"
            className="order-1 lg:order-2 lg:col-span-4 p-5 sm:p-6 pt-7 rounded-2xl paper-cutout paper-lined-amber space-y-4 sm:space-y-5 lg:sticky lg:top-24 relative overflow-visible"
          >
            {/* Tactile Kraft Binder Clip Cutout at Top of Clipboard */}
            <div
              aria-hidden="true"
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-md paper-kraft border border-[#B8945D] shadow-sm flex items-center justify-center"
            >
              <span className="w-10 h-1.5 rounded-full bg-[#78350F]/30" />
            </div>

            <div className="flex items-center justify-between border-b border-[#E5DFD5] pb-3">
              <span className="text-xs font-mono text-[#B45309] font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Skill Inspector</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-md border text-[11px] font-mono font-bold ${selectedStyle.badge}`}
              >
                {selectedNode.level}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-white paper-cutout-sm shrink-0">
                    {selectedNode.logo}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold font-display text-[#18181B] leading-snug">
                      {selectedNode.name}
                    </h3>
                    <p className="text-xs font-mono text-[#52525B]">
                      {selectedNode.categoryLabel}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#2563EB] block font-bold">
                    Role
                  </span>
                  <p className="text-xs sm:text-sm text-[#27272A] leading-relaxed font-sans font-medium">
                    {selectedNode.role}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/92 border border-[#E5DFD5] shadow-xs space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#52525B] block font-bold">
                    Applied Impact
                  </span>
                  <p className="text-xs text-[#27272A] leading-relaxed font-sans">
                    {selectedNode.projectContext}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Linked Dependencies */}
            <div className="pt-3 space-y-2 border-t border-[#E5DFD5]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#B45309] flex items-center gap-1.5 font-bold">
                <Link2 className="w-3.5 h-3.5" />
                <span>Linked Technologies</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-1.5">
                {selectedNode.connections.map((connId) => {
                  const connNode = TECH_NODES.find((n) => n.id === connId);
                  if (!connNode) return null;
                  return (
                    <motion.button
                      key={connId}
                      type="button"
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleInspectConnection(connId)}
                      className="w-full min-h-[38px] p-2.5 rounded-xl skeuo-btn-amber border border-dashed text-left transition-all flex items-center justify-between text-xs font-mono font-semibold text-[#78350F] cursor-pointer group"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0">{connNode.logo}</span>
                        <span className="truncate">{connNode.name}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B45309] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
