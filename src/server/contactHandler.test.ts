import test from "node:test";
import assert from "node:assert/strict";
import {
  validateContactPayload,
  buildMailtoUrl,
  buildGmailComposeUrl,
} from "./contactHandler.ts";

test("validateContactPayload rejects missing or malformed fields", () => {
  assert.equal(validateContactPayload(null).valid, false);
  assert.equal(
    validateContactPayload({ name: "A", email: "test@example.com", message: "Hello there" }).valid,
    false,
  );
  assert.equal(
    validateContactPayload({ name: "Alex", email: "invalid-email", message: "Hello there" }).valid,
    false,
  );
  assert.equal(
    validateContactPayload({ name: "Alex", email: "alex@example.com", message: "Hi" }).valid,
    false,
  );
});

test("validateContactPayload accepts valid submission and populates default subject", () => {
  const res = validateContactPayload({
    name: "  Alex Rivera ",
    email: "alex@example.com",
    subject: "",
    message: "Interested in discussing AI engineering.",
  });
  assert.equal(res.valid, true);
  assert.equal(res.sanitized?.name, "Alex Rivera");
  assert.equal(res.sanitized?.subject, "Portfolio Inquiry from Alex Rivera");
});

test("buildMailtoUrl and buildGmailComposeUrl encode recipient, subject, and body cleanly", () => {
  const data = {
    name: "Alex",
    email: "alex@example.com",
    subject: "Hello & Sync",
    message: "Line 1",
  };
  const mailto = buildMailtoUrl("altajatwork@gmail.com", data);
  const gmail = buildGmailComposeUrl("altajatwork@gmail.com", data);

  assert.ok(mailto.startsWith("mailto:altajatwork@gmail.com?subject=Hello%20%26%20Sync"));
  assert.ok(gmail.includes("to=altajatwork%40gmail.com"));
  assert.ok(gmail.includes("su=Hello%20%26%20Sync"));
});

test("dispatchContactSubmission validates and formats prepared response without log ids", async () => {
  const { dispatchContactSubmission } = await import("./contactHandler.ts");
  const bad = await dispatchContactSubmission({ name: "A", email: "bad", message: "hi" });
  assert.equal(bad.status, 400);
  assert.equal(bad.body.ok, false);

  const ok = await dispatchContactSubmission({
    name: "Alex Rivera",
    email: "alex@example.com",
    subject: "Sync",
    message: "Hello Altaj, would love to connect about AI platforms.",
  });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.ok, true);
  assert.ok(!ok.body.message.toLowerCase().includes("logged"));
  assert.ok(!ok.body.message.includes("msg_"));
  assert.ok(ok.body.message.toLowerCase().includes("prepared"));
});
