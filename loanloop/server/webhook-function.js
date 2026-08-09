// ---------------------------------------------------------------------------
// Reference lead-intake webhook. Framework-agnostic on purpose: `handleLead`
// takes a plain parsed body + a small `deps` object of injected I/O
// functions, so it adapts to Cloudflare Workers, Netlify Functions, or a
// plain Node server with a thin adapter (examples at the bottom).
//
// This file is NOT deployed anywhere by this repo — it needs the operator's
// own free-tier accounts (a Sheets/Apps Script endpoint, an email sender)
// wired in as environment variables. See ../docs/MVP_LAUNCH_STEPS.md.
// ---------------------------------------------------------------------------

const REQUIRED_FIELDS = ['brokerId', 'name', 'email', 'submittedAt', 'estimate'];
const PLAN_LEAD_CAPS = { free: 20, pro: Infinity, growth: Infinity };

/** Basic shape/type validation — mirrors the client-side checks but never trusts them. */
export function validateLeadPayload(body) {
  const errors = [];
  if (typeof body !== 'object' || body === null) {
    return ['Request body must be a JSON object.'];
  }
  for (const field of REQUIRED_FIELDS) {
    if (!(field in body)) errors.push(`Missing required field: ${field}.`);
  }
  if (typeof body.brokerId !== 'string' || !/^[a-z0-9-]{1,60}$/.test(body.brokerId)) {
    errors.push('brokerId must be a lowercase slug.');
  }
  if (typeof body.email !== 'string' || body.email.length > 254 || !body.email.includes('@')) {
    errors.push('email is missing or malformed.');
  }
  if (typeof body.name !== 'string' || body.name.trim().length === 0 || body.name.length > 200) {
    errors.push('name is missing or too long.');
  }
  if (
    typeof body.estimate !== 'object' ||
    body.estimate === null ||
    !Number.isFinite(body.estimate.low) ||
    !Number.isFinite(body.estimate.high)
  ) {
    errors.push('estimate.low and estimate.high must be finite numbers.');
  }
  return errors;
}

/**
 * Core handler. `deps` are injected so this stays testable without a real
 * network/Sheets/email call:
 *   - getBrokerPlan(brokerId) -> Promise<{ plan: 'free'|'pro'|'growth', leadsThisMonth: number } | null>
 *   - appendLeadRow(brokerId, lead) -> Promise<void>
 *   - sendBrokerNotification(brokerId, lead) -> Promise<void>
 *   - isAllowedOrigin(originHeader) -> boolean
 */
export async function handleLead({ body, originHeader }, deps) {
  if (!deps.isAllowedOrigin(originHeader)) {
    return { status: 403, body: { error: 'Origin not allowed.' } };
  }

  const errors = validateLeadPayload(body);
  if (errors.length > 0) {
    return { status: 400, body: { error: 'Invalid payload.', details: errors } };
  }

  const broker = await deps.getBrokerPlan(body.brokerId);
  if (!broker) {
    return { status: 404, body: { error: 'Unknown brokerId.' } };
  }

  const cap = PLAN_LEAD_CAPS[broker.plan] ?? PLAN_LEAD_CAPS.free;
  if (broker.leadsThisMonth >= cap) {
    // Fail closed on quota, but never lose the visitor's estimate — the
    // widget already showed it client-side before this request was sent.
    return { status: 402, body: { error: 'Monthly lead cap reached for this plan.' } };
  }

  await deps.appendLeadRow(body.brokerId, body);
  await deps.sendBrokerNotification(body.brokerId, body);

  return { status: 200, body: { ok: true } };
}

// ---------------------------------------------------------------------------
// Example adapters (illustrative — not executed by this repo's test suite).
// ---------------------------------------------------------------------------

/*
// Cloudflare Worker:
export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    const body = await request.json().catch(() => null);
    const result = await handleLead(
      { body, originHeader: request.headers.get('origin') },
      cloudflareDeps(env)
    );
    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};

// Netlify Function:
export async function handler(event) {
  const body = JSON.parse(event.body || 'null');
  const result = await handleLead(
    { body, originHeader: event.headers.origin },
    netlifyDeps(process.env)
  );
  return { statusCode: result.status, body: JSON.stringify(result.body) };
}
*/
