import React from 'react';
import { Kicker, Section } from '../components/ui.jsx';

export function Privacy() {
  return (
    <Section className="pt-16">
      <Kicker>Privacy</Kicker>
      <h1 className="mt-3 font-display text-3xl font-bold">Privacy policy</h1>
      <div className="prose mt-6 max-w-2xl space-y-4 text-sm text-ink/70">
        <p>Last updated: 9 August 2026.</p>
        <p>
          StillUp's free browser version does not have a server, an account system, or any form
          of analytics or tracking. The monitors you add, the checks StillUp runs, and the
          resulting history are stored only in your browser's local storage on your device. We —
          the people who built StillUp — never see this data, because it never leaves your
          browser.
        </p>
        <h2 className="font-display text-lg font-semibold text-ink">What StillUp does send over the network</h2>
        <p>
          When you add a monitor, your browser sends a direct request to the URL you entered, to
          check whether it responds. That request goes straight from your browser to the site
          you're monitoring — it does not pass through any StillUp server. The operator of that
          site sees a request from your browser, the same as if you'd visited the page yourself.
        </p>
        <h2 className="font-display text-lg font-semibold text-ink">Clearing your data</h2>
        <p>
          Clearing your browser's site data for this page, or removing individual monitors from
          the dashboard, deletes the corresponding data immediately and permanently. There is no
          copy anywhere else to delete.
        </p>
        <h2 className="font-display text-lg font-semibold text-ink">If Pro (server-side) launches</h2>
        <p>
          The paid, server-side tier described on the <a className="underline" href="#/pricing">pricing page</a> is
          not live yet. When it is, it will necessarily store an account identifier, the monitors
          you configure, and an alert email address on a server, so checks can run while you're
          offline — and this policy will be updated to describe exactly what's collected, why,
          and how to delete it, before that tier accepts any signups.
        </p>
        <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
        <p>Questions about this policy can be directed to the site operator listed in the app's repository.</p>
      </div>
    </Section>
  );
}

export function Terms() {
  return (
    <Section className="pt-16">
      <Kicker>Terms</Kicker>
      <h1 className="mt-3 font-display text-3xl font-bold">Terms of use</h1>
      <div className="prose mt-6 max-w-2xl space-y-4 text-sm text-ink/70">
        <p>Last updated: 9 August 2026.</p>
        <p>
          StillUp's free browser version is provided as-is, at no cost, with no uptime or accuracy
          guarantee. It performs a best-effort network reachability check from your browser and
          cannot read HTTP status codes or SSL certificate data for third-party sites — see the
          landing page for a full explanation of that limitation. Do not rely on it as your only
          method of finding out about an outage on anything business-critical.
        </p>
        <h2 className="font-display text-lg font-semibold text-ink">Acceptable use</h2>
        <p>
          Only add monitors for URLs you're authorised to check. Don't use StillUp to send
          repeated requests intended to disrupt a site (a denial-of-service). StillUp's own
          check interval is capped at once per minute per monitor precisely to avoid this.
        </p>
        <h2 className="font-display text-lg font-semibold text-ink">No warranty</h2>
        <p>
          StillUp is provided without warranty of any kind. To the extent permitted by law, the
          operator is not liable for losses arising from missed outages, inaccurate checks, or
          data loss from clearing browser storage.
        </p>
      </div>
    </Section>
  );
}
