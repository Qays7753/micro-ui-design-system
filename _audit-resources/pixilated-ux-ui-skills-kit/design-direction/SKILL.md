---
name: design-direction
description: >
  Pixilated's Design Direction skill. Activate BEFORE any UI design work to collect
  specific visual design decisions from the user: header style, grid type, layout
  system, hero section, navigation, footer, color palette, typography, animation,
  card styles, image treatment, spacing, border radius, and reference sites. Outputs
  a Direction Summary + Visual Moodboard. Triggers include: "design direction",
  "direction for", "set the direction", "before we design", "what should it look like",
  "style direction", "visual direction", "layout direction", "look and feel",
  "moodboard", "mood board", "design spec", "design inputs", "design choices",
  "pick a style", "choose the design", "website direction", "app direction".
  Always activate when starting a new design project and the visual direction
  hasn't been defined yet.
---

# Design Direction — Pixilated

## Purpose
Collect specific visual design decisions from the user through structured questions.
No business strategy, no UX research — purely visual specs. The output feeds directly
into the UI Designer Agent as a locked design direction.

---

## QUESTIONS

Ask these conversationally, 2–3 at a time. Use `ask_user_input` widgets for
multiple-choice questions when available. Dig deeper if answers are vague.

---

### Q1 — LAYOUT SYSTEM
> What layout system should the site follow?

Options to offer:
- **Swiss/Grid** — strict grid, clean alignment, structured whitespace (e.g. Linear, IBM)
- **Bento Grid** — modular card tiles, mixed sizes, rounded containers (e.g. Apple features page, Vercel)
- **Editorial/Magazine** — multi-column editorial flow, asymmetric, typographic hierarchy (e.g. Bloomberg, Monocle)
- **Full-bleed Sections** — stacked full-width blocks, immersive, scroll-based (e.g. Stripe, Nothing)
- **Asymmetric/Broken Grid** — off-center compositions, overlapping elements, dynamic tension (e.g. Awwwards-style)
- **Single Column** — linear top-to-bottom, content-focused, minimal distraction (e.g. Medium, Ghost blogs)
- **Dashboard/Dense** — data-heavy, sidebar + content area, compact (e.g. Linear, Notion)
- **Masonry** — Pinterest-style staggered grid (e.g. portfolios, galleries)
- **Custom** — describe or provide a reference

---

### Q2 — HEADER / NAVIGATION STYLE
> What kind of header and navigation do you want?

Options to offer:
- **Minimal Bar** — logo left, few links right, clean line (e.g. Linear, Stripe)
- **Centered Logo** — logo center, links split left/right (e.g. editorial, fashion brands)
- **Mega Menu** — full-width dropdown panels with categories, images, featured items (e.g. Amazon, large SaaS)
- **Hamburger Only** — hidden menu behind icon, even on desktop (e.g. portfolio sites, immersive experiences)
- **Sticky/Fixed** — stays visible on scroll, shrinks or changes on scroll
- **Transparent Overlay** — floats over hero image, becomes solid on scroll
- **Sidebar Navigation** — vertical nav on left side (e.g. dashboards, docs sites)
- **Tab Bar (Mobile)** — bottom tab bar for app-like navigation
- **Pill Navigation** — rounded pill-shaped nav items, floating style
- **No Header** — navigation embedded in content or minimal (e.g. single-page experiences)

Follow-up: Should the header be sticky? Transparent over hero? Should it change on scroll?

---

### Q3 — HERO SECTION STYLE
> What kind of hero section should the landing page have?

Options to offer:
- **Text-Only Hero** — big headline, subtitle, CTA, no image (e.g. Linear, Vercel)
- **Split Hero** — text on one side, image/visual on the other (e.g. Mailchimp, Intercom)
- **Full-Screen Image/Video** — immersive background with text overlay (e.g. Apple, Nike)
- **Animated/Interactive Hero** — 3D, particles, canvas, scroll-triggered (e.g. Stripe, Nothing)
- **Product Screenshot Hero** — app mockup or browser frame as centerpiece (e.g. SaaS products)
- **Illustration Hero** — custom illustration as the main visual (e.g. Notion, Slack)
- **Slider/Carousel Hero** — rotating slides (e.g. e-commerce, news)
- **Minimal/No Hero** — jump straight into content (e.g. dashboards, tools)
- **Editorial Hero** — large typography with editorial layout, article-style (e.g. NYT, Bloomberg)

Follow-up: Height preference? Full viewport, 70vh, compact? Should it have scroll-down indicator?

---

