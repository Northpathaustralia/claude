/* EchoSight site content — all generated pages. Voice rules: brand/brand-system-v2.md.
   Every claim here maps to compliance/claim-register.csv. "Example data" labels are load-bearing. */

const LEGAL_BANNER = `<div class="doc-meta"><strong>Draft for review.</strong> This document was prepared as a working draft and has not yet been reviewed by an Australian legal practitioner. It must be reviewed and approved before EchoSight launches publicly. Last updated: 21 July 2026.</div>`;

const BETA_NOTE = `EchoSight is in closed beta. The live demo runs on example data; your own numbers arrive when the beta opens.`;

export const pages = [

// ============================= PRODUCT =============================
{
  slug: 'product', title: 'Product — EchoSight AI',
  desc: 'What EchoSight does: explains why your Instagram content performs, predicts results before you post, and helps you make the next one better.',
  blocks: [
    { type: 'hero', kicker: 'Product', h1: 'One loop: understand, predict, improve, create.',
      sub: 'Instagram tells you what happened. EchoSight reads the content itself — hook, pacing, story, caption, audio — and tells you why, then what to do about it.',
      ctas: [{ href: 'demo.html', label: 'Try the live demo' }, { href: 'free-reel-review.html', label: 'Get a free Reel review', ghost: true }],
      note: BETA_NOTE },
    { type: 'cards', kicker: 'The modules', h2: 'Eight engines. One job.', cols: 3, items: [
      { h: 'Content teardowns', p: 'Frame-by-frame analysis of any Reel, carousel or post, ending in plain English: what worked, what cost you, what to change. <a href="teardowns.html" style="color:var(--echo-400)">More →</a>' },
      { h: 'Pre-Flight prediction', p: 'Scores before you publish — virality, hook, save and share probability — each with a confidence grade, because sometimes we genuinely don’t know. <a href="pre-flight.html" style="color:var(--echo-400)">More →</a>' },
      { h: 'AI Coach', p: 'A weekly plan with at most three experiments, each measured against your own baselines. Not tips. Tests. <a href="coach.html" style="color:var(--echo-400)">More →</a>' },
      { h: 'Trend intelligence', p: 'Daily reads on emerging formats, hooks and audio in your niche, each labelled with the evidence behind it. <a href="trends.html" style="color:var(--echo-400)">More →</a>' },
      { h: 'Competitor intelligence', p: 'Public professional accounts only, clearly labelled estimates, and the gaps they’re leaving open for you. <a href="competitors.html" style="color:var(--echo-400)">More →</a>' },
      { h: 'Creative generator', p: 'Hooks, scripts and storyboards conditioned on your voice and your measured winners — plus production prompt packs for Higgsfield and Fable. <a href="creative-generator.html" style="color:var(--echo-400)">More →</a>' },
    ]},
    { type: 'cards', h2: 'What makes it different', cols: 3, items: [
      { h: 'It explains itself', p: 'Every score opens into its drivers. If a number can’t show where it came from, we don’t show the number.' },
      { h: 'It keeps receipts', p: 'Predictions are reconciled against what actually happened on your account. You can see our track record for you, including the misses.' },
      { h: 'It stays inside the rules', p: 'Official Instagram API only. No scraping, no automation, no “who viewed you” fiction. Your account is never put at risk.' },
    ]},
    { type: 'cta', h2: 'See it work on a real example', sub: 'The interactive demo tears down a sample Reel end to end — scores, drivers, fixes, and the improved script.', href: 'demo.html', label: 'Open the live demo' },
  ],
},

// ============================= HOW IT WORKS =============================
{
  slug: 'how-it-works', title: 'How it works — EchoSight AI',
  desc: 'How EchoSight analyses content, predicts performance, and improves your next post — step by step, with honest limits.',
  blocks: [
    { type: 'hero', kicker: 'How it works', h1: 'From upload to “now I get it” in about a minute.',
      sub: 'No setup required. Connect your professional account later if you want your own baselines — or never, and keep using Studio mode.' },
    { type: 'cards', h2: 'The loop, step by step', cols: 3, items: [
      { h: '1 · Upload or connect', p: 'Drag in a Reel, or connect your Instagram professional account through the official API. Connecting adds your history and baselines; uploading alone still gets full analysis.' },
      { h: '2 · The read', p: 'EchoSight looks at what a viewer experiences: the first 0.8 seconds, cut rhythm, story shape, caption, call-to-action, audio energy. Each becomes a measurable feature.' },
      { h: '3 · Scores with confidence', p: 'Virality, hook, scroll-stop, save and share probability — every one graded A to D for confidence. A “D” means we’re telling you we’re guessing, and why.' },
      { h: '4 · The why', p: 'A written teardown that cites its own numbers. “Your winners cut 3–4× per 10 seconds; this one cuts 1.9” — that kind of why, not horoscope-speak.' },
      { h: '5 · The fixes', p: 'Ranked changes with expected impact. Re-cut, re-score, compare. Most people iterate two or three times before posting.' },
      { h: '6 · The reckoning', p: 'After you post, actual results are reconciled against the prediction. That honesty loop is also how the system gets sharper for your account.' },
    ]},
    { type: 'prose', html: `
      <h2>What it can and can’t know</h2>
      <p>EchoSight works from two sources: the content itself, and the aggregate metrics Instagram’s official API provides (reach, saves counts, shares counts, and so on, for your own connected account).</p>
      <p><strong>It can:</strong> measure your creative, compare it against what has worked for your account and accounts like yours, and estimate probable outcomes with stated uncertainty.</p>
      <p><strong>It can’t:</strong> see who saved or shared a post, read messages, look at private accounts, or promise results. No tool can. The ones that claim to are the reason we put this sentence on most pages.</p>`},
    { type: 'cta', h2: 'Watch the loop run', sub: 'Pick a sample Reel and walk the whole path — scores, teardown, fixes, improved script.', href: 'demo.html', label: 'Try the interactive demo' },
  ],
},

// ============================= PRE-FLIGHT =============================
{
  slug: 'pre-flight', title: 'Pre-Flight analysis — EchoSight AI',
  desc: 'Score your Reel before you post it: hook, scroll-stop, save and share probability with confidence grades.',
  blocks: [
    { type: 'hero', kicker: 'Pre-Flight', h1: 'The edit is cheap before you post. Expensive after.',
      sub: 'Pre-Flight scores your content while you can still change it: hook strength, pacing risks, save and share probability, and the three fixes with the most leverage.',
      ctas: [{ href: 'demo.html', label: 'Run a sample Pre-Flight' }] },
    { type: 'cards', h2: 'What you get per upload', cols: 3, items: [
      { h: 'Scores that admit uncertainty', p: 'Every probability ships with a confidence grade. New account, unusual format, thin data? The grade drops and we say so.' },
      { h: 'A hook verdict in seconds', p: 'The first 0.8–3 seconds get their own analysis: motion onset, face, text, curiosity. Most flops are decided here.' },
      { h: 'Iteration, not judgement', p: 'Re-upload each cut and watch the score move. The diff view shows exactly which change did what.' },
    ]},
    { type: 'prose', html: `
      <h2>An honest note on prediction</h2>
      <p>Predictions are probabilities, not promises. Instagram’s distribution has real randomness in it, and any tool that says otherwise is lying to you. What we commit to: stated confidence on every score, and a visible record of how our predictions tracked against your actual results. Judge us on the reconciliation.</p>`},
    { type: 'cta', h2: 'Score your next Reel free', sub: 'Five Pre-Flight analyses a month on the free plan. No card.', href: 'waitlist.html', label: 'Join the beta' },
  ],
},

// ============================= TEARDOWNS =============================
{
  slug: 'teardowns', title: 'Content teardowns — EchoSight AI',
  desc: 'Frame-by-frame analysis of your Reels and posts that ends in plain English: why it performed, and what to change.',
  blocks: [
    { type: 'hero', kicker: 'Teardowns', h1: 'Every post has a why. We find it.',
      sub: 'A teardown reads your content the way a sharp editor would — hook, pacing, story, caption, audio, visuals — and writes up the why with the numbers to back it.' },
    { type: 'cards', h2: 'What a teardown covers', cols: 3, items: [
      { h: 'The first second', p: 'Pattern interrupts, motion onset, faces, on-screen text. Where the scroll-stop battle is won.' },
      { h: 'Pacing and retention risk', p: 'Cut rhythm against your winning band, dead zones, the moment viewers statistically leave.' },
      { h: 'Story shape', p: 'Problem→payoff, listicle, transformation, loop potential — and whether the payoff lands where attention still exists.' },
      { h: 'Caption and CTA', p: 'Hook line strength, CTA position against your measured best, hashtag specificity mix.' },
      { h: 'Audio', p: 'Energy curve, speech pace, silence gaps, audio-hook alignment with the visual hook.' },
      { h: 'The verdict', p: 'Three fixes, ranked by expected impact. Not twelve. Three.' },
    ]},
    { type: 'cta', h2: 'Read a full teardown now', sub: 'The demo includes a complete sample teardown on example data.', href: 'demo.html', label: 'See a sample teardown' },
  ],
},

// ============================= COACH =============================
{
  slug: 'coach', title: 'AI Coach — EchoSight AI',
  desc: 'A weekly content plan built from your own data: what worked, what didn’t, and at most three measurable experiments.',
  blocks: [
    { type: 'hero', kicker: 'AI Coach', h1: 'Not tips. Tests.',
      sub: 'Every week the Coach reads your results and proposes at most three experiments — each with a hypothesis, an action, and a target measured against your own baseline. Then it checks the results and says what it got right.' },
    { type: 'cards', h2: 'How coaching works here', cols: 3, items: [
      { h: 'Grounded in your data', p: 'If generic best practice disagrees with what your account actually rewards, the Coach sides with your data — and tells you it’s doing that.' },
      { h: 'Experiments that close', p: '“Question hooks for two posts this week; target: beat your 30-day median saves.” Next week you get the verdict, not vibes.' },
      { h: 'Honest when thin', p: 'New accounts get analysis and craft guidance, not fake certainty. Confidence grades apply to coaching too.' },
    ]},
    { type: 'cta', h2: 'Get your first weekly plan', sub: 'The Coach starts after your first week of connected data.', href: 'waitlist.html', label: 'Join the beta' },
  ],
},

// ============================= TRENDS =============================
{
  slug: 'trends', title: 'Trend intelligence — EchoSight AI',
  desc: 'Daily trend reports for your niche: emerging formats, hooks and audio, each labelled with the evidence behind it.',
  blocks: [
    { type: 'hero', kicker: 'Trends', h1: 'Catch trends while they’re still trends.',
      sub: 'Daily reports on what’s rising in your niche — formats, hook styles, audio — with lifecycle stage (emerging, peaking, declining) and the evidence base printed on every card.' },
    { type: 'cards', h2: 'Why our trends are different', cols: 3, items: [
      { h: 'Evidence on the label', p: '“Seen across 34 tracked public accounts, engagement quality 2.1× niche baseline.” Every trend card says where it came from.' },
      { h: 'Lifecycle honesty', p: 'A peaking trend is often too late. We say which stage a trend is in and predict its shelf life, so you don’t ship day-30 content on a day-3 format.' },
      { h: 'One click to a brief', p: '“Make this yours” hands the trend to the Creative Generator with your brand voice — an adaptation brief, not a copy instruction.' },
    ]},
    { type: 'cta', h2: 'See a sample trend report', sub: 'The examples page includes a full demo trend card.', href: 'examples.html', label: 'View examples' },
  ],
},

// ============================= COMPETITORS =============================
{
  slug: 'competitors', title: 'Competitor intelligence — EchoSight AI',
  desc: 'Track public professional accounts: cadence, formats, engagement estimates and gaps — through the official API, with estimates clearly labelled.',
  blocks: [
    { type: 'hero', kicker: 'Competitors', h1: 'Learn from their grid. Legitimately.',
      sub: 'Track public professional accounts through Instagram’s official Business Discovery API: posting cadence, format mix, estimated engagement quality, breakout posts — and the gaps they’re leaving open for you.' },
    { type: 'cards', h2: 'The rules we track by', cols: 3, items: [
      { h: 'Public professional accounts only', p: 'Private accounts can’t be tracked — by anyone. If a tracked account goes private, tracking stops and we tell you.' },
      { h: 'Estimates labelled as estimates', p: 'When likes are hidden we model engagement from what’s public and print “estimate” on the number. Exact things say exact; modelled things say modelled.' },
      { h: 'Craft learning, not copying', p: 'Teardowns of competitor content study the public craft. The generator produces original adaptations and blocks near-copies automatically.' },
    ]},
    { type: 'cta', h2: 'Watch a head-to-head', sub: 'The demo includes a sample competitor comparison on example data.', href: 'demo.html', label: 'Open the demo' },
  ],
},

// ============================= CREATIVE GENERATOR =============================
{
  slug: 'creative-generator', title: 'Creative generator — EchoSight AI',
  desc: 'Hooks, captions, scripts and storyboards conditioned on your voice and your measured winners — plus Higgsfield and Fable production packs.',
  blocks: [
    { type: 'hero', kicker: 'Creative generator', h1: 'Trained on your winners. Not the internet’s average.',
      sub: 'Generic AI writing sounds like everyone. EchoSight’s generator is conditioned on your brand voice, your measured winning patterns, and — if you want — a current trend brief.' },
    { type: 'cards', h2: 'What it produces', cols: 3, items: [
      { h: 'Hooks, ranked', p: 'Ten variants across styles, each scored and annotated with the evidence it leans on. You pick with your taste; we bring the data.' },
      { h: 'Scripts and storyboards', p: 'Beat-sheets with shot lists, on-screen text, and pacing matched to what retains for you. Carousels get slide-by-slide structure with a save-worthy closer.' },
      { h: 'Production prompt packs', p: 'Complete Higgsfield packs — camera, lighting, movement, scene direction, voice — and Fable packs with character consistency. Script to production-ready in minutes.' },
    ]},
    { type: 'prose', html: `
      <h2>Guardrails, on purpose</h2>
      <p>An originality check blocks output that drifts too close to any referenced source. A claims filter catches things your niche can’t legally say. And a brand-fit score keeps the voice yours — outputs that don’t sound like you get regenerated before you see them.</p>`},
    { type: 'cta', h2: 'Generate a sample brief', sub: 'The demo builds a Higgsfield creative brief from a sample teardown.', href: 'demo.html', label: 'Try it in the demo' },
  ],
},

// ============================= SOLUTIONS: CREATORS =============================
{
  slug: 'creators', title: 'For creators — EchoSight AI',
  desc: 'For Reels-first creators: know why your content performs, fix the hook before you post, and grow saves and shares on evidence.',
  blocks: [
    { type: 'hero', kicker: 'For creators', h1: 'You feel it when a Reel dies. Now you’ll know why.',
      sub: 'You spent three hours editing and thirty seconds on the hook. EchoSight is the tool that catches that — before you post, while it’s still fixable.',
      ctas: [{ href: 'free-reel-review.html', label: 'Get a free Reel review' }, { href: 'demo.html', label: 'See the demo', ghost: true }] },
    { type: 'cards', h2: 'Built around a creator’s week', cols: 3, items: [
      { h: 'Before posting', p: 'Pre-Flight the rough cut. Fix the two things that matter. Post with a read on the range it should land in.' },
      { h: 'After posting', p: 'The teardown explains the result — either way. Wins become repeatable patterns; flops stop being mysteries you take personally.' },
      { h: 'Every Monday', p: 'The Coach hands you a plan: three experiments, measured against your own numbers. Consistency without the burnout spiral.' },
    ]},
    { type: 'cards', h2: 'Straight answers to fair worries', cols: 3, items: [
      { h: '“Will this risk my account?”', p: 'No. Official API, read-only insights, no automation, no scraping. We never post on your behalf.' },
      { h: '“Is this another generic AI?”', p: 'The generator learns your voice from your own top posts. If output doesn’t sound like you, it regenerates before you see it.' },
      { h: '“What if the predictions are wrong?”', p: 'Sometimes they will be. Every score has a confidence grade, and your accuracy page shows our track record on your account.' },
    ]},
    { type: 'cta', h2: 'Start with one free review', sub: 'Upload one Reel. Get the full teardown. Decide from there.', href: 'free-reel-review.html', label: 'Get my free review' },
  ],
},

// ============================= SOLUTIONS: BRANDS =============================
{
  slug: 'brands', title: 'For brands — EchoSight AI',
  desc: 'For social teams: engagement quality, brand consistency scoring, competitor benchmarks and campaign-level lift.',
  blocks: [
    { type: 'hero', kicker: 'For brands', h1: 'Make the content meeting about evidence.',
      sub: 'Your team debates hooks and formats every week. EchoSight replaces opinion-versus-opinion with your account’s measured patterns — and keeps the grid on-brand while you scale output.' },
    { type: 'cards', h2: 'For the team that owns the numbers', cols: 3, items: [
      { h: 'Campaign lift, not vanity', p: 'Group posts into campaigns and see lift against your account baseline — reach, saves, profile actions — with the drivers explained.' },
      { h: 'Brand consistency, scored', p: 'Visual and tonal consistency measured across the grid. New assets get checked against your brand kit before they ship.' },
      { h: 'Competitor context', p: 'Benchmarks against tracked public competitor accounts, estimates clearly labelled, gaps turned into content opportunities.' },
    ]},
    { type: 'cta', h2: 'See it on example data', sub: 'The demo shows the analysis a brand account gets, end to end.', href: 'demo.html', label: 'Open the demo' },
  ],
},

// ============================= SOLUTIONS: AGENCIES =============================
{
  slug: 'agencies', title: 'For agencies — EchoSight AI',
  desc: 'For agencies: white-label reports with the “why” written for you, portfolio health across clients, and per-account pricing that scales.',
  blocks: [
    { type: 'hero', kicker: 'For agencies', h1: 'The monthly report writes its own first draft.',
      sub: 'Wins with the why. Losses with the why. Next month’s plan. Drafted from each client’s actual data in about a minute, edited by your team, delivered under your brand.' },
    { type: 'cards', h2: 'Agency-shaped from the start', cols: 3, items: [
      { h: 'Portfolio view', p: 'Every client account with a health read — growth, engagement quality, consistency — so Monday triage takes minutes.' },
      { h: 'White-label reporting', p: 'Your logo, your colours, your domain on the share link. Blocks regenerate individually when you want a different angle.' },
      { h: 'Pricing that scales with you', p: '$199/month includes 15 client accounts; $9 per extra account after that. The full price list is public — no discovery-call pricing.' },
    ]},
    { type: 'cta', h2: 'Run the numbers on one client', sub: 'If a report takes your team three hours, the maths takes one client.', href: 'waitlist.html', label: 'Join the beta' },
  ],
},

// ============================= PRICING =============================
{
  slug: 'pricing', title: 'Pricing — EchoSight AI',
  desc: 'EchoSight pricing: Free, Starter $29, Pro $79, Agency $199. Every price public, including add-ons. Annual gets two months free.',
  blocks: [
    { type: 'hero', kicker: 'Pricing', h1: 'Every price on this page. Including the add-ons.',
      sub: 'The most common complaint about tools in this category is finding out the real cost after signing up. So: the whole list, up front. Annual billing gets two months free.' },
    { type: 'raw', html: `
<section style="padding-top:16px"><div class="wrap">
  <div class="price-grid">
    <div class="plan rv">
      <div class="name">Free</div>
      <div class="amt">$0</div>
      <div class="for">Real scores, not teasers.</div>
      <ul><li>1 connected account</li><li>5 Pre-Flight analyses / month</li><li>Teardowns with full “why”</li><li>Weekly trend report</li></ul>
      <a class="btn btn-ghost" href="waitlist.html">Join the beta</a>
    </div>
    <div class="plan rv">
      <div class="name">Starter</div>
      <div class="amt">$29<span>/mo</span></div>
      <div class="for">$290/year (two months free)</div>
      <ul><li>25 analyses / month</li><li>AI Coach with weekly experiments</li><li>Daily trend reports</li><li>2 tracked competitors</li><li>100 generation credits</li></ul>
      <a class="btn btn-ghost" href="waitlist.html">Choose Starter</a>
    </div>
    <div class="plan hot rv">
      <div class="name">Pro <span class="pop">Most popular</span></div>
      <div class="amt">$79<span>/mo</span></div>
      <div class="for">$790/year (two months free)</div>
      <ul><li>3 accounts · 150 analyses / month</li><li>Everything in Starter</li><li>10 tracked competitors + alerts</li><li>Higgsfield &amp; Fable prompt packs</li><li>500 generation credits</li></ul>
      <a class="btn btn-primary" href="waitlist.html">Choose Pro</a>
    </div>
    <div class="plan rv">
      <div class="name">Agency</div>
      <div class="amt">$199<span>/mo</span></div>
      <div class="for">$1,990/year · 15 client accounts included</div>
      <ul><li>600 pooled analyses / month</li><li>White-label reports &amp; scheduling</li><li>Team roles &amp; client permissions</li><li>API access &amp; webhooks</li><li>2,000 pooled credits</li></ul>
      <a class="btn btn-ghost" href="waitlist.html">Choose Agency</a>
    </div>
  </div>
  <div class="prose rv" style="margin-top:36px;max-width:100%">
    <h2 style="margin-top:8px">The rest of the price list</h2>
    <table>
      <tr><th>Item</th><th>Price</th><th>Notes</th></tr>
      <tr><td>Extra client account (Agency)</td><td>$9/month each</td><td>Beyond the included 15</td></tr>
      <tr><td>White-label add-on (Pro)</td><td>$49/month</td><td>Included free in Agency</td></tr>
      <tr><td>Generation credit pack</td><td>$10 per 100 credits</td><td>Never expire while subscribed</td></tr>
      <tr><td>Enterprise</td><td>from $1,500/month, annual</td><td>SSO, audit logs, custom models, data residency — <a href="contact.html">talk to us</a></td></tr>
    </table>
    <p>Prices in USD. 14-day no-questions refund on your first purchase. Downgrade or cancel any time from settings — no retention maze.</p>
  </div>
</div></section>`},
    { type: 'faq', h2: 'Pricing questions', items: [
      { q: 'What does a “Pre-Flight analysis” count as?', a: 'One full analysis of one piece of content (all its scores, teardown and fixes). Re-scoring a new cut of the same content counts as a new analysis — that’s the honest cost of the compute.' },
      { q: 'What are generation credits?', a: 'The unit for creative generation. Hooks cost 1 credit a set; scripts and storyboards cost more because they’re bigger jobs. Every generator screen shows the cost before you run it.' },
      { q: 'Do unused analyses roll over?', a: 'No — allowances reset monthly. Credits from purchased packs do carry over while you’re subscribed.' },
      { q: 'Is there a founding-member deal?', a: 'Yes: 200 founding seats at $190 for the first year of Pro, capped because each includes a real onboarding call. Details on the <a href="waitlist.html" style="color:var(--echo-400)">beta page</a>.' },
    ]},
  ],
},

// ============================= FREE REEL REVIEW =============================
{
  slug: 'free-reel-review', title: 'Free Reel review — EchoSight AI',
  desc: 'Upload one Reel and get a full EchoSight teardown free: hook read, pacing risks, save and share drivers, and three fixes.',
  blocks: [
    { type: 'hero', kicker: 'Free Reel review', h1: 'One Reel. Full teardown. Free.',
      sub: 'The complete EchoSight read on one piece of your content: hook verdict, pacing risks, probable save and share drivers, and the three fixes with the most leverage. No card, no trial countdown.' },
    { type: 'raw', html: `
<section style="padding-top:8px"><div class="wrap">
  <div class="grid g2">
    <div class="panel rv">
      <span class="chip chip-demo">Demo mode</span>
      <h3 style="margin:14px 0 8px">Request your review</h3>
      <p style="font-size:14px;color:var(--mist-400);margin-bottom:18px">During closed beta, reviews are delivered by email within 2 business days. This form isn’t connected to a backend yet — submissions save on your device until launch setup connects it (one step).</p>
      <form class="form" data-demo-form="free-review" novalidate>
        <div class="field"><label for="fr-name">Name</label><input id="fr-name" name="name" required autocomplete="name"><span class="err">Please enter your name.</span></div>
        <div class="field"><label for="fr-email">Email</label><input id="fr-email" name="email" type="email" required autocomplete="email"><span class="err">Please enter a valid email.</span></div>
        <div class="field"><label for="fr-link">Link to the Reel (public)</label><input id="fr-link" name="reel_url" type="url" required placeholder="https://www.instagram.com/reel/…"><span class="err">Please paste a public Reel link.</span><span class="hint">Public post link only — we never ask for your login.</span></div>
        <label class="checkbox"><input type="checkbox" name="consent" required><span>I understand this review analyses only the public content at this link, and EchoSight will email me the result. <a href="privacy-policy.html" style="color:var(--echo-400)">Privacy policy</a>.</span></label>
        <button class="btn btn-primary" type="submit">Request free review</button>
      </form>
      <div class="form-ok" role="status"></div>
    </div>
    <div class="panel panel-9 rv">
      <h3 style="margin-bottom:8px">What you’ll get back</h3>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;font-size:14.5px;color:var(--mist-400);margin-top:10px">
        <li><span class="tick">✓</span>&nbsp; Hook verdict with the first-second breakdown</li>
        <li><span class="tick">✓</span>&nbsp; Pacing read against niche norms</li>
        <li><span class="tick">✓</span>&nbsp; Probable save/share drivers — and blockers</li>
        <li><span class="tick">✓</span>&nbsp; Three ranked fixes for the next post</li>
      </ul>
      <p style="font-size:13px;color:var(--mist-400);margin-top:16px">Want to see the format first? The <a href="demo.html" style="color:var(--echo-400)">interactive demo</a> shows a complete sample review on example data.</p>
    </div>
  </div>
</div></section>`},
  ],
},

// ============================= EXAMPLES =============================
{
  slug: 'examples', title: 'Examples — EchoSight AI',
  desc: 'Worked examples of EchoSight output on example data: a full teardown, a trend card, a coach plan and a competitor read.',
  blocks: [
    { type: 'hero', kicker: 'Examples', h1: 'What the output actually looks like.',
      sub: 'Everything below is generated from example data and labelled as such — we don’t publish real customers’ numbers, and we don’t have launch customers to borrow from yet. That honesty is the point.' },
    { type: 'raw', html: `
<section style="padding-top:8px"><div class="wrap">
  <div class="grid g2">
    <div class="panel rv">
      <span class="chip chip-demo">Example data</span>
      <h3 style="margin:12px 0 6px">Teardown excerpt — 42s fitness Reel</h3>
      <p class="mono" style="color:var(--mist-400);font-size:12.5px;margin-bottom:10px">virality 74 · hook 88 · save p 6.2% (grade B)</p>
      <p style="font-size:14.5px;color:var(--mist-400)">“The hook works: motion starts at 0.3s and the on-screen text lands a curiosity gap by 0.8s — top-decile timing. The problem begins at 0:11. Cut rhythm drops from 3.8 to 1.9 cuts per 10 seconds through the demonstration section, and this is where retention risk concentrates. The payoff at 0:34 is strong but arriving late for the attention you’ll have left. Fix order: tighten 0:11–0:26 first, move the payoff teaser into the hook second, restructure the caption’s first line third.”</p>
    </div>
    <div class="panel rv">
      <span class="chip chip-demo">Example data</span>
      <h3 style="margin:12px 0 6px">Trend card — “silent process” format</h3>
      <p style="font-size:14.5px;color:var(--mist-400)"><strong style="color:var(--mist-100)">Stage: emerging.</strong> No-voiceover process videos with ambient sound rising in food and craft niches: seen across 34 tracked public accounts this week, engagement quality about 2.1× niche baseline. Hypothesis: the format reads as authentic against AI-voiced content fatigue. Adaptation brief: your version keeps natural audio and puts the text hook in frame one. Estimated shelf life: 3–5 weeks.</p>
    </div>
    <div class="panel rv">
      <span class="chip chip-demo">Example data</span>
      <h3 style="margin:12px 0 6px">Coach plan — week of 20 July</h3>
      <p style="font-size:14.5px;color:var(--mist-400)">“Last week’s test won: question-hooks beat your median saves by 38% across 4 posts — adopting as your default. This week, one experiment only: your carousels close weak (slide 8 drop-off). Test a save-bait summary slide on two carousels; target: beat your 30-day carousel save median. Leaving Reels cadence alone this week — the data says the format’s fine, the hooks were the issue.”</p>
    </div>
    <div class="panel rv">
      <span class="chip chip-demo">Example data</span>
      <h3 style="margin:12px 0 6px">Competitor read — head-to-head</h3>
      <p style="font-size:14.5px;color:var(--mist-400)">“They post 5×/week to your 3, but your engagement quality (est.) runs 1.6× theirs — volume isn’t your gap. Their breakout formats are tutorials with hard product shots; they haven’t touched the ‘mistakes to avoid’ format that’s rising in the niche. That gap is open for you. (Engagement figures for accounts with hidden likes are modelled estimates — treat direction, not decimals.)”</p>
    </div>
  </div>
</div></section>`},
    { type: 'cta', h2: 'Prefer to poke it yourself?', sub: 'The interactive demo runs the full loop on a sample Reel.', href: 'demo.html', label: 'Open the live demo' },
  ],
},

// ============================= ABOUT =============================
{
  slug: 'about', title: 'About — EchoSight AI',
  desc: 'Why EchoSight exists: the story, the principles, and the honest state of the product.',
  jsonld: { '@context': 'https://schema.org', '@type': 'Organization', name: 'EchoSight AI', url: 'https://echosight.ai', description: 'Instagram content intelligence for creators, agencies and brands.' },
  blocks: [
    { type: 'hero', kicker: 'About', h1: 'Built because “post more and hope” isn’t a strategy.',
      sub: 'EchoSight started with a simple observation: creators get told what happened in exhaustive detail, and why it happened never. Every tool in the category counts. None of them explain.' },
    { type: 'prose', html: `
      <h2>What we believe</h2>
      <p>Creative quality — the hook, the pacing, the payoff — decides most of a post’s fate. Those things are measurable, improvable, and almost entirely unserved by existing tools. We also believe the grey-market alternative (apps pretending to reveal who saved or viewed your content) is a scam that gets creators banned, and that the honest version of this product wins by saying plainly what can and can’t be known.</p>
      <h2>Where we are, honestly</h2>
      <p>EchoSight is in closed beta build. The demo on this site runs on example data. The founding cohort is limited to 200 because every seat includes a real onboarding call, and that’s the truthful capacity of the team. We publish our prediction accuracy — including the misses — because a tool that grades content should be gradable itself.</p>
      <h2>The company</h2>
      <p>EchoSight AI is an Australian company (Pty Ltd registration in progress), built remote-first. For anything at all: <a href="contact.html">contact us</a>.</p>`},
    { type: 'cta', h2: 'Come build it with us', sub: '200 founding seats, real onboarding calls, direct line to the roadmap.', href: 'waitlist.html', label: 'Join the founding cohort' },
  ],
},

// ============================= TRUST =============================
{
  slug: 'trust', title: 'Trust & privacy — EchoSight AI',
  desc: 'What EchoSight will never do, what data it can access, and how predictions actually work.',
  blocks: [
    { type: 'hero', kicker: 'Trust', h1: 'What we will never do.',
      sub: 'This category has a trust problem, and it earned it. Here is exactly where EchoSight’s lines are — written down, so you can hold us to them.' },
    { type: 'raw', html: `
<section style="padding-top:8px"><div class="wrap">
  <div class="grid g2">
    <div class="card rv">
      <h3>Never</h3>
      <ul style="list-style:none;margin-top:14px;display:flex;flex-direction:column;gap:10px;font-size:14.5px;color:var(--mist-400)">
        <li><span class="x">✕</span>&nbsp; Claim to reveal who saved, shared or viewed your content — that data doesn’t exist outside Instagram, for anyone</li>
        <li><span class="x">✕</span>&nbsp; Access private accounts, DMs, or anything outside the official API</li>
        <li><span class="x">✕</span>&nbsp; Scrape Instagram or buy scraped data</li>
        <li><span class="x">✕</span>&nbsp; Sell your data or use it to build advertising audiences</li>
        <li><span class="x">✕</span>&nbsp; Auto-post or automate actions on your account</li>
        <li><span class="x">✕</span>&nbsp; Present a prediction as a guarantee</li>
      </ul>
    </div>
    <div class="card rv">
      <h3>Always</h3>
      <ul style="list-style:none;margin-top:14px;display:flex;flex-direction:column;gap:10px;font-size:14.5px;color:var(--mist-400)">
        <li><span class="tick">✓</span>&nbsp; Official Instagram Graph API with minimal permissions, explained in plain English at connection</li>
        <li><span class="tick">✓</span>&nbsp; Confidence grades on every prediction, and a visible record of our accuracy on your account</li>
        <li><span class="tick">✓</span>&nbsp; Encryption in transit and at rest; deletion on request; disconnection purges synced data</li>
        <li><span class="tick">✓</span>&nbsp; Plain-language answers about where any number came from</li>
        <li><span class="tick">✓</span>&nbsp; A model-training opt-out that doesn’t punish you for using it</li>
      </ul>
    </div>
  </div>
</div></section>`},
    { type: 'prose', html: `
      <h2>How predictions work, in one paragraph</h2>
      <p>EchoSight measures features of your content (the hook’s timing, pacing, story shape, caption structure, audio energy) and compares them against patterns learned from consenting accounts’ content and aggregate outcomes. The output is a probability with a confidence grade — not a promise. Instagram’s distribution has genuine randomness; our job is to move your odds and show our working.</p>
      <h2>The documents</h2>
      <p>The details live in the <a href="privacy-policy.html">privacy policy</a>, <a href="terms.html">terms of service</a>, <a href="data-processing.html">data processing summary</a>, and <a href="security.html">security overview</a>.</p>`},
  ],
},

// ============================= SECURITY =============================
{
  slug: 'security', title: 'Security — EchoSight AI',
  desc: 'How EchoSight protects your data: encryption, access controls, token handling, and our disclosure policy.',
  blocks: [
    { type: 'hero', kicker: 'Security', h1: 'Boring security, done properly.',
      sub: 'The security page every vendor should have: what we do, what we don’t, and how to reach us when you find something we missed.' },
    { type: 'prose', html: `
      <h2>Practices</h2>
      <ul>
        <li><strong>Encryption:</strong> TLS 1.3 in transit; AES-256 at rest. Instagram access tokens are envelope-encrypted in a dedicated vault and are never written to logs.</li>
        <li><strong>Least privilege:</strong> the Instagram integration requests read-only insight scopes only. There is no code path that posts to, or acts on, your account.</li>
        <li><strong>Tenant isolation:</strong> workspace-scoped access enforced in the application layer and again at the database (row-level security).</li>
        <li><strong>Deletion:</strong> disconnecting your account queues deletion of synced data within 30 days; account deletion removes everything, with the action recorded in an audit log.</li>
        <li><strong>Roadmap commitments:</strong> external penetration test before general availability; SOC 2 Type I targeted within the first year of operation. These are planned controls — we’ll publish status here, not badges we haven’t earned.</li>
      </ul>
      <h2>Responsible disclosure</h2>
      <p>Found a vulnerability? Email <strong>security@echosight.ai</strong> with steps to reproduce. We commit to acknowledging within 2 business days, keeping you informed, and never taking legal action against good-faith research within scope.</p>`},
  ],
},

// ============================= FAQ =============================
{
  slug: 'faq', title: 'FAQ — EchoSight AI',
  desc: 'Fair questions, straight answers: what EchoSight can and can’t do, accuracy, account safety, data, and pricing.',
  jsonld: { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
    { '@type': 'Question', name: 'Can EchoSight show me who saved or shared my post?', acceptedAnswer: { '@type': 'Answer', text: 'No — and no legitimate tool can. Instagram does not expose that data to anyone. EchoSight explains why people save and share, and predicts how likely your next post is to earn saves and shares, from the content itself.' } },
    { '@type': 'Question', name: 'Is EchoSight against Instagram’s rules?', acceptedAnswer: { '@type': 'Answer', text: 'No. EchoSight uses the official Instagram Graph API with your permission, requests only read-only scopes, never scrapes, and never automates actions on your account.' } },
    { '@type': 'Question', name: 'How accurate are the predictions?', acceptedAnswer: { '@type': 'Answer', text: 'Every score carries a confidence grade, and predictions are reconciled against your actual results so you can see the track record for your account. Predictions are probabilities, not guarantees.' } },
  ]},
  blocks: [
    { type: 'hero', kicker: 'FAQ', h1: 'Fair questions, straight answers.' },
    { type: 'faq', items: [
      { q: 'Can EchoSight show me who saved or shared my post?', a: 'No — and no legitimate tool can. Instagram doesn’t expose that data to anyone. What we do instead: explain why people save and share, and predict how likely your next post is to earn saves and shares, from the content itself. Anyone claiming to show you the “who” is risking your account.' },
      { q: 'Is this against Instagram’s rules?', a: 'The opposite. Official Graph API, your explicit permission, read-only scopes, no scraping, no automation. Tools that break the rules get accounts banned; that’s exactly what we built EchoSight to replace.' },
      { q: 'How accurate are the predictions?', a: 'Honest answer: it depends, and we show you how much. Every score has a confidence grade (A–D), and we reconcile predictions against your actual results — your accuracy page shows our track record for your account, including misses. When we don’t have enough similar data, we say so and give you the analysis instead of a fake number.' },
      { q: 'Do I have to connect my Instagram account?', a: 'No. Studio mode analyses anything you upload against niche benchmarks — no connection, no login handover, ever. Connecting your professional account adds your personal baselines and the Coach.' },
      { q: 'What happens to my data?', a: 'Encrypted, never sold, deleted when you ask. Disconnecting your account purges synced data within 30 days. Model training on your outcome data is disclosed up front and you can opt out without losing features. Details in the privacy policy.' },
      { q: 'Does my content train your models?', a: 'Only with your consent, disclosed at connection — and you can opt out in settings without being punished for it. Enterprise workspaces are excluded from cross-customer training by default.' },
      { q: 'Which competitor accounts can I track?', a: 'Public professional (business/creator) accounts, via Instagram’s official Business Discovery API. Private accounts can’t be tracked by anyone — we’ll say “not trackable” rather than pretend. Engagement figures for accounts that hide likes are labelled estimates.' },
      { q: 'What does EchoSight cost?', a: 'Free (genuinely useful), Starter $29/mo, Pro $79/mo, Agency $199/mo, and every add-on price is public on the pricing page — including the ones other tools reveal after signup.' },
      { q: 'When can I actually use it?', a: 'Closed beta is next; 200 founding seats get in first with an onboarding call included. The waitlist page has the honest timeline and the founding offer details.' },
    ]},
    { type: 'cta', h2: 'Something we didn’t answer?', sub: 'Ask a human. We read everything.', href: 'contact.html', label: 'Contact us' },
  ],
},

