# Final Full UI-System Review — 2026-10-24 (Phase B)

**Repository:** `Qays7753/micro-ui-design-system` (independent; no other repository was opened, cloned, or compared).
**Branch reviewed:** `replit/light-only-complete-ui-repair-2026-10-24`
**Exact commit reviewed:** `85271a9` — the Phase A repair head ("Complete Light-only repair: Info Card unit wrap and complete compact month grid"). The working tree was frozen at this commit for the entire review; see §15.

**Review scope:** the entire independent repository — all 14 component families, the integrated Showcase (source + generated standalone), tokens, motion, icons, charts, cards, fields, controls, navigation, surfaces, data presentations, content states, responsive behavior, RTL, documentation contracts, and the Phase A changes themselves. Dark Mode / System Dark are out of scope by owner decision and were not evaluated.

---

## 1. Methodology and files/tools inspected

All 11 Pixilated skills from `_audit-resources/pixilated-ux-ui-skills-kit/` were read in full (README + every `SKILL.md`) and applied as review lenses; the kit itself was not edited. Reviewers worked in parallel, each assigned specific skills, each read-only, each returning evidence-graded findings that were then cross-verified against source before admission to this register.

| Review lane | Skills applied | Method highlights |
| --- | --- | --- |
| B-1 | `ux-researcher-agent`, `ux-manager` | Main Job card (hypothesis, medium confidence), NN/g 10-heuristic scan, WCAG 2.2 pass, live Playwright probes of Showcase + example pages at 320/360/390/430 × RTL/LTR × DPR 1/2 (`/tmp/uxprobe/`), manager gate (Apple/Google/IBM critiques + verdict) |
| B-2 | `interaction-designer-agent`, `edge-case-hunter` | Flow integrity, cognitive load (Hick/Miller/Fitts), Saffer microinteraction anatomy, full state-taxonomy sweep (universal/content/input/permission/network/device/context), probes incl. `destroy()`/double-init/`setData`-while-loading |
| B-3 | `ux-writer-agent`, `brand-auditor` | Arabic clarity/consistency/error-copy/pluralization audit of every UI string; brand score per rubric; terracotta inventory; icon-set consistency (all 32 asset SVGs inspected); token-trace color audit |
| B-4 | `design-systems-agent`, `design-direction` | Token coverage matrix (11 categories), tiering audit, hardcoded-color and physical-property inventories, RTL logical-property sweep, catalog↔inventory↔showcase↔standalone consistency, light-only boundary verification |
| B-5 | `ui-designer-agent` (incl. technique-index knowledge base), `ui-manager` | Visual execution vs mobile-native standards from committed screenshots (`reviews/UI-SYSTEM-SHOWCASE/screenshots/`, `docs/zai/evidence/`) + fresh 320/390 probes with computed-style contrast math; build-vs-spec sampling; component maturity table |
| B-6 | `anti-ai-slop` (catalogue + fixes read) | Kit's own `slop_scan.py` reproduced per directory (544 machine findings), every finding classified visible-UI / dev-only / doc-only / false-positive with context verification, plus manual grep passes for the five owner non-negotiables |

**Tools inspected (source-read, executed read-only where applicable):** `tools/light-release-check.py`, `light-static-check.py`, `light-calendar-check.py`, `light-data-check.py`, `chart-mobile-check.py`, `component-mobile-check.py`, `ui-system-showcase-check.py`, `ui-system-showcase-repair-check.py`, `component-catalog-build.py --check`, `build-ui-system-showcase-standalone.py --check`, `preview-runtime-check.py --base`, `manifest-build.py`. All recorded results at this commit: release **792/0**, static **169/169**, calendar **85/0**, data **165/0**, chart **59/0**, component-mobile **52/0**, showcase **118/0**, repair-check **88/0**, runtime **112/112**, catalog/standalone/syntax **PASS** (Phase A report §6).

**Primary files inspected:** `shared/tokens.css`, `shared/motion.css`, `shared/icons.js`; `components/*/{*.css,*.js,specification.md,example-usage.html,README.md}` for all 14 families; `previews/ui-system-showcase/{index.html,showcase.css,showcase.js}`; `previews/**` boards; `docs/*.md` (esp. `CURRENT-STATE.md`, `SYSTEM-CONTRACTS.md`, `COMPONENT-CATALOG.json`, `UI-VISUAL-SYSTEM.md`, `UI-DECISIONS.md`); `AGENTS.md`, `DESIGN.md`, `MANIFEST.json`; `assets/icons/*.svg` (32 files); `docs/zai/FINAL-REPAIR-REPORT-2026-10-24.md` + evidence.

---

## 2. Finding-severity convention and register

Severity: **blocker / critical / major / moderate / minor / observation**. Every finding below was verified in source at `85271a9` by at least one reviewer and spot-verified by the aggregator (marked ✓). "Fixed in Phase A?" reflects the Phase A changes only. The full deduplicated register consolidates 63 reviewer findings; source IDs (UXF/INT/EDGE/COPY/BRAND/SYS/DIR/VIS/SLOP) are preserved for traceability.

### 2.1 Consolidated finding register — confirmed findings

