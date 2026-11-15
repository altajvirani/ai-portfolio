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

const ALLOWED_ISSUER = "https://accounts.google.com";
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

function getConfig() {
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
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("Referrer-Policy", "no-referrer");
  return new Response(body === undefined ? undefined : JSON.stringify(body), {
    status,
    headers: responseHeaders,
  });
}

function redirect(location: string, cookies: string[] = []) {
  const headers = new Headers({ Location: location, "Cache-Control": "no-store" });
  cookies.forEach((cookie) => headers.append("Set-Cookie", cookie));
  return new Response(null, { status: 302, headers });
}

function getOrigin(request: Request) {
  const configuredOrigin = process.env.APP_URL?.replace(/\/$/, "");
  return configuredOrigin || new URL(request.url).origin;
}

function assertMutationOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return origin === getOrigin(request);
}

async function requireSession(request: Request) {
  const token = parseCookies(request).admin_session;
  if (!token) return undefined;
  return getSession(token);
}

function base64Url(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64url");
}

async function createPkceChallenge(verifier: string) {
  return base64Url(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
}

async function beginGoogleLogin(request: Request) {
  const { clientId, redirectUri } = getConfig();
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
  const { clientId, clientSecret, redirectUri, allowedEmails } = getConfig();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const stateCookie = parseCookies(request).oauth_state;
  if (!code || !state || !stateCookie || state !== stateCookie) {
    return response({ error: "Invalid OAuth request." }, 400);
  }
  const codeVerifier = await consumeOAuthState(state);
  if (!codeVerifier) return response({ error: "Expired OAuth request." }, 400);

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
  if (!tokenResponse.ok) return response({ error: "Google authentication failed." }, 401);
  const tokens = (await tokenResponse.json()) as { id_token?: string };
  if (!tokens.id_token) return response({ error: "Google authentication failed." }, 401);

  const profileResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(tokens.id_token)}`,
  );
  if (!profileResponse.ok) return response({ error: "Google authentication failed." }, 401);
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
    return response({ error: "This Google account is not authorized." }, 403);
  }

  const session = await createSession(profile.sub, email);
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
  const csrf = parseCookies(request).admin_csrf;
  if (!verifyCsrf(session, request.headers.get("x-csrf-token") || csrf)) {
    return response({ error: "CSRF validation failed." }, 403);
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
  return response({ ...updated, actor: { email: session.email } });
}

export async function handleAdminRequest(request: Request) {
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
