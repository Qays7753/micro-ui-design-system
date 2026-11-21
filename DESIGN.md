# Micro UI — مرجع الهوية والحدود

## ما هذه المكتبة

مكتبة UI مستقلة لمشروع Micro: مصدر مكونات قابل لإعادة الاستخدام وتراكيب محدودة لسياق المنتج، وليست تطبيق Micro الإنتاجي. الهاتف والهاتف فقط هو المستهلك الحالي؛ لا نسخة ديسكتوب ولا قوائم hover/popover خاصة بها.

## الهوية

- الاتجاه المعتمد **Purposeful Expressive Native UI**، والهندسة **Geometry B**؛ القيم التنفيذية في [`shared/tokens.css`](shared/tokens.css) والعقود التفصيلية في [`docs/SYSTEM-CONTRACTS.md`](docs/SYSTEM-CONTRACTS.md) و[`docs/DESIGN-FOUNDATIONS.md`](docs/DESIGN-FOUNDATIONS.md) و[`docs/DESIGN-FOUNDATIONS.md`](docs/DESIGN-FOUNDATIONS.md).
- العربية RTL افتراضية والأرقام Western 0–9 والتقويم ميلادي. المضيف يختار المنطقة الزمنية والعملة والوحدة؛ المكتبة لا تستنتجها.
- الخط: IBM Plex Sans Arabic وIBM Plex من الأصول المحلية في `assets/fonts`. لا Google Fonts.
- الألوان: بترولي `#164D59` للإجراء الأساسي، والتراكوتا `#D97757` محصورة بعدّاد التصفية وحافة الملخص المختار. لا لوحة بديلة ولا filter لإعادة تلوين الشعار.
- الشعار النشط `assets/brand/micro-logo/v2/` (عربي/إنجليزي/رمز؛ full-color على الفاتح). v1 تاريخي ولا يُستخدم. قاعدة الاستخدام في [`assets/brand/micro-logo/USAGE.md`](assets/brand/micro-logo/USAGE.md).
- **Light-only**: تعريفات Dark القديمة خاملة داخل `@media not all` ولا تُصلح ولا تُختبر.

## الحدود

النطاق UI فقط: أساسات بصرية وتوكنز، مكونات وحالات ومواصفات، تراكيب سياق منتج محدودة، أمثلة قابلة للتعديل، معرض تفاعلي، فحوص آلية صادقة. لا شاشات منتج إنتاجية ولا قواعد أعمال ولا مصادقة أو حفظ فعلي أو تكامل شبكي.

### حدود بوابة الدخول

Access Gateway يوفّر واجهات UI فقط؛ المضيف يملك Google Identity Services والتحقق والجلسة وتحديد حالة الجديد/العائد والوجهات. لا OAuth ولا بيانات اعتماد ولا تخزين ولا طلبات شبكة في المكتبة.

## قواعد التركيب البصري

- استخدم المسافة والمحاذاة والعناوين قبل إضافة بطاقة؛ لا بطاقة أو ظل لكل صف أو معلومة.
- لا تجعل عنصرًا غير تفاعلي يبدو زرًا أو رابطًا.
- حافظ على أهداف لمس 48px حيث تنطبق مواصفة المشروع.
- اجعل النص الطويل والـRTL والحالات الفارغة والمفقودة والسالبة قابلة للقراءة؛ لا تقص رقمًا مهمًا ولا تخفيه بضيق الحاوية، ولا تستخدم اللون وحده للدلالة.
- الحركة وظيفية وتحترم `prefers-reduced-motion`؛ لا autoplay.
- المقارنة الدقيقة bars/rows/table افتراضًا؛ الدوائر والخط خيارات صريحة.

## المصادر الأساسية

- القيم التنفيذية: [`shared/tokens.css`](shared/tokens.css) · الحركة: [`shared/motion.css`](shared/motion.css) · الأيقونات: [`shared/icons.js`](shared/icons.js).
- المكونات: [`components/`](components/) · الأمثلة: [`previews/`](previews/) · المعرض: [`previews/ui-system-showcase/`](previews/ui-system-showcase/).
- المواصفات والعقود والقرارات: [`docs/`](docs/) — ابدأ من [`docs/STATUS.md`](docs/STATUS.md) و[`docs/API.md`](docs/API.md).

## التحقق

النتائج الموثقة نتائج Chromium/Playwright محددة بالرأس الذي ولّدها. الأجهزة الفعلية وSafari/WebKit واللمس الحقيقي وقارئات الشاشة وsafe areas وnative zoom تحتاج تحققًا منفصلًا ولا يُفترض نجاحها من فحوص سطح المكتب. البوابات كلها عبر `uv run python tools/check-all.py`.
