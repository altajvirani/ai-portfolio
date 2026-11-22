import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const CodeBlock: React.FC<{
  codeString: string;
  language?: string;
}> = ({ codeString, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(codeString);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = codeString;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error
    }
  };

  return (
    <div className="my-3 rounded-xl bg-[#1E1E2E] text-[#E2E8F0] border border-[#2D3142] overflow-hidden text-xs font-mono shadow-sm">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#181825] border-b border-[#2D3142] text-[10px] text-[#A6ADC8]">
        <span className="font-semibold uppercase tracking-wider">{language || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[#A6ADC8] hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
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
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`markdown-body text-[#27272A] leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-base font-bold font-display text-[#18181B] mt-3 mb-1.5 border-b border-[#DCD5C9]/60 pb-1"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-sm font-bold font-display text-[#18181B] mt-2.5 mb-1"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-xs sm:text-sm font-bold font-display text-[#18181B] mt-2 mb-1"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-xs font-bold text-[#18181B] mt-1.5 mb-0.5"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="my-1.5 leading-relaxed text-xs sm:text-sm text-[#27272A]" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-5 my-2 space-y-1 text-xs sm:text-sm text-[#27272A] [&>li::marker]:text-[#2563EB] [&_ul]:list-[circle] [&_ul]:pl-5 [&_ul]:my-1 [&_ul_ul]:list-[square]"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-5 my-2 space-y-1 text-xs sm:text-sm text-[#27272A] [&>li::marker]:text-[#2563EB] [&>li::marker]:font-semibold [&_ol]:pl-5 [&_ol]:my-1"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="leading-relaxed pl-0.5 [&>p]:my-0.5" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-2 border-[#2563EB] pl-3 my-2 text-[#52525B] italic bg-[#F4EFE6]/60 py-1 rounded-r text-xs sm:text-sm"
              {...props}
            />
          ),
          a: ({ node, href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2563EB] hover:underline font-semibold inline-flex items-center gap-0.5"
              {...props}
            >
              {children}
            </a>
          ),
          pre: ({ children }) => {
            const codeElement = React.Children.toArray(children)[0];
            if (React.isValidElement(codeElement)) {
              const codeProps = codeElement.props as {
                className?: string;
                children?: React.ReactNode;
              };
              const className = codeProps.className || "";
              const match = /language-(\w+)/.exec(className);
              const language = match ? match[1] : "";
              const codeString = String(codeProps.children || "").replace(/\n$/, "");
              return <CodeBlock codeString={codeString} language={language} />;
            }
            return (
              <pre className="p-3 overflow-x-auto bg-[#1E1E2E] text-[#E2E8F0] rounded-xl my-2 text-xs font-mono">
                {children}
              </pre>
            );
          },
          code: ({ node, className, children, ...rest }) => (
            <code
              className="px-1.5 py-0.5 rounded bg-[#E4DCCE] text-[#1E3A8A] font-mono text-[11px] font-semibold border border-[#DCD5C9]"
              {...rest}
            >
              {children}
            </code>
          ),
          table: ({ node, ...props }) => (
            <div className="my-2.5 overflow-x-auto rounded-xl border border-[#DCD5C9] bg-white/70 shadow-sm">
              <table className="min-w-full divide-y divide-[#DCD5C9] text-xs font-mono" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-[#FAF8F3]" {...props} />,
          th: ({ node, ...props }) => (
            <th
              className="px-3 py-1.5 text-left font-bold text-[#18181B] text-[11px] uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-1.5 text-[#27272A] border-t border-[#E4DCCE]" {...props} />
          ),
          hr: ({ node, ...props }) => <hr className="my-3 border-t border-[#DCD5C9]" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
