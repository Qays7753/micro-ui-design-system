## Sticky Scroll Explained in 3 Minutes (Framer Tutorial)
- source: Tim Gabe · https://youtu.be/DRvge30wQFM
- type: tool-tutorial
- tags: framer, scroll, layout, auto-layout

### Takeaways
- He presents sticky scroll as the base effect behind many award-site and Apple product-page animations. Four rules cover it:
  1. Sticky only appears as a Position option when the parent is a stack.
  2. Every parent layer needs overflow Visible, or nothing sticks.
  3. The sticky layer's parent sets the scroll area. The taller the parent, the longer the layer stays stuck.
  4. Sticky behaves like Relative positioning: it keeps its place in the stack flow and pushes its siblings. The only difference is that it sticks.
- Because a sticky layer stays in the flow, a sibling added to the same stack lands beside it, as two relative items would. Mixing sticky with other content means thinking in stacks.
- The page has to grow to hold the scroll area, so set the Desktop frame's height to Fit content.
- Give the sticky layer a top offset so it doesn't stick flush to the viewport edge (value shown on screen, not stated).

### Recipes
1. Setup [01:00–01:55]
   1. Desktop frame → Layout + (it becomes a stack).
   2. Inside it, a new frame that is also a stack, named "scroll container", height 1600px. This parent sets the scroll area.
   3. Desktop height → Fit content, so it wraps the 1600px container.
   4. Overflow Visible on both scroll container and Desktop.
2. Sticky layer [01:55–02:05]: a small frame inside scroll container → Fill: Image → some radius → Position: Relative → Sticky → a top offset (value shown on screen, not stated). In preview it scrolls up, reaches the top and holds there.
3. Content that scrolls past [02:05–02:40]: duplicate the image, set the copy back to Relative and swap its photo. It sits beside the sticky image, just as two relative items would. In preview the sticky image holds while the relative one moves on with the page.

### CSS translation
```css
/* Desktop: a stack whose height is Fit (auto) */
.desktop { display: flex; flex-direction: column; overflow: visible; }

/* The parent sets the scroll area */
.scroll-container {
  display: flex;             /* the two images sit side by side (derived from the demo) */
  gap: 24px;                 /* derived */
  height: 1600px;            /* stated */
  overflow: visible;         /* rule 2 */
  align-items: flex-start;   /* derived: the default stretch makes the item 1600px tall, leaving it no room to stick */
}
.scroll-container .sticky {
  position: sticky;
  top: 40px;                 /* top offset not stated, derived */
  border-radius: 16px;       /* derived */
}
```
- How long it stays stuck in CSS: the parent's height minus the sticky element's height (minus wherever it starts inside the parent). A 400px image in the 1600px container stays stuck for about 1200px of scroll (derived).
- Any ancestor with overflow hidden, auto or scroll becomes the sticky element's scroll box and breaks the effect. If you need clipping, `overflow: clip` clips without breaking sticky (derived).

### Gotchas
- No Sticky option under Position: the parent isn't a stack.
- The layer scrolls away instead of sticking: some parent still has overflow hidden.
- A Desktop frame left at a fixed height won't make room for the 1600px scroll area.
- Sticky doesn't lift the layer out of the flow, so its siblings arrange around it as if it were relative.

### Examples named
- Awwwards (heard as "awards.com"): award sites whose animations rely on sticky scroll.
- Apple product pages: sticky scroll as the base of their scroll animations.

## Framer Scroll Animations For Beginners
- source: Tim Gabe · https://youtu.be/HHnlp_Bj0J4
- type: tool-tutorial
- tags: framer, scroll, animation, parallax, components, variants, auto-layout

### Takeaways
- Framer has four scroll effects, and between them they cover most scroll animation:
  - Scroll speed: the layer moves at a different speed from the page. The page runs at 100, so 150 gives parallax.
  - Scroll animation: one triggered action, such as a fade-in, when a section reaches a set point in the viewport.
  - Scroll transform: properties change continuously with scroll position, from a From state to a To state.
  - Scroll variant: swaps a component's variants as different sections come into view.
