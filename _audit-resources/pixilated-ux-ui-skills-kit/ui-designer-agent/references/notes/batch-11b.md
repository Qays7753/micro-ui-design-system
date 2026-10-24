## Award Winning Website in Framer (Loop Effect Tutorial)
- source: Tim Gabe · https://youtu.be/tBOazoVzBNk
- type: tool-tutorial
- tags: framer, animation, hero, portfolio, imagery, 3d

### Takeaways
- The award-winning hero he copies is mostly static illustrated assets, each with one small looping motion. Framer's Loop effect gets you nearly all of it.
- Mirror turns a loop into a ping-pong: the layer plays to its target and back the same way, instead of jumping back to the start.
- The Loop default is 1 s. That suits a wing flap but makes travel far too fast, so the butterfly's flight runs at 10 s.
- Wing flap: a Loop on 3D rotation around the Y axis (not X), Mirror on. The right wing is a pasted copy set to +40. The left wing's value is shown on screen, not stated (the opposite sign is implied).
- Rocking: the rotation default is 360. Set a small amplitude instead. The head ended at -10 over about 2 s, with Mirror on.
- Masked text reveal: put the text in a box that hides its overflow, then give the text an Appear "Slide in bottom" with a short delay. The box edge acts as the mask.
- Layer order builds the depth: a circle sits behind the head, and the head sits above the mushrooms.

### Recipes
1. Collect the assets [00:00–00:30]: pull every image element (head, butterfly wings, mushrooms, snail, flowers, logo, grainy background) out of the reference site.
2. Static composition [00:30–01:30]
   1. Grainy background image, scaled up.
   2. A yellow frame with the white fill removed and a border added (colour picked to match, shown on screen, not stated).
   3. Logo at the top, a small flower at the bottom, text bottom-left. Reduce the frame height a bit.
   4. Head in the middle, placed above the mushrooms. A circle behind everything, a second flower, and the snail.
3. Wing flap [01:31–02:33]: left wing → Effects → Loop → Mirror on → 3D → rotate the Y axis (value shown on screen, not stated). Copy effects → Paste effects on the right wing → change the value to +40.
4. Flight [02:33–03:05]: the whole butterfly → Effects → Loop → Mirror on (it travels up and to the right, then back the same way). Set the target so it moves up and off the canvas (offset shown on screen, not stated). Transition duration 1 s → 10 s.
5. Head rock [03:05–03:36]: Effects → Loop → rotation 360 → -10 (he tried 20 and -20 first) → duration about 2 s → Mirror on. Without Mirror the motion wasn't smooth.
6. Snail and mushrooms [03:20–03:36]: one Loop each on rotation (values not stated).
7. Heading [03:36–04:07]: text "Hi, I'm Hannah" plus a larger second line "I make things", in a different font (not named), both moved up. Effects → Appear → Fade in, transition Ease, a small delay (value not stated).
8. Masked reveal [04:07–04:37]: wrap the heading in a frame with overflow hidden → text → Effects → Appear → Slide in bottom → a small delay (value not stated).

### CSS translation
```html
<div class="flight">                       <!-- Loop 2: the flight -->
  <div class="butterfly">                  <!-- holds the perspective for the flap -->
    <img class="wing wing--l" alt=""><img class="wing wing--r" alt="">
  </div>
</div>
<div class="mask"><h1 class="rise">Hi, I'm Hannah</h1></div>
```
```css
/* Mirror on = animation-direction: alternate */
.butterfly { display: flex; perspective: 600px; }                     /* derived */
.wing { animation: flap 1s ease-in-out infinite alternate; }           /* 1 s = Loop default (implied), easing derived */
.wing--l { transform-origin: right center; --a: -40deg; }              /* sign implied by "+40 on the right" */
.wing--r { transform-origin: left center;  --a: 40deg; }               /* stated */
@keyframes flap { to { transform: rotateY(var(--a)); } }

.flight { position: absolute; animation: fly 10s ease-in-out infinite alternate; }   /* 10 s stated */
@keyframes fly { to { translate: 70vw -60vh; } }                       /* "up and off to the right", distance derived */

.head { transform-origin: 50% 90%; animation: rock 2s ease-in-out infinite alternate; }   /* origin derived */
@keyframes rock { to { rotate: -10deg; } }                            /* -10 and 2 s stated */

/* Masked reveal: the clipping box is the mask */
.mask { overflow: hidden; padding-block-end: .1em; }                   /* padding keeps descenders from clipping (derived) */
.rise { animation: rise 700ms cubic-bezier(.22,1,.36,1) 200ms both; }  /* duration, curve, delay derived */
@keyframes rise { from { translate: 0 100%; } }

@media (prefers-reduced-motion: reduce) {
  .wing, .flight, .head, .rise { animation: none; }
}
```

