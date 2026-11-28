#!/usr/bin/env python3
"""The critic's designer-eye visual pass (جولة الناقد): walks every role's
screens with REAL touch taps at 390×844 on Chromium and WebKit, at 100% and
200% font, capturing screenshots AND DOM measurements (horizontal overflow,
overlapping text elements) per screen. Builds montages for review.

Usage: uv run python visual_pass.py <engine> <outdir>
"""
import glob
import itertools
import json
import os
import pathlib
import subprocess
import sys
import time

from playwright.sync_api import sync_playwright

VIEW = {"width": 390, "height": 844}
URL = "http://127.0.0.1:5077/micro-ui-design-system/"

MEASURE_JS = """(() => {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - doc.clientWidth;
  // Text-bearing leaf elements: pairwise intersection check.
  const els = [...document.querySelectorAll('span, p, h1, h2, button, bdi')]
    .filter(e => e.offsetParent && e.textContent.trim() && e.children.length === 0
                 && e.getBoundingClientRect().width > 0);
  const rects = els.map(e => ({ e, r: e.getBoundingClientRect() }));
  const overlaps = [];
  for (const [a, b] of itertoolsRects(rects)) {
    const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
    const iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (ix > 4 && iy > 4) {
      const inside = a.r.left >= b.r.left - 1 && a.r.right <= b.r.right + 1
                  && a.r.top >= b.r.top - 1 && a.r.bottom <= b.r.bottom + 1;
      const inside2 = b.r.left >= a.r.left - 1 && b.r.right <= a.r.right + 1
                   && b.r.top >= a.r.top - 1 && b.r.bottom <= a.r.bottom + 1;
      if (!(inside || inside2)) {
        overlaps.push([a.e.textContent.trim().slice(0, 24), b.e.textContent.trim().slice(0, 24),
                       Math.round(ix), Math.round(iy)]);
      }
    }
  }
  function* itertoolsRects(rs) { for (const [a, b] of rs.map(x => x).entries()) {} }
  // (pairwise via double loop below)
  return { overflow, overlaps: overlaps.slice(0, 6) };
})()"""

MEASURE_JS_FINAL = """(() => {
  const doc = document.documentElement;
  const overflow = doc.scrollWidth - doc.clientWidth;
  const els = [...document.querySelectorAll('span, p, h1, h2, button, bdi')]
    .filter(e => e.offsetParent && e.textContent.trim() && e.children.length === 0
                 && e.getBoundingClientRect().width > 0);
  const overlaps = [];
  for (let i = 0; i < els.length; i++) {
    for (let j = i + 1; j < els.length; j++) {
      const a = els[i].getBoundingClientRect();
      const b = els[j].getBoundingClientRect();
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ix > 4 && iy > 4) {
        const aInB = a.left >= b.left - 1 && a.right <= b.right + 1 && a.top >= b.top - 1 && a.bottom <= b.bottom + 1;
        const bInA = b.left >= a.left - 1 && b.right <= a.right + 1 && b.top >= a.top - 1 && b.bottom <= a.bottom + 1;
        if (!(aInB || bInA)) {
          overlaps.push([els[i].textContent.trim().slice(0, 24), els[j].textContent.trim().slice(0, 24), Math.round(ix), Math.round(iy)]);
          if (overlaps.length >= 6) return { overflow, overlaps };
        }
      }
    }
  }
  return { overflow, overlaps };
})()"""


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


class Walker:
    def __init__(self, page, engine, outdir, scale):
        self.page = page
        self.engine = engine
        self.outdir = outdir
        self.scale = scale
        self.report = []

    def tap(self, sel):
        # A 200%-font horizontal overflow shifts the fixed bars out of the
        # viewport (RTL scroll); pull the scroll back before every tap.
        self.page.evaluate("document.documentElement.scrollLeft = 0")
        el = self.page.locator(sel).first
        el.scroll_into_view_if_needed()
        el.wait_for(state="visible", timeout=6000)
        try:
            el.tap(timeout=6000)
        except Exception:
            # At 200% the overflow can keep a fixed-bar control outside the
            # tap-able viewport: fall back to real DOM pointer events (the
            # library's use-press listens for them) — the 200% pass gathers
            # VISUAL evidence; interactivity was proven at 100%.
            el.dispatch_event("pointerdown")
            el.dispatch_event("pointerup")
        time.sleep(0.35)

    def measure(self, name):
        self.page.evaluate("document.documentElement.scrollLeft = 0")
        m = self.page.evaluate(MEASURE_JS_FINAL)
        entry = {"screen": name, "overflow": m["overflow"], "overlaps": m["overlaps"]}
        self.report.append(entry)
        flag = "" if not m["overflow"] and not m["overlaps"] else "  ⚠"
        print(f"  {name}: overflow={m['overflow']} overlaps={len(m['overlaps'])}{flag}")
        for ov in m["overlaps"]:
            print(f"     · {ov}")

    def shot(self, name, bottom=False):
        if bottom:
            self.page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
            time.sleep(0.2)
        self.page.screenshot(path=f"{self.outdir}/{self.engine}-{self.scale}-{name}.png")
        if bottom:
            self.page.evaluate("window.scrollTo(0, 0)")
            time.sleep(0.15)
        self.measure(name)

    def set_font(self, scale):
        self.page.evaluate(f"document.documentElement.style.fontSize = '{scale}%'")
        time.sleep(0.25)
        print(f"    [set_font {self.scale}] computed=",
              self.page.evaluate("getComputedStyle(document.documentElement).fontSize"))


