# Owner-approved visual concept references — 2026-10-25

These two PNG files were supplied by the system owner as visual direction for the next component-level repair pass:

- `calendar-target.png`
- `chart-target.png`

They are reference assets, not production assets and not branding assets.

## How to use these references

Use them as an owner-approved concept direction for information hierarchy, density, grouping, and mobile composition. Do not copy their logo, avatar, external icons, typography, wording, sample data, exact colors, or unrelated product chrome. Rebuild the useful concept using this repository's existing official brand tokens, typography, semantic colors, RTL requirements, component APIs, and domain data.

The reference does not authorize adding an unrelated product shell to the reusable component. For example, a bottom navigation bar, profile avatar, or external application header shown in the reference is not automatically part of `order-schedule` or a chart component. Only the relevant component concept should be adapted.

## Calendar direction

`calendar-target.png` is the owner-approved direction for the Calendar concept:

- a compact, confident mobile calendar with a clear month/year header;
- an obvious view-mode control and readable navigation;
- a complete month grid whose day numbers, event markers, and selected/current-day states are easy to associate;
- compact event indicators that do not collide with adjacent rows;
- a useful events area below the calendar, with readable order/event cards and clear primary action;
- a strong but restrained mobile composition that uses space intelligently instead of making the calendar unnecessarily tall;
- a component that feels native and purposeful while retaining this repository's order-schedule semantics, Arabic RTL support, LTR support, host-owned events, and local-data boundary.

Treat this as the target concept, not as a pixel-copy instruction. The reusable component must provide the appropriate equivalent of the reference's day/week/month control only when those presentations are real, fully implemented, documented, keyboard-accessible, RTL/LTR-safe, and useful for this component. Never add a fake or non-functional tab merely to imitate the image. Do not silently reintroduce a floating thumb-zone Add button or a Bottom Sheet; the current repository contract explicitly excludes them from this Calendar flow.

If the current Calendar anatomy cannot express this concept cleanly, redesign the reusable Calendar contract and implementation, update its specification, isolated example, Showcase, standalone build, and regression tests together. Do not make a Showcase-only visual patch.

## Charts direction

`chart-target.png` is the owner-approved direction for compact, information-dense data visualization:

- compact radial/arc/donut-style compositions may be used where their data semantics support them;
- multiple readings should fit a mobile surface without oversized decorative cards or excessive vertical whitespace;
- the primary value, unit, period, and legend should remain close enough to be understood quickly;
- a chart must preserve a complete text/table fallback and must not force users to estimate values from geometry;
- the concept should be adapted to the repository's official colors, tokens, typography, Arabic/LTR labels, and data semantics.

The image is not permission to convert every dataset into a radial chart. Use the best compact representation for the meaning: bars or a table for exact category comparison, a line for a genuine ordered/time trend, a donut/radial form for a small part-to-whole or progress-like relationship, and compact stat rows for primary values. If an existing chart is not professional, readable, or semantically appropriate on a phone, replace its default/Showcase presentation with the closest clear equivalent and document the decision. Do not preserve an unsuitable chart merely because it already exists.

## Required data-state behavior for every quantitative chart

This is an owner requirement:

1. **No data / absent data**: do not render a misleading empty chart, axes, rings, fake marks, or invented zero. Render a compact, honest no-data state in the chart slot with the repository's existing state semantics. Keep the message and any available action accessible.
2. **Real zero data**: distinguish it from no data. If the data source explicitly contains zero, render a deliberate zero-state in the same component style with a readable `0`/zero label and truthful explanation. Do not silently hide a real zero and do not draw a fake wedge or mark that implies non-zero activity.
3. **Mixed zero and non-zero data**: preserve the zero category in the text/table fallback and use a clear non-geometric representation for zero where a geometry would be invisible. Do not remove categories merely to make the chart look balanced.
4. **Missing/invalid values or invalid scale**: use the existing explicit fallback/data disclosure contract. Preserve the source reading and explain what cannot be drawn.
5. **Every quantitative chart** must provide an explicit, keyboard-accessible control to switch between the visual chart and a complete data table, or between chart and an equivalent full-data view when a table is semantically unsuitable. The table/view must include all categories, values, units, periods, zero states, missing states, and status meanings. The control, label, focus behavior, RTL/LTR order, and responsive layout belong to the reusable chart contract, not only to the Showcase.
6. Do not use a chart/table toggle for purely decorative non-data illustrations. Document why an exception applies.

The no-data/zero distinction and chart/table view must be tested at 320, 360, 390, and 430px in RTL and LTR, with long Arabic and English labels and simulated 200% typography.

## Acceptance principle

The final result should look like this direction in information hierarchy and mobile confidence, but it must remain recognizably this repository's independent design system. The goal is not visual cloning. The goal is a professional, compact, native-feeling reusable component system with correct semantics, honest data states, and deliberate visual identity.
