#!/usr/bin/env python3
"""touch_day.py — «جولة المستخدم»: live a FULL DAY of every role with real
touch (tap(), hasTouch+isMobile, 390×844) on Chromium and WebKit, at 100%
and 200% font. Each role follows its real §5.1 journeys end to end — the
owner's Friday, the driver's jobs, the supplier's listings, the reviewer's
queue, the visitor's market — tapping every step a real person would tap,
screenshotting the key moments and recording what happens at each step.

Usage:
  uv run python ds/sim/tools/touch_day.py <chromium|webkit> [font%] [--only ROLE]

Screenshots: /tmp/day/<engine>-<font>-<role>-NN.png
Observations: printed lines «[الدور · الشاشة] ما حدث».
"""
import glob
import json
import os
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sim_server import SIM_URL, serve  # noqa: E402

from playwright.sync_api import sync_playwright  # noqa: E402

VIEW = {"width": 390, "height": 844}
SHOT_DIR = "/tmp/day"


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


class Day:
    """One role's day: the person, their steps, their eyes."""

    def __init__(self, page, engine, font, role):
        self.page = page
        self.engine = engine
        self.font = font
        self.role = role
        self.n = 0
        self.problems = []

    # ── actions ────────────────────────────────────────────────────────
    def tap(self, sel, label):
        el = self.page.locator(sel).first
        el.scroll_into_view_if_needed()
        el.wait_for(state="visible", timeout=6000)
        el.tap(timeout=6000)
        time.sleep(0.25)

    def tap_xy(self, x, y, label):
        self.page.touchscreen.tap(x, y)
        time.sleep(0.25)

    def fill(self, sel, text):
        el = self.page.locator(sel).first
        el.scroll_into_view_if_needed()
        el.wait_for(state="visible", timeout=6000)
        el.fill(text)
        time.sleep(0.15)

    def shot(self, name):
        self.n += 1
        path = f"{SHOT_DIR}/{self.engine}-{self.font}-{self.role}-{self.n:02d}-{name}.png"
        self.page.screenshot(path=path)
        return path

    def scroll_top(self):
        self.page.evaluate("() => window.scrollTo(0, 0)")
        time.sleep(0.15)

    # ── probes ─────────────────────────────────────────────────────────
    def screen(self):
        return self.page.evaluate(
            "(() => document.querySelector('[data-sim-screen]')?.getAttribute('data-sim-screen') ?? null)()"
        )

    def sheet(self):
        return self.page.evaluate(
            """(() => {
              const s = document.querySelector('.mds-sheet');
              if (!s) return { open: false };
              return { open: true, label: s.getAttribute('aria-label'),
                       closing: s.className.includes('mds-sheet--closing') };
            })()"""
        )

    def has(self, text):
        return self.page.evaluate("(t) => document.body.innerText.includes(t)", text)

    def text_of(self, sel):
        return self.page.evaluate(
            "(s) => document.querySelector(s)?.textContent?.trim().slice(0, 160) ?? null", sel
        )

    def overflow(self):
        return self.page.evaluate(
            "(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)()"
        )

    def wait_sheet(self, ms=2500):
        t0 = time.time()
        while time.time() - t0 < ms / 1000:
            s = self.sheet()
            if s["open"] and not s["closing"]:
                return s
            time.sleep(0.05)
        return None

    def wait_no_sheet(self, ms=2500):
        t0 = time.time()
        while time.time() - t0 < ms / 1000:
            if not self.sheet()["open"]:
                return True
            time.sleep(0.05)
        return False

    def close_sheet(self):
        y = self.page.evaluate(
            """(() => {
              const p = document.querySelector('.mds-sheet-panel');
              const top = p ? p.getBoundingClientRect().top : 300;
              return Math.max(12, Math.round(top) - 40);
            })()"""
        )
        self.tap_xy(195, y, "خلف الورقة")
        time.sleep(0.2)
        self.wait_no_sheet()

    def note(self, text):
        print(f"  [{self.role} · {text}]")

    def problem(self, text):
        self.problems.append(f"{self.role}: {text}")
        print(f"  ⚠ [{self.role}] {text}")

    def say(self, text):
        print(f"  · {text}")


def reset_and_enter(page, role_row, wait=".mds-context-bar"):
    page.evaluate("() => window.localStorage.clear()")
    page.reload(wait_until="networkidle")
    page.wait_for_selector("[data-sim-role-screen]", timeout=10000)
    page.locator(f'[data-sim-role-screen] .mds-object-row:has-text("{role_row}")').first.tap()
    page.wait_for_selector(wait, timeout=6000)
    time.sleep(0.3)


# ═════════════════════════ الأيام ═════════════════════════

