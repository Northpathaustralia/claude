import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, BUNDLES, fmt, JOURNAL } from '../data/products.js';
import { Btn, Kicker, H2, Section, StateLine, TideBars, EmailSignup } from '../components/ui.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import GarmentArt from '../components/GarmentArt.jsx';
import FitTool from '../components/FitTool.jsx';

/* Video placeholders: animated brand canvases stand in for founder/lifestyle
   footage until it's shot (day 41–43 of the 90-day plan). Swap points are
   documented in docs/SHOPIFY_HANDOFF.md. */
const VideoPlaceholder = ({ label, className = '' }) => (
  <div className={`relative overflow-hidden bg-ink ${className}`} role="img" aria-label={label}>
    <svg viewBox="0 0 800 450" className="h-full w-full opacity-90" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#090909" />
          <stop offset="0.62" stopColor="#131629" />
          <stop offset="0.78" stopColor="#3a2b20" />
          <stop offset="0.86" stopColor="#FF4A1F" stopOpacity="0.75" />
          <stop offset="1" stopColor="#090909" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#dawn)" />
      <circle cx="400" cy="385" r="34" fill="#FF4A1F" opacity="0.9" />
      <rect y="392" width="800" height="58" fill="#090909" />
      <g fill="#F1EEE6" opacity="0.35">
        <rect x="60" y="300" width="26" height="92" /><rect x="100" y="330" width="26" height="62" />
        <rect x="140" y="352" width="26" height="40" /><rect x="640" y="322" width="26" height="70" />
        <rect x="680" y="292" width="26" height="100" /><rect x="720" y="342" width="26" height="50" />
      </g>
      <g fontFamily="monospace" fill="#BFC0BA" fontSize="13" opacity="0.8">
        <text x="24" y="34">REC ● 04:55:12 AEST</text>
        <text x="24" y="430" letterSpacing="3">28.0167°S / 153.4000°E</text>
        <text x="620" y="430" letterSpacing="2">{label}</text>
      </g>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-bone/70 bg-ink/40 backdrop-blur transition-transform hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-bone"><path d="M8 5v14l11-7z" /></svg>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <main>
      {/* 1 — HERO */}
      <section className="relative bg-ink text-bone">
        <VideoPlaceholder label="LAUNCH FILM V1" className="absolute inset-0 h-full w-full" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col items-start justify-end px-4 pb-16 pt-32">
          <Kicker light>Premium climate-built streetwear · designed on the Gold Coast</Kicker>
          <h1 className="mt-3 font-display text-[13vw] font-extrabold uppercase leading-[0.88] tracking-tight sm:text-8xl">
            Change<br />your state.
          </h1>
          <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-concrete">
            One premium outfit engineered for the whole Australian day — first light, late nights and everything between.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn to="/drop/first-light" variant="bone">Shop Drop 001</Btn>
            <Btn to="/construction" variant="outline" className="text-bone">Discover Coastform</Btn>
          </div>
        </div>
      </section>

      {/* 2 — PRODUCT TICKER */}
      <section aria-label="Drop 001 products" className="border-y border-ink/10 bg-bone py-10">
        <div className="overflow-hidden">
          <div className="flex w-max animate-ticker gap-4 px-4 hover:[animation-play-state:paused]">
            {[...PRODUCTS, ...PRODUCTS].map((p, i) => (
              <Link key={p.id + i} to={`/product/${p.id}`} className="w-56 shrink-0 border border-ink/10 bg-white/50 transition-colors hover:border-cobalt sm:w-64">
                <GarmentArt kind={p.kind} colour={p.colours[0]} className="aspect-square w-full" />
                <div className="flex items-center justify-between px-3 py-2.5">
                  <span className="font-display text-xs font-extrabold uppercase">{p.name}</span>
                  <span className="font-mono text-xs">{fmt(p.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — CLIMATE-BUILT DIFFERENCE */}
      <Section dark>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Kicker light>The climate-built difference</Kicker>
            <H2 light className="mt-3">The heavyweight look without the heavyweight feel.</H2>
            <p className="mt-5 max-w-lg font-mono text-sm leading-relaxed text-concrete">
              Most premium streetwear gets its structure from dense, hot fabric — designed for Melbourne winters,
              brutal at 28° south. COASTFORM goes the other way: compact-knit yarns for drape and shape,
              an opener knit for airflow, pre-shrunk and enzyme-washed so wash thirty looks like day one.
            </p>
            <ul className="mt-6 grid max-w-lg gap-3 sm:grid-cols-2">
              {[
                ['240–420 GSM', 'structured weights, breathable knits'],
                ['Pre-shrunk', 'size L stays size L'],
                ['Reinforced necks', 'the first failure point, fixed'],
                ['Anti-twist', 'side-seamed, skew-controlled'],
              ].map(([k, v]) => (
                <li key={k} className="border border-bone/15 p-3">
                  <p className="font-display text-sm font-extrabold uppercase text-bone">{k}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-concrete">{v}</p>
                </li>
              ))}
            </ul>
            <Btn to="/construction" variant="bone" className="mt-7">Our construction standard</Btn>
          </div>
          <TideBars className="mx-auto h-44 w-full max-w-xs opacity-90" />
        </div>
      </Section>

      {/* 4 — CONSTRUCTION VIDEO */}
      <Section>
        <Kicker>Engine two · the product proof</Kicker>
        <H2 className="mt-3">We argue about millimetres so you never think about them.</H2>
        <VideoPlaceholder label="PROOF: NECK RIB TEST" className="mt-8 aspect-video w-full" />
        <p className="mt-3 font-mono text-[11px] text-ink/50">
          Wash tests, seam pulls and cost breakdowns — filmed, not claimed. New proof video weekly on the <Link className="underline hover:text-cobalt" to="/journal">Journal</Link>.
        </p>
      </Section>

      {/* 5 — SHOP THE UNIFORM */}
      <Section dark>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker light>Build your state</Kicker>
            <H2 light className="mt-3">Shop the uniform.</H2>
          </div>
          <Btn to="/uniform" variant="bone">Open the outfit builder</Btn>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BUNDLES.map((b) => (
            <Link key={b.id} to="/uniform" className="group border border-bone/15 p-4 transition-colors hover:border-cobalt">
              <div className="flex -space-x-6">
                {b.items.slice(0, 4).map((id, i) => {
                  const p = PRODUCTS.find((x) => x.id === id);
                  return <div key={i} className="h-20 w-20 overflow-hidden rounded-full border-2 border-ink bg-bone"><GarmentArt kind={p.kind} colour={p.colours[0]} className="h-full w-full" /></div>;
                })}
              </div>
              <p className="mt-4 font-display text-sm font-extrabold uppercase text-bone">{b.name}</p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-concrete">{b.blurb}</p>
              <p className="mt-3 font-mono text-sm text-bone">
                {fmt(b.price)} <s className="text-concrete/60">{fmt(b.solo)}</s>
                <span className="ml-2 bg-cobalt px-1.5 py-0.5 text-[10px] uppercase">save {fmt(b.solo - b.price)}</span>
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 6 — UGC / COMMUNITY CONTENT */}
      <Section>
        <Kicker>Worn, not modelled</Kicker>
        <H2 className="mt-3">Real days. Real bodies.</H2>
        <p className="mt-3 max-w-lg font-mono text-sm text-ink/60">
          Customer and creator videos land here as they're posted — with permission, always credited, never staged.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {['5.02AM · BURLEIGH', 'CAFÉ · 7.40AM', 'GYM · 6.15PM', 'FLIGHT · 9.20PM'].map((slot, i) => (
            <div key={slot} className="relative aspect-[4/5] overflow-hidden border border-ink/10 bg-concrete/30">
              <GarmentArt kind={PRODUCTS[i % PRODUCTS.length].kind} colour={PRODUCTS[i % PRODUCTS.length].colours[0]} className="h-full w-full opacity-70" />
              <div className="absolute inset-0 flex flex-col justify-between p-3">
                <span className="self-start bg-ink px-2 py-1 font-mono text-[9px] uppercase tracking-widest2 text-bone">{slot}</span>
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink/60">Your clip here — tag @tidestate</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 7 — FIT WITHOUT THE GUESSWORK */}
      <Section dark id="fit">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <Kicker light>Sizing, solved</Kicker>
            <H2 light className="mt-3">Fit without the guesswork.</H2>
            <p className="mt-4 max-w-md font-mono text-sm leading-relaxed text-concrete">
              Exact garment measurements on every product. Real model data, multiple body shapes, video sizing
              guides — and if we still get it wrong, your first exchange is free.
            </p>
            <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
              {PRODUCTS.slice(0, 2).map((p) => (
                <div key={p.id} className="border border-bone/15 p-4 font-mono text-[11px] leading-relaxed text-concrete">
                  <p className="font-display text-xs font-extrabold uppercase text-bone">{p.name}</p>
                  <p className="mt-2">Model: {p.model.height}cm · {p.model.weight}kg</p>
                  <p>Chest {p.model.chest} · Waist {p.model.waist}</p>
                  <p>Wears <strong className="text-bone">{p.model.wears}</strong> · likes it {p.model.prefers.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-ink"><FitTool /></div>
        </div>
      </Section>

      {/* 8 — FOUNDER STORY */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[320px_1fr]">
          <div className="relative mx-auto aspect-[4/5] w-64 border-2 border-ink bg-concrete/40 lg:w-full">
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest2 text-ink/50">Founder photo — day 41 shoot</div>
            <span className="absolute bottom-3 left-3 bg-ink px-2 py-1 font-mono text-[10px] uppercase tracking-widest2 text-bone">James · Gold Coast</span>
          </div>
          <div>
            <Kicker>Built in public</Kicker>
            <H2 className="mt-3">A Gold Coast build, on the record.</H2>
            <div className="mt-5 max-w-xl space-y-4 font-mono text-sm leading-relaxed text-ink/75">
              <p>
                I'm James. I've spent years building businesses and working directly with people, and kept hitting
                the same wardrobe problem: the day doesn't happen in one outfit's worth of settings. Training at
                first light, client work by nine, the airport by Thursday, the beach Saturday — and nothing premium
                was actually built for that sequence in this climate.
              </p>
              <p>
                So TIDESTATE is the answer, built in daylight. Every sample, supplier call, mistake and
                millimetre-level argument goes on camera. You'll see the wins and the duds, and you vote on what
                gets made next.
              </p>
            </div>
            <Btn to="/about" className="mt-6">The full story</Btn>
          </div>
        </div>
      </Section>

      {/* 9 — COMMUNITY / EVENTS */}
      <Section dark>
        <Kicker light>First Light Club</Kicker>
        <H2 light className="mt-3">Once a month, the brand happens in person.</H2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ['SUNRISE WALK + COFFEE', 'Burleigh headland · first Saturday · 5.45am', 'Free. Bring nothing but a hoodie.'],
            ['TRAINING SESSION', 'Rotating GC gyms · monthly', 'Community session, all levels, filmed only with consent.'],
            ['FOUNDER Q&A + PREVIEW', 'Quarterly · Gold Coast', 'See the next drop before anyone. Argue about colours with James.'],
          ].map(([t, w, d]) => (
            <article key={t} className="border border-bone/15 p-5">
              <StateLine className="mb-4" />
              <h3 className="font-display text-base font-extrabold uppercase text-bone">{t}</h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-cobalt">{w}</p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-concrete">{d}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 font-mono text-[11px] text-concrete/70">Expanding to Brisbane and Sydney as the crew grows. RSVP links go to the VIP list first.</p>
      </Section>

      {/* 10 — VIP */}
      <Section className="border-t border-ink/10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <Kicker>VIP early access</Kicker>
          <H2 className="mt-3">The list gets first light.</H2>
          <p className="mt-3 font-mono text-sm text-ink/60">
            48 hours early on every drop. Honest stock. A real vote on what we make next. That's the whole deal.
          </p>
          <div className="mt-6 w-full max-w-md"><EmailSignup sms id="home-email" /></div>
        </div>
      </Section>

      {/* Journal teaser */}
      <Section dark className="border-t border-bone/10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <H2 light>From the journal.</H2>
          <Btn to="/journal" variant="outline" className="text-bone">All entries</Btn>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {JOURNAL.map((j) => (
            <Link key={j.id} to={`/journal/${j.id}`} className="group border border-bone/15 p-5 transition-colors hover:border-cobalt">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cobalt">{j.tag}</p>
              <h3 className="mt-2 font-display text-lg font-extrabold uppercase leading-tight text-bone group-hover:text-cobalt">{j.title}</h3>
              <p className="mt-2 line-clamp-3 font-mono text-xs leading-relaxed text-concrete">{j.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
