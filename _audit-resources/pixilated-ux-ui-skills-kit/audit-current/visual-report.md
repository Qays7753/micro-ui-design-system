# Visual audit — UI density, hierarchy and future direction

**Prefix:** `VISUAL`  
**Scope:** Visual engineering and future-state recommendations for this independent UI/UX design-system repository. Fixtures and showcase content are demo data only; no user behavior, analytics, persona, or production use is inferred. The future Micro product was not opened, contacted, cloned, or compared. No product/source/spec/showcase/configuration file was changed.

## Scope and bounded verdict

Reviewed source geometry and visible browser output across representative component previews at 320, 360, 390, and 430 CSS px. Screenshots listed below were actually opened and visually inspected; the rendered UI is RTL Arabic. Measurements are browser CSS-pixel measurements, not physical device measurements. This is a **partial visual workstream handoff**, not the parent audit's full repository or all-skill verdict. The main agent's route/state sweep remains authoritative for broader viewport coverage.

**Verdict (visual track only): ACCEPT WITH CHANGES.** The system has a recognisable, coherent visual direction: warm near-ivory ground, deep petrol action color, local IBM Plex families with Arabic support, restrained semantic color, 48px targets, and distinct field/surface radii. Actual previews read as intentional rather than generic. Four confirmed visual issues require direction: review-board framing, carousel edge-peek usefulness, maturity badge semantics, and the overlapping metric-circle default. This does not certify accessibility, native behavior, product fit, or all component states.

## Direction assessment

The existing direction documented in `docs/UI-VISUAL-SYSTEM.md:6-27` is a **quiet operational RTL system**: light, content-led, petrol-forward, compact enough for real information, with cards reserved for distinct units. That is a credible and visually identifiable base, and the previews substantiate its palette/type/radius choices. I treat the direction as an existing hypothesis, not as a locked owner-approved brief: the source itself says the rules do not claim separate owner approval (`docs/UI-VISUAL-SYSTEM.md:10`).

The design-direction method's intake is not a reason to invent a marketing hero, footer, photography, or consumer flows in this library. For this system, the decisions that need owner resolution are the component's default carousel presentation, board maturity cues, and whether overlapping circles should appear in quantitative comparison. Recommendation: preserve the petrol/ivory/Arabic-first direction; treat carousel peek as an opt-in layout mode, not a universal default; distinguish stable/review/proposed labels with neutral, warning, and informational treatments respectively; use disjoint circles only as an optional coarse magnitude view and aligned bars/tables for precision.

## Findings (visual)

### VISUAL-01 — Component review boards turn into tall, heavily framed specimens on narrow screens

- **Skill(s):** `ui-designer-agent`, `ui-manager`
- **Category / severity / status:** Visual composition and density / P2 / **CONFIRMED**
- **Source:** `previews/board-base.css:51-63,84-97`; buttons specimen markup `previews/buttons/index.html:36-115`.
- **Evidence:** At 320px, Chromium measured the first buttons `.panel` at **280 × 784 CSS px**, with **24px padding** and **24px radius**. In the inspected 320px screenshot the examples form a long RTL column of controls and centered captions inside a single white rounded panel; six sample actions/captions consume almost the whole first specimen. The component buttons themselves remain 48px high and fit; the concern is the specimen's enclosing density and presentation, not the button geometry.
- **Root cause:** Board-wide `.panel` always applies the same 24px padding and 24px surface radius, while `.example-grid` wraps all types and their explanatory captions into one flex flow. It does not distinguish a component gallery from a state-comparison lab or a contextual usage example.
- **Impact:** Repeated panel treatment makes a review page feel like a stack of nested component cards rather than a deliberately organized design-system reference. On a narrow viewport the specimen wrapper dominates the scan; reviewing actual size/state differences requires prolonged vertical scrolling. This is a preview-system issue, not proof that the consumer components are too large.
- **Current patch / mitigation:** No audit change made. Existing mitigation is a true 320px preview route and responsive wrapping in the board. The component's own 48px button minimum remains appropriate and should not be reduced to solve the board's height.
- **Future state:** Separate three review modes: (1) a compact visual index showing each family at actual-use scale with one exemplar; (2) a state lab in which variants align in consistent columns/rows on wide screens and become clearly labeled, flat stacked rows on mobile; (3) contextual composition examples with only the surfaces the composition genuinely needs. Keep a 24px padded surface for an independent module where it earns an edge, but use section rules/spacing rather than an outer card for the entire family gallery. Keep captions short and adjacent to the exact variant; put long contract rationale in expandable/linked spec content rather than beneath every visual sample.
- **Recommendation / scope:** Structural change to **preview information architecture and responsive specimen composition**, not a patch to button CSS. Safe to stage as a review-only direction; no core component redesign required.
- **Risk:** A flatter board can make independent examples harder to distinguish; preserve grouping with headings, row rules, and meaningful background changes instead of removing all grouping.
- **Acceptance tests:** At 320/360/390/430, verify family name and sample remain visible without horizontal page overflow; each example is unambiguously grouped with its caption; no fixed-height wrapper clips variable text; compare at least one standalone, state-lab, and composed example; component dimensions remain unchanged when only board CSS changes.
- **Owner decision/question:** Should family previews prioritize compact inventory scanning or exhaustive state comparison? Options: compact overview first (recommended; reveals the library quickly), state matrix first (best for QA but long on mobile), or keep one dense long board (lowest migration effort, current scan cost remains). This decision affects preview architecture, not component APIs; it does not block component implementation.

