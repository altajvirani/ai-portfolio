import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopyCode = async (code: string, idx: number) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedCodeIdx(idx);
      setTimeout(() => setCopiedCodeIdx(null), 2000);
    } catch {
      // Ignore copy error
    }
  };

  // Helper to parse inline markdown (bold, code, links, italic)
  const renderInline = (text: string): React.ReactNode[] => {
    const tokens: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // 1. Inline code: `code`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        tokens.push(
          <code
            key={`code-${keyIdx++}`}
            className="px-1.5 py-0.5 rounded bg-[#E4DCCE] text-[#1E3A8A] font-mono text-[11px] font-semibold"
          >
            {codeMatch[1]}
          </code>,
        );
        remaining = remaining.slice(codeMatch[0].length);
        continue;
      }

      // 2. Bold text: **bold**
      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
      if (boldMatch) {
        tokens.push(
          <strong key={`bold-${keyIdx++}`} className="font-bold text-[#18181B]">
            {boldMatch[1]}
          </strong>,
        );
        remaining = remaining.slice(boldMatch[0].length);
        continue;
      }

      // 3. Markdown links: [label](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        tokens.push(
          <a
            key={`link-${keyIdx++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2563EB] hover:underline font-semibold inline-flex items-center gap-0.5"
          >
            {linkMatch[1]}
          </a>,
        );
        remaining = remaining.slice(linkMatch[0].length);
        continue;
      }

      // 4. Italic text: *italic* or _italic_
      const italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/);
      if (italicMatch) {
        tokens.push(
          <em key={`italic-${keyIdx++}`} className="italic">
            {italicMatch[2]}
          </em>,
        );
        remaining = remaining.slice(italicMatch[0].length);
        continue;
      }

      // 5. Normal text character
      const nextSpecial = remaining.search(/[`*\[_]/);
      if (nextSpecial === -1) {
        tokens.push(remaining);
        break;
      } else if (nextSpecial === 0) {
        tokens.push(remaining[0]);
        remaining = remaining.slice(1);
      } else {
        tokens.push(remaining.slice(0, nextSpecial));
        remaining = remaining.slice(nextSpecial);
      }
    }

    return tokens;
  };

  // Split content into blocks: code blocks vs regular paragraphs/lists
  const parseBlocks = () => {
    const blocks: React.ReactNode[] = [];
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLanguage = "";
    let blockIdx = 0;
    let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;

    const flushList = () => {
      if (!listBuffer) return;
      if (listBuffer.type === "ul") {
        blocks.push(
          <ul key={`ul-${blockIdx++}`} className="my-2 space-y-1 pl-1">
            {listBuffer.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                <span className="text-[#2563EB] font-bold select-none mt-0.5 text-xs">
                  •
                </span>
                <span className="flex-1">{renderInline(item)}</span>
              </li>
            ))}
          </ul>,
        );
      } else {
        blocks.push(
          <ol key={`ol-${blockIdx++}`} className="my-2 space-y-1 pl-4 list-decimal text-xs sm:text-sm">
            {listBuffer.items.map((item, idx) => (
              <li key={idx} className="pl-1">
                {renderInline(item)}
              </li>
            ))}
          </ol>,
        );
      }
      listBuffer = null;
    };

    const flushCodeBlock = () => {
      if (!inCodeBlock) return;
      const codeString = codeBuffer.join("\n");
      const currentCodeIdx = blockIdx++;
      blocks.push(
        <div
          key={`codeblock-${currentCodeIdx}`}
          className="my-3 rounded-xl bg-[#1E1E2E] text-[#E2E8F0] border border-[#2D3142] overflow-hidden text-xs font-mono shadow-sm"
        >
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#181825] border-b border-[#2D3142] text-[10px] text-[#A6ADC8]">
            <span>{codeLanguage || "code"}</span>
            <button
              type="button"
              onClick={() => handleCopyCode(codeString, currentCodeIdx)}
              className="flex items-center gap-1 text-[#A6ADC8] hover:text-white transition-colors cursor-pointer"
            >
              {copiedCodeIdx === currentCodeIdx ? (
                <>
                  <Check className="w-3 h-3 text-[#A6E3A1]" />
                  <span className="text-[#A6E3A1]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 overflow-x-auto leading-relaxed">
            <code>{codeString}</code>
          </pre>
        </div>,
      );
      codeBuffer = [];
      inCodeBlock = false;
      codeLanguage = "";
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle Code Block start/end
      if (line.trim().startsWith("```")) {
        flushList();
        if (inCodeBlock) {
          flushCodeBlock();
        } else {
          inCodeBlock = true;
          codeLanguage = line.trim().slice(3).trim();
          codeBuffer = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      const trimmed = line.trim();

      // Empty line
      if (!trimmed) {
        flushList();
        continue;
      }

      // Headings: ### or ## or #
      if (/^#{1,4}\s+/.test(trimmed)) {
        flushList();
        const level = trimmed.match(/^#+/)?.[0].length || 3;
        const text = trimmed.replace(/^#+\s+/, "");
        const headingClass =
          level === 1
            ? "text-base font-bold font-display text-[#18181B] mt-3 mb-1"
            : level === 2
              ? "text-sm font-bold font-display text-[#18181B] mt-2.5 mb-1"
              : "text-xs sm:text-sm font-bold text-[#18181B] mt-2 mb-1";
        blocks.push(
          <div key={`h-${blockIdx++}`} className={headingClass}>
            {renderInline(text)}
          </div>,
        );
        continue;
      }

      // Unordered list item: - or * or •
      if (/^[-*•]\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^[-*•]\s+/, "");
        if (!listBuffer || listBuffer.type !== "ul") {
          flushList();
          listBuffer = { type: "ul", items: [itemText] };
        } else {
          listBuffer.items.push(itemText);
        }
        continue;
      }

      // Ordered list item: 1.
      if (/^\d+\.\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s+/, "");
        if (!listBuffer || listBuffer.type !== "ol") {
          flushList();
          listBuffer = { type: "ol", items: [itemText] };
        } else {
          listBuffer.items.push(itemText);
        }
        continue;
      }

      // Normal paragraph
      flushList();
      blocks.push(
        <p key={`p-${blockIdx++}`} className="my-1.5 leading-relaxed text-xs sm:text-sm">
          {renderInline(trimmed)}
        </p>,
      );
    }

    flushList();
    if (inCodeBlock) {
      flushCodeBlock();
    }
    return blocks;
  };

  return <div className={`markdown-body space-y-1 text-[#27272A] ${className}`}>{parseBlocks()}</div>;
};
