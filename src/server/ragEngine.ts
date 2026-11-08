import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { KNOWLEDGE_STORE, KnowledgeChunk } from './knowledgeStore.ts';

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
    if (queryLower.includes('viki') && chunk.id === 'viki_ai_platform') score += 40;
    if ((queryLower.includes('mcp') || queryLower.includes('model context protocol')) && (chunk.id === 'viki_ai_platform' || chunk.id === 'enterprise_ai_applications')) score += 35;
    if ((queryLower.includes('key vault') || queryLower.includes('cache') || queryLower.includes('35x')) && chunk.id === 'key_vault_optimization') score += 40;
    if ((queryLower.includes('oom') || queryLower.includes('memory') || queryLower.includes('crash')) && chunk.id === 'oom_root_cause_scaling') score += 40;
    if ((queryLower.includes('load') || queryLower.includes('scale') || queryLower.includes('capacity')) && chunk.id === 'load_testing_capacity_suite') score += 35;
    if ((queryLower.includes('ieee') || queryLower.includes('paper') || queryLower.includes('publication') || queryLower.includes('research')) && chunk.id === 'research_publications') score += 45;
    if ((queryLower.includes('snapwright') || queryLower.includes('vscode') || queryLower.includes('extension') || queryLower.includes('pagefactory') || queryLower.includes('pom')) && chunk.id === 'notable_projects') score += 45;
    if ((queryLower.includes('nivesh') || queryLower.includes('crowdfunding') || queryLower.includes('investment') || queryLower.includes('startup')) && chunk.id === 'notable_projects') score += 45;
    if ((queryLower.includes('award') || queryLower.includes('spot') || queryLower.includes('badge')) && chunk.id === 'awards_recognition') score += 40;
    if ((queryLower.includes('skill') || queryLower.includes('stack') || queryLower.includes('tech') || queryLower.includes('python')) && chunk.id === 'technical_skills_matrix') score += 30;
    if ((queryLower.includes('education') || queryLower.includes('degree') || queryLower.includes('cgpa') || queryLower.includes('college')) && chunk.id === 'education_certifications') score += 40;

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

