// ---------------------------------------------------------------------------
// Financial Command Centre foundation. Manual monthly tracking is real and
// working (numbers James enters himself, summed honestly). Trading bots,
// broker balances and account feeds are Planned — shown as such, never faked.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { formatCurrency } from '../../utils/format.js';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

const PLANNED_MODULES = [
  'Connected broker balances & open positions',
  'Trading bot monitoring with drawdown limits and manual override',
  'Xero / MYOB / QuickBooks read-only summaries',
  'Cash-flow forecasts and buffer alerts',
  'Net worth tracking across entities',
];

export default function Finance() {
  const { atlas, dispatchAtlas } = useAtlas();
  const [form, setForm] = useState({ business: 'NorthPath', month: new Date().toISOString().slice(0, 7), revenue: '', expenses: '', note: '' });

  const entries = [...atlas.financeEntries].sort((a, b) => (b.month || '').localeCompare(a.month || ''));
  const totals = entries.reduce(
    (acc, e) => ({ revenue: acc.revenue + (Number(e.revenue) || 0), expenses: acc.expenses + (Number(e.expenses) || 0) }),
    { revenue: 0, expenses: 0 },
  );

  const businesses = ['NorthPath', ...atlas.businesses.map((b) => b.name)];

  function add(e) {
    e.preventDefault();
    if (!form.month || (form.revenue === '' && form.expenses === '')) return;
    dispatchAtlas({
      type: 'finance/add',
      payload: { ...form, revenue: Number(form.revenue) || 0, expenses: Number(form.expenses) || 0 },
    });
    setForm({ ...form, revenue: '', expenses: '', note: '' });
  }

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">Financial Command Centre</h1>
          <p className="text-xs text-navy-300">
            Manual tracking <StatusBadge status="working" /> · Account & trading connections <StatusBadge status="planned" />
          </p>
        </div>

        <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 text-[11px] leading-4 text-amber-200/80">
          Educational analysis only — Atlas never promises returns, never presents estimates as verified figures, and every future trading feature will require explicit confirmation before any money moves. Read-only comes first.
        </div>

        {/* Totals from real manual entries */}
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="atlas-card">
            <p className="text-[10px] uppercase tracking-wide text-navy-400">Recorded revenue</p>
            <p className="text-lg font-bold text-white">{formatCurrency(totals.revenue)}</p>
          </div>
          <div className="atlas-card">
            <p className="text-[10px] uppercase tracking-wide text-navy-400">Recorded expenses</p>
            <p className="text-lg font-bold text-white">{formatCurrency(totals.expenses)}</p>
          </div>
          <div className="atlas-card">
            <p className="text-[10px] uppercase tracking-wide text-navy-400">Net</p>
            <p className={`text-lg font-bold ${totals.revenue - totals.expenses >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{formatCurrency(totals.revenue - totals.expenses)}</p>
          </div>
        </div>

        {/* Entry form */}
        <form onSubmit={add} className="atlas-card mb-4 grid grid-cols-2 gap-2 sm:grid-cols-6">
          <div className="col-span-2 sm:col-span-1">
            <label className="field-label !text-navy-400">Business</label>
            <select className="field-dark" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })}>
              {businesses.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label !text-navy-400">Month</label>
            <input type="month" className="field-dark" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} />
          </div>
          <div>
            <label className="field-label !text-navy-400">Revenue</label>
            <input type="number" min="0" step="0.01" className="field-dark" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} />
          </div>
          <div>
            <label className="field-label !text-navy-400">Expenses</label>
            <input type="number" min="0" step="0.01" className="field-dark" value={form.expenses} onChange={(e) => setForm({ ...form, expenses: e.target.value })} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="field-label !text-navy-400">Note</label>
            <input className="field-dark" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-emerald w-full">Add</button>
          </div>
        </form>

        {/* Entries */}
        {entries.length > 0 ? (
          <div className="atlas-card mb-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wide text-navy-400">
                  <th className="py-1.5 pr-3">Month</th>
                  <th className="py-1.5 pr-3">Business</th>
                  <th className="py-1.5 pr-3">Revenue</th>
                  <th className="py-1.5 pr-3">Expenses</th>
                  <th className="py-1.5 pr-3">Note</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-t border-navy-800 text-navy-200">
                    <td className="py-1.5 pr-3">{e.month}</td>
                    <td className="py-1.5 pr-3">{e.business}</td>
                    <td className="py-1.5 pr-3">{formatCurrency(e.revenue)}</td>
                    <td className="py-1.5 pr-3">{formatCurrency(e.expenses)}</td>
                    <td className="py-1.5 pr-3 text-navy-400">{e.note}</td>
                    <td className="py-1.5 text-right">
                      <button type="button" className="text-navy-500 hover:text-red-400" onClick={() => dispatchAtlas({ type: 'finance/remove', id: e.id })}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="atlas-card mb-4 text-sm text-navy-400">No entries yet — add your first month above. These are your numbers, summed honestly; nothing is estimated for you.</div>
        )}

        {/* Planned modules */}
        <div className="atlas-card">
          <h2 className="mb-2 text-sm font-semibold text-white">On the roadmap</h2>
          <div className="space-y-1.5">
            {PLANNED_MODULES.map((m) => (
              <div key={m} className="flex items-center justify-between gap-2 text-xs text-navy-300">
                <span>{m}</span>
                <StatusBadge status="planned" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
