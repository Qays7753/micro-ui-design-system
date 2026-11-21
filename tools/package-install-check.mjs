#!/usr/bin/env node
/* @micro/ui — بوابة package-install (الجولة الثانية R3.3).
 *
 * تثبت الحزمة فعلًا كما يثبتها مستهلك خارجي وتثبت أنها قابلة للاستيراد:
 *   1. npm pack في مجلد مؤقت (بعد بناء حتمي).
 *   2. مشروع مؤقت (type: module) + npm install <tarball>.
 *   3. تحت Node بلا DOM: استيراد كل مدخل ينجح (لا أثر جانبي عند
 *      الاستيراد) وصادراته المتوقعة دوال موجودة.
 *   4. كل هدف في exports موجود فعلًا في الحزمة، وimport.meta.resolve
 *      يعمل لكل مدخل JS.
 *   5. tsc --noEmit على types-test.ts ضد الحزمة المثبتة.
 *   6. في المتصفح (Chromium عبر Playwright): صفحة importmap تشير إلى
 *      node_modules/@micro/ui/dist/esm/ تحمّل styles.css وتستورد
 *      Buttons وFields وNavigation وData وproduct وتستدعي init يدويًا —
 *      صفر أخطاء console، صفر طلبات فاشلة (خطوط وأيقونات وصور من
 *      الحزمة المثبتة)، وعناصر مرسومة (.m-btn مقاسه ≥ 48px).
 *   7. تثبيت من git (git+file://<repo>#<branch>) يشغّل prepare ويُنتج
 *      dist/ ويمر بنفس اختبار الاستيراد تحت Node.
 *
 * كل الخطوات تعمل في مجلدات مؤقتة تُحذف دائمًا؛ لا كتابة داخل المستودع.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync, readFileSync, cpSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TSC = path.join(ROOT, "node_modules", "typescript", "bin", "tsc");

/* الصادرات المتوقعة لكل مدخل (يجب أن تطابق جدول ENTRIES في
   tools/build-package.mjs — بوابة package تفرضها على البناء). */
const EXPECTED = {
  "buttons": ["init", "setLoading", "destroy", "getInstance"],
  "fields": ["init", "destroy", "getInstance", "setLabels"],
  "selection": ["init", "setSwitchPending", "destroy", "getInstance", "setLabels"],
  "picker": ["init", "update", "destroy", "getInstance", "setOptions", "setStatus", "clearSelection", "getSelected", "setLabels"],
  "organization": ["init", "destroy", "getInstance", "setLabels"],
  "data": ["init", "getSelection", "setSelection", "destroy", "getInstance", "setLabels"],
  "packed-circle": ["init", "destroy", "getInstance", "setLabels"],
  "messages": ["init", "toast", "closeToast", "announce", "resetAnnouncements", "destroy", "getInstance", "setLabels"],
  "navigation": ["init", "openLayer", "requestClose", "closeLayer", "appliedFilters", "setAppliedFilters", "destroy", "getInstance", "setLabels"],
  "action-sheet": ["init", "open", "close", "destroy", "getInstance", "setLabels"],
  "info-strip": ["init", "destroy", "getInstance", "setLabels"],
  "info-strip-peek": ["init", "goTo", "next", "prev", "getIndex", "destroy", "getInstance", "setLabels"],
  "metric-comparison": ["init", "destroy", "getInstance", "setLabels"],
  "account-settings": ["init", "destroy", "getInstance", "setLabels"],
  "access-gateway": ["init", "destroy", "getInstance", "setLabels"],
  "carousel": ["init", "goTo", "next", "prev", "getIndex", "destroy", "getInstance", "setLabels"],
  "order-schedule": ["init", "update", "getInstance", "destroy", "setLabels"],
  "readings": ["init", "destroy", "getInstance"],
  "product": ["register", "mount", "contextKey", "init", "destroy", "getInstance", "setLabels"],
  "icons": ["hydrate", "ready"],
  "labels": ["registerLabels", "getLabel", "familyLabels", "setLabels", "setLocale", "getLocale", "formatNumber", "pluralCategory", "plural"],
};

const ENTRIES = Object.keys(EXPECTED);

