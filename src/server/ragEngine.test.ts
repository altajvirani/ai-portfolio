import test from 'node:test';
import assert from 'node:assert/strict';
import { searchKnowledge, processRAGQuery } from './ragEngine.ts';
import { KNOWLEDGE_STORE } from './knowledgeStore.ts';

test('Knowledge store contains all critical resume sections', () => {
  assert.ok(KNOWLEDGE_STORE.length >= 10, 'Knowledge store should have at least 10 detailed chunks');
  const ids = KNOWLEDGE_STORE.map((c) => c.id);
  assert.ok(ids.includes('agentic_ai_platform'));
  assert.ok(ids.includes('key_vault_optimization'));
  assert.ok(ids.includes('oom_root_cause_scaling'));
  assert.ok(ids.includes('research_publications'));
  assert.ok(ids.includes('education_certifications'));
});

test('Search knowledge correctly prioritizes Key Vault optimization', () => {
  const results = searchKnowledge('How did Altaj optimize Azure Key Vault calls by 35x?', 2);
  assert.ok(results.length > 0);
  assert.equal(results[0].id, 'key_vault_optimization');
  assert.match(results[0].content, /35×|35x/);
});

test('Search knowledge correctly finds Model Context Protocol (MCP) in agentic AI work', () => {
  const results = searchKnowledge('What is Altaj experience with MCP and agentic AI?', 2);
  assert.ok(results.length > 0);
  assert.equal(results[0].id, 'agentic_ai_platform');
  assert.match(results[0].content, /Model Context Protocol/i);
});

test('Search knowledge correctly surfaces IEEE publication', () => {
  const results = searchKnowledge('Has Altaj published any IEEE papers or research?', 2);
  assert.ok(results.length > 0);
  assert.equal(results[0].id, 'research_publications');
  assert.match(results[0].content, /IEEE ICSCSS/);
});

test('Process RAG query produces grounded response and citation sources', async () => {
  const response = await processRAGQuery('What did Altaj do for OOM errors in Azure Container Apps?');
  assert.ok(response.answer && response.answer.length > 20);
  assert.ok(response.sources.length > 0);
  assert.ok(response.chunks.some((c) => c.id === 'oom_root_cause_scaling'));
});

test('Search knowledge correctly finds SnapWright VS Code extension', async () => {
  const results = searchKnowledge('Tell me about SnapWright VS Code extension', 2);
  assert.ok(results.length > 0);
  assert.equal(results[0].id, 'notable_projects');
  assert.match(results[0].content, /SnapWright/i);
});

test('Search knowledge correctly finds Nivesh startup crowdfunding platform', async () => {
  const results = searchKnowledge('Tell me about Nivesh crowdfunding app', 2);
  assert.ok(results.length > 0);
  assert.equal(results[0].id, 'notable_projects');
  assert.match(results[0].content, /Nivesh/i);
});

test('Process RAG query answers awards and education topics dynamically without rigging', async () => {
  const awardsRes = await processRAGQuery('What awards and honors has Altaj won?');
  assert.ok(awardsRes.chunks.some((c) => c.id === 'awards_recognition'));
  assert.match(awardsRes.answer, /Problem Solver Badge|Hi-Five Spot Award/);

  const eduRes = await processRAGQuery('What is Altaj education CGPA and certifications?');
  assert.ok(eduRes.chunks.some((c) => c.id === 'education_certifications'));
  assert.match(eduRes.answer, /9\.00|AI-900/);
});
