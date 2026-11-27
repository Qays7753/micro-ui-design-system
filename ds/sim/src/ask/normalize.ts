/**
 * Question normalization (§5.3): strip the diacritics and the hamza marks,
 * unify ة/ه and ى/ي — then matching is a containment check (the question
 * must contain every key: «الصناديق» contains «صناديق», «ربحت» contains «ربح»).
 */

/** Normalize Arabic per §5.3: delete the tashkeel and hamzas, unify ة/ه and ى/ي. */
export function normalizeArabic(input: string): string {
  return input
    // التشكيل: fathatan…sukun + shadda + superscript alef (U+0610..U+061A, U+064B..U+065F, U+0670).
    .replace(/[\u{0610}-\u{061A}\u{064B}-\u{065F}\u{0670}]/gu, '')
    // الهمزات: أ إ آ ٱ → ا، ؤ → و، ئ → ي، ء يُحذف.
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ء/g, '')
    // ة → ه (التوحيد باتجاه الهاء).
    .replace(/ة/g, 'ه')
    // ى → ي.
    .replace(/ى/g, 'ي');
}

/** True when the normalized question contains every normalized key word. */
export function matchesKeys(question: string, keys: readonly string[]): boolean {
  const q = normalizeArabic(question);
  return keys.every((k) => q.includes(normalizeArabic(k)));
}
