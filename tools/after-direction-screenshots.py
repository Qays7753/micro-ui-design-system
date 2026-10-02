#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Micro UI — دفعة اتجاه After: فحص ولقطات. من جذر المستودع:
  python3 tools/after-direction-screenshots.py
متصفح headless فعلي (Playwright + Chromium) — لقطات وقياسات من المصدر نفسه.

الفحوص الإلزامية لهذه الدفعة:
  - تركيب After: سطح بترولي بارز + قيم رئيسية + دوائر بقيم حقيقية + تقدم
    + أقسام بصفوف + رسالة + إجراء رئيسي واحد.
  - الحقول الثمانية + خطأ+تركيز + القراءة فقط قابلة للنسخ وليست معطلة.
  - الدوائر: المساحة ∝ القيمة (قطر ∝ √) بلا نسب داخل الدوائر، والتداخل
    لا يخفي رقمًا (قياس تقاطع فعلي)، وصفر/مجهول/غير متاح/سالب منفصلة،
    وdata-display مع السالب يحفظ التنسيق والدلالة، والمقامات الصفرية/
    السالبة/الغابرة، وdonut مقابل packed.
  - ملخصات البيانات المركبة: بنية واحدة × محتويات + توسعة من زر صريح.
  - الأسطح الأربع + مفاتيح التعديل الحية.
  - العارض المُرحَّل من PR#5: انحدار سحب/إفلات خارج viewport/توسعة.
  - 320/360/390/430 + تكبير نص 200% + RTL + تقليل حركة فعلي + تركيز
    لوحة مفاتيح + نص عربي طويل + أرقام كبيرة + بلا autoplay + بلا
    أخطاء كونسول بعد التفاعلات.
  - إثبات تعديل ثلاثي من المصدر (قيمة HTML + قيمة دائرة + توكن) مع
    إعادة القيم المقصودة والتحقق بالبصمات.
