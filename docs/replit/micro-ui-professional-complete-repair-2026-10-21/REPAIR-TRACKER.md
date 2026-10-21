# Complete Micro UI repair tracker

Baseline: `25fed21790f2c1e78b25e925edc62e9b76825d2e` (fresh `origin/main`, 2026-10-21).
Branch: `replit/micro-ui-professional-complete-repair-2026-10-21`.
Starting SHA: same as baseline. Local `main` is protected and unchanged.

Source commit: `09ff0140ad85f703a57d97da50660d597a38ceaf`.
Final review-fix source commit: `ab2b9f00f5ba3f03f2982130606409a125580bd8`.
Scope: I01–I05, F1–F8, D1–D10 from the owner's complete-repair authorization.
Definitions: FIXED = implemented and checked; VERIFIED-ALREADY-CORRECT =
existing behavior retained with checks; DOCUMENTED = explicit policy, not a
claim that a new feature or blanket certification was implemented.

## Evidence keys

- L: `python3 tools/complete-repair-lifecycle-check.py --out /tmp/micro-complete-final/lifecycle`
  — 383 PASS, 0 FAIL.
- C: `python3 tools/complete-repair-chart-check.py --out /tmp/micro-complete-final/charts`
  — 246 PASS, 0 FAIL.
- M: `python3 tools/complete-repair-mobile-check.py --out /tmp/micro-complete-final/mobile`
  — 55 PASS, 0 FAIL.
- Existing checks and browser limitations: [VERIFICATION-REPORT](VERIFICATION-REPORT.md).
- V: independent visual QA inspected source at 320/360/390/430 RTL and 390
  LTR, plus expanded/error/list/empty states. Temporary screenshots were inspected,
  not committed or presented as durable attachments. DOM checks are complementary,
  not a substitute for native-device testing.

Paths below are repository-relative. “Spec” means the same family's
`specification.md`; full file inventory is in [IMPLEMENTATION-REPORT](IMPLEMENTATION-REPORT.md).

