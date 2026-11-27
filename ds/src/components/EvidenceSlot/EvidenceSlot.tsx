/**
 * EvidenceSlot — the delivery proof (BATCH2-SPECS §4.6).
 *
 * - ONE kind shows (ق1): photo = a 4:3 tile (r-md, well) with the camera
 *   prompt «التقط صورة» before capture, the photo with a redo control
 *   after; code = a numeric TextField «الرمز من المستلم» with tabular
 *   digits and the app-passed error under it; owner = the «المالك يؤكد
 *   التسليم.» sentence with the secondary «أكّد التسليم» button.
 * - readOnly (at the owner): the photo alone, or «أُدخل الرمز ✓».
 * - ق2: the 4:3 aspect-ratio is reserved BEFORE the image loads.
 * - Screen reader: «إثبات التسليم، صورة، لم تُلتقط بعد» (§4.6 item 7).
 */
import { ar } from '../../i18n/ar';
import { CameraIcon, MoreIcon } from '../../icons';
import { Skeleton } from '../Skeleton/index';
import { TextField } from '../TextField/index';
import type { EvidenceSlotProps } from './EvidenceSlot.types';
import './EvidenceSlot.css';

export function EvidenceSlot({
  variant,
  value,
  onChange,
  error,
  readOnly = false,
  density = 'regular',
  action,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: EvidenceSlotProps) {
  const loading = state === 'loading';
  const hasPhoto = Boolean(value);

  const ariaText = [
    ar['evidence.title'].text,
    variant === 'photo' ? (hasPhoto ? ar['evidence.photoTaken'].text : ar['evidence.photoMissing'].text) : '',
    variant === 'code' ? (value ? ar['evidence.entered'].text : ar['evidence.codeLabel'].text) : '',
    variant === 'owner' ? ar['evidence.ownerSentence'].text : '',
  ].filter(Boolean).join(ar['sr.listSeparator'].text);

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      role="group"
      aria-label={ariaText}
      className={[
        'mds-evidence-slot',
        density === 'large' ? 'mds-evidence-slot--large' : '',
        loading ? 'mds-evidence-slot--loading' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-ds-check="evidence-slot"
      {...rest}
    >
      <span className="mds-evidence-slot-title">{ar['evidence.title'].text}</span>
      {loading ? (
        <span className="mds-evidence-slot-tile" aria-hidden="true">
          <Skeleton variant="body" />
        </span>
      ) : variant === 'photo' ? (
        hasPhoto ? (
          <span className="mds-evidence-slot-tile" style={{ cursor: 'default' }}>
            {/* The app's uploaded photo URL fills the reserved 4:3. */}
            <img className="mds-evidence-slot-photo" src={value} alt={ar['evidence.photoTaken'].text} />
            {!readOnly ? (
              <button
                type="button"
                className="mds-evidence-slot-redo"
                aria-label={ar['evidence.retake'].text}
                onClick={() => onChange?.('')}
              >
                <MoreIcon size={20} />
              </button>
            ) : null}
          </span>
        ) : readOnly ? (
          <span className="mds-evidence-slot-tile" style={{ cursor: 'default' }}>
            <span className="mds-evidence-slot-done mds-type-label-strong">{ar['evidence.photoMissing'].text}</span>
          </span>
        ) : (
          <button
            type="button"
            className="mds-evidence-slot-tile"
            aria-label={ar['evidence.takePhoto'].text}
            onClick={() => onChange?.('pending')}
          >
            <span aria-hidden="true"><CameraIcon size={24} /></span>
            <span>{ar['evidence.takePhoto'].text}</span>
          </button>
        )
      ) : variant === 'code' ? (
        readOnly ? (
          <span className="mds-evidence-slot-done mds-type-label-strong">{value ? ar['evidence.entered'].text : '—'}</span>
        ) : (
          <TextField
            label={ar['evidence.codeLabel'].text}
            value={value ?? ''}
            inputMode="numeric"
            state={error ? 'error' : 'idle'}
            caption={error}
            onChange={(v) => onChange?.(v)}
          />
        )
      ) : (
        <>
          <span className="mds-evidence-slot-owner mds-type-body">{ar['evidence.ownerSentence'].text}</span>
          {!readOnly && action ? <span className="mds-evidence-slot-action">{action}</span> : null}
        </>
      )}
    </div>
  );
}
