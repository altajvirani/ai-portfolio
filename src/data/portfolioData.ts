import {
  WorkProject,
  PersonalProject,
  AwardItem,
  EducationItem,
  CertificationItem,
} from "../types.ts";

export const SOCIAL_LINKS = {
  github: "https://github.com/altajvirani",
  linkedin: "https://www.linkedin.com/in/altajvirani/",
  stackoverflow: "https://stackoverflow.com/users/10182929/altaj-virani",
  x: "https://x.com/AltajVirani",
  instagram: "https://www.instagram.com/altajvirani",
  whatsapp: "https://wa.me/+917303934303",
  email: "altajatwork@gmail.com",
  location: "Mumbai, India",
};

export const MARQUEE_ITEMS = [
  "ENTERPRISE AI ENGINEERING",
  "CLOUD-NATIVE ARCHITECTURE",
  "AGENTIC AI SYSTEMS",
  "HIGH-SCALE MICROSERVICES",
  "INTELLIGENT AUTOMATION",
  "DISTRIBUTED SYSTEMS DESIGN",
  "LLM & RAG INTEGRATION",
  "SYSTEM RELIABILITY ENGINEERING",
  "AUTOMATION ARCHITECTURE",
  "SECURE CLOUD INFRASTRUCTURE",
  "FULL-STACK DEVELOPMENT",
  "AZURE PLATFORM SOLUTIONS",
];

export const WORK_EXPERIENCE: WorkProject[] = [
  {
    id: "azure-network-engineering",
    organization: "LTM",
    businessUnit: "Microsoft Business Unit (MSBU)",
    location: "Mumbai, IN",
    projectName: "Azure Network Engineering · Viki-AI",
    role: "Software Engineer",
    period: "Jun 2025 – Present",
    yearLabel: "2025 – Present",
    monthLabel: "Jun 2025",
    summary:
      "Core contributor to Viki-AI, an internal agentic AI operations platform supporting global cloud network infrastructure, reliability, and incident response.",
    keyContributions: [
      {
        area: "Agentic AI & Platform Enablement",
        points: [
          "Co-built MCP toolkits, Copilot CLI plugins, and 20+ domain agents (250+ tools) across engineering tracks.",
          "Shipped Azure Functions + Copilot Studio chatbots with hybrid RAG/HNSW indexing, cutting troubleshooting time 80% for 200+ users.",
          "Built natural-language rostering (95% accuracy), Foundry root-cause triage with PII redaction, and containerized MCP servers.",
        ],
      },
      {
        area: "Cloud Reliability & Security",
        points: [
          "Cut Key Vault calls 35× (2,807 to 79/day) via a 12-hour shared .NET cache with strict TLS validation and 16 tests.",
          "Eliminated 2,640 monthly OOM errors via KQL diagnostics and migration to dedicated auto-scaling compute.",
          "Validated auto-scaling across 35,500 load-test workflows; enforced 100% OWASP Top 10, SSRF, URSA DAST, and Purview compliance.",
        ],
      },
    ],
    skillIds: [
      "mcp",
      "copilot-sdk",
      "azure-openai",
      "rag",
      "container-apps",
      "key-vault",
      "kql",
      "powershell",
      "csharp",
      "python",
      "owasp",
      "ssrf",
    ],
    accentColor: "cyan",
  },
  {
    id: "power-apps-engineering",
    organization: "LTM",
    businessUnit: "Microsoft Business Unit (MSBU)",
    location: "Mumbai, IN",
    projectName: "Microsoft Power Apps & Copilot Studio Engineering",
    role: "Software Engineer",
    period: "Sep 2024 – Jun 2025",
    yearLabel: "2024 – 2025",
    monthLabel: "Sep 2024",
    summary:
      "Engineered conversational AI backend enhancements, automated E2E QA infrastructure, and developer productivity extensions for Power Platform tooling.",
    keyContributions: [
      {
        area: "Conversational SDKs & QA Automation",
        points: [
          "Automated 200+ Playwright TS tests with a singleton PageFactory pattern, lifting smoke coverage from 25% to 85% and pass rates to 70%.",
          "Built a custom VS Code extension for automated Page Object Model (POM) generation and a C# certificate-auth module for 20+ testers.",
          "Contributed to Microsoft Bot Framework SDK runtime stability and Python automation for structured reference docs.",
        ],
      },
    ],
    skillIds: [
      "bot-framework",
      "playwright",
      "typescript",
      "csharp",
      "python",
      "tls-cert",
    ],
    accentColor: "emerald",
  },
  {
    id: "graduate-engineer-trainee",
    organization: "LTM",
    businessUnit: "Orchard Training Program",
    location: "Mumbai, IN",
    projectName: "Full-Stack .NET & Cloud Microservices Track",
    role: "Graduate Engineer Trainee",
    period: "Jun 2024 – Sep 2024",
    yearLabel: "2024",
    monthLabel: "Jun 2024",
    summary:
      "Intensive enterprise training program focused on backend .NET microservices, relational database design, and cloud-ready API architectures.",
    keyContributions: [
      {
        area: "Core Foundations & Distinction",
        points: [
          "Completed full-stack engineering modules covering C#, ASP.NET Core, Entity Framework, JWT/OAuth, SQL Server, and Web APIs.",
          "Ranked #1 Batch Topper across all technical evaluations with a 94.67% aggregate.",
        ],
      },
    ],
    skillIds: ["csharp", "dotnet-webapi", "sql-server", "typescript", "xunit"],
    accentColor: "purple",
  },
];

