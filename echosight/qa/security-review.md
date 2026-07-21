# Security Review — 21 July 2026

Scope honesty first: **the deliverable is a static website + client-side prototypes.** There is no backend, no authentication, no database, no upload pipeline in production — so the meaningful attack surface today is small, and this review says so rather than inventing findings. Product-backend security is designed (docs/09) and reviewed as design, not as tested code.

## Executed checks

| Check | Method | Result |
| --- | --- | --- |
| Secret scan | Pattern grep across all file types in `echosight/` | **Clean** — no keys/tokens/passwords anywhere; the static site needs zero secrets by design |
| Dependency audit | Site runtime: **zero dependencies** (no framework, no external scripts, no CDN, no fonts fetched). Build tooling: Node stdlib only. Test-only packages (axe-core, lighthouse) live in the session scratchpad, not the repo | **Clean** — nothing to audit in the shipped artefact; `npm audit` N/A (no package.json in `echosight/site`) |
| External request surface | Browser network observation during Playwright runs | **Zero external requests** on every page — no third-party JS supply chain at all |
| XSS surface | Static review: no user input is rendered anywhere; forms write only to visitor's own localStorage; the build system escapes head metadata; content is authored, not user-supplied | Low risk; no injection path found |
| Clickjacking/headers | Static hosting note | Headers (CSP, HSTS, X-Frame-Options) are set at the host layer — Cloudflare Pages config documented as a deploy step (see known-limitations #3) |
| Form abuse | Demo mode stores locally (no abuse path). When connected to Tally/Formspree: their rate limiting + CAPTCHA options apply — noted in setup order | Acceptable for launch scale |
| Prompt-injection review | The site contains no LLM runtime. The *product's* injection defences are specified (docs/19: instruction/data separation, injection fixtures in evals) — design-stage only | No runtime surface today |
| Privacy controls | See `../compliance/privacy-review.md` (no cookies, no tracking, honest demo-mode messaging) | Pass |

## Findings

1. **(Low) Security headers depend on host config** — a static export can't set CSP/HSTS itself. Action: add `_headers` file for Cloudflare Pages at deploy time (one-step, listed in HANDOVER next actions).
2. **(Info) `data-endpoint` form wiring** — when forms are connected, the endpoint URL becomes visible client-side (normal for form services); choose the service's spam controls accordingly. Documented in setup order.
3. **(Info) Future backend** inherits the full control set in docs/09 (RLS, token vault, egress allowlists, authz matrix tests) — none of which is claimed as implemented anywhere on the site. Verified: the security page speaks in commitments and "planned", never "certified".

## Verdict

No critical or high findings on the shipped artefact. The one actionable item (host headers) is a deploy-day step. The repo tells no security lies — which was the test that mattered most.
