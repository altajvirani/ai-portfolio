import React, { useState } from "react";
import {
  Cpu,
  Network,
  LayoutGrid,
  ArrowRight,
  Layers,
  Sparkles,
  ShieldCheck,
  Cloud,
  Bot,
  Code2,
  CheckCircle2,
  Info,
} from "lucide-react";
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
} from "./TechLogos.tsx";

interface TechNode {
  id: string;
  name: string;
  category: "agentic" | "cloud" | "backend" | "security";
  categoryLabel: string;
  role: string;
  projectContext: string;
  connections: string[];
  logo: React.ReactNode;
  level: "Architecture" | "Production" | "Core";
}

const TECH_NODES: TechNode[] = [
  // Agentic AI & LLMs (Cyan)
  {
    id: "mcp",
    name: "Model Context Protocol (MCP)",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Standardized tool calling & Copilot CLI plugins",
    projectContext:
      "Enabled cross-team adoption of Viki-AI by co-building automated playbooks and domain-specific agent skills via MCP toolkits.",
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
      "Powers 20+ domain-specific AI agents that call 250+ integrated tools for live network inventory and telemetry in Viki-AI.",
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
      "Backbone model orchestration for automated incident analysis, root-cause summaries, and natural-language query generation.",
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
      "Combined direct search, autonomous reasoning, and query-rewriting to slash troubleshooting turnaround by 80% for 200+ on-call engineers.",
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
      "High-dimensional indexing for technical documentation and incident knowledge bases.",
    connections: ["rag", "azure-openai"],
    logo: <DatabaseLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "foundry",
    name: "Azure AI Foundry & Studio",
    category: "agentic",
    categoryLabel: "Agentic AI & LLMs",
    role: "Model fine-tuning & evaluation",
    projectContext:
      "Deployed agent workflows and verified groundedness metrics for internal Microsoft Business Unit solutions.",
    connections: ["azure-openai", "container-apps"],
    logo: <AzureLogo className="w-4 h-4" />,
    level: "Production",
  },

  // Azure Cloud & Distributed Systems (Azure Blue)
  {
    id: "container-apps",
    name: "Azure Container Apps",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Dedicated microservice execution & auto-scaling",
    projectContext:
      "Host environment for three backend .NET services; migrated to dedicated auto-scaling compute eliminating 2,640 monthly OOM errors.",
    connections: ["key-vault", "kql", "csharp", "service-bus"],
    logo: <ContainerAppsLogo className="w-4 h-4" />,
    level: "Architecture",
  },
  {
    id: "key-vault",
    name: "Azure Key Vault (Shared Caching)",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Zero-overhead secret & certificate distribution",
    projectContext:
      "Engineered a 12-hour distributed memory cache across 3 services, reducing Key Vault calls 35× (2,807 to 79/day) and dropping failed lookups to zero.",
    connections: ["container-apps", "tls-cert", "csharp"],
    logo: <KeyVaultLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "kql",
    name: "Azure Data Explorer & KQL",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "High-scale telemetry & root-cause forensics",
    projectContext:
      "Diagnosed container memory limits vs 768 MB .NET heap caps and traced 3,441 rejected API calls across 9 workflows to caller-side errors.",
    connections: ["container-apps", "rag", "python"],
    logo: <KQLLogo className="w-4 h-4" />,
    level: "Architecture",
  },
  {
    id: "functions",
    name: "Azure Functions (Serverless)",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Event-driven integration endpoints",
    projectContext:
      "Built enterprise serverless microservices for automated incident ingestion, document indexing, and user query dispatching.",
    connections: ["azure-openai", "service-bus", "csharp"],
    logo: <AzureLogo className="w-4 h-4" />,
    level: "Core",
  },
  {
    id: "service-bus",
    name: "Azure Service Bus & Event Hubs",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Reliable asynchronous messaging & load buffering",
    projectContext:
      "Validated queue-based scaling by draining a 15,708-message backlog scaling from 1 to 3 instances; resolved test-environment localhost emulator flaws.",
    connections: ["container-apps", "functions"],
    logo: <Cloud className="w-4 h-4 text-sky-400" />,
    level: "Production",
  },
  {
    id: "powershell",
    name: "PowerShell & Azure CLI",
    category: "cloud",
    categoryLabel: "Cloud & Infrastructure",
    role: "Automated 13-phase load-testing suite",
    projectContext:
      "Authored 13-phase distributed load testing driving 35,500 workflows with 45 pass/fail verdicts proving auto-scaling behavior.",
    connections: ["container-apps", "service-bus"],
    logo: <PowerShellLogo className="w-4 h-4" />,
    level: "Production",
  },

  // Languages & Backend Systems (Emerald)
  {
    id: "csharp",
    name: "C# / .NET Core",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Core backend runtime & enterprise microservices",
    projectContext:
      "Built resilient microservice runtimes, custom TLS validation routines, and high-throughput background processing for Azure networking.",
    connections: ["container-apps", "dotnet-webapi", "key-vault"],
    logo: <CSharpLogo className="w-4 h-4" />,
    level: "Architecture",
  },
  {
    id: "python",
    name: "Python (FastAPI, Flask, Pandas, NLTK)",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "NLP pipelines & developer automation tooling",
    projectContext:
      "Engineered T5 NLP pipeline in AutoQAGen, offline document search in AutoQA AI, and developer tools for the Bot Framework SDK.",
    connections: ["azure-openai", "kql", "mcp"],
    logo: <PythonLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "dotnet-webapi",
    name: "ASP.NET Core Web APIs",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Secure REST endpoints & microservice integration",
    projectContext:
      "Completed full-stack enterprise .NET curriculum as #1 Batch Topper (94.67%) and deployed production REST endpoints.",
    connections: ["csharp", "sql-server", "owasp"],
    logo: <DotNetLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "typescript",
    name: "TypeScript & JavaScript",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Web tooling, test benches & UI prototypes",
    projectContext:
      "Created portal workflow test-bench multi-execution tracking, visual YAML editor prototype, and React frontends.",
    connections: ["python", "mcp"],
    logo: <TypeScriptLogo className="w-4 h-4" />,
    level: "Core",
  },
  {
    id: "sql-server",
    name: "MS SQL Server & Relational Design",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Transactional data persistence & audit stores",
    projectContext:
      "Engineered schemas, stored procedures, and Purview-compliant database logging for production microservices.",
    connections: ["dotnet-webapi", "purview"],
    logo: <DatabaseLogo className="w-4 h-4" />,
    level: "Core",
  },
  {
    id: "docker",
    name: "Docker Containers",
    category: "backend",
    categoryLabel: "Languages & Backend Core",
    role: "Containerized deployment & isolation",
    projectContext:
      "Containerized MCP servers and .NET backend services for reproducible cloud deployment on Azure Container Apps.",
    connections: ["container-apps", "csharp"],
    logo: <DockerLogo className="w-4 h-4" />,
    level: "Production",
  },

  // Security & Governance (Purple)
  {
    id: "owasp",
    name: "OWASP Top 10 & Input Defense",
    category: "security",
    categoryLabel: "Security & Enterprise Quality",
    role: "Centralized microservice input validation",
    projectContext:
      "Achieved 100% compliance across production endpoints through automated security scanning and strict request sanitization.",
    connections: ["dotnet-webapi", "container-apps"],
    logo: <SecurityLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "ssrf",
    name: "SSRF Defense & Endpoint Hardening",
    category: "security",
    categoryLabel: "Security & Enterprise Quality",
    role: "Boundary validation for AI tool executions",
    projectContext:
      "Secured agent tool-calling gateways and outbound HTTP requests in Viki-AI against server-side request forgery.",
    connections: ["mcp", "owasp"],
    logo: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    level: "Architecture",
  },
  {
    id: "tls-cert",
    name: "TLS Certificate Authentication",
    category: "security",
    categoryLabel: "Security & Enterprise Quality",
    role: "Mutual TLS & internal datacenter auth",
    projectContext:
      "Enforced strict TLS certificate validation across all three backend services, validated by 16 dedicated unit tests.",
    connections: ["key-vault", "csharp", "xunit"],
    logo: <SecurityLogo className="w-4 h-4" />,
    level: "Production",
  },
  {
    id: "ursa-dast",
    name: "URSA DAST Scanning",
    category: "security",
    categoryLabel: "Security & Enterprise Quality",
    role: "Dynamic application security testing",
    projectContext:
      "Continuous vulnerability evaluation across deployed API endpoints and internal engineering portals.",
    connections: ["owasp", "container-apps"],
    logo: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    level: "Production",
  },
  {
    id: "purview",
    name: "Microsoft Purview Audit Logging",
    category: "security",
    categoryLabel: "Security & Enterprise Quality",
    role: "Compliance & security telemetry logging",
    projectContext:
      "Integrated compliant audit trails for AI-driven operational actions and database state modifications.",
    connections: ["sql-server", "container-apps"],
    logo: <ShieldCheck className="w-4 h-4 text-purple-400" />,
    level: "Core",
  },
  {
    id: "xunit",
    name: "xUnit Automated Testing",
    category: "security",
    categoryLabel: "Security & Enterprise Quality",
    role: "Unit & integration test suites",
    projectContext:
      "Added 33 tests verifying sovereign-cloud endpoint configuration (suite: 8,704 passing) and 16 tests for TLS caching.",
    connections: ["csharp", "tls-cert"],
    logo: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
    level: "Production",
  },
];

