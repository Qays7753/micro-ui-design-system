#!/usr/bin/env python3
# SUI-A1 / V — قياس F03 (mobile-record-sample) عبر Playwright + Chromium
# الهدف: الأساس البصري (تراتب/مسافات/كثافة/عمق) عند 320/360/390/430 + 430→320
# بلا إعادة فتح + تكبير نص 200% بمرورين معلنين + reduced-motion.
# لا يعدل أي مصدر — قراءة فقط.
import json, subprocess, time, sys

from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:5000'
F03 = BASE + '/previews/ux-patterns/mobile-record-sample/index.html'
CHROMIUM = '/home/z/my-project/evidence/bin/chromium'
EVID = '/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent1'

JS_MEASURE_HOME = r"""
() => {
  const cs = (el, p) => getComputedStyle(el)[p];
  const out = {};
  const main = document.querySelector('.f03-main');
  out.main = {
    paddingInlineStart: cs(main, 'paddingInlineStart'),
    paddingInlineEnd: cs(main, 'paddingInlineEnd'),
    maxWidth: cs(main, 'maxWidth'),
    rect: main.getBoundingClientRect().toJSON(),
  };
  out.page = {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyFontSize: cs(document.body, 'fontSize'),
  };
  const appbar = document.querySelector('#view-home .f03-appbar__title');
  out.appbarTitle = { fontSize: cs(appbar, 'fontSize'), fontWeight: cs(appbar, 'fontWeight') };
  const blockTitle = document.querySelector('#view-home .f03-block__title');
  out.blockTitle = blockTitle ? { fontSize: cs(blockTitle, 'fontSize'), fontWeight: cs(blockTitle, 'fontWeight') } : null;
  const hero = document.querySelector('#f03-home-surface');
  const heroAmount = hero ? hero.querySelector('.m-surface__amount') : null;
  const heroLabel = hero ? hero.querySelector('.m-surface__label') : null;
  out.hero = hero ? {
    rect: hero.getBoundingClientRect().toJSON(),
    contentPadding: cs(hero.querySelector('.m-surface__content'), 'padding'),
    background: cs(hero, 'backgroundImage').slice(0, 80),
    amountFontSize: heroAmount ? cs(heroAmount, 'fontSize') : null,
    amountColor: heroAmount ? cs(heroAmount, 'color') : null,
    labelFontSize: heroLabel ? cs(heroLabel, 'fontSize') : null,
    wavesDisplay: cs(hero.querySelector('.m-surface__waves'), 'display'),
  } : null;
  const row = document.querySelector('#f03-home-recent .f03-row');
  out.recentRow = row ? {
    rect: row.getBoundingClientRect().toJSON(),
    minHeight: cs(row, 'minHeight'),
    padding: cs(row, 'padding'),
    nameFontSize: cs(row.querySelector('.f03-row__name'), 'fontSize'),
    metaFontSize: cs(row.querySelector('.f03-row__meta'), 'fontSize'),
    metaColor: cs(row.querySelector('.f03-row__meta'), 'color'),
    valueFontSize: cs(row.querySelector('.f03-row__value'), 'fontSize'),
    border: cs(row, 'borderBottomWidth') + ' ' + cs(row, 'borderBottomColor'),
  } : null;
  const navbar = document.querySelector('#f03-navbar');
  out.navbar = navbar ? {
    rect: navbar.getBoundingClientRect().toJSON(),
    itemMinHeight: cs(navbar.querySelector('.m-navbar__item'), 'minHeight'),
    itemFontSize: cs(navbar.querySelector('.m-navbar__item'), 'fontSize'),
    itemColor: cs(navbar.querySelector('.m-navbar__item'), 'color'),
    currentItemColor: cs(navbar.querySelector('.m-navbar__item[aria-current="page"]'), 'color'),
    border: cs(navbar, 'borderTopWidth') + ' ' + cs(navbar, 'borderTopColor'),
  } : null;
  const cta = document.querySelector('#f03-home-add');
  out.ctaAdd = cta ? {
    rect: cta.getBoundingClientRect().toJSON(),
    minHeight: cs(cta, 'minHeight'),
    inFirstScreen: cta.getBoundingClientRect().top < window.innerHeight,
  } : null;
  const actions = document.querySelector('#view-home .f03-actions');
  out.actionsGap = actions ? cs(actions, 'gap') : null;
  const rowlist = document.querySelector('#f03-home-recent');
  out.rowlist = rowlist ? {
    radius: cs(rowlist, 'borderRadius'),
    border: cs(rowlist, 'borderTopWidth') + ' ' + cs(rowlist, 'borderTopColor'),
    background: cs(rowlist, 'backgroundColor'),
  } : null;
  out.hint = (() => { const h = document.querySelector('.f03-hint');
    return h ? { fontSize: cs(h, 'fontSize'), color: cs(h, 'color') } : null; })();
  return out;
}
"""

