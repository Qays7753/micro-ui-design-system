# Calendar Concept Reference — Mobile Expand/Collapse and Agenda

## Provenance and usage boundary

These five PNGs were extracted from the user-provided screen recording `1000145971.mp4` on 2026-10-24. They are **concept references only**. They are not a request to copy Samsung Calendar, its brand, colors, typography, icons, spacing, exact layout, text, or proprietary visual language.

Use them to understand the interaction model and information hierarchy:

- A month view can expand to preserve broad date context.
- The same surface can collapse into a selected-day agenda without losing month context.
- A selected day can expose appointments/events below the grid.
- A small, restrained marker can indicate that a day contains data.
- The selected day itself is the entry point for creating, editing, or deleting an item.
- Creation can use a focused in-page editor with progressive disclosure; no floating thumb-zone button or Bottom Sheet is part of this requested flow.

The implementation must remain an independent Micro UI Design System component and must use this repository's existing brand tokens, typography, icons, spacing, radii, semantic states, and Light-only boundary. Do not add Samsung colors, logos, icons, names, text, or a visual clone.

## Reference frames

| Frame | State | What to study | What not to copy |
| --- | --- | --- | --- |
| `01-full-month.png` | Full month | Seven-column month context, selected day, restrained event indication, bottom creation affordance | Exact typography, red weekend color, Samsung iconography, exact pill shape, exact text |
| `02-collapsed-agenda.png` | Collapsed month + agenda | Month context remains visible while the selected day opens an agenda below; event time and title become readable | Exact row geometry, exact event color, exact empty space, exact animation curve |
| `03-expanded-month.png` | Expanded month with selected day | The calendar can return to a broad month view while retaining the selected-day context | Exact selection outline, exact vertical proportions, exact product chrome |
| `04-add-bottom-sheet.png` | Reference form hierarchy | Title-first entry, date/time, optional fields, and keyboard-aware focus are useful form ideas only | Do not copy the bottom-sheet placement, Samsung keyboard, segmented-control styling, proprietary icons, exact field layout, or exact terminology |
| `05-reminder-form.png` | Reference form hierarchy | A lighter form can expose date, time, reminder, recurrence, and sound options progressively | Do not copy the sheet interaction, exact reminder terminology, purple/blue colors, exact control styling, or proprietary semantics |

## Required concept for this repository

### 1. Two coordinated Calendar presentations

Implement a real two-state presentation, not two unrelated screens:

- **Expanded month:** a full seven-column month grid with all dates available, current/selected state, concise indicators, and no long event text forced into day cells.
- **Collapsed agenda:** the month context compresses smoothly and the selected day’s agenda becomes the readable primary content below it. The selected day remains visually connected to the compressed month.

The state must be represented explicitly in the component contract, for example with a view state such as `expanded` and `agenda`, while preserving the existing separation between `monthCursor` and `selectedDate`. Do not reintroduce the removed five-day Date Rail.

### 2. Interaction model

The component must support:

- Tap a day inside the Calendar: update selection, preserve month context, and reveal the selected-day action surface in the page itself. This is the primary entry point for the day actions.
- The selected-day action surface must expose only contextually valid actions, such as Add, Edit, and Delete. It must not be a generic overflow menu and must not invent actions when the day has no item.
- Tap an event/order: emit the existing host-owned open event.
- Tap Add/Edit/Delete from the selected-day action surface: open an in-page editor or dedicated state owned by the host/Showcase demo. Do not use a thumb-zone floating button as the entry point.
- When the Calendar is collapsed, the space below the compact month remains a deliberate contextual disclosure area. Tapping that area reveals the items belonging to the selected day; it must not reveal items from another day and must not require a separate floating button.
- Expand/collapse: support a clear button and, if touch gestures are implemented, vertical drag/swipe with a stable threshold and no accidental month navigation.
- Horizontal month navigation: keep it separate from vertical expand/collapse so gestures do not conflict.
- Keyboard operation: provide an equivalent control path; do not rely on touch gestures alone.
- Back/Escape: close the in-page editor/action state first, then restore the underlying Calendar state without losing selection.
- Resize and direction changes: preserve the selected date and focus while supporting RTL and LTR according to the component contract.

