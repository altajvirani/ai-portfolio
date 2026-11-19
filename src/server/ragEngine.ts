import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { KNOWLEDGE_STORE, KnowledgeChunk } from './knowledgeStore.ts';
import { getChatMemory, saveChatMemory, type ChatHistoryMessage } from './chatMemory.ts';

export interface RAGResponse {
  answer: string;
  sources: string[];
  chunks: Array<{ id: string; title: string; source: string }>;
}

export function searchKnowledge(query: string, topK = 4): KnowledgeChunk[] {
  if (!query || !query.trim()) {
    return KNOWLEDGE_STORE.slice(0, topK);
  }

  const queryLower = query.toLowerCase();
  const rawTokens = queryLower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  // Common stop words to deprioritize
  const stopWords = new Set(['what', 'when', 'where', 'which', 'who', 'whom', 'this', 'that', 'from', 'with', 'about', 'tell', 'does', 'have', 'more', 'your']);
  const tokens = rawTokens.filter((t) => !stopWords.has(t));
  const searchTokens = tokens.length > 0 ? tokens : rawTokens;

  const scored = KNOWLEDGE_STORE.map((chunk) => {
    let score = 0;
    const contentLower = chunk.content.toLowerCase();
    const titleLower = chunk.title.toLowerCase();

    // Exact phrase match bonus
    if (contentLower.includes(queryLower)) score += 30;
    if (titleLower.includes(queryLower)) score += 50;

    // Token matching across content, keywords, and title
    for (const token of searchTokens) {
      if (titleLower.includes(token)) score += 15;
      if (chunk.keywords.some((kw) => kw.includes(token))) score += 12;

      // Count occurrences in content
      const regex = new RegExp(`\\b${token}`, 'gi');
      const matches = contentLower.match(regex);
      if (matches) {
        score += Math.min(matches.length * 3, 15);
      }
    }

    // Specific domain intent boosts
    if ((queryLower.includes('agentic') || queryLower.includes('operations platform')) && chunk.id === 'agentic_ai_platform') score += 40;
    if ((queryLower.includes('mcp') || queryLower.includes('model context protocol')) && (chunk.id === 'agentic_ai_platform' || chunk.id === 'enterprise_ai_applications')) score += 35;
    if ((queryLower.includes('key vault') || queryLower.includes('cache') || queryLower.includes('35x')) && chunk.id === 'key_vault_optimization') score += 40;
    if ((queryLower.includes('oom') || queryLower.includes('memory') || queryLower.includes('crash')) && chunk.id === 'oom_root_cause_scaling') score += 40;
    if ((queryLower.includes('load') || queryLower.includes('scale') || queryLower.includes('capacity')) && chunk.id === 'load_testing_capacity_suite') score += 35;
    if ((queryLower.includes('owasp') || queryLower.includes('ssrf') || queryLower.includes('security') || queryLower.includes('dast') || queryLower.includes('compliance')) && chunk.id === 'security_governance') score += 42;
    if ((queryLower.includes('ieee') || queryLower.includes('paper') || queryLower.includes('publication') || queryLower.includes('research')) && chunk.id === 'research_publications') score += 45;
    if ((queryLower.includes('copyright') || queryLower.includes('patent') || queryLower.includes('autoqa ai') || queryLower.includes('offline')) && (chunk.id === 'patents_copyrights' || chunk.id === 'notable_projects')) score += 42;
    if ((queryLower.includes('snapwright') || queryLower.includes('vscode') || queryLower.includes('extension') || queryLower.includes('pagefactory') || queryLower.includes('pom')) && chunk.id === 'notable_projects') score += 45;
    if ((queryLower.includes('nivesh') || queryLower.includes('crowdfunding') || queryLower.includes('investment') || queryLower.includes('startup')) && chunk.id === 'notable_projects') score += 45;
    if ((queryLower.includes('award') || queryLower.includes('spot') || queryLower.includes('badge') || queryLower.includes('honor') || queryLower.includes('recognition')) && chunk.id === 'awards_recognition') score += 45;
    if ((queryLower.includes('skill') || queryLower.includes('stack') || queryLower.includes('tech') || queryLower.includes('python') || queryLower.includes('c#')) && chunk.id === 'technical_skills_matrix') score += 32;
    if ((queryLower.includes('education') || queryLower.includes('degree') || queryLower.includes('cgpa') || queryLower.includes('college') || queryLower.includes('certif')) && chunk.id === 'education_certifications') score += 45;
    if ((queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('location') || queryLower.includes('who is') || queryLower.includes('about altaj') || queryLower.includes('experience')) && chunk.id === 'profile_overview') score += 30;

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

export function synthesizeGroundedAnswer(
  query: string,
  chunks: KnowledgeChunk[],
  _sources: string[],
): string {
  const stopWords = new Set([
    'what', 'when', 'where', 'which', 'who', 'whom', 'this', 'that', 'from',
    'with', 'about', 'tell', 'does', 'have', 'more', 'your', 'has', 'altaj',
    'virani', 'how', 'did', 'the', 'and', 'for', 'are', 'was',
  ]);
  const qLower = query.toLowerCase();
  const tokens = qLower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stopWords.has(t));

  // Focus tightly on primary topic chunks when query contains specific topic tokens
  const scoredChunks = chunks.map((chunk, chunkIdx) => {
    const titleLower = chunk.title.toLowerCase();
    const contentLower = chunk.content.toLowerCase();
    let topicHits = 0;
    for (const tok of tokens) {
      if (titleLower.includes(tok)) topicHits += 3;
      if (chunk.keywords.some((kw) => kw.includes(tok))) topicHits += 2;
      if (contentLower.includes(tok)) topicHits += 1;
    }
    return { chunk, topicHits, chunkIdx };
  });

  const maxHits = Math.max(...scoredChunks.map((c) => c.topicHits), 0);
  const selectedChunks = scoredChunks
    .filter((item, i) => i === 0 || (maxHits > 0 && item.topicHits >= Math.ceil(maxHits * 0.65)))
    .slice(0, 2)
    .map((item) => item.chunk);

  const sections = selectedChunks.map((chunk) => {
    const rawLines = chunk.content
      .split('\n')
      .map((l) => l.trim().replace(/\*\*/g, ''))
      .filter((l) => l.length > 0);

    const scoredLines = rawLines.map((line, idx) => {
      const lower = line.toLowerCase();
      let relevance = idx === 0 ? 1 : 0;
      for (const tok of tokens) {
        if (lower.includes(tok)) relevance += 4;
      }
      if (lower.startsWith('-') || lower.startsWith('•') || /^\d+\./.test(lower)) {
        relevance += 1;
      }
      return { line: line.replace(/^[-•]\s*/, ''), relevance, idx };
    });

    scoredLines.sort((a, b) => b.relevance - a.relevance || a.idx - b.idx);
    const chosen = scoredLines
      .slice(0, 6)
      .sort((a, b) => a.idx - b.idx)
      .map((item) => `• ${item.line}`);

    return `${chunk.title}\n${chosen.join('\n')}`;
  });

  return sections.join('\n\n');
}

export async function processRAGQuery(
  query: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = [],
  conversationId?: string,
): Promise<RAGResponse> {
  if (!query || query.length > 4000) {
    throw new Error("Invalid chat query.");
  }
  const boundedHistory = history
    .slice(-6)
    .map((message) => ({
      role: message.role,
      text: message.text.slice(0, 4000),
    }));
  const relevantChunks = searchKnowledge(query, 3);
  const sources = Array.from(new Set(relevantChunks.map((c) => c.source)));

  const contextText = relevantChunks
    .map((c, i) => `[Source Document #${i + 1}: ${c.source} - ${c.title}]\n${c.content}`)
    .join('\n\n---\n\n');

  const apiKey = process.env.GEMINI_API_KEY;

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
      const systemInstruction = `You are Altaj Virani's AI Twin representative.
Speak confidently, concisely, and in the first person only when answering as Altaj.
Ground every factual claim in the supplied resume File Search results.
Do not invent employers, projects, metrics, dates, or qualifications.
If the answer is not supported by the retrieved resume evidence, say that it is not available in the supplied portfolio information.
Do not reveal internal or confidential systems or names.

CORE PRINCIPLES:
1. Use the retrieved PDF passages as the primary source.
2. Use the concise conversation summary and recent turns for follow-up context.
3. Cite the resume and include quantitative details only when supported.
4. End naturally with "[Source: resume-altaj-virani.pdf]" when resume evidence is used.`;

      const storeName = process.env.GEMINI_FILE_SEARCH_STORE_NAME;
      const prompt = `Conversation summary:
${memory.summary || "No earlier summary."}

Recent conversation:
${[...memory.recentMessages, ...recentHistory]
  .slice(-6)
  .map((h) => `${h.role === 'user' ? 'User' : 'Altaj AI Twin'}: ${h.text}`)
  .join('\n')}

User Question:
${query}

Please formulate a helpful, grounded response:`;

      const generatePromise = ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
        contents: prompt,
        config: {
          systemInstruction,
          tools: storeName ? [{
            fileSearch: {
              fileSearchStoreNames: [storeName],
              topK: 6,
            },
          }] : undefined,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call exceeded 6.5s limit')), 6500)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      const answerText = response.text || synthesizeGroundedAnswer(query, relevantChunks, sources);
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
            model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
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

      return {
        answer: answerText,
        sources,
        chunks: relevantChunks.map((c) => ({ id: c.id, title: c.title, source: c.source })),
      };
    } catch (err: unknown) {
      console.warn('Gemini API call failed, using dynamic grounded synthesizer:', err);
    }
  }

  return {
    answer: synthesizeGroundedAnswer(query, relevantChunks, sources),
    sources,
    chunks: relevantChunks.map((c) => ({ id: c.id, title: c.title, source: c.source })),
  };
}
