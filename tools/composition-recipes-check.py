#!/usr/bin/env python3
"""C01/C02/C03: Light 360x780 RTL, focused 320 rows and directional LTR.

Actual source styles, keyboard, geometry, native dialog and consumer lifecycle.
Source-only routes omit preview CSS, without simulating a future product host.
"""
import argparse
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
PAGES = {'value': 'summary-example.html', 'row': 'row-example.html', 'form': 'form-example.html'}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_):
        pass

    def do_GET(self):
        path = urlsplit(self.path).path
        if path.startswith('/source-only/'):
            name = path.split('/')[-1]
            if name not in PAGES.values():
                self.send_error(404)
                return
            html = (ROOT / 'previews/compositions' / name).read_text()
            html = html.replace('<link rel="stylesheet" href="compositions.css">', '')
            html = html.replace('src="compositions.js"', 'src="/previews/compositions/compositions.js"')
            html = html.replace('</head>', '<style>body{margin:0;padding:16px;box-sizing:border-box}main{max-width:100%;margin:0}body>main{width:100%}</style></head>')
            body = html.encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path)
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix='composition-recipes-'))
    out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{server.server_port}'
    checks, errors, resource_errors, measurements = [], [], [], []

    def check(name, passed, detail=None):
        checks.append({'name': name, 'passed': bool(passed), 'detail': detail})
        if not passed:
            print('FAIL ' + name + ': ' + str(detail)[:250], flush=True)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            browser_version = browser.version
            page = browser.new_page(viewport={'width': 360, 'height': 780}, color_scheme='light', locale='ar', reduced_motion='reduce')
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.on('response', lambda r: resource_errors.append({'status': r.status, 'path': urlsplit(r.url).path}) if r.status >= 400 else None)

            def goto(which, source_only=False):
                route = '/source-only/' if source_only else '/previews/compositions/'
                page.goto(base + route + PAGES[which], wait_until='networkidle')
                page.evaluate('document.fonts.ready')

            def shot(name):
                page.screenshot(path=str(out / (name + '.png')))

            def contained(name, selector):
                data = page.locator(selector).evaluate('''e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width,height:r.height,documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,overflow:getComputedStyle(e).overflowX}}''')
                measurements.append({'name': name, **data})
                check(name, data['width'] > 0 and data['left'] >= -1 and data['right'] <= data['viewport'] + 1 and data['documentWidth'] <= data['viewport'], data)

            def reading(name, selector, root_selector, expected):
                data = page.locator(selector).evaluate('''(e,rootSelector)=>{const root=e.closest(rootSelector),b=root.getBoundingClientRect(),r=document.createRange();r.selectNodeContents(e);return {text:e.textContent,rects:[...r.getClientRects()].map(x=>({left:x.left,right:x.right})),left:b.left,right:b.right,ellipsis:getComputedStyle(e).textOverflow==='ellipsis'}}''', root_selector)
                check(name, data['text'] == expected and not data['ellipsis'] and all(r['left'] >= data['left']-1 and r['right'] <= data['right']+1 for r in data['rects']), data)

            def targets(name, selector):
                data = page.locator(selector).evaluate('''root=>{const els=[...root.querySelectorAll('button,a[href],summary')].filter(e=>e.getClientRects().length&&!e.closest('[hidden]'));const bad=[];for(const e of els){const r=e.getBoundingClientRect();if(r.width<47.9||r.height<47.9)bad.push({kind:'small',tag:e.tagName,text:e.textContent,width:r.width,height:r.height});}for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){if(els[i].contains(els[j])||els[j].contains(els[i]))continue;const a=els[i].getBoundingClientRect(),b=els[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)bad.push({kind:'overlap',a:els[i].textContent,b:els[j].textContent});}return {count:els.length,bad}}''')
                check(name, data['count'] > 0 and not data['bad'], data)

            # C01: same source in two contexts, literal values/units, explicit states.
            goto('value')
            contained('C01 count context contained', '#count-reading')
            contained('C01 amount context contained', '#amount-reading')
            reading('C01 signed amount and precision preserved', '#amount-reading .m-info-card__number', '.m-info-card', '−1,250.750')
            check('C01 unit stays outside the numeric isolate', page.locator('#amount-reading bdi .m-info-card__unit').count() == 0 and page.locator('#amount-reading .m-info-card__unit').inner_text() == 'د.أ')
            check('C01 absent action/status is not synthesized', page.locator('#amount-reading button,#amount-reading a,#amount-reading .m-badge').count() == 0)
            targets('C01 source action meets touch geometry', '#count-reading')
            shot('c01-count-360-rtl')
            page.locator('#amount-reading').scroll_into_view_if_needed();shot('c01-amount-360-rtl')
            page.locator('.demo-tools summary').click()
            for state,expected in [('zero','0'),('missing','غير متاح'),('signed','−12.500'),('long','123,456,789.125')]:
                page.locator('[data-reading-state="'+state+'"]').click()
                reading('C01 '+state+' value visible without coercion', '#count-reading .m-info-card__number', '.m-info-card', expected)
                check('C01 '+state+' missing unit is explicit', page.locator('#count-reading .m-info-card__unit').is_visible() == (state != 'missing'))
            last = page.locator('#count-reading .m-info-card__number').inner_text()
            for state in ['pending','error']:
                page.locator('[data-reading-state="'+state+'"]').click()
                check('C01 '+state+' keeps and qualifies previous reading', page.locator('#count-reading .m-info-card__number').inner_text() == last and 'القراءة السابقة' in page.locator('#count-reading .m-info-card__qualifier').inner_text())
                check('C01 '+state+' busy state is consumer controlled', (page.locator('#count-reading').get_attribute('aria-busy') == 'true') == (state == 'pending'))
            page.locator('[data-reading-state="ready"]').click()
            page.locator('#count-reading .m-info-card__footer').evaluate('e=>e.hidden=true')
            check('C01 optional footer hidden actually removes layout', not page.locator('#count-reading .m-info-card__footer').is_visible())
            page.locator('#count-reading .m-info-card__footer').evaluate('e=>e.hidden=false')
            page.locator('#amount-reading').evaluate('e=>e.classList.add("m-info-card--featured")')
            check('C01 featured context and note use the existing inverse token', page.locator('#amount-reading .m-info-card__context').evaluate('e=>getComputedStyle(e).color') == page.locator('#amount-reading .m-info-card__number').evaluate('e=>getComputedStyle(e).color'))
            # C02: two real lists, independent targets, native disclosure and empty state.
            goto('row')
            check('C02 both contexts have semantic list items', page.locator('ul[role=list]').count() == 2 and page.locator('ul[role=list] > li').count() == 4)
            check('C02 no nested link/button/summary targets', page.locator('a button,button a,summary button,summary a,a a').count() == 0)
            for selector in ['#collection-row','#single-link-row','#stock-row','#disclosure-row']:
                contained('C02 row '+selector+' contained', selector)
            targets('C02 list actions are48px and nonoverlapping', '#stock-list')
            page.locator('#stock-row').scroll_into_view_if_needed();shot('c02-stock-360-rtl')
            before_count=page.evaluate('CompositionPreview.getRowActionCount()')
            page.locator('[data-row-action="stock"]').focus();page.keyboard.press('Enter')
            check('C02 one keyboard action invokes consumer once', page.evaluate('CompositionPreview.getRowActionCount()') == before_count+1)
            page.locator('#disclosure-row summary').press('Enter')
            check('C02 native disclosure opens associated details', page.locator('#disclosure-row details').evaluate('e=>e.open') and page.locator('#material-details').is_visible())
            page.locator('[data-row-action="detail"]').press('Enter')
            check('C02 internal action does not toggle disclosure', page.locator('#disclosure-row details').evaluate('e=>e.open') and page.evaluate('CompositionPreview.getRowActionCount()') == before_count+2)
            page.locator('#disclosure-row summary').press('Space')
            check('C02 disclosure closes with keyboard', not page.locator('#material-details').is_visible())
            check('C02 collapsed disclosure points to the RTL opening direction', page.locator('#disclosure-row .m-section__chevron').evaluate('e=>new DOMMatrix(getComputedStyle(e).transform).b>0.9'))
            page.locator('#single-link-row').press('Enter')
            check('C02 single target is a real local destination', page.url.endswith('#row-origin'))
            page.locator('.demo-tools summary').click()
            for state in ['empty','pending','error','ready']:
                page.locator('[data-list-mode="'+state+'"]').click()
                check('C02 '+state+' keeps data separate from empty/pending state', page.locator('#stock-list').is_visible() == (state!='empty') and page.locator('#stock-empty').is_visible() == (state=='empty') and page.locator('#stock-list > li').count() == 2)
            reading('C02 exact long value preserved', '#stock-row .m-row__value', '.m-row', '123,456,789.125')
            page.set_viewport_size({'width':320,'height':780})
            contained('C02 targeted320 actions and long value contained', '#stock-row')
            targets('C02 targeted320 actions do not overlap or shrink', '#stock-list')
            page.locator('#stock-row').scroll_into_view_if_needed();shot('c02-stock-320-rtl')
            page.set_viewport_size({'width':360,'height':780})
            page.evaluate('document.documentElement.dir="ltr"')
            contained('C02 directional LTR row contained', '#stock-row')
            targets('C02 LTR independent actions retain geometry', '#stock-list')
            check('C02 collapsed disclosure follows inherited LTR direction', page.locator('#disclosure-row .m-section__chevron').evaluate('e=>new DOMMatrix(getComputedStyle(e).transform).b< -0.9'))
            # C03: raw/valid/prefill/pending/result are separate consumer state.
            goto('form')
            inline=page.locator('#inline-form')
            check('C03 initial prefilled readonly field is not dirty', page.evaluate('CompositionPreview.getFormState(document.querySelector("#dialog-form")).dirty') is False)
            contained('C03 inline surface contained', '#inline-form')
            page.locator('#inline-form').scroll_into_view_if_needed();shot('c03-inline-360-rtl')
            page.locator('#form-tools > summary').click()
            page.locator('[data-prefill-form="inline-form"]').click()
            state=page.evaluate('CompositionPreview.getFormState(document.querySelector("#inline-form"))')
            check('C03 prefill updates source silently without dirty/input events', state['raw']['title']=='عنوان عينة مسبق' and not state['dirty'] and state['inputsSeen']==0, state)
            page.locator('#inline-title').fill(' ')
            inline.locator('[type=submit]').press('Enter')
            check('C03 invalid raw text survives validation and keeps focus', page.locator('#inline-title').input_value()==' ' and page.locator('#inline-title').get_attribute('aria-invalid')=='true' and page.locator('#inline-title').evaluate('e=>e===document.activeElement'))
            check('C03 hint/error references are unique and linked', page.locator('#inline-title').evaluate(r'''e=>e.getAttribute('aria-describedby').split(/\s+/).every(id=>[...document.querySelectorAll('[id]')].filter(node=>node.id===id).length===1)'''))
            page.locator('#inline-title').fill('عنوان عينة معدل');page.locator('#inline-note').fill('تفاصيل باقية')
            inline.locator('[type=submit]').press('Enter')
            page.wait_for_function('CompositionPreview.getFormState(document.querySelector("#inline-form")).pending')
            inline.locator('[type=submit]').focus();page.keyboard.press('Enter')
            page.evaluate('document.querySelector("#inline-form").requestSubmit()')
            check('C03 pending blocks repeated submit without a success timer', page.evaluate('CompositionPreview.getFormState(document.querySelector("#inline-form")).submissions')==1 and inline.get_attribute('aria-busy')=='true')
            page.locator('[data-resolve-form="inline-form"][data-result="neutral"]').click()
            page.wait_for_function('!CompositionPreview.getFormState(document.querySelector("#inline-form")).pending')
            check('C03 undefined result stays neutral', inline.locator('[data-form-feedback]').get_attribute('role')=='status' and 'دون نتيجة مؤكدة' in inline.locator('[data-feedback-body]').inner_text() and not inline.locator('[data-form-feedback]').evaluate('e=>e.classList.contains("m-note--success")'))
            inline.locator('[type=submit]').press('Enter')
            page.wait_for_function('CompositionPreview.getFormState(document.querySelector("#inline-form")).pending')
            page.locator('[data-resolve-form="inline-form"][data-result="error"]').click()
            page.wait_for_function('!CompositionPreview.getFormState(document.querySelector("#inline-form")).pending')
            check('C03 rejected promise preserves raw values and gives a persistent error', inline.locator('[data-form-feedback]').get_attribute('role')=='alert' and 'رفض' in inline.locator('[data-feedback-body]').inner_text() and page.locator('#inline-note').input_value()=='تفاصيل باقية')
            page.evaluate('''()=>{window.auditCalls=0;const f=document.querySelector('#inline-form');const a=CompositionPreview.initForm(f);const b=CompositionPreview.initForm(f,{onSubmit:()=>{auditCalls++;return false}});window.sameController=a===b;CompositionPreview.initForm(f,{onSubmit:()=>{auditCalls++;return false}})}''')
            inline.locator('[type=submit]').press('Enter');page.wait_for_function('auditCalls===1')
            check('C03 changing callbacks does not duplicate submission or listeners', page.evaluate('sameController&&auditCalls===1'))
            page.wait_for_function('!CompositionPreview.getFormState(document.querySelector("#inline-form")).pending')
            check('C03 false result is not success', 'دون نتيجة مؤكدة' in inline.locator('[data-feedback-body]').inner_text())
            page.evaluate('''()=>CompositionPreview.initForm(document.querySelector('#inline-form'),{onSubmit:()=>new Promise(resolve=>window.finishOld=resolve)})''')
            inline.locator('[type=submit]').press('Enter');page.wait_for_function('typeof finishOld==="function"')
            page.evaluate('CompositionPreview.destroyForm(document.querySelector("#inline-form"))')
            old_html=inline.locator('[data-form-feedback]').inner_html()
            check('C03 disposal does not leave a false pending announcement', 'تنتظر' not in inline.locator('[data-feedback-body]').inner_text() and inline.get_attribute('aria-busy')!='true')
            page.evaluate('finishOld({confirmed:true,message:"stale result"})');page.wait_for_timeout(80)
            check('C03 teardown cancels UI ownership and ignores late promise result', inline.locator('[data-form-feedback]').inner_html()==old_html and inline.get_attribute('aria-busy')!='true' and page.evaluate('CompositionPreview.getFormState(document.querySelector("#inline-form"))===null'))
            page.evaluate('''()=>CompositionPreview.initForm(document.querySelector('#inline-form'),{onSubmit:()=>({confirmed:true,message:'نتيجة أكدها المستهلك'})})''')
            check('C03 new consumer lifetime clears old feedback without clearing raw values', not inline.locator('[data-form-feedback]').is_visible() and page.locator('#inline-note').input_value()=='تفاصيل باقية')
            inline.locator('[type=submit]').press('Enter');page.wait_for_function('document.querySelector("#inline-form [data-feedback-body]").textContent.includes("أكدها")')
            check('C03 only explicit confirmation produces success feedback', inline.locator('[data-form-feedback]').evaluate('e=>e.classList.contains("m-note--success")'))
            page.evaluate('''()=>CompositionPreview.initForm(document.querySelector('#inline-form'),{onSubmit:()=>new Promise(resolve=>window.finishEdited=resolve)})''')
            inline.locator('[type=submit]').press('Enter');page.wait_for_function('typeof finishEdited==="function"')
            page.locator('#inline-title').fill('x')
            page.evaluate('finishEdited({confirmed:true,message:"old values"})')
            page.wait_for_function('!CompositionPreview.getFormState(document.querySelector("#inline-form")).pending')
            check('C03 edits during pending retain new invalid raw text and qualify old result', page.locator('#inline-title').input_value()=='x' and 'تغيّر النص أثناء الانتظار' in inline.locator('[data-feedback-body]').inner_text() and not inline.locator('[data-form-feedback]').evaluate('e=>e.classList.contains("m-note--success")'))
            # A native dialog is the sole modal owner; no Navigation D01 API used.
            opener=page.locator('#open-form-dialog');dialog=page.locator('#form-dialog');dialog_form=page.locator('#dialog-form')
            opener.click()
            check('C03 native dialog opens focused and contained', dialog.evaluate('d=>d.open&&d.contains(document.activeElement)'))
            contained('C03 native layer contained at360', '#form-dialog')
            targets('C03 native form actions are48px without overlap', '#dialog-form')
            shot('c03-dialog-360-rtl')
            page.locator('#inline-title').evaluate('e=>e.focus()')
            check('C03 native modal prevents outside focus', dialog.evaluate('d=>d.contains(document.activeElement)'))
            for _ in range(9):page.keyboard.press('Tab')
            check('C03 Tab remains inside native dialog', dialog.evaluate('d=>d.contains(document.activeElement)'))
            page.keyboard.press('Escape');page.wait_for_function('!document.querySelector("#form-dialog").open')
            check('C03 clean close restores focus and scroll ownership', opener.evaluate('e=>e===document.activeElement') and page.evaluate('document.documentElement.style.overflow===""'))
            page.locator('[data-prefill-form="dialog-form"]').click();opener.click()
            check('C03 dialog prefill remains clean with readonly source', page.evaluate('!CompositionPreview.getFormState(document.querySelector("#dialog-form")).dirty') and page.locator('#dialog-origin').input_value()=='DEMO')
            page.locator('#dialog-reference').fill('مرجع غير صالح')
            dialog_form.locator('[type=submit]').press('Enter')
            check('C03 native pattern rejects invalid reference and retains raw text', page.locator('#dialog-reference').evaluate('e=>e.validity.patternMismatch&&e.getAttribute("aria-invalid")==="true"') and page.locator('#dialog-reference').input_value()=='مرجع غير صالح' and not page.evaluate('CompositionPreview.getFormState(document.querySelector("#dialog-form")).pending'))
            page.keyboard.press('Escape')
            check('C03 invalid raw edit is dirty and denied close remains visible', dialog.evaluate('d=>d.open') and dialog.locator('[data-close-confirm]').is_visible() and page.locator('#dialog-reference').input_value()=='مرجع غير صالح' and page.evaluate('CompositionPreview.getFormState(document.querySelector("#dialog-form")).dirty'))
            shot('c03-close-decision-360-rtl')
            dialog.locator('[data-keep-editing]').press('Enter')
            check('C03 rejecting close keeps raw text and returns focus to editor', dialog.evaluate('d=>d.open') and page.locator('#dialog-reference').evaluate('e=>e===document.activeElement') and page.locator('#dialog-reference').input_value()=='مرجع غير صالح')
            dialog.locator('[data-example-close]').click();dialog.locator('[data-discard-example]').click()
            page.wait_for_function('!document.querySelector("#form-dialog").open')
            check('C03 accepted explicit close releases controller and modal', page.evaluate('CompositionPreview.getFormState(document.querySelector("#dialog-form"))===null') and opener.evaluate('e=>e===document.activeElement') and page.evaluate('document.documentElement.style.overflow===""'))
            page.evaluate('CompositionPreview.initForm(document.querySelector("#dialog-form")).prefill({reference:"",origin:"DEMO"})')
            opener.click();page.mouse.click(2,2);page.wait_for_function('!document.querySelector("#form-dialog").open')
            check('C03 clean backdrop request uses consumer close policy', not dialog.is_visible())
            opener.click();page.locator('#dialog-reference').fill('x invalid');page.mouse.click(2,2)
            check('C03 dirty backdrop request is denied by consumer', dialog.evaluate('d=>d.open') and dialog.locator('[data-close-confirm]').is_visible())
            dialog.locator('[data-discard-example]').click()
            page.wait_for_function('!document.querySelector("#form-dialog").open')
            page.evaluate('''()=>{const f=document.querySelector('#dialog-form');CompositionPreview.initForm(f,{onSubmit:()=>new Promise(resolve=>window.finishClosed=resolve)}).prefill({reference:'REF-002',origin:'DEMO'})}''')
            opener.click();dialog_form.locator('[type=submit]').press('Enter');page.wait_for_function('typeof finishClosed==="function"')
            page.keyboard.press('Escape');dialog.locator('[data-discard-example]').click()
            page.wait_for_function('!document.querySelector("#form-dialog").open')
            closed_html=dialog_form.locator('[data-form-feedback]').inner_html()
            page.evaluate('finishClosed({confirmed:true,message:"late dialog result"})');page.wait_for_timeout(80)
            check('C03 close during pending cleans up and ignores later resolution', dialog_form.locator('[data-form-feedback]').inner_html()==closed_html and dialog_form.get_attribute('aria-busy')!='true' and page.evaluate('document.documentElement.style.overflow===""'))
            page.evaluate('CompositionPreview.initForm(document.querySelector("#dialog-form")).prefill({reference:"REF-003",origin:"DEMO"})')
            opener.click();dialog_form.locator('[type=submit]').press('Enter')
            page.wait_for_function('CompositionPreview.getFormState(document.querySelector("#dialog-form")).pending')
            dialog.locator('details.demo-tools > summary').click()
            dialog.locator('[data-resolve-form="dialog-form"][data-result="confirmed"]').click()
            page.wait_for_function('!CompositionPreview.getFormState(document.querySelector("#dialog-form")).pending')
            check('C03 real in-dialog consumer controls can resolve the example', dialog_form.locator('[data-form-feedback]').evaluate('e=>e.classList.contains("m-note--success")'))
            dialog.locator('[data-example-close]').click()
            page.wait_for_function('!document.querySelector("#form-dialog").open')
            check('C03 prefilled confirmed example closes without a false dirty prompt', not dialog.is_visible())
            # Absence of preview CSS is a source dependency check, not stage5 host simulation.
            for which,selector in [('value','#count-reading'),('row','#stock-row'),('form','#inline-form')]:
                goto(which, source_only=True)
                check(which+' has no preview stylesheet dependency', page.locator('link[href="compositions.css"]').count()==0)
                contained(which+' source-only layout contained', selector)
                check(which+' source-only typography belongs to component', 'IBM Plex' in page.locator(selector).evaluate('e=>getComputedStyle(e).fontFamily'))
                targets(which+' source-only targets preserve touch geometry', selector)
            # Long error within the actual form; raw text/value remains untouched.
            check('C03 source-only dialog carrier keeps the approved font', page.locator('#form-dialog').evaluate('e=>getComputedStyle(e).fontFamily.includes("IBM Plex")'))
            page.evaluate('''()=>{const f=document.querySelector('#inline-form');const b=f.querySelector('[data-form-feedback]');b.hidden=false;b.className='m-form-surface__feedback m-note m-note--error';b.setAttribute('role','alert');b.querySelector('[data-feedback-body]').textContent='رسالةخطأطويلةمتصلةتحتاجاحتواء'.repeat(8)}''')
            reading('C03 source-only long error stays inside form', '#inline-form [data-feedback-body]', '.m-form-surface', 'رسالةخطأطويلةمتصلةتحتاجاحتواء'*8)
            contained('C03 source-only long error keeps form contained', '#inline-form')
            page.evaluate('document.documentElement.dir="ltr"')
            contained('C03 directional LTR source-only form contained', '#inline-form')
            check('no JavaScript/console/resource errors',not errors and not resource_errors,{'errors':errors,'resources':resource_errors})
            browser.close()
    finally:
        server.shutdown()
    sources=['components/info-strip/value-context.css','components/organization/operational-row.css','components/compositions/form-surface.css','previews/compositions/compositions.css','previews/compositions/compositions.js',*[f'previews/compositions/{x}' for x in PAGES.values()]]
    result={'sourceCommitAtRun':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'browser':browser_version,'scope':'C01/C02/C03 independent library recipes;360x780 RTL Light;320 row containment only;directional LTR;no Dark/zoom/Micro','passed':sum(c['passed'] for c in checks),'failed':sum(not c['passed'] for c in checks),'checks':checks,'measurements':measurements,'sourceSha256':{p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in sources},'limitations':['Chromium automation, no physical device or actual screen reader.','Form validation/results/dirty/Promise/dialog ownership in preview consumer only.','Native dialog browser API is used; Navigation guarded-close proposal D01 is not implemented.','Source-only routes verify CSS independence; broad host boundary fixtures remain stage5.']}
    (out/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    print(f"{result['passed']} PASS / {result['failed']} FAIL; {out}")
    return 1 if result['failed'] else 0


if __name__=='__main__':
    raise SystemExit(main())
