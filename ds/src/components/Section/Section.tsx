/**
 * Section — the titled group of surfaces (BRIEF 9.2, 23.24(16)).
 *
 * - Header: `title-section` title, then the count `caption-strong` in
 *   text-secondary 8 away, and at the line's end «الكل» `label-strong` in
 *   brand-text with the forward icon. All three share ONE baseline
 *   (align-items: baseline). The «الكل» is a 48 touch zone.
 * - «الكل» never renders for an empty section (owner decision
 *   2026-11-25): a "see everything" link with nothing to see is noise.
 * - Spacing: header → surface 12 (layout.section-title-to-surface);
 *   section → section 32 (layout.section-to-section) applied by the
 *   consuming screen's vertical rhythm via the --mds-space-block token.
 */
import { usePress } from '../../lib/use-press';
import { ForwardIcon } from '../../icons';
import { t } from '../../i18n/ar';
import type { SectionProps } from './Section.types';
import './Section.css';

export function Section({
  label,
  caption,
  onPress,
  children,
  className,
  id,
  style,
  ref,
  ...rest
}: SectionProps) {
  const empty = children === undefined || children === null;
  const { isPressed, pressProps } = usePress({ onPress: () => onPress?.(), disabled: empty });
  // Owner decision 2026-11-25: no «الكل» for an empty section.
  const showSeeAll = !empty && onPress !== undefined;
  const classes = ['mds-section', className].filter(Boolean).join(' ');

  return (
    <section ref={ref} id={id} style={style} className={classes} {...rest}>
      <header className="mds-section-header">
        <h2 className="mds-section-title mds-type-title-section">{label}</h2>
        {caption !== undefined ? (
          <span className="mds-section-count">{caption}</span>
        ) : null}
        {showSeeAll ? (
          <button
            type="button"
            className={['mds-section-see-all', isPressed ? 'mds-section-see-all--pressed' : '']
              .filter(Boolean)
              .join(' ')}
            // 23.24(16): «الكل» منطقة لمس 48 — the 48 zone is the button's
            // own min-height; exempt from the 48-floor check like every
            // other header control.
            data-ds-exempt=""
            {...pressProps}
          >
            <span className="mds-section-see-all-label">{t('button.all')}</span>
            <ForwardIcon size={16} className="mds-section-see-all-icon" />
          </button>
        ) : null}
      </header>
      {children}
    </section>
  );
}
