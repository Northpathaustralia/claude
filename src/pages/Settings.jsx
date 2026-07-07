// ---------------------------------------------------------------------------
// Settings & Data — export/import the full dataset, manage seed data, and
// document the integration-ready data model for future connections
// (HubSpot, Google Calendar/Contacts, Zapier, Make.com, Meta Lead Forms).
// ---------------------------------------------------------------------------
import { useRef, useState } from 'react';
import { useStore } from '@/store/StoreContext.jsx';
import { downloadFile, toCSV, LEAD_COLUMNS } from '@/utils/csv.js';
import { todayISO } from '@/utils/dates.js';
import { DISCLAIMER } from '@/utils/compliance.js';
import PageHeader from '@/components/layout/PageHeader.jsx';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';

const INTEGRATIONS = [
  { name: 'HubSpot', how: 'Lead CSV export maps 1:1 onto HubSpot contact properties; JSON export mirrors a contacts+deals import payload.' },
  { name: 'Google Calendar', how: 'Appointments carry ISO date/time fields ready for the Calendar events API.' },
  { name: 'Google Contacts', how: 'Lead name/phone/email/suburb map directly to the People API schema.' },
  { name: 'Email & SMS', how: 'Follow-up drafts are plain text — connect any provider (SendGrid, Twilio) and pass them through.' },
  { name: 'Zapier / Make.com', how: 'The JSON export is a flat, versioned schema (npaos.v1) — a webhook can post the same shape per record.' },
  { name: 'Website & Meta Lead Forms', how: 'New-lead payloads only need the lead fields listed in the CSV header — point a form webhook at the same schema.' },
];

export default function Settings() {
  const { state, dispatch } = useStore();
  const fileRef = useRef(null);
  const [message, setMessage] = useState('');
  const today = todayISO();

  function exportJSON() {
    downloadFile(`npaos-backup-${today}.json`, JSON.stringify(state, null, 2), 'application/json');
    setMessage('Full backup exported.');
  }

  function importJSON(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || typeof data !== 'object' || !Array.isArray(data.leads)) {
          throw new Error('Not a valid NPAOS backup');
        }
        dispatch({ type: 'state/replace', payload: data });
        setMessage(`Imported ${data.leads.length} leads and related records.`);
      } catch {
        setMessage('Import failed — that file is not a valid NPAOS backup.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  }

  return (
    <div>
      <PageHeader title="Settings & Data" subtitle="Backups, resets and the integration roadmap" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title="Data management" subtitle="Everything lives in your browser (localStorage) — export regularly">
          <div className="flex flex-wrap gap-2">
            <Button onClick={exportJSON}>Export full backup (JSON)</Button>
            <Button variant="secondary" onClick={() => downloadFile(`northpath-leads-${today}.csv`, toCSV(state.leads, LEAD_COLUMNS))}>
              Export leads (CSV)
            </Button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={importJSON} />
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>Import backup (JSON)</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                if (window.confirm('Replace all current data with the demo seed data?')) {
                  dispatch({ type: 'state/resetToSeed' });
                  setMessage('Demo data restored.');
                }
              }}
            >
              Restore demo data
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm('Delete ALL data? Export a backup first — this cannot be undone.')) {
                  dispatch({ type: 'state/clearAll' });
                  setMessage('All data cleared.');
                }
              }}
            >
              Clear all data
            </Button>
          </div>
          {message && <p className="mt-3 text-sm font-medium text-brand-700">{message}</p>}
          <p className="mt-3 text-xs text-slate-400">
            Current data: {state.leads.length} leads · {state.partners.length} partners · {state.tasks.length} tasks ·{' '}
            {state.contentItems.length} content items · {state.appointments.length} appointments
          </p>
        </Card>

        <Card title="Future integrations" subtitle="The data model is already shaped for these connections">
          <ul className="space-y-2.5">
            {INTEGRATIONS.map((i) => (
              <li key={i.name} className="text-sm">
                <span className="font-semibold text-slate-800">{i.name}:</span>{' '}
                <span className="text-slate-600">{i.how}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Compliance commitments" className="xl:col-span-2">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
            <li>NPAOS never promises approvals or guarantees outcomes — the compliance guard scans and rewrites generated content.</li>
            <li>All customer-facing actions (messages, posts, emails) are drafts that James reviews and sends personally.</li>
            <li>Lead scores are internal prioritisation signals only, never statements of eligibility.</li>
            <li>Standard disclaimer appended to educational content: <em className="text-slate-500">“{DISCLAIMER}”</em></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
