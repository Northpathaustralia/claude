import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMonitors, FREE_TIER_MONITOR_LIMIT } from '../context/MonitorsContext.jsx';
import { uptimePercent, averageResponseMs, currentStatus, deriveIncidents, isMixedContentRisk } from '../lib/monitor.js';
import { buildStatusPageHtml } from '../lib/statusPage.js';
import { Btn, Card, Kicker, Section, StatusDot } from '../components/ui.jsx';

function formatDuration(ms) {
  if (ms == null) return 'ongoing';
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return `${m}m ${rs}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function formatTime(ms) {
  if (ms == null) return '';
  return new Date(ms).toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' });
}

function AddMonitorForm() {
  const { addMonitor, monitors } = useMonitors();
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const atLimit = monitors.length >= FREE_TIER_MONITOR_LIMIT;

  const submit = (e) => {
    e.preventDefault();
    const result = addMonitor(name, url);
    if (!result.ok) { setError(result.error); return; }
    setName('');
    setUrl('');
    setError('');
  };

  if (atLimit) {
    return (
      <p className="text-sm text-ink/60">
        You've reached the free tier's {FREE_TIER_MONITOR_LIMIT}-monitor limit. Remove one above to add another.
      </p>
    );
  }

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60" htmlFor="monitor-name">Name (optional)</label>
          <input
            id="monitor-name" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Marketing site"
            className="mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <div className="min-w-0 flex-[2]">
          <label className="text-xs font-semibold uppercase tracking-wide text-ink/60" htmlFor="monitor-url">URL</label>
          <input
            id="monitor-url" value={url} onChange={(e) => setUrl(e.target.value)}
            placeholder="example.com"
            className="mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>
        <Btn type="submit" variant="accent" className="shrink-0">Add monitor</Btn>
      </div>
      {error && <p className="mt-2 text-sm text-down" role="alert">{error}</p>}
    </form>
  );
}

function MonitorCard({ monitor }) {
  const { checkMonitor, removeMonitor } = useMonitors();
  const [checking, setChecking] = useState(false);
  const status = currentStatus(monitor.checks);
  const uptime = uptimePercent(monitor.checks);
  const avgMs = averageResponseMs(monitor.checks);
  const incidents = deriveIncidents(monitor.checks).slice(0, 5);

  const runCheck = async () => {
    setChecking(true);
    try { await checkMonitor(monitor.id); } finally { setChecking(false); }
  };

  // A plain http:// monitor will be blocked by the browser's mixed-content
  // policy when this dashboard is itself served over https — the check
  // never reaches the network and reports as "down" even if the site is
  // fine. Flag it rather than let that read as a false outage.
  const mixedContentRisk = isMixedContentRisk(monitor.url, typeof window !== 'undefined' ? window.location.protocol : '');

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold">{monitor.name}</h3>
          <a href={monitor.url} target="_blank" rel="noreferrer noopener" className="text-xs text-ink/50 hover:underline">{monitor.url}</a>
        </div>
        <StatusDot status={status} />
      </div>

      {mixedContentRisk && (
        <p className="mt-2 text-xs text-down">
          This is an http:// site and this dashboard is loaded over https — your browser may block
          the check and report "down" even when the site is up. Use the https:// version of this
          URL if it has one.
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="font-display text-xl font-bold">{uptime == null ? '—' : `${uptime}%`}</p>
          <p className="text-xs text-ink/50">Uptime</p>
        </div>
        <div>
          <p className="font-display text-xl font-bold">{avgMs == null ? '—' : `${avgMs}ms`}</p>
          <p className="text-xs text-ink/50">Avg response</p>
        </div>
        <div>
          <p className="font-display text-xl font-bold">{monitor.checks.length}</p>
          <p className="text-xs text-ink/50">Checks logged</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Btn onClick={runCheck} disabled={checking} variant="paper" className="flex-1">
          {checking ? 'Checking…' : 'Check now'}
        </Btn>
        <Btn onClick={() => removeMonitor(monitor.id)} variant="danger">Remove</Btn>
      </div>

      {incidents.length > 0 && (
        <div className="mt-4 border-t border-ink/10 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Recent incidents</p>
          <ul className="mt-2 space-y-1.5 text-sm">
            {incidents.map((inc) => (
              <li key={inc.startedAt} className="flex items-center justify-between text-ink/70">
                <span>{formatTime(inc.startedAt)}</span>
                <span className={inc.resolvedAt ? 'text-ink/60' : 'font-semibold text-down'}>
                  {inc.resolvedAt ? formatDuration(inc.durationMs) : 'still down'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const { monitors, checkAll, autoCheck, setAutoCheck } = useMonitors();

  const exportStatusPage = () => {
    const html = buildStatusPageHtml(monitors);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'status.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Section className="pt-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Kicker>Dashboard</Kicker>
          <h1 className="mt-2 font-display text-3xl font-extrabold">Your monitors</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={checkAll} variant="paper" disabled={monitors.length === 0}>Check all now</Btn>
          <Btn onClick={exportStatusPage} variant="outline" disabled={monitors.length === 0}>Export status page</Btn>
        </div>
      </div>

      <label className="mt-4 flex w-fit items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" checked={autoCheck} onChange={(e) => setAutoCheck(e.target.checked)} className="h-4 w-4" />
        Auto-check every monitor once a minute while this tab is open
      </label>

      <div className="mt-8">
        <Card className="bg-transparent">
          <p className="text-sm font-semibold">Add a monitor</p>
          <div className="mt-3"><AddMonitorForm /></div>
        </Card>
      </div>

      {monitors.length === 0 ? (
        <Card className="mt-8 text-center">
          <p className="text-ink/70">No monitors yet. Add one above to start checking.</p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {monitors.map((m) => <MonitorCard key={m.id} monitor={m} />)}
        </div>
      )}

      <p className="mt-10 text-xs text-ink/40">
        Reachability checks run directly from this browser and can only confirm the network
        request completed — not the exact HTTP status returned (a browser security restriction
        called CORS). See the <Link className="underline" to="/pricing">Pro plan</Link> for full status-code and SSL monitoring.
      </p>
    </Section>
  );
}
