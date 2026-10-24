#!/usr/bin/env python3
"""Reproducible source/interaction checks; not physical-device or AT certification."""
import argparse
import hashlib
import itertools
import json
import os
from pathlib import Path
import subprocess
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options

ROOT = Path(__file__).resolve().parent.parent

FIXTURE = """() => {
  const old = document.getElementById('remediation-fixture'); if(old) old.remove();
  const root = document.createElement('div'); root.id='remediation-fixture';
  root.style.cssText='max-width:100%;width:100%;padding:16px;box-sizing:border-box;background:var(--micro-surface-page);color:var(--micro-text-primary)';
  root.innerHTML=`
    <button id="qa-outside">خارج المنتقي</button>
    <div data-micro-picker id="qa-picker" class="m-picker">
      <input type="search" data-picker-search class="m-picker__input" aria-label="بحث الخيارات">
      <div data-picker-list role="listbox" aria-label="الخيارات"></div>
      <p data-picker-summary></p>
    </div>
    <div data-micro-field id="qa-field" class="m-field">
      <label for="qa-number" class="m-field__label">الكمية</label>
      <div class="m-field__control">
        <div class="m-field__stepper"><button type="button" data-step="down" class="m-field__step" aria-label="إنقاص">−</button></div>
        <input id="qa-number" class="m-field__input m-field__input--num" value="1" min="0" max="2" step="0.5">
        <div class="m-field__stepper"><button type="button" data-step="up" class="m-field__step" aria-label="زيادة">+</button></div>
      </div><p data-field-msg></p>
    </div>
    <div data-access-gateway id="qa-gateway"><form data-access-form novalidate>
      <input name="email" data-access-credential="email" type="email" value="demo@example.test" required aria-label="البريد">
      <input name="password" data-access-credential="password" type="password" value="example-only" required aria-label="كلمة المرور">
      <button type="submit" class="m-btn">دخول تجريبي</button><p data-access-status role="status"></p>
    </form></div>
    <section id="qa-chart" class="m-chart m-chart--bars" data-chart="bars" data-value-domain="signed">
      <h2 class="m-chart__title">مقارنة قيم موقعة</h2>
      <ul class="m-chart__data" hidden>
        <li data-series="a" data-label="قراءة موجبة" data-value="10"></li>
        <li data-series="b" data-label="قراءة سالبة" data-value="-5"></li>
        <li data-series="c" data-label="قراءة صفرية" data-value="0"></li>
        <li data-series="d" data-label="قراءة مفقودة" data-value=""></li>
        <li data-series="e" data-label="قراءة غير صالحة" data-value="12oops"></li>
      </ul><div class="m-chart__plot" data-plot></div><p data-summary></p>
    </section>`;
  document.body.prepend(root);
  MicroPicker.init(root); MicroFields.init(root); MicroData.init(root);
  MicroPicker.setOptions(root.querySelector('[data-micro-picker]'),[{value:'a',label:'ألف'},{value:'b',label:'باء'}]);
}"""

