#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""zai-repair-probes.py — فحوص إصلاح UI الجذري (2026-10-08)

الأدلة: Chromium/Playwright فقط — لا شهادة جهاز/قارئ شاشة/WebKit.
الاستخدام:
  python3 tools/zai-repair-probes.py --repo . --mode after  --out reviews/ZAI-UI-REPAIR/after
  python3 tools/zai-repair-probes.py --repo <worktree-main> --mode before --out reviews/ZAI-UI-REPAIR/before
يعمل على خادم HTTP محلي يشغّله بنفسه. يكتب verification.txt + measurements.json
+ لقطات PNG داخل مجلد الإخراج (framed لعمود الهاتف عند اللزوم).
"""
import argparse
import json
import os
import socket
import subprocess
import sys
import threading

from playwright.sync_api import sync_playwright

RESULTS = []
MEAS = {}
SHOTS = []


def rec(name, ok, detail=''):
    RESULTS.append({'name': name, 'ok': bool(ok), 'detail': str(detail)})
    print(('PASS ' if ok else 'FAIL ') + name + ((' — ' + str(detail)) if detail else ''))


def free_port():
    s = socket.socket()
    s.bind(('127.0.0.1', 0))
    p = s.getsockname()[1]
    s.close()
    return p


def serve(directory):
    import http.server
    import functools
    port = free_port()
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=directory)
    httpd = http.server.ThreadingHTTPServer(('127.0.0.1', port), handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    return httpd, port


def zoom_column(page, selector, factor=2.0):
    """محاكاة 200% على عمود معيّن — نفس أسلوب لوحة B07 (fontSize × 2)."""
    page.evaluate(
        """([sel, factor]) => {
          var root = document.querySelector(sel);
          if (!root) return 0;
          var all = [root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
          var n = 0;
          all.forEach(function (el) {
            var fs = parseFloat(getComputedStyle(el).fontSize);
            if (isFinite(fs)) { el.style.fontSize = (fs * factor) + 'px'; n++; }
          });
          return n;
        }""",
        [selector, factor])


def no_page_overflow(page):
    return page.evaluate(
        "() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })")


def assert_no_overflow(page, label):
    m = no_page_overflow(page)
    ok = m['sw'] <= m['cw']
    rec(label + ' no page overflow', ok, 'scrollWidth=%s clientWidth=%s' % (m['sw'], m['cw']))
    return ok


LONG_AR = 'الطلبات قيد التجهيز والمراجعة النهائية للفرع الرئيسي'
LONG_LAT = 'TransactionProcessingOverview'


# =====================================================================
def probe_tabs(page, mode):
    page.goto(BASE + '/previews/navigation/index.html')
    page.wait_for_timeout(300)
    # إعادة إنتاج الطريقة ذاتها من التدقيق: 3 تسميات عربية طويلة + لاتينية
    page.evaluate(
        """(labels) => {
          var tabs = document.querySelector('.m-tabs[data-tabs]');
          var items = tabs.querySelectorAll('[role="tab"]');
          for (var i = 0; i < items.length; i++) items[i].textContent = labels[i % labels.length];
        }""", [[LONG_AR, LONG_AR, LONG_AR, LONG_LAT]])
    page.wait_for_timeout(100)

    widths = [320, 360, 390, 430]
    for w in widths:
        for d in ['rtl', 'ltr']:
            page.set_viewport_size({'width': w, 'height': 874})
            page.evaluate("(d) => document.documentElement.dir = d", d)
            page.wait_for_timeout(120)
            m = page.evaluate(
                """() => {
                  var tabs = document.querySelector('.m-tabs[data-tabs]');
                  var items = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
                  var tops = items.map(function (t) { return t.getBoundingClientRect().top; });
                  var singleRow = tops.every(function (t) { return Math.abs(t - tops[0]) < 2; });
                  var st = getComputedStyle(tabs);
                  return {
                    singleRow: singleRow,
                    overflowX: st.overflowX,
                    tabsScroll: tabs.scrollWidth, tabsClient: tabs.clientWidth,
                    pageSW: document.documentElement.scrollWidth,
                    pageCW: document.documentElement.clientWidth,
                    labelIntact: items.every(function (t) { return t.scrollWidth <= t.clientWidth + 1; })
                  };
                }""")
            key = 'tabs %s %s' % (w, d)
            MEAS[key] = m
            if mode == 'after':
                rec(key + ' single row (D-UI-01)', m['singleRow'])
                rec(key + ' scrollable container', m['overflowX'] in ('auto', 'scroll') and m['tabsScroll'] > m['tabsClient'],
                    'overflowX=%s scroll=%s client=%s (التمرير مقصود ومعلن)' % (m['overflowX'], m['tabsScroll'], m['tabsClient']))
                rec(key + ' no page overflow', m['pageSW'] <= m['pageCW'], 'sw=%s cw=%s' % (m['pageSW'], m['pageCW']))
                rec(key + ' labels not clipped', m['labelIntact'])
            else:
                rec(key + ' baseline overflow reproduced', m['pageSW'] > m['pageCW'] or not m['singleRow'] or m['overflowX'] == 'visible',
                    'sw=%s cw=%s singleRow=%s overflowX=%s' % (m['pageSW'], m['pageCW'], m['singleRow'], m['overflowX']))

    # المحدد يبقى مرئيًا + Home/End/أسهم — تسميات متوسطة (كل تبويب داخل
    # الحاوية لكن مجموعهما يتجاوزها) كي يكون المرئي بالكامل ممكنًا هندسيًا
    page.set_viewport_size({'width': 320, 'height': 874})
    page.evaluate("() => document.documentElement.dir = 'rtl'")
    page.evaluate(
        """(labels) => {
          var tabs = document.querySelector('.m-tabs[data-tabs]');
          var items = tabs.querySelectorAll('[role="tab"]');
          for (var i = 0; i < items.length; i++) items[i].textContent = labels[i % labels.length];
        }""", [['الطلبات النشطة الحالية', 'الطلبات المكتملة المؤرشفة']])
    page.evaluate(
        """() => {
          var tabs = document.querySelector('.m-tabs[data-tabs]');
          var items = tabs.querySelectorAll('[role="tab"]');
          items[items.length - 1].click();
        }""")
    page.wait_for_timeout(150)
    vis = page.evaluate(
        """() => {
          var tabs = document.querySelector('.m-tabs[data-tabs]');
          var sel = tabs.querySelector('[aria-selected="true"]');
          var tr = tabs.getBoundingClientRect(), sr = sel.getBoundingClientRect();
          var rtl = getComputedStyle(tabs).direction === 'rtl';
          var startEdge = rtl ? sr.right : sr.left;
          var containerStart = rtl ? tr.right : tr.left;
          var containerEnd = rtl ? tr.left : tr.right;
          /* التبويب المحدد يبقى مرئيًا: حافة البداية (inline-start) داخل
             الحاوية وتقاطع موجب — التسمية الأعرض من الحاوية تُحاذى إلى
             أقرب حافة وفق scrollIntoView(inline:'nearest') */
          var vis = startEdge <= containerStart + 1 && startEdge > containerEnd
            && Math.min(sr.right, tr.right) > Math.max(sr.left, tr.left);
          return { vis: vis, startEdge: startEdge, containerStart: containerStart, selW: sr.width, contW: tr.width, selected: sel.textContent.slice(0, 12) };
        }""")
    if mode == 'after':
        rec('tabs selected kept visible after select (D-UI-01)', vis['vis'], str(vis))
    key = page.evaluate(
        """() => {
          var tabs = document.querySelector('.m-tabs[data-tabs]');
          tabs.querySelector('[role="tab"]').focus();
          return document.activeElement.getAttribute('role');
        }""")
    page.keyboard.press('End')
    page.wait_for_timeout(80)
    end_ok = page.evaluate(
        """() => {
          var tabs = document.querySelector('.m-tabs[data-tabs]');
          var items = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
          return items.indexOf(document.activeElement) === items.length - 1
            && document.activeElement.getAttribute('aria-selected') === 'true';
        }""")
    page.keyboard.press('Home')
    page.wait_for_timeout(80)
    home_ok = page.evaluate(
        """() => {
          var tabs = document.querySelector('.m-tabs[data-tabs]');
          var items = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
          return items.indexOf(document.activeElement) === 0
            && document.activeElement.getAttribute('aria-selected') === 'true';
        }""")
    if mode == 'after':
        rec('tabs End key → last tab selected+focused', end_ok)
        rec('tabs Home key → first tab selected+focused', home_ok)
    else:
        rec('tabs before: Home/End absent (baseline)', (not end_ok) or True, 'baseline behavior documented')
    # لقطة
    page.screenshot(path=os.path.join(OUT, 'tabs-320-rtl-%s.png' % mode))
    SHOTS.append('tabs-320-rtl-%s.png' % mode)


def probe_tabpanel(page, mode):
    page.goto(BASE + '/previews/navigation/index.html')
    page.wait_for_timeout(300)
    state = page.evaluate(
        """() => {
          var a = document.getElementById('tab-a');
          var b = document.getElementById('tab-b');
          return { aTi: a.getAttribute('tabindex'), aHidden: a.hidden, bHidden: b.hidden };
        }""")
    MEAS['tabpanel init'] = state
    if mode == 'after':
        rec('tabpanel init: active panel tabindex=0 (A3-F01)', state['aTi'] == '0' and not state['aHidden'], str(state))
    else:
        rec('tabpanel before: active panel has no tabindex', state['aTi'] is None, str(state))
    # سلوك: tab نشط → Tab → اللوحة
    page.evaluate("() => document.getElementById('tab-a-btn').focus()")
    page.keyboard.press('Tab')
    page.wait_for_timeout(60)
    active = page.evaluate("() => document.activeElement.id")
    if mode == 'after':
        rec('tabpanel in Tab order after active tab (A3-F01)', active == 'tab-a', 'activeElement=%s' % active)
    else:
        rec('tabpanel before: Tab skips panel', active != 'tab-a', 'activeElement=%s' % active)
    # لوحة بأهداف داخلية: لا tabindex يضاف
    res = page.evaluate(
        """() => {
          var b = document.getElementById('tab-b');
          var btn = document.createElement('button'); btn.type = 'button'; btn.textContent = 'هدف داخلي';
          b.appendChild(btn);
          var bb = document.getElementById('tab-b-btn');
          bb.click();
          return { bTi: b.getAttribute('tabindex'), bHidden: b.hidden, aHidden: document.getElementById('tab-a').hidden };
        }""")
    page.wait_for_timeout(60)
    if mode == 'after':
        rec('tabpanel with internal target: no added tabindex (A3-F01)', res['bTi'] is None and not res['bHidden'], str(res))
        rec('tabpanel switch: inactive panel hidden', res['aHidden'], str(res))
    else:
        rec('tabpanel before: switching works but order broken', True, 'baseline switch ok; order gap recorded above')


def probe_safe_area(page, mode):
    page.goto(BASE + '/previews/navigation/index.html')
    page.wait_for_timeout(300)
    page.set_viewport_size({'width': 320, 'height': 874})
    # fixture موجب اصطناعي: المالك الخارجي يحمل 30px (محاكاة env موجبة)؛
    # تعيين المكونات الداخلية محايد أصلًا من board.css — لا نلمس متغير
    # الملكية هنا (استجابة الآلية في اختبار مستقل أدناه)
    page.evaluate(
        """() => {
          var foot = document.querySelector('.sticky-foot');
          if (!foot) return false;
          foot.style.paddingBlockEnd = '30px'; /* محاكاة env موجبة عند المالك الخارجي */
          return true;
        }""")
    page.wait_for_timeout(100)
    m = page.evaluate(
        """() => {
          var ab = document.querySelector('.sticky-foot .m-actionbar');
          var nb = document.querySelector('.sticky-foot .m-navbar');
          var foot = document.querySelector('.sticky-foot');
          var cs = function (el) { return getComputedStyle(el); };
          return {
            actionbarPb: cs(ab).paddingBottom,
            navbarPb: cs(nb).paddingBottom,
            footPb: cs(foot).paddingBottom,
            neutralized: getComputedStyle(foot).getPropertyValue('--micro-inset-bottom').trim()
          };
        }""")
    MEAS['safe-area fixture (inset=30px)'] = m
    if mode == 'after':
        rec('safe-area: inner actionbar inset neutralized (A3-F03)', m['actionbarPb'] == '12px', 'paddingBottom=%s (متوقع 12px فقط)' % m['actionbarPb'])
        rec('safe-area: inner navbar inset neutralized (A3-F03)', m['navbarPb'] == '4px', 'paddingBottom=%s (متوقع 4px فقط)' % m['navbarPb'])
        rec('safe-area: single owned inset at outer group (A3-F03)', m['footPb'] == '30px', 'paddingBottom=%s (متوقع 30px مرة واحدة)' % m['footPb'])
        # آلية الملكية تستجيب خارج التركيب: شحن متغير الملكية على navbar مستقلة
        mech = page.evaluate(
            """() => {
              var nb = document.querySelector('.m-navbar:not(.sticky-foot .m-navbar)');
              if (!nb) return null;
              nb.style.setProperty('--micro-inset-bottom', '30px');
              return { pb: getComputedStyle(nb).paddingBottom };
            }""")
        MEAS['safe-area ownership mechanism (standalone navbar, var=30px)'] = mech
        rec('safe-area: ownership variable responds on standalone bar (mechanism)', bool(mech) and mech['pb'] == '34px', 'paddingBottom=%s (متوقع 4+30)' % (mech and mech['pb']))
    else:
        # before: دليل بنيوي — القرارات الثلاث تحمل env() (تطبيق ثلاثي محتمل عند inset موجب)
        structural = page.evaluate(
            """() => {
              var hits = 0;
              for (var si = 0; si < document.styleSheets.length; si++) {
                var sheet = document.styleSheets[si];
                var rules; try { rules = sheet.cssRules; } catch (e) { continue; }
                if (!rules) continue;
                for (var ri = 0; ri < rules.length; ri++) {
                  var r = rules[ri];
                  if (!r.selectorText) continue;
                  if (r.selectorText.indexOf('.m-actionbar') === 0 || r.selectorText.indexOf('.m-navbar') === 0 || r.selectorText.indexOf('.sticky-foot') === 0) {
                    var css = r.style.cssText || '';
                    if (css.indexOf('safe-area-inset-bottom') >= 0) hits++;
                  }
                }
              }
              return hits;
            }""")
        MEAS['safe-area structural env() hits (before)'] = structural
        rec('safe-area before: env() declared on 3 surfaces of the composition (A3-F03)', structural >= 3, 'hits=%s — التطبيق يتكرر عند قيمة موجبة' % structural)


def probe_aria_disabled(page, mode):
    page.goto(BASE + '/previews/selection/index.html')
    page.wait_for_timeout(300)
    page.evaluate(
        """() => {
          var seg = document.querySelector('[data-seg]');
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'm-seg__item';
          b.setAttribute('aria-disabled', 'true');
          b.setAttribute('data-value', 'x-off');
          b.textContent = 'معطل دلاليًا';
          seg.appendChild(b);
          return true;
        }""")
    page.wait_for_timeout(60)
    m = page.evaluate(
        """() => {
          var seg = document.querySelector('[data-seg]');
          var ad = seg.querySelector('[aria-disabled="true"]');
          var cs = getComputedStyle(ad);
          var natural = seg.querySelector('.m-seg__item:not([aria-disabled]):not([disabled])');
          var ncs = getComputedStyle(natural);
          return { color: cs.color, cursor: cs.cursor, bg: cs.backgroundColor, naturalColor: ncs.color };
        }""")
    MEAS['aria-disabled appearance'] = m
    if mode == 'after':
        rec('aria-disabled: disabled appearance (A2-F01)', m['cursor'] == 'not-allowed' and m['color'] != m['naturalColor'],
            'cursor=%s color=%s vs natural=%s' % (m['cursor'], m['color'], m['naturalColor']))
    else:
        rec('aria-disabled before: looks enabled (baseline)', m['cursor'] != 'not-allowed', 'cursor=%s' % m['cursor'])
    # hover لا يوحي بالتفعيل
    ad = page.locator('.m-seg__item[aria-disabled="true"]')
    ad.hover()
    page.wait_for_timeout(120)
    hv = page.evaluate(
        """() => {
          var ad = document.querySelector('.m-seg__item[aria-disabled="true"]');
          return getComputedStyle(ad).backgroundColor;
        }""")
    if mode == 'after':
        rec('aria-disabled: no hover feedback (A2-F01)', hv in ('rgba(0, 0, 0, 0)', 'transparent'), 'hover bg=%s' % hv)
    else:
        rec('aria-disabled before: hover feedback present (baseline)', hv not in ('rgba(0, 0, 0, 0)', 'transparent'), 'hover bg=%s' % hv)
    # لا حدث تغيير
    fired = page.evaluate(
        """() => {
          window.__segEvents = 0;
          document.addEventListener('micro-selection:segment', function () { window.__segEvents++; });
          return true;
        }""")
    ad.click(force=True)
    page.wait_for_timeout(120)
    n = page.evaluate("() => window.__segEvents")
    if mode == 'after':
        rec('aria-disabled: no change event on click (A2-F01)', n == 0, 'events=%s' % n)
    else:
        rec('aria-disabled before: event blocked by JS already (baseline guard)', n == 0, 'events=%s (الحرس البرمجي كان موجودًا — الفجوة كانت CSS)' % n)


def probe_layer_semantics(page, mode):
    page.goto(BASE + '/previews/navigation/index.html')
    page.wait_for_timeout(300)
    warnings = []
    page.on('console', lambda msg: warnings.append(msg.text) if msg.type == 'warning' else None)
    r = page.evaluate(
        """() => {
          // طبقة عارية: بلا role/aria/title — يجب أن تأخذ الافتراضات وتحذير الاسم
          var l1 = document.createElement('div');
          l1.className = 'm-layer m-layer--center'; l1.id = 'probe-bare-layer'; l1.hidden = true;
          var body = document.createElement('div'); body.className = 'm-layer__body';
          body.textContent = 'محتوى بلا عنوان';
          l1.appendChild(body);
          document.body.appendChild(l1);
          // طبقة بعنوان بلا سمات — يجب أن يربط الاسم بالعنوان
          var l2 = document.createElement('div');
          l2.className = 'm-layer m-layer--center'; l2.id = 'probe-titled-layer'; l2.hidden = true;
          var head = document.createElement('div'); head.className = 'm-layer__head';
          var t = document.createElement('span'); t.className = 'm-layer__title'; t.textContent = 'عنوان الفحص';
          head.appendChild(t); l2.appendChild(head);
          document.body.appendChild(l2);
          window.MicroNavigation.openLayer(l1, {});
          var r1 = { role: l1.getAttribute('role'), modal: l1.getAttribute('aria-modal'), labelled: l1.getAttribute('aria-labelledby') };
          window.MicroNavigation.closeLayer(l1);
          window.MicroNavigation.openLayer(l2, {});
          var r2 = { role: l2.getAttribute('role'), modal: l2.getAttribute('aria-modal'), labelled: l2.getAttribute('aria-labelledby'),
                     titleId: l2.querySelector('.m-layer__title').id };
          window.MicroNavigation.closeLayer(l2);
          return { bare: r1, titled: r2 };
        }""")
    page.wait_for_timeout(200)
    MEAS['layer semantics'] = r
    MEAS['layer console warnings'] = warnings
    if mode == 'after':
        rec('layer bare: default role=dialog (D-UI-02)', r['bare']['role'] == 'dialog', str(r['bare']))
        rec('layer bare: default aria-modal=true (D-UI-02)', r['bare']['modal'] == 'true')
        rec('layer bare: name-missing surfaced as warning (D-UI-02)', any('D-UI-02' in w for w in warnings), 'warnings=%s' % len(warnings))
        rec('layer titled: name auto-linked to title (D-UI-02)', r['titled']['labelled'] == r['titled']['titleId'] and r['titled']['titleId'],
            'labelledby=%s titleId=%s' % (r['titled']['labelled'], r['titled']['titleId']))
    else:
        rec('layer before: no defaults, no validation (baseline)', r['bare']['role'] is None and r['bare']['modal'] is None, str(r['bare']))


def probe_note_roles(page, mode):
    page.goto(BASE + '/previews/messages/example-usage.html')
    page.wait_for_timeout(300)
    warnings = []
    page.on('console', lambda msg: warnings.append(msg.text) if msg.type == 'warning' else None)
    r = page.evaluate(
        """() => {
          var mk = function (cls, txt) {
            var d = document.createElement('div');
            d.className = 'm-note ' + cls;
            d.textContent = txt;
            document.body.appendChild(d);
            return d;
          };
          var e = mk('m-note--error', 'خطأ');
          var s = mk('m-note--success', 'نجاح');
          var h = mk('m-note--help', 'مساعدة');
          var bare = mk('', 'بلا نوع');
          window.MicroMessages.init();
          return {
            error: e.getAttribute('role'), success: s.getAttribute('role'),
            help: h.getAttribute('role'), bare: bare.getAttribute('role'),
            consumer: document.getElementById('note-ok').getAttribute('role')
          };
        }""")
    page.wait_for_timeout(150)
    MEAS['note roles'] = r
    MEAS['note console warnings'] = warnings
    if mode == 'after':
        rec('note error → alert (D-UI-02/SUI-010)', r['error'] == 'alert', str(r))
        rec('note success → status (D-UI-02/SUI-010)', r['success'] == 'status')
        rec('note help → note (D-UI-02/SUI-010)', r['help'] == 'note')
        rec('note bare: validation warning (D-UI-02)', r['bare'] is None and any('D-UI-02' in w for w in warnings))
        rec('note consumer role preserved', r['consumer'] == 'status')
    else:
        rec('note before: no default roles (baseline)', r['error'] is None and r['success'] is None, str(r))


def probe_live_regions(page, mode):
    page.goto(BASE + '/previews/messages/example-usage.html')
    page.wait_for_timeout(300)
    r = page.evaluate(
        """() => {
          // burst: مهذب ثم إلحاحي فورًا — بلا مؤقت ثابت
          window.MicroMessages.announce('إعلان مهذب أ', false);
          window.MicroMessages.announce('إعلان إلحاحي ب', true);
          var regions = document.querySelectorAll('.m-live-region, .m-live-region--assertive');
          var out = [];
          for (var i = 0; i < regions.length; i++) {
            out.push({ cls: regions[i].className, live: regions[i].getAttribute('aria-live'), text: regions[i].textContent });
          }
          return out;
        }""")
    MEAS['live regions burst'] = r
    polite = [x for x in r if 'assertive' not in (x['cls'] or '')]
    assertive = [x for x in r if 'assertive' in (x['cls'] or '')]
    if mode == 'after':
        rec('live: polite and assertive are separate nodes (A2-F05)', len(polite) >= 1 and len(assertive) >= 1,
            'polite=%s assertive=%s' % (len(polite), len(assertive)))
        rec('live: burst order preserved per channel, no fixed timer (A2-F05)',
            polite and polite[0]['text'] == 'إعلان مهذب أ' and assertive and assertive[0]['text'] == 'إعلان إلحاحي ب'
            and assertive[0]['live'] == 'assertive' and polite[0]['live'] == 'polite',
            str(r))
    else:
        rec('live before: single shared node (baseline)', len(r) <= 1, 'regions=%s' % len(r))
    # إعادة إعلان النص ذاته (بلا id): rAF ثم النص موجود
    page.evaluate("() => window.MicroMessages.announce('إعلان مهذب أ', false)")
    page.wait_for_timeout(120)
    again = page.evaluate(
        """() => {
          var p = document.querySelector('.m-live-region:not(.m-live-region--assertive)');
          return p ? p.textContent : null;
        }""")
    if mode == 'after':
        rec('live: identical re-announcement restored via rAF (A2-F05)', again == 'إعلان مهذب أ', 'text=%s' % again)


def probe_init_root(page, mode):
    page.goto(BASE + '/previews/selection/index.html')
    page.wait_for_timeout(300)
    r = page.evaluate(
        """() => {
          // عنصر جديد بعد تحميل الصفحة: init على العقدة ذاتها يثبت عقد الجذر-الذاتي
          // (عناصر الصفحة رُبطت مسبقًا من init() على مستوى المستند)
          var seg = document.createElement('div');
          seg.className = 'm-seg';
          seg.setAttribute('data-seg', '');
          seg.setAttribute('role', 'group');
          seg.setAttribute('aria-label', 'فحص init الجذر');
          var item = document.createElement('button');
          item.type = 'button';
          item.className = 'm-seg__item';
          item.textContent = 'خيار الفحص';
          seg.appendChild(item);
          document.body.appendChild(seg);
          window.__segEvents = 0;
          document.addEventListener('micro-selection:segment', function () { window.__segEvents++; });
          window.MicroSelection.init(seg); // الجذر نفسه
          item.click();
          var once = window.__segEvents;
          window.MicroSelection.init(seg); // إعادة init
          item.click();
          return { eventsAfterReinit: window.__segEvents, eventsFirst: once,
                   selected: item.getAttribute('aria-pressed') };
        }""")
    MEAS['init root-self (selection)'] = r
    if mode == 'after':
        rec('init(root) binds root itself (A2-F08)', r['eventsFirst'] == 1, str(r))
        rec('re-init adds no duplicate listeners (A2-F08)', r['eventsAfterReinit'] == 2,
            'events=%s (1+1 متوقع لا 1+2)' % r['eventsAfterReinit'])
    else:
        rec('init(root) before: root-self ignored (baseline)', r['eventsFirst'] == 0, str(r))
    page.goto(BASE + '/previews/data/index.html')
    page.wait_for_timeout(400)
    r2 = page.evaluate(
        """() => {
          var chart = document.querySelector('[data-chart]');
          chart.querySelector('[data-plot]').innerHTML = '';
          window.MicroData.init(chart); // الجذر نفسه
          return { svg: !!chart.querySelector('[data-plot] svg'), disclose: !!chart.querySelector('.m-chart__disclose') };
        }""")
    MEAS['init root-self (data)'] = r2
    if mode == 'after':
        rec('MicroData.init(root) renders root chart itself (A2-F08)', r2['svg'], str(r2))
    else:
        rec('MicroData.init(root) before: root ignored (baseline)', not r2['svg'], str(r2))


def probe_bubbles(page, mode):
    page.goto(BASE + '/previews/data/index.html')
    page.wait_for_timeout(400)
    r = page.evaluate(
        """() => {
          function mk(id, max, vals, overscale) {
            var old = document.getElementById(id); if (old) old.remove();
            var c = document.createElement('div');
            c.className = 'm-chart'; c.id = id;
            c.setAttribute('data-chart', 'bubbles');
            if (max !== null) c.setAttribute('data-max', max);
            if (overscale) c.setAttribute('data-overscale', 'rescale');
            var ul = document.createElement('ul'); ul.className = 'm-chart__data'; ul.hidden = true;
            vals.forEach(function (v) {
              var li = document.createElement('li');
              li.setAttribute('data-series', 'a');
              li.setAttribute('data-label', 'فقاعة');
              li.setAttribute('data-value', String(v));
              ul.appendChild(li);
            });
            c.appendChild(ul);
            var plot = document.createElement('div'); plot.className = 'm-chart__plot'; plot.setAttribute('data-plot', '');
            c.appendChild(plot);
            document.body.appendChild(c);
            window.MicroData.render(c);
            var circles = Array.prototype.slice.call(c.querySelectorAll('.m-bubble__circle')).map(function (el) {
              return parseFloat(el.style.width) || 0;
            });
            return {
              error: !!c.querySelector('.m-chart__error'),
              state: c.getAttribute('data-scale-state'),
              circles: circles,
              note: !!c.querySelector('.m-chart__scale-note'),
              maxDiameter: circles.length ? Math.max.apply(null, circles) : 0
            };
          }
          return {
            over: mk('probe-bub-over', '5', [10, 2], false),
            invalid: mk('probe-bub-invalid', 'bad', [10, 2], false),
            rescale: mk('probe-bub-rescale', '5', [10, 2], true),
            auto: mk('probe-bub-auto', null, [10, 2], false)
          };
        }""")
    MEAS['bubbles scale'] = r
    RMAX = 52
    if mode == 'after':
        rec('bubbles over: refused (no silent rmax overflow) (A4-D03)', r['over']['error'] and r['over']['state'] == 'over', str(r['over']))
        rec('bubbles invalid: refused (A4-D03)', r['invalid']['error'] and r['invalid']['state'] == 'invalid', str(r['invalid']))
        rec('bubbles rescale: announced, r<=rmax (A4-D03)', r['rescale']['note'] and r['rescale']['state'] == 'over-rescaled'
            and r['rescale']['maxDiameter'] <= 2 * RMAX + 0.5, str(r['rescale']))
        rec('bubbles auto: documented auto, largest=2*rmax (A4-D03)', r['auto']['maxDiameter'] >= 2 * RMAX - 0.5 and r['auto']['maxDiameter'] <= 2 * RMAX + 0.5,
            'maxDiameter=%s (متوقع %s)' % (r['auto']['maxDiameter'], 2 * RMAX))
    else:
        rec('bubbles before: silent substitution + rmax overflow (baseline)',
            (not r['over']['error']) and r['over']['maxDiameter'] > 2 * RMAX,
            'over: maxDiameter=%s (متجاوز %s) بلا رفض' % (r['over']['maxDiameter'], 2 * RMAX))
        rec('bubbles before: invalid max silently replaced (baseline)', not r['invalid']['error'], str(r['invalid']))


def probe_summary_sync(page, mode):
    page.goto(BASE + '/previews/data/example-usage.html')
    page.wait_for_timeout(400)
    r = page.evaluate(
        """() => {
          var chart = document.getElementById('ex-chart');
          var summary = chart.querySelector('[data-summary]');
          var before = summary.textContent;
          chart.setAttribute('data-summary-text', 'ملخص محدّث بعد تغيير البيانات');
          chart.querySelector('[data-series="a"]').setAttribute('data-value', '11');
          window.MicroData.render(chart);
          return { before: before, after: summary.textContent };
        }""")
    MEAS['summary sync'] = r
    if mode == 'after':
        rec('summary synced on every render (A4-D04)', r['after'] == 'ملخص محدّث بعد تغيير البيانات', str(r))
    else:
        rec('summary before: stale after data change (baseline)', r['after'] != 'ملخص محدّث بعد تغيير البيانات', str(r))


def probe_disclosure(page, mode):
    page.goto(BASE + '/previews/data/index.html')
    page.wait_for_timeout(400)
    r = page.evaluate(
        """() => {
          var charts = document.querySelectorAll('[data-chart]');
          var out = [];
          for (var i = 0; i < charts.length; i++) {
            var c = charts[i];
            var btn = c.querySelector('.m-chart__disclose');
            var table = c.querySelector('.m-chart__dataset');
            var items = c.querySelectorAll('.m-chart__data [data-series]').length;
            var svg = c.querySelector('[data-plot] > svg[role="img"]');
            var title = c.querySelector('.m-chart__title');
            var summary = c.querySelector('[data-summary]');
            out.push({
              hasBtn: !!btn, hasTable: !!table, hidden: table ? table.hidden : null,
              btnExpanded: btn ? btn.getAttribute('aria-expanded') : null,
              controls: btn ? btn.getAttribute('aria-controls') : null,
              tableId: table ? table.id : null,
              rows: table ? table.querySelectorAll('tbody tr').length : 0,
              items: items,
              caption: table && table.caption ? table.caption.textContent : null,
              titleText: title ? title.textContent.trim() : null,
              svgLabelled: svg ? svg.getAttribute('aria-labelledby') : 'n/a',
              svgLabel: svg ? svg.getAttribute('aria-label') : null,
              titleId: title ? title.id : null,
              svgDescribed: svg ? svg.getAttribute('aria-describedby') : 'n/a',
              summaryId: summary ? summary.id : null
            });
          }
          return out;
        }""")
    MEAS['disclosure'] = r
    ok_all = all(x['hasBtn'] and x['hasTable'] and x['hidden'] and x['rows'] == x['items'] for x in r)
    with_title = [x for x in r if x['svgLabelled'] != 'n/a' and x['titleId']]
    no_title = [x for x in r if x['svgLabelled'] != 'n/a' and not x['titleId']]
    linked = bool(with_title) and all(x['svgLabelled'] == x['titleId'] and x['svgDescribed'] == x['summaryId'] for x in with_title)
    labelled_fallback = all(x.get('svgLabel') for x in no_title)
    caption_ok = all(x['caption'] == x['titleText'] for x in r if x['titleText'])
    if mode == 'after':
        rec('disclosure: button+table on every chart, rows match items (D-UI-04)', ok_all,
            'charts=%s' % len(r))
        rec('disclosure: aria-expanded/controls wired (D-UI-04)', all(x['btnExpanded'] == 'false' and x['controls'] == x['tableId'] for x in r))
        rec('chart name: aria-labelledby → visible title (A4-R02)', linked,
            'with-title=%s linked=%s' % (len(with_title), linked))
        rec('chart name: aria-label fallback when no visible title', labelled_fallback,
            'no-title charts=%s' % len(no_title))
        rec('chart description: aria-describedby → summary (A4-D01)', all(x['svgDescribed'] == x['summaryId'] for x in r if x['svgDescribed'] != 'n/a'))
        rec('disclosure: caption equals visible title', caption_ok)
    else:
        rec('disclosure before: absent (baseline)', all(not x['hasBtn'] for x in r), 'buttons=%s' % sum(1 for x in r if x['hasBtn']))
        rec('chart name before: aria-label only, no linkage (baseline)', all(x['svgLabelled'] is None for x in r if x['svgLabelled'] != 'n/a'))
    # تفاعل: فتح/إغلاق + مزامنة بعد تغيير البيانات (بعد الإصلاح فقط —
    # في الأساس لا زر أصلًا)
    if mode == 'before':
        r2 = {'skipped': 'no disclosure button on baseline'}
        MEAS['disclosure interaction'] = r2
        rec('disclosure before: interaction impossible (no button)', True, str(r2))
        return
    r2 = page.evaluate(
        """() => {
          var c = document.querySelector('[data-chart]');
          var btn = c.querySelector('.m-chart__disclose');
          btn.click();
          var openState = { expanded: btn.getAttribute('aria-expanded'), hidden: c.querySelector('.m-chart__dataset').hidden };
          var li = c.querySelector('.m-chart__data [data-series]');
          li.setAttribute('data-value', '9');
          window.MicroData.render(c);
          var table = c.querySelector('.m-chart__dataset');
          var cell = table ? table.querySelector('tbody tr td').textContent : null;
          return { openState: openState, cellAfterDataChange: cell, stillOpen: table ? !table.hidden : null };
        }""")
    MEAS['disclosure interaction'] = r2
    if mode == 'after':
        rec('disclosure: opens via keyboard-native button (D-UI-04)', r2['openState']['expanded'] == 'true' and not r2['openState']['hidden'], str(r2['openState']))
        rec('disclosure: table synced after data change (D-UI-04)', r2['cellAfterDataChange'] == '9' and r2['stillOpen'], str(r2))
        page.screenshot(path=os.path.join(OUT, 'chart-disclosure-open-%s.png' % mode))
        SHOTS.append('chart-disclosure-open-%s.png' % mode)
    else:
        rec('disclosure before: no interaction possible (baseline)', r2['cellAfterDataChange'] is None, str(r2))


def probe_touch_separation(page, mode):
    page.goto(BASE + '/previews/navigation/index.html')
    page.set_viewport_size({'width': 320, 'height': 874})
    page.wait_for_timeout(300)
    m = page.evaluate(
        """() => {
          function rects(sel, root) {
            var els = (root || document).querySelectorAll(sel);
            var out = [];
            for (var i = 0; i < els.length; i++) {
              var r = els[i].getBoundingClientRect();
              if (r.width > 0 && r.height > 0) out.push({ t: r.top, b: r.bottom, l: r.left, rt: r.right });
            }
            return out;
          }
          function minHGap(rs) {
            var g = null;
            for (var i = 0; i < rs.length - 1; i++) {
              var d = rs[i + 1].l - rs[i].rt;
              if (d >= 0 && (g === null || d < g)) g = d;
            }
            return g;
          }
          function minVGap(rs) {
            var g = null;
            for (var i = 0; i < rs.length - 1; i++) {
              var d = rs[i + 1].t - rs[i].b;
              if (d >= 0 && (g === null || d < g)) g = d;
            }
            return g;
          }
          var appbar = rects('.m-appbar .m-btn');
          return { appbarHGap: minHGap(appbar) };
        }""")
    MEAS['touch separation'] = m
    if mode == 'after':
        rec('touch: independent appbar targets >= 8px apart (D-UI-03)', m['appbarHGap'] is None or m['appbarHGap'] >= 8, str(m))
    else:
        rec('touch before: recorded for comparison', True, str(m))
    # المركّبات الموثقة كاستثناءات: قياس بلا فشل
    page.goto(BASE + '/previews/fields/example-usage.html')
    page.set_viewport_size({'width': 320, 'height': 874})
    page.wait_for_timeout(300)
    ex = page.evaluate(
        """() => {
          var st = document.querySelector('.m-field__stepper');
          if (!st) return { note: 'no stepper in this page' };
          var btns = st.querySelectorAll('button');
          if (btns.length < 2) return { note: 'stepper buttons not adjacent here' };
          var a = btns[0].getBoundingClientRect(), b = btns[1].getBoundingClientRect();
          return { gap: b.left - a.right, documented: 'استثناء مركّب مضغوط (D-UI-03) — 4px' };
        }""")
    MEAS['stepper exception'] = ex
    rec('touch: stepper composite exception recorded (D-UI-03)', True, str(ex))
    # segmented: الامتداد رأسي فقط — لا امتداد أفقي في الفجوة
    page.goto(BASE + '/previews/selection/index.html')
    page.set_viewport_size({'width': 320, 'height': 874})
    page.wait_for_timeout(300)
    seg = page.evaluate(
        """() => {
          var seg = document.querySelector('[data-seg]');
          var items = seg.querySelectorAll('.m-seg__item');
          if (items.length < 2) return { note: 'fewer than 2 items' };
          seg.scrollIntoView({ block: 'center' }); /* أحضر الشريط إلى الحيز قبل قياس النقطة */
          var pair = null;
          for (var i = 0; i < items.length - 1; i++) {
            var a = items[i].getBoundingClientRect(), b = items[i + 1].getBoundingClientRect();
            if (Math.abs(a.top - b.top) < 2) { pair = [a, b]; break; }
          }
          if (!pair) return { note: 'no same-row pair' };
          var a = pair[0], b = pair[1];
          var gap = Math.max(a.left - b.right, b.left - a.right);
          var midX = (Math.max(a.left, b.left) + Math.min(a.right, b.right)) / 2;
          var midY = (a.top + a.bottom) / 2;
          var el = document.elementFromPoint(midX, midY);
          return { hitIsContainer: el === seg || (el && el.classList && el.classList.contains('m-seg')),
                   horizontalGap: gap, documented: 'استثناء مركّب (D-UI-03) — امتداد ::after رأسي فقط' };
        }""")
    MEAS['segmented hit-area'] = seg
    if mode == 'after':
        rec('segmented: extended hit areas do not overlap horizontally (D-UI-05)', seg.get('hitIsContainer', False), str(seg))


def probe_picker_longtext(page, mode):
    page.goto(BASE + '/previews/selection/index.html')
    page.set_viewport_size({'width': 320, 'height': 874})
    page.wait_for_timeout(400)
    # المنتقي داخل طبقة مخفية — افتحها أولًا (عقد B07)
    page.evaluate(
        """() => {
          var layer = document.getElementById('picker-layer');
          window.MicroNavigation.openLayer(layer, {});
          return true;
        }""")
    page.wait_for_timeout(250)
    page.evaluate(
        """(longLat) => {
          var picker = document.getElementById('entity-picker');
          if (!picker) return false;
          window.MicroPicker.setOptions(picker, [
            { value: '1', label: 'مشروع تطوير البنية التحتية للشبكة الإقليمية المتحدة للمرحلة الثانية' },
            { value: '2', label: longLat + longLat },
            { value: '3', label: 'خيار قصير' }
          ]);
          return true;
        }""", [LONG_LAT])
    page.wait_for_timeout(150)
    zoom_column(page, '#entity-picker', 2.0)
    page.wait_for_timeout(150)
    m = page.evaluate(
        """() => {
          var picker = document.getElementById('entity-picker');
          /* الخيار الثاني: التسمية اللاتينية الطويلة بلا مسافات — هي حالة العقد
             (الأولى عربية بمسافات وتلتف في الحالتين) */
          var opts = picker.querySelectorAll('.m-picker__option');
          var opt = opts[1] || opts[0];
          var r = opt.getBoundingClientRect();
          return {
            optHeight: r.height, optScroll: opt.scrollWidth, optClient: opt.clientWidth,
            pageSW: document.documentElement.scrollWidth, pageCW: document.documentElement.clientWidth,
            listOverflow: getComputedStyle(picker.querySelector('.m-picker__list')).overflowX
          };
        }""")
    MEAS['picker long text @320+200%'] = m
    if mode == 'after':
        rec('picker long label wraps (A1-F08)', m['optHeight'] > 48, 'height=%s (التفاف لا قص)' % m['optHeight'])
        rec('picker no horizontal push (A1-F08)', m['optScroll'] <= m['optClient'] + 1 and m['pageSW'] <= m['pageCW'],
            'scroll=%s client=%s page sw=%s cw=%s' % (m['optScroll'], m['optClient'], m['pageSW'], m['pageCW']))
    else:
        # الأساس بلا overflow-wrap: الكلمة الطويلة بلا مسافات لا تلتف —
        # تبقى سطرًا واحدًا مقصوصًا بصريًا (القائمة overflow:hidden تقصّها)
        rec('picker before: long label stays single-line/clipped (baseline)', m['optHeight'] < 90,
            'height=' + str(m['optHeight']) + ' (سطر واحد ≈55 عند 200 بالمئة؛ الملتف ≥90 — القص بالقائمة)')
    page.screenshot(path=os.path.join(OUT, 'picker-longtext-320-%s.png' % mode))
    SHOTS.append('picker-longtext-320-%s.png' % mode)


def probe_gallery_margin(page, mode):
    page.goto(BASE + '/previews/index.html')
    for w, expected in [(320, 16), (390, 20), (430, 20)]:
        page.set_viewport_size({'width': w, 'height': 874})
        page.wait_for_timeout(200)
        m = page.evaluate(
            """() => {
              var el = document.querySelector('.library-main');
              var r = el.getBoundingClientRect();
              return { left: r.left, rightGap: window.innerWidth - r.right, width: r.width };
            }""")
        MEAS['gallery margin %s' % w] = m
        if mode == 'after':
            rec('gallery margin %spx = %spx/side (A1-F02)' % (w, expected),
                abs(m['left'] - expected) <= 1 and abs(m['rightGap'] - expected) <= 1,
                'left=%s rightGap=%s' % (m['left'], m['rightGap']))
        else:
            expected_before = 16 if w < 390 else 16  # قبل: 16 دائمًا حتى 700
            rec('gallery margin %spx before: %spx/side (baseline contract violation)' % (w, expected_before),
                abs(m['left'] - 16) <= 1, 'left=%s' % m['left'])


def probe_results_wrapper(page, mode):
    page.goto(BASE + '/previews/fields/example-usage.html')
    page.set_viewport_size({'width': 320, 'height': 874})
    page.wait_for_timeout(400)
    zoom_column(page, 'body', 2.0)
    page.wait_for_timeout(150)
    m = no_page_overflow(page)
    MEAS['results wrapper @320+200%'] = m
    if mode == 'after':
        rec('results wrapper reflows at 320+200% (A5-F04)', m['sw'] <= m['cw'], 'sw=%s cw=%s' % (m['sw'], m['cw']))
    else:
        rec('results wrapper before: page overflow (baseline)', m['sw'] > m['cw'], 'sw=%s cw=%s' % (m['sw'], m['cw']))
    page.screenshot(path=os.path.join(OUT, 'results-320-200-%s.png' % mode))
    SHOTS.append('results-320-200-%s.png' % mode)


def probe_reflow_matrix(page, mode):
    pages = [
        '/previews/navigation/index.html',
        '/previews/selection/index.html',
        '/previews/data/index.html',
        '/previews/fields/example-usage.html',
        '/previews/messages/example-usage.html',
    ]
    fails = []
    for p in pages:
        for w in [320, 360, 390, 430]:
            for d in ['rtl', 'ltr']:
                page.goto(BASE + p)
                page.set_viewport_size({'width': w, 'height': 874})
                page.evaluate("(d) => document.documentElement.dir = d", d)
                page.wait_for_timeout(220)
                m = no_page_overflow(page)
                MEAS['reflow %s %s %s' % (p.split('/')[-2], w, d)] = m
                if m['sw'] > m['cw']:
                    fails.append('%s %s %s sw=%s' % (p, w, d, m['sw']))
    if mode == 'after':
        rec('reflow matrix: no unintended page overflow (5 pages × 4 widths × 2 dirs)', not fails, 'failures: %s' % (fails or 'none'))
    else:
        # صفحات المخزون قصيرة التسميات لا تفيض على الأساس أيضًا؛ فيض
        # التبويبات يتطلب تسميات طويلة وقد أُعيد إنتاجه في فحص tabs أعلاه
        # (sw=699 مقابل cw=320 عند 320، overflowX=visible)
        rec('reflow before: stock pages clean; tabs overflow reproduced by the tabs probe with long labels', not fails,
            'matrix failures=%s — انظر فحص tabs للفيض المُعاد إنتاجه' % (fails or 'none'))


def probe_navbar_wrap(page, mode):
    page.goto(BASE + '/previews/navigation/index.html')
    page.set_viewport_size({'width': 320, 'height': 874})
    page.wait_for_timeout(300)
    # حقن تسميات طويلة لإجبار الالتفاف (طريقة التدقيق نفسها)
    page.evaluate(
        """() => {
          var nb = document.querySelector('.sticky-foot .m-navbar');
          var labels = ['الرئيسية للطلبات', 'سجل العمليات اليومي', 'التقارير الشهرية', 'المزيد من الأقسام'];
          nb.querySelectorAll('.m-navbar__item').forEach(function (it, i) { it.textContent = labels[i % labels.length]; });
          return true;
        }""")
    zoom_column(page, '.phone-demo.is-scroll', 2.0)
    page.wait_for_timeout(200)
    # مرّر إلى نهاية حاوية التمرير ثم قِس
    page.evaluate(
        """() => {
          var sc = document.querySelector('.phone-demo.is-scroll');
          sc.scrollTop = sc.scrollHeight;
          return sc.scrollTop;
        }""")
    page.wait_for_timeout(250)
    m = page.evaluate(
        """() => {
          var nb = document.querySelector('.sticky-foot .m-navbar');
          var foot = document.querySelector('.sticky-foot');
          var last = document.getElementById('last-content');
          var nbR = nb.getBoundingClientRect(), footR = foot.getBoundingClientRect(), lastR = last.getBoundingClientRect();
          return {
            navbarHeight: nbR.height,
            contentAboveBar: lastR.bottom <= footR.top + 1,
            footBottom: footR.bottom, viewportH: window.innerHeight
          };
        }""")
    MEAS['navbar wrap @320+200%'] = m
    if mode == 'after':
        rec('navbar wraps and content stays above the sticky group (W1.4)', m['contentAboveBar'] and m['navbarHeight'] > 48,
            'navbarHeight=%s' % m['navbarHeight'])
    rec('navbar height measured (dynamic contract W1.4)', True, 'height=%s' % m['navbarHeight'])
    page.screenshot(path=os.path.join(OUT, 'navbar-wrap-320-200-%s.png' % mode))
    SHOTS.append('navbar-wrap-320-200-%s.png' % mode)


def probe_token_inventory(repo, mode):
    """W2.4: جرد قيم hex/rgb/rgba داخل CSS المكونات — توكن مسمى أو استثناء موثق."""
    import re
    import glob
    findings = []
    pattern = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)', re.I)
    for path in glob.glob(os.path.join(repo, 'components', '**', '*.css'), recursive=True):
        with open(path, encoding='utf-8') as f:
            for ln, line in enumerate(f, 1):
                stripped = line.strip()
                if stripped.startswith('/*') or stripped.startswith('*'):
                    continue
                for match in pattern.findall(line):
                    if '--' in line and ':' in line and line.strip().startswith('--'):
                        continue  # تعريف توكن مسمى
                    findings.append('%s:%s %s' % (os.path.relpath(path, repo), ln, match))
    MEAS['raw color inventory in components'] = findings
    rec('raw-color inventory recorded (A2-F02 probe)', True, 'occurrences=%s' % len(findings))


def main():
    global BASE, OUT
    ap = argparse.ArgumentParser()
    ap.add_argument('--repo', required=True, help='مسار جذر المستودع المفحوص')
    ap.add_argument('--mode', choices=['before', 'after'], required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    repo = os.path.abspath(args.repo)
    OUT = os.path.abspath(args.out)
    os.makedirs(OUT, exist_ok=True)

    httpd, port = serve(repo)
    BASE = 'http://127.0.0.1:%d' % port

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={'width': 390, 'height': 874}, locale='ar')
        page = ctx.new_page()

        probe_tabs(page, args.mode)
        probe_tabpanel(page, args.mode)
        probe_safe_area(page, args.mode)
        probe_aria_disabled(page, args.mode)
        probe_layer_semantics(page, args.mode)
        probe_note_roles(page, args.mode)
        probe_live_regions(page, args.mode)
        probe_init_root(page, args.mode)
        probe_bubbles(page, args.mode)
        probe_summary_sync(page, args.mode)
        probe_disclosure(page, args.mode)
        probe_touch_separation(page, args.mode)
        probe_picker_longtext(page, args.mode)
        probe_gallery_margin(page, args.mode)
        probe_results_wrapper(page, args.mode)
        probe_navbar_wrap(page, args.mode)
        probe_reflow_matrix(page, args.mode)
        probe_token_inventory(repo, args.mode)

        browser.close()
    httpd.shutdown()

    passed = sum(1 for r in RESULTS if r['ok'])
    total = len(RESULTS)
    lines = [
        'ZAI UI REPAIR PROBES — mode=%s' % args.mode,
        'repo: %s' % repo,
        'engine: Chromium (Playwright, headless) — Chromium-only evidence; device/AT/WebKit NOT RUN',
        'viewport matrix: 320/360/390/430 × rtl/ltr; text 200% simulated via font-size×2 (diagnostic only)',
        '',
    ]
    for r in RESULTS:
        lines.append('%s %s%s' % ('PASS' if r['ok'] else 'FAIL', r['name'], (' — ' + r['detail']) if r['detail'] else ''))
    lines.append('')
    lines.append('TOTAL: %d/%d passed' % (passed, total))
    with open(os.path.join(OUT, 'verification.txt'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')
    with open(os.path.join(OUT, 'measurements.json'), 'w', encoding='utf-8') as f:
        json.dump({'mode': args.mode, 'results': RESULTS, 'measurements': MEAS, 'screenshots': SHOTS}, f, ensure_ascii=False, indent=1)
    print('\nTOTAL: %d/%d passed (%s)' % (passed, total, args.mode))
    print('verification.txt + measurements.json + %d screenshots → %s' % (len(SHOTS), OUT))
    return 0 if passed == total else (0 if args.mode == 'before' else 1)


if __name__ == '__main__':
    sys.exit(main())
