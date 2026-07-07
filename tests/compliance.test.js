// Unit tests for the compliance guard.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkCompliance, sanitise, withDisclaimer, DISCLAIMER } from '../src/utils/compliance.js';

test('flags guaranteed-approval language', () => {
  const { compliant, issues } = checkCompliance('Apply now for guaranteed approval!');
  assert.equal(compliant, false);
  assert.ok(issues.length > 0);
});

test('passes educational wording', () => {
  const { compliant } = checkCompliance(
    'Outcomes depend on your individual circumstances — consider professional advice.',
  );
  assert.equal(compliant, true);
});

test('sanitise rewrites banned phrases so the result is compliant', () => {
  const dirty = 'We guarantee you will be approved — instant approval, no risk!';
  const clean = sanitise(dirty);
  assert.equal(checkCompliance(clean).compliant, true);
});

test('withDisclaimer appends the standard disclaimer', () => {
  const out = withDisclaimer('Some educational content.');
  assert.ok(out.endsWith(DISCLAIMER));
});
