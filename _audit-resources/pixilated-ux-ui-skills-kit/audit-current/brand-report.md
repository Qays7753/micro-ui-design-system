# Brand Auditor — current UI-system audit

**Status:** APPLIED
**Scope:** Brand profile, palette roles/proportions, semantics, contrast, locally loaded type, icons, charts, identity assets, voice handoff, and current UI consistency.
**Findings:** 6 (`BRAND-01`–`BRAND-06`; one confirmed preview-palette issue, three likely/confirmed local presentation concerns, two not-provable policy risks).
**Source changes:** None. No product, documentation, preview, or configuration source was edited. Only this `audit-current/` report/profile/findings and `generated-artifacts/pixilated-audit/brand/` evidence were produced.

## Context and bounded conclusion

This is an independent Arabic RTL UI kit in active construction. Preview and showcase values are local fixtures, not real users, production records, journeys, or measured product behavior. Micro is repository identity/future context only; this pass audited the current repository and its owner-approved local assets. I did **not** open, search, clone, compare with, or contact any Micro consumer repository or application, nor any external URL. The preview browser was hard allow-listed to the existing `REPLIT_DEV_DOMAIN` host; all other hosts and schemes were blocked.

**Professional conclusion:** The repository has a real, owner-approved identity and a coherent local visual foundation: petrol/terracotta/blue-petrol colors, locally loaded IBM Plex Sans + IBM Plex Sans Arabic, and a sourced HugeIcons Stroke Rounded set. These are not inferred from a consumer product. Brand application is **partly ready but not signed off**: the approved logo exists but has no placement contract and is not used on the inspected showcase headers; one temporary text monogram is a low-contrast substitute; some preview-board links still use browser-default blue/purple; and chart-color accessibility needs a bounded follow-up. Semantic message examples keep word/icon/color together. The library’s visual character is intentionally light and restrained, so area percentages are reported as evidence, not used to justify painting components.

**No 0–100 brand score is assigned.** A numeric total would overstate certainty because the area-role mapping and voice pillars are derived, the owner-approved logo has no UI placement contract, and product imagery direction is not specified. Unscored dimensions and why are enumerated below and in `brand-findings.json`.

## Brand profile and source-of-truth distinctions

The machine-readable, repository-local profile is [`brand.json`](brand.json). It derives from:

- `DESIGN.md:17-31` and `shared/tokens.css:9-51, 87-94, 120-149`: source palette, status pairs, system typography, data colors, motion.
- `docs/UI-VISUAL-SYSTEM.md:6-27`: quiet operational RTL direction, color intent, type, data, icon and motion conventions.
- `assets/brand/micro-logo/README.md:3, 7-25` and `assets/brand/micro-logo/v1/README-AR.md:16-45, 62-66`: approved local identity, variants, geometry and digital size guidance.
- `assets/SOURCES.md:5-31, 38-40`, `assets/fonts/fonts.css:10-60`, and local SVGs under `assets/icons/`: licensed/local asset facts.

The repo token `--micro-brand-primary` is petrol `#164D59`, used for actions/selection. The auditor profile’s **area-role primary** is instead the dominant light field `#F7F8F4`; the profile’s area-role secondary is petrol and area-role tertiary is terracotta. This role remapping is explicitly marked `derived: true` in `brand.json` so the audit’s 70/20/10 vocabulary is not mistaken for token naming or an owner-approved redefinition of “brand primary.”

The source also has a real approved brand asset: canonical editable v1 vector source, Arabic/English lockups, and a standalone symbol. The local guide sets a 240 CSS px minimum for a full lockup; at narrower widths it directs the UI to use the symbol alone, and documents the symbol/wordmark gap. It does **not** prescribe where the logo belongs in a UI kit or showcase. The profile does not adopt unapproved v2 files as the production authority; the repository’s logo README and future-development note identify v1 as the approved reference.

## Browser audit and actual visual evidence

### Faithful rendered check

`brand_audit.js` was injected into the already-running local preview with `window.__BRAND` through Playwright. No HTML/CSS/JS was rewritten. Browser requests were restricted to the current preview host.

