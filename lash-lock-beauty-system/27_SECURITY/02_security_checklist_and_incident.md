# 27 · Security Checklist, Access Control, Secrets Rotation & Incident Response

## Repository security review — results (this pass, July 2026)
| Check | Result |
|---|---|
| Secret scan (keys/tokens/PEM/AWS/Slack/GitHub patterns) | **Clean** — no secrets committed (grep hits were false positives) |
| `.env` files in repo | **None** |
| `.gitignore` covers secrets/PII/legal/media | **Hardened this pass** |
| `npm test` (root app) | **20/20 pass** |
| `npm audit` (root app) | 2 **dev-only** advisories (esbuild/vite dev server) — documented, dev-time only, separate app/branch; not force-upgraded here |
| Beauty system runtime code | **None** (documentation only → minimal attack surface) |

**Residual risk:** the root NorthPath app's dev-server advisory should be fixed on *its own* branch by upgrading Vite (breaking). Tracked in `SECURITY.md`, not silenced.

## Ongoing checks to run (when code exists / on dependency change)
`npm ci && npm test` · `npm audit` (review, fix non-breaking, schedule breaking) · secret scan pre-commit · enable GitHub secret scanning + Dependabot · Lighthouse/axe for accessibility · link checker on landing pages.

## Access-control matrix (least privilege)
| Role | Course host | Payments | Email | Ad accounts | Drives (PII/legal) | AI tools |
|---|---|---|---|---|---|---|
| Owner (James) | Admin | Admin | Admin | Admin | Admin | Admin |
| Kat | Editor | View payouts | Editor | Editor | Limited (own consents) | Editor |
| Contractor/VA (future) | Limited | None | Limited | Limited | None | Limited |
| Legal/accountant | None | View (as needed) | None | None | Read (as needed) | None |
Rules: 2FA everywhere · unique logins (no shared) · remove access within 24h of offboarding · review quarterly.

## Secrets-rotation procedure
1. Trigger: exposure, offboarding, or every {6–12 months}.
2. Generate new key in the provider → update the platform secret manager/env → deploy → verify → revoke old key.
3. If a secret was ever committed/screenshotted/pasted in chat: **rotate immediately**, then scrub history (`git filter-repo`) and force-push with care.
4. Log rotations (date, key, reason) — no secret values in the log.

## Backup process
- Weekly export: course content, customer/email list, orders, testimonials, consents, supplier docs (to secure encrypted storage).
- Monthly: test a restore of one item.
- Keep 2 copies, 1 offsite; never a public bucket.

## Incident-response (security)
Contain → assess → rotate affected secrets → notify (customers/OAIC if PII + serious-harm likely, see privacy breach checklist) → remediate root cause → post-incident review. Keep an incident log.
