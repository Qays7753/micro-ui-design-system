/**
 * normalize-amount — the ADDENDUM §1.3-5 entry normalization. Pure: same
 * input, same output.
 *
 * - Arabic-Indic digits ٠..٩ become 0..9; the Arabic decimal «٫» and the
 *   comma «,» become «.».
 * - No negative sign (the flow rides MovementTypeControl).
 * - At most 3 fraction digits: the FOURTH digit is refused (not stored).
 * - No thousand separators while typing (they render on blur via Money).
 */
export function normalizeAmount(raw: string): string {
  let out = '';
  let seenDot = false;
  for (const ch of raw) {
    if (ch >= '٠' && ch <= '٩') {
      const western = String(ch.charCodeAt(0) - '٠'.charCodeAt(0));
      out = pushDigit(out, western);
      continue;
    }
    if (ch >= '0' && ch <= '9') {
      out = pushDigit(out, ch);
      continue;
    }
    if ((ch === '٫' || ch === '.' || ch === ',') && !seenDot) {
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
