# Professional UI repair tracker

Source: `ui/native-svg-polish-2026-10-12` at `feb19f0f417307c1e41a5b87f214b51b8f29c727`.
Repair branch: `replit/professional-ui-complete-repair-2026-10-20`.
Preflight: clean tree, verified remote source and absent remote repair branch; `main` unchanged.

These finding IDs refer to the attached professional repair brief, **not** the older showcase repair IDs.

| Finding | Initial source evidence / classification | Intended repair and files | Status / verification |
|---|---|---|---|
| F-01 | packed-circle creates HTML span; CSS only supplies SVG fill. Source defect. | Scoped HTML background and circle radius in packed-circle.css; preserve area and states. | FIXED; computed visible background + area ratio PASS in all 8 cells |
| F-02 | data.js clamps value x but has no numeric collision detection. Source defect. | Measured rendered value boxes; visible compact category/value fallback only when necessary. | FIXED; full 12-digit Latin/Arabic, no overlap/clipping and quiet normal-density plot PASS |
| F-03 | navigation.css flexes all .m-btn including --icon. Source defect. | Exclude icon buttons from growth and stack width. | FIXED; 48×48 normal/stack + long-label geometry PASS |
| F-04 | carousel track flex-start still has tallest child's height. Source defect. | Active slide height plus shadow padding; active ResizeObserver, expansion and fonts. | FIXED; short/long active, expansion/collapse, responsive centering and existing interactions PASS |
| F-05 | Showcase combines arrows, status and dots. Composition recommendation. | Opt-in compact controls in carousel.css/info-strip.css and showcase index; full controls remain available. | IMPLEMENTED; compact controls 48px, hidden redundant dots; full 48px direct targets PASS |
| F-06 | sc-block wraps own-surface components in another surface. Composition issue. | Existing --plain wrapper on surfaces/info-strip/gateway/order-schedule/carousel in index.html. | FIXED; all 8 source showcase cells have centered peek/no page overflow |
| F-07 | BAR_LABEL_STEP=40 and X_LABEL_STEP=37. Source density recommendation. | Actual SVG ink/line box + Micro 4px gap, font readiness and responsive refit. | IMPLEMENTED; measured normal step 23px, enlarged-text line separation PASS |
| F-08 | Default info-card padding 24/gap20/amount scale. Opt-in recommendation. | Documented --compact in info-strip.css; showcase opts in for simple readings. | IMPLEMENTED; default retained; measured 136→100px for fixture, long/missing states PASS |
| F-09 | Main circle 144px intentionally default. Optional recommendation. | Opt-in --flat in metric-comparison.css and fitHero guard; demonstrate both variants. | IMPLEMENTED; default circle preserved, flat uses existing DOM/API; long/zero/negative/missing/invalid text PASS |
| F-10 | MicroData.disconnect only scans descendants. Lifecycle defect. | Include matching root and descendants; guard stale observer/font callbacks. | FIXED; root/container disconnect and 3 re-init cycles + deferred font callback PASS |
| F-11 | MicroFields.init only scans descendants; duplicate guard already exists. Lifecycle defect. | Include matching root; preserve binding guard and field behavior. | FIXED; root/container, duplicate guard, min/max/step, locked/clear/count/message/focus PASS |
| F-12 | Metric comparison fallback window listener has no cleanup API. Lifecycle defect. | Minimal disconnect(root), observer/listener/reference/flag cleanup; explicit init/render reattach. | FIXED; real observer and controlled fallback, 3 cycles and delayed fonts PASS |
| F-13 | sc-surface-stage .m-surface min-height 240px. Composition issue. | Natural stage by default; --comparison explicit showcase-only mode in showcase.css. | FIXED; source Surface untouched, all 8 stage checks PASS |
| F-14 | CURRENT-STATE refers to main and historical test numbers. Documentation defect. | Separate repair reports and current-state pointer; commit/content/date/engine/matrix binding. | IMPLEMENTED; see implementation and verification reports |

Initial commands: deterministic standalone check PASS. Browser suite initially NOT RUN (missing Playwright package/browser; then bundled Chromium missing Nix shared libraries). Existing system Chromium is available; checks now use a portable system/bundled browser selector, not a different UI stack.

Evidence and exact commands/results will be recorded in VERIFICATION-REPORT.md. Screenshots and machine reports belong under ignored generated-artifacts/, not source history. No claim of real-device certification.

Reproduction: `python3 tools/professional-ui-repair-check.py --tag before` against untouched component sources at the source SHA produced **17 PASS / 128 FAIL**, with loaded IBM Plex fonts and zero console/resource errors. The focused suite was subsequently expanded with lifecycle, fallback, full-control, enlarged-text and source-showcase cases; final expanded suite is **278 PASS / 0 FAIL**, so the two totals are intentionally not compared as identical test inventories.

Each confirmed defect was inspected in source before modification. The initial fixture measured missing packed backgrounds, overlapping 12-digit readings, actionbar icon stretching, and an 834px viewport around a 58px active slide. Exact geometry, viewport/direction and source identity are in the before/after JSON evidence. No finding was deferred. Real-device and non-Chromium certification remain explicitly outside this repair's evidence.
