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
