/* =========================================================
   Micro UI — الاهتزاز الاختياري (haptics) — الجولة الثالثة T4
   (N-D7). الملف: shared/haptics.js

   العقد: معطل افتراضيًا — المضيف يفعّله بsetHaptics(true).
   عند التفعيل: navigator.vibrate بنبضة قصيرة (10–15ms) في
   الأفعال المحددة فقط (تأكيد فعل حساس، خطأ، اكتمال سحب إغلاق
   ورقة). لا شيء على iOS (لا يتوفر navigator.vibrate — موثق في
   NATIVE-BEHAVIOR قسم 7). يحترم prefers-reduced-motion بعدم
   الاهتزاز. لا وصول إلى window/document في المستوى الأعلى (R-D2).
   ========================================================= */

/* الحالة على globalThis: مدخلات IIFE تحزم كل منها نسخة من هذه الوحدة
   (esbuild لا يدعم splitting في IIFE) — مفتاح واحد مشترك يجعل
   setHaptics من أي مدخل يسري على pulse داخل كل العائلات. */
var STATE_KEY = '__microHapticsEnabled';

function vibrateAvailable() {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/** تفعيل/تعطيل الاهتزاز (يعيد الحالة الفعلية بعد الاستدعاء). */
export function setHaptics(on) {
  var enabled = !!on && vibrateAvailable();
  if (typeof globalThis !== 'undefined') globalThis[STATE_KEY] = enabled;
  return enabled;
}

/** هل الاهتزاز مفعّل الآن؟ (تشخيص/فحص). */
export function isHapticsEnabled() {
  if (typeof globalThis !== 'undefined') return !!globalThis[STATE_KEY] && vibrateAvailable();
  return false;
}

function reducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * نبضة واحدة قصيرة. kind: 'confirm' (تأكيد فعل حساس — 12ms)
 * أو 'error' (خطأ — 15ms) أو 'selection' (اكتمال سحب إغلاق — 10ms).
 * لا اهتزاز معطلًا أو مع تقليل الحركة أو حيث لا يتوفر.
 */
export function pulse(kind) {
  if (!isHapticsEnabled() || reducedMotion()) return false;
  var ms = kind === 'error' ? 15 : kind === 'selection' ? 10 : 12;
  try {
    return navigator.vibrate(ms);
  } catch (error) {
    return false;
  }
}
