#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""A5 المستقل — فحص SUI-R1-02 (إعادة إلحاق peek/carousel بعد disconnect).

أسلوب الوكيل 5 (مختلف عن أدوات المنفذين):
  * حاضنة خاصة بخمس بطاقات لكل مكوّن، فهرس عميق (peek=2، carousel=3).
  * تغليف ResizeObserver قبل تحميل السكربتات وعدّ «المراقبين النشطين
    على عنصر viewport بعينه» عبر تتبّع أهداف كل نسخة مغلّفة.
  * 4 دورات disconnect→init مع تغيّر عرض الأب 320→360→400→360→320 دون
    أي window-resize (الرصد فقط عبر RO).
  * إخفاء→disconnect→init وهي مخفية→كشف؛ نبضة rAF معلقة تُلغى؛
    next بعد الدورات = خطوة واحدة + نقاط ثابتة؛ RTL وLTR؛
    والملف المستقل عبر file:// (دورة peek في وجهة التقارير).

الإخراج: reattach/reattach-a5.json + لقطات. الخروج غير الصفري عند أي فشل.
NOT RUN: أجهزة/لمس/TalkBack/WebKit — قياس DOM في Chromium headless.
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
HARNESS = f"http://127.0.0.1:{PORT}/reviews/SAMSUNG-ONEUI-REPAIR-R2/evidence/agent5/reattach/reattach-harness.html"
STANDALONE = str(ROOT / "previews/ux-patterns/mobile-record-sample/standalone.html")
CYCLE_WIDTHS = [360, 400, 360, 320]

RO_WRAP = """
window.__roAudit = { built: 0, instances: [] };
(function () {
  const Native = window.ResizeObserver;
  function Wrapped(cb) {
    const native = new Native(cb);
    const self = {
      __targets: [],
      observe(t) { if (t && !self.__targets.includes(t)) self.__targets.push(t); return native.observe(t); },
      unobserve(t) { self.__targets = self.__targets.filter(x => x !== t); return native.unobserve(t); },
      disconnect() { self.__targets = []; return native.disconnect(); }
    };
    window.__roAudit.built += 1;
    window.__roAudit.instances.push(self);
    return self;
  }
  window.ResizeObserver = Wrapped;
})();
"""


def serve():
    handler = lambda *a, **k: SimpleHTTPRequestHandler(*a, directory=str(ROOT), **k)
    httpd = ThreadingHTTPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


EDGES_JS = """(sel) => {
  const strip = document.querySelector(sel);
  const vp = strip.querySelector('[data-info-strip-viewport], [data-viewport]');
  const slides = strip.querySelectorAll('.m-info-strip__slide, [data-carousel-slide]');
  const st = window.__idxOf ? null : null;
  const idx = (window.MicroInfoPeek && strip.hasAttribute('data-info-peek'))
    ? window.MicroInfoPeek.getIndex(strip)
    : window.MicroCarousel.getIndex(strip);
  const active = slides[idx];
  if (!active) return { error: 'no-active' };
  const vr = vp.getBoundingClientRect(), ar = active.getBoundingClientRect();
  const track = strip.querySelector('[data-info-strip-track], [data-track]');
  return { idx, left: ar.left - vr.left, right: vr.right - ar.right,
           transform: track ? track.style.transform : null,
           slideCount: slides.length,
           pages: strip.querySelectorAll('[data-info-strip-page], [data-dot], .m-carousel__dots button').length };
}"""


def active_observers_on(pg, selector):
    return pg.evaluate("""sel => {
        const el = document.querySelector(sel);
        return window.__roAudit.instances.filter(i => i.__targets.includes(el)).length;
    }""", selector)


