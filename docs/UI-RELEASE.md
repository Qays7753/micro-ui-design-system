# Micro UI — مرجع الإصدار الحالي

هذا إصدار مكتبة UI مستقل، وليس إعلان جاهزية تطبيق Micro الإنتاجي أو اعتماد UX.

## المراجع الملزمة

1. الهوية والحدود: [`DESIGN.md`](../DESIGN.md).
2. القيم التنفيذية: [`shared/tokens.css`](../shared/tokens.css).
3. القواعد البصرية: [`UI-VISUAL-SYSTEM.md`](UI-VISUAL-SYSTEM.md).
4. العائلات والمصادر: [`COMPONENT-INVENTORY.md`](COMPONENT-INVENTORY.md).
5. الحالات الحية: [`previews/system/index.html`](../previews/system/index.html).
6. العقود المعتمدة: [`SYSTEM-CONTRACTS.md`](SYSTEM-CONTRACTS.md).
7. فحوص الإصدار Light-only: `light-calendar-check.py` و`light-data-check.py` و`light-release-check.py` داخل `tools/`؛ تفاصيل الأوامر والنتائج في التقرير الحالي.
8. ملخص الدليل الحالي: [`تقرير Light-only`](replit/light-only-complete-ui-repair-2026-10-24/REPORT.md). `IMPLEMENTATION-VERIFICATION.md` سجل تاريخي لا قبول لهذا الفرع.

تقارير 2026-10-21 وأدلة `reviews/UI-SYSTEM-SHOWCASE/` تاريخية، وليست PASS للمصدر المعدّل. لا إذن دمج يُستمد من إصدار سابق.

## قواعد الإصدار

- قبل إغلاق مرحلة المصدر أو تسليمها، راجع [سجل حسم البنود الحالي](UI-DECISIONS.md): D01/UX-06 وUX-07 وUX-08. يذكر التقرير حالة كل بند ونطاقه أو سبب تأجيل توسعته؛ لا تنفيذ تلقائي أو إغلاق صامت.


- حافظ على هوية Micro الحالية وألوان التوكنز وخطوط IBM Plex وأصول الأيقونات الموجودة.
- عربي RTL مع LTR للمراجعة، هاتف، Light-only، Geometry B، وأرقام كاملة قابلة للقراءة. Dark مستثنى ولا يُختبر.
- لا تقص البيانات المهمة أو تصغّرها لإخفاء ازدحام التخطيط.
- استخدم العمق والبطاقات عندما يكون لهما سبب بنيوي، لا كزخرفة عامة.
- الحركة وظيفية وتحترم `prefers-reduced-motion` ولا تستخدم autoplay.
- حالات `DRAFT` و`PROPOSED` تبقى موسومة ولا تتحول إلى Stable تلقائيًا.

## ما لا يدعيه الإصدار

لا شهادة WCAG كاملة، ولا اختبار جهاز فعلي أو قارئ شاشة أو Safari من محاكاة Chromium. يشمل مكونات وتراكيب UI لسياق المنتج، دون شاشات Micro الإنتاجية أو منطق الأعمال أو المصادقة أو الحفظ أو النشر الفعلي.

ثلاث بوابات مستقلة: Source/API، Visual/Interaction، Platform. لا تسمية «جاهز للنقل» بينما بوابة المنصة غير مشغلة، ولا ترقية draft/proposed نتيجة مرور Chromium وحده.

## تدقيق المكونات — 2026-11-11

[تقرير التدقيق المستقل](audits/component-audit-2026-11-11/REPORT.md) يثبت حالات المراجعة والإصلاحات المركزة وحدود البيئة، دون تغيير الهوية أو Light-only أو نضج الكتالوج. الفحوص الجديدة: `component-audit-check.py` و`calendar-contract-check.py` و`clone-lifecycle-check.py` داخل `tools/`.

## بوابة امتداد المصدر المقروء — 2026-11-12

شغّل `python3 tools/readable-source-check.py --out /tmp/readable-source` مع بوابات Light الحالية وكتالوج/standalone/MANIFEST. المعاينة المستقلة للمصدر تُولد عبر `tools/build-chart-proposal-review.py --check`؛ ملفا prototype السابقان تاريخيان. لا تغير حالة Draft تلقائيًا، وأبلغ عن الحالة الحالية لـD01/UX-06 وUX-07 وUX-08 من سجل القرارات. [العقد](READABLE-SOURCE.md).

## بوابة القبول الحالية — 2026-11-12

