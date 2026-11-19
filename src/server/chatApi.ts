import { normalizeConversationId } from "./chatMemory.ts";
import { processRAGQuery } from "./ragEngine.ts";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function handleChatRequest(request: Request) {
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405);
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
  const result = await processRAGQuery(payload.message.trim(), history, conversationId);
  return jsonResponse({ ...result, conversationId });
}
