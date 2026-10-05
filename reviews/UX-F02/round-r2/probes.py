#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""F02-R2 — بينات البنود الثمانية (F02-R1-01..08): يعيد إنتاج العيوب
المكتشفة في CHATGPT-REVIEW-R1 على المصدر قبل التصحيح (reproduced=true)
ويثبت زوالها على المصدر المصلح (reproduced=false).

التشغيل (من بيئة فيها Python/Playwright ومتصفح Chromium):
  F02_ROOT=/path/to/checkout F02_OUTPUT=/tmp/out python3 probes.py
  F02_BROWSER=/path/to/chromium اختياري لمسار المتصفح.

هذه أداة قياس وإعادة إنتاج؛ الخروج 0 يعني «العينات نفذت» لا «المصدر سليم».
أحكام reproduced تقرأ من الملف: true = العيب موجود في الشجرة المقاسة.
"""
import functools
import http.server
import json
import os
import re
import subprocess
import threading
from datetime import datetime
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(os.environ.get("F02_ROOT", Path(__file__).resolve().parent.parent.parent.parent)).resolve()
OUT = Path(os.environ.get("F02_OUTPUT", ROOT / "reviews" / "UX-F02" / "round-r2")).resolve()
OUT.mkdir(parents=True, exist_ok=True)

results = {
    "scope": "إعادة إنتاج بنود CHATGPT-REVIEW-R1 الثمانية على الشجرة المشار إليها؛ لا اختبار منصات ولا قارئ شاشة",
    "date": datetime.now().isoformat(timespec="seconds"),
    "target_root": str(ROOT),
    "probes": [],
    "page_errors": [],
}


def record(name, reproduced, measured):
    results["probes"].append({"name": name, "reproduced": bool(reproduced), "measured": measured})
    print(("REPRODUCED " if reproduced else "clean       ") + name, flush=True)


server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(
    http.server.SimpleHTTPRequestHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{server.server_port}"
CHOICE = "/previews/ux-patterns/choice-lifecycle/index.html"
FILTER = "/previews/ux-patterns/filter-lifecycle/index.html"
SWITCH = "/previews/ux-patterns/switch-lifecycle/index.html"

try:
    results["source_commit"] = subprocess.check_output(
        ["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
except Exception as exc:
    results["source_commit"] = f"git-unavailable: {exc}"

with sync_playwright() as pw:
    browser = pw.chromium.launch(
        headless=True,
        executable_path=os.environ["F02_BROWSER"]) if os.environ.get("F02_BROWSER") else pw.chromium.launch(headless=True)
    results["browser"] = browser.version
    ctx = browser.new_context(viewport={"width": 390, "height": 844})
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: results["page_errors"].append(str(e)))

    def load(which):
        pg.goto(f"{BASE}{which}", wait_until="networkidle")
        pg.evaluate("() => document.fonts.ready")

    def arm(value):
        pg.evaluate("""(v) => { const s = document.getElementById('f02c-sim-outcome');
             s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); }""", value)

    def settle(which="latest"):
        pg.evaluate(f"() => document.getElementById('f02c-sim-settle-{which}').click()")
        pg.wait_for_timeout(80)

    def inspect():
        return pg.evaluate("() => window.F02Choice.inspect()")

    def open_layer():
        pg.click("#f02c-open-picker")
        pg.wait_for_function("() => window.F02Choice.inspect().layerOpen === true", timeout=3000)
        pg.wait_for_timeout(60)

    # ---------- R1-01: بذرة البداية تضيع بعد أول ready ----------
    src = (ROOT / "previews/ux-patterns/choice-lifecycle/example.js").read_text(encoding="utf-8")
    patched = src.replace("var PICKER_SELECTED_INIT = null;",
                          "var PICKER_SELECTED_INIT = { value: 'beta', label: 'عينة ب' };")
    if patched != src:
        pg.route("**/example.js", lambda r: r.fulfill(status=200, content_type="text/javascript", body=patched))
        load(CHOICE)
        before = inspect()["selected"]
        open_layer()
        settle()
        after = inspect()
        pg.screenshot(path=str(OUT / "r1-01-initial-beta.png"))
        pg.unroute("**/example.js")
        lost = before is not None and after["selected"] is None
        record("R1-01-initial-beta-first-ready", lost,
               {"before": before, "after": after["selected"], "summary": after["pickerSummary"],
                "note": after["selectionNote"]})
    else:
        record("R1-01-initial-beta-first-ready", True, {"error": "seed needle missing — probe not executed"})

    # ---------- R1-02: empty يبقي اختيارًا لم يعد في المصدر ----------
    load(CHOICE)
    open_layer()
    settle()
    pg.click(".m-picker__option[data-value='beta']")
    pg.wait_for_function("() => window.F02Choice.inspect().layerOpen === false", timeout=3000)
    arm("empty")
    open_layer()
    settle()
    s = inspect()
    pg.screenshot(path=str(OUT / "r1-02-empty-keeps-selection.png"))
    retained = s["selected"] is not None and s["pickerSummary"] != "المحدد: لا شيء"
    record("R1-02-selected-beta-empty-source", retained,
           {"selected": s["selected"], "summary": s["pickerSummary"],
            "stateRow": s["stateRow"], "liveText": s["liveText"]})

    # ---------- R1-03: تحديث القراءة يسرق التركيز من زر ثابت ----------
    load(CHOICE)
    open_layer()
    settle()
    pg.click(".m-picker__option[data-value='beta']")
    pg.wait_for_function("() => window.F02Choice.inspect().layerOpen === false", timeout=3000)
    pg.evaluate("""() => window.F02Choice.setSource([
      { value: 'alpha', label: 'عينة أ' }, { value: 'gamma', label: 'عينة ج' }]);""")
    open_layer()
    # زر ثابت: زر المنتقي الداخلي (قبل الإصلاح) وإلا رأس الطبقة (بعد الإصلاح)
    stable = pg.evaluate("""() => {
      const inner = document.querySelector('#f02c-picker-layer [data-picker-close]');
      const head = document.getElementById('f02c-layer-close');
      const target = inner || head;
      target.focus();
      return { used: inner ? 'picker-inner-close' : 'layer-head-close',
               focused: document.activeElement === target }; }""")
    settle()
    s = inspect()
    pg.screenshot(path=str(OUT / "r1-03-stable-focus.png"))
    stolen = s["focusId"] != "f02c-layer-close"
    record("R1-03-stable-close-focus-stolen", stolen,
           {"stableUsed": stable["used"], "focusBefore": stable["focused"],
            "focusAfter": s["focusId"], "liveText": s["liveText"]})

    # ---------- R1-04a: no-results تترك عدد قراءة قديم في القناة ----------
    load(CHOICE)
    open_layer()
    settle()
    live_before = inspect()["liveText"]
    pg.fill("[data-picker-search]", "zzz")
    pg.wait_for_timeout(80)
    s = inspect()
    row_meta = pg.evaluate("""() => { const r = document.querySelector('.m-picker__state');
      return r ? { role: r.getAttribute('role'), live: r.getAttribute('aria-live') } : null; }""")
    misleading = bool(s["stateRow"] and "لا نتائج مطابقة" in s["stateRow"]
                      and "تمت القراءة" in (s["liveText"] or ""))
    record("R1-04a-no-results-stale-live", misleading,
           {"liveBefore": live_before, "liveAfter": s["liveText"],
            "stateRow": s["stateRow"], "rowMeta": row_meta})
    pg.fill("[data-picker-search]", "")
    pg.wait_for_timeout(80)

    # ---------- R1-04b: رسالة السقوط في القناة الخارجية الخاضعة لـinert ----------
    # إغلاق ثم بناء سيناريو: اختيار beta ثم زواله والطبقة مفتوحة
    pg.keyboard.press("Escape")
    pg.wait_for_function("() => window.F02Choice.inspect().layerOpen === false", timeout=3000)
    pg.evaluate("""() => window.F02Choice.setSource([
      { value: 'alpha', label: 'عينة أ' }, { value: 'beta', label: 'عينة ب' },
      { value: 'gamma', label: 'عينة ج' }]);""")
    open_layer()
    settle()
    pg.click(".m-picker__option[data-value='beta']")
    pg.wait_for_function("() => window.F02Choice.inspect().layerOpen === false", timeout=3000)
    pg.evaluate("""() => window.F02Choice.setSource([
      { value: 'alpha', label: 'عينة أ' }, { value: 'gamma', label: 'عينة ج' }]);""")
    open_layer()
    settle()
    note = pg.evaluate("""() => { const n = document.getElementById('f02c-selection-note');
      return { text: n.textContent, inInert: !!n.closest('[inert]') }; }""")
    s = inspect()
    dropped_note_in_inert = note["inInert"] and "لم يعد متاحًا" in note["text"] \
        and "لم يعد متاحًا" not in (s["liveText"] or "")
    record("R1-04b-drop-note-in-inert", dropped_note_in_inert,
           {"externalNote": note, "liveInLayer": s["liveText"]})

    # ---------- R1-05: تغيير fixture يمس قراءة بدأت سابقًا ----------
    r = pg.evaluate("""() => {
      const c = window.F02ChoiceSim.createConnector({ items: [{ value: 'old', label: 'Old' }] });
      const p1 = c.read({ readId: 101 });
      c.setSource([{ value: 'new', label: 'New' }]);
      const p2 = c.read({ readId: 102 });
      const out = { newerFirst: null, olderLater: null };
      return c.settle(102) === true ? p2.then(r2 => {
        out.newerFirst = r2; c.settle(101);
        return p1.then(r1 => { out.olderLater = r1; return out; });
      }) : Promise.reject(new Error('settle 102 failed')); }""")
    tainted = bool(r["newerFirst"] and r["olderLater"] and (
        r["olderLater"]["items"] != [{"value": "old", "label": "Old"}]
        or r["newerFirst"]["items"] != [{"value": "new", "label": "New"}]))
    record("R1-05-read-fixture-changed-after-call", tainted, r)

    # ---------- R1-06: تكرارات التركيب ----------
    load(CHOICE)
    dup_close = pg.evaluate("""() => ({
      layerClose: !!document.querySelector('#f02c-picker-layer [data-layer-close]'),
      pickerClose: !!document.querySelector('#f02c-picker-layer [data-picker-close]') })""")
    record("R1-06a-double-visible-close", dup_close["layerClose"] and dup_close["pickerClose"], dup_close)
    # شريط الحالة المرئي يقاس أثناء حالة قراءة فعلية (نص القناة مكتوب)
    open_layer()
    settle()
    live_probe = pg.evaluate("""() => { const l = document.getElementById('f02c-picker-live');
      const cs = getComputedStyle(l);
      const narrow = cs.width !== 'auto' && (parseFloat(cs.width) <= 2 || cs.clipPath.includes('50%'));
      return { display: cs.display, liveText: l.textContent, visuallyHidden: cs.display !== 'none' && narrow }; }""")
    record("R1-06b-visible-live-strip-duplicates-state-row",
           live_probe["display"] != "none" and not live_probe["visuallyHidden"], live_probe)
    pg.keyboard.press("Escape")
    pg.wait_for_function("() => window.F02Choice.inspect().layerOpen === false", timeout=3000)
    load(FILTER)
    badge = pg.evaluate("""() => {
      const legacy = document.querySelector('.f02f-count');
      const approved = document.querySelector('#f02f-filter-count.m-btn__counter');
      const btn = document.getElementById('f02f-filter-btn');
      return { legacy: !!legacy, approved: !!approved,
               ariaLabel: btn ? btn.getAttribute('aria-label') : null,
               icon: !!(btn && btn.querySelector('.m-btn__icon')) }; }""")
    record("R1-06c-alternate-filter-badge", badge["legacy"] or not badge["approved"], badge)
    load(SWITCH)
    pg.evaluate("""() => { const s = document.getElementById('f02s-sim-update-outcome'); s.value = 'saved';
      s.dispatchEvent(new Event('change', { bubbles: true })); }""")
    pg.click("label:has(#f02s-switch-input)")
    pg.wait_for_function("() => window.F02Switch.inspect().op === 'pending'", timeout=3000)
    pg.evaluate("() => document.getElementById('f02s-sim-settle-update').click()")
    pg.wait_for_function("() => window.F02Switch.inspect().op === 'saved'", timeout=3000)
    msg = pg.evaluate("() => window.F02Switch.inspect().message")
    both_meaningful = bool(msg and msg["title"] and msg["text"])
    record("R1-06d-saved-message-internal-detail", both_meaningful, msg)

    # ---------- R1-07: خروج أفقي عند 200% على عرض 320 ----------
    ctx2 = browser.new_context(viewport={"width": 320, "height": 844})
    pg2 = ctx2.new_page()
    pg2.on("pageerror", lambda e: results["page_errors"].append(str(e)))
    pg2.goto(f"{BASE}{CHOICE}", wait_until="networkidle")
    pg2.evaluate("() => document.fonts.ready")
    pg2.evaluate("() => document.getElementById('f02c-open-picker').click()")
    pg2.wait_for_timeout(300)
    pg2.evaluate("() => document.getElementById('f02c-sim-settle-latest').click()")
    pg2.wait_for_timeout(100)
    pg2.evaluate("""() => {
      const els = [...document.querySelectorAll('body, body *')]
        .filter(e => { const fs = getComputedStyle(e).fontSize; return fs && fs.endsWith('px'); });
      const snap = new Map(els.map(e => [e, parseFloat(getComputedStyle(e).fontSize)]));
      snap.forEach((px, e) => { e.style.fontSize = (px * 2) + 'px'; });
    }""")
    pg2.wait_for_timeout(60)
    overflow = pg2.evaluate("""() => {
      const docOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
      const offenders = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const n = walker.currentNode;
        if (!n.textContent.trim() || n.parentElement.closest('[hidden],svg,script,style')) continue;
        const rg = new Range(); rg.selectNodeContents(n);
        for (const rect of rg.getClientRects())
          if (rect.left < -2 || rect.right > window.innerWidth + 2)
            offenders.push({ text: n.textContent.slice(0, 50), left: Math.round(rect.left) });
      }
      return { docOverflow, offenders: offenders.slice(0, 5) }; }""")
    pg2.screenshot(path=str(OUT / "r1-07-choice-200-320.png"))
    record("R1-07-horizontal-overflow-200-at-320",
           overflow["docOverflow"] or bool(overflow["offenders"]), overflow)
    ctx2.close()

    # ---------- R1-08: كاشف FAIL الأعمى في أداة الشجرة المستهدفة ----------
    old_pattern = r"^FAIL\\b"
    mixed_log = "PASS a\nFAIL real failure\nPASS b\n"
    clean_log = "PASS a\nPASS b\n"
    old_blind = re.search(old_pattern, mixed_log, re.M) is None  # حقيقة تاريخية عن النمط
    # فحص سلوكي لأداة الشجرة نفسها: هل كاشفها يكشف FAIL فعليًا؟
    detector = None
    tool_blind = True
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location("f02check_probe", ROOT / "tools" / "ux-f02-check.py")
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        detector = getattr(mod, "find_fail_line", None)
        tool_blind = not (detector and detector(mixed_log) is True and detector(clean_log) is False)
    except Exception as exc:
        tool_blind = True
        detector = f"load-failed: {exc}"
    record("R1-08-fail-detector-blind-to-actual-fail", tool_blind,
           {"pattern": old_pattern, "logHasRealFail": True, "oldPatternIsBlind": old_blind,
            "treeToolBlind": tool_blind, "detectorFound": callable(detector)})

    browser.close()

server.shutdown()
(OUT / "probes.json").write_text(
    json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
reproduced = [p["name"] for p in results["probes"] if p["reproduced"]]
print(f"\nreproduced {len(reproduced)}/{len(results['probes'])}: {reproduced}")
print(f"probes.json → {OUT / 'probes.json'}")