`python3 tools/readable-acceptance-check.py --out /tmp/readable-acceptance` فحص Light360 RTL بمحاكاة لمس، و320 موجه للجدول وLTR اتجاهي، يضاف إلى readable-source وبوابات Light الحالية. وضع capture-only يسجل إخفاق baseline ولا يصلح بوابة تسليم. [التقرير الحالي](audits/readable-acceptance-2026-11-12/REPORT.md) و[بوابة الهاتف الفعلي غير المنفذة](audits/readable-acceptance-2026-11-12/PHONE-CHECK.md). محاكاة اللمس لا ترفع Platform إلى ناجح أو Draft إلى Stable.

## بوابة الأفعال المشتركة والمرشح الحالي

`python3 tools/shared-actions-check.py --out /tmp/shared-actions` يقارن الشكل المحسوب للأفعال بمرجع B01 المحمّل، في الحالات العادية والمعطلة والتركيز والضغط، مع النسخ والأحداث وعدم التداخل والأصول داخل الملف المستقل. لا يكفي وجود button أو نجاح click وحدهما لقبول المظهر. [مرشح الإقفال](audits/shared-actions-2026-11-12/CANDIDATE.md) و[تغيير التحميل](SHARED-ACTIONS.md). المعاينة الهاتفية مؤجلة بقرار المالك إلى نهاية التجهيز؛ لا إغلاق تلقائي لبوابة المنصة أو رفع Draft.

## مراجعة الإقفال وتفويض الدمج — 2026-11-13

`python3 tools/unit-context-check.py --out /tmp/unit-context` يحرس ظهور الوحدة عندما لا يذكر العنوان وحدة مستقلة. تُشغّل بوابات Light الحالية وcomponent-audit-check ذات360 RTL مع فحوص البناء والجرد. المالك أجاز الدمج بعد المراجعة الآن؛ معاينة الجهاز المؤجلة لا تُسجل ناجحة ولا يرقى النضج تلقائيًا. [التقرير](audits/final-source-review-2026-11-13/REPORT.md).

## تنقيحات الإقفال البصري — 2026-11-13

شغّل `python3 tools/visual-closure-check.py --out /tmp/visual-closure` مع بوابات Light والبناء الحالية. يغطي العرض المختصر، التحديد الاختياري الفعلي، صفوف المصاريف وصدق شرح المقياس وحالاته، وحدود استخدام الشعار. فحوص readable/shared-actions تفعّل الخيار عبر أداة المعاينة قبل اختبار تفاعله؛ لا حذف Assertions. [القواعد](VISUAL-ACCEPTANCE.md) و[الدليل والنتائج](audits/visual-closure-2026-11-13/REPORT.md). لا تغيير تلقائي للنضج أو تنفيذ للمؤجلات أو إذن دمج جديد.

## بوابة قدرات الهاتف — 2026-11-13

شغّل `python3 tools/mobile-capabilities-check.py --out /tmp/mobile-capabilities` مع بوابات Light الحالية؛ يغطي D01/C05/C06 والحركة والتركيز والتكرار والتنظيف وسياقي الملخص. [العقود](MOBILE-CAPABILITIES.md) و[التقرير](audits/mobile-capabilities-2026-11-13/REPORT.md). التنفيذ للهاتف فقط؛ لا Dark أو desktop layout أو ترقية تلقائية لـDraft أو نجاح جهاز فعلي.

## المرجع المثبت للتسليم — 2026-11-13

[handoff/REFERENCE-2026-11-13](../handoff/REFERENCE-2026-11-13.md) يثبت مصدر892cac5 بما فيه24b78ef، وروابط الاستهلاك والاعتماديات والحالات المعروفة وبصمات المصدر. اعتمد المالك دمجه مع سجل التوثيق على main. تحقق من الرأس البعيد واستعمل FF فقط. هذه نسخة مصدر للهاتف؛ الهاتف الفعلي والتكامل لا يتحولان إلى PASS بالدمج. لا نشر أو ترقية Draft/Proposed.

## بوابة C07–C12 — سياق المنتج

التفويض الجديد داخل مكتبة المكونات فقط، وليس إذن دمج سابقًا. شغّل `python3 tools/product-context-check.py --out /tmp/product-context` مع بوابات Light الحالية والبناء والكتالوج وMANIFEST. [التقرير](product-context/REPORT.md) يميز دليل المصدر عن اختبار الهاتف والخادم. الكتالوج14/8/12، C07–C12 Draft. لا backend/AI/مصادقة فعلية أو قواعد تجارية مخترعة أو تغيير هوية أو فتح Micro. مرجع handoff السابق مثبت لا يعاد تحريره لإضافة هذه الدفعة.
