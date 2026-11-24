// OAuth-Authenticated Strict & Secure MCP (Model Context Protocol) HTTP Endpoint
// Exposes complete portfolio and resume administration functionality over standard JSON-RPC 2.0.

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
import { isAllowedAdmin } from "./adminAuth.ts";
import { validateDocument, updateDocument, getSession, createOAuthState } from "./adminStore.ts";
import { formatMarkdown } from "./resumeValidator.ts";
import { getGoogleAdminConfig } from "./adminAuth.ts";
import { extractClientSecurityContext } from "./botProtection.ts";

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

const MCP_SERVER_NAME = "ai-portfolio-admin";
const MCP_SERVER_VERSION = "2.0.0";

const MCP_TOOLS = [
  {
    name: "save_draft",
    description: "Save or update a working draft on top of a specific base version without committing or publishing it.",
    inputSchema: {
      type: "object",
      properties: {
        docType: { type: "string", enum: ["resume", "portfolio"], description: "The document category." },
        baseVersion: { type: "number", description: "The integer base version number to branch this draft from." },
        contentText: { type: "string", description: "The draft content text (Markdown or JSON)." },
        title: { type: "string", description: "Optional title or work-in-progress note." },
      },
      required: ["docType", "baseVersion", "contentText"],
    },
  },
  {
    name: "get_draft",
    description: "Fetch the active working draft for the authenticated administrator.",
    inputSchema: {
      type: "object",
      properties: {
        docType: { type: "string", enum: ["resume", "portfolio"] },
      },
      required: ["docType"],
    },
  },
  {
    name: "discard_draft",
    description: "Discard / roll back the active working draft, resetting back to the clean base version state.",
    inputSchema: {
      type: "object",
      properties: {
        docType: { type: "string", enum: ["resume", "portfolio"] },
      },
      required: ["docType"],
    },
  },
  {
    name: "commit_revision",
    description: "Commit the working draft (or provided content) into a new immutable version snapshot, recording its base version lineage. Stays unselected / inactive by default unless publishImmediately is true.",
    inputSchema: {
      type: "object",
      properties: {
        docType: { type: "string", enum: ["resume", "portfolio"] },
        baseVersion: { type: "number", description: "Optional base version (if providing direct contentText)." },
        contentText: { type: "string", description: "Optional content (if committing directly without prior draft)." },
        title: { type: "string", description: "Commit title / pull request description." },
        summary: { type: "string", description: "Optional change summary." },
        publishImmediately: { type: "boolean", description: "Whether to immediately activate as live ground truth (default: false)." },
      },
      required: ["docType"],
    },
  },
  {
    name: "publish_revision",
    description: "Publish / merge an existing committed revision snapshot to become the live active ground truth.",
    inputSchema: {
      type: "object",
      properties: {
        docType: { type: "string", enum: ["resume", "portfolio"] },
        version: { type: "number", description: "The integer version number to publish." },
      },
      required: ["docType", "version"],
    },
  },
  {
    name: "list_versions",
    description: "List all version snapshots with active indicator, timestamps, author email, and 1-line AI summaries for either 'resume' or 'portfolio'.",
    inputSchema: {
      type: "object",
      properties: {
        docType: {
          type: "string",
          enum: ["resume", "portfolio"],
          description: "The document category to inspect ('resume' or 'portfolio').",
        },
      },
      required: ["docType"],
    },
  },
  {
    name: "get_version",
    description: "Fetch the full canonical content and metadata for a specific version number of a document.",
    inputSchema: {
      type: "object",
      properties: {
        docType: {
          type: "string",
          enum: ["resume", "portfolio"],
          description: "The document category ('resume' or 'portfolio').",
        },
        version: {
          type: "number",
          description: "The integer version number to retrieve.",
        },
      },
      required: ["docType", "version"],
    },
  },
  {
    name: "get_active_document",
    description: "Fetch the currently active live grounded document (Markdown for resume, JSON for portfolio).",
    inputSchema: {
      type: "object",
      properties: {
        docType: {
          type: "string",
          enum: ["resume", "portfolio"],
          description: "The document category ('resume' or 'portfolio').",
        },
      },
      required: ["docType"],
    },
  },
  {
    name: "save_version",
    description: "Create and publish a new version snapshot. Resume Markdown is automatically formatted with Prettier; portfolio JSON is validated against schema. Computes Myers LCS diff and generates 1-line AI summary.",
    inputSchema: {
      type: "object",
      properties: {
        docType: {
          type: "string",
          enum: ["resume", "portfolio"],
          description: "The document category ('resume' or 'portfolio').",
        },
        contentText: {
          type: "string",
          description: "The full document text to save (Markdown for resume, JSON string for portfolio).",
        },
        title: {
          type: "string",
          description: "Descriptive title for this snapshot revision.",
        },
        summary: {
          type: "string",
          description: "Optional manual summary of changes (if omitted, AI generates 1-line summary automatically).",
        },
      },
      required: ["docType", "contentText"],
    },
  },
  {
    name: "switch_version",
    description: "Bi-directionally check out (rollback to older or fast-forward to newer) a target version, immediately updating live ground truth and AI Twin context.",
    inputSchema: {
      type: "object",
      properties: {
        docType: {
          type: "string",
          enum: ["resume", "portfolio"],
          description: "The document category ('resume' or 'portfolio').",
        },
        targetVersion: {
          type: "number",
          description: "The integer version number to activate.",
        },
      },
      required: ["docType", "targetVersion"],
    },
  },
  {
    name: "diff_versions",
    description: "Compute Myers LCS line-by-line diff and Gemini 2.5 Flash 1-line AI executive summary between any two document versions.",
    inputSchema: {
      type: "object",
      properties: {
        docType: {
          type: "string",
          enum: ["resume", "portfolio"],
          description: "The document category ('resume' or 'portfolio').",
        },
        fromVersion: {
          type: "number",
          description: "The baseline version number.",
        },
        toVersion: {
          type: "number",
          description: "The target version number to compare against.",
        },
      },
      required: ["docType", "fromVersion", "toVersion"],
    },
  },
  {
    name: "delete_version",
    description: "Permanently delete an intermediate non-active version snapshot. (Cannot delete the active live version).",
    inputSchema: {
      type: "object",
      properties: {
        docType: {
          type: "string",
          enum: ["resume", "portfolio"],
          description: "The document category ('resume' or 'portfolio').",
        },
        version: {
          type: "number",
          description: "The version number to delete.",
        },
      },
      required: ["docType", "version"],
    },
  },
  {
    name: "get_audit_log",
    description: "Retrieve recent security audit logs of all actions performed by authorized administrators.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of audit entries to return (default 50).",
        },
      },
    },
  },
  {
    name: "authenticate_portfolio",
    description: "Generate a Google OAuth authorization URL for authenticating a new AI platform or client.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

async function authenticateMcpRequest(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const cookieHeader = request.headers.get("cookie") || "";
  const customHeader = request.headers.get("x-admin-session") || "";

  let token = customHeader;
  if (!token && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace(/^Bearer\s+/i, "").trim();
  }
  if (!token && cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((p) => p.trim().split("=")).filter(([k, v]) => k && v),
    );
    token = cookies.admin_session;
  }

  if (!token) return null;

  const session = await getSession(token);
  if (!session) return null;

  const allowedEmails = (process.env.ADMIN_GOOGLE_EMAILS || process.env.ALLOWED_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!isAllowedAdmin(session.email)) {
    console.warn(`[MCP Security] Rejected unauthorized email: ${session.email}`);
    return null;
  }

  return session;
}

