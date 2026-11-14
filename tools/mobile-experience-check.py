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

def drawer(p,base,out,check):
 p.goto(base+'/previews/mobile-experience/menu.html');p.evaluate('document.fonts.ready');trigger=p.locator('[data-account-open]');trigger.click();p.wait_for_timeout(270);layer=p.locator('.m-layer');box=layer.bounding_box();check('RTL drawer occupies right 80 percent',abs(box['width']-288)<1 and abs(box['x']-72)<1)
 check('Application opens first and background is isolated',p.locator('[data-account-view=application]').is_visible() and trigger.evaluate('(e)=>!!e.closest("[inert]")'))
 p.screenshot(path=str(out/'drawer360.png'));close=p.locator('[data-account-close]').bounding_box();p.locator('[data-account-to-account]').click();check('Account uses same layer and focuses its title',p.locator('[data-account-view=account]').is_visible() and p.locator('.m-layer:visible').count()==1 and p.locator('[data-account-title=account]').evaluate('(e)=>e===document.activeElement'))
 check('Close remains fixed between views',p.locator('[data-account-close]').bounding_box()==close);p.screenshot(path=str(out/'account360.png'));p.locator('[data-account-back]').click();check('Back returns to app settings',p.locator('[data-account-view=application]').is_visible())
 p.keyboard.press('Escape');p.wait_for_timeout(230);check('Escape restores trigger and background',layer.is_hidden() and trigger.evaluate('(e)=>e===document.activeElement&&!e.closest("[inert]")'))
 trigger.click();p.wait_for_timeout(270);p.locator('.m-layer-backdrop').click(position={'x':5,'y':400});p.wait_for_timeout(230);check('Backdrop closes drawer',layer.is_hidden())
 p.evaluate('document.documentElement.dir="ltr"');trigger.click();p.wait_for_timeout(270);check('LTR drawer follows inline start',abs(layer.bounding_box()['x'])<1);p.keyboard.press('Escape');p.wait_for_timeout(230)
 p.evaluate('document.documentElement.dir="rtl"');p.set_viewport_size({'width':320,'height':780});trigger.click();p.wait_for_timeout(270);check('Narrow drawer fits without page overflow',p.evaluate('document.documentElement.scrollWidth===innerWidth') and layer.bounding_box()['width']<=320)
 p.keyboard.press('Tab');check('Focus remains inside drawer',p.evaluate('document.querySelector(".m-layer").contains(document.activeElement)'))
 p.evaluate('MicroAccountSettings.disconnect(document);MicroNavigation.disconnect(document)');check('Destroy releases layer and scroll lock',layer.is_hidden() and p.evaluate('document.body.style.overflow!=="hidden"'));p.set_viewport_size({'width':360,'height':780})
 p.goto(base+'/components/account-settings/example-usage.html');p.locator('[data-account-open]').click();check('Legacy centered account default retained',p.locator('[data-account-view=account]').is_visible() and p.locator('.m-layer').evaluate('(e)=>e.classList.contains("m-layer--center")'))

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