### VISUAL-02 — Carousel's adjacent-card peek is visible but not meaningfully readable at its narrow presentation threshold

- **Skill(s):** `design-direction`, `ui-designer-agent`, `ui-manager`
- **Category / severity / status:** Component hierarchy / P2 / **CONFIRMED**
- **Source:** `components/carousel/carousel.css:99-113`; composition in `previews/carousel/index.html` (carousel panel/sample); visual evidence `generated-artifacts/pixilated-audit/visual-carousel-430.jpg`.
- **Evidence:** At a **430px viewport**, browser measurement found the specimen panel at 390px wide, carousel card viewport about 342px, active card at **x=80, width=270px** and previous card at **x=-202, width=270px**. Only about **24px** of the previous card is exposed inside the carousel viewport (the remainder is clipped). The inspected screenshot shows an incomplete strip of text/shape rather than a legible signal of what the next card contains. Page width remains 430px; this is not horizontal overflow.
- **Root cause:** The active slide width reserves a fixed `_peek + gap` on both sides, and the container query removes peek only at 335px. A component container near that cutoff can expose a sliver too narrow to function as a preview. Current behavior combines a reading-focused full card with decorative neighboring content.
- **Impact:** The peek consumes an edge and introduces clipped glyphs without allowing useful comparison or preview. It can read as accidental clipping, even though it is intentional. The numeric position, dots, and arrows already provide navigation feedback, so the slice is not essential to understanding position.
- **Current patch / mitigation:** No audit change made. Existing mitigation is full-width slide mode at container widths ≤335px and one-item mode; no autoplay; position text and arrow controls are present. These are good foundations but the measured 342px case falls just outside the no-peek rule.
- **Future state:** Establish an explicit presentation contract: **focused carousel** (default for a single active card) uses full-width slides with no cut-off neighboring copy, position text plus arrows/dots; **browse strip** is a separate opt-in mode whose adjacent cards expose a deliberate, legible teaser region and use content designed for the peek. Choose its breakpoint from actual component inline size, not screen width. Keep swipe and visible button parity. Do not shrink active content to manufacture a peek. For the present 342px inner width, recommend focused mode.
- **Recommendation / scope:** Structural decision/API or variant change (`focused` versus `browse/peek`) plus a threshold adjustment. A small CSS-only threshold patch could remove the 342px sliver but leaves the undocumented default contract unresolved.
- **Risk:** Removing peek may reduce discoverability of swipe if controls are visually subdued; preserve visible buttons, position count, and dots where useful. A wider teaser needs content-specific slot discipline and may not suit all card types.
- **Acceptance tests:** At component widths 288, 328, 342, 350, and 390px, the focused mode has no neighboring copy visible; browse mode exposes a complete preview cue, not arbitrary cut text; active card content never clips; RTL previous/next order is correct; keyboard controls and position announcement remain; one-card state hides unnecessary navigation; reduced-motion behavior remains.
- **Owner decision/question:** Is the product intent an active-card carousel or a browseable horizontal card strip? Recommendation: active-card default; offer peek only as opt-in for short, scannable card content. Active-card choice simplifies density and works across more content; strip mode increases browsing affordance but needs teaser-safe content and wider component bounds. This is a design/API decision; it blocks final carousel default approval.

### VISUAL-03 — “STABLE UI” and “DRAFT FOR REVIEW” use the same warning-colored badge

