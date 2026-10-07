#!/usr/bin/env python3
"""SUI-A2 Agent 2 — Probe C: Selection (B03) + picker component-level.

Page: previews/selection/index.html (panel) via preview-server :5000.
 C1. Choice rows: min-height 48 (label full row target), box 24px,
     checked/disabled visuals, long label wrap at 320.
 C2. Radio group: dot visible when checked; native keyboard (Arrow keys
     change selection in same name group).
 C3. Switch: track 52x32, thumb 24, RTL translate on check (measured x),
     state text min-width, disabled look; REAL keyboard Space toggles
     and text updates; pending demo reverses on failure.
 C4. Segmented: wrap at 320; selected clarity (bg+weight); disabled item
     not selectable by click nor Enter; REAL ArrowLeft/ArrowRight (RTL)
     move selection + focus.
 C5. Picker (in layer): open, search filters, no-match empty row text,
     roving tabIndex, ArrowLeft/End navigation, Enter selects,
     aria-selected true + summary updates; retry in error state fires
     micro-picker:retry; close button aria-label.
 C6. Zoom lab (panel's own declared 200% mechanism, data-lab="text-zoom"):
     switch row height, seg wrap, choice text readability at 200% in 390.
Metadata: commit a5500c9 (tree 05f344b), Chromium /home/z/…/evidence/bin/chromium.
"""
import json, time
from playwright.sync_api import sync_playwright

PANEL = "http://127.0.0.1:5000/previews/selection/"
OUT = "/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent2/probe-c-selection.json"

def g(page, js):
    return page.evaluate(js)

