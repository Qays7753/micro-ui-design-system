#!/usr/bin/env python3
"""Rendered geometry regression gate for small controls across UI families.

python3 tools/numeric-micro-consistency-check.py [--out PATH]
Uses the current component CSS in Chromium; no generated showcase edits.
"""
import argparse
import http.server
import json
import re
import tempfile
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

from browser_support import chromium_launch_options


ROOT = Path(__file__).resolve().parent.parent
FIXTURE_PATH = "/numeric-micro-consistency-fixture.html"
HTML = """<!doctype html>
<html lang="ar" dir="rtl"><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="assets/fonts/fonts.css">
  <link rel="stylesheet" href="shared/tokens.css">
  <link rel="stylesheet" href="components/buttons/buttons.css">
  <link rel="stylesheet" href="components/fields/fields.css">
  <link rel="stylesheet" href="components/selection/selection.css">
  <link rel="stylesheet" href="components/selection/picker.css">
  <link rel="stylesheet" href="components/navigation/navigation.css">
  <link rel="stylesheet" href="components/organization/organization.css">
  <link rel="stylesheet" href="components/messages/messages.css">
  <link rel="stylesheet" href="components/order-schedule/order-schedule.css">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 16px; background: var(--micro-surface-page); font-family: var(--micro-font-family); }
    main { display: grid; gap: 12px; }
    .narrow { display: grid; gap: 8px; width: 180px; max-width: 100%; }
  </style>
</head><body><main id="fixture">
  <button type="button" id="icon-action" class="m-btn m-btn--secondary m-btn--icon" aria-label="بحث">
    <svg class="m-btn__icon" aria-hidden="true" viewBox="0 0 24 24"></svg>
  </button>
  <section class="narrow" id="narrow">
    <label class="m-choice m-choice--check" id="choice">
      <input type="checkbox" id="choice-input">
      <span class="m-choice__box"><svg aria-hidden="true" viewBox="0 0 24 24"></svg></span>
      <span class="m-choice__text" id="choice-text">اختيار طويل يلتف داخل عرض الحاوية الضيقة عند تكبير النص</span>
    </label>
    <label class="m-choice m-choice--radio">
      <input type="radio" name="kind">
      <span class="m-choice__box"></span><span class="m-choice__text">خيار الراديو</span>
    </label>
    <label class="m-switch" id="switch">
      <span class="m-switch__text"><span class="m-switch__label">إعداد التنبيهات</span><span class="m-switch__state">مُعطّل</span></span>
      <input type="checkbox" role="switch" id="switch-input">
      <span class="m-switch__track"><span class="m-switch__thumb"></span></span>
    </label>
    <div class="m-seg" role="group" aria-label="وحدة العرض" data-seg>
      <button class="m-seg__item" type="button" aria-pressed="true">يوم</button>
      <button class="m-seg__item" type="button" aria-pressed="false">أسبوع</button>
      <button class="m-seg__item" type="button" aria-pressed="false">شهر</button>
    </div>
    <div class="m-field" id="field">
      <label class="m-field__label" for="field-input" id="field-label">اسم الصنف</label>
      <div class="m-field__control" id="field-shell">
        <input class="m-field__input" id="field-input" value="صابون زيت الزيتون">
      </div>
    </div>
    <div class="m-picker">
      <div class="m-picker__list" role="listbox" aria-label="النتائج">
        <button class="m-picker__option" role="option" aria-selected="false">مؤسسة النور للتوريدات</button>
      </div>
    </div>
    <div class="m-tabs" role="tablist" aria-label="أقسام">
      <button class="m-tabs__tab" role="tab" aria-selected="true">النشطة</button>
    </div>
    <nav class="m-navbar" aria-label="التنقل">
      <button class="m-navbar__item" aria-current="page"><svg aria-hidden="true" viewBox="0 0 24 24"></svg><span>الرئيسية</span></button>
      <button class="m-navbar__item"><svg aria-hidden="true" viewBox="0 0 24 24"></svg><span>الطلبات</span></button>
    </nav>
    <div class="m-note m-note--error" role="alert">
      <svg class="m-note__icon" aria-hidden="true" viewBox="0 0 24 24"></svg>
      <div class="m-note__text"><span class="m-note__title">خطأ</span><p class="m-note__body">تعذر الإجراء مع بقاء النص كاملًا.</p></div>
      <button class="m-btn m-btn--secondary m-btn--icon m-note__close" type="button" aria-label="إغلاق">
        <svg class="m-btn__icon" aria-hidden="true" viewBox="0 0 24 24"></svg>
      </button>
    </div>
    <div class="m-wait" role="status"><span class="m-wait__spinner" aria-hidden="true"></span>جارٍ التحميل</div>
    <div class="m-badge"><span class="m-badge__dot"></span>قيد المراجعة</div>
    <span class="m-counter">123</span>
    <hr class="m-divider">
    <div class="m-ocal">
      <button class="m-ocal__navbtn" type="button" aria-label="الشهر السابق"><svg aria-hidden="true" viewBox="0 0 24 24"></svg></button>
      <button class="m-ocal__add" type="button">إضافة طلب</button>
      <button class="m-ocal__row" type="button"><span class="m-ocal__row-title">طلب تجريبي</span></button>
    </div>
  </section>
</main></body></html>
"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path.split("?", 1)[0] == FIXTURE_PATH:
            payload = HTML.replace("<head>", '<head><base href="/">').encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()

    def log_message(self, *args):
        pass


GEOMETRY_JS = """() => {
  const rect = s => {
    const e = document.querySelector(s);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return {x:r.x, y:r.y, width:r.width, height:r.height, scrollWidth:e.scrollWidth,
            clientWidth:e.clientWidth, fontSize:getComputedStyle(e).fontSize};
  };
  const pseudo = e => {
    const p = getComputedStyle(e, '::after');
    return {top:parseFloat(p.top), bottom:parseFloat(p.bottom)};
  };
  const choiceBox = document.querySelector('#choice .m-choice__box');
  const choiceText = document.querySelector('#choice-text');
  const switchTrack = document.querySelector('#switch .m-switch__track');
  const switchThumb = document.querySelector('#switch .m-switch__thumb');
  const badgeDot = document.querySelector('.m-badge__dot');
  const spinner = document.querySelector('.m-wait__spinner');
  return {
    viewport: innerWidth, dir: document.documentElement.dir,
    page: {scrollWidth:document.documentElement.scrollWidth, clientWidth:document.documentElement.clientWidth},
    narrow: rect('#narrow'), choice: rect('#choice'), choiceBox: rect('#choice .m-choice__box'),
    choiceText: rect('#choice-text'),
    nativeInput: {width:getComputedStyle(document.querySelector('#choice-input')).width,
                  height:getComputedStyle(document.querySelector('#choice-input')).height,
                  clipPath:getComputedStyle(document.querySelector('#choice-input')).clipPath},
    radioChoice:rect('.m-choice--radio'),
    radioInput:{width:getComputedStyle(document.querySelector('.m-choice--radio input')).width,
                height:getComputedStyle(document.querySelector('.m-choice--radio input')).height,
                clipPath:getComputedStyle(document.querySelector('.m-choice--radio input')).clipPath},
    switch: rect('#switch'), switchTrack:rect('#switch .m-switch__track'), switchThumb:rect('#switch .m-switch__thumb'),
    seg:rect('.m-seg'), segment:rect('.m-seg__item'), segmentPseudo:pseudo(document.querySelector('.m-seg__item')),
    iconButton:rect('#icon-action'), field:rect('#field-shell'), fieldInput:rect('#field-input'),
    pickerOption:rect('.m-picker__option'), tab:rect('.m-tabs__tab'), navbarItem:rect('.m-navbar__item'),
    close:rect('.m-note__close'), wait:rect('.m-wait'), spinner:{width:getComputedStyle(spinner).width,height:getComputedStyle(spinner).height},
    badge:rect('.m-badge'), badgeDot:{width:badgeDot.getBoundingClientRect().width,height:badgeDot.getBoundingClientRect().height},
    counter:rect('.m-counter'), divider:rect('.m-divider'), orderNav:rect('.m-ocal__navbtn'),
    orderRow:rect('.m-ocal__row'), orderAdd:rect('.m-ocal__add')
  };
}"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, help="directory for verification.json and screenshots")
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-numeric-consistency-"))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    rows = []
    errors = []
    browser_version = None

    def check(name, passed, detail=None):
        rows.append({"name": name, "passed": bool(passed), "detail": detail})
        print(("PASS " if passed else "FAIL ") + name)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            context = browser.new_context(viewport={"width": 390, "height": 1200},
                                          reduced_motion="no-preference")
            page = context.new_page()
            page.on("pageerror", lambda err: errors.append(str(err)))
            page.on("requestfailed", lambda req: errors.append(req.url))
            page.on("response", lambda res: errors.append(f"{res.status} {res.url}") if res.status >= 400 else None)
            page.goto(f"http://127.0.0.1:{server.server_port}{FIXTURE_PATH}", wait_until="load")
            page.evaluate("document.fonts.ready")
            browser_version = browser.version

            for width, direction in ((320, "rtl"), (360, "rtl"), (390, "rtl"),
                                     (430, "rtl"), (390, "ltr")):
                page.set_viewport_size({"width": width, "height": 1200})
                page.evaluate("(dir) => document.documentElement.dir = dir", direction)
                page.wait_for_timeout(30)
                metrics = page.evaluate(GEOMETRY_JS)
                check(f"{width}/{direction}: no page-level horizontal overflow",
                      metrics["page"]["scrollWidth"] <= metrics["page"]["clientWidth"], metrics["page"])
                check(f"{width}/{direction}: native choice inputs remain 1px, label hit rows >=48px",
                      metrics["choice"]["height"] >= 48 and metrics["radioChoice"]["height"] >= 48
                      and all(metrics[key]["width"] == "1px" and metrics[key]["height"] == "1px"
                              and "inset" in metrics[key]["clipPath"] for key in ("nativeInput", "radioInput")),
                      {"checkboxRow": metrics["choice"], "checkboxInput": metrics["nativeInput"],
                       "radioRow": metrics["radioChoice"], "radioInput": metrics["radioInput"]})
                box_side_ok = (metrics["choiceBox"]["x"] > metrics["choiceText"]["x"]
                               if direction == "rtl" else metrics["choiceBox"]["x"] < metrics["choiceText"]["x"])
                check(f"{width}/{direction}: choice mark stays at logical inline-start",
                      box_side_ok, {"box": metrics["choiceBox"], "text": metrics["choiceText"]})
                check(f"{width}/{direction}: switch row is a 48px target with 52x32 track / 24px thumb",
                      metrics["switch"]["height"] >= 48 and metrics["switchTrack"]["width"] == 52
                      and metrics["switchTrack"]["height"] == 32 and metrics["switchThumb"]["width"] == 24
                      and metrics["switchThumb"]["height"] == 24,
                      {"row": metrics["switch"], "track": metrics["switchTrack"], "thumb": metrics["switchThumb"]})

                for checked in (False, True):
                    page.locator("#switch-input").evaluate("(e,v)=>e.checked=v", checked)
                    page.wait_for_timeout(210)
                    endpoint = page.locator("#switch").evaluate("""e=>{
                      const t=e.querySelector('.m-switch__track').getBoundingClientRect();
                      const h=e.querySelector('.m-switch__thumb').getBoundingClientRect();
                      return {left:h.left-t.left,right:t.right-h.right,top:h.top-t.top,bottom:t.bottom-h.bottom,
                              within:h.left>=t.left&&h.right<=t.right&&h.top>=t.top&&h.bottom<=t.bottom};
                    }""")
                    expected = endpoint["left"] if ((direction == "rtl") == checked) else endpoint["right"]
                    check(f"{width}/{direction}: switch {'on' if checked else 'off'} thumb stays at logical end",
                          endpoint["within"] and abs(expected - 3) < .6
                          and abs(endpoint["top"] - endpoint["bottom"]) < .6, endpoint)

                segment = page.locator(".m-seg__item").first
                segment.scroll_into_view_if_needed()
                hit = segment.evaluate("""e=>{
                  const r=e.getBoundingClientRect(), p=getComputedStyle(e,'::after');
                  const top=parseFloat(p.top), bottom=parseFloat(p.bottom);
                  const targetH=r.height-top-bottom, x=r.left+r.width/2;
                  const above=document.elementFromPoint(x,r.top+top/2);
                  const below=document.elementFromPoint(x,r.bottom-bottom/2);
                  return {visibleWidth:r.width,visibleHeight:r.height,targetHeight:targetH,
                          pseudoTop:top,pseudoBottom:bottom,aboveHit:above===e,belowHit:below===e};
                }""")
                check(f"{width}/{direction}: segmented visual 40px, actual 48px target with no clipped extension",
                      hit["visibleHeight"] == 40 and hit["visibleWidth"] >= 48
                      and hit["targetHeight"] >= 48 and hit["aboveHit"] and hit["belowHit"], hit)

                for selector, label in (("#icon-action", "icon button"),
                                        (".m-picker__option", "picker option"),
                                        (".m-tabs__tab", "tab"),
                                        (".m-navbar__item", "navbar item"),
                                        (".m-note__close", "message close"),
                                        (".m-ocal__navbtn", "order navigation"),
                                        (".m-ocal__add", "order add action")):
                    r = page.locator(selector).first.bounding_box()
                    check(f"{width}/{direction}: {label} has >=48px target",
                          r["width"] >= 48 and r["height"] >= 48,
                          {"width": round(r["width"], 1), "height": round(r["height"], 1)})
                check(f"{width}/{direction}: order row remains >=48px",
                      metrics["orderRow"]["height"] >= 48, metrics["orderRow"])
                check(f"{width}/{direction}: B02 inner text remains 16/26 in a >=52px shell",
                      metrics["field"]["height"] >= 52 and metrics["fieldInput"]["fontSize"] == "16px"
                      and page.locator("#field-input").evaluate("e=>getComputedStyle(e).lineHeight") == "26px",
                      {"shell": metrics["field"], "input": metrics["fieldInput"]})
                expected_track_side = (metrics["switch"]["x"] if direction == "ltr"
                                       else metrics["switch"]["x"] + metrics["switch"]["width"])
                track_center = metrics["switchTrack"]["x"] + metrics["switchTrack"]["width"] / 2
                text_box = page.locator("#switch .m-switch__text").bounding_box()
                check(f"{width}/{direction}: switch track remains opposite its text in logical order",
                      (track_center > text_box["x"] + text_box["width"] / 2 if direction == "ltr"
                       else track_center < text_box["x"] + text_box["width"] / 2),
                      {"trackCenter": round(track_center, 1), "text": text_box,
                       "rowStart": round(expected_track_side, 1)})
                check(f"{width}/{direction}: compact status and loading marks retain role-sized geometry",
                      metrics["badgeDot"] == {"width": 6, "height": 6}
                      and metrics["counter"]["height"] >= 20
                      and metrics["spinner"] == {"width": "24px", "height": "24px"}
                      and metrics["divider"]["height"] == 1,
                      {"badgeDot": metrics["badgeDot"], "counter": metrics["counter"],
                       "spinner": metrics["spinner"], "divider": metrics["divider"]})

            # Keyboard focus gets exactly the token shadow; pointer focus does not
            # add a keyboard ring, and static comparison uses the same treatment.
            page.evaluate("document.activeElement.blur()")
            page.locator("#icon-action").focus()
            page.keyboard.press("Tab")
            focus_state = page.locator("#choice-input").evaluate("""e=>{
              const b=e.nextElementSibling, c=getComputedStyle(b);
              return {active:document.activeElement===e,focusVisible:e.matches(':focus-visible'),
                      outline:c.outlineStyle,shadow:c.boxShadow};
            }""")
            shadow_layers = len(re.findall(r"(?:^|,\s*)(?:rgb|rgba|color\()", focus_state["shadow"]))
            check("keyboard checkbox focus: one token shadow treatment, no second outline",
                  focus_state["active"] and focus_state["focusVisible"]
                  and focus_state["outline"] == "none" and shadow_layers == 2, focus_state)
            page.locator("#choice").evaluate("e=>e.classList.add('is-focus')")
            static_shadow = page.locator("#choice .m-choice__box").evaluate("e=>getComputedStyle(e).boxShadow")
            page.locator("#choice").evaluate("e=>e.classList.remove('is-focus')")
            check("static is-focus comparison reuses the keyboard shadow without outline",
                  static_shadow == focus_state["shadow"]
                  and page.locator("#choice .m-choice__box").evaluate("e=>getComputedStyle(e).outlineStyle") == "none",
                  {"keyboard": focus_state["shadow"], "static": static_shadow})
            page.evaluate("document.activeElement.blur()")
            page.locator("#choice-text").click()
            pointer_state = page.locator("#choice-input").evaluate("""e=>{
              const c=getComputedStyle(e.nextElementSibling);
              return {active:document.activeElement===e,focusVisible:e.matches(':focus-visible'),
                      outline:c.outlineStyle,shadow:c.boxShadow};
            }""")
            check("pointer focus: no keyboard-only ring is introduced",
                  pointer_state["active"] and not pointer_state["focusVisible"]
                  and pointer_state["outline"] == "none" and pointer_state["shadow"] == "none",
                  pointer_state)

            # B02 owns one shell ring around its 26px line box, not a second input ring.
            page.locator("#field-input").focus()
            field_focus = page.locator("#field-shell").evaluate("""e=>({
              inputFocused:e.contains(document.activeElement),
              shadow:getComputedStyle(e).boxShadow,
              inputOutline:getComputedStyle(e.querySelector('input')).outlineStyle,
              shellHeight:e.getBoundingClientRect().height,
              lineHeight:getComputedStyle(e.querySelector('input')).lineHeight
            })""")
            check("B02 focus forwards to the 52px shell around 26px text",
                  field_focus["inputFocused"] and field_focus["shadow"] != "none"
                  and field_focus["inputOutline"] == "none"
                  and field_focus["shellHeight"] >= 52 and field_focus["lineHeight"] == "26px",
                  field_focus)

            # Representative text zoom: scale actual rendered labels without changing the narrow parent.
            page.set_viewport_size({"width": 320, "height": 1200})
            page.evaluate("""()=>{
              const root=document.querySelector('#narrow');
              const nodes=[root,...root.querySelectorAll('*')];
              const base=nodes.map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);
              base.forEach(([e,size])=>e.style.fontSize=(size*2)+'px');
            }""")
            zoom = page.evaluate("""()=>{
              const p=document.querySelector('#narrow').getBoundingClientRect();
              const c=document.querySelector('#choice').getBoundingClientRect();
              const f=document.querySelector('#field-shell').getBoundingClientRect();
              return {page:[document.documentElement.scrollWidth,document.documentElement.clientWidth],
                      parentWidth:p.width,choice:[c.width,c.height],
                      field:[f.width,f.height],font:getComputedStyle(document.querySelector('#choice-text')).fontSize};
            }""")
            check("320px + 200% representative text: narrow controls reflow without page overflow",
                  zoom["page"][0] <= zoom["page"][1] and zoom["choice"][0] <= zoom["parentWidth"]
                  and zoom["choice"][1] >= 48 and zoom["field"][0] <= zoom["parentWidth"]
                  and zoom["field"][1] >= 52 and zoom["font"] == "32px", zoom)
            page.locator("#narrow").screenshot(path=str(out / "narrow-text-200.png"))

            reduced = browser.new_context(viewport={"width": 390, "height": 1200}, reduced_motion="reduce")
            reduced_page = reduced.new_page()
            reduced_page.goto(f"http://127.0.0.1:{server.server_port}{FIXTURE_PATH}", wait_until="load")
            reduced_state = reduced_page.evaluate("""()=>({
              preference:matchMedia('(prefers-reduced-motion: reduce)').matches,
              choice:getComputedStyle(document.querySelector('.m-choice__box')).transitionDuration,
              segment:getComputedStyle(document.querySelector('.m-seg__item')).transitionDuration,
              spinner:getComputedStyle(document.querySelector('.m-wait__spinner')).animationName
            })""")
            check("reduced motion: selection transitions and message spinner are static",
                  reduced_state["preference"] and reduced_state["choice"] == "0s"
                  and reduced_state["segment"] == "0s" and reduced_state["spinner"] == "none",
                  reduced_state)
            check("no page errors or failed resources", not errors, errors)
            reduced.close()
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    passed = sum(row["passed"] for row in rows)
    report = {"browser": browser_version, "scope": "Chromium rendered geometry; no physical-device, screen-reader, Safari or native-zoom claim",
              "passed": passed, "failed": len(rows) - passed, "checks": rows}
    (out / "verification.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{passed} PASS / {len(rows) - passed} FAIL — {out}")
    return 0 if passed == len(rows) else 1


if __name__ == "__main__":
    raise SystemExit(main())
