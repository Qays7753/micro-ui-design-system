# brand.json: schema and how to derive it

The profile is the single source of truth for the audit and the scripts. Keep it short and
specific. Mark anything you inferred with `"derived": true` so the owner can confirm it.

```json
{
  "name": "Qahwa Club",
  "source": ["Brand guidelines v1 (PDF)", "qahwaclub.sa landing page"],
  "colors": {
    "primary":   {"hex": "#F3F1EC", "name": "Milk",     "role": "dominant field: page and large surfaces", "share": 70},
    "secondary": {"hex": "#1E1714", "name": "Espresso", "role": "supporting: ink, dark surfaces, sidebar", "share": 20},
    "tertiary":  {"hex": "#1F6B55", "name": "Cardamom", "role": "accent: primary action, focus, selection", "share": 10},
    "extended":  [{"hex": "#C49A6C", "name": "Kraft", "role": "packaging, illustration, data"}],
    "neutrals":  [{"hex": "#FFFFFF", "counts_as": "primary"}, {"hex": "#E7E5E0", "counts_as": "primary"}, {"hex": "#5C5850", "counts_as": "secondary"}],
    "semantic":  {"error": "#B42318", "success": "#17703A", "warning": "#9A5B00", "info": "#3B5BDB"},
    "tolerance": 10
  },
  "type": {
    "display": {"family": "Bricolage Grotesque", "weights": [700], "source": "Google Fonts"},
    "body":    {"family": "Bricolage Grotesque", "weights": [400, 600], "source": "Google Fonts"},
    "mono":    {"family": null, "use": "tabular-nums of the body face instead"},
    "arabic":  {"family": "IBM Plex Sans Arabic", "weights": [400, 600]},
    "scale":   [12, 13, 14, 16, 20, 26, 33, 42, 53]
  },
  "icons": {
    "style": "outline", "grid": 24, "live_area": 20, "stroke": 1.75, "linecap": "round", "linejoin": "round",
    "corner_radius": 2, "fill": "none", "color": "currentColor", "sizes": [16, 20, 24],
    "metaphors": "objects from the roastery: bean, bag, cup, scale, kettle, courier box",
    "base_set": "Lucide (ISC), restyled to the spec"
  },
  "radius": {"control": 10, "card": 20, "pill": 999},
  "voice": {
    "pillars": ["Plain like a roaster talking", "Proud of the craft, never boastful", "Calm and exact about money and time"],
    "nng": {"humor": "serious", "formality": "casual", "respect": "respectful", "enthusiasm": "matter-of-fact"},
    "say": ["roast", "origin", "box", "bags", "Sunday", "Riyadh"],
    "avoid": ["premium", "artisanal", "curated", "experience", "journey", "elevate", "!"],
    "examples": {"good": "Roasted Sunday, at your door Monday.", "bad": "Elevate your coffee journey!"}
  },
  "imagery": {
    "kind": "product and packaging close-ups; hands at work in the roastery",
    "light": "soft daylight, warm white balance", "palette": "milk, kraft, espresso, a touch of cardamom",
    "treatment": "radius 20, no filters, no gradient overlays", "avoid": "stock baristas, latte art clichés, 3D blobs"
  },
  "motion": {"personality": "calm", "easing": "cubic-bezier(.2,0,0,1)", "durations": [120, 200, 320]},
  "logo": {"min_px": 24, "clear_space": "height of the bean mark", "placements": ["sidebar top", "nav left"]},
  "distinctive_assets": ["the bean-in-bag mark", "kraft bag with roast-date label", "Arabic قهوة beside the name"],
  "deviations": []
}
```

## Deriving a missing profile
1. **Colours.** Take the logo and the strongest touchpoint (site, packaging). Cluster the dominant
   colours (`brand_audit.py --extract` prints the computed palette by area). Assign roles by intended
   area, not by saturation: the colour that should own large surfaces is primary, the supporting one
   secondary, the action colour tertiary. Keep semantic colours separate.
2. **Type.** Read the fonts the logo/site actually load (`document.fonts`). If the brand only has a
   logotype, choose one text family that echoes its construction (geometric, grotesque, humanist,
   serif) and note it as derived.
3. **Icons.** Match stroke to the logo's line weight at 24 px; caps and corner radius from the logo
   terminals (round terminals → round caps, sharp → square/miter).
4. **Voice.** Collect 20+ real strings from the brand's own channels; place it on the four NN/g
   dimensions; extract the words it really uses.
5. **Distinctive assets.** List the non-name cues people recognise the brand by (a colour, a shape,
   a character, a pattern, a sound). Romaniuk's Fame × Uniqueness grid: assets both famous and unique
   are "use or lose"; unique but unknown are "invest"; famous but generic are "avoid".
