الجولة الأحدث مكتملة على Feature: [تجربة الهاتف](MOBILE-EXPERIENCE-HANDOFF.md). البداية7df38e8؛ دون دمجmain أوMicro. الأقسام التالية تخص الجولات السابقة.

# تسليم الجولة الحالية

الأساس b94d78b، والفرع feature/ui-system-component-audit-repair-2026-11-11. [الخطة](audits/ui-owner-2026-11-14/PLAN.md)، [التقرير](audits/ui-owner-2026-11-14/phase7/REPORT.md)، [تغطية14/8/12](audits/ui-owner-2026-11-14/phase7/COVERAGE.md).

## أمثلة المهام

[الهوية المحدودة](../previews/design-direction/index.html)، [ترتيب الأفعال](../previews/design-direction/actions.html)، [الصفوف والقراءات](../previews/design-direction/density.html)، [الرسوم](../previews/readable-source/index.html)، [التقويم](../previews/mobile-capabilities/calendar-tasks.html)، [الإعلان والنموذج](../previews/product-context/lab.html?component=market)، [عرض التوصيل](../previews/product-context/lab.html?component=delivery)، [المحادثة](../previews/product-context/lab.html?component=assistant). حالات editor-append وreading وfill وexpired-actions داخل المختبر نفسه.

## المصدر والعقود

الكتالوج يحدد الاعتماديات؛ مواصفة العائلة تشرح التشريح والخصائص والحالات والاستخدام. راجع components/product-context/specification.md للسياق والصلاحية والبيانات وأحداث الطلب وإقرار النتيجة والتنظيف. لا تنقل Showcase أوstandalone كشاشات منتج.

تُحمّل fonts/tokens/motion ثم CSS العائلات، وFields/Navigation/ActionSheet/Carousel حسب الحاجة، ثمproduct-core وrenderer. الخيارات الجديدة اختيارية: m-row--single، وصفةB01، attachmentSelection=append، conversationLayout=fill، action.emphasis=primary. الافتراضات السابقة محفوظة. Figma لاحقًا يطابق هذه العقود ولا يصبح مصدرًا موازيًا مختلفًا.

## حدود النقل لاحقًا

هذه الجولة لا تبدأ التكامل. لاحقًا نتحقق من stack المضيف وCSS العام والخطوط والطبقات والتمرير والجلسة والبيانات؛ مظهره القديم ليس مرجعًا صحيحًا تلقائيًا. يمرر المضيف البيانات والصلاحيات ويؤكد التنفيذ، ولا يفسر كلام المساعد ككود أو تفويض. اختيار الصور محلي ولا يحذف صورًا خادمية. fill يحتاج حاضنة ذات ارتفاع معلوم. اختبار المنصة والاعتماد البصري منفصلان عن نجاح Chromium.
