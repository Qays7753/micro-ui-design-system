# Micro UI — مرجع الإصدار الحالي

هذا إصدار مكتبة UI مستقل، وليس إعلان جاهزية تطبيق Micro الإنتاجي أو اعتماد UX.

## المراجع الملزمة

1. الهوية والحدود: [`DESIGN.md`](../DESIGN.md).
2. القيم التنفيذية: [`shared/tokens.css`](../shared/tokens.css).
3. القواعد البصرية: [`UI-VISUAL-SYSTEM.md`](UI-VISUAL-SYSTEM.md).
4. العائلات والمصادر: [`COMPONENT-INVENTORY.md`](COMPONENT-INVENTORY.md).
5. الحالات الحية: [`previews/system/index.html`](../previews/system/index.html).
6. التحقق الأخير: [`reviews/UI-SYSTEM-SHOWCASE/`](../reviews/UI-SYSTEM-SHOWCASE/).

## قواعد الإصدار

- حافظ على هوية Micro الحالية وألوان التوكنز وخطوط IBM Plex وأصول الأيقونات الموجودة.
- عربي RTL، هاتف، وضع فاتح، وأرقام قابلة للقراءة.
- لا تقص البيانات المهمة أو تصغّرها لإخفاء ازدحام التخطيط.
- استخدم العمق والبطاقات عندما يكون لهما سبب بنيوي، لا كزخرفة عامة.
- الحركة وظيفية وتحترم `prefers-reduced-motion` ولا تستخدم autoplay.
- حالات `DRAFT` و`PROPOSED` تبقى موسومة ولا تتحول إلى Stable تلقائيًا.

## ما لا يدعيه الإصدار

لا شهادة WCAG كاملة، ولا اختبار جهاز فعلي أو قارئ شاشة أو Safari من محاكاة Chromium. لا يشمل هذا المستودع UX أو منطق الأعمال أو المصادقة أو الحفظ أو النشر.
