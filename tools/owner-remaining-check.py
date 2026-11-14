#!/usr/bin/env python3
"""Focused checks for owner stages. One phone, no broad duplicate matrix."""
import argparse,http.server,json,threading,tempfile,subprocess,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass

def phase3(p,base,out,check):
 p.goto(base+'/previews/design-direction/density.html');p.evaluate('document.fonts.ready')
 p.locator('.m-row').evaluate_all('(xs)=>xs.forEach(x=>x.classList.remove("m-row--single"))');before=p.locator('#short-rows').bounding_box()['height'];p.locator('main').screenshot(path=str(out/'before360.png'))
 p.locator('.m-row').evaluate_all('(xs)=>xs.forEach(x=>x.classList.add("m-row--single"))');after=p.locator('#short-rows').bounding_box()['height'];p.locator('main').screenshot(path=str(out/'after360.png'))
 check('Short rows save space without reducing readable type',after<before and p.locator('.m-row').evaluate_all('(xs)=>xs.every(x=>x.getBoundingClientRect().height>=48)'))
 check('Amounts and counts remain distinct','د.أ' in p.locator('.m-reading-group').inner_text() and 'طلب' in p.locator('.m-reading-group').inner_text())
 p.locator('.m-row__title').first.evaluate('(e)=>e.textContent="اسم صنف طويل جدًا ".repeat(12)');check('Long single-row content grows without overflow',p.locator('.m-row').first.bounding_box()['height']>48 and p.evaluate('document.documentElement.scrollWidth===innerWidth'))
 check('Default rows keep old minimum',before>=72*3)

def phase5(p,base,out,check):
 def go(case):
  p.goto(base+'/previews/product-context/lab.html?component=market');p.locator('#scenario').select_option(case);p.evaluate('document.fonts.ready')
 image=(ROOT/'docs/audits/ui-owner-2026-11-14/phase1/evidence/direction360.png').read_bytes()
 def choose(name):p.locator('#product-root input[type=file]').set_input_files(dict(name=name,mimeType='image/png',buffer=image))
 go('editor');choose('one.png');choose('two.png');check('Default selection still replaces',p.locator('.m-product__filenames bdi').all_text_contents()==['two.png'])
 go('editor-append');choose('one.png');choose('two.png');check('Explicit append preserves both selections',p.locator('.m-product__filenames bdi').all_text_contents()==['one.png','two.png'])
 p.locator('#product-root').screenshot(path=str(out/'append360.png'))
 p.get_by_role('button',name='إزالة one.png',exact=True).click();check('Individual removal preserves other file and focus',p.locator('.m-product__filenames bdi').all_text_contents()==['two.png'] and p.locator('[data-focus-key=choose-files]').evaluate('(e)=>e===document.activeElement'))
 p.locator('[data-product-action=save-draft]').click();check('Draft emits remaining file only',p.evaluate('lab.lastIntent.payload.files.length===1&&lab.lastIntent.payload.files[0].name==="two.png"'))
 go('editor-append');choose('one.png');p.evaluate('let m=lab.model;m.scope={...m.scope,workspaceId:"new"};m.dataContext=m.scope;lab.replace(m)');check('Context change clears file selection',p.locator('.m-product__filenames').count()==0)
 go('editor-append');p.evaluate('let m=lab.model;m.phase="disabled";lab.replace(m)');check('Disabled editor cannot choose files',p.locator('[data-focus-key=choose-files]').is_disabled())
 check('File list fits phone',p.evaluate('document.documentElement.scrollWidth===innerWidth'))

def phasebaseline6(p,base,out,check):
 p.goto(base+'/previews/product-context/lab.html?component=assistant')
 p.evaluate('let m=lab.model;m.messages=Array.from({length:40},(_,i)=>({id:"r"+i,speaker:"assistant",text:"رسالة طويلة للقراءة ".repeat(8)}));lab.replace(m);document.querySelector(".m-product__log").scrollTop=600')
 before=p.locator('.m-product__log').evaluate('(e)=>e.scrollTop')
 p.evaluate('let m=lab.model;m.messages.push({id:"new",speaker:"assistant",text:"رسالة جديدة"});lab.replace(m)')
 after=p.locator('.m-product__log').evaluate('(e)=>e.scrollTop');check('Reproduced old reading position reset',before>0 and after==0)
 p.locator('#product-root').screenshot(path=str(out/'before360.png'))

