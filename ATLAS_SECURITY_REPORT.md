# ATLAS_SECURITY_REPORT — ATLAS ONE v0.3

**Date:** 2026-07-11 · Full model: `docs/09-security-model.md`. Point-in-time review for this release.

## New this release

**Encryption at rest shipped (app lock).** The top open risk from v0.2 is closed when the owner turns the lock on:

- AES-GCM-256 via WebCrypto; key derived from the owner's passphrase with PBKDF2-SHA-256 at 310,000 iterations and a random 16-byte salt; fresh random IV per write.
- Covers both stores — conversations, memory, knowledge, business data and **AI/search API keys** (`atlas.v1`, `npaos.v1` → `enc.*` ciphertext; plaintext removed at enable time, verified in e2e).
- The derived key exists only in memory; locking (manual "Lock now", auto-lock after 5–60 idle minutes, or closing the browser) drops it. Nothing renders and nothing writes while locked (unit-tested).
- No recovery backdoor: a forgotten passphrase means the ciphertext stays sealed. The lock screen offers an explicit typed-ERASE wipe as the documented last resort, with backups as the recovery path.
- Changing the passphrase re-keys all ciphertext; removing the lock requires the passphrase and restores the previous plaintext behaviour.

**Live web search added with the same honesty rules.** Keys are Connected only after a real test call; CORS/network failures are reported plainly; a failed search is disclosed on the affected reply rather than silently ignored. Search snippets enter the prompt as quoted, wrapped material with cite-only instructions (same injection posture as uploaded documents).

## Verified this session

Lock lifecycle end-to-end in a real browser (ciphertext-only storage, reload → lock screen, wrong-pass rejection, unlock, data integrity, removal) · secure-storage unit suite (7 tests incl. no-write-while-locked and GCM auth failure on wrong passphrase) · no new outbound network paths beyond the two documented search endpoints · renderer injection tests still green.

## Known risks (open, owner-visible)

| Risk | Severity | Mitigation now | Fix |
|---|---|---|---|
| Lock is opt-in; data is plaintext until enabled | Medium | Settings shows an honest "Not encrypted" badge; owner guide step | Consider prompting once on first run |
| Backup files are readable JSON incl. keys (by design — D11) | Medium | Called out at export + in guide | Optional encrypted export later |
| Browser speech routes audio via vendor | Low | Opt-in per press; Beta label | Local STT option later |
| Search/AI adapters for some providers unverified in-browser | Low | Labelled; Test button gates Connected; failures explained | Verify or proxy via Cloud Edition |
| Prompt injection via docs/search snippets (residual) | Medium | Wrapping + honesty rules + tests | Standing red-team suite each release |

## Release gates unchanged

New outbound integration → scope review + permission screen + revocation + activity log · any write/publish/send → per-action confirmation · Cloud Edition → full auth/MFA, encrypted server storage, RLS, rate limiting, audit logging before first external user.
