## Make ONE Design Change to Actually Land Clients (Stop Struggling)
- source: Kole Jain · https://youtu.be/5JxUJ1fuyO8
- type: career/business
- tags: freelance, career, case-study, portfolio, conversion, trust, psychology

### Takeaways
- Pitch the client's underlying problem, which is usually "not enough customers", not "a website". Clients judge a site mostly on looks, but its users judge it on whether it works, so results come from UX more than UI. Worked example: a boutique retailer with hundreds of products. The real problem is that shoppers can't find things (and sales presumably suffer), so the deliverable is a refined search plus a recategorised catalogue. The same thinking drives layout choices: testimonials on an agency's home page to win clients, a list of the year's good work on a nonprofit's page to win donations.
- Add services that attack the same core problem and fit the client's scale. For a site that already gets millions of visitors, conversion-rate optimisation beats SEO, because a small lift in conversion is worth a lot at that traffic. Other add-ons he lists: SEO, social media content, blog posts, email marketing, paid marketing, and a retainer for future design work. Offering design and build together (code or a site builder) also solves the client's lack of time, because they deal with one person instead of coordinating a designer and a developer.
- Present work as short case studies, not screenshots: the services you provided, then the problem (often customers lost on the way to converting), then the solution with numbers wherever possible. Get the numbers by keeping admin or view-only analytics access to the sites you build and comparing before and after launch; clients usually agree if you also provide an ongoing service (creator's experience, unverified). Pre-launch UX tests rarely reach a sample big enough to mean anything. Looks still count: the aesthetic-usability effect means attractive sites are perceived as easier to use and keep visitors longer (creator's claim, unverified).

### Recipes
- none (career/business)

### Gotchas
- Niching on the deliverable ("I update and organise boutique sites with a CMS") instead of the problem it fixes. He suggests niching on the problem itself (e.g. sites with large product collections and organisation issues), which works in any industry.
- A good-looking site that serves no purpose still won't sell; aim for both function and looks, not one or the other.

### Examples named
- Apple: a site that both solves problems and looks good.
- Google: visuals were only average until recently, but it served its purpose so well nobody cared.
- Image-compression sites: covered in ads, yet users don't mind as long as the image compresses quickly.
- ClickFunnels and similar sites: not beautiful, but the information is clearly laid out and the next click is obvious.

## Awful To AMAZING Web Designs Easily
- source: Kole Jain · https://youtu.be/ulSOdTgoGeY
- type: principles
- tags: layout, sections, landing-page, hero, grid, cards, carousel, imagery, emphasis, shadows, dark-mode, glass, colour, animation, micro-interaction, progressive-disclosure, prototyping, figma, redesign, portfolio

### Takeaways
- A design can follow every rule (good nav, good spacing) and still be boring. "Good" and "interesting" are different goals; interesting sites have more variety in layout, colour, size and everything else.
- The boredom is usually set at the wireframe. If the wireframe layout is average, the finished site follows it.
- Desktop sites mostly use 1, 2, 3 or 4 columns. Boring sites repeat one column pattern down the page, typically image on the left and text on the right, then mirrored. Mixing in a full-screen section, a row of cards and a three-column section already helps a lot (Shopify).
- "Breaking the box": outline every element with a box. In an interesting layout some boxes overlap; in a dull one nothing overlaps. It is hard to do well without looking wonky, so start small:
  - shift cards in a row up and down to suggest movement
  - let elements run past the frame edge, e.g. a sliding card row that bleeds off-screen
  - use a background-removed subject that overlaps its section (see images below)
- Images are a large share of the page, so their quality makes or breaks the site. AI images are now good enough to use in some cases, but not all; often you have to work with the photos you have.
- Image treatment by photo type:
  - single object as the focus: remove the background. It draws attention and breaks the box at the same time.
  - product image: crop and zoom into one portion of it (Apple does this well).
  - landscape or wide-angle shot: add an overlay and put text on it for a strong brand-message section.
  - any image: mask it into shapes that match the site's style.
