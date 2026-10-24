## The UI/UX Wireframe Hack Schools Don’t Teach
- source: Tim Gabe · https://youtu.be/40UAK-LKheA
- type: technique
- tags: workflow, landing-page, layout, sections, figma, auto-layout, responsive, mobile, inspiration

### Takeaways
- His stance, which he admits is controversial: for landing pages, classic wireframing is overrated, because a landing page is usually low in complexity.
- A wireframe has three jobs: decide what content is needed, decide what elements are needed, and show the visual structure. He compares it to an architect's blueprint.
- The problem with low-fi landing page wireframes: they are too abstract to predict a realistic structure, so the design gets reworked later anyway.
- His replacement is the "Frankenstein wireframe": real screenshots of sections from sites you like, cropped and stacked into a full page. It gives you:
  - a high-fidelity reference for both the visuals and the structure,
  - a very fast workflow,
  - responsive references at no extra cost, because every section is captured at desktop and mobile width.
- Capture widths: 1440px for desktop, 375px for mobile.
- Capture at 75% zoom in the device toolbar, not 50%, so the details stay readable in the screenshot.
- Keep the URL in every screenshot. A cropped section often has no nav or logo, so the URL is the only way back to the source.
- Use the screenshots as reference only. Take the structure (his example: a nav made of a logotype plus a menu) and build your own version with your own colours, fonts and details. Inspiration, not theft.
- Lock the reference stack and lower its opacity, so it guides the layout without pulling your eye or moving by accident.

### Recipes
1. Collect screen dumps [01:02–02:34] (browser inspector)
   1. Browse an inspiration gallery (he names Lapa Ninja) and open each site you like in its own tab.
   2. On each site, open the inspector and set the device toolbar to Responsive.
   3. Type the width: 1440 for desktop, 375 for mobile.
   4. Set the zoom to 75%.
   5. Screenshot the sections, with the URL visible.
2. Crop and size in Figma [02:34–03:40]
   1. Select a screenshot and open its image fill settings. Switch the mode from Fill to Crop.
   2. Drag the crop handles around one section. Rough precision is fine.
   3. Resize it to 1440 wide (desktop) or 375 wide (mobile).
   4. Repeat for every section you want.
3. Assemble the page [03:40–04:11]
   1. Order the desktop sections top to bottom, select them all and wrap them in an auto layout. Name it "desktop".
   2. Do the same with the mobile sections and name it "mobile".
   3. Each stack now reads like a real website at its breakpoint.
4. Design on top [04:11–06:12]
   1. Select the desktop auto layout and draw a frame over it. Name it "desktop" (or "desktop container" to keep the names apart).
   2. Lock the screenshot auto layout and reduce its opacity (value shown on screen, not stated).
   3. Design your own sections in the frame, following the reference's structure but not its styling.
   4. Repeat for mobile with a frame called "mobile container", again locking and fading the reference.

### Gotchas
- Spending time on low-fi wireframes for a simple landing page. They come out too abstract and get redone. His claim is limited to low-complexity landing pages, not product flows.
- Copying a reference section's styling. Keep the structure and change the colours, type and details.
- Screenshots with no URL, which leave you no way back to the source.
- Capturing at 50% zoom, which loses detail.
- Leaving the reference unlocked (it gets moved by accident) or at full opacity (it distracts).

### Examples named
- Lapa Ninja (captions: "lapa.ning"): landing page gallery used as the source of section screenshots.
- Browser inspector, device toolbar in Responsive mode: exact capture widths and zoom.
- Figma: image Crop mode, auto layout stacks, lock and opacity for the reference layer.

## 4 Easy Tips For Stunning Landing Pages (Figma Tutorial)
- source: Tim Gabe · https://youtu.be/cocnZubvfFE
- type: technique
- tags: landing-page, hero, sections, layout, typography, copywriting, hierarchy, spacing, alignment, grid, imagery, colour, gradients, carousel, figma, resources