- A "Section in view" trigger at Center fires once the section reaches the middle of the viewport. Using Center for both the text fades and the variant swaps keeps them in sync.
- Replay in both directions reverses the effect when you scroll back: text fades out going up and in going down.
- Build one scroll animation, copy the effect, paste it onto the other layers, then point each copy at its own section.
- The layout is a classic scroll story: text sections scroll on one side while a visual sticks 160px from the top on the other, and the visual changes variant for each section.
- Sticky needs overflow Visible on every stack.

### Recipes
1. Hero [00:25–01:30]
   1. Frame: height 100vh, a fill, max width 1200 → Layout + (stack).
   2. Text "scroll animation": larger, Semibold, tighter letter spacing, set on two lines, with reduced line height (values not stated).
   3. Image frame 500×500 with a large radius and a vivid image fill. Position Absolute, centred, placed over the text. Blending: Lighten.
2. Scroll container [01:30–02:55]
   1. Frame → stack, width Fill, max width 1200, a temporary height. Desktop height → Fit. Name it "scroll container".
   2. Inside it, a "text container" (stack, width and height Fill) holding the text "get inspired." at a smaller size. The last word and the full stop get an accent colour.
   3. Duplicate the text container twice. Left-align all three, wrap them in a stack (Fill × Fill), and change each one's copy and accent colour.
3. Icon component [02:55–03:55]
   1. Select the uploaded icons → Add stack, width and height Fit, gap 0.
   2. Make a separate frame the size of one icon and drag the icon stack into it. Add radius and a realistic shadow. Name it "icons".
   3. Create component, then add two variants. In each, shift the icon stack so the second icon, then the third, fills the frame. The frame has to clip so only one icon shows (implied, not stated).
4. Sticky layout [03:55–04:35]
   1. Put a copy of the component into scroll container. Set the direction to Horizontal and align Top.
   2. Component: Position Sticky, top 160.
   3. Every stack: a lighter grey fill and overflow Visible.
5. Scroll speed, for parallax [04:37–05:08]: hero image → Effects + → Scroll speed 150.
6. Scroll animation, a fade-in [05:09–07:10]
   1. Give each text container a Scroll Section: "section 1", "section 2", "section 3".
   2. Text → Effects → Scroll animation → Trigger: Section in view → Section: section 1 → Viewport: Center → Replay: both directions.
   3. Enter and Exit can be set by hand. He uses the "Fade in" preset instead.
   4. Copy the effect, select the other texts → Paste effects, then change their sections to 2 and 3.
7. Scroll transform, a growing headline [07:11–08:14]: hero text → Effects → Scroll transform → On scroll. From: opacity 1, scale 1. To: scale 2. Add a transition (settings not covered).
8. Scroll variant [08:15–09:20]: component → Effects → Scroll variant → Trigger: Section in view, Center, Replay yes. Skip the variant list and map the Sections instead: section 1 → variant 1, section 2 → variant 2, section 3 → variant 3.

