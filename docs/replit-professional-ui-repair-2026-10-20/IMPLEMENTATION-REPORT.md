# Professional Micro UI repair — implementation

Date: 2026-10-20. Scope: reusable **UI only**, not product UX, auth, persistence, network or production screens.

## Repository and revision

- Repository: https://github.com/Qays7753/micro-ui-design-system
- Verified source: `ui/native-svg-polish-2026-10-12`
- Source SHA: `feb19f0f417307c1e41a5b87f214b51b8f29c727`
- Repair: `replit/professional-ui-complete-repair-2026-10-20`
- Final repair implementation SHA: `7ab7c4a5be93fca2218cfe35106fc7310bead0aa`. A documentation-only commit follows to bind this already-committed revision; it does not change the tested source fingerprint.
- GitHub delivery: pending correction of the existing source-control connection's authentication. A dry-run was rejected with “Invalid username or token”; no remote repair branch or PR is claimed yet.
- Main baseline preserved: `a27ff0fd22a488175b55f502ba6df082a7c4fd48`.

The remote source was verified with `git ls-remote` before fetching. The tree was clean. The repair branch was absent remotely and created from the verified source head. No force-push, reset, clean, main modification or automatic merge was used.

## Findings and exact changes

| ID | Status | Implementation |
|---|---|---|
| F-01 | FIXED | packed-circle.css paints HTML spans using the existing category background and circle-radius token. SVG bubbles and area math unchanged. |
| F-02 | FIXED | data.js measures rendered numeric ink rectangles, including bounds and pairwise collisions. When necessary, redundant plotted readings are replaced by visible compact `dl` category/value rows. Raw data and semantic disclosure table remain. Optional `data-display` supports full Arabic presentation without altering magnitude. |
| F-03 | FIXED | navigation.css flexes text actions only. Icon actions keep the existing 48px square in normal and stack layouts. |
| F-04 | FIXED | carousel.js measures active-slide height plus track shadow padding. Updates on selection, expansion, loaded fonts, responsive width and active-content ResizeObserver changes. One observer watches the viewport and active slide; disconnect/re-init safely removes/re-attaches it. |
| F-05 | IMPLEMENTED | Explicit `data-controls="compact"` hides redundant optional dots in carousel/info-strip while retaining 48px arrows, status/live region and keyboard access. Full mode with all direct targets remains available by omitting compact or using full. Showcase opts in. |
| F-06 | FIXED | Showcase uses existing sc-block--plain composition for own-surface families: surfaces, info-strip, gateway, order schedule and carousel. No component surface was changed to solve composition. |
| F-07 | IMPLEMENTED | Fixed 40/37px line steps replaced by measured SVG ink/line box plus a Micro 4px gap, without reducing font size. Actual normal fixture step is 23px; font-ready/responsive refits and full-label accessibility remain. |
| F-08 | IMPLEMENTED | Opt-in m-info-card--compact uses existing padding/gap/amount tokens. Existing default unchanged; showcase opts into compact for simple readings. |
| F-09 | IMPLEMENTED | Optional m-main-metric--flat uses the same hero DOM and API, without a circular surface; fitHero bypasses circle fitting only for flat. Default 144px circle and compact variant retained. Both are demonstrated. |
| F-10 | FIXED | MicroData.disconnect includes a matching root and descendants. Weak-set/observer-identity guards prevent stale resize or font-ready callbacks from reconnecting it; explicit init/render can reconnect. |
| F-11 | FIXED | MicroFields.init includes the root field and retains the duplicate binding guard. Existing count/clear/stepper/message/focus/locked contracts preserved. |
| F-12 | FIXED | MicroMetricComparison.disconnect includes matching roots/descendants, disconnects observer or removes the fallback resize listener, deletes references/width and clears readiness flags. Re-init and render remain supported, including deferred font cleanup. |
| F-13 | FIXED | Removed default 240px stage assumption from showcase CSS. Explicit sc-surface-stage--comparison retains a comparison-only stage when requested. Surface source untouched. |
| F-14 | IMPLEMENTED | Current-state documentation points to this repair separately from historical evidence, with exact command results, matrix, content fingerprint, source identity and limitations. |

