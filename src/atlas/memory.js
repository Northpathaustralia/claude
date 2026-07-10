// ---------------------------------------------------------------------------
// User-controlled memory engine.
// - parseMemoryCommand(): detects "remember…", "forget…", "what do you
//   remember" chat commands so memory stays user-driven (never silent).
// - selectMemories(): picks which approved memories to inject into context.
// Storage itself lives in the Atlas store; these are pure functions.
// ---------------------------------------------------------------------------

export const MEMORY_CATEGORIES = [
  'personal preference',
  'communication preference',
  'business information',
  'brand guideline',
  'important person',
  'current project',
  'approved fact',
  'reusable instruction',
  'favourite format',
  'long-term goal',
  'general',
];

const SENSITIVE_PATTERNS = [
  /password/i,
  /passcode/i,
  /\bpin\b/i,
  /api[\s-]?key/i,
  /secret/i,
  /credit\s?card/i,
  /\bcvv\b/i,
  /bank account/i,
  /medicare/i,
  /tax file number/i,
  /\btfn\b/i,
  /passport/i,
  /licence number/i,
  /medical|diagnosis|health condition/i,
];

/** True when a memory request needs an explicit extra confirmation. */
export function isSensitiveMemory(text) {
  return SENSITIVE_PATTERNS.some((p) => p.test(text || ''));
}

function guessCategory(text) {
  const t = (text || '').toLowerCase();
  if (/prefer|like|always|never|call me|tone|style|format/.test(t))
    return /reply|answer|write|tone|style|format/.test(t) ? 'communication preference' : 'personal preference';
  if (/northpath|business|company|revenue|clients?/.test(t)) return 'business information';
  if (/brand|logo|colour|color|font/.test(t)) return 'brand guideline';
  if (/wife|husband|son|daughter|partner|friend|accountant|broker|is my/.test(t)) return 'important person';
  if (/project|working on|building/.test(t)) return 'current project';
  if (/goal|aim|by 20\d\d|long.term/.test(t)) return 'long-term goal';
  return 'general';
}

/**
 * Detect memory commands in a chat message.
 * @returns {null | {action:'remember', text:string, category:string, sensitive:boolean}
 *                | {action:'forget', text:string}
 *                | {action:'recall'}}
 */
export function parseMemoryCommand(message) {
  const raw = (message || '').trim();
  if (!raw) return null;

  if (/^what do you (remember|know) about me\??$/i.test(raw) || /^what have you remembered\??$/i.test(raw)) {
    return { action: 'recall' };
  }

  const forget = raw.match(/^(?:atlas[,:]?\s*)?forget (?:that |about )?(.{2,})$/i);
  if (forget) return { action: 'forget', text: forget[1].trim().replace(/[.!]$/, '') };

  const remember = raw.match(/^(?:atlas[,:]?\s*)?(?:please\s+)?remember (?:that |this[:,]?\s*)?(.{2,})$/i);
  if (remember) {
    const text = remember[1].trim().replace(/[.!]$/, '');
    return { action: 'remember', text, category: guessCategory(text), sensitive: isSensitiveMemory(text) };
  }

  return null;
}

/**
 * Choose memories for context injection: exact-word overlap scoring with the
 * message, always including reusable instructions and communication
 * preferences (they shape every reply), capped to keep prompts lean.
 */
export function selectMemories(memories, message, cap = 12) {
  const always = [];
  const scored = [];
  const words = new Set(
    (message || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3),
  );
  for (const m of memories || []) {
    if (m.category === 'communication preference' || m.category === 'reusable instruction') {
      always.push(m);
      continue;
    }
    const overlap = (m.text || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => words.has(w)).length;
    scored.push({ m, overlap });
  }
  scored.sort((a, b) => b.overlap - a.overlap);
  const rest = scored
    .filter((s, i) => s.overlap > 0 || i < 4) // top general memories ride along even without overlap
    .map((s) => s.m);
  return [...always, ...rest].slice(0, cap);
}

/** Case-insensitive containment match used by the "forget" command. */
export function findMemoryMatches(memories, text) {
  const needle = (text || '').toLowerCase();
  return (memories || []).filter(
    (m) => m.text.toLowerCase().includes(needle) || needle.includes(m.text.toLowerCase()),
  );
}
