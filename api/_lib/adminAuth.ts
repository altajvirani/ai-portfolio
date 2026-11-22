import { createHash, randomBytes } from "node:crypto";
import {
  consumeOAuthState,
  createOAuthState,
  createSession,
  deleteSession,
  getDocument,
  getSession,
  updateDocument,
  usesRemoteStore,
  validateDocument,
  verifyCsrf,
} from "./adminStore.ts";
import {
  type DocumentType,
  type DocumentVersion,
  listVersions,
  getActiveDocument,
  getVersion,
  createVersion,
  switchVersion,
  deleteVersion,
  compareVersions,
  seedInitialVersionsIfEmpty,
  getAuditLogs,
  recordAuditLog,
} from "./versionEngine.ts";
import {
  validateFileHeader,
  evaluateResumeContentWithLLM,
  convertResumeToMarkdown,
  formatMarkdown,
} from "./resumeValidator.ts";
import {
  evaluateThreatSignatures,
  extractClientSecurityContext,
  checkRateLimit,
  applySecurityHeaders,
} from "./botProtection.ts";

const ALLOWED_ISSUER = "https://accounts.google.com";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

export type GoogleAdminConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  allowedEmails: string[];
};

export function getGoogleAdminConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  const databaseUrl = process.env.DATABASE_URL;
  const allowedEmails = (process.env.ADMIN_GOOGLE_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  if (!clientId || !clientSecret || !redirectUri || allowedEmails.length === 0 || (usesRemoteStore() && !databaseUrl)) {
    throw new Error(
      "Google admin authentication is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, ADMIN_GOOGLE_EMAILS, and DATABASE_URL.",
    );
  }
  return { clientId, clientSecret, redirectUri, allowedEmails };
}

