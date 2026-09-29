---
name: Micro UI
colors:
  brand-primary: '#164D59'
  brand-pressed: '#103E48'
  brand-gradient-start: '#236675'
  brand-support: '#507F8B'
  brand-accent: '#F4AD76'
  surface-page: '#F7F8F4'
  surface-base: '#FFFFFF'
  surface-selected: '#DFEEE6'
  text-primary: '#172D32'
  text-secondary: '#50656A'
  text-inverse: '#FFFFFF'
  success: '#176647'
  danger: '#AD303B'
  warning: '#815400'
  info: '#265E91'
  data-a: '#164D59'
  data-b: '#F4AD76'
  data-c: '#B6A3D6'
  data-d: '#496D92'
  data-e: '#B3BD7B'
---

# Design System: Micro UI

**Source:** `micro-ui-design-system` source files, shared tokens, component styles, and current specifications.

**Scope:** reusable UI foundations and components for Micro. This document is not a product-screen specification, business-logic specification, or user-flow redesign.

**Status:** the visual foundations are approved; component details and proposed variants remain subject to owner review. New visual decisions must be marked `PROPOSED` until explicitly approved.

## 1. Visual Theme & Atmosphere

Micro uses a calm, professional visual language built around a deep petroleum identity, warm light surfaces, restrained depth, and clear information hierarchy. The interface should feel designed as a connected page rather than a stack of identical cards. Space, alignment, section titles, dividers, and typography do most of the grouping; a raised surface is introduced only when it gives content a useful boundary or independent action.

The system is soft without becoming pale, and expressive without becoming decorative. A petroleum surface may use a controlled vertical gradient, quiet illumination, or a restrained wave treatment when it is a focal surface. Inputs, lists, and small controls remain stable and readable. There is no blanket glassmorphism, continuous decorative motion, heavy shadowing on every row, or generic SaaS dashboard treatment.

The visual language must work for the complete nature of Micro: operations, orders, delivery, suppliers, purchasing, relationships, sales, expenses, debt, cash, and supporting tools. It must not reduce the product to a finance-only dashboard.

## 2. Color Palette & Roles

### Primary Foundation

| Token | Value | Role |
|---|---|---|
| Deep petroleum | `#164D59` | Primary action, important links, active selection, primary data series |
| Pressed petroleum | `#103E48` | Pressed primary action |
| Petroleum gradient start | `#236675` | Start of the restrained primary gradient and focal surfaces |
| Petroleum support | `#507F8B` | Decorative or gradient support only; not a default background for small white text |
| Warm page surface | `#F7F8F4` | General page background |
| Clean surface | `#FFFFFF` | Inputs, dialogs, sheets, and stable content surfaces |
| Quiet selected surface | `#DFEEE6` | Selection, quiet pressed state, or light containment |
| Disabled surface | `#E4EAE8` | Disabled controls |

### Accent & Interactive

| Token | Value | Role |
|---|---|---|
| Warm apricot | `#F4AD76` | Limited accent, filter counter, and selected data series; use dark text on it |
| Focus ring | `#164D59` | Visible keyboard focus with a light gap around the control |
| Control border | `#71868B` | Recognition border for controls when needed |
| Divider | `#DCE5E2` | Quiet structural separation |

The apricot accent is not automatically a warning, error, or financial meaning. Data colors are not reused as arbitrary decoration in fields or buttons.

### Typography & Text Hierarchy

| Role | Value | Use |
|---|---|---|
| Primary text | `#172D32` | Headings, primary copy, key amounts |
| Secondary text | `#50656A` | Readable supporting information |
| Hint text | `#5F7378` | Placeholder and low-priority hints on light surfaces |
| Inverse text | `#FFFFFF` | Text on stable petroleum surfaces and primary controls |
| Disabled text | `#53676B` | Disabled content |

### Functional States

