import React, { useMemo, useState } from 'react';
import { RIVIERA_PRODUCTS } from '../data/riviera.js';
import { fmt, stockFor } from '../data/products.js';
import { useStore } from '../context/StoreContext.jsx';
import GarmentArt from '../components/GarmentArt.jsx';
import ExpressCheckout from '../components/ExpressCheckout.jsx';
import { Btn, Kicker, H2, Reveal, StateLine, EmailSignup } from '../components/ui.jsx';

/**
 * THE RIVIERA SET — dedicated capsule landing page.
 * Sourcing model, positioning and claim rules: docs/RIVIERA_CAPSULE.md.
 * This page deliberately does NOT use COASTFORM/construction-spec language —
 * see RIVIERA_CAPSULE.md §5. Claims here are fit/versatility/price, not fabric
 * engineering, because this capsule is sourced differently (Tier A dropship)
 * and we don't control those specs yet.
 */

const TRUST = [
  ['Real sample-tested', 'Every set is worn-tested by us before it\'s listed — not just photographed.'],
  ['Honest delivery windows', 'The date at checkout is the date we expect it, not a rounded-down guess.'],
  ['Free size exchange', 'First exchange free if the fit is wrong — same policy as the core range.'],
  ['No fake urgency', 'Stock counts shown are real. No countdown timers, no fabricated scarcity.'],
];

const FAQS = [
  ['Is this the same construction as DROP 001?', 'No — and we\'d rather tell you than pretend otherwise. This capsule is sourced through a leaner supply model while we validate demand (full story: the Journal). It\'s not the COASTFORM-spec range. It\'s a well-made, well-fitted set at an accessible price.'],
  ['How long does shipping take?', 'We show the real, current estimate at checkout for your location — not a placeholder. If it\'s slower than you\'d like, don\'t order yet; we\'d rather lose the sale than the trust.'],
  ['Can I buy the shirt or shorts separately?', 'Yes — every set is also sold as individual pieces.'],
  ['What if the fit is wrong?', 'Free first exchange, same as the core range. Check the size notes on each set before ordering.'],
];

