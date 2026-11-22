import { neon } from "@neondatabase/serverless";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { computeMyersDiff, type DiffResult } from "./diffEngine.ts";
import { generate1LineDiffSummary, formatMarkdown } from "./resumeValidator.ts";
import applicationData from "../../src/data/applicationDataStore.json" with { type: "json" };

export type DocumentType = "resume" | "portfolio";

export interface DocumentVersion {
  id: number | string;
  documentType: DocumentType;
  version: number;
  isActive: boolean;
  title: string;
  contentText: string;
  rawFileBytesBase64?: string | null;
  rawFileName?: string | null;
  mimeType?: string | null;
  checksum: string;
  aiSummary: string;
  createdAt: string;
  createdBy: string;
}

export interface VersionSummaryItem {
  version: number;
  isActive: boolean;
  title: string;
  rawFileName?: string | null;
  mimeType?: string | null;
  checksum: string;
  aiSummary: string;
  createdAt: string;
  createdBy: string;
}

let schemaPromise: Promise<void> | undefined;
let cacheInvalidator: (() => void) | undefined;

export function registerGroundingCacheInvalidator(fn: () => void) {
  cacheInvalidator = fn;
}

function usesRemoteStore() {
  return (process.env.VERCEL === "1" || process.env.NODE_ENV === "production") && Boolean(process.env.DATABASE_URL);
}

function getSql() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not configured.");
  return neon(connectionString);
}

