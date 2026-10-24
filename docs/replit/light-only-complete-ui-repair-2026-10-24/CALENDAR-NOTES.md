# Calendar implementation notes — CAL-001 / CAL-002 / PREVIEW-001

## Scope

Implemented only the order-schedule source, its specification and example, the independent focused check, and this note. No backend, persistence, product scheduling behavior, shared styles, showcase code, Dark-mode testing, or Dark-mode repair was added.

## Behavior and selectors

- The root now exposes `data-ocal-layout="date-rail|month-grid|day|list"` and `data-ocal-selected-date="YYYY-MM-DD"`. The selected date and displayed month are separate state.
- At root widths below 360 CSS px, month mode stays month mode and uses `[data-ocal-date-rail]`, a five-date rail with 52px-wide, 72px-high date buttons. At 360px and wider, `[data-ocal-grid]` remains the month interface; the available width yields day targets of at least 48px.
- The month heading is an actionable `[data-ocal-action="month-picker"]` button. It opens `[data-ocal-picker][role="dialog"]`, containing year actions `picker-prev-year` / `picker-next-year`, twelve `picker-month` options (`data-ocal-value="0"` through `"11"`), and `picker-back`.
- Escape, Back, or choosing a month closes the local picker and restores focus to the month heading. Year/month choice does not change the selected date. Bounds are years 1–9999.
- Rail buttons use `[data-ocal-action="date-rail-day"][data-ocal-date]`; grid buttons remain `day-cell`. Both retain the existing `order-schedule:day-select` event detail `{date}` on user selection. Month arrows and picker choices now change only the displayed month/year and emit no day-select event. Explicit Today, day-navigation, and date-selection actions retain their event behavior.
- `setSelectedDate(date)` remains a silent public API operation and synchronizes the displayed month to the supplied date. `setView`, `setCalendarView`, `setData`, loading/error/retry, order, and add APIs remain in place.
- Month keyboard navigation keeps roving focus and does not select; RTL/LTR arrows reverse appropriately. The date rail supports the four arrows plus Home/End for focus-only exploration; Enter/Space selects through native button activation.
- Calendar/list remains a pressed two-option control. Month/day is now one action showing the next available mode (“عرض اليوم” / “عرض الشهر”), reducing equal-weight controls without removing the actual day view.
- The example’s first section heading tracks the root’s `data-ocal-layout`: month grid, nearby-date rail, day view, or list. It no longer claims “month view” while the date rail is shown.

## Verification

Focused command:

```sh
python3 tools/light-calendar-check.py
```

Result: **79 PASS / 0 FAIL**, Playwright with Chromium 152.0.7977.64. The independent test serves the source CSS/JS and a fixed fixture from a temporary local HTTP server; it does not depend on the showcase or a running application, so no application dev proxy is applicable.

Coverage includes the root widths 288/328/358/398 paired with viewport widths 320/360/390/430, each RTL and LTR; layout selection, horizontal overflow, 48px target geometry, live grid/rail resizing and focus restoration, the month/year picker, year changes, selected/displayed-state separation, Escape/Back, 28/29/30/31-day months, December–January, date-rail and grid keyboard navigation, one/many/empty orders, loading/error/retry, existing selection events, the adaptive example heading in rail/day/list modes, and browser/console/resource errors.

Static checks:

```sh
node --check components/order-schedule/order-schedule.js
python3 -m py_compile tools/light-calendar-check.py
git diff --check -- components/order-schedule tools/light-calendar-check.py
```

All completed without errors.

## Before/after visual evidence

The same source-only fixture, viewport/root-size pairings, and directions were captured before the implementation and after it. Eight PNGs per pass (288/320, 328/360, 358/390, 398/430, each RTL/LTR) are stored outside the repository:

- Before: `/tmp/calendar-before/`
- After: `/tmp/calendar-after/`
- Capture command: `python3 tools/light-calendar-check.py --capture-dir /tmp/calendar-after --capture-only`

The baseline capture used the same fixture before changing the component; six narrow captures show the prior auto-day behavior. The after captures show the nearby-date path at narrow roots and preserve the full month grid at 398px. Images are intentionally not committed.

## Assessment and remaining limits

- **Technical:** the checked interaction and geometry contracts pass in the source-only Chromium fixture; no app/backend integration was required.
- **Visual/communication:** the narrow rail keeps nearby dates visible without shrinking targets, and the dedicated local picker makes month/year selection discoverable. The example title now describes the actual layout. This is a visual implementation assessment, not user research or a design approval.
- Not tested: physical touch devices, Safari/WebKit, assistive-technology or screen-reader behavior, native text zoom, safe areas, and real-device layout. No Dark or System-dark tests were run.