### Takeaways
- Stunning landing pages are usually simple. They aren't always easy to design, but four moves carry most of them: typography, copy, deliberate placement, sizing and spacing, and beautiful assets with matched colour.
- Typography comes first. Without it, everything else falls apart.
  - Fontshare offers free fonts and a Pairs tab: a long list of free font pairings. Pick a proven pair instead of inventing one.
  - Fonts are often not crisp out of the box. Tweak line height (the space between rows) and letter spacing (the space between letters). No values are given; he points to a separate video.
- Copy: cut long, boring copy down to short and sweet. It takes less space, people actually read it, and the visual difference is large.
- Placement, sizing and spacing are applied to groups of elements. One content group (heading, body, CTA) becomes four different sections by changing just those three things:
  - Hero: everything centre-aligned, "mega" heading at 160, a large gap of 40px between heading, body and CTA, and a full background image.
  - Feature with the asset on the right: text left-aligned, heading down to "large" at 120, gap down to 32, smaller CTA.
  - Feature with the asset on the left (a carousel): text block placed on the right, heading, gap and CTA all smaller again (values shown on screen, not stated).
  - Grid of four items: smaller headings, smaller gaps, small assets.
- Within a section, use the same gap from heading to body as from body to CTA.
- 160 and 120 are arbitrary. The rule is the step-down: the hero is biggest and loosest, and each later section drops in type size, gap and CTA size.
- Assets and colour are "where the magic happens":
  - The asset must be good-looking. The hero only works if the image does.
  - Sample colours from the hero image and make them the page's primary colour, starting with the CTA.
  - If a style guide or design system already exists, work the other way round: make the assets map to the system's colours.
  - One image can give every section a background: blur it, lower its opacity, change its shape and size, recolour it.
- The method survives a swap. In his demo, a different Fontshare pair plus a different asset still produced a strong page, twice.

### Recipes
1. Type set-up [00:00–01:35] (Fontshare, then Figma)
   1. On fontshare.com, open the Pairs tab, scroll and pick a free pair. Download the fonts.
   2. Set the text in Figma, then tweak line height and letter spacing until it looks crisp (values not stated).
2. Copy edit [01:35–02:36]: rewrite long body copy into a short headline and a short supporting line.
3. Four sections from one group [02:36–04:42]

   | Section | Text placement | Heading | Gap heading→body→CTA | CTA | Asset |
   |---|---|---|---|---|---|
   | Hero | centre | 160 ("mega") | 40px | largest | full-bleed background image |
   | Feature A | left | 120 ("large") | 32px | smaller | on the right |
   | Feature B | right | smaller (on screen) | smaller (on screen) | smaller again | carousel on the left |
   | Grid | 4 items | smaller headings | smaller | n/a | small asset per item |

4. Hero background [04:42–05:44]
   1. Place a high-quality image as the full background.
   2. Add a radial gradient over it that darkens the centre, so the centred text reads.
   3. Pick colours from the image and make them the CTA and primary colour.
5. One image, every background [05:44–06:47]
   1. Feature A: the same image with a Layer blur, which gives an aurora effect. Put the product asset on the right. Blur value shown on screen, not stated.
   2. Feature B: blur the image and lower its opacity. Reuse the asset with its colours changed for variety.
   3. Grid: blur the image, change its shape, shrink it and use several colours.
6. Stress test [06:47–07:19]: go back to Fontshare, swap in a new pair and a new asset, and check that the layout still holds.

