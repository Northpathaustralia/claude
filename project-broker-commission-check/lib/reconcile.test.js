import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCSV, parseLoanBook, parseStatement, reconcile, toDiscrepancyCSV, monthsBetween, round2,
} from './reconcile.js';

// --- parseCSV -----------------------------------------------------------

test('parseCSV handles quoted commas and empty input', () => {
  const csv = 'a,b\n"Comma, Carl",5\n';
  assert.deepEqual(parseCSV(csv), [{ a: 'Comma, Carl', b: '5' }]);
  assert.deepEqual(parseCSV(''), []);
  assert.deepEqual(parseCSV('a,b\n'), []);
});

// --- parseLoanBook --------------------------------------------------------

test('parseLoanBook parses a valid row and is header-order/case-insensitive', () => {
  const csv = 'Loan_Ref,Client Name,Lender,Settlement_Date,Loan_Amount,Upfront_Rate_Pct,Trail_Rate_Pct,Status\n'
    + 'L1,Jane Doe,ANZ,2025-01-15,500000,0.65,0.15,active\n';
  const { loans, warnings } = parseLoanBook(csv);
  assert.equal(warnings.length, 0);
  assert.equal(loans.length, 1);
  assert.deepEqual(loans[0], {
    loanRef: 'L1', clientName: 'Jane Doe', lender: 'ANZ', settlementDate: '2025-01-15',
    loanAmount: 500000, upfrontRatePct: 0.65, trailRatePct: 0.15, status: 'active',
  });
});

test('parseLoanBook skips rows missing loan_ref, invalid numbers, and drops duplicates', () => {
  const csv = 'loan_ref,loan_amount,upfront_rate_pct,trail_rate_pct\n'
    + ',500000,0.65,0.15\n'
    + 'L1,not_a_number,0.65,0.15\n'
    + 'L2,500000,0.65,0.15\n'
    + 'L2,400000,0.65,0.15\n';
  const { loans, warnings } = parseLoanBook(csv);
  assert.equal(loans.length, 1);
  assert.equal(loans[0].loanRef, 'L2');
  assert.equal(loans[0].loanAmount, 500000);
  assert.equal(warnings.length, 3);
});

test('parseLoanBook defaults an unrecognised status to active with a warning', () => {
  const csv = 'loan_ref,loan_amount,upfront_rate_pct,trail_rate_pct,status\nL1,500000,0.65,0.15,paid_off\n';
  const { loans, warnings } = parseLoanBook(csv);
  assert.equal(loans[0].status, 'active');
  assert.match(warnings[0], /unrecognised status/);
});

// --- parseStatement ---------------------------------------------------------

test('parseStatement skips rows with an invalid type or missing loan_ref', () => {
  const csv = 'loan_ref,type,amount,payment_date\n'
    + 'L1,upfront,3250,2025-02-01\n'
    + 'L2,bonus,100,2025-02-01\n'
    + ',trail,50,2025-02-01\n';
  const { lines, warnings } = parseStatement(csv);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].loanRef, 'L1');
  assert.equal(warnings.length, 2);
});

test('parseStatement reads accounting-style parenthesised negatives (clawbacks)', () => {
  const csv = 'loan_ref,type,amount\nL1,trail,"(45.50)"\n';
  const { lines, warnings } = parseStatement(csv);
  assert.equal(warnings.length, 0);
  assert.equal(lines[0].amount, -45.5);
});

// --- monthsBetween ------------------------------------------------------

test('monthsBetween counts whole months and floors partial months', () => {
  assert.equal(monthsBetween('2025-01-15', '2025-07-15'), 6);
  assert.equal(monthsBetween('2025-01-15', '2025-07-10'), 5); // day hasn't come around yet
  assert.equal(monthsBetween('2025-01-15', '2025-01-20'), 0);
  assert.equal(monthsBetween('2025-07-15', '2025-01-15'), 0); // b before a
  assert.equal(monthsBetween('not-a-date', '2025-01-15'), 0);
});

// --- reconcile ------------------------------------------------------------

function loan(overrides = {}) {
  return {
    loanRef: 'L1', clientName: 'Jane Doe', lender: 'ANZ', settlementDate: '2025-01-01',
    loanAmount: 500000, upfrontRatePct: 0.65, trailRatePct: 0.15, status: 'active',
    ...overrides,
  };
}

