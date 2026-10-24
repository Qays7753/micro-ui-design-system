# UI designer agent — independent skill report

**Scope:** Hierarchy, grouping, responsive density, chart legibility, and state presentation in this independent UI system. Findings are visual only; no product or source changes were made.

## Method

I applied a component-first visual critique: identify the reading task, compare the rendered hierarchy with that task, inspect the actual responsive crop, then distinguish a component defect from its preview-board container. I used the local preview at 320/360/390/430 CSS px and generated element-level crops instead of inferring chart behavior from a page-top screenshot. The targeted capture script is audit-only; extreme values are injected into the browser DOM and never written back to source. I also read the shared interaction audit for the already-tested quantity/password behaviors rather than repeating its broad sweep.

## Findings

| ID | Result | Visual impact |
|---|---|---|
| `VISUAL-01` | **CONFIRMED**, P2 | The 280×784px narrow buttons-board panel wraps distinct specimens and captions into one heavily framed vertical flow. This is a preview-composition defect, not oversized button geometry. |
| `VISUAL-02` | **CONFIRMED**, P2 | At 430px viewport the carousel exposes only about 24px of a neighbor inside a 342px component viewport, too little to communicate a preview. |
| `VISUAL-03` | **CONFIRMED**, P2 | Stable and draft board labels use the same warning styling, making maturity hierarchy visually ambiguous. |
| `VISUAL-04` | **CONFIRMED**, P2 | Quantitative comparison circles overlap; the foreground disk hides 40.1% of value 25's disk and 35.6% of value 9's disk at 390px. The Venn-like intersection cue contradicts the no-relation caption. |

**Finding count: 4.** Chart axes/legends and fields passed the fixture-level visual checks; circle overlap is a confirmed metric-encoding defect, not a user-preference claim.

## Focused visual checks — chart and field families

| Family | Evidence and measured behavior | Result |
|---|---|---|
| Metric circles | Default 64/25/9 sample viewed at 320/360/390/430; 390px separated layout plus browser-only 10^15 / 0 / −2 / missing state. Exact values remain in external rows; base diameters use magnitude, but overlap hides a large share of two circles. Zero is a 20px hollow state marker; negative sign is textual while its magnitude is used for area, and missing stays textual. | **VISUAL-04 CONFIRMED.** Use disjoint circles only as optional magnitude encoding; aligned linear/table presentation is precision-first. In the huge state −2's magnitude is effectively invisible and the small zero ring can resemble a tiny amount without the key. Keep sign and exact value visible. |
| Main metric comparison | Default 18 hero + 32/9/2 independent bars viewed at all four widths. At 390px, tested a 20-digit hero and rows for 10^12, 0, −450, and unavailable; every value/status remains visible. The 144px hero circle changes to a flat reading block when the value cannot fit. `m-main-metric--flat` also renders the same sample without the circle. | **PASS — no finding.** Raw 20-digit values wrap but are not clipped; consumer locale/grouping remains a data-formatting responsibility. |
| Bar and line charts | 320/360/390/430 crops and DOM geometry reviewed. Four bar values (including zero) and five RTL day labels fit the sample axes. The missing Monday is a visible dash and a true line gap; the path does not bridge it. | **PASS — no finding** for the shown fixtures. |
| Donut / packed bubbles | Donut changes from stacked SVG + legend at 320/360 to side-by-side at 390/430. Visible 25 total and percentages agree with 12/8/5 fixture; 123456789 total remains in a complete outside reading. Bubble sample 90/12/3 is area-scaled; all value/name labels fit. | **PASS — no finding** for the shown fixtures. |
| Zero / unavailable / negative chart states | At 390px, inspected a 0 value, unavailable value, and −2 rejected as invalid for an area chart; repeated at all four widths. Glyph and explicit text states remain distinct. At 320px the longer negative-state label wraps to a second flex row; it stays associated with its marker and does not collide. | **PASS — no finding.** Continue testing dense and longer-label datasets before standardizing a chart default. |
| Quantity/password fields | Targeted crops at 320/360/390/430: quantity value and adjacent ± controls remain in one shell; at 320 the unit wraps beneath, while it stays inline at the wider samples. Password reveal sits inside the same control shell with its icon aligned at the inline start; labels and submit control remain visible. | **PASS — no visual finding.** Main interaction evidence reports quantity stepping and password reveal/remask/focus preservation at all four viewports. |

**Metric future-state recommendation:** For like-for-like analytical comparison, offer the compact linear row/bar or table as the default and keep disjoint circle comparison optional for a shared-scale magnitude read. The current overlap mode should be illustration-only or removed from quantitative comparison: its z-order hides meaningful portions of smaller areas, and a caption cannot undo the overlap cue. Keep exact external readings; never hide the key in huge/zero/negative/missing states. If circles encode absolute magnitude, label the sign explicitly and never let an unlabelled filled disk imply a positive sign; missing remains without area. Keep real supplied data; do not invent fillers. The lavender category is the deliberate series-C data token, not a generic purple-gradient treatment.

## Checked files and artifacts

**Files:** `previews/board-base.css`; `previews/buttons/index.html`; `previews/carousel/index.html`; `components/carousel/carousel.css`; `components/metric-comparison/example-usage.html`; `components/metric-comparison/metric-comparison.css`; `components/metric-comparison/metric-comparison.js`; `components/data/example-usage.html`; `components/data/data.css`; `components/data/data.js`; `components/fields/fields.css`; `previews/fields/index.html`; `previews/concepts/index.html`; `components/access-gateway/access-gateway.css`; `shared/tokens.css`.

**Audit/reference files:** `visual-targeted-captures.py`; latest `interaction-browser-results.json` (88 assertions: 84 pass / 4 fail / 0 runtime errors; the four failures repeat `INT-001`, picker async-error focus/announcement. Quantity/password checks pass at all four widths. The visual crops show no new field-geometry failure); `system-inventory.json`; `system-findings.json`; skill references `technique-index.md`, `catalogue.md`, `notes/batch-01a.md`, `batch-01b.md`, and `batch-09a.md`.

**Viewed evidence:** `visual-buttons-320.jpg`; `visual-carousel-430.jpg`; `visual-chart-bars-320.png`, `visual-chart-bars-360.png`, `visual-chart-bars-zero-390.png`, `visual-chart-bars-430.png`; corresponding line, donut, and bubble crops; `visual-metric-circles-overlap-{320,360,390,430}.png`; `visual-metric-circles-separated-390.png`; `visual-metric-circles-zero-negative-missing-huge-390.png`; `visual-main-comparison-default-{320,360,390,430}.png`; `visual-main-comparison-flat-390.png`; `visual-main-comparison-extreme-states-390.png`; `visual-field-stepper-{320,360,390,430}.png`; `visual-field-password-{320,360,390,430}.png`.

## Limitations

Fixtures are a narrow range, not exhaustive production data: no high-cardinality axes, full set of long labels, locale-specific number formatting, 200% text, contrast audit, WebKit/physical devices, or screen-reader claims. Main audit interaction results are cited, not independently reproduced. Report-owned finding IDs are `VISUAL-01` through `VISUAL-04`; see `../visual-report.md` for full evidence and remediation tests.
