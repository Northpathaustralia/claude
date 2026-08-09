// Unit tests for the StillUp monitoring engine (pure functions, no DOM needed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseMonitorUrl, pingUrl, appendCheck, uptimePercent,
  averageResponseMs, currentStatus, deriveIncidents, isMixedContentRisk,
} from '../stillup/src/lib/monitor.js';

test('parseMonitorUrl accepts bare domains and adds https', () => {
  const r = parseMonitorUrl('example.com');
  assert.equal(r.ok, true);
  assert.equal(r.url, 'https://example.com/');
});

test('parseMonitorUrl accepts explicit http/https', () => {
  assert.equal(parseMonitorUrl('http://example.com').ok, true);
  assert.equal(parseMonitorUrl('https://example.com/status').ok, true);
});

test('parseMonitorUrl rejects empty input', () => {
  assert.equal(parseMonitorUrl('').ok, false);
  assert.equal(parseMonitorUrl('   ').ok, false);
});

test('parseMonitorUrl rejects non-http(s) schemes', () => {
  assert.equal(parseMonitorUrl('javascript:alert(1)').ok, false);
  assert.equal(parseMonitorUrl('data:text/html,hi').ok, false);
  assert.equal(parseMonitorUrl('ftp://example.com').ok, false);
});

test('parseMonitorUrl rejects garbage', () => {
  assert.equal(parseMonitorUrl('not a url at all ://').ok, false);
});

test('pingUrl resolves ok on a successful fetch', async () => {
  const fakeFetch = async () => ({});
  const result = await pingUrl('example.com', { fetchImpl: fakeFetch });
  assert.equal(result.ok, true);
  assert.equal(typeof result.ms, 'number');
  assert.equal(typeof result.t, 'number');
});

test('pingUrl resolves not-ok when fetch throws', async () => {
  const fakeFetch = async () => { throw new TypeError('Failed to fetch'); };
  const result = await pingUrl('example.com', { fetchImpl: fakeFetch });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'unreachable');
});

test('pingUrl reports timeout distinctly from unreachable', async () => {
  const fakeFetch = async (url, { signal }) => new Promise((_, reject) => {
    signal.addEventListener('abort', () => {
      const err = new Error('aborted');
      err.name = 'AbortError';
      reject(err);
    });
  });
  const result = await pingUrl('example.com', { timeoutMs: 5, fetchImpl: fakeFetch });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'timeout');
});

test('pingUrl short-circuits invalid URLs without calling fetch', async () => {
  let called = false;
  const fakeFetch = async () => { called = true; return {}; };
  const result = await pingUrl('javascript:alert(1)', { fetchImpl: fakeFetch });
  assert.equal(result.ok, false);
  assert.equal(result.error, 'invalid-url');
  assert.equal(called, false);
});

test('appendCheck caps history length', () => {
  let checks = [];
  for (let i = 0; i < 510; i++) checks = appendCheck(checks, { ok: true, ms: 10, t: i });
  assert.equal(checks.length, 500);
  assert.equal(checks[0].t, 10); // oldest 10 dropped
});

test('uptimePercent is null with no data, else a rounded percentage', () => {
  assert.equal(uptimePercent([]), null);
  assert.equal(uptimePercent(null), null);
  const checks = [
    { ok: true, ms: 1, t: 1 }, { ok: true, ms: 1, t: 2 }, { ok: true, ms: 1, t: 3 },
    { ok: false, ms: 1, t: 4 },
  ];
  assert.equal(uptimePercent(checks), 75);
});

test('averageResponseMs ignores failed checks and is null with none', () => {
  assert.equal(averageResponseMs([]), null);
  const checks = [{ ok: true, ms: 100, t: 1 }, { ok: true, ms: 200, t: 2 }, { ok: false, ms: 5000, t: 3 }];
  assert.equal(averageResponseMs(checks), 150);
});

test('currentStatus reflects the most recent check', () => {
  assert.equal(currentStatus([]), 'unknown');
  assert.equal(currentStatus([{ ok: true, t: 1 }, { ok: false, t: 2 }]), 'down');
  assert.equal(currentStatus([{ ok: false, t: 1 }, { ok: true, t: 2 }]), 'up');
});

test('deriveIncidents pairs down/up transitions and tracks open incidents', () => {
  const checks = [
    { ok: true, t: 0 },
    { ok: false, t: 100 }, // incident starts
    { ok: false, t: 200 },
    { ok: true, t: 300 }, // incident resolves
    { ok: false, t: 400 }, // second incident, still open
  ];
  const incidents = deriveIncidents(checks);
  assert.equal(incidents.length, 2);
  // most recent first
  assert.equal(incidents[0].startedAt, 400);
  assert.equal(incidents[0].resolvedAt, null);
  assert.equal(incidents[0].durationMs, null);
  assert.equal(incidents[1].startedAt, 100);
  assert.equal(incidents[1].resolvedAt, 300);
  assert.equal(incidents[1].durationMs, 200);
});

test('deriveIncidents returns empty for all-up history', () => {
  const checks = [{ ok: true, t: 1 }, { ok: true, t: 2 }];
  assert.deepEqual(deriveIncidents(checks), []);
});

test('isMixedContentRisk flags http:// monitors only when the page itself is https', () => {
  assert.equal(isMixedContentRisk('http://example.com/', 'https:'), true);
  assert.equal(isMixedContentRisk('http://example.com/', 'http:'), false);
  assert.equal(isMixedContentRisk('https://example.com/', 'https:'), false);
  assert.equal(isMixedContentRisk('https://example.com/', 'http:'), false);
});