### CSS translation
```css
.hero { position: relative; height: 100vh; max-width: 1200px; margin-inline: auto;
        display: flex; align-items: center; justify-content: center; }
.hero__img { position: absolute; inset: 0; margin: auto; width: 500px; height: 500px;   /* 500 stated */
             border-radius: 48px; /* derived */ object-fit: cover; mix-blend-mode: lighten; }
/* Centred with inset + margin so translate stays free for the parallax (derived) */

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: scroll()) {
    /* Scroll speed 150: the image travels an extra 50% of the scroll distance (derived) */
    .hero__img   { animation: speed150 linear both; animation-timeline: scroll(root); animation-range: 0 100vh; }
    @keyframes speed150 { to { translate: 0 -50vh; } }
    /* Scroll transform: scale 1 → 2 across the hero's height (range derived) */
    .hero__title { animation: grow linear both; animation-timeline: scroll(root); animation-range: 0 100vh; }
    @keyframes grow { from { opacity: 1; scale: 1; } to { scale: 2; } }
  }
}

/* Sticky scroll story */
.scroll-container { display: flex; align-items: flex-start; max-width: 1200px; margin-inline: auto; overflow: visible; }
.sections { flex: 1; }
.text-section { min-height: 100vh; display: flex; align-items: center; }   /* section height not stated, derived */
.text-section .title { opacity: 0; transition: opacity 600ms ease; }      /* "Fade in" preset timing not stated, derived */
.text-section.in-view .title { opacity: 1; }

.icons { --w: 240px; /* derived */ position: sticky; top: 160px; /* stated */ width: var(--w); aspect-ratio: 1;
         overflow: hidden; border-radius: 24px; box-shadow: 0 24px 48px rgb(0 0 0 / .15); /* derived */ }
.icons .strip { display: flex; translate: calc(var(--i, 0) * -1 * var(--w)) 0;
                transition: translate 500ms cubic-bezier(.34,1.56,.64,1); }  /* spring stand-in, derived */
.icons .strip img { flex: 0 0 var(--w); }
@media (prefers-reduced-motion: reduce) { .icons .strip { transition: none; } }
```
```js
// "Section in view → Center": a zero-height line across the middle of the viewport (derived)
const icons = document.querySelector('.icons');
const io = new IntersectionObserver(entries => {
  for (const e of entries) {
    e.target.classList.toggle('in-view', e.isIntersecting);                       // scroll animation, replays both ways
    if (e.isIntersecting) icons.style.setProperty('--i', e.target.dataset.index);  // scroll variant: section n → variant n
  }
}, { rootMargin: '-50% 0px -50% 0px' });
document.querySelectorAll('.text-section').forEach((s, n) => { s.dataset.index = n; io.observe(s); });
```

### Gotchas
- If you don't re-point the pasted effects, every text fires on section 1.
- A section can't be picked as a trigger until its container has a Scroll Section.
- Sticky fails if any stack keeps overflow hidden.
- The Desktop height must be Fit so it contains the scroll container.
- A scroll animation is one triggered action, while a scroll transform tracks the scroll the whole time. Use a transform for growth tied to scroll position and an animation for entrances.
- He skips the scroll-transform transition settings, so the smoothing is left for you to tune.

### Examples named
- none named

## Framer Components For Beginners (Netflix Carousel)
- source: Tim Gabe · https://youtu.be/13OKVxg6ecI
- type: tool-tutorial
- tags: framer, components, variants, states, carousel, cards, buttons, icons, micro-interaction

### Takeaways
- The video builds component skills in layers (states, then variants, then variables, then nesting) and ends with a carousel.
- Components are listed under Assets in the left sidebar. The breadcrumb takes you back to the canvas, and double-clicking an instance opens its component.
- States (Hover, Pressed) can only change layers that already exist in the Primary state. You can't add a layer inside a state, so build everything in Primary and hide or move it there.
- Demo state values: Hover opacity 0.5, Pressed 0.25.
- Variants are different versions of one component, for example an accordion open or closed, or a version for each device.
- Icon-only variant: delete the label, set a fixed 56×56 with the aspect ratio locked, and give it enough radius to stay a circle. He adds its Hover (0.5) and Pressed (0.25) states again.
- Variables put controls on every instance: show/hide toggles, colours, images and so on. Here an "icon" variable on the icon name and an "icon color" variable let each instance pick its own glyph and colour.
- Nesting: a component placed inside another keeps its own states. The play button still reacts to hover inside a card that is itself hovering.
- Netflix-style card hover: a dark gradient overlay fades from 0 to 100%, and the title and play button slide up into the card from outside it.
- Framer's built-in Carousel only needs its slots connected to the cards and its height set to Fit content.

