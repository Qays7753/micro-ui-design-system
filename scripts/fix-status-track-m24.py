"""StatusTrack: every label box shares one fixed height (m24)."""
import pathlib

p = pathlib.Path('ds/src/components/StatusTrack/StatusTrack.css')
s = p.read_text()

old_step = """.mds-status-track-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mds-space-4);
  min-width: 0;
  flex: 1;
  /* m24: siblings share one height. Every label is exactly ONE line
     (nowrap + ellipsis), so no step grows by word count. */
  block-size: fit-content;
}"""
new_step = """.mds-status-track-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  flex: 1;
  /* m24: siblings share ONE height. Every label box is the SAME fixed
     line height (micro-line); the current's label-strong line rides
     CENTERED inside it, so the step boxes are byte-identical. */
  block-size: fit-content;
}

.mds-status-track-label {
  display: flex;
  align-items: center;
  block-size: var(--mds-type-micro-line);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}"""
assert old_step in s, 'step block not found'
s = s.replace(old_step, new_step)

old_label = """.mds-status-track-label {
  font-family: var(--mds-type-label-strong-font);
  font-size: var(--mds-type-label-strong-size);
  line-height: var(--mds-type-label-strong-line);
  font-weight: var(--mds-type-label-strong-weight);
  color: var(--mds-color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}"""
new_label = """.mds-status-track-label {
  font-family: var(--mds-type-label-strong-font);
  font-size: var(--mds-type-label-strong-size);
  line-height: var(--mds-type-label-strong-line);
  font-weight: var(--mds-type-label-strong-weight);
  color: var(--mds-color-text-primary);
}"""
assert old_label in s, 'label block not found'
s = s.replace(old_label, new_label)

p.write_text(s)
print('labels share one fixed box')
