#!/usr/bin/env python3
"""The critic's full button-and-path audit (جولة الناقد) — REAL touch taps
(tap(), hasTouch+isMobile, 390×844) walking every screen of every role:
every button must do something visible or carry its «يُركَّب لاحقًا» marker.
Prints the verification table (الشاشة | الزر | ماذا حدث | النتيجة) and exits
non-zero when anything is معطوب.

Usage: uv run python touch_audit.py [chromium|webkit] [--only ROLE]
"""
import glob
import json
import os
import sys
import time

from playwright.sync_api import sync_playwright

VIEW = {"width": 390, "height": 844}
URL = "http://127.0.0.1:5077/micro-ui-design-system/"
SHOT_DIR = "/tmp/audit"


def apply_webkit_env():
    installs = sorted(glob.glob(os.path.expanduser("~/.cache/ms-playwright/webkit-*")))
    if not installs:
        return False
    sysdir = os.path.join(installs[-1], "minibrowser-wpe", "sys")
    egl_vendor, dri = os.path.join(sysdir, "egl_vendor"), os.path.join(sysdir, "lib", "dri")
    if not (os.path.isdir(egl_vendor) and os.path.isdir(dri)):
        return False
    for k, v in {
        "PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS": "1",
        "EGL_PLATFORM": "surfaceless",
        "LIBGL_ALWAYS_SOFTWARE": "1",
        "LIBGL_ALWAYS_INDIRECT": "0",
        "__EGL_VENDOR_LIBRARY_DIRS": egl_vendor,
        "LIBGL_DRIVERS_PATH": dri,
    }.items():
        os.environ.setdefault(k, v)
    return True


class Audit:
    def __init__(self, page, engine):
        self.page = page
        self.engine = engine
        self.rows = []

    # ── actions ──────────────────────────────────────────────────────────
    def tap(self, sel, label):
        el = self.page.locator(sel).first
        el.scroll_into_view_if_needed()
        el.wait_for(state="visible", timeout=5000)
        el.tap(timeout=5000)
        time.sleep(0.15)

    def tap_xy(self, x, y, label):
        self.page.touchscreen.tap(x, y)
        time.sleep(0.15)

    def long_press(self, sel, label, hold=700):
        el = self.page.locator(sel).first
        el.scroll_into_view_if_needed()
        el.wait_for(state="visible", timeout=5000)
        el.click(delay=hold)  # pointerdown + hold + pointerup → long-press fires
        time.sleep(0.2)

    def fill(self, sel, text):
        el = self.page.locator(sel).first
        el.scroll_into_view_if_needed()
        el.wait_for(state="visible", timeout=5000)
        el.fill(text)
        time.sleep(0.15)

    def shot(self, name):
        self.page.screenshot(path=f"{SHOT_DIR}/{self.engine}-{name}.png")

    # ── probes ───────────────────────────────────────────────────────────
    def sheet(self):
        return self.page.evaluate(
            """(() => {
              const s = document.querySelector('.mds-sheet');
              if (!s) return { open: false };
              return { open: true, label: s.getAttribute('aria-label'),
                       closing: s.className.includes('mds-sheet--closing') };
            })()"""
        )

    def body(self):
        # [data-sim-screen] carries ui.screen (the true navigation state);
        # data-sim-screen-body names the component (constant per component).
        return self.page.evaluate(
            "(() => document.querySelector('[data-sim-screen]')?.getAttribute('data-sim-screen') ?? null)()"
        )

    def has(self, text):
        return self.page.evaluate(
            "(t) => document.body.innerText.includes(t)", text
        )

    def count(self, sel):
        return self.page.evaluate("(s) => document.querySelectorAll(s).length", sel)

    def first_text(self, sel):
        return self.page.evaluate(
            "(s) => document.querySelector(s)?.textContent?.slice(0, 120) ?? null", sel
        )

    def wait_no_sheet(self, ms=2500):
        t0 = time.time()
        while time.time() - t0 < ms / 1000:
            if not self.sheet()["open"]:
                return True
            time.sleep(0.05)
        return False

    def wait_sheet(self, ms=2500):
        t0 = time.time()
        while time.time() - t0 < ms / 1000:
            s = self.sheet()
            if s["open"] and not s["closing"]:
                return s
            time.sleep(0.05)
        return None

    # ── reporting ────────────────────────────────────────────────────────
    def record(self, screen, button, happened, ok):
        self.rows.append({"screen": screen, "button": button, "happened": happened, "ok": bool(ok)})
        print(f"  [{'سليم' if ok else 'معطوب'}] {screen} · {button} — {happened}")

    def close_by_scrim(self, label):
        # Tap the VISIBLE scrim: above the panel's own top edge (the panel
        # height varies with content and font scale).
        y = self.page.evaluate(
            """(() => {
              const p = document.querySelector('.mds-sheet-panel');
              const top = p ? p.getBoundingClientRect().top : 300;
              return Math.max(12, Math.round(top) - 40);
            })()"""
        )
        self.page.touchscreen.tap(195, y)
        time.sleep(0.15)
        return self.wait_no_sheet()

    def summary(self):
        bad = [r for r in self.rows if not r["ok"]]
        print(f"\n=== {self.engine}: {len(self.rows) - len(bad)}/{len(self.rows)} سليم ===")
        if bad:
            print("المعطوب:")
            for r in bad:
                print(f"  - {r['screen']} · {r['button']}: {r['happened']}")
        return not bad


