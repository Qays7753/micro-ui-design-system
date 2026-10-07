#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SAMSUNG-ONEUI-REPAIR-R1 / الوكيل 4 — مسبر سريع لقياسات BEFORE
(تحقق من منهجية القياس قبل بناء أداة الفحص الكاملة sui-repair-a4-check.py).

يقيس: SUI-007 (peek في F03)، SUI-025 (carousel مخفي/مكشوف)، SUI-008 (m-stat)،
SUI-009 (mystery/حقن)، SUI-024 (جدول comparison)، SUI-017 (m-chart__title).
الإخراج: reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent4/checks/probe-before.json
"""
import json
import threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parents[5]
OUT = Path(__file__).resolve().parent.parent / "checks"
CHROME = "/home/z/my-project/evidence/bin/chromium"
TX = "e => { const t = getComputedStyle(e).transform; return t === 'none' ? 0 : new DOMMatrixReadOnly(t).m41; }"

results = {}


def serve():
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = ThreadingHTTPServer(("127.0.0.1", 4400), partial(H, directory=str(REPO)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{srv.server_address[1]}"


def peek_geo(page, sel):
    return page.evaluate("""(sel) => {
      const strip = document.querySelector(sel);
      const vp = strip.querySelector('[data-info-strip-viewport]');
      const slides = [...strip.querySelectorAll('.m-info-strip__slide')];
      const act = slides.find(s => s.getAttribute('aria-hidden') === 'false') || slides[0];
      const vr = vp.getBoundingClientRect(); const r = act.getBoundingClientRect();
      return { transform: (t => t === 'none' ? 0 : new DOMMatrixReadOnly(t).m41)(getComputedStyle(strip.querySelector('[data-info-strip-track]')).transform),
               vpW: Math.round(vr.width), slideW: Math.round(r.width),
               leftInset: Math.round(r.left - vr.left), rightInset: Math.round(vr.right - r.right),
               index: window.MicroInfoPeek ? window.MicroInfoPeek.getIndex(strip) : null };
    }""", sel)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    base = serve()
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROME, headless=True)

        # ---------- SUI-007: peek في F03 (دخول حقيقي) ----------
        ctx = browser.new_context(viewport={"width": 320, "height": 844})
        page = ctx.new_page()
        page.goto(base + "/previews/ux-patterns/mobile-record-sample/index.html")
        page.wait_for_load_state("networkidle")
        page.fill("#f03-gw-email", "demo@example.com")
        page.fill("#f03-gw-password", "secret123")
        page.click("#f03-gw-submit")
        page.wait_for_timeout(900)
        page.click("#f03-nav-reports")
        page.wait_for_timeout(900)
        before_inter = peek_geo(page, "#f03-rep-strip")
        page.screenshot(path=str(OUT.parent / "screenshots" / "probe-before-sui007-f03-320.png"))
        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('f03-rep-strip'), window.MicroInfoPeek.getIndex(document.getElementById('f03-rep-strip')))")
        page.wait_for_timeout(400)
        after_inter = peek_geo(page, "#f03-rep-strip")
        results["SUI-007_F03_320"] = {"before_first_interaction": before_inter, "after_first_goTo": after_inter,
                                      "delta_transform": after_inter["transform"] - before_inter["transform"]}

        # SUI-017 جزء data: m-chart__title في F03
        results["SUI-017_F03_title"] = page.evaluate(
            "() => { const t = document.querySelector('#f03-rep-bars .m-chart__title');"
            " const cs = getComputedStyle(t); return {fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight}; }")
        # SUI-009: F03 — الوجهة الفرعية للجدولة (المسار الافتراضي)
        page.click("#f03-nav-home")
        page.wait_for_timeout(400)
        page.click("#f03-home-schedule")
        page.wait_for_timeout(900)
        results["SUI-009_F03_schedule"] = page.evaluate("""() => {
          const legend = document.querySelector('#f03-ocal [data-ocal-legend]');
          const rows = [...document.querySelectorAll('#f03-ocal .m-ocal__row')].map(r => r.getAttribute('data-ocal-id'));
          const bodyText = document.body.innerText || '';
          return { legendText: legend ? legend.textContent : null,
                   mysteryInDom: bodyText.indexOf('mystery') >= 0,
                   hasOd10: rows.indexOf('od-10') >= 0, hasOdInj: rows.indexOf('od-inj') >= 0,
                   rowCount: rows.length,
                   literalB: document.querySelector('#f03-ocal .m-ocal__row-title') ? null : null,
                   storeCount: window.OrderDemoStore.count() };
        }""")
        page.screenshot(path=str(OUT.parent / "screenshots" / "probe-before-sui009-f03-320.png"))
        ctx.close()

        # ---------- SUI-007: عزل hidden→reveal عبر set_content ----------
        ctx = browser.new_context(viewport={"width": 320, "height": 844})
        page = ctx.new_page()
        head = ('<html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
                f'<base href="{base}/">'
                '<link rel="stylesheet" href="shared/tokens.css">'
                '<link rel="stylesheet" href="components/info-strip/info-strip.css">'
                '<link rel="stylesheet" href="components/info-strip/info-strip-peek.css">'
                '<script src="components/info-strip/info-strip-peek.js"></script></head><body>')
        slides = "".join(
            f'<div class="m-info-strip__slide"><article class="m-info-card">'
            f'<span class="m-info-card__label">بطاقة {i + 1}</span>'
            f'<div class="m-info-card__reading"><span class="m-info-card__number">{(i + 1) * 12}</span>'
            f'<span class="m-info-card__unit">وحدة</span></div></article></div>'
            for i in range(4))
        page.set_content(head + f'<section id="hv" hidden>'
                                 f'<div class="m-info-strip m-info-peek" data-info-strip data-info-peek id="t-peek">'
                                 f'<div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0" aria-label="عارض">'
                                 f'<div class="m-info-strip__track" data-info-strip-track>{slides}</div></div>'
                                 f'<div class="m-info-strip__controls" data-info-strip-controls>'
                                 f'<button type="button" data-info-strip-prev aria-label="السابقة">س</button>'
                                 f'<button type="button" data-info-strip-next aria-label="التالية">ت</button>'
                                 f'<span data-info-strip-position></span></div>'
                                 f'<p data-info-strip-status role="status"></p></div></section></body></html>')
        page.wait_for_load_state("networkidle")
        hidden_geo = peek_geo(page, "#t-peek")
        page.evaluate("() => document.getElementById('hv').hidden = false")
        page.wait_for_timeout(500)
        revealed = peek_geo(page, "#t-peek")
        page.evaluate("() => window.MicroInfoPeek.goTo(document.getElementById('t-peek'), window.MicroInfoPeek.getIndex(document.getElementById('t-peek')))")
        page.wait_for_timeout(300)
        after_go = peek_geo(page, "#t-peek")
        has_ro = page.evaluate("() => typeof ResizeObserver === 'function' && !!window.MicroInfoPeek.disconnect")
        results["SUI-007_harness"] = {"while_hidden": hidden_geo, "after_reveal": revealed,
                                      "after_goTo_same_index": after_go,
                                      "peek_has_RO_or_disconnect_api": has_ro}

        # ---------- SUI-025: carousel مخفي→مكشوف + تغير عرض الأب ----------
        head2 = ('<html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
                 f'<base href="{base}/">'
                 '<link rel="stylesheet" href="shared/tokens.css">'
                 '<link rel="stylesheet" href="components/carousel/carousel.css">'
                 '<script src="components/carousel/carousel.js"></script></head><body>')
        cards = "".join(
            f'<li class="m-carousel__slide" data-carousel-slide data-card-label="بطاقة {i + 1}">'
            f'<div class="m-carousel__card" style="padding:12px"><h3>بطاقة {i + 1}</h3>'
            f'<p>محتوى تجريبي للعارض رقم {i + 1}</p></div></li>'
            for i in range(3))
        page.set_content(head2 + f'<div id="wrap" style="width:320px"><section id="cv" hidden>'
                                 f'<div class="m-carousel" data-carousel data-carousel-label="اختبار" id="t-car">'
                                 f'<div class="m-carousel__viewport" data-viewport>'
                                 f'<ul class="m-carousel__track" data-track>{cards}</ul></div>'
                                 f'<div class="m-carousel__controls">'
                                 f'<button type="button" data-prev aria-label="السابق">س</button>'
                                 f'<p data-status aria-live="polite"></p>'
                                 f'<button type="button" data-next aria-label="التالي">ت</button></div>'
                                 f'<div class="m-carousel__dots" data-dots role="group" aria-label="نقاط"></div>'
                                 f'</div></section></div></body></html>')
        page.wait_for_load_state("networkidle")

        def car_geo():
            return page.evaluate("""() => {
              const c = document.getElementById('t-car');
              const vp = c.querySelector('[data-viewport]');
              const cur = c.querySelector('[data-carousel-slide][data-current="true"]');
              const vr = vp.getBoundingClientRect(); const r = cur.getBoundingClientRect();
              return { transform: (t => t === 'none' ? 0 : new DOMMatrixReadOnly(t).m41)(getComputedStyle(c.querySelector('[data-track]')).transform),
                       vpW: Math.round(vr.width), slideW: Math.round(r.width),
                       leftInset: Math.round(r.left - vr.left), rightInset: Math.round(vr.right - r.right),
                       index: window.MicroCarousel.getIndex(c) };
            }""")
        hidden_car = car_geo()
        page.evaluate("() => document.getElementById('cv').hidden = false")
        page.wait_for_timeout(500)
        revealed_car = car_geo()
        page.evaluate("() => window.MicroCarousel.goTo(document.getElementById('t-car'), 1)")
        page.wait_for_timeout(400)
        at1 = car_geo()
        # تغير عرض الأب بلا window resize
        page.evaluate("() => document.getElementById('wrap').style.width = '360px'")
        page.wait_for_timeout(500)
        wider = car_geo()
        has_ro_car = page.evaluate("() => !!window.MicroCarousel.disconnect")
        results["SUI-025_harness"] = {"while_hidden": hidden_car, "after_reveal": revealed_car,
                                      "after_goTo_1": at1, "after_parent_width_360_no_window_resize": wider,
                                      "carousel_has_disconnect_api": has_ro_car}
        page.screenshot(path=str(OUT.parent / "screenshots" / "probe-before-sui025-carousel-reveal-320.png"))

        # ---------- SUI-008: m-stat عزل ----------
        head3 = ('<html lang="ar" dir="rtl"><head><meta charset="UTF-8">'
                 f'<base href="{base}/">'
                 '<link rel="stylesheet" href="shared/tokens.css">'
                 '<link rel="stylesheet" href="components/data/data.css"></head><body>')
        page.set_content(head3 + '<div id="card" style="width:288px;padding:12px">'
                                 '<div class="m-stat"><span class="m-stat__label">إجمالي</span>'
                                 '<span class="m-stat__value"><span class="m-stat__num" id="num">1234567890123456</span>'
                                 '<span class="m-stat__unit">د.أ</span></span></div></body></html>')
        page.wait_for_load_state("networkidle")

        def stat_measure():
            return page.evaluate("""() => {
              const card = document.getElementById('card'); const num = document.getElementById('num');
              const cr = card.getBoundingClientRect(); const nr = num.getBoundingClientRect();
              const cs = getComputedStyle(num);
              return { cardClientW: card.clientWidth, cardScrollW: card.scrollWidth,
                       numW: Math.round(nr.width), numH: Math.round(nr.height),
                       cardW: Math.round(cr.width), cardH: Math.round(cr.height),
                       overflowWrap: cs.overflowWrap, fontSize: cs.fontSize,
                       numInsideCardX: nr.left >= cr.left - 0.5 && nr.right <= cr.right + 0.5,
                       numInsideCardY: nr.top >= cr.top - 0.5 && nr.bottom <= cr.bottom + 0.5,
                       text: num.textContent };
            }""")
        at1x = stat_measure()
        page.evaluate("() => { const els=[document.body].concat([...document.body.querySelectorAll('*')]);"
                     " els.forEach(el => { const fs = parseFloat(getComputedStyle(el).fontSize);"
                     " el.dataset.a4z='1'; el.style.fontSize=(fs*2)+'px'; }); }")
        page.wait_for_timeout(300)
        at200 = stat_measure()
        results["SUI-008_harness"] = {"at_1x": at1x, "at_200pct": at200}

        # ---------- SUI-024: comparison.html عند 320+200% ----------
        page.goto(base + "/previews/info-strip/comparison.html")
        page.wait_for_load_state("networkidle")
        page.evaluate("() => { const els=[document.body].concat([...document.body.querySelectorAll('*')]);"
                     " els.forEach(el => { const fs = parseFloat(getComputedStyle(el).fontSize);"
                     " el.dataset.a4z='1'; el.style.fontSize=(fs*2)+'px'; }); }")
        page.wait_for_timeout(300)
        results["SUI-024_comparison"] = page.evaluate("""() => {
          const tbl = document.querySelector('.cmp-table');
          const parent = tbl ? tbl.parentElement : null;
          const scrollableParent = parent && parent.classList.contains('cmp-table-scroll');
          return { docScrollW: document.scrollingElement.scrollWidth,
                   docClientW: document.scrollingElement.clientWidth,
                   tableW: tbl ? Math.round(tbl.getBoundingClientRect().width) : null,
                   hasScrollContainer: scrollableParent };
        }""")
        page.screenshot(path=str(OUT.parent / "screenshots" / "probe-before-sui024-comparison-320-200pct.png"))

        # ---------- SUI-009: العينة المستقلة (المسار الافتراضي) ----------
        page2 = ctx.new_page()
        page2.goto(base + "/previews/ux-patterns/order-schedule/index.html")
        page2.wait_for_load_state("networkidle")
        page2.wait_for_timeout(600)
        results["SUI-009_sample_default"] = page2.evaluate("""() => {
          const legend = document.querySelector('#ocal-demo [data-ocal-legend]');
          const rows = [...document.querySelectorAll('#ocal-demo .m-ocal__row')].map(r => r.getAttribute('data-ocal-id'));
          return { legendText: legend ? legend.textContent : null,
                   mysteryInDom: (document.body.innerText || '').indexOf('mystery') >= 0,
                   hasOd10: rows.indexOf('od-10') >= 0, hasOdInj: rows.indexOf('od-inj') >= 0,
                   storeCount: window.OrderDemoStore.count(),
                   hasCreateStore: typeof window.OrderDemoStore.createStore === 'function',
                   hasEdgeFixtures: !!window.OrderDemoStore.EDGE_FIXTURES };
        }""")
        page2.screenshot(path=str(OUT.parent / "screenshots" / "probe-before-sui009-sample-320.png"))
        ctx.close()
        browser.close()

    (OUT / "probe-before.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