- Size: making an element bigger draws attention and adds variety. Shrinking text and squeezing an image beside it is the safe, unoriginal choice.
- Stacking: turn a two-column horizontal layout into a one-column vertical stack of larger elements, so the viewer looks at one feature at a time (Apple).
- Depth without shadows:
  - offset buttons: a copy of the shape sits behind the button or image, shifted. It adds a lot of depth and is easy to animate on hover.
  - section backgrounds: give sections their own background colour. It separates them and adds some depth (Shopify).
  - dark mode shows this best: the dark background reads as further back than the lighter cards in front of it.
- Dark mode as a full restyle (not for every site, but works for most modern-themed ones). It is more than swapping the background:
  - flip the text to white
  - primary and accent colours are usually far too saturated for dark; his blue had to become a lighter blue
  - it still lacked something, so he added a frosted-glass effect to the cards and to the blue background block
  - a few quick changes completely change the look and feel
- If you don't want a change that drastic, change the page background instead: use a mix of off-whites, or a nondescript image background with a noise overlay for texture. Not everything needs a plain white background, and off-whites make the design feel more cohesive.
- Movement is the most foolproof way to make a site feel unique and alive. Keep it simple:
  - photos slowly zooming in or out (classy and easy to implement)
  - accordions, which need interaction to work, as an interactive way to show information
  - marquee text, which is trendy, but weigh its reduced usability

### Recipes
1. Vary the column rhythm at wireframe stage [00:30–01:30]
   - Note the column count (1–4) of every section.
   - Where image-left/text-right (or its mirror) repeats, swap some sections for a full-screen section, a row of cards and a three-column section.
2. Breaking the box in small steps [01:00–02:01]
   - Outline every element with a box and check whether anything overlaps.
   - Nudge alternate cards in a row up and down (offset amount shown on screen, not stated).
   - Let a sliding card row extend outside the frame.
3. Image treatment [02:01–02:33]
   - Single subject: remove the background so it can overlap section edges.
   - Product shot: crop and zoom into a detail.
   - Wide shot: add an overlay and put the brand message on top (overlay colour and opacity shown on screen, not stated).
   - Mask images into shapes that echo the site's style.
4. Size and stacking [02:33–03:35]
   - Make the key element much larger instead of shrinking it to fit beside others.
   - Convert a two-column feature row into a one-column vertical stack of large elements.
5. Offset-button depth with a hover in Figma [03:35–04:05]
   1. Build the button (or image) frame with a background shape offset behind it.
   2. Duplicate the frame and move the background shape in the copy.
   3. In Prototype mode, drag a connection between the two frames and give it a hover trigger. (Offset distance and animation settings shown on screen, not stated.)
6. Light to dark conversion [04:05–05:06]
   1. Set a dark background.
   2. Flip the text to white.
   3. Lighten the over-saturated primary/accent colours (the blue becomes a lighter blue).
   4. Add frosted glass to the cards and to the blue background block (blur and opacity values shown on screen, not stated).
7. Lighter-touch background change [05:06–05:37]: replace plain white with a mix of off-whites, or with a nondescript image plus a noise overlay.
8. Motion [05:37–06:07]: a slow zoom in or out on photos, accordions for information, marquee text used sparingly.
9. Portfolio hero redesign, before → after [06:07–07:00]
   - Before: his old portfolio, average but with nothing wrong in the UI; the hero had an image and stats.
   - Removed the image and stats for now → clears the stage to rebuild.
   - Centred the text and made the name larger → one focal point, emphasis through size.
   - Brought the stats back, rearranged; vertical space ran short, so he cut a block of text and moved everything up → room for visuals.
   - Placed a row of mobile screens below (taken from the removed image, plus more from elsewhere in the portfolio) → the work becomes the hero visual.
   - Added motion: on page load the screens slide up in a stagger (timings shown on screen, not stated).

