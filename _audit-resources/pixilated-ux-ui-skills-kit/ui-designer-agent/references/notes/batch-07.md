## Give Me 13 Minutes & I'll Grow Your App
- source: Tim Gabe · https://youtu.be/v1f9iYZ2GhQ
- type: product-psychology
- tags: growth, conversion, trust, onboarding, progressive-disclosure, psychology, hierarchy, spacing, typography, imagery, copywriting, carousel, micro-interaction, animation

### Takeaways
- Thesis: the app itself can do the growth work. Founders reach for more ads and traffic first, which pours users into a bucket with a hole in it. Even ad spend with a positive ROI leaves revenue on the table. Fix the product funnel first.
- The four-step product funnel, top to bottom:
  1. the 3-second test
  2. the friction sweet spot
  3. win mapping
  4. emotional design
  The quick wins are at the top and the expert tweaks at the bottom.
- Step 1, the 3-second test (first impression):
  - People form an impression in 50 ms and make a trust decision in under 3 seconds, mostly driven by visual design (creator's claim, unverified).
  - A bad first impression can lose 20–30% of new users straight away (creator's claim, unverified).
  - Bad top-of-funnel moments share the same faults: clutter, weak hierarchy, inconsistent spacing, cheap or random imagery, and copy that doesn't say what the user gets.
  - Users with no design eye still feel these faults and lose trust in the company. The creator ties this to "99% of apps" never reaching commercial success (creator's claim, unverified).
  - His team applied the same five fixes to a client website and to another client's App Store screenshots:
    - clean hierarchy
    - generous spacing
    - professional imagery that supports the headline
    - balanced typography
    - clear, outcome-focused copy
  - Treat App Store screenshots as part of the app's design, because they are the first impression.
  - Test question: is the top of the funnel a trust builder or a trust killer?
- Step 2, the friction sweet spot. It applies to the whole app, but onboarding is the first place to look.
  - The usual biggest win is to cut onboarding to the bare bones. That is good advice but a simplification.
  - UX is about the right level of friction, not zero friction. With too much, users give up. With too little, they aren't guided to the value, so they also give up. Some apps strip onboarding down and end up confusing people.
  - Spark (client): the welcome screen became an Instagram-story-style carousel. It reinforces the value proposition without adding onboarding steps. The card setup (the reason users download the app) appears within the first five screens.
  - Crypto trading platform (client): instead of detailed financial breakdowns everywhere, the secondary-but-important data sits inside expandable tooltips.
  - The tempting alternatives were wrong in both cases: showing all the data "to remove friction", or giving each carousel slide its own onboarding screen so nobody misses the value.
  - Product-led growth comes from showing just enough to create value without overwhelming. Whether that means a carousel or a tooltip depends on the balance your app needs.
- Step 3, win mapping:
  - Once users are engaging with core features, they can be turned into paying customers or advocates, and timing decides it.
  - It rests on the peak-end rule: people judge an experience by its most intense moment and its ending, not by the average. So when you ask matters more than what you ask.
  - Users are most receptive right after a meaningful win.
  - The common miss: upgrade, rating and share prompts at random moments, and paywalls, tutorials and forced flows shown when users are most likely frustrated or confused.
  - Lending/borrowing platform (client): in the early UX phase the team mapped where in each flow users hit their biggest wins. They then amplified those moments with emotion, so users want to return the favour or brag.
- Step 4, emotional design:
  - Designs that deliberately evoke positive feelings through motion, feedback and human touches are remembered, recommended and revisited far more than purely functional ones (creator's claim, unverified).
  - An app that only solves the problem creates no attachment, so users leave for a competitor's Black Friday sale.
  - Goal: a high-quality, reinforcing experience at the right moments, so the app becomes irreplaceable.
  - AI client: voice-connected audio waves make standard transcription tech feel alive and responsive. It's a small touch, but it sets the app apart.
- One line per step:
  1. Design for immediate trust.
  2. Balance information disclosure across the whole app.
  3. Map the peak moments and make them count.
  4. Build stickiness and loyalty through emotion.

### Recipes
1. 3-second first-impression audit [01:34–04:10] (applies to the landing page, App Store screenshots and the first app screen; no values stated)
   1. Hierarchy: one clear focal point and reading order.
   2. Spacing: generous and consistent.
   3. Imagery: professional, and supporting the headline rather than decorating.
   4. Typography: balanced sizes and weights.
   5. Copy: states the outcome the user gets.
   6. Verdict: trust builder or trust killer.
2. Story-style welcome carousel, as narrated for Spark [05:45–06:46] (no visual values stated)
   1. Keep the welcome as one screen holding several story-style slides that restate the value proposition.
   2. Don't split the slides into separate onboarding steps.
   3. Bring the core setup (here, card setup) within the first five screens.
3. Expandable tooltip for secondary data, as narrated for the crypto platform [06:16–06:46]
   1. Show the primary figures on the surface.
   2. Put the secondary-but-important breakdown inside an expandable tooltip next to the figure it explains.
4. Win map [07:48–09:51]
   1. Lay out each flow and mark where the user hits a meaningful win (the peaks).
   2. Move the asks (upgrade, rating, share) to right after those peaks.
   3. Remove asks, paywalls, tutorials and forced flows from moments of likely frustration or confusion.
   4. Amplify each peak with emotional design (step 4).
5. Voice-reactive waveform, as narrated for an AI transcription client [11:25–11:55]
   1. While the mic is live, show audio-wave bars driven by the user's voice, so the tech visibly responds.

### CSS translation
```html
<!-- Story-style welcome carousel: one onboarding screen holding several slides. All values are (derived). -->
<section class="story" aria-roledescription="carousel" aria-label="Welcome">
  <div class="story__progress" aria-hidden="true"><span class="is-done"></span><span class="is-active"></span><span></span></div>
  <div class="story__track">
    <article class="story__slide">…</article>
    <article class="story__slide">…</article>
    <article class="story__slide">…</article>
  </div>
</section>

<!-- Expandable tooltip for secondary data (derived) -->
<details class="data-tip">
  <summary>Fees <!-- info icon --></summary>
  <div class="data-tip__body">…secondary breakdown…</div>
</details>

<!-- Voice-reactive waveform: bar heights come from live mic levels (derived) -->
<div class="voice-wave" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
```
```css
.story { position: relative; }
.story__track { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; }
.story__slide { flex: 0 0 100%; scroll-snap-align: start; }
.story__progress { position: absolute; inset: 12px 16px auto; display: flex; gap: 4px; z-index: 1; }   /* (derived) */
.story__progress span { flex: 1; height: 3px; border-radius: 2px; background: rgb(255 255 255 / 0.35); } /* (derived) */
.story__progress .is-done, .story__progress .is-active { background: #fff; }

.data-tip summary { cursor: pointer; list-style: none; }
.data-tip__body { margin-top: 8px; padding: 12px; border-radius: 12px; font-size: 14px; }             /* (derived) */

.voice-wave { display: flex; align-items: center; gap: 3px; height: 32px; }                              /* (derived) */
.voice-wave span { width: 3px; height: calc(4px + var(--level, 0) * 28px); border-radius: 2px;
  background: currentColor; transition: height 80ms linear; }                                             /* (derived) */
@media (prefers-reduced-motion: reduce) { .voice-wave span { transition: none; } }
```
```js
// Drive --level (0–1) per bar from the mic with a Web Audio AnalyserNode (derived)
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const ctx = new AudioContext();
const analyser = ctx.createAnalyser(); analyser.fftSize = 64;
ctx.createMediaStreamSource(stream).connect(analyser);
const data = new Uint8Array(analyser.frequencyBinCount);
const bars = document.querySelectorAll('.voice-wave span');
(function tick() {
  analyser.getByteFrequencyData(data);
  bars.forEach((b, i) => b.style.setProperty('--level', data[i] / 255));
  requestAnimationFrame(tick);
})();
```

### Gotchas
- Spending on acquisition while the product leaks users.
- Assuming the first impression is fine when it has clutter, weak hierarchy, uneven spacing, cheap-looking imagery or copy that doesn't state the outcome.
- Stripping onboarding so far that users aren't guided to the value.
- Putting every data point on screen in the name of removing friction.
- Turning each value-prop slide into its own onboarding step.
- Asking for upgrades, ratings or shares at random moments, or right after a moment of frustration.
- Stopping at functional.
- My note, not the creator's: timing an ask after a real win is fair. It becomes manipulative when the "win" is manufactured to trigger the ask, or when the prompt is hard to dismiss. Keep a clear "not now", and only ask after value the user actually got.
- Evidence quality: the cases are the creator's own agency client work, and every figure is unverified.

### Examples named
- Spark (client app): story-style welcome carousel; card setup within the first five screens.
- Unnamed crypto trading platform (client): secondary data inside expandable tooltips.
- Unnamed lending and borrowing platform (client): win moments mapped in early UX, then amplified with emotion.
- Unnamed AI client: voice-connected audio waves on transcription.
- Unnamed client website and App Store screenshots: the five first-impression fixes.

## How Netflix Made Us All Binge (Design Breakdown)
- source: Tim Gabe · https://youtu.be/hIm3d3JAsPw
- type: redesign/breakdown
- tags: psychology, personalization, retention, habit, micro-interaction, states, copywriting, onboarding, experimentation, growth, dark-patterns

### Takeaways
- Framing: Netflix became a $400 billion company through three behavioural design moves, not content budgets (creator's claim, unverified).
- History:
  - 1997: DVD-by-mail.
  - 2007: streaming launched with a basic UI of generic grids, soulless thumbnails and no discoverability.
- The real problem streaming created was choice paralysis. With DVDs you'd spend days choosing. With thousands of titles available instantly, users browsed for about 30 minutes, got overwhelmed and gave up (creator's claim, unverified). It was a psychology problem, not a technology problem.
- Weapon 1, the micro-friction eraser (Skip Intro):
  - About 15% of viewers were manually fast-forwarding through intros, which broke the binge flow (creator's claim, unverified).
  - Micro-frictions compound into UX debt. Each small annoyance adds up until users wonder whether the product is worth the hassle.
  - Netflix built an automated system to detect intro sequences across its whole catalogue. It then added one simple Skip Intro button tied to those detected segments.
  - By 2022 the button was pressed 136 million times a day, saving 195 years of viewing time (creator's claim, unverified).
  - Users who skip intros binge longer (creator's claim, unverified). His arithmetic: a 60-second intro across 10 episodes frees about 10 minutes a night.
  - How to apply it:
    - Map the journey from sign-up to the first success moment.
    - List every point where users pause, get confused or hit friction.
    - Fix the 1–3 biggest.
    - Fixes he names: autofill forms with smart defaults, one-click actions for common tasks, and dashboards pre-populated with sample data instead of empty states.
- Weapon 2, algorithmic intimacy (personalised discovery):
  - In 2015 Netflix launched an AI personalisation engine that made each user's homepage unique, for 230 million users (creator's claim, unverified). The creator himself calls this "psychological manipulation at scale".
  - Personalisation without emotional intelligence feels robotic, and sometimes creepy. Users can tell whether you're pushing features or actually understand what they want.
  - A "Recommended for you" row is surface-level personalisation, and it can make the choice problem worse.
  - Netflix built more than 1,300 micro-genres, such as "emotional crime documentaries" and "feel-good British comedies" (creator's claim, unverified). 80% of what people watch comes from these recommendations (creator's claim, unverified).
  - The point: personalise the whole discovery experience (how the catalogue is cut and labelled), not just which titles appear.
  - His framework:
    1. Identify your 3 main personas by emotional motivation, meaning what they are trying to feel or achieve, not demographics.
    2. Build an "emotional pathway" through the product for each one.
    3. A/B test experiences by behaviour pattern.
    4. Match language, visuals and feature suggestions to the user's emotional state, not just their use case.
  - Pathway examples:
    - a step-tracking app with separate onboarding for fitness beginners and step-count enthusiasts
    - a text-to-speech app with separate paths for accessibility-focused users and multitasking professionals
- Weapon 3, viral UX:
  - When UX becomes part of culture, you get free marketing. "Are you still watching?" and the "ta-dum" sound became memes.
  - Viral features don't happen by accident. Most startups optimise functionality and skip the emotional moments people screenshot, quote or talk about.
  - Netflix shows a percentage match ("97% match") instead of star ratings. It's a personal score that users treat like a dating trophy.
  - Row titles like "Because you watched…" and "Quirky TV shows" read like human conversation rather than algorithm output, so users adopt the language. He credits this conversational UI for "Netflix and chill" (creator's claim, unverified).
  - Playbook:
    1. Find the moment of strongest emotion: success, surprise, relief or accomplishment.
    2. Amplify it with unexpected delight, such as a celebration animation at milestones or a funny error message.
    3. Aim for moments users want to screenshot.

### Recipes
1. Before → after, Netflix's discovery UI as narrated [01:02–10:14]
   - Generic grids and soulless thumbnails (2007) → a homepage unique to each user (2015), to fix discoverability under choice overload.
   - Manual fast-forwarding through intros → one Skip Intro button driven by detected intro segments, removing a repeated micro-friction.
   - A single "Recommended for you" row → many specific micro-genre rows plus "Because you watched…" rows, so choice is narrowed and explained.
   - Star ratings → percentage match, so the score is about fit to this viewer rather than general quality.
2. Contextual skip action [02:32–03:35]
   1. Find a manual workaround users keep repeating (Netflix's signal: 15% fast-forwarding).
   2. Detect the segment automatically for each item (Netflix: intro detection across the catalogue).
   3. Show one labelled button only while that segment plays; one press jumps to its end. (The video doesn't describe the button's placement or on-screen timing.)
3. Micro-friction audit [04:36–05:07]
   1. Map sign-up → first success moment.
   2. Mark every point where users pause, get confused or meet friction.
   3. Pick the 1–3 biggest and remove them: smart-default autofill, one-click common actions, sample data instead of empty dashboards.
4. Human-sounding discovery rows [06:09–06:41, 09:44–10:14]
   1. Replace the generic recommendation row with specific micro-genre labels that combine mood, genre and origin (e.g. "feel-good British comedies").
   2. Add explanation rows: "Because you watched [title]".
   3. Write row titles in conversational language, not system language.
5. Emotional pathways [06:41–07:42]
   1. Define 3 personas by emotional motivation.
   2. Give each its own path through one flow (onboarding is his example).
   3. A/B test the paths by behaviour pattern, varying copy, visuals and suggested features to fit the emotional state.
6. Screenshot moment [10:14–10:46]
   1. Find the moment of strongest emotion.
   2. Add an unexpected delight there: a milestone celebration or a funny error message.

### CSS translation
```html
<!-- Contextual skip button over a video. Placement, size and colours are all (derived); the video states none. -->
<div class="player">
  <video id="player" src="episode.mp4" controls></video>
  <button class="skip-segment" hidden>Skip intro</button>
</div>
```
```css
.player { position: relative; }
.skip-segment { position: absolute; right: 24px; bottom: 80px; padding: 10px 20px; border: 0; border-radius: 6px;
  background: rgb(255 255 255 / 0.9); color: #111; font: 600 15px/1 system-ui, sans-serif; }   /* all (derived) */
```
```js
// Segment bounds come from per-title metadata (Netflix detects them automatically); fill from your data.
const video = document.getElementById('player');
const skip = document.querySelector('.skip-segment');
const intro = { start: 0, end: 0 };   // seconds
video.addEventListener('timeupdate', () => {
  skip.hidden = !(video.currentTime >= intro.start && video.currentTime < intro.end);
});
skip.addEventListener('click', () => { video.currentTime = intro.end; video.focus(); });
```

### Gotchas
- Tolerating small frictions, which compound into UX debt.
- Treating personalisation as one "Recommended for you" row, which adds choice instead of reducing it.
- Personalisation that feels robotic or creepy because it pushes features rather than reflecting what the user wants.
- Personas built on demographics instead of emotional motivation.
- Counting on viral moments to happen by accident.
- Dark pattern, stated plainly: the creator frames the goal as longer binge sessions and calls personalisation "manipulation at scale". Skip Intro is honest friction removal, because it saves time the user wants saved. Maximising hours watched is a different goal from serving the user. Honest alternative:
  - measure success as finding something worth watching quickly (less browsing)
  - keep natural stopping points
  - let users see and adjust why something is recommended
- My note: a precise-looking score ("97% match") implies a confidence the model may not have. Only show a percentage that reflects a real model, and say what it means.
- Evidence quality: every figure here is unverified. "AI before AI was cool" is the creator's framing of the intro detection.

### Examples named
- Netflix:
  - DVD-by-mail (1997) and the basic streaming grid (2007)
  - the personalised homepage (2015)
  - Skip Intro
  - 1,300+ micro-genres
  - percentage match
  - "Because you watched…" rows
  - "Are you still watching?"
  - the "ta-dum" sound
- Blockbuster: the DVD-era comparison.
- Tinder: the swipe, as another case of UX becoming culture (see its own section below).

## Viral Design Tricks from Spotify (Founder Playbook)
- source: Tim Gabe · https://youtu.be/Tpg0pxKHrCA
- type: redesign/breakdown
- tags: psychology, personalization, ai, growth, retention, habit, copywriting, cards, components, design-system, dark-patterns

### Takeaways
- Thesis: product breakthroughs are magic tricks. Complex tech feels effortless because the user never sees the hard part. Spotify didn't out-tech Apple Music or Amazon Music. It built better experiences around the tech by wrapping it in interfaces people already know and trust.
- The recommender processes millions of data points a second, including listening history, skip patterns, time of day, device and how long each song is played (creator's claim, unverified). Shown the wrong way, that much sophistication overwhelms people.
- Contrast, early Pandora: users had to actively train its recommender through rating-focused design. It worked for some listeners, but others felt they were doing homework.
- Principle 1, the Trojan horse: predictable, invisible moments of delight that turn into habits.
  - Discover Weekly launched in July 2015. Every Monday it gives each user a fresh 30-song playlist of tracks they haven't heard but are likely to love.
  - It looks exactly like any other playlist, with the same interface and the same play buttons. The tech is invisible.
  - Behind it: listening history, what similar users enjoy, acoustic analysis of songs and dozens of other signals, processed in real time.
  - Founders are tempted to show off advanced tech. That makes the tech the hero. Make the user the hero instead: users want to feel understood and delighted, not to interact with algorithms.
  - Results: 100 billion tracks streamed through Discover Weekly and 56 million new artist discoveries a week (creator's claim, unverified). Apple Music, YouTube Music and Amazon Music copied the pattern.
  - Rule: for your most sophisticated feature, ask what the simplest, most familiar way to use it is. Put AI inside patterns users already have rather than building a new interface for it.
  - His examples:
    - Email filtering: make the AI work silently inside the user's existing Gmail so mail simply arrives better organised, instead of a new AI inbox.
    - Search: have the AI improve the ordinary search bar so results are relevant before the user finishes typing, instead of a separate AI search.
  - Success test: users think "this just works", not "this technology is complex". They forget they're using AI.
- Principle 2, the vanity mirror: experiences that invite users to show off.
  - Wrapped arrives every December. It presents the year's personal listening stats as shareable story cards: top artists, favourite songs, total minutes listened and quirky insights about the user's taste. Private habits become a public celebration.
  - Trap: generic milestones ("You completed 10 tasks", "You're a power user") feel hollow and algorithmic. They say nothing about the person, only that they used the app.
  - Wrapped works because the insights reveal identity. Top genres tell a story about you, and a top artist starts a conversation. The person sharing is promoting themselves; Spotify is only the vehicle. It gets tens of millions of shares a year (creator's claim, unverified).
  - Rule: celebrate who users are, not what they did. Ask what your data reveals about their personality, habits or character that they'd be proud to share.
  - His rewrites:
    - Productivity: instead of "you completed 25 tasks", a night-owl identity line (someone who does their best work after 9 p.m.).
    - Fitness: someone who turns up for the Monday session even in the rain.
  - Aim: hold up a mirror that shows users something interesting about themselves, maybe something they didn't know, so they become the hero of their own story.
  - Caveat: viral moments like Wrapped only work once users are already attached to the product.
- Principle 3, the comfort trap: design consistency as the moat.
  - Spotify's valuation went from $8 billion two years before its 2018 listing to over $25 billion at it. Analysts credit its personalisation and seamless UI for loyalty (creator's claim, unverified).
  - Apple Music could eventually match the catalogue and even beat the specs, but not the habit-forming consistency.
  - The founder mistake is trying to out-feature or out-spend rivals. In crowded markets users sometimes switch on feeling rather than features, and a clunky, inconsistent or impersonal product loses however many features it has.
  - What consistency meant at Spotify:
    - every playlist behaves the same
    - every recommendation feels familiar
    - every interaction follows the same logic
  - The aim was never to make devices look identical. It was to make behaviour automatic, so the interface never surprises users in a bad way.
  - Once users know exactly how the product will respond, switching means relearning. That switching cost is what the creator is after (see Gotchas).
  - Spotify has 600+ million users (creator's claim, unverified).

### Recipes
1. Before → after, as narrated [02:03–10:22]
   - Pandora-style explicit training (rate songs to teach it) → passive learning from listening, skips, time of day, device and play duration, surfaced as a normal playlist.
   - A new interface built for the algorithm → the algorithm's output inside an existing object (a playlist) using the same components.
   - Generic usage milestones → identity insights.
2. Trojan-horse delivery, as narrated for Discover Weekly [03:05–05:07]
   1. Package the output as an object users already know (a playlist), reusing the same list rows and play buttons.
   2. Give it a fixed cadence (every Monday) and a fixed size (30 songs) so it becomes predictable.
   3. Fill it only with items that are new to the user and match their taste.
   4. Don't explain the algorithm on the surface.
3. AI inside existing patterns [05:07–06:12]
   1. Identify the surface the user already uses: the inbox, the search bar.
   2. Apply the AI there silently: better-organised mail in the existing inbox, relevance-ranked results as the user types in the existing search bar.
4. Identity share cards, as narrated for Wrapped [07:15–09:18] (no layout values stated)
   1. Format: a sequence of story cards made to be shared.
   2. Content: top artists, favourite songs, total minutes, quirky insights about taste.
   3. Cadence: an annual drop (December).
   4. Copy: each card states something about the person, not a usage count.
5. Milestone-copy rewrite [09:18–10:22]
   1. List your milestones in usage terms ("completed 25 tasks").
   2. For each, find the pattern it reveals: time of day, consistency, conditions.
   3. Rewrite it as a statement about the person (the night-owl and Monday-in-the-rain examples).
6. Consistency pass [12:26–13:29]
   1. List the core objects and actions (playlist, recommendation, play).
   2. Check that each behaves the same everywhere it appears.
   3. Remove any response that surprises users in a bad way.

### CSS translation
```html
<!-- Identity share card. Structure and every value are (derived); the video names no layout.
     The proof line is my addition (see Gotchas): show the data behind the claim. -->
<article class="share-card">
  <p class="share-card__eyebrow">Your year</p>
  <h2 class="share-card__headline">Night owl. Your best work happens after 9 p.m.</h2>
  <p class="share-card__proof">{pct}% of your sessions started after 21:00</p>
</article>
```
```css
.share-card { aspect-ratio: 9 / 16; width: min(100%, 360px); padding: 32px 24px; border-radius: 24px;
  display: flex; flex-direction: column; justify-content: space-between; }                         /* story ratio; (derived) */
.share-card__headline { font-size: clamp(28px, 8vw, 40px); line-height: 1.05; font-weight: 800; text-wrap: balance; } /* (derived) */
.share-card__proof { font-size: 14px; opacity: 0.8; }                                               /* (derived) */
```

### Gotchas
- Making the tech the hero, or building a new interface just for the AI.
- Asking users to train the system (Pandora's "homework").
- Generic milestones that only count usage.
- Engineering a share moment before users are attached.
- Competing on features or spend while the experience is inconsistent.
- The same object behaving differently in different places.
- Dark pattern, stated plainly: the "comfort trap" treats consistency as a switching cost, to make leaving painful. Consistency is good because it reduces learning effort. Using it as lock-in is a business framing, not a user benefit. Honest alternative: earn retention through value, keep user data (playlists, history) exportable, and never add friction to leaving.
- My note: identity statements must be true to the data. A flattering line that fits anyone is the Barnum effect covered in batch-04 ("The Twisted Psychology Behind Top 1% Apps"). Show the data point behind each insight.

### Examples named
- Spotify:
  - Discover Weekly (July 2015, Mondays, 30 songs, standard playlist UI)
  - Wrapped (December story cards)
- Pandora (early): recommender trained through explicit ratings.
- Apple Music, YouTube Music, Amazon Music: copied Discover Weekly. Apple Music matched the content but not the experience.
- Gmail: his example of where invisible AI filtering should live.
- Netflix and Tinder: the vanity-mirror idea in his other breakdowns (sections in this batch).

## What Founders Can Learn From Apple's Design Domination
- source: Tim Gabe · https://youtu.be/doiaMtD80p8
- type: redesign/breakdown
- tags: gestures, ios, macos, micro-interaction, animation, scroll, navigation, progressive-disclosure, design-system, glass, parallax, spacing, psychology

### Takeaways
- Apple's "magic" is a recipe of gesture physics, subconscious cues, micro feedback and maths. The video covers four principles.
- Principle 1, physics and feedback:
  - Rubber-band overscroll: pull past the end of the content and it bounces back. This isn't eye candy. It makes software feel like a real object with weight and momentum.
  - Swipes, taps and pinches follow physical laws, so users don't have to learn them.
  - Apple obsesses over tiny feedback: subtle vibrations, elastic bounces and smooth animation. The bounce at a scroll edge tells you the interface is responsive and alive. These cues make routine tasks feel playful and reliable.
  - Drag and drop was pioneered at Xerox PARC in 1973 and popularised by Apple with the Macintosh (creator's claim, unverified). Grab, move and release map to how we handle real objects.
  - The home indicator, the thin line at the bottom of the iPhone screen, teaches the swipe-home gesture. Over about 10 years Apple moved from a physical home button to a gesture so gradually that most people never noticed being trained, and without any tutorial (creator's claim, unverified).
  - Lessons:
    - Use physics-based feedback: bounce, momentum, friction.
    - Guide behaviour with visual cues instead of instructions.
    - Make major UX changes in steps. Apple didn't drop the home button in the first iOS; it waited until users were ready.
- Principle 2, maths and the senses:
  - Squircles: Apple uses corners with continuous curvature rather than standard rounded rectangles, so the transition into the curve is smoother. Figma now has a dedicated setting for this (corner smoothing; no value stated).
  - The difference is subtle but felt. The corners read soft rather than cheap, and it is part of what separates a $1,000 phone from a $200 knockoff.
  - Sound: the camera shutter and the soft tap on passcode entry confirm that an action registered, which builds trust.
  - Haptics: a calibrated click on a virtual button reproduces the feel of a physical one. The MacBook trackpad doesn't physically move down when you click it.
  - Rule: consistency creates trust. Use mathematical relationships (he names the golden ratio), consistent spacing and precise rounding so proportions feel harmonious.
  - Treat every touch point as the most important one, including voice and haptics as well as the screen.
- Principle 3, what Apple leaves out:
  - Apple was the first major tech company to formalise human interface guidelines. They started as text-based Apple II guidelines and later became graphical, and they shaped how the industry approaches usability, layout and interaction consistency (creator's claim, unverified).
  - iOS 17 reached 77% adoption within 6 months, against 13% for Android 14 after a year. He credits consistent, learnable design (creator's claim, unverified; see Gotchas).
  - The three-tap rule: keep key actions within about three taps. It isn't a hard rule, but iPhone key actions sit in that range:
    - camera: one swipe
    - silence a call: one press of the side button
    - pay in a shop: a double-click and a glance
  - What to steal:
    - Remove everything, then add back strategically.
    - Reveal complexity only when it's needed.
    - Reduce visible options, because every extra choice risks decision paralysis.
    - Hide secondary actions.
    - Make the most frequent actions of most users fast and intuitive.
- Principle 4, ecosystem design:
  - Each of Apple's five main devices works on its own and feels part of a bigger system when combined. Something learned once works everywhere, which lowers cognitive load. He calls this one of Apple's main lock-in factors.
  - Strict adherence to its own guidelines makes Apple predictable. Layered blur, translucency and parallax keep it from feeling boring.
  - Navigation rarely hard-switches screens. Animated transitions carry the user from place to place. That spatial continuity lets the brain build a mental map of where things live, as it would in a physical space.
  - Lessons:
    - Invest in a design system.
    - Establish patterns, then break them only on purpose, never by accident.
    - Design for muscle memory by keeping key actions in consistent places.

### Recipes
1. Before → after, the home button as narrated [03:06–04:37]
   - Physical home button → swipe-up gesture, cued by a thin line at the bottom edge and introduced gradually over years with no tutorial.
2. Physics feedback checklist [01:02–02:36, 04:07–04:37]
   1. Scroll edges: elastic overscroll that bounces back.
   2. Flings: momentum that decays naturally.
   3. Drags: grab, move and release, with friction.
   4. Pair these with subtle haptic and sound confirmation where the platform allows.
3. Teaching a gesture without a tutorial [03:06–04:37]
   1. Put a small, persistent visual affordance where the gesture starts (the home indicator sits on the bottom edge).
   2. Introduce the change in stages across releases, not all at once.
4. Continuous corners in Figma [05:08–06:12]
   1. Use Figma's corner smoothing setting on rounded shapes instead of a plain radius. (No value stated.)
   2. Keep radii consistent across components.
5. Multi-sensory confirmation [06:12–07:13]
   1. A visual state change.
   2. A sound on key actions (shutter, keypad tap).
   3. A haptic click on virtual buttons.
6. Three-tap audit [09:19–10:51]
   1. List the actions most users perform most often.
   2. Count the steps to each, aiming for about three or fewer.
   3. Strip everything non-essential, add back only what earns its place, and move secondary actions behind disclosure.
7. Spatial transitions [12:27–12:57]
   1. Animate between screens so the destination visibly comes from somewhere.
   2. Keep key actions in the same place across screens and devices.

### CSS translation
```css
/* Continuous (squircle) corners as progressive enhancement. The video gives no radius; values are (derived).
   A squircle at the same radius reads tighter than a circular arc, so tune against the Figma comp. */
.card { border-radius: 24px; }
@supports (corner-shape: squircle) { .card { corner-shape: squircle; } }

/* Keep the native elastic bounce on the page scroller; contain it only inside nested panels (derived) */
html { overscroll-behavior-y: auto; }
.sheet__body { overflow-y: auto; overscroll-behavior: contain; }

/* Spatial continuity between pages: same-origin cross-document view transitions (derived) */
@view-transition { navigation: auto; }
.product-thumb.is-active,          /* set on the clicked thumbnail only */
.product-hero { view-transition-name: product-hero; }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*) { animation: none; } }
```
```js
// Haptic tick where supported (Android Chrome); iOS Safari ignores navigator.vibrate (derived)
button.addEventListener('click', () => navigator.vibrate?.(10));
```

### Gotchas
- Treating bounce and micro feedback as decoration and cutting it.
- Using tutorials and coach marks where an affordance could teach the behaviour.
- Big-bang UX changes.
- Plain rounded rectangles with inconsistent radii and spacing. They read cheap even when users can't say why.
- Ignoring the sound and haptic layers.
- Too many visible options, with secondary actions on the surface.
- Hard screen swaps with no spatial continuity.
- Breaking patterns by accident, or moving key actions between screens.
- Treating the three-tap rule as a law. The creator says it's a guide.
- My note: the iOS 17 vs Android 14 adoption gap largely reflects who controls updates (Apple ships them directly; Android updates pass through manufacturers and carriers). It is weak evidence for design learnability.
- Lock-in, stated plainly: the creator calls ecosystem consistency a lock-in factor. Consistency is worth having because it reduces learning. Honest alternative: pair it with interoperability and easy export, so users stay because the system helps them, not because leaving is costly.

### Examples named
- Apple iOS:
  - rubber-band scroll
  - the home indicator and the gradual removal of the home button
  - squircle corners
  - shutter and passcode sounds
  - Haptic Touch
  - three-tap examples: camera swipe, side button to silence, double-click to pay
  - blur, translucency and parallax
  - animated navigation transitions
- MacBook trackpad: a click that doesn't physically move.
- Apple Human Interface Guidelines: from text-based Apple II guidelines to graphical versions.
- Xerox PARC (1973) and the Macintosh: where drag and drop started and where it was popularised.
- iOS 17 vs Android 14: the adoption comparison.
- Figma: the corner smoothing setting.

## The Tiny Design Rule Behind Top 1% Apps
- source: Tim Gabe · https://youtu.be/11h4H3TAGkM
- type: product-psychology
- tags: psychology, retention, onboarding, micro-interaction, animation, states, loading, forms, copywriting, 3d, icons, experimentation

### Takeaways
- The rule is the peak-end rule. Daniel Kahneman found that the brain compresses an experience and recalls how it felt at two points: the peak (the most intense moment) and the end (the last part). The rest is mostly noise (creator's claim, unverified).
- Disney: much of a park day is unpleasant, with 90-minute queues in the sun, rushing between rides and $10 fries. But Disney designs the peaks (surprise character meetings, the last fireworks show of the night) and the ending (the music as you leave). Everything is timed to build to a peak and then wind down to a good ending. About 70% of visitors come back (creator's claim, unverified). If Disney can do this across a 6-hour, $200 day, an app can do it in a few minutes.
- Airbnb (peak = finding the listing; end = booking):
  - It sweats the small stuff: a friendly opening, subtle animations, and tab icons that animate as you switch tabs.
  - The guest's first core peak is finding the right listing. That's where Airbnb adds micro-animations and supporting tags showing what is unique about that specific listing, so the user feels confident and excited.
  - Reserving ends with a slick purchase animation in Airbnb's trademark 3D style.
  - The creator assumes this has been tested for booking rate, given how data-driven the team is. That is his assumption; he gives no evidence.
- Ahead, an Apple Design Award winner (creator's claim, unverified) (peak = a brief built live; end = a kind nudge):
  - Most wellness apps lean on moral pressure or habit dashboards. Ahead guides users kindly from start to finish.
  - First open: a smooth, quiet splash screen sets the mood immediately.
  - Next comes a self-profiling journey, with key questions asked at a measured cadence.
  - The peak isn't a static report. A brief is built in front of the user, so it feels made for them, at the right moment.
  - The end, before the user closes the app: a gentle nudge to come back tomorrow, implying their time mattered.
- Uber (peak = arriving; end = completion plus a chance to reward):
  - Uber has no fancy skeuomorphic icons or animation, but it ends journeys well.
  - After a ride comes a short end flow: the phone vibrates, and the rider gets a double reward opportunity, rating the driver and leaving a tip.
  - It isn't forced; the tone is gentle and polite. The peak (arriving) has already happened, so the end only needs to wrap up a sense of completion.
  - The business loop: tips and ratings help keep drivers on the platform. Better drivers bring riders back more often, which raises demand and makes supply more reliable.
- Principles behind the checklist in Recipes:
  - Place one deliberate peak; don't scatter delight everywhere.
  - Peak first, then design the end. Many apps simply stop, with no closure or sense of "you're done" or "you're doing great".
  - Endings don't have to be fancy, but they must be intentional.
  - Negative moments are as memorable as positive ones, so wait screens, errors and long forms need as much care as the peak.
  - Test variations of the peak and watch the behaviour.

### Recipes
1. Peak-end journey map [07:42–08:45] (tool: FigJam, or sticky notes on a wall)
   1. Lay out every step of the core flow: sign-up → task completion → whatever the end is.
   2. At each step ask: where is the user slowed down? Where might stress peak? Where are the quiet stretches?
   3. Save the map and keep updating it as the product evolves.
2. One well-timed peak [08:45–09:15]
   1. Pick one spot: right after a core task, at a milestone, or where the user is investing a lot of effort.
   2. Add a moment above expectation there: a badge, a sparkle, an animation or surprise copy.
3. Designed ending [09:15–09:46]
   1. Do one of three things: celebrate what was done, encourage what comes next, or reaffirm progress.
   2. Forms he names: a checkmark, a summary card, or a line like "you showed up today. That's huge."
4. Negative-moment pass ("bring out the vacuum cleaner") [09:46–10:17]
   1. Review wait screens, error states and long forms.
   2. Mark where someone might feel stuck or unsure.
   3. Add uplifting microcopy, offer help before the user asks, and use delays as an opportunity instead of dead space.
5. Peak variation test [10:17–10:49]
   1. Vary the timing, emoji vs icon, and animated vs static feedback.
   2. Watch where people drop off and where they linger longer than they need to, and tweak there.
6. App patterns as narrated
   - Airbnb decision screen [03:34–04:06]: on the listing the user is choosing, micro-animations plus tags stating that listing's unique value.
   - Airbnb commit [04:06–04:37]: after Reserve, a purchase-confirmation animation in the brand's 3D style.
   - Airbnb chrome [03:03–03:34]: tab-bar icons animate when tabs switch.
   - Ahead onboarding [04:37–05:39]: quiet splash → self-profiling questions at a measured cadence → brief assembled live → nudge to return tomorrow.
   - Uber post-ride [06:09–07:11]: a vibration on completion → optional rating and tip, in polite, unforced copy.

### CSS translation
```html
<!-- A brief assembled in front of the user (Ahead-style peak) and a drawn checkmark for the end state -->
<ol class="brief">
  <li style="--i:0">…</li>
  <li style="--i:1">…</li>
  <li style="--i:2">…</li>
</ol>
<svg class="done-check" viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
  <path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" fill="none" stroke="currentColor"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```
```css
/* The video gives no timings; every value is (derived). */
.brief li { opacity: 0; transform: translateY(8px); animation: brief-in 400ms ease-out forwards;
  animation-delay: calc(var(--i) * 350ms); }
@keyframes brief-in { to { opacity: 1; transform: none; } }
.done-check path { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 500ms ease-out 200ms forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) {
  .brief li, .done-check path { animation: none; opacity: 1; transform: none; stroke-dashoffset: 0; }
}
```

### Gotchas
- Flows that just stop, with no closure.
- Saving all the magic for the end, or scattering delight everywhere instead of one timed peak.
- Leaving waits, errors and long forms as dead space.
- Moral pressure and habit dashboards in wellness apps (the contrast Ahead avoids).
- Forcing the rating or tip step.
- My note: the peak-end rule shapes memory, so it can paper over a bad middle. The Disney example openly admits the day itself is unpleasant. Use peaks and endings on top of fixing the bad middle (step 4), never instead of it. On tip prompts, make "no tip" as easy as tipping, with no guilt copy.
- Evidence quality: the Kahneman framing, Disney's 70% and Ahead's award are unverified. Airbnb's testing is the creator's assumption.

### Examples named
- Daniel Kahneman: the peak-end research.
- Disney parks: designed peaks (character surprises, fireworks) and ending (exit music).
- Airbnb: animated tab icons, listing tags and micro-animations, a 3D booking animation.
- Ahead: a quiet splash, self-profiling, a brief built live, a come-back-tomorrow nudge.
- Uber: post-ride vibration, driver rating and tip.
- FigJam: his journey-mapping tool.

## The Future of App Design is Invisible
- source: Tim Gabe · https://youtu.be/zRUoPIwCxfw
- type: principles
- tags: ai, trends, saas, dashboard

### Takeaways
- BlackBerry analogy:
  - BlackBerry held almost half the US smartphone market and was used by presidents and CEOs (creator's claim, unverified).
  - It didn't fail because it was bad at building phones. The iPhone changed the interaction layer to touch-first and app-centric, while BlackBerry kept building for the world people were leaving.
- The same shift is happening now. AI makes interfaces less important, as it made the physical keyboard then, so design for outcomes rather than screens.
- The common move, bolting AI features onto legacy interfaces, is wrong even though everyone does it. The task is to rethink what an app is.
- The Browser Company, Arc → Dia:
  - Arc was ambitious, beautiful and innovative, but still built on the old model of how interfaces behave.
  - Rather than iterating on Arc and adding AI, leadership sunset it despite backlash and built Dia.
  - Dia doesn't offer a better browsing experience. It delivers the outcomes of browsing without making you browse: you ask, it answers, and the flow collapses.
- Outcome-first design isn't new. What's new in the AI era is that the journey itself can disappear.
- Intercom → Fin:
  - Intercom was already a category leader, with clear product-market fit, strong brand equity and thousands of customers.
  - Within a week of ChatGPT's launch it paused its roadmap and built Fin, an AI-native product focused on resolving questions instantly (as told by chief product officer Paul Adams, per the creator).
  - Fin still has a dashboard, but it is outcome-first: customers get a direct AI resolution before they reach a help article or a human.
  - Pricing is per resolved ticket, i.e. per outcome.
  - The interface didn't vanish, but its role changed: the outcome comes first and everything else steps aside.
  - Fin is Intercom's fastest-growing product ever and now its main focus (creator's claim, unverified).
- With AI you can sometimes skip steps entirely. The work is deciding which flows qualify.
- The matrix has two axes: the value delivered (utility vs experience) and the core task (repetitive vs nuanced). Plot the whole product or individual flows.
  - Repetitive, mechanical, rule-based and utility-focused flows are the "AI danger zone". These interfaces will be automated, removed or rebuilt.
  - Adobe Premiere example: trimming gaps, fine-tuning audio, syncing tracks and removing silences are all automatable. For a new editing app the question isn't "how do we make the timeline easier?" but "does the user need to touch the timeline at all?"
  - Emotion-oriented, judgement-heavy flows, or ones where the interaction itself is the value, are low AI risk.
  - Games example: the play is the goal. AI can amplify it (adjust difficulty, generate narrative) but won't replace the UI or take the human out of the loop. Designing for delight matters even more here.
  - The deciding question is not whether AI can replace the interface. It's whether the interface exists only to reach an end, or whether it is the experience.
- Edge cases where invisible UI shouldn't win:
  - Private information in a public place, such as checking a bank balance in a co-working space. The user won't want to say it aloud or hear it read back. Voice steps back, and AI works in the background: flagging unusual transactions, predicting upcoming bills, nudging when spending spikes.
  - Information-heavy interfaces such as investment dashboards. Users compare several data points side by side, scan visual patterns and make fast decisions, so the UI stays visible and flexible. AI adds trend summaries, recommended actions and highlighted anomalies.
- These are exceptions. The default assumption should be that you haven't thought hard enough about outcomes and which steps to cut.

### Recipes
1. Before → after, as narrated [02:39–05:46]
   - Arc (better browsing) → Dia (ask and get the answer, without navigating).
   - Intercom (help articles and human reps first) → Fin (direct AI resolution first, dashboard secondary, priced per resolution).
2. AI-exposure matrix [06:17–08:58]
   1. List the product's flows.
   2. Classify each one: is the value utility or experience? Is the task repetitive or nuanced?
   3. Repetitive + utility: plan to automate or remove the interface and redesign around the outcome. Ask whether the user needs to touch this surface at all.
   4. Nuanced + experience (or interaction-as-value): keep the interface, use AI to amplify it, and invest in delight.
   5. The video only describes these two corners, not the mixed quadrants.
3. Edge-case check [08:58–09:59]
   1. Is the data private while the setting may be public? Keep a visual, silent UI, and let AI work in the background through alerts and predictions.
   2. Does the task need side-by-side comparison and fast visual scanning? Keep the dashboard and layer AI summaries, recommended actions and anomaly highlights on top.
4. Outcome-first structure, as narrated for Fin [04:44–05:46]
   1. First response: a direct resolution.
   2. Fallbacks: help articles, then a human.
   3. Measure (and in Fin's case price) by resolved outcomes.
5. Step-cutting questions [09:59–10:29]
   1. What is the quickest line between the user and the outcome?
   2. Which parts of that journey are mechanical and slow today?
   3. Which parts would users happily never do again?
   4. Design the fastest, least distracting path to the outcome, even if the path disappears entirely.

### Gotchas
- Bolting AI features onto a legacy interface (the BlackBerry trap).
- Iterating on a product built on the old interaction model just because users love it.
- Polishing a step (the timeline) that AI could remove.
- Removing the interface where the interaction is the value (games).
- Voice or spoken output for private data in shared spaces.
- Hiding comparison-heavy data behind a chat.
- Thinking in screens instead of outcomes.
- My note, not the creator's: AI-first support turns into a bot wall if the path to a human is hidden. Keep escalation to a person visible at every step, and let the user confirm when an issue is actually resolved.
- Evidence quality: the BlackBerry market share and Fin's growth are unverified, and the Paul Adams account is relayed second-hand.

### Examples named
- BlackBerry vs the iPhone (Steve Jobs' keynote): the shift in interaction layer.
- The Browser Company: Arc (sunset) → Dia, browsing outcomes without browsing.
- Intercom: Fin, an AI-native support product with per-resolution pricing; chief product officer Paul Adams.
- Adobe Premiere: rule-based editing tasks AI can automate.
- Games: the interaction is the value.
- Banking app in a co-working space, and investment dashboards: the edge cases.

## How Tinder’s Design Hacked Society
- source: Tim Gabe · https://youtu.be/4yKtlOWClhA
- type: redesign/breakdown
- tags: gestures, cards, mobile, onboarding, micro-interaction, animation, states, paywall, conversion, gamification, habit, retention, psychology, growth, dark-patterns, accessibility

### Takeaways
- Context: Tinder has 75 million monthly active users and over $2 billion in annual revenue (creator's claim, unverified; the captions garble the user figure as "$75 million").
- Feature-rich incumbents with big budgets and good algorithms already existed: Match.com (with almost a 20-year head start), eHarmony and Plenty of Fish. Tinder overtook them within a few years using psychology, not technology.
- The creator's own framing: great products are "like drugs, but legal ones", and his "dopamine design framework" targets maximum addiction. Read every principle below with that in mind (see Gotchas).
- Principle 1, dopamine micro-dosing (the captions say "micro doing"):
  - Before: online dating was like filling in a job application. You clicked, typed, read long profiles, wrote careful messages and hoped for a reply.
  - After: one gesture, swipe right or left.
  - The point isn't only simplicity. Each swipe opens a small moment of anticipation: a right swipe means hope, a left swipe means control, and a match is a big reward.
  - Matches are rationed: enough to keep users hooked, not so many that they get bored. The creator calls it a slot machine (creator's claim about the mechanism, unverified).
  - Users make 1.6 billion swipes a day, which he says is more than a week of new app downloads across all app stores (creator's claim, unverified).
- Principle 2, onboarding to the aha moment (the first big win in under 60 seconds):
  - Typical onboarding: sign up, write a detailed profile, upload several photos, verify your email, answer personality questions. Every extra step loses users, who go back to TikTok. Most dating apps lost more than 70% of users after the first session (creator's claim, unverified).
  - Tinder: Facebook login, photos pulled in automatically, start swiping. All done in under a minute. The core loop comes first and everything else later.
  - Average session time was 11 minutes, against 3 minutes for competitors (creator's claim, unverified).
- Principle 3, rejection-proof design:
  - Fear of rejection stops people from trying at all. Other apps let you see ignored messages, and profile viewers who never wrote, so every "no" felt personal.
  - Tinder made rejection invisible with double-blind matching. Interest is revealed only when both people swipe right, and nobody learns who passed on them.
  - Tinder makes 26 million matches a day, against thousands for most competitors (creator's claim, unverified). Emotional safety keeps people taking small risks and staying active.
- Principle 4, victory visualisation:
  - A plain "You have a new match" notification plus a list entry makes users numb to wins. There's no emotional investment and no habit, so eventually they delete the app.
  - Tinder made each match a full-screen modal that demands attention, with confetti, animation and exploding hearts.
  - The creator calls this deliberate manipulation that trains the brain to crave the celebration. He says these became the most screenshotted app screens of the 2010s, which made them free marketing (creator's claim, unverified).
- Principle 5, value-first monetisation:
  - Premium pushed immediately or at the wrong moment (pop-ups, paywalls, interruptions) makes users feel tricked. They pay once, then churn.
  - Tinder waited until users were, in his words, already addicted, then offered premium in context:
    - already getting matches → Boost, for "10× more matches"
    - curious who likes you → Gold, to see likes before matching
    - afraid of missing your shot → Super Likes
  - The upsells never interrupt the core loop; they extend it. Tinder has 9.6 million paying subscribers (creator's claim, unverified).
- He closes by saying to design for addiction "in a good way and a moral way", but doesn't say what that means.

### Recipes
1. Before → after, as narrated [03:06–11:27]
   - Form-filling, profile-reading and message-crafting → one card and two swipe directions.
   - A long profile-building onboarding → social login, auto-imported photos and straight into swiping, in under 60 seconds.
   - Visible rejection (ignored messages, lists of viewers) → a double-blind mutual reveal.
   - A "You have a new match" notification → a full-screen celebration modal.
   - Early, interrupting paywalls → contextual upsells tied to the user's current state.
2. Swipe card stack [03:06–04:42] (no motion values stated)
   1. Show one profile card at a time.
   2. A right swipe means interest; a left swipe means pass.
   3. The outcome of a right swipe stays hidden until it is mutual.
   4. A match triggers the celebration screen (recipe 5).
3. Sub-60-second onboarding [05:14–06:16]
   1. Social login.
   2. Import photos from that account.
   3. Drop the user straight into the core loop; profile details come later.
4. Double-blind states [06:47–07:48]
   1. Pending: interest stays private.
   2. Mutual: reveal it to both people.
   3. One-sided: show nothing to either side. No rejection notice and no seen or viewed signals.
5. Match celebration [08:19–09:52]
   1. A full-screen modal over the current screen.
   2. Confetti, animation and exploding hearts.
   3. Designed to be screenshot-worthy.
6. Contextual upsell map [10:25–11:27]
   1. For each premium feature, define the state where it is relevant: matches flowing → Boost; curiosity about who likes you → Gold; worry about missing someone → Super Like.
   2. Offer it only in that state, never as an interruption to swiping.

### CSS translation
```html
<!-- Swipe card with button equivalents. All values are (derived); the video states none. -->
<div class="deck">
  <article class="swipe-card" tabindex="0">…profile…</article>
</div>
<div class="deck-actions">
  <button data-dir="-1" aria-label="Pass">…</button>
  <button data-dir="1" aria-label="Like">…</button>
</div>
```
```css
.deck { position: relative; aspect-ratio: 3 / 4; }                                           /* (derived) */
.swipe-card { position: absolute; inset: 0; border-radius: 16px; overflow: hidden;
  touch-action: pan-y; transition: transform 250ms ease-out; will-change: transform; }       /* (derived) */
.swipe-card.is-dragging { transition: none; }
@media (prefers-reduced-motion: reduce) { .swipe-card { transition: none; } }
```
```js
const card = document.querySelector('.swipe-card');
const THRESHOLD = 100;                 // px to commit a swipe (derived)
const tilt = d => d * 0.05;            // deg of rotation per px dragged (derived)
let x0 = 0, dx = 0;
card.addEventListener('pointerdown', e => {
  x0 = e.clientX; dx = 0; card.setPointerCapture(e.pointerId); card.classList.add('is-dragging');
});
card.addEventListener('pointermove', e => {
  if (!card.hasPointerCapture(e.pointerId)) return;
  dx = e.clientX - x0;
  card.style.transform = `translateX(${dx}px) rotate(${tilt(dx)}deg)`;
});
card.addEventListener('pointerup', () => {
  card.classList.remove('is-dragging');
  if (Math.abs(dx) > THRESHOLD) decide(Math.sign(dx)); else card.style.transform = '';
});
function decide(dir) {                 // 1 = like, -1 = pass
  card.style.transform = `translateX(${dir * 150}%) rotate(${dir * 15}deg)`;   // (derived)
  // send the decision; reveal only when mutual (double-blind), show nothing on a one-sided like
}
document.querySelectorAll('.deck-actions button')
  .forEach(b => b.addEventListener('click', () => decide(Number(b.dataset.dir))));
```

### Gotchas
- Making users fill in a "job application" before they get any value.
- Requiring a complete profile, email verification and personality questions before the core loop.
- Exposing rejection signals.
- Delivering big wins as plain notifications.
- Paywalls before value, or interruptions mid-flow.
- Dark patterns, stated plainly. The framework is openly an addiction design:
  - Rationed matches timed like a slot machine are variable-ratio reinforcement, built to create craving. Honest alternative: show results when they happen, and give the stack a visible, natural end point.
  - "Make wins feel bigger than they are", plus celebration screens designed so users crave them, inflates value. Honest alternative: celebrate in proportion to the win, make the modal quick to dismiss, and lead straight to the useful next step (starting the conversation).
  - Monetising once users are "addicted", with upsells that sell relief from fear of missing out, or from curiosity the free tier deliberately withholds (who likes you), exploits anxiety the product itself creates. Honest alternative: contextual upsells are fine when they add a real capability. State the price and the realistic effect plainly, and don't promise "10× more" without data.
- The honest pattern in this video is rejection-proof design. Double-blind matching protects users, and it is the one to copy.
- My note: auto-importing photos through social login is fast but takes more than it needs. Request the minimum scope and let users choose which photos to use.
- Accessibility: swipe-only decisions exclude keyboard and switch users. Give visible buttons for both directions (as in the snippet above).

### Examples named
- Tinder:
  - swipe card stack
  - Facebook login with photo import
  - double-blind matching
  - full-screen match celebration
  - Boost, Gold, Super Likes
- Match.com, eHarmony, Plenty of Fish: the feature-rich incumbents Tinder overtook.
- TikTok: where users drift back to when onboarding drags on.
