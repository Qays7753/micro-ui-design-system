## The secret behind weirdly perfect UI designs
- source: Kole Jain · https://youtu.be/neE6wOuBIP8
- type: principles
- tags: alignment, hierarchy, emphasis, cards, spacing, icons, states, colour, layout

### Takeaways
- Compact UI looks polished because of edges, not decoration. A store receipt has no dividers and almost no whitespace, yet it reads cleanly: item names share a left edge and prices share a right edge.
- Centre only the things nobody needs to read (on the receipt, the codes). Everything meant to be read sits against an edge.
- Every card gives you four outer edges for free. You can also create internal edges, e.g. the bottom line of an avatar + name block, for more content to align to.
- When a card looks empty, don't keep adding content to fill it. Look for edges where the existing content can sit.
- Test for a "perfect" compact layout: every element touches at least two edges. This holds for chat inputs, kanban cards, sidebars and list rows.
- In a list, the bottom of each row becomes the top edge for the next. If a bigger icon makes a row taller than its text, add a second line of text (a subtitle) so the text block matches the icon height and the bottom edge is restored.
- Keeping the same edges but stretching rows across the full screen width still breaks the effect: the content gets slow and dull to read. Constrain the line length.
- Adding whitespace to fix a dense screen helps a little but makes everything slower to scan. The real problem is usually not too much content but content that all looks the same.
- Break up uniform content by varying it: put an avatar wherever a person is mentioned, and group items (e.g. tasks by due date). Once grouped, any item can be found in about a second, and density starts working for you.
- This is why AI chat answers use bullet lists and why Claude Code ends answers with tables: mixed formats turn a wall of text into scannable chunks.
- Show, don't tell. A universal symbol (a red octagon = stop) is understood without reading. Turn text into icons, small diagrams and avatars that read at a glance.
- The urge to fix unclear UI with more explanation (comparisons, labels, hints) adds information but makes the screen harder to read. That trade is almost never worth it.
- Exception: icon-only action bars. Users understand the checkbox from its position above the list (select all), but have to guess the other icons until a tooltip appears. Use visuals people recognise instantly.
- Familiar conventions do the explaining: blue underlined text means a link; coloured bullets or chips mean categories. Showing tags inline as chips also lets users change them directly instead of digging through menus.
- Why this works: nobody reads a whole screen. People arrive with one question and scan for one answer (one file in VS Code, one setting in a settings panel). Edges, varied content and a mix of text and visuals don't make a screen prettier; they make it faster to scan.
- Colour is the main signal of change. An unchecked checkbox is just a thin outline with no colour or icon; checked, it gets a fill and a check mark. Nobody colours the off state.
- If every chip in a panel is coloured while it shows its default value, it's like six checkboxes that are blue when off. Keep defaults neutral or grey so the one changed or important value stands out.
- Emphasis is relative. You can add colour or a bolder weight to one item, but it stands out because its neighbours don't have it. In a macOS menu, the only blue item is the prompt to renew an iCloud subscription.
- Cards are handy: four edges for free, and you can resize them to fit. But stacking containers on a blank canvas to create structure ends in frames inside frames and stacked rounded corners, which don't help.
- Cards can be dissolved into the layout. One vertical line between columns does the same job as a card edge, and each row sits on the line of the row above.
- With or without cards the goal is the same, a screen people can scan:
  - sections group the content
  - bullets and icons explain it
  - grey default values let the important parts stand out

### Recipes
1. Fixing a profile card with edges [00:30–01:31]
   - Before: an avatar and name with a row of buttons that don't line up with any edge, and too many buttons.
   - Map the edges: the 4 outer card edges plus the line under the avatar/name block.
   - Quick fix: stretch the primary buttons from edge to edge and move the secondary ones into an overflow menu in a top corner. It looks better, but hiding things is not the best fix.
   - Better fix A: remove the extra content to free up the edges. Downside: the top of the card no longer has a defined edge.
   - Better fix B: create a new edge. Lower the top border and put the avatar and the buttons on one row, so that row becomes the edge for the content below.
   - Check: every element now touches 2 or more edges.
2. List rows with larger icons [01:31]: when the icon is taller than one line of text, put a title and a subtitle next to it, so the text block's top and bottom match the icon's.
3. Making a to-do list scannable [02:01–04:31]
   - Keep the list at a limited width instead of stretching it across the screen.
   - Prefer varying the content over adding whitespace.
   - Add an avatar wherever a person is mentioned or assigned.
   - Group tasks under due-date section headers.
   - Style links blue and underlined.
   - Show categories as coloured bullets or chips, and make those tags editable inline.
4. Information card [03:01–03:31]: turn raw text fields into icons and small diagrams that read instantly, even if a little of the raw data is lost.
5. Settings panel [06:01–07:01]
   - Use tabs to group the settings.
   - Show each value as a chip with an icon (show the value rather than describe it).
   - Keep chips that are in their default state grey or neutral.
   - Give colour or bolder text only to the one value that has changed or needs attention.
6. Dissolving cards into the UI [07:01–07:31]
   - Replace boxed cards with one vertical border between columns.
   - Stack the rows so each sits on the line above it.
   - Group with section headings.
   - Add bullets and icons.
   - Set default values in grey.

### CSS translation
```css
/* receipt-style row: label on the left edge, value on the right edge */
.row { display: flex; justify-content: space-between; align-items: baseline; }
.row .value { text-align: right; font-variant-numeric: tabular-nums; } /* tabular-nums (derived) */

/* limit the width instead of stretching rows across the screen */
.list { max-width: 40rem; } /* value (derived) */

/* icon + two-line text block that spans the icon's height */
.item { display: grid; grid-template-columns: auto 1fr; column-gap: 12px; align-items: center; } /* gap (derived) */

/* checkbox: off = thin outline, no colour; on = fill + check mark */
.check { border: 1px solid var(--border); background: transparent; }
.check:checked { background: var(--accent); border-color: var(--accent); }

/* defaults stay neutral; only the exception gets the accent */
.chip { color: var(--text-muted); background: var(--surface-2); }
.chip.is-changed { color: var(--accent); font-weight: 600; } /* weight (derived) */

/* cards dissolved: one column rule + row rules instead of boxes */
.col + .col { border-left: 1px solid var(--border); }
.col .row + .row { border-top: 1px solid var(--border); }
```