### CSS translation
```css
/* Break the box: staggered card row (offset derived) */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }   /* gap (derived) */
.cards > :nth-child(even) { transform: translateY(48px); }                      /* (derived) */

/* Break the box: card row that bleeds past the right edge of the container */
.slider { display: flex; gap: 24px; overflow-x: auto; scroll-snap-type: x mandatory;
          margin-right: calc(50% - 50vw); }                                       /* (derived) */
.slider > * { flex: 0 0 clamp(260px, 30vw, 380px); scroll-snap-align: start; }   /* (derived) */

/* Background-removed subject overlapping its section */
.subject { position: relative; z-index: 1; margin-bottom: -80px; }               /* (derived) */

/* Offset shape behind a button, animated on hover */
.btn-offset { position: relative; isolation: isolate; border-radius: 12px; }     /* radius (derived) */
.btn-offset::before { content: ""; position: absolute; inset: 0; z-index: -1;
  border-radius: inherit; background: var(--accent);
  transform: translate(6px, 6px); transition: transform .2s ease; }              /* (derived) */
.btn-offset:hover::before { transform: translate(0, 0); }

/* Wide shot + overlay + brand message */
.brand-band { color: #fff; background:
  linear-gradient(rgb(0 0 0 / .45), rgb(0 0 0 / .45)), url(wide.jpg) center / cover; } /* alpha (derived) */

/* Masked image shape (shape derived) */
.arch { border-radius: 999px 999px 0 0; overflow: hidden; }

/* Product crop-and-zoom */
.crop { aspect-ratio: 4 / 5; overflow: hidden; }
.crop img { width: 100%; height: 100%; object-fit: cover; object-position: 70% 40%; transform: scale(1.6); } /* (derived) */

/* Dark-mode restyle: white text, lighter accent, frosted glass */
.theme-dark { --bg: #0d0f14; --text: #fff;                                       /* bg (derived); white text stated */
  --accent: color-mix(in oklch, var(--brand-blue), white 30%); }                  /* "lighter blue" (amount derived) */
.theme-dark .card, .theme-dark .accent-block {
  background: rgb(255 255 255 / .06); backdrop-filter: blur(16px) saturate(140%);
  border: 1px solid rgb(255 255 255 / .12); }                                     /* (derived) */

/* Off-white + noise texture instead of plain white */
body { background-color: #f6f4ef; }                                               /* (derived) */
.textured { position: relative; }
.textured::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .12;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); } /* (derived) */

/* Slow zoom on photos */
.zoom { overflow: hidden; }
.zoom img { transition: transform 1.2s cubic-bezier(.2, .7, .2, 1); }            /* (derived) */
.zoom:hover img { transform: scale(1.05); }                                       /* (derived) */

/* Marquee, switched off for reduced motion */
.marquee { overflow: hidden; }
.marquee__track { display: flex; width: max-content; animation: marquee 30s linear infinite; } /* (derived) */
@keyframes marquee { to { transform: translateX(-50%); } }   /* track holds the content twice */
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }

/* Hero screens slide up in a stagger on load */
.screens > * { animation: rise .7s cubic-bezier(.2, .8, .2, 1) both; }           /* (derived) */
.screens > :nth-child(2) { animation-delay: .08s; }
.screens > :nth-child(3) { animation-delay: .16s; }
.screens > :nth-child(4) { animation-delay: .24s; }                               /* step (derived) */
@keyframes rise { from { opacity: 0; transform: translateY(40px); } }
```
```html
<!-- Accordion: native, keyboard-accessible -->
<details><summary>Question</summary><p>Answer</p></details>
```

### Gotchas
- Repeating the same image-left/text-right two-column section all the way down the page.
- Starting visuals before the wireframe has a varied layout.
- Breaking the box so aggressively that the layout looks wonky.
- Shrinking a key element to fit a tidy grid, which kills originality.
- Dark mode done by swapping only the background, and keeping the saturated light-mode brand colours.
- Plain white backgrounds everywhere.
- Marquees and accordions cost usability; use them on purpose.

### Examples named
- Shopify: varied section layouts, and section background colours that separate sections and add depth.
- Apple: product images cropped and zoomed into a detail; two-column features stacked into one column so you see one feature at a time.
- "Develop Medicines" (as captioned; site not otherwise identified): large, varied element sizes.
- An unnamed site using a mix of off-whites and a noise-textured image background.
- Kole's old portfolio: the before → after hero redesign.

## 8 Web Design Hacks To ACTUALLY Make Your Designs Better
- source: Kole Jain · https://youtu.be/Lp6ey4AyDzA
- type: principles
- tags: hierarchy, typography, emphasis, colour, contrast, dark-mode, spacing, layout, cards, borders, icons, buttons, shadows, gradients, figma, prototyping, workflow, resources

