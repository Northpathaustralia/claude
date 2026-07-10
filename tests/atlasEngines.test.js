// Tests for the Atlas core engines: router, council selection, memory
// commands, knowledge retrieval, markdown safety, and cost estimation.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { route, MODES, PROFILES } from '../src/atlas/router.js';
import { estimateCost } from '../src/atlas/models.js';
import { selectSpecialists, specialistPrompt } from '../src/atlas/council.js';
import { parseMemoryCommand, isSensitiveMemory, selectMemories, findMemoryMatches } from '../src/atlas/memory.js';
import { chunkText, searchChunks, buildChunkIndex, isSupportedFile } from '../src/atlas/knowledge.js';
import { renderMarkdown, escapeHtml } from '../src/atlas/markdown.js';

// --- Router ---------------------------------------------------------------

test('router picks Anthropic max tier for smart mode on balanced profile', () => {
  const r = route({ mode: 'smart', profile: 'balanced', availableProviders: ['anthropic'] });
  assert.equal(r.model.id, 'claude-opus-4-8');
});

test('router respects low cost profile', () => {
  const r = route({ mode: 'smart', profile: 'lowcost', availableProviders: ['anthropic'] });
  assert.equal(r.model.id, 'claude-sonnet-5');
  const fast = route({ mode: 'fast', profile: 'lowcost', availableProviders: ['anthropic'] });
  assert.equal(fast.model.id, 'claude-haiku-4-5');
});

test('router returns null model when nothing is connected', () => {
  const r = route({ mode: 'x10', availableProviders: [] });
  assert.equal(r.model, null);
  assert.match(r.reason, /no provider/i);
});

test('router honours manual override and preferred provider', () => {
  const o = route({ mode: 'fast', modelOverride: 'claude-opus-4-8', availableProviders: ['anthropic'] });
  assert.equal(o.model.id, 'claude-opus-4-8');
  const g = route({ mode: 'smart', provider: 'google', availableProviders: ['anthropic', 'google'] });
  assert.equal(g.model.provider, 'google');
});

test('every mode has a positive token budget and pass count', () => {
  for (const m of Object.values(MODES)) {
    assert.ok(m.maxTokens > 0, m.id);
    assert.ok(m.passes >= 1, m.id);
  }
  assert.ok(PROFILES.balanced && PROFILES.maximum && PROFILES.lowcost);
});

test('cost estimation uses published prices and stays null when unknown', () => {
  const c = estimateCost('claude-opus-4-8', 1_000_000, 1_000_000);
  assert.equal(c, 30); // $5 in + $25 out
  assert.equal(estimateCost('gpt-5.2', 1000, 1000), null);
});

// --- Council --------------------------------------------------------------

test('council selects relevant specialists only', () => {
  const forFinance = selectSpecialists('Build a 5 year revenue and cash flow model for the gym');
  assert.ok(forFinance.includes('VAULT'));
  assert.equal(forFinance[0], 'ATLAS');
  const forCode = selectSpecialists('Fix the bug in my website code and deploy the app');
  assert.ok(forCode.includes('FORGE'));
  assert.ok(!forCode.includes('PSYCHOLOGIST'));
});

test('council falls back to a core set for substantial tasks with no keyword match', () => {
  const picked = selectSpecialists('Should we proceed with the Hope Island opportunity next quarter overall?');
  assert.ok(picked.length > 1);
});

test('specialist prompts carry professional disclaimers where required', () => {
  assert.match(specialistPrompt('COUNSEL'), /not a lawyer/i);
  assert.match(specialistPrompt('PSYCHOLOGIST'), /not a licensed/i);
});

// --- Memory ---------------------------------------------------------------