BEHAVIOR = """() => {
  const results=[]; function check(name,ok,detail) {results.push({name,pass:!!ok,detail:detail||''});}
  const picker=document.getElementById('qa-picker'), search=picker.querySelector('[data-picker-search]');
  let options=()=>Array.from(picker.querySelectorAll('[role=option]'));
  let events=0;picker.addEventListener('micro-picker:change',()=>events++);
  options()[0].focus(); MicroPicker.setStatus(picker,'loading');
  check('picker.loading-focus',document.activeElement===search);
  check('picker.status-outside',!picker.querySelector('[role=listbox] [role=status]'));
  check('picker.old-options-hidden',options().every(o=>o.hidden&&o.tabIndex===-1));
  MicroPicker.setStatus(picker,'error');
  check('picker.retry-outside',!picker.querySelector('[role=listbox] [data-picker-retry]'));
  let retries=0;picker.addEventListener('micro-picker:retry',()=>retries++);
  MicroPicker.init(picker);MicroPicker.init(picker);picker.querySelector('[data-picker-retry]').click();
  check('picker.retry-single',retries===1);
  MicroPicker.setStatus(picker,'ready');options()[1].click();options()[1].focus();
  MicroPicker.setOptions(picker,[{value:'b',label:'باء محدثة'},{value:'c',label:'جيم'}]);
  check('picker.key-focus',document.activeElement.getAttribute('data-value')==='b');
  check('picker.key-selection',MicroPicker.getSelected(picker).value==='b');
  MicroPicker.setOptions(picker,[{value:'c',label:'جيم'}]);
  check('picker.deleted-focus',document.activeElement===search);
  check('picker.deleted-selection',MicroPicker.getSelected(picker)===null);
  document.getElementById('qa-outside').focus();MicroPicker.setStatus(picker,'loading');
  check('picker.no-steal',document.activeElement.id==='qa-outside');
  MicroPicker.setStatus(picker,'ready'); search.value='لا يوجد';search.dispatchEvent(new Event('input'));
  check('picker.no-result',options().every(o=>o.hidden)&&picker.querySelector('[data-picker-status]').textContent.includes('لا نتائج'));
  search.value='';search.dispatchEvent(new Event('input'));
  check('picker.query-recovery',options().some(o=>!o.hidden));
  MicroPicker.disconnect(picker);let before=events;options()[0].click();
  check('picker.disconnect',events===before);
  MicroPicker.init(picker);options()[0].click();check('picker.reattach-single',events===before+1);
  const field=document.getElementById('qa-field'),input=document.getElementById('qa-number');
  let edits=0; input.addEventListener('micro-field:changed',()=>edits++);
  const up=field.querySelector('[data-step=up]');
  MicroFields.init(field);up.click();check('field.decimal-step',input.value==='1.5'&&edits===1);
  MicroFields.sync(field);check('field.silent-sync',edits===1);
  input.readOnly=true;MicroFields.sync(field);up.click();check('field.readonly',input.value==='1.5'&&edits===1);
  input.readOnly=false;MicroFields.sync(field);MicroFields.disconnect(field);up.click();
  check('field.disconnect',edits===1);
  MicroFields.init(field);MicroFields.init(field);up.click();check('field.reattach-once',input.value==='2'&&edits===2);
  up.click();check('field.max-no-event',input.value==='2'&&edits===2);
  const chart=document.getElementById('qa-chart');
  let svg=chart.querySelector('svg'),axis=svg.querySelector('[data-zero-axis]'),zero=+axis.getAttribute('y1');
  let marks=Array.from(svg.querySelectorAll('rect[data-source-index]'));
  check('chart.signed-marks',marks.length===3);
  check('chart.signed-negative-below',+marks[1].getAttribute('y')>=zero-0.1&&+marks[1].getAttribute('height')>0);
  check('chart.signed-positive-above',+marks[0].getAttribute('y')<zero);
  check('chart.signed-ratio',Math.abs(+marks[0].getAttribute('height')/+marks[1].getAttribute('height')-2)<0.001);
  check('chart.zero-height',+marks[2].getAttribute('height')===0);
  check('chart.missing-invalid-distinct',chart.querySelector('table').textContent.includes('غير متاح')&&chart.querySelector('table').textContent.includes('قيمة غير صالحة'));
  check('chart.signed-table-copy',!chart.querySelector('table').textContent.includes('سالب غير مرسوم'));
  check('chart.visible-exact-readings',chart.querySelectorAll('.m-chart__readings dd').length===5);
  chart.setAttribute('data-max','2');MicroData.render(chart);
  check('chart.scale-refusal',!chart.querySelector('[data-plot] svg')&&chart.getAttribute('data-scale-state')==='over');
  chart.setAttribute('data-overscale','rescale');MicroData.render(chart);
  check('chart.explicit-rescale',!!chart.querySelector('[data-plot] svg')&&chart.getAttribute('data-scale-state')==='over-rescaled');
  chart.removeAttribute('data-max');chart.removeAttribute('data-overscale');chart.setAttribute('data-chart','line');
  MicroData.render(chart);check('chart.line-missing-gap',chart.querySelectorAll('polyline').length===1);
  check('chart.line-visible-stroke',getComputedStyle(chart.querySelector('polyline')).stroke!=='none');
  chart.setAttribute('data-axis-type','time');
  MicroData.render(chart);check('chart.explicit-time-required',chart.getAttribute('data-axis-state')==='invalid-time');
  chart.removeAttribute('data-axis-type');chart.setAttribute('data-chart','bars');
  const values=chart.querySelectorAll('.m-chart__data li');
  values[0].setAttribute('data-value','1e308');values[1].setAttribute('data-value','-1e308');MicroData.render(chart);
  check('chart.extreme-finite',!chart.querySelector('[data-plot]').innerHTML.match(/(?:NaN|Infinity)/));
  const pie=document.createElement('section');pie.className='m-chart';pie.dataset.chart='donut';
  pie.innerHTML='<h2 class="m-chart__title">توزيع غير صالح</h2><ul class="m-chart__data" hidden><li data-series="a" data-label="صالح" data-value="10"></li><li data-series="b" data-label="غير صالح" data-value="oops"></li></ul><div data-plot></div>';
  document.getElementById('remediation-fixture').append(pie);MicroData.render(pie);
  check('chart.donut-invalid-refused',pie.dataset.scaleState==='invalid'&&!pie.querySelector('[data-plot] svg'));
  check('chart.donut-invalid-table',pie.querySelector('table').textContent.includes('قيمة غير صالحة'));
  pie.querySelectorAll('[data-value]').forEach(node=>node.dataset.value='1e308');MicroData.render(pie);
  check('chart.donut-overflow-refused',pie.dataset.scaleState==='invalid'&&!pie.querySelector('[data-plot] svg')&&!pie.querySelector('[data-plot]').textContent.includes('Infinity'));
  const layer=document.createElement('div');layer.className='m-layer';layer.hidden=true;layer.setAttribute('aria-label','اختبار طبقة');
  layer.innerHTML='<button>إغلاق</button>';document.getElementById('remediation-fixture').append(layer);
  MicroNavigation.openLayer(layer,{trigger:document.getElementById('qa-outside')});
  check('layer.modal-semantics',layer.getAttribute('role')==='dialog'&&layer.getAttribute('aria-modal')==='true');
  MicroNavigation.disconnect(layer);
  check('layer.disconnect-unlocks',layer.hidden&&document.body.style.overflow!=='hidden');
  return results;
}"""

