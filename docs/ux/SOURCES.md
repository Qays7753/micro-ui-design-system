# مراجع القواعد وحدود نسبتها

تاريخ التحقق: 2026-10-04. الصياغة في القواعد تلخيص وتطبيق خاص بالمشروع، وليست نقلًا حرفيًا أو شهادة امتثال. عند تنفيذ ويب نرجع إلى نص WCAG 2.2 المعياري؛ صفحات Understanding تشرح النص وليست معيارًا إضافيًا. APG يصف أنماط ويب إرشادية، ولا يحدد رحلة المنتج. إرشادات Android/iOS لا تُحوّل إلى قياسات CSS تلقائيًا.

| ID | المصدر الأولي | ما يدعم هنا |
|---|---|---|
| W0 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | المرجع المعياري عند مراجعة الإتاحة؛ هذه الحزمة لا تحصر جميع شروط المطابقة |
| W1 | [3.3.1 Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html) | تحديد الإدخال الخاطئ وشرح الخطأ نصيًا |
| W2 | [3.3.2 Labels or Instructions](https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html) | تسمية/تعليمات الإدخال عند الحاجة |
| W3 | [3.3.4 Error Prevention](https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html) | في الحالات المشمولة: إتاحة الرجوع عن الإرسال أو فحص الأخطاء وتصحيحها أو المراجعة والتأكيد؛ لا يفرض حوارًا لكل إجراء |
| W4 | [4.1.3 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) | إتاحة تحديد رسائل الحالة برمجيًا دون نقل التركيز إليها |
| W5 | [3.2.2 On Input](https://www.w3.org/WAI/WCAG22/Understanding/on-input.html) | تجنب تغيير السياق غير المتوقع لمجرد تغيير إدخال |
| W6 | [2.5.7 Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html) | بديل بمؤشر واحد دون سحب للوظائف التي تتطلب السحب، باستثناءاتها المعلنة |
| W7 | [2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | حد ويب AA: 24×24 CSS px أو أحد الاستثناءات المحددة؛ ليس 48dp ولا مقاسًا موحدًا لكل منصة |
| W8 | [3.3.8 Accessible Authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) | قيود الاختبار الإدراكي في المصادقة واستثناءاته؛ لا منع مدير كلمات المرور/اللصق كافتراض |
| W9 | [2.4.11 Focus Not Obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | عنصر التركيز لا يُحجب كاملًا بمحتوى المؤلف عند المستوى AA؛ سياسة المشروع أوسع لرؤية الحقل وإجرائه |
| W10 | [1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html) | اللون لا يكون وسيلة المعنى الوحيدة |
| W11 | [1.4.4 Resize Text](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) | تكبير النص حتى 200% دون فقد المحتوى أو الوظيفة، مع الاستثناءات الواردة في المعيار |
| A1 | [APG Dialog Modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | التركيز داخل الحوار، الإغلاق باللوحة، واستعادة التركيز وفق سياق الإجراء |
| A2 | [APG Combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) | تمييز البحث والاقتراح والاختيار وتفاعل لوحة المفاتيح؛ لا يُفرض هذا الدور على منتقي حواري مختلف |
| G1 | [Android accessibility](https://developer.android.com/guide/topics/ui/accessibility/apps) | أهداف لمس 48×48dp موصى بها للواجهة اللمسية، وأسماء تصف وظيفة العناصر؛ لا ادعاء اختبار TalkBack |
| G2 | [Android predictive back](https://developer.android.com/develop/ui/compose/system/predictive-back) | توقع الرجوع ومعاينة وجهته عند تغليف Android؛ التنفيذ واختباره مرحلة المنصة |
| I1 | [Apple Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts) | إرشاد تجنب المقاطعة للإجراءات الشائعة القابلة للتراجع، وأفعال حوار واضحة |
| I2 | [Apple Undo and redo](https://developer.apple.com/design/human-interface-guidelines/undo-and-redo) | مسار تراجع مفهوم حيث يدعمه الإجراء فعليًا |
| P | [SOP المعتمد](../UI-USAGE-SOP.md) و[الأسس](../foundations/Micro-UI-Foundations-V1.md) | اختيارات المشروع: التجميع المفتوح، تدرج الأفعال، النص الموجز، الهوية وtokens؛ ليست إلزامًا دوليًا |

W1–W11 وA1/A2 وG1/G2 تحققت من الصفحات الرسمية. Apple I1/I2 تحققت من مقتطفات الفهرسة الرسمية؛ صفحة Apple المفتوحة تعيد غلاف JavaScript في بيئة البحث، لذا لا ننسب إليها مقاسات أو تفاصيل لم تُقرأ. صفحة Material 3 المفتوحة لم توفر محتوى قابلًا للقراءة؛ لا نستعملها كدليل إغلاق أو ننسب إليها قواعد من مواقع ثانوية.

قاعدة «الأفضل» الخاصة بالمشروع تُوسم P حتى لو انسجمت مع مصدر. لا ندعي أن WCAG يفرض توقيت blur للتحقق، مدة Toast معينة، عدد أزرار رئيسية، حفظًا تلقائيًا أو عدد تبويبات. التباين والمقاسات الحالية تُقرأ من مراجع UI المعتمدة؛ لا نضيف توكنات هنا.