### Takeaways
- Text hierarchy has three levers: size, weight and colour. Most people use size alone; adding weight and colour gives far more separation for little effort.
  - Weights: two at most. If the family has many weights (he mentions 16), pick two that have at least one weight between them, i.e. not neighbours.
  - Colours: two at most. The primary text colour (black or white) and the same colour at a reduced opacity of 45–70%, depending on the context.
  - Too many sizes, weights or colours looks as bad as too few.
- More space, fewer containers, fewer lines. Bento sections are fine, but lots of separators and containers make a design feel cluttered even when there is little in it. Cards take up a much larger footprint, especially in multi-column layouts like an e-commerce grid.
  - Remove the dividers and cards and let the space that frees up separate the content. People read things far apart as unrelated and things close together as related.
- Icons: keep them in one style and at their intended size.
  - Sites like Flaticon offer so many styles that matching a set is hard. Use an icon pack or library instead; his go-to is Feather Icons in Figma (minimal, small selection, covers the basics).
  - Simpler is better. Detail scales with size: larger icons need more detail, smaller ones less.
- Muted colours are your friend. Beginners treat colour as all or nothing (pure saturated hues plus black and white, or no colour at all). Learn the subtle ones: baby blue, beige, lavender.
  - Off-whites in light mode and bluish blacks in dark mode are a clear sign of a more experienced designer.
  - Generated palettes help, but adding the one extra colour a design needs takes experience.
- Not every button needs a background. This matters when buttons sit close together.
  - Two equally strong buttons compete. A header section should only ever have one primary CTA.
  - First choice: drop the second button. If it must stay, remove its background (his recommendation here).
  - Delete modal: delete is the primary action even though it is destructive, so it gets the primary treatment, preferably red. Cancel gets no background, just a border, or reduced opacity. Any of these tells users it isn't the main action.
- Use text as a visual element. A good display font can carry as much visual weight as an image, so treat giant type as a feature, not just explanation.
  - His favourites: Unbounded, Cabinet Grotesk and one captioned as "gourd" (name unconfirmed).
  - Find more in Google Fonts by filtering for Display.
  - Giant text once, maybe twice, per page. Never more.
- If shadows and gradients aren't working, drop them. They are hard to use and more often hurt than help; removing them often makes a site look more professional. A site that works with a gradient would work just as well without one. Keep experimenting, since that is how you improve.
- Drop-shadow rule:
  - X offset ≤ Y offset, always.
  - Blur = 1.3–2 × the Y value.
  - Lower Figma's preset opacity from 25% to 15–20%, depending on the background.
  - Darker backgrounds need a stronger shadow for it to show.
- View designs on the screen they are meant for. Designing zoomed out in Figma led him, as a junior, to oversized fonts and spacing.
  - Preview on the desktop, or mirror prototypes in the Figma mobile app to try them like a real app.
  - On both mobile and desktop, leave room for the browser bar.

### Recipes
1. Text hierarchy pass [00:00–01:04]
   - Start from size-only hierarchy.
   - Assign two weights at least one step apart (e.g. headings in the heavier one).
   - Assign two colours: the primary, and the primary at 45–70% opacity for secondary text.
   - Compare before and after (shown on screen).
2. Declutter pass [01:04–02:06]
   - Remove the dividers and card containers, especially in multi-column grids.
   - Use the freed space as the separator: tighter inside a group, wider between groups.
3. Icon set [02:06–02:38]
   - Take every icon from one pack (Feather Icons in Figma).
   - Check each icon renders at its intended size.
   - Match the level of detail to the size.
4. Demote the second button [03:39–04:41]
   - Hero with two equal CTAs: delete the second, or remove its background.
   - Delete modal: Delete filled in the primary/red colour; Cancel with no background, a border only, or reduced opacity.
5. Display type [04:41–05:11]
   - Google Fonts → filter category Display → scroll for candidates.
   - Use a giant display line once or twice per page.
6. Drop shadow [05:42–06:14]
   - Set X ≤ Y.
   - Set blur to 1.3–2 × Y.
   - Reduce opacity from the 25% preset to 15–20%; go stronger on dark backgrounds.
