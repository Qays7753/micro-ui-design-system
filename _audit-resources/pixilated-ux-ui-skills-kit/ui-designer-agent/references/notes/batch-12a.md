## I Redesigned Midjourney’s Landing Page in 19 Minutes (Without AI)
- source: Tim Gabe · https://youtu.be/_n39rxieClg
- type: redesign/breakdown
- tags: redesign, landing-page, hero, imagery, gradients, shadows, buttons, navigation, inputs, typography, copywriting, spacing, sections, auto-layout, animation, scroll, smart-animate, prototyping, figma, ai

### Takeaways
- His diagnosis: the current site puts weight on the people behind Midjourney and undersells what the tool can produce. He admits their goals for the site may differ from his. His goal is to make the page about the output, the images.
- For a generative tool, the product's results are the hero. Lead with a wall of them.
- An image collage should look dynamic, not perfect: rectangles of mixed sizes (some tall), roughly placed.
- Rounding on the image tiles: 16 (he tried 8 first).
- His go-to colour trick: duplicate one vivid image and blur it heavily. The blur carries the image's colours and turns into a glow that ties the collage together.
- Fade the collage so it sits behind the text: 50–70% opacity, with the tiles at the edges faded more. Tilt it slightly and scale it up (K tool).
- Lock decorative background layers while you design so you don't move them by accident. Unlock them when you build the animation.
- Logotype in Roboto Mono (captions: "Roberto mono"), 18, Regular. He isn't sure it's Midjourney's font, but it looks "AI-ish" and fits the vibe. He moved it from Light to Regular, and the nav links too.
- Trim the nav to two actions: Sign in and Join the beta. Only Join the beta becomes a real button, because it's the primary action.
- Take the primary colour from the brand: he eyedrops the colour he sees as Midjourney's main one on the existing site.
- Glow button: a drop shadow with everything at 0 except blur 24, in the button's own colour. He then says 16 is fine (most likely the blur; not explicit).
- Nav: one auto layout, Space between so the logo and actions go to the corners, 24px vertical padding.
- Hero headline: 56, one bold claim line. His copy is a placeholder, and he apologises for it.
- Show how the tool is used, not only what it makes: a second section with a mock prompt input ("/imagine" plus a prompt such as "vivid wallpaper").
- Spacing inside the prompt section: 64. He tried a tighter 48 and went back to 64 to give it breathing room, stressing that spacing matters a lot in UI.
- Two button sizes: the nav button is "medium" and the footer button "large", sized with a value of 24 on the 8-point grid (the property isn't named).
- Name layers for the animation you'll build later ("second heading", "button"). It makes the scroll frames easier to manage.
- The second blurred-image glow uses Layer blur 200. Changing the blurred shape changes the colours you get from it.
- Map a section's accent to its own glow. In the footer he strengthens the gradient-text colour and changes the button colour to match the new blurred image.
- Keep it short: a hero, one explanatory section and a footer is enough for this page.
- Scroll motion in Figma: one frame per scroll state, with drag interactions between them. The motion he plans:
  - On load: text fades in, images fade in, the blur fades in and grows, and the nav comes in from the top.
  - Scroll 1: hero text moves up, the images shrink and fade, the blur moves up and fades, and the prompt section rises from the bottom.
  - Scroll 2: the prompt section fades out (possibly scaling up), and the footer comes in.
- Stagger the incoming items by giving each a different start offset, so they don't move in sync. A slightly random feel looks better.
- Shorter travel gives smoother motion. His first scroll felt jagged and too quick because he had pushed the incoming items too far down. Moving them closer fixed it.

### Recipes
Before → after, each change with the reason he gives [00:00–13:25]:
1. Page focus: the people behind the project → the output, the images. Reason: show the tool's full potential.
2. Hero background: (current hero not described) → a collage of mixed-size image tiles, radius 16, 50–70% opacity with the edges faded more, tilted and scaled, over a blurred copy of the most vivid image. Reason: output first; dynamic rather than tidy.
3. Nav actions: Get started, Showcase, Join the beta, Sign in and an icon → Sign in plus Join the beta, and only Join the beta is a button. Reason: focus on two actions with one clear primary.
4. Logotype: → Roboto Mono, 18, Regular. Reason: an "AI-ish" look that fits the product.
5. Primary colour: → eyedropped from the existing site's main colour. Reason: keep the brand's own colour.
6. Primary button: → glow shadow (0, 0, blur 24, then 16) in the button colour. Reason: a "shine" effect.
7. Hero headline: → 56, a single claim line ("Midjourney is the AI tool of our generation"). He calls his copy weak.
8. New prompt section: → a centred heading ("Enter a prompt, watch the magic happen"), a mock input that shows "/imagine" and a prompt, gradient text inside the input, and the collage reused behind it, weaker in colour. Gap 64. Reason: this section is about prompting, so show the prompt itself.
9. Footer: → short and simple. A CTA heading ("Ready to be blown away? Join the beta today", which he calls cliché) with part of it in gradient text, a large button, and the links About, Careers, Contact. Reason: he wants a very short, simple site.
10. Footer glow: → a different image at Layer blur 200, reshaped, sent to the back, plus a sphere filled with the background colour and blurred, placed on top. Gradient and button recoloured to match. Reason: a more aesthetic match with the new colours.

Build steps (Figma):
1. Collage [01:02–03:36]
   1. Draw rectangles of different sizes.
   2. Use "Place image and video", multi-select the files and click each rectangle to drop them in. The cursor shows how many images are left.
   3. Select all → radius 16 → group as "images".
   4. Duplicate the most vivid image and blur it ("image blur").
   5. Fade the tiles to 50–70%, more at the edges. Tilt, then scale up with K. Lock the layers.
2. Nav [03:36–05:40]
   1. Logotype in Roboto Mono, 18, Regular.
   2. Sign in as a text link. Join the beta as a button: eyedropped fill, rounding changed (value shown on screen, not stated), drop shadow at 0/0/0 with blur 24 in the same colour.
   3. Wrap the actions in an auto layout ("right side"). Wrap logo plus actions in a second auto layout ("nav"): Space between, vertical padding 24.
3. Hero headline [05:40–06:42]: 56.
4. Prompt section [06:42–09:46]
   1. Copy the headline, centre it and make it bigger (size not stated).
   2. Build the input as an auto layout: new fill colour, Regular text, rounding. The prompt text gets a linear gradient.
   3. Wrap heading and input in an auto layout ("second heading"), gap 64.
   4. Copy the collage, unlock it, send it to the back, reposition it and weaken its colour.
5. Footer [09:46–13:25]
   1. CTA heading with a linear-gradient part, plus a large button.
   2. Duplicate a different image, Layer blur 200, change its shape and send it to the back.
   3. Add a circle filled with the background colour, give it a layer blur and put it on top.
   4. Retune the gradient and the button colour to this glow. Add About, Careers, Contact.
6. Load-in [13:25–15:28]
   1. Copy the hero into a start frame with everything unlocked. Fade the text and images to 0, shrink and fade the blur, and move the nav above the top.
   2. Add a flow starting point. After delay 1000 ms → Smart animate, Slow spring, 600 ms (as stated).
7. Scroll frames [15:28–17:31]
   1. Build the end state of each scroll first.
   2. Paste the incoming items into the previous frame, pushed down and faded out. Offset each item's position individually so they arrive out of sync.
   3. For the outgoing items, move them up, shrink or scale them and fade them.
8. Interactions [17:31–19:37]
   1. On drag on the headline → next frame, Smart animate, with extra duration so the drag feels slow (value not stated).
   2. Add On drag back links so you can scroll back up.
   3. If a step feels jagged, reduce how far the incoming items travel.

### CSS translation
```css
/* Hero: collage + colour glow. Tile layout, tilt, scale and the hero blur are derived; radius 16 and 50–70% opacity are stated */
.mj-hero { position: relative; isolation: isolate; overflow: clip; min-height: 100svh;
  display: grid; place-items: center; text-align: center; }
.collage-wrap { position: absolute; inset: 0; z-index: -1; }   /* holds .collage and carries its scroll effect */
.collage { position: absolute; inset: -10%; pointer-events: none;
  display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 140px; gap: 16px;
  rotate: -6deg; scale: 1.15; opacity: .6;
  mask-image: radial-gradient(closest-side, #000 55%, transparent); }   /* edges fade more */
.collage img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; }
.collage .tall { grid-row: span 2; } .collage .wide { grid-column: span 2; }
.glow { position: absolute; inset: 15%; z-index: -2; background: url(vivid.jpg) center / cover;
  filter: blur(120px); }

/* Nav: Space between, 24px vertical padding (stated); side padding derived */
.nav { display: flex; justify-content: space-between; align-items: center; padding: 24px 40px; }
.logo { font: 400 18px/1 "Roboto Mono", ui-monospace, monospace; }
.btn { background: var(--brand); color: #fff; border-radius: 999px; padding: 12px 20px; } /* radius and padding derived */
.btn--glow { box-shadow: 0 0 24px var(--brand); }   /* x 0, y 0, spread 0, blur 24 (stated) */
.btn--lg { padding: 16px 24px; }   /* "24" stated with no property named; padding assumed (derived) */
.mj-hero h1 { font-size: clamp(36px, 5vw, 56px); }   /* 56 stated; mobile floor derived */

/* Prompt section: gap 64 (stated), gradient prompt text */
.prompt-section { display: flex; flex-direction: column; align-items: center; gap: 64px; }
.prompt { display: inline-flex; gap: 12px; padding: 16px 24px; border-radius: 16px;
  background: rgb(255 255 255 / .06); }   /* derived */
.grad-text { background: linear-gradient(90deg, var(--c1), var(--c2)); -webkit-background-clip: text;
  background-clip: text; color: transparent; }

/* Footer: blurred image at 200 (stated) under a blurred circle in the page background colour */
.footer { position: relative; isolation: isolate; overflow: clip; }
.footer .glow { inset: 20% 10% -30%; border-radius: 50%; filter: blur(200px); }
.footer .sphere { position: absolute; inset: 35% 30% auto; aspect-ratio: 1; border-radius: 50%;
  background: var(--bg); filter: blur(80px); z-index: -1; }   /* size and blur derived */

/* Load-in after a 1000 ms delay over 600 ms (stated). The Slow spring is replaced by an ease-out curve (derived) */
@keyframes mj-rise  { from { opacity: 0; translate: 0 24px; } }
@keyframes mj-drop  { from { opacity: 0; translate: 0 -100%; } }
@keyframes mj-bloom { from { opacity: 0; scale: .6; } }
.mj-hero .copy, .collage { animation: mj-rise 600ms cubic-bezier(.22, 1, .36, 1) 1000ms both; }
.nav  { animation: mj-drop  600ms cubic-bezier(.22, 1, .36, 1) 1000ms both; }
.mj-hero .glow { animation: mj-bloom 600ms cubic-bezier(.22, 1, .36, 1) 1000ms both; }

/* Scroll beat 1, using real scroll instead of his drag frames. Scroll effects sit on wrappers so they
   don't fight the load-in. The per-item ranges give the "out of sync" stagger (all derived) */
@supports (animation-timeline: scroll()) {
  .hero-copy-wrap { animation: mj-up linear both; animation-timeline: scroll(root); animation-range: 0 60vh; }
  .collage-wrap   { animation: mj-shrink linear both; animation-timeline: scroll(root); animation-range: 0 80vh; }
  .prompt-section > * { animation: mj-in linear both; animation-timeline: view(); animation-range: entry 0% entry 90%; }
  .prompt-section > :nth-child(2) { animation-range: entry 15% entry 100%; }
}
@keyframes mj-up     { to { translate: 0 -30vh; opacity: 0; } }
@keyframes mj-shrink { to { scale: .7; opacity: .2; } }
@keyframes mj-in     { from { translate: 0 80px; opacity: 0; } }   /* short travel = smooth (his fix) */
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; } }
```
- His "slow drag" is a Figma stand-in for scroll. On the web the scroll itself sets the pace, so tune the `animation-range` lengths instead (derived).

### Gotchas
- Too many actions in the nav. He cuts five down to two, with one primary.
- Copy written under time pressure comes out cliché. He flags his own headline and footer copy as weak, so rewrite it before shipping.
- Images too saturated behind text. Fade the collage and keep reducing it in later sections.
- Unlocked background layers get moved by accident, and locked ones block animation work. Lock while designing, unlock while animating.
- Unnamed layers make multi-frame animation hard to manage.
- Items that travel too far make a drag-driven step look jagged and rushed. Shorten the distance.
- Everything moving in sync looks mechanical. Offset each item.
- Image-heavy prototypes can be slow to load in preview (he blames his connection). He builds the next frames while it loads.

### Examples named
- Midjourney: the site being redesigned. The current nav has Get started, Showcase, Join the beta, Sign in and an icon.
- Roboto Mono: the logotype font, chosen for an "AI-ish" feel (not confirmed as Midjourney's own).
- Figma: Place image and video (multi-drop), the K scale tool, Layer blur, drop-shadow glow, Smart animate with the Slow spring, On drag interactions.

## These 5 mistakes will RUIN your UI/UX portfolio
- source: Tim Gabe · https://youtu.be/j0KT9yaa-NI
- type: principles
- tags: portfolio, case-study, presenting, career, trust

### Takeaways
- The stakes: some portfolio mistakes are deal-breakers. Even good work goes unseen if the portfolio doesn't get you an interview. He speaks from freelancing and from hiring as a product designer at Spotify.
- Mistake 1, spelling out the whole process:
  - The full process comes up in the interview, so the page doesn't need every step.
  - A long, drawn-out page bores the recruiter and loses them early.
  - A portfolio is more sales and storytelling than most designers think.
  - Fix: write each project as a story, almost a pitch, that gets your thinking across as fast as possible.
- Mistake 2, presenting a project as if everything went perfectly:
  - A flawless outcome invites scepticism, not admiration.
  - It also hides your problem-solving, which he calls a designer's biggest job.
  - The obstacles you hit are what a recruiter finds most interesting.
  - Fix: put the hiccups, the challenges and how you solved them at the centre of each project.
- Mistake 3, a complex, flashy portfolio site:
  - What gets judged is the work inside the portfolio, not the site that hosts it.
  - Good-enough UX and UI on the site itself is enough.
  - Fix: make the work the main character.
- Mistake 4, never publishing:
  - It usually follows from mistake 3. Endless tweaks to gradients and animations, trying to make the site a work of art, push the launch back forever.
  - Fix: treat the portfolio as a permanent work in progress. Getting it live, where recruiters and companies can see it, matters most.
- Mistake 5, neglecting the portfolio's own design:
  - "Good enough" doesn't mean sloppy. He ranks a portfolio site with UI flaws or odd UX as likely the single thing that puts recruiters off most.
  - At Spotify, he saw designers passed over because their portfolio itself had design flaws (creator's anecdote).
  - Fix: make the site functional and well made, in service of the work, without being flashy.
- The balance across 3, 4 and 5: not flashy, not sloppy, shipped. The craft of the site should be invisible, and the work should be what people see.

### Recipes
1. A project page that follows the five rules (derived from the takeaways, not shown in the video):
   1. Open with the outcome and the problem in a few lines, written to be skimmed like a pitch.
   2. Name the hardest obstacle or what went wrong, early and plainly.
   3. Show the decision that solved it, with the visuals doing most of the work.
   4. Keep the step-by-step process short. Leave the depth for the interview.
   5. Present it in a clean, functional layout that puts the work first, and publish it before it feels finished.

### Gotchas
- A drawn-out process write-up that loses the reader before the work appears.
- "Everything went perfectly" stories. They read as unbelievable and hide your problem-solving.
- Spending your effort on the portfolio site's effects instead of the case studies.
- Never shipping because the site isn't a masterpiece yet.
- Swinging the other way into a sloppy site. Visible UI or UX flaws in the portfolio itself can cost you the job.

### Examples named
- Spotify: where he worked as a product designer and saw how portfolios were judged during hiring.

## 5 Figma Workflow Tips For UI Beginners
- source: Tim Gabe · https://youtu.be/GDjxXRLHEg4
- type: tool-tutorial
- tags: figma, workflow, auto-layout, plugins, icons, imagery, copywriting, grid, spacing, breakpoints, responsive, handoff, resources

### Takeaways
- Use auto layout even for the simplest pairs: avatar plus text, or two text fields.
  - A group only lets you nudge children by hand.
  - An auto layout gives you alignment, direction and spacing controls in the sidebar.
  - His own files are built almost entirely from auto layouts.
- Shortcuts worth learning first: A or F for a frame, T for text, R for a rectangle, O for an ellipse.
- Opacity from the keyboard: with a layer selected, type the digits, so 6 then 5 gives 65% and 3 then 3 gives 33%.
- Start with plugins in three categories:
  - Icons: Lucide (captions: "Lucid"), or one heard as "open icons" (name not verified). He prefers the second for its range of styles, from retro to minimal.
  - Images: Unsplash or Pexels (captions: "pixels").
  - Placeholder copy: the Lorem ipsum plugin.
- Use column grids from day one, even before you understand them fully: 12 columns on desktop, 8 on tablet ("breakpoint one"), 4 on mobile. Gutters and margins are not stated.
- Use standard measurements on a 4- or 8-point system: 4, 8, 12, 16, 24, 32, 40, 48 and so on. No free-form values like 31 or 57.
- Why the system helps:
  - A developer who knows you use it can tell that a stray 31 should be 32.
  - You always know which value to reach for.

### Recipes
1. Auto layout basics [00:31–03:36]: wrap the two elements in an auto layout, then set alignment, direction (vertical or horizontal) and spacing in the auto layout panel instead of dragging them.
2. Opacity shortcut [04:07–04:37]: select the layer and type two digits (6, 5 → 65%).
3. Column grid [06:11–07:15]: select the frame → Layout grid panel → + → change Grid to Columns → set the count to 12 (desktop), 8 (tablet) or 4 (mobile).
4. Spacing scale [07:15–08:49]: pick every padding, gap and size from 4, 8, 12, 16, 24, 32, 40, 48…

### CSS translation
```css
/* The spacing scale he lists (stated values) */
:root { --s-4: 4px; --s-8: 8px; --s-12: 12px; --s-16: 16px; --s-24: 24px; --s-32: 32px; --s-40: 40px; --s-48: 48px; }

/* Column grid: 4 / 8 / 12 columns (stated). Breakpoints, gutters and margins are derived */
.layout { display: grid; grid-template-columns: repeat(4, 1fr); column-gap: var(--s-16); padding-inline: var(--s-16); }
@media (min-width: 768px)  { .layout { grid-template-columns: repeat(8, 1fr);  column-gap: var(--s-24); padding-inline: var(--s-32); } }
@media (min-width: 1200px) { .layout { grid-template-columns: repeat(12, 1fr); column-gap: var(--s-24); padding-inline: var(--s-48); } }

/* Auto layout = flexbox: direction, alignment and one gap instead of hand-placed children */
.avatar-row { display: flex; flex-direction: row; align-items: center; gap: var(--s-12); }   /* gap derived */
.text-pair  { display: flex; flex-direction: column; gap: var(--s-4); }                       /* gap derived */
```

### Gotchas
- Groups for simple pairs. You lose alignment and spacing control, and every change is manual.
- Clicking through menus for tools that have single-key shortcuts.
- Free-form values (31, 57). Developers can't tell a mistake from an intention.
- Skipping column grids until "later". He says to start using them before you fully understand them.
- Typing a single digit sets opacity in tens (3 → 30%). Type both digits quickly for values like 33 (derived from how Figma's shortcut works).

### Examples named
- Lucide: icon plugin and library.
- A plugin heard as "open icons" (name not verified): icons in many styles.
- Unsplash, Pexels: image plugins.
- Lorem ipsum plugin: placeholder text.
- Figma: auto layout panel, Layout grid panel, single-key shortcuts.

## Splash Screen Animation in 6 Minutes (Figma Tutorial)
- source: Tim Gabe · https://youtu.be/s19_n6rcXIY
- type: tool-tutorial
- tags: animation, smart-animate, prototyping, loading, mobile, gradients, borders, figma

### Takeaways
- An animated splash screen is a cheap way to make an app feel professional, and simpler to build than it looks.
- Three steps: build the assets, lay out a storyboard (one frame per state), then wire the interactions.
- Assets:
  - A rounded rectangle with a linear-gradient fill and a 2px stroke at 15% opacity.
  - A text container: a frame with no fill and Clip content on, holding the word.
  - An iPhone mockup, only so the animation presents well.
- Clip content is the key setting, on the text container and on the background frame. Without the background frame clipping, a shape scaled past the screen edge spills outside it.
- The sequence:
  1. The rectangle starts lower down and faded out.
  2. It fades in and moves up to the centre.
  3. It scales up 1.5× and rotates 135° (he enters −135).
  4. It shrinks to 32px and re-centres.
  5. The circle moves right and the word is revealed by its clipping container. It's a reveal, not a fade.
  6. The circle grows, while the word moves right and fades out.
- Square to circle without changing the shape: keep the corner radius and shrink the square. At 32px the radius is larger than half the side, so it renders as a circle (the geometry is derived).
- Make the text slide as well as reveal: in the start state, nudge the clipped text a little to the left, so it moves right as it appears.
- All steps use the same spring. Set it once, and later connections reuse it.

### Recipes
1. Assets [00:00–01:31] (Figma)
   1. Rectangle with rounded corners (radius shown on screen, not stated), a linear-gradient fill (colours shown on screen, not stated) and a 2px stroke at 15% opacity.
   2. Text container: a frame, no fill, Clip content on, with the text inside.
   3. Background frame (the screen) with Clip content on. Place every animated layer inside it.
2. Storyboard [01:31–05:12]: duplicate the frame for each state.
   1. Frame 1: rectangle moved down a little, opacity 0.
   2. Frame 2: opacity back, moved up and centred.
   3. Frame 3: K tool at 1.5×, rotation −135.
   4. Frame 4: resized to 32px, centred again. Also add the text container here in its start state: text clipped out of view and shifted slightly left.
   5. Frame 5: circle moved right, text container in place with the word showing, the group centred.
   6. Frame 6: circle larger, text moved right and faded out.
3. Interactions [05:12–06:13]
   1. Prototype tab → add a flow at Frame 1.
   2. Frame 1 → Frame 2: change On click to After delay, 1 ms → Smart animate → Custom spring → stiffness 400. Damping is heard as "430" (likely 30; see the gotchas). Mass is not stated.
   3. Connect each following frame the same way (After delay 1 ms). The spring settings carry over.
   4. On the last connection he increases a value to 650. The field isn't named; most likely the delay (derived), so the finished lockup holds for 650 ms before the outro.

### CSS translation
```html
<div class="splash">                                  <!-- background frame: clip content -->
  <div class="lockup">
    <div class="mark"></div>                          <!-- gradient square, 2px stroke at 15% -->
    <div class="word"><span>Splash</span></div>       <!-- text container: clip content, no fill -->
  </div>
</div>
```
```css
/* Spring k 400 / c 30 / m 1 (damping assumed 30, mass assumed 1): ζ 0.75, ~460 ms to rest, ~3% overshoot.
   Sampled into linear() and applied to each step (derived) */
:root { --spring: linear(0, .123, .365, .604, .79, .914, .985, 1.018, 1.028, 1.026, 1.02, 1.013, 1.007, 1.003, 1.001, 1, 1); }

.splash { height: 100dvh; overflow: clip; display: grid; place-items: center; background: var(--bg); }
.lockup { position: relative; animation: lockup 2.95s both; }   /* only the mark is in flow, so it starts centred */
@keyframes lockup {   /* the circle moves right as the word appears */
  0%, 46.8%   { translate: 0 0; animation-timing-function: var(--spring); }
  62.4%, 100% { translate: var(--shift, 64px) 0; }   /* set --shift to half of (word width + gap) so the lockup ends centred (derived) */
}
.mark {
  width: 96px; height: 96px; border-radius: 24px;            /* start size and radius derived */
  background: linear-gradient(135deg, var(--c1), var(--c2));  /* colours on screen only */
  border: 2px solid rgb(255 255 255 / .15);                   /* 2px at 15% (stated); white derived */
  animation: mark 2.95s both;                                  /* 5 steps × ~460 ms + the 650 ms hold (derived) */
}
/* Shrinking width/height (not scale) keeps the 24px radius, which the browser clamps to half the side: a circle */
@keyframes mark {
  0%    { translate: 0 48px; opacity: 0; animation-timing-function: var(--spring); }
  15.6% { translate: 0 0; opacity: 1; width: 96px;  height: 96px;  rotate: 0deg;    animation-timing-function: var(--spring); }
  31.2% {                             width: 144px; height: 144px; rotate: -135deg; animation-timing-function: var(--spring); }   /* 1.5×, −135° */
  46.8% {                             width: 32px;  height: 32px;  rotate: -135deg; scale: 1; animation-timing-function: var(--spring); }
  62.4% {                             width: 32px;  height: 32px;  rotate: -135deg; scale: 1; }
  84.4% {                             width: 32px;  height: 32px;  rotate: -135deg; scale: 1; animation-timing-function: var(--spring); }   /* 650 ms hold */
  100%  {                             width: 32px;  height: 32px;  rotate: -135deg; scale: 6; }   /* final growth: size derived */
}
/* Word to the left of the circle: side derived from the circle moving right; gap derived */
.word { position: absolute; right: calc(100% + 12px); top: 50%; translate: 0 -50%; overflow: clip; }
.word span { display: block; white-space: nowrap; animation: word 2.95s both; }
@keyframes word {   /* clip-path wipe stands in for the clip-content reveal; direction derived */
  0%, 46.8% { clip-path: inset(0 100% 0 0); translate: -12px 0; opacity: 1; animation-timing-function: var(--spring); }
  62.4%     { clip-path: inset(0 0 0 0);    translate: 0 0; }
  84.4%     { clip-path: inset(0 0 0 0);    translate: 0 0;    opacity: 1; animation-timing-function: var(--spring); }
  100%      { clip-path: inset(0 0 0 0);    translate: 24px 0; opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .lockup, .mark, .word span { animation-duration: 1ms; } }
```
- In Figma the circle is moved right by hand and the word is placed next to it. Here `--shift` on the lockup does the move, and the word rides along because it is positioned off the mark (derived).
- To keep the real spring physics instead of the sampled curve, use the `springToCSS()` helper from batch-11a ("The Secret Trick For Amazing Animations in Figma") with `{ stiffness: 400, damping: 30, mass: 1 }` (derived).

### Gotchas
- Animating shapes outside a clipping background frame. Scaled-up shapes spill past the screen.
- A text "reveal" done as a fade. The clip container is what gives the wipe.
- Changing the shape to get a circle. Keep the radius and shrink it instead.
- Damping heard as "430": with stiffness 400 and mass 1 that is about 11× critical damping, and each step would take about 7 s to settle. It is almost certainly 30 (≈ ζ 0.75, about 0.46 s). Check the free Figma file or the screen (derived).
- After delay 1 ms chains the steps back to back. Only the hold before the outro gets a longer value.

### Examples named
- Figma: Clip content, the K scale tool, After delay, Smart animate, Custom spring.
- An iPhone mockup frame: presentation only.

## 3 Award Winning Website Animations (Figma Tutorial)
- source: Tim Gabe · https://youtu.be/NfqdWTfNYKI
- type: tool-tutorial
- tags: animation, scroll, smart-animate, prototyping, typography, imagery, hero, inspiration, figma

### Takeaways
- Many award-winning site animations can be rebuilt in Figma with Smart animate: one frame per state, linked by drag or click.
- Every effect here relies on a frame with Clip content: it is the "window" that cuts text off or reveals an image.
- A fake scroll bar (a rounded rectangle) used as the drag handle makes a scroll prototype feel real. Any layer can be the drag target, and plain On click works if you only need to click through.
- For a drag-driven step, the easing barely matters. Linear or Ease out at 300 ms both work.
- Video fills needed a paid Figma plan when he recorded this (creator's statement; check current plans). He uses a still image, and his font is a stand-in for Drive Capital's paid typeface.
- Effect 1, creative mask (Drive Capital):
  - Huge text masks a video.
  - On scroll, the text moves up and is cut off by the top of the frame.
  - It won an Awwwards award (captions: "awards.com"; creator's claim, unverified).
- Effect 2, two-tone text over a widening image (Starfades International):
  - As the text moves into the image, it turns from black to white.
  - At the same time, the image window widens to the full width.
  - Two text copies are stacked exactly: a black one on the page and a white one inside the clipping container.
- Effect 2 needs the text constraint inside the container set to Center (horizontal) and Top. Otherwise the text drifts left as the container widens.
- Effect 2: widen only the container (the mask), never the image inside it.
- Effect 3, Apple iMac 24 product page:
  1. The keyboard scales up.
  2. A line of text fades in.
  3. The keyboard moves to uncover a second word ("magic") hidden behind it.
  4. A hand slides in, rotating from 10° to 0° as it arrives, with a finger landing on a key.
- Apple is the benchmark for scroll-driven product storytelling.

### Recipes
1. Creative mask [00:31–05:40] (Figma)
   1. Outer frame ("frame"), black fill.
   2. Inside it, a frame "container": Clip content on, no fill.
   3. Inside the container: the text "DRIVE", top-centred. Over it, a rectangle "image" filled with the photo, covering the text.
   4. Select the image and the text → Use as mask, then centre it.
   5. Frame 1: container moved down a little, opacity 0.
   6. Frame 2: container in place.
   7. Frame 3: only the text dragged upwards, so the frame's top edge cuts it off.
   8. Scroll bar, Frame 2 → 3: On drag → Smart animate → Linear.
   9. Scroll bar, Frame 3 → 2: On drag → Smart animate → Linear, 300 ms.
   10. Load, Frame 1 → 2: After delay 1 ms → Smart animate → Gentle, 800 ms.
2. Two-tone text [05:40–10:27]
   1. Outer frame with the black text.
   2. Inside it, a centred frame "container" holding the photo, which is larger than the container.
   3. Paste the same text into the container and make it white. Set its constraints to Center (horizontal) and Top.
   4. Align both texts horizontally and vertically so they sit exactly on top of each other. Start them slightly above the container.
   5. Frame 2: move the text down into the container. Option-drag the container's sides so it grows symmetrically to the full width. Don't resize the image.
   6. Scroll bar, both directions: On drag → Smart animate → Ease out, 300 ms. Linear is fine too.
   7. Add a flow starting point and preview in Fill screen.
3. Apple keyboard [10:27–15:34]
   1. Frame 1: the keyboard, moved up a little.
   2. Frame 2: the keyboard enlarged. Paste the headline at 0% opacity.
   3. Frame 3: headline at 100%. Add the "magic" text behind the keyboard, hidden.
   4. Frame 4: the keyboard moved (up) to uncover "magic". Add the hand outside the frame, rotated 10°.
   5. Frame 5: the hand at 0° rotation, moved up so a finger rests on a key.
   6. Each frame → next: On click → Smart animate → Ease out, 300 ms.
- Scale amounts, positions, font sizes and the Drive Capital typeface are shown on screen, not stated.

### CSS translation
```css
/* 1. Creative mask: image clipped to huge type. The container fades in on load and the text lifts out
   through the top edge on scroll. Sizes and distances are derived */
.mask-hero { height: 100svh; background: #000; overflow: clip; }
.mask-hero .container { height: 100%; display: grid; place-items: center; overflow: clip;
  animation: fade-up 800ms cubic-bezier(.22, 1, .36, 1) both; }   /* Gentle 800 ms; the curve is derived */
@keyframes fade-up { from { opacity: 0; translate: 0 40px; } }
.mask-hero h1 { margin: 0; font-size: 28vw; line-height: .8; font-weight: 800; text-transform: uppercase;
  background: url(still.jpg) center / cover;
  -webkit-background-clip: text; background-clip: text; color: transparent; }
@supports (animation-timeline: scroll()) {
  .mask-hero h1 { animation: lift linear both; animation-timeline: scroll(root); animation-range: 0 100vh; }
}
/* The background counter-moves, so the image stays still while the letters rise, as when only the mask moves in Figma */
@keyframes lift { to { translate: 0 -60vh; background-position: 50% calc(50% + 60vh); } }

/* 2. Two-tone text: dark copy on the page, light copy inside a clipped window that widens. The image never resizes.
   Markup: .duo-track > .duo > [h2.duo__t, .duo__window > [img, h2.duo__t.duo__t--light aria-hidden]].
   The dark copy must come before the window so the window paints over it */
.duo-track { height: 200vh; view-timeline: --duo; }
.duo { position: sticky; top: 0; height: 100svh; overflow: clip; display: grid; }
.duo > *, .duo__window > * { grid-area: 1 / 1; }
.duo__window { display: grid; clip-path: inset(15% 30%); }          /* the "container"; inset derived */
.duo__window img { width: 100%; height: 100%; object-fit: cover; }
.duo__t { place-self: start center; margin-top: 8vh; color: #000; }  /* both copies identical; offset derived */
.duo__t--light { color: #fff; }
@supports (animation-timeline: view()) {
  .duo__window { animation: widen linear both; animation-timeline: --duo; animation-range: contain 0% contain 100%; }
  .duo__t      { animation: sink  linear both; animation-timeline: --duo; animation-range: contain 0% contain 60%; }
}
@keyframes widen { to { clip-path: inset(15% 0); } }   /* sides only, like the Option-drag */
@keyframes sink  { to { translate: 0 30vh; } }

/* 3. Apple-style sequence: a sticky stage over four scroll beats (ranges and amounts derived) */
.imac-track { height: 400vh; view-timeline: --imac; }
.stage { position: sticky; top: 0; height: 100svh; overflow: clip; display: grid; place-items: center; }
.stage > * { grid-area: 1 / 1; }
.magic { z-index: 0; } .keyboard { z-index: 1; } .headline { z-index: 2; } .hand { z-index: 3; }
@supports (animation-timeline: view()) {
  .stage > * { animation-duration: auto; animation-timeline: --imac; animation-fill-mode: both; animation-timing-function: ease-out; }
  .keyboard { animation-name: kb-grow, kb-lift; animation-range: contain 0% contain 25%, contain 50% contain 75%; }
  .headline { animation-name: fade-in; animation-range: contain 25% contain 50%; }
  .hand     { animation-name: hand-in; animation-range: contain 75% contain 100%; }
}
@keyframes kb-grow { to { scale: 1.6; } }
@keyframes kb-lift { to { translate: 0 -28vh; } }   /* uncovers "magic" behind it */
@keyframes fade-in { from { opacity: 0; } }
@keyframes hand-in { from { translate: 0 70vh; rotate: 10deg; } }   /* 10° → 0° (stated), from outside the frame */
@media (prefers-reduced-motion: reduce) { .mask-hero *, .duo *, .stage > * { animation: none !important; } }
```
- `background-clip: text` can't clip a `<video>`. For Drive Capital's video version, put the video underneath and a black layer with white text on top in `mix-blend-mode: multiply`: the black hides the video and the white letters let it through (derived).
- One-layer alternative for effect 2: `mix-blend-mode: difference` on a single white heading flips it over the image, but it inverts the photo's colours rather than giving clean white (derived).
- Click-through version of effect 3: toggle a step class and use `transition: 300ms ease-out`, matching his On click settings (derived).

### Gotchas
- A container without Clip content: no cut-off, no reveal.
- Leaving the text inside the widening container on Left constraints. It slides sideways as the container grows.
- Resizing the image instead of its container. The mask should grow, not the picture.
- Two text copies that aren't pixel-aligned. The colour flip shows a double edge.
- Copying a scroll bar copies its prototype link. Re-point the interaction to the right frame.
- Smart animate pairs layers by name across frames, so keep names identical in every frame (derived from how Smart animate works).

### Examples named
- Drive Capital: huge text masking a video, cut off at the top on scroll; won an Awwwards award (creator's claim, unverified).
- Starfades International (captions: "Star Fades International"; spelling not verified): text that flips from black to white as it enters an image that widens to full width; also an Awwwards winner (creator's claim, unverified).
- Apple iMac 24 page: keyboard scale-up, text fade-in, a word revealed from behind the keyboard, a hand sliding in.
- Awwwards (heard as "awards.com"): the source of the first two references.
- Figma: Clip content, Use as mask, constraints, Smart animate with Linear, Ease out and Gentle.

## Parallax Scroll Animation in 6 Minutes (Figma Tutorial)
- source: Tim Gabe · https://youtu.be/GVUchbe86HE
- type: tool-tutorial
- tags: parallax, scroll, animation, smart-animate, prototyping, imagery, figma

### Takeaways
- Parallax needs two or more objects (text, images, blurs, any shape) whose positions change as you scroll, by different and slightly random amounts relative to each other.
- If everything moves the same distance in the same direction, it is just a scroll, not parallax. Vary the direction and the distance per object.
- His example:
  - the blur travels top to bottom,
  - the text travels bottom to top,
  - the square images leave the frame,
  - the round images rise into the frame from below.
- Layer order creates depth:
  - the text sits on top of everything,
  - the blur sits above the images, so the images look softened or faded as they pass under it,
  - in the end state, the blur sits just below the text.
- Before moving a set of images out of the frame, give each one a different position (some up, some down). Then move the set.
- To move layers past the frame edge without them leaving the frame in the layers panel: start dragging, hold Shift to keep the move straight, then also hold Space.
- Frame height 900 makes the frames read as desktop screens.
- The scroll bar is optional. Any layer (the text, an image) can carry the drag interaction.

### Recipes
1. Start frame [02:04–02:35] (Figma)
   1. New frame with a background colour.
   2. Add the parallax text, a blur shape at the top, the square images and the round images.
   3. Put the text layer at the very top of the stack and the blur above the images.
2. End frame [02:35–04:36]
   1. Duplicate the frame.
   2. Move the blur towards the bottom, just below the text.
   3. Reposition the square images individually, then drag them out through the top (Shift, then Space, while dragging).
   4. Move the text up.
   5. Reposition the round images individually, then pull them up into the upper part of the frame.
3. Interactions [04:36–06:11]
   1. Set both frames to height 900.
   2. Add a flow starting point and copy in a scroll bar (placement shown on screen).
   3. Scroll bar on Frame 1: On drag → Frame 2, Smart animate, Ease out (duration not stated).
   4. Add the same back from Frame 2's scroll bar to Frame 1.
   5. Play, then press F for full screen.
- All distances and positions are shown on screen, not stated.

### CSS translation
```html
<section class="px">
  <img class="sq sq-1" src="a.jpg" alt=""> <img class="sq sq-2" src="b.jpg" alt=""> <img class="sq sq-3" src="c.jpg" alt="">
  <img class="rd rd-1" src="d.jpg" alt=""> <img class="rd rd-2" src="e.jpg" alt="">
  <div class="blur" aria-hidden="true"></div>
  <h2 class="title">Parallax</h2>
</section>
```
```css
/* A hero-position section driven by page scroll over the first screen. Every distance is derived; the point is
   that each layer gets its own direction and amount */
.px { position: relative; height: 100svh; overflow: clip; isolation: isolate; }
.px > * { position: absolute; }
.sq, .rd { z-index: 1; }   /* give each image its own top/left (positions shown on screen in the video) */
.rd { border-radius: 50%; top: 110%; }   /* round images start below the fold */
.blur { z-index: 2; inset: -10% 20% auto; height: 40%; border-radius: 50%;
  background: var(--glow); filter: blur(80px); }   /* above the images, so they soften as they pass under it */
.title { z-index: 3; top: 60%; left: 50%; translate: -50% 0; }   /* text on top of everything */

@keyframes drift { to { translate: var(--dx, 0) var(--dy, 0); } }
@supports (animation-timeline: scroll()) {
  .px > * { animation: drift linear both; animation-timeline: scroll(root); animation-range: 0 100vh; }
}
.blur  { --dy: 70vh; }                                      /* top → bottom */
.title { --dx: -50%; --dy: -30vh; }                         /* bottom → top; keeps the -50% centring */
.sq-1 { --dy: -120vh; } .sq-2 { --dy: -95vh; } .sq-3 { --dy: -140vh; }   /* exit through the top, unevenly */
.rd-1 { --dy: -80vh; } .rd-2 { --dy: -100vh; }              /* rise into view */
@media (prefers-reduced-motion: reduce) { .px > * { animation: none; } }
```
- For a section lower on the page, swap `scroll(root)` / `0 100vh` for `view()` with `animation-range: cover` (derived).
- The same idea as Framer scroll speeds (140, 250, 40–50 in batch-11b's "Make Your Figma Scroll Animation Real") and its JS version: a speed per layer instead of an end position per layer (derived).

### Gotchas
- Moving every object out of the frame together. Uniform motion reads as a plain scroll.
- Dragging layers past the frame edge without Space. They drop out of the frame in the layers panel, and Smart animate can no longer match them between frames (the Smart animate part is derived).
- Wrong stacking: the blur over the text hides the headline. Keep the text on top and the blur between it and the images.
- Frames left at full content height. Set them to 900 so they behave like a screen.

### Examples named
- Figma: Smart animate, On drag interactions, the Shift + Space drag behaviour, flow starting points.
