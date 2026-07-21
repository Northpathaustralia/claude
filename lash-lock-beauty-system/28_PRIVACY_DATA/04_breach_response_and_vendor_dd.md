# 28 · Breach Response & Vendor Due Diligence

## Data-breach response checklist (AU Notifiable Data Breaches scheme)
1. **Contain** — revoke access, reset credentials, isolate affected system.
2. **Assess** — what data, whose, how many, likelihood of serious harm. Log timeline.
3. **Notify** — if "eligible data breach" likely to cause serious harm: notify affected individuals **and** the OAIC as soon as practicable. Draft template ready.
4. **Remediate** — fix root cause; rotate all potentially exposed secrets.
5. **Review** — post-incident note: what happened, why, what changed.
> Keep an incident log. Seek advice early for anything involving customer PII.

**Breach-notification template (draft):**
> "We're writing to let you know about a data incident on {date} that may have affected your {data}. Here's what happened, what we've done, and what you can do: {…}. Contact {email}."

## Vendor due-diligence checklist (before adopting any tool)
| Check | OK? |
|---|---|
| Reputable, mainstream provider | ☐ |
| Supports 2FA | ☐ |
| Clear privacy policy + data-processing terms | ☐ |
| Data residency acceptable / disclosed if overseas | ☐ |
| PCI-DSS (for anything touching payments) | ☐ |
| Breach-notification commitment | ☐ |
| Export + deletion supported | ☐ |
| Least-privilege roles available | ☐ |
| Reasonable pricing / no lock-in surprise | ☐ |

## Current/likely vendors to vet
Course host · payment provider (Stripe-backed) · email tool · analytics · ad platforms · fulfilment/shipping · helpdesk · AI production (Higgsfield) · file storage. Record each in a vendor register with data-type + retention.