### Recipes
1. Button component [00:24–01:00]: text "click me" → wrap in a stack, Fit content, padding (value not stated). Insert → search "material" → Material icon, made smaller. Round the button. Right-click → Create component → "button".
2. States [01:00–02:03]: below Primary, + → Hover: opacity 0.5. + → Pressed: opacity 0.25. Preview with Cmd/Ctrl+P.
3. Icon-only variant [02:03–03:07]
   1. With Primary selected, + Variant.
   2. Delete the text with Backspace.
   3. Width and height Fixed, height 56 to match the width, aspect lock on.
   4. More radius.
   5. Add Hover 0.5 and Pressed 0.25 again.
4. Instances [03:07–03:35]: drag the component in from Assets. The right panel switches the variant and edits the label.
5. Variables [03:37–04:38]: in the component, select the icon → Name field → + → Create variable "icon". Color → + → Create variable "icon color". Instances now show an icon dropdown and an icon colour field.
6. Movie card [04:38–06:15]
   1. Wrap the poster image in a stack and put the radius on the stack.
   2. A frame "overlay" above it: Position Absolute, centred, pinned to all sides. Fill: a dark linear gradient with the top stop at 0% opacity.
   3. Text "title" inside the overlay: white, Medium, larger, pinned to the sides and bottom.
   4. A button instance inside the overlay, pinned to the sides. Set it to Variant 2, icon "play arrow", icon colour black, size 32px. It isn't clear whether the 32 applies to the icon or the whole button.
   5. Create component → "movie card".
7. Card hover [06:15–06:47]
   1. Primary: push the title and play button outside the card frame, and set the overlay to 0% opacity.
   2. + Hover: overlay at 100%, title and button moved back up into the frame.
8. Carousel [06:47–08:00]
   1. On the main canvas, Insert → Carousel, pinned to the sides.
   2. Duplicate the card until there are 5, and change each one's image and title.
   3. Connect each carousel slot (the dots) to a card.
   4. Carousel height → Fit content.

### CSS translation
```css
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 9999px; /* gap, padding, radius derived */
       transition: opacity 150ms ease; /* derived */ }
.btn:hover  { opacity: .5; }    /* stated */
.btn:active { opacity: .25; }   /* stated */
.btn .icon  { color: var(--icon-color, currentColor); }   /* the "icon color" variable */
.btn--icon  { inline-size: 56px; aspect-ratio: 1; padding: 0; justify-content: center; border-radius: 50%; }  /* 56 stated */
.btn--icon .btn__label { display: none; }

/* Movie card: hover or keyboard focus reveals the overlay */
.card { position: relative; overflow: hidden; border-radius: 12px; /* derived */ }
.card img { display: block; width: 100%; }
.card__overlay { position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 16px;   /* derived */
                 background: linear-gradient(to bottom, rgb(0 0 0 / 0), rgb(0 0 0 / .85));      /* end opacity derived */
                 opacity: 0; transition: opacity 300ms ease; }                                   /* timing derived */
.card__meta { color: #fff; font-weight: 500;                                       /* white, Medium stated */
              translate: 0 calc(100% + 16px);                                       /* parked below the card */
              transition: translate 450ms cubic-bezier(.34,1.56,.64,1); }           /* spring stand-in, derived */
.card:is(:hover, :focus-within) .card__overlay { opacity: 1; }
.card:is(:hover, :focus-within) .card__meta    { translate: 0 0; }
.card .btn--icon .icon { inline-size: 32px; color: #000; }   /* 32 and black stated */

/* Carousel: a scroll-snap row */
.carousel { display: flex; gap: 16px; /* derived */ overflow-x: auto; scroll-snap-type: x mandatory;
            overscroll-behavior-x: contain; padding-block: 8px; /* derived, see below */ }
.carousel > .card { flex: 0 0 clamp(160px, 22vw, 260px); /* derived */ scroll-snap-align: start; }
@media (prefers-reduced-motion: reduce) { .card__overlay, .card__meta { transition: none; } }
```
- Setting overflow-x to auto also clips vertically. That is the CSS version of his "carousel height Fit or it clips the cards": leave block padding for any hover lift or shadow (derived).

