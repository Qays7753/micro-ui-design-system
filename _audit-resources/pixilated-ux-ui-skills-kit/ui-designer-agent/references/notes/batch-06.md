## Why Most SaaS Companies Will Die in 2026
- source: Tim Gabe · https://youtu.be/ZXWUg1e1PAs
- type: product-psychology
- tags: psychology, retention, ai, saas, navigation, habit, gamification, personalization, trust, dark-patterns

### Takeaways
- The test question he puts to founders: if an AI could do everything your app does from a single text message, why would anyone open the app again?
- Context: Gartner predicts that 40% of enterprise apps will have task-specific AI agents embedded by the end of this year (creator's claim, unverified). Apps that are mainly tools for getting a task done are the exposed ones.
- The wrong frame treats agents as a helper feature that leaves the app safe. His frame: agents don't replace the app, they remove the reason users opened it. Once booking a table, rebalancing a portfolio or logging a workout works in plain language with no UI, the question is no longer "can users do the task?" but "why come back to the interface at all?"
- The "agent paradox" (his term): the more of the functional layer agents absorb, the more the emotional layer becomes the product. He names three emotional surfaces:
  - where identity is expressed
  - where rituals are honoured
  - where community creates meaning
- Agents can handle all the logistics, but they can't replace belonging. Separate a product people use from a product people belong to.
- Pattern 1, social identity as the architecture (Strava):
  - Strava reached roughly $500M ARR and a $2.2B valuation in 2025, while Runkeeper and a dozen other trackers offered GPS tracking as good or better (creator's claim, unverified).
  - The home feed shows what the people you follow have done: their runs, rides and achievements. The social layer is the product, and tracking only exists to make it work. He calls this an architectural decision, not a bolted-on feature.
  - Users who came only for GPS tracking can churn to an agent, which already does that better. Users whose running club is there, whose segment PRs are public records, and who feel an unlogged run didn't happen can't be poached by a smarter algorithm, because their identity lives in the app. That is the moat.
  - Hiring signal: in April 2024 Strava hired a chief product officer who had been VP of product and growth at Epic Games (leading Fortnite's growth team), and a CTO who spent over a decade at Zynga leading FarmVille. Both are gaming people who know social mechanics, leaderboards, challenges and competitive loops (creator's claim, unverified). He reads it as Strava doubling down on the social and competitive layer rather than on tracking accuracy.
  - Navigation test: where does the social layer sit in your product's navigation? If it is buried in a tab, or missing, you are potentially exposed to agents.
- Pattern 2, a personal identity metric (Whoop Age):
  - The creator wears a Whoop and says he doesn't really care about the daily recovery score. Whoop Age is the feature that changed how he uses the product.
  - Whoop Age estimates physiological age from months of data across nine metrics. He names six: sleep consistency, VO2 max, resting heart rate, lean body mass, daily steps and time in heart-rate zones. A formula turns them into whether your body is ageing faster or slower than your real age.
  - The hook is a second score, Pace of Aging, updated every week. Its range is −1 to 3: −1 means ageing slower than real time, 3 means lifestyle choices are strongly speeding up ageing. Each week it moves based on the last 30 days of behaviour.
  - Effect he reports on himself: he checks it weekly, worries it will move the wrong way, and changes his sleep, steps and recovery to push it the right way. He counts this as real positive behaviour change driven by the product.
  - He bought a second band for his wife. Her biological age is lower than his, and he now competes with her to lower his own.
  - An agent can analyse heart-rate variability or write a training plan, but it can't create the feeling of watching one number that stands for who you are move week by week.
  - Whoop has raised over $800M at a valuation well above $3B, and more than 50% of members still use it daily 18 months after purchase (creator's claim, unverified). He frames it as a biometric device turned into an identity platform, "survival architecture" for the agent era.
- Pattern 3, a deliberate community bet (Robinhood Social):
  - Announced at HOOD Summit 2025 and rolled out by invitation to a select group of users.
  - Mechanics:
    - share live, verified trades
    - follow traders you trust
    - see exactly when someone enters and exits a position
    - discuss strategies in the feed
    - start your own trade straight from someone else's post
  - The reasoning: trading is one of the loneliest high-stakes activities, done with real money, in isolation and without social validation, and that anxiety drives churn. Once agents can execute trades and rebalance portfolios by voice, a pure trading tool has almost no defence. He notes trading agents are already making money on their own.
  - The intended emotional layer is belonging to an informed community that makes you a better investor, not copying whoever is winning. The rollout is small and invite-only, and stresses learning and discussion over automated follow-the-leader investing. He hedges that success at scale depends on execution.
  - The shared logic across all three: move from utility to community and identity before agents commoditise the task layer.
- His three-part summary:
  1. Social identity: the community is the core experience and the utility is secondary.
  2. Personal identity mechanics: metrics and rituals that become part of how users see themselves.
  3. Deliberate community bets: build the community layer on purpose, before you are forced to, not as a scramble after agents arrive.

### Recipes
1. Community-first home, as narrated for Strava [03:05–05:39] (no layout values stated)
   1. Make the home tab a feed of what the people the user follows have done: runs, rides, achievements.
   2. Treat tracking as the input that fills the feed, not as the destination.
   3. Make personal records on segments public.
   4. Navigation audit: the social layer sits at the top level (home), not in a secondary tab.
2. Weekly identity metric, as narrated for Whoop Age and Pace of Aging [05:39–08:14]
   1. Build a baseline from months of data before showing the identity number.
   2. Fold many inputs (nine in Whoop's case) into one composite number with an intuitive meaning, an age.
   3. Add a faster-moving companion score, updated weekly on a rolling 30-day window, on a bounded scale (−1 to 3) whose ends have plain meanings.
   4. Keep the levers obvious (sleep, daily steps, recovery) so users act to move the number.
   5. Allow comparison with someone close; his example is a spouse with her own device.
3. Verified social feed for a high-stakes activity, as narrated for Robinhood Social [09:17–10:51]
   1. Posts are live, verified actions (real trades), not claims.
   2. Users follow people they trust, and each post shows entry and exit timing.
   3. Strategy discussion happens in the feed.
   4. A post can be the entry point for the viewer's own trade (see Gotchas).
   5. Launch small and invite-only, and position the feed around learning and discussion.

### CSS translation
```html
<!-- Weekly identity score, Whoop "Pace of Aging" style.
     Stated in the video: range −1 to 3, weekly update, last 30 days of behaviour.
     Markup, copy, thresholds and the sample value are (derived). -->
<figure class="identity-score">
  <figcaption>Pace of Aging · updated weekly from your last 30 days</figcaption>
  <meter min="-1" max="3" optimum="-1" low="0" high="1" value="0.6"></meter> <!-- low/high/value (derived) -->
  <p class="identity-score__trend">{this week} vs {last week}</p>
  <!-- Show the levers next to the number so it reads as "what to do", not a verdict (derived) -->
  <ul class="identity-score__levers"><li>Sleep consistency</li><li>Daily steps</li><li>Recovery</li></ul>
</figure>
```

### Gotchas
- Assuming agents are a feature that makes your app safer. He says they remove the reason users come.
- A tracking-first product with a social layer bolted on. Users who only came for the utility are the first to leave for an agent.
- A social layer buried in a tab, or none at all.
- Waiting for agents to commoditise the task and then hurrying to add social features.
- Dark-pattern risk, stated plainly (my note, not the creator's): the Whoop loop works on him because each week he's afraid the number will move the wrong way. A score that drives behaviour through fear is an anxiety loop. On health data, a formula-based "biological age" presented as who you are can overstate precision and encourage compulsive checking. If the skill builds one, show it as a trend with the actions that move it, and avoid alarm states.
- Dark-pattern risk, stated plainly (my note, not the creator's): starting a real-money trade directly from another user's post turns social proof into a near one-tap financial action. That invites herd buying and FOMO in the domain where mistakes cost the most. The creator himself says the rollout stresses learning over copying. Any version the skill builds needs a deliberate pause, a risk disclosure and the user's own review before an order. No one-tap copy trading.
- Identity as the moat means leaving costs users part of how they see themselves. That is fair when the community is real, and manipulative when the identity hook is manufactured to make leaving painful.

### Examples named
- Strava: home feed built from followed athletes' activities; public segment PRs; gaming-industry product and tech hires in 2024 (names unclear in captions: the CPO is captioned "Mat Ellisar", probably Matt Salazar; the CTO as "Rob Terrell").
- Runkeeper and other GPS trackers: technically competitive or better tracking, but lost on community.
- Epic Games (Fortnite growth) and Zynga (FarmVille): where Strava's new leaders came from; shorthand for social and competitive-loop expertise.
- Whoop: Whoop Age (nine-metric physiological age) and Pace of Aging (weekly, −1 to 3, last 30 days); daily recovery score as the feature he ignores.
- Robinhood Social (HOOD Summit 2025): invite-only feed of verified live trades, follows, entry/exit visibility, discussion, trade from a post.
- Gartner: source of the 40% embedded-agents prediction (creator's claim, unverified).

## Our World Class App Design Formula
- source: Tim Gabe · https://youtu.be/wmTkiF23GRQ
- type: principles
- tags: workflow, handoff, design-system, components, prototyping, states, animation, micro-interaction, accessibility, inspiration, onboarding, trust, copywriting, figma

### Takeaways
- Note: this is a walkthrough of his agency's process, interleaved with sales pitches (skipped here). The captions read like a machine translation of a dub, so several stage names are garbled. "Adaptation" is client onboarding, "Identification" in the recap is discovery, and the animation tool captioned "RI" is Rive. No visual values (sizes, radii, colours) are stated anywhere in the video.
- Core idea: a predictable path from napkin sketch to production app is a system that reduces risk at every step. The goals are that engineering moves fast after handover and users get something that feels real.
- House analogy: lay a solid foundation before adding beautiful finishes.
- The failure modes he sees in design teams:
  - diving into pixels too early
  - spending months on research that doesn't hold up in practice
  - skipping research altogether
  - not addressing emotional design, or how to engage users on purpose
- The result of those failures is rework, inconsistency and flat products users forget.
- The six stages: onboarding, discovery, UX, UI, emotional integration, delivery. Each one reduces risk, saves time and raises quality.
- Onboarding: give every project one source of truth from day one. Without it, details scatter across email and chat, which slows the work and raises the risk of misunderstandings. He credits John D. Saunders (name as heard) with the client-portal idea and says most agencies and freelancers still don't do it.
- Discovery is the high-level, strategic stage that decides everything after it. Both extremes are a recipe for disaster. Jumping straight to UI gives pretty screens that miss users' pain points. Months of research wastes time. Either way you pay later in redesigns and churn. He takes the middle ground: speed plus insight, so you work from clear goals instead of loose assumptions.
- UX turns the strategy into structure. Give each screen depth in proportion to how much it matters: settings get less attention than onboarding.
- He defends wireframes even though the wider design community criticises them. They are the fastest way to explore and communicate direction, and they keep the team on problem-solving before visual details. Jumping straight to visuals carries a high risk of a sub-optimal experience. The result won't be all bad, but it could be much better.
- Agree on paths, states and edge cases early, in the UX stage, not after the UI is drawn.
- Design for feel, not just function. Mark candidate emotional moments on specific screens during UX, so they are planned and not bolted on.
- UI: start broad and go deeper, the same way the earlier stages do. Move to high-fidelity visuals only after a lot of experiments and back-and-forth.
- People underestimate the UI stage, and he puts much of his own quality-control time there. Small inconsistencies do outsized damage to the world-class feel. He names three:
  - misaligned border radii
  - too many colour shades
  - unintentional visual emphasis
- Those inconsistencies also make developers miserable, because they have to work with an inconsistent design system.
- Quality bar: every detail matters, from the microcopy down to the exact opacity of each element.
- A polished UI looks world-class to most people but doesn't make anyone feel anything. That is the job of the emotional-integration stage, which he calls his agency's speciality.
- In an era of AI-built products, competitors are everywhere and all focus on ease of use. Usability is necessary but not enough to stand out. You need emotional touchpoints: the right feeling at the right moment, designed to drive behaviour and reinforce it.
- Emotional integration is not animation for animation's sake. Pick moments from strategic goals: which feeling you want at which point in the journey. It takes deep thought for these moments to affect business results.
- Animations should be lightweight and, in many cases, interactive. Rive is the tool he uses, the same one Duolingo uses for high-performance animation.
- Emotional moments from client work:
  - A crypto project: the main element of each home screen was given meaning through colour, and the experience is reinforced every time the user opens their portfolio or takes a key action. The captions are unclear on exactly which element.
  - A retail client: a distinctive first impression built to boost its launch campaign.
  - Freecash: a tiered diamond system that encourages users to come back and buy again. He says it is currently number 2 in the App Store (creator's claim, unverified).
  - Nila Health (name as heard; AI note-taking): the logotype was worked into the core app experience. Details not stated.
  - A fintech client with a web3 audience: an emotional connection during onboarding, to win extra trust from a very trust-sensitive audience.
- Delivery: if you skip the final cleanup and QA, small cracks turn into bigger problems after handover.
- Results he claims for the process: clients have raised tens of millions of dollars and scaled to tens of thousands of users (creator's claim, unverified).

### Recipes
1. The six-stage process, step by step [01:30–14:07]
   1. Onboarding (captioned "adaptation") [02:01–03:33]
      1. Set up a dedicated client portal in Notion, a "client OS": schedules, tasks, decisions, files, meeting notes.
      2. On day one, open communication channels, file access and Google Drive folders.
      3. Send a welcome checklist and a summary discovery-and-strategy document, so the client always knows what is next.
   2. Discovery [03:33–05:03]
      1. Hold at least one project discovery workshop to set deliverables, constraints and success metrics.
      2. Collect references (captioned "recommendations") to align on taste, and set clear guardrails.
      3. Analyse direct and indirect competitors by downloading and actually using their apps.
      4. Do targeted product research to de-risk the key decisions on the key flows before any design starts.
   3. UX [05:03–07:03]
      1. Define the key user paths.
      2. Wireframe the entire app, with the most depth on key flows (onboarding deep, settings light).
      3. Where useful, make lower-fidelity mockups to get buy-in on rough ideas before spending time polishing them.
      4. Agree on paths, states and edge cases at this point.
      5. Mark potential emotional-design moments on specific screens.
      6. Prototype the important interactions to simulate and test the flow and logic.
   4. UI [07:33–09:34]
      1. Explore conceptual directions for the whole product: mood boards, concept screens, many directions.
      2. After rounds of experiments and feedback, move to high-fidelity visual design and reusable UI patterns.
      3. Run a strict QC protocol: tick every visual check for a screen before moving to the next one. Review comments pile up in the Figma files.
      4. Build the library component by component until it covers everything.
   5. Emotional integration [09:34–12:36]
      1. Go back to the emotional moments marked in the UX stage.
      2. Shortlist the ones most tied to the client's business goals, by deciding which feeling you want at which point in the journey.
      3. Build them as lightweight, often interactive animations in Rive.
   6. Delivery (captioned "cleaning and shipping") [12:36–13:37]
      1. Clean up the file and cover last-minute edge cases, leftover states and missing accessibility details.
      2. Run one more QA round over the whole project.
      3. Package the source file, include specs and organise the components, so the engineering team, or a founder building it themselves, has everything.
2. Per-screen UI QC checks, as named [08:33–09:34] (his full checklist is not shown; these are only the items he states)
   1. Border radii are consistent, with none misaligned or off-system.
   2. Colour shades are not overused; each screen uses only the system's shades.
   3. Nothing has emphasis it wasn't meant to have.
   4. Microcopy has been reviewed.
   5. Every element's opacity is deliberate and exact.
   6. Only after all of these pass, move to the next screen.

### CSS translation
```css
/* A closed token set makes the QC failures he names (off-scale radii, too many shades,
   ad-hoc opacities) hard to introduce. The video states no values; all numbers are (derived). */
:root {
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 20px;   /* the only radii allowed (derived) */
  --opacity-secondary: 0.72; --opacity-disabled: 0.4;       /* one opacity per role (derived) */
  /* colour: a fixed ramp per hue, referenced by token only; no one-off values in components */
}
.card   { border-radius: var(--radius-md); }
.button { border-radius: var(--radius-sm); }
/* Emotional moments stay lightweight, and switch off for users who ask for less motion (derived) */
@media (prefers-reduced-motion: reduce) { .moment { animation: none; transition: none; } }
```

### Gotchas
- Diving into pixels before structure; months of research that never meets reality; or no research at all.
- Giving every screen equal depth. Settings don't deserve onboarding's attention.
- Skipping wireframes because they're unfashionable, which raises the risk of a sub-optimal experience.
- Leaving states and edge cases until after the UI is drawn.
- Moving to the next screen before QC. Stray radii, extra colour shades and accidental emphasis add up to a product that doesn't feel world-class, and to a design system developers struggle with.
- Treating usability as the finish line. In his view it is now table stakes.
- Animation for animation's sake, or heavy animation. He keeps it lightweight and tied to a goal.
- Skipping the final cleanup and QA pass, which leaves accessibility gaps and missing states to crack after handover.
- Project details scattered across email and chat with no single source of truth.
- Persuasion risk, stated plainly (my note, not the creator's): designing emotional moments to drive and reinforce behaviour, and status tiers built to bring users back to buy again (the Freecash diamond system), are persuasion levers. They are fine when they reward value the user wants. They become manipulative when they push spending the user wouldn't choose. Keep tier rules, costs and progress transparent.
- Trust risk (my note, not the creator's): building trust with a web3 audience through an emotional onboarding moment only works ethically if the facts behind it (fees, custody, risk) are equally clear. Mood must not stand in for disclosure.

### Examples named
- Notion: the client portal and "client OS" (schedules, tasks, decisions, files, meeting notes).
- Google Drive: shared client folders set up during onboarding.
- John D. Saunders (name as heard): credited with the client-portal idea.
- Figma: where the internal QC comments accumulate.
- Rive (captioned "RI"): the tool for lightweight, interactive emotional animations.
- Duolingo: uses Rive for its high-performance animations.
- Freecash: tiered diamond system for repeat purchases; number 2 in the App Store per the creator (creator's claim, unverified).
- Nila Health (name as heard): AI note-taking app with its logotype worked into the core experience.
- Unnamed crypto, retail and fintech/web3 clients: colour-coded meaning on the home screen's key element; a launch first impression; trust built during onboarding.
- Duolingo, Revolut, Phantom: subjects of a related emotional-design video he points to.

## The New Way Apps Dominate in 2026
- source: Tim Gabe · https://youtu.be/yYs7iv81Ppk
- type: product-psychology
- tags: psychology, retention, personalization, ai, habit, onboarding, trust, saas, dark-patterns

### Takeaways
- Engagement work (dopamine loops, addictive micro-interactions, hooking animations) still matters a lot. His claim is that the apps winning in 2026 also turn your usage into an intelligence you can't take with you: your sleep patterns, your creative taste, your company's financial logic.
- The best products learn the user. Over time they understand you so well that leaving feels like starting again with someone who doesn't know you. He presents this as a design pattern.
- Two layers:
  - Layer 1, engagement: smooth onboarding, satisfying interactions, habit-forming loops. He says you absolutely need it in an "AI-slopified" market, but on its own it is a treadmill. It keeps users running without stopping them from stepping onto a different one.
  - Layer 2, investment: every session deposits something irreplaceable that compounds and can't be carried elsewhere.
- Lineage: Nir Eyal introduced "stored value" in Hooked (2014). Users put value into a product, and that investment keeps them. He says AI has supercharged the idea into what he calls the "intelligence trap": each session doesn't just store data, it trains an intelligence that can't be transferred, exported or rebuilt overnight.
- Pattern 1, a taste profile (Midjourney):
  - Claims: $500M revenue in 2025, $0 of VC funding, no real marketing budget, roughly 150 employees, so over $3M revenue per employee. It started as a Discord bot with no website, native app or polished onboarding, and grew entirely by word of mouth (creator's claim, unverified).
  - It competes with Adobe Firefly and DALL·E, which have billion-dollar backing, massive distribution and years of brand recognition.
  - After the user goes through image-pair ranking, Midjourney builds a personalisation profile. It isn't a settings page but a trained sub-model of the user's visual taste. It learns:
    - warm vs cool tones
    - maximalist vs minimal composition
    - photorealistic vs painterly style
  - In version 7, personalisation is on by default, and over 70% of active users adopted it within 3 months (creator's claim, unverified).
  - Every image generated, every variation picked and every mood board curated trains it further. A user who switches to DALL·E starts over with no profile, no mood boards and no creative history. The more you use it, the better it knows what beautiful means to you.
  - Research he cites: Norton, Mochon and Ariely's IKEA-effect study found people value things they helped create 63% more (creator's claim, unverified).
  - How to apply it:
    1. Map your investment loop. For every core action, ask whether it makes the product better for this user specifically or just better in general. If it's general, you are building features, not stored value.
    2. Design for cumulative personalisation. Find your product's equivalent of Midjourney's ranking, the action that compounds, and make it frictionless.
    3. Measure the compounding. Track how much better the product performs for a 6-month user than for a 10-day user. No measurable gap means the loop isn't working.
- Pattern 2, a body baseline (Oura Ring):
  - Claims: millions of rings sold, on track for $1B in revenue, and a $97M contract from the US Department of Defense (creator's claim, unverified).
  - After 3 years of wear, Oura holds 1,095 nights of the user's sleep architecture, plus heart-rate-variability trends, respiratory-rate patterns and temperature baselines. Its AI advisor uses all of it for advice calibrated to that user's physiology, not generic "sleep more" tips.
  - The EU Data Act requires Oura to let users export their data, so they can technically leave with their sleep CSVs. But the CSV doesn't contain the model that learned the body's rhythms over 3 years. You get the numbers, not the intelligence. The law freed the data, not the model trained on it, so data lock-in has become intelligence lock-in.
  - Retention stays in the high 80s (%) even behind a $5.99 monthly subscription, on data the user's own body produced (creator's claim, unverified).
  - Test: if session 1,000 works the same as session 10, you have built a good engagement product but no investment layer.
  - How to apply it:
    1. Identify which of the data you already collect could compound into personalised intelligence, and learn from it rather than just storing it.
    2. Make the intelligence visible. Oura shows how many nights the body has been tracked (1,095 in his example). When users can see their investment growing, retention feels like a partnership rather than a trap.
    3. Ask the exit question: if a user left for a competitor today, what would they have to rebuild from scratch? If the answer is "not much", there is no intelligence layer yet.
- Pattern 3, decision intelligence (Ramp):
  - Claims: a spend-management platform used by over 50,000 companies, including Shopify, Figma and Notion, whose AI agents made millions of autonomous spend decisions in a single month (creator's claim, unverified).
  - Every automation rule, card policy, vendor categorisation and accounting integration a team sets up encodes the company's financial logic, and that took years to build up.
  - The principle generalises because every product accumulates decision intelligence: spending rules for Ramp, workflow patterns for a project-management tool, sales playbooks for a CRM. The question is whether the product learns from those decisions or only stores them.
  - Ramp's main competitor, Brex, was acquired by Capital One in January 2026 for less than half its peak valuation (creator's claim, unverified). He says both had great design and strong engagement, but only Ramp layered compounding investment loops on top.
  - How to apply it:
    1. Find the decisions users make repeatedly, and have the product learn from each one so the next is easier. If every decision starts from zero, you are leaving stored value on the table.
    2. Count your integration routes. Every external system that depends on your product (accounting, HR, Slack) makes switching more painful.
    3. Automate the deposit. Users shouldn't have to invest consciously; every transaction should train the model on its own.
- His three-part summary:
  1. Build personalised intelligence, not just features. Midjourney didn't out-design Adobe; it built a taste profile that improves with every image.
  2. Engagement gets users in the door, and investment keeps them long-term.
  3. The question isn't whether users can export their data, but whether they can export the intelligence built from it. That gap is the "intelligence trap".

### Recipes
1. Pairwise taste ranking that feeds a profile, as narrated for Midjourney [03:32–04:35] (no screen layout stated)
   1. Show the user pairs of images; they pick one from each pair.
   2. Build a profile along named axes: warm/cool tone, maximalist/minimal composition, photoreal/painterly style.
   3. Switch the profile on by default (as in V7) and keep training it from every generation, every variation choice and every mood board.
2. Visible investment, as narrated for Oura [06:40–08:15]
   1. Show the accumulated history as a running count (nights tracked).
   2. Base advice on the user's own baselines (sleep architecture, HRV, respiratory rate, temperature), never generic tips.
3. Passive deposit, as narrated for Ramp [09:16–11:21]
   1. Store the user's rules, policies, categorisations and integrations as their configuration.
   2. Learn from every transaction automatically, with no extra step for the user.
   3. Use what was learned to make the next similar decision easier.
4. Investment-layer audit (his apply steps, grouped) [04:35–05:37, 07:44–08:46, 10:18–11:21]
   1. For each core action: does it improve the product for this user, or only in general?
   2. Which compounding action is your "ranking", and how much friction does it have?
   3. How much better does the product perform for a 6-month user than for a 10-day user?
   4. Is session 1,000 any different from session 10?
   5. Can users see their accumulated investment?
   6. If a user left today, what would they have to rebuild?
   7. Which repeated decisions start from zero every time?
   8. How many external systems depend on the product?
   9. Which deposits are automatic, and which require conscious effort?

### CSS translation
```html
<!-- Pairwise taste ranking (Midjourney-style). The video names the mechanic only;
     markup, copy and sizes are (derived). -->
<section class="pair-rank" aria-labelledby="pair-q">
  <h2 id="pair-q">Which do you prefer?</h2>
  <div class="pair-rank__options">
    <button type="button" class="pair-rank__option"><img src="a.jpg" alt="Option A: {description}"></button>
    <button type="button" class="pair-rank__option"><img src="b.jpg" alt="Option B: {description}"></button>
  </div>
  <button type="button" class="pair-rank__skip">Skip</button>
</section>

<!-- Visible investment line, after the Oura count; the number is live data.
     The see/export/reset links are the ethical counterpart (see Gotchas) and are (derived). -->
<p class="investment">Your body has been tracked for <strong>{nights}</strong> nights</p>
<nav class="profile-controls"><a href="/profile">See what we've learned</a> · <a href="/export">Export</a> · <a href="/profile/reset">Reset</a></nav>
```
```css
.pair-rank__options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }                  /* (derived) */
.pair-rank__option img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; }   /* (derived) */
```

### Gotchas
- An engagement-only product (the treadmill): good onboarding and loops, but nothing compounds, so users leave easily.
- Storing user data without learning from it.
- Personalisation that makes the product better in general, not for this specific user.
- Putting friction on the one action that compounds.
- Intelligence the user can't see. If the investment is invisible, staying feels like a trap rather than a partnership.
- Making the deposit a conscious chore instead of a by-product of normal use.
- Never checking whether long-term users actually get better results than new ones.
- Dark pattern, stated plainly: the creator's own framing is lock-in. He calls it a "trap", talks about making the exit door heavier with every session, and celebrates intelligence that no regulation or competitor can return. Treating switching cost as the goal is manipulative, and it works against the portability the EU Data Act exists to protect. The skill should aim for compounding value the user can see and benefit from. It should offer an honest export, including a readable version of the learned profile or preferences where feasible, and never add friction to leaving. Retention should come from the product being better for this user, not from holding their history hostage.
- My note, not the creator's: personalisation that is on by default trains on user behaviour without an explicit choice. Say so plainly, and give users a way to view, reset or switch off the profile.

### Examples named
- Nir Eyal, Hooked (2014): the "stored value" idea this builds on.
- Midjourney: Discord-bot origins, image-pair ranking, a personalisation profile on by default in V7, mood boards; growth by word of mouth.
- Adobe Firefly, DALL·E: better-funded competitors where a switching user starts with no profile.
- Norton, Mochon and Ariely: the IKEA-effect study (63%, creator's claim, unverified).
- Oura Ring: 1,095 nights of baselines after 3 years, an AI advisor calibrated to the user, a visible tracked-nights count; CSV export under the EU Data Act without the learned model.
- Ramp: rules, card policies, vendor categories and integrations as encoded financial logic; AI agents deciding on spend; customers named as Shopify, Figma and Notion.
- Brex: the competitor sold to Capital One (creator's claim, unverified).