export async function handleMcpRequest(request: Request): Promise<Response> {
  const jsonHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-admin-session",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  if (request.method === "GET") {
    // Return server metadata & discovery
    return new Response(
      JSON.stringify({
        name: MCP_SERVER_NAME,
        version: MCP_SERVER_VERSION,
        status: "online",
        transport: "json-rpc-http",
        capabilities: { tools: {} },
        availableTools: MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
        auth: "OAuth Bearer Token Required (Authorization: Bearer <sessionToken>)",
      }, null, 2),
      { status: 200, headers: jsonHeaders },
    );
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed. Use POST for JSON-RPC 2.0." }), {
      status: 405,
      headers: jsonHeaders,
    });
  }

  let body: JsonRpcRequest;
  try {
    body = (await request.json()) as JsonRpcRequest;
  } catch {
    return new Response(
      JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error: Invalid JSON." } }),
      { status: 400, headers: jsonHeaders },
    );
  }

  const { id = null, method, params = {} } = body;
  const secCtx = extractClientSecurityContext(request);

  // 1. Initialize
  if (method === "initialize") {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: { name: MCP_SERVER_NAME, version: MCP_SERVER_VERSION },
          capabilities: { tools: {} },
        },
      }),
      { status: 200, headers: jsonHeaders },
    );
  }

  // 2. Ping
  if (method === "ping") {
    return new Response(JSON.stringify({ jsonrpc: "2.0", id, result: {} }), { status: 200, headers: jsonHeaders });
  }

  // 3. Tools list (Public discovery)
  if (method === "tools/list") {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        id,
        result: { tools: MCP_TOOLS },
      }),
      { status: 200, headers: jsonHeaders },
    );
  }

  // 4. Tools call (Requires Strict OAuth Authentication except authenticate_portfolio)
  if (method === "tools/call") {
    const toolName = (params as { name?: string }).name;
    const args = (params as { arguments?: Record<string, unknown> }).arguments || {};

    if (!toolName) {
      return new Response(
        JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32602, message: "Missing tool name in params." } }),
        { status: 400, headers: jsonHeaders },
      );
    }

    // Allow authenticate_portfolio without session
    if (toolName === "authenticate_portfolio") {
      try {
        const { clientId, redirectUri } = getGoogleAdminConfig();
        const { state, codeVerifier } = await createOAuthState();
        const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
        authUrl.search = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
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

        return new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            id,
            result: {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    authorizationUrl: authUrl.toString(),
                    instructions: "Authenticate using the URL in your browser. Once signed in, pass your session token as 'Authorization: Bearer <token>' in subsequent MCP requests.",
                  }, null, 2),
                },
              ],
            },
          }),
          { status: 200, headers: jsonHeaders },
        );
      } catch (err: unknown) {
        return new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            id,
            error: { code: -32000, message: err instanceof Error ? err.message : "Authentication initialization failed." },
          }),
          { status: 500, headers: jsonHeaders },
        );
      }
    }

    // Strict OAuth Session Verification
    const session = await authenticateMcpRequest(request);
    if (!session) {
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id,
          error: {
            code: -32001,
            message: "Unauthorized. Provide a valid OAuth session via 'Authorization: Bearer <sessionToken>' or cookie.",
          },
        }),
        { status: 401, headers: jsonHeaders },
      );
    }

    // Execute Tool
    try {
      let toolOutput: unknown;

      if (toolName === "save_draft") {
        const docType = args.docType as DocumentType;
        const bVer = Number(args.baseVersion) || 1;
        const text = String(args.contentText || "");
        const draft = await saveDraft(docType, {
          baseVersion: bVer,
          contentText: text,
          title: args.title as string | undefined,
          authorEmail: session.email,
        });
        toolOutput = { ok: true, draft, actor: { email: session.email } };
      } else if (toolName === "get_draft") {
        const docType = args.docType as DocumentType;
        const draft = await getDraft(docType, session.email);
        toolOutput = { docType, draft: draft || null, actor: { email: session.email } };
      } else if (toolName === "discard_draft") {
        const docType = args.docType as DocumentType;
        const res = await discardDraft(docType, session.email);
        toolOutput = { ok: true, ...res, actor: { email: session.email } };
      } else if (toolName === "commit_revision") {
        const docType = args.docType as DocumentType;
        const text = args.contentText as string | undefined;
        let committed: any;
        if (text) {
          committed = await createVersion(docType, {
            title: (args.title as string) || "Committed revision via MCP",
            contentText: text,
            baseVersion: Number(args.baseVersion) || null,
            publishImmediately: Boolean(args.publishImmediately),
            actorEmail: session.email,
            aiSummary: args.summary as string | undefined,
            mimeType: docType === "resume" ? "text/markdown" : "application/json",
          });
        } else {
          committed = await commitDraft(docType, {
            authorEmail: session.email,
            title: args.title as string | undefined,
            summary: args.summary as string | undefined,
            publishImmediately: Boolean(args.publishImmediately),
          });
        }
        if (docType === "portfolio" && args.publishImmediately) {
          try {
            await updateDocument(JSON.parse(committed.contentText), committed.version, session);
          } catch {}
        }
        toolOutput = { ok: true, ...committed, actor: { email: session.email } };
      } else if (toolName === "publish_revision") {
        const docType = args.docType as DocumentType;
        const verNum = Number(args.version);
        const res = await publishVersion(docType, verNum, session.email);
        if (docType === "portfolio") {
          const activeDoc = await getVersion("portfolio", verNum);
          if (activeDoc) {
            try {
              await updateDocument(JSON.parse(activeDoc.contentText), verNum, session);
            } catch {}
          }
        }
        toolOutput = { ok: true, ...res, actor: { email: session.email } };
      } else if (toolName === "list_versions") {
        const docType = args.docType as DocumentType;
        const versions = await listVersions(docType);
        const active = await getActiveDocument(docType);
        toolOutput = { docType, activeVersion: active?.version, versions };
      } else if (toolName === "get_version") {
        const docType = args.docType as DocumentType;
        const verNum = Number(args.version);
        const doc = await getVersion(docType, verNum);
        if (!doc) throw new Error(`Version v${verNum} not found.`);
        toolOutput = doc;
      } else if (toolName === "get_active_document") {
        const docType = args.docType as DocumentType;
        const active = await getActiveDocument(docType);
        toolOutput = active || { message: "No active document found." };
      } else if (toolName === "save_version") {
        const docType = args.docType as DocumentType;
        const contentText = String(args.contentText || "");
        const title = (args.title as string) || `Revision via MCP (${session.email})`;
        const summary = args.summary as string | undefined;

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
          title,
          contentText: formatted,
          mimeType: docType === "resume" ? "text/markdown" : "application/json",
          actorEmail: session.email,
          aiSummary: summary,
        });

        if (docType === "portfolio") {
          await updateDocument(JSON.parse(formatted), newVer.version, session);
        }

        await recordAuditLog({
          documentType: docType,
          action: "MCP_SAVE_VERSION",
          toVersion: newVer.version,
          performedBy: session.email,
          aiSummary: newVer.aiSummary,
        });

        toolOutput = {
          ok: true,
          version: newVer.version,
          aiSummary: newVer.aiSummary,
          author: session.email,
        };
      } else if (toolName === "switch_version") {
        const docType = args.docType as DocumentType;
        const targetVer = Number(args.targetVersion);
        const switched = await switchVersion(docType, targetVer, session.email);

        if (docType === "portfolio") {
          const activeDoc = await getVersion("portfolio", targetVer);
          if (activeDoc) {
            await updateDocument(JSON.parse(activeDoc.contentText), targetVer, session);
          }
        }

        await recordAuditLog({
          documentType: docType,
          action: "MCP_SWITCH_VERSION",
          toVersion: targetVer,
          performedBy: session.email,
          aiSummary: switched.aiSummary,
        });

        toolOutput = { ok: true, ...switched };
      } else if (toolName === "diff_versions") {
        const docType = args.docType as DocumentType;
        const fromVer = Number(args.fromVersion);
        const toVer = Number(args.toVersion);
        const diffRes = await compareVersions(docType, fromVer, toVer);

        await recordAuditLog({
          documentType: docType,
          action: "MCP_DIFF_VERSIONS",
          fromVersion: fromVer,
          toVersion: toVer,
          performedBy: session.email,
          aiSummary: diffRes.aiSummary,
        });

        toolOutput = diffRes;
      } else if (toolName === "delete_version") {
        const docType = args.docType as DocumentType;
        const verNum = Number(args.version);
        const delRes = await deleteVersion(docType, verNum, session.email);

        await recordAuditLog({
          documentType: docType,
          action: "MCP_DELETE_VERSION",
          fromVersion: verNum,
          performedBy: session.email,
          aiSummary: `Deleted version v${verNum} via MCP`,
        });

        toolOutput = delRes;
      } else if (toolName === "get_audit_log") {
        const limit = Number(args.limit) || 50;
        const logs = await getAuditLogs(limit);
        toolOutput = { count: logs.length, logs };
      } else {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message: `Tool not found: ${toolName}` } }),
          { status: 404, headers: jsonHeaders },
        );
      }

      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              {
                type: "text",
                text: typeof toolOutput === "string" ? toolOutput : JSON.stringify(toolOutput, null, 2),
              },
            ],
          },
        }),
        { status: 200, headers: jsonHeaders },
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Tool execution failed.";
      return new Response(
        JSON.stringify({
          jsonrpc: "2.0",
          id,
          result: {
            isError: true,
            content: [{ type: "text", text: errMsg }],
          },
        }),
        { status: 200, headers: jsonHeaders },
      );
    }
  }

  return new Response(
    JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${method}` } }),
    { status: 404, headers: jsonHeaders },
  );
}
