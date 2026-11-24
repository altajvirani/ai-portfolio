import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
import {
  consumeOAuthState,
  createOAuthState,
  createSession,
  deleteSession,
  getDocument,
  getSession,
  updateDocument,
  validateDocument,
  type AdminSession,
} from "./adminStore.ts";
import {
  listVersions,
  getVersion,
  getActiveDocument,
  createVersion,
  switchVersion,
  deleteVersion,
  compareVersions,
  getAuditLogs,
  recordAuditLog,
  type DocumentType,
  getDraft,
  saveDraft,
  discardDraft,
  commitDraft,
  publishVersion,
} from "./versionEngine.ts";
import { formatMarkdown } from "./resumeValidator.ts";
import { exchangeGoogleCode, getGoogleAdminConfig } from "./adminAuth.ts";

dotenv.config({ path: ".env.local" });
dotenv.config();

const defaultRedirectUri = "http://127.0.0.1:8787/mcp/oauth/callback";
let sessionToken: string | undefined;
let session: AdminSession | undefined;

function mcpResult(value: unknown) {
  return {
    content: [{ type: "text" as const, text: typeof value === "string" ? value : JSON.stringify(value, null, 2) }],
  };
}

function mcpError(error: unknown) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: error instanceof Error ? error.message : "MCP request failed." }],
  };
}

async function requireSession() {
  if (!sessionToken) throw new Error("Authenticate first with the authenticate_portfolio tool.");
  session = await getSession(sessionToken);
  if (!session) {
    sessionToken = undefined;
    throw new Error("The portfolio session expired. Authenticate again.");
  }
  return session;
}

function callbackLocation() {
  return process.env.MCP_GOOGLE_REDIRECT_URI || defaultRedirectUri;
}

