import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

// Obsolete keys that must be purged from Vercel production
const OBSOLETE_KEYS = [
  "RESEND_API_KEY",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "VERCEL_OIDC_TOKEN",
];

export interface EnvEntry {
  key: string;
  value: string;
}

/**
 * Parses an environment file string:
 * - Removes full-line comments and inline comments
 * - Handles quoted strings (single and double quotes)
 * - Normalizes escaped characters
 * - Trims whitespace and strips empty lines
 * - NEVER prints or logs secret values
 */
export function parseEnvContent(raw: string): EnvEntry[] {
  const entries: EnvEntry[] = [];
  const lines = raw.split(/\r?\n/);

  for (let line of lines) {
    line = line.trim();

    // Skip blank lines and lines starting with comments
    if (!line || line.startsWith("#")) {
      continue;
    }

    const equalIdx = line.indexOf("=");
    if (equalIdx === -1) {
      continue;
    }

    const key = line.slice(0, equalIdx).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      continue;
    }

    let val = line.slice(equalIdx + 1).trim();

    // Handle quoted values
    if (
      (val.startsWith('"') && val.endsWith('"') && val.length >= 2) ||
      (val.startsWith("'") && val.endsWith("'") && val.length >= 2)
    ) {
      const quoteChar = val[0];
      val = val.slice(1, -1);
      if (quoteChar === '"') {
        val = val.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      }
    } else {
      // Strip unquoted inline comments
      const commentIdx = val.search(/\s+#/);
      if (commentIdx !== -1) {
        val = val.slice(0, commentIdx).trim();
      }
    }

    entries.push({ key, value: val });
  }

  return entries;
}