Do not add gesture code merely because the reference video has gestures. Add it only if it is robust, testable, and does not compete with page scrolling or horizontal month navigation. Do not add a floating bottom Add control merely because the reference video contains one.

### 3. Day-cell information hierarchy

A day cell should remain quiet and scannable on a phone:

1. Day number is primary.
2. Today and selected states are unmistakable and token-based.
3. Data presence is represented by a small, bounded marker system.
4. A count may be shown when it is meaningful and fits without clipping.
5. Long titles, notes, and times belong in the selected-day agenda, not inside every month cell.

Recommended marker contract:

- At most three semantic markers per day.
- Markers are not the only meaning channel; the agenda/list repeats their meaning in text.
- Unknown or missing status remains explicit and is never invented from color.
- Marker colors come from semantic data/state tokens, not arbitrary new colors.
- Markers must not be reused as redundant decorative dots inside status chips.
- Accessible labels expose the date, count, and summarized status to assistive technology.

### 4. Dashboard use case

The Calendar is a reusable scheduling surface for a lightweight dashboard:

- View the month and identify days with orders.
- Select a date and review its orders below.
- Add a request/order/note for that date.
- Open an existing item.
- Show empty, loading, error, and retry states honestly.

The component remains data-agnostic and host-owned:

- It renders data passed by the host.
- It emits `day-select`, `order-open`, and `add-request` events.
- It does not invent a backend, persistence layer, account model, or business workflow.
- Showcase may provide a clearly labelled local demo state that visually proves adding a request/note, but it must not imply real persistence.

### 5. In-page contextual action and editor direction

The requested flow is intentionally **not** a thumb-zone floating button and **not** a Bottom Sheet. The day cell is the entry point, and the selected-day area owns the actions:

- Tap a day and expose a clear, in-flow action region for Add, Edit, and Delete.
- Add is available when the host allows creation; Edit/Delete are available only for the selected item(s).
- If the host needs a longer form, use a dedicated in-page state or an explicitly host-owned route. Do not silently introduce a sheet.
- Keep focus and keyboard behavior correct, with a stable return to the selected day.
- Keep title first and disclose secondary fields progressively, using the existing Fields and navigation contracts.
- Provide clear Save/Cancel semantics and honest loading/error states.
- When the collapsed agenda area is tapped, reveal the selected day’s items in place; do not change the selected date as a side effect.

The two form screenshots above are references for information hierarchy only. They are not permission to hard-code a Samsung-like form, bottom sheet, keyboard, or product-specific fields without a host contract.

## Brand and visual rules

- Use the repository’s existing Petrol, terracotta Brand Accent, data colors, typography, radii, and spacing tokens.
- Terracotta remains a limited, deliberate accent; it must not become the Calendar’s general fill or selection color.
- Do not change logo assets.
- Do not introduce a new palette merely to resemble the reference.
- The selected/today/focus/error/success roles remain semantically distinct.
- The visual result should feel native, calm, dense, and professional, but visibly belong to this independent system.

## Required Z AI review output

Before declaring the Calendar complete, provide:

1. A written state model for expanded month, collapsed agenda, selected day, empty day, loading, error, and Add flow.
2. A component/API decision explaining which behavior is reusable and which is Showcase-only.
3. Visual evidence at 320, 360, 390, and 430 CSS px in RTL and LTR.
4. Evidence for expanded and collapsed states, day selection, markers, the selected-day action surface, tap-to-reveal agenda content, in-page Add/Edit/Delete states, keyboard-visible layout if an editor exists, Escape/Cancel restoration, and no document overflow.
5. A statement of which reference behaviors were adopted conceptually and which were deliberately not copied.
6. Updated Calendar specification, catalog, tests, standalone output, and release report.

The acceptance criterion is not “looks like Samsung.” It is: **a coherent, touch-friendly, keyboard-accessible, reusable scheduling UI that preserves month context, makes the selected day legible, uses the day itself as the action entry point, reveals the selected day’s items from the collapsed contextual area, supports a professional in-page add/review/edit/delete flow, and visibly belongs to this repository’s identity.**
