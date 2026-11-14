# تسليم تجربة الهاتف

البداية 7df38e8، والفرع feature/ui-system-component-audit-repair-2026-11-11، دون دمج جديد. [الخطة](audits/mobile-experience-2026-11-14/PLAN.md)، [التقرير](audits/mobile-experience-2026-11-14/REPORT.md)، [التغطية](audits/mobile-experience-2026-11-14/COVERAGE.md)، [المعاينات](../previews/mobile-experience/index.html).

## المصدر وترتيب الاستهلاك

1. fonts.css ثم tokens.css ثم motion.css.
2. CSS العائلات المستخدمة ثم الوصفات الاختيارية: access-gateway/welcome.css وcompositions/mobile-shell.css. لا تحمل كل المكتبة دون حاجة.
3. الدخول: buttons.js ثم access-gateway.js. استدعاء MicroAccessGateway.init(root,{providers:{google:handler}}). المعرف google يختار callback فقط؛ لا API أو OAuth في المصدر.
4. القائمة: Navigation ثم AccountSettings. استعمل طبقة B07 مع m-layer--drawer وdata-account-initial-view="application" وdata-account-to-account. احتفظ بعناوين فريدة وaria-labelledby والغشاء والأزرار. افصل العائلتين قبل إزالة الجذر.
5. سياق المنتج: Fields وNavigation وActionSheet وCarousel حسب الاستخدام، ثم product-core ثم renderer. استعمل replace وdestroy وفق عقد المصدر، ولا تخترع update.

هذه مكونات مشتركة؛ أنشئ غلافًا واحدًا لكل منها ضمن stack المضيف لاحقًا. لا تنسخ تفاصيل CSS وDOM إلى كل شاشة، ولا تنقل Showcase أو standalone أو صفحة المختبر كشاشة منتج.

## الملكية والتعارضات

المضيف يملك viewport-fit وPWA وtheme-color وشريط النظام ولوحة الهاتف وHistory/Back والمصادقة والبيانات والصلاحيات. حاضنة shell تملك الحواف في التدفق مرة واحدة؛ المتغيران --micro-shell-inset-top/bottom يقبلان 0px عندما يملك المضيف الحافة خارجيًا. الحافتان الجانبيتان فيزيائيتان، فلا تعكسهما RTL. اللوحة الثابتة تملك حوافها الخاصة؛ لا تجمع drawer وcenter. تذييل shell يمرر --micro-inset-bottom:0 لأبنائه لمنع تكرار الحافة.

احتفظ بترتيب التحميل وأسماء الأصناف. ملفات lab.css وlogin.js وtasks.js مستهلكون تجريبيون وليست اعتماديات إنتاجية؛ لا مصادقة أو حفظ فيها. الخادم يفرض الصلاحيات، والمكونات تعرضها فقط. لا ينشئ Market أوDelivery أثرًا ماليًا تلقائيًا.

## الهوية والقياسات والحركة

الشعار v2 والخطوط والتوكنز محفوظة. شعار الترحيب 128×40 مع مساحة خالية 12. أهداف اللمس 48، والحقول 52، والنص الأساسي 16/26. تباعد الوصفات من السلم الحالي. عرض اللوحة 80% مقترح للمعاينة، وليس قرارًا نهائيًا.

ألوان Google الثلاثة تخص زر المزود حصريًا وتخضع لبوابة دقيقة؛ ليست لوحة ألوان لـMicro. الإنتاج يستخدم زر مزود الهوية المدعوم ويتحقق من إرشاداته وترجماته السارية. أصل العلامة ومصدره في assets/providers/README.md. [دليل الحركة](MOBILE-MOTION.md).

## القرارات والحدود

حصرية Google، وعرض اللوحة، وطريقة التشغيل Chrome/PWA، ولمس شبكة الشهر قرارات مفتوحة. لا backend أو AI أو OAuth أو حفظ إعدادات أو وجهات قانونية أو شخصية 3D. تسجيل Google مختلف عن استخدام Gemini.

لم يُختبر الهاتف S25/Chrome فعليًا أو TalkBack أو لوحة النظام أو WebKit. لا ادعاء Native أو اعتماد بصري آلي. غياب الصورة في مثال Market حالة مقصودة؛ الصور الحقيقية تأتي من المضيف. الفراغ تحت مثال قصير لا يبرر حشو الشاشة بمعلومات أو زخارف.
