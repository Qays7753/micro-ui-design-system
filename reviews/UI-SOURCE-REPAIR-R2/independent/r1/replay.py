import importlib.util,json,pathlib,sys,argparse
from playwright.sync_api import sync_playwright
ap=argparse.ArgumentParser();ap.add_argument('--root',required=True);ap.add_argument('--output',required=True);ap.add_argument('--chromium');args=ap.parse_args()
root=pathlib.Path(args.root).resolve();out=pathlib.Path(args.output).resolve();out.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('r2',root/'tools/ui-repair-r2-check.py');r2=importlib.util.module_from_spec(spec);spec.loader.exec_module(r2)
t=r2.Tool();meta=r2.git_meta(root);base=r2.serve_dir(root)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=args.chromium,args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage']);meta['browser']=b.version
 for tag,url in [('src',base+'/'+r2.SAMPLE_REL+'/index.html'),('standalone',(root/r2.SAMPLE_REL/'standalone.html').as_uri())]:
  page=b.new_page(viewport={'width':360,'height':760});r2.run_sample(t,page,tag,url,out)
 r2.run_loading(t,b,base,out); b.close()
(out/'official-replay.json').write_text(json.dumps({'meta':meta,'summary':t.summary(),'results':t.results},ensure_ascii=False,indent=2))
print('REPLAY',t.summary());sys.exit(bool(t.fails))
