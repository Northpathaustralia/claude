// Add/edit lead form. Controlled inputs over a local draft; parent receives
// the cleaned lead object on save. Used inside a Modal by the Leads page.
import { useState } from 'react';
import {
  LEAD_STATUSES,
  LEAD_SOURCES,
  EMPLOYMENT_TYPES,
  BUYING_TIMEFRAMES,
  CREDIT_PROFILES,
  STATES,
} from '@/domain/constants.js';
import Button from '@/components/ui/Button.jsx';

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  suburb: '',
  postcode: '',
  state: 'QLD',
  employment: '',
  income: '',
  partnerIncome: '',
  monthlyUnsecuredDebt: '',
  buyingTimeframe: '',
  creditProfile: 'Unknown',
  source: 'Manual Entry',
  status: 'New',
  owner: 'James',
  nextFollowUp: '',
  notes: '',
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

export default function LeadForm({ initial, onSave, onCancel }) {
  const [draft, setDraft] = useState({ ...EMPTY, ...initial });
  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...draft,
      income: draft.income === '' ? '' : Number(draft.income),
      partnerIncome: draft.partnerIncome === '' ? '' : Number(draft.partnerIncome),
      monthlyUnsecuredDebt: draft.monthlyUnsecuredDebt === '' ? '' : Number(draft.monthlyUnsecuredDebt),
      nextFollowUp: draft.nextFollowUp || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Field label="Name *">
        <input required className="field" value={draft.name} onChange={set('name')} placeholder="Full name" />
      </Field>
      <Field label="Phone">
        <input className="field" value={draft.phone} onChange={set('phone')} placeholder="04xx xxx xxx" />
      </Field>
      <Field label="Email">
        <input type="email" className="field" value={draft.email} onChange={set('email')} placeholder="name@email.com" />
      </Field>
      <Field label="Lead Source">
        <select className="field" value={draft.source} onChange={set('source')}>
          {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>

      <Field label="Suburb">
        <input className="field" value={draft.suburb} onChange={set('suburb')} placeholder="e.g. Ipswich" />
      </Field>
      <Field label="Postcode">
        <input className="field" value={draft.postcode} onChange={set('postcode')} placeholder="e.g. 4305" />
      </Field>
      <Field label="State">
        <select className="field" value={draft.state} onChange={set('state')}>
          {STATES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Employment">
        <select className="field" value={draft.employment} onChange={set('employment')}>
          <option value="">— Select —</option>
          {EMPLOYMENT_TYPES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>

      <Field label="Income (annual, $)">
        <input type="number" min="0" className="field" value={draft.income} onChange={set('income')} />
      </Field>
      <Field label="Partner Income (annual, $)">
        <input type="number" min="0" className="field" value={draft.partnerIncome} onChange={set('partnerIncome')} />
      </Field>
      <Field label="Monthly Unsecured Debt ($)">
        <input
          type="number"
          min="0"
          className="field"
          value={draft.monthlyUnsecuredDebt}
          onChange={set('monthlyUnsecuredDebt')}
          placeholder="Car, cards, BNPL, ATO plans"
        />
      </Field>
      <Field label="Buying Timeframe">
        <select className="field" value={draft.buyingTimeframe} onChange={set('buyingTimeframe')}>
          <option value="">— Select —</option>
          {BUYING_TIMEFRAMES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>

      <Field label="Credit Profile">
        <select className="field" value={draft.creditProfile} onChange={set('creditProfile')}>
          {CREDIT_PROFILES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Status">
        <select className="field" value={draft.status} onChange={set('status')}>
          {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Next Follow-Up">
        <input type="date" className="field" value={draft.nextFollowUp || ''} onChange={set('nextFollowUp')} />
      </Field>
      <Field label="Lead Owner">
        <input className="field" value={draft.owner} onChange={set('owner')} />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Notes">
          <textarea rows={3} className="field" value={draft.notes} onChange={set('notes')} />
        </Field>
      </div>

      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Lead</Button>
      </div>
    </form>
  );
}
