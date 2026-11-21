# مواصفة هيكل شاشة الهاتف (Screen) — الجولة الثالثة T3 (N-D5)

الحالة: `draft-for-review`. عقد السلوك الأصلي: أقسام 2/3/8 من `docs/NATIVE-BEHAVIOR.md`.

## الغرض

هيكل شاشة واحدة لتطبيق هاتف: شريط علوي ثابت، محتوى يتمرر وحده، شريط إجراءات سفلي وشريط تنقل سفلي — داخل ارتفاع الشاشة الحقيقي. المرجع الوحيد لشكل شاشة الهاتف في المكتبة؛ كل شاشات مختبر الهاتف مبنية عليه.

## البنية (markup)

```html
<div class="m-screen" data-micro-screen>
  <header class="m-screen__top">…m-appbar…</header>
  <main class="m-screen__content">
    <section class="m-screen__section">…</section>
  </main>
  <footer class="m-screen__actions" data-actions="keyboard-follow">…أزرار…</footer>
  <nav class="m-screen__nav">…m-navbar…</nav>
</div>
```

- `__top` و`__actions` و`__nav` اختيارية؛ `__content` مطلوب.
- `data-actions`: `keyboard-follow` (يرتفع فوق لوحة المفاتيح — شاشات النماذج) أو `keyboard-hide` (يختفي). الافتراضي عند غيابها: `keyboard-hide` إن وُجد `__nav`، وإلا `keyboard-follow`.

## العقود

1. **الارتفاع:** `100dvh` مع بديل `100vh`. لا تمرير للصفحة نفسها؛ التمرير الوحيد داخل `__content` بـ`overscroll-behavior: contain`.
2. **لا تغطية أبدًا:** الأشرطة صفوف grid حقيقية (لا طبقات فوق المحتوى)، و`scroll-padding-bottom` للمحتوى يتبع ارتفاع الأشرطة الفعلي المقيس بـResizeObserver (متغيرات `--m-screen-actions-h` / `--m-screen-nav-h`) فيهبط scrollIntoView لآخر عنصر فوق الأشرطة لا خلفها.
3. **لوحة المفاتيح (N-D10):** عبر `visualViewport` — يضبط `screen.js` متغير `--m-screen-keyboard` وحالة `data-keyboard="true"` فوق عتبة 120px، ويبقي الحقل المركّز ظاهرًا (تمرير `__content` عند الحاجة)، ويرفع شريط `keyboard-follow` أو يخفي `keyboard-hide`. لا اختبار لوحة مفاتيح حقيقية آليًا — المحاكاة في `tools/screen-check.py` تقلّص visualViewport.
4. **Safe areas (NATIVE-BEHAVIOR قسم 8):** `env(safe-area-inset-*)` للحواف الأربع. **المضيف يضبط `viewport-fit=cover`** بدونه ترجع القيم إلى 0 (موثق في README).
5. **RTL أولًا:** الحشوات الأفقية فيزيائية (يسار/يمين) فتعمل مع الاتجاهين.
6. **تكبير الخط حتى 200%:** كل أحجام النص في الشجعة من توكنز `rem` (N-D6)؛ لا قص ولا overflow أفقي (بوابة text-scale-check).
7. **لا يملك** route ولا history ولا بيانات ولا نصوصًا (لا labels.js — موثق في DECISIONS): هيكل تخطيط فقط. نصوص الشريط العلوي/الأزرار من عائلاتها.

## توكنز التخطيط (N-D5 — مشتقة حرفيًا وموثقة في DECISIONS)

| التوكن | القيمة | الاشتقاق |
|---|---|---|
| `--m-screen-inset-inline` | `var(--micro-space-4)` = 16px | هامش الشاشة الأفقي (12px تحت 360px من `--micro-space-3`) |
| `--m-screen-section-gap` | `var(--micro-space-6)` = 24px | المسافة بين الأقسام |
| `--m-screen-section-padding` | `var(--micro-space-4)` = 16px | الحشوة داخل القسم |
| `--m-screen-actions-padding` | `var(--micro-space-4)` = 16px | حشوة شريط الإجراءات |

## دورة الحياة (العقد الموحد)

`init(root?, options?)` يربط كل `[data-micro-screen]` تحت الجذر ويعيد مثيلًا `{ update(), destroy() }`؛ init على شاشة لها مثيل حي يعيد المثيل نفسه ولا يضاعف الربط. `update(root?)` يعيد قياس الأشرطة (بعد تغيير محتوى ديناميكي). `destroy(root?)` يفصل ResizeObserver ومستمعي visualViewport ويزيل الحالة والمتغيرات؛ `getInstance(root?)`. بعد destroy لا مراقب حي ولا مستمع (R4).

## الفحص

`tools/screen-check.py` (بوابة داخل check-all): عند 360×780 و320×780 RTL — المحتوى يتمرر داخليًا والصفحة لا، لا overflow أفقي، آخر عنصر في المحتوى قابل للوصول وغير مغطى، محاكاة لوحة مفاتيح تبقي الحقل المركّز ظاهرًا، safe areas مطبقة بمحاكاة قيم، صفر أخطاء. تغطية العقد في api-lifecycle-check.