- **Skill(s):** `ui-designer-agent`, `ui-manager`
- **Category / severity / status:** Visual semantics / P2 / **CONFIRMED**
- **Source:** `previews/board-base.css:37-48`; examples `previews/buttons/index.html:29-31` and `previews/carousel/index.html:30-31`.
- **Evidence:** The inspected button, fields, data, selection, navigation and message boards show a pale warning/yellow chip labeled `STABLE UI`. The carousel and surfaces boards use the same warning-colored styling for `DRAFT FOR REVIEW`. The source hardwires every `.status-chip` to `--micro-warning-surface` and `--micro-warning` regardless of label.
- **Root cause:** Maturity labels are presented through one visual class without a state-to-token map. Warning color is being used as generic review-board chrome, so “stable” visually shares the same caution signal as “draft.”
- **Impact:** Color, one of the fastest scanning cues, contradicts the wording. Reviewers cannot distinguish a stable family from a draft family by the badge's visual meaning; this is especially costly on a library index where status is metadata.
- **Current patch / mitigation:** No audit change made. The text labels remain explicit, which prevents color from being the only signal; the shared CSS still makes the visual channel misleading.
- **Future state:** Add maturity-specific semantic styles: stable/reference = neutral or subdued brand-neutral treatment; draft/review = warning treatment; proposed/experimental = informational/secondary treatment. Keep explicit text labels and do not overload success/warning/error states that components use for runtime feedback. Use a named state class/data attribute with documented token mapping; never infer semantic color by parsing the displayed text.
- **Recommendation / scope:** Small preview CSS/state patch, with a tiny semantic contract addition. No component runtime change.
- **Risk:** If maturity categories proliferate, bespoke colors can make the palette noisy. Limit to the documented categories and reuse neutral/semantic tokens; maintain text label and sufficient contrast.
- **Acceptance tests:** Snapshot all maturity values on each board; stable is not rendered warning yellow; draft/review is visibly distinct from stable; proposed is distinguishable without looking like runtime error; labels remain understandable in grayscale and with color-vision simulation; contrast is checked on the actual background.
- **Owner decision/question:** Which lifecycle statuses are canonical? Options: stable / draft / proposed (recommended, matches repository language); stable / review only (simpler but loses proposed distinction); custom per family (flexible but inconsistent). Confirming the vocabulary enables a consistent badge mapping. It does not block component work, but it blocks trustworthy visual status signaling.

### VISUAL-04 — Overlapping metric circles obscure the very areas used for comparison

- **Skill(s):** `design-direction`, `ui-designer-agent`, `ui-manager`
- **Category / severity / status:** Data encoding and visual semantics / P2 / **CONFIRMED**
- **Source:** `components/metric-comparison/example-usage.html:23-40` (`data-layout="overlap"`); `components/metric-comparison/metric-comparison.js:91-103,165-202`; `components/metric-comparison/metric-comparison.css:87-100`.
- **Evidence:** The 320px and 390px crops show the 64/25/9 circles interlocking as a Venn-like cluster, even though the caption says the overlap does not denote a relationship. At 390px the browser measured A as 144px, B 90px, C 54px. Their centers and z-order mean the large A disk paints over roughly **40.1% of B's area** and **35.6% of C's area**. Thus, although the *underlying diameters* follow the intended square-root encoding, the **visible colored areas no longer compare as 64:25:9**; orange and lavender readings are partly hidden. The exact external key remains visible, but it cannot restore the obscured visual comparison.
- **Root cause:** `overlap` is the example's default layout; the engine intentionally positions circles at fixed relative coordinates and places larger circles above smaller ones (`z-index` follows diameter). It optimizes compact layered composition at the cost of both visible area and semantic neutrality.
- **Impact:** The graphic communicates two unsupported cues: hidden magnitude for the partly occluded circles, and intersection/relationship between measures through Venn-like overlap. This conclusion is based on measured rendering and overlap geometry, not a claim about user preference.
- **Current patch / mitigation:** No source change made. The visible exact value key, zero/missing/negative copy, and caption mitigate data loss. In the tested huge-value state, a zero ring is a small fixed-size hollow marker; the negative value's area approaches zero beside 10¹⁵ and is recoverable from its always-visible exact row. These textual fallbacks make the state recoverable, but do not make overlapped quantitative areas a sound default.
- **Future state:** For quantitative comparison, make circles **disjoint** if the area view is selected and preserve the exact key/table. Use an aligned bar/list/table as the precision-first comparison path. Treat overlapping circles as illustration-only (with the no-relationship explanation) or remove the mode from metric comparison; a disclaimer cannot undo occlusion.
- **Recommendation / scope:** Confirmed structural/default decision for `metric-comparison`; no need to change the area formula. Do not approve overlap as a comparison mode merely because the source documents the intended encoding.
- **Risk:** Separate circles still require a shared, meaningful scale; if categories use incomparable units, default to rows rather than a packed visual. A table alone has lower preattentive magnitude impact but preserves exactness.
- **Acceptance tests:** For disjoint area mode, verify each circle's complete visible area remains proportional to the stated value; test 64/25/9 and huge / zero / negative / missing together; keep text fallback visible; negative and missing never receive a positive-looking area; verify no axis/category relation is implied. If overlap stays, ensure it is never labeled as a precise comparison and is not the default quantitative view.
- **Owner decision/question:** Should overlap remain as an illustrative-only variant or be removed from metric comparison? Recommendation: remove it from quantitative comparison, keep separated circles only as an opt-in coarse magnitude view, and use aligned bar/table for precision. The tested default is not approved.

## Component-family future-state map

The items below are visual direction for the existing source families, not claims that uninspected states were tested. “Observed” means a screenshot was viewed; families without a dedicated screenshot were inspected in source or the composed/concepts examples, with visual confidence limited accordingly.

