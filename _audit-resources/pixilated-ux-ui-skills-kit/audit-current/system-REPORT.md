# Design Systems Agent — current-source audit

**Status:** APPLIED
**Scope:** Foundations, tokens, component contracts/lifecycle, layers, portability, dependencies, source/showcase/standalone consistency, delivery and related governance.
**Snapshot audited:** local `HEAD fc1e53e03048c38a451c8421e23cee58ab2b3a7a`; no remote refs or remote repositories queried.
**Findings:** 8 (`3 High`, `3 Medium`, `2 Low`; `6 CONFIRMED`, `1 LIKELY`, `1 NOT PROVABLE`).
**Files changed:** audit artifacts only. No product/source/docs/showcase/config files changed; no commit, push, or branch created.

## Context and limits

This is an independent UI/UX design-system repository under construction. This sub-audit treats examples as local visual/behavior fixtures—not real users, production data, analytics, personas, or measured journeys. Micro is future context only. No Micro consumer repository/application was opened, cloned, connected to, searched for, compared, or contacted. No external URL was contacted.

This is the design-systems specialist pass, not the combined product verdict. It applies the `design-systems-agent` audit checklist to current source/specification files and the tracked file inventory. It does not claim a complete usability or accessibility audit. The parent agent owns the wide 320/360/390/430 viewport and other-kit skill sweeps. I did not capture or inspect screenshots, so there are no visual claims based on screenshots in this sub-report. The calendar dimensions below are copied from the current geometry document, not independently re-measured in this pass, and the finding remains `LIKELY`.

## Skill application ledger — this sub-agent

| Skill | Loaded | Applied | Sources/families checked | Outcome |
|---|---|---|---|---|
| `design-systems-agent` | Yes; read full `SKILL.md` | Yes; token coverage, semantic roles, theme boundary, RTL, a11y token hooks, component coverage, docs quality, portability/governance applied to actual current source | `shared/tokens.css`, `shared/motion.css`, foundations/geometry/spec/index docs, all 14 component-folder CSS inventories and specifications; JS public API/lifecycle inventory across all component scripts; showcase source/generator, package scripts, manifest | 8 findings; see `system-findings.json` |

There are no references or scripts within `_audit-resources/pixilated-ux-ui-skills-kit/design-systems-agent/`; no adjacent skill's scripts were used for this assignment. The complete Skill file was read. The Skill's suggested real-time web search was considered but not performed because the brief explicitly prohibits contacting external URLs; no external trend/spec claims are made. The only executable audit helper authored here is `system-inventory.py`; it reads `git ls-files` and component CSS/specification files and writes only the permitted `system-inventory.json` artifact.

### Exactly consulted paths

**Brief and skill**

- `attached_assets/Pasted--Prompt-Replit-UI-UX-Design-System-Future-State--179283_1792833646913.txt` (read in full)
- `_audit-resources/pixilated-ux-ui-skills-kit/design-systems-agent/SKILL.md` (read in full)

**Foundations, system policy, geometry, status and delivery**

- `shared/tokens.css`
- `shared/motion.css`
- `DESIGN.md`
- `docs/foundations/Micro-UI-Foundations-V1.md`
- `docs/SHARED-SPEC.md`
- `docs/COMPONENT-GEOMETRY.md`
- `docs/COMPONENT-INVENTORY.md`
- `docs/CURRENT-STATE.md`
- `docs/UI-DECISIONS.md`
- `docs/UI-RELEASE.md`
- `components/README.md`
- `MANIFEST.json`

**Component specifications searched for sections/state coverage**

- `components/access-gateway/specification.md`
- `components/account-settings/specification.md`
- `components/buttons/specification.md`
- `components/carousel/specification.md`
- `components/data/specification.md`
- `components/fields/specification.md`
- `components/info-strip/specification.md`
- `components/messages/specification.md`
- `components/metric-comparison/specification.md`
- `components/navigation/specification.md`
- `components/order-schedule/specification.md`
- `components/organization/specification.md`
- `components/selection/specification.md`
- `components/surfaces/specification.md`

**Component CSS selector/variant scan and inventory parsing**

- `components/access-gateway/access-gateway.css`
- `components/account-settings/account-settings.css`
- `components/buttons/buttons.css`
- `components/carousel/carousel.css`
- `components/data/data.css`
- `components/data/packed-circle.css`
- `components/fields/fields.css`
- `components/info-strip/info-strip.css`
- `components/info-strip/info-strip-peek.css`
- `components/messages/messages.css`
- `components/metric-comparison/metric-comparison.css`
- `components/navigation/navigation.css`
- `components/order-schedule/order-schedule.css`
- `components/organization/organization.css`
- `components/selection/selection.css`
- `components/selection/picker.css`
- `components/surfaces/surfaces.css`
- `components/surfaces/curves.css`