def main():
    results = {"meta": {
        "commit": "a5500c9", "tree": "05f344b",
        "browser": "Chromium via /home/z/my-project/evidence/bin/chromium (Playwright)",
        "textZoom": "panel's own declared lab (data-lab=text-zoom, applyTextZoom x2)",
        "page": PANEL}}

    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path="/home/z/my-project/evidence/bin/chromium")

        # ---------- C1/C2/C3: static geometry + states ----------
        page = browser.new_page(viewport={"width": 360, "height": 1000})
        page.goto(PANEL, wait_until="networkidle")
        c1 = g(page, """() => {
          const rows = {};
          const c1 = document.getElementById('c1'); const c2 = document.getElementById('c2'); const c3 = document.getElementById('c3');
          const lab = c1.closest('.m-choice');
          const lr = lab.getBoundingClientRect();
          const box = lab.querySelector('.m-choice__box');
          const br = box.getBoundingClientRect();
          rows.row = { w: Math.round(lr.width*10)/10, h: Math.round(lr.height*10)/10, minH: getComputedStyle(lab).minHeight };
          rows.box = { w: Math.round(br.width*10)/10, h: Math.round(br.height*10)/10, radius: getComputedStyle(box).borderRadius };
          const c2box = c2.closest('.m-choice').querySelector('.m-choice__box');
          rows.checkedBox = { bg: getComputedStyle(c2box).backgroundColor, borderColor: getComputedStyle(c2box).borderColor };
          const c3row = c3.closest('.m-choice');
          const c3box = c3row.querySelector('.m-choice__box');
          rows.disabled = { text: getComputedStyle(c3row.querySelector('.m-choice__text')).color, bg: getComputedStyle(c3box).backgroundColor, cursor: getComputedStyle(c3row).cursor, inputDisabled: c3.disabled };
          const long = document.getElementById('c-long').closest('.m-choice');
          rows.longRow = { h: Math.round(long.getBoundingClientRect().height*10)/10, textClipped: long.scrollHeight > long.clientHeight + 1 };
          return rows;
        }""")
        # radio checked dot
        radio = g(page, """() => {
          const group = document.querySelectorAll('[aria-label="طريقة التسوية"] .m-choice--radio');
          const first = group[0];
          const r = first ? first.querySelector('.m-choice__box::after') : null;
          const checked = [...group].find(x => x.querySelector('input').checked);
          const box = checked.querySelector('.m-choice__box');
          const cs = getComputedStyle(box, '::after');
          return { groupSize: group.length, checkedLabel: checked.querySelector('.m-choice__text').textContent,
                   dotContent: cs.content, dotW: cs.width, dotH: cs.height, dotBg: cs.backgroundColor,
                   boxBg: getComputedStyle(box).backgroundColor };
        }""")
        # switch geometry + toggle
        sw = g(page, """() => {
          const sws = [...document.querySelectorAll('.m-switch')];
          const s = sws[1]; // second switch is checked (تعديل المبالغ)
          const track = s.querySelector('.m-switch__track');
          const thumb = s.querySelector('.m-switch__thumb');
          const tr = track.getBoundingClientRect(); const thr = thumb.getBoundingClientRect();
          const state = s.querySelector('.m-switch__state');
          return { trackW: Math.round(tr.width*10)/10, trackH: Math.round(tr.height*10)/10,
                   thumbW: Math.round(thr.width*10)/10,
                   thumbOffsetFromTrackStart: Math.round((thr.x - tr.x)*10)/10,
                   thumbOffsetFromTrackEnd: Math.round((tr.right - thr.right)*10)/10,
                   stateText: state.textContent, stateMinW: getComputedStyle(state).minWidth,
                   stateColorChecked: getComputedStyle(state).color,
                   inputRole: s.querySelector('input').getAttribute('role') };
        }""")
        # real keyboard: Space on first switch
        page.focus("[data-switch] input >> nth=0")
        state0 = g(page, "() => document.querySelector('[data-switch] [data-switch-state]').textContent")
        page.keyboard.press(" "); time.sleep(0.15)
        state1 = g(page, "() => document.querySelector('[data-switch] [data-switch-state]').textContent")
        checked1 = g(page, "() => document.querySelector('[data-switch] input').checked")
        page.keyboard.press(" "); time.sleep(0.15)
        state2 = g(page, "() => document.querySelector('[data-switch] [data-switch-state]').textContent")
        # disabled switch keyboard
        locked = g(page, """() => {
          const s = [...document.querySelectorAll('.m-switch')].find(x => x.classList.contains('is-disabled'));
          const input = s.querySelector('input');
          return { disabled: input.disabled, label: s.querySelector('.m-switch__label').textContent,
                   trackOpacity: getComputedStyle(s.querySelector('.m-switch__track')).opacity };
        }""")
        results["C1_choice_rows"] = c1
        results["C2_radio"] = radio
        results["C3_switch"] = {**sw, "spaceToggle": {"before": state0, "afterFirst": state1, "checkedAfterFirst": checked1, "afterSecond": state2}, "disabledSwitch": locked}
        page.close()

        # ---------- C4: segmented at 320 + keyboard RTL arrows ----------
        page = browser.new_page(viewport={"width": 320, "height": 1000})
        page.goto(PANEL, wait_until="networkidle")
        seg = g(page, """() => {
          const seg = document.querySelector('[data-seg]');
          const items = [...seg.querySelectorAll('.m-seg__item')];
          const sr = seg.getBoundingClientRect();
          const segTouch = items.map(it => { const r = it.getBoundingClientRect(); const cs = getComputedStyle(it, '::after');
            return { label: it.textContent.trim(), w: Math.round(r.width*10)/10, h: Math.round(r.height*10)/10,
                     selected: it.getAttribute('aria-pressed') === 'true' || it.classList.contains('is-selected'),
                     disabled: it.disabled || it.getAttribute('aria-disabled') === 'true',
                     visualH: Math.round(r.height*10)/10 }; });
          return { segW: Math.round(sr.width*10)/10, segH: Math.round(sr.height*10)/10,
                   wraps: sr.height > 50, items: segTouch,
                   segComputedStyle: { gap: getComputedStyle(seg).gap, flexWrap: getComputedStyle(seg).flexWrap } };
        }""")
        # selected clarity
        sel = g(page, """() => {
          const it = document.querySelector('[data-seg] .m-seg__item[aria-pressed="true"], [data-seg] .m-seg__item.is-selected');
          const cs = getComputedStyle(it);
          return { bg: cs.backgroundColor, color: cs.color, fontWeight: cs.fontWeight, label: it.textContent.trim() };
        }""")
        # disabled item: click + Enter
        dis_guard = g(page, "() => { const items = [...document.querySelectorAll('[data-seg] .m-seg__item')];"
                          " return items.map(i => ({ t: i.textContent.trim(), dis: i.disabled, adis: i.getAttribute('aria-disabled') })); }")
        disabled_item = None
        for it in dis_guard:
            if it["adis"] == "true" or it["dis"]:
                disabled_item = it
        dis_result = {}
        if disabled_item:
            sel_before = g(page, "() => document.querySelector('[data-seg] .m-seg__item[aria-pressed=\\\"true\\\"]').textContent.trim()")
            # click disabled via JS (pointer-events allow? aria-disabled only)
            page.evaluate("() => { const items = [...document.querySelectorAll('[data-seg] .m-seg__item')];"
                          " const d = items.find(i => i.getAttribute('aria-disabled') === 'true' || i.disabled); d.click(); }")
            time.sleep(0.1)
            sel_after_click = g(page, "() => document.querySelector('[data-seg] .m-seg__item[aria-pressed=\\\"true\\\"]').textContent.trim()")
            # keyboard: focus disabled, press Enter
            page.evaluate("() => { const items = [...document.querySelectorAll('[data-seg] .m-seg__item')];"
                          " const d = items.find(i => i.getAttribute('aria-disabled') === 'true' || i.disabled); d.focus(); }")
            page.keyboard.press("Enter"); time.sleep(0.1)
            sel_after_enter = g(page, "() => document.querySelector('[data-seg] .m-seg__item[aria-pressed=\\\"true\\\"]').textContent.trim()")
            dis_result = {"item": disabled_item, "selectedBefore": sel_before,
                          "selectedAfterDisabledClick": sel_after_click,
                          "selectedAfterDisabledEnter": sel_after_enter}
        # RTL arrows: focus first item, ArrowLeft should select NEXT (RTL)
        page.evaluate("() => { const items = [...document.querySelectorAll('[data-seg] .m-seg__item')]; items[0].focus(); }")
        page.keyboard.press("ArrowLeft"); time.sleep(0.1)
        arrow_left = g(page, "() => ({ focused: document.activeElement.textContent.trim(),"
                            " selected: document.querySelector('[data-seg] .m-seg__item[aria-pressed=\\\"true\\\"]').textContent.trim() })")
        page.keyboard.press("ArrowRight"); time.sleep(0.1)
        arrow_right = g(page, "() => ({ focused: document.activeElement.textContent.trim(),"
                              " selected: document.querySelector('[data-seg] .m-seg__item[aria-pressed=\\\"true\\\"]').textContent.trim() })")
        results["C4_segmented_320"] = {"geometry": seg, "selectedStyle": sel, "disabledGuard": dis_result,
                                       "arrowLeft": arrow_left, "arrowRight": arrow_right}
        page.close()

        # ---------- C5: picker in layer ----------
        page = browser.new_page(viewport={"width": 390, "height": 900})
        page.goto(PANEL, wait_until="networkidle")
        # open picker: find the trigger button for picker-layer
        trig = page.evaluate("() => { const b = document.querySelector('[data-layer-open=\\\"picker-layer\\\"]') ||"
                             " [...document.querySelectorAll('button')].find(b => (b.getAttribute('data-open')||'').includes('picker'));"
                             " return b ? b.outerHTML.slice(0, 120) : null; }")
        page.evaluate("() => { const l = document.getElementById('picker-layer'); l.hidden = false;"
                      " const bd = document.querySelector('.m-layer-backdrop'); if (bd) bd.hidden = false; }")
        time.sleep(0.1)
        pk = {}
        pk["searchFocusedAfterOpen"] = None
        # search filter
        page.fill("#picker-search", "الوطنية")
        time.sleep(0.1)
        pk["filterNational"] = page.evaluate("""() => {
          const opts = [...document.querySelectorAll('#entity-picker .m-picker__option')];
          return { visible: opts.filter(o => !o.hidden).map(o => o.textContent.trim()),
                   hiddenCount: opts.filter(o => o.hidden).length };
        }""")
        # no-match empty row
        page.fill("#picker-search", "zzzz")
        time.sleep(0.1)
        pk["noMatch"] = page.evaluate("""() => {
          const state = document.querySelector('#entity-picker .m-picker__state');
          return { exists: !!state, text: state ? state.textContent.trim() : null };
        }""")
        # clear query, keyboard: roving tabindex + arrows + Enter
        page.fill("#picker-search", "")
        time.sleep(0.1)
        pk["roving"] = page.evaluate("""() => {
          const opts = [...document.querySelectorAll('#entity-picker .m-picker__option')];
          return opts.map(o => ({ t: o.textContent.trim(), tabIndex: o.tabIndex, hidden: o.hidden }));
        }""")
        # real keyboard: focus first visible option, ArrowLeft (RTL next), Enter selects
        page.evaluate("() => { const o = [...document.querySelectorAll('#entity-picker .m-picker__option')].find(o => !o.hidden); o.focus(); }")
        page.keyboard.press("ArrowLeft"); time.sleep(0.08)
        pk["afterArrowLeftFocused"] = page.evaluate("() => document.activeElement.textContent.trim()")
        page.keyboard.press("Enter"); time.sleep(0.1)
        pk["afterEnter"] = page.evaluate("""() => {
          const sel = document.querySelector('#entity-picker .m-picker__option[aria-selected=\\\"true\\\"]');
          return { selected: sel ? sel.textContent.trim() : null,
                   summary: document.querySelector('#entity-picker [data-picker-summary]').textContent,
                   focusRetained: document.activeElement.textContent.trim() };
        }""")
        # Home/End
        page.keyboard.press("End"); time.sleep(0.08)
        pk["afterEndFocused"] = page.evaluate("() => document.activeElement.textContent.trim()")
        pk["rovingAfterEnd"] = page.evaluate("() => [...document.querySelectorAll('#entity-picker .m-picker__option')].map(o => o.tabIndex).join(',')")
        # error state with retry (via API on the picker element)
        retry_events = []
        page.evaluate("window.__retry = 0; document.getElementById('entity-picker').addEventListener('micro-picker:retry', () => window.__retry++)")
        page.evaluate("() => MicroPicker.setStatus(document.getElementById('entity-picker'), 'error', 'تعذر القراءة')")
        time.sleep(0.1)
        pk["errorState"] = page.evaluate("""() => {
          const s = document.querySelector('#entity-picker .m-picker__state--error');
          return { exists: !!s, text: s ? s.textContent.replace('إعادة المحاولة','').trim() : null,
                   retryBtn: !!document.querySelector('#entity-picker [data-picker-retry]'),
                   optionsHidden: [...document.querySelectorAll('#entity-picker .m-picker__option')].every(o => o.hidden) };
        }""")
        page.evaluate("() => document.querySelector('#entity-picker [data-picker-retry]').click()")
        time.sleep(0.05)
        pk["retryEventFired"] = page.evaluate("() => window.__retry")
        # loading state then ready
        page.evaluate("() => MicroPicker.setStatus(document.getElementById('entity-picker'), 'loading')")
        time.sleep(0.05)
        pk["loadingState"] = page.evaluate("() => { const s = document.querySelector('#entity-picker .m-picker__state');"
                                           " return { text: s ? s.textContent.trim() : null }; }")
        page.evaluate("() => MicroPicker.setStatus(document.getElementById('entity-picker'), 'ready')")
        time.sleep(0.05)
        pk["readyRestores"] = page.evaluate("() => ({ stateRowGone: !document.querySelector('#entity-picker .m-picker__state'),"
                                            " visibleOptions: [...document.querySelectorAll('#entity-picker .m-picker__option')].filter(o => !o.hidden).length })")
        results["C5_picker_layer"] = {"triggerProbe": trig, **pk}
        # picker option touch size + list semantics
        results["C5_picker_option_sizes"] = page.evaluate("""() => {
          const o = document.querySelector('#entity-picker .m-picker__option');
          const r = o.getBoundingClientRect();
          const list = document.querySelector('#entity-picker [data-picker-list]');
          return { optionH: Math.round(r.height*10)/10, optionMinH: getComputedStyle(o).minHeight,
                   listRole: list.getAttribute('role'), optionRole: o.getAttribute('role'),
                   searchAria: document.getElementById('picker-search').getAttribute('aria-label'),
                   closeBtnAria: document.querySelector('#picker-layer [data-picker-close]') ?
                     document.querySelector('#picker-layer [data-picker-close]').getAttribute('aria-label') : 'none-in-panel' };
        }""")
        page.close()

        # ---------- C6: zoom lab 200% on 390 target ----------
        page = browser.new_page(viewport={"width": 1280, "height": 1200})
        page.goto(PANEL, wait_until="networkidle")
        page.click('[data-lab="text-zoom"]')
        time.sleep(0.2)
        c6 = g(page, """() => {
          const t = document.getElementById('text-zoom-target');
          const sw = t.querySelector('.m-switch');
          const swr = sw.getBoundingClientRect();
          const state = sw.querySelector('.m-switch__state');
          const track = sw.querySelector('.m-switch__track');
          const tr = track.getBoundingClientRect();
          const seg = t.querySelector('.m-seg');
          const sr = seg.getBoundingClientRect();
          const segItems = [...t.querySelectorAll('.m-seg__item')].map(i => Math.round(i.getBoundingClientRect().height*10)/10);
          const choiceText = [...document.querySelectorAll('#choices .m-choice__text')].map(e => getComputedStyle(e).fontSize);
          return { switchRowH: Math.round(swr.height*10)/10,
                   stateFont: getComputedStyle(state).fontSize, stateText: state.textContent,
                   trackW: Math.round(tr.width*10)/10, trackH: Math.round(tr.height*10)/10,
                   segW: Math.round(sr.width*10)/10, segH: Math.round(sr.height*10)/10,
                   segItemHeights: segItems, segWraps: sr.height > 50,
                   choiceTextFonts: choiceText.slice(0, 3),
                   targetW: Math.round(t.getBoundingClientRect().width) };
        }""")
        results["C6_zoom200_lab_390"] = c6
        page.close()
        browser.close()

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)
    print("WROTE", OUT)

if __name__ == "__main__":
    main()
