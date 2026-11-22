import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

type ChatRole = "user" | "model";
export type ChatHistoryMessage = { role: ChatRole; text: string };

export type ChatMemory = {
  summary: string;
  recentMessages: ChatHistoryMessage[];
};

const localMemory = new Map<string, ChatMemory>();
let schemaPromise: Promise<void> | undefined;

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  return neon(connectionString);
}

function usesRemoteStore() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

async function ensureSchema() {
  if (!usesRemoteStore()) return;
  if (!schemaPromise) {
    const sql = getSql();
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS chat_conversations (
          id TEXT PRIMARY KEY,
          summary TEXT NOT NULL DEFAULT '',
          recent_messages JSONB NOT NULL DEFAULT '[]'::jsonb,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })().catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  await schemaPromise;
}

export function normalizeConversationId(value: unknown) {
  if (typeof value !== "string") return randomUUID();
  const trimmed = value.trim();
  if (!trimmed) return randomUUID();
  return /^[a-zA-Z0-9_-]{8,128}$/.test(trimmed) ? trimmed : randomUUID();
}

export async function getChatMemory(conversationId: string): Promise<ChatMemory> {
  if (!usesRemoteStore()) {
    return localMemory.get(conversationId) || { summary: "", recentMessages: [] };
  }
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT summary, recent_messages AS "recentMessages"
    FROM chat_conversations
    WHERE id = ${conversationId}
  `;
  const row = rows[0] as ChatMemory | undefined;
  return row ? {
    summary: typeof row.summary === "string" ? row.summary : "",
    recentMessages: Array.isArray(row.recentMessages)
      ? row.recentMessages
        .filter((message): message is ChatHistoryMessage =>
          Boolean(message)
          && typeof message === "object"
          && "role" in message
          && "text" in message
          && (message.role === "user" || message.role === "model")
          && typeof message.text === "string")
      : [],
  } : { summary: "", recentMessages: [] };
}

export async function saveChatMemory(conversationId: string, memory: ChatMemory) {
  const bounded = {
    summary: memory.summary.slice(0, 4000),
    recentMessages: memory.recentMessages.slice(-6).slice(-6),
  };
  if (!usesRemoteStore()) {
    localMemory.set(conversationId, bounded);
    return;
  }
  await ensureSchema();
  const sql = getSql();
  await sql`
    INSERT INTO chat_conversations (id, summary, recent_messages)
    VALUES (${conversationId}, ${bounded.summary}, ${JSON.stringify(bounded.recentMessages)}::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      summary = EXCLUDED.summary,
      recent_messages = EXCLUDED.recent_messages,
      updated_at = NOW()
  `;
}
