# Articles (written sources, not videos)

## The Golden Rule of Line Length in UX/UI: Why 75 Characters Is Too Many
- source: Khoa Le (Medium, 24 Apr 2025) · https://medium.com/@wblekhoa/talk-aboutthe-optimal-length-of-text-in-ux-ui-525e689f0b71
- type: principles
- tags: typography, measure, line-length, line-height, readability, accessibility, microcopy, hero, tooltips, dashboard, responsive
- added: 20 Oct 2026 (fed by the owner)

### Takeaways
- Body text reads best at **50 to 75 characters per line, spaces included**. The article cites Baymard, NN/g and Emil Ruder for this range.
- Past ~75 characters, the eye loses its place on the return sweep: re-reading, skipped lines, and text that "looks too much to read" gets skipped. Under ~45 characters, constant line breaks split phrases and break the rhythm.
- Cap the text container, not the page. Full-width text on FHD/2K/4K is the classic failure. Whitespace beside the text is not waste: it frames the block (Gestalt common region) and keeps key content inside the F/Z scan path (first ~600 px).
- Longer lines need more line-height: keep body at **1.4 to 1.6** (≈1.5 is the safe default).
- Measure by font size (the article's bands):
  | Body size | Characters per line | Container width |
  |---|---|---|
  | 14 px (narrow blocks) | 55 to 70 | ~520 to 650 px |
  | 16 px (web standard) | 60 to 75 | ~580 to 720 px (≈ 70ch) |
  | 18 px (accessibility focus) | 65 to 80 | ~640 to 780 px |
- Length by text role:
  | Role | Characters |
  |---|---|
  | Hero headline, large headings | 30 to 40 (≈ 35ch) |
  | Sub-headings, pull-quotes | 40 to 60 |
  | Buttons, CTAs, hint microcopy | 20 to 35 |
  | Tooltips, captions, annotations | 25 to 35 |
  | Body paragraphs | 50 to 75 |
- Layout applications: blogs/FAQ get a fixed reading column; product cards in a grid share one line-length limit so the grid scans evenly; dashboards are zoned (one reading column, one task column, leftover space for charts/tables); on mobile the viewport limits width, so focus on short paragraphs.
- Research cited by the article (the article's claims, unverified here): Ruder (1967) 50 to 60 characters for best reading speed; **Baymard: descriptions wider than 80 characters per line skipped 41% more often than 60 to 70** (article's claim, unverified); NN/g eye-tracking: content beyond ~600 px to the right is rarely viewed; Dyson & Haselgrove (Reading University, 2001 to 2004): longer lines need more line-height, ~1.5 em minimises tracking errors; **WCAG 2.1 SC 1.4.8 (AAA): line width no more than 80 characters** (that one is a real criterion).

### Recipes
1. Reading column: `max-width: 70ch` (or 600 to 720 px at 16 px), `line-height: 1.5`, left-aligned, centred container.
2. Hero: cap the headline box at ~35ch so it breaks into 2 to 3 balanced lines (`text-wrap: balance`).
3. Microcopy audit: count characters of every button, tooltip and caption; anything over the role's band gets rewritten, not shrunk.
4. Grids: give card titles and descriptions the same `max-width`/clamp so every card wraps alike (`-webkit-line-clamp` for overflow).
5. Dashboards: never let a paragraph span a full-width panel; put explanatory text in a 60 to 70ch column beside the data.

### CSS translation
```css
:root { --measure-body: 70ch; --measure-hero: 35ch; --measure-sub: 55ch; --lh-body: 1.5; }
.prose      { max-width: var(--measure-body); line-height: var(--lh-body); }
.hero h1    { max-width: var(--measure-hero); text-wrap: balance; }
.subhead    { max-width: var(--measure-sub); }
.tooltip    { max-width: 35ch; }
.card p     { max-width: 60ch; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
@media (min-width: 1600px) { .prose { max-width: 75ch; } } /* never stretch with the screen */
```

### Gotchas
- `ch` is the width of "0" in the current font: wide faces give fewer real characters per `ch`. Check one real line by counting.
- Arabic runs 30 to 40% longer than English for the same message and its letterforms are wider: allow a slightly wider column or shorter copy, never smaller type.
- The bands are reading guidance, not hard limits for data tables or code.
- The article's percentages come from secondary summaries; quote the ranges, not the 41%.

### Examples named
Baymard product-page research (wide descriptions skipped), NN/g F-pattern studies, Material Design tooltips and typography.
