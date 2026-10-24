#!/usr/bin/env python3
"""Targeted interaction audit of the running, repository-local UI showcase.

This script never starts the application or contacts a non-loopback URL.
It records Chromium outcomes in this audit directory and small component
captures in generated-artifacts/pixilated-audit/.
"""
import json
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[3]
BASE = "http://127.0.0.1:5000/previews/ui-system-showcase/index.html"
OUT = Path(__file__).resolve().parent / "interaction-browser-results.json"
SHOTS = ROOT / "generated-artifacts" / "pixilated-audit"
WIDTHS = (320, 360, 390, 430)


def main():
    results = []
    errors = []
    browser_version = None

    def check(width, name, passed, evidence=None):
        results.append({
            "viewport": {"width": width, "height": 844, "direction": "rtl"},
            "name": name,
            "passed": bool(passed),
            "evidence": evidence,
        })

    SHOTS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/repl/tools/bin/chromium",
            args=["--no-sandbox"],
        )
        browser_version = browser.version
        for width in WIDTHS:
            page = browser.new_page(
                viewport={"width": width, "height": 844},
                reduced_motion="reduce",
                locale="ar",
            )
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda message: errors.append(message.text)
                    if message.type == "error" else None)
            page.on("response", lambda response: errors.append(
                f"{response.status} {response.url}"
            ) if response.status >= 400 else None)
            response = page.goto(BASE, wait_until="networkidle")
            page.wait_for_function(
                "() => window.MicroCarousel && window.MicroNavigation && "
                "document.querySelector('#sc-carousel-root [data-next]') && "
                "document.querySelector('#sc-ocal-root [data-ocal-action]')"
            )
            check(width, "local preview route loaded",
                  response is not None and response.status == 200,
                  {"status": response.status if response else None, "url": page.url})
            page.locator('[data-sc-filter="all"]').click()

            root = page.locator("#sc-carousel-root")
            page.evaluate("document.documentElement.setAttribute('dir', 'rtl')")
            root.scroll_into_view_if_needed()
            check(width, "carousel compact mode starts named and hides optional dots",
                  page.evaluate("""() => {
                    const r=document.querySelector('#sc-carousel-root');
                    return MicroCarousel.getIndex(r)===0 &&
                      r.getAttribute('aria-label')==='ملخصات العرض' &&
                      r.getAttribute('data-controls')==='compact' &&
                      r.querySelector('[data-dots]').children.length>1 &&
                      getComputedStyle(r.querySelector('[data-dots]')).display==='none';
                  }"""))
            expand = root.locator("[data-card-expand]").first
            expand.click()
            expanded = expand.get_attribute("aria-expanded") == "true"
            details_id = expand.get_attribute("aria-controls")
            details_visible = page.locator("#" + details_id).is_visible() if details_id else False
            check(width, "active carousel card disclosure state is synchronized",
                  expanded and details_visible,
                  {"expanded": expanded, "detailsVisible": details_visible})
            expand.click()
            check(width, "carousel disclosure closes on second activation",
                  expand.get_attribute("aria-expanded") == "false")
            root.locator("[data-next]").click()
            check(width, "carousel next button advances exactly once",
                  page.evaluate("MicroCarousel.getIndex(document.querySelector('#sc-carousel-root'))===1"))
            root.focus()
            page.keyboard.press("ArrowLeft")
            check(width, "RTL carousel ArrowLeft follows logical next",
                  page.evaluate("MicroCarousel.getIndex(document.querySelector('#sc-carousel-root'))===2"))
            root.evaluate("(element)=>element.setAttribute('data-controls','full')")
            root.locator("[data-dots] button").nth(1).click()
            check(width, "full carousel variant exposes working direct-dot selection",
                  page.evaluate("MicroCarousel.getIndex(document.querySelector('#sc-carousel-root'))===1"))
            viewport = root.locator("[data-viewport]")
            box = viewport.bounding_box()
            before = page.evaluate("MicroCarousel.getIndex(document.querySelector('#sc-carousel-root'))")
            page.mouse.move(box["x"] + 60, box["y"] + box["height"] / 2)
            page.mouse.down()
            page.mouse.move(box["x"] + 160, box["y"] + box["height"] / 2, steps=6)
            page.mouse.up()
            page.wait_for_timeout(40)
            after = page.evaluate("MicroCarousel.getIndex(document.querySelector('#sc-carousel-root'))")
            slide_count = root.locator("[data-carousel-slide]").count()
            check(width, "carousel horizontal pointer swipe commits one logical step in RTL",
                  after == (before + 1) % slide_count,
                  {"before": before, "after": after, "slideCount": slide_count})

            quantity = page.locator("#sc-f-qty")
            quantity.fill("10")
            quantity.press("ArrowUp")
            stepped = quantity.input_value()
            quantity.press("ArrowDown")
            check(width, "quantity field ArrowUp/Down steps only its declared increment",
                  stepped == "15" and quantity.input_value() == "10",
                  {"up": stepped, "afterDown": quantity.input_value()})

            password = page.locator("#sc-gw-password")
            reveal = page.locator("[data-access-reveal]")
            password.fill("demo-only-secret")
            password.focus()
            password.evaluate("(input)=>input.setSelectionRange(2, 8, 'backward')")
            page.keyboard.press("Tab")
            page.keyboard.press("Enter")
            key_result = page.evaluate("""() => {
              const input=document.querySelector('#sc-gw-password');
              const button=document.querySelector('[data-access-reveal]');
              return {type:input.type,focus:document.activeElement===button,
                pressed:button.getAttribute('aria-pressed'),value:input.value,
                selection:[input.selectionStart,input.selectionEnd]};
            }""")
            check(width, "password reveal keyboard toggle preserves value, selection and toggle focus",
                  key_result == {"type": "text", "focus": True, "pressed": "true",
                                 "value": "demo-only-secret", "selection": [2, 8]},
                  key_result)
            page.keyboard.press("Enter")
            check(width, "password keyboard toggle remasks on repeat",
                  password.get_attribute("type") == "password" and
                  reveal.get_attribute("aria-pressed") == "false")
            password.fill("")
            page.locator("#sc-gw-email").fill("")
            page.locator("#sc-gateway-root form[data-access-form] [type=submit]").click()
            validation = page.evaluate("""() => {
              const input=document.querySelector('#sc-gw-email');
              const field=input.closest('[data-micro-field]');
              return {focused:document.activeElement===input,
                invalid:input.getAttribute('aria-invalid')==='true',
                linked:(input.getAttribute('aria-describedby')||'').split(/\\s+/)
                  .some(id=>document.getElementById(id)?.textContent.trim()),
                visibleError:!!field.querySelector('[data-field-msg].is-visible')};
            }""")
            check(width, "credential submit exposes linked field error and focuses first invalid field",
                  all(validation.values()), validation)
            if width == 360:
                page.locator("#sc-gateway-root form[data-access-form]").screenshot(
                    path=str(SHOTS / "interaction-360-credential-error.png"))

            tabs = page.locator("#sc-tabs [role=tab]")
            tabs.first.focus()
            page.keyboard.press("ArrowLeft")
            tab_result = page.evaluate("""() => {
              const tabs=[...document.querySelectorAll('#sc-tabs [role=tab]')];
              const active=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');
              const visible=tabs.map(t=>document.getElementById(t.getAttribute('aria-controls')).hidden);
              return {active,focused:document.activeElement===tabs[active],
                visiblePanels:visible.filter(v=>!v).length};
            }""")
            check(width, "RTL tabs keep focus, selected state and one visible panel in sync",
                  tab_result["active"] == 1 and tab_result["focused"] and
                  tab_result["visiblePanels"] == 1, tab_result)

            trigger = page.locator("#sc-dialog-trigger")
            trigger.click()
            layer = page.locator("#sc-dialog-layer")
            page.wait_for_function("!document.querySelector('#sc-dialog-layer').hidden")
            first = page.evaluate("""() => {
              const l=document.querySelector('#sc-dialog-layer');
              return {focusInside:l.contains(document.activeElement),
                modal:l.getAttribute('aria-modal'),role:l.getAttribute('role'),
                named:!!(l.getAttribute('aria-label')||l.getAttribute('aria-labelledby')),
                backgroundInert:document.querySelector('main').inert};
            }""")
            check(width, "modal opens with focus contained, semantics and inert background",
                  first["focusInside"] and first["modal"] == "true" and
                  first["role"] == "dialog" and first["named"] and
                  first["backgroundInert"], first)
            if width == 360:
                layer.screenshot(path=str(SHOTS / "interaction-360-dialog-layer.png"))
            focusables = layer.locator("button:not([disabled]), a[href], input:not([disabled]), "
                                       "select:not([disabled]), textarea:not([disabled]), [tabindex='0']")
            n_focus = focusables.count()
            if n_focus:
                focusables.first.focus()
                page.keyboard.press("Shift+Tab")
                wrapped_last = page.evaluate("""() => {
                  const l=document.querySelector('#sc-dialog-layer');
                  const f=[...l.querySelectorAll("button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex='0']")]
                    .filter(e=>e.checkVisibility()&&!e.closest('[inert]'));
                  return document.activeElement===f[f.length-1];
                }""")
                check(width, "modal Shift+Tab wraps first focus target to last",
                      wrapped_last, {"focusableCount": n_focus})
            else:
                check(width, "modal has focusable target for trap test", False)
            page.keyboard.press("Escape")
            page.wait_for_function("document.querySelector('#sc-dialog-layer').hidden")
            check(width, "Escape closes modal and restores opener focus",
                  page.evaluate("""() => document.querySelector('#sc-dialog-layer').hidden &&
                    document.activeElement===document.querySelector('#sc-dialog-trigger')"""))

            account_trigger = page.locator("#sc-account-root [data-account-open]")
            account_trigger.click()
            account_layer = page.locator("#sc-account-layer")
            page.wait_for_function("!document.querySelector('#sc-account-layer').hidden")
            account_entry = account_layer.locator("[data-account-to-application]")
            account_entry.click()
            app_view = page.evaluate("""() => {
              const l=document.querySelector('#sc-account-layer');
              const h=document.querySelector('#sc-account-app-title');
              return {focused:document.activeElement===h, visible:!h.hidden,
                named:l.getAttribute('aria-labelledby')===h.id};
            }""")
            check(width, "account settings view switch updates visible view, focus and dialog name",
                  all(app_view.values()), app_view)
            if width == 360:
                account_layer.screenshot(
                    path=str(SHOTS / "interaction-360-account-application-layer.png"))
            account_layer.locator("[data-account-back]").click()
            account_focus = page.evaluate("""() => {
              const l=document.querySelector('#sc-account-layer');
              const h=document.querySelector('#sc-account-main-title');
              return !h.hidden && document.activeElement===h &&
                l.getAttribute('aria-labelledby')===h.id;
            }""")
            check(width, "account settings back restores account heading focus and name",
                  account_focus)
            account_layer.locator("[data-account-close]").click()
            page.wait_for_function("document.querySelector('#sc-account-layer').hidden")
            check(width, "account layer close restores original trigger",
                  page.evaluate("""() => document.activeElement===
                    document.querySelector('#sc-account-root [data-account-open]')"""))

            page.locator("#sc-picker-trigger").click()
            picker_layer = page.locator("#sc-picker-layer")
            page.wait_for_function("!document.querySelector('#sc-picker-layer').hidden")
            search = picker_layer.locator("[data-picker-search]")
            search.fill("غير موجود نصًا")
            no_results = picker_layer.locator(".m-picker__state").inner_text()
            search.fill("")
            options = picker_layer.locator("[data-picker-list] .m-picker__option:not([hidden])")
            if options.count():
                options.first.focus()
                page.keyboard.press("ArrowLeft")
                roving = page.evaluate("""() => {
                  const p=document.querySelector('#sc-picker');
                  const a=document.activeElement;
                  return a.classList.contains('m-picker__option') &&
                    a.tabIndex===0 && a.getAttribute('aria-selected')==='false';
                }""")
                options.last.click()
                selected = page.evaluate("""() => {
                  const p=document.querySelector('#sc-picker');
                  const o=p.querySelector('[aria-selected="true"]');
                  return !!o && p.querySelector('[data-picker-summary]').textContent.includes(o.textContent.trim());
                }""")
                check(width, "picker empty-search recovery and keyboard selection update summary",
                      "لا نتائج مطابقة" in no_results and roving and selected,
                      {"emptyMessage": no_results, "roving": roving, "selectedSummary": selected})
            else:
                check(width, "picker has fixture options to exercise", False)
            if options.count():
                page.evaluate("""() => {
                  window.__pickerRetryCount=0;
                  const p=document.querySelector('#sc-picker');
                  p.addEventListener('micro-picker:retry',
                    () => window.__pickerRetryCount++);
                }""")
                options.first.focus()
                picker_layer.locator("#sc-picker").evaluate(
                    "p => MicroPicker.setStatus(p, 'error', 'تعذر تحميل الخيارات التجريبية')")
                error_state = page.evaluate("""() => {
                  const p=document.querySelector('#sc-picker');
                  const row=p.querySelector('.m-picker__state');
                  const active=document.activeElement;
                  return {focusRetained:p.contains(active) && !active.hidden,
                    retryVisible:!!row?.querySelector('[data-picker-retry]')?.checkVisibility(),
                    statusInsideListbox:!!row?.closest('[role=listbox]'),
                    hasLiveAnnouncement:!!row?.closest('[role=status],[role=alert],[aria-live]')};
                }""")
                check(width, "picker async error preserves a visible local focus target and announces status",
                      error_state["focusRetained"] and error_state["hasLiveAnnouncement"],
                      error_state)
                if width == 360:
                    picker_layer.screenshot(
                        path=str(SHOTS / "interaction-360-picker-error-layer.png"))
                picker_layer.get_by_role("button", name="إعادة المحاولة").click()
                retry_count = page.evaluate("() => window.__pickerRetryCount")
                check(width, "picker error retry remains keyboard-activatable and emits once",
                      retry_count == 1 and error_state["retryVisible"],
                      {"retryEventCount": retry_count, "retryVisible": error_state["retryVisible"]})
                picker_layer.locator("#sc-picker").evaluate(
                    "p => MicroPicker.setStatus(p, 'ready')")
            page.keyboard.press("Escape")
            page.wait_for_function("document.querySelector('#sc-picker-layer').hidden")

            if width == 360:
                for component, selector in (
                    ("carousel", "#sc-carousel-root"),
                    ("fields-quantity", "#sc-field-qty"),
                    ("navigation-tabs", "#sc-tabs"),
                    ("calendar", "#sc-ocal-root"),
                ):
                    target = page.locator(selector)
                    target.scroll_into_view_if_needed()
                    target.screenshot(path=str(SHOTS / f"interaction-360-{component}.png"))
            page.close()
        browser.close()

    report = {
        "scope": "Running repository-local showcase only; Chromium Playwright; fixture/demo data",
        "url": BASE,
        "browser": browser_version,
        "viewports": [{"width": width, "height": 844, "direction": "rtl"} for width in WIDTHS],
        "passed": sum(1 for item in results if item["passed"]),
        "failed": sum(1 for item in results if not item["passed"]),
        "checks": results,
        "runtime_errors": errors,
        "runtime_error_count": len(errors),
        "limitations": [
            "No real users, analytics, screen readers, real devices, non-Chromium engines, or consumer-product flows were tested.",
            "Pointer swipe uses Chromium mouse pointer events; native touch hardware behavior is not proven.",
            "Results apply only to the observed build and the targeted interactions listed here.",
        ],
    }
    OUT.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({
        "browser": report["browser"],
        "passed": report["passed"],
        "failed": report["failed"],
        "runtime_errors": report["runtime_error_count"],
        "report": str(OUT),
    }, ensure_ascii=False))
    return int(bool(report["failed"] or report["runtime_error_count"]))


if __name__ == "__main__":
    raise SystemExit(main())
