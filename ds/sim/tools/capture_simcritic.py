#!/usr/bin/env python3
"""capture_simcritic.py — يجمّع صور جولة المستخدم في
docs/plans/design-system-batch2/sim-critic/ (PNG مضغوطة، اسم كل صورة يحمل
الدور والشاشة والموضوع) ويُعيد التقاط صور «ملاحظات للجولة النهائية» الأربع
التي فُقدت مع /tmp في جولة الناقد. الأدلة المعطوبة تُحفظ كما هي (قبل
الإصلاح)، والأدلة المصلَحة تُلتقط من البناء الحي (0.2.5).
Usage: uv run python ds/sim/tools/capture_simcritic.py
"""
import glob
import os
import shutil
import time
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sim_server import SIM_URL, serve  # noqa: E402

OUT = "docs/plans/design-system-batch2/sim-critic"
VANISH = "/tmp/vanish"
DAY = "/tmp/day"


def compress(src, dst, max_w=390, colors=160):
    im = Image.open(src).convert("RGB")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)))
    q = im.quantize(colors=colors, method=Image.MEDIANCUT)
    q.save(dst, optimize=True)
    return os.path.getsize(dst)


def grab(name, src):
    dst = f"{OUT}/{name}.png"
    size = compress(src, dst)
    print(f"  {name}.png  {size // 1024}KB")
    return dst


