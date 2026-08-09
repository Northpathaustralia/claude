import React from 'react';
import { Link } from 'react-router-dom';
import { Btn, Kicker, Card, Section } from '../components/ui.jsx';

const FEATURES = [
  {
    title: 'Add a monitor in seconds',
    body: 'Paste any URL. StillUp validates it, adds it to your dashboard, and runs the first check immediately — no account, no setup wizard.',
  },
  {
    title: 'Uptime %, response time, incident log',
    body: 'Every check is stored locally. See uptime percentage, average response time, and a full log of every down-to-up transition with duration.',
  },
  {
    title: 'One-click public status page',
    body: 'Export a clean, static status page as a single HTML file you can host anywhere — your own domain, GitHub Pages, or a status subdomain.',
  },
  {
    title: 'Your data stays yours',
    body: 'Everything lives in your browser’s local storage. Nothing is uploaded, nothing is sold, nothing needs a login to try.',
  },
];

const STEPS = [
  { n: '01', title: 'Add your sites', body: 'Paste the URLs you care about — your marketing site, your app, your API, your client’s site.' },
  { n: '02', title: 'Let it check', body: 'Turn on auto-check and StillUp pings every monitor once a minute while the dashboard is open, building a real history.' },
  { n: '03', title: 'Share the status page', body: 'Export a status page snapshot whenever you want your customers or team to see it — no server required.' },
];

export default function Landing() {
  return (
    <>
      <Section className="pb-8 pt-16 sm:pt-24">
        <Kicker>Uptime monitoring, radically simplified</Kicker>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-6xl">
          Know the moment something goes down.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-ink/70">
          StillUp watches your websites, tracks uptime and response time, and gives you a
          shareable status page — without the enterprise dashboard, the seven-step setup,
          or the invoice that grows every time you add a monitor.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Btn to="/app" variant="ink">Start monitoring — free</Btn>
          <Btn to="/pricing" variant="paper">See pricing</Btn>
        </div>
        <p className="mt-4 text-sm text-ink/50">No credit card. No signup. Runs in this browser tab.</p>
      </Section>

      <Section id="features" className="border-t border-ink/10 bg-white/40">
        <Kicker>What you get</Kicker>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Everything a solo founder or small team actually needs.</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card key={f.title}>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{f.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-ink/10">
        <Kicker>How it works</Kicker>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Three steps. No onboarding call.</h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n}>
              <p className="font-mono text-sm font-bold text-accent">{s.n}</p>
              <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-ink/10 bg-white/40">
        <Kicker>Built honestly</Kicker>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">What this free version can — and can’t — do.</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <Card>
            <h3 className="font-display text-lg font-semibold text-up">Free browser version (available now)</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li>Checks reachability of any http(s) URL from your browser</li>
              <li>Runs once a minute while this tab is open</li>
              <li>Stores history, uptime % and incidents on your device</li>
              <li>Exports a static status page snapshot, free forever</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-display text-lg font-semibold text-ink/70">Pro (server-side, in development)</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li>Checks continue 24/7, even when your browser is closed</li>
              <li>Real HTTP status codes, not just reachability</li>
              <li>SSL certificate and domain expiry alerts</li>
              <li>Email/SMS alerts the moment something goes down</li>
            </ul>
          </Card>
        </div>
        <p className="mt-6 max-w-2xl text-sm text-ink/60">
          Browsers can’t read HTTP status codes for other websites or check SSL certificates —
          that’s a security restriction (CORS), not a StillUp limitation. The free tier is a
          genuinely useful reachability check built entirely client-side. Pro removes that
          ceiling with a small always-on checker — see the <Link className="underline" to="/pricing">pricing page</Link> for
          where that stands today.
        </p>
      </Section>

      <Section className="border-t border-ink/10">
        <Kicker>FAQ</Kicker>
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="font-display font-semibold">Do I need an account?</h3>
            <p className="mt-1 text-sm text-ink/70">No. Open the dashboard and start adding monitors immediately. Your data stays in this browser.</p>
          </div>
          <div>
            <h3 className="font-display font-semibold">What happens if I close the tab?</h3>
            <p className="mt-1 text-sm text-ink/70">
              Your monitors and history are saved and will be there when you come back. Auto-checking
              pauses while the tab is closed — that’s what the Pro server-side checker is for.
            </p>
          </div>
          <div>
            <h3 className="font-display font-semibold">Is my data sent anywhere?</h3>
            <p className="mt-1 text-sm text-ink/70">
              No third-party server sees your monitor list. Checks are direct browser requests to the
              URLs you add; history is stored only in this browser’s local storage. See our <Link className="underline" to="/privacy">privacy policy</Link>.
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-t border-ink/10 bg-ink text-paper">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Stop finding out from a customer.</h2>
        <p className="mt-4 max-w-xl text-paper/70">Add your first monitor in the time it takes to read this sentence.</p>
        <div className="mt-8">
          <Btn to="/app" variant="accent">Open the dashboard</Btn>
        </div>
      </Section>
    </>
  );
}
