/**
 * normalize-amount — the ADDENDUM §1.3-5 entry normalization. Pure: same
 * input, same output.
 *
 * - Arabic-Indic digits ٠..٩ become 0..9; the Arabic decimal «٫» and the
 *   comma «,» become «.».
 * - No negative sign (the flow rides MovementTypeControl).
 * - At most 3 fraction digits: the FOURTH digit is refused (not stored).
 * - No thousand separators while typing (they render on blur via Money).
 *
 * The Arabic-Indic code points below are ENTRY DATA for parsing (U+0660..U+0669
 * digits, U+066B decimal separator), written as explicit escapes so the
 * source carries code points, not UI copy (ds-copy: copy lives in ar.ts).
 */
const ARABIC_INDIC_ZERO = 0x0660;
const ARABIC_INDIC_NINE = 0x0669;
const ARABIC_DECIMAL_SEPARATOR = 0x066b;

export function normalizeAmount(raw: string): string {
  let out = '';
  let seenDot = false;
  for (const ch of raw) {
    const code = ch.codePointAt(0)!;
    if (code >= ARABIC_INDIC_ZERO && code <= ARABIC_INDIC_NINE) {
      const western = String(code - ARABIC_INDIC_ZERO);
      out = pushDigit(out, western);
      continue;
    }
    if (ch >= '0' && ch <= '9') {
      out = pushDigit(out, ch);
      continue;
    }
    if ((code === ARABIC_DECIMAL_SEPARATOR || ch === '.' || ch === ',') && !seenDot) {
      // a single decimal point; a second one is refused
      if (out === '') out = '0';
      out += '.';
      seenDot = true;
      continue;
    }
    // anything else (spaces, separators, letters, '-') is dropped
  }
  return out;

  function pushDigit(acc: string, digit: string): string {
    if (acc.includes('.')) {
      const fracLen = acc.length - acc.indexOf('.') - 1;
      if (fracLen >= 3) return acc; // ق4: the fourth fraction digit is refused
    }
    // leading zeros collapse to one (the empty start stays empty, ق2)
    if (acc === '0' && digit === '0') return acc;
    if (acc === '0') return digit;
    return acc + digit;
  }
}
