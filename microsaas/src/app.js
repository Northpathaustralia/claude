import {
  STORAGE_KEY,
  escapeHtml,
  toCSV,
  validateBusinessConfig,
  validateFeedbackInput,
  computeStats,
  alertQueue,
  makeFeedbackEntry,
  totalGoogleClicks,
} from './logic.js';

const root = document.getElementById('app');

const state = {
  data: loadData(),
  tab: 'setup',
  unlocked: false, // dashboard unlock is in-memory only; reload re-prompts for the PIN
  rating: 0,
  formErrors: {},
  justSubmitted: false,
};

if (state.data.config) state.tab = 'feedback';

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { config: null, entries: [], standaloneGoogleClicks: 0 };
    const parsed = JSON.parse(raw);
    return {
      config: parsed.config || null,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      standaloneGoogleClicks: Number(parsed.standaloneGoogleClicks) || 0,
    };
  } catch {
    // Corrupt or foreign localStorage value under our key — don't crash, start fresh.
    return { config: null, entries: [], standaloneGoogleClicks: 0 };
  }
}

/**
 * Returns whether the save actually succeeded. A full localStorage quota
 * (thousands of responses with long comments, or a browser already near its
 * per-origin limit) throws on setItem — callers that just recorded a
 * customer's feedback must check this rather than assume it landed, or a
 * customer sees "thanks!" while their feedback silently vanished.
 */
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    return true;
  } catch (err) {
    console.error('Trustloop: failed to save to localStorage', err);
    return false;
  }
}

function setTab(tab) {
  state.tab = tab;
  state.justSubmitted = false;
  render();
}

// ---------- Setup ----------

function renderSetup() {
  const cfg = state.data.config || {};
  const err = state.formErrors;
  return `
    <div class="card">
      <h2>Business setup</h2>
      <p class="hint">This configures the public feedback page customers see and the alerts you receive. Nothing here is sent anywhere — it's saved only in this browser (see the notice at the top of the page).</p>
      <form id="setup-form">
        <div class="${err.name ? 'field-error' : ''}">
          <label for="f-name">Business name</label>
          <input type="text" id="f-name" name="name" value="${escapeHtml(cfg.name || '')}" placeholder="e.g. Northpath Mortgage" />
          ${err.name ? `<div class="error">${escapeHtml(err.name)}</div>` : ''}
        </div>
        <div class="${err.googleReviewUrl ? 'field-error' : ''}">
          <label for="f-url">Google review link</label>
          <input type="url" id="f-url" name="googleReviewUrl" value="${escapeHtml(cfg.googleReviewUrl || '')}" placeholder="https://g.page/r/xxxxxxx/review" />
          ${err.googleReviewUrl ? `<div class="error">${escapeHtml(err.googleReviewUrl)}</div>` : '<div class="error" style="color:var(--muted)">Find yours: Google Business Profile → Ask for reviews → Get link.</div>'}
        </div>
        <div class="${err.alertEmail ? 'field-error' : ''}">
          <label for="f-email">Alert email (optional, for reference only — no emails are sent by this demo)</label>
          <input type="email" id="f-email" name="alertEmail" value="${escapeHtml(cfg.alertEmail || '')}" placeholder="owner@example.com" />
          ${err.alertEmail ? `<div class="error">${escapeHtml(err.alertEmail)}</div>` : ''}
        </div>
        <div class="${err.alertThreshold ? 'field-error' : ''}">
          <label for="f-threshold">Alert me about feedback rated this or lower</label>
          <input type="number" id="f-threshold" name="alertThreshold" min="1" max="5" value="${escapeHtml(cfg.alertThreshold ?? 3)}" />
          ${err.alertThreshold ? `<div class="error">${escapeHtml(err.alertThreshold)}</div>` : ''}
        </div>
        <div class="${err.pin ? 'field-error' : ''}">
          <label for="f-pin">Dashboard PIN (4-8 digits)</label>
          <input type="password" inputmode="numeric" id="f-pin" name="pin" value="${escapeHtml(cfg.pin || '')}" placeholder="e.g. 4821" />
          ${err.pin ? `<div class="error">${escapeHtml(err.pin)}</div>` : '<div class="error" style="color:var(--muted)">Demo-only gate — see the security notice below. Do not reuse a real password.</div>'}
        </div>
        <div class="actions-row">
          <button type="submit" class="primary">Save and continue</button>
        </div>
      </form>
    </div>
    <div class="card">
      <h2>Reference build notice</h2>
      <p class="hint" style="margin-bottom:0">
        This is a working reference prototype of the product concept described in
        <code>docs/microsaas/MICROSAAS_CONCEPT.md</code>. All data lives only in this
        browser's local storage — there is no server, no real email/SMS sending, and the
        PIN is not real authentication. See <code>docs/microsaas/RED_TEAM_AUDIT.md</code>
        and <code>docs/microsaas/COUNCIL_REVIEW.md</code> for what a production build
        must add before it can hold real customer data.
      </p>
    </div>
  `;
}