| Item | Status | Exact changed files | Root cause / existing finding | Resolution | Tests and visual evidence | Remaining limitation |
|---|---|---|---|---|---|---|
| I01 | FIXED | `previews/ui-system-showcase/showcase.css` | Global focus-visible added an inner field outline | Exclude field input/textarea only; retain other controls' focus | L, V, field 320/390 comparison | No native keyboard/screen-reader audit |
| I02 | FIXED | `components/info-strip/info-strip.js`, `components/info-strip/info-strip-peek.js`, info-strip spec | Bubbling editing keys triggered slide navigation | Editing/local-interaction guard, modifier/composition/defaultPrevented guard; viewport/control keys retained | L: real caret, textarea/select/option/contenteditable/custom roles, focus/inert | Custom editors must use semantic role or explicit guard attribute |
| I03 | FIXED | `components/info-strip/info-strip-peek.js`, info-strip spec | Anonymous resize listener worked after disconnect | Named listeners removed; disconnected/generation and observer identity guards; rAF canceled; safe re-init | L: resize, hidden reveal, late fonts, multiple instances | Without ResizeObserver, consumer opening at unchanged window width calls init |
| I04 | FIXED | `components/carousel/carousel.js`, carousel spec; `components/info-strip/info-strip-peek.js`, info-strip spec | Observer-only disconnect left active drag/interaction work | Explicit full pause, drag/capture cleanup, no navigation callbacks; dragstart also guarded; init resumes once | L, independent lifecycle review | Deliberate contract tightening: interaction after disconnect now requires init |
| I05 | FIXED | `README.md`, `docs/CURRENT-STATE.md`, `docs/UI-FINAL-HANDOFF.md`, `docs/UI-RELEASE.md`, `tools/README.md` | Current docs incorrectly treated merged baseline repair as unmerged; historical evidence called current | Fresh-baseline/current-report references; retain historical records as historical | Git baseline, links, diff review | Historical reports remain historical, not rerunnable guarantees |
| F1 | FIXED | `previews/ui-system-showcase/showcase.css` | Component frame was intentional; showcase outline was not | Remove accidental layer; preserve 52px geometry/control token | L, V, D1 contrast comparison | A broader field redesign was not authorized or justified |
| F2 | FIXED | `components/info-strip/specification.md`, `previews/ui-system-showcase/index.html` | Standard large spacing used for repeated single readings | Recommend/use existing compact composition; standard remains available | M same-data compact/standard, V | Compact is not a universal card default |
| F3 | FIXED | `components/metric-comparison/specification.md`, `previews/ui-system-showcase/index.html`, `previews/ui-system-showcase/showcase.js` | 144px hero dominated routine comparison | Flat recommended example; explicit hero/compact with identical normal/stress data | M, V | Public default retained for compatibility; consumer chooses semantic priority |
| F4 | FIXED | `components/data/data.js`, data spec | Per-label truncation did not prevent dense collisions | Measured whole-label sampling; protected boundaries/endpoints; full visible rows when needed; optional explicit time coordinates | C 3/7/14/30, Arabic/long/date labels; V dense source readings | Dense long labels may all move to rows, increasing height honestly |
| F5 | FIXED | `components/data/packed-circle.js`, `components/data/PACKED-PATTERN.md`, data spec | Approximate geometry could be overused as precise financial comparison | Remains opt-in; maximum five positive categories; visible refusal plus full text key beyond limit | C, existing packed tests, V | Not a precise comparison; negative values remain text, never positive geometry |
| F6 | FIXED | `components/carousel/carousel.css`, `components/carousel/carousel.js`, carousel spec; `components/info-strip/info-strip-peek.css`, `components/info-strip/info-strip-peek.js`, info-strip spec | Peek spent narrow reading width; direction switch left stale physical transform | Component-width full-slide fallback; single static full-width; engine-owned ancestor direction observation and silent recentering, not a showcase-only workaround | L bare engines at fixed width/root and ancestor changes; M, existing professional check, V | Separate engines; container queries required for adaptive CSS; reparenting uses disconnect/init |
| F7 | VERIFIED-ALREADY-CORRECT | No target-size reduction; usage clarified in carousel/info-strip specs and showcase | 48px hit areas were mistaken for removable visual bulk | Keep 48px; use existing compact dots policy and hide single/empty controls | L/M, professional regression, V | Full dots intentionally take more space when opted in |
| F8 | FIXED | `components/order-schedule/order-schedule.js`, order-schedule spec | Seven 48px targets plus gaps cannot fit narrow root | Existing day screen below actual required width; dates/mode preference/events preserved; exact order-ID focus continuity repaired | M includes two same-day orders and Enter opening second after resize; existing repair check, V | Month overview unavailable while narrow; status remains DRAFT |
| D1 | FIXED | Same as I01; decision recorded in `DECISION-LOG.md` | Need coherent single focus without losing boundary contrast | Retain control border after comparing existing lighter token; isolate showcase | L, rendered 320/390, contrast 3.829 vs 1.284 | Contrast calculation is not full WCAG certification |
| D2 | FIXED | Same as F2 | Density must follow content | Compact small readings; standard/featured only justified content | M/V | No global padding token change |
| D3 | FIXED | Same as F3 | Hero must be explicitly primary | Compatibility default kept; recommended flat and optional compact | M/V identical data | No KPI/primary meaning inferred |
| D4 | FIXED | Same as F5 | Approximate circles require limited purpose | Opt-in small positive set, exact external readings/refusal | C/V | Approximate only |
| D5 | VERIFIED-ALREADY-CORRECT | Existing disclosure kept; `components/data/data.js` adds protected-label rows | Exact readings already had a complete accessible path | Preserve disclosure; visible rows only on measured need, no default always-open duplicate table | C, existing chart/professional checks, V | Large datasets still have a complete disclosure table |
| D6 | FIXED | Same as F4; `tools/complete-repair-chart-check.py` | Data truth and legible labels both required | Sample labels, not points; actual font/width; explicit category/time contract; strict time validation | C including endpoints, boundaries, invalid dates/epochs | No time/period inferred from label text |
| D7 | FIXED | Same as F6; carousel/info-strip specs | 0/1/few/many need distinct policy | Natural empty, static single, optional dots, adaptive peek, full pause lifecycle, static list guidance | L/M, existing regression, V | No autoplay or combined generalized engine |
| D8 | FIXED | Same as F8 | Narrow month targets physically cannot satisfy 48px | Existing day/list alternative, exact selected date, no synthetic selection events, safe focus | M/V | User cannot force undersized month touch targets |
| D9 | DOCUMENTED | `components/data/specification.md`, `components/data/PACKED-PATTERN.md` | Families have intentionally different semantics | Minimum labels/readings/states contract; family APIs preserved; no universal engine | C and source review | Consumers still provide valid units, periods, totals where required |
| D10 | VERIFIED-ALREADY-CORRECT | No changes to `shared/` or `assets/` | Fixed Micro identity | Palette/font/icon assets byte-unchanged against baseline | Git diff, 23-icon builder check | No claim every existing color combination was audited |

No required item is BLOCKED or NOT-APPLICABLE. DOCUMENTED is deliberately
not mislabeled FIXED. This is review readiness for a UI library, not blanket
production/native/accessibility approval.
