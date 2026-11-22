import React, { useEffect, useState, useRef } from "react";
import Editor, { DiffEditor, type Monaco } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Braces,
  CheckCircle2,
  Database,
  LockKeyhole,
  LogIn,
  LogOut,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  FileText,
  Upload,
  GitCompare,
  ArrowLeftRight,
  Trash2,
  Download,
  AlertCircle,
  Loader2,
  Check,
  X,
  FileCode,
  Layers,
  ChevronRight,
  History,
  Search,
  Terminal,
  Columns2,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileEdit,
} from "lucide-react";
import type { DiffResult, SideBySideRow, DiffLine } from "../../api/_lib/diffEngine.ts";

type DocumentType = "resume" | "portfolio";

interface VersionItem {
  version: number;
  isActive: boolean;
  title: string;
  rawFileName?: string | null;
  mimeType?: string | null;
  checksum: string;
  aiSummary: string;
  createdAt: string;
  createdBy: string;
}

interface AdminDocumentResponse {
  document: unknown;
  version: number;
  updatedAt: string;
  updatedBy: string;
  actor: { email: string };
}

function getCsrfToken() {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("admin_csrf="))
    ?.split("=")
    .slice(1)
    .join("=");
}

const UnauthorizedScreen: React.FC = () => (
  <main className="relative min-h-screen overflow-hidden bg-[#F7F4EE] px-4 py-8 text-[#18181B] paper-grain sm:px-6 sm:py-12">
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 airmail-border" />
    <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#DBEAFE]/70 blur-3xl" />
    <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#FEF3C7]/70 blur-3xl" />
    <div className="relative mx-auto max-w-4xl">
      <a href="/" className="mb-8 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-mono font-bold text-[#475569] transition hover:text-[#1D4ED8] sm:mb-12">
        <ArrowLeft size={14} /> Return to portfolio
      </a>
      <div className="grid overflow-hidden rounded-[28px] border-2 border-white bg-[#FFFEFA] shadow-[0_24px_60px_-24px_rgba(30,41,59,0.32),0_0_0_1px_rgba(214,206,192,0.95)] md:grid-cols-[1.15fr_.85fr]">
        <div className="p-6 sm:p-10 md:p-12">
          <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white bg-gradient-to-b from-[#FFF7ED] to-[#FED7AA] text-[#C2410C] shadow-[0_10px_24px_-10px_rgba(194,65,12,0.38)]">
            <LockKeyhole size={28} />
          </div>
          <p className="mb-3 text-[11px] font-mono font-bold uppercase tracking-[0.28em] text-[#2563EB]">Restricted workspace</p>
          <h1 className="max-w-lg text-4xl font-black leading-[1.05] tracking-tight text-[#18181B] sm:text-5xl">
            This room is private.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#52525B]">
            The portfolio intelligence &amp; datastore is sealed behind Google SSO. Only allowlisted administrators can load, edit, or version its contents.
          </p>
          <a href="/api/auth/google/start" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#1D4ED8] bg-gradient-to-b from-[#4B8DF8] via-[#2563EB] to-[#1E54D6] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_-8px_rgba(37,99,235,0.65)] transition hover:-translate-y-0.5">
            <LogIn size={17} /> Continue with Google
          </a>
        </div>
        <div className="flex flex-col justify-between border-t border-[#DCD5C9] bg-[#F4F8FF] p-6 paper-grid-cobalt sm:p-8 md:border-l md:border-t-0 md:p-10">
          <div>
            <div className="mb-6 flex items-center gap-2 text-sm font-bold text-[#1E3A8A]">
              <ShieldCheck size={18} className="text-[#059669]" /> Access controls active
            </div>
            <div className="space-y-4">
              <div className="flex gap-3 text-xs leading-5 text-[#52525B]"><Database size={16} className="shrink-0 text-[#2563EB]" /><span>Independent versioned engine, decoupled from public rendering.</span></div>
              <div className="flex gap-3 text-xs leading-5 text-[#52525B]"><Sparkles size={16} className="shrink-0 text-[#7C3AED]" /><span>One-line AI diffs and Git-accurate side-by-side reviews.</span></div>
              <div className="flex gap-3 text-xs leading-5 text-[#52525B]"><LockKeyhole size={16} className="shrink-0 text-[#D97706]" /><span>Full audit logging and bi-directional checkout control.</span></div>
            </div>
          </div>
          <p className="mt-10 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#94A3B8]">ADMIN / AUTH_REQUIRED</p>
        </div>
      </div>
    </div>
  </main>
);

const resumeMarkdownRenderers = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h1: ({ children }: any) => (
    <h1 className="text-2xl font-black text-[#18181B] pb-2 mb-3 border-b-2 border-[#2563EB]/40 tracking-tight">
      {children}
    </h1>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h2: ({ children }: any) => (
    <h2 className="text-xs font-mono font-bold uppercase tracking-[0.22em] text-[#2563EB] mt-6 mb-2.5 pb-1 border-b border-[#DCD5C9] flex items-center gap-1.5">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
      {children}
    </h2>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h3: ({ children }: any) => (
    <h3 className="text-sm font-bold text-[#18181B] mt-3.5 mb-1">
      {children}
    </h3>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  h4: ({ children }: any) => (
    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#475569] mt-3 mb-1">
      {children}
    </h4>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  p: ({ children }: any) => (
    <p className="text-xs leading-relaxed text-[#334155] mb-2 font-sans">
      {children}
    </p>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  a: ({ href, children }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#2563EB] hover:text-[#1D4ED8] underline font-medium inline-flex items-center gap-0.5"
    >
      <span>{children}</span>
      <ExternalLink size={10} className="inline opacity-70 ml-0.5" />
    </a>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ul: ({ children }: any) => (
    <ul className="list-disc list-outside pl-4 space-y-1 mb-3 text-xs text-[#334155]">
      {children}
    </ul>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ol: ({ children }: any) => (
    <ol className="list-decimal list-outside pl-4 space-y-1 mb-3 text-xs text-[#334155]">
      {children}
    </ol>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  li: ({ children }: any) => (
    <li className="leading-relaxed">
      {children}
    </li>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  strong: ({ children }: any) => (
    <strong className="font-bold text-[#0F172A]">
      {children}
    </strong>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  em: ({ children }: any) => (
    <em className="italic text-[#475569]">
      {children}
    </em>
  ),
  hr: () => (
    <hr className="my-4 border-[#DCD5C9]" />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: ({ children }: any) => (
    <code className="rounded bg-[#F1F5F9] border border-[#E2E8F0] px-1 py-0.5 text-[11px] font-mono text-[#0F172A]">
      {children}
    </code>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-3 border-[#2563EB] pl-3 py-1 my-2 bg-[#F8FAFC] text-xs text-[#475569] italic rounded-r">
      {children}
    </blockquote>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-[#DCD5C9]">
      <table className="min-w-full text-xs divide-y divide-[#DCD5C9]">
        {children}
      </table>
    </div>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  th: ({ children }: any) => (
    <th className="bg-[#F8FAFC] px-2.5 py-1.5 text-left font-mono font-bold text-[#1E293B]">
      {children}
    </th>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  td: ({ children }: any) => (
    <td className="px-2.5 py-1.5 text-[#334155] border-t border-[#E2E8F0]">
      {children}
    </td>
  ),
};

export const AdminPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"resume" | "portfolio">("resume");

  // Portfolio Datastore State
  const [editorValue, setEditorValue] = useState("");
  const [portfolioVersion, setPortfolioVersion] = useState<number | null>(null);
  const [portfolioUpdatedAt, setPortfolioUpdatedAt] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [portfolioVersions, setPortfolioVersions] = useState<VersionItem[]>([]);
  const [isLoadingPortfolioVersions, setIsLoadingPortfolioVersions] = useState(false);

  // Resume Engine State
  const [resumeVersions, setResumeVersions] = useState<VersionItem[]>([]);
  const [activeResumeVersion, setActiveResumeVersion] = useState<number | null>(null);
  const [isLoadingResumeVersions, setIsLoadingResumeVersions] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resume Markdown Monaco Editor & Live Split Preview State
  const [resumeEditorValue, setResumeEditorValue] = useState("");
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [resumeSaveStatus, setResumeSaveStatus] = useState<string | null>(null);
  const [resumeEditorTheme, setResumeEditorTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [showResumeMinimap, setShowResumeMinimap] = useState(false);
  const [resumeWordWrap, setResumeWordWrap] = useState(true);
  const [showResumePreview, setShowResumePreview] = useState(true);
  const [resumeCursorPos, setResumeCursorPos] = useState({ line: 1, col: 1 });
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resumeEditorRef = useRef<any>(null);

  // Monaco VS Code Editor Controls State
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [diffTheme, setDiffTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [showMinimap, setShowMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const [jsonValidationError, setJsonValidationError] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);

  // Git Diff Viewer Modal State
  const [diffModalOpen, setDiffModalOpen] = useState(false);
  const [diffLoading, setDiffLoading] = useState(false);
  const [diffData, setDiffData] = useState<{
    fromVersion: number;
    toVersion: number;
    fromContent: string;
    toContent: string;
    aiSummary: string;
    diff: DiffResult;
    docType: DocumentType;
  } | null>(null);
  const [diffViewMode, setDiffViewMode] = useState<"split" | "unified">("split");

  // Validate JSON helper
  const validateJsonContent = (text: string) => {
    try {
      JSON.parse(text);
      setJsonValidationError(null);
      return true;
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        setJsonValidationError(err.message.replace(/^JSON\.parse: /, ""));
      } else {
        setJsonValidationError("Invalid JSON syntax");
      }
      return false;
    }
  };

  const handleFormatDocument = () => {
    editorRef.current?.getAction("editor.action.formatDocument")?.run();
  };

  const handleOpenCommandPalette = () => {
    editorRef.current?.focus();
    editorRef.current?.trigger("toolbar", "editor.action.quickCommand", null);
  };

  const handleFindReplace = () => {
    editorRef.current?.focus();
    editorRef.current?.getAction("actions.find")?.run();
  };

  // Switch Confirm Dialog
  const [switchConfirmOpen, setSwitchConfirmOpen] = useState(false);
  const [targetSwitchVersion, setTargetSwitchVersion] = useState<number | null>(null);
  const [targetSwitchDocType, setTargetSwitchDocType] = useState<DocumentType>("resume");
  const [switchAiSummary, setSwitchAiSummary] = useState<string>("");
  const [isSwitching, setIsSwitching] = useState(false);

  // Load Portfolio JSON Document & Version History
  const loadPortfolioDocument = async () => {
    setIsLoadingPortfolioVersions(true);
    setStatus("Loading datastore...");
    try {
      const response = await fetch("/api/admin/versions/portfolio", { credentials: "same-origin" });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || "Unable to load the datastore.");
        return;
      }
      setAuthenticated(true);
      if (data.actor?.email) setEmail(data.actor.email);
      if (data.versions) setPortfolioVersions(data.versions);
      setPortfolioVersion(data.activeVersion);
      if (data.activeContent) {
        try {
          const parsed = JSON.parse(data.activeContent);
          const formatted = JSON.stringify(parsed, null, 2);
          setEditorValue(formatted);
          validateJsonContent(formatted);
        } catch {
          setEditorValue(data.activeContent);
        }
      }
      const activeVer = data.versions?.find((v: VersionItem) => v.isActive);
      if (activeVer) {
        setPortfolioUpdatedAt(activeVer.createdAt);
      }
      setStatus("");
    } catch {
      setStatus("Unable to reach the datastore service.");
    } finally {
      setIsLoadingPortfolioVersions(false);
    }
  };

  // Load Resume Versions
  const loadResumeVersions = async () => {
    setIsLoadingResumeVersions(true);
    try {
      const response = await fetch("/api/admin/versions/resume", { credentials: "same-origin" });
      const data = await response.json();
      if (response.ok && data.versions) {
        setResumeVersions(data.versions);
        setActiveResumeVersion(data.activeVersion);
        if (data.activeContent) {
          setResumeEditorValue(data.activeContent);
        }
      }
    } catch (err) {
      console.warn("Failed to load resume versions:", err);
    } finally {
      setIsLoadingResumeVersions(false);
    }
  };

  const saveResumeMarkdown = async () => {
    if (!resumeEditorValue.trim()) return;
    setIsSavingResume(true);
    setResumeSaveStatus("Saving & auto-formatting Markdown...");
    try {
      const response = await fetch("/api/admin/versions/resume/edit", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken() || "",
        },
        body: JSON.stringify({
          contentText: resumeEditorValue,
          title: `Markdown Revision v${(activeResumeVersion || 0) + 1}`,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setResumeSaveStatus(data.error || "Failed to save resume markdown.");
        return;
      }
      setResumeSaveStatus(`Saved as Version v${data.version}! Live Grounded.`);
      if (data.contentText) {
        setResumeEditorValue(data.contentText);
      }
      await loadResumeVersions();
      setTimeout(() => setResumeSaveStatus(null), 3500);
    } catch (err: unknown) {
      setResumeSaveStatus(err instanceof Error ? err.message : "Network error saving resume.");
    } finally {
      setIsSavingResume(false);
    }
  };

  const handleFormatResume = () => {
    if (resumeEditorRef.current) {
      resumeEditorRef.current.getAction("editor.action.formatDocument")?.run();
    }
  };

  const handleFindResume = () => {
    if (resumeEditorRef.current) {
      resumeEditorRef.current.getAction("actions.find")?.run();
    }
  };

  const handleCommandPaletteResume = () => {
    if (resumeEditorRef.current) {
      resumeEditorRef.current.trigger("anyString", "editor.action.quickCommand", {});
    }
  };

  const loadVersionIntoResumeEditor = async (verNum: number) => {
    try {
      setResumeSaveStatus(`Loading Version v${verNum} into editor...`);
      const response = await fetch(`/api/admin/versions/resume/download/${verNum}?format=markdown`, {
        credentials: "same-origin",
      });
      if (response.ok) {
        const text = await response.text();
        setResumeEditorValue(text);
        setResumeSaveStatus(`Loaded Version v${verNum} into editor.`);
        setTimeout(() => setResumeSaveStatus(null), 3000);
      } else {
        setResumeSaveStatus(`Could not load v${verNum}`);
      }
    } catch {
      setResumeSaveStatus("Network error loading version.");
    }
  };

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "same-origin" })
      .then(async (response) => {
        const data = (await response.json()) as { authenticated: boolean; email?: string };
        setAuthenticated(data.authenticated);
        if (data.email) setEmail(data.email);
        if (data.authenticated) {
          await Promise.all([loadPortfolioDocument(), loadResumeVersions()]);
        }
      })
      .catch(() => setStatus("Unable to reach the admin service."));
  }, []);

  const savePortfolioDocument = async () => {
    if (!editorValue.trim()) return;
    try {
      JSON.parse(editorValue);
    } catch {
      setStatus("The editor contains invalid JSON.");
      return;
    }
    setIsSaving(true);
    setStatus("Saving snapshot & updating datastore...");
    try {
      const nextVer = (portfolioVersion || 0) + 1;
      const response = await fetch("/api/admin/versions/portfolio/edit", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken() || "",
        },
        body: JSON.stringify({
          contentText: editorValue,
          title: `Portfolio Datastore v${nextVer}`,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || "Unable to save the datastore.");
        return;
      }
      setStatus(`Saved snapshot v${data.version}! Live Grounded.`);
      if (data.contentText) {
        setEditorValue(data.contentText);
      }
      await loadPortfolioDocument();
      setTimeout(() => setStatus(""), 3500);
    } catch {
      setStatus("Unable to reach the admin service.");
    } finally {
      setIsSaving(false);
    }
  };

  const loadVersionIntoPortfolioEditor = async (verNum: number) => {
    try {
      setStatus(`Loading Version v${verNum} into editor...`);
      const response = await fetch(`/api/admin/versions/portfolio/download/${verNum}?format=json`, {
        credentials: "same-origin",
      });
      if (response.ok) {
        const text = await response.text();
        try {
          const parsed = JSON.parse(text);
          const formatted = JSON.stringify(parsed, null, 2);
          setEditorValue(formatted);
          validateJsonContent(formatted);
        } catch {
          setEditorValue(text);
        }
        setStatus(`Loaded Version v${verNum} into editor.`);
        setTimeout(() => setStatus(""), 3000);
      } else {
        setStatus(`Could not load v${verNum}`);
      }
    } catch {
      setStatus("Network error loading version.");
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    setUploadStatus("Reading file binary...");

    const reader = new FileReader();
    reader.onerror = () => setUploadError("Failed to read the local file.");
    reader.onload = async () => {
      try {
        const base64String = (reader.result as string).split(",")[1];
        setUploadStatus("Validating format & running AI authenticity evaluation...");

        const response = await fetch("/api/admin/versions/resume/upload", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": getCsrfToken() || "",
          },
          body: JSON.stringify({
            filename: file.name,
            mimeType: file.type || "application/pdf",
            fileBase64: base64String,
            title: `Resume upload (${file.name})`,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          setUploadError(data.error || data.details || "Upload validation failed.");
          setUploadStatus(null);
          return;
        }

        setUploadStatus(`Saved as Version v${data.version}! AI Twin grounded.`);
        await loadResumeVersions();
        setTimeout(() => setUploadStatus(null), 4000);
      } catch (err: unknown) {
        setUploadError(err instanceof Error ? err.message : "Network error during upload.");
        setUploadStatus(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const openDiffModal = async (fromVer: number, toVer: number, docType: DocumentType = "resume") => {
    setDiffModalOpen(true);
    setDiffLoading(true);
    setDiffData(null);

    try {
      const response = await fetch(`/api/admin/versions/${docType}/diff`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken() || "",
        },
        body: JSON.stringify({ fromVersion: fromVer, toVersion: toVer }),
      });
      const data = await response.json();
      if (response.ok) {
        setDiffData({ ...data, docType });
      } else {
        alert(data.error || "Failed to compute version diff.");
        setDiffModalOpen(false);
      }
    } catch {
      alert("Network error generating diff.");
      setDiffModalOpen(false);
    } finally {
      setDiffLoading(false);
    }
  };

  const promptSwitchVersion = async (targetVer: number, docType: DocumentType = "resume") => {
    const currentActive = docType === "resume" ? activeResumeVersion : portfolioVersion;
    if (currentActive === targetVer) return;

    setTargetSwitchVersion(targetVer);
    setTargetSwitchDocType(docType);
    setSwitchAiSummary("Generating one-line AI impact analysis...");
    setSwitchConfirmOpen(true);

    try {
      const response = await fetch(`/api/admin/versions/${docType}/diff`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken() || "",
        },
        body: JSON.stringify({ fromVersion: currentActive || 1, toVersion: targetVer }),
      });
      const data = await response.json();
      if (response.ok && data.aiSummary) {
        setSwitchAiSummary(data.aiSummary);
      } else {
        setSwitchAiSummary(`Switches live active document from v${currentActive} to v${targetVer}.`);
      }
    } catch {
      setSwitchAiSummary(`Switches live active document from v${currentActive} to v${targetVer}.`);
    }
  };

  const confirmSwitchVersion = async () => {
    if (!targetSwitchVersion) return;
    const docType = targetSwitchDocType;
    setIsSwitching(true);
    try {
      const response = await fetch(`/api/admin/versions/${docType}/switch`, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": getCsrfToken() || "",
        },
        body: JSON.stringify({ version: targetSwitchVersion }),
      });
      const data = await response.json();
      if (response.ok) {
        if (docType === "resume") {
          await loadResumeVersions();
        } else {
          await loadPortfolioDocument();
        }
        setSwitchConfirmOpen(false);
        setDiffModalOpen(false);
      } else {
        alert(data.error || "Failed to switch version.");
      }
    } catch {
      alert("Network error switching version.");
    } finally {
      setIsSwitching(false);
    }
  };

  const deleteVersionItem = async (verNum: number, docType: DocumentType = "resume") => {
    if (!confirm(`Are you sure you want to permanently delete Version v${verNum}? This cannot be undone.`)) {
      return;
    }
    try {
      const response = await fetch(`/api/admin/versions/${docType}/${verNum}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "X-CSRF-Token": getCsrfToken() || "" },
      });
      const data = await response.json();
      if (response.ok) {
        if (docType === "resume") {
          await loadResumeVersions();
        } else {
          await loadPortfolioDocument();
        }
      } else {
        alert(data.error || "Failed to delete version.");
      }
    } catch {
      alert("Network error deleting version.");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    window.location.reload();
  };

  if (authenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] px-5 paper-grain text-[#18181B]">
        <div className="skeuo-card rounded-2xl px-6 py-5 text-sm font-mono font-bold text-[#475569]">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#2563EB]" />
          Checking admin clearance…
        </div>
      </main>
    );
  }
  if (!authenticated) return <UnauthorizedScreen />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EE] px-3 py-5 text-[#18181B] paper-grain sm:px-6 sm:py-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 airmail-border" />
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#DCD5C9] pb-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#2563EB]">
              <Layers size={14} /> Unified Intelligence &amp; Version Control Engine
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#18181B] sm:text-4xl">
              Portfolio Command Center
            </h1>
            <p className="mt-2 flex items-center gap-2 text-xs text-[#64748B]">
              <CheckCircle2 size={14} className="text-[#059669]" /> Authenticated as{" "}
              <span className="font-mono font-bold text-[#475569]">{email}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#CDC5B7] bg-white px-3.5 py-2 text-xs font-mono font-bold text-[#475569] shadow-xs transition hover:text-[#1D4ED8]"
            >
              <ArrowLeft size={13} /> View Site
            </a>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#CDC5B7] bg-white px-3.5 py-2 text-xs font-mono font-bold text-[#475569] shadow-xs transition hover:border-[#EF4444]/40 hover:text-[#B91C1C]"
            >
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>

        {/* Tab Switcher: Resume Engine vs Portfolio Datastore */}
        <div className="flex items-center gap-2 border-b border-[#DCD5C9] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("resume")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === "resume"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-white/75 text-[#52525B] hover:bg-white hover:text-[#18181B] border border-[#DCD5C9]"
            }`}
          >
            <FileText size={14} />
            <span>Resume Grounding Engine</span>
            {activeResumeVersion && (
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                v{activeResumeVersion} Active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold transition-all cursor-pointer ${
              activeTab === "portfolio"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "bg-white/75 text-[#52525B] hover:bg-white hover:text-[#18181B] border border-[#DCD5C9]"
            }`}
          >
            <Database size={14} />
            <span>Portfolio Datastore</span>
            {portfolioVersion && (
              <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                v{portfolioVersion}
              </span>
            )}
          </button>
        </div>

        {/* ================= RESUME GROUNDING ENGINE TAB ================= */}
        {activeTab === "resume" && (
          <div className="space-y-6">
            {/* Top Workspace Card: VS Code Monaco Markdown Editor & Side-by-Side Preview */}
            <div className="skeuo-card overflow-hidden rounded-[22px] border-2 border-white p-3 sm:p-4 space-y-3">
              {/* Top Meta Bar */}
              <div className="flex flex-col gap-3 border-b border-[#DCD5C9] pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-[#BFDBFE] bg-[#F4F8FF] px-2.5 py-1.5 text-[11px] font-mono font-bold text-[#1E3A8A]">
                    Active Resume Version v{activeResumeVersion ?? "—"}
                  </span>
                  <span className="hidden sm:inline-block rounded-md border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] font-mono text-[#64748B]">
                    {resumeEditorValue.split("\n").length} lines · {resumeEditorValue.trim() ? resumeEditorValue.trim().split(/\s+/).length : 0} words
                  </span>
                  {resumeSaveStatus && (
                    <span
                      className={`rounded-md px-2.5 py-1 text-[11px] font-mono font-bold ${
                        resumeSaveStatus.includes("Saved") || resumeSaveStatus.includes("Loaded")
                          ? "bg-[#DCFCE7] text-[#047857]"
                          : resumeSaveStatus.includes("Failed") || resumeSaveStatus.includes("error")
                          ? "bg-[#FEF2F2] text-[#B91C1C]"
                          : "bg-[#FFF7ED] text-[#C2410C]"
                      }`}
                    >
                      {resumeSaveStatus}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadPanel(!showUploadPanel)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#CDC5B7] bg-white px-3 py-1.5 text-xs font-mono font-bold text-[#475569] shadow-xs transition hover:text-[#1D4ED8] cursor-pointer"
                  >
                    <Upload size={13} className="text-[#2563EB]" />
                    <span>{showUploadPanel ? "Hide Uploader" : "Upload File Instead"}</span>
                    {showUploadPanel ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  <button
                    type="button"
                    onClick={loadResumeVersions}
                    disabled={isLoadingResumeVersions}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#CDC5B7] bg-white px-3 py-1.5 text-xs font-mono font-bold text-[#475569] shadow-xs transition hover:text-[#1D4ED8] cursor-pointer"
                  >
                    <RefreshCw size={13} className={isLoadingResumeVersions ? "animate-spin" : ""} />
                    <span>Reload</span>
                  </button>

                  <button
                    type="button"
                    onClick={saveResumeMarkdown}
                    disabled={isSavingResume}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#1D4ED8] bg-gradient-to-b from-[#4B8DF8] via-[#2563EB] to-[#1E54D6] px-3.5 py-1.5 text-xs font-mono font-bold text-white shadow-xs transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingResume ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    <span>{isSavingResume ? "Saving…" : "Save Version"}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Drag & Drop Uploader (When user wants to upload PDF/DOCX instead) */}
              {showUploadPanel && (
                <div className="rounded-xl border border-[#DCD5C9] bg-[#FAF8F3] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#18181B] flex items-center gap-1.5">
                        <Upload size={14} className="text-[#2563EB]" /> Ingest Document (FlowCV PDF, DOCX, TXT, MD)
                      </h4>
                      <p className="text-[11px] text-[#64748B] mt-0.5">
                        Automatically runs 3-tier validation (MIME + AST static extraction + Gemini LLM multimodal check), parses links verbatim, generates canonical Markdown, and stores snapshot in DB.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUploadPanel(false)}
                      className="p-1 rounded-md text-[#71717A] hover:bg-[#E4E4E7] cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />

                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? "border-[#2563EB] bg-[#EFF6FF]"
                        : "border-[#C9A673] hover:border-[#2563EB] bg-white"
                    }`}
                  >
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4F8FF] border border-[#BFDBFE] text-[#2563EB] mb-2">
                      <Upload size={18} />
                    </div>
                    <div className="text-xs font-bold text-[#18181B]">
                      Click to choose or drag &amp; drop PDF / DOCX file here
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-0.5 font-mono">
                      Deterministic link preservation + AI verification (Max 10MB)
                    </div>
                  </div>

                  {uploadStatus && (
                    <div className="p-2.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-mono text-[#1E40AF] flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-[#2563EB]" />
                      <span>{uploadStatus}</span>
                    </div>
                  )}
                  {uploadError && (
                    <div className="p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs font-mono text-[#B91C1C] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                      <button type="button" onClick={() => setUploadError(null)} className="cursor-pointer">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* VS Code Studio Editor & Split Preview Shell */}
              <div className="rounded-xl border border-[#334155] bg-[#1E1E1E] overflow-hidden shadow-2xl">
                {/* VS Code Control Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-[#252526] border-b border-[#333333] text-xs font-mono text-[#CCCCCC]">
                  {/* File & Mode Status */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1E1E1E] border border-[#383838] text-[#38BDF8] font-bold text-[11px] shadow-xs">
                      <FileText size={13} className="text-[#38BDF8]" /> altaj-virani-resume.md
                    </span>
                    <span className="hidden sm:inline text-[11px] text-[#858585]">
                      Markdown (GFM) · UTF-8
                    </span>
                    <span className="hidden md:inline px-2 py-0.5 rounded bg-[#132A1C] border border-[#14532D] text-[#4ADE80] text-[10px]">
                      Live Grounded
                    </span>
                  </div>

                  {/* VS Code Toolbar Actions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Toggle Live Preview Split View Button */}
                    <button
                      type="button"
                      title="Toggle Side-by-Side Markdown Preview"
                      onClick={() => setShowResumePreview(!showResumePreview)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded transition cursor-pointer text-[11px] font-bold ${
                        showResumePreview
                          ? "bg-[#0E639C] text-white shadow-xs"
                          : "bg-[#333333] hover:bg-[#3E3E42] text-[#A1A1AA]"
                      }`}
                    >
                      <Columns2 size={12} className={showResumePreview ? "text-[#7DD3FC]" : "text-[#A1A1AA]"} />
                      <span>{showResumePreview ? "Split Preview: ON" : "Preview: OFF"}</span>
                    </button>

                    {/* Format Document */}
                    <button
                      type="button"
                      title="Format Markdown (Shift+Alt+F / Cmd+Option+F)"
                      onClick={handleFormatResume}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3E3E42] text-[#D4D4D4] hover:text-white transition cursor-pointer text-[11px]"
                    >
                      <Sparkles size={12} className="text-[#FBBF24]" /> Format
                    </button>

                    {/* Find */}
                    <button
                      type="button"
                      title="Find in Document (Cmd+F / Ctrl+F)"
                      onClick={handleFindResume}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3E3E42] text-[#D4D4D4] hover:text-white transition cursor-pointer text-[11px]"
                    >
                      <Search size={12} className="text-[#34D399]" /> Find
                    </button>

                    {/* Command Palette */}
                    <button
                      type="button"
                      title="Command Palette (F1)"
                      onClick={handleCommandPaletteResume}
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3E3E42] text-[#D4D4D4] hover:text-white transition cursor-pointer text-[11px]"
                    >
                      <Terminal size={12} className="text-[#C084FC]" /> <kbd className="text-[10px]">F1</kbd>
                    </button>

                    {/* Minimap Toggle */}
                    <button
                      type="button"
                      title="Toggle Minimap"
                      onClick={() => setShowResumeMinimap(!showResumeMinimap)}
                      className={`px-2.5 py-1 rounded transition cursor-pointer text-[11px] font-semibold ${
                        showResumeMinimap
                          ? "bg-[#0E639C] text-white"
                          : "bg-[#333333] hover:bg-[#3E3E42] text-[#858585]"
                      }`}
                    >
                      Minimap
                    </button>

                    {/* Word Wrap Toggle */}
                    <button
                      type="button"
                      title="Toggle Word Wrap"
                      onClick={() => setResumeWordWrap(!resumeWordWrap)}
                      className={`px-2.5 py-1 rounded transition cursor-pointer text-[11px] font-semibold ${
                        resumeWordWrap
                          ? "bg-[#0E639C] text-white"
                          : "bg-[#333333] hover:bg-[#3E3E42] text-[#858585]"
                      }`}
                    >
                      Wrap
                    </button>

                    {/* VS Code Theme Switcher */}
                    <button
                      type="button"
                      title="Toggle VS Code Theme"
                      onClick={() =>
                        setResumeEditorTheme(resumeEditorTheme === "vs-dark" ? "light" : "vs-dark")
                      }
                      className="px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3E3E42] text-[#D4D4D4] hover:text-white transition cursor-pointer text-[11px]"
                    >
                      {resumeEditorTheme === "vs-dark" ? "🌙 Dark" : "☀️ Light"}
                    </button>
                  </div>
                </div>

                {/* Main Split (Editor + Live Preview) or Full Editor View */}
                <div
                  className={`p-2 bg-[#1E1E1E] ${
                    showResumePreview
                      ? "grid grid-cols-1 lg:grid-cols-2 gap-3"
                      : "grid grid-cols-1"
                  }`}
                >
                  {/* Left Column: Monaco Markdown Editor */}
                  <div className="rounded-lg overflow-hidden border border-[#333333]">
                    <Editor
                      height="700px"
                      language="markdown"
                      theme={resumeEditorTheme}
                      value={resumeEditorValue}
                      onChange={(val) => setResumeEditorValue(val || "")}
                      onMount={(editor) => {
                        resumeEditorRef.current = editor;
                        editor.onDidChangeCursorPosition((e) => {
                          setResumeCursorPos({ line: e.position.lineNumber, col: e.position.column });
                        });
                      }}
                      options={{
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        fontSize: 13,
                        lineNumbers: "on",
                        minimap: { enabled: showResumeMinimap },
                        wordWrap: resumeWordWrap ? "on" : "off",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        renderWhitespace: "selection",
                        bracketPairColorization: { enabled: true },
                        smoothScrolling: true,
                        cursorBlinking: "smooth",
                        cursorSmoothCaretAnimation: "on",
                      }}
                    />
                  </div>

                  {/* Right Column: Live Rendered Markdown Preview (GFM) */}
                  {showResumePreview && (
                    <div className="flex flex-col h-[700px] rounded-lg border border-[#333333] bg-[#FFFEFA] overflow-hidden shadow-inner">
                      {/* Preview Pane Top Rail */}
                      <div className="flex items-center justify-between px-3.5 py-2 bg-[#F4F4F5] border-b border-[#E4E4E7] text-[11px] font-mono font-bold text-[#52525B]">
                        <span className="flex items-center gap-1.5 text-[#2563EB]">
                          <Eye size={13} /> Live Markdown Preview
                        </span>
                        <span className="rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] text-[#1E40AF]">
                          GitHub-Flavored Output
                        </span>
                      </div>

                      {/* Rendered Document View */}
                      <div className="flex-1 overflow-y-auto p-6 text-[#18181B] paper-grain">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={resumeMarkdownRenderers}>
                          {resumeEditorValue}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>

                {/* VS Code Bottom Status Bar */}
                <div className="flex items-center justify-between px-3 py-1 bg-[#007ACC] text-[11px] font-mono text-white select-none">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Terminal size={11} /> Ready
                    </span>
                    <span>
                      Ln {resumeCursorPos.line}, Col {resumeCursorPos.col}
                    </span>
                    <span>Spaces: 2</span>
                    <span>UTF-8</span>
                    <span>Markdown (GFM)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline">
                      {resumeEditorValue.split("\n").length} lines · {resumeEditorValue.length} chars
                    </span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">
                      v{activeResumeVersion || 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Version History Timeline */}
            <div className="skeuo-card rounded-2xl border-2 border-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCD5C9] pb-3">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-[#2563EB]" />
                  <h3 className="text-base font-bold text-[#18181B]">
                    Resume Version Snapshots &amp; Checkout History
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={loadResumeVersions}
                  disabled={isLoadingResumeVersions}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#CDC5B7] bg-white px-3 py-1.5 text-xs font-mono font-bold text-[#475569] hover:text-[#1D4ED8] cursor-pointer"
                >
                  <RefreshCw size={12} className={isLoadingResumeVersions ? "animate-spin" : ""} />
                  Reload
                </button>
              </div>

              {resumeVersions.length === 0 ? (
                <div className="text-center py-8 text-xs font-mono text-[#71717A]">
                  No versions recorded yet. Save a version above or upload to initialize.
                </div>
              ) : (
                <div className="space-y-3">
                  {resumeVersions.map((v) => (
                    <div
                      key={v.version}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        v.isActive
                          ? "bg-white border-[#2563EB] shadow-xs ring-2 ring-[#2563EB]/15"
                          : "bg-white/60 hover:bg-white border-[#DCD5C9]"
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-[#F4F8FF] border border-[#BFDBFE] text-[#1E40AF]">
                            v{v.version}
                          </span>
                          {v.isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] border border-[#86EFAC] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#166534]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a] animate-pulse" />
                              ACTIVE LIVE
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#F4F4F5] border border-[#E4E4E7] px-2 py-0.5 text-[10px] font-mono text-[#71717A]">
                              Historic Revision
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-[#71717A]">
                            {new Date(v.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-[#18181B] font-semibold truncate">
                          {v.title}
                        </div>

                        <div className="text-xs font-sans text-[#475569] leading-relaxed">
                          🤖 <span className="font-medium">{v.aiSummary}</span>
                        </div>

                        <div className="text-[10px] font-mono text-[#94A3B8]">
                          SHA-256: {v.checksum.slice(0, 16)}… · Created by {v.createdBy}
                        </div>
                      </div>

                      {/* Version Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
                        {/* Load in Monaco Editor Button */}
                        <button
                          type="button"
                          onClick={() => loadVersionIntoResumeEditor(v.version)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F8FAFC] text-[11px] font-mono font-bold text-[#334155] shadow-xs cursor-pointer"
                          title="Load this revision into Monaco Editor"
                        >
                          <FileEdit size={12} className="text-[#059669]" />
                          <span>Load in Editor</span>
                        </button>

                        {/* Diff with Active Button */}
                        {activeResumeVersion && v.version !== activeResumeVersion && (
                          <button
                            type="button"
                            onClick={() => openDiffModal(v.version, activeResumeVersion, "resume")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F8FAFC] text-[11px] font-mono font-bold text-[#334155] shadow-xs cursor-pointer"
                          >
                            <GitCompare size={12} className="text-[#2563EB]" />
                            <span>Diff vs Active</span>
                          </button>
                        )}

                        {/* Switch Live Version Button (Bi-directional) */}
                        {!v.isActive && (
                          <button
                            type="button"
                            onClick={() => promptSwitchVersion(v.version, "resume")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#2563EB] bg-[#EFF6FF] hover:bg-[#2563EB] hover:text-white text-[11px] font-mono font-bold text-[#1D4ED8] shadow-xs cursor-pointer transition-colors"
                          >
                            <ArrowLeftRight size={12} />
                            <span>
                              {v.version < (activeResumeVersion || 0) ? "Rollback to this" : "Fast-forward to this"}
                            </span>
                          </button>
                        )}

                        {/* Download Menu */}
                        {v.rawFileName && (
                          <a
                            href={`/api/admin/versions/resume/download/${v.version}?format=raw`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F8FAFC] text-[11px] font-mono font-bold text-[#52525B] cursor-pointer"
                            title="Download Raw File"
                          >
                            <Download size={12} />
                            <span>Raw</span>
                          </a>
                        )}

                        <a
                          href={`/api/admin/versions/resume/download/${v.version}?format=markdown`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F8FAFC] text-[11px] font-mono font-bold text-[#52525B] cursor-pointer"
                          title="Download Markdown"
                        >
                          <FileCode size={12} />
                          <span>.md</span>
                        </a>

                        {/* Delete Button (Allowed only on non-active versions) */}
                        {!v.isActive && resumeVersions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteVersionItem(v.version, "resume")}
                            className="p-1.5 rounded-lg border border-[#FECACA] bg-white hover:bg-[#FEF2F2] text-[#B91C1C] cursor-pointer"
                            title="Delete this version"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= PORTFOLIO DATASTORE TAB ================= */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="skeuo-card overflow-hidden rounded-[22px] border-2 border-white p-3 sm:p-4 space-y-3">
              <div className="flex flex-col gap-3 border-b border-[#DCD5C9] pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-[#CFC6B7] bg-[#F4F8FF] px-2.5 py-1.5 text-[11px] font-mono font-bold text-[#1E3A8A]">
                    Datastore Version {portfolioVersion ?? "—"}
                  </span>
                  {portfolioUpdatedAt && (
                    <span className="text-[11px] font-mono text-[#94A3B8]">
                      Updated {new Date(portfolioUpdatedAt).toLocaleString()}
                    </span>
                  )}
                  {status && (
                    <span
                      className={`rounded-md px-2.5 py-1.5 text-[11px] font-mono font-bold ${
                        status.includes("Saved")
                          ? "bg-[#DCFCE7] text-[#047857]"
                          : status.includes("invalid") || status.includes("changed") || status.includes("Unable")
                          ? "bg-[#FEF2F2] text-[#B91C1C]"
                          : "bg-[#FFF7ED] text-[#C2410C]"
                      }`}
                    >
                      {status}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadPortfolioDocument}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#CDC5B7] bg-white px-3 py-2 text-xs font-mono font-bold text-[#475569] shadow-xs transition hover:text-[#1D4ED8]"
                  >
                    <RefreshCw size={14} /> Reload
                  </button>
                  <button
                    type="button"
                    onClick={savePortfolioDocument}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#1D4ED8] bg-gradient-to-b from-[#4B8DF8] via-[#2563EB] to-[#1E54D6] px-3.5 py-2 text-xs font-mono font-bold text-white shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save size={14} /> {isSaving ? "Saving…" : "Save snapshot"}
                  </button>
                </div>
              </div>

              {/* VS Code Studio Editor Container */}
              <div className="rounded-xl border border-[#334155] bg-[#1E1E1E] overflow-hidden shadow-2xl">
                {/* VS Code Window Top Titlebar / Control Deck */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-[#252526] border-b border-[#333333] text-xs font-mono text-[#CCCCCC]">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1E1E1E] border border-[#383838] text-[#38BDF8] font-bold text-[11px] shadow-xs">
                      <FileCode size={13} className="text-[#FBBF24]" /> applicationDataStore.json
                    </span>
                    <span className="hidden sm:inline text-[11px] text-[#858585]">
                      JSON · UTF-8 · 2 Spaces
                    </span>
                    {jsonValidationError ? (
                      <span
                        title={jsonValidationError}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#451A1A] border border-[#7F1D1D] text-[#FCA5A5] text-[11px] max-w-xs truncate"
                      >
                        <AlertCircle size={12} className="shrink-0" /> {jsonValidationError}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#132A1C] border border-[#14532D] text-[#4ADE80] text-[11px]">
                        <Check size={12} /> Valid JSON
                      </span>
                    )}
                  </div>

                  {/* VS Code Controls Palette Toolbar */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      title="Format JSON (Shift+Alt+F / Cmd+Option+F)"
                      onClick={handleFormatDocument}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3E3E42] text-[#D4D4D4] hover:text-white transition cursor-pointer text-[11px]"
                    >
                      <Sparkles size={12} className="text-[#60A5FA]" /> Format
                    </button>
                    <button
                      type="button"
                      title="Find in File (Cmd+F / Ctrl+F)"
                      onClick={handleFindReplace}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3E3E42] text-[#D4D4D4] hover:text-white transition cursor-pointer text-[11px]"
                    >
                      <Search size={12} className="text-[#34D399]" /> Find
                    </button>
                    <button
                      type="button"
                      title="Toggle Minimap"
                      onClick={() => setShowMinimap(!showMinimap)}
                      className={`px-2.5 py-1 rounded transition cursor-pointer text-[11px] font-semibold ${
                        showMinimap
                          ? "bg-[#0E639C] text-white"
                          : "bg-[#333333] hover:bg-[#3E3E42] text-[#858585]"
                      }`}
                    >
                      Minimap
                    </button>
                    <button
                      type="button"
                      title="Toggle Word Wrap"
                      onClick={() => setWordWrap(!wordWrap)}
                      className={`px-2.5 py-1 rounded transition cursor-pointer text-[11px] font-semibold ${
                        wordWrap
                          ? "bg-[#0E639C] text-white"
                          : "bg-[#333333] hover:bg-[#3E3E42] text-[#858585]"
                      }`}
                    >
                      Wrap
                    </button>
                    <button
                      type="button"
                      title="Toggle VS Code Theme"
                      onClick={() =>
                        setEditorTheme(editorTheme === "vs-dark" ? "light" : "vs-dark")
                      }
                      className="px-2.5 py-1 rounded bg-[#333333] hover:bg-[#3E3E42] text-[#D4D4D4] hover:text-white transition cursor-pointer text-[11px]"
                    >
                      {editorTheme === "vs-dark" ? "🌙 Dark" : "☀️ Light"}
                    </button>
                    <button
                      type="button"
                      title="Trigger VS Code Command Palette (F1)"
                      onClick={handleOpenCommandPalette}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#0E639C] hover:bg-[#1177BB] text-white font-bold transition cursor-pointer text-[11px] shadow-xs"
                    >
                      <Terminal size={12} /> Command Palette (F1)
                    </button>
                  </div>
                </div>

                {/* Monaco Code Editor Canvas */}
                <div className="h-[66vh] w-full bg-[#1E1E1E]">
                  <Editor
                    height="100%"
                    language="json"
                    theme={editorTheme}
                    value={editorValue}
                    onChange={(val) => {
                      const text = val || "";
                      setEditorValue(text);
                      validateJsonContent(text);
                    }}
                    onMount={(editor, monaco) => {
                      editorRef.current = editor;
                      monacoRef.current = monaco;

                      editor.onDidChangeCursorPosition((e) => {
                        setCursorPos({
                          line: e.position.lineNumber,
                          col: e.position.column,
                        });
                      });
                    }}
                    options={{
                      minimap: { enabled: showMinimap },
                      lineNumbers: "on",
                      wordWrap: wordWrap ? "on" : "off",
                      folding: true,
                      automaticLayout: true,
                      tabSize: 2,
                      fontSize: 13,
                      scrollBeyondLastLine: false,
                      cursorBlinking: "smooth",
                      smoothScrolling: true,
                      contextmenu: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      renderLineHighlight: "all",
                    }}
                  />
                </div>

                {/* VS Code Bottom Status Bar */}
                <div className="flex items-center justify-between px-3.5 py-1 bg-[#007ACC] text-white text-[11px] font-mono select-none">
                  <div className="flex items-center gap-4">
                    <span className="font-bold flex items-center gap-1">
                      ⚡ VS Code Engine
                    </span>
                    <span className="hidden md:inline opacity-85">
                      F1: Command Palette
                    </span>
                    <span className="hidden md:inline opacity-85">
                      ⌥⇧F: Format
                    </span>
                    <span className="hidden md:inline opacity-85">
                      ⌘F: Find
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>
                      Ln {cursorPos.line}, Col {cursorPos.col}
                    </span>
                    <span className="font-bold">JSON</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Version History Timeline */}
            <div className="skeuo-card rounded-2xl border-2 border-white p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#DCD5C9] pb-3">
                <div className="flex items-center gap-2">
                  <History size={18} className="text-[#2563EB]" />
                  <h3 className="text-base font-bold text-[#18181B]">
                    Portfolio Version Snapshots &amp; Checkout History
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={loadPortfolioDocument}
                  disabled={isLoadingPortfolioVersions}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#CDC5B7] bg-white px-3 py-1.5 text-xs font-mono font-bold text-[#475569] hover:text-[#1D4ED8] cursor-pointer"
                >
                  <RefreshCw size={12} className={isLoadingPortfolioVersions ? "animate-spin" : ""} />
                  Reload
                </button>
              </div>

              {portfolioVersions.length === 0 ? (
                <div className="text-center py-8 text-xs font-mono text-[#71717A]">
                  No versions recorded yet. Save a snapshot above to initialize.
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolioVersions.map((v) => (
                    <div
                      key={v.version}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        v.isActive
                          ? "bg-white border-[#2563EB] shadow-xs ring-2 ring-[#2563EB]/15"
                          : "bg-white/60 hover:bg-white border-[#DCD5C9]"
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-[#F4F8FF] border border-[#BFDBFE] text-[#1E40AF]">
                            v{v.version}
                          </span>
                          {v.isActive ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] border border-[#86EFAC] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#166534]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a] animate-pulse" />
                              ACTIVE LIVE
                            </span>
                          ) : (
                            <span className="rounded-full bg-[#F4F4F5] border border-[#E4E4E7] px-2 py-0.5 text-[10px] font-mono text-[#71717A]">
                              Historic Revision
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-[#71717A]">
                            {new Date(v.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-[#18181B] font-semibold truncate">
                          {v.title}
                        </div>

                        <div className="text-xs font-sans text-[#475569] leading-relaxed">
                          🤖 <span className="font-medium">{v.aiSummary}</span>
                        </div>

                        <div className="text-[10px] font-mono text-[#94A3B8]">
                          SHA-256: {v.checksum.slice(0, 16)}… · Created by {v.createdBy}
                        </div>
                      </div>

                      {/* Version Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
                        {/* Load in Monaco Editor Button */}
                        <button
                          type="button"
                          onClick={() => loadVersionIntoPortfolioEditor(v.version)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F8FAFC] text-[11px] font-mono font-bold text-[#334155] shadow-xs cursor-pointer"
                          title="Load this revision into Monaco Editor"
                        >
                          <FileEdit size={12} className="text-[#059669]" />
                          <span>Load in Editor</span>
                        </button>

                        {/* Diff with Active Button */}
                        {portfolioVersion && v.version !== portfolioVersion && (
                          <button
                            type="button"
                            onClick={() => openDiffModal(v.version, portfolioVersion, "portfolio")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F8FAFC] text-[11px] font-mono font-bold text-[#334155] shadow-xs cursor-pointer"
                          >
                            <GitCompare size={12} className="text-[#2563EB]" />
                            <span>Diff vs Active</span>
                          </button>
                        )}

                        {/* Switch Live Version Button (Bi-directional) */}
                        {!v.isActive && (
                          <button
                            type="button"
                            onClick={() => promptSwitchVersion(v.version, "portfolio")}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#2563EB] bg-[#EFF6FF] hover:bg-[#2563EB] hover:text-white text-[11px] font-mono font-bold text-[#1D4ED8] shadow-xs cursor-pointer transition-colors"
                          >
                            <ArrowLeftRight size={12} />
                            <span>
                              {v.version < (portfolioVersion || 0) ? "Rollback to this" : "Fast-forward to this"}
                            </span>
                          </button>
                        )}

                        {/* Download JSON Snapshot */}
                        <a
                          href={`/api/admin/versions/portfolio/download/${v.version}?format=json`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F8FAFC] text-[11px] font-mono font-bold text-[#52525B] cursor-pointer"
                          title="Download JSON Snapshot"
                        >
                          <Download size={12} />
                          <span>JSON</span>
                        </a>

                        {/* Delete Button (Allowed only on non-active versions) */}
                        {!v.isActive && portfolioVersions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteVersionItem(v.version, "portfolio")}
                            className="p-1.5 rounded-lg border border-[#FECACA] bg-white hover:bg-[#FEF2F2] text-[#B91C1C] cursor-pointer"
                            title="Delete this version"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= GIT-BASED DIFF VIEWER MODAL ================= */}
      {diffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl bg-[#FAF8F3] border-2 border-white shadow-2xl overflow-hidden paper-grain">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#DCD5C9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <GitCompare size={18} className="text-[#2563EB]" />
                  <h3 className="text-base font-bold text-[#18181B] truncate">
                    Git Diff Inspector: v{diffData?.fromVersion} ⟷ v{diffData?.toVersion}
                  </h3>
                </div>
                <div className="text-xs text-[#52525B]">
                  {diffData?.docType === "portfolio"
                    ? "Comparing canonical JSON datastore snapshots using Myers LCS algorithm."
                    : "Comparing canonical Markdown documents using Myers LCS algorithm."}
                </div>
              </div>

              {/* View Switcher, Theme & Close */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="p-1 rounded-xl bg-[#F1ECE1] border border-[#DCD5C9] flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDiffViewMode("split")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                      diffViewMode === "split"
                        ? "bg-white text-[#18181B] shadow-xs"
                        : "text-[#52525B] hover:text-[#18181B]"
                    }`}
                  >
                    Split (Side-by-Side)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiffViewMode("unified")}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
                      diffViewMode === "unified"
                        ? "bg-white text-[#18181B] shadow-xs"
                        : "text-[#52525B] hover:text-[#18181B]"
                    }`}
                  >
                    Unified (Inline)
                  </button>
                </div>

                <button
                  type="button"
                  title="Toggle Diff Viewer Theme"
                  onClick={() =>
                    setDiffTheme(diffTheme === "vs-dark" ? "light" : "vs-dark")
                  }
                  className="px-2.5 py-1.5 rounded-lg border border-[#DCD5C9] bg-white hover:bg-[#F4F4F5] text-xs font-mono text-[#3F3F46] cursor-pointer"
                >
                  {diffTheme === "vs-dark" ? "🌙 Dark" : "☀️ Light"}
                </button>

                {diffData && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#059669] font-bold">
                      +{diffData.diff.stats.additions}
                    </span>
                    <span className="text-[#DC2626] font-bold">
                      -{diffData.diff.stats.deletions}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setDiffModalOpen(false)}
                  className="p-1.5 rounded-lg border border-[#DCD5C9] hover:bg-[#F4F4F5] text-[#52525B] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* 1-Line AI Executive Summary Banner */}
            {diffData?.aiSummary && (
              <div className="px-5 py-3 bg-[#EFF6FF] border-b border-[#BFDBFE] text-xs font-sans text-[#1E40AF] flex items-center gap-2 shrink-0">
                <Sparkles size={15} className="text-[#2563EB] shrink-0" />
                <span>
                  <strong>AI Executive Summary:</strong> {diffData.aiSummary}
                </span>
              </div>
            )}

            {/* Diff Body Content — VS Code Monaco Diff Engine */}
            <div className="flex-1 min-h-[58vh] max-h-[72vh] w-full bg-[#1E1E1E] overflow-hidden flex flex-col">
              {diffLoading ? (
                <div className="flex-1 flex items-center justify-center py-20 gap-2 text-[#94A3B8]">
                  <Loader2 size={18} className="animate-spin text-[#38BDF8]" />
                  <span>Computing Git diff and AI impact summary...</span>
                </div>
              ) : !diffData ? (
                <div className="flex-1 flex items-center justify-center py-20 text-[#71717A]">
                  No diff data loaded.
                </div>
              ) : (
                <DiffEditor
                  height="100%"
                  language={diffData.docType === "resume" ? "markdown" : "json"}
                  theme={diffTheme}
                  original={diffData.fromContent || ""}
                  modified={diffData.toContent || ""}
                  options={{
                    renderSideBySide: diffViewMode === "split",
                    readOnly: true,
                    automaticLayout: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    diffWordWrap: "on",
                    lineNumbers: "on",
                    renderIndicators: true,
                    originalEditable: false,
                    folding: true,
                  }}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white flex items-center justify-between gap-3 shrink-0">
              <div className="text-xs font-mono text-[#52525B]">
                {diffData &&
                (diffData.docType === "resume"
                  ? diffData.fromVersion !== activeResumeVersion
                  : diffData.fromVersion !== portfolioVersion) ? (
                  <span>
                    Viewing delta between Version {diffData.fromVersion} and Version {diffData.toVersion}.
                  </span>
                ) : (
                  <span>Inspection mode active.</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {diffData &&
                  (diffData.docType === "resume"
                    ? diffData.fromVersion !== activeResumeVersion
                    : diffData.fromVersion !== portfolioVersion) && (
                    <button
                      type="button"
                      onClick={() => {
                        promptSwitchVersion(diffData.fromVersion, diffData.docType);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold shadow-xs cursor-pointer"
                    >
                      <ArrowLeftRight size={13} />
                      <span>Switch Live Version to v{diffData.fromVersion}</span>
                    </button>
                  )}
                <button
                  type="button"
                  onClick={() => setDiffModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCD5C9] bg-white text-xs font-mono font-bold text-[#52525B] cursor-pointer hover:bg-[#F4F4F5]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SWITCH CONFIRMATION MODAL ================= */}
      {switchConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white border-2 border-white shadow-2xl p-6 space-y-4 paper-grain">
            <div className="flex items-center gap-3 border-b border-[#DCD5C9] pb-3">
              <div className="p-2.5 rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <ArrowLeftRight size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#18181B]">
                  Confirm Live Version Checkout (v{targetSwitchVersion})
                </h3>
                <p className="text-xs text-[#52525B]">
                  This updates the live ground truth connected directly to your AI Twin assistant.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#C9A673]/60 space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#92400E] font-bold flex items-center gap-1">
                <Sparkles size={13} />
                <span>One-Line AI Impact Analysis</span>
              </div>
              <p className="text-xs text-[#18181B] leading-relaxed font-sans font-medium">
                {switchAiSummary}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSwitchConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#DCD5C9] bg-white text-xs font-mono font-bold text-[#52525B] cursor-pointer hover:bg-[#F4F4F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSwitchVersion}
                disabled={isSwitching}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-mono font-bold shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSwitching ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                <span>Activate Version v{targetSwitchVersion}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
