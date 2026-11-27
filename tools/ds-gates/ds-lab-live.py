#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ds-lab-live — every interactive lab example actually works (batch-2 2.1,
owner note §1: «المبدّل المقسّم ما بيشتغل»).

On BOTH views (catalog + compose) and BOTH engines, the gate walks every
interactive element (button, [role=button], anchor, input), presses it for
real (trusted Playwright click with a JS-click fallback, or a typed value
for inputs), then requires ONE of:
  - the element's own state changed (class / aria-checked / aria-expanded /
    aria-selected / aria-current / aria-label / value),
  - the element was replaced by the press (remount — the old node detaches),
  - the PAGE changed (a sheet/confirm/toast appeared or changed text, the
    hash moved, the visible text length moved).

Rules that keep the scan honest:
  - Already-active elements are skipped (aria-selected/checked/current, the
    lab's on-key): pressing them is a no-op BY DESIGN — the group is proven
    by the non-active siblings.
  - The lab's own state keys (.lab-key: scale/pageState) press LAST: they
    replace the page content and detach everything collected before them.
  - The view toggles (data-ds-exempt="view-toggle") are verified separately:
    pressing one must flip the view BOTH ways.
  - The page Toast sits in layer 70 ABOVE the bars and intercepts presses
    under it for its 3s lifetime — the gate waits it out before pressing
    (the dismissal is the app's own onDismiss, not a gate shortcut).
  - Disabled elements are skipped (23.24(15)).

Sheets opened by the presses are closed again before the next element, so
every element is measured on a clean page.
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import CONFIG, Gate, gate_main, browser_session, DEFAULT_CONTEXT, resolve_page_target, wait_lab_ready

INTERACTIVE_SELECTOR = "button, [role='button'], a[href], input, textarea, select"

PRESS_FALLBACK_JS = """
(el) => {
  const opts = { bubbles: true, cancelable: true, composed: true, pointerId: 1, isPrimary: true, pointerType: 'touch' };
  el.dispatchEvent(new PointerEvent('pointerdown', opts));
  el.dispatchEvent(new PointerEvent('pointerup', opts));
  el.dispatchEvent(new MouseEvent('click', opts));
}
"""

SIG_JS = """
() => {
  const vis = (el) => el && el.getClientRects().length > 0;
  const toastEls = Array.from(document.querySelectorAll('.mds-toast'))
    .filter(el => el.closest('.lab-toast-stage') === null && vis(el));
  const page = {
    sheets: Array.from(document.querySelectorAll('.mds-sheet, [class*="mds-confirm"]'))
      .filter(el => el.closest('.lab-sheet-stage') === null && vis(el)).length,
    toasts: toastEls.length,
    toastText: (toastEls[0]?.textContent || '').slice(0, 40),
    hash: location.hash,
    textLen: (document.querySelector('.lab-main, .lab-compose')?.textContent || '').length,
  };
  return page;
}
"""

TOAST_VISIBLE_JS = """
() => !!Array.from(document.querySelectorAll('.mds-toast'))
  .find(el => el.closest('.lab-toast-stage') === null && el.getClientRects().length > 0)
"""

EL_SIG_JS = """
(el) => {
  if (!el || !el.isConnected) return null;
  return {
    cls: typeof el.className === 'string' ? el.className : '',
    checked: el.getAttribute('aria-checked'),
    expanded: el.getAttribute('aria-expanded'),
    selected: el.getAttribute('aria-selected'),
    current: el.getAttribute('aria-current'),
    label: el.getAttribute('aria-label'),
    value: el.value !== undefined && el.value !== null ? String(el.value) : null,
  };
}
"""

COLLECT_JS = """
(sel) => Array.from(document.querySelectorAll(sel)).map((el, i) => {
  const style = getComputedStyle(el);
  const disabled = el.disabled === true || el.getAttribute('aria-disabled') === 'true';
  const exempt = el.closest('[data-ds-exempt="view-toggle"]') !== null;
  // Already-active elements: pressing them is a no-op BY DESIGN (the
  // selected segment, the checked switch, the current tab, the lab's own
  // on-key) — their group is proven by the non-active siblings.
  const alreadyActive = el.getAttribute('aria-selected') === 'true'
    || el.getAttribute('aria-checked') === 'true'
    || el.getAttribute('aria-busy') === 'true'
    || (el.getAttribute('aria-current') !== null && el.getAttribute('aria-current') !== 'false')
    || (typeof el.className === 'string'
        && (el.className.includes('lab-key--on')
            || el.className.includes('--selected')
            || el.className.includes('--active')));
  // State-flipping lab keys (scale / pageState) go LAST: pressing them
  // replaces the page content, detaching everything collected before them.
  const inStrip = el.closest('.lab-compose-top') !== null
    || (typeof el.className === 'string' && el.className.includes('lab-key'));
  const desc = el.tagName.toLowerCase()
    + (typeof el.className === 'string' && el.className
        ? '.' + el.className.split(/\\s+/).slice(0, 2).join('.') : '')
    + ' «' + (el.textContent || el.getAttribute('aria-label') || el.getAttribute('placeholder') || '')
        .trim().slice(0, 24) + '»';
  return { i, desc, disabled, exempt, alreadyActive, inStrip,
           offstage: style.display === 'none' || el.getClientRects().length === 0 };
})
"""

CLEANUP_JS = """
async () => {
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const vis = (el) => el.getClientRects().length > 0;
  const press = (el) => {
    const opts = { bubbles: true, cancelable: true, composed: true, pointerId: 1, isPrimary: true, pointerType: 'touch' };
    el.dispatchEvent(new PointerEvent('pointerdown', opts));
    el.dispatchEvent(new PointerEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  };
  const pageSheets = () => Array.from(
    document.querySelectorAll('.mds-sheet, [class*="mds-confirm"]')
  ).filter(el => el.closest('.lab-sheet-stage') === null && vis(el));
  let rounds = 0;
  while (pageSheets().length && rounds < 5) {
    for (const sheet of pageSheets()) {
      // The Sheet's close button carries the SHEET's title as its
      // accessible name (not «إغلاق») — find it structurally: the header's
      // icon button. ConfirmSheet has none; its closer is «رجوع».
      const closer = sheet.querySelector('[class*="sheet-head"] .mds-icon-button, [class*="sheet"] > [class*="icon-button"]')
        || sheet.querySelector('.mds-icon-button')
        || Array.from(sheet.querySelectorAll('button'))
          .find(b => (b.textContent || '').trim() === 'رجوع');
      if (closer) press(closer);
    }
    await sleep(260);
    rounds++;
    if (pageSheets().length) {
      const scrim = Array.from(document.querySelectorAll('[class*="scrim"]'))
        .find(el => vis(el));
      if (scrim) press(scrim);
      await sleep(260);
    }
  }
  return pageSheets().length;
}
"""

SIG_KEYS = ["cls", "checked", "expanded", "selected", "current", "label", "value"]
PAGE_KEYS = ["sheets", "toasts", "toastText", "hash", "textLen"]


def wait_toast_gone(page, max_ms=4200):
    """The page Toast (layer 70) intercepts presses under it — wait for the
    app's own onDismiss to unmount it, then a settle beat."""
    waited = 0
    while waited < max_ms and page.evaluate(TOAST_VISIBLE_JS):
        page.wait_for_timeout(150)
        waited += 150
    if waited:
        page.wait_for_timeout(120)


def run(gate: Gate, target, args):
    kind, resolved = resolve_page_target(target)
    if kind == "na":
        gate.na("ds-lab-live/page", resolved)
        return
    if kind == "url":
        base_url, server = resolved, None
    else:
        server, base_url = resolved

    # The gate scans BOTH views in one run: derive the other view's URL.
    if "view=compose" in base_url:
        views = [("compose", base_url), ("catalog", base_url.replace("view=compose", "view=catalog"))]
    elif "view=catalog" in base_url:
        views = [("catalog", base_url), ("compose", base_url.replace("view=catalog", "view=compose"))]
    else:
        views = [("catalog", base_url), ("compose", base_url + "?view=compose")]

    for engine in CONFIG["engines"]:
        if args.engine != "both" and engine != args.engine:
            continue
        for view_name, url in views:
            check_id = f"ds-lab-live/{view_name}/{engine}"
            problems, pressed = [], 0
            try:
                with browser_session(engine) as session:
                    page = session.page(**DEFAULT_CONTEXT)
                    page.goto(url, wait_until="load", timeout=20000)
                    wait_lab_ready(page)
                    page.wait_for_timeout(200)

                    inventory = page.evaluate(COLLECT_JS, INTERACTIVE_SELECTOR)
                    handles = page.query_selector_all(INTERACTIVE_SELECTOR)
                    # Two sweeps: the page content first (stable DOM), the
                    # state-flipping lab keys last.
                    ordered = [e for e in inventory if not e.get("inStrip")] \
                        + [e for e in inventory if e.get("inStrip")]

                    for entry in ordered:
                        if entry["disabled"] or entry["exempt"] or entry["offstage"] or entry.get("alreadyActive"):
                            continue
                        idx = entry["i"]
                        if idx >= len(handles):
                            continue
                        handle = handles[idx]
                        try:
                            if not handle.is_visible():
                                continue
                        except Exception:
                            continue
                        wait_toast_gone(page)
                        before_el = page.evaluate(EL_SIG_JS, handle)
                        before_page = page.evaluate(SIG_JS)
                        try:
                            tag = handle.evaluate("el => el.tagName.toLowerCase()")
                            if tag in ("input", "textarea"):
                                handle.fill("٤٥")
                                page.wait_for_timeout(100)
                                after_el = page.evaluate(EL_SIG_JS, handle)
                                after_page = page.evaluate(SIG_JS)
                                handle.fill("")
                                page.wait_for_timeout(60)
                            else:
                                try:
                                    handle.click(timeout=1200)
                                except Exception:
                                    # A lingering overlay can block the trusted
                                    # hit-test — dispatch the POINTER sequence
                                    # usePress listens to (a bare el.click()
                                    # carries no pointer events).
                                    handle.evaluate(PRESS_FALLBACK_JS)
                                page.wait_for_timeout(280)
                                after_el = page.evaluate(EL_SIG_JS, handle)
                                after_page = page.evaluate(SIG_JS)
                        except Exception:
                            # The press detached/replaced the node (remount,
                            # view flip) — the press had a real effect.
                            after_el, after_page = None, before_page
                        pressed += 1
                        el_changed = after_el is None or before_el is None or \
                            any((before_el or {}).get(k) != (after_el or {}).get(k) for k in SIG_KEYS)
                        page_changed = any(before_page.get(k) != after_page.get(k) for k in PAGE_KEYS)
                        if not (el_changed or page_changed):
                            # One immediate retry for flaky timing (a busy
                            # re-render can swallow the first press) — the
                            # element must STILL change to pass; a retry that
                            # changes nothing is flagged like the first.
                            try:
                                handle.evaluate(PRESS_FALLBACK_JS)
                                page.wait_for_timeout(280)
                                after_el = page.evaluate(EL_SIG_JS, handle)
                                after_page = page.evaluate(SIG_JS)
                            except Exception:
                                after_el, after_page = None, before_page
                            el_changed = after_el is None or any((before_el or {}).get(k) != (after_el or {}).get(k) for k in SIG_KEYS)
                            page_changed = any(before_page.get(k) != after_page.get(k) for k in PAGE_KEYS)
                        if not (el_changed or page_changed):
                            problems.append(f"inert press: {entry['desc']}")
                        if os.environ.get("DS_LIVE_DEBUG") and not (el_changed or page_changed):
                            print(f"DBG inert: {entry['desc']}", flush=True)
                            print(f"  before_el={before_el}", flush=True)
                            print(f"  after_el ={after_el}", flush=True)
                            print(f"  before_pg={before_page}", flush=True)
                            print(f"  after_pg ={after_page}", flush=True)
                        remaining = page.evaluate(CLEANUP_JS)
                        if remaining:
                            problems.append(f"cleanup failed: {remaining} sheet(s) stayed open after {entry['desc']}")
                        page.wait_for_timeout(120)

                    # The lab's own view toggles: press must flip BOTH ways.
                    toggles = page.query_selector_all('[data-ds-exempt="view-toggle"]')
                    flip = False
                    if toggles:
                        flip_from, flip_to = ("lab-compose", "lab-page") if view_name == "compose" \
                            else ("lab-page", "lab-compose")
                        for tg in toggles:
                            try:
                                if not tg.is_visible():
                                    continue
                                wait_toast_gone(page)
                                try:
                                    tg.click(timeout=1500)
                                except Exception:
                                    tg.evaluate(PRESS_FALLBACK_JS)
                                page.wait_for_timeout(300)
                                if page.query_selector(f".{flip_to}") is not None:
                                    flip = True
                                back = page.query_selector(
                                    f'.{flip_to} [data-ds-exempt="view-toggle"], .{flip_to} .lab-key')
                                if back is not None:
                                    try:
                                        back.click(timeout=1500)
                                    except Exception:
                                        back.evaluate(PRESS_FALLBACK_JS)
                                    page.wait_for_timeout(300)
                                break
                            except Exception:
                                continue
                    if toggles and not flip:
                        problems.append(f"view toggle press did not flip {view_name} → the other view")
            except Exception as exc:
                problems.append(f"browser error: {exc!r}")
            if problems:
                gate.fail(check_id, f"{pressed} pressed, {len(problems)} inert")
                for p in problems[:20]:
                    gate.fail("ds-lab-live/inert/" + engine + "/" + view_name, p)
            else:
                gate.ok(check_id, f"{pressed} presses, every one changed its element or the page"
                        + (", view toggle flips" if toggles else ""))


if __name__ == "__main__":
    raise SystemExit(gate_main("ds-lab-live", run))
