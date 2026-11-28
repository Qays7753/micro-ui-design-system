#!/usr/bin/env python3
"""touch_vanish.py — «جولة المستخدم» re-verification of the owner's report
from his REAL phone: «كثير من الأزرار ما زالت لا تعمل، وكثير منها يفتح نافذة
تظهر لحظة ثم تختفي».

Every interactive control in every role gets a REAL touch tap on REAL-PHONE
device profiles (iPhone 13 on WebKit, Pixel 7 on Chromium — hasTouch +
isMobile), and AFTER EVERY TAP the tool screenshots the screen at 0, 100,
300, 700 and 1500 ms and PIXEL-DIFFS each frame against the before-touch
frame. The DOM is probed too — as COMPLEMENTARY evidence, never alone.

What it hunts:
  - DEAD: no visible change at any delay (nothing opens, nothing happens);
  - VANISH: a layer visibly appears (diff rises) then is GONE by 700-1500 ms
    with no close tap — exactly «تظهر لحظة ثم تختفي»;
  - STAY: the layer opened and holds (سليم).

Beyond the plain tap it also runs the owner's special patterns on
representative openers: two rapid taps, scroll-then-tap, tap near the
button's edge, and opening a layer from INSIDE another layer.

For every button it logs: role, screen, the button, expected, what actually
happened (from pixels+DOM), and سليم/معطوب. Screenshots live under
/tmp/vanish/<engine>/ — the suspects get examined by EYE before any «سليم».

Usage: uv run python ds/sim/tools/touch_vanish.py <chromium|webkit> [--only ROLE]
"""
import glob
import json
import os
import sys
import time

from PIL import Image, ImageChops

from playwright.sync_api import sync_playwright

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sim_server import SIM_URL, serve  # noqa: E402

ROLE_ROWS = {
    "owner": "ورشة الياسمين",
    "driver": "عمر الزعبي",
    "supplier": "مخبز الأصيل",
    "reviewer": "مراجعة المنصة",
    "guest": "بلا حساب",
}
SHOT_MS = [0, 100, 300, 700, 1500]

ACTION_WORDS = ("حفظ", "احفظ", "أرسل", "إرسال", "اعتمد", "ارفض", "سجّل", "سجل",
                "أوقف", "أبقِ", "اقبل", "وافق", "بدّل", "انتهى", "أعد", "تخطَّ",
                "افتح", "أضف", "متابعة")
CLOSE_WORDS = ("إغلاق", "إلغاء", "تجاهل", "أُهمل", "رجوع")


def apply_webkit_env():
    installs = sorted(glob.glob(os.path.expanduser("~/.cache/ms-playwright/webkit-*")))
    if not installs:
        return False
    sysdir = os.path.join(installs[-1], "minibrowser-wpe", "sys")
    egl_vendor, dri = os.path.join(sysdir, "egl_vendor"), os.path.join(sysdir, "lib", "dri")
    if not (os.path.isdir(egl_vendor) and os.path.isdir(dri)):
        return False
    for k, v in {
        "EGL_PLATFORM": "surfaceless",
        "LIBGL_ALWAYS_SOFTWARE": "1",
        "LIBGL_ALWAYS_INDIRECT": "0",
        "__EGL_VENDOR_LIBRARY_DIRS": egl_vendor,
        "LIBGL_DRIVERS_PATH": dri,
        "PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS": "1",
    }.items():
        os.environ.setdefault(k, v)
    return True


