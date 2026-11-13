#!/usr/bin/env python3
"""C07–C12 UI contracts: phone Light RTL, bounded narrow/LTR checks; no services."""
import argparse, hashlib, http.server, json, subprocess, tempfile, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw): super().__init__(*a,directory=str(ROOT),**kw)
    def log_message(self,*_): pass

def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',type=Path);args=ap.parse_args()
    out=args.out or Path(tempfile.mkdtemp(prefix='product-context-'));out.mkdir(parents=True,exist_ok=True)
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}';checks=[];errors=[];measurements=[]
    def check(name,ok,detail=None):
        checks.append(dict(name=name,passed=bool(ok),detail=detail));print(('PASS ' if ok else 'FAIL ')+name,flush=True)
    with sync_playwright() as pw:
        browser=pw.chromium.launch(**chromium_launch_options());version=browser.version
        p=browser.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',locale='ar',reduced_motion='reduce');p.set_default_timeout(6000)
        p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
        ev=p.evaluate
        def go(kind,case=None):
            p.goto(base+'/previews/product-context/lab.html?component='+kind,wait_until='networkidle');ev('document.fonts.ready')
            if case:p.locator('#scenario').select_option(case)
        def model(js): ev('(()=>{let m=lab.model;'+js+';lab.replace(m)})()')
        def geometry(name):
            d=ev('''(()=>{let e=document.querySelector('#product-root'),r=e.getBoundingClientRect();return {left:r.left,right:r.right,viewport:innerWidth,scroll:document.documentElement.scrollWidth,bad:[...e.querySelectorAll('button,input:not([type=file]),select,textarea')].filter(b=>b.getClientRects().length&&!b.closest('[inert]')).map(b=>({w:b.getBoundingClientRect().width,h:b.getBoundingClientRect().height})).filter(b=>b.w<47.9||b.h<47.9)}})()''')
            measurements.append(dict(name=name,**d));check(name,d['left']>=-1 and d['right']<=d['viewport']+1 and d['scroll']==d['viewport'] and not d['bad'],d)
        def shot(name):p.locator('#product-root').screenshot(path=str(out/(name+'.png')))
        def action(name):p.locator(f'#product-root [data-product-action="{name}"]'+('[data-destination=delivery]' if name=='navigate' else '')).click()
        def confirm():
            p.locator('[data-action-id=confirm]').click();p.wait_for_function('!document.querySelector(".m-action-sheet")')
        # Replay only the previous Fields source, read-only, to retain evidence of
        # the confirmed reusable defect. All later checks load current source.
        previous_fields=subprocess.check_output(['git','show','280b33b988428e3085c28cc150a0c71deb419889:components/fields/fields.js'],cwd=ROOT,text=True)
        p.route('**/components/fields/fields.js',lambda route:route.fulfill(status=200,content_type='application/javascript',body=previous_fields))
        go('market','editor');p.locator('#product-root .m-field__control').first.click(position={'x':3,'y':26})
        check('Read-only replay: baseline Fields reproduces focusable-host gutter defect',ev('document.activeElement.dataset.focusKey!=="field-title"'))
        p.unroute('**/components/fields/fields.js')
        cases={}
        # Every documented semantic mode is actually reachable and measured.
        for kind in ['context','state','market','delivery','assistant','review']:
            go(kind);cases[kind]=p.locator('#scenario option').evaluate_all('(xs)=>xs.map(x=>x.value)')
            for case in cases[kind]:
                p.locator('#scenario').select_option(case);geometry(kind+' / '+case+' 360 RTL')
                check(kind+' / '+case+' renders text and no unintended pending',ev('document.querySelector("#product-root").textContent.trim().length>0&&lab.instance.getState().pending===null&&[...document.querySelectorAll("#product-root strong")].every(x=>parseFloat(getComputedStyle(x).fontWeight)<=600)'))
            p.locator('#scenario').select_option(cases[kind][0]);shot(kind+'360')
            # Uniform shared states have behavior checks, not just DOM existence.
            for phase in ['ready','empty','loading','success','error','rejected','disabled','pending','uncertain','denied','expired','signed-out','conflict','local-saved']:
                model('m.phase='+json.dumps(phase))
                if phase in ['denied','expired','signed-out']:
                    ok=ev('!document.querySelector("#product-root h2")&&[...document.querySelectorAll("#product-root [data-product-action]")].every(b=>["reauth","choose-context"].includes(b.dataset.productAction))')
                elif phase in ['loading','disabled','pending']:
                    ok=ev('[...document.querySelectorAll("#product-root [data-product-action],#product-root textarea,#product-root input")].every(b=>b.disabled)'+('&&document.querySelector("#product-root").getAttribute("aria-busy")==="true"' if phase in ['loading','pending'] else ''))
                elif phase in ['uncertain','conflict']:
                    ok=ev('[...document.querySelectorAll("#product-root [data-product-action]")].every(b=>b.disabled||["recheck","reauth"].includes(b.dataset.productAction))')
                elif phase=='empty':
                    ok=ev('!document.querySelector("#product-root .m-product__message")&&'+('!!document.querySelector("#product-root textarea")' if kind=='assistant' else '!document.querySelector("#product-root h2")'))
                else:ok=ev('lab.instance.getState().phase==='+json.dumps('uncertain' if phase=='local-saved' and ev('lab.model.destination')!='manage' else phase)+'&&document.documentElement.scrollWidth===innerWidth')
                check(kind+' state '+phase,ok)
            model("m.phase='ready'")
            for connection in ['weak','offline','local']:
                model('m.connection='+json.dumps(connection))
                check(kind+' connection '+connection+' blocks connected mutations',ev('[...document.querySelectorAll("#product-root [data-product-action]")].every(b=>b.disabled)'))
        go('context','driver')
        check('Driver gets Delivery/Ask only even when fixture offers all four',ev('[...document.querySelectorAll("[data-destination]")].map(b=>b.dataset.destination).join(",")==="delivery,ask"'))
        action('navigate');check('Navigation intent is scoped and has no implicit role union',ev('lab.lastIntent.action==="navigate"&&lab.lastIntent.scope.kind==="driver"&&lab.lastIntent.payload.destination==="delivery"'))
        go('context');ev('window.same=MicroProduct.mount(document.querySelector("#product-root"),"context",lab.model)===lab.instance');check('Repeat mount reuses one owner',ev('same'))
        ev('window.target=lab.model.contexts[2].scope;window.oldScope=lab.model.scope');p.locator('#product-root select').select_option(ev('MicroProduct.contextKey(target)'))
        check('Context change is pending, old scope remains until acknowledged',ev('lab.instance.getState().pending!==null&&lab.instance.getState().scope.contextId===oldScope.contextId&&lab.lastIntent.payload.targetScope.roleId==="driver"'))
        check('Context response with target id but wrong workspace/role is rejected',ev('(()=>{let m=lab.model;m.scope={...target,roleId:"owner"};m.dataContext=m.scope;return !lab.resolve(lab.lastIntent.request,m)})()'))
        check('Exact approved target context can resolve',ev('(()=>{let m=lab.model;m.scope=target;m.dataContext=target;m.destination="delivery";return lab.resolve(lab.lastIntent.request,m)})()'))
        geometry('Switched driver360');shot('context-driver360')
        model('m.permissions=[]');check('Role name grants neither data nor commands',ev('!document.querySelector("#product-root select")&&!document.querySelector("[data-destination]")'))
        model('m.phase="signed-out";m.scope=null;m.permissions=["reauth"]');action('reauth')
        check('Signed-out unified access intent works without former workspace',ev('lab.lastIntent.action==="reauth"&&lab.lastIntent.scope===null'))
        go('state','local');action('save-local');check('Manage local emits storage intent only, no success or network claim',ev('lab.lastIntent.action==="save-local"&&lab.instance.getState().pending!==null&&document.querySelector("#product-root").textContent.includes("بانتظار نتيجة مؤكدة")'))
        model('m.destination="delivery"');check('Local save cannot become a connected Delivery write',ev('document.querySelector("[data-product-action=save-local]").disabled'))
        model('m.connection="unknown";m.phase="new-unrecognized-phase"');check('Unknown state/connection fail closed',ev('lab.instance.getState().phase==="uncertain"&&[...document.querySelectorAll("#product-root button")].every(b=>b.disabled)'))
        # Media: source Carousel, no duplicate widget, blocked URLs/failure states.
        go('market');p.locator('[data-next]').click()
        check('Existing Carousel actually navigates source images',ev('MicroCarousel.getIndex(document.querySelector("[data-carousel]"))===1&&document.querySelector("[data-status]").textContent.includes("2")'))
        p.locator('[data-prev]').click();check('Carousel previous restores index and availability',ev('MicroCarousel.getIndex(document.querySelector("[data-carousel]"))===0&&!document.querySelector("[data-next]").disabled'))
        model('m.images=[{src:"javascript:alert(1)",alt:"unsafe"}]');check('Unsafe image URL is replaced by explicit unavailable UI',ev('!document.querySelector("#product-root img")&&document.querySelector("#product-root").textContent.includes("رابط الصورة غير متاح")'))
        ev('lab.replace(lab.fixture("card"))');ev('document.querySelector("#product-root img").dispatchEvent(new Event("error"))')
        check('Image failure gets a readable fallback',ev('document.querySelector("#product-root").textContent.includes("تعذّر عرض الصورة")'))
        go('market');action('report');check('Opening a report form is an intent; final submission owns confirmation',ev('lab.lastIntent.action==="report"&&!document.querySelector(".m-action-sheet")'))
        go('market','editor');model('m.price=0;m.title="";m.images=[];m.clearDraft=true');model('m.clearDraft=false')
        check('Price input isolates numbers and shows its explicit unit',ev('document.querySelector("[data-focus-key=field-price]").dir==="ltr"&&document.querySelector(".m-field__unit").textContent==="د.أ"'))
        check('Known zero stays a number, not a missing price',p.locator('[data-focus-key=field-price]').input_value()=='0')
        action('publish');check('Required fields validated without opening confirmation or losing zero',ev('document.activeElement.dataset.focusKey==="field-title"&&document.activeElement.getAttribute("aria-invalid")==="true"&&document.querySelector("[data-focus-key=field-price]").value==="0"&&!lab.lastIntent'))
        p.locator('[data-focus-key=field-title]').fill('عنوان محفوظ');ev('document.querySelector("[data-focus-key=field-title]").setSelectionRange(2,3)');model('m.statusLabel="تحديث غير حساس"')
        check('Same-scope refresh preserves draft, focus and caret',ev('document.activeElement.value==="عنوان محفوظ"&&document.activeElement.selectionStart===2&&document.activeElement.selectionEnd===3'))
        ev('window.revoked=[];window.revoke=URL.revokeObjectURL;URL.revokeObjectURL=function(u){revoked.push(u);revoke.call(URL,u)}')
        p.locator('input[type=file]').set_input_files({'name':'image.svg','mimeType':'image/svg+xml','buffer':b'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10"/></svg>'})
        check('Local selected image previews without upload',ev('document.querySelector("#product-root img").src.startsWith("blob:")&&lab.lastIntent===null'))
        ev('window.fileURL=document.querySelector("#product-root img").src');action('publish');check('Publish confirmation opens with current scope',ev('!!document.querySelector("[role=alertdialog]")&&document.querySelector("[role=alertdialog]").textContent.includes(lab.model.scope.label)'))
        p.locator('[data-layer-close]').click();p.wait_for_timeout(20);check('Cancel leaves draft/files and emits nothing',ev('lab.lastIntent===null&&document.querySelector("[data-focus-key=field-title]").value==="عنوان محفوظ"&&document.querySelector("#product-root img").src===fileURL'))
        action('publish');confirm();check('Confirmed publish emits raw values/files once and remains pending',ev('lab.events.length===1&&lab.lastIntent.payload.price==="0"&&lab.lastIntent.payload.files[0] instanceof File&&lab.instance.getState().pending!==null'))
        ev('window.stale=lab.lastIntent.request;window.next=lab.model;next.phase="error";lab.resolve(stale,next)');check('Error acknowledgement preserves draft and allows explicit correction',ev('document.querySelector("[data-focus-key=field-title]").value==="عنوان محفوظ"&&!document.querySelector("[data-product-action=publish]").disabled'))
        model('m.scope={...m.scope,contextId:"other",workspaceId:"other"};m.dataContext=m.scope;m.title="";m.price=""')
        check('Scope switch revokes local files and old draft, rejects late response',ev('revoked.includes(fileURL)&&!document.querySelector("#product-root img")&&document.querySelector("[data-focus-key=field-title]").value===""&&!lab.resolve(stale,next)'))
        go('delivery','driver');check('Driver addresses and contact are not rendered',ev('!document.querySelector("#product-root").textContent.includes("نقطة استلام مسموحة")&&!document.querySelector("#product-root").textContent.includes("PRIVATE-CONTACT")'))
        model('m.visibility={addresses:false,contact:false};m.mode="request"');check('Hidden addresses do not leak through prefilled request inputs',ev('document.querySelector("[data-focus-key=field-pickup]").value===""&&document.querySelector("[data-focus-key=field-dropoff]").value===""'))
        go('delivery','change');action('request-change');confirm();check('Proposed change remains a request; both parties/data unchanged',ev('lab.lastIntent.action==="request-change"&&lab.model.currentText==="التفاصيل الحالية من المصدر"&&lab.model.parties.every(p=>!p.approved)&&lab.instance.getState().pending!==null'))
        go('delivery','proof');model('m.attachmentRequired=true');action('submit-proof');check('Host-required proof is checked before sensitive intent',ev('!lab.lastIntent&&!document.querySelector(".m-action-sheet")&&document.querySelector("#product-root").textContent.includes("أرفق الإثبات المطلوب")'))
        go('delivery');action('accept');model('m.amount="19";m.revision="updated"');check('Offer revision update invalidates open confirmation and restores page',ev('!document.querySelector(".m-action-sheet")&&!lab.lastIntent&&document.body.style.overflow!=="hidden"&&!document.querySelector("main").inert'))
        action('accept');confirm();check('New price confirmation emits new revision only, no financial instruction',ev('lab.lastIntent.payload.revision==="updated"&&Object.keys(lab.lastIntent.payload).sort().join(",")==="offerId,requestId,revision"'))
        ev('window.count=lab.events.length;document.querySelector("[data-product-action=accept]").click()');check('Repeated pending tap cannot send twice',ev('lab.events.length===count'))
        go('assistant','proposal');model('m.messages=[{id:"x",speaker:"assistant",text:"<img src=x onerror=alert(1)>"}]')
        check('Ask messages are plain text and cannot inject markup',ev('!document.querySelector("#product-root img")&&document.querySelector(".m-product__message").textContent.includes("<img")'))
        model('m.permissions=m.permissions.filter(x=>x!=="execute")');check('AI proposal cannot bypass missing grant',ev('document.querySelector("[data-product-action=execute]").disabled'))
        go('assistant','proposal');action('execute');check('Ask action requires separate confirmation',ev('!lab.lastIntent&&!!document.querySelector(".m-action-sheet")'));confirm()
        check('Ask execute carries proposal id/revision, not inferred text command',ev('lab.lastIntent.action==="execute"&&JSON.stringify(lab.lastIntent.payload)==="{\\"proposalId\\":\\"proposal-1\\",\\"revision\\":\\"proposal-r1\\"}"'))
        go('assistant');p.locator('textarea').fill('مسودة حساسة');ev('window.detached=document.querySelector("[data-product-action=send]")');action('send');ev('window.token=lab.lastIntent.request;window.reply=lab.model;reply.messages.push({speaker:"assistant",text:"OLD-PRIVATE-REPLY"})')
        model('m.scope={...m.scope,roleId:"supplier",workspaceId:"new-workspace"};m.dataContext=m.scope;m.messages=[]');ev('detached.click()')
        check('Late Ask response and detached action do not reach new role/workspace',ev('!lab.resolve(token,reply)&&document.querySelector("textarea").value===""&&!document.querySelector("#product-root").textContent.includes("OLD-PRIVATE-REPLY")&&lab.events.length===1'))
        p.locator('textarea').fill('expires');model('m.phase="expired"');check('Expired session purges messages and draft',ev('!document.querySelector("textarea")&&!document.querySelector(".m-product__message")'))
        model('m.phase="ready"');check('New session never recovers old sensitive draft',p.locator('textarea').input_value()=='')
        go('assistant','retry');action('retry');check('Retry references the failed message and waits for acknowledgement',ev('lab.lastIntent.payload.messageId==="failed-message"&&lab.instance.getState().pending!==null'))
        for kind in ['market','delivery','assistant','review']:
            go(kind);model('m.dataContext={...m.scope,workspaceId:"stale-workspace"}')
            check(kind+' mismatched response context hides private data',ev('!document.querySelector("#product-root h2")&&!document.querySelector("#product-root input,#product-root textarea,#product-root img")'))
        go('review');model('m.permissions=m.permissions.filter(p=>p!=="view-evidence")');check('Review evidence is gated independently from queue visibility',ev('!document.querySelector("#product-root img")&&document.querySelector("#product-root").textContent.includes("المرفقات مقيدة")'))
        ev('lab.replace(lab.fixture("listing"))');action('reject');check('Required review reason cannot be skipped',ev('!lab.lastIntent&&!document.querySelector(".m-action-sheet")&&document.querySelector("textarea").getAttribute("aria-invalid")==="true"'))
        p.locator('textarea').fill('سبب قرار من المراجع');action('reject');confirm();check('Review rejection is confirmed intent, not automatic removal',ev('lab.lastIntent.action==="reject"&&lab.lastIntent.payload.reason==="سبب قرار من المراجع"&&lab.model.phase==="ready"'))
        for kind in ['market','review']:
            go(kind);model('m.scope={contextId:"d",roleId:"driver",kind:"driver",workspaceId:null};m.dataContext=m.scope;m.destination="delivery"')
            check('Driver cannot access '+kind+' private/admin data even with injected grants',ev('!document.querySelector("#product-root h2")&&!document.querySelector("#product-root img")'))
        go('review','report');model('m.scope={contextId:"d",roleId:"driver",kind:"driver",workspaceId:null};m.dataContext=m.scope;m.destination="delivery"')
        check('Driver can report in Delivery with an explicit report grant',ev('!!document.querySelector("[data-product-action=submit-report]")&&!document.querySelector("[data-product-action=submit-report]").disabled'))
        go('market','editor');model('m.title="";m.price="";m.images=[];m.clearDraft=true');model('m.clearDraft=false');action('publish')
        p.locator('[data-focus-key=field-title]').fill('تم التصحيح')
        check('Correcting one field preserves remaining validation message references',ev('(()=>{let e=document.querySelector("[data-focus-key=field-price]");return e.getAttribute("aria-invalid")==="true"&&!!document.getElementById(e.getAttribute("aria-describedby"))})()'))
        p.locator('[data-focus-key=field-price]').fill('0')
        check('Last correction clears the shared validation notice',ev('!document.querySelector("[data-product-validation]")&&!document.querySelector("[aria-invalid=true]")'))
        # Reusing one owner for another record must not reuse its edits/files.
        go('market','editor');p.locator('[data-focus-key=field-title]').fill('مسودة سجل سابق')
        p.locator('input[type=file]').set_input_files({'name':'old-record.svg','mimeType':'image/svg+xml','buffer':b'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'})
        ev('window.revoked=[];window.revokeRecord=URL.revokeObjectURL;URL.revokeObjectURL=u=>{revoked.push(u);revokeRecord.call(URL,u)};window.oldFileURL=document.querySelector("#product-root img[src^=blob]").src')
        model('m.id="second-listing";m.title="عنوان السجل الجديد";m.price="25"')
        check('Different record in same workspace starts its own draft',ev('document.querySelector("[data-focus-key=field-title]").value==="عنوان السجل الجديد"&&document.querySelector("[data-focus-key=field-price]").value==="25"'))
        check('Different record revokes previous attachments instead of transferring them',ev('revoked.includes(oldFileURL)&&!document.querySelector("#product-root img[src^=blob]")'))
        action('publish');confirm();check('New-record publication contains only new-record input/files',ev('lab.lastIntent.payload.title==="عنوان السجل الجديد"&&lab.lastIntent.payload.files.length===0'))
        go('delivery','request');p.locator('[data-focus-key=field-note]').fill('تفاصيل الطلب فقط');model('m.mode="proof"')
        check('Different form mode does not inherit a same-record note',p.locator('[data-focus-key=field-note]').input_value()=='')
        go('assistant');model('m.draftKey="conversation-one"');p.locator('textarea').fill('مسودة المحادثة الأولى');model('m.revision="new-revision"')
        check('Same draft owner retains edits across revision updates',p.locator('textarea').input_value()=='مسودة المحادثة الأولى')
        model('m.draftKey="conversation-two";m.messages=[]')
        check('Explicit new conversation key clears old composer in same workspace',p.locator('textarea').input_value()=='')
        go('delivery','request');model('m.visibility.addresses=false')
        check('Revoking address visibility clears previously prefilled address inputs',ev('document.querySelector("[data-focus-key=field-pickup]").value===""&&document.querySelector("[data-focus-key=field-dropoff]").value===""'))
        action('request-delivery');check('Hidden cleared addresses cannot be submitted as an old draft',ev('lab.lastIntent===null&&!document.querySelector(".m-action-sheet")&&document.querySelector("[data-focus-key=field-pickup]").getAttribute("aria-invalid")==="true"'))
        # Field shell hit areas, keyboard confirmation and source-only rendering.
        go('market','editor');p.locator('#product-root .m-field__control').first.click(position={'x':3,'y':26})
        check('Existing Fields owns shell tap focus',ev('document.activeElement.dataset.focusKey==="field-title"'))
        p.locator('input[type=file]').set_input_files({'name':'bad.txt','mimeType':'text/plain','buffer':b'not an image'})
        check('Invalid attachment is rejected without an upload or sensitive intent',ev('!lab.lastIntent&&document.querySelector("#product-root").textContent.includes("تعذّر استخدام الملف")&&!document.querySelector("#product-root img[src^=blob]" )'))
        p.locator('input[type=file]').set_input_files({'name':'image.svg','mimeType':'image/svg+xml','buffer':b'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>'})
        ev('window.revoked=[];window.originalRevoke=URL.revokeObjectURL;URL.revokeObjectURL=u=>{revoked.push(u);originalRevoke.call(URL,u)};window.blob=document.querySelector("#product-root img[src^=blob]").src')
        ev('lab.instance.destroy()');check('Destroy revokes attachment URLs and disconnects Fields',ev('revoked.includes(blob)&&document.querySelector("#product-root").children.length===0'))
        go('delivery');action('accept');p.keyboard.press('Tab');check('Keyboard focus remains inside confirmation',ev('document.querySelector(".m-action-sheet").contains(document.activeElement)'))
        p.keyboard.press('Escape');p.wait_for_timeout(20);check('Escape cancels without command and returns focus',ev('!lab.lastIntent&&!document.querySelector(".m-action-sheet")&&document.activeElement.dataset.productAction==="accept"'))
        action('accept');p.locator('[data-action-id=confirm]').focus();p.keyboard.press('Enter');p.wait_for_function('lab.lastIntent!==null');check('Keyboard Enter confirms once after close',ev('lab.events.length===1&&document.body.style.overflow!=="hidden"'))
        go('assistant','proposal');ev("document.querySelector('link[href=\"../compositions/compositions.css\"]').remove()");geometry('Ask source without preview styles360')
        check('Reduced motion is inherited by existing controls',ev('parseFloat(getComputedStyle(document.querySelector("#product-root button")).transitionDuration)===0'))
        # Independent ownership, stale token, teardown and normal-motion close ordering.
        go('delivery');ev('window.secondRoot=document.createElement("div");document.querySelector("main").append(secondRoot);window.second=MicroProduct.mount(secondRoot,"assistant",{...lab.model,destination:"ask",permissions:["view","compose","send"],messages:[]});window.secondEvents=0;secondRoot.addEventListener("micro-product:intent",()=>secondEvents++)')
        second_field=p.locator('main > .m-product textarea');second_field.fill('second');p.locator('main > .m-product [data-product-action=send]').click()
        check('Second instance pending does not lock first',ev('secondEvents===1&&second.getState().pending!==null&&lab.instance.getState().pending===null&&!document.querySelector("#product-root [data-product-action=accept]").disabled'))
        ev('window.secondToken=second.getState().pending;second.destroy();secondRoot.remove()');check('Destroyed instance rejects late resolution and releases content',ev('!second.resolve(secondToken,lab.model)&&second.getState()===null&&secondRoot.children.length===0'))
        p.emulate_media(reduced_motion='no-preference');action('accept');p.wait_for_timeout(250)
        p.locator('[data-action-id=confirm]').click();check('Normal motion waits for actual close before command',ev('lab.lastIntent===null&&!!document.querySelector("[data-closing]")'))
        p.wait_for_function('lab.lastIntent!==null');check('Normal motion yields exactly one confirmed intent and unlocks page',ev('lab.events.length===1&&document.body.style.overflow!=="hidden"&&!document.querySelector("main").inert'))
        model('m.phase="ready"');action('accept');p.wait_for_timeout(250);ev('document.querySelector("[data-action-id=confirm]").click();lab.instance.destroy()');p.wait_for_timeout(350)
        check('Destroy during animated confirmation cancels command, overlay and locks',ev('lab.events.length===1&&!document.querySelector(".m-action-sheet,.m-layer-backdrop")&&document.body.style.overflow!=="hidden"&&!document.querySelector("main").inert'))
        p.emulate_media(reduced_motion='reduce')
        # Narrow checks only for the components which contain long labels/media/forms.
        p.set_viewport_size({'width':320,'height':780})
        for kind,case in [('market','editor'),('delivery','change'),('assistant','proposal'),('context','business')]:
            go(kind,case);geometry(kind+' targeted320 RTL');shot(kind+'320')
        p.set_viewport_size({'width':360,'height':780});go('market');ev('document.documentElement.dir="ltr"');p.locator('[data-next]').click();geometry('Media directional360 LTR');check('LTR media navigation preserves logical index',ev('MicroCarousel.getIndex(document.querySelector("[data-carousel]"))===1'))
        go('assistant','proposal');ev('document.documentElement.dir="ltr"');geometry('Ask directional360 LTR')
        check('No browser exceptions or failed resources',not errors,errors)
        browser.close()
    server.shutdown()
    paths=sorted(str(p.relative_to(ROOT)) for p in (ROOT/'components/product-context').glob('*') if p.is_file())+['components/fields/fields.js','components/fields/specification.md','previews/product-context/lab.html','previews/product-context/lab.js','previews/product-context/sample-one.svg','previews/product-context/sample-two.svg','tools/product-context-check.py']
    report=dict(commitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),workingTree=True,physicalDevice=False,browser=version,scope='Phone Light360x780 RTL; targeted320; directional360 LTR; normal/reduced motion; no Dark/desktop/backend/AI',scenarios=cases,passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),checks=checks,measurements=measurements,sourceSha256={n:hashlib.sha256((ROOT/n).read_bytes()).hexdigest() for n in paths})
    (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"Product context: {report['passed']} PASS / {report['failed']} FAIL");return bool(report['failed'])
if __name__=='__main__':raise SystemExit(main())
