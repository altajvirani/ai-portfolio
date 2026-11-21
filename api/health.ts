import type { ApiRequest, ApiResponse } from "../src/server/apiAdapter.ts";

export default function handler(_req: ApiRequest, res: ApiResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(
    JSON.stringify({
      status: "ok",
      hasGeminiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
      resumeMode: "in-context-markdown",
      geminiModel: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
      time: new Date().toISOString(),
    }),
  );
}
