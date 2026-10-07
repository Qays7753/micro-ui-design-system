from pathlib import Path
from playwright.sync_api import sync_playwright
import functools,threading,json,argparse
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[4]);ap.add_argument('--output',type=Path,required=True);ap.add_argument('--chromium',required=True);args=ap.parse_args();root=args.root.resolve();output=args.output.resolve();assert root not in output.parents and output!=root,'Output must be outside repository';output.mkdir(parents=True,exist_ok=True)
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Q,directory=str(root)));threading.Thread(target=s.serve_forever,daemon=True).start()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=args.chromium,args=['--no-sandbox']);page=b.new_page();page.goto(f'http://127.0.0.1:{s.server_port}/previews/messages/index.html');page.wait_for_load_state('networkidle')
 x=page.evaluate('''async () => {const wait=t=>new Promise(r=>setTimeout(r,t)); const text='تم حذف العنصر.';window.MicroMessages.announce(text,false);await wait(100);const region=document.querySelector('.m-live-region');let count=0;const obs=new MutationObserver(()=>count++);obs.observe(region,{childList:true,subtree:true,characterData:true});await wait(700);window.MicroMessages.announce(text,false);await wait(100);obs.disconnect();return {text:region.textContent,second_event_mutations:count,delay:700,limitation:'DOM mutation measured; no screen reader audio tested'};}''')
 (output/'repeated-announcement.json').write_text(json.dumps(x,ensure_ascii=False,indent=2));print(json.dumps(x,ensure_ascii=False));b.close()
s.shutdown()
