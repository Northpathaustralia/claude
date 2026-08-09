import React from 'react';
import { Btn, Kicker, Card, Section } from '../components/ui.jsx';

// Scrolls to the in-page waitlist section. Not a real "#waitlist" href —
// this app uses HashRouter, where the whole fragment after "#" is the
// route path, so setting location.hash would be read as a navigation to a
// nonexistent "/waitlist" route rather than an in-page scroll.
const scrollToWaitlist = (e) => {
  e.preventDefault();
  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
};

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    blurb: 'Everything you need to keep an eye on a handful of sites.',
    features: [
      'Up to 5 monitors',
      'Checks every 60s while the dashboard tab is open',
      'Uptime %, response time, incident log',
      'Export a static status page snapshot',
      'All data stored on your device only',
    ],
    cta: { label: 'Open the dashboard', to: '/app', variant: 'ink' },
    live: true,
  },
  {
    name: 'Pro',
    price: '$7',
    cadence: '/ month',
    blurb: '24/7 server-side checking, real status codes, and alerts — for when uptime actually matters.',
    features: [
      'Unlimited monitors',
      'Checks continue when your browser is closed',
      'Real HTTP status codes (not just reachability)',
      'SSL certificate + domain expiry alerts',
      'Email alerts within 60 seconds of a failure',
      'Hosted, always-current public status page',
    ],
    cta: { label: 'Join the waitlist', onClick: scrollToWaitlist, variant: 'accent' },
    live: false,
  },
];

export default function Pricing() {
  return (
    <>
      <Section className="pt-16 sm:pt-24">
        <Kicker>Pricing</Kicker>
        <h1 className="mt-3 font-display text-4xl font-extrabold sm:text-5xl">Simple pricing. No seat limits.</h1>
        <p className="mt-4 max-w-xl text-ink/70">
          The free tier is real and works today. Pro — the always-on, server-side version — is in
          development; nothing is charged until it ships.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {TIERS.map((t) => (
            <Card key={t.name} className={t.live ? 'ring-2 ring-up/40' : ''}>
              <div className="flex items-baseline justify-between">
                <h2 className="font-display text-2xl font-bold">{t.name}</h2>
                {!t.live && <span className="rounded-full bg-mist/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink/60">Coming soon</span>}
              </div>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="font-display text-3xl font-extrabold">{t.price}</span>
                <span className="text-sm text-ink/60">{t.cadence}</span>
              </p>
              <p className="mt-3 text-sm text-ink/70">{t.blurb}</p>
              <ul className="mt-5 space-y-2 text-sm text-ink/80">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 text-up">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Btn to={t.cta.to} onClick={t.cta.onClick} variant={t.cta.variant} className="w-full">{t.cta.label}</Btn>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section id="waitlist" className="border-t border-ink/10 bg-white/40">
        <Kicker>Pro waitlist</Kicker>
        <h2 className="mt-3 font-display text-3xl font-bold">Pro isn’t taking payment yet.</h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          We’re not going to show you a checkout form before there’s a server behind it — that’s
          how you end up charging people for a feature that doesn’t exist yet. When the server-side
          checker ships, billing runs through Stripe and every Pro feature above will be live before
          a single card is charged. Until then, use the free dashboard — it already does real work.
        </p>
        <div className="mt-6">
          <Btn to="/app" variant="outline">Use the free version now</Btn>
        </div>
      </Section>

      <Section className="border-t border-ink/10">
        <Kicker>Monetization, in plain terms</Kicker>
        <h2 className="mt-3 font-display text-3xl font-bold">How this makes money</h2>
        <div className="mt-6 max-w-2xl space-y-4 text-sm text-ink/70">
          <p>
            <strong className="text-ink">Free tier is the funnel, not a loss-leader trick.</strong> It's
            useful on its own — no bait-and-switch. People who outgrow "checks only while my tab is
            open" convert themselves by hitting that ceiling honestly.
          </p>
          <p>
            <strong className="text-ink">Pro is a flat monthly subscription</strong>, not usage-based —
            simple to explain, simple to budget, no surprise bill for adding a sixth monitor.
          </p>
          <p>
            <strong className="text-ink">Running cost stays near zero at small scale.</strong> Scheduled
            checks run on a free-tier serverless cron, status/history sits in a free-tier database
            tier, and alert email uses a free-tier transactional email allowance — see the full
            architecture in the product spec for the exact services and thresholds.
          </p>
        </div>
      </Section>
    </>
  );
}
