# ATLAS ONE — Computer Control Architecture (Planned)

Status: **Planned** — nothing in V1 pretends to control the computer. This document is the build contract for the phase that does.

## Why not in V1

A browser tab cannot (and should not) click other applications. Real computer control needs a desktop agent process. Shipping a fake version would violate the quality rule, so V1 ships none.

## Target architecture

```
ATLAS ONE UI  ⇄  Local companion app (Tauri/Electron)  ⇄  OS
                   │  screen capture (screenshots on demand)
                   │  input synthesis (click/type) — permission-gated
                   │  app launching, file operations
                   └  hard kill-switch process supervisor
```

Model layer: Anthropic computer-use tooling (screenshot → model → action loop), with the companion app executing actions **only** inside the granted permission level.

## Permission levels (enforced by the companion, not the model)

| Level | Allows |
|---|---|
| 1 Observe | Screenshot + describe only; zero input events |
| 2 Navigate | Open/switch/close approved applications |
| 3 Act | Type, click, move files, fill forms |
| 4 Workflows | Approved multi-step recipes with visible progress |
| 5 Sensitive | Anything in the sensitive list — always per-action confirmation |

Sensitive list (always confirm, level irrelevant): send email/message, publish, delete permanently, purchase/spend, financial settings, trades, move money, edit live ads, upload private documents, sign, install software, change security settings or passwords.

## Modes

Observe / Assist (highlight where to click) / Guided (one step at a time) / Autonomous approved task (predefined boundary, e.g. "rename and zip the approved book images, stop before uploading").

## Emergency stop

Stop button in UI + global hotkey + voice "Atlas stop" → companion kills the action queue and releases input control immediately. The kill path is local and does not depend on the model or network.

## Audit

Every action logged: time, app, action, parameters, permission level used, screenshot reference. Log is owner-viewable and clearable, mirroring the existing Activity Log pattern.

## Confirmation UI contract

Before any sensitive action: show Action / Target / Exact content / Risk class, with Confirm · Edit · Cancel. Identical shape to the directive's example so the habit transfers to integrations.
