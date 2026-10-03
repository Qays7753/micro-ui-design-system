# إعدادات الحساب والتطبيق — SPEC-03

**الحالة: STABLE UI — [UI-RELEASE](../../docs/UI-RELEASE.md).** أجزاء قابلة للتركيب، لا شاشة منتج أو صلاحيات إدارية.

## أجزاء مستقلة

- ملخص الحساب `.m-account-profile`، مجموعة `.m-setting-group`، صف قراءة/تنقل `.m-setting-row`، وصف إعداد بمفتاح الاختيار الحالي `.m-switch`.
- حاوية مثال الإعدادات `[data-account-settings]`: زر مستهلك يحمل `data-account-open`، وطبقة واحدة من عائلة B07. داخلها منظور الحساب ومنظور التطبيق متجاوران في DOM، ولا تُكدّس نافذتان.

## عقد الطبقة

يستعمل component المكتبة الحالية كما هي: عنصر `div.m-layer` و`.m-layer--center` وغشاء `.m-layer-backdrop` و`MicroNavigation.openLayer/closeLayer`. تعلن اللوحة `data-account-layer-id` أو تعيش داخل طبقتها. `data-account-to-application` يفتح إعدادات التطبيق، و`data-account-back` يرجع للحساب داخل الطبقة نفسها. `data-account-close` يغلق ويعيد تركيز المشغّل. Escape، inert للخلفية، حصر التركيز واستعادته من تنفيذ B07.

## بيانات وسلوك

كل أسماء الحساب والإعدادات والصفوف تأتي من HTML. المفاتيح اختيار أصلي `role="switch"`/checkbox ضمن `.m-switch`. عند وسم عنصر الاختيار `data-account-setting`, يطلق تغيره `micro-account-settings:change` ببيانات `setting` و`checked`. لا تخزين خادمي أو محلي افتراضيًا. أضف `data-demo-only` لعينة مؤقتة لعرض تنبيه أن التغيير لم يُحفظ.

## RTL والإتاحة

أهداف الصفوف 72px على الأقل، المفتاح يوفّر الهدف الموجود في B03، والصفوف تستخدم اتجاه الخصائص المنطقية. تسميات العناوين ترتبط بسمات الحوار وتُخفى مع المنظور الآخر. أيقونات HugeIcons محلية بأصول موجودة؛ لا تستخدم علامة بديلة أو عائلة أخرى.

## اعتماد

`account-settings.css` و`account-settings.js` يتطلبان `navigation.css/js` للمشهد الحواري، و`buttons.css` للأزرار، و`selection.css/js` للمفاتيح، إضافة للتوكنات والخطوط. مثال مستقل كامل في `example-usage.html`.