### CSS translation
```css
:root {
  /* step-down scale: 160 / 120 / 40 / 32 stated; the clamp floors and vw values are derived for mobile */
  --h-mega: clamp(56px, 11vw, 160px);
  --h-large: clamp(44px, 8vw, 120px);
  --gap-hero: 40px;
  --gap-feature: 32px;
  --primary: var(--sampled-from-hero); /* colour picked from the hero image, not stated */
}

.stack { display: flex; flex-direction: column; } /* one gap between heading, body and CTA */

/* Hero: centred, mega, 40px gap, darkened-centre radial over the photo */
.hero {
  min-height: 100vh;                               /* derived */
  display: grid; place-items: center; text-align: center;
  background:
    radial-gradient(ellipse at center, rgb(0 0 0 / .55), rgb(0 0 0 / 0) 70%), /* strength derived */
    url(hero.jpg) center / cover;
}
.hero .stack { gap: var(--gap-hero); align-items: center; }
.hero h1 { font-size: var(--h-mega); }
.hero .cta { background: var(--primary); }

/* Feature A: text left, asset right. Feature B: flip the sides */
.feature { display: grid; grid-template-columns: 1fr 1fr; align-items: center; }
.feature .stack { gap: var(--gap-feature); }
.feature h2 { font-size: var(--h-large); }
.feature--flip .stack { order: 2; }               /* text on the right, carousel on the left */

/* Grid of four: smaller headings and gaps (values derived) */
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

/* Aurora: the hero image re-used, blurred and faded behind the section (blur and opacity derived) */
.aurora { position: relative; isolation: isolate; overflow: clip; }
.aurora::before {
  content: ""; position: absolute; inset: -10%; z-index: -1;
  background: url(hero.jpg) center / cover;
  filter: blur(80px); opacity: .6;
}
.aurora--faded::before { opacity: .35; }                                 /* Feature B */
.aurora--shape::before { inset: 20%; border-radius: 50%; }               /* Grid: changed shape, shrunk */
```

### Gotchas
- Using a font with its default line height and letter spacing. Out of the box, it often isn't crisp.
- Long, boring copy.
- Giving every section the hero's size and spacing. Step each one down.
- A weak asset. The whole technique relies on the image being beautiful.
- Centred text over a busy photo without the darkening radial.
- A primary colour that fights the imagery. Sample it from the image, or adapt the assets to the design system's colours if one exists.
- A 160px heading is a desktop value. Scale it down for mobile (derived).

### Examples named
- Fontshare (also heard as "fontchair.com"): free fonts and a Pairs tab of free font pairings.
- Figma: radial gradient, Layer blur and the section builds.

## 6 Stunning Websites For UI/UX Inspiration
- source: Tim Gabe · https://youtu.be/evhZQg2NHfo
- type: resources
- tags: inspiration, resources, landing-page, animation, scroll, parallax, micro-interaction, loading, 3d, carousel, typography, mobile, responsive, conversion, accessibility

### Takeaways
- He reviews every site on desktop, then on mobile. Effect-heavy sites often struggle on mobile, so check there before borrowing an idea.
- He tests on a new iPhone and warns that an older phone or a slow connection could make these sites feel heavy. Test performance on weak hardware too.
- Loading animations impress, but they can run too long. He flags two of the sites for this.
- Delayed, damped smooth scrolling: he usually dislikes it, but accepts it where it fits the experience. Use it on purpose, not by default.
- Small body text on mobile is an accessibility risk, even on a beautiful site.
- Off-grid type, an off-grid logo and shifting element positions add dynamism, which makes a page more interesting than an everyday site.
- Showing the product working on the landing page, as an interactive demo you can play with, explains a tool better than attention-grabbing effects.
- Small, plain hover micro-interactions are enough to make scrolling a delight.
- Check mobile for horizontal overflow. One site's container let the whole page scroll sideways on his device.
- Pattern for a conversion-focused site: a clear value-proposition headline, then show what it means straight away with moving UI. Explain in text, show in motion, and repeat big, bold CTAs down to the bottom of the page.
- Two mobile adaptations worth copying:
  - Crop a wide demo video to one side so it stays big, instead of shrinking the whole thing.
  - Turn a logo row that doesn't fit into a ticker, instead of stacking the logos vertically.
- Brand vs conversion: an experience-led, Apple-style scroll story may convert less than a lean page. Pick consciously, based on what the site is for.
- Moving the nav to the bottom of the screen is one way to break expectations.

