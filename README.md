# Altaj Virani Portfolio

Personal portfolio for Altaj Virani, focused on Azure AI engineering, agentic systems, cloud reliability, and selected projects. The site includes a public portfolio, a protected datastore editor, and an authenticated MCP server for AI-assisted datastore maintenance.

## Current data boundary

The public portfolio is intentionally **not driven by the admin datastore yet**.

- Public sections import static TypeScript data from [`src/data/portfolioData.ts`](./src/data/portfolioData.ts), [`src/data/skillsData.tsx`](./src/data/skillsData.tsx), and related components.
- The resume link, UI asset paths, and some presentation references remain in the public components.
- The admin datastore is an independent editable copy. Changes made through `/admin` or MCP do not change the public portfolio until an explicit future interpolation task is requested.
- The chatbot uses its separate knowledge source in [`src/server/knowledgeStore.ts`](./src/server/knowledgeStore.ts).

## Stack

- React 19 and TypeScript
- Vite 8
- Express local server
- Tailwind CSS 4
- Neon/Vercel Postgres for production persistence
- Google OAuth 2.0 with PKCE for administrator access
- Model Context Protocol (MCP) stdio server for AI-assisted editing

## Requirements

- Node.js 18 or newer
- npm
- A Google OAuth client for admin authentication
- Neon/Vercel Postgres only when running in production mode

## Install and run locally

```bash
npm install
npm run dev
```

The local site runs at `http://localhost:3000`.

The first authenticated datastore read creates:

```text
.local/admin-data-store.json
```

The local datastore is ignored by Git and is separate from the committed seed at [`src/data/applicationDataStore.json`](./src/data/applicationDataStore.json).

## Environment

Copy the example variables into `.env.local` and provide real values locally. Do not commit `.env.local` or any other `.env` file.

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
ADMIN_GOOGLE_EMAILS
APP_URL
DATABASE_URL
MCP_GOOGLE_REDIRECT_URI
GEMINI_API_KEY
GEMINI_MODEL
CHAT_LIMIT_PER_MINUTE
CHAT_LIMIT_PER_DAY
```

## Gemini AI Twin Setup

Create a Gemini API key in Google AI Studio (https://aistudio.google.com/app/apikey), then add it to `.env.local`:

```text
GEMINI_API_KEY="your-server-side-api-key"
GEMINI_MODEL="gemini-3.5-flash-lite"
```

Do not commit the API key or paste it into frontend code. The AI Twin uses in-context Markdown grounding from `src/data/resumeMarkdown.ts` with multi-turn session memory and automatic compaction.

Start or restart the application:

```bash
npm run dev
```

Verify the configuration at:

```text
http://localhost:3000/api/health
```

The response should report `hasGeminiKey: true`.

For Vercel, add `GEMINI_API_KEY` and `GEMINI_MODEL` to your Project Settings under **Environment Variables**. Never add the Gemini API key to `VITE_*` variables or frontend JavaScript.

The application callback should be registered as:

```text
http://localhost:3000/api/auth/google/callback
```

The MCP callback is separate and must be registered in the same Google OAuth client:

```text
http://127.0.0.1:8787/mcp/oauth/callback
```

`ADMIN_GOOGLE_EMAILS` is a comma-separated allowlist. Google authentication succeeds only when the verified Google account is present in that allowlist.

## Admin datastore

Open `/admin` after starting the application.

The admin editor:

- Requires Google SSO and an allowlisted account.
- Edits the datastore as JSON only.
- Validates the JSON root, size, depth, and forbidden object keys.
- Uses optimistic versioning to prevent overwriting a newer edit.
- Records production updates in the audit log.
- Uses local JSON persistence during development.
- Uses Neon/Vercel Postgres when `NODE_ENV=production` or `VERCEL=1`.

The committed datastore seed contains profile, social, project, award, education, certification, and asset-reference data. It also contains existing chatbot/knowledge content required by the current seed format; this is not consumed by public portfolio rendering.

## MCP server

The MCP server exposes the same protected datastore operations without using the admin UI:

```bash
npm run mcp
```

Configure an MCP client with the equivalent of:

```json
{
  "mcpServers": {
    "ai-portfolio": {
      "command": "npm",
      "args": ["run", "mcp"],
      "cwd": "/absolute/path/to/ai-portfolio"
    }
  }
}
```

Available tools:

- `authenticate_portfolio` — returns a Google authorization URL.
- `get_portfolio_datastore` — fetches the currently saved datastore, version, and update metadata.
- `update_portfolio_datastore` — replaces the saved datastore using the current version.
- `logout_portfolio` — ends the MCP session.

### MCP authentication flow

1. Start the MCP server through the MCP client.
2. Call `authenticate_portfolio`.
3. Open the returned authorization URL in a browser.
4. Complete Google sign-in with an account in `ADMIN_GOOGLE_EMAILS`.
5. The local callback at `127.0.0.1:8787` establishes the MCP session.
6. Call `get_portfolio_datastore` before editing, then submit the returned `version` with `update_portfolio_datastore`.

The MCP server does not read or expose environment values through tools. It reuses the same Google client credentials, allowlist, session store, document validation, persistence layer, and optimistic version checks as the admin API.

This is a stdio MCP server, so the MCP client must be able to launch the command on the machine where the project and its environment are configured. It is not currently a publicly hosted remote MCP endpoint.

## Production and Vercel

Build the client:

```bash
npm run build
```

Run the production server locally:

```bash
NODE_ENV=production npm start
```

Vercel uses the project configuration in [`vercel.json`](./vercel.json). Set the required environment variables in Vercel, including `DATABASE_URL`, OAuth values, `ADMIN_GOOGLE_EMAILS`, and `APP_URL`. Do not place production secrets in the repository.

The production datastore is initialized from [`src/data/applicationDataStore.json`](./src/data/applicationDataStore.json) when the database record does not yet exist. Existing saved production content is not automatically overwritten by later seed edits.

## Useful commands

```bash
npm run dev       # Local development server
npm run build     # Production client build
npm run start     # Production-mode Express server
npm run mcp       # Authenticated stdio MCP server
npm run lint      # TypeScript validation
```

## Project layout

```text
api/                    Vercel API handlers
public/assets/          Canonical public assets
src/components/         React UI components
src/data/               Static public data and datastore seed
src/server/adminAuth.ts Google OAuth and protected admin request handling
src/server/adminStore.ts Local/Neon datastore and session persistence
src/server/mcpServer.ts Authenticated stdio MCP server
src/server/knowledgeStore.ts Chatbot knowledge source
server.ts               Local Express/Vite server
```

## Validation

Before submitting changes, run:

```bash
npm run lint
npm run build
git diff --check
```

Never commit `.env` files, OAuth secrets, database URLs, session tokens, or the local `.local/` datastore.