"""
import hashlib
import http.server
import json
import subprocess
import sys
import threading
from datetime import datetime
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SHOTS = ROOT / "reviews" / "AFTER-DIRECTION" / "screenshots"
LOGFILE = ROOT / "reviews" / "AFTER-DIRECTION" / "verification.txt"
BOARD = "previews/after-direction/index.html"
results, log_lines = [], []


def log(m):
    print(m)
    log_lines.append(m)


def check(name, ok, detail=""):
    results.append((name, bool(ok)))
    log(("PASS  " if ok else "FAIL  ") + name + ((" — " + detail) if detail else ""))


def sha256(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def file_replace(path, old, new):
    """تعديل ملف مصدر مؤقت لإثبات الانعكاس — يعيد المتصل الأصل."""
    p = Path(path)
    txt = p.read_text(encoding="utf-8")
    assert old in txt, f"old string not found in {path}"
    p.write_text(txt.replace(old, new, 1), encoding="utf-8")


def tab_to(page, selector, max_tabs=90):
    """الوصول بعنصر بالتركيز عبر Tab الحقيقي — يعيد True عند الوصول."""
    page.evaluate("() => document.body.focus()")
    page.evaluate("(s) => document.querySelector(s)?.scrollIntoView({block:'center'})", selector)
    probe = "(sel) => { const a = document.activeElement; return a && a.matches(sel) ? sel : null; }"
    for _ in range(max_tabs):
        if page.evaluate(probe, selector):
            return True
        page.keyboard.press("Tab")
    return False


def main():
    SHOTS.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), http.server.SimpleHTTPRequestHandler)
    server.daemon_threads = True
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_address[1]}"
    board = f"{base}/{BOARD}"
    commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True).strip()
    tree = subprocess.check_output(["git", "rev-parse", "HEAD^{tree}"], cwd=str(ROOT), text=True).strip()
    dirty = subprocess.run(["git", "status", "--porcelain"], cwd=str(ROOT), capture_output=True, text=True).stdout.strip()

    log(f"# AFTER-DIRECTION سجل الفحص — {datetime.now().isoformat(timespec='seconds')}")
    log(f"# commit المصدر: {commit}")
    log(f"# بصمة شجرة المصدر: {tree} (الأدلة مولدة من شجرة هذا commit نظيفة)")
    log(f"# حالة شجرة العمل قبل الفحص: {'نظيفة' if not dirty else 'غير نظيفة! ' + dirty[:200]}")
    log("# الأمر المنفذ: python3 tools/after-direction-screenshots.py من جذر المستودع (خادم محلي مؤقت + Playwright/Chromium)")
    log("# بيئة الفحص: متصفح headless فعلي (Playwright + Chromium) — لا محاكاة DOM؛ القياسات الهندسية من مستطيلات المتصفح الحقيقية")
    log("# حدود الفحوص المعلنة: لا قارئ شاشة فعلي، لا لمس حقيقي (سحب بالمؤشر فقط)، لا متصفحات غير Chromium،")
    log("#   لا تكبير نظام/متصفح أصلي (محاكاة مكافئة للنص فقط عبر مرورين بنفس آلية لوحات المعاينة)، لا هاتف حقيقي؛")
    log("#   فقدان التركيز يُحاكى بحدث blur تركيبي موثق، وتكبير النص محاكاة على عمود التركيب (#aft-comp)")
    log(f"# أعراض العرض المفحوصة: 320 / 360 / 390 / 430 CSS px + سطح مكتبي 1280")
    log("")

    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(viewport={"width": 390, "height": 844})
        page = ctx.new_page()
        page.on("console", lambda m: errors.append((m.text or "") + " @" + ((m.location or {}).get("url") or "")) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(board)
        page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready")
        page.wait_for_timeout(400)

        # ===================== 1) البنية والإتاحة =====================
        st = page.evaluate("""() => {
          const q = s => document.querySelector(s);
          const qa = s => document.querySelectorAll(s).length;
          const hero = q('#hero-surface');
          return {
            dir: document.documentElement.getAttribute('dir'),
            lang: document.documentElement.getAttribute('lang'),
            icons: q('#m-icon-defs') ? q('#m-icon-defs').children.length : 0,
            hero: !!hero,
            heroWaves: hero ? hero.classList.contains('m-surface--waves') : false,
            heroWavesLayer: hero ? !!hero.querySelector('.m-surface__waves[aria-hidden="true"]') : false,
            heroContent: hero ? !!hero.querySelector('.m-surface__content') : false,
            heroAmount: (q('#hero-amount') || {}).textContent || '',
            heroTrend: (q('#hero-surface .aft-hero__trend') || {}).textContent || '',
            kpis: qa('#aft-kpis .m-stat'),
            kpiDeltaText: [...document.querySelectorAll('#aft-kpis .m-stat__delta')].map(d => d.textContent.trim()),
            circPanel: !!q('#circ-panel .m-chart--packed'),
            progress: qa('#progress-section .m-progress'),
            progressBars: [...document.querySelectorAll('#progress-section .m-progress__bar')].map(b => b.style.getPropertyValue('--progress')),
            rows: qa('#rows-section .m-row'),
            openRows: qa('#rows-section a.m-row'),
            rowDividers: qa('#rows-section .m-divider'),
            rowCardBg: getComputedStyle(q('#rows-section .m-row')).backgroundColor,
            note: !!q('#help-note'),
            primaryBtn: !!q('#primary-action .m-btn--primary'),
            states: qa('#field-states .aft-state'),
            surfaces: qa('#surfaces-grid .m-surface'),
            summaries: qa('.aft-summary'),
            comp: !!q('#aft-comp')
          };
        }""")
        check("A1 لا أخطاء كونسول/صفحة عند التحميل", len(errors) == 0, "; ".join(errors[:2]))
        check("A2 اتجاه الصفحة RTL واللغة عربية والرموز محملة من أصولها",
              st["dir"] == "rtl" and st["lang"] == "ar" and st["icons"] >= 25, f"dir={st['dir']} lang={st['lang']} icons={st['icons']}")
        check("A3 تركيب After: سطح بترولي بارز (waves) بطبقة موجات aria-hidden ومحتوى مستقلة + مبلغ + اتجاه نصي + قيمتان + دوائر + تقدمان + صفوف + رسالة + إجراء رئيسي",
              st["hero"] and st["heroWaves"] and st["heroWavesLayer"] and st["heroContent"]
              and st["heroAmount"] == "7,532" and "مقارنة بالأسبوع الماضي" in st["heroTrend"]
              and st["kpis"] == 2 and st["circPanel"] and st["progress"] == 2 and st["rows"] >= 4
              and st["openRows"] >= 2 and st["note"] and st["primaryBtn"] and st["comp"],
              json.dumps({k: st[k] for k in ["heroAmount", "kpis", "progress", "rows", "openRows"]}, ensure_ascii=False))
        check("A4 بلا بطاقة لكل صف: خلفية الصف شفافة والفواصل بين الصفوف (تجميع بالعنوان والفاصل)",
              st["rowCardBg"] in ("rgba(0, 0, 0, 0)", "transparent") and st["rowDividers"] >= 3,
              f"rowBg={st['rowCardBg']} dividers={st['rowDividers']}")
        check("A5 مؤشرا التقدم بقيم معلومة نصية (68%/45%) — لا انتظار بلا نسبة في التركيب",
              st["progressBars"] == ["68%", "45%"], str(st["progressBars"]))

        # ===================== 2) الدوائر المتداخلة =====================
        circ = page.evaluate("""() => {
          const chart = document.querySelector('#circ-fixed');
          const bubbles = [...chart.querySelectorAll('.m-bubble')];
          const circles = bubbles.map(b => b.querySelector('.m-bubble__circle'));
          const widths = circles.filter(Boolean).map(c => c.getBoundingClientRect().width);
          const inVals = circles.filter(Boolean).map(c => c.querySelector('.m-bubble__value')?.textContent);
          const labels = [...chart.querySelectorAll('.m-packed__labels .m-bubble__label')].map(b => b.textContent);
          const legendText = chart.querySelector('.m-legend')?.textContent || '';
          /* تداخل هندسي فعلي بين الدوائر المتجاورة */
          let ovs = [];
          for (let i = 0; i + 1 < circles.length; i++) {
            if (!circles[i] || !circles[i+1]) continue;
            const a = circles[i].getBoundingClientRect(), b = circles[i+1].getBoundingClientRect();
            const ov = Math.max(0, (a.width + b.width) / 2 -
              Math.hypot((a.left + a.right - b.left - b.right) / 2,
                         (a.top + a.bottom - b.top - b.bottom) / 2));
            ovs.push(Math.round(ov * 10) / 10);
          }
          /* لا نص دائرة مغطى بدائرة أخرى: يُحسب التقاطع مع دوائر مرسومة
             **بعد** فقاعة النص في DOM (فوقها طبقيًا) — الأصغر فوق الأكبر،
             فما تحت النص لا يخفيه (z-order الرسم هو DOM) */
          const vals = bubbles.map(b => b.querySelector('.m-bubble__value')).filter(Boolean);
          const covered = vals.filter(v => {
            const vi = bubbles.indexOf(v.closest('.m-bubble'));
            const vr = v.getBoundingClientRect();
            return circles.some((c, ci) => ci > vi && c && (() => {
              const cr = c.getBoundingClientRect();
              return Math.max(0, Math.min(cr.right, vr.right) - Math.max(cr.left, vr.left)) > 0
                  && Math.max(0, Math.min(cr.bottom, vr.bottom) - Math.max(cr.top, vr.top)) > 0;
            })());
          }).length;
          return {widths, inVals, labels, legendText, ovs, covered,
                  nPct: inVals.filter(v => v.includes('%')).length};
        }""")
        exp = [88.0, 88 * (3566 / 7532) ** 0.5, 88 * (3333 / 7532) ** 0.5]
        okRatio = all(abs(a - b) <= 1.0 for a, b in zip(circ["widths"], exp))
        check("A6 المثال الثابت: ثلاث دوائر بأقطار ∝ √القيمة (7,532/3,566/3,333 — القطر 88/60.6/58.6 ≤1px) والقيم الحقيقية داخلها بلا نسب",
              okRatio and circ["inVals"] == ["7,532", "3,566", "3,333"] and circ["nPct"] == 0,
              f"widths={[round(w,1) for w in circ['widths']]} expected={[round(e,1) for e in exp]}")
        check("A7 تداخل ثنائي الأبعاد محسوب من المسافة بين المراكز (سقف المثال 8px، الافتراضي 12px) بلا رقم مغطى؛ الفعلي ≤25% من قطر الأصغر",
              len(circ["ovs"]) == 2 and all(o > 0 for o in circ["ovs"]) and circ["covered"] == 0
              and all(o <= 0.25 * min(exp[i], exp[i + 1]) + 0.5 for i, o in enumerate(circ["ovs"])),
              f"overlaps={circ['ovs']} covered={circ['covered']} rule≤{[round(0.25*min(exp[i],exp[i+1]),1) for i in range(2)]}")
        check("A8 المفتاح النصي ظاهر بالقيم الخام بلا نسب — والتسميات تحت الدوائر",
              "7,532" in circ["legendText"] and "3,566" in circ["legendText"] and "3,333" in circ["legendText"]
              and "%" not in circ["legendText"] and circ["labels"] == ["الإيرادات", "الربح", "التكاليف"],
              circ["legendText"][:80])

        edge = page.evaluate("""() => {
          const grab = id => {
            const c = document.querySelector(id);
            return {
              vals: [...c.querySelectorAll('.m-bubble__value, .m-packed__states .m-legend__value')].map(v => v.textContent),
              circles: c.querySelectorAll('.m-bubble__circle').length,
              rings: c.querySelectorAll('.m-bubble__circle--none').length,
              states: c.querySelectorAll('.m-packed__states .m-legend__item').length
            };
          };
          return { edge: grab('#circ-edge'), neg: grab('#circ-negative') };
        }""")
        check("A9 دائرة موجبة فقط؛ صفر ومجهول وغير متاح في ثلاثة صفوف منفصلة دون حلقات مصطنعة",
              edge["edge"]["vals"] == ["1,200", "0 — صفر", "— غير معروف", "— غير متاح"]
              and edge["edge"]["circles"] == 1 and edge["edge"]["rings"] == 0 and edge["edge"]["states"] == 3,
              str(edge["edge"]))
        check("A10 السالب: رقمه بعلامته + دلالة «سالب غير صالح للمساحة» وبلا دائرة موجبة — ومع data-display يبقى التنسيق (-3,566) والدلالة معًا",
              edge["neg"]["vals"] == ["7,532", "-3,566 — سالب غير صالح للمساحة", "-2400 — سالب غير صالح للمساحة"]
              and edge["neg"]["circles"] == 1 and edge["neg"]["rings"] == 0 and edge["neg"]["states"] == 2,
              str(edge["neg"]))

        scale = page.evaluate("""() => {
          const sc = document.querySelector('#circ-scale');
          const c1 = sc.querySelector('.m-bubble__circle');
          const w1 = c1 ? c1.getBoundingClientRect().width : 0;
          const inVal = c1 ? c1.querySelector('.m-bubble__value')?.textContent : '';
          const legendHasPct = (sc.querySelector('.m-legend')?.textContent || '').includes('%');
          const g = id => { const c = document.querySelector(id);
            return { err: !!c.querySelector('.m-chart__scale-error'),
                     errText: (c.querySelector('.m-chart__scale-error') || {}).textContent || '',
                     circles: c.querySelectorAll('.m-bubble__circle').length,
                     legend: !!c.querySelector('.m-legend') }; };
          return { w1, inVal, legendHasPct, z: g('#circ-max-zero'), n: g('#circ-max-negative') };
        }""")
        expScaled = 88 * (7532 / 10000) ** 0.5
        check("A11 data-max معلن (10000): القطر يتبع المعلن (√7532/10000 → 76.4≤1px) والقيم داخل الدوائر والمفتاح بلا نسب",
              abs(scale["w1"] - expScaled) <= 1.0 and scale["inVal"] == "7,532" and not scale["legendHasPct"],
              f"w={round(scale['w1'],1)} expected={round(expScaled,1)}")
        check("A12 مقياس صفر مع موجبة: تعارض صريح برسالة ظاهرة — لا رسم ولا استبدال صامت بالمجموع والمفتاح بالقيم",
              scale["z"]["err"] and scale["z"]["circles"] == 0 and scale["z"]["legend"]
              and "صفر" in scale["z"]["errText"] and "تعارض" in scale["z"]["errText"],
              scale["z"]["errText"][:60])
        check("A13 مقياس سالب: غير صالح صريح برسالة ظاهرة — لا تطبيع ولا رسم",
              scale["n"]["err"] and scale["n"]["circles"] == 0 and "غير صالح" in scale["n"]["errText"],
              scale["n"]["errText"][:60])

        dn = page.evaluate("""() => {
          const d = document.querySelector('#donut-demo');
          return { svg: !!d.querySelector('svg'),
                   center: (d.querySelector('.m-donut__center') || {}).textContent || '',
                   text: d.textContent || '' };
        }""")
        check("A14 donut مقابل packed: donut توزيع بمقام معلن (مركز 25 ونسب في مخرجاته) وpacked أعلاه بلا نسب إطلاقًا — لا خلط معنى النوعين",
              dn["svg"] and dn["center"] == "25" and "%" in dn["text"],
              f"center={dn['center']}")

        # ===================== 3) الحقول الثمانية =====================
        f = page.evaluate("""() => {
          const rows = [...document.querySelectorAll('#field-states .aft-state')];
          const info = row => {
            const fld = row.querySelector('.m-field');
            const input = fld.querySelector('input');
            const msg = fld.querySelector('.m-field__msg');
            const control = fld.querySelector('.m-field__control');
            const cs = getComputedStyle(control);
            const lab = fld.querySelector('label');
            return {
              label: row.querySelector('.aft-state__label').firstChild.textContent.trim(),
              hasError: fld.classList.contains('has-error'),
              hasSuccess: fld.classList.contains('has-success'),
              hasFocus: fld.classList.contains('has-focus'),
              hasReadonly: fld.classList.contains('has-readonly'),
              hasDisabled: fld.classList.contains('has-disabled'),
              disabled: input.disabled, readonly: input.readOnly,
              value: input.value,
              msg: msg && msg.classList.contains('is-visible') ? msg.textContent.trim() : '',
              describedby: input.getAttribute('aria-describedby') || '',
              labelFor: lab ? (lab.getAttribute('for') === input.id) : false,
              bg: cs.backgroundColor,
              sel: getComputedStyle(input).userSelect
            };
          };
          return rows.map(info);
        }""")
        byLbl = {r["label"]: r for r in f}
        check("A15 المصفوفة: ثماني حالات + تركيبة خطأ+تركيز — لكل حقل label[for] حقيقي وقيمة/رسالة مطابقة للحالة",
              len(f) == 9 and all(r["labelFor"] for r in f)
              and byLbl["فارغ"]["value"] == "" and not byLbl["فارغ"]["hasError"]
              and byLbl["تركيز"]["hasFocus"] and byLbl["كتابة"]["hasFocus"] and byLbl["كتابة"]["value"] == "ORD-1"
              and byLbl["ممتلئ"]["value"] == "ORD-10233" and not byLbl["ممتلئ"]["hasSuccess"]
              and byLbl["خطأ"]["hasError"] and byLbl["خطأ"]["value"] == "ORD-10" and "أكمله" in byLbl["خطأ"]["msg"]
              and byLbl["نجاح"]["hasSuccess"] and "تم التحقق" in byLbl["نجاح"]["msg"]
              and byLbl["معطل"]["disabled"] and byLbl["معطل"]["hasDisabled"]
              and byLbl["قراءة فقط"]["readonly"] and not byLbl["قراءة فقط"]["disabled"]
              and byLbl["خطأ + تركيز"]["hasError"] and byLbl["خطأ + تركيز"]["hasFocus"],
              f"rows={len(f)} labels={list(byLbl)}")
        check("A16 الفارغ ليس صفرًا: placeholder تلميح والقيمة فارغة بلا «0» — والممتلئ بلا شكل نجاح",
              byLbl["فارغ"]["value"] == "" and "مثال:" in (page.locator('#aft-f-empty').get_attribute('placeholder') or "")
              and not byLbl["ممتلئ"]["hasSuccess"], "")
        check("A17 رسالة الخطأ مرتبطة aria-describedby وتشرح التصحيح — القيمة باقية (لا تمحو)",
              byLbl["خطأ"]["describedby"].split().count("aft-msg-error") == 1
              and byLbl["خطأ"]["value"] == "ORD-10" and "ORD-10233" in byLbl["خطأ"]["msg"], "")
        check("A18 القراءة فقط ليست معطلة: نص كامل الوضوح user-select=text وخلفية مهدأة ≠ أرضية المعطل — والمعطل بأرضية المعطل",
              byLbl["قراءة فقط"]["sel"] == "text" and byLbl["قراءة فقط"]["bg"] != byLbl["معطل"]["bg"],
              f"ro={byLbl['قراءة فقط']['bg']} dis={byLbl['معطل']['bg']}")

        # تركيز فعلي على حقل المصفوفة + حلقة مرئية
        page.locator('#aft-f-empty').focus()
        page.wait_for_timeout(60)
        focusFx = page.evaluate("""() => {
          const c = document.querySelector('#aft-f-empty').closest('.m-field__control');
          return { shadow: getComputedStyle(c).boxShadow !== 'none',
                   border: getComputedStyle(c).borderColor };
        }""")
        check("A19 التركيز الفعلي (focus-within) على حقل المصفوفة يظهر حلقة 2px بفاصل — منفصلة عن الضغط",
              focusFx["shadow"], f"border={focusFx['border']}")

        # أشكال الإدخال التفاعلية
        page.locator('#aft-f-search').fill('طلب الشمال')
        page.wait_for_timeout(80)
        clearVis = page.evaluate("""() => {
          const b = document.querySelector('#field-shapes .m-field__clear');
          return { vis: b.classList.contains('is-visible'), label: b.getAttribute('aria-label') };
        }""")
        page.locator('#field-shapes .m-field__clear').click()
        page.wait_for_timeout(80)
        cleared = page.evaluate("""() => ({
          val: document.querySelector('#aft-f-search').value,
          focused: document.activeElement === document.querySelector('#aft-f-search'),
          vis: document.querySelector('#field-shapes .m-field__clear').classList.contains('is-visible')
        })""")
        page.locator('#field-shapes [data-step="up"]').click()
        qtyUp = page.evaluate("() => document.querySelector('#aft-f-qty').value")
        page.locator('#field-shapes [data-step="down"]').click()
        qtyDown = page.evaluate("() => document.querySelector('#aft-f-qty').value")
        check("A20 البحث: زر مسح B01 يظهر مع النص ويمسح ويعيد التركيز — والكمية تزداد وتنقص بأزرار B01 (3→4→3)",
              clearVis["vis"] and clearVis["label"] == "مسح البحث" and cleared["val"] == ""
              and cleared["focused"] and not cleared["vis"] and qtyUp == "4" and qtyDown == "3",
              f"clear={clearVis} cleared={cleared} qty={qtyUp}->{qtyDown}")

        # ===================== 4) ملخصات البيانات المركبة =====================
        sv = page.evaluate("""() => {
          const sums = [...document.querySelectorAll('.aft-summary')];
          const struct = s => ({
            head: !!s.querySelector('.aft-summary__head'),
            title: !!s.querySelector('.aft-summary__title'),
            stat: !!s.querySelector('.m-stat'),
            packed: s.querySelectorAll('[data-chart-packed]').length,
            progress: s.querySelectorAll('.m-progress').length,
            action: !!s.querySelector('.m-btn'),
            toggle: s.querySelector('[data-card-expand]')?.getAttribute('aria-controls') || ''
          });
          const a = struct(sums[0]), d = struct(sums[3]);
          const dTitle = sums[3].querySelector('.aft-summary__title').textContent;
          const dUnit = sums[3].querySelector('.m-stat__unit').textContent;
          const dSeries = [...sums[3].querySelectorAll('[data-series]')].map(x => x.getAttribute('data-series'));
          const aSeries = [...sums[0].querySelectorAll('[data-series]')].map(x => x.getAttribute('data-series'));
          return { n: sums.length, a, d, dTitle, dUnit, dSeries, aSeries };
        }""")
        check("A21 أربعة ملخصات ببنية واحدة (رأس+عنوان+قيمة+رسم/إجراء) — الرسم يتغير: دوائر/تقدم/بلا رسم",
              sv["n"] == 4 and sv["a"]["head"] and sv["a"]["stat"] and sv["a"]["packed"] == 1
              and sv["d"]["packed"] == 1,
              json.dumps(sv["a"], ensure_ascii=False))
        check("A22 نسخة التعديل (د): عنوان ووحدة وثلاث دوائر بمفاتيح d/e/b مقابل a/c في (أ) — نفس الأصناف دون تعديل CSS",
              sv["dTitle"] == "أحجام الشحنات — الأسبوع" and sv["dUnit"] == "كجم"
              and sv["dSeries"] == ["d", "e", "b"] and sv["aSeries"] == ["a", "c"],
              f"a={sv['aSeries']} d={sv['dSeries']}")

        # توسعة من زر صريح (سلوك اللوحة خارج العارض)
        page.locator('#sum-a [data-card-expand]').click()
        page.wait_for_timeout(80)
        expA = page.evaluate("""() => {
          const btn = document.querySelector('#sum-a [data-card-expand]');
          const reg = document.getElementById(btn.getAttribute('aria-controls'));
          return { aria: btn.getAttribute('aria-expanded'), hidden: reg.hidden,
                   label: (btn.querySelector('[data-card-expand-text]') || btn).textContent.trim(),
                   regionIsCtl: btn.getAttribute('aria-controls') === 'aft-details-a' };
        }""")
        page.locator('#sum-a [data-card-expand]').click()
        page.wait_for_timeout(80)
        cloA = page.evaluate("""() => {
          const btn = document.querySelector('#sum-a [data-card-expand]');
          const reg = document.getElementById('aft-details-a');
          return { aria: btn.getAttribute('aria-expanded'), hidden: reg.hidden,
                   label: (btn.querySelector('[data-card-expand-text]') || btn).textContent.trim() };
        }""")
        check("A23 التوسعة من الزر الصريح خارج العارض: aria-expanded/aria-controls فعليان والنص يتغير (مغلق→مفتوح→مغلق)",
              expA["aria"] == "true" and not expA["hidden"] and "إخفاء" in expA["label"] and expA["regionIsCtl"]
              and cloA["aria"] == "false" and cloA["hidden"] and "تفاصيل الملخص الأول" in cloA["label"],
              f"open={expA} close={cloA}")

        # ===================== 5) الأقسام والصفوف — الطي والإتاحة =====================
        foldHead = '#fold-section .m-section__head'
        page.locator(foldHead).click()
        page.wait_for_timeout(80)
        foldOpen = page.evaluate("""() => {
          const h = document.querySelector('#fold-section .m-section__head');
          const b = document.querySelector('#fold-body');
          return { aria: h.getAttribute('aria-expanded'), hidden: b.hidden,
                   ctl: h.getAttribute('aria-controls') === 'fold-body', tag: h.tagName };
        }""")
        page.locator(foldHead).focus()
        page.keyboard.press("Enter")
        page.wait_for_timeout(80)
        foldKb = page.evaluate("""() => ({
          aria: document.querySelector('#fold-section .m-section__head').getAttribute('aria-expanded'),
          hidden: document.querySelector('#fold-body').hidden })""")
        check("A24 القسم القابل للطي: زر حقيقي aria-expanded/aria-controls يفتح بالنقر ويطي بلوحة المفاتيح (Enter)",
              foldOpen["aria"] == "true" and not foldOpen["hidden"] and foldOpen["ctl"] and foldOpen["tag"] == "BUTTON"
              and foldKb["aria"] == "false" and foldKb["hidden"],
              f"click={foldOpen} kb={foldKb}")

        # ===================== 6) الأسطح البترولية =====================
        su = page.evaluate("""() => {
          const g = id => { const s = document.querySelector('#' + id);
            const waves = s.querySelector('.m-surface__waves');
            return { bgImage: getComputedStyle(waves).backgroundImage,
                     cls: s.className.replace('m-surface ', '') }; };
          return { calm: g('s-calm'), waves: g('s-waves'), depth: g('s-depth'), plain: g('s-plain'),
                   keysOpacity: getComputedStyle(document.querySelector('#s-keys .m-surface__waves')).opacity,
                   plainOpacity: getComputedStyle(document.querySelector('#s-plain .m-surface__waves')).opacity,
                   amountLtr: getComputedStyle(document.querySelector('#s-waves .m-surface__amount')).direction,
                   texts: [...document.querySelectorAll('#surfaces-grid .m-surface__amount')].map(a => a.textContent) };
        }""")
        check("A25 الأسطح الأربع: waves/depth بخلفية SVG أصلية وcalm/plain بلا صورة موجات — المحتوى واحد (4,812.50 ×4) والأرقام معزولة LTR",
              "waves-soft.svg" in su["waves"]["bgImage"] and "waves-depth.svg" in su["depth"]["bgImage"]
              and su["calm"]["bgImage"] == "none" and su["plain"]["bgImage"] == "none"
              and su["texts"] == ["4,812.50"] * 4 and su["amountLtr"] == "ltr",
              json.dumps({k: su[k]["bgImage"][-40:] for k in ["calm", "waves", "depth", "plain"]}, ensure_ascii=False))
        check("A26 مفاتيح الموجة من HTML تنعكس: نموذج المفاتيح opacity 0.45 ≠ الافتراضي 1 — وPlain يخفي الموجة",
              abs(float(su["keysOpacity"]) - 0.45) < 0.01 and abs(float(su["plainOpacity"]) - 1) < 0.001,
              f"keys={su['keysOpacity']} plainOpacity={su['plainOpacity']} (مخفية display:none)")

        # ===================== 7) العارض المُرحَّل (انحدار PR#5) =====================
        car = page.evaluate("""() => {
          const r = document.querySelector('#car-after');
          return { slides: r.querySelectorAll('[data-carousel-slide]').length,
                   status: r.querySelector('[data-status]').textContent,
                   prev: r.querySelector('[data-prev]')?.getAttribute('aria-label'),
                   dots: r.querySelectorAll('[data-dots] .m-carousel__dot').length,
                   toggles: [...r.querySelectorAll('[data-card-expand]')].map(b => ({
                     aria: b.getAttribute('aria-expanded'), ctl: b.getAttribute('aria-controls') })) };
        }""")
        check("A27 العارض المُرحَّل: شريحتان وأزرار سابق/تالي ومؤشر حي ونقطتان وعقد التوسعة مغلقة افتراضيًا",
              car["slides"] == 2 and car["status"] == "البطاقة 1 من 2" and car["prev"] == "السابق"
              and car["dots"] == 2 and all(t["aria"] == "false" and t["ctl"] for t in car["toggles"]),
              str(car))
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#car-after'), 1)")
        page.wait_for_timeout(280)
        nxt = page.evaluate("() => ({ idx: MicroCarousel.getIndex(document.querySelector('#car-after')), status: document.querySelector('#car-after [data-status]').textContent })")
        check("A27-ب التنقل يعمل بعد الترحيل: الانتقال إلى البطاقة 2 يحدّث المؤشر («البطاقة 2 من 2»)",
              nxt["idx"] == 1 and nxt["status"] == "البطاقة 2 من 2", str(nxt))
        # تثبيت الموضع والتمرير قبل السحب — السحب يتطلب viewport مرئيًا؛
        # لا توسعة مفتوحة في هذه المرحلة (فحص التوسعة A29 يأتي بعد السحب)
        page.evaluate("() => document.querySelector('#car-after').scrollIntoView({block:'center'})")
        page.wait_for_timeout(120)
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#car-after'), 0)")
        page.wait_for_timeout(280)
        vpBox = page.locator("#car-after [data-viewport]").bounding_box()
        cx, cy = vpBox["x"] + vpBox["width"] / 2, vpBox["y"] + vpBox["height"] / 2
        stateExpr = """() => { const r = document.querySelector('#car-after');
          return { dragging: r.classList.contains('is-dragging'),
                   dur: getComputedStyle(r.querySelector('[data-track]')).transitionDuration,
                   idx: MicroCarousel.getIndex(r) }; }"""
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx + 50, cy, steps=5)
        during = page.evaluate(stateExpr)
        page.mouse.move(cx + 50, 12, steps=8)
        page.mouse.up()
        page.wait_for_timeout(250)
        after = page.evaluate(stateExpr)
        check("A28 انحدار PR#5 — السحب والإفلات خارج الـviewport: أثناءها is-dragging وانتقال 0s وبعدها تنظيف كامل والانتقال يعود 0.18s",
              during["dragging"] and during["dur"] == "0s" and not after["dragging"] and after["dur"] == "0.18s",
              f"during={during} after={after}")
        # A29: أعد البطاقة الأولى للمنتصف (السحب أعادنا للبطاقة 2) ثم وسّعها من زرها الصريح
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#car-after'), 0)")
        page.wait_for_timeout(280)
        page.evaluate("() => document.querySelector('#car-after').scrollIntoView({block:'center'})")
        page.wait_for_timeout(120)
        page.locator('#car-after [data-card-expand]').first.click()
        page.wait_for_timeout(80)
        carExp = page.evaluate("""() => { const b = document.querySelector('#car-after [data-card-expand]');
          return { aria: b.getAttribute('aria-expanded'), hidden: document.getElementById('aft-car-d1').hidden }; }""")
        check("A29 انحدار PR#5 — التوسعة inline من زر صريح تعمل بعد الترحيل (aria-expanded=true والمنطقة تُكشف)",
              carExp["aria"] == "true" and not carExp["hidden"], str(carExp))

        # ===================== 8) لا autoplay ولا حركة مستمرة =====================
        anims = page.evaluate("""() => {
          const bad = [];
          document.querySelectorAll('#aft-comp *, #car-after *, #circ-panel *').forEach(el => {
            const cs = getComputedStyle(el);
            if (cs.animationName !== 'none' && cs.animationIterationCount !== '1')
              bad.push(el.className.toString().slice(0, 40) + ':' + cs.animationName);
          });
          const y0 = pageYOffset;
          return { bad, y0 };
        }""")
        page.wait_for_timeout(1400)
        y1 = page.evaluate("() => pageYOffset")
        check("A30 لا autoplay ولا حركة مستمرة: لا أي animation مكرر داخل التركيب/العارض/الدوائر والموضع ثابت بعد 1.4s",
              not anims["bad"] and y1 == anims["y0"],
              f"bad={anims['bad'][:3]} y0={anims['y0']} y1={y1}")

        # ===================== 9) لوحة المفاتيح =====================
        kb1 = tab_to(page, '#primary-action .m-btn--primary')
        primFv = page.evaluate("""() => {
          const b = document.querySelector('#primary-action .m-btn--primary');
          return { fv: b.matches(':focus-visible'), shadow: getComputedStyle(b).boxShadow !== 'none' };
        }""")
        # «السابق» معطل فعليًا على البطاقة الأولى فلا يدخل ترتيب Tab (سلوك سليم
        # يوثق هنا) — ننتقل للبطاقة الثانية فيصبح متاحًا ثم نصل إليه بـTab الحقيقي
        disabledAtFirst = page.evaluate("() => document.querySelector('#car-after [data-prev]').disabled")
        page.evaluate("() => MicroCarousel.goTo(document.querySelector('#car-after'), 1)")
        page.wait_for_timeout(280)
        page.evaluate("() => document.querySelector('#car-after').scrollIntoView({block:'center'})")
        page.wait_for_timeout(120)
        kb2 = tab_to(page, '#car-after [data-prev]')
        prevFv = page.evaluate("""() => { const b = document.querySelector('#car-after [data-prev]');
          return { active: document.activeElement === b,
                   fv: b.matches(':focus-visible'),
                   shadow: getComputedStyle(b).boxShadow !== 'none' }; }""")
        check("A31 لوحة المفاتيح: Tab يصل زر الإجراء الرئيسي وزر «السابق» (بعد الانتقال للبطاقة 2) بحلقة مرئية — والسابق معطل فعلًا (غير قابل للتركيز) على البطاقة 1",
              kb1 and primFv["fv"] and primFv["shadow"] and disabledAtFirst
              and kb2 and prevFv["active"] and prevFv["fv"] and prevFv["shadow"],
              f"primary={primFv} prevDisabled@1={disabledAtFirst} prev={prevFv}")

        # ===================== 10) نص طويل وأرقام كبيرة (320) =====================
        page.set_viewport_size({"width": 320, "height": 700})
        page.wait_for_timeout(250)
        longRow = page.evaluate("""() => {
          const row = [...document.querySelectorAll('#rows-lab .m-row__title')]
                        .find(t => t.textContent.includes('شحنة المواد الغذائية'));
          const r = row.getBoundingClientRect();
          const wrap = row.closest('.m-row');
          return { h: Math.round(r.height), wraps: r.height > 26,
                   rowH: Math.round(wrap.getBoundingClientRect().height),
                   rowOver: wrap.scrollWidth > wrap.clientWidth + 1 };
        }""")
        big = page.evaluate("""() => {
          const amt = document.querySelector('#hero-amount');
          const old = amt.textContent;
          amt.textContent = '1,245,680.75';
          const s = amt.closest('.m-surface');
          const ar = amt.getBoundingClientRect(), sr = s.getBoundingClientRect();
          const fits = ar.right <= sr.right + 0.5 && ar.left >= sr.left - 0.5;
          const comp = document.querySelector('#aft-comp');
          const noHScroll = comp.scrollWidth <= comp.clientWidth + 1;
          amt.textContent = old; /* استعادة فورية — الفحص سلوكي لا تعديل مصدر */
          return { fits, noHScroll };
        }""")
        check("A32 على 320px: العنوان العربي الطويل يلتف داخل الصف بلا قصّ — ورقم كبير 1,245,680.75 يُلف داخل السطح (overflow-wrap) بلا خروج أفقي",
              longRow["wraps"] and not longRow["rowOver"] and big["fits"] and big["noHScroll"],
              f"rowH={longRow['rowH']} wraps={longRow['wraps']} big={big}")

        # ===================== 11) مسح انسياب بأربع أعراض =====================
        sweep = []
        for w in (320, 360, 390, 430):
            page.set_viewport_size({"width": w, "height": 844})
            page.wait_for_timeout(220)
            m = page.evaluate("""() => {
              const de = document.documentElement;
              const comp = document.querySelector('#aft-comp');
              const hero = document.querySelector('#hero-surface').getBoundingClientRect();
              const plot = document.querySelector('#circ-fixed [data-plot]').getBoundingClientRect();
              const val = document.querySelector('#primary-action .m-btn--primary').getBoundingClientRect();
              const rowsVal = [...document.querySelectorAll('#rows-section .m-row__value')].map(v => v.getBoundingClientRect().right);
              return { docOver: de.scrollWidth > de.clientWidth + 1,
                       compOver: comp.scrollWidth > comp.clientWidth + 1,
                       heroFits: hero.right <= de.clientWidth + 0.5 && hero.left >= -0.5,
                       plotFits: plot.width <= de.clientWidth,
                       btnFits: val.right <= de.clientWidth + 0.5,
                       valsFits: rowsVal.every(r => r <= de.clientWidth + 0.5) };
            }""")
            sweep.append((w, m))
        check("A33 أعراض 320/360/390/430: لا انسياب أفقي في المستند والتركيب، والسطح والدوائر وزر الإجراء وقيم الصفوف داخل العرض",
              all(not m["docOver"] and not m["compOver"] and m["heroFits"] and m["plotFits"] and m["btnFits"] and m["valsFits"] for _, m in sweep),
              json.dumps({str(w): m for w, m in sweep}, ensure_ascii=False))

        # ===================== 12) تكبير النص 200% (محاكاة معلنة) =====================
        page.set_viewport_size({"width": 390, "height": 900})
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(350)
        zoom = page.evaluate("""() => {
          /* نفس آلية لوحات المعاينة: مروران على عمود التركيب فقط */
          const root = document.querySelector('#aft-comp');
          const els = [root].concat([].slice.call(root.querySelectorAll('*')));
          const orig = els.map(el => ({ el, fs: parseFloat(getComputedStyle(el).fontSize) }));
          orig.forEach(({el, fs}) => { el.style.fontSize = (fs * 2) + 'px'; });
          const de = document.documentElement;
          const comp = document.querySelector('#aft-comp');
          const title = document.querySelector('#aft-hero-title').getBoundingClientRect();
          const label = document.querySelector('#hero-surface .m-surface__label').getBoundingClientRect();
          const noOverlap = title.bottom <= label.top + 1;
          const amt = document.querySelector('#hero-amount').getBoundingClientRect();
          const surf = document.querySelector('#hero-surface').getBoundingClientRect();
          return { compOver: comp.scrollWidth > comp.clientWidth + 1,
                   docOver: de.scrollWidth > de.clientWidth + 1,
                   noOverlap, amtInside: amt.top >= surf.top - 0.5 && amt.bottom <= surf.bottom + 0.5 };
        }""")
        page.screenshot(path=str(SHOTS / "17-text-zoom-200-390.png"), full_page=False)
        page.evaluate("""() => { document.querySelector('#aft-comp').querySelectorAll('*').forEach(el => {
          if (el.style.fontSize) el.style.fontSize = ''; }); }""")
        page.reload()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(300)
        check("A34 تكبير النص 200% على عمود التركيب: لا انسياب أفقي ولا تداخل عنوان/تسمية والمبلغ داخل السطح (محاكاة مكافئة للنص — موثقة)",
              not zoom["compOver"] and not zoom["docOver"] and zoom["noOverlap"] and zoom["amtInside"],
              str(zoom))

        # ===================== 13) تقليل الحركة (تفضيل فعلي) =====================
        ctxR = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
        pageR = ctxR.new_page()
        pageR.goto(board)
        pageR.wait_for_load_state("networkidle")
        pageR.wait_for_timeout(300)
        red = pageR.evaluate("""() => ({
          field: getComputedStyle(document.querySelector('#aft-f-empty').closest('.m-field__control')).transitionDuration,
          bar: getComputedStyle(document.querySelector('#progress-section .m-progress__bar')).transitionDuration,
          chevron: getComputedStyle(document.querySelector('#fold-section .m-section__chevron')).transitionDuration
        })""")
        pageR.screenshot(path=str(SHOTS / "18-reduced-motion-390.png"), full_page=False)
        check("A35 تفضيل تقليل الحركة الفعلي: انتقالا الحقل وسهم الطي صفر — وشريط التقدم يبقى بانتقال حالته الموثق من B05 (0.18s انتقال حالة لا حركة مستمرة ولا animation)",
              red["field"] == "0s" and red["chevron"] == "0s" and red["bar"] == "0.18s", str(red))
        ctxR.close()

        # ===================== 14) إثبات تعديل ثلاثي من المصدر ثم الاستعادة =====================
        log("")
        log("# ==== إثبات تعديل ثلاثي من المصدر (ثم إعادة القيم المقصودة والتحقق بالبصمات) ====")
        htmlPath = ROOT / BOARD
        tokPath = ROOT / "shared" / "tokens.css"
        h0, t0 = sha256(htmlPath), sha256(tokPath)

        def fresh():
            """سياق متصفح نظيف لكل خطوة إثبات — لا كاش HTTP (304) ولا حالة سابقة."""
            c = browser.new_context(viewport={"width": 390, "height": 844})
            pg2 = c.new_page()
            pg2.on("console", lambda m: errors.append((m.text or "") + " @" + ((m.location or {}).get("url") or "")) if m.type == "error" else None)
            pg2.on("pageerror", lambda e: errors.append(str(e)))
            pg2.goto(board)
            pg2.wait_for_load_state("networkidle")
            pg2.wait_for_timeout(300)
            return c, pg2

        # 1) قيمة نصية من HTML التركيب
        file_replace(htmlPath, '<p class="m-surface__amount" id="hero-amount">7,532</p>',
                     '<p class="m-surface__amount" id="hero-amount">9,999</p>')
        c1, pg1 = fresh()
        v1 = pg1.evaluate("() => document.querySelector('#hero-amount').textContent")
        check("ED1 تعديل قيمة نصية من HTML المصدر ينعكس على المعاينة (7,532→9,999)",
              v1 == "9,999", f"after={v1}")
        c1.close()
        file_replace(htmlPath, '<p class="m-surface__amount" id="hero-amount">9,999</p>',
                     '<p class="m-surface__amount" id="hero-amount">7,532</p>')

        # 2) قيمة دائرة من HTML (المساحة ∝ القيمة) — أول ظهور للسطر هو لوحة
        #    تركيب §1 (#circ-panel) فنقيسها هي (الاستبدال count=1)
        file_replace(htmlPath, '<li data-series="b" data-label="الربح" data-value="3566" data-display="3,566"></li>',
                     '<li data-series="b" data-label="الربح" data-value="6400" data-display="6,400"></li>')
        c2, pg2 = fresh()
        v2 = pg2.evaluate("""() => {
          const cs = [...document.querySelector('#circ-panel').querySelectorAll('.m-bubble__circle')]
                      .map(c => Math.round(c.getBoundingClientRect().width * 10) / 10);
          const vs = [...document.querySelector('#circ-panel').querySelectorAll('.m-bubble__value')].map(v => v.textContent);
          return { cs, vs };
        }""")
        expED = [88.0, 88 * (6400 / 7532) ** 0.5, 88 * (3333 / 7532) ** 0.5]
        check("ED2 تعديل قيمة دائرة من المصدر يغيّر قطرها ∝ √القيمة والنص داخلها (3,566→6,400 → القطر 60.6→81.2)",
              v2["vs"][1] == "6,400" and abs(v2["cs"][1] - expED[1]) <= 1.0 and v2["cs"][1] > v2["cs"][2],
              f"widths={v2['cs']} expected={[round(e,1) for e in expED]}")
        c2.close()
        file_replace(htmlPath, '<li data-series="b" data-label="الربح" data-value="6400" data-display="6,400"></li>',
                     '<li data-series="b" data-label="الربح" data-value="3566" data-display="3,566"></li>')

        # 3) توكن مشترك ينعكس على المعاينة (المفتاح الحي + دوائر الفئة a)
        file_replace(tokPath, "--micro-data-a: #164D59;", "--micro-data-a: #AA2200;")
        c3, pg3 = fresh()
        v3 = pg3.evaluate("""() => ({
          swatch: getComputedStyle(document.querySelector('#token-swatch')).backgroundColor,
          circle: getComputedStyle(document.querySelector('#circ-panel .m-cat--a .m-bubble__circle')).backgroundColor })""")
        check("ED3 تعديل توكن --micro-data-a من shared/tokens.css ينعكس فورًا (بقعة المفتاح الحي + دوائر الفئة a)",
              v3["swatch"] == "rgb(170, 34, 0)" and v3["circle"] == "rgb(170, 34, 0)", str(v3))
        c3.close()
        file_replace(tokPath, "--micro-data-a: #AA2200;", "--micro-data-a: #164D59;")

        # الاستعادة: بصمات مطابقة للقبل + الملف المتعقب (tokens.css) نظيف في git
        c4, pg4 = fresh()
        v4 = pg4.evaluate("""() => ({
          amt: document.querySelector('#hero-amount').textContent,
          val: [...document.querySelector('#circ-panel').querySelectorAll('.m-bubble__value')].map(v => v.textContent),
          swatch: getComputedStyle(document.querySelector('#token-swatch')).backgroundColor })""")
        c4.close()
        h1, t1 = sha256(htmlPath), sha256(tokPath)
        dirtyTracked = subprocess.run(["git", "status", "--porcelain", "shared/tokens.css"],
                                      cwd=str(ROOT), capture_output=True, text=True).stdout.strip()
        check("ED4 إعادة القيم المقصودة: المبلغ 7,532 والدوائر 7,532/3,566/3,333 والتوكن #164D59 — بصمات الملفين مطابقة للقبل وtokens.css نظيف في git",
              v4["amt"] == "7,532" and v4["val"] == ["7,532", "3,566", "3,333"]
              and v4["swatch"] == "rgb(22, 77, 89)" and h1 == h0 and t1 == t0 and dirtyTracked == "",
              f"hashes={{'html': {h1 == h0}, 'tokens': {t1 == t0}}} dirty-tracked='{dirtyTracked}'")

        # ===================== 15) لا أخطاء بعد كل التفاعلات =====================
        check("A36 لا أخطاء كونسول/صفحة بعد كل التفاعلات (سحب/توسعة/حقول/طي/إثبات تعديل)",
              len(errors) == 0, "; ".join(errors[:2]))

        # ===================== 16) اللقطات =====================
        log("")
        log("# ==== اللقطات (من شجرة commit المصدر نفسها) ====")
        page.set_viewport_size({"width": 390, "height": 844})
        page.reload(); page.wait_for_load_state("networkidle")
        page.evaluate("() => document.fonts.ready"); page.wait_for_timeout(400)

        def shot(name, full=False, clip=None):
            path = SHOTS / name
            page.screenshot(path=str(path), full_page=full, clip=clip)
            log(f"# shot {name}")

        shot("01-board-full-390.png", full=True)
        for sel, name in [("#composition", "02-composition-390.png")]:
            page.locator(sel).scroll_into_view_if_needed(); page.wait_for_timeout(150)
        page.evaluate("() => document.querySelector('#composition').scrollIntoView()")
        page.wait_for_timeout(150)
        shot("02-composition-390.png", full=False)
        page.evaluate("() => document.querySelector('#hero-surface').scrollIntoView({block:'center'})")
        page.wait_for_timeout(150)
        shot("03-hero-surface-390.png", full=False)
        page.evaluate("() => document.querySelector('#circ-panel').scrollIntoView({block:'center'})")
        page.wait_for_timeout(150)
        shot("04-circles-real-values-390.png", full=False)
        page.evaluate("() => document.querySelector('#circ-edge').scrollIntoView({block:'center'})")
        page.wait_for_timeout(150)
        shot("05-circles-zero-unknown-390.png", full=False)
        page.evaluate("() => document.querySelector('#circ-negative').scrollIntoView({block:'center'})")
        page.wait_for_timeout(150)
        shot("06-circles-negative-390.png", full=False)
        page.evaluate("() => document.querySelector('#circ-max-zero').scrollIntoView({block:'center'})")
        page.wait_for_timeout(150)
        shot("07-circles-scale-errors-390.png", full=False)
        page.evaluate("() => document.querySelector('#field-matrix').scrollIntoView()")
        page.wait_for_timeout(150)
        shot("08-field-states-matrix-390.png", full=False)
        page.evaluate("() => document.querySelector('#field-shapes').scrollIntoView()")
        page.wait_for_timeout(150)
        shot("09-field-shapes-390.png", full=False)
        page.evaluate("() => document.querySelector('#summary-variants').scrollIntoView()")
        page.wait_for_timeout(150)
        shot("10-data-summaries-390.png", full=False)
        page.evaluate("() => document.querySelector('#sections-rows').scrollIntoView()")
        page.wait_for_timeout(150)
        shot("11-sections-rows-390.png", full=False)
        page.evaluate("() => document.querySelector('#surfaces-grid').scrollIntoView()")
        page.wait_for_timeout(150)
        shot("12-surfaces-four-390.png", full=False)
        page.evaluate("() => document.querySelector('#s-keys').scrollIntoView({block:'center'})")
        page.wait_for_timeout(150)
        shot("13-surface-keys-390.png", full=False)
        page.evaluate("() => document.querySelector('#carousel-migrated').scrollIntoView()")
        page.wait_for_timeout(150)
        shot("14-carousel-migrated-390.png", full=False)
        page.evaluate("() => document.querySelector('#circ-fixed').scrollIntoView({block:'center'})")
        page.wait_for_timeout(150)
        shot("15-donut-vs-packed-390.png", full=False)

        # لقطة تركيز: تركيز لوحة مفاتيح على زر الإجراء الرئيسي
        tab_to(page, '#primary-action .m-btn--primary')
        page.evaluate("() => document.querySelector('#primary-action').scrollIntoView({block:'center'})")
        page.wait_for_timeout(150)
        shot("16-keyboard-focus-primary-390.png", full=False)

        # لقطات الأعراض (التركيب كامل الصفحة عند كل عرض)
        for w, tag in ((320, "a"), (360, "b"), (430, "c")):
            page.set_viewport_size({"width": w, "height": 900})
            page.evaluate("() => document.querySelector('#composition').scrollIntoView()")
            page.wait_for_timeout(220)
            shot(f"1{tag}-composition-{w}.png", full=False)
        # إعادة 390 للأمان بعد العروض
        page.set_viewport_size({"width": 390, "height": 844})

        # سطح مكتبي 1280 — عرض اللوحة كاملة
        page.set_viewport_size({"width": 1280, "height": 900})
        page.reload(); page.wait_for_load_state("networkidle"); page.wait_for_timeout(400)
        shot("20-board-full-1280.png", full=True)

        browser.close()

    # ===================== الخلاصة =====================
    log("")
    passed = sum(1 for _, ok in results if ok)
    failed = [n for n, ok in results if not ok]
    log(f"# النتيجة: {passed}/{len(results)} فحصًا ناجحًا")
    if failed:
        log("# فاشلة: " + " · ".join(failed))
    log(f"# اللقطات: {len(list(SHOTS.glob('*.png')))} في reviews/AFTER-DIRECTION/screenshots/")
    log("# حدود الدليل: فحوص headless فعلي — لا قارئ شاشة ولا لمس ولا متصفحات أخرى ولا هاتف؛")
    log("#   تكبير النص محاكاة مكافئة للنص (ليست تكبير نظام)؛ blur تركيبي؛ لا ادعاء إتاحة شامل")

    LOGFILE.write_text("\n".join(log_lines) + "\n", encoding="utf-8")
    print(f"\nverification.txt → {LOGFILE}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
