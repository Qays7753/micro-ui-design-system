## 6 UI Hacks I Wish I Knew As A Beginner
- source: Tim Gabe · https://youtu.be/88XxC0_zs74
- type: principles
- tags: typography, hierarchy, spacing, alignment, emphasis, colour, layout, conversion

### Takeaways
- Typography is not only which font you pick but how you use it. Six text and spacing fixes, each applied to one weak layout as a before → after.
- Line height (the space between lines) is one of the fastest ways to go from bad to good:
  - Headings on well-known sites, measured: Google about 1.2× the text size, Dropbox about 1.2×, Uber somewhere between 1.2× and 1.5×.
  - Body text on the same sites: 1.4–1.5× the text size.
  - In both cases, the larger the text, the smaller the line-height multiple.
  - His recommendation: headings 1.1–1.3× the size, body 1.3–1.5× the size.
- Letter spacing (the distance between characters):
  - Headings that look crisp usually have negative letter spacing.
  - Fonts don't ship with negative tracking because it is a headings-only treatment. On body text it quickly hurts readability. Large headings suffer much less.
  - His rule of thumb: −1% to −2% on headings. It depends on the font.
  - If it looks too tight, or you're unsure, err toward the smaller amount.
- Text alignment:
  - A long centred paragraph reads slowly, because the eye has to hunt for the start of every new line.
  - Centring is fine for headings and short chunks of text, and big companies use it a lot.
  - Anything longer than three lines: left-align.
  - Never mix alignments between a heading and its body, e.g. a centred heading over left-aligned body or the reverse.
