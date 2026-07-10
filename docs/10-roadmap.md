# ATLAS ONE — Development Roadmap

Directive phases 1–5 and the V1 priority list are **delivered** (see `ATLAS_MASTER_STATUS.md`). Sequence below is ordered by owner value per unit of risk.

## V1.x — Local Edition hardening (next)

1. **App lock + encryption at rest** — passphrase (WebCrypto AES-GCM) wrapping keys and stores; auto-lock timer.
2. **Live web research** — search API key (Brave/Tavily class) behind the provider-adapter pattern → Research mode gains real sources with dates; Integration Centre gains its first non-AI Connected entry.
3. **IndexedDB storage** — lift the knowledge-library size limit; PDF text extraction (pdf.js) so PDFs stop being "Planned".
4. **Chat polish** — edit-and-rerun a past prompt, branch conversation, pin messages, save reply → artifact/project in one click.
5. **Auto-send voice + quiet mode**; parallel council passes.

## V2 — Connected Atlas

6. **HubSpot live sync** (NorthPath), **Google Calendar/Gmail read+draft**, **Xero read-only** → briefing and dashboards go live-data.
7. **Automation rules** — triggers (new A-grade lead, overdue follow-up, cash below buffer) → notifications/draft actions, each rule owner-approved.
8. **Skill packs** — the marketplace foundation: skills as declarative JSON (name, permissions, instructions, input/output schema) installed into the router; first-party packs first (Property Feasibility Analyst, Proposal Builder, Children's Book Builder).
9. **Image generation** in Studio behind a tested provider path.

## V3 — Cloud Edition

10. Next.js + PostgreSQL(+pgvector) + object storage; email+MFA auth; importer for Local Edition backups (no stranded data); multi-device sync.
11. Server-side integrations (webhooks, background sync), team seats, admin centre with usage/cost per user.
12. **Native mobile apps** (chat, voice, briefing, approvals, widgets) once the cloud API exists.

## V4 — Operator Atlas

13. **Computer control companion app** per `docs/05` (permission levels, emergency stop, audit).
14. **Continuous voice** with wake word + interruption per `docs/04`.
15. **Financial connections** — brokers read-only first; any write/trade path requires per-action confirmation and hard limits; never marketed as guaranteed anything.

## Standing gates for every phase

Tests green (unit + e2e) → security review updated → status labels updated → owner guide updated with plain-English steps → `ATLAS_MASTER_STATUS.md` continuity block refreshed.
