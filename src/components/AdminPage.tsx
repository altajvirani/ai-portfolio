import React, { useEffect, useState } from "react";
import { ArrowLeft, Braces, ChevronDown, ChevronRight, Database, LockKeyhole, LogIn, Plus, ShieldCheck, Sparkles, Trash2 } from "lucide-react";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
type JsonPath = (string | number)[];

type AdminDocumentResponse = {
  document: unknown;
  version: number;
  updatedAt: string;
  updatedBy: string;
  actor: { email: string };
};

function getCsrfToken() {
  return document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("admin_csrf="))
    ?.split("=")
    .slice(1)
    .join("=");
}

function isJsonValue(value: unknown): value is JsonValue {
  return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean"
    || Array.isArray(value) || (typeof value === "object" && value !== null);
}

function updateAtPath(value: JsonValue, path: JsonPath, next: JsonValue): JsonValue {
  if (path.length === 0) return next;
  const [key, ...rest] = path;
  if (Array.isArray(value)) {
    const copy = [...value];
    copy[key as number] = updateAtPath(copy[key as number], rest, next);
    return copy;
  }
  const copy = { ...value as { [key: string]: JsonValue } };
  copy[key as string] = updateAtPath(copy[key as string], rest, next);
  return copy;
}

function deleteAtPath(value: JsonValue, path: JsonPath): JsonValue {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  if (rest.length === 0) {
    if (Array.isArray(value)) return value.filter((_, index) => index !== key);
    const copy = { ...value as { [key: string]: JsonValue } };
    delete copy[key as string];
    return copy;
  }
  if (Array.isArray(value)) {
    const copy = [...value];
    copy[key as number] = deleteAtPath(copy[key as number], rest);
    return copy;
  }
  const copy = { ...value as { [key: string]: JsonValue } };
  copy[key as string] = deleteAtPath(copy[key as string], rest);
  return copy;
}

function defaultForType(type: string): JsonValue {
  if (type === "object") return {};
  if (type === "array") return [];
  if (type === "number") return 0;
  if (type === "boolean") return false;
  if (type === "null") return null;
  return "";
}

type JsonFormProps = {
  label: string;
  value: JsonValue;
  path: JsonPath;
  onChange: (path: JsonPath, value: JsonValue) => void;
  onDelete?: (path: JsonPath) => void;
  isRoot?: boolean;
};