JS_TEXT_ZOOM_TWO_PASS = r"""
() => {
  // آلية معلنة (نمط ui-release-check للمكتبة): قراءة كل خط محسوب ثم مضاعفته
  // — محاكاة نص فقط، ليست native zoom ولا zoom نظام.
  const all = [document.body, ...document.querySelectorAll('body *')];
  const before = all.map(e => [e, parseFloat(getComputedStyle(e).fontSize)]);
  before.forEach(([e, s]) => { e.style.fontSize = (s * 2) + 'px'; });
  return before.length;
}
"""

JS_OVERFLOW_AND_KEYS = r"""
() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  bodyScrollWidth: document.body.scrollWidth,
})
"""

JS_HERO_BOUNDS = r"""
() => {
  const hero = document.querySelector('#f03-home-surface');
  if (!hero) return null;
  const hr = hero.getBoundingClientRect();
  const bad = [];
  ['m-surface__label', 'm-surface__amount', 'm-surface__sub'].forEach(cls => {
    const el = hero.querySelector('.' + cls);
    if (!el) return;
    const r = document.createRange(); r.selectNodeContents(el);
    for (const cr of r.getClientRects()) {
      if (cr.width === 0 && cr.height === 0) continue;
      if (cr.left < hr.left - 0.5 || cr.right > hr.right + 0.5 || cr.top < hr.top - 0.5 || cr.bottom > hr.bottom + 0.5) {
        bad.push({ cls, rect: cr.toJSON() });
      }
    }
  });
  const navbar = document.querySelector('#f03-navbar');
  const foot = document.querySelector('.f03-foot');
  return {
    heroRect: hr.toJSON(),
    outOfBounds: bad,
    navbarHeight: navbar ? navbar.getBoundingClientRect().height : null,
    footPaddingBottom: foot ? getComputedStyle(foot).paddingBottom : null,
    footLinkBottom: foot ? foot.querySelector('.f03-foot__link').getBoundingClientRect().bottom : null,
    innerHeight: window.innerHeight,
  };
}
"""

JS_NAVBAR_COVER = r"""
() => {
  const navbar = document.querySelector('#f03-navbar');
  const footLink = document.querySelector('.f03-foot__link');
  if (!navbar || !footLink) return null;
  const nr = navbar.getBoundingClientRect();
  const fr = footLink.getBoundingClientRect();
  // الرابط مغطى إن كان قاعه داخل منطقة الشريط (الشريط يبدأ من nr.top)
  return { navbarTop: nr.top, linkBottom: fr.bottom, covered: fr.bottom > nr.top, overlapPx: Math.max(0, fr.bottom - nr.top) };
}
"""

def enter_app(page):
    page.goto(F03, wait_until='networkidle')
    page.click('#f03-gw-demo')
    page.wait_for_selector('#view-home:not([hidden])')
    page.wait_for_timeout(400)  # تمكين الرسوم من التموضع

