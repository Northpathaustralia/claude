// ---------------------------------------------------------------------------
// Executive Decision Council: 18 specialists coordinated by Atlas.
// selectSpecialists() picks only the relevant experts for a task (the
// directive forbids activating everyone unnecessarily); buildCouncilPrompts()
// produces per-specialist system prompts for real model passes.
// ---------------------------------------------------------------------------

export const SPECIALISTS = {
  ATLAS: { id: 'ATLAS', role: 'Chief intelligence coordinator', skills: 'goals, coordination, conflict resolution, verification, final recommendation', always: true },
  FORGE: { id: 'FORGE', role: 'Engineering & software', skills: 'full-stack development, architecture, testing, deployment, debugging', keywords: ['code', 'software', 'app', 'website', 'api', 'bug', 'build', 'automation', 'database', 'deploy'] },
  SAGE: { id: 'SAGE', role: 'Research', skills: 'evidence review, source analysis, market research, fact-checking', keywords: ['research', 'evidence', 'market', 'study', 'data', 'compare', 'analysis', 'find out'] },
  PULSE: { id: 'PULSE', role: 'Marketing', skills: 'branding, advertising, customer psychology, funnels, conversion', keywords: ['marketing', 'brand', 'ad', 'campaign', 'social', 'audience', 'content', 'launch', 'seo'] },
  VAULT: { id: 'VAULT', role: 'Finance', skills: 'forecasting, cash flow, revenue modelling, pricing, unit economics', keywords: ['finance', 'financial', 'revenue', 'cost', 'price', 'pricing', 'cash', 'profit', 'budget', 'invest', 'model'] },
  MUSE: { id: 'MUSE', role: 'Writing', skills: 'reports, proposals, scripts, books, emails, presentations', keywords: ['write', 'writing', 'book', 'script', 'email', 'proposal', 'report', 'copy', 'story'] },
  ORBIT: { id: 'ORBIT', role: 'Projects & operations', skills: 'project plans, tasks, timelines, SOPs, process improvement', keywords: ['plan', 'project', 'timeline', 'task', 'process', 'sop', 'operations', 'workflow', 'organise'] },
  SENTINEL: { id: 'SENTINEL', role: 'Security & quality', skills: 'security, privacy, testing, verification, risk controls', keywords: ['security', 'privacy', 'risk', 'safe', 'test', 'quality', 'verify', 'protect'] },
  COUNSEL: { id: 'COUNSEL', role: 'Legal risk & compliance (not a lawyer)', skills: 'regulatory review, contract risk, compliance, disclaimers', keywords: ['legal', 'contract', 'compliance', 'regulation', 'agreement', 'terms', 'licence', 'law'] },
  VISION: { id: 'VISION', role: 'Innovation', skills: 'new concepts, product innovation, future opportunities', keywords: ['idea', 'innovation', 'new', 'concept', 'future', 'opportunity', 'invent'] },
  ANALYST: { id: 'ANALYST', role: 'Data', skills: 'analytics, statistics, dashboards, data interpretation', keywords: ['data', 'metric', 'statistic', 'dashboard', 'trend', 'kpi', 'numbers'] },
  NEGOTIATOR: { id: 'NEGOTIATOR', role: 'Negotiation', skills: 'deal strategy, objection handling, partnership structure', keywords: ['negotiate', 'deal', 'offer', 'partner', 'objection', 'terms'] },
  INVESTOR: { id: 'INVESTOR', role: 'Investment analysis', skills: 'investment thesis, risk, returns, capital strategy, due diligence', keywords: ['invest', 'investment', 'investor', 'return', 'capital', 'diligence', 'property', 'portfolio'] },
  PSYCHOLOGIST: { id: 'PSYCHOLOGIST', role: 'Human behaviour (not a licensed professional)', skills: 'customer behaviour, communication, motivation, decision psychology', keywords: ['customer', 'behaviour', 'motivation', 'psychology', 'persuade', 'why people'] },
  ECONOMIST: { id: 'ECONOMIST', role: 'Economic analysis', skills: 'market conditions, economic trends, interest-rate impact, industry cycles', keywords: ['economy', 'economic', 'interest rate', 'inflation', 'cycle', 'macro'] },
  GROWTH: { id: 'GROWTH', role: 'Scaling', skills: 'acquisition, retention, referrals, expansion, growth loops', keywords: ['grow', 'growth', 'scale', 'acquisition', 'retention', 'referral', 'expand', 'leads'] },
  OPERATOR: { id: 'OPERATOR', role: 'Business execution', skills: 'daily operations, systems, staffing, efficiency', keywords: ['operations', 'staff', 'hire', 'efficiency', 'daily', 'run the business'] },
  ARCHITECT: { id: 'ARCHITECT', role: 'Systems design', skills: 'platform architecture, business systems, long-term scalability', keywords: ['architecture', 'system design', 'platform', 'scalability', 'infrastructure', 'gym', 'facility'] },
};

const CORE_BUSINESS_SET = ['SAGE', 'VAULT', 'ORBIT', 'SENTINEL'];

/**
 * Pick relevant specialists for a task (Atlas always included, capped so we
 * never waste passes on irrelevant experts).
 * @param {string} task
 * @param {number} [max] maximum specialists excluding ATLAS
 * @returns {string[]} specialist ids, ATLAS first
 */
export function selectSpecialists(task, max = 5) {
  const text = (task || '').toLowerCase();
  const scored = [];
  for (const s of Object.values(SPECIALISTS)) {
    if (s.always) continue;
    const hits = (s.keywords || []).filter((k) => text.includes(k)).length;
    if (hits > 0) scored.push({ id: s.id, hits });
  }
  scored.sort((a, b) => b.hits - a.hits);
  let picked = scored.slice(0, max).map((s) => s.id);
  // A substantial decision with no keyword hits still deserves the core set.
  if (picked.length === 0 && text.split(/\s+/).length > 6) picked = [...CORE_BUSINESS_SET];
  return ['ATLAS', ...picked];
}

/** System prompt for one specialist's analysis pass. */
export function specialistPrompt(id) {
  const s = SPECIALISTS[id];
  if (!s) return '';
  const disclaimers =
    id === 'COUNSEL'
      ? ' You are not a lawyer and must say so when giving legal-risk commentary; recommend professional review for anything binding.'
      : id === 'PSYCHOLOGIST'
        ? ' You are not a licensed mental-health professional and must not present yourself as one.'
        : '';
  return `You are ${s.id}, the ${s.role} specialist on the ATLAS ONE Executive Decision Council, advising James Forycki. Expertise: ${s.skills}.${disclaimers}
Give your specialist analysis of the task below: your strongest recommendations, the risks only your discipline would spot, any disagreement you expect from other specialists, and a confidence label (Verified fact / Strong evidence / Estimate / Assumption / Opinion). Be direct and concrete. Do not pad. 150-300 words.`;
}

/** System prompt for Atlas's final synthesis over specialist analyses. */
export function synthesisPrompt(specialistIds) {
  return `You are ATLAS, chief intelligence coordinator. You convened these specialists: ${specialistIds.filter((i) => i !== 'ATLAS').join(', ')}. Their analyses follow in the conversation. Produce the council decision brief with exactly these sections:
Executive Summary
Council Consensus
Major Supporting Evidence
Minority Opinions (name the dissenting specialist and why)
Trade-offs
Risks
Opportunities
Recommended Action (with confidence label)
Alternative Option
Next Step
Resolve conflicts explicitly rather than averaging them. Keep it decision-grade and free of filler.`;
}
