// Unit tests for the AI Lead Scoring engine.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scoreLead, gradeForScore } from '../src/ai/leadScoring.js';
import { priorityForPrice, findSuburb, priorityForLead } from '../src/data/suburbs.js';

const IDEAL_LEAD = {
  name: 'Ideal Ida',
  income: 120000,
  partnerIncome: 80000,
  employment: 'PAYG Full-Time',
  monthlyUnsecuredDebt: 0,
  creditProfile: 'Clean',
  buyingTimeframe: '0-3 months',
  suburb: 'Ipswich',
  postcode: '4305',
};

test('ideal-profile lead scores A+', () => {
  const result = scoreLead(IDEAL_LEAD);
  assert.ok(result.score >= 85, `expected >= 85, got ${result.score}`);
  assert.equal(result.grade, 'A+');
  assert.equal(result.locationPriority, 'High');
});

test('bankruptcy and high debt drag the grade down to C or D', () => {
  const weak = {
    ...IDEAL_LEAD,
    income: 60000,
    partnerIncome: 0,
    employment: 'Not Currently Employed',
    monthlyUnsecuredDebt: 3000,
    creditProfile: 'Bankruptcy',
    buyingTimeframe: '2+ years',
    suburb: 'Sydney (Inner)',
    postcode: '2000',
  };
  const result = scoreLead(weak);
  assert.ok(result.score < 40, `expected < 40, got ${result.score}`);
  assert.equal(result.grade, 'D');
});

test('score is always within 0-100 and breakdown sums to the score', () => {
  const result = scoreLead({});
  assert.ok(result.score >= 0 && result.score <= 100);
  const sum = result.breakdown.reduce((a, b) => a + b.points, 0);
  // Rounding of individual factors may drift by a point or two from the total.
  assert.ok(Math.abs(sum - result.score) <= 3);
});

test('grade bands map correctly', () => {
  assert.equal(gradeForScore(90), 'A+');
  assert.equal(gradeForScore(75), 'A');
  assert.equal(gradeForScore(60), 'B');
  assert.equal(gradeForScore(45), 'C');
  assert.equal(gradeForScore(10), 'D');
});

test('suburb priority bands follow the $900k ceiling', () => {
  assert.equal(priorityForPrice(600000), 'High');
  assert.equal(priorityForPrice(850000), 'Medium');
  assert.equal(priorityForPrice(1200000), 'Low');
});

test('postcode lookup beats name lookup and unknown suburbs default Medium', () => {
  assert.equal(findSuburb({ postcode: '4305' }).suburb, 'Ipswich');
  assert.equal(findSuburb({ suburb: 'ipswich' }).postcode, '4305');
  assert.equal(priorityForLead({ suburb: 'Nowhereville', postcode: '9999' }), 'Medium');
});
