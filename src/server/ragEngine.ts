import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import fs from 'node:fs';
import path from 'node:path';
import { getChatMemory, saveChatMemory, type ChatHistoryMessage } from './chatMemory.ts';
import { responseCache } from './responseCache.ts';
import { classifyQueryIntent } from './intentClassifier.ts';

let cachedResumeMarkdown: string | null = null;

export function getResumeMarkdown(): string {
  if (cachedResumeMarkdown) return cachedResumeMarkdown;
  try {
    const resumePath = path.resolve(process.cwd(), 'public/assets/resume-altaj-virani.md');
    cachedResumeMarkdown = fs.readFileSync(resumePath, 'utf-8');
  } catch (err) {
    console.warn('Failed to read resume markdown from public/assets/resume-altaj-virani.md:', err);
    cachedResumeMarkdown = '';
  }
  return cachedResumeMarkdown;
}

export interface RAGResponse {
  answer: string;
  sources: string[];
  chunks?: Array<{ id: string; title: string; source: string }>;
}

export const SERVICE_UNAVAILABLE_RESPONSE: RAGResponse = {
  answer:
    "The AI Twin assistant is momentarily unavailable due to connectivity issues. You can explore Altaj's verified accomplishments across the portfolio sections above, review his full resume in the Assets section, or reach out directly via the Contact section below!",
  sources: ["resume-altaj-virani.pdf"],
  chunks: [
    {
      id: "service_notice",
      title: "Service Availability Notice",
      source: "resume-altaj-virani.pdf",
    },
  ],
};

export async function processRAGQuery(
  query: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = [],
  conversationId?: string,
): Promise<RAGResponse> {
  if (!query || query.length > 4000) {
    throw new Error("Invalid chat query.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';

  // 1. Check Response Cache for Standalone Queries
  // For fresh or standalone queries, return cached responses in sub-1ms with 0 API tokens consumed.
  const isFollowUpQuery = history.length > 0 && (
    query.length < 25 || /\b(it|they|them|that|this|more|why|second|first|last)\b/i.test(query)
  );

  if (!isFollowUpQuery) {
    const cached = responseCache.get(query);
    if (cached) {
      if (conversationId) {
        getChatMemory(conversationId).then((mem) => {
          const nextRecent: ChatHistoryMessage[] = [
            ...mem.recentMessages,
            { role: "user" as const, text: query },
            { role: "model" as const, text: cached.answer },
          ].slice(-6);
          saveChatMemory(conversationId, {
            summary: mem.summary,
            recentMessages: nextRecent,
          });
        }).catch(() => {});
      }
      return {
        answer: cached.answer,
        sources: cached.sources,
        chunks: cached.chunks,
      };
    }
  }

  // 2. Intent Classification & Safety Guardrails
  // Fast regex heuristics + dedicated Gemini LLM classification for ambiguous/out-of-domain queries
  const classification = await classifyQueryIntent(query, apiKey, modelName);

  if (classification.intent !== 'IN_DOMAIN' && classification.staticResponse) {
    const staticResult = classification.staticResponse;
    responseCache.set(query, staticResult);

    if (conversationId) {
      getChatMemory(conversationId).then((mem) => {
        const nextRecent: ChatHistoryMessage[] = [
          ...mem.recentMessages,
          { role: "user" as const, text: query },
          { role: "model" as const, text: staticResult.answer },
        ].slice(-6);
        saveChatMemory(conversationId, {
          summary: mem.summary,
          recentMessages: nextRecent,
        });
      }).catch(() => {});
    }

    return staticResult;
  }

  // 3. Grounded In-Domain Gemini LLM Processing
  const boundedHistory = history
    .slice(-6)
    .map((message) => ({
      role: message.role,
      text: message.text.slice(0, 4000),
    }));

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const memory = conversationId ? await getChatMemory(conversationId) : { summary: "", recentMessages: [] };
      const recentHistory = boundedHistory;
      const systemInstruction = `You are Altaj Virani's official AI Twin representative. You speak as Altaj (or on behalf of Altaj) in a confident, articulate, highly technical, and concise voice.
Ground every factual claim strictly and solely in Altaj's verified resume provided below.

CRITICAL GROUNDING PRINCIPLES:
1. Ground every factual claim in the verified resume below. Do not invent employers, projects, metrics, dates, or qualifications.
2. If the user asks about something not covered in the verified resume, state clearly and politely that the information is not available in Altaj's verified portfolio records.
3. Quote quantitative metrics accurately (e.g., 35× Key Vault reduction, 2,640 OOM errors eliminated, 35,500 load-test workflows, 9.00 CGPA, etc.).
4. Do not reveal internal or confidential systems, unverified proprietary data, or internal team identifiers.
5. Answer directly based on the context and conversation history. End naturally with "[Source: resume-altaj-virani.pdf]" when resume evidence is used.

=== VERIFIED RESUME OF ALTAJ VIRANI ===
${getResumeMarkdown()}
`;

      const prompt = `Conversation summary of earlier turns:
${memory.summary || "No earlier summary."}

Recent conversation turns:
${[...memory.recentMessages, ...recentHistory]
  .slice(-6)
  .map((h) => `${h.role === 'user' ? 'User' : 'Altaj AI Twin'}: ${h.text}`)
  .join('\n')}

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
        setTimeout(() => reject(new Error('Gemini API call exceeded 6.5s limit')), 6500)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      if (!response.text) {
        throw new Error("Gemini returned empty response text");
      }

      const answerText = response.text;
      const ragResponse: RAGResponse = {
        answer: answerText,
        sources: ["resume-altaj-virani.pdf"],
        chunks: [{ id: "verified_resume", title: "Altaj Virani Verified Resume", source: "resume-altaj-virani.pdf" }],
      };

      // Cache the generated answer for future requests
      if (!isFollowUpQuery) {
        responseCache.set(query, ragResponse);
      }

      if (conversationId) {
        const nextRecent: ChatHistoryMessage[] = [
          ...memory.recentMessages,
          { role: "user" as const, text: query },
          { role: "model" as const, text: answerText },
        ].slice(-6);
        const needsSummary = nextRecent.length >= 6;
        let summary = memory.summary;
        if (needsSummary) {
          const summaryPromise = ai.models.generateContent({
            model: modelName,
            contents: `Summarize this portfolio chat in 3 concise sentences. Preserve user interests, important follow-up topics, and unanswered questions.\n\nPrevious summary: ${memory.summary || "None"}\n\nConversation:\n${nextRecent.map((message) => `${message.role}: ${message.text}`).join('\n')}`,
            config: {
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          });
          const summaryTimeout = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Gemini summary call exceeded timeout")), 3500)
          );
          let summaryResponse: Awaited<typeof summaryPromise>;
          try {
            summaryResponse = await Promise.race([summaryPromise, summaryTimeout]);
          } catch {
            summaryResponse = { text: undefined } as Awaited<typeof summaryPromise>;
          }
          summary = (summaryResponse.text || summary).slice(0, 4000);
        }
        await saveChatMemory(conversationId, {
          summary,
          recentMessages: needsSummary ? [] : nextRecent,
        });
      }

      return ragResponse;
    } catch (err: unknown) {
      console.warn('Gemini API call failed, returning service notice:', err);
    }
  }

  // Single clean fallback if Gemini is unreachable or unconfigured
  return SERVICE_UNAVAILABLE_RESPONSE;
}
