// Live-research pipeline tests: search provider selection, source injection
// into the research context, citation metadata, and honest failure handling.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { runTurn } from '../src/atlas/orchestrator.js';
import { pickSearchProvider } from '../src/atlas/providers/search.js';
import { buildSystemPrompt } from '../src/atlas/persona.js';

function mockModel() {
  const calls = [];
  const callModel = async ({ system, messages, onDelta }) => {
    calls.push({ system, messages });
    if (onDelta) onDelta('ANSWER');
    return { text: 'ANSWER', usage: { inputTokens: 10, outputTokens: 5 }, model: 'mock', thinkingSummary: '' };
  };
  return { calls, callModel };
}

const RESULTS = [
  { title: 'Gold Coast gym market report', url: 'https://example.com/report', snippet: 'Membership grew 8% in 2026.', published: '2026-06-01' },
  { title: 'Hope Island demographics', url: 'https://example.org/demo', snippet: 'Population 12,000.', published: null },
];

test('pickSearchProvider honours preference and falls back to any saved key', () => {
  assert.equal(pickSearchProvider({ searchKeys: {} }), null);
  assert.deepEqual(pickSearchProvider({ searchKeys: { brave: 'k' }, searchProvider: 'tavily' }), { provider: 'brave', apiKey: 'k' });
  assert.deepEqual(pickSearchProvider({ searchKeys: { tavily: 't', brave: 'b' }, searchProvider: 'brave' }), { provider: 'brave', apiKey: 'b' });
});

test('research mode injects live sources into context and metadata', async () => {
  const { calls, callModel } = mockModel();
  let searchedWith = null;
  const searchWeb = async (opts) => {
    searchedWith = opts;
    return RESULTS;
  };
  const res = await runTurn(
    {
      message: 'How is the Gold Coast gym market performing?',
      mode: 'research',
      settings: { keys: { anthropic: 'sk' }, searchKeys: { tavily: 'tvly-key' }, searchProvider: 'tavily' },
    },
    { callModel, searchWeb },
  );
  assert.equal(searchedWith.provider, 'tavily');
  assert.equal(searchedWith.apiKey, 'tvly-key');
  assert.match(calls[0].system, /\[Source 1\] Gold Coast gym market report/);
  assert.match(calls[0].system, /https:\/\/example\.com\/report/);
  assert.equal(res.meta.sources.length, 2);
  assert.equal(res.meta.searchProvider, 'tavily');
  assert.equal(res.meta.searchError, undefined);
});

test('search failure is honest: recorded in meta, answer still completes', async () => {
  const { calls, callModel } = mockModel();
  const searchWeb = async () => {
    throw new Error('Tavily rate limit reached.');
  };
  const res = await runTurn(
    {
      message: 'Latest interest rate decision?',
      mode: 'research',
      settings: { keys: { anthropic: 'sk' }, searchKeys: { tavily: 'k' } },
    },
    { callModel, searchWeb },
  );
  assert.equal(res.text, 'ANSWER');
  assert.match(res.meta.searchError, /rate limit/);
  assert.deepEqual(res.meta.sources, []);
  assert.ok(!calls[0].system.includes('[Source 1]'), 'no fabricated sources in context');
});

test('search is not called outside research mode or without keys', async () => {
  const { callModel } = mockModel();
  let searchCalls = 0;
  const searchWeb = async () => {
    searchCalls += 1;
    return RESULTS;
  };
  await runTurn({ message: 'Hello', mode: 'smart', settings: { keys: { anthropic: 'sk' }, searchKeys: { tavily: 'k' } } }, { callModel, searchWeb });
  await runTurn({ message: 'Hello', mode: 'research', settings: { keys: { anthropic: 'sk' }, searchKeys: {} } }, { callModel, searchWeb });
  assert.equal(searchCalls, 0);
});

test('system prompt renders a sources block with citation instructions', () => {
  const sys = buildSystemPrompt({ mode: 'research', sources: RESULTS });
  assert.match(sys, /\[Source 2\] Hope Island demographics/);
  assert.match(sys, /Cite as \[Source n\]/);
  assert.match(sys, /Sources/);
});