| Meaning | Foreground | Light surface | Rule |
|---|---|---|---|
| Success | `#176647` | `#E5F3EA` | Use only when success has a real meaning |
| Error/destructive | `#AD303B` | `#FBEAEC` | Use for error or destructive action, not generic emphasis |
| Warning | `#815400` | `#FFF1CD` | Pair with a visible label or explanation |
| Information | `#265E91` | `#E9F1FA` | Contextual information, not decoration |

Color never carries meaning alone. Pair state color with text, iconography, structure, or an explicit label.

### Data Palette

| Series token | Value | Role |
|---|---|---|
| Data A | `#164D59` | Primary data category |
| Data B | `#F4AD76` | Second data category |
| Data C | `#B6A3D6` | Third data category |
| Data D | `#496D92` | Additional category when needed |
| Data E | `#B3BD7B` | Additional category when needed |

Use only the number of series needed. The series key determines the color so reordering data does not silently change meaning.

## 3. Typography Rules

### Families and Weights

- Arabic: `IBM Plex Sans Arabic`.
- Latin text and digits `0–9`: `IBM Plex Sans`.
- Available weights: 400, 500, and 600.
- Do not use artificially spaced Arabic text or thin weights as the default.
- Numeric values inside RTL layouts are isolated LTR and use tabular numerals where comparison matters.

### Type Scale

| Role | Size / line-height | Weight |
|---|---:|---:|
| Page title | 22 / 32 px | 600 |
| Section title | 18 / 28 px | 600 |
| Body and list text | 16 / 26 px | 400–500 |
| Button label | 16 / 24 px | 500 |
| Field label and helper | 14 / 22 px | 400–500 |
| Short secondary text | 13 / 20 px | 400 |
| Primary amount | 36 / 44 px | 600 |
| Secondary amount | 22 / 32 px | 500–600 |

Line heights are proportional where content must survive text resizing. Do not solve overflow by clipping or shrinking essential information automatically.

## 4. Shapes, Spacing & Depth

### Spacing

The base rhythm is 4, 8, 12, 16, 20, 24, 32, and 40 px. At approximately 390 CSS px, page side margins begin around 20 px and may reduce to 16 px on narrower screens. Related elements use tighter spacing; different groups use 24–32 px separation.

### Shape Language

- Short buttons: capsule radius.
- Fields and small controls: approximately 16 px radius.
- Independent surfaces: approximately 24 px radius.
- Icon buttons and circular data marks: circular geometry.
- Small badges and counters: capsule geometry.
- Long or multi-line button radius is a **PROPOSED** variant until owner approval; it must not become an oversized ellipse.

### Touch and Focus

- Project touch-target baseline: at least 48 × 48 CSS px for independent controls.
- Focus is separate from pressed, disabled, and loading states.
- Focus uses a 2 px petroleum ring with a 2 px light gap where the component contract requires it.
- Do not rely on hover for mobile behavior.

### Elevation and Surfaces

- Rows and open page sections are generally flat.
- The primary button may use a restrained petroleum-tinted shadow.
- Temporary layers may use a larger soft shadow.
- Avoid a shadow on every row and avoid stacking nested cards.
- Decorative layers must not interfere with text, controls, pointer events, or reading order.

## 5. Component Stylings

### Buttons and Actions

The action family has a shared geometry and clear role differences:

- Primary: petroleum vertical gradient or stable petroleum fill, inverse text, restrained emphasis shadow.
- Secondary: clean surface, quiet border, lower visual weight.
- Light/text: transparent container with petroleum text.
- Destructive: semantic danger treatment; not every important action is destructive.
- Icon button: 48 px circular touch target with a 24 px icon.
- Filter button: a clear action with an optional counter; zero may be visually hidden while the accessible name explains that no filters are active.

Loading must preserve the control’s dimensions, prevent duplicate activation, provide a clear loading name, and respect the pre-existing disabled state. A loading spinner is not a substitute for a status label.

