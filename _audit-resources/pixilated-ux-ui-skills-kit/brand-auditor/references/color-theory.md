# Colour theory for brand UI

## 70 / 20 / 10
The owner's rule for every screen: of the brand-coloured area, about **70% primary** (the dominant
field), **20% secondary** (supporting), **10% tertiary** (accent). It's the UI cousin of 60-30-10;
treat it as a target with ±10 points of tolerance, measured on the rendered screen.

How the share is measured (`brand_audit.py`): every pixel of the 1440 px screenshot is mapped to the
nearest profile colour in OKLab (ΔE ≤ 0.08). Pixels matching a **semantic** colour, pixels inside
`<img>`, `<video>`, `<canvas>` and chart areas marked `data-brand-chart`, and pixels matching no colour
are excluded. Neutrals count toward the role their `counts_as` says. Tints and shades from a role's own ramp
(steps 100 to 900) count toward that role, so a light cardamom selected state is tertiary. Result: primary / secondary /
tertiary %, plus "off-palette %" (pixels that match nothing, a drift signal).

Typical UI mapping (from practice; adjust per brand):
| Role | Lives in | Typical fixes when off target |
|---|---|---|
| Primary 70 | page canvas, large surfaces, cards | too low: surfaces are white/grey not in the profile → retint to the brand base or add the neutral to the profile |
| Secondary 20 | ink, dark surfaces (sidebar, header, footer, hero band), illustrations | too low (common on white UIs): move it onto one large surface (sidebar or header) or a hero band; too high: lighten panels |
| Tertiary 10 | primary actions, focus, selection, key highlights | too high: accent used for decoration, icons, borders → pull back to actions; too low: CTAs are grey/black → use the accent for the one primary action per section |

Don't hit the numbers by painting meaningless areas. On white product UIs the tertiary often lands
at 3 to 6% when it's used only for actions: that is acceptable inside tolerance. Raise it with
meaningful surfaces (selected rows and nav in the tertiary-50 tint, the active tab, the hero chart's
highlight series, focus rings), never with decoration. Move colour onto surfaces that carry hierarchy
(navigation, the hero module, the primary action).

## Semantic beats brand
- `error`, `success`, `warning`, `info` come from the profile's `semantic` set and are never replaced
  by brand colours, in components, charts (loss/gain) and copy styling.
- If the brand's own palette contains a red/green/amber close to a semantic colour (ΔE < 0.12), that
  brand colour may not be used for decoration on the same screen as status UI; flag it.
- Status is never colour-only: icon + word + colour.
- Semantic areas are excluded from the 70/20/10 maths.

## Accessibility of brand colours
- Text: 4.5:1 (normal), 3:1 (large ≥ 24 px or ≥ 18.7 px bold); UI parts and focus rings 3:1.
- If a brand colour fails as text, create a text-safe variant from its ramp (usually 600 or 700) and
  name it (`tertiary-text`). Never change the brand hex itself; add the variant to the profile.
- Dark mode: raise the accent to its 300/400 step, keep surfaces 4 to 6% apart in lightness.

## Ramps and harmony
- Ramps in OKLCH, steps 50 to 950, keep hue, vary L (and slightly C). `brand_palette.py` builds them.
- Harmony check: secondary and tertiary should differ clearly in lightness or hue from the primary so
  the hierarchy holds in greyscale (squint test).
