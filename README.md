# Micro UI Design System

بيئة العمل المشتركة لهوية Micro ومكتبة UI مستقلة قابلة للتركيب. المخرجات للمراجعة، لا اعتماد إنتاجي.

## تكليف الاستكمال الحالي —2026-10-03

ابدأ من [حزمة Flash](handoff/ZAI-START-HERE.md) و[التكليف الكامل](handoff/ZAI-EXECUTION-BRIEF.md). تشمل الإصلاحات المثبتة واستكمال الحالات وقواعد التركيب والحركة والقبول، على فرع release/ui-professional وحده إلى main. [البرومبت الجاهز](prompts/ZAI-UI-COMPLETION.md). مصادر الفرع الحالية مرجع التنفيذ؛ ZIP الموجود لقطة الإصدار السابق قبل هذا التكليف ويُعاد توليده عند الإغلاق.

## ابدأ هنا
1. اقرأ AGENTS.md.
2. اقرأ [DESIGN.md](DESIGN.md) ثم docs/CURRENT-STATE.md؛ يحددان الهوية والنطاق الأحدث وحالة القرارات.
3. اقرأ docs/foundations/Micro-UI-Foundations-V1.md للأسس البصرية.
4. راجع المراجع البصرية وفهرس docs/ARTIFACTS.md.
5. نفّذ فقط الدفعة المكلّف بها، وسلّمها للمراجعة.

## إصدار UI الحالي

- [مرجع الإصدار](docs/UI-RELEASE.md) و[القواعد البصرية](docs/UI-VISUAL-SYSTEM.md).
- [المعرض الموحد](previews/index.html) و[مرجع الحالات من المصدر](previews/system/index.html).
- [تقرير التحقق](reviews/UI-RELEASE/review.md) والحزمة `deliverables/micro-components-editable.zip`.
- فحص الإصدار: `python3 tools/ui-release-check.py`. المصادر مستقلة؛ لا إطار تطبيق ولا ربط إنتاجي.

## المحتويات
- docs/: القرارات والأسس وحالة العمل.
- references/: مراجع الاتجاه والتقرير الوارد؛ التقرير مرجع تحليلي، والصور مرجع للاتجاه.
- components/: مصادر المكوّنات الحالية ومواصفاتها وأمثلتها.
- previews/: معاينات مستقلة للمكوّنات، لا كود التطبيق الإنتاجي.
- prompts/: تكليفات الأيجنت المعتمدة لاحقًا.
- reviews/: نتائج المراجعات والتصحيحات.
- handoff/: مراجع استمرارية الدور وسجل القرارات.

راجع [الفهرس](docs/COMPONENT-INVENTORY.md) و[الاختيارات](docs/UI-DECISIONS.md) لمعرفة الموجود والمعتمد والمقترح دون جرد شامل. المستودع عام بموافقة المالك، ولا يتضمن أسرارًا أو بيانات مستخدمين.

## سجل الدفعات السابقة — تاريخي
دفعة [الأزرار B01](prompts/B01-BUTTONS-ZAI.md) منفذة بمصدر قابل للتعديل ومعاينة، ودُمجت في `main` عبر [PR #1](https://github.com/Qays7753/micro-ui-design-system/pull/1) مع بقاء حالتها **DRAFT FOR RE-REVIEW** وعدم اعتمادها للإنتاج. أُنجزت جولتا تصحيح R1 وR2 على نفس الملفات (المراجعات: `reviews/B01/CHATGPT-REVIEW-R1.md` و`CHATGPT-REVIEW-R2.md`، النتائج: `reviews/B01/review.md`). المصدر القابل للتعديل إلزامي. راجع [القائمة](docs/COMPONENT-INVENTORY.md) و[عقد التسليم](docs/EDITABLE-DELIVERY.md).

## التكليف الأحدث — 2026-09-28

- [تكليف ZAI](prompts/UI-LIBRARY-EXPANSION-ZAI.md)
- [المعايير والنطاق والتسليم](docs/UI-LIBRARY-EXECUTION-BRIEF.md)
- [مصفوفة الحالات والسيناريوهات](docs/UI-COVERAGE-MATRIX.md)

توسعة B02–B07 وS01 منفذة كمسودات للمراجعة، ودُمجت في `main` عبر [PR #2](https://github.com/Qays7753/micro-ui-design-system/pull/2). لا تمثل هذه المخرجات اعتمادًا ذاتيًا أو إعلان اكتمال المكتبة أو جاهزية للإنتاج.

## مكونات Micro العددية والإعدادات والدخول

المدخل الحالي: [المعرض الموحد](previews/index.html)، مع [المفاهيم](previews/concepts/index.html) و[التركيبات](previews/compositions/index.html)، ويعمل عبر
`python3 tools/preview-server.py` على المنفذ 5000 دون إطار تطبيق أو بناء.

- [دليل التشغيل والتعديل](docs/MICRO-COMPONENTS-GUIDE.md)
- [الفحوص وحدودها والصور](reviews/CONCEPTS/review.md)
- [حزمة المصدر القابل للتعديل](deliverables/micro-components-editable.zip)

دوائر منفصلة داخل بطاقة واحدة، وعرض متداخل للمصدر نفسه؛ والصفر والسالب حالات طبيعية.
الأمثلة مستقلة، والبيانات يحددها المستهلك. هذه مسودة للمراجعة، دون مصادقة فعلية أو حفظ إعدادات أو نشر.
