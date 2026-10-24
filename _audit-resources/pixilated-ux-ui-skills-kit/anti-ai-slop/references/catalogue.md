# AI slop catalogue

Every ID below is used by the scripts and the report. **Det** says how it's found: S = static scan
(`slop_scan.py`), R = rendered audit (`slop_render.py`), V = your visual pass.
Sources: Adrian Krebs' audit of 1,590 Show HN pages (16 DOM/CSS checks; 22% heavy, 32% mild, 46%
clean), Paralect's 21 patterns, avoid-ai-design (67 tells), Hallmark (65 gates), Anthropic's
frontend-design "AI clusters", Pangram's AI-writing data (em dashes ~10× more frequent in AI text,
triads ~4×, "not just X but Y" ~3×; vendor figures), Kole Jain's "5 SaaS UI/UX mistakes that SCREAM
you Vibe Code", and Pixilated house rules. Treat single tells as weak evidence; clusters are the signal.

## Contents
1. Owner non-negotiables (O)
2. Surfaces and cards (V)
3. Colour (K)
4. Typography (T)
5. Icons and imagery (I)
6. Layout (L)
7. Buttons and controls (B)
8. Data and dashboards (D)
9. Motion (M)
10. Copy (C)
11. Visual-only checks (your eyes)

---

## 1. Owner non-negotiables (always P0)
| ID | Tell | Det |
|---|---|---|
| O1 | Accent stripe on a card: coloured border on one side, or a thin absolutely positioned `::before`/`::after` bar along an edge, or a top gradient line | S R |
| O2 | Border or 1 px ring (`box-shadow: 0 0 0 1px`) on a block that isn't interactive (stroke = state) | R V |
| O3 | Dash punctuation in visible text: em dash, en dash, spaced hyphen, "—" as an empty value | S R |
| O4 | Badly padded button: horizontal/vertical padding ratio < 1.4 or > 3.5, label closer than 12 px to an edge, height off the 32/40/48 scale, mixed heights at one size, touch target < 44 px on mobile | R |
| O5 | Icon inside a tinted background tile (square, squircle or circle behind a ≤ 32 px icon) | R V |
| O6 | Dot inside a chip, pill, badge, tag or status label (`::before` circle, `.dot` span, "●"); chart legends excepted | S R |

## 2. Surfaces and cards
| ID | Sev | Tell | Det |
|---|---|---|---|
| V1 | P1 | Nested cards: a bordered/shadowed rounded box inside another | R |
| V2 | P2 | Same radius and same shadow on everything (≥ 6 elements share one box-shadow) | R |
| V3 | P1 | Default grey card shadow (`rgba(0,0,0,.1)`, Tailwind `shadow-md/lg`) on every card | S R |
| V4 | P1 | Glass card: `backdrop-filter: blur` on a static, non-overlay element | S R |
| V5 | P0 | Gradient-filled text (`background-clip: text`) | S R |
| V6 | P1 | Coloured glow / coloured box-shadow behind cards or the hero | S R |
| V7 | P2 | Background grid, dot pattern or noise used as decoration | S V |
| V8 | P2 | Borders around every section and every item, so borders stop meaning anything | V |
| V9 | P2 | Fake window chrome (three dots) on things that aren't mockups | S V |

## 3. Colour
| ID | Sev | Tell | Det |
|---|---|---|---|
| K1 | P0 | Purple / indigo / violet gradient (hue ≈ 240 to 300), "VibeCode purple", Tailwind indigo-500 `#6366f1`, violet-500 `#8b5cf6`, purple-500 `#a855f7` | S R |
| K2 | P1 | Lavender accent on a page that isn't about anything lavender | S V |
| K3 | P1 | Dark mode by default for no brand reason, with medium-grey body text | V |
| K4 | P0 | Body text below 4.5:1 contrast (light grey on white, grey on dark) | R |
| K5 | P1 | Cream `#F4F1EA`-ish + terracotta `#D97757`-ish ("the Claude look") as a default | S |
| K6 | P1 | Near-black + one acid-green / vermilion accent as a default | S V |
| K7 | P1 | Rainbow of status/tag colours with no shared meaning | V |
| K8 | P2 | Untouched shadcn/Tailwind palette (slate/zinc + indigo) | S |

## 4. Typography
| ID | Sev | Tell | Det |
|---|---|---|---|
| T1 | P2 | Default "safe" faces with no brand reason: Inter, Geist, Space Grotesk, Instrument Serif, Fraunces, DM Sans, Poppins, Plus Jakarta | S R |
| T2 | P1 | One italic or coloured accent word in a headline | S V |
| T3 | P1 | All-caps, letter-spaced eyebrow label above headings or as section labels | S R |
| T4 | P1 | Monospace on labels, tags, buttons or prose (fine for code, table numbers, copyable IDs) | R V |
| T5 | P2 | More than 6 font sizes or more than 3 weights on one screen | R |
| T6 | P2 | Title Case On Buttons And Headings | S R |
| T7 | P2 | Headline in a pill badge sitting above the H1 | V |

## 5. Icons and imagery
| ID | Sev | Tell | Det |
|---|---|---|---|
| I1 | P0 | Emoji used as icons (nav, buttons, list bullets, headings, logos) | S R |
| I2 | P1 | Mixed icon sets or stroke widths | V |
| I3 | P1 | Gradient-initial avatars / coloured initial circles standing in for people | R V |
| I4 | P1 | Abstract 3D blobs, glossy plastic shapes, mesh-gradient orbs as decoration | V |
| I5 | P1 | Placeholder boxes where a real screenshot, product or photo should be | V |
| I6 | P2 | Generic icon on every card (sparkles, rocket, lightning, shield) | S V |