**Component JS API/lifecycle scan**

- `components/access-gateway/access-gateway.js`
- `components/account-settings/account-settings.js`
- `components/buttons/buttons.js`
- `components/carousel/carousel.js`
- `components/data/data.js`
- `components/data/packed-circle.js`
- `components/fields/fields.js`
- `components/info-strip/info-strip.js`
- `components/info-strip/info-strip-peek.js`
- `components/messages/messages.js`
- `components/metric-comparison/metric-comparison.js`
- `components/navigation/navigation.js`
- `components/order-schedule/order-schedule.js`
- `components/organization/organization.js`
- `components/selection/selection.js`
- `components/selection/picker.js`

**Showcase/package/check implementation**

- `previews/ui-system-showcase/index.html`
- `previews/ui-system-showcase/showcase.css`
- `tools/manifest-build.py`
- `tools/build-ui-system-showcase-standalone.py`
- `tools/build-components-package.py`
- `tools/assemble-components-package.py`

The inventory JSON enumerates every tracked file (492) and contains per-family tracked paths, CSS/JS/spec/example/preview relationships, selectors, variant classes, and lexical state evidence. Files not listed above were counted/listed as inventory inputs only; this is not a claim that every tracked binary or every preview body was opened/read.

## System inventory and applied coverage

At this HEAD: **492 tracked files**, including 202 under `assets`, 61 under `components`, 72 under `previews`, 29 under `docs`, 23 under `tools`, 3 under `shared`, and kit/review/delivery assets. There are **14 component source folders**, with **15 logical entries** in the component inventory when the separate opt-in packed-circle data extension is counted.

`_audit-resources/pixilated-ux-ui-skills-kit/audit-current/system-inventory.json` is the machine-readable inventory. It preserves all 492 tracked file paths and records actual component CSS class/variant selectors and matching specification headings/state-bearing excerpts. Selector/state extraction is lexical: it identifies what to inspect, not whether every state is visually or behaviorally correct. The states marked draft/proposed remain distinct from stable status.

### Family-by-family future state

These recommendations are within this specialist remit; they do not certify rendering. One family can contain several independent contracts. Do not flatten those into a single generic “card/control” API.