### Gotchas
- Adding a new layer while editing Hover doesn't work, because states only change existing layers.
- A new variant starts without the Primary's states. He re-adds Hover and Pressed on it (implied, not stated as a rule).
- A carousel with a fixed height clips the cards. Set it to Fit content.
- The overlay must be absolute and pinned on all sides to cover the poster at any size.
- Pin the title and button so they hold their place when the card resizes.
- The parked title and button only stay hidden if the card frame clips its content (implied, not stated).

### Examples named
- Netflix: the poster carousel with a hover reveal (gradient, title, play button) that he recreates.
- Material icons: Framer's built-in icon set, found by searching "material" in Insert.
- Framer's Carousel component, from the Insert menu.

## Card Layouts in Framer (Grid Tutorial)
- source: Tim Gabe · https://youtu.be/udTGvssp-h8
- type: tool-tutorial
- tags: framer, grid, cards, layout, responsive, breakpoints, auto-layout

### Takeaways
- Build the card first, with stacks and deliberate sizing, so it keeps its shape once it's placed in a grid.
- Card sizing:
  - the card stack: height Fit, width Fixed,
  - the image: width Fill, a fixed height,
  - the text container: width Fill, height Fit, with padding,
  - the card's gap at 0, so the image meets the text block and the padding spaces the text.
- Text hierarchy inside the card: the headline is Medium and larger, and the body is smaller with reduced opacity. Both sit left-aligned in a stack with a small gap.
- The grid is a frame inside the Desktop stack. Desktop gets a light grey background and the grid has no fill.
- Set Fit on three heights: the Desktop, the grid, and the grid's row height (in its advanced settings). Leave any of them Fixed and the cards get squashed or cut off.
- Grid gap 24, padding 24.
- Columns per row: he shows 3, 2 and 1. A mapping of desktop 3, tablet 2, phone 1 is implied, not stated.
- Span: a card can span 2 columns. With 3 columns per row and a couple of cards spanning 2, the grid becomes a bento layout.
- No minimum column width is set in the video. The columns are a fixed count per breakpoint.

### Recipes
1. Card [00:20–01:40]
   1. Frame with radius, named "card". Inside it, a frame named "image".
   2. Two text fields: "headline" (Medium, larger) and "body" (smaller, some opacity). Select both → stack, left-aligned, gap reduced, named "text container".
   3. Card → Layout + (stack): height Fit content, width Fixed.
   4. Image: width Fill, height a fixed number (value not stated).
   5. Text container: width Fill, padding (value not stated), height Fit content.
   6. Card gap → 0. Swap in a real image.
2. Grid [01:40–02:35]
   1. Desktop → Layout + (stack), with a slightly grey background.
   2. A frame inside Desktop → turn it into a Grid, remove its fill.
   3. Copy the card, select the grid, paste the cards in.
   4. Desktop height Fit, grid height Fit.
   5. The cards come out squashed: grid → advanced settings → row height Fixed → Fit content.
   6. Gap 24, padding 24.
3. Breakpoints [02:35–02:55]: Desktop + → Tablet, then Tablet + → Phone. Select the grid at each breakpoint and set the columns per row (he cycles through 3, 2 and 1).
4. Bento [02:55–03:15]: select a card → Span 2. Set the grid to 3 columns per row, then set the last card to span 2 as well.

