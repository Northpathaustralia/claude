# EchoSight AI — Financial Model

Council owners: Financial Controller, CEO, Investor seat. All figures **USD** unless noted; all projections are **ASSUMPTION-driven** — the model's structure is the deliverable; every input is listed so it can be re-based as real data arrives. Red-teamed: round R3 (sanity of growth, margin and CAC assumptions; conservative case added).

---

## 1. Pricing

| Plan | Monthly | Annual (per-mo eq.) | Target ARPU role |
| --- | --- | --- | --- |
| Free | $0 | — | Acquisition + data flywheel |
| Starter | $29 | $24.17 | Solo creators |
| Pro | $79 | $65.83 | Serious creators / small brands |
| Agency | $199 base (incl. 15 accounts) + $9/extra account | $165.83 | Agencies; expansion via accounts/seats |
| Enterprise | From $1,500/mo (annual contract) | — | SSO, API scale, custom models |
| Add-ons | White-label $49/mo; credit packs $10/100; API overage metered | — | Expansion |

Rationale: Starter sits below the $32–49 incumbent cluster to convert; Pro is priced against the analyst-hour it saves; Agency margins improve with each added account (marginal cost ≈ sync + analysis compute).

## 2. Unit economics (steady-state targets, Y2)

| Input | Value | Basis |
| --- | --- | --- |
| Blended paid ARPU | $55/mo | Mix: 55% Starter, 30% Pro, 13% Agency, 2% Ent |
| Variable cost per paying customer | $9.20/mo | AI inference $5.10 (cached/routed), infra $2.60, payments 2.9%+30¢, support amortised |
| **Gross margin** | **≈ 79%** | Floor alarm at 72%; levers: caching, batch API, model routing |
| Free→paid conversion | 6% (base), 4% (bear), 8% (bull) | PLG benchmark range for prosumer tools |
| Monthly churn (logo) | Starter 5.5%, Pro 3.5%, Agency 1.8%, Ent 0.8% | Prosumer churn is the model's biggest sensitivity — see §5 |
| NRR | 104% (base) | Seat/account/credit expansion offsets churn |
| Blended CAC | $95 self-serve, $2,800 agency/ent-assisted | Content-led motion keeps self-serve CAC low |
| LTV (GM-adjusted) | Starter ≈ $370, Pro ≈ $1,480, Agency ≈ $7,300 | LTV = ARPU×GM÷churn |
| **LTV:CAC (blended)** | **≈ 4.6 : 1** | Payback ≈ 7–9 months self-serve |

## 3. Five-year projection (base case)

Drivers: signups from channel model ([Marketing Playbook §Budget](12-marketing-playbook.md)), conversion & churn as above, agency motion from M6, enterprise from M18.

| Year | Free accounts (EOY) | Paying (EOY) | Exit MRR | **Exit ARR** | Revenue (recognised) | Gross profit | Opex | EBITDA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Y1 | 10,000 | 1,200 | $66k | **$0.79M** | $0.42M | $0.33M | $2.1M | −$1.8M |
| Y2 | 45,000 | 5,400 | $297k | **$3.6M** | $2.1M | $1.66M | $3.4M | −$1.7M |
| Y3 | 120,000 | 12,800 | $704k | **$8.4M** | $6.0M | $4.74M | $4.6M | **+$0.1M** |
| Y4 | 230,000 | 24,500 | $1.42M | **$17.0M** | $12.6M | $10.1M | $7.9M | +$2.2M |
| Y5 | 380,000 | 39,000 | $2.34M | **$28.1M** | $22.4M | $17.9M | $12.3M | +$5.6M |

Break-even: month ~34 (base). Bear case (4% conversion, +1.5pt churn): Y5 ARR $13M, break-even M46 — still viable at reduced burn (trigger plan: hiring gates tied to ARR milestones). Bull case: Y5 ARR $41M.

## 4. Cost model

**Y1 Opex $2.1M (ASSUMPTION, AUD-converted where local):** salaries 6→14 heads $1.45M; cloud+AI $180k (scales with usage — modelled at 21% of revenue thereafter, declining to 17% by Y3 via caching/batch); marketing $220k; legal/compliance/audit $110k; tools/insurance/other $140k.

**AI cost governance (the margin risk):** per-teardown marginal target ≤ $0.18 (routing: embeddings/classifiers → batched small multimodal → premium LLM narration only, cached by feature-hash); per-tier monthly AI ceilings with 70% alerts; weekly cost-per-engine dashboard reviewed in ops meeting. If unit AI cost doubles, gross margin falls ~9pts — the alarmed floor (72%) triggers routing/caching escalation before pricing action.

## 5. Sensitivities (what actually moves the model)

| Variable | ±  | Y3 ARR impact |
| --- | --- | --- |
| Starter churn 5.5% → 4.5% | −1pt | +$1.3M |
| Free→paid 6% → 8% | +2pt | +$1.9M |
| Agency mix 13% → 20% | +7pt | +$1.1M (and NRR +5pt) |
| AI unit cost ×2 | — | Margin −9pt (ARR unchanged, EBITDA −$0.5M) |

Retention is the model: the Coach experiment loop and report automation exist because of this table.

## 6. Cash & funding

Seed **A$2.5M** (≈ US$1.65M, **ASSUMPTION** FX 0.66) closes M0 → 24-month runway to ~$1.5M ARR run-rate with burn discipline gates (each hiring tranche unlocked by ARR/retention milestones). Series A optionality at M20–24 (~$3M ARR, NRR > 105%, prediction-accuracy proof) or default-alive path in bear case by freezing hiring at 10 heads. Monthly cash reporting pack: burn, runway, MRR movements (new/expansion/contraction/churn), cohort retention curves, CAC payback by channel, AI unit costs.
