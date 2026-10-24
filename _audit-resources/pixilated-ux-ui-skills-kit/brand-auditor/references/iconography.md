# Brand icons

## Spec (write it into brand.json → icons)
| Property | Default | How the brand decides it |
|---|---|---|
| Grid / live area | 24 / 20 px | keep; pad 2 px on every side |
| Stroke | 1.5 to 2 px at 24 px | match the logo's line weight scaled to 24 px; lighter brands 1.5, sturdy brands 2 |
| Caps / joins | round / round | round terminals in the logo → round; sharp → square cap + miter join |
| Corner radius | 2 px | technical brands 0 to 1, balanced 2, friendly 3 to 4 (heuristic, not a standard) |
| Style | outline | filled only if the brand is bold/solid; never mix outline and filled for the same role (selected state may fill) |
| Colour | currentColor | icons inherit text colour; semantic icons take the semantic colour; never a tinted tile behind |
| Sizes | 16 / 20 / 24 | stroke stays visually equal: 16 px uses the 24 px drawing scaled, stroke adjusted to ~1.5 |
| Metaphors | from the brand's world | a roastery uses bean/bag/scale/kettle before generic sparkles/rockets |

## Keyshapes (for equal visual weight)
Circle Ø20, square 18×18, portrait 16×20, landscape 20×16, centred in the 24 grid. Circles look
smaller than squares at the same size: let round icons touch the 20 px live area, squares stop at 18.

## Normalising existing icons
`icon_normalize.py` rewrites inline `<svg>` icons: sets `stroke-width`, `stroke-linecap`,
`stroke-linejoin`, `fill="none"` (outline style), `stroke="currentColor"`, removes inline colour,
and sets `width/height` to the nearest allowed size. It skips SVGs marked `data-brand-mark`, logos,
charts (`data-brand-chart`) and SVGs with more than 12 shapes (illustrations). Review the result:
some icons drawn as fills (e.g. a dot) need `fill="currentColor"` back; the script keeps fills on
circles with r ≤ 2.

## Drawing a missing icon on spec
1. Start from the base set (e.g. Lucide, ISC licence) if it has the metaphor; restyle to the spec.
2. Otherwise draw on the 24 grid with primitives only (`path`, `circle`, `rect`, `line`), coordinates
   on whole or half pixels, the spec's stroke and radius, no fills unless the style says so.
3. Check at 16 px: if details merge, remove them.
4. Put new icons in one sprite (`<symbol id="i-bean">`) and reference with `<use>`; hand the sprite
   to Design Systems.

## Audit checks (brand_audit.py)
- more than one stroke width among icons of the same size
- mixed linecaps / linejoins
- outline and filled icons mixed for the same role
- icons not using currentColor (hard-coded colours)
- emoji or bitmap icons
- icon sizes off the allowed set
