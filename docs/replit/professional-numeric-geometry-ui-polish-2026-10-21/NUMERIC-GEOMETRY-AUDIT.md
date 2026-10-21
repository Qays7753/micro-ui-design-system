# System-wide numeric geometry and micro-component audit

## Baseline and method

Fresh fetched `origin/main`: `91351b4a23d52c0b1e0f6e6a04c4c631ca1332bd`.
PR #11 is merged at that SHA, verified with the configured GitHub connection.
New branch: `replit/professional-numeric-geometry-ui-polish-2026-10-21`,
created once from that remote head. Local `main` remains
`25fed21790f2c1e78b25e925edc62e9b76825d2e`; it was not updated or edited.
The earlier local preview-entry change remains on its original branch; its
one-line redirect is deliberately carried forward here, not lost or merged.

Four specialist read-only audits preceded source edits: numeric hierarchy,
chart/data semantics, mobile fields, and RTL/accessibility/micro-components.
Each inspected source and real Chromium 152.0.7977.64 rendering, including
actual screenshots. This is a full-family audit with representative rendered
states, not a claim of exhaustive combinatorial/platform coverage.

Viewport and **component width are different**. In the showcase, the circle
component measured 256/326px at 320/390px viewports; a concepts card measured
252/314px. The schedule root measured 288/358px at those viewports and correctly
used day view. Measurements below describe the unmodified fetched baseline.

## Findings and explicit nonissues