/* صفحة المتصفح (خطوة 6): importmap إلى dist/esm داخل node_modules. */
const BROWSER_PAGE = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>package-install browser check</title>
<link rel="stylesheet" href="./node_modules/@micro/ui/dist/css/styles.css">
<script type="importmap">
{"imports": {
  "@micro/ui/buttons": "./node_modules/@micro/ui/dist/esm/buttons.js",
  "@micro/ui/fields": "./node_modules/@micro/ui/dist/esm/fields.js",
  "@micro/ui/navigation": "./node_modules/@micro/ui/dist/esm/navigation.js",
  "@micro/ui/data": "./node_modules/@micro/ui/dist/esm/data.js",
  "@micro/ui/product": "./node_modules/@micro/ui/dist/esm/product.js"
}}
</script>
</head>
<body>
<main>
  <button class="m-btn m-btn--primary" id="b1" type="button">إرسال الطلب</button>
  <div class="m-field" data-micro-field>
    <label class="m-field__label" for="f1">اسم المستفيد</label>
    <div class="m-field__control">
      <input class="m-field__input" id="f1" type="text" value="أحمد" maxlength="40">
    </div>
    <p class="m-field__msg" data-field-msg hidden>رسالة</p>
    <span class="m-field__count" aria-hidden="true"></span>
  </div>
  <section class="m-chart m-chart--bars" data-chart="bars" data-max="12" id="chart1">
    <h2 class="m-chart__title">توزيع العمليات</h2>
    <ul class="m-chart__data" hidden>
      <li data-series="a" data-label="مبيعات" data-value="8"></li>
      <li data-series="b" data-label="مشتريات" data-value="4"></li>
    </ul>
    <div class="m-chart__plot" data-plot></div>
  </section>
  <section id="product-root"></section>
</main>
<script type="module">
  import { init as initButtons } from '@micro/ui/buttons';
  import { init as initFields } from '@micro/ui/fields';
  import { init as initNavigation } from '@micro/ui/navigation';
  import { init as initData } from '@micro/ui/data';
  import { init as initProduct } from '@micro/ui/product';
  initButtons(document);
  initFields(document);
  initNavigation(document);
  initData(document);
  const scope = { contextId: 'owner-a', workspaceId: 'workshop-a', roleId: 'owner', kind: 'business', label: 'ورشة الشروق · صاحب مشروع' };
  const model = {
    type: 'context', scope: scope, dataContext: scope, phase: 'ready',
    connection: 'online', destination: 'manage',
    permissions: ['view', 'compose', 'navigate', 'switch-context'], revision: 'install-check-r1',
    accountLabel: 'Micro · حساب تجريبي واحد',
    contexts: [{ scope: scope, label: scope.label, destinations: ['manage', 'market', 'delivery', 'ask'] }],
  };
  initProduct(document.querySelector('#product-root'), model);
</script>
</body>
</html>
`;

/* محرّك الخطوة 6: خادم ثابت + Chromium عبر Playwright (بيئة uv) — سكربت
   Python مضمّن يطبع نتيجة JSON ويُحذف مع مجلده المؤقت. */
const BROWSER_DRIVER = String.raw`
import json, sys, threading
from pathlib import Path
import http.server
sys.path.insert(0, "tools")
from browser_support import chromium_launch_options
from playwright.sync_api import sync_playwright

root = Path(sys.argv[1])
page_rel = sys.argv[2]

class Quiet(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=str(root), **kw)
    def log_message(self, *a):
        pass
server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Quiet)
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_port}/{page_rel}"

console_errors, page_errors, failed = [], [], []
with sync_playwright() as p:
    browser = p.chromium.launch(**chromium_launch_options())
    page = browser.new_page(viewport={"width": 360, "height": 780})
    page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: page_errors.append(str(e)))
    page.on("requestfailed", lambda r: failed.append(r.url))
    page.on("response", lambda r: failed.append(f"{r.status} {r.url}") if r.status >= 400 else None)
    page.goto(url, wait_until="load")
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(400)
    result = page.evaluate("""() => ({
      button: (() => { const b = document.querySelector('.m-btn'); if (!b) return null;
        const r = b.getBoundingClientRect(); return { height: r.height, width: r.width }; })(),
      field: !!document.querySelector('.m-field__control'),
      chart: !!document.querySelector('#chart1 [data-plot] svg'),
      product: !!document.querySelector('#product-root h2'),
    })""")
    browser.close()