7. Device check [06:14–06:44]
   - Preview on the real desktop screen, or mirror the prototype in the Figma mobile app.
   - Subtract the browser bar's height from the usable viewport on mobile and desktop.

### CSS translation
```css
:root {
  /* Two text colours: primary + the same colour at 45–70% */
  --text:   rgb(0 0 0);
  --text-2: rgb(0 0 0 / .6);              /* 0.6 picked inside the stated 45–70% (derived) */
  /* Two weights, one step skipped between them */
  --w-body: 400; --w-strong: 600;         /* 400/600 skipping 500 (derived pick) */
  /* Muted neutrals */
  --off-white:    #f7f5f0;                /* (derived) */
  --bluish-black: #0b0f1a;                /* (derived) */
  /* Shadow rule: x ≤ y, blur 1.3–2 × y, alpha 15–20% */
  --shadow:         0 4px 6px rgb(0 0 0 / .18);   /* y 4, blur 6 = 1.5× (values derived) */
  --shadow-on-dark: 0 4px 8px rgb(0 0 0 / .35);   /* stronger on dark backgrounds (alpha derived) */
}
h1, h2, h3 { font-weight: var(--w-strong); color: var(--text); }
p, li      { font-weight: var(--w-body);  color: var(--text); }
.meta      { font-weight: var(--w-body);  color: var(--text-2); }

/* Space instead of cards and dividers */
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 48px 24px; } /* (derived) */
.product { background: none; border: 0; box-shadow: none; }

/* One primary CTA; the second loses its background */
.btn         { padding: 12px 20px; border-radius: 10px; }        /* (derived) */
.btn-primary { background: var(--accent); color: #fff; }
.btn-ghost   { background: transparent; color: var(--text); }

/* Destructive modal: filled red Delete, quiet Cancel */
.btn-danger  { background: #dc2626; color: #fff; }               /* red stated; exact value derived */
.btn-cancel  { background: transparent; border: 1px solid rgb(0 0 0 / .2); } /* or: opacity: .6 (derived) */

/* Giant display text, once or twice per page */
.display { font-family: "Unbounded", system-ui, sans-serif;
           font-size: clamp(56px, 12vw, 200px); line-height: .9; } /* sizes (derived) */

/* Usable viewport minus browser chrome */
.hero { min-height: 100svh; }   /* svh excludes the mobile browser bar (derived) */
```
- Figma's code export writes a drop shadow's blur straight into the CSS blur radius, so the rule carries over 1:1 (not from the video).
- Unbounded is on Google Fonts; Cabinet Grotesk is not (it is distributed through Fontshare). Not from the video.

### Gotchas
- Building hierarchy with font size alone.
- More than two weights or two text colours, or two weights that sit next to each other.
- Bento cards and dividers everywhere, so even a sparse design feels cluttered.
- Mixing icon styles from a big icon site, icons drawn with too much detail at small sizes, or icons not at their intended size.
- Using only pure saturated colours plus pure black and white.
- Two equally weighted buttons in a hero.
- Giving Cancel the filled button in a delete modal.
- Giant text more than twice on a page.
- Keeping a gradient or shadow that isn't working, or using Figma's default 25% shadow opacity unchanged.
- Judging sizes while zoomed out in Figma, and forgetting the browser bar.

### Examples named
- Flaticon: so many icon styles that a consistent set is hard to assemble.
- Feather Icons (Figma): his go-to minimal icon library.
- Google Fonts: filter by Display to find display faces.
- Unbounded, Cabinet Grotesk, and a third captioned "gourd": his favourite display fonts.
- Figma mobile app: mirrors prototypes on a phone.

## Advanced FIGMA Web Design Effects
- source: Kole Jain · https://youtu.be/MZSm6MA8bww
- type: tool-tutorial
- tags: figma, gradients, shadows, plugins, 3d, imagery, buttons

### Takeaways
- Four effects, all built from gradients, blend modes, inner shadows and blur; only the noise step uses a plugin.
- Kaleidoscope: for credit cards, stickers and buttons. Looks good, usability is poor.
- Clay: for isometrics or illustrations that need depth. Saturated colours don't work well.
- Metallic: for credit cards and metal mockups, and not much else. The gradient needs a noticeable colour change in the middle. A 20% tint layer turns it gold, bronze or titanium.
- Mesh gradient (no plugins): the most useful one; he uses it on websites, posters and slideshows. More overlapping layers make it brighter and more vibrant, so use 8–10 layers or more. It is more art than science.
- Most exact settings (gradient stops, inner-shadow values, blur amounts) are shown on screen and in the creator's linked Figma file, not spoken.