| Family / source | Observed state and design evidence | Future-state direction |
|---|---|---|
| Foundations / `shared/tokens.css`, `docs/UI-VISUAL-SYSTEM.md` | Light warm ground, petrol, local Arabic/Latin IBM Plex, 4/8-based spacing and distinct 16px field / 24px surface / capsule / circle geometry are reflected consistently in viewed routes. | Keep direction, map maturity vs runtime status separately, and maintain one semantic token contract rather than adding one-off visual tones. Owner to confirm the proposed status vocabulary. |
| Buttons / `components/buttons/`, `previews/buttons/` | Default, destructive and icon examples seen at 320px; 48px button/control sizes read comfortably. The 280×784px board panel is VISUAL-01 and not a button sizing defect. | Preserve 48px target and token geometry. Show primary/secondary/destructive distinction in one compact composition; put exhaustive state variants in state lab. Don't reduce padding/targets to compact the gallery. |
| Fields / `components/fields/`, `previews/fields/` | Quantity and password crops viewed at 320/360/390/430px. Stepper's +/- controls stay in one shell; unit wraps under at 320 and remains inline at wider widths. Password icon control stays aligned within the shell; labels and submit remain visible. Main interaction audit reports quantity increments and password reveal/remask/focus preservation at all four widths. | Preserve visible external labels and the full control affordance. Keep stepper/help/unit associated at 320 when the unit wraps; do not reduce control targets to compact the family gallery. |
| Selection / `components/selection/`, `previews/selection/` | Checked/unchecked/disabled-like rows and radio options visible at 320px; clear selected mark and 48px row rhythm. | Preserve quiet off states and state marks; separate radio/checkbox/switch/segmented paradigms visually. Review long labels and mobile stacking in the main viewport sweep. |
| Navigation / `components/navigation/`, `previews/navigation/` | Header, tabs and bottom-navigation examples seen at 390px; active tab is clearly distinct, sample items aligned as a composed mini screen. | Keep active state as the only emphatic tab; show each navigation level in context, not beside unrelated component samples. Confirm dense label wrapping and safe-area ownership in parent sweep. |
| Data / `components/data/`, `previews/data/`, `components/data/example-usage.html` | Full element crops of bars, line, donut, bubbles and state bubbles were viewed at 320/360/390/430. Axes fit the shown sample; the line retains a visible missing-point gap; donut legend changes from stacked at 320/360 to side-by-side at 390/430; bubble radii encode 90/12/3 without a forced minimum. Zero, unavailable and negative-as-invalid remain textually explicit. | Keep axes, exact readings, units and legend adjacent. Continue with dense/high-cardinality and longer-label fixtures before approving chart defaults. Do not infer data meaning from color or bubble overlap; keep missing/zero/negative states distinct. No visual defect found in tested fixtures. |
| Metric comparison / `components/metric-comparison/`, `previews/concepts/` | Full main metric and circle element crops at all four widths; at 390 also separated circles, zero/negative/huge/missing circles, a 20-digit main value with 10¹²/zero/−450/missing rows, and the flat comparison variant. Hero remains 144px; exact circle readings stay external. The 64/25/9 overlap hides about 40.1% of the 25 disk and 35.6% of the 9 disk at 390px (VISUAL-04). | Make overlapping quantitative circles non-default or remove that mode; visible area is distorted and the arrangement implies an unsupported relationship. For precision, use an aligned bar/list/table. Keep disjoint circles opt-in for coarse magnitude comparison only; retain a 144px hero only when one number is genuinely primary. Consumer formatting/locale remains the producer's responsibility; keep exact values and avoid fabricated fillers. |
| Carousel / `components/carousel/`, `previews/carousel/` | Active card, previous-card sliver, arrow controls, position and dots viewed at 430px; VISUAL-02. Draft label also informs VISUAL-03. | Adopt focused default plus optional teaser-safe browse strip, with component-width-based threshold and controls retained as gesture fallback. |
| Info strip / `components/info-strip/`, `previews/info-strip/` | Large petrol summary card, page count and arrows viewed at 390px; 348px-wide specimen card from browser measurement. It reads as a distinct summary module, though its color mass is stronger than surrounding content. | Keep petrol card only for a genuinely high-priority read; compact mode should be available in dense compositions and no secondary strip should inherit the full-card treatment by default. Avoid multiplying full-color panels in the same parent layout. |
| Messages / `components/messages/`, `previews/messages/` | Help/info/success/warning/error blocks seen at 430px. Warning/error colors are paired with headings/icons; long warning paragraph occupies a large portion of the panel. | Preserve semantic pairing and distinct message priority. Keep examples to realistic short and long states; demonstrate a one-line/compact case beside a long warning to clarify when the large treatment is appropriate. |
| Organization / `components/organization/`, `previews/organization/` | Open section description and row specimens seen at 360px; stacked white rounded panels are prominent. Capture logged `ERR_INVALID_URL` in browser console; this is not classified as visual failure and is handed off for operational investigation. | Prefer title/description + grouped open rows, with a card only where a genuinely independent region exists. Make list rows' value/action edge consistent and avoid repeated white panel shells in a single screen. |
| Surfaces / `components/surfaces/`, `previews/surfaces/` | Large light aqua surface with prominent number and full-width empty space viewed at 390px. Surface board is labeled draft. | Keep one summary surface as an optional high-emphasis region, not a universal card. Validate the empty space against real information density and available content slots; avoid using the 24px surface radius for every grouped row. |
| Account settings / `components/account-settings/`, `previews/concepts/` | Source reviewed and family included in concepts route, but account-settings portion not separately captured in a screenshot. | Visually prioritize open setting rows, one label/value pair and the control on a stable end edge; avoid per-row cards. Compare settings and destructive action hierarchy in a focused composition. |
| Access gateway / `components/access-gateway/`, `previews/concepts/` | Source reviewed and family included in concepts route, but access-gateway portion not separately captured in a screenshot. | Treat as a small, focused form surface with visible labels, one primary action, quiet recovery link, and errors adjacent to the relevant field. Keep the surface distinct from account-settings rows; no consumer authentication assumptions. |
| Order schedule / `components/order-schedule/`, example usage | Source/spec reviewed; not separately captured in this visual pass. | Keep schedule hierarchy legible without reducing day/value contrast to decorative calendar chrome. Main agent's 320–430 measurements and edge-case keyboard checks must determine whether the grid is acceptable; do not assert a native touch conclusion from screenshots. |
| Packed circle / `components/data/packed-circle.*`, `previews/concepts/` | Source and documented opt-in/proposed status inspected; no dedicated packed-circle visual state was in the viewed crop. | Keep opt-in. Value-to-area should be the only visual encoding; label/readout should remain outside the bubbles so varied labels/zero values do not make the diagram appear childlike or unreadable. Require comparison with a plain table/bar alternative before default approval. |
| Compositions and showcase / `previews/compositions/`, `previews/ui-system-showcase/` | Composition examples viewed at 390px; showcase controls (RTL, width, data profile, maturity) viewed at 430px. The preview contains test controls and long introductions, not an application screen. | Maintain clear source-versus-test-tool distinction. Add at least one compact cross-family composition that exercises hierarchy (one primary metric, supporting rows, one action), plus full-page family references separately. Don't read showcase density as a real user workflow. |

