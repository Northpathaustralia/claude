# SECURITY.md

Security posture for this repository and the Lash Lock Beauty System.

## Scope
- **`lash-lock-beauty-system/`** — documentation only (no runtime code, no data collection). Risk is limited to what gets *committed* (see below) and to the future stack described in `27_SECURITY/`.
- **Repo root (`src/`, NorthPath AI OS)** — a separate React/Vite front-end app on its own branch; included here only because it shares the repository. See "Known issues".

## What must NEVER be committed
API keys · passwords · access tokens · `.env` files · customer PII · signed consent forms · supplier documents/SDS · unredacted legal advice · voice/likeness reference images of real people. These are covered by `.gitignore`; store them in an access-controlled drive or a secret manager.

## Secret handling
- Real secrets live in the hosting platform's secret manager / environment, never in the repo.
- `.env.example` documents required keys with placeholder values only.
- If a secret is ever exposed (commit, screenshot, chat): **rotate it immediately**, then purge history if needed. See `27_SECURITY/03_...` for the rotation procedure.

## Reporting a vulnerability
Email the owner (james@northpath.com.au). Do not open a public issue for a security report.

## Automated checks
- `npm test` — unit tests (run in CI before deploy).
- `npm audit` — dependency vulnerabilities (review on every dependency change).
- Secret scan — grep patterns run during review; consider enabling GitHub secret scanning + Dependabot.

## Known issues (as of this review, July 2026)
- `npm audit` reports 2 dev-only advisories (esbuild ≤0.24.2 / vite ≤6.4.2) in the root NorthPath app. These affect the **dev server only**, not the static production build, and belong to a separate app/branch. Remediation = upgrade Vite (breaking) on that app's own branch; intentionally NOT forced here to avoid breaking out-of-scope code. Tracked, not silenced.

## Future stack (beauty business)
The beauty business will use mainstream hosted platforms (course host, Stripe-backed checkout, email tool). The secure-by-default requirements for that stack — payment verification server-side, webhook signature validation, least-privilege access, security headers, no client trust of purchase state — are specified in `lash-lock-beauty-system/27_SECURITY/01_secure_implementation_blueprint.md`.