test('memory command parsing: remember / forget / recall', () => {
  const r = parseMemoryCommand('Remember that I prefer short answers');
  assert.equal(r.action, 'remember');
  assert.match(r.text, /prefer short answers/);
  assert.equal(r.category, 'communication preference');
  assert.equal(parseMemoryCommand('Remember that I like driving on Sundays').category, 'personal preference');

  const f = parseMemoryCommand('Atlas, forget about my old office address');
  assert.equal(f.action, 'forget');

  const q = parseMemoryCommand('What do you remember about me?');
  assert.equal(q.action, 'recall');

  assert.equal(parseMemoryCommand('Tell me about property prices'), null);
});

test('sensitive memory is flagged for explicit confirmation', () => {
  const r = parseMemoryCommand('Remember that my banking password is hunter2');
  assert.equal(r.sensitive, true);
  assert.equal(isSensitiveMemory('my tax file number is 123'), true);
  assert.equal(isSensitiveMemory('I like emerald green'), false);
});

test('memory selection always includes communication preferences and caps output', () => {
  const memories = [
    { id: '1', category: 'communication preference', text: 'Prefers concise answers' },
    ...Array.from({ length: 20 }, (_, i) => ({ id: `g${i}`, category: 'general', text: `Fact number ${i} about gyms` })),
  ];
  const picked = selectMemories(memories, 'Tell me about the gym project', 6);
  assert.ok(picked.some((m) => m.id === '1'));
  assert.ok(picked.length <= 6);
});

test('forget matching is case-insensitive containment', () => {
  const memories = [{ id: '1', category: 'general', text: 'James prefers the Hope Island site' }];
  assert.equal(findMemoryMatches(memories, 'hope island').length, 1);
  assert.equal(findMemoryMatches(memories, 'brisbane').length, 0);
});

// --- Knowledge ------------------------------------------------------------

test('chunking splits long text with overlap and keeps short text whole', () => {
  assert.deepEqual(chunkText('short doc'), ['short doc']);
  const long = Array.from({ length: 60 }, (_, i) => `Paragraph ${i} about commercial property feasibility.`).join('\n\n');
  const chunks = chunkText(long);
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every((c) => c.length <= 1400));
});

test('search returns the relevant document excerpt first', () => {
  const chunks = buildChunkIndex([
    { id: 'a', title: 'Gym plan', text: 'The Hope Island gym requires 800 square metres and 24 hour access control.' },
    { id: 'b', title: 'Book notes', text: 'The children\'s book has thirty two pages of watercolour artwork.' },
  ]);
  const hits = searchChunks(chunks, 'How many square metres does the gym need?');
  assert.ok(hits.length >= 1);
  assert.equal(hits[0].docId, 'a');
});

test('file support list is honest', () => {
  assert.equal(isSupportedFile('notes.md'), true);
  assert.equal(isSupportedFile('leads.csv'), true);
  assert.equal(isSupportedFile('scan.pdf'), false); // PDF parsing is Planned, not faked
});

// --- Markdown safety --------------------------------------------------------

test('markdown renderer escapes HTML and scripts', () => {
  const html = renderMarkdown('Hello <script>alert(1)</script> **world**');
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('<strong>world</strong>'));
});

test('markdown renderer handles headings, lists, code, tables and links', () => {
  const md = [
    '# Title',
    '- item one',
    '- item two',
    '```js',
    'const x = 1 < 2;',
    '```',
    '| A | B |',
    '| - | - |',
    '| 1 | 2 |',
    '[site](https://example.com) and [bad](javascript:alert(1))',
  ].join('\n');
  const html = renderMarkdown(md);
  assert.ok(html.includes('<h2>Title</h2>'));
  assert.ok(html.includes('<li>item one</li>'));
  assert.ok(html.includes('&lt; 2'));
  assert.ok(html.includes('<table>'));
  assert.ok(html.includes('href="https://example.com"'));
  assert.ok(!html.includes('href="javascript:'));
});

test('escapeHtml covers quotes and ampersands', () => {
  assert.equal(escapeHtml(`<a href="x">&'</a>`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
});