### Inputs & Forms

Fields use one stable shell with state changes rather than eight unrelated visual designs. The label remains visible outside the control; a placeholder is only a hint and never replaces the label.

The field control is a clean stable surface with a 52 px starting height, a 16 px radius, a recognition border, and a clear focus ring. Text areas grow with their content. Amounts and quantities isolate the numeric portion LTR and keep Arabic units visually separate.

Required state rules:

- Empty is not zero.
- Typing uses the focus language; it does not require a new decorative shape.
- Filled is not automatically successful.
- Error keeps the user’s value and pairs the border with a corrective message.
- Success appears only when a meaningful validation has occurred.
- Disabled uses the disabled surface and is not focusable or pressable.
- Read-only remains clear, selectable, and copyable; it is not disabled.
- Error and focus may coexist without hiding either meaning.

### Selection & Controls

Keep roles distinct:

- Checkbox: independent or multiple selection, including an indeterminate group state.
- Radio: one choice from a named group.
- Switch: an On/Off setting; it does not submit a form or open a page.
- Toggle: a temporary mode using `aria-pressed`.
- Segmented control: a short mutually exclusive mode or value selection.

The state must be understandable through text, structure, and focus—not color alone.

### Rows, Sections & Identity

Use section titles, alignment, spacing, and dividers before introducing a raised card. Rows may be read-only, openable, or contain an independent action; these roles must be visually and behaviorally distinct. Do not make every row a card or every row a link.

A two-line row has a 72 px starting minimum and expands for content. Long names wrap rather than being clipped. An identity block can use a circular image or initials fallback, with a clear secondary line.

### Data, Summaries & Visualizations

Data components are consumer-driven: values, labels, units, totals, axis direction, and series are supplied in editable HTML. The component renders the visualization; it does not invent business rules, calculate profit, call an API, or hide critical values behind hover.

Supported patterns include:

- Amount plus unit.
- Primary and secondary values.
- Period or state comparison.
- Bars, line, donut, and area-proportional circles.
- Determinate and indeterminate progress.
- Step or timeline states: complete, current, upcoming, and blocked.

Unknown, unavailable, zero, invalid, and negative values must remain distinct. Missing data is not silently converted to zero. A negative value is not drawn as a positive bar or circle.

### Concept of Overlapping Circles

The references establish a **concept**, not a screen to copy:

- Circles may overlap partially to make relative scale visible.
- The value itself is the precise source of truth; the overlap is only a visual comparison cue.
- The displayed number inside a positive circle is the real formatted value, not a percentage.
- The circle’s area is proportional to the raw value; therefore radius/diameter uses a square-root relationship to preserve area meaning.
- Avoid a large artificial minimum size that erases meaningful differences.
- If a circle becomes too small for a readable label, keep the value readable outside or in a nearby legend while preserving the circle’s data state.
- Layering must be intentional so circles overlap without hiding numbers or labels.
- Do not place text from one circle over another circle’s text.
- Color is a series aid, not the only way to distinguish values.
- The overlap does not mean a real financial intersection, shared total, or business calculation.

#### Circle Logic Contract

The visual component must distinguish at least:

1. Positive value: proportional circle with formatted value.
2. Zero: explicit zero state without inventing a positive-sized circle.
3. Unknown or unavailable: explicit `—` or unavailable state, never zero.
4. Negative: visible signed value and an explicit non-rendered/invalid-for-area state; never a misleading positive circle.
5. Declared denominator zero: conflict or documented zero state, without division by zero or silent replacement.
6. Declared denominator negative: explicit invalid state, without normal percentages.
7. Missing denominator: only the documented fallback may be used.

If circles are used inside a summary card, the card must remain an independent composition: title, key value or values, concise interpretation, and optional detail action. The chart must not become a dashboard screen or hide important information behind a swipe.

### Petroleum Surfaces and Waves

