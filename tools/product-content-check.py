#!/usr/bin/env python3
"""Phase 1 user-facing defaults and truthful outcomes; Light phone RTL only."""
import argparse
import hashlib
import http.server
import json
import subprocess
import tempfile
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_):
        pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path)
    out = parser.parse_args().out or Path(tempfile.mkdtemp(prefix='product-content-'))
    out.mkdir(parents=True, exist_ok=True)
    checks, errors = [], []
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()

    def check(name, result):
        checks.append(dict(name=name, passed=bool(result)))
        print(('PASS ' if result else 'FAIL ') + name, flush=True)

    with sync_playwright() as pw:
        browser = pw.chromium.launch(**chromium_launch_options())
        page = browser.new_page(viewport={'width': 360, 'height': 780}, is_mobile=True,
                                has_touch=True, locale='ar', color_scheme='light', reduced_motion='reduce')
        page.set_default_timeout(6000)
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('response', lambda response: errors.append(str(response.status) + ' ' + response.url)
                if response.status >= 400 else None)
        root = page.locator('#product-root')

        def go(kind, case=None):
            page.goto(f'http://127.0.0.1:{server.server_port}/previews/product-context/lab.html?component={kind}')
            if case:
                page.locator('#scenario').select_option(case)

        def model(code):
            page.evaluate('()=>{let m=lab.model;' + code + ';lab.replace(m)}')

        def action(name):
            root.locator(f'[data-product-action="{name}"]').click()

        def cancel():
            page.keyboard.press('Escape')
            page.wait_for_function('!document.querySelector(".m-action-sheet")')

        go('delivery', 'proof')
        model('delete m.requirementsLabel')
        check('Absent proof requirements do not render developer instructions',
              not any(t in root.inner_text() for t in ['يحددها المنتج', 'لا نفترض', 'المكتبة']))
        page.evaluate('document.fonts.ready')
        root.screenshot(path=str(out / 'delivery-proof360.png'))
        model('m.requirementsLabel="أرفق صورة واضحة للطرد";m.attachmentRequired=true')
        check('Configured proof instructions remain visible', 'أرفق صورة واضحة للطرد' in root.inner_text())
        action('submit-proof')
        check('Required proof still blocks submission without attachment',
              'أرفق الإثبات المطلوب' in root.inner_text() and page.evaluate('lab.lastIntent===null'))
        model('m.attachmentRequired=false;m.requirementsLabel=""')
        action('submit-proof')
        check('Proof confirmation preserves review and non-completion consequence',
              page.locator('.m-action-sheet').count() == 1 and
              'لا يعني ذلك اكتمال التسليم أو الإرجاع' in page.locator('.m-action-sheet').inner_text())
        cancel()
        check('Cancelling proof does not emit a submission', page.evaluate('lab.lastIntent===null'))

        go('assistant', 'chat')
        model('m.replyPending=true')
        check('Reply waiting has one concise status',
              root.inner_text().count('جارٍ إعداد الرد') == 1 and 'لم يصل رد مؤكد' not in root.inner_text())
        page.evaluate('document.fonts.ready')
        root.screenshot(path=str(out / 'assistant-pending360.png'))

        go('market', 'editor')
        check('Draft action describes user intent', root.get_by_role('button', name='حفظ المسودة', exact=True).count() == 1)
        action('save-draft')
        check('Save request remains pending until acknowledged', page.evaluate(
            'lab.lastIntent.action==="save-draft"&&lab.instance.getState().pending!==null') and
            'تمت العملية' not in root.inner_text() and 'بانتظار نتيجة مؤكدة' in root.inner_text())
        page.evaluate('()=>{let m=lab.model;m.phase="success";lab.resolve(lab.lastIntent.request,m)}')
        check('Acknowledged success renders the outcome', 'تمت العملية' in root.inner_text())
        model('m.phase="uncertain"')
        check('Uncertain outcome retains warning and blocks repeat mutation',
              'تحقق قبل إعادة الإرسال' in root.inner_text() and
              root.locator('[data-product-action=publish]').is_disabled())
        model('m.phase="ready";m.phaseDetail=""')
        action('publish')
        confirmation = page.locator('.m-action-sheet').inner_text()
        check('Publish confirmation keeps title, price and unit', all(
            value in confirmation for value in page.evaluate('[lab.model.title,String(lab.model.price),lab.model.unit]')))
        check('Publish confirmation excludes implementation commentary', 'Manage' not in confirmation)
        cancel()

        go('delivery', 'offer')
        action('accept')
        check('Offer confirmation keeps quoted amount and unit', all(value in page.locator('.m-action-sheet').inner_text()
              for value in page.evaluate('[String(lab.model.amount),lab.model.unit]')))
        cancel()
        model('m.dataContext={...m.scope,contextId:"different"}')
        check('Mismatched data stays hidden with understandable restriction',
              'لا يمكنك عرض هذه البيانات' in root.inner_text() and root.locator('h2').count() == 0)
        check('No horizontal overflow at 360 RTL', page.evaluate('document.documentElement.scrollWidth===innerWidth'))
        check('No browser errors or failed resources', not errors)
        browser.close()
    server.shutdown()
    paths = sorted((ROOT / 'components/product-context').glob('*.js'))
    report = dict(commitAtRun=subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
                  workingTree=True, physicalDevice=False, scope='Light 360x780 RTL; no Dark',
                  checks=checks, errors=errors, passed=sum(x['passed'] for x in checks),
                  failed=sum(not x['passed'] for x in checks),
                  sourceSha256={str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in paths})
    (out / 'results.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print(f"Content: {report['passed']} PASS / {report['failed']} FAIL")
    return bool(report['failed'])


if __name__ == '__main__':
    raise SystemExit(main())
