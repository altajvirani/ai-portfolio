import React from "react";
import { ShieldCheck, Cloud, CheckCircle2, BrainCircuit, Puzzle, Smartphone, Flame } from "lucide-react";
import {
  PythonLogo,
  CSharpLogo,
  DotNetLogo,
  AzureLogo,
  OpenAILogo,
  MCPLogo,
  TypeScriptLogo,
  DockerLogo,
  DatabaseLogo,
  KeyVaultLogo,
  KQLLogo,
  SecurityLogo,
  RAGLogo,
  BotFrameworkLogo,
  PowerShellLogo,
  ContainerAppsLogo,
} from "../components/TechLogos.tsx";

export type SkillDomainId = "agentic" | "cloud" | "backend" | "security";

export interface TechNode {
  id: string;
  name: string;
  shortName?: string;
  category: SkillDomainId;
  categoryLabel: string;
  role: string;
  projectContext: string;
  connections: string[];
  logo: React.ReactNode;
  level: "Architecture" | "Production" | "Core";
}

export interface SkillLayerMeta {
  id: SkillDomainId;
  layerNumber: string;
  title: string;
  shortTag: string;
}

export const SKILL_LAYERS: SkillLayerMeta[] = [
  {
    id: "agentic",
    layerNumber: "01",
    title: "Agentic Orchestration & AI Systems",
    shortTag: "MCP / Copilot / RAG",
  },
  {
    id: "cloud",
    layerNumber: "02",
    title: "Cloud Infrastructure & Reliability",
    shortTag: "Container Apps / Telemetry",
  },
  {
    id: "backend",
    layerNumber: "03",
    title: "Languages, APIs & Runtime Core",
    shortTag: "C# .NET / Python / TS",
  },
  {
    id: "security",
    layerNumber: "04",
    title: "Security, Compliance & Quality Assurance",
    shortTag: "OWASP / TLS / QA",
  },
];

