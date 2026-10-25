#!/usr/bin/env python3
"""Independent Light-only review of the live-source showcase and field contract.

Runs a real Chromium matrix against previews/ui-system-showcase/index.html.
The typography level is a visible CSS text-size enlargement (not browser zoom).
This checker deliberately never exercises or emulates a non-Light appearance.
"""
import argparse
import hashlib
import http.server
import json
import subprocess
import threading
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from playwright.sync_api import sync_playwright

from browser_support import chromium_launch_options


ROOT = Path(__file__).resolve().parent.parent
BASELINE = "161bb71adbed86e0df4382174cb07bd2fcb8d62d"
SHOWCASE = "/previews/ui-system-showcase/index.html"
WIDTHS = (320, 360, 390, 430)
DIRECTIONS = ("rtl", "ltr")
LANGUAGES = ("ar", "en")
TYPOGRAPHY = (1, 2)
DPRS = (1, 2)
SOURCE_PATHS = (
    "assets/fonts/fonts.css",
    "assets/fonts/IBMPlexSans-Latin-400.woff2",
    "assets/fonts/IBMPlexSans-Latin-500.woff2",
    "assets/fonts/IBMPlexSans-Latin-600.woff2",
    "assets/fonts/IBMPlexSansArabic-Arabic-400.woff2",
    "assets/fonts/IBMPlexSansArabic-Arabic-500.woff2",
    "assets/fonts/IBMPlexSansArabic-Arabic-600.woff2",
    "previews/ui-system-showcase/index.html",
    "previews/ui-system-showcase/showcase.css",
    "previews/ui-system-showcase/showcase.js",
    "previews/ui-system-showcase/standalone.html",
    "shared/tokens.css",
    "shared/motion.css",
    "components/buttons/buttons.css",
    "components/buttons/buttons.js",
    "components/fields/fields.css",
    "components/fields/fields.js",
    "components/selection/selection.css",
    "components/selection/selection.js",
    "components/selection/picker.css",
    "components/selection/picker.js",
    "components/organization/organization.css",
    "components/organization/organization.js",
    "components/data/data.css",
    "components/data/data.js",
    "components/data/packed-circle.css",
    "components/data/packed-circle.js",
    "components/messages/messages.css",
    "components/messages/messages.js",
    "components/navigation/navigation.css",
    "components/navigation/navigation.js",
    "components/surfaces/surfaces.css",
    "components/surfaces/curves.css",
    "components/info-strip/info-strip.css",
    "components/info-strip/info-strip.js",
    "components/info-strip/info-strip-peek.css",
    "components/info-strip/info-strip-peek.js",
    "components/metric-comparison/metric-comparison.css",
    "components/metric-comparison/metric-comparison.js",
    "components/account-settings/account-settings.css",
    "components/account-settings/account-settings.js",
    "components/access-gateway/access-gateway.css",
    "components/access-gateway/access-gateway.js",
    "components/order-schedule/order-schedule.css",
    "components/order-schedule/order-schedule.js",
    "components/carousel/carousel.css",
    "components/carousel/carousel.js",
)

ENGLISH_HOST_FIXTURE = {
    "surfacesTitle": "Surfaces",
    "surfacesDescription": "Neutral surfaces organize information without implying status.",
    "sampleSurfaceLabel": "Summary",
    "sampleSurfaceTitle": "Today's overview",
    "sampleSurfaceDescription": "Host-provided information, clearly grouped.",
    "plainSurfaceLabel": "Plain surface",
    "plainSurfaceTitle": "Secondary reading",
    "plainSurfaceDescription": "A quiet alternative using the same information hierarchy.",
    "buttonsTitle": "Actions",
    "saveAction": "Save changes",
    "filterAction": "Filter",
    "lightAction": "Quick action",
    "deleteAction": "Delete",
    "removeAction": "Remove item",
    "fieldsTitle": "Fields",
    "fieldsDescription": "Labels remain visible; submitted values belong to the host.",
    "fieldLabel": "Product name",
    "fieldValue": "Olive oil soap",
    "notesLabel": "Order notes",
    "notesValue": "Prepare before delivery",
    "searchLabel": "Search items",
    "amountLabel": "Invoice total",
    "quantityLabel": "Quantity",
    "demoLabel": "Validation example",
    "demoValue": "Value retained while validating",
    "disabledLabel": "Disabled field",
    "readOnlyLabel": "Read-only order number",
    "infoTitle": "Information cards",
    "infoLabel": "Today's requests",
    "infoUnit": "requests",
    "metricTitle": "Precise comparison",
    "metricDescription": "Shared-axis values and host-provided labels support precise comparison.",
    "metricRows": ["Orders", "Returns", "Reviews", "Pending"],
    "chartLabel": "Host supplied comparison label",
}

TYPOGRAPHY_CSS = """
#sc-canvas .sc-section__title,
#sc-canvas .sc-section__desc,
#sc-canvas .m-field__label,
#sc-canvas .m-field__input,
#sc-canvas .m-field__area,
#sc-canvas .m-info-card__label,
#sc-canvas .m-info-card__number,
#sc-canvas .m-info-card__unit,
#sc-canvas .m-main-metric__title,
#sc-canvas .m-main-metric__label,
#sc-canvas .m-main-metric__number,
#sc-canvas .m-main-metric__unit {
  font-size: 2em !important;
  line-height: 1.4 !important;
}
"""

CALENDAR_TEXT_SELECTORS = (
    ".m-ocal__views-btn,.m-ocal__modes-btn,.m-ocal__navbtn,.m-ocal__month-trigger,"
    ".m-ocal__todaybtn,.m-ocal__picker-yearbtn,.m-ocal__picker-back,.m-ocal__picker-month,"
    ".m-ocal__weekday,.m-ocal__cell,.m-ocal__daynum,.m-ocal__count,.m-ocal__rail-day,"
    ".m-ocal__rail-weekday,.m-ocal__rail-number,.m-ocal__rail-month,.m-ocal__row,"
    ".m-ocal__row-title,.m-ocal__row-customer,.m-ocal__row-statuslabel,.m-ocal__row-date,"
    ".m-ocal__row-time-value,.m-ocal__daypanel-title,.m-ocal__daypanel-count,"
    ".m-ocal__add,.m-ocal__list-title,.m-ocal__section-title,.m-ocal__status-text,"
    ".m-ocal__loading-text,.m-ocal__error-text"
)