## Chart, metric, and field deep review

This targeted supplement answers the open visual questions with full element crops, not viewport-top screenshots. It uses existing fixture values where possible; the few huge/negative/unknown combinations were set in the browser DOM by `visual-targeted-captures.py` only. No page/source fixture was edited. The main route/state sweep is not duplicated.

### Per-family outcome

| Family | Viewports / states actually examined | Visual outcome |
|---|---|---|
| Standard data charts | Bar, line, donut and bubbles at 320/360/390/430 CSS px. Values are the real local examples: bars 8/4/0/10; line has the existing missing Monday; donut 12/8/5 total 25; bubbles 90/12/3. | **PASS — no finding** for these sample datasets. Bar values/labels and line axis labels remain distinct at all four crops. The missing line point is a dash plus a real break, not a bridged segment. |
| Donut and large total | Donut 12/8/5 at all four widths; existing large-total example (100,000,000 and 23,456,789; total 123,456,789) at 390. | **PASS — no finding.** Legend stacks below the 148px graphic at widths 320/360, then moves alongside at 390/430. Center total and outside exact values remain legible; the large total is fully visible in the reading row. |
| Area/bubble chart states | Existing 90/12/3 scale at all four widths; states 0, missing, and −2 at all four widths. | **PASS — no separate finding for these fixtures.** Scale is consistent with area proportional to value; tiny positive 3 remains visible with its value. Zero/missing/negative share the same 14px outlined glyph, so adjacent value and state labels are essential. They remain distinct and visible at all widths; at 320 the long negative label wraps to a second row without colliding. Keep the textual/table fallback visible rather than relying on the shared ring. |
| Metric circle comparison | Default 64/25/9 with overlap at 320/360/390/430; separated layout at 390. At 390, browser-only state has 10¹⁵, 0, −2 and missing. | **VISUAL-04 CONFIRMED.** The largest circle is dominant (137px at 320; 144px at wider samples), but hides about 40.1% of the 25 disk and 35.6% of the 9 disk at 390. Base diameters are area-scaled by magnitude; sign is carried in the always-visible key. Zero is a fixed 20px hollow marker, while −2 is effectively subpixel beside 10¹⁵ and missing has no circle. The key preserves these states but cannot repair the overlap encoding. |
| Main metric comparison | Default 18 hero with independent 32/9/2 rows at 320/360/390/430; 390 browser-only state has a 20-digit hero, rows 10¹²/0/−450/missing, plus a long missing label. Flat variant also viewed at 390. | **PASS — no finding.** Main component widths are 280/320/350/390px; the 144px hero remains above rows under the tested 420px container threshold. The raw 20-digit hero wraps into two lines but is not clipped. The chart retains the actual negative and missing states. The flat variant shows a quieter, more compact hierarchy for a comparative use case. Number localization/grouping is not provided by the component and remains a consumer-formatting contract, not a confirmed visual defect here. |
| Quantity and password | Element crops at 320/360/390/430. | **PASS — no visual finding.** Quantity +/- affordances remain inside the field shell; at 320 its unit reflows below and at 360+ it is inline. Password reveal control, input and label fit; visual positions remain coherent. In the current shared interaction run, the quantity and password checks pass at all four widths. Overall interaction result is 88 assertions: 84 pass and 4 fail; all four failures repeat the same unrelated picker async-error focus/announcement issue (`INT-001`). |

