# Decision log — numeric geometry and micro-components

## Authority, branch and scope

- Current request explicitly permits the audit, all confirmed UI repairs,
  verification, logical commits, a single fresh branch push and an unmerged PR.
- Baseline is the freshly fetched remote main `91351b4a23d52c0b1e0f6e6a04c4c631ca1332bd`,
  not the previous task's `25fed217…` baseline. PR #11 was confirmed merged.
- Local main is deliberately unchanged. No merge, autocommit into main, branch
  deletion, second feature branch, history rewrite or force push is permitted.
- Existing families and source/builder architecture stay authoritative. No
  backend, authentication, business rule, screen, new library or asset family
  is introduced. A local UI gateway is not an authentication implementation.

## Selected and rejected approaches

### D-01 — precise reading before perceived area

**Selected:** an always-complete aligned external key for metric-area circles,
with illustration and exact reading clearly distinguished. Keep the squared
area relationship, source order and all nonpositive/missing states. The
precision-first main comparison remains the flat/bar presentation.

**Why:** moving some labels inside and some outside according to diameter
changes the reading pattern as width changes. Preserving valid area encoding
does not justify unstable or duplicate exact readings.

**Rejected:** text forced into small circles; minimum-radius inflation; removing
the specialized family; replacing every metric with the same visual engine.

### D-02 — primary circle is an explicit hierarchy option

**Selected:** retain the standard and compact primary-reading variants, with
visible local captions in the showcase and identical comparison data.

**Why:** the hero's size is not an encoded amount and its primary reading is not
the same data role as the independent bars. The hypothesized same-value
circle-plus-line defect was not present in the inspected current baseline.

**Rejected:** a global deletion of circles based only on an earlier hypothesis,
or a mobile side-by-side variant comparison that compresses the reading.

### D-03 — one visible exact reading in default packed mode

**Selected:** full key owns packed-circle exact values by default; explicit
legend-off keeps the complete alternate inside/external reading path.

**Why:** this reconciles the existing single-source contract and avoids repeating
large values inside a shape and key while smaller values have only a key.

**Rejected:** changing areas, removing the key, silently promoting PROPOSED
packed circles to STABLE, or merging them with metric circles/donut/bubbles.

### D-04 — fit whole labels before invoking safe fallback

**Selected:** position measured endpoint text inward before collision checks.
Keep original line point positions, sampling boundaries, values and meaningful
fallback for dense/long labels.

**Why:** a 0.57px avoidable endpoint overflow caused an otherwise-fitting sparse
chart to lose all plot labels and add roughly116px of reading rows.

**Rejected:** shrinking labels, deleting an endpoint, clipping text, changing
the data scale or globally disabling full-reading fallback.

### D-05 — one field shell, subordinate actions, visible keyboard location

**Selected:** quiet embedded eye/clear/stepper treatment in B02, preserving
48×48 targets and localized focus. Standalone B01 still owns its normal shape
and focus. Keep the already-working whole-shell tap-to-focus behavior.

**Why:** a small field is not a set of equally weighted nested circular cards;
simultaneous B01/B02 rings are accidental duplication. Keyboard users must
still know which of the embedded actions owns focus.

**Rejected:** global button overrides, hiding focus, decorative icon redraws,
smaller targets, changing shared radius/spacing/color tokens, or counting the
26px input text line as the full interaction target.

### D-06 — password editing state is user state

**Selected:** pointer reveal preserves the value, selection/caret and input
focus; keyboard activation keeps focus on the toggle. Fixed accessible toggle
name plus pressed state; retain approved eye asset and visible state styling.

**Why:** changing type without preserving selection disrupted pointer editing.
A changing action label plus pressed state was redundant. An approved eye-off
asset was not available, so one must not be improvised.

**Rejected:** always stealing focus into the input, changing the value or
selection to make the test pass, or copying a different product's icon language.

### D-07 — honest full increments at declared bounds

**Selected:** custom text-field step buttons apply the declared complete step,
or become unavailable/no-op when that increment would exceed min/max.
Manual text remains editable; validation is still consumer-owned.

**Why:** with max99 and step5, silently doing95→99 misrepresents the step.
`min/max/step` on this text input do not establish native number validation.

For an already out-of-range manually typed value, a safe direction may return
to the declared bound; that explicit recovery differs from a partial step
inside the range. Nonempty invalid syntax, unsafe scaled integers and
unsupported decimal precision refuse arithmetic without changing the text.
Empty blocked input stays empty. No arbitrary-precision arithmetic is claimed.