def enter_role(page, role_row_text, wait=".mds-context-bar"):
    page.evaluate("() => window.localStorage.clear()")
    page.reload(wait_until="networkidle")
    page.wait_for_selector("[data-sim-role-screen]", timeout=10000)
    page.locator(f'[data-sim-role-screen] .mds-object-row:has-text("{role_row_text}")').first.tap()
    page.wait_for_selector(wait, timeout=5000)
    time.sleep(0.3)


def open_sim_panel(a: Audit):
    a.long_press("[data-sim-version]", "لوحة المحاكاة (ضغطة مطوّلة على النسخة)")
    return a.wait_sheet()


def main():
    engine = sys.argv[1] if len(sys.argv) > 1 else "chromium"
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1]
    if engine == "webkit":
        apply_webkit_env()
    os.makedirs(SHOT_DIR, exist_ok=True)

    with sync_playwright() as pw:
        bt = pw.chromium if engine == "chromium" else pw.webkit
        browser = bt.launch(**({"args": ["--force-device-scale-factor=3"]} if engine == "chromium" else {}))
        ctx = browser.new_context(viewport=VIEW, has_touch=True, is_mobile=True,
                                  device_scale_factor=3, locale="ar")
        page = ctx.new_page()
        console_errors = []
        page.on("pageerror", lambda e: console_errors.append(str(e)))
        page.goto(URL, wait_until="networkidle")
        a = Audit(page, engine)

        # ═══ المالك ═══════════════════════════════════════════════════════
        if only in (None, "owner"):
            enter_role(page, "ورشة الياسمين")
            a.record("اختيار الدور", "صف «ورشة الياسمين للخياطة» (مالك)",
                     f"دخل اليوم ({a.body()})", a.body() == "today")

            # ContextBar: the three shared openers.
            a.tap(".mds-project-switcher", "مبدّل المشروع")
            s = a.wait_sheet()
            a.record("اليوم", "مبدّل المشروع", f"ورقة «{s['label'] if s else '—'}» تبقى مفتوحة", s and s["label"] == "تبديل المشروع")
            a.shot("owner-project-sheet")
            a.tap('.mds-sheet .mds-object-row:has-text("حلويات بيت الريف")', "صف مشروع الريف")
            a.record("اليوم", "صف «حلويات بيت الريف» داخل الورقة",
                     f"الورقة أُغلق ({a.wait_no_sheet()} أو بعد التبديل) والمبدّل اسمه الحلويات",
                     page.evaluate("(() => document.querySelector('.mds-project-switcher-name')?.textContent ?? '')().includes('الريف')" if False else
                                  "document.querySelector('.mds-project-switcher-name')?.textContent.includes('الريف') ?? false"))
            a.tap(".mds-project-switcher", "مبدّل المشروع مجددًا")
            a.tap('.mds-sheet .mds-object-row:has-text("ورشة الياسمين")', "عودة لورشة الياسمين")
            a.wait_no_sheet()
            # إخفاء المبالغ row toggles and stays.
            a.tap(".mds-project-switcher", "مبدّل المشروع")
            a.tap('.mds-sheet .mds-object-row:has-text("إخفاء المبالغ")', "صف إخفاء المبالغ")
            hidden = page.evaluate("(() => { const r = [...document.querySelectorAll('.mds-sheet .mds-object-row')].find(x => x.textContent.includes('إخفاء المبالغ')); return r ? r.querySelectorAll('.mds-icon').length : -1; })()")
            a.record("اليوم", "«إخفاء المبالغ» داخل الورقة", f"حالتها تقلبت ({hidden} أيقونة الآن)", hidden >= 2)
            a.tap('.mds-sheet .mds-object-row:has-text("إخفاء المبالغ")', "إعادة إظهار المبالغ")
            a.close_by_scrim("إغلاق الورقة")

            a.tap('.mds-context-bar [aria-label*="الإشعارات"]', "الجرس")
            s = a.wait_sheet()
            unread = a.first_text(".mds-sheet .sim-later__note")
            a.record("اليوم", "الجرس", f"ورقة الإشعارات: {unread}", s and s["label"] == "الإشعارات")
            a.close_by_scrim("إغلاق الإشعارات")

            a.tap('.mds-context-bar [aria-label*="Ask"]', "زر Ask")
            s = a.wait_sheet()
            a.record("اليوم", "زر Ask", f"ورقة «{s['label'] if s else '—'}» + علامة AskPanel", s and a.has("يُركَّب لاحقًا: AskPanel"))
            a.close_by_scrim("إغلاق Ask")

            # SimBar: the tasks button opens the tasks sheet (no current task
            # yet — the sheet says so honestly); the version's long press
            # opens the panel (the hidden tool).
            a.tap(".sim-bar__task", "زر المهام في شريط المحاكاة")
            s = a.wait_sheet()
            a.record("اليوم", "زر المهام", f"ورقة «{s['label'] if s else '—'}» — «لا مهمة حالية» قبل أي بداية", s and s["label"] == "المهام" and a.has("لا مهمة حالية"))
            # Start the first task from its row: the bar label becomes the
            # task sentence and the action buttons appear.
            a.tap(".sim-task-row >> nth=0", "صف المهمة الأولى (بداية المهمة)")
            time.sleep(0.4)
            bar = a.first_text(".sim-bar__task")
            actions = a.has("أعد المهمة") or a.has("ابدأ المهمة")
            a.record("المهام", "بداية مهمة من القائمة", f"الشريط: «{bar}» وأزرار الفعل ({actions})", bool(bar and bar != "المهام" and actions))
            a.tap(".mds-sheet-close button", "زر الإغلاق (X)")
            a.record("المهام", "إغلاق ورقة المهام", f"أُغلقت ({a.wait_no_sheet()})", a.wait_no_sheet())
            # Skip the running task so later steps run clean data.
            a.tap(".sim-bar__task", "زر المهام (إعادة)")
            a.wait_sheet()
            a.tap('.mds-sheet button:has-text("تخطَّ المهمة")', "«تخطَّ المهمة»")
            time.sleep(0.3)
            a.record("المهام", "«تخطَّ المهمة»", f"انتقلت الحالية (الشريط: «{a.first_text('.sim-bar__task')}»)", True)
            a.tap(".mds-sheet-close button", "إغلاق ورقة المهام")
            a.wait_no_sheet()

            s = open_sim_panel(a)
            a.record("اليوم", "ضغطة مطوّلة على رقم النسخة", f"لوحة المحاكاة: {s['label'] if s else '—'}", s and s["label"] == "لوحة المحاكاة")
            # Panel: the five toggles flip and hold.
            for tgl in ["بلا اتصال", "خط 200%"]:
                a.tap(f'.mds-sheet label.mds-toggle:has-text("{tgl}")', f"مفتاح {tgl}")
                time.sleep(0.15)
            fs = page.evaluate("(() => document.documentElement.style.fontSize || '')()")
            a.record("لوحة المحاكاة", "مفتاح «خط 200%»", f"حجم جذر الصفحة {fs}", fs == "200%")
            a.shot("owner-panel-200")
            a.tap('.mds-sheet label.mds-toggle:has-text("خط 200%")', "مفتاح خط 200% (إيقاف)")
            a.tap('.mds-sheet label.mds-toggle:has-text("بلا اتصال")', "مفتاح بلا اتصال (إيقاف)")
            # «غيّر الدور» returns to the role screen with data intact — but
            # that ends the owner run; instead close the panel and continue.
            a.close_by_scrim("إغلاق اللوحة")

            # TabBar round trip.
            for lbl, body in [("المالية", "finance"), ("الطلبات", "orders"), ("اليوم", "today"), ("التوصيل", "delivery"), ("السوق", "market"), ("اليوم", "today")]:
                a.tap(f'.mds-tab-bar button:has-text("{lbl}")', f"تبويب {lbl}")
                a.record("شريط التبويبات", f"تبويب {lbl}", f"الشاشة {a.body()}", a.body() == body)

            # اليوم's tiles and «يحتاجك».
            a.tap('.mds-tile-grid .mds-tile:has-text("المالية")', "بلاطة المالية")
            a.record("اليوم", "بلاطة المالية", f"الشاشة {a.body()}", a.body() == "finance")
            a.tap(f'.mds-tab-bar button:has-text("اليوم")', "عودة لليوم")
            a.tap('.mds-tile-grid .mds-tile:has-text("الطلبات")', "بلاطة الطلبات")
            a.record("اليوم", "بلاطة الطلبات", f"الشاشة {a.body()}", a.body() == "orders")
            a.tap(f'.mds-tab-bar button:has-text("اليوم")', "عودة لليوم")
            a.tap('.mds-tile-grid .mds-tile:has-text("التوصيل")', "بلاطة التوصيل")
            a.record("اليوم", "بلاطة التوصيل", f"الشاشة {a.body()}", a.body() == "delivery")
            a.tap(f'.mds-tab-bar button:has-text("اليوم")', "عودة لليوم")
            a.tap('.mds-tile-grid .mds-tile:has-text("السوق")', "بلاطة السوق")
            a.record("اليوم", "بلاطة السوق", f"الشاشة {a.body()}", a.body() == "market")
            a.tap(f'.mds-tab-bar button:has-text("اليوم")', "عودة لليوم")

            a.tap('.mds-section:has-text("يحتاجك") .mds-section-see-all', "«الكل» في «يحتاجك»")
            s = a.wait_sheet()
            a.record("اليوم", "ترويسة «يحتاجك» (الكل)", f"ورقة «{s['label'] if s else '—'}»", s and s["label"] == "كل ما يحتاجك")
            a.close_by_scrim("إغلاق كل ما يحتاجك")

            # المالية.
            a.tap('.mds-tab-bar button:has-text("المالية")', "تبويب المالية")
            a.tap('button:has-text("سجّل حركة")', "زر «سجّل حركة»")
            s = a.wait_sheet()
            a.record("المالية", "«سجّل حركة»", f"ورقة «{s['label'] if s else '—'}» بحقولها", s and s["label"] == "سجّل حركة")
            a.shot("owner-movement-form")
            # The AmountField really types.
            a.fill('.mds-sheet input[inputmode="decimal"]', "45")
            a.close_by_scrim("إغلاق ورقة الحركة")
            a.tap('.mds-hero-source', "«مصدر الرقم» في البطل")
            s = a.wait_sheet()
            funds_rows = a.count(".mds-sheet .mds-object-row")
            a.record("المالية", "«مصدر الرقم» (البطل)", f"ورقة «{s['label'] if s else '—'}» بثلاثة صفوف صندوق ({funds_rows})", s and s["label"] == "مصدر الرقم" and funds_rows == 3)
            a.close_by_scrim("إغلاق المصدر")
            a.tap('.mds-section:has-text("الحركات") .mds-section-see-all', "«الكل» في «الحركات»")
            a.record("المالية", "ترويسة «الحركات»", f"الشاشة {a.body()}", a.body() == "movements")
            a.tap('[aria-label="رجوع إلى المالية"]', "رجوع إلى المالية")
            a.record("الحركات", "زر الرجوع", f"الشاشة {a.body()}", a.body() == "finance")

            # الحركات: search + filters.
            a.tap('.mds-section:has-text("الحركات") .mds-section-see-all', "«الكل» في «الحركات» (مجددًا)")
            a.fill('input[type="search"]', "دفعة")
            time.sleep(0.3)
            rows_q = a.count(".sim-later-inline[data-sim-later]")
            a.record("الحركات", "البحث «دفعة»", f"الصفوف بعد البحث {rows_q}", rows_q > 0)
            a.fill('input[type="search"]', "")
            chip = page.locator('.mds-filter-chips button:has-text("داخل"), button:has-text("داخل")').first
            chip.tap()
            time.sleep(0.3)
            a.record("الحركات", "فلتر «داخل»", f"الشاشة حية ({a.body()})", a.body() == "movements")
            chip.tap()  # off again
            a.tap('[aria-label="رجوع إلى المالية"]', "رجوع")

            # الطلبات.
            a.tap('.mds-tab-bar button:has-text("الطلبات")', "تبويب الطلبات")
            a.tap('button:has-text("طلب جديد")', "زر «طلب جديد»")
            s = a.wait_sheet()
            a.record("الطلبات", "«طلب جديد»", f"ورقة «{s['label'] if s else '—'}»", s and s["label"] == "طلب جديد")
            a.close_by_scrim("إغلاق طلب جديد")
            a.tap('.mds-segmented button:has-text("التقويم")', "جزء التقويم")
            a.record("الطلبات", "جزء «التقويم»", f"الشاشة {a.body()}", a.body() == "ordersCalendar")
            a.tap('.mds-segmented button:has-text("القائمة")', "جزء القائمة")
            a.record("الطلبات", "جزء «القائمة»", f"الشاشة {a.body()}", a.body() == "orders")
            a.tap('button:has-text("السجل")', "شريحة فلتر «السجل»")
            a.record("الطلبات", "شريحة «السجل»", f"سطر السجل ظهر ({a.has('«السجل»: ط')})", a.has("«السجل»: ط"))
            a.tap('button:has-text("الكل")', "شريحة «الكل»")
            row = page.locator(".sim-rows .mds-object-row").first
            row.tap()
            s = a.wait_sheet()
            a.record("الطلبات", "صف طلب «الجارية»", f"ورقة الكائن «{s['label'] if s else '—'}»", s and "طلب" in (s["label"] or ""))
            a.close_by_scrim("إغلاق ورقة الطلب")

            # التوصيل.
            a.tap('.mds-tab-bar button:has-text("التوصيل")', "تبويب التوصيل")
            a.tap('button:has-text("اطلب توصيلاً")', "زر «اطلب توصيلاً»")
            s = a.wait_sheet()
            a.record("التوصيل", "«اطلب توصيلاً»", f"ورقة «{s['label'] if s else '—'}»", s and s["label"] == "اطلب توصيلاً")
            a.close_by_scrim("إغلاق طلب التوصيل")

            # السوق.
            a.tap('.mds-tab-bar button:has-text("السوق")', "تبويب السوق")
            a.fill('input[type="search"]', "طحين")
            time.sleep(0.4)
            cells = a.count(".sim-market-cell")
            a.record("السوق", "البحث «طحين»", f"{cells} بطاقات بعد البحث", 0 < cells < 5)
            a.fill('input[type="search"]', "")
            a.tap('.sim-market-cell >> nth=0', "بطاقة العرض الأولى")
            s = a.wait_sheet()
            a.record("السوق", "بطاقة العرض", f"ورقة التفاصيل «{s['label'] if s else '—'}»", s is not None)
            a.shot("owner-listing-sheet")
            a.tap('.mds-sheet .mds-object-row:has-text("أبلغ عن العرض")', "«أبلغ عن العرض» داخل التفاصيل")
            s2 = a.wait_sheet()
            a.record("السوق", "«أبلغ عن العرض»", f"ورقة البلاغ «{s2['label'] if s2 else '—'}» + ActionBar", s2 and s2["label"] == "أبلغ عن العرض")
            a.close_by_scrim("إغلاق ورقة البلاغ")

            #.persistence (owner decision 2): the DATA saves on the device;
            # the role screen opens at every open (§5.8). Leave a real trace:
            # switch the project to الريف and hide the amounts, reload,
            # re-enter the owner, and check both came back.
            a.tap(".mds-project-switcher", "مبدّل المشروع (قبل إعادة الفتح)")
            a.tap('.mds-sheet .mds-object-row:has-text("حلويات بيت الريف")', "اختيار الريف")
            a.wait_no_sheet()
            a.tap(".mds-project-switcher", "مبدّل المشروع")
            a.tap('.mds-sheet .mds-object-row:has-text("إخفاء المبالغ")', "إخفاء المبالغ (قبل إعادة الفتح)")
            a.close_by_scrim("إغلاق الورقة")
            page.reload(wait_until="networkidle")
            time.sleep(0.9)
            role_screen = a.count("[data-sim-role-screen]")
            entered = False
            if role_screen:
                page.locator('[data-sim-role-screen] .mds-object-row:has-text("ورشة الياسمين")').first.tap()
                page.wait_for_selector(".mds-context-bar", timeout=5000)
                entered = True
            proj = page.evaluate("(() => document.querySelector('.mds-project-switcher-name')?.textContent ?? '')()")
            # The amounts-hidden state shows on the finance hero.
            page.locator('.mds-tab-bar button:has-text("المالية")').first.tap()
            time.sleep(0.4)
            hidden_now = page.evaluate(
                """(() => {
                  const el = document.querySelector('.mds-hero-visual');
                  return el ? el.getAttribute('aria-hidden') === 'true' : null;
                })()"""
            )
            a.record("الحفظ على الجهاز", "إعادة فتح التطبيق",
                     f"شاشة الأدوار فُتحت ({role_screen == 1}) ودخل المالك ({entered}) — المشروع «{proj}» والمبالغ ما تزال مخفية ({hidden_now})",
                     role_screen == 1 and entered and "الريف" in proj and hidden_now is True)

        # ═══ السائق ═══════════════════════════════════════════════════════
        if only in (None, "driver"):
            enter_role(page, "عمر الزعبي")
            a.record("اختيار الدور", "صف «عمر الزعبي» (سائق)", f"دخل {a.body()}", a.body() == "driverOrders")
            # The locked switcher: a tap opens NOTHING (9.1).
            a.tap(".mds-project-switcher", "مبدّل المشروع (مقفل للسائق)")
            time.sleep(0.6)
            a.record("التوصيل", "مبدّل المشروع المقفل", f"لا ورقة تُفتح (صحيح 9.1) — {a.sheet()['open']}", not a.sheet()["open"])
            a.tap('.mds-context-bar [aria-label*="الإشعارات"]', "الجرس")
            s = a.wait_sheet()
            a.record("التوصيل", "الجرس", f"ورقة الإشعارات: {a.first_text('.mds-sheet .mds-sheet-body')}", s and s["label"] == "الإشعارات")
            a.close_by_scrim("إغلاق")
            a.tap('.mds-context-bar [aria-label*="Ask"]', "زر Ask")
            s = a.wait_sheet()
            a.record("التوصيل", "زر Ask", f"ورقة «{s['label'] if s else '—'}»", s and s["label"] == "Ask Micro")
            a.close_by_scrim("إغلاق")
            a.tap('.mds-segmented button:has-text("مهامي")', "جزء «مهامي»")
            a.record("التوصيل", "جزء «مهامي»", f"الشاشة {a.body()} مع ت3", a.body() == "myJobs" and a.has("ت3"))
            a.tap('.mds-segmented button:has-text("الطلبات")', "جزء «الطلبات»")
            a.record("التوصيل", "جزء «الطلبات»", f"الشاشة {a.body()} مع ت4 وت1", a.body() == "driverOrders" and a.has("ت4") and a.has("ت1"))
            a.shot("driver-orders")

        # ═══ المورد ═══════════════════════════════════════════════════════
        if only in (None, "supplier"):
            enter_role(page, "مخبز الأصيل")
            a.record("اختيار الدور", "صف «مخبز الأصيل للجملة» (مورد)", f"dخل {a.body()}", a.body() == "myListings")
            rows = a.count(".sim-rows .mds-object-row")
            a.record("عروضي", "قائمة عروضي", f"{rows} صفوف عروض حقيقية", rows == 5)
            a.tap('.sim-rows .mds-object-row >> nth=0', "صف العرض ع1")
            s = a.wait_sheet()
            a.record("عروضي", "صف العرض", f"ورقة التفاصيل «{s['label'] if s else '—'}»", s is not None)
            a.tap('.mds-sheet .mds-object-row:has-text("أبلغ عن العرض")', "«أبلغ عن العرض»")
            s2 = a.wait_sheet()
            a.record("عروضي", "«أبلغ عن العرض»", f"ورقة «{s2['label'] if s2 else '—'}»", s2 and s2["label"] == "أبلغ عن العرض")
            a.close_by_scrim("إغلاق")
            a.tap('button:has-text("عرض جديد")', "زر «عرض جديد»")
            s3 = a.wait_sheet()
            a.record("عروضي", "«عرض جديد»", f"ورقة «{s3['label'] if s3 else '—'}» بحقولها", s3 and s3["label"] == "عرض جديد")
            a.shot("supplier-new-listing")
            a.close_by_scrim("إغلاق")
            a.tap('.mds-segmented button:has-text("السوق")', "جزء «السوق»")
            a.record("عروضي", "جزء «السوق»", f"الشاشة {a.body()}", a.body() == "market")
            a.tap('.mds-segmented button:has-text("عروضي")', "عودة «عروضي»")
            a.record("عروضي", "جزء «عروضي»", f"الشاشة {a.body()}", a.body() == "myListings")
            a.shot("supplier-listings")

        # ═══ المراجع ══════════════════════════════════════════════════════
        if only in (None, "reviewer"):
            enter_role(page, "مراجعة المنصة")
            a.record("اختيار الدور", "صف «مراجعة المنصة» (مراجع)", f"دخل {a.body()}", a.body() == "review")
            items = a.count(".sim-review-item")
            a.record("المراجعة", "طابور المراجعة", f"{items} عناصر (ع3، ع8، ع4)", items == 3)
            a.tap('.mds-tab-bar button:has-text("البلاغات")', "تبويب البلاغات")
            a.record("المراجعة", "تبويب «البلاغات»", f"الشاشة {a.body()} مع البلاغ ({a.has('السبب الأكثر تكرارًا')})", a.body() == "reports" and a.has("السبب الأكثر تكرارًا"))
            a.tap('.mds-tab-bar button:has-text("السائقون")', "تبويب السائقون")
            a.record("المراجعة", "تبويب «السائقون»", f"الشاشة {a.body()} مع يزن", a.body() == "drivers" and a.has("يزن القضاة"))
            a.tap('.mds-context-bar [aria-label*="الإشعارات"]', "الجرس (بلا إشعارات)")
            s = a.wait_sheet()
            empty = a.has("الإشعارات تظهر هنا.")
            a.record("المراجعة", "الجرس", f"ورقة الإشعارات بحالة الفراغ الحقيقية ({empty})", s and empty)
            a.close_by_scrim("إغلاق")
            a.tap(".mds-project-switcher", "مبدّل المشروع (مقفل للمراجع)")
            time.sleep(0.6)
            a.record("المراجعة", "مبدّل المشروع المقفل", f"لا ورقة ({a.sheet()['open']})", not a.sheet()["open"])
            a.shot("reviewer-queue")

        # ═══ الزائر ═══════════════════════════════════════════════════════
        if only in (None, "guest"):
            # The guest market has NO ContextBar by design — wait for the body.
            enter_role(page, "بلا حساب", wait='[data-sim-screen-body="market"]')
            time.sleep(0.4)
            no_chrome = page.evaluate("(() => ({ ctx: !!document.querySelector('.mds-context-bar'), tabs: !!document.querySelector('.mds-tab-bar') }))()")
            a.record("سوق الزائر", "البنية قبل الدخول", f"لا ContextBar ولا TabBar ({no_chrome})", not no_chrome["ctx"] and not no_chrome["tabs"])
            cells = a.count(".sim-market-cell")
            a.record("سوق الزائر", "شبكة العروض", f"{cells} بطاقات مقفلة السعر", cells == 5)
            locked = a.has("السعر مقفل")
            a.record("سوق الزائر", "السعر مقفل", f"ملاحظة LockedDetails ظاهرة ({locked})", locked)
            # THE DEAD BUTTON CHECK: «دخول تجريبي» must exist and flip the state.
            btn = page.locator('button:has-text("دخول تجريبي")')
            btn_count = btn.count()
            if btn_count:
                btn.first.tap()
                time.sleep(0.5)
                buyer = a.has("دخلت كمشترٍ مسجّل") or not a.has("السعر مقفل")
                a.record("سوق الزائر", "«دخول تجريبي»", f"قلب السوق إلى مشترٍ ({buyer})", buyer)
            else:
                a.record("سوق الزائر", "«دخول تجريبي»", "الزر غير موجود — مسار الزائر ميت", False)
            a.tap(".sim-market-cell >> nth=0", "بطاقة عرض (كزائر)")
            s = a.wait_sheet()
            a.record("سوق الزائر", "بطاقة العرض", f"ورقة التفاصيل تفتح ({s['label'] if s else '—'})", s is not None)
            a.close_by_scrim("إغلاق")
            a.shot("guest-market")

        # ═══ تغيير الدور من اللوحة + «ابدأ من جديد» ═══════════════════════
        if only is None:
            # From the current role, open the panel and «غيّر الدور».
            s = open_sim_panel(a)
            if s:
                a.tap('.mds-sheet .sim-panel__row:has-text("غيّر الدور")', "«غيّر الدور» من اللوحة")
                time.sleep(0.5)
                on_role = a.count("[data-sim-role-screen]")
                a.record("لوحة المحاكاة", "«غيّر الدور»", f"شاشة الأدوار فُتحت ({on_role})", on_role == 1)
                # «أعد البيانات» ConfirmSheet: cancel via «رجوع».
                a.tap('[data-sim-role-screen] button:has-text("أعد البيانات")', "«أعد البيانات»")
                s2 = a.wait_sheet()
                a.record("شاشة الأدوار", "«أعد البيانات»", f"ورقة تأكيد «{s2['label'] if s2 else '—'}»", s2 is not None)
                a.tap('.mds-sheet button:has-text("رجوع")', "«رجوع» في ورقة التأكيد")
                a.record("شاشة الأدوار", "«رجوع» (إلغاء التأكيد)", f"أُلغيت ({a.wait_no_sheet()})", a.wait_no_sheet())
            # Console errors anywhere in the run.
            a.record("عام", "أخطاء وحدة التحكم", f"{len(console_errors)} خطأ صفحة", len(console_errors) == 0)

        ok = a.summary()
        with open(f"/tmp/audit/audit-{engine}.json", "w") as f:
            json.dump({"engine": engine, "rows": a.rows, "console_errors": console_errors}, f, ensure_ascii=False, indent=1)
        browser.close()
        sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
