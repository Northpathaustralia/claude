// ---------------------------------------------------------------------------
// Commission & trail reconciliation engine.
//
// Pure functions only — no DOM, no network, no globals — so this file runs
// unmodified in the browser (as an ES module) and under `node --test`.
// Everything here is arithmetic over data the broker already holds; it does
// not recommend a lender or product, so it stays outside NCCP credit-
// assistance / Best Interests Duty territory. See ../01-mvp-design.md.
// ---------------------------------------------------------------------------

const VALID_STATUSES = new Set(['active', 'discharged', 'refinanced']);
const DEFAULT_TOLERANCE = 2;
const TRAIL_GRACE_MONTHS = 1;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Round to cents, avoiding binary float noise (e.g. 0.1 + 0.2). */
export function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Escape a value for a CSV cell, and defuse spreadsheet formula injection.
 * Loan/client names in the export come from the broker's uploaded CSV, which may
 * itself have been populated from an untrusted source upstream (a web lead form, a
 * client-supplied intake). A cell starting with =, +, -, @, tab or CR is executed as
 * a formula by Excel/Sheets on open, so it's neutralised with a leading apostrophe —
 * the standard mitigation (OWASP "CSV Injection").
 */
function esc(value) {
  if (value === null || value === undefined) return '';
  let s = String(value);
  // Only string-typed fields (loan ref, client, lender, ...) carry injected text from
  // the broker's CSV — numeric fields (expected/paid/variance) are computed internally
  // and must stay real numbers, so a negative variance like -50 isn't mistaken for one.
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * Minimal CSV parser (handles quoted cells, escaped quotes, \n and \r\n).
 * Returns an array of row objects keyed by trimmed header text.
 */
export function parseCSV(text) {
  const rows = [];
  let cell = '';
  let row = [];
  let inQuotes = false;
  const pushCell = () => { row.push(cell); cell = ''; };
  const pushRow = () => { if (row.length > 1 || row[0] !== '') rows.push(row); row = []; };

  const src = text || '';
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cell += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') pushCell();
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      pushCell();
      pushRow();
    } else cell += ch;
  }
  if (cell !== '' || row.length) { pushCell(); pushRow(); }
  if (rows.length < 2) return [];

  const [header, ...body] = rows;
  const keys = header.map((h) => h.trim());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] || '').trim()])));
}

/** Normalise a header/label so column matching is case- and spacing-insensitive. */
function normaliseKey(k) {
  return String(k || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
}

/** Look up a value from a row using a normalised field name, regardless of the row's own casing. */
function field(row, name) {
  for (const key of Object.keys(row)) {
    if (normaliseKey(key) === name) return row[key];
  }
  return undefined;
}

/** Parse a money-ish string. Accepts "$1,234.50" and accounting-style negatives "(1,234.50)". */
function toNumber(v) {
  if (v === undefined || v === null || String(v).trim() === '') return NaN;
  let s = String(v).trim();
  const isParenNegative = /^\(.*\)$/.test(s);
  s = s.replace(/[$,()]/g, '');
  const n = Number(s);
  return isParenNegative ? -n : n;
}

/** Whole months elapsed from `a` to `b` (both 'YYYY-MM-DD'), floored, 0 if b <= a or invalid. */
export function monthsBetween(a, b) {
  if (!DATE_RE.test(a) || !DATE_RE.test(b)) return 0;
  const da = new Date(`${a}T00:00:00Z`);
  const db = new Date(`${b}T00:00:00Z`);
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime()) || db <= da) return 0;
  let months = (db.getUTCFullYear() - da.getUTCFullYear()) * 12 + (db.getUTCMonth() - da.getUTCMonth());
  if (db.getUTCDate() < da.getUTCDate()) months -= 1;
  return Math.max(0, months);
}

/**
 * Parse the loan book CSV.
 * Columns (any order, case-insensitive): loan_ref, client_name, lender,
 * settlement_date, loan_amount, upfront_rate_pct, trail_rate_pct, status.
 * @returns {{loans: object[], warnings: string[]}}
 */
