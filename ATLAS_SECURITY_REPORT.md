# ATLAS_SECURITY_REPORT — ATLAS ONE v0.2

**Date:** 2026-07-10 · Full model: `docs/09-security-model.md`. This is the point-in-time review for this release.

## Reviewed and verified this session

1. **Model-output rendering:** escape-first markdown renderer; `<script>`, raw HTML and `javascript:` links are neutralised (unit-tested). e2e run recorded zero console/page errors.
2. **Generated-artifact isolation:** Studio HTML previews use `<iframe sandbox="">` — no script execution, no same-origin access; download is explicit.
3. **Key handling:** password-type inputs; keys masked after save; single-click removal; sent only to the selected provider's official endpoint over HTTPS; never written to logs or activity entries; UI + owner guide warn about shared machines and that backups include keys.
4. **Memory consent path:** silent storage impossible (writes only via explicit command/UI); sensitive-pattern screen (passwords, API keys, cards, TFN, medical, etc.) forces a second confirmation.
5. **Document handling:** text formats only, 2 MB cap, content treated as data (never executed), knowledge excerpts wrapped with quoting instructions to resist embedded prompt injection.
6. **Destructive actions:** delete conversation/project/memory-clear/data-clear/import-replace all require explicit confirms; Atlas data and NorthPath data clear independently.
7. **No hidden network paths:** grep-audited — outbound calls exist only in the three provider adapters; no analytics, no telemetry, no beacons.

## Known risks (open, owner-visible)

| Risk | Severity | Mitigation now | Fix |
|---|---|---|---|
| Keys/data plaintext in localStorage | High (local attacker) | In-app warning; device hygiene | V1.x-1 app lock + AES-GCM (WebCrypto) |
| Backup files contain keys | Medium | Called out at export + in guide | Optional encrypted export in V1.x-1 |
| Browser speech routes audio via vendor | Low | Opt-in per press; Beta label; disclosure | Local STT option later |
| xAI/Mistral adapters unverified in browser | Low | Labelled untested; errors surface honestly | Verify or proxy in Cloud Edition |
| Prompt injection via uploaded docs (residual) | Medium | Wrapping + honesty rules + tests | Standing red-team suite each release |

## Release gate checklist for future phases

New outbound integration → scope review + permission screen + revocation path + activity log · Any write/publish/send action → per-action confirmation UI · Cloud Edition → full auth/MFA, encrypted storage, RLS isolation, rate limiting, audit logging before first external user.
