#!/usr/bin/env python3
"""Focused Chromium regression checks for Micro numeric fields and adornments.

Start tools/preview-server.py (or serve the repository root) on port 5000
before running this check. It only reads the source examples and showcase.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options


BASE = "http://127.0.0.1:5000"
WIDTHS = (320, 360, 390, 430)
counts = {"pass": 0, "fail": 0}


def check(label, condition, detail=""):
    ok = bool(condition)
    counts["pass" if ok else "fail"] += 1
    print(("PASS " if ok else "FAIL ") + label + ((" — " + str(detail)) if detail else ""))


def rect(locator):
    return locator.evaluate(
        "(e) => { const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; }"
    )


def close(a, b, tolerance=1.5):
    return abs(a - b) <= tolerance


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, **chromium_launch_options())
    print("Chromium", browser.version)

    for width in WIDTHS:
        page = browser.new_page(viewport={"width": width, "height": 844})
        page.goto(BASE + "/components/access-gateway/example-usage.html", wait_until="networkidle")
        check(
            f"gateway {width}px RTL has no horizontal page overflow",
            page.evaluate("document.documentElement.scrollWidth === innerWidth"),
        )
        password = page.locator("#gateway-password")
        reveal = page.locator("[data-access-reveal]")
        control = page.locator(".m-access-gateway__password-control")
        button_rect = rect(reveal)
        check(
            f"gateway {width}px eye retains 48px target",
            close(button_rect["w"], 48) and close(button_rect["h"], 48),
            button_rect,
        )
        gap = page.evaluate(
            """() => {
              const control=document.querySelector('.m-access-gateway__password-control').getBoundingClientRect();
              const submit=document.querySelector('.m-access-gateway__submit').getBoundingClientRect();
              return submit.top-control.bottom;
            }"""
        )
        check(f"gateway {width}px has deliberate field/action gap", gap >= 15, f"{gap:.1f}px")

        password.fill("LongPassword123!")
        password.evaluate("(e) => { e.focus(); e.setSelectionRange(5, 9, 'backward'); }")
        before = rect(control)
        before_input = rect(password)
        before_reveal = rect(reveal)
        reveal.click()
        pointer_result = page.evaluate(
            """() => {
              const input=document.querySelector('#gateway-password');
              const button=document.querySelector('[data-access-reveal]');
              const shell=document.querySelector('.m-access-gateway__password-control');
              return {
                value:input.value, type:input.type,
                selection:[input.selectionStart,input.selectionEnd],
                direction:input.selectionDirection,
                active:document.activeElement===input,
                label:button.getAttribute('aria-label'),
                pressed:button.getAttribute('aria-pressed'),
                button:button.getBoundingClientRect().toJSON(),
                input:input.getBoundingClientRect().toJSON(),
                shell:shell.getBoundingClientRect().toJSON()
              };
            }"""
        )
        after = rect(control)
        check(
            f"gateway {width}px pointer toggle preserves value/caret and returns input focus",
            pointer_result["value"] == "LongPassword123!"
            and pointer_result["type"] == "text"
            and pointer_result["selection"] == [5, 9]
            and pointer_result["active"],
            pointer_result,
        )
        check(f"gateway {width}px pointer toggle preserves backward selection direction",
              pointer_result["direction"] == "backward")
        check(
            f"gateway {width}px eye toggle preserves shell/input/action geometry and stable name",
            close(before["w"], after["w"])
            and close(before["h"], after["h"])
            and close(before_input["x"], pointer_result["input"]["x"])
            and close(before_input["y"], pointer_result["input"]["y"])
            and close(before_input["w"], pointer_result["input"]["width"])
            and close(before_input["h"], pointer_result["input"]["height"])
            and close(before_reveal["x"], pointer_result["button"]["x"])
            and close(before_reveal["y"], pointer_result["button"]["y"])
            and pointer_result["label"] == "إظهار كلمة المرور"
            and pointer_result["pressed"] == "true",
        )

        password.evaluate("(e) => { e.focus(); e.setSelectionRange(2, 6); }")
        page.keyboard.press("Tab")
        page.keyboard.press("Enter")
        keyboard_result = page.evaluate(
            """() => {
              const input=document.querySelector('#gateway-password');
              const button=document.querySelector('[data-access-reveal]');
              return {
                value:input.value, type:input.type,
                selection:[input.selectionStart,input.selectionEnd],
                active:document.activeElement===button,
                pressed:button.getAttribute('aria-pressed')
              };
            }"""
        )
        page.wait_for_function("(e)=>getComputedStyle(e).boxShadow==='none'",
                               arg=control.element_handle(), timeout=3000)
        focus_result = page.evaluate(
            """() => {
              const button=document.querySelector('[data-access-reveal]');
              const shell=document.querySelector('.m-access-gateway__password-control');
              return {
                visible:button.matches(':focus-visible'),
                outline:getComputedStyle(button).outlineStyle,
                outlineOffset:getComputedStyle(button).outlineOffset,
                shellShadow:getComputedStyle(shell).boxShadow
              };
            }"""
        )
        check(
            f"gateway {width}px keyboard toggle keeps button focus and selection",
            keyboard_result["value"] == "LongPassword123!"
            and keyboard_result["type"] == "password"
            and keyboard_result["selection"] == [2, 6]
            and keyboard_result["active"],
            keyboard_result,
        )
        check(
            f"gateway {width}px keyboard focus singles out eye action",
            focus_result["visible"]
            and focus_result["outline"] == "solid"
            and focus_result["outlineOffset"] == "-4px"
            and focus_result["shellShadow"] == "none",
            focus_result,
        )

        password.evaluate("(e) => { e.readOnly = true; e.focus(); e.setSelectionRange(2, 4); }")
        reveal.click()
        check(
            f"gateway {width}px readonly value remains revealable but not editable",
            password.input_value() == "LongPassword123!"
            and password.evaluate("(e) => e.readOnly")
            and password.get_attribute("type") == "text",
        )
        password.evaluate("(e) => { e.readOnly = false; e.type='password'; }")
        password.evaluate("(e) => e.focus()")
        reveal.click()
        password.evaluate("(e) => { e.type='password'; e.disabled=true; }")
        page.wait_for_timeout(0)
        check(
            f"gateway {width}px disabled input disables reveal and keeps masking",
            reveal.is_disabled() and password.get_attribute("type") == "password",
        )
        page.close()

    for width in WIDTHS:
        page = browser.new_page(viewport={"width": width, "height": 844})
        page.goto(BASE + "/previews/ui-system-showcase/", wait_until="networkidle")
        check(
            f"showcase {width}px RTL has no horizontal page overflow",
            page.evaluate("document.documentElement.scrollWidth === innerWidth"),
        )
        quantity = page.locator("#sc-f-qty")
        field = page.locator("#sc-field-qty")
        up = field.locator('[data-step="up"]')
        down = field.locator('[data-step="down"]')
        up_rect, down_rect = rect(up), rect(down)
        check(
            f"showcase {width}px step targets remain 48px",
            close(up_rect["w"], 48) and close(up_rect["h"], 48)
            and close(down_rect["w"], 48) and close(down_rect["h"], 48),
            {"up": up_rect, "down": down_rect},
        )

        quantity.focus()
        page.keyboard.press("Tab")
        step_focus = page.evaluate(
            """() => {
              const button=document.activeElement;
              const shell=button.closest('.m-field__control');
              return {
                step:button.getAttribute('data-step'),
                visible:button.matches(':focus-visible'),
                outline:getComputedStyle(button).outlineStyle,
                shadow:getComputedStyle(shell).boxShadow
              };
            }"""
        )
        check(
            f"showcase {width}px focused stepper is distinct without a second shell ring",
            step_focus["step"] == "up"
            and step_focus["visible"]
            and step_focus["outline"] == "solid"
            and step_focus["shadow"] == "none",
            step_focus,
        )

        search = page.locator("#sc-f-search")
        search.fill("بحث")
        clear = page.locator("#sc-field-search .m-field__clear")
        search.focus()
        page.keyboard.press("Tab")
        page.wait_for_function("(e)=>getComputedStyle(e).boxShadow==='none'",
                               arg=search.locator("..").element_handle(), timeout=3000)
        clear_rect = rect(clear)
        clear_focus = page.evaluate(
            """() => {
              const button=document.querySelector('#sc-field-search .m-field__clear');
              const shell=button.closest('.m-field__control');
              const icon=document.querySelector('.m-field__search-icon').getBoundingClientRect();
              const action=button.getBoundingClientRect();
              return {
                visible:button.matches(':focus-visible'),
                outline:getComputedStyle(button).outlineStyle,
                shadow:getComputedStyle(shell).boxShadow,
                gap:Math.max(icon.left,action.left)-Math.min(icon.right,action.right)
              };
            }"""
        )
        check(
            f"showcase {width}px clear action has a distinct 48px focus target",
            clear_rect["w"] >= 48
            and clear_rect["h"] >= 48
            and clear_focus["visible"]
            and clear_focus["outline"] == "solid"
            and clear_focus["shadow"] == "none",
            {"rect": clear_rect, "focus": clear_focus},
        )
        clear.click()
        check(
            f"showcase {width}px clear empties search and restores input focus",
            search.input_value() == "" and search.evaluate("(e) => document.activeElement === e"),
        )

        quantity.fill("10")
        quantity.press("ArrowUp")
        up_value = quantity.input_value()
        quantity.press("ArrowDown")
        check(
            f"showcase {width}px ArrowUp/Down steps only the focused quantity",
            up_value == "15" and quantity.input_value() == "10",
            quantity.input_value(),
        )
        quantity.evaluate("(e) => e.setSelectionRange(1, 1)")
        quantity.press("ArrowLeft")
        check(
            f"showcase {width}px horizontal arrow remains native text editing",
            quantity.input_value() == "10" and quantity.evaluate("(e) => e.selectionStart === 0"),
        )
        quantity.fill("10")
        page.locator("#sc-btn-loading").focus()
        page.keyboard.press("ArrowUp")
        check(
            f"showcase {width}px arrow outside quantity does not step it",
            quantity.input_value() == "10",
        )

        quantity.evaluate("(e) => { e.min='0'; e.max='99'; e.step='5'; e.value='95'; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
        up.evaluate("(e) => e.click()")
        check(
            f"showcase {width}px max boundary never performs a partial step",
            quantity.input_value() == "95"
            and up.get_attribute("aria-disabled") == "true",
            quantity.input_value(),
        )
        quantity.evaluate("(e) => { e.value='0'; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
        down.evaluate("(e) => e.click()")
        check(
            f"showcase {width}px min boundary blocks decrement",
            quantity.input_value() == "0"
            and down.get_attribute("aria-disabled") == "true",
        )
        quantity.evaluate("(e) => { e.value=''; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
        down.evaluate("(e) => e.click()")
        check(
            f"showcase {width}px unavailable decrement keeps empty distinct from zero",
            quantity.input_value() == ""
            and down.get_attribute("aria-disabled") == "true",
        )
        up.evaluate("(e) => e.click()")
        check(
            f"showcase {width}px first increment from empty uses the declared step",
            quantity.input_value() == "5",
        )

        quantity.evaluate("(e) => { e.min='0'; e.max='1'; e.step='0.25'; e.value='0.5'; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
        up.evaluate("(e) => e.click()")
        check(f"showcase {width}px decimal step 0.25 is exact", quantity.input_value() == "0.75")
        quantity.evaluate("(e) => { e.min='0'; e.max='0.01'; e.step='1e-3'; e.value='0.001'; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
        up.evaluate("(e) => e.click()")
        check(f"showcase {width}px scientific step 1e-3 is exact", quantity.input_value() == "0.002")
        quantity.evaluate("(e) => { e.max='0.0025'; e.value='0.002'; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
        up.evaluate("(e) => e.click()")
        check(
            f"showcase {width}px decimal max does not clamp to a partial step",
            quantity.input_value() == "0.002"
            and up.get_attribute("aria-disabled") == "true",
        )

        quantity.evaluate("(e) => { e.readOnly=true; e.value='0.002'; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
        page.wait_for_timeout(0)
        up.evaluate("(e) => e.click()")
        check(f"showcase {width}px readonly blocks step action", quantity.input_value() == "0.002")
        quantity.evaluate("(e) => { e.readOnly=false; e.disabled=true; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
        page.wait_for_timeout(0)
        up.evaluate("(e) => e.click()")
        check(f"showcase {width}px disabled blocks step action", quantity.input_value() == "0.002")

        for raw, step in [
            ("9007199254740992", "5"),
            ("0." + "0" * 309 + "1", "0.001"),
            ("NaN", "5"),
            ("12oops", "5"),
            ("1,000", "5"),
            ("−1", "1"),
        ]:
            quantity.evaluate(
                """(e,args) => {
                  e.disabled=false; e.readOnly=false;
                  e.removeAttribute('min'); e.removeAttribute('max');
                  e.setAttribute('step',args[1]); e.value=args[0];
                }""", [raw, step],
            )
            page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
            up.evaluate("(e) => e.click()")
            down.evaluate("(e) => e.click()")
            check(
                f"showcase {width}px non-arithmetic input {raw[:20]!r} length={len(raw)} remains exact and editable",
                quantity.input_value() == raw
                and up.get_attribute("aria-disabled") == "true"
                and down.get_attribute("aria-disabled") == "true"
                and quantity.is_editable(),
            )
        quantity.evaluate("(e) => { e.min='0'; e.max='0'; e.step='5'; e.value=''; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")
        up.evaluate("(e) => e.click()")
        check(
            f"showcase {width}px blocked empty increment does not fabricate zero",
            quantity.input_value() == "" and up.get_attribute("aria-disabled") == "true",
        )
        quantity.evaluate("(e) => { e.min='0'; e.max='99'; e.step='5'; e.value='10'; }")
        page.evaluate("MicroFields.sync(document.querySelector('#sc-field-qty'))")

        page.add_style_tag(
            content=(
                "#sc-fields .m-field__input--num{font-size:32px;line-height:1.625}"
                "#sc-fields .m-field__unit{font-size:26px;line-height:1.538}"
            )
        )
        amount = page.locator("#sc-f-amount")
        amount.fill("123456789012345")
        amount.focus()
        amount.press("End")
        tail = amount.evaluate("(e) => ({value:e.value,scroll:e.scrollLeft,client:e.clientWidth,total:e.scrollWidth})")
        amount.press("Home")
        home = amount.evaluate("(e) => e.scrollLeft")
        amount_control = page.locator("#sc-f-amount").locator("xpath=..")
        unit = amount_control.locator(".m-field__unit")
        control_rect, unit_rect = rect(amount_control), rect(unit)
        check(
            f"showcase {width}px 200% long amount remains intact and caret-scrollable",
            tail["value"] == "123456789012345"
            and tail["scroll"] > 0
            and home == 0,
            tail,
        )
        check(
            f"showcase {width}px 200% unit remains inside its control",
            unit_rect["x"] >= control_rect["x"] - 1
            and unit_rect["x"] + unit_rect["w"] <= control_rect["x"] + control_rect["w"] + 1
            and page.evaluate("document.documentElement.scrollWidth === innerWidth"),
            {"control": control_rect, "unit": unit_rect},
        )
        long_label = page.locator("#sc-field-qty .m-field__label")
        long_label.evaluate(
            "(e) => { e.textContent='كمية الطلبات المؤكدة التي جرى إعدادها للتسليم خلال الفترة الحالية'; }"
        )
        check(
            f"showcase {width}px long Arabic label wraps without page overflow",
            long_label.evaluate("(e) => e.scrollWidth <= e.clientWidth + 1")
            and page.evaluate("document.documentElement.scrollWidth === innerWidth"),
        )

        if width == 320:
            page.emulate_media(reduced_motion="reduce")
            motion = page.evaluate(
                """() => ({
                  field:getComputedStyle(document.querySelector('#sc-f-amount').closest('.m-field__control')).transitionDuration,
                  button:getComputedStyle(document.querySelector('#sc-field-qty [data-step="up"]')).transitionDuration
                })"""
            )
            check("showcase reduced-motion removes field/button transitions", motion == {"field": "0s", "button": "0s"}, motion)
        page.close()

    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(BASE + "/components/access-gateway/example-usage.html", wait_until="networkidle")
    ltr = page.evaluate(
        """() => {
          document.documentElement.dir='ltr';
          const shell=document.querySelector('.m-access-gateway__password-control').getBoundingClientRect();
          const eye=document.querySelector('[data-access-reveal]').getBoundingClientRect();
          return {shell:shell.toJSON(),eye:eye.toJSON()};
        }"""
    )
    check(
        "gateway 390px LTR places eye at inline-end",
        ltr["eye"]["x"] > ltr["shell"]["x"] + ltr["shell"]["width"] / 2,
        ltr,
    )
    page.close()

    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(BASE + "/previews/ui-system-showcase/", wait_until="networkidle")
    ltr_fields = page.evaluate(
        """() => {
          document.documentElement.dir='ltr';
          const field=document.querySelector('#sc-field-qty');
          const control=field.querySelector('.m-field__control').getBoundingClientRect();
          const down=field.querySelector('[data-step="down"]').getBoundingClientRect();
          const up=field.querySelector('[data-step="up"]').getBoundingClientRect();
          return {control:control.toJSON(),down:down.toJSON(),up:up.toJSON(),
            scrollWidth:document.documentElement.scrollWidth,innerWidth};
        }"""
    )
    check(
        "showcase quantity 390px LTR reverses logical button order without overflow",
        ltr_fields["down"]["x"] < ltr_fields["up"]["x"]
        and ltr_fields["scrollWidth"] == ltr_fields["innerWidth"],
        ltr_fields,
    )
    page.close()

    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(BASE + "/previews/fields/example-usage.html", wait_until="networkidle")
    readonly = page.locator("#u-3")
    check(
        "field example marks native readonly state visually and preserves copy/edit contract",
        readonly.evaluate(
            "(e) => e.readOnly && e.closest('.m-field').classList.contains('has-readonly')"
        ),
    )
    page.close()
    for width, direction, route in [
        (320, "rtl", "index.html"), (390, "ltr", "index.html"),
        (320, "rtl", "standalone.html"), (390, "ltr", "standalone.html"),
    ]:
        page = browser.new_page(viewport={"width": width, "height": 844}, has_touch=True)
        page.goto(BASE + "/previews/ui-system-showcase/" + route, wait_until="networkidle")
        print(f"Touch/functional consumer: {route} {width}px {direction}")
        page.locator(f'[data-sc-dir="{direction}"]').click()
        search = page.locator("#sc-f-search")
        search.fill("نص بحث يبقى محفوظًا")
        shell = search.locator("..")
        clear = shell.locator(".m-field__clear")
        shell.scroll_into_view_if_needed()
        page.evaluate("""() => {
          window.touchClears=0;
          document.querySelector('#sc-f-search').closest('.m-field')
            .addEventListener('micro-field:cleared',()=>window.touchClears++);
        }""")
        native_rule = page.evaluate("""()=>[...document.styleSheets].some(sheet =>
          [...sheet.cssRules].some(rule => rule.selectorText?.includes(':has(.m-field__clear)')
            && rule.selectorText.includes('::-webkit-search-cancel-button')
            && rule.style.display==='none'))""")
        check(f"touch {width}px {direction}: browser loaded custom-clear-only UA suppression", native_rule)
        ir, ar, cr = rect(search), rect(clear), rect(shell)
        input_edge = ir["x"] if direction == "rtl" else ir["x"] + ir["w"]
        action_edge = ar["x"] + ar["w"] if direction == "rtl" else ar["x"]
        gutter = (input_edge + action_edge) / 2
        page.touchscreen.tap(gutter, cr["y"] + cr["h"] / 2)
        check(
            f"touch {width}px {direction}: clear gutter preserves value and focuses input",
            search.input_value() == "نص بحث يبقى محفوظًا"
            and search.evaluate("e=>document.activeElement===e")
            and page.evaluate("window.touchClears") == 0,
        )
        near = input_edge + (7 if direction == "rtl" else -7)
        page.touchscreen.tap(near, cr["y"] + cr["h"] / 2)
        check(f"touch {width}px {direction}: former native-cancel area only edits/focuses",
              search.input_value() == "نص بحث يبقى محفوظًا" and page.evaluate("window.touchClears") == 0)
        clear.tap()
        check(f"touch {width}px {direction}: direct custom clear works exactly once",
              search.input_value() == "" and page.evaluate("window.touchClears") == 1)
        quantity = page.locator("#sc-f-qty")
        quantity.fill("10")
        shell = quantity.locator("..")
        shell.scroll_into_view_if_needed()
        ir, ar, cr = rect(quantity), rect(shell.locator("[data-step=down]")), rect(shell)
        value_edge = ir["x"] + ir["w"] if direction == "rtl" else ir["x"]
        step_edge = ar["x"] if direction == "rtl" else ar["x"] + ar["w"]
        page.touchscreen.tap((value_edge + step_edge) / 2, cr["y"] + cr["h"] / 2)
        check(f"touch {width}px {direction}: quantity gutter does not step",
              quantity.input_value() == "10" and quantity.evaluate("e=>document.activeElement===e"))
        page.evaluate("""dir=>{
          const field=document.createElement('div');field.className='m-field';field.dir=dir;
          field.setAttribute('data-micro-field','');
          field.innerHTML='<label class="m-field__label" for="native-search-proof">بحث أصلي دون زر مخصص</label><div class="m-field__control"><input id="native-search-proof" class="m-field__input" type="search" value="بحث أصلي"></div>';
          document.body.appendChild(field);MicroFields.init(field);
        }""", direction)
        native = page.locator("#native-search-proof")
        native.focus()
        native.scroll_into_view_if_needed()
        nr = rect(native)
        page.touchscreen.tap(nr["x"] + (9 if direction == "rtl" else nr["w"] - 9),
                             nr["y"] + nr["h"] / 2)
        check(f"touch {width}px {direction}: unadorned native search cancel still works",
              native.input_value() == "")
        password = page.locator("#sc-gw-password")
        password.fill("local-demo-only")
        password.evaluate("e=>{e.focus();e.setSelectionRange(2,7,'backward')}")
        page.locator("[data-access-reveal]").tap()
        check(f"{route} {width}px {direction}: password touch retains editing state",
              password.input_value() == "local-demo-only"
              and password.get_attribute("type") == "text"
              and password.evaluate("e=>document.activeElement===e && e.selectionStart===2 && e.selectionEnd===7 && e.selectionDirection==='backward'"))
        protected_values = quantity.evaluate("""e=>{
          const f=e.closest('[data-micro-field]'),up=f.querySelector('[data-step=up]');
          e.setAttribute('min','0');e.setAttribute('max','99');e.setAttribute('step','5');
          return ['95','NaN'].map(raw=>{
            e.value=raw;MicroFields.sync(f);up.click();
            return e.value===raw && up.getAttribute('aria-disabled')==='true';
          });
        }""")
        check(f"{route} {width}px {direction}: partial and invalid steps refuse without mutation",
              all(protected_values))
        page.close()
    browser.close()

print(f"RESULT {counts['pass']} PASS / {counts['fail']} FAIL")
sys.exit(1 if counts["fail"] else 0)
