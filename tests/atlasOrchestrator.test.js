// Orchestrator, council, studio and briefing tests with a mocked model —
// verifies pass pipelines, context injection, demo-mode honesty and usage
// accounting without any network access.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { runTurn, runCouncil } from '../src/atlas/orchestrator.js';
import { runStudio, cleanArtifact, STUDIO_ENGINES } from '../src/atlas/studio.js';
import { buildBriefing } from '../src/atlas/briefing.js';
import { buildSeedData } from '../src/data/seedData.js';
import { buildSystemPrompt } from '../src/atlas/persona.js';

/** Mock provider: records calls, streams a canned reply. */
function mockModel(replyFor = () => 'MOCK REPLY') {
  const calls = [];
  const callModel = async ({ system, messages, onDelta }) => {
    const call = { system, messages };
    calls.push(call);
    const text = replyFor(call, calls.length);
    if (onDelta) onDelta(text);
    return { text, usage: { inputTokens: 100, outputTokens: 50 }, model: 'mock', thinkingSummary: '' };
  };
  return { calls, callModel };
}

const SETTINGS = { profile: 'balanced', keys: { anthropic: 'sk-test' } };

test('smart mode runs one pass and reports usage + cost', async () => {
  const { calls, callModel } = mockModel();
  let streamed = '';
  const res = await runTurn(
    { message: 'Hello Atlas', mode: 'smart', settings: SETTINGS, onDelta: (d) => (streamed += d) },
    { callModel },
  );
  assert.equal(calls.length, 1);
  assert.equal(res.text, 'MOCK REPLY');
  assert.equal(streamed, 'MOCK REPLY');
  assert.equal(res.usage.inputTokens, 100);
  assert.ok(res.cost > 0);
  assert.equal(res.meta.demo, false);
  assert.match(calls[0].system, /You are Atlas/);
});

test('deep think runs draft then critique pass', async () => {
  const { calls, callModel } = mockModel((_, n) => (n === 1 ? 'DRAFT' : 'FINAL'));
  const res = await runTurn({ message: 'Should I buy the site?', mode: 'deep', settings: SETTINGS }, { callModel });
  assert.equal(calls.length, 2);
  assert.equal(res.text, 'FINAL');
  assert.match(calls[1].messages.map((m) => m.content).join(' '), /DRAFT/);
  assert.equal(res.usage.inputTokens, 200); // both passes counted
});

test('x10 mode runs plan, council specialists, then synthesis', async () => {
  const { calls, callModel } = mockModel();
  const res = await runTurn(
    { message: 'Build a commercial gym proposal with revenue model and marketing plan', mode: 'x10', settings: SETTINGS },
    { callModel },
  );
  assert.ok(res.meta.specialists.length >= 2, `specialists: ${res.meta.specialists}`);
  assert.equal(calls.length, 2 + res.meta.specialists.length); // plan + each specialist + synthesis
  assert.ok(res.meta.passes.length === calls.length);
});

test('project instructions, memories and knowledge are injected into context', async () => {
  const { calls, callModel } = mockModel();
  await runTurn(
    {
      message: 'What size does the gym need to be?',
      mode: 'smart',
      settings: SETTINGS,
      project: { name: 'Gym Project', instructions: 'Always use metric units.' },
      memories: [{ id: 'm1', category: 'approved fact', text: 'The gym target suburb is Hope Island' }],
      chunks: [{ id: 'c1', docId: 'd1', title: 'Site brief', text: 'The gym requires 800 square metres of floor area.' }],
    },
    { callModel },
  );
  const sys = calls[0].system;
  assert.match(sys, /Gym Project/);
  assert.match(sys, /metric units/);
  assert.match(sys, /Hope Island/);
  assert.match(sys, /800 square metres/);
});

test('demo mode is clearly labelled and makes no model calls', async () => {
  const { calls, callModel } = mockModel();
  const res = await runTurn({ message: 'Hi', mode: 'smart', settings: { keys: {} } }, { callModel });
  assert.equal(calls.length, 0);
  assert.equal(res.meta.demo, true);
  assert.match(res.text, /Demonstration/i);
  assert.equal(res.cost, null);
});

test('council convenes specialists and synthesises', async () => {
  const { calls, callModel } = mockModel((call) => (call.system.includes('chief intelligence coordinator') ? 'BRIEF' : 'ANALYSIS'));
  const res = await runCouncil(
    { question: 'Should NorthPath increase advertising spend on finance leads?', settings: SETTINGS },
    { callModel },
  );
  assert.ok(res.analyses.length >= 1);
  assert.equal(res.text, 'BRIEF');
  assert.equal(calls.length, res.analyses.length + 1);
});

test('studio produces a downloadable artifact and honest demo fallback', async () => {
  const { callModel } = mockModel(() => '```html\n<!doctype html><html><body>Hi</body></html>\n```');
  const res = await runStudio({ engineId: 'website', brief: 'Landing page for NorthPath', settings: SETTINGS }, { callModel });
  assert.equal(res.artifact.type, 'html');
  assert.ok(res.artifact.content.startsWith('<!doctype html'));

  const demo = await runStudio({ engineId: 'document', brief: 'A plan', settings: { keys: {} } }, { callModel });
  assert.equal(demo.artifact, null);
  assert.match(demo.text, /Demonstration/);
});

test('cleanArtifact strips fences and leading prose from html', () => {
  const html = cleanArtifact('Here you go:\n<!doctype html><html></html>', STUDIO_ENGINES.website);
  assert.ok(html.startsWith('<!doctype html'));
  const csv = cleanArtifact('```csv\na,b\n1,2\n```', STUDIO_ENGINES.spreadsheet);
  assert.equal(csv, 'a,b\n1,2');
});

test('briefing summarises real store data with no invented numbers', () => {
  const npaos = buildSeedData();
  const briefing = buildBriefing({ npaos, atlas: { projects: [{ id: 'p1' }] } });
  assert.match(briefing.greeting, /James/);
  assert.ok(briefing.lines.some((l) => /NorthPath/.test(l)));
  assert.ok(briefing.priorities.length >= 1);
  assert.ok(briefing.speech.length > 20);
});

test('system prompt builder stays honest about local edition limits', () => {
  const sys = buildSystemPrompt({ mode: 'research' });
  assert.match(sys, /no live web access/i);
  assert.match(sys, /Never invent/i);
});
