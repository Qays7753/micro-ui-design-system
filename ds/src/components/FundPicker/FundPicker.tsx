/**
 * FundPicker.tsx — the fund picker (ADDENDUM §3.5).
 *
 * - The FORM follows the fund count (criterion 1):
 *   - ONE fund: a size.row-plain line with NO picker — the icon 20 at the
 *     start, «من:» (or «إلى:» with `in`) in label text-secondary, the name
 *     body-strong. The press opens the funds sheet (the one row).
 *   - 2-4 funds: the label above, then a single-choice chip row in the
 *     FilterChips look COMPOSED (the mds-filter-chip classes — the shared
 *     chip look), HORIZONTALLY scrolling. Each chip: the icon 16, the
 *     name `label`, the balance Money in caption-strong text-secondary.
 *     A negative balance keeps its «−» with no color (§3.5-2).
 *   - 5+ funds: a TextField-look field (the shared picker anatomy)
 *     showing the chosen fund, opening a sheet of size.row-plain rows:
 *     the icon, the name, the balance Money at the end.
 * - TRANSFER is the host's composition: two pickers, the second marking
 *   the from-fund disabled — the chip reads «هذا صندوق المصدر» and cannot
 *   be chosen (criterion 2).
 * - Saving with no choice (more than one fund): «اختر الصندوق» under the
 *   row (§3.5-4). Transfer with one fund never appears — the app's own
 *   MovementTypeControl disables «تحويل» (§3.5-4).
 * - Motion: the selection rides the chips' own motion.quick; the transfer
 *   switch is the host's fade (§3.5-5).
 * - Screen reader (§3.5-7): a radiogroup; a chip reads «درج الكاش،
 *   الرصيد 271 دينار و250 فلس» — the balance's words through
 *   formatMoney (hidden amounts hide them, §3.5-6).
 * - The chips cap at size.chip-max-width with the name truncating BEFORE
 *   the balance (criterion 3).
 */
import { useState } from 'react';
import { t } from '../../i18n/ar';
import { getMoneyTexts } from '../../i18n/ar';
import { formatMoney } from '../../lib/format-money';
import { useAmountVisibility } from '../../lib/amount-visibility';
import { usePress } from '../../lib/use-press';
import { Money } from '../Money/index';
import { ObjectRow } from '../ObjectRow/index';
import { SelectedIcon } from '../../icons';
import { Sheet } from '../Sheet/index';
import type { FundOption, FundPickerProps } from './FundPicker.types';
import './FundPicker.css';

export function FundPicker({
  label,
  items,
  value,
  direction = 'out',
  onChange,
  disabled = false,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: FundPickerProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const classes = [
    'mds-fund-picker',
    state === 'error' ? 'mds-fund-picker--error' : '',
    disabled ? 'mds-fund-picker--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} id={id} style={style} className={classes} data-count={items.length} {...rest}>
      {items.length === 1 ? (
        <SingleFundRow fund={items[0]} direction={direction} disabled={disabled} onOpen={() => setSheetOpen(true)} />
      ) : items.length <= 4 ? (
        <ChipsForm
          label={label}
          items={items}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      ) : (
        <>
          <FieldForm
            label={label}
            fund={items.find((item) => item.value === value)}
            disabled={disabled}
            onOpen={() => setSheetOpen(true)}
          />
        </>
      )}
      {state === 'error' && items.length > 1 && value === undefined ? (
        <span className="mds-fund-picker-error mds-type-caption">{t('fund.choose')}</span>
      ) : null}
      {sheetOpen ? (
        <FundSheet
          label={label}
          items={items}
          value={value}
          onPick={(next) => {
            onChange?.(next);
            setSheetOpen(false);
          }}
          onDismiss={() => setSheetOpen(false)}
        />
      ) : null}
    </div>
  );
}

/** The ONE-fund row: no picker, the icon, «من:», the name (§3.5-2). */
function SingleFundRow({
  fund,
  direction,
  disabled,
  onOpen,
}: {
  fund: FundOption;
  direction: 'in' | 'out' | 'transfer';
  disabled: boolean;
  onOpen: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onOpen, disabled });
  const classes = [
    'mds-fund-single',
    isPressed ? 'mds-fund-single--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={classes} disabled={disabled} {...pressProps}>
      <span className="mds-fund-single-icon" aria-hidden="true">{fund.leading}</span>
      <span className="mds-fund-single-prefix mds-type-label">{t(direction === 'in' ? 'fund.to' : 'fund.from')}</span>
      <span className="mds-fund-single-name mds-type-body-strong">{fund.label}</span>
    </button>
  );
}

