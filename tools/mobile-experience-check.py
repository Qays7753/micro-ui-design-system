#!/usr/bin/env python3
"""Focused mobile experience checks; Light only, one primary viewport."""
import argparse,http.server,json,threading,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from browser_support import chromium_launch_options
ROOT=Path(__file__).resolve().parents[1]
class H(http.server.SimpleHTTPRequestHandler):
 def __init__(self,*a,**k):super().__init__(*a,directory=str(ROOT),**k)
 def log_message(self,*a):pass

def login(p,base,out,check):
 p.goto(base+'/previews/mobile-experience/login.html');p.evaluate('document.fonts.ready');button=p.locator('[data-access-provider]');p.locator('.preview-tools summary').click()
 p.screenshot(path=str(out/'login360.png'))
 check('Provider-only form exposes no password',p.locator('input[type=password]').count()==0 and button.is_visible())
 button.click();p.wait_for_function('window.providerCalls===1');p.evaluate('document.querySelector("[data-access-provider]").dispatchEvent(new MouseEvent("click",{bubbles:true}))')
 check('Pending provider gates duplicate calls',p.evaluate('providerCalls===1') and p.locator('form').get_attribute('aria-busy')=='true')
 p.locator('#finish').click();p.wait_for_function('document.querySelector("form").dataset.microAccessBusy==="false"');check('Cancellation restores provider without claiming success','أُلغي' in p.locator('[data-access-status]').inner_text() and not button.is_disabled())
 p.locator('#outcome').select_option('failure');button.click();p.wait_for_function('window.providerCalls===2');p.locator('#finish').click();p.wait_for_function('document.querySelector("form").dataset.microAccessBusy==="false"');check('Failure is visible and retry enabled','تعذّر' in p.locator('[data-access-status]').inner_text() and not button.is_disabled())
 button.click();p.wait_for_function('window.providerCalls===3');p.evaluate('MicroAccessGateway.disconnect(document.querySelector("[data-access-gateway]"));window.completeProvider()');p.wait_for_timeout(30);check('Disconnect clears busy and ignores late result',not button.is_disabled() and p.locator('form').get_attribute('aria-busy') is None)
 for state in ['restoring','expired','denied','offline']:
  p.locator('#state').select_option(state);check('Session '+state,p.locator('.m-session').is_visible() and p.locator('[data-access-gateway]').is_hidden())
 check('No horizontal overflow',p.evaluate('document.documentElement.scrollWidth===innerWidth'))

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--phase',choices=['login','drawer','tasks','motion','all'],default='all');ap.add_argument('--out',type=Path,default=Path('/tmp/mobile-experience-check'));a=ap.parse_args();a.out.mkdir(parents=True,exist_ok=True);checks=[];errors=[]
 def check(name,ok):checks.append({'name':name,'passed':bool(ok)});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),H);threading.Thread(target=server.serve_forever,daemon=True).start()
 with sync_playwright() as pw:
  b=pw.chromium.launch(**chromium_launch_options());p=b.new_page(viewport={'width':360,'height':780},is_mobile=True,has_touch=True,color_scheme='light');p.set_default_timeout(6000);p.on('pageerror',lambda e:errors.append(str(e)))
  for phase in (['login','drawer','tasks','motion'] if a.phase=='all' else [a.phase]):globals()[phase](p,f'http://127.0.0.1:{server.server_port}',a.out,check)
  check('No script errors',not errors);b.close()
 server.shutdown();report={'phase':a.phase,'viewport':'360x780','physicalDevice':False,'checks':checks,'errors':errors,'passed':sum(x['passed'] for x in checks),'failed':sum(not x['passed'] for x in checks)};(a.out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(f"{report['passed']} PASS / {report['failed']} FAIL");return bool(report['failed'])
if __name__=='__main__':sys.exit(main())
