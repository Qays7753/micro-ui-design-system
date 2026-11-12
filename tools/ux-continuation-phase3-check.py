#!/usr/bin/env python3
"""Focused independent component audit: 360x780 Light, RTL plus text-direction LTR.

No Micro host, proposed compositions, new chart design, Dark, zoom or viewport matrix.
--source-ref reads historical HTML/CSS/JS without switching branches, for reproduction.
"""
import argparse
import base64
import hashlib
import http.server
import json
import subprocess
import tempfile
import threading
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]
TEXT_CASES = [
    ('identity-name', 'organization', '.m-identity__name', 'مؤسسةالمشاريعالصغيرةوالصناعاتاليدوية' * 3),
    ('identity-sub', 'organization', '.m-identity__sub', 'business.contact@long-small-business-domain-name.example'),
    ('identity-sub-unbroken', 'organization', '.m-identity__sub', 'contact@' + 'smallbusinessdomain' * 3 + '.example'),
    ('section-title', 'organization', '.m-section-title', 'متابعةتفاصيلطلباتالمشاريعالصغيرة' * 3),
    ('section-desc', 'organization', '.m-section-desc', 'وصفالطلباتالخاصةبالمشروعالصغير' * 3),
    ('note-title', 'messages', '.m-note__title', 'تعذرإتمامطلبتحديثالبياناتيرجىإعادةالمحاولة' * 3),
    ('note-body-control', 'messages', '.m-note__body', 'request.reference@long-small-business-domain-name.example'),
]
FIXTURE = '''<!doctype html><html lang="ar" dir="rtl" data-theme="light"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,">
<link rel="stylesheet" href="/assets/fonts/fonts.css"><link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/components/buttons/buttons.css"><link rel="stylesheet" href="/components/organization/organization.css">
<link rel="stylesheet" href="/components/messages/messages.css">
<style>body{margin:0;padding:16px;box-sizing:border-box;font-family:var(--micro-font-family);background:var(--micro-surface-page)}main{max-width:100%}.case{margin-block:16px;padding:16px;background:var(--micro-surface-base);border-radius:var(--micro-radius-field)}h1{font-size:18px}</style>
</head><body><main><h1>اختبار مستقل للنصوص</h1>
<div class="case" id="identity-name"><div class="m-identity"><span class="m-identity__initials" aria-hidden="true">مش</span><div class="m-row__text"><span class="m-identity__name"></span><span class="m-identity__sub">اسم المشروع</span></div></div></div>
<div class="case" id="identity-sub"><div class="m-identity"><span class="m-identity__initials" aria-hidden="true">مش</span><div class="m-row__text"><span class="m-identity__name">مشروع صغير</span><span class="m-identity__sub"></span></div></div></div>
<div class="case" id="identity-sub-unbroken"><div class="m-identity"><span class="m-identity__initials" aria-hidden="true">مش</span><div class="m-row__text"><span class="m-identity__name">مشروع صغير</span><span class="m-identity__sub"></span></div></div></div>
<div class="case" id="section-title"><section class="m-section"><button class="m-section__head" type="button" aria-expanded="false" aria-controls="details"><span class="m-section-title"></span><svg class="m-section__chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div class="m-section__body" id="details" hidden>تفاصيل</div></section></div>
<div class="case" id="section-desc"><p class="m-section-desc"></p></div>
<div class="case" id="note-title"><div class="m-note m-note--error" role="alert"><svg class="m-note__icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg><div class="m-note__text"><strong class="m-note__title"></strong><p class="m-note__body">تبقى الرسالة مقروءة ويظل الإغلاق مستقلًا.</p></div><button class="m-btn m-btn--icon m-note__close" type="button" aria-label="إغلاق">×</button></div></div>
<div class="case" id="note-body-control"><div class="m-note m-note--info" role="status"><div class="m-note__text"><strong class="m-note__title">مرجع طلب طويل</strong><p class="m-note__body"></p></div></div></div>
</main><script src="/components/organization/organization.js"></script><script src="/components/messages/messages.js"></script></body></html>'''


