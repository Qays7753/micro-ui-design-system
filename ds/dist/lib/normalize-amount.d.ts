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
export declare function normalizeAmount(raw: string): string;