### Gotchas
- Filling empty space in a card with more content.
- Buttons that line up with no edge, and too many buttons in a small card.
- Treating "hide it in a menu" as the main fix.
- Stretching list rows to full width: the alignment survives but readability drops.
- Adding whitespace to cure density instead of varying the content.
- Over-explaining with labels, comparisons and hints.
- Icon-only actions with no tooltip.
- Colouring default or off states, so nothing stands out.
- Boxing everything in nested cards with stacked rounded corners.

### Examples named
- Walmart receipt: items aligned left, prices aligned right, only the codes nobody reads are centred, no dividers.
- VS Code and settings panels: users hunt for one file or one setting, never the whole screen.
- AI chat apps and Claude Code: bullet lists and closing tables that break up walls of text.
- Stop sign: a universal symbol understood without reading.
- macOS iCloud menu: the only blue item is the upsell to renew the iCloud subscription (the caption says "iCloud Pro"). It shows that emphasis comes from contrast with the neighbours.

## The 3 dashboard UI flaws that give away you've NEVER built one
- source: Kole Jain · https://youtu.be/Ksx9C2-3yMo
- type: principles
- tags: dashboard, saas, tables, charts, colour, hierarchy, states, progressive-disclosure, onboarding, micro-interaction, components

### Takeaways
- Laying out a dashboard is easy. The hard part is orchestrating it: what shows, what hides, and which state appears when. UI that looks good is not the same as UI that works in use.
- Tell 1 is letting the data drive the form. Design around the data being shown, so each kind of data gets the shape that suits it:
  - Columns with a fixed set of values (department, employment status) become chips.
  - Numbers are right-aligned so the digits line up by place value.
  - Long text is truncated so the other columns get room.
  - Inactive or deactivated rows are shaded out so they recede.
- Time-ordered data (an activity history) shouldn't be a table sorted by time. Show it as a timeline, either in a sidebar pop-out or as a wider second column beside the table.
- Dashboard colour has to come from the data. Landing pages can sprinkle colour around for looks; dashboards can't.
- In an activity log, a red icon inside a chip draws the eye because that action is urgent. Avatars work better than a name column because people match a face to "who did what" faster than they read a name.
- Once data has a time dimension, add a summary chart that rolls it up. Users see the trend at once instead of hunting through a timestamp column.
- Tell 2 is progressive disclosure: a second kind of hierarchy, set by what you show and what you hide.
- A feature that is used rarely and matters less (sharing) shouldn't sit permanently next to the table. Put it in a popover, so the user isn't sent to a separate page.
- Inside that popover, the primary action (the search/invite field) sits at the top and is always visible. A secondary action (removing a user) shows only on row hover, with a tooltip.
- Spectrum of explicitness, from most explicit to least:
  - a global, always-visible labelled button
  - an always-visible labelled button
  - an always-visible icon
  - an icon shown only on hover (e.g. copy a cell on hover)
- Place each action on that spectrum by how important and how frequent it is, and by how much space you have.
- Onboarding is progressive disclosure over time. Start with one tooltip on the most important action. Once the user has done it, show a second tooltip or a small checklist in a corner. You are putting features in order, not hiding them.
- Onboarding anti-pattern: a modal at login that explains the whole product in six bullet points and is forgotten as soon as it closes.
- Tell 3 is invisible UI. A dense table gets its extra functions from parts you can't see at first: a copy chip on cell hover, or a small triangle in the corner of a cell that has comments. This hidden layer is large, and the table can't work without it.
- The same applies to small pieces and to drawers, modals and other elements with hidden parts and states. Thinking this through often shows that a new feature doesn't need its own page.
- Also design the rare moments: announcements of new features, and pop-ups that explain part of the product.
- Tooltips are missing from almost every beginner dashboard. Assume users won't know every icon and will want detail on vague labels.
- AI tools struggle with the idea that UI is as much about what you can't see as what you can.

### Recipes
1. Cleaning up an employee table [00:31–01:01] (before → after)
   - Department and employment-status text → chips, because each column has a fixed set of values.
   - Numeric columns → right-aligned, so the digits line up by place value.
   - Long text → truncated, giving room to the other columns.
   - Inactive or deactivated rows → shaded out.
2. Time-sorted table → timeline [01:01–01:32]: rebuild the time-ordered records as a vertical timeline. Dock it in a sidebar pop-out or in a wider second column next to the main table.
3. Colour in the activity log [01:32–02:03]
   - Action chips use a red icon only for urgent actions.
   - Every row has the actor's avatar.
   - A summary chart above the log rolls it up over time.
4. Share popover [02:34–03:35]
   - Trigger: a share control instead of a share panel fixed beside the table.
   - Popover body: the search/invite field at the top (primary, always visible), then the list of people who have access.
   - Each row: a remove button hidden until hover, with a tooltip.
   - Alternatives rejected on the spectrum: an always-visible remove icon, or a fully labelled "Remove" button. Both are too explicit for a minor action in a tight space.
5. Onboarding in sequence [03:35–04:05]
   - First login: one tooltip on the key action.
   - After that action is done: the next tooltip, or a checklist in a corner.
   - Never a six-bullet welcome modal.
6. Hidden table affordances [05:07–05:39]
   - On cell hover, show a copy chip.
   - Mark cells that have comments with a small triangle in the corner.
   - Add tooltips to every icon and every unclear label.

### CSS translation
```css
td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; } /* tabular-nums (derived) */

td.truncate { max-width: 16rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } /* width (derived) */

tr.is-inactive { opacity: .5; } /* "shade out"; value (derived) */

/* progressive reveal: the secondary action shows on hover or keyboard focus */
.share-row .remove { opacity: 0; transition: opacity 150ms; } /* duration (derived) */
.share-row:hover .remove,
.share-row:focus-within .remove { opacity: 1; }

/* comment indicator: small triangle in the cell's top-right corner */
td.has-comment { position: relative; }
td.has-comment::after {
  content: ""; position: absolute; top: 0; right: 0;
  border-style: solid; border-width: 0 6px 6px 0;                       /* size (derived) */
  border-color: transparent var(--accent) transparent transparent;
}
```

### Gotchas
- Plain text in every column, whatever the data is.
- Forcing time-based data into a table.
- Decorative colour in a dashboard.
- Rarely used actions that are always visible, or that send users to a separate page.
- Explaining the whole product in one modal at login.
- Forgetting the hidden layer: hover chips, indicators, drawer and modal states, announcements.
- No tooltips on icons and vague labels.

### Examples named
- Apple Reminders: swiping left or right on a reminder reveals useful but secondary actions, while checking it off stays the main action.

