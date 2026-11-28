"""Diagnose the SEQUENCE failure: probe «محتوى مضلل» the way the gate
does — but after first probing the elements that come before it in the
same stage (the gallery arrows and the report chips before it), to see
which prior probe poisons it. Also checks :hover collision: if hover and
active produce the SAME style, the gate's base snapshot (taken while
hovering after mouse.move) already carries the pressed look, so the
press changes nothing.
"""
import sys
sys.path.insert(0, 'tools/ds-gates')
from common import browser_session, DEFAULT_CONTEXT, LocalServer
from pathlib import Path

server = LocalServer(Path('previews/ds-lab'))
base = server.start()

PROPS = ['backgroundColor','backgroundImage','borderColor','borderWidth',
         'boxShadow','color','opacity','transform','outlineColor','outlineWidth']

try:
    with browser_session('chromium') as session:
        page = session.page(**DEFAULT_CONTEXT)
        page.goto(base + '/standalone.html?view=catalog&tools=1', wait_until='load', timeout=45000)
        page.wait_for_timeout(600)
        # The gate collects ALL buttons and presses them in DOM order.
        # The failing chip is one of the report reason chips. The button
        # right BEFORE it in DOM order gets pressed, mouse.up — then the
        # mouse MOVES to this chip's center (mouse.move) and BASE is
        # snapshotted WHILE HOVERING. If :hover == :active for chips,
        # base == active -> violation.
        r = page.evaluate("""() => {
          const chips = [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'محتوى مضلل');
          return chips.map(c => ({cls: c.className.toString().slice(0, 60),
                                  parent: c.parentElement.className.toString().slice(0, 40)}));
        }""")
        print('chips found:', r)
        # simulate: hover over the chip (no press) then compare styles
        r2 = page.evaluate("""() => {
          const chip = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'محتوى مضلل');
          if (!chip) return null;
          chip.scrollIntoView({block: 'center'});
          const rect = chip.getBoundingClientRect();
          return {x: rect.x + rect.width/2, y: rect.y + rect.height/2};
        }""")
        page.mouse.move(r2['x'], r2['y'])  # hover
        page.wait_for_timeout(80)
        hover_snap = page.evaluate("""() => {
          const chip = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'محتوى مضلل');
          const st = getComputedStyle(chip);
          return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
            .map(p => st[p]).join('|');
        }""")
        page.mouse.down()
        page.wait_for_timeout(120)
        active_snap = page.evaluate("""() => {
          const chip = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'محتوى مضلل');
          const st = getComputedStyle(chip);
          return ['backgroundColor','backgroundImage','borderColor','borderWidth','boxShadow','color','opacity','transform','outlineColor','outlineWidth']
            .map(p => st[p]).join('|');
        }""")
        page.mouse.up()
        print('hover :', hover_snap[:110])
        print('active:', active_snap[:110])
        print('HOVER==ACTIVE (root cause!)' if hover_snap == active_snap else 'hover differs from active')
finally:
    server.stop()
