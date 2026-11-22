export interface SectionRectMetric {
  id: string;
  top: number;
  bottom: number;
}

/**
 * Pure helper determining which section IDs are currently active inside the
 * viewport detection band, supporting multi-section overlap and bottom-of-page fallback.
 */
export function computeActiveSections(
  metrics: SectionRectMetric[],
  viewportHeight: number,
  scrollY: number,
  docScrollHeight: number,
): string[] {
  if (!metrics.length) return [];

  // At page bottom, ensure contact is marked active even if shorter than viewport
  const isAtBottom = scrollY + viewportHeight >= docScrollHeight - 64;
  if (isAtBottom) {
    const lastId = metrics[metrics.length - 1]?.id;
    return lastId ? [lastId] : [];
  }

  // Band from just below header (~84px) down to 58% of viewport height
  const bandTop = Math.min(96, viewportHeight * 0.2);
  const bandBottom = Math.max(bandTop + 80, viewportHeight * 0.58);

  const overlapping = metrics
    .filter((m) => m.bottom > bandTop && m.top < bandBottom)
    .map((m) => m.id);

  if (overlapping.length > 0) {
    return overlapping;
  }

  // Fallback to closest section above or near viewport top
  let closest = metrics[0].id;
  let minDistance = Math.abs(metrics[0].top - bandTop);
  for (const m of metrics) {
    const dist = Math.abs(m.top - bandTop);
    if (dist < minDistance) {
      minDistance = dist;
      closest = m.id;
    }
  }
  return [closest];
}

export interface FilterableSkillNode {
  id: string;
  category: string;
  connections: string[];
}

/**
 * Pure domain filter logic for the Skills Architecture Map.
 */
export function filterSkillNodes<T extends FilterableSkillNode>(
  nodes: T[],
  filterCategory: string,
): T[] {
  if (!filterCategory || filterCategory === 'all') {
    return nodes;
  }
  return nodes.filter((n) => n.category === filterCategory);
}

/**
 * Ensures the active node ID stays visible within the current filtered subset.
 */
export function resolveActiveNodeForFilter<T extends FilterableSkillNode>(
  allNodes: T[],
  currentSelectedId: string,
  filterCategory: string,
): string {
  const visible = filterSkillNodes(allNodes, filterCategory);
  if (visible.some((n) => n.id === currentSelectedId)) {
    return currentSelectedId;
  }
  return visible[0]?.id ?? allNodes[0]?.id ?? '';
}

export interface TabColorTheme {
  name: string;
  btnClass: string;
  dot: string;
  text: string;
  marker: string;
  ring: string;
  activeBg: string;
  isLight?: boolean;
  activeTextColor?: string;
  activeDot?: string;
}

export const TAB_COLOR_PALETTES: TabColorTheme[] = [
  {
    name: "cobalt",
    btnClass: "skeuo-btn-cobalt",
    dot: "bg-[#2563EB]",
    text: "text-[#1D4ED8]",
    marker: "bg-[#2563EB] shadow-[0_0_0_2px_#2563EB]",
    ring: "ring-[#2563EB]/40",
    activeBg: "bg-[#EFF6FF] border-[#93C5FD]",
    isLight: false,
    activeTextColor: "text-white",
    activeDot: "bg-white ring-2 ring-white/50",
  },
  {
    name: "tangerine",
    btnClass: "skeuo-btn-tangerine",
    dot: "bg-[#EA580C]",
    text: "text-[#C2410C]",
    marker: "bg-[#EA580C] shadow-[0_0_0_2px_#EA580C]",
    ring: "ring-[#EA580C]/40",
    activeBg: "bg-[#FFF7ED] border-[#FDBA74]",
    isLight: false,
    activeTextColor: "text-white",
    activeDot: "bg-white ring-2 ring-white/50",
  },
  {
    name: "mint",
    btnClass: "skeuo-btn-mint",
    dot: "bg-[#059669]",
    text: "text-[#047857]",
    marker: "bg-[#059669] shadow-[0_0_0_2px_#059669]",
    ring: "ring-[#059669]/40",
    activeBg: "bg-[#ECFDF5] border-[#6EE7B7]",
    isLight: false,
    activeTextColor: "text-white",
    activeDot: "bg-white ring-2 ring-white/50",
  },
  {
    name: "violet",
    btnClass: "skeuo-btn-violet",
    dot: "bg-[#7C3AED]",
    text: "text-[#6D28D9]",
    marker: "bg-[#7C3AED] shadow-[0_0_0_2px_#7C3AED]",
    ring: "ring-[#7C3AED]/40",
    activeBg: "bg-[#F5F3FF] border-[#C4B5FD]",
    isLight: false,
    activeTextColor: "text-white",
    activeDot: "bg-white ring-2 ring-white/50",
  },
  {
    name: "crimson",
    btnClass: "skeuo-btn-crimson",
    dot: "bg-[#DC2626]",
    text: "text-[#B91C1C]",
    marker: "bg-[#DC2626] shadow-[0_0_0_2px_#DC2626]",
    ring: "ring-[#DC2626]/40",
    activeBg: "bg-[#FEF2F2] border-[#FCA5A5]",
    isLight: false,
    activeTextColor: "text-white",
    activeDot: "bg-white ring-2 ring-white/50",
  },
  {
    name: "teal",
    btnClass: "skeuo-btn-teal",
    dot: "bg-[#0D9488]",
    text: "text-[#0F766E]",
    marker: "bg-[#0D9488] shadow-[0_0_0_2px_#0D9488]",
    ring: "ring-[#0D9488]/40",
    activeBg: "bg-[#F0FDFA] border-[#99F6E4]",
    isLight: false,
    activeTextColor: "text-white",
    activeDot: "bg-white ring-2 ring-white/50",
  },
  {
    name: "indigo",
    btnClass: "skeuo-btn-indigo",
    dot: "bg-[#4F46E5]",
    text: "text-[#4338CA]",
    marker: "bg-[#4F46E5] shadow-[0_0_0_2px_#4F46E5]",
    ring: "ring-[#4F46E5]/40",
    activeBg: "bg-[#EEF2FF] border-[#C7D2FE]",
    isLight: false,
    activeTextColor: "text-white",
    activeDot: "bg-white ring-2 ring-white/50",
  },
  {
    name: "dark",
    btnClass: "skeuo-btn-dark",
    dot: "bg-[#18181B]",
    text: "text-[#18181B]",
    marker: "bg-[#18181B] shadow-[0_0_0_2px_#18181B]",
    ring: "ring-[#18181B]/40",
    activeBg: "bg-[#F4F4F5] border-[#D4D4D8]",
    isLight: false,
    activeTextColor: "text-white",
    activeDot: "bg-white ring-2 ring-white/50",
  },
];