The petroleum treatment is a reusable surface treatment, not a requirement to decorate every component. The current source provides three comparison levels:

1. Calm: gradient and quiet illumination only.
2. Waves: gradient plus a restrained, editable wave layer; the leading **PROPOSED** candidate.
3. Depth: limited additional layers for a prominent surface only.

A plain petroleum variant remains available. Wave SVGs are editable assets with adjustable opacity, vertical position, scale, height, and light intensity. The decorative layer is non-interactive and separate from the content layer. Text remains on a stable surface above it.

Use the treatment for prominent summaries, headers, or focal surfaces. Keep fields, lists, and small buttons clean. Do not use blanket glassmorphism, Canvas/WebGL, continuous wave animation, or decorative waves behind every input.

### Messages and Feedback

- Fixed helper, information, success, warning, and error messages remain available when the user needs them.
- A transient toast is reserved for non-critical confirmation and must have a stable alternative for important information.
- Loading includes a clear label; reduced motion makes the indicator static.
- Skeletons are quiet and stop animating under reduced motion.
- Empty and no-results states are distinct from failure-to-read states.
- Messages should be concise and progressively reveal detail rather than permanently dominating the task.

### Navigation and Layers

The component family supports app bars, tabs, bottom navigation samples, action bars, dialogs, bottom sheets, menus, and filter layers. The library does not decide Micro’s final navigation map or number of tabs.

Layers need an explicit close action, predictable focus handling, safe-area consideration, and protection from background interaction when modal. The filter surface is a dedicated layer opened by a clear filter action; a row of generic chips is not the default replacement.

### Carousel / Summary Card Viewer

Carousel is an optional independent component, not the page structure. It may present a small set of summaries with an active card, partial neighboring cards, explicit previous/next controls, a position indicator, RTL behavior, and optional touch drag. It must not be the only way to reach important content, must not autoplay, and must not turn the whole home page into a carousel.

A summary card may be compact by default and expand inline on an explicit action, provided expansion does not clip content or force unrelated cards to become equally tall. Compact/expanded behavior and real values inside overlapping circles remain **PROPOSED** until owner approval.

## 6. Layout Principles

### Page Structure

The page is the primary composition unit. Start with:

1. the user’s main question or task,
2. the most important value or action,
3. supporting details grouped by relationship,
4. deeper detail or optional actions.

Use open sections, rows, titles, dividers, and alignment to create continuity. Use a card when independent containment, comparison, media, or an action genuinely benefits from it.

### Reference Images: Build the After Direction for Micro

The supplied references are visual direction for components and compositions that we want to create for Micro. They are not existing Micro screens, and they are not instructions to reproduce another product literally.

- **Overlapping circles:** build the same type of clear, layered comparison concept using Micro’s real values, area-based sizing, controlled overlap, and explicit edge states.
- **Field-state reference:** build a Micro field-state board and reusable field shell with the same clarity of state coverage, while using Micro’s tokens, RTL rules, typography, and interaction contract.
- **After-state references:** use the improved composition as the target direction: fewer distractions, stronger hierarchy, grouped content, clearer primary action, and better use of space. Create Micro equivalents from that direction; do not treat the Before screen as a baseline to preserve or analyze.
- **Health/profile/login examples:** use the After composition patterns as inspiration for reusable Micro structures such as summaries, grouped sections, rows, and forms. Do not copy their brand, copy, product identity, navigation map, or screen-specific data.

Every derived pattern must be rebuilt as editable HTML/CSS/JavaScript/SVG in Micro’s petroleum identity, Arabic RTL context, IBM Plex typography, approved data colors, stable light surfaces, and reusable component contracts. The result should be a practical foundation that can later support migrating the new theme onto Micro without starting over.

### Responsive Behavior

Design mobile-first for Arabic RTL at 320, 360, 390, and 430 CSS px, then verify wider previews. Components expand for content, long labels, long amounts, and 200% text resizing. Do not use overflow clipping as proof of success. Preserve a natural vertical page scroll and distinguish horizontal carousel gestures from vertical scrolling.

