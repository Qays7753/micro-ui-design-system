#!/usr/bin/env python3
"""Current-source focused regressions; temporary in-memory fixture, no repo evidence."""
import argparse
import http.server
import json
from pathlib import Path
import tempfile
import threading

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]
CSS = ["shared/tokens.css", "components/buttons/buttons.css",
       "components/fields/fields.css", "components/info-strip/info-strip.css",
       "components/info-strip/info-strip-peek.css", "components/carousel/carousel.css",
       "previews/ui-system-showcase/showcase.css"]
JS = ["components/fields/fields.js", "components/info-strip/info-strip.js",
      "components/info-strip/info-strip-peek.js", "components/carousel/carousel.js"]


def strip(name, count, peek=False):
    slides = "".join(
        '<article class="m-info-strip__slide"><div class="m-info-card">'
        f'<p>البطاقة {i}</p><input dir="ltr" value="123456789012345" aria-label="قيمة">'
        '<textarea aria-label="نص">نص قابل للتحرير</textarea>'
        '<select aria-label="اختيار"><option>أ</option><option>ب</option></select>'
        '<div contenteditable><span>نص متداخل قابل للتحرير</span></div>'
        '<div contenteditable="plaintext-only">نص أصلي</div>'
        '<div role="textbox" tabindex="0">محرر مخصص</div>'
        '<button type="button">فعل محتوى</button></div></article>'
        for i in range(count))
    return f"""<section id="{name}" class="m-info-strip {'m-info-peek' if peek else ''}"
        data-info-strip {'data-info-peek' if peek else ''} data-controls="compact">
        <div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0">
        <div class="m-info-strip__track" data-info-strip-track>{slides}</div></div>
        <div class="m-info-strip__controls" data-info-strip-controls>
        <button data-info-strip-prev>السابق</button>
        <span data-info-strip-position></span><button data-info-strip-next>التالي</button>
        <div data-info-strip-pages></div></div>
        <p data-info-strip-status aria-live="polite"></p>
        <p data-info-strip-empty hidden>لا توجد قراءات</p></section>"""


def carousel(count):
    slides = "".join(
        '<li class="m-carousel__slide" data-carousel-slide><div class="m-carousel__card">'
        f'<p>بطاقة {i}</p><button class="m-btn" data-card-expand aria-expanded="false">'
        'تفاصيل</button><div data-card-details hidden>' +
        '<p>تفصيل عربي طويل متاح بالكامل، 123,456,789.50 د.أ</p>' * (i + 4) +
        '</div></div></li>' for i in range(count))
    return f"""<section class="m-carousel" data-carousel id="c{count}" data-controls="compact">
      <div class="m-carousel__viewport" data-viewport><ul class="m-carousel__track" data-track>
      {slides}</ul></div><div class="m-carousel__controls">
      <button class="m-carousel__btn" data-prev>السابق</button>
      <p data-status></p><button class="m-carousel__btn" data-next>التالي</button>
      </div><div data-dots></div></section>"""


FIELDS = "".join(
    f'<div class="m-field {extra}" id="f{state}" data-micro-field>'
    f'<label for="input-{state}" class="m-field__label">القيمة {state}</label>'
    '<div class="m-field__control">'
    f'<input id="input-{state}" class="m-field__input" value="123456789012345" {attr}>'
    '</div><p class="m-field__msg" data-field-msg>' +
    ('أكمل القيمة المطلوبة' if state == 'error' else 'مساعدة') + '</p></div>'
    for state, extra, attr in [("normal", "", ""), ("error", "has-error", ""),
                              ("readonly", "has-readonly", "readonly"),
                              ("disabled", "has-disabled", "disabled")])


