// ---------------------------------------------------------------------------
// AI Employee: CRM Manager.
//
// Keeps the lead base organised: surfaces overdue and due-today follow-ups,
// flags data-hygiene gaps, and suggests sensible next follow-up dates so no
// lead ever goes stale.
// ---------------------------------------------------------------------------

import { OPEN_STATUSES } from '../domain/constants.js';
import { isOverdue, isToday, addDays, todayISO, daysBetween } from '../utils/dates.js';

/** Leads with a follow-up strictly before today. */
export function overdueFollowUps(leads, today = todayISO()) {
  return leads
    .filter((l) => OPEN_STATUSES.includes(l.status) && isOverdue(l.nextFollowUp, today))
    .sort((a, b) => (a.nextFollowUp || '').localeCompare(b.nextFollowUp || ''));
}

/** Leads whose follow-up is due today. */
export function todaysFollowUps(leads, today = todayISO()) {
  return leads.filter((l) => OPEN_STATUSES.includes(l.status) && isToday(l.nextFollowUp, today));
}

/** Open leads with no follow-up date at all — the CRM's cardinal sin. */
export function unscheduledLeads(leads) {
  return leads.filter((l) => OPEN_STATUSES.includes(l.status) && !l.nextFollowUp);
}

/**
 * Suggest the next follow-up interval (in days) for a lead based on status
 * and buying timeframe. Hot statuses get tight loops; long-timeframe leads
 * get a slower educational cadence.
 */
export function suggestFollowUpDate(lead, today = todayISO()) {
  let days;
  switch (lead.status) {
    case 'New':
      days = 1;
      break;
    case 'Contacted':
      days = 3;
      break;
    case 'Qualified':
      days = 2;
      break;
    case 'Consultation Booked':
      days = 1;
      break;
    case 'Nurturing':
      days = lead.buyingTimeframe === '2+ years' ? 30 : 14;
      break;
    case 'Not Ready':
      days = 45;
      break;
    default:
      days = 7;
  }
  return addDays(today, days);
}

/**
 * Data-hygiene audit: fields worth capturing that are missing, per lead.
 * Returns [{ lead, missing: string[] }] for leads with at least one gap.
 */
export function hygieneIssues(leads) {
  const checks = [
    ['phone', 'phone number'],
    ['email', 'email address'],
    ['suburb', 'suburb'],
    ['postcode', 'postcode'],
    ['employment', 'employment type'],
    ['income', 'income'],
    ['buyingTimeframe', 'buying timeframe'],
    ['source', 'lead source'],
  ];
  return leads
    .filter((l) => OPEN_STATUSES.includes(l.status))
    .map((lead) => ({
      lead,
      missing: checks.filter(([field]) => !lead[field] && lead[field] !== 0).map(([, label]) => label),
    }))
    .filter((entry) => entry.missing.length > 0);
}

/** Open leads untouched for more than `staleDays` days. */
export function staleLeads(leads, staleDays = 21, today = todayISO()) {
  return leads.filter((l) => {
    if (!OPEN_STATUSES.includes(l.status)) return false;
    const last = (l.updatedAt || l.createdAt || '').slice(0, 10);
    return last && daysBetween(last, today) > staleDays;
  });
}
