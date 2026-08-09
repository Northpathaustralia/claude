// ---------------------------------------------------------------------------
// LoanLoop embeddable borrowing-power widget.
//
// Single file, zero dependencies, zero build step. A broker embeds it as:
//
//   <div class="loanloop-widget"
//        data-loanloop-id="broker_demo"
//        data-webhook="https://example.com/api/loanloop-lead"
//        data-primary-color="#0f766e"
//        data-headline="See what you could borrow"></div>
//   <script type="module" src="https://cdn.example.com/loanloop.js"></script>
//
// The pure calculation/validation functions below are unit tested directly
// (see ../tests). The DOM-mounting code only runs in a browser — `document`
// is undefined under Node, so importing this file for tests has no side
// effects.
// ---------------------------------------------------------------------------

/** Standard educational disclaimer shown with every estimate. */
export const DISCLAIMER =
  'This is a general estimate for education only. It is not credit advice, not a loan ' +
  'pre-approval, and does not consider your full financial situation. Actual borrowing ' +
  'power depends on a lender’s assessment. Speak with a licensed broker for an accurate figure.';

/** Phrases a broker's custom headline/subtext must never be allowed to contain verbatim. */
const BANNED_PATTERNS = [
  { pattern: /guaranteed?\s+(approval|finance|loan|outcome)/gi, replacement: 'estimated options (subject to lender assessment)' },
  { pattern: /\bwe\s+guarantee\b/gi, replacement: 'we aim to help you understand' },
  { pattern: /\byou\s+will\s+(be\s+approved|qualify|get\s+approved)\b/gi, replacement: 'you may be able to explore options' },
  { pattern: /\b(instant|automatic|assured)\s+approval\b/gi, replacement: 'a fast initial estimate' },
  { pattern: /\bno\s+risk\b/gi, replacement: 'a low-pressure first step' },
  { pattern: /\b100%\s*(approval|success)\b/gi, replacement: 'a personalised review' },
  { pattern: /\bpre-?approved\s+for\s+sure\b/gi, replacement: 'potentially eligible to apply' },
];

/** Rewrite text so it can never promise guaranteed finance outcomes. */
export function sanitiseText(text) {
  let out = text || '';
  for (const { pattern, replacement } of BANNED_PATTERNS) {
    pattern.lastIndex = 0;
    out = out.replace(pattern, replacement);
  }
  return out;
}

/** Escape a string for safe insertion into HTML markup or attributes. */
export function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Reasonably strict but permissive email check for client-side validation. */
export function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  if (email.length === 0 || email.length > 254) return false;
  // No consecutive dots, no leading/trailing dot in local or domain part, one @.
  return /^[^\s@.][^\s@]*(?<!\.)@[^\s@.][^\s@]*\.[^\s@]{2,}$/.test(email) && !email.includes('..');
}

function roundToNearest(value, step) {
  return Math.round(value / step) * step;
}

/**
 * Validate raw estimator input. Returns a list of human-readable error
 * strings (empty when valid). Every numeric field must already be a
 * `number` — callers are responsible for rejecting non-numeric strings
 * (e.g. "50000abc") before calling this, rather than silently truncating
 * them with parseFloat.
 */
export function validateEstimatorInput({ annualIncome, monthlyDebts, dependents, deposit }) {
  const errors = [];

  if (!Number.isFinite(annualIncome) || annualIncome <= 0) {
    errors.push('Annual household income must be a positive number.');
  } else if (annualIncome > 5_000_000) {
    errors.push('Annual household income looks too high — please check the figure.');
  }

  if (!Number.isFinite(monthlyDebts) || monthlyDebts < 0) {
    errors.push('Monthly debt repayments must be zero or a positive number.');
  } else if (monthlyDebts > 200_000) {
    errors.push('Monthly debt repayments look too high — please check the figure.');
  }

  if (!Number.isInteger(dependents) || dependents < 0) {
    errors.push('Number of dependents must be zero or a positive whole number.');
  } else if (dependents > 10) {
    errors.push('Number of dependents looks too high — please check the figure.');
  }

  if (!Number.isFinite(deposit) || deposit < 0) {
    errors.push('Deposit must be zero or a positive number.');
  } else if (deposit > 50_000_000) {
    errors.push('Deposit looks too high — please check the figure.');
  }

  return errors;
}

/**
 * Indicative borrowing-power range. Deliberately simple (a published
 * rule-of-thumb multiplier, not a full serviceability/HEM calculation) so it
 * stays firmly in "general information" territory rather than a personal
 * credit assessment. Always returned as a range, never a single number, and
 * always paired with `DISCLAIMER` by the caller.
 */
