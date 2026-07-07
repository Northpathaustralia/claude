// ---------------------------------------------------------------------------
// AI Employee: Marketing Manager.
//
// Generates a full daily content pack (video ideas, posts, article, Q&A
// responses, DM drafts, newsletter, FAQ), builds a rolling content calendar
// and analyses which themes perform best. Content generation is deterministic
// per date — the same day always produces the same pack — so the "engine" can
// later be swapped for a live LLM call without changing any consumer code.
//
// Every template educates first and sells second, and is written to comply
// with the rule: never promise approvals or guarantee outcomes.
// ---------------------------------------------------------------------------

import { withDisclaimer, sanitise } from '../utils/compliance.js';
import { todayISO, addDays } from '../utils/dates.js';

/** Content themes NPAOS rotates through. Used for calendar + performance analysis. */
export const THEMES = [
  'First Home Buyer Basics',
  'Budgeting & Saving a Deposit',
  'Understanding Borrowing Power',
  'Managing Unsecured Debt',
  'Suburb Affordability Spotlights',
  'Credit Health & Repayment History',
  'Self-Employed Home Buying',
  'The Buying Process Step-by-Step',
];

// Simple deterministic hash so each date maps to stable template picks.
function seedFromDate(iso) {
  let h = 0;
  for (const ch of iso) h = (h * 31 + ch.charCodeAt(0)) % 100000;
  return h;
}
const pick = (arr, seed, offset = 0) => arr[(seed + offset) % arr.length];

const VIDEO_IDEAS = [
  '3 things lenders look at before anything else (60-second explainer).',
  'What "borrowing power" actually means — whiteboard walkthrough.',
  'The $1,000/month rule: how unsecured repayments shape your options.',
  'PAYG vs self-employed: what paperwork differs when you buy a home.',
  'Suburb spotlight: where established houses still sit under $900k.',
  'Afterpay, Zip and your home-buying plans — what to know.',
  '5 questions to ask at your first consultation (and why).',
  'How a 2-year plan beats a 2-week scramble when buying a home.',
  'Deposit vs buffer: why lenders like to see both.',
  'What a Part IX agreement is — plain-English education.',
  'The real cost of a car loan when you want a mortgage next year.',
  'How repayment history is recorded — and why consistency matters.',
];

const FACEBOOK_POSTS = [
  'Thinking about buying your first home in the next couple of years? Start with one number: your total monthly repayments on cards, car loans and buy-now-pay-later. Knowing it puts you in control of your plan. Every situation is different — happy to point you to good educational resources.',
  'Suburb spotlight 🏡 There are still plenty of Australian suburbs where established houses commonly sell under $900k. The trade-offs are commute, amenities and growth — worth researching before you fall in love with a postcode.',
  'A savings habit beats a savings amount. Lenders generally like to see consistent saving over time, not just a lump sum. Small, regular transfers tell a stronger story. General information only — everyone’s circumstances differ.',
  'Self-employed and dreaming of a home? The two-year mark matters: most lenders want to see an established trading history. If you’re one year in, now is exactly the right time to get organised.',
];

const LINKEDIN_POSTS = [
  'Most first-home buyers start researching lenders. The better starting point is usually their own numbers: income stability, monthly unsecured repayments, and a realistic buying timeframe. Education first — decisions second. That’s the order that reduces stress.',
  'Referral partners — accountants, brokers, conveyancers — are the quiet engine of good client outcomes. If you work with home buyers and we haven’t met, I’d genuinely like to compare notes on how we each help clients prepare well.',
  'An observation from client conversations: the buyers who feel most in control aren’t the highest earners — they’re the ones with a written 12-24 month plan. Clarity compounds.',
  'Buy-now-pay-later feels small until you map it against a home-buying plan. Repayment commitments are commitments, however they’re packaged. Worth educating clients on early.',
];

