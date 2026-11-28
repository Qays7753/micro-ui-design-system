"""«أرسل للمراجعة» vanished mid-scan: the press on «شرائح» (the mode
segment) switches the editor's mode → the form content below changes →
the ActionBar (with the send button) may remount or move. The gate's
path re-resolution should follow it (same structural path). But if the
path CHANGES (the mode switch adds/removes siblings), the resolution
fails → 'vanished'.

Check: does pressing «شرائح» change the send button's structural path
(nth-of-type shifts), or unmount it entirely?
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()
try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        r = page.evaluate("""() => {
          const stages = [...document.querySelectorAll('.lab-sheet-stage')];
          const editor = stages.find(st => st.textContent.includes('أرسل للمراجعة'));
          const send = [...editor.querySelectorAll('button')].find(b => b.textContent.trim() === 'أرسل للمراجعة');
          const seg = [...editor.querySelectorAll('.mds-segmented-segment')].find(b => b.textContent.trim() === 'شرائح');
          const pathOf = (el) => {
            const parts = [];
            let node = el;
            while (node && node.nodeType === 1 && node !== document.body) {
              if (node.id) { parts.unshift('#' + node.id); break; }
              let sel = node.tagName.toLowerCase();
              const parent = node.parentElement;
              if (parent) {
                const sibs = Array.from(parent.children).filter(c => c.tagName === node.tagName);
                if (sibs.length > 1) sel += ':nth-of-type(' + (sibs.indexOf(node) + 1) + ')';
              }
              parts.unshift(sel);
              node = parent;
            }
            return parts.join(' > ');
          };
          const before = {path: pathOf(send), inDom: true};
          seg.click();
          return new Promise((resolve) => setTimeout(() => {
            const stages2 = [...document.querySelectorAll('.lab-sheet-stage')];
            const editor2 = stages2.find(st => st.textContent.includes('أرسل للمراجعة'));
            const send2 = editor2 ? [...editor2.querySelectorAll('button')].find(b => b.textContent.trim() === 'أرسل للمراجعة') : null;
            resolve({before: before.path, after: send2 ? pathOf(send2) : 'GONE',
                      editorStill: !!editor2});
          }, 400));
        }""")
        print(r)
finally:
    server.stop()
