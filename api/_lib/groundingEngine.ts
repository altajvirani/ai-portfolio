import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import fs from "node:fs";
import path from "node:path";
import {
  getChatMemory,
  saveChatMemory,
  type ChatHistoryMessage,
} from "./chatMemory.ts";
import { responseCache } from "./responseCache.ts";
import { classifyQueryIntent } from "./intentClassifier.ts";
import {
  getActiveDocument,
  registerGroundingCacheInvalidator,
} from "./versionEngine.ts";

let cachedResumeMarkdown: string | null = null;

// Invalidate in-memory cache whenever a new version is uploaded, switched, or deleted
registerGroundingCacheInvalidator(() => {
  cachedResumeMarkdown = null;
});

/**
 * Dynamically loads the active resume markdown from the Version Control Engine (Neon PostgreSQL),
 * with in-memory caching and graceful fallback to the local disk markdown file.
 */
export async function getGroundedResumeMarkdown(): Promise<string> {
  if (cachedResumeMarkdown) return cachedResumeMarkdown;

  try {
    const activeDoc = await getActiveDocument("resume");
    if (activeDoc?.contentText && activeDoc.contentText.trim().length > 0) {
      cachedResumeMarkdown = activeDoc.contentText;
      return cachedResumeMarkdown;
    }
  } catch (err) {
    console.warn("Version engine resume query failed, using static fallback:", err);
  }

  try {
    const resumePath = path.resolve(
      process.cwd(),
      "public/assets/altaj-virani-resume.md",
    );
    if (fs.existsSync(resumePath)) {
      cachedResumeMarkdown = fs.readFileSync(resumePath, "utf-8");
    }
  } catch (err) {
    console.warn("Failed to read static fallback resume markdown:", err);
    cachedResumeMarkdown = "";
  }

  return cachedResumeMarkdown || "";
}

/**
 * Synchronous accessor for cached markdown or immediate file read
 */
export function getResumeMarkdown(): string {
  if (cachedResumeMarkdown) return cachedResumeMarkdown;
  try {
    const resumePath = path.resolve(
      process.cwd(),
      "public/assets/altaj-virani-resume.md",
    );
    if (fs.existsSync(resumePath)) {
      cachedResumeMarkdown = fs.readFileSync(resumePath, "utf-8");
      return cachedResumeMarkdown;
    }
  } catch {
    cachedResumeMarkdown = "";
  }
  return cachedResumeMarkdown || "";
}

export interface AgentResponse {
  answer: string;
  sources: string[];
  chunks?: Array<{ id: string; title: string; source: string }>;
}

// Backwards compatibility alias while transitioning away from RAG naming
export type RAGResponse = AgentResponse;

export const SERVICE_UNAVAILABLE_RESPONSE: AgentResponse = {
  answer:
    "The AI Twin assistant is momentarily unavailable due to connectivity issues. You can explore Altaj's verified accomplishments across the portfolio sections above, review his full resume in the Assets section, or reach out directly via the Contact section below!",
  sources: ["altaj-virani-resume.pdf"],
  chunks: [
    {
      id: "service_notice",
      title: "Service Availability Notice",
      source: "altaj-virani-resume.pdf",
    },
  ],
};

/**
 * Grounded AI Agent reasoning engine.
 * Directly grounds every query in Altaj's verified canonical resume loaded from the Version Control Engine.
 */