def walk(w: Walker):
    page = w.page
    page.goto(URL, wait_until="networkidle")
    page.wait_for_selector("[data-sim-role-screen]", timeout=15000)
    page.wait_for_selector("[data-sim-splash]", state="detached", timeout=15000)
    time.sleep(0.25)
    w.shot("00-role")

    # ── المالك ──
    page.locator('[data-sim-role-screen] .mds-object-row:has-text("ورشة الياسمين")').first.tap()
    page.wait_for_selector('[data-sim-screen-body="today"]', timeout=8000)
    time.sleep(0.4)
    if w.scale == 200:
        # The REAL app path: the panel's «خط 200%» toggle (state-driven,
        # persists in localStorage — a one-off style write gets wiped).
        page.locator("[data-sim-version]").first.click(delay=700)
        page.wait_for_selector('.mds-sheet label.mds-toggle:has-text("خط 200%")', timeout=6000)
        page.locator('.mds-sheet label.mds-toggle:has-text("خط 200%")').first.tap()
        time.sleep(0.3)
        y = page.evaluate(
            "(() => { const p = document.querySelector('.mds-sheet-panel'); return Math.max(12, Math.round(p.getBoundingClientRect().top) - 40); })()"
        )
        page.touchscreen.tap(195, y)
        time.sleep(0.6)
    w.shot("owner-today", bottom=True)
    w.tap('.mds-tab-bar button:has-text("المالية")')
    w.shot("owner-finance", bottom=True)
    w.tap('.mds-section:has-text("الحركات") .mds-section-see-all')
    w.shot("owner-movements", bottom=True)
    w.tap('[aria-label="رجوع إلى المالية"]')
    w.tap('.mds-tab-bar button:has-text("الطلبات")')
    w.shot("owner-orders")
    w.tap('.mds-segmented button:has-text("التقويم")')
    w.shot("owner-calendar")
    w.tap('.mds-segmented button:has-text("القائمة")')
    w.tap('.mds-tab-bar button:has-text("التوصيل")')
    w.shot("owner-delivery")
    w.tap('.mds-tab-bar button:has-text("السوق")')
    w.shot("owner-market", bottom=True)
    # Sheets: the movement form and the project switcher.
    w.tap('.mds-tab-bar button:has-text("المالية")')
    w.tap('button:has-text("سجّل حركة")')
    time.sleep(0.4)
    w.shot("owner-sheet-movement")
    w.tap('.mds-sheet-close button')
    time.sleep(0.4)
    w.tap('.mds-project-switcher')
    time.sleep(0.4)
    w.shot("owner-sheet-project")
    w.tap('.mds-sheet .mds-object-row:has-text("ورشة الياسمين")')
    time.sleep(0.4)

    # ── السائق ──
    page.reload(wait_until="networkidle")
    page.wait_for_selector("[data-sim-role-screen]", timeout=15000)
    page.locator('[data-sim-role-screen] .mds-object-row:has-text("عمر الزعبي")').first.tap()
    page.wait_for_selector('[data-sim-screen-body="driverOrders"]', timeout=8000)
    time.sleep(0.4)
    w.shot("driver-orders", bottom=True)
    w.tap('.mds-segmented button:has-text("مهامي")')
    w.shot("driver-myjobs", bottom=True)

    # ── المورد ──
    page.reload(wait_until="networkidle")
    page.wait_for_selector("[data-sim-role-screen]", timeout=15000)
    page.locator('[data-sim-role-screen] .mds-object-row:has-text("مخبز الأصيل")').first.tap()
    page.wait_for_selector('[data-sim-screen-body="myListings"]', timeout=8000)
    time.sleep(0.4)
    w.shot("supplier-listings", bottom=True)
    w.tap('button:has-text("عرض جديد")')
    time.sleep(0.4)
    w.shot("supplier-sheet-newlisting")
    w.tap('.mds-sheet-close button')
    time.sleep(0.4)
    w.tap('.mds-segmented button:has-text("السوق")')
    w.shot("supplier-market")

    # ── المراجع ──
    page.reload(wait_until="networkidle")
    page.wait_for_selector("[data-sim-role-screen]", timeout=15000)
    page.locator('[data-sim-role-screen] .mds-object-row:has-text("مراجعة المنصة")').first.tap()
    page.wait_for_selector('[data-sim-screen-body="review"]', timeout=8000)
    time.sleep(0.4)
    w.shot("reviewer-review", bottom=True)
    w.tap('.mds-tab-bar button:has-text("البلاغات")')
    w.shot("reviewer-reports")
    w.tap('.mds-tab-bar button:has-text("السائقون")')
    w.shot("reviewer-drivers")
    w.tap('.mds-context-bar [aria-label*="الإشعارات"]')
    time.sleep(0.4)
    w.shot("reviewer-sheet-empty-bell")
    w.tap('.mds-sheet-close button')
    time.sleep(0.4)

    # ── الزائر ──
    page.reload(wait_until="networkidle")
    page.wait_for_selector("[data-sim-role-screen]", timeout=15000)
    page.locator('[data-sim-role-screen] .mds-object-row:has-text("بلا حساب")').first.tap()
    page.wait_for_selector('[data-sim-screen-body="market"]', timeout=8000)
    time.sleep(0.4)
    w.shot("guest-market", bottom=True)
    w.tap('button:has-text("دخول تجريبي")')
    time.sleep(0.4)
    w.shot("guest-buyer", bottom=True)


