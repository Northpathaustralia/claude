# 04 · Gate A — Lash Lock Physical Test Protocol

**Purpose:** produce genuine, documented evidence so product claims can be substantiated (or dropped). **No claim becomes public until its evidence rows here are complete and signed off.** This protocol can be executed by Kat + a small number of consented volunteers; it is not a clinical/laboratory study and must not be described as one.

**Version control:** file this run as `Gate-A_v[n]_[YYYY-MM-DD]`. Any product/material/supplier change → new version + retest of affected rows.

---

## 1. Test participants & sample size
- **Minimum credible:** Kat + **6 volunteers** (aim 8–10) spanning: 2 beginners, 1 experienced MUA, 2 mature/40+ skin, 1 hooded eye, 1 oily lid, ≥1 left-handed. Note: small sample = *directional evidence*, phrase claims accordingly ("in our testing", not "clinically proven").
- Each participant completes the consent form (§ consent) **before** any test or photo.
- Record participant as an anonymised code (P01…P0n). Never store names in the repo.

## 2. Conditions to standardise
Same lighting for photos · same shadow (a known heavy-fallout shade) · same brushes · room ~ambient; for the heat test, a real hot/humid day (log temp + hours). Clean the tool between participants (hygiene — see cleaning test).

## 3. Test battery
For each, record: pass/fail vs criteria, notes, photo/video IDs.

| # | Test | Method | Pass criteria |
|---|---|---|---|
| T1 | Intended use: fallout capture | Apply heavy shadow, tool held under lash line vs bare control eye | Visibly less/none reaches under-eye vs control; catches on tool |
| T2 | Protect finished under-eye | Full concealer both eyes; do shadow; compare | Protected side needs no re-do; control side smears |
| T3 | Mascara shielding | Mascara with tool as backstop vs without | Less/no lid print with tool |
| T4 | Eyeliner assistance | Line using tool as backstop | Cleaner/steadier line reported; no injury |
| T5 | Comfort & edge | Hold 60–90s; rate 1–5; check edges | ≥4/5 comfort; no sharp edge; no scratching |
| T6 | Slippage | Normal grip during application | Stays where placed; no slip toward eye |
| T7 | Visibility obstruction | Can participant still see to apply | No unsafe obstruction |
| T8 | Skin contact reaction | Inspect contact area immediately + 15 min | No redness/irritation for any participant (report ANY) |
| T9 | Left- & right-handed use | Both-handed participants try both | Usable both hands |
| T10 | Beginner usability | Beginner uses with only the method card | Completes without help; subjective ease ≥3/5 |
| T11 | MUA efficiency | MUA times a full eye with/without | Report time delta honestly (may be neutral) |
| T12 | Mature-skin use | On 40+ participants | No dragging of delicate skin; comfort ≥4/5 |
| T13 | Cleaning | Clean per supplier method (once known) | Cleans without damage; makeup removed |
| T14 | Drying | Air-dry, log time | Dries without residue/odour |
| T15 | Repeated use (20 cycles) | Use+clean ×20 | No tears, no warping, no degradation |
| T16 | Colour transfer / staining | After 20 cycles inspect | No permanent staining that transfers to skin/makeup |
| T17 | Warping/heat | Leave in a hot car-equivalent / warm room | Report any deformation |
| T18 | Packaging durability | Drop/transit sim | Protects product; survives post |
| T19 | Storage | Store per instructions 1 week | No degradation |
| T20 | Misuse cases | e.g. too close to eye, excessive force | Document failure modes + safety note for instructions |

## 4. Photo shot list (per key test)
Wide (context) · macro of the catch on the tool · under-eye before/after (control vs protected) · comfort/hold angle · after-20-cycles condition · any incident. Neutral, even light; ruler/coin for scale on product shots. Save as `Gate-A_[test]_[P0n]_[shot].jpg` (kept OUT of repo per `.gitignore`).

## 5. Video shot list
T1/T2 uncut split (fallout vs control) · T3 mascara backstop macro · real-time full-eye run · heat-check end-of-day. These double as *genuine* proof footage (never restaged as fake).

## 6. Incident form (one per issue)
`Participant code | Date | Test | What happened | Severity (none/minor/moderate/serious) | Action taken | Photo ID | Follow-up`. **Any skin reaction or eye-proximity concern = stop that test, record, and exclude the affected claim until reviewed.**

## 7. Test record sheet (per participant)
`P-code | eye type | hand | T1…T20 result | comfort score | would-recommend? | verbatim quote (optional, consented) | photo/video IDs`.

## 8. Pass/fail → claim gate
A claim may be marked ✅ only if: ≥ the stated pass threshold across participants **and** zero unresolved safety incidents. Partial results → ⚠️ (softened/qualified wording) or ❌ (drop the claim). Record outcome in `03_claim_register.md`.

## 9. Retest rules
Re-run affected tests on: supplier/material change, tooling change, a new colour/mould, or any post-launch safety report. Bump version.

## 10. Sign-off form
```
Gate A sign-off
Version: ____  Date: ____
Tests completed: __/20    Participants: __
Safety incidents: none / listed (attach forms)
Claims supported: [list]   Claims dropped/qualified: [list]
Signed (owner): ____________________  (Kat)
Note: This is in-house directional testing, not clinical or laboratory certification.
```
