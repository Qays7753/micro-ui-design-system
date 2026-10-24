---
name: anti-ai-slop
description: Pixilated's Anti-AI-Slop skill, the LAST pass after any UI is designed or built. It finds and removes the patterns that make an interface look AI-generated, in visuals and words: accent stripes and strokes on non-interactive cards, dots in chips, dashes in UI text, badly padded buttons, icons in tinted tiles, purple gradients, emoji icons, eyebrow labels, KPI-card rows, fake stats, gradient text, glass cards, "Welcome back!" copy and 80+ more catalogued tells. It scans the code, audits the rendered page in headless Chrome, checks screenshots, fixes, re-scans and reports before/after. Use it whenever a page, screen, dashboard, landing page, artifact or HTML/React/Tailwind file was just built or restyled, and when someone says "remove the slop", "de-slop", "make it not look AI", "looks vibe-coded", "looks generic", "final polish" or "quality pass", even without the word slop. In a UX/UI orchestration, run it as the final stage.
---

# Anti-AI-Slop: Pixilated

You are the last person to touch the UI before it ships. Your job is not to redesign; it is to find
every pattern that a person (or a designer) would read as "an AI made this", remove it, and replace it
with the honest, specific version. A tell is a default that appears no matter what the product is.
One tell alone is usually harmless; a cluster of them is the AI fingerprint. So you count, you fix,
and you prove it with a before/after re-scan.

Run this after the UI exists (code, a live URL, or screenshots). If there is no UI yet, say so and stop.

## The owner's non-negotiables (always P0)

These come from Ahmed (Pixilated owner) directly. Fix every instance, no exceptions unless the
brief explicitly asks for the pattern.

1. **No cards with lines.** No coloured accent stripe on a card's left/top edge (border-left, a 3 to 4 px
   `::before` bar, a top gradient line). No border or 1 px ring around a block that is *not*
   interactive. House rule "stroke = state": a stroke says *clickable / has a state*. Informational
   blocks get a very light fill (one neutral step off the page) or just space, never a stroke.
   Inputs, selectable cards, buttons and the selected item keep their strokes.
2. **No dashes in text.** No em dash (—), en dash (–) or spaced hyphen ( - ) used as punctuation in any
   visible text: headings, body, buttons, labels, table cells, tooltips, alt text. Rewrite the sentence:
   a full stop, a comma, a colon, or "to" for ranges ("09:00 to 17:00", "SAR 25 to 50"). An empty
   table cell that shows "—" gets a word ("None", "Not set", "Paused") or stays blank. Hyphens inside
   words (single-origin, 3-month) are fine.
3. **Buttons padded properly.** Horizontal padding is clearly larger than vertical (about 1.6 to 3×), the
   label never gets closer than 12 px to the edge, heights come from one scale (32 / 40 / 48), icon +
   label gap is 8 px, icon-only buttons are square, touch targets are ≥ 44 px on mobile, and every
   button of the same size has the same height. Cramped, lopsided or stretched buttons are slop.
4. **No icons in background tiles.** No icon sitting inside a tinted rounded square or circle (the
   "feature card icon chip", the coloured status tile in a list). Put the icon inline with its text,
   in the text colour (or the one semantic colour when it carries state), at text size (16 to 20 px).
   If something needs emphasis, give it to the icon colour or the words, not a tile behind it.
5. **No dots in chips.** No little coloured dot (a `::before` circle, a `<span class="dot">`, a "●")
   at the start of a chip, pill, badge, tag or status label. It's the most common AI status pattern.
   The word carries the meaning; if the state needs colour, colour the word or give the whole chip a
   light semantic tint. A real icon (for example an alert icon on an error) is fine when it adds
   meaning. Chart legends keep their colour keys: there the swatch *is* the information.

## Workflow

### 1 · Scope
Find the files (HTML, CSS, JSX/TSX, Vue, Svelte, Tailwind classes, Markdown copy) and whether a design
system or brand exists. Owner and brand decisions win over this catalogue: if the brand font *is* Inter,
note it and move on. Read `references/catalogue.md` once so you know every ID.