export const PERSONAL_PROJECTS: PersonalProject[] = [
  {
    id: "autoqagen",
    title: "AutoQAGen",
    subtitle: "IEEE ICSCSS 2023 Published Paper",
    shortDescription:
      "T5 + NLP pipeline generating multi-format QA pairs and semantic distractors, benchmarked on SQuAD with BERT scoring.",
    description:
      "Published QAG architecture combining Google T5 with NER, POS tagging, and Sense2Vec for automated question synthesis and distractor generation via Flask and React.",
    highlights: [
      "Fine-tuned T5 transformer pipeline for multi-format QA pair synthesis",
      "Sense2Vec + NER distractor generation benchmarked against SQuAD with BERT scores",
      "Scalable Flask REST API paired with a component-driven React UI",
    ],
    technologies: ["Python", "Google T5", "BERT", "Sense2Vec", "NLTK", "Flask", "React"],
    skillIds: ["python", "nlp-transformers", "vector-db", "typescript"],
    slides: [
      {
        badge: "Architecture",
        title: "T5 + NLP Synthesis Engine",
        metric: "IEEE ICSCSS 2023",
        detail: "Combines POS tagging, NER, and Sense2Vec vectors for semantic question and distractor pairs.",
      },
      {
        badge: "Benchmark",
        title: "Automated BERT Scoring",
        metric: "SQuAD Baselines",
        detail: "Ranks generated question-answer outputs automatically against SQuAD evaluation criteria.",
      },
    ],
    publicationOrCopyright: "IEEE ICSCSS (2023) Publication",
    documentUrl:
      "https://drive.google.com/file/d/1lef8moQmUvzgtEttF1r9qbtEL74lxP0r/view?usp=sharing",
    githubUrl: "https://github.com/altajvirani/AutoQAGen",
    accentColor: "cyan",
  },
  {
    id: "autoqa-ai",
    title: "AutoQA AI",
    subtitle: "Govt. of India Copyright Approved",
    shortDescription:
      "Privacy-first offline desktop assistant for querying local documents using TF-IDF ranking and voice accessibility.",
    description:
      "Copyright-registered offline desktop Q&A application processing local documents with zero external data transfer, TF-IDF cosine ranking, and text-to-speech output.",
    highlights: [
      "Government of India approved copyright registration for automated document Q&A",
      "Offline TF-IDF vectorization and cosine similarity ranking with NLTK preprocessing",
      "Desktop UI built in KivyMD with Pyttsx3 text-to-speech accessibility",
    ],
    technologies: ["Python", "Scikit-learn (TF-IDF)", "NLTK", "KivyMD", "Pyttsx3"],
    skillIds: ["python", "nlp-transformers", "vector-db"],
    slides: [
      {
        badge: "Intellectual Property",
        title: "Privacy-First Offline Q&A",
        metric: "Govt. Copyright Approved",
        detail: "Zero external network transmission; executes semantic retrieval locally on user files.",
      },
      {
        badge: "Retrieval",
        title: "TF-IDF + Cosine Ranking",
        metric: "Local Vector Engine",
        detail: "Pairs NLTK sentence segmentation with Pyttsx3 voice synthesis for accessibility.",
      },
    ],
    publicationOrCopyright: "Govt. of India Copyright",
    documentUrl:
      "https://drive.google.com/file/d/1ae07j8Z6j2pZGD-Qdy74iskDIWAOfpcJ/view",
    githubUrl: "https://github.com/altajvirani/AutoQA",
    accentColor: "emerald",
  },
  {
    id: "snapwright",
    title: "SnapWright",
    subtitle: "Published VS Code Extension",
    shortDescription:
      "Open-source IDE extension automating Page Object Model generation with a singleton PageFactory pattern.",
    description:
      "VS Code Marketplace extension automating TypeScript Page Object Model scaffolding, consolidating imports, and eliminating memory leaks across large test suites.",
    highlights: [
      "Published on the official VS Code Marketplace (altajvirani.snapwright)",
      "Singleton PageFactory pattern eliminating memory leaks in Playwright/E2E suites",
      "Smart AST class-name and path resolution accelerating QA migration workflows",
    ],
    technologies: ["TypeScript", "VS Code API", "Node.js", "AST Parsing", "Playwright"],
    skillIds: ["typescript", "vscode-ast", "playwright"],
    slides: [
      {
        badge: "Marketplace",
        title: "Automated POM Scaffolding",
        metric: "VS Code Extension",
        detail: "Generates clean Page Object classes with consolidated imports and path detection.",
      },
      {
        badge: "Pattern",
        title: "Leak-Free PageFactory",
        metric: "Singleton Runtime",
        detail: "Adopted across internal automation suites to eliminate browser memory growth.",
      },
    ],
    publicationOrCopyright: "VS Code Marketplace Extension",
    marketplaceUrl:
      "https://marketplace.visualstudio.com/items?itemName=altajvirani.snapwright",
    githubUrl: "https://github.com/altajvirani/SnapWright",
    accentColor: "purple",
  },
  {
    id: "nivesh",
    title: "Nivesh",
    subtitle: "Start-Up Crowdfunding Platform",
    shortDescription:
      "Open-source Android app connecting early-stage founders with micro-investors through transparent equity tracking.",
    description:
      "Native Android platform built to democratize startup seed funding with real-time campaign metrics, milestone tracking, and micro-investor portfolio dashboards.",
    highlights: [
      "Startup discovery feed with live fundraising progress and pitch summaries",
      "Investor portfolio analytics with equity milestone updates",
      "Native Android Java architecture backed by REST APIs and Firebase",
    ],
    technologies: ["Android Java", "Material Design", "REST APIs", "Firebase"],
    skillIds: ["android-mobile", "firebase-rest", "sql-server"],
    slides: [
      {
        badge: "Mobile Fintech",
        title: "Micro-Venture Discovery",
        metric: "Open-Source Android",
        detail: "Transparent equity progress tracking connecting founders with angel and micro-investors.",
      },
      {
        badge: "Architecture",
        title: "Real-Time Portfolio Sync",
        metric: "Firebase + REST",
        detail: "Material Design views surfacing milestone progress and funding velocity cleanly.",
      },
    ],
    publicationOrCopyright: "Open-Source Mobile App",
    githubUrl: "https://github.com/altajvirani/Nivesh",
    accentColor: "sky",
  },
];