### CSS translation
```css
.page { display: flex; flex-direction: column; background: #f4f4f4; }   /* "slightly grey", value derived */

.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-auto-rows: auto;      /* row height Fit content; a fixed px value here is what squashed the cards */
        gap: 24px; padding: 24px; }   /* 24 stated */

.card { display: flex; flex-direction: column; gap: 0;                       /* gap 0 stated */
        border-radius: 16px; overflow: hidden; background: #fff; }           /* radius and fill derived */
/* In CSS, let the grid cell size the card. The Fixed width only matters outside a grid (derived). */
.card__image { width: 100%; height: 200px; object-fit: cover; }             /* "a number", value derived */
.card__text  { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 16px; }  /* derived */
.card__headline { font-weight: 500; }                                       /* Medium stated */
.card__body     { opacity: .6; }                                            /* "some opacity", value derived */
.span-2 { grid-column: span 2; }

/* Framer's default breakpoints: tablet 810–1199, phone under 810 (not stated in the video, derived) */
@media (max-width: 1199px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 809px)  { .grid { grid-template-columns: 1fr; } .span-2 { grid-column: auto; } }

/* Fluid alternative with no breakpoints (derived): as many columns as fit at 280px or wider */
.grid--auto { grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr)); }
```
- In a one-column grid, `grid-column: span 2` creates an extra implicit column and overflows the page. Reset it at the one-column breakpoint. With auto-fill, guard spans with a container or media query (derived).
- `minmax(0, 1fr)` stops a long word or a wide image from stretching its column (derived).

### Gotchas
- A Fixed row height in the grid squashes the cards. Change it to Fit content in the grid's advanced settings.
- Leave the Desktop or the grid at a fixed height and the grid gets cut off.
- He sets up the card's sizing (Fill image with a fixed height, Fill/Fit text block) because a card without it breaks once it's inside the grid.
- Remove the card's gap, or a strip of space opens between the image and the text.

### Examples named
- none named. Bento layout is named as the result of mixing spans, not as a reference.

## Framer Breakpoints in 7 Minutes (Beginner Tutorial)
- source: Tim Gabe · https://youtu.be/rEjd7QRxtDY
- type: tool-tutorial
- tags: framer, breakpoints, responsive, layout, auto-layout

### Takeaways
- This transcript is a translated audio track. "Indentation" reads as gap or padding, "adjustment" as Fit content, and "anchor" as a pin.
- Responsive layouts start with stacks everywhere, including the Desktop frame itself.
- Use a plain frame, not a stack, when elements overlap, like a caption over a video. A stack would push the caption below the video. A frame also lets the caption scale with the device width.
- Change the text and image widths from Fixed to Fill so they shrink with the viewport.
- Overlay caption: pinned to the bottom at 24px with width Relative 100%, so it scales with the device and stays on the bottom edge.
- Text container: width Fill, height Fit, so its height follows the wrapped text.
- Wrap only works on children with a Fixed width. Fill children just shrink. For a row that wraps, give the items fixed widths (400px and 250px in the demo) and turn Wrap on.
- Change the Desktop height from Fixed to Fit content, or content spills past the frame.
- Desktop is the primary breakpoint: its changes flow down to tablet and phone. A change made on tablet stays on tablet as an override. Right-click to push it up to the primary (heard as "refresh main") or choose "Reset override" to undo it.
- When something overflows, walk the layer tree and check what each layer is (he reads it as "frame, stack, stack, frame").
- Test by zooming the preview as well as resizing frames. The zoom exposed a video with a wrong left pin.

### Recipes
1. Structure [00:20–01:30]: select the text elements → Add stack. Select the images → Add stack. Select the top video and its caption → Add frame (not a stack, because they overlap).
2. Fill and pin [01:30–02:00]
   1. Text and images: width Fixed → Fill. Adjust the image stack's gap (value not stated).
   2. Caption: pinned to the bottom at 24px, width Relative 100%.
3. Fixing overflow at narrow widths [02:00–03:45]
   1. Desktop → Layout + (stack).
   2. Text container: width Fixed → Fill, height Fit.
   3. Image container: Wrap on, height Fit, width Fill.
   4. Desktop height: Fixed → Fit content.
