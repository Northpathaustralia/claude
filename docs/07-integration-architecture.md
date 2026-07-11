# ATLAS ONE — Integration Architecture

## Shipped in V1

- **Integration Centre** (`/integrations`): searchable, categorised registry of ~50 integrations across AI, business/CRM, Google, Microsoft, creative, finance, dev, automation, comms, storage, social, commerce and research — with **truthful statuses** resolved at render time.
- **AI provider integrations (working):** connect = paste key in Settings; a *real test call* must succeed before anything is called Connected. Status pills: Connected / Not Connected / Setup Required / Error text surfaced verbatim.
- **Manual data bridges (Beta, real today):** HubSpot-compatible CSV lead import/export, CSV artifacts that open in Excel/Sheets, ISO-dated appointments ready for calendar import, flat versioned JSON backups designed for Zapier/Make webhooks.

## Status vocabulary (enforced)

Connected · Not Connected · Permission Required · Setup Required · Error · Expired · Limited Access · Beta · Planned. An integration reaches **Connected only after a real, tested call succeeds** — the AI-provider "Test" button is the template for every future connector.

## Connector contract (future phases)

```js
{
  id, name, category,
  scopes: [{id, label, risk}],          // shown on the pre-install permission screen
  connect(): OAuth PKCE flow (browser)   // or key entry where OAuth unavailable
  test(): cheap authenticated call       // gates the Connected status
  actions: { read: [...], write: [...] } // every write action flagged approval-required
  activityLog: per-connector             // who/what/when, owner-clearable
  revoke(): token deletion + provider-side revocation call
}
```

Rules: least-privilege scopes by default; write scopes requested only when the owner enables a write feature; external sends/publishes always show the exact payload with Confirm/Edit/Cancel; tokens stored locally in V1 (see security model) and in encrypted server storage in the Cloud Edition; expiry handled with re-auth prompts, never silent failure.

## Rollout order (matched to owner value)

1. ~~**Web search/research API**~~ — **DELIVERED v0.3**: Tavily + Brave connectors with key entry, live Test gating the Connected status, and Research-mode source citation. First non-AI integrations following the full contract.
2. **HubSpot live** (NorthPath leads two-way) — replaces CSV bridge. ← next connector
3. **Google Calendar + Gmail read/draft** (briefing + follow-ups).
4. **Xero read-only** (Financial Centre real revenue).
5. Zapier/Make webhooks outbound (automation without per-platform builds).
6. Social preparation flows (publish always behind approval).

Cloud Edition note: server-side connectors (webhooks, background sync) require the Cloud Edition; the Local Edition supports direct browser OAuth (PKCE) integrations only — the registry marks which is which when each ships.
