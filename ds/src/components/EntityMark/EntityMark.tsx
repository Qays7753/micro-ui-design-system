/**
 * EntityMark — the rounded entity square (BRIEF 9.3, 23.5, 23.24(4)).
 *
 * - Sizes 32/44/64, radii 10/14/20, one neutral pair: entity-bg behind
 *   entity-fg (7.45:1). No circular avatars, no per-name colors (23.5).
 * - Person/project without a photo: ONE letter — the first letter of the
 *   first name in its isolated form, at entity-initial 14/18/26 (23.5 bans
 *   two letters).
 * - An object (fund, movement, order) takes its type icon as children; the
 *   icon renders at 24 in text-primary on entity-bg (23.5).
 * - tone="done"/"waiting" add the small verification badge of 23.24(4): an
 *   18 white circle with the Fill 14 icon, at the bottom-start corner,
 *   overlapping the mark by the badge-overlap token.
 * - variant="canvas" (1.7 §3.1): the mark riding the canvas (ContextBar's
 *   switcher) takes entity-bg-canvas — the sheet-gray entity-bg would read
 *   1.02:1 against the canvas floor.
 * - The mark is presentational (aria-hidden): the app renders the name
 *   beside it, which is what the screen reader reads.
 */
import { EntityApprovedIcon } from '../../icons';
import { EntityPendingIcon } from '../../icons';
import type { EntityMarkProps } from './EntityMark.types';
import './EntityMark.css';

const BADGE_ICONS = {
  done: EntityApprovedIcon,
  waiting: EntityPendingIcon,
} as const;

/**
 * First letter of the first word, codepoint-safe, isolated by its own
 * element — AFTER dropping a leading «ال» (1.7 ت4: «أول حرف بعد حذف ال من
 * بداية الاسم»): «العمر الزعبي» carries ع, not ا. A name that is nothing
 * BUT the article falls back to its first letter.
 */
function initialOf(value: string): string | undefined {
  let firstWord = value.trim().split(/\s+/)[0];
  // the definite article «ال» as code points (U+0627 U+0644) — parsing data
  // for the letter rule, not UI copy (ds-copy: copy lives in ar.ts).
  const article = String.fromCodePoint(0x0627, 0x0644);
  if (firstWord.length > article.length && firstWord.startsWith(article)) {
    firstWord = firstWord.slice(article.length);
  }
  return firstWord ? Array.from(firstWord)[0] : undefined;
}

export function EntityMark({
  size = 'md',
  variant = 'surface',
  value,
  tone,
  children,
  className,
  id,
  style,
  ref,
  ...rest
}: EntityMarkProps) {
  const BadgeIcon = tone === 'done' || tone === 'waiting' ? BADGE_ICONS[tone] : null;
  const initial = children ? undefined : value ? initialOf(value) : undefined;
  const classes = ['mds-entity-mark', `mds-entity-mark--${size}`,
    variant === 'canvas' ? 'mds-entity-mark--canvas' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} id={id} style={style} className={classes} aria-hidden="true" {...rest}>
      {children ?? (initial ? <span className="mds-entity-mark-initial">{initial}</span> : null)}
      {BadgeIcon ? (
        <span className="mds-entity-mark-badge">
          <BadgeIcon size={14} />
        </span>
      ) : null}
    </span>
  );
}