const ARTICLE_OUTLINES = [
  {
    title: 'The 24-Month Home Buyer Plan: A Practical Roadmap',
    body:
      'A step-by-step educational guide for buyers roughly two years out: auditing income and repayments, building a deposit and buffer, understanding how lenders read bank statements, choosing target suburbs by affordability, and preparing questions for professional advisers. Includes a month-by-month checklist.',
  },
  {
    title: 'Unsecured Debt and Home Buying: What Every Buyer Should Understand',
    body:
      'How car loans, personal loans, credit cards, ATO payment plans and buy-now-pay-later services are typically viewed when you apply for a home loan; why total monthly repayments matter more than balances; and educational strategies people discuss with their advisers for tidying commitments before buying.',
  },
  {
    title: 'Reading Suburb Data Like a Pro: Affordability Beyond the Headlines',
    body:
      'Where to find median price data, why postcode-level numbers can mislead, how to weigh commute and amenity trade-offs, and a framework for building a shortlist of suburbs where established houses commonly sell below $900k.',
  },
  {
    title: 'PAYG vs Self-Employed: Preparing to Buy in Each World',
    body:
      'The documentation, timelines and stability signals that typically differ between salaried and self-employed buyers, why the two-year trading history convention exists, and how each group can prepare well in advance.',
  },
];

const COMMON_QUESTIONS = [
  {
    q: 'How much deposit do I actually need?',
    a: 'It varies with the price, the lender and your circumstances. Many buyers plan around 5-20% plus purchase costs, but the right number for you depends on your situation — a licensed professional can walk you through the options.',
  },
  {
    q: 'Does Afterpay or Zip affect my home-buying plans?',
    a: 'Buy-now-pay-later commitments are repayment obligations, and lenders generally consider your regular commitments. Keeping them low and paid on time tells a better story. Individual circumstances always matter.',
  },
  {
    q: 'I had a paid default years ago — is buying still possible?',
    a: 'A past issue doesn’t automatically end the conversation; recency, size and whether it was paid all matter, and policies differ between lenders. It’s worth getting professional advice on your specific file.',
  },
  {
    q: 'I’m self-employed — when should I start preparing?',
    a: 'Earlier than you think. Most lenders like to see around two years of trading history, so the preparation window is a great time to organise financials and build savings habits.',
  },
  {
    q: 'What happens at a first consultation?',
    a: 'It’s an educational conversation: we map your current position, talk through how the process works and outline what preparation could look like. No commitments, no pressure, and no promises about outcomes.',
  },
  {
    q: 'How long does it take to buy once I’m ready?',
    a: 'From serious searching to keys, many buyers experience roughly 3-6 months, but it varies widely with the market and finance preparation. Planning ahead is what keeps it low-stress.',
  },
  {
    q: 'Should I pay off my car loan before buying?',
    a: 'Reducing monthly commitments generally helps how your position reads, but whether to pay a loan out early depends on your numbers — that’s a great question for a licensed adviser.',
  },
];

const DM_DRAFTS = [
  'Hey {first}! Thanks for the follow. If you’re researching home buying, I share plain-English education here — sing out if there’s ever a topic you’d like covered.',
  'Hi {first}, great to connect! Out of curiosity, are you actively planning a purchase or just gathering ideas at this stage? Happy to point you to resources either way — no pressure.',
  'Hi {first}, saw your comment on the deposit post — great question. Short answer: it depends on your circumstances, but I can share an educational guide that covers the common scenarios if useful?',
  'Hey {first}! A lot of people ask about buying while self-employed. I put together a simple explainer on how the two-year history convention works — want me to send it over?',
  'Hi {first}, thanks for the message! The best first step is usually understanding your own numbers — income, repayments, timeframe. If a relaxed 15-minute chat would help, I’m happy to set one up.',
  'Hey {first}, checking in — you mentioned you were looking at buying in the next year or two. How’s the planning going? If any questions have come up, fire away.',
];

const NEWSLETTER_TEMPLATES = [
  {
    subject: 'Your 3-number home buying health check',
    body:
      'This week: the three numbers that tell you more about your buying readiness than any online calculator — household income stability, total monthly unsecured repayments, and months of consistent savings. We break down why each matters, how lenders typically read them, and one small action for each you can take this week.',
  },
  {
    subject: 'Suburbs where sub-$900k houses still exist (really)',
    body:
      'This week we tour affordability data: how to build a shortlist of suburbs where established houses commonly sell under $900k, the trade-offs to weigh, and the research tools that are free to use. Plus a reader question on buy-now-pay-later and buying plans.',
  },
  {
    subject: 'Self-employed? Your two-year runway starts now',
    body:
      'Why most lenders like two years of trading history, what "organised financials" actually means, and a quarter-by-quarter preparation rhythm for business owners planning a purchase. Educational only — your accountant and adviser are the heroes of this story.',
  },
];