| Family / current contract | State/variant evidence | Future-state direction | Owner decision options, recommendation and effect | Blocks? |
|---|---|---|---|---|
| **Buttons** | Primary/secondary/light/destructive/soft-destructive; icon/block/radius/loading; disabled/loading/focus/active | Keep one primitive and orthogonal visual/content modifiers; bind state to semantic roles. | Keep variants as orthogonal modifiers (**recommend**; simplest API, avoids near-duplicate families) vs separate button types (more discoverable but duplicated contracts). | No; only API naming/versioning. |
| **Fields** | Text/search/area/numeric/quantity, unit/clear/stepper, required/help/error/success/disabled/read-only/focus | One shell contract for label, description, status, slot and IDs; quantity is an opt-in subcomponent; consumer owns locale/value formatting. | Shared field shell with family-specific states (**recommend**; common layout and labels without fake uniform state) vs one state machine for all controls (simpler matrix but can expose meaningless success/read-only combinations). | Only blocks a future field API freeze. |
| **Selection** | Checkbox/radio/select-all/indeterminate, switch/pending, segmented/stack, picker ready/loading/error/empty/selected | Keep native input semantics; publish group keyboard/focus behavior; picker is a composite listbox, not another generic field. | Keep picker separate (**recommend**; distinct listbox/search contract) vs merge it into fields (fewer imports but obscures keyboard/list semantics). | No for current visual work; yes for API consolidation. |
| **Organization** | Rows, sections, badges, counters, identity/avatar fallback, missing value | Preserve composition-first primitives; define row action slots and distinguish decorative identity from interactive rows; use shared feedback role. | Keep small primitives (**recommend**; maximizes composition) vs create bundled organization panel (faster example assembly but imposes a domain-shaped grouping). | No. |
| **Data charts and metrics** | Stat, comparison, bars/line/donut/bubbles, progress/steps; missing/zero/negative/invalid/outlier; packed extension | Preserve raw/display/scale/missing distinction and full text readings; separate chart encodings; keep packed circles opt-in/proposed. | Split by encoding (**recommend**; each chart has honest math/state) vs unified chart API (fewer entry points but more flags and invalid combinations). Keep packed opt-in vs promote it (promotion risks implying its approximate overlaps mean sums/intersections). | Packed promotion blocked on owner approval; existing families need no new decision. |
| **Messages** | Inline tones/dismiss; toast; loading; announcement/dedup | Separate tone, persistence, dismissal/focus, announcement and duration; toast remains for noncritical feedback. | Toast below active modal (**recommend pending owner confirmation**; protects modal focus/context) vs toast above it (visible but can obscure modal action) vs host-defined. | Layer finalization is blocked by ordering decision. |
| **Navigation and layers** | App bar, tabs, bottom nav, action bar, modal/sheet, backdrop, filters | Separate navigation API from overlay mechanics; centralize global layer roles/edge ownership; preserve focus containment/restore and inertness. | Keep one folder but split contracts (**recommend**; no path migration, clearer architecture) vs physically split packages (clean ownership but broader dependency changes). | No; layer z-order decisions do block token finalization. |
| **Surfaces / curves** | Plain/calm/waves/depth and curve decoration | Keep decoration optional and subordinate to hierarchy; tie colors to semantic surfaces. | Opt-in surface treatments (**recommend**; no new default noise) vs automatic brand decoration (less per-use choice but may overdecorate dense compositions). | No. |
| **Info strip** | Full-card navigation and optional `data-info-peek`; compact controls | Retain the two separately named presentations; share behavior contract with Carousel only where proven. | Separate full-width and peek variants (**recommend**; honest content-size tradeoff) vs one configurable strip (fewer concepts but flags couple geometry and interaction). Whether it is categorized as data display or carousel can wait. | No; code sharing decision can wait. |
| **Metric comparison** | Circle comparison, bars, compact/flat, responsive composition | Preserve data meaning and responsive reflow; use measured container width. Keep circle mode opt-in. | Circle mode opt-in (**recommend**; prevents visual encoding being mistaken for default metric hierarchy) vs default circles (stronger visual emphasis but higher space/interpretation cost). | No; default status should be approved before any family promotion. |
| **Account settings** | Account/application views in navigation layer; toggles/demo status | Treat as composed example/pattern, not a primitive; inject navigation/content; fixture status stays explicit. | Example composition (**recommend**; portable pieces stay reusable) vs maintained composite pattern (faster reuse but owns content/layout decisions). Product-shaped copy placement remains owner-selected. | No for primitive reuse; blocks describing it as generic. |
| **Access gateway** | Credential fields, reveal, optional recovery/providers, submit/loading/status callbacks | Keep auth/network consumer-owned; reuse fields/messages; clarify callback/result and lifecycle. | Reusable credential UI only (**recommend**; no implied service behavior) vs turnkey auth package (adds unapproved security/provider responsibilities). | No; turnkey auth is explicitly out of scope. |
| **Order schedule** | Calendar/list, month/day, loading/error/retry/empty, date/row; `DRAFT FOR REVIEW` | Hold draft until targets and calendar semantics are resolved; use explicit day/list below fitting component width. | Keep month at sub-48 target (not recommended; contradicts project rule) vs day/list below threshold (**recommend**; preserves targets, loses month overview) vs redesign week pagination (more context, larger interaction redesign). | **Yes**; blocks stable status. |
| **Carousel** | Empty/one/many, arrows/dots/swipe, expansion, keyboard, RTL, reduced motion, disconnect | Keep optional; explicit name/item semantics; standardize teardown and measurement with Info Strip without over-unifying. | Separate focused patterns (**recommend initially**; clearer geometry) vs shared engine after contract parity (reduces duplicated behavior, adds abstraction complexity). No autoplay by default. | No for draft UI; blocks any claim the two variants share one API/engine. |
| **Packed-circle** (logical data subfamily) | Opt-in packed extension; overlap and data-size variants; proposed status | Keep independent and opt-in; require encoding rationale and owner decision before stable status. | Remain proposed as separate extension (**recommend**; protects normal bubble contract) vs merge into bubbles (simpler family count, but risks confusing overlap/area semantics). | **Yes** for promotion only. |

The exact file/family associations, selector markers and parsed spec evidence are machine-readable in `system-inventory.json`.

## Findings, priority, and evidence

Full finding records (all required fields, detailed recommendations, options/effects, risks and acceptance tests) are in `system-findings.json`.

