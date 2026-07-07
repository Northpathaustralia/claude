// ---------------------------------------------------------------------------
// AI Employee: Business Analyst.
//
// Computes KPIs, trends and bottleneck diagnostics from the raw lead /
// content / partner data, and turns them into plain-English improvement
// suggestions. All pure functions — the dashboard and reports pages render
// whatever this module returns.
// ---------------------------------------------------------------------------

import { OPEN_STATUSES } from '../domain/constants.js';
import { scoreLead } from '../ai/leadScoring.js';
import { todayISO, addDays, startOfWeek, monthKey } from '../utils/dates.js';
import { analyseContentPerformance } from '../ai/marketingManager.js';

const CONSULT_STATUSES = ['Consultation Booked', 'Consultation Completed', 'Converted'];

/** Core KPI block for a period beginning at sinceISO (inclusive). */
export function computeKPIs(leads, sinceISO) {
  const inPeriod = leads.filter((l) => (l.createdAt || '').slice(0, 10) >= sinceISO);
  const consultations = inPeriod.filter((l) => CONSULT_STATUSES.includes(l.status));
  const converted = inPeriod.filter((l) => l.status === 'Converted');
  const scores = inPeriod.map((l) => scoreLead(l).score);

  return {
    newLeads: inPeriod.length,
    consultationsBooked: consultations.length,
    conversions: converted.length,
    conversionRate: inPeriod.length ? consultations.length / inPeriod.length : 0,
    averageLeadScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
  };
}

/** Weekly KPIs (current ISO week) and monthly KPIs (current calendar month). */
export function periodKPIs(leads, today = todayISO()) {
  return {
    weekly: computeKPIs(leads, startOfWeek(today)),
    monthly: computeKPIs(leads, `${monthKey(today)}-01`),
  };
}

/** Lead counts and consultation-rate per source, best-performing first. */
export function leadSourcePerformance(leads) {
  const bySource = new Map();
  for (const lead of leads) {
    const key = lead.source || 'Unknown';
    const agg = bySource.get(key) || { source: key, leads: 0, consultations: 0 };
    agg.leads += 1;
    if (CONSULT_STATUSES.includes(lead.status)) agg.consultations += 1;
    bySource.set(key, agg);
  }
  return [...bySource.values()]
    .map((s) => ({ ...s, rate: s.leads ? s.consultations / s.leads : 0 }))
    .sort((a, b) => b.consultations - a.consultations || b.leads - a.leads);
}

/** Pipeline funnel: lead count per status, in pipeline order. */
export function pipelineByStatus(leads, statuses) {
  return statuses.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }));
}

/**
 * Estimated pipeline value: open leads weighted by grade. Deal value is a
 * configurable planning assumption, not a promise of revenue.
 */
export function pipelineValue(leads, valuePerConversion = 3000) {
  const GRADE_LIKELIHOOD = { 'A+': 0.5, A: 0.35, B: 0.2, C: 0.08, D: 0.02 };
  return leads
    .filter((l) => OPEN_STATUSES.includes(l.status))
    .reduce((sum, lead) => sum + GRADE_LIKELIHOOD[scoreLead(lead).grade] * valuePerConversion, 0);
}

/** New-lead counts for each of the trailing `weeks` weeks, oldest first. */
export function weeklyTrend(leads, weeks = 8, today = todayISO()) {
  const currentWeekStart = startOfWeek(today);
  return Array.from({ length: weeks }, (_, i) => {
    const start = addDays(currentWeekStart, -7 * (weeks - 1 - i));
    const end = addDays(start, 7);
    const count = leads.filter((l) => {
      const created = (l.createdAt || '').slice(0, 10);
      return created >= start && created < end;
    }).length;
    return { weekStart: start, count };
  });
}

/**
 * Bottleneck + improvement analysis. Returns plain-English suggestions,
 * ordered by impact, each tied to an observed number.
 */
export function suggestImprovements({ leads, partners, contentItems }, today = todayISO()) {
  const suggestions = [];
  const open = leads.filter((l) => OPEN_STATUSES.includes(l.status));

  const noFollowUp = open.filter((l) => !l.nextFollowUp);
  if (noFollowUp.length > 0) {
    suggestions.push({
      area: 'CRM discipline',
      insight: `${noFollowUp.length} open lead(s) have no next follow-up scheduled.`,
      action: 'Schedule a follow-up for every open lead — unscheduled leads quietly die.',
    });
  }

  const stuckNew = open.filter((l) => l.status === 'New');
  if (open.length > 0 && stuckNew.length / open.length > 0.4) {
    suggestions.push({
      area: 'Speed to lead',
      insight: `${stuckNew.length} of ${open.length} open leads are still in "New".`,
      action: 'Block 30 minutes daily to make first contact — response speed drives booking rates.',
    });
  }

  const contacted = leads.filter((l) => ['Contacted', 'Nurturing', 'Qualified'].includes(l.status));
  const booked = leads.filter((l) => CONSULT_STATUSES.includes(l.status));
  if (contacted.length >= 5 && booked.length / Math.max(contacted.length, 1) < 0.3) {
    suggestions.push({
      area: 'Conversion',
      insight: `Only ${booked.length} bookings from ${contacted.length} contacted/nurturing leads.`,
      action: 'Offer two concrete consultation times in every follow-up instead of open-ended asks.',
    });
  }

  const sources = leadSourcePerformance(leads);
  if (sources.length >= 2 && sources[0].leads >= 3) {
    suggestions.push({
      area: 'Marketing focus',
      insight: `"${sources[0].source}" is the top-converting source (${sources[0].consultations} consultations from ${sources[0].leads} leads).`,
      action: `Double down on ${sources[0].source} content and ask new leads how they found you.`,
    });
  }

  const quietPartners = (partners || []).filter((p) => !p.lastMeeting && !p.lastReferral);
  if (quietPartners.length > 0) {
    suggestions.push({
      area: 'Referral network',
      insight: `${quietPartners.length} referral partner(s) have never had a recorded meeting or referral.`,
      action: 'Book intro coffees — partner referrals are typically the highest-quality source.',
    });
  }

  const themes = analyseContentPerformance(contentItems || []);
  if (themes.length > 0 && themes[0].performanceScore > 0) {
    suggestions.push({
      area: 'Content strategy',
      insight: `"${themes[0].theme}" is the best-performing content theme.`,
      action: `Plan next week's calendar around ${themes[0].theme} variations.`,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      area: 'Steady state',
      insight: 'No structural bottlenecks detected in the current data.',
      action: 'Keep executing daily follow-ups and publishing the content pack.',
    });
  }
  return suggestions;
}
