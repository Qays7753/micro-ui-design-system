/**
 * format-money.ts — BRIEF section 8, complete, pure (no DOM, no Arabic text:
 * all words come from the `texts` argument, bound by callers to
 * src/i18n/ar.ts `getMoneyTexts()`).
 *
 * Rules implemented (BRIEF 8):
 * - Western digits only; thousands separator ',' and decimal '.'.
 * - Signs: in -> '+', out -> '−' (U+2212, the real minus), transfer -> none.
 *   Without a flow, a negative value renders '−'.
 * - Fils: exactly 3 decimals when non-zero, none when zero
 *   («12.500 د» and «2.250 د», but «150 د», never «150.000 د»).
 * - Unit 'د' after the number; the component draws the 4px gap from
 *   --mds-layout-amount-unit-gap, this function returns parts (and a
 *   plain-space `display` assembly for tests and non-React callers).
 * - Debts: «لك 45 د» / «عليك 20 د» (word + amount, no sign).
 * - Hidden: '•••• د' (4 × U+2022), no sign, no fils, debt word kept.
 * - Missing (null/undefined): '—', never a zero.
 * - Screen-reader text in full words: «سالب 35 دينار», «12 دينار و500 فلس»,
 *   «لك 45 دينار», «المبلغ مخفي».
 */

/** Money flow — decides the sign (BRIEF 8; prop renamed from direction per و-1 item 31). */
export type MoneyFlow = 'in' | 'out' | 'transfer';

/** Debt side (BRIEF 8: لك / عليك). */
export type DebtSide = 'forYou' | 'againstYou';

/** Every word formatMoney needs; bound to ar.ts `getMoneyTexts()` by callers. */
export interface MoneyAriaTexts {
  /** Display unit after the number, e.g. د */
  readonly unit: string;
  /** Aria minus word, e.g. سالب */
  readonly minus: string;
  /** Aria currency word, e.g. دينار */
  readonly dinar: string;
  /** Aria fils word, e.g. فلس */
  readonly fils: string;
  /** Aria conjunction, e.g. و */
  readonly and: string;
  /** Debt word: لك */
  readonly forYou: string;
  /** Debt word: عليك */
  readonly againstYou: string;
  /** Aria phrase for hidden amounts, e.g. المبلغ مخفي */
  readonly hidden: string;
  /** Aria phrase for missing values, e.g. القيمة غير متوفرة */
  readonly missing: string;
  /** Four U+2022 bullets for hidden display (BRIEF 23.22) */
  readonly hiddenGlyph: string;
  /** The em dash shown for missing values (BRIEF 8) */
  readonly missingGlyph: string;
}

export type MoneyInput = string | number | null | undefined;

export interface MoneyFormatOptions {
  /**
   * Money flow (و-1 item 31, renamed from direction). When given, the sign follows it and the magnitude is
   * used ('out' + 35 -> '−35'). When omitted, the value's own sign is used.
   */
  readonly flow?: MoneyFlow;
  /** Renders «لك …» / «عليك …» (no +/− sign). */
  readonly debt?: DebtSide;
  /** Hidden amounts: bullets + unit, no sign, no fils (BRIEF 23.22). */
  readonly hidden?: boolean;
  /** Required for display and aria strings. */
  readonly texts: MoneyAriaTexts;
}

/** Formatted money: parts for precise rendering + assembled strings. */
export interface MoneyResult {
  /** True when the input was null/undefined (display is the em dash). */
  readonly missing: boolean;
  /** True when amounts are hidden (display is bullets + unit). */
  readonly hidden: boolean;
  readonly debt: DebtSide | null;
  /** '', '+', or '−' (U+2212). */
  readonly sign: '' | '+' | '−';
  /** Grouped integer digits, e.g. '12,450' ('' when hidden/missing). */
  readonly int: string;
  /** Fraction with dot, e.g. '.125' ('' when zero fils, hidden or missing). */
  readonly frac: string;
  /** The unit word ('' when missing). */
  readonly unit: string;
  /** Debt word ('لك'/'عليك') or ''. */
  readonly debtWord: string;
  /** Full display assembly (plain single spaces). */
  readonly display: string;
  /** Full screen-reader sentence in words. */
  readonly aria: string;
}

const MINUS = '−'; // U+2212 — the real minus sign (BRIEF 8)
const PLUS = '+';
const FRACTION_DIGITS = 3; // Fils are always 3 digits when present (BRIEF 8)

