from pathlib import Path
from playwright.sync_api import sync_playwright
import functools,threading,json,argparse
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path(__file__).resolve().parents[4]);ap.add_argument('--output',type=Path,required=True);ap.add_argument('--chromium',required=True);args=ap.parse_args();root=args.root.resolve();output=args.output.resolve();assert root not in output.parents and output!=root,'Output must be outside repository';output.mkdir(parents=True,exist_ok=True)
class Q(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
s=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Q,directory=str(root)));threading.Thread(target=s.serve_forever,daemon=True).start()
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=args.chromium,args=['--no-sandbox']);page=b.new_page(viewport={'width':320,'height':900});page.goto(f'http://127.0.0.1:{s.server_port}/previews/selection/index.html');page.wait_for_load_state('networkidle')
 result=page.evaluate('''() => {
 const seg=document.createElement('div');seg.className='m-seg';seg.style.width='160px';seg.style.display='flex';seg.style.flexWrap='wrap';seg.style.columnGap='4px';seg.style.margin='20px';
 for(let i=0;i<3;i++){let x=document.createElement('button');x.className='m-seg__item';x.textContent=['الأحدث','الاسم','القيمة'][i];x.style.width='100px';seg.append(x)}
 document.body.prepend(seg);
 let states=[];
 for(const gap of [4,8,12]){
 seg.style.rowGap=gap+'px';const vals=[...seg.children].map(el=>{let r=el.getBoundingClientRect(),pseudo=getComputedStyle(el,'::after');return {top:r.top,bottom:r.bottom,touchTop:r.top+parseFloat(pseudo.top),touchBottom:r.bottom-parseFloat(pseudo.bottom),beforeTop:pseudo.top,beforeBottom:pseudo.bottom}});
 states.push({rowGap:gap,items:vals,touchGap:vals[1].touchTop-vals[0].touchBottom});
 }return states;
}''')
 (output/'segment-spacing.json').write_text(json.dumps(result,indent=2));print(result);b.close()
s.shutdown()
