# تدقيق Samsung One UI × Micro — DRAFT FOR REVIEW

**مراجعة وتقرير فقط. لم تُنفَّذ إصلاحات أو تحسينات.** التنفيذ يبدأ فقط بقرار المالك الصريح بالبنود المعتمدة.

- الرأس المراجع: `a5500c9` (شجرة `05f344b`) — 2026-10-07.
- التكليف: `prompts/SAMSUNG-ONEUI-MICRO-AUDIT-ZAI.md` · حزمة المراجع: `references/samsung-one-ui/`.
- الفريق الفعلي: 5 وكلاء فرعيين حقيقيين (4 نطاقات + مستقل) + القائد المنسق؛ Chromium 143 headless + لوحة مفاتيح حقيقية؛ آلية 200% معلنة بمرورين (ليست native zoom).

## الملفات

| الملف | دوره |
|---|---|
| [REPORT.md](REPORT.md) | التقرير الموحد العربي القابل لاتخاذ القرار |
| [FINDINGS.json](FINDINGS.json) | 32 نتيجة موحدة SUI-001..SUI-032 (10 BUG / 16 IMPROVEMENT / 6 DECISION) + 52 KEEP + خطة الدفعات |
| [COVERAGE.csv](COVERAGE.csv) | تغطية 14 عائلة × الأنواع والحالات (50 صفًا؛ REVIEWED/PARTIAL/NOT RUN بأسبابها) |
| [SOURCE-READING-LOG.md](SOURCE-READING-LOG.md) | ما قُرئ فعلًا من مراجع Samsung الـ41 (+PDF) بأقسامه |
| [INDEPENDENT-REVIEW.md](INDEPENDENT-REVIEW.md) | تحقق المراجع المستقل: 10/10 CONFIRMED + تحقق القائد |
| [agents/](agents/) | تقارير الأدوار الخمسة + PROTOCOL.md (قواعد العمل الملزمة) |
| [evidence/](evidence/) | الأدلة القابلة لإعادة التشغيل: probes + JSON + لقطات (مسماه بالحالة والمقاس) + leader/ (قياسات القائد) + README لبيانات كل وكيل |

## بنود سابقة (معروفة مفتوحة — مؤكدة لا مكتشفة)

SUI-001 = CAL-R1-01 (موسّع لمسار الحذف أيضًا) وSUI-009 = CAL-R1-02 من `reviews/ORDER-SCHEDULE/CHATGPT-REVIEW-R1.md`؛ SUI-030/SUI-031 سياق محدث لقراري CAL-D1/D2.

## حدود صريحة

أجهزة فعلية/S25/لمس/TalkBack/VoiceOver/WebKit/native zoom/safe-area/رجوع النظام/LTR — **NOT RUN** (تفصيلها في COVERAGE.csv وREPORT.md §5). لا ادعاء امتثال One UI أو WCAG شامل؛ VLM مساعد والقياس DOM يحكم.