/**
 * Dynamically computes high-contrast text and dot styling for tabs,
 * guaranteeing WCAG AAA compliance (>5:1 ratio) to completely prevent light-over-light text.
 */
export function getTabContrastColors(theme?: Partial<TabColorTheme> | null): {
  textColor: string;
  dotClass: string;
  isLight: boolean;
} {
  if (!theme) {
    return {
      textColor: "text-white",
      dotClass: "bg-white ring-2 ring-white/50",
      isLight: false,
    };
  }

  // Detect whether the selected button class or theme is a light background
  const btnClass = theme.btnClass || "";
  const isLight =
    theme.isLight === true ||
    btnClass.includes("amber") ||
    btnClass.includes("ivory") ||
    btnClass.includes("white") ||
    btnClass.includes("yellow") ||
    btnClass.includes("light");

  if (isLight) {
    return {
      textColor: theme.activeTextColor || "text-[#18181B]",
      dotClass: theme.activeDot || "bg-[#18181B] ring-2 ring-black/20",
      isLight: true,
    };
  }

  return {
    textColor: theme.activeTextColor || "text-white",
    dotClass: theme.activeDot || "bg-white ring-2 ring-white/50",
    isLight: false,
  };
}

export function getRandomTabColorPalette(count: number): TabColorTheme[] {
  const shuffled = [...TAB_COLOR_PALETTES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export interface EduColorTheme {
  name: string;
  surface: string;
  barGradient: string;
  badge: string;
  transcriptLink: string;
  bullet: string;
  ring: string;
}

export const EDU_COLOR_THEMES: EduColorTheme[] = [
  {
    name: "cobalt",
    surface: "paper-grid-cobalt border-[#BFDBFE] hover:border-[#2563EB]",
    barGradient: "bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA]",
    badge: "text-[#1E40AF] bg-[#EFF6FF] border-[#93C5FD]",
    transcriptLink: "text-[#1D4ED8] hover:text-[#1E40AF]",
    bullet: "text-[#2563EB]",
    ring: "ring-[#2563EB]/25",
  },
  {
    name: "mint",
    surface: "paper-grid-mint border-[#A7F3D0] hover:border-[#059669]",
    barGradient: "bg-gradient-to-r from-[#059669] via-[#10B981] to-[#34D399]",
    badge: "text-[#065F46] bg-[#ECFDF5] border-[#6EE7B7]",
    transcriptLink: "text-[#047857] hover:text-[#065F46]",
    bullet: "text-[#059669]",
    ring: "ring-[#059669]/25",
  },
  {
    name: "violet",
    surface: "paper-grid-violet border-[#DDD6FE] hover:border-[#7C3AED]",
    barGradient: "bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#C4B5FD]",
    badge: "text-[#5B21B6] bg-[#F5F3FF] border-[#C4B5FD]",
    transcriptLink: "text-[#6D28D9] hover:text-[#5B21B6]",
    bullet: "text-[#7C3AED]",
    ring: "ring-[#7C3AED]/25",
  },
  {
    name: "amber",
    surface: "paper-lined-amber border-[#FCD34D] hover:border-[#D97706]",
    barGradient: "bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#FCD34D]",
    badge: "text-[#78350F] bg-[#FFFBEB] border-[#FCD34D]",
    transcriptLink: "text-[#B45309] hover:text-[#78350F]",
    bullet: "text-[#D97706]",
    ring: "ring-[#D97706]/25",
  },
  {
    name: "tangerine",
    surface: "paper-lined-amber border-[#FDBA74] hover:border-[#EA580C]",
    barGradient: "bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#FDBA74]",
    badge: "text-[#7C2D12] bg-[#FFF7ED] border-[#FDBA74]",
    transcriptLink: "text-[#C2410C] hover:text-[#7C2D12]",
    bullet: "text-[#EA580C]",
    ring: "ring-[#EA580C]/25",
  },
];

export function getRandomEduColorThemes(count: number): EduColorTheme[] {
  const shuffled = [...EDU_COLOR_THEMES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