| Priority | ID | Category / status | Current source evidence | Future-state emphasis |
|---|---|---|---|---|
| 1 | `SYS-DS-001` | Token architecture — High / CONFIRMED | `shared/tokens.css:9-155`; `docs/SHARED-SPEC.md:5-6` | Build semantic aliases over current CSS tokens, preserve compatibility, add only repeated missing geometry roles; defer a full DTCG pipeline unless approved. |
| 2 | `SYS-DS-002` | Layers — High / CONFIRMED | `navigation.css:173-185` uses 80/85; `messages.css:90-104` uses 90; preview toast host uses 60 | Establish global overlay roles and composition rules; internal decoration retains local stacking. Owner must answer toast-vs-dialog order. |
| 3 | `SYS-DS-003` | Touch geometry — High / LIKELY | `--micro-touch-min:48px`; `COMPONENT-GEOMETRY.md:48-66` documents calendar cells 37.7/43.4/46.6px at 320/360/390; current CSS `.m-ocal__cell` | Hold the calendar as draft; decide narrower day/list behavior instead of shrinking/overlapping targets. Reconfirm at runtime before elevating certainty. |
| 4 | `SYS-DS-004` | API/lifecycle — Medium / CONFIRMED | Different per-family globals and `init`, `sync`, `disconnect`, `destroy` shapes; for example `fields.js:329-334`, `data.js:1353-1382`, `order-schedule.js:1-35` | Adopt additive, family-appropriate `init/update/dispose` conventions and lifecycle tests; no framework dependency required. |
| 5 | `SYS-DS-005` | Dependency graph — Medium / CONFIRMED | `EXPECTED_CSS/JS` in standalone builder:38-80; only count checks at 223-238 | Pick HTML order or one dependency manifest as source of truth and assert exact ordered path membership. Current output is correct. |
| 6 | `SYS-DS-006` | Docs/governance — Low / CONFIRMED | `components/README.md:1-2` contradicts current inventory at `docs/COMPONENT-INVENTORY.md:14-44`; CURRENT-STATE refers to an older commit | One current family registry/status source with dated historical evidence clearly labeled. |
| 7 | `SYS-DS-007` | Manifest/delivery — Medium / CONFIRMED | `tools/manifest-build.py:14-47`; `MANIFEST.json` | Resolve snapshot-vs-current intent, then owner-approved regeneration and a read-only validator. Builder was not run because it overwrites MANIFEST. |
| 8 | `SYS-DS-008` | Host portability — Low / NOT PROVABLE | `window.Micro*` global APIs and vanilla file package; no target host spec in repository | Decide vanilla-only vs ESM/adapters in this repository before portability sign-off; no consumer app needed or accessed. |

### Foundation health matrix

Scores are a **design-system implementation checklist heuristic**, not a compliance score. 100 means this role is centralized, named, and verifiably consumed; partial means some current values/behavior exist but the cross-family system role or verification boundary is missing. Dark mode is intentionally not scored as a defect because the foundations explicitly defer it.

| Area | Score | Basis |
|---|---:|---|
| Brand/surface/feedback color values | 75 | Named values and contrast pairs are documented; token architecture is flat and no general alias layer exists. |
| Typography/Arabic assets | 80 | Font families, weights, sizes and line-height roles exist; this pass does not certify every component's rendered text. |
| Spacing | 75 | Shared 4–40px scale is present and used widely; complete alignment/gap policy is not a token layer for every layout. |
| Radius | 70 | Common field/surface/button values and feature values exist; some component decisions remain locally named or proposed. |
| Borders | 50 | Border/focus colors and focus width exist; generic border-width role is not defined. |
| Elevation | 50 | Two clear shadows exist; full elevation/context scale is not specified. |
| Motion / reduced-motion | 70 | Three durations, easing and reduced-motion handling exist; not all transition policy is central. |
| Global layers | 15 | No shared stack roles; high overlay numbers are literals. |
| Responsive/container policy | 25 | Components use container queries and locally documented thresholds; there is no system-level threshold taxonomy. |
| Opacity | 0 | No shared opacity role tokens found. |
| RTL | 75 | Logical properties are common and direction is designed; full mirror/host assumptions still need per-family tests. |
| Component contract coverage | 80 | Substantial specifications and state distinctions exist; public APIs/lifecycle and documentation completeness differ by family. |
| Portability/governance | 45 | Standalone and editable packaging exist, but delivery graph, API targets and current status sources need tightening. |

## Static/tool checks and bounded results

