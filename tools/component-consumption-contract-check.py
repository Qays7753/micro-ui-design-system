#!/usr/bin/env python3
"""Focused pre-transfer contracts; source only, Light, 360x780 RTL. No product host."""
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
CSS = ['assets/fonts/fonts.css', 'shared/tokens.css', 'shared/motion.css'] + [
    f'components/{family}/{family}.css' for family in
    ['buttons', 'fields', 'selection', 'navigation', 'messages', 'data', 'metric-comparison', 'access-gateway']
] + ['components/selection/picker.css', 'components/data/packed-circle.css']
JS = [f'components/{family}/{family}.js' for family in
      ['buttons', 'fields', 'selection', 'navigation', 'messages', 'data', 'metric-comparison', 'access-gateway']
      ] + ['components/selection/picker.js', 'components/data/packed-circle.js']
BODY = '''
<button id="opener" class="m-btn" data-layer-open="layer">فتح اللوحة</button>
<button id="outside" class="m-btn">متابعة</button>
<svg aria-hidden="true" style="display:none"><symbol id="close-icon" viewBox="0 0 24 24"><path d="M4 4L20 20M20 4L4 20"/></symbol></svg>
<div class="m-layer-backdrop" data-for="layer" hidden></div>
<div class="m-layer" id="layer" role="dialog" aria-modal="true" aria-labelledby="layer-title" hidden>
 <div class="m-layer__head"><h2 class="m-layer__title" id="layer-title">لوحة مستقلة</h2>
 <button class="m-btn m-btn--icon m-btn--secondary" data-layer-close aria-label="إغلاق"><svg aria-hidden="true"><use href="#close-icon"/></svg></button></div>
 <div class="m-layer__body">محتوى ثابت</div></div>
<div class="m-picker" data-micro-picker id="picker"><input class="m-picker__input" data-picker-search aria-label="بحث"><div class="m-picker__list" data-picker-list role="listbox" aria-label="الخيارات"></div><p data-picker-summary></p></div>
<button class="m-btn m-btn--primary m-btn--loading-replace" id="replace">حفظ العملية</button>
<button class="m-btn m-btn--primary" id="default">حفظ العملية</button>
<div class="m-access-gateway"><button class="m-access-gateway__link" type="button" data-access-recovery>نسيت كلمة المرور؟</button></div>
<div class="m-chart" data-chart="bars" data-value-domain="signed" id="signed"><h2 class="m-chart__title">قيم موقعة</h2><ul class="m-chart__data" hidden><li data-series="a" data-label="سالب" data-value="-60"></li><li data-series="a" data-label="صفر" data-value="0"></li><li data-series="a" data-label="مفقود"></li><li data-series="a" data-label="مشوه" data-value="12oops"></li></ul><div data-plot></div><p data-chart-summary></p></div>
<div class="m-main-metric m-main-metric--flat" data-main-comparison data-common-unit="طلب" data-common-period="اليوم" id="metric"><h2 class="m-main-metric__title">مقارنة</h2><div class="m-main-metric__hero"><span class="m-main-metric__label">قيمة رئيسية</span><span class="m-main-metric__number">18</span><span class="m-main-metric__unit">طلب</span></div><ul data-bar-source hidden><li data-series="a" data-label="سالب" data-value="-9" data-unit="طلب" data-period="اليوم"></li><li data-series="a" data-label="صفر" data-value="0" data-unit="طلب" data-period="اليوم"></li><li data-series="a" data-label="مشوه" data-value="12oops" data-unit="طلب" data-period="اليوم"></li></ul><ul class="m-main-metric__rows" data-bar-items></ul><p data-bar-status></p></div>
<div class="m-metric-circles" data-metric-circles data-layout="separated" id="circles"><h2 class="m-metric-circles__title">دوائر</h2><ul data-metric-source hidden><li data-series="a" data-label="سالب" data-value="-5" data-unit="طلب"></li><li data-series="a" data-label="موجب" data-value="10" data-unit="طلب"></li></ul><ol data-metric-items></ol><ul data-metric-fallback></ul><p data-metric-empty hidden></p><p data-metric-scale></p></div>
<div class="m-chart m-chart--packed" data-chart="bubbles" data-chart-packed id="packed"><h2 class="m-chart__title">مساحات اختيارية</h2><ul class="m-chart__data" hidden><li data-series="a" data-label="سالب" data-value="-5"></li><li data-series="a" data-label="موجب" data-value="10"></li></ul><div data-plot></div><p data-chart-summary></p></div>
<div class="m-chart" data-chart="line" data-value-domain="signed" data-axis-type="time" id="time"><h2 class="m-chart__title">زمن معلن</h2><ul class="m-chart__data" hidden><li data-series="a" data-label="قراءة صباحية" data-x="2026-01-02" data-value="-20"></li><li data-series="a" data-label="قراءة مسائية" data-x="2026-02-13" data-value="40"></li></ul><div data-plot></div><p data-chart-summary></p></div>
<div class="m-toast" id="toast" data-return-focus="#opener" hidden><span class="m-toast__text">تأكيد غير حرج</span><button class="m-btn" data-toast-close>إغلاق</button><button class="m-btn" id="toast-second">إجراء محلي</button></div>
'''
FIXTURE = ('<!doctype html><html lang="ar" dir="rtl" data-theme="light"><head><meta charset="utf-8">'
           '<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,">'
           + ''.join(f'<link rel="stylesheet" href="/{p}">' for p in CSS)
           + '<style>body{margin:16px;font-family:var(--micro-font-family)}body>div{margin-block:16px;min-width:0}</style></head><body>'
           + BODY + ''.join(f'<script src="/{p}"></script>' for p in JS) + '</body></html>')


