/**
 * motion/reducedSim.ts — «تقليل الحركة» في المحاكاة يحاكي إعداد الهاتف
 * (PLAN-MOTION: مفاتيح التجربة). الملحق يجعل المزوّد يقرأ
 * `prefers-reduced-motion` بنفسه — فالمحاكاة تعيد توجيه هذا الاستعلام
 * إلى استجابة مصطنعة تُبدَّل من لوحة المحاكاة ومختبرها، وكل ما سواه
 * يمر إلى matchMedia الحقيقي. تُركَّب مرة واحدة عند الإقلاع (main.tsx)
 * قبل أول mount، فيلتقطها المزوّد، والتبديل يطلق حدث change على
 * المستمعين أنفسهم فلا إعادة تركيب.
 */

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

interface SyntheticMql {
  matches: boolean;
  media: string;
  onchange: ((e: MediaQueryListEvent) => void) | null;
  addEventListener: (type: string, cb: (e: MediaQueryListEvent) => void) => void;
  removeEventListener: (type: string, cb: (e: MediaQueryListEvent) => void) => void;
  addListener: (cb: (e: MediaQueryListEvent) => void) => void;
  removeListener: (cb: (e: MediaQueryListEvent) => void) => void;
  dispatchEvent: () => boolean;
}

let installed = false;
let syntheticMatches = false;
const changeListeners = new Set<(e: MediaQueryListEvent) => void>();
let originalMatchMedia: ((q: string) => MediaQueryList) | null = null;

/** تُركَّب مرة واحدة قبل أول رسم. */
export function installReducedSim(): void {
  if (installed || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
  installed = true;
  originalMatchMedia = window.matchMedia.bind(window);
  const mql: SyntheticMql = {
    get matches() {
      return syntheticMatches;
    },
    media: REDUCE_QUERY,
    onchange: null,
    addEventListener(type, cb) {
      if (type === 'change') changeListeners.add(cb);
    },
    removeEventListener(type, cb) {
      if (type === 'change') changeListeners.delete(cb);
    },
    addListener(cb) {
      changeListeners.add(cb);
    },
    removeListener(cb) {
      changeListeners.delete(cb);
    },
    dispatchEvent: () => false,
  };
  window.matchMedia = ((q: string) =>
    q === REDUCE_QUERY ? (mql as unknown as MediaQueryList) : originalMatchMedia!(q)) as typeof window.matchMedia;
}

/** يبدّل «إعداد الهاتف» المحاكى ويشعر مستمعيه. */
export function setSimulatedReduced(on: boolean): void {
  if (!installed || syntheticMatches === on) return;
  syntheticMatches = on;
  const event = { matches: on, media: REDUCE_QUERY } as MediaQueryListEvent;
  for (const cb of Array.from(changeListeners)) cb(event);
}

export function simulatedReduced(): boolean {
  return syntheticMatches;
}
