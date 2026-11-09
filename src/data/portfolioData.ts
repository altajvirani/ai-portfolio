import { WorkProject, PersonalProject, SkillCategory, AwardItem, EducationItem, CertificationItem } from '../types.ts';

export const SOCIAL_LINKS = {
  github: 'https://github.com/altajvirani',
  linkedin: 'https://www.linkedin.com/in/altajvirani/',
  stackoverflow: 'https://stackoverflow.com/users/10182929/altaj-virani',
  x: 'https://x.com/AltajVirani',
  instagram: 'https://www.instagram.com/altajvirani',
  email: 'altajatwork@gmail.com',
  location: 'Mumbai, India'
};

export const MARQUEE_ITEMS = [
  'AGENTIC OPERATIONS',
  'MODEL CONTEXT PROTOCOL (MCP)',
  'HIGH-SCALE DISTRIBUTED CACHING',
  'AZURE CONTAINER APPS',
  'HYBRID RAG RETRIEVAL',
  'KQL & AZURE DATA EXPLORER',
  'ZERO-OOM CLUSTER RESILIENCE',
  'AZURE OPENAI SDK',
  'C# .NET MICROSERVICES',
  'PYTHON NLP TRANSFORMERS',
  'MICROSOFT BOT FRAMEWORK SDK',
  'TELEMETRY CORRELATION'
];

export const WORK_EXPERIENCE: WorkProject[] = [
  {
    id: 'azure-network-engineering',
    projectName: 'Azure Network Engineering | Viki-AI',
    businessUnit: 'Microsoft Business Unit (MSBU)',
    role: 'Software Engineer',
    period: 'June 2025 – Present',
    description: "Core contributor to Viki-AI, Microsoft's internal agentic AI operations platform for Azure global network infrastructure.",
    keyContributions: [
      {
        area: 'Viki-AI & Agentic Operations',
        points: [
          'Led cross-team enablement of Viki-AI, co-building automated playbooks, domain agents, and Copilot CLI plugins via Model Context Protocol (MCP) toolkits.',
          'Built enterprise AI assistants combining document search, autonomous reasoning, and hybrid RAG, reducing troubleshooting time by 80% for 200+ users.',
          'Developed natural-language scheduling and rostering solutions translating user requests into structured queries with 95% accuracy.'
        ]
      },
      {
        area: 'Cloud Reliability & High-Scale Systems',
        points: [
          'Reduced production Key Vault calls 35× (2,807 to 79/day) and eliminated failed lookups by implementing a 12-hour distributed cache with strict TLS validation.',
          'Root-caused 2,640 monthly out-of-memory (OOM) errors using KQL and Application Insights, migrating services to dedicated auto-scaling compute with errors sustained at zero.',
          'Built a 13-phase load-testing suite executing 35,500 workflows with 45 pass/fail verdicts to validate auto-scaling rules under heavy backlog.'
        ]
      }
    ],
    technologies: [
      'Model Context Protocol (MCP)',
      'GitHub Copilot SDK',
      'Azure OpenAI',
      'Azure Container Apps',
      'C# / .NET',
      'KQL / Azure Data Explorer',
      'Azure Key Vault',
      'PowerShell'
    ]
  },
  {
    id: 'power-apps-engineering',
    projectName: 'Microsoft Power Apps Engineering',
    businessUnit: 'Microsoft Business Unit (MSBU)',
    role: 'Software Engineer',
    period: 'September 2024 – June 2025',
    description: "Contributed to Microsoft Power Platform conversational capabilities and developer tools.",
    keyContributions: [
      {
        area: 'SDK Development & Tooling',
        points: [
          'Contributed to Microsoft Bot Framework SDK development, focusing on conversational runtime modules and dialog stability.',
          'Developed and integrated a C# certificate-authentication module to validate certificate-based authentication across supported environments.',
          'Implemented Python developer tooling for automated workflows, structured references, and documentation.'
        ]
      }
    ],
    technologies: [
      'Microsoft Bot Framework SDK',
      'Microsoft Copilot Studio',
      'C# / .NET',
      'Python',
      'Azure DevOps'
    ]
  },
  {
    id: 'graduate-engineer-trainee',
    projectName: 'Graduate Engineer Trainee (Orchard Training Program)',
    businessUnit: 'Microsoft Business Unit (MSBU)',
    role: 'Graduate Engineer Trainee',
    period: 'June 2024 – September 2024',
    description: 'Intensive full-stack .NET and cloud microservices engineering program.',
    keyContributions: [
      {
        area: 'Full-Stack .NET & Cloud Microservices',
        points: [
          'Completed rigorous engineering curriculum covering C#, ASP.NET Core, Entity Framework, Web APIs, JWT Authentication, and SQL Server.',
          'Achieved #1 Batch Topper ranking with a 94.67% aggregate across all technical evaluations.'
        ]
      }
    ],
    technologies: [
      'C#',
      'ASP.NET Core',
      'Entity Framework',
      'Web APIs',
      'MS SQL Server',
      'Microservices'
    ]
  }
];

