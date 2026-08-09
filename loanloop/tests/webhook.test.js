import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleLead, validateLeadPayload } from '../server/webhook-function.js';

const validLead = {
  brokerId: 'test-finance-co',
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '0400000000',
  estimate: { low: 575000, high: 745000, purchaseBudgetHigh: 825000 },
  submittedAt: new Date().toISOString(),
  source: 'https://example-broker.com.au/',
};

function makeDeps(overrides = {}) {
  const appended = [];
  const notified = [];
  return {
    isAllowedOrigin: () => true,
    getBrokerPlan: async () => ({ plan: 'free', leadsThisMonth: 0 }),
    appendLeadRow: async (brokerId, lead) => appended.push({ brokerId, lead }),
    sendBrokerNotification: async (brokerId, lead) => notified.push({ brokerId, lead }),
    ...overrides,
    _appended: appended,
    _notified: notified,
  };
}

test('handleLead accepts a well-formed lead and fans out to sheet + email', async () => {
  const deps = makeDeps();
  const result = await handleLead({ body: validLead, originHeader: 'https://example-broker.com.au' }, deps);
  assert.equal(result.status, 200);
  assert.equal(deps._appended.length, 1);
  assert.equal(deps._notified.length, 1);
});

test('handleLead rejects disallowed origins before touching validation or storage', async () => {
  const deps = makeDeps({ isAllowedOrigin: () => false });
  const result = await handleLead({ body: validLead, originHeader: 'https://evil.example' }, deps);
  assert.equal(result.status, 403);
  assert.equal(deps._appended.length, 0);
});

test('handleLead rejects malformed payloads with a 400 and no side effects', async () => {
  const deps = makeDeps();
  const result = await handleLead({ body: { brokerId: 'x' }, originHeader: 'https://example-broker.com.au' }, deps);
  assert.equal(result.status, 400);
  assert.ok(result.body.details.length > 0);
  assert.equal(deps._appended.length, 0);
});

test('handleLead rejects a brokerId that is not a clean slug (injection-style input)', async () => {
  const deps = makeDeps();
  const result = await handleLead(
    { body: { ...validLead, brokerId: '../../etc/passwd' }, originHeader: 'https://example-broker.com.au' },
    deps
  );
  assert.equal(result.status, 400);
});

test('handleLead returns 404 for an unknown broker instead of silently accepting the lead', async () => {
  const deps = makeDeps({ getBrokerPlan: async () => null });
  const result = await handleLead({ body: validLead, originHeader: 'https://example-broker.com.au' }, deps);
  assert.equal(result.status, 404);
  assert.equal(deps._appended.length, 0);
});

test('handleLead enforces the free-plan monthly lead cap', async () => {
  const deps = makeDeps({ getBrokerPlan: async () => ({ plan: 'free', leadsThisMonth: 20 }) });
  const result = await handleLead({ body: validLead, originHeader: 'https://example-broker.com.au' }, deps);
  assert.equal(result.status, 402);
  assert.equal(deps._appended.length, 0);
});

test('handleLead does not cap pro/growth plans', async () => {
  const deps = makeDeps({ getBrokerPlan: async () => ({ plan: 'pro', leadsThisMonth: 10_000 }) });
  const result = await handleLead({ body: validLead, originHeader: 'https://example-broker.com.au' }, deps);
  assert.equal(result.status, 200);
});

test('validateLeadPayload flags a non-object body without throwing', () => {
  assert.deepEqual(validateLeadPayload(null), ['Request body must be a JSON object.']);
  assert.deepEqual(validateLeadPayload('not an object'), ['Request body must be a JSON object.']);
});

test('validateLeadPayload flags a non-finite estimate', () => {
  const errors = validateLeadPayload({ ...validLead, estimate: { low: NaN, high: 'x' } });
  assert.ok(errors.some((e) => e.includes('estimate')));
});
