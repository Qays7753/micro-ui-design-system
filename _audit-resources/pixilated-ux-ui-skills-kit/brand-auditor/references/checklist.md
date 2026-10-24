# Brand consistency checklist (visual pass)

Score each line pass / half / fail on the clean screenshot and across screens.

**Colour**
- [ ] 70/20/10 within ±10 (from the script)
- [ ] every colour traces to a profile token; no near-duplicates (#1F6B55 and #1E6A54)
- [ ] semantic colours untouched; status = icon + word + colour
- [ ] brand colours used as text pass contrast (text-safe variants where needed)

**Type**
- [ ] only brand families render (no silent fallback); roles mapped (display/body/mono/Arabic)
- [ ] brand scale and weights; numbers tabular in data

**Icons**
- [ ] one stroke, one cap/join style, one style (outline/filled) per role, currentColor
- [ ] metaphors from the brand's world; no emoji, no generic sparkles/rockets

**Logo and distinctive assets**
- [ ] logo at ≥ minimum size, clear space respected, not stretched, recoloured only to approved variants
- [ ] at least one distinctive asset beyond the logo appears where it adds meaning (not decoration)
- [ ] the brand is recognisable with the logo covered (cover test)

**Voice**
- [ ] tone within 1 point of target on all four dimensions
- [ ] say/avoid words respected; one name per concept; sentence case; no dashes

**Charts and imagery**
- [ ] chart tokens applied; highlight/semantic rules; colour-blind check passed
- [ ] images follow the imagery brief; treatments consistent; alt text in voice

**Consistency across screens**
- [ ] same component looks the same everywhere (buttons, cards, inputs, tables)
- [ ] same radii, shadows and spacing tokens; marketing visuals match the real UI
- [ ] motion easing and durations match the brand's personality; reduced motion respected
- [ ] Arabic/RTL: Arabic brand face, mirrored icons where directional

**Governance**
- [ ] approved deviations written in `brand.json → deviations` with a reason, so they aren't re-flagged
