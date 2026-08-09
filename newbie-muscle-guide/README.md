# Muscle Basics — A Beginner's Guide to Getting Into Shape

A free, self-contained web app: a beginner's "book" on muscle and getting into shape, turned into
working software instead of a static document. No login, no backend, no install.

## What it includes

- **Start Here** — how to use the guide, plus the medical/safety disclaimer.
- **How Muscle Grows** — progressive overload, protein/calories, recovery, explained in plain English.
- **Muscle Map** — an interactive front/back body diagram (12 muscle groups); tap a region or a
  button to see what it does and which exercises train it.
- **Your Program** — a ready-to-use 4-week, 3-day-a-week beginner routine (Workout A / Workout B).
- **Exercise Library** — step-by-step form, common mistakes, and a beginner tip for every exercise
  in the program, searchable and filterable by muscle group.
- **Nutrition Basics** and **Recovery & Safety** — the habits that make the training actually work.
- **My Progress** — a workout checklist and a bodyweight log with a trend chart, saved only in your
  browser (localStorage). Nothing is ever sent anywhere.
- **Glossary** — the handful of training terms used throughout.

## Run it

It's a single file. No build step, no dependencies.

- **Locally:** double-click `index.html` — it opens and works in any modern browser, fully offline.
- **From this repo:** open `newbie-muscle-guide/index.html`.

## Deploy it for free

Any static host works since it's one HTML file with everything inlined (CSS/JS, no external
requests):

- **GitHub Pages:** Settings → Pages → deploy from this branch, folder `/newbie-muscle-guide`
  (or copy `index.html` to the repo root / a `docs/` folder, per your Pages config).
- **Netlify Drop:** go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the
  `newbie-muscle-guide` folder onto the page — it's live in seconds, no account required for a
  quick share link.
- **Cloudflare Pages / Vercel:** create a new project pointed at this folder; no build command
  needed (leave the build command empty, output directory `.`).

## Notes on how it was built

- Vanilla HTML/CSS/JS, no framework or CDN dependency — keeps it small, offline-capable, and free
  of third-party network calls.
- All user data (workout checklist, bodyweight log, theme preference) is stored in
  `localStorage` on the visitor's own device only.
- Content is general educational information, not personalised medical, fitness, or nutrition
  advice — see the disclaimer on the Start Here tab.

## QA performed

This build was checked with an automated Playwright pass (all 9 tabs, muscle-map interaction and
cross-links, exercise search/filter including cross-listed exercises, program table rendering,
progress-tracker persistence across reloads, bodyweight validation — including timezone-correct
"today" handling and future-date rejection — corrupted-localStorage recovery, keyboard access to
the muscle map, and dark/light theme switching), plus a security review (no `eval`, no network
calls, no unescaped `innerHTML` from user input) and a second-pass code review that caught and
fixed a UTC-vs-local-date bug, a stale search filter on cross-navigation, and a muscle/exercise
cross-listing filter bug.
