# Micro — المقارنة العددية

HTML/CSS/JavaScript أصلي. لا إطار أو مكتبة رسوم. شغّل المثال من جذر المستودع:

```sh
python3 -m http.server 8080
```

افتح `/components/metric-comparison/example-usage.html`.

## API

- دوائر بالبيانات نفسها: `[data-metric-circles][data-layout="separated"]` أو `[data-metric-circles][data-layout="overlap"]` + `ul[data-metric-source]`, `ol[data-metric-items]` و`[data-metric-fallback]`.
- قيمة رئيسية/أشرطة: `[data-main-comparison]` + `[data-bar-source]` و`[data-bar-items]`. لإدراج التركيب المدمج في بطاقة استخدم `.m-main-metric--compact`.
- التهيئة: `MicroMetricComparison.init(root)`؛ إعادة التصيير بعد تحديث محتوى المصدر: `MicroMetricComparison.render(root)`.
- راجع `specification.md` للمقياس التكيفي، حالات البيانات، والتحقق من الوحدة/الفترة والحد المعلن.

## التعديل

المحتوى والقيم والوحدات والألوان عبر HTML ومفاتيح الفئات `a–e`؛ أبعاد/ألوان عناصر الشكل عبر التوكنات في `metric-comparison.css`؛ السلوك والتحقق والرسم DOM/CSS عبر `metric-comparison.js`. لا تعديل على tokens المشتركة، ولا إدخال قيم الأعمال في JavaScript.