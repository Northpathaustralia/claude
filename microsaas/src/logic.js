// Trustloop core logic — pure functions only, no DOM access.
// Kept dependency-free and framework-free so it runs unmodified in the
// browser (as a native ES module) and under `node --test` (see ../tests).

export const STORAGE_KEY = 'trustloop.v1';

/** Rating (1-5) -> sentiment bucket. */
export function sentimentFromRating(rating) {
  const r = Number(rating);
  if (!Number.isFinite(r)) return 'neutral';
  if (r >= 4) return 'positive';
  if (r === 3) return 'neutral';
  return 'negative';
}

/** Should this submission raise an owner alert? */
export function shouldAlert(rating, threshold) {
  const r = Number(rating);
  const t = Number(threshold);
  if (!Number.isFinite(r) || !Number.isFinite(t)) return false;
  return r <= t;
}

/**
 * Escape untrusted text before it is ever inserted into innerHTML.
 * Every field a customer submits (comment, name) is untrusted input and
 * must go through this before rendering in the owner dashboard — otherwise
 * a submitted comment like `<img src=x onerror=alert(1)>` executes as a
 * stored XSS payload against the business owner.
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Neutralise CSV formula injection ("=cmd|...", "+SUM(...)", etc.) when a
 * business owner opens the export in Excel/Sheets — a booby-trapped
 * customer comment field is a known attack vector against CSV exports.
 */
function csvSafeCell(value) {
  const s = String(value ?? '');
  const neutralised = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  const escaped = neutralised.replace(/"/g, '""');
  return `"${escaped}"`;
}

export function toCSV(entries) {
  const header = ['timestamp', 'rating', 'sentiment', 'name', 'contact', 'comment', 'googleClicked'];
  const rows = entries.map((e) => [
    e.timestamp,
    e.rating,
    e.sentiment,
    e.name || '',
    e.contact || '',
    e.comment || '',
    e.googleClicked ? 'yes' : 'no',
  ]);
  return [header, ...rows].map((row) => row.map(csvSafeCell).join(',')).join('\r\n');
}

/**
 * Only http(s) URLs are accepted for the Google review link. This blocks
 * `javascript:`/`data:` URI injection through the setup form, which would
 * otherwise let anyone with dashboard access turn the public "Leave a
 * review" button into a script-execution or phishing vector.
 */
export function isValidHttpsUrl(value) {
  try {
    const url = new URL(String(value));
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateBusinessConfig({ name, googleReviewUrl, alertEmail, alertThreshold, pin }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Business name is required.';
  if (!isValidHttpsUrl(googleReviewUrl)) {
    errors.googleReviewUrl = 'Enter your Google review link as a full https:// URL.';
  }
  if (alertEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alertEmail)) {
    errors.alertEmail = 'Enter a valid email address, or leave it blank.';
  }
  const threshold = Number(alertThreshold);
  if (!Number.isInteger(threshold) || threshold < 1 || threshold > 5) {
    errors.alertThreshold = 'Alert threshold must be a whole number between 1 and 5.';
  }
  if (!pin || !/^\d{4,8}$/.test(pin)) {
    errors.pin = 'Dashboard PIN must be 4-8 digits.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateFeedbackInput({ rating, comment, name, contact }) {
  const errors = {};
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    errors.rating = 'Choose a star rating from 1 to 5.';
  }
  if (comment && comment.length > 2000) {
    errors.comment = 'Feedback must be under 2000 characters.';
  }
  if (name && name.length > 200) {
    errors.name = 'Name must be under 200 characters.';
  }
  if (contact && contact.length > 200) {
    errors.contact = 'Contact must be under 200 characters.';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function computeStats(entries) {
  const count = entries.length;
  const totalRating = entries.reduce((sum, e) => sum + Number(e.rating || 0), 0);
  const positive = entries.filter((e) => e.sentiment === 'positive').length;
  const neutral = entries.filter((e) => e.sentiment === 'neutral').length;
  const negative = entries.filter((e) => e.sentiment === 'negative').length;
  const googleClicks = entries.filter((e) => e.googleClicked).length;
  return {
    count,
    avgRating: count ? Math.round((totalRating / count) * 10) / 10 : 0,
    positive,
    neutral,
    negative,
    googleClicks,
    clickThroughRate: count ? Math.round((googleClicks / count) * 1000) / 10 : 0,
  };
}

/**
 * Total Google-review-link clicks, combining clicks attributed to a
 * submitted feedback entry with "standalone" clicks — a customer who
 * clicks the always-visible review link without ever submitting private
 * feedback still needs to be counted, otherwise the most common happy-path
 * click (rate us, done) silently disappears from the numbers.
 */
export function totalGoogleClicks(entries, standaloneClicks = 0) {
  const attributed = entries.filter((e) => e.googleClicked).length;
  return attributed + Math.max(0, Number(standaloneClicks) || 0);
}

/** Entries at/below the alert threshold that the owner hasn't actioned yet. */
export function alertQueue(entries, threshold) {
  return entries
    .filter((e) => shouldAlert(e.rating, threshold) && !e.acknowledged)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function makeFeedbackEntry({ rating, comment, name, contact, googleClicked }) {
  return {
    id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: new Date().toISOString(),
    rating: Number(rating),
    sentiment: sentimentFromRating(rating),
    comment: (comment || '').trim(),
    name: (name || '').trim(),
    contact: (contact || '').trim(),
    googleClicked: Boolean(googleClicked),
    acknowledged: false,
  };
}