### Gotchas
- A loop without Mirror snaps back to its start rather than swinging back.
- Leaving travel at the 1 s default gives a frantic butterfly. Slow ambient movement down by a lot.
- Rotating the X axis instead of Y gives the wrong flap.
- The rotation default is 360, a full spin. A rocking motion needs a small value.
- The bottom-up mask only works if the wrapping box hides its overflow.
- He lifts the assets straight from the reference site and apologises to its owner on camera. That's fine for practice, but client or portfolio work needs your own or licensed art (our note).

### Examples named
- Hannah's award-winning portfolio site (surname and URL not stated): a hero of floating illustrations (butterfly, head, mushrooms, snail, flowers) on a grainy background inside a yellow bordered frame, each with its own looping motion.

## I used Framer AI to create a website… in 5 minutes
- source: Tim Gabe · https://youtu.be/U2EVNlDzAJQ
- type: tool-tutorial
- tags: framer, ai, landing-page, typography, colour, dark-mode, animation, workflow

### Takeaways
- Use Framer AI as a base generator for a landing page, then finish it by hand. He says the base arrives in under 2 minutes (creator's claim, unverified).
- Prompt shape: page type, style and product name, then a block of context about the product. The more context you give, the better the output.
- Retry generates a fresh result and also rerolls the fonts and the colour palette, so retrying loses a style you liked.
- The right sidebar offers colour schemes and font pairings, even while it is still generating. Set themes per section, but keep them consistent: he ended with one dark theme across every section.
- Pick fonts deliberately instead of shuffling. He chose a bold display face for the large heading and a more technical face for the body (names not stated).
- What needed fixing by hand: the colour scheme, the fonts, the imagery (his own images in, some generated ones out), the alignment inside cards, and the motion. He added every entrance himself, and the video doesn't say whether the generated site had any.
- Stagger entrances with delays of 0.25 s and 0.5 s on successive pricing items.
- Then Publish to get a live site on a Framer domain.

### Recipes
1. Prompt [01:02–01:32]: Start with AI → prompt field. His prompt opens with "A modern landing page for a startup called Deemable" (name as heard), followed by extra context about the product (not shown) → Start.
2. Retry [01:32–02:04]: if the result is weak, Retry until it isn't. Each retry changes the fonts and palette too.
3. Style [02:04–03:04]: try the colour schemes in the right sidebar → choose a darker one → apply it to every section. Fonts: pick a specific heading font and a "techier" body font rather than Shuffle. One section came out too pink, so he set the whole page to the dark theme.
4. Imagery and layout fixes [03:04–04:06]
   1. Paste in his own images. Hero image: Position Absolute, scaled up, placed near the top.
   2. Replace the card images with his own assets, and delete some of the generated images.
   3. He first left-aligned the content in each card, then centre-aligned everything (cards and section text) to save time and keep it consistent.
5. Motion [04:06–05:36]
   1. Heading → Effects → Appear → slide in from the bottom → raise the spring values until it feels lively (values not stated).
   2. Copy the effect → Paste effect on the other items.
   3. Pricing items: delay 0.25 on the second and 0.5 on the third.
   4. Hero image: scale in instead, with a value of 60 (heard; which field is not stated, probably a 60% start scale) plus a delay. It was low resolution, so he also made it smaller.
6. Publish [05:36–06:06]: Publish → Publish → open the domain.

### CSS translation
```css
/* Appear "slide in from the bottom" with a spring, then a stagger */
.appear { animation: slide-up 700ms cubic-bezier(.34,1.56,.64,1) both; }   /* spring values not stated, stand-in derived */
@keyframes slide-up { from { opacity: 0; translate: 0 32px; } }            /* distance derived */
.pricing > :nth-child(2) { animation-delay: .25s; }                        /* stated */
.pricing > :nth-child(3) { animation-delay: .5s; }                         /* stated */

/* Hero image scales in */
.hero__img { animation: scale-in 800ms cubic-bezier(.34,1.56,.64,1) .2s both; }   /* timing and delay derived */
@keyframes scale-in { from { opacity: 0; scale: .6; } }                    /* "60" read as 60% (derived) */

@media (prefers-reduced-motion: reduce) { .appear, .hero__img { animation: none; } }
```

### Gotchas
- Retry also rerolls fonts and colours, so expect to lose a palette you liked.
- Font Shuffle is random. Choose the pairing yourself.
- A low-resolution image looks unclean when scaled up. Scale it down or replace it.
- Generated cards came out with mixed alignment. Pick one alignment and apply it everywhere.
- An off-tone section (too pink) breaks a dark theme. Apply one theme across the page unless the contrast is intentional.
- Treat the output as a starting point: imagery, fonts and motion all needed work by hand.

### Examples named
- Framer AI ("Start with AI"): prompt-to-site generation with sidebar colour schemes and font pairings.

## Master Carousels in Framer (Slideshow, Ticker & Carousel)
- source: Tim Gabe · https://youtu.be/nS_9yAABLwc
- type: tool-tutorial
- tags: framer, carousel, components, animation, gestures, mobile, accessibility, 3d

### Takeaways
- Choose the component before you build. Framer's documentation separates the three like this:

| Component | Use it for | Controls | Motion |
|---|---|---|---|
| Ticker | endless strips of connected content: text, a wall of tweets, a gallery. Duplicates items for you | none, no snapping | speed and direction adjustable, can slow down on hover |
| Carousel | swipe and drag rows, horizontal or vertical, pagination, several items per page | optional arrows, dots or scroll bar | CSS scroll snap, so the browser runs it: fast on mobile, but the animation can't be customised |
| Slideshow | autoplaying, infinitely looping slides | arrows and dots | snapping and looping animation customisable, pauses on hover |

- Ticker hover speed 0.5x slows the strip while the pointer is over it, so people can read it. The default is 1x, no change.
- The Carousel snapped the nearest card to the centre. Turning Snapping off gives free scrolling.
- The Slideshow's Effects panel styles the inactive slides. Opacity 0.5, scale 0.5, perspective 900 (default 1200) and rotation 90 make slides flip in.
- 3D slideshow effects get clipped at the corners until Clipping is set from hide to show.
- He calls the Slideshow Framer's best component, because both its transition spring (stiffness, damping, mass) and its look are tunable.
- Fill in the accessibility label. His own example, "image carousel", is one he admits isn't very descriptive.

### Recipes
1. Ticker setup [01:00–01:31]: Insert → search "Ticker" → drag onto the canvas → stretch it to full width → connect its slots to items (images, cards, text).
2. Ticker settings [01:31–03:04]
   1. Children: reorder the items.
   2. Speed.
   3. Direction: he switches it to vertical and makes the ticker taller.
   4. Alignment: where the items sit across the strip (left, right or centre in his vertical demo).
   5. Gap and Padding.
   6. Sizing: items Stretch in width, Stretch in height, or Auto.
   7. Clipping: Fade on or off, fade width, fade inset (a % that moves where the fade starts), fade opacity.
   8. Hover: speed 1x → 0.5x.
3. Carousel setup [03:35–04:39]: Insert → "Carousel" → resize → connect items. It is responsive and snaps to the centre card.
4. Carousel settings [04:39–07:46]
   1. Children, Direction, Alignment, Gap, Padding, Sizing, as on the Ticker.
   2. Snapping: on snaps, off scrolls freely. Usually leave it on.
   3. Fading: edge fades, with a transition that animates the fade as it moves between the right and left edges.
   4. Progress: a scroll bar, or dots. Dot settings: size, inset (distance from the bottom), gap, padding, fill colour, backdrop.
   5. Arrows: none, or arrows with fill colour, arrow icon (or an image), size, radius and inset.
   6. Accessibility: a label for the carousel.
   7. Radius of the carousel itself.
5. Slideshow [08:16–10:52]
   1. Insert → "Slideshow" → connect images. It shows one item, so Items is set to 1, and the slideshow is made smaller to show off the effect.
   2. Effects (inactive items): opacity 0.5, scale 0.5, perspective 1200 → 900, rotation 90 (axis not stated).
   3. Clipping: overflow hide → show, so the flip isn't cut at the corners.
   4. Transition: tune the spring's stiffness, damping and mass (values not stated).
   5. Also available: Draggable, Autoplay yes/no, Interval.

### CSS translation
Ticker (marquee):
```html
<div class="ticker" style="--gap: 24px; --speed: 80">   <!-- speed in px/s, derived -->
  <div class="ticker__track">
    <div class="ticker__set">…items…</div>
    <div class="ticker__set" aria-hidden="true">…same items…</div>   <!-- Framer duplicates for you; in code you do it -->
  </div>
</div>
```
```css
.ticker {
  overflow: hidden;
  --fade: 12%; --inset: 0%; --edge: 0;   /* fade width, fade inset, fade opacity (mapping and values derived) */
  mask-image: linear-gradient(to right,
    rgb(0 0 0 / var(--edge)) var(--inset), #000 calc(var(--inset) + var(--fade)),
    #000 calc(100% - var(--inset) - var(--fade)), rgb(0 0 0 / var(--edge)) calc(100% - var(--inset)));
}
.ticker__track { display: flex; width: max-content; animation: ticker 30s linear infinite; }   /* duration set by JS */
.ticker__set   { display: flex; gap: var(--gap); padding-inline-end: var(--gap); }   /* end padding makes -50% exactly one set */
@keyframes ticker { to { translate: -50% 0; } }
.ticker--reverse .ticker__track { animation-direction: reverse; }
/* Vertical: column flex on track and sets, a "to bottom" mask, translate 0 -50%, and a fixed height on .ticker */
@media (prefers-reduced-motion: reduce) { .ticker__track { animation-play-state: paused; } }
```
```js
document.querySelectorAll('.ticker').forEach(t => {
  const track = t.querySelector('.ticker__track');
  const pxPerSec = parseFloat(getComputedStyle(t).getPropertyValue('--speed')) || 80;   // derived
  track.style.animationDuration = track.firstElementChild.offsetWidth / pxPerSec + 's';
  const anim = track.getAnimations()[0];
  // Hover 0.5x: change the playback rate. A new animation-duration would make the strip jump.
  t.addEventListener('pointerenter', () => anim.updatePlaybackRate(0.5));   // 0.5 stated
  t.addEventListener('pointerleave', () => anim.updatePlaybackRate(1));
});
```
Carousel (scroll snap):
```html
<section class="carousel-wrap" aria-roledescription="carousel" aria-label="Recent projects">   <!-- the Accessibility label -->
  <div class="carousel">…cards…</div>
  <button class="prev" aria-label="Previous">‹</button><button class="next" aria-label="Next">›</button>
  <div class="dots">…one <button> per card…</div>
</section>
```
```css
.carousel { display: flex; gap: 16px; padding-inline: 24px; scroll-padding-inline: 24px;   /* gap and padding derived */
            overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain;
            scrollbar-width: thin; border-radius: 16px; }                                   /* Progress: scroll bar; radius derived */
.carousel > * { flex: 0 0 min(80%, 360px); scroll-snap-align: center; }   /* snaps to the centre card, as in the demo */
.carousel--free { scroll-snap-type: none; }                               /* Snapping off */
.dots button[aria-current] { opacity: 1; } .dots button { opacity: .4; }  /* derived */
```
```js
const c = document.querySelector('.carousel'), items = [...c.children];
const dots = [...document.querySelectorAll('.dots button')];
const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
document.querySelector('.prev').onclick = () => c.scrollBy({ left: -c.clientWidth * .8, behavior });
document.querySelector('.next').onclick = () => c.scrollBy({ left:  c.clientWidth * .8, behavior });
dots.forEach((d, i) => d.onclick = () => items[i].scrollIntoView({ inline: 'center', block: 'nearest', behavior }));
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) dots.forEach((d, i) => d.toggleAttribute('aria-current', items[i] === e.target));
}), { root: c, threshold: .6 });
items.forEach(i => io.observe(i));
```
Slideshow (3D flip, autoplay, pause on hover):
```css
.slideshow { overflow: visible; --spring: cubic-bezier(.34,1.56,.64,1); }   /* Clipping: show. Spring values not stated, stand-in derived */
.slideshow__track { display: flex; translate: calc(var(--i, 0) * -100%) 0; transition: translate 800ms var(--spring); }
.slide { flex: 0 0 100%;                                                     /* Items: 1 */
         opacity: .5; transform: perspective(900px) rotateY(90deg) scale(.5);   /* 0.5, 0.5, 900, 90 stated; Y axis derived */
         transition: opacity 800ms, transform 800ms var(--spring); }
.slide.is-active { opacity: 1; transform: perspective(900px) rotateY(0) scale(1); }
/* perspective() inside each slide's transform gives every slide its own vanishing point,
   so the moving track doesn't drag the 3D origin along with it (derived) */
```
```js
const show = document.querySelector('.slideshow'), track = show.firstElementChild, slides = [...track.children];
let i = 0, timer;
const go = n => { i = (n + slides.length) % slides.length; track.style.setProperty('--i', i);
                  slides.forEach((s, k) => s.classList.toggle('is-active', k === i)); };
const play = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 4000); };   // Interval not stated, derived
const stop = () => clearInterval(timer);
show.addEventListener('pointerenter', stop); show.addEventListener('pointerleave', play);   // pause on hover
show.addEventListener('focusin', stop);      show.addEventListener('focusout', play);
go(0); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) play();
```
- Framer's Slideshow loops seamlessly. This version rewinds from the last slide to the first. For a seamless wrap, clone the first slide at the end and jump back without a transition (derived).
- A ticker or autoplay slideshow that moves for more than 5 s needs a visible pause control to meet WCAG 2.2.2. Pause on hover doesn't help keyboard or touch users (derived).

### Gotchas
- The wrong component for the job: a Ticker has no controls or snapping, and a Carousel's animation can't be customised.
- A new Slideshow shows a single item, so it won't look like the Carousel until you set Items.
- The slideshow's 3D effects clip at the corners while Clipping is set to hide.
- A generic accessibility label ("image carousel") says little. Describe the content.
- In code, `overflow: visible` on the slideshow exposes the off-screen slides and can cause sideways page scroll. Clip with `overflow-x: clip` on a wrapper further up (derived).
- In code, changing a CSS marquee's `animation-duration` on hover makes it jump position. Use the playback rate instead (derived).

### Examples named
- Framer's documentation: the official descriptions of Ticker, Carousel and Slideshow, used to choose between them.

## Complete Website in Framer: Beginner Tutorial
- source: Tim Gabe · https://youtu.be/PYskozIWh-E
- type: tool-tutorial
- tags: framer, design-system, tokens, components, variants, states, sections, navigation, hero, cards, breakpoints, responsive, animation, parallax, auto-layout

### Takeaways
- Start every site with a Style Guide page. He calls it optional but recommends it because it scales. The page holds:
  - Colour styles: teal, white, blue (values shown on screen, not stated). Edit one and every use updates.
  - Text styles: Heading 1, Heading 2, Body Large, Body Medium, Body Small, set inside resizable frames so you can preview them scaling.
  - Components: a logotype (dark and light versions) with a large desktop variant and a smaller tablet/mobile variant. A medium "Book a demo" button and a large button, each with desktop and mobile variants plus hover states.
  - An image library, and the reference design (brought in with the Figma to Framer plugin, or as a screenshot).
- Build the structure from Framer's pre-made Sections (Insert → Sections), even when they don't match the design. They bring responsive behaviour and sensible padding for free, which makes the tablet and phone pass much faster.
- Stacks are Framer's version of Figma auto layout, which is flexbox on the web.
- Background video in a hero: Position Absolute, pinned 0 on every side, z-index 0 so it sits behind, and the hero at 100vh.
- Colour tint over a video: an overlay filled with the brand blue, blend mode changed from Multiply to Color.
- A spacing ladder: padding 56 on desktop, 40 on tablet, 24 on phone. Gaps run 56 / 48 / 40 / 32 / 24. Max width 1440 on every section, canvas 1440.
- Cards: padding 40, gap 48, radius 56, height 700. Content sits bottom-left (alignment Left, distribution End).
- Tablet: the horizontal card row turns vertical. Logo and buttons switch to their mobile variants.
- Motion: stagger text entrances by 0.5 s. Cards scale in from 0.8 with a 10° Y rotation and a 25 offset from below. Trigger on section in view, with the viewport at Center.
- Parallax on images further down the page: scroll speed 110. 140 was too fast, because the images had already scrolled past by the time the section arrived.

### Recipes
1. Style guide page [00:30–04:05]: build the colour styles, text styles, components with variants and hover states, image library, and reference design as above.
2. Skeleton from sections [04:05–07:09]: place the reference design on Home, then Insert → Sections and add, top to bottom:
   1. Navigation → top bar.
   2. A hero with an image or video background (not the plain-colour version).
   3. A horizontal layout with two cards.
   4. A header without a background, for the CTA with floating images.
   5. Navigation → footer.
3. Nav bar [07:09–08:42]: double-click into the nav component (purple, like a Figma component).
   1. Delete the links.
   2. Swap the template button for your Button Medium from Assets, and the logo for yours.
   3. Remove the frame's fill so the light logo shows.
   4. Padding: left and right 56, top 40.
4. Hero [08:42–12:55]
   1. Delete the template buttons.
   2. Layout: Distribution End (content to the bottom), Alignment Left.
   3. Paste in the copy. Pasted text didn't keep its styles, so apply Body Medium and Heading 1 by hand.
   4. Insert → Video. It lands inside the stack, so set Position Absolute, 0 on every constraint, z-index 0.
   5. Hero height 100vh. Swap in your video asset.
   6. Overlay: fill with the blue style → + Style → Blending: Multiply → Color.
   7. Text width → Fixed, narrowed to match the reference. Text colour → teal style.
   8. Nav bar → Position Absolute, pinned to the top and sides, so it floats over the hero.
5. Cards section [12:55–16:36]
   1. Section: gap 56, padding 56, width Fill, max width 1440. Canvas width → 1440.
   2. Card: a temporary fill to see it, padding 40 on every side, gap 48, radius 56, height 700. Remove the template image and text. Heading → Heading 2. Drag in Button Medium.
   3. Card layout: Alignment Left, Distribution End. Inner content stack: gap 48 (he tried 40). Text width Fill.
   4. Card fill → Image "Card image 1". Name the card "card" and the wrapper "cards". Duplicate it and swap in "Card image 2".
6. CTA section [16:36–18:08]
   1. Text → Heading 1 in blue. Swap in the large button.
   2. No inner content stack here, so set the gap on the outer header wrapper. Padding 56, height 1000.
   3. Drag in the floating images. In a stack they line up, so select them all → Position Absolute → arrange.
   4. Text width Fit → Fixed, narrower, centre-aligned.
7. Footer [18:08–19:42]: enter the component, delete what you don't need, and remove the inner padding and the border. Outer frame: gap 0, padding 56. Max width 1000 → 1440 to match the other sections. Swap in the dark logo. Tablet padding 40, mobile 24. Both use the small logo variant.
8. Tablet [19:42–23:45]: Desktop → + → Tablet. Most of it is already responsive.
   1. Nav: padding 40, logo and button → mobile variants.
   2. Hero: gap 24, padding 40.
   3. Cards: direction Horizontal → Vertical, gap 40, outer padding 40, outermost gap 0.
   4. CTA: gap 40, padding 40, floating images repositioned.
   5. Footer: padding 40, mobile logo variant.
9. Phone [21:00–25:50]
   1. Nav: padding 24. The template nav includes a hamburger with an open state. In that open menu: inner padding 24, a gap, a background fill at 25%, and a bottom border with reduced opacity (value not stated).
   2. He hid the bar's CTA so it only appears in the open menu, admitting it makes no UX sense.
   3. Hamburger lines grey → white, to stand out from the background. A 15% fill behind the lines didn't help, so he removed it.
   4. Header and cards padding and gap adjusted (values not stated). Card height 500 on tablet, then 400 (on phone, implied).
   5. CTA: shorter, images repositioned, gap 32.
10. Preview [25:50–26:20]: check desktop, tablet and phone, including hover states and the mobile menu. He left the close icon's colour unchanged.
11. Text entrance [26:20–27:56]: select the text fields → Effects + → Appear → preset "Slide in from left". It starts at 0% opacity, scales up, and offsets from the left. Spring transition with stiffness, damping and mass raised (values not stated). Second text: delay 0.5 s.
12. Card entrance [27:56–29:57]
   1. Appear, scale in: opacity 0 at the start, scale 0.8 (he tried 0.5 first), 3D rotation Y 10, offset Y 25. More damping and a changed mass (values not stated).
   2. The cards were animating before anyone reached them, so set Trigger → section in view, Viewport → Center.
13. Parallax [29:57–30:58]: floating images → Effects → Scroll speed 140 → too fast → 110. The section was cutting them off, so set its overflow to Visible.

| Element | Desktop | Tablet | Phone |
|---|---|---|---|
| Nav | padding 40 top, 56 sides; desktop variants | padding 40; mobile variants | padding 24; hamburger menu |
| Hero | 100vh, content bottom-left | gap 24, padding 40 | padding adjusted (not stated) |
| Cards section | horizontal, gap 56, padding 56, max 1440 | vertical, gap 40, padding 40 | padding and gap adjusted (not stated) |
| Card | height 700, padding 40, gap 48, radius 56 | height 500 | height 400 (implied) |
| CTA | height 1000, padding 56 | gap 40, padding 40 | shorter, gap 32 |
| Footer | padding 56, max 1440 | padding 40, small logo | padding 24, small logo |

### CSS translation
```css
:root { --pad: 56px; --max: 1440px; }    /* teal, white and blue tokens shown on screen, not stated */
@media (max-width: 1199px) { :root { --pad: 40px; } }   /* breakpoint widths not stated; Framer's 1200/810 defaults (derived) */
@media (max-width: 809px)  { :root { --pad: 24px; } }

.nav { position: absolute; top: 0; inset-inline: 0; z-index: 10;
       display: flex; justify-content: space-between; align-items: center; padding: 40px var(--pad) 0; }   /* 40/56 stated */

/* Hero: video behind, colour-blend tint, copy bottom-left */
.hero { position: relative; isolation: isolate; height: 100vh; height: 100svh;   /* 100vh stated; svh fallback derived */
        display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start;
        gap: 24px; padding: var(--pad); }                                      /* gap 24 is the tablet value; desktop not stated */
.hero video   { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; }
.hero__tint   { position: absolute; inset: 0; background: var(--blue); mix-blend-mode: color; z-index: -1; }   /* Color blend stated */
.hero__copy   { max-width: 640px; color: var(--teal); }                       /* width derived */

/* Cards */
.cards { display: flex; gap: 56px; padding: var(--pad); max-width: var(--max); margin-inline: auto; }
.card  { flex: 1; height: 700px; padding: 40px; border-radius: 56px;           /* stated */
         display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start;
         gap: 48px; background: center / cover no-repeat var(--img); }
@media (max-width: 1199px) { .cards { flex-direction: column; gap: 40px; } .card { flex: none; height: 500px; } }
@media (max-width: 809px)  { .card { height: 400px; } }

/* CTA with floating images */
.cta { position: relative; height: 1000px; padding: var(--pad); display: grid; place-items: center; overflow: visible; }
.cta__copy { max-width: 720px; text-align: center; }                          /* width derived */
.cta__float { position: absolute; }                                           /* placed by hand, positions not stated */
@media (max-width: 809px) { .cta { height: 720px; gap: 32px; } }              /* "shorter" derived, 32 stated */

/* Mobile menu panel */
.menu { padding: 24px; display: grid; gap: 16px;                              /* 24 stated, gap derived */
        background: rgb(255 255 255 / .25);                                   /* 25% stated, colour derived */
        border-bottom: 1px solid rgb(255 255 255 / .3); }                     /* opacity derived */

/* Entrances */
.slide-left { opacity: 0; translate: -40px 0; scale: .95;                     /* offset and scale not stated, derived */
              transition: opacity .6s, translate .8s cubic-bezier(.34,1.56,.64,1), scale .8s; }
.slide-left + .slide-left { transition-delay: .5s; }                          /* 0.5 stated */
.card-in { opacity: 0; transform: perspective(1200px) translateY(25px) rotateY(10deg) scale(.8);   /* 25, 10, 0.8 stated; perspective derived */
           transition: opacity .6s, transform .9s cubic-bezier(.34,1.56,.64,1); }
.is-in.slide-left, .is-in.card-in { opacity: 1; translate: 0 0; scale: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .slide-left, .card-in { transition: none; } }
```
```js
// Trigger "section in view", Viewport "Center": fire when the section reaches the middle of the viewport (derived)
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.querySelectorAll('.slide-left, .card-in').forEach(el => el.classList.add('is-in')); io.unobserve(e.target); }
}), { rootMargin: '-50% 0px -50% 0px' });
document.querySelectorAll('section').forEach(s => io.observe(s));
```
- For scroll speed 110, see the scroll-speed script in the next section with `data-speed="110"`. The hero text uses Appear on load, so in code add `is-in` to it on load rather than waiting for the observer (derived).

### Gotchas
- Pasted text didn't keep its text styles. Reapply them.
- An inserted video joins the stack flow. It needs Absolute, pins at 0 and a z-index behind the copy.
- Floating images in a stack just line up. Make them Absolute.
- The template footer had max width 1000 while every other section had 1440. Match the max widths.
- The light logo disappeared on the template's white nav frame until he removed the fill.
- Hiding the only CTA inside the hamburger menu is bad UX. He did it only to demo the open state.
- Grey hamburger lines on the hero had poor contrast. White fixed it, but he forgot the close icon.
- Appear animations play on load, before the visitor reaches the section. Switch the trigger to in view with viewport Center.
- Scroll speed 140 sent lower images off before their section arrived. Use a smaller boost (110) further down the page.
- Parallax images got clipped by their section until its overflow was set to Visible.
- Each breakpoint needs its own pass: padding, gaps, card heights, image positions and component variants.

### Examples named
- Framer's pre-made Sections (Insert → Sections): nav top bar, hero with a video background, two-card horizontal layout, header, footer.
- Figma to Framer plugin: imports the reference design.

## Make Your Figma Scroll Animation Real in 4 Minutes (Using Framer)
- source: Tim Gabe · https://youtu.be/7drmXMS8Jj8
- type: tool-tutorial
- tags: framer, figma, plugins, parallax, scroll, animation, handoff, workflow

### Takeaways
- A Figma prototype isn't something a client or user can actually use. Porting the frame to Framer turns the same design into a live, publishable page.
- The port is one plugin run: the Figma to Framer plugin copies the layers, and you paste them into Framer.
- After pasting, set the outermost frame's width to match the Figma frame and its height to Fit content. It is then a working, if static, site.
- Scroll speed recreates the Figma parallax. 100 is normal page speed, above 100 moves faster than the scroll, and below 100 lags behind it.
- His layer speeds: images 140, the light or background-blur glow 250, the parallax text 40–50 (moved up a little).
- For more depth, give each image its own speed.

### Recipes
1. Copy out of Figma [00:30–01:31]: select the Desktop (Discover) frame → Resources → Plugins → search "Framer" → run the Figma to Framer plugin, which copies the layers.
2. Paste into Framer [01:31–02:02]: Cmd/Ctrl+V → select the outermost frame → width to match the Figma export (shown on screen, not stated) → height Fit content → Cmd+P to preview. It is ready to publish, but static.
3. Parallax [02:02–03:03]
   1. Select all the images → Effects → Scroll speed 140.
   2. Light or background-blur layer → Scroll speed 250.
   3. Parallax text → Scroll speed 50 or 40, and nudge it up.
   4. Preview: the glow rises fastest, the images rise faster than the page, and the text lags.

### CSS translation
```html
<img data-speed="140" …>  <div class="glow" data-speed="250"></div>  <h2 data-speed="40">…</h2>
```
```js
// Framer Scroll speed → translate. 100 moves with the page, 140 moves 40% faster, 40 lags at 40% of page speed (mapping derived)
const els = [...document.querySelectorAll('[data-speed]')];
let refs = [];
function measure() {
  els.forEach(el => (el.style.translate = ''));
  // Reference scroll is 0 for hero layers (no jump on load) and "centred in the viewport" for lower ones,
  // so lower layers don't drift away before their section arrives (derived)
  refs = els.map(el => { const r = el.getBoundingClientRect();
    return Math.max(0, r.top + scrollY + r.height / 2 - innerHeight / 2); });
  update();
}
function update() {
  els.forEach((el, k) => {
    const factor = (+el.dataset.speed - 100) / 100;
    el.style.translate = `0 ${-(scrollY - refs[k]) * factor}px`;
  });
}
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', measure);
  measure();
}
```
```css
[data-speed] { will-change: translate; }
.discover { overflow: visible; }   /* a clipping parent cuts off the faster layers (derived) */
```
- A CSS-only option for layers in the first screen: an `animation-timeline: scroll(root)` keyframe from `translate: 0 0` to `translate: 0 calc(-0.4 * 100vh)` over `animation-range: 0 100vh` gives speed 140 for the first 100vh of scroll (derived).

### Gotchas
- A pasted frame left at a fixed height won't size to its content. Set it to Fit content.
- Match the outermost width to the Figma frame, or the layout shifts from the prototype.
- One speed on every image looks flat. Vary the speeds per layer for depth.
- Speeds are relative to 100: 140 is faster than the page, and 40 is slower, not "40% faster".

### Examples named
- Figma to Framer plugin: copies Figma layers to paste straight into Framer.
- His earlier Figma parallax tutorial: the source "Discover" animation being ported.