ASYNC = """async () => {
  const results=[];const check=(name,pass)=>results.push({name,pass:!!pass});
  const gateway=document.getElementById('qa-gateway'), form=gateway.querySelector('form'),status=gateway.querySelector('[data-access-status]');
  MicroAccessGateway.init(gateway,{onSubmit:()=>Promise.reject(new Error('SQL_SECRET_STACK_MUST_NOT_BE_UI'))});
  form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  await new Promise(r=>setTimeout(r,30));
  check('gateway.no-raw-error',!status.textContent.includes('SQL_SECRET')&&status.textContent.includes('تعذّر'));
  MicroAccessGateway.init(gateway,{onSubmit:()=>Promise.reject({userMessage:'رسالة آمنة معتمدة'})});
  form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  await new Promise(r=>setTimeout(r,30));
  check('gateway.explicit-user-message',status.textContent==='رسالة آمنة معتمدة');
  let resolve;MicroAccessGateway.init(gateway,{onSubmit:()=>new Promise(r=>resolve=r)});
  form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  await new Promise(r=>setTimeout(r,10));
  MicroAccessGateway.disconnect(gateway);status.textContent='منفصل';
  resolve({authenticated:true,message:'نتيجة متأخرة لا تظهر'});
  await new Promise(r=>setTimeout(r,20));
  check('gateway.late-result-ignored',status.textContent==='منفصل'&&!form.hasAttribute('aria-busy'));
  let calls=0;MicroAccessGateway.init(gateway,{onSubmit:()=>{calls++;return {authenticated:false};}});
  MicroAccessGateway.init(gateway);form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  await new Promise(r=>setTimeout(r,20));check('gateway.reattach-once',calls===1);
  return results;
}"""


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, default=ROOT / "generated-artifacts/ui-system-remediation/verification")
    parser.add_argument("--base", default=("https://" + os.environ["REPLIT_DEV_DOMAIN"]) if os.environ.get("REPLIT_DEV_DOMAIN") else "http://127.0.0.1:5000")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    records, errors = [], []
    fingerprint = hashlib.sha256()
    for directory in ("components", "shared", "previews", "tools"):
        for path in sorted((ROOT / directory).rglob("*")):
            if path.is_file() and path.suffix in (".css", ".js", ".html", ".py") and "__pycache__" not in path.parts and path.name != "standalone.html":
                fingerprint.update(str(path.relative_to(ROOT)).encode())
                fingerprint.update(path.read_bytes())
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True, **chromium_launch_options())
        page = browser.new_page(viewport={"width": 390, "height": 844})
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.goto(args.base.rstrip("/") + "/previews/ui-system-showcase/index.html", wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        records.append({"name": "showcase.overview-default", "pass": page.evaluate("document.body.dataset.view==='overview'")})
        page.locator('a[href="#state-lab"]').click()
        records.append({"name": "showcase.state-lab", "pass": page.evaluate("document.body.dataset.view==='state'")})
        family_ids = page.locator("[data-catalog-family]").evaluate_all("(nodes)=>Array.from(new Set(nodes.map(n=>n.dataset.catalogFamily)))")
        records.append({"name": "catalog.14-families", "pass": len(family_ids) == 14, "detail": family_ids})
        page.goto(args.base.rstrip("/") + "/previews/ui-system-showcase/index.html#sc-signed", wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(200)
        top = page.locator("#sc-signed").evaluate("(el)=>el.getBoundingClientRect().top")
        records.append({"name": "showcase.deep-link-after-font-layout", "pass": abs(top) < 4, "detail": top})
        indexes = page.locator("#sc-signed-time .m-chart__x-label").evaluate_all("(nodes)=>nodes.map(n=>n.getBoundingClientRect()).filter(r=>r.width>0).map(r=>({left:r.left,right:r.right}))")
        collision = any(a["left"] < b["right"] + 3 and a["right"] + 3 > b["left"] for i, a in enumerate(indexes) for b in indexes[i + 1:])
        records.append({"name": "chart.time-index-no-collision", "pass": not collision, "detail": indexes})
        page.evaluate(FIXTURE)
        records.extend(page.evaluate(BEHAVIOR))
        records.extend(page.evaluate(ASYNC))
        page.evaluate("document.getElementById('remediation-fixture').remove()")
        records.append({"name": "resources.local-images", "pass": page.evaluate("Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)")})
        for width, direction, theme, scale in itertools.product((320, 360, 390, 430), ("rtl", "ltr"), ("light", "dark"), (1, 2)):
            page.set_viewport_size({"width": width, "height": 844})
            page.evaluate("""([dir,theme,scale])=>{
              document.documentElement.dir=dir;document.documentElement.dataset.theme=theme;
              const root=document.documentElement;
              if(!window.__qaType){
                const css=getComputedStyle(root);
                window.__qaType=Array.from(css).filter(k=>/^--micro-(body|label|secondary|h[1-6]|heading|amount|number|value|surface-(title|amount)|metric)/.test(k)&&k.endsWith('-size')&&css.getPropertyValue(k).trim().endsWith('px'))
                  .map(k=>[k,parseFloat(css.getPropertyValue(k))]);
                const style=document.createElement('style');
                style.textContent=':root[data-qa-text-scale="2"] .m-chart__plot svg text {font-size:26px!important}';
                document.head.append(style);
              }
              window.__qaType.forEach(([key,size])=>root.style.setProperty(key,size*scale+'px'));
              root.dataset.qaTextScale=String(scale);
              const canvas=document.getElementById('sc-canvas');if(canvas)canvas.dir=dir;
            }""", [direction, theme, scale])
            page.wait_for_timeout(60)
            result = page.evaluate("""() => ({
              overflow:document.documentElement.scrollWidth>innerWidth+1,
              width:innerWidth,scroll:document.documentElement.scrollWidth,
              broken:Array.from(document.images).filter(i=>!i.closest('[hidden]')&&!i.complete||i.complete&&i.naturalWidth===0&&!i.closest('[hidden]')).map(i=>i.getAttribute('src')),
              theme:getComputedStyle(document.documentElement).colorScheme
            })""")
            label = f"{width}-{direction}-{theme}-{scale}x"
            records.append({"name": "layout." + label, "pass": not result["overflow"], "detail": result})
            if direction == "rtl" and scale == 1:
                page.screenshot(path=str(args.out / f"state-lab-{label}.jpg"), type="jpeg", quality=65)
        for theme in ("light", "dark"):
            page.evaluate("(theme)=>document.documentElement.dataset.theme=theme", theme)
            pairs = page.evaluate("""() => {
              const pairs=[
                ['text.primary','--micro-text-primary','--micro-surface-base',4.5],
                ['text.secondary','--micro-text-secondary','--micro-surface-base',4.5],
                ['text.hint','--micro-text-hint','--micro-surface-base',4.5],
                ['focus','--micro-focus-ring','--micro-surface-base',3],
                ['success','--micro-success','--micro-success-surface',4.5],
                ['danger','--micro-danger','--micro-danger-surface',4.5],
                ['warning','--micro-warning','--micro-warning-surface',4.5],
                ['info','--micro-info','--micro-info-surface',4.5],
                ['data.boundary','--micro-data-boundary','--micro-surface-base',3],
                ['data.line','--micro-data-line','--micro-surface-base',3]
              ];
              const el=document.createElement('div');document.body.append(el);
              function luminance(color){
                const rgb=color.match(/[\\d.]+/g).slice(0,3).map(Number).map(x=>x/255).map(x=>x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4));
                return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;
              }
              const result=pairs.map(([name,fg,bg,threshold])=>{
                el.style.color='var('+fg+')';el.style.backgroundColor='var('+bg+')';
                const css=getComputedStyle(el),a=luminance(css.color),b=luminance(css.backgroundColor);
                const root=getComputedStyle(document.documentElement);
                const defined=!!root.getPropertyValue(fg).trim()&&!!root.getPropertyValue(bg).trim();
                return {name,threshold,defined,ratio:(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05),foreground:css.color,background:css.backgroundColor};
              });el.remove();return result;
            }""")
            for pair in pairs:
                records.append({"name": f"contrast.{theme}.{pair['name']}", "pass": pair["defined"] and pair["ratio"] >= pair["threshold"], "detail": pair})
        page.emulate_media(reduced_motion="reduce", color_scheme="dark")
        page.evaluate("document.documentElement.dataset.theme='system'")
        scheme = page.evaluate("getComputedStyle(document.documentElement).colorScheme")
        records.append({"name": "theme.system-dark", "pass": "dark" in scheme, "detail": scheme})
        for selector in ("[data-carousel]", ".m-layer"):
            durations = page.locator(selector).evaluate_all("(nodes)=>nodes.map(n=>getComputedStyle(n).transitionDuration)")
            records.append({"name": "motion.reduced." + selector, "pass": all(all(float(t.strip().rstrip('ms')) == 0 for t in d.split(',')) for d in durations), "detail": durations})
        browser.close()
    records.append({"name": "browser.no-pageerror", "pass": not errors, "detail": errors})
    report = {
        "headAtRun": subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip(),
        "sourceSHA256": fingerprint.hexdigest(), "browser": "Chromium/Playwright",
        "limitations": ["No physical Android/iOS", "No VoiceOver/TalkBack", "Shared type tokens + SVG stylesheet stress at 200% are not native OS text zoom", "32 layout configurations are not exhaustive family/state/AT certification"],
        "passed": sum(item["pass"] for item in records), "total": len(records), "results": records,
    }
    (args.out / "results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    for item in records:
        print(("PASS" if item["pass"] else "FAIL") + " " + item["name"] + ((" " + str(item.get("detail", ""))) if not item["pass"] else ""))
    print(f"{report['passed']}/{report['total']} PASS — {args.out}")
    return 0 if report["passed"] == report["total"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
