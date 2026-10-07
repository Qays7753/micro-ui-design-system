# نطاق المراجعة — جرد فعلي لا قائمة افتراضية

الجرد عند الرأس15d05f7. على المنفذ إعادة الجرد من أحدث main وإضافة أي عائلة/ملف/variant جديد. لا يكفي صف واحد «buttons راجعتها»؛ أفرد أنواعها وحالاتها المهمة في COVERAGE.csv مع ملف ودليل وحالة. هذا الجدول نقطة بدء لا ادعاء مراجعة منجزة.

| العائلة | المصادر الموجودة عند الإعداد | محور المراجعة |
|---|---|---|
| access-gateway | `components/access-gateway/access-gateway.css`، `components/access-gateway/access-gateway.js`، `components/access-gateway/specification.md` | وضوح المدخل والحقول والتفعيل والأخطاء؛ لا تخلط بوابة التجربة بمصادقة إنتاجية. |
| account-settings | `components/account-settings/account-settings.css`، `components/account-settings/account-settings.js`، `components/account-settings/specification.md` | تجميع الإعدادات، فهم أثر التبديل، النصوص الثانوية، الحفظ والتغذية الراجعة. |
| buttons | `components/buttons/buttons.css`، `components/buttons/buttons.js`، `components/buttons/specification.md` | تراتب الفعل، الحشو، الأيقونة/العدّاد، تحميل ثابت بلا تداخل، disabled/focus/hidden. |
| carousel | `components/carousel/carousel.css`، `components/carousel/carousel.js`، `components/carousel/specification.md` | ظهور إمكانية التنقل والموضع والحدود، لمس/RTL/لوحة المفاتيح وعدم إخفاء فعل مطلوب. |
| data | `components/data/data.css`، `components/data/data.js`، `components/data/packed-circle.css`، `components/data/packed-circle.js`، `components/data/specification.md` | خط SVG الفعلي بعد resize وتكبير، حدود وتسميات كاملة، صدق الرسم والفجوات والمقام والصفر. |
| fields | `components/fields/fields.css`، `components/fields/fields.js`، `components/fields/specification.md` | حقل الاسم/رقم/كمية/تاريخ/ملاحظة؛ قياس المحتوى والوحدة والعداد والمسح والخطوة والرسائل. |
| info-strip | `components/info-strip/info-strip-peek.css`، `components/info-strip/info-strip-peek.js`، `components/info-strip/info-strip.css`، `components/info-strip/info-strip.js`، `components/info-strip/specification.md` | الشريط وpeek، قص المحتوى المقصود، 0/1/عدة بطاقات، نقل التركيز والتكرار وعلامات الموضع. |
| messages | `components/messages/messages.css`، `components/messages/messages.js`، `components/messages/specification.md` | inline/banner/toast/loading/empty؛ ظهور فعلي وأين يعلن وما يبقى حتى التصحيح وما يغلق. |
| metric-comparison | `components/metric-comparison/metric-comparison.css`، `components/metric-comparison/metric-comparison.js`، `components/metric-comparison/specification.md` | قابلية المقارنة، تناسب المساحة، كتابة الوحدة، كثافة الصف، فصل التشخيص ومفتاح القراءة. |
| navigation | `components/navigation/navigation.css`، `components/navigation/navigation.js`، `components/navigation/specification.md` | أعلى/أسفل الصفحة، tabs/filter/dialog/sheet؛ المساحة المحجوزة، التركيز/inert/Escape/back. |
| order-schedule | `components/order-schedule/order-schedule.css`، `components/order-schedule/order-schedule.js`، `components/order-schedule/specification.md` | شهر/يوم/قائمة، اليوم مقابل المحدد، count/status، وضوح الصف والتفاصيل، استثناء الخلية. |
| organization | `components/organization/organization.css`، `components/organization/organization.js`، `components/organization/specification.md` | الصفوف والقوائم والأقسام المطوية، الفصل والحدود، كثافة العنوان/القيمة وحالات الميديا. |
| selection | `components/selection/picker.css`، `components/selection/picker.js`، `components/selection/selection.css`، `components/selection/selection.js`، `components/selection/specification.md` | checkbox/radio/switch/segmented/picker؛ وضوح المحدد، pending والبحث والفراغ/الخطأ والتركيز. |
| surfaces | `components/surfaces/curves.css`، `components/surfaces/specification.md`، `components/surfaces/surfaces.css` | السطوح والمنحنيات، توازن الهوية والمحتوى، القص ونمو النص والرقم، استخدام البطاقة لسبب. |

## الطبقات المشتركة والتركيب

- shared/tokens.css وshared/motion.css: تراتب الخط/اللون/المسافة/المقاس/الحركة والاتساق، مع الأصول المرخصة الحالية؛ لا تعديلها.
- previews/index.html، لوحات كل عائلة وأمثلتها المستقلة، previews/compositions وconcepts: المصدر داخل المثال ليس دومًا عقد مكتبة؛ ميّز مسؤولية المستهلك.
- previews/ux-patterns/form-lifecycle وchoice-lifecycle وfilter-lifecycle وswitch-lifecycle: الحالات الفعلية للنموذج والمنتقي والفلتر والتبديل، دون إعادة تحليل أعمال المنتج.
- previews/ux-patterns/mobile-record-sample: الرئيسية/العناصر/التقارير/الحساب/الإعدادات/الأوردر/الطبقات/النموذج، مع standalone الناتج بالبناء لا كمصدر مستقل.
- previews/ux-patterns/order-schedule: العينة والموصل منفصلان عن مصدر components/order-schedule.
- docs/UI-VISUAL-SYSTEM.md وUI-USAGE-SOP.md وUI-PLATFORM-NOTES.md وCOMPONENT-INVENTORY.md والمواصفات: مواضع الاختلاف بين العقد والتنفيذ والجودة البصرية.

## حالات مشتركة لكل ما ينطبق

default/selected/focused/disabled/readonly/loading/empty/error/success/unknown، نص قصير وطويل، RTL والنص المختلط وأرقام0–9، ضغط/لمس/لوحة مفاتيح، تركيز قبل إخفاء عنصر، طبقات متداخلة ومحتوى آخر الصفحة. المقاسات320/360/390/430 CSSpx وتغيير430→320 دون إعادة فتح. تكبير نص200% بمرورين معلنين؛ native zoom منفصل. لا يحتاج كل مكوّن كل حالة؛ N/A يحتاج سببًا.

المراجعة البصرية تقرأ اللقطة فعلًا بعد التحقق أن الحالة المعنية فيها ظاهرة. افحص المنطقة فوق لوحة النظام/شريط المتصفح حيث تتاح منصة حقيقية. إذا لم تتاح فاكتب NOT RUN. أبعاد viewport ليست مواصفات S25 الفيزيائية أو اختبار جهاز.