export const TECH_NODES: TechNode[] = [
  // Agentic AI & LLMs (Cyan)
  {
    id: "mcp",
    name: "Model Context Protocol (MCP)",
    shortName: "MCP",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Standardized tool calling & Copilot CLI plugins",
    projectContext:
      "Co-built automated playbooks, domain agents, and containerized MCP servers for enterprise incident operations.",
    connections: ["copilot-sdk", "azure-openai", "container-apps"],
    logo: <MCPLogo className="w-4 h-4" />,
    level: "Architecture",
  },
  {
    id: "copilot-sdk",
    name: "GitHub Copilot SDK",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Agentic operations & CLI orchestration",
    projectContext:
      "Powers 20+ domain-specific AI agents calling 250+ integrated telemetry and inventory tools.",
    connections: ["mcp", "azure-openai", "csharp"],
    logo: <BotFrameworkLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "azure-openai",
    name: "Azure OpenAI SDK",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Enterprise reasoning & embeddings",
    projectContext:
      "Backbone model layer for incident root-cause triage, natural-language querying, and semantic retrieval.",
    connections: ["rag", "foundry", "functions"],
    logo: <OpenAILogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "rag",
    name: "Hybrid RAG & HNSW Indexing",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Multi-strategy semantic retrieval pipeline",
    projectContext:
      "Combined direct search, autonomous reasoning, and query-rewriting to cut troubleshooting time 80% for 200+ users.",
    connections: ["azure-openai", "kql", "vector-db"],
    logo: <RAGLogo className="w-4 h-4" />,
    level: "Architecture",
  },
  {
    id: "vector-db",
    name: "Vector Databases",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Embeddings storage & cosine ranking",
    projectContext:
      "High-dimensional indexing powering documentation search and automated classification workflows.",
    connections: ["rag", "azure-openai"],
    logo: <DatabaseLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "foundry",
    name: "Azure AI Foundry & Studio",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Agent evaluation, PII redaction & deployment",
    projectContext:
      "Built Foundry agent services for incident root-cause classification with groundedness and F1 scoring.",
    connections: ["azure-openai", "container-apps"],
    logo: <AzureLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "bot-framework",
    name: "Bot Framework SDK & Copilot Studio",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Conversational runtime & enterprise bots",
    projectContext:
      "Contributed runtime dialog enhancements, QA automation stability, and enterprise chatbot integrations.",
    connections: ["azure-openai", "csharp", "playwright"],
    logo: <BotFrameworkLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "nlp-transformers",
    name: "NLP & Transformers (T5, BERT, TF-IDF)",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Question synthesis, cosine ranking & semantic NLP",
    projectContext:
      "Powered IEEE-published AutoQAGen (Google T5, Sense2Vec, BERT scoring) and copyright-approved AutoQA AI offline TF-IDF retrieval.",
    connections: ["python", "rag", "vector-db"],
    logo: <BrainCircuit className="w-4 h-4 text-cyan-400" />,
    level: "Architecture",
  },

  // Azure Cloud & Distributed Systems (Sky)
  {
    id: "container-apps",
    name: "Azure Container Apps",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Dedicated microservice runtime & auto-scaling",
    projectContext:
      "Eliminated 2,640 monthly OOM errors by diagnosing .NET heap caps and migrating services to dedicated auto-scaling compute.",
    connections: ["key-vault", "kql", "csharp", "service-bus"],
    logo: <ContainerAppsLogo className="w-4 h-4" />,
    level: "Architecture",
  },
  {
    id: "key-vault",
    name: "Azure Key Vault (Shared Caching)",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Shared certificate & secret caching",
    projectContext:
      "Built a 12-hour distributed cache across 3 .NET services, cutting Key Vault calls 35× (2,807 to 79/day) with zero failed lookups.",
    connections: ["container-apps", "tls-cert", "csharp"],
    logo: <KeyVaultLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "kql",
    name: "Azure Data Explorer & KQL",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Telemetry forensics & log correlation",
    projectContext:
      "Traced OOM failures and 3,441 rejected API calls across 9 workflows to pinpoint root causes and caller-side input defects.",
    connections: ["container-apps", "rag", "python"],
    logo: <KQLLogo className="w-4 h-4" />,
    level: "Architecture",
  },
  {
    id: "functions",
    name: "Azure Functions (Serverless)",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Event-driven APIs & deployment automation",
    projectContext:
      "Engineered serverless chatbots and reusable deployment modules with RBAC checks and multi-strategy rollbacks.",
    connections: ["azure-openai", "service-bus", "csharp"],
    logo: <AzureLogo className="w-4 h-4" />,
    level: "Core",
  },
  {
    id: "service-bus",
    name: "Azure Service Bus & Event Hubs",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Async messaging & backlog scaling",
    projectContext:
      "Resolved cloud endpoint overrides (draining 331/334 stuck messages in 90s) and validated 15,708-message queue scale-out.",
    connections: ["container-apps", "functions"],
    logo: <Cloud className="w-4 h-4 text-sky-400" />,
    level: "Production",
  },
  {
    id: "powershell",
    name: "PowerShell & Azure CLI",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Automated load-testing & infra scripts",
    projectContext:
      "Authored a 13-phase load suite executing 35,500 workflows with 45 pass/fail verdicts across queue, CPU, and HTTP rules.",
    connections: ["container-apps", "service-bus"],
    logo: <PowerShellLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "firebase-rest",
    name: "Firebase & REST APIs",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Real-time cloud sync & mobile backend integration",
    projectContext:
      "Backed the Nivesh startup crowdfunding Android app with real-time portfolio sync and milestone feeds.",
    connections: ["android-mobile", "sql-server"],
    logo: <Flame className="w-4 h-4 text-sky-400" />,
    level: "Core",
  },

  // Languages & Backend Systems (Emerald)
  {
    id: "csharp",
    name: "C# / .NET Core",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Microservices runtime & auth modules",
    projectContext:
      "Built production .NET backend services, shared certificate caching, TLS validation, and QA authentication modules.",
    connections: ["container-apps", "dotnet-webapi", "key-vault"],
    logo: <CSharpLogo className="w-4 h-4" />,
    level: "Architecture",
  },
  {
    id: "python",
    name: "Python (FastAPI, Flask, Pandas)",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "NLP pipelines, MCP servers & automation",
    projectContext:
      "Built containerized FastAPI MCP servers, Pandas rostering analytics (95% accuracy), T5 QA generation, and SDK tooling.",
    connections: ["azure-openai", "kql", "mcp"],
    logo: <PythonLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "dotnet-webapi",
    name: "ASP.NET Core & Entity Framework",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "REST APIs, JWT auth & data access",
    projectContext:
      "Delivered production Web APIs and microservice architectures (#1 Batch Topper, 94.67% aggregate).",
    connections: ["csharp", "sql-server", "owasp"],
    logo: <DotNetLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "typescript",
    name: "TypeScript & React",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "IDE extensions, test benches & web apps",
    projectContext:
      "Built the SnapWright VS Code extension, multi-execution workflow test benches, and interactive React frontends.",
    connections: ["python", "mcp", "playwright"],
    logo: <TypeScriptLogo className="w-4 h-4" />,
    level: "Core",
  },
  {
    id: "sql-server",
    name: "MS SQL Server & Relational Design",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Transactional data & audit stores",
    projectContext:
      "Designed relational schemas, Purview-compliant audit logs, and chatbot quality regression tracking tables.",
    connections: ["dotnet-webapi", "purview"],
    logo: <DatabaseLogo className="w-4 h-4" />,
    level: "Core",
  },
  {
    id: "docker",
    name: "Docker Containers",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Containerized microservices & MCP isolation",
    projectContext:
      "Packaged FastAPI MCP servers and .NET services for reproducible cloud deployments via ACR.",
    connections: ["container-apps", "csharp"],
    logo: <DockerLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "vscode-ast",
    name: "VS Code Extensions & AST",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Developer tooling & TypeScript AST scaffolding",
    projectContext:
      "Built and published the SnapWright VS Code Marketplace extension automating POM generation and singleton PageFactory patterns.",
    connections: ["typescript", "playwright"],
    logo: <Puzzle className="w-4 h-4 text-emerald-400" />,
    level: "Production",
  },
  {
    id: "android-mobile",
    name: "Android Java & Material UI",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Native mobile interfaces & fintech workflows",
    projectContext:
      "Engineered the open-source Nivesh startup crowdfunding Android application with live pitch and equity tracking.",
    connections: ["firebase-rest", "sql-server"],
    logo: <Smartphone className="w-4 h-4 text-emerald-400" />,
    level: "Core",
  },

  // Security & Governance (Purple)
  {
    id: "owasp",
    name: "OWASP Top 10 & Input Defense",
    category: "security",
    categoryLabel: "Security, Compliance & QA",
    role: "Centralized endpoint validation",
    projectContext:
      "Delivered 100% endpoint compliance across production APIs with strict sanitization and automated scanning.",
    connections: ["dotnet-webapi", "container-apps"],
    logo: <SecurityLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "ssrf",
    name: "SSRF Defense & Hardening",
    category: "security",
    categoryLabel: "Security, Compliance & QA",
    role: "Boundary protection for agent tool calls",
    projectContext:
      "Hardened outbound HTTP and tool-calling validation layers against server-side request forgery.",
    connections: ["mcp", "owasp"],
    logo: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    level: "Architecture",
  },
  {
    id: "tls-cert",
    name: "TLS Certificate Authentication",
    category: "security",
    categoryLabel: "Security, Compliance & QA",
    role: "Mutual TLS & internal datacenter auth",
    projectContext:
      "Enforced strict TLS certificate validation across backend services with 16 dedicated unit tests.",
    connections: ["key-vault", "csharp", "xunit"],
    logo: <SecurityLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "ursa-dast",
    name: "URSA DAST Scanning",
    category: "security",
    categoryLabel: "Security, Compliance & QA",
    role: "Dynamic vulnerability evaluation",
    projectContext:
      "Automated dynamic security testing across deployed endpoints to verify runtime posture.",
    connections: ["owasp", "container-apps"],
    logo: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    level: "Production",
  },
  {
    id: "purview",
    name: "Microsoft Purview Audit Logging",
    category: "security",
    categoryLabel: "Security, Compliance & QA",
    role: "Compliant enterprise audit telemetry",
    projectContext:
      "Integrated Purview-compliant Azure SQL audit trails for production AI workflows.",
    connections: ["sql-server", "container-apps"],
    logo: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    level: "Core",
  },
  {
    id: "playwright",
    name: "Playwright TypeScript",
    category: "security",
    categoryLabel: "Security, Compliance & QA",
    role: "End-to-end QA automation & POM suites",
    projectContext:
      "Automated 200+ test cases with a singleton PageFactory pattern, lifting smoke coverage from 25% to 85%.",
    connections: ["typescript", "bot-framework", "xunit"],
    logo: <TypeScriptLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "xunit",
    name: "xUnit Automated Testing",
    category: "security",
    categoryLabel: "Security, Compliance & QA",
    role: "Unit & integration test suites",
    projectContext:
      "Authored 33 cloud-endpoint tests (suite: 8,704 passing) and 16 TLS caching validation tests.",
    connections: ["csharp", "tls-cert"],
    logo: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
    level: "Production",
  },
];

