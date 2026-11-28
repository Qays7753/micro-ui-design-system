/**
 * motion/useOpenedMark.ts — ح04: الصف الذي فُتحت ورقته يبقى معلَّمًا
 * تحتها، والخلفية المضغوطة تخرج بتلاشٍ 600 ميكرو **بدءًا من onClosed**
 * (أي بعد حركة إغلاق الورقة نفسها).
 *
 * يعيد دالة تُعطى معرّف ورقة الصف فترجم حالته إلى صفات البيانات:
 *  - ورقة مفتوحة: `{ 'data-sim-opened': 'true' }` — الخلفية ثابتة بلا
 *    انتقال (الدخول فوري كما في ح03).
 *  - أثناء حركة إغلاق الورقة: يبقى 'true' (العلامة لا تزال).
 *  - بعد الإغلاق (onClosed): `{ 'data-sim-opened': 'fade' }` — القاعدة
 *    في motion.css تنقل الخلفية إلى شفافة/سطح بانتقال 600 ميكرو.
 *
 * عند النقل: العلامة تصير خاصية `opened` على عناصر المكتبة (تعارض 5)
 * ويُحذف هذا الجسر.
 */

import { useEffect, useRef, useState } from 'react';
import { MOTION } from './tokens';

export type OpenedMark = 'true' | 'fade' | undefined;

export interface OpenedMarkProps {
  'data-sim-opened'?: OpenedMark;
}

export function useOpenedMark(openSheetId: string | null) {
  const [fading, setFading] = useState<string | null>(null);
  const lastOpenRef = useRef<string | null>(null);

  useEffect(() => {
    if (openSheetId !== null) {
      lastOpenRef.current = openSheetId;
      return undefined;
    }
    const closed = lastOpenRef.current;
    if (!closed) return undefined;
    // حركة إغلاق الورقة (exit.lg 250) تجري أولًا؛ ثم يبدأ تلاشٍ العلامة.
    const t = window.setTimeout(() => setFading(closed), MOTION.exit.lg);
    return () => window.clearTimeout(t);
  }, [openSheetId]);

  // ما دامت ورقة مفتوحة فلا تلاشي ساريًا — مشتق لا حالة (بلا setState في effect).
  const effectiveFading = openSheetId !== null ? null : fading;

  /** صفات العلامة لصف فُتحت ورقة `sheetId`. */
  return function mark(sheetId: string): OpenedMarkProps {
    if (openSheetId === sheetId) return { 'data-sim-opened': 'true' };
    if (effectiveFading === sheetId) return { 'data-sim-opened': 'fade' };
    // أثناء حركة إغلاق الورقة (قبل onClosed) تبقى العلامة 'true'.
    if (openSheetId === null && lastOpenRef.current === sheetId) return { 'data-sim-opened': 'true' };
    return {};
  };
}
