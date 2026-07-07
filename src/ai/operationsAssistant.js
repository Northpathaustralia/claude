// ---------------------------------------------------------------------------
// AI Employee: Operations Assistant.
//
// Builds "today's plan": one ordered task list combining overdue and due
// follow-ups, high-priority new leads, referral reconnects, manual tasks and
// the daily content pack. This is the first thing James sees each morning.
// ---------------------------------------------------------------------------

import { reviewLeads } from '../ai/salesAssistant.js';
import { overdueFollowUps, todaysFollowUps, unscheduledLeads } from '../ai/crmManager.js';
import { suggestReconnects } from '../ai/referralManager.js';
import { todayISO, isOverdue, isToday } from '../utils/dates.js';

/**
 * Assemble today's ordered task list.
 * Each item: { id, priority: 'High'|'Medium'|'Low', category, title, detail, link }
 * `link` is an in-app route so every task is one click from action.
 */
export function buildTodaysPlan({ leads, partners, tasks }, today = todayISO()) {
  const plan = [];

  // 1. Overdue follow-ups — always top of the list.
  for (const lead of overdueFollowUps(leads, today)) {
    plan.push({
      id: `plan_overdue_${lead.id}`,
      priority: 'High',
      category: 'Follow-up (overdue)',
      title: `Follow up ${lead.name} — overdue since ${lead.nextFollowUp}`,
      detail: 'This follow-up slipped past its date. Call or message today.',
      link: `/leads/${lead.id}`,
    });
  }

  // 2. Follow-ups due today.
  for (const lead of todaysFollowUps(leads, today)) {
    plan.push({
      id: `plan_due_${lead.id}`,
      priority: 'High',
      category: 'Follow-up (today)',
      title: `Follow up ${lead.name} today`,
      detail: 'Scheduled follow-up is due today.',
      link: `/leads/${lead.id}`,
    });
  }

  // 3. Manual tasks that are overdue or due today.
  for (const task of tasks || []) {
    if (task.done) continue;
    if (isOverdue(task.dueDate, today) || isToday(task.dueDate, today)) {
      plan.push({
        id: `plan_task_${task.id}`,
        priority: task.priority || 'Medium',
        category: 'Task',
        title: task.title,
        detail: isOverdue(task.dueDate, today) ? `Overdue since ${task.dueDate}.` : 'Due today.',
        link: '/tasks',
      });
    }
  }

  // 4. Top unactioned high-grade leads (A+/A, still "New").
  const hotNew = reviewLeads(leads, today)
    .filter((r) => r.lead.status === 'New' && (r.grade === 'A+' || r.grade === 'A'))
    .slice(0, 3);
  for (const r of hotNew) {
    plan.push({
      id: `plan_hot_${r.lead.id}`,
      priority: 'High',
      category: 'New lead',
      title: `Make first contact with ${r.lead.name} (grade ${r.grade})`,
      detail: r.nextAction,
      link: `/leads/${r.lead.id}`,
    });
  }

  // 5. Leads missing a follow-up date — quick hygiene wins.
  for (const lead of unscheduledLeads(leads).slice(0, 3)) {
    plan.push({
      id: `plan_sched_${lead.id}`,
      priority: 'Medium',
      category: 'CRM hygiene',
      title: `Set a follow-up date for ${lead.name}`,
      detail: 'Open lead with no scheduled next touch.',
      link: `/leads/${lead.id}`,
    });
  }

  // 6. Referral reconnects — top two suggestions for the day.
  for (const s of suggestReconnects(partners || [], today).slice(0, 2)) {
    plan.push({
      id: `plan_partner_${s.partner.id}`,
      priority: 'Medium',
      category: 'Referral network',
      title: `Reconnect with ${s.partner.name} (${s.partner.type})`,
      detail: s.reason,
      link: '/referrals',
    });
  }

  // 7. Publish the daily content pack.
  plan.push({
    id: 'plan_content',
    priority: 'Low',
    category: 'Marketing',
    title: "Review and publish today's content pack",
    detail: 'The Marketing Manager has drafted today\'s videos, posts and messages.',
    link: '/content',
  });

  const rank = { High: 0, Medium: 1, Low: 2 };
  return plan.sort((a, b) => rank[a.priority] - rank[b.priority]);
}
