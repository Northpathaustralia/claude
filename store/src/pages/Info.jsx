import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FAQS, JOURNAL } from '../data/products.js';
import { Kicker, H2, StateLine, Btn, TideBars, Section } from '../components/ui.jsx';
import FitTool from '../components/FitTool.jsx';

const Page = ({ kicker, title, children, wide }) => (
  <main className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-3xl'} px-4 py-14 sm:py-20`}>
    <Kicker>{kicker}</Kicker>
    <H2 className="mt-3">{title}</H2>
    <StateLine className="my-8" />
    <div className="space-y-5 font-mono text-sm leading-relaxed text-ink/75">{children}</div>
  </main>
);

export function About() {
  return (
    <Page kicker="About" title="Built on the coast. Built in daylight." wide>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <p>
            TIDESTATE is a premium streetwear company from the Gold Coast, Queensland, built around one problem:
            Australian days don't happen in one setting, and Australian streetwear is mostly designed for
            somewhere colder.
          </p>
          <p>
            I'm James Forycki. I've spent years building businesses and working directly with people. The wardrobe
            problem followed me the whole way — training at first light, client work by nine, the airport on
            Thursday, the beach Saturday, dinner that night. Gym merch looked like gym merch in every room except
            the gym. Fashion pieces couldn't survive a Queensland February.
          </p>
          <p>
            So we build the answer here, and we build it publicly. Every sample, every supplier call, every
            mistake and every millimetre-level argument goes on camera. The community sees the wins and the duds
            and votes on what gets made next. No invented backstory. No pretending to be bigger than we are.
          </p>
          <p className="font-bold text-ink">
            Premium streetwear engineered for the Australian climate. Built on the Gold Coast for first light,
            late nights and everything between. Change your state.
          </p>
        </div>
        <div className="space-y-4">
          <div className="border-2 border-ink p-6">
            <TideBars tone="#090909" className="h-16 w-32" />
            <p className="mt-4 font-display text-base font-extrabold uppercase text-ink">Why the tide bars?</p>
            <p className="mt-2 text-xs">
              Our design language comes from coastal infrastructure — tide charts, coordinates, road markings,
              transit graphics. The five bars are a real Gold Coast tide day, falling to first light, then
              building. Not a palm tree in sight.
            </p>
          </div>
          <div className="border border-ink/15 p-6 text-xs">
            <p className="font-display text-sm font-extrabold uppercase text-ink">The rules we hold ourselves to</p>
            <ul className="mt-3 space-y-1.5">
              <li>· Real stock counts or no stock counts</li>
              <li>· Countdowns only to real events</li>
              <li>· No fake sales, ever</li>
              <li>· Reviews from verified buyers only</li>
              <li>· Construction facts, not pseudo-science</li>
              <li>· Mistakes get published, not buried</li>
            </ul>
          </div>
        </div>
      </div>
    </Page>
  );
}

