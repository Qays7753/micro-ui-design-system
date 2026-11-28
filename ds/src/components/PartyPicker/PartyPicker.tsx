/**
 * PartyPicker.tsx — the party picker (BATCH2-SPECS §1.10).
 *
 * - The FIELD rides the shared picker-field anatomy (base.css): a
 *   display-only trigger in the TextField look. After a choice: EntityMark
 *   32 at the start, then 8, then the name `body` (truncated with «…» on
 *   320 — §1.10-6); empty: no text. The clear IconButton rides the row's
 *   END when a value exists (criterion 3: ≥ size.touch-min — the
 *   IconButton's own 48).
 * - The SHEET (92%, detail): the app's title, a SearchField FOCUSED on
 *   open (criterion 2), and a Surface of ObjectRow rows (row-with-mark):
 *   the mark, the name, the second line (a phone, or a debt line — a
 *   Money node hides with the amounts context). The selected row carries
 *   the `selected` icon 20 in brand-anchor at its end. Choosing a row
 *   closes the sheet (§1.10-5).
 * - When the query matches no name EXACTLY, the FIRST row is the add row
 *   «أضف «<النص>» {role} جديداً» with the plus icon in the mark's place,
 *   at row-plain height (criterion 1: no add row on an exact match). Its
 *   press reports the typed name as a new party.
 * - Empty list: EmptyState with no button «العملاء يظهرون هنا. اكتب
 *   اسماً لإضافته.». No results: the add row alone. Loading: three
 *   skeleton rows (§1.10-4).
 * - Screen reader (§1.10-7): the field button «<التسمية>، سلمى
 *   الحوراني» or «<التسمية>، لم يُختر»; the add row «أضف سلمى عميلاً
 *   جديداً» (no quotes).
 * - The role word (عميلاً/مورداً/طرفاً) comes from `mode` — the app
 *   passes it (§1.10-8).
 */
import { useEffect, useRef, useState } from 'react';
import { t } from '../../i18n/ar';
import type { ArKey } from '../../i18n/ar';
import { ClearIcon, PlusIcon, SelectedIcon } from '../../icons';
import { usePress } from '../../lib/use-press';
import { EmptyState } from '../EmptyState/index';
import { Money } from '../Money/index';
import { EntityMark } from '../EntityMark/index';
import { IconButton } from '../IconButton/index';
import { ObjectRow } from '../ObjectRow/index';
import { SearchField } from '../SearchField/index';
import { Sheet } from '../Sheet/index';
import { Skeleton } from '../Skeleton/index';
import type { PartyOption, PartyPickerProps, PartyRole } from './PartyPicker.types';

/** Three row skeletons, one per §1.10-4's loading list. */
const ROW_SKELETONS: readonly number[] = [0, 1, 2];
import './PartyPicker.css';