- **16 individual routes × 4 viewport widths = 64 rendered checks:** 320, 360, 390, and 430 CSS px.
- **Routes:** `previews/index.html`; individual boards for buttons, fields, selection, navigation, data, messages, surfaces, carousel, info-strip, organization, and concepts; the order-schedule component example; system reference; composition index; and the composed `ui-system-showcase`.
- **Result:** 64 responses, 0 browser page errors, and 0 horizontal document-width overruns in the checked first viewport. These figures only describe this bounded brand sweep, not every route/state or browser.
- **Actual font verification:** `document.fonts` checks were positive for Latin and Arabic; all six locally declared IBM Plex families/weights reported loaded. Chromium CDP `CSS.getPlatformFontsForNode` was enabled and queried on 19 route/viewport samples. It reported custom IBM Plex Sans Latin glyphs and custom IBM Plex Sans Arabic glyphs in actual Arabic/mixed headings. This specifically prevents a false finding from the audit script’s reading of only the first CSS font-family in the stack. No font fallback is confirmed.
- **Area measurement:** screenshots were reloaded to a browser canvas and sampled at quarter resolution. The measurement ports the kit’s OKLab distance, nearest-color threshold `ΔE ≤ 0.08`, semantic exclusion, image/chart-region exclusion, and secondary/tertiary role ramps from steps 100–900. The numerator contains only the profile’s primary/secondary/tertiary roles. There is no Pillow-generated `share.png`; raw per-route/per-width role pixels and percentages are in `generated-artifacts/pixilated-audit/brand/browser-results.json`.
- **Selected captures actually opened:** `brand/screenshots/previews--index-320.png`, `previews--fields--index-390.png`, `previews--data--index-390.png`, `previews--ui-system-showcase--index-390.png`, and `chart-five-series-390.png`; existing shared captures `visual-surfaces-390.jpg`, `visual-messages-430.jpg`, and `visual-charts-390.jpg` were also viewed. These are screenshots of reference/fixture UI, not product screens.

### Role-share readings (derived profile; first viewport)

Values below are primary / secondary / tertiary percentages of classified brand-role pixels, semantic colors and chart/image boxes excluded. They are reproducible measurements under the profile above, not a pass/fail against an approved product screen.

| Route | 390px | Interpretation |
|---|---:|---|
| `previews/buttons/index.html` | 91.8 / 5.4 / 2.7 | White reference-board canvas dominates the sample. |
| `previews/fields/index.html` | 96.5 / 3.4 / 0.2 | Field examples use light surfaces by design. |
| `previews/selection/index.html` | 95.0 / 4.8 / 0.2 | Selected petrol marks remain sparse. |
| `previews/info-strip/index.html` | 70.6 / 29.3 / 0.0 | The meaningful petrol summary surface produces a substantially different composition. |
| `previews/data/index.html` | 94.8 / 4.7 / 0.5 | Data/chart areas are excluded; a white specimen page remains dominant. |
| `previews/surfaces/index.html` | 90.0 / 9.6 / 0.4 | Warm page/surface field dominates this first viewport. |
| `previews/ui-system-showcase/index.html` | 93.8 / 6.2 / 0.0 | The showcase top is mostly neutral control/reference content. |

These measurements vary markedly by what the specimen demonstrates; a 70/20/10 adjustment would not be appropriate for every isolated component. See `BRAND-01`; owner approval is needed before treating the skill’s tolerance as a defect mandate.

### Contrast checked on the actual background

- The script’s ancestor-based color contrast calculation can pick an opaque `backgroundColor` or fall back to white without resolving a CSS `background-image`. For `.m-info-card__number`, browser inspection showed **white** text over `linear-gradient(145deg, #236675, #164D59 72%)`; the card’s computed `backgroundColor` is transparent. White against the two actual endpoint colors is **6.50:1** and **9.38:1**, respectively. The opened `visual-info-strip-390.jpg` confirms the colored card. This is **not** the alleged 1.07:1 contrast failure; it is triaged as a script limitation in the JSON record.
- `.brand-mark` on the family index is different: computed terracotta `#D97757` “m” at 15px/600 on solid petrol `#164D59` measures **3.00:1**. That is below 4.5:1 if read as ordinary text. Whether it is meant as a decorative logo glyph is unresolved; the repository’s approved symbol is available. See `BRAND-03`.
- The palette generator’s candidate text-safe tertiary 500 value `#B85C3E` is 4.53:1 against pure white but only 4.24:1 against the actual page field `#F7F8F4`, and 2.07:1 against petrol. It is not an approved replacement token. If future text needs terracotta-family ink on the page, a darker approved ramp step and the actual background must be tested. Preserve the canonical logo/accent hex for brand marks and accent fills.
- The message specimen screenshot shows explicit labels/icons with semantic surfaces for info, success, warning and error; source tokens remain separate from brand accent. No semantic recoloring failure was confirmed.

