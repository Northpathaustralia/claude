// Integration-style tests across the AI employee modules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reviewLeads, recommendNextAction, draftFollowUp } from '../src/ai/salesAssistant.js';
import { overdueFollowUps, suggestFollowUpDate, unscheduledLeads } from '../src/ai/crmManager.js';
import { suggestReconnects, partnerStrength } from '../src/ai/referralManager.js';
import { computeKPIs, leadSourcePerformance, suggestImprovements } from '../src/ai/businessAnalyst.js';
import { buildTodaysPlan } from '../src/ai/operationsAssistant.js';
import { generateDailyContent, buildContentCalendar, analyseContentPerformance } from '../src/ai/marketingManager.js';
import { checkCompliance } from '../src/utils/compliance.js';

const TODAY = '2026-07-07';

const LEADS = [
  {
    id: 'l1', name: 'Olivia Overdue', status: 'Contacted', nextFollowUp: '2026-07-01',
    income: 160000, employment: 'PAYG Full-Time', creditProfile: 'Clean',
    buyingTimeframe: '3-6 months', monthlyUnsecuredDebt: 100, suburb: 'Ipswich', postcode: '4305',
    source: 'Facebook', createdAt: '2026-07-06T09:00:00',
  },
  {
    id: 'l2', name: 'New Nick', status: 'New', nextFollowUp: null,
    income: 155000, employment: 'PAYG Full-Time', creditProfile: 'Clean',
    buyingTimeframe: '0-3 months', monthlyUnsecuredDebt: 0, suburb: 'Melton', postcode: '3337',
    source: 'Website', createdAt: '2026-07-07T08:00:00',
  },
  {
    id: 'l3', name: 'Booked Bella', status: 'Consultation Booked', nextFollowUp: '2026-07-08',
    income: 150000, employment: 'PAYG Full-Time', creditProfile: 'Clean',
    buyingTimeframe: '0-3 months', monthlyUnsecuredDebt: 200, suburb: 'Salisbury', postcode: '5108',
    source: 'Website', createdAt: '2026-07-05T08:00:00',
  },
];

const PARTNERS = [
  { id: 'p1', name: 'Fresh Fran', type: 'Accountant', totalReferrals: 0, lastMeeting: null, lastReferral: null },
  { id: 'p2', name: 'Steady Stan', type: 'Mortgage Broker', totalReferrals: 5, lastMeeting: '2026-03-01', lastReferral: '2026-03-01' },
];

test('sales assistant ranks the overdue lead first', () => {
  const review = reviewLeads(LEADS, TODAY);
  assert.equal(review[0].lead.id, 'l1');
  assert.equal(review[0].overdue, true);
});

test('next action reflects overdue state and follow-up drafts stay compliant', () => {
  assert.match(recommendNextAction(LEADS[0], TODAY), /overdue/i);
  for (const channel of ['sms', 'email']) {
    const draft = draftFollowUp(LEADS[0], channel);
    assert.equal(checkCompliance(draft).compliant, true, `${channel} draft must be compliant`);
    assert.match(draft, /Olivia/);
  }
});

test('CRM manager finds overdue and unscheduled leads and suggests future dates', () => {
  assert.deepEqual(overdueFollowUps(LEADS, TODAY).map((l) => l.id), ['l1']);
  assert.deepEqual(unscheduledLeads(LEADS).map((l) => l.id), ['l2']);
  assert.ok(suggestFollowUpDate(LEADS[1], TODAY) > TODAY);
});

test('referral manager suggests never-contacted partner first', () => {
  const suggestions = suggestReconnects(PARTNERS, TODAY);
  assert.equal(suggestions[0].partner.id, 'p1');
  assert.equal(partnerStrength(PARTNERS[1]), 'strong');
});

test('business analyst computes KPIs and source performance', () => {
  const kpis = computeKPIs(LEADS, '2026-07-01');
  assert.equal(kpis.newLeads, 3);
  assert.equal(kpis.consultationsBooked, 1);
  assert.ok(kpis.averageLeadScore > 0);
  const sources = leadSourcePerformance(LEADS);
  assert.equal(sources[0].source, 'Website');
  assert.ok(suggestImprovements({ leads: LEADS, partners: PARTNERS, contentItems: [] }, TODAY).length > 0);
});

test('operations assistant puts overdue follow-up at the top of today\'s plan', () => {
  const plan = buildTodaysPlan({ leads: LEADS, partners: PARTNERS, tasks: [] }, TODAY);
  assert.ok(plan.length > 0);
  assert.equal(plan[0].priority, 'High');
  assert.match(plan[0].title, /Olivia Overdue/);
});

test('marketing manager generates a complete, compliant, deterministic pack', () => {
  const pack = generateDailyContent(TODAY);
  assert.equal(pack.videoIdeas.length, 3);
  assert.equal(pack.questionResponses.length, 5);
  assert.equal(pack.dmDrafts.length, 5);
  assert.ok(pack.facebookPost && pack.linkedinPost && pack.article.title && pack.newsletter.subject && pack.faq.question);
  for (const text of [pack.facebookPost, pack.linkedinPost, pack.newsletter.body, ...pack.dmDrafts]) {
    assert.equal(checkCompliance(text).compliant, true);
  }
  // Deterministic: same date → same pack.
  assert.deepEqual(generateDailyContent(TODAY), pack);
  assert.equal(buildContentCalendar(TODAY, 14).length, 14);
});

test('content performance weights leads over engagement', () => {
  const ranked = analyseContentPerformance([
    { theme: 'A', engagements: 500, leadsAttributed: 0 },
    { theme: 'B', engagements: 100, leadsAttributed: 50 },
  ]);
  assert.equal(ranked[0].theme, 'B');
});
