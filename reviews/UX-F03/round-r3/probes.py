#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
probes UX-F03 — جولة R3 (تكليف المالك الموسع + إغلاق F03-R2-01..06)

يُعيد خمسة عيوب runtime مؤكدة في تقرير المراجعة R2 على المصدر المعيب المثبت
dc1536d، ويتحقق أنها 0/5 على المصدر المصلح. كل عيب يُعاد بنقر وكتابة فعلية
من الهاتف (لا استدعاء دوال داخلية كإثبات).

الاستعمال:
  python3 reviews/UX-F03/round-r3/probes.py --old <مسار checkout نظيف للقديم> \
      --new <مسار checkout نظيف للمصلح> --out <مجلد الإخراج>

العائد: probes.json بكل عيب وحكمه (defect_present على القديم/الجديد) + لقطات.
"""
import argparse
import functools
import json
import subprocess
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

VIEW = {"width": 390, "height": 844}


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def serve(root: Path):
    srv = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(root)))
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{port}/previews/ux-patterns/mobile-record-sample/index.html"


class UI:
    """مهايئ واحد للواجهتين: القديمة (إقلاع مباشر للرئيسية) والجديدة (بوابة)."""

    def __init__(self, browser, url, shots: Path, tag: str):
        self.ctx = browser.new_context(viewport=VIEW)
        self.p = self.ctx.new_page()
        self.url = url
        self.shots = shots
        self.tag = tag
        self.p.goto(url)
        self.p.wait_for_function("window.F03App && window.F03Store")
        self.new_ui = self.p.evaluate("() => !!document.getElementById('view-gateway')")
        if self.new_ui:
            self.p.click("#f03-gw-demo")
            self.p.wait_for_function("() => window.F03App.inspect().view === 'home'")
        self.p.evaluate("() => { window.localStorage.clear(); window.F03App.resetDemoData(); }")
        self.p.reload()
        self.p.wait_for_function("window.F03App && window.F03Store")
        if self.new_ui:
            self.p.click("#f03-gw-demo")
            self.p.wait_for_function("() => window.F03App.inspect().view === 'home'")
        self.p.wait_for_timeout(150)

    def click(self, sel, wait=340):
        self.p.locator(sel).click()
        self.p.wait_for_timeout(wait)

    def open_list(self):
        self.click("#f03-home-all")

    def edit_it01(self):
        self.open_list()
        self.click("#f03-list-rows [data-id='it-01']")
        self.click("#f03-detail-edit")

    def choose_cat_a(self):
        self.click("#f03-cat-trigger", 750)
        self.click(".m-picker__option[data-value='cat-a']", 500)

    def review_arm(self, kind, outcome):
        self.click("#f03-review-open")
        self.p.locator("#f03-rev-" + kind + "-outcome").select_option(outcome)
        self.click("#f03-review-close")

    def close(self):
        self.ctx.close()


def probe_two_categories(ui: UI):
    """R2-02: فئتان معًا → اتحاد 6 لا شرط مستحيل 0."""
    ui.open_list()
    ui.click("#f03-filter-btn")
    for k in ("cat-a", "cat-b"):
        ui.click(f"#f03-filter-cats label:has(input[data-filter-key='{k}'])")
    ui.click("[data-filter-apply]")
    ui.p.wait_for_timeout(250)
    d = ui.p.evaluate("() => ({rows: document.querySelectorAll('#f03-list-rows .f03-row').length,"
                      " text: document.querySelector('#f03-list-results').textContent})")
    ui.p.screenshot(path=str(ui.shots / f"01-two-categories-{ui.tag}.png"), full_page=True)
    return {"expected_rows": 6, "actual": d, "defect_present": d["rows"] == 0}


def probe_clear_reopen(ui: UI):
    """R2-03: المسح الخارجي يزامن المطبق داخل اللوحة عند إعادة الفتح."""
    ui.open_list()
    ui.click("#f03-filter-btn")
    ui.click("#f03-filter-cats label:has(input[data-filter-key='cat-a'])")
    ui.click("[data-filter-apply]")
    ui.p.locator("#f03-search-input").fill("عنصر باء")
    ui.p.wait_for_timeout(200)
    ui.click("#f03-clear-filters")
    ui.click("#f03-filter-btn")
    ui.p.wait_for_timeout(250)
    d = ui.p.evaluate("() => ({checked: [...document.querySelectorAll('#f03-filter-cats input:checked')]"
                      ".map(x => x.dataset.filterKey),"
                      " count: document.querySelector('#f03-filter-count').textContent,"
                      " rows: document.querySelectorAll('#f03-list-rows .f03-row').length})")
    ui.p.screenshot(path=str(ui.shots / f"02-clear-reopen-{ui.tag}.png"), full_page=True)
    return {"expected_checked": [], "actual": d, "defect_present": len(d["checked"]) > 0}


def probe_unknown_commit(mode):
    """R2-01: unknown ثم check=saved يلتزم اللقطة الأصلية مرة واحدة."""
    def run(ui: UI):
        name = "اختبار تأكيد " + mode
        if mode == "edit":
            ui.edit_it01()
        else:
            ui.click("#f03-home-add")
            ui.choose_cat_a()
        ui.p.locator("#f03-name").fill(name)
        ui.review_arm("save", "unknown")
        ui.click("#f03-save", 2200)
        ui.review_arm("check", "saved")
        ui.click("#f03-check", 2200)
        d = ui.p.evaluate("""() => ({
            count: F03Store.count(),
            detailName: document.querySelector('#f03-read-name').textContent,
            saveCalls: (F03App.inspect().sim ? F03App.inspect().sim.saveCalls : null)
        })""")
        ui.p.screenshot(path=str(ui.shots / f"03-unknown-{mode}-saved-{ui.tag}.png"), full_page=True)
        expected_count = 10 if mode == "add" else 9
        return {
            "mode": mode, "expected_name": name, "expected_count": expected_count, "actual": d,
            "defect_present": d["detailName"] != name or d["count"] != expected_count,
        }
    return run


def probe_announcement_inert(ui: UI):
    """R2-04: نجاح الحفظ لا يُكتب خلف طبقة معزولة — يُؤجل إلى سياق متاح مرة واحدة."""
    ui.edit_it01()
    ui.p.locator("#f03-name").fill("حفظ أثناء المراجعة")
    ui.review_arm("save", "saved")
    ui.click("#f03-save")
    ui.click("#f03-review-open")
    ui.p.evaluate("""() => {
      window.__noteWrites = [];
      const note = document.querySelector('#f03-detail-note');
      new MutationObserver(() => {
        window.__noteWrites.push({
          insideInert: !!note.closest('[inert]'),
          reviewHidden: document.querySelector('#f03-review-layer').hidden
        });
      }).observe(note, {childList: true, subtree: true, characterData: true});
    }""")
    ui.click("#f03-rev-settle-save")
    ui.p.wait_for_timeout(250)
    before = ui.p.evaluate("window.__noteWrites")
    ui.click("#f03-review-close")
    ui.p.wait_for_timeout(350)
    after = ui.p.evaluate("window.__noteWrites")
    writes_while_inert = [w for w in before if w.get("insideInert")]
    return {
        "writes_while_open": before, "writes_after_close": after,
        "defect_present": len(writes_while_inert) > 0 or len(after) != 1,
    }


def probe_late_storage_failure(ui: UI):
    """R2-05: فشل كتابة متأخر يزامن وصف البقاء (لا ادعاء دوام بعد فشل)."""
    ui.edit_it01()
    ui.p.evaluate("() => { Storage.prototype.setItem = function () {"
                  " throw new DOMException('injected write failure', 'QuotaExceededError'); }; }")
    ui.p.locator("#f03-name").fill("حفظ الجلسة فقط")
    ui.click("#f03-save", 800)
    ui.click("#f03-review-open")
    d = ui.p.evaluate("""() => ({
        persistent: F03Store.storageStatus().persistent,
        label: document.querySelector('#f03-rev-storage').textContent,
        committed: F03Store.get('it-01').name
    })""")
    ui.p.screenshot(path=str(ui.shots / f"05-storage-write-failed-{ui.tag}.png"), full_page=True)
    return {
        "actual": d,
        "defect_present": d["persistent"] is True or ("تبقى بعد إغلاق الملف" in d["label"]),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--old", required=True)
    ap.add_argument("--new", required=True)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    out = Path(args.out)
    (out / "screenshots").mkdir(parents=True, exist_ok=True)

    results = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
        for tag, root in (("old", Path(args.old)), ("new", Path(args.new))):
            srv, url = serve(root)
            ui = UI(browser, url, out / "screenshots", tag)
            results.append({"id": "two-categories", "source": tag,
                            **probe_two_categories(ui)})
            ui.close()
            ui = UI(browser, url, out / "screenshots", tag)
            results.append({"id": "clear-reopen", "source": tag,
                            **probe_clear_reopen(ui)})
            ui.close()
            for mode in ("edit", "add"):
                ui = UI(browser, url, out / "screenshots", tag)
                results.append({"id": f"unknown-{mode}-saved", "source": tag,
                                **probe_unknown_commit(mode)(ui)})
                ui.close()
            ui = UI(browser, url, out / "screenshots", tag)
            results.append({"id": "announcement-inert", "source": tag,
                            **probe_announcement_inert(ui)})
            ui.close()
            ui = UI(browser, url, out / "screenshots", tag)
            results.append({"id": "late-storage-failure", "source": tag,
                            **probe_late_storage_failure(ui)})
            ui.close()
            srv.shutdown()

        commit_new = subprocess.run(["git", "-C", str(args.new), "rev-parse", "HEAD"],
                                    capture_output=True, text=True).stdout.strip()
        commit_old = subprocess.run(["git", "-C", str(args.old), "rev-parse", "HEAD"],
                                    capture_output=True, text=True).stdout.strip()
        browser.close()

    summary = {
        "old_defects_detected": sum(1 for r in results if r["source"] == "old" and r["defect_present"]),
        "old_probes": sum(1 for r in results if r["source"] == "old"),
        "new_defects": sum(1 for r in results if r["source"] == "new" and r["defect_present"]),
        "new_probes": sum(1 for r in results if r["source"] == "new"),
        "source_commit_old": commit_old,
        "source_commit_new": commit_new,
    }
    (out / "probes.json").write_text(
        json.dumps({"summary": summary, "results": results}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    ok = summary["old_defects_detected"] == summary["old_probes"] and summary["new_defects"] == 0
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