export async function processAgentQuery(
  query: string,
  history: Array<{ role: "user" | "model"; text: string }> = [],
  conversationId?: string,
): Promise<AgentResponse> {
  if (!query || query.length > 4000) {
    throw new Error("Invalid chat query.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  // 1. Check Response Cache for Standalone Queries (sub-1ms response)
  const isFollowUpQuery =
    history.length > 0 &&
    (query.length < 25 ||
      /\b(it|they|them|that|this|more|why|second|first|last)\b/i.test(query));

  if (!isFollowUpQuery) {
    const cached = responseCache.get(query);
    if (cached) {
      if (conversationId) {
        getChatMemory(conversationId)
          .then((mem) => {
            const nextRecent: ChatHistoryMessage[] = [
              ...mem.recentMessages,
              { role: "user" as const, text: query },
              { role: "model" as const, text: cached.answer },
            ].slice(-6);
            saveChatMemory(conversationId, {
              summary: mem.summary,
              recentMessages: nextRecent,
            });
          })
          .catch(() => {});
      }
      return {
        answer: cached.answer,
        sources: cached.sources,
        chunks: cached.chunks,
      };
    }
  }

  // 2. Intent Classification & Safety Guardrails
  const classification = await classifyQueryIntent(query, apiKey, modelName);

  if (classification.intent !== "IN_DOMAIN" && classification.staticResponse) {
    const staticResult = classification.staticResponse;
    responseCache.set(query, staticResult);

    if (conversationId) {
      getChatMemory(conversationId)
        .then((mem) => {
          const nextRecent: ChatHistoryMessage[] = [
            ...mem.recentMessages,
            { role: "user" as const, text: query },
            { role: "model" as const, text: staticResult.answer },
          ].slice(-6);
          saveChatMemory(conversationId, {
            summary: mem.summary,
            recentMessages: nextRecent,
          });
        })
        .catch(() => {});
    }

    return staticResult;
  }

  // 3. Grounded In-Domain Gemini LLM Processing with Dynamic Active Resume
  const boundedHistory = history.slice(-6).map((message) => ({
    role: message.role,
    text: message.text.slice(0, 4000),
  }));

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const memory = conversationId
        ? await getChatMemory(conversationId)
        : { summary: "", recentMessages: [] };
      const recentHistory = boundedHistory;

      // Dynamically load active resume markdown from version control
      const groundedResume = await getGroundedResumeMarkdown();

      const systemInstruction = `You are Altaj Virani's official AI Twin representative. You speak as Altaj (or on behalf of Altaj) in a confident, articulate, highly technical, and concise voice.
Ground every factual claim strictly and solely in Altaj's verified resume provided below.

CRITICAL GROUNDING PRINCIPLES:
1. Ground every factual claim in the verified resume below. Do not invent employers, projects, metrics, dates, or qualifications.
2. If the user asks about something not covered in the verified resume, state clearly and politely that the information is not available in Altaj's verified portfolio records.
3. Quote quantitative metrics accurately (e.g., 35× Key Vault reduction, 2,640 OOM errors eliminated, 35,500 load-test workflows, 9.00 CGPA, etc.).
4. Do not reveal internal or confidential systems, unverified proprietary data, or internal team identifiers.
5. Answer directly based on the context and conversation history.

=== VERIFIED RESUME OF ALTAJ VIRANI ===
${groundedResume}
`;

      const prompt = `Conversation summary of earlier turns:
${memory.summary || "No earlier summary."}

Recent conversation turns:
${[...memory.recentMessages, ...recentHistory]
  .slice(-6)
  .map((h) => `${h.role === "user" ? "User" : "Altaj AI Twin"}: ${h.text}`)
  .join("\n")}

User Question:
${query}

Please formulate a helpful, grounded response as Altaj Virani's AI Twin:`;

      const generatePromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Gemini API call exceeded 6.5s limit")),
          6500,
        ),
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (!response.text) {
        throw new Error("Gemini returned empty response text");
      }

      const answerText = response.text;
      const agentResponse: AgentResponse = {
        answer: answerText,
        sources: ["altaj-virani-resume.pdf"],
        chunks: [
          {
            id: "active_resume_document",
            title: "Verified Canonical Resume",
            source: "altaj-virani-resume.pdf",
          },
        ],
      };

      responseCache.set(query, agentResponse);

      if (conversationId) {
        const nextRecent: ChatHistoryMessage[] = [
          ...memory.recentMessages,
          { role: "user" as const, text: query },
          { role: "model" as const, text: answerText },
        ].slice(-6);

        saveChatMemory(conversationId, {
          summary: memory.summary,
          recentMessages: nextRecent,
        }).catch((err) => console.warn("Background chat memory save failed:", err));
      }

      return agentResponse;
    } catch (err: unknown) {
      console.error("Gemini live call error:", err);
      return SERVICE_UNAVAILABLE_RESPONSE;
    }
  }

  // Offline development fallback
  return {
    answer:
      "Hello! I am Altaj Virani's AI Twin. In local preview mode without a live GEMINI_API_KEY, I can confirm Altaj is a Software Engineer specializing in Azure AI, Model Context Protocol (MCP), and enterprise agent platforms. Explore the timeline and skills above!",
    sources: ["altaj-virani-resume.pdf"],
  };
}

// Backwards compatibility alias
export const processRAGQuery = processAgentQuery;
