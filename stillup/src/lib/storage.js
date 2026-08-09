// localStorage persistence for StillUp. Versioned key so a future schema
// change can migrate instead of silently corrupting old data.
const KEY = 'stillup.v1';

export function loadState() {
  if (typeof localStorage === 'undefined') return { monitors: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { monitors: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.monitors)) return { monitors: [] };
    return parsed;
  } catch {
    return { monitors: [] };
  }
}

export function saveState(state) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable (private browsing) — fail silently, the
    // app still works for the current tab session, it just won't persist.
  }
}