export function Construction() {
  const FEATURES = [
    ['Compact-knit cotton', 'Structure from the yarn, not from heat-trapping density. Heavyweight drape that breathes.'],
    ['Pre-shrunk, verified', 'Under 5% residual shrinkage after three domestic washes — tested per batch, filmed.'],
    ['Enzyme washed', 'Broken-in hand feel from day one, colour that holds its shade band.'],
    ['Reinforced neck system', '20mm elastane rib, shoulder-to-shoulder taping and an internal collar panel — the first failure point on every cheap tee, fixed.'],
    ['Anti-twist construction', 'Side-seamed bodies and skew-controlled cutting so garments never spiral after washing.'],
    ['Real hardware', 'Metal-tipped drawcords, quality zips, bar tacks at every stress point, secure phone pockets.'],
    ['Honest measurements', 'Exact garment specs on every product page, ±1cm, audited on camera.'],
    ['Garment passport', 'A QR on the care label opens fit videos, care guides and the batch story for that exact style.'],
  ];
  return (
    <main>
      <Section dark>
        <Kicker light>Our construction standard</Kicker>
        <H2 light className="mt-3">Coastform Construction.</H2>
        <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-concrete">
          COASTFORM is our internal build standard for warm-climate structure: what every TIDESTATE garment must
          survive before it ships. It's a construction spec, not a technology claim — every point below is a
          checkable fact about how the garment is made, and we film the tests.
        </p>
      </Section>
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(([t, d], i) => (
            <article key={t} className="border border-ink/10 bg-white/40 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cobalt">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-1 font-display text-base font-extrabold uppercase">{t}</h3>
              <p className="mt-2 font-mono text-xs leading-relaxed text-ink/65">{d}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 border-2 border-ink p-6">
          <p className="font-display text-lg font-extrabold uppercase">What we don't claim</p>
          <p className="mt-2 max-w-2xl font-mono text-xs leading-relaxed text-ink/65">
            No "cooling technology", no antibacterial anything, no performance percentages without a test report.
            If we can't show it on camera or in a spec sheet, it doesn't go on the label.
          </p>
          <Btn to="/shop" className="mt-5">Shop the standard</Btn>
        </div>
      </Section>
    </main>
  );
}

export function FitGuide() {
  return (
    <Page kicker="Fit guide" title="Fit without the guesswork." wide>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-5">
          <p>
            Every TIDESTATE piece is cut on a unisex oversized block and published with exact garment
            measurements — not body measurements, garment measurements. Here's how to use them:
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-xs">
            <li>Take your best-fitting tee/hoodie and lay it flat.</li>
            <li>Measure armpit-to-armpit (half chest) and collar-to-hem (length).</li>
            <li>Compare against the size table on the product page. Our tolerance is ±1cm.</li>
            <li>Between sizes? Size down for a closer fit — the block is oversized by design.</li>
          </ol>
          <p className="text-xs">
            Still unsure? Use the tool, and remember: <strong className="text-ink">first exchange is free for
            first-time customers</strong> — we send the new size with a prepaid return label.
          </p>
          <div className="border border-ink/15 p-5 text-xs">
            <p className="font-display text-sm font-extrabold uppercase text-ink">Model data on every page</p>
            <p className="mt-2">
              Height, weight, chest, waist, the size worn and how they like it to sit — for multiple body shapes.
              Video sizing guides for every size land with the launch shoot.
            </p>
          </div>
        </div>
        <FitTool />
      </div>
    </Page>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Page kicker="Contact" title="Talk to a human.">
      <p>
        Sizing, orders, wholesale, creator applications, or telling James the hood should be 5mm deeper — all of
        it lands in one inbox and gets answered by a person, usually within one business day.
      </p>
      {sent ? (
        <p className="border-2 border-cobalt p-5 text-ink" data-testid="contact-sent">✓ Sent. You'll hear back within one business day (Gold Coast time).</p>
      ) : (
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }} data-testid="contact-form">
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Name" aria-label="Name" className="border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
            <input required type="email" placeholder="Email" aria-label="Email" className="border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
          </div>
          <select aria-label="Topic" className="w-full border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt">
            <option>Order help</option><option>Sizing / exchange</option><option>Creator application</option>
            <option>Wholesale</option><option>Feedback for James</option>
          </select>
          <textarea required placeholder="Message" aria-label="Message" rows="5" className="w-full border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
          <Btn type="submit">Send it</Btn>
        </form>
      )}
      <p className="text-xs text-ink/50">TIDESTATE · Gold Coast QLD · support@tidestate.example (placeholder until domain confirmed)</p>
    </Page>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <Page kicker="FAQ" title="Straight answers.">
      <div className="divide-y divide-ink/10 border-y border-ink/10">
        {FAQS.map((f, i) => (
          <div key={f.q}>
            <button
              className="flex w-full items-center justify-between gap-4 py-4 text-left font-display text-sm font-extrabold uppercase"
              aria-expanded={open === i}
              data-testid={`faq-${i}`}
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              {f.q}
              <span className="font-mono text-lg">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <p className="pb-5 font-mono text-xs leading-relaxed text-ink/70">{f.a}</p>}
          </div>
        ))}
      </div>
      <p className="text-xs">Something else? <Link to="/contact" className="underline hover:text-cobalt">Contact us</Link> — a human answers.</p>
    </Page>
  );
}

export function Shipping() {
  return (
    <Page kicker="Shipping" title="From the coast to your door.">
      <ul className="space-y-3">
        <li><strong className="text-ink">Australia — standard:</strong> FREE over $150, otherwise $9.95 flat. 2–6 business days depending on state.</li>
        <li><strong className="text-ink">Australia — express:</strong> $14.95, 1–3 business days.</li>
        <li><strong className="text-ink">Dispatch:</strong> 1–2 business days from the Gold Coast. You get tracking the moment it ships.</li>
        <li><strong className="text-ink">International:</strong> opening region by region after launch — join the list to hear when yours opens.</li>
        <li><strong className="text-ink">Pre-orders:</strong> only offered when we can print the dispatch date on the product page and in checkout. The date you see is the date we ship.</li>
      </ul>
      <p className="text-xs text-ink/50">Rates shown are launch targets; live rates always display in checkout before payment.</p>
    </Page>
  );
}

export function Returns() {
  return (
    <Page kicker="Returns & exchanges" title="Get it right, or make it right.">
      <ul className="space-y-3">
        <li><strong className="text-ink">First exchange free (first order):</strong> wrong size on your first order? We send the new size and a prepaid return label. No cost, no lecture.</li>
        <li><strong className="text-ink">30-day change of mind:</strong> eligible full-price items, unworn with tags, within 30 days of delivery — refund or credit, your call.</li>
        <li><strong className="text-ink">Faulty items:</strong> covered under Australian Consumer Law — repair, replacement or refund. These rights always apply and sit above any store policy.</li>
        <li><strong className="text-ink">Numbered editions:</strong> exchangeable for size only (they're numbered — we can't reprint them).</li>
      </ul>
      <p>Start any return from your <Link to="/account" className="underline hover:text-cobalt">account page</Link> or the <Link to="/contact" className="underline hover:text-cobalt">contact form</Link> with your order number.</p>
      <p className="text-xs text-ink/50">Full policy wording to be finalised with legal review before launch (see docs/AUSTRALIAN_SETUP.md).</p>
    </Page>
  );
}

