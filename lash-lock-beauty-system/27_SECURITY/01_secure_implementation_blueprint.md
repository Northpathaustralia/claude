# 27 · Secure Implementation Blueprint

The beauty business is documentation today; when it becomes a live sales system, build it **secure by default** using mainstream hosted platforms (don't hand-roll auth/payments). This is the security spec for that stack.

## Reference architecture (lowest-risk, low-cost)
- **Course + checkout:** a hosted platform (Stan/Kajabi/Podia/Shopify) that handles accounts, delivery, and PCI-compliant payments. Prefer this over custom code.
- **Payments:** Stripe (or platform-native) **hosted checkout** — card data never touches your servers.
- **Email:** a reputable ESP with 2FA.
- **Site/landing:** the platform's pages, or a static site (no server = tiny attack surface).
- **Analytics:** privacy-friendly (Plausible/Fathom) + consented ad pixels.

## Non-negotiable security requirements
| Area | Requirement |
|---|---|
| **Payment state** | Confirm purchase **server-side via webhook** from the payment provider; never grant course access based on a client-side "success" redirect. |
| **Webhooks** | Verify the signing secret on every webhook (Stripe/host). Reject unsigned/invalid. |
| **Secrets** | Server-side only; in the platform's secret manager; never in client bundles or git. `.env` gitignored. |
| **Auth** | Use the platform's auth. 2FA on all admin accounts. Strong unique passwords (manager). |
| **Authorisation** | Course content gated to paying users; no unprotected direct file URLs (signed/expiring links). |
| **Admin** | Admin panels behind login + 2FA; least-privilege roles; remove ex-collaborators promptly. |
| **Input validation** | Validate/escape all form input (signup, support). Rely on platform anti-spam + rate limiting. |
| **Transport** | HTTPS everywhere (HSTS). No mixed content. |
| **Headers** (if self-hosting any page) | CSP, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy. |
| **File uploads** (testimonials/video) | Restrict type/size; scan; store in access-controlled bucket; never execute. |
| **Redirects** | No open redirects; allowlist destinations. |
| **Logging** | No PII/secrets in logs; retain minimally. |
| **CORS** | Restrict to your own origins. |
| **Dependencies** | If any custom code: `npm audit` on every change; Dependabot; pin versions. |
| **Backups** | Regular exports of course content, customer list, orders; test a restore. |

## Client-trust anti-pattern (must avoid)
Do **not** unlock paid content, send the product, or mark an order paid because the browser said so. Trust only the payment provider's server-to-server confirmation.

## If any custom front-end/back-end is later added
- No secrets in the client bundle (Higgsfield/Stripe secret keys are server-side only).
- Server validates every purchase/entitlement; parameterised DB queries (no injection); CSRF protection on state-changing forms; rate-limit auth + forms.
- Run the repo checks in `02_security_checklist.md` in CI.

## Pre-launch security gate
☐ Hosted checkout live + webhook-verified access ☐ 2FA on all platforms ☐ No secrets in git/client ☐ HTTPS + headers ☐ Signed/expiring content links ☐ Backups tested ☐ Privacy notice + consent live ☐ Vendor DD done.
