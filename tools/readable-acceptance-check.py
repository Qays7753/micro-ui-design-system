#!/usr/bin/env python3
"""Acceptance of readable source: Light360 RTL/touch, targeted320 and LTR.
--capture-only retains honest failing baseline evidence; normal runs require0 failures.
"""
import argparse,hashlib,http.server,json,subprocess,tempfile,threading
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
    def log_message(self,*_):pass

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',type=Path);ap.add_argument('--capture-only',action='store_true');a=ap.parse_args()
    out=a.out or Path(tempfile.mkdtemp(prefix='reading-acceptance-'));out.mkdir(parents=True,exist_ok=True)
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
    checks=[];errors=[];measurements=[]
    def ck(name,passed,detail=None):
        checks.append(dict(name=name,passed=bool(passed),detail=detail));print(('PASS' if passed else 'FAIL')+' '+name,flush=True)
    with sync_playwright() as pw:
        browser=pw.chromium.launch(**chromium_launch_options());version=browser.version
        p=browser.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,device_scale_factor=1,color_scheme='light',locale='ar',reduced_motion='reduce')
        p.on('pageerror',lambda e:errors.append(str(e)));p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);p.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
        def ev(js):return p.evaluate(js)
        def go():
            p.goto(f'http://127.0.0.1:{server.server_port}/previews/readable-source/index.html',wait_until='networkidle');ev('document.fonts.ready')
            # Exercise the documented opt-in using its actual preview control.
            p.locator('#reading-options > summary').tap();p.locator('#preview-sales-selection').tap();p.locator('#reading-options > summary').tap();p.locator('#distribution-example > summary').tap()
        def shot(name,selector):p.locator(selector).screenshot(path=str(out/(name+'.png')))
        def geometry(name,selector):
            d=p.locator(selector).evaluate('''e=>{const b=e.getBoundingClientRect();return {left:b.left,right:b.right,width:b.width,scroll:document.documentElement.scrollWidth,viewport:innerWidth}}''');measurements.append(dict(name=name,**d));ck(name,d['left']>=-1 and d['right']<=d['viewport']+1 and d['scroll']<=d['viewport'],d)
        go()
        ck('Mobile emulation activates touch capability',ev('navigator.maxTouchPoints>0'))
        p.locator('#sales-bars .m-chart__select-step').last.tap();ck('Touch next reads next real item',ev("MicroData.getSelection(document.querySelector('#sales-bars')).key==='thu'"))
        p.locator('#sales-bars .m-chart__select-step').first.tap();ck('Touch previous restores original item',ev("MicroData.getSelection(document.querySelector('#sales-bars')).key==='wed'"))
        p.locator('#sales-bars .m-chart__select-range').tap();ck('Native range accepts touch without loss of exact reading',ev("(()=>{const item=MicroData.getSelection(document.querySelector('#sales-bars'));return item&&item.rawValue!==null})()"))
        p.locator('#expenses-group [data-reading-choice=delivery]').tap();ck('Touch donut selects full category row',ev("MicroData.getSelection(document.querySelector('#expenses-group')).value===320"))
        details=p.locator('#sales-group .m-reading-details');details.locator('summary').tap();ck('Disclosure opens with touch and preserves previous amount',details.evaluate('e=>e.open') and '4,180' in details.inner_text());details.locator('summary').tap();ck('Disclosure closes with touch',not details.evaluate('e=>e.open'))
        for name,sel in [('normal-sales','#sales-group'),('normal-expenses','#expenses-group'),('normal-rows','#stock-rows'),('normal-progress','#progress-example')]:geometry(name+'360',sel);shot(name+'360',sel)
        # A dynamic chart must not strand keyboard focus when an owned control disappears.
        ev("window.c=document.querySelector('#sales-bars');MicroData.setSelection(c,'thu')")
        p.locator('#sales-bars .m-chart__select-step').last.focus();p.locator('#sales-bars .m-chart__select-step').last.press('Enter')
        ck('Reaching the last item keeps focus on an enabled chart control',ev("document.activeElement===c.querySelector('input')&&!document.activeElement.disabled"),ev("({active:document.activeElement.tagName,cls:document.activeElement.className})"))
        ev("MicroData.setSelection(c,'wed')");p.locator('#sales-bars .m-chart__select-range').focus()
        ev("c.querySelector('li').dataset.unit='قطعة';MicroData.render(c)")
        ck('Mixed-context rerender returns removed control focus to data disclosure',ev("document.activeElement===c.querySelector('.m-chart__disclose')"),ev("({active:document.activeElement.tagName,cls:document.activeElement.className})"))
        p.locator('#sales-group summary').focus();ev("MicroData.render(c)")
        ck('Rerender never steals focus from an outside disclosure',ev("document.activeElement===document.querySelector('#sales-group summary')"))
        ev("c.querySelector('li').removeAttribute('data-unit');MicroData.render(c);MicroData.setSelection(c,'wed')");p.locator('#sales-bars .m-chart__select-range').focus()
        ev("c.removeAttribute('data-selection');MicroData.render(c)")
        ck('Selection opt-out returns focus to remaining disclosure',ev("document.activeElement===c.querySelector('.m-chart__disclose')"))
        ev("c.dataset.selection='single';MicroData.render(c);MicroData.setSelection(c,'wed')");p.locator('#sales-bars .m-chart__select-range').focus()
        ev("c.querySelector('[data-key=wed]').remove();MicroData.render(c)")
        ck('Removed selected key keeps focus on an enabled choice without selecting a replacement',ev("document.activeElement===c.querySelector('.m-chart__select-step:last-child')&&!document.activeElement.disabled&&MicroData.getSelection(c)===null"))
        go()
        # Contextual units inside a normal composite group. Only the caption is clipped.
        ev('''window.testGroup=document.createElement('section');testGroup.className='m-reading-group';testGroup.dataset.readingContext='acceptance-unit-label';testGroup.dataset.unit='د.أ';testGroup.innerHTML='<h2 class="m-reading-group__title">قيمة بسياق وحدة</h2><div id="caption-clip"><p id="acceptance-unit-label">هذا الأسبوع · د.أ</p></div><p><bdi dir="ltr">150</bdi> <span data-reading-unit="د.أ">د.أ</span></p>';document.querySelector('main').append(testGroup);window.caption=document.querySelector('#acceptance-unit-label');window.unit=testGroup.querySelector('[data-reading-unit]');window.clip=document.querySelector('#caption-clip');MicroReadings.sync(testGroup)''')
        ck('Visible complete caption permits context',ev("unit.classList.contains('m-reading-unit--contextual')"))
        ev("clip.style.cssText='height:0;overflow:hidden';MicroReadings.sync(testGroup)")
        ck('Ancestor-clipped caption restores unit',ev("!unit.classList.contains('m-reading-unit--contextual')"),ev("({captionHeight:caption.getBoundingClientRect().height,clipHeight:clip.getBoundingClientRect().height,unitClass:unit.className})"));shot('ancestor-clipped-context', '[data-reading-context="acceptance-unit-label"]')
        ev("clip.removeAttribute('style');caption.innerHTML='هذا الأسبوع <span hidden>د.أ</span>';MicroReadings.sync(testGroup)")
        ck('Hidden descendant cannot supply a currency caption',ev("!unit.classList.contains('m-reading-unit--contextual')"),ev("({visibleCaption:caption.innerText,textContent:caption.textContent,unitClass:unit.className})"));shot('hidden-currency-context','[data-reading-context="acceptance-unit-label"]')
        ev("caption.innerHTML='هذا الأسبوع <span style=\"opacity:0\">د.أ</span>';MicroReadings.sync(testGroup)")
        ck('Transparent descendant cannot supply a currency caption',ev("!unit.classList.contains('m-reading-unit--contextual')"))
        ev("caption.innerHTML='هذا الأسبوع <span style=\"position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)\">د.أ</span>';MicroReadings.sync(testGroup)")
        ck('Screen-reader-only currency cannot hide visible units',ev("!unit.classList.contains('m-reading-unit--contextual')"))
        ev("caption.innerHTML='هذا الأسبوع <strong>د.أ</strong>';MicroReadings.sync(testGroup)")
        ck('Visible nested currency still supports context',ev("unit.classList.contains('m-reading-unit--contextual')"))
        ev("clip.style.cssText='overflow:hidden';MicroReadings.sync(testGroup)")
        ck('Unclipped overflow container remains valid context',ev("unit.classList.contains('m-reading-unit--contextual')"))
        ev("testGroup.remove()")
        # Accessible and visible readouts must agree even if formatted input is stale.
        ev("window.c=document.querySelector('#sales-bars');window.first=c.querySelector('li');first.dataset.value='bad';first.dataset.display='150';MicroData.render(c);MicroData.setSelection(c,'sat')")
        data=ev("({aria:c.querySelector('input').getAttribute('aria-valuetext'),visible:c.querySelector('.m-chart__selection-value').textContent,raw:MicroData.getSelection(c).rawValue})")
        ck('Invalid value announces raw value and invalid state instead of stale display','bad' in data['aria'] and 'غير صالحة' in data['aria'] and '150' not in data['aria'],data);shot('invalid-formatted-reading','#sales-group')
        ev("first.dataset.value='-20';first.removeAttribute('data-display');MicroData.render(c);MicroData.setSelection(c,'sat')")
        ck('Unrendered negative is qualified in accessible reading','سالب غير مرسوم' in ev("c.querySelector('input').getAttribute('aria-valuetext')"))
        ev("first.dataset.value='';first.dataset.display='150';MicroData.render(c);MicroData.setSelection(c,'sat')")
        ck('Missing value never announces stale formatted amount','150' not in ev("c.querySelector('input').getAttribute('aria-valuetext')") and 'غير متاح' in ev("c.querySelector('input').getAttribute('aria-valuetext')"))
        # Distinct periods with repeated category names: the table itself must disambiguate.
        ev('''window.mixed=document.createElement('section');mixed.id='acceptance-periods';mixed.className='m-chart m-reading-group';mixed.dataset.chart='bars';mixed.dataset.presentation='readable';mixed.dataset.unit='د.أ';mixed.innerHTML='<h2 class="m-chart__title">قراءات بفترتين</h2><ul class="m-chart__data" hidden><li data-key="a" data-series="a" data-label="مواد" data-value="150" data-period="هذا الشهر"></li><li data-key="b" data-series="b" data-label="مواد" data-value="145" data-period="الشهر السابق"></li></ul><div class="m-chart__plot" data-plot></div>';document.querySelector('main').append(mixed);MicroData.init(mixed)''')
        p.locator('#acceptance-periods .m-chart__disclose').tap()
        ck('Mixed-period chart refuses geometry without dropping real values',ev("mixed.dataset.readingState==='mixed-context'&&!mixed.querySelector('svg')&&mixed.querySelector('[data-plot]').textContent.includes('150')&&mixed.querySelector('[data-plot]').textContent.includes('145')"))
        table=ev("({heads:[...mixed.querySelectorAll('thead th')].map(e=>e.textContent),rows:[...mixed.querySelectorAll('tbody tr')].map(e=>e.textContent),caption:mixed.querySelector('caption').textContent})")
        ck('Mixed-period table has a semantic period column','الفترة' in table['heads'],table)
        ck('Each table row retains its own declared period','هذا الشهر' in table['rows'][0] and 'الشهر السابق' in table['rows'][1],table)
        ck('Mixed table caption retains visible component title','قراءات بفترتين' in table['caption'],table);shot('mixed-period-table','#acceptance-periods')
        geometry('Mixed-period table360','#acceptance-periods')
        ev("mixed.querySelector('li').removeAttribute('data-period');MicroData.render(mixed)")
        ck('Missing per-row period is explicit rather than inferred', 'غير محددة' in ev("mixed.querySelector('tbody tr').textContent"))
        ev("mixed.querySelector('li').dataset.period='الشهر السابق';MicroData.render(mixed)")
        ck('Returning to homogeneous context removes extra period column',ev("mixed.dataset.readingState!=='mixed-context'&&![...mixed.querySelectorAll('thead th')].some(e=>e.textContent==='الفترة')"))
        ev("mixed.querySelector('li').dataset.period='هذا الشهر';MicroData.render(mixed);MicroData.render(mixed)")
        ck('Repeated render never duplicates period column',ev("[...mixed.querySelectorAll('thead th')].filter(e=>e.textContent==='الفترة').length===1"))
        p.set_viewport_size({'width':320,'height':780});geometry('Targeted320 mixed table','#acceptance-periods');shot('mixed-period-table320','#acceptance-periods')
        p.set_viewport_size({'width':360,'height':780});ev("document.documentElement.dir='ltr'");geometry('Directional LTR mixed table','#acceptance-periods');shot('mixed-period-table-ltr','#acceptance-periods')
        # Exercise C04 with the existing C01 and C02 source recipes, no duplicate renderer.
        p.goto(f'http://127.0.0.1:{server.server_port}/previews/compositions/summary-example.html',wait_until='networkidle');ev('document.fonts.ready')
        p.add_style_tag(url=f'http://127.0.0.1:{server.server_port}/components/compositions/reading-layout.css');p.add_script_tag(url=f'http://127.0.0.1:{server.server_port}/components/compositions/reading-context.js')
        ev("window.card=document.querySelector('#amount-reading');window.cardUnit=card.querySelector('.m-info-card__unit');cardUnit.dataset.readingUnit='د.أ';card.dataset.unit='د.أ';card.dataset.readingContext='acceptance-card-caption';let label=card.querySelector('.m-info-card__context');label.id='acceptance-card-caption';label.textContent='فترة العينة · د.أ';MicroReadings.sync(card)")
        ck('C01 reuses explicit context without a custom component copy',ev("cardUnit.classList.contains('m-reading-unit--contextual')&&card.querySelector('.m-info-card__number').textContent==='−1,250.750'"))
        ev("card.querySelector('.m-info-card__context').hidden=true;MicroReadings.sync(card)")
        ck('C01 hidden caption restores its original visible unit',ev("!cardUnit.classList.contains('m-reading-unit--contextual')&&cardUnit.textContent==='د.أ'"));geometry('C01 with C04 contained','#amount-reading');shot('C01-unit-restored360','#amount-reading')
        ev("MicroReadings.disconnect(card)");ck('C01 cleanup preserves caller data',ev("card.querySelector('.m-info-card__number').textContent==='−1,250.750'"))
        p.goto(f'http://127.0.0.1:{server.server_port}/previews/compositions/row-example.html',wait_until='networkidle');ev('document.fonts.ready')
        p.add_style_tag(url=f'http://127.0.0.1:{server.server_port}/components/compositions/reading-layout.css');p.add_script_tag(url=f'http://127.0.0.1:{server.server_port}/components/compositions/reading-context.js')
        ev("window.row=document.querySelector('#collection-row');window.rowUnit=row.querySelector('.m-row__reading > span');rowUnit.dataset.readingUnit='قطعة';row.dataset.unit='قطعة';row.dataset.readingContext='acceptance-row-caption';let label=row.querySelector('.m-row__subtitle');label.id='acceptance-row-caption';label.textContent='قراءة ساكنة · قطعة';window.acceptanceClicks=0;row.querySelector('button').addEventListener('click',()=>acceptanceClicks++);MicroReadings.sync(row)")
        ck('C02 reuses contextual unit without changing its value',ev("rowUnit.classList.contains('m-reading-unit--contextual')&&row.querySelector('.m-row__value').textContent==='12'"))
        p.locator('#collection-row button').tap();ck('C02 independent action still fires exactly once',ev('acceptanceClicks===1'))
        ev("row.querySelector('.m-row__subtitle').hidden=true;MicroReadings.sync(row)");ck('C02 hidden caption restores quantity unit',ev("!rowUnit.classList.contains('m-reading-unit--contextual')"))
        geometry('C02 with C04 contained','#collection-row');shot('C02-unit-restored360','#collection-row')
        dims=p.locator('#collection-row button').bounding_box();ck('C02 preserves standard48px action target',dims['width']>=48 and dims['height']>=48,dims)
        ev('MicroReadings.disconnect(row)');ck('C02 cleanup preserves value and action',ev("row.querySelector('.m-row__value').textContent==='12'&&!row.querySelector('button').disabled"))
        # Separate diagnostic page keeps edge fixtures out of the ordinary preview.
        p.goto(f'http://127.0.0.1:{server.server_port}/previews/readable-acceptance/index.html',wait_until='networkidle');ev('document.fonts.ready')
        for case in ('clipped','hidden','invalid','periods'):
            p.locator('#acceptance-case').focus();p.locator('#acceptance-case').select_option(case)
            ck('Diagnostic '+case+' exposes exactly one case without stealing focus',ev("document.querySelectorAll('[data-case]:not([hidden])').length===1&&document.activeElement.id==='acceptance-case'"))
            geometry('Diagnostic '+case+' contained','[data-case]:not([hidden])');shot('diagnostic-'+case,'[data-case]:not([hidden])')
        ck('Diagnostic mixed-period table is open and retains periods',ev("[...document.querySelectorAll('[data-case=periods] tbody tr')].every(e=>/هذا الشهر|الشهر السابق/.test(e.textContent))&&!document.querySelector('[data-case=periods] table').hidden"))
        p.locator('#acceptance-case').select_option('invalid');ck('Diagnostic invalid selection exposes honest accessible state','غير صالحة' in p.locator('[data-case=invalid] input').get_attribute('aria-valuetext'))
        offline=browser.new_page(viewport={'width':360,'height':780},color_scheme='light');assets=[];offline.on('pageerror',lambda e:errors.append(str(e)));offline.on('request',lambda r:assets.append(r.url) if r.resource_type!='document' and r.url.startswith('http') else None);offline.route('**/*',lambda r:r.continue_() if r.request.resource_type=='document' else r.abort())
        offline.goto(f'http://127.0.0.1:{server.server_port}/docs/audits/readable-acceptance-2026-11-12/review-cases.html',wait_until='networkidle');offline.evaluate('document.fonts.ready');offline.locator('#acceptance-case').select_option('periods')
        ck('Generated acceptance file consumes same source with subresource network blocked',offline.locator('[data-case=periods] table').is_visible() and 'الفترة' in offline.locator('[data-case=periods] thead').inner_text())
        ck('Generated acceptance file has no external asset requests',not assets,assets);offline.close()
        ck('No browser or resource errors',not errors,errors)
        browser.close()
    server.shutdown()
    paths=['components/compositions/reading-context.js','components/compositions/reading-layout.css','components/data/data.js','components/data/data.css','components/metric-comparison/metric-comparison.js','components/metric-comparison/metric-comparison.css','tools/readable-acceptance-check.py','previews/readable-acceptance/index.html','previews/readable-acceptance/acceptance.css','previews/readable-acceptance/acceptance.js']
    report=dict(workingTree=bool(subprocess.check_output(['git','status','--porcelain'],cwd=ROOT,text=True).strip()),sourceCommitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),captureOnly=a.capture_only,browser=version,emulatedPhone=True,physicalDevice=False,theme='light',primary='360x780 RTL touch',targeted=['320 mixed-period table','360 LTR table'],passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),checks=checks,measurements=measurements,sourceSha256={x:hashlib.sha256((ROOT/x).read_bytes()).hexdigest() for x in paths},limits=['Chromium mobile/touch emulation is not an actual Android/iOS device or screen-reader test.'])
    (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"Acceptance {report['passed']} PASS / {report['failed']} FAIL; {out}");return bool(report['failed'] and not a.capture_only)
if __name__=='__main__':raise SystemExit(main())