4. A row that wraps [03:45–04:35]: wrap needs fixed child widths. Set one set of elements to 400px and the images to 250px, and make sure Wrap is on in the text container. The items now flow onto new rows. The other route is to keep the items at Fill and restack them at breakpoints.
5. Tablet breakpoint [04:35–05:55]
   1. Add Tablet. Image stack direction → Vertical, and add padding.
   2. The change doesn't show on Desktop, because Desktop is the parent. Push it up (heard as "refresh main") or Reset override.
   3. Text container direction → Vertical, padding on the left and right only (top and bottom removed).
   4. Select all the images → max width 500px.
   5. Back on Desktop, give the containers side padding only.
6. Phone breakpoint [05:55–06:37]: add Phone from the tablet. It already looks close. Shorten the video, adjust the container spacing, and set the gap to 24.
7. The zoom bug [06:37–07:10]: zooming in the preview made the video overflow. The video frame was width Fill with a fixed height, and its left pin wasn't 0. Setting left to 0 fixed it.

| Breakpoint | Width | What changes |
|---|---|---|
| Desktop (primary) | not stated (Framer default 1200, derived) | Stacks everywhere, Fill widths, Wrap on the rows, side padding only. Changes here flow down. |
| Tablet | not stated (Framer default 810, derived) | Image stack and text container go Vertical, side padding, images max width 500. |
| Phone | not stated (Framer default 390, derived) | Shorter video (value not stated), spacing tweaks, gap 24. |

### CSS translation
```css
/* Desktop first: the base styles are Desktop (the primary) and max-width queries are the overrides,
   matching his desktop-down cascade (derived) */
.page { display: flex; flex-direction: column; }   /* Desktop as a stack; height auto = Fit */

/* Caption over video: a positioned frame, not a flex stack */
.video-wrap { position: relative; height: 640px; /* fixed, value not stated, derived */ overflow: hidden;
              container-type: inline-size; }
.video-wrap video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }  /* left: 0 is the pin he fixed */
.video-wrap .caption { position: absolute; left: 0; bottom: 24px; width: 100%;   /* 24 and 100% stated */
                       font-size: 12cqi; }                                        /* scales with width, derived */

/* Rows that wrap: wrapping needs fixed item widths */
.text-row, .image-row { display: flex; flex-wrap: wrap; gap: 24px; padding-inline: 32px; }   /* side padding only; values derived */
.text-row > *     { flex: 0 0 400px; max-width: 100%; }   /* 400 stated */
.image-row > img  { flex: 0 0 250px; max-width: 100%; }   /* 250 stated */

/* The other route: Fill items that never wrap, restacked at breakpoints */
.row--fill > * { flex: 1 1 0; min-width: 0; }   /* min-width: 0 lets Fill items shrink below their content (derived) */

@media (max-width: 1199px) {   /* tablet, Framer default 810–1199 (derived) */
  .text-row, .image-row { flex-direction: column; }
  .text-row > *, .image-row > img { flex: none; width: 100%; }
  .image-row > img { max-width: 500px; }   /* 500 stated */
}
@media (max-width: 809px) {    /* phone. It also gets the tablet rules above, like his phone built from tablet (derived) */
  .video-wrap { height: 420px; }            /* "shorten the video", value derived */
  .text-row, .image-row { gap: 24px; }      /* 24 stated */
}
```
- In CSS, flex-basis follows the direction. After a switch to column, `flex: 0 0 400px` sets a 400px height, so reset the items to `flex: none` at the breakpoint where the row turns vertical (derived).
- Flex wrap behaves like Framer's: items with `flex: 1 1 0` never wrap, they only shrink. Wrapping only happens when the items have a real basis width (derived).

### Gotchas
- Putting overlapping content in a stack pushes the overlay under the video. Use a frame.
- If Desktop isn't a stack, or keeps a fixed height, content runs past the frame as it narrows.
- A text container with a Fixed width overflows. Use Fill width and Fit height.
- Wrap does nothing for Fill children. They shrink instead of moving to a new row.
- A change made on tablet won't reach desktop, because desktop flows down and not up. Push it up, or reset the override if it was a mistake.
- A video with a wrong left pin overflowed only when zoomed in. Pin it at left 0 and check the preview at several zoom levels.

### Examples named
- none named