## 7. Logic and Source Contract for Z AI

Z AI Flash must treat the source as the main deliverable:

- Deliver readable HTML/CSS/JavaScript/SVG, not screenshots or a build-only artifact.
- Separate reusable component logic from preview-board simulation.
- Use shared tokens instead of scattered duplicate values.
- Keep data and labels editable from the consumer markup.
- Document where to change colors, spacing, radii, labels, icons, data values, thresholds, and states.
- Prove one source edit reflected in the preview, then restore the intended value.
- Keep each family independently reviewable with a minimal example.
- Mark new visual choices `PROPOSED — owner review required`.
- Never rasterize a reference or copy a reference screen literally; reconstruct the intended After pattern as editable Micro components and compositions.
- Never add business logic, external APIs, production screens, or user journeys to a component batch.
- Correct later issues on the same source files rather than rebuilding from scratch.

## 8. Design Review Checklist

Before a family is considered ready for review, verify:

- The component’s role and alternative are explicit.
- The visual hierarchy remains clear when repeated.
- The source is editable and separated from the preview.
- Empty, loading, focus, pressed, disabled, error, success, unknown, and long-content states are covered where applicable.
- Arabic RTL and 0–9 values remain readable.
- 320/360/390/430 CSS px and 200% text resizing do not clip essential content.
- Touch targets and focus rings remain usable.
- Color is not the only state signal.
- Reduced motion removes nonessential movement.
- Data logic distinguishes missing, zero, invalid, and negative values.
- Circle overlap does not hide values or imply a false business relationship.
- Petroleum decoration is limited to a justified focal surface.
- New decisions are explicitly marked proposed until owner approval.
- Evidence comes from the exact source commit used for screenshots.

## 9. Design System Notes for Stitch Generation

### Language to Use

Use: calm petroleum, warm light surface, connected mobile page, restrained depth, crisp Arabic RTL hierarchy, real numeric values, quiet wave treatment, controlled overlap, stable input shell, clear states, and purposeful grouping.

Avoid: generic SaaS dashboard, card wall, blanket glassmorphism, neon finance UI, decorative chart without a question, tiny pale text, oversized pill controls, arbitrary percentages inside circles, and a copied login/profile/health screen.

### Color References

Use Deep Petroleum `#164D59` as the primary identity, Pressed Petroleum `#103E48` for pressed action, Petroleum Gradient Start `#236675` sparingly, Warm Page `#F7F8F4`, Clean Surface `#FFFFFF`, Quiet Selected `#DFEEE6`, Warm Apricot `#F4AD76` as a restrained accent, and the approved data palette only for data series.

### Component Prompts

1. **Overlapping data concept:** “Create a reusable mobile RTL data-summary component in Micro’s petroleum identity. Use a small set of partially overlapping circles whose areas reflect raw values, show real formatted values inside positive circles, preserve readable labels, and expose explicit unknown/zero/negative states. Do not create a dashboard or imply that overlap is a financial intersection.”
2. **Field state matrix:** “Create one reusable Arabic RTL field shell with visible label and stable light surface. Demonstrate empty, focus, typing, filled, error, meaningful success, disabled, and read-only states without turning each state into a different component or coloring every filled field green.”
3. **Focal petroleum surface:** “Create a reusable prominent Micro surface using a stable petroleum gradient, quiet illumination, and an optional editable wave layer. Keep content readable above the decoration, provide a plain and calm variant, and do not decorate inputs, rows, or every small control.”

### Incremental Iteration

Review one family at a time. Keep concepts separate from production screens. Compare each family alone and when repeated beside one or two related families. If a reference suggests a new visual direction, implement it as a clearly labeled proposal, preserve the current source, and wait for owner approval before treating it as a system rule.