export function PartyPicker({
  label,
  value,
  items = [],
  mode = 'client',
  loading = false,
  onChange,
  disabled = false,
  state = 'idle',
  className,
  id,
  style,
  ref,
  ...rest
}: PartyPickerProps) {
  const [open, setOpen] = useState(false);
  const classes = [
    'mds-party-field',
    state === 'error' ? 'mds-party-field--error' : '',
    disabled ? 'mds-party-field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const name = value !== undefined
    ? t('party.srName', { label, name: value.label })
    : t('party.srNone', { label });

  return (
    <span ref={ref} id={id} style={style} className={classes} {...rest}>
      <span className="mds-party-field-label mds-type-label">{label}</span>
      <FieldButton
        name={name}
        party={value}
        disabled={disabled}
        error={state === 'error'}
        onOpen={() => setOpen(true)}
        hasValue={value !== undefined}
        onClearValue={() => onChange?.(undefined)}
      />
      {state === 'error' ? (
        <span className="mds-party-field-error mds-type-caption">{t('party.choose')}</span>
      ) : null}
      {open ? (
        <PartySheet
          label={label}
          value={value}
          items={items}
          mode={mode}
          loading={loading}
          onPick={(next) => {
            onChange?.(next);
            setOpen(false);
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </span>
  );
}

/** The display field: the TextField-look trigger with the mark and the
 *  name, and the clear button at the row's end. */
function FieldButton({
  name,
  party,
  disabled,
  error,
  onOpen,
  hasValue,
  onClearValue,
}: {
  name: string;
  party: PartyOption | undefined;
  disabled: boolean;
  error: boolean;
  onOpen: () => void;
  hasValue: boolean;
  onClearValue: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onOpen, disabled });
  const classes = [
    'mds-text-field-input',
    'mds-picker-field-box',
    'mds-party-field-box',
    isPressed ? 'mds-picker-field-box--pressed' : '',
    error ? 'mds-party-field-box--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className="mds-picker-field-row">
      <button
        type="button"
        className={classes}
        aria-label={name}
        disabled={disabled}
        {...pressProps}
      >
        {party ? (
          <>
            <EntityMark size="sm" value={party.label} />
            <span className="mds-party-field-name mds-type-body">{party.label}</span>
          </>
        ) : (
          <span className="mds-party-field-name mds-party-field-name--empty" />
        )}
      </button>
      {hasValue ? (
        <IconButton label={t('sr.clear')} disabled={disabled} onPress={onClearValue}>
          <ClearIcon size={20} />
        </IconButton>
      ) : null}
    </span>
  );
}

/** The 92% sheet: the focused search, the rows, the add row. */
function PartySheet({
  label,
  value,
  items,
  mode,
  loading,
  onPick,
  onDismiss,
}: {
  label: string;
  value: PartyOption | undefined;
  items: readonly PartyOption[];
  mode: PartyRole;
  loading: boolean;
  onPick: (party: PartyOption) => void;
  onDismiss: () => void;
}) {
  const [query, setQuery] = useState('');
  const root = useRef<HTMLDivElement | null>(null);

  /** Criterion 2: the SearchField takes the focus when the sheet opens. */
  useEffect(() => {
    const input = root.current?.querySelector('input');
    input?.focus();
  }, []);

  /** The rows the query keeps — a substring match on the name. */
  const needle = query.trim().toLowerCase();
  const rows = needle
    ? items.filter((item) => item.label.toLowerCase().includes(needle))
    : items;
  /** Criterion 1: an EXACT name match hides the add row. */
  const exact = needle
    && items.some((item) => item.label.trim().toLowerCase() === needle);
  const typed = query.trim();
  const showAdd = typed !== '' && !exact;

  return (
    <Sheet label={label} onDismiss={onDismiss}>
      <div ref={root} className="mds-party-sheet">
        <SearchField
          label={label}
          placeholder={t('search.in', { area: label })}
          value={query}
          onChange={setQuery}
        />
        {loading ? (
          <div className="mds-party-skeletons" aria-hidden="true">
            {ROW_SKELETONS.map((row) => (
              <div className="mds-party-skeleton-row" key={row}>
                <Skeleton variant="mark" />
                <div className="mds-party-skeleton-lines">
                  <Skeleton variant="body" />
                  <Skeleton variant="caption" />
                </div>
              </div>
            ))}
          </div>
        ) : rows.length === 0 && !showAdd ? (
          items.length === 0 ? (
            <EmptyState label={t('party.empty')} />
          ) : null
        ) : (
          <div className="mds-party-rows" role="listbox" aria-label={label}>
            {showAdd ? (
              <AddRow
                name={typed}
                role={mode}
                onPick={() => onPick({ value: typed, label: typed })}
              />
            ) : null}
            {rows.map((item) => (
              <PartyRow
                key={item.value}
                party={item}
                selected={value?.value === item.value}
                onPick={() => onPick(item)}
              />
            ))}
          </div>
        )}
      </div>
    </Sheet>
  );
}

/** One party row: the ObjectRow anatomy — the phone as the second line,
 *  a debt through Money at the end (hidden amounts apply, §1.10-6), and
 *  the selected icon under it when chosen. */
function PartyRow({
  party,
  selected,
  onPick,
}: {
  party: PartyOption;
  selected: boolean;
  onPick: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onPick });
  const classes = [
    'mds-party-row',
    isPressed ? 'mds-party-row--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} role="option" aria-selected={selected}>
      <ObjectRow
        label={party.label}
        caption={party.caption}
        leading={party.label}
        value={party.debt !== undefined ? <Money value={party.debt} debt="forYou" /> : undefined}
        trailing={selected ? <SelectedIcon size={20} className="mds-party-row-selected" /> : undefined}
        onPress={onPick}
        {...pressProps}
      />
    </div>
  );
}

/** The add row: «أضف «<النص>» {role} جديداً» with the plus icon in the
 *  mark's place, at row-plain height. */
function AddRow({
  name,
  role,
  onPick,
}: {
  name: string;
  role: PartyRole;
  onPick: () => void;
}) {
  const { isPressed, pressProps } = usePress({ onPress: onPick });
  const classes = [
    'mds-party-add',
    isPressed ? 'mds-party-add--pressed' : '',
  ]
    .filter(Boolean)
    .join(' ');
  const roleKey: ArKey = role === 'supplier'
    ? 'party.roleSupplier'
    : role === 'party'
      ? 'party.roleParty'
      : 'party.roleClient';
  const visible = t('party.add', { name, role: t(roleKey) });
  const srName = t('party.srAdd', { name, role: t(roleKey) });
  return (
    <button
      type="button"
      className={classes}
      aria-label={srName}
      {...pressProps}
    >
      <span className="mds-party-add-mark" aria-hidden="true">
        <PlusIcon size={20} />
      </span>
      <span className="mds-party-add-text mds-type-body-strong">{visible}</span>
    </button>
  );
}
