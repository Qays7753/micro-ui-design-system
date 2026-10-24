# Individual skill report — `ux-writer-agent`

**Status:** LOADED + APPLIED  
**Parent audit:** [`../LANG-ux-writer-audit.md`](../LANG-ux-writer-audit.md)  
**Machine-readable findings:** [`../LANG-findings.json`](../LANG-findings.json)  
**Finding IDs:** LANG-001–LANG-004  
**Product/source edits:** None

## Applied scope and method

Applied the UX Writer skill’s clarity, consistency, error-message, accessibility-copy, localization-readiness, voice/tone, state, string-ownership, pluralization, and MENA/Arabic review guidance to all 14 component families. Scope included source-generated UI strings, specifications, visible and accessible example copy, loading/empty/error/success states, RTL count/value presentation, and composed showcase examples. The coverage matrix, full findings, future-state proposals, decision options, and acceptance criteria are in the parent audit.

This is an implementation/copy audit of a design-system repository. No real-user comprehension, product voice, or analytics conclusions are inferred. No external research or site access was used. The skill’s real-time search protocol was not run because this audit is repository-local and explicitly avoids outside contact.

## Dynamic test added for LANG-003

- **Local sample root:** `http://127.0.0.1:5000/previews/concepts/index.html#gateway` (HTTP 200).
- **Public API exercised:** `MicroAccessGateway.init(gateway, { onSubmit })`.
- **Synthetic callback:** `onSubmit: () => Promise.reject(new Error("FixtureTransportError: E_DEMO_UNAVAILABLE"))`.
- **Valid form fixtures only:** `fixture@example.test` and `SYNTHETIC-FIXTURE-ONLY-42`. These were entered solely to satisfy local form validation; the callback made no network/auth request.
- **DOM assertions:** `[data-access-status]` contained the exact synthetic technical error once; its attributes were `role="status"`, `aria-live="polite"`, and `data-tone="error"`. There was one status node and one occurrence in gateway text. No external request was attempted.
- **Cropped screenshot:** [`../../../../generated-artifacts/pixilated-audit/LANG-003-synthetic-error-status-crop.png`](../../../../generated-artifacts/pixilated-audit/LANG-003-synthetic-error-status-crop.png). The image shows the status text as rendered.
- **Finding consequence:** LANG-003 is upgraded to **CONFIRMED** for this local reproduction path. The test confirms that a technical rejection message is displayed verbatim; it does not establish a real-user or production leak, or exercise a real integration.
- **Limits:** DOM state was verified, not an audible screen-reader announcement. No browser interaction beyond this targeted submit/rejection was claimed.

## LANG-002 Arabic count wording decision

Recommend the complete standard MSA count phrase **`18 طلبًا`** when that is the intended reading. In a full count phrase with 18, `طلبًا` is the singular accusative tamyīz, not nominative singular. However, the example visually separates the number from a short card-unit label and omits a complete clause, so the isolated rendering `18 طلب` is **not** asserted as a confirmed grammatical error from this evidence alone.

The certain fixture problem is separate: visible **`4 طلب`** conflicts with accessible **`4 طلبات`**. For the intended count phrase, `4 طلبات` is the standard form; the fixture should use matching text for visible and accessible output. Keep this a fixture/content-author correction. Do not add automatic pluralization to a generic card’s arbitrary consumer-owned unit.

## Exact skill references and scripts used

1. `_audit-resources/pixilated-ux-ui-skills-kit/ux-writer-agent/SKILL.md` — read and applied. This skill directory contains no `references/` directory or scripts.
2. `_audit-resources/pixilated-ux-ui-skills-kit/brand-auditor/scripts/extract_copy.py` — read and run against `previews/ui-system-showcase/index.html`; generated the parent audit’s `LANG-showcase-copy.json` and `.md` inventory (339 unique strings). This is a supporting inventory script, not an applied brand-audit skill.
3. Inline, non-persisted Python Playwright test using `playwright.sync_api`, browser executable `/repl/tools/bin/chromium`, and the local preview. It dynamically called the public API described above, submitted synthetic valid fixtures, asserted the status DOM and occurrence counts, blocked non-local requests, and saved the cropped screenshot. No test script was added to the repository.
4. `python3 -m json.tool` was used to validate the finding and extracted-copy JSON. It is a syntax-validation command, not a UX audit script.

## Audited implementation references

The source/spec/example coverage and cited line ranges are enumerated in the parent report’s **Source and evidence consulted** section, **Family coverage matrix**, and finding sources. The directly relevant exact references are:

- **LANG-002:** `components/info-strip/example-usage.html:23–28`; `previews/info-strip/index.html:36–38`; `previews/ui-system-showcase/index.html:480–482, 495–497, 546–554`.
- **LANG-003:** `components/access-gateway/access-gateway.js:149–151, 163–166, 230–234`; `components/access-gateway/specification.md:26–30`; public API documentation `components/access-gateway/README.md:11–15`; local test fixture `previews/concepts/index.html#gateway` (`previews/concepts/index.html:253–303`, especially `:263–295`).
- Other component/spec/preview sources examined for all 14 families are listed in the parent report; this individual report intentionally refers to that complete inventory rather than duplicating it.

## Outcome

Four findings remain: LANG-001 **LIKELY**, LANG-002 **CONFIRMED** (4-unit visible/accessible mismatch; 18 wording recommendation is qualified), LANG-003 **CONFIRMED** by the targeted synthetic local reproduction, and LANG-004 **CONFIRMED**. No product files were changed.
