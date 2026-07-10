# ATLAS ONE — Security Model

## Local Edition trust model (shipped)

**Everything stays on the owner's device.** No ATLAS server exists; the only network traffic is browser → AI provider (with the owner's own key) and optional browser speech services. That removes whole attack classes (no server breach, no multi-tenant leakage) and concentrates risk in one place: the local browser profile.

### Controls in place

| Area | Control |
|---|---|
| Model-output injection | Custom markdown renderer escapes **all** input before emitting a fixed tag set; only http(s) links allowed; unit-tested against script/`javascript:` injection |
| Artifact preview | Studio HTML artifacts render in a fully sandboxed iframe (`sandbox=""` — no scripts, no same-origin) |
| Prompt injection via documents | Knowledge excerpts are wrapped and instructed as quotable material, not instructions; injection red-teaming is a standing test item |
| Sensitive memory | Regex screen (passwords, keys, cards, TFN, medical…) forces an explicit confirmation before storing; memory is never written silently |
| Provider keys | Stored locally only, masked in UI, removable in one click, sent only to that provider's official endpoint. UI carries a plain-language warning about shared computers |
| Honest failure | Provider errors surface verbatim (auth/rate-limit/network) — no silent retries pretending success |
| Data control | One-click full export; import validates shape and asks before replacing; independent clear for Atlas vs NorthPath data; activity log of key events |
| Financial safety | No trading/money paths exist in V1; Finance Centre is manual-entry only and labelled; disclaimer banner on the page |

### Accepted risks (documented, not hidden)

1. **Keys and data are plaintext in localStorage.** Anyone with access to the OS user profile can read them. Mitigation today: device hygiene + the in-app warning; V1.x: passphrase-derived AES-GCM encryption at rest (WebCrypto) with an app-lock screen.
2. **Browser speech services** (push-to-talk) may route audio via the browser vendor. Voice is opt-in per press and labelled Beta.
3. **Backups contain keys.** Export dialog says so; owner guide repeats it.
4. **No authentication in V1** — meaningless against a local attacker who owns the profile; real auth arrives with the Cloud Edition boundary.

## Cloud Edition requirements (build gate)

Email+MFA auth, per-user row-level isolation, KMS-wrapped key/token encryption, OAuth least-privilege scopes, rate limiting, file scanning on upload, audit logs, encrypted backups + tested recovery, GDPR-grade export/delete, secret scanning in CI, dependency audit gates, and prompt-injection test suite as a release gate.

## Threat checklist status (directive list)

Prompt injection: renderer + wrapping + tests ✅ (ongoing red-team item) · Data leakage: no server, no third parties beyond chosen provider ✅ · Malicious files: text-only parsing, size caps, no execution ✅ · Cross-project leakage: retrieval is workspace-wide by design in V1 (single owner); per-project scoping flag on roadmap ⚠ · Unauthorised actions: no outbound actions exist yet; approval framework specified for when they do ✅ · Secret exposure: keys never rendered after save; not logged ✅ · Unsafe code: artifacts sandboxed; nothing auto-executes ✅ · Excessive permissions: N/A until connectors; contract written ✅