// ============================= CONTACT =============================
{
  slug: 'contact', title: 'Contact — EchoSight AI',
  desc: 'Contact EchoSight: product questions, agency and enterprise conversations, press, and security reports.',
  blocks: [
    { type: 'hero', kicker: 'Contact', h1: 'Talk to a human.',
      sub: 'Product questions, agency or enterprise conversations, press, partnerships — or telling us what we got wrong. All welcome.' },
    { type: 'raw', html: `
<section style="padding-top:8px"><div class="wrap">
  <div class="grid g2">
    <div class="panel rv">
      <span class="chip chip-demo">Demo mode</span>
      <h3 style="margin:14px 0 8px">Send a message</h3>
      <p style="font-size:14px;color:var(--mist-400);margin-bottom:18px">Form backend isn’t connected yet (pre-launch); until then submissions save on your device, or email us directly.</p>
      <form class="form" data-demo-form="contact" novalidate>
        <div class="field"><label for="c-name">Name</label><input id="c-name" name="name" required autocomplete="name"><span class="err">Please enter your name.</span></div>
        <div class="field"><label for="c-email">Email</label><input id="c-email" name="email" type="email" required autocomplete="email"><span class="err">Please enter a valid email.</span></div>
        <div class="field"><label for="c-topic">Topic</label><select id="c-topic" name="topic"><option>Product question</option><option>Agency / Enterprise</option><option>Press</option><option>Partnership</option><option>Something else</option></select></div>
        <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" rows="5" required></textarea><span class="err">Please write a message.</span></div>
        <button class="btn btn-primary" type="submit">Send message</button>
      </form>
      <div class="form-ok" role="status"></div>
    </div>
    <div class="panel panel-9 rv">
      <h3 style="margin-bottom:12px">Direct lines</h3>
      <p style="font-size:14.5px;color:var(--mist-400);line-height:2">
        General: <strong style="color:var(--mist-100)">hello@echosight.ai</strong><br>
        Security reports: <strong style="color:var(--mist-100)">security@echosight.ai</strong><br>
        Privacy requests: <strong style="color:var(--mist-100)">privacy@echosight.ai</strong><br>
        Press: <strong style="color:var(--mist-100)">press@echosight.ai</strong>
      </p>
      <p style="font-size:13px;color:var(--mist-400);margin-top:14px">Email addresses activate with the domain at launch (setup guide, step 1). EchoSight AI is an Australian company; expect replies in AEST business hours.</p>
    </div>
  </div>
</div></section>`},
  ],
},

