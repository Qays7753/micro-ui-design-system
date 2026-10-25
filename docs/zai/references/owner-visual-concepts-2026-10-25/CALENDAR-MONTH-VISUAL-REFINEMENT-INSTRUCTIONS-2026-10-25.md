# Calendar (Month view) — Visual Refinement Instructions

**Target:** the existing Micro orders-calendar screen (mobile, RTL, 360×780 reference; must hold at 320–430px).
**Goal:** raise the visual quality to the level of the reference mock (`calendar.html`) while keeping Micro's identity: cream canvas, petrol primary, IBM Plex Sans Arabic, Lucide icons, edge-to-edge bottom navigation.

## 0. Ground rules

1. This is a **presentation-only** task. Do not change data models, order logic, routes, storage, or export formats. Do not rename props or services.
2. Use **only the repo's existing semantic tokens** (`brand`, `brand-tint`, `brand-ink`, `on-brand`, `canvas`, `surface`, `sunken`, `ink-primary`, `ink-strong`, `ink-secondary`, `ink-tertiary`, `ink-disabled`, `divider`, `divider-strong`, `positive`, `positive-tint`, `warning`, `warning-tint`, `info`, `info-tint`, `danger`, `danger-tint`). Never hardcode hex. Do not introduce new colors, radii, or spacing values.
3. `calendar.html` is a **geometry and hierarchy reference only**. Where it conflicts with this document (glow effects, shadows, floating bottom nav, violet accent, 56px rows, radii 8/14/20), **this document wins**.
4. Allowed spacing: 2, 4, 8, 12, 16, 24, 32, 40. Allowed radii: 6 (sm), 12 (md), 16 (lg), 24 (xl), 999 (full), 0 (nav).
5. Typography: IBM Plex Sans Arabic, weights 400/500/600 only, `font-variant-numeric: tabular-nums lining-nums`, Latin digits 0–9. **Arabic text is never below 14px.** Wrap every number/date in `<bdi>` (or equivalent isolation).
6. RTL: use logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-*`), never `left/right`. Weeks start on Sunday at the inline-start (right). Do not reverse arrays manually; let `direction: rtl` lay out the grid.
7. Light mode only. No glow, no `box-shadow` on controls, no gradients.

## 1. The one principle behind every fix

The current screen gives every element the same visual weight (border + fill + shadow). Fix it with hierarchy:

- **One** filled brand surface per viewport: the "إضافة طلب" button.
- Selection and active states use **`brand-tint` + `brand-ink`**, never a filled `brand`.
- Containers get **one** edge treatment (hairline border **or** nothing), never border + shadow.
- Cell geometry is **fixed**; it never depends on whether a day has events.
- Secondary controls are **borderless** (icon or text buttons with 44px hit areas).

## 2. Screen structure (top → bottom) and exact specs

Vertical rhythm at 360px (side padding 16 everywhere):

| Block | Height | Gap below |
|---|---|---|
| Top zone | 56 | 8 |
| View switcher | 48 | 12 |
| Month navigator | 44 | 8 |
| Calendar card (5 rows) | ≈318 | 24 |
| Section header | 44 | 12 |
| Order cards | 76 each | 8 |
| Bottom nav | 64 + safe-area | — |

### 2.1 Top zone
- Integrated into the page: **no background strip, no bottom divider**, same `canvas` as the page.
- Title "الطلبات": 22px / 600 / `ink-primary`, at inline-start.
- Avatar at inline-end: 40px circle, **no ring/border**, 44×44 hit area. Opens the existing profile/settings list.

### 2.2 View switcher (يوم / أسبوع / شهر)
- **One** container, not three buttons: `sunken` background, `radius-lg` (16), padding 4, height 48, three equal segments (`grid-template-columns: repeat(3, 1fr)`).
- Segment: height 40, `radius-md` (12), text 15px / 500 / `ink-secondary`, no border.
- Active segment: `brand-tint` background, `brand-ink` text, weight 600. **Not** filled `brand`.
- Transition: background 120ms standard curve; none under reduced motion.
- ARIA: `role="tablist"` / `role="tab"` / `aria-selected`.

### 2.3 Month navigator
- Single row, height 44, no boxes around any control.
- Inline-start: month label as **month name + year**, e.g. "تشرين الأول 2026" (Jordanian month names). Month name 17px / 600 / `ink-primary`; year 17px / 400 / `ink-secondary`. Delete the "10 / 2026" numeric format and the small dropdown chevron (unless it opens a real month picker; if so use a 20px chevron-down, `ink-secondary`, inside the same 44px hit area as the label).
- Inline-end group, in this order: "اليوم" text button, previous chevron, next chevron.
  - "اليوم": no border, no fill, 14px / 500 / `ink-strong`, min 44px hit area. **Render only when the selected date or visible month is not today.**
  - Chevrons: Lucide `chevron-right` / `chevron-left` 24px, `ink-secondary`, 44×44, no border. Previous points toward inline-start (right in RTL). They are directional, so they follow RTL; do not flip them with global CSS.
- Press feedback on all three: 8% `ink-primary` overlay, 80ms.

### 2.4 Calendar card
- `surface` background, `radius-lg` (16), **1px `divider` border, no shadow**, `overflow: hidden`.
- **No inner grid lines at all** (the SOP caps visible dividers at 3 per screen). Rhythm comes from spacing.
- Weekday row: height 36, 14px / 500 / `ink-secondary`, centered, 7 equal columns. Labels: أحد، إثن، ثلا، أرب، خمي، جمع، سبت.
- Day grid: CSS Grid `repeat(7, 1fr)`; rows = `ceil((offset + daysInMonth) / 7)` (5 or 6). Each cell is a `<button>` with `min-height: 48`, `display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px`.
- **Cell anatomy (fixed, identical for every cell):**
  1. Number chip: 32w × 28h, `radius-md` (12), number 15px / 500 / `ink-primary`, centered.
  2. Dots slot: **always rendered**, height 6px, `display: flex; gap: 4px; justify-content: center`. When a day has no events the slot stays empty but keeps its height. **This is the fix for the number baseline jumping between cells.**
- **Dots:** 6px circles, solid fill, no ring, no glow. One dot per *distinct status* on that day, max 3, ordered قيد التنفيذ → بانتظار العميل → تم التسليم. Colors: `info` = قيد التنفيذ, `warning` = بانتظار العميل, `positive` = تم التسليم.
- **States:**
  - Outside current month: number `ink-disabled`, dots at 40% opacity. Tapping navigates to that month and selects the day.
  - Today (not selected): number weight 600, chip gets a 1px `divider-strong` ring.
  - Selected: chip background `brand-tint`, number `brand-ink`, weight 600. **The cell itself is never filled.** Dots keep their own colors (no white rings, no outlines).
  - Selected + today: selected style plus weight 600 (no ring).
  - Pressed: 8% `ink-primary` overlay on the chip only, 80ms.
  - Focus-visible: 2px outline `ink-strong`, offset 2.
- Accessibility: each cell `aria-label="٧ تشرين الأول، طلبان"` pattern (day, month, event count), `aria-pressed` on the selected cell.
- **Legend** lives **inside the card, at the bottom**, padding 12 16, no divider above it: three items in one flex row (`gap: 16`, `flex-wrap: wrap`), each a 6px dot + label 14px / 400 / `ink-secondary` (gap 8). Same order and colors as the dots. Remove the legend that currently floats outside the card.

### 2.5 Section header
- One row, height 44, `align-items: center`.
- Inline-start: "طلبات اليوم" 17px / 600 / `ink-primary`, followed 8px later by the count as a plain number, 15px / 400 / `ink-secondary` (replaces the floating "طلبان" text).
- If the selected date is not today: title becomes "طلبات 07/10/2026" (DD/MM/YYYY, `<bdi>`).
- Inline-end: **"إضافة طلب"** button, height 44, padding-inline 16, `radius-md` (12), `brand` fill, `on-brand` text 16px / 500, Lucide `plus` 20px, gap 8. **This is the only filled brand surface on the screen.** Pressed: 8% overlay.

### 2.6 Order card (replaces the current card)
Remove the circular edit and delete buttons from the card face.

- Card: `surface`, `radius-lg` (16), 1px `divider` border, no shadow, padding 12 16, **min-height 76**, whole card is one tappable `<button>`/link opening the order details (where edit and delete already live or will live; if details has no delete yet, keep delete reachable there, with a confirm dialog).
- Layout: `grid-template-columns: 1fr 20px`, `column-gap: 12`; content column + a 20px directional Lucide chevron (`chevron-left` in RTL, `ink-tertiary`), vertically centered.
- Content column, two rows with `row-gap: 4`:
  - Row 1: order title (inline-start, 16px / 500 / `ink-primary`, single line, ellipsis) and time at inline-end (`09:00`, 15px / 500 / `ink-strong`, tabular-nums, `<bdi>`). **No clock icon, no tinted chip around the time.**
  - Row 2: client name (inline-start, 14px / 400 / `ink-secondary`, ellipsis) and the status badge at inline-end.
- Status badge: 13px / 500, padding 2 8, `radius-sm` (6), text color = semantic ink, background = semantic tint (`info-tint` / `warning-tint` / `positive-tint`). Text only. The label carries the meaning; color is secondary.
- Pressed: 8% overlay. Cards sit 8px apart.
- Empty day: a single line "لا توجد طلبات" 15px / 400 / `ink-secondary`, centered, padding 24 16. No illustration.

### 2.7 Bottom navigation
- Keep it **edge-to-edge**, `radius-none`, `surface` background, 1px `divider` on top, height 64 + `env(safe-area-inset-bottom)`. **Do not** make it a floating pill.
- 4 items, equal width, icon 24px + label 13px / 500 below (gap 4).
- Active item: `brand-tint` rounded background (`radius-md` 12, inset 8px from the item edges), `brand-ink` icon and label, weight 600. Inactive: `ink-secondary`.
- Replace the التقارير icon (up arrow reads as "upload") with Lucide `chart-column` (or `bar-chart-3` depending on the installed Lucide version).
- Content scroll container gets `padding-bottom: 64px + safe-area + 16px` so the last card clears the nav.

## 3. Motion
Press 80ms, state changes 120ms, month change 200ms (fade only, no slide). No bounce, no count-up. Respect `prefers-reduced-motion`.

## 4. Before → after map (what each rule fixes)

| Problem seen in the current screen | Rule |
|---|---|
| Day numbers sit at different heights | Fixed cell anatomy; dots slot always reserved (2.4) |
| Selected day is a dark filled cell; dots become touching rings | Tint chip only; solid 6px dots with 4px gap (2.4) |
| Grid lines on every cell + card border + shadow + header line | No inner lines; card border only; header strip removed (2.1, 2.4) |
| 3 filled petrol surfaces above the fold | Only "إضافة طلب" is filled (2.2, 2.4, 2.5) |
| 7 boxed controls before the calendar | One segmented container; borderless navigator controls (2.2, 2.3) |
| "10 / 2026" label | Month name + year (2.3) |
| ~12px weekday labels and legend | 14px minimum (2.4) |
| Legend disconnected from the card | Legend inside the card (2.4) |
| Two bordered circle buttons + red bin on every card | Whole card tappable, actions in details (2.6) |
| Time chip looks like a status | Time is plain text; status is the only badge (2.6) |
| Orders start below the fold | Fold budget (section 2 table) and acceptance test 5.1 |
| Up-arrow icon for reports | `chart-column` (2.7) |

## 5. Acceptance checklist (verify with rendered screenshots, not by reading code)

1. At **360×780** with a 5-row month (and also with a 6-row month), the **first order card is fully visible** above the bottom nav.
2. All day numbers in a row share the same baseline whether or not the day has events.
3. Visible filled-brand surfaces in the viewport: **1**. Visible dividers/hairlines: **≤3** (calendar card border, order card borders and nav top line count as surfaces, not as inner grid lines; there must be no grid lines inside the calendar).
4. No `box-shadow`, `text-shadow`, or `filter: drop-shadow` anywhere on this screen.
5. Widths 320 / 360 / 390 / 430: no horizontal overflow; long Arabic titles ellipsize without pushing the time or chevron.
6. Text scale 130% and 200%: cells grow via `min-height`, nothing is clipped, dots slot stays visible.
7. Every tappable element ≥44×44; focus-visible outline present; selected/active states exposed to assistive tech.
8. No raw hex, no new radii, no spacing outside the allowed scale. If the repo includes `scripts/micro_visual_guard_scan.py`, run it and fix any finding it reports for this screen.
9. Switching to dark mode on the device does not change the screen.
10. Report back with: the screenshots at 360×780 and 320×640, the list of files changed, and any rule above you could not apply with the reason.