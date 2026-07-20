# 18 — Automation Manual
Every automation with explicit trigger conditions, actions, and exit rules. Stack: Shopify + Klaviyo (email/SMS) + Recharge (subscriptions) + Gorgias (support) + Judge.me (reviews) + Inventory Planner + Triple Whale + GA4. Supersedes the summary map in doc 10.

## Email & SMS lifecycle (Klaviyo)
| # | Automation | Trigger condition | Sequence & timing | Exit condition |
|---|---|---|---|---|
| 1 | Welcome | Subscribed to list AND zero orders | E1 instantly (ritual guide + story) · E2 +2d (honest science) · E3 +4d (reviews) · E4 +7d (guarantee) · E5 +10d (last word, no discount) | Places order OR completes flow |
| 2 | Abandoned checkout | `checkout_started`, no `purchase` within 45 min | E1 45m (cart contents + FAQ links) · SMS +4h if opted in ("your cart is patient — ships today if you are") · E2 +24h (guarantee) · E3 +48h (founder note) | Purchase OR flow end |
| 3 | Browse abandonment | `viewed_product` ≥2 times in 48h, no ATC, identified profile | E1 +6h (that product + honest FAQ) · E2 +2d (comparison table) | ATC, purchase, or max 1 send/product/14d |
| 4 | Post-purchase (first order) | `placed_order` where order_count = 1 | E1 instant (confirmation, brand-voice) · E2 on `fulfilled` (ritual prep) · E3 on `delivered` (tonight's the night + how-to) · SMS delivery day 7pm local · E4 +10d (check-in → review ask) · E5 +24d (refill/subscribe nudge) | Refund OR subscribe (moves to #6) |
| 5 | Review request | `delivered` +10d AND no open support ticket | Judge.me email w/ photo incentive (monthly draw); reminder +5d if unopened | Review submitted; suppressed if ticket open |
| 6 | Subscription onboarding | Recharge `subscription_created` | E1 instant (club welcome, pause education) · E2 +7d (limited-accord early access explainer) | — |
| 7 | Charge reminder | Recharge `charge_upcoming` −3d | Email + SMS with skip/pause/swap one-click links | Charge processed |
| 8 | Churn saver | `subscription_cancel_initiated` | In-flow offer: pause 1 cycle → cadence change → cancel confirm (no discount) | Any selection |
| 9 | Win-back | Last order +60d AND no active sub | E1 ("the jar's empty about now") · E2 +14d (what's new: accord/Rest Note) · E3 +30d final | Purchase OR 90d elapsed → quarterly newsletter only |
| 10 | VIP | Lifetime spend ≥ $300 OR 3+ orders | Tag `VIP`: early accord access 48h, annual thank-you gift (Rest Note tin), founder-signed note trigger to 3PL | Spend inactive 12mo → soft-exit |
| 11 | Referral nurture | `purchase` +14d AND NPS reply ≥ 9 (post-purchase survey) | Referral email ($15/$15) · SMS variant +3d | Referral link used |
| 12 | UGC request | Review ≥4★ with photo OR tagged brand on IG | Gorgias/Klaviyo email: usage-rights request template + reward (next refill 20% off) | Rights confirmed → asset log |
| 13 | Back-in-stock / drop | Product `out_of_stock`→`in_stock` OR tag `drop` | Waitlist email + SMS to segment; Ritual Club gets T−24h send | Stock depleted |
| 14 | Bedtime-timed Rest Notes | Profile property `bedtime` set (thank-you page) | Weekly campaign send-time = bedtime −45m local | Unsubscribe |

## Support, returns, refunds (Gorgias + Shopify)
| # | Automation | Trigger | Action |
|---|---|---|---|
| 15 | P1 safety escalation | Ticket contains {rash, reaction, burn, allergy, hospital} | Auto-tag P1, page founder (SMS), send empathy holding template, halt any review asks for profile |
| 16 | WISMO deflect | Ticket intent = shipping status | Auto-reply with live tracking + delivery ETA; close on no reply 48h |
| 17 | Instant remedy | Ticket has photo + intent {damaged, leaked} | Draft replacement order (human one-click approve ≤$150; auto if <$70), apology template |
| 18 | Guarantee claim | Form submit "60-Night" AND order age 14–75d AND first claim on account | Auto-refund first jar line item, tag `guarantee_used`, trigger exit survey; >3% weekly rate → alert CFO |
| 19 | Change-of-mind return | Portal request, unopened, <30d | Auto-approve, prepaid label emailed, refund on carrier first-scan |
| 20 | Refund reconciliation | Any refund processed | Log to finance sheet, weekly digest, flag accounts >2 refunds/6mo for review |

## Commerce, inventory, analytics
| # | Automation | Trigger | Action |
|---|---|---|---|
| 21 | Reorder alert | SKU cover < 8 weeks at trailing 4-wk velocity | Draft PO to blender, Slack #ops-alerts; seasonal multiplier (Apr, Oct ×2.5) |
| 22 | Stock sanity | 3PL count ≠ Shopify ±2% at monthly recon | Freeze affected SKU buffer, open ops ticket |
| 23 | Ad kill rule | Meta ad set spend > $150 AND purchases = 0 | Auto-pause + Slack alert with creative ID |
| 24 | Scale rule | ROAS > target 1.5× over 72h AND ≥5 purchases | Budget +20%, notify weekly creative council |
| 25 | MER guardrail | Blended MER < 2.2 for 7 consecutive days | Auto-notify CMO+CFO; playbook: cut bottom-quartile ad sets 50% |
| 26 | KPI digest | Every Monday 7am AEST | Sheets/Triple Whale email: revenue, CVR, AOV, MER, CAC, sub take/churn, repeat rate, guarantee rate, dispatch %, review avg vs targets (doc 10) |
| 27 | Anomaly alert | Daily revenue or CVR ±40% vs 28-day mean | Slack alert with top-3 diagnostic links (ads, site uptime, checkout errors) |
| 28 | Consent & tracking | Cookie consent state | Gate GA4/Meta/TikTok/Pinterest tags via consent mode; CAPI server events always on for purchases (legal basis: contract) |

## Build order (implementation)
Week 1: #4, #2, #26 (revenue-critical). Week 2: #1, #5, #7, #8. Week 3: #3, #9, #13, #21, #23–25. Week 4: remainder + test matrix (every flow trigger-fired with a test profile before launch gate in doc 14 passes).
