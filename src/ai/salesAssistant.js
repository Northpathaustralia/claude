// ---------------------------------------------------------------------------
// AI Employee: Sales Assistant.
//
// Reviews leads, prioritises them, recommends the single next action for each
// and drafts personalised, compliant follow-up messages. Pure functions over
// the lead list — no side effects.
// ---------------------------------------------------------------------------

import { scoreLead } from '../ai/leadScoring.js';
import { OPEN_STATUSES } from '../domain/constants.js';
import { isOverdue, isToday, daysBetween, todayISO } from '../utils/dates.js';
import { sanitise } from '../utils/compliance.js';

/**
 * Recommend the next action for a lead based on status, score and follow-up
 * state. Returns a short imperative string James can act on immediately.
 */
export function recommendNextAction(lead, today = todayISO()) {
  const { grade } = scoreLead(lead);

  if (lead.status === 'Converted') return 'Ask for a referral and a review.';
  if (lead.status === 'Lost') return 'Archive — add a learning note about why.';
  if (lead.status === 'Not Ready') return 'Keep on the monthly education email list.';
  if (lead.status === 'Consultation Completed') return 'Send a recap and agree the next step.';
  if (lead.status === 'Consultation Booked') return 'Send a reminder and a short prep checklist.';

  if (lead.nextFollowUp && isOverdue(lead.nextFollowUp, today)) {
    return 'Follow-up is overdue — call or message today.';
  }
  if (lead.nextFollowUp && isToday(lead.nextFollowUp, today)) {
    return 'Follow-up due today — reach out now.';
  }

  if (lead.status === 'New') {
    return grade === 'A+' || grade === 'A'
      ? 'High-quality lead — call within 24 hours to book a consultation.'
      : 'Send a friendly intro message and qualify key details.';
  }
  if (lead.status === 'Contacted') return 'Book the consultation — offer two time options.';
  if (lead.status === 'Qualified') return 'Send the booking link with a personal note.';
  if (lead.status === 'Nurturing') {
    const daysSince = lead.updatedAt ? daysBetween(lead.updatedAt.slice(0, 10), today) : 99;
    return daysSince > 14
      ? 'No touch in 2+ weeks — share a relevant educational piece.'
      : 'Continue nurture — schedule the next check-in.';
  }
  return 'Review the record and set a next follow-up date.';
}

/**
 * The Sales Assistant's daily review: open leads ranked by urgency then score.
 * Each entry carries the score, grade and recommended action.
 */
export function reviewLeads(leads, today = todayISO()) {
  return leads
    .filter((l) => OPEN_STATUSES.includes(l.status))
    .map((lead) => {
      const scored = scoreLead(lead);
      const overdue = isOverdue(lead.nextFollowUp, today);
      const dueToday = isToday(lead.nextFollowUp, today);
      // Urgency: overdue first, then due today, then raw score.
      const urgency = (overdue ? 200 : 0) + (dueToday ? 100 : 0) + scored.score;
      return { lead, ...scored, overdue, dueToday, urgency, nextAction: recommendNextAction(lead, today) };
    })
    .sort((a, b) => b.urgency - a.urgency);
}

/**
 * Draft a personalised follow-up message for a lead. Educational tone, no
 * promises, James stays the sender — nothing is auto-sent.
 * @param {'sms'|'email'} channel
 */
export function draftFollowUp(lead, channel = 'sms') {
  const first = (lead.name || 'there').split(' ')[0];
  const suburbBit = lead.suburb ? ` around ${lead.suburb}` : '';
  const timeframeBit =
    lead.buyingTimeframe && lead.buyingTimeframe !== 'Unsure'
      ? ` I know you were thinking about buying in the next ${lead.buyingTimeframe.toLowerCase()}.`
      : '';

  if (channel === 'sms') {
    return sanitise(
      `Hi ${first}, it's James from NorthPath. Just checking in — how's the home-buying research going${suburbBit}?` +
        `${timeframeBit} Happy to answer any questions, no pressure at all. If a quick chat would help, I can send through some times.`,
    );
  }

  return sanitise(
    `Hi ${first},\n\n` +
      `James here from NorthPath. I wanted to check in on your home-buying plans${suburbBit}.${timeframeBit}\n\n` +
      `A few things clients at a similar stage often find useful:\n` +
      `- Understanding how lenders view income and existing repayments\n` +
      `- A simple savings and buffer plan for the next 6-12 months\n` +
      `- What actually happens at a first consultation (it's educational, not a sales call)\n\n` +
      `If it would help to talk any of this through, reply and I'll send a couple of times for a relaxed chat.\n\n` +
      `Every situation is different, so nothing here is a promise of any particular outcome — just education to help you plan.\n\n` +
      `Cheers,\nJames`,
  );
}
