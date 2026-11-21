/* @micro/ui/back — ربط زر الرجوع بالطبقات المفتوحة (الجولة الثالثة T4/N-D8).
   المصدر: shared/back.js. وحدة اختيارية: المكتبة لا تكتب في السجل تلقائيًا؛
   استدعِ bindBackToLayers() في بدء التطبيق إن أردت أن يغلق زر الرجوع
   الطبقة العليا أولًا ويعيد التركيز لفاتحها. العقد الكامل:
   docs/NATIVE-BEHAVIOR.md قسم 4. */

export interface BackBinding {
  /** عدد الطبقات المسجلة المفتوحة (تشخيص/فحص). */
  openCount(): number;
  /** فك الربط الكامل — لا يمس السجل ولا الطبقات المفتوحة. */
  destroy(): void;
}

export function bindBackToLayers(options?: Record<string, never>): BackBinding;
