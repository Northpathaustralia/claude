# 28 · Data Map & Retention (Privacy Act — AU)

Principle: **collect the minimum, store it securely, delete it on schedule.** Confirm approach with adviser (Gate C). Not legal advice.

## Data map
| Data | Why collected | Necessary? | Store (vendor) | Access | Retention | Delete/export | Consent? |
|---|---|---|---|---|---|---|---|
| Email + first name (signup) | Deliver lead magnet + nurture | Yes | Email tool | Owner | Until unsubscribe + {24 mo} | Unsub link + on request | Opt-in |
| Purchase details (name, email, order) | Fulfil + support + tax | Yes | Course host + payment platform | Owner | {7 yrs} tax records | On request (non-tax) | Contract |
| **Card details** | Payment | **No — never store** | Payment provider (Stripe) only | None (tokenised) | N/A | N/A | — |
| Shipping address (bundle) | Post the tool | Yes (bundle only) | Course host/fulfilment | Owner | {24 mo} | On request | Contract |
| Support messages | Resolve issues | Yes | Helpdesk/email | Owner | {24 mo} | On request | — |
| Testimonials (words/photos) | Marketing | Optional | Secure drive + site | Owner | Until withdrawn | On request | **Signed release** |
| Before/after or video submissions | Proof/marketing | Optional | Secure drive | Owner | Until withdrawn | On request | **Signed release** |
| Test-participant records | Product evidence | Yes (Gate A) | Secure drive (NOT repo) | Owner | {as advised} | On request | **Signed consent** |
| Analytics (pageviews, events) | Improve funnel | Yes | Privacy-friendly analytics | Owner | {14 mo} | Aggregate/anon | Cookie notice |
| Ad pixels (Meta/TikTok) | Ad measurement | Optional | Ad platforms | Owner | Platform default | Opt-out/consent mode | **Consent** |
| Kat's identity/voice refs | AI production | Owner-only | Secure drive | Owner | Until project ends | Owner deletes | **Kat's consent** |
| Supplier documents | Due diligence | Yes | Secure drive (NOT repo) | Owner | Duration + {2 yrs} | On request | NDA |

## Data-minimisation rulings
- Don't collect phone unless needed for fulfilment.
- Don't collect DOB/gender/address for the digital-only class.
- Card data never touches your systems — use hosted checkout/tokenisation.
- Marketing pixels only fire after consent (AU cookie/consent notice).

## Retention & deletion
- Set the retention periods above in each tool; run a **quarterly deletion sweep**.
- Deletion request → confirm identity → delete across email tool, course host, helpdesk, drives → confirm to requester within {reasonable time}.
- Tax-required records retained per ATO rules even after a deletion request (explain this to the requester).

## Security controls (minimum)
Strong unique passwords + 2FA on every platform · least-privilege access · no PII in git · encrypted drive for sensitive files · vendor list kept current (`04_...vendor DD`).
