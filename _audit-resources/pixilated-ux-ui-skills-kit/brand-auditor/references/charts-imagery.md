# Charts and images that fit the brand

## Chart palette (brand_palette.py does this)
- **Categorical** (unordered series, ≤ 6): start from the brand's tertiary and extended colours, then
  fill with hues spaced around the wheel at the **same OKLCH lightness and chroma** so no series is
  louder than another. More than 6 series: use labels, small multiples or grouping instead of colours.
- **Sequential** (one measure, low to high): the primary or tertiary ramp, light to dark.
- **Diverging** (real midpoint only, e.g. 0 or target): two brand hues with a neutral middle. If the
  data is good vs bad, use the **semantic** pair (success / error) instead of brand colours.
- **Highlight**: one series in the tertiary accent, everything else in a neutral ramp. Often the most
  on-brand chart of all.
- **Colour-blind safety**: the script simulates deuteranopia and protanopia and warns when two series
  fall within ΔE 0.1. Fix by spacing lightness, not only hue. Avoid red/green pairs except semantic
  up/down with icons or labels.
- **Ink**: axes, gridlines and labels in the profile's secondary/neutral text colours; chart text in
  the brand body font with tabular numbers; straight lines, labelled values, no glow, no gradient fade.
- Mark chart containers `data-brand-chart` so the proportion maths skips them.

## Imagery
Write an **imagery brief** from `brand.json → imagery` before making or choosing any image:
```
IMAGERY BRIEF: <brand> · <placement> (<size, ratio>)
Subject: <the real product / people / place, specific to this screen>
Light: <...>  ·  Colour: <brand palette words>  ·  Composition: <crop, negative space for text>
Treatment: <radius, border, overlay rules>  ·  Avoid: <clichés>
Alt text: <what it shows, in the brand voice>
```
Prompt template for an image generator (only when the session has one and the owner allows it):
```
<subject>, <setting>, <light>, colour palette of <brand colours by name and hex>, <composition with
space for headline on the left>, photographic, natural texture, no text, no logos, no gradients
```
Without a generator: build brand-coloured SVG/CSS illustrations (packaging, product shapes, patterns
from a distinctive asset) and apply the treatment tokens to real screenshots.

## Empty states and illustration
Use the brand's distinctive assets (shape, mascot, pattern) at small scale with one sentence and one
action; never a generic 3D blob or stock illustration.

## Motion
Easing and durations from `brand.json → motion`: calm brands use long gentle ease-out
(`cubic-bezier(.2,0,0,1)`, 200 to 320 ms), energetic brands quicker and springier. Respect
`prefers-reduced-motion` always.