class Handler(http.server.SimpleHTTPRequestHandler):
    source_ref = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path == '/consumption-contract.html':
            body, content_type = FIXTURE.encode(), 'text/html; charset=utf-8'
        elif self.source_ref and self.path.endswith(('.js', '.css')):
            path = self.path.lstrip('/')
            body = subprocess.check_output(['git', 'show', self.source_ref + ':' + path], cwd=ROOT)
            content_type = 'text/javascript' if path.endswith('.js') else 'text/css'
        else:
            return super().do_GET()
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.end_headers()
        self.wfile.write(body)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path)
    parser.add_argument('--source-ref', help='read-only baseline reproduction; never checks out a ref')
    args = parser.parse_args()
    out = args.out or Path(tempfile.mkdtemp(prefix='micro-consumption-'))
    out.mkdir(parents=True, exist_ok=True)
    Handler.source_ref = args.source_ref
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    checks, errors = [], []

    def check(name, ok, detail=None):
        checks.append({'name': name, 'passed': bool(ok), 'detail': detail})
        print(('PASS ' if ok else 'FAIL ') + name, flush=True)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            version = browser.version
            page = browser.new_page(viewport={'width': 360, 'height': 780}, is_mobile=True,
                                    has_touch=True, color_scheme='light', reduced_motion='reduce')
            page.set_default_timeout(5000)
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('requestfailed', lambda r: errors.append(r.url))
            page.goto(f'http://127.0.0.1:{server.server_port}/consumption-contract.html')
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(80)
            page.locator('#opener').click()
            page.wait_for_timeout(80)
            stayed = True
            for key in ['Tab', 'Tab', 'Shift+Tab', 'Shift+Tab']:
                page.keyboard.press(key)
                stayed &= page.locator('#layer').evaluate('e=>e.contains(document.activeElement)')
            check('single icon-close modal traps Tab in both directions', stayed)
            page.keyboard.press('Escape')
            check('modal restores its opener', page.locator('#opener').evaluate('e=>e===document.activeElement'))
            page.evaluate("""()=>{const original=document.getElementById('picker');
              MicroPicker.setOptions(original,[{value:'a',label:'أول'},{value:'b',label:'ثان'}]);
              const clone=original.cloneNode(true);clone.id='picker-clone';
              clone.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));document.body.append(clone);
              window.auditPickerChanges=0;clone.addEventListener('micro-picker:change',()=>auditPickerChanges++);
              MicroPicker.init(clone);MicroPicker.init(clone)}""")
            page.locator('#picker-clone .m-picker__option').last.click()
            check('picker clone selects and emits exactly once', page.evaluate("""()=>{
              const selected=MicroPicker.getSelected(document.getElementById('picker-clone'));
              return selected&&selected.value==='b'&&auditPickerChanges===1;}"""))
            page.evaluate("window.auditPickerBefore=auditPickerChanges;MicroPicker.disconnect(document.getElementById('picker-clone'));MicroPicker.init(document.getElementById('picker-clone'))")
            page.locator('#picker-clone .m-picker__option').first.click()
            check('picker reconnect remains single-bound', page.evaluate("auditPickerChanges===auditPickerBefore+1&&MicroPicker.getSelected(document.getElementById('picker-clone')).value==='a'"))
            page.evaluate("MicroButtons.setLoading(document.getElementById('replace'),true);MicroButtons.setLoading(document.getElementById('default'),true)")
            check('replacement loading hides its visible label', page.locator('#replace .m-btn__label').evaluate("e=>getComputedStyle(e).opacity==='0'"))
            check('default loading preserves its text', page.locator('#default').evaluate("e=>!e.querySelector('.m-btn__label')||getComputedStyle(e.querySelector('.m-btn__label')).opacity==='1'"))
            style = page.locator('[data-access-recovery]').evaluate("""e=>{const s=getComputedStyle(e);return {font:s.fontFamily,border:s.borderStyle,background:s.backgroundColor}}""")
            check('recovery action uses library font and no native button chrome',
                  'IBM Plex' in style['font'] and style['border'] == 'none'
                  and style['background'] == 'rgba(0, 0, 0, 0)', style)
            for root in ['signed', 'metric', 'circles', 'packed', 'time']:
                page.locator('#' + root + ' button[aria-expanded]').click()
            # Compare actual glyph positions, not just dir attributes.
            order_probe = """e=>{const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;
              while(n=w.nextNode()){const i=n.textContent.indexOf('-');if(i<0||!/[0-9]/.test(n.textContent[i+1]||''))continue;
                const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);const sign=r.getBoundingClientRect();
                r.setStart(n,i+1);r.setEnd(n,i+2);const digit=r.getBoundingClientRect();
                return {text:e.textContent,sign:sign.x,digit:digit.x,valid:sign.x<digit.x};}return {text:e.textContent,valid:false}}"""
            for direction in ['rtl', 'ltr']:
                page.evaluate('dir=>document.documentElement.dir=dir', direction)
                for root, index in [('signed', 0), ('metric', 1), ('circles', 0), ('packed', 0)]:
                    cell = page.locator('#' + root + ' tbody tr').nth(index).locator('td').first
                    cell.scroll_into_view_if_needed()
                    order = cell.evaluate(order_probe)
                    check(root + ': negative sign precedes digits / ' + direction, order['valid'], order)
                date_probe = """e=>{const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let n;
                  while(n=w.nextNode()){const i=n.textContent.indexOf('2026-01-02');if(i<0)continue;
                    const point=o=>{const r=document.createRange();r.setStart(n,i+o);r.setEnd(n,i+o+1);const b=r.getBoundingClientRect();return {x:b.x,y:b.y}};
                    const a=point(0),b=point(5),c=point(8),before=(l,r)=>l.y<r.y-1||Math.abs(l.y-r.y)<1&&l.x<r.x;
                    return {text:e.textContent,year:a,month:b,day:c,valid:before(a,b)&&before(b,c)};}return {text:e.textContent,valid:false}}"""
                for label, locator in [('visible time reading', page.locator('#time .m-chart__readings dt').first),
                                       ('time table label', page.locator('#time tbody th').first)]:
                    locator.scroll_into_view_if_needed()
                    order = locator.evaluate(date_probe)
                    check(label + ': explicit ISO year-month-day order / ' + direction, order['valid'], order)

            check('data table retains invalid raw input and state', '12oops' in page.locator('#signed table').inner_text() and 'قيمة غير صالحة' in page.locator('#signed table').inner_text())
            check('metric table retains zero and Arabic state', '0 (صفر)' in page.locator('#metric table').inner_text())
            page.evaluate("document.documentElement.dir='rtl'")
            page.locator('#metric').screenshot(path=str(out / 'signed-table.png'))
            page.clock.install()
            page.locator('#outside').focus()
            page.evaluate("window.auditClosed=0;window.auditDismissed=0;const t=document.getElementById('toast');t.addEventListener('micro-messages:toast-closed',()=>auditClosed++);t.addEventListener('micro-messages:toast-dismissed',()=>auditDismissed++);MicroMessages.toast(t,{duration:1000})")
            check('toast appearance never steals focus', page.locator('#outside').evaluate('e=>e===document.activeElement'))
            page.locator('#toast [data-toast-close]').focus()
            page.clock.run_for(2000)
            check('focused toast survives its original expiry', page.locator('#toast').is_visible() and page.evaluate('auditDismissed===0'))
            page.evaluate("MicroMessages.closeToast(document.getElementById('toast'));auditClosed=0;window.auditBeforeManual=auditDismissed;MicroMessages.toast(document.getElementById('toast'),{duration:10000})")
            page.locator('#toast [data-toast-close]').focus()
            page.keyboard.press('Enter')
            check('manual close returns focus to declared target once', not page.locator('#toast').is_visible() and page.locator('#opener').evaluate('e=>e===document.activeElement') and page.evaluate('auditClosed===1'))
            page.clock.run_for(12000)
            check('manual close cancels pending expiry', page.evaluate('auditDismissed===auditBeforeManual'))
            page.evaluate("MicroMessages.toast(document.getElementById('toast'),{duration:1000})")
            page.locator('#toast [data-toast-close]').focus()
            page.locator('#toast-second').focus()
            page.clock.run_for(2000)
            check('focus movement between toast children stays paused', page.locator('#toast').is_visible())
            page.locator('#outside').focus()
            page.clock.run_for(400)
            check('focus exit resumes remaining lifetime', page.locator('#toast').is_visible())
            page.clock.run_for(1600)
            check('resumed expiry hides without stealing outside focus', not page.locator('#toast').is_visible() and page.locator('#outside').evaluate('e=>e===document.activeElement'))
            page.evaluate("MicroMessages.toast(document.getElementById('toast'),{duration:1000})")
            page.locator('#outside').focus()
            page.evaluate("MicroMessages.closeToast(document.getElementById('toast'))")
            check('programmatic close never steals outside focus', page.locator('#outside').evaluate('e=>e===document.activeElement'))
            page.evaluate("MicroMessages.toast(document.getElementById('toast'),{duration:1000})")
            page.locator('#toast [data-toast-close]').focus()
            page.evaluate("MicroMessages.disconnect(document.getElementById('toast'));window.auditDismissedBefore=auditDismissed")
            page.clock.run_for(3000)
            check('disconnect cleans paused toast and leaves no late expiry', not page.locator('#toast').is_visible() and page.evaluate('auditDismissed===auditDismissedBefore'))
            page.evaluate("MicroMessages.init(document.getElementById('toast'));document.getElementById('toast').removeAttribute('data-return-focus');MicroMessages.toast(document.getElementById('toast'),{duration:1000,returnFocus:document.getElementById('outside')})")
            page.locator('#toast [data-toast-close]').focus()
            page.keyboard.press('Enter')
            check('caller can declare a dynamic Element return target', page.locator('#outside').evaluate('e=>e===document.activeElement'))
            page.evaluate("MicroMessages.toast(document.getElementById('toast'),{duration:1000})")
            page.locator('#toast [data-toast-close]').focus()
            page.clock.run_for(500)
            page.evaluate("MicroMessages.toast(document.getElementById('toast'),{duration:1000})")
            page.clock.run_for(2000)
            check('re-show while focused starts a paused fresh lifetime', page.locator('#toast').is_visible())
            page.locator('#outside').focus()
            page.clock.run_for(400)
            check('fresh lifetime is not shortened by old callbacks', page.locator('#toast').is_visible())
            page.clock.run_for(1600)
            check('fresh session expires normally after focus leaves', not page.locator('#toast').is_visible())
            page.evaluate("document.getElementById('toast').setAttribute('data-return-focus','#opener');document.getElementById('toast').querySelector('[data-toast-close]').setAttribute('data-return-focus','#outside');MicroMessages.toast(document.getElementById('toast'),{duration:1000})")
            page.locator('#toast [data-toast-close]').focus()
            page.keyboard.press('Enter')
            check('explicit close-button return target overrides root target', page.locator('#outside').evaluate('e=>e===document.activeElement'))
            page.evaluate("document.getElementById('outside').disabled=true;MicroMessages.toast(document.getElementById('toast'),{duration:1000})")
            page.locator('#toast [data-toast-close]').focus()
            page.keyboard.press('Enter')
            check('disabled return target is never focused', not page.locator('#toast').is_visible() and not page.locator('#outside').evaluate('e=>e===document.activeElement'))
            check('no source JavaScript or resource errors', not errors, errors)
            browser.close()
    finally:
        server.shutdown()
        server.server_close()
    report = {'sourceRef': args.source_ref or 'working tree', 'browser': version,
              'scope': '360x780 Light; RTL and numeric-direction LTR; controlled clock for toast',
              'passed': sum(c['passed'] for c in checks), 'failed': sum(not c['passed'] for c in checks), 'checks': checks}
    (out / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(f"{report['passed']} PASS / {report['failed']} FAIL")
    return int(bool(report['failed']))


if __name__ == '__main__':
    raise SystemExit(main())