export function getDomainStyle(cat: string) {
  switch (cat) {
    case "agentic":
      return {
        pillBg:
          "bg-cyan-500/10 border-cyan-500/30 text-cyan-200 hover:border-cyan-400 hover:bg-cyan-500/20",
        selectedBg:
          "bg-slate-800 border-2 border-white text-white ring-2 ring-cyan-400/80 ring-offset-2 ring-offset-[#0d131f] shadow-[0_0_24px_rgba(56,189,248,0.45)] scale-[1.03]",
        linkedBg:
          "bg-amber-500/12 border-2 border-dashed border-amber-400/85 text-amber-100 shadow-[0_0_14px_rgba(251,191,36,0.2)]",
        badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        dot: "bg-cyan-400",
        layerPanel: "bg-cyan-950/20 border-cyan-500/25",
        layerTitle: "text-cyan-300",
        layerTag: "text-cyan-300 bg-cyan-500/10 border border-cyan-500/20",
      };
    case "cloud":
      return {
        pillBg:
          "bg-sky-500/10 border-sky-500/30 text-sky-200 hover:border-sky-400 hover:bg-sky-500/20",
        selectedBg:
          "bg-slate-800 border-2 border-white text-white ring-2 ring-sky-400/80 ring-offset-2 ring-offset-[#0d131f] shadow-[0_0_24px_rgba(14,165,233,0.45)] scale-[1.03]",
        linkedBg:
          "bg-amber-500/12 border-2 border-dashed border-amber-400/85 text-amber-100 shadow-[0_0_14px_rgba(251,191,36,0.2)]",
        badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
        dot: "bg-sky-400",
        layerPanel: "bg-sky-950/20 border-sky-500/25",
        layerTitle: "text-sky-300",
        layerTag: "text-sky-300 bg-sky-500/10 border border-sky-500/20",
      };
    case "backend":
      return {
        pillBg:
          "bg-emerald-500/10 border-emerald-500/30 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-500/20",
        selectedBg:
          "bg-slate-800 border-2 border-white text-white ring-2 ring-emerald-400/80 ring-offset-2 ring-offset-[#0d131f] shadow-[0_0_24px_rgba(16,185,129,0.45)] scale-[1.03]",
        linkedBg:
          "bg-amber-500/12 border-2 border-dashed border-amber-400/85 text-amber-100 shadow-[0_0_14px_rgba(251,191,36,0.2)]",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        dot: "bg-emerald-400",
        layerPanel: "bg-emerald-950/20 border-emerald-500/25",
        layerTitle: "text-emerald-300",
        layerTag: "text-emerald-300 bg-emerald-500/10 border border-emerald-500/20",
      };
    case "security":
      return {
        pillBg:
          "bg-purple-500/10 border-purple-500/30 text-purple-200 hover:border-purple-400 hover:bg-purple-500/20",
        selectedBg:
          "bg-slate-800 border-2 border-white text-white ring-2 ring-purple-400/80 ring-offset-2 ring-offset-[#0d131f] shadow-[0_0_24px_rgba(168,85,247,0.45)] scale-[1.03]",
        linkedBg:
          "bg-amber-500/12 border-2 border-dashed border-amber-400/85 text-amber-100 shadow-[0_0_14px_rgba(251,191,36,0.2)]",
        badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        dot: "bg-purple-400",
        layerPanel: "bg-purple-950/20 border-purple-500/25",
        layerTitle: "text-purple-300",
        layerTag: "text-purple-300 bg-purple-500/10 border border-purple-500/20",
      };
    default:
      return {
        pillBg: "bg-slate-800/80 border-slate-700 text-slate-200",
        selectedBg: "bg-slate-800 border-2 border-white text-white",
        linkedBg: "bg-amber-500/12 border-2 border-dashed border-amber-400/85 text-amber-100",
        badge: "bg-white/10 text-white border-white/20",
        dot: "bg-white",
        layerPanel: "bg-slate-900/40 border-slate-800",
        layerTitle: "text-white",
        layerTag: "text-slate-300 bg-slate-800",
      };
  }
}
