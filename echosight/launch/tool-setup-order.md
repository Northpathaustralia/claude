# Tool Setup Order

Exact sequence — each step unblocks the next; nothing here requires a step that comes after it. Beginner instructions for every step live in `DUMMY-GUIDE-START-HERE.md`; this file is the map.

1. **Domain** (echosight.ai) — everything else attaches to it. *(10 min, ~A$90/yr)*
2. **Cloudflare account** → add domain → **Email Routing** (hello@, privacy@, security@ → your inbox). *(20 min, free)*
3. **Hosting**: Cloudflare Pages → connect GitHub repo → deploy `echosight/site/` as the site root. The site is plain HTML — no build step needed (set "output directory" to `echosight/site`). *(20 min, free)*
4. **Form backend**: create a Tally form (name/email/handle/segment) → paste its endpoint into the site: each form tag has a `data-endpoint` attribute waiting (see `site/assets/site.js`); until set, forms save locally and say so honestly. *(20 min, free)*
5. **Analytics**: Cloudflare Web Analytics snippet — cookieless, so the consent banner's "essential only" stays truthful. *(10 min, free)*
6. **Instagram professional account** for the brand + **Meta Business Suite** for scheduling. *(30 min, free)*
7. **Higgsfield account** → buy the starter credit pack → generate character reference sheets → produce day-01 and day-16 first (validation slice). *(half a day first time)*
8. **Meta developer account + app** (needed only when the product beta starts syncing accounts — not for the marketing launch): create app → add Instagram Graph API product → configure Facebook Login for Business → submit App Review with our scope justifications (`compliance/meta-api-readiness.md`). *(1–2h setup; review takes days–weeks)*
9. **Email sending** (when waitlist >100): Buttondown/MailerLite, verify domain DKIM/SPF via Cloudflare DNS. *(45 min)*
10. **Legal review** (before any payment is taken): send `site/privacy-policy.html`, `terms.html`, `cookie-policy.html`, `acceptable-use.html`, `data-processing.html` + `compliance/privacy-review.md` to an AU solicitor for fixed-fee review. *(1–2 wks turnaround)*
11. **Stripe + company registration** — together, only when founding seats open for actual payment.

Storage note: API keys and secrets go in a password manager from day one; nothing is ever committed to the repo or pasted into chat tools. The site needs zero secrets (static).