function computeChecksum(content: string | Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

async function ensureSchema() {
  if (!usesRemoteStore()) return;
  if (!schemaPromise) {
    const sql = getSql();
    schemaPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS document_versions (
          id BIGSERIAL PRIMARY KEY,
          document_type TEXT NOT NULL,
          version INTEGER NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT false,
          title TEXT NOT NULL,
          content_text TEXT NOT NULL,
          raw_file_bytes BYTEA,
          raw_file_name TEXT,
          mime_type TEXT,
          checksum TEXT NOT NULL,
          ai_summary TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_by TEXT NOT NULL DEFAULT 'admin',
          CONSTRAINT uq_doc_version UNIQUE (document_type, version)
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_doc_active ON document_versions (document_type, is_active) WHERE is_active = true
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS document_audit_log (
          id BIGSERIAL PRIMARY KEY,
          document_type TEXT NOT NULL,
          action TEXT NOT NULL,
          from_version INTEGER,
          to_version INTEGER,
          performed_by TEXT NOT NULL,
          ai_summary TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
    })().catch((err) => {
      schemaPromise = undefined;
      throw err;
    });
  }
  await schemaPromise;
}

// Local store helpers for development / fallback
const localStoreDir = path.join(process.cwd(), ".local", "versions");

async function readLocalVersions(docType: DocumentType): Promise<DocumentVersion[]> {
  try {
    const filePath = path.join(localStoreDir, `${docType}.json`);
    const data = await readFile(filePath, "utf-8");
    return JSON.parse(data) as DocumentVersion[];
  } catch {
    return [];
  }
}

async function writeLocalVersions(docType: DocumentType, versions: DocumentVersion[]) {
  await mkdir(localStoreDir, { recursive: true });
  const filePath = path.join(localStoreDir, `${docType}.json`);
  await writeFile(filePath, JSON.stringify(versions, null, 2), "utf-8");
}

/**
 * Seeds initial v1 snapshot if database has no versions yet.
 */
export async function seedInitialVersionsIfEmpty(): Promise<void> {
  const resumeVersions = await listVersions("resume");
  if (resumeVersions.length === 0) {
    try {
      const resumeMdPath = path.resolve(process.cwd(), "public/assets/altaj-virani-resume.md");
      const resumePdfPath = path.resolve(process.cwd(), "public/assets/altaj-virani-resume.pdf");

      let markdown = "";
      if (fs.existsSync(resumeMdPath)) {
        markdown = fs.readFileSync(resumeMdPath, "utf-8");
      }

      let pdfBuffer: Buffer | undefined;
      if (fs.existsSync(resumePdfPath)) {
        pdfBuffer = fs.readFileSync(resumePdfPath);
      }

      if (markdown) {
        await createVersion("resume", {
          title: "Initial Production Resume",
          contentText: markdown,
          rawFileBuffer: pdfBuffer,
          rawFileName: "altaj-virani-resume.pdf",
          mimeType: "application/pdf",
          actorEmail: "system",
          aiSummary: "Base verified engineering resume (v1)",
        });
      }
    } catch (err) {
      console.warn("Could not seed initial resume version:", err);
    }
  }

  const portfolioVersions = await listVersions("portfolio");
  if (portfolioVersions.length === 0) {
    try {
      const jsonText = JSON.stringify(applicationData, null, 2);
      await createVersion("portfolio", {
        title: "Initial Application Datastore",
        contentText: jsonText,
        mimeType: "application/json",
        actorEmail: "system",
        aiSummary: "Base portfolio datastore snapshot (v1)",
      });
    } catch (err) {
      console.warn("Could not seed initial portfolio version:", err);
    }
  }
}

/**
 * Lists all historical versions of a document type.
 */
export async function listVersions(docType: DocumentType): Promise<VersionSummaryItem[]> {
  if (usesRemoteStore()) {
    try {
      await ensureSchema();
      const sql = getSql();
      const rows = await sql`
        SELECT version, is_active, title, raw_file_name, mime_type, checksum, ai_summary, created_at, created_by
        FROM document_versions
        WHERE document_type = ${docType}
        ORDER BY version DESC
      `;
      return rows.map((r: any) => ({
        version: Number(r.version),
        isActive: Boolean(r.is_active),
        title: r.title,
        rawFileName: r.raw_file_name,
        mimeType: r.mime_type,
        checksum: r.checksum,
        aiSummary: r.ai_summary || `Version ${r.version}`,
        createdAt: new Date(r.created_at).toISOString(),
        createdBy: r.created_by,
      }));
    } catch (err) {
      console.warn("Remote store query failed, falling back to local:", err);
    }
  }

  const locals = await readLocalVersions(docType);
  return locals
    .sort((a, b) => b.version - a.version)
    .map((v) => ({
      version: v.version,
      isActive: v.isActive,
      title: v.title,
      rawFileName: v.rawFileName,
      mimeType: v.mimeType,
      checksum: v.checksum,
      aiSummary: v.aiSummary,
      createdAt: v.createdAt,
      createdBy: v.createdBy,
    }));
}

/**
 * Retrieves the currently active version's canonical content.
 */
export async function getActiveDocument(docType: DocumentType): Promise<DocumentVersion | null> {
  if (usesRemoteStore()) {
    try {
      await ensureSchema();
      const sql = getSql();
      const rows = await sql`
        SELECT id, document_type, version, is_active, title, content_text, raw_file_name, mime_type, checksum, ai_summary, created_at, created_by
        FROM document_versions
        WHERE document_type = ${docType} AND is_active = true
        LIMIT 1
      `;
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          documentType: r.document_type as DocumentType,
          version: Number(r.version),
          isActive: true,
          title: r.title,
          contentText: r.content_text,
          rawFileName: r.raw_file_name,
          mimeType: r.mime_type,
          checksum: r.checksum,
          aiSummary: r.ai_summary,
          createdAt: new Date(r.created_at).toISOString(),
          createdBy: r.created_by,
        };
      }
    } catch (err) {
      console.warn("Remote active doc query failed, falling back to local:", err);
    }
  }

  const locals = await readLocalVersions(docType);
  const active = locals.find((v) => v.isActive);
  return active || [...locals].sort((a, b) => b.version - a.version)[0] || null;
}

/**
 * Retrieves a specific version by its version number.
 */
export async function getVersion(docType: DocumentType, versionNum: number): Promise<DocumentVersion | null> {
  if (usesRemoteStore()) {
    try {
      await ensureSchema();
      const sql = getSql();
      const rows = await sql`
        SELECT id, document_type, version, is_active, title, content_text, raw_file_name, mime_type, checksum, ai_summary, created_at, created_by,
               encode(raw_file_bytes, 'base64') AS raw_base64
        FROM document_versions
        WHERE document_type = ${docType} AND version = ${versionNum}
        LIMIT 1
      `;
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          documentType: r.document_type as DocumentType,
          version: Number(r.version),
          isActive: Boolean(r.is_active),
          title: r.title,
          contentText: r.content_text,
          rawFileBytesBase64: r.raw_base64 || null,
          rawFileName: r.raw_file_name,
          mimeType: r.mime_type,
          checksum: r.checksum,
          aiSummary: r.ai_summary,
          createdAt: new Date(r.created_at).toISOString(),
          createdBy: r.created_by,
        };
      }
    } catch (err) {
      console.warn("Remote getVersion query failed, falling back to local:", err);
    }
  }

  const locals = await readLocalVersions(docType);
  return locals.find((v) => v.version === versionNum) || null;
}