- `python3 tools/build-ui-system-showcase-standalone.py --check` — **PASS**, byte-for-byte standalone output matches current source. Icon check passed for 23 symbols. The script's `--check` branch was inspected first (`tools/build-ui-system-showcase-standalone.py:266-281`); it writes no output file.
- `system-inventory.py` — **PASS**, read-only source parser wrote 492 tracked paths and 14 component-folder inventories. It reports selectors/spec state excerpts, not runtime coverage.
- Manifest comparison — **FAIL**, read-only comparison against `tools/manifest-build.py` include/exclude rules for the tracked HEAD: 434 eligible tracked files vs 286 entries; 148 absent; 66 existing hashes differ; 220 match; no extra manifest paths.
- `tools/manifest-build.py` — read, **not run**: normal execution overwrites `MANIFEST.json`.
- `tools/build-components-package.py` — read, **not run**: writes the delivery ZIP.
- `tools/assemble-components-package.py` — read, **not run**: replaces the delivery archive.
- Scripts inside `design-systems-agent/` — none exist. No unrelated kit script was run.
- Viewports/interactions/screenshots — not re-run by this role. Parent agent owns the broad browser sweep. No screenshot is claimed as inspected.

The checks do not prove physical Android/iOS sizing, WebKit/Safari behavior, touch accuracy, native safe areas, screen-reader support, WCAG conformance, or actual host integration. No user study/analytics exist or were inferred.

## Owner decisions — options, effects, and blocking status

1. **Token contract:** Keep one CSS layer (lowest migration cost, future theme overrides remain coupled); add semantic aliases over existing CSS values (**recommended**, low disruption); or adopt typed DTCG/build output now (more targets, unnecessary tooling until approved). This blocks final token-governance sign-off, not current light UI work.
2. **Overlay ordering:** Decide whether toast may obscure active dialog, dialog outranks toast, or host controls roles. Recommendation: modal owns focus and visual context by default; keep toast order a host override if required. This blocks layer-token finalization.
3. **Narrow month calendar:** Preserve overview with sub-48 targets (not recommended); use explicit day/list below content threshold (**recommended**); or redesign month interaction around week-row pagination. This blocks `order-schedule` stable status.
4. **JS public API:** Keep vanilla globals and standardize lifecycle (**recommended least disruptive**); ESM primary; or custom elements. This affects packaging and compatibility/versioning, not product flows.
5. **Showcase dependency graph:** Make HTML link order authoritative (**recommended for the current dependency-light system**) or add one explicit dependency manifest. Both require tests; source order is currently correct.
6. **Manifest meaning:** Current-HEAD integrity inventory (**recommended**) vs frozen delivery snapshot with a separate current-source inventory. This blocks release integrity sign-off; do not regenerate without owner approval.
7. **Future host:** Vanilla browser only (**recommended until the owner selects a target**), ESM package, or named framework adapters. This blocks final portability sign-off; it is not a reason to inspect or contact the host.
8. **Theme scope:** Continue light-only, but design role aliases so future contrast-safe theme work is possible; add dark theme only after an explicit decision. No dark-theme implementation is recommended in this audit.

## Safe patches vs structural work

**Potential small safe patches after approval:** replace stale component overview copy; refresh a current-status reference while preserving its historical entry; regenerate and validate the manifest after confirming its intended domain; add exact standalone ordered-path validation.

**Structural work:** semantic token layer/compatibility aliases; global layer roles and ownership; a documented JS lifecycle convention; calendar narrow-width behavior; a canonical family/dependency registry; any ESM/custom-element/framework packaging.

No proposed patch was applied. Safe does not mean approved: status labels, theme policy, z-order, calendar presentation, and public API format remain owner decisions.

## Ordered implementation plan for a future approved phase

1. **Foundations:** approve token semantic scope and overlay roles; document current light-only/RTL baseline and accessibility/geometry exceptions.
2. **Components:** establish additive lifecycle/API conventions; address the calendar draft target decision; preserve the existing data/zero/missing semantics and avoid broad token renames.
3. **Composition:** build one reference fixture for modal/backdrop, toast, sticky actions, navigation and picker nesting; confirm each component's owner for focus, safe area and stacking.
4. **Showcase:** make dependency order auditable; keep source and standalone deterministic; show stable/draft/proposed status honestly and do not make showcase chrome a component dependency.
5. **Documentation/delivery:** make one family/status registry authoritative; update stale summaries; confirm manifest domain and add a non-writing integrity check; publish host packaging contract after owner decision.

## Specialist conclusion

The current system has a substantial and unusually explicit set of family specifications, source examples, tokenized values, deterministic standalone delivery, RTL intent, and meaningful edge-state semantics. Those are real strengths, but they do not automatically make token architecture or portability mature. The main design-system gaps are systemic rather than evidence that the light palette itself is aesthetically wrong: flat token roles, ungoverned global layer values, uneven JS lifecycle APIs, and a source/dependency/status graph with duplicate or stale authority. The UI library is a credible in-progress vanilla component source with several mature family contracts; it is **not yet a fully portable, cross-host governed design-system package**. This is a bounded specialist verdict, not a judgment on rendered visual quality or the full 11-skill audit.