/** Parse a decimal string/number into exact integer fils (BigInt math). */
function parseFils(input: string | number): { negative: boolean; fils: bigint } {
  const raw = String(input).trim();
  const negative = raw.startsWith('-');
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart = '0', fracPart = ''] = unsigned.split('.');
  const intDigits = intPart.replace(/[^0-9]/g, '') || '0';
  const fracDigits = (fracPart + '000').slice(0, FRACTION_DIGITS);
  const fils = BigInt(intDigits) * 10n ** BigInt(FRACTION_DIGITS) + BigInt(fracDigits || '0');
  return { negative, fils };
}

/** Group integer digits with ',' every three (western grouping). */
function groupInteger(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Format the magnitude in fils into [intGrouped, fracWithDot]. */
function formatMagnitude(fils: bigint): { int: string; frac: string } {
  const base = 10n ** BigInt(FRACTION_DIGITS);
  const intFils = fils / base;
  const fracFils = fils % base;
  return {
    int: groupInteger(intFils.toString()),
    frac: fracFils === 0n ? '' : `.${fracFils.toString().padStart(FRACTION_DIGITS, '0')}`,
  };
}

/** Amount in words for the screen reader, e.g. «12 دينار و500 فلس». */
function amountWords(fils: bigint, texts: MoneyAriaTexts): string {
  const base = 10n ** BigInt(FRACTION_DIGITS);
  const intFils = fils / base;
  const fracFils = fils % base;
  let words = `${intFils.toString()} ${texts.dinar}`;
  if (fracFils !== 0n) {
    // «و500 فلس» — the brief's own spacing (BRIEF 23.17 example).
    words += ` ${texts.and}${fracFils.toString()} ${texts.fils}`;
  }
  return words;
}

/**
 * Format one money value. Pure: same input, same output.
 *
 * ```ts
 * formatMoney('-35', { texts: getMoneyTexts() }).display   // '−35 د'
 * formatMoney('12.500', { texts: getMoneyTexts() }).aria    // '12 دينار و500 فلس'
 * formatMoney(45, { debt: 'forYou', texts }).display   // 'لك 45 د'
 * ```
 */
export function formatMoney(input: MoneyInput, opts: MoneyFormatOptions): MoneyResult {
  const texts = opts.texts;
  const missing = input === null || input === undefined;
  if (missing) {
    return {
      missing: true,
      hidden: false,
      debt: opts.debt ?? null,
      sign: '',
      int: '',
      frac: '',
      unit: '',
      debtWord: opts.debt === 'forYou' ? texts.forYou : opts.debt === 'againstYou' ? texts.againstYou : '',
      display: texts.missingGlyph,
      aria: texts.missing,
    };
  }

  if (opts.hidden) {
    const debtWord =
      opts.debt === 'forYou' ? texts.forYou : opts.debt === 'againstYou' ? texts.againstYou : '';
    const display = debtWord ? `${debtWord} ${texts.hiddenGlyph} ${texts.unit}` : `${texts.hiddenGlyph} ${texts.unit}`;
    return {
      missing: false,
      hidden: true,
      debt: opts.debt ?? null,
      sign: '',
      int: '',
      frac: '',
      unit: texts.unit,
      debtWord,
      display,
      aria: texts.hidden,
    };
  }

  const { negative, fils } = parseFils(input);
  const magnitude = formatMagnitude(fils);
  const debtWord =
    opts.debt === 'forYou' ? texts.forYou : opts.debt === 'againstYou' ? texts.againstYou : '';
  const sign: '' | '+' | '−' = debtWord
    ? ''
    : opts.flow === 'in'
      ? PLUS
      : opts.flow === 'out'
        ? MINUS
        : opts.flow === 'transfer'
          ? ''
          : negative
            ? MINUS
            : '';

  const number = `${sign}${magnitude.int}${magnitude.frac}`;
  const display = debtWord
    ? `${debtWord} ${number} ${texts.unit}`
    : `${number} ${texts.unit}`;

  let aria: string;
  if (debtWord) {
    aria = `${debtWord} ${amountWords(fils, texts)}`;
  } else if (sign === MINUS) {
    aria = `${texts.minus} ${amountWords(fils, texts)}`;
  } else {
    aria = amountWords(fils, texts);
  }

  return {
    missing: false,
    hidden: false,
    debt: opts.debt ?? null,
    sign,
    int: magnitude.int,
    frac: magnitude.frac,
    unit: texts.unit,
    debtWord,
    display,
    aria,
  };
}