export const SkillsSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<"matrix" | "graph">("graph");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("mcp");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const selectedNode =
    TECH_NODES.find((n) => n.id === selectedNodeId) || TECH_NODES[0];

  const filteredNodes =
    filterCategory === "all"
      ? TECH_NODES
      : TECH_NODES.filter((n) => n.category === filterCategory);

  const getDomainStyle = (cat: string) => {
    switch (cat) {
      case "agentic":
        return {
          pillBg:
            "bg-cyan-500/15 border-cyan-400/40 text-cyan-200 hover:border-cyan-400 hover:bg-cyan-500/25",
          activeBg:
            "bg-cyan-500/30 border-cyan-300 text-white shadow-[0_0_15px_rgba(56,189,248,0.35)]",
          badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
          dot: "bg-cyan-400",
        };
      case "cloud":
        return {
          pillBg:
            "bg-sky-500/15 border-sky-400/40 text-sky-200 hover:border-sky-400 hover:bg-sky-500/25",
          activeBg:
            "bg-sky-500/30 border-sky-300 text-white shadow-[0_0_15px_rgba(14,165,233,0.35)]",
          badge: "bg-sky-500/20 text-sky-300 border-sky-500/30",
          dot: "bg-sky-400",
        };
      case "backend":
        return {
          pillBg:
            "bg-emerald-500/15 border-emerald-400/40 text-emerald-200 hover:border-emerald-400 hover:bg-emerald-500/25",
          activeBg:
            "bg-emerald-500/30 border-emerald-300 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          dot: "bg-emerald-400",
        };
      case "security":
        return {
          pillBg:
            "bg-purple-500/15 border-purple-400/40 text-purple-200 hover:border-purple-400 hover:bg-purple-500/25",
          activeBg:
            "bg-purple-500/30 border-purple-300 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]",
          badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          dot: "bg-purple-400",
        };
      default:
        return {
          pillBg: "bg-slate-800/80 border-slate-700 text-slate-200",
          activeBg: "bg-white/20 border-white text-white",
          badge: "bg-white/10 text-white border-white/20",
          dot: "bg-white",
        };
    }
  };

  return (
    <section
      id="skills"
      className="py-20 sm:py-24 border-b border-slate-800/80 relative bg-[#0d131f]"
    >
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Technology Knowledge Graph & Architecture Map</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
              Interactive Stack & Systems Map
            </h2>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-700/80 rounded-xl self-start md:self-auto shadow-inner">
            <button
              onClick={() => setViewMode("graph")}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === "graph"
                  ? "bg-cyan-500/20 border border-cyan-400/50 text-white font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
              }`}
            >
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span className="min-w-max">Architecture Graph</span>
            </button>
            <button
              onClick={() => setViewMode("matrix")}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === "matrix"
                  ? "bg-cyan-500/20 border border-cyan-400/50 text-white font-bold shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                  : "text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span className="min-w-max">Domain Matrix</span>
            </button>
          </div>
        </div>

        {/* Domain Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-2">
            Domain Filter:
          </span>
          {[
            { id: "all", label: "All 24 Technologies" },
            { id: "agentic", label: "Agentic AI & LLMs", dot: "bg-cyan-400" },
            { id: "cloud", label: "Cloud & Infrastructure", dot: "bg-sky-400" },
            { id: "backend", label: "Languages & Core", dot: "bg-emerald-400" },
            {
              id: "security",
              label: "Security & Quality",
              dot: "bg-purple-400",
            },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 cursor-pointer ${
                filterCategory === cat.id
                  ? "bg-slate-800 border border-cyan-400/60 text-white font-semibold shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                  : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"
              }`}
            >
              {cat.dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
              )}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content: Interactive Architecture Knowledge Graph View */}
        {viewMode === "graph" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Graph Canvas & Connected Nodes (8 cols) */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.5)] space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Interactive Systems Node Map
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Click any technology node to inspect relationships
                </span>
              </div>

              {/* 4 Architectural Layers / Streams */}
              <div className="space-y-6">
                {/* Layer 1: Agentic AI Layer */}
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-300 font-bold flex items-center gap-2">
                      <Bot className="w-4 h-4 text-cyan-400" />
                      <span>LAYER 1: Agentic Orchestration & Reasoning</span>
                    </span>
                    <span className="text-[10px] text-cyan-400/80 px-2 py-0.5 rounded bg-cyan-500/10">
                      MCP / Copilot
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {TECH_NODES.filter((n) => n.category === "agentic").map(
                      (node) => {
                        const isSelected = node.id === selectedNodeId;
                        const isConnected = selectedNode.connections.includes(
                          node.id,
                        );
                        const style = getDomainStyle(node.category);
                        return (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2.5 cursor-pointer border ${
                              isSelected
                                ? style.activeBg
                                : isConnected
                                  ? "bg-cyan-500/20 border-cyan-400/60 text-white shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                                  : style.pillBg
                            }`}
                          >
                            <span className="shrink-0">{node.logo}</span>
                            <span className="font-semibold">{node.name}</span>
                            {isConnected && !isSelected && (
                              <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-200">
                                Linked
                              </span>
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Layer 2: Cloud Infrastructure Layer */}
                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-sky-300 font-bold flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-sky-400" />
                      <span>
                        LAYER 2: Cloud Infrastructure & Compute Resilience
                      </span>
                    </span>
                    <span className="text-[10px] text-sky-400/80 px-2 py-0.5 rounded bg-sky-500/10">
                      Azure Container Apps / Cache
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {TECH_NODES.filter((n) => n.category === "cloud").map(
                      (node) => {
                        const isSelected = node.id === selectedNodeId;
                        const isConnected = selectedNode.connections.includes(
                          node.id,
                        );
                        const style = getDomainStyle(node.category);
                        return (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2.5 cursor-pointer border ${
                              isSelected
                                ? style.activeBg
                                : isConnected
                                  ? "bg-sky-500/20 border-sky-400/60 text-white shadow-[0_0_12px_rgba(14,165,233,0.2)]"
                                  : style.pillBg
                            }`}
                          >
                            <span className="shrink-0">{node.logo}</span>
                            <span className="font-semibold">{node.name}</span>
                            {isConnected && !isSelected && (
                              <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-sky-400/20 text-sky-200">
                                Linked
                              </span>
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Layer 3: Core Languages & Backend */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-300 font-bold flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-emerald-400" />
                      <span>LAYER 3: Core Application & Runtime Engine</span>
                    </span>
                    <span className="text-[10px] text-emerald-400/80 px-2 py-0.5 rounded bg-emerald-500/10">
                      C# .NET / Python
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {TECH_NODES.filter((n) => n.category === "backend").map(
                      (node) => {
                        const isSelected = node.id === selectedNodeId;
                        const isConnected = selectedNode.connections.includes(
                          node.id,
                        );
                        const style = getDomainStyle(node.category);
                        return (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2.5 cursor-pointer border ${
                              isSelected
                                ? style.activeBg
                                : isConnected
                                  ? "bg-emerald-500/20 border-emerald-400/60 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                                  : style.pillBg
                            }`}
                          >
                            <span className="shrink-0">{node.logo}</span>
                            <span className="font-semibold">{node.name}</span>
                            {isConnected && !isSelected && (
                              <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-200">
                                Linked
                              </span>
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Layer 4: Enterprise Security & Governance */}
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-purple-300 font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>
                        LAYER 4: Enterprise Security Guardrails & Compliance
                      </span>
                    </span>
                    <span className="text-[10px] text-purple-400/80 px-2 py-0.5 rounded bg-purple-500/10">
                      OWASP / TLS / Purview
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {TECH_NODES.filter((n) => n.category === "security").map(
                      (node) => {
                        const isSelected = node.id === selectedNodeId;
                        const isConnected = selectedNode.connections.includes(
                          node.id,
                        );
                        const style = getDomainStyle(node.category);
                        return (
                          <button
                            key={node.id}
                            onClick={() => setSelectedNodeId(node.id)}
                            className={`px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2.5 cursor-pointer border ${
                              isSelected
                                ? style.activeBg
                                : isConnected
                                  ? "bg-purple-500/20 border-purple-400/60 text-white shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                                  : style.pillBg
                            }`}
                          >
                            <span className="shrink-0">{node.logo}</span>
                            <span className="font-semibold">{node.name}</span>
                            {isConnected && !isSelected && (
                              <span className="text-[9px] font-sans px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-200">
                                Linked
                              </span>
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Node Inspector & Architectural Relationships (4 cols) */}
            <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-6 shadow-xl sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Node Inspector</span>
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${getDomainStyle(selectedNode.category).badge}`}
                >
                  {selectedNode.level}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 shadow-sm">
                    {selectedNode.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white">
                      {selectedNode.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      {selectedNode.categoryLabel}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block font-semibold">
                    Architectural Role
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedNode.role}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                    Production Context in Altaj's Work
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedNode.projectContext}
                  </p>
                </div>
              </div>

              {/* Direct Architectural Connections */}
              <div className="pt-2 space-y-2.5 border-t border-slate-800">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                  Connected Systems & Dependencies:
                </span>
                <div className="space-y-1.5">
                  {selectedNode.connections.map((connId) => {
                    const connNode = TECH_NODES.find((n) => n.id === connId);
                    if (!connNode) return null;
                    return (
                      <button
                        key={connId}
                        onClick={() => setSelectedNodeId(connId)}
                        className="w-full p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-400/40 text-left transition-all flex items-center justify-between text-xs font-mono text-slate-300 hover:text-white cursor-pointer group"
                      >
                        <span className="flex items-center gap-2">
                          <span className="shrink-0">{connNode.logo}</span>
                          <span>{connNode.name}</span>
                        </span>
                        <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Domain Matrix View: All colored with authentic logos */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                id: "agentic",
                title: "Agentic AI & LLMs",
                subtitle:
                  "Autonomous reasoning, MCP toolkits & model integrations",
                icon: <Bot className="w-5 h-5 text-cyan-400" />,
                style: getDomainStyle("agentic"),
                nodes: TECH_NODES.filter((n) => n.category === "agentic"),
              },
              {
                id: "cloud",
                title: "Azure Cloud & Distributed Systems",
                subtitle:
                  "High-scale compute, serverless & telemetry correlation",
                icon: <Cloud className="w-5 h-5 text-sky-400" />,
                style: getDomainStyle("cloud"),
                nodes: TECH_NODES.filter((n) => n.category === "cloud"),
              },
              {
                id: "backend",
                title: "Core Languages & Backend Systems",
                subtitle:
                  "Microservices, APIs & high-performance data processing",
                icon: <Code2 className="w-5 h-5 text-emerald-400" />,
                style: getDomainStyle("backend"),
                nodes: TECH_NODES.filter((n) => n.category === "backend"),
              },
              {
                id: "security",
                title: "Security & Enterprise Quality",
                subtitle:
                  "Endpoint defense, TLS authentication & Purview audit",
                icon: <ShieldCheck className="w-5 h-5 text-purple-400" />,
                style: getDomainStyle("security"),
                nodes: TECH_NODES.filter((n) => n.category === "security"),
              },
            ].map((cluster) => (
              <div
                key={cluster.id}
                className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-6 shadow-xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                      {cluster.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-display text-white">
                        {cluster.title}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">
                        {cluster.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cluster.nodes.map((node) => (
                    <div
                      key={node.id}
                      className={`p-3 rounded-xl border ${cluster.style.pillBg} transition-all space-y-1.5 flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="shrink-0">{node.logo}</span>
                          <span className="font-mono text-xs font-semibold text-white">
                            {node.name}
                          </span>
                        </span>
                      </div>
                      <span className="text-[11px] font-sans text-slate-300 leading-snug line-clamp-2">
                        {node.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
