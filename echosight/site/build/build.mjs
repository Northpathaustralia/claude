#!/usr/bin/env node
/* EchoSight static site builder.
   Usage: node build.mjs  (from site/build/) — writes ../<slug>.html for every page
   in pages.mjs, plus sitemap.xml and robots.txt. Hand-maintained pages
   (index.html, demo.html, app.html) are NOT generated here. */
import { writeFileSync } from 'node:fs';
import { pages } from './pages.mjs';

const BASE = 'https://echosight.ai'; // intended production domain — purchase is launch step 1 (see launch docs)

const NAV = [
  ['product.html', 'Product'],
  ['how-it-works.html', 'How it works'],
  ['demo.html', 'Live demo'],
  ['pricing.html', 'Pricing'],
  ['examples.html', 'Examples'],
  ['faq.html', 'FAQ'],
];

const FOOTER = {
  Product: [
    ['product.html', 'Overview'], ['pre-flight.html', 'Pre-Flight analysis'], ['teardowns.html', 'Content teardowns'],
    ['coach.html', 'AI Coach'], ['trends.html', 'Trend intelligence'], ['competitors.html', 'Competitor intelligence'],
    ['creative-generator.html', 'Creative generator'], ['demo.html', 'Interactive demo'],
  ],
  Solutions: [
    ['creators.html', 'For creators'], ['brands.html', 'For brands'], ['agencies.html', 'For agencies'],
    ['free-reel-review.html', 'Free Reel review'], ['examples.html', 'Examples'], ['pricing.html', 'Pricing'],
  ],
  Company: [
    ['about.html', 'About'], ['contact.html', 'Contact'], ['waitlist.html', 'Join the beta'],
    ['login.html', 'Log in'], ['signup.html', 'Sign up'],
  ],
  Trust: [
    ['trust.html', 'Trust & privacy'], ['security.html', 'Security'], ['privacy-policy.html', 'Privacy policy'],
    ['terms.html', 'Terms of service'], ['cookie-policy.html', 'Cookie policy'],
    ['acceptable-use.html', 'Acceptable use'], ['data-processing.html', 'Data processing'],
  ],
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function head(p) {
  const url = `${BASE}/${p.slug === 'index' ? '' : p.slug + '.html'}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="stylesheet" href="assets/style.css">
<meta property="og:type" content="website">
<meta property="og:site_name" content="EchoSight AI">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}/assets/og.png">
<meta name="twitter:card" content="summary_large_image">
${p.noindex ? '<meta name="robots" content="noindex">\n' : ''}${p.jsonld ? `<script type="application/ld+json">${JSON.stringify(p.jsonld)}</script>\n` : ''}</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<div class="aurora" aria-hidden="true"><span class="a1"></span><span class="a2"></span></div>
<nav class="site-nav" aria-label="Main">
  <div class="wrap nav-in">
    <a class="logo" href="index.html" aria-label="EchoSight home"><span class="logo-mark" aria-hidden="true"></span>echosight</a>
    <div class="nav-links">
      ${NAV.map(([href, label]) => `<a href="${href}"${href === p.slug + '.html' ? ' aria-current="page"' : ''}>${label}</a>`).join('\n      ')}
    </div>
    <div class="nav-cta">
      <a class="btn btn-ghost btn-sm" href="login.html">Log in</a>
      <a class="btn btn-primary btn-sm" href="free-reel-review.html">Free Reel review</a>
    </div>
    <button class="menu-btn" aria-expanded="false" aria-controls="mobile-menu">Menu</button>
  </div>
  <div class="mobile-menu" id="mobile-menu">
    ${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join('\n    ')}
    <a href="free-reel-review.html">Free Reel review</a>
    <a href="waitlist.html">Join the beta</a>
    <a href="login.html">Log in</a>
  </div>
</nav>
<main id="main">`;
}

function foot() {
  return `</main>
<footer>
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="logo" href="index.html" style="margin-bottom:14px"><span class="logo-mark" aria-hidden="true"></span>echosight</a>
        <p style="max-width:260px;font-size:13.5px">Instagram content intelligence for creators, agencies and brands. Know why. Before you post.</p>
      </div>
      ${Object.entries(FOOTER).map(([h, links]) => `<div>
        <h4>${h}</h4>
        ${links.map(([href, label]) => `<a href="${href}">${label}</a>`).join('\n        ')}
      </div>`).join('\n      ')}
    </div>
    <div class="legal">
      <span>© 2026 EchoSight AI Pty Ltd (in formation). All rights reserved.</span>
      <span>Not affiliated with or endorsed by Instagram or Meta Platforms, Inc.</span>
    </div>
  </div>
</footer>
<div class="consent" role="dialog" aria-label="Cookie consent">
  <strong style="color:var(--mist-100)">Cookies, minimally.</strong> This site uses no tracking today. If we add privacy-respecting analytics later, it will load only if you allow it here.
  <div class="row">
    <button class="btn btn-primary btn-sm" data-consent="granted">Allow analytics</button>
    <button class="btn btn-ghost btn-sm" data-consent="denied">Essential only</button>
  </div>
</div>
<script src="assets/site.js"></script>
</body>
</html>
`;
}

const B = {
  hero: (b) => `
<header class="page-hero"><div class="wrap">
  ${b.kicker ? `<span class="kicker">${b.kicker}</span>` : ''}
  <h1>${b.h1}</h1>
  ${b.sub ? `<p class="sub">${b.sub}</p>` : ''}
  ${b.ctas ? `<div class="hero-ctas">${b.ctas.map((c) => `<a class="btn ${c.ghost ? 'btn-ghost' : 'btn-primary'}" href="${c.href}">${c.label}</a>`).join('')}</div>` : ''}
  ${b.note ? `<p class="hero-note">${b.note}</p>` : ''}
</div></header>`,
  cards: (b) => `
<section><div class="wrap">
  ${b.kicker || b.h2 ? `<div class="sec-head rv">${b.kicker ? `<span class="kicker">${b.kicker}</span>` : ''}${b.h2 ? `<h2>${b.h2}</h2>` : ''}${b.sub ? `<p class="sub">${b.sub}</p>` : ''}</div>` : ''}
  <div class="grid g${b.cols || 3}">
    ${b.items.map((c) => `<div class="card rv"><h3>${c.h}</h3>${c.p ? `<p>${c.p}</p>` : ''}${c.list ? `<ul>${c.list.map((li) => `<li>${li}</li>`).join('')}</ul>` : ''}</div>`).join('\n    ')}
  </div>
</div></section>`,
  prose: (b) => `
<section style="padding-top:24px"><div class="wrap"><div class="prose rv">${b.html}</div></div></section>`,
  faq: (b) => `
<section><div class="wrap" style="max-width:760px">
  ${b.h2 ? `<div class="sec-head rv"><h2>${b.h2}</h2></div>` : ''}
  ${b.items.map((q) => `<details class="rv"><summary>${q.q}</summary><div class="a"><p>${q.a}</p></div></details>`).join('\n  ')}
</div></section>`,
  cta: (b) => `
<section><div class="wrap"><div class="cta-band rv">
  <h2>${b.h2}</h2>
  <p class="sub">${b.sub || ''}</p>
  <a class="btn btn-primary" href="${b.href}">${b.label}</a>
</div></div></section>`,
  raw: (b) => b.html,
};

let sitemapUrls = [`${BASE}/`, `${BASE}/demo.html`, `${BASE}/app.html`];
for (const p of pages) {
  const html = head(p) + p.blocks.map((b) => B[b.type](b)).join('\n') + foot();
  writeFileSync(new URL(`../${p.slug}.html`, import.meta.url), html);
  if (!p.noindex && p.slug !== '404') sitemapUrls.push(`${BASE}/${p.slug}.html`);
  console.log('built', p.slug + '.html');
}

writeFileSync(new URL('../sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapUrls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') + '\n</urlset>\n');
writeFileSync(new URL('../robots.txt', import.meta.url),
  `User-agent: *\nAllow: /\nSitemap: ${BASE}/sitemap.xml\n`);
console.log('built sitemap.xml, robots.txt —', sitemapUrls.length, 'urls');
