#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
الوكيل 5 — المراجع المستقل (جولة SAMSUNG-ONEUI-REPAIR-R1)
سكربت تحقق واحد A..I — قياسات مستقلة على الشجرة الحالية (رأس eacfe8a + إصلاحات الجولة)
بلا أي تعديل مصدر. يكتب JSON في checks/ ويطبع ملخصًا ويلتقط لقطات في screenshots/.

البيئة: Playwright + chromium المثبت (/home/z/my-project/evidence/bin/chromium)
+ خادم ThreadingHTTPServer خاص على 4500 يقدم جذر المستودع.
محاكاة 200% = مروران (ZOOM2_CLEAN): قياس الخط المرجعي ثم مضاعفة computed font-size وإعادة القياس.
"""

import json
import subprocess
import threading
import traceback
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

SCRIPT = Path(__file__).resolve()
REPO = SCRIPT.parents[5]            # جذر المستودع micro-ui-design-system
EVID = SCRIPT.parents[1]            # evidence/agent5
SHOTS = EVID / "screenshots"
CHECKS = EVID / "checks"
SHOTS.mkdir(parents=True, exist_ok=True)
CHECKS.mkdir(parents=True, exist_ok=True)

CHROMIUM = "/home/z/my-project/evidence/bin/chromium"
PORT_RANGE = range(4500, 4520)      # نطاق الوكيل 5
RESULTS = {"meta": {}, "checks": {}}


# ---------------------------------------------------------------- خادم خاص
def serve_repo(port):
    class H(SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    srv = None
    for p in [port] + [x for x in PORT_RANGE if x != port]:
        try:
            srv = ThreadingHTTPServer(("127.0.0.1", p), partial(H, directory=str(REPO)))
            break
        except OSError:
            continue
    if srv is None:
        raise RuntimeError("لا منفذ متاح في نطاق 4500-4519")
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return f"http://127.0.0.1:{srv.server_address[1]}", srv


# ------------------------------------- محاكاة 200% بمرورين (نمط ZOOM2_CLEAN)
ZOOM2_CLEAN = """() => {
  const els = [document.body].concat([...document.body.querySelectorAll('*')]);
  const orig = els.map((el) => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
  orig.forEach((it) => { if (it.el.dataset.r2z === undefined) { it.el.dataset.r2z = '1'; it.el.style.fontSize = (it.fs * 2) + 'px'; } });
  return orig.length;
}"""


def zoom2(page, wait=500):
    n = page.evaluate(ZOOM2_CLEAN)
    page.wait_for_timeout(wait)
    return n


# ---------------------------------------------------------------- أدوات عامة
def new_page(browser, w, h):
    ctx = browser.new_context(viewport={"width": w, "height": h})
    page = ctx.new_page()
    page.set_default_timeout(12000)
    return ctx, page


def f03_login(page, base):
    """دخول حقيقي عبر بوابة الوصول — أي بريد صالح وأي كلمة مرور (محاكاة حتمية 600ms)."""
    page.goto(base + "/previews/ux-patterns/mobile-record-sample/")
    page.wait_for_selector("[data-access-gateway]")
    page.fill("#f03-gw-email", "a5.verify@shop.example")
    page.fill("#f03-gw-password", "a5-verify-pass")
    page.click("#f03-gw-submit")
    try:
        page.wait_for_selector("#view-home:not([hidden])", timeout=9000)
        return {"ok": True, "submitText": page.eval_on_selector(
            "#f03-gw-submit", "el => el.textContent.trim()")}
    except Exception:
        btn = page.eval_on_selector(
            "[data-access-gateway] button[type=submit]",
            "el => el.textContent.trim()")
        return {"ok": False, "realSubmitText": btn, "error": "gateway wait timeout"}


TOAST_MEASURE = """() => {
  const toast = document.getElementById('f03-toast');
  const textEl = document.getElementById('f03-toast-text');
  const nav = document.getElementById('f03-navbar');
  const tr = toast.getBoundingClientRect();
  const txr = textEl.getBoundingClientRect();
  const nr = nav.getBoundingClientRect();
  const navVisible = !nav.hidden && nr.height > 0 && nr.width > 0;
  const gap = navVisible ? (nr.top - tr.bottom) : null;
  const regions = [...document.querySelectorAll('.m-live-region')];
  const live = regions[0];
  return {
    w: tr.width, h: tr.height, textW: txr.width, textH: txr.height,
    toastText: (textEl.textContent || '').trim(),
    navVisible: navVisible, navH: nr.height, gapToNavbarTop: gap,
    liveRegionCount: regions.length,
    liveRegionText: live ? live.textContent : null,
    liveRegionAriaLive: live ? live.getAttribute('aria-live') : null
  };
}"""

LIVE_MARK_BEFORE = """() => {
  window.__a5liveBefore = {};
  document.querySelectorAll('[aria-live]').forEach((el, i) => {
    const k = el.id || ('idx' + i);
    el.dataset.__a5k = k;
    window.__a5liveBefore[k] = el.textContent;
  });
  return Object.keys(window.__a5liveBefore).length;
}"""

LIVE_DIFF_AFTER = """() => {
  const changed = [], created = [];
  document.querySelectorAll('[aria-live]').forEach((el) => {
    const k = el.dataset.__a5k;
    if (k === undefined) { created.push(el.className || el.id || el.tagName); return; }
    if ((window.__a5liveBefore[k] || '') !== el.textContent) {
      changed.push({ key: k, cls: el.className || '', now: (el.textContent || '').slice(0, 50) });
    }
  });
  return { changedCount: changed.length, changed, createdCount: created.length, created };
}"""


def measure_toast(page, shot_name=None):
    page.wait_for_selector("#f03-toast:not([hidden])", timeout=9000)
    page.wait_for_timeout(350)   # إعلان المنطقة الحية يكتب بعد 50ms
    m = page.evaluate(TOAST_MEASURE)
    d = page.evaluate(LIVE_DIFF_AFTER)
    m["liveChangedExisting"] = d["changedCount"]
    m["liveChangedDetail"] = d["changed"]
    m["liveCreatedNew"] = d["createdCount"]
    if shot_name:
        page.screenshot(path=str(SHOTS / shot_name), full_page=False)
    return m


# ---------------------------------------------------------------- A) SUI-001
def check_A(browser, base):
    """توست F03 عبر مسارين مختلفين عن مسارات الوكلاء الثلاثة السابقة
    (حذف عنصر واحد من تفاصيل أحدث عنصر + حفظ طلب من نموذج الطلب في الجدولة)
    عند 320 و390 و320+200%."""
    out = {}
    for label, w, zoom in [("320", 320, False), ("390", 390, False), ("320-200pct", 320, True)]:
        for path in ["delete-single", "order-save"]:
            key = path + "@" + label
            ctx, page = new_page(browser, w, 844)
            try:
                login = f03_login(page, base)
                if not login["ok"]:
                    out[key] = {"error": "login failed", "login": login}
                    ctx.close(); continue
                page.wait_for_selector("#f03-home-recent .f03-row")
                if zoom:
                    zoom2(page)
                page.evaluate(LIVE_MARK_BEFORE)
                if path == "delete-single":
                    # مسار 1: الرئيسية → أحدث عنصر → تفاصيل → حذف → تأكيد
                    page.click("#f03-home-recent .f03-row")
                    page.wait_for_selector("#view-detail:not([hidden])")
                    page.click("#f03-detail-delete")
                    page.wait_for_selector("#f03-delete-dialog:not([hidden])")
                    page.click("#f03-delete-confirm")
                    shot = ("A-toast-delete-%s.png" % label) if zoom else None
                else:
                    # مسار 2: الرئيسية → الجدولة → إضافة طلب → حفظ
                    page.click("#f03-home-schedule")
                    page.wait_for_selector("#view-schedule:not([hidden])")
                    page.click("#f03-schedule-add")
                    page.wait_for_selector("#f03-order-form-layer:not([hidden])")
                    page.fill("#f03-order-name", "طلب تحقق مستقل 5")
                    save_txt = page.eval_on_selector("#f03-order-save", "el => el.textContent.trim()")
                    page.click("#f03-order-save")
                    shot = ("A-toast-orderform-%s.png" % label) if zoom else None
                m = measure_toast(page, shot)
                m["loginSubmitText"] = login.get("submitText")
                m["zoom200"] = zoom
                if path == "order-save":
                    m["orderSaveButtonText"] = save_txt
                out[key] = m
            except Exception as e:
                out[key] = {"error": repr(e)}
            finally:
                ctx.close()
    # حكم برمجي مبدئي
    ok = True
    for k, v in out.items():
        if "error" in v:
            ok = False; continue
        if not (v["w"] > 0 and v["h"] > 0 and v["textW"] > 0
                and v["liveRegionCount"] == 1
                and (v["toastText"] == v["liveRegionText"])
                and (v["gapToNavbarTop"] is None or v["gapToNavbarTop"] >= 0)):
            ok = False
    return {"measurements": out, "programmaticPass": ok}


# ---------------------------------------------------------------- B) SUI-002
def check_B(browser, base):
    """شريط التحديد الجماعي عند 320: تفعيل التحديد ثم 200% — تراكب مع navbar (توقع 0)
    + مطابقة متغير CSS الديناميكي مع ارتفاع navbar المقيس (±1px)."""
    ctx, page = new_page(browser, 320, 844)
    out = {}
    try:
        login = f03_login(page, base)
        if not login["ok"]:
            out = {"error": "login failed", "login": login}
        else:
            page.click("#f03-home-all")
            page.wait_for_selector("#view-list:not([hidden])")
            page.click("#f03-select-toggle")
            page.wait_for_selector("#f03-select-bar:not([hidden])")
            page.wait_for_timeout(400)

            def bar_measure():
                return page.evaluate("""() => {
                  const nav = document.getElementById('f03-navbar');
                  const bar = document.getElementById('f03-select-bar');
                  const nr = nav.getBoundingClientRect(), br = bar.getBoundingClientRect();
                  const v = getComputedStyle(document.documentElement).getPropertyValue('--f03-navbar-h');
                  const interTop = Math.max(nr.top, br.top);
                  const interBot = Math.min(nr.bottom, br.bottom);
                  return {
                    navH: nr.height, barH: br.height, barBottom: br.bottom, navTop: nr.top,
                    overlap: Math.max(0, interBot - interTop),
                    cssVar: (v || '').trim(), varPx: parseFloat(v) || 0,
                    navVisible: !nav.hidden && nr.height > 0
                  };
                }""")
            out["at1x"] = bar_measure()
            page.screenshot(path=str(SHOTS / "B-selectbar-320-1x.png"))
            zoom2(page, wait=700)
            out["at200pct"] = bar_measure()
            page.screenshot(path=str(SHOTS / "B-selectbar-320-200pct.png"))
            v = out["at200pct"]
            out["programmaticPass"] = bool(
                v["overlap"] == 0 and abs(v["varPx"] - v["navH"]) <= 1)
    except Exception as e:
        out["error"] = repr(e)
    finally:
        ctx.close()
    return out


# ---------------------------------------------------------------- C) SUI-003
def check_C(browser, base):
    """لون حالة المفتاح (.m-switch__state) في /previews/selection/
    بالترتيب الرسمي ثم تركيب معكوس بJavaScript (نقل input/track قبل النص)
    ثم إعادة النص آخرًا — توقع نفس اللون في الحالتين (بترولي rgb(22, 77, 89) عند checked)."""
    ctx, page = new_page(browser, 390, 844)
    out = {}
    try:
        page.goto(base + "/previews/selection/")
        page.wait_for_selector(".m-switch")
        out = page.evaluate("""() => {
          const sws = [...document.querySelectorAll('.m-switch')].filter(
            s => !s.classList.contains('is-disabled') && s.querySelector('input[type="checkbox"]'));
          const res = [];
          for (const s of sws.slice(0, 3)) {
            const input = s.querySelector('input[type="checkbox"]');
            const state = s.querySelector('.m-switch__state');
            const text = s.querySelector('.m-switch__text');
            if (!input || !state || !text) continue;
            const orderOf = () => [...s.children].map(c => c.tagName.toLowerCase()).join(',');
            const restore = [...s.children].slice();
            const c1 = getComputedStyle(state).color;
            const order1 = orderOf();
            // معاكس: نقل input وtrack قبل النص
            s.insertBefore(input, text);
            const track = s.querySelector('.m-switch__track');
            if (track) s.insertBefore(track, text);
            const c2 = getComputedStyle(state).color;
            const order2 = orderOf();
            // إعادة الترتيب الأصلي ثم وضع input/track في النهاية (النص أولًا رسميًا معكوسًا)
            restore.forEach(c => s.appendChild(c));
            const c3 = getComputedStyle(state).color;
            const order3 = orderOf();
            res.push({
              checked: input.checked,
              stateText: state.textContent.trim(),
              colorOfficial: c1, colorInverse: c2, colorRestored: c3,
              orderOfficial: order1, orderInverse: order2, orderRestored: order3
            });
          }
          return { switches: res };
        }""")
        sw = out.get("switches", [])
        out["programmaticPass"] = bool(sw) and all(
            s["colorOfficial"] == s["colorInverse"] == s["colorRestored"] for s in sw)
        on = [s for s in sw if s["checked"]]
        if on:
            out["checkedColor"] = on[0]["colorOfficial"]
            out["checkedStateText"] = on[0]["stateText"]
        off = [s for s in sw if not s["checked"]]
        if off:
            out["uncheckedColor"] = off[0]["colorOfficial"]
            out["uncheckedStateText"] = off[0]["stateText"]
    except Exception as e:
        out["error"] = repr(e)
    finally:
        ctx.close()
    return out


# ---------------------------------------------------------------- D) SUI-004/005
def check_D(browser, base):
    """الحقول في /previews/fields/: كمية «9999» ومبلغ 15 خانة عند 320+200%
    — scrollWidth مقابل clientWidth + عرض النص عبر canvas بخط العنصر + لف الصف."""
    ctx, page = new_page(browser, 320, 844)
    out = {}
    try:
        page.goto(base + "/previews/fields/")
        page.wait_for_selector("#t-qty")
        out["qty1xOffsetW"] = page.eval_on_selector("#t-qty", "el => el.offsetWidth")
        page.fill("#t-qty", "9999")
        page.fill("#t-amount", "1234567890123456")
        page.evaluate("() => { const a = document.activeElement; if (a) a.blur(); }")
        out["amtLiteralFilled"] = "1234567890123456"  # حرفي الخطة (16 خانة رقمية)
        zoom2(page)
        out["at200pct"] = page.evaluate("""() => {
          const qty = document.getElementById('t-qty');
          const amt = document.getElementById('t-amount');
          const fontOf = (el) => {
            const cs = getComputedStyle(el);
            return cs.fontSize + ' ' + cs.fontFamily;
          };
          const measure = (el, text) => {
            const c = document.createElement('canvas').getContext('2d');
            c.font = fontOf(el);
            return Math.round(c.measureText(text).width * 10) / 10;
          };
          const inp = (el) => {
            const ctl = el.closest('.m-field__control');
            const unit = ctl ? ctl.querySelector('.m-field__unit') : null;
            return {
              value: el.value, clientW: el.clientWidth, scrollW: el.scrollWidth,
              textW: measure(el, el.value),
              ctlClientW: ctl ? ctl.clientWidth : null,
              ctlScrollW: ctl ? ctl.scrollWidth : null,
              unitClientW: unit ? unit.clientWidth : null,
              unitScrollW: unit ? unit.scrollWidth : null
            };
          };
          return {
            qty: inp(qty), amt: inp(amt),
            pageScrollW: document.documentElement.scrollWidth,
            pageClientW: document.documentElement.clientWidth
          };
        }""")
        page.screenshot(path=str(SHOTS / "D-fields-320-200pct.png"), full_page=False)
        # قياس ثانوي بمبلغ 15 خانة (لمطابقة رقم الوكيل 2 الموثق: scroll=288 عند 200%)
        page.fill("#t-amount", "123456789012345")
        page.evaluate("() => { const a = document.activeElement; if (a) a.blur(); }")
        out["at200pct_15digits"] = page.evaluate("""() => {
          const amt = document.getElementById('t-amount');
          const c = document.createElement('canvas').getContext('2d');
          const cs = getComputedStyle(amt);
          c.font = cs.fontSize + ' ' + cs.fontFamily;
          return { value: amt.value, clientW: amt.clientWidth, scrollW: amt.scrollWidth,
                   textW: Math.round(c.measureText(amt.value).width * 10) / 10 };
        }""")
        q = out["at200pct"]["qty"]; a = out["at200pct"]["amt"]
        out["qtyPass"] = bool(q["scrollW"] <= q["clientW"])
        out["amtRowWrapPass"] = bool(
            a["ctlScrollW"] <= a["ctlClientW"] + 0.5
            and (a["unitScrollW"] is None or a["unitScrollW"] <= a["unitClientW"] + 0.5)
            and out["at200pct"]["pageScrollW"] <= out["at200pct"]["pageClientW"] + 0.5)
        out["amtValueCompleteInDom"] = a["value"] == "1234567890123456"
    except Exception as e:
        out["error"] = repr(e)
    finally:
        ctx.close()
    return out


# ---------------------------------------------------------------- E) SUI-011
def check_E(browser, base):
    """المقاطع في /previews/selection/ عند 320+200% حتى الالتفاف:
    فجوة عمودية بين الأهداف الموسعة (rect + امتداد 4px) توقع ≥4px
    + elementFromPoint في منتصف الفجوة لا يرجع زرًا (12 نقطة)."""
    ctx, page = new_page(browser, 320, 844)
    out = {}
    try:
        page.goto(base + "/previews/selection/")
        page.wait_for_selector(".m-seg")
        zoom2(page)
        out = page.evaluate("""() => {
          const segs = [...document.querySelectorAll('.m-seg')];
          const ext = 4;
          for (const seg of segs) {
            const items = [...seg.querySelectorAll('.m-seg__item')];
            if (items.length < 2) continue;
            const rects = items.map(b => b.getBoundingClientRect());
            const tops = rects.map(r => r.top);
            const row1Top = Math.min(...tops);
            const row1 = rects.filter(r => Math.abs(r.top - row1Top) < 5);
            const rest = rects.filter(r => Math.abs(r.top - row1Top) >= 5);
            if (!row1.length || !rest.length) continue;   // لا التفاف
            const row2Top = Math.min(...rest.map(r => r.top));
            const row2 = rest.filter(r => Math.abs(r.top - row2Top) < 5);
            const r1maxBottom = Math.max(...row1.map(r => r.bottom));
            const r2minTop = Math.min(...row2.map(r => r.top));
            const visualRowGap = r2minTop - r1maxBottom;
            const expandedGap = (r2minTop - ext) - (r1maxBottom + ext);
            /* إدخال المقطع في مجال الرؤية قبل hit-test (elementFromPoint يعمل بإحداثيات
               viewport — نقاط خارج الشاشة ترجع null بلا معنى) */
            seg.scrollIntoView({ block: 'center' });
            const rects2 = items.map(b => b.getBoundingClientRect());
            const tops2 = rects2.map(r => r.top);
            const row1Top2 = Math.min(...tops2);
            const row1b = rects2.filter(r => Math.abs(r.top - row1Top2) < 5);
            const rest2 = rects2.filter(r => Math.abs(r.top - row1Top2) >= 5);
            const row2Top2 = Math.min(...rest2.map(r => r.top));
            const row2b = rest2.filter(r => Math.abs(r.top - row2Top2) < 5);
            const r1maxBottom2 = Math.max(...row1b.map(r => r.bottom));
            const r2minTop2 = Math.min(...row2b.map(r => r.top));
            const segRect = seg.getBoundingClientRect();
            const y = ((r1maxBottom2 + ext) + (r2minTop2 - ext)) / 2;
            const inViewport = y > 0 && y < window.innerHeight;
            const samples = [];
            for (let i = 0; i < 12; i++) {
              const x = segRect.left + 4 + (i * (segRect.width - 8)) / 11;
              const el = document.elementFromPoint(x, y);
              const btn = el && el.closest ? el.closest('.m-seg__item') : null;
              samples.push({
                x: Math.round(x), y: Math.round(y),
                hitButton: !!btn,
                hitEl: btn ? btn.textContent.trim() : (el ? el.tagName + '.' + (el.className || '') : 'null')
              });
            }
            const btnHits = samples.filter(s => s.hitButton).length;
            return {
              found: true, segLabel: seg.getAttribute('aria-label') || seg.id || '(بلا تسمية)',
              itemCount: items.length, rows: 2 + Math.max(0, [...new Set(rects.map(r => Math.round(r.top)))].length - 2),
              visualRowGap: Math.round(visualRowGap * 100) / 100,
              expandedGap: Math.round(expandedGap * 100) / 100,
              segRect: { left: Math.round(segRect.left), width: Math.round(segRect.width) },
              hitTestButtonHits: btnHits, inViewport: inViewport, samples: samples
            };
          }
          return { found: false };
        }""")
        if out.get("found"):
            out["gapPass"] = bool(out["expandedGap"] >= 4)
            out["hitPass"] = bool(out["hitTestButtonHits"] == 0 and out["inViewport"])
            out["programmaticPass"] = out["gapPass"] and out["hitPass"]
            out["hitSamplesInViewport"] = out["inViewport"]
        else:
            out["fallbackNote"] = "لم يلتف أي م-seg في لوحة selection عند 320+200%"
        page.screenshot(path=str(SHOTS / "E-seg-wrapped-320-200pct.png"))
    except Exception as e:
        out["error"] = repr(e)
    finally:
        ctx.close()
    return out


# ---------------------------------------------------------------- F) SUI-012
def check_F(browser, base):
    """الإعلان في /previews/messages/: ev-a مرتين (فاصل 300ms) ثم ev-b مستقل
    — توقع تحديثان فقط؛ ثم بدون id مرتين متتاليتين — قياس وتوثيق السلوك الفعلي."""
    ctx, page = new_page(browser, 390, 844)
    out = {}
    try:
        page.goto(base + "/previews/messages/")
        page.wait_for_selector("body")
        has = page.evaluate(
            "() => typeof window.MicroMessages === 'object' && typeof window.MicroMessages.announce === 'function'")
        out["microMessagesAvailable"] = has
        if not has:
            out["error"] = "window.MicroMessages.announce غير متاح"
            return out
        page.evaluate("""() => {
          window.__a5f = { added: 0, removed: 0 };
          const mo = new MutationObserver((muts) => {
            for (const m of muts) {
              const t = m.target;
              if (t && t.classList && t.classList.contains('m-live-region')) {
                window.__a5f.added += m.addedNodes.length;
                window.__a5f.removed += m.removedNodes.length;
              }
            }
          });
          mo.observe(document.body, { childList: true, subtree: true, characterData: true });
        }""")
        # التسلسل 1: ev-a ثم تكراره ثم ev-b مستقل
        page.evaluate("a => window.MicroMessages.announce(a.text, a.opts)",
                      {"text": "نص التحقق", "opts": {"id": "ev-a"}})
        page.wait_for_timeout(400)
        page.evaluate("a => window.MicroMessages.announce(a.text, a.opts)",
                      {"text": "نص التحقق", "opts": {"id": "ev-a"}})
        page.wait_for_timeout(300)
        page.evaluate("a => window.MicroMessages.announce(a.text, a.opts)",
                      {"text": "نص التحقق", "opts": {"id": "ev-b"}})
        page.wait_for_timeout(450)
        out["seqWithId"] = dict(page.evaluate(
            "() => ({ added: window.__a5f.added, removed: window.__a5f.removed, regionText: document.querySelector('.m-live-region') ? document.querySelector('.m-live-region').textContent : null })"))
        # التسلسل 2: بدون id مرتين متتاليتين (توثيق السلوك الفعلي)
        page.evaluate("() => { window.__a5f.added = 0; window.__a5f.removed = 0; }")
        page.evaluate("a => window.MicroMessages.announce(a.text)",
                      {"text": "إعلان بلا معرف"})
        page.wait_for_timeout(400)
        page.evaluate("a => window.MicroMessages.announce(a.text)",
                      {"text": "إعلان بلا معرف"})
        page.wait_for_timeout(450)
        out["seqNoId"] = dict(page.evaluate(
            "() => ({ added: window.__a5f.added, removed: window.__a5f.removed, regionText: document.querySelector('.m-live-region') ? document.querySelector('.m-live-region').textContent : null })"))
        out["seqWithIdExpect2"] = out["seqWithId"]["added"] == 2
    except Exception as e:
        out["error"] = repr(e)
    finally:
        ctx.close()
    return out


# ---------------------------------------------------------------- G) SUI-007
PEEK_MEASURE = """() => {
  const strip = document.getElementById('f03-rep-strip');
  const vp = strip.querySelector('[data-info-strip-viewport]');
  const track = strip.querySelector('[data-info-strip-track]');
  const slides = [...track.children];
  const active = slides.find(s => s.getAttribute('aria-hidden') === 'false') || slides[0];
  const tf = getComputedStyle(track).transform;
  const tx = (tf && tf !== 'none') ? (new DOMMatrixReadOnly(tf)).m41 : 0;
  const vr = vp.getBoundingClientRect();
  const card = active.querySelector('.m-info-card') || active;
  const ar = card.getBoundingClientRect();
  return {
    transform: tf, tx: Math.round(tx * 100) / 100,
    slideCount: slides.length, activeIndex: slides.indexOf(active),
    leftInset: Math.round((ar.left - vr.left) * 100) / 100,
    rightInset: Math.round((vr.right - ar.right) * 100) / 100,
    insetDiff: Math.round(Math.abs((ar.left - vr.left) - (vr.right - ar.right)) * 100) / 100,
    vpW: Math.round(vr.width)
  };
}"""


def check_G(browser, base):
    """peek في F03: وجهة التقارير مباشرة بعد تسجيل الدخول (أول كشف، بلا أي تفاعل)
    ثم تغيير viewport 390→320 وقس إعادة التوسيط بلا تفاعل."""
    ctx, page = new_page(browser, 390, 844)
    out = {}
    try:
        login = f03_login(page, base)
        if not login["ok"]:
            out = {"error": "login failed", "login": login}
        else:
            page.click("#f03-nav-reports")
            page.wait_for_selector("#view-reports:not([hidden])")
            page.wait_for_timeout(400)   # rAF + RO عند الكشف
            out["firstReveal390"] = page.evaluate(PEEK_MEASURE)
            page.screenshot(path=str(SHOTS / "G-peek-first-reveal-390.png"))
            page.set_viewport_size({"width": 320, "height": 844})
            page.wait_for_timeout(700)   # RO على عرض viewport بلا أي تفاعل
            out["afterResize320"] = page.evaluate(PEEK_MEASURE)
            page.screenshot(path=str(SHOTS / "G-peek-after-resize-320.png"))
            f = out["firstReveal390"]; r = out["afterResize320"]
            out["programmaticPass"] = bool(
                f["tx"] != 0 and f["insetDiff"] <= 2 and r["insetDiff"] <= 2)
    except Exception as e:
        out["error"] = repr(e)
    finally:
        ctx.close()
    return out


# ---------------------------------------------------------------- H) SUI-009
def check_H(browser, base):
    """البذرة: المسار الافتراضي في F03 لا يحوي mystery ولا حقنًا؛
    ووضع fixtures=edge في العينة يحوي الحالتين."""
    out = {}
    ctx, page = new_page(browser, 320, 844)
    try:
        login = f03_login(page, base)
        if login["ok"]:
            page.click("#f03-home-schedule")
            page.wait_for_selector("#view-schedule:not([hidden])")
            page.wait_for_timeout(600)
            txt = page.evaluate("() => document.body.textContent")
            out["f03Default"] = {
                "hasMystery": "mystery" in txt,
                "hasInjectionB": "<b>" in txt,
                "hasOdInj": "od-inj" in txt,
                "bodyLen": len(txt)
            }
        else:
            out["f03Default"] = {"error": "login failed", "login": login}
    except Exception as e:
        out["f03Default"] = {"error": repr(e)}
    finally:
        ctx.close()
    ctx, page = new_page(browser, 390, 844)
    try:
        page.goto(base + "/previews/ux-patterns/order-schedule/?fixtures=edge")
        page.wait_for_timeout(1200)
        # عرض قائمة يوم الحقن 2026-10-11 (الحالات الحدية تتطلب عرض القائمة أولًا — كشف الوكيل 4)
        clicked = page.evaluate("""() => {
          const cell = document.querySelector('[data-ocal-date="2026-10-11"]');
          if (cell) { cell.click(); return true; }
          return false;
        }""")
        page.wait_for_timeout(600)
        txt = page.evaluate("() => document.body.textContent")
        out["sampleFixturesEdge"] = {
            "dayPanelOpened": clicked,
            "hasMystery": "mystery" in txt,
            "hasOdInj": "od-inj" in txt,
            "hasInjectionB": "<b>" in txt,
            "hasInjectionTitleText": "طلب <b>عنوان</b>" in txt,
            "xssArmed": page.evaluate("() => !!window.__xss"),
            "bodyLen": len(txt)
        }
    except Exception as e:
        out["sampleFixturesEdge"] = {"error": repr(e)}
    finally:
        ctx.close()
    fd = out.get("f03Default", {}); fe = out.get("sampleFixturesEdge", {})
    out["programmaticPass"] = bool(
        not fd.get("hasMystery") and not fd.get("hasInjectionB")
        and fe.get("hasMystery") and (fe.get("hasOdInj") or fe.get("hasInjectionB")))
    return out


# ---------------------------------------------------------------- I) KEEP
def check_I(browser, base):
    """تحقق KEEP سريع (2 فقط):
    1) أسهم التبويبات تلتف عند الحافة — ملاحظة: F03 نفسه لا يحوي tablist
       (تحقق grep)؛ الفحص على اللوحة المالكة للعقد /previews/navigation/.
    2) زر أساسي 48px في /previews/buttons/."""
    out = {}
    ctx, page = new_page(browser, 390, 844)
    try:
        page.goto(base + "/previews/navigation/")
        page.wait_for_selector("[data-tabs][role='tablist']")
        before = page.evaluate("""() => {
          const tl = document.querySelector("[data-tabs][role='tablist']");
          const tabs = [...tl.querySelectorAll("[role='tab']")];
          const sel = () => tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
          const i = sel();
          tabs[i].focus();
          return { count: tabs.length, selectedIndex: i, selectedId: tabs[i].id,
                   focusedId: document.activeElement.id };
        }""")
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(300)
        after = page.evaluate("""() => {
          const tl = document.querySelector("[data-tabs][role='tablist']");
          const tabs = [...tl.querySelectorAll("[role='tab']")];
          const sel = () => tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
          return { selectedIndex: sel(), selectedId: tabs[sel()].id,
                   focusedId: document.activeElement.id };
        }""")
        n = before["count"]
        out["tabsWrap"] = {
            "before": before, "after": after,
            "expectedIndex": (before["selectedIndex"] + 1) % n,
            "wrapped": after["selectedIndex"] == ((before["selectedIndex"] + 1) % n),
            "note": "F03 لا يحوي tablist (grep) — الفحص على /previews/navigation/ مالكة العقد"
        }
    except Exception as e:
        out["tabsWrap"] = {"error": repr(e)}
    finally:
        ctx.close()
    ctx, page = new_page(browser, 390, 844)
    try:
        page.goto(base + "/previews/buttons/")
        page.wait_for_selector(".m-btn--primary")
        out["primaryButton48"] = page.evaluate("""() => {
          const b = document.querySelector('.m-btn--primary');
          const r = b.getBoundingClientRect();
          const cs = getComputedStyle(b);
          return { text: b.textContent.trim(), height: Math.round(r.height * 100) / 100,
                   width: Math.round(r.width * 100) / 100, minHeight: cs.minHeight,
                   pass: r.height >= 48 };
        }""")
    except Exception as e:
        out["primaryButton48"] = {"error": repr(e)}
    finally:
        ctx.close()
    return out


# ---------------------------------------------------------------- تشغيل
def git_meta():
    try:
        head = subprocess.run(["git", "rev-parse", "HEAD"], cwd=str(REPO),
                              capture_output=True, text=True, timeout=10).stdout.strip()
        dirty = subprocess.run(["git", "status", "-s"], cwd=str(REPO),
                               capture_output=True, text=True, timeout=10).stdout
        return {"head": head, "dirtyFiles": len([l for l in dirty.splitlines() if l.strip()])}
    except Exception as e:
        return {"error": repr(e)}


def main():
    base, srv = serve_repo(4500)
    RESULTS["meta"] = {
        "runAtUtc": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        "git": git_meta(),
        "serverPort": base.split(":")[-1],
        "zoom200Mechanism": "مروران (ZOOM2_CLEAN): مضاعفة computed font-size لكل العناصر ثم إعادة القياس",
        "independentAgent": "الوكيل 5 — المراجع المستقل (لا يعدل المصدر)",
    }
    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            headless=True, executable_path=CHROMIUM,
            args=["--no-sandbox", "--disable-dev-shm-usage"])
        RESULTS["meta"]["chromium"] = browser.version
        try:
            RESULTS["checks"]["A_SUI001_toast"] = check_A(browser, base)
            print("[A] SUI-001 toast:", "PASS" if RESULTS["checks"]["A_SUI001_toast"].get("programmaticPass") else "CHECK")
            RESULTS["checks"]["B_SUI002_selectbar"] = check_B(browser, base)
            print("[B] SUI-002 selectbar:", "PASS" if RESULTS["checks"]["B_SUI002_selectbar"].get("programmaticPass") else "CHECK")
            RESULTS["checks"]["C_SUI003_switch"] = check_C(browser, base)
            print("[C] SUI-003 switch:", "PASS" if RESULTS["checks"]["C_SUI003_switch"].get("programmaticPass") else "CHECK")
            RESULTS["checks"]["D_SUI004005_fields"] = check_D(browser, base)
            print("[D] SUI-004/005 fields: qty", "PASS" if RESULTS["checks"]["D_SUI004005_fields"].get("qtyPass") else "CHECK",
                  "| amt row", "PASS" if RESULTS["checks"]["D_SUI004005_fields"].get("amtRowWrapPass") else "CHECK")
            RESULTS["checks"]["E_SUI011_seg"] = check_E(browser, base)
            print("[E] SUI-011 seg:", "PASS" if RESULTS["checks"]["E_SUI011_seg"].get("programmaticPass") else "CHECK")
            RESULTS["checks"]["F_SUI012_announce"] = check_F(browser, base)
            print("[F] SUI-012 announce:", "PASS" if RESULTS["checks"]["F_SUI012_announce"].get("seqWithIdExpect2") else "CHECK")
            RESULTS["checks"]["G_SUI007_peek"] = check_G(browser, base)
            print("[G] SUI-007 peek:", "PASS" if RESULTS["checks"]["G_SUI007_peek"].get("programmaticPass") else "CHECK")
            RESULTS["checks"]["H_SUI009_seed"] = check_H(browser, base)
            print("[H] SUI-009 seed:", "PASS" if RESULTS["checks"]["H_SUI009_seed"].get("programmaticPass") else "CHECK")
            RESULTS["checks"]["I_KEEP"] = check_I(browser, base)
            tw = RESULTS["checks"]["I_KEEP"].get("tabsWrap", {})
            pb = RESULTS["checks"]["I_KEEP"].get("primaryButton48", {})
            print("[I] KEEP tabs wrap:", "PASS" if tw.get("wrapped") else "CHECK",
                  "| primary48:", "PASS" if pb.get("pass") else "CHECK")
        finally:
            browser.close()
    srv.shutdown()
    out_json = CHECKS / "agent5-verify.json"
    out_json.write_text(json.dumps(RESULTS, ensure_ascii=False, indent=2), encoding="utf-8")
    print("\n===== ملخص أرقام الوكيل 5 =====")
    a = RESULTS["checks"]["A_SUI001_toast"]["measurements"]
    for k in sorted(a):
        v = a[k]
        if "error" in v:
            print("A %-28s ERROR %s" % (k, v["error"][:60]))
        else:
            print("A %-28s w=%s h=%s textW=%s gap=%s liveRegions=%s liveChanged=%s text=%r" % (
                k, round(v["w"], 1), round(v["h"], 1), round(v["textW"], 1),
                (round(v["gapToNavbarTop"], 1) if v["gapToNavbarTop"] is not None else "navHidden"),
                v["liveRegionCount"], v["liveChangedExisting"], v["toastText"][:22]))
    b = RESULTS["checks"]["B_SUI002_selectbar"]
    if "at200pct" in b:
        v = b["at200pct"]
        print("B 200%%: overlap=%s var=%s navH=%s |diff|=%s | 1x: overlap=%s var=%s navH=%s" % (
            v["overlap"], v["cssVar"], round(v["navH"], 2), round(abs(v["varPx"] - v["navH"]), 3),
            b["at1x"]["overlap"], b["at1x"]["cssVar"], round(b["at1x"]["navH"], 2)))
    c = RESULTS["checks"]["C_SUI003_switch"]
    print("C switch: checked=%s unchecked=%s inverse=%s (رسمي/معكوس/مستعاد متطابقة: %s)" % (
        c.get("checkedColor"), c.get("uncheckedColor"),
        (c.get("switches") or [{}])[0].get("colorInverse"), c.get("programmaticPass")))
    d = RESULTS["checks"]["D_SUI004005_fields"]
    if "at200pct" in d:
        q, am = d["at200pct"]["qty"], d["at200pct"]["amt"]
        print("D qty: client=%s scroll=%s textW=%s (1x offsetW=%s) | amt: client=%s scroll=%s textW=%s ctl=%s/%s page=%s/%s" % (
            q["clientW"], q["scrollW"], q["textW"], d.get("qty1xOffsetW"),
            am["clientW"], am["scrollW"], am["textW"], am["ctlClientW"], am["ctlScrollW"],
            d["at200pct"]["pageClientW"], d["at200pct"]["pageScrollW"]))
    e = RESULTS["checks"]["E_SUI011_seg"]
    if e.get("found"):
        print("E seg(%s): visualRowGap=%s expandedGap=%s hitHits=%s/12 rows=%s" % (
            e["segLabel"], e["visualRowGap"], e["expandedGap"], e["hitTestButtonHits"], e["rows"]))
    else:
        print("E seg: لم يُعثر على ملفوف —", e.get("fallbackNote") or e.get("error"))
    f = RESULTS["checks"]["F_SUI012_announce"]
    print("F announce: withId updates=%s (توقع 2) region=%r | noId updates=%s region=%r" % (
        f.get("seqWithId", {}).get("added"), (f.get("seqWithId", {}) or {}).get("regionText"),
        f.get("seqNoId", {}).get("added"), (f.get("seqNoId", {}) or {}).get("regionText")))
    g = RESULTS["checks"]["G_SUI007_peek"]
    if "firstReveal390" in g:
        print("G peek 390: tx=%s insets=%s/%s diff=%s | بعد 320: tx=%s insets=%s/%s diff=%s" % (
            g["firstReveal390"]["tx"], g["firstReveal390"]["leftInset"], g["firstReveal390"]["rightInset"], g["firstReveal390"]["insetDiff"],
            g["afterResize320"]["tx"], g["afterResize320"]["leftInset"], g["afterResize320"]["rightInset"], g["afterResize320"]["insetDiff"]))
    h = RESULTS["checks"]["H_SUI009_seed"]
    print("H seed: F03 افتراضي mystery=%s <b>=%s | عينة fixtures: mystery=%s od-inj=%s <b>=%s xss=%s" % (
        h.get("f03Default", {}).get("hasMystery"), h.get("f03Default", {}).get("hasInjectionB"),
        h.get("sampleFixturesEdge", {}).get("hasMystery"), h.get("sampleFixturesEdge", {}).get("hasOdInj"),
        h.get("sampleFixturesEdge", {}).get("hasInjectionB"), h.get("sampleFixturesEdge", {}).get("xssArmed")))
    i = RESULTS["checks"]["I_KEEP"]
    print("I KEEP: tabs %s→%s (متوقع %s) wrapped=%s | primary h=%s" % (
        (i.get("tabsWrap", {}).get("before") or {}).get("selectedIndex"),
        (i.get("tabsWrap", {}).get("after") or {}).get("selectedIndex"),
        i.get("tabsWrap", {}).get("expectedIndex"), i.get("tabsWrap", {}).get("wrapped"),
        (i.get("primaryButton48", {}) or {}).get("height")))
    print("\nJSON:", out_json)
    print("اللقطات:", SHOTS)


if __name__ == "__main__":
    main()
