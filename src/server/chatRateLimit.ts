import { neon } from "@neondatabase/serverless";

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

const minuteWindows = new Map<string, { count: number; resetAt: number }>();
const dayWindows = new Map<string, { count: number; resetAt: number }>();

const CHAT_LIMIT_PER_MINUTE = Number(process.env.CHAT_LIMIT_PER_MINUTE || 8);
const CHAT_LIMIT_PER_DAY = Number(process.env.CHAT_LIMIT_PER_DAY || 40);
const CHAT_WINDOW_MS = 60 * 1000;
const CHAT_DAY_MS = 24 * 60 * 60 * 1000;
let schemaPromise: Promise<void> | undefined;

function usesRemoteStore() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  return neon(connectionString);
}

async function ensureSchema() {
  if (!usesRemoteStore()) return;
  if (!schemaPromise) {
    const sql = getSql();
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS chat_rate_limits (
          key_hash TEXT NOT NULL,
          window_name TEXT NOT NULL,
          count INTEGER NOT NULL,
          reset_at TIMESTAMPTZ NOT NULL,
          PRIMARY KEY (key_hash, window_name)
        )
      `;
    })().catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  await schemaPromise;
}

function secondsUntil(resetAt: number) {
  return Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
}

export async function checkChatRateLimit(key: string): Promise<RateLimitResult> {
  const now = Date.now();
  if (usesRemoteStore()) {
    await ensureSchema();
    const sql = getSql();
    const minuteReset = new Date(now + CHAT_WINDOW_MS);
    const dayReset = new Date(now + CHAT_DAY_MS);
    const minuteRows = await sql`
      INSERT INTO chat_rate_limits (key_hash, window_name, count, reset_at)
      VALUES (${key}, 'minute', 1, ${minuteReset})
      ON CONFLICT (key_hash, window_name) DO UPDATE SET
        count = CASE
          WHEN chat_rate_limits.reset_at <= NOW() THEN 1
          ELSE chat_rate_limits.count + 1
        END,
        reset_at = CASE
          WHEN chat_rate_limits.reset_at <= NOW() THEN ${minuteReset}
          ELSE chat_rate_limits.reset_at
        END
      RETURNING count, reset_at AS "resetAt"
    `;
    const dayRows = await sql`
      INSERT INTO chat_rate_limits (key_hash, window_name, count, reset_at)
      VALUES (${key}, 'day', 1, ${dayReset})
      ON CONFLICT (key_hash, window_name) DO UPDATE SET
        count = CASE
          WHEN chat_rate_limits.reset_at <= NOW() THEN 1
          ELSE chat_rate_limits.count + 1
        END,
        reset_at = CASE
          WHEN chat_rate_limits.reset_at <= NOW() THEN ${dayReset}
          ELSE chat_rate_limits.reset_at
        END
      RETURNING count, reset_at AS "resetAt"
    `;
    const minuteCount = Number(minuteRows[0]?.count || 0);
    const dayCount = Number(dayRows[0]?.count || 0);
    const minuteResetAt = new Date(minuteRows[0]?.resetAt || minuteReset).getTime();
    const dayResetAt = new Date(dayRows[0]?.resetAt || dayReset).getTime();
    if (minuteCount > CHAT_LIMIT_PER_MINUTE) {
      return { allowed: false, retryAfterSeconds: secondsUntil(minuteResetAt) };
    }
    if (dayCount > CHAT_LIMIT_PER_DAY) {
      return { allowed: false, retryAfterSeconds: secondsUntil(dayResetAt) };
    }
    return { allowed: true, retryAfterSeconds: 1 };
  }

  const minute = minuteWindows.get(key);
  if (!minute || minute.resetAt <= now) {
    minuteWindows.set(key, { count: 1, resetAt: now + CHAT_WINDOW_MS });
  } else {
    minute.count += 1;
  }

  const day = dayWindows.get(key);
  if (!day || day.resetAt <= now) {
    dayWindows.set(key, { count: 1, resetAt: now + CHAT_DAY_MS });
  } else {
    day.count += 1;
  }

  const activeMinute = minuteWindows.get(key);
  const activeDay = dayWindows.get(key);
  if (!activeMinute || !activeDay) {
    return { allowed: true, retryAfterSeconds: 1 };
  }
  if (activeMinute.count > CHAT_LIMIT_PER_MINUTE) {
    return {
      allowed: false,
      retryAfterSeconds: secondsUntil(activeMinute.resetAt),
    };
  }
  if (activeDay.count > CHAT_LIMIT_PER_DAY) {
    return {
      allowed: false,
      retryAfterSeconds: secondsUntil(activeDay.resetAt),
    };
  }

  if (minuteWindows.size > 10000) {
    for (const [windowKey, window] of minuteWindows) {
      if (window.resetAt <= now) minuteWindows.delete(windowKey);
    }
  }
  if (dayWindows.size > 10000) {
    for (const [windowKey, window] of dayWindows) {
      if (window.resetAt <= now) dayWindows.delete(windowKey);
    }
  }

  return { allowed: true, retryAfterSeconds: 1 };
}
