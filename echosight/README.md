# EchoSight AI

**Autonomous Instagram Intelligence Platform** — understand *why* content performs, predict what will work next, and turn that understanding into growth.

EchoSight AI is a compliance-first SaaS platform for creators, agencies and brands. It analyses content through authorised APIs and first-party uploads, scores and explains performance with machine learning, predicts outcomes before publishing, and generates the next piece of winning content — including complete Higgsfield and Fable production prompt packs.

> **What EchoSight never does:** claim to reveal who saved or shared a post, read DMs, expose private accounts, or access any data outside authorised APIs. Every insight is built from authorised data, first-party analytics, and machine learning. See [Security & Compliance](docs/09-security-and-compliance.md).

## Repository map

| Area | Path | Contents |
| --- | --- | --- |
| Executive Summary | [`docs/00-executive-summary.md`](docs/00-executive-summary.md) | One-page investor-grade summary |
| Business Plan | [`docs/01-business-plan.md`](docs/01-business-plan.md) | Market, model, moat, go-to-market, risks |
| Product Specification | [`docs/02-product-specification.md`](docs/02-product-specification.md) | All dashboards, modules, UX flows |
| AI Engines | [`docs/03-ai-engines.md`](docs/03-ai-engines.md) | Analytics, prediction, recommendation, content analysis, trend detection, AI Coach |
| Competitor & Audience Intelligence | [`docs/04-competitor-intelligence.md`](docs/04-competitor-intelligence.md) | Authorised-data competitor monitoring |
| Creative Generator & Integrations | [`docs/05-content-generator-and-integrations.md`](docs/05-content-generator-and-integrations.md) | Content generation, Higgsfield + Fable prompt packs |
| Architecture | [`docs/06-architecture.md`](docs/06-architecture.md) | Full technical architecture and stack decisions |
| Database Schema | [`docs/07-database-schema.md`](docs/07-database-schema.md) | PostgreSQL schema (DDL) |
| API Specification | [`docs/08-api-specification.md`](docs/08-api-specification.md) | Public + internal REST API |
| Security & Compliance | [`docs/09-security-and-compliance.md`](docs/09-security-and-compliance.md) | OWASP, privacy law, Meta policy compliance |
| Financial Model | [`docs/10-financial-model.md`](docs/10-financial-model.md) | Pricing, unit economics, 5-year projections |
| Brand Guidelines | [`docs/11-brand-guidelines.md`](docs/11-brand-guidelines.md) | Name, identity, design system, voice |
| Marketing Playbook | [`docs/12-marketing-playbook.md`](docs/12-marketing-playbook.md) | Channel strategies, launch, SEO, affiliates |
| Sales Playbook | [`docs/13-sales-playbook.md`](docs/13-sales-playbook.md) | Funnel, scripts, enterprise motion, onboarding |
| Operations & Support | [`docs/14-operations-and-support.md`](docs/14-operations-and-support.md) | Support system, ops manual, hiring plan |
| Testing Strategy | [`docs/15-testing-strategy.md`](docs/15-testing-strategy.md) | Unit → E2E → performance → security testing |
| Roadmap & Launch | [`docs/16-roadmap-and-launch.md`](docs/16-roadmap-and-launch.md) | Phased roadmap, launch checklist |
| Investor Deck | [`docs/17-investor-deck.md`](docs/17-investor-deck.md) | Slide-by-slide deck with copy |
| Red Team Review | [`docs/18-red-team-review.md`](docs/18-red-team-review.md) | Adversarial reviews, fixes, open constraints |
| Prompt Library | [`docs/19-prompt-library.md`](docs/19-prompt-library.md) | Production AI prompts and orchestration pipelines |
| Marketing Site | [`site/index.html`](site/index.html) | Production landing page / website home (self-contained, no build step) |

## Quick start

The marketing site is dependency-free: open `site/index.html` in a browser, or serve the `site/` folder from any static host.

The product itself is specified to build stage; see [Architecture](docs/06-architecture.md) for the implementation stack and [Roadmap](docs/16-roadmap-and-launch.md) for build sequencing.

## Governance of this document set

Every document was produced by an internal council process (product, engineering, AI, security, legal, finance, growth) and then attacked by an independent red team. Findings and their resolutions — including constraints that cannot be engineered away (API limitations, legal restrictions) — are recorded in the [Red Team Review](docs/18-red-team-review.md). Material assumptions are marked **ASSUMPTION** inline in each document.
