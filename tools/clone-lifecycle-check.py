#!/usr/bin/env python3
"""Source-only clone/rebind regressions; retained DOM markers are not live resources."""
import argparse
import http.server
import json
from pathlib import Path
import subprocess
import tempfile
import threading
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]
FAMILIES = ['buttons', 'selection', 'organization', 'messages', 'navigation',
            'account-settings', 'info-strip', 'metric-comparison', 'data']
SCRIPT = r'''() => {
  const results=[];
  function clone(html,api,test){
    let original=document.createElement('div');original.innerHTML=html;
    document.body.append(original);api.init(original);
    const ownedIds=[...original.querySelectorAll('table')].map(e=>e.id);
    let copy=original.cloneNode(true);api.disconnect(original);original.remove();
    document.body.append(copy);api.init(copy);api.init(copy);
    const result=test(copy);results.push(result);
    if(ownedIds.length) result.ownedIdsFresh=[...copy.querySelectorAll('table')].every(e=>!ownedIds.includes(e.id));
    api.disconnect(copy);api.init(copy);api.init(copy);
    result.reattach=test(copy).passed;
    api.disconnect(copy);copy.remove();
  }
  clone('<div data-choice-group><input type="checkbox" data-select-all><input type="checkbox" data-choice-item></div>',MicroSelection,c=>{
    const all=c.querySelector('[data-select-all]'),item=c.querySelector('[data-choice-item]');
    all.checked=false;item.checked=false;all.click();
    return {family:'selection',name:'group clone and repeat init',passed:item.checked};
  });
  clone('<div data-seg><button class="m-seg__item" aria-pressed="true">أ</button><button class="m-seg__item" aria-pressed="false">ب</button></div>',MicroSelection,c=>{
    const [first,next]=c.querySelectorAll('button');first.click();
    let count=0;const listener=()=>count++;c.addEventListener('micro-selection:segment',listener);
    next.click();c.removeEventListener('micro-selection:segment',listener);
    return {family:'selection',name:'segmented clone dispatches exactly once',passed:next.getAttribute('aria-pressed')==='true'&&count===1};
  });
  clone('<section class="m-section"><button class="m-section__head" aria-expanded="false">عنوان</button><div class="m-section__body" hidden>تفصيل</div></section>',MicroOrganization,c=>{
    const btn=c.querySelector('button'),body=c.querySelector('.m-section__body');btn.setAttribute('aria-expanded','false');body.hidden=true;btn.click();
    return {family:'organization',name:'cloned section opens exactly once',passed:!body.hidden&&btn.getAttribute('aria-expanded')==='true'};
  });
  clone('<div class="m-note"><button class="m-note__close">إغلاق</button>رسالة</div>',MicroMessages,c=>{
    const note=c.querySelector('.m-note');note.hidden=false;c.querySelector('button').click();
    return {family:'messages',name:'cloned message can close',passed:note.hidden};
  });
  clone('<div data-tabs><button role="tab" aria-selected="true" aria-controls="clone-a">أ</button><button role="tab" aria-selected="false" aria-controls="clone-b">ب</button></div><div role="tabpanel" id="clone-a">أ</div><div role="tabpanel" id="clone-b" hidden>ب</div>',MicroNavigation,c=>{
    const [a,b]=c.querySelectorAll('[role=tab]');a.click();b.click();
    return {family:'navigation',name:'cloned tabs switch real panels',passed:!c.querySelector('#clone-b').hidden&&c.querySelector('#clone-a').hidden};
  });
  clone('<button data-layer-open="clone-dialog">فتح</button><div class="m-layer" id="clone-dialog" hidden role="dialog" aria-label="حوار"><button data-layer-close>إغلاق</button></div>',MicroNavigation,c=>{
    const layer=c.querySelector('.m-layer');c.querySelector('[data-layer-open]').click();const opened=!layer.hidden;
    MicroNavigation.disconnect(c); // Also cancels pending open/close; next init must bind every behavior again.
    MicroNavigation.init(c);MicroNavigation.openLayer(layer);c.querySelector('[data-layer-close]').click();
    return {family:'navigation',name:'cloned layer open/close bindings',passed:opened&&layer.hidden};
  });
  clone('<div data-account-settings data-account-layer-id="clone-layer"><button data-account-open>فتح</button><div class="m-layer" id="clone-layer" hidden><h2 id="ct" data-account-title="account">الحساب</h2><div data-account-view="account">حساب</div><div data-account-view="application" hidden>تطبيق</div></div></div>',MicroAccountSettings,c=>{
    c.querySelector('button').click();const passed=!c.querySelector('.m-layer').hidden;
    MicroNavigation.disconnect(c);return {family:'account-settings',name:'cloned account composition opens',passed};
  });
  clone('<div data-info-strip class="m-info-strip"><div class="m-info-strip__viewport" data-info-strip-viewport><div class="m-info-strip__track" data-info-strip-track><article class="m-info-strip__slide">أ</article><article class="m-info-strip__slide">ب</article></div></div><div data-info-strip-controls><button data-info-strip-prev>السابق</button><span data-info-strip-position></span><button data-info-strip-next>التالي</button></div></div>',MicroInfoStrip,c=>{
    c.querySelector('[data-info-strip-next]').click();
    return {family:'info-strip',name:'cloned strip advances to second reading',passed:c.querySelector('[data-info-strip-position]').textContent.trim().startsWith('2')};
  });
  clone('<div data-metric-circles class="m-metric-circles"><h3 class="m-metric-circles__title">قياس</h3><ul data-metric-source hidden><li data-series="a" data-label="أ" data-value="2"></li></ul><div data-metric-items></div></div>',MicroMetricComparison,c=>{
    const r=c.querySelector('[data-metric-circles]');
    return {family:'metric-comparison',name:'cloned metric acquires its own responsive observer',passed:!!(r.__microMetricResizeObserver||r.__microMetricResizeListener)};
  });
  const chartHtml='<section class="m-chart" data-chart="bars" data-max="10"><h3 class="m-chart__title">قراءة</h3><ul class="m-chart__data" hidden><li data-series="a" data-label="أ" data-value="2"></li></ul><div data-plot></div></section>';
  function tableTest(c,family) {
    const button=c.querySelector('button[aria-controls]'),table=c.querySelector('table');
    table.hidden=true;button.setAttribute('aria-expanded','false');button.click();
    return {family,name:'cloned generated table disclosure',passed:!table.hidden&&button.getAttribute('aria-expanded')==='true'};
  }
  clone(chartHtml,MicroData,c=>tableTest(c,'data'));
  clone(chartHtml.replace('data-chart="bars"','data-chart="bubbles" data-chart-packed'),
    {init:MicroPacked.init,disconnect:r=>{if(MicroPacked.disconnect)MicroPacked.disconnect(r)}},c=>tableTest(c,'packed-circle'));
  clone('<div data-metric-circles class="m-metric-circles"><h3 class="m-metric-circles__title">قياس</h3><ul data-metric-source hidden><li data-series="a" data-label="أ" data-value="2"></li></ul><div data-metric-items></div></div>',MicroMetricComparison,c=>tableTest(c,'metric-comparison'));
  const packed=document.createElement('section');packed.className='m-chart';packed.setAttribute('data-chart-packed','');
  packed.innerHTML='<h3 class="m-chart__title">قياس</h3><ul class="m-chart__data" hidden><li data-series="a" data-value="2" data-label="أ"></li></ul><div data-plot></div>';
  const beforePacked=window.auditROs.size;
  document.body.append(packed);MicroPacked.init(packed);MicroPacked.init(packed);
  results.push({family:'packed-circle',name:'init handles the matching root itself',passed:!!packed.querySelector('.m-bubble')&&!!packed.querySelector('table')});
  if(MicroPacked.disconnect) MicroPacked.disconnect(packed);
  results.push({family:'packed-circle',name:'disconnect releases its width observers',passed:typeof MicroPacked.disconnect==='function'&&window.auditROs.size===beforePacked});
  packed.remove();
  return results;
}'''