export function estimateBorrowingPower(input) {
  const errors = validateEstimatorInput(input);
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const annualIncome = input.annualIncome;
  const monthlyDebts = input.monthlyDebts;
  const dependents = input.dependents;
  const deposit = input.deposit;

  const BASE_MULTIPLIER = 5.5;
  const MIN_MULTIPLIER = 2;
  const DEPENDENT_STEP = 0.12;
  const MAX_DEPENDENTS_COUNTED = 5;
  const DEBT_CAPITALISATION_YEARS = 3;

  const dependentAdjustment = Math.min(dependents, MAX_DEPENDENTS_COUNTED) * DEPENDENT_STEP;
  const multiplier = Math.max(MIN_MULTIPLIER, BASE_MULTIPLIER - dependentAdjustment);

  const annualDebtDrag = monthlyDebts * 12 * DEBT_CAPITALISATION_YEARS;
  const debtAdjustedIncome = Math.max(0, annualIncome - annualDebtDrag);

  const midEstimate = debtAdjustedIncome * multiplier;
  const low = Math.max(0, midEstimate * 0.85);
  const high = midEstimate * 1.1;
  const purchaseBudgetHigh = high + deposit;

  return {
    valid: true,
    low: roundToNearest(low, 5000),
    high: roundToNearest(high, 5000),
    purchaseBudgetHigh: roundToNearest(purchaseBudgetHigh, 5000),
  };
}