def wait_settle(pg, ms=320):
    pg.wait_for_timeout(ms)


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

        for direction in ["rtl", "ltr"]:
            suffix = "" if direction == "rtl" else f"-{direction}"
            pg = browser.new_page(viewport={"width": 480, "height": 900})
            pg.add_init_script(RO_WRAP)
            pg.goto(HARNESS + ("" if direction == "rtl" else "?dir=ltr"))
            wait_settle(pg, 400)

            for comp, root_sel, api, idx0 in [("peek", "#peek1", "MicroInfoPeek", 2),
                                              ("carousel", "#car1", "MicroCarousel", 3)]:
                pg.evaluate(f"{api}.goTo(document.querySelector('{root_sel}'), {idx0})")
                wait_settle(pg, 200)
                vp_sel = f"{root_sel} [data-info-strip-viewport], {root_sel} [data-viewport]"

                # ---- (a) 4 دورات disconnect→init مع عرض أب متغير بلا window-resize ----
                cycle_data = []
                for w in CYCLE_WIDTHS:
                    pg.evaluate(f"""() => {{
                        const root = document.querySelector('{root_sel}');
                        window.{api}.disconnect(root);
                        window.{api}.init(root);
                        document.getElementById('{"wrap-peek" if comp == "peek" else "wrap-car"}').style.width = '{w}px';
                    }}""")
                    wait_settle(pg)
                    m = pg.evaluate(EDGES_JS, root_sel)
                    cycle_data.append({"width": w, "edges": [round(m["left"], 2), round(m["right"], 2)],
                                       "idx": m["idx"], "transform": m["transform"]})
                centered = all(abs(c["edges"][0] - c["edges"][1]) <= 1 for c in cycle_data)
                idx_kept = all(c["idx"] == idx0 for c in cycle_data)
                check(f"a-{comp}-{direction}", f"4 دورات disconnect→init (320→360→400→360→320) توسيط ±1px وفهرس محفوظ",
                      centered and idx_kept, cycle_data)

                # ---- (e) مراقب نشط واحد بالضبط ----
                n_obs = active_observers_on(pg, vp_sel)
                built = pg.evaluate("() => window.__roAudit.built")
                check(f"e-{comp}-{direction}", "مراقب نشط واحد بالضبط على viewport (بعد 4 دورات)",
                      n_obs == 1, {"activeOnViewport": n_obs, "roBuiltTotal": built})

                # ---- (d) next بعد الدورات = خطوة واحدة + نقاط ثابتة ----
                ev_before = pg.evaluate(f"() => window.__{'peek' if comp == 'peek' else 'car'}Events")
                pg.evaluate(f"{api}.next(document.querySelector('{root_sel}'))")
                wait_settle(pg, 150)
                m_after = pg.evaluate(EDGES_JS, root_sel)
                ev_after = pg.evaluate(f"() => window.__{'peek' if comp == 'peek' else 'car'}Events")
                dots = pg.evaluate(f"""() => document.querySelector('{root_sel}')
                    .querySelectorAll('[data-info-strip-page], .m-carousel__dots button').length""")
                single = (m_after["idx"] == idx0 + 1) and (ev_after - ev_before == 1)
                check(f"d-{comp}-{direction}", "next بعد الدورات = خطوة واحدة (فهرس+حدث) والنقاط ثابتة",
                      single and dots == 5 and m_after["slideCount"] == 5,
                      {"idxAfterNext": m_after["idx"], "eventsDelta": ev_after - ev_before, "dots": dots})

            # ---- (b) disconnect أثناء إخفاء ثم init وهي مخفية ثم كشف ----
            if direction == "rtl":
                pg.evaluate("""() => {
                    const hv = document.getElementById('a5-hidden');
                    hv.style.display = 'block';
                }""")
                wait_settle(pg, 300)
                pg.evaluate("MicroInfoPeek.goTo(document.querySelector('#peek-hidden'), 1)")
                wait_settle(pg, 150)
                before = pg.evaluate(EDGES_JS, "#peek-hidden")
                pg.evaluate("""() => {
                    document.getElementById('a5-hidden').style.display = 'none';
                }""")
                pg.wait_for_timeout(80)
                pg.evaluate("""() => {
                    const root = document.querySelector('#peek-hidden');
                    window.MicroInfoPeek.disconnect(root);
                    window.MicroInfoPeek.init(root);   // وهي مخفية
                }""")
                pg.evaluate("document.getElementById('a5-hidden').style.display = 'block'")
                wait_settle(pg, 350)
                after = pg.evaluate(EDGES_JS, "#peek-hidden")
                check("b-peek-hidden", "disconnect أثناء الإخفاء → init مخفية → كشف: يتمركز والفهرس محفوظ",
                      abs(after["left"] - after["right"]) <= 1 and after["idx"] == 1,
                      {"before": [round(before["left"], 2), round(before["right"], 2)],
                       "afterReveal": [round(after["left"], 2), round(after["right"], 2)], "idx": after["idx"]})
                n_obs_h = active_observers_on(pg, "#peek-hidden [data-info-strip-viewport]")
                check("b-peek-observer", "مراقب نشط واحد على الشريط المخفي بعد الكشف", n_obs_h == 1, {"active": n_obs_h})
                pg.screenshot(path=str(HERE / f"reattach-hidden-reveal{suffix}.png"), full_page=True)

            # ---- (c) disconnect أثناء rAF معلق — لا نبضة فاسدة ----
            for comp, root_sel, api in [("peek", "#peek1", "MicroInfoPeek"),
                                        ("carousel", "#car1", "MicroCarousel")]:
                wrap_id = "wrap-peek" if comp == "peek" else "wrap-car"
                # نعيد الوضع المعروف: دورة واحدة لإعادة الإلحاق ثم عرض 320
                pg.evaluate(f"""() => {{
                    document.getElementById('{wrap_id}').style.width = '320px';
                }}""")
                wait_settle(pg, 250)
                t0 = pg.evaluate(EDGES_JS, root_sel)["transform"]
                pg.evaluate(f"""() => {{
                    // نبضة rAF مجدولة الآن (تغيير العرض + حدث resize) ثم فصل في المهمة نفسها
                    document.getElementById('{wrap_id}').style.width = '400px';
                    window.dispatchEvent(new Event('resize'));
                    window.{api}.disconnect(document.querySelector('{root_sel}'));
                }}""")
                pg.wait_for_timeout(400)   # إطارات كافية لنفي النبضة
                t1 = pg.evaluate(EDGES_JS, root_sel)["transform"]
                check(f"c-{comp}-{direction}", "disconnect أثناء rAF معلق → لا نبضة بعد الفصل (transform ثابت)",
                      t1 == t0, {"before": t0, "after": t1})
            pg.close()

        # ---- (g) standalone عبر file:// — دورة peek في وجهة التقارير ----
        pg = browser.new_page(viewport={"width": 360, "height": 800})
        pg.add_init_script(RO_WRAP)
        pg.goto("file://" + STANDALONE)
        pg.wait_for_timeout(400)
        entered = pg.evaluate("() => { const b = document.getElementById('f03-gw-demo'); if (b && !b.hidden) { b.click(); return true; } return false; }")
        pg.wait_for_timeout(300)
        pg.evaluate("() => document.getElementById('f03-nav-reports').click()")
        pg.wait_for_timeout(400)
        base = pg.evaluate(EDGES_JS, "#f03-rep-strip")
        pg.evaluate("""() => {
            const root = document.querySelector('#f03-rep-strip');
            window.MicroInfoPeek.goTo(root, 1);
        }""")
        wait_settle(pg, 700)   # مهلة أطول من انتقال التمركز (قياس بعد الاستقرار لا في منتصف الانتقال)
        pre = pg.evaluate(EDGES_JS, "#f03-rep-strip")
        pg.evaluate("""() => {
            const root = document.querySelector('#f03-rep-strip');
            window.MicroInfoPeek.disconnect(root);
            window.MicroInfoPeek.init(root);
        }""")
        wait_settle(pg, 300)
        post = pg.evaluate(EDGES_JS, "#f03-rep-strip")
        n_obs_st = active_observers_on(pg, "#f03-rep-strip [data-info-strip-viewport]")
        check("g-standalone", "file:// standalone: دورة peek في التقارير — توسيط ±1px وفهرس محفوظ",
              entered and abs(pre["left"] - pre["right"]) <= 1 and abs(post["left"] - post["right"]) <= 1
              and post["idx"] == pre["idx"] == 1,
              {"entered": entered, "pre": [round(pre["left"], 2), round(pre["right"], 2)],
               "post": [round(post["left"], 2), round(post["right"], 2)], "idx": post["idx"]})
        check("g-standalone-observer", "standalone: مراقب نشط واحد على شريط التقارير بعد الدورة", n_obs_st == 1,
              {"active": n_obs_st})
        pg.screenshot(path=str(HERE / "reattach-standalone-reports.png"), full_page=True)
        pg.close()

        browser.close()

    out = {"tool": "agent5 reattach probe (SUI-R1-02)", "harness": HARNESS, "standalone": STANDALONE,
           "cycle_widths": CYCLE_WIDTHS, "checks": results,
           "summary": {"pass": sum(1 for r in results if r["pass"]), "total": len(results)}}
    (HERE / "reattach-a5.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"reattach: {out['summary']['pass']}/{out['summary']['total']}")
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
