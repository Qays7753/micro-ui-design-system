# Design direction — independent skill report

**Scope:** Visual direction and future-state rationale for the local Micro UI kit only. No consumer product, external page, production data, analytics, or user research was inspected. No source files were changed.

## Method

I used the design-direction skill to distinguish an existing visual hypothesis from an owner-approved brief, then checked whether one component decision materially undermines that direction. The system already declares an Arabic-first, light, petrol-forward operational aesthetic; this review did not invent a new brand, marketing narrative, or audience to fill the product-context gap. I treated the carousel's peek as a directional decision because it changes the rhythm between focused reading and browsing, rather than treating a CSS token in isolation.

Evidence was taken from the local direction document, palette/type tokens, composition and preview routes, plus a 430px target crop and Chromium geometry. The route/state sweep is not duplicated here. Relevant source-local advice was consulted in the technique index, catalogue, and mobile/carousel note.

## Finding ledger

| ID | Result | Directional consequence |
|---|---|---|
| `VISUAL-02` | **CONFIRMED**, P2 | A 24px neighboring-card slice at the measured 342px inner viewport reads as clipped content, not as a purposeful teaser. |
| `VISUAL-04` | **CONFIRMED**, P2 | The default 64/25/9 circle comparison obscures roughly 40% of the 25 disk and 36% of the 9 disk, and visually suggests intersection despite a disclaimer. |

The carousel issue is visual intent, not overflow: active content and document width remain within bounds. A carousel should not force a browse-strip aesthetic onto content whose purpose is to read one card at a time. The circle issue is independent of taste or intended CSS encoding: visible area changes with the foreground masking and the overlap implies an unsupported relationship.

## Future-state rationale

- Preserve the established warm surface, petrol emphasis, Arabic typography, and restrained semantic color; the viewed previews support that identity.
- Prefer a **focused active-card** presentation for the default contract: full readable width, position cue, and visible previous/next controls. Keep a browse-strip/peek mode optional and only for short, teaser-safe content.
- Keep the peek decision tied to component inline size and the content contract, not a device-width breakpoint alone.
- Do not approve circles as the default for comparisons on visual preference alone. The 64/25/9 fixture's underlying areas follow the scale, but the default overlap hides 40.1% and 35.6% of two circles at 390px. Make precision-first aligned bars/tables the default; keep disjoint area circles as an optional magnitude view. Keep overlap illustration-only or remove it from quantitative comparison. Preserve only the supplied fixture values—do not manufacture business data.
- Separate maturity labels (`stable`, `draft/review`, `proposed`) before mapping them to tones; otherwise warning color becomes generic chrome and the underlying direction loses semantic clarity.

## Checked files and evidence

**Source/reference files:** `docs/UI-VISUAL-SYSTEM.md`; `shared/tokens.css`; `previews/carousel/index.html`; `components/carousel/carousel.css`; `previews/compositions/index.html`; `previews/ui-system-showcase/index.html`; `previews/board-base.css`; `previews/buttons/index.html`; `components/metric-comparison/metric-comparison.css`; `components/data/data.css`.

**Skill references:** `_audit-resources/pixilated-ux-ui-skills-kit/design-direction/SKILL.md`; `_audit-resources/pixilated-ux-ui-skills-kit/ui-designer-agent/references/technique-index.md`; `.../catalogue.md`; `.../notes/batch-01b.md`.

**Script / browser evidence:** `_audit-resources/pixilated-ux-ui-skills-kit/audit-current/visual-targeted-captures.py`; `generated-artifacts/pixilated-audit/visual-carousel-430.jpg`; `visual-metric-circles-overlap-320.png`; `visual-metric-circles-overlap-390.png`; `visual-metric-circles-separated-390.png`; `visual-metric-circles-zero-negative-missing-huge-390.png`; `visual-main-comparison-flat-390.png`; `visual-chart-donut-390.png`; `visual-chart-bubbles-range-390.png`.

## Limits and owner decisions

- No owner-signed intake or real content hierarchy was available; product fit and user preference are **not provable** here.
- No external design search was run because external URL access was prohibited.
- The carousel focused-vs-strip contract and circle-vs-linear default require an owner decision; the recommendation above is a future-state direction, not a claim that an unimplemented product requirement exists. The overlap's visible-area distortion is a confirmed implementation design risk independent of that product decision.
- Screenshots are local Chromium crops. They do not certify WebKit, physical touch, contrast, screen-reader behavior, or a full state-by-width matrix.

**This skill contributes two findings: `VISUAL-02`, `VISUAL-04`.**
