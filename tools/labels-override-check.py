#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""بوابة labels-override (الجولة الثانية R5.6): لكل مدخل له نصوص —
init(root, {labels}) بمفتاحين بديلين يغيّر النص الظاهر فعلًا، ونسخة ثانية بلا
labels تبقى بالافتراضي (عزل النسخ)، وsetLabels يغيّر الافتراضي العام،
وفحص تفاعلي واحد (picker/access-gateway/account-settings) لقراءات الأحداث.
الترميز من قوالب api-lifecycle نفسها (تُستخرج من ملفه) والاستيراد من
dist/esm (اختبار العقد الحقيقي للمستهلك)."""
import argparse
import http.server
import json
import re
import tempfile
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parents[1]

# استخرج CSS والقوالب من بوابة العقد نفسها (مصدر واحد للترميز الأدنى)
_src = (ROOT / 'tools' / 'api-lifecycle-check.py').read_text(encoding='utf-8')
CSS = re.search(r'CSS = \((.*?)\n\)', _src, re.S).group(1)
CSS = re.sub(r'\s+', ' ', CSS.replace('"', '').replace('\n', ''))
CSS = [p.strip() for p in CSS.split(',') if p.strip()]
TEMPLATES = re.search(r'TEMPLATES = """(.*?)"""', _src, re.S).group(1)
SCRIPTS = [f'<script src="/{p}"></script>' for p in CSS if p.endswith('.js')]
STYLES = [f'<link rel="stylesheet" href="/{p}">' for p in CSS if p.endswith('.css')]

# الأسر التي لا نصوص لها أو لا تُقرأ عند الربط تُستثنى بتوثيق
FAMILY_KEYS = {
    'access-gateway': {'tpl': 'access-gateway', 'entry': 'access-gateway',
                       'keys': ['validation.emailAndPasswordRequired'], 'interaction_only': True,
                       'interaction': ("c => { c.querySelector('form').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true})); }",
                                       'validation.emailAndPasswordRequired')},
    'account-settings': {'tpl': 'account-settings', 'entry': 'account-settings',
                         'mutator': "c => { const i = c.querySelector('input'); i.setAttribute('data-demo-only', ''); const p = document.createElement('p'); p.setAttribute('data-account-demo-status', ''); i.closest('[data-account-view]').appendChild(p); }",
                         'keys': ['demo.changeNotice'], 'interaction_only': True,
                         'interaction': ("c => { const i = c.querySelector('input'); i.checked = true; i.dispatchEvent(new Event('change', {bubbles:true})); }",
                                         'demo.changeNotice')},
    'carousel': {'tpl': 'carousel', 'entry': 'carousel', 'keys': ['slide.cardRole', 'status.positionPrefix']},
    'data': {'tpl': 'data', 'entry': 'data', 'keys': ['table.showButton', 'context.unit']},
    'info-strip': {'tpl': 'info-strip', 'entry': 'info-strip',
                   'mutator': "c => { const s = document.createElement('p'); s.setAttribute('data-info-strip-status', ''); const pg = document.createElement('div'); pg.setAttribute('data-info-strip-pages', ''); c.appendChild(pg); c.appendChild(s); }",
                   'keys': ['pages.ariaLabel', 'status.initialPrefix']},
    'messages': {'tpl': 'messages', 'entry': 'messages',
                 'mutator': "c => { c.firstElementChild.className = 'm-note'; }",
                 'keys': ['note.missingVariantWarning'], 'console_probe': True},
    'navigation': {'tpl': 'navigation', 'entry': 'navigation',
                   'mutator': "c => { const l = c.querySelector('.m-layer'); l.removeAttribute('aria-label'); l.setAttribute('role', 'bananas'); }",
                   'keys': ['layer.unusualRolePrefix', 'layer.unusualRoleSuffix'], 'console_probe': True,
                   'pre_interaction': "c => { c.querySelector('[data-layer-open]').click(); }"},
    'order-schedule': {'tpl': 'order-schedule', 'entry': 'order-schedule', 'keys': ['schedule.view.day', 'schedule.nav.today']},
    'organization': {'tpl': 'organization', 'entry': 'organization',
                     'mutator': "c => { const w = document.createElement('div'); w.className = 'm-identity'; w.innerHTML = '<img data-avatar-fallback alt=\"\" src=\"data:image/png;base64,INVALID\">'; c.appendChild(w); }",
                     'keys': ['avatar.initialsFallback']},
    'selection': {'tpl': 'picker', 'entry': 'picker', 'keys': ['picker.selectedNone', 'picker.selectedPrefix'],
               'interaction': ("c => { c.querySelectorAll('.m-picker__option')[1].click(); }", 'picker.selectedPrefix')},
    'product-context': {'tpl': None, 'entry': 'product', 'keys': ['operation.title', 'operation.referencePrefix'],
                        'init_arg': 'PRODUCT_MODEL'},
    'metric-comparison': {'tpl': 'metric-comparison', 'entry': 'metric-comparison', 'keys': ['table.showButton', 'table.unitPrefix']},
}


def defaults_of(family):
    src = (ROOT / 'components' / family / 'labels.js').read_text(encoding='utf-8')
    return dict(re.findall(r"'([a-zA-Z][a-zA-Z0-9.]*)':\s*(\"(?:[^\"\\]|\\.)*\")", src))


def build_page():
    configs = {}
    for family, cfg in FAMILY_KEYS.items():
        defs = defaults_of(family)
        configs[family] = {
            'tpl': cfg['tpl'], 'entry': cfg['entry'], 'mutator': cfg.get('mutator'),
            'keys': cfg['keys'],
            'defaults': {k: json.loads(defs[k]) for k in cfg['keys']},
            'interaction': cfg.get('interaction'), 'consoleProbe': cfg.get('console_probe', False),
            'interactionOnly': cfg.get('interaction_only', False),
            'preInteraction': cfg.get('pre_interaction'),
        }
    model = ("{type:'state',scope:{contextId:'lo',workspaceId:'lw',roleId:'owner',kind:'business',label:'ورشة'},"
             "dataContext:{contextId:'lo',workspaceId:'lw',roleId:'owner',kind:'business'},phase:'ready',"
             "connection:'online',destination:'delivery',permissions:['view','recheck','retry'],revision:'r1',"
             "reference:'rq-1'}")
    return f"""<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">