// ============================= LOGIN =============================
{
  slug: 'login', title: 'Log in — EchoSight AI', noindex: true,
  desc: 'Log in to EchoSight.',
  blocks: [
    { type: 'hero', kicker: 'Log in', h1: 'Accounts open with the beta.',
      sub: 'EchoSight is in closed beta build — there’s no login yet, and we’d rather tell you that than show you a form that goes nowhere. Founding cohort members get credentials by email when the beta opens.',
      ctas: [{ href: 'waitlist.html', label: 'Join the founding cohort' }, { href: 'demo.html', label: 'Try the demo meanwhile', ghost: true }] },
  ],
},

// ============================= SIGNUP =============================
{
  slug: 'signup', title: 'Sign up — EchoSight AI', noindex: true,
  desc: 'Sign up for EchoSight.',
  blocks: [
    { type: 'hero', kicker: 'Sign up', h1: 'Sign-ups run through the founding cohort.',
      sub: 'While we’re in closed beta, the waitlist is the sign-up: 200 founding seats, onboarding call included, honest terms on the page.',
      ctas: [{ href: 'waitlist.html', label: 'Go to the beta page' }] },
  ],
},

// ============================= WAITLIST =============================
{
  slug: 'waitlist', title: 'Join the beta — EchoSight AI',
  desc: 'Join the EchoSight closed beta: 200 founding seats at $190 for the first year of Pro, onboarding call included.',
  blocks: [
    { type: 'hero', kicker: 'Closed beta', h1: 'Founding Creators: 200 seats, honestly capped.',
      sub: 'The cap isn’t marketing. Every founding seat includes a one-on-one onboarding call where we tear down your content with you, and 200 is the real number we can run well.' },
    { type: 'raw', html: `
<section style="padding-top:8px"><div class="wrap">
  <div class="grid g2">
    <div class="panel rv">
      <h3 style="margin-bottom:10px">The founding offer</h3>
      <ul style="list-style:none;display:flex;flex-direction:column;gap:10px;font-size:14.5px;color:var(--mist-400);margin-top:6px">
        <li><span class="tick">✓</span>&nbsp; <strong style="color:var(--mist-100)">$190 for the first year of Pro</strong> (list: $790)</li>
        <li><span class="tick">✓</span>&nbsp; 1-on-1 onboarding teardown call in week one</li>
        <li><span class="tick">✓</span>&nbsp; Pro renewal locked at $39/mo for the life of your account</li>
        <li><span class="tick">✓</span>&nbsp; Direct channel to the product team</li>
        <li><span class="tick">✓</span>&nbsp; 14-day no-questions refund, plus pro-rata refund any time in the first 90 days</li>
      </ul>
      <p style="font-size:13.5px;color:var(--mist-400);margin-top:14px">What we ask back, stated openly: honest feedback on a short monthly call for three months, and an <em>optional</em> opt-in to use your anonymised before/after numbers as a case study.</p>
    </div>
    <div class="panel rv">
      <span class="chip chip-demo">Demo mode</span>
      <h3 style="margin:14px 0 8px">Join the waitlist</h3>
      <p style="font-size:14px;color:var(--mist-400);margin-bottom:16px">No payment now — seats are offered in waitlist order when beta opens. Form backend connects at launch; until then submissions save on your device.</p>
      <form class="form" data-demo-form="waitlist" novalidate>
        <div class="field"><label for="w-name">Name</label><input id="w-name" name="name" required autocomplete="name"><span class="err">Please enter your name.</span></div>
        <div class="field"><label for="w-email">Email</label><input id="w-email" name="email" type="email" required autocomplete="email"><span class="err">Please enter a valid email.</span></div>
        <div class="field"><label for="w-handle">Instagram handle</label><input id="w-handle" name="handle" placeholder="@yourhandle"><span class="hint">Optional — helps us prioritise active creators.</span></div>
        <div class="field"><label for="w-seg">Which sounds most like you?</label><select id="w-seg" name="segment"><option>Creator</option><option>Agency / social media manager</option><option>Brand team</option><option>Just curious</option></select></div>
        <button class="btn btn-primary" type="submit">Join the waitlist</button>
      </form>
      <div class="form-ok" role="status"></div>
    </div>
  </div>
</div></section>`},
  ],
},