**Rejected:** changing a consumer's max, silently inventing native validation,
converting all amount inputs to type=number or clipping long values.

### D-08 — consistent composition and real touch floor

**Selected:** use the gateway action group consistently, deliberate gap before
submit, and inherit48px B01 targets even for showcase-only tools.

**Why:** a password field and submit previously touched edge-to-edge; the
showcase had compact vs full-width divergence and40px review buttons.

**Rejected:** new global spacing tokens, product-level auth changes or lowering
the shared target rule. The segmented40px visual/48px extended target is a
separate measured contract, not a precedent for unextended40px tools.

### D-09 — single selection focus; preserve semantic differences

**Selected:** keep the existing token shadow on native focus-visible/static
focus; remove the redundant broad focus-within outline.

**Why:** both were applied to the same checkbox box. Switch/radio/segmented,
informational dots, chips, counters and navigation are not interchangeable.

**Rejected:** normalizing all small controls to one silhouette, changing24px
marks or removing the keyboard focus indication.

### D-11 — one clear action and coordinate-honest touch

**Selected:** suppress the UA search cancel only under a field control that
contains the custom clear. Before browser touch-click coordinate adjustment,
check the original touch against an embedded button's actual48px rectangle.
Out-of-target retargeting focuses the input without clear/step/reveal.
Actual button taps and keyboard/synthetic activation remain available.

**Why:** real Chromium touch emulation reproduced two X affordances and
destructive gutter taps even though DOM button/input boxes did not overlap.
The pointer retained x101 while the later compatibility click was moved tox94.

**Rejected:** assuming DOM non-overlap proves a safe touch path, hiding every
native search control globally, removing custom clear events, or treating
emulated touch as physical-device certification.

### D-10 — examples must be correct user-facing examples

**Selected:** remove diagnostic prose from the donut-refusal summary without
removing diagnostic attributes, raw values or the refusal. Correct a tiny
bubble caption's diameter1.04px, preserving radius0.52px and the area formula.

**Why:** UI example text is part of the deliverable; correct engines do not
excuse misleading captions or implementation-ticket strings.

**Rejected:** masking the invalid denominator or increasing tiny-circle geometry.

## Reference inspection and non-copying

The configured GitHub connection was used read-only during audit. Ten visible
repositories were enumerated. `Qays7753/Accounting` was available; Zaman was
not available locally or by repository name through this access.

| Actually inspected source | Applicable lesson | Deliberately not copied |
|---|---|---|
| Accounting main tree `5b7dba2cabe3821a10134412dc1a0e6468a0afbc`; `src/components/ui/AmountInput.jsx`, blob `c8fceeb50853d3597a6b3426f485667c31e193ad` | Plain numeric field, separated label, decimal keyboard hint, LTR/tabular readability and explicit caret-stability intent | Tailwind/runtime, colors/branding/fonts, financial formatting/parser behavior, haptics, product validation or financial flows |
| `src/components/sheets/StrategicInputSheets.jsx`, blob `2fbba3f0b63ec782374819183a64c14869b74181`, relevant input-composition excerpts | Labels and amounts have separate hierarchy; a field need not add decorative geometry | Business data or save actions; no complete repository audit is claimed |
| Zaman | No design conclusion; source unavailable through configured access | No guessed source, screenshots or fabricated reference review |

## Architecture and compatibility

- Keep IBM Plex Arabic/Latin, tokens, approved icon files, status colors,
  semantic data A–E colors and existing surface geometry unchanged.
- Prefer canonical ungrouped `data-value` for numeric truth and display
  attributes for formatted strings. Preserve compatible family-specific
  parsers; do not normalize unrelated contracts in this repair.
- Do not infer denominator, chronology, unavailable value or business KPI.
  Missing, zero, negative, invalid source and loading remain different states.
- Preserve resize/visibility/inert/hover/focus/reduced-motion lifecycle behavior
  fixed in the merged baseline, not just current screenshots.
- Regenerate standalone through its existing builder; never patch generated
  HTML by hand. Keep carousel/schedule DRAFT and packed PROPOSED.
- The root preview redirect is the earlier authorized one-line usability fix
  carried onto the fresh branch, not a new app or a merge of the old branch.

## Evidence standard

Final statuses require actual source inspection and rendered checks. Test
expectations may change only for a documented intentional contract change,
not to hide failing geometry or state behavior. Physical devices, WebKit,
screen readers, native zoom and real safe areas stay explicitly unverified.
