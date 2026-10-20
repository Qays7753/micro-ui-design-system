"""Focused professional repair regressions; real Chromium, isolated source fixture."""
import argparse
import hashlib
import http.server
import json
import subprocess
import threading
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]
CSS = ["assets/fonts/fonts.css", "shared/tokens.css", "components/buttons/buttons.css",
       "components/fields/fields.css", "components/navigation/navigation.css",
       "components/data/data.css", "components/data/packed-circle.css",
       "components/carousel/carousel.css", "components/info-strip/info-strip.css",
       "components/metric-comparison/metric-comparison.css"]
JS = ["components/fields/fields.js", "components/data/data.js",
      "components/data/packed-circle.js", "components/carousel/carousel.js",
      "components/metric-comparison/metric-comparison.js"]
FIXTURE = """<div id="host">
<div id="action" class="m-actionbar"><button class="m-btn">إجراء بتسمية طويلة قابلة للالتفاف</button><button aria-label="بحث" class="m-btn m-btn--icon">+</button></div>
<div id="cards"><article class="m-info-card"><span class="m-info-card__label">قراءة واحدة</span><div class="m-info-card__reading"><b class="m-info-card__number">123,456</b></div></article>
<article class="m-info-card m-info-card--compact"><span class="m-info-card__label">قراءة واحدة</span><div class="m-info-card__reading"><b class="m-info-card__number">123,456</b></div></article></div>
<div class="m-carousel" data-carousel data-controls="compact" id="carousel">
<div class="m-carousel__viewport" data-viewport><ul class="m-carousel__track" data-track>
<li class="m-carousel__slide" data-carousel-slide><div class="m-carousel__card">قصيرة<button data-card-expand aria-controls="details" aria-expanded="false">تفاصيل</button><div id="details" data-card-details hidden>""" + "<p>تفاصيل موسعة كاملة دون قص</p>" * 6 + """</div></div></li>
<li class="m-carousel__slide" data-carousel-slide><div class="m-carousel__card">""" + "<p>محتوى طويل في البطاقة غير النشطة، لا يفرض ارتفاعه.</p>" * 12 + """</div></li>
</ul></div><div class="m-carousel__controls"><button class="m-carousel__btn" data-prev>‹</button><p class="m-carousel__status" data-status aria-live="polite"></p><button class="m-carousel__btn" data-next>›</button></div><div class="m-carousel__dots" data-dots></div></div>
<div id="charts"></div><div id="packed" class="m-chart m-chart--bubbles m-chart--packed" data-chart-packed data-max="100"><ul class="m-chart__data" hidden><li data-series="a" data-label="كبيرة" data-value="100"></li><li data-series="b" data-label="صغيرة" data-value="25"></li><li data-series="c" data-label="صفر" data-value="0"></li><li data-series="d" data-label="مفقود"></li><li data-series="e" data-label="سالب" data-value="-4"></li></ul><div data-plot></div></div>
<section class="m-main-metric m-main-metric--flat" data-main-comparison data-max="20" data-common-unit="عملية" data-common-period="اليوم" id="metric">
<div class="m-main-metric__layout"><div class="m-main-metric__hero"><span class="m-main-metric__label">قراءة رئيسية</span><span class="m-main-metric__value"><b class="m-main-metric__number">18</b><span class="m-main-metric__unit">عملية</span></span></div>
<div><ul data-bar-source hidden><li data-label="مؤشر" data-series="a" data-value="10" data-unit="عملية" data-period="اليوم"></li></ul><ul class="m-main-metric__rows" data-bar-items></ul><p data-bar-status></p></div></div></section></div>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path == "/fixture.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(self.fixture)
        else:
            super().do_GET()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tag", default="after")
    args = ap.parse_args()
    out = ROOT / "generated-artifacts" / "professional-ui-repair" / args.tag
    out.mkdir(parents=True, exist_ok=True)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_port}/"
    results, measurements, errors = [], [], []

    def check(name, ok, detail=None):
        results.append(dict(name=name, passed=bool(ok), detail=detail))
        print(("PASS " if ok else "FAIL ") + name)

    html = '<!doctype html><html><head><meta charset="utf-8"><base href="' + base + '"><link rel="icon" href="data:,">' + "".join(
        f'<link rel="stylesheet" href="{p}">' for p in CSS
    ) + """<style>body{margin:16px;font-family:var(--micro-font-family)}*{box-sizing:border-box}
    #host{min-width:0}#cards{display:grid;gap:8px;margin-block:16px}
    #charts{display:grid;gap:16px}.m-main-metric{margin-block:16px}</style></head><body>""" + FIXTURE + "".join(
        f'<script src="{p}"></script>' for p in JS) + "</body></html>"
    Handler.fixture = html.encode()
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            browser_version = browser.version
            for width in [320, 360, 390, 430]:
                for direction in ["rtl", "ltr"]:
                    ctx = browser.new_context(viewport={"width": width, "height": 900}, reduced_motion="reduce")
                    page = ctx.new_page()
                    page.on("pageerror", lambda e: errors.append(str(e)))
                    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
                    page.on("response", lambda r: errors.append(f"{r.status} {r.url}") if r.status >= 400 else None)
                    page.goto(base + "fixture.html", wait_until="load")
                    page.evaluate("(dir)=>document.documentElement.dir=dir", direction)
                    page.evaluate("()=>document.fonts.ready")
                    page.wait_for_timeout(150)
                    prefix = f"{width}/{direction}"
                    geometry = page.evaluate("""() => {
                      const box=e=>{const b=e.getBoundingClientRect();return {w:b.width,h:b.height}};
                      const cs=[...document.querySelectorAll('#packed .m-bubble__circle')];
                      const v=document.querySelector('[data-viewport]'),s=document.querySelector('[data-carousel-slide]');
                      return {fill:cs.every(e=>{const c=getComputedStyle(e);return c.backgroundColor!=='rgba(0, 0, 0, 0)' && parseFloat(c.borderRadius)>0}),
                        ratio:cs[0].offsetWidth/cs[1].offsetWidth, icon:box(document.querySelector('#action .m-btn--icon')),
                        active:box(s).h,viewport:box(v).h,defaultCard:box(document.querySelector('#cards>article')).h,
                        compactCard:box(document.querySelector('#cards>article+article')).h,
                        dots:[...document.querySelectorAll('[data-dots] button')].filter(e=>e.getBoundingClientRect().height>0).length,
                        flat:getComputedStyle(document.querySelector('#metric .m-main-metric__hero')).aspectRatio};
                    }""")
                    measurements.append(dict(viewport_width=width, direction=direction, **geometry))
                    check(prefix + " F01 visible packed circles; area ratio unchanged", geometry["fill"] and abs(geometry["ratio"] - 2) < .1, geometry)
                    check(prefix + " F03 square actionbar icon", abs(geometry["icon"]["w"] - 48) < 1 and abs(geometry["icon"]["h"] - 48) < 1, geometry["icon"])
                    check(prefix + " F03 stacked icon remains square; full-width text action", page.evaluate("""()=>{
                      const a=document.getElementById('action');a.classList.add('m-actionbar--stack');
                      const i=a.querySelector('.m-btn--icon').getBoundingClientRect(),t=a.querySelector('.m-btn').getBoundingClientRect();
                      a.classList.remove('m-actionbar--stack');return Math.abs(i.width-48)<1&&Math.abs(i.height-48)<1&&t.width>i.width;
                    }"""))
                    check(prefix + " F04 active height (inactive long slide)", abs(geometry["viewport"] - geometry["active"] - 16) < 2, geometry)
                    check(prefix + " F05 compact controls", geometry["dots"] == 0)
                    check(prefix + " F05 full controls opt-in retains direct 48px targets", page.evaluate("""()=>{
                      const c=document.getElementById('carousel');c.dataset.controls='full';
                      const buttons=[...c.querySelectorAll('[data-dots] button')];
                      const ok=buttons.length===2&&buttons.every(b=>b.offsetWidth>=48&&b.offsetHeight>=48);
                      buttons[1].click();const direct=MicroCarousel.getIndex(c)===1;MicroCarousel.goTo(c,0);c.dataset.controls='compact';return ok&&direct;
                    }"""))
                    check(prefix + " F08 compact info card opt-in", geometry["compactCard"] < geometry["defaultCard"])
                    check(prefix + " F09 flat opt-in", geometry["flat"] == "auto")
                    page.click("[data-card-expand]")
                    page.wait_for_timeout(100)
                    check(prefix + " F04 expansion/collapse height", page.evaluate("""()=>{const v=document.querySelector('[data-viewport]').getBoundingClientRect();const s=document.querySelector('[data-carousel-slide]').getBoundingClientRect();return s.height>200&&Math.abs(v.height-s.height-16)<2}"""))
                    page.click("[data-card-expand]")
                    page.evaluate("()=>MicroCarousel.next(document.querySelector('#carousel'))")
                    page.wait_for_timeout(80)
                    check(prefix + " F04 next long active slide not clipped", page.evaluate("""()=>{const v=document.querySelector('[data-viewport]');const s=document.querySelectorAll('[data-carousel-slide]')[1];return Math.abs(v.clientHeight-s.offsetHeight-16)<2&&MicroCarousel.getIndex(document.querySelector('#carousel'))===1}"""))
                    page.evaluate("()=>MicroCarousel.prev(document.querySelector('#carousel'))")
                    # Text, values and states use real source renderers, not screenshot-only checks.
                    for kind in ["bars", "line"]:
                        page.evaluate("""kind=>{
                          const c=document.createElement('div');c.id=kind;c.className='m-chart m-chart--'+kind;c.dataset.chart=kind;
                          c.innerHTML='<ul class="m-chart__data" hidden>'+[123456789012,123456789010,123456789011,0,-12,null,'bad'].map((v,i)=>'<li data-series="'+['a','b','c','d','e','a','b'][i]+'" data-label="قيمة طويلة مُقاسة '+i+' Long category" '+(v===null?'':'data-value="'+v+'"')+'></li>').join('')+'</ul><div data-plot></div><p data-summary></p>';
                          document.querySelector('#charts').append(c);MicroData.init(c);
                        }""", kind)
                        page.wait_for_timeout(80)
                        data = page.evaluate("""kind=>{
                          const c=document.getElementById(kind),svg=c.querySelector('svg');
                          const readings=c.querySelector('.m-chart__readings');
                          const values=[...c.querySelectorAll('.m-chart__bar-value,.m-chart__point-value')].filter(e=>e.getBoundingClientRect().width);
                          const rects=values.map(e=>e.getBoundingClientRect());
                          const overlap=rects.some((a,i)=>rects.some((b,j)=>j>i&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top));
                          const bounds=c.getBoundingClientRect(),clipped=rects.some(r=>r.left<bounds.left-1||r.right>bounds.right+1);
                          const labels=[...c.querySelectorAll('.m-chart__bar-label,.m-chart__x-label')];
                          const ys=[...new Set(labels.map(e=>+e.getAttribute('y')))].sort((a,b)=>a-b);
                          return {overlap,clipped,layout:c.dataset.valueLayout,visible:readings?readings.innerText:'',table:c.querySelector('table').textContent,
                            step:ys.length>1?ys[1]-ys[0]:0,svgHeight:svg.getBoundingClientRect().height};
                        }""", kind)
                        measurements.append(dict(viewport=width, direction=direction, chart=kind, **data))
                        check(prefix + f" F02 {kind} full 12-digit values without collision", not data["overlap"] and not data["clipped"] and "123456789012" in (data["visible"] if data["layout"] == "rows" else data["table"]), data)
                        check(prefix + f" F07 {kind} compact measured multiline step", 0 < data["step"] < 35, data["step"])
                        # Arabic presentation is optional; raw magnitude stays Latin numeric.
                        page.evaluate("""kind=>{const c=document.getElementById(kind);c.querySelector('[data-value]').dataset.display='١٢٣٤٥٦٧٨٩٠١٢';MicroData.render(c)}""", kind)
                        check(prefix + f" F02 {kind} full Arabic reading", page.evaluate("kind=>document.getElementById(kind).querySelector('[data-plot]').textContent.includes('١٢٣٤٥٦٧٨٩٠١٢')", kind))
                        check(prefix + f" F02 {kind} visible reading boxes never clip or overlap", page.evaluate("""kind=>{
                          const c=document.getElementById(kind),r=c.getBoundingClientRect();
                          const nodes=[...c.querySelectorAll('.m-chart__readings dd,.m-chart__readings dt')];
                          return nodes.length===14&&nodes.every(e=>{const b=e.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1&&e.scrollWidth<=e.clientWidth+1})
                            &&[...c.querySelectorAll('.m-chart__readings>div')].every(row=>{const a=row.children[0].getBoundingClientRect(),b=row.children[1].getBoundingClientRect();return a.bottom<=b.top+1||b.bottom<=a.top+1||a.right<=b.left+1||b.right<=a.left+1});
                        }""", kind))
                        page.locator("#" + kind).screenshot(path=str(out / f"chart-{kind}-{width}-{direction}.png"))
                    # Every category line has a measured safe line box even with enlarged text.
                    page.add_style_tag(content="#charts svg text {font-size:26px!important}")
                    page.evaluate("()=>{MicroData.render(document.getElementById('bars'));MicroData.render(document.getElementById('line'))}")
                    check(prefix + " F07 enlarged Arabic text lines do not collide", page.evaluate("""()=>{
                      return ['bars','line'].every(kind=>{
                        const c=document.getElementById(kind),texts=[...c.querySelectorAll('.m-chart__bar-label,.m-chart__x-label')];
                        return texts.every((a,i)=>texts.every((b,j)=>{if(j<=i||a.parentNode!==b.parentNode)return true;const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return x.bottom<=y.top+1||y.bottom<=x.top+1}));
                      });
                    }"""))
                    # Root/container lifecycle; repeated init is intentionally exercised.
                    lifecycle = page.evaluate("""() => {
                      const root=document.createElement('div');root.innerHTML='<div class="m-field" data-micro-field><div class="m-field__control"><input class="m-field__input m-field__input--num" maxlength="12" min="0" max="2" step="1" value="0"><div class="m-field__stepper"><button data-step="up">+</button><button data-step="down">−</button></div><button class="m-field__clear">مسح</button></div><span class="m-field__count"></span><p data-field-msg>رسالة</p></div>';
                      document.body.append(root);const f=root.firstElementChild;MicroFields.init(f);const rootBound=!!f.dataset.microFieldBound;MicroFields.init(root);MicroFields.init(f);
                      let n=0;f.addEventListener('micro-field:changed',()=>n++);f.querySelector('[data-step=up]').click();
                      const input=f.querySelector('input'),count=f.querySelector('.m-field__count');
                      const field=input.value==='1'&&n===1&&count.textContent==='1/12'&&input.hasAttribute('aria-describedby');
                      input.readOnly=true;f.querySelector('[data-step=up]').click();const locked=input.value==='1';
                      input.readOnly=false;input.disabled=true;f.querySelector('.m-field__clear').click();const disabled=input.value==='1';
                      input.disabled=false;f.querySelector('.m-field__clear').click();const clear=input.value===''&&document.activeElement===input;
                      window.renders=0;document.getElementById('bars').addEventListener('micro-data:rendered',()=>window.renders++);
                      MicroData.disconnect(document.getElementById('bars'));document.getElementById('bars').style.width='80%';
                      return {rootBound,field,locked,disabled,clear};
                    }""")
                    check(prefix + " F11 root init duplicate guard, count/message/stepper/locked/clear/focus", all(lifecycle.values()), lifecycle)
                    page.wait_for_timeout(100)
                    check(prefix + " F10 disconnected chart no resize rendering", page.evaluate("()=>window.renders===0"))
                    api = page.evaluate("""()=>{
                      if(typeof MicroMetricComparison.disconnect!=='function')return false;
                      const m=document.getElementById('metric');MicroMetricComparison.disconnect(m);
                      const clean=!m.__microMetricResizeObserver&&!m.__microMetricResizeListener&&!m.hasAttribute('data-bars-ready');
                      MicroMetricComparison.init(m);MicroMetricComparison.init(m);
                      return clean&&!!m.__microMetricResizeObserver;
                    }""")
                    check(prefix + " F12 root disconnect and re-init observer", api)
                    for cycle in range(3):
                        page.evaluate("""()=>{
                          MicroData.init(document.getElementById('charts'));
                          const m=document.getElementById('metric');MicroMetricComparison.init(m);window.metricObserver=m.__microMetricResizeObserver;MicroMetricComparison.init(m);
                        }""")
                        page.wait_for_timeout(60)
                        check(prefix + f" F12 cycle {cycle+1} no duplicate observer", page.evaluate("()=>window.metricObserver===document.getElementById('metric').__microMetricResizeObserver"))
                        page.evaluate("""cycle=>{
                          window.renders=0;MicroData.disconnect(document.getElementById('charts'));
                          document.getElementById('charts').style.width=cycle%2?'95%':'90%';
                          MicroMetricComparison.disconnect(document.getElementById('host'));
                        }""", cycle)
                        page.wait_for_timeout(60)
                        check(prefix + f" F10/F12 cycle {cycle+1} container disconnect cleans descendants", page.evaluate("""()=>{
                          const m=document.getElementById('metric');
                          return renders===0&&!m.__microMetricResizeObserver&&!m.__microMetricResizeListener&&!m.hasAttribute('data-bars-ready');
                        }"""))
                    check(prefix + " F11 multiple fields; dynamic min/max/step and readonly", page.evaluate("""()=>{
                      const f=document.querySelector('[data-micro-field]'),clone=f.cloneNode(true);delete clone.dataset.microFieldBound;
                      clone.querySelector('[data-field-msg]').removeAttribute('id');f.parentElement.append(clone);MicroFields.init(f.parentElement);MicroFields.init(f.parentElement);
                      const i=clone.querySelector('input');i.value='1';i.min='1';i.max='2';i.step='0.5';MicroFields.sync(clone);
                      clone.querySelector('[data-step=up]').click();const step=i.value==='1.5';
                      clone.querySelector('[data-step=up]').click();clone.querySelector('[data-step=up]').click();const max=i.value==='2';
                      for(let n=0;n<4;n++)clone.querySelector('[data-step=down]').click();const min=i.value==='1';
                      i.readOnly=true;clone.querySelector('[data-step=up]').click();return step&&max&&min&&i.value==='1';
                    }"""))
                    # Default plotting remains quiet when values fit; fallback is not universal.
                    check(prefix + " F02 normal-density values stay plotted", page.evaluate("""()=>{
                      const c=document.getElementById('bars');c.querySelector('.m-chart__data').innerHTML='<li data-series="a" data-label="أ" data-value="5"></li><li data-series="b" data-label="ب" data-value="10"></li>';
                      document.querySelectorAll('style').forEach(s=>{if(s.textContent.includes('#charts svg text'))s.remove()});MicroData.render(c);return c.dataset.valueLayout==='plot'&&!c.querySelector('.m-chart__readings');
                    }"""))
                    check(prefix + " F08/F09 long/missing/zero/negative/invalid text remains full", page.evaluate("""()=>{
                      const card=document.querySelector('#cards article+article'),hero=document.querySelector('#metric .m-main-metric__number');
                      return ['123456789012','١٢٣٤٥٦٧٨٩٠١٢','— غير متاح','0','-123456789012','غير صالح'].every(text=>{
                        card.querySelector('.m-info-card__label').textContent='تسمية عربية طويلة للغاية كاملة دون حذف Long label';
                        card.querySelector('.m-info-card__number').textContent=text;hero.textContent=text;MicroMetricComparison.render(document.getElementById('metric'));
                        return card.textContent.includes(text)&&hero.textContent===text&&card.scrollWidth<=card.clientWidth+1&&hero.scrollWidth<=hero.clientWidth+1;
                      });
                    }"""))
                    page.screenshot(path=str(out / f"fixture-{width}-{direction}.png"), full_page=True)
                    check(prefix + " no horizontal page overflow", page.evaluate("()=>document.documentElement.scrollWidth<=innerWidth"))
                    ctx.close()
            # Controlled no-ResizeObserver path, with deferred font readiness.
            fallback = browser.new_context(viewport={"width": 320, "height": 900})
            fallback.add_init_script("""window.ResizeObserver=undefined;
              Object.defineProperty(document.fonts,'ready',{value:new Promise(resolve=>window.resolveFonts=resolve)});
              window.resizeListeners=new Set();const add=window.addEventListener.bind(window),remove=window.removeEventListener.bind(window);
              window.addEventListener=function(type,fn,...args){if(type==='resize')resizeListeners.add(fn);return add(type,fn,...args)};
              window.removeEventListener=function(type,fn,...args){if(type==='resize')resizeListeners.delete(fn);return remove(type,fn,...args)};""")
            page = fallback.new_page()
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(base + "fixture.html")
            check("F12 controlled fallback listener bound once", page.evaluate("""()=>{
              const m=document.getElementById('metric'),fn=m.__microMetricResizeListener;
              MicroMetricComparison.init(m);MicroMetricComparison.init(m);
              return !!fn&&m.__microMetricResizeListener===fn&&resizeListeners.has(fn);
            }"""))
            page.evaluate("""()=>{
              const c=document.createElement('div');c.id='font-chart';c.dataset.chart='bars';c.className='m-chart m-chart--bars';
              c.innerHTML='<ul class="m-chart__data" hidden><li data-label="أ" data-series="a" data-value="5"></li></ul><div data-plot></div>';
              document.body.append(c);MicroData.init(c);window.lateRenders=0;c.addEventListener('micro-data:rendered',()=>lateRenders++);
              MicroData.disconnect(c);MicroMetricComparison.disconnect(document.getElementById('host'));
              MicroCarousel.disconnect(document.getElementById('carousel'));resolveFonts();
            }""")
            page.wait_for_timeout(100)
            check("F10/F12 deferred font callback does not reconnect disconnected roots", page.evaluate("""()=>{
              const m=document.getElementById('metric');return lateRenders===0&&!m.__microMetricResizeListener&&!m.__microMetricResizeObserver&&!m.hasAttribute('data-bars-ready');
            }"""))
            for cycle in range(3):
                check(f"F12 fallback cycle {cycle+1} cleanup/re-init no duplicate callbacks", page.evaluate("""()=>{
                  const m=document.getElementById('metric');MicroMetricComparison.init(m);const fn=m.__microMetricResizeListener;MicroMetricComparison.init(m);
                  const bound=m.__microMetricResizeListener===fn&&resizeListeners.has(fn);
                  MicroMetricComparison.disconnect(document.getElementById('host'));fn();window.dispatchEvent(new Event('resize'));
                  return bound&&!resizeListeners.has(fn)&&!m.__microMetricResizeListener&&m.__microMetricWidth===undefined;
                }"""))
            fallback.close()
            # Source showcase composition, natural surfaces and peek at all eight combinations.
            for width in [320, 360, 390, 430]:
                for direction in ["rtl", "ltr"]:
                    page = browser.new_page(viewport={"width": width, "height": 900}, reduced_motion="reduce")
                    page.on("pageerror", lambda e: errors.append(str(e)))
                    page.goto(base + "previews/ui-system-showcase/index.html")
                    page.evaluate("""({dir,width})=>{
                      document.querySelector('[data-sc-dir="'+dir+'"]').click();
                      document.querySelector('[data-sc-filter="all"]').click();
                      document.getElementById('sc-canvas').style.setProperty('--sc-canvas-width',width+'px');
                    }""", {"dir": direction, "width": width})
                    page.evaluate("()=>document.fonts.ready")
                    page.wait_for_timeout(100)
                    data = page.evaluate("""()=>{
                      const c=document.getElementById('sc-carousel-root'),v=c.querySelector('[data-viewport]'),s=c.querySelector('[data-current=true]');
                      const b=c.getBoundingClientRect(),vb=v.getBoundingClientRect(),sb=s.getBoundingClientRect();
                      const stage=document.querySelector('.sc-surface-stage .m-surface__content');
                      return {plain:c.closest('.sc-block').classList.contains('sc-block--plain'),width:b.width,
                        left:sb.left-vb.left,right:vb.right-sb.right,stageMin:getComputedStyle(stage).minHeight,
                        overflow:document.documentElement.scrollWidth>innerWidth,
                        controls:c.querySelector('.m-carousel__controls').getBoundingClientRect().height,
                        dots:[...c.querySelectorAll('[data-dots] button')].some(e=>e.offsetHeight>0)};
                    }""")
                    measurements.append(dict(viewport=width, direction=direction, showcase=data))
                    check(f"{width}/{direction} F06 natural own-surface composition and centered peek", data["plain"] and abs(data["left"]-data["right"])<2 and data["left"]>0 and not data["overflow"], data)
                    check(f"{width}/{direction} F05/F13 compact controls and natural surface stage", not data["dots"] and data["controls"]==48 and data["stageMin"]!="240px", data)
                    for section in ["sc-carousel", "sc-info-strip", "sc-metric", "sc-carousel-root", "sc-strip", "sc-main-metric-flat"]:
                        page.locator("#" + section).screenshot(path=str(out / f"{section}-{width}-{direction}.png"))
                    page.close()
            browser.close()
    finally:
        srv.shutdown()
    check("no JavaScript console/resource errors", not errors, errors)
    fingerprint = hashlib.sha256()
    for p in sorted(p for directory in ["components", "shared", "previews/ui-system-showcase"] for p in (ROOT / directory).rglob("*")):
        if p.is_file():
            fingerprint.update(p.relative_to(ROOT).as_posix().encode())
            fingerprint.update(p.read_bytes())
    report = dict(date=datetime.now(timezone.utc).isoformat(), commit=subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
                  source_sha256=fingerprint.hexdigest(), browser=f"Chromium {browser_version} (Playwright)", matrix="320/360/390/430 RTL/LTR; reduced motion", results=results, measurements=measurements, errors=errors)
    (out / "results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    passed = sum(r["passed"] for r in results)
    print(f"{passed} PASS / {len(results)-passed} FAIL -> {out}")
    return 0 if passed == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
