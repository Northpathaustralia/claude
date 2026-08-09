import { uptimePercent, currentStatus, deriveIncidents } from './monitor.js';

/** Escapes text for safe interpolation into HTML. Monitor names are user-entered, so this matters. */
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

const STATUS_LABEL = { up: 'Operational', down: 'Down', unknown: 'No data yet' };
const STATUS_COLOR = { up: '#1AA870', down: '#E0453E', unknown: '#B9C2C8' };

/**
 * Builds a self-contained, static HTML status page from the current monitor
 * list. This is a snapshot at export time, not a live page — there's no
 * server to keep it updating. Re-export whenever you want to refresh it.
 * All monitor-supplied text is HTML-escaped before interpolation.
 */
export function buildStatusPageHtml(monitors, { generatedAt = Date.now() } = {}) {
  const rows = monitors.map((m) => {
    const status = currentStatus(m.checks);
    const uptime = uptimePercent(m.checks);
    const incidents = deriveIncidents(m.checks).slice(0, 3);
    const incidentRows = incidents.map((inc) => `
      <li>
        <span>${new Date(inc.startedAt).toLocaleString('en-AU')}</span>
        <span>${inc.resolvedAt ? 'Resolved' : 'Ongoing'}</span>
      </li>`).join('');
    return `
      <section class="monitor">
        <div class="monitor-head">
          <span class="dot" style="background:${STATUS_COLOR[status]}"></span>
          <h2>${escapeHtml(m.name)}</h2>
          <span class="status">${STATUS_LABEL[status]}</span>
        </div>
        <p class="url">${escapeHtml(m.url)}</p>
        <p class="uptime">${uptime == null ? 'No checks recorded' : `${uptime}% uptime`}</p>
        ${incidentRows ? `<ul class="incidents">${incidentRows}</ul>` : ''}
      </section>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Status</title>
<style>
  body { font-family: system-ui, sans-serif; background: #F6F7F5; color: #0B0F14; margin: 0; padding: 2rem 1rem; }
  main { max-width: 640px; margin: 0 auto; }
  h1 { font-size: 1.5rem; }
  .generated { color: #6b7680; font-size: 0.85rem; margin-bottom: 2rem; }
  .monitor { background: white; border: 1px solid rgba(11,15,20,0.1); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; }
  .monitor-head { display: flex; align-items: center; gap: 0.5rem; }
  .monitor-head h2 { font-size: 1rem; margin: 0; flex: 1; }
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .status { font-size: 0.8rem; font-weight: 600; }
  .url { color: #6b7680; font-size: 0.8rem; margin: 0.25rem 0; word-break: break-all; }
  .uptime { font-size: 0.9rem; margin: 0.5rem 0 0; }
  .incidents { list-style: none; padding: 0; margin: 0.75rem 0 0; font-size: 0.8rem; color: #6b7680; }
  .incidents li { display: flex; justify-content: space-between; padding: 0.25rem 0; border-top: 1px solid rgba(11,15,20,0.06); }
  footer { color: #6b7680; font-size: 0.75rem; margin-top: 2rem; text-align: center; }
</style>
</head>
<body>
<main>
  <h1>Status</h1>
  <p class="generated">Snapshot generated ${new Date(generatedAt).toLocaleString('en-AU')} — this is a static export, not a live page.</p>
  ${rows || '<p>No monitors to show.</p>'}
  <footer>Built with <a href="https://stillup.example" rel="noopener">StillUp</a></footer>
</main>
</body>
</html>`;
}
