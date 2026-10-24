## I Made The Biggest Movie Ever Into A Website
- source: Tim Gabe · https://youtu.be/R33gaV3EV1I
- type: redesign/breakdown
- tags: framer, hero, sections, landing-page, animation, scroll, parallax, carousel, imagery, 3d, contrast, buttons, ai

### Takeaways
- Plan the site as a scene and a story before building. He starts on a blank canvas by sketching the hero (a character on a cliff looking out over vivid skies and blooming nature) and listing its motion beats:
  - the camera zooms closer into the scene as the page loads,
  - a bold heading rises from the bottom,
  - "magic dust" floats in the sky so the scene feels alive,
  - an animated icon hints at scrolling,
  - a tiny, mysterious line of text acts as a teaser.
- The zoom only feels cinematic with two layers: cut the character out of the background, then zoom both images.
- Depth sandwich: background plate → heading → cut-out character. The heading sits behind the character but in front of the background, so it reads as if it stands on the horizon. A blend mode plus a shadow gives the heading a glassy look.
- Hero entrances come from the edge each element sits nearest: the logo from the top, the scroll icon and teaser text from the bottom. The big heading slides up from the bottom.
- Structure the scroll as story chapters tied to beats of the film: Joy, Agony and Salvation. Each chapter gets its own motion idea and mood:
  - Joy (the Banshee flight): a creature flies across the screen as you scroll, over a wide view of Pandora.
  - Agony (the tree set on fire): floating particles and dreamlike looping images that spin, glow and drift at different scroll speeds.
  - Salvation: real clips from the film in a 3D slideshow floating in space, glowing like an aurora, which settles into place above the copy as you scroll.
- Contrast over busy imagery: put a blurred, dark shape on the side where the copy sits, and place the copy on top of it.
- Vary the layout between chapters. Joy's content sits on the right; Agony's is centred, to mix things up.
- Reuse one ambient component across the whole site and retune it per chapter. The hero's magic dust is recoloured to look like fire particles in Agony. In Salvation, the size, shape and number of particles change, they get vivid colours, and the whole layer is blurred into a moving glow behind the slider.
- Joy's copy links to that part of the film through a shining button. Salvation closes on a shiny button in the film's blue, to stay on brand.
- Use real footage where the section's job is to sum up the story. Salvation uses actual film clips rather than stills.
- The images are generated, not drawn. He jokes about drawing them by hand; the companion hero tutorial credits Midjourney.

### Recipes
Values for most of these builds are in the companion tutorials. Here the build is narrated, and settings are not stated.
1. Hero [00:31–02:09]: separate the character from the background and zoom both; add the magic dust; heading with a blend mode and a shadow, placed between the plate and the character; logo at the top; scroll icon and teaser text at the bottom; entrances from each end of the screen. Full settings: "5 Tricks For Epic Hero Animations" (this batch).
2. Joy [02:41–03:43]: Pandora view as the background; a blurred dark colour on the right; content on top of the blur; the Banshee flies across the screen on scroll; tilt and fade-in on the content; a shining button. Full settings: "Easy Scroll Animation For Beginners" (this batch). The shine button: "3 Tricks For Amazing Button Animations" (batch-09b).
3. Agony [04:13–04:45]: duplicate each image and blur the back copy for a glow; make the images spin; reuse the dust in fire colours; move the images at different speeds on scroll; centre the content and fade it in. Full settings: "Framer Parallax Trick (Loop & Scroll Speed Tutorial)" (batch-09b).
4. Salvation [05:18–06:20]:
   1. Drop Framer's built-in slider onto the canvas and load it with clips from the film.
   2. Add 3D effects that play as you scroll, so the slider falls into place above the content.
   3. Duplicate the dust: change the particle size, shape and count, give it several vivid colours, blur the whole layer and put it behind the slider. The result is a fluid, moving glow.
   4. Content below the slider, with a shiny button in the film's blue.