export async function exchangeGoogleCode(
  code: string,
  codeVerifier: string,
  redirectUri: string,
) {
  const { clientId, clientSecret, allowedEmails } = getGoogleAdminConfig();
  const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: codeVerifier,
    }),
  });
  if (!tokenResponse.ok) throw new Error("Google authentication failed.");
  const tokens = (await tokenResponse.json()) as { id_token?: string };
  if (!tokens.id_token) throw new Error("Google authentication failed.");

  const profileResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`,
  );
  if (!profileResponse.ok) throw new Error("Google authentication failed.");
  const profile = (await profileResponse.json()) as {
    iss?: string;
    aud?: string;
    exp?: string;
    sub?: string;
    email?: string;
    email_verified?: string;
  };
  const expiresAt = Number(profile.exp);
  const email = profile.email?.toLowerCase();
  if (
    profile.iss !== ALLOWED_ISSUER ||
    profile.aud !== clientId ||
    !profile.sub ||
    !email ||
    profile.email_verified !== "true" ||
    !allowedEmails.includes(email) ||
    !Number.isFinite(expiresAt) ||
    expiresAt * 1000 <= Date.now()
  ) {
    throw new Error("This Google account is not authorized.");
  }
  return { subject: profile.sub, email };
}

function cookieOptions(httpOnly: boolean, maxAge: number) {
  return [
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=Lax",
    httpOnly ? "HttpOnly" : "",
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");
}

function parseCookies(request: Request) {
  return Object.fromEntries(
    (request.headers.get("cookie") || "")
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([key, value]) => key && value)
      .map(([key, ...value]) => [key, decodeURIComponent(value.join("="))]),
  );
}

function response(body: unknown, status = 200, headers?: HeadersInit) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Cache-Control", "no-store");
  applySecurityHeaders(responseHeaders);
  return new Response(body === undefined ? undefined : JSON.stringify(body), {
    status,
    headers: responseHeaders,
  });
}

function redirect(location: string, cookies: string[] = []) {
  const headers = new Headers({ Location: location, "Cache-Control": "no-store" });
  cookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
  applySecurityHeaders(headers);
  return new Response(null, { status: 302, headers });
}

function getOrigin(request: Request) {
  const configuredOrigin = process.env.APP_URL?.replace(/\/$/, "");
  return configuredOrigin || new URL(request.url).origin;
}

function assertMutationOrigin(request: Request) {
  // Allow direct authenticated programmatic clients (Bearer token or X-Admin-Session)
  const isBearer = Boolean(
    request.headers.get("authorization")?.startsWith("Bearer ") || request.headers.get("x-admin-session"),
  );
  if (isBearer) return true;
  const origin = request.headers.get("origin");
  return origin === getOrigin(request);
}

export async function requireSession(request: Request) {
  const cookies = parseCookies(request);
  const bearerToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim();
  const customHeaderToken = request.headers.get("x-admin-session")?.trim();
  const queryToken = new URL(request.url).searchParams.get("token")?.trim();
  const token = cookies.admin_session || bearerToken || customHeaderToken || queryToken;

  if (!token) return undefined;
  const session = await getSession(token);
  if (!session) return undefined;

  // Strict checking of OAuth allowlist for EVERY operation
  const allowedEmails = (process.env.ADMIN_GOOGLE_EMAILS || process.env.ALLOWED_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length > 0 && !allowedEmails.includes(session.email.toLowerCase())) {
    console.warn(`[Security Alert] Session email '${session.email}' is unauthorized.`);
    return undefined;
  }

  return session;
}

function base64Url(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64url");
}

async function createPkceChallenge(verifier: string) {
  return base64Url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
}

async function beginGoogleLogin(request: Request) {
  const { clientId, redirectUri } = getGoogleAdminConfig();
  const { state, codeVerifier } = await createOAuthState();
  const challenge = await createPkceChallenge(codeVerifier);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return redirect(`${GOOGLE_AUTH_URL}?${params}`, [
    `oauth_state=${encodeURIComponent(state)}; ${cookieOptions(true, 600)}`,
  ]);
}

async function completeGoogleLogin(request: Request) {
  const { clientId, redirectUri } = getGoogleAdminConfig();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = parseCookies(request).oauth_state;
  if (!code || !state || !stateCookie || state !== stateCookie) {
    return response({ error: "Invalid OAuth request." }, 400);
  }
  const codeVerifier = await consumeOAuthState(state);
  if (!codeVerifier) return response({ error: "Expired OAuth request." }, 400);
  let profile: Awaited<ReturnType<typeof exchangeGoogleCode>>;
  try {
    profile = await exchangeGoogleCode(code, codeVerifier, redirectUri);
  } catch (error) {
    return response(
      { error: error instanceof Error ? error.message : "Google authentication failed." },
      error instanceof Error && error.message.includes("not authorized") ? 403 : 401,
    );
  }

  const session = await createSession(profile.subject, profile.email);
  return redirect("/admin", [
    `admin_session=${encodeURIComponent(session.token)}; ${cookieOptions(true, 8 * 60 * 60)}`,
    `admin_csrf=${encodeURIComponent(session.csrfToken)}; ${cookieOptions(false, 8 * 60 * 60)}`,
    `oauth_state=; ${cookieOptions(true, 0)}`,
  ]);
}

async function handleData(request: Request) {
  const session = await requireSession(request);
  if (!session) return response({ error: "Authentication required." }, 401);
  if (request.method === "GET") {
    const stored = await getDocument();
    return response({ ...stored, actor: { email: session.email } });
  }
  if (request.method !== "PUT" || !assertMutationOrigin(request)) {
    return response({ error: "Invalid request." }, 400);
  }
  const isBearer = Boolean(
    request.headers.get("authorization")?.startsWith("Bearer ") || request.headers.get("x-admin-session"),
  );
  if (!isBearer) {
    const csrf = parseCookies(request).admin_csrf;
    if (!verifyCsrf(session, request.headers.get("x-csrf-token") || csrf)) {
      return response({ error: "CSRF validation failed." }, 403);
    }
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1_600_000) return response({ error: "Request is too large." }, 413);
  let payload: { document?: unknown; version?: unknown };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return response({ error: "Request body must be valid JSON." }, 400);
  }
  if (!Number.isInteger(payload.version) || typeof payload.document !== "object") {
    return response({ error: "A document and integer version are required." }, 400);
  }
  const validationError = validateDocument(payload.document);
  if (validationError) return response({ error: validationError }, 400);
  const updated = await updateDocument(payload.document, payload.version as number, session);
  if (!updated) return response({ error: "The document changed. Reload before saving." }, 409);
  await recordAuditLog({
    documentType: "portfolio",
    action: "UPDATE_DATASTORE",
    toVersion: payload.version as number,
    performedBy: session.email,
    aiSummary: `Direct datastore update to version ${payload.version}`,
  });
  return response({ ...updated, actor: { email: session.email } });
}

async function handleVersionsRequest(request: Request) {
  const url = new URL(request.url);
  const parts = url.pathname.replace(/^\/api\/admin\/versions\/?/, "").split("/").filter(Boolean);
  const docType = parts[0] as DocumentType;
  if (docType !== "resume" && docType !== "portfolio") {
    return response({ error: "Invalid document type. Must be 'resume' or 'portfolio'." }, 400);
  }

  // Ensure initial seed exists
  await seedInitialVersionsIfEmpty().catch(() => {});

  const action = parts[1] || "";

  // GET /api/admin/versions/:docType (List all versions)
  if (!action && request.method === "GET") {
    const session = await requireSession(request);
    if (!session) return response({ error: "Authentication required." }, 401);

    const versions = await listVersions(docType);
    let active = await getActiveDocument(docType);
    if (!active && versions.length > 0) {
      active = await getVersion(docType, versions[0].version);
    }

    if (!active?.contentText) {
      if (docType === "resume") {
        try {
          const fs = await import("node:fs");
          const path = await import("node:path");
          const p = path.resolve(process.cwd(), "public/assets/altaj-virani-resume.md");
          if (fs.existsSync(p)) {
            const txt = fs.readFileSync(p, "utf-8");
            active = { ...(active || {}), contentText: txt, version: active?.version || 1 } as any;
          }
        } catch {}
      } else if (docType === "portfolio") {
        try {
          const fs = await import("node:fs");
          const path = await import("node:path");
          const p = path.resolve(process.cwd(), "src/data/applicationDataStore.json");
          if (fs.existsSync(p)) {
            const txt = fs.readFileSync(p, "utf-8");
            active = { ...(active || {}), contentText: txt, version: active?.version || 1 } as any;
          }
        } catch {}
      }
    }

    return response({
      docType,
      versions,
      activeVersion: active?.version || (versions[0]?.version ?? null),
      activeContent: active?.contentText || "",
      actor: { email: session.email },
    });
  }

  // POST /api/admin/versions/:docType/edit (Save modified text/markdown content directly)
  if (action === "edit" && request.method === "POST") {
    const session = await requireSession(request);
    if (!session) return response({ error: "Authentication required." }, 401);
    if (!assertMutationOrigin(request)) return response({ error: "Invalid request origin." }, 400);

    const isBearer = Boolean(
      request.headers.get("authorization")?.startsWith("Bearer ") || request.headers.get("x-admin-session"),
    );
    if (!isBearer) {
      const csrf = parseCookies(request).admin_csrf;
      if (!verifyCsrf(session, request.headers.get("x-csrf-token") || csrf)) {
        return response({ error: "CSRF validation failed." }, 403);
      }
    }

    let payload: any;
    try {
      payload = await request.json();
    } catch {
      return response({ error: "Invalid JSON payload." }, 400);
    }

    const { contentText, title, summary } = payload || {};
    if (!contentText || typeof contentText !== "string" || !contentText.trim()) {
      return response({ error: "Content text is required." }, 400);
    }

    let formattedContent = contentText;
    if (docType === "resume") {
      formattedContent = await formatMarkdown(contentText);
    } else if (docType === "portfolio") {
      try {
        const parsed = JSON.parse(contentText);
        const validationError = validateDocument(parsed);
        if (validationError) return response({ error: validationError }, 400);
        formattedContent = JSON.stringify(parsed, null, 2);
      } catch {
        return response({ error: "Invalid JSON document structure." }, 400);
      }
    }

    const newVersion = await createVersion(docType, {
      title: title || (docType === "resume" ? "Resume Markdown Edit" : "Portfolio Datastore Edit"),
      contentText: formattedContent,
      mimeType: docType === "resume" ? "text/markdown" : "application/json",
      actorEmail: session.email,
      aiSummary: summary,
    });

    if (docType === "portfolio") {
      try {
        await updateDocument(JSON.parse(formattedContent), newVersion.version, session);
      } catch (err) {
        console.warn("Could not sync portfolio document:", err);
      }
    }

    return response({
      ok: true,
      version: newVersion.version,
      aiSummary: newVersion.aiSummary,
      contentText: newVersion.contentText,
    });
  }

  // POST /api/admin/versions/:docType/upload
  if (action === "upload" && request.method === "POST") {
    const session = await requireSession(request);
    if (!session) return response({ error: "Authentication required." }, 401);
    if (!assertMutationOrigin(request)) return response({ error: "Invalid request origin." }, 400);

    const isBearer = Boolean(
      request.headers.get("authorization")?.startsWith("Bearer ") || request.headers.get("x-admin-session"),
    );
    if (!isBearer) {
      const csrf = parseCookies(request).admin_csrf;
      if (!verifyCsrf(session, request.headers.get("x-csrf-token") || csrf)) {
        return response({ error: "CSRF validation failed." }, 403);
      }
    }

    let payload: any;
    try {
      payload = await request.json();
    } catch {
      return response({ error: "Invalid JSON payload." }, 400);
    }

    if (docType === "resume") {
      const { filename, mimeType, fileBase64, title } = payload || {};
      if (!filename || !fileBase64) {
        return response({ error: "Filename and fileBase64 are required." }, 400);
      }

      const fileBuffer = Buffer.from(fileBase64, "base64");
      const headerCheck = validateFileHeader(filename, mimeType || "application/pdf", fileBuffer);
      if (!headerCheck.valid) {
        return response({ error: headerCheck.error }, 400);
      }

      // Tier 3: LLM Usability & Authenticity Evaluation
      const evaluation = await evaluateResumeContentWithLLM(fileBuffer, mimeType || "application/pdf", filename);
      if (!evaluation.isValid) {
        return response(
          {
            error: "The uploaded file failed resume validation.",
            details: evaluation.reason,
            confidence: evaluation.confidenceScore,
          },
          422,
        );
      }

      // Convert to Markdown
      const converted = await convertResumeToMarkdown(fileBuffer, mimeType || "application/pdf", filename);

      // Create new version
      const newVersion = await createVersion("resume", {
        title: title || filename,
        contentText: converted.markdown,
        rawFileBuffer: fileBuffer,
        rawFileName: filename,
        mimeType: mimeType || "application/pdf",
        actorEmail: session.email,
        aiSummary: converted.aiSummary,
      });

      return response({
        ok: true,
        version: newVersion.version,
        aiSummary: newVersion.aiSummary,
        sectionsDetected: evaluation.sectionsDetected,
      });
    }

    if (docType === "portfolio") {
      const { document, title, summary } = payload || {};
      if (!document || typeof document !== "object") {
        return response({ error: "A valid document object is required." }, 400);
      }
      const validationError = validateDocument(document);
      if (validationError) return response({ error: validationError }, 400);

      const jsonText = JSON.stringify(document, null, 2);
      const newVersion = await createVersion("portfolio", {
        title: title || `Portfolio Snapshot v${Date.now()}`,
        contentText: jsonText,
        mimeType: "application/json",
        actorEmail: session.email,
        aiSummary: summary,
      });

      await updateDocument(document, newVersion.version, session);

      return response({
        ok: true,
        version: newVersion.version,
        aiSummary: newVersion.aiSummary,
      });
    }
  }

  // POST /api/admin/versions/:docType/switch (Bi-directional)
  if (action === "switch" && request.method === "POST") {
    const session = await requireSession(request);
    if (!session) return response({ error: "Authentication required." }, 401);
    if (!assertMutationOrigin(request)) return response({ error: "Invalid request origin." }, 400);

    const isBearer = Boolean(
      request.headers.get("authorization")?.startsWith("Bearer ") || request.headers.get("x-admin-session"),
    );
    if (!isBearer) {
      const csrf = parseCookies(request).admin_csrf;
      if (!verifyCsrf(session, request.headers.get("x-csrf-token") || csrf)) {
        return response({ error: "CSRF validation failed." }, 403);
      }
    }

    const payload = (await request.json().catch(() => ({}))) as { version?: number };
    if (!payload.version || typeof payload.version !== "number") {
      return response({ error: "Integer version number is required." }, 400);
    }

    const result = await switchVersion(docType, payload.version, session.email);
    if (docType === "portfolio") {
      const activeDoc = await getVersion("portfolio", payload.version);
      if (activeDoc) {
        try {
          const parsed = JSON.parse(activeDoc.contentText);
          await updateDocument(parsed, payload.version, session);
        } catch (e) {
          console.warn("Could not sync portfolio datastore on switch:", e);
        }
      }
    }
    return response({ ok: true, ...result });
  }

  // POST /api/admin/versions/:docType/diff (Myers LCS line diff + 1-line AI summary)
  if (action === "diff" && request.method === "POST") {
    const session = await requireSession(request);
    if (!session) return response({ error: "Authentication required." }, 401);

    const payload = (await request.json().catch(() => ({}))) as {
      fromVersion?: number;
      toVersion?: number;
    };
    if (
      typeof payload.fromVersion !== "number" ||
      typeof payload.toVersion !== "number"
    ) {
      return response({ error: "fromVersion and toVersion integers are required." }, 400);
    }

    const result = await compareVersions(docType, payload.fromVersion, payload.toVersion);
    await recordAuditLog({
      documentType: docType,
      action: "DIFF_INSPECT",
      fromVersion: payload.fromVersion,
      toVersion: payload.toVersion,
      performedBy: session.email,
      aiSummary: result.aiSummary,
    });
    return response(result);
  }

  // DELETE /api/admin/versions/:docType/:version
  if (action && request.method === "DELETE") {
    const session = await requireSession(request);
    if (!session) return response({ error: "Authentication required." }, 401);
    if (!assertMutationOrigin(request)) return response({ error: "Invalid request origin." }, 400);

    const isBearer = Boolean(
      request.headers.get("authorization")?.startsWith("Bearer ") || request.headers.get("x-admin-session"),
    );
    if (!isBearer) {
      const csrf = parseCookies(request).admin_csrf;
      if (!verifyCsrf(session, request.headers.get("x-csrf-token") || csrf)) {
        return response({ error: "CSRF validation failed." }, 403);
      }
    }

    const versionNum = parseInt(action, 10);
    if (isNaN(versionNum)) {
      return response({ error: "Invalid version number to delete." }, 400);
    }

    const result = await deleteVersion(docType, versionNum, session.email);
    return response({ ok: true, ...result });
  }

  // GET /api/admin/versions/:docType/download/:version?format=raw|markdown
  if (action === "download" && request.method === "GET") {
    const targetVer = parts[2] || "latest";
    let doc: DocumentVersion | null = null;
    if (targetVer === "latest" || targetVer === "active") {
      doc = await getActiveDocument(docType);
    } else {
      const vNum = parseInt(targetVer, 10);
      if (!isNaN(vNum)) {
        doc = await getVersion(docType, vNum);
      }
    }

    if (!doc) return response({ error: "Document version not found." }, 404);

    const format = url.searchParams.get("format") || (doc.rawFileBytesBase64 ? "raw" : "markdown");

    if (format === "raw" && doc.rawFileBytesBase64) {
      const fileBuffer = Buffer.from(doc.rawFileBytesBase64, "base64");
      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": doc.mimeType || "application/pdf",
          "Content-Disposition": `attachment; filename="${doc.rawFileName || `altaj-virani-resume-v${doc.version}.pdf`}"`,
          "Content-Length": String(fileBuffer.length),
        },
      });
    }

    return new Response(doc.contentText, {
      status: 200,
      headers: {
        "Content-Type": docType === "resume" ? "text/markdown; charset=utf-8" : "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${docType}-v${doc.version}.${docType === "resume" ? "md" : "json"}"`,
      },
    });
  }

  return response({ error: "Not found." }, 404);
}