- Text width:
  - Baymard Institute research: users find long lines intimidating and overwhelming and tend to avoid reading them. More of them then fail to understand the product's benefits and decide it won't meet their needs, so long lines cost conversions (research claim, creator's claim, unverified).
  - Body text: 50–75 characters per line (Baymard's range). His example paragraph is about 18px.
  - In pixels: about 600px on desktop.
- Hierarchy:
  - Using lots of text sizes to show hierarchy quickly looks messy, random and unprofessional.
  - Try hard to stick to two font sizes. Show the rest of the hierarchy with font weight and subtle colour changes.
- Spacing around text ("relationship advice"):
  - Whitespace is an active design element, not a passive background. Consider it as carefully as images, buttons or animation, or more so. (He quotes a typographer the captions render as "John", most likely Jan Tschichold.)
  - Ask how closely elements are related and space them to match. A heading belongs to the body below it, not the body above, so it sits closer to the text below.
  - Use a multiplier: heading to its own body = 1× (16px); previous body to the next heading = 2× (32px).
  - The same logic applies to hero text vs. its call-to-action elements, and to logo vs. links in a nav menu.

### Recipes
1. Line height [02:05–03:39]
   1. Headings: 1.1–1.3× the font size. Use the lower end as the heading gets bigger.
   2. Body: 1.3–1.5× the font size. Again, lower for larger sizes.
2. Letter spacing [03:39–05:11]
   1. Headings: −1% to −2% (font-dependent).
   2. Body: leave it at the default.
   3. When in doubt, use the smaller amount.
3. Alignment [05:11–06:15]
   1. More than three lines: left-align.
   2. Headings and short chunks: centring is allowed.
   3. Heading and body in a block always share one alignment.
4. Text width [06:15–07:49]
   1. Body around 18px: keep lines to 50–75 characters.
   2. On desktop that's a text box of about 600px.
5. Two-size hierarchy [07:49–08:20]
   1. Pick two font sizes for the layout.
   2. Separate the levels inside each size with weight and a subtle colour shift (values shown on screen, not stated).
6. Relationship spacing [08:20–10:28]
   1. Heading → its own body text: 16px (1×).
   2. Previous body text → next heading: 32px (2×).
   3. Reuse the 1× / 2× logic for hero copy → CTAs, and for logo → nav links.

### CSS translation
```css
:root {
  /* two sizes only; the 18px body is from the width tip, the heading size is not stated */
  --fs-body: 18px;
  --fs-head: 40px;                                   /* derived */
  --ink: #111;                                       /* derived */
  --ink-soft: color-mix(in srgb, var(--ink) 70%, transparent); /* "subtle colour change"; amount derived */
  --rel-1: 16px;                                     /* 1× relationship */
  --rel-2: 32px;                                     /* 2× */
}

.heading {
  font-size: var(--fs-head);
  line-height: 1.15;        /* 1.1–1.3 stated; low end because it's large (choice derived) */
  letter-spacing: -0.02em;  /* −1% to −2% stated; Figma % ÷ 100 = em */
  font-weight: 700;         /* weight carries hierarchy, not a third size (value derived) */
}
.label {                    /* second level at body size: weight + colour, no extra size */
  font-size: var(--fs-body);
  font-weight: 600;         /* derived */
  color: var(--ink-soft);
}
p {
  font-size: var(--fs-body);
  line-height: 1.5;         /* 1.3–1.5 stated */
  letter-spacing: 0;        /* no negative tracking on body */
  max-width: min(600px, 60ch); /* 600px and 50–75 chars stated; 60ch derived (ch = width of "0", so real counts run a little higher) */
}

/* alignment: left for anything over three lines; centre only short blocks, and heading + body together */
.prose  { text-align: left; }
.intro-short { text-align: center; }   /* heading and its ≤3-line body share it */

/* relationship spacing: far from what's above, close to what it introduces */
.prose h2 { margin: var(--rel-2) 0 var(--rel-1); }
.prose p  { margin: 0; }
```

### Gotchas
- Large headings left at default letter spacing look loose. Negative tracking on body text hurts readability.
- Long centred paragraphs, and centred headings over left-aligned body (or the reverse). He says never mix them.
- Lines longer than 75 characters: users skip them, which costs understanding and conversions (Baymard claim, unverified).
- Using a new font size for every level of hierarchy.
- Spacing every gap the same, so a heading floats halfway between the paragraph above and the one it introduces.
- Treating whitespace as leftover background instead of a designed element.

### Examples named
- Google: heading line height about 1.2×, body 1.4–1.5×.
- Dropbox: heading line height about 1.2×, body 1.4–1.5×.
- Uber: heading line height 1.2–1.5×, body 1.4–1.5×.
- Baymard Institute: line-length study and the 50–75 character recommendation.
- Jan Tschichold (captions: "John"), most likely the source of the whitespace-as-active-element quote.

## Steal This Landing Page Hero Workflow (Figma Tutorial)
- source: Tim Gabe · https://youtu.be/m3NjcBDqFnA
- type: technique
- tags: hero, landing-page, copywriting, conversion, layout, grid, figma, auto-layout, navigation, buttons, forms, inputs, dark-mode, gradients, glass, inspiration, workflow

### Takeaways
- The hero is your first sales pitch: the first chance to grab attention, speak to the user and get them to convert. It has to be interesting, communicate, sell, and still feel like your own.
- Four steps, in order:
  1. message: what you're saying and how to say it effectively
  2. desired outcome: what you want the user to do
  3. inspiration: the structure and the style
  4. design
  The first three steps are what make the design well thought out.
- The message has three parts: heading, body and visuals. Add only what's needed, which applies to all design.
- Heading:
  - Neither too short and abstract nor too long and drawn out.
  - He aims for 40–60 characters.
  - Build it from the value-proposition keywords. His test case is a personal site with weekly UI design tips on Figma and Framer. He could lead on "UI design tips" or on "Figma and Framer", but "weekly" stays because it is core to the offer. Result: "Weekly UI design tips and tricks".
- Body:
  - Supports the heading by adding context so the point lands.
  - Maximum 140–170 characters; he usually writes much shorter.
  - His example: a plain, direct line saying Figma and Framer tips arrive in your inbox every Wednesday. Simple and clear, nothing fancy.
- Visuals:
  - First decide the balance. Will the visual carry equal, more or less weight than the text? Full-screen and huge with small text, or the other way round?
  - Match the asset to the domain: real photographs where people matter (e.g. HR), 3D illustrations for something techy, regular illustrations, or animation.
  - His case is text-led, so the asset is just the Figma and Framer logos. Simple, but enough for this message.
- Desired outcome: name the one user action, such as book a call, buy a product now, or just browse. A weekly newsletter means a sign-up flow: an input field plus a button.
- Inspiration has two passes, both filtered through the message and the outcome:
  - Structural: only collect heroes with room for your heading, body, CTA and visuals. He uses Lapa Ninja (captions: "ninja").
  - From his structural picks he takes:
    - a narrow grid, which he sees as an increasingly popular trend
    - the visual placed above the text
    - a heading of similar length to his
    - a sign-up form in the hero
    - a CTA in the top right of the nav, a common pattern
  - The references don't have to match exactly. One body is too long and one heading too short; they are guiding direction only.
  - Stylistic: decide the tone, such as lots of colour or simple and clear. For a minimal, chill personal site he chose dark mode, gradients of different sorts, playful colour, and a linear gradient in the background.
- Design means mixing and matching: tweak sizes and positions against the structural references until it works. Use an existing style guide or design system if there is one.

### Recipes
1. Message, outcome and inspiration brief [01:03–06:44]
   1. Heading: 40–60 characters, built from the value-proposition keywords. Keep the differentiator (here "weekly").
   2. Body: at most 140–170 characters, adding context to the heading. Shorter is fine.
   3. Visual: choose its weight relative to the text, then its type (photo / 3D / illustration / animation).
   4. Outcome: one primary action (here, newsletter sign-up = input + button).
   5. Structural references (Lapa Ninja): screenshot only heroes that fit your content blocks. Note the grid width, the visual position, the form placement and the nav CTA.
   6. Stylistic references: theme (dark), colour behaviour, gradients.
2. Narrow grid [07:14–07:44] (Figma)
   1. Draw a rectangle 640 wide as the base. He calls it very narrow.
   2. Add a 12-column layout grid and increase the margin until the columns map to the 640 area.
3. Nav [07:44–09:14]
   1. Logo on the left (his face).
   2. Links in the smallest body text style (Videos, About, Courses), capitalised, in an auto layout with a gap of about 24px (captions garbled).
   3. Top-right button: duplicate a link and give it a background fill, a fixed height and bold text. Use the brand colour, round the corners, then lower the fill opacity for a glassy look. Label: "Join the newsletter".
   4. Wrap everything in an auto layout named "Nav": fixed width, spacing mode Space between, positioned 24px from the top.
4. Copy, visual and background [09:14–10:16]
   1. Paste the heading and body, map them to the grid, and wrap them in an auto layout (gap 32 as heard).
   2. Scale the heading down from the style-guide size if it's too big. It doesn't have to match the style guide exactly.
   3. Centre-align everything.
   4. Place the illustration above the copy with a 72 gap, chosen because it's divisible by 8.
   5. Fill the background with the style guide's linear gradient.
5. Sign-up form [10:16–11:19]
   1. Duplicate the button to make the input and centre it.
   2. Placeholder: an example email address (captions "jane.com"). The address format is what tells the user it's an email field.
   3. Input width: 280, then 320 (heard as "to 80 or maybe 320").
   4. Restyle: one element gets the style guide's linear gradient fill. White text is swapped for a dark colour at reduced opacity, his shortcut instead of picking a proper grey. The captions don't make clear which element gets which; most likely the input's fill and its placeholder text.
   5. Button label "Join for free" plus an arrow icon, centred.
   6. Make the button and input bigger with more padding. He says "64" and "32" (most likely 64 height and 32 horizontal padding; not confirmed). Alignment: Center center.

### CSS translation
```html
<header class="hero">
  <div class="hero__wrap">
    <nav class="nav">
      <a class="nav__logo" href="/">…</a>
      <ul class="nav__links"><li><a href="#">Videos</a></li><li><a href="#">About</a></li><li><a href="#">Courses</a></li></ul>
      <a class="btn-glass" href="#signup">Join the newsletter</a>
    </nav>
    <img class="hero__visual" src="…" alt="">
    <div class="hero__copy">
      <h1>Weekly UI design tips and tricks</h1>   <!-- aim 40–60 chars -->
      <p>…</p>                                       <!-- max 140–170 chars -->
    </div>
    <form class="signup" id="signup">
      <label class="sr-only" for="email">Email</label>
      <input id="email" type="email" placeholder="jane@example.com">
      <button type="submit">Join for free <span aria-hidden="true">→</span></button>
    </form>
  </div>
</header>
```
```css
.hero {
  background: linear-gradient(180deg, var(--grad-from), var(--grad-to)); /* the style guide's linear gradient; stops not stated */
  color: var(--text-on-dark);   /* dark mode */
  text-align: center;
}
.hero__wrap { max-width: 640px; margin-inline: auto; }  /* the narrow 640 grid; 12 columns, gutter not stated */

.nav { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; } /* Space between, 24 from top */
.nav__links { display: flex; gap: 24px; list-style: none; font-size: var(--body-sm); } /* smallest body style; gap as heard */
.btn-glass {
  display: inline-flex; align-items: center; height: 40px; padding-inline: 16px; /* fixed height; values derived */
  font-weight: 700;
  border-radius: 999px;                                                   /* "round it"; radius derived */
  background: color-mix(in srgb, var(--brand) 25%, transparent);        /* lowered fill opacity = glassy; amount derived */
}

.hero__visual { display: block; margin: 0 auto 72px; }  /* 72 between visual and copy, a multiple of 8 */
.hero__copy { display: flex; flex-direction: column; gap: 32px; } /* as heard */

.signup { display: flex; justify-content: center; gap: 8px; } /* gap derived */
.signup input, .signup button { height: 64px; padding-inline: 32px; } /* 64 / 32 heard; mapping derived */
.signup input {
  width: 320px;
  background: linear-gradient(180deg, #fff, var(--grad-light));    /* "linear gradient, the white"; second stop derived */
}
.signup input::placeholder { color: color-mix(in srgb, var(--dark) 55%, transparent); } /* dark at reduced opacity; amount derived */
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
```

### Gotchas
- Jumping into the design before the message and the desired outcome are defined.
- Headings that are too short and abstract, or too long and drawn out. Body copy that runs past 170 characters.
- Collecting inspiration that can't hold your content blocks (heading, body, CTA, visual).
- Copying a reference exactly. References give direction, not dimensions.
- His own example heading ("Weekly UI design tips and tricks", 32 characters) is shorter than his 40–60 range. Treat the range as a guide (our note).
- Reduced-opacity "glassy" fills over a gradient: check the label contrast on the final background (our note).
- The placeholder alone signals the email field in the mock. In production keep a real (visually hidden) label, as in the snippet (our note).

### Examples named
- Lapa Ninja (captions: "ninja"): structural hero inspiration.
- His own personal site (weekly Figma and Framer tips): the test case.
- Photography for people-led products (HR), 3D illustration for tech products: visual-type examples.
- Figma and Framer logos: the simple hero asset he uses.

## How To Animate Like After Effects in Figma
- source: Tim Gabe · https://youtu.be/nyyuyPSxqww
- type: tool-tutorial
- tags: figma, prototyping, smart-animate, animation, auto-layout, hero, loading, navigation, micro-interaction

### Takeaways
- His claim: for UI motion and even social ads, Figma's Smart animate can replace After Effects. After Effects has a steep learning curve, doesn't integrate with Figma, and makes you leave your design tool (opinion).
- Smart animate animates the differences in a layer between two frames: size, colour, position, opacity, rotation. A hover that grows and recolours an element is the simplest case.
- The rule behind every sequence: an element that animates in must already exist in the frame before. Park it at 0% opacity, or outside a clipping frame. It only needs to be there in the immediately preceding frame. Elements that don't move yet can be left out (he notes the hero image could be removed from frame 1).
- Reveals come from clipping frames. The content moves inside a frame with clipping on, so only the moving part shows.
- A rolling counter is just a clipped frame holding an auto layout of numbers. Only the auto layout's position changes.
- Stagger without timing settings: park the later element further away. The arrow starts further below than the phone, so with the same transition it enters view after the phone.
- Changing only a text layer's content gives a plain fade in/out. To slide text in and out, use separate text layers.
- Loops: the last frame must lead back into the first. Anything the last frame uses has to be present in the first frame too.
- The K key (Scale tool) resizes text and layers proportionally. He uses it to squeeze and re-expand text.
- No durations, easings or triggers are stated (shown on screen, not stated).

### Recipes
1. Hero intro animation, 7 frames [01:35–05:39] (Figma, Smart animate between consecutive frames)
   1. Frame 1: a solid block covers the loader text (the first reveal). The loader text sits behind it. The hero image (0% opacity) is optional here.
   2. → Frame 2: the block no longer covers the text, and the loader text goes from reduced opacity to 100%. The counter is a clipped frame containing an auto layout of numbers.
   3. → next frame: only the numbers' auto layout moves, so the counter rolls from 01 to 99. The hero image is parked below the frame (outside the clip).
   4. → next frame: the image rises from the bottom and covers the screen. The loader text moves up and fades to 0%. The nav bar is parked above the top of the frame.
   5. → next frame: the nav moves down into place. The hero text is present but at 0% opacity and placed a bit lower.
   6. → next frame: the text rises to its final position at 100%. The phone is parked below the frame, with the arrow button parked even further down.
   7. → final frame: the phone and arrow rise into place. The phone shows first and the arrow follows.
2. Looping social ad (Twitter) [05:39–09:46]
   1. Frame 1 already holds everything the last frame uses (the closing text, the images and a small circle), because the animation loops.
   2. The first text line is parked outside the frame on the left and slides in.
   3. The main text is a group of three stacked text layers at 0% opacity, faded to 100%.
   4. Next frame: separate the three layers (spread them apart).
   5. Next frame: squeeze them by scaling down with K.
   6. Next frame: scale them up again and rotate (tilt) them.
   7. The word "fashion" is parked lower at 0% and rises to 100%.
   8. Next frame: "fashion" moves left and the background colour changes. An auto layout of three images, parked below the frame, slides up.
   9. Each following frame: change the text content (a crossfade), reposition the image auto layout so a different image is centred, and change the background colour.
   10. Last frame: the small ellipse grows until everything is white. Frame 1 starts with that circle shrinking away, which closes the loop.

### CSS translation
```html
<div class="intro">
  <div class="loader">
    <span class="loader__clip"><span class="loader__stack"><span>01</span><span>…</span><span>99</span></span></span>
    <span class="loader__cover"></span>
  </div>
  <img class="intro__image" src="…" alt="">
  <nav class="intro__nav">…</nav>
  <h1 class="intro__title">…</h1>
  <img class="intro__phone" src="…" alt=""><a class="intro__cta" href="#">→</a>
</div>
```
```css
/* No timings are stated in the video: every duration, delay and easing below is derived. */
.intro { position: relative; height: 100svh; overflow: hidden; }   /* the frame clips everything parked outside it */

/* 1–2: block uncovers the loader; loader goes from reduced opacity to full */
.loader { position: relative; animation: up-out 600ms ease-in 2000ms both; }
.loader__cover { position: absolute; inset: 0; background: var(--bg); transform-origin: right;
  animation: uncover 500ms ease-out 200ms both; }
.loader__clip { display: block; height: 1lh; overflow: hidden; opacity: .3;   /* clipped frame; .3 derived */
  animation: fade-full 500ms ease-out 200ms both; }

/* 3: the counter rolls by moving the whole stack, nothing else */
.loader__stack { display: flex; flex-direction: column; animation: roll 1200ms ease-in-out 700ms both; }

/* 4: image rises from below and covers; loader moves up and out */
.intro__image { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  translate: 0 100%; animation: settle 800ms cubic-bezier(.22,1,.36,1) 2000ms both; }

/* 5: nav drops in from above the frame */
.intro__nav { position: relative; z-index: 1; translate: 0 -100%; animation: settle 500ms ease-out 2800ms both; }

/* 6: heading parked lower at 0% rises to full */
.intro__title { position: relative; z-index: 1; opacity: 0; translate: 0 32px;
  animation: rise-in 600ms ease-out 3300ms both; }

/* 7: same timing, further start = enters view later (distance-based stagger) */
.intro__phone, .intro__cta { position: relative; z-index: 1; animation: settle 700ms cubic-bezier(.22,1,.36,1) 3900ms both; }
.intro__phone { translate: 0 60vh; }
.intro__cta   { translate: 0 80vh; }

@keyframes uncover   { to { scale: 0 1; } }
@keyframes fade-full { to { opacity: 1; } }
@keyframes roll      { to { translate: 0 calc(-100% + 1lh); } }   /* lands on the last number */
@keyframes up-out    { to { translate: 0 -40px; opacity: 0; } }
@keyframes settle    { to { translate: 0 0; } }
@keyframes rise-in   { to { translate: 0 0; opacity: 1; } }

/* Social-ad loop: the white circle that closes the loop and reopens frame 1 */
.ad { position: relative; overflow: hidden; }
.ad::after { content: ""; position: absolute; inset: 0; background: #fff;
  animation: wipe 6s ease-in-out infinite; }                       /* cycle length derived */
@keyframes wipe {
  0%       { clip-path: circle(75% at 50% 50%); }   /* 75% covers the frame from the centre; position derived */
  8%, 92%  { clip-path: circle(0% at 50% 50%); }
  100%     { clip-path: circle(75% at 50% 50%); }
}
/* Text swap: same-layer content change = crossfade, so stack two spans and fade between them */
.swap { display: grid; } .swap > * { grid-area: 1 / 1; transition: opacity 300ms ease; } /* derived */
.squeeze { scale: .6; } .burst { scale: 1.1; rotate: -6deg; }  /* K-tool squeeze, then scale up + tilt; amounts derived */

@media (prefers-reduced-motion: reduce) {
  .intro *, .ad::after { animation-duration: 1ms !important; animation-delay: 0ms !important; }
}
```

### Gotchas
- An element that isn't in the previous frame pops in instead of animating. Park it first at 0% or outside the clip.
- Reveals and the counter roll only work when the parent frame clips its content.
- Changing text in one layer only crossfades. A slide needs separate text layers.
- A loop jumps if the last frame's state doesn't match how frame 1 begins.
- Smart animate pairs layers by name across frames. Renamed layers just crossfade (our note).
- The distance-based stagger finishes both elements together. The further one only enters view later. For a true delay, use a separate transition (our note).

### Examples named
- Adobe After Effects: the tool he says Figma replaced for his motion work.
- Twitter: the social-ad format animated in the second demo.

## Become A Self Taught UI/UX Designer in 2023
- source: Tim Gabe · https://youtu.be/lgE0ULApU4E
- type: career/business
- tags: career, portfolio, case-study

### Takeaways
- Learn by doing, in order: think like a problem-solver, understand principles (know why a paragraph should stay within 50–75 characters, don't just memorise it), then recreate sites you like pixel-perfect, measuring font sizes, spacing and size contrast, until the reusable patterns show. Build a habit of asking why apps place a button there, hide a feature behind a menu, or leave out a score such as IMDb.
- Solve the right problem first. In Uber's 2018 e-scooter case study, the team started from what riders actually need, and e-bike riders' problems differ from e-scooter riders', so the solutions must too.
- Portfolio: redesign something with an evident, fixable flaw (a local restaurant site rather than Netflix), finish it and publish at least one project. A UX-heavy portfolio sells the thought process (like the early part of Uber's case study); a UI-heavy one showcases the standout visuals (like its later part). Then get an internship next to senior designers for feedback. Willingness and proof of creativity can outweigh a thinner portfolio.

### Recipes
- none (career/business)

### Gotchas
- Memorising principles for exams without understanding them. He says they were gone a week later.
- A half-finished project counts the same as no project.

### Examples named
- Uber e-scooter case study (2018): research-first problem framing (UX half) and polished visuals (UI half).
- Netflix vs. a local restaurant website: pick a redesign target with obvious, fixable flaws.
- Spotify: where he later freelanced, as proof that a small local agency is a fine start.

## tinder made 2 billion by never asking for money up front
- source: Tim Gabe · https://youtu.be/EW3I3cUQw50
- type: product-psychology
- tags: paywall, conversion, psychology, growth, dark-patterns

### Takeaways
- Value-first monetisation: no pop-ups, paywalls or interruptions up front. Let users get value from the free core loop first, then show premium in context.
- Tie each upsell to the user's current state: already getting matches → Boost (pitched as 10× more matches); curious who likes you → Gold, to see likes before matching.
- Upsells never interrupt the core experience. Earning the right to ask by delivering value first is what makes people happy to pay.
- 9.6 million paying subscribers, $2 billion annual revenue, users who "thank" Tinder for premium options, and the highest upsell conversion in the dating industry (creator's claim, unverified).
- related long video: How Tinder’s Design Hacked Society

### Recipes
- none (Short)

### Gotchas
- Paywalls and pop-ups before the user has seen value.
- The framing is openly manipulative: he says Tinder waited until users were "already addicted". Contextual upsells are fine when they add a real capability. Selling relief from curiosity the free tier deliberately withholds (who likes you), or promising "10× more" without data, is a dark pattern.

### Examples named
- Tinder Boost and Gold: contextual premium offers.

## emotional moments reduce churn, not usefulness
- source: Tim Gabe · https://youtu.be/BijUhtGC6I0
- type: product-psychology
- tags: retention, psychology, gamification, habit, dark-patterns

### Takeaways
- Usefulness alone doesn't keep users loyal. Emotional moments are what reduce churn (creator's claim, unverified).
- Duolingo teaches much the same as any basic learning app but feels more alive, fun and addictive. It celebrates progress, makes users feel guilty for missed days, and builds emotional investment.
- You don't need Duolingo's budget to put emotion everywhere. Pick a few key moments and focus the emotional design effort there.

### Recipes
- none (Short)

### Gotchas
- Guilt for missed days is a guilt-trip pattern. Celebrating progress is the part to copy; shaming lapses is manipulative and can backfire.
- No specific moments, motion or copy are given. This Short is a premise only.

### Examples named
- Duolingo: emotional design (progress celebration, streak guilt, emotional investment).

## apple uses the three tap rule to make complex phones feel simple
- source: Tim Gabe · https://youtu.be/xY1a6hcMZE8
- type: product-psychology
- tags: ios, mobile, gestures, navigation, progressive-disclosure, psychology

### Takeaways
- Three-tap rule: keep key actions within three touches. Camera = one swipe; silence a call = one button; pay for groceries = double-click and a glance. Complex features stay hidden until needed.
- Optimise for what users will do, not for everything they can do. Android benchmarks faster on paper, yet iPhone users feel their phones are faster (creator's claim, unverified).
- Choice paralysis: beyond three options, decision speed drops significantly (research claim, creator's claim, unverified). So treat every tab as expensive real estate.
- iOS 17 reached 77% adoption in 6 months vs. 30% for Android 14 after a year (creator's claim, unverified).
- related long video: What Founders Can Learn From Apple's Design Domination

### Recipes
- none (Short; the three-tap audit is in the long video's recipes)

### Gotchas
- The Android 14 figure contradicts the long video, which says 13% after a year. Neither is sourced.
- Adoption rates mostly reflect who controls updates (Apple ships to all devices directly, while Android updates go through manufacturers). They aren't evidence that intuitive UI wins (our note).
- "Beyond three options" isn't a standard threshold. Hick's law describes decision time rising gradually with the number of choices. Use three as a heuristic, not a law (our note).

### Examples named
- iPhone: one-swipe camera, side-button silence, double-click-and-glance payment.

## revealing who users are is what goes viral, not celebrating what they do
- source: Tim Gabe · https://youtu.be/YW-lZvlOJwA
- type: product-psychology
- tags: personalization, growth, psychology, copywriting, cards

### Takeaways
- Shareable moments come from revealing who users are, not from celebrating what they did.
- Spotify Wrapped, every December: the year's personal listening stats as shareable story cards, covering top artists, favourite songs, total minutes listened and quirky insights about the listener's taste.
- Avoid generic milestones like "You completed 10 tasks" or "You're a power user". Users can tell an algorithmic achievement from an authentic one.
- The test: the card should make the user think "this is so me", not "this is so generic".
- Tens of millions of shares a year, and more organic social content than most companies' entire marketing budgets produce (creator's claim, unverified).
- related long video: Viral Design Tricks from Spotify

### Recipes
- none (Short)

### Gotchas
- Generic, activity-count achievements feel hollow and don't get shared.

### Examples named
- Spotify Wrapped: identity-revealing, shareable story cards.

## tinder's celebration strategy became their secret marketing weapon
- source: Tim Gabe · https://youtu.be/UKchSaq_W_8
- type: product-psychology
- tags: micro-interaction, animation, states, gamification, growth, psychology, dark-patterns

### Takeaways
- Turn wins into events. Instead of a plain "You have a new match" notification, Tinder shows a full-screen celebration with confetti and exploding hearts.
- Claimed effects: users start anticipating the celebration, not just the match. Small wins feel big, and users become emotionally invested and come back.
- The celebration screens were so screenshot-worthy that sharing them became free marketing. He calls them the most screenshotted app screens of the 2010s (creator's claim, unverified).
- 75 million active users and 1.6 billion swipes a day (creator's claim, unverified).
- related long video: How Tinder’s Design Hacked Society

### Recipes
- none (Short; the full-screen match modal is in the long video's recipes)

### Gotchas
- He calls it deliberate psychological manipulation that trains users to crave the celebration and makes wins feel bigger than they are. That is reward inflation (a dark pattern). Celebrate in proportion to the win, make the screen quick to dismiss, and lead straight to the useful next step.
- Full-screen confetti needs a reduced-motion fallback (our note).

### Examples named
- Tinder: full-screen match celebration with confetti and hearts.

## if users ignore paywalls, you're asking at the wrong moment
- source: Tim Gabe · https://youtu.be/hWiM5-p6JaM
- type: product-psychology
- tags: paywall, conversion, psychology, onboarding, retention

### Takeaways
- If users ignore paywalls and prompts, the ask is badly timed. "Win mapping" fixes that.
- Peak-end rule: people judge an experience by its most intense moment and its ending, not the average of all moments (research claim, creator's claim, unverified). So when you ask matters more than the ask itself.
- Users are most receptive right after a meaningful win in the app. Put upgrade, rating and share asks there.
- The common miss he sees in strategy calls: asks at random moments, and paywalls, tutorials and forced flows shown when users are likely frustrated or confused rather than at peak satisfaction.
- related long video: Give Me 13 Minutes & I'll Grow Your App (its win-mapping step, almost word for word; not on the given list). The peak-end rule itself is covered in The Tiny Design Rule Behind Top 1% Apps.

### Recipes
- none (Short; the win-map steps are in the related long video)

### Gotchas
- Paywalls, rating prompts and forced tutorials placed at moments of confusion or frustration.

### Examples named
- none named
