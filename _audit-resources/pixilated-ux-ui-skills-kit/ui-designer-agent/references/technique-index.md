# Technique index — UI craft from Kole Jain + Tim Gabe

Concrete UI rules from 60 videos (22 Kole Jain, 38 Tim Gabe). Find the topic, apply the rule, then search the cited notes file (relative to this folder) for the quoted fragment of the video's `## ` heading for the full recipe, timestamps and CSS. Caveats stay on their values: (derived) = the note-taker's value; (shown on screen, not stated) = no number given; (creator's claim, unverified) = every statistic in Tim's psychology videos; (note-taker's view) = an ethics or accuracy note. Tim's channel-update vlog has nothing reusable.

## Hierarchy & emphasis
- **Emphasis is relative**: an item stands out only because its neighbours lack its colour or weight. Keep defaults and off states grey. → `notes/batch-01a.md` · "weirdly perfect UI"
- **Three levers, two of each**: size + weight + colour; ≤2 weights with one skipped between them; ≤2 text colours (primary + itself at 45–70%). → `notes/batch-02.md` · "8 Web Design Hacks"
- **Don't starve the smallest text**: size alone makes the header win; body stays at 100% opacity; bold the subheads; 40–70% opacity only for secondary text (Tim differs: Conflicts). → `notes/batch-01b.md` · "Perfect Typography"
- **Explicitness spectrum**: labelled button → visible icon → hover-only icon, chosen by importance × frequency × space. → `notes/batch-01a.md` · "dashboard UI flaws"
- **Show, don't tell**: icons, diagrams and avatars over labels; icon-only bars still need tooltips. → `notes/batch-01a.md` · "weirdly perfect UI"
- **One emphasis, one linking motif**: the same pulsing dot marks the commit block and the graph's current bar; a plain chart beats a fancy one. → `notes/batch-09a.md` · "4 levels"

## Spacing, alignment & grouping
- **Two-edge test**: in compact UI every element touches ≥2 edges. Create internal edges; centre only what nobody reads. → `notes/batch-01a.md` · "weirdly perfect UI"
- **Edges, not filler**: don't fill an empty card. If an icon is taller than one line, add a subtitle. → `notes/batch-01a.md` · "weirdly perfect UI"
- **Density, two views**: on dense product screens vary the content, since whitespace barely helps → `notes/batch-01a.md` · "weirdly perfect UI"; on sparse grids drop dividers and cards and let space separate → `notes/batch-02.md` · "8 Web Design Hacks"
- **Dissolve cards** into column and row rules. On mobile cards do the grouping; never nest them. → `notes/batch-01a.md` · "weirdly perfect UI", "Mobile App UI"
- **Relationship × 2**: related text 24 → text group to buttons 48 → button to its small print 24; smaller type on a 16 base. → `notes/batch-09a.md` · "99%"
- **Landing defaults**: text ↔ image ≥80–96px; text ≤600px wide; sections ≥160px top and bottom; cards 32px; a 960px container in equal 2×2 / 3×3 chunks. → `notes/batch-09a.md` · "99%"
- **Multiples of 4 or 8** (25 → 24, 11 → 12). → `notes/batch-09a.md` · "4 levels"

### Recipe: spacing multiplier (Tim)
```css
.container { max-width: 960px; margin-inline: auto; }
section { padding-block: 160px; }  .copy { max-width: 600px; }  .card { padding: 32px; }
.hero .copy > * + *     { margin-top: 24px; }
.hero .copy + .actions  { margin-top: 48px; }  /* 2 × 24 */
.hero .actions + .note  { margin-top: 24px; }  /* small print */
.feature .copy > * + *  { margin-top: 16px; }  /* smaller type, smaller base */
.feature .copy + .media { margin-top: 32px; }  /* 2 × 16 (derived) */
```

## Typography
- **Line length by role** (article): body 50–75 characters (≈70ch; 14 px 55–70, 16 px 60–75, 18 px 65–80), line-height 1.4–1.6; hero 30–40, sub-heads 40–60, CTAs 20–35, tooltips 25–35; cap the container; WCAG 1.4.8 ≤ 80. → `notes/articles-01.md` · "Line Length"
- **Font count**: 1 is fine (usually a sans), 2 is comfortable, 3 only if each has a strict job (display / sans / mono captions), 4 is trouble → `notes/batch-01b.md` · "Perfect Typography". Tim: one, or copy a proven pair's text system → `notes/batch-09a.md` · "99%"
- **Pairings**: display + sans, or sans + serif. Never set paragraphs in a display or handwritten face. → `notes/batch-01b.md` · "Perfect Typography"
- **4 sizes, 2 weights per screen**; big numbers in a mono cut of the same font, decimals at an existing size. → `notes/batch-09a.md` · "4 levels"
- **Role map**: H1 + body large for the hero and final CTA; H2 + body medium elsewhere; H3 for subsections; dense sections 1–2 sizes down. → `notes/batch-09a.md` · "99%"
- **Scale by density** (16px base): 1.62 only for a header/body pair (repeated, it hits 110px by heading 4); 1.27 (√φ) for general sites; ≈1.17 (∛φ, derived) for dashboards and mobile. → `notes/batch-01b.md` · "Perfect Typography"
- **Line-height**: body ≈150%, headings 110–130% (largest at the low end), never "auto"; tracking tightens as size grows → `notes/batch-01b.md` · "Perfect Typography". Stacked display lines may drop to 95% → `notes/batch-09b.md` · "Beginners"
- **Responsive type, two views**: a fluid clamp (recipe) → `notes/batch-01b.md` · "Perfect Typography"; Framer step-down (each heading takes the next one's size per breakpoint; text ≤18px fixed) → `notes/batch-09b.md` · "Beginners"
- **Giant display type**: once, maybe twice per page (Unbounded, Cabinet Grotesk); judge sizes on the target screen, not in zoomed-out Figma. → `notes/batch-02.md` · "8 Web Design Hacks"

### Recipe: √φ scale + fluid size
Size = min + (max − min) × ((vw − 320) / (1920 − 320)), clamped.
```css
:root { --fs-0: 16px; --fs-1: 20px; --fs-2: 26px; --fs-3: 33px; --fs-4: 42px; --fs-5: 53px; } /* (derived) */
h1 { --min: 33; --max: 53; line-height: 1.1; /* bounds (derived) */
  font-size: clamp(calc(var(--min)*1px), calc(var(--min)*1px + (var(--max) - var(--min)) * ((100vw - 320px) / 1600)), calc(var(--max)*1px)); }
```

## Colour (neutrals, accents, semantic, charts, theming)
- **Neutral-first product UI**: 60-30-10 is for marketing sites. Product UI is mostly neutral (Vercel ≈90% black, 8% white, 2% red (creator's claim, unverified)): ≈4 backgrounds, 1–2 strokes, ≈3 text colours. → `notes/batch-01a.md` · "60-30-10 Rule"
- **60-30-10 as a start (Tim)**, even in product: 60% white, 30% complementary (black), 10% brand; tints of one hue, flat over gradients, a red brand off the main button (reads as error). → `notes/batch-09a.md` · "4 levels"
- **Three colours (landing)**: base, primary (CTAs, icon details), neutral (text), base and primary contrasting; text ≈80% largest, 70–60% smaller; primary at 5% fills secondary buttons and call-out cards. → `notes/batch-09a.md` · "99%"
- **Brand, then palette** (chocolate → brown, then Coolors) → `notes/batch-09a.md` · "$5k"; neutrals as black at 100–3% opacity, named by role ("dark 100") → `notes/batch-09b.md` · "Beginners"
- **Light values** ("% white" = lightness, model not stated): background 98–100%, border ≈85%, buttons 90–95%, text 11 / 15–20 / 30–40% (heading / body / subtext). No white cards on white. → `notes/batch-01a.md` · "60-30-10 Rule"
- **Accent ramp roles**: in light mode, main 500/600, hover 700, links 400/500 (generated in UI Colors). → `notes/batch-01a.md` · "60-30-10 Rule"
- **Semantic overrides brand**: status colours on any brand; destructive is always red. → `notes/batch-01a.md` · "60-30-10 Rule"
- **OKLCH for multiple hues**: charts fix L and C and step the hue +25–30 per series; theming sets L − 0.03, C + 0.02 and the target hue. Equal HSL values turn green neon. → `notes/batch-01a.md` · "60-30-10 Rule"
- **Dashboards take colour from data only**; red icons only for urgent actions. → `notes/batch-01a.md` · "dashboard UI flaws"
- **Muted beats pure**: off-whites in light mode, bluish blacks in dark; baby blue, beige, lavender. → `notes/batch-02.md` · "8 Web Design Hacks"
- **Brand restraint**: don't spray the brand colour; let the logo carry a multi-colour brand. → `notes/batch-01a.md` · "4 Levels"; `notes/batch-01b.md` · "Google's AI Website"

### Recipe: neutral stack + OKLCH
```css
:root { /* "% white" mapped to HSL lightness (derived mapping) */
  --bg: hsl(0 0% 98%); --card: hsl(0 0% 100%); --border: hsl(0 0% 85%);
  --chart-1: oklch(0.70 0.14 250); --chart-2: oklch(0.70 0.14 278); /* (derived) */
  --bg-themed: oklch(from var(--bg) calc(l - 0.03) calc(c + 0.02) 150); } /* hue (derived) */
```

## Dark mode
- **Double the distance**: background layers sit 4–6% apart, against ≈2% in light mode. Mirroring the light palette merges them. → `notes/batch-01a.md` · "60-30-10 Rule"
- **Raised = lighter, always**: a lighter fill, or just a border. → `notes/batch-01a.md` · "60-30-10 Rule"
- **Accent up the ramp**: main 300/400, hover 400/500; dim the text, brighten the borders. → `notes/batch-01a.md` · "60-30-10 Rule"
- **Lighten over-saturated brand colours**; frosted glass adds interest. Not for every site. → `notes/batch-02.md` · "Awful To AMAZING"
- **Text, two views**: dim it in a product token system → `notes/batch-01a.md` · "60-30-10 Rule"; flip it to white in a marketing restyle → `notes/batch-02.md` · "Awful To AMAZING"
- **Light ≠ inverted dark**: pull light-mode colours closer together; respect the system appearance. → `notes/batch-01a.md` · "macOS Apps"
- **Colour via the background**: a gradient of two brand colours pulled very dark; light noise. → `notes/batch-01b.md` · "Google's AI Website"

## Surfaces: shadows, borders, gradients, glass
- **Shadow rule**: X ≤ Y; blur = 1.3–2 × Y; opacity 15–20% (not Figma's 25%); stronger on dark. If a shadow or gradient isn't working, drop it. → `notes/batch-02.md` · "8 Web Design Hacks"
- **Border over shadow** for card edges: ≈85% white, not a thin black line. → `notes/batch-01a.md` · "60-30-10 Rule"
- **Depth without shadows**: an offset shape behind a button; section background colours. → `notes/batch-02.md` · "Awful To AMAZING"
- **Button and card depth (Tim)**: primary = white inner top shadow + faded drop shadow; secondary = 5% primary border + the same shadow (values shown on screen, not stated); stacked skeuomorphic shadows are a junior tell. → `notes/batch-09a.md` · "99%", "4 levels"
- **Gradient stroke** marks the one special card (the purchase CTA). → `notes/batch-01b.md` · "Google's AI Website"
- **Glass needs a job**: dark restyles, showcase backdrops, floating panels (values shown on screen, not stated). → `notes/batch-02.md` · "Awful To AMAZING"; `notes/batch-01b.md` · "present UIs"; `notes/batch-01a.md` · "macOS Apps"
- **Glow**: a blurred copy behind the image (blur 24); overflow visible = glow, clipped = glass; blur costs performance → `notes/batch-09b.md` · "Parallax"; a blurred logo behind the hero → `notes/batch-09a.md` · "99%"
- **Continuous corners**: Figma corner smoothing (no value stated), consistent radii; `corner-shape: squircle` under `@supports` (derived). → `notes/batch-07.md` · "Apple's"
- **Mesh gradient**: blurred translucent circles on Overlay, 8–10+ layers; more overlap = brighter. → `notes/batch-02.md` · "Design Effects"
- **Effect fit**: clay = low saturation + two inner shadows; metallic = colour shift mid-gradient + 20% tint; kaleidoscope = decorative only (in Figma its Screen layer must sit on top). → `notes/batch-02.md` · "Design Effects"

## Buttons & actions
- **One primary per header**: delete the second CTA, or strip its background. Delete modal: Delete filled red; Cancel border-only or reduced. → `notes/batch-02.md` · "8 Web Design Hacks"
- **One CTA per page (Tim)**: 1 / 2 / 3 CTAs convert 13.5 / 11.9 / 10.5% (creator's claim, unverified); mixed readiness adds one quieter secondary; chat as an escape valve. → `notes/batch-08.md` · "Conversions"
- **Label = the action**, shortest form ("earn tokens" on a claim button fails); never repeat a nearby heading's word. → `notes/batch-09a.md` · "4 levels"
- **Product ladder**: importance = darkness: ghost → 90–95% white → black with white text. → `notes/batch-01a.md` · "60-30-10 Rule"
- **Landing CTA**: same label and style in the hero and the nav; brand blue with an icon (Level 3). → `notes/batch-01a.md` · "4 Levels"
- **Prompt bar as CTA** for AI products: the visitor has already started an action. → `notes/batch-01b.md` · "Google's AI Website"
- **One first action, big, near the thumb** ("Let's go"; Waze's one-handed targets). → `notes/batch-08.md` · "Hooked"
- **Duality**: every swipe also gets a button (Tinder's stack too, note-taker's view); irreversible actions use slide-to-confirm. → `notes/batch-01b.md` · "Swipe Interactions"; `notes/batch-07.md` · "Tinder"
- **Framer effects**: glow = blurred duplicate (blur 12) growing on hover; shine = tilted bar (blur 6) in the clipped face; toggles need a variant. → `notes/batch-09b.md` · "Button Animations"

### Recipe: 3D press (Tim)
Stated: ledge from bottom padding 6 → 2 pressed; inner shadow X −8, Y −8, blur 4–6, white 15% → 5%; radius 20. Hard-shadow version (derived).
```css
.press { border-radius: 20px; transition: translate 120ms, box-shadow 120ms; /* (derived) */
  box-shadow: 0 6px 0 var(--ledge), inset -8px -8px 6px rgb(255 255 255 / .15); }
.press:active { translate: 0 4px; box-shadow: 0 2px 0 var(--ledge), inset -8px -8px 6px rgb(255 255 255 / .05); }
```

## Icons & imagery
- **One icon set, no emoji**: Phosphor, Lucide or Feather; detail scales with size. → `notes/batch-01a.md` · "Vibe Code"; `notes/batch-02.md` · "8 Web Design Hacks"
- **Flaticon, two views**: avoid it, since styles won't match → `notes/batch-02.md` · "8 Web Design Hacks"; or filter to interface icons → `notes/batch-01b.md` · "Google's AI Website"
- **Solid over gradient icons**, with brand-fitting metaphors (shield vs lock). → `notes/batch-01b.md` · "Google's AI Website"
- **Avatars over names; a tooltip on every icon.** → `notes/batch-01a.md` · "dashboard UI flaws"
- **Image by type**: object → cut out; product → crop to a detail; wide shot → overlay + message; any → mask to brand shapes → `notes/batch-02.md` · "Awful To AMAZING"; stock → the real product → `notes/batch-01a.md` · "4 Levels"
- **Playfulness = brand**: realistic (professional) → doodles → blobs + bright colours. → `notes/batch-01b.md` · "KILL boring"

## Data-driven components & dashboards
- **Data drives form**: fixed values → chips; numbers right-aligned; long text truncated; inactive rows shaded. → `notes/batch-01a.md` · "dashboard UI flaws"
- **Time data → timeline**, plus a roll-up chart. → `notes/batch-01a.md` · "dashboard UI flaws"
- **Invisible UI**: hover copy chips, comment triangles, hover-only secondary actions. Onboarding: one tooltip at a time, never a six-bullet modal → `notes/batch-01a.md` · "dashboard UI flaws"; secondary figures in an expandable tooltip → `notes/batch-07.md` · "13 Minutes"
- **Domain logic over decoration**: delete widgets nobody can explain; merge fragments into the module that owns them. → `notes/batch-01b.md` · "Finance Dashboard"
- **Chart hygiene**: label every number; straight lines (no curves, no fade), grid lines, a time-scale control → `notes/batch-01b.md` · "Finance Dashboard"; a glowing point that follows the finger → `notes/batch-08.md` · "Weirdly Addictive"
- **Data vs feeling**: comparison data stays a dashboard → `notes/batch-07.md` · "Invisible"; commodity consumer data can lead with feeling (Carrot's character) → `notes/batch-04.md` · "Indie Apps"; niche users see, not read (Tiimo) → `notes/batch-04.md` · "Outliers"
- **Richer than default**: a shaded map + list over bars; two columns with small donuts over a KPI row. → `notes/batch-01a.md` · "Vibe Code"
- **Plans**: fewer than 5, prices ascending, price larger than the name, discount and next-plan extras shown. → `notes/batch-01a.md` · "Vibe Code"

### Recipe: priority-tier assembly
1. Delete and merge. 2. Tag modules high, mid or low. 3. High tier first, key module top-left, in a gap-free orientation. 4. Mid, then low. 5. Fill gaps with a missing domain need.

## Layout & sections (landing pages, heroes, breaking the box)
- **3-second test** (landing page, App Store screenshots, first screen): one focal point, consistent space, supporting imagery, balanced type, outcome copy. → `notes/batch-07.md` · "13 Minutes"
- **Section anatomy**: headline (pain or outcome) → new-angle sub → product visual → real proof → one CTA. Fast-scroll test: what is it, how does it help, what next? → `notes/batch-08.md` · "Conversions"
- **Vary the column rhythm at wireframe stage**: mix full-screen, card-row and 3-column sections, or stack two columns into one; never repeat image-left/text-right or reuse a layout. → `notes/batch-02.md` · "Awful To AMAZING"; `notes/batch-01b.md` · "Google's AI Website"
- **Break the box, small first**: stagger cards, bleed rows off-screen, overlap a cut-out subject → `notes/batch-02.md` · "Awful To AMAZING"; a logo slider, a carousel bleeding off the right, the final-CTA image in open space → `notes/batch-09a.md` · "99%"
- **Context, not clutter**: a centred message; relevant objects thin outward and angle inward; if one more object crowds it, remove it. → `notes/batch-01b.md` · "KILL boring"
- **Level 2→3 moves**: zoomed product visual, frame lines, row of 4 → bento, row of 3 → feature switcher, logo wall. → `notes/batch-01a.md` · "4 Levels"
- **Edge audiences get a button, not a section** (≈2% (creator's estimate, unverified)). → `notes/batch-01b.md` · "Google's AI Website"
- **Copy**: short and plain, about the benefit → `notes/batch-01a.md` · "4 Levels"; outcomes over specs ("1,000 songs in your pocket") → `notes/batch-08.md` · "Conversions"

## Mobile & macOS
- **Tab bar**: floating, 3–4 items (5 max), targets ≥44px, the primary action split out. → `notes/batch-01a.md` · "Mobile App UI"
- **Don't shrink**: iOS base 17 vs macOS 13 (pt). → `notes/batch-01a.md` · "Mobile App UI"
- **One module, one direction, one job** per screen; in-context choices go in a bottom sheet. → `notes/batch-01a.md` · "Mobile App UI"
- **Empty states**: first run points at +; no results = image, statement, typo suggestions, exit. → `notes/batch-01a.md` · "Mobile App UI"
- **Teach with affordances, in stages** (the home indicator); key actions within ~3 taps (a guide); screens animate in from somewhere. → `notes/batch-07.md` · "Apple's"
- **Zero-decision feed**: swipe up = next, only for 60-second vertical clips; keep a stopping cue on paid content (note-taker's view). → `notes/batch-05.md` · "Out-Addicts"
- **Command bar**: shortcut → large focused input → first result selected; never keyboard-only (note-taker's view). → `notes/batch-08.md` · "Raycast"
- **macOS appear-and-disappear**: a shortcut panel (no traffic lights, native blur) turns into a toast; saving is optimistic. → `notes/batch-01a.md` · "macOS Apps"
- **macOS shell**: actions top, a sidebar only if navigation needs one, the top ≈50px drag area clear; every shortcut gives feedback; drag in and out. → `notes/batch-01a.md` · "macOS Apps"

## Motion & micro-interactions
- **Never linear; the curve sets tone**: quick = efficient, springy = playful, long = calm. → `notes/batch-01b.md` · "Swipe Interactions"
- **Load sequences**: chain start states on a paused GSAP timeline with `expo.inOut`; big moves 1.3 s, wipe halves 1 s, pop-in 0.8 s, fades 0.6 s staggered 0.2 s; content rises with the curtain. → `notes/batch-03.md` · "Part 2"
- **Physics is function**: rubber-band overscroll, momentum, friction, haptics. → `notes/batch-07.md` · "Apple's"
- **Never a static wait**: a reacting loader → `notes/batch-08.md` · "Hooked"; steps named as they run ("reading your chart") → `notes/batch-04.md` · "Twisted Psychology"
- **Feedback vs peak**: a small bounce or glow on each repeated confirm → `notes/batch-08.md` · "Weirdly Addictive"; one designed peak and ending per flow → `notes/batch-07.md` · "Tiny Design"
- **Polish = trust** in money and health (Revolut's 3D card); never soften warnings (note-taker's view). → `notes/batch-08.md` · "Weirdly Addictive"
- **Plan the movie**: transitions, not frames → `notes/batch-09a.md` · "4 levels"; emotional moments marked in UX, built light in Rive → `notes/batch-06.md` · "World Class"
- **Carousels**: bounce for momentum, edge skew for a 3D ring, magnetic indicator dots. → `notes/batch-01b.md` · "Swipe Interactions"
- **Follow the finger**: a shared-element zoom beats a page slide; on swipe-back, the page underneath starts ≈35% left. → `notes/batch-01b.md` · "Swipe Interactions"; `notes/batch-01a.md` · "Mobile App UI"
- **Character**: fitting entrances (pop, fly-in + bob), margin parallax, literal kinetic text ("deadlines" → a filling bar). → `notes/batch-01b.md` · "KILL boring"
- **Safe motion**: slow photo zoom, accordions, staggered load-in; marquees cost usability. → `notes/batch-02.md` · "Awful To AMAZING"
- **The 8→10 details**: blur cross-fades, a sliding mega menu, hover cards that blur and scale the image and reveal copy. → `notes/batch-01a.md` · "4 Levels"; `notes/batch-01b.md` · "Google's AI Website"

### Recipe: GSAP load sequence (Kole)
Loader: fixed, top/left 0, z-index 10, 100vw × 100vh, black. Without GSAP, ≈ `cubic-bezier(0.87, 0, 0.13, 1)` (derived).
```js
gsap.set(".navbar", { opacity: 0 });
gsap.set(".header-spacer", { yPercent: 100 });                  // 100% of its own height
gsap.timeline({ paused: true })
  .to(".logo-container", { opacity: 1, delay: 1 })              // duration (shown on screen, not stated)
  .to(".loading-screen", { yPercent: -100, duration: 1.3, ease: "expo.inOut" })
  .to(".header-spacer", { yPercent: 0, duration: 1.3, ease: "expo.inOut" }, "<")
  .to(".navbar", { opacity: 1, duration: 0.3 }).play();      // play (derived)
```
The nav-from-a-dot and text-wipe timelines are in the notes.

### Recipe: parallax speeds + slow spin (Tim, Framer values)
Stated: Scroll speed 130 / 20 / 140 from 96px below the viewport top; 360° over 65 s; blur 24. Script (derived); 100 = normal speed.
```css
.float { position: absolute; animation: spin 65s linear infinite; }  /* linear (derived) */
.float .blur { position: absolute; inset: -8%; z-index: -1; filter: blur(24px); } /* inset (derived) */
@keyframes spin { to { rotate: 360deg; } }
```
```js
const els = [...document.querySelectorAll('.float[data-speed]')];
function update() { for (const el of els) {
  const s = el.dataset.speed / 100, top = el.closest('section').getBoundingClientRect().top;
  el.style.translate = `0 ${Math.max(0, 96 - top) * (1 - s)}px`; } }
addEventListener('scroll', () => requestAnimationFrame(update), { passive: true }); update();
```

### Recipe: bottom sheet, page recedes
```css
.page, .sheet { transition: transform .35s cubic-bezier(.22, 1, .36, 1); }   /* (derived) */
.sheet { transform: translateY(100%); }
body.sheet-open .page  { transform: translateY(10px) scale(.94); }            /* (derived) */
body.sheet-open .sheet { transform: none; }
```

## Product psychology: onboarding & first run
- **Short by default**: sign-in + the one permission the core action needs, value in the next real use (Granola). → `notes/batch-04.md` · "Onboarding Paradox"
- **Long only if it buys something**: a first screen personalised by the answers, or a buyer filter (Cal AI's 20-plus steps); effort raises value only when it feeds the result. → `notes/batch-04.md` · "Onboarding Paradox", "Twisted Psychology"
- **Value before setup**: a real session first (Breathwrk) → `notes/batch-08.md` · "Growth Killer"; swiping in under a minute → `notes/batch-07.md` · "Tinder"
- **Prepare, don't work them**: three no-input screens; a first task with hints; preferences as "what works for you"; "step 2 of 5" on short flows, never a faked count on long ones (note-taker's view). → `notes/batch-08.md` · "Growth Killer"
- **Friction sweet spot**: zero friction also loses people; a story-style carousel restates value, core setup within five screens. → `notes/batch-07.md` · "13 Minutes"
- **Mood from first open**: colour, motion and sound together (Headspace) → `notes/batch-08.md` · "Hooked"; a brief built live, then "come back tomorrow" (Ahead) → `notes/batch-07.md` · "Tiny Design"
- **First-run audit**: fix the 1–3 biggest frictions (smart defaults, one-click actions, sample data); paths per emotional persona. → `notes/batch-07.md` · "Netflix"

## Paywalls & monetisation
- **Trust screen after felt value**: "No payment due now", the charge date and a reminder promise (Cal AI); 82–89% of starts on install day (creator's claim, unverified). → `notes/batch-05.md` · "10,000 Paywall"
- **Charge line in the reading flow**: when and for what, never fine print (Blinkist); a day-by-day trial timeline. → `notes/batch-05.md` · "10,000 Paywall"; `notes/batch-08.md` · "Growth Tricks"
- **Structure before price**: localisation, trial, plan count, then price; weekly entry plan with a trial, annual saving kept visible (note-taker's view). → `notes/batch-05.md` · "10,000 Paywall"
- **SaaS levers** (creator's claim, unverified): "guest pass" framing, one-touch trial, longer trial on the bigger plan, "Pro" labels, locks at the intent peak; each needs its honest version (Ethics). → `notes/batch-08.md` · "Growth Tricks"
- **Upsell in context, never mid-loop** → `notes/batch-07.md` · "Tinder"; escalate attention → effort → money, coins with a currency equivalent and running total → `notes/batch-05.md` · "Out-Addicts"

## Retention, rewards & gamification
- **PBL fallacy**: points and badges are the scoreboard, not the game; reward the behaviour the product needs. → `notes/batch-05.md` · "500+ Gamified"
- **Competence and closure**: live output, auto-flagged records, milestones of real volume, one skill rating; closure rings. → `notes/batch-05.md` · "500+ Gamified"
- **Few mechanics, one hero measure**: engagement reverses past an S-curve (never 20 loops a screen); controlled surprise on a transparent base. → `notes/batch-05.md` · "500+ Gamified", "Scientifically"; `notes/batch-08.md` · "Hooked"
- **Leaderboards**: at completion, a cohort small enough to win, human recognition. → `notes/batch-04.md` · "Leaderboards Kill"
- **Streaks need agency** (goal, freeze, exit) → `notes/batch-05.md` · "500+ Gamified"; no shame states (red overages, broken-streak marks; show a 3-week trend) → `notes/batch-04.md` · "Outliers"; the stake on screen, not the metric (Forest) → `notes/batch-04.md` · "Indie Apps"
- **Gift, not receipt**: anticipation → one-by-one reveal → celebration → afterglow (share prompt, badge, stat). → `notes/batch-05.md` · "3-Stage Trick"
- **Peak-end**: one peak, a designed ending (checkmark, summary card), then fix waits and errors → `notes/batch-07.md` · "Tiny Design"; asks right after real wins, with a "not now" (note-taker's view) → `notes/batch-07.md` · "13 Minutes"
- **Investment layer**: each session improves the product for this user, visibly, with export and reset (note-taker's view). → `notes/batch-06.md` · "New Way"
- **Identity metric**: one composite (Whoop Age) + a weekly bounded score (−1 to 3) beside its levers; trend, not alarm (note-taker's view). → `notes/batch-06.md` · "Will Die"
- **Community as structure**: a top-level social feed (Strava) → `notes/batch-06.md` · "Will Die"; shared timing (Ladder) → `notes/batch-04.md` · "Outliers"; interest shown only when mutual → `notes/batch-07.md` · "Tinder"

## Sharing & virality
- **The flex**: what users are proud of, as a clean card; sharing = inviting (Airbuds). → `notes/batch-04.md` · "Twisted Psychology"
- **Labels and identity lines**: earned, flattering, showable → `notes/batch-04.md` · "Twisted Psychology"; who, not what ("night owl", not "25 tasks"), with the data shown (Barnum risk, note-taker's view) → `notes/batch-07.md` · "Spotify"
- **Ceremony, not report**: Wrapped is gated, sequential, ends on a share prompt. → `notes/batch-07.md` · "Spotify"; `notes/batch-05.md` · "3-Stage Trick"
- **Screenshot moments**: delight at the strongest emotion; human row titles ("Because you watched…"). → `notes/batch-07.md` · "Netflix"
- **Distribution by design**: real actions inside teammates' tools, not referral gimmicks. → `notes/batch-08.md` · "Raycast"

## Ethics: dark patterns and honest alternatives
SKILL.md's guardrail applies. Labels are the note-taker's unless stated; the creator presents several favourably.

| Don't build | Build instead | Source |
|---|---|---|
| Variable-ratio rewards; rationed matches; paid packs (loot boxes) | Predictable rewards, rare bonuses, none on paid draws | `notes/batch-05.md` · "Scientifically", "3-Stage Trick" |
| Variable coin prices, awkward bundles, no spend history ("arguably a dark pattern", per the creator) | Stable prices, currency equivalent, running totals | `notes/batch-05.md` · "Out-Addicts" |
| Loss-aversion streaks; "never let them finish"; hidden match ratings | Freeze, pause, exit; done states; transparent ratings | `notes/batch-05.md` · "500+ Gamified", "Scientifically" |
| Celebrating risky or costly actions (Robinhood's trade confetti) | Celebrate the user's outcomes | `notes/batch-05.md` · "3-Stage Trick" |
| Fear-driven health scores; one-tap copy trades | Trend + levers; pause, risk disclosure, review | `notes/batch-06.md` · "Will Die" |
| Lock-in as the goal; silent personalisation; binge maximisation | Real export; view, reset, off; stopping points | `notes/batch-06.md` · "New Way"; `notes/batch-07.md` · "Netflix" |
| Silent trial conversion; hidden monthly plan | Charge date, amount, cancel on one screen | `notes/batch-08.md` · "Growth Tricks" |
| Fake presence, proof or progress; mood instead of disclosure | Real counts; risks as clear as the mood | `notes/batch-08.md` · "Hooked", "Weirdly Addictive" |

## Design process & QC
- **Six stages**: onboarding → discovery → UX (wireframe everything, onboarding deep, settings light; agree states early) → UI → emotional integration → delivery. → `notes/batch-06.md` · "World Class"
- **Per-screen QC before the next screen**: consistent radii, only system shades, no unintended emphasis, microcopy, exact opacities. → `notes/batch-06.md` · "World Class"
- **Five-point audit** (pass / half / fail): copy, visuals, colour, type count, spacing. → `notes/batch-09a.md` · "4 levels"
- **Journey audits**: peak-end map → `notes/batch-07.md` · "Tiny Design"; cut taps and "Are you sure?" that guard nothing → `notes/batch-05.md` · "Out-Addicts"
- **Question the category default**: a niche gets its own interface, not a reskin. → `notes/batch-04.md` · "Outliers"
- **Consistency**: objects behave the same everywhere; patterns break only on purpose. → `notes/batch-07.md` · "Spotify", "Apple's"
- **Ask why; test lo-fi**, watching for hesitation. → `notes/batch-08.md` · "Designers Anymore"; `notes/batch-03.md` · "Case Study"

## Presenting work
- **Setting first**: a showcase impresses; for clients use device mockups and working prototypes, not descriptions. → `notes/batch-01b.md` · "present UIs"
- **Backdrop**: the accent darkened and desaturated (light designs); large, heavily blurred accent circles (dark designs). → `notes/batch-01b.md` · "present UIs"
- **Skew**: 2° vertical, −14° horizontal (stated); no more. → `notes/batch-01b.md` · "present UIs"
- **Collage**: offset screens off-canvas, break the grid, rotate a few degrees; crop dashboards to one region. → `notes/batch-01b.md` · "present UIs"
- **Case study order**: problem sentence + solution snapshot → research → persona → small flow → tested lo-fi → large screens with reasoning → reflection. → `notes/batch-03.md` · "Case Study"

## AI-generated UI and AI features
- **Tell → fix**: emoji → one icon set; AI palette → your own; repeated KPI cards → de-duplicate, add micro charts; gradient-initial avatar → account card + popover; dead cards → delete; sidebar stats → Analytics tab; sparse flyout → modal. → `notes/batch-01a.md` · "Vibe Code"
- **Spend human time** on layouts, cards and hidden UI; AI handles logic when told. → `notes/batch-01a.md` · "Vibe Code", "dashboard UI flaws"; AI for mockups, not UI (Kole's view; Conflicts) → `notes/batch-01b.md` · "present UIs"
- **"Dribbble fashion"**: unlabelled numbers, decorative diagrams, tiny dot pagination. → `notes/batch-01b.md` · "Finance Dashboard"
- **Generic data, generic flows**: one-shot AI UI fails specific user problems; landing pages are 80/20 (Relume → Figma → Figma Sites). → `notes/batch-08.md` · "Designers Anymore"
- **AI copy pass**: screenshot + context to ChatGPT, "clear but short". → `notes/batch-09a.md` · "4 levels"
- **AI inside familiar objects** (Discover Weekly is a normal playlist) → `notes/batch-07.md` · "Spotify"; when AI is the core job, rebuild around it (Cal AI's camera home) → `notes/batch-04.md` · "Outliers"
- **Outcome first**: answer, then articles, then a human (Fin), escalation always visible (note-taker's view); automate repetitive utility flows. → `notes/batch-07.md` · "Invisible"

## AI builders (Lovable)
- **One requirements prompt**: overview → pages → functionality → database → aesthetic → sequence (UI first), plus a Figma screenshot per data state (empty, populated). → `notes/batch-09b.md` · "Lovable"
- **Small prompts, concrete reports**: few instructions each; say what you clicked and what happened; paste red console errors; ask for UI and database together ("in the UI and in the database"). → `notes/batch-09b.md` · "Lovable"
- **Then a design pass**: fidelity is close, not crisp; the video is a paid collaboration. → `notes/batch-09b.md` · "Lovable"

## Figma workflow
- **Auto layout = flexbox** (Shift+A): duplicate a row into a table; spacing set once. → `notes/batch-01b.md` · "Auto Layout"
- **Fixed is why it won't respond**: set layers to Fill and resize to test. → `notes/batch-01b.md` · "Auto Layout"
- **A new wrapper resets its children to Hug**: set them back to Fill; pad only the text wrapper so images stay full-bleed. → `notes/batch-01b.md` · "Auto Layout"
- **Absolute position** for corner tags; **Clip content** for the radius; **excluded strokes** don't push content. → `notes/batch-01b.md` · "Auto Layout"
- **Multi-edit**: select matching layers (by name and grouping position) and edit once; a Section limits the scope. → `notes/batch-03.md` · "Figma Update"
- **Prototyped sequences**: one frame per state; opacity 0, not deleted; Instant snaps, Smart Animate moves, After delay 1 ms chains; build in reverse (pill → 53 × 53 circle → 1 × 1 dot). → `notes/batch-03.md` · "Part 1"

## Framer & no-code builds
- **Boxes in boxes**: section → nav → max-width container → left / centre / right stacks; padding needs Fit, Distribute needs Fixed. → `notes/batch-09b.md` · "Beginners"
- **Hero**: Fit height + min-height 100vh; max width (960) on the wrapper, decorative images inside it; check the published site. → `notes/batch-09b.md` · "Beginners"
- **Template → custom**: brand → palette → cut sections → corners → texture → fonts → copy → imagery. → `notes/batch-09a.md` · "$5k"
- **Figma → Framer → Spline**: camera states too; scroll 0 → 1500 (≈500 per section). → `notes/batch-09b.md` · "3D Website"
- **Entrances**: build one, paste onto the rest; spring 240 / 24 / 2.4; trigger at Top or Center (Bottom fires too early). → `notes/batch-09b.md` · "3D Website", "Parallax"

### Recipe: sticky 3D scroll (Tim)
Stated: a 300vh container holds a 100vh sticky embed; content z-index 2, decor −1; overflow visible on every ancestor. Mapping (derived).
```css
.scroll-track { position: absolute; inset: 0 0 auto 0; height: 300vh; }  /* no overflow:hidden above */
.stage { position: sticky; top: 0; height: 100vh; }                      /* Spline embed */
.content { position: relative; z-index: 2; }  .content .deco { position: absolute; z-index: -1; }
.content section { height: 100vh; max-width: 1200px; margin-inline: auto; }
```

## Resources & tools
| Tool | Use | Source |
|---|---|---|
| Mobbin | UI and flow research, not layouts to ship (note-taker's view); the video is sponsored | `notes/batch-08.md` · "5 Tools" |
| Coolors, UI Colors | Palettes; accent ramps | `notes/batch-09a.md` · "$5k"; `notes/batch-01a.md` · "60-30-10 Rule" |
| Rive | Light, interactive emotional animation | `notes/batch-06.md` · "World Class" |
| Spline, Pexels, Midjourney, Canva | 3D, free media, assets in the site's colours, cut-outs | `notes/batch-09a.md` · "99%" |
| Relume, Google Stitch, Lovable | Landing bases, quick flows, builds | `notes/batch-08.md` · "Designers Anymore" |
| GSAP; framer.supply (as heard) | Timelines; free Framer components | `notes/batch-03.md` · "Part 2"; `notes/batch-09b.md` · "Parallax" |
| Contra, Kortex, Serif | Hiring, notes, inbox (sponsored) | `notes/batch-08.md` · "5 Tools" |

## Business: pricing & landing clients
- **Sell the problem** ("not enough customers"), not the deliverable; case studies = services → problem → solution, with numbers. → `notes/batch-02.md` · "Land Clients"
- **Hourly** (US-type markets): $20–30 → $35–50 → $60–100/h as experience grows; then move off hourly. → `notes/batch-02.md` · "Price Website Designs"
- **Project price** = hours (meetings and revisions included) × rate × 1–2 ($4,000 → $6,000 at 1.5×). → `notes/batch-02.md` · "Price Website Designs"
- **Value-based**: 5–10% of the added revenue, only with a measurable revenue link. → `notes/batch-02.md` · "Price Website Designs"
- **Landing tiers**: ≈$500 / $2k / $6–10k / $10k+ (creator's claim, unverified). → `notes/batch-01a.md` · "4 Levels"

## Conflicts: the skill's original rules, and video vs video
| Rule A (SKILL.original.md, or one video) | Rule B (other videos) | Resolution |
|---|---|---|
| No proportion rule; high-contrast accents | Product UI ≈90% neutral ("60-30-10 Rule") | Marketing: expressive accent. Product: neutrals + one ramp + semantic colours |
| HSL ramp, ±10% per step | Ramp roles per mode; OKLCH across hues ("60-30-10 Rule") | Keep 50–950 names; UI Colors/OKLCH; HSL within one hue only |
| Scale 1.25 / 1.333 / 1.618 landing / 1.125 dense | 1.27, ≈1.17 (derived) dense, 1.62 for two levels ("Perfect Typography") | 1.25 ≈ 1.27 stands; dense 1.125–1.17; one giant display line, not multi-level 1.618 |
| Breakpoints 320/768/1024/1440 | Fluid type ("Perfect Typography"); Framer steps at 960/560 ("Framer For Beginners") | Breakpoints for layout; clamp in code, step-down in Framer; small text never shrinks |
| Weights 400/500/700 | ≤2 weights, one skipped ("8 Web Design Hacks"); 4 sizes ("4 levels of UI/UX") | 400 + 700 per screen; count sizes too |
| Dark = alias per token (0 ↔ 950) | Gaps 4–6%, raised lighter, accent 300/400 ("60-30-10 Rule") | Keep aliases; tune the dark set separately |
| "Dark-first: 80%+ mobile users" | System appearance ("macOS Apps"); not every site ("Awful To AMAZING") | Both modes; dark-first only by brand choice |
| Bento, glass, aura gradients | Drop what isn't working ("8 Web Design Hacks"); flat over gradients ("4 levels of UI/UX") | A trend only with a job (bento breaks a uniform row: "4 Levels") |
| Shadow tokens, no values | X ≤ Y, blur 1.3–2 × Y, 15–20% ("8 Web Design Hacks") | Derive tokens from the rule; borders for card edges; dark elevation = lighter |
| Empty = illustration + CTA | Two empty states ("Mobile App UI"); sample data ("Netflix Made Us") | First run vs no results; dashboards may open on marked sample data |
| Skeletons replace all spinners | Reacting loader ("Hooked"); named steps ("Twisted Psychology") | Skeletons for known-shape content; loaders or named steps for compute waits |
| Spring physics over linear | Curve sets tone ("Swipe Interactions"); `expo.inOut` ("Part 2") | Springs for gestures; exponential in-out for choreography |
| Breathing room | Whitespace barely fixes density ("weirdly perfect UI"); when unsure, more space ("Better Than 99%") | Dense product: edges + variety; landing: Tim's defaults |
| No ad-hoc pixels | Decoration by eye ("KILL boring") | Tokens for components; eye for decoration |
| Primary = brand colour | Importance = darkness ("60-30-10 Rule"); red brand off it ("4 levels of UI/UX") | Brand primary on landing unless it reads as error; darkness ladder in product |
| AI in sidebars, not centre-stage | Prompt-bar hero ("Google's AI Website"); familiar objects ("Spotify"); camera-first ("Outliers") | Chat in side panels; AI that improves a surface lives in it; AI that is the core job is the primary action |
| Tim: 60-30-10 as the start, even in product ("4 levels of UI/UX") | Kole: product ≈90% neutral ("60-30-10 Rule") | Count black as neutral: 60 + 30 ≈ 90%. 60-30-10 for marketing and simple screens; the neutral stack for dense product |
| Kole: body 100%, headings 110–130% ("Perfect Typography") | Tim: text 80 / 70–60% ("Better Than 99%"); display lines at 95% ("Framer For Beginners") | Product: Kole. Marketing: Tim's ramp if it passes SKILL.md's contrast check; sub-100% only on short display lines |
| Short onboarding ("Onboarding Paradox", "Growth Killer", "Tinder") | Cal AI 20–28 screens, Noom 113 (creator's claim, unverified; "Onboarding Paradox", "10,000 Paywall") | Short by default; long only if answers feed the first screen or qualify buyers, with honest progress |
| Badges as afterglow or peak ("3-Stage Trick", "Tiny Design") | Badges are the scoreboard ("500+ Gamified") | Badges only for real volume or skill; one hero measure |
| Stakes: the tree dies ("Indie Apps") | No shame ("Outliers"); streak trap ("500+ Gamified") | Stakes only on a session the user started; no guilt for long-term misses; streaks with freeze and exit |
| Never let them finish ("Scientifically", "Hooked") | Designed endings ("Tiny Design") | Every session gets a done state; lifetime totals may stay uncapped |
| Kole's Figma: 800 / 300 / 400 / 200 / 700 ms ("Part 1") | Kole's code: 1.3 / 0.8 / 1.3 / 0.6 (+0.2 stagger) / 1 s ("Part 2") | Ship the coded values; Figma's as a snappier variant; retune by eye |
| One peak, minimal details ("Tiny Design", "Better Than 99%") | Feedback on every confirm ("Weirdly Addictive") | Small feedback on confirms; one peak per flow; celebrate in proportion |
| One CTA per page ("Conversions") | Readiness pair + escape valves (same video) | One filled primary per section; a quieter secondary only for mixed readiness |
| Zero-decision player ("Out-Addicts"); fixed model ("Raycast") | Friction sweet spot ("13 Minutes"); make it theirs ("Growth Killer") | Cut empty decisions, keep real-mistake confirms and a stopping cue; fixed models for focused tools |
| AI palette → your own ("Vibe Code"); AI for mockups ("present UIs") | Relume bases ("Designers Anymore"); Lovable builds ("Lovable") | AI scaffolds from the designer's screens; a human owns palette, hierarchy, rhythm |
| Hero heading 40–60 characters (Tim, "Better Than 99%" / SKILL.md) | Hero and large headings 30–40 characters (Khoa Le, line-length article) | Size decides: display H1 ≥ 56 px aims for 30–40 characters; 40–48 px heroes can run to 60. Either way 2 to 3 balanced lines |
