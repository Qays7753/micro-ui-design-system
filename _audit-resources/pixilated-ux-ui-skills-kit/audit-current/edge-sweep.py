"""Read-only current-tree browser evidence. Writes only requested audit output."""
import asyncio
import hashlib
import json
import os
import subprocess
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / "generated-artifacts/pixilated-audit/edge"
REPORT = Path(__file__).parent
BASE = "https://" + os.environ["REPLIT_DEV_DOMAIN"]
WIDTHS = [320, 360, 390, 430]
METRICS = r"""() => {
 const vis=e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
 const path=e=>e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+[...e.classList].join('.');
 const controls=[...document.querySelectorAll('button,a[href],input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=switch]')].filter(vis);
 const targets=controls.map(e=>{let r=e.getBoundingClientRect();let label=e.labels&&e.labels.length?[...e.labels].map(x=>x.textContent).join(' '):'';
 return {selector:path(e),text:(e.getAttribute('aria-label')||label||e.textContent||e.getAttribute('title')||e.getAttribute('placeholder')||'').trim().slice(0,110),width:+r.width.toFixed(2),height:+r.height.toFixed(2),disabled:e.disabled||e.getAttribute('aria-disabled')==='true',role:e.getAttribute('role')||e.tagName.toLowerCase(),type:e.getAttribute('type')};
 });
 const overflow=[...document.querySelectorAll('body *')].filter(e=>{if(!vis(e))return false;let r=e.getBoundingClientRect();return r.left < -1 || r.right > innerWidth+1}).slice(0,35).map(e=>{let r=e.getBoundingClientRect();return {selector:path(e),left:+r.left.toFixed(2),right:+r.right.toFixed(2),position:getComputedStyle(e).position,text:e.textContent.trim().slice(0,80)}});
 const textClip=[...document.querySelectorAll('body *')].filter(e=>vis(e)&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&e.clientWidth>0&&e.scrollWidth>e.clientWidth+1&&['hidden','clip'].includes(getComputedStyle(e).overflowX)).map(e=>({selector:path(e),client:e.clientWidth,scroll:e.scrollWidth,text:e.textContent.trim().slice(0,90)}));
 return {viewport:innerWidth,docWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,direction:getComputedStyle(document.documentElement).direction,lang:document.documentElement.lang,controls:targets,smallTargets:targets.filter(e=>!e.disabled&&(e.width<47.9||e.height<47.9)),nameCandidates:targets.filter(e=>!e.text),overflow,textClip,fonts:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight})),landmarks:{main:document.querySelectorAll('main').length,h1:document.querySelectorAll('h1').length},runningAnimations:document.getAnimations().filter(a=>a.playState==='running').length};
}"""

async def main():
 OUT.mkdir(parents=True, exist_ok=True)
 tracked=subprocess.check_output(["git","ls-files","-z"],cwd=ROOT).decode().split("\0")
 baseline={p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in tracked if p and (ROOT/p).is_file()}
 routes=sorted(p for p in tracked if p.endswith(".html") and p.startswith(("components/","previews/")))
 result={"head":subprocess.check_output(["git","rev-parse","HEAD"],cwd=ROOT).decode().strip(),"base":BASE,"widths":WIDTHS,"routes":routes,"cases":[]}
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path="/repl/tools/bin/chromium",args=["--no-sandbox"])
  for route in routes:
   context=await browser.new_context(viewport={"width":390,"height":844},device_scale_factor=1,locale="ar-JO")
   page=await context.new_page()
   errors=[]; resources=[]
   page.on("pageerror",lambda e: errors.append(str(e)))
   page.on("response",lambda r: resources.append({"status":r.status,"url":r.url}) if r.status>=400 else None)
   # Audit only the local repository; no outside requests are necessary.
   await page.route("**/*",lambda req: req.continue_() if req.request.url.startswith((BASE,"http://127.0.0.1:5000","data:","blob:")) else req.abort())
   try:
    await page.goto(BASE+"/"+route,wait_until="networkidle",timeout=30000)
    await page.evaluate("document.fonts.ready")
    for width in WIDTHS:
     await page.set_viewport_size({"width":width,"height":844})
     await page.wait_for_timeout(80)
     metrics=await page.evaluate(METRICS)
     slug=route.replace("/","--").replace(".html","")
     shot=OUT/f"{slug}-{width}.png"
     await page.screenshot(path=str(shot))
     result["cases"].append({"route":route,"width":width,"mode":"default","metrics":metrics,"screenshot":str(shot.relative_to(ROOT)),"pageErrors":list(errors),"resourceErrors":list(resources)})
    for mode,kwargs in [("reduced-motion",{"reduced_motion":"reduce"}),("forced-colors",{"forced_colors":"active"})]:
     await page.set_viewport_size({"width":320,"height":844})
     await page.emulate_media(**kwargs)
     await page.wait_for_timeout(80)
     result["cases"].append({"route":route,"width":320,"mode":mode,"metrics":await page.evaluate(METRICS)})
     await page.emulate_media(reduced_motion="no-preference",forced_colors="none")
    await page.set_viewport_size({"width":844,"height":390})
    result["cases"].append({"route":route,"width":844,"mode":"landscape","metrics":await page.evaluate(METRICS)})
    await page.set_viewport_size({"width":320,"height":844})
    await page.evaluate("""() => [...document.querySelectorAll('body *')].filter(e=>!['SCRIPT','STYLE','SVG','PATH','DEFS'].includes(e.tagName)).map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]).forEach(([e,s])=>e.style.fontSize=(s*2)+'px')""")
    result["cases"].append({"route":route,"width":320,"mode":"text-size-200%-simulation","metrics":await page.evaluate(METRICS),"limitation":"DOM font-size doubling, not native browser zoom or OS dynamic type"})
   except Exception as e:
    result["cases"].append({"route":route,"mode":"HARNESS_ERROR","error":str(e)})
   await context.close()
   (OUT/"edge-results.json").write_text(json.dumps(result,ensure_ascii=False,indent=2))
   print(route,flush=True)
  await browser.close()
 result["integrity"]={"tracked_baseline":len(baseline),"changed":[p for p,h in baseline.items() if not (ROOT/p).is_file() or hashlib.sha256((ROOT/p).read_bytes()).hexdigest()!=h]}
 (OUT/"edge-results.json").write_text(json.dumps(result,ensure_ascii=False,indent=2))
 print(json.dumps({"routes":len(routes),"cases":len(result["cases"]),"integrity":result["integrity"]},ensure_ascii=False))

if __name__=="__main__":
 asyncio.run(main())