### Typography and icon triage

The type assets load and platform rendering matched both IBM Plex faces. The browser audit script’s initial “IBM Plex Sans is not a brand face” report was caused by checking only the first CSS stack entry. CDP confirmed that Arabic glyphs actually come from the custom IBM Plex Sans Arabic subset. No type fallback finding remains.

The sourced base icons are documented as HugeIcons Stroke Rounded, viewBox 24, 1.5 stroke, round caps/joins, `currentColor`. A few control/status glyphs deliberately use heavier small-icon treatment in component CSS. The injected auditor reports a filled icon, mixed one-pixel stroke and a 37px “icon” on data pages/showcase, but the identified instances are SVG chart/bubble encodings rather than UI icons. The script excludes `data-brand-chart` and `svg[role=img]`; not all chart SVGs use those markers. This is a classifier false positive, not evidence to run `icon_normalize.py` across charts. No mixed icon-family finding is asserted.

## Findings

Full records—including the required category, status, selector/path evidence, root cause, impact, current and future state, patch/structural class, risk, acceptance checks, and owner decision—are in [`brand-findings.json`](brand-findings.json).

### BRAND-01 — Area-share role mapping is derived; proportions do not mandate recoloring

- **Category / severity / status:** Palette role governance / P2 / **NOT PROVABLE** as a design defect.
- **Evidence:** UI token names define petrol as `--micro-brand-primary` and the visual system uses it for action/selection; profile deliberately assigns it to the auditor’s area-secondary role and assigns page ground to area-primary. Five 390px measurements span from `70.6/29.3/0` (`info-strip`) to `96.5/3.4/0.2` (`fields`).
- **Root cause / impact:** The source specifies color intent, not an owner-approved 70/20/10 role map for audit math. Treating specimen backgrounds as a ratio failure could cause meaningless color-area changes and conflict with light, content-first design intent.
- **Future state / recommended solution:** Keep source token names; approve a separate measurement-role map and define when the tolerance is applicable. Do not color-fill components just to hit a ratio.
- **Change size / risk:** Profile/governance patch only, after owner decision; no component changes. Risk is turning a descriptive target into decorative surfaces.
- **Acceptance:** Profile labels measurement roles separately from source tokens; every ratio states route, width, pixel classifier and exclusions; no meaningless surface added for a numerical pass.
- **Owner question:** Should page ground/cards count as area-primary while petrol is area-secondary, and should isolated component previews be measured against the same ratio as a composed screen? Recommendation: descriptive measurement for isolated boards, approved role mapping for composed pages.

### BRAND-02 — Approved logo is not installed in the inspected preview identity

- **Category / severity / status:** Logo/distinctive-asset consistency / P2 / **LIKELY**.
- **Evidence:** Approved local v1 asset exists, with use/size/clear-space guidance. `assets/brand/micro-logo/README.md:25` explicitly says it is not installed in UI screens. `previews/index.html:31` instead uses a text `m`; the showcase header is text-only. See opened screenshots in the evidence directory.
- **Root cause / impact:** Asset approval is separate from UI placement approval. The index substitutes an improvised mark while the custom symbol and Arabic/English lockups are available; portable component demos should not inherit an unapproved shell/logo.
- **Future state / recommended solution:** Decide whether the overview and composed showcase should display the approved v1 symbol/lockup. Keep primitives unbranded. Use a full lockup at ≥240px; below that use the approved symbol, preserving geometry and variant/background rules.
- **Change size / risk:** Preview-only patch after owner decision. Risk of implying a future host layout or coupling the mark into components.
- **Acceptance:** Correct approved asset, no distortion, approved color variant, ≥240px full lockup or symbol-only below it, and documented location/clear space.
- **Owner question:** Install the approved mark in overview/showcase only, or remain deliberately text-only until host placement is known? Recommendation: mark the overview/showcase only.

### BRAND-03 — The temporary terracotta “m” mark has 3.00:1 contrast on petrol

