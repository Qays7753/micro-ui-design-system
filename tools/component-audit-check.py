#!/usr/bin/env python3
"""Catalog-driven visual/interaction audit: all 14 families and all opt-in variants, Light only."""
import argparse
import hashlib
import http.server
import json
from pathlib import Path
import tempfile
import threading
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT=Path(__file__).resolve().parents[1]


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,directory=str(ROOT),**kwargs)
    def log_message(self,*_):
        pass


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--out',type=Path)
    args=ap.parse_args()
    out=args.out or Path(tempfile.mkdtemp(prefix='micro-family-audit-'))
    out.mkdir(parents=True,exist_ok=True)
    catalog=json.loads((ROOT/'docs/COMPONENT-CATALOG.json').read_text())
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler)
    threading.Thread(target=server.serve_forever,daemon=True).start()
    checks,errors,requests=[],[],[]
    def check(name,ok,detail=None):
        checks.append({'name':name,'passed':bool(ok),'detail':detail})
        print(('PASS ' if ok else 'FAIL ')+name,flush=True)
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(**chromium_launch_options())
            version=browser.version
            page=browser.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',reduced_motion='reduce')
            page.set_default_timeout(5000)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('requestfailed',lambda r:requests.append(r.url))
            page.goto(f'http://127.0.0.1:{server.server_port}/previews/ui-system-showcase/index.html#component-review')
            page.evaluate('document.fonts.ready')
            options=page.locator('#sc-review-family option').evaluate_all('es=>es.map(e=>e.value)')
            check('review selector covers every catalog family exactly once',options==[f['id'] for f in catalog['families']],options)
            def family(name):
                page.select_option('#sc-review-family',name)
                page.wait_for_timeout(50)
            for f in catalog['families']:
                family(f['id'])
                state=page.evaluate('''id=>{
                  const sections=[...document.querySelectorAll('.sc-section:not([hidden])')];
                  return {width:innerWidth,scroll:document.documentElement.scrollWidth,
                    sections:sections.map(s=>({id:s.id,w:s.getBoundingClientRect().width,h:s.getBoundingClientRect().height,
                    family:[...s.querySelectorAll('[data-catalog-family]')].map(b=>b.dataset.catalogFamily)}))};}''',f['id'])
                check(f['id']+': review is isolated, rendered and within 360px',
                      bool(state['sections']) and state['scroll']==360
                      and all(s['w']>0 and s['h']>0 and s['family']==[f['id']] for s in state['sections']),state)
                page.screenshot(path=str(out/(f['id']+'.png')),full_page=True)
            for variant in catalog['variants']:
                family(variant['family'])
                node=page.locator('[data-review-variant="'+variant['id']+'"]')
                state=node.evaluate('''e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height,
                  visible:!!r.width&&!!r.height,scroll:e.scrollWidth,client:e.clientWidth,
                  drawn:e.querySelectorAll('svg,.m-main-metric__bar,.m-metric-circles__bubble,.m-bubble,[data-info-strip-track] > *').length};}''')
                check(variant['id']+': actual opt-in example is visible and drawn',
                      state['visible'] and state['drawn']>0 and state['scroll']<=state['client']+1,state)
            def test(name,fn):
                try:
                    fn()
                except Exception as e:
                    check(name,False,str(e))
                finally:
                    page.evaluate("document.querySelectorAll('.m-layer:not([hidden])').forEach(e=>MicroNavigation.closeLayer(e))")
                    page.wait_for_timeout(30)
            def buttons():
                family('buttons')
                page.evaluate('''()=>{window.btn=document.createElement('button');btn.type='button';btn.className='m-btn m-btn--primary';
                  btn.textContent='إجراء مستقل';btn.setAttribute('aria-label','اسم أصلي');btn.dataset.loadingLabel='جارٍ العمل';
                  document.querySelector('#sc-buttons .sc-block').append(btn);window.activations=0;
                  btn.addEventListener('click',()=>activations++);btn.focus();window.before=btn.getBoundingClientRect().toJSON();
                  MicroButtons.setLoading(btn,true);}''')
                page.keyboard.press('Enter');page.keyboard.press('Space')
                page.evaluate('btn.click()')
                check('buttons: busy blocks keyboard and pointer without losing focus or size',page.evaluate('''()=>{
                  const r=btn.getBoundingClientRect();return activations===0&&document.activeElement===btn
                  &&r.width===before.width&&r.height===before.height&&btn.getAttribute('aria-busy')==='true';}'''))
                page.evaluate('MicroButtons.setLoading(btn,false)');page.keyboard.press('Enter')
                check('buttons: completion restores exact accessible name and activation',page.evaluate("activations===1&&btn.getAttribute('aria-label')==='اسم أصلي'"))
                page.evaluate('btn.disabled=true;MicroButtons.setLoading(btn,true)')
                check('buttons: disabled never becomes a loading action',page.evaluate("btn.disabled&&btn.getAttribute('aria-busy')!=='true'"))
                page.evaluate('MicroButtons.disconnect(btn);btn.remove()')
            test('buttons interaction',buttons)
            def fields():
                family('fields');page.locator('#sc-f-search').fill('بحث')
                page.locator('#sc-field-search .m-field__clear').click()
                check('fields: clear empties search and returns focus',page.locator('#sc-f-search').input_value()=='' and page.locator('#sc-f-search').evaluate('e=>e===document.activeElement'))
                page.locator('#sc-field-qty [data-step=up]').click()
                check('fields: quantity follows declared step',page.locator('#sc-f-qty').input_value()=='15')
                page.evaluate("document.getElementById('sc-field-error-demo').classList.add('has-error');document.getElementById('sc-f-demo').setAttribute('aria-invalid','true');const msg=document.querySelector('#sc-field-error-demo [data-field-msg]');msg.textContent='راجع القيمة';msg.hidden=false;MicroFields.sync(document.getElementById('sc-field-error-demo'))")
                check('fields: error preserves text and associates an accessible message',page.locator('#sc-f-demo').evaluate("e=>e.value==='قيمة تبقى عند الخطأ'&&e.getAttribute('aria-invalid')==='true'&&!!e.getAttribute('aria-describedby')"))
                check('fields: native disabled and readonly remain distinct',page.locator('#sc-f-dis').is_disabled() and page.locator('#sc-f-ro').get_attribute('readonly') is not None)
            test('fields interaction',fields)
            def selection():
                family('selection');page.locator('#sc-picker-trigger').click()
                page.locator('#sc-picker [data-picker-search]').fill('لايوجداسممطابق')
                check('picker: no-results stays outside listbox and offers no active option',page.locator('#sc-picker [data-picker-status]').is_visible() and page.locator('#sc-picker .m-picker__option:visible').count()==0)
                page.locator('#sc-picker [data-picker-search]').fill('')
                option=page.locator('#sc-picker .m-picker__option:visible').first;option.focus();page.keyboard.press('ArrowDown')
                check('picker: keyboard moves to a real option',page.evaluate("document.activeElement.matches('#sc-picker .m-picker__option')"))
                page.keyboard.press('Enter')
                check('picker: Enter selects a value',page.evaluate("MicroPicker.getSelected(document.getElementById('sc-picker'))!==null"))
                page.keyboard.press('Escape')
                check('picker: Escape restores trigger focus',page.locator('#sc-picker-trigger').evaluate('e=>e===document.activeElement'))
            test('selection interaction',selection)
            def organization():
                family('organization');head=page.locator('#sc-organization .m-section__head');head.click()
                check('organization: disclosure opens its real body',page.locator('#sc-org-body').is_visible() and head.get_attribute('aria-expanded')=='true')
                check('organization: failed image is replaced with readable initials',page.locator('#sc-organization .m-identity__initials').is_visible())
            test('organization interaction',organization)
            def messages():
                family('messages');note=page.locator('#sc-messages .m-note').first;note.locator('.m-note__close').click()
                check('messages: manual close hides note and restores declared target',not note.is_visible() and page.locator('#sc-note-reopen-info').evaluate('e=>e===document.activeElement'))
                page.locator('#sc-toast-open').click()
                check('messages: toast opens visibly with manual dismissal',page.locator('#sc-toast').is_visible())
                page.locator('#sc-toast [data-toast-close]').click()
                check('messages: manual dismissal actually hides toast',not page.locator('#sc-toast').is_visible())
                check('messages: empty and no-results are separate visible states',page.locator('#sc-messages .m-empty--no-data').is_visible() and page.locator('#sc-messages .m-empty--no-results').is_visible())
            test('messages interaction',messages)
            def navigation():
                family('navigation');tabs=page.locator('#sc-tabs [role=tab]');tabs.first.focus();page.keyboard.press('End')
                check('navigation: End activates last actual tab and panel',tabs.last.get_attribute('aria-selected')=='true' and page.locator('#sc-tab-d').is_visible())
                page.locator('#sc-sheet-trigger').click();page.wait_for_timeout(50)
                check('navigation: sheet is visible, modal and focus stays inside',page.locator('#sc-sheet-layer').is_visible() and page.locator('#sc-sheet-layer').evaluate('e=>e.contains(document.activeElement)'))
                page.screenshot(path=str(out/'navigation-sheet.png'),full_page=True)
                page.keyboard.press('Escape');page.wait_for_timeout(50)
                check('navigation: Escape releases modal and returns focus',not page.locator('#sc-sheet-layer').is_visible() and page.locator('#sc-sheet-trigger').evaluate('e=>e===document.activeElement'))
                page.locator('.sc-frame').evaluate('e=>e.scrollTop=e.scrollHeight')
                page.locator('#sc-actionbar .m-btn--icon').scroll_into_view_if_needed()
                check('preview: wrapped actionbar option is reachable by internal scroll',page.locator('#sc-actionbar .m-btn--icon').evaluate('''e=>{const r=e.getBoundingClientRect(),f=e.closest('.sc-frame').getBoundingClientRect();return r.top>=f.top&&r.bottom<=f.bottom;}'''))
            test('navigation interaction',navigation)
            def data():
                family('data')
                for chart in ['#sc-chart-bars','#sc-chart-line','#sc-chart-donut','#sc-chart-bubbles','#sc-review-packed','#sc-signed-bars','#sc-signed-time']:
                    node=page.locator(chart);node.locator('.m-chart__disclose').click()
                    check('data: '+chart+' exposes visible complete table',node.locator('table').is_visible() and node.locator('tbody tr').count()>0)
                for chart in ['#sc-chart-empty-bars','#sc-chart-empty-donut']:
                    check('data: '+chart+' is empty without zero geometry',page.locator(chart+' .m-chart__empty').is_visible() and page.locator(chart+' [data-plot] svg').count()==0)
            test('data interaction',data)
            def metrics():
                family('metric-comparison')
                nodes=page.locator('#sc-metric [data-main-comparison],#sc-metric [data-metric-circles]')
                for i in range(nodes.count()):
                    node=nodes.nth(i);node.locator('button[aria-expanded]').click()
                    check('metric variant '+str(i)+': visible table includes source values',node.locator('table').is_visible() and node.locator('tbody tr').count()>0)
            test('metric interactions',metrics)
            def account():
                family('account-settings');page.locator('#sc-account-root [data-account-open]').click()
                page.locator('#sc-account-root [data-account-to-application]').click()
                check('account: real application view and title are visible',page.locator('#sc-account-root [data-account-view=application]').is_visible() and page.locator('#sc-account-root [data-account-title=application]').is_visible())
                page.screenshot(path=str(out/'account-settings-open.png'),full_page=True)
                page.keyboard.press('Escape');page.wait_for_timeout(50)
                check('account: Escape closes layer and restores opener',not page.locator('#sc-account-layer').is_visible() and page.locator('#sc-account-root [data-account-open]').evaluate('e=>e===document.activeElement'))
            test('account interaction',account)
            def gateway():
                family('access-gateway');page.locator('#sc-gateway-root button[type=submit]').click()
                check('gateway: invalid submit focuses first invalid credential',page.locator('#sc-gw-email').evaluate('e=>e===document.activeElement'))
                page.locator('#sc-gw-email').fill('sample@example.test');page.locator('#sc-gw-password').fill('example-password')
                page.locator('#sc-gateway-root [data-access-reveal]').click()
                check('gateway: reveal updates real input type',page.locator('#sc-gw-password').get_attribute('type')=='text')
                page.evaluate("MicroAccessGateway.init(document.getElementById('sc-gateway-root'),{onSubmit:()=>Promise.reject(new Error('PRIVATE_EXCEPTION'))})")
                page.locator('#sc-gateway-root button[type=submit]').click()
                page.wait_for_function("document.querySelector('#sc-gateway-root button[type=submit]').getAttribute('aria-busy')!=='true'")
                status=page.locator('#sc-gateway-root [data-access-status]').inner_text()
                check('gateway: rejected callback produces safe visible error',bool(status) and 'PRIVATE_EXCEPTION' not in status,status)
                page.screenshot(path=str(out/'access-gateway-error.png'),full_page=True)
            test('gateway interaction',gateway)
            def strips():
                family('info-strip')
                for root in ['#sc-strip','#sc-strip-peek']:
                    before=page.locator(root+' [data-info-strip-position]').inner_text();page.locator(root+' [data-info-strip-next]').click()
                    check(root+': next changes visible position',page.locator(root+' [data-info-strip-position]').inner_text()!=before)
            test('strip interactions',strips)
            def carousel():
                family('carousel');root=page.locator('#sc-carousel [data-carousel]')
                root.locator('[data-card-expand]').first.click()
                check('carousel: inline expansion displays full details',root.locator('[data-card-details]').first.is_visible())
                root.locator('[data-next]').click()
                check('carousel: next collapses previous details and changes accessible position',not root.locator('[data-card-details]').first.is_visible() and '2' in root.locator('[data-status]').inner_text())
                page.screenshot(path=str(out/'carousel-next.png'),full_page=True)
            test('carousel interactions',carousel)
            check('runtime: no uncaught JavaScript or failed requests',not errors and not requests,{'errors':errors,'requests':requests})
            browser.close()
    finally:
        server.shutdown();server.server_close()
    passed=sum(c['passed'] for c in checks)
    report={'browser':version,'passed':passed,'failed':len(checks)-passed,'checks':checks,
            'scope':'360x780 Light RTL, normal text; source components exercised in review; source-only regression gates run separately',
            'catalogSha256':hashlib.sha256((ROOT/'docs/COMPONENT-CATALOG.json').read_bytes()).hexdigest()}
    (out/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f'{passed} PASS / {len(checks)-passed} FAIL — {out}')
    return int(passed!=len(checks))


if __name__=='__main__':
    raise SystemExit(main())
