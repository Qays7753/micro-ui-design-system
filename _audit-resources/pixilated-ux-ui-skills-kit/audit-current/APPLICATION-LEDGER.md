# Application ledger — skill inventory and evidence

## Inventory and audit boundary

The archived skill kit contains exactly 11 `SKILL.md` files. Every skill was read and applied to repository-local evidence. All 11 have a separate per-skill report in `skill-reports/`; the full skill-specific evidence and coverage are linked below. This is an independent audit of the local UI/UX design-system repository, not a consumer Micro product review. No external URL, application or repository was accessed, and no product/source/specification/docs/showcase/configuration file was changed.

| Skill (`SKILL.md`) | Loaded | Applied / evidence method | Raw finding IDs | Independent report |
|---|---:|---|---|---|
| `ux-researcher-agent` | Yes | JTBD/Moment hypothesis and research-confidence boundary applied to a local component fixture; no participant research claimed. | INT-001 (cross-support) | [`ux-researcher-agent.md`](skill-reports/ux-researcher-agent.md) |
| `design-direction` | Yes | Directional contract review; captured carousel and metric-circle geometry. | VISUAL-02, VISUAL-04 | [`design-direction.md`](skill-reports/design-direction.md) |
| `interaction-designer-agent` | Yes | Local Chromium interaction suite: 84 pass / 4 repeated failures / 0 runtime errors; lifecycle 383/383; calendar 55/55; component mobile 52/52. | INT-001 | [`interaction-designer-agent.md`](skill-reports/interaction-designer-agent.md) |
| `ux-writer-agent` | Yes | Four-family-state copy review; 339-string showcase inventory; targeted synthetic callback rejection reproduced. | LANG-001–004 | [`ux-writer-agent.md`](skill-reports/ux-writer-agent.md) |
| `design-systems-agent` | Yes | 14 family inventories, token/lifecycle/layer/dependency/docs/manifest review; read-only standalone check passed. | SYS-DS-001–008 | [`design-systems-agent.md`](skill-reports/design-systems-agent.md) |
| `ui-designer-agent` | Yes | Targeted Chromium crops and measured visual geometry; charts, metric states and fields checked. | VISUAL-01–04 | [`ui-designer-agent.md`](skill-reports/ui-designer-agent.md) |
| `edge-case-hunter` | Yes | 36 routes × 8 configurations (4 default widths + 4 stress configurations); 31 grouped state rows × 14 families; corrected focused test counts read and reconciled. | EDGE-001 | [`edge-case-hunter.md`](skill-reports/edge-case-hunter.md) |
| `ux-manager` | Yes | Local craft, system-scale and workflow-recovery gate using picker/dialog/field interaction outcomes. | INT-001 (cross-support) | [`ux-manager.md`](skill-reports/ux-manager.md) |
| `ui-manager` | Yes | Visual release-gate, acceptance-risk and owner decision review. | VISUAL-01–04 | [`ui-manager.md`](skill-reports/ui-manager.md) |
| `brand-auditor` | Yes | Six references, local profile/assets, 64 rendered checks, palette/CVD and actual contrast triage. | BRAND-01–06 | [`brand-auditor.md`](skill-reports/brand-auditor.md) |
| `anti-ai-slop` | Yes | Bounded source scan plus rendered review on 36 local routes; raw signals triaged instead of scored. | SLOP-01–03 | [`anti-ai-slop.md`](skill-reports/anti-ai-slop.md) |

## Reconciled finding counts

- **27** source-track IDs across all tracks.
- **22** distinct actionable findings in `FINAL-REGISTER.json`: 19 confirmed, 3 likely.
- **1** suspected defect rejected as current issue: `SYS-DS-003`, because the current calendar root-width fallback passed 55/55. Historic notes are cross-referenced under `SYS-DS-006`.
- **3** separate not-provable observations: host portability (`SYS-DS-008`), profile-derived color-area ratio (`BRAND-01`), and global palette-proximity warning without a semantic misuse (`BRAND-06`).
- `BRAND-02` and `BRAND-03` are one shared preview-mark decision (`BRAND-02-03`); the measured contrast is 3.00:1 if the `m` is text, while placement/role remains unapproved.
- Four interaction failures are repeated viewport tests of the same `INT-001`, not four findings.

## Important bounded evidence

Default route evidence covers 36 routes at 320/360/390/430 (144 captures); there was no default document overflow, route page error or resource error. The sweep contains 288 cases: 144 default cases and144 additional stress cases. Reduced-motion, forced-colors and font-only200% were at320; landscape was844×390. Stress modes were not crossed with every default width. The matrix distinguishes default observation, dynamic exercise, source inspection, not-applicable and not-provable states, grouping31 state rows across14 component families. It is not proof of every combination.

Focused results include interaction 84 pass / 4 repeated failures / 0 runtime errors, lifecycle 383/383, calendar root-width 55/55, component mobile 52/52, numeric controls 184/184, chart mobile 59/59, and the corrected data-scale state run 23/23. 200% edge text is a DOM font-size-only simulation, not native zoom. Forced-colors and reduced-motion are browser emulations.

## Limits

No physical devices, real touch, audible screen-reader behavior, native zoom, OS dynamic type/contrast, Safari/WebKit/Firefox, formal WCAG conformance, real user research, production data, backend/auth/session/network flows, or consumer application integration was tested. Tests/suggestions in finding acceptance criteria are future acceptance requirements unless explicitly described as existing completed evidence. P0/house-rule scanner labels are retained as raw metadata but are not translated into current production outage priorities.

The per-family future-state direction and unresolved owner choices are in [`FUTURE-STATE.md`](FUTURE-STATE.md); the full normalized register, evidence and rejected/not-provable observations are in [`FINAL-REGISTER.json`](FINAL-REGISTER.json).