## 6. Layout
| ID | Sev | Tell | Det |
|---|---|---|---|
| L1 | P0 | Centred hero + pill badge above the headline + two buttons | V |
| L2 | P1 | Three (or six) identical icon-topped feature cards in a row | R V |
| L3 | P1 | 01 / 02 / 03 numbering on content that isn't a sequence | S V |
| L4 | P1 | Stat banner / KPI row of identical cards ("10k+ users · 99.9% uptime") | R V |
| L5 | P2 | Stock section order: hero → logos → 3 features → testimonials → pricing → FAQ → CTA | V |
| L6 | P2 | Everything centred | R V |
| L7 | P2 | The same section layout repeated down the page | V |
| L8 | P1 | Overstuffed: banners, tips, checklists and widgets nobody acts on | V |

## 7. Buttons and controls
| ID | Sev | Tell | Det |
|---|---|---|---|
| B1 | P1 | More than one filled primary button per section | R V |
| B2 | P2 | Pill shape on every control (buttons, inputs, cards, tags) | R |
| B3 | P1 | Icon-only button with no accessible name or tooltip | R |
| B4 | P2 | Hover lift/scale on every card, not only clickable ones | S |
| B5 | P1 | Secondary and primary indistinguishable, or a ghost button that looks disabled | V |

## 8. Data and dashboards
| ID | Sev | Tell | Det |
|---|---|---|---|
| D1 | P1 | Numbers with no label or unit | V |
| D2 | P1 | Curved/smoothed data lines, fading lines, decorative charts | S V |
| D3 | P1 | Every status coloured, so nothing stands out | R V |
| D4 | P2 | A sparkline or delta chip on every card | V |
| D5 | P1 | "Welcome back, Name!" greeting as the page title | S |
| D6 | P1 | Widgets nobody can explain; duplicated controls (two searches) | V |

## 9. Motion
| ID | Sev | Tell | Det |
|---|---|---|---|
| M1 | P1 | Fade/slide-up entrance on every section | S |
| M2 | P2 | Decorative loops: pulsing dots, blinking cursors, bouncing buttons, marquees without pause | S V |
| M3 | P1 | No `prefers-reduced-motion` handling while animating | S |
| M4 | P2 | Linear easing on UI transitions | S |

## 10. Copy
Rules for every rewrite: shorter, plain verbs, sentence case, digits for numbers, the user's own
words, no dashes. These are the AI-writing tells most often cited (humanizer Tier 1/2, Pangram).
| ID | Sev | Tell | Det |
|---|---|---|---|
| C1 | P0 | Dash punctuation (= O3) | S R |
| C2 | P1 | "Not just X, but Y" / "It's not X, it's Y" / tailing negations ("No guesswork.") | S |
| C3 | P2 | Triads everywhere ("fast, simple, and secure") | S |
| C4 | P1 | AI vocabulary: delve, tapestry, seamless(ly), elevate, unlock, empower, supercharge, revolutionize, effortless, next-gen, cutting-edge, robust, leverage, harness, streamline, game-changer, journey, landscape, realm, testament, pivotal, vibrant, nestled, crafted, curated, in today's fast-paced world | S |
| C5 | P1 | Generic hero lines: "Build the future", "Your all-in-one platform", "Work smarter, not harder", "Everything you need to…" | S |
| C6 | P2 | Exclamation marks in UI text | S R |
| C7 | P2 | → appended to links and buttons ("Learn more →") | S R |
| C8 | P2 | Meta strings chained with middle dots ("A · B · C · D") | S R |
| C9 | P1 | Vague CTAs everywhere: "Get started", "Learn more", "Submit", "Click here" | S |
| C10 | P2 | Numbers written as words in headings and labels | S |
| C11 | P1 | Chatbot residue: "Certainly!", "Great question", "I hope this helps", "Let's dive in" | S |
| C12 | P1 | "WORD: fragment" labels, colon-reveal headlines ("The result: magic") | S |
| C13 | P2 | Fragmented headers: a heading followed by a line that repeats it | V |
| C14 | P1 | Placeholder people and text: John Doe, Jane Smith, Acme, Lorem ipsum | S |
| C15 | P0 | Proof nobody can check: round stats ("10,000+ happy customers", "99.9%"), logo walls, first-name-only testimonials | S V |
| C16 | P1 | Unsourced superlatives: "the best", "#1", "world-class", "loved by thousands" | S |

---

## 11. Visual-only checks (do these on clean.png every time)
1. **Silhouette test.** Blur your eyes: would this layout fit any product in any industry? If yes, which
   element makes it specific to *this* subject? If none, that's the biggest finding.
2. **Count the tells.** 0 to 1 clean, 2 to 3 mild, 4+ heavy (Krebs bands). Report the count.
3. **Sameness.** Identical cards, identical radii, identical icon chips, identical section rhythm.
4. **Decoration with no job.** Every glow, gradient, badge, dot and divider must carry information.
5. **Hierarchy.** One thing is clearly first. If three things shout, none does.
6. **Stroke = state.** Point at each bordered thing and ask "can I click it?" If not, it loses the stroke.
7. **Copy read-aloud.** Read every label as a user would. Anything that sounds like a brochure or a
   chatbot gets rewritten.
8. **Real content.** Real product, real numbers with sources or clearly marked samples, real names
   (or obviously fictional demo data said so on screen).
