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
