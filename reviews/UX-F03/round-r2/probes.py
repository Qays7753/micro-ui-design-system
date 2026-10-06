#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — probes قبل/بعد لإغلاق F03-R1-01..07 (إغلاق R1-08: أدلة تكشف فعليًا).
من جذر أي نسخة من المستودع (قديمة أو جديدة):
    F03_PROBE_ROOT=<root> F03_PROBE_OUT=<out> python3 probes.py

المخرج: probes.json فيه نتيجة كل probe (defect_found: true يعني العيب موجود
في هذه النسخة). الاستخدام المثبت:
- على المصدر القديم (189b0d8 — تركيب الجولة الأولى): 7/7 عيوب تُكتشف.
- على المصدر الجديد (التركيب المترابط): 0/7 عيوب.

كل probe يعمل بواجهة المستخدم الفعلية للتركيبين (كشف تلقائي للتركيب):
القديم: منظر عرض واحد + لوحة تعديل B07 + قسم SIMULATION ظاهر.
الجديد: رئيسية/قائمة/تفاصيل/نموذج + وضع مراجعة مغلقة.
ما لا يثبته: وصولًا شبكيًا فعليًا ولا قارئ شاشة — حدود موثقة في تقرير الجولة.
"""
import json
import os
import subprocess
import sys
import threading
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(os.environ.get("F03_PROBE_ROOT", Path(__file__).resolve().parents[3]))
OUT = Path(os.environ.get("F03_PROBE_OUT", Path(__file__).resolve().parent))
SAMPLE_REL = "previews/ux-patterns/mobile-record-sample"
VIEW = {"width": 390, "height": 844}


def git_head(root: Path) -> str:
    try:
        return subprocess.check_output(["git", "-C", str(root), "rev-parse", "HEAD"], text=True).strip()
    except Exception as e:  # noqa: BLE001
        return f"unavailable: {e}"


def is_new_composition(page) -> bool:
    """التركيب الجديد فيه الرئيسية (view-home) ولا يحتوي لوحة SIMULATION الظاهرة."""
    return page.evaluate("!!document.getElementById('view-home')")


class ProbeRunner:
    def __init__(self, page):
        self.page = page
        self.results = []

    def rec(self, name, defect_found, measured):
        self.results.append({"name": name, "defect_found": bool(defect_found), "measured": measured})

    # ---------- تجهيزات حسب التركيب ----------
    def open_edit_old(self):
        self.page.click("#f03-edit-btn")
        self.page.wait_for_function("document.getElementById('f03-edit-sheet').hidden === false")
        self.page.wait_for_timeout(300)

    def open_edit_new(self, item_id="it-01"):
        pg = self.page
        pg.evaluate("F03App.showView('home')")
        pg.wait_for_timeout(80)
        pg.evaluate("() => { try{localStorage.clear()}catch(e){}; F03App.resetDemoData(); }")
        pg.wait_for_timeout(100)
        pg.click("#f03-home-all")
        pg.wait_for_function("F03App.inspect().view === 'list'")
        pg.click(f"#f03-list-rows .f03-row[data-id='{item_id}']")
        pg.wait_for_function("F03App.inspect().view === 'detail'")
        pg.click("#f03-detail-edit")
        pg.wait_for_function("F03App.inspect().view === 'form'")
        pg.wait_for_timeout(200)

    # ---------- probes ----------
    def p01_default_ui_clean(self):
        """R1-01: الافتراضي يبدأ بتقرير تقني ولوحة اختبار → عيب."""
        pg = self.page
        pg.goto(self.url)
        pg.wait_for_load_state("load")
        pg.wait_for_timeout(300)
        data = pg.evaluate("""() => {
          const head = document.querySelector('.f03-head');
          const sim = document.getElementById('f03-sim');
          const vis = (e) => !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0;
          const text = document.body.innerText;
          const hits = ['UX-F03', 'DRAFT', 'SIMULATION', 'IBM Plex'].filter(t => text.includes(t));
          return {headVisible: vis(head), simVisible: vis(sim), textHits: hits,
                  tabCount: document.querySelectorAll('button, [href], input, select, [tabindex]').length};
        }""")
        defect = data["headVisible"] or data["simVisible"] or len(data["textHits"]) > 0
        self.rec("R1-01 الافتراضي يعرض تقريرًا تقنيًا وأدوات اختبار", defect, data)
        pg.screenshot(path=str(OUT / "probe-r1-01-default.png"), full_page=True)

    def p02_chevron_fill(self):
        """R1-02: سهم الفئة يخالف أصل HugeIcons (fill='none' مفقود) → عيب."""
        pg = self.page
        sel = ".f03-cat__chevron use"
        if pg.evaluate(f"!document.querySelector('{sel}')"):
            self.rec("R1-02 سهم الفئة يخالف الأصل", False, {"skipped": "no chevron in composition"})
            return
        if is_new_composition(pg):
            pg.click("#f03-home-all")
            pg.wait_for_function("F03App.inspect().view === 'list'")
        data = pg.evaluate("""() => {
          const use = document.querySelector('.f03-cat__chevron use');
          if (!use) return {found: false};
          const sym = document.getElementById('i-chevron-down');
          return {found: true, useFill: getComputedStyle(use).fill,
                  symFillAttr: sym ? (sym.getAttribute('fill') || 'absent') : 'no-symbol'};
        }""")
        defect = data.get("found") and data["useFill"] != "none"
        self.rec("R1-02 سهم الفئة لا يحفظ fill=none من الأصل", defect, data)

    def p03_read_snapshot(self):
        """R1-03: نتيجة القراءة من مصدر وقت التسوية لا وقت الدعوة → عيب."""
        pg = self.page
        if pg.evaluate("!!window.F03Store"):
            # التركيب الجديد: موصل فوق المخزن + setSource
            data = pg.evaluate("""async () => {
              const c = F03Sim.createConnector({store: F03Store});
              c.setNextRead('ready');
              const p = c.readCategories({readId: 1});
              c.setSource([{value: 'b', label: 'after'}]);
              c.settle('read');
              const r = await p;
              return {labels: r.items.map(i => i.label)};
            }""")
            defect = "after" in data["labels"]
        else:
            data = pg.evaluate("""async () => {
              const c = F03Sim.createConnector({categories: [{value: 'a', label: 'before'}]});
              c.setNextRead('ready');
              const p = c.readCategories({readId: 1});
              c.setSource([{value: 'b', label: 'after'}]);
              c.settle('read');
              const r = await p;
              return {labels: r.items.map(i => i.label)};
            }""")
            defect = "after" in data["labels"]
        self.rec("R1-03 نتيجة القراءة تستعمل مصدر وقت التسوية", defect, data)

    def p04_timer_ownership(self):
        """R1-04: مؤقت طلب قديم يحسم طلبًا أحدث → عيب."""
        pg = self.page
        data = pg.evaluate("""async () => {
          let c;
          if (window.F03Store) c = F03Sim.createConnector({store: F03Store});
          else c = F03Sim.createConnector({categories: [{value: 'a', label: 'A'}]});
          let first = null, second = null;
          c.readCategories({readId: 1}).then(r => { first = r; });
          await new Promise(r => setTimeout(r, 80));
          c.setNextRead('error');
          c.readCategories({readId: 2}).then(r => { second = r; });
          await new Promise(r => setTimeout(r, 800));
          return {firstSettled: c.calls[0].settled, first: first,
                  secondSettled: c.calls[1].settled, second: second};
        }""")
        # العيب: الأول لم يُحسم (علق بصمت) أو الثاني حُسم مبكرًا بمؤقت الأول
        defect = (not data["firstSettled"]) or (data["secondSettled"] and data["second"] is not None)
        self.rec("R1-04 مؤقت طلب قديم يحسم طلبًا أحدث أو يتركه معلقًا", defect, data)

    def p05_closed_context_read(self):
        """R1-05: رد منتقي مغلق يغير جلسة تعديل جديدة → عيب."""
        pg = self.page
        if is_new_composition(pg):
            self.open_edit_new("it-01")
            pg.evaluate("F03App.arm('read', 'empty')")
            pg.click("#f03-cat-trigger")
            pg.wait_for_function("F03App.inspect().pickerOpen === true")
            pg.wait_for_timeout(100)
            old_seq = pg.evaluate("F03App.inspect().readSeq")
            pg.click("#f03-cat-layer-close")
            pg.wait_for_timeout(450)
            pg.click("#f03-form-back")
            pg.wait_for_function("F03App.inspect().view === 'detail'")
            pg.click("#f03-detail-edit")
            pg.wait_for_function("F03App.inspect().view === 'form'")
            before = pg.evaluate("F03App.inspect()")
            pg.evaluate(f"F03App.deliverTestResponse('read', {{readId: {old_seq}, outcome: 'empty', items: []}})")
            pg.wait_for_timeout(200)
            after = pg.evaluate("F03App.inspect()")
            measured = {"before": {"cat": before["current"]["category"], "dirty": before["dirty"]},
                        "after": {"cat": after["current"]["category"], "dirty": after["dirty"]}}
            defect = (after["current"]["category"] != before["current"]["category"]
                      or after["dirty"] != before["dirty"])
            self.rec("R1-05 رد منتقي مغلق يغير فئة جلسة أحدث", defect, measured)
        else:
            self.open_edit_old()
            pg.evaluate("F03Example.arm('read', 'empty')")
            pg.click("#f03-cat-trigger")
            pg.wait_for_timeout(300)
            old_seq = pg.evaluate("F03Example.inspect().readSeq")
            pg.click("#f03-cat-layer-close")
            pg.wait_for_timeout(450)
            pg.click("#f03-back")  # رجوع clean
            pg.wait_for_function("document.getElementById('f03-edit-sheet').hidden === true")
            self.open_edit_old()
            before = pg.evaluate("F03Example.inspect()")
            pg.evaluate(f"F03Example.deliverTestResponse('read', {{readId: {old_seq}, outcome: 'empty', items: []}})")
            pg.wait_for_timeout(200)
            after = pg.evaluate("F03Example.inspect()")
            measured = {"before": {"cat": before["draftCategory"] and before["draftCategory"]["value"], "dirty": before["dirty"]},
                        "after": {"cat": after["draftCategory"] and after["draftCategory"]["value"], "dirty": after["dirty"]}}
            defect = (after["draftCategory"] != before["draftCategory"] or after["dirty"] != before["dirty"])
            self.rec("R1-05 رد منتقي مغلق يغير فئة جلسة أحدث", defect, measured)

    def p06_success_note_timing(self):
        """R1-06: كتابة النجاح داخل نطاق معزول (inert) قبل إتاحة السياق → عيب."""
        pg = self.page
        if is_new_composition(pg):
            self.open_edit_new("it-04")
            pg.fill("#f03-name", "تعديل توقيت النجاح")
            pg.evaluate("""() => {
              window.__noteWrites = [];
              const n = document.getElementById('f03-detail-note');
              new MutationObserver(() => window.__noteWrites.push({
                text: n.innerText, hidden: n.hidden,
                inert: !!n.closest('[inert]'), detailShown: !document.getElementById('view-detail').hidden
              })).observe(n, {subtree: true, childList: true, characterData: true, attributes: true});
            }""")
            pg.click("#f03-save")
            pg.wait_for_function("F03App.inspect().view === 'detail' && F03App.inspect().detailNote !== null")
            pg.wait_for_timeout(150)
            writes = pg.evaluate("window.__noteWrites")
            # العيب: أي كتابة والسياق غير متاح (مخفي أو معزول)
            defect = any((w["hidden"] or w["inert"] or not w["detailShown"]) for w in writes)
            self.rec("R1-06 كتابة النجاح خارج النطاق المتاح أو أكثر من مرة", defect,
                     {"writes": writes[:6]})
        else:
            # بداية نظيفة (التركيب القديم بلا تخزين — إعادة تحميل تعزل الخطوة السابقة)
            pg.goto(self.url)
            pg.wait_for_function("!!window.F03Example")
            pg.wait_for_timeout(200)
            self.open_edit_old()
            pg.fill("#f03-name", "تعديل توقيت النجاح")
            pg.evaluate("""() => {
              window.__noteWrites = [];
              const n = document.getElementById('f03-view-note');
              new MutationObserver(() => window.__noteWrites.push({
                text: n.innerText, hidden: n.hidden,
                inert: !!n.closest('[inert]'), sheetHidden: document.getElementById('f03-edit-sheet').hidden
              })).observe(n, {subtree: true, childList: true, characterData: true, attributes: true});
            }""")
            pg.click("#f03-save")
            pg.wait_for_function("document.getElementById('f03-edit-sheet').hidden === true")
            pg.wait_for_timeout(150)
            writes = pg.evaluate("window.__noteWrites")
            defect = any((w["hidden"] or w["inert"] or not w["sheetHidden"]) for w in writes)
            self.rec("R1-06 كتابة النجاح خارج النطاق المتاح أو أكثر من مرة", defect,
                     {"writes": writes[:6]})

    def p07_manual_settle_reachable(self):
        """R1-07: المحاكاة اليدوية تعلق المستخدم (زر الإنهاء معزول inert) → عيب."""
        pg = self.page
        if is_new_composition(pg):
            # تسليح بالنقر من وضع المراجعة، ثم حفظ معلق، ثم الإنهاء بالنقر حصرًا
            pg.click("#f03-review-open")
            pg.wait_for_function("F03App.inspect().reviewOpen === true")
            pg.select_option("#f03-rev-save-outcome", "not-saved")
            pg.click("#f03-review-close")
            pg.wait_for_timeout(450)
            self.open_edit_new("it-01")
            pg.fill("#f03-name", "سيناريو الوصول اليدوي")
            pg.click("#f03-save")
            pg.wait_for_timeout(200)
            pending = pg.evaluate("F03App.inspect().sim.pendingSave")
            pg.evaluate("window.__els = document.elementFromPoint ? 1 : 1")
            pg.evaluate("document.querySelector('#f03-review-open').scrollIntoView({block: 'center'})")
            pg.wait_for_timeout(100)
            pg.click("#f03-review-open")
            pg.wait_for_function("F03App.inspect().reviewOpen === true")
            btn = pg.evaluate("""() => {
              const b = document.getElementById('f03-rev-settle-save');
              return {disabled: b.disabled, inert: !!b.closest('[inert]'), h: Math.round(b.getBoundingClientRect().height)};
            }""")
            pg.click("#f03-rev-settle-save")
            pg.wait_for_timeout(250)
            op = pg.evaluate("F03App.inspect().op")
            # العيب: معلق بلا وصول أو الزر معزول/معطل أو الإنهاء لم يأثر
            defect = (not pending) or btn["inert"] or btn["disabled"] or op != "failed"
            self.rec("R1-07 الإنهاء اليدوي غير قابل للوصول من الهاتف", defect,
                     {"pending": pending, "btn": btn, "opAfterSettle": op})
            pg.screenshot(path=str(OUT / "probe-r1-07-settle-reached.png"))
        else:
            pg.select_option("#f03-sim-save-outcome", "not-saved")
            self.open_edit_old()
            pg.fill("#f03-name", "سيناريو معلق يدويًا")
            pg.click("#f03-save")
            pg.wait_for_timeout(900)
            btn = pg.evaluate("""() => {
              const b = document.getElementById('f03-sim-settle-save');
              return {disabled: b.disabled, inert: !!b.closest('[inert]'),
                      op: F03Example.inspect().op, pending: F03Example.inspect().sim.pendingSave};
            }""")
            # العيب المثبت في المراجعة: العملية معلقة والزر معزول inert خلف اللوحة
            defect = btn["pending"] and (btn["inert"] or btn["op"] == "saving")
            self.rec("R1-07 الإنهاء اليدوي غير قابل للوصول من الهاتف", defect, btn)
            pg.screenshot(path=str(OUT / "probe-r1-07-old-blocked.png"))


def run_probes(root: Path, out: Path) -> dict:
    out.mkdir(parents=True, exist_ok=True)
    result = {"root": str(root), "commit": git_head(root), "checks": []}

    class Handler(SimpleHTTPRequestHandler):
        def log_message(self, *a):  # noqa: N802
            pass

    handler = functools.partial(Handler, directory=str(root))
    srv = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = srv.server_address[1]
    url = f"http://127.0.0.1:{port}/{SAMPLE_REL}/index.html"
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
            page = browser.new_page(viewport=VIEW)
            page.on("pageerror", lambda e: result.setdefault("page_errors", []).append(str(e)))
            runner = ProbeRunner(page)
            runner.url = url
            runner.p01_default_ui_clean()
            runner.p02_chevron_fill()
            runner.p03_read_snapshot()
            runner.p04_timer_ownership()
            runner.p05_closed_context_read()
            runner.p06_success_note_timing()
            runner.p07_manual_settle_reachable()
            result["checks"] = runner.results
            browser.close()
    finally:
        srv.shutdown()

    result["summary"] = {
        "defects_found": sum(1 for c in result["checks"] if c["defect_found"]),
        "total": len(result["checks"]),
    }
    (out / "probes.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return result


import functools  # noqa: E402

if __name__ == "__main__":
    res = run_probes(ROOT, OUT)
    print(json.dumps(res["summary"], ensure_ascii=False))
    for c in res["checks"]:
        print(f"  {'DEFECT' if c['defect_found'] else 'OK    '} {c['name']}")