### Area, hierarchy, and future-state decision

The two circular representations are not interchangeable. The main metric's 144px circle makes **one** declared hero value unmistakably primary; its bars explicitly describe independent supporting readings. The comparison-circles example intends to encode magnitude through area, then puts exact values in a key. But the overlap hides ~40% of the 25 disk and ~36% of the 9 disk at 390px. It also reads as a Venn-like intersection, despite the disclaimer; that is a confirmed encoding problem, not a human-preference claim. The lavender C-series is the documented `--micro-data-c` category token, not decorative gradient styling.

**Do not sign off the overlap mode for quantitative comparison.** Use a compact aligned bar/list/table as the precision-first default. If a coarse magnitude view is genuinely useful and all items share a scale, keep disjoint area-scaled circles optional. Make overlap illustration-only or remove it from metric comparison; text disclaimers do not restore occluded area. Keep the 144px hero circle only for one genuinely primary metric, and use the existing flat variant for peer-level measures. In the huge state, the 20px hollow zero marker can look like a tiny amount beside 10¹⁵; it is differentiated by shape and the exact always-visible key. The −2 area approaches zero and would be easy to miss without its signed key. Those fallbacks are necessary: never hide them or encode negative/missing as positive area. Keep exact demo values; do not synthesize fillers.

### Screenshots viewed for this supplement

- Metric circle default: `visual-metric-circles-overlap-320.png`, `-360.png`, `-390.png`, `-430.png`; variants `visual-metric-circles-separated-390.png` and `visual-metric-circles-zero-negative-missing-huge-390.png`.
- Main metric: `visual-main-comparison-default-320.png`, `-360.png`, `-390.png`, `-430.png`; `visual-main-comparison-flat-390.png`; `visual-main-comparison-extreme-states-390.png`.
- Chart axes/legends: `visual-chart-bars-320.png`, `-360.png`, `visual-chart-bars-zero-390.png`, `-430.png`; `visual-chart-line-320.png`, `-360.png`, `visual-chart-line-gap-390.png`, `-430.png`; `visual-chart-donut-320.png`, `-360.png`, `-390.png`, `-430.png`; `visual-chart-donut-huge-total-390.png`; `visual-chart-bubbles-320.png`, `-360.png`, `visual-chart-bubbles-range-390.png`, `-430.png`; and `visual-chart-bubbles-states-320.png`, `-360.png`, `-390.png`, `-430.png`.
- Fields: `visual-field-stepper-320.png`, `-360.png`, `-390.png`, `-430.png`; `visual-field-password-320.png`, `-360.png`, `-390.png`, `-430.png`.

The generated artifacts live under `generated-artifacts/pixilated-audit/`. Every image listed above was opened and inspected. Target component crops and browser-only extreme-value injection are documented in `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/visual-targeted-captures.py`.

## Visual evidence and bounded checks

### Screenshots viewed

All listed images were opened through the local preview screenshot capture and visually inspected; evidence files are under the permitted `generated-artifacts/pixilated-audit/` path.

- `visual-buttons-320.jpg` — 320px buttons board.
- `visual-data-390.jpg` — 390px metric fixture.
- `visual-fields-360.jpg` — 360px fields board.
- `visual-carousel-430.jpg` — 430px carousel board; primary evidence for VISUAL-02.
- `visual-composition-390.jpg` — 390px composition page.
- `visual-navigation-390.jpg` — 390px navigation board.
- `visual-selection-320.jpg` — 320px selection board.
- `visual-messages-430.jpg` — 430px messages board.
- `visual-organization-360.jpg` — 360px organization board.
- `visual-surfaces-390.jpg` — 390px surfaces board.
- `visual-info-strip-390.jpg` — 390px info-strip example.
- `visual-showcase-430.jpg` — 430px showcase top / review controls.
- `visual-system-320.jpg` — 320px interaction/system reference.
- `visual-charts-390.jpg` — independent chart example at 390px.
- `visual-concepts-390.jpg` — 390px concepts page, including numeric card/carousel.

### Measured checks performed