// ============================= PRIVACY POLICY =============================
{
  slug: 'privacy-policy', title: 'Privacy policy — EchoSight AI',
  desc: 'EchoSight privacy policy (draft): what we collect, why, where it goes, and your rights.',
  blocks: [
    { type: 'hero', kicker: 'Legal', h1: 'Privacy policy' },
    { type: 'prose', html: LEGAL_BANNER + `
      <p>EchoSight AI ("EchoSight", "we") provides content-intelligence services for social media professionals. This policy explains what personal information we collect, why, and your rights over it. We are an Australian company and handle personal information under the Privacy Act 1988 (Cth) and, where applicable, the GDPR and other local laws.</p>
      <h2>1. What we collect</h2>
      <ul>
        <li><strong>Account information:</strong> name, email, and login credentials (managed by our authentication provider).</li>
        <li><strong>Connected platform data:</strong> if you connect an Instagram professional account, we receive — via Meta's official Graph API, with your authorisation — your account's content metadata and aggregate insight metrics (for example reach, saves counts, shares counts). We never receive information identifying which individuals interacted with your content, and we never ask for your Instagram password.</li>
        <li><strong>Uploaded content:</strong> media you upload for analysis, and the analysis derived from it.</li>
        <li><strong>Usage data:</strong> product interactions used to operate and improve the service. Analytics on the website load only with your consent.</li>
      </ul>
      <h2>2. What we use it for</h2>
      <p>To provide the service (analysis, predictions, coaching, reports); to operate, secure and support the product; to improve our models — <strong>only where you have not opted out</strong>, and using pseudonymised data; and to communicate with you about the service. We do not sell personal information, and we do not use your data to build advertising audiences.</p>
      <h2>3. Storage, security and retention</h2>
      <p>Data is encrypted in transit and at rest and stored with cloud providers in Australia (primary) and, for some subprocessors, other regions listed in the <a href="data-processing.html">data processing summary</a>. Synced platform data is deleted within 30 days of disconnecting an account; deleting your account deletes your personal information except where law requires retention.</p>
      <h2>4. Your rights</h2>
      <p>You can access, correct, export or delete your personal information from account settings or by emailing <strong>privacy@echosight.ai</strong>. We respond within 30 days. If you're unsatisfied, you may complain to the Office of the Australian Information Commissioner (OAIC) or your local authority.</p>
      <h2>5. Third parties</h2>
      <p>We share personal information only with the subprocessors needed to run the service (hosting, authentication, payments, email, error monitoring), each under a data-processing agreement, listed in the <a href="data-processing.html">data processing summary</a>. If EchoSight is ever acquired, this policy binds the successor or you'll be notified with a choice.</p>
      <h2>6. Contact</h2>
      <p>Privacy Officer, EchoSight AI — <strong>privacy@echosight.ai</strong>.</p>`},
  ],
},