export async function handleAdminRequest(request: Request) {
  // Threat detection & Bot mitigation
  const threatCheck = evaluateThreatSignatures(request);
  if (threatCheck.blocked) {
    return response({ error: "Access Denied by Security Policy.", reason: threatCheck.reason }, 403);
  }
  const secCtx = extractClientSecurityContext(request);
  const rateLimit = checkRateLimit(`admin-${secCtx.clientIp}`, 120, 60_000);
  if (!rateLimit.allowed) {
    return response({ error: "Too Many Requests. Please slow down." }, 429, { "Retry-After": "60" });
  }

  const pathname = new URL(request.url).pathname;
  try {
    if (pathname === "/api/auth/google/start" && request.method === "GET") {
      return await beginGoogleLogin(request);
    }
    if (pathname === "/api/auth/google/callback" && request.method === "GET") {
      return await completeGoogleLogin(request);
    }
    if (pathname === "/api/auth/session" && request.method === "GET") {
      const session = await requireSession(request);
      return response(session ? { authenticated: true, email: session.email } : { authenticated: false });
    }
    if (pathname === "/api/auth/logout" && request.method === "POST") {
      const token = parseCookies(request).admin_session;
      if (token) await deleteSession(token);
      return response(
        { ok: true },
        200,
        (() => {
          const headers = new Headers();
          headers.append("Set-Cookie", `admin_session=; ${cookieOptions(true, 0)}`);
          headers.append("Set-Cookie", `admin_csrf=; ${cookieOptions(false, 0)}`);
          return headers;
        })(),
      );
    }
    if (pathname === "/api/admin/audit" && request.method === "GET") {
      const session = await requireSession(request);
      if (!session) return response({ error: "Authentication required." }, 401);
      const url = new URL(request.url);
      const limit = Number(url.searchParams.get("limit")) || 50;
      const logs = await getAuditLogs(limit);
      return response({ ok: true, logs });
    }
    if (pathname === "/api/mcp" || pathname === "/api/admin/mcp") {
      const { handleMcpRequest } = await import("./mcpHttpHandler.ts");
      return await handleMcpRequest(request);
    }
    if (pathname.startsWith("/api/admin/versions")) {
      return await handleVersionsRequest(request);
    }
    if (pathname === "/api/admin/data") return await handleData(request);
    return response({ error: "Not found." }, 404);
  } catch (error) {
    console.error("Admin endpoint error:", error);
    if (error instanceof Error && error.message.startsWith("Google admin authentication is not configured.")) {
      return response({ error: error.message }, 503);
    }
    return response({ error: "Admin service unavailable." }, 503);
  }
}
