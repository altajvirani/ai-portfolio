import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dispatchContactSubmission } from './src/server/contactHandler.ts';
import { handleAdminRequest } from './src/server/adminAuth.ts';
import { handleChatRequest } from './src/server/chatApi.ts';

dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  const isDev = process.env.NODE_ENV !== 'production';

  app.use(express.json());

  const adminRoute = async (req: express.Request, res: express.Response) => {
    try {
      const protocol = typeof req.headers['x-forwarded-proto'] === 'string'
        ? req.headers['x-forwarded-proto']
        : 'http';
      const host = req.get('host') || `localhost:${port}`;
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (typeof value === 'string') headers.set(key, value);
        if (Array.isArray(value)) headers.set(key, value.join(', '));
      });
      const body = req.method === 'GET' || req.method === 'HEAD'
        ? undefined
        : JSON.stringify(req.body ?? {});
      const result = await handleAdminRequest(
        new Request(`${protocol}://${host}${req.originalUrl}`, {
          method: req.method,
          headers,
          body,
        }),
      );
      res.status(result.status);
      const setCookies = result.headers.getSetCookie?.() || [];
      result.headers.forEach((value, key) => {
        if (key !== 'set-cookie') res.setHeader(key, value);
      });
      if (setCookies.length > 0) res.setHeader('Set-Cookie', setCookies);
      res.send(await result.text());
    } catch (error) {
      console.error('Error handling admin endpoint:', error);
      res.status(503).json({ error: 'Admin service unavailable.' });
    }
  };

  app.get('/api/auth/google/start', adminRoute);
  app.get('/api/auth/google/callback', adminRoute);
  app.get('/api/auth/session', adminRoute);
  app.post('/api/auth/logout', adminRoute);
  app.get('/api/admin/data', adminRoute);
  app.put('/api/admin/data', adminRoute);

  // Grounded LLM Chatbot API Endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const protocol = typeof req.headers['x-forwarded-proto'] === 'string'
        ? req.headers['x-forwarded-proto']
        : 'http';
      const host = req.get('host') || `localhost:${port}`;
      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, value]) => {
        if (typeof value === 'string') headers.set(key, value);
        if (Array.isArray(value)) headers.set(key, value.join(', '));
      });
      const result = await handleChatRequest(
        new Request(`${protocol}://${host}${req.originalUrl}`, {
          method: req.method,
          headers,
          body: JSON.stringify(req.body ?? {}),
        }),
      );
      res.status(result.status);
      result.headers.forEach((value, key) => res.setHeader(key, value));
      res.send(await result.text());
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
      console.error('Error handling /api/chat:', err);
      res.status(500).json({ error: errorMessage });
    }
  });

  // Contact Inquiry & Email Dispatch Endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const origin = typeof req.headers.origin === 'string' ? req.headers.origin : undefined;
      const result = await dispatchContactSubmission(req.body, origin);
      res.status(result.status).json(result.body);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
      console.error('Error handling /api/contact:', err);
      res.status(500).json({ ok: false, error: errorMessage });
    }
  });

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
      hasGeminiFileSearchStore: !!process.env.GEMINI_FILE_SEARCH_STORE_NAME,
      geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
      time: new Date().toISOString()
    });
  });

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static assets from dist
    app.use(express.static(path.join(__dirname, 'dist')));
    // Fallback to index.html for SPA routing
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port} (${isDev ? 'development' : 'production'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