- **Category / severity / status:** Text contrast / P2 / **LIKELY**.
- **Evidence:** `previews/index.css:19` sets the `.brand-mark` text to `--micro-brand-accent`; `previews/index.html:31` supplies the text `m`. At 390px, browser-computed foreground/background are `#D97757` / `#164D59`, size 15px, weight 600; measured contrast 3.00:1. It is adjacent to the larger “MICRO” label. The approved symbol is distinct from this letter.
- **Root cause / impact:** Preview accent styling turns an undocumented text substitute into a logo-like element on a dark background. If this glyph is ordinary readable text, it misses 4.5:1; if decorative, it remains the wrong distinctive asset.
- **Future state / recommended solution:** Replace it with the approved vector symbol in a background-appropriate approved variant, or remove it. Do not recolor the canonical terracotta brand value.
- **Change size / risk:** Preview-only patch after owner decision. Risk: substituting a white m alone resolves contrast but retains an improvised mark.
- **Acceptance:** If text, ≥4.5:1 on actual solid background; if symbol, exact approved asset variant and preserved geometry; no redundant decorative letter exposed as meaningful text.
- **Owner question:** Is the lowercase m intended as text, ornament, or placeholder? Recommendation: replace/remove in favor of the approved symbol.

### BRAND-04 — Surfaces/system preview links use browser-default blue/purple

- **Category / severity / status:** Palette fidelity / P2 / **CONFIRMED**.
- **Evidence:** In the rendered surfaces page, link text computes to browser-default `rgb(0,0,238)` 12 times at every tested viewport; one system-reference link also uses that default. `visual-surfaces-390.jpg` visibly shows blue and visited-purple resource links. Sources include `previews/surfaces/index.html:42, 283-286`, `previews/system/index.html:82`, and absent general link role in `previews/system/system.css`.
- **Root cause / impact:** Preview prose anchors lack consistent link color/state rules. They interrupt the petrol/ivory style and make reference pages appear partly unskinned. This finding is scoped to those preview boards, not the reusable component API.
- **Future state / recommended solution:** Define scoped preview-link styling using the existing petrol role, underline, explicit visited/hover/focus-visible treatment; do not make component CSS depend on board styles.
- **Change size / risk:** Small preview CSS patch. Risk: globally overriding component-specific anchors or losing visited/focus cues.
- **Acceptance:** No user-agent blue/purple links in boards; underline remains; focus visible; grayscale distinction remains; standalone component output unchanged.
- **Owner decision:** None required. Safe after audit approval; does not block component work.

### BRAND-05 — Data-series colors b/e narrowly collide in deuteranopia simulation

- **Category / severity / status:** Chart palette / P2 / **LIKELY**.
- **Evidence:** `shared/tokens.css:120-125` and `components/data/data.css:250-255` map series b to `#D97757` and e to `#B3BD7B`; the five-category fixture puts them together at `previews/data/index.html:125-138`. Under the kit’s Machado severity-1.0 deuteranopia transform their OKLab ΔE is **0.097** (kit warns below 0.10). The five-series screenshot opened at `brand/screenshots/chart-five-series-390.png` shows values and category labels adjacent to all bars; the sample is not relying on color alone. The generator’s four warnings apply to its candidate colors, which are not applied, and are not confused with this measured source palette result.
- **Root cause / impact:** Fixed data category colors include a bright brand accent and olive; there is no chart-only accessibility variant. The near pair may be harder to distinguish in dense or separated multi-series charts. Labels reduce but do not prove user comprehension.
- **Future state / recommended solution:** Keep category identity and semantic good/bad roles distinct. Test each simultaneous category set. If needed, add a chart-only hue/lightness or non-color cue (e.g. direct labels/pattern) rather than changing the global logo/accent tokens.
- **Change size / risk:** Possible structural chart palette contract; no immediate token patch justified by a near-threshold labeled fixture. Risk of breaking stable data-category identity or adding chart noise.
- **Acceptance:** CVD checks include all co-present series at 320/360/390/430; where a pair remains below ΔE 0.10, direct labels/patterns keep series distinguishable; semantic colors remain separate.
- **Owner question:** Are chart categories fixed to global data colors, or may chart-only color/pattern variants be used? Recommendation: retain global tokens and use a redundant cue unless a real chart remains ambiguous.

### BRAND-06 — Petrol is close to semantic success/info colors; actual misuse is not proven

