#!/usr/bin/env python3
# SUI-A1 / V — قياس لوحتي التنظيم (B04) والأسطح (S01) ومعرض previews/index.html
# قراءة فقط عبر Playwright + Chromium على خادم المعاينة المحلي.
import json

from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:5000'
CHROMIUM = '/home/z/my-project/evidence/bin/chromium'
EVID = '/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent1'

def main():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM, args=['--hide-scrollbars'])
        ctx = browser.new_context(viewport={'width': 390, 'height': 900}, reduced_motion='no-preference')
        page = ctx.new_page()
        errs = []
        page.on('pageerror', lambda e: errs.append(str(e)))

        # ===== 1) لوحة التنظيم B04 — الهاتف الصعب (المقارنة 5) =====
        page.goto(BASE + '/previews/organization/index.html', wait_until='networkidle')
        page.wait_for_timeout(500)
        results['org_board'] = page.evaluate("""() => {
          const cs = (el, p) => el ? getComputedStyle(el)[p] : null;
          const zt = document.querySelector('#text-zoom-target');
          const rows40 = [...zt.querySelectorAll('.m-btn')].map(b => ({
            text: b.textContent.trim(), rect: b.getBoundingClientRect().toJSON(),
            minHeight: cs(b, 'minHeight'), inlineStyle: b.getAttribute('style'),
          }));
          const row = document.querySelector('#rows .m-row');
          const head = document.querySelector('#sec1-head');
          const tile = document.querySelector('#rows .m-row__tile');
          return {
            zoomTargetWidth: zt.getBoundingClientRect().width,
            smallButtons: rows40,
            readRow: row ? { h: row.getBoundingClientRect().height, minH: cs(row, 'minHeight'), pad: cs(row, 'padding') } : null,
            tile: tile ? { w: tile.getBoundingClientRect().width, h: tile.getBoundingClientRect().height, radius: cs(tile, 'borderRadius'), bg: cs(tile, 'backgroundColor'), color: cs(tile, 'color') } : null,
            sectionHead: head ? { h: head.getBoundingClientRect().height, minH: cs(head, 'minHeight'), fontSize: cs(head, 'fontSize'), weight: cs(head, 'fontWeight') } : null,
            sectionTitle: (() => { const t = document.querySelector('.m-section-title'); return t ? { fontSize: cs(t, 'fontSize'), weight: cs(t, 'fontWeight') } : null; })(),
            headSpanTitle: (() => { const s = document.querySelector('.m-section__head .m-section__title'); return s ? { fontSize: cs(s, 'fontSize'), defined: !!document.querySelector('style') , matchedRuleCount: (() => { for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) { if (r.selectorText && r.selectorText.includes('.m-section__title')) return true; } } catch(e){} } return false; })() } : null; })(),
            counter: (() => { const c = document.querySelector('.m-counter'); return c ? { h: c.getBoundingClientRect().height, minW: cs(c, 'minWidth'), fontSize: cs(c, 'fontSize'), bg: cs(c, 'backgroundColor'), color: cs(c, 'color') } : null; })(),
            badge: (() => { const b = document.querySelector('.m-badge--warning'); return b ? { fontSize: cs(b, 'fontSize'), bg: cs(b, 'backgroundColor'), color: cs(b, 'color') } : null; })(),
            value: (() => { const v = document.querySelector('#rows .m-row__value'); return v ? { fontSize: cs(v, 'fontSize'), color: cs(v, 'color'), fontVariant: cs(v, 'fontVariantNumeric') } : null; })(),
          };
        }""")
        page.evaluate("() => document.querySelector('#text-zoom-target').scrollIntoView({block:'center'})")
        page.wait_for_timeout(200)
        clip = page.evaluate("""() => { const r = document.querySelector('#text-zoom-target').getBoundingClientRect();
            return {x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: Math.min(390, r.width + 16), height: r.height + 16}; }""")
        page.screenshot(path=f'{EVID}/org-board-phone-390.png', clip=clip)

        # كيبورد حقيقي على رأس القسم القابل للطي (Enter) — حالة قابلة للطي مضمومة (sec2)
        page.focus('#sec2-head')
        page.keyboard.press('Enter')
        page.wait_for_timeout(200)
        results['org_keyboard'] = page.evaluate("""() => ({
          sec2Expanded: document.querySelector('#sec2-head').getAttribute('aria-expanded'),
          sec2BodyHidden: document.querySelector('#sec2-body').hidden,
          focusStillOnHead: document.activeElement === document.querySelector('#sec2-head'),
        })""")
        page.keyboard.press('Space')
        page.wait_for_timeout(200)
        results['org_keyboard']['afterSpace_expanded'] = page.evaluate("() => document.querySelector('#sec2-head').getAttribute('aria-expanded')")
        results['org_keyboard']['afterSpace_bodyHidden'] = page.evaluate("() => document.querySelector('#sec2-body').hidden")

        # ===== 2) لوحة الأسطح: نتائج الفحص الذاتي للمثال المستقل =====
        page.goto(BASE + '/previews/surfaces/example-usage.html', wait_until='networkidle')
        page.wait_for_timeout(600)
        results['surfaces_example_selfcheck'] = page.evaluate("""() => {
          const pre = document.getElementById('results');
          const surf = document.getElementById('ex-surface');
          return {
            selfCheckText: pre ? pre.textContent : null,
            surface: {
              rect: surf.getBoundingClientRect().toJSON(),
              padding: getComputedStyle(surf.querySelector('.m-surface__content')).padding,
              titleSize: getComputedStyle(surf.querySelector('.m-surface__title')).fontSize,
              amountSize: getComputedStyle(surf.querySelector('.m-surface__amount')).fontSize,
              labelColor: getComputedStyle(surf.querySelector('.m-surface__label')).color,
              bg: getComputedStyle(surf).backgroundImage.slice(0, 60),
              wavesDisplay: getComputedStyle(surf.querySelector('.m-surface__waves')).display,
            },
          };
        }""")

        # ===== 3) معرض المكتبة previews/index.html — تباعد أحرف عربي؟ =====
        page2 = ctx.new_page()
        page2.goto(BASE + '/previews/index.html', wait_until='networkidle')
        page2.wait_for_timeout(600)
        results['gallery_letter_spacing'] = page2.evaluate("""() => {
          const out = {};
          const eyebrow = document.querySelector('.eyebrow');
          const h1 = document.querySelector('.library-head h1');
          const kicker = document.querySelector('.section-kicker');
          const footer = document.querySelector('.library-footer span:first-child');
          [ ['eyebrow', eyebrow], ['h1', h1], ['kicker', kicker], ['footerLatin', footer] ].forEach(([k, el]) => {
            if (!el) return;
            const ls = getComputedStyle(el).letterSpacing;
            // قياس: عرض مدى نص عربي داخل العنصر مع تباعد الأحرف ثم بدونه
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            let arabicNode = null;
            while (walker.nextNode()) { if (/[\\u0600-\\u06FF]/.test(walker.currentNode.textContent)) { arabicNode = walker.currentNode; break; } }
            let widthWith = null, widthWithout = null, word = null;
            if (arabicNode) {
              word = arabicNode.textContent.trim().split(/\\s+/)[0];
              const r = document.createRange();
              const idx = arabicNode.textContent.indexOf(word);
              r.setStart(arabicNode, idx); r.setEnd(arabicNode, idx + word.length);
              widthWith = r.getBoundingClientRect().width;
              const saved = el.style.letterSpacing;
              el.style.letterSpacing = 'normal';
              widthWithout = r.getBoundingClientRect().width;
              el.style.letterSpacing = saved;
            }
            out[k] = { letterSpacing: ls, hasArabic: !!arabicNode, arabicWord: word, widthWith, widthWithout, deltaPx: widthWith !== null ? +(widthWith - widthWithout).toFixed(2) : null };
          });
          return out;
        }""")
        page2.screenshot(path=f'{EVID}/gallery-head-1440.png', clip=page2.evaluate(
            "() => { const r = document.querySelector('.library-head').getBoundingClientRect(); return {x:0, y:0, width: 1440, height: Math.min(760, r.height)}; }"))
        results['pageerrors'] = errs
        browser.close()

    with open(f'{EVID}/components-probe.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(json.dumps(results, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main()
