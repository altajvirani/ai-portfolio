import React from "react";
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
} from "lucide-react";
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
        return <Bot className="w-4 h-4 text-cyan-400" />;
      case "cloud":
        return <Cloud className="w-4 h-4 text-sky-400" />;
      case "backend":
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case "security":
        return <ShieldCheck className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <section
      id="skills"
      className="scroll-mt-16 py-20 sm:py-24 border-b border-slate-800/80 relative bg-[#0d131f]"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* Section Header (No view switcher, generalized framing) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Technical Capabilities & Relationships</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              Skills & Systems Ecosystem
            </h2>
          </div>

          <p className="text-sm text-slate-300 max-w-sm">
            Filter by domain or select any skill to inspect its role and linked
            dependencies.
          </p>
        </div>

        {/* Working Domain Filter Bar */}
        <div
          role="group"
          aria-label="Filter skills by domain"
          className="flex flex-wrap items-center gap-2"
        >
          <span className="text-xs font-mono text-slate-400 mr-1">
            Filter:
          </span>
          {[
            { id: "all", label: `All (${TECH_NODES.length})` },
            { id: "agentic", label: "Agentic AI & LLMs", dot: "bg-cyan-400" },
            { id: "cloud", label: "Cloud & Infrastructure", dot: "bg-sky-400" },
            {
              id: "backend",
              label: "Languages & Core",
              dot: "bg-emerald-400",
            },
            {
              id: "security",
              label: "Security & Quality",
              dot: "bg-purple-400",
            },
          ].map((cat) => {
            const isActive = filterCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleFilterClick(cat.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 border ${
                  isActive
                    ? "bg-white text-slate-950 border-white font-bold shadow-[0_0_16px_rgba(255,255,255,0.2)]"
                    : "bg-slate-900/70 border-slate-800 text-slate-300 hover:text-white hover:border-slate-600"
                }`}
              >
                {cat.dot && (
                  <span
                    className={`w-2 h-2 rounded-full ${cat.dot} ${isActive ? "ring-1 ring-slate-900" : ""}`}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Node Canvas + Node Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Systems Node Map (8 cols) */}
          <div className="lg:col-span-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-6">
            {/* Map Header with Clear Visual Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Interactive Stack ({visibleNodes.length} Shown)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
                <span className="inline-flex items-center gap-1.5 text-white">
                  <span className="w-3 h-3 rounded bg-slate-800 border-2 border-white ring-1 ring-cyan-400" />
                  <span>Selected</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-200">
                  <span className="w-3 h-3 rounded bg-amber-500/20 border-2 border-dashed border-amber-400" />
                  <span>Linked</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-400">
                  <span className="w-3 h-3 rounded bg-slate-900 border border-slate-700" />
                  <span>Other</span>
                </span>
              </div>
            </div>

            {/* Filtered Domain Layers */}
            <div className="space-y-5">
              {visibleLayers.map((layer) => {
                const layerStyle = getDomainStyle(layer.id);
                const layerNodes = visibleNodes.filter(
                  (n) => n.category === layer.id,
                );

                return (
                  <div
                    key={layer.id}
                    data-skill-layer={layer.id}
                    className={`p-4 sm:p-5 rounded-xl border space-y-3.5 transition-all ${layerStyle.layerPanel}`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span
                        className={`${layerStyle.layerTitle} font-bold flex items-center gap-2`}
                      >
                        {getLayerIcon(layer.id)}
                        <span>
                          {layer.layerNumber}. {layer.title}
                        </span>
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${layerStyle.layerTag}`}
                      >
                        {layer.shortTag}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {layerNodes.map((node) => {
                        const isSelected = node.id === selectedNode.id;
                        const isConnected =
                          !isSelected &&
                          selectedNode.connections.includes(node.id);
                        const style = getDomainStyle(node.category);

                        return (
                          <button
                            key={node.id}
                            type="button"
                            data-skill-id={node.id}
                            data-state={
                              isSelected
                                ? "selected"
                                : isConnected
                                  ? "linked"
                                  : "idle"
                            }
                            aria-pressed={isSelected}
                            onClick={() => onSelectNodeId(node.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-mono text-left transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                              isSelected
                                ? style.selectedBg
                                : isConnected
                                  ? style.linkedBg
                                  : `${style.pillBg} opacity-60 hover:opacity-100`
                            }`}
                          >
                            <span className="shrink-0">{node.logo}</span>
                            <span className="font-semibold">{node.name}</span>

                            {isSelected && (
                              <span className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-slate-950 text-[9px] font-bold uppercase tracking-wider">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                                Active
                              </span>
                            )}

                            {isConnected && (
                              <span className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-400/50 text-amber-200 text-[9px] font-semibold uppercase tracking-wider">
                                <Link2 className="w-2.5 h-2.5" />
                                Linked
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Concise Node Inspector (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-5 shadow-xl lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Skill Inspector</span>
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                {selectedNode.level}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 shadow-sm shrink-0">
                  {selectedNode.logo}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display text-white leading-snug">
                    {selectedNode.name}
                  </h3>
                  <p className="text-xs font-mono text-slate-400">
                    {selectedNode.categoryLabel}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block font-semibold">
                  Role
                </span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                  {selectedNode.role}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                  Applied Impact
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedNode.projectContext}
                </p>
              </div>
            </div>

            {/* Linked Dependencies */}
            <div className="pt-3 space-y-2.5 border-t border-slate-800">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5 font-semibold">
                <Link2 className="w-3.5 h-3.5" />
                <span>Linked Technologies</span>
              </span>
              <div className="space-y-1.5">
                {selectedNode.connections.map((connId) => {
                  const connNode = TECH_NODES.find((n) => n.id === connId);
                  if (!connNode) return null;
                  return (
                    <button
                      key={connId}
                      type="button"
                      onClick={() => handleInspectConnection(connId)}
                      className="w-full p-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-dashed border-amber-400/50 hover:border-amber-300 text-left transition-all flex items-center justify-between text-xs font-mono text-amber-100 hover:text-white cursor-pointer group"
                    >
                      <span className="flex items-center gap-2">
                        <span className="shrink-0">{connNode.logo}</span>
                        <span>{connNode.name}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