// ============================= TERMS =============================
{
  slug: 'terms', title: 'Terms of service — EchoSight AI',
  desc: 'EchoSight terms of service (draft).',
  blocks: [
    { type: 'hero', kicker: 'Legal', h1: 'Terms of service' },
    { type: 'prose', html: LEGAL_BANNER + `
      <h2>1. The service</h2>
      <p>EchoSight provides content analysis, prediction, coaching and generation tools for social media professionals. Scores and predictions are <strong>estimates with stated uncertainty</strong> — they are informational, not guarantees of any outcome on any platform, and you remain responsible for your content and account decisions.</p>
      <h2>2. Your account and acceptable use</h2>
      <p>You must provide accurate information and keep credentials secure. Use of the service must comply with our <a href="acceptable-use.html">acceptable use policy</a> and with the terms of any platform you connect (including Meta's terms). We never ask for your Instagram password; connections run through Meta's official authorisation flow.</p>
      <h2>3. Your content</h2>
      <p>You retain all rights to content you upload. You grant us the licence needed to analyse it and show you the results. Generated output is yours to use; you're responsible for ensuring your use of it complies with applicable law and platform rules.</p>
      <h2>4. Billing</h2>
      <p>Paid plans bill monthly or annually via our payment processor. Every price, including add-ons, is published on the <a href="pricing.html">pricing page</a>. First purchases carry a 14-day no-questions refund. You can cancel any time from settings, effective at period end.</p>
      <h2>5. Service changes and availability</h2>
      <p>We may change features with notice for material changes. Some features depend on Meta's API; if platform access changes, we'll maintain what's possible (upload-based analysis works without any platform connection) and communicate honestly about what isn't.</p>
      <h2>6. Liability</h2>
      <p>To the extent permitted by law (including the Australian Consumer Law, which this clause does not exclude), our liability is limited to the amount you paid in the 12 months before the claim. We're not liable for platform decisions — including reach, distribution or account actions taken by Meta.</p>
      <h2>7. Governing law</h2>
      <p>These terms are governed by the laws of Queensland, Australia.</p>`},
  ],
},

