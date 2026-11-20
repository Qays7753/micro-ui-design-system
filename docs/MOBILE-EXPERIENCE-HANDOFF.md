# تسليم تجربة الهاتف

البداية 7df38e8، والفرع feature/ui-system-component-audit-repair-2026-11-11، دون دمج جديد. [الخطة](audits/mobile-experience-2026-11-14/PLAN.md)، [التقرير](audits/mobile-experience-2026-11-14/REPORT.md)، [التغطية](audits/mobile-experience-2026-11-14/COVERAGE.md)، [المعاينات](../previews/mobile-experience/index.html).

## المصدر وترتيب الاستهلاك

1. fonts.css ثم tokens.css ثم motion.css.
2. CSS العائلات المستخدمة ثم الوصفات الاختيارية: access-gateway/welcome.css وcompositions/mobile-shell.css. تركيب Google-only القابل للاستهلاك موثق في [google-welcome-usage.html](../components/access-gateway/google-welcome-usage.html). لا تحمل كل المكتبة دون حاجة.
3. Google-only: يحمّل المضيف Google Identity Services ويرسم الزر الرسمي داخل `data-google-provider-slot`، ثم يدير credential callback والنتيجة والجلسة. `MicroAccessGateway.init(root,handlers)` خاص بالنموذج العام أو أزرار المزود المخصصة؛ لا يعيد بناء زر GIS. لا SDK أو OAuth في المصدر.
4. القائمة: Navigation ثم AccountSettings. استعمل طبقة B07 مع m-layer--drawer وdata-account-initial-view="application" وdata-account-to-account. احتفظ بعناوين فريدة وaria-labelledby والغشاء والأزرار. افصل العائلتين قبل إزالة الجذر.
5. سياق المنتج: Fields وNavigation وActionSheet وCarousel حسب الاستخدام، ثم product-core ثم renderer. استعمل replace وdestroy وفق عقد المصدر، ولا تخترع update.

هذه مكونات مشتركة؛ أنشئ غلافًا واحدًا لكل منها ضمن stack المضيف لاحقًا. لا تنسخ تفاصيل CSS وDOM إلى كل شاشة، ولا تنقل Showcase أو standalone أو صفحة المختبر كشاشة منتج.

## الملكية والتعارضات

المضيف يملك viewport-fit وPWA وtheme-color وشريط النظام ولوحة الهاتف وHistory/Back والمصادقة والبيانات والصلاحيات. حاضنة shell تملك الحواف في التدفق مرة واحدة؛ المتغيران --micro-shell-inset-top/bottom يقبلان 0px عندما يملك المضيف الحافة خارجيًا. الحافتان الجانبيتان فيزيائيتان، فلا تعكسهما RTL. اللوحة الثابتة تملك حوافها الخاصة؛ لا تجمع drawer وcenter. تذييل shell يمرر --micro-inset-bottom:0 لأبنائه لمنع تكرار الحافة.

احتفظ بترتيب التحميل وأسماء الأصناف. ملفات lab.css وlogin.js وtasks.js مستهلكون تجريبيون وليست اعتماديات إنتاجية؛ لا مصادقة أو حفظ فيها. الخادم يفرض الصلاحيات، والمكونات تعرضها فقط. لا ينشئ Market أوDelivery أثرًا ماليًا تلقائيًا.

## الهوية والقياسات والحركة

الشعار v2 والخطوط والتوكنز محفوظة. شعار الترحيب 128×40 مع مساحة خالية 12. أهداف عناصر Micro 48، والحقول 52، والنص الأساسي 16/26. زر Google الرسمي يملؤه GIS؛ يختار المضيف الحجم الأكبر المناسب للهاتف ويفضل 48px عندما يدعمه المزود دون transform. تباعد الوصفات من السلم الحالي. عرض اللوحة 80% مقترح للمعاينة، وليس قرارًا نهائيًا.

ألوان Google الثلاثة تخص زر المزود حصريًا وتخضع لبوابة دقيقة؛ ليست لوحة ألوان لـMicro. الإنتاج يستخدم زر مزود الهوية المدعوم ويتحقق من إرشاداته وترجماته السارية. أصل العلامة ومصدره في assets/providers/README.md. [دليل الحركة](MOBILE-MOTION.md).

## القرارات والحدود

حصرية Google معتمدة للتركيب المستهدف: المستخدم الجديد والعائد يستخدمان إجراء Google نفسه، دون شاشة إنشاء حساب منفصلة. تظل طريقة تشغيل التطبيق Chrome/PWA وعرض اللوحة ولمس شبكة الشهر قرارات أخرى غير محسومة. لا backend أو AI أو OAuth أو حفظ إعدادات أو وجهات قانونية أو شخصية 3D داخل مستودع المكونات. مصادقة Google الفعلية والجلسة مسؤولية المضيف، وتسجيل Google مختلف عن استخدام Gemini.

لم يُختبر الهاتف S25/Chrome فعليًا أو TalkBack أو لوحة النظام أو WebKit. لا ادعاء Native أو اعتماد بصري آلي. غياب الصورة في مثال Market حالة مقصودة؛ الصور الحقيقية تأتي من المضيف. الفراغ تحت مثال قصير لا يبرر حشو الشاشة بمعلومات أو زخارف.

## تراكيب Access Gateway الأربع — 2026-11-21

المرجع المرئي الحالي هو صور `Micro-Auth(1).zip`. المصدر في `components/access-gateway/`: `splash-usage.html`، `google-sign-in-usage.html`، `new-user-welcome-usage.html`، و`returning-user-welcome-usage.html`، مع `auth-screens.css`. هذه تراكيب UI قابلة للاستهلاك وليست صفحات مصادقة إنتاجية. يبقى `google-welcome-usage.html` مثالًا مستقلًا لـ`m-welcome` و`m-session` الأدنى.

حمّل الخطوط والتوكنز أولًا، ثم `buttons.css` و`auth-screens.css`؛ صفحات الترحيب تستخدم الأيقونة المحلية من `shared/icons.js`. يركّب المضيف شاشة واحدة حسب نتيجة موثوقة فقط، ويرسم زر GIS الرسمي داخل `data-google-provider-slot`، ويقدّم بيانات الحساب ويربط المتابعة/تبديل الحساب. لا يقرأ المكوّن البريد لتحديد حالة المستخدم ولا يخزن credentials أو session. أُزيلت عبارة «حسابك جاهز» من نص واجهة الجديد لأن جاهزية الحساب ليست مضمونة من عقد UI.
