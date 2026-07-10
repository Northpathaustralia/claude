// ---------------------------------------------------------------------------
// Morning briefing builder. Pure function over real local data:
// NorthPath (NPAOS) leads/tasks via the operations assistant + Atlas-level
// projects. No invented numbers — everything it says comes from the stores.
// Voice mode reads the same text aloud.
// ---------------------------------------------------------------------------

import { buildTodaysPlan } from '../ai/operationsAssistant.js';
import { reviewLeads } from '../ai/salesAssistant.js';
import { OPEN_STATUSES } from '../domain/constants.js';
import { todayISO, isOverdue } from '../utils/dates.js';

function partOfDay(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return 'Morning';
  if (h < 18) return 'Afternoon';
  return 'Evening';
}

/**
 * @param {object} opts
 * @param {object} opts.npaos   NPAOS store state {leads, tasks, partners, contentItems, appointments}
 * @param {object} opts.atlas   Atlas store state {projects, conversations, artifacts}
 * @param {Date}   [opts.now]
 * @returns {{greeting:string, lines:string[], priorities:Array, speech:string}}
 */
export function buildBriefing({ npaos, atlas, now = new Date() }) {
  const today = todayISO(now);
  const greeting = `${partOfDay(now)}, James.`;
  const lines = [];

  const leads = npaos?.leads || [];
  const openLeads = leads.filter((l) => OPEN_STATUSES.includes(l.status));
  const ranked = reviewLeads(leads, today);
  const urgent = ranked.filter((r) => r.overdue || r.dueToday).length;
  const hotNew = ranked.filter((r) => r.lead.status === 'New' && (r.grade === 'A+' || r.grade === 'A')).length;
  if (openLeads.length) {
    const extras = [];
    if (hotNew) extras.push(`${hotNew} new A-grade`);
    if (urgent) extras.push(`${urgent} follow-up${urgent === 1 ? '' : 's'} due or overdue`);
    lines.push(`NorthPath: ${openLeads.length} open lead${openLeads.length === 1 ? '' : 's'}${extras.length ? ` — ${extras.join(', ')}` : ''}.`);
  } else {
    lines.push('NorthPath: no open leads right now.');
  }

  const tasks = (npaos?.tasks || []).filter((t) => !t.done);
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, today)).length;
  if (tasks.length) lines.push(`${tasks.length} open task${tasks.length === 1 ? '' : 's'}${overdue ? ` — ${overdue} overdue` : ''}.`);

  const appts = (npaos?.appointments || []).filter((a) => a.date && a.date >= today);
  if (appts.length) {
    const next = [...appts].sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')))[0];
    lines.push(`Next appointment: ${next.title} on ${next.date}${next.time ? ` at ${next.time}` : ''}.`);
  }

  const projects = (atlas?.projects || []).filter((p) => !p.archived);
  if (projects.length) lines.push(`${projects.length} active ATLAS project${projects.length === 1 ? '' : 's'}.`);

  const priorities = buildTodaysPlan(
    { leads, partners: npaos?.partners || [], tasks: npaos?.tasks || [] },
    today,
  ).slice(0, 3);

  const speech = [greeting, ...lines, priorities.length ? `Top priority: ${priorities[0].title}.` : '']
    .filter(Boolean)
    .join(' ');

  return { greeting, lines, priorities, speech };
}
