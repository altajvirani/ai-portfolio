# Altaj Virani — AI Systems Engineering Portfolio & Unified Intelligence Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Production%20Live-black?style=flat&logo=vercel)](https://altajvirani.vercel.app)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Neon Postgres](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=flat&logo=postgresql)](https://neon.tech)
[![Gemini 2.5](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?style=flat&logo=google)](https://deepmind.google/technologies/gemini)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Standard%20%26%20HTTP-7C3AED?style=flat)](https://modelcontextprotocol.io)
[![Cloudflare Turnstile](https://img.shields.io/badge/Cloudflare-Turnstile%20Defense-F38020?style=flat&logo=cloudflare)](https://www.cloudflare.com)

A high-performance personal portfolio, interactive systems engineering playground, and intelligent datastore platform for **Altaj Virani** (Azure AI Engineer). Built with a tactile, skeuomorphic papercraft aesthetic, the platform features an anti-hallucination Grounded AI Twin, a Git/PR-style version control engine with persistent working drafts in Neon PostgreSQL, a Myers LCS diff analyzer with 1-line AI executive summaries, and dual-transport Model Context Protocol (MCP) servers.

---

## Architecture & Workflow Overview

![Platform Architecture & Workflow](./public/assets/platform-architecture-workflow.png)

```mermaid
flowchart TD
    subgraph UI ["Public Portfolio Client"]
        Client["Interactive Papercraft UI<br/>• 3D Particle Hero Canvas<br/>• Web Audio Synthesizer<br/>• Decoupled Static Presentation"]
    end

    subgraph Security ["Edge Defense & Access Control"]
        Turnstile["Cloudflare Turnstile Bot Defense"]
        OAuth["Google OAuth 2.0 (PKCE)<br/>• CSRF Token Guard<br/>• 2-Account Whitelist"]
    end

    subgraph Entrypoints ["Application Entrypoints"]
        Twin["Grounded AI Twin (/api/chat)<br/>• Gemini 2.5 Flash LLM<br/>• Strict Anti-Hallucination"]
        Admin["Admin Studio (/api/admin/*)<br/>• Monaco VS Code Deck<br/>• Synchronized GFM Markdown Preview"]
        MCP["Dual-Transport MCP (/api/mcp & Stdio)<br/>• 13+ Granular Management Tools"]
    end

    subgraph Engine ["Agent Grounding & Version Engine"]
        Ingestion["Multi-Tier Document Ingestion<br/>(FlowCV PDF/DOCX → AST → Canonical GFM)"]
        Diff["Myers LCS Line Diff Analyzer<br/>& 1-Line AI Executive Summaries"]
        Branching["Git / PR-Style Versioning<br/>(Base Version Lineage & Working Drafts)"]
    end

    subgraph Database ["Neon Serverless PostgreSQL"]
        Versions[("document_versions<br/>(Immutable Snapshots)")]
        Drafts[("document_drafts<br/>(Working Drafts Layer)")]
        Audit[("document_audit_log<br/>(Cryptographic Audit Trail)")]
    end

    Client --> Turnstile
    Turnstile --> Twin
    OAuth --> Admin
    OAuth --> MCP
    Twin --> Ingestion
    Admin --> Branching
    Admin --> Diff
    MCP --> Branching
    Branching --> Versions
    Branching --> Drafts
    Admin --> Audit
    MCP --> Audit
    Versions -.->|"Active Ground Truth"| Twin
```

---

## Core System Capabilities

### 1. Tactile Skeuomorphic Frontend & Audio Engine
* **Papercraft & Airmail Visual Identity**: Tactile paper textures (`paper-grain`), precision cobalt grid overlays, airmail borders, skeuomorphic stamp buttons, and smooth micro-interactions powered by Motion (Framer Motion).
* **Interactive 3D Hero Canvas**: Custom Three.js particle sphere and reactive audio-visual canvas responding to mouse movements and user interactions.
* **Web Audio Synthesis**: Built-in sound synthesis engine generating bespoke tactile clicks, mechanical typewriter taps, retro hums, and UI feedback without external audio assets.
* **Responsive Architecture**: Multi-device support across mobile (<640px), tablet (640px–1024px), and desktop (>1024px) viewports with uniform 2×2 touch grids and isolated Monaco code editor canvases.

### 2. Grounded AI Twin Assistant
* **Strict Anti-Hallucination Grounding**: Operates without speculative extrapolation—strictly constrained to verified engineering records and canonical resume documents.
* **Gemini 2.5 Flash Engine**: Streaming completions with structured citation markers and fallback resilience.
* **Context Preservation**: Multi-turn conversation memory with automatic context compaction and deterministic session boundaries.

### 3. Agent Grounding Engine
* **3-Tier Document Ingestion**:
  1. *Binary & MIME Validation*: Validates file size, integrity, and headers.
  2. *Deterministic AST Extraction*: Parses PDFs and DOCX files verbatim, capturing all 19 verified hyperlinks, project references, and metrics.
  3. *Gemini Multimodal Verification*: LLM static check ensuring zero-hallucination parity between uploaded artifacts and generated Markdown.
* **Myers LCS Line Diff Engine**: Fast diff computation providing side-by-side split and unified inline diff views.
* **1-Line AI Executive Summaries**: Generates high-level summaries of changes between historical snapshots.

### 4. Git / PR-Style Versioning & Draft Engine
* **Parent Lineage (`base_version`)**: Every version records its parent snapshot, enabling branching off any historical version (`v1`, `v2`, etc.).
* **Persistent Neon PostgreSQL Draft Layer**: In-progress edits are persisted in the `document_drafts` table by admin email, decoupled from published snapshots.
* **Staged Lifecycle**:
  - `Save Draft`: Persists working copy to database without publishing.
  - `Discard Draft`: Rolls back working copy to the base version.
  - `Commit (PR)`: Creates an immutable snapshot in `document_versions` (`is_active: false` by default).
  - `Publish Live`: Promotes a revision snapshot to live active ground truth.
* **Bi-Directional Checkouts**: Instant rollback and fast-forward switches between historical versions.

### 5. Two-Account Security Guard & Audit Trail
* **Strict Whitelist**: Administrative writes are restricted exclusively to authorized emails configured in the `ADMIN_GOOGLE_EMAILS` environment variable.
* **Google OAuth 2.0 PKCE**: Sealed behind Google SSO with cryptographic CSRF cookies (`admin_csrf`) and domain restrictions.
* **Audit Trail**: Every mutation is logged in `document_audit_log` with timestamp, actor email, IP address, and JSONB payload details.

### 6. Dual-Transport Model Context Protocol (MCP)
Supports both local stdio and remote HTTP JSON-RPC transports:
* **Stdio Server**: `tsx api/_lib/mcpServer.ts`
* **HTTP Endpoint**: `/api/mcp` (remote SSE/POST JSON-RPC 2.0)
* **Registered Tools**:
  - `get_active_document`
  - `get_draft`
  - `save_draft`
  - `discard_draft`
  - `commit_revision`
  - `publish_revision`
  - `list_versions`
  - `get_version`
  - `diff_versions`
  - `rollback_version`
  - `inspect_audit_logs`
  - `search_document_history`
  - `get_grounding_document`

### 7. Cloudflare Turnstile Bot Defense
* Integrated Cloudflare Turnstile verification guards contact forms and public endpoints against automated scrapers and bot traffic.

---

## Data Boundary Policy

> [!NOTE]
> **Decoupled Architecture**: The public-facing portfolio components (`HeroSection`, `Experience`, `ProjectsResearch`, etc.) import static TypeScript data from [`src/data/portfolioData.ts`](./src/data/portfolioData.ts) and [`src/data/skillsData.tsx`](./src/data/skillsData.tsx).
> 
> The admin datastore and versioning engine operate independently. Changes made in the admin command center or via MCP update the database and AI Twin grounding documents, but do not directly interpolate into the live portfolio presentation until explicitly instructed.

---

## Repository Structure

```text
ai-portfolio/
├── api/                          # Vercel Serverless Functions
│   ├── _lib/                     # Core Backend Engine
│   │   ├── adminAuth.ts          # OAuth 2.0, CSRF & 2-Account Mutation Guard
│   │   ├── db.ts                 # Neon PostgreSQL Connection Pool
│   │   ├── diffEngine.ts         # Myers LCS Side-by-Side & Unified Diff Engine
│   │   ├── mcpHttpHandler.ts     # HTTP JSON-RPC MCP Server Handler
│   │   ├── mcpServer.ts          # Stdio Model Context Protocol Server
│   │   ├── resumeValidator.ts    # 3-Tier Document Validation & AI Summaries
│   │   ├── turnstile.ts          # Cloudflare Turnstile Verification Helper
│   │   └── versionEngine.ts      # Git/PR Branching & Working Drafts Engine
│   ├── admin/                    # Admin REST Endpoints (Versions, Drafts, Audit)
│   ├── auth/                     # Google OAuth Login, Callback & Logout
│   ├── chat/                     # Grounded Gemini AI Twin Streaming API
│   ├── contact/                  # Contact Submission with Turnstile Verification
│   └── mcp/                      # HTTP MCP Endpoint
├── public/                       # Static Assets & Documents
│   ├── assets/                   # Architecture Diagrams, Icons & FlowCV Documents
│   └── favicon.svg               # Vector Branding
├── src/                          # React 19 Frontend
│   ├── components/               # UI Components
│   │   ├── AdminPage.tsx         # Unified Command Center & Monaco Studio
│   │   ├── Experience.tsx        # Career Journey & Timeline
│   │   ├── HeroSection.tsx       # 3D Interactive Hero Canvas
│   │   ├── ProjectsResearch.tsx  # Interactive Research & Project Carousels
│   │   ├── TactileUI.tsx         # Skeuomorphic Spinners, Skeletons & Modals
│   │   └── TurnstileWidget.tsx   # Cloudflare Turnstile Verification Widget
│   ├── data/                     # Application Datastore Seed & Portfolio Data
│   └── index.css                 # Tailwind CSS 4 & Tactile Papercraft Styles
├── server.ts                     # Local Express & Vite Development Server
└── vercel.json                   # Vercel Production Route & Build Configuration
```

---

## Local Development & Setup

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **PostgreSQL / Neon Account**: For database persistence

### 1. Installation
```bash
git clone https://github.com/altajvirani/ai-portfolio.git
cd ai-portfolio
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root directory (never commit this file):

```ini
# Google OAuth 2.0 (Admin Authentication)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
MCP_GOOGLE_REDIRECT_URI="http://127.0.0.1:8787/mcp/oauth/callback"
ADMIN_GOOGLE_EMAILS="admin@example.com,developer@example.com"

# Application URL
APP_URL="http://localhost:3000"

# Contact Recipient Email
CONTACT_RECIPIENT_EMAIL="contact@example.com"

# Neon Serverless PostgreSQL Database
DATABASE_URL="postgres://user:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Google Gemini API (AI Twin Grounding)
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-2.5-flash"

# Cloudflare Turnstile (Bot Defense)
CLOUDFLARE_TURNSTILE_SITE_KEY="your-turnstile-site-key"
CLOUDFLARE_TURNSTILE_SECRET_KEY="your-turnstile-secret-key"

# Rate Limiting & Safety Caps
CHAT_LIMIT_PER_MINUTE="20"
CHAT_LIMIT_PER_DAY="150"
CHAT_GLOBAL_DAILY_LIMIT="250"
```

### 3. Run Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### 4. Run Model Context Protocol (MCP) Server
To run the authenticated stdio MCP server for Claude Desktop, Antigravity, or other MCP clients:
```bash
npm run mcp
```

Configure your MCP client (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "altaj-ai-portfolio": {
      "command": "npx",
      "args": ["tsx", "api/_lib/mcpServer.ts"],
      "cwd": "/path/to/ai-portfolio"
    }
  }
}
```

---

## Production Deployment & Verification

### Build Verification
Before deploying, ensure all TypeScript checks, linting, and bundling pass cleanly:
```bash
# TypeScript verification
npm run lint

# Production bundle
npm run build
```

### Deploying to Vercel
```bash
# Production deployment
npx vercel --prod
```

Configure environment variables in the Vercel Dashboard under **Project Settings > Environment Variables**:
* `DATABASE_URL`
* `GOOGLE_CLIENT_ID`
* `GOOGLE_CLIENT_SECRET`
* `GOOGLE_REDIRECT_URI` (`https://altajvirani.vercel.app/api/auth/google/callback`)
* `ADMIN_GOOGLE_EMAILS`
* `GEMINI_API_KEY`
* `GEMINI_MODEL`
* `CLOUDFLARE_TURNSTILE_SITE_KEY`
* `CLOUDFLARE_TURNSTILE_SECRET_KEY`

---

## License & Security Policy

* **Security**: Administrative mutations are strictly guarded by Google OAuth 2.0 PKCE and allowlist checks. Do not commit `.env` files, production tokens, or credentials.
* **License**: Private & Proprietary © 2026 Altaj Virani. All Rights Reserved.