### Recipes
- none (resources)

### Gotchas
- Overlong intro or loading animations.
- Tiny body text on mobile.
- A container wider than the viewport on mobile, which makes the page scroll sideways.
- Judging a heavy site on a new phone with fast internet only.
- A lot of effects and decoration where the goal is conversion. He says he leans on blurs and decoration himself, and praises Jitter for holding back.

### Examples named
- Glaze (captions: "glaze.com", name not verified) [00:00–03:07]: a long loading animation; a background that moves with the mouse; playful off-grid headings, text and logo. Pressing Enter opens horizontal-scroll storytelling for each product, and a vertical scroll glides to the next product. Damped smooth scrolling that suits it, rich menu hover effects. Mobile keeps the 3D storytelling and smooth scroll, but the body text gets small.
- Sketch (sketch.com) [03:07–06:14]: an interactive landing-page demo that behaves like the app. You can drag components, and prototype arrows update when you move an element. Subtle hover micro-interactions on tabs, bold headlines with explanatory body copy. Mobile uses accordions and animated cursors, but had a horizontal-scroll bug on his phone in Chrome mobile.
- A YouTube-made site showcasing creators (name not stated) [06:14–09:22]: cards with a glowing hover effect; a carousel of creator cards (MrBeast among them) with video or GIF backgrounds; a zoom-in transition into themed worlds (e.g. Wellness) with bottom captions, a skip option and interactive card picking. On mobile the hover effect plays on touch.
- Miro, "Ways We Work" page [09:22–11:23]: a blob loading animation whose shapes grow and swap; parallax cursors; pie charts that reveal their percentages on scroll; characters and clouds that move with scroll; off-grid type; subtle fade-ins; a blob that grows as you scroll. The type scales sensibly on mobile, and the page feels light.
- Jitter [11:23–15:32]: a clean, minimal page he calls well suited to conversion. The value proposition "motion design made simple" is shown at once with a scroll-driven video that UI pieces move into. A timeline playhead moves with scroll, testimonials animate subtly, a type-and-colour section uses a selection cursor, and big CTAs repeat. On mobile the demo is cropped to its left side, and the logo row becomes a ticker.
- Strides (captions: "stritz/strides", pronunciation unsure) [15:32–18:40]: minimal and type-led on a black background, with the nav at the bottom. Scroll storytelling in the style of an Apple product page, with product screenshots, mockups and vectors. He thinks it is brand-led more than conversion-led (a mail-related product with a sign-up). On mobile the cards fade out, text fades in and cards scale up.
- Apple product pages: the reference style Strides resembles.
- Figma: named as Sketch's competitor.

## Get Started: Figma Variables in 3 Minutes
- source: Tim Gabe · https://youtu.be/XnI-WbMCDyw
- type: tool-tutorial
- tags: figma, tokens, design-system, dark-mode, colour, spacing, localization, components