// ============================= COOKIE POLICY =============================
{
  slug: 'cookie-policy', title: 'Cookie policy — EchoSight AI',
  desc: 'EchoSight cookie policy (draft): the short version is that we barely use any.',
  blocks: [
    { type: 'hero', kicker: 'Legal', h1: 'Cookie policy' },
    { type: 'prose', html: LEGAL_BANNER + `
      <p>The short version: this website currently sets <strong>no tracking cookies at all</strong>.</p>
      <h2>What we use today</h2>
      <ul>
        <li><strong>Local storage (essential):</strong> your cookie-consent choice, and — in demo mode — form submissions you make, stored only on your own device.</li>
      </ul>
      <h2>What may change</h2>
      <p>If we add privacy-respecting analytics, it will load <strong>only after you consent</strong> via the banner, and this page will list exactly what it sets, with dates. The application (when live) will use essential cookies for login sessions; those are strictly necessary and will be listed here before launch.</p>
      <h2>Managing preferences</h2>
      <p>Use the consent banner (it reappears if you clear site data), or your browser's site-data controls. Global Privacy Control signals are honoured as a "decline".</p>`},
  ],
},

// ============================= ACCEPTABLE USE =============================
{
  slug: 'acceptable-use', title: 'Acceptable use policy — EchoSight AI',
  desc: 'EchoSight acceptable use policy (draft).',
  blocks: [
    { type: 'hero', kicker: 'Legal', h1: 'Acceptable use policy' },
    { type: 'prose', html: LEGAL_BANNER + `
      <p>EchoSight exists to make content better, not to game platforms or people. Using the service, you agree not to:</p>
      <ul>
        <li>connect accounts you don't own or lack authority to manage;</li>
        <li>use the service to harass, defame or target individuals, including via competitor tracking (tracking is for public professional accounts and craft learning, not surveillance of people);</li>
        <li>attempt to extract, scrape or resell our data, scores or models, or probe the service's security except under our responsible-disclosure policy;</li>
        <li>use generated content to deceive — including passing off fabricated results, fake testimonials or impersonation;</li>
        <li>use the service for spam, engagement manipulation schemes, or anything that violates Meta's platform terms;</li>
        <li>upload content you don't have rights to analyse, or content that is illegal.</li>
      </ul>
      <p>We may suspend accounts that breach this policy, with notice and a chance to respond except where the breach is severe or legally required action.</p>`},
  ],
},

