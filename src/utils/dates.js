// ---------------------------------------------------------------------------
// Date helpers. All persisted dates are ISO 8601 strings (yyyy-mm-dd or full
// timestamps) so exports map cleanly onto external systems later.
// ---------------------------------------------------------------------------

/** Today as yyyy-mm-dd in local time. */
export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Add days to a yyyy-mm-dd string, returning yyyy-mm-dd. */
export function addDays(iso, days) {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + days);
  return todayISO(d);
}

/** Days between two yyyy-mm-dd strings (b - a). */
export function daysBetween(a, b) {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.round((db - da) / 86400000);
}

/** True if the date is strictly before today. */
export function isOverdue(iso, today = todayISO()) {
  return Boolean(iso) && iso < today;
}

/** True if the date is today. */
export function isToday(iso, today = todayISO()) {
  return iso === today;
}

/** Human-friendly date, e.g. "Mon 7 Jul". */
export function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** Start of the ISO week (Monday) for a yyyy-mm-dd string. */
export function startOfWeek(iso) {
  const d = new Date(`${iso}T00:00:00`);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return todayISO(d);
}

/** yyyy-mm prefix for monthly grouping. */
export function monthKey(iso) {
  return (iso || '').slice(0, 7);
}