Local Chromium at `http://127.0.0.1:5000` was used only for this repository. Python Playwright 1.63.0 with `/repl/tools/bin/chromium` measured bounding boxes, page width, and computed surface geometry. Results:

- Buttons board at 320: viewport/document width 320px; first panel 280×784px, radius 24px, padding 24px; sampled buttons 48px high.
- Fields board at 360: viewport/document width 360px; first panel 320px wide; controls measured 272×52px, textarea 272×104px; field radius 16px.
- Carousel board at 430: viewport/document width 430px; panel 390px; active sample card 270px wide, neighboring card clipped to a roughly 24px sliver.
- Data board at 390: viewport/document width 390px; sample panel 350px wide, chart content width 302px.
- Concepts board at 390: visible info-card 348×160px with 24px padding.
- Metric comparison example at 320/360/390/430: component widths 280/320/350/390px; main hero is 144×144px at each tested width. Metric-circle comparison's largest diameter is 137px at 320 and 144px at 360/390/430; 64/25/9 produce 144/90/54px diameters when the container allows full size.
- Chart example at 320/360/390/430: bar SVG widths 288/328/350/390px. Donut SVG stays 148×148px; the legend is stacked at 320/360 and side-by-side at 390/430. No chart element extended the sampled document width.
- Quantity/password element crops were checked at 320/360/390/430. Quantity unit reflows below its control only at 320; password control, label, and submit remain visible at all sampled widths.
- The latest shared browser interaction artifact reports 88 assertions: 84 pass / 4 fail, with all failures repeating `INT-001` (picker async-error focus/announcement) at 320/360/390/430px. Quantity increment and password reveal/remask/focus-preservation checks pass at each of the four widths. The broader interaction suite is attributed to the main agent, not duplicated by this visual pass.

These are route-specific CSS measurements. This visual track did not exhaustively navigate every interactive state, test every family at every width, perform a color-contrast audit, or claim full WCAG/device coverage. The other agent's broader route/state sweep was in progress at handoff and is not represented as a result here.

### Out-of-scope / not provable here

- Real product purpose, information priority, user journeys, audience preferences, and acceptance criteria: **NOT PROVABLE** from a standalone design-system library and demo fixtures.
- Whether the large summary card or carousel should be default in a future product: requires owner decision; no external Micro product was inspected.
- Android/iOS physical hit testing, WebKit/Safari, screen-reader behavior, actual touch, and native zoom: not tested.
- Complete data-domain cardinality, arbitrary long axis labels, every chart empty/error/scaling state, 200%-text, native touch and all family states: still not exhaustive. This supplement tests only the named chart/metric/field fixtures.
- A browser console `ERR_INVALID_URL` was captured on the organization preview. It was not investigated as part of visual audit; no source changes made.

## Decisions and plan input

1. **Carousel contract:** active-card focused default (recommended) vs. browsing strip vs. both via opt-in variants. Determines default width equation and whether a teaser-safe card slot is needed. Blocks final carousel visual sign-off only.
2. **Review status vocabulary:** canonical `stable / draft / proposed` (recommended) vs. two states vs. per-family custom labels. Determines badge tone mapping. Does not block component APIs.
3. **Preview architecture:** compact overview first (recommended) vs. state matrix first vs. current long board. Determines the gallery layout and mobile scroll cost; can be decided independently from component fixes.
4. **Metric representation:** keep the 144px hero circle only for one deliberately primary value; use aligned linear/bar/table as the precision path; make disjoint area circles an optional shared-scale magnitude view. The measured overlap obscures 40.1%/35.6% of two marks, so keep it illustration-only or remove it from quantitative comparison. A product-context decision remains for whether the optional disjoint view is worth supporting; the occlusion defect is confirmed from the current rendering.

Suggested implementation sequence for the visual track only: maturity token semantics → compact family overview and state-lab composition → metric overlap/default decision → carousel focused/peek variants → representative cross-family composition → visual docs. Preserve the 48px core control geometry; metric circles need a variant/default correction rather than an area-formula rewrite.

## Consulted paths

### Brief and project evidence

- `attached_assets/Pasted--Prompt-Replit-UI-UX-Design-System-Future-State--179283_1792833646913.txt`
- `DESIGN.md`
- `shared/tokens.css`
- `shared/motion.css`
- `docs/COMPONENT-GEOMETRY.md`
- `docs/COMPONENT-INVENTORY.md`
- `docs/UI-VISUAL-SYSTEM.md`
- `previews/board-base.css`
- `previews/index.css`

### Component and preview families

