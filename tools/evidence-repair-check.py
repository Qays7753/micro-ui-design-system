#!/usr/bin/env python3
"""Owner-scoped F01–F09 regression: 360x780 RTL, narrow risks, one Calendar LTR.

Only Calendar tools receive simulated 200% text, once per run. No zoom policy
or viewport metadata is changed. Fixtures are served in memory from source.
"""
import argparse
import hashlib
import http.server
import importlib.util
import json
import subprocess
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('data_fixture', ROOT / 'tools/light-data-check.py')
fixture = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fixture)
EXTRA = '''<section id="single-strip" class="m-info-strip" data-info-strip data-controls="compact">
<div class="m-info-strip__viewport" data-info-strip-viewport tabindex="0"><div class="m-info-strip__track" data-info-strip-track>
<article class="m-info-strip__slide"><div class="m-info-card">قراءة واحدة</div></article></div></div>
<div class="m-info-strip__controls" data-info-strip-controls><button data-info-strip-prev>السابق</button>
<span data-info-strip-position></span><button data-info-strip-next>التالي</button></div></section>
<link rel="stylesheet" href="/components/info-strip/info-strip.css"><script src="/components/info-strip/info-strip.js"></script>'''


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path == '/repair-fixture.html':
            content = fixture.FIXTURE.replace('</body>', EXTRA + '</body>').encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(content)
        else:
            super().do_GET()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--out', required=True, type=Path)
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    checks, errors, measurements = [], [], {}

    def check(name, ok, detail=None):
        checks.append(dict(name=name, passed=bool(ok), detail=detail))
        print(('PASS ' if ok else 'FAIL ') + name, flush=True)

    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    with sync_playwright() as pw:
        browser = pw.chromium.launch(**chromium_launch_options())
        browser_version = browser.version
        page = browser.new_page(viewport=dict(width=360, height=780), reduced_motion='reduce')
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('response', lambda r: errors.append(f'{r.status} {r.url}') if r.status >= 400 else None)
        showcase = base + '/previews/ui-system-showcase/index.html'
        page.goto(showcase)
        page.evaluate('document.fonts.ready')
        colors = page.locator('.app-hero .m-surface__sub').evaluate('''e=>{
          const rgb=s=>s.match(/[\\d.]+/g).slice(0,3).map(Number);
          const lum=c=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
          let fg=rgb(getComputedStyle(e).color),bg=rgb(getComputedStyle(e.closest('.m-surface')).backgroundColor);
          let l=[lum(fg),lum(bg)].sort((a,b)=>a-b);return {ratio:(l[1]+.05)/(l[0]+.05),fg,bg};}''')
        check('F01 hero secondary text contrast >=4.5', colors['ratio'] >= 4.5, colors)
        page.locator('[data-app-nav-item="orders"]').click()
        page.screenshot(path=str(args.out/'calendar-five-rows-360x780.png'))
        page.evaluate('''() => {let i=MicroOrderSchedule.getInstance(document.querySelector('#app-ocal-root'));
          i.setData([{id:'probe',title:'طلب للتحقق من ظهور البطاقة',date:'2026-08-07',time:'14:30',statusKey:'progress'}]);i.setSelectedDate('2026-08-07');}''')
        page.evaluate('document.fonts.ready')
        page.wait_for_timeout(350)
        page.screenshot(path=str(args.out/'calendar-six-rows-360x780.png'))
        fold = page.evaluate('''() => {const r=document.querySelector('#app-ocal-root'),o=r.querySelector('[data-ocal-action="order-row"]').getBoundingClientRect(),n=document.querySelector('[data-app-nav]').getBoundingClientRect();return {rows:r.querySelectorAll('[data-ocal-grid] [role="row"]').length,orderBottom:o.bottom,navTop:n.top};}''')
        measurements['fold'] = fold
        check('F08 first order fully above navbar in six-row month', fold['rows'] == 6 and fold['orderBottom'] <= fold['navTop'], fold)
        grid = page.evaluate('''() => {let r=document.querySelector('#app-ocal-root'),row=r.querySelector('.m-ocal__gridrow'),cell=row.children[1];let s=getComputedStyle(cell);return {rowBorder:getComputedStyle(row).borderBlockEndWidth,cellBorder:s.borderInlineStartWidth,cellColor:s.borderInlineStartColor,legendBorder:getComputedStyle(r.querySelector('.m-ocal__legend')).borderTopWidth};}''')
        check('Calendar B dividers only in day grid', grid['cellBorder'] == '1px' and '0.6' in grid['cellColor'] and grid['legendBorder'] == '0px', grid)
        # LTR is checked once, only on the direction-sensitive Calendar.
        page.evaluate("document.documentElement.dir='ltr'")
        page.wait_for_timeout(100)
        days = page.locator('#app-ocal-root [data-ocal-grid] [role="row"]').first.locator('button').evaluate_all('es=>es.map(e=>({x:e.getBoundingClientRect().x,date:e.dataset.ocalDate}))')
        check('Calendar LTR date order follows physical columns', len(days) == 7 and all(a['x'] < b['x'] and a['date'] < b['date'] for a,b in zip(days,days[1:])), days)
        page.evaluate("document.documentElement.dir='rtl'")
        page.locator('#app-ocal-root [data-ocal-action="mode-toggle"]').click()
        check('Calendar/List retains the selected order', page.locator('#app-ocal-root [data-ocal-action="order-row"]').count() == 1)
        page.locator('#app-ocal-root [data-ocal-action="order-row"]').click()
        check('order accordion exposes inline edit/delete', page.locator('#app-ocal-root [data-ocal-action="edit"]').count() + page.locator('#app-ocal-root [data-ocal-action="order-edit"]').count() > 0)
        page.locator('#app-ocal-root [data-ocal-action="mode-toggle"]').click()
        def control_geometry():
            return page.evaluate('''() => {let cs=[...document.querySelectorAll('#app-ocal-root .m-ocal__controls button')].filter(e=>e.getBoundingClientRect().height),pairs=[];for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){let a=cs[i].getBoundingClientRect(),b=cs[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)pairs.push([cs[i].textContent,cs[j].textContent]);}return {overlaps:pairs,clipped:cs.filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>e.textContent),overflow:document.documentElement.scrollWidth>innerWidth};}''')
        page.set_viewport_size(dict(width=320,height=780))
        check('narrow Calendar controls fit at 320', not control_geometry()['overlaps'] and not control_geometry()['overflow'], control_geometry())
        page.set_viewport_size(dict(width=360,height=780))
        page.evaluate('''() => {let es=[...document.querySelectorAll('#app-ocal-root .m-ocal__controls, #app-ocal-root .m-ocal__controls *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);es.forEach(([e,s])=>e.style.setProperty('font-size',s*2+'px','important'));}''')
        page.wait_for_timeout(100)
        geometry = control_geometry()
        measurements['calendarTools200'] = geometry
        check('F09 Calendar tools at simulated 200% do not overlap or clip', not geometry['overlaps'] and not geometry['clipped'] and not geometry['overflow'], geometry)
        page.screenshot(path=str(args.out/'calendar-tools-200text-360x780.png'))
        page.goto(showcase+'#component-review')
        check('F04 Full Component Review has its own mode', page.get_attribute('body','data-view') == 'review')
        review_select = page.locator('#sc-review-family')
        check('F04 review navigation covers 14 families', review_select.locator('option').count() == 14)
        if review_select.count():
            families = review_select.locator('option').evaluate_all('es=>es.map(e=>e.value)')
            for family in families:
                review_select.select_option(family)
                visible = page.locator('#sc-canvas .sc-section [data-catalog-family]').evaluate_all('es=>[...new Set(es.filter(e=>e.getClientRects().length).map(e=>e.dataset.catalogFamily))]')
                check('F04 organized family '+family, visible == [family], visible)
            for family, selectors in [('data',['[data-chart="donut"]','[data-chart="bubbles"]:not([data-chart-packed])','[data-chart-packed]']),('metric-comparison',['[data-metric-circles]','.m-main-metric--featured']),('info-strip',['[data-info-peek]'])]:
                review_select.select_option(family)
                for selector in selectors:
                    nodes=page.locator('#sc-canvas '+selector)
                    check('F04 actual review variant '+selector, any(n.is_visible() for n in nodes.all()))
            check('F04 diagnostic fixture controls hidden in review', not page.locator('.showcase-controls').is_visible())
        page.goto(showcase+'#state-lab')
        measurements['carousel'] = page.locator('#sc-carousel-root').evaluate('''c=>{const v=c.querySelector('[data-viewport]').getBoundingClientRect(),s=c.querySelector('[data-current=true]').getBoundingClientRect();return {left:s.left-v.left,width:c.getBoundingClientRect().width,peek:c.dataset.peek==='true'};}''')
        policy_spec=importlib.util.spec_from_file_location('carousel_expectation', ROOT/'tools/professional-ui-repair-check.py')
        policy=importlib.util.module_from_spec(policy_spec)
        policy_spec.loader.exec_module(policy)
        check('F05 current Carousel matches full-width default expectation', policy.fits_carousel_policy(measurements['carousel']), measurements['carousel'])
        page.goto(base+'/repair-fixture.html')
        page.evaluate('document.fonts.ready')
        expectation_spec=importlib.util.spec_from_file_location('table_expectation', ROOT/'tools/complete-repair-chart-check.py')
        expectation=importlib.util.module_from_spec(expectation_spec)
        expectation_spec.loader.exec_module(expectation)
        actual=page.evaluate('''() => {let c=document.querySelector('#bars');c.querySelector('[data-value]').setAttribute('data-value','غير رقمي');MicroData.render(c);return c.querySelector('tbody tr td').textContent;}''')
        check('F05 table expectation preserves raw malformed reading', actual == expectation.expected_table_value({'value':'غير رقمي'}), actual)
        packed = page.evaluate('''() => {let c=document.querySelector('#packed');c.setAttribute('data-unit','وحدة تحقق');c.setAttribute('data-period','فترة تحقق');c.querySelector('.m-chart__data').innerHTML='<li data-series="a" data-label="مشوهة" data-value="12oops" data-display="999"></li><li data-series="b" data-label="مفقودة"></li><li data-series="c" data-label="فارغة" data-value=""></li><li data-series="d" data-label="صفر" data-value="0"></li><li data-series="e" data-label="سالبة" data-value="-2"></li><li data-series="a" data-label="صالحة" data-value="8"></li>';MicroPacked.render(c);return {visible:c.innerText,table:c.querySelector('table').textContent};}''')
        check('F06 packed preserves malformed raw reading visibly', '12oops' in packed['visible'] and 'قيمة غير صالحة' in packed['visible'], packed)
        check('F06 packed table distinguishes malformed/missing/zero', all(v in packed['table'] for v in ['12oops','غير معروف','غير متاح','0 (صفر)','-2']), packed)
        check('F07 packed table includes visible title/unit/period', all(v in packed['table'] for v in ['تجميع بصري اختياري','وحدة تحقق','فترة تحقق']))
        metric = page.evaluate('''() => {let c=document.querySelector('#metric-circles');c.setAttribute('data-unit','وحدة تحقق');c.setAttribute('data-period','فترة تحقق');MicroMetricComparison.render(c);return c.querySelector('table').textContent;}''')
        check('F07 metric circles table retains title and context', all(v in metric for v in ['دوائر المقدار الاختيارية','وحدة تحقق','فترة تحقق']), metric)
        main = page.evaluate('''() => {let c=document.querySelector('#main-flat');c.querySelector('[data-bar-source] li').setAttribute('data-value','12oops');MicroMetricComparison.render(c);return c.querySelector('table').textContent;}''')
        check('F07 Main Metric table includes primary reading and raw invalid', all(v in main for v in ['القيمة الرئيسية','12','12oops','نقطة','الفترة التي حددها المضيف']), main)
        page.locator('#packed .m-chart__disclose').click()
        page.evaluate("MicroPacked.render(document.querySelector('#packed'))")
        check('table stays open after source rerender', page.locator('#packed table').is_visible() and page.locator('#packed .m-chart__disclose').get_attribute('aria-expanded') == 'true')
        page.set_viewport_size(dict(width=320,height=780))
        check('narrow tables preserve readings without document overflow', page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
        info = page.locator('#single-strip [data-info-strip-controls]').is_visible()
        check('Info Strip hides navigation for one reading', not info, dict(controlsVisible=info))
        check('no browser JavaScript/resource errors', not errors, errors)
        browser.close()
    server.shutdown()
    attr = subprocess.check_output(['git','check-attr','eol','--','assets/brand/micro-logo/v2/variants/full-color/micro-lockup-arabic.svg'],cwd=ROOT,text=True).strip()
    check('F03 SVG checkout pins LF', attr.endswith(': lf'), attr)
    current = (ROOT/'docs/CURRENT-STATE.md').read_text()
    check('F02 active Calendar summary describes real week and list modes', 'بلا عرض أسبوع' not in current.split('## الحالة السابقة')[0] and 'Calendar/List' in current.split('## الحالة السابقة')[0])
    report=dict(startingCommit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),browser=browser_version,checks=checks,measurements=measurements,passed=sum(r['passed'] for r in checks),failed=sum(not r['passed'] for r in checks),matrix='360x780 RTL; 320 narrow risks; Calendar LTR once; Calendar tools 200% once')
    (args.out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f"RESULT {report['passed']} PASS / {report['failed']} FAIL")
    return bool(report['failed'])


if __name__ == '__main__':
    raise SystemExit(main())