def owner_day(a: Day):
    a.say("— يوم المالك: الجمعة، ورشة الياسمين للخياطة")
    reset_and_enter(a.page, "ورشة الياسمين")
    a.shot("today")
    ov = a.overflow()
    if ov > 0:
        a.problem(f"مشروع اليوم: تجاوز أفقي {ov}px")
    a.note("مشروع اليوم يفتح أول شاشة")
    # «الآن» — اليوم فيه جلسة قياس 11:00 ص وفستان سهرة 4:00 م
    a.say(f"«الآن» في الصفحة؟ {a.has('الآن')}")
    # افتح أول بطاقة «يحتاجك» — عرض ت1
    if a.has("عرض سعر وصل"):
        a.tap("text=عرض سعر وصل", "بطاقة «يحتاجك»: عرض ت1")
        s = a.wait_sheet()
        if s:
            a.shot("needs-you-quote-sheet")
            a.note(f"ورقة الكائن فتحت: {s['label']}")
            a.close_sheet()
        else:
            a.problem("بطاقة عرض ت1 لا تفتح ورقة")
    else:
        a.note("لا بطاقة «عرض سعر وصل» في مشروع اليوم")
    # «الكل» في يحتاجك
    if a.has("الكل"):
        pass  # tested separately in the audit
    # ← تبويب التوصيل: تقبل عرض عمر
    a.tap('[role="tab"]:has-text("التوصيل")', "تبويب التوصيل")
    a.shot("delivery")
    a.say(f"شاشة التوصيل: {a.screen()}")
    if a.has("اقبل العرض"):
        a.tap('button:has-text("اقبل العرض")', "اقبل عرض 3 د على ت1")
        time.sleep(0.4)
        a.shot("delivery-accepted")
        a.say(f"بعد القبول: تظهر «مقبول»؟ {a.has('مقبول')}")
    else:
        a.problem("التوصيل: لا زر «اقبل العرض» ظاهر")
    # ← المالية: الرصيد والصناديق والديون، وسجّل دفعة
    a.tap('[role="tab"]:has-text("المالية")', "تبويب المالية")
    a.shot("finance")
    a.say(f"الرصيد الظاهر يحوي 595.500؟ {a.has('595.500')}")
    a.say(f"المحفظة السالبة ظاهرة؟ {a.has('−3')}")
    # افتح د2 (متأخر)
    if a.has("متأخر"):
        a.tap("text=متأخر", "الدين المتأخر د2")
        s = a.wait_sheet()
        if s:
            a.shot("debt-overdue-sheet")
            a.note(f"ورقة الدين فتحت: {s['label']}")
            a.close_sheet()
    # سجّل دفعة على د1 من قسم الديون
    if a.has("سجّل دفعة"):
        a.tap('button:has-text("سجّل دفعة")', "سجّل دفعة")
        s = a.wait_sheet()
        if s:
            a.shot("payment-sheet")
            a.note(f"ورقة الدفعة: {s['label']}")
            a.close_sheet()
    # «سجّل حركة»: مصروف واقعي
    if a.has("سجّل حركة"):
        a.tap('button:has-text("سجّل حركة")', "سجّل حركة")
        s = a.wait_sheet()
        if s:
            a.shot("movement-sheet")
            a.note(f"ورقة الحركة: {s['label']}")
            a.close_sheet()
    # ← الطلبات
    a.tap('[role="tab"]:has-text("الطلبات")', "تبويب الطلبات")
    a.shot("orders")
    # افتح طلب 1175 الجاهز
    if a.has("1175"):
        a.tap("text=1175", "بطاقة طلب 1175")
        s = a.wait_sheet()
        if s:
            a.shot("order-1175-sheet")
            a.note(f"ورقة الطلب: {s['label']}")
            a.close_sheet()
    # ← السوق
    a.tap('[role="tab"]:has-text("السوق")', "تبويب السوق")
    a.shot("market")
    # افتح ع1
    if a.has("طحين"):
        a.tap("text=طحين", "بطاقة ع1")
        s = a.wait_sheet()
        if s:
            a.shot("listing-1-sheet")
            a.note(f"ورقة العرض: {s['label']}")
            a.close_sheet()
    # ← الجرس
    a.tap('.mds-context-bar [aria-label*="الإشعارات"]', "الجرس")
    s = a.wait_sheet()
    if s:
        a.shot("bell")
        a.note(f"الجرس: {s['label']}")
        a.close_sheet()
    # ← Ask
    a.tap('.mds-context-bar [aria-label*="Ask"]', "زر Ask")
    s = a.wait_sheet()
    if s:
        a.shot("ask")
        a.note(f"Ask: {s['label']}")
        a.close_sheet()
    # ← تبديل المشروع
    a.tap(".mds-project-switcher", "مبدّل المشروع")
    s = a.wait_sheet()
    if s:
        a.tap('.mds-sheet .mds-object-row:has-text("حلويات بيت الريف")', "حلويات بيت الريف")
        time.sleep(0.5)
        a.shot("reef-today")
        a.say(f"بعد التبديل: 170 ظاهرة؟ {a.has('170')}")
        a.note("تبديل المشروع يعيد بياناته")


