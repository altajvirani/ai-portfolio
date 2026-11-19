export interface KnowledgeChunk {
  id: string;
  title: string;
  category: 'role_summary' | 'agentic_ai' | 'cloud_infrastructure' | 'enterprise_ai' | 'projects' | 'publications' | 'awards' | 'education' | 'skills';
  source: string;
  content: string;
  keywords: string[];
}

export const KNOWLEDGE_STORE: KnowledgeChunk[] = [
  {
    id: 'profile_overview',
    title: 'Professional Profile & Executive Summary',
    category: 'role_summary',
    source: 'resume-altaj-virani.pdf (Page 1)',
    keywords: ['altaj', 'virani', 'azure', 'ai', 'engineer', 'agentic', 'summary', 'about', 'bio', 'who', 'contact', 'email'],
    content: `Altaj A. Virani is an Azure AI Engineer specializing in Agentic AI Platforms, LLM integration, and Enterprise Cloud Systems.
Based in Mumbai, India.
Contact: altajatwork@gmail.com | +91-730-393-4303.
Summary: Experienced in Azure AI platform engineering, agentic AI, and engineering enablement, with a focus on improving engineering productivity and cloud reliability. Skilled in developing enterprise AI applications using Azure and Microsoft AI technologies, integrating large language models into practical business and engineering workflows.`
  },
  {
    id: 'agentic_ai_platform',
    title: 'Enterprise Agentic AI Operations & Engineering Enablement',
    category: 'agentic_ai',
    source: 'resume-altaj-virani.pdf (Page 1)',
    keywords: ['agentic', 'agents', 'mcp', 'model context protocol', 'playbooks', 'cli', 'copilot', 'operations', 'network', 'azure networking'],
    content: `Altaj led cross-team adoption of an enterprise agentic AI operations platform across engineering tracks, partnering with technical leads and on-call teams to co-build automated playbooks, domain agents, skills, and Copilot CLI plugins through Model Context Protocol toolkits.
The work supported cloud network operations with domain-specific AI agents, integrated operational tools, and automated incident workflows.
Core technologies included .NET/C# services on Azure Container Apps, GitHub Copilot SDK, Azure OpenAI, Model Context Protocol (MCP), Azure Service Bus, Event Hubs, Key Vault, Application Insights, and Azure Data Explorer.`
  },
  {
    id: 'key_vault_optimization',
    title: 'Certificate Authentication Fix & 35× Azure Key Vault Call Reduction',
    category: 'cloud_infrastructure',
    source: 'resume-altaj-virani.pdf (Page 1)',
    keywords: ['key vault', 'caching', 'memory', 'oom', '35x', 'cache', 'container apps', 'tls', 'certificates', 'overhead', 'reliability', 'xunit'],
    content: `Certificate Authentication Fix & Key Vault Optimization (C#/.NET, Azure Key Vault, xUnit):
- Problem: The certificate the backend services use to authenticate to internal network APIs was re-downloaded from Azure Key Vault every ~2 minutes and never released, and production requested a staging certificate that did not exist, failing ~13% of lookups.
- Solution: Added a shared cache with 12-hour refresh and expiry protection, corrected the lookup, and enforced strict TLS certificate validation across all three backend services with 16 unit tests.
- Impact: Production Key Vault calls fell 35× (from 2,807 down to 79 per day) and failed lookups dropped to zero.`
  },
  {
    id: 'oom_root_cause_scaling',
    title: 'Production Memory Failures Root-Cause Analysis (2,640 Monthly OOMs Eliminated)',
    category: 'cloud_infrastructure',
    source: 'resume-altaj-virani.pdf (Page 1)',
    keywords: ['oom', 'kql', 'application insights', 'out of memory', 'errors', 'azure container apps', 'auto scaling', 'dedicated compute', 'kusto', 'adx'],
    content: `Production Memory Failures Investigation (KQL, Azure Data Explorer, Application Insights, .NET):
- Investigated out-of-memory errors in the workflow-execution service that peaked at 2,640 per 30 days, each losing a workflow in-progress work.
- Corrected four working assumptions with measured evidence: auto-scaling had never been enabled; the usable limit was the .NET runtime's 768 MB cap (not the 1 GB container); the errors lost work rather than crashing the service; and the suspected network-inventory API was not a cause.
- Traced the growth to repeated state-storage reads at every workflow step and sized the capacity needed.
- Result: The platform owner confirmed the analysis and moved the service to dedicated, auto-scaling compute; these errors have stayed at zero since.`
  },
  {
    id: 'load_testing_capacity_suite',
    title: '13-Phase Auto-Scaling Load Test Suite (35,500 Workflows)',
    category: 'cloud_infrastructure',
    source: 'resume-altaj-virani.pdf (Page 1)',
    keywords: ['load testing', 'capacity', 'auto scaling', 'powershell', 'azure monitor', '35500', 'workflows', 'stress', 'scaling rules', 'backlog'],
    content: `Auto-Scaling Test Suite (PowerShell, Azure CLI, Azure Monitor, Azure Service Bus):
- Built a 13-phase suite that generates load against a deployed environment and checks every auto-scaling rule (scale-out, scale-in, recovery, and safety) with 45 pass/fail verdicts; a full run drives 35,500 workflow executions.
- Proved queue-, CPU-, and HTTP-based scaling, including a 15,708-message backlog that scaled from one instance to three and drained.
- Exposed rules that could never fire: memory thresholds set equal to the .NET memory cap, no scaling for high-priority work, and two services that could not scale.`
  },
  {
    id: 'test_env_and_telemetry_analysis',
    title: 'Test-Environment Configuration Fix & Telemetry Correlation',
    category: 'cloud_infrastructure',
    source: 'resume-altaj-virani.pdf (Page 1)',
    keywords: ['test environment', 'emulator', 'service bus', 'event hubs', 'managed identity', 'telemetry', 'http 400', 'kql'],
    content: `Configuration Fixes & Telemetry Analysis:
1. Test-Environment Configuration Fix (C#/.NET, Azure Service Bus, Event Hubs, managed identity, xUnit):
- Found four deployed test environments processed no workflows while reporting healthy: they inherited local-emulator settings, so the workflow engine connected to a queue on localhost.
- Made configured cloud endpoints take precedence for Service Bus, Event Hubs, and checkpoint storage, fixed a managed-identity setting, and kept it sovereign-cloud compatible with 33 new tests (full suite: 8,704 passing). Proved live by draining 331 of 334 stuck messages in 90 seconds.
2. Network-State API Failure Analysis (KQL, telemetry correlation):
- Showed that failures blamed on an unreliable legacy network-state service came from callers: 3,441 rejected HTTP 400 requests in 30 days from one endpoint, traced to 9 workflows (one causing 70%). Reported cause and remediation to platform team.`
  },
  {
    id: 'security_governance',
    title: 'Security, Compliance & Production Quality Scoring',
    category: 'enterprise_ai',
    source: 'resume-altaj-virani.pdf (Page 1)',
    keywords: ['security', 'compliance', 'owasp', 'ssrf', 'groundedness', 'f1', 'quality scoring', 'azure sql'],
    content: `Security, Governance & AI Evaluation:
- Achieved 100% compliance across production endpoints via centralized validation (OWASP Top 10, SSRF defense), automated dynamic security scanning, and Azure SQL audit logging.
- Integrated automated AI quality scoring (groundedness, accuracy, F1 score) directly into production chatbots for Azure SQL-backed regression tracking.`
  },
  {
    id: 'research_publications',
    title: 'IEEE Research Publication: Automatic QA Generation using T5 & NLP',
    category: 'publications',
    source: 'resume-altaj-virani.pdf (Page 2)',
    keywords: ['publication', 'ieee', 't5', 'nlp', 'research', 'paper', 'autoqa', 'question answering', 'sense2vec', 'distractor generation'],
    content: `Published IEEE Research:
- Title: 'Automatic Question Answer Generation using T5 and NLP' (IEEE ICSCSS 2023).
- Abstract & Contribution: Published & presented Question-Answer Generation (QAG) architecture in IEEE ICSCSS proceedings.
- Combined Google T5 model with NLP techniques (NER, POS tagging, Sense2Vec) for robust automated question synthesis and distractor generation to improve text comprehension efficiency in educational and industrial settings.`
  },
  {
    id: 'patents_copyrights',
    title: 'Government Patent & Copyright: AutoQA AI',
    category: 'publications',
    source: 'resume-altaj-virani.pdf (Page 2)',
    keywords: ['patent', 'copyright', 'government of india', 'autoqa ai', 'intellectual property'],
    content: `Patents & Copyrights:
- Project: 'AutoQA AI - A Question Answering Application'.
- Copyright formally approved by the Government of India, recognizing the proprietary methodology for automated document question-answering.`
  },
  {
    id: 'notable_projects',
    title: 'Featured Software Projects: AutoQAGen, AutoQA AI, SnapWright & Nivesh',
    category: 'projects',
    source: 'resume-altaj-virani.pdf (Page 2) & Verified Portfolios',
    keywords: ['projects', 'autoqagen', 'autoqa ai', 'snapwright', 'nivesh', 'vs code extension', 'android', 'crowdfunding', 'playwright', 'pagefactory', 'pom', 'offline'],
    content: `Featured Projects:
1. AutoQAGen (Python, Flask, T5, BERT, NLTK, React):
- Engineered an NLP pipeline utilizing T5, POS tagging, and NER to generate multi-format QA pairs, exposed via a scalable Flask REST API to a component-driven React frontend.
- Evaluated and scored generated outputs against SQuAD dataset baselines using an automated BERT evaluation engine.

2. AutoQA AI (Python, Scikit-learn, NLTK, KivyMD):
- Built a privacy-first, fully offline desktop application querying user-provided text documents without external data transmission (approved copyright by the Government of India).
- Implemented search mechanism utilizing TF-IDF vectorization and cosine similarity to rank sentence relevance with NLTK preprocessing and Pyttsx3 TTS.

3. SnapWright (TypeScript, VS Code Extension API, Node.js):
- Architected and published an open-source VS Code extension on the official marketplace (altajvirani.snapwright).
- Features a singleton-based PageFactory pattern that automates Page Object Model (POM) generation, consolidates imports, and eliminates memory leaks in large test suites.
- Led the migration of internal Copilot Studio automation frameworks to utilize this extension, improving pipeline execution efficiency.

4. Nivesh (Android Java, REST APIs, Material Design, Firebase):
- Open-source Android mobile application designed to democratize venture seed capital and crowdfunding.
- Connects early-stage startup founders with micro-investors and angel backers through transparent equity tracking, real-time fundraising metrics, and milestone dashboards.`
  },
  {
    id: 'awards_recognition',
    title: 'Industry Awards & Recognition',
    category: 'awards',
    source: 'resume-altaj-virani.pdf (Page 2)',
    keywords: ['awards', 'recognition', 'spot award', 'hi-five', 'super crew', 'problem solver', 'honors'],
    content: `Awards & Honors:
1. Problem Solver Badge (Sep 2026): Nominated for contributions to agentic operations tooling and enterprise AI initiatives, earning stakeholder confidence through technical solutions.
2. Hi-Five Spot Award (Nov 2025): Recognized for consistently exceeding expectations by demonstrating exceptional innovation in developing AI use cases.
3. Super Crew Spot Award (Aug 2025 / Oct 2025): Awarded along with the team for outstanding efforts in architecting and deploying compliant, enterprise-grade Generative AI and Automation systems that modernized internal operations.
4. Hi-Five Spot Award (Jul 2025): Commended for leading QA framework stability improvements, system migrations, and independently building automation tools that boosted engineering productivity.`
  },
  {
    id: 'education_certifications',
    title: 'Academic Qualifications & Professional Certifications',
    category: 'education',
    source: 'resume-altaj-virani.pdf (Page 1)',
    keywords: ['education', 'degree', 'cgpa', 'university of mumbai', 'college', 'certifications', 'ai-900', 'azure ai fundamentals'],
    content: `Education & Academic Excellence:
- Bachelor of Engineering (B.E.) in Computer Engineering: Vidyavardhini's College of Engineering and Technology, University of Mumbai. CGPA: 9.00 / 10.0 (Feb 2021 – May 2023).
- Engineering Diploma in Computer Engineering: Vidyavardhini's Bhausaheb Vartak Polytechnic. Percentage: 94.00% (Aug 2017 – Nov 2020).
- High School (SSC): Holy Paradise High School. Percentage: 80.60%.
- Professional Certifications:
  1. Microsoft Certified: Azure AI Fundamentals (AI-900)
  2. Azure Functions Masterclass (Udemy)
  3. Azure AI Studio / AI Foundry (Udemy)`
  },
  {
    id: 'technical_skills_matrix',
    title: 'Core Technical Skills & Tooling (AI, Cloud & Languages)',
    category: 'skills',
    source: 'resume-altaj-virani.pdf (Page 2)',
    keywords: ['skills', 'tech stack', 'languages', 'python', 'typescript', 'c#', '.net', 'azure', 'kql', 'docker', 'fastapi'],
    content: `Core Technical Skills Matrix:
- Programming Languages: Python, TypeScript, JavaScript, C#, .NET, PowerShell, SQL, KQL (Kusto Query Language), Java.
- AI & Agentic Systems: Retrieval Augmented Generation (RAG), Model Context Protocol (MCP), Vector Databases & Embeddings, Azure AI Foundry, Azure OpenAI SDK, GitHub Copilot SDK, Copilot Studio, Power Automate, Prompt Engineering, LangChain.
- Cloud & Infrastructure: Azure Container Apps, Azure Functions, Azure Key Vault, Azure Service Bus, Azure Event Hubs, Azure Data Explorer, Azure CLI, Docker.
- Backend & Microservices: FastAPI, Flask, Node.js, Express.js, ASP.NET Core, REST APIs.
- Databases: MS SQL Server, MongoDB, Firebase, Vector Stores.`
  }
];