const JsonForm: React.FC<JsonFormProps> = ({ label, value, path, onChange, onDelete, isRoot = false }) => {
  const [expanded, setExpanded] = useState(true);
  const isContainer = Array.isArray(value) || (typeof value === "object" && value !== null);
  const type = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;

  const changeType = (nextType: string) => onChange(path, defaultForType(nextType));
  const updatePrimitive = (next: string | boolean) => {
    if (typeof value === "number") onChange(path, Number(next));
    else if (typeof value === "boolean") onChange(path, next as boolean);
    else onChange(path, next as string);
  };

  return (
    <div className={`${isRoot ? "" : "border-l border-slate-800 pl-4"} space-y-2`}>
      <div className="flex flex-wrap items-center gap-2">
        {isContainer && (
          <button type="button" onClick={() => setExpanded(!expanded)} className="text-slate-500 hover:text-cyan-300" aria-label={`${expanded ? "Collapse" : "Expand"} ${label}`}>
            {expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
        )}
        <label className="min-w-32 text-xs font-mono font-semibold text-cyan-300">{label}</label>
        <select
          value={type}
          onChange={(event) => changeType(event.target.value)}
          className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-300 outline-none focus:border-cyan-400"
          aria-label={`Type of ${label}`}
        >
          {["object", "array", "string", "number", "boolean", "null"].map((option) => <option key={option}>{option}</option>)}
        </select>
        {!isRoot && onDelete && (
          <button type="button" onClick={() => onDelete(path)} className="ml-auto text-slate-600 hover:text-rose-300" aria-label={`Delete ${label}`}>
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {expanded && isContainer && (
        <div className="space-y-3">
          {Array.isArray(value)
            ? value.map((child, index) => (
              <JsonForm key={index} label={`[${index}]`} value={child} path={[...path, index]} onChange={onChange} onDelete={onDelete} />
            ))
            : Object.entries(value).map(([key, child]) => (
              <JsonForm key={key} label={key} value={child} path={[...path, key]} onChange={onChange} onDelete={onDelete} />
            ))}
          <button
            type="button"
            onClick={() => {
              const next = Array.isArray(value) ? [...value, ""] : { ...value, [`newField${Object.keys(value).length + 1}`]: "" };
              onChange(path, next);
            }}
            className="inline-flex items-center gap-1 rounded border border-dashed border-slate-700 px-2 py-1 text-[11px] font-mono text-slate-400 hover:border-cyan-400 hover:text-cyan-300"
          >
            <Plus size={13} /> Add {Array.isArray(value) ? "item" : "field"}
          </button>
        </div>
      )}

      {expanded && !isContainer && type !== "null" && (
        typeof value === "boolean" ? (
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input type="checkbox" checked={value} onChange={(event) => updatePrimitive(event.target.checked)} className="accent-cyan-400" />
            {value ? "true" : "false"}
          </label>
        ) : (
          <input
            type={type === "number" ? "number" : "text"}
            value={String(value)}
            onChange={(event) => updatePrimitive(event.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-[#080c14] px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
          />
        )
      )}
    </div>
  );
};

const UnauthorizedScreen: React.FC = () => (
  <main className="relative min-h-screen overflow-hidden bg-[#080c14] px-5 py-12 text-slate-100">
    <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-violet-500/15 blur-3xl" />
    <div className="relative mx-auto max-w-3xl">
      <a href="/" className="mb-12 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300"><ArrowLeft size={14} /> Return to portfolio</a>
      <div className="grid overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/85 shadow-2xl shadow-cyan-950/20 md:grid-cols-[1.1fr_.9fr]">
        <div className="p-8 md:p-12">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-950/30">
            <LockKeyhole size={30} />
          </div>
          <p className="mb-3 text-xs font-mono uppercase tracking-[0.3em] text-cyan-400">Restricted workspace</p>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white">This room is private.</h1>
          <p className="max-w-md text-sm leading-7 text-slate-400">
            The portfolio datastore is sealed behind Google SSO. Only accounts on the administrator allowlist can enter, edit, or even load its contents.
          </p>
          <a href="/api/auth/google/start" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300">
            <LogIn size={17} /> Continue with Google
          </a>
        </div>
        <div className="flex flex-col justify-between border-t border-slate-800 bg-gradient-to-br from-slate-900 to-[#10172a] p-8 md:border-l md:border-t-0 md:p-10">
          <div>
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-white"><ShieldCheck size={18} className="text-emerald-400" /> Access controls active</div>
            <div className="space-y-4 text-xs text-slate-400">
              <div className="flex gap-3"><Database size={16} className="shrink-0 text-cyan-300" /><span>Independent JSON datastore, separate from the public site.</span></div>
              <div className="flex gap-3"><Sparkles size={16} className="shrink-0 text-violet-300" /><span>Changes are versioned and recorded in an audit trail.</span></div>
              <div className="flex gap-3"><LockKeyhole size={16} className="shrink-0 text-amber-300" /><span>Unauthorized visitors never receive the datastore.</span></div>
            </div>
          </div>
          <p className="mt-10 text-[11px] font-mono uppercase tracking-widest text-slate-600">ADMIN / AUTH_REQUIRED</p>
        </div>
      </div>
    </div>
  </main>
);

export const AdminPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [documentValue, setDocumentValue] = useState<JsonValue | null>(null);
  const [version, setVersion] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"form" | "code">("form");

  const loadDocument = async () => {
    setStatus("Loading datastore...");
    const response = await fetch("/api/admin/data", { credentials: "same-origin" });
    const data = (await response.json()) as AdminDocumentResponse & { error?: string };
    if (!response.ok) {
      setStatus(data.error || "Unable to load the datastore.");
      return;
    }
    if (!isJsonValue(data.document)) {
      setStatus("The datastore returned an unsupported value.");
      return;
    }
    setAuthenticated(true);
    setEmail(data.actor.email);
    setVersion(data.version);
    setUpdatedAt(data.updatedAt);
    setDocumentValue(data.document);
    setEditorValue(JSON.stringify(data.document, null, 2));
    setStatus("");
  };

  useEffect(() => {
    fetch("/api/auth/session", { credentials: "same-origin" })
      .then(async (response) => {
        const data = (await response.json()) as { authenticated: boolean; email?: string };
        setAuthenticated(data.authenticated);
        if (data.email) setEmail(data.email);
        if (data.authenticated) await loadDocument();
      })
      .catch(() => setStatus("Unable to reach the admin service."));
  }, []);

  const updateFormValue = (path: JsonPath, value: JsonValue) => {
    if (documentValue === null) return;
    const next = updateAtPath(documentValue, path, value);
    setDocumentValue(next);
    setEditorValue(JSON.stringify(next, null, 2));
  };

  const deleteFormValue = (path: JsonPath) => {
    if (documentValue === null || path.length === 0) return;
    const next = deleteAtPath(documentValue, path);
    setDocumentValue(next);
    setEditorValue(JSON.stringify(next, null, 2));
  };

  const switchToForm = () => {
    try {
      const parsed = JSON.parse(editorValue);
      if (!isJsonValue(parsed)) throw new Error();
      setDocumentValue(parsed);
      setViewMode("form");
      setStatus("");
    } catch {
      setStatus("Fix the JSON syntax before switching to form view.");
    }
  };

  const saveDocument = async () => {
    if (version === null) return;
    let valueToSave: unknown;
    try {
      valueToSave = JSON.parse(editorValue);
    } catch {
      setStatus("The editor contains invalid JSON.");
      return;
    }
    setIsSaving(true);
    setStatus("Saving...");
    try {
      const response = await fetch("/api/admin/data", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": getCsrfToken() || "" },
        body: JSON.stringify({ document: valueToSave, version }),
      });
      const data = (await response.json()) as AdminDocumentResponse & { error?: string };
      if (!response.ok) {
        setStatus(data.error || "Unable to save the datastore.");
        return;
      }
      if (isJsonValue(data.document)) setDocumentValue(data.document);
      setVersion(data.version);
      setUpdatedAt(data.updatedAt);
      setEditorValue(JSON.stringify(data.document, null, 2));
      setStatus("Saved successfully.");
    } catch {
      setStatus("Unable to reach the admin service.");
    } finally {
      setIsSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    window.location.reload();
  };

  if (authenticated === null) return <main className="min-h-screen bg-[#0d131f] p-8 text-slate-200">Checking access...</main>;
  if (!authenticated) return <UnauthorizedScreen />;

  return (
    <main className="min-h-screen bg-[#0d131f] px-5 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400"><Braces size={14} /> Private admin</p>
            <h1 className="text-3xl font-bold text-white">Portfolio datastore</h1>
            <p className="mt-2 text-sm text-slate-400">Signed in as {email}. This data is not used by the public portfolio.</p>
          </div>
          <button type="button" onClick={logout} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-mono text-slate-300 hover:border-cyan-400 hover:text-white">Sign out</button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono text-slate-400">Version {version ?? "—"} {updatedAt && `· Updated ${new Date(updatedAt).toLocaleString()}`}</span>
            <div className="flex flex-wrap items-center gap-2">
              {status && <span className="mr-2 text-xs text-slate-300">{status}</span>}
              <div className="flex rounded-lg border border-slate-700 p-1">
                <button type="button" onClick={switchToForm} className={`rounded px-3 py-1.5 text-xs font-mono ${viewMode === "form" ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:text-white"}`}>Form view</button>
                <button type="button" onClick={() => setViewMode("code")} className={`rounded px-3 py-1.5 text-xs font-mono ${viewMode === "code" ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:text-white"}`}>JSON code</button>
              </div>
              <button type="button" onClick={loadDocument} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-mono text-slate-300 hover:border-cyan-400 hover:text-white">Reload</button>
              <button type="button" onClick={saveDocument} disabled={isSaving} className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-mono font-bold text-slate-950 disabled:opacity-50">{isSaving ? "Saving..." : "Save datastore"}</button>
            </div>
          </div>

          {viewMode === "form" && documentValue !== null ? (
            <div className="min-h-[70vh] rounded-xl border border-slate-800 bg-[#080c14] p-5">
              <div className="mb-5 flex items-center gap-2 border-b border-slate-800 pb-4 text-xs text-slate-400"><Database size={15} className="text-cyan-300" /> Structured editor · changes mirror the JSON code view</div>
              <JsonForm label="datastore" value={documentValue} path={[]} onChange={updateFormValue} onDelete={deleteFormValue} isRoot />
            </div>
          ) : (
            <textarea
              value={editorValue}
              onChange={(event) => setEditorValue(event.target.value)}
              spellCheck={false}
              aria-label="Portfolio datastore JSON"
              className="min-h-[70vh] w-full resize-y rounded-xl border border-slate-800 bg-[#080c14] p-4 font-mono text-xs leading-relaxed text-slate-200 outline-none focus:border-cyan-400"
            />
          )}
        </div>
      </div>
    </main>
  );
};