export function parseLoanBook(text) {
  const rows = parseCSV(text);
  const loans = [];
  const warnings = [];
  const seenRefs = new Set();

  rows.forEach((row, i) => {
    const line = i + 2; // account for the header row
    const loanRef = String(field(row, 'loan_ref') || '').trim();
    if (!loanRef) { warnings.push(`Row ${line}: missing loan_ref — skipped.`); return; }
    if (seenRefs.has(loanRef.toLowerCase())) {
      warnings.push(`Row ${line}: duplicate loan_ref "${loanRef}" — first occurrence kept, this row skipped.`);
      return;
    }

    const loanAmount = toNumber(field(row, 'loan_amount'));
    const upfrontRatePct = toNumber(field(row, 'upfront_rate_pct'));
    const trailRatePct = toNumber(field(row, 'trail_rate_pct'));
    const settlementDate = String(field(row, 'settlement_date') || '').trim();

    if (!Number.isFinite(loanAmount) || loanAmount < 0) {
      warnings.push(`Row ${line} (${loanRef}): invalid loan_amount — skipped.`); return;
    }
    if (!Number.isFinite(upfrontRatePct) || upfrontRatePct < 0) {
      warnings.push(`Row ${line} (${loanRef}): invalid upfront_rate_pct — skipped.`); return;
    }
    if (!Number.isFinite(trailRatePct) || trailRatePct < 0) {
      warnings.push(`Row ${line} (${loanRef}): invalid trail_rate_pct — skipped.`); return;
    }
    if (settlementDate && !DATE_RE.test(settlementDate)) {
      warnings.push(`Row ${line} (${loanRef}): settlement_date not in YYYY-MM-DD format — trail coverage-gap check will be skipped for this loan.`);
    }

    let status = String(field(row, 'status') || 'active').trim().toLowerCase();
    if (!VALID_STATUSES.has(status)) {
      warnings.push(`Row ${line} (${loanRef}): unrecognised status "${status || '(blank)'}" — treated as "active".`);
      status = 'active';
    }

    seenRefs.add(loanRef.toLowerCase());
    loans.push({
      loanRef,
      clientName: String(field(row, 'client_name') || '').trim(),
      lender: String(field(row, 'lender') || '').trim(),
      settlementDate: DATE_RE.test(settlementDate) ? settlementDate : '',
      loanAmount,
      upfrontRatePct,
      trailRatePct,
      status,
    });
  });

  return { loans, warnings };
}

/**
 * Parse the aggregator statement CSV.
 * Columns (any order, case-insensitive): loan_ref, lender, payment_date, type, amount.
 * @returns {{lines: object[], warnings: string[]}}
 */
export function parseStatement(text) {
  const rows = parseCSV(text);
  const lines = [];
  const warnings = [];

  rows.forEach((row, i) => {
    const lineNo = i + 2;
    const loanRef = String(field(row, 'loan_ref') || '').trim();
    if (!loanRef) { warnings.push(`Row ${lineNo}: missing loan_ref — skipped.`); return; }

    const amount = toNumber(field(row, 'amount'));
    if (!Number.isFinite(amount)) {
      warnings.push(`Row ${lineNo} (${loanRef}): invalid amount — skipped.`); return;
    }

    let type = String(field(row, 'type') || '').trim().toLowerCase();
    if (type !== 'upfront' && type !== 'trail') {
      warnings.push(`Row ${lineNo} (${loanRef}): type must be "upfront" or "trail" — skipped.`); return;
    }

    const paymentDate = String(field(row, 'payment_date') || '').trim();
    if (paymentDate && !DATE_RE.test(paymentDate)) {
      warnings.push(`Row ${lineNo} (${loanRef}): payment_date not in YYYY-MM-DD format — ignored for date-based checks.`);
    }

    lines.push({
      loanRef,
      lender: String(field(row, 'lender') || '').trim(),
      paymentDate: DATE_RE.test(paymentDate) ? paymentDate : '',
      type,
      amount,
    });
  });

  return { lines, warnings };
}

function classify(expected, paid, tolerance) {
  const variance = round2(paid - expected);
  if (Math.abs(variance) <= tolerance) return { status: 'ok', variance };
  if (variance < 0) return { status: paid <= 0 ? 'missing' : 'short', variance };
  return { status: 'over', variance };
}

/**
 * Reconcile a parsed loan book against parsed statement lines.
 *
 * The trail coverage-gap check needs a reference "as of" date. If `options.asOfDate`
 * is omitted it falls back to the latest `payment_date` found in `lines` — which is
 * empty (and so silently skips every coverage-gap check) if the statement has no
 * usable dates at all. Callers should pass today's date explicitly rather than rely
 * on the fallback; this function stays a pure function of its inputs and does not
 * read the system clock itself.
 * @param {object[]} loans
 * @param {object[]} lines
 * @param {{tolerance?: number, asOfDate?: string}} [options]
 * @returns {{rows: object[], summary: object}}
 */