CALENDAR_HTML = """<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="data:,">
<link rel="stylesheet" href="/assets/fonts/fonts.css"><link rel="stylesheet" href="/shared/tokens.css">
<link rel="stylesheet" href="/components/order-schedule/order-schedule.css">
<style>
*{box-sizing:border-box}
html,body{margin:0;min-width:0;background:var(--micro-surface-page);color:var(--micro-text-primary)}
#fixture{width:100%;max-width:100%;padding:8px}
#order-root{max-width:100%;margin:auto;font-family:var(--micro-font-family)}
</style></head><body><main id="fixture"><div id="order-root"></div></main>
<script src="/components/order-schedule/order-schedule.js"></script>
<script>
(() => {
  const q=new URLSearchParams(location.search),root=document.querySelector('#order-root');
  const language=q.get('language'),direction=q.get('direction');
  root.style.width=q.get('root')+'px';root.dir=direction;
  const ar=language==='ar';
  const title=ar?'طلب تجهيز استقبال الوفد في قاعة الاجتماعات الرئيسية مع تنسيق المستلزمات':'Prepare reception for the visiting team in the main meeting room with all requested supplies';
  const normal=[
    {id:'one',title:ar?'طلب تنظيف موقع العمل':'Clean the worksite',date:'2026-10-07',time:'09:15',statusKey:'progress',customer:ar?'فرع الشمال':'North branch'},
    {id:'next',title:ar?'تسليم طلب الصيانة':'Deliver the maintenance order',date:'2026-10-08',time:null,statusKey:'hold'}
  ];
  const one=[{id:'single',title:title,date:'2026-10-07',time:'14:30',statusKey:'progress',customer:ar?'شركة النور':'Noor Company'}];
  const many=[
    {id:'many-1',title:title,date:'2026-10-07',time:'08:00',statusKey:'progress',customer:ar?'قاعة الملتقى':'Conference Hall'},
    {id:'many-2',title:ar?'طلب تجهيز مكتب الاستقبال':'Prepare the reception desk',date:'2026-10-07',time:'09:00',statusKey:'done'},
    {id:'many-3',title:ar?'طلب مستلزمات الضيافة':'Supply hospitality items',date:'2026-10-07',time:'10:00',statusKey:'hold'},
    {id:'many-4',title:ar?'طلب قرطاسية إدارية':'Provide office stationery',date:'2026-10-07',time:'11:00',statusKey:'progress'},
    {id:'many-5',title:ar?'طلب صيانة أجهزة العرض':'Service the presentation equipment',date:'2026-10-07',time:'12:00',statusKey:'done'}
  ];
  const statuses=ar
    ?{progress:{label:'قيد التنفيذ',tone:'progress'},done:{label:'تم التسليم',tone:'success'},hold:{label:'بانتظار العميل',tone:'warning'}}
    :{progress:{label:'In progress',tone:'progress'},done:{label:'Complete',tone:'success'},hold:{label:'On hold',tone:'warning'}};
  window.calendarFixtures={normal,one,many,title};
  window.calendarEvents=[];
  root.addEventListener('order-schedule:day-select',e=>calendarEvents.push(e.detail));
  window.calendarInstance=MicroOrderSchedule.init(root,{orders:normal,statuses,today:'2026-10-07',
    selectedDate:'2026-10-07',weekStart:6,view:'calendar',calendarView:'month'});
})();
</script></body></html>"""


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *_args):
        pass

    def do_GET(self):
        if urlparse(self.path).path == "/calendar-release-fixture.html":
            payload = CALENDAR_HTML.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        super().do_GET()


def digest(data):
    return hashlib.sha256(data).hexdigest()


def source_hashes():
    return {name: digest((ROOT / name).read_bytes()) for name in SOURCE_PATHS}


def baseline_logo_hashes():
    listing = subprocess.run(
        ["git", "ls-tree", "-r", "--name-only", BASELINE, "--", "assets/brand/micro-logo/v2"],
        cwd=ROOT, check=True, capture_output=True, text=True,
    ).stdout.splitlines()
    hashes = {}
    for path in listing:
        content = subprocess.run(
            ["git", "show", f"{BASELINE}:{path}"], cwd=ROOT, check=True,
            capture_output=True,
        ).stdout
        hashes[path] = digest(content)
    return hashes


def current_logo_hashes():
    root = ROOT / "assets/brand/micro-logo/v2"
    return {
        path.relative_to(ROOT).as_posix(): digest(path.read_bytes())
        for path in sorted(root.rglob("*")) if path.is_file()
    }


