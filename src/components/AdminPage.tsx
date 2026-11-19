import React, { useEffect, useState } from "react";
import { ArrowLeft, Braces, CheckCircle2, Database, LockKeyhole, LogIn, LogOut, RefreshCw, Save, ShieldCheck, Sparkles } from "lucide-react";

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
            The portfolio datastore is sealed behind Google SSO. Only allowlisted administrators can load or edit its contents.
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
              <div className="flex gap-3 text-xs leading-5 text-[#52525B]"><Database size={16} className="shrink-0 text-[#2563EB]" /><span>Independent datastore, separate from public portfolio rendering.</span></div>
              <div className="flex gap-3 text-xs leading-5 text-[#52525B]"><Sparkles size={16} className="shrink-0 text-[#7C3AED]" /><span>Optimistic versions and a production audit trail.</span></div>
              <div className="flex gap-3 text-xs leading-5 text-[#52525B]"><LockKeyhole size={16} className="shrink-0 text-[#D97706]" /><span>Unauthorized visitors never receive the document.</span></div>
            </div>
          </div>
          <p className="mt-10 text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#94A3B8]">ADMIN / AUTH_REQUIRED</p>
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

  if (authenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] px-5 paper-grain text-[#18181B]">
        <div className="skeuo-card rounded-2xl px-6 py-5 text-sm font-mono font-bold text-[#475569]">
          <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-[#2563EB]" />
          Checking access…
        </div>
      </main>
    );
  }
  if (!authenticated) return <UnauthorizedScreen />;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EE] px-3 py-5 text-[#18181B] paper-grain sm:px-6 sm:py-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 airmail-border" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-6">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#2563EB]"><Braces size={14} /> Private admin</p>
            <h1 className="text-3xl font-black tracking-tight text-[#18181B] sm:text-4xl">Portfolio datastore</h1>
            <p className="mt-2 flex items-center gap-2 text-xs text-[#64748B]"><CheckCircle2 size={14} className="text-[#059669]" /> Signed in as <span className="font-mono font-bold text-[#475569]">{email}</span></p>
          </div>
          <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-lg border border-[#CDC5B7] bg-white px-3.5 py-2 text-xs font-mono font-bold text-[#475569] shadow-[0_2px_5px_rgba(24,24,27,0.08)] transition hover:-translate-y-0.5 hover:border-[#2563EB]/50 hover:text-[#1D4ED8]">
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <div className="skeuo-card overflow-hidden rounded-[22px] border-2 border-white p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-3 border-b border-[#DCD5C9] pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#CFC6B7] bg-[#F4F8FF] px-2.5 py-1.5 text-[11px] font-mono font-bold text-[#1E3A8A]">Version {version ?? "—"}</span>
              {updatedAt && <span className="text-[11px] font-mono text-[#94A3B8]">Updated {new Date(updatedAt).toLocaleString()}</span>}
              {status && (
                <span className={`rounded-md px-2.5 py-1.5 text-[11px] font-mono font-bold ${status.includes("Saved") ? "bg-[#DCFCE7] text-[#047857]" : status.includes("invalid") || status.includes("changed") || status.includes("Unable") ? "bg-[#FEF2F2] text-[#B91C1C]" : "bg-[#FFF7ED] text-[#C2410C]"}`}>
                  {status}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={loadDocument} className="inline-flex items-center gap-2 rounded-lg border border-[#CDC5B7] bg-white px-3 py-2 text-xs font-mono font-bold text-[#475569] shadow-[0_2px_5px_rgba(24,24,27,0.08)] transition hover:-translate-y-0.5 hover:border-[#2563EB]/50 hover:text-[#1D4ED8]">
                <RefreshCw size={14} /> Reload
              </button>
              <button type="button" onClick={saveDocument} disabled={isSaving} className="inline-flex items-center gap-2 rounded-lg border border-[#1D4ED8] bg-gradient-to-b from-[#4B8DF8] via-[#2563EB] to-[#1E54D6] px-3.5 py-2 text-xs font-mono font-bold text-white shadow-[0_6px_14px_-6px_rgba(37,99,235,0.65)] disabled:cursor-not-allowed disabled:opacity-50">
                <Save size={14} /> {isSaving ? "Saving…" : "Save datastore"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-[#D8D0C1] bg-[#F4F8FF] p-1.5 paper-grid-cobalt">
            <textarea
              value={editorValue}
              onChange={(event) => setEditorValue(event.target.value)}
              spellCheck={false}
              aria-label="Portfolio datastore JSON"
              className="min-h-[68vh] w-full resize-y rounded-lg border border-[#DCD5C9] bg-[#FFFDF8] p-4 font-mono text-[12px] leading-6 text-[#1E293B] outline-none shadow-[inset_0_2px_5px_rgba(24,24,27,0.06)] focus:border-[#2563EB] focus:ring-2 focus:ring-[#BFDBFE]"
            />
          </div>
        </div>
      </div>
    </main>
  );
};