def driver_day(a: Day):
    a.say("— يوم السائق: عمر الزعبي")
    reset_and_enter(a.page, "عمر الزعبي")
    a.shot("orders")
    a.note(f"أول شاشة: {a.screen()}")
    # ت4: أرسل عرضًا
    if a.has("صالون لمسة"):
        a.say("يرى طلب صالون لمسة (ت4)")
        if a.has("أرسل العرض"):
            a.tap('button:has-text("أرسل العرض")', "أرسل العرض على ت4")
            s = a.wait_sheet()
            if s:
                a.shot("quote-sheet-t4")
                a.note(f"ورقة العرض الجديد: {s['label']}")
                a.close_sheet()
        else:
            a.problem("ت4 بلا زر «أرسل العرض»")
    # ت1: بانتظار قرار المالك
    a.say(f"يرى «بانتظار قرار المالك»؟ {a.has('بانتظار قرار المالك')}")
    # مهامي
    seg = a.page.locator('[role="tablist"] button:has-text("مهامي")')
    if seg.count():
        seg.first.tap()
        time.sleep(0.3)
    a.shot("myjobs")
    # ت3: تمّ + إثبات
    if a.has("تمّ") or a.has("لم أستطع"):
        a.say("ت3 جارية مع أزرارها")
        a.shot("job-t3")
    # السجل
    if a.has("السجل"):
        a.tap("text=السجل", "فتح «السجل»")
        time.sleep(0.3)
        a.shot("job-log")
        a.say(f"السجل فتح: ت2 ظاهر؟ {a.has('ت2')}")
    # الجرس والـAsk
    a.tap('.mds-context-bar [aria-label*="الإشعارات"]', "الجرس")
    s = a.wait_sheet()
    if s:
        a.shot("bell")
        a.close_sheet()
    a.tap('.mds-context-bar [aria-label*="Ask"]', "زر Ask")
    s = a.wait_sheet()
    if s:
        a.shot("ask")
        a.close_sheet()


def supplier_day(a: Day):
    a.say("— يوم المورد: مخبز الأصيل للجملة")
    reset_and_enter(a.page, "مخبز الأصيل")
    a.shot("listings")
    a.note(f"أول شاشة: {a.screen()}")
    a.say(f"يرى عروضه الخمسة؟ {a.has('ع3') and a.has('ع5')}")
    # افتح ع3 قيد المراجعة
    if a.has("قيد المراجعة"):
        a.tap("text=قيد المراجعة", "صف ع3 قيد المراجعة")
        s = a.wait_sheet()
        if s:
            a.shot("listing-review-sheet")
            a.note(f"ورقة العرض: {s['label']}")
            a.close_sheet()
    # عرض جديد
    if a.has("عرض جديد"):
        a.tap('button:has-text("عرض جديد")', "«عرض جديد»")
        time.sleep(0.4)
        a.shot("new-listing")
        a.note(f"بعد «عرض جديد»: الشاشة {a.screen()}، ورقة {a.sheet()['label'] if a.sheet()['open'] else 'لا'}")
        if a.sheet()["open"]:
            a.close_sheet()
    # السوق
    seg = a.page.locator('[role="tablist"] button:has-text("السوق")')
    if seg.count():
        seg.first.tap()
        time.sleep(0.3)
    a.shot("market")
    a.say(f"سوق المورد: {a.screen()}")
    # الجرس
    a.tap('.mds-context-bar [aria-label*="الإشعارات"]', "الجرس")
    s = a.wait_sheet()
    if s:
        a.shot("bell")
        a.close_sheet()


def reviewer_day(a: Day):
    a.say("— يوم المراجع: مراجعة المنصة")
    reset_and_enter(a.page, "مراجعة المنصة")
    a.shot("review")
    a.note(f"أول شاشة: {a.screen()}")
    # ع3: الرفض مع السبب
    if a.has("ع3"):
        a.tap("text=ع3", "صف ع3")
        s = a.wait_sheet()
        if s:
            a.shot("review-3-sheet")
            a.note(f"ورقة ع3: {s['label']}")
            a.close_sheet()
    # البلاغات
    a.tap('[role="tab"]:has-text("البلاغات")', "تبويب البلاغات")
    a.shot("reports")
    a.say(f"ع6 ببلاغاته ظاهر؟ {a.has('ع6')}")
    # السائقون
    a.tap('[role="tab"]:has-text("السائقون")', "تبويب السائقين")
    a.shot("drivers")
    a.say(f"يزن ظاهر؟ {a.has('يزن القضاة')}")
    if a.has("يزن القضاة"):
        a.tap("text=يزن القضاة", "صف يزن")
        s = a.wait_sheet()
        if s:
            a.shot("driver-approval-sheet")
            a.close_sheet()
    # الجرس الفارغ
    a.tap('.mds-context-bar [aria-label*="الإشعارات"]', "الجرس (فارغ)")
    s = a.wait_sheet()
    if s:
        a.shot("bell-empty")
        a.say(f"الجرس الفارغ: {s['label']}")
        a.close_sheet()


