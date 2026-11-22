# Altaj A. Virani
**Azure AI Engineer · Agentic AI Platforms · Enterprise Cloud Systems**
Location: Mumbai, India | Email: altajatwork@gmail.com | Phone: +91-730-393-4303
GitHub: https://github.com/altajvirani | LinkedIn: https://www.linkedin.com/in/altajvirani/

---

## Executive Summary
Azure AI Engineer specializing in enterprise Agentic AI Platforms, LLM integration, and cloud systems reliability. Experienced in developing enterprise AI applications using Microsoft Azure technologies, Model Context Protocol (MCP), and large language models into practical business and engineering workflows. Proven track record in eliminating critical production reliability bottlenecks (35× Key Vault optimization, zero-OOM compute migration) and engineering high-impact developer tooling.

---

## Technical Skills Matrix
- **AI & Agentic Systems**: Retrieval-Augmented Generation (RAG), Model Context Protocol (MCP), Vector Databases & Embeddings, Azure AI Foundry, Azure OpenAI SDK, GitHub Copilot SDK, Copilot Studio, Prompt Engineering, Agentic Toolkits, LangChain.
- **Languages**: Python, TypeScript, JavaScript, C#, .NET, PowerShell, SQL, KQL (Kusto Query Language), Java.
- **Cloud & Infrastructure**: Azure Container Apps, Azure Functions, Azure Key Vault, Azure Service Bus, Azure Event Hubs, Azure Data Explorer (ADX), Azure CLI, Docker.
- **Backend & Microservices**: FastAPI, Flask, Node.js, Express.js, ASP.NET Core, REST APIs.
- **Databases**: MS SQL Server, PostgreSQL (Neon), MongoDB, Firebase, Vector Stores.
- **Quality & Security**: OWASP Top 10, SSRF Defense, DAST, Automated Dynamic Security Scanning, Azure SQL Audit Logging, Playwright, xUnit.

---

## Professional Work Experience

### LTM — Microsoft Business Unit (MSBU) | Mumbai, India
**Software Engineer · Azure Network Engineering & AI Platform Enablement**
*June 2025 – Present*
- **Enterprise Agentic AI Operations**: Led cross-team adoption of an enterprise agentic AI operations platform across engineering tracks. Partnered with technical leads and on-call teams to co-build automated playbooks, domain agents, skills, and Copilot CLI plugins through Model Context Protocol (MCP) toolkits (20+ domain agents, 250+ tools).
- **Conversational Assistants**: Shipped Azure Functions + Copilot Studio chatbots utilizing hybrid RAG and HNSW vector indexing, reducing troubleshooting time by 80% for 200+ engineering users.
- **Operational Tooling**: Built natural-language on-call rostering (95% intent accuracy), Azure AI Foundry root-cause triage with automatic PII redaction, and containerized MCP servers deployed to Azure Container Apps.
- **Azure Key Vault 35× Call Reduction**:
  - *Problem*: Certificate used for backend network API authentication was re-downloaded from Azure Key Vault every ~2 minutes and never released; production requested a non-existent staging certificate, failing ~13% of lookups.
  - *Solution*: Added a shared cache with 12-hour refresh and expiry protection, corrected lookups, and enforced strict TLS validation across three backend services with 16 xUnit unit tests.
  - *Impact*: Production Key Vault calls dropped 35× (from 2,807 down to 79 per day); failed lookups dropped to zero.
- **Production Memory Failures Root-Cause Analysis (2,640 Monthly OOMs Eliminated)**:
  - *Investigation*: Investigated out-of-memory errors in workflow execution service that peaked at 2,640 per 30 days, losing work-in-progress.
  - *Root Cause*: Corrected four faulty working assumptions using KQL telemetry in Azure Data Explorer/Application Insights: auto-scaling had never been enabled; usable limit was .NET runtime's 768 MB cap (not 1 GB container); errors lost work rather than crashing the container; traced memory growth to repeated state-storage reads at every workflow step.
  - *Impact*: Platform owner moved the service to dedicated auto-scaling compute; OOM errors eliminated completely (zero occurrences).
- **13-Phase Auto-Scaling Load Test Suite**:
  - Built a 13-phase PowerShell + Azure CLI load testing suite validating all auto-scaling rules across 35,500 workflow executions with 45 pass/fail verdicts.
  - Proved queue-, CPU-, and HTTP-based scaling, including draining a 15,708-message backlog.
  - Exposed critical rules that could never fire (memory thresholds equal to .NET cap, no scaling for high-priority queues).
- **Security & Governance**: Achieved 100% compliance across production endpoints via centralized OWASP Top 10 validation, SSRF defense, automated dynamic security scanning, and Azure SQL audit logging.

