/**
 * ContactBar — reaching out beyond Micro (BATCH2-SPECS §4.5).
 *
 * - Two equal secondary compact buttons: «اتصل» (PhoneIcon 20 first) on
 *   tel:+962XXXXXXXXX and «واتساب» (WhatsappIcon 20 first) on
 *   https://wa.me/962XXXXXXXXX — the international form derives from the
 *   local 07X number by dropping the leading 0 (ق1), digits stripped.
 * - market: the caption «الشراء والتواصل خارج Micro.» under the row.
 * - density="large" (driver mode): touch-driver tall targets.
 * - locked: LockedDetails-shaped placeholder instead (ق2: no number for
 *   visitors). No phone → the component is not used at all (the app
 *   omits it).
 * - Screen reader: «اتصل بعمر الزعبي» / «واتساب عمر الزعبي، يفتح
 *   تطبيقاً آخر» (§4.5 item 7).
 */
import { t } from '../../i18n/ar';
import { PhoneIcon, WhatsappIcon } from '../../icons';
import type { ContactBarProps } from './ContactBar.types';
import './ContactBar.css';

/** «079 123 4567» → «+962791234567»: strip non-digits, drop the leading
 *  0, prepend the Jordan country code (the brief's only market). */
export function toInternational(local: string): string {
  const digits = local.replace(/[^\d]/g, '').replace(/^0/, '');
  return `+962${digits}`;
}

export function ContactBar({
  value,
  label,
  density = 'regular',
  market = false,
  locked = false,
  className,
  id,
  style,
  ref,
  ...rest
}: ContactBarProps) {
  const intl = toInternational(value);

  if (locked) {
    return (
      <div
        ref={ref}
        id={id}
        style={style}
        className={['mds-contact-bar', 'mds-contact-bar--locked', className].filter(Boolean).join(' ')}
        data-ds-check="contact-bar"
        aria-label={t('contact.marketNote')}
        {...rest}
      >
        <div className="mds-contact-bar-row">
          {/* ق2: the visitor sees placeholders, never a number — the
              LockedDetails shape as two inert button-like blocks. */}
          <span className="mds-contact-bar-locked" aria-hidden="true">•••••</span>
          <span className="mds-contact-bar-locked" aria-hidden="true">•••••</span>
        </div>
        {market ? <span className="mds-contact-bar-note mds-type-caption">{t('contact.marketNote')}</span> : null}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={[
        'mds-contact-bar',
        density === 'large' ? 'mds-contact-bar--large' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-ds-check="contact-bar"
      {...rest}
    >
      <div className="mds-contact-bar-row">
        <a
          className="mds-button mds-button--secondary mds-button--sm mds-contact-bar-link"
          href={`tel:${intl}`}
          aria-label={t('sr.contactCall', { name: label })}
        >
          <span className="mds-contact-bar-icon" aria-hidden="true"><PhoneIcon size={20} /></span>
          {t('contact.call')}
        </a>
        <a
          className="mds-button mds-button--secondary mds-button--sm mds-contact-bar-link"
          href={`https://wa.me/${intl.replace('+', '')}`}
          target="_blank"
          rel="noreferrer"
          aria-label={t('sr.contactWhatsapp', { name: label })}
        >
          <span className="mds-contact-bar-icon" aria-hidden="true"><WhatsappIcon size={20} /></span>
          {t('contact.whatsapp')}
        </a>
      </div>
      {market ? <span className="mds-contact-bar-note mds-type-caption">{t('contact.marketNote')}</span> : null}
    </div>
  );
}
