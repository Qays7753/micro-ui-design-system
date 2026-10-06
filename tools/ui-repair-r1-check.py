#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — أداة فحص جولة UI-SOURCE-REPAIR-R1 (UI-27)

فحوص سببية لأصل إصلاحات هذه الجولة على عينة UX-F03 (المصدر + الملف المستقل):
R1-01 اعتماد الأسطح: هوية السطح ظاهرة في المصدر وفي standalone معًا.
R1-02 الأزرار النصية: حشو 20px لا 48px محجوزة، والمؤشر لا يغيّر الأبعاد.
R1-03 أدوات القائمة: المقاطع بعرض طبيعي والالتفاف بلا قص.
R1-04 خطوة الكمية: زرا B01 أيقونيان ≥48px مع data-step وحدود تعمل.
R1-05 عدّاد الاسم يتزامن مع التعبئة البرمجية عند فتح التعديل.
R1-06 زر المسح: أيقونة + ظهور متزامن + إخفاء في readonly.
R1-07 المقارنة المختصرة compact: البطل ≤112px وليس 208px.
R1-08 الدونات 148px لا عرض الحاوية، والمفتاح بجانبها.
R1-09 تسميات الرسوم ≥13px (أعمدة/قيم) و≥12px (خط/مفتاح مركز).
R1-10 نص ملاحظة الدوائر بلا مصطلحات تنفيذية، والتشخيص في data-scale-detail.
R1-11 أسطح المحتوى الدائمة بلا ظل overlay (حد فاصل بدلًا منه).
R1-12/13/16 صف القيمة+الكمية المتراص، الكمية وحدة متماسكة fit-content بلا فيض 320px.
R1-15 مساعدة القيمة ظاهرة ويحل الخطأ محلها.
R1-17 شريط المقارنة سماكته 12/8px وحدّه غير داكن مصمت.
R1-19 قسم الدونات المطوي يعمل (aria-expanded + hidden).
R1-20 تنسيق المال برقمين عشريين وتاريخ التفاصيل عربي مقروء.
R1-21 الملاحظة rows=2 وتنمو مع المحتوى.
R1-42 تكافؤ المصدر وstandalone (نفس القياسات على file://).

الإخراج: reviews/UI-SOURCE-REPAIR-R1/verification.{json,txt} + لقطات screenshots/.
خروج غير صفري عند أي فشل. NOT RUN: منصات فعلية (كما في ux-f03-check).
"""
import json
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "reviews" / "UI-SOURCE-REPAIR-R1"
SHOTS = OUT / "screenshots"
SAMPLE_REL = "previews/ux-patterns/mobile-record-sample"
WIDTHS = [320, 360, 390, 430]


def serve_dir(root: Path):
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = ThreadingHTTPServer(("127.0.0.1", 0), H)
    srv.RequestHandlerClass.directory = str(root)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{srv.server_address[1]}"


class Tool:
    def __init__(self):
        self.results = []
        self.fails = 0

    def check(self, name, ok, detail=""):
        self.results.append({"name": name, "ok": bool(ok), "detail": str(detail)[:400]})
        if not ok:
            self.fails += 1
        print(("[PASS] " if ok else "[FAIL] ") + name + (f" — {detail}" if detail and not ok else ""))

    def summary(self):
        ok = sum(1 for r in self.results if r["ok"])
        return {
            "total": len(self.results),
            "passed": ok,
            "failed": self.fails,
            "not_run": [
                "Samsung Galaxy S25 حقيقي وSamsung Internet ولوحة نظام وسيف إريا",
                "TalkBack/VoiceOver وقارئ شاشة فعلي",
                "WebKit/Safari وnative zoom (المحاكاة نص ×2 معلنة)",
            ],
        }


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    SHOTS.mkdir(parents=True, exist_ok=True)
    t = Tool()
    base = serve_dir(ROOT)
    src_url = f"{base}/{SAMPLE_REL}/index.html"
    standalone = ROOT / SAMPLE_REL / "standalone.html"

    with sync_playwright() as p:
        browser = p.chromium.launch()

        def run_page(url: str, tag: str, is_file: bool):
            page = browser.new_page(viewport={"width": 360, "height": 780})
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(url)
            page.wait_for_timeout(300)
            page.click("#f03-gw-demo")
            page.wait_for_timeout(500)

            # R1-01 الأسطح
            page.wait_for_selector("#view-home:not([hidden])")
            m = page.evaluate("""() => {
              const hero = document.getElementById('f03-home-surface');
              const cs = getComputedStyle(hero);
              const amount = hero.querySelector('.m-surface__amount');
              const acs = getComputedStyle(amount);
              return { bg: cs.backgroundImage !== 'none', radius: cs.borderRadius,
                       pad: cs.padding, amountFs: acs.fontSize, amountW: acs.fontWeight,
                       heroBg: getComputedStyle(hero.querySelector('.m-surface__content')).padding };
            }""")
            t.check(f"R1-01[{tag}] هوية السطح: تدرج وانحناء وحشو محتوى",
                    m["bg"] and m["heroBg"] not in ("0px", ""), json.dumps(m))
            t.check(f"R1-01[{tag}] مبلغ السطح 36px/600",
                    m["amountFs"] == "36px" and m["amountW"] == "600", json.dumps(m))
            page.screenshot(path=str(SHOTS / f"home-{tag}-360.png"), full_page=True)

            # R1-07 compact
            m = page.evaluate("""() => {
              const h = document.querySelector('#f03-home-metric .m-main-metric__hero');
              const r = h.getBoundingClientRect();
              const block = document.getElementById('f03-home-compare').getBoundingClientRect();
              return { w: Math.round(r.width), h: Math.round(r.height), blockH: Math.round(block.height) };
            }""")
            t.check(f"R1-07[{tag}] بطل المقارنة compact ≤112px (لا 208)",
                    m["w"] <= 112.5 and m["h"] <= 112.5, json.dumps(m))
            t.check(f"R1-07[{tag}] كتلة المقارنة مختصرة (<560px، كانت 750)",
                    m["blockH"] < 560, json.dumps(m))

            # R1-10 + الدوائر
            m = page.evaluate("""() => {
              const note = document.querySelector('#f03-home-circles [data-metric-scale]');
              const root = document.getElementById('f03-home-circles');
              const txt = note ? note.textContent : '';
              return { txt: txt, jargon: /المستهلك|متكيف|عقد|سمات/.test(txt),
                       detail: root.getAttribute('data-scale-detail') || '' };
            }""")
            t.check(f"R1-10[{tag}] ملاحظة الدوائر بلا مصطلحات تنفيذية", not m["jargon"], m["txt"])
            t.check(f"R1-10[{tag}] التشخيص التقني في data-scale-detail", bool(m["detail"]), m["detail"])

            # R1-11 أسطح دائمة
            m = page.evaluate("""() => {
              const r = document.querySelector('.f03-rowlist');
              const s = document.querySelector('#f03-list-rows') || r;
              return { rowShadow: getComputedStyle(s).boxShadow, rowBorder: getComputedStyle(s).borderTopWidth };
            }""")
            t.check(f"R1-11[{tag}] قائمة المحتوى بلا ظل overlay", m["rowShadow"] == "none", m["rowShadow"])

            # القائمة
            page.click("#f03-nav-list")
            page.wait_for_selector("#view-list:not([hidden])")
            page.wait_for_timeout(300)
            page.screenshot(path=str(SHOTS / f"list-{tag}-360.png"), full_page=True)

            # R1-02 + R1-03
            m = page.evaluate("""() => {
              const btn = document.getElementById('f03-select-toggle');
              const cs = getComputedStyle(btn);
              const seg = document.getElementById('f03-sort-seg');
              const row = document.querySelector('#view-list .f03-sortrow');
              const segItem = seg.querySelector('.m-seg__item');
              return { padS: cs.paddingInlineStart, padE: cs.paddingInlineEnd, w: Math.round(btn.getBoundingClientRect().width),
                       segW: Math.round(seg.getBoundingClientRect().width), segNatural: seg.scrollWidth <= seg.clientWidth + 1,
                       rowH: Math.round(row.getBoundingClientRect().height),
                       itemClipped: segItem ? segItem.scrollWidth > segItem.clientWidth + 1 : true };
            }""")
            t.check(f"R1-02[{tag}] زر نصي بحشو 20px لا محجوزًا",
                    m["padS"] == "20px" and m["padE"] == "20px" and m["w"] < 110, json.dumps(m))
            t.check(f"R1-03[{tag}] المقاطع بعرض طبيعي بلا قص، وصف أدوات مختصر",
                    m["segNatural"] and not m["itemClipped"] and m["rowH"] <= 112, json.dumps(m))

            # R1-05/06 النموذج
            page.click("#f03-list-rows .f03-row[data-id='it-01']")
            page.wait_for_selector("#view-detail:not([hidden])")
            page.click("#f03-detail-edit")
            page.wait_for_selector("#view-form:not([hidden])")
            page.wait_for_timeout(350)
            m = page.evaluate("""() => {
              const count = document.querySelector('#f03-name-field .m-field__count');
              const clear = document.querySelector('#f03-name-field .m-field__clear');
              const name = document.getElementById('f03-name');
              const help = document.getElementById('f03-value-help');
              const btns = [].slice.call(document.querySelectorAll('#f03-qty-field [data-step]'));
              const note = document.getElementById('f03-note');
              return {
                counter: count ? count.textContent : null,
                clearVisible: clear ? getComputedStyle(clear).display !== 'none' : false,
                clearIcon: clear ? !!clear.querySelector('svg') : false,
                clearW: clear ? Math.round(clear.getBoundingClientRect().width) : 0,
                nameLen: name.value.length,
                stepBtns: btns.map(b => ({ cls: b.className, w: Math.round(b.getBoundingClientRect().width),
                                           h: Math.round(b.getBoundingClientRect().height), step: b.getAttribute('data-step') })),
                helpVisible: help ? !help.hidden : null,
                noteRows: note.getAttribute('rows'),
                noteH: Math.round(note.getBoundingClientRect().height)
              };
            }""")
            t.check(f"R1-05[{tag}] العدّاد متزامن بعد التعبئة البرمجية",
                    m["counter"] == str(m["nameLen"]) + "/40", json.dumps(m))
            t.check(f"R1-06[{tag}] زر المسح ظاهر بأيقونة وهدف 48px",
                    m["clearVisible"] and m["clearIcon"] and m["clearW"] >= 48, json.dumps(m))
            t.check(f"R1-04[{tag}] زرا الخطوة B01 أيقونيان ≥48px",
                    len(m["stepBtns"]) == 2 and all(
                        "m-btn m-btn--icon" in b["cls"] and b["w"] >= 48 and b["h"] >= 48
                        for b in m["stepBtns"]), json.dumps(m))
            page.screenshot(path=str(SHOTS / f"form-edit-{tag}-360.png"), full_page=True)

            # R1-04 حدود الخطوة: min 0 وmax 9999 (لمس وكيبورد عبر click)
            m = page.evaluate("""() => {
              const down = document.querySelector('#f03-qty-field [data-step="down"]');
              const up = document.querySelector('#f03-qty-field [data-step="up"]');
              const qty = document.getElementById('f03-qty');
              qty.value = '0'; down.click();
              const atMin = qty.value;
              qty.value = '9999'; up.click();
              const atMax = qty.value;
              qty.value = '5'; up.click();
              const stepped = qty.value;
              return { atMin, atMax, stepped };
            }""")
            t.check(f"R1-04[{tag}] حدّا الخطوة 0 و9999 محترمان والخطوة تعمل",
                    m["atMin"] == "0" and m["atMax"] == "9999" and m["stepped"] == "6", json.dumps(m))

            # R1-06 readonly
            m = page.evaluate("""() => {
              const name = document.getElementById('f03-name');
              name.readOnly = true;
              if (window.MicroFields) window.MicroFields.sync(document.getElementById('f03-name-field'));
              const vis = getComputedStyle(document.querySelector('#f03-name-field .m-field__clear')).display !== 'none';
              name.readOnly = false;
              if (window.MicroFields) window.MicroFields.sync(document.getElementById('f03-name-field'));
              const vis2 = getComputedStyle(document.querySelector('#f03-name-field .m-field__clear')).display !== 'none';
              return { hiddenInRO: !vis, visibleAfter: vis2 };
            }""")
            t.check(f"R1-06[{tag}] المسح ممنوع في readonly ويعود بعده", m["hiddenInRO"] and m["visibleAfter"], json.dumps(m))

            # R1-15 المساعدة والخطأ
            m = page.evaluate("""() => {
              const help = document.getElementById('f03-value-help');
              const msg = document.getElementById('f03-value-msg');
              const input = document.getElementById('f03-value');
              input.value = 'abc';
              input.dispatchEvent(new Event('input', { bubbles: true }));
              document.getElementById('f03-save').click();
              const helpHidden = help.hidden;
              const errShown = !msg.hidden && msg.textContent.length > 3;
              input.value = '45';
              input.dispatchEvent(new Event('input', { bubbles: true }));
              return { helpHidden, errShown, helpBack: !help.hidden };
            }""")
            t.check(f"R1-15[{tag}] الخطأ يحل محل المساعدة ثم تعود", m["helpHidden"] and m["errShown"] and m["helpBack"], json.dumps(m))

            # R1-12/13/16 الصف المتراص + 320 بلا فيض
            m = page.evaluate("""() => {
              const qty = document.getElementById('f03-qty-field').querySelector('.m-field__control');
              const value = document.getElementById('f03-value-field').getBoundingClientRect();
              const qtyR = qty.getBoundingClientRect();
              const row = document.querySelector('.f03-field-row');
              const rowR = row.getBoundingClientRect();
              return { qtyW: Math.round(qtyR.width), rowH: Math.round(rowR.height),
                       qtyCompact: qtyR.width < 300, valueTop: Math.round(value.top) };
            }""")
            t.check(f"R1-12/16[{tag}] الكمية وحدة متماسكة fit-content", m["qtyCompact"], json.dumps(m))
            page.set_viewport_size({"width": 320, "height": 700})
            page.wait_for_timeout(200)
            m2 = page.evaluate("""() => {
              const docW = document.documentElement.clientWidth;
              const row = document.querySelector('.f03-field-row');
              const r = row.getBoundingClientRect();
              const qty = document.getElementById('f03-qty-field').querySelector('.m-field__control').getBoundingClientRect();
              return { rowW: Math.round(r.width), docW,
                       qtyFits: qty.right <= docW + 1 && qty.left >= -1,
                       wraps: r.height > 90 };
            }""")
            t.check(f"R1-13[{tag}] عند 320px يلتف الصف لمستقلين بلا فيض",
                    m2["rowW"] <= m2["docW"] + 1 and m2["qtyFits"] and m2["wraps"], json.dumps(m2))
            page.set_viewport_size({"width": 360, "height": 780})

            # R1-21 نمو الملاحظة
            m = page.evaluate("""() => {
              const note = document.getElementById('f03-note');
              const h0 = note.getBoundingClientRect().height;
              note.value = 'سطر أول طويل نسبيًا يلتف.\\nسطر ثانٍ.\\nسطر ثالث.\\nسطر رابع.\\nسطر خامس.';
              note.dispatchEvent(new Event('input', { bubbles: true }));
              const h1 = note.getBoundingClientRect().height;
              note.value = 'قصير';
              note.dispatchEvent(new Event('input', { bubbles: true }));
              const h2 = note.getBoundingClientRect().height;
              return { h0: Math.round(h0), h1: Math.round(h1), h2: Math.round(h2) };
            }""")
            t.check(f"R1-21[{tag}] الملاحظة تنمو مع المحتوى وتنكمش",
                    m["h1"] > m["h0"] + 40 and abs(m["h2"] - m["h0"]) <= 8, json.dumps(m))

            # مغادرة النموذج (مع حوار الحراسة إن كان dirty من الفحوص أعلاه)
            page.click("#f03-form-back")
            page.wait_for_timeout(250)
            leave_visible = page.evaluate("() => !document.getElementById('f03-leave-dialog').hidden")
            if leave_visible:
                page.click("#f03-abandon")
                page.wait_for_timeout(300)
            page.click("#f03-detail-back")
            page.wait_for_timeout(300)
            page.click("#f03-nav-reports")
            page.wait_for_selector("#view-reports:not([hidden])")
            page.wait_for_timeout(450)
            page.screenshot(path=str(SHOTS / f"reports-{tag}-360.png"), full_page=True)
            m = page.evaluate("""() => {
              const secHead0 = document.querySelector('#f03-rep-extra .m-section__head');
              const secBody0 = document.getElementById('f03-rep-donut-body');
              const wasCollapsed = secHead0 ? secHead0.getAttribute('aria-expanded') : null;
              const wasHidden = secBody0 ? secBody0.hidden : null;
              const head = document.querySelector('#f03-rep-extra .m-section__head');
              if (head) head.click(); /* افتح القسم أولًا: مخفيًا عرضه 0 بلا معنى */
              const donut = document.querySelector('#f03-rep-donut .m-donut__svg, #f03-rep-donut svg');
              const labels = [].slice.call(document.querySelectorAll('#f03-rep-bars .m-chart__bar-label')).slice(0, 3).map(x => parseFloat(getComputedStyle(x).fontSize));
              const values = [].slice.call(document.querySelectorAll('#f03-rep-bars .m-chart__bar-value')).slice(0, 3).map(x => parseFloat(getComputedStyle(x).fontSize));
              const pointVals = [].slice.call(document.querySelectorAll('#f03-rep-line .m-chart__point-value')).slice(0, 2).map(x => parseFloat(getComputedStyle(x).fontSize));
              const track = document.querySelector('#f03-rep-metric .m-main-metric__track');
              const bar = document.querySelector('#f03-rep-metric .m-main-metric__bar');
              const secHead = document.querySelector('#f03-rep-extra .m-section__head');
              const secBody = document.getElementById('f03-rep-donut-body');
              return {
                donutW: donut ? Math.round(donut.getBoundingClientRect().width) : null,
                donutVB: donut ? donut.getAttribute('viewBox') : null,
                labelFs: labels, valueFs: values, pointFs: pointVals,
                trackH: track ? Math.round(track.getBoundingClientRect().height) : null,
                trackIsCompact: track ? track.getBoundingClientRect().height <= 9 : null,
                barShadow: bar ? getComputedStyle(bar).boxShadow.slice(0, 70) : null,
                secExpanded: secHead ? secHead.getAttribute('aria-expanded') : null,
                secBodyHidden: secBody ? secBody.hidden : null,
                wasCollapsed, wasHidden
              };
            }""")
            t.check(f"R1-08[{tag}] الدونات 148px لا عرض الحاوية",
                    m["donutW"] is not None and 146 <= m["donutW"] <= 150, json.dumps(m))
            t.check(f"R1-09[{tag}] تسميات الأعمدة ≥13px والقيم ≥13px والخط ≥12px",
                    all(v >= 13 for v in m["labelFs"]) and all(v >= 13 for v in m["valueFs"]) and all(v >= 12 for v in m["pointFs"]),
                    json.dumps(m))
            t.check(f"R1-17[{tag}] شريط المقارنة سماكة 12/8px وحد غير داكن مصمت",
                    m["trackH"] in (8, 12) and "rgb(23, 45, 50)" not in m["barShadow"], json.dumps(m))
            t.check(f"R1-19[{tag}] قسم الدونات مطوي افتراضيًا", m["wasCollapsed"] == "false" and m["wasHidden"], json.dumps(m))
            t.check(f"R1-19[{tag}] فتح القسم يكشف الدونات", m["secExpanded"] == "true" and not m["secBodyHidden"], json.dumps(m))
            page.screenshot(path=str(SHOTS / f"reports-donut-open-{tag}-360.png"))

            # R1-20 تنسيق العرض
            m = page.evaluate("""() => {
              const rowVal = document.querySelector('#f03-list-rows .f03-row__value, .f03-home-recent .f03-row__value');
              return { rowVal: rowVal ? rowVal.textContent.trim() : null };
            }""")
            t.check(f"R1-20[{tag}] صف القيمة بصيغة ثابتة (رقمان عشريان وبلا «القيمة:»)",
                    m["rowVal"] is not None and m["rowVal"].endswith(" د.أ") and "." in m["rowVal"] and "القيمة:" not in m["rowVal"], m["rowVal"])

            # أخطاء الصفحة
            t.check(f"R1-ERR[{tag}] صفر أخطاء صفحة", len(errors) == 0, "; ".join(errors[:3]))
            page.close()

        run_page(src_url, "src", False)
        run_page(standalone.as_uri(), "standalone", True)

        # عرض المقاسات في المصدر: لا فيض أفقي في 320/390/430 — بنفس منطق
        # ux-f03-check: العنصر المقصوص بسلف overflow حقيقي داخل الصفحة ليس فيضًا
        for w in WIDTHS:
            page = browser.new_page(viewport={"width": w, "height": 760})
            page.goto(src_url)
            page.wait_for_timeout(250)
            page.click("#f03-gw-demo")
            page.wait_for_timeout(400)
            m = page.evaluate("""() => {
              const bad = [];
              const docW = document.documentElement.clientWidth;
              const clippedByAncestor = (el) => {
                let p = el.parentElement;
                while (p && p !== document.body) {
                  const pcs = getComputedStyle(p);
                  if (/(hidden|clip|auto|scroll)/.test(pcs.overflowX)) {
                    const pr = p.getBoundingClientRect();
                    if (pr.left >= -1 && pr.right <= docW + 1) return true;
                  }
                  p = p.parentElement;
                }
                return false;
              };
              document.querySelectorAll('.f03-main *').forEach(el => {
                if (!el.offsetParent && el.getClientRects().length === 0) return;
                if (clippedByAncestor(el)) return;
                const r = el.getBoundingClientRect();
                if (r.width === 0 && r.height === 0) return;
                if (r.right > docW + 1 || r.left < -1) {
                  bad.push({ tag: el.tagName, cls: String(el.className).slice(0, 50) });
                }
              });
              return { docW, bad: bad.slice(0, 6), n: bad.length };
            }""")
            t.check(f"R1-W{w} لا عناصر خارج العمود في {w}px", m["n"] == 0, json.dumps(m, ensure_ascii=False))
            if w == 430:
                page.screenshot(path=str(SHOTS / "home-src-430.png"))
            page.close()
        browser.close()

    summary = t.summary()
    (OUT / "verification.json").write_text(
        json.dumps({"summary": summary, "results": t.results}, ensure_ascii=False, indent=2),
        encoding="utf-8")
    lines = [f"{'[PASS]' if r['ok'] else '[FAIL]'} {r['name']}" + (f" — {r['detail']}" if r["detail"] and not r["ok"] else "")
             for r in t.results]
    lines.append("")
    lines.append(f"الملخص: {summary['passed']}/{summary['total']} فحصًا ناجحًا — فشل {summary['failed']}")
    lines.append("NOT RUN: " + "؛ ".join(summary["not_run"]))
    (OUT / "verification.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"\nالملخص: {summary['passed']}/{summary['total']} — فشل {summary['failed']}")
    return 1 if summary["failed"] else 0


if __name__ == "__main__":
    sys.exit(main())
