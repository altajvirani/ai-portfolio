# Altaj Virani

### Software Engineer

[altajatwork@gmail.com](mailto:altajatwork@gmail.com) | [+917303934303](tel:+917303934303) | Mumbai, India | [LinkedIn](https://www.linkedin.com/in/altajvirani/) | [GitHub](https://github.com/altajvirani)

---

## EDUCATION

- [**Bachelor of Engineering**](https://drive.google.com/file/d/13Ar1FiG4B4QjiCjCQi0kefs5FlJq7o77/view)  
  Vidyavardhini's College of Engineering & Technology (University of Mumbai) | 02/2021 – 05/2023 | Mumbai, Maharashtra  
  _Computer Engineering - 9.00 CGPA_

- [**Diploma in Engineering**](https://drive.google.com/file/d/1cwvFmlKVv0WVhkpgj0W2K37e0_sl4H8q/view)  
  Vidyavardhini's Bhausaheb Vartak Polytechnic (Maharashtra State Board of Technical Education) | 08/2017 – 11/2020 | Mumbai, Maharashtra  
  _Computer Engineering - 94.00%_

- [**High School**](https://drive.google.com/file/d/1A6t9XAIur-sXbHWvXvRx1l8eb17VYs_l/view)  
  Holy Paradise High School (Maharashtra State Board of Secondary and Higher Secondary Education) | 06/2016 – 05/2017 | Mumbai, Maharashtra  
  _Secondary School Certificate - 80.60%_

---

## EXPERIENCE

### **Software Engineer**

**LTM** (Microsoft Business Unit) | 06/2024 – Present | Mumbai, IN

#### Azure Network Engineering | AI Platform Engineering & Enablement (06/2025 – Present)

- Supported engineering operations and cloud reliability for Microsoft's global Azure network infrastructure across datacenter networking, WAN, ExpressRoute, peering, capacity, edge infrastructure, and hardware lifecycle via an enterprise agentic AI operations platform serving on-call teams with 20+ domain-specific AI agents, 250+ integrated tools, and 150+ automated troubleshooting playbooks.
- Led cross-team adoption of the enterprise agentic AI operations platform across engineering tracks, partnering with leads, PMs, and on-call teams to co-build automated playbooks, domain agents, skills, and Copilot CLI plugins via Model Context Protocol (MCP) toolkits; delivered demos and technical presentations accelerating engineering onboarding.
- Reduced cloud overhead and alleviated production OOM memory pressure by replacing unreleased, ~2-minute Key Vault re-downloads of internal datacenter auth certificates with a 12-hour shared cache across three .NET services on Azure Container Apps; cut Key Vault calls 35× (2,807 → 79/day), eliminated ~13% failed lookups, and added strict TLS validation with 16 unit tests.
- Root-caused 2,640 monthly out-of-memory errors in Azure Container Apps workflow services via KQL and Application Insights, correcting 4 team assumptions with empirical telemetry (unactivated auto-scaling, .NET 768 MB runtime cap, work loss vs crash, storage reads); drove migration to dedicated auto-scaling compute, sustaining zero errors.
- Traced 3,441 rejected API calls (HTTP 400 over 30 days) across nine workflows to caller-side input formatting errors (one workflow causing 70%), clearing the upstream legacy network-state service of blame and providing targeted remediation guidance.
- Restored four broken test environments silently processing zero workflows: identified inherited localhost emulator settings, reconfigured cloud endpoint precedence for Azure Service Bus, Event Hubs, and checkpoint storage, corrected ignored managed-identity bindings, and ensured sovereign-cloud compatibility with 33 new unit tests (suite total: 8,704 passing); proven live by draining 331 of 334 stuck messages in 90 seconds.
- Validated platform capacity for load spikes by building a 13-phase test suite (PowerShell, Azure CLI, Azure Monitor, Azure Service Bus) driving 35,500 workflow executions against Azure Container Apps auto-scaling rules with 45 pass/fail verdicts, proving queue-, CPU-, and HTTP-based scaling while exposing unreachable rules and unscalable services.
- Enhanced portal workflow test-bench capabilities by engineering concurrent execution tracking for multiple simultaneous runs and adding one-click output copying in debug mode.
- Authored 27 pages of comprehensive engineering documentation covering system architecture, component maps, workflow-execution internals, environment access, and reproducible KQL investigation runbooks, alongside a vendor engineer operational guide.

#### Enterprise AI Applications & Intelligent Solutions

- Built an Azure Functions + Copilot Studio chatbot answering queries via indexed ADO Wiki & Engineering Hub docs. Designed persistent threads with swappable strategies (direct search, autonomous reasoning, and hybrid RAG with query-rewriting) and an HNSW indexing pipeline.
- Developed a natural-language schedule system translating English into structured queries via Assistants API decomposition, Pandas aggregation, and Azure AI Search.
- Built a Foundry Agents service generating root-cause summaries and confidence-scored classifications from raw incident metadata, featuring PII redaction.
- Created a classification pipeline to identify automation gaps. Enriched Kusto-exported ICM data, executed checkpoint/resume AI classifications, and generated hierarchical troubleshooting guides.
- Built containerized MCP servers (FastAPI, Docker) extending AI agents with Kusto-based incident analytics and ES Chat integration in restricted environments.
- Created reusable Azure Function deployment modules (blob-storage ZIP-deploy, Docker/ACR lifecycle) with RBAC verification, multi-strategy rollbacks, and a custom API testing framework.

#### Security, Compliance & Governance

- Achieved 100% compliance across production endpoints via a centralized validation microservice (OWASP Top 10, SSRF defense), automated URSA DAST scanning, and Microsoft Purview-compliant Azure SQL audit logging.
- Integrated automated quality scoring (groundedness, accuracy, F1) into the production chatbot for Azure SQL-backed regression tracking.

#### Microsoft Power Apps Engineering | QA & Developer Tooling (09/2024 – 06/2025)

- Supported engineering quality, reliability, and validation across Microsoft Copilot Studio and Power Platform across features, releases, environments, and geographical regions.
- Re-engineered test infrastructure by architecting a singleton page factory pattern—eliminating memory leaks—and automating 200+ test cases via Playwright TypeScript, boosting smoke coverage from 25% to 85% and pass rates to 70%.
- Developed a custom VS Code extension to automate Page Object Model (POM) generation and maintenance, alongside a C# certificate authentication module serving 20+ QA testers.
- Contributed to Microsoft Bot Framework SDK validation, conversational AI module enhancements, and developed Python tooling for developer workflows, structured references, and documentation.

#### Full-Stack .NET Engineering Program | Graduate Engineer Trainee (06/2024 – 09/2024)

- Completed intensive engineering training covering backend (C#, ASP.NET Core, Entity Framework, Microservices, SQL Server) and frontend (TypeScript, AngularJS, Bootstrap).
- Gained hands-on experience in microservice design, JWT authentication, OAuth, design patterns, and agile engineering; achieved highest score in batch with 94.67% aggregate across evaluations.

---

## PROJECTS

- [**AutoQAGen**](https://github.com/altajvirani/AutoQAGen) _(Python, Flask, T5, BERT, NLTK, React)_
  - Engineered an NLP pipeline utilizing T5, POS tagging, and NER to generate multi-format QA pairs, exposing it via a scalable Flask REST API to a component-driven React frontend.
  - Ranked and scored the generated outputs against SQuAD dataset baselines by integrating an automated BERT-based evaluation engine.

- [**AutoQA Chatbot**](https://github.com/altajvirani/AutoQA) _(Python, Scikit-learn, NLTK, KivyMD)_
  - Built a privacy-first, fully offline desktop chatbot capable of querying user-provided text documents without external data transmission.
  - Implemented the search mechanism utilizing TF-IDF vectorization and cosine similarity to rank sentence relevance, supported by NLTK for text preprocessing. Designed the graphical interface using KivyMD and integrated text-to-speech accessibility via Pyttsx3.

- [**SnapWright**](https://marketplace.visualstudio.com/items?itemName=altajvirani.snapwright) _(TypeScript, VS Code API, Playwright)_
  - Architected an open-source VS Code extension featuring a singleton-based page factory pattern that automates POM generation and eliminates memory leaks in large test suites.
  - Significantly improved pipeline execution efficiency by leading the migration of the Microsoft Copilot Studio automation framework to utilize this extension.

- **Visual Workflow Editor Prototype** _(JavaScript, HTML5/CSS3, js-yaml)_
  - Built a browser-based visual editor for orchestrating agentic workflow YAMLs without local dependencies: featuring drag-and-drop stages/steps, bidirectional live YAML synchronization, multi-tab workflow authoring, change-diff tracking, and conformance validation.
  - Integrated automated conformance checks that convert validation errors and schema violations into actionable GitHub Copilot prompts for rapid authoring.

---

## SKILLS

- **Programming Languages** — Python, TypeScript, JavaScript, C#, PowerShell, SQL, KQL, Java
- **Frameworks & Libraries** — .NET, ASP.NET Core, Entity Framework, Pandas, NumPy, OpenPyXL, VS Code Extensions, NLTK, Transformers
- **AI & Automation** — Retrieval Augmented Generation (RAG), Vector Databases & Embeddings, LangChain, Azure AI Foundry, Azure AI Search, Azure OpenAI SDK, GitHub Copilot SDK, Model Context Protocol (MCP), Microsoft Copilot Studio, Microsoft Power Automate, Prompt Engineering
- **Cloud & Deployment** — Azure Functions, Azure Container Apps, Azure Service Bus, Azure Event Hubs, Azure Key Vault, Azure Data Explorer, Azure CLI, Docker
- **Database Systems** — MS SQL Server, MongoDB, Firebase
- **Frontend** — HTML, CSS, Bootstrap, React, Recoil, Redux, ContextAPI, Tailwind, DaisyUI
- **Backend** — FastAPI, Flask, Node.js, Express.js, REST APIs, Microservices
- **Testing & QA** — Playwright (TypeScript), xUnit
- **IDEs, Tools & Utilities** — VS Code, Postman, Git/GitHub, Application Insights, Azure DevOps, IcM

---

## AWARDS

- **Problem Solver Badge** — LTM | 09/2026  
  Nominated for contributions to Azure Networking's enterprise agentic AI operations platform and internal AI initiatives. Recognized for developing innovative solutions to critical technical challenges and earning stakeholder confidence through impactful delivery.

- [**Hi-Five Spot Award**](https://drive.google.com/file/d/18K2sELoqpOP2vz0gN2iA98Z_g0hWm1qD/view?usp=drive_link) — LTM | 11/2025  
  Recognized for consistently exceeding expectations by demonstrating exceptional innovation in developing AI use cases, resulting in impactful outcomes that highlighted both technical and collaborative strengths.

- [**Super Crew Spot Award**](https://drive.google.com/file/d/1vt7842TyYoa6MsA7CXNONp2AQxTDPuyT/view?usp=drive_link) — LTM | 08/2025  
  Awarded along with the team for outstanding efforts in architecting and deploying compliant, enterprise-grade Generative AI and Automation systems that modernized internal operations.

- [**Hi-Five Spot Award**](https://drive.google.com/file/d/1lLLw5HtWZtIoV_LdTjDxVahClUSr6iLq/view?usp=drive_link) — LTM | 07/2025  
  Commended for leading QA framework stability improvements, successful system migrations, and independently building automation tools that boosted team productivity.

---

## PUBLICATIONS

- [**Automatic Question Answer Generation using T5 and NLP**](https://drive.google.com/file/d/1lef8moQmUvzgtEttF1r9qbtEL74lxP0r/view?usp=sharing) — IEEE ICSCSS (2023)
  - Published & presented a Question-Answer Generation (QAG) architecture paper in the IEEE ICSCSS proceedings, outlining an automated system to improve text comprehension efficiency across educational, industrial and research settings.
  - Engineered and detailed the system's core methodology, combining the T5 model with NLP techniques like NER, POS tagging, and Sense2Vec for robust question synthesis and distractor generation.

---

## PATENTS & COPYRIGHTS

- [**AutoQA AI**](https://drive.google.com/file/d/1ae07j8Z6j2pZGD-Qdy74iskDIWAOfpcJ/view)  
  Copyright approved by Government of India for the project titled 'AutoQA AI - A Question Answering Application'.

---

## CERTIFICATIONS

- [**Microsoft Certified: Azure AI Fundamentals (AI-900)**](https://learn.microsoft.com/api/credentials/share/en-in/altajvirani/C0872E8742B2D90?sharingId=48999C5125E08B64)
- [**Azure Functions Masterclass - Udemy**](https://ude.my/UC-ed09d39d-725e-474e-8f85-4b0a3b33615c/)
- [**Azure AI Studio (AI Foundry) - Udemy**](https://ude.my/UC-e65a23d5-0f7f-4f02-816e-aaf2e53c4401)