// ============================= DATA PROCESSING =============================
{
  slug: 'data-processing', title: 'Data processing summary — EchoSight AI',
  desc: 'Plain-English summary of what data EchoSight processes, where it lives, and which subprocessors touch it.',
  blocks: [
    { type: 'hero', kicker: 'Legal', h1: 'Data processing summary',
      sub: 'The plain-English version of what data we process, where it lives, and who else touches it. The privacy policy is the binding document; this is the readable map.' },
    { type: 'prose', html: LEGAL_BANNER + `
      <h2>Data categories</h2>
      <table>
        <tr><th>Category</th><th>Examples</th><th>Where from</th><th>Retention</th></tr>
        <tr><td>Account data</td><td>Name, email</td><td>You</td><td>Account life + legal minimums</td></tr>
        <tr><td>Platform data</td><td>Your posts' metadata, aggregate metrics (reach, saves counts)</td><td>Meta Graph API, with your authorisation</td><td>Account life; purged ≤30 days after disconnect</td></tr>
        <tr><td>Uploaded media</td><td>Reels/images you upload for analysis</td><td>You</td><td>Until you delete them or your account</td></tr>
        <tr><td>Derived data</td><td>Features, scores, teardowns</td><td>Our analysis</td><td>Follows the source content</td></tr>
      </table>
      <p><strong>Not processed, ever:</strong> data identifying which individuals saved, shared or viewed content (Instagram exposes this to no one); private accounts; direct messages; your Instagram password.</p>
      <h2>Planned subprocessors at launch</h2>
      <table>
        <tr><th>Provider</th><th>Purpose</th><th>Region</th></tr>
        <tr><td>Amazon Web Services</td><td>Hosting, storage</td><td>Australia (primary)</td></tr>
        <tr><td>Clerk</td><td>Authentication</td><td>US</td></tr>
        <tr><td>Stripe</td><td>Payments</td><td>US/global</td></tr>
        <tr><td>Anthropic</td><td>AI analysis (content features, no follower personal data)</td><td>US</td></tr>
        <tr><td>Resend</td><td>Transactional email</td><td>US</td></tr>
        <tr><td>Sentry / Datadog</td><td>Error and performance monitoring</td><td>US</td></tr>
      </table>
      <p>This list updates before launch and whenever a subprocessor changes; material changes are notified to account holders.</p>
      <h2>Model training</h2>
      <p>Content features and aggregate outcomes from consenting accounts improve our models, pseudonymised. Opting out in settings removes your data from future training cycles without reducing your features. Enterprise workspaces are excluded by default.</p>`},
  ],
},

// ============================= 404 =============================
{
  slug: '404', title: 'Page not found — EchoSight AI', noindex: true,
  desc: 'That page doesn’t exist.',
  blocks: [
    { type: 'hero', kicker: '404', h1: 'This page flopped. We can explain.',
      sub: 'The link is broken or the page moved. Unlike your Reels, there’s no teardown for this one — just a way home.',
      ctas: [{ href: 'index.html', label: 'Back to the homepage' }, { href: 'demo.html', label: 'Try the demo instead', ghost: true }] },
  ],
},
];
