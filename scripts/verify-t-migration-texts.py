"""Verify the t() migration changed NO rendered text in the lab.

Loads the PRE-migration standalone (extracted from git at the pre-migration
commit) and the CURRENT build side by side in the same browser, collects
every text node of the catalog view in both, and diffs them. Any difference
means the migration changed what the user sees.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path
import subprocess, tempfile, shutil, os

PRE_COMMIT = '8537c69'  # last commit before the t() migration session

# 1. Extract the pre-migration standalone from git
tmp = Path(tempfile.mkdtemp(prefix='pre-lab-'))
data = subprocess.run(['git', 'show', f'{PRE_COMMIT}:previews/ds-lab/standalone.html'],
                      capture_output=True)
assert data.returncode == 0, data.stderr[:200]
pre_dir = tmp / 'pre'
pre_dir.mkdir()
(pre_dir / 'standalone.html').write_bytes(data.stdout)

# 2. Serve both trees
srv_pre = LocalServer(pre_dir)
srv_cur = LocalServer(Path('previews/ds-lab'))
base_pre, base_cur = srv_pre.start(), srv_cur.start()

JS = """() => {
  const walk = (root) => {
    const out = [];
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const t = n.textContent.trim();
      if (t) out.push(t);
    }
    return out;
  };
  return walk(document.body);
}"""

def collect(session, url):
    page = session.page(**DEFAULT_CONTEXT)
    page.goto(url + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
    page.wait_for_timeout(800)
    texts = page.evaluate(JS)
    page.close()
    return texts

try:
    with browser_session('chromium') as session:
        pre = collect(session, base_pre)
        cur = collect(session, base_cur)
    print(f'pre-migration text nodes: {len(pre)}')
    print(f'current text nodes:       {len(cur)}')
    if pre == cur:
        print('IDENTICAL: the migration changed no rendered text')
    else:
        # The lab gained agent-1 sections since (DurationPicker etc.) —
        # the fair comparison: every PRE text must still exist in CUR.
        from collections import Counter
        cp, cc = Counter(pre), Counter(cur)
        lost = cp - cc
        added = cc - cp
        print('LOST (present before, missing now):')
        for t, n in lost.items():
            print(f'  [{n}x] {t[:70]}')
        print(f'added (new sections since {PRE_COMMIT}): {sum(added.values())} nodes')
        if not lost:
            print('=> NO REGRESSION: everything pre-migration still renders identically')
finally:
    srv_pre.stop()
    srv_cur.stop()
    shutil.rmtree(tmp, ignore_errors=True)
