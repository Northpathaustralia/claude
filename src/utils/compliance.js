// ---------------------------------------------------------------------------
// Compliance guard.
//
// NPAOS must never promise approvals or guarantee outcomes. Every piece of
// generated customer-facing content passes through this module before being
// shown, and the same checker is available for James' own drafts.
// ---------------------------------------------------------------------------

/** Standard educational disclaimer appended to outbound content. */
export const DISCLAIMER =
  'This information is general and educational only. It does not consider your personal ' +
  'circumstances and is not financial or credit advice. Outcomes depend on individual ' +
  'circumstances — consider seeking advice from a licensed professional.';

/**
 * Phrases that imply guaranteed finance, approval or outcomes.
 * Each entry: a regex to detect the problem and a compliant replacement.
 */
const BANNED_PATTERNS = [
  { pattern: /guaranteed?\s+(approval|finance|loan|outcome)/gi, replacement: 'potential options (subject to individual circumstances)' },
  { pattern: /\bwe\s+guarantee\b/gi, replacement: 'we aim' },
  { pattern: /\byou\s+will\s+(be\s+approved|qualify|get\s+approved)\b/gi, replacement: 'you may be able to explore options' },
  { pattern: /\b(instant|automatic|assured)\s+approval\b/gi, replacement: 'an initial conversation about your options' },
  { pattern: /\bno\s+risk\b/gi, replacement: 'lower-pressure' },
  { pattern: /\b100%\s*(approval|success)\b/gi, replacement: 'a personalised review' },
  { pattern: /\bpre-?approved\s+for\s+sure\b/gi, replacement: 'potentially eligible to apply' },
];

/**
 * Scan text for non-compliant promises.
 * @returns {{compliant: boolean, issues: string[]}}
 */
export function checkCompliance(text) {
  const issues = [];
  for (const { pattern } of BANNED_PATTERNS) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text || '');
    if (match) issues.push(`Avoid "${match[0]}" — never promise approvals or outcomes.`);
  }
  return { compliant: issues.length === 0, issues };
}

/**
 * Rewrite text so it no longer promises outcomes. Used as a safety net over
 * generated content; templates are already written compliantly.
 */
export function sanitise(text) {
  let out = text || '';
  for (const { pattern, replacement } of BANNED_PATTERNS) {
    pattern.lastIndex = 0;
    out = out.replace(pattern, replacement);
  }
  return out;
}

/** Append the standard disclaimer when a piece is customer-facing. */
export function withDisclaimer(text) {
  return `${sanitise(text)}\n\n${DISCLAIMER}`;
}
