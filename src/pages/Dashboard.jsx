// ---------------------------------------------------------------------------
// Dashboard — the daily command centre.
// Combines output from every AI employee: today's plan (Operations Assistant),
// follow-ups (CRM Manager), top leads (Sales Assistant), referral activity
// (Referral Manager), KPIs and pipeline (Business Analyst), and today's
// content (Marketing Manager).
// ---------------------------------------------------------------------------
import { Link } from 'react-router-dom';
import { useStore } from '@/store/StoreContext.jsx';
import { buildTodaysPlan } from '@/ai/operationsAssistant.js';
import { reviewLeads } from '@/ai/salesAssistant.js';
import { overdueFollowUps, todaysFollowUps } from '@/ai/crmManager.js';
import { suggestReconnects } from '@/ai/referralManager.js';
import { periodKPIs, pipelineByStatus, pipelineValue } from '@/ai/businessAnalyst.js';
import { generateDailyContent } from '@/ai/marketingManager.js';
import { LEAD_STATUSES, OPEN_STATUSES } from '@/domain/constants.js';
import { todayISO, formatDate } from '@/utils/dates.js';
import { formatCurrency, formatPercent, truncate } from '@/utils/format.js';
import PageHeader from '@/components/layout/PageHeader.jsx';
import Card from '@/components/ui/Card.jsx';
import Badge, { statusTone, priorityTone } from '@/components/ui/Badge.jsx';
import StatTile from '@/components/ui/StatTile.jsx';
import ScoreBadge from '@/components/leads/ScoreBadge.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';