### CSS translation
Salvation is the only chapter without its own tutorial. Every value below is derived.
```css
/* A 3D clip slider that settles flat as its section scrolls in, over a blurred "aurora" (all values derived) */
.salvation { position: relative; isolation: isolate; perspective: 1200px; view-timeline: --salvation; }
.salvation .slider { transform-origin: 50% 100%; }
@supports (animation-timeline: view()) {
  .salvation .slider { animation: settle linear both; animation-timeline: --salvation; animation-range: entry 10% cover 45%; }
}
@keyframes settle { from { transform: rotateX(40deg) translateY(160px) scale(.85); opacity: .3; } }

/* The video blurs a particles component. Blurred gradients are a lighter stand-in. */
.salvation .aurora { position: absolute; inset: 10% 0 40%; z-index: -1; filter: blur(64px); opacity: .8;
  background: radial-gradient(40% 60% at 30% 50%, var(--c1), transparent 70%),
              radial-gradient(35% 55% at 70% 40%, var(--c2), transparent 70%),
              radial-gradient(30% 50% at 50% 70%, var(--c3), transparent 70%);
  animation: drift 18s ease-in-out infinite alternate; }
@keyframes drift { to { translate: 4% -3%; scale: 1.08; } }
@media (prefers-reduced-motion: reduce) { .salvation .slider, .salvation .aurora { animation: none; } }
```
- The timeline is named on the section, not taken from the slider with `view()`, so the slider's own 3D transform can't skew its scroll progress (derived).

### Gotchas
- A scroll hint needs somewhere to scroll to. He finishes the hero, then has to admit there is nothing below it yet: build the sections before polishing the hero's scroll cue.
- Nothing else is warned against. This is a narrated build, not a how-to.

