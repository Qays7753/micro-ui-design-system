/**
 * plural.ts — Arabic pluralisation (plan D9, BRIEF 24.8).
 *
 *   0           «لا طلبات»          (zero)
 *   1           «طلب واحد»          (one)
 *   2           «طلتان»            (two)
 *   3–10        «3 طلبات»           (few — number prepended)
 *   11+         «11 طلب»            (many/other — singular, no tanwin)
 *
 * Implemented with Intl.PluralRules('ar'); the 'many' and 'other' categories
 * both take the numeric singular form (BRIEF 24.8 [توصية: بلا تنوين]).
 */

export interface PluralForms {
  /** 0 — e.g. «لا طلبات» */
  readonly zero: string;
  /** 1 — e.g. «طلب واحد» */
  readonly one: string;
  /** 2 — e.g. «طلتان» */
  readonly two: string;
  /** 3–10 — the counted noun only; the number is prepended: «3 طلبات» */
  readonly few: string;
  /** 11+ (and 100+) — the counted noun only; the number is prepended: «11 طلب» */
  readonly many: string;
}

/** Plural rules for Arabic, created once. */
const rules = new Intl.PluralRules('ar');

/** Build the counted phrase for `n` with the given forms. */
export function pluralAr(n: number, forms: PluralForms): string {
  const category = rules.select(n);
  switch (category) {
    case 'zero':
      return forms.zero;
    case 'one':
      return forms.one;
    case 'two':
      return forms.two;
    case 'few':
      return `${n} ${forms.few}`;
    case 'many':
      return `${n} ${forms.many}`;
    default:
      // 'other' (100 and above in Arabic) — numeric singular, like 'many'.
      return `${n} ${forms.many}`;
  }
}
