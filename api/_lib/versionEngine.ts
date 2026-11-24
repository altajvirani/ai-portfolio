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
  baseVersion?: number | null;
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
  baseVersion?: number | null;
  isActive: boolean;
  title: string;
  rawFileName?: string | null;
  mimeType?: string | null;
  checksum: string;
  aiSummary: string;
  createdAt: string;
  createdBy: string;
}

export interface DocumentDraft {
  id: number | string;
  documentType: DocumentType;
  baseVersion: number;
  title?: string;
  contentText: string;
  aiSummary?: string;
  authorEmail: string;
  updatedAt: string;
  createdAt: string;
}

let schemaPromise: Promise<void> | undefined;
let cacheInvalidator: (() => void) | undefined;

export function registerGroundingCacheInvalidator(fn: () => void) {
  cacheInvalidator = fn;
}

function usesRemoteStore() {
  return Boolean(process.env.DATABASE_URL);
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
          base_version INTEGER DEFAULT NULL,
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
        ALTER TABLE document_versions ADD COLUMN IF NOT EXISTS base_version INTEGER DEFAULT NULL
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_doc_active ON document_versions (document_type, is_active) WHERE is_active = true
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS document_drafts (
          id BIGSERIAL PRIMARY KEY,
          document_type TEXT NOT NULL,
          base_version INTEGER NOT NULL,
          title TEXT,
          content_text TEXT NOT NULL,
          ai_summary TEXT,
          author_email TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          CONSTRAINT uq_doc_draft UNIQUE (document_type, author_email)
        )
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
          details JSONB DEFAULT '{}',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        ALTER TABLE document_audit_log ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '{}'
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
        SELECT version, base_version, is_active, title, raw_file_name, mime_type, checksum, ai_summary, created_at, created_by
        FROM document_versions
        WHERE document_type = ${docType}
        ORDER BY version DESC
      `;
      return rows.map((r: any) => ({
        version: Number(r.version),
        baseVersion: r.base_version !== null && r.base_version !== undefined ? Number(r.base_version) : null,
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
      baseVersion: v.baseVersion ?? null,
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
        SELECT id, document_type, version, base_version, is_active, title, content_text, raw_file_name, mime_type, checksum, ai_summary, created_at, created_by
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
          baseVersion: r.base_version !== null && r.base_version !== undefined ? Number(r.base_version) : null,
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
        SELECT id, document_type, version, base_version, is_active, title, content_text, raw_file_name, mime_type, checksum, ai_summary, created_at, created_by,
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
          baseVersion: r.base_version !== null && r.base_version !== undefined ? Number(r.base_version) : null,
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
 * Creates a new version snapshot.
 * If publishImmediately is true, it marks this version active and deactivates prior versions.
 * If publishImmediately is false (or undefined), it creates an unselected revision snapshot (like a PR).
 */
export async function createVersion(
  docType: DocumentType,
  params: {
    title: string;
    contentText: string;
    baseVersion?: number | null;
    publishImmediately?: boolean;
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
  const publish = Boolean(params.publishImmediately);

  if (currentActive && currentActive.checksum === newChecksum && publish) {
    throw new Error("This exact file/content is already active. Upload a modified revision.");
  }

  let summary = params.aiSummary;
  if (!summary && params.baseVersion) {
    const baseDoc = await getVersion(docType, params.baseVersion);
    if (baseDoc) {
      summary = await generate1LineDiffSummary(baseDoc.contentText, params.contentText, docType);
    }
  }
  if (!summary && currentActive) {
    summary = await generate1LineDiffSummary(currentActive.contentText, params.contentText, docType);
  } else if (!summary) {
    summary = `Revision derived from v${params.baseVersion || currentActive?.version || 1}`;
  }

  const allVersions = await listVersions(docType);
  const maxVersion = allVersions.length > 0 ? Math.max(...allVersions.map((v) => v.version)) : 0;
  const nextVersion = maxVersion + 1;

  if (usesRemoteStore()) {
    await ensureSchema();
    const sql = getSql();

    if (publish) {
      await sql`
        UPDATE document_versions
        SET is_active = false
        WHERE document_type = ${docType}
      `;
    }

    const rawBytes = params.rawFileBuffer ? `\\x${params.rawFileBuffer.toString("hex")}` : null;
    const inserted = await sql`
      INSERT INTO document_versions (
        document_type, version, base_version, is_active, title, content_text, raw_file_bytes, raw_file_name, mime_type, checksum, ai_summary, created_by
      ) VALUES (
        ${docType}, ${nextVersion}, ${params.baseVersion || null}, ${publish}, ${params.title}, ${params.contentText}, ${rawBytes}::bytea, ${params.rawFileName || null}, ${params.mimeType || "text/plain"}, ${newChecksum}, ${summary}, ${params.actorEmail}
      )
      RETURNING id, created_at
    `;

    await recordAuditLog({
      documentType: docType,
      action: publish ? "CREATE_AND_PUBLISH_VERSION" : "COMMIT_REVISION",
      fromVersion: params.baseVersion || currentActive?.version || null,
      toVersion: nextVersion,
      performedBy: params.actorEmail,
      aiSummary: summary,
      details: { baseVersion: params.baseVersion, published: publish },
    });

    if (publish) {
      cacheInvalidator?.();
      if (docType === "resume") {
        try {
          const resumeMdPath = path.resolve(process.cwd(), "public/assets/altaj-virani-resume.md");
          fs.writeFileSync(resumeMdPath, params.contentText, "utf-8");
        } catch (e) {
          console.warn("Failed to sync resume markdown to public asset:", e);
        }
      }
    }

    return {
      id: inserted[0].id,
      documentType: docType,
      version: nextVersion,
      baseVersion: params.baseVersion || null,
      isActive: publish,
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
  const updatedLocals = locals.map((v) => (publish ? { ...v, isActive: false } : v));

  const newVersionObj: DocumentVersion = {
    id: `local-${nextVersion}`,
    documentType: docType,
    version: nextVersion,
    baseVersion: params.baseVersion || null,
    isActive: publish,
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
    action: publish ? "CREATE_AND_PUBLISH_VERSION" : "COMMIT_REVISION",
    fromVersion: params.baseVersion || currentActive?.version || null,
    toVersion: nextVersion,
    performedBy: params.actorEmail,
    aiSummary: summary,
    details: { baseVersion: params.baseVersion, published: publish },
  });

  if (publish) {
    cacheInvalidator?.();
    if (docType === "resume") {
      try {
        const resumeMdPath = path.resolve(process.cwd(), "public/assets/altaj-virani-resume.md");
        fs.writeFileSync(resumeMdPath, params.contentText, "utf-8");
      } catch (e) {
        console.warn("Failed to sync resume markdown to public asset:", e);
      }
    }
  }

  return newVersionObj;
}

/**
 * Explicitly publishes and activates an existing version as the live ground truth.
 */
export async function publishVersion(
  docType: DocumentType,
  targetVersionNum: number,
  actorEmail: string,
): Promise<{ success: boolean; version: number; aiSummary: string }> {
  return switchVersion(docType, targetVersionNum, actorEmail);
}

/**
 * Retrieves the working draft for a given document type and author.
 */
export async function getDraft(
  docType: DocumentType,
  authorEmail: string,
): Promise<DocumentDraft | null> {
  const email = authorEmail.toLowerCase().trim();
  if (usesRemoteStore()) {
    try {
      await ensureSchema();
      const sql = getSql();
      const rows = await sql`
        SELECT id, document_type, base_version, title, content_text, ai_summary, author_email, updated_at, created_at
        FROM document_drafts
        WHERE document_type = ${docType} AND author_email = ${email}
        LIMIT 1
      `;
      if (rows.length > 0) {
        const r = rows[0];
        return {
          id: r.id,
          documentType: r.document_type as DocumentType,
          baseVersion: Number(r.base_version),
          title: r.title || undefined,
          contentText: r.content_text,
          aiSummary: r.ai_summary || undefined,
          authorEmail: r.author_email,
          updatedAt: new Date(r.updated_at).toISOString(),
          createdAt: new Date(r.created_at).toISOString(),
        };
      }
      return null;
    } catch (err) {
      console.warn("Failed to read remote draft, falling back to local:", err);
    }
  }

  const emailKey = email.replace(/[^a-zA-Z0-9]/g, "_");
  const draftFile = path.join(localStoreDir, `${docType}-draft-${emailKey}.json`);
  if (fs.existsSync(draftFile)) {
    try {
      return JSON.parse(fs.readFileSync(draftFile, "utf-8")) as DocumentDraft;
    } catch {}
  }
  return null;
}

/**
 * Saves or updates a working draft on top of a specific base version.
 */
export async function saveDraft(
  docType: DocumentType,
  params: {
    baseVersion: number;
    contentText: string;
    title?: string;
    authorEmail: string;
    aiSummary?: string;
  },
): Promise<DocumentDraft> {
  let formatted = params.contentText;
  if (docType === "resume") {
    formatted = await formatMarkdown(params.contentText);
  } else if (docType === "portfolio") {
    try {
      formatted = JSON.stringify(JSON.parse(params.contentText), null, 2);
    } catch {
      // Keep text if invalid
    }
  }

  let summary = params.aiSummary;
  if (!summary) {
    const baseDoc = await getVersion(docType, params.baseVersion);
    if (baseDoc) {
      summary = await generate1LineDiffSummary(baseDoc.contentText, formatted, docType);
    }
  }

  const email = params.authorEmail.toLowerCase().trim();
  const now = new Date().toISOString();

  if (usesRemoteStore()) {
    await ensureSchema();
    const sql = getSql();
    const inserted = await sql`
      INSERT INTO document_drafts (
        document_type, base_version, title, content_text, ai_summary, author_email, updated_at, created_at
      ) VALUES (
        ${docType}, ${params.baseVersion}, ${params.title || null}, ${formatted}, ${summary || null}, ${email}, NOW(), NOW()
      )
      ON CONFLICT (document_type, author_email)
      DO UPDATE SET
        base_version = EXCLUDED.base_version,
        title = EXCLUDED.title,
        content_text = EXCLUDED.content_text,
        ai_summary = EXCLUDED.ai_summary,
        updated_at = NOW()
      RETURNING id, updated_at, created_at
    `;

    await recordAuditLog({
      documentType: docType,
      action: "SAVE_DRAFT",
      fromVersion: params.baseVersion,
      toVersion: null,
      performedBy: email,
      aiSummary: summary || `Working draft on v${params.baseVersion}`,
      details: { baseVersion: params.baseVersion, title: params.title },
    });

    return {
      id: inserted[0].id,
      documentType: docType,
      baseVersion: params.baseVersion,
      title: params.title,
      contentText: formatted,
      aiSummary: summary,
      authorEmail: email,
      updatedAt: new Date(inserted[0].updated_at).toISOString(),
      createdAt: new Date(inserted[0].created_at).toISOString(),
    };
  }

  const emailKey = email.replace(/[^a-zA-Z0-9]/g, "_");
  const draftFile = path.join(localStoreDir, `${docType}-draft-${emailKey}.json`);
  const draftObj: DocumentDraft = {
    id: `local-draft-${Date.now()}`,
    documentType: docType,
    baseVersion: params.baseVersion,
    title: params.title,
    contentText: formatted,
    aiSummary: summary,
    authorEmail: email,
    updatedAt: now,
    createdAt: now,
  };
  await mkdir(localStoreDir, { recursive: true });
  await writeFile(draftFile, JSON.stringify(draftObj, null, 2), "utf-8");
  return draftObj;
}

/**
 * Discards the working draft, reverting back to the base version state.
 */
export async function discardDraft(
  docType: DocumentType,
  authorEmail: string,
): Promise<{ success: boolean; message: string }> {
  const email = authorEmail.toLowerCase().trim();
  if (usesRemoteStore()) {
    await ensureSchema();
    const sql = getSql();
    await sql`
      DELETE FROM document_drafts
      WHERE document_type = ${docType} AND author_email = ${email}
    `;
    await recordAuditLog({
      documentType: docType,
      action: "DISCARD_DRAFT",
      performedBy: email,
      aiSummary: "Discarded working draft",
    });
    return { success: true, message: "Draft discarded successfully." };
  }

  const emailKey = email.replace(/[^a-zA-Z0-9]/g, "_");
  const draftFile = path.join(localStoreDir, `${docType}-draft-${emailKey}.json`);
  if (fs.existsSync(draftFile)) {
    try {
      fs.unlinkSync(draftFile);
    } catch {}
  }
  return { success: true, message: "Draft discarded successfully." };
}

/**
 * Commits a working draft into an immutable revision snapshot.
 */
export async function commitDraft(
  docType: DocumentType,
  params: {
    authorEmail: string;
    title?: string;
    summary?: string;
    publishImmediately?: boolean;
  },
): Promise<DocumentVersion> {
  const draft = await getDraft(docType, params.authorEmail);
  if (!draft) {
    throw new Error(`No active working draft found to commit for ${params.authorEmail}.`);
  }

  const commitTitle = params.title || draft.title || `Revision derived from v${draft.baseVersion}`;
  const commitSummary = params.summary || draft.aiSummary;

  const version = await createVersion(docType, {
    title: commitTitle,
    contentText: draft.contentText,
    baseVersion: draft.baseVersion,
    publishImmediately: params.publishImmediately ?? false,
    actorEmail: params.authorEmail,
    aiSummary: commitSummary,
    mimeType: docType === "resume" ? "text/markdown" : "application/json",
  });

  // Clear draft after commit
  await discardDraft(docType, params.authorEmail);

  return version;
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
  details?: Record<string, unknown> | null;
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
  details?: Record<string, unknown> | null;
}): Promise<void> {
  const summary = entry.aiSummary || "";
  if (usesRemoteStore()) {
    try {
      await ensureSchema();
      const sql = getSql();
      await sql`
        INSERT INTO document_audit_log (
          document_type, action, from_version, to_version, performed_by, ai_summary, details
        ) VALUES (
          ${entry.documentType},
          ${entry.action},
          ${entry.fromVersion ?? null},
          ${entry.toVersion ?? null},
          ${entry.performedBy},
          ${summary},
          ${JSON.stringify(entry.details || {})}::jsonb
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
        SELECT id, document_type, action, from_version, to_version, performed_by, ai_summary, details, created_at
        FROM document_audit_log
        ORDER BY created_at DESC
        LIMIT ${limit}
      `;
      return rows.map((r: any) => ({
        id: String(r.id),
        documentType: r.document_type,
        action: r.action,
        fromVersion: r.from_version,
        toVersion: r.to_version,
        performedBy: r.performed_by,
        aiSummary: r.ai_summary,
        details: r.details || null,
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