### Takeaways
- Variables let you swap colour themes, copy and spacing in one move.
- Build it in layers. The Primitives collection (base colours and base sizes) is the bottom layer, and every other collection aliases back to it.
- Give each concern its own collection: colour theme, sizes, languages. You could combine them all into one, but then you couldn't switch them independently in a design.
- A mode is an extra column of values in a collection: Light and Dark in the theme collection, English and Swedish in the language collection.
- Modes needed the Figma Pro plan at the time of recording (creator's statement; check current plan limits).
- Language strings don't live in Primitives, so the language collection holds its values directly, with no aliases.
- Because themes alias primitives, changing one primitive updates every theme value that points to it.

### Recipes
1. Open variables [00:00–00:31]: press Esc so nothing is selected, stay on the Design tab and open Variables in the right sidebar. The collection list is at the top left. Use Create collection, then Create variable.
2. Primitives collection [00:31–01:03]: base colours and base sizes (values shown on screen, not stated).
3. Colour theme collection [01:03–01:33]
   1. Add semantic variables such as background, button, text, heading, body, primary and secondary (the captions garble the list).
   2. Set each one as an alias of a primitive.
   3. Click + to add a new variable mode, name it Dark and invert the aliases.
4. Sizes collection [01:33–02:03]: small, medium, large and mega, each aliased to a primitive size.
5. Languages collection [02:03–02:35]: string variables holding the English copy, plus a Swedish mode. No aliases.
6. Apply them [02:35–03:38]
   1. Select the card and bind its background fill to a theme variable.
   2. In the Layer section of the right sidebar, switch the frame between the light and dark modes.
   3. Bind every colour before switching. Unbound layers stay as they were.
   4. Bind the text content to a language variable, then switch the language from the same mode dropdown.
   5. Bind padding, corner radius and gap to the size variables.

### CSS translation
```css
/* 1. Primitives: the base layer. Raw values come from your palette (the video's are on screen only). */
:root {
  --prim-light: var(--palette-light);
  --prim-dark: var(--palette-dark);
  --prim-accent: var(--palette-accent);
  --prim-size-1: var(--palette-size-1);
  --prim-size-2: var(--palette-size-2);
  --prim-size-3: var(--palette-size-3);
  --prim-size-4: var(--palette-size-4);
}

/* 2. Colour theme collection: semantic aliases. Light is the default mode. */
:root, [data-theme="light"] {
  --bg: var(--prim-light);
  --text-heading: var(--prim-dark);
  --text-body: var(--prim-dark);
  --button: var(--prim-accent);
}
/* Dark mode: same variable names, inverted aliases */
[data-theme="dark"] {
  --bg: var(--prim-dark);
  --text-heading: var(--prim-light);
  --text-body: var(--prim-light);
}

/* 3. Sizes collection: aliases to primitive sizes */
:root {
  --size-small: var(--prim-size-1);
  --size-medium: var(--prim-size-2);
  --size-large: var(--prim-size-3);
  --size-mega: var(--prim-size-4);
}

/* Bound component: switching data-theme on any ancestor re-themes it, like the Layer mode switch (derived) */
.card {
  background: var(--bg); color: var(--text-body);
  padding: var(--size-medium); border-radius: var(--size-small); gap: var(--size-small);
}
```
- Languages (derived): copy isn't CSS. Keep one string file per mode under the same keys (`en.json`, `sv.json`) and switch them with the page `lang`, separately from `data-theme`. Keeping two independent switches matches his advice to keep collections separate.
- Scoped modes (derived): Figma sets a mode per frame, and the CSS equivalent is `data-theme` on any container, not only `:root`.

### Gotchas
- Putting every variable into one collection, which locks theme, language and size together.
- Switching to dark mode before every colour is bound, so some layers don't change.
- Typing raw values into the theme collection instead of aliasing primitives, so a primitive edit doesn't flow through.
- Modes depend on the plan (Pro at the time of recording).

### Examples named
- Figma: Variables, collections, aliases and modes.

## The Secret Trick For Amazing Animations in Figma
- source: Tim Gabe · https://youtu.be/bdR3p6PvYQQ
- type: tool-tutorial
- tags: animation, prototyping, smart-animate, micro-interaction, figma

### Takeaways
- The same Figma animation looks ordinary with a bezier curve and alive with a spring.
- Bezier: you only set how the motion starts and how it ends, with two handles.
  - Pros: the handles are easy to understand.
  - Cons: it's hard to perfect, motion can stop oddly or turn unnaturally, and the results feel generic and sometimes lifeless.
- Spring: models real-world physics. It looks more alive and smoother, but its three parameters (stiffness, damping, mass) are harder to grasp.
- His definitions, as stated:
  - Stiffness sets the number of bounces. Drag the graph horizontally to change it: right for less stiff, left for stiffer.
  - Mass sets the speed and the height of the bounce. More mass gives a big, high bounce and a longer animation, like a container dropped off a mountain. Little mass settles like a feather landing.
  - Damping sets how springy it is. More damping is less springy, less damping is more springy.
- Three feels (exact values shown on screen, not stated):
  - Aggressive: fairly stiff, low damping, low mass, short timing. It comes in fast and stops fast.
  - Smooth: lower stiffness, more damping, more mass. Longer and soft.
  - Fun: high stiffness, a fair amount of damping and a lot of mass. Very bouncy; he calls it a clown feeling.
- Physics check (derived): bounciness comes from the damping ratio ζ = damping / (2·√(stiffness·mass)). Below 1 it overshoots, and the lower it is, the more bounces you get. Speed comes from ω = √(stiffness / mass). Settling takes about 4/(ζω) = 8·mass/damping seconds. This fits his descriptions: mass slows the spring and makes it bouncier, damping calms it, and stiffness mostly changes how many oscillations fit into the settle time.

### Recipes
1. Custom bezier [00:30–01:32] (Figma, Prototype tab)
   1. On the interaction, set the animation to Smart animate and the easing to Custom bezier.
   2. Drag the start handle to shape the start. Pulled past the graph's edge, it gives a bounce at the beginning.
   3. Drag the end handle to shape the finish. Pulled past the edge, it overshoots at the end.
   4. Play the preview to check it.
2. Custom spring [02:06–04:44]
   1. Smart animate, then choose Custom spring at the bottom of the easing dropdown.
   2. Type stiffness, damping and mass, or drag the graph (horizontal drag changes stiffness).
   3. Tune by watching the live preview.
3. Pick a feel [04:44–06:18]
   - Aggressive: stiffness fairly high, damping low, mass low.
   - Smooth: stiffness lower, damping higher, mass higher.
   - Fun: stiffness high, damping moderate, mass high.

### CSS translation
```css
/* Bezier with a bounce at both ends: y1 < 0 dips at the start, y2 > 1 overshoots at the end (values derived) */
.pop { transition: transform 500ms cubic-bezier(.6, -.35, .35, 1.35); }

@media (prefers-reduced-motion: reduce) { .pop, .spring { transition-duration: 1ms; } } /* derived */
```
```js
// Spring to CSS linear() easing (derived). Same three inputs as Figma's Custom spring.
function springToCSS({ stiffness: k, damping: c, mass: m }, steps = 60) {
  const w0 = Math.sqrt(k / m);                    // natural frequency, rad/s
  const z = c / (2 * Math.sqrt(k * m));           // damping ratio: < 1 bounces, >= 1 no overshoot
  const s = Math.sqrt(Math.max(z * z - 1, 1e-6));
  const pos = t => {
    if (z < 1) {
      const wd = w0 * Math.sqrt(1 - z * z);
      return 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
    }
    const r1 = -w0 * (z - s), r2 = -w0 * (z + s); // overdamped or critical
    return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
  };
  const decay = z < 1 ? z * w0 : w0 * (z - Math.sqrt(Math.max(z * z - 1, 0)));
  const T = Math.log(1000) / decay;               // seconds until within 0.1% of rest
  const pts = Array.from({ length: steps + 1 }, (_, i) => (i === steps ? 1 : pos((i / steps) * T)).toFixed(3));
  return { duration: `${Math.round(T * 1000)}ms`, easing: `linear(${pts.join(', ')})` };
}

// Usage: feed in the values you tuned in Figma (the video's are on screen only)
const s = springToCSS(figmaSpring);               // { stiffness, damping, mass }
el.style.transition = `transform ${s.duration} ${s.easing}`;
```
- Framer Motion and Motion take the same three names (`type: "spring", stiffness, damping, mass`), so tuned Figma values carry straight over (derived).

### Gotchas
- Bezier tweaks that end in an odd stop or an unnatural turn.
- Treating stiffness as the only bounce control. If a spring bounces too much, raise the damping or lower the mass (derived from the damping-ratio formula).
- Too much mass makes interactions feel slow, because settle time grows with mass ÷ damping (derived).
- Keep the playful "fun" spring for moments meant to be playful. The aggressive and smooth feels suit everyday UI (derived from his framing of each preset's mood).

### Examples named
- Figma: Smart animate with the Custom bezier and Custom spring easing options.

## Master Figma’s Sticky Scroll in 4 Minutes
- source: Tim Gabe · https://youtu.be/s_GRc42EjNU
- type: tool-tutorial
- tags: scroll, prototyping, figma, auto-layout

### Takeaways
- Sticky scroll is a long-standing web and mobile pattern. A Figma prototype reproduces it with three settings: parent overflow, a wrapper that sets the offset, and Sticky position.
- The outermost frame (desktop, mobile, whatever the prototype is) has to scroll: Overflow goes from No scrolling, the default, to Vertical.
- The wrapper auto layout around a sticky element decides the gap it keeps from the top of the frame once it locks:
  - Option A: top padding on the wrapper is that gap.
  - Option B, his preference for pixel control: a fixed wrapper height with the content placed at the bottom.
- Stagger stacked sticky items by wrapper height. Text wrapper 400, button wrapper 560: 160px more, so the button locks below the text. The image wrapper is also 560.
- Preview it in a frame 900 tall, so the content runs past the frame and scrolls.

### Recipes
1. Parent frame [00:00–01:01]: select the outermost frame, open the Prototype tab and set Overflow from No scrolling to Vertical.
2. Sticky wrappers [01:01–02:31]
   1. Wrap each element that should stick (the text, the button, the image) in its own auto layout.
   2. Option A: give the wrapper top padding equal to the gap you want above the element when it sticks.
   3. Option B: remove the padding, set the height to Fixed and place the content at the bottom. Text 400; button 560, so it ends up 160 below the text; image 560.
3. Position [02:31–03:03]: select each one (button, text, image) and, in the Prototype settings, change Position from Scroll (with parent) to Sticky.
4. Preview [03:03–03:33]: duplicate the frame, set its height to 900, add a flow starting point and press Play. Each element scrolls up, then locks at its offset.

### CSS translation
```css
/* Overflow Vertical on the outer frame = the normal page scroll on the web.
   900 is only his preview frame, so use it just for a fixed-height demo container. */
.demo-viewport { height: 900px; overflow-y: auto; }

/* Option B as built in Figma: sticky wrapper, fixed height, content pinned to the bottom */
.stick {
  position: sticky; top: 0;
  display: flex; flex-direction: column; justify-content: flex-end;
  pointer-events: none;                 /* the empty top area shouldn't block clicks (derived) */
}
.stick > * { pointer-events: auto; }
.stick--text   { height: 400px; }       /* content's bottom edge locks 400px from the top */
.stick--button { height: 560px; }       /* 160px lower, so it sits below the text */
.stick--image  { height: 560px; }

/* Option A: padding as the offset (value derived) */
.stick--padded { position: sticky; top: 0; padding-top: 120px; }

/* Plain CSS needs no wrapper: set the offset directly (value derived) */
.sticky-title { position: sticky; top: 96px; }
```
- (derived) `position: sticky` only sticks while its parent box is on screen. Any ancestor with `overflow: hidden` or `auto` becomes the scroll container and quietly breaks it; use `overflow: clip` if something has to be clipped.
- (derived) Unlike in Figma, a wrapper in normal flow takes up its full height and pushes the content below it down. To layer wrappers over a section, put them in the same grid cell (`grid-area: 1 / 1`).

### Gotchas
- Leaving the outer frame on No scrolling, so nothing moves.
- Making an element sticky with no wrapper, so you can't control its gap from the top.
- Stacked sticky items with the same wrapper height overlap. Offset each one (he adds 160).
- Previewing a frame as tall as its content, which leaves nothing to scroll. Shorten it (he uses 900).

### Examples named
- Figma: prototype Overflow, Position Sticky, auto layout wrappers and flow starting points.