def phase6(p,base,out,check):
 def go(case='reading'):
  p.goto(base+'/previews/product-context/lab.html?component=assistant');p.locator('#scenario').select_option(case);p.evaluate('document.fonts.ready')
 def model(code):p.evaluate('let m=lab.model;'+code+';lab.replace(m)')
 go();model('m.messages=Array.from({length:40},(_,i)=>({id:"r"+i,speaker:"assistant",text:"رسالة طويلة للقراءة ".repeat(8)}))')
 log=p.locator('.m-product__log');log.evaluate('(e)=>e.scrollTop=600');p.wait_for_timeout(30);before=log.evaluate('(e)=>e.scrollTop');model('m.messages.push({id:"new",speaker:"assistant",text:"رسالة جديدة"})')
 check('Append preserves reading position',abs(log.evaluate('(e)=>e.scrollTop')-before)<2)
 check('Unread affordance appears instead of pulling reader',p.locator('.m-assistant__new').is_visible())
 p.locator('#product-root').screenshot(path=str(out/'reading360.png'))
 p.locator('.m-assistant__new').click();check('Explicit new-message jump reaches end',log.evaluate('(e)=>e.scrollHeight-e.clientHeight-e.scrollTop<24') and p.locator('.m-assistant__new').is_hidden())
 model('m.messages.push({id:"end",speaker:"assistant",text:"تحديث آخر"})');check('Reader at end follows new messages and keeps log focus',log.evaluate('(e)=>e.scrollHeight-e.clientHeight-e.scrollTop<24&&e===document.activeElement'))
 log.evaluate('(e)=>e.scrollTop=500');p.wait_for_timeout(30);p.evaluate('window.anchor=[...document.querySelectorAll("[data-message-id]")].find(e=>e.getBoundingClientRect().bottom>document.querySelector(".m-product__log").getBoundingClientRect().top);window.anchorId=anchor.dataset.messageId;window.offset=anchor.getBoundingClientRect().top-document.querySelector(".m-product__log").getBoundingClientRect().top')
 model('m.messages[0].text+="نص إضافي ".repeat(100)');check('Stable message anchor survives growth above it',p.evaluate('Math.abs([...document.querySelectorAll("[data-message-id]")].find(e=>e.dataset.messageId===anchorId).getBoundingClientRect().top-document.querySelector(".m-product__log").getBoundingClientRect().top-offset)<2'))
 model('m.draftKey="another-thread";m.messages=[{id:"other",speaker:"assistant",text:"محادثة أخرى"}]');check('Conversation switch does not inherit unread state',p.locator('.m-assistant__new').is_hidden() and log.evaluate('(e)=>e.scrollTop')==0)
 go();log.evaluate('(e)=>e.scrollTop=100');p.wait_for_timeout(20);model('m.phase="empty"');check('Empty conversation has no false unread control',p.locator('.m-assistant__new').is_hidden())
 go('expired-actions');check('One shared reason describes all expired actions',p.locator('.m-assistant__actions').inner_text().count('انتهت صلاحية الاقتراح')==1 and p.locator('.m-assistant__actions button').evaluate_all('(xs)=>new Set(xs.map(e=>e.getAttribute("aria-describedby"))).size===1'))
 go('actions');check('Explicit emphasis selects one primary only',p.locator('.m-assistant__actions .m-btn--primary').count()==1)
 model('m.messages[1].actions[1].emphasis="primary"');check('Conflicting emphasis does not guess a primary',p.locator('.m-assistant__actions .m-btn--primary').count()==0)
 go('fill');model('m.phase="loading";m.conversationLayout="embedded"');check('Layout updates even when messages are suspended',p.locator('#product-root').get_attribute('data-conversation-layout')=='embedded' and p.locator('.m-product__log').count()==0);model('m.phase="ready";m.conversationLayout="fill"');check('Fill log fits bounded host',p.evaluate('(()=>{let r=document.querySelector("#product-root").getBoundingClientRect(),c=document.querySelector(".m-assistant__composer").getBoundingClientRect();return r.height===600&&c.bottom<=r.bottom+1&&document.querySelector(".m-product__log").clientHeight>0})()'))
 p.locator('#product-root').screenshot(path=str(out/'fill360.png'))
 p.locator('.m-assistant__composer textarea').fill('كتابة طويلة\n'*30);check('Growing composer stays inside fill host',p.evaluate('document.querySelector(".m-assistant__composer").getBoundingClientRect().bottom<=document.querySelector("#product-root").getBoundingClientRect().bottom+1'))
 check('Phone has no horizontal overflow',p.evaluate('document.documentElement.scrollWidth===innerWidth'))
 p.locator('.demo-tools > summary').click();p.locator('#destroy').click();check('Destroy clears conversation attributes and DOM',p.locator('#product-root').evaluate('(e)=>!e.children.length&&!e.hasAttribute("data-conversation-layout")'))

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--phase',required=True);ap.add_argument('--out',type=Path);args=ap.parse_args();out=args.out or Path(tempfile.mkdtemp(prefix='owner-check-'));out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
 def check(name,ok):checks.append(dict(name=name,passed=bool(ok)));print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
 with sync_playwright() as pw:
  b=pw.chromium.launch(**chromium_launch_options());p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',locale='ar',reduced_motion='reduce');p.set_default_timeout(6000);p.on('pageerror',lambda e:errors.append(str(e)))
  globals()['phase'+args.phase](p,f'http://127.0.0.1:{server.server_port}',out,check)
  check('No script errors',not errors);b.close()
 server.shutdown();files=[x for folder in ['components','previews/design-direction'] for x in (ROOT/folder).rglob('*') if x.is_file() and x.suffix in ['.css','.js']]
 report=dict(baseCommit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),workingTree=True,physicalDevice=False,phase=args.phase,checks=checks,passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),sourceSha256={str(x.relative_to(ROOT)):hashlib.sha256(x.read_bytes()).hexdigest() for x in files})
 (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"{report['passed']} PASS / {report['failed']} FAIL");return bool(report['failed'])
if __name__=='__main__':raise SystemExit(main())