### Recipes
1. Kaleidoscope [00:00–01:00]
   1. Draw a circle with a radial gradient fill. Any colours work; he uses rainbow colours (caption: "colors of the rain"; exact stops shown on screen, not stated).
   2. Add a layer above with an angular gradient that alternates black and white an even number of times: 8 here; 10 or 6 also work.
   3. Set that layer's blend mode to Difference.
   4. Duplicate it and set the copy's blend mode to Screen. This copy must be the top layer of the stack, or the effect fails.
   5. Add noise with the Noise & Texture plugin.
   6. Add text, make it heavier, and set its blend mode to Overlay.
   7. A recap card with all settings appears at [01:00] (shown on screen, not stated).
2. Clay [01:00–01:31]
   1. Draw a rectangle and pick a fairly unsaturated colour (the colour area is shown on screen, not stated).
   2. Add an inner shadow that covers the top and right edges.
   3. Add a second inner shadow that covers the bottom and left edges.
   4. Optionally add a drop shadow for a stronger effect.
   5. Shadow values, colours and which one is light or dark: shown on screen, not stated.
3. Metallic [01:31–02:32]
   1. Draw a rectangle and round the corners (radius shown on screen, not stated).
   2. Fill it with a linear gradient of mostly greys and dark blues. The edge colours matter less; the middle needs a noticeable colour change.
   3. Add a layer with a white radial gradient set to Overlay, which gives depth and thickness.
   4. Add two inner shadows (settings shown on screen, not stated).
   5. To tint it (e.g. rose gold), add a layer filled at 20% in any colour. Reds, oranges and blues give a gold, bronze or titanium feel.
4. Mesh gradient, no plugins [02:32–03:34]
   1. Draw a circle with some transparency and a blur (a layer blur; amounts shown on screen, not stated). This is the base the other circles sit on.
   2. Add another circle with transparency and blur, blend mode Overlay.
   3. Repeat, overlapping them. Use 8–10 layers or more; more overlap = brighter and more vibrant.
   4. Tune colours, blur and transparency by eye until it looks right.

### CSS translation
| Figma | CSS (mapping derived) |
|---|---|
| Radial / angular / linear gradient | `radial-gradient()` / `conic-gradient()` / `linear-gradient()` |
| Blend mode Difference / Screen / Overlay | `mix-blend-mode: difference / screen / overlay` (keep the parent `isolation: isolate`) |
| Inner shadow | `box-shadow: inset …` |
| Layer blur | `filter: blur()` |
| Layer at 20% fill | colour with 0.2 alpha, e.g. `rgb(r g b / .2)` |
| Noise & Texture plugin | an SVG `feTurbulence` overlay (see the noise snippet in "Awful To AMAZING Web Designs Easily") |

