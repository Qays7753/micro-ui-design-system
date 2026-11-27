"""StatusTrack: fixed dot-row so the current dot grows inward (m24)."""
import pathlib

p = pathlib.Path('ds/src/components/StatusTrack/StatusTrack.css')
s = p.read_text()

old = """.mds-status-track-dot {
  width: var(--mds-size-dot-event);
  height: var(--mds-size-dot-event);
  border-radius: var(--mds-radius-full);
  background-color: var(--mds-color-surface-track);
  flex-shrink: 0;
}"""
new = """.mds-status-track-dot-row {
  /* m24: every step's dot row is the SAME fixed height; the current's
     bigger dot is CENTERED inside it, never growing the step box. */
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: var(--mds-size-dot-attention);
  flex-shrink: 0;
}

.mds-status-track-dot {
  width: var(--mds-size-dot-event);
  height: var(--mds-size-dot-event);
  border-radius: var(--mds-radius-full);
  background-color: var(--mds-color-surface-track);
  flex-shrink: 0;
}"""
assert old in s, 'dot block not found'
s = s.replace(old, new)
p.write_text(s)

p2 = pathlib.Path('ds/src/components/StatusTrack/StatusTrack.tsx')
s2 = p2.read_text()
old2 = """              <span className="mds-status-track-dot" />
              <span className="mds-status-track-label">{step.label}</span>"""
new2 = """              <span className="mds-status-track-dot-row">
                <span className="mds-status-track-dot" />
              </span>
              <span className="mds-status-track-label">{step.label}</span>"""
assert old2 in s2, 'dot markup not found'
s2 = s2.replace(old2, new2)
p2.write_text(s2)
print('dot row wrapper added')