## The 4 Levels of Landing Page UI/UX Design
- source: Kole Jain · https://youtu.be/eMMiLeo_UGI
- type: redesign/breakdown
- tags: landing-page, saas, hero, navigation, layout, sections, typography, colour, imagery, animation, micro-interaction, buttons, conversion, critique, pricing-work

### Takeaways
- Landing pages at different levels don't differ by talent. They differ by whether you know which level you're at and what to fix next. Each level is judged on layout, visuals, typography and copy, navigation, colour, animation and page flow.
- Level 1, a template (about $500, 2/10 (creator's claim, unverified)). It works, but no design decisions were made:
  - Sections alternate text left and image right all the way down. Some professional sites use this layout, but they vary it.
  - Stock photos that have nothing to do with the product, a link shortener.
  - Sharp-cornered images next to rounded buttons, so the corner styles clash.
  - One font throughout, which is good, but loose spacing and weak hierarchy.
  - Copy that is vague and too long. Nobody stops to read a block of text, and there's no need to repeat the company name when the logo is right there.
  - A flat nav: every item looks the same and nothing points to Sign up or to key links like Product. The whole menu sits on the right, so the header feels unbalanced.
  - Blue applied to anything that will take it, overpowering the text.
  - Colour comes only from the images, and they miss.
  - No animation beyond a basic hover.
- Level 2, knows what to do but not yet why (about $2,000, 6/10 (creator's claim, unverified)):
  - The hero switches from side-by-side to a stacked layout with more breathing room.
  - The stock image becomes the real product dashboard. It isn't well framed and doesn't focus on anything, but it suits the dark theme.
  - Colour now comes from the dashboard, which lets the buttons turn white.
  - Type is tighter and has some hierarchy, though not enough.
  - The headline is shorter and punchier. The subtext relates to it but is still wordy.
  - In the nav, the key buttons get an outline and the other links are centred for balance (still slightly too big). The bigger links get small dropdowns on hover.
  - The hero CTA now matches the nav CTA with the same label, so users can tell both go to the same place. That is the mental model you want.
  - Simple load-in animations add movement but still feel a bit cheap.
  - The page has some top-to-bottom flow, but transitions between sections are abrupt.
- Level 3, instinct meets craft ($6–10k, 8/10 (creator's claim, unverified)):
  - The visuals zoom into the parts of the dashboard that matter, choosing exactly what the visitor sees.
  - Vertical lines run the full height of the page and frame the content. They also keep the layout coherent on very large screens.
  - A row of 4 cards becomes a bento grid with more room.
  - A row of 3 cards becomes a clickable multi-select (a tabbed feature switcher). It adds interactivity and variety, which the creator calls the mark of an experience designer.
  - Sections get shorter and more compact.
  - Colour and size create a clear hierarchy. It's slightly overdone: the headline overpowers the sub-line.
  - The copy is short and says what the product does as a whole.
  - The designer starts working as a product designer and adds brand and trust pieces: a badge, a set of logos, and a button to a social-proof page.
  - A mega menu for the key links signals depth, a product worth exploring.
  - The blue comes back as the primary CTA, with an icon.
  - Zooming in and dropping the charts can lower the overall use of colour.
  - Motion is smoother: subtle hover interactions on the dashboard and the bento, and a fluid slider.
  - Flow is better: the logo strip leads into the analytics section, and the dashboard fades out into the features.
- Level 4, attention to detail (over $10k, 10/10 (creator's claim, unverified)):
  - Visuals are built for the page, not just cropped, to show exactly what the product does.
  - The layout is freer: instead of level 3's straight lines, content is moulded into more interesting shapes.
  - Type is balanced with slightly looser spacing, and the text widths form leading lines into the content.
  - The copy moves from what the product does to how it helps. Example: "collect and analyse data quickly" becomes "turn data into decisions".
  - Because the visuals are curated, colour can run through the whole page, plus a few well-placed images where they make sense.
  - Motion detail lifts it from 8 to 10: a blur transition on the multi-select, a mega menu that stays open and slides its content sideways, and a CTA that appears on hover over the logo strip.
  - The content is made for its space, so the page keeps pulling you to scroll.
- Level 4 needs no custom illustration or 3D. It is well-crafted UI and attention to detail, which anyone can learn.
- Going from good to great rarely hinges on one big change. It is many small details added up.

### Recipes
1. Level 1 → 2 [00:31–04:05]
   - Side-by-side hero → stacked hero (headline, subtext and CTA above the product visual).
   - Stock photo → a real product screenshot that matches the site's theme.
   - Colour from the product UI, so the buttons can go white.
   - Shorter headline.
   - Nav: outline the key actions, centre the remaining links, add small hover dropdowns to the main links.
   - Make the hero CTA's label and style match the nav CTA.
   - Add load-in animations.
2. Level 2 → 3 [04:36–07:10]
   - Crop or zoom the dashboard to its important region.
   - Add full-height vertical frame lines around the content column.
   - Row of 4 cards → bento grid.
   - Row of 3 cards → clickable multi-select feature switcher.
   - Make sections shorter and more compact.
   - Build hierarchy with colour and size, but don't let the headline swamp the sub-line.
   - Add a badge, a logo wall and a button to the social-proof page.
   - Add a mega menu for the key links.
   - Make the primary CTA brand blue with an icon.
   - Add hover interactions to the dashboard and the bento.
   - Fade the dashboard out into the features section.
3. Level 3 → 4 [07:10–09:10]
   - Purpose-built product visuals instead of crops.
   - Break the rigid grid of lines into moulded layouts.
   - Slightly looser type spacing, with line widths set to lead into the content.
   - Copy about the benefit rather than the function.
   - Run the accent colour through the whole page.
   - Give the multi-select switch a blur transition.
   - Mega menu: when moving between top-level items, keep the panel open and slide its content left or right toward the new item, instead of closing it fully and reopening it.
   - Logo strip: remove the button below it and reveal a CTA (to the social-proof page) on hover, only when needed.
   - No durations, blur amounts or easings are stated.

### CSS translation
```css
/* level 3 frame: full-height vertical lines around the content column */
.page-frame { max-width: 1200px; margin-inline: auto; border-inline: 1px solid var(--border); } /* width (derived) */

/* bento grid instead of a uniform row of 4 cards */
.bento { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; } /* (derived) */
.bento .wide { grid-column: span 2; }

/* level 4 multi-select: blur cross-fade between panels */
.feature-panel { transition: opacity 300ms ease, filter 300ms ease; } /* values (derived) */
.feature-panel.is-leaving { opacity: 0; filter: blur(8px); }         /* (derived) */

/* mega menu: the panel stays open while its content slides toward the new item */
.mega .content { transition: transform 250ms ease, opacity 250ms ease; } /* (derived) */
.mega .content.enter-from-right { transform: translateX(24px); opacity: 0; } /* (derived) */
.mega .content.enter-from-left  { transform: translateX(-24px); opacity: 0; } /* (derived) */

/* logo strip: the CTA appears only on hover or focus */
.logos .cta { opacity: 0; transition: opacity 200ms; } /* (derived) */
.logos:hover .cta, .logos:focus-within .cta { opacity: 1; }
```

### Gotchas
- Repeating the same text/image alternation down the whole page.
- Stock photos that have nothing to do with the product.
- Sharp image corners next to rounded buttons.
- Long, vague copy, and the company name repeated next to the logo.
- A flat, right-heavy nav with no emphasis on Sign up.
- Brand colour sprayed on everything that will take it.
- A hero CTA whose label differs from the nav CTA.
- An unframed product screenshot that doesn't point at anything.
- A headline so dominant that the sub-line disappears (the level 3 over-correction).
- Zooming into the visuals and accidentally stripping out the colour.
- Abrupt transitions between sections.
- A mega menu that fully closes and reopens between items.

### Examples named
- None outside the creator's own work. All four levels are his mock landing pages for the same link-shortener product.

## Everything you need to know about Mobile App UI’s in 8 minutes (beginner friendly)
- source: Kole Jain · https://youtu.be/Gfsd8NNuD9g
- type: principles
- tags: mobile, ios, navigation, layout, typography, spacing, cards, components, gestures, animation, micro-interaction, states, onboarding

### Takeaways
- Mobile is not a squeezed desktop. Navigation, scale and layout all change.
- Navigation option 1: reduce the sidebar to a few key icons in a bottom tab bar. These days the bar usually floats, with the main action split out as its own button.
- Five tab items is the hard limit; three or four is ideal. That keeps every touch target above 44 px.
- What sits in the tab bar can change with context.
- Navigation option 2: if too many important sidebar items won't fit, turn the sidebar into a full page that becomes the home screen (Notion does this).
  - Add recent items at the top, and actions and counts on the right, so the page doesn't feel lopsided.
  - This frees the bottom of the screen for a big search bar or action button.
- Top bar: a bell plus a ⋯ (more) menu is a sensible start, but those actions should also change from page to page.
- Don't shrink type and spacing to fit a small screen. Mobile type and spacing stay about the same as desktop or get bigger: the iOS base font size is 17 px, against 13 px on macOS (Apple specifies these in pt).
- A desktop screen can hold many modules (action bar, gallery of recent items, calendar, tasks, scratch pad). A mobile screen gets one of them.
- Desktop layouts run in two directions at once (e.g. 2 columns × 3 rows). On mobile, each section picks one direction: a vertical stack, or a horizontal row that scrolls off the edge, never both.
- Apart from floating menus and actions, an app has four building blocks: cards, text and links, images, and inputs. Any of them can sit inside a card.
- Cards are the main block. They group content in place of whitespace, which mobile has little of.
- Avoid putting a card inside a card. Padding on padding eats space and cramps the content. Where you can, group with whitespace instead of another container.
- One screen does one job, with the home screen as the only exception. Settings is only settings and the editor is only the editor, with no recent notes or suggested templates stuck on top.
- To add something new, use a new page rather than a different layout on the same page.
- When the user has to stay in context and there's no room, use a bottom sheet (e.g. picking a template while editing a note). It can be any height, keeps the context, and works with gestures.
- A + button either opens a small menu or opens an input so the user can start typing straight away.
- Swipe gestures are everywhere in modern apps and can carry a lot once users have been shown them:
  - swipe right to go back
  - swipe up to search (Slack does this; Apple partly does)
  - swipe down to dismiss a sheet
- Long press is the mobile version of right-click. Blur the rest of the screen, show the actions and zoom the pressed element slightly, or go further with a live preview the way iOS does.
- Space is tight, so actions come and go with the task:
  - Opening a note hides the tab bar and brings in editing actions, such as text formatting and sharing at the top.
  - Picking a template strips the screen down to two actions: confirm (✓) and close (✕).
  - How these actions animate in and out is part of the polish.
- Design the empty states, not just the full, ideal one:
  - First run: skip cards inviting the user to add events, tasks and notes. Point at the + button (the main action) with a full-screen empty state, then a small popover explaining how things work.
  - No search results: an image, a plain statement that no notes match the keywords, a few suggestions in case of a typo, and an action to leave the empty state.

### Recipes
1. Floating bottom tab bar [00:31–01:01]
   - 3–4 icon tabs (5 at most) in a floating bar.
   - The primary action split out as a separate button.
   - Every target 44 px or more.
   - Tab-bar contents change with context.
2. Sidebar → home page, Notion style [01:01–01:32]
   - Put the sidebar's links on the home page as a list.
   - Recent notes at the top.
   - Actions and counts aligned right for balance.
   - A big search bar or action button pinned at the bottom.
3. Desktop dashboard → mobile [02:03–02:34]: keep one module per screen. For each section, choose either a vertical stack or a horizontal row that scrolls off the edge, never both directions in one section.
4. Template picker in a bottom sheet [03:36–04:36]
   - Opens from the editor.
   - Header with a title, ✕ (close) and ✓ (confirm).
   - A search bar.
   - The list of templates.
   - Sheet height fits its content.
   - Swipe down to dismiss.
5. Swipe-back transition [05:07–05:38]: as the top page slides off to the right, the page underneath starts shifted about 35% to the left and moves right into place. The result is a smooth, parallax-style push.
6. Depth behind a bottom sheet [05:07–05:38]: as the sheet rises, scale the background down slightly; on swipe down, scale it back up.
7. Long-press menu [05:38–06:09]
   - Blur everything behind.
   - Show the list of actions.
   - Scale the pressed element up slightly.
   - Optional: a richer live preview, iOS style.
8. Context-dependent controls [06:09–06:39]
   - Entering the editor hides the tab bar and shows editing actions (formatting, and share at the top).
   - The template sheet shows only ✓ and ✕.
   - Animate each swap.
9. Empty states [06:39–07:09]
   - First run: a full-screen empty state pointing at the + button, then a how-it-works popover.
   - No results: an illustration, a line saying no notes match these keywords, typo suggestions, and an exit action.

No easing, durations or blur/scale amounts are stated apart from the 35% offset.

### CSS translation
```css
body { font-size: 17px; } /* iOS base size, from the video */

.tabbar { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; } /* offsets/gap (derived) */
.tabbar a { min-width: 44px; min-height: 44px; display: grid; place-items: center; }

/* one direction per section: a horizontal row that scrolls off the edge */
.rail { display: flex; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; } /* gap/snap (derived) */
.rail > * { flex: 0 0 auto; scroll-snap-align: start; }

/* swipe back: the page underneath starts 35% to the left and slides in */
.page-under { transform: translateX(-35%); transition: transform 300ms ease-out; } /* duration/easing (derived) */
.page-under.is-revealed { transform: translateX(0); }

/* bottom sheet open: the background scales down slightly */
.app { transition: transform 300ms ease-out; } /* (derived) */
.app.sheet-open { transform: scale(.94); }      /* amount (derived) */

/* long press */
.press-backdrop { backdrop-filter: blur(16px); } /* amount (derived) */
.item.is-pressed { transform: scale(1.04); }     /* amount (derived) */
```

### Gotchas
- Shrinking type and spacing to fit more on screen.
- More than five tab-bar items, or touch targets under 44 px.
- Moving several desktop modules onto one mobile screen.
- A section that scrolls in both directions, or a desktop grid squeezed onto a phone.
- Cards inside cards (padding on padding).
- Adding unrelated widgets (recent notes, suggested templates) to a screen with one job.
- Sending users to a new page for a quick choice in context. Use a bottom sheet instead.
- Leaving controls on screen when the task needs different actions.
- Designing only the full, ideal state, and forgetting the first-run and no-results empty states.
- No-results states that only give an instruction. They also need an image, an acknowledgement, suggestions and a way out.

### Examples named
- Notion: the sidebar becomes the home page, with a big search or action button at the bottom.
- Slack: swipe up to search (Apple does something similar).
- iOS: long press opens a live preview with actions.
- Apple base sizes: 17 on iOS, 13 on macOS.

## 5 SaaS UI/UX mistakes that SCREAM you Vibe Code
- source: Kole Jain · https://youtu.be/PDcQJOPby1k
- type: redesign/breakdown
- tags: vibe-coding, ai, saas, dashboard, redesign, icons, colour, layout, sidebar, cards, charts, forms, pricing-page, landing-page, conversion, trust

### Takeaways
- Mistake 1 is emojis used as icons. Replace them with an interface icon set such as Phosphor or Lucide. Notion is the rare product that uses emoji well.
- Mistake 2 is letting AI pick the colours. It reaches for bright colours that clash, so choose the palette yourself.
- Put colour and information into the data itself (KPIs, micro charts) rather than into decorative icons and buttons.
- Mistake 3 is letting AI pick the layout. AI repeats elements: the same four KPI cards appeared three times in one small app. That gives the game away as clearly as em-dashes in AI-written text.
- Usage stats (clicks, link counts) don't belong in the sidebar on pages like Custom domains or Teams. That data lives in the dashboard and an Analytics tab.
- In the sidebar, left-align the items and tighten the spacing.
- AI loves gradient circles with initials as avatars. Use an account card instead, with the account links in a popover that opens on click. Merge Settings and Billing & Usage into one item.
- Busy list cards need thinning out:
  - action buttons go into a ⋯ menu
  - chips become icon-only
  - the date moves to the centre
  - the click count moves to the right
- AI handles logic, and features, well if you tell it to. It is weak at complex layouts and cards, so that is where a little human time changes the most.
- A flyout with only a few fields and lots of empty space is the wrong container; use a modal instead. Collapse advanced options by default, add the missing options (choosing the custom domain for the link, a description field), and leave room for features added later.
- Mistake 4 is cards that do nothing. AI often generates cards with no function; delete them.
- A generic row of KPI cards looks vibe-coded. A simple two-column layout with small donut charts looks more considered.
- Pricing plans on the billing page:
  - Order the plans so prices rise logically. Here "Standard" looked cheaper than "Hobby" only because of discounts.
  - Five plans is too many; cut at least one (Hobby).
  - Make the plan name smaller, since nobody cares about it, and the monthly price bigger, since people do.
  - Rename the top tier "Enterprise" when its volume (50,000 links a month) implies it.
  - Show the actual discount.
  - Show what the next plan includes that the current one doesn't.
  - Add the billing email and payment method.
- A settings page with tabs scales: adding documents, integrations or AI later is just another tab.
- Mistake 5 is missing the easy wins, cheap features that add a lot:
  - a toggle that splits the analytics into individual links so they can be compared
  - a richer stats row with icons that add a splash of colour
  - a map with shaded regions and the data listed beside it, instead of a plain bar chart
- The landing page is where a vibe-coded product loses most of its customers. SaaS landing pages have a quality bar that builds trust, even subconsciously.
- Landing pages need graphics:
  - link-card graphics with a skew
  - lightly edited screenshots of real product screens (analytics, password protection) instead of generic icons
- Landing pages are about presentation, not complexity. Better presentation brings better conversion (creator's claim, unverified).

### Recipes
1. Icons [00:00–00:30]: swap every emoji for icons from one interface set. Phosphor is his preference; Lucide is also fine.
2. Dashboard colour and KPIs [00:30–01:31]
   - Change the dark-blue backgrounds. The caption says "to dark green"; it may be "dark grey".
   - Remove the icons on the KPI cards.
   - Widen the KPI cards.
   - Add micro charts inside them.
   - Make a few more colour fixes (details not stated).
3. Sidebar [01:31–02:03]
   - Remove the stats that don't matter on most pages.
   - Add an Analytics tab.
   - Left-align the items and tighten the spacing.
   - Replace the gradient-initials avatar with an account card.
   - Move the account links into a popover that opens on click.
   - Merge Settings with Billing & Usage.
4. Link list cards [02:03]
   - Buttons → a ⋯ overflow menu.
   - Date → the centre.
   - Chips → icons only.
   - Clicks → the right side.
5. Create-link form [02:03–02:33]
   - Sparse flyout → modal.
   - Advanced options collapsed by default.
   - Add a domain choice and a description field.
   - Leave room for more fields later.
6. Billing & Usage page, reached from the new popover [03:35–04:37]
   - Delete the card that does nothing.
   - Retitle the page and add tabs.
   - Usage tab: a two-column layout with small donut charts instead of KPI cards.
   - Billing tab, plans:
     - fix the price order
     - cut from 5 plans (drop Hobby)
     - remove unneeded elements
     - adjust the colours
     - plan name smaller, price per month bigger
     - rename Business to Enterprise
     - show the discount
     - list what the next plan adds
   - Billing tab, account details: add the billing email and payment method.
   - He credits this plan layout to Resend and Supabase.
7. Analytics page [04:37–05:38]
   - Remove the duplicated KPIs and tabs.
   - Move the actions lower.
   - Add a toggle that splits the data into individual links for comparison.
   - Build a denser info row with coloured icons.
   - Swap the bar chart for a map with shaded regions, with the figures listed on the left.
8. Landing page [05:38–06:08]
   - Apply the colour and layout fixes from above.
   - Add link-card graphics with a skew.
   - Replace generic feature icons with lightly edited screenshots of real screens (the analytics page, password protection).

### CSS translation
```css
/* plan card: the price outranks the plan name */
.plan-name  { font-size: 14px; color: var(--text-muted); } /* (derived) */
.plan-price { font-size: 32px; font-weight: 600; }          /* (derived) */

/* advanced options collapsed by default in the create-link modal */
/* <details><summary>Advanced options</summary> … </details> */

/* skewed link-card graphic on the landing page */
.hero-card { transform: skewY(-6deg); } /* angle (derived) */
```

### Gotchas
- Emoji icons.
- Letting AI choose colours or layout.
- The same KPI cards repeated across pages.
- Gradient avatars with initials.
- Global stats in the sidebar.
- Cards crowded with buttons and chips.
- A big empty flyout for a short form.
- Decorative cards with no function.
- Too many plans, prices out of order, a plan name louder than the price, no visible discount.
- Default bar charts where a richer visual would fit.
- Generic icons on the landing page instead of product visuals.

### Examples named
- Notion: emoji used successfully as icons (the exception).
- Phosphor Icons and Lucide: recommended interface icon libraries.
- Resend and Supabase: a billing layout that shows the discount and what the next plan adds.

## Why the 60-30-10 Rule is RUINING Your UI Designs
- source: Kole Jain · https://youtu.be/66oOi9OLMCw
- type: principles
- tags: colour, dark-mode, tokens, design-system, saas, dashboard, charts, buttons, borders, shadows, contrast, typography, states

### Takeaways
- The 60-30-10 rule suits marketing sites, but product UI is mostly neutral. Vercel is about 90% black, 8% white and 2% red, and sometimes the red isn't there at all (creator's claim, unverified).
- Product colour works in four layers: a neutral foundation, a functional accent, semantic colours, and theming.
- In this video "% white" is the creator's lightness shorthand: 0% is black and 100% is white. He doesn't say whether he means HSL or HSB.
- Layer 1, the neutral foundation:
  - App backgrounds: Linear is about 99% white, Notion 100%, Vercel 98% (creator's claim, unverified). Pure white is fine.
  - How many neutrals: 3–5 is enough for a landing page. A product needs about 4 background layers, at least 1 stroke colour (often 2) and about 3 text colours. That is before chart colours and hover or interactive states.
  - The app frame (sidebar) is a slightly darker anchor. Because it is large, it needs only a tiny shift, especially in light mode. Mercury tints its sidebar with about 2% blue.
  - Light mode is flexible. Options:
    - a dark background with lighter cards (Vercel)
    - a light background with darker cards (Notion)
    - monochrome tonal layers (Supabase)
  - Darker cards are often the same colour as the sidebar. Lighter cards can be pure white, which is a good reason not to make the background itself pure white.
  - Cards on a near-identical background look washed out, and a subtle drop shadow barely helps. Don't reach for a thin black border. A border of about 85% white defines the edge without overpowering it.
  - Buttons: the more important the button, the darker it is. The range runs from ghost buttons to black buttons with white text; most multi-purpose buttons sit around 90–95% white.
  - Text: the darkest value is kept for key headings, and even those are about 11% white, not pure black. Most body text is 15–20% white, and subtext 30–40%.
- Layer 2, the functional accent:
  - Some products stay neutral (Vercel). Others are known for one colour: Linear for blue-purple, Supabase for bright green.
  - Treat the accent as a ramp from lightest to darkest, not a single swatch. In light mode the main colour is step 500 or 600, hover steps darker to 700, and links use 400 or 500.
  - The creator generates the ramp with UI Colors, which also gives him the dark-mode steps.
- Dark mode:
  - Dark colours look more alike, so they need more distance between them to look as distinct as light colours. Simply mirroring the light palette makes the background layers merge.
  - Rule of thumb: double the distance. Light-mode layers sit about 2% white apart, so dark-mode layers should be 4–6% apart.
  - The accent's main colour moves to 300 or 400, with hover at 400 or 500.
  - Dim the text and brighten the borders compared with light mode.
  - Dark mode is strict where light mode is flexible: surfaces always get lighter as they are raised. A raised card needs a lighter fill, or just a border (like the search bar).
- Layer 3, semantic colours, deliberately breaks the system because colours carry meaning:
  - Vercel's brand is black and white, yet builds that succeed, fail or are in progress still get status colours.
  - Destructive actions are always red, even if the brand colour is purple.
- Chart colours:
  - Neutral-only charts look dull, and charts drawn from the brand ramp alone look too alike, so charts need a full spectrum of hues.
  - Colours with the same settings don't look equally bright: bright green looks more neon than bright blue. So build chart colours in OKLCH, which models how people perceive colour.
  - Fix the lightness and chroma, then step the hue by about 25–30 for each series.
- Layer 4, theming: to make a tinted version of any set of neutrals, convert each one to OKLCH, lower the lightness by 0.03, raise the chroma by 0.02, and set the hue you want. It lands on red, green, blue or any other hue reliably, and works as well or better in dark mode.

### Recipes
1. Light-mode neutral stack [00:31–02:02]
   - Pick an app background of 98–100% white.
   - Make the sidebar/frame slightly darker, optionally with a ~2% blue tint.
   - Cards: either pure white on an off-white background, or sidebar-coloured cards on a white background.
   - Card border about 85% white, not black.
   - Buttons: ghost, then multi-purpose at 90–95% white, then black with white text for the most important.
   - Text: headings about 11% white, body 15–20%, subtext 30–40%.
   - That makes 4 backgrounds, 1–2 strokes and 3 text colours.
2. Accent ramp [02:02–02:34]
   - Generate a full lightest-to-darkest ramp in UI Colors.
   - Light mode: main 500 or 600, hover 700, links 400 or 500.
   - Dark mode: main 300 or 400, hover 400 or 500.
3. Dark-mode conversion [03:04–04:06]
   - Don't invert the light palette one to one.
   - Space the background layers 4–6% apart, double the ~2% gaps of light mode.
   - Move the accent to 300 or 400.
   - Dim the text and brighten the borders.
   - Make every raised surface lighter than what is beneath it, or give it a border.
4. Chart palette [05:10–05:40]
   - On oklch.com, set one lightness value and one chroma value.
   - Rotate the hue by +25–30 for each series.
   - Copy each colour out.
   - No specific lightness or chroma values are stated.
5. Theming in one step [05:40–06:10]
   - Put each neutral's hex into OKLCH.
   - Set L to L − 0.03 and C to C + 0.02.
   - Set H to the target hue.
   - Repeat for every neutral token, including the dark-mode neutrals.

### CSS translation
```css
:root {
  /* Layer 1, light mode. "% white" mapped to HSL lightness (derived mapping) */
  --bg:          hsl(0 0% 98%);                          /* video: 98–100% */
  --bg-sidebar:  color-mix(in oklch, var(--bg), blue 2%); /* Mercury-style tint (syntax derived) */
  --card:        hsl(0 0% 100%);
  --border:      hsl(0 0% 85%);
  --btn:         hsl(0 0% 92%);                          /* video: 90–95% */
  --btn-primary: hsl(0 0% 0%);
  --btn-primary-text: hsl(0 0% 100%);
  --text-strong: hsl(0 0% 11%);
  --text:        hsl(0 0% 18%);                          /* video: 15–20% */
  --text-muted:  hsl(0 0% 35%);                          /* video: 30–40% */

  /* Layer 2, accent roles taken from a UI Colors ramp */
  --accent: var(--brand-600);
  --accent-hover: var(--brand-700);
  --link: var(--brand-500);

  /* Layer 3, chart series: same L and C, hue +28 each (L/C/start hue derived) */
  --chart-1: oklch(0.70 0.14 250);
  --chart-2: oklch(0.70 0.14 278);
  --chart-3: oklch(0.70 0.14 306);
  --chart-4: oklch(0.70 0.14 334);

  /* Layer 4, theming: any neutral → tinted (relative colour syntax and target hue derived) */
  --bg-themed: oklch(from var(--bg) calc(l - 0.03) calc(c + 0.02) 150);
}

/* dark mode: layer gaps doubled to 4–6% (base value derived); accent at 300/400 */
@media (prefers-color-scheme: dark) {
  :root {
    --surface-0: hsl(0 0% 8%);   /* (derived) */
    --surface-1: hsl(0 0% 13%);  /* +5%: raised surfaces get lighter (derived) */
    --surface-2: hsl(0 0% 18%);  /* (derived) */
    --surface-3: hsl(0 0% 23%);  /* (derived) */
    --accent: var(--brand-400);
    --accent-hover: var(--brand-500);
  }
}
```

### Gotchas
- Applying 60-30-10 to product UI.
- A pure-white background when you also want white cards, which leaves no contrast between them.
- Thin black card borders, or relying on drop shadows alone to separate cards.
- Pure black for all text.
- A single accent swatch instead of a ramp, which leaves no steps for hover and links.
- Mirroring the light palette for dark mode, so the layers merge.
- Raised surfaces that get darker in dark mode.
- Making a destructive action anything other than red because the brand colour is different.
- Charts in neutrals or a single brand ramp, or the same HSL values across hues, so green goes neon.
- Guessing themed neutrals by eye.

### Examples named
- Vercel: almost all neutral (about 90/8/2); a dark background with lighter cards; semantic status colours for builds.
- Linear: background about 99% white; known for blue-purple.
- Notion: 100% white background with darker cards.
- Mercury: sidebar tinted with about 2% blue.
- Supabase: monochrome tonal layers; bright-green accent.
- UI Colors (uicolors.app): generator for accent ramps.
- oklch.com: the OKLCH picker he uses for chart hues and theming.

## Everything you need to Design macOS Apps EXACTLY like Apple (beginner friendly)
- source: Kole Jain · https://youtu.be/Vy0KKvZJRH8
- type: principles
- tags: macos, layout, navigation, sidebar, micro-interaction, animation, states, progressive-disclosure, dark-mode, glass, onboarding, components

### Takeaways
- A Mac app feels right when it seems part of the computer. It shouldn't be a destination the user travels to, but a system that appears where they need it.
- Design beyond the main window too: popovers, extra windows and notifications.
  - Notion pops up a prompt when it detects a meeting.
  - Paste sits along the bottom of the screen like a native panel.
- Appear-and-disappear pattern, as in Spotlight and Raycast: the user calls the app up with a shortcut, it does its job, then gets out of the way. Spotlight opens with Cmd+Space and can be dragged anywhere.
- Capture work where the user already is. Inspiration turns up in the middle of other tasks (in Figma, in code, in Notion), so a global shortcut (Cmd+Shift+S) opens a quick-save window without switching apps.
- The quick-save window:
  - as minimal as a widget sliding in from the side
  - no traffic lights
  - just a drop area, a simple input and a few buttons with their keyboard shortcuts shown
  - a native background blur, like Paste's
- On Enter, the window collapses into a toast notification and slides off screen.
- Optimistic UI: show success straight away while the work finishes in the background. Apple Mail moves a message to the Trash before the server has deleted it.
- Landing pages and apps can share components but are used in opposite ways. A landing page holds fixed content made in advance; an app holds the user's own content, which they add and change. That makes apps centred on the user.
- Apple's utility apps (Finder, Notes, Reminders, Calendar, Settings) share one layout: global actions along the top, navigation in a sidebar, content in the centre. Each one does one thing, so its UI can stay focused.
- In those apps the traffic lights are built into the UI, in the top bar or the sidebar, and treated like any other element.
- The top ~50 px of a Mac window is the area for dragging the window, so keep it free of actions and give it room.
- If navigation is only browsing and search, skip the sidebar. The space goes to large content, because the UI is mainly a container for the user's content.
- Progressive disclosure:
  - With nothing saved yet, show a simple empty state inviting the first save, and hide filters and other controls until they're useful.
  - Show an item's full details only when the user clicks it.
- Before adding colour or effects, ask what the least UI is that lets the content shine.
- Light and dark mode:
  - Respect the system appearance setting.
  - Dark mode needs bigger steps between colours than light mode.
  - Simply inverting the dark palette for light mode gives too much contrast. Pull the light-mode colours closer together for a refined look.
  - Light and dark should feel different but consistent, not be exact opposites.
- Every native Mac app (Music, Shortcuts, Weather and the rest) has search, and it is always prominent and easy to reach.
- Command palettes (Notion, Obsidian, Attio) are sleek, but most of their items take you to a new screen. For an app that stays on one screen, a floating search bar with a slide-out preview fits better.
- Search can match what is inside images (image recognition), e.g. "mobile app with houses and a calendar".
- Image-similarity results go in the slide-out sidebar, a few per image.
- When search results look just like the browse view, make the state obvious:
  - a result count and a clear (✕) button inside the search bar
  - the query at the top left, with a back arrow to browse
- Keyboard shortcuts matter, and so does visible feedback. If nothing changes on screen, users assume something went wrong, so every shortcut needs a micro-animation or at least a state change:
  - Cmd+Shift+S slides the panel out.
  - Esc slides it away.
  - Enter turns it into a toast.
- The main search bar sits collapsed at the bottom until needed. Clicking it or pressing its shortcut expands it to full size, so every interaction gives instant feedback.
- Drag and drop of anything, anywhere, is a must (Apple's Photos, Finder, Reminders and Shortcuts all do it). Users drop content in, and can drag any item out to Figma, Finder or elsewhere.
- Include Apple's standard share button. In the preview slide-out, a floating action bar holds copy, find and delete ("find" may be "show in Finder").
- The goal is actions so natural that users don't think of them as features.
- Desktop apps need onboarding too. It isn't standard in Apple's apps, but Raycast's onboarding is excellent. Here it is a simple modal with micro-interactions, closed only by performing the shortcut, which opens the quick-save window. Users learn by doing.
- Teach the shortcuts, because they're powerful but easy to forget. Provide a cheat sheet; Google's opens with yet another shortcut. Here the cheat sheet sits in a settings popover, along with which side the quick-save panel opens from and the light/dark setting.

### Recipes
1. Quick-save floating panel [01:02–02:01]
   - Global shortcut: Cmd+Shift+S.
   - Window without traffic lights.
   - Contents: a drop zone, a single input, and buttons that each show a shortcut hint.
   - Background: native blur.
   - Enter → the panel collapses into a toast → the toast slides off screen.
   - Esc → the panel slides away.
   - Saving is optimistic: processing continues in the background.
2. Main window [02:33–03:33]
   - Mac utility layout: a top bar for global actions and content in the centre. The sidebar is dropped because navigation is only browse and search.
   - Traffic lights placed inside the UI.
   - The top ~50 px kept clear for dragging.
   - A large image grid for the user's content.
3. From empty to full [03:33–04:04]
   - An empty state with one invitation to save.
   - Filters hidden until items exist.
   - Item details shown only on click.
4. Search [05:36–06:37]
   - A floating search bar that searches image content.
   - Clicking an item opens a slide-out preview with a few visually similar results.
   - Results view: the count and ✕ inside the bar; the query at the top left with a back arrow to browse.
5. Collapsible search bar [07:08]: a collapsed pill at the bottom that animates out to full width on click or shortcut.
6. Drag and drop [07:08–07:38]
   - Drop files onto the quick-save window to save them.
   - Any item in the grid can be dragged out to other apps.
7. Preview actions [07:38–08:09]: a floating action bar in the slide-out (copy, find, delete), plus Apple's standard share button.
8. Onboarding [08:09–08:39]: a modal with micro-interactions, dismissed by performing Cmd+Shift+S, which opens the quick-save panel.
9. Settings popover [08:39]
   - A keyboard-shortcut cheat sheet.
   - Which side the quick-save panel opens from.
   - Light/dark mode.

No durations, blur amounts or easings are stated.

### CSS translation
```css
/* respect the system appearance */
@media (prefers-color-scheme: dark) { :root { /* dark tokens with wider steps between layers */ } }

/* web-based desktop shells: the top ~50px is the window drag area (Electron property; derived) */
.titlebar { height: 50px; -webkit-app-region: drag; }
.titlebar button, .titlebar input { -webkit-app-region: no-drag; }

/* quick-save panel with a native-like blur (web approximation; values derived) */
.quicksave { backdrop-filter: blur(30px) saturate(180%); background: rgb(255 255 255 / .7); border-radius: 16px; }

/* shortcut hints on buttons */
/* <button>Save <kbd>↵</kbd></button>  <button>Close <kbd>esc</kbd></button> */

/* collapsed bottom search bar that expands on click, focus or shortcut */
.search { width: 160px; transition: width 250ms ease; }                /* values (derived) */
.search:focus-within, .search.is-open { width: min(640px, 90vw); }    /* (derived) */

/* drag out: grid items use <img draggable="true"> and set dataTransfer in a dragstart handler (derived) */
```

### Gotchas
- Treating the Mac app as a destination the user has to switch to.
- Cramming actions into the top 50 px drag area.
- Adding a sidebar out of habit when navigation is trivial.
- Showing filters and controls before there is content to filter.
- Inverting colours straight between light and dark.
- A command palette that sends users to other screens in an app meant to stay on one screen.
- Shortcuts that give no visible feedback.
- Search results that look the same as browsing, with no count, clear button or back arrow.
- Supporting drag in but not drag out.
- Skipping onboarding and shortcut teaching because it's a desktop app.

### Examples named
- Spotlight: opens with Cmd+Space, can be dragged anywhere, appears then gets out of the way.
- Raycast: the same appear-and-disappear pattern; excellent onboarding.
- Notion: a pop-up when a meeting is detected; a command palette.
- Paste: a native panel along the bottom of the screen, with native blur.
- Apple Mail: optimistic delete to the Trash.
- Finder, Notes, Reminders, Calendar, Settings: top actions, sidebar navigation, content in the centre; traffic lights built into the UI.
- Music, Shortcuts, Weather: prominent search.
- Obsidian and Attio: command palettes.
- Photos, Finder, Reminders, Shortcuts: drag and drop everywhere.
- Google: a shortcut cheat sheet that opens with a shortcut.
- An unnamed note-taking tool: a similar collapse-into-a-toast save.