const FAQS = [
  {
    q: 'Is NorthPath a lender?',
    a: 'No. NorthPath provides education and guidance to help you prepare, and works alongside licensed professionals. We never promise approvals or outcomes — everything depends on your individual circumstances.',
  },
  {
    q: 'Do I need perfect credit to start planning?',
    a: 'No — planning is exactly what imperfect situations benefit from most. Understanding where you stand today is the first step, and professional advice can clarify what’s realistic for you.',
  },
  {
    q: 'What does a consultation cost?',
    a: 'The initial consultation is an educational conversation about your position and plan. We’ll always be upfront about any costs before you commit to anything.',
  },
  {
    q: 'How soon before buying should I get organised?',
    a: 'Ideally 12-24 months out. That window is where savings habits, debt tidying and paperwork preparation have the most impact.',
  },
];

/**
 * Generate the full daily content pack for a given date.
 * Deterministic: same date in, same pack out.
 */
export function generateDailyContent(dateISO = todayISO()) {
  const seed = seedFromDate(dateISO);
  const article = pick(ARTICLE_OUTLINES, seed, 3);
  const newsletter = pick(NEWSLETTER_TEMPLATES, seed, 4);

  return {
    date: dateISO,
    theme: pick(THEMES, seed),
    videoIdeas: [pick(VIDEO_IDEAS, seed, 0), pick(VIDEO_IDEAS, seed, 4), pick(VIDEO_IDEAS, seed, 8)],
    facebookPost: withDisclaimer(pick(FACEBOOK_POSTS, seed, 1)),
    linkedinPost: withDisclaimer(pick(LINKEDIN_POSTS, seed, 2)),
    article: { title: article.title, outline: sanitise(article.body) },
    questionResponses: Array.from({ length: 5 }, (_, i) => {
      const item = pick(COMMON_QUESTIONS, seed, i * 2);
      return { question: item.q, answer: sanitise(item.a) };
    }),
    dmDrafts: Array.from({ length: 5 }, (_, i) => sanitise(pick(DM_DRAFTS, seed, i))),
    newsletter: { subject: newsletter.subject, body: withDisclaimer(newsletter.body) },
    faq: (() => {
      const item = pick(FAQS, seed, 5);
      return { question: item.q, answer: sanitise(item.a) };
    })(),
  };
}

/**
 * Build a rolling content calendar: one themed slot per day.
 * @param {string} startISO first day
 * @param {number} days how many days ahead
 */
export function buildContentCalendar(startISO = todayISO(), days = 14) {
  const CHANNEL_ROTATION = ['Short-form video', 'Facebook post', 'LinkedIn post', 'Article', 'Email newsletter'];
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(startISO, i);
    const seed = seedFromDate(date);
    return {
      date,
      theme: pick(THEMES, seed),
      channel: CHANNEL_ROTATION[i % CHANNEL_ROTATION.length],
      idea: pick(VIDEO_IDEAS, seed, 2),
    };
  });
}

/**
 * Analyse which content themes perform best from recorded content items.
 * An item: { theme, engagements, leadsAttributed }.
 * Returns themes sorted by a blended performance score.
 */
export function analyseContentPerformance(contentItems) {
  const byTheme = new Map();
  for (const item of contentItems) {
    const key = item.theme || 'Untagged';
    const agg = byTheme.get(key) || { theme: key, posts: 0, engagements: 0, leadsAttributed: 0 };
    agg.posts += 1;
    agg.engagements += Number(item.engagements) || 0;
    agg.leadsAttributed += Number(item.leadsAttributed) || 0;
    byTheme.set(key, agg);
  }
  return [...byTheme.values()]
    .map((t) => ({
      ...t,
      // Leads are worth far more than raw engagement — weight accordingly.
      performanceScore: t.leadsAttributed * 10 + t.engagements,
    }))
    .sort((a, b) => b.performanceScore - a.performanceScore);
}
