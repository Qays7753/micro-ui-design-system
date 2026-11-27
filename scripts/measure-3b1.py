#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""3b.1 — DOM verification of ADDENDUM 1.7 section-5 errors (kh1-kh24) on the
full-screen compose view (after 3b.0). Measurements only, no fixes."""
import json
import sys

sys.path.insert(0, 'tools/ds-gates')
sys.path.insert(0, 'tools')
from common import browser_session, resolve_page_target, wait_lab_ready

OUT = {}
JS_BASE = r"""() => {
  const content = document.querySelector('.lab-compose-content');
  const order = [];
  for (const el of (content ? content.children : [])) {
    order.push(el.className.split(' ')[0] || el.tagName.toLowerCase());
  }
  const section = document.querySelector('.mds-section');
  const rows = section ? section.querySelectorAll('.mds-object-row') : [];
  const caption = section ? section.querySelector('.mds-section-caption, .mds-section [class*="caption"]') : null;
  const heroValue = document.querySelector('.mds-hero-value');
  const heroValCs = heroValue ? getComputedStyle(heroValue) : null;
  const rowMoney = document.querySelector('.mds-object-row .mds-money');
  const rowMoneyCs = rowMoney ? getComputedStyle(rowMoney) : null;
  const mark = document.querySelector('.mds-object-row .mds-entity-mark');
  const markR = mark ? mark.getBoundingClientRect() : null;
  const rowEl = document.querySelector('.mds-object-row');
  const rowRect = rowEl ? rowEl.getBoundingClientRect() : null;
  const heroBox = document.querySelector('.mds-hero-surface, [class*="hero"]');
  const heroR = heroBox ? heroBox.getBoundingClientRect() : null;
  const spark = document.querySelector('.mds-hero-sparkline, .mds-sparkline, svg[class*="spark"]');
  const sparkR = spark ? spark.getBoundingClientRect() : null;
  const tabs = Array.from(document.querySelectorAll('.mds-tab-bar button')).map(b => (b.textContent || '').trim());
  const tabIcon = document.querySelector('.mds-tab-bar svg');
  const tabIconR = tabIcon ? tabIcon.getBoundingClientRect() : null;
  const btn = document.querySelector('.lab-compose-screen .mds-button');
  const btnCs = btn ? getComputedStyle(btn) : null;
  const btnR = btn ? btn.getBoundingClientRect() : null;
  const surfaces = Array.from(content ? content.children : []);
  let gap = null;
  if (surfaces.length > 1) {
    const a = surfaces[0].getBoundingClientRect();
    const b = surfaces[1].getBoundingClientRect();
    gap = +(b.y - a.bottom).toFixed(1);
  }
  const canvas = document.querySelector('.lab-compose-screen');
  const canvasCs = canvas ? getComputedStyle(canvas) : null;
  const heroText = heroBox ? (heroBox.textContent || '') : '';
  return {
    order,
    needsYou: {rows: rows.length, captionText: caption ? caption.textContent : null, captionTag: caption ? caption.tagName : null},
    heroValue: heroValCs ? {font: heroValCs.fontFamily, size: heroValCs.fontSize, weight: heroValCs.fontWeight} : null,
    rowMoney: rowMoneyCs ? {font: rowMoneyCs.fontFamily, size: rowMoneyCs.fontSize, weight: rowMoneyCs.fontWeight} : null,
    row: rowRect ? {h: +rowRect.height.toFixed(1)} : null,
    mark: markR ? {w: +markR.width.toFixed(1), h: +markR.height.toFixed(1)} : null,
    heroBox: heroR ? {w: +heroR.width.toFixed(1), h: +heroR.height.toFixed(1)} : null,
    sparkline: sparkR ? {w: +sparkR.width.toFixed(1), h: +sparkR.height.toFixed(1)} : null,
    sourceText: (heroText.match(/من\s+[^·\n]{1,24}/) || [null])[0],
    tabs,
    tabIcon: tabIconR ? {w: +tabIconR.width.toFixed(1), h: +tabIconR.height.toFixed(1)} : null,
    createButton: btnCs ? {bg: btnCs.backgroundColor, border: btnCs.borderColor, h: btnR ? +btnR.height.toFixed(1) : null,
                           canvasBg: canvasCs ? canvasCs.backgroundColor : null} : null,
    surfaceGap: gap,
    heroChildren: heroBox ? heroBox.querySelectorAll('*').length : null,
  };
}"""

JS_SHEET = r"""() => {
  const sheet = document.querySelector('.mds-sheet');
  if (!sheet) return null;
  const sr = sheet.getBoundingClientRect();
  const sCs = getComputedStyle(sheet);
  const field = sheet.querySelector('.mds-text-field, .mds-amount-field');
  const fr = field ? field.getBoundingClientRect() : null;
  const abBtn = sheet.querySelector('.mds-action-bar .mds-button');
  const ab = sheet.querySelector('.mds-action-bar');
  const abR = ab ? ab.getBoundingClientRect() : null;
  const abBtnR = abBtn ? abBtn.getBoundingClientRect() : null;
  const abCs = ab ? getComputedStyle(ab) : null;
  const title = sheet.querySelector('h2, [class*="title"]');
  const inner = sheet.querySelector('.mds-surface');
  const ir = inner ? inner.getBoundingClientRect() : null;
  return {
    sheet: {x: +sr.x.toFixed(1), y: +sr.y.toFixed(1), w: +sr.width.toFixed(1), h: +sr.height.toFixed(1),
            pctH: +(sr.height / innerHeight * 100).toFixed(1)},
    sheetPadding: {inline: sCs.paddingInlineStart, block: sCs.paddingTop},
    title: title ? (title.textContent || '').trim().slice(0, 40) : null,
    field: fr ? {x: +fr.x.toFixed(1), w: +fr.width.toFixed(1), h: +fr.height.toFixed(1)} : null,
    fieldVsSheet: fr ? +(fr.x - sr.x).toFixed(1) : null,
    innerSurface: ir ? {x: +ir.x.toFixed(1), w: +ir.width.toFixed(1), h: +ir.height.toFixed(1)} : null,
    actionBar: abR ? {x: +abR.x.toFixed(1), y: +abR.y.toFixed(1), w: +abR.width.toFixed(1), h: +abR.height.toFixed(1),
                      padInline: abCs ? abCs.paddingInlineStart : null, padBlock: abCs ? abCs.paddingTop : null} : null,
    actionBarBtn: abBtnR ? {x: +abBtnR.x.toFixed(1), y: +abBtnR.y.toFixed(1), w: +abBtnR.width.toFixed(1), h: +abBtnR.height.toFixed(1)} : null,
    fieldInput: field && field.querySelector('input') ? getComputedStyle(field.querySelector('input')).fontSize : null,
  };
}"""


def close_sheets(page):
    # the Sheet's closer is the panel icon button (its accessible name is the
    # sheet title); ConfirmSheet's closer is «رجوع». Real trusted clicks.
    for _ in range(4):
        n = page.evaluate("() => document.querySelectorAll('.mds-sheet, [class*=mds-confirm]').length")
        if n == 0:
            break
        try:
            page.locator('.mds-sheet .mds-icon-button').first.click(timeout=1500)
        except Exception:
            try:
                page.get_by_text('رجوع').first.click(timeout=1500)
            except Exception:
                break
        page.wait_for_timeout(450)
    page.wait_for_timeout(250)


def run():
    kind, val = resolve_page_target('')
    server, url = val
    url_default = url.replace('?view=catalog&tools=1', '?view=compose')
    try:
        with browser_session('chromium') as session:
            pg = session.page(viewport={'width': 360, 'height': 780})
            pg.goto(url_default, wait_until='load', timeout=30000)
            wait_lab_ready(pg)
            pg.wait_for_timeout(600)
            OUT['base'] = pg.evaluate(JS_BASE)

            pg.evaluate("""() => {
                const b = Array.from(document.querySelectorAll('button')).find(x => (x.textContent||'').includes('سجّل حركة'));
                if (b) b.click();
            }""")
            pg.wait_for_timeout(600)
            OUT['movementSheet'] = pg.evaluate(JS_SHEET)
            close_sheets(pg)

            pg.locator('.mds-project-switcher').click(timeout=2500)
            pg.wait_for_timeout(600)
            OUT['projectSheet'] = pg.evaluate(JS_SHEET)
            OUT['projectSheetHideRow'] = pg.evaluate("""() => {
                const rows = Array.from(document.querySelectorAll('.mds-sheet .mds-object-row'));
                const r = rows.find(x => (x.textContent||'').includes('المبالغ'));
                if (!r) return null;
                const mark = r.querySelector('.mds-entity-mark');
                const trailing = r.querySelector('[class*="trailing"]');
                const m = mark ? mark.getBoundingClientRect() : null;
                return {markLetter: mark ? (mark.textContent||'').trim() : null, markW: m ? +m.width.toFixed(1) : null,
                        trailingSvg: trailing ? !!trailing.querySelector('svg') : false,
                        text: (r.textContent||'').trim().slice(0,30)};
            }""")
            close_sheets(pg)

            pg.locator('.mds-notifications-button').click(timeout=2500)
            pg.wait_for_timeout(600)
            OUT['notifSheet'] = pg.evaluate(JS_SHEET)
            OUT['notifRows'] = pg.evaluate("""() => {
                return Array.from(document.querySelectorAll('.mds-sheet .mds-object-row')).map(r => {
                    const dash = Array.from(r.querySelectorAll('*')).filter(e => (e.textContent || '') === '—' && e.children.length === 0).length;
                    return {text: (r.textContent||'').trim().slice(0, 36), dashEnds: dash};
                });
            }""")
            close_sheets(pg)

            pg.locator('.mds-ask-button').click(timeout=2500)
            pg.wait_for_timeout(600)
            OUT['askSheet'] = pg.evaluate(JS_SHEET)
            close_sheets(pg)

            pg.locator('.mds-section .mds-object-row').first.click(timeout=2500)
            pg.wait_for_timeout(600)
            OUT['objectSheet'] = pg.evaluate(JS_SHEET)
            OUT['objectSheetRows'] = pg.evaluate("""() => {
                return Array.from(document.querySelectorAll('.mds-sheet .mds-object-row')).map(r => {
                    const mark = r.querySelector('.mds-entity-mark');
                    return {text: (r.textContent||'').trim().slice(0, 44), markLetter: mark ? (mark.textContent||'').trim() : null};
                });
            }""")
            OUT['objectSheetAB'] = pg.evaluate("""() => {
                const ab = document.querySelector('.mds-sheet .mds-action-bar');
                return ab ? (ab.textContent || '').trim().slice(0, 30) : null;
            }""")
            close_sheets(pg)
    finally:
        if server:
            server.stop()
    print(json.dumps(OUT, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    run()
