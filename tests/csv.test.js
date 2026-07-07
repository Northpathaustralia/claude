// Round-trip tests for the CSV import/export helpers.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toCSV, parseCSV, rowToLead, LEAD_COLUMNS } from '../src/utils/csv.js';

test('leads survive a CSV export → import round trip', () => {
  const lead = {
    name: 'Comma, "Quoted" Carl',
    phone: '0400 000 000',
    email: 'carl@example.com',
    suburb: 'Ipswich',
    postcode: '4305',
    state: 'QLD',
    employment: 'PAYG Full-Time',
    income: 150000,
    partnerIncome: 0,
    monthlyUnsecuredDebt: 500,
    buyingTimeframe: '6-12 months',
    creditProfile: 'Clean',
    source: 'Website',
    status: 'New',
    owner: 'James',
    nextFollowUp: '2026-07-10',
    notes: 'Line one\nline two',
    createdAt: '2026-07-07T09:00:00',
  };
  const csv = toCSV([lead], LEAD_COLUMNS);
  const [row] = parseCSV(csv);
  const back = rowToLead(row);
  assert.equal(back.name, lead.name);
  assert.equal(back.income, 150000);
  assert.equal(back.notes, lead.notes);
  assert.equal(back.nextFollowUp, lead.nextFollowUp);
});

test('parseCSV handles empty input gracefully', () => {
  assert.deepEqual(parseCSV(''), []);
  assert.deepEqual(parseCSV('Name\n'), []);
});