/** The 2-4 form: the label above the scrolling single-choice chips. */
function ChipsForm({
  label,
  items,
  value,
  disabled,
  onChange,
}: {
  label: string;
  items: readonly FundOption[];
  value: string | undefined;
  disabled: boolean;
  onChange?: (value: string) => void;
}) {
  const { hidden } = useAmountVisibility();
  return (
    <div className="mds-fund-chips-form">
      <span className="mds-fund-chips-label mds-type-label">{label}</span>
      <div className="mds-fund-chips" role="radiogroup" aria-label={label}>
        {items.map((fund) => (
          <FundChip
            key={fund.value}
            fund={fund}
            selected={fund.value === value}
            hidden={hidden}
            disabled={disabled}
            onChange={() => onChange?.(fund.value)}
          />
        ))}
      </div>
    </div>
  );
}

/** One chip: the FilterChips look composed — the icon 16, the name, the
 *  balance Money in caption-strong. */
function FundChip({
  fund,
  selected,
  hidden,
  disabled,
  onChange,
}: {
  fund: FundOption;
  selected: boolean;
  hidden: boolean;
  disabled: boolean;
  onChange: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onChange, disabled: disabled || fund.disabled });
  const classes = [
    'mds-filter-chip',
    'mds-fund-chip',
    selected ? 'mds-filter-chip--selected' : '',
    isPressed ? 'mds-filter-chip--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');
  /** The accessible name: «درج الكاش، الرصيد 271 دينار و250 فلس» — the
   *  balance's words (hidden amounts hide them, §3.5-6); a disabled
   *  transfer chip appends «هذا صندوق المصدر» (§3.5-2). */
  let name = fund.label;
  if (fund.balance !== undefined) {
    const balance = formatMoney(fund.balance, { hidden, texts: getMoneyTexts() });
    name = t('fund.srChip', { name: name, balance: balance.aria });
  }
  if (fund.disabled) {
    name = t('fund.srChipDisabled', { name });
  }
  return (
    <button
      type="button"
      role="radio"
      className={classes}
      aria-checked={selected}
      aria-label={name}
      disabled={disabled || fund.disabled}
      {...pressProps}
    >
      <span className="mds-fund-chip-icon" aria-hidden="true">{fund.leading}</span>
      <span className="mds-filter-chip-label mds-fund-chip-name">{fund.label}</span>
      {fund.balance !== undefined ? (
        <span className="mds-fund-chip-balance">
          <Money value={fund.balance} />
        </span>
      ) : null}
    </button>
  );
}

/** The 5+ form's field: the shared picker anatomy with the fund's icon
 *  and name. */
function FieldForm({
  label,
  fund,
  disabled,
  onOpen,
}: {
  label: string;
  fund: FundOption | undefined;
  disabled: boolean;
  onOpen: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onOpen, disabled });
  const classes = [
    'mds-text-field-input',
    'mds-picker-field-box',
    isPressed ? 'mds-picker-field-box--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span className="mds-fund-field">
      <span className="mds-fund-field-label mds-type-label">{label}</span>
      <span className="mds-picker-field-row">
        <button type="button" className={classes} aria-label={label} disabled={disabled} {...pressProps}>
          {fund ? (
            <>
              <span className="mds-fund-field-icon" aria-hidden="true">{fund.leading}</span>
              <span className="mds-fund-field-name mds-type-body">{fund.label}</span>
            </>
          ) : (
            <span className="mds-fund-field-name mds-fund-field-name--empty" />
          )}
        </button>
      </span>
    </span>
  );
}

/** The funds sheet: row-plain rows — the icon, the name, the balance
 *  Money at the end (§3.5-2); the selected row carries the check. */
function FundSheet({
  label,
  items,
  value,
  onPick,
  onDismiss,
}: {
  label: string;
  items: readonly FundOption[];
  value: string | undefined;
  onPick: (value: string) => void;
  onDismiss: () => void;
}) {
  return (
    <Sheet label={label} onDismiss={onDismiss}>
      <div className="mds-fund-sheet-rows" role="listbox" aria-label={label}>
        {items.map((fund) => {
          const disabled = fund.disabled;
          return (
            <ObjectRow
              key={fund.value}
              label={fund.label}
              leading={fund.leading}
              value={fund.balance !== undefined ? <Money value={fund.balance} /> : undefined}
              trailing={fund.value === value ? <SelectedIcon size={20} className="mds-fund-row-selected" /> : undefined}
              disabled={disabled}
              onPress={disabled ? undefined : () => onPick(fund.value)}
            />
          );
        })}
      </div>
    </Sheet>
  );
}
