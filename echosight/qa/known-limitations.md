# Known Limitations — honest register

What this build is NOT, what wasn't tested, and what is blocked externally. Nothing here is hidden elsewhere; HANDOVER.md links back to this file.

## Product reality

1. **The application is a front-end prototype on demo data.** There is no backend, no ML models, no Instagram integration, no billing. Every screen says "Demo data" because it is. The full product is specified (docs/02–08) but not built. The website sells the closed beta honestly on this basis.
2. **No videos have been generated.** The Higgsfield toolchain disconnected mid-session before the generation phase. All 12 packages are complete and export-ready (READY FOR HIGGSFIELD GENERATION); zero footage exists. One-step fix: reconnect the Higgsfield connector or use higgsfield.ai directly with the packs.
3. **Founder videos (days 7/14/27) require the founder** — by design, they cannot be produced by anyone else.
4. **Prediction accuracy claims are design commitments**, not measured performance — no model exists to measure. All site copy was audited to present-tense only what exists (register rows 1, 9).

## Testing gaps (not run, and why)

5. Real-device testing (no devices in this environment) — emulated viewports only.
6. Screen-reader session (no AT available) — structural a11y verified, human pass pending.
7. Production-network performance (no live deploy yet) — local-server Lighthouse only.
8. Full-crawl axe scan of all 31 pages (9 scanned; rest share the audited template).
9. Email deliverability, form-service integration, payment flows — the services aren't connected yet by design (demo mode is explicit in the UI).
10. Backend security testing (authn boundaries, rate limits, upload security, prompt injection at runtime) — no backend exists; designs exist in docs/09, docs/15, docs/19.

## Blocked externally (with the unblocking action)

| Blocker | Blocked deliverable | One-step action |
| --- | --- | --- |
| Higgsfield connector disconnected | Actual video files | Reconnect connector / open higgsfield.ai and run packs (guide step 9) |
| Domain not purchased | Live URL, email addresses, canonical URLs being real | Buy echosight.ai (guide step 1) |
| No form backend account | Real form submissions | Create Tally form, wire endpoint (guide step 5) |
| AU solicitor review | Final legal pages (drafts are banner-marked) | Engage fixed-fee review (guide step 13) |
| Meta App Review | Product beta account-connection | Submit app per compliance/meta-api-readiness.md (guide step 11) |
| Company not registered | "(in formation)" suffix removal; Stripe activation | Register Pty Ltd with legal review (guide step 13) |
| GitHub Pages already serves NorthPath | Same-repo Pages deploy for EchoSight | Deploy `echosight/site` via Cloudflare Pages instead (decision of record, audit doc §4) |

## Deferred with reason

11. TikTok/YouTube ingestion, auto-posting, mobile app, public API — roadmap phases (docs/16), not v1.
12. Trademark clearance on "EchoSight" — flagged since v1 docs as launch-blocking; still an open external action with fallback names ready.
13. Market-sizing figures remain assumption-flagged pending the Phase-0 interview program (docs/01, research/).
