# Problem Research — Australian Mortgage & Finance Brokers

**Niche:** Australian mortgage / finance brokers (loan writers operating under an aggregator +
ACL/credit-rep, MFAA/FBAA members, bound by NCCP + ASIC RG 273 Best Interests Duty).

**Constraint carried over from NPAOS:** must not duplicate what the existing NorthPath AI OS
already does (lead scoring, CRM follow-ups, marketing content, referral tracking, KPI reporting,
daily priority list) — this is a *new* standalone problem, for a *new* free MVP.

**Method:** 10 candidate problems, each solvable with "simple software," scored 1–10 on four
axes and summed (40 = best):

- **Demand (D)** — how widespread and painful is this, industry-wide (not just for James)?
- **Competition (C)** — *higher score = less crowded* (10 = no good free/simple tool exists).
- **Ease (E)** — can a working MVP ship with no backend, no paid data feeds, no legal-advice
  exposure, inside a short build?
- **Monetization (M)** — would a broker pay for a better version, and is the value obvious?

| # | Problem | D | C | E | M | **Total** |
|---|---|---|---|---|---|---|
| 1 | **Commission & trail reconciliation** — brokers can't easily verify aggregator-paid upfront/trail commission matches what settled loans actually earned; leakage goes unnoticed for years. | 8 | 8 | 6 | 8 | **30** |
| 2 | Best Interests Duty (BID) comparison & record generator — NCCP/RG 273 requires documented proof the recommended loan suits the client, compared against panel options. | 8 | 6 | 6 | 8 | **28** |
| 3 | Annual/ongoing loan-book review scheduler with a compliance trail (RG 273 "reasonable enquiries" record-keeping over the life of the loan). | 7 | 6 | 7 | 6 | **26** |
| 4 | Document collection & chase-up portal (payslips, statements, ID) — biggest single time sink per file, but needs secure storage/notifications → real backend. | 9 | 4 | 4 | 6 | **23** |
| 5 | CPD (continuing professional development) hour tracker for FBAA/MFAA membership + RG 206 obligations. | 5 | 6 | 8 | 4 | **23** |
| 6 | Referral-partner fee & split tracker (accountants/agents), incl. NCCP referral-fee disclosure requirements. | 5 | 6 | 7 | 5 | **23** |
| 7 | Rate-change / repricing monitor — flag when a client's live rate drifts above current market so the broker can proactively reprice before the client churns. | 7 | 5 | 3 | 6 | **21** |
| 8 | Serviceability / borrowing-power estimator across multiple lenders' policies. | 9 | 3 | 3 | 5 | **20** |
| 9 | Digital fact-find / needs-analysis form replacing paper intake. | 6 | 3 | 7 | 4 | **20** |
| 10 | Panel lender product & credit-policy comparison matrix (30+ lenders' policy PDFs). | 6 | 4 | 4 | 5 | **19** |

## Why the winner: Commission & Trail Reconciliation Checker

- **It's a money problem, not an advice problem.** Reconciling *what you were paid* against *what
  you're contractually owed* is arithmetic, not credit assistance — so it carries none of the
  NCCP Best Interests Duty exposure that a serviceability or product-comparison tool would (#2,
  #8, #10 all require staying inside "general information," which is a much harder and riskier
  compliance line to hold).
- **It's genuinely under-served.** Full commission audit lives inside expensive all-in-one
  platforms (BrokerEngine, Podium, Simpology); there is no simple, free, standalone reconciliation
  checker a broker can run over a CSV export from their aggregator portal.
- **It ships with zero backend.** Two CSV uploads, a matching/variance engine, a report — all of
  it runs client-side in the browser, same architecture as NPAOS (`release/*.html`, localStorage,
  no server). That's what makes "launch for free" actually true: static hosting (GitHub Pages) or
  just double-clicking the file, no infrastructure cost ever.
- **The pitch writes itself.** "Find the commission you're already owed" is a direct-revenue
  hook — easier to sell than a productivity tool, and the free tier (single reconciliation run)
  naturally upsells into a paid tier (saved loan books, multi-aggregator statement formats,
  scheduled monthly reconciliation, PDF export for accountant handoff).
- **Runner-up (#2, BID generator)** is close in score and higher long-term value, but was ruled
  out for v1 because a compliance-document generator is much harder to get *right* — getting the
  Best Interests comparison logic or record-keeping template wrong has direct regulatory
  consequences for the broker using it. It's a strong candidate for a v2 once the reconciliation
  tool has validated the "standalone broker tool" distribution model.

**Chosen problem: #1 — Commission & Trail Reconciliation Checker.** Full MVP design in
[`01-mvp-design.md`](./01-mvp-design.md).
