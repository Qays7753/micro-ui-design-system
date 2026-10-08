#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A5 المستقل — فحص SUI-R1-04 (احتواء navbar) على تجربة F03.

آلية التضخيم الثانية (TOKX2 — من إعلان الوكيل 5، وليست ZOOM2 المنفذ):
  مضاعفة متغيرات الخط الجذرية --micro-*-size/-line مرة واحدة على <html>
  عبر inline style — الشلال وvar() يقومان بالعمل، بلا قراءة مقاسات
  محسوبة لكل عنصر وبلا أنماط لكل عنصر (مسار مختلف جذريًا عن ZOOM2).
  تشمل التوكنات المقاسة من أوراق الصفحة نفسها (حتى المدمجة في standalone).

المصفوفة: 320/360/390/430 × 100%/200%(TOKX2) × RTL/LTR ×
  (المصدر http بعد الدخول بالمزوّد + standalone عبر file://):
  لكل زر: getBoundingClientRect داخل الشاشة + حدود حروف النص بـRange
  على العقدة النصية (داخل الشاشة وداخل الزر = لا قص تسمية) + صفر تداخل
  + ارتفاع ≥47.5px. وعند 320+200%: صفوف ≥2 و--f03-navbar-h يطابق
  الارتفاع المقيس ±1px.
  + (c) توست فوق navbar بلا تراكب (حذف بتأكيد).
  + (d) شريط التحديد عند scroll0+200%: صفر تراكب مع navbar وزر الحذف
  مرئي؛ وعند تمرير 300 يعود sticky بنفس الموضع ±1px (لا قفزة).

الإخراج: navbar/navbar-a5.json + لقطات. الخروج غير الصفري عند أي فشل.
NOT RUN: أجهزة/لمس/TalkBack/WebKit/native zoom — القياس DOM في Chromium headless.
"""
import json
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
PORT = 4481
HTTP_PAGE = f"http://127.0.0.1:{PORT}/previews/ux-patterns/mobile-record-sample/index.html"
FILE_PAGE = (ROOT / "previews/ux-patterns/mobile-record-sample/standalone.html").resolve().as_uri()
WIDTHS = [320, 360, 390, 430]
NAV_IDS = ["f03-nav-home", "f03-nav-list", "f03-nav-reports", "f03-nav-account"]

COLLECT_TOKENS = """() => {
  const seen = new Map();
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
    for (const rule of rules) {
      if (!rule.style) continue;
      for (let i = 0; i < rule.style.length; i++) {
        const p = rule.style[i];
        if (/^--micro-.*-(size|line)$/.test(p) && !seen.has(p)) {
          const v = rule.style.getPropertyValue(p).trim();
          const m = v.match(/^([\\d.]+)px/);
          if (m) seen.set(p, parseFloat(m[1]));
        }
      }
    }
  }
  return [...seen.entries()];
}"""

TOKX2_ON = """(props) => {
  props.forEach(([p, n]) => document.documentElement.style.setProperty(p, (n * 2) + 'px'));
  return props.length;
}"""

TOKX2_OFF = """(props) => {
  props.forEach(([p]) => document.documentElement.style.removeProperty(p));
  return true;
}"""

MEASURE_NAV = """() => {
  const vw = document.documentElement.clientWidth;
  const nav = document.getElementById('f03-navbar');
  const navRect = nav.getBoundingClientRect();
  const rowsSet = new Set();
  const buttons = [];
  for (const id of ['f03-nav-home', 'f03-nav-list', 'f03-nav-reports', 'f03-nav-account']) {
    const b = document.getElementById(id);
    const r = b.getBoundingClientRect();
    rowsSet.add(Math.round(r.top));
    // حدود حروف التسمية: Range على العقدة النصية (النص مباشرة داخل الزر بعد svg)
    let text = null;
    for (const node of b.childNodes) {
      if (node.nodeType === 3 && node.textContent.trim() !== '') { text = node; break; }
    }
    let tr = null, label = null;
    if (text) {
      label = text.textContent.trim();
      const range = document.createRange();
      range.selectNodeContents(text);
      const rects = range.getClientRects();
      if (rects.length) {
        let L = Infinity, R = -Infinity, T = Infinity, B = -Infinity;
        for (const cr of rects) { L = Math.min(L, cr.left); R = Math.max(R, cr.right); T = Math.min(T, cr.top); B = Math.max(B, cr.bottom); }
        tr = { left: L, right: R, top: T, bottom: B };
      }
    }
    buttons.push({ id, rect: { left: r.left, right: r.right, top: r.top, bottom: r.bottom, height: r.height }, textRect: tr, label });
  }
  let overlap = 0;
  for (let i = 0; i < buttons.length; i++) {
    for (let j = i + 1; j < buttons.length; j++) {
      const a = buttons[i].rect, b = buttons[j].rect;
      const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (w > 0.5 && h > 0.5) overlap = Math.max(overlap, w * h);
    }
  }
  const varH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--f03-navbar-h'));
  return { vw, navRect: { top: navRect.top, height: navRect.height }, buttons, rows: rowsSet.size, overlap, varH };
}"""


def serve():
    handler = lambda *a, **k: SimpleHTTPRequestHandler(*a, directory=str(ROOT), **k)
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def run():
    results = []
    ok_all = True

    def check(cid, label, ok, detail=None):
        nonlocal ok_all
        results.append({"id": cid, "label": label, "pass": bool(ok), "detail": detail})
        if not ok:
            ok_all = False

    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=CHROMIUM, headless=True)
        matrix_rows = []

        for source, url in [("src", HTTP_PAGE), ("standalone", FILE_PAGE)]:
            for direction in ["rtl", "ltr"]:
                pg = browser.new_page(viewport={"width": 320, "height": 844})
                pg.goto(url)
                pg.wait_for_timeout(400)
                pg.evaluate("() => { const b = document.getElementById('f03-gw-demo'); if (b && !b.hidden) b.click(); }")
                pg.wait_for_timeout(400)
                pg.evaluate(f"() => document.documentElement.setAttribute('dir', '{direction}')")
                tokens = pg.evaluate(COLLECT_TOKENS)
                check(f"tokens-{source}-{direction}", f"TOKX2: توكنات الخط تُجمع من الصفحة ({source}/{direction})",
                      len(tokens) >= 10, {"count": len(tokens)})

                for width in WIDTHS:
                    pg.set_viewport_size({"width": width, "height": 844})
                    pg.wait_for_timeout(250)
                    for zoom in [1, 2]:
                        if zoom == 2:
                            pg.evaluate(TOKX2_ON, tokens)
                            pg.wait_for_timeout(350)
                        m = pg.evaluate(MEASURE_NAV)
                        vw = m["vw"]
                        combo = {"source": source, "dir": direction, "width": width, "zoom": zoom,
                                 "rows": m["rows"], "varH": m["varH"], "navH": round(m["navRect"]["height"], 2),
                                 "buttons": []}
                        combo_ok = True
                        for b in m["buttons"]:
                            r, tr = b["rect"], b["textRect"]
                            inside = r["left"] >= -0.5 and r["right"] <= vw + 0.5
                            h_ok = r["height"] >= 47.5
                            txt_inside = tr is not None and tr["left"] >= -0.5 and tr["right"] <= vw + 0.5
                            txt_in_btn = tr is not None and tr["left"] >= r["left"] - 0.5 and tr["right"] <= r["right"] + 0.5
                            if not (inside and h_ok and txt_inside and txt_in_btn and m["overlap"] <= 0.01):
                                combo_ok = False
                            combo["buttons"].append({"id": b["id"], "rect": [round(r["left"], 2), round(r["right"], 2)],
                                                     "h": round(r["height"], 2),
                                                     "text": [round(tr["left"], 2), round(tr["right"], 2)] if tr else None,
                                                     "label": b["label"]})
                        matrix_rows.append(combo)
                        check(f"m-{source}-{direction}-{width}-z{zoom}",
                              f"{source}/{direction}/{width}px/{zoom}×: الأزرار والنصوص داخل الشاشة بلا تداخل وارتفاع ≥47.5",
                              combo_ok and m["overlap"] <= 0.01,
                              {"overlap": m["overlap"], "rows": m["rows"], "buttons": combo["buttons"]})

                        if width == 320 and zoom == 2:
                            check(f"b-rows-{source}-{direction}", f"320+200% ({source}/{direction}): صفوف ≥2 و--f03-navbar-h يطابق ±1px",
                                  m["rows"] >= 2 and abs(m["varH"] - m["navRect"]["height"]) <= 1,
                                  {"rows": m["rows"], "varH": m["varH"], "measuredH": m["navRect"]["height"]})
                            pg.screenshot(path=str(HERE / f"navbar-320-z200-{source}-{direction}.png"))

                        if zoom == 2:
                            pg.evaluate(TOKX2_OFF, tokens)
                            pg.wait_for_timeout(150)

                # ---- (c)+(d) عند 320+200% TOKX2 في وجهة القائمة ----
                pg.set_viewport_size({"width": 320, "height": 844})
                pg.evaluate("() => document.getElementById('f03-nav-list').click()")
                pg.wait_for_timeout(300)
                pg.evaluate("() => document.getElementById('f03-select-toggle').click()")
                pg.wait_for_timeout(200)
                pg.evaluate("""() => {
                    const row = document.querySelector('#f03-list-rows .f03-row');
                    if (row) row.click();
                }""")
                pg.wait_for_timeout(200)
                pg.evaluate(TOKX2_ON, tokens)
                pg.wait_for_timeout(400)
                pg.evaluate("() => window.scrollTo(0, 0)")
                pg.wait_for_timeout(250)

                # (d) scroll0: صفر تراكب + زر الحذف مرئي
                d0 = pg.evaluate("""() => {
                    const bar = document.getElementById('f03-select-bar');
                    const nav = document.getElementById('f03-navbar');
                    const del = document.getElementById('f03-select-delete');
                    const br = bar.getBoundingClientRect(), nr = nav.getBoundingClientRect(), dr = del.getBoundingClientRect();
                    const vw = document.documentElement.clientWidth;
                    const overlapH = Math.min(br.bottom, nr.bottom) - Math.max(br.top, nr.top);
                    const overlapW = Math.min(br.right, nr.right) - Math.max(br.left, nr.left);
                    return { fixed: bar.classList.contains('f03-selectbar-fixed'), bar: [br.left, br.right, br.top, br.bottom],
                             navTop: nr.top, overlap: (overlapH > 0 && overlapW > 0) ? overlapH : 0,
                             del: [dr.left, dr.right, dr.top, dr.bottom, dr.height], vw,
                             delVisible: dr.top >= 0 && dr.bottom <= window.innerHeight && dr.width > 0 && dr.height > 0 && !del.hidden };
                }""")
                check(f"d-scroll0-{source}-{direction}", "scroll0+200%: صفر تراكب مع navbar وزر الحذف مرئي",
                      d0["overlap"] <= 0.01 and d0["delVisible"],
                      {"fixedClass": d0["fixed"], "overlap": d0["overlap"], "del": d0["del"], "bar": d0["bar"]})
                pg.screenshot(path=str(HERE / f"selectbar-scroll0-320-z200-{source}-{direction}.png"))

                # (d) تمرير 300: يعود sticky بنفس الموضع ±1px
                pg.evaluate("() => window.scrollTo(0, 300)")
                pg.wait_for_timeout(300)
                d300 = pg.evaluate("""() => {
                    const bar = document.getElementById('f03-select-bar');
                    const nav = document.getElementById('f03-navbar');
                    const br = bar.getBoundingClientRect(), nr = nav.getBoundingClientRect();
                    const overlapH = Math.min(br.bottom, nr.bottom) - Math.max(br.top, nr.top);
                    const overlapW = Math.min(br.right, nr.right) - Math.max(br.left, nr.left);
                    return { fixed: bar.classList.contains('f03-selectbar-fixed'), bar: [br.left, br.right, br.top, br.bottom],
                             navTop: nr.top, overlap: (overlapH > 0 && overlapW > 0) ? overlapH : 0,
                             scrollY: window.scrollY };
                }""")
                jump = abs(d300["bar"][3] - d0["bar"][3])
                check(f"d-scroll300-{source}-{direction}", "scroll300: sticky يعود بنفس موضع أسفل الشريط ±1px (لا قفزة) وصفر تراكب",
                      jump <= 1 and d300["overlap"] <= 0.01,
                      {"bottomAt0": d0["bar"][3], "bottomAt300": d300["bar"][3], "jump": round(jump, 2),
                       "fixedClass": d300["fixed"], "overlap": d300["overlap"], "scrollY": d300["scrollY"]})
                pg.screenshot(path=str(HERE / f"selectbar-scroll300-320-z200-{source}-{direction}.png"))

                # (c) حذف بتأكيد → توست فوق navbar بلا تراكب
                pg.evaluate("() => window.scrollTo(0, 0)")
                pg.wait_for_timeout(200)
                pg.evaluate("() => document.getElementById('f03-select-delete').click()")
                pg.wait_for_timeout(300)
                pg.evaluate("() => document.getElementById('f03-delete-confirm').click()")
                pg.wait_for_timeout(350)
                c1 = pg.evaluate("""() => {
                    const t = document.getElementById('f03-toast');
                    const nav = document.getElementById('f03-navbar');
                    const tr = t.getBoundingClientRect(), nr = nav.getBoundingClientRect();
                    const overlapH = Math.min(tr.bottom, nr.bottom) - Math.max(tr.top, nr.top);
                    const overlapW = Math.min(tr.right, nr.right) - Math.max(tr.left, nr.left);
                    const vw = document.documentElement.clientWidth;
                    return { hidden: t.hidden, text: document.getElementById('f03-toast-text').textContent,
                             toast: [tr.left, tr.right, tr.top, tr.bottom],
                             gap: nr.top - tr.bottom, overlap: (overlapH > 0 && overlapW > 0) ? overlapH : 0, vw,
                             insideVw: tr.left >= -0.5 && tr.right <= vw + 0.5 };
                }""")
                check(f"c-toast-{source}-{direction}", "توست الحذف فوق navbar: ظاهر، صفر تراكب، فجوة ≥0، داخل العرض",
                      (not c1["hidden"]) and c1["overlap"] <= 0.01 and c1["gap"] >= -0.5 and c1["insideVw"],
                      {"toast": c1["toast"], "gap": round(c1["gap"], 2), "overlap": c1["overlap"], "text": c1["text"]})
                pg.screenshot(path=str(HERE / f"toast-above-navbar-320-z200-{source}-{direction}.png"))

                pg.evaluate(TOKX2_OFF, tokens)
                pg.close()

        browser.close()

    (HERE / "navbar-matrix.json").write_text(json.dumps(matrix_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    out = {"tool": "agent5 navbar probe (SUI-R1-04) — TOKX2", "http": HTTP_PAGE, "file": FILE_PAGE,
           "zoom_mechanism": "TOKX2: مضاعفة متغيرات --micro-*-size/-line على <html> (شلال var) — ليست ZOOM2",
           "checks": results,
           "summary": {"pass": sum(1 for r in results if r["pass"]), "total": len(results)}}
    (HERE / "navbar-a5.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"navbar: {out['summary']['pass']}/{out['summary']['total']}")
    for r in results:
        print(f"  [{'PASS' if r['pass'] else 'FAIL'}] {r['id']}: {r['label']}")
        if not r["pass"]:
            print(f"         detail: {json.dumps(r['detail'], ensure_ascii=False)}")
    return 0 if ok_all else 1


if __name__ == "__main__":
    httpd = serve()
    try:
        sys.exit(run())
    finally:
        httpd.shutdown()
