// ---------------------------------------------------------------------------
// AI Employee: Referral Manager.
//
// Watches the referral partner network: who's overdue for a reconnect, who is
// most valuable, and who to contact this week. Partners are the highest-
// leverage lead source, so the cadence rules here are deliberately proactive.
// ---------------------------------------------------------------------------

import { todayISO, daysBetween } from '../utils/dates.js';

/** Reconnect cadence in days by relationship strength. */
const RECONNECT_DAYS = { strong: 45, warm: 30, new: 14 };

/** Classify relationship strength from referral history. */
export function partnerStrength(partner) {
  if ((partner.totalReferrals || 0) >= 3) return 'strong';
  if ((partner.totalReferrals || 0) >= 1) return 'warm';
  return 'new';
}

/** Days since last meaningful contact (meeting or referral), or null if never. */
export function daysSinceContact(partner, today = todayISO()) {
  const last = [partner.lastMeeting, partner.lastReferral]
    .filter(Boolean)
    .sort()
    .pop();
  return last ? daysBetween(last.slice(0, 10), today) : null;
}

/**
 * Weekly reconnect suggestions, most urgent first. Each entry explains *why*
 * the partner is suggested, so the list reads like an assistant's briefing.
 */
export function suggestReconnects(partners, today = todayISO()) {
  return partners
    .map((partner) => {
      const strength = partnerStrength(partner);
      const since = daysSinceContact(partner, today);
      const threshold = RECONNECT_DAYS[strength];
      const overdueBy = since === null ? Infinity : since - threshold;
      let reason;
      if (since === null) reason = 'No contact recorded yet — book an intro meeting.';
      else if (overdueBy > 0) reason = `Last contact ${since} days ago (cadence for a ${strength} partner is ${threshold} days).`;
      else reason = null;
      return { partner, strength, since, overdueBy, reason };
    })
    .filter((s) => s.reason)
    .sort((a, b) => {
      // Never-contacted partners first, then most-overdue, then highest value.
      if (a.since === null && b.since !== null) return -1;
      if (b.since === null && a.since !== null) return 1;
      if (b.overdueBy !== a.overdueBy) return b.overdueBy - a.overdueBy;
      return (b.partner.potentialValue || 0) - (a.partner.potentialValue || 0);
    });
}

/** Partners ranked by referral output and potential value, for reporting. */
export function rankPartners(partners) {
  return [...partners].sort((a, b) => {
    const scoreA = (a.totalReferrals || 0) * 10 + (a.potentialValue || 0) / 1000;
    const scoreB = (b.totalReferrals || 0) * 10 + (b.potentialValue || 0) / 1000;
    return scoreB - scoreA;
  });
}
