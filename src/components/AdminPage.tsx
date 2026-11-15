import React, { useEffect, useState } from "react";
import { ArrowLeft, Braces, Database, LockKeyhole, LogIn, ShieldCheck, Sparkles } from "lucide-react";

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
  const [version, setVersion] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState("");
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadDocument = async () => {
    setStatus("Loading datastore...");
    const response = await fetch("/api/admin/data", { credentials: "same-origin" });
    const data = (await response.json()) as AdminDocumentResponse & { error?: string };
    if (!response.ok) {
      setStatus(data.error || "Unable to load the datastore.");
      return;
    }
    setAuthenticated(true);
    setEmail(data.actor.email);
    setVersion(data.version);
    setUpdatedAt(data.updatedAt);
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
              <button type="button" onClick={loadDocument} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-mono text-slate-300 hover:border-cyan-400 hover:text-white">Reload</button>
              <button type="button" onClick={saveDocument} disabled={isSaving} className="rounded-lg bg-cyan-400 px-3 py-2 text-xs font-mono font-bold text-slate-950 disabled:opacity-50">{isSaving ? "Saving..." : "Save datastore"}</button>
            </div>
          </div>

          <textarea
            value={editorValue}
            onChange={(event) => setEditorValue(event.target.value)}
            spellCheck={false}
            aria-label="Portfolio datastore JSON"
            className="min-h-[70vh] w-full resize-y rounded-xl border border-slate-800 bg-[#080c14] p-4 font-mono text-xs leading-relaxed text-slate-200 outline-none focus:border-cyan-400"
          />
        </div>
      </div>
    </main>
  );
};
