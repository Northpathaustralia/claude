import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  estimateBorrowingPower,
  validateEstimatorInput,
  sanitiseText,
  isValidEmail,
  escapeHtml,
  DISCLAIMER,
} from '../widget/loanloop.js';

test('estimateBorrowingPower returns a sane range for a typical household', () => {
  const result = estimateBorrowingPower({
    annualIncome: 140_000,
    monthlyDebts: 400,
    dependents: 1,
    deposit: 80_000,
  });
  assert.equal(result.valid, true);
  assert.ok(result.low > 0);
  assert.ok(result.high > result.low, 'high estimate must exceed low estimate');
  assert.ok(result.purchaseBudgetHigh > result.high, 'deposit must be added on top of the borrowing estimate');
  // Rounded to nearest $5,000
  assert.equal(result.low % 5000, 0);
  assert.equal(result.high % 5000, 0);
});

test('estimateBorrowingPower never goes negative when debts exceed income capacity', () => {
  const result = estimateBorrowingPower({
    annualIncome: 40_000,
    monthlyDebts: 5_000, // capitalised debt drag will exceed annual income
    dependents: 0,
    deposit: 0,
  });
  assert.equal(result.valid, true);
  assert.ok(result.low >= 0);
  assert.ok(result.high >= 0);
});

test('estimateBorrowingPower clamps the dependent adjustment instead of going unbounded', () => {
  const fewDependents = estimateBorrowingPower({ annualIncome: 150_000, monthlyDebts: 0, dependents: 2, deposit: 0 });
  const manyDependents = estimateBorrowingPower({ annualIncome: 150_000, monthlyDebts: 0, dependents: 5, deposit: 0 });
  const cappedDependents = estimateBorrowingPower({ annualIncome: 150_000, monthlyDebts: 0, dependents: 10, deposit: 0 });
  assert.ok(manyDependents.high <= fewDependents.high);
  // Capping at MAX_DEPENDENTS_COUNTED means 5 and 10 dependents produce identical multipliers.
  assert.equal(manyDependents.high, cappedDependents.high);
  assert.ok(cappedDependents.high > 0, 'multiplier floor must keep the estimate positive');
});

test('estimateBorrowingPower rejects invalid or out-of-range input', () => {
  const cases = [
    { annualIncome: -1, monthlyDebts: 0, dependents: 0, deposit: 0 },
    { annualIncome: NaN, monthlyDebts: 0, dependents: 0, deposit: 0 },
    { annualIncome: Infinity, monthlyDebts: 0, dependents: 0, deposit: 0 },
    { annualIncome: 100_000, monthlyDebts: -50, dependents: 0, deposit: 0 },
    { annualIncome: 100_000, monthlyDebts: 0, dependents: -1, deposit: 0 },
    { annualIncome: 100_000, monthlyDebts: 0, dependents: 1.5, deposit: 0 },
    { annualIncome: 100_000, monthlyDebts: 0, dependents: 0, deposit: -10 },
    { annualIncome: 100_000_000, monthlyDebts: 0, dependents: 0, deposit: 0 },
  ];
  for (const input of cases) {
    const result = estimateBorrowingPower(input);
    assert.equal(result.valid, false, `expected ${JSON.stringify(input)} to be invalid`);
    assert.ok(result.errors.length > 0);
  }
});

test('validateEstimatorInput reports every violated field, not just the first', () => {
  const errors = validateEstimatorInput({ annualIncome: -1, monthlyDebts: -1, dependents: -1, deposit: -1 });
  assert.equal(errors.length, 4);
});

test('sanitiseText strips guarantee-style claims but leaves ordinary text untouched', () => {
  assert.match(sanitiseText('We guarantee approval today!'), /^(?!.*guarantee).*$/i);
  assert.equal(sanitiseText('See what you could borrow'), 'See what you could borrow');
  assert.equal(sanitiseText(''), '');
  assert.equal(sanitiseText(null), '');
  assert.equal(sanitiseText(undefined), '');
});

test('sanitiseText catches every banned phrase variant', () => {
  const samples = [
    'Guaranteed approval for everyone',
    'we guarantee the best rate',
    'you will be approved instantly',
    'instant approval in minutes',
    'no risk to apply',
    '100% approval rate',
    'pre-approved for sure',
  ];
  for (const sample of samples) {
    const cleaned = sanitiseText(sample);
    assert.doesNotMatch(cleaned, /guarantee|instant approval|100%\s*approval|pre-?approved for sure|no risk|will be approved/i);
  }
});

test('isValidEmail accepts well-formed addresses and rejects malformed ones', () => {
  const valid = ['a@b.co', 'james.smith@northpath.com.au', 'user+tag@example.com'];
  const invalid = ['', 'not-an-email', '@example.com', 'user@', 'user@@example.com', 'user@example', 'a..b@example.com', 'a@b..com', '  '];
  for (const email of valid) assert.equal(isValidEmail(email), true, `expected ${email} to be valid`);
  for (const email of invalid) assert.equal(isValidEmail(email), false, `expected ${email} to be invalid`);
  assert.equal(isValidEmail(null), false);
  assert.equal(isValidEmail(42), false);
});

test('escapeHtml neutralises markup-significant characters', () => {
  assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  assert.equal(escapeHtml(`"'&`), '&quot;&#39;&amp;');
  assert.equal(escapeHtml(null), '');
  assert.equal(escapeHtml(undefined), '');
});

test('DISCLAIMER is present and non-empty (never allowed to be silently dropped)', () => {
  assert.ok(typeof DISCLAIMER === 'string' && DISCLAIMER.length > 40);
  assert.match(DISCLAIMER, /not credit advice/i);
});

test('module import has no DOM side effects under Node', () => {
  assert.equal(typeof document, 'undefined');
});
