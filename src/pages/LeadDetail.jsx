// ---------------------------------------------------------------------------
// Lead detail — full profile, AI score breakdown, recommended next action and
// one-click compliant follow-up drafts (SMS + email) James can copy and send.
// Nothing is ever sent automatically: James stays in control of every
// customer-facing action.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '@/store/StoreContext.jsx';
import { scoreLead } from '@/ai/leadScoring.js';
import { recommendNextAction, draftFollowUp } from '@/ai/salesAssistant.js';
import { suggestFollowUpDate } from '@/ai/crmManager.js';
import { formatCurrency } from '@/utils/format.js';
import { formatDate, todayISO } from '@/utils/dates.js';
import PageHeader from '@/components/layout/PageHeader.jsx';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge, { statusTone } from '@/components/ui/Badge.jsx';
import Modal from '@/components/ui/Modal.jsx';
import LeadForm from '@/components/leads/LeadForm.jsx';
import ScoreBadge from '@/components/leads/ScoreBadge.jsx';

const FACTOR_LABELS = {
  income: 'Income',
  employment: 'Employment stability',
  debt: 'Debt profile',
  credit: 'Credit profile',
  timeframe: 'Buying timeframe',
  location: 'Location & affordability',
};

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value || '—'}</span>
    </div>
  );
}

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState('');
  const today = todayISO();

  const lead = state.leads.find((l) => l.id === id);
  if (!lead) {
    return (
      <div>
        <PageHeader title="Lead not found" />
        <Link to="/leads" className="text-sm text-brand-700 hover:underline">← Back to leads</Link>
      </div>
    );
  }

  const scored = scoreLead(lead);
  const nextAction = recommendNextAction(lead, today);
  const smsDraft = draftFollowUp(lead, 'sms');
  const emailDraft = draftFollowUp(lead, 'email');

  async function copy(text, label) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      // Clipboard unavailable (permissions) — user can select the text manually.
    }
  }

  function scheduleSuggested() {
    dispatch({ type: 'lead/update', id: lead.id, payload: { nextFollowUp: suggestFollowUpDate(lead, today) } });
  }

  return (
    <div>
      <PageHeader
        title={lead.name}
        subtitle={
          <span className="inline-flex flex-wrap items-center gap-2">
            <Badge tone={statusTone(lead.status)}>{lead.status}</Badge>
            <ScoreBadge score={scored.score} grade={scored.grade} />
            <span className="text-slate-400">· {lead.source}</span>
          </span>
        }
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Edit</Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm(`Delete ${lead.name}? This cannot be undone.`)) {
                  dispatch({ type: 'lead/remove', id: lead.id });
                  navigate('/leads');
                }
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Profile */}
        <Card title="Profile">
          <DetailRow label="Phone" value={lead.phone} />
          <DetailRow label="Email" value={lead.email} />
          <DetailRow label="Suburb" value={lead.suburb} />
          <DetailRow label="Postcode" value={lead.postcode} />
          <DetailRow label="State" value={lead.state} />
          <DetailRow label="Employment" value={lead.employment} />
          <DetailRow label="Income" value={formatCurrency(lead.income)} />
          <DetailRow label="Partner income" value={formatCurrency(lead.partnerIncome)} />
          <DetailRow label="Monthly unsecured debt" value={formatCurrency(lead.monthlyUnsecuredDebt)} />
          <DetailRow label="Buying timeframe" value={lead.buyingTimeframe} />
          <DetailRow label="Credit profile" value={lead.creditProfile} />
          <DetailRow label="Lead owner" value={lead.owner} />
          <DetailRow label="Next follow-up" value={lead.nextFollowUp ? formatDate(lead.nextFollowUp) : 'Not set'} />
          {lead.notes && (
            <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              <p className="field-label">Notes</p>
              {lead.notes}
            </div>
          )}
        </Card>

        {/* AI analysis */}
        <Card title="AI score breakdown" subtitle="Internal prioritisation only — never a promise of eligibility or approval">
          <ul className="space-y-2.5">
            {scored.breakdown.map((b) => (
              <li key={b.factor}>
                <div className="mb-0.5 flex justify-between text-xs">
                  <span className="font-medium text-slate-600">{FACTOR_LABELS[b.factor]}</span>
                  <span className="text-slate-500">{b.points}/{b.weight}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100">
                  <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${(b.points / b.weight) * 100}%` }} />
                </div>
                <p className="mt-0.5 text-xs text-slate-400">{b.note}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-lg border border-brand-100 bg-brand-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Recommended next action</p>
            <p className="mt-1 text-sm text-brand-900">{nextAction}</p>
            <Button size="sm" variant="secondary" className="mt-2" onClick={scheduleSuggested}>
              Schedule suggested follow-up ({formatDate(suggestFollowUpDate(lead, today))})
            </Button>
          </div>
        </Card>

        {/* Follow-up drafts */}
        <Card title="Follow-up drafts" subtitle="Drafted by the Sales Assistant — review, personalise, and send it yourself">
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="field-label mb-0">SMS draft</p>
                <Button size="sm" variant="ghost" onClick={() => copy(smsDraft, 'sms')}>
                  {copied === 'sms' ? 'Copied ✓' : 'Copy'}
                </Button>
              </div>
              <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{smsDraft}</p>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="field-label mb-0">Email draft</p>
                <Button size="sm" variant="ghost" onClick={() => copy(emailDraft, 'email')}>
                  {copied === 'email' ? 'Copied ✓' : 'Copy'}
                </Button>
              </div>
              <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{emailDraft}</p>
            </div>
          </div>
        </Card>
      </div>

      <Modal open={editing} title={`Edit ${lead.name}`} onClose={() => setEditing(false)} wide>
        <LeadForm
          initial={lead}
          onSave={(patch) => {
            dispatch({ type: 'lead/update', id: lead.id, payload: patch });
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </Modal>
    </div>
  );
}
