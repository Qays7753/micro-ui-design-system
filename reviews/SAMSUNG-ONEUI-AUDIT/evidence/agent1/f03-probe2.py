#!/usr/bin/env python3
# SUI-A1 / V — تتمة قياس F03: وجهات حقيقية بنقر navbar + تراكب الشريط الثابت عند 2x
import json

from playwright.sync_api import sync_playwright

BASE = 'http://127.0.0.1:5000'
F03 = BASE + '/previews/ux-patterns/mobile-record-sample/index.html'
CHROMIUM = '/home/z/my-project/evidence/bin/chromium'
EVID = '/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent1'

JS_BOTTOM_OVERLAP = r"""
() => {
  window.scrollTo(0, document.documentElement.scrollHeight);
  const navbar = document.querySelector('#f03-navbar');
  const footLink = document.querySelector('.f03-foot__link');
  const nr = navbar.getBoundingClientRect();
  const fr = footLink.getBoundingClientRect();
  return {
    navbarHeight: nr.height, navbarTop: nr.top,
    linkBottom: fr.bottom, linkTop: fr.top,
    linkCoveredByNavbar: fr.bottom > nr.top,
    linkClearancePx: nr.top - fr.bottom,
    footPaddingBottom: getComputedStyle(document.querySelector('.f03-foot')).paddingBottom,
  };
}
"""

JS_SELECTBAR_OVERLAP = r"""
() => {
  window.scrollTo(0, document.documentElement.scrollHeight);
  const bar = document.querySelector('#f03-select-bar');
  const navbar = document.querySelector('#f03-navbar');
  if (!bar || bar.hidden) return null;
  const br = bar.getBoundingClientRect();
  const nr = navbar.getBoundingClientRect();
  return {
    barBottom: br.bottom, barTop: br.top,
    navbarTop: nr.top, navbarHeight: nr.height,
    barNavbarOverlapPx: Math.max(0, br.bottom - nr.top),
  };
}
"""

def two_pass_zoom(page):
    return page.evaluate("""() => {
      const all = [document.body, ...document.querySelectorAll('body *')];
      const before = all.map(e => [e, parseFloat(getComputedStyle(e).fontSize)]);
      before.forEach(([e, s]) => { e.style.fontSize = (s * 2) + 'px'; });
      return before.length;
    }""")

def enter(page):
    page.goto(F03, wait_until='networkidle')
    page.click('#f03-gw-demo')
    page.wait_for_selector('#view-home:not([hidden])')
    page.wait_for_timeout(400)

def main():
    results = {}
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM, args=['--hide-scrollbars'])
        ctx = browser.new_context(viewport={'width': 320, 'height': 800}, reduced_motion='no-preference')
        page = ctx.new_page()
        errs = []
        page.on('pageerror', lambda e: errs.append(str(e)))
        enter(page)

        # أ) التذييل مقابل الشريط الثابت — 1x ثم 2x (نفس الجلسة، الرئيسية)
        results['foot_vs_navbar_1x_320'] = page.evaluate(JS_BOTTOM_OVERLAP)
        n = two_pass_zoom(page)
        page.wait_for_timeout(300)
        results['foot_vs_navbar_2x_320'] = page.evaluate(JS_BOTTOM_OVERLAP)
        results['foot_vs_navbar_2x_320']['elementsDoubled'] = n
        page.reload(wait_until='networkidle')
        enter(page)

        # ب) التقارير عبر نقر navbar الحقيقي
        page.click('#f03-nav-reports')
        page.wait_for_selector('#view-reports:not([hidden])')
        page.wait_for_timeout(500)
        results['reports_click_320'] = page.evaluate("""() => {
          const cs = (el, p) => el ? getComputedStyle(el)[p] : null;
          const segItem = document.querySelector('#f03-rep-seg .m-seg__item');
          const seg = document.querySelector('#f03-rep-seg');
          const peek = document.querySelector('#f03-rep-strip .m-info-card__number');
          return {
            viewVisible: !document.getElementById('view-reports').hidden,
            chartTitle: { size: cs(document.getElementById('f03-rep-bars-title'), 'fontSize'), weight: cs(document.getElementById('f03-rep-bars-title'), 'fontWeight') },
            segItemRect: segItem ? segItem.getBoundingClientRect().toJSON() : null,
            segItemMinHeight: cs(segItem, 'minHeight'),
            segWrap: seg ? getComputedStyle(seg).flexWrap : null,
            peekNumberSize: cs(peek, 'fontSize'),
            overflow: { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth },
          };
        }""")
        # تراتب أحجام النصوص في التقارير عند 320 بعد تكبير 2x: الالتفاف بلا فيض
        n2 = two_pass_zoom(page)
        page.wait_for_timeout(300)
        results['reports_click_320']['text200'] = {
            'elementsDoubled': n2,
            'overflow': page.evaluate("() => ({scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth})"),
            'segItemsPerRow': page.evaluate("() => { const items=[...document.querySelectorAll('#f03-rep-seg .m-seg__item')]; const tops=new Set(items.map(i=>Math.round(i.getBoundingClientRect().top))); return tops.size; }"),
        }
        page.reload(wait_until='networkidle')
        enter(page)

        # ج) الحساب عبر نقر navbar — صفوف الإعدادات الظاهرة فقط
        page.click('#f03-nav-account')
        page.wait_for_selector('#view-account:not([hidden])')
        page.wait_for_timeout(400)
        results['account_click_430'] = None
        page.set_viewport_size({'width': 430, 'height': 900})
        page.wait_for_timeout(250)
        results['account_click_430'] = page.evaluate("""() => {
          const rows = [...document.querySelectorAll('#view-account .m-setting-group__items .m-setting-row')]
            .filter(r => r.closest('[hidden]') === null);
          const titles = [...document.querySelectorAll('#view-account .m-setting-group__title')]
            .filter(t => t.closest('[hidden]') === null);
          const hint = document.querySelector('#view-account > .f03-hint');
          return {
            viewVisible: !document.getElementById('view-account').hidden,
            settingRows: rows.map(r => ({ h: r.getBoundingClientRect().height, minH: getComputedStyle(r).minHeight })),
            groupTitleSize: titles.map(t => getComputedStyle(t).fontSize + '/' + getComputedStyle(t).fontWeight),
            identityNameSize: getComputedStyle(document.querySelector('#view-account .m-identity__name')).fontSize,
            hintSize: hint ? getComputedStyle(hint).fontSize + '/' + getComputedStyle(hint).color : null,
            overflow: { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth },
          };
        }""")
        page.screenshot(path=f'{EVID}/f03-account-430.png')

        # د) شريط التحديد الجماعي مقابل navbar عند 2x (عرض القائمة + وضع تحديد)
        page.click('#f03-nav-list')
        page.wait_for_selector('#view-list:not([hidden])')
        page.wait_for_timeout(300)
        page.click('#f03-select-toggle')
        page.wait_for_timeout(300)
        results['selectbar_1x_320'] = page.evaluate(JS_SELECTBAR_OVERLAP)
        n3 = two_pass_zoom(page)
        page.wait_for_timeout(300)
        results['selectbar_2x_320'] = page.evaluate(JS_SELECTBAR_OVERLAP)
        results['selectbar_2x_320']['elementsDoubled'] = n3
        page.screenshot(path=f'{EVID}/f03-list-selectmode-320-text200.png')
        results['pageerrors'] = errs
        browser.close()

    with open(f'{EVID}/f03-probe2.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(json.dumps(results, ensure_ascii=False, indent=1))

if __name__ == '__main__':
    main()
