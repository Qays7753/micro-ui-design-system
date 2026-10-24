# UX/UI Skills Kit for Claude

**By Ahmedbaidas · Pixilated**

<div dir="rtl">

هاي حزمة الـ Skills اللي حكيت عنها بالفيديو: فريق UX/UI كامل جوّا Claude.
١١ Skill بتشتغل مع بعض: فريق تجربة المستخدم، فريق التصميم، وفريق فحص الجودة.
نزّلها، ركّبها، وخلّي Claude يشتغل معك كفريق كامل.

</div>

## Download

**[Download the full kit (all 11 skills)](https://github.com/ahmedbaidas-ops/claude-ux-ui-skills/releases/latest/download/Pixilated-UX-UI-Skills-Kit.zip)**

Each skill also has its own zip on the [Releases page](https://github.com/ahmedbaidas-ops/claude-ux-ui-skills/releases/latest), ready to upload to the Claude app one by one.

## The team

| # | Skill | Team | What it does |
|---|---|---|---|
| 01 | `ux-researcher-agent` | UX | Starts from the user's main Job to be Done and the moment they need it. Heuristic audits, WCAG checks, personas, journey maps. |
| 02 | `design-direction` | Design | Locks the visual direction before anyone designs: layout, header, hero, colour, type, cards, motion, references. |
| 03 | `interaction-designer-agent` | UX | Flows, IA, wireframes, states and micro-interactions: how the thing works. |
| 04 | `ux-writer-agent` | UX | Every word in the product: buttons, errors, empty states, onboarding, voice and tone, Arabic and RTL rules. |
| 05 | `design-systems-agent` | Design | Design tokens (W3C DTCG), components, dark mode, RTL and the design-to-code pipeline. |
| 06 | `ui-designer-agent` | Design | Visual execution, with a knowledge base learned from 102 Kole Jain and Tim Gabe UI videos. |
| 07 | `edge-case-hunter` | Quality | Every state the happy path forgot: loading, empty, error, offline, permissions, RTL, small screens. |
| 08 | `ux-manager` | UX | Review gate: Main Job check, Apple, Google and IBM critiques, verdict and must-fixes. |
| 09 | `ui-manager` | Design | Review gate: build vs. spec and tokens, contrast, component states, accessibility, verdict. |
| 10 | `brand-auditor` | Quality | Makes every screen look and sound like the brand: 70/20/10 colour, fonts, icons, voice, charts. |
| 11 | `anti-ai-slop` | Quality | The last pass. Finds and removes everything that makes a UI look AI-generated, then re-checks. |

## Install

### Claude app (claude.ai, desktop or mobile)

1. Open **Settings → Capabilities** and turn on **Code execution and file creation**.
2. In **Skills**, choose **Upload skill** and pick one skill zip (for example `ux-researcher-agent.zip`).
3. Repeat for each skill you want. Claude picks the right skill on its own when your request matches it.

<div dir="rtl">

**بالعربي:** من الإعدادات ← Capabilities شغّل Code execution، وبعدين من Skills اضغط Upload skill وارفع كل Skill لحالها (ملف zip لكل وحدة).

</div>

### Claude Code

Unzip the full kit into your skills folder:

```bash
unzip Pixilated-UX-UI-Skills-Kit.zip -d ~/.claude/skills/
```

## Run them as one team

Each skill works on its own. For a full design pass, run them in this order and pass each output to
the next:

1. **UX Researcher**: Main Job card and the moment, findings ordered by job impact
2. **Design Direction**: locked visual direction
3. **Interaction Designer**: flows, states and micro-interactions around that moment
4. **UX Writer**: the copy deck
5. **Design Systems**: tokens and house rules
6. **UI Designer**: the build
7. **Edge-Case Hunter**, **UX Manager** and **UI Manager** in parallel: must-fixes, applied to the build
8. **Brand Auditor**: on-brand pass (hands copy changes back to the UX Writer)
9. **Anti-AI-Slop**: final pass

Example prompt:

> Run the full UX/UI team on this dashboard: UX Researcher first, then Design Direction, Interaction
> Designer, UX Writer, Design Systems and UI Designer to rebuild it; then Edge-Case Hunter, UX Manager
> and UI Manager to review; apply their must-fixes; finish with Brand Auditor and Anti-AI-Slop.

## Notes

- **Brand Auditor** and **Anti-AI-Slop** ship small Python scripts (standard library only). Their
  rendered-page checks use Google Chrome in headless mode (the scripts look for it at
  `/Applications/Google Chrome.app` on macOS). Without Chrome they still review code and screenshots.
- The UI Designer's knowledge base is distilled from public videos by **Kole Jain** and **Tim Gabe**.
  Every note links back to its source in `ui-designer-agent/references/sources.md`. Go watch them.