/**
 * Creates and activates a new version snapshot.
 */
export async function createVersion(
  docType: DocumentType,
  params: {
    title: string;
    contentText: string;
    rawFileBuffer?: Buffer;
    rawFileName?: string;
    mimeType?: string;
    actorEmail: string;
    aiSummary?: string;
  },
): Promise<DocumentVersion> {
  // Automatically apply canonical formatting (Prettier for Markdown, JSON formatting for datastore)
  if (docType === "resume" || params.mimeType === "text/markdown") {
    params.contentText = await formatMarkdown(params.contentText);
  } else if (docType === "portfolio" || params.mimeType === "application/json") {
    try {
      params.contentText = JSON.stringify(JSON.parse(params.contentText), null, 2);
    } catch {
      // Keep original text if unparseable
    }
  }

  const currentActive = await getActiveDocument(docType);
  const newChecksum = computeChecksum(params.contentText);

  if (currentActive && currentActive.checksum === newChecksum) {
    throw new Error("This exact file/content is already active. Upload a modified revision.");
  }

  let summary = params.aiSummary;
  if (!summary && currentActive) {
    summary = await generate1LineDiffSummary(currentActive.contentText, params.contentText, docType);
  } else if (!summary) {
    summary = `Initial ${docType} version`;
  }

  const allVersions = await listVersions(docType);
  const maxVersion = allVersions.length > 0 ? Math.max(...allVersions.map((v) => v.version)) : 0;
  const nextVersion = maxVersion + 1;

  if (usesRemoteStore()) {
    await ensureSchema();
    const sql = getSql();

    // Deactivate previous active version
    await sql`
      UPDATE document_versions
      SET is_active = false
      WHERE document_type = ${docType}
    `;

    // Insert new active version
    const rawBytes = params.rawFileBuffer ? `\\x${params.rawFileBuffer.toString("hex")}` : null;
    const inserted = await sql`
      INSERT INTO document_versions (
        document_type, version, is_active, title, content_text, raw_file_bytes, raw_file_name, mime_type, checksum, ai_summary, created_by
      ) VALUES (
        ${docType}, ${nextVersion}, true, ${params.title}, ${params.contentText}, ${rawBytes}::bytea, ${params.rawFileName || null}, ${params.mimeType || "text/plain"}, ${newChecksum}, ${summary}, ${params.actorEmail}
      )
      RETURNING id, created_at
    `;

    // Audit log
    await sql`
      INSERT INTO document_audit_log (
        document_type, action, from_version, to_version, performed_by, ai_summary
      ) VALUES (
        ${docType}, 'CREATE_VERSION', ${currentActive?.version || null}, ${nextVersion}, ${params.actorEmail}, ${summary}
      )
    `;

    cacheInvalidator?.();

    if (docType === "resume") {
      try {
        const resumeMdPath = path.resolve(process.cwd(), "public/assets/altaj-virani-resume.md");
        fs.writeFileSync(resumeMdPath, params.contentText, "utf-8");
      } catch (e) {
        console.warn("Failed to sync resume markdown to public asset:", e);
      }
    }

    return {
      id: inserted[0].id,
      documentType: docType,
      version: nextVersion,
      isActive: true,
      title: params.title,
      contentText: params.contentText,
      rawFileBytesBase64: params.rawFileBuffer ? params.rawFileBuffer.toString("base64") : null,
      rawFileName: params.rawFileName,
      mimeType: params.mimeType,
      checksum: newChecksum,
      aiSummary: summary,
      createdAt: new Date(inserted[0].created_at).toISOString(),
      createdBy: params.actorEmail,
    };
  }

  // Local storage fallback
  const locals = await readLocalVersions(docType);
  const updatedLocals = locals.map((v) => ({ ...v, isActive: false }));

  const newVersionObj: DocumentVersion = {
    id: `local-${nextVersion}`,
    documentType: docType,
    version: nextVersion,
    isActive: true,
    title: params.title,
    contentText: params.contentText,
    rawFileBytesBase64: params.rawFileBuffer ? params.rawFileBuffer.toString("base64") : null,
    rawFileName: params.rawFileName,
    mimeType: params.mimeType,
    checksum: newChecksum,
    aiSummary: summary,
    createdAt: new Date().toISOString(),
    createdBy: params.actorEmail,
  };

  updatedLocals.push(newVersionObj);
  await writeLocalVersions(docType, updatedLocals);
  await recordAuditLog({
    documentType: docType,
    action: "CREATE_VERSION",
    fromVersion: currentActive?.version ?? null,
    toVersion: nextVersion,
    performedBy: params.actorEmail,
    aiSummary: summary,
  });

  cacheInvalidator?.();

  if (docType === "resume") {
    try {
      const resumeMdPath = path.resolve(process.cwd(), "public/assets/altaj-virani-resume.md");
      fs.writeFileSync(resumeMdPath, params.contentText, "utf-8");
    } catch (e) {
      console.warn("Failed to sync resume markdown to public asset:", e);
    }
  }

  return newVersionObj;
}

