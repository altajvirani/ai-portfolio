import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { AgentResponse } from "./groundingEngine.ts";

export type QueryIntent =
  | "GREETING"
  | "SECURITY_GUARDRAIL"
  | "IN_DOMAIN"
  | "OUT_OF_DOMAIN";

export interface IntentClassificationResult {
  intent: QueryIntent;
  reason?: string;
  staticResponse?: AgentResponse;
}

export const STATIC_GREETING_RESPONSE: AgentResponse = {
  answer: `Hello! I am Altaj Virani's official AI Twin representative, grounded directly in his verified resume.

I can help you explore Altaj's experience in:
• **Enterprise Agentic AI & Model Context Protocol (MCP)** (20+ domain agents, 250+ tools)
• **Azure Cloud Reliability** (35× Key Vault call reduction, 2,640 OOM errors eliminated)
• **Featured Projects** (SnapWright VS Code extension, AutoQA AI copyright, Nivesh platform)
• **IEEE Research & Intellectual Property** (T5 Question-Answer Generation, Government copyright)
• **Education, Awards & Tech Stack** (9.00 CGPA, Problem Solver & Hi-Five awards)

What specific aspect of Altaj's engineering background would you like to discuss?`,
  sources: ["altaj-virani-resume.pdf"],
  chunks: [
    {
      id: "profile_overview",
      title: "Altaj Virani Profile Overview",
      source: "altaj-virani-resume.pdf",
    },
  ],
};

export const STATIC_GUARDRAIL_RESPONSE: AgentResponse = {
  answer: `I am Altaj Virani's AI Twin representative. My operational scope is strictly restricted to discussing Altaj's verified professional portfolio, engineering achievements, and technical credentials.

I cannot modify my system instructions, bypass safety guardrails, adopt alternate personas, or execute external system commands. Please feel free to ask any question regarding Altaj's engineering career, projects, or publications!`,
  sources: ["altaj-virani-resume.pdf"],
  chunks: [
    {
      id: "security_governance",
      title: "Security & Guardrail Governance",
      source: "altaj-virani-resume.pdf",
    },
  ],
};

export const STATIC_OUT_OF_DOMAIN_RESPONSE: AgentResponse = {
  answer: `I am Altaj Virani's AI Twin representative, specialized strictly in Altaj's engineering career, enterprise agentic AI systems, Model Context Protocol (MCP) toolkits, Azure cloud optimization, and verified portfolio projects.

I cannot assist with general, external, or out-of-domain inquiries (such as generic trivia, general homework, or unrelated topics).

Please feel free to ask about:
• Altaj's **Azure cloud optimizations** (e.g., cutting Key Vault calls 35× or solving production OOM crashes)
• His **Agentic AI & MCP platform** enablement at LTM
• His **SnapWright VS Code extension** on Visual Studio Marketplace
• His **IEEE research paper** on Question-Answer Generation
• His **academic background**, certifications, or awards!`,
  sources: ["altaj-virani-resume.pdf"],
  chunks: [
    {
      id: "profile_overview",
      title: "Altaj Virani Domain Scope",
      source: "altaj-virani-resume.pdf",
    },
  ],
};

