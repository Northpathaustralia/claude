// Pure functions for the monitoring engine: URL validation, the reachability
// check itself, uptime math, and incident derivation. Kept dependency-free
// and framework-free so it runs identically in the browser and under
// `node --test` (see tests/stillup-monitor.test.js).

const CHECK_TIMEOUT_MS = 8000;
const MAX_CHECKS_PER_MONITOR = 500; // ~ enough history without unbounded localStorage growth

/**
 * Validates a monitor URL. Only http(s) is accepted — other schemes
 * (javascript:, data:, file:, etc.) are rejected so a pasted URL can never
 * be used to trigger something other than a network fetch.
 */
export function parseMonitorUrl(input) {
  const trimmed = (input || '').trim();
  if (!trimmed) return { ok: false, error: 'Enter a URL.' };
  // Only treat the input as already having a scheme if it has a real
  // "scheme://" prefix (http://, ftp://, ...). Anything else — including
  // "javascript:alert(1)" or a bare domain — is treated as schemeless and
  // gets "https://" prepended, so it either becomes a valid https URL or
  // fails to parse; it can never smuggle a non-http(s) scheme through.
  const hasScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed);
  const withScheme = hasScheme ? trimmed : `https://${trimmed}`;
  let url;
  try {
    url = new URL(withScheme);
  } catch {
    return { ok: false, error: 'That URL doesn\'t look valid.' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: 'Only http:// and https:// URLs are supported.' };
  }
  return { ok: true, url: url.toString() };
}

/**
 * Checks whether a URL is reachable from the current browser tab.
 *
 * IMPORTANT LIMITATION (disclosed in the UI, not just here): browsers do not
 * expose HTTP status codes or response bodies for cross-origin requests
 * (CORS), and there is no browser API for TLS certificate/domain expiry.
 * `mode: 'no-cors'` lets us tell "the network request completed" apart from
 * "it errored or timed out" without needing the target site to opt in via
 * CORS headers — but a request that completes with e.g. a 404 or 500 still
 * resolves here, because the opaque response hides the status. This is a
 * best-effort reachability probe, not a full HTTP/SSL uptime check. The
 * production architecture (docs/STILLUP_PRODUCT_SPEC.md) runs checks
 * server-side instead, where real status codes and certificate data are
 * available.
 */
export async function pingUrl(rawUrl, { timeoutMs = CHECK_TIMEOUT_MS, fetchImpl = fetch } = {}) {
  const parsed = parseMonitorUrl(rawUrl);
  if (!parsed.ok) return { ok: false, ms: 0, error: 'invalid-url', t: Date.now() };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const started = Date.now();
  try {
    await fetchImpl(parsed.url, { mode: 'no-cors', cache: 'no-store', signal: controller.signal });
    return { ok: true, ms: Date.now() - started, t: started };
  } catch (err) {
    return {
      ok: false,
      ms: Date.now() - started,
      error: err && err.name === 'AbortError' ? 'timeout' : 'unreachable',
      t: started,
    };
  } finally {
    clearTimeout(timer);
  }
}

/** Appends a check result to a monitor's history, capped at MAX_CHECKS_PER_MONITOR (oldest dropped first). */
export function appendCheck(checks, check) {
  const next = [...checks, check];
  if (next.length > MAX_CHECKS_PER_MONITOR) next.splice(0, next.length - MAX_CHECKS_PER_MONITOR);
  return next;
}

/** Uptime percentage over the given checks. Returns null when there's no data yet (never show a fake 100%). */
export function uptimePercent(checks) {
  if (!checks || checks.length === 0) return null;
  const ok = checks.filter((c) => c.ok).length;
  return Math.round((ok / checks.length) * 1000) / 10; // one decimal place
}

/** Average response time in ms across successful checks only. Null when no successful checks exist. */
export function averageResponseMs(checks) {
  const okChecks = (checks || []).filter((c) => c.ok);
  if (okChecks.length === 0) return null;
  return Math.round(okChecks.reduce((sum, c) => sum + c.ms, 0) / okChecks.length);
}

/** Current status derived from the most recent check. 'unknown' until at least one check has run. */
export function currentStatus(checks) {
  if (!checks || checks.length === 0) return 'unknown';
  return checks[checks.length - 1].ok ? 'up' : 'down';
}

/**
 * True when checking `monitorUrl` from a page served at `pagePotocol` will
 * be blocked by the browser's mixed-content policy (an https page cannot
 * fetch a plain http:// resource) before the check ever reaches the
 * network — which would otherwise silently read as a false "down".
 */
export function isMixedContentRisk(monitorUrl, pageProtocol) {
  return monitorUrl.startsWith('http://') && pageProtocol === 'https:';
}

/**
 * Derives an incident log from a check history: every down-to-up or
 * up-to-down transition becomes an incident. Open incidents (still down)
 * have `resolvedAt: null` and `durationMs: null`.
 */
export function deriveIncidents(checks) {
  if (!checks || checks.length === 0) return [];
  const incidents = [];
  let open = null;
  for (const c of checks) {
    if (!c.ok && !open) {
      open = { startedAt: c.t, resolvedAt: null, durationMs: null };
    } else if (c.ok && open) {
      open.resolvedAt = c.t;
      open.durationMs = c.t - open.startedAt;
      incidents.push(open);
      open = null;
    }
  }
  if (open) incidents.push(open);
  return incidents.reverse(); // most recent first
}
