// ---------------------------------------------------------------------------
// Display formatting helpers.
// ---------------------------------------------------------------------------

const aud = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

/** Format a number as whole-dollar AUD, with a dash for empty values. */
export function formatCurrency(value) {
  if (value === null || value === undefined || value === '' || Number.isNaN(Number(value))) return '—';
  return aud.format(Number(value));
}

/** Format a ratio (0..1) as a percentage with one decimal. */
export function formatPercent(ratio) {
  if (ratio === null || ratio === undefined || Number.isNaN(ratio)) return '—';
  return `${(ratio * 100).toFixed(1)}%`;
}

/** Truncate long text for table cells. */
export function truncate(text, max = 80) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** Generate a reasonably unique id without external dependencies. */
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