export const PERSONAL_PROJECTS: PersonalProject[] = [
  {
    id: 'autoqagen',
    title: 'AutoQAGen',
    subtitle: 'IEEE ICSCSS 2023 Published Paper',
    description: 'Published and presented a Question-Answer Generation (QAG) architecture paper in the IEEE ICSCSS proceedings. Engineered an NLP pipeline combining Google T5 with Named Entity Recognition, POS tagging, and Sense2Vec for multi-format question synthesis and context-aware distractor generation.',
    highlights: [
      'Multi-format QA pair synthesis using fine-tuned T5 transformer models',
      'Sense2Vec vector analysis for context-aware, semantically plausible distractor generation',
      'Automated evaluation pipeline benchmarked against SQuAD dataset baselines with BERT scoring',
      'Scalable Flask REST API backend paired with a React frontend'
    ],
    technologies: ['Python', 'Google T5', 'BERT', 'Sense2Vec', 'NLTK', 'Flask', 'React'],
    publicationOrCopyright: 'IEEE ICSCSS (2023) Proceeding Publication',
    documentUrl: 'https://drive.google.com/file/d/1lef8moQmUvzgtEttF1r9qbtEL74lxP0r/view?usp=sharing',
    githubUrl: 'https://github.com/altajvirani/AutoQAGen',
    accentColor: 'cyan'
  },
  {
    id: 'autoqa-ai',
    title: 'AutoQA AI',
    subtitle: 'Govt. of India Copyright Approved',
    description: "Registered intellectual property and copyright approved by the Government of India for 'AutoQA AI - A Question Answering Application'. Built as a privacy-first, fully offline desktop assistant querying local documents without external data transmission.",
    highlights: [
      'Approved copyright registered with the Government of India for automated question answering',
      'Semantic document search using TF-IDF vectorization and cosine similarity scoring',
      'NLTK pipeline for text preprocessing, sentence segmentation, and keyword extraction',
      'Desktop interface crafted with KivyMD and integrated Pyttsx3 text-to-speech accessibility'
    ],
    technologies: ['Python', 'Scikit-learn (TF-IDF)', 'NLTK', 'KivyMD', 'Pyttsx3'],
    publicationOrCopyright: 'Government of India Copyright Approved',
    documentUrl: 'https://drive.google.com/file/d/1ae07j8Z6j2pZGD-Qdy74iskDIWAOfpcJ/view',
    githubUrl: 'https://github.com/altajvirani/AutoQA',
    accentColor: 'emerald'
  },
  {
    id: 'snapwright',
    title: 'SnapWright',
    subtitle: 'Published VS Code Extension · Marketplace & Open Source',
    description: 'Architected and published an open-source Visual Studio Code extension on the official marketplace. Implements a singleton-based PageFactory pattern that automates Page Object Model (POM) generation, consolidates imports, and eliminates memory leaks in enterprise test suites.',
    highlights: [
      'Published on the official Visual Studio Code Marketplace (altajvirani.snapwright)',
      'Automated Page Object Model (POM) generator with smart class-name and path detection',
      'Singleton PageFactory architecture eliminating memory leaks in high-scale test suites',
      'Adopted across internal frameworks to accelerate test pipeline execution efficiency'
    ],
    technologies: ['TypeScript', 'VS Code Extension API', 'Node.js', 'Developer Tooling', 'AST Parsing'],
    publicationOrCopyright: 'VS Code Marketplace Published Extension',
    marketplaceUrl: 'https://marketplace.visualstudio.com/items?itemName=altajvirani.snapwright',
    githubUrl: 'https://github.com/altajvirani/SnapWright',
    accentColor: 'purple'
  },
  {
    id: 'nivesh',
    title: 'Nivesh',
    subtitle: 'Start-Up Investment & Crowdfunding Platform',
    description: 'An open-source Android mobile application designed to democratize venture seed capital and crowdfunding. Connects early-stage startup founders with micro-investors and angel backers through transparent equity tracking and milestone dashboards.',
    highlights: [
      'Comprehensive startup discovery feed with real-time crowdfunding metrics and pitch decks',
      'Interactive investment tracking with portfolio analytics and milestone updates',
      'Native Android Java architecture with responsive Material Design UI'
    ],
    technologies: ['Android Java', 'Mobile App Architecture', 'REST APIs', 'Material Design', 'Firebase'],
    publicationOrCopyright: 'Open-Source Venture Platform',
    githubUrl: 'https://github.com/altajvirani/Nivesh',
    accentColor: 'sky'
  }
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: 'Agentic AI & Orchestration',
    tagline: 'Autonomous reasoning, MCP toolkits & LLM integrations',
    colorScheme: 'cyan',
    skills: [
      { name: 'Model Context Protocol (MCP)', level: 'Architecture', highlight: true },
      { name: 'GitHub Copilot SDK', level: 'Production', highlight: true },
      { name: 'Azure OpenAI SDK', level: 'Core', highlight: true },
      { name: 'Hybrid RAG & HNSW Indexing', level: 'Architecture', highlight: true },
      { name: 'Vector Databases', level: 'Production' },
      { name: 'Microsoft Copilot Studio', level: 'Core' },
      { name: 'Azure AI Foundry', level: 'Production' },
      { name: 'Prompt Engineering', level: 'Core' }
    ]
  },
  {
    category: 'Azure Cloud & Distributed Systems',
    tagline: 'High-scale compute, serverless & telemetry',
    colorScheme: 'azure',
    skills: [
      { name: 'Azure Container Apps', level: 'Production', highlight: true },
      { name: 'Azure Functions (Serverless)', level: 'Core', highlight: true },
      { name: 'Azure Key Vault (Shared Caching)', level: 'Production', highlight: true },
      { name: 'Azure Data Explorer (KQL)', level: 'Architecture', highlight: true },
      { name: 'Application Insights', level: 'Production' },
      { name: 'Azure Service Bus & Event Hubs', level: 'Core' },
      { name: 'PowerShell & Azure CLI', level: 'Production' },
      { name: 'Docker Containers', level: 'Core' }
    ]
  },
  {
    category: 'Core Languages & Backend Systems',
    tagline: 'Microservices, APIs & data processing',
    colorScheme: 'emerald',
    skills: [
      { name: 'Python (FastAPI, Flask, Pandas)', level: 'Production', highlight: true },
      { name: 'C# / .NET Core', level: 'Architecture', highlight: true },
      { name: 'ASP.NET Core Web APIs', level: 'Production', highlight: true },
      { name: 'TypeScript & JavaScript', level: 'Core' },
      { name: 'MS SQL Server', level: 'Core' },
      { name: 'Microservices Architecture', level: 'Architecture' }
    ]
  },
  {
    category: 'Security & Enterprise Quality',
    tagline: 'Endpoint defense, audit & validation',
    colorScheme: 'purple',
    skills: [
      { name: 'OWASP Top 10 & Input Validation', level: 'Production', highlight: true },
      { name: 'SSRF Mitigation & Endpoint Hardening', level: 'Architecture', highlight: true },
      { name: 'TLS Certificate Auth', level: 'Production', highlight: true },
      { name: 'URSA DAST Scanning', level: 'Production' },
      { name: 'Microsoft Purview Audit Logging', level: 'Core' },
      { name: 'xUnit Automated Testing', level: 'Core' }
    ]
  }
];