/**
 * Bi-directionally switches live active version (rollback or roll-forward).
 */
export async function switchVersion(
  docType: DocumentType,
  targetVersionNum: number,
  actorEmail: string,
): Promise<{ success: boolean; version: number; aiSummary: string }> {
  const currentActive = await getActiveDocument(docType);
  if (currentActive && currentActive.version === targetVersionNum) {
    return { success: true, version: targetVersionNum, aiSummary: "Version is already active." };
  }

  const target = await getVersion(docType, targetVersionNum);
  if (!target) {
    throw new Error(`Version v${targetVersionNum} does not exist.`);
  }

  const aiSummary = currentActive
    ? await generate1LineDiffSummary(currentActive.contentText, target.contentText, docType)
    : `Switched to version ${targetVersionNum}`;

  if (usesRemoteStore()) {
    await ensureSchema();
    const sql = getSql();

    await sql`
      UPDATE document_versions
      SET is_active = (version = ${targetVersionNum})
      WHERE document_type = ${docType}
    `;

    await sql`
      INSERT INTO document_audit_log (
        document_type, action, from_version, to_version, performed_by, ai_summary
      ) VALUES (
        ${docType}, 'SWITCH_VERSION', ${currentActive?.version || null}, ${targetVersionNum}, ${actorEmail}, ${aiSummary}
      )
    `;

    cacheInvalidator?.();

    if (docType === "resume") {
      try {
        const resumeMdPath = path.resolve(process.cwd(), "public/assets/altaj-virani-resume.md");
        fs.writeFileSync(resumeMdPath, target.contentText, "utf-8");
      } catch (e) {
        console.warn("Failed to sync switched resume markdown to public asset:", e);
      }
    }

    return { success: true, version: targetVersionNum, aiSummary };
  }

  const locals = await readLocalVersions(docType);
  const updatedLocals = locals.map((v) => ({
    ...v,
    isActive: v.version === targetVersionNum,
  }));
  await writeLocalVersions(docType, updatedLocals);
  await recordAuditLog({
    documentType: docType,
    action: "SWITCH_ACTIVE",
    fromVersion: currentActive?.version ?? null,
    toVersion: targetVersionNum,
    performedBy: actorEmail,
    aiSummary,
  });

  cacheInvalidator?.();

  if (docType === "resume") {
    try {
      const resumeMdPath = path.resolve(process.cwd(), "public/assets/altaj-virani-resume.md");
      fs.writeFileSync(resumeMdPath, target.contentText, "utf-8");
    } catch (e) {
      console.warn("Failed to sync switched resume markdown to public asset:", e);
    }
  }

  return { success: true, version: targetVersionNum, aiSummary };
}

/**
 * Safely deletes an intermediate version.
 */
export async function deleteVersion(
  docType: DocumentType,
  targetVersionNum: number,
  actorEmail: string,
): Promise<{ success: boolean; deletedVersion: number }> {
  const target = await getVersion(docType, targetVersionNum);
  if (!target) {
    throw new Error(`Version v${targetVersionNum} does not exist.`);
  }

  if (target.isActive) {
    throw new Error("Cannot delete the active live version. Switch to another version first.");
  }

  const allVersions = await listVersions(docType);
  if (allVersions.length <= 1) {
    throw new Error("Cannot delete the only remaining version in the repository.");
  }

  if (usesRemoteStore()) {
    await ensureSchema();
    const sql = getSql();

    await sql`
      DELETE FROM document_versions
      WHERE document_type = ${docType} AND version = ${targetVersionNum}
    `;

    await sql`
      INSERT INTO document_audit_log (
        document_type, action, from_version, to_version, performed_by, ai_summary
      ) VALUES (
        ${docType}, 'DELETE_VERSION', ${targetVersionNum}, null, ${actorEmail}, ${`Deleted version ${targetVersionNum}`}
      )
    `;

    return { success: true, deletedVersion: targetVersionNum };
  }

  const locals = await readLocalVersions(docType);
  const filtered = locals.filter((v) => v.version !== targetVersionNum);
  await writeLocalVersions(docType, filtered);
  await recordAuditLog({
    documentType: docType,
    action: "DELETE_VERSION",
    fromVersion: targetVersionNum,
    toVersion: null,
    performedBy: actorEmail,
    aiSummary: `Deleted version ${targetVersionNum}`,
  });

  return { success: true, deletedVersion: targetVersionNum };
}

