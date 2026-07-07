# NorthPath AI Operating System (NPAOS)

An intelligent business operating system for NorthPath — a team of **AI employees** working
together to attract qualified prospects, organise them, prioritise them, and help convert them
into booked consultations while minimising James' administrative workload.

> **Mission test for every feature:** does this help generate more qualified consultations or
> save James time? If not, it isn't built.

## Easiest setup — no install at all

The whole app ships as **one self-contained file**: [`release/NorthPath-AI-OS.html`](release/NorthPath-AI-OS.html).

1. Download that one file (open it on GitHub → click the **Download raw file** button).
2. Save it somewhere easy, e.g. your Desktop.
3. **Double-click it.** It opens in your browser and just works — no internet needed.

Your data saves automatically in that browser. Two things to know:

- Always use the **same computer and same browser** (e.g. always Chrome) so your data is there.
- Go to **Settings & Data → Export full backup** once a week — that JSON file is your safety net.

## Developer setup (optional)

```bash
npm install
npm run dev               # local development at http://localhost:5173
npm test                  # unit tests for the AI engines (Node built-in test runner)
npm run build             # production build to dist/
npm run build:standalone  # rebuild the single-file app in release/
```

The app ships with realistic demo data so every screen works immediately. Manage or clear it
from **Settings & Data**. All data lives in the browser (localStorage, versioned key `npaos.v1`)
— export a JSON backup regularly.

## The AI employees

Each employee is an independent, pure-function module in `src/ai/` — individually unit-testable,
with no side effects. They currently run on deterministic rule engines; because every consumer
just calls a function, any of them can be upgraded to a live LLM backend later without touching
the UI.

| Employee | Module | What it does |
| --- | --- | --- |
| Marketing Manager | `marketingManager.js` | Generates the full daily content pack (3 video ideas, Facebook + LinkedIn posts, article, 5 Q&A responses, 5 DM drafts, newsletter, FAQ), builds a 14-day themed content calendar, ranks theme performance. |
| Sales Assistant | `salesAssistant.js` | Reviews and ranks open leads by urgency and quality, recommends the next action for every lead, drafts personalised SMS/email follow-ups. |
| CRM Manager | `crmManager.js` | Surfaces overdue / due-today follow-ups, flags unscheduled and stale leads, suggests follow-up cadences, audits data hygiene. |
| Referral Manager | `referralManager.js` | Tracks accountants, brokers, planners, conveyancers, builders and buyer's agents; suggests who to reconnect with each week based on relationship strength. |
| Business Analyst | `businessAnalyst.js` | Weekly/monthly KPIs, 8-week lead trend, source performance, pipeline value, and plain-English bottleneck diagnostics with suggested fixes. |
| Operations Assistant | `operationsAssistant.js` | Assembles today's single ordered priority list from everything above — the first thing James sees each morning. |

**AI Lead Scoring** (`leadScoring.js`) scores every lead out of 100 against the ideal client
profile (income 25, employment 20, debt 15, credit 15, timeframe 15, location 10) and grades it
A+/A/B/C/D. Suburb affordability data (`src/data/suburbs.js`) ranks locations High/Medium/Low
around the ~$900k established-house ceiling, with postcode-first lookup.

## Compliance by construction

- The **compliance guard** (`src/utils/compliance.js`) scans and rewrites any language implying
  guaranteed approvals, finance or outcomes; generated content is checked and badged in the UI.
- A standard educational disclaimer is appended to customer-facing content.
- **Nothing is ever sent automatically.** Every message, post and email is a draft James
  reviews, personalises and sends himself.
- Lead scores are internal prioritisation signals — never statements of eligibility.

## Project structure

```
src/
  ai/            AI employee engines (pure functions, unit-tested)
  components/    Reusable UI (ui/), layout shell, lead widgets
  data/          Suburb affordability dataset + demo seed data
  domain/        Shared enumerations and ICP thresholds
  pages/         Dashboard, Leads, LeadDetail, Content, Referrals, Reports, Tasks, Settings
  store/         Context + reducer store persisted to localStorage
  utils/         Dates, formatting, CSV import/export, compliance guard
tests/           Node test-runner suites for the AI layer
```

Conventions:

- `src/ai`, `src/data`, `src/domain`, `src/utils` use **relative imports** so they run in both
  Vite and plain Node (tests). React components may use the `@/` alias.
- All persisted dates are ISO 8601 strings; all enums are flat strings — schemas map 1:1 onto
  external systems.

## Integration readiness

The current version prepares data so future integrations are straightforward:

- **CSV export/import** for leads uses stable, HubSpot-friendly column names.
- **JSON backup** is a flat, versioned schema (`npaos.v1`) suitable for Zapier/Make.com webhooks.
- Appointments carry ISO date/time fields for Google Calendar; leads map onto Google Contacts.
- New-lead payloads (website forms, Meta Lead Forms) only need the fields in the CSV header.

## Testing

`npm test` runs 20 tests over scoring, compliance, CSV round-trips and all six AI employees.
A Playwright browser smoke test (route rendering + add-lead flow) was used to verify the built
app end-to-end during development.
