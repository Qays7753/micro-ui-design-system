/**
 * ReportSheet — reporting a listing (BATCH2-SPECS §5.5).
 *
 * - Sheet 92%: the title, the reasons surface (radiogroup — one reason
 *   only, ق1), the optional details TextArea, and the ActionBar's
 *   primary send + SaveState.
 * - Sending with no reason: «اختر سبب البلاغ» under the surface; on
 *   success the sheet closes and the app's Toast says «أُرسل البلاغ».
 */
import { useState } from 'react';
import { ar } from '../../i18n/ar';
import { SelectedIcon } from '../../icons';
import { ActionBar } from '../ActionBar/index';
import { Sheet } from '../Sheet/index';
import { TextArea } from '../TextArea/index';
import type { ReportSheetProps } from './ReportSheet.types';
import './ReportSheet.css';

export function ReportSheet({
  items,
  value,
  caption,
  onDismiss,
  onChange,
  save,
  className,
  id,
  style,
  ref,
  ...rest
}: ReportSheetProps) {
  const [chosen, setChosen] = useState(value ?? -1);
  const [details, setDetails] = useState(caption ?? '');
  const [error, setError] = useState(false);

  const send = () => {
    if (chosen < 0) {
      setError(true);
      return;
    }
    onChange?.(chosen, details);
  };

  return (
    <Sheet
      label={ar['report.title'].text}
      onDismiss={onDismiss}
      className={className}
      id={id}
      style={style}
      ref={ref}
      data-ds-check="report-sheet"
      {...rest}
    >
      <div className="mds-report-sheet-body">
        <div
          className="mds-report-sheet-reasons"
          role="radiogroup"
          aria-label={ar['report.title'].text}
        >
          {items.map((reason, i) => (
            <button
              key={reason}
              type="button"
              role="radio"
              aria-checked={chosen === i}
              className="mds-report-sheet-reason"
              onClick={() => { setChosen(i); setError(false); }}
            >
              <span className="mds-report-sheet-reason-label mds-type-body">{reason}</span>
              {chosen === i ? (
                <span className="mds-report-sheet-reason-icon" aria-hidden="true">
                  <SelectedIcon size={20} />
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {error ? (
          <span className="mds-report-sheet-error mds-type-caption" role="alert">
            {ar['report.chooseReason'].text}
          </span>
        ) : null}
        <TextArea
          label={ar['report.details'].text}
          caption={ar['report.detailsOptional'].text}
          value={details}
          onChange={setDetails}
        />
        {save}
        <ActionBar
          label={ar['report.send'].text}
          onPress={send}
        />
      </div>
    </Sheet>
  );
}
