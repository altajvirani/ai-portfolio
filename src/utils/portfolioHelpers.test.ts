import test from "node:test";
import assert from "node:assert/strict";
import {
  computeActiveSections,
  filterSkillNodes,
  resolveActiveNodeForFilter,
} from "./portfolioHelpers.ts";

test("computeActiveSections highlights single active section in band", () => {
  const metrics = [
    { id: "hero", top: -600, bottom: -50 },
    { id: "experience", top: -40, bottom: 720 },
    { id: "projects", top: 740, bottom: 1400 },
  ];
  const active = computeActiveSections(metrics, 900, 500, 3200);
  assert.deepEqual(active, ["experience"]);
});

test("computeActiveSections supports multiple overlapping sections in viewport band", () => {
  const metrics = [
    { id: "projects", top: 50, bottom: 300 },
    { id: "skills", top: 320, bottom: 950 },
  ];
  const active = computeActiveSections(metrics, 900, 1400, 3200);
  assert.deepEqual(active, ["projects", "skills"]);
});

test("computeActiveSections highlights last section at bottom of page", () => {
  const metrics = [
    { id: "honors", top: -200, bottom: 400 },
    { id: "contact", top: 420, bottom: 880 },
  ];
  const active = computeActiveSections(metrics, 900, 2260, 3200);
  assert.deepEqual(active, ["contact"]);
});

test("filterSkillNodes filters accurately by domain category", () => {
  const sample = [
    { id: "mcp", category: "agentic", connections: ["kql"] },
    { id: "kql", category: "cloud", connections: ["mcp"] },
    { id: "owasp", category: "security", connections: [] },
  ];

  assert.equal(filterSkillNodes(sample, "all").length, 3);
  assert.deepEqual(
    filterSkillNodes(sample, "cloud").map((n) => n.id),
    ["kql"],
  );
  assert.equal(resolveActiveNodeForFilter(sample, "mcp", "cloud"), "kql");
  assert.equal(resolveActiveNodeForFilter(sample, "mcp", "agentic"), "mcp");
});
