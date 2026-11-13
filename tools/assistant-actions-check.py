#!/usr/bin/env python3
"""Focused Ask actions, truthful activity and lifecycle checks; no AI/backend."""
import argparse,http.server,json,threading,tempfile,subprocess,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--out',type=Path);args=ap.parse_args();out=args.out or Path(tempfile.mkdtemp(prefix='ask-actions-'));out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
 def check(name,ok):checks.append(dict(name=name,passed=bool(ok)));print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
 with sync_playwright() as pw:
  b=pw.chromium.launch(**chromium_launch_options());p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light',locale='ar',reduced_motion='reduce');p.set_default_timeout(6000)
  p.on('pageerror',lambda e:errors.append(str(e)));p.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  def go(case='actions'):
   p.goto(f'http://127.0.0.1:{server.server_port}/previews/product-context/lab.html?component=assistant');p.locator('#scenario').select_option(case);p.evaluate('document.fonts.ready')
  def model(code):p.evaluate('()=>{let m=lab.model;'+code+';lab.replace(m)}')
  def action(name):p.locator('#product-root [data-product-action="'+name+'"]').click()
  go();root=p.locator('#product-root');root.screenshot(path=str(out/'ask-actions360.png'))
  check('Composer uses one readable row initially',p.locator('.m-assistant__composer textarea').bounding_box()['height']<=60)
  p.locator('.m-assistant__composer textarea').fill('نص طويل جدًا\n'*20);check('Long composer grows with bounded scrolling',p.locator('.m-assistant__composer textarea').evaluate('(e)=>e.scrollHeight>e.clientHeight&&e.getBoundingClientRect().height<=156'))
  check('Three typed actions are attached to assistant message',p.locator('.m-product__message[data-speaker=assistant] button').count()==3)
  action('follow-up');check('Follow-up emits identifiers and remains pending',p.evaluate('lab.lastIntent.action==="follow-up"&&lab.lastIntent.payload.messageId==="message-2"&&lab.lastIntent.payload.actionId==="show-today"&&lab.instance.getState().pending!==null'))
  check('Pending blocks duplicate message action',p.locator('[data-product-action=follow-up]').is_disabled())
  go();action('open-resource');check('Open is an intent, not a URL navigation',p.evaluate('lab.lastIntent.action==="open-resource"&&lab.lastIntent.payload.actionId==="open-order"&&location.pathname.endsWith("lab.html")'))
  go();action('execute');check('Execute requires confirmation before dispatch',p.evaluate('lab.lastIntent===null') and p.locator('.m-action-sheet').count()==1 and '14:00' in p.locator('.m-action-sheet').inner_text())
  p.keyboard.press('Escape');check('Cancel executes nothing',p.evaluate('lab.lastIntent===null'))
  action('execute');p.locator('[data-action-id=confirm]').click();p.wait_for_function('lab.lastIntent!==null');check('Confirmed execution emits scoped ID and revision only',p.evaluate('lab.lastIntent.action==="execute"&&JSON.stringify(Object.keys(lab.lastIntent.payload).sort())===JSON.stringify(["actionId","messageId","revision"])&&lab.lastIntent.payload.revision==="1"&&lab.lastIntent.scope.workspaceId==="workshop-a"'))
  go();action('execute');model('m.messages[1].actions[2].revision="2"');check('Updated revision invalidates open confirmation',p.locator('.m-action-sheet').count()==0 and p.evaluate('lab.lastIntent===null'))
  go();action('execute');model('m.scope={...m.scope,contextId:"other",workspaceId:"other"};m.dataContext=m.scope;m.messages=[]');check('Workspace switch clears actions and confirmation',p.locator('.m-action-sheet').count()==0 and p.locator('.m-assistant__actions button').count()==0)
  go('expired-actions');check('Expired suggestions cannot execute',p.locator('.m-assistant__actions button:disabled').count()==3 and p.locator('.m-assistant__actions').inner_text().count('انتهت صلاحية الاقتراح')==3)
  go();model('m.permissions=["view","compose"]');check('Displayed suggestions do not grant permission',p.locator('.m-assistant__actions button:disabled').count()==3)
  go();model('m.messages[1].actions[0].kind="javascript";m.messages[1].actions[1].id=m.messages[1].actions[2].id');check('Unknown kinds and duplicate action IDs are ignored',p.locator('.m-assistant__actions button').count()==0)
  go();model('m.messages[0].actions=m.messages[1].actions;m.messages[0].speaker="user"');check('User message cannot supply assistant actions',p.locator('.m-product__message[data-speaker=user] button').count()==0)
  go();model('m.messages.push({...m.messages[1]})');check('Duplicate message IDs cannot address actions',p.locator('.m-assistant__actions button').count()==0)
  go();model('m.messages[1].actions[0].label="<img src=x onerror=alert(1)>"');check('Labels are plain text',p.locator('.m-assistant__actions img').count()==0 and '<img' in p.locator('.m-assistant__actions').inner_text())
  go('searching');root.screenshot(path=str(out/'ask-searching360.png'));check('Search is explicit, send and suggestions blocked while waiting','جارٍ البحث' in p.locator('.m-assistant__activity').inner_text() and p.locator('[data-product-action=send]').is_disabled() and p.locator('.m-assistant__actions button:disabled').count()==3)
  check('Reduced motion keeps status without animation',p.locator('.m-assistant__activity-dot').evaluate('(e)=>getComputedStyle(e).animationName==="none"'))
  p.emulate_media(reduced_motion='no-preference');check('Normal motion affects activity only, not logo',p.locator('.m-assistant__activity-dot').evaluate('(e)=>getComputedStyle(e).animationName!=="none"') and p.locator('.m-assistant__symbol').evaluate('(e)=>getComputedStyle(e).animationName==="none"'))
  model('m.activity="invented"');check('Unknown activity never pretends to search','جارٍ إعداد الرد' in p.locator('.m-assistant__activity').inner_text())
  go('proposal');check('Legacy proposal stays available before composer',p.evaluate('!!(document.querySelector("[data-product-action=execute]").compareDocumentPosition(document.querySelector(".m-assistant__composer"))&Node.DOCUMENT_POSITION_FOLLOWING)'))
  p.set_viewport_size({'width':320,'height':780});go();model('m.messages[1].actions[0].label="اعرض الطلبات التي تحتاج إلى متابعة اليوم"');check('Long action wraps at320 without losing touch height',p.evaluate('document.documentElement.scrollWidth===innerWidth&&[...document.querySelectorAll(".m-assistant__actions button")].every(x=>x.getBoundingClientRect().height>=48)'))
  check('No script or resource errors',not errors);b.close()
 server.shutdown();files=['components/product-context/assistant.js','components/product-context/product-core.js','components/product-context/product-context.css','previews/product-context/lab.js']
 report=dict(commitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),workingTree=True,physicalDevice=False,checks=checks,passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),sourceSha256={f:hashlib.sha256((ROOT/f).read_bytes()).hexdigest() for f in files})
 (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"{report['passed']} PASS / {report['failed']} FAIL");return bool(report['failed'])
if __name__=='__main__':raise SystemExit(main())