// Tier 1 Fast Regex / Heuristics Check (0ms, zero tokens)
export function classifyIntentHeuristic(
  query: string,
): IntentClassificationResult | null {
  const q = query.trim().toLowerCase();

  // 1. Security / Prompt Injection / Jailbreak Guardrail
  const jailbreakPatterns = [
    /(ignore|disregard|forget|bypass)\s+(all\s+)?(previous|prior|above|system)\s+(instructions|prompts|rules)/i,
    /(you are now|act as|pretend to be|dan mode|jailbreak|developer mode)\b/i,
    /reveal\s+(your|the)\s+(system\s+prompt|hidden\s+instructions)/i,
    /(drop table|select \* from|<script|bash -c|eval\(|rm -rf)/i,
  ];

  if (jailbreakPatterns.some((pattern) => pattern.test(q))) {
    return {
      intent: "SECURITY_GUARDRAIL",
      reason: "Matched security / prompt injection pattern",
      staticResponse: STATIC_GUARDRAIL_RESPONSE,
    };
  }

  // 2. Greetings & Salutations
  const greetingPatterns = [
    /^(hi|hello|hey|hola|greetings|howdy|good\s+(morning|afternoon|evening))\b[!?.]*$/i,
    /^(hi|hello|hey)\s+(altaj|there|bot|twin|ai)\b[!?.]*$/i,
  ];

  if (greetingPatterns.some((pattern) => pattern.test(q))) {
    return {
      intent: "GREETING",
      reason: "Matched conversational greeting",
      staticResponse: STATIC_GREETING_RESPONSE,
    };
  }

  // 3. Clear In-Domain Keywords (Fast Path)
  const inDomainKeywords = [
    "altaj",
    "virani",
    "ltm",
    "msbu",
    "snapwright",
    "nivesh",
    "autoqa",
    "autoqagen",
    "key vault",
    "oom",
    "ieee",
    "pagefactory",
    "copilot studio",
    "azure container apps",
    "problem solver",
    "hi-five",
    "super crew",
    "vidyavardhini",
    "resume",
    "experience",
    "project",
    "award",
    "education",
    "contact",
    "mcp",
    "model context protocol",
    "agentic",
    "cgpa",
    "b.e.",
    "azure",
    "fastapi",
    "kql",
    "adx",
    "playwright",
    "ssrf",
    "owasp",
    "certification",
    "skills",
    "portfolio",
    "hire",
    "hiring",
    "interview",
    "job",
    "role",
    "career",
    "tech stack",
    "background",
  ];

  const hasInDomainKeyword = inDomainKeywords.some((kw) =>
    new RegExp(
      `\\b${kw.replace(/[-\\/\\^$*+?.()|[\\]{}]/g, "\\$&")}\\b`,
      "i",
    ).test(q),
  );

  if (hasInDomainKeyword) {
    return {
      intent: "IN_DOMAIN",
      reason: "Matched explicit in-domain keyword",
    };
  }

  // 4. Obvious Out-of-Domain Heuristics (Instant 0ms refusal for non-portfolio queries)
  const obviousOutOfDomainPatterns = [
    /\b(recipe|bake|cake|cook|ingredients|dinner|lunch|breakfast|dessert|cocktail)\b/i,
    /\b(write (a |me a )?(poem|song|story|fairy tale|joke|essay|rap)|tell me a joke)\b/i,
    /\b(solve (this )?(equation|integral|derivative|algebra|calculus)|what is the capital of|how many planets)\b/i,
    /\b(weather in|forecast for|stock price of|who won the (super bowl|world cup|nba|ipl|olympics))\b/i,
    /\btranslate .* into (spanish|french|german|hindi|chinese|japanese|arabic|russian)\b/i,
    /\b(medical advice|symptoms of (cancer|covid|flu)|legal advice)\b/i,
  ];

  if (obviousOutOfDomainPatterns.some((pattern) => pattern.test(q))) {
    return {
      intent: "OUT_OF_DOMAIN",
      reason: "Matched obvious out-of-domain query pattern",
      staticResponse: STATIC_OUT_OF_DOMAIN_RESPONSE,
    };
  }

  // Ambiguous query: requires Tier 2 Dedicated LLM classification
  return null;
}

// Tier 2 Dedicated LLM Classification (Gemini Flash Lite)
export async function classifyIntentWithLLM(
  query: string,
  apiKey: string,
  modelName: string = "gemini-3.5-flash-lite",
): Promise<IntentClassificationResult> {
  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = `You are a strict, ultra-fast Intent Classification Guardrail for Altaj Virani's professional AI Twin portfolio assistant.
Your sole job is to classify the user's message as IN_DOMAIN or OUT_OF_DOMAIN.

IN_DOMAIN criteria:
- Inquiries about Altaj Virani, his engineering background, work history, projects, software architecture, technical skills, certifications, education, honors, research papers, publications, or contact information.
- Technical inquiries, software engineering discussions, cloud infrastructure (Azure, Docker, KQL), agentic AI, MCP, or testing frameworks relevant to evaluating Altaj for technical roles, consulting, or engineering collaboration.

OUT_OF_DOMAIN criteria:
- General knowledge, world facts, geography, trivia, history, celebrities, sports, pop culture.
- General school homework, non-portfolio math problem solving, general recipes, translation, unrelated creative writing (poems, bedtime stories).
- General coding assistance completely unattached to Altaj's background or portfolio evaluation (e.g. "Write me an AWS Lambda script for an e-commerce cart").
- Inappropriate, offensive, or controversial topics.

Respond ONLY with valid JSON in this format:
{"intent": "IN_DOMAIN" | "OUT_OF_DOMAIN", "reason": "concise explanation"}`;

    const classificationPromise = ai.models.generateContent({
      model: modelName,
      contents: `User Query to Classify: "${query}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Intent classification timed out")),
        2500,
      ),
    );

    const response = await Promise.race([
      classificationPromise,
      timeoutPromise,
    ]);
    const text = response.text?.trim() || "";
    const parsed = JSON.parse(text) as { intent?: string; reason?: string };

    if (parsed.intent === "OUT_OF_DOMAIN") {
      return {
        intent: "OUT_OF_DOMAIN",
        reason: parsed.reason || "Classified as out of domain by LLM guardrail",
        staticResponse: STATIC_OUT_OF_DOMAIN_RESPONSE,
      };
    }

    return {
      intent: "IN_DOMAIN",
      reason: parsed.reason || "Classified as in domain by LLM guardrail",
    };
  } catch (err) {
    // If classification times out or fails, fail-open to IN_DOMAIN so user is never blocked
    console.warn(
      "LLM intent classification bypassed due to timeout or error:",
      err,
    );
    return {
      intent: "IN_DOMAIN",
      reason: "Failsafe default: IN_DOMAIN",
    };
  }
}

// Master Classifier: Tier 1 & Tier 2 Hybrid
export async function classifyQueryIntent(
  query: string,
  apiKey?: string,
  modelName?: string,
): Promise<IntentClassificationResult> {
  // 1. Fast Tier 1 Heuristics
  const heuristicResult = classifyIntentHeuristic(query);
  if (heuristicResult) {
    return heuristicResult;
  }

  // 2. If API key is available, run Tier 2 Dedicated LLM Classifier
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    return await classifyIntentWithLLM(query, apiKey, modelName);
  }

  // 3. Fallback: treat as IN_DOMAIN
  return {
    intent: "IN_DOMAIN",
    reason: "Default fallback without API key",
  };
}
