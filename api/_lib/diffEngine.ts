import { diffLines } from "diff";

export type DiffType = "same" | "add" | "delete";

export interface DiffLine {
  type: DiffType;
  oldLineNumber?: number;
  newLineNumber?: number;
  text: string;
}

export interface SideBySideRow {
  left?: {
    lineNumber: number;
    text: string;
    type: "same" | "delete";
  };
  right?: {
    lineNumber: number;
    text: string;
    type: "same" | "add";
  };
}

export interface DiffResult {
  lines: DiffLine[];
  sideBySide: SideBySideRow[];
  stats: {
    additions: number;
    deletions: number;
    unchanged: number;
  };
}

/**
 * Standard Myers line diff algorithm powered by the industry-standard 'diff' library.
 * Generates unified diff lines, aligned side-by-side rows, and stats.
 */
export function computeMyersDiff(oldText: string, newText: string): DiffResult {
  const changes = diffLines(oldText || "", newText || "");
  const lines: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const part of changes) {
    // Strip trailing single newline before split to avoid false trailing empty lines
    const rawParts = part.value.replace(/\r?\n$/, "").split(/\r?\n/);
    if (part.added) {
      for (const lineText of rawParts) {
        lines.push({
          type: "add",
          newLineNumber: newLineNum++,
          text: lineText,
        });
        additions++;
      }
    } else if (part.removed) {
      for (const lineText of rawParts) {
        lines.push({
          type: "delete",
          oldLineNumber: oldLineNum++,
          text: lineText,
        });
        deletions++;
      }
    } else {
      for (const lineText of rawParts) {
        lines.push({
          type: "same",
          oldLineNumber: oldLineNum++,
          newLineNumber: newLineNum++,
          text: lineText,
        });
        unchanged++;
      }
    }
  }

  // Construct aligned side-by-side rows
  const sideBySide: SideBySideRow[] = [];
  let lineIdx = 0;

  while (lineIdx < lines.length) {
    const current = lines[lineIdx];

    if (current.type === "same") {
      sideBySide.push({
        left: {
          lineNumber: current.oldLineNumber!,
          text: current.text,
          type: "same",
        },
        right: {
          lineNumber: current.newLineNumber!,
          text: current.text,
          type: "same",
        },
      });
      lineIdx++;
    } else {
      // Collect contiguous deletes and adds to align them side by side
      const deletes: DiffLine[] = [];
      const adds: DiffLine[] = [];

      while (
        lineIdx < lines.length &&
        (lines[lineIdx].type === "delete" || lines[lineIdx].type === "add")
      ) {
        if (lines[lineIdx].type === "delete") {
          deletes.push(lines[lineIdx]);
        } else {
          adds.push(lines[lineIdx]);
        }
        lineIdx++;
      }

      const maxLen = Math.max(deletes.length, adds.length);
      for (let k = 0; k < maxLen; k++) {
        const del = deletes[k];
        const add = adds[k];
        sideBySide.push({
          left: del
            ? {
                lineNumber: del.oldLineNumber!,
                text: del.text,
                type: "delete",
              }
            : undefined,
          right: add
            ? {
                lineNumber: add.newLineNumber!,
                text: add.text,
                type: "add",
              }
            : undefined,
        });
      }
    }
  }

  return {
    lines,
    sideBySide,
    stats: {
      additions,
      deletions,
      unchanged,
    },
  };
}