export default function Dashboard() {
  const { state } = useStore();
  const { leads, partners, tasks, appointments } = state;
  const today = todayISO();

  const plan = buildTodaysPlan({ leads, partners, tasks }, today);
  const review = reviewLeads(leads, today);
  const highPriority = review.filter((r) => r.grade === 'A+' || r.grade === 'A').slice(0, 5);
  const recentLeads = [...leads]
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, 5);
  const overdue = overdueFollowUps(leads, today);
  const dueToday = todaysFollowUps(leads, today);
  const reconnects = suggestReconnects(partners, today).slice(0, 3);
  const kpis = periodKPIs(leads, today);
  const funnel = pipelineByStatus(leads, LEAD_STATUSES.filter((s) => OPEN_STATUSES.includes(s)));
  const maxFunnel = Math.max(...funnel.map((f) => f.count), 1);
  const content = generateDailyContent(today);
  const upcoming = [...appointments]
    .filter((a) => a.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''))
    .slice(0, 4);

  return (
    <div>
      <PageHeader
        title={`Good morning, James`}
        subtitle={`Here's what your AI team has lined up for ${formatDate(today)}.`}
      />

      {/* KPI row */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile label="New leads (week)" value={kpis.weekly.newLeads} sub={`${kpis.monthly.newLeads} this month`} />
        <StatTile label="Consultations (week)" value={kpis.weekly.consultationsBooked} sub={`${kpis.monthly.consultationsBooked} this month`} tone="good" />
        <StatTile label="Conversion rate (month)" value={formatPercent(kpis.monthly.conversionRate)} />
        <StatTile label="Avg lead score (month)" value={kpis.monthly.averageLeadScore || '—'} />
        <StatTile label="Est. pipeline value" value={formatCurrency(pipelineValue(leads))} sub="Planning estimate only" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Today's plan */}
        <Card
          title="Today's priorities"
          subtitle="Built by your Operations Assistant"
          className="xl:col-span-2"
        >
          {plan.length === 0 ? (
            <EmptyState title="All clear" hint="No urgent items today." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {plan.slice(0, 8).map((item) => (
                <li key={item.id} className="flex items-start gap-3 py-2.5">
                  <Badge tone={priorityTone(item.priority)}>{item.priority}</Badge>
                  <div className="min-w-0 flex-1">
                    <Link to={item.link} className="text-sm font-medium text-slate-800 hover:text-brand-700">
                      {item.title}
                    </Link>
                    <p className="text-xs text-slate-500">{item.detail}</p>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-slate-400">{item.category}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Follow-ups */}
        <Card title="Follow-ups" subtitle={`${overdue.length} overdue · ${dueToday.length} due today`}>
          {overdue.length + dueToday.length === 0 ? (
            <EmptyState title="No follow-ups due" hint="The CRM Manager will surface them here." />
          ) : (
            <ul className="space-y-2">
              {[...overdue, ...dueToday].slice(0, 6).map((lead) => (
                <li key={lead.id} className="flex items-center justify-between gap-2">
                  <Link to={`/leads/${lead.id}`} className="text-sm font-medium text-slate-800 hover:text-brand-700">
                    {lead.name}
                  </Link>
                  <Badge tone={lead.nextFollowUp < today ? 'red' : 'yellow'}>
                    {lead.nextFollowUp < today ? `Overdue ${formatDate(lead.nextFollowUp)}` : 'Today'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* High-priority leads */}
        <Card title="High-priority leads" subtitle="Ranked by the Sales Assistant">
          {highPriority.length === 0 ? (
            <EmptyState title="No A-grade leads yet" />
          ) : (
            <ul className="space-y-3">
              {highPriority.map((r) => (
                <li key={r.lead.id}>
                  <div className="flex items-center justify-between gap-2">
                    <Link to={`/leads/${r.lead.id}`} className="text-sm font-medium text-slate-800 hover:text-brand-700">
                      {r.lead.name}
                    </Link>
                    <ScoreBadge score={r.score} grade={r.grade} />
                  </div>
                  <p className="text-xs text-slate-500">{r.nextAction}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recently added */}
        <Card title="Recently added leads">
          <ul className="space-y-2">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <Link to={`/leads/${lead.id}`} className="text-sm font-medium text-slate-800 hover:text-brand-700">
                    {lead.name}
                  </Link>
                  <p className="text-xs text-slate-400">{lead.source} · {formatDate((lead.createdAt || '').slice(0, 10))}</p>
                </div>
                <Badge tone={statusTone(lead.status)}>{lead.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        {/* Referral activity + appointments */}
        <Card title="Referral network" subtitle="Reconnect suggestions">
          {reconnects.length === 0 ? (
            <EmptyState title="Network is up to date" />
          ) : (
            <ul className="space-y-2.5">
              {reconnects.map((s) => (
                <li key={s.partner.id}>
                  <p className="text-sm font-medium text-slate-800">
                    {s.partner.name} <span className="font-normal text-slate-400">· {s.partner.type}</span>
                  </p>
                  <p className="text-xs text-slate-500">{s.reason}</p>
                </li>
              ))}
            </ul>
          )}
          <h3 className="mt-4 border-t border-slate-100 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Upcoming appointments
          </h3>
          {upcoming.length === 0 ? (
            <p className="mt-2 text-xs text-slate-400">Nothing scheduled.</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {upcoming.map((a) => (
                <li key={a.id} className="flex justify-between text-sm">
                  <span className="text-slate-700">{truncate(a.title, 32)}</span>
                  <span className="text-xs text-slate-500">{formatDate(a.date)} {a.time}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Pipeline funnel */}
        <Card title="Lead pipeline" subtitle="Open leads by stage">
          <ul className="space-y-2">
            {funnel.map((f) => (
              <li key={f.status}>
                <div className="mb-0.5 flex justify-between text-xs">
                  <span className="font-medium text-slate-600">{f.status}</span>
                  <span className="text-slate-500">{f.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-brand-500"
                    style={{ width: `${(f.count / maxFunnel) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* Today's content teaser */}
        <Card
          title="Content scheduled for today"
          subtitle={`Theme: ${content.theme}`}
          className="xl:col-span-3"
          action={<Link to="/content" className="text-xs font-medium text-brand-700 hover:underline">Open Content Engine →</Link>}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {content.videoIdeas.map((idea, i) => (
              <div key={i} className="rounded-lg bg-slate-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Video idea {i + 1}</p>
                <p className="mt-1 text-sm text-slate-700">{idea}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