export const AWARDS_DATA: AwardItem[] = [
  {
    id: "problem-solver-2026",
    title: "Problem Solver Badge",
    subtitle: "Agentic AI & Platform Initiatives",
    organization: "LTM · MSBU",
    date: "Sep 2026",
    category: "Technical Problem Solving",
    reason:
      "Nominated for contributions to Viki-AI, agentic operations tooling, and resolving complex platform challenges.",
    impactHighlight: "Agentic Operations & Stakeholder Trust",
    accentColor: "amber",
  },
  {
    id: "spot-nov-2025",
    title: "Hi-Five Spot Award",
    subtitle: "AI Innovation & Use Cases",
    organization: "LTM · MSBU",
    date: "Nov 2025",
    category: "Individual Excellence",
    reason:
      "Recognized for innovating high-impact enterprise AI use cases and cross-team technical execution.",
    impactHighlight: "High-Impact AI Use Cases",
    documentUrl:
      "https://drive.google.com/file/d/18K2sELoqpOP2vz0gN2iA98Z_g0hWm1qD/view?usp=drive_link",
    accentColor: "emerald",
  },
  {
    id: "spot-aug-2025",
    title: "Super Crew Spot Award",
    subtitle: "Enterprise GenAI & Automation",
    organization: "LTM · MSBU",
    date: "Aug 2025",
    category: "Team Delivery",
    reason:
      "Awarded with the engineering squad for delivering compliant Generative AI and automation systems.",
    impactHighlight: "Compliant GenAI Modernization",
    documentUrl:
      "https://drive.google.com/file/d/1vt7842TyYoa6MsA7CXNONp2AQxTDPuyT/view?usp=drive_link",
    accentColor: "purple",
  },
  {
    id: "spot-jul-2025",
    title: "Hi-Five Spot Award",
    subtitle: "Migrations & Developer Tooling",
    organization: "LTM · MSBU",
    date: "Jul 2025",
    category: "Automation Velocity",
    reason:
      "Commended for stabilizing QA frameworks, leading migrations, and building productivity utilities.",
    impactHighlight: "QA & Migration Velocity",
    documentUrl:
      "https://drive.google.com/file/d/1lLLw5HtWZtIoV_LdTjDxVahClUSr6iLq/view?usp=drive_link",
    accentColor: "cyan",
  },
];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    degree: "B.E. in Computer Engineering",
    institution: "Vidyavardhini's College of Engineering & Technology (Mumbai University)",
    duration: "2021 – 2023",
    grade: "9.00 CGPA",
    percentageValue: 90,
    highlights: [
      "Published IEEE ICSCSS 2023 NLP research (AutoQAGen) during undergraduate engineering.",
      "Core focus across Machine Learning, Distributed Computing, Software Architecture, and Cloud Databases.",
    ],
    documentUrl:
      "https://drive.google.com/file/d/13Ar1FiG4B4QjiCjCQi0kefs5FlJq7o77/view",
  },
  {
    degree: "Diploma in Computer Engineering",
    institution: "Vidyavardhini's Bhausaheb Vartak Polytechnic (MSBTE)",
    duration: "2017 – 2020",
    grade: "94.00%",
    percentageValue: 94,
    highlights: [
      "Graduated with top academic distinction (94.00% aggregate).",
      "Strong systems foundations in Data Structures, Operating Systems, Java, and Web Engineering.",
    ],
    documentUrl:
      "https://drive.google.com/file/d/1cwvFmlKVv0WVhkpgj0W2K37e0_sl4H8q/view",
  },
  {
    degree: "Secondary School Certificate (SSC)",
    institution: "Holy Paradise High School (MSBSHSE)",
    duration: "2016 – 2017",
    grade: "80.60%",
    percentageValue: 80.6,
    highlights: [
      "First-class distinction across Mathematics and Science foundations.",
    ],
    documentUrl:
      "https://drive.google.com/file/d/1A6t9XAIur-sXbHWvXvRx1l8eb17VYs_l/view",
  },
];

export const CERTIFICATION_ITEMS: CertificationItem[] = [
  {
    name: "Microsoft Certified: Azure AI Fundamentals (AI-900)",
    issuer: "Microsoft",
    focus: "Core Azure AI workloads, ML, NLP, and Responsible AI governance",
    url: "https://learn.microsoft.com/api/credentials/share/en-in/altajvirani/C0872E8742B2D90?sharingId=48999C5125E08B64",
  },
  {
    name: "Azure AI Studio (AI Foundry)",
    issuer: "Udemy",
    focus: "Prompt flows, agent evaluation, groundedness scoring, and model deployment",
    url: "https://ude.my/UC-e65a23d5-0f7f-4f02-816e-aaf2e53c4401",
  },
  {
    name: "Azure Functions Masterclass",
    issuer: "Udemy",
    focus: "Event-driven serverless compute, triggers, bindings, and scalable APIs",
    url: "https://ude.my/UC-ed09d39d-725e-474e-8f85-4b0a3b33615c/",
  },
];