/**
 * Computes line-by-line Myers diff and 1-line AI summary between any two versions.
 */
export async function compareVersions(
  docType: DocumentType,
  fromVersionNum: number,
  toVersionNum: number,
): Promise<{
  fromVersion: number;
  toVersion: number;
  fromContent: string;
  toContent: string;
  aiSummary: string;
  diff: DiffResult;
}> {
  const fromDoc = await getVersion(docType, fromVersionNum);
  const toDoc = await getVersion(docType, toVersionNum);

  if (!fromDoc || !toDoc) {
    throw new Error("One or both versions could not be found for comparison.");
  }

  const diff = computeMyersDiff(fromDoc.contentText, toDoc.contentText);
  const aiSummary = await generate1LineDiffSummary(fromDoc.contentText, toDoc.contentText, docType);

  return {
    fromVersion: fromVersionNum,
    toVersion: toVersionNum,
    fromContent: fromDoc.contentText,
    toContent: toDoc.contentText,
    aiSummary,
    diff,
  };
}

export interface AuditLogEntry {
  id?: string | number;
  documentType: string;
  action: string;
  fromVersion?: number | null;
  toVersion?: number | null;
  performedBy: string;
  aiSummary?: string;
  createdAt?: string;
}

/**
 * Persists an operation record to document_audit_log in both Postgres and local fallback.
 */
export async function recordAuditLog(entry: {
  documentType: string;
  action: string;
  fromVersion?: number | null;
  toVersion?: number | null;
  performedBy: string;
  aiSummary?: string;
}): Promise<void> {
  const summary = entry.aiSummary || "";
  if (usesRemoteStore()) {
    try {
      await ensureSchema();
      const sql = getSql();
      await sql`
        INSERT INTO document_audit_log (
          document_type, action, from_version, to_version, performed_by, ai_summary
        ) VALUES (
          ${entry.documentType},
          ${entry.action},
          ${entry.fromVersion ?? null},
          ${entry.toVersion ?? null},
          ${entry.performedBy},
          ${summary}
        )
      `;
    } catch (err) {
      console.warn("Failed to write remote audit log entry:", err);
    }
  }

  try {
    await mkdir(localStoreDir, { recursive: true });
    const auditFile = path.join(localStoreDir, "audit.json");
    let logs: AuditLogEntry[] = [];
    try {
      const existing = await readFile(auditFile, "utf-8");
      logs = JSON.parse(existing) as AuditLogEntry[];
    } catch {}

    logs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      documentType: entry.documentType,
      action: entry.action,
      fromVersion: entry.fromVersion ?? null,
      toVersion: entry.toVersion ?? null,
      performedBy: entry.performedBy,
      aiSummary: summary,
      createdAt: new Date().toISOString(),
    });

    if (logs.length > 500) logs = logs.slice(0, 500);
    await writeFile(auditFile, JSON.stringify(logs, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to write local audit log entry:", err);
  }
}

/**
 * Retrieves the most recent audit log entries.
 */
export async function getAuditLogs(limit = 50): Promise<AuditLogEntry[]> {
  if (usesRemoteStore()) {
    try {
      await ensureSchema();
      const sql = getSql();
      const rows = await sql`
        SELECT id, document_type, action, from_version, to_version, performed_by, ai_summary, created_at
        FROM document_audit_log
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      return rows.map((r) => ({
        id: String(r.id),
        documentType: r.document_type,
        action: r.action,
        fromVersion: r.from_version,
        toVersion: r.to_version,
        performedBy: r.performed_by,
        aiSummary: r.ai_summary,
        createdAt: new Date(r.created_at).toISOString(),
      }));
    } catch (err) {
      console.warn("Failed to read remote audit log, falling back to local:", err);
    }
  }

  try {
    const auditFile = path.join(localStoreDir, "audit.json");
    const data = await readFile(auditFile, "utf-8");
    const parsed = JSON.parse(data) as AuditLogEntry[];
    return parsed.slice(0, limit);
  } catch {
    return [];
  }
}