- **Category / severity / status:** Semantic/brand separation / P2 / **NOT PROVABLE**.
- **Evidence:** The injected script emits a proximity warning for petrol vs success/info (ΔE 0.10 each), gradient start vs success/info (0.08/0.06), and data blue-grey vs info (0.06). It repeats the same palette-pair warning on every route. The viewed message specimen uses semantic labels/icons/colors, and source keeps semantic roles separate; no error/success/info message recolored with the brand token was confirmed.
- **Root cause / impact:** Palette distance is compared globally without role, size, background, or contextual status awareness. Near hues could be less distinguishable in a screen where action and status sit together, but color proximity alone does not establish semantic misuse.
- **Future state / recommended solution:** Review actual same-screen foreground/background pairs and small-size appearance; preserve word/icon/color redundancy and never recolor status to satisfy brand.
- **Change size / risk:** Owner token-governance decision only; no immediate source change. Changing semantic hue from an abstract ΔE warning could damage contrast or status meaning.
- **Acceptance:** Contextual same-screen pair review; statuses retain clear text/icon; accepted proximity documented; no status is color-only.
- **Owner question:** Are current petrol / success / info relationships intentional? Recommendation: preserve pending a real ambiguous overlap and document any accepted pairs.

## Brand checklist: result by pillar

| Pillar | Result | Evidence / boundary |
|---|---|---|
| Color profile and area roles | **Partial / unscored** | Official token palette exists; 70/20/10 profile roles are derived. Per-route measurements are preserved in JSON, not treated as paint-by-numbers. |
| Palette/semantic integrity | **Partial** | Tokenized status pairs and copy/icon cues exist. Brand/semantic proximity remains an advisory; no semantic recoloring failure confirmed. Browser-default preview links are a confirmed exception. |
| Actual color contrast | **Partial** | Contextual checks support gradient info-card contrast and find the temporary monogram at 3.00:1. This is not a complete WCAG audit of every state/background/alpha combination. |
| Typography | **Strong in sampled views** | All six locally bundled weights/faces are loaded; CDP shows actual Arabic and Latin platform fonts. No fallback finding. Scale is tokenized but local specimen sizes are not one universal scale. |
| Icons | **Consistent sourced base set** | Source docs establish local HugeIcons Stroke Rounded; common glyphs use 1.5/round/currentColor. Analyzer chart-SVG false positives excluded from findings. |
| Logo/distinctive assets | **Partial** | Approved custom symbol/lockups exist with usage notes; inspected overview/showcase do not place them and one text “m” substitutes on the index. |
| Voice | **Not scored** | No owner-approved voice specification or 20+ verified brand-channel strings. Preview copy is fixture/reference text. Existing language audit supplies a bounded UX Writer handoff below. |
| Charts | **Partial** | Current charts use named series tokens, direct labels/value reads and semantic tone classes. b/e has one near-threshold deuteranopia pair requiring contextual review. |
| Imagery | **Not applicable / unscored** | Audited target is a UI kit and its preview pages; no product photography corpus or image-direction rule is specified. Do not invent one. |
| Cross-screen consistency | **Partial** | Tokenized component styles and local fonts are mostly coherent; preview link states and logo placement are not governed. |
| Motion | **Source-defined** | Calm easing/durations and reduced-motion rules are documented. This brand pass did not exhaustively replay every motion state. |

## Voice and tone — handoff for the existing UX Writer lane

This handoff is intentionally a **brief in the audit report**, not a rewrite or a source edit. It should be considered alongside `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/LANG-ux-writer-audit.md`, which has already applied the UX Writer method and contains detailed language findings and proposed copy. No owner-approved brand voice guide exists, so the following voice target is provisional and derived from `docs/UI-VISUAL-SYSTEM.md:6-8, 16-23`.

> **VOICE BRIEF — Micro UI reference copy (not a future consumer-product voice approval)**
> **Pillars (derived):** calm and operational; clear and content-first; exact about values and states.
> **Provisional NN/g target:** humour 5/5 (serious), formality 3/5 (neutral/professional), respect 5/5, enthusiasm 4/5 (matter-of-fact).
> **Useful vocabulary:** clear names for value, state, component, selection, action, and measurement.
> **Avoid:** unsupported product promises, business claims, invented user journeys/personas, and generic emotional copy.
> **Context:** errors calm and actionable; success short and factual; labels exact; examples explicitly marked as fixtures; explanatory copy subordinate to the component it documents.
> **Constraints:** keep semantic severity and meaning; preserve exact demo values/units; do not reinterpret arbitrary consumer labels; keep Arabic MSA/RTL examples and bidi-safe number meaning; do not convert fixture text into production product defaults.
> **Strings to review through the existing LANG lane:** `LANG-002` (visible/accessible Arabic count fixture agreement); `LANG-003` (raw callback exception text at the component boundary); `LANG-004` (picker state nouns/clarity); and `LANG-001` (locale, digit, and string ownership contract). These are linked handoff items, not new brand findings.
> **Return requested from UX Writer:** string-id keyed short/standard rewrites and reasons only after owner approves the intended default voice and the applicable copy ownership; no words are applied by this report.