<link rel="stylesheet" href="/dist/css/styles.css">
{''.join(STYLES)}
</head><body>
{TEMPLATES}
<script type="module">
window.__gateResults = [];
window.__gateConsole = [];
window.__uidSeq = 0;
const __ow = console.warn; console.warn = (...a) => {{ window.__gateConsole.push(a.join(' ')); __ow(...a); }};
const CONFIGS = {json.dumps(configs, ensure_ascii=False)};
const PRODUCT_MODEL = {model};
const clone = id => document.getElementById('tpl-' + id).content.firstElementChild.cloneNode(true);
function appears(root, text) {{
  if (!text) return false;
  if (root.textContent && root.textContent.includes(text)) return true;
  return [...root.querySelectorAll('*')].some(el => [...el.attributes].some(a => (a.value || '').includes(text)));
}}
(async () => {{
  const record = (name, passed, detail) => window.__gateResults.push({{name, passed: !!passed, detail: detail ?? null}});
  for (const [family, cfg] of Object.entries(CONFIGS)) {{
    const api = await import('/dist/esm/' + cfg.entry + '.js');
    const mk = () => {{
      const holder = document.createElement('div');
      const root = cfg.tpl ? clone(cfg.tpl) : document.createElement('section');
      holder.appendChild(root); document.body.appendChild(holder);
      /* فريدية المعرفات لكل نسخة (عقد المستهلك: IDs فريدة) — وإلا فتح زر B
         طبقة A عبر getElementById فيختبر المثيل الخطأ */
      root.querySelectorAll('[id]').forEach(el => {{
        const oldId = el.id, fresh = oldId + '-' + (++window.__uidSeq);
        for (const target of [root, ...root.querySelectorAll('*')]) {{
          for (const a of target.attributes) if (a.value === oldId) a.value = fresh;
        }}
        el.id = fresh;
      }});
      if (cfg.mutator) eval('(' + cfg.mutator + ')')(root);
      return root;
    }};
    const labels = {{}};
    cfg.keys.forEach((k, i) => labels[k] = 'بديل' + (i + 1) + 'ـ' + family);
    const a = mk(), b = mk();
    const initArg = cfg.entry === 'product' ? {{...PRODUCT_MODEL, labels}} : {{labels}};
    const instA = api.init(a, initArg);
    const instB = api.init(b, cfg.entry === 'product' ? PRODUCT_MODEL : undefined);
    if (cfg.preInteraction) eval('(' + cfg.preInteraction + ')')(a), eval('(' + cfg.preInteraction + ')')(b);
    await new Promise(r => setTimeout(r, 120));
    if (cfg.interactionOnly && cfg.interaction) {{
      eval('(' + cfg.interaction[0] + ')')(a);
      eval('(' + cfg.interaction[0] + ')')(b);
      await new Promise(r => setTimeout(r, 80));
    }}
    if (cfg.consoleProbe) {{
      record(family + ': الطبقة تغيّر نص الكونسول', window.__gateConsole.some(m => m.includes(labels[cfg.keys[0]])),
             window.__gateConsole.slice(-3));
      record(family + ': عزل النسخ — الكونسول بالافتراضي',
        window.__gateConsole.some(m => m.includes(cfg.defaults[cfg.keys[0]])), null);
    }} else {{
      const aOk = cfg.interactionOnly || appears(a, labels[cfg.keys[0]]);
      const bOk = cfg.keys.some(k => appears(b, cfg.defaults[k])) && !cfg.keys.some(k => appears(b, labels[k]));
      record(family + ': init بlabels يغيّر النص الظاهر فعلًا', aOk, cfg.keys.map(k => [labels[k], appears(a, labels[k])]));
      record(family + ': عزل النسخ — الثانية بالافتراضي', bOk, cfg.keys.map(k => [cfg.defaults[k], appears(b, cfg.defaults[k])]));
    }}
    if (cfg.interaction && !cfg.interactionOnly && !cfg.consoleProbe) {{
      eval('(' + cfg.interaction[0] + ')')(a);
      await new Promise(r => setTimeout(r, 60));
      record(family + ': قراءة الحدث تحل طبقة المثيل', appears(a, labels[cfg.interaction[1]]), cfg.interaction[1]);
    }}
    api.setLabels({{[cfg.keys[0]]: 'قيمة عامة جديدة'}});
    const c = mk();
    api.init(c, cfg.entry === 'product' ? {{...PRODUCT_MODEL}} : undefined);
    if (cfg.preInteraction) eval('(' + cfg.preInteraction + ')')(c);
    if (cfg.interactionOnly && cfg.interaction) eval('(' + cfg.interaction[0] + ')')(c);
    await new Promise(r => setTimeout(r, 120));
    const setC = cfg.consoleProbe
      ? window.__gateConsole.some(m => m.includes('قيمة عامة جديدة'))
      : appears(c, 'قيمة عامة جديدة');
    record(family + ': setLabels يغيّر الافتراضي العام', setC, null);
    [a, b, c].forEach(r => r.closest('div') ? r.closest('div').remove() : r.remove());
  }}
}})();
</script></body></html>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        if self.path == '/labels-override.html':
            body = build_page().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(body)
        else:
            super().do_GET()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--out', type=Path, default=Path(tempfile.mkdtemp(prefix='micro-labels-override-')))
    args = ap.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    errors = []
    results = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(**chromium_launch_options())
        page = browser.new_page(viewport={'width': 360, 'height': 780})
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: errors.append('console: ' + m.text) if m.type == 'error' else None)
        page.goto(f'http://127.0.0.1:{server.server_port}/labels-override.html')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1800)
        results = page.evaluate('window.__gateResults')
        page_console = page.evaluate('window.__gateConsole')
        browser.close()
    server.shutdown()
    passed = sum(1 for r in results if r['passed'])
    for r in results:
        print(('PASS ' if r['passed'] else 'FAIL ') + r['name'], '' if r['passed'] else json.dumps(r['detail'], ensure_ascii=False)[:120])
    if errors:
        print('page/console errors:', errors[:5])
        passed -= len(errors)
    (args.out / 'verification.json').write_text(
        json.dumps({'passed': passed, 'failed': len(results) - passed, 'checks': results, 'errors': errors},
                   ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'{passed} PASS / {len(results) - passed} FAIL')
    return 0 if passed == len(results) and not errors else 1


if __name__ == '__main__':
    raise SystemExit(main())
