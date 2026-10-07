import pathlib,subprocess,threading,functools,json,sys,concurrent.futures,argparse
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
ap=argparse.ArgumentParser();ap.add_argument('--root',type=pathlib.Path,default=pathlib.Path(__file__).resolve().parents[4]);ap.add_argument('--output',type=pathlib.Path,required=True);ap.add_argument('--chromium',required=True);args=ap.parse_args();root=args.root.resolve();out=args.output.resolve();assert root not in out.parents and out!=root,'Output must be outside repository';out.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
srv=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
threading.Thread(target=srv.serve_forever,daemon=True).start()
base='http://127.0.0.1:'+str(srv.server_port)
files=sorted((root/'reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5').glob('probe[1-5]*.py'))
def replay(p):
 src=p.read_text().replace('http://127.0.0.1:5000',base).replace('/home/z/my-project/evidence/bin/chromium',args.chromium).replace('/home/z/my-project/micro-ui-design-system/reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent5',str(out))
 src=src.replace('p.chromium.launch(',"p.chromium.launch(args=['--no-sandbox'],") if 'p.chromium.launch(executable_path=CHROMIUM)' in src else src
 # probe1 already supplies args: add sandbox option to its existing list.
 src=src.replace('args=["--hide-scrollbars"]','args=["--hide-scrollbars", "--no-sandbox"]')
 f=out/p.name;f.write_text(src)
 with (out/(p.stem+'.log')).open('w') as log:
  s=subprocess.run([sys.executable,str(f)],stdout=log,stderr=subprocess.STDOUT,timeout=180)
 return {'script':p.name,'exit':s.returncode}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for result in pool.map(replay,files):print(json.dumps(result),flush=True)
meta={'reviewed_head':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),'reference_commit':'a5500c9','source_diff_files':subprocess.check_output(['git','diff','--name-only','a5500c9..HEAD','--','components','previews','shared','tools'],cwd=root,text=True).splitlines(),'worktree_status':subprocess.check_output(['git','status','--porcelain'],cwd=root,text=True).splitlines(),'browser':subprocess.check_output([args.chromium,'--version'],text=True).strip(),'adapter':'Only server URL, output paths and executable/sandbox argument changed. Source and probes assertions untouched. Original hardcoded metadata is not the replay metadata.','not_run':['actual devices','screen reader','native zoom','WebKit','touch']}
(out/'replay-metadata.json').write_text(json.dumps(meta,indent=2));srv.shutdown()
