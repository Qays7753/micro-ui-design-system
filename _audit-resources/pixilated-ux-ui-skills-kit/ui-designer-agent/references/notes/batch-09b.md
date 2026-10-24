## Master Lovable AI in 30 Minutes (Beginner Tutorial)
- source: Tim Gabe · https://youtu.be/CfwNxDEXe6I
- type: tool-tutorial
- tags: lovable, ai, vibe-coding, workflow, prototyping, figma, states, micro-interaction

### Takeaways
- Think before you prompt. The build is only as good as the instructions. Lovable often offers a one-click fix, but every error you avoid saves credits.
- Start with one structured requirements prompt (the parts are in recipe 1). Build the UI first, then connect the database.
- Pasting screenshots of a Figma layout into the prompt pins down the look. It's optional, since prompt-only builds still come out well, but use screenshots when you want a specific UI.
- Fewer instructions per prompt get executed more reliably. Credits are limited, though, so batch small related fixes and split big features into separate prompts.
- Lovable doesn't always see an error. A dead link that led to a 404 page went unnoticed until he described it, so say what you clicked and what happened.
- When no fix button appears, open the browser console (right-click → Inspect → Console), copy the red errors, and paste them along with the action that caused them.
- Anything that has to persist (users, videos, likes, comments) needs a database. Connect the built-in Supabase integration. Each data feature then generates SQL that you approve with Apply changes. He skips reading the SQL but recommends reading it, because it makes debugging easier.
- Give a separate screenshot for each data state: the feed with no videos (empty state) and the feed after the first upload.
- Ask for the UI and the persistence in the same prompt ("add the like in the UI and in the database"). A feature wired on one page isn't wired anywhere else: the like and comment counts on feed cards stayed at 0 until he asked for them.
- If Lovable refuses a prompt as "unwanted changes", resend it shorter and reworded.
- When a file grows too big, Lovable offers to refactor it for maintainability. He accepted once so it would stop asking.
- Screenshot fidelity is close but not crisp, so expect a few rounds on cropping, borders and padding. Lovable also makes design choices you didn't ask for (it added a "Watch now" button to every card), so check for those.

### Recipes
1. Requirements prompt skeleton [01:32–03:05]
   1. App overview: what the app is.
   2. List of pages.
   3. Functionality per page.
   4. Database requirements (here: users, uploaded videos, likes, comments).
   5. Aesthetic and visual preferences.
   6. Development sequence: UI first, then connect the database.
   7. UI details for the first pages.
   8. Paste the prompt plus a screenshot of the first page from Figma. Set the project to private, then send.
2. Build sequence for a YouTube-style clone. The prompts are condensed from speech.
   1. Logo [04:06]: attach the logotype file and ask for the logotype and nav to be fixed.
   2. Routing [04:36–05:37]: "Logotype links to the welcome page when logged out and to the feed when logged in. Sign in and Get started go to the sign-in page. Sign-up links go to the sign-up page." Then rename Get started to Sign in.
   3. Error report [06:11]: "Clicking Sign in takes me to this 404 page. Please fix it."
   4. Database [07:44–09:52]: from Lovable's Supabase integration, create a Supabase project and connect it to the Lovable project.
   5. Auth [09:52–11:24]: "make sure authentication works" → Apply changes on the SQL. Then "add a username to the sign-up page and save it in the database too." Sign-up sends a verification email automatically.
   6. Login and empty state [11:54–13:00]: screenshot of the empty feed plus "this is the home/feed page when no videos exist. Land here after login, and make sure login works."
   7. Visual fixes [13:00–15:44]: attach the centre image, then "make the search bar rounded with no border, and give the avatar button an icon and a popover on click with Log out." Follow-ups: "fit the centre image inside its container, it's being cropped", then "remove the image container's background colour", then "make the search bar shorter and add about 4px more horizontal padding."
   8. Upload modal [16:17–16:50]: "upload buttons open a modal with every field needed: thumbnail, video, title, description." Lovable rejected it as unwanted changes. The shorter "upload buttons trigger a modal to upload videos" worked.
   9. Real upload [17:21]: "make the upload actually happen when Upload video is clicked, as long as all fields are filled."
   10. Console debug [19:22–20:26]: copy the red console errors and paste them with "I get this error when I try to upload a video. Can you help me fix it?"
   11. Populated state [20:57–21:29]: screenshot of the feed with videos plus "uploads seem to work. Once the first video exists, switch the feed to this layout."
   12. Detail page [23:35–24:09]: "clicking a video card opens that video's detail page" plus a screenshot.
   13. Likes and comments [24:39–26:16]: "clicking Like adds a like in the UI and in the database, and the same for comments." It took several Apply changes rounds.
   14. Like animation [26:47–28:19]: "when Like is clicked, show a heart that floats up and fades out, and keep the clicked heart red once the video is liked." Follow-up: "update the like count too."
   15. Player [28:19]: "show the video at the top instead of the thumbnail."
   16. Feed counts [29:23–29:53]: "on the feed page, show the correct like and comment counts on each card."
   17. Search [30:25–31:31]: screenshot of search results plus "typing in the search field and pressing Enter opens a results page like this screenshot."

### CSS translation
```css
/* Like feedback from step 14: a heart floats up and fades out, and the icon stays red once liked.
   All values derived: the video only says "red", "floats up" and "fades out". */
.like { position: relative; }
.like[aria-pressed="true"] .icon { color: var(--like-colour); fill: currentColor; }
.like .burst { position: absolute; inset: 0; pointer-events: none;
               animation: heart-float 700ms ease-out forwards; }
@keyframes heart-float { to { transform: translateY(-32px) scale(1.2); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .like .burst { animation: none; opacity: 0; } }

/* Search fix from step 7: rounded, no border, 4px more horizontal padding (the 4px is stated) */
.search { border: 0; border-radius: 9999px; padding-inline: calc(var(--search-pad-x) + 4px); }
```