```css
/* 1. Kaleidoscope — all values derived except the even black/white count (8) and the blend modes */
.kaleido { position: relative; width: 240px; aspect-ratio: 1; border-radius: 50%; overflow: hidden; isolation: isolate;
  background: radial-gradient(circle, #ff3b30, #ff9500, #ffcc00, #34c759, #007aff, #5856d6, #af52de); }
.kaleido::before, .kaleido::after { content: ""; position: absolute; inset: 0;
  background: repeating-conic-gradient(#000 0deg, #fff 45deg, #000 90deg); } /* 8 alternating stops round the circle */
.kaleido::before { mix-blend-mode: difference; }
.kaleido::after  { mix-blend-mode: screen; }            /* must sit above the difference layer */
.kaleido span { position: absolute; inset: 0; z-index: 1; display: grid; place-items: center;
  font-weight: 800; color: #fff; mix-blend-mode: overlay; }  /* heavier text on Overlay */

/* 2. Clay — light/dark assignment and all values derived */
.clay { background: hsl(210 35% 76%); border-radius: 24px;              /* low-saturation fill */
  box-shadow: inset -10px 10px 20px rgb(255 255 255 / .45),             /* top + right edges */
              inset 10px -10px 20px rgb(0 0 0 / .18),                   /* bottom + left edges */
              0 20px 40px rgb(0 0 0 / .15); }                           /* optional drop shadow */

/* 3. Metallic — all values derived except the 20% tint */
.metal { position: relative; isolation: isolate; overflow: hidden; border-radius: 16px;
  background: linear-gradient(115deg, #2b2f3a 0%, #8a8f99 46%, #1d2a44 54%, #6b717c 100%); /* sharp change mid-way */
  box-shadow: inset 2px 2px 2px rgb(255 255 255 / .35), inset -2px -2px 3px rgb(0 0 0 / .4); }
.metal::before { content: ""; position: absolute; inset: 0;
  background: radial-gradient(circle at 30% 20%, #fff, transparent 60%); mix-blend-mode: overlay; }
.metal--rose::after { content: ""; position: absolute; inset: 0;
  background: rgb(255 110 90 / .2); }                                     /* 20% tint stated; hue derived; blend not stated */

/* 4. Mesh gradient — blurred translucent circles; base circle normal, the rest Overlay (values derived) */
.mesh { position: relative; overflow: hidden; isolation: isolate; background: #101014; }
.mesh i { position: absolute; width: 55%; aspect-ratio: 1; border-radius: 50%;
  filter: blur(80px); opacity: .75; mix-blend-mode: overlay; }
.mesh i:first-child { mix-blend-mode: normal; width: 90%; left: 5%; top: 5%; background: #6d4cff; } /* base */
.mesh i:nth-child(2) { left: -10%; top: -15%; background: #ff5e3a; }
.mesh i:nth-child(3) { right: -10%; top: 10%;  background: #19c3ff; }
.mesh i:nth-child(4) { left: 25%; bottom: -20%; background: #ffd23f; }
/* …continue to 8–10 circles; large blur filters are costly, so consider exporting a static image (not from the video) */
```

### Gotchas
- In the kaleidoscope, the Screen copy has to be the topmost layer or the effect doesn't work.
- Use an even number of black/white alternations in the angular gradient.
- Kaleidoscope text has poor legibility; keep it decorative.
- Saturated colours make the clay effect look wrong.
- A metallic gradient without a visible colour change in the middle reads flat.
- Too few overlapping mesh layers gives a dull gradient; more layers brighten it.

### Examples named
- Noise & Texture (Figma plugin): adds the grain in the kaleidoscope effect.

## How To Price Website Designs (With Specific Numbers)
- source: Kole Jain · https://youtu.be/2rtsoM2Dqrs
- type: career/business
- tags: pricing-work, freelance, career

### Takeaways
- Hourly pricing is location-specific: the average US designer earns about $50/h and the average designer in India about $12/h (creator's claim, unverified). His guide for the US and similar markets: $20–30/h with 1–2 years of designing; $35–50/h after a few successful clients; $60–100/h after about another year. He advises moving off hourly, because it pits you (more hours) against the client (fewer hours) and clients want a fixed number; it only helps while you can't yet scope a project accurately.
- Project pricing: break-even = estimated hours × your hourly rate, counting meetings and revisions (his benchmark durations are shown on screen, not stated). Then gross it up by a factor of 1–2 depending on what the client brings you: about 1× for a big-name client likely to send referrals, up to 2× for a dull project, 1.5× for a middle-of-the-road one (e.g. $4,000 break-even → $6,000).
- Value-based pricing: take a share, generally 5–10%, of the extra revenue the redesign produces (his example: a client at $2M a year gaining 10% → $10–20k fee). You have to estimate the revenue gain and agree an acceptable ROI with the client, but the fee scales with client size regardless of hours. It only works when the project is tied to revenue in a measurable way; for pre-revenue companies or non-profits, fall back to project pricing. Projects usually take longer than expected, and your skills are worth more than you think.

### Recipes
- none (career/business)

### Gotchas
- Staying on hourly pricing once you can scope projects.
- Leaving meetings and revisions out of time estimates.
- Using value-based pricing for clients with no measurable revenue link.

### Examples named
- none named