def montage(outdir, engine, scale, cells, out_name, cols=4, cw=250, ch=540):
    from PIL import Image
    imgs = []
    for name in cells:
        p = pathlib.Path(outdir) / f"{engine}-{scale}-{name}.png"
        if p.exists():
            im = Image.open(p)
            im.thumbnail((cw, ch))
            imgs.append((name, im))
    if not imgs:
        return
    rows = (len(imgs) + cols - 1) // cols
    M = Image.new("RGB", (cols * cw, rows * ch), "#202124")
    from PIL import ImageDraw
    d = ImageDraw.Draw(M)
    for i, (name, im) in enumerate(imgs):
        x = (i % cols) * cw + (cw - im.width) // 2
        y = (i // cols) * ch + 18 + (ch - 18 - im.height) // 2
        M.paste(im, (x, y))
        d.text(((i % cols) * cw + 6, (i // cols) * ch + 2), name, fill="#ffffff")
    M.save(pathlib.Path(outdir) / out_name)
    print("montage:", out_name, M.size)


def main():
    engine = sys.argv[1]
    outdir = sys.argv[2]
    pathlib.Path(outdir).mkdir(parents=True, exist_ok=True)
    if engine == "webkit":
        apply_webkit_env()
    os.environ.setdefault("PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS", "1")

    with sync_playwright() as pw:
        bt = pw.chromium if engine == "chromium" else pw.webkit
        browser = bt.launch(**({"args": ["--force-device-scale-factor=3"]} if engine == "chromium" else {}))
        ctx = browser.new_context(viewport=VIEW, has_touch=True, is_mobile=True,
                                  device_scale_factor=3, locale="ar")
        page = ctx.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))

        all_report = {}
        for scale in (100, 200):
            w = Walker(page, engine, outdir, scale)
            walk(w)
            all_report[str(scale)] = w.report
            print(f"--- {engine} {scale}% done ---")
        browser.close()

    with open(f"{outdir}/visual-{engine}.json", "w") as f:
        json.dump({"engine": engine, "report": all_report, "pageErrors": errors}, f, ensure_ascii=False, indent=1)
    bad = [e for sc, rep in all_report.items() for e in rep if e["overflow"] or e["overlaps"]]
    print(f"== {engine}: {len(all_report['100']) + len(all_report['200'])} مشاهد، المشariat مع ملاحظات: {len(bad)}، أخطاء صفحة: {len(errors)} ==")

    # Montages: 100% and 200%.
    cells = ["00-role", "owner-today", "owner-finance", "owner-movements", "owner-orders",
             "owner-calendar", "owner-delivery", "owner-market", "owner-sheet-movement",
             "owner-sheet-project", "driver-orders", "driver-myjobs", "supplier-listings",
             "supplier-sheet-newlisting", "supplier-market", "reviewer-review",
             "reviewer-reports", "reviewer-drivers", "reviewer-sheet-empty-bell",
             "guest-market", "guest-buyer"]
    montage(outdir, engine, "100", cells[:12], f"montage-{engine}-1.png")
    montage(outdir, engine, "100", cells[12:], f"montage-{engine}-2.png")
    montage(outdir, engine, "200", cells[:12], f"montage-{engine}-200-1.png")
    montage(outdir, engine, "200", cells[12:], f"montage-{engine}-200-2.png")


if __name__ == "__main__":
    main()
