/**
 * SearchField — the section search (ADDENDUM §1.1, BRIEF 9.1).
 *
 * - Height size.search (52), r-full, surface background, a border.field
 *   hairline in border-field; the search icon 20 in text-secondary stands
 *   layout.chip-padding from the START, then layout.button-icon-gap, then
 *   the input (body 16/26, ≥16 against iOS zoom, 27.5); at the END the
 *   clear IconButton (clear icon 20, text-secondary) appears ONLY while
 *   the field holds text (ق2), 4 from the END edge (§1.1-2), named
 *   «امسح البحث».
 * - Focus: the TextField treatment — focus border in focus-ring + the halo
 *   (§1.1-4). Disabled: the hairline and the text in disabled-fg.
 * - role=searchbox named by label; the placeholder is «ابحث في <القسم>»
 *   and label mirrors it; enterkeyhint=search (§1.1-8, the 23.24(10)
 *   exception — no visible field label).
 * - Motion: the clear button fades motion.quick (§1.1-5).
 */
import { SearchIcon, ClearIcon } from '../../icons';
import { usePress } from '../../lib/use-press';
import { t } from '../../i18n/ar';
import type { SearchFieldProps } from './SearchField.types';
import './SearchField.css';

export function SearchField({
  label,
  placeholder,
  value = '',
  onChange,
  disabled = false,
  className,
  id,
  style,
  ref,
  ...rest
}: SearchFieldProps) {
  const hasText = value.length > 0;
  const classes = [
    'mds-search-field',
    disabled ? 'mds-search-field--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} id={id} style={style} className={classes} {...rest}>
      <SearchIcon size={20} />
      <input
        type="search"
        className="mds-search-field-input"
        role="searchbox"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        enterKeyHint="search"
        onChange={(e) => onChange?.(e.target.value)}
      />
      {hasText ? (
        <IconButtonClear
          onClear={() => {
            onChange?.('');
          }}
        />
      ) : null}
    </div>
  );
}

function IconButtonClear({ onClear }: { onClear: () => void }) {
  const { isPressed, pressProps } = usePress({ onPress: onClear });
  return (
    <button
      type="button"
      className={['mds-search-field-clear', isPressed ? 'mds-search-field-clear--pressed' : '']
        .filter(Boolean)
        .join(' ')}
      data-ds-exempt=""
      aria-label={t('sr.clearSearch')}
      {...pressProps}
    >
      <ClearIcon size={20} />
    </button>
  );
}