### Q4 — COLOR PALETTE
> What's the color direction?

Questions to ask:
- **Primary color**: What's the main brand/accent color? (hex, name, or "pick for me")
- **Background approach**: Light, dark, or both?
- **Palette mood**: Warm (earth tones, amber, coral) / Cool (blue, slate, teal) / Neutral (grays, black, white) / Vibrant (saturated, electric) / Muted (desaturated, soft) / Monochrome (one color + shades)
- **Accent strategy**: Single strong accent, or multiple accent colors?
- **Gradient usage**: No gradients / Subtle gradients / Bold gradients / Mesh gradients
- **Any colors to avoid?** (competitor colors, personal dislikes)
- **Reference**: Any brand or site whose color palette you love?

---

### Q5 — TYPOGRAPHY
> What typography direction?

Options to offer:
- **Clean Sans-Serif** — modern, neutral (e.g. Inter, DM Sans, Geist)
- **Geometric Sans** — structured, tech-forward (e.g. Outfit, Satoshi, General Sans)
- **Humanist Sans** — warm, approachable (e.g. Source Sans, Nunito, Public Sans)
- **Classic Serif** — editorial, premium (e.g. Playfair, Lora, Merriweather)
- **Modern Serif** — sharp, contemporary (e.g. Instrument Serif, Fraunces)
- **Mono/Code** — technical, developer-oriented (e.g. JetBrains Mono, Fira Code)
- **Display/Statement** — oversized headlines, expressive type (e.g. Clash Display, Cabinet Grotesk)
- **Mixed Pairing** — serif headlines + sans body, or display + clean body
- **Arabic-first** — Arabic display font as primary (e.g. IBM Plex Arabic, Cairo, Tajawal)

Follow-up questions:
- Should headlines be bold and oversized, or refined and subtle?
- Any specific fonts you love or hate?
- Need Arabic / RTL typography support?

---

### Q6 — CARD & COMPONENT STYLE
> What should cards and content containers look like?

Options to offer:
- **Flat** — no shadow, no border, just background color difference
- **Outlined** — thin border, no shadow, clean edges
- **Elevated** — shadow-based depth, floating feel
- **Glassmorphism** — frosted glass, backdrop blur, semi-transparent
- **Neumorphism** — soft raised/inset shadows, plastic feel
- **Gradient Border** — border with gradient effect
- **Filled/Solid** — strong background fill, high contrast containers
- **Minimal/Invisible** — content with no visible container, whitespace-defined

Follow-up: What border-radius? (Sharp 0px / Slight 4-6px / Rounded 8-12px / Pill 16-24px / Full-round 999px)

---

### Q7 — BORDER RADIUS SYSTEM
> What's the overall corner rounding preference?

Options to offer:
- **Sharp (0px)** — brutalist, editorial, Swiss-style
- **Subtle (4–6px)** — professional, SaaS standard
- **Rounded (8–12px)** — modern, friendly (most common 2026)
- **Heavily Rounded (16–24px)** — bento-style, Apple-inspired, soft
- **Pill (999px)** — buttons and tags fully rounded
- **Mixed** — sharp containers + pill buttons, or other combinations

---

### Q8 — SPACING & DENSITY
> How dense or spacious should the design feel?

Options to offer:
- **Airy / Generous** — lots of whitespace, breathing room, luxury feel (e.g. Apple, Aesop)
- **Balanced** — standard spacing, comfortable reading (e.g. Stripe, Notion)
- **Compact / Dense** — information-rich, efficient, dashboard-like (e.g. Linear, Bloomberg)
- **Mixed** — airy hero/marketing sections + dense content/data sections

---

### Q9 — IMAGE & MEDIA STYLE
> What kind of imagery and media?

Options to offer:
- **Photography — Lifestyle/Candid** — real people, natural settings, documentary feel
- **Photography — Studio/Product** — controlled, clean backgrounds, product focus
- **Photography — Editorial** — artistic, moody, cinematic
- **Custom Illustration** — flat, isometric, hand-drawn, or geometric
- **3D Renders** — product mockups, abstract shapes, floating elements
- **Abstract/Geometric** — patterns, shapes, gradients as visuals
- **Data Visualization** — charts, graphs, data as visual content
- **Screenshots/UI** — product screenshots, browser mockups
- **Minimal/Text-Only** — no images, typography-driven
- **AI-Generated** — AI art or renders as visual elements
- **Video/Motion** — background video, product demos, motion graphics

Follow-up: Should images have treatments? (Rounded corners, masks, duotone, overlays, borders)

