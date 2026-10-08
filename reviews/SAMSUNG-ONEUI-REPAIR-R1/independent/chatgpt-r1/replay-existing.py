import os
from pathlib import Path
import json,sys
root=Path(os.environ.get('MICRO_REVIEW_ROOT', str(Path(__file__).resolve().parents[4])))
source=root/'reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent5/scripts/agent5-verify.py'
out=Path('/tmp/micro-repair-review/replay')
code=source.read_text().replace('EVID = SCRIPT.parents[1]',f'EVID = Path({str(out)!r})').replace('/home/z/my-project/evidence/bin/chromium',os.environ.get('MICRO_REVIEW_BROWSER','/tmp/micro-review-chromium'))
ns={'__file__':str(source),'__name__':'replay_import'}
code=code.replace('/tmp/micro-review-chromium',os.environ.get('MICRO_REVIEW_BROWSER','/tmp/micro-review-chromium'))
exec(compile(code,str(source),'exec'),ns)
ns['main']()
p=out/'checks/agent5-verify.json'
d=json.loads(p.read_text());d['meta']['independentAgent']='ChatGPT replay of existing Agent5 measurements; not a new agent session';d['meta']['head']=__import__('subprocess').check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip();p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