### LTM — Microsoft Business Unit (MSBU) | Mumbai, India
**Software Engineer · Microsoft Power Apps & Copilot Studio Engineering**
*September 2024 – June 2025*
- **QA Automation & Testing Framework**: Automated 200+ Playwright TypeScript end-to-end tests using a singleton PageFactory pattern, lifting smoke test coverage from 25% to 85% and pass rates to 70%.
- **Developer Extensions**: Built custom VS Code extension for automated Page Object Model (POM) generation, eliminating boilerplate code and memory leaks in large suites.
- **Security Module**: Created C# certificate-auth module for 20+ automation engineers and contributed to Microsoft Bot Framework SDK runtime stability.

### LTM — Microsoft Business Unit (MSBU) | Mumbai, India
**Graduate Engineering Trainee**
*August 2023 – September 2024*
- Trained across Azure cloud services, enterprise C#/.NET development, and conversational AI frameworks.

---

## Featured Projects & Open Source

### 1. SnapWright (VS Code Extension)
- *Tech Stack*: TypeScript, VS Code Extension API, Node.js, Playwright.
- Published open-source extension on the official Visual Studio Marketplace (`altajvirani.snapwright`).
- Features a singleton-based PageFactory pattern that automates Page Object Model (POM) generation, consolidates imports, and eliminates memory leaks in large test suites.
- Led the migration of internal automation frameworks to utilize this extension, improving pipeline execution efficiency.

### 2. AutoQA AI (Offline Document QA Application)
- *Tech Stack*: Python, Scikit-learn, NLTK, KivyMD, Pyttsx3 TTS.
- Built a privacy-first, fully offline desktop application querying user-provided text documents without external data transmission.
- Implemented search mechanism utilizing TF-IDF vectorization and cosine similarity to rank sentence relevance with NLTK preprocessing.
- **Approved copyright by the Government of India**, recognizing the proprietary methodology for automated document question-answering.

### 3. AutoQAGen (Automated Question-Answer Generation Pipeline)
- *Tech Stack*: Python, Flask, Google T5, BERT, NLTK, React.
- Engineered an NLP pipeline utilizing Google T5, POS tagging, and Named Entity Recognition (NER) to synthesize multi-format QA pairs.
- Exposed via a scalable Flask REST API to a component-driven React frontend.
- Evaluated and scored generated outputs against SQuAD dataset baselines using an automated BERT evaluation engine.

### 4. Nivesh (Crowdfunding & Venture Seed Platform)
- *Tech Stack*: Android Java, REST APIs, Material Design, Firebase.
- Open-source Android mobile application designed to democratize venture seed capital and crowdfunding.
- Connects early-stage startup founders with micro-investors and angel backers through transparent equity tracking, real-time fundraising metrics, and milestone dashboards.

---

## Research Publications & Intellectual Property

- **IEEE Research Publication**:
  - *Title*: "Automatic Question Answer Generation using T5 and NLP"
  - *Conference*: IEEE International Conference on Smart City and Cloud Computing (IEEE ICSCSS 2023).
  - *Contribution*: Published and presented Question-Answer Generation (QAG) architecture combining Google T5 with NLP techniques (NER, POS tagging, Sense2Vec) for automated question synthesis and distractor generation.
- **Government Copyright**:
  - *Title*: "AutoQA AI - A Question Answering Application"
  - *Issuing Body*: Government of India (Copyright Office). Formally approved intellectual property.

---

## Honors, Awards & Recognition

1. **Problem Solver Badge (September 2026)**: Nominated for technical contributions to agentic operations tooling and enterprise AI initiatives.
2. **Hi-Five Spot Award (November 2025)**: Recognized for consistently exceeding expectations by demonstrating exceptional innovation in developing AI use cases.
3. **Super Crew Spot Award (August 2025 / October 2025)**: Awarded along with the team for outstanding efforts in architecting and deploying compliant, enterprise-grade Generative AI and Automation systems.
4. **Hi-Five Spot Award (July 2025)**: Commended for leading QA framework stability improvements, system migrations, and independently building automation tools that boosted engineering productivity.

---

## Education & Academic Qualifications

- **Bachelor of Engineering (B.E.) in Computer Engineering**
  *Vidyavardhini's College of Engineering and Technology, University of Mumbai*
  *Graduated: May 2023 | CGPA: 9.00 / 10.0*
- **Diploma in Computer Engineering**
  *Vidyavardhini's Bhausaheb Vartak Polytechnic*
  *Graduated: November 2020 | Aggregate: 94.00%*
- **Secondary School Certificate (SSC)**
  *Holy Paradise High School | Aggregate: 80.60%*

---

## Professional Certifications
- **Microsoft Certified: Azure AI Fundamentals (AI-900)**
- **Azure Functions Masterclass** (Udemy)
- **Azure AI Studio / AI Foundry** (Udemy)