**Deferred findings: none.** Optional recommendations F-08/F-09 were implemented as opt-ins, not global redesigns. Carousel remains DRAFT and packed-circle remains PROPOSED.

## Changed source and contracts

- `components/data/`: data.js, data.css, packed-circle.css, specification.md, PACKED-PATTERN.md.
- `components/navigation/`: navigation.css, specification.md.
- `components/fields/`: fields.js, specification.md.
- `components/carousel/`: carousel.js, carousel.css, specification.md.
- `components/info-strip/`: info-strip.css, specification.md.
- `components/metric-comparison/`: metric-comparison.js, metric-comparison.css, specification.md.
- `previews/ui-system-showcase/`: index.html, showcase.css, and generator-produced standalone.html.
- `tools/`: professional-ui-repair-check.py, browser_support.py, and the five existing browser checks updated to select available system Chromium or the bundled browser. Existing showcase checks now write to generated-artifacts rather than overwrite historical evidence.
- Documentation: CURRENT-STATE.md and the three repair reports.
- Output exclusions: `.gitignore` and `.replitignore`.

No change to `shared/tokens.css`, fonts, icons, assets, data math or palette. No new gradients or decorative shadows. Flat is opt-in; default cards and circle remain. Active carousel height updates are measured immediately rather than animating through a clipped active reading.

## Benchmark review

Official references were fetched on 2026-10-20. They informed evaluation, not a replacement identity:

- [Android accessibility](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views): separates visible icon size from touch target; Android states 48dp. Micro's existing contract remains **48 CSS px**, not a claim that CSS px equals dp on a device.
- [Material cards](https://developer.android.com/develop/ui/compose/components/card): cards group related content. Applied by removing unnecessary outer showcase surfaces, not copying Material styling.
- [Apple charts](https://developer.apple.com/design/human-interface-guidelines/charts): clear labels/context, appropriate visual weight and familiar readings. Full important values remain visible without decorative repetition.
- [Apple layout](https://developer.apple.com/design/human-interface-guidelines/layout): scanning hierarchy and accommodation of larger text; measured line spacing, wrapping and content-driven height.
- [Samsung basic layout](https://developer.samsung.com/one-ui/layout/basic.html) and [typography/accessibility](https://developer.samsung.com/one-ui/accessibility/layout-and-typo.html): reviewed scalable text and touch spacing. No Samsung viewing-area geometry or visual identity was copied.
- [Carbon simple charts](https://www.carbondesignsystem.com/building-blocks/data-visualization/simple-charts) and [spatial charts](https://www.carbondesignsystem.com/building-blocks/data-visualization/spatial-charts): reviewed mark/area semantics. Micro's packed comparison is not claimed to implement Carbon's hierarchical circle pack; its existing independent-area semantics are preserved.
- [SAP cards](https://www.sap.com/design-system/fiori-design-android/v25-4/components/cards-and-layouts/cards-overview) and [carousel](https://www.sap.com/design-system/fiori-design-ios/v26-1/components/cards-and-layouts/carousel-layout): reviewed related-content grouping and different card content sizes. No product navigation journeys were added.
- MDN [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll) confirms descendant selection; matching-root inclusion must be explicit. [ResizeObserver.disconnect](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/disconnect) informed lifecycle cleanup, with separate window-listener cleanup.

The measured 23px line step, 100px compact-card fixture and immediate height policy are Micro engineering choices/measurements, not external platform standards.

## Limitations

Chromium headless evidence only. No real Android/iOS devices, Safari/WebKit, real touch, TalkBack/VoiceOver, physical safe areas, phone keyboard or native zoom certification. Enlarged text is a CSS simulation. Info-strip remains an Arabic RTL component; LTR screenshots are comparison evidence, **not a new product-support promise**.