| ID / severity | Source and rendered context | Measured before-state and semantic purpose | Root cause / layer | Selected repair or preservation | Rejected alternative / rationale |
|---|---|---|---|---|---|
| NG-01 / P2 | `components/metric-comparison/metric-comparison.js` and `.css`; `previews/concepts/index.html`, showcase circle specimen | 64/25/9, component 252px: diameters 110/68.8/41.3; at 314px: 141/88.1/52.9. Middle reading moves inside/outside with width, smallest shape has only external key | Per-item text-fit creates unstable label mapping; component presentation | Complete aligned external exact-reading key, independent of diameter; retain optional area illustration and its ratio math | Do not force text into tiny circles or delete the specialized family. Exact comparison leads with list/bars, not perceived area |
| NG-02 / P3 | `previews/ui-system-showcase/index.html`, three main-metric specimens | At 320/256px: flat≈370, hero≈440, compact≈260px; same source repeats over ≈1070px without local visible variant headings | Showcase comparison composition | Visible captions for flat, explicit primary and compact; keep identical datasets and mobile stack | Side-by-side phone layout compresses reading; hiding data would undermine comparison |
| NG-03 / nonissue | `components/metric-comparison/metric-comparison.*`, concepts and showcase | Hero 144×144 and full-width 256px tracks; compact 89.6px hero with 154.4px rows. Primary 18 differs semantically from independent comparisons | Hierarchy circle is not scaled data; labels/spec distinguish roles | Preserve explicit primary hero; flat remains recommended when comparative readings dominate | No actual same-value circle-plus-line duplicate found. Removing every circle would erase a legitimate hierarchy option |
| NG-04 / nonissue | `components/info-strip/info-strip.css`, `components/data/data.css`, `components/carousel/carousel.css` | Secondary numbers 22/32 and units 14/22 share baselines. Stress 99,999,999.99 uses151.8px in252px reading area. Navigation targets48×48 | Correct component typography and composition | Preserve LTR-isolated readings, baseline units, compact cards and single card shell | Do not shrink all cards or wrap every reading in another surface |
| CH-01 / P2 | `components/data/data.js`, line in `components/data/example-usage.html` | At plots288/350px, السبت33.14px centered at W−24 ends at W−7.43; only0.57px beyond W−8 label boundary triggers five20px fallback rows (~116px) | Endpoint label placement, not point/data geometry | Inward-place measured whole endpoint labels before conflict testing; retain fallback for real conflicts | No font shrink, clipped endpoint or removed point/value |
| CH-02 / P2 | `components/data/packed-circle.js`, `components/data/PACKED-PATTERN.md`; showcase proposed example | Components256/326px:117.5/92.4/44.3px circles; 84,300 and52,100 repeat inside and full key, 12,000 only in key | In-circle text plus legend contradicts single visible reading contract | Default full key owns exact values; legend-off retains complete inside/external path | Do not change valid area math or remove both readings; remains PROPOSED/opt-in |
| CH-03 / P2 | `previews/data/index.html`, donut overflow summary | At chart232/302px the short refusal is followed by visible fallback/data-scale-detail/R8-07a diagnostics | Consumer summary leaks implementation notes | User-facing context only; retain diagnostic attributes and honest source refusal | Do not bury diagnostics in component's visible error |
| CH-04 / P3 | `previews/data/index.html`, tiny bubble example | Value0.01/max100/Rmax52 produces radius0.52, diameter1.04px; caption called0.52 diameter | Incorrect example arithmetic, not renderer | Correct caption to diameter1.04px | A forced minimum bubble would distort area |
| MFA-01 / P2 | `components/fields/fields.css`, B01 button styles, gateway and stepper consumers | Password shell232/302×52 with48×48 reveal; keyboard focus shows B01 ring plus B02 focus-within shell ring. Circular bordered actions compete inside same frame | Independent focus/chrome systems on nested controls; visibility remains, but hierarchy is noisy | Quiet embedded-action geometry and one localized visible focus treatment; preserve standalone B01 rings and48px targets | Do not hide keyboard focus or shrink hit targets; field-only changes belong in B02, not shared tokens |
| MFA-02 / P1 | `components/access-gateway/access-gateway.js`, real gateway pointer reveal | Value retained but selection[5,9] became[0,0], input focus lost. Keyboard Enter retained selection and button focus; target geometry unchanged | Type mutation without preserving pointer editing state | Preserve value/selection/caret and pointer input focus; keyboard retains action focus | Keeping value alone is insufficient; do not always force keyboard focus back into input |
| MFA-03 / P3 | Gateway JS, example and showcase | aria-pressed plus changing show/hide action name; eye glyph unchanged, no approved eye-off asset | Redundant toggle semantics / inconsistent state language | Fixed toggle name with pressed state; use approved existing eye and visible pressed treatment | No improvised slash/eye-off icon or new icon family |
| MFA-04 / P2 | `components/fields/fields.js`; quantity min0/max99/step5 | 98→99 and95→99 yield partial +1/+4, not declared+5. 320px specimen shell186×52, actions48×48 | Add-then-clamp custom step algorithm | Full-step/no-partial boundary policy, unavailable/no-op if candidate exceeds bound; explicit decimal and locked-state tests | Do not change max to100 or silently claim native number validation for a text input |
| MFA-05 / P2 | `components/access-gateway/access-gateway.css`, local example and showcase | Local password302×52 ends at y301.94 where submit302×48 begins. Showcase358×52 meets compact77.6×48 submit with no gap | Normal block form and divergent consumer action grouping | Deliberate form-group spacing; matching actions/full-width submit composition | No global spacing-token change or authentication workflow |
| RTL-A11Y-01 / P2 | `components/selection/selection.css`, source selection preview | Choice label196.9×48 with24×24 box simultaneously shows token shadow and2px outline at2px offset | focus-visible shadow plus broad focus-within outline | One keyboard/static-preview shadow, no redundant outline | Do not enlarge checkbox or retain both ring mechanisms |
| SC-01 / P2 | `previews/ui-system-showcase/showcase.css`, `.sc-tools .m-btn` | Nine review controls are40px high at320/360/390; ten at430 after wrapping. No extended hit-area mechanism | Consumer-only min-height40 override | Remove override, inherit B01 real48px minimum | Do not lower the system target policy because controls are demonstration tools |
| PV-01 / usability | `tools/preview-server.py` | Root of fetched main redirects to library index, not current interactive showcase | Preview entry configuration; earlier user-requested local fix not in merged baseline | Carry one-line showcase redirect forward while keeping library index accessible explicitly | No new app or product screen; no cherry-pick/merge of unrelated branch history |
| RAW-01 / documentation | Data/metric source parsers and examples | Data source is canonical ungrouped; metric additionally accepts grouped display-like strings/Unicode minus. No current consumer failure | Separate historical parser contracts | Document canonical raw input/display separation, preserve family-specific accepted compatibility | A global normalization migration is not justified by a hypothetical defect |
| MFA-06 / P2 / post-review | `components/fields/fields.css/.js`, source/showcase search | At320RTL, custom clear x49–97 and input x105–243 leave8px gutter. Chromium touch atx101 was retargeted to clear (pointerx101, later clickx94), deleting text. Native search cancel was also visible; tappingx112 cleared outside custom event contract | Native and custom affordances duplicate; browser touch retargeting bypasses shell-tap intent | Suppress UA cancel only when custom clear exists. Capture original touch coordinates and turn out-of-button retargeted taps into input focus; preserve genuine48px-button/keyboard activation | Do not globally remove native clear or shrink targets. A DOM rectangle non-overlap assertion alone cannot test touch retargeting |

