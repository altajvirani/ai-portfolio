export interface CachedAgentResponse {
  answer: string;
  sources: string[];
  chunks?: Array<{ id: string; title: string; source: string }>;
  timestamp: number;
  ttlMs: number;
  isPermanent?: boolean;
}

export type CachedRAGResponse = CachedAgentResponse;

export function normalizeQueryKey(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[’']/g, "'")
    .replace(/["“”]/g, "")
    .replace(/[?!.,;:()]/g, "")
    .replace(/\s+/g, " ");
}

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const MAX_CACHE_SIZE = 1000;

class ResponseCacheManager {
  private cache = new Map<string, CachedAgentResponse>();
  private hits = 0;
  private misses = 0;

  constructor() {
    this.seedCanonicalResponses();
  }

  private seedCanonicalResponses() {
    // 1. Key Vault 35x Optimization
    const keyVaultResponse: CachedRAGResponse = {
      answer: `Altaj eliminated a critical production reliability bottleneck in Azure Key Vault through the following engineering intervention:

- **The Problem:** The certificate used for backend network API authentication was being re-downloaded from Azure Key Vault every ~2 minutes and never released from memory. Additionally, production environments requested a non-existent staging certificate, causing ~13% of lookups to fail completely.
- **The Solution:** Altaj implemented an in-memory shared cache with a 12-hour refresh interval and proactive expiry protection. He corrected invalid certificate lookups and enforced strict TLS validation across 3 backend services with 16 comprehensive xUnit test suites.
- **Production Impact:** Key Vault calls dropped **35×**—from 2,807 down to just 79 requests per day. Failed lookups were reduced to **zero (0%)**.`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "key_vault_optimization",
          title: "Production Incident: Azure Key Vault 35x Call Reduction",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "how did altaj cut key vault calls 35x",
      "how did altaj cut key vault calls 35 times",
      "key vault 35x",
      "key vault optimization",
      "how did he cut key vault calls",
      "tell me about key vault optimization",
      "azure key vault 35x",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), keyVaultResponse));

    // 2. Agentic AI and MCP
    const agenticMcpResponse: CachedRAGResponse = {
      answer: `At LTM's Microsoft Business Unit (MSBU), Altaj plays a core engineering and leadership role in Enterprise Agentic AI:

- **Cross-Team Adoption:** Led engineering tracks across the business unit to adopt an enterprise agentic AI operations platform, collaborating directly with technical leads and on-call teams.
- **Model Context Protocol (MCP) Toolkits:** Co-built domain agents, automated playbooks, custom skills, and Copilot CLI plugins powered by Model Context Protocol (**20+ domain agents and 250+ tools**).
- **Conversational Assistants:** Engineered hybrid RAG chatbots using Azure Functions, Copilot Studio, and HNSW vector indexing—slashing troubleshooting duration by **80% for 200+ engineering users**.
- **Operational Tooling:** Implemented natural-language on-call rostering (**95% intent accuracy**), automated root-cause triage in Azure AI Foundry with automatic PII redaction, and deployed containerized MCP servers to Azure Container Apps.`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "agentic_ai_platform",
          title:
            "Enterprise Agentic AI Operations Platform & Model Context Protocol (MCP)",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "what is altaj's role with agentic ai and mcp",
      "what is altaj role with agentic ai and mcp",
      "agentic ai and mcp",
      "altaj role with agentic ai",
      "mcp and agentic ai",
      "model context protocol",
      "tell me about his agentic ai platform",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), agenticMcpResponse));

    // 3. Honors and Awards
    const awardsResponse: CachedRAGResponse = {
      answer: `Altaj has received multiple prominent enterprise and spot recognitions for high-impact engineering:

- **Problem Solver Badge (September 2026):** Nominated for technical contributions to agentic operations tooling and enterprise AI initiatives at LTM.
- **Hi-Five Spot Award (November 2025):** Recognized for consistently exceeding expectations and demonstrating exceptional innovation in developing AI use cases.
- **Super Crew Spot Award (August 2025 & October 2025):** Awarded alongside his team for architecting and deploying compliant, enterprise-grade Generative AI and Automation systems.
- **Hi-Five Spot Award (July 2025):** Commended for leading QA framework stability improvements, system migrations, and independently engineering automation tools that boosted developer productivity.
- **Government of India Copyright:** Formally granted copyright for his proprietary automated QA methodology (**AutoQA AI**).`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "awards_recognition",
          title: "Honors, Awards & Recognition",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "what awards has altaj won",
      "what awards has altaj received",
      "awards and honors",
      "altaj awards",
      "recognitions",
      "has altaj won any awards",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), awardsResponse));

    // 4. SnapWright VS Code Extension
    const snapWrightResponse: CachedRAGResponse = {
      answer: `**SnapWright** is an open-source developer tool created by Altaj Virani and published on the official Visual Studio Marketplace (\`altajvirani.snapwright\`):

- **Tech Stack:** TypeScript, VS Code Extension API, Node.js, and Playwright.
- **Core Innovation:** Features an automated singleton-based **PageFactory** pattern that generates clean Page Object Model (POM) classes, standardizes imports, and eliminates memory leaks across large end-to-end test suites.
- **Internal Adoption:** Altaj led the migration of internal automation frameworks across his business unit to SnapWright, boosting smoke test coverage from 25% to 85% and significantly accelerating pipeline execution.`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "notable_projects",
          title: "Featured Projects & Open Source",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "tell me about snapwright vs code extension",
      "tell me about snapwright",
      "snapwright",
      "snapwright vs code extension",
      "what is snapwright",
      "snapwright extension",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), snapWrightResponse));

    // 5. IEEE Research & AutoQA AI
    const researchResponse: CachedRAGResponse = {
      answer: `Altaj has published peer-reviewed AI research and holds formal intellectual property:

- **IEEE Research Publication:**
  - *Title:* "Automatic Question Answer Generation using T5 and NLP"
  - *Conference:* IEEE International Conference on Smart City and Cloud Computing (IEEE ICSCSS 2023).
  - *Contribution:* Engineered a Question-Answer Generation (QAG) architecture combining Google T5 with Named Entity Recognition (NER), POS tagging, and Sense2Vec for automated distractor generation and question synthesis.
- **AutoQA AI (Government Copyright):**
  - Fully offline, privacy-first desktop QA application built with Python, Scikit-learn, NLTK, and KivyMD.
  - Queries local text documents without transmitting data to external servers using TF-IDF vectorization and cosine similarity.
  - Formally approved and registered copyright by the **Government of India (Copyright Office)**.`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "research_publications",
          title: "Research Publications & Intellectual Property",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "summarize his ieee research and autoqa ai",
      "summarize his ieee research",
      "ieee research and autoqa ai",
      "ieee paper",
      "autoqa ai",
      "tell me about his research",
      "research publications",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), researchResponse));

    // 6. Education & Certifications
    const educationResponse: CachedRAGResponse = {
      answer: `Altaj's academic credentials and cloud certifications include:

- **Bachelor of Engineering (B.E.) in Computer Engineering:**
  - *Institution:* Vidyavardhini's College of Engineering and Technology, University of Mumbai
  - *Graduated:* May 2023 | **CGPA: 9.00 / 10.0**
- **Diploma in Computer Engineering:**
  - *Institution:* Vidyavardhini's Bhausaheb Vartak Polytechnic
  - *Graduated:* November 2020 | **Aggregate: 94.00%**
- **Secondary School Certificate (SSC):**
  - *Institution:* Holy Paradise High School | Aggregate: 80.60%
- **Certifications:**
  - **Microsoft Certified: Azure AI Fundamentals (AI-900)**
  - Azure Functions Masterclass
  - Azure AI Studio / Azure AI Foundry`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "education_certifications",
          title: "Education & Academic Qualifications",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "what is his education & azure certification stack",
      "what is his education and azure certification stack",
      "what is his education",
      "education and certifications",
      "degree and cgpa",
      "azure certifications",
      "altaj education",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), educationResponse));

    // 7. Profile Overview / Who is Altaj
    const profileResponse: CachedRAGResponse = {
      answer: `**Altaj A. Virani** is an Azure AI Engineer based in Mumbai, India, specializing in enterprise Agentic AI Platforms, LLM integration, and cloud systems reliability:

- **Current Role:** Software Engineer at LTM (Microsoft Business Unit), leading cross-team adoption of Agentic AI, MCP toolkits (20+ domain agents, 250+ tools), and Azure cloud optimizations.
- **Track Record:** Eliminated 2,640 monthly production OOMs via KQL telemetry root-cause analysis and reduced Azure Key Vault calls by 35× (saving 2,700+ requests/day).
- **Tooling & Projects:** Author of **SnapWright** (VS Code extension on Visual Studio Marketplace), **AutoQA AI** (Government of India copyright), and IEEE-published research author.
- **Credentials:** B.E. in Computer Engineering (9.00 CGPA) & Microsoft Certified Azure AI Fundamentals (AI-900).`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "profile_overview",
          title: "Altaj Virani Profile Overview",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "who is altaj virani",
      "who is altaj",
      "tell me about altaj virani",
      "tell me about altaj",
      "about altaj",
      "introduce altaj",
      "overview of altaj",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), profileResponse));

    // 8. Contact Information
    const contactResponse: CachedRAGResponse = {
      answer: `You can connect with Altaj Virani directly through the following official channels:

- **Email:** [altajatwork@gmail.com](mailto:altajatwork@gmail.com)
- **Phone:** +91-730-393-4303
- **LinkedIn:** [linkedin.com/in/altajvirani](https://www.linkedin.com/in/altajvirani/)
- **GitHub:** [github.com/altajvirani](https://github.com/altajvirani)
- **Location:** Mumbai, India

You can also use the **Send an Inquiry** module in this portfolio to open a pre-filled email directly in Gmail, Outlook, Yahoo, or your default mail client!`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "profile_overview",
          title: "Contact & Verified Profiles",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "how can i contact altaj",
      "how to contact altaj",
      "contact altaj",
      "altaj email",
      "what is altaj's email",
      "phone number",
      "linkedin profile",
      "github profile",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), contactResponse));

    // 9. LTM Work Experience
    const ltmResponse: CachedRAGResponse = {
      answer: `Altaj has been engineering enterprise AI and cloud systems at **LTM (Microsoft Business Unit)** in Mumbai, India:

- **Software Engineer – Azure Network Engineering & AI Platform Enablement (June 2025 – Present):**
  - **Enterprise Agentic AI:** Led cross-team adoption of an enterprise agentic AI operations platform, co-building 20+ domain agents and 250+ tools via Model Context Protocol (MCP).
  - **Conversational Assistants:** Shipped Azure Functions + Copilot Studio chatbots with hybrid RAG and HNSW vector indexing, cutting troubleshooting time by 80% for 200+ engineers.
  - **Production Reliability:** Eliminated 2,640 monthly out-of-memory (OOM) errors via KQL telemetry root-cause analysis, and slashed Azure Key Vault calls 35× (from 2,807 down to 79/day).
  - **Load Testing & Security:** Built a 13-phase PowerShell/Azure CLI load test suite validating auto-scaling across 35,500 executions; enforced 100% compliance across production endpoints via OWASP Top 10, SSRF defense, and Azure SQL audit logging.
- **Software Engineer – Power Apps & Copilot Studio Engineering (Sept 2024 – June 2025):**
  - Automated 200+ Playwright TypeScript end-to-end tests using singleton PageFactory, boosting smoke test coverage from 25% to 85%.
  - Built custom VS Code extensions for automated Page Object Model (POM) generation.
- **Graduate Engineering Trainee (August 2023 – Sept 2024):**
  - Trained across Azure cloud services, enterprise C#/.NET development, and conversational AI frameworks.`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "ltm_experience",
          title: "LTM Microsoft Business Unit Work Experience",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "what is altaj's work experience",
      "what is altaj work experience",
      "tell me about his work experience",
      "tell me about his experience at ltm",
      "ltm experience",
      "ltimindtree",
      "work history",
      "what does altaj do at ltm",
      "altaj role at ltm",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), ltmResponse));

    // 10. Featured Projects (Nivesh, AutoQA AI, SnapWright, AutoQAGen)
    const projectsResponse: CachedRAGResponse = {
      answer: `Altaj's featured engineering and open-source projects include:

1. **SnapWright (VS Code Extension):**
   - Published on the official Visual Studio Marketplace (\`altajvirani.snapwright\`).
   - Built with TypeScript, Node.js, and Playwright; uses a singleton PageFactory pattern to automate POM class generation and prevent test-suite memory leaks.
2. **AutoQA AI (Government Copyrighted Desktop Application):**
   - Privacy-first offline QA tool querying local text documents via TF-IDF vectorization and cosine similarity (Python, Scikit-learn, NLTK, KivyMD). Formally granted copyright by the Government of India.
3. **AutoQAGen (Automated Question-Answer Generation Pipeline):**
   - Synthesizes multi-format QA pairs combining Google T5 with Named Entity Recognition (NER) and POS tagging, evaluated against SQuAD baselines with a BERT evaluation engine.
4. **Nivesh (Crowdfunding & Venture Seed Platform):**
   - Open-source Android mobile application built with Android Java, Material Design, REST APIs, and Firebase, connecting startup founders with micro-investors and angel backers through real-time fundraising dashboards.`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "notable_projects",
          title: "Featured Projects & Open Source",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "what projects has altaj built",
      "tell me about altaj's projects",
      "tell me about altaj projects",
      "featured projects",
      "what is nivesh",
      "nivesh project",
      "autoqagen",
      "open source projects",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), projectsResponse));

    // 11. Technical Skills Matrix / Tech Stack
    const skillsResponse: CachedRAGResponse = {
      answer: `Altaj's core technical skills and engineering stack encompass:

- **AI & Agentic Systems:** Model Context Protocol (MCP), Retrieval-Augmented Generation (RAG), Vector Databases & Embeddings, Azure AI Foundry, Azure OpenAI SDK, GitHub Copilot SDK, Copilot Studio, Prompt Engineering, LangChain.
- **Languages:** Python, TypeScript, JavaScript, C#, .NET, PowerShell, SQL, KQL (Kusto Query Language), Java.
- **Cloud & Infrastructure:** Azure Container Apps, Azure Functions, Azure Key Vault, Azure Service Bus, Azure Event Hubs, Azure Data Explorer (ADX), Docker, Azure CLI.
- **Backend & Microservices:** FastAPI, Flask, Node.js, Express.js, ASP.NET Core, REST APIs.
- **Databases:** MS SQL Server, PostgreSQL (Neon), MongoDB, Firebase, Vector Stores.
- **Quality, Testing & Security:** OWASP Top 10, SSRF Defense, DAST, Automated Security Scanning, Playwright, xUnit, Azure SQL Audit Logging.`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "technical_skills",
          title: "Technical Skills Matrix",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "what is altaj's tech stack",
      "what is altaj tech stack",
      "technical skills",
      "skills and technologies",
      "programming languages",
      "what technologies does altaj know",
      "what is his tech stack",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), skillsResponse));

    // 12. Why Hire Altaj / Engineering Impact
    const whyHireResponse: CachedRAGResponse = {
      answer: `Altaj Virani combines deep cloud infrastructure engineering with cutting-edge Enterprise Agentic AI:

1. **Measurable Production Impact:** Proven track record in eliminating mission-critical reliability bottlenecks—reducing Azure Key Vault calls **35×** and eliminating **2,640 monthly out-of-memory crashes** through meticulous KQL telemetry analysis.
2. **Pioneering Agentic AI & MCP Leadership:** Hands-on architect of enterprise Model Context Protocol (MCP) ecosystems (**20+ domain agents, 250+ tools**), building autonomous workflows, CLI plugins, and hybrid RAG chatbots that slashed troubleshooting times by 80%.
3. **End-to-End Technical Rigor:** Author of published developer tooling (**SnapWright** on VS Marketplace), Government of India copyrighted AI software (**AutoQA AI**), and an IEEE-published research paper on NLP Question-Answer Generation.
4. **Strong Engineering Foundation:** B.E. in Computer Engineering (**9.00 CGPA**), Microsoft Certified Azure AI Fundamentals (AI-900), and recognized with multiple enterprise awards (Problem Solver Badge, Hi-Five Spot Awards, Super Crew Spot Awards).`,
      sources: ["altaj-virani-resume.pdf"],
      chunks: [
        {
          id: "why_hire",
          title: "Why Hire Altaj Virani / Engineering Impact",
          source: "altaj-virani-resume.pdf",
        },
      ],
      timestamp: Date.now(),
      ttlMs: Infinity,
      isPermanent: true,
    };

    [
      "why should we hire altaj",
      "why hire altaj",
      "what makes altaj a strong engineer",
      "why hire him",
      "engineering impact",
      "collaboration with altaj",
    ].forEach((k) => this.cache.set(normalizeQueryKey(k), whyHireResponse));
  }

  public get(query: string): CachedAgentResponse | null {
    const key = normalizeQueryKey(query);
    const entry = this.cache.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    if (!entry.isPermanent && Date.now() - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry;
  }

  public set(
    query: string,
    response: {
      answer: string;
      sources: string[];
      chunks?: Array<{ id: string; title: string; source: string }>;
    },
    ttlMs: number = DEFAULT_TTL_MS,
  ): void {
    const key = normalizeQueryKey(query);
    if (!key) return;

    // Maintain max size by evicting oldest non-permanent entry
    if (this.cache.size >= MAX_CACHE_SIZE && !this.cache.has(key)) {
      for (const [k, v] of this.cache.entries()) {
        if (!v.isPermanent) {
          this.cache.delete(k);
          break;
        }
      }
    }

    this.cache.set(key, {
      ...response,
      timestamp: Date.now(),
      ttlMs,
      isPermanent: false,
    });
  }

  public getStats() {
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
    };
  }

  public clearNonPermanent(): void {
    for (const [key, entry] of this.cache.entries()) {
      if (!entry.isPermanent) {
        this.cache.delete(key);
      }
    }
  }
}

export const responseCache = new ResponseCacheManager();
