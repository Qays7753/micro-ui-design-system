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
# R2.3: الفيكسَر يستهلك dist/iife المبني — ملف واحد لكل مدخل (labels مضمنة).
JS = [f'dist/iife/{family}.js' for family in
      ['buttons', 'fields', 'selection', 'navigation', 'messages', 'data', 'metric-comparison', 'access-gateway']
      ] + ['dist/iife/picker.js', 'dist/iife/packed-circle.js', 'dist/iife/back.js', 'dist/iife/haptics.js']
BODY = '''
<button id="opener" class="m-btn" data-layer-open="layer">فتح اللوحة</button>
<button id="outside" class="m-btn">متابعة</button>
<svg aria-hidden="true" style="display:none"><symbol id="close-icon" viewBox="0 0 24 24"><path d="M4 4L20 20M20 4L4 20"/></symbol></svg>
<div class="m-layer-backdrop" data-for="layer" hidden></div>
<div class="m-layer" id="layer" role="dialog" aria-modal="true" aria-labelledby="layer-title" hidden>
 <div class="m-layer__head"><h2 class="m-layer__title" id="layer-title">لوحة مستقلة</h2>
 <button class="m-btn m-btn--icon m-btn--secondary" data-layer-close aria-label="إغلاق"><svg aria-hidden="true"><use href="#close-icon"/></svg></button></div>
 <div class="m-layer__body">محتوى ثابت<button id="opener2" class="m-btn" data-layer-open="layer2" type="button">فتح الثانية</button></div></div>
<div class="m-layer-backdrop" data-for="layer2" hidden></div>
<div class="m-layer" id="layer2" role="dialog" aria-modal="true" aria-labelledby="layer2-title" hidden>
 <div class="m-layer__head"><h2 class="m-layer__title" id="layer2-title">لوحة متداخلة</h2>
 <button class="m-btn m-btn--icon m-btn--secondary" data-layer-close aria-label="إغلاق"><svg aria-hidden="true"><use href="#close-icon"/></svg></button></div>
 <div class="m-layer__body" style="min-height:120px">محتوى قصير لفحص السحب</div></div>
<form id="mini-form" style="max-width:360px">
  <label class="m-field" data-micro-field><span class="m-field__label">الاسم</span><input class="m-field__input" id="f1" type="text"></label>
  <label class="m-field" data-micro-field><span class="m-field__label">المبلغ</span><input class="m-field__input" id="f2" type="text" inputmode="decimal"></label>
  <label class="m-field" data-micro-field><span class="m-field__label">بحث</span><input class="m-field__input" id="f3" type="search"></label>
  <label class="m-field" data-micro-field><span class="m-field__label">ملاحظة</span><input class="m-field__input" id="f4" type="text" enterkeyhint="done"></label>
</form>
<div class="m-picker" data-micro-picker id="picker"><input class="m-picker__input" data-picker-search aria-label="بحث"><div class="m-picker__list" data-picker-list role="listbox" aria-label="الخيارات"></div><p data-picker-summary></p></div>
<button class="m-btn m-btn--primary m-btn--loading-replace" id="replace">حفظ العملية</button>
<button class="m-btn m-btn--primary" id="default">حفظ العملية</button>
<div class="m-access-gateway"><button class="m-access-gateway__link" type="button" data-access-recovery>نسيت كلمة المرور؟</button></div>
<div class="m-chart" data-chart="bars" data-value-domain="signed" id="signed"><h2 class="m-chart__title">قيم موقعة</h2><ul class="m-chart__data" hidden><li data-series="a" data-label="سالب" data-value="-60"></li><li data-series="a" data-label="صفر" data-value="0"></li><li data-series="a" data-label="مفقود"></li><li data-series="a" data-label="مشوه" data-value="12oops"></li></ul><div data-plot></div><p data-chart-summary></p></div>
<div class="m-main-metric m-main-metric--flat" data-main-comparison data-common-unit="طلب" data-common-period="اليوم" id="metric"><h2 class="m-main-metric__title">مقارنة</h2><div class="m-main-metric__hero"><span class="m-main-metric__label">قيمة رئيسية</span><span class="m-main-metric__number">18</span><span class="m-main-metric__unit">طلب</span></div><ul data-bar-source hidden><li data-series="a" data-label="سالب" data-value="-9" data-unit="طلب" data-period="اليوم"></li><li data-series="a" data-label="صفر" data-value="0" data-unit="طلب" data-period="اليوم"></li><li data-series="a" data-label="مشوه" data-value="12oops" data-unit="طلب" data-period="اليوم"></li></ul><ul class="m-main-metric__rows" data-bar-items></ul><p data-bar-status></p></div>
<div class="m-metric-circles" data-metric-circles data-layout="separated" id="circles"><h2 class="m-metric-circles__title">دوائر</h2><ul data-metric-source hidden><li data-series="a" data-label="سالب" data-value="-5" data-unit="طلب"></li><li data-series="a" data-label="موجب" data-value="10" data-unit="طلب"></li><li data-series="b" data-label="فاسد" data-value="oops" data-unit="طلب"></li></ul><ol data-metric-items></ol><ul data-metric-fallback></ul><p data-metric-empty hidden></p><p data-metric-scale></p></div>
<div class="m-chart m-chart--packed" data-chart="bubbles" data-chart-packed id="packed"><h2 class="m-chart__title">مساحات اختيارية</h2><ul class="m-chart__data" hidden><li data-series="a" data-label="سالب" data-value="-5"></li><li data-series="a" data-label="موجب" data-value="10"></li></ul><div data-plot></div><p data-chart-summary></p></div>
<div class="m-chart" data-chart="line" data-value-domain="signed" data-axis-type="time" id="time"><h2 class="m-chart__title">زمن معلن</h2><ul class="m-chart__data" hidden><li data-series="a" data-label="قراءة صباحية" data-x="2026-01-02" data-value="-20"></li><li data-series="a" data-label="قراءة مسائية" data-x="2026-02-13" data-value="40"></li></ul><div data-plot></div><p data-chart-summary></p></div>
<div data-filter-panel id="filters"><h2>تصفية النتائج</h2><label class="m-choice"><input type="checkbox" data-filter-key="status"><span>الحالة النشطة</span></label><p data-filter-summary></p><button type="button" class="m-btn" data-filter-apply>تطبيق</button></div>
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
        if not ok:
            print('      detail:', detail, flush=True)

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
            # T4 (N-D9/N-D7): سحب الورقة للأسفل — فوق العتبة يغلق بنبضة اهتزاز، وتحتها يرتد
            ctx2 = browser.new_context(viewport={'width': 360, 'height': 780}, is_mobile=True,
                                       has_touch=True, color_scheme='light')
            page2 = ctx2.new_page()
            page2.on('pageerror', lambda e: errors.append(str(e)))
            page2.goto(f'http://127.0.0.1:{server.server_port}/consumption-contract.html')
            page2.wait_for_timeout(150)
            page2.evaluate("""() => {
              /* stub على النموذج الأولي قبل أي استدعاء — تعيين خاصية خاصة على
                 navigator بعد التحميل يستدعي فحص المتصفح الداخلي فيظهر استدعاء
                 وهمي بلا وسيط في القياسات */
              window.__vibes = [];
              Object.defineProperty(Navigator.prototype, 'vibrate', {
                value: (ms) => { window.__vibes.push(ms); return true; },
                writable: true, configurable: true });
              MicroBack.bindBackToLayers();
            }""")
            # معطل افتراضيًا في صفحة نظيفة: افتح واسحب قبل التفعيل — لا اهتزاز
            page2.locator('#opener').click()
            page2.wait_for_timeout(150)
            handle = page2.locator('#layer .m-layer__drag-handle')
            box = handle.bounding_box()
            page2.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
            page2.mouse.down()
            page2.mouse.move(box['x'] + box['width'] / 2, box['y'] + 300, steps=8)
            page2.mouse.up()
            page2.wait_for_timeout(400)
            drag_closed = page2.evaluate("!document.getElementById('layer').hidden === false")
            vibes_before_enable = page2.evaluate("window.__vibes.length")
            check('sheet drag beyond threshold closes it via the same close path',
                  drag_closed, {'closed': drag_closed})
            check('haptics disabled by default — drag close does not vibrate', vibes_before_enable == 0)
            # مفعلًا: اسحب الثانية (داخل الأولى) فوق العتبة → إغلاق + نبضة 10ms
            page2.evaluate("MicroHaptics.setHaptics(true)")
            page2.locator('#opener').click()
            page2.wait_for_timeout(150)
            page2.locator('#opener2').click()
            page2.wait_for_timeout(200)
            handle2 = page2.locator('#layer2 .m-layer__drag-handle')
            box2 = handle2.bounding_box()
            page2.mouse.move(box2['x'] + box2['width'] / 2, box2['y'] + box2['height'] / 2)
            page2.mouse.down()
            page2.mouse.move(box2['x'] + box2['width'] / 2, box2['y'] + 260, steps=8)
            page2.mouse.up()
            page2.wait_for_timeout(450)
            drag2 = page2.evaluate("""() => ({
              closed: document.getElementById('layer2').hidden,
              vibes: window.__vibes.slice(),
              focusBackInParent: document.getElementById('layer').contains(document.activeElement) })""")
            check('enabled haptics: drag close vibrates 10ms and refocuses into parent',
                  drag2['closed'] and drag2['vibes'] == [10] and drag2['focusBackInParent'], drag2)
            # تحت العتبة: يرتد وتبقى مفتوحة
            page2.locator('#opener2').click()
            page2.wait_for_timeout(200)
            handle2b = page2.locator('#layer2 .m-layer__drag-handle')
            box2b = handle2b.bounding_box()
            page2.mouse.move(box2b['x'] + box2b['width'] / 2, box2b['y'] + box2b['height'] / 2)
            page2.mouse.down()
            page2.mouse.move(box2b['x'] + box2b['width'] / 2, box2b['y'] + 36, steps=4)
            page2.mouse.up()
            page2.wait_for_timeout(350)
            bounced = page2.evaluate("""() => ({
              open: !document.getElementById('layer2').hidden,
              transformCleared: !document.getElementById('layer2').style.transform })""")
            check('sheet drag below threshold bounces back and stays open',
                  bounced['open'] and bounced['transformCleared'], bounced)
            ctx2.close()
            check('metric table retains zero and Arabic state', '0 (صفر)' in page.locator('#metric table').inner_text())
            # مسارات كانت مكسورة بكشوفها ESLint no-undef (قرار المالك بعد مراجعة c573118)
            circles_text = page.locator('#circles').inner_text()
            check('circles invalid value without display/raw renders invalid text, no throw',
                  'قيمة غير صالحة' in circles_text, circles_text[:80])
            page.evaluate("const cb=document.querySelector('#filters input[data-filter-key]');cb.checked=true;cb.dispatchEvent(new Event('change',{bubbles:true}))")
            summary = page.locator('#filters [data-filter-summary]').inner_text()
            check('filter panel change updates summary (no-undef target path)',
                  'الجاري' in summary, summary)
            # T4 (N-D10): enterkeyhint افتراضي في fields + Enter ينقل للحقل التالي
            hints = page.evaluate("""() => ({
              f1: document.getElementById('f1').getAttribute('enterkeyhint'),
              f2: document.getElementById('f2').getAttribute('enterkeyhint'),
              f3: document.getElementById('f3').getAttribute('enterkeyhint'),
              f4: document.getElementById('f4').getAttribute('enterkeyhint') })""")
            check('enterkeyhint defaults: next/search computed, consumer value preserved',
                  hints['f1'] == 'next' and hints['f2'] == 'next' and hints['f3'] == 'search' and hints['f4'] == 'done', hints)
            page.evaluate("document.getElementById('f1').focus()")
            page.keyboard.press('Enter')
            moved = page.evaluate("document.activeElement === document.getElementById('f2')")
            check('Enter on a next field moves focus to the following field', moved)
            # T4 (N-D8): زر الرجوع يغلق الطبقة العليا ويعيد التركيز
            page.evaluate("window.__back = MicroBack.bindBackToLayers()")
            page.evaluate("history.replaceState({mark: 'ref'}, '')")
            page.locator('#opener').click()
            page.wait_for_timeout(120)
            page.locator('#opener2').click()
            page.wait_for_timeout(120)
            nested = page.evaluate("window.__back.openCount()")
            page.evaluate("history.back()")
            page.wait_for_timeout(300)
            after_first_back = page.evaluate("""() => ({
              count: window.__back.openCount(),
              layer1: !document.getElementById('layer').hidden,
              layer2: !document.getElementById('layer2').hidden,
              focusInLayer1: document.getElementById('layer').contains(document.activeElement) })""")
            check('back closes the top layer only (nested order) and refocus stays inside parent',
                  nested == 2 and after_first_back['count'] == 1 and after_first_back['layer1'] and not after_first_back['layer2'] and after_first_back['focusInLayer1'],
                  {'nested': nested, 'after': after_first_back})
            page.evaluate("history.back()")
            page.wait_for_timeout(300)
            after_second = page.evaluate("""() => ({
              count: window.__back.openCount(),
              focus: document.activeElement === document.getElementById('opener') })""")
            check('back again closes the parent and refocuses its opener',
                  after_second['count'] == 0 and after_second['focus'], after_second)
            # الإغلاق بالزر لا يترك حالة سجل زائدة
            page.locator('#opener').click()
            page.wait_for_timeout(120)
            opened_state = page.evaluate("!!(history.state && history.state.__microBack)")
            page.locator('#layer [data-layer-close]').click()
            page.wait_for_timeout(300)
            consumed = page.evaluate("history.state && history.state.mark === 'ref'")
            check('closing by button consumes the pushed history state (no leftovers)',
                  opened_state and consumed, {'opened': opened_state, 'consumed': consumed})
            # destroy() يزيل كل شيء
            page.evaluate("window.__back.destroy()")
            page.locator('#opener').click()
            page.wait_for_timeout(150)
            no_write = page.evaluate("history.state && history.state.mark === 'ref' && window.__back.openCount() === 0")
            page.locator('#layer [data-layer-close]').click()
            page.wait_for_timeout(200)
            check('destroy() removes the binding — opening writes no history', no_write)
            # T4 (N-D7): haptics معطل افتراضيًا ولا يهتز مع تقليل الحركة (هذه الصفحة reduce)
            reduced = page.evaluate("""() => {
              window.__vibes = [];
              Object.defineProperty(Navigator.prototype, 'vibrate', {
                value: (ms) => { window.__vibes.push(ms); return true; },
                writable: true, configurable: true });
              const enabledResult = MicroHaptics.setHaptics(true);
              const pulseResult = MicroHaptics.pulse('confirm');
              return { enabledResult, pulseResult, vibes: window.__vibes.length };
            }""")
            check('haptics: pulse is suppressed under prefers-reduced-motion', reduced['pulseResult'] is False and reduced['vibes'] == 0, reduced)
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