function writeCallbackResponse(response: ServerResponse, status: number, message: string) {
  response.writeHead(status, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
  response.end(`<html><body><h1>${message}</h1><p>You can close this tab and return to your MCP client.</p></body></html>`);
}

async function handleOAuthCallback(request: IncomingMessage, response: ServerResponse) {
  try {
    const requestUrl = new URL(request.url || "/", callbackLocation());
    const code = requestUrl.searchParams.get("code");
    const state = requestUrl.searchParams.get("state");
    if (!code || !state) {
      writeCallbackResponse(response, 400, "Invalid OAuth request.");
      return;
    }
    const codeVerifier = await consumeOAuthState(state);
    if (!codeVerifier) {
      writeCallbackResponse(response, 400, "Expired OAuth request.");
      return;
    }
    const profile = await exchangeGoogleCode(code, codeVerifier, callbackLocation());
    const created = await createSession(profile.subject, profile.email);
    sessionToken = created.token;
    session = await getSession(created.token);
    writeCallbackResponse(response, 200, "Portfolio authentication complete.");
  } catch (error) {
    console.error("MCP OAuth callback error:", error);
    writeCallbackResponse(response, 401, "Portfolio authentication failed.");
  }
}

function startOAuthCallbackServer() {
  const callbackUrl = new URL(callbackLocation());
  if (callbackUrl.protocol !== "http:" || !callbackUrl.hostname || !callbackUrl.port) {
    throw new Error("MCP_GOOGLE_REDIRECT_URI must be an explicit local http URL with a port.");
  }
  const server = createServer((request, response) => {
    if (new URL(request.url || "/", callbackUrl).pathname !== callbackUrl.pathname) {
      writeCallbackResponse(response, 404, "Not found.");
      return;
    }
    void handleOAuthCallback(request, response);
  });
  server.listen(Number(callbackUrl.port), callbackUrl.hostname);
  return server;
}

const mcpServer = new McpServer({
  name: "ai-portfolio",
  version: "1.0.0",
});

mcpServer.registerTool(
  "authenticate_portfolio",
  {
    description: "Start Google authentication for an allowlisted portfolio administrator.",
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const { clientId } = getGoogleAdminConfig();
      const { state, codeVerifier } = await createOAuthState();
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.search = new URLSearchParams({
        client_id: clientId,
        redirect_uri: callbackLocation(),
        response_type: "code",
        scope: "openid email profile",
        state,
        code_challenge: Buffer.from(await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(codeVerifier),
        )).toString("base64url"),
        code_challenge_method: "S256",
        prompt: "select_account",
      }).toString();
      return mcpResult({
        authorizationUrl: authUrl.toString(),
        instructions: "Open authorizationUrl in a browser. The MCP server will receive the callback and authorize only an account listed in ADMIN_GOOGLE_EMAILS.",
      });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "save_draft",
  {
    description: "Save or update a working draft on top of a specific base version without committing or publishing it.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
      baseVersion: z.number().int().positive(),
      contentText: z.string(),
      title: z.string().optional(),
    }),
  },
  async ({ docType, baseVersion, contentText, title }) => {
    try {
      const actor = await requireSession();
      const draft = await saveDraft(docType, {
        baseVersion,
        contentText,
        title,
        authorEmail: actor.email,
      });
      return mcpResult({ ok: true, draft, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "get_draft",
  {
    description: "Fetch the active working draft for the authenticated administrator.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
    }),
  },
  async ({ docType }) => {
    try {
      const actor = await requireSession();
      const draft = await getDraft(docType, actor.email);
      return mcpResult({ docType, draft, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "discard_draft",
  {
    description: "Discard / roll back the active working draft, resetting back to the clean base version state.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
    }),
  },
  async ({ docType }) => {
    try {
      const actor = await requireSession();
      const res = await discardDraft(docType, actor.email);
      return mcpResult({ ok: true, ...res, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "commit_revision",
  {
    description: "Commit the working draft (or provided content) into a new immutable version snapshot, recording its base version lineage. Stays unselected / inactive by default unless publishImmediately is true.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
      baseVersion: z.number().int().positive().optional(),
      contentText: z.string().optional(),
      title: z.string().optional(),
      summary: z.string().optional(),
      publishImmediately: z.boolean().optional(),
    }),
  },
  async ({ docType, baseVersion, contentText, title, summary, publishImmediately }) => {
    try {
      const actor = await requireSession();
      let committed: any;
      if (contentText) {
        committed = await createVersion(docType, {
          title: title || "Committed revision via MCP",
          contentText,
          baseVersion: baseVersion || null,
          publishImmediately: Boolean(publishImmediately),
          actorEmail: actor.email,
          aiSummary: summary,
          mimeType: docType === "resume" ? "text/markdown" : "application/json",
        });
      } else {
        committed = await commitDraft(docType, {
          authorEmail: actor.email,
          title,
          summary,
          publishImmediately: Boolean(publishImmediately),
        });
      }
      if (docType === "portfolio" && publishImmediately) {
        try {
          await updateDocument(JSON.parse(committed.contentText), committed.version, actor);
        } catch {}
      }
      return mcpResult({ ok: true, ...committed, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "publish_revision",
  {
    description: "Publish / merge an existing committed revision snapshot to become the live active ground truth.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
      version: z.number().int().positive(),
    }),
  },
  async ({ docType, version }) => {
    try {
      const actor = await requireSession();
      const res = await publishVersion(docType, version, actor.email);
      if (docType === "portfolio") {
        const activeDoc = await getVersion("portfolio", version);
        if (activeDoc) {
          try {
            await updateDocument(JSON.parse(activeDoc.contentText), version, actor);
          } catch {}
        }
      }
      return mcpResult({ ok: true, ...res, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "list_versions",
  {
    description: "List all version snapshots with active indicator, timestamps, author email, and 1-line AI summaries for either 'resume' or 'portfolio'.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]).describe("The document category ('resume' or 'portfolio')"),
    }),
  },
  async ({ docType }) => {
    try {
      const actor = await requireSession();
      const versions = await listVersions(docType);
      const active = await getActiveDocument(docType);
      return mcpResult({ docType, activeVersion: active?.version, versions, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "get_version",
  {
    description: "Fetch the full canonical content and metadata for a specific version number of a document.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
      version: z.number().int().positive(),
    }),
  },
  async ({ docType, version }) => {
    try {
      const actor = await requireSession();
      const doc = await getVersion(docType, version);
      if (!doc) throw new Error(`Version v${version} not found for ${docType}.`);
      return mcpResult({ ...doc, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "get_active_document",
  {
    description: "Fetch the currently active live grounded document (Markdown for resume, JSON for portfolio).",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
    }),
  },
  async ({ docType }) => {
    try {
      const actor = await requireSession();
      const active = await getActiveDocument(docType);
      return mcpResult({ ...(active || { message: "No active document found." }), actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "save_version",
  {
    description: "Create and publish a new version snapshot. Resume Markdown is automatically formatted with Prettier; portfolio JSON is validated against schema. Computes Myers LCS diff and generates 1-line AI summary.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
      contentText: z.string(),
      title: z.string().optional(),
      summary: z.string().optional(),
    }),
  },
  async ({ docType, contentText, title, summary }) => {
    try {
      const actor = await requireSession();
      let formatted = contentText;
      if (docType === "resume") {
        formatted = await formatMarkdown(contentText);
      } else if (docType === "portfolio") {
        const parsed = JSON.parse(contentText);
        const valErr = validateDocument(parsed);
        if (valErr) throw new Error(valErr);
        formatted = JSON.stringify(parsed, null, 2);
      }

      const newVer = await createVersion(docType, {
        title: title || `Revision via MCP (${actor.email})`,
        contentText: formatted,
        mimeType: docType === "resume" ? "text/markdown" : "application/json",
        actorEmail: actor.email,
        aiSummary: summary,
      });

      if (docType === "portfolio") {
        await updateDocument(JSON.parse(formatted), newVer.version, actor);
      }

      await recordAuditLog({
        documentType: docType,
        action: "MCP_SAVE_VERSION",
        toVersion: newVer.version,
        performedBy: actor.email,
        aiSummary: newVer.aiSummary,
      });

      return mcpResult({
        ok: true,
        version: newVer.version,
        aiSummary: newVer.aiSummary,
        author: actor.email,
      });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "switch_version",
  {
    description: "Bi-directionally check out (rollback to older or fast-forward to newer) a target version, immediately updating live ground truth and AI Twin context.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
      targetVersion: z.number().int().positive(),
    }),
  },
  async ({ docType, targetVersion }) => {
    try {
      const actor = await requireSession();
      const switched = await switchVersion(docType, targetVersion, actor.email);

      if (docType === "portfolio") {
        const activeDoc = await getVersion("portfolio", targetVersion);
        if (activeDoc) {
          await updateDocument(JSON.parse(activeDoc.contentText), targetVersion, actor);
        }
      }

      await recordAuditLog({
        documentType: docType,
        action: "MCP_SWITCH_VERSION",
        toVersion: targetVersion,
        performedBy: actor.email,
        aiSummary: switched.aiSummary,
      });

      return mcpResult({ ok: true, ...switched, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "diff_versions",
  {
    description: "Compute Myers LCS line-by-line diff and Gemini 2.5 Flash 1-line AI executive summary between any two document versions.",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
      fromVersion: z.number().int().positive(),
      toVersion: z.number().int().positive(),
    }),
  },
  async ({ docType, fromVersion, toVersion }) => {
    try {
      const actor = await requireSession();
      const diffRes = await compareVersions(docType, fromVersion, toVersion);

      await recordAuditLog({
        documentType: docType,
        action: "MCP_DIFF_VERSIONS",
        fromVersion,
        toVersion,
        performedBy: actor.email,
        aiSummary: diffRes.aiSummary,
      });

      return mcpResult({ ...diffRes, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "delete_version",
  {
    description: "Permanently delete an intermediate non-active version snapshot. (Cannot delete the active live version).",
    inputSchema: z.object({
      docType: z.enum(["resume", "portfolio"]),
      version: z.number().int().positive(),
    }),
  },
  async ({ docType, version }) => {
    try {
      const actor = await requireSession();
      const delRes = await deleteVersion(docType, version, actor.email);

      await recordAuditLog({
        documentType: docType,
        action: "MCP_DELETE_VERSION",
        fromVersion: version,
        performedBy: actor.email,
        aiSummary: `Deleted version v${version} via MCP (${actor.email})`,
      });

      return mcpResult({ ...delRes, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "get_audit_log",
  {
    description: "Retrieve recent security audit logs of all actions performed by authorized administrators.",
    inputSchema: z.object({
      limit: z.number().int().positive().optional(),
    }),
  },
  async ({ limit = 50 }) => {
    try {
      const actor = await requireSession();
      const logs = await getAuditLogs(limit);
      return mcpResult({ count: logs.length, logs, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "get_portfolio_datastore",
  {
    description: "Fetch the currently saved portfolio datastore, including its version and last update metadata.",
    inputSchema: z.object({}),
  },
  async () => {
    try {
      const actor = await requireSession();
      return mcpResult({ ...(await getDocument()), actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "update_portfolio_datastore",
  {
    description: "Replace the saved portfolio datastore using optimistic versioning.",
    inputSchema: z.object({
      document: z.record(z.string(), z.unknown()),
      version: z.number().int().positive(),
    }),
  },
  async ({ document, version }) => {
    try {
      const actor = await requireSession();
      const validationError = validateDocument(document);
      if (validationError) return mcpError(validationError);
      const updated = await updateDocument(document, version, actor);
      if (!updated) return mcpError("The document changed. Fetch it again before saving.");
      return mcpResult({ ...updated, actor: { email: actor.email } });
    } catch (error) {
      return mcpError(error);
    }
  },
);

mcpServer.registerTool(
  "logout_portfolio",
  {
    description: "End the current MCP portfolio administration session.",
    inputSchema: z.object({}),
  },
  async () => {
    try {
      if (sessionToken) await deleteSession(sessionToken);
      sessionToken = undefined;
      session = undefined;
      return mcpResult({ ok: true });
    } catch (error) {
      return mcpError(error);
    }
  },
);

const callbackServer = startOAuthCallbackServer();
const transport = new StdioServerTransport();
await mcpServer.connect(transport);

process.once("SIGINT", () => callbackServer.close());
process.once("SIGTERM", () => callbackServer.close());
