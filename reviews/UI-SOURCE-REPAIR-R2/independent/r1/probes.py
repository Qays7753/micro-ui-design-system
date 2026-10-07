import importlib.util,json,pathlib,argparse,sys
from playwright.sync_api import sync_playwright
ap=argparse.ArgumentParser();ap.add_argument('--root',required=True);ap.add_argument('--output',required=True);ap.add_argument('--chromium');args=ap.parse_args()
root=pathlib.Path(args.root).resolve();out=pathlib.Path(args.output).resolve();out.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('r2',root/'tools/ui-repair-r2-check.py');r2=importlib.util.module_from_spec(spec);spec.loader.exec_module(r2)
results=[];meta=r2.git_meta(root);base=r2.serve_dir(root)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=args.chromium,args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
 meta['browser']=b.version
 for tag,url in [('src',base+'/'+r2.SAMPLE_REL+'/index.html'),('standalone',(root/r2.SAMPLE_REL/'standalone.html').as_uri())]:
  page=b.new_page(viewport={'width':430,'height':900});page.goto(url);page.locator('#f03-gw-demo').click();page.locator('#f03-nav-reports').click();page.wait_for_timeout(500)
  before=page.evaluate(r2.CHART_MEASURE)
  page.set_viewport_size({'width':320,'height':900});page.wait_for_timeout(500)
  after=page.evaluate(r2.CHART_MEASURE)
  results.append({'case':'resize-without-manual-render','tag':tag,'before':before,'after':after})
  mask=page.add_style_tag(content='.m-navbar {visibility:hidden !important}');page.locator('#f03-rep-line').scroll_into_view_if_needed();page.locator('#f03-rep-line').screenshot(path=str(out/f'extra-{tag}-resize-line.png'));mask.evaluate('(el)=>el.remove()')
  page.locator('#f03-nav-reports').click();page.wait_for_timeout(200)
  dates=page.evaluate('''() => [...document.querySelectorAll('#f03-rep-line .m-chart__data li')].map((li,i)=>({source:li.dataset.label,shown:[...document.querySelectorAll('#f03-rep-line svg g')][i].textContent}))''')
  results.append({'case':'default-date-labels','tag':tag,'labels':dates});page.add_style_tag(content='.m-navbar {visibility:hidden !important}');page.locator('#f03-rep-line').screenshot(path=str(out/f'extra-{tag}-date-line.png'))
  page.evaluate('''() => {const ch=document.getElementById('f03-rep-bars');ch.querySelector('.m-chart__data').innerHTML=['المستلزمات','المستهلكات','المستلزمات'].map((s,i)=>`<li data-series="${'abc'[i]}" data-value="${i+2}" data-label="${s}"></li>`).join('');MicroData.render(ch)}''')
  normal=page.evaluate(r2.CHART_MEASURE);page.evaluate(r2.ZOOM2_CLEAN);page.wait_for_timeout(150);zoom=page.evaluate(r2.CHART_MEASURE)
  results.append({'case':'single-word-labels','tag':tag,'normal':normal,'zoom':zoom});page.locator('#f03-rep-bars').screenshot(path=str(out/f'extra-{tag}-oneword-zoom.png'))
  page.close()
 b.close()
(out/'extra-probes.json').write_text(json.dumps({'meta':meta,'screenshot_note':'Only fixed navbar visibility masked for isolated chart screenshots; geometry is measured unchanged.','results':results},ensure_ascii=False,indent=2))
for x in results:
 if x['case']=='resize-without-manual-render':print(x['tag'],x['case'],[(ch.get('chart'),ch.get('minEff')) for ch in x['after']])
 elif x['case']=='single-word-labels':print(x['tag'],x['case'],'normal',[(ch.get('chart'),ch.get('collisions'),ch.get('outsideH')) for ch in x['normal'] if not ch.get('hidden')],'zoom',[(ch.get('chart'),ch.get('collisions'),ch.get('outsideH')) for ch in x['zoom'] if not ch.get('hidden')])
 else: print(x['tag'],x['case'],x['labels'])

checks=[]
for x in results:
 if x['case']=='resize-without-manual-render':
  charts=[ch for ch in x['after'] if ch.get('kind') in ('bars','line') and not ch.get('hidden')]
  ok=len(charts)==2 and all(ch['minEff']>=r2.DECLARED[ch['kind']]-0.01 for ch in charts)
  checks.append({'case':'responsive-minimum', 'tag':x['tag'], 'ok':ok})
 elif x['case']=='single-word-labels':
  bars=next(ch for ch in x['zoom'] if ch.get('chart')=='f03-rep-bars')
  line=next(ch for ch in x['zoom'] if ch.get('chart')=='f03-rep-line')
  checks.append({'case':'whole-word-labels-200', 'tag':x['tag'],'ok':bars['nTexts']>0 and not bars['collisions'] and bars['outsideH']==0})
  checks.append({'case':'iso-dates-200', 'tag':x['tag'],'ok':line['nTexts']>0 and not line['collisions'] and line['outsideH']==0})
(out/'checks.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2))
print('PROBES',sum(x['ok'] for x in checks),'/',len(checks))
sys.exit(0 if all(x['ok'] for x in checks) else 1)