### Examples named
- Avatar: the film turned into the site. He calls it the highest-grossing film ever (creator's claim, unverified). Scenes used: the Banshee flight (Joy), the tree set on fire (Agony), and clips for Salvation.
- Framer's built-in slider: the Salvation clip slideshow.
- The "magic dust" particles component: reused in every chapter. Its source (framer.supply) is named in the hero tutorial.

## Easy Scroll Animation For Beginners (Framer Tutorial)
- source: Tim Gabe · https://youtu.be/zsxcr7aP2yo
- type: tool-tutorial
- tags: framer, scroll, animation, sections, imagery, responsive

### Takeaways
- The sequence is four motion groups in one section, all fired by the same Scroll Section:
  - the section fades in,
  - the background zooms from 1 to 1.2,
  - the creature (a Banshee) flies 700px right and 700px up,
  - the copy fades in from a 3° tilt and 20px below.
- Stagger by viewport line, not only by delay. "Section in view" can fire when the section meets the viewport's bottom, middle or top: bottom fires first, top last. He puts the section fade on bottom, the Banshee on middle and the copy on top, so the sequence unfolds as you scroll.
- Two effect types:
  - Scroll transform: a From state and a To state, for layers that move, zoom or fade as the section arrives.
  - Scroll animation: an Enter state that animates into the layer as designed, with Replay, for text that should fade in and fade out again when you scroll back out.
- Stagger sibling copy in 0.1s steps: 0, 0.1, 0.2, 0.3.
- Keep every animated layer a direct child of the section. An effect on a parent also moves all its children.
- Pin everything before animating, so the section stays responsive: background 0 on all sides, text stack right 56 / top 120, blur right −112 / top 256, section width Fill.
- Scroll-triggered effects need scroll room after the section. Without it, only half of the animation plays.

### Recipes
1. Structure [00:33–03:11]
   1. A frame named "section" holding the Banshee, the background image (centred), the text stack, and a blur shape behind the text (text above the blur in the layer order). Nothing is nested inside anything else.
   2. Background: pinned 0 / 0 / 0 / 0.
   3. Text stack: unpinned from the left, pinned right 56 and top 120. Make it taller so the layout doesn't break.
   4. Blur: pinned right −112, top 256.
   5. Banshee: placed bottom left.
   6. Put the section into the breakpoint frame and set its width to Fill. Leave scrollable space after it.
2. Scroll Section [04:14–04:45]: select the section → right sidebar → + → Scroll Section, named "amazing banshee".
3. Banshee flight [03:43–06:18, revisited at 07:20]
   1. Effects → Scroll transform. Change the trigger from On scroll to Section in view, and pick the section "amazing banshee".
   2. From: opacity 1, scale 1. To: opacity 1, scale 1, offset X 700, offset Y −700, plus a slight rotation (value not stated) so it slides as it climbs.
   3. Transition: Spring (values not stated).
   4. Viewport line: bottom starts the flight as soon as the section enters; middle waits until the section reaches mid-screen; top waits longer still. He settles on middle.
4. Background zoom [06:18–07:20]: Scroll transform → Section in view → "amazing banshee". From opacity 1, scale 1 → To opacity 1, scale 1.2. Add a transition. The viewport line isn't stated.
5. Copy entrance [07:20–09:29]
   1. "Chapter one" → Effects → Scroll animation. Trigger Section in view (not Layer in view) → "amazing banshee" → Top. Replay stays on.
   2. Enter state: opacity 0, scale 1, rotation 3°, offset Y 20.
   3. Transition: Framer's built-in spring at its default values.
   4. Right-click the effect → Copy. Select the other stack elements → Paste effects.
   5. Stagger: open each pasted effect's transition and set delays 0.1, 0.2 and 0.3. Shortcut: with the effect panel open, click the next layer and the panel switches to that layer's own settings.
6. Section fade [09:29–10:00]: select the section → Scroll transform → Section in view → "amazing banshee" → bottom. From opacity 0, scale 1 → To opacity 1, scale 1. Add a transition.

### CSS translation
```html
<section class="joy">                 <!-- the Framer Scroll Section "amazing banshee" -->
  <img class="bg" src="pandora.jpg" alt="">
  <div class="shade"></div>           <!-- the blur behind the copy -->
  <div class="copy">
    <p class="reveal">Chapter one</p><h2 class="reveal">…</h2><p class="reveal">…</p><a class="reveal" href="#">…</a>
  </div>
  <img class="banshee" src="banshee.png" alt="">
</section>
```
```css
:root { --spring: cubic-bezier(.34,1.56,.64,1); }          /* stand-in for Framer's default spring, derived */

.joy { position: relative; min-height: 100vh; overflow: clip;  /* height and clip derived */
       opacity: 0; transition: opacity 600ms ease-out; }        /* fade 0 → 1 stated, timing derived */
.joy.line-bottom { opacity: 1; }

.joy .bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
           transition: scale 1200ms var(--spring); }           /* timing derived */
.joy.line-bottom .bg { scale: 1.2; }                           /* 1.2 stated; viewport line not stated */

.joy .copy  { position: absolute; right: 56px; top: 120px; }   /* stated */
.joy .shade { position: absolute; right: -112px; top: 256px; } /* pins stated; size, colour, blur on screen */

.joy .banshee { position: absolute; left: 0; bottom: 0;        /* "bottom left"; exact pins not stated */
                transition: translate 1400ms var(--spring), rotate 1400ms var(--spring); }
.joy.line-middle .banshee { translate: 700px -700px; rotate: 12deg; }  /* 700 / −700 stated, rotation derived */

.joy .reveal { opacity: 0; translate: 0 20px; rotate: 3deg;    /* stated */
               transition: opacity 500ms ease-out, translate 700ms var(--spring), rotate 700ms var(--spring); }
.joy .reveal:nth-child(2) { transition-delay: .1s; }
.joy .reveal:nth-child(3) { transition-delay: .2s; }
.joy .reveal:nth-child(4) { transition-delay: .3s; }
.joy.line-top .reveal { opacity: 1; translate: 0 0; rotate: 0deg; }

@media (prefers-reduced-motion: reduce) {
  .joy, .joy * { transition-duration: 1ms !important; transition-delay: 0s !important; }
}
```
```js
// "Section in view": the layer fires when a viewport line reaches the section, and the class comes
// off again when the section leaves that line (Replay). Root margins are derived.
const sec = document.querySelector('.joy');
const lines = { bottom: '0px', middle: '0px 0px -50% 0px', top: '0px 0px -100% 0px' };
for (const [name, rootMargin] of Object.entries(lines))
  new IntersectionObserver(([e]) => sec.classList.toggle(`line-${name}`, e.isIntersecting), { rootMargin }).observe(sec);
```
- Framer plays these on a trigger. If you want the motion scrubbed to the scrollbar instead, drive it with a named `view-timeline` on the section and `animation-timeline` on each layer (derived).

### Gotchas
- An effect on a layer that has children animates all of them. Keep animated layers flat.
- With no scrollable space after the section, the animation only gets halfway.
- After demoing the top line he forgot to switch the Banshee back, and it lagged behind the background zoom. He set it back to middle.
- Scroll transform starts on the On scroll trigger. Switch it to Section in view and pick the section, or the effect isn't tied to this section.
- A Scroll Section has to be added to the section (+ → Scroll Section) before a layer can target it.

### Examples named
- none named. The imagery (a Banshee over Pandora) is from Avatar; this is the Joy section of the movie site above.

## 5 Tricks For Epic Hero Animations (Framer Tutorial)
- source: Tim Gabe · https://youtu.be/m2NXQjKPUrg
- type: tool-tutorial
- tags: framer, hero, animation, imagery, typography, ai, responsive, landing-page

### Takeaways
- The quickest win for a hero is a great visual. His Avatar-style wallpaper was generated in Midjourney.
- The five tricks:
  1. Cut the character out and rebuild a clean background plate, so the two layers can zoom.
  2. A particles component for ambient sparkle.
  3. A huge blended heading placed behind the character.
  4. A Lottie scroll indicator.
  5. Staggered spring entrances.
- Bleed the background 150px past every edge (pins at −150). It can then start at scale 0.85 and still cover the screen.
- Hero height 100vh, so it fills one screen on any monitor or phone.
- The load zoom is an Appear effect: opacity 1, scale 0.85 → full size over 2s, copied onto both the plate and the character. Nudge the character down a little first, because it grows into place.
- Overlay blending on white type, plus a soft shadow (Y 4, blur 12), lets the background show through the letters. Fit sizing ties the type size to its container.
- Put the character above the heading in the layer order, so the heading sits on the horizon.
- Entrance order by delay: heading at 2s (rises 500px), logo at 2.5s (from the top), scroll hint at 3s (from the bottom). The entrances begin as the 2s zoom finishes (derived).
- A heavier mass with more damping gives a slower, smoother landing. Damping 80 on the heading makes it settle softly.
- The Slide in top preset travels a shorter distance than a full slide, so it reads smoother, but the default timing is still too fast. Tune the spring.

### Recipes
1. Cut-out and clean plate in Photoshop [00:32–02:36]
   1. Import the image. Object Selection tool → select the character → Select and Mask → Output To: New Layer → OK.
   2. Select the original layer and mark the character's area with the content-aware Remove tool, then Generative Fill with the prompt "remove". Hide the cut-out and pick the best of the variations.
   3. With only the cut-out visible: Quick Export as PNG ("hero image 1"). Merge the generative-fill layer into the original, then Quick Export as PNG ("hero image 2").
2. Hero frame and zoom [02:36–05:13]
   1. In Framer, place the character above the background, not inside it. Select both → Add frame, named "hero". Put it in the breakpoint: width Fill, height 100vh.
   2. Pin the background to all four sides at −150, not 0.
   3. Slide the character down a little.
   4. Background → Effects → Appear: opacity 1, scale 0.85. Transition: Spring, then the tab heard as "east" (likely the Ease type, or the spring's Time mode) → duration 2s.
   5. Animated layers show an icon in the left sidebar. Right-click the effect → Copy, then right-click the character → Paste effects.
3. Particles [05:43–06:45]
   1. Copy the particles component from framer.supply and paste it into the project.
   2. Give every instance on the page its own ID (his: "Avatar hero").
   3. Backdrop → 0% opacity.
   4. Put it inside the background image, pinned 0 on all sides, so it scales and zooms with the plate. The sparkles also react to the cursor.
4. Big blended heading [07:16–08:48]
   1. T → a large word, white.
   2. Styles → + → Blending → Overlay.
   3. Font: Toric SC (a custom font).
   4. Shadow: Y 4, blur 12, with the strength raised (value not stated).
   5. Size: switch from pixels to Fit. At 100% the type fills its container; he suggests about 75%.
   6. Inside the bleeding background, the text runs past the frame. Move it into the hero frame instead. If it doesn't return to normal size, resize it and set the size back to 100%.
5. Scroll indicator, teaser and logo [08:48–11:22]
   1. Insert → Lottie (he mentions both the Lottie and the dotLottie components). Paste the URL of a hosted Lottie file (his: a scrolling mouse). Backdrop 0%, then scale it down.
   2. Teaser text in Rubik (a web font, not a custom one), size 14.
   3. Select the icon and the text → Add frame, remove the fill. Move the frame out of the background to the top level and centre it. Make it a stack: height Fit content, gap 20. Pin it 48 from the bottom.
   4. Logo: upload an SVG logotype into the hero (not into the background), pin it 48 from the top, centred.
   5. Check the order: the character sits above the heading.
6. Entrance sequence [11:52–14:24]
   1. Logo → Effects → Appear → preset Slide in top. Transition: delay 2.5s, mass 4 (captions: "before"), damping increased (value not stated), stiffness 300.
   2. Copy the effect onto the bottom stack. Change the offset from −60 to 60 so it comes from below. Delay 3s, so it follows the logo by 0.5s.
   3. Paste it onto the heading. Offset 500 (positive, from below), delay 2s, damping 80.

### CSS translation
```html
<header class="hero">
  <div class="plate"><img src="hero-image-2.png" alt=""><!-- particles canvas, inset 0 --></div>
  <h1 class="title">…</h1>                          <!-- between plate and character = on the horizon -->
  <img class="char" src="hero-image-1.png" alt="">
  <a class="logo" href="/"><img src="logo.svg" alt="…"></a>
  <div class="hint"><!-- Lottie player: hosted file, autoplay, loop, transparent background --><span>…</span></div>
</header>
```
```css
.hero { position: relative; height: 100vh; overflow: clip; container-type: inline-size; } /* 100vh stated; clip, container derived */
.hero .plate { position: absolute; inset: -150px; }                                   /* −150 bleed stated */
.hero .plate img { width: 100%; height: 100%; object-fit: cover; }
.hero .char { position: absolute; left: 50%; bottom: -4%; translate: -50% 0; }        /* "slid down a bit", value derived */
.hero .plate, .hero .char { animation: zoom 2s cubic-bezier(.22,1,.36,1) both; }      /* 2s stated, curve derived */
@keyframes zoom { from { scale: .85; } }                                              /* opacity stays 1 */

.hero .title { position: absolute; inset-inline: 0; top: 28%; margin: 0; text-align: center; /* placement derived */
  font-family: var(--display); font-size: 16cqi; line-height: 1; white-space: nowrap;  /* "Fit": size tracks container width, 16cqi derived */
  color: #fff; mix-blend-mode: overlay; text-shadow: 0 4px 12px rgb(0 0 0 / .45);      /* Y 4, blur 12 stated; strength derived */
  /* stiffness 300, damping 80, mass 4 → damping ratio 80 / (2·√1200) ≈ 1.15 (overdamped, no overshoot),
     ω0 = √75 ≈ 8.7 rad/s. A 500px rise is ~3px from rest at 1.1s. The linear() samples that curve (derived). */
  animation: rise 1.1s linear(0, .07 4.5%, .2 9%, .34 14%, .47 18%, .67 27%, .8 36%, .9 50%, .95 64%, .98 77%, 1) 2s both; }
@keyframes rise { from { translate: 0 500px; opacity: 0; } }                          /* 500, 2s stated; opacity derived */

.hero .logo { position: absolute; top: 48px; inset-inline: 0; margin-inline: auto; width: fit-content;   /* 48 stated */
  animation: drop 1s cubic-bezier(.22,1,.36,1) 2.5s both; }                           /* damping not stated: generic ease-out */
@keyframes drop { from { translate: 0 -60px; opacity: 0; } }                          /* −60 and 2.5s stated */
.hero .hint { position: absolute; bottom: 48px; inset-inline: 0; display: flex; flex-direction: column; /* direction derived */
  align-items: center; gap: 20px; font: 14px/1.4 Rubik, sans-serif;                   /* 48, gap 20, Rubik 14 stated */
  animation: lift 1s cubic-bezier(.22,1,.36,1) 3s both; }
@keyframes lift { from { translate: 0 60px; opacity: 0; } }                           /* 60 and 3s stated */

@media (prefers-reduced-motion: reduce) { .hero * { animation-duration: 1ms !important; animation-delay: 0s !important; } }
```
- Keep the title in the same stacking context as the plate (no `isolation` or opacity wrapper around the title), or `mix-blend-mode: overlay` has nothing to blend with (derived).
- `100vh` is the stated value. On phones `100svh` avoids the jump when the browser bar collapses (derived).

### Gotchas
- Keep the character, heading, logo and scroll stack out of the background frame. Anything inside it inherits the −150 bleed and the zoom.
- Particle instances that share an ID fight each other and none of them show. Change the ID on every copy.
- The particles' black backdrop stays until you set it to 0% opacity. The Lottie component has a backdrop too.
- Fit-sized text inside the bleeding background overflows the frame. After moving it out, reset the size to 100%.
- The Lottie can vanish on the canvas, an editor bug; it still plays in preview.
- Adobe advises against prompts like "remove" in Generative Fill. It worked for him anyway.
- The default Slide in top timing is too quick. Add a delay, mass and damping.

### Examples named
- Midjourney: generated the hero wallpaper.
- Photoshop: Object Selection, Select and Mask, the Remove tool and Generative Fill, used to split the character from the plate.
- framer.supply: source of the particles component.
- Framer's Lottie and dotLottie components: play a hosted Lottie file.
- Toric SC (custom display font) and Rubik (web font).

## Webflow vs Framer in 100 Seconds
- source: Tim Gabe · https://youtu.be/t8ThPNdc_9w
- type: resources
- tags: framer, webflow, cms, figma, workflow

### Takeaways
- He compares the two on four criteria: pricing, Figma export, CMS and overall UI.
- Pricing, a tie (figures at the time of recording; creator's claim, unverified):
  - simple landing pages and portfolios: Framer Mini $5 vs Webflow Basic $14,
  - mid-sized projects such as blogs: Webflow's CMS plan is cheaper than Framer Pro,
  - big projects: Framer Pro comes out a little cheaper.
- Figma export goes to Framer. In Framer it's a straight copy-paste of the design, two steps. Webflow needs extra steps and pushes you to build the Figma file the way Webflow works, like a traditional drag-and-drop builder. Webflow gives less design freedom, so the structure has to be right before you export.
- CMS goes to Webflow, its strongest edge. Framer can run full e-commerce projects, but complex setups need creative workarounds in its CMS.
- UI goes to Framer for designers. It feels like Figma: similar hotkeys, features where you expect them, free-form layout. Webflow's classes, drag-and-drop model and feature depth suit developers.
- Rule of thumb from his verdict: Framer for design-led marketing sites and portfolios; Webflow when the project is CMS-heavy, with complex collections.
- He says he built a custom website in Framer in 30 minutes, something he couldn't do in any other tool (creator's claim, unverified).

### Recipes
- none (resources)

### Gotchas
- Plan prices change. Check the current plans before quoting a client.
- Designing freely in Figma and then exporting to Webflow goes badly. Webflow wants the structure set up first.
- The verdict is a designer's view by his own framing. The UI category in particular is judged on how much it feels like Figma.

### Examples named
- Framer: Mini and Pro plans.
- Webflow: Basic and CMS plans.
- Figma: the design source for both export paths.

## Can You Copy 6 Websites in 66 Seconds?
- source: Tim Gabe · https://youtu.be/bBamB0yE12c
- type: showcase/vlog
- tags: framer, plugins, workflow

### Takeaways
- Framer's HTML to Framer browser extension turns a live page into editable Framer layers [01:03–02:38]:
  1. Switch the extension on for the page.
  2. Press Shift+Esc to target the layout and its elements.
  3. Copy the full page and paste it onto the Framer canvas. Wait for the layers to finish pasting.
  4. If a full-page copy fails, as it did on a complex e-commerce page, copy each section with Copy layout and paste them in order. He missed the top of the page the first time and had to go back for it.
- Treat the paste as a starting point. Copies come out with misaligned, missing or duplicated elements, which you fix in Framer before you publish. His six pages took about 2 minutes, not 66 seconds (creator's claim, unverified): a basic blog, a portfolio, a SaaS landing page and three e-commerce pages. The e-commerce ones were harder because of their layouts.
- Only copy pages you have permission to use. He used free templates. Use the feature on your own or licensed sites, or to study a layout, not to republish someone else's work.

### Recipes
- none (showcase/vlog)

### Gotchas
- Complex e-commerce layouts may not copy as one page. Go section by section, and check that nothing (such as the header) was skipped.
- Expect quirks in every copy: misalignment, missing pieces and duplicates.

### Examples named
- none named. The six pages are unnamed free templates: a blog, a portfolio, a SaaS landing page and three e-commerce pages.
- Framer's HTML to Framer extension: the tool being tested.
