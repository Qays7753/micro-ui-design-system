## 4 UI Design Hacks to KILL boring designs
- source: Kole Jain · https://youtu.be/SfX43uIubj4
- type: technique
- tags: landing-page, hero, imagery, animation, micro-interaction, parallax, scroll, states, copywriting, inspiration

### Takeaways
- Modern should not mean sterile. A stripped-back "corporate AI" look (Mailchimp before 2020 vs Mailchimp now) isn't wrong, but it loses the fun and curiosity that make people explore a site.
- Hack 1, context not clutter: deleting the objects around a busy hero does not make it clearer, only emptier. Product-relevant objects (money, an invoice, crypto coins) tell visitors what the product does before they read anything.
- The pattern: put the core message in the centre, and let everything around it exist only to give context.
- Keep a generous clear zone around the text so the surrounding objects read as context. If one more illustration in an empty gap would tip the page into clutter, leave the gap empty.
- Off-grid ("breaking the box") placement is mostly eyeballed, but one rule holds: objects should pull the eye toward the centre, so they thin out the further they sit from it (the crypto-site example).
- Object angle matters. Tilting the doodles another way in the demo wasn't technically wrong, but it looked off. Angle them so they help the inward pull.
- Choose one playfulness level and match the brand to it. Realistic imagery reads professional (the invoicing site), doodled illustrations sit in the middle, and blobs with bright colours are the most playful (the crypto site). Gumroad's neo-brutalism sits about level with the doodle style.
- Hack 2, motion: things that don't need to move often still should. An object with no entrance, or with a mechanical fade-in, wastes the chance.
- Give each object an entrance that suits its character: the star spins and pops in, the hot-air balloon flies in from off-screen and then bobs slowly in place, the calendar slides and rotates in. Add easing so the motion feels natural (easing is covered in his mobile swipe video, which is the next section of this batch).
- Objects sitting in wide, roomy side margins can take light scroll parallax. That gives a lifelike, 3D feel without heavy layered backgrounds.
- Hack 3, animate the text: text makes up roughly 80% of most websites (creator's claim, unverified) and is not interesting on its own. The aim is not complexity. Moving text simply pulls attention to the message.
- Make text animation literal to what the word means: "deadlines" turns into a filling progress bar, "paid" turns into bouncing dollar signs, and a checkbox ticks at the end of the line.
- Simple isn't bland when nearly everything has a small hover interaction (Chester's site). One well-placed effect can carry a page that is otherwise all text (Logan's portfolio).
- Friendly copy is part of the delight. Plain, human phrasing ("we sweat the details") beats corporate phrasing ("we take pride in our attention to detail"), and Basecamp's whole site runs on plain language.
- Hack 4, finishing touches: much of the polish sits in screens people rarely see. A 404 page is the best place to be quirky, because the visitor isn't meant to be there.
- Give the 404 the same personal voice and smooth motion as the rest of the site.

### Recipes
1. Contextual-doodle hero (tool not named) [00:51–01:34]
   1. Delete the existing hero image.
   2. Centre the headline, sub-copy and CTA, and adjust the other text styles (exact styles shown on screen, not stated).
   3. Pick a few product-relevant objects (in the demo, a calendar, a hot-air balloon and a star) and swap the photos for doodle-style illustrations.
   4. Add a few "twinkles" (small sparkle marks) and one or two scribbles. Keep them restrained.
   5. Place the objects off-grid in the margins, keep a clear zone around the copy, and let the density fall off with distance from the centre.
   6. Clutter test: drop one more illustration into the largest empty gap. If the hero now feels crowded, take it back out.
2. Character entrances [03:07–03:37]
   - Star: rotate and scale-pop into view.
   - Hot-air balloon: translate in from off-screen, then run a slow, endless up-and-down bob.
   - Calendar: translate and rotate into place.
   - Apply easing to all three (curves and durations shown on screen, not stated).
3. Margin parallax [03:37–04:08]: on scroll, the objects in the side margins move at a different rate from the page.
4. Kinetic headline [04:38–05:10]
   1. Line 1: the first word ("track") fades in while sliding down.
   2. "deadlines" first shows as a progress bar that fills, then rises up and out, and the word takes its place.
   3. Line 2 opens with the same fade-and-slide. "paid" first appears as a row of bouncing "$" glyphs, which then slide downward, and after that the word "paid" falls into place.
   4. A small checkbox appears at the end of the line.
   5. Run the headline together with the object entrances so the whole hero moves at once.
5. Playful 404 [05:40–06:11]: reuse the site's friendly voice and the same animation language. Ideas from the video: a quiz, a character or mascot, or a mini game that sends the user home when it ends.

### CSS translation
```css
/* All durations, curves and distances are (derived); the video states none. */
@keyframes pop-spin { from { opacity: 0; transform: scale(0) rotate(-180deg); } to { opacity: 1; transform: none; } }
.star { animation: pop-spin .6s cubic-bezier(.34, 1.56, .64, 1) both; }            /* overshoot = "pop" */

@keyframes fly-in { from { transform: translate(-60vw, 30vh); } to { transform: none; } }
@keyframes bob { 50% { transform: translateY(-8px); } }
.balloon { animation: fly-in 1.4s cubic-bezier(.22, 1, .36, 1) both; }
.balloon > img { animation: bob 4s ease-in-out 1.4s infinite; }                   /* inner element so the transforms don't clash */

@keyframes swing-in { from { opacity: 0; transform: translateY(40px) rotate(20deg); } to { opacity: 1; transform: rotate(-6deg); } }
.calendar { animation: swing-in .8s cubic-bezier(.22, 1, .36, 1) .2s both; }

/* Margin parallax with scroll-driven animations; --depth 0..1 per object (derived) */
.doodle { animation: drift linear both; animation-timeline: scroll(); }
@keyframes drift { to { transform: translateY(calc(var(--depth, .5) * -120px)); } }

/* Word-swap slot for the kinetic headline: stack the bar and the word in one cell (derived) */
.swap { display: inline-grid; } .swap > * { grid-area: 1 / 1; }
.swap .bar { animation: fill .8s ease-out both, rise-out .35s ease-in .9s forwards; }
.swap .word { animation: drop-in .45s cubic-bezier(.34, 1.56, .64, 1) 1.1s both; }

@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }      /* (derived) */
```

### Gotchas
- Adding "just one more" illustration to fill empty space is the usual way a playful hero turns cluttered.
- Objects crowding the text stop reading as context and start competing with the message.
- Placing objects with no pull toward the centre, or tilting them against it, makes the composition feel off.
- No entrance, or a mechanical fade, makes a playful layout feel dead. Motion without easing feels unnatural.
- Don't chase complexity. Text motion is there to draw attention, not to show off.
- Corporate jargon in copy cancels out playful visuals.
- A mismatch between imagery style (realistic, doodle, blob) and brand tone breaks the vibe.

### Examples named
- Mailchimp: playful before 2020, sterile now (the "corporate mush" trend).
- An unnamed invoicing website: busy hero where money, invoice and crypto objects explain the product. Professional, realistic imagery.
- An unnamed crypto website: centred message with coins, an Ethereum symbol and a character. Objects trail off from the centre, and blobs and bright colours make it the most playful example.
- Gumroad: neo-brutalist, at about the same playfulness level as the doodle hero.
- Paste (app site): scroll animations it doesn't strictly need, which add delight.
- Daniel's portfolio: images rotate in subtly at the bottom; graffiti and realistic-pin animations make for a varied scroll.
- "Delassis" (spelling as heard in captions): parallax plus mouse interactions make the site feel 3D.
- Apple Mac mini landing page: storytelling through motion.
- Reboot: explains its product with text animations and micro-interactions.
- Logan's portfolio: all text apart from one blur effect that reveals message bubbles.
- Chester's website: very simple, with hover interactions on almost everything.
- Basecamp: the whole site is written in plain, natural language.
- 404 pages: Mobbin (a quiz where you guess the interface), Pixar (a character from one of its films), an unnamed pizza site (a snake eats the pizza, then the page auto-redirects).

## Master the 3 Types of CRAZY Mobile UI Swipe Interactions
- source: Kole Jain · https://youtu.be/14h1VnkQvIc
- type: technique
- tags: mobile, gestures, animation, micro-interaction, carousel, navigation, cards, onboarding, ios

### Takeaways
- Interactions are what turn a UI into an experience. Mobile swipe interactions fall into three groups: navigation within a page, navigation between pages, and swipe gestures (actions).
- A phone screen is small, so its edges become a design tool for effects that desktop can't do.
- A horizontal scrolling card row beats stacking everything vertically, but with default motion the swipe feels rigid. Widen the easing curve and add bounce so the cards carry momentum.
- Almost never use linear easing, because real objects speed up and slow down. The curve also sets the tone: a quick curve feels fast and efficient, a springy one feels playful, and a long gentle one feels calm.
- Skewing cards as they leave the screen edge fakes a 3D ring of cards you spin through.
- Carousels need page indicators for usability. Rather than a plain highlight on the active dot, use a fluid, magnetic stretch between dots as you swipe. He reuses this effect later for the add-friend gesture.
- The screen edge can act as a horizon that shrinks items as they approach it. Combined with a circular swipe path, it feels like a spool or wheel of data under your thumb.
- Swiping down can expand a view to full screen. The black background area behind it should also be tappable or swipeable to switch modes.
- Duality rule: a swipe is fast and intuitive once learned, but give newcomers a button for the same action. Gmail lets you swipe to delete, or open the message and tap delete.
- Between-page transitions should follow the swipe. The incoming background and content move in the same direction as the finger, which is what makes the transition feel seamless.
- Shared-element continuity: when the tapped image zooms up to become the next page's hero image, the navigation feels seamless. Even this simpler version is far better than sliding a new page in.
- Swipe gestures can replace a button or reveal more context, and Apple uses them throughout its apps.
- Example: instead of a plus button to add a friend to a group, swipe the friend in using the same fluid effect as the carousel indicator. A long-press menu as a backup is probably good UX, but once users know they can swipe, it is the faster flow.
- Swipe-to-dismiss works for popovers and pages because it's quick and usually obvious, and a bottom sheet clearly invites a downward swipe. Still include a close button in case it isn't obvious.
- Much of a bottom sheet's polish comes from the page behind it: the background zooms out and shifts down when the sheet opens, and does the reverse when it closes.
- Swipe-to-confirm suits high-impact or irreversible actions. Dragging a slider all the way across is much harder to do by accident than tapping a button (Resend uses it to confirm sending an email; a crypto purchase is the other example).

### Recipes
(Tool not named in the transcript. Easing curves, durations and skew angles are shown on screen, not stated.)
1. Momentum card carousel [00:25–01:01]: horizontal cards with a bouncy, non-linear ease so they overshoot and settle.
2. 3D ring illusion [01:01]: skew each card more the closer it gets to the left or right screen edge.
3. Fluid indicator dots [01:01–01:31]: as the user swipes, the active indicator stretches toward the next dot and snaps into it, like a magnet, instead of the highlight just jumping.
4. Horizon spool [01:31]: items scale down as they approach the screen side and move along a circular arc as the user swipes.
5. Full-screen toggle [01:31–02:02]: swipe down to go full screen. The black backdrop accepts a tap or a swipe to switch modes back.
6. Card-to-page expand (recipe app) [02:32–03:33]
   1. The user swipes up on the card.
   2. The card underneath grows to the full screen size.
   3. At the same time, the black tab grows to fill the whole screen.
   4. The new page's content fades up and in.
   5. It finishes with an elastic snap (overshoot and settle) at the top.
7. Onboarding circle wipe [03:33–04:03]: the "next" control can be tapped or swiped. Motion follows the swipe direction and wraps around into the next slide.
   1. A circle expands very large while the current content moves out.
   2. Swap in the next slide's circle.
   3. Shrink the circle back down while the new content moves in.
8. Shared-element hero zoom [04:03]: the tapped image scales and moves to become the next page's hero image, and the rest of the page builds around it.
9. Swipe to add a friend [04:03–04:34]: replace the plus button with a swipe that pulls the person into the group using the fluid indicator motion. Optionally add a long-press menu as a fallback.
10. Bottom-sheet dismiss [04:34–05:05]: on open, the sheet rises while the page behind it scales down and shifts down. On a swipe down (or the button), run the reverse.
11. Slide-to-confirm [05:05–05:36]: a slider the user must drag all the way across to commit a send or purchase.

### CSS translation
```css
/* 1–2  Snap carousel + edge skew (values derived). Scroll-driven animations: Chromium; progressive enhancement. */
.rail { display: flex; gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; overscroll-behavior-x: contain; }
.rail > .card { flex: 0 0 78%; scroll-snap-align: center; animation: ring linear both; animation-timeline: view(inline); }
@keyframes ring {
  0%   { transform: skewY(8deg)  scale(.9); }    /* entering from the right edge */
  50%  { transform: none; }
  100% { transform: skewY(-8deg) scale(.9); }    /* leaving at the left edge */
}

/* Springy (not linear) easing for anything the finger releases (derived) */
:root { --spring: cubic-bezier(.34, 1.56, .64, 1); --smooth: cubic-bezier(.22, 1, .36, 1); }

/* 8  Shared-element hero zoom with the View Transitions API (derived) */
.thumb-active, .page-hero { view-transition-name: hero; }   /* same name on the old and the new element */
::view-transition-group(hero) { animation-duration: .45s; animation-timing-function: var(--smooth); }

/* 10  Bottom sheet with the page receding behind it (values derived) */
.page  { transition: transform .35s var(--smooth), border-radius .35s; transform-origin: 50% 0; }
.sheet { transform: translateY(100%); transition: transform .35s var(--smooth); }
body.sheet-open .page  { transform: translateY(10px) scale(.94); border-radius: 12px; }
body.sheet-open .sheet { transform: none; }
```
- Slide-to-confirm needs JS pointer handling: commit only when the thumb reaches the end of the track (the video's rule is "all the way across"), and otherwise spring it back with `--spring` (derived).

### Gotchas
- Linear easing, and the default rigid swipe, make carousels feel mechanical.
- Indicators that only change highlight are a missed chance.
- Gesture-only actions with no button or long-press fallback stay hidden from new users.
- Sliding a whole new page in from the side is the "lame" default. Build continuity instead: expand, zoom or follow the finger.
- Transitions that move against the swipe direction break the sense of continuity.
- Irreversible actions behind a single tappable button are easy to trigger by accident.

### Examples named
- Gmail: swipe to delete, or tap and delete. The duality pattern.
- Apple's iOS apps: heavy use of swipe gestures, especially swipe-down to dismiss sheets.
- Resend: slide-to-confirm before sending an email.
- An unnamed crypto app: slide-to-confirm for a purchase.

## The DEFINITIVE process to present UIs like a pro
- source: Kole Jain · https://youtu.be/7cTdCu8HMgM
- type: technique
- tags: presenting, portfolio, colour, shadows, glass, gradients, dark-mode, imagery, prototyping, ai

### Takeaways
- Presentation is half the design. The same UI can be shown many ways, so pick the way that fits the setting.
- There are two settings. A showcase (portfolio, social, Dribbble) is meant to impress. A client meeting is meant to build confidence in the product by showing it in a clear, realistic context.
- Showcase 1, a plain background colour (the Dribbble default). A good backdrop is surprisingly hard to find. For a light-mode design, take the accent colour (orange in the demo), darken it and desaturate it toward grey, because a bright colour would out-shine the design. Add a faint shadow under the UI.
- Showcase 1, dark mode: add a subtle glow with large, heavily blurred circles of the accent colour behind the UI. It reads as soft ambient light, as if the screen were emitting it.
- Showcase 1, depth: put a glassy panel behind the UI and define its edges with a soft gradient stroke.
- Don't underestimate minimalism. Fairly bland backgrounds make the design itself pop and suit nearly any design.
- Showcase 2, "exploding the image": let parts of the UI (chart lines, a pattern, a slider) run past the frame edge so the design spills off the canvas. It isn't practical, but it is more interesting than a tidy crop. The same trick can extend the brand's visual identity with a few key metrics placed on it.
- Showcase 3, skew: a little goes a long way. He used 2° vertical and −14° horizontal.
- Showcase 4, pop-out: offset the dashboard (or one panel) from its frame and add a shadow. A grey placeholder left where it sat can emphasise the effect but is optional.
- Multi-screen sets: plain stacking is dull. Offset the screens and let them slide off the page; mobile screens work the same way in the other orientation. Fill the leftover space with more screens to make a collage.
- In a collage, avoid lining everything up on a strict grid. A few degrees of rotation adds a lot of motion, the whole collage can be skewed, and the most important frame (for example the hero) can pop out.
- Collages need large UI, so landing pages work best. Dashboard detail is too fine to read at collage scale. Instead, zoom far into one section and animate it slightly, which looks both creative and professional.
- Showcase 5, photography: the hardest to balance, because it must be relevant without distracting from the UI. It works best for physical products (a coffee shop, a car). For software, fluid gradient images sometimes work, but one of the techniques above usually serves better.
- Client setting, device mockups: they look polished and show the product where it will actually be used. Even a plain computer frames the design well, and a lifestyle mockup (an iPad in use, an Apple Watch) raises it further.
- AI is weak at thoughtful UI (creator's view) but good at mockups. The gold standard is the latest Apple device. Small, real-world details (cracks, a water stain) are what make a mockup believable.
- This mockup skill matters for e-commerce, where product-image quality decides whether a design works.
- Client setting, prototypes: show, don't describe. The client sees the visual, then feels the working version. Prototypes reveal hidden but intuitive features (swipe actions, a modal's entrance animation, the delete-link sequence), and that motion signals a level of polish static images can't.
- In total there are eight ways: plain background, exploding, skew, pop-out, collage, imagery, mockups and prototypes.

### Recipes
1. Light-mode backdrop [00:30]: pick the accent colour, lower its brightness, pull its saturation toward grey, fill the background with it, and add a faint shadow under the UI (exact values shown on screen, not stated).
2. Dark-mode glow [00:45]: put 2–3 large circles in the accent colour behind the UI frame, blur them heavily (circle count and blur amount shown on screen, not stated), and keep the effect subtle.
3. Glass and gradient stroke [00:55]: put a frosted, semi-transparent panel behind the UI and give its edge a soft gradient stroke.
4. Exploding the image [01:01–01:31]: extend lines, patterns or controls from the UI out past the canvas edge, rather than cropping them at the frame.
5. Skew [01:31–02:01]: skew 2° vertical and −14° horizontal (stated). Don't go further.
6. Pop-out [02:01]: duplicate or detach the key panel, offset it from the frame, add a drop shadow, and optionally leave a grey placeholder block in its original slot.
7. Collage [02:32–03:33]
   1. Offset the screens and slide them partly off the canvas.
   2. Fill the empty areas with more screens.
   3. Break the grid so the edges don't all align.
   4. Rotate the whole collage a few degrees, or skew it.
   5. Pop out the most important frame.
8. Dashboard detail crop [03:33]: zoom into one region of the dashboard, crop to it, and add a light animation.
9. AI lifestyle mockup [04:36–05:36]
   1. Prompt (about 30 words), as given: "MacBook Air, green screen on screen on an orange faux leather padded chair, notebook and stool in background, background blurred, soft shadows, moody lighting, natural, lived in". Alternate set dressing from the video: "minimal concrete cylinders with small cracks", "beige living room with water stain". The AI tool is not named.
   2. Key out the green screen.
   3. Place the design and skew it to fit the screen's perspective. He says the whole mockup takes about 2 minutes.
10. Prototype for clients [05:36–06:07]: build the working prototype with real transitions, such as swipe actions, a "create link" modal animating in, and the delete-link animation sequence.

### CSS translation
```css
/* Showcase stage. Colours are placeholders; amounts (derived). */
.stage { background: color-mix(in oklab, var(--accent) 45%, #6e6e6e); }        /* darkened + desaturated accent */
.shot  { border-radius: 16px; box-shadow: 0 24px 60px rgb(0 0 0 / .12); }      /* "faint" shadow */

/* Dark-mode ambient glow */
.stage--dark { background: #0c0c10; position: relative; overflow: hidden; isolation: isolate; }
.stage--dark::before, .stage--dark::after {
  content: ""; position: absolute; z-index: -1; width: 45vmax; aspect-ratio: 1; border-radius: 50%;
  background: var(--accent); filter: blur(120px); opacity: .35;
}
.stage--dark::before { top: -10%; left: -5%; } .stage--dark::after { bottom: -15%; right: -10%; }

/* Glass panel with a soft gradient stroke (mask-border trick) */
.glass { position: relative; border-radius: 24px; background: rgb(255 255 255 / .06); backdrop-filter: blur(20px); }
.glass::before {
  content: ""; position: absolute; inset: 0; border-radius: inherit; padding: 1px; pointer-events: none;
  background: linear-gradient(135deg, rgb(255 255 255 / .45), rgb(255 255 255 / 0) 60%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
}

/* Skew: the video's values. Flip the signs if the lean comes out mirrored; tool sign conventions differ. */
.shot--skew { transform: skew(-14deg, 2deg); }      /* skew(x, y) = −14° horizontal, 2° vertical */

/* Pop-out panel + optional placeholder (derived) */
.popout { transform: translate(24px, -24px); box-shadow: 0 30px 80px rgb(0 0 0 / .25); }
.slot   { background: #e6e6e6; border-radius: 12px; }

/* Collage tilt, "a few degrees" (derived) */
.collage { transform: rotate(-6deg); }
```

### Gotchas
- A bright or saturated backdrop competes with the design. Mute it.
- Over-skewing. Stop at "just enough".
- Stacking screens flat, or snapping a collage to a perfect grid, looks static.
- Dashboards in a collage become unreadable, so crop in on a detail instead.
- Photos that are irrelevant, or louder than the UI.
- Portfolio wow techniques don't belong in client meetings, where realism and confidence matter more.
- Describing an interaction in words instead of prototyping it.
- AI-generated UI, as opposed to AI-generated mockups (creator's view).

### Examples named
- Dribbble: plain background colour as the standard showcase style.
- Three unnamed shots: plain, bland backgrounds that make the UI pop.
- An unnamed slider shot: the slider extends off-frame and is also a real UI pattern.
- An unnamed brand shot: extends the brand's visual identity with key metrics laid over it.
- An unnamed portfolio template: integrates photography with UI without overpowering it.
- Apple devices (MacBook Air, iPad, Apple Watch): the gold-standard mockup hardware.

## I Redesigned Google's AI Website from SCRATCH (complete transformation)
- source: Kole Jain · https://youtu.be/pGYLZyBE32o
- type: redesign/breakdown
- tags: redesign, critique, landing-page, hero, sections, layout, cards, gradients, dark-mode, buttons, icons, micro-interaction, conversion, ai, inspiration

### Takeaways
- Critique of AI company sites: OpenAI's is lopsided with a dull layout, Microsoft's has too many tabs and videos nobody will watch, Midjourney's is good, and Gemini's looks neglected, while Google's own Chrome landing page is far better.
- Start every project with inspiration (here Microsoft Copilot, OpenAI, Google Chrome and other Google products). Do a web search before designing too, because it turned up a better asset than the one he had planned.
- He set the visual language up front: mesh gradients (now almost synonymous with AI), plenty of grain/noise, and pill-shaped (fully rounded) corners.
- Content strategy: one roadmap (partly drafted with Gemini, loosely following Microsoft's page flow) merges three separate Google landing pages into one.
- Hero CTA as an input: a search or prompt bar you can type into, borrowed from OpenAI, beats a plain button. It redirects to login, but the visitor has already started an action and is more likely to finish it. It also looks better.
- Headline: short and punchy in the Chrome style ("Gemini, the only AI by Google").
- Brand colour restraint: colouring the headline in Google's four colours looked off. Showing the Google logo on a white background (as a badge) worked, with the Gemini star mark placed above it.
- Hero focal point: decorative background shapes looked messy against Google's clean style. Instead, the chatbot's own loading animation runs along the bottom of the hero, so it looks like the AI is thinking.
- Bento section: drop the redundant section title above it, give each card a header, write the descriptions yourself, and build diagrams into the cards (a very Google look).
- Dark-mode colour trick: when colour is hard to work into a dark UI, set the page background to a gradient of two primary brand colours (Gemini's baby blue and pink) and pull both down to very dark. Noise is optional but easy to overdo ("TV static").
- A strong layout does most of the work. The page already looked good before any animation.
- Merge redundant pages: Gemini Advanced and Gemini for Business sell essentially the same thing. Only three points matter: the cost, that it's a better AI, and that you can upload Docs, Sheets and PDFs.
- Put the purchase CTA inside the card grid as one of the cards, with a gradient stroke, rather than as a separate pop-up block.
- Hover card pattern (from Accenture): on hover, the image blurs and scales up, and extra text appears. It's a classy way to pack in information.
- Edge-case audiences get a small control, not a section. Enterprise is irrelevant to about 98% of visitors (creator's estimate, unverified), so it becomes a tiny button on every plan.
- Off-page carousel: a layout that breaks the box by running off the page edge, with navigation arrows.
- Icons: gradient icons looked worse, and solid Google blue on a bluish-grey gradient card worked better. On hover, the card gets a stroke in the Gemini gradient for a hint of colour.
- Any product that handles user data needs a privacy section (Apple gives privacy a whole page).
- Choose icons that match the brand: a shield feels like Google, while Apple tends to use a lock.
- Iteration is the process. The final CTA took four layouts.
- Don't reuse the same layout for two sections on one page.
- Echo the hero in the final CTA: reuse the prompt bar so the page ends on the same action it opens with.
- He admits the design is not mobile-optimised. Responsive work is still needed.

### Recipes
Before → after, in page order:
1. Hero CTA [00:59–01:31]: plain button → a typeable prompt or search bar filled with mesh gradient, which redirects to login on submit. A search icon is optional. Reason: the visitor is already engaged in an action, and it looks better.
2. Headline [01:31]: generic → "Gemini, the only AI by Google". The four-colour treatment was tried and rejected, and the Google logo now sits on a white background with the Gemini star above the headline.
3. Hero focal point [01:31–02:01]: background shapes (too messy for Google) → the chatbot loading animation built into the bottom of the hero.
4. Feature bento [02:01–02:59]
   1. Remove the section title.
   2. Give each card a header and a hand-written description.
   3. Draft-control and live-information cards: reuse Gemini's own diagrams, lightly edited.
   4. "Creative Powerhouse" card: a person typing a creative prompt into Gemini.
   5. Last card: take a background from a Google search result, place it underneath, and add a blurred duplicate of it for ambience.
5. Page background [02:59–03:01]: flat dark → a gradient of two brand colours (baby blue and pink from the Gemini site) with their brightness pulled far down. Optional faint noise.
6. Gemini images section [03:01–03:31]: the first layout lacked room → he fell back to text-left/image-right → then adapted a section from the Chrome site, kept one element from the earlier design, added a fourth image and chatbot UI pieces.
7. Plans [03:31–04:32]: two near-identical landing pages (Advanced vs Business) → one hover-driven section covering cost, a better AI, and Docs/Sheets/PDF upload. The purchase CTA becomes one of the cards with a gradient stroke. The zoom-in idea came from Chrome's site.
8. Card hover [04:32]: on hover, blur the image, enlarge it, and reveal extra text (from Accenture's site). He built one card image from scratch because no dark-mode version existed.
9. Enterprise [04:32–05:02]: dedicated content → a tiny button on every plan.
10. "Explore the possibilities" [05:02–05:32]: a card row that runs off the page, with arrow navigation reused from an earlier video. The copy is Gemini-generated. Gradient icons → solid Google blue icons, each card gets a bluish-grey gradient background, and hover adds a Gemini-gradient stroke.
11. Privacy [05:32–06:03]: headline "Unparalleled privacy and security", with two deliberately non-parallel lines as a visual pun. Shield icon rather than lock. The first version felt flat, so he added a grid, isometric shapes and blue concentric circles.
12. Final CTA [06:03–06:33], four iterations:
    1. Prompt cards with a typeable bottom card. Felt weird.
    2. A typeable card under the text. Spacing felt wrong.
    3. Collapsed to just the search bar. Still off.
    4. Centred layout. Better, and then the prompt cards moved to the sides as decoration with a gradient applied.
13. Blog [06:33–07:04]: Microsoft's layout was rejected because of its tiny text and because the carousel layout was already used above → a layout from a Google page with images and text, plus arrows so the middle row can scroll.
14. Footer and header [07:04–07:36]: the footer is adapted from the Gemini site's header, and the header uses the same piece with the Google logo swapped for the Gemini logo.

### CSS translation
```css
/* Brand colours are placeholders (--g-blue, --g-pink); the video gives no hex values. */
/* Mesh gradient + subtle noise (derived) */
.mesh {
  background:
    radial-gradient(at 20% 30%, var(--g-blue) 0, transparent 50%),
    radial-gradient(at 80% 20%, var(--g-pink) 0, transparent 50%),
    radial-gradient(at 50% 100%, var(--g-blue) 0, transparent 55%), #0b0b10;
}
.noise { position: relative; }
.noise::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .06; mix-blend-mode: overlay;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}   /* keep opacity low: "not TV static" */

/* Dark-mode brand tint: two brand colours pushed far down in brightness (derived) */
body { background: linear-gradient(180deg, color-mix(in oklab, var(--g-blue) 16%, black), color-mix(in oklab, var(--g-pink) 16%, black)); }

/* Prompt bar as the hero CTA, fully rounded (padding/fill derived) */
.prompt { border-radius: 9999px; padding: 14px 20px; background: rgb(255 255 255 / .06); }

/* Gradient-stroke CTA card (padding-box / border-box trick, derived) */
.card--cta {
  border: 1px solid transparent; border-radius: 24px;
  background: linear-gradient(var(--card-bg), var(--card-bg)) padding-box,
              linear-gradient(90deg, var(--g-blue), var(--g-pink)) border-box;
}

/* Hover: blur + enlarge image, reveal extra copy (Accenture pattern; timings derived) */
.card { overflow: hidden; }
.card img   { transition: transform .5s ease, filter .5s ease; }
.card:hover img { transform: scale(1.08); filter: blur(6px); }
.card .more { opacity: 0; transform: translateY(8px); transition: opacity .35s ease, transform .35s ease; }
.card:hover .more { opacity: 1; transform: none; }

/* Off-page carousel that "breaks the box" (derived) */
.explore { display: flex; gap: 16px; overflow-x: auto; margin-right: calc(50% - 50vw); padding-right: 10vw; }
```

### Gotchas
- Several landing pages selling the same product confuse visitors, so consolidate them.
- A section title stacked over a bento that already explains itself is redundant.
- Too many tabs and embedded videos (Microsoft), and blog text that is too small to read.
- Forcing every brand colour onto the type looked off. Use the logo as the colour carrier.
- Busy background shapes clash with a clean brand style.
- Too much noise reads as TV static.
- Gradient icons looked cheaper than solid brand-colour icons.
- Giving a whole section to an audience of about 2%.
- Reusing an earlier section's layout further down the page.
- Settling on the first CTA layout. It took four tries here.
- Shipping a desktop-only landing page.

### Examples named
- OpenAI: lopsided, dull layout, but its typeable header bar inspired the hero CTA. Its CTA section is weak.
- Microsoft Copilot: too many tabs and videos, a page flow worth borrowing, and a blog layout with tiny text.
- Midjourney: the one AI site he rates.
- Google Chrome landing page: punchy headline, the zoom-in effect, and the section adapted for images.
- Gemini site: illustrations reused in the bento, the baby-blue and pink brand colours, and the header that became the footer.
- Accenture: hover card that blurs and enlarges the image and reveals extra text.
- Apple: a full page devoted to privacy, and its habit of using the lock icon.
- Flaticon: filter by interface icons to get clean, simple ones.

## Redesigning a Finance Dashboard UI from SCRATCH (ft. Dribbble)
- source: Kole Jain · https://youtu.be/Yr2uIcFZDDQ
- type: redesign/breakdown
- tags: dashboard, redesign, critique, hierarchy, layout, grid, sidebar, navigation, cards, charts, saas

### Takeaways
- Many Dribbble dashboards look great but stop making sense up close. Redesign from the content and domain logic outward, not from the visuals.
- Fold check: if content will spill below the fold anyway, don't waste the top of the screen on chrome while the important information sits at the bottom.
- Step one is always a hierarchy audit, and expect to delete elements along the way.
- Split the screen into the top bar and everything else. Moving the top-bar contents into a sidebar frees vertical space and gives you navigation.
- Don't label what is obvious: a "Financial dashboard" title adds nothing.
- Make the data believable. The user was a CEO assistant with no CEO, so give him co-workers and a "manage team" button.
- Remove duplicates and irrelevant features: two search bars that do the same thing become one, and voice dictation doesn't belong in a finance dashboard. The date is optional, so add it only if there's room.
- Don't hide primary content behind a button. If users need their tasks, show them as a section.
- Sidebar order: logo at the top, then the menu icon, then team, with settings pinned to the bottom. The awkwardly placed "add widget" button moves into the sidebar. Design the collapsed state too.
- Merge fragments into the modules they belong to. The system lock goes into the credit-card module (lock the card), and the growth rate and its chart go into annual profits. Delete widgets nobody can explain (the "13 days" card) and bulky, low-value ones (the questionnaire).
- Domain logic beats decoration. A credit card can't receive direct deposits or money, so "direct deposit" becomes "lock card" and "receive" goes.
- Show the object itself: a real card visual with the card number (modelled on the Wise card), in brand colours, with the logo blown up at low opacity as a texture. Swap "monthly fee" for "minimum payment" plus due date, and add a way to scroll to other cards.
- Grid priority: more important modules go higher and further left. Rank each module into high, mid and low tiers as you redesign it.
- Numbers without labels mean nothing, so add context. A chart next to the same growth percentages is repetitive, so drop the chart and show the percentages as chips at each level.
- Chart hygiene (from his earlier chart-redesign video): curved data lines are bad, and fading the data line out is worse. Add grid lines and a time-scale selector.
- Match controls to the dashboard's language: the time-scale slider becomes a dropdown. Add a "compare" button for multiple portfolios and a full-screen icon.
- Investments are low priority, because people like to see them but rarely need them daily.
- The activity manager is the largest and second most important module. Its minimize icon makes no sense on a module that can't shrink, so it becomes an "all activities" button.
- Replace decorative, meaningless pieces (a pretty but useless diagram, tiny-circle pagination) with real use cases: a fraud alert with a warning icon, amount, date and place.
- Keep a nice diagram if it can carry real data. The business-plan diagram is rotated 90°, recoloured, and becomes a bank-loan approval with loan amount and repayment date.
- The tasks module is wide and thin. He first planned four reminders but kept the margins consistent with the other modules, so it shows two cards plus filters, with a big red "all tasks" button and an "add reminder" button next to it. This is effectively the dashboard's call to action, so high priority.
- Data that has no visual gets one. Income and expenses become a diverging bar chart, bars up for income and down for expenses, at the bottom of a card titled "Revenue and expenses" with dollar values and a full-screen icon. High priority.
- Assembly: place high-priority modules first, with the tasks calendar furthest top-left. Of two possible orientations, pick the one that doesn't leave an awkward gap. The mid tier (active cards) comes next, and the low tier goes at the bottom.
- Fill any remaining gap with a missing domain need rather than filler. Here that is a line-of-credit module as a pie chart, with the minor stat (interest payment) moved behind a kebab menu. Data representation makes or breaks a dashboard's UI and UX.

### Recipes
Before → after (reason):
1. Top bar → sidebar [00:59–02:01]: frees vertical space and adds navigation. Order from the top: logo, menu icon, team (avatars and "manage team"), the "add widget" button, and settings at the bottom. Collapsed variant shown on screen.
2. Two search bars → one; dictation mic → removed; "Financial dashboard" label → removed (obvious); date → optional [01:01–01:31].
3. Tasks button → its own tasks module [01:31; built at 06:04–06:34].
4. 12 cards → merge, then delete [02:01–02:31]: system lock → card module; growth rate and chart → annual profits; "13 days" card → deleted; questionnaire → deleted.
5. Credit-card module [02:31–03:32]: "direct deposit" → "lock card"; "receive" → removed; abstract visual → a realistic card with the number (from Wise), brand colours and a large low-opacity logo; renamed; "monthly fee" → "minimum payment" plus due date; plus a control to scroll between multiple cards. Mid priority.
6. Annual profits [04:02–04:33]: unlabeled figures → labelled; chart + growth % → growth % chips per level, with the chart deleted as repetitive. Low priority.
7. Investment chart [04:33–05:04]: from the earlier redesign, straight (not curved, not faded) line, grid lines and a time-scale control. Now the slider → dropdown, plus "compare" and a full-screen icon. Low priority.
8. Activity manager [05:04–06:04]: minimize icon → "all activities"; decorative card and dot nav → fraud alert (warning icon, amount, date, place); business-plan card → bank-loan approval (diagram rotated 90°, recoloured, loan amount, repayment date). High priority.
9. Tasks module [06:04–06:34]: wide and thin, two reminder cards (not four, so margins stay consistent), filters, a big red "all tasks" button and an "add reminder" button beside it. High priority.
10. Income and expenses [06:34–07:04]: text only → diverging bar chart (income up, expenses down) at the card bottom, retitled "Revenue and expenses", dollar values, full-screen icon. High priority.
11. Layout pass [07:04–07:34]: high tier first with tasks top-left, choosing the orientation that leaves no awkward gap; then the mid tier; then the low tier at the bottom.
12. Gap fill [07:34–08:04]: new line-of-credit module. A first layout was dropped in favour of a pie chart, with interest payment behind a kebab menu.

### CSS translation
```css
/* Shell: sidebar + module grid (column count, gap and widths derived) */
.app     { display: grid; grid-template-columns: auto 1fr; min-height: 100dvh; }
.sidebar { display: flex; flex-direction: column; gap: 8px; padding: 16px; }
.sidebar .settings { margin-top: auto; }                 /* settings pinned to the bottom */
.board   { display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px; padding: 24px; align-content: start; }
/* Priority placement: high tier first, top-left; low tier last (grid-area spans derived) */
.m-tasks   { grid-column: 1 / span 8; }   .m-revenue { grid-column: 9 / span 4; }
.m-activity{ grid-column: 1 / span 8; }   .m-cards   { grid-column: 9 / span 4; }

/* Credit-card visual: brand fill + oversized low-opacity logo (opacity derived) */
.cc { position: relative; overflow: hidden; border-radius: 16px; background: var(--brand); color: #fff; }
.cc::after { content: ""; position: absolute; right: -20%; top: 50%; width: 90%; aspect-ratio: 1; translate: 0 -50%;
             background: url(logo.svg) center / contain no-repeat; opacity: .12; }

/* Diverging income/expense bars around a zero line (derived) */
.diverge { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 6px; height: 160px; }
.diverge .col { display: grid; grid-template-rows: 1fr 1fr; }
.diverge .in  { align-self: end;   height: calc(var(--in)  * 1%); background: var(--positive); border-radius: 4px 4px 0 0; }
.diverge .out { align-self: start; height: calc(var(--out) * 1%); background: var(--negative); border-radius: 0 0 4px 4px; }

/* Growth % as chips (sizes derived) */
.chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; font-size: 12px; }
```

### Gotchas
- "Dribbble fashion": widgets that look rich but carry no meaning, such as unlabeled numbers, decorative diagrams, and dot pagination too small to click.
- Actions that contradict the domain, like receiving money on a credit card.
- Duplicate controls (two search bars) and irrelevant features (dictation).
- Titles that state the obvious.
- Fake-looking data, like a CEO assistant with no CEO.
- Primary content hidden behind a button.
- A minimize icon on something that can't get smaller.
- Curved or fading line charts. A chart that repeats nearby percentages.
- Ignoring the fold, with empty chrome on top and key data below.
- A grid orientation that leaves gaps you can't fill, or filling gaps with filler instead of a real need.
- Breaking the shared margins to cram in more items (four reminders instead of two).

### Examples named
- Dribbble: the source shot (creator unnamed), typical of good-looking but illogical dashboards.
- Wise: its card design is the model for the credit-card visual.
- His own earlier chart-redesign video: the source of the line-chart rules (no curves, no fade, grid lines, time scale).

## Mathematically Perfect Typography for Web Design
- source: Kole Jain · https://youtu.be/7sUUzOCv47U
- type: principles
- tags: typography, hierarchy, contrast, responsive, breakpoints, design-system, tokens

### Takeaways
- Typography is several systems that must stay consistent across a UI: pairings, colours, sizes and weights. One sans-serif with a few sizes is a valid start.
- Serif faces have small strokes (serifs) at the ends of letters. They date back to antiquity, so they read as older and more authoritative, and they are said to read better at small sizes, hence their use in print such as books and magazines (creator's claim, unverified).
- Sans-serif faces have no serifs. They look cleaner and more modern, and most everyday interfaces (YouTube, Instagram, X) use them.
- Display faces are for very large text. Their ornament and detail break down at paragraph size. Handwritten faces mimic handwriting and are effectively a kind of display face.
- Anatomy that matters: the baseline (where letters sit); the x-height (lowercase height, measured on "x" because round letters like "e" overshoot the line slightly); and the cap height (measured on flat-bottomed capitals like "E").
- Letter-spacing scales against size: larger text needs proportionally less, smaller text proportionally more.
- You'll reuse the same three fonts for about 90% of projects, and that's fine (creator's claim).
- Font count: one is fully acceptable (many industry sites use one), two is the comfortable maximum, three is pushing it, and four is asking for trouble.
- With one font, it's almost always a sans-serif, unless the site is deliberately old-world.
- Two-font pairings: display + sans (most modern sites), or sans + serif. A handwritten face can stand in for the display face.
- Never set small paragraph text in a display or handwritten face.
- When three fonts work, each has a strict job, as on his portfolio: a display face for headlines (captioned "fola 1", probably Fjalla One, unconfirmed), a sans for UI and body (captioned "AXA Forma", probably Axiforma), and a monospace for small details and image captions (Courier Prime).
- Weight and colour behave alike at small sizes. Fewer dark pixels, whether from a thinner weight or lower opacity, reads as lighter text, so either lever can build hierarchy. He showed one layout using only colour and one using only weight.
- For regular text, avoid extreme weights (ultra-bold, ultra-thin). For text colour, use 100% opacity for primary and somewhere between 40% and 70% for secondary.
- Whatever levers you use, the steps must differ visibly, or there's no hierarchy.
- You should be able to list every text element in rank order (here: header 1, subheadings 2, paragraphs 3) and style from that list.
- The predictable styling (bold full-opacity header, untouched subheads, lightened paragraph) is a trap: the smallest text ends up with the least contrast, which is neither usable nor attractive.
- The better approach: size alone already makes the big header win, so leave its weight and opacity alone. Keep the paragraph at 100% opacity. Make the subheadings bold so they are the scannable layer.
- Sizing: eyeballing one page and building a style guide from it works, but a ratio-based scale is better.
- The golden ratio is about 1.62 (successive Fibonacci numbers divided converge on it). In the simplest case, heading = body × 1.62.
- Multiplying a 16px base by 1.62 repeatedly grows too fast. With four heading sizes plus the paragraph, the largest heading reaches 110px.
- The square root of the golden ratio, 1.27, makes a usable full scale and leaves room for in-between sizes such as subheadings.
- The cube root of the golden ratio (≈1.17, derived) gives a tighter scale for UIs with many text styles (dashboards) or little room (mobile).
- Applying the 1.27 scale to his layout was a subtle but real improvement.
- Responsive type: breakpoints with hand-set sizes get messy. A single CSS formula interpolates between a mobile size and a desktop size across every width. His bounds are 320px (smallest) and 1920px (largest) viewport, adjustable.
- The interpolation line keeps going past both bounds, so wrap it in min/max (a clamp) unless you want type to keep growing on huge screens.
- Line-height moves with size and measure. Smaller text or longer lines need more line-height, and larger text needs less. Body is about 150%, headings about 110–130%. "Auto" falls apart on very large text.
- Always check type on the screen it's intended for.

### Recipes
1. Pair fonts [03:07–04:09]
   1. Decide the count (1–2, at most 3).
   2. Assign roles: display or serif for headlines, sans for everything functional, and optionally a monospace for captions and small details.
   3. Never let a display or handwritten face reach paragraph size.
2. Build the hierarchy [05:41–06:43]
   1. List all text elements in priority order.
   2. Set sizes from the scale.
   3. Don't automatically bold and darken the top level, because its size already wins.
   4. Keep body at 100% opacity.
   5. Bold the mid level (subheads) so it can be scanned.
   6. Use 40–70% opacity only for genuinely secondary text.
3. Ratio type scale [07:13–09:46]
   - Base 16px. Pick the ratio by density: 1.62 (simple header/body pairs), 1.27 (√φ, general websites), ≈1.17 (∛φ, dashboards and mobile).
   - Steps at 1.62: 16 / 26 / 42 / 68 / 110 (the 110 is stated; the others derived).
   - Steps at 1.27: 16 / 20 / 26 / 33 / 42 / 53 (derived).
   - Steps at ≈1.17: 16 / 19 / 22 / 26 / 30 / 36 (derived).
4. Fluid size between two viewports [09:46–11:19]
   - size = min + (max − min) × ((viewport − 320) / (1920 − 320)).
   - Then clamp it: max(lowerBound, …) corrects small results up, and min(upperBound, …) corrects large results down.
5. Line-height [11:19–11:49]: body about 150%, headings about 110–130%, using the lower end for the largest sizes. Raise line-height for small text or long line lengths.

### CSS translation
```css
:root {
  /* √φ scale from a 16px base (derived from the stated 1.27 ratio) */
  --fs-0: 16px; --fs-1: 20px; --fs-2: 26px; --fs-3: 33px; --fs-4: 42px; --fs-5: 53px;
  /* secondary text: 40–70% opacity per video; .6 is a derived pick */
  --text: rgb(17 17 17); --text-2: rgb(17 17 17 / .6);
}

/* Kole's fluid formula, with his 320px → 1920px bounds. --min/--max are unitless px values. */
.fluid {
  --fluid: calc(var(--min) * 1px + (var(--max) - var(--min)) * ((100vw - 320px) / (1920 - 320)));
  font-size: max(calc(var(--min) * 1px), min(calc(var(--max) * 1px), var(--fluid)));   /* his max()/min() caps */
  /* modern equivalent (derived): font-size: clamp(calc(var(--min)*1px), var(--fluid), calc(var(--max)*1px)); */
}
h1.fluid { --min: 33; --max: 53; }    /* example bounds (derived) */

body { font-size: var(--fs-0); line-height: 1.5; color: var(--text); }   /* paragraph ≈150% */
h1   { line-height: 1.1; }                                                 /* headings 110–130%, larger = tighter */
h2, h3 { line-height: 1.25; font-weight: 700; }                            /* subheads: bold for scanning */
.meta { color: var(--text-2); }
```

### Gotchas
- A display or handwritten face at paragraph size, which he calls an absolute design sin.
- Four font families, or a third family with no clear job.
- Ultra-bold or ultra-thin weights for regular text.
- Giving the smallest text the lowest contrast as well.
- Hierarchy steps that are too subtle to read.
- A 1.62 scale over many levels balloons (110px by the fourth heading). Use 1.27 or the cube root instead.
- Unclamped fluid type keeps growing past the intended maximum on large screens and shrinking below the minimum on small ones.
- Leaving line-height on "auto", which breaks down on very large headings.
- Judging type only on the design canvas instead of on the target screen.

### Examples named
- YouTube, Instagram, X (Twitter): everyday interfaces set in sans-serif.
- Books and magazines: serif text for small sizes.
- Google Fonts: the source of most of the free fonts discussed.
- Kole's portfolio: the three-font system (display "fola 1", probably Fjalla One; sans "AXA Forma", probably Axiforma; monospace Courier Prime for captions).
- Arial: the font designers give up and fall back to. Comic Sans: the universally hated face (both jokes).

## Master Figma Auto Layout in 10 Minutes (2022 Tutorial)
- source: Tim Gabe · https://youtu.be/Kf8L3CeiWzQ
- type: tool-tutorial
- tags: figma, auto-layout, layout, spacing, cards, responsive

### Takeaways
- Auto layout is Figma's version of CSS flexbox: a way to structure content.
- There are three reasons to use it. Scalability: wrap a table row in auto layout, then duplicate the row to get a table. Consistency: change the spacing once and every item follows. Control: whether it's 8, 12 or 16px, it's set in one place and applied across the board.
- Add it with Shift+A, or right-click and choose Add auto layout.
- Core settings: alignment, spacing between items, direction (vertical or horizontal), and padding (horizontal, vertical, or each side). Cmd-clicking a padding field lets you edit all sides at once.
- Spacing mode (advanced): Packed keeps items together, and Space between spreads them across the container.
- Strokes (advanced): Included in layout means stroke width counts and pushes content (an 8px stroke shifts the children). Excluded means the stroke doesn't affect the layout.
- Canvas stacking (advanced): first item on top, or last item on top.
- Text baseline alignment (advanced): lines up mixed text sizes on one baseline.
- Resizing, per axis: Fixed doesn't respond when the parent resizes, Fill container stretches with the parent, and Hug (for example on text) grows with the content.
- Absolute position takes one child out of the flow so it can be pinned (for example a tag in a card corner). It replaces the old workaround of nesting a frame just to position something. Tim's favourite feature.
- Build structure by grouping things that belong together into nested auto layouts, then set resizing, then style.

### Recipes
1. Responsive card in auto layout [05:40–09:47]
   1. Parts: tag, image, title, body text, an avatars group with its label, and a button.
   2. Wrap everything in one auto layout, and add a temporary fill so you can see the bounds.
   3. Nest the related items:
      - title + body
      - avatars
      - avatars + their label
      - that group + the button in one horizontal row, placed at the bottom.
   4. Tag: switch on absolute position and pin it to the top-left corner.
   5. Set every layer to Fill container, even ones that may not need it, to guarantee responsiveness. Resize the card to test.
   6. Style it: white fill, corner radius, and Clip content on so the image is clipped to the rounded corners (radius value shown on screen, not stated).
   7. Padding, kept minimal: wrap the text block and bottom row in one more auto layout and pad only that wrapper, so the image stays full-bleed. The new wrapper flips its children to Hug, so set them back to Fill.
   8. Add spacing inside the bottom container and the creators group. Where it's too tight, use 8px.
   9. Add a drop shadow (values shown on screen, not stated).

### CSS translation
| Figma auto layout | CSS (mapping derived) |
|---|---|
| Direction vertical / horizontal | `flex-direction: column` / `row` |
| Spacing between items | `gap` |
| Padding H / V / individual | `padding-inline` / `padding-block` / `padding` |
| Alignment grid | `justify-content` + `align-items` |
| Spacing mode Packed / Space between | `justify-content: flex-start` / `space-between` |
| Strokes included / excluded | `border` (takes up space) / `outline` or `box-shadow: 0 0 0 Npx` (no layout effect) |
| Canvas stacking first on top | CSS paints later siblings on top by default ("last on top"); use `z-index` for first-on-top |
| Text baseline alignment | `align-items: baseline` |
| Fixed / Hug / Fill container | `width: Npx` / `width: fit-content; flex: none` / `flex: 1 1 0` (main axis) or `align-self: stretch` (cross axis) |
| Absolute position | child `position: absolute`, parent `position: relative` |
| Clip content | `overflow: hidden` |

```css
/* The card above. All values derived except the 8px gap. */
.card { position: relative; display: flex; flex-direction: column; overflow: hidden;
        background: #fff; border-radius: 16px; box-shadow: 0 8px 24px rgb(0 0 0 / .08); }
.card > img { width: 100%; display: block; }                                   /* full-bleed: not padded */
.card .tag  { position: absolute; top: 12px; left: 12px; }                      /* absolute position */
.card .content { display: flex; flex-direction: column; gap: 16px; padding: 16px; }   /* the padded wrapper */
.card .row  { display: flex; align-items: center; justify-content: space-between; }
.card .creators { display: flex; flex-direction: column; gap: 8px; }            /* 8px stated */
```

### Gotchas
- Fixed sizing is the usual reason a "responsive" layout doesn't respond. Use Fill container.
- Adding a wrapper auto layout (for padding) resets its children to Hug, which breaks the layout until they are set back to Fill.
- Without Clip content, the image spills past the card's rounded corners.
- An included stroke changes the layout (it pushes content). Exclude it if the stroke should be purely visual.
- The video shows the 2022 Figma UI, where the resizing controls sat at the top right of the auto layout section. Current panel positions may differ (that last point is not from the video).

### Examples named
- none named
