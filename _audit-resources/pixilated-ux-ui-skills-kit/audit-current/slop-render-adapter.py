"""Run the unmodified Pixilated DOM audit on the real served dependency tree."""
import asyncio
import json
import os
import subprocess
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[3]
KIT=ROOT/"_audit-resources/pixilated-ux-ui-skills-kit"
OUT=Path(__file__).parent
BASE="https://"+os.environ["REPLIT_DEV_DOMAIN"]

async def main():
 source=(KIT/"anti-ai-slop/scripts/audit.js").read_text()
 routes=[p for p in subprocess.check_output(["git","ls-files","-z"],cwd=ROOT).decode().split("\0") if p.endswith(".html") and p.startswith(("components/","previews/"))]
 results={"adapter":"Unmodified kit audit.js evaluated through Playwright on real HTTP pages, avoiding macOS-wrapper and copied-relative-asset issues. Browser DOM only; no source writes.","cases":[]}
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path="/repl/tools/bin/chromium",args=["--no-sandbox"])
  page=await b.new_page(viewport={"width":390,"height":844})
  await page.route("**/*",lambda req:req.continue_() if req.request.url.startswith((BASE,"data:","blob:")) else req.abort())
  for route in sorted(routes):
   try:
    await page.goto(BASE+"/"+route,wait_until="networkidle")
    await page.evaluate("document.fonts.ready")
    await page.evaluate(source)
    data=await page.locator("#__slop").text_content()
    results["cases"].append({"route":route,"width":390,"result":json.loads(data)})
    print(route,flush=True)
   except Exception as e:results["cases"].append({"route":route,"error":str(e)})
   (OUT/"slop-rendered-raw.json").write_text(json.dumps(results,ensure_ascii=False,indent=2))
  await b.close()

if __name__=="__main__":asyncio.run(main())
