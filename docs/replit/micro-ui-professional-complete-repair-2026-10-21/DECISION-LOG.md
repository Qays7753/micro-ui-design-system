# Approved implementation decisions — 2026-10-21

Authorization: the owner's “Complete Micro UI Repair, Verification, and Push”
attachment explicitly approved D1–D10 and full-pause disconnect, one new branch,
commits and push, with no merge or identity change.

| Decision | Selected option | Rejected alternative | Evidence and validation | Trade-off |
|---|---|---|---|---|
| D1 | Fix showcase outline; keep existing field token, 52px minimum and composite ring | Global lighter boundary; removing focus visibility | Real 320/390 RTL comparison: both controls 52px; existing `#71868B` vs white 3.829:1, lighter existing divider `#DCE5E2` 1.284:1. L checks normal/focus/error/error-focus/readonly/disabled and other-control focus | Existing boundary is more visible, but quieter token would weaken recognition. No new color/token |
| D2 | Existing compact for repeated single readings; standard and featured remain intentional | Globally shrink every card | M compares identical data; visual QA confirms compact unavailable/normal reading | Less height without changing every content hierarchy |
| D3 | Public default unchanged; flat recommended comparison, explicit primary hero, compact optional | Automatic semantic/KPI guessing; universal 144px hero | M checks variant source and rendered rows, normal and stress; visual QA RTL/LTR | Consumer chooses purpose; old integrations remain compatible |
| D4 | Opt-in packed circles, ≤5 positive categories, exact external key; visible refusal beyond limit | Delete optional family; use circles for precise signed finance | C checks six-category refusal, zero/negative/unknown/unavailable values; existing area-ratio tests | Intentionally refuses clutter; bars/list required for precision |
| D5 | Keep existing disclosure; visible full rows on measured collision/protected-label need | Always-open large duplicate table; hide complete required values | C checks exact table and visible fallback rows; existing data-state checks | Dense rows can be tall, but no financial loss or forced abbreviation |
| D6 | Actual SVG font/width whole-label selection, protected labels/endpoints; category default and explicit time opt-in | Fixed “five labels,” deleting points, fragment-only labels, assumed equal intervals | C covers 3/7/14/30, long/Arabic/short/irregular periods, fonts/resize, endpoints/boundaries; strict impossible-date/out-of-range/local-time refusal | Some dense charts use full visible reading rows instead of axis text |
| D7 | Separate engines; empty natural message, single full-width static, optional dots with 48px controls, adaptive peek; engine-owned direction recenter | Generalized merged engine, showcase-only direction workaround, autoplay, smaller hit targets, mandatory controls for one card | L bare engines with fixed-width root/inherited direction changes, M, professional/showcase, visual QA | Carousel below 336px; Info Peek ≤280px. Ancestor direction observers cleaned on disconnect; reparenting requires disconnect/init |
| D8 | Actual-root width fallback to existing day view when seven 48px cells plus gaps cannot fit | Overlapping hit areas, false 48px claim, invented scheduling flow, action-only order focus matching | M includes nested widths, two same-day orders and exact-ID Enter after resize; V actual showcase roots 288/328/358/398 | Narrow mode loses simultaneous month overview; list remains available; preferred mode restored when wide |
| D9 | Document minimum concepts and family-specific semantics; no universal API or new runtime | Large shared chart engine or mandatory fields every family does not need | Data specs/source review and C; no new dependency | Some local differences deliberately remain |
| D10 | Identity unchanged | Palette/font/icon/gradient redesign | `git diff 25fed217..HEAD -- shared assets` empty; builder checks 23 local icons | Existing brand constraints preserved; no whole-palette certification |

## Compatibility and lifecycle

I04 deliberately supersedes the historical observer-only contract. After
`MicroCarousel.disconnect` or `MicroInfoPeek.disconnect`, no component navigation,
expansion or keyboard/pointer work resumes until `init`. Active drag is canceled,
capture released, rAF canceled, external resize/motion listeners removed, index
and expansion preserved. DOM listeners are bound once and guarded during pause;
repeated init/disconnect does not multiply them.

Time coordinates are additive opt-in. Existing category charts still use source
ordering. ISO dates represent explicit UTC date boundaries; timestamps require
an offset. Impossible dates and unbounded epochs are refused with full readings,
not silently normalized by `Date.parse`.

Order Schedule retains DRAFT status. No backend, product flow, inferred KPI,
period, total, baseline, status or business rule was added.
