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
        """Tap the FIRST VISIBLE match (a hidden twin of the same text —
        e.g. an ended offer's button inside the sheet — times out a blind
        locator.tap); falls back to a real-coordinate tap when Playwright's
        actionability checks stall."""
        loc = self.page.locator(sel)
        try:
            n = loc.count()
        except Exception:
            n = 0
        if n == 0:
            raise RuntimeError(f"العنصر غير موجود: {sel}")
        target = loc.first
        for i in range(min(n, 10)):
            el = loc.nth(i)
            try:
                if el.is_visible():
                    target = el
                    break
            except Exception:
                continue
        try:
            target.scroll_into_view_if_needed(timeout=3000)
            target.tap(timeout=4000)
            time.sleep(0.25)
            return
        except Exception:
            box = target.bounding_box()
            if box:
                self.page.touchscreen.tap(
                    box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
                time.sleep(0.25)
                return
            raise

    def tap_xy(self, x, y, label):
        self.page.touchscreen.tap(x, y)
        time.sleep(0.25)

    def tap_card(self, mark: str, contains: str, label: str, expect_sheet: str | None = None):
        """Tap a data-sim-later card by its marker + text, with a settle wait
        and a sheet-label check + one retry — the entry animations and the
        task toast shift the layout in the first seconds after entering a
        role, so a blind rect tap can land on the wrong card."""
        time.sleep(0.4)
        for attempt in range(2):
            card = self.page.evaluate(
                """([mark, contains]) => { const el = [...document
                     .querySelectorAll(`[data-sim-later="${mark}"]`)]
                     .find(e => e.innerText.includes(contains));
                     if (!el) return null; el.scrollIntoView({ block: 'center' });
                     const r = el.getBoundingClientRect();
                     return { x: Math.round(r.left + r.width / 2),
                              y: Math.round(r.top + r.height / 2) }; }""",
                [mark, contains])
            if not card:
                self.problem(f"لا بطاقة {mark} تحوي «{contains}»")
                return None
            self.tap_xy(card["x"], card["y"], label)
            time.sleep(0.4)
            s = self.wait_sheet()
            if s and (expect_sheet is None or expect_sheet in (s["label"] or "")):
                return s
            if self.sheet()["open"]:
                self.close_sheet()
        self.problem(f"بطاقة «{contains}» لم تفتح ورقتها {expect_sheet or ''}")
        return None

    def tap_row(self, contains: str, label: str, expect_sheet: str | None = None, also: str | None = None):
        """Tap an ObjectRow by its label text (scroll it into view first —
        the debt rows sit below the fold), with a sheet-label retry like
        tap_card. `also` disambiguates: the row must contain BOTH strings
        (the movement «داخل · سلمى الحوراني» shares the debt's party name)."""
        time.sleep(0.3)
        for attempt in range(2):
            row = self.page.evaluate(
                """([contains, also]) => { const el = [...document
                     .querySelectorAll('.mds-object-row')]
                     .find(e => e.innerText.includes(contains)
                            && (!also || e.innerText.includes(also)));
                     if (!el) return null; el.scrollIntoView({ block: 'center' });
                     const r = el.getBoundingClientRect();
                     return { x: Math.round(r.left + r.width / 2),
                              y: Math.round(r.top + r.height / 2) }; }""",
                [contains, also])
            if not row:
                self.problem(f"لا صفًّا يحوي «{contains}»")
                return None
            self.tap_xy(row["x"], row["y"], label)
            time.sleep(0.4)
            s = self.wait_sheet()
            if s and (expect_sheet is None or expect_sheet in (s["label"] or "")):
                return s
            if self.sheet()["open"]:
                self.close_sheet()
        self.problem(f"الصف «{contains}» لم يفتح ورقته {expect_sheet or ''}")
        return None

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
        """Close whatever opened — scrim tap, then the X, then Escape. An
        in-sheet action can RE-MOUNT the sheet (a fresh 350ms settle window
        then swallows the FIRST scrim tap — the guard being right about
        double-taps), so the fallbacks matter."""
        for attempt in range(3):
            if not self.sheet()["open"]:
                return True
            if attempt == 0:
                y = self.page.evaluate(
                    """(() => {
                      const all = [...document.querySelectorAll('.mds-sheet-panel')];
                      const p = all[all.length - 1];
                      const top = p ? p.getBoundingClientRect().top : 300;
                      return Math.max(12, Math.round(top) - 40);
                    })()"""
                )
                self.tap_xy(195, y, "خلف الورقة")
            elif attempt == 1:
                self.page.evaluate(
                    """(() => { const b = document.querySelector('.mds-sheet-close button')
                               || [...document.querySelectorAll('.mds-sheet button')]
                                    .find(x => ['إغلاق','إلغاء'].some(t => x.textContent.includes(t)));
                               if (b) b.click(); })()"""
                )
            else:
                self.page.keyboard.press("Escape")
            self.wait_no_sheet(1400)
        return not self.sheet()["open"]

    def note(self, text):
        print(f"  [{self.role} · {text}]")

    def problem(self, text):
        self.problems.append(f"{self.role}: {text}")
        print(f"  ⚠ [{self.role}] {text}")

    def say(self, text):
        print(f"  · {text}")


def reset_and_enter(page, role_row, wait=".mds-context-bar", font="100"):
    page.evaluate("() => window.localStorage.clear()")
    if font != "100":
        # ضبط الخط عبر نفس مفتاح التخزين الذي تحفظ به المحاكاة هويتها —
        # شارة شاشة الأدوار بلا لمس مطوّل عمدًا (اللوحة من داخل أي دور).
        page.evaluate(
            """(font) => { const key = 'micro-sim:v1';
                 const raw = localStorage.getItem(key);
                 let env = { version: 1, state: {} };
                 try { env = JSON.parse(raw) || env; } catch { }
                 env.state = { ...env.state, identity: { ...(env.state?.identity ?? {}), fontScale: Number(font) } };
                 localStorage.setItem(key, JSON.stringify(env)); }""",
            font)
    page.reload(wait_until="networkidle")
    page.wait_for_selector("[data-sim-role-screen]", timeout=10000)
    page.locator(f'[data-sim-role-screen] .mds-object-row:has-text("{role_row}")').first.tap()
    page.wait_for_selector(wait, timeout=6000)
    time.sleep(0.3)


# ═════════════════════════ الأيام ═════════════════════════

def owner_day(a: Day):
    a.say("— يوم المالك: الجمعة، ورشة الياسمين للخياطة")
    reset_and_enter(a.page, "ورشة الياسمين", font=a.font)
    a.shot("today")
    ov = a.overflow()
    if ov > 0:
        a.problem(f"مشروع اليوم: تجاوز أفقي {ov}px")
    a.note("مشروع اليوم يفتح أول شاشة")
    # «الآن» — اليوم فيه جلسة قياس 11:00 ص وفستان سهرة 4:00 م
    a.say(f"«الآن» في الصفحة؟ {a.has('الآن')}")
    # افتح أول بطاقة «يحتاجك» — عرض ت1 الساري
    if a.has("عرض سعر ساري"):
        s = a.tap_card("QuoteCard", "ت1", "بطاقة «يحتاجك»: عرض ت1", expect_sheet="ت1")
        if s:
            a.shot("needs-you-quote-sheet")
            a.note(f"ورقة الكائن فتحت: {s['label']}")
            a.close_sheet()
    else:
        a.note("لا بطاقة «عرض سعر ساري» في مشروع اليوم")
    # «الكل» في يحتاجك
    if a.has("الكل"):
        pass  # tested separately in the audit
    # ← تبويب التوصيل: تفتح بطاقة ت1 الورقة فيها «اقبل العرض» (ر4.1)
    a.tap('[role="tab"]:has-text("التوصيل")', "تبويب التوصيل")
    a.shot("delivery")
    a.say(f"شاشة التوصيل: {a.screen()}")
    s2 = a.tap_card("DeliveryRequestCard", "ت1", "بطاقة ت1", expect_sheet="ت1")
    if s2:
        a.shot("delivery-sheet")
        a.note(f"ورقة ت1: {s2['label']}")
        if a.has("اقبل العرض"):
            a.tap('button:has-text("اقبل العرض")', "اقبل عرض 3 د على ت1")
            time.sleep(0.4)
            a.shot("delivery-accepted")
            a.say(f"بعد القبول: «مقبول»؟ {a.has('مقبول') or a.has('بانتظار بدء السائق')}")
        a.close_sheet()
    # ← المالية: الرصيد والصناديق والديون — ودفع د1 من ورقته (ر2.2)
    a.tap('[role="tab"]:has-text("المالية")', "تبويب المالية")
    a.shot("finance")
    a.say(f"الرصيد الظاهر يحوي 595.500؟ {a.has('595.500')}")
    a.say(f"المحفظة السالبة ظاهرة؟ {a.has('−3')}")
    # د2 المتأخر: ورقته من صفّه (تمرير ثم لمس — قسم الديون تحت الطية)
    s = a.tap_row("أبو محمد", "صف د2 المتأخر", expect_sheet="د2", also="متأخر")
    if s:
        a.shot("debt-overdue-sheet")
        a.note(f"ورقة الدين فتحت: {s['label']}")
        a.close_sheet()
    # سجّل دفعة على د1: من ورقة دين د1 (ر2.2: 35 من 45 يبقى 10)
    s = a.tap_row("سلمى الحوراني", "صف د1 سلمى", expect_sheet="د1", also="المتبقي")
    if s:
        if a.has("سجّل دفعة"):
            a.tap('button:has-text("سجّل دفعة")', "سجّل دفعة على د1")
            time.sleep(0.6)
            a.shot("payment-sheet")
            a.note("ورقة الدفعة فتحت من ورقة الدين")
            a.fill('.mds-sheet input[inputmode="decimal"], .mds-sheet input', "35")
            time.sleep(0.3)
            # الصندوق مطلوب (الزر معطّل بسببه المكتوب «اختر الصندوق»)
            fund = a.page.locator('.mds-sheet button:has-text("درج الكاش")')
            if fund.count():
                fund.last.scroll_into_view_if_needed()
                fund.last.tap()
                time.sleep(0.4)
            save = a.page.locator('.mds-sheet button:has-text("احفظ الدفعة")').last
            save.scroll_into_view_if_needed()
            save.tap()
            time.sleep(0.6)
            a.shot("payment-saved")
            a.say(f"بعد الدفعة: الباقي 10 د ظاهر؟ {a.has('10 د')}")
        a.close_sheet()
    # «سجّل حركة»: مصروف اليوم من الدرج (ر2.1 جزئي)
    if a.has("سجّل حركة"):
        a.tap('button:has-text("سجّل حركة")', "سجّل حركة")
        time.sleep(0.5)
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
        # التبديل يبقي الشاشة الحالية (السوق) — المالك يعود لليوم ليرى بيانات الريف
        a.tap('.mds-tab-bar button:has-text("اليوم")', "اليوم بعد التبديل")
        time.sleep(0.4)
        a.shot("reef-today")
        a.say(f"بعد التبديل: مالية الريف 170 ظاهرة؟ {a.has('170')}")
        a.say(f"عزل المشروعين: 595.500 غابت؟ {not a.has('595.500')}")
        a.tap('.mds-tab-bar button:has-text("الطلبات")', "طلبات الريف")
        time.sleep(0.4)
        a.shot("reef-orders")
        a.say(f"طلبا الريف 2041/2042 ظاهران وطلبان ورشة الياسمين غائبان؟ {a.has('2041') and not a.has('1175')}")
        a.note("تبديل المشروع يعيد بياناته")


def driver_day(a: Day):
    a.say("— يوم السائق: عمر الزعبي")
    reset_and_enter(a.page, "عمر الزعبي", font=a.font)
    a.shot("orders")
    a.note(f"أول شاشة: {a.screen()}")
    # ت4: بطاقة صالون لمسة تفتح ورقتها فيها «سعرك» + «أرسل العرض» (ر4.2)
    s = a.tap_card("DriverJobCard", "ت4", "بطاقة ت4", expect_sheet="ت4")
    if s:
        a.shot("quote-sheet-t4")
        a.note(f"ورقة ت4: {s['label']}")
        if a.has("أرسل العرض"):
            a.fill('.mds-sheet input[inputmode="decimal"], .mds-sheet input', '3.5')
            a.tap('button:has-text("أرسل العرض")', "أرسل العرض")
            time.sleep(0.4)
            a.say(f"بعد الإرسال: «بانتظار قرار المالك»؟ {a.has('بانتظار قرار المالك')}")
        a.close_sheet()
    # ت1: بانتظار قرار المالك
    a.say(f"يرى «بانتظار قرار المالك»؟ {a.has('بانتظار قرار المالك')}")
    # مهامي
    a.tap('button:has-text("مهامي")', "الجزء «مهامي»")
    a.shot("myjobs")
    # ت3: ورقتها فيها الإثبات و«تمّ التسليم» و«لم أستطع التسليم» (ر4.3)
    s = a.tap_card("DriverJobCard", "ت3", "بطاقة ت3", expect_sheet="ت3")
    if s:
        a.shot("job-t3-sheet")
        a.note(f"ورقة ت3: {s['label']}")
        a.say(f"«تمّ التسليم» ظاهر؟ {a.has('تمّ التسليم')} · «لم أستطع»؟ {a.has('لم أستطع التسليم')}")
        a.close_sheet()
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
    reset_and_enter(a.page, "مخبز الأصيل", font=a.font)
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
    # عرض جديد: النموذج يعمل (صور مؤقتة + شرائح)
    if a.has("عرض جديد"):
        a.tap('button:has-text("عرض جديد")', "«عرض جديد»")
        time.sleep(0.4)
        a.shot("new-listing")
        a.note(f"ورقة «عرض جديد»: {a.sheet()['label'] if a.sheet()['open'] else 'لا'}")
        a.say(f"«أضف صورة أولاً.» ظاهر؟ {a.has('أضف صورة أولاً.')}")
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
    reset_and_enter(a.page, "مراجعة المنصة", font=a.font)
    a.shot("review")
    a.note(f"أول شاشة: {a.screen()}")
    # ع3: ورقة القرار فيها الاعتماد والرفض
    if a.has("خبز صاج"):
        a.tap("text=خبز صاج", "صف ع3")
        s = a.wait_sheet()
        if s:
            a.shot("review-3-sheet")
            a.note(f"ورقة ع3: {s['label']}")
            a.say(f"«اعتمد العرض»؟ {a.has('اعتمد العرض')} · «ارفض العرض»؟ {a.has('ارفض العرض')}")
            a.close_sheet()
    # البلاغات
    a.tap('[role="tab"]:has-text("البلاغات")', "تبويب البلاغات")
    a.shot("reports")
    a.say(f"ع6 ببلاغاته ظاهر؟ {a.has('قماش ساتان')}")
    if a.has("قماش ساتان"):
        a.tap("text=قماش ساتان", "صف ع6 المبلَّغ")
        s = a.wait_sheet()
        if s:
            a.shot("reports-sheet")
            a.say(f"«أبقِ العرض»؟ {a.has('أبقِ العرض')} · «أوقف العرض»؟ {a.has('أوقف العرض')}")
            a.close_sheet()
    # السائقون
    a.tap('[role="tab"]:has-text("السائقون")', "تبويب السائقين")
    a.shot("drivers")
    a.say(f"يزن ظاهر؟ {a.has('يزن القضاة')}")
    if a.has("يزن القضاة"):
        a.tap("text=يزن القضاة", "صف يزن")
        s = a.wait_sheet()
        if s:
            a.shot("driver-approval-sheet")
            a.say(f"المرفقات الثلاثة؟ {a.has('صورة الهوية')} · «اعتمد السائق»؟ {a.has('اعتمد السائق')}")
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
    reset_and_enter(a.page, "بلا حساب", wait="[data-sim-screen]", font=a.font)
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
            # ضبط الخط بمفتاح التخزين نفسه ثم إعادة تحميل واحدة — نفس المسار
            # الذي تسلكه لوحة المحاكاة (شارة شاشة الأدوار بلا لمس مطوّل عمدًا).
            page.evaluate(
                """() => { const key = 'micro-sim:v1';
                   const raw = localStorage.getItem(key);
                   let env = { version: 1, state: {} };
                   try { env = JSON.parse(raw) || env; } catch { }
                   env.state = { ...env.state, identity: { ...(env.state?.identity ?? {}), fontScale: 200 } };
                   localStorage.setItem(key, JSON.stringify(env)); }""")
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