class Handler(http.server.SimpleHTTPRequestHandler):
    source_ref = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path == '/clones.html':
            links=''.join(f'<link rel="stylesheet" href="/components/{f}/{f}.css">' for f in FAMILIES)
            scripts=''.join(f'<script src="/components/{f}/{f}.js"></script>' for f in FAMILIES)+'<script src="/components/data/packed-circle.js"></script>'
            body=('<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8">'
                  '<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,">'
                  '<link rel="stylesheet" href="/shared/tokens.css">'+links+
                  '<style>body{margin:8px}.m-info-strip{max-width:100%}</style>'+scripts+'</html>').encode()
        elif self.source_ref and self.path.endswith('.js'):
            body=subprocess.check_output(['git','show',self.source_ref+':'+self.path.lstrip('/')],cwd=ROOT)
        else:
            return super().do_GET()
        self.send_response(200)
        self.send_header('Content-Type','application/javascript' if self.path.endswith('.js') else 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(body)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out',type=Path)
    parser.add_argument('--source-ref',help='read-only reproduction against a recorded Git ref; never switches branches')
    args=parser.parse_args()
    Handler.source_ref=args.source_ref
    out=args.out or Path(tempfile.mkdtemp(prefix='micro-clones-'))
    out.mkdir(parents=True,exist_ok=True)
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
    threading.Thread(target=server.serve_forever,daemon=True).start()
    errors=[]
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(**chromium_launch_options())
            page=browser.new_page(viewport={'width':360,'height':780},color_scheme='light',reduced_motion='reduce')
            page.add_init_script('''window.auditROs=new Set();const RO=window.ResizeObserver;
              window.ResizeObserver=class extends RO {
                observe(target,opts){auditROs.add(this);return super.observe(target,opts)}
                disconnect(){auditROs.delete(this);return super.disconnect()}
              };''')
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(f'http://127.0.0.1:{server.server_port}/clones.html')
            results=page.evaluate(SCRIPT)
            page.wait_for_timeout(100)
            results.append({'family':'runtime','name':'no runtime errors','passed':not errors,'detail':errors})
            version=browser.version
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    checks=[]
    for row in results:
        checks.append({**row,'name':row['name']+' / clone'})
        if 'reattach' in row:
            checks.append({'family':row['family'],'name':row['name']+' / reconnect','passed':row['reattach']})
        if 'ownedIdsFresh' in row:
            checks.append({'family':row['family'],'name':row['name']+' / independent generated IDs','passed':row['ownedIdsFresh']})
    for row in checks: print(('PASS ' if row['passed'] else 'FAIL ')+row['name'])
    passed=sum(r['passed'] for r in checks)
    report={'browser':version,'sourceRef':args.source_ref or 'working tree','passed':passed,'failed':len(checks)-passed,
            'checks':checks,'scope':'source only, 360x780 RTL, Light; no Showcase styles, no Dark/zoom'}
    (out/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f'{passed} PASS / {len(checks)-passed} FAIL')
    return int(passed!=len(checks))


if __name__=='__main__':
    raise SystemExit(main())
