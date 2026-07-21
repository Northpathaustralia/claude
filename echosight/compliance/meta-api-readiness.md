# Meta API Readiness

The product beta depends on Meta App Review approval. This file is the submission kit: scopes, justifications (paste-ready), and the compliance posture Review teams check.

## Scopes requested (nothing more)

| Permission | Paste-ready justification |
| --- | --- |
| `instagram_basic` | "EchoSight displays the user's own professional account profile and media list so the user can select which of their own posts to analyse. No other accounts' data is accessed with this permission." |
| `instagram_manage_insights` | "EchoSight shows the user aggregate performance metrics of their own content (reach, saves counts, shares counts) and explains, using AI analysis of the content itself, what likely drove those aggregate outcomes. Metrics are displayed to the account owner only." |
| `pages_read_engagement` | "Required plumbing for Instagram professional account connection via Facebook Login for Business; used solely to establish the page-account link." |

Business Discovery (competitor tracking) uses `instagram_basic`-scoped Business Discovery capability on public professional accounts only; the feature description for review: "Users can view public posting cadence and public engagement counts of public professional accounts they choose to follow competitively, presented as clearly-labelled estimates."

## Review-readiness checklist

- [ ] Screencast per permission showing the exact user flow (record from the beta build)
- [ ] App icon, privacy policy URL (live domain — guide step 1–4 first), terms URL
- [ ] Data deletion callback endpoint implemented and tested (deauthorise → purge ≤30 days → confirmation) — **build-gate before submission**
- [ ] App in Business verification (requires the Pty Ltd + domain email)
- [ ] Test users configured so reviewers can run the flow without a real creator account

## Standing compliance posture (what keeps approval)

Annual Data Use Checkup calendared · API version upgrades rehearsed within 30 days of release · no scope creep without fresh review · no data resale/sharing (attested in policy and true in architecture) · the "never do" list (no scraping, no private-data claims) enforced in CI copy-lint per docs/09.

## Honest risk note

App Review timelines and outcomes are outside our control (BLOCKED EXTERNALLY when submitted). Mitigation is architectural: **Studio mode (upload-based analysis) requires zero Meta permissions** and is a complete product experience — the beta can open in Studio mode while review runs. This decouples launch from Meta's timeline entirely.