Existing `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/LANG-showcase-copy.json` contains the language worker’s 339-string HTML extraction for the showcase. It is a working inventory (not a complete JS/runtime catalog), and the language report treats copy as fixture/demo content. I did not claim an NN/g brand score or reuse fixture phrases as verified brand-channel evidence.

## Chart and imagery analysis

`brand_palette.py` was run into `generated-artifacts/pixilated-audit/brand/palette/`. Its `palette.css`, `palette.json`, and `palette.html` are **analysis artifacts only**; none was applied to source. The generated candidate palette produced four simulated CVD warnings; these are not evidence that the current system uses those candidate hexes. A separate simulation of the actual five current `--micro-data-*` source tokens found the b/e deuteranopia pair at ΔE 0.097, with other closest pairs outside the warning threshold. The source chart remains labeled, as confirmed visually in the five-series capture.

The chart examples show the actual data palette and brand styles. The code explicitly maps stable series IDs to colors; good/bad status uses separate semantic tokens. There is no photo/brand-image library to compare and the inspected target is a component/system reference, so a photo brief is not applicable. The custom approved logo is the relevant distinctive asset; it must not be conflated with screenshot fixtures or generic chart glyphs.

## Script and reference use

| Material | Applied use / limitation |
|---|---|
| `brand-auditor/SKILL.md` | Applied its profile → measure → voice handoff → chart/image → report workflow to current repository sources and rendered previews. |
| `references/brand-profile.md` | Built `brand.json` from repository-local palette, logo, typography, icon, motion and direction. Missing/derived roles and voice are marked explicitly. |
| `references/checklist.md` | Used for source-token trace, semantic pairing, actual font loading, icon conventions, logo/asset placement, voice limits, charts and cross-page consistency. |
| `references/color-theory.md` | Applied the area-role mapping and ±10-point profile threshold as a reported measurement; semantic and chart/image exclusions plus actual-background contrast were preserved. Did not paint components to force a target. |
| `references/iconography.md` | Compared documented SVG base spec against rendered SVGs; distinguished charts from UI icons. Did not normalize chart SVGs. |
| `references/voice-tone.md` | Used the template to hand the unresolved voice/copy questions to the existing LANG/UX Writer report without applying rewrites. |
| `references/charts-imagery.md` | Ran the palette/CVD generator as an unapplied audit artifact; separately simulated current data tokens. Recorded image direction as not applicable where no image source/guidance exists. |
| `brand_audit.js` | **Executed** in-browser across 64 route/viewport cases with injected profile; its contrast/font/icon heuristic limitations were triaged explicitly. |
| `brand_palette.py` | **Executed**; artifacts saved under generated evidence only. Candidate colors are not applied. |
| `brand_audit.py` | **Not executed.** It requires Pillow, which is unavailable. Do not install packages or alter `pyproject.toml`. It also copies only the page’s directory to a temporary site, which breaks this repository’s relative-root dependencies. The browser-only `brand_audit.js` adapter against the real running repository is the faithful alternative. |
| `icon_normalize.py` | **Read, not executed.** This is a mutating HTML normalizer; the task is audit-only, many icons are SVG `<use>` sprites or component-defined control marks, and chart SVGs must not be normalized as icons. No source or test fixture rewrite is appropriate. |
| `extract_copy.py` | Existing language work already ran the extractor on showcase HTML and recorded 339 strings in the existing LANG artifacts. Not repeated to avoid duplicating that inventory; generated JS strings still require the language report’s manual source cross-check. |
| `brand-auditor/evals/evals.json` | Read as the skill’s example expectations; no Qahwa/Vibe brand files exist in this repository, so their names/palettes/expected scores were not transferred to this brand. |

### Known analyzer false positives and safeguards

