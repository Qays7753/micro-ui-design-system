/**
 * StatusBadge — the 24px status chip (BRIEF 9.3, 23.6).
 *
 * - Height 24, radius 6 (never a full capsule), horizontal padding 8, a Bold
 *   14 icon then the 12/16/600 word with the 4 token gap. The neutral tone
 *   has no icon (23.23).
 * - Colors are the status pairs of 5.2: light bg + dark fg, no border and no
 *   colored dot (23.6).
 * - The word defaults to the copy dictionary for the tone; no Arabic text in
 *   this file (BRIEF 16.20, 24).
 * - A tone change replays the quick cross-fade of 23.14 (content remount).
 */
import { t } from '../../i18n/ar';
import type { ArKey } from '../../i18n/ar';
import { ToneDoneIcon } from '../../icons';
import { ToneInfoIcon } from '../../icons';
import { ToneProblemIcon } from '../../icons';
import { ToneWaitingIcon } from '../../icons';
import type { Tone } from '../../tokens/tokens';
import type { StatusBadgeProps } from './StatusBadge.types';
import './StatusBadge.css';

const TONE_ICONS: Partial<Record<Tone, typeof ToneDoneIcon>> = {
  done: ToneDoneIcon,
  waiting: ToneWaitingIcon,
  problem: ToneProblemIcon,
  info: ToneInfoIcon,
};

// 3ج.1: the tone's default word is a KEY, resolved at render time, so the
// host app's overrideTexts flows into the badge labels too.
const DEFAULT_LABEL_KEYS: Record<Tone, ArKey> = {
  done: 'badge.done',
  waiting: 'badge.waiting',
  problem: 'badge.problem',
  info: 'badge.info',
  neutral: 'badge.neutral',
};

export function StatusBadge({
  tone,
  label,
  className,
  id,
  style,
  ref,
  ...rest
}: StatusBadgeProps) {
  const Icon = tone === 'neutral' ? null : TONE_ICONS[tone];
  const classes = ['mds-status-badge', `mds-status-badge--${tone}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <span ref={ref} id={id} style={style} className={classes} {...rest}>
      {/* key remounts the content on a tone change so the quick cross-fade
          of 23.14 replays (BRIEF: تغيّر حالة الشارة — تلاشٍ متقاطع). */}
      <span className="mds-status-badge-content" key={tone}>
        {Icon ? <Icon size={14} /> : null}
        <span className="mds-status-badge-label">{label ?? t(DEFAULT_LABEL_KEYS[tone])}</span>
      </span>
    </span>
  );
}