Post-implementation extension of MFA-02: a backwards selection[2,7] returned
with direction `forward`; preserve direction as well as range. Extension of
MFA-04: 9007199254740992+5 became9007199254740996; an extreme decimal became
`NaN`. The independent final reviewer additionally reproduced `NaN`→5 and
`12oops`→17. Complete nonempty numeric syntax and safe scaled-integer arithmetic
are now required for stepping; unsupported text remains intact and editable,
with unavailable step actions. These are UI arithmetic protections, not new
consumer validation/business rules.

## Complete-family coverage and intentional distinctions

| Family / actual inspected source | Rendered coverage and role | Opinion / disposition |
|---|---|---|
| Buttons — `components/buttons/buttons.css/.js` | `/previews/buttons/`,320RTL; icon48×48, text≥48 | Existing primary/secondary/danger/loading/disabled semantics remain. Standalone action chrome is intentionally stronger than an embedded field action |
| Fields — `components/fields/fields.css/.js` | Source/showcase320/360/390/430RTL; long15-digit amount, readonly/disabled,200% text | Fix MFA-01/04. Inner text line26px is not the hit target: existing whole52px shell correctly forwards a blank-area tap without resetting a tap on text |
| Selection — `components/selection/selection.css/.js`, picker CSS/JS | Selection320RTL/390LTR; choice48h, switch label48h, track52×32/thumb24 | Fix duplicate choice focus; preserve radio/check/switch/segmented/picker semantics. Segmented visual40px has documented ±4px pseudo hit extension to48 and inter-row gap |
| Organization — `components/organization/organization.css/.js` |320RTL: long row232×118, badge80.1×24, counter23.8×20 | Informational markers not actions; values wrap, counters expand. No speculative resizing |
| Navigation — `components/navigation/navigation.css/.js` |320RTL/390LTR: icons48, tabs48h, navbar items58/75.5×52 | Logical back/more, tab scrolling, wrapped labels and selected treatments intentionally distinct |
| Messages — `components/messages/messages.css/.js` |320RTL; note232×98 and close48×48. At390/200% note348×427.9; no document overflow | Preserve labeled loading,24px spinner, non-color error/success. Rotated spinner bounding box is not its nominal layout size |
| Surfaces — `components/surfaces/surfaces.css`, `curves.css` | Approved curve example390RTL:362×270 | Decorative surface role is justified, not a template for inputs/buttons. No control defect found |
| Data — `components/data/data.css/.js`, packed source |320/390RTL, declared state/refusal examples | CH-01–04. Bars retain zero baseline; line keeps declared ordering/time; donut parts-of-whole needs denominator; bubbles/packed encode relative area, not precise ranking |
| Info Strip — `components/info-strip/*` | Source/concepts/showcase320/390, compact readings and peek | NG-04 retained;48px navigation, natural cards, previous pause/inert lifecycle fixes not repeated |
| Metric Comparison — `components/metric-comparison/*` |320/390RTL,390LTR, separated/overlap and flat/hero/compact | NG-01/02 repairs; NG-03 primary distinction retained; precise comparisons use aligned readings/bars |
| Carousel — `components/carousel/*` | Showcase all filter320/390; component288/358 | One card shell; existing narrow full-width/count/48px/inert/full-pause behaviors retained; DRAFT unchanged |
| Account Settings — `components/account-settings/*` | Dialog280/350px, rows73h, icon tiles/control48; switch label240×48 at320 | No confirmed defect in source composition. Decorative48px icon tile is not itself an action |
| Access Gateway — `components/access-gateway/*` |320/360/390/430RTL,390LTR, pointer/keyboard reveal and200% sample | MFA-01/02/03/05 repairs; stays local UI demonstration, no backend/auth changes |
| Order Schedule — `components/order-schedule/*` |320RTL/390LTR, roots288/358 use day; controls48, row256×74 | Existing actual-width fallback/focus identity retained; do not regress to historical undersized month grid. DRAFT unchanged |