---

### Q10 — ANIMATION & MOTION
> How much animation and motion?

Options to offer:
- **None** — static, no animations, instant transitions
- **Subtle** — gentle hover states, smooth transitions, fade-ins (e.g. Notion, Linear)
- **Moderate** — scroll-triggered reveals, staggered animations, page transitions (e.g. Stripe, Vercel)
- **Heavy/Immersive** — parallax, 3D, canvas, scroll-jacking, cinematic (e.g. Nothing, Apple product pages)

Follow-up questions:
- Scroll animations? (elements animate as they enter viewport)
- Hover effects? (scale, glow, lift, color shift, magnetic)
- Page transitions? (fade, slide, morph)
- Loading animations? (skeleton screens, spinners, progress bars)
- Should motion feel snappy/fast or smooth/cinematic?

---

### Q11 — FOOTER STYLE
> What kind of footer?

Options to offer:
- **Minimal** — logo + copyright + few links, single row
- **Standard Multi-Column** — 3–5 columns with link groups (e.g. most SaaS sites)
- **Fat Footer** — large footer with newsletter signup, social links, contact info, sitemap
- **CTA Footer** — footer focused on a final call-to-action before links
- **Sticky/Fixed Footer** — minimal bar always visible at bottom
- **No Footer** — infinite scroll or app-like experience
- **Mega Footer** — comprehensive, almost a mini-sitemap (e.g. enterprise sites)

Follow-up: Newsletter signup in footer? Social media links? Language switcher?

---

### Q12 — NAVIGATION PATTERN (INNER PAGES)
> How should inner-page navigation work?

Options to offer:
- **Top Nav Only** — same header nav throughout
- **Breadcrumbs** — path trail (Home > Section > Page)
- **Sidebar** — left sidebar for sub-navigation (e.g. docs, settings)
- **Tab Navigation** — horizontal tabs within page sections
- **Anchor/Scroll Navigation** — sticky side dots or section links for long pages
- **Back Button Only** — minimal, go-back focused (e.g. detail pages)
- **Contextual** — navigation changes based on section/context

---

### Q13 — REFERENCE WEBSITES (LIKES)
> Share 3–5 websites whose design you love.

For each reference, ask:
- What specifically do you like? (layout, colors, typography, animation, overall vibe, specific section)
- Is it the whole site or a specific page/section?

---

### Q14 — ANTI-REFERENCES (DISLIKES)
> Share 1–3 websites whose design you dislike or want to avoid.

For each anti-reference, ask:
- What specifically turns you off? (cluttered, boring, too flashy, bad colors, outdated)

---

## OUTPUT

After collecting all answers, produce TWO outputs:

### Output 1 — Direction Summary
A concise, structured spec sheet:

```
DESIGN DIRECTION SUMMARY
========================
Project: [name]
Date: [date]

LAYOUT:        [chosen layout system]
HEADER:        [header style + behavior]
HERO:          [hero style + height]
FOOTER:        [footer style + contents]
INNER NAV:     [inner navigation pattern]

COLOR:
  Primary:     [color]
  Background:  [light/dark/both]
  Palette:     [mood]
  Accents:     [strategy]
  Gradients:   [usage level]

TYPOGRAPHY:
  Style:       [direction]
  Headlines:   [bold-oversized / refined-subtle]
  Body:        [clean / warm / technical]
  RTL:         [yes/no]

COMPONENTS:
  Cards:       [style]
  Radius:      [system]
  Spacing:     [density]

IMAGERY:       [style + treatments]
ANIMATION:     [level + specifics]

REFERENCES:    [list with what to take from each]
ANTI-REFS:     [list with what to avoid from each]

DIRECTION NOTES:
[2–3 sentence summary of the overall vision]
```

### Output 2 — Visual Moodboard
Generate an interactive moodboard artifact (HTML/React) that visually represents the chosen direction:
- Show the chosen color palette as swatches
- Display typography samples with the selected font direction
- Show the border-radius and card style as a mini component preview
- Show spacing density visually
- Indicate animation level
- Include reference site screenshots via `image_search` for the reference URLs
- Layout everything in a clean, presentable moodboard the client can review

---

## AGENT INTEGRATION
Feeds into:
→ **UI Designer Agent** — uses the full Direction Summary as its design spec
→ **Design Systems Agent** — uses colors, typography, spacing, radius as token inputs
→ **Interaction Designer Agent** — uses navigation, animation, hero behavior specs
→ **UX Writer Agent** — uses typography and density to inform copy length/style