def used_fixture_manifest(hashes):
    return {
        "fixtureKind": "Live showcase source plus host-localized English Overview content and isolated Calendar host-order fixtures",
        "showcasePath": SHOWCASE,
        "sourceSha256": hashes,
        "matrix": {
            "widthCssPx": list(WIDTHS),
            "direction": list(DIRECTIONS),
            "language": list(LANGUAGES),
            "typographyLevel": list(TYPOGRAPHY),
            "deviceScaleFactor": list(DPRS),
            "appearance": "Light",
            "calendarRootWidthByViewportCssPx": {"320": 288, "360": 328, "390": 358, "430": 398},
            "calendarStates": ["normal", "empty", "one-order", "many-orders", "loading", "error/retry"],
        },
        "englishHostContent": ENGLISH_HOST_FIXTURE,
        "sourceFixtures": {
            "arabicShowcaseField": "صابون زيت الزيتون",
            "arabicStatusDemo": "قيمة تبقى عند الخطأ",
            "normalAndStressModes": ["normal", "stress"],
            "fieldStateSequence": ["normal", "error", "success", "clear", "input"],
            "chartZeroMissingNegativeLong": True,
        },
        "notes": [
            "English Showcase cases keep document and overall canvas lang=ar; only populated, translated Overview component sections receive lang=en. The Arabic host header remains genuinely Arabic.",
            "English Calendar cases use actual English host order titles, customers, and status labels while Calendar's own shipped Arabic UI remains Arabic.",
            "Typography level 2 doubles computed font and line-height for HTML text-bearing Calendar elements after baseline measurement; SVG/icon geometry is untouched and this is not native browser zoom.",
            "Component Calendar and Data focused check counts are not included in this tool's own check totals.",
        ],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out", type=Path,
        default=ROOT / "generated-artifacts/light-only-repair/acceptance",
        help="matrix screenshot and independent report directory",
    )
    parser.add_argument(
        "--capture-only", action="store_true",
        help="capture all matrix cases and source/fixture metadata without behavioral assertions",
    )
    parser.add_argument(
        "--defer-standalone", action="store_true",
        help="defer generated standalone startup until the owner rebuilds it from integrated source",
    )
    args = parser.parse_args()
    out = args.out
    out.mkdir(parents=True, exist_ok=True)
    hashes = source_hashes()
    (out / "fixtures-used.json").write_text(
        json.dumps(used_fixture_manifest(hashes), ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    url = f"http://127.0.0.1:{server.server_port}{SHOWCASE}"
    checks = []
    browser_errors = []
    browser_version = "unknown"
    matrix_cases = []

    def check(name, passed, detail=None):
        checks.append({"name": name, "passed": bool(passed), "detail": detail})
        print(("PASS " if passed else "FAIL ") + name)

    def error_listener(page):
        page.on("pageerror", lambda error: browser_errors.append(str(error)))
        page.on("console", lambda msg: browser_errors.append(msg.text) if msg.type == "error" else None)
        page.on("requestfailed", lambda req: browser_errors.append(req.url + ": " + str(req.failure)))
        page.on("response", lambda response: browser_errors.append(
            f"{response.status} {response.url}") if response.status >= 400 else None)

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(**chromium_launch_options())
            browser_version = browser.version

            for width in WIDTHS:
                for direction in DIRECTIONS:
                    for language in LANGUAGES:
                        for type_level in TYPOGRAPHY:
                            for dpr in DPRS:
                                case = f"{width}-{direction}-{language}-type{type_level}-dpr{dpr}"
                                context = browser.new_context(
                                    viewport={"width": width, "height": 900},
                                    device_scale_factor=dpr,
                                    locale="en-US" if language == "en" else "ar",
                                    color_scheme="light",
                                )
                                page = context.new_page()
                                error_listener(page)
                                page.goto(url, wait_until="load")
                                page.evaluate("""({direction,language}) => {
                                  document.documentElement.dir = direction;
                                  document.documentElement.lang = 'ar';
                                  document.querySelector('#sc-canvas').lang = 'ar';
                                  document.querySelectorAll(
                                    '#sc-surfaces,#sc-buttons,#sc-fields,#sc-info-strip,#sc-metric'
                                  ).forEach(section=>section.lang=language);
                                  return document.fonts.ready;
                                }""", {"direction": direction, "language": language})
                                if language == "en":
                                    page.evaluate("""(fixture) => {
                                      const setText=(selector,text,root=document)=>{
                                        const node=root.querySelector(selector);
                                        if(node) node.textContent=text;
                                      };
                                      const canvas=document.querySelector('#sc-canvas');
                                      const heading=(selector,text)=>{
                                        const node=canvas.querySelector(selector);
                                        if(!node) return;
                                        const badge=node.querySelector('.sc-pill');
                                        if(node.firstChild&&node.firstChild.nodeType===Node.TEXT_NODE)
                                          node.firstChild.textContent=text+' ';
                                        else node.insertBefore(document.createTextNode(text+' '),badge||null);
                                      };
                                      heading('#sc-surfaces-title',fixture.surfacesTitle);
                                      heading('#sc-buttons-title',fixture.buttonsTitle);
                                      heading('#sc-fields-title',fixture.fieldsTitle);
                                      heading('#sc-info-title',fixture.infoTitle);
                                      heading('#sc-metric-title',fixture.metricTitle);
                                      setText('#sc-surfaces .sc-section__desc',fixture.surfacesDescription,canvas);
                                      setText('#sc-buttons .sc-section__desc','Actions are concise and use clear labels.',canvas);
                                      setText('#sc-fields .sc-section__desc',fixture.fieldsDescription,canvas);
                                      setText('#sc-metric .sc-section__desc',fixture.metricDescription,canvas);
                                      const surface=canvas.querySelector('#sc-surfaces');
                                      setText('.m-surface__label',fixture.sampleSurfaceLabel,surface);
                                      setText('.m-surface__title',fixture.sampleSurfaceTitle,surface);
                                      setText('.m-surface__sub',fixture.sampleSurfaceDescription,surface);
                                      const plain=surface.querySelector('.m-surface--plain');
                                      setText('.m-surface__label',fixture.plainSurfaceLabel,plain);
                                      setText('.m-surface__title',fixture.plainSurfaceTitle,plain);
                                      setText('.m-surface__sub',fixture.plainSurfaceDescription,plain);
                                      const setButtonLabel=(button,text)=>{
                                        if(!button) return;
                                        const label=[...button.childNodes].find(node=>
                                          node.nodeType===Node.TEXT_NODE&&node.textContent.trim());
                                        if(label) label.textContent=text;
                                        else button.appendChild(document.createTextNode(text));
                                      };
                                      const actionButtons=canvas.querySelectorAll('#sc-buttons .sc-row .m-btn');
                                      setButtonLabel(actionButtons[0],fixture.saveAction);
                                      setButtonLabel(actionButtons[1],fixture.filterAction);
                                      setButtonLabel(canvas.querySelector('#sc-buttons .m-btn--light'),fixture.lightAction);
                                      setButtonLabel(canvas.querySelector('#sc-buttons .m-btn--destructive'),fixture.deleteAction);
                                      setButtonLabel(canvas.querySelector('#sc-buttons .m-btn--destructive-soft'),fixture.removeAction);
                                      const stateButtons=canvas.querySelectorAll('#sc-buttons [id^="sc-btn-"]');
                                      ['Change loading','Toggle pressed state','Toggle disabled state'].forEach((label,index)=>
                                        setButtonLabel(stateButtons[index+1],label));
                                      canvas.querySelectorAll('#sc-buttons .m-btn--icon').forEach((button,index)=>
                                        button.setAttribute('aria-label',index===0?'More options':'Search'));
                                      canvas.querySelector('#sc-btn-demo')?.setAttribute('data-loading-label','Saving...');
                                      setText('label[for="sc-f-name"]',fixture.fieldLabel,canvas);
                                      document.querySelector('#sc-f-name').value=fixture.fieldValue;
                                      setText('label[for="sc-f-notes"]',fixture.notesLabel,canvas);
                                      document.querySelector('#sc-f-notes').value=fixture.notesValue;
                                      setText('label[for="sc-f-search"]',fixture.searchLabel,canvas);
                                      setText('label[for="sc-f-amount"]',fixture.amountLabel,canvas);
                                      setText('label[for="sc-f-qty"]',fixture.quantityLabel,canvas);
                                      setText('label[for="sc-f-demo"]',fixture.demoLabel,canvas);
                                      document.querySelector('#sc-f-demo').value=fixture.demoValue;
                                      setText('label[for="sc-f-dis"]',fixture.disabledLabel,canvas);
                                      setText('label[for="sc-f-ro"]',fixture.readOnlyLabel,canvas);
                                      document.querySelector('#sc-f-dis').value='Unavailable';
                                      const cards=canvas.querySelectorAll('#sc-info-strip .m-info-card');
                                      const labels=[fixture.infoLabel,'Sample stock',fixture.infoLabel,'Sample value','Sample stock'];
                                      const units=[fixture.infoUnit,'Unavailable',fixture.infoUnit,'JOD','Unavailable'];
                                      cards.forEach((card,index)=>{
                                        setText('.m-info-card__label',labels[index]||fixture.infoLabel,card);
                                        setText('.m-info-card__unit',units[index]||fixture.infoUnit,card);
                                        card.setAttribute('aria-label',(labels[index]||fixture.infoLabel)+', '+
                                          (card.querySelector('.m-info-card__number')?.textContent.trim()||''));
                                      });
                                      const metric=canvas.querySelector('#sc-main-metric-flat');
                                      if(metric) {
                                        setText('.m-main-metric__title','Daily operational totals',metric);
                                        setText('.m-main-metric__label','Completed operations',metric);
                                        metric.setAttribute('aria-label','Independent flat comparison recommended for wide reading');
                                        metric.querySelectorAll('[data-bar-source] [data-label]').forEach((row,index)=>{
                                          row.setAttribute('data-label',fixture.metricRows[index]||'Metric');
                                          row.setAttribute('data-unit','operations');
                                          row.setAttribute('data-period','today');
                                        });
                                      }
                                      const circles=canvas.querySelector('#sc-circles');
                                      if(circles) {
                                        circles.setAttribute('aria-label','Compact operational reading cards; the phone-approved presentation');
                                        circles.querySelectorAll('.m-stat__label').forEach((el,index)=>{
                                          el.textContent=['Item A','Item B','Item C'][index]||'Item';
                                        });
                                        circles.querySelectorAll('.m-stat__unit').forEach((el)=>{
                                          if(el.textContent.trim()==='وحدة') el.textContent='units';
                                        });
                                      }
                                      if(window.MicroMetricComparison) {
                                        window.MicroMetricComparison.render(document.querySelector('#sc-main-metric-flat'));
                                      }
                                    }""", ENGLISH_HOST_FIXTURE)
                                if type_level == 2:
                                    page.add_style_tag(content=TYPOGRAPHY_CSS)
                                page.evaluate("document.fonts.ready")
                                page.wait_for_timeout(40)
                                if language == "en" or (type_level == 1 and dpr == 1):
                                    page.locator("#sc-fields").scroll_into_view_if_needed()
                                    page.evaluate("document.fonts.ready")

                                state = page.evaluate("""() => {
                                  const visible=e=>!!e&&!!(e.getClientRects().length)&&getComputedStyle(e).visibility!=='hidden';
                                  const field=document.querySelector('#sc-f-name');
                                  const fieldRect=field.getBoundingClientRect();
                                  const visibleComponents=['.m-btn','.m-field','.m-info-card','[data-main-comparison]']
                                    .map(selector=>({selector,visible:[...document.querySelectorAll(selector)].filter(visible).length}));
                                  const shell=document.querySelector('.showcase-canvas');
                                  return {
                                    theme:document.documentElement.getAttribute('data-theme'),
                                    colorScheme:getComputedStyle(document.documentElement).colorScheme,
                                    lang:document.documentElement.lang,canvasLang:document.querySelector('#sc-canvas').lang,
                                    fixtureLang:document.querySelector('#sc-fields').lang,
                                    componentLanguages:[...document.querySelectorAll(
                                      '#sc-surfaces,#sc-buttons,#sc-fields,#sc-info-strip,#sc-metric'
                                    )].map(section=>section.lang),
                                    dir:document.documentElement.dir,
                                    view:document.body.getAttribute('data-view'),
                                    visibleComponents,
                                    visibleLogs:[...document.querySelectorAll('.sc-log')].filter(visible).length,
                                    visibleDebug:[...document.querySelectorAll('.sc-tools,.sc-hint,.showcase-controls')].filter(visible).length,
                                    pageWidth:document.documentElement.scrollWidth,
                                    viewport:innerWidth,
                                    accentCount:document.querySelectorAll('.showcase-canvas .m-info-card--accent').length,
                                    applicableControls:[...document.querySelectorAll(
                                      '.showcase-canvas .m-btn,.showcase-canvas .m-info-strip__arrow,'+
                                      '.showcase-canvas .m-info-strip__page,.showcase-canvas .m-tabs__tab,'+
                                      '.showcase-canvas .m-choice'
                                    )].filter(visible).map(e=>{
                                      const r=e.getBoundingClientRect();
                                      return {name:e.getAttribute('aria-label')||e.textContent.trim().slice(0,40),
                                        width:r.width,height:r.height};
                                    }),
                                    fieldValue:document.querySelector('#sc-f-name')?.value||'',
                                    fieldInViewport:fieldRect.top<innerHeight&&fieldRect.bottom>0,
                                    demoValue:document.querySelector('#sc-f-demo')?.value||'',
                                    englishHostLabel:document.querySelector('label[for="sc-f-name"]')?.textContent.trim()||'',
                                    englishSurfaceTitle:document.querySelector('#sc-surfaces-title')?.textContent.trim()||'',
                                    englishAction:document.querySelector('#sc-btn-demo')?.textContent.trim()||'',
                                    fieldLabelPx:parseFloat(getComputedStyle(document.querySelector('#sc-field-name .m-field__label')).fontSize),
                                    sourceCanvas:!!shell
                                  };
                                }""")
                                matrix_cases.append({"case": case, **state})
                                if not args.capture_only:
                                    check(f"{case}: pinned Light rendering, real source view and fixture language",
                                          state["theme"] == "light" and state["colorScheme"] == "light"
                                          and state["lang"] == "ar" and state["canvasLang"] == "ar"
                                          and state["fixtureLang"] == language
                                          and all(item == language for item in state["componentLanguages"])
                                          and state["dir"] == direction
                                          and state["view"] == "overview" and state["sourceCanvas"])
                                    check(f"{case}: visible real components with clean Overview and no horizontal page overflow",
                                          all(item["visible"] > 0 for item in state["visibleComponents"])
                                          and state["visibleLogs"] == 0 and state["visibleDebug"] == 0
                                          and state["accentCount"] == 1
                                          and bool(state["applicableControls"])
                                          and all(c["width"] >= 48 and c["height"] >= 48
                                                  for c in state["applicableControls"])
                                          and state["pageWidth"] <= state["viewport"], state)
                                    if language == "en":
                                        check(f"{case}: actual English host-owned field and demo values are visible",
                                              state["englishHostLabel"] == ENGLISH_HOST_FIXTURE["fieldLabel"]
                                              and state["fieldValue"] == ENGLISH_HOST_FIXTURE["fieldValue"]
                                              and state["fieldInViewport"]
                                              and ENGLISH_HOST_FIXTURE["surfacesTitle"] in state["englishSurfaceTitle"]
                                              and state["englishAction"] == ENGLISH_HOST_FIXTURE["saveAction"]
                                              and state["demoValue"] == ENGLISH_HOST_FIXTURE["demoValue"], state)
                                    if type_level == 2:
                                        check(f"{case}: enlarged component typography is applied",
                                              state["fieldLabelPx"] >= 28,
                                              {"fieldLabelPx": state["fieldLabelPx"]})

                                page.screenshot(path=str(out / f"{case}.png"))
                                if language == "en" or (type_level == 1 and dpr == 1):
                                    fixture_case = f"fixture-{width}-{direction}-{language}-type{type_level}"
                                    page.screenshot(path=str(out / f"{fixture_case}.png"))
                                page.close()
                                context.close()

            calendar_cases = []
            viewport_root = {320: 288, 360: 328, 390: 358, 430: 398}
            for viewport_width in WIDTHS:
                root_width = viewport_root[viewport_width]
                for direction in DIRECTIONS:
                    for language in LANGUAGES:
                        for type_level in TYPOGRAPHY:
                            for dpr in DPRS:
                                case = (f"calendar-{root_width}-{direction}-{language}-"
                                        f"type{type_level}-dpr{dpr}")
                                context = browser.new_context(
                                    viewport={"width": viewport_width, "height": 900},
                                    device_scale_factor=dpr,
                                    locale="ar", color_scheme="light",
                                )
                                page = context.new_page()
                                error_listener(page)
                                calendar_url = (
                                    f"http://127.0.0.1:{server.server_port}/calendar-release-fixture.html"
                                    f"?root={root_width}&direction={direction}&language={language}"
                                )
                                page.goto(calendar_url, wait_until="load")
                                page.evaluate("document.fonts.ready")
                                # عقد 2026-10-24: شبكة الشهر الكاملة عند كل عرض؛
                                # الضيق حالة عرض مدمج (data-ocal-compact) لا تخطيط بديل.
                                expected_layout = "month-grid"
                                expected_compact = "true" if root_width < 360 else "false"
                                page.wait_for_function(
                                    "(expected)=>{const root=document.querySelector('#order-root');"
                                    "return root.getAttribute('data-ocal-layout')===expected.layout"
                                    "&&root.getAttribute('data-ocal-compact')===expected.compact;}",
                                    arg={"layout": expected_layout, "compact": expected_compact},
                                )

                                type_metrics = {"scale": type_level, "baseline": [], "scaled": []}
                                if type_level == 2:
                                    page.locator("#order-root [data-ocal-action='month-picker']").click()
                                    type_metrics = page.evaluate("""selectors => {
                                      const root=document.querySelector('#order-root');
                                      const rules={};
                                      const capture=()=>{
                                        [...root.querySelectorAll(selectors)].forEach(node=>{
                                          const style=getComputedStyle(node);
                                          const names=[...node.classList].filter(name=>name.startsWith('m-ocal__'));
                                          names.forEach(name=>{
                                            if(!rules[name]) {
                                              const font=parseFloat(style.fontSize);
                                              const computedLine=style.lineHeight;
                                              const lineValue=parseFloat(computedLine);
                                              rules[name]={font,line:Number.isFinite(lineValue)?lineValue:font*1.45,
                                                computedLine};
                                            }
                                          });
                                        });
                                      };
                                      capture();
                                      calendarInstance.setLoading(true);capture();
                                      calendarInstance.setLoading(false);
                                      calendarInstance.setError(()=>{});capture();
                                      calendarInstance.setError(null);
                                      calendarInstance.setData([]);
                                      calendarInstance.setView('list');capture();
                                      calendarInstance.setData(calendarFixtures.normal);
                                      calendarInstance.setView('calendar');
                                      root.querySelector('[data-ocal-action="month-picker"]').click();
                                      capture();
                                      const baseline=Object.entries(rules).map(([name,metrics])=>({name,...metrics}));
                                      const css=Object.entries(rules).map(([name,metrics])=>
                                        '.m-ocal .'+CSS.escape(name)+'{font-size:'+(metrics.font*2)+'px!important;line-height:'+
                                          (metrics.line*2)+'px!important;}').join('\\n');
                                      const sheet=document.createElement('style');
                                      sheet.setAttribute('data-independent-calendar-type-scale','2');
                                      sheet.textContent=css;
                                      document.head.appendChild(sheet);
                                      const scaled=Object.entries(rules).map(([name,metrics])=>{
                                        let node=root.querySelector('.'+CSS.escape(name));
                                        let probe=false;
                                        if(!node) {
                                          node=document.createElement('span');
                                          node.className=name;
                                          node.style.cssText='position:absolute;visibility:hidden';
                                          root.appendChild(node);
                                          probe=true;
                                        }
                                        const style=getComputedStyle(node);
                                        const result={name,baselineFont:metrics.font,baselineLine:metrics.line,
                                          font:parseFloat(style.fontSize),line:parseFloat(style.lineHeight),
                                          computedLine:metrics.computedLine,measuredThroughProbe:probe};
                                        if(probe) node.remove();
                                        return result;
                                      });
                                      return {scale:2,baseline,scaled};
                                    }""", CALENDAR_TEXT_SELECTORS)
                                    page.locator("#order-root [data-ocal-action='picker-back']").click()
                                    page.evaluate("document.fonts.ready")

                                initial = page.evaluate("""() => {
                                  const root=document.querySelector('#order-root');
                                  const r=root.getBoundingClientRect();
                                  const title=root.querySelector('.m-ocal__month-trigger');
                                  const selected=root.getAttribute('data-ocal-selected-date');
                                  const displayed=title&&title.textContent.trim();
                                  const rows=[...root.querySelectorAll('[data-ocal-day-panel] .m-ocal__row-title')]
                                    .map(node=>node.textContent.trim());
                                  return {layout:root.getAttribute('data-ocal-layout'),
                                    compact:root.getAttribute('data-ocal-compact'),
                                    gridDays:root.querySelectorAll('[data-ocal-grid] [data-ocal-date^="2026-10"]').length,
                                    gridTotal:root.querySelectorAll('[data-ocal-grid] [data-ocal-date]').length,
                                    gridOut:root.querySelectorAll('[data-ocal-grid] .m-ocal__cell--out').length,
                                    rootWidth:r.width,rootClient:root.clientWidth,rootScroll:root.scrollWidth,
                                    documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,
                                    selected,displayed,rows,documentLanguage:document.documentElement.lang,
                                    hostLang:root.lang||'',direction:getComputedStyle(root).direction,
                                    interactiveButtons:[...root.querySelectorAll('button')].map(button=>{
                                      const b=button.getBoundingClientRect();
                                      return {action:button.getAttribute('data-ocal-action'),
                                        width:b.width,height:b.height};
                                    })};
                                }""")
                                normal_title = (
                                    "طلب تنظيف موقع العمل" if language == "ar" else "Clean the worksite"
                                )
                                check(f"{case}: root width, adaptive layout, selected/displayed dates and actual host text",
                                      abs(initial["rootWidth"] - root_width) < 1
                                      and initial["layout"] == expected_layout
                                      and initial["compact"] == expected_compact
                                      and initial["gridDays"] == 31
                                      and initial["gridTotal"] == 42
                                      and initial["gridOut"] == 11
                                      and initial["selected"] == "2026-10-07"
                                      and "أكتوبر 2026" in initial["displayed"]
                                      and normal_title in initial["rows"]
                                      and initial["documentLanguage"] == "ar"
                                      and initial["direction"] == direction
                                      and (type_level == 1 or (
                                          len(type_metrics["scaled"]) > 0
                                          and all(item["font"] >= item["baselineFont"] * 1.99
                                                  and item["line"] >= item["baselineLine"] * 1.99
                                                  for item in type_metrics["scaled"]))),
                                      {"initial": initial, "typeMetrics": type_metrics})
                                # عقد 2026-10-24: أزرار الأوامر ≥48px؛ خلايا الأيام
                                # المدمجة (جذر <360px) ارتفاع ≥48 وعرض ≥24 (WCAG 2.5.8)،
                                # والممتدة ≥48×48. القياس نفسه سابقًا كان يُسقط الشبكة
                                # نفسها تحت 360px (مسار خمسة تواريخ) — عقد قديم أُلغي.
                                def _targets_ok(buttons, compact_flag):
                                    for b in buttons:
                                        if b["action"] == "day-cell":
                                            if compact_flag:
                                                if not (b["height"] >= 48 and b["width"] >= 24):
                                                    return False
                                            elif not (b["width"] >= 48 and b["height"] >= 48):
                                                return False
                                        elif not (b["width"] >= 48 and b["height"] >= 48):
                                            return False
                                    return True
                                check(f"{case}: no page/root horizontal overflow and all targets meet the documented geometry contract",
                                      initial["documentWidth"] <= viewport_width
                                      and initial["rootScroll"] <= initial["rootClient"] + 1
                                      and bool(initial["interactiveButtons"])
                                      and _targets_ok(initial["interactiveButtons"], expected_compact == "true"),
                                      {"document": initial["documentWidth"], "viewport": viewport_width,
                                       "rootScroll": initial["rootScroll"], "rootClient": initial["rootClient"],
                                       "compact": expected_compact,
                                       "buttons": initial["interactiveButtons"]})

                                page.evaluate("""() => {
                                  calendarInstance.setView('list');
                                  calendarInstance.setData([]);
                                }""")
                                empty = page.locator("#order-root [data-ocal-status='empty']").count() == 1
                                check(f"{case}: host-provided empty state is exposed without stale rows", empty,
                                      {"emptyStatusCount": page.locator(
                                          "#order-root [data-ocal-status='empty']").count()})
                                page.evaluate("""() => {
                                  calendarInstance.setData(calendarFixtures.one);
                                  calendarInstance.setView('calendar');
                                  calendarInstance.setSelectedDate('2026-10-07');
                                }""")
                                one = page.evaluate("""() => ({
                                  rows:[...document.querySelectorAll('[data-ocal-day-panel] .m-ocal__row-title')]
                                    .map(node=>node.textContent.trim()),
                                  selected:document.querySelector('#order-root').getAttribute('data-ocal-selected-date')
                                })""")
                                expected_long = (
                                    "طلب تجهيز استقبال الوفد" if language == "ar" else "Prepare reception"
                                )
                                check(f"{case}: single long Arabic/English host order remains intact and selected",
                                      len(one["rows"]) == 1 and expected_long in one["rows"][0]
                                      and one["selected"] == "2026-10-07", one)
                                page.evaluate("""() => {
                                  calendarInstance.setData(calendarFixtures.many);
                                  calendarInstance.setView('calendar');
                                  calendarInstance.setSelectedDate('2026-10-07');
                                }""")
                                many = page.evaluate("""() => ({
                                  rows:[...document.querySelectorAll('[data-ocal-day-panel] .m-ocal__row-title')]
                                    .map(node=>node.textContent.trim()),
                                  count:document.querySelector('[data-ocal-date="2026-10-07"]')?.getAttribute('aria-label')||'',
                                  selected:document.querySelector('#order-root').getAttribute('data-ocal-selected-date')
                                })""")
                                check(f"{case}: multiple orders preserve all five source rows and truthful day count",
                                      len(many["rows"]) == 5 and "5 طلبات" in many["count"]
                                      and many["selected"] == "2026-10-07"
                                      and any(expected_long in row for row in many["rows"]), many)
                                page.evaluate("calendarInstance.setLoading(true)")
                                loading = page.locator("#order-root [data-ocal-status='loading'][role='status']").count() == 1
                                page.evaluate(
                                    "calendarInstance.setLoading(false);"
                                    "calendarInstance.setError(()=>window.retryCount=(window.retryCount||0)+1)"
                                )
                                error_visible = page.locator(
                                    "#order-root [data-ocal-status='error'][role='alert']"
                                ).count() == 1
                                page.locator("#order-root [data-ocal-action='retry']").click()
                                retry_count = page.evaluate("window.retryCount||0")
                                check(f"{case}: real loading/error/retry states remain accessible",
                                      loading and error_visible and retry_count == 1,
                                      {"loading": loading, "error": error_visible, "retryCount": retry_count})
                                page.evaluate("""() => {
                                  calendarInstance.setError(null);
                                  calendarInstance.setData(calendarFixtures.many);
                                  calendarInstance.setView('calendar');
                                  calendarInstance.setSelectedDate('2026-10-07');
                                  calendarInstance.setCalendarView('month');
                                }""")
                                selected_before = page.locator("#order-root").get_attribute("data-ocal-selected-date")
                                event_count = page.evaluate("calendarEvents.length")
                                page.locator("#order-root [data-ocal-action='month-picker']").click()
                                picker_report = page.evaluate("""() => {
                                  const root=document.querySelector('#order-root');
                                  return {open:root.querySelector('[data-ocal-picker][role=dialog]')!==null,
                                    expanded:root.querySelector('[data-ocal-action=month-picker]')
                                      ?.getAttribute('aria-expanded'),
                                    active:document.activeElement.getAttribute('data-ocal-action'),
                                    monthTargets:[...root.querySelectorAll('[data-ocal-action=picker-month]')]
                                      .map(e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height}}),
                                    width:document.documentElement.scrollWidth,viewport:innerWidth};
                                }""")
                                check(f"{case}: month/year picker opens with real focus, 48px month targets and no overflow",
                                      picker_report["open"] and picker_report["expanded"] == "true"
                                      and picker_report["active"] == "picker-month"
                                      and len(picker_report["monthTargets"]) == 12
                                      and all(t["width"] >= 48 and t["height"] >= 48
                                              for t in picker_report["monthTargets"])
                                      and picker_report["width"] <= viewport_width, picker_report)
                                page.locator("#order-root [data-ocal-action='picker-next-year']").click()
                                page.locator("#order-root [data-ocal-action='picker-month'][data-ocal-value='0']").click()
                                switched = page.evaluate("""() => ({
                                  title:document.querySelector('#order-root .m-ocal__month-trigger')?.textContent.trim(),
                                  selected:document.querySelector('#order-root').getAttribute('data-ocal-selected-date'),
                                  pickerCount:document.querySelectorAll('#order-root [data-ocal-picker]').length,
                                  events:calendarEvents.length,
                                  focus:document.activeElement.getAttribute('data-ocal-action'),
                                  browsing:document.querySelector('[data-ocal-day-panel]')?.getAttribute('data-ocal-day-browsing')||'false',
                                  panelTitle:document.querySelector('.m-ocal__daypanel-title')?.textContent.trim()||''
                                })""")
                                check(f"{case}: picker changes displayed month only, preserves the selected date, and the day panel stays honest",
                                      "يناير 2027" in switched["title"]
                                      and switched["selected"] == selected_before
                                      and switched["pickerCount"] == 0
                                      and switched["events"] == event_count
                                      and switched["focus"] == "month-picker"
                                      and switched["browsing"] == "true"
                                      and "لا يوم محدد في يناير 2027" in switched["panelTitle"], switched)
                                page.locator("#order-root [data-ocal-action='month-picker']").click()
                                page.keyboard.press("Escape")
                                escaped = page.evaluate("""() => ({
                                  closed:document.querySelector('#order-root [data-ocal-picker]')===null,
                                  focus:document.activeElement.getAttribute('data-ocal-action')
                                })""")
                                check(f"{case}: Escape closes the picker and restores trigger focus",
                                      escaped["closed"] and escaped["focus"] == "month-picker", escaped)

                                final_geometry = page.evaluate("""() => ({
                                  root:document.querySelector('#order-root').getBoundingClientRect().toJSON(),
                                  documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,
                                  selected:document.querySelector('#order-root').getAttribute('data-ocal-selected-date')
                                })""")
                                calendar_cases.append({
                                    "case": case, "viewportWidth": viewport_width,
                                    "rootWidth": root_width, "direction": direction,
                                    "hostLanguage": language, "typographyLevel": type_level,
                                    "deviceScaleFactor": dpr, "layout": expected_layout,
                                    "typeMetrics": type_metrics, "finalGeometry": final_geometry,
                                })
                                page.screenshot(path=str(out / f"{case}.png"), full_page=True)
                                page.close()
                                context.close()

            if not args.capture_only:
                # The owner rebuilds this generated artifact after all source work is integrated.
                if not args.defer_standalone:
                    standalone = browser.new_page(
                        viewport={"width": 390, "height": 900}, device_scale_factor=1,
                        color_scheme="light",
                    )
                    error_listener(standalone)
                    standalone.goto(
                        f"http://127.0.0.1:{server.server_port}/previews/ui-system-showcase/standalone.html",
                        wait_until="load",
                    )
                    standalone.evaluate("document.fonts.ready")
                    standalone_start = standalone.evaluate("""() => ({
                      view:document.body.getAttribute('data-view'),
                      theme:document.documentElement.getAttribute('data-theme'),
                      canvas:!!document.querySelector('#sc-canvas'),
                      fields:!!document.querySelector('#sc-fields .m-field'),
                      metric:!!document.querySelector('#sc-metric [data-main-comparison]'),
                      visibleLogs:[...document.querySelectorAll('.sc-log')]
                        .filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none').length,
                      width:document.documentElement.scrollWidth,viewport:innerWidth
                    })""")
                    check("rebuilt standalone starts on clean Light Overview with real embedded components",
                          standalone_start["view"] == "overview" and standalone_start["theme"] == "light"
                          and standalone_start["canvas"] and standalone_start["fields"]
                          and standalone_start["metric"] and standalone_start["visibleLogs"] == 0
                          and standalone_start["width"] <= standalone_start["viewport"], standalone_start)
                    standalone.screenshot(path=str(out / "standalone-startup.png"))
                    standalone.close()

                # Exercise the real controls in the actual State Lab; no synthetic component replacement.
                context = browser.new_context(
                    viewport={"width": 390, "height": 900}, device_scale_factor=1,
                    locale="ar", color_scheme="light",
                )
                page = context.new_page()
                error_listener(page)
                page.goto(url + "#state-lab", wait_until="load")
                page.evaluate("document.fonts.ready")
                controls = page.evaluate("""() => ({
                  view:document.body.getAttribute('data-view'),
                  stateLink:document.querySelector('[data-showcase-view="state"]')?.getAttribute('aria-current'),
                  controls:!!document.querySelector('#sc-dir-seg [data-sc-dir="ltr"]')
                    && !!document.querySelector('#sc-w-seg [data-sc-w="320"]')
                    && !!document.querySelector('#sc-fx-seg [data-sc-fixture="stress"]')
                    && !!document.querySelector('#sc-filter-seg [data-sc-filter="all"]')
                })""")
                check("direct State Lab route keeps its tools and selects the active navigation link",
                      controls["view"] == "state" and controls["stateLink"] == "page" and controls["controls"], controls)
                page.locator('#sc-dir-seg [data-sc-dir="ltr"]').click()
                page.locator('#sc-w-seg [data-sc-w="320"]').click()
                page.locator('#sc-fx-seg [data-sc-fixture="stress"]').click()
                page.locator('#sc-filter-seg [data-sc-filter="all"]').click()
                control_state = page.evaluate("""() => ({
                  dir:document.documentElement.dir,width:getComputedStyle(document.querySelector('#sc-canvas'))
                    .getPropertyValue('--sc-canvas-width').trim(),
                  fixture:document.querySelector('#sc-fx-seg [data-sc-fixture="stress"]')
                    .getAttribute('aria-pressed'),
                  filter:document.querySelector('#sc-filter-seg [data-sc-filter="all"]')
                    .getAttribute('aria-pressed'),
                  logRoot:!!document.querySelector('#sc-ocal-log'),
                  stateView:document.body.getAttribute('data-view')
                })""")
                check("State Lab control changes persist as actual direction, width, fixture, filter and diagnostics",
                      control_state["dir"] == "ltr" and control_state["width"] == "320px"
                      and control_state["fixture"] == "true" and control_state["filter"] == "true"
                      and control_state["logRoot"] and control_state["stateView"] == "state", control_state)
                segment_targets = page.evaluate("""() => {
                  const visible=e=>e.getClientRects().length&&getComputedStyle(e).display!=='none';
                  return [...document.querySelectorAll('.showcase-controls .m-seg__item')]
                    .filter(visible).map(e=>{
                      const r=e.getBoundingClientRect(),p=getComputedStyle(e,'::after');
                      return {text:e.textContent.trim(),width:r.width,height:r.height,minWidth:getComputedStyle(e).minWidth,
                        hitStart:p.insetBlockStart,hitEnd:p.insetBlockEnd};
                    });
                }""")
                check("State Lab segmented controls retain the contracted expanded 48px touch hitbox",
                      len(segment_targets) > 0 and all(float(t["width"]) >= 48
                      and t["height"] >= 40 and float(t["minWidth"].replace("px", "")) >= 48
                      and float(t["hitStart"].replace("px", "")) <= -4
                      and float(t["hitEnd"].replace("px", "")) <= -4 for t in segment_targets),
                      segment_targets)

                # Direct deep links must reveal State Lab and scroll the actual target after font layout.
                for fragment, target in (
                    ("state-lab", "#state-lab"),
                    ("brand-proof", "#brand-proof"),
                    ("sc-fields", "#sc-fields"),
                    ("sc-ocal", "#sc-ocal"),
                ):
                    page.goto(url + "#" + fragment, wait_until="load")
                    page.evaluate("document.fonts.ready")
                    page.wait_for_timeout(60)
                    deep = page.evaluate("""target => {
                      const e=document.querySelector(target),r=e&&e.getBoundingClientRect();
                      return {view:document.body.getAttribute('data-view'),found:!!e,
                        visible:!!r&&r.top<innerHeight&&r.bottom>0,
                        scrollY:scrollY,targetTop:r&&r.top,
                        controls:!!document.querySelector('#sc-dir-seg')};
                    }""", target)
                    check(f"deep link #{fragment} exposes State Lab and brings its real target into view",
                          deep["view"] == "state" and deep["found"] and deep["visible"]
                          and deep["controls"], deep)

                # Consumer fixture sequence: use actual buttons/input and wait for font geometry first.
                page.goto(url + "#sc-fields", wait_until="load")
                page.evaluate("document.fonts.ready")
                field = page.locator("#sc-field-error-demo")
                input_node = page.locator("#sc-f-demo")
                message = field.locator("[data-field-msg]")
                initial = page.evaluate("""() => {
                  const f=document.querySelector('#sc-field-error-demo'),i=document.querySelector('#sc-f-demo');
                  const m=f.querySelector('[data-field-msg]');
                  return {count:f.querySelectorAll('[data-field-msg]').length,
                    msgId:m.id||'',describedby:(i.getAttribute('aria-describedby')||'').split(/\\s+/),
                    value:i.value};
                }""")
                check("field fixture starts normal with one host-associated message node",
                      initial["count"] == 1 and bool(initial["msgId"])
                      and initial["msgId"] in initial["describedby"]
                      and not input_node.get_attribute("aria-invalid"), initial)
                page.locator("#sc-fx-error").click()
                error_state = page.evaluate("""() => {
                  const f=document.querySelector('#sc-field-error-demo'),i=document.querySelector('#sc-f-demo');
                  const m=f.querySelector('[data-field-msg]');
                  return {classes:f.className,visible:!m.hidden&&m.classList.contains('is-visible'),
                    visibleMessages:[...f.querySelectorAll('[data-field-msg]')].filter(e=>!e.hidden&&e.getClientRects().length).length,
                    invalid:i.getAttribute('aria-invalid'),describedby:(i.getAttribute('aria-describedby')||'').split(/\\s+/),
                    value:i.value,text:m.textContent.trim()};
                }""")
                check("field error is visible once, invalid, described and preserves the value",
                      "has-error" in error_state["classes"] and error_state["visible"]
                      and error_state["visibleMessages"] == 1 and error_state["invalid"] == "true"
                      and initial["msgId"] in error_state["describedby"]
                      and error_state["value"] == initial["value"], error_state)
                page.locator("#sc-fx-success").click()
                success_state = page.evaluate("""() => {
                  const f=document.querySelector('#sc-field-error-demo'),i=document.querySelector('#sc-f-demo');
                  const m=f.querySelector('[data-field-msg]');
                  return {classes:f.className,visible:!m.hidden&&m.classList.contains('is-visible'),
                    count:[...f.querySelectorAll('[data-field-msg]')].filter(e=>!e.hidden&&e.getClientRects().length).length,
                    invalid:i.getAttribute('aria-invalid'),value:i.value,text:m.textContent.trim()};
                }""")
                check("field success replaces error in the same single visible node and clears invalid",
                      "has-success" in success_state["classes"] and "has-error" not in success_state["classes"]
                      and success_state["visible"] and success_state["count"] == 1
                      and success_state["invalid"] is None and success_state["value"] == initial["value"], success_state)
                page.locator("#sc-fx-clear").click()
                clear_state = page.evaluate("""() => {
                  const f=document.querySelector('#sc-field-error-demo'),i=document.querySelector('#sc-f-demo');
                  const m=f.querySelector('[data-field-msg]');
                  return {classes:f.className,hidden:m.hidden,text:m.textContent,
                    invalid:i.getAttribute('aria-invalid'),value:i.value};
                }""")
                check("field clear removes state/message without clearing the user value",
                      "has-error" not in clear_state["classes"] and "has-success" not in clear_state["classes"]
                      and clear_state["hidden"] and clear_state["text"] == ""
                      and clear_state["invalid"] is None and clear_state["value"] == initial["value"], clear_state)
                input_node.fill("Typed after clear")
                input_state = page.evaluate("""() => ({
                  value:document.querySelector('#sc-f-demo').value,
                  classes:document.querySelector('#sc-field-error-demo').className,
                  hidden:document.querySelector('#sc-field-error-demo [data-field-msg]').hidden
                })""")
                check("field input returns to normal while retaining the newly typed value",
                      input_state["value"] == "Typed after clear"
                      and "has-error" not in input_state["classes"]
                      and "has-success" not in input_state["classes"] and input_state["hidden"], input_state)

                # FIELD-001/002/003 regression evidence, via actual consumer controls.
                page.goto(url + "#sc-fields", wait_until="load")
                page.evaluate("document.fonts.ready")
                page.locator("#sc-field-qty [data-step='up']").focus()
                page.keyboard.press("Tab")
                focus_field = page.evaluate("""() => {
                  const input=document.querySelector('#sc-f-demo'),shell=input.closest('.m-field__control');
                  input.closest('.m-field').classList.add('has-error');
                  const before=getComputedStyle(shell).boxShadow;
                  input.focus();
                  const style=getComputedStyle(shell),r=shell.getBoundingClientRect();
                  return {focusWithin:shell.matches(':focus-within'),shadow:style.boxShadow,
                    border:style.borderColor,focused:document.activeElement===input,
                    rect:{width:r.width,height:r.height}};
                }""")
                check("FIELD-001: actual focused error input retains a visible non-stacked focus boundary",
                      focus_field["focusWithin"] and focus_field["focused"]
                      and focus_field["shadow"] != "none"
                      and focus_field["rect"]["width"] > 0 and focus_field["rect"]["height"] > 0, focus_field)
                page.screenshot(path=str(out / "field-error-focus-boundary.png"))

                page.locator("#sc-fx-error").click()
                dup_state = page.evaluate("""() => {
                  const f=document.querySelector('#sc-field-error-demo');
                  return {messageNodes:f.querySelectorAll('[data-field-msg]').length,
                    visible:[...f.querySelectorAll('[data-field-msg]')].filter(e=>!e.hidden&&e.getClientRects().length).length,
                    describedby:(document.querySelector('#sc-f-demo').getAttribute('aria-describedby')||'')
                      .split(/\\s+/).filter(Boolean)};
                }""")
                check("FIELD-002: repeated error uses one referenced message, never duplicates",
                      dup_state["messageNodes"] == 1 and dup_state["visible"] == 1
                      and initial["msgId"] in dup_state["describedby"], dup_state)

                target_report = page.evaluate("""() => {
                  const targets=[
                    ...document.querySelectorAll('#sc-field-qty [data-step],#sc-gateway-root [data-access-reveal]')
                  ];
                  const iconTargets=targets.map(button=>{
                    const icon=button.querySelector('svg.m-btn__icon');
                    const r=button.getBoundingClientRect(),ir=icon&&icon.getBoundingClientRect();
                    return {name:button.getAttribute('aria-label'),w:r.width,h:r.height,
                      iconW:ir&&ir.width,iconH:ir&&ir.height};
                  });
                  return {count:iconTargets.length,targets:iconTargets};
                }""")
                check("FIELD-003: exactly three applicable step/reveal targets are at least 48px with 24px icons",
                      target_report["count"] == 3 and all(t["w"] >= 48 and t["h"] >= 48
                      and abs(t["iconW"] - 24) < 0.5 and abs(t["iconH"] - 24) < 0.5
                      for t in target_report["targets"]), target_report)
                for target, focus_action, key in (
                    ("#sc-field-qty [data-step='up']", "#sc-f-qty", "Tab"),
                    ("#sc-field-qty [data-step='down']", "#sc-f-qty", "Shift+Tab"),
                    ("#sc-gateway-root [data-access-reveal]", "#sc-gw-password", "Tab"),
                ):
                    page.locator(focus_action).focus()
                    page.keyboard.press(key)
                    focus = page.locator(target).evaluate("""e=>{
                      const r=e.getBoundingClientRect(),i=e.querySelector('svg.m-btn__icon');
                      const ir=i.getBoundingClientRect(),s=getComputedStyle(e);
                      return {visible:e.matches(':focus-visible'),outline:s.outlineStyle,
                        outlineWidth:s.outlineWidth,width:r.width,height:r.height,
                        iconWidth:ir.width,iconHeight:ir.height};
                    }""")
                    check(f"FIELD-003 focus boundary and icon target {target}",
                          focus["width"] >= 48 and focus["height"] >= 48
                          and abs(focus["iconWidth"] - 24) < 0.5
                          and abs(focus["iconHeight"] - 24) < 0.5
                          and (focus["visible"] or focus["outline"] != "none"), focus)

                # Report observed geometry beyond the pass/fail summary for human review.
                geometry = page.evaluate("""() => ({
                  viewport:innerWidth,document:document.documentElement.scrollWidth,
                  fields:[...document.querySelectorAll('#sc-fields .m-field__control')]
                    .map(e=>({id:e.closest('.m-field').id||'',width:e.getBoundingClientRect().width,
                      scroll:e.scrollWidth,client:e.clientWidth})),
                  focusBoundary:getComputedStyle(document.querySelector('#sc-f-demo')
                    .closest('.m-field__control')).boxShadow
                })""")
                (out / "field-focus-geometry.json").write_text(
                    json.dumps(geometry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                page.close()
                context.close()

            browser.close()
    finally:
        server.shutdown()
        server.server_close()

    logo_before = baseline_logo_hashes()
    logo_after = current_logo_hashes()
    logo_equal = logo_before == logo_after
    logo_changed = sorted(path for path in set(logo_before) | set(logo_after)
                          if logo_before.get(path) != logo_after.get(path))
    check("logo v2 SHA-256 file set and contents match the 161bb71 baseline",
          logo_equal, {"baselineFiles": len(logo_before), "currentFiles": len(logo_after),
                       "changedOrMissing": logo_changed[:30]})

    tokens = (ROOT / "shared/tokens.css").read_text(encoding="utf-8")
    baseline_tokens = subprocess.run(
        ["git", "show", f"{BASELINE}:shared/tokens.css"], cwd=ROOT,
        check=True, capture_output=True, text=True,
    ).stdout
    current_legacy = tokens[tokens.index("@media not all {") + len("@media not all {"):]
    baseline_legacy_start = baseline_tokens.find('[data-theme="dark"]')
    baseline_legacy = baseline_tokens[baseline_legacy_start:]
    check("Light-only stylesheet wraps existing legacy token definitions in a nonmatching gate unchanged",
          "@media not all {" in tokens and current_legacy.startswith("\n[data-theme=\"dark\"]")
          and current_legacy.rstrip().endswith("}")
          and baseline_legacy.strip() == current_legacy.rstrip()[:-1].strip(),
          {"gateFound": "@media not all {" in tokens,
           "legacyBaselineSha256": digest(baseline_legacy.encode()),
           "legacyCurrentSha256": digest(current_legacy.rstrip()[:-1].lstrip("\n").encode())})
    check("brand accent remains official and distinct semantically from the data channel",
          "#D97757" in tokens and "--micro-color-brand-accent: #D97757;" in tokens
          and "--micro-data-b: #D97757;" in tokens,
          {"brandAccent": "#D97757", "dataRole": "separately named --micro-data-b"})
    check("original Petrol token is unchanged from the 161bb71 baseline",
          "--micro-color-brand-primary: #164D59;" in tokens
          and "--micro-color-brand-primary: #164D59;" in baseline_tokens)

    if browser_errors:
        check("no browser script, console, or network errors", False, browser_errors)
    elif not args.capture_only:
        check("no browser script, console, or network errors", True)

    report = {
        "browser": browser_version,
        "baselineCommit": BASELINE,
        "appearance": "Light",
        "matrixCaseCount": len(matrix_cases),
        "calendarMatrixCaseCount": len(calendar_cases) if not args.capture_only else 0,
        "matrix": {"widths": WIDTHS, "directions": DIRECTIONS, "languages": LANGUAGES,
                   "typographyLevels": TYPOGRAPHY, "deviceScaleFactors": DPRS},
        "captureOnly": args.capture_only,
        "standaloneDeferred": args.defer_standalone,
        "sourceSha256": hashes,
        "logoV2": {"baselineFileCount": len(logo_before), "currentFileCount": len(logo_after),
                   "unchanged": logo_equal},
        "matrixCases": matrix_cases,
        "calendarMatrixCases": calendar_cases if not args.capture_only else [],
        "browserErrors": browser_errors,
        "passed": sum(1 for item in checks if item["passed"]),
        "failed": sum(1 for item in checks if not item["passed"]),
        "checks": checks,
        "limitations": [
            "Chromium source fixture only; not a real-device, Safari, screen-reader, or native-zoom claim.",
            "Calendar and Data dedicated tool results are reported separately, not included in these counts.",
            "The standalone preview is intentionally deferred until the owner completes its rebuild."
            if args.defer_standalone else "Standalone startup was checked from the generated artifact.",
        ],
    }
    (out / "independent-review.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f'{report["passed"]} PASS / {report["failed"]} FAIL; {len(matrix_cases)} matrix cases; output {out}')
    return 0 if args.capture_only or report["failed"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