def gray(path):
    im = Image.open(path).convert("L")
    return im.resize((im.width // 3, im.height // 3))


def diff(a_path, b_path):
    a, b = gray(a_path), gray(b_path)
    if a.size != b.size:
        return 255.0
    h = ImageChops.difference(a, b).histogram()
    total = sum(h)
    if total == 0:
        return 0.0
    return sum(i * c for i, c in enumerate(h)) / total


SHEET_JS = """(() => {
  const all = [...document.querySelectorAll('.mds-sheet')];
  const s = all[all.length - 1]; // the LAST mounted sheet is the TOP one
  if (!s) return { open: false };
  return { open: true, label: s.getAttribute('aria-label'),
           closing: s.className.includes('mds-sheet--closing'),
           stacked: all.length > 1 };
})()"""

DISCOVER_JS = """(() => {
  const out = [];
  const els = [...document.querySelectorAll(
    'button, .mds-object-row, .mds-tile, .mds-section-see-all, .sim-task-row, [role="tab"], .mds-toggle, .mds-checkbox, .mds-chip')];
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    if (r.bottom < 0 || r.top > innerHeight) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.pointerEvents === 'none') continue;
    const disabled = el.disabled === true || el.getAttribute('aria-disabled') === 'true';
    const inSheet = !!el.closest('.mds-sheet');
    const text = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 40);
    const cls = [el.className.split(' ')[0]].join(' ');
    out.push({ x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2),
               ex: Math.round(r.right - 4), ey: Math.round(r.top + r.height / 2),
               w: Math.round(r.width), h: Math.round(r.height),
               text, cls, disabled, inSheet,
               tab: !!el.closest('.mds-tab-bar'),
               tile: el.classList.contains('mds-tile'),
               seeall: el.classList.contains('mds-section-see-all'),
               row: el.classList.contains('mds-object-row'),
               tog: el.classList.contains('mds-toggle') || el.classList.contains('mds-checkbox')
                    || el.classList.contains('mds-chip') || el.classList.contains('mds-filter-chip')
                    || (el.className || '').includes('segment') });
  }
  return out;
})()"""


class Vanish:
    def __init__(self, page, engine, role):
        self.page = page
        self.engine = engine
        self.role = role
        self.dir = f"/tmp/vanish/{engine}"
        os.makedirs(self.dir, exist_ok=True)
        self.rows = []
        self.n = 0

    # ── primitives ───────────────────────────────────────────────────
    def screen(self):
        return self.page.evaluate(
            "(() => document.querySelector('[data-sim-screen]')?.getAttribute('data-sim-screen') ?? null)()")

    def sheet(self):
        return self.page.evaluate(SHEET_JS)

    def shot(self, name):
        p = f"{self.dir}/{name}.png"
        self.page.screenshot(path=p)
        return p

    def tap_xy(self, x, y):
        self.page.touchscreen.tap(x, y)

    def dom_state(self):
        s = self.sheet()
        return {"sheet": s["label"] if s["open"] else None,
                "closing": s.get("closing", False), "screen": self.screen()}

    # ── the timed tap: the heart of this census ──────────────────────
    def timed_tap(self, x, y, label, expected, screen, note="", tap2=None):
        """One real touch tap, frames at 0/100/300/700/1500 ms, pixel diff
        of every frame against the before-frame, DOM probed at each frame.
        The DOM is also captured BEFORE the tap — the t0 frame already shows
        the navigation, so «moved» is judged against the pre-tap state."""
        self.n += 1
        stem = f"{self.role}-{screen}-{self.n:03d}"
        before = self.shot(f"{stem}-before")
        dom_before = self.dom_state()
        self.tap_xy(x, y)
        if tap2 is not None:
            time.sleep(0.12)
            self.tap_xy(*tap2)
        frames, doms = [], []
        t0 = time.time()
        for ms in SHOT_MS:
            wait = ms / 1000 - (time.time() - t0)
            if wait > 0:
                time.sleep(wait)
            p = self.shot(f"{stem}-{ms}")
            frames.append(p)
            doms.append(self.dom_state())
        diffs = [round(diff(before, p), 1) for p in frames]
        row = self.verdict(label, expected, screen, diffs, doms, stem, note,
                           dom_before)
        self.rows.append(row)
        print(f"  [{row['verdict']}] {screen} · {label} — {row['happened']}")
        return row

    def verdict(self, label, expected, screen, diffs, doms, stem, note, dom_before=None):
        max_d = max(diffs)
        end_d = diffs[-1]
        sheet_end, end = doms[-1]["sheet"], doms[-1]["screen"]
        sheet_mid = doms[1]["sheet"] or doms[2]["sheet"]
        closed_now = doms[0]["sheet"] and not doms[-1]["sheet"]
        screen_before = dom_before["screen"] if dom_before else doms[0]["screen"]
        sheet_before = dom_before["sheet"] if dom_before else doms[0]["sheet"]
        verdict, happened = "?", ""
        if expected == "closes-sheet":
            verdict = "سليم" if (not doms[-1]["sheet"] and diffs[-1] > 2.0) else "معطوب"
            happened = f"الورقة أُغلقت ({end_d})" if verdict == "سليم" else f"لا تغيير مرئي ({end_d})"
        elif expected in ("opens-layer", "opens-sheet", "navigates"):
            if sheet_mid and not sheet_end and max_d > 4:
                verdict = "معطوب: يظهر ثم يختفي"
                happened = f"طبقة «{sheet_mid}» ظهرت ({diffs[1]}) ثم اختفت ({end_d})"
            elif expected == "navigates":
                moved = end != screen_before
                verdict = "سليم" if moved else "معطوب: لا انتقال"
                happened = f"الشاشة {screen_before} → {end} (فرق نهائي {end_d})"
            elif sheet_end:
                verdict = "سليم"
                happened = f"ورقة «{sheet_end}» ثابتة (فرق نهائي {end_d})"
            elif max_d >= 8 and end_d > 2:
                verdict = "سليم"
                happened = f"تغيّر مرئي ثابت بلا طبقة (فرق نهائي {end_d})"
            elif max_d >= 0.35:
                # Small-but-real change (filter chips, active-state flips):
                # recorded as evidence for the EYE — never auto-معطوب.
                verdict = "دليل"
                happened = f"تغيّر صغير ثابت (فرق نهائي {end_d}) — للحكم بالعين"
            else:
                verdict = "معطوب: لا شيء يحدث"
                happened = f"أعلى فرق {max_d} — لا طبقة ولا تغيّر"
        elif expected == "action":
            if sheet_mid and not sheet_end and max_d > 4 and note != "close-expected":
                verdict = "سليم" if closed_now else "معطوب: يظهر ثم يختفي"
                happened = "الفعل أغلق الورقة وظاهرةً" if closed_now else "نافذة اختفت"
            elif max_d < 1.5 and not closed_now and doms[-1]["sheet"] == doms[0]["sheet"]:
                verdict = "معطوب: لا شيء يحدث"
                happened = f"أعلى فرق {max_d} — لا أثر"
            else:
                verdict = "سليم"
                happened = f"انتقال مرئي (فرق نهائي {end_d}، أعلى {max_d})"
        elif expected == "state":
            if max_d > 1.0:
                verdict = "سليم"
            else:
                # No visible flip: either the control was already in that
                # state (an active chip legitimately doesn't move) or the
                # control is dead — the EYE decides, not the threshold.
                verdict = "دليل"
            happened = f"أعلى فرق {max_d}"
        else:  # probe — record, judge by eye
            verdict = "دليل"
            happened = f"فرق {diffs} ورقة النهاية {sheet_end}"
        return {"role": self.role, "engine": self.engine, "screen": screen,
                "button": label, "expected": expected, "verdict": verdict,
                "happened": happened, "diffs": diffs,
                "dom_end": doms[-1], "shots": stem, "note": note}

    # ── helpers ──────────────────────────────────────────────────────
    def wait_no_sheet(self, ms=2500):
        t0 = time.time()
        while time.time() - t0 < ms / 1000:
            if not self.sheet()["open"]:
                return True
            time.sleep(0.05)
        return False

    def close_layer(self, screen):
        """Close whatever opened: tap the TOP sheet's scrim ABOVE its panel
        (the last .mds-sheet in DOM order is the topmost); if the scrim tap
        misses (short sheet → clamped y), fall back to the X button, then
        Escape. Returns True only when the sheet is REALLY gone."""
        for attempt in range(3):
            s = self.sheet()
            if not s["open"]:
                return True
            if attempt == 0:
                y = self.page.evaluate(
                    """(() => {
                      const all = [...document.querySelectorAll('.mds-sheet-panel')];
                      const p = all[all.length - 1];
                      const top = p ? p.getBoundingClientRect().top : 300;
                      return Math.max(12, Math.round(top) - 40);
                    })()""")
                self.tap_xy(195, y)
            elif attempt == 1:
                self.page.evaluate(
                    """(() => { const b = document.querySelector('.mds-sheet-close button')
                               || [...document.querySelectorAll('.mds-sheet button')]
                                    .find(x => ['إغلاق','إلغاء'].some(t => x.textContent.includes(t)));
                               if (b) b.click(); })()""")
            else:
                self.page.keyboard.press("Escape")
            self.wait_no_sheet(1200)
        return not self.sheet()["open"]

    def candidates(self, in_sheet=False):
        els = self.page.evaluate(DISCOVER_JS)
        seen, out = set(), []
        for e in els:
            if e["disabled"]:
                continue
            if e["inSheet"] != in_sheet:
                continue
            if e["text"] == "" and not e["tile"]:
                continue
            key = (e["x"], e["y"], e["text"])
            if key in seen:
                continue
            seen.add(key)
            out.append(e)
        return out[:28]

    def expect_of(self, e):
        if e["tab"]:
            return "navigates"
        if e["tog"]:
            return "state"
        # The sheet's own X (close) IconButton: the LIBRARY gives it the
        # sheet's label as its accessible name (Sheet.tsx line ~246: <IconButton
        # label={label}>), so its text is «تبديل المشروع» etc. — it CLOSES
        # the sheet (recorded as a library note in REPORT-SIM).
        if e["inSheet"] and e["cls"] == "mds-icon-button":
            return "closes-sheet"
        if e["seeall"] or e["row"]:
            return "opens-layer"
        if e["tile"]:
            return "navigates"
        t = e["text"]
        if any(w in t for w in CLOSE_WORDS):
            return "closes-sheet"
        if any(w in t for w in ACTION_WORDS):
            return "action"
        return "opens-layer"

    def goto_tab(self, label):
        """Real-touch tab navigation (the tabs themselves are census
        targets too — navigate the way a finger does, never synthetic)."""
        pos = self.page.evaluate(
            """(t) => { const b = [...document.querySelectorAll('.mds-tab-bar button')]
                 .find(x => x.textContent.includes(t));
                 if (!b) return null; const r = b.getBoundingClientRect();
                 return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) }; }""",
            label)
        if pos:
            self.tap_xy(pos["x"], pos["y"])
        time.sleep(0.45)

    def inner_census(self, scr, outer_label, limit=6):
        """Census INSIDE the sheet `outer_label` with FRESH discovery before
        every tap — coordinates from a stale sheet are the harness's own
        ghost. A tap that opens a DIFFERENT (nested) sheet gets it closed
        so the outer sheet stays for the remaining candidates."""
        tapped = set()
        states_left = 2
        for _ in range(limit):
            if not self.sheet()["open"]:
                return
            cur = self.sheet()["label"]
            if cur != outer_label:
                return
            cands = [c for c in self.candidates(in_sheet=True)
                     if (c["x"], c["y"], c["text"]) not in tapped]
            if not cands:
                return
            c = cands[0]
            tapped.add((c["x"], c["y"], c["text"]))
            iexp = self.expect_of(c)
            if iexp == "state":
                if states_left <= 0:
                    continue
                states_left -= 1
            self.timed_tap(c["x"], c["y"], f"↳ {(c['text'] or c['cls'])[:28]}", iexp, scr,
                           note="in-sheet")
            now = self.sheet()
            if now["open"] and now["label"] != outer_label:
                # A nested sheet opened above the outer one — close it so the
                # outer sheet survives for the remaining candidates.
                self.close_layer(scr)
            elif not now["open"]:
                return  # the tap closed the outer sheet (X / save) — done


def enter_role(page, role_row_text):
    page.evaluate("() => window.localStorage.clear()")
    page.reload(wait_until="networkidle")
    page.wait_for_selector("[data-sim-role-screen]", timeout=10000)
    page.locator(f'[data-sim-role-screen] .mds-object-row:has-text("{role_row_text}")').first.tap()
    page.wait_for_selector("[data-sim-screen]", timeout=5000)
    time.sleep(0.4)


TAB_FOR_SCREEN = {"today": "اليوم", "finance": "المالية", "orders": "الطلبات",
                  "delivery": "التوصيل", "market": "السوق"}


def special_patterns(v: Vanish, screen):
    """The owner's extra gestures on representative openers of this screen:
    two rapid taps, scroll-then-tap, tap near the button's trailing edge."""
    cands = [e for e in v.candidates(in_sheet=False)
             if not e["tab"] and not e["tog"] and e["w"] >= 56 and 0 < e["y"] < 700]
    if not cands:
        return
    e = cands[0]
    label = (e["text"][:22] or e["cls"])
    v.timed_tap(e["x"], e["y"], f"لمستان سريعتان على «{label}»", "opens-layer", screen,
                note="double-tap", tap2=(e["x"], e["y"]))
    v.close_layer(screen)
    # scroll-then-tap: an opener BELOW the fold, scrolled into view, then
    # tapped — the gesture sequence a real finger does.
    below = [c for c in v.candidates(in_sheet=False)
             if not c["tab"] and not c["tog"] and c["y"] > 760]
    if below:
        c = below[0]
        v.page.evaluate(
            """() => { const sc = document.querySelector('.sim-shell-screen') ||
                       document.scrollingElement; sc.scrollBy(0, 320); }""")
        time.sleep(0.35)
        fresh = [x for x in v.candidates(in_sheet=False)
                 if not x["tab"] and not x["tog"] and x["text"] == c["text"] and 0 < x["y"] < 800]
        if fresh:
            f = fresh[0]
            v.timed_tap(f["x"], f["y"], f"تمرير ثم لمس «{(f['text'] or f['cls'])[:22]}»",
                        v.expect_of(f), screen, note="scroll-tap")
            v.close_layer(screen)
    # edge tap: 4px inside the trailing edge of the same opener.
    if e["w"] >= 80:
        v.timed_tap(e["ex"], e["ey"], f"لمس قرب حافة «{label}»", v.expect_of(e), screen,
                    note="edge-tap")
        v.close_layer(screen)


def walk_screen(v: Vanish, scr):
    """Census every control ON this screen — including what sits BELOW the
    fold (the screen body scrolls between passes). Discovery is FRESH
    before every single tap (stale coordinates were the harness's own
    ghost), and candidates are keyed by text+class so scrolling never
    duplicates or hides them."""
    seen = set()
    for round_no in range(5):
        els = [e for e in v.candidates(in_sheet=False) if not e["tab"]]
        new = [e for e in els if (e["text"], e["cls"]) not in seen]
        if not new:
            # Nothing new visible — try scrolling deeper (bounded).
            scrolled = v.page.evaluate(
                """() => { const sc = document.querySelector('.sim-screen__body, .sim-shell-screen')
                           || document.scrollingElement;
                           const before = sc.scrollTop; sc.scrollBy(0, 340);
                           return sc.scrollTop > before + 10; }""")
            if not scrolled:
                break
            time.sleep(0.3)
            continue
        for e in new:
            # Re-anchor + FRESH discovery: the previous tap may have moved
            # the page or mutated the list this candidate belongs to.
            if v.screen() != scr or v.sheet()["open"]:
                v.close_layer(scr)
                back = TAB_FOR_SCREEN.get(scr)
                if back and v.screen() != scr:
                    v.goto_tab(back)
                if v.screen() != scr:
                    return
            fresh = [x for x in v.candidates(in_sheet=False)
                     if not x["tab"] and (x["text"], x["cls"]) == (e["text"], e["cls"])]
            if not fresh:
                continue
            f = fresh[0]
            seen.add((e["text"], e["cls"]))
            exp = v.expect_of(f)
            row = v.timed_tap(f["x"], f["y"], f["text"] or f["cls"], exp, scr)
            outer = row["dom_end"]["sheet"]
            if outer:
                v.inner_census(scr, outer)
                v.close_layer(scr)
                v.wait_no_sheet()
            elif exp == "navigates" and v.screen() != scr:
                back = TAB_FOR_SCREEN.get(scr)
                if back:
                    v.goto_tab(back)
                else:
                    return  # no tab bar (guest): this screen is done


def walk_role(v: Vanish):
    page = v.page
    enter_role(page, ROLE_ROWS[v.role])
    tabs = [e["text"] for e in v.candidates(in_sheet=False) if e["tab"] and e["text"]]
    visited = set()
    order = [None] + tabs if tabs else [None]
    first_done = False
    for tab in order:
        if tab:
            v.goto_tab(tab)
        scr = v.screen()
        if scr is None or scr in visited:
            continue
        visited.add(scr)
        print(f"\n═══ {v.role} · الشاشة {scr} ═══")
        walk_screen(v, scr)
        if not first_done:
            first_done = True
            special_patterns(v, scr)
    return visited


def main():
    engine = sys.argv[1] if len(sys.argv) > 1 else "chromium"
    only = None
    if "--only" in sys.argv:
        only = sys.argv[sys.argv.index("--only") + 1]
    if engine == "webkit":
        apply_webkit_env()
    roles = [only] if only else list(ROLE_ROWS)
    dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
    with serve(dist):
        with sync_playwright() as pw:
            if engine == "chromium":
                ctx = pw.chromium.launch().new_context(**pw.devices["Pixel 7"], locale="ar")
            else:
                ctx = pw.webkit.launch().new_context(**pw.devices["iPhone 13"], locale="ar")
            page = ctx.new_page()
            page.goto(SIM_URL, wait_until="networkidle")
            for role in roles:
                print(f"\n██████ الدور: {role} ({engine}) ██████")
                v = Vanish(page, engine, role)
                walk_role(v)
                if role == "guest":
                    # The visitor taps «دخول تجريبي» and continues as the
                    # buyer (المشتري بعد الدخول) — same run, same device.
                    # The census may have already pressed it mid-walk (it is
                    # a button on the guest's screen) — either way the buyer
                    # census runs on whatever state the page is in now.
                    btn = page.evaluate(
                        """(() => { const b = [...document.querySelectorAll('button')]
                             .find(x => x.textContent.includes('دخول تجريبي'));
                             if (!b) return null; const r = b.getBoundingClientRect();
                             return { x: Math.round(r.left + r.width / 2),
                                      y: Math.round(r.top + r.height / 2) }; })()""")
                    if btn and not v.sheet()["open"]:
                        v.timed_tap(btn["x"], btn["y"], "دخول تجريبي (الزائر ← المشتري)",
                                    "navigates", "market")
                    vb = Vanish(page, engine, "buyer")
                    if page.evaluate("() => !!document.querySelector('.mds-sheet')"):
                        vb.close_layer("market")
                    scr = vb.screen()
                    print(f"\n═══ المشتري · الشاشة {scr} ═══")
                    walk_screen(vb, scr)
                    badb = [r for r in vb.rows if r["verdict"].startswith("معطوب")]
                    print(f"\n=== buyer/{engine}: {len(vb.rows) - len(badb)}/{len(vb.rows)} سليم ===")
                    for r in badb:
                        print(f"  معطوب: {r['screen']} · {r['button']} — {r['happened']}")
                    with open(f"/tmp/vanish/{engine}-buyer.json", "w") as f:
                        json.dump(vb.rows, f, ensure_ascii=False, indent=1)
                bad = [r for r in v.rows if r["verdict"].startswith("معطوب")]
                print(f"\n=== {role}/{engine}: {len(v.rows) - len(bad)}/{len(v.rows)} سليم ===")
                for r in bad:
                    print(f"  معطوب: {r['screen']} · {r['button']} — {r['happened']}")
                with open(f"/tmp/vanish/{engine}-{role}.json", "w") as f:
                    json.dump(v.rows, f, ensure_ascii=False, indent=1)
            ctx.close()


if __name__ == "__main__":
    main()