def main():
    os.makedirs(OUT, exist_ok=True)
    print("— أدلة جولة المستخدم المُصلَحة (من أرشيف العدّ والأيام):")

    # ا-9: اللمستان السريعتان — الدليل المعطوب (شريط الإطارات قبل الإصلاح)
    if os.path.exists(f"{VANISH}/strip-owner-today-023.png"):
        shutil.copy(f"{VANISH}/strip-owner-today-023.png", f"{OUT}/evidence-double-tap-bug-frames.png")
        print("  evidence-double-tap-bug-frames.png (النافذة مفتوحة عند 0 ثم مختفية)")
    # ا-9: الرقائق العالقة — قبل الإصلاح (بروب البكسل): الكل true رغم اللمس
    if os.path.exists(f"{VANISH}/chip-before.png"):
        compress(f"{VANISH}/chip-before.png", f"{OUT}/evidence-orders-filter-stuck.png")
        print("  evidence-orders-filter-stuck.png")
    # ا-10 بعد الإصلاح: اللمستان تحفظان الورقة (من آخر عدّ chromium)
    for ms in ("0", "100", "700"):
        f = f"{VANISH}/chromium/owner-today-023-{ms}.png"
        if os.path.exists(f):
            compress(f, f"{OUT}/owner-today-doubletap-fixed-{ms}ms.png")
            print(f"  owner-today-doubletap-fixed-{ms}ms.png")
    # ا-12: شاشة طلبات الريف الفارغة قبل الإصلاح (من يوم المالك)
    pre = sorted(glob.glob(f"{DAY}/chromium-100-owner-*reef-orders.png"))
    if pre:
        compress(pre[-1], f"{OUT}/owner-reef-orders-empty-bug.png")
        print("  owner-reef-orders-empty-bug.png (قبل ا-12)")
    # ا-1/ر2.2: ورقة الدفعة (الزر معطّل بسببه) + بعد الدفعة
    pay = sorted(glob.glob(f"{DAY}/chromium-100-owner-*payment-sheet.png"))
    if pay:
        compress(pay[-1], f"{OUT}/owner-finance-payment-sheet-disabled-with-reason.png")
        print("  owner-finance-payment-sheet-disabled-with-reason.png")
    saved = sorted(glob.glob(f"{DAY}/chromium-100-owner-*payment-saved.png"))
    if saved:
        compress(saved[-1], f"{OUT}/owner-finance-payment-saved-10d.png")
        print("  owner-finance-payment-saved-10d.png")

    # الأيام الخضراء — عينات لكل دور (من آخر يوم chromium 100%)
    picks = [
        ("owner-today-needs-you.png", "chromium-100-owner-01-today.png"),
        ("owner-delivery-t1-sheet-accept.png", "chromium-100-owner-*delivery-sheet.png"),
        ("owner-delivery-accepted.png", "chromium-100-owner-*delivery-accepted.png"),
        ("owner-finance-hero-and-debts.png", "chromium-100-owner-06-finance.png"),
        ("owner-movement-sheet.png", "chromium-100-owner-*movement-sheet.png"),
        ("owner-orders-1175-sheet.png", "chromium-100-owner-*order-1175-sheet.png"),
        ("owner-market-listing-sheet.png", "chromium-100-owner-*listing-1-sheet.png"),
        ("owner-bell-notifications.png", "chromium-100-owner-*bell.png"),
        ("owner-ask-sheet.png", "chromium-100-owner-*ask.png"),
        ("owner-reef-isolated-today.png", "chromium-100-owner-*reef-today.png"),
        ("driver-t4-quote-sheet-his-price.png", "chromium-100-driver-*quote-sheet-t4.png"),
        ("driver-t3-job-sheet-evidence.png", "chromium-100-driver-*job-t3-sheet.png"),
        ("driver-log-t2.png", "chromium-100-driver-*job-log.png"),
        ("supplier-listing-review-sheet.png", "chromium-100-supplier-*listing-review-sheet.png"),
        ("supplier-new-listing-form.png", "chromium-100-supplier-*new-listing.png"),
        ("reviewer-review-decision-sheet.png", "chromium-100-reviewer-*review-3-sheet.png"),
        ("reviewer-reports-keep-stop.png", "chromium-100-reviewer-*reports-sheet.png"),
        ("reviewer-drivers-approve.png", "chromium-100-reviewer-*driver-approval-sheet.png"),
        ("guest-market-locked.png", "chromium-100-guest-*market.png"),
        ("guest-listing-locked-details.png", "chromium-100-guest-*listing-locked.png"),
        ("buyer-market-prices-visible.png", "chromium-100-guest-*buyer-market.png"),
        ("buyer-listing-with-price.png", "chromium-100-guest-*buyer-listing.png"),
    ]
    for name, pat in picks:
        fs = sorted(glob.glob(f"{DAY}/{pat}"))
        if fs:
            grab(name, fs[-1])
        else:
            print(f"  !! مفقود: {pat}")

    # عينات خط 200%
    f200 = sorted(glob.glob(f"{DAY}/chromium-200-owner-01-today.png"))
    if f200:
        grab("owner-today-200-font.png", f200[-1])
    d200 = sorted(glob.glob(f"{DAY}/chromium-200-driver-*orders.png"))
    if d200:
        grab("driver-orders-200-font.png", d200[-1])
    g200 = sorted(glob.glob(f"{DAY}/chromium-200-guest-*market.png"))
    if g200:
        grab("guest-market-200-font.png", g200[-1])

    print("— إعادة التقاط صور «ملاحظات للجولة النهائية» الأربع (كانت في /tmp وفقدت):")
    with serve(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))):
        from playwright.sync_api import sync_playwright

        with sync_playwright() as pw:
            b = pw.chromium.launch()
            ctx = b.new_context(viewport={"width": 390, "height": 844},
                                has_touch=True, is_mobile=True, locale="ar",
                                device_scale_factor=2)
            page = ctx.new_page()
            page.goto(SIM_URL, wait_until="networkidle")
            page.wait_for_selector("[data-sim-role-screen]", timeout=15000)

            # (1) ملاحظة المكتبة: الـscrim يغلق على click — ورقة مفتوحة باللمس
            page.locator('[data-sim-role-screen] .mds-object-row:has-text("ورشة الياسمين")').first.tap()
            page.wait_for_selector("[data-sim-screen]", timeout=8000)
            time.sleep(0.5)
            page.locator(".mds-project-switcher").first.tap()
            time.sleep(0.8)
            page.screenshot(path="/tmp/scritic-scrim.png")
            grab("library-note-sheet-scrim-click-dismiss.png", "/tmp/scritic-scrim.png")
            y = page.evaluate(
                "(() => { const p = document.querySelector('.mds-sheet-panel'); return Math.max(12, Math.round(p.getBoundingClientRect().top) - 40); })()")
            page.touchscreen.tap(195, y)
            time.sleep(0.4)

            # (2) ملاحظة المكتبة: قيمة البلاطة عند 200% (الملف يضبط الخط من التخزين)
            page.evaluate(
                """() => { const key = 'micro-sim:v1';
                   const raw = localStorage.getItem(key);
                   let env = { version: 1, state: {} };
                   try { env = JSON.parse(raw) || env; } catch { }
                   env.state = { ...env.state, identity: { ...(env.state?.identity ?? {}), fontScale: 200 } };
                   localStorage.setItem(key, JSON.stringify(env)); }""")
            page.reload(wait_until="networkidle")
            page.wait_for_selector("[data-sim-role-screen]", timeout=15000)
            page.locator('[data-sim-role-screen] .mds-object-row:has-text("ورشة الياسمين")').first.tap()
            page.wait_for_selector("[data-sim-screen]", timeout=8000)
            time.sleep(0.6)
            page.screenshot(path="/tmp/scritic-tile200.png")
            grab("library-note-tile-value-200.png", "/tmp/scritic-tile200.png")
            # (3) ملاحظة المكتبة: قصّ عناوين شريط التبويبات عند 200%
            page.evaluate(
                "() => { const el = document.querySelector('.mds-tab-bar'); if (el) el.scrollIntoView(false); }")
            time.sleep(0.3)
            page.screenshot(path="/tmp/scritic-tabbar200.png")
            grab("library-note-tabbar-labels-200.png", "/tmp/scritic-tabbar200.png")
            # (4) ملاحظة المكتبة: لفّ LaterChip (صفوف المالية عند 200%)
            pos = page.evaluate(
                "(() => { const b=[...document.querySelectorAll('.mds-tab-bar button')].find(x=>x.textContent.includes('المالية')); const r=b.getBoundingClientRect(); return {x: Math.round(r.left+r.width/2), y: Math.round(r.top+r.height/2)}; })()")
            page.touchscreen.tap(pos["x"], pos["y"])
            time.sleep(0.6)
            page.evaluate(
                "() => { const el = [...document.querySelectorAll('.sim-later-chip')][0]; if (el) el.scrollIntoView({ block: 'center' }); }")
            time.sleep(0.4)
            page.screenshot(path="/tmp/scritic-chip.png")
            grab("library-note-laterchip-wrap-200.png", "/tmp/scritic-chip.png")
            b.close()

    total = len(glob.glob(f"{OUT}/*.png"))
    print(f"المجموع: {total} صورة في {OUT}")


if __name__ == "__main__":
    main()