## Cross-component consistency matrix

| Repeated pattern | Unify / keep separate / justified exception | Reason and selected layer |
|---|---|---|
| Field eye, clear, plus/minus | Unify quiet field-action chrome,48px target and nonduplicated localized focus | Same embedded role and same field frame; B02-local rule, no global B01 suppression |
| Standalone icon actions, back, close, previous/next | Keep common48px action contract; retain standalone visible shape | Action semantics independent of a field; avoid forcing the field treatment onto navigation |
| Checkbox/radio focus and static focus preview | Unify one focus mechanism | Duplicate outline+shadow is accidental, not a semantic distinction |
| Segmented40px visible option vs48px target | Keep justified visual/interaction distinction | Measured pseudo target with row spacing; not equivalent to unextended40px showcase tools |
| Switch, toggle, radio, segmented, content tabs | Keep separate | Boolean, temporary, exclusive and navigation semantics differ; identical silhouette would mislead |
| Badge dots6px vs schedule legend/status8px | Keep justified exception | Different density/semantic contexts; no shared defect evidence |
| Badge/counter/unit chip vs action chip/button | Keep separate | Noninteractive metadata must not look like an independently actionable control |
| Secondary numeric readings/units | Preserve22/32 and14/22 baseline language, numeric LTR isolation | Consistent info/stat/card reading hierarchy already supported by rendered evidence |
| Main primary circle vs metric area circles vs bubbles vs donut vs packed | Keep separate contracts | Hierarchy is not area, relative area is not part-of-whole, category magnitude is not temporal trend |
| Exact reading repeated inside circle and key | Default one external complete source; opt-out contract explicit | Prevent duplicate visual emphasis; retain every value and state |
| Chart labels, full reading rows and disclosure | Same truth requirement, different fallback mechanisms | Nudge fitting labels; only fall back on actual measured conflicts, never delete points |
| Spinner, zero marker, missing-state marker and status icon | Keep distinct roles and labels | Decorative spinning24px, signed zero baseline, unknown/unavailable reading and status cues are not interchangeable |
| Nested surfaces | Preserve one justified card/dialog/field frame | Remove embedded competing chrome, not every existing card or informative container |
| Review-only tools and consumer examples | Same target/accessibility floor, honest specimen captions | Being a demonstration does not justify40px touch targets or diagnostic prose in user-facing examples |

## Hypothesis disposition

Three-circle reading consistency and field embedded-action hierarchy were real
problems. A same-value circle-plus-line defect was **not** found in the inspected
current main; explicit primary/independent-bar semantics are defensible.
Circle area calculations and zero/negative/missing text paths were correct.
Additional confirmed issues were endpoint-overeager fallback, packed duplicate
readings, diagnostic example prose, incorrect diameter caption, selection's
duplicate focus, off-grid partial steps and missing form-action spacing.

“Native-quality” here means coherent geometry, clear hierarchy and reliable
editing, not copied iOS/Material styling. Loading remains a labeled progress
pattern; there is no invented chart-loading state or inferred business KPI.

## Reference evidence

Configured access exposed `Qays7753/Accounting`; recursive main tree
`5b7dba2cabe3821a10134412dc1a0e6468a0afbc` was actually inspected.
`src/components/ui/AmountInput.jsx` (blob
`c8fceeb50853d3597a6b3426f485667c31e193ad`) uses a plain field, decimal
keyboard hint, numeric LTR/tabular reading and explicit caret-stability intent.
Relevant input composition in `src/components/sheets/StrategicInputSheets.jsx`
was read as context. Lesson: separate number readability from decorative
geometry and preserve editing state. No color, font, haptic, amount formatting,
validation, financial rule or product flow was copied.

No local Zaman source and no Zaman-named repository appeared among the ten
repositories exposed by the existing configured access. It was not inspected;
no claim about its design is made, and no random reference URL was invented.

## Limits

Initial evidence includes sampled focus, pointer/keyboard, enlarged text and
RTL/LTR; not every family/state combination was rendered in this initial audit.
Final focused and existing checks are recorded separately. Desktop Chromium
does not establish physical iOS/Android, WebKit/Safari, real touch, native zoom,
safe-area behavior or TalkBack/VoiceOver support. Temporary captures are not
durable links or committed screenshots.