export async function processRAGQuery(
  query: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<RAGResponse> {
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

      const systemInstruction = `You are Altaj Virani's official AI Twin representative. You speak as Altaj (or on behalf of Altaj) in a confident, articulate, highly technical, and professional voice.
Your knowledge is strictly grounded in Altaj's verified resume documents:
- altaj-virani-resume.pdf
- altaj-virani_ltm-resume.pdf

STRICT CORE PRINCIPLES:
1. Speak knowledgeably about Altaj's real projects: Viki-AI (Microsoft's agentic AI platform for Azure network engineering), Model Context Protocol (MCP) server toolkits, 35x Key Vault call reduction with 12h shared cache, 2,640 zero-OOM memory resolution, 13-phase load testing (35,500 workflows), IEEE publication on T5 question answering, Government of India copyright for AutoQA AI, SnapWright VS Code extension, and Nivesh startup crowdfunding platform.
2. Ground all answers strictly in the provided resume context.
3. Be direct, clear, and quantitative (cite metrics like 35x reduction, 80% troubleshooting acceleration, 95% accuracy, 9.00 CGPA).
4. Conclude or cite sources naturally at the bottom (e.g., [Source: altaj-virani_ltm-resume.pdf]).`;

      const prompt = `Context knowledge retrieved from Altaj Virani's verified resumes:
${contextText}

Previous conversation:
${history.map((h) => `${h.role === 'user' ? 'User' : 'Altaj AI Twin'}: ${h.text}`).join('\n')}

User Question:
${query}

Please formulate a helpful, grounded response:`;

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API call exceeded 8s limit')), 8000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);

      const answerText = response.text || 'I could not generate an answer from the resume knowledge base.';

      return {
        answer: answerText,
        sources,
        chunks: relevantChunks.map((c) => ({ id: c.id, title: c.title, source: c.source })),
      };
    } catch (err: unknown) {
      console.warn('Gemini API call failed, using intelligent grounded RAG fallback:', err);
    }
  }

  // Dynamic intelligent grounded fallback when API key is unconfigured or in local offline mode
  const qLower = query.toLowerCase();
  let naturalAnswer = '';

  if (qLower.includes('snapwright') || qLower.includes('vscode') || qLower.includes('pagefactory')) {
    naturalAnswer = `I architected and published **SnapWright**, an open-source Visual Studio Code extension on the official marketplace (\`altajvirani.snapwright\`).\n\nKey highlights:\n• Engineered with TypeScript and the VS Code Extension API using a singleton PageFactory pattern.\n• Automates Page Object Model (POM) generation with smart class-name and path detection, preventing duplicate imports and eliminating memory leaks in enterprise test suites.\n• Successfully migrated internal Copilot Studio automation frameworks to adopt this extension, markedly accelerating execution efficiency.\n\n[Source: altaj-virani-resume.pdf (Page 2) & VS Code Marketplace]`;
  } else if (qLower.includes('nivesh') || qLower.includes('crowdfunding') || qLower.includes('startup') || qLower.includes('invest')) {
    naturalAnswer = `**Nivesh** is an open-source Android mobile application I engineered to democratize early-stage venture funding and startup crowdfunding.\n\nKey capabilities:\n• Enables aspiring startup founders to present pitch decks and track seed funding in real time.\n• Offers accredited angel investors and micro-backers transparent equity tracking and milestone dashboards.\n• Built on native Android Java with Material Design UI, Firebase real-time persistence, and secure REST APIs.\n\n[Source: Verified Project Portfolios & GitHub (altajvirani/Nivesh)]`;
  } else if (qLower.includes('key vault') || qLower.includes('35x') || qLower.includes('cache')) {
    naturalAnswer = `In my work on Azure Container Apps, I diagnosed an issue where backend microservices were re-downloading certificates from Azure Key Vault every ~2 minutes without releasing them, while production requested a non-existent staging certificate (~13% lookup failure rate).\n\n• **Resolution**: I designed a shared 12-hour distributed memory cache with automatic refresh and expiry protection, corrected endpoint lookups, and enforced strict mutual TLS validation with 16 xUnit unit tests.\n• **Result**: Cut production Key Vault calls 35× (from 2,807 down to 79/day) and reduced failed lookups to absolute zero.\n\n[Source: altaj-virani-resume.pdf (Page 1) & Work Description for Viki-AI]`;
  } else if (qLower.includes('viki') || qLower.includes('mcp') || qLower.includes('agent')) {
    naturalAnswer = `I am a core engineer contributing to **Viki-AI**, Microsoft's internal agentic operations platform serving global Azure datacenter networking teams.\n\n• **Model Context Protocol (MCP)**: Co-developed standardized MCP server toolkits enabling 20+ specialized AI agents to call over 250+ integrated operational tools.\n• **Hybrid RAG & Automation**: Combined direct search, autonomous reasoning, and vector indexing to slash incident troubleshooting time by 80% for 200+ on-call engineers across 150+ automated playbooks.\n\n[Source: altaj-virani_ltm-resume.pdf (Page 3)]`;
  } else if (qLower.includes('oom') || qLower.includes('memory') || qLower.includes('kql')) {
    naturalAnswer = `I resolved persistent production out-of-memory (OOM) failures in the workflow-execution service that peaked at 2,640 errors per 30 days.\n\n• **Investigation**: Using KQL and Application Insights, I proved auto-scaling was disabled and the actual bottleneck was the .NET runtime's 768 MB heap cap rather than the 1 GB container.\n• **Outcome**: Sized required capacity and migrated the service to dedicated auto-scaling compute, permanently sustaining errors at zero.\n\n[Source: altaj-virani-resume.pdf (Page 1)]`;
  } else {
    const highlights = relevantChunks
      .map((c) => `• **${c.title}** (${c.source}):\n${c.content.split('\n').filter(l => l.trim().startsWith('-') || l.trim().startsWith('•') || l.length > 35).slice(0, 2).map(l => `  ${l.trim()}`).join('\n')}`)
      .join('\n\n');
    naturalAnswer = `Here is the relevant verified information regarding your query:\n\n${highlights}\n\nFeel free to ask for deeper technical breakdowns on any of these systems!\n\n[Source: ${sources.join(', ')}]`;
  }

  return {
    answer: naturalAnswer,
    sources,
    chunks: relevantChunks.map((c) => ({ id: c.id, title: c.title, source: c.source })),
  };
}
