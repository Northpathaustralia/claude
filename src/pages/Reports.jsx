// ---------------------------------------------------------------------------
// Reports — the Business Analyst's workspace.
// KPIs, weekly lead trend, source performance, pipeline, content themes,
// partner leaderboard and plain-English improvement suggestions.
// ---------------------------------------------------------------------------
import { useStore } from '@/store/StoreContext.jsx';
import {
  periodKPIs,
  leadSourcePerformance,
  pipelineByStatus,
  pipelineValue,
  weeklyTrend,
  suggestImprovements,
} from '@/ai/businessAnalyst.js';
import { analyseContentPerformance } from '@/ai/marketingManager.js';
import { rankPartners } from '@/ai/referralManager.js';
import { LEAD_STATUSES } from '@/domain/constants.js';
import { todayISO, formatDate } from '@/utils/dates.js';
import { formatCurrency, formatPercent } from '@/utils/format.js';
import PageHeader from '@/components/layout/PageHeader.jsx';
import Card from '@/components/ui/Card.jsx';
import StatTile from '@/components/ui/StatTile.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';

/** Simple horizontal bar list — avoids a chart dependency at this stage. */
function BarList({ items, labelKey, valueKey, format = (v) => v }) {
  const max = Math.max(...items.map((i) => Number(i[valueKey]) || 0), 1);
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item[labelKey]}>
          <div className="mb-0.5 flex justify-between text-xs">
            <span className="font-medium text-slate-600">{item[labelKey]}</span>
            <span className="text-slate-500">{format(item[valueKey])}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-brand-500"
              style={{ width: `${((Number(item[valueKey]) || 0) / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Reports() {
  const { state } = useStore();
  const { leads, partners, contentItems } = state;
  const today = todayISO();

  const kpis = periodKPIs(leads, today);
  const sources = leadSourcePerformance(leads);
  const funnel = pipelineByStatus(leads, LEAD_STATUSES);
  const trend = weeklyTrend(leads, 8, today);
  const themes = analyseContentPerformance(contentItems);
  const topPartners = rankPartners(partners).slice(0, 5);
  const improvements = suggestImprovements({ leads, partners, contentItems }, today);
  const maxTrend = Math.max(...trend.map((t) => t.count), 1);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Compiled by your Business Analyst" />

      {/* Weekly vs monthly KPI tiles */}
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="New leads" value={kpis.weekly.newLeads} sub={`Month: ${kpis.monthly.newLeads}`} />
        <StatTile label="Consultations booked" value={kpis.weekly.consultationsBooked} sub={`Month: ${kpis.monthly.consultationsBooked}`} tone="good" />
        <StatTile label="Conversion rate" value={formatPercent(kpis.monthly.conversionRate)} sub="This month, lead → consult" />
        <StatTile label="Pipeline value (est.)" value={formatCurrency(pipelineValue(leads))} sub="Planning estimate only" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {/* Weekly trend */}
        <Card title="New leads — 8 week trend">
          <div className="flex h-36 items-end gap-2">
            {trend.map((t) => (
              <div key={t.weekStart} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-slate-600">{t.count}</span>
                <div
                  className="w-full rounded-t bg-brand-400"
                  style={{ height: `${(t.count / maxTrend) * 100}%`, minHeight: t.count ? 4 : 1 }}
                />
                <span className="text-[9px] text-slate-400">{formatDate(t.weekStart).replace(/^\w+ /, '')}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Source performance */}
        <Card title="Lead source performance" subtitle="Consultations booked per source">
          {sources.length === 0 ? (
            <EmptyState title="No lead data yet" />
          ) : (
            <BarList
              items={sources.map((s) => ({ ...s, label: `${s.source} (${formatPercent(s.rate)} of ${s.leads})` }))}
              labelKey="label"
              valueKey="consultations"
            />
          )}
        </Card>

        {/* Full pipeline */}
        <Card title="Full pipeline by status">
          <BarList items={funnel.filter((f) => f.count > 0)} labelKey="status" valueKey="count" />
        </Card>

        {/* Content themes */}
        <Card title="Top-performing content themes" subtitle="Leads weighted 10× over raw engagement">
          {themes.length === 0 ? (
            <EmptyState title="Log content on the Content Engine page" />
          ) : (
            <BarList items={themes} labelKey="theme" valueKey="performanceScore" />
          )}
        </Card>

        {/* Partner leaderboard */}
        <Card title="Referral partner leaderboard">
          {topPartners.length === 0 ? (
            <EmptyState title="No partners yet" />
          ) : (
            <ul className="divide-y divide-slate-100">
              {topPartners.map((p, i) => (
                <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-slate-700">
                    <span className="mr-1.5 font-bold text-brand-600">#{i + 1}</span>
                    {p.name} <span className="text-slate-400">· {p.type}</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    {p.totalReferrals || 0} referrals · {formatCurrency(p.potentialValue)} potential
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Improvement suggestions */}
        <Card title="Bottlenecks & suggested improvements" subtitle="Plain-English analysis, ordered by impact">
          <ul className="space-y-3">
            {improvements.map((s) => (
              <li key={s.area} className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{s.area}</p>
                <p className="mt-0.5 text-sm text-slate-700">{s.insight}</p>
                <p className="mt-1 text-sm font-medium text-slate-800">→ {s.action}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