export const AWARDS_DATA: AwardItem[] = [
  {
    id: 'spot-nov-2025',
    title: 'Hi-Five Spot Award',
    subtitle: 'High-Impact AI Use Cases & Innovation',
    organization: 'LTM · Microsoft Business Unit (MSBU)',
    date: 'Nov 2025',
    category: 'AI Innovation & Agentic Systems',
    reason: 'Recognized for consistently exceeding expectations by demonstrating exceptional innovation in formulating high-impact AI use cases and driving collaborative engineering excellence.',
    impactHighlight: 'High-Impact AI Innovation',
    documentUrl: 'https://drive.google.com/file/d/18K2sELoqpOP2vz0gN2iA98Z_g0hWm1qD/view?usp=drive_link',
    accentColor: 'emerald'
  },
  {
    id: 'spot-aug-2025',
    title: 'Super Crew Spot Award',
    subtitle: 'Enterprise Generative AI & Automation',
    organization: 'LTM · Microsoft Business Unit (MSBU)',
    date: 'Aug 2025',
    category: 'Enterprise GenAI & Automation Systems',
    reason: 'Awarded along with the engineering squad for outstanding efforts in architecting and deploying compliant, enterprise-grade Generative AI and Automation systems modernizing internal operations.',
    impactHighlight: 'Enterprise GenAI Modernization',
    documentUrl: 'https://drive.google.com/file/d/1vt7842TyYoa6MsA7CXNONp2AQxTDPuyT/view?usp=drive_link',
    accentColor: 'purple'
  },
  {
    id: 'spot-jul-2025',
    title: 'Hi-Five Spot Award',
    subtitle: 'Systems Migration & Developer Tooling',
    organization: 'LTM · Microsoft Business Unit (MSBU)',
    date: 'Jul 2025',
    category: 'Velocity & Productivity Tooling',
    reason: 'Commended for leading critical platform migrations and independently engineering custom automation utilities that eliminated repetitive friction and significantly accelerated team productivity.',
    impactHighlight: 'Automation & Migration Velocity',
    documentUrl: 'https://drive.google.com/file/d/1lLLw5HtWZtIoV_LdTjDxVahClUSr6iLq/view?usp=drive_link',
    accentColor: 'cyan'
  }
];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    degree: 'Bachelor of Engineering in Computer Engineering',
    institution: "Vidyavardhini's College of Engineering and Technology (University of Mumbai)",
    duration: 'Feb 2021 – May 2023',
    grade: '9.00 CGPA',
    documentUrl: 'https://drive.google.com/file/d/13Ar1FiG4B4QjiCjCQi0kefs5FlJq7o77/view'
  },
  {
    degree: 'Diploma in Computer Engineering',
    institution: "Vidyavardhini's Bhausaheb Vartak Polytechnic (MSBTE)",
    duration: 'Aug 2017 – Nov 2020',
    grade: '94.00%',
    documentUrl: 'https://drive.google.com/file/d/1cwvFmlKVv0WVhkpgj0W2K37e0_sl4H8q/view'
  },
  {
    degree: 'Secondary School Certificate (SSC)',
    institution: 'Holy Paradise High School (MSBSHSE)',
    duration: 'Jun 2016 – May 2017',
    grade: '80.60%',
    documentUrl: 'https://drive.google.com/file/d/1A6t9XAIur-sXbHWvXvRx1l8eb17VYs_l/view'
  }
];

export const CERTIFICATION_ITEMS: CertificationItem[] = [
  {
    name: 'Microsoft Certified: Azure AI Fundamentals (AI-900)',
    issuer: 'Microsoft',
    url: 'https://learn.microsoft.com/api/credentials/share/en-in/altajvirani/C0872E8742B2D90?sharingId=48999C5125E08B64'
  },
  {
    name: 'Azure AI Studio (AI Foundry)',
    issuer: 'Udemy',
    url: 'https://ude.my/UC-e65a23d5-0f7f-4f02-816e-aaf2e53c4401'
  },
  {
    name: 'Azure Functions Masterclass',
    issuer: 'Udemy',
    url: 'https://ude.my/UC-ed09d39d-725e-474e-8f85-4b0a3b33615c/'
  }
];