server.shutdown()
print(json.dumps({
  "consoleErrors": console_errors, "pageErrors": page_errors, "failedRequests": failed,
  "rendered": result,
  "ok": not console_errors and not page_errors and not failed
        and result and result["button"] and result["button"]["height"] >= 48
        and result["field"] and result["chart"] and result["product"],
}))
`;

function run(command, args, options = {}) {
  const merged = { stdio: ["ignore", "pipe", "pipe"], ...options };
  try {
    const output = execFileSync(command, args, merged);
    return output ? output.toString() : "";
  } catch (error) {
    const detail = [error.stdout, error.stderr].filter(Boolean).map(String).join("\n");
    const message = `${command} ${args.join(" ")} فشل (خروج ${error.status})${detail ? ":\n" + detail.slice(-2000) : ""}`;
    throw new Error(message);
  }
}

function step(n, label) {
  console.log(`package-install: ${n}. ${label}`);
}

async function main() {
  const work = mkdtempSync(path.join(tmpdir(), "micro-ui-install-"));
  let failed = 0;
  const finish = (code) => {
    rmSync(work, { recursive: true, force: true });
    console.log(`package-install: ${code === 0 ? "OK" : "FAIL"} (7 خطوات)`);
    process.exit(code);
  };
  try {
    /* 0. بناء حتمي قبل التحزيم (dist/ غير متتبع — R-D4). */
    step(0, "بناء الحزمة (node tools/build-package.mjs)");
    run("node", [path.join(ROOT, "tools", "build-package.mjs")], { cwd: ROOT });

    /* 1. npm pack */
    step(1, "npm pack إلى مجلد مؤقت");
    const packDir = path.join(work, "pack");
    mkdirSync(packDir, { recursive: true });
    run("npm", ["pack", "--silent", "--pack-destination", packDir], { cwd: ROOT });
    const tarball = path.join(packDir, "micro-ui-0.2.0.tgz");
    if (!existsSync(tarball)) {
      console.error("  npm pack لم ينتج micro-ui-0.2.0.tgz");
      finish(1);
    }

    /* 2. مشروع مؤقت + تثبيت */
    step(2, "مشروع مؤقت + npm install <tarball>");
    const proj = path.join(work, "proj");
    mkdirSync(proj, { recursive: true });
    writeFileSync(path.join(proj, "package.json"),
      JSON.stringify({ name: "install-check", private: true, type: "module", version: "1.0.0" }, null, 2) + "\n");
    run("npm", ["install", "--no-audit", "--no-fund", "--silent", tarball], { cwd: proj });
    const installed = path.join(proj, "node_modules", "@micro", "ui");

    /* 3. استيراد تحت Node بلا DOM + الصادرات المتوقعة. */
    step(3, `استيراد ${ENTRIES.length} مدخلًا تحت Node (بلا DOM) والتحقق من الصادرات`);
    writeFileSync(path.join(proj, "check-imports.mjs"),
      `const expected = ${JSON.stringify(EXPECTED)};\n` +
      `let failed = 0;\n` +
      `if (typeof document !== "undefined") { console.error("document معرف في Node؟"); failed++; }\n` +
      `for (const [entry, names] of Object.entries(expected)) {\n` +
      `  let mod;\n` +
      `  try { mod = await import("@micro/ui/" + entry); }\n` +
      `  catch (error) { console.error("استيراد فاشل:", entry, error.message); failed++; continue; }\n` +
      `  for (const name of names) {\n` +
      `    if (typeof mod[name] !== "function") { console.error("صادر مفقود أو ليس دالة:", entry, name, typeof mod[name]); failed++; }\n` +
      `  }\n` +
      `}\n` +
      `console.log("imported", Object.keys(expected).length, "entries under Node (no DOM)");\n` +
      `process.exit(failed ? 1 : 0);\n`);
    run("node", ["check-imports.mjs"], { cwd: proj });

    /* 4. أهداف exports موجودة + import.meta.resolve لكل مدخل. */
    step(4, "أهداف exports موجودة وimport.meta.resolve يعمل لكل مدخل");
    const pkgJson = JSON.parse(readFileSync(path.join(installed, "package.json"), "utf8"));
    let missing = [];
    for (const [subpath, target] of Object.entries(pkgJson.exports)) {
      const targets = typeof target === "string" ? [target] : Object.values(target);
      for (const rel of targets) {
        if (rel === "./package.json") continue;
        const clean = rel.replace(/^\./, "").replace(/\*$/, "");
        const abs = path.join(installed, clean);
        if (!existsSync(abs)) missing.push(`${subpath} -> ${rel}`);
      }
    }
    if (missing.length) {
      console.error("  أهداف مفقودة من الحزمة:", missing.join("؛ "));
      failed++;
    }
    writeFileSync(path.join(proj, "check-resolve.mjs"),
      `const entries = ${JSON.stringify(ENTRIES)};\n` +
      `let failed = 0;\n` +
      `for (const entry of entries) {\n` +
      `  const resolved = import.meta.resolve("@micro/ui/" + entry);\n` +
      `  if (!resolved.includes("@micro/ui/dist/esm/" + entry + ".js")) { console.error("resolve غريب:", entry, resolved); failed++; }\n` +
      `}\n` +
      `console.log("resolved", entries.length, "entries via import.meta.resolve");\n` +
      `process.exit(failed ? 1 : 0);\n`);
    run("node", ["check-resolve.mjs"], { cwd: proj });

    /* 5. tsc --noEmit على types-test.ts ضد الحزمة المثبتة. */
    step(5, "tsc --noEmit على types-test.ts ضد الحزمة المثبتة");
    cpSync(path.join(ROOT, "tools", "package", "types-test.ts"), path.join(proj, "types-test.ts"));
    run(process.execPath, [TSC, "--noEmit", "--strict", "--target", "ES2020",
      "--lib", "ES2020,DOM,DOM.Iterable", "--module", "ESNext", "--moduleResolution", "Bundler",
      "types-test.ts"], { cwd: proj });

    /* 6. المتصفح: importmap + خمسة مداخل + init يدوي. */
    step(6, "Chromium: importmap إلى dist/esm المثبتة + init يدوي + صفر أخطاء");
    const pageRel = "browser-check.html";
    writeFileSync(path.join(proj, pageRel), BROWSER_PAGE);
    const driver = path.join(work, "browser_driver.py");
    writeFileSync(driver, BROWSER_DRIVER);
    const browserOut = run("uv", ["run", "python", driver, proj, pageRel], { cwd: ROOT });
    const verdictLine = browserOut.trim().split("\n").pop();
    let verdict;
    try { verdict = JSON.parse(verdictLine); } catch { verdict = { ok: false, raw: verdictLine }; }
    if (!verdict.ok) {
      console.error("  فشل فحص المتصفح:", JSON.stringify(verdict, null, 2));
      failed++;
    } else {
      console.log(`  button ${verdict.rendered.button.height}x${verdict.rendered.button.width}px، field=${verdict.rendered.field}، chart=${verdict.rendered.chart}، product=${verdict.rendered.product}`);
    }

    /* 7. تثبيت من git: prepare يبني dist داخل الحزمة. */
    step(7, "npm install git+file://<repo>#<branch> — prepare يبني dist");
    const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: ROOT }).trim();
    const proj2 = path.join(work, "proj-git");
    mkdirSync(proj2, { recursive: true });
    writeFileSync(path.join(proj2, "package.json"),
      JSON.stringify({ name: "install-check-git", private: true, type: "module", version: "1.0.0" }, null, 2) + "\n");
    run("npm", ["install", "--no-audit", "--no-fund", "--silent",
      `git+file://${ROOT}#${branch}`], { cwd: proj2 });
    const installed2 = path.join(proj2, "node_modules", "@micro", "ui");
    if (!existsSync(path.join(installed2, "dist", "esm", "buttons.js"))) {
      console.error("  prepare لم يُنتج dist/esm في تثبيت git");
      failed++;
    } else {
      cpSync(path.join(proj, "check-imports.mjs"), path.join(proj2, "check-imports.mjs"));
      run("node", ["check-imports.mjs"], { cwd: proj2 });
    }
  } catch (error) {
    console.error("package-install:", error.message);
    failed++;
  }
  finish(failed ? 1 : 0);
}

main();
