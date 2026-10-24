## The Hidden App Growth Killer (How To Avoid It)
- source: Tim Gabe · https://youtu.be/55hDj88zKa8
- type: product-psychology
- tags: onboarding, retention, psychology, personalization, progressive-disclosure, micro-interaction, forms, mobile

### Takeaways
- Framing: apps lose 77% of users within 3 days on average. The creator puts this down to onboarding, not missing features or weak marketing (creator's claim, unverified). He gives five onboarding patterns, each tied to a psychological principle.
- Pattern 1, value before setup (Breathwrk):
  - Most apps open with friction: account creation, settings, walkthroughs. The user has to work before getting anything back.
  - Breathwrk does the reverse. Onboarding guides the new user straight into a real breathing session, with no setup first, so the first thing they get is a moment of calm.
  - Principle named: the eureka effect, the flash when something clicks. Users who experience the core value inside the first 60 seconds retain significantly better (creator's claim, unverified).
  - Rule: surface the core benefit first. If the product is good, one taste is enough. His analogy is the grocery-store sample booth.
- Pattern 2, do less (Stompers):
  - People only finish multi-step tasks that feel finishable. IKEA instructions show one step at a time because all 12 pages up front would make you give up.
  - Principle named: the Zeigarnik effect (captions: "searic effect"). The creator's version: once people start something, they are more likely to finish it if the next steps look achievable.
  - Stompers greets first-time users with only three steps, after they have already entered the app. There are no input fields and no heavy lifting. The steps only explain the essentials.
  - Onboarding can prepare the user rather than make them do anything. It has worked if they leave thinking "I can do this".
- Pattern 3, learn by doing (a Sudoku app):
  - It skips the rules and hands over the first puzzle with guided hints. By the time it's solved, the user has learned the app.
  - Principle named: trial-and-error learning. People internalise lessons faster and more deeply when they act than when they passively take in information.
  - Meaningful micro-interactions during onboarding reduce bounce and improve how much users remember (creator's claim, unverified).
  - Rule: when the key flow is simple enough, let users do it for real inside onboarding.
- Pattern 4, make it theirs early (Speechify):
  - Analogy: in a new car you adjust the seat and mirrors straight away. The small tweaks make the space feel safer, more comfortable and yours.
  - Speechify walks new users through setting up their reading environment at once: voice tone, highlight preference and listening speed. Rather than showing off features, it asks what suits the user.
  - Principle named: the "familiarity principle" (the creator's label). People trust and engage more with a product that feels personalised, even slightly.
  - Rule: give control early. The sooner the product feels like the user's own, the longer they stay.
- Pattern 5, show progress (Marathon):
  - A form with endless fields and no visible end kills momentum. Seeing "step 2 of 5" brings relief and makes people far more likely to continue.
  - Visual progress cues include progress bars, numbered steps and checklists. Each one hands out a small dose of motivation.
  - Marathon, a social TV-watching app, shows a simple progress bar at the top of onboarding. It isn't flashy, but it's enough to keep people going.
  - Principles named: the peak-end rule and the goal-gradient effect. People push harder when they know how close the finish is.
- The exception to pattern 5 is a flow with many key steps. There, don't reveal the count: a user who sees 12 steps before any value reads it as too much effort and bounces. Typeform doesn't show step counts by default in its long-form templates.
- This is also his answer for products with more than three crucial onboarding steps (the case he defers from pattern 2). Keep the steps, but hide the total until value has landed.
- The sequence he builds: show value, simplify the path, get the user interacting, personalise, then show progress (or hide the count in long flows).

### Recipes
1. Value-first onboarding, as narrated for Breathwrk [01:00–01:30] (no visual values stated)
   1. The first-run flow drops the user into a real core session, here a guided breathing exercise.
   2. No account creation, settings or walkthrough comes before it.
   3. Setup comes after the user has felt the result (implied by the contrast he draws).
2. Three-step welcome, as narrated for Stompers [03:03–03:35]
   1. Show it once the user is already inside the app, not as a gate in front of it.
   2. Use exactly three screens.
   3. No input fields. Each screen explains one essential.
3. Interactive first task, as narrated for the Sudoku app [04:07–04:40]
   1. Skip the rules screen.
   2. Start the first real puzzle with guided hints laid over it.
   3. The user learns the controls by finishing it.
4. Preference setup, as narrated for Speechify [05:42–06:12]
   1. During onboarding, ask for voice tone, highlight preference and listening speed.
   2. Frame each one as "what works for you", not as a feature tour.
5. Progress cue, as narrated for Marathon and Typeform [07:13–08:14]
   1. Short flows: a simple, plain progress bar along the top of each onboarding screen (Marathon).
   2. Long flows: no step counter by default (Typeform long-form templates).

### CSS translation
```html
<!-- Marathon-style top progress bar for a short onboarding flow. All values (derived). -->
<div class="onboarding-progress" role="progressbar" aria-label="Step 2 of 5"
     aria-valuemin="1" aria-valuemax="5" aria-valuenow="2" style="--step: 2; --total: 5">
  <div class="onboarding-progress__fill"></div>
</div>
```
```css
.onboarding-progress {
  position: sticky; top: 0;
  block-size: 4px;                                   /* thin, "not flashy" (derived) */
  background: var(--track);
}
.onboarding-progress__fill {
  block-size: 100%;
  inline-size: calc(var(--step) / var(--total) * 100%);
  background: var(--accent);
  transition: inline-size 300ms ease-out;            /* (derived) */
}
@media (prefers-reduced-motion: reduce) { .onboarding-progress__fill { transition: none; } }
```

### Gotchas
- Front-loading account creation, settings and walkthroughs before the user gets any reward.
- Explaining rules or features when the key flow is simple enough to just do.
- Feature-flash tours instead of asking users what works for them.
- Showing a large step count (his example: 12) before the user has felt any value.
- Hiding the length (my note): leaving out the step count is reasonable, but a long flow must not pose as a short one. Progress bars that jump early then stall, or "almost done" when it isn't, mislead. Honest alternatives: cut steps, show progress by named section, or give a realistic time estimate.
- The principle labels are loose. "Familiarity principle" normally means the mere-exposure effect, not personalisation. Use the patterns, but don't cite the labels as research.

### Examples named
- Breathwrk (captions: "breath work"): onboarding is an actual breathing session.
- Stompers (name as heard in captions): three-step welcome after entering the app, no inputs.
- A Sudoku app (unnamed): first puzzle with guided hints instead of rules.
- Speechify: voice tone, highlight preference and listening-speed setup during onboarding.
- Marathon (social TV-watching app): simple top progress bar in onboarding.
- Typeform: no step count by default on long-form templates.
- Analogies used: grocery sample booths, IKEA instructions, learning to ride a bike, adjusting a new car, government forms.

## Copy These SaaS Growth Tricks (It'll Blow Up Your Business)
- source: Tim Gabe · https://youtu.be/puldme__Ckk
- type: product-psychology
- tags: paywall, pricing-page, conversion, growth, saas, psychology, copywriting, trust, experimentation, mobile, dark-patterns

### Takeaways
- The creator says two moments decide whether a SaaS business grows: the free-trial and paywall flow, and the upgrade. Every result below is an A/B outcome he cites, and the transcript gives no source for any of them (creator's claim, unverified).
- Trial lever 1, make the trial concrete (Blinkist):
  - Blinkist kept the same offer. It explained the 7-day free trial visually, as a step-by-step breakdown of what happens on each day.
  - Why it works: people fear the unknown more than the commitment. Once they know each day's events, the trial feels like a guided walk, not a leap. The creator files this under progressive disclosure.
  - Result: 23% more trial sign-ups (creator's claim, unverified).
  - Rule: let users preview the trial as if it were a 7-day itinerary.
- Trial lever 2, change the word (Headspace):
  - "Trial" carries a sense of obligation and feels transactional. Headspace called it a "30-day guest pass", which reads as an invitation: exclusive, temporary and respectful.
  - Principle named: the framing effect. Result: 7% more new sign-ups from the word change (creator's claim, unverified).
  - Rule: choose copy for the emotion you want users to feel. Don't default to "trial" or any other standard word.
- Trial lever 3, give the best plan an exclusive perk (Moonly):
  - Moonly offered the free trial on the annual plan only and removed it from the monthly plan. The annual plan then looked like the smarter purchase.
  - Principle named: the decoy effect, steering choice through asymmetry. Result: 39% higher conversion rate and 47% more revenue per 100 installs (creator's claim, unverified).
  - Rule: instead of adding plans, give your best plan something no other option has.
- Trial lever 4, one-touch start (Slopes):
  - Slopes replaced a multi-step paywall with a one-touch free trial.
  - Principle named: cognitive load. The more effort someone spends up front, the less likely they are to commit. Result: 25% more trial starts (creator's claim, unverified).
  - Rule: if sign-ups are low, audit the entry point first. Every extra step loses users and revenue.
- Trial lever 5, a longer trial on the bigger plan (Headspace):
  - Monthly subscribers got a 7-day trial and annual subscribers a 14-day one. People compare benefits, not just price, and a longer trial reads as more value even when the extra isn't tangible.
  - Principle named: anchoring bias. Result: a "double-digit" rise in conversions (creator's claim, unverified).
  - Rule: soft perks such as trial length can make high-value plans feel higher value.
- Upgrade lever 1, make locked value visible (Mobbin):
  - Mobbin launched no new paid features. It added "Pro" labels (captions: "batch", i.e. badge) to locked content across the whole product.
  - Principle named: loss aversion. Seeing what they can't touch drives users to upgrade. Result: 35% more free-to-paid conversions (creator's claim, unverified).
  - Rule: show what's missing, not only what users gain. Make value visible through contrast.
- Upgrade lever 2, lock where intent peaks (Busuu):
  - Free users can learn one language. Starting a second one requires an upgrade.
  - Casual users are untouched. Power users hit the wall just as the app becomes more useful to them.
  - Principle named: scarcity. Result: 83% higher conversion among engaged users (creator's claim, unverified).
  - Rule: don't punish beginners with feature locks. Soft-lock at the point where deeper engagement meets higher intent.
- Upgrade lever 3, certainty (Uber):
  - For a long time Uber showed only a price range. It tested a single estimated price, and usage rose.
  - Principle named: the certainty effect. People pick a guaranteed outcome over a possibly better one that comes with unknowns. Result: a "double-digit" rise in rides per user (creator's claim, unverified).
  - Rule: where transparency builds trust, be specific. Uncertainty kills purchase decisions fast.

### Recipes
1. Trial timeline on the paywall, Blinkist [00:32–01:35]
   1. Keep the offer and change only how the trial is explained.
   2. Lay out the 7-day trial step by step, with one entry per stage showing what happens on that day (the entries are shown on screen, not stated).
2. Copy swap, Headspace [02:06–03:07]: "free trial" → "30-day guest pass".
3. Exclusive-perk plan cards, Moonly [03:07–04:10]
   1. Offer two plans, monthly and annual.
   2. Attach the free trial to the annual plan only. The monthly card shows no trial.
4. One-touch trial, Slopes [04:10–05:13]: replace the multi-step paywall with a single tap that starts the free trial.
5. Trial length by plan, Headspace [05:13–05:45]: a 7-day trial on monthly and a 14-day trial on annual, shown side by side so the comparison is visible.
6. Pro badges on locked content, Mobbin [06:46–07:17]: a "Pro" label on every locked item, wherever it appears in the product (placement and styling shown on screen, not stated).
7. Intent gate, Busuu [07:49–08:19]: the free tier gets one language, and starting a second language opens the upgrade.
8. Single price, Uber [08:49–09:20]: replace the price range with one estimated price.

### CSS translation
```html
<!-- Blinkist-style trial timeline. The video states no day-by-day content or values.
     Structure and all numbers (derived); the charge row is the honest-version addition from Gotchas. -->
<ol class="trial-timeline">
  <li><strong>Today</strong><span>What unlocks right now</span></li>
  <li><strong>Reminder</strong><span>When we remind you before the trial ends</span></li>
  <li><strong>Charge day</strong><span>Date and exact amount of the first charge, and how to cancel before it</span></li>
</ol>
<span class="badge-pro">Pro</span>
```
```css
.trial-timeline { list-style: none; margin: 0; padding: 0; display: grid; gap: 16px; }      /* (derived) */
.trial-timeline li {
  position: relative;
  display: grid; grid-template-columns: 32px 1fr; column-gap: 12px;                        /* (derived) */
}
.trial-timeline li::before {                                                               /* step marker */
  content: ""; grid-row: span 2;
  inline-size: 32px; block-size: 32px; border-radius: 50%; background: var(--accent);       /* (derived) */
}
.trial-timeline li:not(:last-child)::after {                                               /* connector to next step */
  content: ""; position: absolute;
  inset-inline-start: 15px; inset-block-start: 32px;
  inline-size: 2px; block-size: calc(100% - 16px);                                         /* spans the 16px gap (derived) */
  background: var(--accent-muted);
}
.badge-pro {                                                                               /* info label: fill, no stroke */
  display: inline-flex; align-items: center;
  padding: 2px 8px; border-radius: 999px;                                                  /* (derived) */
  font-size: 12px; font-weight: 600; letter-spacing: 0.02em;                               /* (derived) */
  background: var(--accent); color: var(--on-accent);
}
```

### Gotchas
- Defaulting to the word "trial" without asking what it makes people feel.
- A multi-step paywall standing between the user and the trial start.
- Locks that hit beginners before they have seen value.
- Adding more plans instead of making the best one clearly different.
- The principle labels are loose. The Blinkist timeline works by removing uncertainty, not by progressive disclosure, and Moonly's move is closer to asymmetric dominance than a classic decoy. Lean on the patterns, not the names.
- Dark-pattern risk, stated plainly (my note): each of these levers turns into manipulation with one small change.
  - A "guest pass" that quietly converts into a paid subscription is deceptive. Honest version: on the same screen, say when the charge happens, how much it is and how to cancel. A Blinkist-style timeline is the honest form when it includes the charge day.
  - Putting the trial on the annual plan only steers people to the longest commitment. Keep the monthly option fully visible, and show the annual price as the total charged, not only as a per-month figure.
  - "Pro" badges everywhere can bury the free product under upsells. Label locked items, but keep the free tier usable and never dress teasers up as content.
  - A single price is honest only if it's the price actually charged. A precise-looking estimate that later goes up is worse than a range.
  - Lock new capacity (a second language), never things the user has already created or saved.

### Examples named
- Blinkist: day-by-day 7-day trial explainer, +23% trial sign-ups (per creator).
- Headspace: "30-day guest pass" reframe (+7%), and a 7-day monthly vs 14-day annual trial (per creator).
- Moonly: free trial on the annual plan only, +39% conversion and +47% revenue per 100 installs (per creator).
- Slopes: one-touch trial start, +25% trial starts (per creator).
- Mobbin (captions: "Mobin"): Pro labels on locked content, +35% free-to-paid (per creator).
- Busuu (captions: "Buzzu"): one free language, +83% conversion among engaged users (per creator).
- Uber: price range replaced by a single estimated price, double-digit rise in rides per user (per creator).

## How Top 1% Apps Keep You Hooked
- source: Tim Gabe · https://youtu.be/D9SXaj6qQIQ
- type: product-psychology
- tags: psychology, retention, habit, micro-interaction, loading, animation, buttons, mobile, colour, gamification, dark-patterns

### Takeaways
- Framing: ordinary apps such as route planners, meditation tools and fitness trackers use the same psychology that TikTok and Instagram use to keep people coming back. The creator says winning products succeed less on features, UI or aesthetics than on being "psychological engines". They fit how people decide, anticipate rewards and need to finish things, so users pull themselves back without being pushed.
- Pattern 1, responsive waiting (Perplexity):
  - Asking a question doesn't mean a silent wait. The loader animation and the voice-mode dots react in real time.
  - These are feedback loops for emotional reassurance. The user acts, the app visibly reacts, and the loop closes. Done well, even waiting feels pleasant.
  - Rules: make responsiveness feel smart, use movement to show the system is working, validate input with small rewards such as flickers or pulses, and treat in-between moments as designed, not empty.
  - This kind of responsiveness usually arrives later in an app's life. The next patterns are for the start.
- Pattern 2, one first action (Apple Fitness):
  - It doesn't open on 30 workouts. Even a first-time user is steered to one thing: press "Let's go" and start moving.
  - Principle named: Hick's law. The more choices people get, the longer they take to decide. Here, simplicity is the activation moment.
  - Rules: one clear focus across the whole app, and no friction in the first moments.
- Pattern 3, big buttons near the thumb (Waze):
  - Waze users are often driving, with one hand on the wheel and their eyes on the road.
  - Principle named: Fitts's law. The bigger and closer a target is, the faster and easier it is to hit. All of Waze's core buttons are large and placed for one-handed use.
  - Rules for any app or site: design for distraction and limited attention, show priority through size, and keep key buttons close to the thumb.
- Pattern 4, emotional anchoring (Headspace):
  - Opening the app slows your pace and shifts your mood. Colour palette, animation and sound work together, so you enter a calm space before any session starts. The creator says Headspace has invested millions in this (creator's claim, unverified).
  - Rules: emotion starts at onboarding, and the app's tone tells users how to feel about it. Colour, type and motion are psychology, not decoration.
- Pattern 5, visible social energy (Discord):
  - Even without knowing anyone, a server feels busy: lit-up avatars, reactions, and labels such as "2,312 people online".
  - Principle named: social proof. The creator calls it one of the strongest principles and says apps often misuse it or underuse it.
  - Rules: show, don't tell. Display activity in real time with quiet signals such as who's online and reaction counts, and make community a visible part of the UX rather than burying it.
- Pattern 6, near wins (Stompers):
  - From the first use it feels as if progress is already happening. There are packs (captions: "fun packs"), streaks and encouragement everywhere, nudging the user on.
  - Principle named: the Zeigarnik effect. Unfinished tasks stick in memory more than finished ones, and people feel driven to resolve them.
  - Stompers builds loops that never fully close but always feel within reach.
  - Rules: stack visible progress, because users return when they know a win is close. Keep thresholds close so the next level feels achievable. Treat completion as a reward loop and show progress visually.
  - Limit: don't put 20 loops on one screen (Hick's law again).

### Recipes
1. Live response feedback, as narrated for Perplexity [02:06–02:37] (no durations or sizes stated)
   1. The moment the user submits, start a loader animation. Never leave a static wait.
   2. In voice mode, make the indicator dots react in real time to the user's voice.
   3. Confirm input with small flickers or pulses.
2. Single first action, as narrated for Apple Fitness [03:07–03:38]
   1. A new user lands on one recommended action, not a catalogue.
   2. One primary button ("Let's go") starts the activity at once.
3. Thumb-zone primary controls, as narrated for Waze [04:10–04:41]
   1. Make every core action a large target.
   2. Place them within one-handed thumb reach.
   3. Rank actions by size: the most important is the biggest.
4. Emotional anchoring, as narrated for Headspace [05:11–06:12]: colour palette, animation and sound are designed together to set a calm pace from the first open and through onboarding (palette and timing shown on screen, not stated).
5. Live social proof, as narrated for Discord [06:12–06:44]: lit-up presence avatars, reaction counters, and a live online-count label (example: "2,312 people online").
6. Near-win progress, as narrated for Stompers [07:14–08:15]
   1. Show several progress elements (packs, streaks, encouragement), each one close to its next threshold.
   2. Show progress visually, and make completing something feel like a reward.
   3. Cap how many loops a single screen shows.

### CSS translation
```css
/* Perplexity-style "system is working" dots. All values (derived). */
.thinking { display: inline-flex; gap: 4px; }
.thinking span {
  inline-size: 6px; block-size: 6px; border-radius: 50%; background: currentColor;
  animation: thinking-pulse 1.2s ease-in-out infinite;
}
.thinking span:nth-child(2) { animation-delay: 0.15s; }
.thinking span:nth-child(3) { animation-delay: 0.3s; }
@keyframes thinking-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40%           { opacity: 1;   transform: scale(1); }
}

/* Waze-style thumb-zone primary action. Size and offsets (derived); Apple's 44 pt minimum is the usual floor. */
.primary-action {
  position: fixed;
  inset-inline-end: 16px;
  inset-block-end: calc(16px + env(safe-area-inset-bottom));
  min-inline-size: 64px; min-block-size: 64px; border-radius: 50%;
}

/* Discord-style presence count. Tabular figures stop a live number from jittering (derived). */
.presence { display: inline-flex; align-items: center; gap: 6px; font-variant-numeric: tabular-nums; }
.presence::before { content: ""; inline-size: 8px; block-size: 8px; border-radius: 50%; background: var(--online); }

@media (prefers-reduced-motion: reduce) { .thinking span { animation: none; opacity: 0.6; } }
```

### Gotchas
- Treating waiting states as dead time instead of feedback.
- Opening on many choices instead of one clear first action.
- Small or out-of-reach buttons in contexts where attention is split.
- Burying community activity instead of surfacing it.
- Too many progress loops on one screen (his example: 20).
- Dark pattern, stated plainly: the creator opens by admitting these are the principles social apps use to manipulate people, and "loops that never fully close" is compulsion design. The skill should not build loops that are engineered never to end. Honest alternative: give each loop a clear done state and a natural stopping point, and tie progress to goals the user set.
- Social proof must be real. Never inflate or fake "people online" counts, reactions or activity.

### Examples named
- Perplexity (mobile app): real-time loader and voice-dot feedback.
- Apple Fitness: one "Let's go" first action instead of a catalogue of workouts.
- Waze: large core buttons placed for one-handed use while driving.
- Headspace: colour, animation and sound set a calm emotional state from the first open.
- Discord: lit-up avatars, reactions, live "people online" counts.
- Stompers (name as heard in captions): packs, streaks and encouragement that keep progress feeling close.
- TikTok and Instagram: the framing comparison for manipulative engagement design.

## Do Companies Really Need Designers Anymore?
- source: Tim Gabe · https://youtu.be/bOm9GDv96Tk
- type: career/business
- tags: ai, career, workflow, landing-page, vibe-coding, lovable

### Takeaways
- How far AI goes alone, by area, per the creator's table. Marketing visuals and ads can run without a designer using Midjourney or ChatGPT plus templates; at a crypto bridge protocol where he was the only designer, the marketing team ended up running ads by themselves. Landing pages are an 80/20 job: generate a base in Relume, move it to Figma and publish with Figma Sites. A designer still adds the high-end orchestration of assets, copy, micro-interactions and animation. Products and complex UIs still need a designer. Google Stitch and Lovable can spin up a flow, but a generic dataset gives a generic solution, so the work becomes orchestrating and iterating against real user needs rather than one-shot prompting.
- The last 20%, the part that builds traction, comes from asking why. A Spotify colleague (Daniel) would study each prototype in silence and then ask why, again and again, until the creator saw how little he had thought through his choices. AI is good at what a thing should look like and fairly good at how to structure it. It doesn't yet ask the right questions at the right time.
- The friction AI can't see in data shows up in user tests: misclicks, hesitation where confidence should be, delight where you didn't expect it. Finding it takes experience, observation and intuition. Raycast is his example: it re-imagined how people use their computers rather than piling on features and sticking to convention.

### Recipes
- none (career/business)

### Gotchas
- Shipping a one-shot AI-generated UI for a product whose users have specific problems. Generic training data produces generic flows.
- Judging design by "looks correct" rather than "works". The gap between the two is where product breakthroughs happen.

### Examples named
- Midjourney and ChatGPT: marketing visuals and campaigns.
- Relume → Figma → Figma Sites: generate, refine and publish a landing page.
- Google Stitch and Lovable: quick app-flow generation.
- Spotify (the creator's former employer) and colleague Daniel: the "keep asking why" lesson.
- Simon Sinek's "Start with Why": the framing idea.
- Raycast: re-imagining interaction from a deep understanding of users (see the Raycast breakdown below).

## The Secret Behind Weirdly Addictive Apps
- source: Tim Gabe · https://youtu.be/Du2lkZ_cux8
- type: product-psychology
- tags: psychology, animation, micro-interaction, states, retention, habit, onboarding, trust, gamification, charts, cards, 3d, mobile

### Takeaways
- Emotional design is the craft of making a product feel engaging, personal and alive. Now that anyone can build fast with APIs, no-code tools and AI models, being useful is no longer enough. The edge is how the product feels when it opens: smooth, delightful, playful or premium, rather than like every other app.
- Business model, timing and community still matter. Emotional design is what separates good from great. He paraphrases Netflix co-founder Reed Hastings: the product has to be good enough that people want to talk about it.
- Duolingo, delight as feedback:
  - In 2022 Duolingo introduced a full character animation system: facial reactions, lip-sync with audio, and idle animations that keep characters alive while the user does nothing.
  - After the rollout, daily active users rose from 14.2 million to more than 34 million within 2 years, and paid subscribers more than doubled (creator's claim, unverified). He concedes that new languages, curriculum work and marketing also drove it. He says Duolingo's team and CEO Luis von Ahn name the delightful, animated experience as a major reason people stay engaged (creator's claim, unverified).
  - The animations are emotional feedback, not eye candy. A right or wrong answer gets encouragement, correction or cheering, not just a green check. He links this to Don Norman's book Emotional Design.
- How to apply it in products built on repeated behaviour (check-ins, journaling, habit logging):
  - Give each confirmation instant emotional feedback through a micro-interaction: a subtle bounce, a glow or a sparkle.
  - Celebrate small wins. Success states don't need to be big, but they should feel intentional.
  - If there is a mascot, use its expressions to encourage: small nods, smiles and animated reactions. Emotions are contagious.
  - Build momentum with progress animation: animated streaks, levels, or a count of journals completed.
  - The aim is feedback that feels human, not merely functional. Even something simple, done well, makes the app feel more alive and more worth returning to.
- Phantom, delight against scepticism:
  - Crypto UX is notoriously clunky, and the users are sceptical rather than habit-forming.
  - Phantom's mid-2023 brand refresh went well beyond the logo. It animated the ghost mascot, added playful animations to wallet creation, and worked to make every interaction feel playful and approachable. The goal was to make crypto feel less scary and more human.
  - It became the #2 app in the US App Store utilities category, ahead of WhatsApp and Instagram (creator's claim, unverified). Market momentum helped too.
  - CEO Brandon Millman, paraphrased: polish matters, and Phantom is a design-led company that takes the time to craft polished products. Most wallets were built by developers for developers. Phantom built for consumers, aiming to bring the next billion people into web3.
- Principles for intimidating or high-stakes spaces (finance, crypto, health, insurance):
  - Polish builds trust. Treat visual detail, motion and transitions as part of the product itself, not garnish; each micro-interaction signals trust.
  - Stay approachable: friendly visuals and warm, playful touches lighten heavy subjects.
  - Build for people, not just pros. Don't assume users already know how things work; make flows understandable to ordinary people, especially beyond early adopters.
  - Performance matters, but what people remember is the feel of each tap, swipe and wait. Smooth feedback raises confidence.
- Revolut, delight as premium:
  - Its design polish has risen alongside its move upmarket. How the product feels is deliberately aligned with where the business is heading.
  - The first-time experience isn't a plain sign-up flow. It has rich visuals and very smooth transitions, so it feels premium from the start.
  - Charts: drag a finger and the graph responds with a soft glow, so spending data feels tactile.
  - Cards: not a static image but a small 3D moment. The card flips, rotates and catches the light.
  - Subtle animation in security flows and onboarding builds trust without trying too hard. None of the details shout, but together they read as premium. In fintech, trust affects how much users spend, so this polish turns into revenue (creator's claim, unverified).
- Closing rules: nail the first impression by polishing onboarding and welcome moments to show quality, trust and care. Add subtle delight such as fades, hover effects and gestures. Make interactions dynamic with tactile charts, responsive feedback and animated cards.

### Recipes
1. Character animation system, as narrated for Duolingo [02:01–03:34] (no timings stated)
   1. Give the mascot three layers: facial reactions, lip-sync to the audio, and idle animations that run while the user is inactive.
   2. Map answer states to reactions: correct → encouragement or cheering, wrong → a gentle correction, never only a check mark.
2. Feedback on repeated actions [04:05–05:06]
   1. On each confirm (check-in, journal entry, habit log), play one small reaction: a bounce, a glow or a sparkle.
   2. Keep success states small but deliberate.
   3. If there's a mascot, add a nod, smile or animated reaction.
   4. Animate progress: streak count-ups, level changes, a journals-completed count.
3. Friendly onboarding for a high-stakes product, as narrated for Phantom [06:09–06:41]: animate the mascot, add playful motion to the wallet-creation flow, and give every interaction a playful, approachable response.
4. Premium touches, as narrated for Revolut [09:47–10:50]
   1. First-run flow: rich visuals with smooth transitions between steps.
   2. Chart scrubbing: the graph follows the finger and a soft glow marks the touched point.
   3. Card: a 3D presentation where the card flips, rotates and catches the light.
   4. Security and onboarding flows: subtle, quiet animation.

### CSS translation
```css
/* Success micro-interaction: subtle bounce + glow on confirm. All values (derived). */
@keyframes success-pop { 0% { transform: scale(1); } 40% { transform: scale(1.08); } 100% { transform: scale(1); } }
.check.is-done {
  animation: success-pop 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--success) 25%, transparent);
  transition: box-shadow 320ms ease-out;
}

/* Revolut-style card: a 3D flip that catches light. All values (derived). */
.card-3d { perspective: 1000px; aspect-ratio: 1.586; }          /* ID-1 bank-card ratio (derived) */
.card-3d__inner {
  position: relative; block-size: 100%;
  transform-style: preserve-3d;
  transition: transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.card-3d.is-flipped .card-3d__inner { transform: rotateY(180deg); }
.card-3d__face { position: absolute; inset: 0; border-radius: 16px; backface-visibility: hidden; overflow: hidden; }
.card-3d__face--back { transform: rotateY(180deg); }
.card-3d__face::after {                                        /* light sweep; drive --shine from rotation or pointer in JS */
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(115deg, transparent 30%, rgb(255 255 255 / 0.35) 50%, transparent 70%);
  background-size: 250% 100%;
  background-position: var(--shine, 100%) 0;
}

/* Chart scrub: soft glowing dot that follows the finger (position set in JS). */
.chart-cursor {
  inline-size: 12px; block-size: 12px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 16px 4px color-mix(in srgb, var(--accent) 50%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .check.is-done { animation: none; }
  .card-3d__inner { transition: none; }
}
```

### Gotchas
- Animation as decoration rather than feedback tied to a user action.
- Oversized success states. The creator's point is intentional, not huge.
- Designing intimidating domains (finance, crypto, health, insurance) only for experts who already know the rules.
- Reading the growth figures as caused by animation. The creator himself lists other drivers, so the link is correlation.
- Persuasion risk (my note): in money, crypto and health, polish signals trust and can lend confidence the product hasn't earned. Pair delight with real clarity about fees, risks, irreversible actions and confirmations. Don't use playful motion to soften warnings that people need to read.
- Respect reduced-motion settings for bounces, flips and glows (my note).

### Examples named
- Duolingo: 2022 character animation system (facial reactions, lip-sync, idle animation). DAU 14.2M → 34M+ in 2 years (per creator). CEO Luis von Ahn.
- Phantom: mid-2023 refresh with an animated ghost mascot and playful wallet-creation animations; CEO Brandon Millman; #2 in US utilities (per creator).
- Revolut: premium first-run flow, glowing touch-responsive charts, 3D card that flips and catches light.
- Don Norman, Emotional Design (book): emotional feedback loops.
- Reed Hastings (Netflix): products good enough that people talk about them.

## Give Me 10 Minutes & I'll Boost Your Website Conversions
- source: Tim Gabe · https://youtu.be/TIfiy1fodDs
- type: principles
- tags: landing-page, conversion, buttons, copywriting, sections, hero, hierarchy, trust, psychology, saas

### Takeaways
- Benchmark: the average SaaS website converts under 4% of visitors into buyers, and the best reach almost 12%, triple the return from the same traffic (creator's claim, unverified). He gives four changes.
- Change 1, one call to action. Not two or three, one.
  - Unbounce studied more than 18,000 landing pages. Pages with one CTA converted at 13.5%, two CTAs at 11.9% and three CTAs at 10.5% (creator's claim, unverified).
  - Principle named: the paradox of choice. A Columbia University study at a candy shop offered 24 flavours to one group and 6 to another, with equal numbers of people. 3% of the 24-option group bought something and 30% of the 6-option group did, a 10x difference (creator's claim, unverified).
  - More choice doesn't empower the buyer; it overwhelms them, and overwhelmed visitors hesitate and leave.
  - Every extra button ("Watch a demo", "Subscribe", "Learn more", "Download white paper") feels helpful but is noise to a distracted visitor. It causes analysis paralysis and then inaction.
  - The best pages act as a guide: here's the one thing to do next.
- Change 2, sell the outcome, not the specs.
  - In 2001 MP3 players marketed storage and supported formats, which meant little to most buyers. At the iPod launch, Jobs didn't lead with 1 GB of storage. He held it up and said "1,000 songs in your pocket". It was a similar product with a different message.
  - Copy rewrite example: "real-time notifications with Slack and Jira integrations" has no pull. "Close tickets three times faster without switching tabs" names the outcome.
  - You're selling time saved, faster wins and more revenue, whatever the customer's ideal future is, not tools. That future is the story the site has to tell.
- Change 3, write for scanners.
  - Nobody reads a landing page. Visitors skim, looking for either a reason to stay interested or a reason to go, so the copy has to register almost instantly.
  - The goal isn't less copy. It's writing what matters and nothing more.
  - Principle named: the Goldilocks principle, which he attributes to James Clear (Atomic Habits). People gravitate to tasks of just the right difficulty.
  - Applied to copy: too little leaves objections unanswered, so people hesitate and look elsewhere. Too much drowns them in analysis paralysis.
  - Aim for clear, context-driven copy that anticipates what the audience is thinking and answers their objections and questions.
  - Section anatomy, in the order he gives it: a headline that names a pain point or an outcome, then a subheading or body that brings a fresh angle or extra value, then a product visual that shows useful context or contrast, then proof points (social proof, impressive numbers, previous clients), then one clear CTA.
  - Fast-scroll litmus test for every section: could a fast scroller tell what this is, how it helps them and what the next step is? If not, you usually don't need more content. You need to deliver it better.
- Change 4, the exception: match CTAs to readiness.
  - Visitors arrive from newsletters, social posts and help docs at different levels of readiness. Some are browsing and some are ready to buy, so some high-converting sites offer more than one next step.
  - Pattern: one primary CTA for high intent ("Try for free today") and one secondary CTA for people who need context ("Watch a demo" or "Learn how it works").
  - This matters most for complex SaaS, where the value proposition isn't obvious at first glance.
- Escape valves for visitors who aren't ready at all: low-friction options that let them step out without leaving, such as chat widgets, support links and e-commerce's "save for later".
  - His own case: he signed up for an automated bookkeeping service in Spain because of its chat widget. While comparing options, one click on a chat bubble beat hunting for an email address or reading long FAQs.
- Closing rule: sometimes you need the right choices for the right person at the right time, not fewer choices.

### Recipes
1. Cut to one CTA [00:30–02:31]
   1. List every action on the page (demo, subscribe, learn more, white paper, sign-up).
   2. Keep the single action that matters and remove or demote the rest.
   3. Check again with Change 4 if traffic arrives at mixed readiness.
2. Spec → outcome copy rewrite [03:02–04:35]
   - Before: "1 GB of storage". After: "1,000 songs in your pocket".
   - Before: "Real-time notifications with Slack and Jira integrations". After: "Close tickets three times faster without switching tabs".
   - Method: ask what the spec changes in the customer's day (time saved, faster wins, more revenue) and lead with that.
3. Section build, top to bottom [06:40–07:10] (an example site is shown on screen; its layout values are not stated)
   1. Headline: names a pain point or an outcome.
   2. Subheading or body: brings a fresh angle or extra value to that pain point or outcome. It doesn't repeat the headline.
   3. Product visual: shows useful context or a contrast.
   4. Proof points: social proof, impressive numbers, previous clients.
   5. One clear CTA.
4. Fast-scroll litmus test, per section [07:10–07:40]
   1. Scroll the page fast.
   2. For each section, can you tell what the section is, how it helps and what the next step is?
   3. If any answer is no, restructure how the content is delivered before adding more.
5. Readiness-based CTA pair [08:42–09:14]
   1. Primary, for high intent: "Try for free today".
   2. Secondary, for those who need context: "Watch a demo" or "Learn how it works".
   3. Use it mainly on complex SaaS where the value isn't immediately clear.
6. Escape valves [09:14–10:16]
   1. A one-click chat bubble.
   2. Support links.
   3. "Save for later" (e-commerce).

### CSS translation
```html
<!-- Section anatomy in the video's order. Copy is the video's example; layout and all values (derived). -->
<section class="lp-section">
  <h2 class="lp-section__headline">Close tickets three times faster without switching tabs</h2>
  <p class="lp-section__sub">A new angle on the same outcome, answering the visitor's likely objection.</p>
  <figure class="lp-section__visual"><!-- product visual showing context or contrast --></figure>
  <ul class="lp-section__proof"><!-- real logos, numbers or client names only --></ul>
  <div class="cta-row">
    <a class="btn btn--primary" href="/signup">Try for free today</a>
    <!-- Secondary only when visitors arrive at mixed readiness: -->
    <a class="btn btn--secondary" href="#demo">Watch a demo</a>
  </div>
</section>
<button class="chat-valve" type="button" aria-label="Chat with us"></button>
```
```css
.cta-row { display: flex; flex-wrap: wrap; gap: 12px; }                         /* (derived) */
.btn { display: inline-flex; align-items: center; min-block-size: 48px; padding: 0 20px; border-radius: 12px; font-weight: 600; } /* (derived) */
.btn--primary { background: var(--accent); color: var(--on-accent); }           /* the one action that matters */
.btn--secondary { background: transparent; color: var(--text); box-shadow: inset 0 0 0 1px var(--border); } /* clearly lower emphasis */
.chat-valve {                                                                    /* escape valve: one click, always reachable */
  position: fixed; inset-inline-end: 24px; inset-block-end: 24px;                /* (derived) */
  inline-size: 56px; block-size: 56px; border-radius: 50%;                       /* (derived) */
  background: var(--accent); color: var(--on-accent);
}
```

### Gotchas
- Several equal-weight CTAs on one page (demo, subscribe, learn more, white paper).
- Feature and spec copy where the outcome should be.
- Assuming shorter copy is always better and leaving objections unanswered.
- Walls of text that cause analysis paralysis.
- Applying the one-CTA rule dogmatically when visitors arrive at mixed readiness.
- No escape valve, so not-ready visitors simply leave. Making contact hard (buried email, long FAQs) loses buyers who are still comparing.
- Proof points must be real (my note). Don't fabricate numbers, logos or client names to fill the proof slot.
- The study details are the creator's. The well-known Iyengar–Lepper version of this choice study used jams at a grocery store rather than candy (my note).

### Examples named
- Unbounce: study of 18,000+ landing pages, one vs two vs three CTAs (per creator).
- Columbia University choice study: 24 vs 6 options, 3% vs 30% purchase (per creator).
- Apple iPod launch, 2001 (Steve Jobs): "1,000 songs in your pocket" instead of storage specs.
- James Clear, Atomic Habits: the Goldilocks principle as applied to copy length.
- Slack and Jira: the integration-spec copy example.
- An automated bookkeeping service in Spain (unnamed): chat widget as the escape valve that won the sign-up.

## How Raycast Reached a $100M+ Valuation (As a Small Startup)
- source: Tim Gabe · https://youtu.be/eWGNjTLK84c
- type: redesign/breakdown
- tags: macos, keyboard, inputs, navigation, progressive-disclosure, onboarding, habit, retention, growth, workflow

### Takeaways
- Context: Raycast has a user base in the hundreds of thousands, millions raised, fewer than 40 staff and a valuation above $100 million (creator's claim, unverified). The creator credits four growth-focused design decisions.
- Decision 1, live inside existing workflows rather than replacing them.
  - By launch Raycast already integrated with GitHub, Jira, Slack and more, with real utility rather than a logo wall. Users could open their assigned GitHub issues or update a Jira ticket without touching the browser.
  - It's distribution as well as UX. Each GitHub or Slack extension delivers Raycast's value inside a tool the user's teammates also use, which creates pull without referral tricks or share-to-grow features.
  - Rule: ask where your users already work and meet them there, for instance with an extension for Chrome, a command in Slack or an embed in Notion. Distribution is often a design problem in disguise.
  - "Growth-focused UX" is his term for this. It covers not only appearance but where the product sits, how it surfaces and how well it matches users' existing mental models.
- Decision 2, strong opinions that train behaviour.
  - Raycast isn't trying to please everyone. It knows exactly who it serves and how it's meant to be used.
  - Keyboard interaction is the primary way to use it, not a power feature. Leaning on the mouse feels like the app nudging you back toward speed. That's a deliberate constraint to train a different working rhythm, not a bug.
  - There is no UI clutter. What you see is kept minimal so the utility gets the spotlight, and the power reveals itself as you go (progressive disclosure).
  - In the early days it had no formal onboarding, and new users still succeeded because the product taught itself through use. A lightweight onboarding exists now. It balances friction against learnability.
  - Users could build their own extensions, but there was no full marketplace at launch. Utility for builders came before browsability for browsers.
  - The interaction model is rigid on purpose: open, type, act. Users can't rearrange the layout or change the flow, and limiting variation reinforces clarity and habit.
  - Rule: to create habits, design with clear opinions and commit to them. That can mean adding constraints, simplifying options or removing flexibility. Sharp opinions turn some people away but create the biggest believers. People rave about speed, clarity and trust, not about the number of options.
- Decision 3, systems that reinforce the core behaviour (loops).
  - The search bar has always been the central surface through which everything else is reached. Installing an extension lets the same bar find Google Drive files, control Spotify, or create a Notion page.
  - Each connected tool adds tasks that can be finished without switching context, so every interaction gets faster and more focused.
  - Flywheel: the extension store gives people reasons to keep exploring, and the API lets developers build extensions, which keeps the store growing. Each system feeds the next.
  - Onboarding isn't a one-off moment. It becomes ongoing activation through surprise, with users repeatedly finding they didn't know Raycast could do that too.
  - Rule: for every feature, ask whether it unlocks something that already lives in the product or just sits there waiting. Standalone features are utility, which is fine. Compounding value needs loops: features that reward curiosity and strengthen the whole engine.
- Decision 4, obsessively over-deliver for one user.
  - The target was Mac-based developers who live on the keyboard, designed for end to end, not just a niche named in a pitch deck.
  - Filter for every decision: anything that didn't make the user faster, lighten cognitive load or suit a keyboard-driven workflow was left out.
  - Against Alfred, already popular with the same power users for its features and customisation, Raycast competed on clarity, not features. Its interface is cleaner and more opinionated, with a bigger search bar placed front and centre because every session starts there. Less friction, fewer options, better defaults.
  - Rule: it isn't enough to focus on one user; over-deliver for them. Make the core qualities (speed, clarity) non-negotiable and remove whatever gets in the way. It served one group so well that others came to want it too.

### Recipes
1. Product and UI decisions, decision → reason (as narrated; no visual values stated)
   - Integrations with real actions at launch (open assigned GitHub issues, update Jira tickets) → the value shows up inside tools teammates share, which drives adoption without referral mechanics [00:30–01:32].
   - Keyboard as the primary input, not an add-on → trains a faster working rhythm [03:06–03:36].
   - Minimal UI with power revealed over time → the utility gets the spotlight [03:36–04:06].
   - No formal onboarding at first (a light one added later) → the product teaches itself as it's used [04:06–04:36].
   - User-built extensions but no marketplace at launch → utility for builders before browsing [04:36–05:06].
   - A fixed open → type → act model with no layout customisation → clarity and habit through limited variation [04:36–05:06].
   - One search bar as the core interface, with extensions adding results and actions to the same bar → every new tool connected makes the core habit more valuable [06:36–07:07].
   - Extension store plus developer API → a self-feeding flywheel of exploration and new extensions [07:07–07:39].
   - Ongoing discovery instead of one-shot onboarding → repeated moments of surprise keep activating users [07:39–08:09].
   - Versus Alfred: a cleaner, more opinionated UI, a larger search bar front and centre, fewer options, better defaults → competing on clarity, not feature count [09:42–10:14].
2. Command-bar interaction model, for building one (sequence from the narration; mechanics derived)
   1. A global shortcut summons a single floating bar.
   2. Focus lands in a large search input, so typing starts immediately.
   3. Results list below, with the first result selected.
   4. Arrow keys move the selection, Enter runs the action and Esc dismisses (derived).
   5. Extensions register their commands into the same result list, not into separate screens.
   6. Show the keyboard hint for the selected action so the user learns shortcuts while working (derived).

### CSS translation
```html
<!-- Raycast-style command bar. Semantics and all values (derived). -->
<div class="palette" role="dialog" aria-modal="true" aria-label="Command bar">
  <input class="palette__input" role="combobox" aria-expanded="true" aria-controls="palette-list"
         aria-activedescendant="cmd-1" placeholder="Search for apps and commands…" autofocus>
  <ul class="palette__list" id="palette-list" role="listbox">
    <li class="palette__item" id="cmd-1" role="option" aria-selected="true">
      <span class="palette__label">My GitHub issues</span><kbd class="palette__hint">↵</kbd>
    </li>
  </ul>
</div>
```
```css
.palette {
  position: fixed; inset-block-start: 20vh; inset-inline: 0; margin-inline: auto;
  inline-size: min(720px, 92vw);                                  /* (derived) */
  border-radius: 12px; overflow: hidden;                          /* (derived) */
  background: var(--surface);
  box-shadow: 0 24px 64px rgb(0 0 0 / 0.35);                      /* (derived) */
}
.palette__input {                                                  /* the large, front-and-centre search bar */
  inline-size: 100%; border: 0; background: transparent; color: var(--text);
  font-size: 20px; padding: 16px 20px;                            /* (derived) */
}
.palette__list { margin: 0; padding: 4px 0; list-style: none; max-block-size: 360px; overflow-y: auto; } /* (derived) */
.palette__item { display: flex; align-items: center; gap: 12px; padding: 8px 20px; }                     /* (derived) */
.palette__item[aria-selected="true"] { background: var(--selection); }   /* keyboard selection state */
.palette__hint { margin-inline-start: auto; font-size: 12px; color: var(--text-muted); }                 /* (derived) */
```

### Gotchas
- "Logo" integrations with no real action behind them.
- Referral or share-to-grow gimmicks in place of being useful where users already work.
- Trying to out-feature an incumbent (Alfred) instead of out-clarifying it.
- Launching browse surfaces (a marketplace) before the core utility is solid.
- Features that stand alone and don't feed the core loop.
- Keyboard-first must not become keyboard-only (my note). Keep the pointer path working, and give the bar proper combobox and listbox semantics so screen readers can follow the selection.
- Opinionated rigidity suits a focused tool for a defined user. It's a poor default for products serving broad, mixed audiences (my note).

### Examples named
- Raycast: keyboard-first macOS launcher, with search bar as core interface, extensions, store and API flywheel, and minimal UI.
- GitHub, Jira, Slack: launch integrations with real actions.
- Google Drive, Spotify, Notion: extension actions inside the same search bar.
- Chrome extensions, Slack commands, Notion embeds: distribution surfaces inside existing workflows.
- Alfred: the feature-rich incumbent Raycast beat on clarity rather than features.

## 5 Tools I Wish I Found Sooner (For Designers)
- source: Tim Gabe · https://youtu.be/qmJVN2158Mk
- type: resources
- tags: resources, workflow, inspiration, ai, lovable, vibe-coding, figma, freelance, animation

### Takeaways
- Contra: a professional network for independent creatives to get their work seen and get paid. As an agency owner, the creator uses it to find talent, including the Rive animators he hires for custom animation work. Rive is one of Contra's official partner tools.
- Rive: an interactive animation tool. The creator calls Rive skills fast-rising in value for creatives.
- Lovable: an AI full-stack app builder. In his framing it does for full-stack coding what Framer did for pixel-perfect design: it makes it easy.
  - He built an internal tool for his brother's company on his phone in about three hours (creator's anecdote).
  - He says some agencies built on Lovable make over 200K a month building internal tools for companies (creator's claim, unverified).
  - The opportunity he sees: designers who offer full-stack build as well as design stand out and can charge more.
- Mobbin: a UI research library of 1,000+ apps that top teams use (creator's claim, unverified). He calls it the best tool to open at the start of any UI project. It saves the hours of visiting sites, creating throwaway accounts, installing apps and taking screenshots.
- Kortex (captions: "Cortex"), by writer Dan Koe: a second-brain tool for notes, writing and research in which everything you note or save is interconnected. An AI assistant (Kai) answers using the resources you link. He claims it gets more powerful, not more bloated, as you add to it (creator's claim, unverified).
- Serif (as heard: "Serif AI"): an AI email assistant. You connect the inbox and give it about 20 minutes to learn your voice and categorise mail. After that it pre-drafts replies in your writing style, down to his habit of writing in lowercase.

### Recipes
1. Mobbin research workflow [03:36–04:37]
   1. Filter by specific apps, user flows or UI elements.
   2. Use text search to find exact matches inside screens.
   3. Save screens to collections.
   4. Add comments with your thoughts on saved screens.
   5. Or copy any screen with one click and paste it into Figma.
2. Kortex capture on the move [04:37–05:37]
   1. Start a research document (his example: a report on UI insights for an app).
   2. When an idea strikes away from the desk, open the phone app and chat with the AI assistant.
   3. Link the idea to related resources: an uploaded PDF of a user interview, a UX article, a saved YouTube video.
   4. The assistant answers using all the linked resources.

### Gotchas
- The video reads as sponsored or affiliate content: every tool has a trial link in the description. Treat the endorsements as promotional, not independent.
- The Lovable revenue figure and the "Notion killer" label for Kortex are hype, not evidence.
- Mobbin screens are other teams' work. Use them for research and pattern reference, not as layouts to copy and ship.

### Examples named
- Contra: creative professional network; hiring Rive animators.
- Rive: interactive animation tool and Contra partner.
- Lovable: AI full-stack builder, compared to what Framer did for design.
- Mobbin: UI and flow reference library with collections, comments and copy-to-Figma.
- Kortex (Dan Koe): interconnected notes with the Kai AI assistant.
- Serif: AI inbox triage and drafted replies.
- Notion: what Kortex is pitched against.
