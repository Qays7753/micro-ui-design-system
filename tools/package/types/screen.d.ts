/* @micro/ui/screen — أنواع مدخل هيكل الشاشة (الجولة الثالثة T3، مكتوبة يدويًا).
   المصدر: components/screen/screen.js. هيكل تخطيط فقط: لا نصوص (لا labels.js
   ولا setLabels — موثق في DECISIONS) ولا route ولا history ولا بيانات.
   عقد السلوك: docs/NATIVE-BEHAVIOR.md أقسام 2/3/8. */

export interface ScreenInstance {
  root: Element;
  /** إعادة قياس ارتفاعات الأشرطة بعد تغيير محتوى ديناميكي. */
  update(): void;
  destroy(): void;
}

export function init(root?: Element | Document): ScreenInstance;
export function update(root?: Element | Document): void;
export function destroy(root?: Element | Document): void;
export function getInstance(root?: Element | Document): ScreenInstance | null;