class Handler(http.server.SimpleHTTPRequestHandler):
    fixture = b""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path == "/complete-lifecycle.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(self.fixture)
        else:
            super().do_GET()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=Path)
    args = ap.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix="micro-complete-lifecycle-"))
    out.mkdir(parents=True, exist_ok=True)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_port}"
    Handler.fixture = ('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">'
                       '<link rel="icon" href="data:,">' +
                       "".join(f'<link rel="stylesheet" href="/{p}">' for p in CSS) +
                       '<style>body{margin:16px}section{margin-block:16px;min-width:0}'
                       '[data-info-strip-track] input,[data-info-strip-track] textarea,'
                       '[data-info-strip-track] select{max-width:100%;min-width:0}'
                       '.m-field{margin-block:16px}</style></head><body>' +
                       FIELDS + '<button id="fallback" class="m-btn">إجراء</button>' +
                       "".join(strip(f"s{n}", n) + strip(f"p{n}", n, True) +
                               carousel(n) for n in [0, 1, 2, 7]) +
                       "".join(f'<script src="/{p}"></script>' for p in JS) +
                       '</body></html>').encode()
    results, errors = [], []

    def check(name, ok, detail=None):
        results.append({"name": name, "passed": bool(ok), "detail": detail})
        print(("PASS " if ok else "FAIL ") + name, flush=True)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            version = browser.version
            for width, direction in [(320, "rtl"), (360, "rtl"), (390, "rtl"),
                                     (430, "rtl"), (390, "ltr")]:
                page = browser.new_page(viewport={"width": width, "height": 844},
                                        reduced_motion="reduce")
                page.on("pageerror", lambda e: errors.append(str(e)))
                page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                page.on("response", lambda r: errors.append(f"{r.status} {r.url}") if r.status >= 400 else None)
                page.goto(base + "/complete-lifecycle.html")
                page.evaluate("(d)=>document.documentElement.dir=d", direction)
                page.evaluate("()=>document.fonts.ready")
                page.wait_for_timeout(100)
                pre = f"{width}/{direction}"
                for state in ["normal", "error", "readonly", "disabled"]:
                    data = page.locator("#f" + state).evaluate("""(f)=>{
                      const i=f.querySelector('input'),c=f.querySelector('.m-field__control');
                      document.activeElement.blur();const initial=getComputedStyle(c);
                      const before={bg:initial.backgroundColor,border:initial.borderColor,shadow:initial.boxShadow};
                      i.focus();const s=getComputedStyle(i),cs=getComputedStyle(c);
                      return {outline:s.outlineStyle,h:c.getBoundingClientRect().height,
                        shadow:cs.boxShadow,bg:cs.backgroundColor,focused:document.activeElement===i,
                        described:i.getAttribute('aria-describedby'),before};
                    }""")
                    check(pre + " field " + state + " geometry/focus isolation",
                          data["h"] >= 52 and data["outline"] == "none" and
                          data["focused"] == (state != "disabled"), data)
                    if state == "error":
                        check(pre + " error has full corrective message and ring",
                              bool(data["described"]) and "173, 48, 59" in data["shadow"])
                page.locator("#fallback").focus()
                check(pre + " non-field keyboard focus remains visible",
                      page.locator("#fallback").evaluate("""e=>{
                        const s=getComputedStyle(e);
                        return e.matches(':focus-visible') &&
                          (s.outlineStyle==='solid'||s.boxShadow!=='none');
                      }"""))
                # Native caret behavior is exercised with actual browser keys.
                for root in ["s2", "p2"]:
                    inp = page.locator(f"#{root} input").first
                    inp.focus()
                    inp.evaluate("e=>e.setSelectionRange(3,3)")
                    inp.press("ArrowLeft")
                    check(pre + f" {root} native input caret, no navigation",
                          inp.evaluate("e=>e.selectionStart===2") and
                          page.locator(f"#{root} [data-info-strip-position]").inner_text() == "1 / 2")
                    for key, expected in [("End", 15), ("Home", 0)]:
                        inp.press(key)
                        check(pre + f" {root} native {key}", inp.evaluate("e=>e.selectionStart") == expected)
                    for selector in ["input", "textarea", "select", "option", "[contenteditable] span",
                                     '[contenteditable="plaintext-only"]', '[role="textbox"]', 'button']:
                        data = page.locator("#" + root).evaluate("""(r,sel)=>{
                          const el=r.querySelector('[data-info-strip-track] '+sel);
                          const pos=r.querySelector('[data-info-strip-position]');
                          const before=pos.textContent;
                          const keys=['ArrowLeft','ArrowRight','Home','End'];
                          const events=keys.map(key=>{
                            const e=new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});
                            el.dispatchEvent(e);return e.defaultPrevented;});
                          return {same:pos.textContent===before,prevented:events.some(Boolean)};
                        }""", selector)
                        check(pre + f" {root} editing/local guard {selector}",
                              data["same"] and not data["prevented"], data)
                    viewport = page.locator(f"#{root} [data-info-strip-viewport]")
                    for mode in ["prevented", "composing"]:
                        check(pre + f" {root} {mode} key not intercepted",
                              viewport.evaluate("""(v,mode)=>{
                                const r=v.closest('[data-info-strip]');
                                const p=r.querySelector('[data-info-strip-position]'),before=p.textContent;
                                const e=new KeyboardEvent('keydown',{key:'End',bubbles:true,
                                  cancelable:true,isComposing:mode==='composing'});
                                if(mode==='prevented')e.preventDefault();
                                v.dispatchEvent(e);
                                return p.textContent===before && (mode==='prevented'||!e.defaultPrevented);
                              }""", mode))
                    for modifier in ["Alt", "Control", "Meta", "Shift"]:
                        viewport.focus()
                        viewport.press(modifier + "+End")
                        check(pre + f" {root} {modifier} shortcut not captured",
                              page.locator(f"#{root} [data-info-strip-position]").inner_text() == "1 / 2")
                    viewport.press("End")
                    check(pre + f" {root} End navigates and makes inactive inert",
                          page.locator(f"#{root} [data-info-strip-position]").inner_text() == "2 / 2" and
                          page.locator(f"#{root} .m-info-strip__slide").first.evaluate("e=>e.inert"))
                    viewport.press("Home")
                    viewport.press("ArrowLeft" if direction == "rtl" else "ArrowRight")
                    check(pre + f" {root} directional next", page.locator(
                        f"#{root} [data-info-strip-position]").inner_text() == "2 / 2")
                    # A focused descendant must never be left in an inert slide.
                    page.locator(f"#{root} input").nth(1).focus()
                    page.locator(f"#{root} [data-info-strip-prev]").evaluate("e=>e.click()")
                    check(pre + f" {root} focus leaves slide before inert",
                          viewport.evaluate("e=>document.activeElement===e"))
                for root_id, api_name in [("c7", "MicroCarousel"), ("p7", "MicroInfoPeek")]:
                    page.evaluate("""([id,api])=>{
                      const r=document.getElementById(id);window[api].goTo(r,1,{animate:false});
                      r._directionChanges=0;r.addEventListener(api==='MicroCarousel'?
                        'micro-carousel:change':'micro-info-peek:change',()=>r._directionChanges++);
                    }""", [root_id, api_name])
                    for level in ["root", "ancestor"]:
                        for target_dir in ["ltr" if direction == "rtl" else "rtl", direction]:
                            page.evaluate("""([id,level,dir])=>{
                              (level==='root'?document.getElementById(id):document.body).setAttribute('dir',dir);
                            }""", [root_id, level, target_dir])
                            page.wait_for_timeout(80)
                            check(pre + f" {root_id} fixed-width {level} direction {target_dir} recenters silently",
                                  page.evaluate("""([id,api])=>{
                                    const r=document.getElementById(id),index=window[api].getIndex(r),
                                      v=r.querySelector('[data-viewport],[data-info-strip-viewport]').getBoundingClientRect(),
                                      s=r.querySelectorAll('[data-carousel-slide],.m-info-strip__slide')[index].getBoundingClientRect();
                                    return index===1 && !r._directionChanges &&
                                      Math.abs((v.left+v.right)-(s.left+s.right))<2 &&
                                      s.left>=v.left-1 && s.right<=v.right+1;
                                  }""", [root_id, api_name]))
                        page.evaluate("""([id,level])=>
                          (level==='root'?document.getElementById(id):document.body).removeAttribute('dir')
                        """, [root_id, level])
                        page.wait_for_timeout(60)
                for n in [0, 1, 2, 7]:
                    for prefix in ["s", "p", "c"]:
                        root = page.locator("#" + prefix + str(n))
                        vp = "[data-viewport]" if prefix == "c" else "[data-info-strip-viewport]"
                        controls = ".m-carousel__controls" if prefix == "c" else "[data-info-strip-controls]"
                        check(pre + f" {prefix}{n} empty/single/control policy",
                              root.locator(controls).is_visible() == (n > 1) and
                              root.locator(vp).is_visible() == (n > 0))
                check(pre + " single peek reading uses the full viewport",
                      page.locator("#p1").evaluate("""r=>{
                        return Math.abs(r.querySelector('.m-info-strip__slide').getBoundingClientRect().width -
                          r.querySelector('[data-info-strip-viewport]').getBoundingClientRect().width)<1;
                      }"""))
                for prefix, api, vp, tr, dragging in [
                    ("p", "MicroInfoPeek", "[data-info-strip-viewport]",
                     "[data-info-strip-track]", "is-peek-dragging"),
                    ("c", "MicroCarousel", "[data-viewport]", "[data-track]", "is-dragging")]:
                    # Two components: disconnect one must leave the other active.
                    data = page.evaluate("""({prefix,api,vp,tr,dragging})=>{
                      const a=document.getElementById(prefix+'2'),b=document.getElementById(prefix+'7');
                      const engine=window[api],v=a.querySelector(vp),t=a.querySelector(tr);
                      engine.goTo(a,0);engine.goTo(b,0);let events=0;a.addEventListener(
                        api==='MicroCarousel'?'micro-carousel:change':'micro-info-peek:change',()=>events++);
                      v.dispatchEvent(new PointerEvent('pointerdown',{pointerId:9,clientX:100,clientY:100,bubbles:true}));
                      window.dispatchEvent(new PointerEvent('pointermove',{pointerId:9,clientX:180,clientY:102,bubbles:true,cancelable:true}));
                      const active=(api==='MicroCarousel'?a:t).classList.contains(dragging);
                      engine.disconnect(a);engine.disconnect(a);
                      window.dispatchEvent(new PointerEvent('pointerup',{pointerId:9,clientX:240,clientY:102,bubbles:true}));
                      const clean=!(api==='MicroCarousel'?a:t).classList.contains(dragging);
                      engine.next(a);a.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true,cancelable:true}));
                      const dragEvent=new Event('dragstart',{bubbles:true,cancelable:true});
                      v.dispatchEvent(dragEvent);
                      const blocked=engine.getIndex(a)===0&&events===0&&!dragEvent.defaultPrevented;
                      engine.next(b);const independent=engine.getIndex(b)===1;
                      return {active,clean,blocked,independent,transform:t.style.transform};
                    }""", dict(prefix=prefix, api=api, vp=vp, tr=tr, dragging=dragging))
                    check(pre + f" {api} disconnect releases active drag without callbacks",
                          all(data[k] for k in ["active", "clean", "blocked", "independent"]), data)
                    before = data["transform"]
                    page.evaluate("""({prefix,vp})=>{
                      document.getElementById(prefix+'2').querySelector(vp).style.width='210px';
                      window.dispatchEvent(new Event('resize'));
                    }""", dict(prefix=prefix, vp=vp))
                    page.wait_for_timeout(60)
                    check(pre + f" {api} resize/rAF after disconnect stays silent",
                          page.locator(f"#{prefix}2 {tr}").evaluate("e=>e.style.transform") == before)
                    data = page.evaluate("""({prefix,api,tr})=>{
                      const a=document.getElementById(prefix+'2'),e=window[api];
                      e.init(a);e.init(a);let n=0;a.addEventListener(
                        api==='MicroCarousel'?'micro-carousel:change':'micro-info-peek:change',()=>n++);
                      e.next(a);return {index:e.getIndex(a),events:n};
                    }""", dict(prefix=prefix, api=api, tr=tr))
                    check(pre + f" {api} double re-init one action/event",
                          data["index"] == 1 and data["events"] == 1, data)
                    page.evaluate("""({prefix,api,vp})=>{
                      const a=document.getElementById(prefix+'2');window[api].disconnect(a);
                      a.hidden=true;window[api].init(a);a.querySelector(vp).style.width='250px';
                    }""", dict(prefix=prefix, api=api, vp=vp))
                    page.wait_for_timeout(40)
                    page.locator(f"#{prefix}2").evaluate("e=>e.hidden=false")
                    page.wait_for_timeout(80)
                    check(pre + f" {api} hidden re-init centers after reveal",
                          page.locator(f"#{prefix}2").evaluate("""(r,vp)=>{
                            const v=r.querySelector(vp).getBoundingClientRect();
                            const s=r.querySelector('[data-current="true"],.m-info-strip__slide[aria-hidden="false"]').getBoundingClientRect();
                            return Math.abs((s.left+s.right)-(v.left+v.right))<2;
                          }""", vp))
                check(pre + " no page overflow",
                      page.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"))
                page.close()
            # Explicitly hold font readiness across disconnect/reconnect.
            page = browser.new_page(viewport={"width": 390, "height": 844})
            page.add_init_script("""Object.defineProperty(document,'fonts',{value:{
              ready:new Promise(resolve=>{window.resolveFonts=resolve;})}});""")
            page.goto(base + "/complete-lifecycle.html")
            page.evaluate("""()=>{
              const p=document.getElementById('p2');MicroInfoPeek.goTo(p,1);
              MicroInfoPeek.disconnect(p);window.beforeFont=p.querySelector('[data-info-strip-track]').style.transform;
              p.style.width='220px';resolveFonts();
            }""")
            page.wait_for_timeout(80)
            check("late fonts-ready cannot reanimate disconnected peek", page.evaluate("""()=>{
              return document.querySelector('#p2 [data-info-strip-track]').style.transform===beforeFont;
            }"""))
            page.evaluate("()=>MicroInfoPeek.init(document.getElementById('p2'))")
            page.wait_for_timeout(80)
            check("fonts-ready reconnect retains index", page.evaluate(
                "()=>MicroInfoPeek.getIndex(document.getElementById('p2'))===1"))
            browser.close()
    finally:
        srv.shutdown()
    check("no console/resource/JavaScript errors", not errors, errors)
    report = {"browser": version, "passed": sum(r["passed"] for r in results),
              "failed": sum(not r["passed"] for r in results), "results": results}
    (out / "results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps({k: report[k] for k in ["browser", "passed", "failed"]}) + " " + str(out))
    return int(bool(report["failed"]))


if __name__ == "__main__":
    raise SystemExit(main())