def main():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM, args=['--force-prefers-reduced-motion' if False else '--hide-scrollbars'])
        ctx = browser.new_context(viewport={'width': 430, 'height': 900}, reduced_motion='no-preference', device_scale_factor=1)
        page = ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        enter_app(page)

        # 1) المقاسات الأربعة (نفس الصفحة المفتوحة، تغيير مقاس فقط)
        for w in (320, 360, 390, 430):
            page.set_viewport_size({'width': w, 'height': 900})
            page.wait_for_timeout(250)
            results[f'home_{w}'] = page.evaluate(JS_MEASURE_HOME)
            results[f'home_{w}']['horizontalOverflow'] = page.evaluate(JS_OVERFLOW_AND_KEYS)
        page.screenshot(path=f'{EVID}/f03-home-320.png')
        page.set_viewport_size({'width': 430, 'height': 900})
        page.wait_for_timeout(250)
        page.screenshot(path=f'{EVID}/f03-home-430.png')

        # 2) 430 -> 320 دون إعادة فتح: تحقق من الفيض والمقاسات
        page.set_viewport_size({'width': 320, 'height': 900})
        page.wait_for_timeout(300)
        results['resize_430_to_320'] = {
            'overflow': page.evaluate(JS_OVERFLOW_AND_KEYS),
            'main': page.evaluate("() => { const m=document.querySelector('.f03-main'); return {pw: getComputedStyle(m).paddingInlineStart, rect: m.getBoundingClientRect().toJSON()}; }"),
            'heroBounds': page.evaluate(JS_HERO_BOUNDS),
        }

        # 3) تكبير النص 200% بمرورين معلنين عند 320 (الرئيسية)
        n = page.evaluate(JS_TEXT_ZOOM_TWO_PASS)
        page.wait_for_timeout(350)
        results['text200_home_320'] = {
            'elementsDoubled': n,
            'overflow': page.evaluate(JS_OVERFLOW_AND_KEYS),
            'heroBounds': page.evaluate(JS_HERO_BOUNDS),
            'navbarCover': page.evaluate(JS_NAVBAR_COVER),
            'rowHeights': page.evaluate("""() => [...document.querySelectorAll('#f03-home-recent .f03-row')].slice(0,3).map(r => r.getBoundingClientRect().height)"""),
            'appbarTitleSize': page.evaluate("() => getComputedStyle(document.querySelector('#view-home .f03-appbar__title')).fontSize"),
            'amountSize': page.evaluate("() => getComputedStyle(document.querySelector('#f03-home-surface .m-surface__amount')).fontSize"),
        }
        page.screenshot(path=f'{EVID}/f03-home-320-text200.png')
        page.reload(wait_until='networkidle')
        enter_app(page)

        # 4) وجهات أخرى عند 320 و430 (التراتب في التقارير والحساب)
        page.evaluate("() => window.__f03 && window.__f03.showView ? window.__f03.showView('reports') : null")
        page.wait_for_timeout(400)
        results['reports_320'] = page.evaluate("""() => {
          const cs = (el,p) => el ? getComputedStyle(el)[p] : null;
          const chartTitle = document.querySelector('#f03-rep-bars-title');
          const seg = document.querySelector('#f03-rep-seg .m-seg__item');
          return { chartTitle: cs(chartTitle,'fontSize'), chartTitleWeight: cs(chartTitle,'fontWeight'),
                   segMinHeight: cs(seg,'minHeight'), segFontSize: cs(seg,'fontSize'),
                   overflow: { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth } };
        }""")
        page.set_viewport_size({'width': 430, 'height': 900})
        page.wait_for_timeout(250)
        results['reports_430'] = page.evaluate(JS_OVERFLOW_AND_KEYS)
        page.screenshot(path=f'{EVID}/f03-reports-430.png')
        page.evaluate("() => window.__f03 && window.__f03.showView ? window.__f03.showView('account') : null")
        page.wait_for_timeout(300)
        results['account_430'] = page.evaluate("""() => {
          const rows = [...document.querySelectorAll('#view-account .m-setting-row')];
          return { settingRows: rows.map(r => ({h: r.getBoundingClientRect().height, minH: getComputedStyle(r).minHeight})),
                   title: getComputedStyle(document.querySelector('.m-setting-group__title')).fontSize };
        }""")
        page.reload(wait_until='networkidle')
        enter_app(page)

        # 5) reduced-motion فعلي: هل تبقى انتقالات غير محمية؟
        ctx2 = browser.new_context(viewport={'width': 390, 'height': 900}, reduced_motion='reduce')
        page2 = ctx2.new_page()
        page2.goto(F03, wait_until='networkidle')
        page2.click('#f03-gw-demo')
        page2.wait_for_selector('#view-home:not([hidden])')
        results['reduced_motion'] = page2.evaluate("""() => {
          const row = document.querySelector('#f03-home-recent .f03-row');
          const layer = document.querySelector('#f03-filter-layer');
          const chev = document.querySelector('.m-section__chevron');
          return {
            f03RowTransition: row ? getComputedStyle(row).transition : 'none/لا صف',
            f03RowTransitionDuration: row ? getComputedStyle(row).transitionDuration : null,
            layerTransition: layer ? getComputedStyle(layer).transition : null,
            chevronTransition: chev ? getComputedStyle(chev).transitionDuration : null,
          };
        }""")
        ctx2.close()
        results['pageerrors'] = errors
        browser.close()

    with open(f'{EVID}/f03-probe.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(json.dumps({k: v for k, v in results.items() if k in ('home_320', 'resize_430_to_320')}, ensure_ascii=False, indent=2)[:2200])
    print('OK — saved f03-probe.json')

if __name__ == '__main__':
    main()
