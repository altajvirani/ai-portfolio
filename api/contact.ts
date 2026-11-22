import { dispatchContactSubmission } from "./_lib/contactHandler.ts";
import type { ApiRequest, ApiResponse } from "./_lib/apiAdapter.ts";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    res.status(405).send(JSON.stringify({ ok: false, error: "Method not allowed." }));
    return;
  }
  try {
    const origin = typeof req.headers.origin === "string" ? req.headers.origin : undefined;
    const result = await dispatchContactSubmission(req.body, origin);
    res.setHeader("Content-Type", "application/json");
    res.status(result.status).send(JSON.stringify(result.body));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Error handling /api/contact:", err);
    res.setHeader("Content-Type", "application/json");
    res.status(500).send(JSON.stringify({ ok: false, error: errorMessage }));
  }
}
