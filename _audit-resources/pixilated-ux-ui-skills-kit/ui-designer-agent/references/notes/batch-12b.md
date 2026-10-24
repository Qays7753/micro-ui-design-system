## 5 Most Useful Figma Animations For UI Beginners
- source: Tim Gabe · https://youtu.be/2Mvmz34QsLQ
- type: tool-tutorial
- tags: figma, prototyping, smart-animate, variants, components, states, animation, micro-interaction, buttons, cards, carousel, loading, gestures

### Takeaways
- Five Figma prototype triggers cover most beginner UI motion. Each has a typical job:
  - On click: navigation.
  - While hovering: buttons, links and cards.
  - On drag: carousels and sliders.
  - After delay: loading states.
  - Open overlay: popovers, modals and dropdowns.
- The structure rule behind all five: build each interactive piece (button, link, dot loader) as a component set whose variants carry their own interactions. Then nest instances inside bigger components. The nested interaction keeps working, so a card can have its own hover while the button inside it has a different one.
- Almost every effect is one property changing between two variants or frames, with Smart animate in between: swap two positions, grow a clip frame's height, widen a fill, or move and fade a layer.
- A reveal is a mask, not a moving image. A clip-content frame grows from 1 px tall to the full card height while the image inside stays put.
- Timings he states:
  - Page swap: Smart animate, 800 ms, with a preset heard as "general" (most likely Figma's Gentle spring).
  - Button hover: Ease in, 300 ms.
  - Card reveal: a custom spring (values not stated).
  - Carousel and slider drags: Ease out, 300 ms.
  - Loader dots: After delay 1 ms, then Ease out 300 ms per step, looping.
  - Loading button: On click Ease out 300 ms, then back to default after a 2000 ms delay with the same easing.
  - Modal: Move in from the bottom (duration not stated).
  - Dropdown: Dissolve, Ease out, 150 ms. Its links hover to 50% opacity, Ease out, 150 ms.

### Recipes
1. Click: page swap [01:03–03:43] (Figma, Prototype tab)
   1. One frame holds two child frames, Page 1 and Page 2, each with a text layer and an image (plus a knob at the top whose role isn't explained).
   2. Duplicate the whole frame. In copy A, Page 1 sits in the centre and Page 2 sits outside the visible frame. In copy B the two swap places.
   3. On the "Page 2" link in A: On click → Navigate to B → Smart animate → Gentle (heard "general") → 800 ms. In B, the "Page 1" link goes back to A with the same settings.
2. Hover: button, then card [03:43–07:51]
   1. Button: design the default, duplicate it, restyle the copy as hovered, select both → Create component set.
   2. On the default variant: While hovering → Change to Hovered → Smart animate → Ease in (heard "easy in") → 300 ms.
   3. Card: a component set with two variants. The card frame has Clip content on, and holds an "image clip" frame with the image inside. In the default variant the image clip is 1 px tall at the card's edge. In the hover variant its height covers the full card. The image itself is identical in both.
   4. On the card default: While hovering → Change to the hover variant → Smart animate → Custom spring (tune by eye, values not stated).
   5. Drop a button instance into the card. Its own hover still fires when the pointer reaches it.
3. Drag: carousel [07:51–10:29]
   1. A component set with three variants of the card row (an auto layout): centre card in view, right card in view, left card in view.
   2. On the auto layout in the centre variant: On drag → Change to Right → Smart animate → Ease out → 300 ms. Add a second drag interaction from the centre to Left with the same settings.
   3. The Right and Left variants each get one drag interaction, back to the centre only. You can't jump side to side; you pass through the middle.
4. Drag: slider [10:29–12:01]
   1. Two variants, empty and full. The track is a rounded frame with Clip content. Inside it, a progress fill (white) is 0 wide in the empty variant and full width in the full one. An emoji knob sits left in one and right in the other.
   2. On the emoji: On drag → Change to Full → Smart animate → Ease out → 300 ms.
5. Delay: loading button [12:01–16:16]
   1. Loader component set: three variants of three ellipses, with the dot positions changed in each (positions shown on screen, not stated).
   2. Variant 1 → 2: After delay 1 ms → Smart animate → Ease out → 300 ms. Then 2 → 3 and 3 → 1 with the same settings. Once placed anywhere, it loops forever.
   3. Button component set: an auto layout button whose children are absolutely positioned. "Click me" is centred, a "Loading" label is parked below the button outside its bounds, and the loader instance is at 0 opacity.
   4. Loading variant: "Loading" moves up into the centre, "Click me" moves up and out of the top, and the loader rises a few pixels and goes to 25 opacity (as heard).
   5. Default: On click → Change to Loading → Smart animate → Ease out → 300 ms. Loading: After delay 2000 ms → Change to Default → Smart animate → Ease out → 300 ms.
6. Overlay: modal and dropdown [16:16–19:19]
   1. Modal/popover: on the button, On click → Open overlay → target a frame or auto layout → position Centre (or Manual to place it yourself) → Close when clicking outside: on → Add background behind overlay: on (this gives the dimming for free) → animation Move in, from the bottom.
   2. Dropdown: On click → Open overlay → Manual position → no background → Dissolve → Ease out → 150 ms.
   3. Dropdown items: a link component set whose hover variant is at 50% opacity, with While hovering → Change to → Smart animate → Ease out → 150 ms. Nest the link instances inside the dropdown so each item keeps its hover.

### CSS translation
```html
<div class="pager"><section class="pg pg--1">…</section><section class="pg pg--2">…</section></div>

<article class="card">
  <div class="card__clip"><img src="…" alt=""></div>
  <h3>…</h3>
  <button class="btn">Click me</button>
</article>

<div class="carousel"><article>…</article><article>…</article><article>…</article></div>

<button class="btn-load" type="button">
  <span class="idle">Click me</span>
  <span class="busy">Loading <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span></span>
</button>

<dialog class="sheet"><div class="sheet__body">…</div></dialog>
```
```css
/* 1 Click: page swap. Both pages sit in one clipping frame and only their positions change */
.pager { position: relative; overflow: hidden; }
.pg { position: absolute; inset: 0; transition: translate 800ms cubic-bezier(.22,1,.36,1); } /* 800 ms stated; curve is a stand-in for the spring (derived) */
.pg--2 { translate: 100% 0; }                              /* which side it waits on is derived */
.pager.is-p2 .pg--1 { translate: -100% 0; }
.pager.is-p2 .pg--2 { translate: 0 0; }

/* 2 Hover: the mask grows, the image never moves; the nested button keeps its own hover */
.card { position: relative; overflow: hidden; }
.card__clip { position: absolute; inset: 0; clip-path: inset(calc(100% - 1px) 0 0 0);   /* 1 px start stated; bottom edge derived */
  transition: clip-path 600ms cubic-bezier(.22,1,.36,1); }  /* spring values not stated; stand-in derived */
.card:is(:hover, :focus-within) .card__clip { clip-path: inset(0); }
.card__clip img { width: 100%; height: 100%; object-fit: cover; }
.card > :not(.card__clip) { position: relative; z-index: 1; } /* text and button stay above the revealed image (derived) */
.btn { transition: background-color 300ms ease-in, color 300ms ease-in; }   /* Ease in 300 ms stated */

/* 3 Drag: on the web, scroll snapping gives the centre/left/right states natively (derived) */
.carousel { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; } /* gap derived */
.carousel > * { flex: 0 0 min(80%, 360px); scroll-snap-align: center; }      /* derived */

/* 4 Delay: loading button. Labels share one grid cell, parked above and below */
.btn-load { display: inline-grid; overflow: hidden; }       /* the button clips the parked labels */
.btn-load > span { grid-area: 1 / 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; /* gap derived */
  transition: translate 300ms ease-out; }                   /* Ease out 300 ms stated */
.btn-load .busy { translate: 0 110%; }                      /* "Loading" waits below (distance derived) */
.btn-load .dots { display: inline-flex; gap: 3px; opacity: 0; translate: 0 4px; /* "a few pixels" = 4 (derived) */
  transition: opacity 300ms ease-out, translate 300ms ease-out; }
.btn-load.is-busy .idle { translate: 0 -110%; }
.btn-load.is-busy .busy { translate: 0 0; }
.btn-load.is-busy .dots { opacity: .25; translate: 0 0; }    /* 25 as heard */
.dots i { display: block; width: 4px; height: 4px; border-radius: 50%; background: currentColor; /* size derived */
  animation: hop 900ms ease-out infinite; }                 /* 3 variants × 300 ms (derived) */
.dots i:nth-child(2) { animation-delay: 300ms; }
.dots i:nth-child(3) { animation-delay: 600ms; }
@keyframes hop { 0%, 66%, 100% { translate: 0 0; } 33% { translate: 0 -3px; } } /* dot positions shown on screen only; hop derived */

/* 5 Overlay: the modal moves in from the bottom over a dimmed backdrop; the dropdown dissolves */
.sheet { padding: 0; transition: translate 300ms ease-out, opacity 300ms ease-out; }   /* duration not stated (derived) */
@starting-style { .sheet[open] { translate: 0 48px; opacity: 0; } }                   /* derived */
.sheet::backdrop { background: rgb(0 0 0 / .4); }          /* "Add background behind overlay"; tint derived */
.menu { opacity: 0; visibility: hidden; transition: opacity 150ms ease-out, visibility 150ms; } /* Dissolve, Ease out 150 ms stated */
.menu.is-open { opacity: 1; visibility: visible; }
.menu a { transition: opacity 150ms ease-out; }             /* stated */
.menu a:hover { opacity: .5; }                              /* 50% stated */

@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after { transition-duration: 1ms !important; animation: none !important; }
}
```
```js
// Loading button: the Figma demo returns after a fixed 2000 ms; a real build returns when the work finishes (derived)
btn.addEventListener('click', async () => {
  btn.classList.add('is-busy'); btn.setAttribute('aria-busy', 'true');
  await doWork();
  btn.classList.remove('is-busy'); btn.removeAttribute('aria-busy');
});
// "Close when clicking outside": a click on the backdrop targets the dialog itself (content sits in .sheet__body)
sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
```
- To match a Figma custom spring exactly, convert its stiffness, damping and mass with the spring → `linear()` helper in "The Secret Trick For Amazing Animations in Figma" (batch-11a).

### Gotchas
- Building hover states straight into each screen instead of as component sets. You lose reuse, and you can't nest one interaction inside another.
- A two-way carousel needs one drag interaction per direction out of the middle state. The side states only lead back to the middle.
- Masks and fills only work when the parent frame has Clip content on.
- Smart animate pairs layers by name across the two states, so keep names identical. Renamed layers just cross-fade (our note).
- The 2000 ms return on the loading button is a demo timer. In production, tie it to the real request (our note).
- A two-variant slider only snaps between empty and full. A real slider needs continuous input, such as `<input type="range">` (our note).
- The dropdown uses Manual position and no background; the modal uses Centre with a background. Mixing those up makes a dropdown feel like a modal.

### Examples named
- None beyond Figma's own prototype features (Smart animate, variant-level interactions on component sets, Open overlay).

## Export Figma Text & Color Styles To Framer
- source: Tim Gabe · https://youtu.be/TWumjDt_cZg
- type: tool-tutorial
- tags: framer, figma, typography, colour, design-system, tokens, breakpoints, responsive, plugins, workflow

### Takeaways
- Styles give you one source of truth: define a text or colour once, reuse it everywhere, and edit it in one place.
- Collect every text size from every breakpoint (desktop, tablet, mobile) before porting, including the small ones: links, button labels, body. Skip none.
- Collect colours the same way: colour-pick each one onto a circle (card backgrounds, text colours, buttons), including gradients. His set was a white, a black and a linear gradient for a button.
- Build a style guide frame in Figma: rename the text samples by hierarchy (display → headings → body), wrap everything in one auto layout, and separate the groups with divider lines. Then export that one frame with the Framer plugin.
- In Framer, a text style holds a size per breakpoint, which is the big difference from Figma.
- Each breakpoint's Min width in the text style must match your page breakpoints: 1440 for Desktop (his frame width) and 810 for Tablet. You can leave the Phone one alone. A mismatch makes the font jump oddly when the preview is resized.
- His Display 1 (Satoshi Bold, white):
  - Desktop: size 300, letter spacing -15, line height 1.2.
  - Tablet: size 200, letter spacing -10, line height 1.2.
  - Phone: size 96, letter spacing -1.92 (line height not restated).
  - That works out to -5% tracking on Desktop and Tablet and -2% on Phone (derived).
- Colour styles are Shared colors in Framer. Editing one from any place that uses it updates every use.
- Order of work: styles first, then components.

### Recipes
1. Collect in Figma [00:30–02:01]: copy one sample of every text size from each breakpoint frame and paste it outside the frames. Colour-pick each colour onto a circle.
2. Style guide [02:01–03:03]: rename the samples (Display 1, Display 2, Heading 1 … Body) → select all → auto layout → add divider lines between groups → select the frame → Framer plugin → copy layers.
3. Framer page [03:03–04:33]
   1. New page "Style guide". Set the Desktop frame width to 1440 to match the other pages.
   2. Paste. Change the frame background so the samples are visible. Frame height: Fit. Inner auto layout width: Fill.
   3. Add breakpoints: + Tablet, + Phone. The pasted text is still not responsive; it's only a Figma reference.
4. Text style [04:33–07:37]
   1. Assets → Styles → + → Text style → name it "Display 1". Ignore Framer's pre-made styles.
   2. Font: switch from Web (the Google Fonts library) to Custom → Upload if needed → Satoshi Bold. Default colour: white.
   3. Breakpoints: Large Min width = 1440 and Medium (Tablet) = 810, matching the page breakpoints.
   4. Sizes: Large 300 / -15 / 1.2 → Medium 200 / -10 / 1.2 → Small 96 / -1.92 letter spacing.
   5. Repeat for every text size (he shows Display 2 and Heading 1 the same way).
5. Apply [07:37–08:11, 09:47–10:48]: delete the reference copies, then apply the style to the real text (Style → Display 1). It now changes size at each breakpoint. On Home, add Tablet and Phone versions, then set each heading's style (Display 2, Heading 1); it applies across all sizes at once.
6. Colour styles [08:11–09:47]: Fill → change the dropdown from Presets to Shared colors → Create → name it (e.g. "Black") → Create. Pick it from Shared colors in any colour field. Edit → the change applies everywhere it's used.

### CSS translation
```css
/* Framer text style with breakpoints = one class with media queries, phone first.
   Breakpoints stated: Desktop 1440, Tablet 810 */
@font-face { font-family: "Satoshi"; src: url(/fonts/Satoshi-Bold.woff2) format("woff2"); font-weight: 700; font-display: swap; } /* path derived */
:root { --white: …; --black: …; }      /* Framer Shared colors = custom properties; values shown on screen, not stated */

.display-1 { font: 700 96px/1.2 "Satoshi", sans-serif; letter-spacing: -1.92px; color: var(--white); } /* Phone: 96 / -1.92 stated; 1.2 carried over */
@media (min-width: 810px)  { .display-1 { font-size: 200px; letter-spacing: -10px; } }   /* Tablet stated */
@media (min-width: 1440px) { .display-1 { font-size: 300px; letter-spacing: -15px; } }   /* Desktop stated */

/* Same tracking in em, so it scales with the size (derived): -0.05em on Tablet and Desktop, -0.02em on Phone */
```
- Change `--black` once and every element using it updates, which is the same behaviour as editing a Shared color.

### Gotchas
- Skipping a "small" text size (links, button labels) leaves unstyled text you'll hit later.
- A text-style Min width that doesn't match the page breakpoint (1440 / 810) makes text resize at the wrong widths.
- Pasted Figma text is a static reference. It only becomes responsive once a Framer text style is applied.
- Custom fonts must be uploaded under Custom. The Web list is only Google Fonts.
- He collects a gradient but only shows solid colours becoming Shared colors. How the gradient is stored isn't shown.

### Examples named
- Satoshi: the custom font uploaded for his display styles.
- Figma to Framer plugin: copies the style guide frame across.

## From Figma to Framer (Get Started in 28 Minutes)
- source: Tim Gabe · https://youtu.be/XLWXztyA80Q
- type: tool-tutorial
- tags: framer, figma, workflow, layout, auto-layout, responsive, breakpoints, cms, components, typography, shadows, scroll, accessibility, handoff

### Takeaways
- Framer builds a live website, so many settings carry their CSS names (Overflow, Wrap, Relative, Viewport, Min/Max). Knowing the CSS name tells you what the setting does.
- Figma → Framer mapping:
  - Auto layout → Stack (horizontal, vertical or grid; the layer icon changes with the direction).
  - Frame and Text → the same.
  - Pages → Pages, but each one is a real URL (note the slash). The Canvas page is an unpublished playground, the nearest thing to a Figma page.
  - Clip content → Overflow: Hidden (Visible and Scroll are the other options).
  - Absolute position → Position, with more CSS options.
  - Prototype links between frames → Link to real pages or sections, optionally in a new tab.
  - Link states built as components → Link styles with Default, Hover and Current states built in.
  - Text styles → text styles with built-in sizes per breakpoint (L, M, S). Breakpoints can be removed or added per style.
  - Several stacked shadows → one shadow set to Realistic (Diffusion and Focus), or Box for plain Blur and Spread.
  - Inspect tab → Handoff, showing CSS or JSX to copy.
  - Community files → the Insert menu: ready-made sections, nav bars, footers, CMS collection lists, forms, embeds, icon libraries and interactive components (Carousel, Ticker, Slideshow).
- The Layout menu in the top bar: he equates Rows with a vertical auto layout and Columns with a horizontal one. Wrap, Grid and two asymmetric grid presets (one tall cell spanning two rows beside two stacked cells) are there too.
- Sizing that Figma lacks: Relative (% of the parent), Viewport for heights (100 fills a 700 px phone and a 2000 px desktop alike), and Min/Max width and height.
- Effects: Scroll speed (parallax), Scroll transform, Scroll variant, and Appear (triggered when the layer or its section comes into view; use a preset or set custom values).
- Scroll section: name a section, point a button's link at it, and add an offset so a fixed nav doesn't cover the target.
- Accessibility panel: an aria-label for screen readers, the tab order, and the HTML tag (H1, H2…), which is set separately from how the text looks.
- Code files (TSX) come in two kinds: code components for things the canvas can't do (custom code, external libraries), and code overrides that change something already on the canvas.
- Site settings hold the site-wide web settings: SEO title, language and description, the social preview image, password protection, Google Analytics, custom code, domain, redirects, versions, analytics and plan. Each page also has its own SEO settings.
- Browse the template gallery before starting from blank. He used Boost, a SaaS template that comes with Desktop, Tablet and Phone frames.

### Recipes
1. Start [00:31–02:03]: Dashboard → New → Blank site, or hover a template → Use template.
2. Preview and publish [15:04–17:07]: Preview → Responsive or Scale to fit → drag the width handles to test sizes → Publish. You get a random Framer domain, which you can swap for a custom domain or unpublish at any time.
3. Video lightbox [17:07–18:09]: select the button → Overlay → pick a transition preset (e.g. a fade) → set whether it's dismissible.
4. Full-screen section [19:43–21:19]: Sizing → Height → Viewport 100. Add Min/Max width or height to cap it.
5. Stack setup [21:19–22:21]: Layout → Direction (horizontal/vertical) → Distribute → Align → Wrap on or off → padding per side.
6. Realistic shadow [24:28–25:28]: Shadows → + → Realistic → Outside or Inside, colour, opacity, X/Y, Diffusion, Focus. Switch to Box for Blur and Spread.
7. Anchor link [25:28–26:29]: select the section → Scroll section → name it ("Section 1") → on a button, Link → Section 1 → Offset = extra pixels for the nav (value not stated).
8. Semantics [26:29–27:01]: Accessibility → aria-label, tab index, Tag → H1 or H2.
9. Handoff [27:01–27:31]: select a layer → Handoff → CSS or JSX → copy.

### CSS translation
```css
/* Stack = auto layout = flexbox */
.stack { display: flex; flex-direction: column; gap: …; padding: …; }   /* Direction, Distribute, Align, padding */
.stack--wrap { flex-wrap: wrap; }                                        /* Wrap */

/* Sizing */
.fixed { width: 450px; }              /* Fixed (450 was his example) */
.fill  { flex: 1 1 0; }               /* Fill along the stack's direction; align-self: stretch across it */
.fit   { width: fit-content; }        /* Fit */
.rel   { width: 50%; }                /* Relative = % of parent (value derived) */
.full  { height: 100vh; height: 100svh; } /* Viewport 100; svh avoids the mobile toolbar jump (derived) */
.cap   { max-width: …; min-height: …; }   /* Min/Max */

/* Styles */
.clip     { overflow: hidden; }       /* = Figma Clip content */
.scroller { overflow: auto; }         /* Overflow: Scroll */
.card { box-shadow: 0 1px 2px rgb(0 0 0 / .06), 0 4px 8px rgb(0 0 0 / .06), 0 16px 32px rgb(0 0 0 / .08); } /* Realistic ≈ layered shadows (values derived) */

/* Link styles: Default / Hover / Current */
.nav a:hover { … }
.nav a[aria-current="page"] { … }

/* Scroll section + offset under a fixed nav */
html { scroll-behavior: smooth; }     /* derived */
#section-1 { scroll-margin-top: 80px; } /* Offset = nav height (value derived) */
```
```html
<h2 aria-label="…" tabindex="0">…</h2>   <!-- Accessibility: aria-label, tab index, Tag; use tabindex only on things meant to be focusable (our note) -->
```

### Gotchas
- Anything built on the Canvas page is never published.
- Every page is a live URL, so name pages as you'd want the routes to read (our note).
- Fixed pixel heights for full-screen sections. Use Viewport so the section fits any screen.
- Rebuilding Figma's stacked shadows by hand. Realistic does it with one shadow.
- An anchor jump with no offset hides the top of the section under a fixed nav.
- Text that only looks like an H1 is not an H1. Set the Tag in Accessibility.
- He says Figma has no Min/Max sizing. Figma has since added min/max width and height on auto layout (our note).
- Until you connect a domain, the published site sits on a random Framer domain.

### Examples named
- Framer templates: Starter and Boost (SaaS); he builds the tour in Boost.
- Insert menu integrations: Spotify and SoundCloud players, Formspark and HubSpot forms, Intercom chat, Material and Heroicons icon sets (heard as "hero emoji"), Gumroad, TheFork (table booking), Eventbrite, YouTube, Vimeo, custom video, Lottie and GIFs (as heard).
- Framer components in Assets: Formspark, Google Maps, Loader, Ticker.

## 4 Tricks For Best Figma To Framer Export
- source: Tim Gabe · https://youtu.be/AJBaBScKdwI
- type: tool-tutorial
- tags: framer, figma, auto-layout, layout, responsive, breakpoints, plugins, handoff, workflow

### Takeaways
- Figma auto layout, Framer Stacks and CSS flexbox all work the same way. So design in Figma the way the page will be built, and the export carries over intact. He calls the result 100% accurate (creator's claim, unverified).
- Use auto layout everywhere, nested: one outer page auto layout wrapping the section auto layouts, which wrap their content. That lets you drag items into a new order, change gaps and move items within their parent, in Figma and again in Framer.
- Set resizing and constraints in Figma, because Framer inherits them:
  - Nav: horizontal resizing Fixed, constraints Centre and Top, and Absolute position, so it floats over everything outside the auto layout flow.
  - Heading + body container: Fill. The body text layer: Fill too, so the text reflows as the width shrinks.
  - Hero image container: an auto layout with 24 px side padding. The image stays 24 px from the sides and scales with the width.
- Breakpoints are a mindset, not an export. Export only the desktop frame and add Tablet and Phone in Framer. But design those breakpoints in Figma first, so you aren't improvising layouts inside Framer.
- Treat the export as Lego pieces. Export whole sections at project start, then later export only the piece that changed (one nav label, one icon).
- After pasting, set the Framer canvas width to your Figma width (the default is 1200; his is 1440), then switch the desktop frame height to Fit content. It then behaves like the Figma auto layout.

### Recipes
1. Auto layout everything [00:30–02:34]: page auto layout → section auto layouts → content auto layouts. Check you can reorder and re-space by dragging.
2. Resizing and constraints [02:34–05:08]
   1. Nav: W Fixed → constraints horizontal Centre, vertical Top → Absolute position.
   2. Text container: Fill. Body text layer: Fill.
   3. Hero: auto layout with 24 px horizontal padding, image inside set to fill (implied: he says it scales with the container).
   4. Resize the Figma frame to test: the text should reflow and the image should keep its 24 px margins.
3. Breakpoints [05:08–06:10]: design Desktop, Tablet and Mobile in Figma, export only Desktop, then rebuild the breakpoints in Framer from those designs.
4. Export [06:10–09:46]
   1. Select the sections (his: hero, cards ticker) or a single changed piece → Cmd/Ctrl+P or / (quick actions) → the Framer plugin (it becomes the top result once you use it often) → Enter. It copies the layers ("47 layers" in his run).
   2. Framer → New → Blank site → Create project.
   3. Desktop frame width 1200 → 1440 (match Figma).
   4. Cmd/Ctrl+V. The Figma images upload, and the layers appear in the Layers panel.
   5. Select the desktop frame → Height: Fixed → Fit content. It becomes a Stack.

### CSS translation
```css
/* Figma nested auto layouts + frame height "Fit content" = nested flex columns */
.page { position: relative; display: flex; flex-direction: column; }   /* height follows content */
.page > section { display: flex; flex-direction: column; }

/* Nav: Fixed width + Centre + Top + Absolute position */
.nav { position: absolute; top: 0; left: 50%; translate: -50% 0; z-index: 10;
       width: min(var(--nav-w), 100% - 48px); }   /* fixed width not stated; the clamp to the viewport is derived */

/* Fill text reflows with the width */
.hero__copy { align-self: stretch; }
.hero__copy p { width: 100%; }

/* Hero image always 24 px from the sides */
.hero__media { display: flex; padding-inline: 24px; }   /* 24 stated */
.hero__media img { width: 100%; height: auto; }
```

### Gotchas
- Anything not set up with auto layout, resizing and constraints in Figma turns into manual clean-up in Framer.
- Exporting separate Desktop, Tablet and Mobile frames. Export one desktop frame and build the breakpoints in Framer.
- Pasting into a canvas still at the 1200 default when the design is 1440.
- Leaving the pasted desktop frame at a Fixed height, so it won't grow with its content.
- Making up responsive layouts ad hoc in Framer instead of deciding them in Figma first.
- Re-exporting the whole page for one small change. Export just that piece.

### Examples named
- Figma to Framer plugin, run from quick actions (Cmd/Ctrl+P or /).
- His demo landing page: a hero with an absolutely positioned nav, a heading and body block, a padded hero image and a cards ticker.

## Figma in 20 Minutes (For Beginners in 2023)
- source: Tim Gabe · https://youtu.be/blDSmD5I61s
- type: tool-tutorial
- tags: figma, workflow, keyboard, typography, auto-layout, buttons, plugins, icons, imagery, colour

### Takeaways
- Practise on real, live sites. Rebuild a section over a screenshot of it, set to 20% opacity and locked, inside a 1440-wide Desktop frame. He rebuilds the hero of Anchor (a Spotify-owned podcast platform).
- Shortcuts:
  - F: frame (opens the frame templates, such as Desktop). T: text. R: rectangle. P: pen. Shift+A: auto layout.
  - Cmd/Ctrl+C then V: duplicate.
  - Shift+arrow keys in a number field: bigger steps instead of 1 (10 by default, our note).
  - Shift+drag, or the constrain-proportions lock: resize without distorting.
  - Double-click a layer: rename it.
  - Right-click → Send to back: reorder.
- The text tool reuses your last settings. After setting a big heading, the next text inherits its line height (42 in his case), so reset line height to Auto by typing "auto".
- Text boxes start as Auto width and run on one line. Dragging a box's edge switches it to Fixed width, and it wraps.
- His sizes: nav links about 16 px Semi bold (from the default Inter Medium), hero heading 72 px with tighter letter spacing and line height, the small line under the button 14 px with wider letter spacing, icons 16 px. The button label went smaller with tighter letter spacing (values not stated).
- A button is a text layer wrapped in auto layout (Shift+A), centred, with a fill (white by default) and a corner radius.
- On a frame, Selection colors lists every colour inside it. Change one swatch and every use changes at once, which is the quickest way to recolour a section. Document colors hold reusable swatches.
- Crop an image fill to reuse part of a screenshot (the logotype) instead of redrawing it.
- Plugins: Lucide for icons, Unsplash for photos. With a shape selected, clicking a photo fills that shape, whatever shape it is.

### Recipes
1. Tracing setup [05:12–07:16]: drag in a screenshot → F → Desktop → drag the screenshot inside → set the screenshot's width to 1440 with constrain proportions on → shrink the frame height to the image → duplicate the frame → screenshot opacity 100% → 20% → lock it in Layers.
2. Nav links [07:16–09:49]: T → type → size about 16 → Semi bold → nudge letter spacing (he says "1% less"; final value shown on screen, not stated) → line height Auto. Duplicate for each link, and re-check sizes where the trace stops matching (Sign in, Sign up).
3. Icon [09:49–11:23]: Resources → Plugins → Lucide icons → search "world" → insert → constrain proportions → 16 → drag it into the frame if it landed outside.
4. Heading and body [11:23–13:59]: heading 72 px with a narrower box and tighter letter spacing and line height. For the body: shrink the size → line height Auto → drag the box width to make it Fixed so it wraps → adjust line height and letter spacing.
5. Button [13:59–15:31]: label text (smaller, line height Auto, tighter tracking) → Shift+A → centre the text → widen → add a fill → raise the corner radius. Then duplicate a text layer below it for the "switch to Anchor" line at 14 px with wider letter spacing.
6. Shapes and photos [15:31–17:32]: R → rectangle → Fill → eyedropper to match a colour. For a photo: draw a shape → select it → Unsplash plugin → search → click an image.
7. Wave [17:32–19:06]: P → draw the curve → stroke width up (Shift for bigger steps) → eyedropper for the colour → drag into the frame → right-click → Send to back. Smooth the jagged points afterwards.
8. Finish [19:06–20:40]: unlock the screenshot → Fill → Crop → drag the handles until only the logotype remains → opacity back to 100% → frame fill = page background → Selection colors: black → white, accents → yellow.

### CSS translation
```css
/* Figma text settings → CSS */
.nav a  { font: 600 16px/normal "Inter", sans-serif; }   /* 16 Semi bold stated; Figma line height "Auto" ≈ normal (derived) */
.tracking-example { letter-spacing: -0.01em; }           /* Figma % letter spacing → em: -1% = -0.01em (derived) */
.hero h1 { font-size: 72px; }                            /* stated; tighter tracking and leading shown on screen, not stated */
.auto-w  { width: max-content; white-space: nowrap; }    /* Figma Auto width: one line that grows (derived) */
.fixed-w { width: 40ch; }                                /* Figma Fixed width: wraps; width derived */

/* Shift+A button = inline flex box */
.btn { display: inline-flex; align-items: center; justify-content: center;
       background: #fff; border-radius: …; padding: …; }   /* white default fill stated; radius, padding and label size not stated */
.btn + .sub { font-size: 14px; letter-spacing: .01em; }  /* 14 stated; "wider" tracking amount derived */
```

### Gotchas
- Forgetting that the text tool keeps the last line height, so small text inherits a heading's leading.
- Resizing icons or images without Shift or the proportion lock, which distorts them.
- Plugin output can land outside the frame. Check that it sits inside in Layers.
- An unlocked reference screenshot gets nudged by accident. Lock it.
- Pen-drawn curves come out jagged. Smooth the points before calling the shape done.
- New layers stack on top. Send backgrounds and decorative shapes to the back.

### Examples named
- Anchor (Spotify-owned podcast platform): the hero (nav, "Say it all with Anchor" heading, CTA button, photo, wave shape) used as the rebuild exercise.
- Lucide icons plugin: icon search and insert inside Figma.
- Unsplash plugin: stock photos that fill the selected shape.
- Inter: Figma's default text font in the demo.
