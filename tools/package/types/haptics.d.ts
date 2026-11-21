/* @micro/ui/haptics — الاهتزاز الاختياري (الجولة الثالثة T4/N-D7).
   المصدر: shared/haptics.js. معطل افتراضيًا؛ المضيف يفعّله بsetHaptics(true).
   لا شيء على iOS (لا navigator.vibrate) ويُهمل مع prefers-reduced-motion.
   العقد: docs/NATIVE-BEHAVIOR.md قسم 7. */

export function setHaptics(on: boolean): boolean;
export function isHapticsEnabled(): boolean;
export function pulse(kind?: 'confirm' | 'error' | 'selection'): boolean;