| ID | Severity | Skill source | Location | Evidence | Why it matters | Recommended correction | Fixed in Phase A |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | **major** | ux-researcher UXF-1 · design-systems SYS-2 ✓ | `docs/CURRENT-STATE.md:7` | Still teaches «…يقدم Picker **وDate Rail** عند الضيق، والشبكة عند اتساع الجذر» — the rail no longer exists (`order-schedule.js:391-397` renders only `month-grid`) | `CURRENT-STATE.md` is item 3 of AGENTS.md's mandatory reading order; the entry doc contradicts spec, code, and the 85/0 gate — documentation decay in the exact trust chain the system sells | Rewrite the sentence to the 2026-10-24 contract (complete compact grid at every root, `data-ocal-compact` <360px, honest browsing panel) | No |
| R-02 | **moderate** | ux-researcher UXF-2 · interaction INT-1 ✓ | `components/order-schedule/order-schedule.js:272-276` | `state.rtl` captured once at init; probe: State Lab LTR flip leaves the prev-arrow pointing right and `ArrowLeft` moving focus +1 (RTL semantics) while layout flips | Hosts that flip `dir` dynamically get a calendar whose affordances/keyboard contradict its visuals; carousel/peek already solve this with a direction observer | Re-evaluate direction in `render()` or attach an ancestor `dir` MutationObserver; also document init-time capture as a known limit | No |
| R-03 | **moderate** | interaction INT-2 ✓ | `components/info-strip/info-strip.css:166` + `info-strip.js:103-136` | Track hard-codes `direction: rtl`, but keyboard maps arrows by host direction and swipe hard-codes RTL; probe in LTR host: `ArrowLeft` dead at 1/3, `ArrowRight` advances opposite to visual next | In the supported LTR mode the strip's two input channels contradict each other and the visuals (peek engine is direction-correct — precedent exists) | Make keyboard/swipe follow the forced-RTL track geometry, or adopt the peek physical-measurement pattern | No |
| R-04 | **moderate** (source: critical as house rule) | ux-writer COPY-1 · anti-slop SLOP-1..7 ✓ | `components/selection/picker.js:113`; `components/access-gateway/access-gateway.js:207,234,257`; `components/data/data.js:139-140,259,561,623,658,895,916,1194-1197,1314,1477`; `components/data/packed-circle.js:140,176-195` | Em-dash (—) as visible UI punctuation/value placeholder in ~30 product-UI strings (e.g. «لا نتائج مطابقة — جرّب اسمًا آخر.»; reading fallbacks «— غير متاح»); plus ~17 showcase/demo-chrome instances (R-17) | Owner non-negotiable #2 "no dashes in text"; one glyph carrying three meanings (separator, annotation, null) | Mechanical O3 rewrite per `fixes.md`: full stops/commas; parentheses form for value states «(غير متاح)»; keep the drawn dash-rectangle as the chart null marker, drop the text dash | No |
| R-05 | **moderate** | ux-writer COPY-2 | `components/data/packed-circle.js:191-197` | Visible refusal error leaks the attribute name `data-max` and config instructions into product UI | NN/g: no developer jargon in user errors; sibling `data.js:518-526` already models the correct user/dev split | Mirror `renderScaleRefusal` pattern: visible «تعذر رسم المقارنة بهذا المقياس. القيم معروضة في المفتاح دون رسم.»; diagnostics to `data-scale-detail` | No |
| R-06 | **moderate** | ui-designer VIS-1 ✓ · ux-researcher UXF-6 | `shared/tokens.css:94,96` | `--micro-data-c: #B6A3D6` = 2.28:1 and `--micro-data-e: #B3BD7B` = 2.00:1 on white — below the WCAG 1.4.11 3:1 non-text floor; adjacent-series separation as low as 1.37:1 | Donut/legend series in lavender/olive are hard to distinguish from surface and each other; text integrity is fine (readings always rendered) so color is never the sole channel — but the graphic floor is missed | Darken both tokens within their hues to ≥3:1 on `--ui-surface`; re-step adjacent series ≥3:1 luminance apart | No |
| R-07 | **major** | ui-designer VIS-2 | Donut renderer, `components/data/data.js` (slice circles, stroke-width 16) | Donut arcs carry no per-slice 1px `--micro-data-boundary` stroke, unlike bars/dots/bubbles/packed-circle | One chart family held to a lower boundary standard; with R-06 adjacent slices merge | Add a non-scaling 1px boundary stroke per slice (packed-circle inset-ring pattern) | No |
| R-08 | **moderate** | ui-designer VIS-3 | `components/buttons/specification.md:32,44,108` vs `tokens.css:109-110` + `buttons.css:68` | Spec says padding 20/12, rest shadow `0 3px 8px` 14%, radius 24 — build has 16/10, no rest shadow, radius 12 (Geometry B) | Build-vs-spec drift in the most-consumed family; header says contracts supersede but tables were never reconciled | Update spec §3.1/§3.3/§5 to Geometry B, mark old values historical | No |
| R-09 | **moderate** | design-systems SYS-1 ✓ | `shared/tokens.css:159` ↔ `components/metric-comparison/metric-comparison.css:385-387` | Same token name `--micro-metric-hero-separator` defined as 16px (length) in tokens and as `rgba(255,255,255,0.16)` (color) in the component | Type-collision landmine in the single source of truth; consumers outside `.m-main-metric` get an invalid shadow | Rename the component token (`…-separator-color`) or delete the orphan 16px definition | No |
| R-10 | **moderate** | design-systems SYS-4 | 64 `font-weight` declarations across 12 component CSS files | Weights 400/500/600 hardcoded; only 2 weight tokens exist | A system-wide optical weight change is a 64-site edit instead of a token flip | Add `--micro-weight-regular/medium/semibold` + aliases | No |
| R-11 | **moderate** | design-systems SYS-5 | `components/organization/organization.css:23-26`; `showcase.css:208-209`; `access-gateway.css:17-20`; `data.css` (5×13px) | Section title 18px with **fixed 28px line-height** and other raw type levels outside the token source; fixed line-height clips under text-only zoom | A real level of the documented scale ("قسم 18/28") lives outside tokens; contradicts the relative line-height rule | Add a section-title size/line token pair; swap 22px/13px to existing tokens | No |
| R-12 | **moderate** | design-systems SYS-6 | `navigation.css:176,184` (z 80/85); `messages.css:94` (z 90) | Z-index literals with no scale or stacking contract | Cross-family stacking (toast > layer > sheet) relies on invisible convention | Define `--micro-z-*` ladder tokens or document the current ladder in SYSTEM-CONTRACTS | No |
| R-13 | **moderate** | interaction INT-3 | `order-schedule.js:403-410` | `render()` hides the views bar during loading/error; loading has no exit, error only the consumer retry | A transient state with no escape hatch; costs nothing to keep the switcher visible | Keep `buildViewsBar()` above the status box (or render disabled with `aria-busy`) | No |
| R-14 | **moderate** | interaction INT-4 | `order-schedule.js:963-967` | In-flow picker is a non-modal `role="dialog"`; Escape handled only by root-delegated keydown; tabbing away leaves it open with stale `aria-expanded="true"` and no key recovery | Keyboard dead-end on a primary control | Document-level Escape fallback while `pickerOpen` (m-layer precedent, `navigation.js:586-590`) | No |
| R-15 | **moderate** | edge EDGE-1 | `components/info-strip/info-strip.js:160-166` | `MicroInfoStrip` exposes `init` only — no `disconnect`/destroy/re-scan; slides snapshotted at init | Async-rendered cards are never picked up and listeners can never be torn down (all sibling engines have teardown) | Add `disconnect` + re-scan, or document "static content only" as a hard limit in the spec | No |
| R-16 | **minor** | ux-writer COPY-3 | `data.js:684,713` vs `573,580,805,807,826,833,1085,1420,1427`; `packed-circle.js:191,277`; `order-schedule.js:899` | «تعذّر» vs «تعذر» orthographic split of the most frequent error verb | Consistency audit failure on the highest-frequency error string | One form («تعذّر») via a shared string table | No |
| R-17 | **minor** | ux-writer COPY-4 · anti-slop SLOP-11 | `access-gateway.js:171,187,257`; `previews/system/index.html:75` | Three sentence-level retry phrasings («أعد المحاولة.» / «حاول مجددًا.» / «حاول مرة أخرى.») against one button label «إعادة المحاولة» | Same action, three sentences | Standardize: «أعد المحاولة.» in messages | No |
| R-18 | **minor** | ux-writer COPY-5 | `data.js:140,259,561` vs `1316,1317,1448` | Same value states rendered as `value — state` in chart readings but `value (state)` in table/bubble paths | Identical conditions, two visible wordings (AT users hear both) | Standardize on parentheses; keep the dash exclusively out of prose | No |
| R-19 | **minor** | ux-writer COPY-6 | `access-gateway.js:207` | Host-configuration fault (missing required inputs) phrased as a user task («تأكد من اكتمال حقوله») | Blame-shift; the user cannot fix a host form | Neutral honesty: «نموذج الدخول غير مكتمل. تواصل مع المسؤول إن تكرر ذلك.» | No |
| R-20 | **minor** | ux-writer COPY-7 | `navigation.js:393-404` | Filter count «فلتر واحد»/«N فلاتر» — no dual («فلتران»), 11-99 wrong case | Arabic pluralization rule (6 forms) applied inconsistently; `countPhraseAr` proves the system knows how | Shared Arabic count-phrase helper for فلاتر | No |
| R-21 | **minor** | ux-writer COPY-8 | `order-schedule.js:131-137` (usage 634, 790, 800, 880) | `countPhraseAr` correct 0-99 but 100+ blanket-returns singular («102 طلب») — reachable in the browsing month line | Realistic >100 surface (showcase itself mentions «132 طلبًا») | Derive the 100+ phrase from last two digits | No |
| R-22 | **minor** | ux-writer COPY-9 · anti-slop | `carousel.js:234,265` vs `picker.js:108`, `order-schedule.js:849,864-868` | Empty-state punctuation convention mixed (period vs none); non-parallel section headings | Small consistency drift on standard surfaces | Trailing-period state-line convention; «الطلبات غير المجدولة» | No |
| R-23 | **minor** | ux-writer COPY-10 | `picker.js:113` | «جرّب اسمًا آخر.» assumes name-search (demo fixture), but the primitive matches any option text | Demo-specific advice inside a generic primitive | «لا نتائج مطابقة. عدّل كلمة البحث.» | No |
| R-24 | **minor** | anti-slop SLOP-8 | `order-schedule.js:728-729` + `order-schedule.css:605-611` | 8px status dot span at the start of every order-row status chip; the word + full semantic tint already carry the state | Non-negotiable #5 "no dots in chips"; the dot is redundant | Delete the dot span (+CSS block) | No |
| R-25 | **minor** | anti-slop SLOP-9 · brand | `components/info-strip/info-strip.css:36` | `border-inline-start: 3px solid var(--micro-brand-accent)` on the accent card's label edge — owner-sanctioned limited accent, count-asserted to exactly 1 by the release check | O1 tell vs owner rule tension; geometry-based emphasis has a color-only alternative | Keep terracotta emphasis but move it off the geometry (label/number color) — recommendation only | No |
| R-26 | **minor** | anti-slop SLOP-10 | `components/data/data.css:181` (+167-169) | 3-4px severity stripes on the chart error/scale-note callouts which already carry full semantic tints | fixes.md O1: tint allowed, stripe never | Drop the side borders, keep tint + status word | No |
| R-27 | **minor** | interaction INT-5 ✓ | `order-schedule.js:1244-1252` | `destroy()` leaves `data-ocal-layout/-compact/-selected-date` on the root while the spec declares post-destroy state non-operational | Residual contract attributes can mislead host code/tests | Remove the three attributes in `destroy()` | No |
| R-28 | **minor** | interaction INT-6 | `order-schedule.js:35` + `specification.md:66` | «لا مؤقتات ولا rAF داخل المكوّن أصلًا» vs the transient resize `requestAnimationFrame` (added by 8d3e84d) | A stated invariant the code violates (the rAF itself is justified) | Amend wording: no permanent timers; transient rAF for resize coalescing, cancelled in destroy | No |
| R-29 | **minor** | design-systems SYS-10 · interaction INT-7 ✓ | `components/order-schedule/specification.md:152` | §10 "أين أعدّل؟" still points at `.m-ocal__rail-day` — removed by Phase A | A consumer following §10 edits a nonexistent selector | Replace with `.m-ocal__gridrow`/`.m-ocal__cell` | No |
| R-30 | **minor** | design-systems SYS-11 | `docs/SYSTEM-CONTRACTS.md:19` | Geometry B spacing table omits the existing 20px step (`--micro-space-5`) | Contract table ≠ token scale | Add 20 to the table | No |
| R-31 | **minor** | design-systems SYS-3 ✓ | `MANIFEST.json` | Contains 20 `docs/zai` entries but not `docs/zai/FINAL-REPAIR-REPORT-2026-10-24.md` (generated before the report was written) | The declared delivery fingerprint lags the tree | Re-run `python3 tools/manifest-build.py` after the review commits | No |
| R-32 | **minor** | edge EDGE-2 | `components/selection/picker.js:101,113` | Search is raw case-/diacritic-sensitive `indexOf` — Latin/mixed labels give false «لا نتائج مطابقة» | Asymmetric match behavior between Arabic and Latin labels | Lowercase + NFD diacritic-strip before match, or document Arabic-only matching | No |
| R-33 | **minor** | edge EDGE-3 | no `forced-colors` handling anywhere (grep-verified) | Windows High-Contrast/forced-colors mode neither handled nor listed in NOT-RUN | The only device-state row without any treatment or documented exclusion | Add a SYSTEM-CONTRACTS note + minimal `forced-colors-adjust` fallbacks, or record it explicitly as NOT RUN | No |
| R-34 | **minor** | edge EDGE-4 | `previews/ui-system-showcase/showcase.js:98-106` | Showcase gateway demo resolves fake `{authenticated:true}` → «تم الدخول بنجاح.» with no per-message demo flag (component itself never fakes) | Demo success can be read by stakeholders as real capability | Resolve `{authenticated:false, message:'محاكاة عرض…'}` or add demo tone | No |
| R-35 | **minor** | edge EDGE-5 | `components/fields/` (no password input) vs `access-gateway.js:95-143` | The exemplary selection-preserving password-reveal microinteraction exists only inside the gateway composition | Consumers building forms outside the gateway can't reuse the pattern | Extract the reveal contract into the fields spec (or document gateway-only) | No |
| R-36 | **minor** | brand BRAND-4 | `order-schedule.js` inline SVGs (`stroke-width:'2'`) vs `assets/icons/*.svg` (all `1.5`) | Calendar chevron/clock/plus icons visibly heavier than the HugeIcons set used everywhere else | One icon style rule; mixed stroke weights in the same UI | Regenerate the three glyphs as 1.5 assets, or document the 2px self-contained rule as approved deviation | No |
| R-37 | **minor** | brand BRAND-5 | `assets/icons/delete-02.svg` | Only asset missing `stroke-linejoin="round"` (31/32 have it) | Icon-set consistency | Add the attribute (`icon_normalize.py` exists for this) | No |
| R-38 | **minor** | brand BRAND-6 | `previews/ui-system-showcase/showcase.css:137` | `font-weight:700` while only 400/500/600 files ship → silent faux-bold (preview chrome) | "A font that silently falls back is a finding" | Use 600 | No |
| R-39 | **minor** | brand BRAND-7 · design-systems SYS-8 | `previews/index.css` (17 raw hexes), `previews/system/system.css` (6), `showcase.css`/`index.html` theme-color | Library index/system "front door" chrome uses off-token petrol tints; showcase.css:5 asserts tokens-only | First surface a consumer copies doesn't trace to the token source | Tokenize as tint aliases or derive via `color-mix` | No |
| R-40 | **minor** | design-systems SYS-9 | `previews/index.css:92-93` | Leftover `[data-theme="dark"]` selectors in a Light-only release (inert but semantically dead) | Contradicts the Light-only boundary hygiene | Delete the two rules | No |
| R-41 | **minor** | ux-researcher UXF-3 | `order-schedule.js:55` (`WEEKDAYS_SHORT`) | Mid-word truncations «إثن/ثلا/أرب/خمي» — a Latin abbreviation convention applied to Arabic morphology (aria impact nil; header is `aria-hidden`, full names in cell labels) | Authenticity cost on the most-looked-at Arabic calendar surface | Review with an Arabic copy standard (fuller short forms at reduced size) | No |
| R-42 | **minor** | ux-researcher UXF-4 | `order-schedule.js` h3/h4 (also other families) | Hardcoded heading levels; no host outline adjustment option | Component imposes its own outline on hosts | `data-ocal-heading-level` option or `role="heading"`+`aria-level` | No |
| R-43 | **minor** | ux-researcher UXF-5 ✓ | `previews/ui-system-showcase/index.html:1143` | `aria-label` on a role-less div (discarded by AT); State Lab LTR toggle note covers width but not the direction caveat (R-02) | Dead accessibility attribute on the showcase's component mount | Remove or add `role="region"`; extend the honesty note | No |
| R-44 | **minor** | ui-designer VIS-4 | `components/fields/specification.md:20` vs its own header | Body says radius 16, header/contracts say 12 | Internal spec self-contradiction | Change §2 to 12px | No |
| R-45 | **minor** | ui-designer VIS-5 | `buttons.css:25,82`; `fields.css:54,110` | CSS comments state stale pixel values (12px/20px/16px) that disagree with the tokens they cite | "CSS is the runtime source of truth" — comments are the one place values lie | Replace value comments with token names | No |
| R-46 | **minor** | ui-designer VIS-6 | `buttons.css:28` | `min(var(--micro-radius-button-long), 50%)` is vestigial — always 12px for any real button; comment promises a capsule that never occurs | Dead behavior documented as live | Plain 12px + corrected comment | No |
| R-47 | **minor** | ui-designer VIS-7 | `order-schedule.css:397-418` | Compact day cell at 288px root leaves 2.7px slack before the badges (count + 3 dots) wrap inside the cell (graceful; row floor absorbs it) | The tightest constraint in the system; wrap is graceful but undocumented | Document wrap-as-designed or reduce dots to 5px at compact | No |
| R-48 | **minor** | design-direction DIR-3 | `docs/UI-DECISIONS.md:5` | Historical "Dark الآن" phrase without inline annotation of the 2026-10-24 Light-only inversion | Historical doc can mislead on the current boundary | Annotate "(تاريخيًا — أُلغي بقرار Light-only 2026-10-24)" | No |
| R-49 | **minor** | design-direction DIR-4 | `components/surfaces/surfaces.css:66-75` | Waves variant still labeled «المرشح الأساسي» while A04 adopted curves as default | Comment drift inside a component file | Re-tag waves as historical comparison | No |
| R-50 | **minor** | design-direction DIR-2 | `previews/index.css:9-25`, `system.css:4-10` | The petrol hero (a real statement of the visual direction) is untokenized and its scope undocumented | Direction surface exists only as raw chrome hex | Tokenize the tint ramp or mark hero preview-chrome-only in UI-VISUAL-SYSTEM | No |
| R-51 | **minor** | interaction INT-2 sub | `info-strip.js` swipe mapping | Swipe handler hard-codes RTL (`dx > 0 ? +1 : -1`) independent of the keyboard path | Two gesture channels can disagree in LTR hosts (sub-case of R-03) | Unify on track geometry | No |
| R-52 | **observation** | interaction INT-8 | `showcase.js:391-401,294-297` | Switching to State view forces filter 'all' without syncing the `#sc-filter-seg` pressed state | Audit instrument's control state can disagree with reality | Sync pressed state in `setShowcaseView` | No |
| R-53 | **observation** | interaction INT-9 | verified by probe | Day view → month view returns to the browsed month (honest browsing panel) rather than snapping to the selected day's month | Defensible per contract; small wayfinding surprise | Optional: snap `monthCursor` to selected month on mode re-entry | No |
| R-54 | **observation** | ux-writer COPY-11 | `metric-comparison.js:316` + showcase hint | Signed track copy is truthful (direction-locked geometry) but the showcase hint adds a misleading «في RTL» qualifier | Directional-language rule vs fixed physical geometry | Fix the showcase hint wording only | No |
| R-55 | **observation** | ux-writer COPY-12 | loading strings | «…» on status lines vs none on button loading labels — undocumented two-surface convention | Defensible but unwritten | Document the ellipsis rule | No |
| R-56 | **observation** | anti-slop SLOP-14 | kickers/eyebrows (`MICRO · UI SYSTEM SHOWCASE` etc.) | All-caps kickers with explicit `letter-spacing: 0` for Arabic, real section numbering | Mitigated pattern; Latin-only tracking | Optional: fold numbering into headings | No |
| R-57 | **observation** | anti-slop SLOP-16 | `buttons.css:23-26` + tokens | Declared padding ratio 1.6; with 48px min-height the effective ratio ≈1.33 (borderline vs the 1.4-3 band) | Needs rendered measurement to settle | Verify computed boxes; consider `padding-inline: 20px` | No |
| R-58 | **observation** | ui-designer VIS-8 | `data.css:258` gridlines | Gridlines 1.28:1 (faint) vs strong zero axis 6.16:1 | Defensible hierarchy; flagged for outdoor legibility | Optional gridline token decision | No |
| R-59 | **observation** | ui-designer VIS-11 | `buttons.css:323-405` | Three loading-compat APIs coexist with the default | Compatibility surface larger than default path | Mark compat classes for deprecation | No |
| R-60 | **observation** | brand BRAND-3 · anti-slop FP | `metric-comparison.css:342`, `data.css:181` machine O1 hits | Zero-marker on aria-hidden track = data encoding; info-edge = semantic — scanner false positives (correctly dropped) | — | None (documented as FPs) | n/a |
| R-61 | **observation** | design-systems SYS-7 | `order-schedule.js:460`; `@container` thresholds | 360px responsive threshold as unnamed literals mirrored across JS/CSS/docs | Documented in spec §8; single named constant would help | Accept as documented or hoist a constant pair | No |
| R-62 | **observation** | design-systems SYS-12 | `tokens.css:36,72,83-96,175` | Some semantic aliases are raw hex without primitive parent; `--micro-summary-light-mid` duplicates selected color without the "distinct roles" annotation `--micro-data-a` carries | Tier-boundary hygiene | Optional annotation | n/a |
| R-63 | **observation** | edge EDGE-8 | whole tree | Offline/reconnecting states have no representation — correct for a static design system, but never explicitly scoped out | Contract completeness | One sentence in SYSTEM-CONTRACTS | No |

