// ---------------------------------------------------------------------------
// Leads — searchable, filterable list of every lead with AI score and
// recommended next action. Supports add (modal form), CSV import and export.
// ---------------------------------------------------------------------------
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/StoreContext.jsx';
import { scoreLead } from '@/ai/leadScoring.js';
import { recommendNextAction } from '@/ai/salesAssistant.js';
import { LEAD_STATUSES, LEAD_SOURCES, GRADES } from '@/domain/constants.js';
import { toCSV, LEAD_COLUMNS, parseCSV, rowToLead, downloadFile } from '@/utils/csv.js';
import { formatDate, todayISO, isOverdue } from '@/utils/dates.js';
import { truncate } from '@/utils/format.js';
import PageHeader from '@/components/layout/PageHeader.jsx';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge, { statusTone } from '@/components/ui/Badge.jsx';
import Modal from '@/components/ui/Modal.jsx';
import LeadForm from '@/components/leads/LeadForm.jsx';
import ScoreBadge from '@/components/leads/ScoreBadge.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';

export default function Leads() {
  const { state, dispatch } = useStore();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [adding, setAdding] = useState(false);
  const fileRef = useRef(null);
  const today = todayISO();

  // Score every lead once per render pass; scoring is pure and cheap.
  const rows = useMemo(
    () =>
      state.leads.map((lead) => ({
        lead,
        scored: scoreLead(lead),
        nextAction: recommendNextAction(lead, today),
      })),
    [state.leads, today],
  );

  const filtered = rows
    .filter(({ lead, scored }) => {
      if (statusFilter !== 'All' && lead.status !== statusFilter) return false;
      if (sourceFilter !== 'All' && lead.source !== sourceFilter) return false;
      if (gradeFilter !== 'All' && scored.grade !== gradeFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${lead.name} ${lead.email} ${lead.phone} ${lead.suburb} ${lead.postcode} ${lead.notes}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => b.scored.score - a.scored.score);

  function exportCSV() {
    downloadFile(`northpath-leads-${today}.csv`, toCSV(state.leads, LEAD_COLUMNS));
  }

  function importCSV(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imported = parseCSV(String(reader.result)).map(rowToLead).filter((l) => l.name);
      if (imported.length) {
        dispatch({
          type: 'lead/importMany',
          payload: imported.map((l) => ({ status: 'New', source: 'CSV Import', owner: 'James', ...l })),
        });
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle={`${state.leads.length} total · scored automatically by the AI Lead Scoring engine`}
        actions={
          <>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={importCSV} />
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>Import CSV</Button>
            <Button variant="secondary" size="sm" onClick={exportCSV}>Export CSV</Button>
            <Button size="sm" onClick={() => setAdding(true)}>+ Add Lead</Button>
          </>
        }
      />

      {/* Filters */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <input
          className="field"
          placeholder="Search name, suburb, notes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="field" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="field" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
          <option>All</option>
          {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="field" value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option>All</option>
          {GRADES.map((g) => <option key={g}>{g}</option>)}
        </select>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <EmptyState title="No leads match" hint="Adjust the filters or add a new lead." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3">Lead</th>
                  <th className="py-2 pr-3">Score</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Location</th>
                  <th className="py-2 pr-3">Source</th>
                  <th className="py-2 pr-3">Next follow-up</th>
                  <th className="py-2">AI next action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(({ lead, scored, nextAction }) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-3">
                      <Link to={`/leads/${lead.id}`} className="font-medium text-slate-800 hover:text-brand-700">
                        {lead.name}
                      </Link>
                      <p className="text-xs text-slate-400">{lead.phone || lead.email || '—'}</p>
                    </td>
                    <td className="py-2.5 pr-3"><ScoreBadge score={scored.score} grade={scored.grade} /></td>
                    <td className="py-2.5 pr-3"><Badge tone={statusTone(lead.status)}>{lead.status}</Badge></td>
                    <td className="py-2.5 pr-3">
                      <span className="text-slate-700">{lead.suburb || '—'}</span>
                      <p className="text-xs text-slate-400">{scored.locationPriority} priority</p>
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600">{lead.source}</td>
                    <td className="py-2.5 pr-3">
                      {lead.nextFollowUp ? (
                        <span className={isOverdue(lead.nextFollowUp, today) ? 'font-medium text-rose-600' : 'text-slate-600'}>
                          {formatDate(lead.nextFollowUp)}
                        </span>
                      ) : (
                        <span className="text-slate-400">Not set</span>
                      )}
                    </td>
                    <td className="py-2.5 text-xs text-slate-500">{truncate(nextAction, 60)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal open={adding} title="Add Lead" onClose={() => setAdding(false)} wide>
        <LeadForm
          onSave={(lead) => {
            dispatch({ type: 'lead/add', payload: lead });
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      </Modal>
    </div>
  );
}
