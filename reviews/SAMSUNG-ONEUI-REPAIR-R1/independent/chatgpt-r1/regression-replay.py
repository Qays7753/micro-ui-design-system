import os
from pathlib import Path
from functools import partial
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading,sys
root=Path(os.environ.get('MICRO_REVIEW_ROOT', str(Path(__file__).resolve().parents[4])))
kind=sys.argv[1]
if kind=='f03':
 source=root/'tools/ux-f03-check.py'
 code=source.read_text().replace('browser = pw.chromium.launch(headless=True,','browser = pw.chromium.launch(executable_path="/tmp/micro-review-chromium", headless=True,')
 sys.argv=[str(source),'--out','/tmp/micro-repair-review/f03']
else:
 source=root/'tools/concepts-check.py'
 class H(SimpleHTTPRequestHandler):
  def log_message(self,*a):pass
 srv=ThreadingHTTPServer(('127.0.0.1',0),partial(H,directory=str(root)));threading.Thread(target=srv.serve_forever,daemon=True).start()
 code=source.read_text().replace('OUT = ROOT / "reviews" / "CONCEPTS"','OUT = Path("/tmp/micro-repair-review/concepts")').replace('BASE = os.environ.get("MICRO_TEST_BASE", "http://127.0.0.1:5000")',f'BASE = "http://127.0.0.1:{srv.server_port}"').replace('executable = shutil.which("chromium")','executable = "/tmp/micro-review-chromium"').replace('p.chromium.launch(executable_path=executable, headless=True)','p.chromium.launch(executable_path=executable, headless=True, args=["--no-sandbox"])')
code=code.replace('/tmp/micro-review-chromium',os.environ.get('MICRO_REVIEW_BROWSER','/tmp/micro-review-chromium'))
exec(compile(code,str(source),'exec'),{'__file__':str(source),'__name__':'__main__'})