function bindSetup() {
  const form = document.getElementById('setup-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const candidate = {
      name: fd.get('name')?.toString().trim(),
      googleReviewUrl: fd.get('googleReviewUrl')?.toString().trim(),
      alertEmail: fd.get('alertEmail')?.toString().trim(),
      alertThreshold: fd.get('alertThreshold'),
      pin: fd.get('pin')?.toString().trim(),
    };
    const { valid, errors } = validateBusinessConfig(candidate);
    state.formErrors = errors;
    if (!valid) {
      render();
      return;
    }
    state.data.config = { ...candidate, alertThreshold: Number(candidate.alertThreshold) };
    if (!saveData()) {
      state.formErrors = { pin: "Couldn't save settings on this device (storage full or unavailable). Free up space and try again." };
      render();
      return;
    }
    state.formErrors = {};
    state.tab = 'feedback';
    render();
  });
}

// ---------- Feedback (public funnel) ----------

function renderFeedback() {
  const cfg = state.data.config;
  if (!cfg) return `<div class="card"><p class="hint">Finish setup first.</p></div>`;

  if (state.justSubmitted) {
    return `
      <div class="card thankyou">
        <div class="big">🙏</div>
        <h2>Thanks for the feedback!</h2>
        <p class="hint">Your response has been recorded privately for ${escapeHtml(cfg.name)}.</p>
        <div class="actions-row" style="justify-content:center">
          <a class="primary" style="text-decoration:none;display:inline-block;padding:11px 18px;border-radius:8px" href="${escapeHtml(cfg.googleReviewUrl)}" target="_blank" rel="noopener noreferrer" id="thankyou-google-link">Leave a public Google review ↗</a>
          <button class="secondary" id="another-btn">Submit another response</button>
        </div>
      </div>
    `;
  }

  const err = state.formErrors;
  return `
    <div class="card">
      <h2>Share your experience with ${escapeHtml(cfg.name)}</h2>
      <p class="hint">There are two ways to share feedback — shown to every customer, regardless of what you rate us. That's deliberate: we never hide the public review option based on your rating.</p>
      <div style="background:var(--paper);border:1px solid var(--line);border-radius:10px;padding:16px;margin-bottom:18px">
        <strong style="font-size:14px">Prefer to go public?</strong>
        <p class="hint" style="margin:6px 0 10px">Leave a review on our Google Business Profile — it helps other customers find us.</p>
        <a class="secondary" style="text-decoration:none;display:inline-block;padding:11px 18px;border-radius:8px" href="${escapeHtml(cfg.googleReviewUrl)}" target="_blank" rel="noopener noreferrer" id="google-link">Leave a Google review ↗</a>
      </div>
      <h2 style="font-size:14px;color:var(--muted);text-transform:uppercase;letter-spacing:.03em">Or tell us privately</h2>
      <form id="feedback-form">
        <label>Your rating</label>
        <div class="stars" id="stars">
          ${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}" class="${n <= state.rating ? 'filled' : ''}" aria-label="${n} star">★</button>`).join('')}
        </div>
        ${err.rating ? `<div class="error">${escapeHtml(err.rating)}</div>` : ''}
        <label for="fb-comment">What happened? (optional)</label>
        <textarea id="fb-comment" name="comment" maxlength="2000" placeholder="Tell us more..."></textarea>
        ${err.comment ? `<div class="error">${escapeHtml(err.comment)}</div>` : ''}
        <label for="fb-name">Your name (optional)</label>
        <input type="text" id="fb-name" name="name" maxlength="200" />
        <label for="fb-contact">Email or phone, if you'd like a reply (optional)</label>
        <input type="text" id="fb-contact" name="contact" maxlength="200" />
        <p class="hint" style="margin-top:14px">
          By submitting, you agree this feedback may be reviewed by ${escapeHtml(cfg.name)} to
          improve their service. It is not posted publicly. See the privacy notice in the footer.
        </p>
        <div class="actions-row">
          <button type="submit" class="primary">Submit private feedback</button>
        </div>
      </form>
    </div>
  `;
}

function bindFeedback() {
  const stars = document.getElementById('stars');
  if (stars) {
    stars.querySelectorAll('button[data-star]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.rating = Number(btn.dataset.star);
        render();
      });
    });
  }
  const googleLink = document.getElementById('google-link');
  if (googleLink) {
    // Clicked before any private feedback exists for this visit — nothing to attribute it to yet.
    googleLink.addEventListener('click', () => trackStandaloneGoogleClick());
  }
  const thankyouLink = document.getElementById('thankyou-google-link');
  if (thankyouLink) {
    // Clicked right after submitting — attribute it to the response just created.
    thankyouLink.addEventListener('click', () => trackAttributedGoogleClick());
  }
  const anotherBtn = document.getElementById('another-btn');
  if (anotherBtn) {
    anotherBtn.addEventListener('click', () => {
      state.justSubmitted = false;
      state.rating = 0;
      render();
    });
  }
  const form = document.getElementById('feedback-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const candidate = {
        rating: state.rating,
        comment: fd.get('comment')?.toString() || '',
        name: fd.get('name')?.toString() || '',
        contact: fd.get('contact')?.toString() || '',
      };
      const { valid, errors } = validateFeedbackInput(candidate);
      state.formErrors = errors;
      if (!valid) {
        render();
        return;
      }
      const entry = makeFeedbackEntry(candidate);
      state.data.entries.push(entry);
      if (!saveData()) {
        state.data.entries.pop();
        state.formErrors = { comment: "Couldn't save your feedback on this device (storage full). Please try again or use another device." };
        render();
        return;
      }
      state.formErrors = {};
      state.rating = 0;
      state.justSubmitted = true;
      render();
    });
  }
}

function trackStandaloneGoogleClick() {
  state.data.standaloneGoogleClicks += 1;
  saveData();
}

/** Marks the just-submitted entry as having clicked through to Google. */
function trackAttributedGoogleClick() {
  const entries = state.data.entries;
  if (entries.length > 0) {
    entries[entries.length - 1].googleClicked = true;
    saveData();
  }
}

// ---------- Dashboard ----------

function renderDashboard() {
  const cfg = state.data.config;
  if (!cfg) return `<div class="card"><p class="hint">Finish setup first.</p></div>`;

  if (!state.unlocked) {
    return `
      <div class="card pin-gate">
        <h2>Owner dashboard</h2>
        <p class="hint">Enter your dashboard PIN to continue.</p>
        <form id="pin-form">
          <input type="password" inputmode="numeric" id="pin-input" placeholder="PIN" />
          <div class="actions-row" style="justify-content:center">
            <button type="submit" class="primary">Unlock</button>
          </div>
          <div id="pin-error" class="error"></div>
        </form>
      </div>
    `;
  }

  const entries = [...state.data.entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const stats = computeStats(entries);
  const queue = alertQueue(entries, cfg.alertThreshold);
  const googleClicks = totalGoogleClicks(state.data.entries, state.data.standaloneGoogleClicks);

  const alertHtml = queue.length
    ? `<div class="alert-banner">
        <strong>${queue.length} response${queue.length === 1 ? '' : 's'}</strong> at or below your alert
        threshold (${cfg.alertThreshold}★) need${queue.length === 1 ? 's' : ''} a follow-up.
      </div>`
    : '';

  const rows = entries.length
    ? entries.map((e) => `
        <tr>
          <td>${escapeHtml(new Date(e.timestamp).toLocaleString())}</td>
          <td>${'★'.repeat(e.rating)}${'☆'.repeat(5 - e.rating)}</td>
          <td><span class="badge ${e.sentiment}">${e.sentiment}</span></td>
          <td>${escapeHtml(e.name) || '<span style="color:var(--muted)">—</span>'}</td>
          <td>${escapeHtml(e.contact) || '<span style="color:var(--muted)">—</span>'}</td>
          <td style="max-width:220px;white-space:pre-wrap">${escapeHtml(e.comment) || '<span style="color:var(--muted)">—</span>'}</td>
          <td>${e.googleClicked ? 'Yes' : 'No'}</td>
          <td>${e.acknowledged ? '✓' : `<button class="ghost" data-ack="${escapeHtml(e.id)}">Acknowledge</button>`}</td>
        </tr>
      `).join('')
    : `<tr><td colspan="8"><div class="empty">No feedback yet. Share your feedback link with a customer to see it appear here.</div></td></tr>`;

  return `
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
        <h2>Dashboard — ${escapeHtml(cfg.name)}</h2>
        <div class="actions-row" style="margin-top:0">
          <button class="ghost" id="edit-settings-btn">Edit settings</button>
          <button class="ghost" id="lock-btn">Lock</button>
        </div>
      </div>
      ${alertHtml}
      <div class="stat-grid">
        <div class="stat"><div class="num">${stats.count}</div><div class="label">Total responses</div></div>
        <div class="stat"><div class="num">${stats.avgRating || '—'}</div><div class="label">Average rating</div></div>
        <div class="stat"><div class="num">${stats.positive}</div><div class="label">Positive (4-5★)</div></div>
        <div class="stat"><div class="num">${stats.negative}</div><div class="label">Negative (1-2★)</div></div>
        <div class="stat"><div class="num">${googleClicks}</div><div class="label">Total Google review clicks</div></div>
      </div>
      <p class="hint" style="margin-top:2px">
        Google review clicks include both clicks made before submitting private feedback and
        clicks made right after. This prototype doesn't count page visits, so a true
        click-through-rate (clicks ÷ visits) isn't shown — that needs a privacy-compliant
        visit counter, which is a v2 item (see the red-team audit).
      </p>
      <div class="actions-row">
        <button class="secondary" id="export-csv-btn">Export CSV</button>
      </div>
    </div>
    <div class="card">
      <h2>Responses</h2>
      <div style="overflow-x:auto">
        <table>
          <thead><tr><th>When</th><th>Rating</th><th>Sentiment</th><th>Name</th><th>Contact</th><th>Comment</th><th>Clicked Google</th><th>Actioned</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function bindDashboard() {
  const pinForm = document.getElementById('pin-form');
  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('pin-input');
      const errBox = document.getElementById('pin-error');
      if (input.value === state.data.config.pin) {
        state.unlocked = true;
        render();
      } else {
        errBox.textContent = 'Incorrect PIN.';
      }
    });
    return;
  }
  const lockBtn = document.getElementById('lock-btn');
  if (lockBtn) lockBtn.addEventListener('click', () => { state.unlocked = false; render(); });

  const editBtn = document.getElementById('edit-settings-btn');
  if (editBtn) editBtn.addEventListener('click', () => setTab('setup'));

  const exportBtn = document.getElementById('export-csv-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const csv = toCSV(state.data.entries);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(state.data.config.name || 'trustloop').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-feedback.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  document.querySelectorAll('button[data-ack]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.ack;
      const entry = state.data.entries.find((e) => e.id === id);
      if (entry) {
        entry.acknowledged = true;
        saveData();
        render();
      }
    });
  });
}