def guest_day(a: Day):
    a.say("— يوم الزائر ثم المشتري")
    reset_and_enter(a.page, "بلا حساب", wait="[data-sim-screen]")
    a.shot("market")
    ov = a.overflow()
    if ov > 0:
        a.problem(f"سوق الزائر: تجاوز أفقي {ov}px")
    a.note(f"أول شاشة: {a.screen()}")
    a.say(f"السعر مقفول للزائر؟ يرى «السعر» نصًا؟")
    body = a.page.evaluate("() => document.body.innerText")
    a.say(f"«595.500» في سوق الزائر؟ {a.has('595.500')} (يجب أن لا)")
    # افتح ع1
    if a.has("طحين"):
        a.tap("text=طحين", "بطاقة ع1")
        s = a.wait_sheet()
        if s:
            a.shot("listing-locked")
            a.note(f"ورقة ع1 للزائر: {s['label']}")
            a.close_sheet()
    # دخول تجريبي
    if a.has("دخول تجريبي"):
        a.tap('button:has-text("دخول تجريبي")', "دخول تجريبي")
        time.sleep(0.5)
        a.shot("buyer-market")
        a.say(f"بعد الدخول: الأسعار ظاهرة (22 د)؟ {a.has('22')}")
        # افتح ع1 كمشترٍ
        if a.has("طحين"):
            a.tap("text=طحين", "بطاقة ع1 كمشترٍ")
            s = a.wait_sheet()
            if s:
                a.shot("buyer-listing")
                a.note(f"ورقة ع1 للمشتري: {s['label']}")
                a.close_sheet()
    else:
        a.problem("لا زر «دخول تجريبي» للزائر")


DAYS = {"owner": owner_day, "driver": driver_day, "supplier": supplier_day,
        "reviewer": reviewer_day, "guest": guest_day}


def main():
    engine = sys.argv[1] if len(sys.argv) > 1 else "chromium"
    font = sys.argv[2] if len(sys.argv) > 2 and not sys.argv[2].startswith("--") else "100"
    only = sys.argv[sys.argv.index("--only") + 1] if "--only" in sys.argv else None
    if engine == "webkit":
        apply_webkit_env()
    os.makedirs(SHOT_DIR, exist_ok=True)
    serve(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist")))

    with sync_playwright() as pw:
        bt = pw.chromium if engine == "chromium" else pw.webkit
        browser = bt.launch()
        ctx = browser.new_context(viewport=VIEW, has_touch=True, is_mobile=True,
                                  device_scale_factor=2, locale="ar")
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(SIM_URL, wait_until="networkidle")

        if font != "100":
            # Turn on خط 200% via the sim panel (long-press the version badge).
            page.wait_for_selector("[data-sim-role-screen]", timeout=10000)
            page.locator("[data-sim-version]").first.click(delay=800)
            t0 = time.time()
            while time.time() - t0 < 3:
                if page.evaluate("() => !!document.querySelector('.mds-sheet')"):
                    break
                time.sleep(0.05)
            sw = page.locator('.mds-sheet [role="switch"]:has-text("خط 200%")')
            if not sw.count():
                sw = page.locator('.mds-sheet [role="switch"]').last
            sw.first.tap()
            time.sleep(0.4)
            page.touchscreen.tap(195, 120)
            time.sleep(0.4)
            page.reload(wait_until="networkidle")

        roles = [only] if only else list(DAYS)
        for role in roles:
            a = Day(page, engine, font, role)
            print(f"\n══ {engine} · خط {font}% · {role} ══")
            try:
                DAYS[role](a)
            except Exception as e:
                a.problem(f"انكسر اليوم: {type(e).__name__}: {str(e)[:160]}")
            if a.overflow() > 0:
                a.problem(f"نهاية اليوم: تجاوز أفقي {a.overflow()}px")
            for p in a.problems:
                print(f"PROBLEM: {p}")
        if errors:
            print("\nPAGE ERRORS:", errors)
        browser.close()
    print(f"\nالصور في {SHOT_DIR}")


if __name__ == "__main__":
    main()
