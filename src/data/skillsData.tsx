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
    logo: <BrainCircuit className="w-4 h-4 text-blue-600" />,
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
    logo: <Flame className="w-4 h-4 text-sky-600" />,
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
    logo: <Puzzle className="w-4 h-4 text-emerald-600" />,
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
    logo: <Smartphone className="w-4 h-4 text-emerald-600" />,
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
          "bg-gradient-to-b from-white to-[#EEF4FF] border-[#C7D7FE] text-[#1E3A8A] shadow-[0_2px_4px_rgba(37,99,235,0.08),inset_0_1px_0_#FFFFFF] hover:border-[#2563EB]/75 hover:to-[#E0EAFF]",
        selectedBg:
          "bg-gradient-to-b from-[#3B82F6] to-[#2563EB] border-2 border-[#1D4ED8] text-white ring-2 ring-[#2563EB]/30 ring-offset-2 ring-offset-[#FAF8F3] shadow-[0_6px_16px_rgba(37,99,235,0.32),inset_0_1px_0_rgba(255,255,255,0.45)] sm:scale-[1.03]",
        linkedBg:
          "bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-dashed border-[#D97706] text-[#78350F] shadow-[0_3px_10px_rgba(217,119,6,0.16),inset_0_1px_0_#FFFFFF]",
        badge: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
        dot: "bg-[#2563EB]",
        layerPanel:
          "paper-grid-cobalt border-[#BFDBFE] shadow-[inset_0_2px_4px_rgba(37,99,235,0.06),0_4px_12px_-4px_rgba(37,99,235,0.08)]",
        layerTitle: "text-[#1E40AF]",
        layerTag: "text-[#1D4ED8] bg-white border border-[#C7D7FE] shadow-xs",
      };
    case "cloud":
      return {
        pillBg:
          "bg-gradient-to-b from-white to-[#EFF9FF] border-[#BAE6FD] text-[#0C4A6E] shadow-[0_2px_4px_rgba(2,132,199,0.08),inset_0_1px_0_#FFFFFF] hover:border-[#0284C7]/75 hover:to-[#E0F2FE]",
        selectedBg:
          "bg-gradient-to-b from-[#0EA5E9] to-[#0284C7] border-2 border-[#0369A1] text-white ring-2 ring-[#0284C7]/30 ring-offset-2 ring-offset-[#FAF8F3] shadow-[0_6px_16px_rgba(2,132,199,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] sm:scale-[1.03]",
        linkedBg:
          "bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-dashed border-[#D97706] text-[#78350F] shadow-[0_3px_10px_rgba(217,119,6,0.16),inset_0_1px_0_#FFFFFF]",
        badge: "bg-[#F0F9FF] text-[#0369A1] border-[#BAE6FD]",
        dot: "bg-[#0284C7]",
        layerPanel:
          "bg-[#EDF8FD] paper-grid-cobalt border-[#BAE6FD] shadow-[inset_0_2px_4px_rgba(2,132,199,0.06),0_4px_12px_-4px_rgba(2,132,199,0.08)]",
        layerTitle: "text-[#075985]",
        layerTag: "text-[#0369A1] bg-white border border-[#BAE6FD] shadow-xs",
      };
    case "backend":
      return {
        pillBg:
          "bg-gradient-to-b from-white to-[#ECFDF5] border-[#A7F3D0] text-[#064E3B] shadow-[0_2px_4px_rgba(5,150,105,0.08),inset_0_1px_0_#FFFFFF] hover:border-[#059669]/75 hover:to-[#D1FAE5]",
        selectedBg:
          "bg-gradient-to-b from-[#10B981] to-[#059669] border-2 border-[#047857] text-white ring-2 ring-[#059669]/30 ring-offset-2 ring-offset-[#FAF8F3] shadow-[0_6px_16px_rgba(5,150,105,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] sm:scale-[1.03]",
        linkedBg:
          "bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-dashed border-[#D97706] text-[#78350F] shadow-[0_3px_10px_rgba(217,119,6,0.16),inset_0_1px_0_#FFFFFF]",
        badge: "bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]",
        dot: "bg-[#059669]",
        layerPanel:
          "paper-grid-mint border-[#A7F3D0] shadow-[inset_0_2px_4px_rgba(5,150,105,0.06),0_4px_12px_-4px_rgba(5,150,105,0.08)]",
        layerTitle: "text-[#065F46]",
        layerTag: "text-[#047857] bg-white border border-[#A7F3D0] shadow-xs",
      };
    case "security":
      return {
        pillBg:
          "bg-gradient-to-b from-white to-[#F5F3FF] border-[#DDD6FE] text-[#4C1D95] shadow-[0_2px_4px_rgba(124,58,237,0.08),inset_0_1px_0_#FFFFFF] hover:border-[#7C3AED]/75 hover:to-[#EDE9FE]",
        selectedBg:
          "bg-gradient-to-b from-[#8B5CF6] to-[#7C3AED] border-2 border-[#6D28D9] text-white ring-2 ring-[#7C3AED]/30 ring-offset-2 ring-offset-[#FAF8F3] shadow-[0_6px_16px_rgba(124,58,237,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] sm:scale-[1.03]",
        linkedBg:
          "bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-dashed border-[#D97706] text-[#78350F] shadow-[0_3px_10px_rgba(217,119,6,0.16),inset_0_1px_0_#FFFFFF]",
        badge: "bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]",
        dot: "bg-[#7C3AED]",
        layerPanel:
          "paper-grid-violet border-[#DDD6FE] shadow-[inset_0_2px_4px_rgba(124,58,237,0.06),0_4px_12px_-4px_rgba(124,58,237,0.08)]",
        layerTitle: "text-[#5B21B6]",
        layerTag: "text-[#6D28D9] bg-white border border-[#DDD6FE] shadow-xs",
      };
    default:
      return {
        pillBg:
          "bg-gradient-to-b from-white to-[#F4EFE6] border-[#D9D2C5] text-[#18181B]",
        selectedBg:
          "bg-gradient-to-b from-[#27272A] to-[#141413] border-2 border-[#09090B] text-white",
        linkedBg:
          "bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] border-2 border-dashed border-[#D97706] text-[#78350F]",
        badge: "bg-[#EDE8DF] text-[#18181B] border-[#D9D2C5]",
        dot: "bg-[#18181B]",
        layerPanel: "bg-[#F2EFE8] border-[#DFD9CE]",
        layerTitle: "text-[#18181B]",
        layerTag: "text-[#3F3F46] bg-white border border-[#DFD9CE]",
      };
  }
}