// ---------- Shell ----------

function render() {
  const hasConfig = Boolean(state.data.config);
  root.innerHTML = `
    <div class="wrap">
      <header class="top">
        <div class="brand"><span class="dot"></span> Trustloop</div>
      </header>
      <nav class="tabs">
        <button data-tab="setup" class="${state.tab === 'setup' ? 'active' : ''}">Setup</button>
        <button data-tab="feedback" class="${state.tab === 'feedback' ? 'active' : ''}" ${hasConfig ? '' : 'disabled'}>Get feedback</button>
        <button data-tab="dashboard" class="${state.tab === 'dashboard' ? 'active' : ''}" ${hasConfig ? '' : 'disabled'}>Dashboard</button>
      </nav>
      <div id="tab-content"></div>
      <footer class="legal">
        Reference prototype for the "Trustloop" micro-SaaS concept. No data leaves this browser.
        Read the privacy and compliance notes in <code>docs/microsaas/</code> before using this
        with real customers.
      </footer>
    </div>
  `;

  const content = document.getElementById('tab-content');
  if (state.tab === 'setup') {
    content.innerHTML = renderSetup();
    bindSetup();
  } else if (state.tab === 'feedback') {
    content.innerHTML = renderFeedback();
    bindFeedback();
  } else {
    content.innerHTML = renderDashboard();
    bindDashboard();
  }

  root.querySelectorAll('nav.tabs button[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      setTab(btn.dataset.tab);
    });
  });
}

render();
