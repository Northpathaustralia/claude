import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sentimentFromRating,
  shouldAlert,
  escapeHtml,
  toCSV,
  isValidHttpsUrl,
  validateBusinessConfig,
  validateFeedbackInput,
  computeStats,
  alertQueue,
  makeFeedbackEntry,
  totalGoogleClicks,
} from '../src/logic.js';

test('sentimentFromRating buckets ratings correctly', () => {
  assert.equal(sentimentFromRating(5), 'positive');
  assert.equal(sentimentFromRating(4), 'positive');
  assert.equal(sentimentFromRating(3), 'neutral');
  assert.equal(sentimentFromRating(2), 'negative');
  assert.equal(sentimentFromRating(1), 'negative');
  assert.equal(sentimentFromRating(NaN), 'neutral');
});

test('shouldAlert fires at/below the configured threshold', () => {
  assert.equal(shouldAlert(3, 3), true);
  assert.equal(shouldAlert(2, 3), true);
  assert.equal(shouldAlert(4, 3), false);
  assert.equal(shouldAlert('not-a-number', 3), false);
});

test('escapeHtml neutralises HTML/script payloads', () => {
  const payload = '<img src=x onerror=alert(1)>&"\'';
  const escaped = escapeHtml(payload);
  assert.ok(!escaped.includes('<img'));
  assert.equal(
    escaped,
    '&lt;img src=x onerror=alert(1)&gt;&amp;&quot;&#39;',
  );
});

test('toCSV neutralises formula-injection payloads and quotes fields', () => {
  const entries = [
    makeFeedbackEntry({ rating: 1, comment: '=cmd|"/c calc"!A1', name: 'Bad, Actor', contact: 'x@y.com' }),
  ];
  const csv = toCSV(entries);
  assert.ok(csv.includes("'=cmd"), 'formula prefix should be neutralised with a leading quote');
  assert.ok(csv.includes('"Bad, Actor"'), 'commas inside a field must stay inside quotes');
});

test('isValidHttpsUrl rejects non-https and script URIs', () => {
  assert.equal(isValidHttpsUrl('https://g.page/r/example/review'), true);
  assert.equal(isValidHttpsUrl('http://g.page/r/example/review'), false);
  assert.equal(isValidHttpsUrl('javascript:alert(1)'), false);
  assert.equal(isValidHttpsUrl('not a url'), false);
});

test('validateBusinessConfig catches bad input', () => {
  const bad = validateBusinessConfig({
    name: '',
    googleReviewUrl: 'javascript:alert(1)',
    alertEmail: 'not-an-email',
    alertThreshold: 9,
    pin: '12',
  });
  assert.equal(bad.valid, false);
  assert.ok(bad.errors.name);
  assert.ok(bad.errors.googleReviewUrl);
  assert.ok(bad.errors.alertEmail);
  assert.ok(bad.errors.alertThreshold);
  assert.ok(bad.errors.pin);

  const good = validateBusinessConfig({
    name: 'Northpath Mortgage',
    googleReviewUrl: 'https://g.page/r/example/review',
    alertEmail: 'owner@example.com',
    alertThreshold: 3,
    pin: '4821',
  });
  assert.equal(good.valid, true);
});

test('validateFeedbackInput enforces rating range and length limits', () => {
  assert.equal(validateFeedbackInput({ rating: 0 }).valid, false);
  assert.equal(validateFeedbackInput({ rating: 6 }).valid, false);
  assert.equal(validateFeedbackInput({ rating: 3 }).valid, true);
  assert.equal(validateFeedbackInput({ rating: 3, comment: 'x'.repeat(2001) }).valid, false);
});

test('computeStats aggregates sentiment, average and click-through rate', () => {
  const entries = [
    makeFeedbackEntry({ rating: 5, googleClicked: true }),
    makeFeedbackEntry({ rating: 5, googleClicked: true }),
    makeFeedbackEntry({ rating: 2, googleClicked: false }),
    makeFeedbackEntry({ rating: 3, googleClicked: false }),
  ];
  const stats = computeStats(entries);
  assert.equal(stats.count, 4);
  assert.equal(stats.avgRating, 3.8);
  assert.equal(stats.positive, 2);
  assert.equal(stats.neutral, 1);
  assert.equal(stats.negative, 1);
  assert.equal(stats.googleClicks, 2);
  assert.equal(stats.clickThroughRate, 50);
});

test('computeStats handles an empty entry list without dividing by zero', () => {
  const stats = computeStats([]);
  assert.equal(stats.count, 0);
  assert.equal(stats.avgRating, 0);
  assert.equal(stats.clickThroughRate, 0);
});

test('alertQueue returns unacknowledged low-rating entries, newest first', () => {
  const older = { ...makeFeedbackEntry({ rating: 1 }), timestamp: '2026-01-01T00:00:00.000Z' };
  const newer = { ...makeFeedbackEntry({ rating: 2 }), timestamp: '2026-01-02T00:00:00.000Z' };
  const acked = { ...makeFeedbackEntry({ rating: 1 }), acknowledged: true };
  const happy = makeFeedbackEntry({ rating: 5 });
  const queue = alertQueue([older, newer, acked, happy], 3);
  assert.equal(queue.length, 2);
  assert.equal(queue[0].id, newer.id);
  assert.equal(queue[1].id, older.id);
});

test('totalGoogleClicks combines attributed entry clicks with standalone clicks', () => {
  const entries = [
    makeFeedbackEntry({ rating: 5, googleClicked: true }),
    makeFeedbackEntry({ rating: 4, googleClicked: false }),
  ];
  assert.equal(totalGoogleClicks(entries, 3), 4); // 1 attributed + 3 standalone
  assert.equal(totalGoogleClicks([], 0), 0);
  assert.equal(totalGoogleClicks([], -5), 0, 'negative standalone counts must not go negative');
});

test('makeFeedbackEntry trims text fields and derives sentiment', () => {
  const entry = makeFeedbackEntry({ rating: 4, comment: '  great job  ', name: '  Jo  ' });
  assert.equal(entry.comment, 'great job');
  assert.equal(entry.name, 'Jo');
  assert.equal(entry.sentiment, 'positive');
  assert.equal(entry.acknowledged, false);
  assert.ok(entry.id);
  assert.ok(entry.timestamp);
});