// ---------------------------------------------------------------------------
// DOM mounting — browser only. Skipped entirely under Node (no `document`).
// ---------------------------------------------------------------------------
if (typeof document !== 'undefined') {
  const MAX_SUBMISSIONS_PER_MINUTE = 3; // basic client-side throttle, not a substitute for server-side rate limiting

  const parseNumberField = (rawValue) => {
    const trimmed = String(rawValue ?? '').trim();
    if (trimmed.length === 0) return NaN;
    // Reject anything that isn't a plain (optionally decimal) number instead
    // of silently truncating strings like "50000abc" with parseFloat.
    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return NaN;
    return Number(trimmed);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);

  const throttleKey = (brokerId) => `loanloop_throttle_${brokerId}`;

  const isThrottled = (brokerId) => {
    try {
      const raw = window.localStorage.getItem(throttleKey(brokerId));
      const timestamps = raw ? JSON.parse(raw) : [];
      const recent = timestamps.filter((t) => Date.now() - t < 60_000);
      return recent.length >= MAX_SUBMISSIONS_PER_MINUTE;
    } catch {
      return false; // storage unavailable (private mode etc.) — fail open, server remains the real guard
    }
  };

  const recordSubmission = (brokerId) => {
    try {
      const raw = window.localStorage.getItem(throttleKey(brokerId));
      const timestamps = raw ? JSON.parse(raw) : [];
      timestamps.push(Date.now());
      window.localStorage.setItem(throttleKey(brokerId), JSON.stringify(timestamps.slice(-20)));
    } catch {
      /* ignore */
    }
  };

  const mountWidget = (container) => {
    const brokerId = container.dataset.loanloopId;
    if (!brokerId) {
      console.error('[LoanLoop] Missing required data-loanloop-id attribute — widget not mounted.');
      return;
    }
    const webhook = container.dataset.webhook || null;
    const primaryColor = /^#[0-9a-fA-F]{3,8}$/.test(container.dataset.primaryColor || '')
      ? container.dataset.primaryColor
      : '#0f766e';
    const headline = sanitiseText(container.dataset.headline || 'See what you could borrow');

    container.innerHTML = '';
    container.classList.add('loanloop-mounted');
    container.style.setProperty('--loanloop-primary', primaryColor);

    const heading = document.createElement('h3');
    heading.className = 'loanloop-heading';
    heading.textContent = headline; // textContent — never innerHTML — for any broker-supplied string

    const form = document.createElement('form');
    form.className = 'loanloop-form';
    form.noValidate = true;

    const fields = [
      { name: 'annualIncome', label: 'Annual household income (AUD)', type: 'text', inputMode: 'decimal', required: true },
      { name: 'monthlyDebts', label: 'Existing monthly debt repayments (AUD)', type: 'text', inputMode: 'decimal', required: false, defaultValue: '0' },
      { name: 'dependents', label: 'Number of dependents', type: 'text', inputMode: 'numeric', required: false, defaultValue: '0' },
      { name: 'deposit', label: 'Deposit saved (AUD)', type: 'text', inputMode: 'decimal', required: false, defaultValue: '0' },
      { name: 'name', label: 'Your name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone (optional)', type: 'tel', required: false },
    ];

    const inputs = {};
    for (const field of fields) {
      const wrap = document.createElement('label');
      wrap.className = 'loanloop-field';
      const labelText = document.createElement('span');
      labelText.textContent = field.label + (field.required ? ' *' : '');
      const input = document.createElement('input');
      input.type = field.type;
      input.name = field.name;
      if (field.inputMode) input.inputMode = field.inputMode;
      if (field.defaultValue !== undefined) input.value = field.defaultValue;
      if (field.required) input.required = true;
      input.autocomplete = field.name === 'email' ? 'email' : field.name === 'phone' ? 'tel' : 'off';
      wrap.appendChild(labelText);
      wrap.appendChild(input);
      form.appendChild(wrap);
      inputs[field.name] = input;
    }

    // Honeypot: hidden from real users, only bots fill it in.
    const honeypotWrap = document.createElement('div');
    honeypotWrap.className = 'loanloop-honeypot';
    honeypotWrap.setAttribute('aria-hidden', 'true');
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'company_website';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypotWrap.appendChild(honeypot);
    form.appendChild(honeypotWrap);

    const consentWrap = document.createElement('label');
    consentWrap.className = 'loanloop-consent';
    const consentInput = document.createElement('input');
    consentInput.type = 'checkbox';
    consentInput.name = 'consent';
    consentInput.required = true;
    consentInput.checked = false; // never pre-ticked — consent must be an active choice
    const consentText = document.createElement('span');
    consentText.textContent =
      'I agree to be contacted about this enquiry and have read the privacy policy. *';
    consentWrap.appendChild(consentInput);
    consentWrap.appendChild(consentText);
    form.appendChild(consentWrap);

    const marketingWrap = document.createElement('label');
    marketingWrap.className = 'loanloop-consent loanloop-consent-marketing';
    const marketingInput = document.createElement('input');
    marketingInput.type = 'checkbox';
    marketingInput.name = 'marketingConsent';
    marketingInput.checked = false; // separate, unticked opt-in for marketing (not bundled with service consent)
    const marketingText = document.createElement('span');
    marketingText.textContent = 'Send me occasional home-buying tips by email (optional).';
    marketingWrap.appendChild(marketingInput);
    marketingWrap.appendChild(marketingText);
    form.appendChild(marketingWrap);

    const errorBox = document.createElement('div');
    errorBox.className = 'loanloop-errors';
    errorBox.setAttribute('role', 'alert');

    const resultBox = document.createElement('div');
    resultBox.className = 'loanloop-result';
    resultBox.hidden = true;
    resultBox.setAttribute('aria-live', 'polite');

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'loanloop-submit';
    submitBtn.textContent = 'Get my estimate';

    form.appendChild(errorBox);
    form.appendChild(submitBtn);

    const disclaimer = document.createElement('p');
    disclaimer.className = 'loanloop-disclaimer';
    disclaimer.textContent = DISCLAIMER;

    container.appendChild(heading);
    container.appendChild(form);
    container.appendChild(resultBox);
    container.appendChild(disclaimer);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorBox.textContent = '';

      if (honeypot.value.trim() !== '') {
        return; // silently drop — bot filled the hidden field
      }

      if (isThrottled(brokerId)) {
        errorBox.textContent = 'Too many attempts — please wait a minute and try again.';
        return;
      }

      const estimatorInput = {
        annualIncome: parseNumberField(inputs.annualIncome.value),
        monthlyDebts: parseNumberField(inputs.monthlyDebts.value),
        dependents: parseNumberField(inputs.dependents.value),
        deposit: parseNumberField(inputs.deposit.value),
      };

      const formErrors = [];
      if (!inputs.name.value.trim()) formErrors.push('Please enter your name.');
      if (!isValidEmail(inputs.email.value)) formErrors.push('Please enter a valid email address.');
      if (!consentInput.checked) formErrors.push('Please agree to be contacted to continue.');

      const estimate = estimateBorrowingPower(estimatorInput);
      if (!estimate.valid) formErrors.push(...estimate.errors);

      if (formErrors.length > 0) {
        errorBox.textContent = formErrors.join(' ');
        return;
      }

      // The estimate itself is computed synchronously below; the only
      // pending work is delivering the lead, so the label reflects that
      // rather than implying the (instant) calculation is still running.
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      resultBox.hidden = false;
      resultBox.innerHTML = '';
      const resultHeading = document.createElement('strong');
      resultHeading.textContent = `Estimated borrowing power: ${formatCurrency(estimate.low)} – ${formatCurrency(estimate.high)}`;
      const resultBudget = document.createElement('p');
      resultBudget.textContent = `With your deposit, an indicative purchase budget of up to ${formatCurrency(estimate.purchaseBudgetHigh)}.`;
      resultBox.appendChild(resultHeading);
      resultBox.appendChild(resultBudget);

      const lead = {
        brokerId,
        name: inputs.name.value.trim(),
        email: inputs.email.value.trim(),
        phone: inputs.phone.value.trim(),
        marketingConsent: marketingInput.checked,
        estimate: { low: estimate.low, high: estimate.high, purchaseBudgetHigh: estimate.purchaseBudgetHigh },
        submittedAt: new Date().toISOString(),
        source: window.location.href,
      };

      recordSubmission(brokerId);

      try {
        if (webhook) {
          await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(lead),
          });
        } else {
          // Demo fallback so this repo's own demo pages work with zero backend.
          const key = `loanloop_demo_leads_${brokerId}`;
          const existing = JSON.parse(window.localStorage.getItem(key) || '[]');
          existing.push(lead);
          window.localStorage.setItem(key, JSON.stringify(existing));
        }
        container.dispatchEvent(new CustomEvent('loanloop:lead-captured', { detail: lead, bubbles: true }));
      } catch (err) {
        console.error('[LoanLoop] Failed to deliver lead:', err);
        errorBox.textContent =
          'Your estimate is shown above, but we could not notify the broker automatically — please contact them directly.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get my estimate';
      }
    });
  };

  const mountAll = () => {
    document.querySelectorAll('.loanloop-widget:not(.loanloop-mounted)').forEach(mountWidget);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountAll);
  } else {
    mountAll();
  }
}
