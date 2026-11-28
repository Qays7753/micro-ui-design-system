"""Diagnose one failing :active case in its exact gate conditions.

Presses «أرسل البلاغ» exactly as the gate does (scrollIntoView center,
mouse down at center, hold, snapshot classes/bg) and prints what changes.
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
        r = page.evaluate("""async () => {
          const btns = [...document.querySelectorAll('button')];
          const b = btns.find(x => x.textContent.trim() === 'أرسل البلاغ');
          if (!b) return 'not found';
          b.scrollIntoView({ block: 'center', inline: 'nearest' });
          const rect = b.getBoundingClientRect();
          const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
          // what is at the center BEFORE pressing?
          const preHit = document.elementFromPoint(cx, cy);
          const preHitIsBtn = preHit && (preHit === b || b.contains(preHit));
          const pre = { bg: getComputedStyle(b).backgroundColor, cls: b.className };
          // press: mouse down at center, hold
          const opts = { bubbles: true, cancelable: true, clientX: cx, clientY: cy };
          b.dispatchEvent(new PointerEvent('pointerdown', { ...opts, pointerId: 1, isPrimary: true }));
          b.dispatchEvent(new MouseEvent('mousedown', opts));
          await new Promise(r => setTimeout(r, 160));
          const active = { bg: getComputedStyle(b).backgroundColor, cls: b.className };
          const postHit = document.elementFromPoint(cx, cy);
          b.dispatchEvent(new PointerEvent('pointerup', { ...opts, pointerId: 1 }));
          b.dispatchEvent(new MouseEvent('mouseup', opts));
          return { preHitIsBtn, preHit: preHit?.tagName + '.' + (preHit?.className || '').toString().slice(0, 30),
                   postHit: postHit?.tagName + '.' + (postHit?.className || '').toString().slice(0, 30),
                   preBg: pre.bg, activeBg: active.bg, preCls: pre.cls.slice(0, 60), activeCls: active.cls.slice(0, 60),
                   changed: pre.bg !== active.bg || pre.cls !== active.cls };
        }""")
        print(r)
finally:
    server.stop()