test('exact upfront + trail payments reconcile as ok', () => {
  const loans = [loan()];
  const lines = [
    { loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-01-20', type: 'upfront', amount: 3250 },
    { loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-02-20', type: 'trail', amount: 62.5 },
  ];
  const { rows, summary } = reconcile(loans, lines, { asOfDate: '2025-02-20' });
  assert.ok(rows.every((r) => r.status === 'ok'));
  assert.equal(summary.totalVariance, 0);
});

test('missing upfront payment is flagged with the full expected amount', () => {
  const { rows } = reconcile([loan()], [], { asOfDate: '2025-01-01' });
  const upfront = rows.find((r) => r.kind === 'upfront');
  assert.equal(upfront.status, 'missing');
  assert.equal(upfront.expected, 3250);
  assert.equal(upfront.paid, 0);
  assert.equal(upfront.variance, -3250);
});

test('short upfront payment beyond tolerance is flagged; within tolerance is ok', () => {
  const lines = [{ loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-01-20', type: 'upfront', amount: 3200 }];
  const { rows } = reconcile([loan()], lines, { asOfDate: '2025-01-20' });
  const upfront = rows.find((r) => r.kind === 'upfront');
  assert.equal(upfront.status, 'short');
  assert.equal(upfront.variance, -50);

  const linesClose = [{ loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-01-20', type: 'upfront', amount: 3249 }];
  const closeResult = reconcile([loan()], linesClose, { asOfDate: '2025-01-20' });
  assert.equal(closeResult.rows.find((r) => r.kind === 'upfront').status, 'ok');
});

test('overpaid upfront is flagged as over, not silently accepted', () => {
  const lines = [{ loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-01-20', type: 'upfront', amount: 4000 }];
  const { rows } = reconcile([loan()], lines, { asOfDate: '2025-01-20' });
  const upfront = rows.find((r) => r.kind === 'upfront');
  assert.equal(upfront.status, 'over');
  assert.equal(upfront.variance, 750);
});

test('split upfront payouts across two statement lines sum correctly', () => {
  const lines = [
    { loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-01-20', type: 'upfront', amount: 1625 },
    { loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-02-05', type: 'upfront', amount: 1625 },
  ];
  const { rows } = reconcile([loan()], lines, { asOfDate: '2025-02-05' });
  const upfront = rows.find((r) => r.kind === 'upfront');
  assert.equal(upfront.status, 'ok');
  assert.equal(upfront.paid, 3250);
});

test('active loan with zero trail lines after the grace period is a coverage gap, not per-line missing rows', () => {
  const { rows } = reconcile([loan()], [
    { loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-01-20', type: 'upfront', amount: 3250 },
  ], { asOfDate: '2025-07-01' }); // 6 months elapsed, 1 grace month => 5 months expected
  const trail = rows.find((r) => r.kind === 'trail');
  assert.equal(trail.status, 'coverage_gap');
  assert.equal(trail.periodsAffected, 5);
  assert.equal(trail.expected, round2(62.5 * 5));
});

test('a brand-new loan (within the grace period) has no coverage-gap row yet', () => {
  const { rows } = reconcile([loan()], [], { asOfDate: '2025-01-20' }); // < 1 month elapsed
  assert.equal(rows.some((r) => r.kind === 'trail'), false);
});

test('omitting asOfDate falls back to the latest statement payment_date', () => {
  const lines = [{ loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-08-01', type: 'upfront', amount: 3250 }];
  const { rows, summary } = reconcile([loan()], lines); // no options — settlement 2025-01-01
  assert.equal(summary.asOfDate, '2025-08-01');
  assert.equal(rows.find((r) => r.kind === 'trail').status, 'coverage_gap');
});

test('regression guard: with neither asOfDate nor any dated statement lines, the coverage-gap check is skipped, not guessed', () => {
  // Documents the trap flagged in 02-red-team-audit.md: a statement whose date column
  // isn't recognised (so every line has paymentDate === '') must not be silently treated
  // as "no trail owed" by a caller — callers (see app/index.template.html) must supply
  // asOfDate explicitly. This test locks in the *documented* fallback behaviour so a
  // future change can't quietly turn "skip" into "wrongly assume ok" instead.
  const lines = [{ loanRef: 'L1', lender: 'ANZ', paymentDate: '', type: 'upfront', amount: 3250 }];
  const { rows, summary } = reconcile([loan({ settlementDate: '2020-01-01' })], lines);
  assert.equal(summary.asOfDate, '');
  assert.equal(rows.some((r) => r.kind === 'trail'), false);
});

test('trail paid after a loan is discharged is flagged as an unexpected overpayment', () => {
  const lines = [{ loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-03-01', type: 'trail', amount: 60 }];
  const { rows } = reconcile([loan({ status: 'discharged' })], lines, { asOfDate: '2025-03-01' });
  const trail = rows.find((r) => r.kind === 'trail');
  assert.equal(trail.status, 'over');
  assert.equal(trail.expected, 0);
  assert.equal(trail.variance, 60);
});

test('a statement line for an unknown loan_ref is reported as unmatched, not dropped', () => {
  const lines = [{ loanRef: 'GHOST', lender: 'CBA', paymentDate: '2025-01-20', type: 'upfront', amount: 900 }];
  const { rows, summary } = reconcile([loan()], lines, { asOfDate: '2025-01-20' });
  const unmatched = rows.find((r) => r.status === 'unmatched');
  assert.ok(unmatched);
  assert.equal(unmatched.paid, 900);
  assert.equal(summary.totalReceived, 900); // still counted as money received overall
});

test('summary totals and variance % aggregate across all rows', () => {
  const loans = [loan({ loanRef: 'L1' }), loan({ loanRef: 'L2', loanAmount: 300000 })];
  const lines = [
    { loanRef: 'L1', lender: 'ANZ', paymentDate: '2025-01-20', type: 'upfront', amount: 3250 }, // ok
    { loanRef: 'L2', lender: 'ANZ', paymentDate: '2025-01-20', type: 'upfront', amount: 1000 }, // short (expected 1950)
  ];
  const { summary } = reconcile(loans, lines, { asOfDate: '2025-01-20' });
  assert.equal(summary.totalExpected, 3250 + 1950);
  assert.equal(summary.totalReceived, 3250 + 1000);
  assert.equal(summary.totalVariance, -950);
  assert.equal(summary.variancePct, round2((-950 / 5200) * 100));
  assert.equal(summary.countByStatus.ok, 1);
  assert.equal(summary.countByStatus.short, 1);
});

test('rows are sorted by absolute dollar impact, largest first', () => {
  const loans = [loan({ loanRef: 'L1' }), loan({ loanRef: 'L2', loanAmount: 100000 })];
  const { rows } = reconcile(loans, [], { asOfDate: '2025-01-01' }); // both missing upfront: 650 and 3250
  assert.equal(rows[0].loanRef, 'L1'); // 3250 > 650
});

// --- toDiscrepancyCSV -------------------------------------------------------

test('toDiscrepancyCSV neutralises formula-injection payloads in exported cells', () => {
  const rows = [{
    loanRef: 'L1', clientName: '=cmd|\'/c calc\'!A1', lender: '+SUM(A1:A9)', kind: 'upfront',
    status: 'short', paymentDate: '', expected: 100, paid: 50, variance: -50,
  }];
  const csv = toDiscrepancyCSV(rows);
  const parsed = parseCSV(csv);
  assert.equal(parsed[0]['Client'].startsWith("'="), true);
  assert.equal(parsed[0]['Lender'].startsWith("'+"), true);
});

test('toDiscrepancyCSV quotes commas in client names and round-trips through parseCSV', () => {
  const rows = [{
    loanRef: 'L1', clientName: 'Doe, Jane', lender: 'ANZ', kind: 'upfront', status: 'short',
    paymentDate: '2025-01-20', expected: 3250, paid: 3200, variance: -50,
  }];
  const csv = toDiscrepancyCSV(rows);
  const parsed = parseCSV(csv);
  assert.equal(parsed[0]['Client'], 'Doe, Jane');
  assert.equal(parsed[0]['Variance'], '-50');
});