export function reconcile(loans, lines, options = {}) {
  const tolerance = options.tolerance ?? DEFAULT_TOLERANCE;
  const asOfDate = options.asOfDate
    || lines.reduce((max, l) => (l.paymentDate && l.paymentDate > max ? l.paymentDate : max), '');

  const byRef = new Map();
  for (const loan of loans) byRef.set(loan.loanRef.toLowerCase(), loan);

  const linesByRef = new Map();
  for (const line of lines) {
    const key = line.loanRef.toLowerCase();
    if (!linesByRef.has(key)) linesByRef.set(key, []);
    linesByRef.get(key).push(line);
  }

  const rows = [];

  for (const loan of loans) {
    const key = loan.loanRef.toLowerCase();
    const loanLines = linesByRef.get(key) || [];
    const base = { loanRef: loan.loanRef, clientName: loan.clientName, lender: loan.lender };

    // Upfront: all upfront lines for this loan are summed (split payouts happen).
    const expectedUpfront = round2(loan.loanAmount * (loan.upfrontRatePct / 100));
    const upfrontLines = loanLines.filter((l) => l.type === 'upfront');
    const paidUpfront = round2(upfrontLines.reduce((sum, l) => sum + l.amount, 0));
    const upfrontResult = classify(expectedUpfront, paidUpfront, tolerance);
    rows.push({
      ...base,
      kind: 'upfront',
      paymentDate: upfrontLines[upfrontLines.length - 1]?.paymentDate || '',
      expected: expectedUpfront,
      paid: paidUpfront,
      ...upfrontResult,
    });

    // Trail: active loans only accrue trail.
    const trailLines = loanLines.filter((l) => l.type === 'trail');
    const expectedTrailPerPeriod = round2(loan.loanAmount * (loan.trailRatePct / 100) / 12);

    if (trailLines.length > 0) {
      for (const line of trailLines) {
        const expected = loan.status === 'active' ? expectedTrailPerPeriod : 0;
        const result = classify(expected, round2(line.amount), tolerance);
        rows.push({
          ...base, kind: 'trail', paymentDate: line.paymentDate,
          expected, paid: round2(line.amount), ...result,
        });
      }
    } else if (loan.status === 'active' && loan.trailRatePct > 0 && loan.settlementDate && asOfDate) {
      const monthsElapsed = monthsBetween(loan.settlementDate, asOfDate);
      const expectedMonths = Math.max(0, monthsElapsed - TRAIL_GRACE_MONTHS);
      if (expectedMonths > 0) {
        const expected = round2(expectedTrailPerPeriod * expectedMonths);
        rows.push({
          ...base, kind: 'trail', paymentDate: '',
          expected, paid: 0, status: 'coverage_gap', variance: -expected,
          periodsAffected: expectedMonths,
        });
      }
    }
  }

  // Statement lines that don't match any loan in the book at all.
  for (const line of lines) {
    if (!byRef.has(line.loanRef.toLowerCase())) {
      rows.push({
        loanRef: line.loanRef, clientName: '', lender: line.lender, kind: line.type,
        paymentDate: line.paymentDate, expected: 0, paid: round2(line.amount),
        status: 'unmatched', variance: round2(line.amount),
      });
    }
  }

  rows.sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance));

  const totalExpected = round2(rows.reduce((s, r) => s + r.expected, 0));
  const totalReceived = round2(rows.reduce((s, r) => s + r.paid, 0));
  const totalVariance = round2(rows.reduce((s, r) => s + r.variance, 0));
  const countByStatus = rows.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return {
    rows,
    summary: {
      totalExpected,
      totalReceived,
      totalVariance,
      variancePct: totalExpected > 0 ? round2((totalVariance / totalExpected) * 100) : 0,
      countByStatus,
      asOfDate,
    },
  };
}

/** Serialise reconciliation rows to a CSV a broker can attach to an aggregator query. */
export function toDiscrepancyCSV(rows) {
  const columns = [
    ['loanRef', 'Loan Ref'], ['clientName', 'Client'], ['lender', 'Lender'],
    ['kind', 'Type'], ['status', 'Status'], ['paymentDate', 'Payment Date'],
    ['expected', 'Expected'], ['paid', 'Paid'], ['variance', 'Variance'],
  ];
  const header = columns.map(([, label]) => esc(label)).join(',');
  const body = rows.map((r) => columns.map(([key]) => esc(r[key])).join(','));
  return [header, ...body].join('\n');
}
