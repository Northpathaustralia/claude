// ---------------------------------------------------------------------------
// Business Command Centre: portfolio view. NorthPath's card is live (real
// numbers from the NorthPath workspace store); other businesses are real
// records James maintains, with honest "no data connected" states instead of
// fake dashboards.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/StoreContext.jsx';
import { useAtlas } from '../../store/AtlasStoreContext.jsx';
import { reviewLeads } from '../../ai/salesAssistant.js';
import { pipelineValue } from '../../ai/businessAnalyst.js';
import { OPEN_STATUSES } from '../../domain/constants.js';
import { formatCurrency } from '../../utils/format.js';
import StatusBadge from '../../components/atlas/StatusBadge.jsx';

const CATEGORIES = ['Children\'s books', 'Property development', 'Fitness & gym', 'Technology', 'Marketing', 'Investment', 'Other'];

export default function Business() {
  const { state: npaos } = useStore();
  const { atlas, dispatchAtlas } = useAtlas();
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const openLeads = npaos.leads.filter((l) => OPEN_STATUSES.includes(l.status));
  const ranked = reviewLeads(npaos.leads);
  const aGrade = ranked.filter((r) => r.grade === 'A+' || r.grade === 'A').length;
  const urgent = ranked.filter((r) => r.overdue || r.dueToday).length;
  const pipeline = pipelineValue(npaos.leads);

  function addBusiness(e) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatchAtlas({ type: 'business/add', payload: { name: name.trim(), category, summary: '', nextAction: '' } });
    setName('');
  }

  return (
    <div className="min-h-screen bg-navy-950 p-4 text-navy-100 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-white">Business Command Centre</h1>
          <p className="text-xs text-navy-300">Every business as a card. Real numbers only — a business with no connected data says so.</p>
        </div>

        {/* NorthPath live card */}
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-navy-900 to-navy-850 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">NorthPath</h2>
                <StatusBadge status="working" label="Live workspace" />
              </div>
              <p className="text-xs text-navy-300">Lead generation, qualification and conversion — full workspace built in.</p>
            </div>
            <Link to="/northpath" className="btn-emerald text-xs">Open workspace →</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-navy-900/80 p-3">
              <p className="text-[10px] uppercase tracking-wide text-navy-400">Open leads</p>
              <p className="text-xl font-bold text-white">{openLeads.length}</p>
            </div>
            <div className="rounded-xl bg-navy-900/80 p-3">
              <p className="text-[10px] uppercase tracking-wide text-navy-400">A-grade</p>
              <p className="text-xl font-bold text-emerald-400">{aGrade}</p>
            </div>
            <div className="rounded-xl bg-navy-900/80 p-3">
              <p className="text-[10px] uppercase tracking-wide text-navy-400">Follow-ups due</p>
              <p className={`text-xl font-bold ${urgent ? 'text-amber-400' : 'text-white'}`}>{urgent}</p>
            </div>
            <div className="rounded-xl bg-navy-900/80 p-3" title="Open pipeline × estimated value per conversion — an internal planning estimate, not revenue">
              <p className="text-[10px] uppercase tracking-wide text-navy-400">Pipeline (est.)</p>
              <p className="text-xl font-bold text-white">{formatCurrency(pipeline)}</p>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-navy-500">Pipeline is an internal planning estimate (open leads × standard value), not booked revenue.</p>
        </div>

        {/* Other businesses */}
        <form onSubmit={addBusiness} className="mb-4 flex flex-wrap gap-2">
          <input className="field-dark max-w-xs" placeholder="Add a business or venture…" value={name} onChange={(e) => setName(e.target.value)} />
          <select className="field-dark !w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button type="submit" className="btn-emerald">Add</button>
        </form>

        <div className="grid gap-3 sm:grid-cols-2">
          {atlas.businesses.map((b) => (
            <div key={b.id} className="atlas-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">{b.name}</h3>
                  <p className="text-[11px] text-navy-400">{b.category}</p>
                </div>
                <button type="button" className="text-navy-500 hover:text-red-400" onClick={() => window.confirm(`Remove ${b.name}?`) && dispatchAtlas({ type: 'business/remove', id: b.id })}>✕</button>
              </div>
              <label className="field-label mt-2 !text-navy-400">Status summary</label>
              <textarea
                rows={2}
                className="field-dark"
                placeholder="Where is this business at right now?"
                value={b.summary}
                onChange={(e) => dispatchAtlas({ type: 'business/update', id: b.id, payload: { summary: e.target.value } })}
              />
              <label className="field-label mt-2 !text-navy-400">Next action</label>
              <input
                className="field-dark"
                placeholder="The single next step"
                value={b.nextAction}
                onChange={(e) => dispatchAtlas({ type: 'business/update', id: b.id, payload: { nextAction: e.target.value } })}
              />
              <div className="mt-2 flex items-center justify-between">
                <StatusBadge status="neutral" label="No live data connected" />
                <Link to="/chat/new" className="text-[11px] font-medium text-emerald-400 hover:underline">Ask Atlas about this →</Link>
              </div>
            </div>
          ))}
          {atlas.businesses.length === 0 && (
            <div className="atlas-card text-sm text-navy-400 sm:col-span-2">
              Add your other ventures (children's books, property, gym…) to track them alongside NorthPath. Dashboards fill with real data as integrations arrive — never with made-up numbers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