function SetCard({ product }) {
  const { addToCart } = useStore();
  const colour = product.colours[0];
  const [size, setSize] = useState('M');
  const [added, setAdded] = useState(false);
  const available = stockFor(product, colour, size);

  return (
    <Reveal as="article" className="border border-ink/10 bg-white/40">
      <GarmentArt kind={product.kind} colour={colour} pattern={product.pattern} photo={product.photo} alt={product.name} className="aspect-[4/5] w-full" />
      <div className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cobalt">{product.sku}</p>
        <h3 className="mt-1 font-display text-lg font-extrabold uppercase leading-tight">{product.name}</h3>
        <p className="mt-1 font-mono text-xs text-ink/60">{product.tagline}</p>
        <p className="mt-3 font-display text-xl font-extrabold">
          {fmt(product.price)} <span className="font-mono text-[11px] font-normal text-ink/45">set · or shirt {fmt(product.shirtPrice)} / short {fmt(product.shortPrice)}</span>
        </p>

        <div className="mt-4 grid grid-cols-5 gap-1.5" role="group" aria-label={`${product.name} size`}>
          {product.sizes.map((s) => {
            const st = stockFor(product, colour, s);
            return (
              <button
                key={s} disabled={st <= 0}
                data-testid={`riviera-size-${product.id}-${s}`}
                aria-pressed={size === s}
                onClick={() => { setSize(s); setAdded(false); }}
                className={`border-2 py-2 font-mono text-[11px] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${size === s ? 'border-ink bg-ink text-bone' : 'border-ink/20 hover:border-ink'}`}
              >
                {s}
              </button>
            );
          })}
        </div>
        {available > 0 && available <= 10 && (
          <p className="mt-2 font-mono text-[11px] text-signal">Only {available} left in {size} — real count.</p>
        )}

        <Btn
          className="mt-4 w-full"
          data-testid={`riviera-add-${product.id}`}
          disabled={available <= 0}
          onClick={() => { addToCart(product.id, colour, size, 1); setAdded(true); }}
        >
          {available <= 0 ? 'Sold out in this size' : 'Add set to cart'}
        </Btn>
        {added && <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wide text-ink/50">Added ✓</p>}
      </div>
    </Reveal>
  );
}

export default function Riviera() {
  const { addToCart } = useStore();
  const hero = RIVIERA_PRODUCTS[0];
  const bundleTotal = useMemo(() => RIVIERA_PRODUCTS.reduce((a, p) => a + p.price, 0), []);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-ink text-bone">
        <div className="absolute inset-0">
          <img src={hero.photo} alt="" className="h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
        </div>
        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col items-start justify-end px-4 pb-16 pt-32">
          <Kicker light>A new capsule inside TIDESTATE</Kicker>
          <h1 className="mt-3 font-display text-[11vw] font-extrabold uppercase leading-[0.9] tracking-tight sm:text-7xl">
            The Riviera<br />Set.
          </h1>
          <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-concrete">
            Matching short-sleeve camp-collar shirts and tailored shorts. Smart-casual,
            beach-to-bar, one set for the whole day out.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn onClick={() => document.getElementById('sets')?.scrollIntoView({ behavior: 'smooth' })} variant="bone">Shop the sets</Btn>
            <Btn onClick={() => document.getElementById('sourcing')?.scrollIntoView({ behavior: 'smooth' })} variant="outline" className="text-bone">Why it's sourced differently</Btn>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-ink/10 bg-bone">
        <Reveal group className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4">
          {TRUST.map(([t, d]) => (
            <div key={t}>
              <p className="font-display text-xs font-extrabold uppercase tracking-wide">{t}</p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-ink/55">{d}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Sets */}
      <section id="sets" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <Kicker>Three sets, launch capsule</Kicker>
        <H2 className="mt-3">One set. Every hour of the day out.</H2>
        <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-ink/65">
          Breakfast, the pool, lunch somewhere with a view, out again by sunset — the same
          set carries all of it. Tight range on purpose: three colourways, worn-tested,
          nothing rushed to shelf.
        </p>
        <StateLine className="my-8" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RIVIERA_PRODUCTS.map((p) => <SetCard key={p.id} product={p} />)}
        </div>

        {/* Bundle nudge */}
        <Reveal className="mt-10 border-2 border-ink p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg font-extrabold uppercase">All three sets</p>
              <p className="mt-1 font-mono text-xs text-ink/60">One of each colourway — {fmt(bundleTotal)} solo, save 10% as a bundle.</p>
            </div>
            <Btn
              data-testid="riviera-bundle-add"
              onClick={() => RIVIERA_PRODUCTS.forEach((p) => addToCart(p.id, p.colours[0], 'M', 1))}
            >
              Add all three · {fmt(Math.round(bundleTotal * 0.9))}
            </Btn>
          </div>
        </Reveal>
      </section>

      {/* Express checkout showcase */}
      <section className="bg-ink text-bone">
        <Reveal className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Kicker light>Fast checkout</Kicker>
              <H2 light className="mt-3">Two taps. Done.</H2>
              <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-concrete">
                Apple Pay, Google Pay and Shop Pay all check out in under 10 seconds — no
                typed card number, no typed address. Once this capsule is live on Shopify
                Payments, all three are provisioned automatically; nothing custom to build.
              </p>
            </div>
            <div className="border-2 border-bone/15 bg-bone p-6 text-ink">
              <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink/50">Example — Riviera Stripe Set</p>
              <p className="mt-1 font-display text-2xl font-extrabold">{fmt(hero.price)}</p>
              <ExpressCheckout amount={hero.price} className="mt-4" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Sourcing honesty section — the differentiator */}
      <section id="sourcing" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <Kicker>The honest version</Kicker>
            <H2 className="mt-3">Why this capsule is priced the way it is.</H2>
            <div className="mt-5 max-w-lg space-y-4 font-mono text-sm leading-relaxed text-ink/75">
              <p>
                The core TIDESTATE range is custom cut-and-sew, sampled and wash-tested
                over months — that's why it carries construction claims we can back with a
                spec sheet. The Riviera Set is different on purpose: we're sourcing it
                through a leaner supply model to test the category properly before
                committing to full custom production.
              </p>
              <p>
                That means a faster, more accessible price. It also means we don't make
                GSM or construction claims on this line — we haven't earned the right to
                yet. What we do promise: we wear-test every set ourselves before it's
                listed, we tell you the real delivery window, and if a colourway proves
                itself, it graduates to our own label and better fabric sourcing next.
              </p>
            </div>
          </div>
          <div className="border border-ink/15 bg-white/40 p-6">
            <p className="font-display text-sm font-extrabold uppercase">What "graduates" means</p>
            <ol className="mt-3 space-y-2 font-mono text-xs text-ink/65">
              <li><strong className="text-ink">01 — Now:</strong> lean-sourced, sample-tested, honestly priced.</li>
              <li><strong className="text-ink">02 — 60–90 days:</strong> best-selling colourway moves to a private-label batch with our own trims and tag.</li>
              <li><strong className="text-ink">03 — Proven twice:</strong> full custom construction, same standard as DROP 001.</li>
            </ol>
            <p className="mt-4 font-mono text-[10px] text-ink/45">Full sourcing breakdown: docs/RIVIERA_CAPSULE.md (internal).</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-ink/10 bg-bone">
        <Reveal className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
          <Kicker>Questions</Kicker>
          <H2 className="mt-3">Straight answers.</H2>
          <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {FAQS.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between font-display text-sm font-extrabold uppercase">
                  {q}
                  <span className="font-mono text-lg group-open:hidden">+</span>
                  <span className="hidden font-mono text-lg group-open:inline">−</span>
                </summary>
                <p className="mt-3 font-mono text-xs leading-relaxed text-ink/65">{a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      {/* VIP */}
      <section className="bg-ink text-bone">
        <Reveal className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
          <Kicker light>First to know</Kicker>
          <H2 light className="mt-3">Next colourway, before anyone else.</H2>
          <div className="mx-auto mt-6 max-w-md"><EmailSignup dark id="riviera-email" /></div>
        </Reveal>
      </section>
    </main>
  );
}
