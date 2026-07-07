// ---------------------------------------------------------------------------
// AI Lead Scoring Engine.
//
// Scores every lead out of 100 against NorthPath's ideal client profile and
// classifies it A+/A/B/C/D. The engine is a pure function: score(lead) has no
// side effects, which makes it trivially unit-testable and safe to re-run
// whenever a lead changes.
//
// Factor weights (total 100):
//   Income               25
//   Employment stability 20
//   Debt profile         15
//   Credit profile       15
//   Buying timeframe     15
//   Location/affordability 10
//
// Scores are internal prioritisation signals only. They are never a promise
// of eligibility, approval or any financial outcome.
// ---------------------------------------------------------------------------

import { ICP } from '../domain/constants.js';
import { priorityForLead } from '../data/suburbs.js';

const WEIGHTS = {
  income: 25,
  employment: 20,
  debt: 15,
  credit: 15,
  timeframe: 15,
  location: 10,
};

/** Score household income (own + partner) against the $150k preference. */
function scoreIncome(lead) {
  const household = (Number(lead.income) || 0) + (Number(lead.partnerIncome) || 0);
  if (household <= 0) return { points: 0.3, note: 'Income not provided — capture it on the next call.' };
  const ratio = household / ICP.PREFERRED_HOUSEHOLD_INCOME;
  if (ratio >= 1.2) return { points: 1, note: 'Household income comfortably above target.' };
  if (ratio >= 1) return { points: 0.9, note: 'Household income at target.' };
  if (ratio >= 0.8) return { points: 0.65, note: 'Household income slightly below target.' };
  if (ratio >= 0.6) return { points: 0.4, note: 'Household income well below target.' };
  return { points: 0.15, note: 'Household income significantly below target.' };
}

/** Score employment stability. PAYG full-time and 2+yr self-employed rank highest. */
function scoreEmployment(lead) {
  switch (lead.employment) {
    case 'PAYG Full-Time':
      return { points: 1, note: 'Stable PAYG employment.' };
    case 'Self-Employed 2+ Years':
      return { points: 0.95, note: 'Established self-employment (2+ years).' };
    case 'PAYG Part-Time':
      return { points: 0.75, note: 'Part-time PAYG — check hours and history.' };
    case 'Contractor':
      return { points: 0.6, note: 'Contract income — verify continuity.' };
    case 'PAYG Casual':
      return { points: 0.5, note: 'Casual employment — length of tenure matters.' };
    case 'Self-Employed < 2 Years':
      return { points: 0.35, note: 'Self-employed under 2 years — may need more trading history.' };
    case 'Not Currently Employed':
      return { points: 0.05, note: 'Not currently employed.' };
    default:
      return { points: 0.4, note: 'Employment not recorded.' };
  }
}

/** Score monthly unsecured debt against the ~$1,000/month preference. */
function scoreDebt(lead) {
  const debt = Number(lead.monthlyUnsecuredDebt);
  if (Number.isNaN(debt) || lead.monthlyUnsecuredDebt === '' || lead.monthlyUnsecuredDebt === null || lead.monthlyUnsecuredDebt === undefined) {
    return { points: 0.5, note: 'Debt position unknown — ask about repayments.' };
  }
  if (debt <= 0) return { points: 1, note: 'No unsecured debt.' };
  if (debt <= ICP.MAX_UNSECURED_MONTHLY_REPAYMENTS) return { points: 0.85, note: 'Unsecured repayments within preferred range.' };
  if (debt <= ICP.MAX_UNSECURED_MONTHLY_REPAYMENTS * 2) return { points: 0.45, note: 'Unsecured repayments above preferred range — discuss consolidation education.' };
  return { points: 0.15, note: 'High unsecured repayments — likely a longer nurture.' };
}

/** Score credit history. Bankruptcy / Part IX / unpaid defaults are outside the ICP. */
function scoreCredit(lead) {
  switch (lead.creditProfile) {
    case 'Clean':
      return { points: 1, note: 'Clean credit profile.' };
    case 'Minor issues (paid defaults)':
      return { points: 0.6, note: 'Minor credit issues — worth understanding the detail.' };
    case 'Unknown':
      return { points: 0.5, note: 'Credit profile unknown — ask early.' };
    case 'Significant unpaid defaults':
      return { points: 0.1, note: 'Significant unpaid defaults — outside the ideal profile.' };
    case 'Part IX agreement':
      return { points: 0.05, note: 'Part IX agreement — outside the ideal profile.' };
    case 'Bankruptcy':
      return { points: 0, note: 'Bankruptcy history — outside the ideal profile.' };
    default:
      return { points: 0.5, note: 'Credit profile not recorded.' };
  }
}

/** Score buying timeframe — inside ~2 years is the ICP. */
function scoreTimeframe(lead) {
  switch (lead.buyingTimeframe) {
    case '0-3 months':
      return { points: 1, note: 'Ready to act now.' };
    case '3-6 months':
      return { points: 0.9, note: 'Buying soon.' };
    case '6-12 months':
      return { points: 0.75, note: 'Buying within a year.' };
    case '1-2 years':
      return { points: 0.6, note: 'Within the 2-year window — nurture with education.' };
    case '2+ years':
      return { points: 0.25, note: 'Beyond the 2-year window — long-term nurture.' };
    case 'Unsure':
      return { points: 0.4, note: 'Timeframe unclear — clarify intent.' };
    default:
      return { points: 0.4, note: 'Timeframe not recorded.' };
  }
}

/** Score location using the suburb affordability dataset. */
function scoreLocation(lead) {
  const priority = priorityForLead(lead);
  if (priority === 'High') return { points: 1, note: 'High-priority suburb (established houses under ~$900k common).', priority };
  if (priority === 'Medium') return { points: 0.6, note: 'Medium-priority suburb (near the affordability ceiling).', priority };
  return { points: 0.25, note: 'Lower-priority suburb (typically above the affordability ceiling).', priority };
}

/** Map a 0-100 score to a grade band. */
export function gradeForScore(score) {
  if (score >= 85) return 'A+';
  if (score >= 70) return 'A';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C';
  return 'D';
}

/**
 * Score a lead.
 * @returns {{score: number, grade: string, locationPriority: string,
 *            breakdown: Array<{factor: string, weight: number, points: number, note: string}>}}
 */
export function scoreLead(lead) {
  const parts = {
    income: scoreIncome(lead),
    employment: scoreEmployment(lead),
    debt: scoreDebt(lead),
    credit: scoreCredit(lead),
    timeframe: scoreTimeframe(lead),
    location: scoreLocation(lead),
  };

  let total = 0;
  const breakdown = Object.entries(parts).map(([factor, result]) => {
    const weighted = result.points * WEIGHTS[factor];
    total += weighted;
    return { factor, weight: WEIGHTS[factor], points: Math.round(weighted), note: result.note };
  });

  const score = Math.round(total);
  return {
    score,
    grade: gradeForScore(score),
    locationPriority: parts.location.priority,
    breakdown,
  };
}
