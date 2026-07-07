// ---------------------------------------------------------------------------
// NPAOS domain constants.
// Single source of truth for enumerations used across the app. Keeping these
// as flat string values makes future CRM integrations (HubSpot, Zapier, etc.)
// straightforward: they map 1:1 to picklist properties.
// ---------------------------------------------------------------------------

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Nurturing',
  'Qualified',
  'Consultation Booked',
  'Consultation Completed',
  'Converted',
  'Not Ready',
  'Lost',
];

/** Statuses considered "open pipeline" for reporting. */
export const OPEN_STATUSES = [
  'New',
  'Contacted',
  'Nurturing',
  'Qualified',
  'Consultation Booked',
];

export const LEAD_SOURCES = [
  'Website',
  'Referral Partner',
  'Facebook',
  'Instagram',
  'TikTok',
  'LinkedIn',
  'Organic Search',
  'Manual Entry',
  'CSV Import',
  'Other / Future Integration',
];

export const EMPLOYMENT_TYPES = [
  'PAYG Full-Time',
  'PAYG Part-Time',
  'PAYG Casual',
  'Self-Employed 2+ Years',
  'Self-Employed < 2 Years',
  'Contractor',
  'Not Currently Employed',
];

export const BUYING_TIMEFRAMES = [
  '0-3 months',
  '3-6 months',
  '6-12 months',
  '1-2 years',
  '2+ years',
  'Unsure',
];

export const CREDIT_PROFILES = [
  'Clean',
  'Minor issues (paid defaults)',
  'Significant unpaid defaults',
  'Part IX agreement',
  'Bankruptcy',
  'Unknown',
];

export const STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];

export const GRADES = ['A+', 'A', 'B', 'C', 'D'];

export const REFERRAL_PARTNER_TYPES = [
  'Accountant',
  'Mortgage Broker',
  'Financial Planner',
  'Conveyancer',
  'Builder',
  "Buyer's Agent",
  'Real Estate Agent',
  'Solicitor',
  'Other',
];

export const TASK_PRIORITIES = ['High', 'Medium', 'Low'];

/** Ideal client profile thresholds used by the scoring engine. */
export const ICP = {
  MIN_AGE: 30,
  MAX_AGE: 55,
  PREFERRED_HOUSEHOLD_INCOME: 150000,
  MAX_UNSECURED_MONTHLY_REPAYMENTS: 1000,
  AFFORDABLE_SUBURB_PRICE_CEILING: 900000,
};