export function Privacy() {
  return (
    <Page kicker="Privacy" title="Privacy policy.">
      <p className="border-2 border-dashed border-signal/60 bg-signal/5 p-4 text-xs">
        <strong className="text-ink">PLACEHOLDER — LAWYER REVIEW REQUIRED BEFORE LAUNCH.</strong> This outline shows
        the intended shape of the policy; it is not legal advice and not final wording.
      </p>
      <ul className="space-y-2 text-xs">
        <li>· What we collect: order details, contact details, sizes, and (with consent) marketing preferences.</li>
        <li>· Why: to fulfil orders, provide support, improve fit data, and send marketing you asked for.</li>
        <li>· Marketing: express opt-in only, unsubscribe in every message (Spam Act 2003).</li>
        <li>· Sharing: shipping carriers, payment processors and email tooling — never sold.</li>
        <li>· Storage & security, access & deletion requests, cookies, and complaints process to be drafted per OAIC guidance.</li>
      </ul>
    </Page>
  );
}

export function Terms() {
  return (
    <Page kicker="Terms" title="Terms of service.">
      <p className="border-2 border-dashed border-signal/60 bg-signal/5 p-4 text-xs">
        <strong className="text-ink">PLACEHOLDER — LAWYER REVIEW REQUIRED BEFORE LAUNCH.</strong> Sections to be
        drafted: identity & ABN, ordering & payment (GST-inclusive pricing), shipping, returns (consistent with
        the Returns page and ACL), pre-order terms, gift cards, intellectual property, acceptable use,
        limitation of liability (to the extent permitted by law), governing law (Queensland).
      </p>
    </Page>
  );
}

export function Creators() {
  const [sent, setSent] = useState(false);
  return (
    <Page kicker="State Crew" title="Wear it. Film it. Get paid on what converts.">
      <p>
        STATE CREW is our creator program — built for micro-creators with real audiences on the Gold Coast,
        Brisbane, Sunshine Coast, Sydney and Melbourne. No bought followers, no scripted ad reads. We seed
        product, you make what you'd naturally make, and commissions track what actually converts.
      </p>
      <ul className="space-y-2 text-xs">
        <li>· <strong className="text-ink">Seed:</strong> numbered cap + tee, no obligation.</li>
        <li>· <strong className="text-ink">Crew:</strong> full uniform + 10% code for your audience + 10% commission.</li>
        <li>· <strong className="text-ink">Core:</strong> 15% commission, paid content days, product input, event co-hosting.</li>
        <li>· Always disclose gifted/paid per ACCC & AANA rules — non-negotiable.</li>
      </ul>
      {sent ? (
        <p className="border-2 border-cobalt p-5" data-testid="creator-sent">✓ Application in. We score every application on engagement quality, not follower count — expect an answer within a week.</p>
      ) : (
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setSent(true); }} data-testid="creator-form">
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Name" aria-label="Name" className="border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
            <input required placeholder="City" aria-label="City" className="border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
            <input required placeholder="@handle (IG or TikTok)" aria-label="Social handle" className="border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
            <input placeholder="Follower count (roughly)" aria-label="Follower count" className="border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
          </div>
          <textarea required rows="4" placeholder="Why does the uniform fit your actual life? Link one video that shows you talking to camera." aria-label="Application" className="w-full border-2 border-ink/20 bg-transparent px-4 py-3 text-sm outline-none focus:border-cobalt" />
          <Btn type="submit">Apply to State Crew</Btn>
        </form>
      )}
    </Page>
  );
}

export function Journal() {
  return (
    <Page kicker="Journal" title="The build, on the record." wide>
      <div className="grid gap-5 sm:grid-cols-3">
        {JOURNAL.map((j) => (
          <Link key={j.id} to={`/journal/${j.id}`} className="group border border-ink/10 bg-white/40 p-5 transition-colors hover:border-cobalt">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-cobalt">{j.tag} · {j.date}</p>
            <h3 className="mt-2 font-display text-lg font-extrabold uppercase leading-tight group-hover:text-cobalt">{j.title}</h3>
            <p className="mt-2 font-mono text-xs leading-relaxed text-ink/60">{j.excerpt}</p>
          </Link>
        ))}
      </div>
    </Page>
  );
}

export function JournalPost() {
  const { postId } = useParams();
  const post = JOURNAL.find((j) => j.id === postId);
  if (!post) return <Page kicker="Journal" title="Entry not found."><Link to="/journal" className="underline">Back to the journal</Link></Page>;
  return (
    <Page kicker={`${post.tag} · ${post.date}`} title={post.title}>
      <p>{post.body}</p>
      <p className="text-xs">— James</p>
      <Link to="/journal" className="inline-block font-mono text-xs uppercase tracking-widest2 underline hover:text-cobalt">← All entries</Link>
    </Page>
  );
}