### 2 · Static scan (code-certain tells)
```bash
python3 ~/.claude/skills/anti-ai-slop/scripts/slop_scan.py <file-or-folder> [--json out.json]
```
Lists findings as `ID  severity  file:line  message`. It covers copy (dashes, AI vocabulary, "Welcome
back", exclamation marks, → arrows, Title Case buttons, fake stats), CSS (stripes, purple gradients,
gradient text, glass, default shadows, letter-spaced uppercase labels, default fonts) and markup
(emoji icons, 01/02/03 markers). Exit code 2 means P0/P1 found.

### 3 · Rendered audit (what the code can't tell you)
```bash
python3 ~/.claude/skills/anti-ai-slop/scripts/slop_render.py <file.html or URL> --out <dir> [--query "?static=1"]
```
Loads the page in headless Chrome at 1440 px and at a true 390 px, reads computed styles, and writes
`report.json`, `report.md`, `clean.png`, `annotated.png` (every finding outlined and numbered) and the
390 px versions. It measures button padding and height consistency, finds icon tiles, accent stripes
(borders and `::before` bars), bordered or ringed non-interactive blocks, nested cards, contrast
failures, too many sizes/weights, repeated identical shadows, uppercase-tracked labels, gradient text,
glass, emoji and dashes in the visible text.
Requires Google Chrome at `/Applications/Google Chrome.app` and Python 3 (Pillow optional for the
side-by-side). The script works on a temp copy of the page's folder (macOS blocks headless Chrome from
~/Desktop and ~/Documents) and copies results back. If Chrome is missing, skip to step 4 and say so.

### 4 · Visual pass (your eyes)
Open `clean.png` and `annotated.png` (Read tool) and go through the **visual-only checks** at the end of
`references/catalogue.md` (silhouette test, sameness, hierarchy, centring, decoration with no job,
sections that would fit any brand). Scripts give false positives (5 to 10% is normal); drop the ones that
are wrong, with the reason. Add what scripts can't see.

### 5 · Report (before fixing)
Use this template. Keep it scannable.
```
# Slop report: <screen>
Score: <P0 count> P0 · <P1> P1 · <P2> P2   (verdict: CLEAN 0 P0 & ≤2 P1 | MILD | HEAVY ≥1 P0 or ≥5 P1)
| # | ID | Sev | Where | What | Fix |
False positives dropped: <list with reason>
```

### 6 · Fix
Fix in the source, at the right depth: surgical inside an existing design system, bigger only when the
tell *is* the structure (e.g. a KPI-card row). Use `references/fixes.md` for the replacement recipe per
ID. Rules while fixing:
- Replace, don't decorate. Removing a stripe doesn't mean adding a glow.
- Keep every function, state, label meaning and accessibility attribute. If a fix changes behaviour or
  copy meaning, say so in the report.
- Copy fixes keep the meaning and get shorter, never longer. Apply the copy rules in
  `references/catalogue.md` § Copy; don't introduce new dashes while rewriting.
- Don't trade one tell for another (cream + terracotta, "tasteful" serif accent, mono everywhere are
  tells too).

### 7 · Re-scan and prove it
Run steps 2 and 3 again on the fixed version into a new folder (e.g. `after/`). The target is
**0 P0** and every remaining P1/P2 explained (brand decision, false positive, out of scope). Produce a
before/after pair: `python3 scripts/slop_render.py --compare <before-dir> <after-dir>` writes
`compare.png`.

### 8 · Hand off
End with: the score before → after, the five non-negotiables each marked ✅, what you changed and why
(one line each, Pixilated hand-offs need what changed + the UX reason), and anything you left with the
reason. Never claim a check you didn't run.

If you can't write the report file (some harnesses block report files for subagents), put the full
report in your reply instead. Don't skip it.

## Severity
- **P0**: a layperson notices, or an owner non-negotiable. Always fix.
- **P1**: a designer or developer notices. Fix unless the brand asks for it.
- **P2**: polish and sameness. Fix when cheap; otherwise list.

## Where this sits
After UI Designer, Edge-Case Hunter and the UX/UI Manager review gates. Complements `slop-auditor`
(the agent that checks facts, sources and fake claims): this skill owns visual and copy tells; when you
find invented numbers, testimonials or logos, flag them as C15/C16 and hand the list to slop-auditor if
it's available.
