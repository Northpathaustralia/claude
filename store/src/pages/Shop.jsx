import React from 'react';
import { useParams } from 'react-router-dom';
import { PRODUCTS, DROP } from '../data/products.js';
import { Kicker, H2, StateLine, useCountdown, EmailSignup } from '../components/ui.jsx';
import { ProductGrid } from '../components/ProductCard.jsx';
import GarmentArt from '../components/GarmentArt.jsx';

const Shell = ({ kicker, title, intro, children }) => (
  <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
    <Kicker>{kicker}</Kicker>
    <H2 className="mt-3">{title}</H2>
    {intro && <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-ink/65">{intro}</p>}
    <StateLine className="my-8" />
    {children}
  </main>
);

export function ShopAll() {
  return (
    <Shell kicker="The range" title="Shop all." intro="Five pieces. Every one earns its place or it doesn't ship. Filter, sort, and check the exact measurements before you buy.">
      <ProductGrid products={PRODUCTS} badgeFor={(p) => (p.drop === 'first-light' ? 'Drop 001' : null)} />
    </Shell>
  );
}

export function DropPage() {
  const t = useCountdown(DROP.launchesAt);
  const live = !DROP.countdownEnabled || !t;
  return (
    <main>
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <Kicker light>Drop 001 · limited first run</Kicker>
          <h1 className="mt-3 font-display text-6xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-8xl">First light.</h1>
          <p className="mt-5 max-w-xl font-mono text-sm leading-relaxed text-concrete">
            The hours before sunrise — when the carpark's empty and the day is still yours. Five pieces engineered
            to run from that moment to last call. Honest quantities, no reprints of numbered editions.
          </p>
          {!live && (
            <div className="mt-8 inline-flex flex-col gap-2 border-2 border-cobalt p-5" data-testid="drop-countdown">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-cobalt">Public release in</p>
              <p className="font-display text-4xl font-extrabold tabular-nums">
                {t.d}d {t.h}h {t.m}m {String(t.s).padStart(2, '0')}s
              </p>
              <p className="font-mono text-[10px] text-concrete">{DROP.vipNote} This timer points at the real launch — we don't do fake countdowns.</p>
            </div>
          )}
          {live && <p className="mt-8 inline-block bg-signal px-3 py-2 font-mono text-xs font-bold uppercase tracking-widest2 text-ink">Live now</p>}
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <ProductGrid products={PRODUCTS.filter((p) => p.drop === 'first-light')} showFilters={false} />
        <div className="mt-12 border-2 border-ink/15 p-6 sm:p-8">
          <p className="font-display text-lg font-extrabold uppercase">Want the doors 48 hours early?</p>
          <div className="mt-4"><EmailSignup id="drop-email" /></div>
        </div>
      </div>
    </main>
  );
}

const STYLING = {
  mens: {
    kicker: "Men's styling",
    title: 'One uniform, every room.',
    intro: 'Every TIDESTATE piece is unisex — this is how the range runs through a man\'s day. Model is 184cm / 82kg wearing L in tops, M in shorts.',
    key: 'mens',
  },
  womens: {
    kicker: "Women's styling",
    title: 'Oversized, on your terms.',
    intro: 'Same five pieces, styled her way — cropped tucks, hoodie-as-dress, sized-down fits. Model is 168cm / 61kg wearing S–M across the range.',
    key: 'womens',
  },
};

export function StylingPage({ variant }) {
  const cfg = STYLING[variant];
  return (
    <Shell kicker={cfg.kicker} title={cfg.title} intro={cfg.intro}>
      <div className="mb-10 grid gap-4 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="flex items-center gap-4 border border-ink/10 bg-white/40 p-4">
            <div className="h-20 w-20 shrink-0">
              <GarmentArt kind={p.kind} colour={p.colours[0]} className="h-full w-full" />
            </div>
            <div>
              <p className="font-display text-sm font-extrabold uppercase">{p.name}</p>
              <p className="mt-1 font-mono text-xs leading-relaxed text-ink/60">{p.styling[cfg.key]}</p>
            </div>
          </div>
        ))}
      </div>
      <ProductGrid products={PRODUCTS} showFilters={false} />
    </Shell>
  );
}

export function CollectionPage() {
  const { handle } = useParams();
  const map = {
    'first-light': { title: 'Drop 001: First Light', items: PRODUCTS },
    tees: { title: 'Tees & jerseys', items: PRODUCTS.filter((p) => ['tee', 'jersey'].includes(p.kind)) },
    accessories: { title: 'Caps & accessories', items: PRODUCTS.filter((p) => p.kind === 'cap') },
  };
  const col = map[handle] || { title: 'Collection', items: PRODUCTS };
  return (
    <Shell kicker="Collection" title={col.title}>
      <ProductGrid products={col.items} />
    </Shell>
  );
}
