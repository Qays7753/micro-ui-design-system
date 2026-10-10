# فهرس مكونات Micro UI

هذا الفهرس يصف مصدر UI الحالي فقط. لا يمثل خريطة UX أو شاشات منتج أو شهادة إنتاجية.

## قاعدة القراءة

لكل عائلة:

1. اقرأ `specification.md`.
2. راجع ملفات CSS/JS داخل `components/<family>/`.
3. افتح المعاينة المقابلة داخل `previews/`.
4. استخدم الـshowcase الأخير للتحقق من التركيب المشترك.

## العائلات

| العائلة | المصدر | المعاينة | الحالة |
|---|---|---|---|
| Buttons | `components/buttons/` | `previews/buttons/` | STABLE UI |
| Fields | `components/fields/` | `previews/fields/` | STABLE UI |
| Selection | `components/selection/` | `previews/selection/` | STABLE UI |
| Organization | `components/organization/` | `previews/organization/` | STABLE UI |
| Data | `components/data/` | `previews/data/` | STABLE UI |
| Messages | `components/messages/` | `previews/messages/` | STABLE UI |
| Navigation | `components/navigation/` | `previews/navigation/` | STABLE UI |
| Surfaces | `components/surfaces/` | `previews/surfaces/` | STABLE UI |
| Info strip | `components/info-strip/` | `previews/info-strip/` | STABLE UI؛ peek اختياري |
| Metric comparison | `components/metric-comparison/` | `previews/concepts/` | STABLE UI وفق المواصفة |
| Account settings | `components/account-settings/` | `previews/concepts/` | STABLE UI دون حفظ فعلي |
| Access gateway | `components/access-gateway/` | `previews/concepts/` | STABLE UI دون مصادقة فعلية |
| Order schedule | `components/order-schedule/` | المثال داخل المكون | DRAFT FOR REVIEW |
| Carousel | `components/carousel/` | `previews/carousel/` | DRAFT FOR REVIEW |
| Packed circle | `components/data/packed-circle.*` | `previews/concepts/` | PROPOSED/opt-in |

## القواعد المشتركة

- `shared/tokens.css` هو مصدر التوكنز الوحيد.
- الألوان الحالية لا تُستبدل داخل المكونات بقيم صلبة جديدة.
- كل مكون يوضح الحالات المنطبقة بدل إنشاء مصفوفة وهمية.
- النص الطويل وRTL والبيانات المفقودة والسالبة حالات يجب أن تبقى قابلة للقراءة.
- نجاح فحص المعاينة لا يثبت جهازًا فعليًا أو قارئ شاشة.

## المعرض الشامل

[`previews/ui-system-showcase/`](../previews/ui-system-showcase/) هو المرجع التفاعلي الأخير لاستخدام العائلات معًا. مصدره قابل للتعديل، وملف standalone فيه مولد آليًا.
