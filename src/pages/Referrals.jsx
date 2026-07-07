// ---------------------------------------------------------------------------
// Referral Partners — the Referral Manager's workspace.
// Partner database with meeting/referral tracking, weekly reconnect
// suggestions and a ranked partner leaderboard.
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { useStore } from '@/store/StoreContext.jsx';
import { suggestReconnects, rankPartners, partnerStrength } from '@/ai/referralManager.js';
import { REFERRAL_PARTNER_TYPES } from '@/domain/constants.js';
import { todayISO, formatDate } from '@/utils/dates.js';
import { formatCurrency } from '@/utils/format.js';
import PageHeader from '@/components/layout/PageHeader.jsx';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import Badge from '@/components/ui/Badge.jsx';
import Modal from '@/components/ui/Modal.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';

const EMPTY_PARTNER = {
  name: '', company: '', type: 'Accountant', phone: '', email: '',
  lastMeeting: '', lastReferral: '', totalReferrals: 0, potentialValue: '',
  nextFollowUp: '', notes: '',
};

function strengthTone(strength) {
  return strength === 'strong' ? 'green' : strength === 'warm' ? 'yellow' : 'gray';
}

function PartnerForm({ initial, onSave, onCancel }) {
  const [draft, setDraft] = useState({ ...EMPTY_PARTNER, ...initial });
  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...draft,
          totalReferrals: Number(draft.totalReferrals) || 0,
          potentialValue: Number(draft.potentialValue) || 0,
          lastMeeting: draft.lastMeeting || null,
          lastReferral: draft.lastReferral || null,
          nextFollowUp: draft.nextFollowUp || null,
        });
      }}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      <label className="block"><span className="field-label">Name *</span>
        <input required className="field" value={draft.name} onChange={set('name')} /></label>
      <label className="block"><span className="field-label">Company</span>
        <input className="field" value={draft.company} onChange={set('company')} /></label>
      <label className="block"><span className="field-label">Type</span>
        <select className="field" value={draft.type} onChange={set('type')}>
          {REFERRAL_PARTNER_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select></label>
      <label className="block"><span className="field-label">Phone</span>
        <input className="field" value={draft.phone} onChange={set('phone')} /></label>
      <label className="block"><span className="field-label">Email</span>
        <input type="email" className="field" value={draft.email} onChange={set('email')} /></label>
      <label className="block"><span className="field-label">Potential value ($/yr)</span>
        <input type="number" min="0" className="field" value={draft.potentialValue} onChange={set('potentialValue')} /></label>
      <label className="block"><span className="field-label">Last meeting</span>
        <input type="date" className="field" value={draft.lastMeeting || ''} onChange={set('lastMeeting')} /></label>
      <label className="block"><span className="field-label">Last referral</span>
        <input type="date" className="field" value={draft.lastReferral || ''} onChange={set('lastReferral')} /></label>
      <label className="block"><span className="field-label">Total referrals</span>
        <input type="number" min="0" className="field" value={draft.totalReferrals} onChange={set('totalReferrals')} /></label>
      <label className="block"><span className="field-label">Next follow-up</span>
        <input type="date" className="field" value={draft.nextFollowUp || ''} onChange={set('nextFollowUp')} /></label>
      <div className="sm:col-span-2">
        <label className="block"><span className="field-label">Notes</span>
          <textarea rows={2} className="field" value={draft.notes} onChange={set('notes')} /></label>
      </div>
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Partner</Button>
      </div>
    </form>
  );
}

export default function Referrals() {
  const { state, dispatch } = useStore();
  const today = todayISO();
  const [editing, setEditing] = useState(null); // null | 'new' | partner object
  const reconnects = suggestReconnects(state.partners, today);
  const ranked = rankPartners(state.partners);

  /** Record a meeting or referral held today — one click from the table. */
  function logToday(partner, field) {
    const patch = { [field]: today };
    if (field === 'lastReferral') patch.totalReferrals = (partner.totalReferrals || 0) + 1;
    dispatch({ type: 'partner/update', id: partner.id, payload: patch });
  }

  return (
    <div>
      <PageHeader
        title="Referral Partners"
        subtitle={`${state.partners.length} partners tracked by the Referral Manager`}
        actions={<Button size="sm" onClick={() => setEditing('new')}>+ Add Partner</Button>}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Who to contact this week */}
        <Card title="Who to contact this week" subtitle="Suggested by the Referral Manager">
          {reconnects.length === 0 ? (
            <EmptyState title="Network is up to date" hint="All partners are within their contact cadence." />
          ) : (
            <ul className="space-y-3">
              {reconnects.map((s) => (
                <li key={s.partner.id} className="rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800">{s.partner.name}</p>
                    <Badge tone={strengthTone(s.strength)}>{s.strength}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{s.partner.company} · {s.partner.type}</p>
                  <p className="mt-1 text-xs text-slate-600">{s.reason}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Partner table */}
        <Card title="Partner database" className="xl:col-span-2">
          {ranked.length === 0 ? (
            <EmptyState title="No partners yet" hint="Add accountants, brokers, conveyancers and other referrers." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Partner</th>
                    <th className="py-2 pr-3">Type</th>
                    <th className="py-2 pr-3">Last meeting</th>
                    <th className="py-2 pr-3">Last referral</th>
                    <th className="py-2 pr-3">Referrals</th>
                    <th className="py-2 pr-3">Potential value</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ranked.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-2.5 pr-3">
                        <p className="font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.company}</p>
                      </td>
                      <td className="py-2.5 pr-3">
                        <Badge tone={strengthTone(partnerStrength(p))}>{p.type}</Badge>
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">{p.lastMeeting ? formatDate(p.lastMeeting) : '—'}</td>
                      <td className="py-2.5 pr-3 text-slate-600">{p.lastReferral ? formatDate(p.lastReferral) : '—'}</td>
                      <td className="py-2.5 pr-3 font-medium text-slate-700">{p.totalReferrals || 0}</td>
                      <td className="py-2.5 pr-3 text-slate-600">{formatCurrency(p.potentialValue)}</td>
                      <td className="py-2.5">
                        <div className="flex flex-wrap gap-1">
                          <Button size="sm" variant="ghost" onClick={() => logToday(p, 'lastMeeting')}>Met today</Button>
                          <Button size="sm" variant="ghost" onClick={() => logToday(p, 'lastReferral')}>+Referral</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditing(p)}>Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={editing !== null}
        title={editing === 'new' ? 'Add Referral Partner' : `Edit ${editing?.name}`}
        onClose={() => setEditing(null)}
        wide
      >
        <PartnerForm
          initial={editing === 'new' ? undefined : editing}
          onSave={(partner) => {
            if (editing === 'new') dispatch({ type: 'partner/add', payload: partner });
            else dispatch({ type: 'partner/update', id: editing.id, payload: partner });
            setEditing(null);
          }}
          onCancel={() => setEditing(null)}
        />
      </Modal>
    </div>
  );
}
