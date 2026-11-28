/**
 * ConfirmSheet — the destructive-confirm sheet (BRIEF 9.3, 23.24).
 *
 * - A Sheet at heart (23.11 chrome: handle, canvas, elevation) with the
 *   ConfirmSheet composition ONLY: centered danger icon (WarningCircle
 *   24) + centered title 22/30/600 + centered result sentence + TWO
 *   buttons — the filled red destructive action and «رجوع».
 * - role="alertdialog" with initial focus on «رجوع» (1284): destructive
 *   actions must never be the default focus.
 * - No drag-to-confirm, no fields, no lists (23.24).
 */
import { useEffect, useRef } from 'react';
import { DangerIcon } from '../../icons';
import { Button } from '../Button/index';
import { Sheet } from '../Sheet/index';
import { t } from '../../i18n/ar';
import type { ConfirmSheetProps } from './ConfirmSheet.types';
import './ConfirmSheet.css';

export function ConfirmSheet({
  label,
  caption,
  value,
  onPress,
  onDismiss,
  className,
  id,
  style,
  ref,
  ...rest
}: ConfirmSheetProps) {
  const backRef = useRef<HTMLButtonElement | null>(null);

  // 1284: opening a ConfirmSheet focuses «رجوع» — never the destructive
  // button.
  useEffect(() => {
    backRef.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={['mds-confirm-sheet', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Sheet
        label={label}
        onDismiss={onDismiss}
        className="mds-confirm-sheet__sheet"
        role="alertdialog"
        data-ds-check="confirm-sheet"
      >
        <div className="mds-confirm-sheet-head">
          <span className="mds-confirm-sheet-icon">
            <DangerIcon />
          </span>
          <h2 className="mds-confirm-sheet-title mds-type-title-section">{label}</h2>
          <p className="mds-confirm-sheet-sentence">{caption}</p>
        </div>
        <div className="mds-confirm-sheet-actions">
          <Button
            ref={backRef as never}
            variant="secondary"
            className="mds-confirm-sheet-back"
            onPress={onDismiss}
          >
            {t('button.back')}
          </Button>
          <Button variant="danger" className="mds-confirm-sheet-confirm" onPress={onPress}>
            {value}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
