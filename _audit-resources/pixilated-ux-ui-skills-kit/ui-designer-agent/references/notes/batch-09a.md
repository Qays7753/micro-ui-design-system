## 4 levels of UI/UX design (and BIG mistakes to avoid)
- source: Tim Gabe · https://youtu.be/86PGRyQjdzQ
- type: redesign/breakdown
- tags: critique, redesign, copywriting, typography, colour, spacing, grid, alignment, hierarchy, emphasis, charts, gradients, shadows, animation, micro-interaction, ai, career

### Takeaways
- Method: one screen from a real client project (a Web3 voting-rewards screen: claim rewards, commit votes, a bar graph of voting periods) is redesigned four times, at beginner, junior, mid and senior level. Each version is scored pass / half pass / fail on copywriting, visuals, colour, typography and spacing/structure. At beginner level alignment and spacing are scored separately, which makes six criteria.
- The levels as he describes them (creator's claim, unverified):
  - beginner: under a year of experience, unpaid
  - junior: 1–3 years, in-house or $100–500 freelance gigs
  - mid: 3–6 years, potentially $8–10k USD a month on $3–6k projects
  - senior: 7+ years, deals from $20k to over $100k, because seniors design for business metrics as well as looks
- Copywriting:
  - Clarity comes first.
  - Cut words: four words are not needed to say "rewards".
  - A button's label must name the action it performs. If the action is claiming voting rewards, don't label it "earn tokens".
  - Avoid labels that can be misread: "commit time" reads as committing time when the user is committing votes.
  - Senior rule: never repeat a word that a nearby heading or label already says. Don't write "last 10 votes" under a big "Voting" label, or a "claim … rewards" label under a "Rewards" heading. Repetition adds cognitive load and visual clutter, and across a whole app the difference is large.
- Visuals:
  - If unsure, choose simplicity over flashiness. A plain, clear graph helps the user more than a fancy one that is hard to read.
  - Beginners (and some mid-levels) overuse flashy gradients, blur and other effects. Mid-level designers often still overwork visuals, but their trained eye makes it work.
  - Visuals exist to communicate. In the junior version, one red dot against grey bars tells the user where to focus.
  - A junior tell is a trendy skeuomorphic effect built from piles of stacked shadows.
  - Senior rule: put emphasis only on what matters. Reuse one visual pattern to link related parts of the UI: the same pulsing circle marks the commit block and the current voting period in the graph, so the user connects them instantly.
- Colour:
  - Too much strong brand red makes a UI stressful. When everything screams for attention, nothing gets it, not even what you want highlighted.
  - Starting point: 60-30-10. That is 60% neutral (white or light grey), 30% complementary (e.g. black) and 10% brand colour (red here). The beginner screen was roughly the reverse.
  - Mixing colours freely quickly becomes a mess, and overusing a colour strips it of meaning, so being sparing with colour is a core skill for clean UI. The junior overcorrected to almost no red, which made the screen dull.
  - Mid-level: balance the UI with shades and tints of one colour instead of several different colours.
  - Senior: use flat colours instead of gradients. Keep red off the main button, where it reads as an error state. Reserve it for the graph, the rewards icon and the commit indicator.
- Typography:
  - Count the font sizes and weights on the screen. The beginner screen had 6 sizes and 4 weights, which he says can never look great.
  - Fix: cut each count by at least two, to 4 sizes and 2 weights.
  - The senior version uses exactly 4 sizes and 2 weights, plus a monospace version of the same font for big numbers.
  - On the large reward number, the decimal fraction is set at the voting label's heading size. The number can grow without the digits colliding, and no fifth size is added.
- Spacing and structure:
  - Beginners use random values (11px here, 25px there) and misalign elements.
  - 8-point grid: make every number in the design divisible by 8 or 4. So 25px becomes 24px and 11px becomes 12px.
  - Senior structure: related elements are grouped, and spacing is deliberate both between elements and inside them.
- The hidden mistake, which seniors make too: designing only static screens.
  - Treat UI like a movie, joining screens into an experience that is a pleasure to use.
  - As AI multiplies the number of apps, memorable experiences become the easiest way to stand out, and they also raise a designer's price.

### Recipes
1. Five-point screen audit (the scoring frame used throughout)
   1. Copy: is each label as short as possible? Does each button name its real action? Does any word repeat a nearby heading?
   2. Visuals: does every effect communicate something? Is emphasis on one thing only?
   3. Colour: is the brand colour about 10% of the screen? Is it saved for meaningful spots and kept off buttons where it looks like an error?
   4. Type: count the sizes and weights; the target is 4 sizes and 2 weights.
   5. Spacing: is every value a multiple of 4 or 8? Are related items grouped? Is everything aligned?
2. AI copy pass [05:10–05:40]
   1. Screenshot the UI.
   2. Paste it into ChatGPT.
   3. Add context about the project.
   4. Ask for copy that is clear but short.
3. Before → after, level by level
   - Beginner [01:02–04:39], six fails:
     - wordy, mislabelled copy ("earn tokens" on a claim button)
     - a fancy graph that is hard to read, with heavy gradients and blur
     - red everywhere, the reverse of 60-30-10
     - 6 sizes and 4 weights
     - misaligned elements on random spacing (11px, 25px)
   - Junior [04:39–07:44], two half passes:
     - copy still ambiguous ("commit time")
     - the graph now communicates (red dot on grey bars) but still carries a heavy skeuomorphic shadow stack
     - colour so restrained the red barely appears, which is dull
     - type sizes still too big, too small and too many
     - spacing improved but still not systematic
   - Mid [08:14–10:45], five half passes:
     - copy written for a real user
     - visuals good but a bit overworked
     - colour balanced with shades and tints of one hue
     - fewer sizes and weights, though some still off
     - related items grouped on an 8-point grid
   - Senior [10:45–13:50], five full passes:
     - no repeated words
     - a reused pulsing-circle motif links the commit block to the current period in the graph
     - flat colours, with red only on the graph, the rewards icon and the commit indicator
     - 4 sizes and 2 weights, monospace digits for big numbers, decimals set at the heading size
     - deliberate spacing between and inside every element
4. The step beyond static screens [13:50–15:24]
   - Plan the transitions and flow between screens, not just each frame.
   - No technique is given here; he points to his separate video on memorable app experiences.

### CSS translation
```css
:root {
  /* 8-point grid: every value a multiple of 4 or 8 (the video's examples: 25→24, 11→12; steps derived) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px;

  /* exactly 4 sizes and 2 weights (the counts are from the video; the values are derived) */
  --fs-display: 48px;
  --fs-heading: 20px;
  --fs-body: 14px;
  --fs-caption: 12px;
  --fw-regular: 400;
  --fw-strong: 600;
}

/* big number: monospace cut of the same family; decimals reuse the heading size so no 5th size appears */
.reward-amount { font-family: var(--font-mono); font-size: var(--fs-display); font-weight: var(--fw-strong); }
.reward-amount .decimals { font-size: var(--fs-heading); }
/* (derived alternative where no mono cut exists) */
.reward-amount--alt { font-variant-numeric: tabular-nums; }

/* one pulse component reused on the commit block AND on the current bar of the graph (all values derived) */
.pulse { position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--brand); }
.pulse::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; background: inherit;
  animation: pulse 1.6s ease-out infinite;
}
@keyframes pulse { to { transform: scale(2.5); opacity: 0; } }
```

### Gotchas
- Using four words where one label would do, or labelling a button with a different action from the one it performs.
- Repeating a heading's word in the labels beneath it.
- Adding fancy gradients, blur and stacked shadows when you can't pull them off. A clear, simple chart wins.
- Using the brand colour so much that nothing stands out, or so little that the UI goes dull.
- Putting a strong red on a primary button so that it reads as an error.
- Using 6 font sizes and 4 weights.
- Using random spacing values (11px, 25px) instead of multiples of 4 or 8.
- Mid-level relapse: adding layer after layer to visuals again.
- Stopping at polished static screens with no thought for how they connect.

### Examples named
- Phantom Wallet, Airbnb, Duolingo: apps that go past static UI to create memorable experiences.
- Erik D. Kennedy (captions say "Eric"): an article on shading and tinting, linked in the description (title not stated).
- ChatGPT: used to tighten UI copy from a screenshot.

## Design Better Than 99% of UI Designers
- source: Tim Gabe · https://youtu.be/PGQnGEH7c-E
- type: principles
- tags: typography, hierarchy, spacing, grid, layout, sections, landing-page, hero, colour, contrast, imagery, ai, 3d, gradients, shadows, borders, buttons, cards, carousel, framer, resources

### Takeaways
- Seven guidelines, applied one at a time to turn a weak landing page into a strong one: typography, spacing, grids, breaking the monotony, colour, visuals, details. Many good sites rely almost entirely on text plus clean visuals.
- Typography:
  - Use one font as a rule.
  - If you need two, don't invent the pairing. Copy the full text system of a well-designed site that already uses two fonts.
- Type role map:
  - H1 with the largest body size: the hero and call-out sections such as the final CTA.
  - H2: most other section headings.
  - Several headings in one section: step down, H2 for the main heading, H3 for subcategories.
  - Sections that cram in a lot of information (e.g. social proof): headings drop one or two sizes further.
  - Body text: body large goes with H1s, body medium with H2s, body small for small details.
- Spacing:
  - There is no single correct value, so space by relationship. Elements that belong together sit closer than elements that don't.
  - Use a multiplier. If related text elements are 24px apart, the gap from that text group to the buttons is 2×, so 48px.
  - A button and the small text under it belong together, so they go back to 24px.
  - Smaller text calls for a smaller base: in a section with smaller type, use 16px between related text. The icon or image is then pushed away by 2× that base.
  - Between a group of text and an image, leave at least 80–96px. Eyeball it; more breathing room is the safest route.
  - In a wide container, keep text no wider than 600px, or reading suffers.
  - Vertical padding in a section: at least 160px top and bottom.
  - Padding in cards and other small content wrappers: 32px is a baseline that rarely goes wrong.
  - Larger text needs larger spacing.
- Grids:
  - What matters is that the page looks structured. Some top designers get there without tool grid features, but beginners should turn the grid on.
  - Put content in a container with a decent max width, 960px for this design. Most content stays inside it; the exceptions are deliberate grid breaks.
  - Divide the inner content into equal chunks (2×2, 3×3 or 1×1). Because everything sits in the same 960px container, every 2-up block lines up with every other 2-up block, even when you move them around.
- Breaking the monotony:
  - A page that only follows the grid gets monotonous. People like patterns, but they also like the rules being broken now and then.
  - Stick to the grid, then break it. Be predictable, then surprise.
  - Aim for a page rhythm like a wave.
- Typical places to break the grid:
  - logo sliders that run on endlessly
  - a social-proof carousel that starts on the grid's left edge and bleeds out past the right
  - the last CTA section, where after consistent image placement down the page the image moves into open space and the text container is centre-aligned
  - a centre-aligned hero text container
- Colour, three colours only:
  - base: the background
  - primary: CTAs and small details such as icon accents and logotypes
  - neutral: white or dark depending on the theme, for text
  - The only hard rule: base and primary must contrast well.
  - Take the palette from a site you like, or from Coolors or a similar tool.
- Colour hierarchy through opacity:
  - Set text in the neutral colour at about 80% opacity for the largest sizes and 70–60% for smaller sizes, keeping every size readable.
  - Use the primary colour at 5% opacity as the fill of secondary buttons and of cards you want to call out without stealing the show.
- Visuals:
  - A site can be carried by its visuals alone; Wealthsimple would still look great with no text.
  - There's no excuse for bad visuals. Free and cheap sources: Pexels (free video), Figma Community illustration files, 3D assets from the Spline community, Midjourney or DALL·E.
  - Generated assets must match the site's colours so they blend in.
- Details:
  - This is the last stretch, after about 80% of the result is done, and where most pages turn messy, because people pile on everything to add life.
  - His standing rule: keep it simple and minimal.
- The glow trend, which he credits to Linear, is fine if subtle:
  - Make a blurred, faded glow and place it behind a key image.
  - Reuse the same technique at lower opacity as small moments of delight across the page.
- Button depth:
  - Primary buttons: a tiny white inner shadow along the top edge plus a faded drop shadow, so they don't look flat and lifeless.
  - Secondary buttons: a primary-colour border at 5% opacity plus the same shadow.
  - Copy that exact style onto the card components.

### Recipes
1. Borrow a two-font type system [01:02–01:32] (Chrome or Brave, then Framer)
   1. Find a well-designed site that uses two fonts.
   2. Right-click a text element and choose Inspect.
   3. Open the Computed tab and read font-family, font-size, font-weight, letter-spacing and line-height.
   4. In Framer (or your tool), save those settings as a text style.
   5. Repeat for every text style on the reference site. The result is your text style guide.
2. Apply the type roles [01:32–02:32]
   - Hero and final CTA: H1 with body large.
   - Standard sections: H2 with body medium.
   - Subsections inside a section: H3.
   - Dense sections (social proof): headings one or two steps smaller.
   - Fine detail: body small.
3. Relationship spacing [03:04–05:07]
   1. Hero text group: 24px between the related text elements.
   2. Text group to buttons: 48px (2 × 24).
   3. Buttons to the small text below them: 24px.
   4. Next section, which has smaller type: base 16px between related text, and 2 × 16 to the icon or image (32px, derived).
   5. Text group to an adjacent image: at least 80–96px.
   6. Text block max width: 600px.
   7. Section vertical padding: at least 160px top and bottom.
   8. Card and wrapper padding: 32px, more when the text inside is larger.
4. Grid set-up [06:38–07:09]
   1. Turn on the tool's grid feature.
   2. Create a container with a max width of 960px.
   3. Keep most content inside it.
   4. Split the inner content into equal chunks: 2×2, 3×3 or 1×1.
5. Break the grid [07:39–08:39]
   1. Let the logo slider run edge to edge in an endless loop.
   2. Start the social-proof carousel on the container's left edge and let it bleed off the right.
   3. In the final CTA, drop the image into open space and centre-align the text container.
   4. Centre-align the hero text container too.
6. Three-colour palette [09:40–11:13]
   1. Pick a base, a primary and a neutral from a reference site or Coolors.
   2. Check that base and primary contrast well.
   3. Assign them: base to the background; primary to CTAs, icon details and logotypes; neutral to text.
   4. Text opacity: about 80% for the largest sizes, 70–60% for smaller ones.
   5. Secondary buttons and call-out cards: primary at 5% opacity.
7. 30-second Midjourney asset workflow [11:43–12:46]
   1. Name the niche (his example: agriculture).
   2. Choose a style (isometric 3D).
   3. Choose colours that match the site palette.
   4. Write the prompt and include "white background".
   5. Generate a batch and download the images.
   6. In Canva, remove the backgrounds and upscale.
   7. Place the images on the site.
8. Subtle glow [13:17–13:49]
   1. Take the logo, upscale it and blur it heavily.
   2. Place it behind the hero image.
   3. Alternatively, use any shape filled with a linear, radial or angular gradient, then blur it, fade it out and lower its opacity.
   4. Reuse the same glow at lower opacity elsewhere for small moments of delight.
   5. Blur and opacity values are shown on screen, not stated.
9. Button and card depth [13:49–14:21]
   1. Primary button: a tiny white inner shadow at the top plus a faded-out drop shadow.
   2. Secondary button: a primary-colour border at 5% opacity plus the same shadow.
   3. Copy the secondary style onto the cards.
   4. Shadow values are shown on screen, not stated.

### CSS translation
```css
:root {
  /* three colours; actual values come from a reference site or Coolors (not stated, so mapped to your palette) */
  --base: var(--palette-base);       /* background */
  --primary: var(--palette-primary); /* CTA colour, must contrast with --base */
  --neutral: var(--palette-neutral); /* white on a dark theme, dark on a light theme */

  /* text hierarchy from neutral opacity (values from the video) */
  --text-1: color-mix(in srgb, var(--neutral) 80%, transparent); /* largest sizes */
  --text-2: color-mix(in srgb, var(--neutral) 70%, transparent);
  --text-3: color-mix(in srgb, var(--neutral) 60%, transparent); /* smallest sizes */

  --primary-5: color-mix(in srgb, var(--primary) 5%, transparent); /* secondary buttons, call-out cards */
}

.container { max-width: 960px; margin-inline: auto; }
section    { padding-block: 160px; }          /* "at least" 160px top and bottom */
.copy      { max-width: 600px; }              /* readable text width */

/* relationship spacing: base × 2 between groups */
.hero .copy > * + *   { margin-top: 24px; }   /* related text */
.hero .copy + .actions { margin-top: 48px; }  /* 2 × 24 */
.hero .actions + .note { margin-top: 24px; }  /* button + its small print */
.feature .copy > * + * { margin-top: 16px; }  /* smaller type, smaller base */
.feature .copy + .media { margin-top: 32px; } /* 2 × 16 (derived) */
.split { display: grid; grid-template-columns: 1fr 1fr; column-gap: 96px; } /* 80–96px text ↔ image */

.card { padding: 32px; }                      /* baseline; grow with larger text */
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); }

/* break the grid: carousel starts on the container's left edge, bleeds off the right (technique derived) */
.carousel { margin-right: calc(50% - 50vw); overflow-x: auto; }

/* depth: shadow values derived; 5% primary fill and border from the video */
.btn-primary {
  background: var(--primary);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.25), 0 8px 20px -8px rgb(0 0 0 / 0.35);
}
.btn-secondary, .card--callout {
  background: var(--primary-5);
  border: 1px solid var(--primary-5);
  box-shadow: 0 8px 20px -8px rgb(0 0 0 / 0.25);
}

/* subtle glow behind a hero image: "angular gradient" = conic-gradient (blur and opacity derived) */
.glow {
  position: absolute; inset: 10%; z-index: -1;
  background: conic-gradient(from 0deg, var(--primary), transparent 40%, var(--primary));
  filter: blur(60px); opacity: 0.4;
}
.glow--accent { opacity: 0.2; } /* reused elsewhere at lower opacity */
```

### Gotchas
- Pairing two fonts without a proven reference system.
- Giving every gap the same value regardless of how related the elements are.
- Text columns wider than 600px in a big container.
- Cramped sections. When unsure, add breathing room.
- Following the grid so rigidly that every section looks the same.
- Colours that pull attention away from the most important things, or a base and primary with weak contrast.
- Generated visuals whose colours don't blend with the site.
- Overdoing the final details. The glow must stay subtle.
- Flat, lifeless buttons.

### Examples named
- An unnamed "website collection" site: shows how many good sites are mostly text plus clean visuals.
- Wealthsimple: a site carried almost entirely by visuals.
- Linear: credited with popularising the glow effect.
- Coolors: palette generator.
- Pexels (captions say "pixels"), Figma Community, the Spline community, Midjourney, DALL·E: sources for visuals.
- Canva: background removal and upscaling.
- Chrome and Brave DevTools (Computed tab): reading a reference site's type settings.
- Framer: building the text styles and the site.

## How To Design a $5k Website in 5 Minutes
- source: Tim Gabe · https://youtu.be/hCKdIwbhS-s
- type: tool-tutorial
- tags: framer, workflow, landing-page, colour, typography, imagery, ai, freelance, pricing-work, resources

### Takeaways
- Pricing context: sites like this can reach $10k from a freelancer, and roughly $20–28k from an agency, according to a Sortlist study (creator's claim, unverified; the agency figure is unclear in the captions).
- One template can become two sites that look completely different. What makes a template worth a custom-project price is the custom layer on top:
  - a brand-led palette
  - cutting unneeded sections
  - corner shape
  - a background texture
  - a new set of text styles
  - copy
  - custom imagery
- Start from the brand, not the palette. Decide what the brand is first, then let the product suggest the base colour: a high-end chocolate brand gets brown.
- His demo version is not a real client job. A real client still needs their own copy and assets, and possibly branding.

### Recipes
1. Speed-customise a Framer template [01:01–06:16]
   1. Find a good template. He uses a SaaS template made by Framer itself. Copy it and publish it, which gives a working, responsive, animated site at zero cost.
   2. Define the brand first [02:04]. His is an imaginary high-end chocolate brand.
   3. Palette in Coolors [02:04–02:36]: press the spacebar until a fitting brown appears, lock it, then keep generating until the other colours work with it.
   4. Remove the template sections the brand doesn't need [03:06].
   5. Make the shapes squarer by reducing corner rounding [03:06]. Radius values are shown on screen, not stated.
   6. Search the web for a free paper-pattern PNG (captions say "three paper pattern") and set it as a background pattern [03:06–03:38].
   7. Go through every template text style and swap it to free Google Fonts [03:38]. Font names are shown on screen, not stated.
   8. Ask an AI chat assistant for copy [04:10]. It isn't named in the audio.
   9. Generate product mockups (chocolate) in Midjourney [04:10]. This is the one paid step, because Midjourney has a monthly fee.
   10. In Canva, strip the image backgrounds and add shadows [05:12], using Canva's free trial.
   11. Paste the copy into Framer, swap the new images in for the template's assets and reposition them [05:44–06:16].

### Gotchas
- Generating a palette before you know what brand it's for.
- Publishing a template unchanged. It works, but it doesn't justify a custom-project price.
- Treating the 5-minute version as a deliverable. A real client needs unique copy and assets, and maybe branding.

### Examples named
- Framer: its own SaaS template used as the base.
- Coolors: palette generation with spacebar and colour lock.
- Google Fonts: free replacement typefaces.
- Midjourney: product mockup images.
- Canva: background removal and shadows.
- Sortlist: source of the website pricing figures (creator's claim, unverified).

## i'm back, and EVERYTHING is changing
- source: Tim Gabe · https://youtu.be/dg_LmOjapRA
- type: showcase/vlog
- tags: career, ai

### Takeaways
- Nothing reusable. This is a channel update: the creator paused tutorials to run a Web3 design agency (peak of $40k a month, creator's claim, unverified) and plans broader videos on AI and the future of design.

### Recipes
- none (showcase/vlog)

### Gotchas
- none

### Examples named
- none named