- `components/buttons/buttons.css`; `previews/buttons/index.html`
- `components/fields/fields.css`; `previews/fields/index.html`
- `components/selection/selection.css`; `previews/selection/index.html`
- `components/navigation/navigation.css`; `previews/navigation/index.html`
- `components/data/data.css`; `components/data/packed-circle.css`; `components/data/example-usage.html`; `previews/data/index.html`
- `components/metric-comparison/metric-comparison.css`; `previews/concepts/index.html`
- `components/carousel/carousel.css`; `components/carousel/carousel.js`; `previews/carousel/index.html`
- `components/info-strip/info-strip.css`; `previews/info-strip/index.html`
- `components/messages/messages.css`; `previews/messages/index.html`
- `components/organization/organization.css`; `previews/organization/index.html`
- `components/surfaces/surfaces.css`; `previews/surfaces/index.html`
- `components/account-settings/account-settings.css`
- `components/access-gateway/access-gateway.css`
- `components/order-schedule/order-schedule.css`
- `previews/compositions/index.html`
- `previews/system/index.html`
- `previews/ui-system-showcase/index.html`

### Skills and visual-design references

- `_audit-resources/pixilated-ux-ui-skills-kit/design-direction/SKILL.md`
- `_audit-resources/pixilated-ux-ui-skills-kit/ui-designer-agent/SKILL.md`
- `_audit-resources/pixilated-ux-ui-skills-kit/ui-manager/SKILL.md`
- `_audit-resources/pixilated-ux-ui-skills-kit/ui-designer-agent/references/technique-index.md`
- `_audit-resources/pixilated-ux-ui-skills-kit/ui-designer-agent/references/catalogue.md`
- `_audit-resources/pixilated-ux-ui-skills-kit/ui-designer-agent/references/notes/batch-01a.md` — hierarchy, edge alignment, card dissolution, dashboard data presentation.
- `_audit-resources/pixilated-ux-ui-skills-kit/ui-designer-agent/references/notes/batch-01b.md` — mobile swipe/carousel and visual emphasis.
- `_audit-resources/pixilated-ux-ui-skills-kit/ui-designer-agent/references/notes/batch-09a.md` — hierarchy, concise copy, chart simplicity, type and spacing critique.
- `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/visual-targeted-captures.py` — local-only target element crops and browser DOM extreme-state fixtures.
- `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/interaction-browser-results.json` — latest shared route/state results: 88 assertions, 84 pass, 4 repeated `INT-001` picker async-error focus/announcement failures; quantity/password checks pass at all four widths.

Technique-index topics applied: hierarchy/emphasis; spacing/grouping and nested cards; chart/data-driven components; mobile/carousel affordance; status color semantics and UI states. `catalogue.md` was used to identify those subjects; the three notes above were read for relevant recipes. Live trend-search steps in `ui-designer-agent` were **not run** because this audit brief explicitly prohibits external URLs/search and this is a source-local visual review.

## Skill application ledger (visual assignment)

| Skill | State | Families/files actually applied | Findings | Limitations |
|---|---|---|---|---|
| `design-direction` | **LOADED; APPLIED** | Existing direction from `docs/UI-VISUAL-SYSTEM.md`, `shared/tokens.css`; examined carousel and circles vs. linear comparison as a future default. | `VISUAL-02`, `VISUAL-04` (2) | Existing direction is not owner-signed. Carousel and circle defaults still need product context; external references/trend scan prohibited by user. |
| `ui-designer-agent` | **LOADED; APPLIED** | Foundations, board CSS, Buttons, Fields, Selection, Navigation, Data/charts/packed circle, Metric comparison, Carousel, Info strip, Messages, Organization, Surfaces, Account settings, Access gateway, Order schedule, Compositions, Showcase. Used target crops and browser geometry. | `VISUAL-01`, `VISUAL-02`, `VISUAL-03`, `VISUAL-04` (4) | Preview states were sampled, not exhaustive. Trend search prohibited. No contrast or full a11y certification claimed. |
| `ui-manager` | **LOADED; APPLIED** | Reviewed token-to-rendered geometry, data encoding/occlusion, maturity semantics, controls, and variant acceptance risk. | `VISUAL-01`, `VISUAL-02`, `VISUAL-03`, `VISUAL-04` (4) | This is a visual-spec gate only; keyboard/screen-reader/full state coverage remains with the parent audit. |

Per-skill methods, evidence, finding counts, checked files, limitations, and distinct future-state reasoning are also recorded in `skill-reports/design-direction.md`, `skill-reports/ui-designer-agent.md`, and `skill-reports/ui-manager.md` for the main audit ledger.

**Coverage boundary:** This ledger covers the three skills assigned to this visual worker. It does not substitute for the main audit's 11-skill application ledger. The initial inspection found no shared audit inventory; before finishing, the shared inventory and findings files appeared and were read. The inventory records 492 tracked files and 14 component families at source head `fc1e53e03048c38a451c8421e23cee58ab2b3a7a`. Its stated limit is that selectors/state markers are lexical inventory rather than proof of runtime behavior. The shared design-systems findings include an overlay layer-token issue and a draft calendar geometry decision; neither duplicates these four visual findings. The shared language findings concern Arabic and state-copy topics beyond this visual pass. No shared worker files were edited.
