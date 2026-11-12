#!/usr/bin/env python3
"""Canonical B01 action reuse: Light360 RTL; targeted320 controls and360 LTR.
Capture-only records honest baseline failures; final gate requires zero failures.
"""
import argparse,hashlib,http.server,json,subprocess,tempfile,threading
from pathlib import Path
from html.parser import HTMLParser
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
FIELDS=['backgroundColor','backgroundImage','boxShadow','borderRadius','color','fontFamily','fontSize','fontWeight','lineHeight','paddingTop','paddingBottom','paddingLeft','paddingRight','minHeight','touchAction']
class Handler(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
 def log_message(self,*_):pass

def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--out',type=Path);ap.add_argument('--capture-only',action='store_true');a=ap.parse_args()
 out=a.out or Path(tempfile.mkdtemp(prefix='shared-actions-'));out.mkdir(parents=True,exist_ok=True)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
 checks=[];errors=[];measurements=[]
 def ck(n,v,d=None):
  checks.append(dict(name=n,passed=bool(v),detail=d));print(('PASS' if v else 'FAIL')+' '+n,flush=True)
 class Assets(HTMLParser):
  def __init__(self):super().__init__();self.css=[];self.js=[]
  def handle_starttag(self,tag,attrs):
   data=dict(attrs)
   if tag=='link' and data.get('rel')=='stylesheet':self.css.append(data['href'])
   if tag=='script' and data.get('src'):self.js.append(data['src'])
 consumers=[];missing=[]
 targetJs={ROOT/'components/data/data.js',ROOT/'components/data/packed-circle.js',ROOT/'components/metric-comparison/metric-comparison.js'}
 for area in ('components','previews'):
  for path in (ROOT/area).rglob('*.html'):
   if path.name=='standalone.html' or 'chart-proposal' in str(path):continue
   assets=Assets();assets.feed(path.read_text())
   resolve=lambda href:(ROOT/href.lstrip('/')).resolve() if href.startswith('/') else (path.parent/href).resolve()
   if any(resolve(src) in targetJs for src in assets.js if not src.startswith(('http','data:'))):
    count=sum(resolve(href)==ROOT/'components/buttons/buttons.css' for href in assets.css if not href.startswith(('http','data:')));consumers.append(str(path.relative_to(ROOT)))
    if count!=1:missing.append({'page':str(path.relative_to(ROOT)),'declaredButtonStyles':count})
 ck('Active JavaScript chart consumers declare B01 CSS exactly once',not missing,{'consumers':consumers,'missing':missing})
 with sync_playwright() as pw:
  browser=pw.chromium.launch(**chromium_launch_options());version=browser.version
  p=browser.new_page(viewport={'width':360,'height':780},has_touch=True,is_mobile=True,color_scheme='light',locale='ar',reduced_motion='reduce')
  p.on('pageerror',lambda e:errors.append(str(e)));p.on('console',lambda m:errors.append(m.text) if m.type=='error' else None);p.on('response',lambda r:errors.append(str(r.status)+' '+r.url) if r.status>=400 else None)
  def ev(js):return p.evaluate(js)
  def go(path='/previews/readable-source/index.html'):
   p.goto(base+path,wait_until='networkidle');ev('document.fonts.ready')
  def reference():
   present=ev("[...document.styleSheets].filter(s=>s.href&&s.href.endsWith('/components/buttons/buttons.css')).length")
   ck('Page loads B01 CSS exactly once',present==1,present)
   # Only to establish the independent baseline reference; does not add m-btn to actions.
   if not present:p.add_style_tag(url=base+'/components/buttons/buttons.css')
   ev("window.ref=document.createElement('button');ref.type='button';ref.className='m-btn m-btn--secondary';ref.id='b01-reference';ref.textContent='التالي';document.body.append(ref)")
  def style(el):return el.evaluate('(el,fields)=>Object.fromEntries(fields.map(k=>[k,getComputedStyle(el)[k]]))',FIELDS)
  def match(n,selector):
   target=p.locator(selector).first;actual=style(target);expected=style(p.locator('#b01-reference'))
   ck(n+' uses shared B01 classes',target.evaluate("e=>e.classList.contains('m-btn')&&e.classList.contains('m-btn--secondary')"))
   diff={k:{'actual':actual[k],'reference':expected[k]} for k in FIELDS if actual[k]!=expected[k]};ck(n+' computed appearance matches canonical secondary',not diff,diff)
   b=target.bounding_box();ck(n+' standard48px target',b['width']>=47.9 and b['height']>=47.9,b)
  def geometry(n,root):
   d=p.locator(root).evaluate('''e=>{const r=e.getBoundingClientRect(),els=[...e.querySelectorAll('button,input[type=range]')].filter(e=>e.getClientRects().length&&!e.closest('[hidden]'));let bad=[];for(let el of els){const x=el.getBoundingClientRect();if(x.width<47.9||x.height<47.9||x.left<r.left-1||x.right>r.right+1)bad.push({text:el.textContent,width:x.width,height:x.height,left:x.left,right:x.right});}for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){const a=els[i].getBoundingClientRect(),b=els[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)bad.push({overlap:[els[i].className,els[j].className]});}return {left:r.left,right:r.right,viewport:innerWidth,scroll:document.documentElement.scrollWidth,bad}}''');measurements.append(dict(name=n,**d));ck(n,d['left']>=-1 and d['right']<=d['viewport']+1 and d['scroll']<=d['viewport'] and not d['bad'],d)
  go();reference();canonicalNormal=style(p.locator('#b01-reference'))
  for name,sel in [('Previous','#sales-bars .m-chart__select-step:first-child'),('Next','#sales-bars .m-chart__select-step:last-child'),('Data disclosure','#sales-bars .m-chart__disclose'),('Metric disclosure','#stock-rows .m-main-metric__disclose')]:match(name,sel)
  marker=p.locator('#sales-group .m-reading-details > summary').evaluate("e=>({display:getComputedStyle(e).display,type:getComputedStyle(e).listStyleType,height:e.getBoundingClientRect().height})")
  ck('C04 disclosure retains a visible native closed marker',marker['display']=='list-item' and marker['type']=='disclosure-closed' and marker['height']>=48,marker)
  p.locator('#sales-group summary').tap();ck('Native disclosure opens with its matching marker',p.locator('#sales-group details').evaluate("e=>e.open&&getComputedStyle(e.querySelector('summary')).listStyleType==='disclosure-open'"))
  p.locator('#sales-group summary').tap();ck('Native disclosure closes with one activation',not p.locator('#sales-group details').evaluate('e=>e.open'))
  p.locator('#sales-title').tap();ev('window.getSelection().removeAllRanges()')
  p.locator('#sales-group').screenshot(path=str(out/'sales360-rtl.png'),animations='disabled');p.locator('#stock-rows').screenshot(path=str(out/'rows360-rtl.png'),animations='disabled')
  ev("window.c=document.querySelector('#sales-bars');window.next=c.querySelector('.m-chart__select-step:last-child');next.disabled=true;ref.disabled=true")
  p.wait_for_timeout(160);actual=style(p.locator('#sales-bars .m-chart__select-step:last-child'));expected=style(p.locator('#b01-reference'));ck('Disabled appearance remains shared',actual==expected,{'actual':actual,'reference':expected})
  ev('next.disabled=false;ref.disabled=false');p.keyboard.press('Tab');p.locator('#b01-reference').focus();p.wait_for_timeout(160);expected=style(p.locator('#b01-reference'));p.locator('#sales-bars .m-chart__select-step:last-child').focus();p.wait_for_timeout(160);actual=style(p.locator('#sales-bars .m-chart__select-step:last-child'));ck('Keyboard focus appearance remains shared',actual==expected,{'actual':actual,'reference':expected})
  # Canonical authored press state; actual touch activation is checked below.
  p.locator('#sales-bars .m-chart__select-step:last-child').blur();ev('ref.classList.add("is-pressed");next.classList.add("is-pressed")');p.wait_for_timeout(160)
  actual=style(p.locator('#sales-bars .m-chart__select-step:last-child'));expected=style(p.locator('#b01-reference'));ck('B01 pressed state inherited without a local visual override',actual==expected,{'actual':actual,'reference':expected});ev('ref.classList.remove("is-pressed");next.classList.remove("is-pressed")')
  ev("MicroData.setSelection(c,'wed');window.actionEvents=[];c.addEventListener('micro-data:selection-change',e=>actionEvents.push(e.detail))")
  p.locator('#sales-bars .m-chart__select-step').last.tap();ck('Next touch changes actual item exactly once',ev("actionEvents.length===1&&actionEvents[0].key==='thu'&&actionEvents[0].value===780"))
  p.locator('#sales-bars .m-chart__select-step').first.tap();ck('Previous touch changes actual item exactly once',ev("actionEvents.length===2&&actionEvents[1].key==='wed'&&actionEvents[1].value===920"))
  p.locator('#sales-bars .m-chart__disclose').tap();ck('Shared table action opens native disclosure',ev("c.querySelector('table').hidden===false&&c.querySelector('.m-chart__disclose').getAttribute('aria-expanded')==='true'"))
  ev('MicroData.render(c);MicroData.render(c)');p.locator('#sales-bars .m-chart__disclose').tap();ck('Rerender retains one binding and closes once',ev("c.querySelector('table').hidden&&c.querySelector('.m-chart__disclose').getAttribute('aria-expanded')==='false'"))
  ev("window.copy=c.cloneNode(true);copy.id='shared-action-clone';copy.querySelectorAll('.m-btn').forEach(e=>e.classList.remove('m-btn','m-btn--secondary'));document.body.append(copy);MicroData.init(copy);MicroData.init(copy)")
  ck('Legacy-shaped cloned disclosure is upgraded on init',ev("copy.querySelector('.m-chart__disclose').classList.contains('m-btn--secondary')"))
  ck('Clone owns exactly one selection box',ev("copy.querySelectorAll('.m-chart__selection').length===1&&copy.querySelectorAll('.m-chart__select-step').length===2"));ev('MicroData.disconnect(copy);copy.remove()')
  ev("MicroData.setSelection(c,'sat')");ck('Boundary disables native Previous without changing selection',ev("c.querySelector('.m-chart__select-step').disabled&&MicroData.getSelection(c).key==='sat'"));p.locator('#sales-group').screenshot(path=str(out/'sales-disabled360.png'),animations='disabled')
  ev("ref.remove();MicroData.setSelection(c,'wed')");geometry('360 source actions fit without overlap','#sales-group')
  p.set_viewport_size({'width':320,'height':780});geometry('Targeted320 source actions fit without shrinking','#sales-group');p.locator('#sales-group').screenshot(path=str(out/'sales320-rtl.png'))
  p.set_viewport_size({'width':360,'height':780});ev("document.documentElement.dir='ltr'");geometry('Directional LTR source actions fit','#sales-group');p.locator('#sales-group').screenshot(path=str(out/'sales360-ltr.png'))
  go('/previews/ui-system-showcase/index.html#component-review');p.locator('#sc-review-family').select_option('data');reference();match('Packed disclosure','[data-review-variant=packed-circle] .m-chart__disclose')
  p.locator('[data-review-variant=packed-circle] .m-chart__disclose').tap();ck('Packed disclosure opens once',p.locator('[data-review-variant=packed-circle] table').is_visible())
  p.locator('[data-review-variant=packed-circle] .m-chart__disclose').tap();ck('Packed disclosure closes once',not p.locator('[data-review-variant=packed-circle] table').is_visible())
  offline=browser.new_page(viewport={'width':360,'height':780},has_touch=True,is_mobile=True,color_scheme='light');requests=[]
  offline.on('pageerror',lambda e:errors.append(str(e)));offline.on('request',lambda r:requests.append(r.url) if r.resource_type!='document' and r.url.startswith('http') else None);offline.route('**/*',lambda r:r.continue_() if r.request.resource_type=='document' else r.abort())
  offline.goto(base+'/docs/audits/shared-actions-2026-11-12/review.html',wait_until='networkidle');offline.evaluate('document.fonts.ready')
  actual=style(offline.locator('#sales-bars .m-chart__select-step').last);ck('Candidate file preserves canonical B01 appearance with subresources blocked',actual==canonicalNormal,{'actual':actual,'reference':canonicalNormal})
  offline.locator('#sales-bars .m-chart__select-step').last.tap();ck('Candidate file Next preserves actual780 reading',offline.evaluate("MicroData.getSelection(document.querySelector('#sales-bars')).value===780"))
  ck('Candidate file requests no external assets',not requests,requests);offline.close()
  ck('No browser or missing resource errors',not errors,errors);browser.close()
 server.shutdown()
 paths=['components/buttons/buttons.css','components/compositions/reading-layout.css','components/data/data.js','components/data/data.css','components/data/packed-circle.js','components/metric-comparison/metric-comparison.js','components/metric-comparison/metric-comparison.css','shared/tokens.css','tools/shared-actions-check.py']
 report=dict(snapshotMethod='Ordinary screenshots after neutral heading tap, cleared text selection, and completed finite animations; state comparisons are independent.',sourceCommitAtRun=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),workingTree=True,captureOnly=a.capture_only,browser=version,theme='light',primary='360x780 RTL',targeted=['320 controls','360 LTR'],physicalDevice=False,passed=sum(c['passed'] for c in checks),failed=sum(not c['passed'] for c in checks),checks=checks,measurements=measurements,sourceSha256={n:hashlib.sha256((ROOT/n).read_bytes()).hexdigest() for n in paths},limits=['Canonical CSS comparison establishes reuse, not a complete usability study.','Final owner phone review deferred by instruction; no new physical-device test.'])
 (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"Shared actions: {report['passed']} PASS / {report['failed']} FAIL; {out}");return bool(report['failed'] and not a.capture_only)
if __name__=='__main__':raise SystemExit(main())