### Gotchas
- Dead links (404s) went unnoticed by Lovable until he described them.
- A prompt that bundled several changes partly failed. Fewer instructions per prompt work better.
- Some runtime errors (the upload's "cannot read properties of null") come with no fix button. Use the browser console instead.
- The first like build animated and turned red, but the count didn't change.
- The email-verification landing page was broken, although verification itself worked. Remember to design that page.
- Approving SQL without reading it is the shortcut he admits to taking. Read it if you want to be able to debug.
- By the end the functionality works but the UI isn't polished yet. Plan a separate visual pass.
- The video is a paid collaboration with Lovable, so its praise of the tool isn't independent.

### Examples named
- YouTube: the product being cloned (feed, upload, detail page, likes, comments, search).
- Supabase: the backend built into Lovable (auth, database, verification email).
- Figma: where the reference screens were designed and screenshotted.

## Learn Framer For Beginners: Mini Course (2024)
- source: Tim Gabe · https://youtu.be/wgMgje60Ovw
- type: tool-tutorial
- tags: framer, layout, auto-layout, responsive, breakpoints, typography, colour, tokens, design-system, hero, navigation, buttons, spacing, grid

### Takeaways
- A web page is boxes inside boxes: every element gets its own container, and you set up each container to arrange what it holds. Use as few boxes as you can, for performance.
- A nav is built as section → nav → max-width container → left (logo stack), centre (links stack) and right (button). The max width is why the logo and button don't hug the screen edges on wide monitors.
- Framer terms: "Layout" is the parent name for Stack and Grid. A Stack is Figma's auto layout, and Webflow's flexbox.
- In a plain frame, children are placed with pins (for example 24 from the top and 24 from the right), and the pinned distances hold when the parent resizes. Turn off the frame's aspect-ratio lock to resize one axis only.
- Stack settings are Gap, Padding, Direction, Distribute (start, center, end, space between, space around, space evenly, following the direction), Align (the cross axis) and Wrap.
- Padding only works on an axis that isn't Fixed, so set that axis to Fit. Distribute only works when the stack has free space, so the stack must be Fixed rather than Fit on that axis.
- With Wrap set to yes, items move to a new row once they come within the padding of the edge (16 in the demo). That gives responsive card rows for free.
- Sizing options:
  - Fixed: a set size.
  - Fill: takes the remaining space, split in fractions (1fr, 0.5, 0.25, 2).
  - Relative: a percentage of the parent.
  - Fit content: wraps the children, so it's only available when the box has children.
- Positioning options:
  - Absolute: leaves the stack flow and is pinned anywhere.
  - Fixed: stays on screen while you scroll, for example a nav.
  - Relative: only inside a stack, and the parent's distribution places it.
  - Sticky: scrolls normally, then sticks once it reaches a Top offset (for example 64px). It only looks different from Fixed when the element starts lower on the page.
- Keep a style guide page (colours, type and other styles) as the base for consistency. Give it a slug with random digits so the public doesn't land on it.
- Type pairing for his icon-store brand ("clean, modern, edgy but respectable"): Oswald for headings and CTAs, Merriweather for body. Both are Google Fonts, which Framer supports natively. Six heading levels mirror H1–H6 for SEO, though a small site may only need three.
- Heading sizes: 200, 164, 96, 64, 48, 40, 32. Body in Merriweather: 24, 20, 16, 12. Body in Oswald: 24, 20, 16, 14. Use a type-scale tool rather than guessing.
- Heading 200 settings: uppercase transform, letter spacing −0.03, line height 110%, Bold. The other styles got similar tweaks (values in his working file, not stated).
- Neutral ramp: pure black at 100, 75, 50, 25, 20, 10, 5 and 3%, and white at 100 and 50%. Accents are teal, orange, purple and red (values shown on screen, not stated). Subtle greys give a site depth, and nearly every UI uses many of them.
- Name colours by role, not by hue: "dark 100" and "light 100" instead of black and white, so the brand dark can change later.
- Put the text colour inside the text styles: every heading dark 100, body dark 75, the smallest body dark 50.
- Create a text style from text you've already styled (Styles → New style) so every property carries over. Naming: Heading 1–6, with a seventh becoming Heading 6B, and Body XL/LG/MD/SM with a font suffix ("Body XL Mary" means Merriweather).
- Responsive type shortcut: at each breakpoint, a heading steps down to the next heading's size (Heading 1 goes 200 → 164 → 96).
- Anything 18px or smaller stays the same size on every device, so small text keeps its hierarchy without getting too small. This is his own shortcut, not a standard.
- Breakpoint minimum widths for text styles: large from 960, medium from 560, small from 0 to 559 (Framer's defaults are 1200 and 810). They must match the device frames on the canvas. His tablet frame is 560 wide and his phone frame 320.
- Keep text blocks no wider than 600px.
- Link style: default dark 100, hover dark 50, current unchanged (dark 100), transition a tween with ease-in-out, no decoration. He admits a colour-only hover may not be the most accessible choice.
- Make the root desktop frame a layout. Sections then default to Fill and can be dragged to reorder.
- Stay on a 4pt grid (image 240, button height 88). Give a button a fixed height instead of vertical padding, so you can read its grid size at a glance.
- Check every change on the published site in a real browser, not only in the canvas preview.
- Page padding shrinks by device. If desktop were 64, tablet would be 32 and phone 12. With 16 on desktop, keep 16 on tablet and use 12 on phone to get the most screen.
- You can add a custom in-between breakpoint (for example a "tablet mini" at 559 or about 487), but it's usually more headache than it's worth.

### Recipes
1. Box-model skeleton: nav and hero [05:15–17:41]
   1. Nest the frames: "section" → "navigation" → "container" (the max-width constrainer) → "left", "center" and "right".
   2. Left: logo symbol + logotype text → right-click → Add stack, so the two stay together.
   3. Centre: the link texts. A link with a dropdown arrow is the text plus an arrow box in a stack. Give "center" a layout (+) and its children centre automatically.
   4. Right: a button frame with a text label. Give the button a layout to centre the label.
   5. Hero: a frame "hero" holding an "image container" (one image, or three device images for MacBook, iPad and iPhone inside one container) and a "text container" (title, body, button). Give the text container a layout with gap 24.
2. Sticky with an offset [35:02–36:35]: set the element's position to Sticky, Top 64. Set the parent's distribution to Center so the element starts below the top. In preview it scrolls with the page, then sticks 64px from the top.
3. Style guide type [39:10–44:22]: new page with a slug like "style-guide-<digits>". Name the text layers by size ("Heading 200" and so on). Make the root desktop a layout, aligned left, height Fit. Apply the uppercase, letter-spacing, line-height and weight settings.
4. Colour swatches [44:53–50:06]
   1. Generate a palette in Coolors: Space generates new colours, and the lock keeps the ones you like.
   2. In Framer, make a frame "colors container": a layout, top-aligned, Fit.
   3. Inside it, one stack per colour family: blacks (wrapping), whites and accents.
   4. Round the swatches, and give the white swatches a border so they're visible.
5. Text styles [50:37–57:27]: select a styled text → Styles → New style → Heading 1, and repeat for each heading. Paragraph styles all default to the name "Body", so rename them (XL, LG, MD, SM plus the font). Reorder them in the Assets panel to keep the hierarchy.
6. Responsive text styles [57:57–67:31]: edit the style → Breakpoints → Add breakpoints → set the sizes:

   | Style | Large ≥960 | Medium ≥560 | Small <560 |
   |---|---|---|---|
   | Heading 1 | 200 | 164 | 96 |
   | Heading 2 | 164 | 96 | 64 |
   | Heading 3 | 96 | 64 | 48 |
   | Heading 4–6B | same step-down rule, values not stated | | |
   | Body XL, Oswald and Merriweather (24) | 24 | 20 | 16 |
   | Body 20 | 20 | 18 | 16 |
   | Body 16 / 14 / 12 | unchanged | unchanged | unchanged |

   Change every style's min widths from 1200/810 to 960/560. To test, add Tablet and Phone frames. The tablet frame needed left alignment before its content showed.
7. Colour styles [68:01–76:29]
   1. Select a swatch → Fill → + → name it. The set: dark 100, dark 75, dark 50, dark 25, dark 20, dark 10, dark 5, dark 3, light 100, light 50, teal, orange, purple, red.
   2. Keep the modal open and select the next swatch before pressing + again.
   3. Set the colour inside each text style: headings dark 100, body dark 75, the smallest body dark 50.
8. Link style [76:29–78:35]: Assets → add a Link style → default dark 100, hover dark 50, current dark 100. Transition → add Tween (ease-in-out). Decoration none.
9. Hero build [79:05–109:29]
   1. Make a frame "hero", filled dark 5 while you build. Put each headline line ("Next Level", "3D Assets") in its own frame ("top", "bottom"). On the live site these frames act as masks, and each line slides up out of its frame.
   2. Add three 240px images (a car, a bike and a brush from Unsplash). Hold Space while dragging so a layer doesn't nest into the wrong parent.
   3. Body text: Body LG Merriweather 20.
   4. Button: a frame with "Explore categories" (Body LG Oswald 20, dark 100) and a 20px pulse dot (made into a component later). Button layout: gap 12, border 5%, radius 20, side padding 56, fixed height 88 (34 top and bottom padding would give the same height).
   5. Wrap the headline frames, body, button and images in a stack called "wrapper". Set the images to position Absolute so they leave the flow (Option+V and Option+H centre them). Turn off the wrapper's overflow hidden and remove its default gap of 10.
   6. Pull the two headline lines together. A stack can't take a negative gap, so drop the line height from 110% to 95% (absolute positioning also works).
   7. Fluid headline: set the text size to 100% and its frame to Fill. The text then scales smoothly with the width instead of jumping at breakpoints. Add a space before and after the shorter line so both lines look the same width. Letter spacing −0.5 (unit not stated).
   8. Make the hero a stack, height 100vh for now (replaced in recipe 10). The blocks sit 32 apart.
   9. Make the root desktop a layout so the hero becomes Fill, and switch the wrapper from Fixed to Fill.
   10. Pin the images to different edges and tune the offsets (−96, −32) so they move sensibly between 960 and the max width.
   11. Put the max width on the wrapper, not on the full-bleed hero: 1200 at first, 960 site-wide later. The images live inside the wrapper so they stay near the text on very wide screens.
10. Responsive pass [109:29–124:35]
    1. Hero: change height 100vh to Fit, add bottom padding 64, and set Min height 100vh. Switch the unit to viewport, because typing 100 without changing the unit didn't work. Max width 960.
    2. Tablet:
       - Nav: hide the links (the nav becomes a component later) and set the height to 96.
       - Images: 184. Remove the top pin on one image, and the left pin on the bike so it stays centred instead of "biking around" as the window resizes.
       - Button: height 72, radius 16, less side padding (value not stated).
    3. Phone:
       - Images: 120 (he tried 112 and 128), with −40 offsets so they bleed off the edge.
       - Text: width Fill, centre-aligned.
       - Button: height 64, side padding 32, radius 12.
       - Hero and nav padding: 16 → 12.

### CSS translation
| Framer | CSS (mapping derived) |
|---|---|
| Stack direction / Gap / Padding | `display:flex; flex-direction` / `gap` / `padding` |
| Distribute start / center / end / space between / around / evenly | `justify-content: flex-start / center / flex-end / space-between / space-around / space-evenly` |
| Align | `align-items` |
| Wrap: yes | `flex-wrap: wrap` |
| Fixed / Fit / Fill 1fr, 0.5fr / Relative % | `width:Npx` / `width:fit-content` / `flex:1`, `flex:0.5` / `width:N%` |
| Position Relative (in a stack) / Absolute / Fixed / Sticky, Top 64 | in flow / `position:absolute` with the parent `position:relative` / `position:fixed` / `position:sticky; top:64px` |
| Frame pins | `top` / `right` / `bottom` / `left` on an absolute child. Unpinned and centred = `left:50%; translate:-50% 0` |
| Min height 100 viewport | `min-height:100vh` (`100svh` copes with mobile toolbars, derived) |
| Overflow visible / hidden | `overflow: visible / hidden` |

```css
/* Tokens: the neutral ramp is stated as black and white at opacities. Accent values were not stated. */
:root {
  --dark-100:#000; --dark-75:rgb(0 0 0/.75); --dark-50:rgb(0 0 0/.5); --dark-25:rgb(0 0 0/.25);
  --dark-20:rgb(0 0 0/.2); --dark-10:rgb(0 0 0/.1); --dark-5:rgb(0 0 0/.05); --dark-3:rgb(0 0 0/.03);
  --light-100:#fff; --light-50:rgb(255 255 255/.5);
}
/* Responsive type: small first, then min-width 560 and 960 (stated breakpoints). Text 18px and under never changes. */
.h1, .h2, .h3 { font-family: "Oswald", sans-serif; color: var(--dark-100); }
.h1 { font-weight: 700; text-transform: uppercase; letter-spacing: -0.03em; /* em derived */ line-height: 1.1; font-size: 96px; }
.h2 { font-size: 64px; }  .h3 { font-size: 48px; }
.body { font-family: "Merriweather", serif; color: var(--dark-75); }
.body-xl { font-size: 16px; }  .body-20 { font-size: 16px; }
.body-16 { font-size: 16px; }  .body-12 { font-size: 12px; color: var(--dark-50); }
@media (min-width: 560px) { .h1{font-size:164px} .h2{font-size:96px} .h3{font-size:64px} .body-xl{font-size:20px} .body-20{font-size:18px} }
@media (min-width: 960px) { .h1{font-size:200px} .h2{font-size:164px} .h3{font-size:96px} .body-xl{font-size:24px} .body-20{font-size:20px} }
p { max-width: 600px; }                                   /* stated cap on text width */

/* Link style */
a { color: var(--dark-100); text-decoration: none; transition: color 200ms ease-in-out; /* duration derived */ }
a:hover { color: var(--dark-50); }
a[aria-current="page"] { color: var(--dark-100); }

/* Hero: Fit height with min 100vh, bottom padding 64, wrapper max width 960, images inside the wrapper */
.hero { display: flex; flex-direction: column; min-height: 100vh; padding: 0 16px 64px; overflow: hidden; }
.hero .wrapper { position: relative; width: 100%; max-width: 960px; margin-inline: auto; container-type: inline-size; }
.hero .line { overflow: hidden; }                         /* each line masks its own slide-up */
.hero .line > span { display: block; line-height: .95; font-size: 22cqi; /* fluid "100%" text: derived, tune per string */
                     animation: rise 800ms cubic-bezier(.2,.8,.2,1) both; /* reveal timing derived */ }
@keyframes rise { from { translate: 0 100%; } }
.hero .deco { position: absolute; width: 240px; }
.btn { display: inline-flex; align-items: center; gap: 12px; height: 88px; padding-inline: 56px;
       border-radius: 20px; border: 1px solid var(--dark-5); /* "stroke 5%" read as 5% opacity; 1px derived */ }
@media (max-width: 959px) { .hero .deco { width: 184px; } .btn { height: 72px; border-radius: 16px; } }
@media (max-width: 559px) { .hero { padding-inline: 12px; } .hero .deco { width: 120px; }
                            .hero p { width: 100%; text-align: center; }
                            .btn { height: 64px; padding-inline: 32px; border-radius: 12px; } }
@media (prefers-reduced-motion: reduce) { .hero .line > span { animation: none; } }
```

### Gotchas
- Padding seems broken when that axis is Fixed, and Distribute seems broken when the stack is Fit.
- Fit content is greyed out on an empty frame. Relative positioning is greyed out unless the parent is a layout.
- Sticky with no starting offset looks just like Fixed.
- A fixed 100vh hero cuts off content on short, wide windows. Use Fit plus min-height 100vh.
- A min height typed as 100 stays in px until you switch the unit to viewport.
- Decorative absolute images whose parent is the full-bleed hero drift to the screen edges on wide monitors. Parent them to the max-width wrapper instead.
- His new stack came with overflow hidden and a gap of 10. Both caused problems here (clipped images, an unwanted gap).
- Text with a Fixed or Fit width overflows the phone frame. Set it to Fill and centre it.
- Stacks can't take a negative gap. Tighten the line height instead.
- The step-down type shortcut collapses the hierarchy at small sizes, which is why he freezes everything at 18px and below.
- In the colour-style modal, select the target swatch before clicking a style, or you'll overwrite the colour of the layer that's still selected.
- Dragging without holding Space can nest a layer into the wrong frame.
- If the text-style min widths don't match the device frames on the canvas, the styles switch at the wrong widths.

### Examples named
- Paste (a Mac app) website: his box-model teardown of a nav, and of a hero with MacBook, iPad and iPhone images.
- "Pand Icons" (name as heard): his course demo site, an e-commerce brand selling digital icons. Source of the type, colour and hero values.
- Coolors: palette generator (Space generates, lock keeps the colours you like).
- Google Fonts: Oswald and Merriweather, available natively in Framer.
- Unsplash: placeholder images from inside Framer's image fill.

## From Figma To 3D Website (Using Framer & Spline)
- source: Tim Gabe · https://youtu.be/4Byq1fjaUSY
- type: tool-tutorial
- tags: framer, 3d, scroll, animation, figma, plugins, workflow, landing-page

### Takeaways
- The pipeline: design in Figma → paste it into Framer with the Framer plugin → build a 3D object in Spline → embed the Spline scene in Framer, behind the content, sticky and driven by page scroll.
- Spline accepts any SVG exported from Figma. Extrude it to get a 3D shape.
- Make the scroll range match the page. His end value is 1500 because about 500 covers one section and the page has three (found by trial and error).
- He uses one Spline group per animation (scroll states, idle levitation, entrance slide-up). That's his preference; several events on one object also work.
- Give the camera states too. Animating only the object isn't cinematic enough.
- The embed pattern: an absolute "scroll container" 300vh tall holds a sticky embed 100vh tall. The content sits above it at z-index 2, and the decorative blurs and images go behind the content at z-index −1.
- Overflow must be visible on both the scroll container and the desktop frame, or the sticky scroll animation won't work. He stresses this as the one setting not to miss.
- Turn off Spline's own page scroll, orbit, pan and zoom so the embed doesn't fight the page. Set mouse events to Global so the scene still reacts while content sits on top of it.
- A static page feels dead next to a 3D hero. A cheap fix is one scroll-triggered entrance effect, copied onto every element.
- Run Spline's viewer performance test before you embed.

### Recipes
1. Figma → Framer [00:00–03:05]
   1. In Figma, select the frames "structure" (the sections) and "details" (blurs and images). Resources → Framer plugin → Copy to clipboard. In the desktop app it copies automatically.
   2. Paste into the Framer canvas and wait for the images to upload.
   3. Move the nav into the hero: position Absolute, pinned left, top and right at 0.
   4. Paste each blur and image from "details" into its section, Absolute. Hold Space while moving them to keep each layer at the same level.
   5. Copy the structure's background colour onto the desktop frame, then paste the structure into desktop. Make desktop a layout (+) with height Fit content.
   6. Select all sections → Max width 1200px, and set the structure's alignment to Center. This isn't fully responsive, but the page won't grow forever. Publish.
2. Spline cube [03:36–07:12]
   1. Export the 300×300 rectangle from Figma as SVG, drag it into Spline, ungroup it, and rename the shape "cube".
   2. Extrusion 300 (matching its size, so it becomes a cube). Corner 8, bevel 8, bevel sides 8.
   3. Material:
      - Colour: a pure blue. The captions read "000000FF", so #0000FF is likely; verify on screen.
      - Lighting layer: opacity 80.
      - Add a Matcap layer at 75 with the blue matcap image, placed below the lighting layer.
   4. Directional light: intensity 4, shadows off, position for example −150 / 750 / 450 (or drag the handles).
   5. Canvas: Effects on, then Bloom on. Background colour read as "0 70 934" (probably #070934; verify on screen).
3. Cube states [07:12–08:13]
   1. Base: cloner count 1.
   2. "multiply": Cloner on, count 8, position 305 (the 300 cube plus a 5 gap).
   3. "grow", a duplicate of multiply: cloner scale Y 1.5, position Y 150.
4. Scroll animation [08:13–09:14]
   1. Events → + → Scroll. Type Scroll (not Steps), start From page at 0, End after 1500.
   2. Transitions: base → multiply → grow.
   3. Export → Play settings: logo off, page scroll off, orbit off, pan off, zoom off, soft orbit off, pinch zoom off.
5. Hollywood camera [09:14–11:46]
   1. Add a camera, rename it "Hollywood cam", and make it the active camera instead of the personal camera.
   2. Give it states base, multiply and grow. Before framing each camera state, switch the cube to the matching state.
   3. Zoom 0.7 for base and 0.35 for multiply. The grow zoom isn't stated. Tilt and position by eye.
   4. Add a second scroll event with the same settings: 0 → 1500, base → multiply → grow.
6. Idle and entrance animations [11:46–13:52]
   1. Group the cube and name the group "levitate". Add a state "levitate" with a new Y position (captions read "minus1 130", likely −130). Start event: base → levitate, loop infinite, ping-pong.
   2. Group again and name it "slide up". In its state, set Y −1000 (below the screen), lock and scale to 0, rotation 45 and 45. Right-click → push the changes to the base state. Then reset the slide-up state to Y −150, scale 1, rotation 0 / 0. Start event: base → slide up.
7. Framer embed scaffold [13:52–17:00]
   1. Make a new frame with no fill. Insert → Embed, dropped inside the frame. Give the frame a layout (a stack), drag it into desktop, and delete the leftover frames. Rename it "scroll container".
   2. Scroll container: width Fill, height 300vh, Absolute, pinned to every side except the bottom, distribution Start.
   3. Embed: position Sticky, width Fill, height 100vh. Each section: height 100vh.
   4. Set overflow to Visible on the scroll container and on desktop.
   5. Structure: remove its fill (desktop already has it), then Styles → + → Z Index 2. Blurs and images in every section: Z Index −1.
8. Text entrance [17:00–19:03]
   1. Heading → Effects → + → Scroll animation, trigger Layer in view, Center, replay Yes.
   2. Custom Enter: 3D on, X 24 and Y −24 (rotation), offset Y 24, opacity 0 (set it to 1 while tuning).
   3. Spring: stiffness 240, damping 24, mass 2.4, delay 0.1.
   4. Right-click the effect → Copy, then select the other elements (texts and images) → Paste effects.
9. Export and embed [19:03–20:05]: Spline Export → Viewer. Mouse events Global (full window), no logo. Update the viewer, run the performance test, and copy the embed code. In Framer, paste it into the Embed's HTML field, then Publish.

### CSS translation
```html
<div class="page">
  <div class="scroll-track"><div class="stage"><!-- Spline viewer / canvas --></div></div>
  <main class="content"><section>…</section><section>…</section><section>…</section></main>
</div>
```
```css
.page { position: relative; }                                            /* overflow must stay visible */
.scroll-track { position: absolute; inset: 0 0 auto 0; height: 300vh; }  /* pinned top, left and right */
.stage { position: sticky; top: 0; width: 100%; height: 100vh; }
.content { position: relative; z-index: 2; }                             /* no background: the page carries it */
.content section { position: relative; height: 100vh; max-width: 1200px; margin-inline: auto; }
.content .blur, .content .deco { position: absolute; z-index: -1; }      /* behind the text, still above the 3D */

/* Entrance. Spring 240 / 24 / 2.4 gives damping ratio = 24 / (2·√(240·2.4)) = 0.5 and ω = √(240/2.4) = 10 rad/s,
   so it settles in about 4 / (0.5·10) = 0.8 s with a visible overshoot (all derived). */
.reveal { opacity: 0; transform: perspective(800px) rotateX(24deg) rotateY(-24deg) translateY(24px);
          transition: opacity 400ms ease-out 100ms, transform 800ms cubic-bezier(.34,1.56,.64,1) 100ms; }
.reveal.in-view { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { transform: none; transition: opacity 200ms; } }
```
```js
// "Layer in view, Center, replay Yes": in view once the element's top passes the viewport centre,
// and the class toggles back off when it leaves (rootMargin derived).
const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('in-view', e.isIntersecting)),
  { rootMargin: '0px 0px -50% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```
- Why the overflow setting matters (standard CSS, derived): `position: sticky` sticks inside its nearest scrolling ancestor. An ancestor with `overflow: hidden` or `auto` becomes that ancestor, and the stage stops sticking. Use `overflow: clip` if something really has to be clipped.
- In code, set the scroll range from the real scroll distance (the track height minus the viewport, about 200vh here) instead of copying Spline's 1500 (derived).

### Gotchas
- Overflow hidden on the scroll container or on desktop kills the scroll animation.
- Remove the structure's own fill. The desktop already carries the background colour, and the structure has to sit above the embed (z-index 2).
- Z Index doesn't appear under Styles until you add it with +.
- If desktop doesn't become a layout automatically after pasting, press + on Layout.
- Switch the cube to the matching state before framing each camera state, or the shots won't line up.
- The blue looks wrong until the matcap and bloom are added, and lighting can eat a whole day if you let it.
- Only a max width is set here. The page isn't made responsive for tablet or phone.

### Examples named
- Spline: browser 3D tool, which he describes as Figma or Framer for 3D.
- The Framer plugin for Figma: copies selected frames as Framer layers.

## Framer Parallax Trick (Loop & Scroll Speed Tutorial)
- source: Tim Gabe · https://youtu.be/V-xm5c_XRWU
- type: tool-tutorial
- tags: framer, parallax, scroll, animation, imagery, sections

### Takeaways
- The effect is three simple layers of motion with no complex structure:
  - images scrolling at different speeds (the parallax),
  - a slow, constant spin (a loop),
  - text that enters when its section reaches the top of the viewport.
  A particles component adds ambient motion behind them.
- Each floating image is a "content" frame with no fill, holding the image plus a blurred copy behind it. With the frame's overflow visible, the blur spills out as a coloured glow. Clipped, it looks like a glass card instead.
- Framer warns that blur filters cost performance. He uses them anyway for the look, so budget them.
- Speeds of 130, 20 and 140 on the three images create the depth.
- Start the parallax from a scroll position (96px from the top of the viewport), not from page load. Otherwise the images drift out of place before the user reaches the section.
- A 360° loop at 65s gives a slow spin. The 1s default spins far too fast.
- Mark the section as a Scroll Section so text animations can trigger on it, when the top, centre or bottom of the viewport reaches it. Bottom fires too early: the animation is already over by the time you see the text. Top waits until the top of the viewport reaches the section.
- Build one entrance animation, then copy and paste the effect onto every other text element.
- Lock background layers (Cmd/Ctrl+L) so you don't select them by accident.

### Recipes
1. Layout [00:30–08:52]
   1. Section frame, background colour picked from the reference.
   2. Particles component, copied from a free component library (heard as "framer.supply"):
      - pinned to all sides, so it scales responsively,
      - backdrop at 0% opacity (it can't be removed),
      - particle colour a darker yellow, to look like fire,
      - layer opacity 30%,
      - sent to the back and locked.
   3. Three "content" frames of different sizes, fill removed. Inside each one:
      - the "image",
      - behind it, a larger copy renamed "blur": Styles → Filters → Blur 24.
      Set the content frame's overflow to Visible.
   4. Pin the frames for responsiveness and bleed:
      - one pinned right at −96 and bottom 96,
      - one pinned left (56, maybe 160),
      - one at 96 from the side and 120 from the top.
      Rotate each slightly (angles shown on screen, not stated). Move them above the text in the layer order if they should overlap it.
   5. Wrap the text (chapter label, "Agony" heading with a linear gradient and a blend mode, body, button) in a stack: height Fit, gap 24 or 32, named "text container". Set the section width to Fill.
2. Parallax [10:23–12:02]
   1. Image 1 → Effects → + → Scroll speed 130. Image 2: 20. Image 3: 140.
   2. Select all three and change the Scroll speed trigger from Current to Scroll, with the start position at 96px from the top of the viewport.
3. Spin [12:02–13:06]: each content frame → Effects → Loop → rotate 360°, duration changed from 1s to 65s.
4. Text entrance [13:06–17:51]
   1. Add a Scroll Section to the section and name it "Agony section".
   2. Chapter text → Effects → Scroll animation → trigger Section in view → section "Agony section" → Top.
   3. Enter: opacity 0, scale 1, a slight rotation (value not stated), offset Y 16.
   4. Spring: stiffness 300, with more damping and some mass (values not stated).
   5. Copy the effect, select the other text elements, and Paste effects.
   6. Set the text container's overflow to Visible, or the button's glow gets cut off.

### CSS translation
```css
/* Glow image: the blurred copy spills out because the frame doesn't clip */
.float { position: absolute; overflow: visible; animation: spin 65s linear infinite; }  /* 65s stated, linear derived */
.float img { position: relative; display: block; }
.float .blur { position: absolute; inset: -8%; /* "a bit bigger", derived */ z-index: -1; filter: blur(24px); }
@keyframes spin { to { rotate: 360deg; } }
/* The spin animates rotate and the script sets translate. Keeping them as separate properties
   stops one from overwriting the other (derived). */
@media (prefers-reduced-motion: reduce) { .float { animation: none; } }

/* Text entrance, "Section in view → Top" */
.agony .reveal { opacity: 0; translate: 0 16px; rotate: -3deg; /* rotation derived */
                 transition: opacity .5s, translate .7s cubic-bezier(.34,1.56,.64,1), rotate .7s cubic-bezier(.34,1.56,.64,1); }
.agony.in-view .reveal { opacity: 1; translate: 0 0; rotate: 0deg; }
```
```js
// Framer's Scroll speed S%: the layer moves at S% of the scroll speed once the section passes the start line
// 96px below the top of the viewport. 100 = normal speed (Framer behaviour, not stated in the video).
// 130 and 140 run ahead of the scroll; 20 nearly hangs in place.
const els = [...document.querySelectorAll('.float[data-speed]')];
function update() {
  for (const el of els) {
    const s = el.dataset.speed / 100;                               // 1.3, 0.2, 1.4
    const top = el.closest('section').getBoundingClientRect().top;  // untransformed reference (derived)
    el.style.translate = `0 ${Math.max(0, 96 - top) * (1 - s)}px`;
  }
}
let queued = false;
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(() => { update(); queued = false; }); } }, { passive: true });
update();

// "Top" trigger: a zero-height line at the top of the viewport. The section is in view while it straddles that line (derived).
const section = document.querySelector('.agony');
new IntersectionObserver(([e]) => section.classList.toggle('in-view', e.isIntersecting),
  { rootMargin: '0px 0px -100% 0px' }).observe(section);
```

### Gotchas
- Overflow hidden on a content frame clips the blur (it reads as glass, not glow). Overflow hidden on the text stack cut off the button's glow.
- With the default "Current" trigger, the images scroll out of place before the section arrives.
- The loop's 1s default is far too fast for a decorative spin.
- The Bottom trigger fires before the text is on screen, so nobody sees the animation.
- Every blur layer costs performance.
- The particles component's backdrop can't be deleted. Set it to 0% opacity.
- Pin the particles to all sides or they won't scale with the section.

### Examples named
- none named. The particles component comes from a free Framer component resource, heard as "framer.supply".

## 3 Tricks For Amazing Button Animations (Framer Tutorial)
- source: Tim Gabe · https://youtu.be/inkIfPtmE9s
- type: tool-tutorial
- tags: framer, buttons, micro-interaction, animation, states, variants, components, gradients, shadows

### Takeaways
- All three buttons use one technique: a component with variants, and Framer animating between them on hover, press or tap.
- Hover and Pressed are momentary states. For a toggle that has to stay changed after a click (like → unlike), make a custom variant and wire a tap event in each direction.
- Glow: a blurred duplicate of the button (blur 12) sits behind it and scales up on hover. The wrapper needs overflow visible.
- Shine: a tilted, blurred (6), semi-transparent bar slides from just outside the left edge to just outside the right edge on hover. It must sit inside the button frame so the button clips it.
- 3D press: a darker ledge under the button, made from bottom padding of 6. Pressing shrinks it to 2 and fades the inner highlight from 15% to 5%.
- A 25% white border gives a gradient button a crisp edge.
- Spring damping, stiffness and mass change the feel a lot. Tune them by playing the preview.

### Recipes
1. Shine and glow button ("play sequence") [00:30–05:35]
   1. Text "play sequence" (font heard as "Toric"). Put a frame around it called "inner button":
      - fill: a linear gradient, rotated (colours shown on screen, not stated),
      - radius increased with Shift,
      - a white border at 25%.
   2. Wrap it in a frame "button container".
      - Inside it, duplicate the inner button and delete the copy's text.
      - Give the copy Styles → Filters → Blur 12, keep it behind, and rename it "BG blur".
      - Set the container's overflow to Visible and remove its fill.
   3. Inside the inner button, add a frame "shine": tilted, Blur 6 (12 was too much), lower opacity (value not stated).
   4. Right-click the container → Create component. Add a Hover state (+).
   5. Primary: the shine sits outside the button on the left, and BG blur is scaled down from the centre (Shift+Option).
   6. Hover: BG blur goes back to full size, and the shine is dragged (with Shift) to the right side.
   7. Transition: Spring. Tune damping, stiffness and mass (his values are in the file, not stated).
2. 3D pressable button [06:05–09:07]
   1. Text → Add Stack. Dark fill, radius 16 and then 20. Set Fit content on both axes, or the padding won't work. Add extra padding on the sides.
   2. Shadow: type Inside, X −8, Y −8, blur 4–6, white at 15%.
   3. Wrap it in another stack (the outer one is "button container", the inner one "inner container"). Fill it darker than the button, radius 20, padding on the bottom only: 6. That bottom padding is the depth. Fit on both axes.
   4. Create a component ("Button Container 2") and add a Pressed state (+), not Hover.
   5. Pressed: bottom padding 6 → 2, and the inner container's inner shadow drops to 5%.
3. Like / Unlike button with a GIF [09:07–14:44]
   1. Text "like" in Satoshi Bold, duplicated as "unlike". Both Fit.
   2. A large coloured frame with Blur 24 and rounded corners, named "Blur". Paste a GIF from any GIF site.
   3. Button frame: large radius, linear gradient (colours shown on screen, not stated). Put "like", "unlike", the blur and the GIF inside, then Create component ("Button Container 3").
   4. Primary state:
      - the blur goes to the back, sitting lower,
      - "like" is centred,
      - "unlike" is nudged below the button (Shift+↓),
      - the GIF is centred and pushed down out of view.
   5. Hover (+):
      - "like" moves up out of view,
      - the GIF rises into view,
      - the blur rises about halfway.
   6. A custom Variant (+, not Pressed) for the liked state:
      - "like" goes up,
      - the blur goes all the way up,
      - "unlike" is centred,
      - the GIF also goes up.
   7. Interactions (the lightning icon): on Primary, Tap → the liked variant. On the liked variant, Tap → Primary. Preview with Cmd/Ctrl+P.
   8. The parked labels only stay hidden if the button frame clips its content. That's implied, not stated.

### CSS translation
```css
:root { --spring: cubic-bezier(.34,1.56,.64,1); }   /* stand-in for Framer's spring, derived */

/* 1. Shine and glow */
.play { position: relative; isolation: isolate; display: inline-block; }
.play__face { position: relative; overflow: hidden; border-radius: 9999px; background: var(--btn-gradient);
              border: 1px solid rgb(255 255 255 / .25); }                      /* 25% stated, 1px derived */
.play__glow { position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: var(--btn-gradient);
              filter: blur(12px); scale: .8; transition: scale 500ms var(--spring); }   /* blur 12 stated */
.play__shine { position: absolute; top: -25%; bottom: -25%; left: -40%; width: 25%; rotate: 20deg;
               background: rgb(255 255 255 / .4); filter: blur(6px);              /* blur 6 stated */
               transition: left 600ms var(--spring); }
.play:hover .play__glow { scale: 1; }
.play:hover .play__shine { left: 115%; }

/* 2. 3D press. Derived variant of the padding 6 → 2 change: the ledge is a hard shadow and the face moves
      down 4px, so the button keeps its height and nothing below it jumps. */
.press { border-radius: 20px; background: var(--face);
         box-shadow: 0 6px 0 var(--ledge), inset -8px -8px 6px rgb(255 255 255 / .15);
         transition: translate 120ms ease-out, box-shadow 120ms ease-out; }        /* timings derived */
.press:active { translate: 0 4px; box-shadow: 0 2px 0 var(--ledge), inset -8px -8px 6px rgb(255 255 255 / .05); }

/* 3. Like / Unlike toggle (set aria-pressed on click) */
.like { position: relative; isolation: isolate; overflow: hidden; inline-size: 160px; block-size: 56px; /* size derived: every child is absolute */
        border-radius: 9999px; background: var(--btn-gradient); }
.like > * { position: absolute; left: 50%; top: 50%; translate: -50% -50%; transition: translate 450ms var(--spring); }
.like .unlike, .like .gif { translate: -50% 150%; }                       /* parked below */
.like .blob { z-index: -1; filter: blur(24px); translate: -50% 60%; }     /* blur 24 stated */
.like:not([aria-pressed="true"]):hover .label { translate: -50% -250%; }
.like:not([aria-pressed="true"]):hover .gif   { translate: -50% -50%; }
.like:not([aria-pressed="true"]):hover .blob  { translate: -50% 10%; }    /* about halfway */
.like[aria-pressed="true"] .label, .like[aria-pressed="true"] .gif { translate: -50% -250%; }
.like[aria-pressed="true"] .unlike { translate: -50% -50%; }
.like[aria-pressed="true"] .blob   { translate: -50% -60%; }
```
```js
document.querySelectorAll('.like').forEach(b =>
  b.addEventListener('click', () => b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'))));
```

### Gotchas
- A shine frame placed outside the inner button shows outside the button's shape.
- With overflow hidden on the container, the glow gets clipped. Remove the container's fill too.
- Stack padding doesn't apply unless both axes are Fit.
- Building like/unlike on the Pressed state would snap back when you let go. It needs a variant plus a tap event in each direction.
- Blur 12 on the shine was too strong, so he dropped it to 6.

### Examples named
- none named
