# Fix recipes

Replace, don't decorate. Each recipe keeps function and accessibility. Values are defaults; an
existing design system's tokens win.

## Owner non-negotiables
**O1 Accent stripe.** Delete the side border / `::before` bar. If the stripe was carrying state
(an error row), show the state with the words and one semantic signal: a coloured status word or a
coloured icon (no tile). For a whole problem row, a very light semantic background tint on the row is
allowed (e.g. `#FDEDEB` at full row width), never a stripe.

**O2 Bordered non-interactive block.** Remove `border` / the `0 0 0 1px` ring. Separate with space,
or give it a fill one neutral step off the page (`#F7F7F5` on white, `#FFFFFF` on `#F7F7F5`), radius
kept. A light shadow alone is fine for a raised surface on a tinted canvas. Inputs, buttons, selectable
cards, the selected item and focus rings keep their strokes.

**O3 Dashes.** Rewrite, don't swap symbols blindly:
| Before | After |
|---|---|
| "Fast — and free" | "Fast and free" / "Fast. And free." |
| "9:00–17:00", "SAR 25 – 50" | "9:00 to 17:00", "SAR 25 to 50" |
| "Haraz — Yemen" | "Haraz, Yemen" |
| Table cell "—" | "None", "Not set", "Paused", or leave the cell empty |
| "Step 1 - Roast" | "Step 1: Roast" or two lines |
In code, the text node changes; CSS `content: "—"` changes too.

**O4 Button padding.** Use one scale:
| Size | Height | Padding-inline | Font | Radius |
|---|---|---|---|---|
| sm | 32 px | 12 px | 13 px | 8 px |
| md | 40 px | 16 px | 14 px | 10 px |
| lg | 48 px | 20 to 24 px | 16 px | 12 px |
Icon + label gap 8 px; the icon side gets 2 px less padding than the text side for optical balance.
Icon-only: square (32/40/48) with an `aria-label` and a tooltip. Set `height` (not padding-block) so
labels don't change the height; `white-space: nowrap`; never `width: 100%` unless it's the only action
in a narrow column. On touch layouts the hit area is ≥ 44 px even when the visual is 32 px.

**O5 Icon tile.** Remove the background, size and radius on the wrapper. Put the icon inline before the
text at 16 to 20 px, `color: currentColor` (or the one semantic colour when it carries state), aligned
to the first line (`margin-top: 2px` for 20 px icons next to 14 px text). If there's a list of such
items, align the text column, not the icons.

**O6 Dot in a chip.** Delete the dot (`::before`, `.dot`, "●"). Default states become plain text in
the secondary text colour, no chip at all. States that need attention keep a chip with the word in the
semantic colour and a light semantic tint (`color:#B42318; background:#FDEDEB`), or a meaningful icon
(alert, pause) inline before the word. Sync/online indicators become words ("Synced 2 min ago").
Legends in charts keep swatches (square, 8 to 10 px, matching the series).

## Others (short)
- **V1 Nested cards**: keep the outer surface, turn inner cards into rows divided by space or one rule.
- **V2/V3 Shadows**: one shadow token for raised overlays only (menus, panels, toasts); cards on a
  tinted canvas get a fill step, not a shadow.
- **V4 Glass**: only on overlays above content (menus, sheets, sticky bars). Static cards get a solid fill.
- **V5 Gradient text**: solid text colour; emphasis by size or weight.
- **V6 Glow**: delete. If the hero needs focus, enlarge the real product visual.
- **K1/K2 Purple**: derive the accent from the product's world (materials, brand). One accent, used for
  action and focus only.
- **K4 Contrast**: secondary text ≥ 4.5:1 on its real background; check on the canvas and on cards.
- **T1 Default font**: keep if it's the brand's; otherwise choose a face from the subject's world.
- **T2 Accent word**: remove the italic/colour; let size carry the headline.
- **T3 Eyebrow**: delete; if it carried real information (date, category), fold it into the heading or
  a plain sentence-case meta line.
- **T4 Mono**: main font for labels and buttons; mono only for codes, IDs and tabular numbers.
- **I1 Emoji**: one icon set (Lucide / Phosphor / Feather) at one stroke width, or no icon.
- **I3 Initial avatars**: neutral grey initials or a real photo; no gradients, no random colours.
- **L2 Three feature cards**: show the product doing the three things (one screenshot with callouts),
  or a plain list with real detail.
- **L3 01/02/03**: remove unless it's a real sequence; then use a timeline or an ordered list.
- **L4 KPI cards**: one compact row with column rules, labels and units, colour only on what needs action.
- **B1 Primaries**: one filled button per section; the rest ghost or text links.
- **D3 Status colours**: default state neutral grey; colour only the states that need action.
- **D5 Greeting**: replace with the date and one status line that says what needs attention.
- **M1/M2 Motion**: one orchestrated moment; content visible at rest; respect reduced motion.
- **C2 to C16 Copy**: shorter, specific, sentence case, digits, the user's words. Delete unverifiable proof
  instead of rewording it.