class Handler(http.server.SimpleHTTPRequestHandler):
    source_ref = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_):
        pass

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == '/phase3-text.html':
            body, content_type = FIXTURE.encode(), 'text/html; charset=utf-8'
        elif self.source_ref and path.endswith(('.html', '.css', '.js')):
            body = subprocess.check_output(['git', 'show', self.source_ref + ':' + path.lstrip('/')], cwd=ROOT)
            content_type = ('text/html; charset=utf-8' if path.endswith('.html') else
                            'text/css' if path.endswith('.css') else 'text/javascript')
        else:
            return super().do_GET()
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.end_headers()
        self.wfile.write(body)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path)
    parser.add_argument('--source-ref')
    parser.add_argument('--text-only', action='store_true', help='only the source-only long-text regression fixture')
    parser.add_argument('--options-only', action='store_true', help='only carousel/strip counts, expansion and loading compatibility')
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix='ux-phase3-'))
    out.mkdir(parents=True, exist_ok=True)
    Handler.source_ref = args.source_ref
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    checks, errors, resource_errors, families, variants, text_geometry = [], [], [], [], [], []
    catalog = json.loads((ROOT / 'docs/COMPONENT-CATALOG.json').read_text())

    def check(name, passed, detail=None):
        checks.append({'name': name, 'passed': bool(passed), 'detail': detail})
        print(('PASS ' if passed else 'FAIL ') + name, flush=True)

    def extent(element):
        return element.evaluate('''e=>{const range=document.createRange();range.selectNodeContents(e);const b=e.getBoundingClientRect();const rects=[...range.getClientRects()].map(r=>({left:r.left,right:r.right,top:r.top,bottom:r.bottom}));const root=e.closest('.case').getBoundingClientRect();return {box:{left:b.left,right:b.right,top:b.top,bottom:b.bottom},rects,root:{left:root.left,right:root.right},documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,text:e.textContent,clipped:getComputedStyle(e).textOverflow==='ellipsis',contained:rects.every(r=>r.left>=root.left-1&&r.right<=root.right+1&&r.top>=b.top-2&&r.bottom<=b.bottom+2)}}''')

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            version = browser.version
            page = browser.new_page(viewport={'width': 360, 'height': 780}, color_scheme='light', locale='ar', reduced_motion='reduce')
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('response', lambda r: resource_errors.append({'status': r.status, 'url': urlsplit(r.url).path}) if r.status >= 400 else None)
            for family in ([] if args.text_only or args.options_only else catalog['families']):
                fid = family['id']
                page.goto(base + '/previews/ui-system-showcase/index.html#component-review', wait_until='networkidle')
                page.evaluate('document.fonts.ready')
                page.locator('#sc-review-family').select_option(fid)
                section = page.locator('.sc-section').filter(has=page.locator('[data-catalog-family="' + fid + '"]:not([data-catalog-variant])')).first
                section.scroll_into_view_if_needed()
                page.wait_for_timeout(100)
                geometry = section.evaluate('s=>({width:s.getBoundingClientRect().width,height:s.getBoundingClientRect().height,documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,visible:!!s.getClientRects().length})')
                check(fid + ' review layout contained at 360 RTL', geometry['visible'] and geometry['width'] <= 360 and geometry['documentWidth'] <= 360, geometry)
                section.screenshot(path=str(out / (fid + '.png')))
                families.append({'id': fid, 'screenshot': fid + '.png', 'geometry': geometry})
                try:
                    if fid == 'buttons':
                        button = section.locator('.m-btn--primary').first
                        before = button.bounding_box()
                        button.evaluate('(b)=>{window.auditClicks=0;b.addEventListener("click",()=>auditClicks++);MicroButtons.setLoading(b,true)}')
                        button.focus();page.keyboard.press('Enter')
                        after = button.bounding_box()
                        check('buttons busy blocks keyboard activation and preserves geometry', page.evaluate('auditClicks') == 0 and abs(before['width']-after['width']) < 1 and abs(before['height']-after['height']) < 1)
                        button.evaluate('(b)=>MicroButtons.setLoading(b,false)')
                    elif fid == 'fields':
                        result = page.evaluate('''()=>{const i=document.querySelector('#sc-f-name');window.auditInputs=0;i.addEventListener('input',()=>auditInputs++);i.value='نص خام غير صالح كرقم';MicroFields.sync(i.closest('[data-micro-field]'));return {value:i.value,events:auditInputs,count:i.closest('[data-micro-field]').querySelector('.m-field__count').textContent}}''')
                        check('fields raw text survives silent programmatic sync', result['value'] == 'نص خام غير صالح كرقم' and result['events'] == 0 and result['count'].startswith('20/'), result)
                    elif fid == 'selection':
                        page.locator('#sc-picker-trigger').click()
                        picker = page.locator('#sc-picker-layer [data-micro-picker]')
                        result = picker.evaluate('''p=>{MicroPicker.setOptions(p,[{value:'a',label:'مورد أول'},{value:'b',label:'مورد ثان'}]);MicroPicker.setStatus(p,'loading');return [...p.querySelectorAll('[role=option]')].every(o=>o.hidden)}''')
                        check('picker loading hides stale options', result)
                        picker.evaluate("p=>MicroPicker.setStatus(p,'ready')")
                        picker.locator('[role=option]').first.press('Enter')
                        check('picker keyboard selects a real source value', picker.evaluate('p=>MicroPicker.getSelected(p).value') == 'a')
                        page.keyboard.press('Escape')
                    elif fid == 'organization':
                        head = section.locator('.m-section__head').first
                        head.evaluate('h=>{window.auditToggles=0;h.closest(".m-section").addEventListener("micro-organization:toggle",()=>auditToggles++);MicroOrganization.init(h.closest(".m-section"));MicroOrganization.init(h.closest(".m-section"))}')
                        head.press('Enter')
                        check('organization repeated init toggles once and reveals content', page.evaluate('auditToggles') == 1 and head.get_attribute('aria-expanded') == 'true' and section.locator('.m-section__body').is_visible())
                    elif fid in ('data', 'metric-comparison'):
                        if fid == 'data':
                            check('data documented two-period comparison is exposed in review',section.locator('.m-compare .m-compare__item').count()==2)
                        toggle = section.locator('button[aria-controls]').filter(has_text='عرض البيانات كجدول').first
                        table_id = toggle.get_attribute('aria-controls')
                        toggle.press('Enter')
                        # Capture identity before its label changes. A live text
                        # locator would otherwise resolve to the next disclosure.
                        table = page.locator('#' + table_id)
                        check(fid + ' disclosure exposes readable semantic data', table.is_visible() and table.locator('tbody tr').count() >= 3 and table.evaluate('e=>e.scrollWidth<=e.clientWidth+1'))
                    elif fid == 'messages':
                        skeleton=section.locator('.m-skeleton').first
                        check('messages skeleton uses visible source blocks and stays decorative',skeleton.get_attribute('aria-hidden')=='true' and skeleton.locator('.m-skeleton__block--line').count()==3 and skeleton.locator('.m-skeleton__block--line').evaluate_all('es=>es.every(e=>e.getBoundingClientRect().height>=16&&e.getBoundingClientRect().width>0)'))
                        close = section.locator('.m-note__close').first
                        note = close.locator('xpath=ancestor::*[contains(concat(" ",normalize-space(@class)," ")," m-note ")]')
                        close.press('Enter')
                        check('messages keyboard close actually removes note from layout', not note.is_visible() and note.evaluate('e=>e.getClientRects().length===0'))
                    elif fid == 'navigation':
                        trigger = section.locator('[data-layer-open]').first
                        layer_id = trigger.get_attribute('data-layer-open')
                        trigger.press('Enter');layer=page.locator('#'+layer_id)
                        opened = layer.is_visible() and layer.evaluate('e=>e.contains(document.activeElement)')
                        page.keyboard.press('Escape')
                        check('navigation modal focus, Escape and trigger restoration', opened and not layer.is_visible() and trigger.evaluate('e=>e===document.activeElement') and page.evaluate('document.body.style.position!=="fixed"'))
                    elif fid == 'surfaces':
                        check('surfaces content is independent of decorative layer', section.locator('.m-surface__title').count() == 2 and section.locator('.m-surface').evaluate_all('els=>els.every(e=>getComputedStyle(e).overflow!=="hidden")'))
                    elif fid == 'info-strip':
                        check('info card documented multiple-reading option is exposed in review',section.locator('.m-info-card__values .m-info-card__reading').count()==2)
                        strip=section.locator('[data-info-strip]:not([data-info-peek])').first
                        strip.locator('[data-info-strip-next]').press('Enter')
                        check('info strip next reveals one active reading', strip.locator('[data-info-strip-position]').inner_text().strip() == '2 / 3' and strip.locator('.m-info-strip__slide:not([inert])').count() == 1)
                        peek=section.locator('[data-info-peek]').first
                        peek.locator('[data-info-strip-next]').press('Enter')
                        check('peek next updates index and keeps inactive slides inert', peek.evaluate('s=>MicroInfoPeek.getIndex(s)') == 1 and peek.locator('.m-info-strip__slide:not([inert])').count() == 1)
                    elif fid == 'account-settings':
                        section.locator('[data-account-open]').press('Enter')
                        layer=page.locator('.m-layer:visible').first
                        layer.locator('[data-account-to-application]').press('Enter')
                        check('account settings application view has correct focus and name', layer.locator('[data-account-view="application"]').is_visible() and layer.evaluate('l=>l.querySelector("[data-account-title=application]")===document.activeElement&&l.getAttribute("aria-labelledby")===document.activeElement.id'))
                        layer.screenshot(path=str(out/'account-application.png'))
                        page.keyboard.press('Escape')
                    elif fid == 'access-gateway':
                        email=section.locator('[data-access-credential="email"],input[name="email"]').first
                        email.fill('not-an-email')
                        section.locator('[type=submit]').press('Enter')
                        check('access invalid input is retained, marked and focused', email.input_value() == 'not-an-email' and email.get_attribute('aria-invalid') == 'true' and email.evaluate('e=>e===document.activeElement'))
                        page.evaluate('''()=>{window.auditSubmits=0;MicroAccessGateway.init(document.querySelector('#sc-gateway-root'),{onSubmit:()=>{auditSubmits++;return undefined}})}''')
                        email.fill('demo@example.test');section.locator('input[type=password]').fill('Valid!12345')
                        section.locator('[type=submit]').press('Enter')
                        page.wait_for_function('auditSubmits===1')
                        check('access resolved handler without result stays neutral', 'دون نتيجة مؤكدة' in section.locator('[data-access-status]').inner_text())
                    elif fid == 'order-schedule':
                        result=page.evaluate('''()=>{const r=document.querySelector('#sc-ocal-root'),i=MicroOrderSchedule.getInstance(r);window.auditStateEvents=0;r.addEventListener('order-schedule:state-change',()=>auditStateEvents++);const before=i.getState();i.setDisplayedMonth('2026-11');const after=i.getState();return {before,after,events:auditStateEvents}}''')
                        check('calendar displayed month changes silently without losing selection', result['events'] == 0 and result['after']['selectedDate'] == result['before']['selectedDate'] and result['after']['displayedMonth'] == '2026-11')
                    elif fid == 'carousel':
                        carousel=section.locator('[data-carousel]').first
                        carousel.locator('[data-next]').press('Enter')
                        check('carousel next updates index without exposing inactive controls', carousel.evaluate('c=>MicroCarousel.getIndex(c)') == 1 and carousel.locator('[data-carousel-slide]:not([inert])').count() == 1)
                except Exception as error:
                    check(fid + ' interaction completed', False, str(error).split('Call log:')[0][:600])
            if not args.text_only:
                page.goto(base+'/previews/ui-system-showcase/index.html#component-review',wait_until='networkidle')
                page.locator('#sc-review-family').select_option('carousel')
                option_results = page.evaluate('''()=>{
                  const results=[], original=document.querySelector('#sc-carousel [data-carousel]');
                  for(const count of [0,1,6]){
                    const c=original.cloneNode(true),track=c.querySelector('[data-track]');
                    c.id='audit-carousel-'+count;
                    const templates=[...track.children];track.replaceChildren();
                    for(let i=0;i<count;i++){
                      const slide=templates[i%templates.length].cloneNode(true);
                      for(const e of slide.querySelectorAll('[id]')){
                        const old=e.id;e.id='audit-'+count+'-'+i+'-'+old;
                        for(const owner of slide.querySelectorAll('[aria-controls]'))if(owner.getAttribute('aria-controls')===old)owner.setAttribute('aria-controls',e.id);
                      }
                      track.append(slide);
                    }
                    original.parentNode.append(c);MicroCarousel.init(c);
                    const prev=c.querySelector('[data-prev]'),next=c.querySelector('[data-next]');
                    results.push({name:'carousel '+count+' cards keep honest limits and active content',passed:
                      count<2 ? prev.disabled&&next.disabled&&c.querySelectorAll('[data-carousel-slide]:not([inert])').length===count
                        : !next.disabled&&prev.disabled&&c.querySelectorAll('[data-carousel-slide]:not([inert])').length===1});
                    if(count===6){
                      MicroCarousel.goTo(c,5,{animate:false});MicroCarousel.disconnect(c);MicroCarousel.init(c);
                      results.push({name:'carousel disconnect/reinit preserves last index and boundary',passed:MicroCarousel.getIndex(c)===5&&next.disabled&&!prev.disabled});
                    }
                    MicroCarousel.destroy(c);
                    results.push({name:'carousel '+count+' cards destroy releases instance',passed:MicroCarousel.getIndex(c)===-1});c.remove();
                  }
                  MicroCarousel.goTo(original,0,{animate:false});const expand=original.querySelector('[data-card-expand]');expand.click();
                  results.push({name:'carousel explicit expansion reveals its associated details',passed:expand.getAttribute('aria-expanded')==='true'&&!document.getElementById(expand.getAttribute('aria-controls')).hidden});
                  MicroCarousel.goTo(original,1,{animate:false});
                  results.push({name:'carousel changing card collapses prior details',passed:expand.getAttribute('aria-expanded')==='false'&&document.getElementById(expand.getAttribute('aria-controls')).hidden});
                  return results;
                }''')
                for result in option_results: check(result['name'],result['passed'])
                page.locator('#sc-review-family').select_option('info-strip')
                strip_results=page.evaluate('''()=>{
                  const s=document.querySelector('#sc-strip'),track=s.querySelector('[data-info-strip-track]'),original=[...track.children],controls=s.querySelector('[data-info-strip-controls]'),viewport=s.querySelector('[data-info-strip-viewport]'),status=s.querySelector('[data-info-strip-status]'),results=[];
                  track.replaceChildren();MicroInfoStrip.rescan(s);
                  results.push({name:'empty info strip hides viewport and controls',passed:controls.hidden&&viewport.hidden});
                  results.push({name:'empty info strip announces no cards rather than card one of zero',passed:/لا توجد بطاقات/.test(status.textContent)&&!/1|١/.test(status.textContent),detail:status.textContent});
                  track.append(original[0]);MicroInfoStrip.rescan(s);
                  results.push({name:'single info card remains visible without navigation',passed:controls.hidden&&!viewport.hidden&&status.textContent==='البطاقة 1 من 1'});
                  track.replaceChildren(...original);MicroInfoStrip.rescan(s);
                  results.push({name:'multi-card info strip restores navigation after empty and single',passed:!controls.hidden&&!viewport.hidden&&status.textContent==='البطاقة 1 من 3'});
                  return results;
                }''')
                for result in strip_results: check(result['name'],result['passed'],result.get('detail'))
                peek_results=page.evaluate('''()=>{
                  const original=document.querySelector('#sc-strip-peek'),results=[];
                  for(const count of [0,1,3]){
                    const s=original.cloneNode(true);s.id='audit-peek-'+count;
                    const track=s.querySelector('[data-info-strip-track]'),templates=[...track.children];track.replaceChildren();
                    for(let i=0;i<count;i++)track.append(templates[i].cloneNode(true));
                    original.parentNode.append(s);MicroInfoPeek.init(s);MicroInfoPeek.init(s);
                    const viewport=s.querySelector('[data-info-strip-viewport]'),controls=s.querySelector('[data-info-strip-controls]');
                    const status=s.querySelector('[data-info-strip-status]');
                    if(count===3)s.querySelector('[data-info-strip-next]').click();
                    const passed=count===0 ? viewport.hidden&&controls.hidden&&/لا توجد بطاقات/.test(status.textContent)
                      : count===1 ? MicroInfoPeek.getIndex(s)===0&&controls.hidden&&!viewport.hidden
                      : MicroInfoPeek.getIndex(s)===1&&s.querySelectorAll('.m-info-strip__slide:not([inert])').length===1;
                    results.push({name:'cloned peek '+count+' cards initializes independent truthful state once',passed,detail:{index:MicroInfoPeek.getIndex(s),status:status.textContent,viewportHidden:viewport.hidden,controlsHidden:controls.hidden}});
                    MicroInfoPeek.disconnect(s);s.remove();
                  }
                  return results;
                }''')
                for result in peek_results: check(result['name'],result['passed'],result.get('detail'))
                page.goto(base+'/previews/buttons/index.html#live',wait_until='networkidle')
                for mode,selector in [('default','[data-loading-api]:not([disabled]):not(.m-btn--loading-slot):not(.m-btn--loading-replace)'),('replace','[data-loading-api].m-btn--loading-replace'),('slot','[data-loading-api].m-btn--loading-slot')]:
                    result=page.locator(selector).first.evaluate('''b=>{const a=b.getBoundingClientRect(),label=b.getAttribute('aria-label');MicroButtons.setLoading(b,true);const busy=b.getAttribute('aria-busy')==='true',r=b.getBoundingClientRect();MicroButtons.setLoading(b,false);return {busy,stable:Math.abs(a.width-r.width)<1&&Math.abs(a.height-r.height)<1,restored:b.getAttribute('aria-label')===label&&!b.classList.contains('is-loading')}}''')
                    check('buttons '+mode+' loading keeps dimensions and restores accessible label',all(result.values()),result)
            for variant in ([] if args.text_only or args.options_only else catalog['variants']):
                page.goto(base+'/previews/ui-system-showcase/index.html#component-review',wait_until='networkidle')
                page.locator('#sc-review-family').select_option(variant['family'])
                element=page.locator('[data-review-variant="'+variant['id']+'"]')
                element.scroll_into_view_if_needed()
                page.wait_for_timeout(80)
                geometry=element.evaluate('e=>({visible:!!e.getClientRects().length,width:e.getBoundingClientRect().width,viewport:innerWidth,documentWidth:document.documentElement.scrollWidth})')
                check(variant['id']+' optional preview accessible and contained', geometry['visible'] and geometry['width']<=360 and geometry['documentWidth']<=360,geometry)
                element.screenshot(path=str(out/('variant-'+variant['id']+'.png')))
                variants.append({'id':variant['id'],'screenshot':'variant-'+variant['id']+'.png','geometry':geometry})
            for direction in (() if args.options_only else ('rtl','ltr')):
                page.goto(base+'/phase3-text.html',wait_until='networkidle')
                page.evaluate('(dir)=>document.documentElement.dir=dir',direction)
                for cid,family,selector,text in TEXT_CASES:
                    element=page.locator('#'+cid+' '+selector)
                    element.evaluate('(e,t)=>e.textContent=t',text)
                    # Keep the actual phone viewport anchored at its logical
                    # origin. Auto-centering an overflowing RTL Range can move
                    # the screenshot to blank space before a repair.
                    element.evaluate("e=>window.scrollTo({left:0,top:scrollY+e.getBoundingClientRect().top-16,behavior:'instant'})")
                    data=extent(element);data.update(id=cid,family=family,direction=direction)
                    text_geometry.append(data)
                    check(cid+' '+direction+' complete text stays within component',data['contained'] and not data['clipped'] and data['text']==text,data)
                    # Actual viewport capture avoids Chromium's surface-origin
                    # screenshot artifact on pre-repair negative RTL overflow.
                    screenshot = page.context.new_cdp_session(page).send('Page.captureScreenshot',
                        {'format': 'png', 'fromSurface': False, 'captureBeyondViewport': False})
                    (out/(cid+'-'+direction+'.png')).write_bytes(base64.b64decode(screenshot['data']))
                check('text fixture '+direction+' has no horizontal page overflow',page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
                head=page.locator('#section-title button')
                head.press('Enter')
                check('long disclosure title '+direction+' remains keyboard usable',head.get_attribute('aria-expanded')=='true' and page.locator('#details').is_visible())
                close=page.locator('#note-title button');box=close.bounding_box()
                check('long note '+direction+' close target remains contained and 48px',box['width']>=48 and box['height']>=48 and box['x']>=-1 and box['x']+box['width']<=361,box)
                close.press('Enter')
                check('long note '+direction+' keyboard close works',not page.locator('#note-title .m-note').is_visible())
            check('no browser or HTTP resource errors',not errors and not resource_errors,{'errors':errors,'resources':resource_errors})
            browser.close()
    finally:
        server.shutdown()
    paths=['components/organization/organization.css','components/messages/messages.css','components/info-strip/info-strip.js','components/info-strip/info-strip-peek.js','previews/ui-system-showcase/index.html','previews/ui-system-showcase/showcase.js']
    report={'sourceCommitAtRun':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'readOnlySourceRef':args.source_ref,'textOnly':args.text_only,'textScreenshotMethod':'CDP Page.captureScreenshot fromSurface=false, captureBeyondViewport=false; actual 360x780 viewport','browser':version,'viewport':{'width':360,'height':780},'theme':'light','passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks,'families':families,'variants':variants,'textGeometry':text_geometry,'sourceSha256':{p:hashlib.sha256((subprocess.check_output(['git','show',args.source_ref+':'+p],cwd=ROOT) if args.source_ref else (ROOT/p).read_bytes())).hexdigest() for p in paths},'limits':['Chromium automation and inspected screenshots; no physical device or screen reader.','Historical SourceRef serves CSS/JS without checking out a branch.','This audit does not implement compositions or establish Micro integration acceptance.']}
    (out/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f"{report['passed']} PASS / {report['failed']} FAIL; {out}")
    return 1 if report['failed'] else 0


if __name__=='__main__':
    raise SystemExit(main())
