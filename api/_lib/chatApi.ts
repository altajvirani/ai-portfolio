import { normalizeConversationId } from "./chatMemory.ts";
import { processAgentQuery } from "./groundingEngine.ts";
import { createHash } from "node:crypto";
import { checkChatRateLimit } from "./chatRateLimit.ts";

function jsonResponse(body: unknown, status = 200, extraHeaders?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...extraHeaders,
    },
  });
}

export async function handleChatRequest(request: Request) {
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);
  const origin = request.headers.get("origin");
  const expectedOrigin = (process.env.APP_URL || new URL(request.url).origin).replace(/\/$/, "");
  if (origin && origin.replace(/\/$/, "") !== expectedOrigin) {
    return jsonResponse({ error: "Chat requests must originate from this portfolio." }, 403);
  }
  const referer = request.headers.get("referer");
  if (!origin && !referer) {
    return jsonResponse({ error: "Chat requests must originate from this portfolio." }, 403);
  }
  if (!origin && referer) {
    try {
      if (new URL(referer).origin !== expectedOrigin) {
        return jsonResponse({ error: "Chat requests must originate from this portfolio." }, 403);
      }
    } catch {
      return jsonResponse({ error: "Invalid request origin." }, 403);
    }
  }
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || request.headers.get("cf-connecting-ip")
    || "unknown";
  const ipKey = createHash("sha256").update(ip).digest("hex");
  const limit = await checkChatRateLimit(ipKey);
  if (!limit.allowed) {
    const isGlobal = limit.reason === "global_budget";
    return jsonResponse(
      {
        error: isGlobal
          ? "The AI Twin has reached its daily showcase budget to protect compute quotas. Please feel free to explore the interactive portfolio sections or reach out directly via the Contact section below!"
          : "You have reached the temporary chat usage limit. Please wait a moment before sending another message, or reach out directly via the Contact section below.",
        rateLimited: true,
        reason: limit.reason,
      },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }
  let payload: { message?: unknown; history?: unknown; conversationId?: unknown };
  try {
    payload = await request.json() as typeof payload;
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }
  if (typeof payload.message !== "string" || !payload.message.trim()) {
    return jsonResponse({ error: "A message is required." }, 400);
  }
  if (payload.message.length > 4000) {
    return jsonResponse({ error: "Message is too long." }, 413);
  }
  const history = Array.isArray(payload.history)
    ? payload.history
      .filter((item): item is { role: "user" | "model"; text: string } =>
        Boolean(item) && typeof item === "object"
        && ("role" in item) && ("text" in item)
        && (item.role === "user" || item.role === "model")
        && typeof item.text === "string")
      .slice(-6)
      .map((item) => ({ role: item.role, text: item.text.slice(0, 4000) }))
    : [];
  const conversationId = normalizeConversationId(payload.conversationId);
  const result = await processAgentQuery(payload.message.trim(), history, conversationId);
  return jsonResponse({ ...result, conversationId });
}