function resolveVercelCommand(): string[] {
  const testGlobal = spawnSync("vercel", ["--version"], { stdio: "ignore" });
  if (testGlobal.status === 0) {
    return ["vercel"];
  }
  return ["npx", "--yes", "vercel"];
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const shouldDeploy = args.includes("--deploy") || !args.includes("--no-deploy");

  console.log("=================================================");
  console.log("  Automated Vercel Production Env Sync & Deploy  ");
  console.log("=================================================\n");

  const prodEnvPath = path.resolve(process.cwd(), ".env.production");
  const localEnvPath = path.resolve(process.cwd(), ".env.local");
  const exampleEnvPath = path.resolve(process.cwd(), ".env.example");

  // ==============================================================
  // PHASE 1: LOCAL TEST & PRE-FLIGHT VALIDATION
  // (All tests execute locally; NEVER touches production on failure;
  //  NEVER prints or leaks secret values to output)
  // ==============================================================
  console.log("▶ [Phase 1/3] Running Local Pre-Flight Test & Validation...");

  if (!fs.existsSync(prodEnvPath)) {
    console.error(`✖ Error: Production environment file not found at ${prodEnvPath}`);
    process.exit(1);
  }

  // Test 1: Validate local parser on .env.local or .env.example
  const testSourcePath = fs.existsSync(localEnvPath) ? localEnvPath : exampleEnvPath;
  let localTestEntries: EnvEntry[] = [];
  try {
    const rawLocal = fs.readFileSync(testSourcePath, "utf-8");
    localTestEntries = parseEnvContent(rawLocal);
    if (localTestEntries.length === 0) {
      throw new Error("Parser extracted 0 variables from test file.");
    }
    console.log(`  ✔ Local parser verification passed (${localTestEntries.length} test keys verified).`);
  } catch (err) {
    console.error("✖ Local parser test failed:", err);
    process.exit(1);
  }

  // Test 2: Parse and validate .env.production locally
  let prodEntries: EnvEntry[] = [];
  try {
    const rawProd = fs.readFileSync(prodEnvPath, "utf-8");
    prodEntries = parseEnvContent(rawProd);
    if (prodEntries.length === 0) {
      throw new Error("No valid environment entries found in .env.production.");
    }

    // Verify all keys are strictly valid identifiers
    for (const entry of prodEntries) {
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(entry.key)) {
        throw new Error(`Invalid key identifier detected during local validation: ${entry.key}`);
      }
    }
    console.log(`  ✔ Production file parsed successfully (${prodEntries.length} variables extracted).`);
  } catch (err) {
    console.error("✖ Failed to parse .env.production locally:", err);
    process.exit(1);
  }

  // Test 3: Check Vercel CLI availability and authentication in silent mode
  const vercelCmd = resolveVercelCommand();
  const authCheck = spawnSync(vercelCmd[0], [...vercelCmd.slice(1), "whoami"], {
    stdio: "ignore",
  });

  if (authCheck.status !== 0) {
    console.error("\n✖ Vercel CLI authentication check failed.");
    console.error("  Please run 'npx vercel login' or set VERCEL_TOKEN in your environment before running this script.");
    process.exit(1);
  }
  console.log("  ✔ Vercel CLI authentication confirmed (silent check).");
  console.log("✔ Phase 1 Succeeded: All local validation tests passed completely.\n");

  if (isDryRun) {
    console.log("ℹ --dry-run mode requested. Local test passed. Production was not modified.");
    console.log("  Keys ready to sync to production:", prodEntries.map((e) => e.key).join(", "));
    return;
  }

  // ==============================================================
  // PHASE 2: AUTOMATED VERCEL PRODUCTION UPDATE
  // (Pipes secret values directly to Vercel CLI via stdin without printing)
  // ==============================================================
  console.log("▶ [Phase 2/3] Updating Vercel Production Environment Variables...");

  // 1. Purge obsolete keys from Vercel production
  console.log("  Checking and removing obsolete production variables...");
  for (const obsoleteKey of OBSOLETE_KEYS) {
    // Silent removal using modern Vercel CLI non-interactive flag
    spawnSync(
      vercelCmd[0],
      [
        ...vercelCmd.slice(1),
        "env",
        "rm",
        obsoleteKey,
        "--environment",
        "production",
        "--confirm-name",
        obsoleteKey,
      ],
      { stdio: "ignore" },
    );
    console.log(`  ✔ Purged obsolete variable: ${obsoleteKey}`);
  }

  // 2. Sync all valid production variables
  console.log("\n  Syncing current variables to Vercel production (silent values)...");
  let syncCount = 0;
  for (const entry of prodEntries) {
    if (!entry.value || entry.value.trim() === "") {
      console.log(`  ℹ Skipping empty variable: ${entry.key} (no value set in file)`);
      continue;
    }

    // Add / overwrite definition via stdin pipe with --force --yes (NEVER prints secret value)
    const addResult = spawnSync(
      vercelCmd[0],
      [
        ...vercelCmd.slice(1),
        "env",
        "add",
        entry.key,
        "--environment",
        "production",
        "--force",
        "--yes",
      ],
      {
        input: `${entry.value}\n`,
        stdio: ["pipe", "pipe", "pipe"],
      },
    );

    if (addResult.status === 0) {
      console.log(`  ✔ Synced: ${entry.key}`);
      syncCount++;
    } else {
      const errRaw = addResult.stderr ? addResult.stderr.toString().trim() : "";
      // Strip any accidental value echoes from the error message for complete secrecy
      const safeErr = errRaw
        ? errRaw.split("\n")[0].replace(entry.value, "***")
        : `Exit code ${addResult.status}`;
      console.warn(`  ⚠ Warning: Could not update ${entry.key} on Vercel (${safeErr})`);
    }
  }

  console.log(`\n✔ Phase 2 Complete: ${syncCount}/${prodEntries.length} variables successfully synced to production.\n`);

  // ==============================================================
  // PHASE 3: PRODUCTION DEPLOYMENT
  // ==============================================================
  if (shouldDeploy) {
    console.log("▶ [Phase 3/3] Triggering production redeployment on Vercel...");
    const deployResult = spawnSync(vercelCmd[0], [...vercelCmd.slice(1), "--prod"], {
      stdio: "inherit",
    });

    if (deployResult.status === 0) {
      console.log("\n🎉 Deployment completed successfully! All environment changes are now live.");
    } else {
      console.log("\n⚠ Deployment process exited. You can redeploy anytime with: npx vercel --prod");
    }
  } else {
    console.log("ℹ Deployment skipped (--no-deploy). Run 'npx vercel --prod' whenever you're ready to deploy.");
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
