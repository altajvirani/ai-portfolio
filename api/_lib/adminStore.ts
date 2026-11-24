import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import applicationData from "../../src/data/applicationDataStore.json" with { type: "json" };

const SESSION_TTL_SECONDS = 8 * 60 * 60;
const OAUTH_STATE_TTL_SECONDS = 10 * 60;
const MAX_DOCUMENT_BYTES = 1_500_000;
const DOCUMENT_ID = "portfolio";

export type AdminSession = {
  id: string;
  googleSubject: string;
  email: string;
  csrfTokenHash: string;
};

type StoredDocument = {
  document: unknown;
  version: number;
  updatedAt: string;
  updatedBy: string;
};

let schemaPromise: Promise<void> | undefined;
let localStoreWriteQueue = Promise.resolve();

const localStorePath = path.join(process.cwd(), ".local", "admin-data-store.json");
const localSessions = new Map<string, AdminSession & { expiresAt: number }>();
const localOAuthStates = new Map<string, { codeVerifier: string; expiresAt: number }>();

export function usesRemoteStore() {
  return Boolean(process.env.DATABASE_URL);
}

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }
  return neon(connectionString);
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function randomToken() {
  return randomBytes(32).toString("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

async function ensureSchema() {
  if (!usesRemoteStore()) return;
  if (!schemaPromise) {
    const sql = getSql();
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS admin_documents (
          id TEXT PRIMARY KEY,
          document JSONB NOT NULL,
          version INTEGER NOT NULL DEFAULT 1,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_by TEXT NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS admin_sessions (
          token_hash TEXT PRIMARY KEY,
          google_subject TEXT NOT NULL,
          email TEXT NOT NULL,
          csrf_token_hash TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS admin_oauth_states (
          state_hash TEXT PRIMARY KEY,
          code_verifier TEXT NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS admin_audit_log (
          id BIGSERIAL PRIMARY KEY,
          actor_subject TEXT NOT NULL,
          actor_email TEXT NOT NULL,
          action TEXT NOT NULL,
          version INTEGER,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })().catch((error) => {
      schemaPromise = undefined;
      throw error;
    });
  }
  await schemaPromise;
}

async function readLocalDocument(): Promise<StoredDocument> {
  try {
    const stored = JSON.parse(await readFile(localStorePath, "utf8")) as StoredDocument;
    if (!stored || typeof stored !== "object" || typeof stored.version !== "number" || !("document" in stored)) {
      throw new Error("The local admin datastore has an invalid format.");
    }
    return stored;
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error && error.code === "ENOENT")) throw error;
    const seeded: StoredDocument = {
      document: applicationData,
      version: 1,
      updatedAt: new Date().toISOString(),
      updatedBy: "initial-seed",
    };
    await writeLocalDocument(seeded);
    return seeded;
  }
}

async function writeLocalDocument(stored: StoredDocument) {
  await mkdir(path.dirname(localStorePath), { recursive: true });
  const temporaryPath = `${localStorePath}.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(stored, null, 2)}\n`, "utf8");
  await rename(temporaryPath, localStorePath);
}

async function withLocalWrite<T>(operation: () => Promise<T>) {
  const result = localStoreWriteQueue.then(operation);
  localStoreWriteQueue = result.then(() => undefined, () => undefined);
  return result;
}

export async function createOAuthState() {
  if (!usesRemoteStore()) {
    const state = randomToken();
    const codeVerifier = randomToken();
    localOAuthStates.set(hash(state), {
      codeVerifier,
      expiresAt: Date.now() + OAUTH_STATE_TTL_SECONDS * 1000,
    });
    return { state, codeVerifier };
  }
  await ensureSchema();
  const sql = getSql();
  const state = randomToken();
  const codeVerifier = randomToken();
  await sql`
    INSERT INTO admin_oauth_states (state_hash, code_verifier, expires_at)
    VALUES (${hash(state)}, ${codeVerifier}, NOW() + ${OAUTH_STATE_TTL_SECONDS} * INTERVAL '1 second')
  `;
  return { state, codeVerifier };
}

export async function consumeOAuthState(state: string) {
  if (!usesRemoteStore()) {
    const key = hash(state);
    const stored = localOAuthStates.get(key);
    localOAuthStates.delete(key);
    return stored && stored.expiresAt > Date.now() ? stored.codeVerifier : undefined;
  }
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    DELETE FROM admin_oauth_states
    WHERE state_hash = ${hash(state)} AND expires_at > NOW()
    RETURNING code_verifier
  `;
  return rows[0]?.code_verifier as string | undefined;
}

export async function createSession(googleSubject: string, email: string) {
  if (!usesRemoteStore()) {
    const token = randomToken();
    const csrfToken = randomToken();
    localSessions.set(hash(token), {
      id: hash(token),
      googleSubject,
      email,
      csrfTokenHash: hash(csrfToken),
      expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
    });
    return { token, csrfToken };
  }
  await ensureSchema();
  const sql = getSql();
  const token = randomToken();
  const csrfToken = randomToken();
  await sql`
    INSERT INTO admin_sessions (
      token_hash,
      google_subject,
      email,
      csrf_token_hash,
      expires_at
    )
    VALUES (
      ${hash(token)},
      ${googleSubject},
      ${email},
      ${hash(csrfToken)},
      NOW() + ${SESSION_TTL_SECONDS} * INTERVAL '1 second'
    )
  `;
  return { token, csrfToken };
}

export async function getSession(token: string): Promise<AdminSession | undefined> {
  if (!usesRemoteStore()) {
    const key = hash(token);
    const session = localSessions.get(key);
    if (!session || session.expiresAt <= Date.now()) {
      localSessions.delete(key);
      return undefined;
    }
    return session;
  }
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    SELECT
      token_hash AS id,
      google_subject AS "googleSubject",
      email,
      csrf_token_hash AS "csrfTokenHash"
    FROM admin_sessions
    WHERE token_hash = ${hash(token)} AND expires_at > NOW()
  `;
  return rows[0] as AdminSession | undefined;
}

export async function deleteSession(token: string) {
  if (!usesRemoteStore()) {
    localSessions.delete(hash(token));
    return;
  }
  await ensureSchema();
  const sql = getSql();
  await sql`DELETE FROM admin_sessions WHERE token_hash = ${hash(token)}`;
}

export async function getDocument(): Promise<StoredDocument> {
  if (!usesRemoteStore()) return readLocalDocument();
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    INSERT INTO admin_documents (id, document, updated_by)
    VALUES (${DOCUMENT_ID}, ${JSON.stringify(applicationData)}::jsonb, 'initial-seed')
    ON CONFLICT (id) DO UPDATE SET id = EXCLUDED.id
    RETURNING document, version, updated_at AS "updatedAt", updated_by AS "updatedBy"
  `;
  return rows[0] as StoredDocument;
}

export async function updateDocument(
  document: unknown,
  expectedVersion: number,
  actor: AdminSession,
) {
  if (!usesRemoteStore()) {
    return withLocalWrite(async () => {
      const current = await readLocalDocument();
      if (current.version !== expectedVersion) return undefined;
      const updated: StoredDocument = {
        document,
        version: current.version + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: actor.email,
      };
      await writeLocalDocument(updated);
      return updated;
    });
  }
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    UPDATE admin_documents
    SET
      document = ${JSON.stringify(document)}::jsonb,
      version = version + 1,
      updated_at = NOW(),
      updated_by = ${actor.email}
    WHERE id = ${DOCUMENT_ID} AND version = ${expectedVersion}
    RETURNING document, version, updated_at AS "updatedAt", updated_by AS "updatedBy"
  `;
  const result = rows[0] as StoredDocument | undefined;
  if (!result) {
    return undefined;
  }
  await sql`
    INSERT INTO admin_audit_log (actor_subject, actor_email, action, version)
    VALUES (${actor.googleSubject}, ${actor.email}, 'update-document', ${result.version})
  `;
  return result;
}

export function verifyCsrf(session: AdminSession, csrfToken: string | undefined) {
  return Boolean(csrfToken && safeEqual(session.csrfTokenHash, hash(csrfToken)));
}

export function validateDocument(document: unknown) {
  const serialized = JSON.stringify(document);
  if (!serialized || Buffer.byteLength(serialized, "utf8") > MAX_DOCUMENT_BYTES) {
    return "The datastore is missing or exceeds the size limit.";
  }
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    return "The datastore root must be a JSON object.";
  }

  const forbiddenKeys = new Set(["__proto__", "prototype", "constructor"]);
  const visit = (value: unknown, depth: number): string | undefined => {
    if (depth > 20) return "The datastore is too deeply nested.";
    if (!value || typeof value !== "object") return undefined;
    for (const [key, child] of Object.entries(value)) {
      if (forbiddenKeys.has(key)) return "The datastore contains a forbidden property.";
      const error = visit(child, depth + 1);
      if (error) return error;
    }
    return undefined;
  };
  return visit(document, 0);
}
