#!/usr/bin/env python3
# SUI-A1 / V — قياس أخير: تفاصيل F03 (readlist/قسم قابل للطي/رأس ميت) + عمق الطبقة (S04)
import json

from playwright.sync_api import sync_playwright

F03 = 'http://127.0.0.1:5000/previews/ux-patterns/mobile-record-sample/index.html'
EVID = '/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent1'

def main():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/home/z/my-project/evidence/bin/chromium', args=['--hide-scrollbars'])
        ctx = browser.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='no-preference')
        page = ctx.new_page()
        errs = []
        page.on('pageerror', lambda e: errs.append(str(e)))
        page.goto(F03, wait_until='networkidle')
        page.click('#f03-gw-demo'); page.wait_for_selector('#view-home:not([hidden])'); page.wait_for_timeout(400)
        page.click('#f03-nav-list'); page.wait_for_selector('#view-list:not([hidden])'); page.wait_for_timeout(300)
        # افتح أول صف → التفاصيل
        page.click('#f03-list-rows li:first-child .f03-row')
        page.wait_for_selector('#view-detail:not([hidden])'); page.wait_for_timeout(400)
        results['detail_390'] = page.evaluate("""() => {
          const cs = (el, p) => el ? getComputedStyle(el)[p] : null;
          const rows = [...document.querySelectorAll('#view-detail .f03-readlist__row')];
          const activityHead = document.querySelector('#f03-detail-activity .m-section__head');
          const activitySpan = document.querySelector('#f03-detail-activity .m-section__title');
          // هل توجد قاعدة CSS لـ .m-section__title في أي ورقة؟
          let ruleForSpan = false;
          for (const sh of document.styleSheets) { try { for (const r of sh.cssRules) {
            if (r.selectorText && /\\.m-section__title(\\s|$|,|:)/.test(r.selectorText)) ruleForSpan = true; } } catch(e){} }
          return {
            appbarTitle: cs(document.querySelector('#view-detail .f03-appbar__title'), 'fontSize'),
            readRows: rows.slice(0,3).map(r => {
              const dt = r.querySelector('dt'), dd = r.querySelector('dd');
              return { h: r.getBoundingClientRect().height,
                       dt: cs(dt,'fontSize') + '/' + cs(dt,'color'), dd: cs(dd,'fontSize') + '/' + cs(dd,'fontWeight') };
            }),
            activityHeadSize: cs(activityHead, 'fontSize') + '/' + cs(activityHead, 'fontWeight'),
            activitySpanSize: activitySpan ? cs(activitySpan, 'fontSize') + '/' + cs(activitySpan, 'fontWeight') : null,
            cssRuleFor_m_section__title: ruleForSpan,
            identity: (() => { const i = document.querySelector('#f03-detail-identity');
              return i ? { h: i.getBoundingClientRect().height, hasImage: !!i.querySelector('img, .m-identity__initials') } : null; })(),
          };
        }""")
        # رجوع ثم فتح لوحة التصفية (طبقة B07) لقياس العمق
        page.click('#f03-detail-back'); page.wait_for_timeout(300)
        page.click('#f03-filter-btn'); page.wait_for_selector('#f03-filter-layer:not([hidden])'); page.wait_for_timeout(500)
        results['filter_layer_390'] = page.evaluate("""() => {
          const layer = document.getElementById('f03-filter-layer');
          const backdrop = document.querySelector('.m-layer-backdrop[data-for="f03-filter-layer"]');
          const lr = layer.getBoundingClientRect();
          const br = backdrop.getBoundingClientRect();
          const cs = getComputedStyle(layer), bcs = getComputedStyle(backdrop);
          return {
            layer: { rect: lr.toJSON(), borderRadius: cs.borderRadius, backgroundColor: cs.backgroundColor,
                      boxShadow: cs.boxShadow.slice(0, 60), maxHeight: cs.maxHeight, zIndex: cs.zIndex },
            backdrop: { rect: br.toJSON(), backgroundColor: bcs.backgroundColor, backdropFilter: bcs.backdropFilter, zIndex: bcs.zIndex },
            viewport: { w: window.innerWidth, h: window.innerHeight },
          };
        }""")
        page.screenshot(path=f'{EVID}/f03-filter-layer-390.png')
        results['pageerrors'] = errs
        browser.close()
    with open(f'{EVID}/f03-probe3.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(json.dumps(results, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main()