1. **CSS gradient contrast:** `brand_audit.js` may use an ancestor `backgroundColor` without resolving `background-image`; `.m-info-card__number` is white over the petrol gradient and passes at both actual endpoints (6.50:1 and 9.38:1). Do not carry forward a hypothetical 1.07:1 warning.
2. **Arabic fallback:** the script sees the first CSS stack family; CDP platform-font probes confirmed actual Arabic glyphs use locally loaded IBM Plex Sans Arabic and Latin uses IBM Plex Sans. The early first-family warning is not a font defect.
3. **Chart SVG versus icon:** the script’s width/stroke/fill counter does not automatically know that a `.m-bubble__circle` SVG is a data encoding. Its reported filled icons, 1px stroke and 37px shape are excluded from icon-consistency findings.
4. **Palette proximity:** pair distance runs globally and repeats per page; it is a one-time risk question, not proof of runtime status misuse.

## Owner decisions / questions

1. **Area roles:** Approve a separate 70/20/10 measurement role mapping; define if it applies to isolated specimens or only composed references. Recommendation: no cosmetic repainting; keep “auditor primary” distinct from `--micro-brand-primary`.
2. **Logo placement:** Should the approved logo appear on family index/showcase headers now? Recommendation: yes on overview only, not component primitives. Confirm full Arabic/English lockup versus symbol for 320–430px widths.
3. **Temporary monogram:** Is the current lowercase `m` text meant to be a logo? Recommendation: replace/remove it rather than treating it as an approved mark; its actual contrast is 3.00:1.
4. **Chart CVD policy:** Should chart categories use global color tokens only, or may chart-only cues be added? Recommendation: preserve global identity and add labels/patterns if a real same-chart pair remains difficult.
5. **Semantic proximity:** Are petrol/success/info token relationships intentional? Recommendation: preserve current semantic tokens pending contextual overlapping uses; keep icon + word + color, and document accepted proximity rather than recoloring statuses.
6. **Voice:** Should this UI-kit documentation voice remain neutral professional MSA, and is locale readiness in the library a current goal? Recommendation: approve the provisional calm/exact target only for component guidance; retain LANG-001 locale/digit ownership as a separate system decision.
7. **Imagery:** No product imagery direction is needed for the current component-only reference pages. If the overview later includes imagery, approve a real UI-kit image/illustration brief first; do not import consumer-product photography assumptions.

## Safe corrections vs structural work

**Potential safe corrections after approval:** scope a link-color rule to the surfaces/system preview boards; replace/remove the unapproved text monogram; use an approved v1 logo asset in an approved overview placement; correct profile metadata/area-role mapping after owner decision. These do not justify changing the source component palette.

**Structural/future work:** document an auditor area-role and neutral-assignment policy; define a reusable preview-only link-state token; decide logo placement/asset contract for showcases versus portable components; publish chart CVD testing rules and any chart-only redundant cues; approve or reject the provisional voice/localization boundary. Do not adopt the generated palette CSS as a source palette without owner review.

**Recommended implementation order if later approved:** (1) confirm brand/profile roles and semantic pair ownership, (2) establish logo placement and preview link roles, (3) validate chart categorical cues and keep all semantic outcomes intact, (4) hand LANG strings to UX Writer for approved voice only, (5) refresh brand evidence at the same 320/360/390/430 routes. No execution is authorized by this audit.

## Evidence index

- Profile: `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/brand.json`
- Full structured findings and false-positive triage: `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/brand-findings.json`
- Route/viewport measurements and injected script output: `generated-artifacts/pixilated-audit/brand/browser-results.json`
- Browser screenshots actually produced for this pass: `generated-artifacts/pixilated-audit/brand/screenshots/` (16 selected route/width captures plus a scrolled five-series chart)
- Generated candidate palette analysis only: `generated-artifacts/pixilated-audit/brand/palette/{palette.css,palette.json,palette.html}`
- Shared rendered screenshots viewed: `generated-artifacts/pixilated-audit/visual-surfaces-390.jpg`, `visual-messages-430.jpg`, and `visual-charts-390.jpg`
- Existing writer handoff/artifacts: `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/LANG-ux-writer-audit.md`, `LANG-showcase-copy.json`

**Boundaries:** No user testing, production behavior, analytics, physical devices, native zoom, screen-reader session, WebKit/Safari, trademark/legal search, or consumer app integration is asserted. No outside repository or application was consulted. No product/source edits, commits, pushes, or branches were made.