**Phase A verification (confirmed fixed, evidence-graded):** A1 unit-wrap contract present and effective at 320/360/390/430 (probe: `doc == viewport` in all; `unitInsideCard: true` with `Unavailable` at 200% type); A2 complete compact grid (31/31 days at 288/328/358/398 roots, RTL+LTR, `data-ocal-compact` flips at 360 with no re-render or focus loss, honest browsing panel + `add-request date:null` verified in the real Showcase, month title/grid/panel coherent across prev/next, year boundary, picker); A3 not reproduced (7 RTL measurement cases, zero overflow, zero clipped controls). Verified independently by lanes B-1, B-2, B-5.

### 2.2 Unproven risks (explicitly separated from confirmed findings)

1. **A3 owner screenshot clipping** (`اليوم`/`إضافة طلب` left edge): not reproduced by Phase A's 7-case measurement sweep nor by two independent review probes. If real, the cause lives outside this tree's rendered output (stale build, browser zoom, or DPR rendering artifact). Kept as an open risk; no speculative fix was added.
2. **Chromium-only verification.** Every check (repo + review) is headless Chromium. Real Android/iOS, WebKit/Safari, true touch, TalkBack/VoiceOver, native OS zoom, and safe areas remain the repo's own declared NOT-RUN list; the a11y verdict is conditional on that disclosed gap.
3. **Compact-grid motor accuracy on real thumbs** (37.7px-wide day cells at 288px roots): meets the documented contract (h≥48, w≥24 WCAG 2.5.8), but real-touch accuracy is untested (no touch hardware in scope).
4. **`.showcase-canvas` self-targeting container query** (`showcase.css:177-179`) is a no-op in Chromium 143; behavior at the 360px compact boundary is engine-dependent if a future engine resolves container queries against the viewport.
5. **Font-load race windows** in peek/carousel re-measurement (generation counters present; correct by inspection, not stress-tested under slow font delivery).
6. **Contrast certification scope**: review contrast math is token/computed-value based on ~60+ sampled pairs plus the repo's measured pairs; it is not a full-page WCAG certification.
7. **Consumer-side rebrand surface**: hosts can legally re-point accent/data tokens from outside the repo; audited proportions and semantics rely on documented contracts at the boundary.
8. **Perceived honesty of the gateway demo success** (R-34's fix) — user-perception untested.
9. **RTL screen-reader announcement of punctuation** («؛», «…», the chart null glyph): untested, per the standing NOT-RUN list.

---

## 3. Component-by-component review

Maturity 0-5 from lane B-5 (visual execution + state architecture), cross-checked against B-1/B-2 interaction and state findings.

| Family (prefix) | Maturity | Verdict summary |
| --- | --- | --- |
| buttons (m-btn) | **5** | Full state set (incl. loading with dimension stability and activation guard), reduced-motion, token-composed focus ring; only spec/comment drift (R-08, R-45, R-46, R-57) |
| fields (m-field) | **5** | Every state incl. readonly/error+focus combos, 48px embedded clear/stepper with relocated ring, numeric LTR isolation, 11ch reading floor; spec radius contradiction (R-44) |
| selection + picker (m-choice/m-seg/m-switch/m-picker) | **5** | 40px visual + real 48px hitbox, aria-disabled parity, tokenized hover; picker focus paths complete (R-32 search normalization minor) |
| navigation (m-nav/m-layer/m-tab) | **4.5** | Layers/inert/scroll-lock/focus restore excellent; inactive items 6.16:1; z-ladder untokenized (R-12); filter plural (R-20) |
| order-schedule — calendar (m-ocal) | **4.5** | Phase A compact grid measured exact (37.7/47.7 × 48, no overflow at any width), honest browsing panel, roving keyboard, RTL/LTR arrow semantics; docked for: dir-at-init capture (R-02), picker Escape edge (R-14), views bar hidden in loading (R-13), destroy residue (R-27), weekday truncations (R-41), heading levels (R-42), badge slack (R-47), icon stroke weight (R-36); DRAFT status acknowledged |
| data — charts (m-chart) | **4** | Best-in-class honest-data marks (visible zero, dashed unknown, slashed-none, outlier marks, overscale disclosure, full readings table, refusal with user/dev split); docked by series contrast (R-06) and faint gridlines (R-58) |
| data — packed-circle (m-packed) | **3.5** | PROPOSED; inset boundary ring + dark-ink override on light series; inherits series contrast (R-06) and the dev-jargon leak (R-05) |
| metric-comparison (m-metric) | **4** | Signed axis fixed-by-key series mapping, fallback rows, disabled track; token name collision (R-09); FP zero-marker correctly exempted from slop |
| info-strip (m-info-card/m-info-strip) | **4.5** | 48px arrows, disabled/focus states, Phase A unit-wrap fix verified; LTR keyboard/swipe split (R-03/R-51); no teardown (R-15); accent edge stripe (R-25, owner-sanctioned) |
| info-strip-peek (m-peek) | **4.5** | Genuine progressive-disclosure pattern; direction observer is the codebase's own best-practice precedent |
| messages (m-note/m-toast/m-skeleton) | **4.5** | Semantic roles, static alternatives for transient content, honest toast contract |
| organization (m-receipt/m-badge) | **4.5** | Receipt-style label/value edges, accent badge 4.61:1, focus rings on rows and section heads; raw 18/28 type level (R-11) |
| account-settings (m-settings) | **4.5** | View `[hidden]` contract, back-row focus z handling, 72px rows, re-centering contract documented |
| access-gateway (m-gateway) | **4.5** | Local-demo honesty contract (userMessage-only error channel), selection-preserving reveal (R-35 reuse gap), zero console errors; dash copy (R-04) and demo-success framing (R-34) |
| carousel (m-carousel) | **4** | No autoplay, visible prev/next fallback, 48px pager dots; empty-state punctuation (R-22) |
| surfaces (m-surface/curves) | **4** | Approved curves well-executed (aria-inert, static, 2-4% fields); waves label drift (R-49) |
| Showcase chrome (sc-*) | **5 (as review tooling)** | Explicitly labelled not-product-UI; width/RTL/stress/diagnostics controls; the LTR comparison caveat and filter-state sync are the only nits (R-43, R-52) |

---

## 4. Responsive matrix (RTL default; widths = browser viewport; host = Showcase canvas)

| Viewport | Canvas → component root | Calendar presentation | Document/component overflow | Command targets | Day-cell targets | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 320 | 320 → 288px | Compact full grid (`data-ocal-compact="true"`), 31/31 days | None (doc == viewport; root scroll ≤ client) | All ≥48px (nav 48×48, today 64×48, add 132×48) | 37.7×48px (≥24×48 documented contract) | Badges wrap gracefully inside cells; weekdays single-line |
| 360 | 360 → 328px | Compact full grid | None | ≥48px | 43.4×48px | Boundary sits at root 360, not viewport |
| 390 | 390 → 358px | Compact full grid | None | ≥48px | 47.7×48px | Default Showcase state; the five-date rail defect is gone |
| 430 | 430 → 398px | Wide grid, square cells | None | ≥48px | ≥48×48 | `data-ocal-compact="false"` |
| 525 (wide host) | 390 → 358px (default) / 320 → 288px (narrowest control) | Compact full grid | None | ≥48px | 47.7×48 / 37.7×48 | The owner-screenshot scenario (A3): not reproduced, evidence committed |
| LTR (all widths) | same roots | same geometry (logical CSS) | None | ≥48px | same | **R-02/R-03**: runtime `dir` flip after init leaves calendar icons/keyboard and info-strip inputs on RTL mapping until reload |

Enlarged typography (200% simulation): 64-case release matrix passes (fonts ≥1.99×, no page overflow); rows grow vertically instead of clipping (row floor `max(2.7em, 48px)`).

---

## 5. RTL/LTR and long-text findings

- **RTL architecture is genuinely logical-first**: zero physical `margin-*`/`padding-*` in components; `text-align: start/end` everywhere except documented isolates. The five deliberate physical-island exceptions were each verified as justified: numeric LTR isolates (~15 sites, `unicode-bidi: isolate` + `tabular-nums`), info-strip track `translateX` shift, carousel/peek physical measurement, ocal row-time isolate, and the metric signed-axis (`direction: ltr` container with `left:50%` zero line) — the last one is a defensible math-axis isolation that should get a one-line rationale comment (sub-case of R-54).
- **Direction reversal contract**: "RTL افتراضيًا؛ LTR يعمل معكوسًا" holds for fresh loads (verified for calendar keyboard, charts `data-axis-dir` re-render, picker per-event rtl, tabs, layers). The two seams are runtime direction *changes* (R-02, R-03) — the State Lab exposes a live flip that the calendar and non-peek strip do not follow.
- **Long unbroken text**: the `Unavailable` class of defect is closed at the unit level (A1); `overflow-wrap: anywhere` coverage was verified on every long-text surface (order rows, meta, legend, labels, titles, fields with 11ch/5ch floors). The stress fixtures (long Arabic order title, unbroken English value) pass at 200% type and 320px.
- **Arabic copy quality**: strong on tone (serious, plain, non-blaming, imperative CTAs, correct «جارٍ» orthography at 25+ sites); the consistency findings (R-04, R-16..R-23) are real but mechanical; pluralization is exemplary in `countPhraseAr` (0-99) with two edge gaps (R-20, R-21).

## 6. Charts and data-visualization findings

- **Integrity (strength):** signed domains declared (`data-value-domain`), missing points gap (not bridged), visible zero marks, unknown/negative/outlier textual marks, overscale refusal with user/dev detail split, full readings always rendered outside the graphic, `role="img"` + labeled legends. The system never lets color carry meaning alone.
- **Gaps:** series contrast floor missed for two tokens (R-06) and donut boundary inconsistency (R-07); gridline faintness is a recorded hierarchy decision (R-58); data-b (terracotta) vs data-e (olive) red-green separability noted by the slop lane as an observation.
- **Default vs opt-in:** bars/line remain the correct default comparison forms; donut/bubbles are host-opted; **metric-circles and packed-circle stay opt-in/PROPOSED — keep them that way** (they encode area comparisons that need the fallback rows the components already ship). No change recommended to defaults.

## 7. Cards, fields, buttons, controls, calendar, navigation, surfaces, messages, states

- **Cards:** no bordered non-interactive cards outside the three documented exceptions (accent label edge R-25, semantic callout edges R-26); strokes otherwise carry state only (selected/today/focus/control) — verified 22 `box-shadow: none` resets.
- **Fields:** model family — error+focus coexistence, single message node contract (FIELD-001/002/003 pass), success/clear cycle, 48px embedded actions with ring relocation, numeric isolation.
- **Buttons:** one primary per region enforced; loading contract stable; the only open items are spec/comment drift and the borderline padding ratio (R-08, R-45, R-46, R-57).
- **Controls:** 48px touch contract holds for all command controls at every width (release-asserted); selection's 40px-visual + 48px-hitbox pattern is documented and measured.
- **Calendar:** see §4 and the register (R-02, R-13, R-14, R-27, R-41, R-42, R-47); the Phase A contract itself verified sound in the real host.
- **Navigation:** layer system (inert, scroll-lock, focus restore, safe-area) enterprise-grade; z-ladder tokens missing (R-12).
- **Surfaces:** curves adopted and clean; token hygiene of the hero chrome (R-39/R-50) is preview-scoped.
- **Messages:** semantic role mapping and static alternatives correct; no findings above observation.
- **States:** the state × component coverage matrix (lane B-2) shows covered or partial everywhere except the four real gaps already in the register (R-15 strip teardown, R-33 forced-colors, R-35 field reveal reuse, R-03/51 LTR input mapping); loading/empty/error/retry are honest and announced (`role="status"`/`role="alert"`) in every family that has them.

## 8. Brand and tone findings (no new colors proposed)

- **Brand score: 90/100** (colour 23/25 · type 14/15 · icons 13/15 · voice 13/15 · charts+imagery 9/10 · consistency 18/20). No semantic failure → no cap.
- **Terracotta discipline verified**: component-level usage limited to three contracted state surfaces (buttons active-filter counter, organization accent badge, info-strip accent label edge) + `--micro-data-b` chart series (separately named, release-asserted distinct) + preview chrome. PASS — keep as is.
- **Token fidelity**: components/showcase CSS is 100% token-traced (0 raw hex in declarations); exceptions are preview chrome (R-39), documented fixed-size dots, and one switch-thumb shadow.
- **Type**: single self-hosted family pair with `unicode-range` split, weights 400/500/600 only, Arabic-safe line-heights, Western numerals isolated; findings R-38 (faux-bold 700 in preview), R-11 (18/28 level outside tokens).
- **Icons**: asset set uniform (24 viewBox, 1.5 stroke, round caps) except R-37 (one missing linejoin); the calendar's inline 2px set is the one mixed-weight case (R-36).
- **Logo**: correct variants per context (reversed on petrol header, full-color on light), no recoloring, favicon from v2 platform icons. PASS.
- **Voice**: consistently serious/plain/respectful; the deductions are the dash house-rule breach (R-04) and consistency artifacts (R-16..R-19) — all mechanical.

## 9. Anti-AI-slop findings

**Slop verdict: HEAVY by count, concentrated in one systemic tell.** Score: 8 P0 · 3 P1 · 5 P2 after classification — dominated by **~47 dash-in-visible-text instances** (R-04 product UI + R-17 demo chrome), one redundant status-dot pattern (R-24), two callout stripes (R-26), and the owner-sanctioned accent edge (R-25).

- Non-negotiable #1 (no cards with lines): ⚠️ near-pass — two surgical fixes away (R-25, R-26).
- Non-negotiable #2 (no dashes in text): ❌ the dominant tell (R-04, R-17, R-18, plus aria-text instances R-52-adjacent findings).
- Non-negotiable #3 (buttons padded properly): ⚠️ borderline — rendered ratio ≈1.33 (R-57); one token decision.
- Non-negotiable #4 (no icons in tiles): ✅ zero instances (the sole candidate is a skeleton placeholder).
- Non-negotiable #5 (no dots in chips): ⚠️ one pattern (R-24); carousel pager dots, today markers, and legend keys correctly exempted.
- **Clean elsewhere**: no purple gradients, glass, gradient text, emoji icons, icon tiles, repeated identical shadows, fake stats, AI vocabulary, or "Welcome back" copy; demo data is explicitly labelled «بيانات عرض ثابتة · ليست قراءة منتج».
- Scanner false positives correctly dropped with reasons (16 recorded, e.g. zero-marker data encoding, legend keys, dev-only diagnostics strings, 469 doc-only hits).

## 10. Prioritized post-review backlog (recommendations only — nothing applied during Phase B)

**P1 — must-fix before the next adoption round**
1. Rewrite `docs/CURRENT-STATE.md:7` to the 2026-10-24 calendar contract (R-01).
2. Mechanical O3 dash rewrite pass across product-UI strings (R-04, R-17, R-18) + delete `.m-ocal__row-statusdot` (R-24) + drop the two chart-callout side borders (R-26).
3. Reconcile `buttons/specification.md` §3/§5 and `fields/specification.md:20` to Geometry B (R-08, R-44); fix spec §10 rail pointer (R-29) and SYSTEM-CONTRACTS spacing table (R-30).
4. Darken `--micro-data-c`/`--micro-data-e` to ≥3:1 and add the donut per-slice boundary stroke (R-06, R-07).
5. Rename the `--micro-metric-hero-separator` collision (R-09); re-run `manifest-build.py` so MANIFEST includes the reports (R-31).
6. Resolve the info-strip LTR input mapping and add a direction observer to the calendar (R-02, R-03) — or document runtime-flip limits explicitly next to the LTR claim.

**P2 — should-fix**
7. Copy consistency pass: تعذّر form, retry phrasing, value-state parentheses, filter dual/plural, countPhraseAr 100+, punctuation convention, picker generic copy (R-16..R-23).
8. Interaction edges: keep views bar during loading (R-13), document-level Escape for the picker (R-14), destroy() attribute cleanup (R-27), rAF wording (R-28).
9. System hygiene: weight tokens (R-10), section-title token pair (R-11), z-ladder (R-12), preview-chrome hex tokenization + dark residue deletion (R-39, R-40), hero scope note (R-50).
10. Quality lanes: strip teardown/re-scan or documented limit (R-15), picker search normalization (R-32), forced-colors note (R-33), showcase demo-success framing (R-34), reveal contract placement (R-35), icon stroke alignment (R-36, R-37), faux-bold 600 (R-38).
11. Docs/annotations: UI-DECISIONS Dark annotation (R-48), waves label (R-49), weekday short forms review (R-41), heading-level option (R-42), showcase `aria-label`/note (R-43), offline scope sentence (R-63).

**P3 — polish/observations:** R-52..R-63 as listed.

## 11. Final verdict

**READY FOR MERGE — with documented follow-up.**

- Every required verification gate passes at the reviewed commit (release 792/0, static 169/169, calendar 85/0 under the corrected contract, data 165/0, chart 59/0, component 52/0, showcase 118/0, repair 88/0, runtime 112/112, catalog/standalone/syntax/diff clean).
- Both review gates concur: UX Manager **SIGN OFF WITH CHANGES**; UI Manager **ACCEPT WITH CHANGES**.
- No blocker or critical implementation defect was found in the repaired tree. The consolidated register contains 11 major/moderate findings, all documentation-, copy-, or bounded-contract-seam level, with a prioritized backlog (§10) whose P1 items are small, mechanical, and none require geometry or API redesign.
- The Phase A repairs themselves (A1 unit wrap, A2 complete compact month grid + browsing honesty, A3 not-reproduced with evidence) were independently re-verified in the real Showcase host by three review lanes.

## 12. Post-review commits

Phase B produced exactly two new documentation artifacts (this file and its JSON companion). No source code, tests, tokens, fixtures, or existing documentation were modified during Phase B. The backlog in §10 is recorded for the owner's next approved batch.

## 13. Statement of review integrity

- No code was modified during Phase B. The working tree contained only this report and its JSON at commit time.
- No additional branch was created; no merge was performed; `main` remains untouched.
- Reviewer scratch artifacts (probes, screenshots, scan JSONs) live outside the repository (`/tmp`) except where Phase A evidence was already committed under `docs/zai/evidence/`.
- Findings were admitted only after source verification; scanner/VLM leads that failed verification were dropped and recorded as false positives (16 recorded).
