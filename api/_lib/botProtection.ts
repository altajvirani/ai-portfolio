// Cloudflare & Bot Mitigation Middleware
// Provides threat signature filtering, malicious crawler blocking, rate limiting, and Cloudflare Turnstile verification.

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Malicious User-Agent signatures (vulnerability scanners, aggressive scrapers)
const BLOCKED_UA_SUBSTRINGS = [
  "sqlmap",
  "nikto",
  "havij",
  "acunetix",
  "nmap",
  "masscan",
  "zgrab",
  "wpscan",
  "dirbuster",
  "gobuster",
  "nessus",
  "openvas",
  "burpcollaborator",
];

// Malicious path signatures (common automated CMS/exploit probes)
const BLOCKED_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git/i,
  /\/wp-login\.php/i,
  /\/wp-admin/i,
  /\/xmlrpc\.php/i,
  /\/phpmyadmin/i,
  /\/pma/i,
  /\/actuator/i,
  /\/etc\/passwd/i,
  /\.\.\//,
  /\.\.%2f/i,
  /<script[\s>]/i,
];

export interface ClientSecurityContext {
  clientIp: string;
  isCloudflare: boolean;
  country: string | null;
  rayId: string | null;
  userAgent: string;
}

export function extractClientSecurityContext(request: Request): ClientSecurityContext {
  const headers = request.headers;
  const cfConnectingIp = headers.get("cf-connecting-ip");
  const xForwardedFor = headers.get("x-forwarded-for");
  const xRealIp = headers.get("x-real-ip");

  const clientIp = cfConnectingIp || (xForwardedFor ? xForwardedFor.split(",")[0].trim() : xRealIp) || "127.0.0.1";
  const isCloudflare = Boolean(headers.get("cf-ray") || cfConnectingIp);
  const country = headers.get("cf-ipcountry") || null;
  const rayId = headers.get("cf-ray") || null;
  const userAgent = headers.get("user-agent") || "";

  return { clientIp, isCloudflare, country, rayId, userAgent };
}

/**
 * Checks for known malicious bot signatures, path traversal, or probing patterns.
 */
export function evaluateThreatSignatures(request: Request): { blocked: boolean; reason?: string } {
  const url = new URL(request.url);
  const ua = (request.headers.get("user-agent") || "").toLowerCase();

  // 1. Check User-Agent blacklist
  for (const blocked of BLOCKED_UA_SUBSTRINGS) {
    if (ua.includes(blocked)) {
      return { blocked: true, reason: `Blocked scanner user-agent: ${blocked}` };
    }
  }

  // 2. Check Path/Query patterns
  const fullTarget = url.pathname + url.search;
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(fullTarget)) {
      return { blocked: true, reason: `Blocked malicious path signature: ${pattern}` };
    }
  }

  return { blocked: false };
}

/**
 * Sliding window in-memory rate limiter.
 * @param key unique identifier (e.g. IP + endpoint)
 * @param maxRequests maximum allowed requests within window
 * @param windowMs time window in milliseconds (default 60s)
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 60,
  windowMs: number = 60_000,
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetInMs: windowMs };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetInMs: Math.max(0, entry.resetAt - now) };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetInMs: Math.max(0, entry.resetAt - now) };
}

/**
 * Cleans expired rate limit entries periodically.
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}, 120_000).unref?.();

/**
 * Validates Cloudflare Turnstile token if configured.
 */
export async function verifyCloudflareTurnstile(
  token: string,
  remoteIp?: string,
): Promise<{ success: boolean; error?: string }> {
  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    // If not configured, bypass gracefully
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "Cloudflare Turnstile token is missing." };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) formData.append("remoteip", remoteIp);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      return { success: false, error: `Turnstile verification failed: ${(data["error-codes"] || []).join(", ")}` };
    }

    return { success: true };
  } catch (err: unknown) {
    console.warn("Cloudflare Turnstile verification network error:", err);
    return { success: false, error: "Turnstile verification service unreachable." };
  }
}

/**
 * Injects hardened security headers into the response.
 */
export function applySecurityHeaders(headers: Headers): Headers {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return headers;
}
