# بوابات إقفال مكتبة المكونات

التنفيذ منaed8bce مع شجرة الإصلاح الحالية؛ source hashes تربط الأدلة بالمصدر النهائي. الهاتف Light360×780 RTL،320/LTR موجهتان فقط، لا Dark أو خدمات أو جهاز فعلي.

| البوابة | الأمر من جذر المكتبة | النجاح | الإخفاق |
|---|---|---|---|
| mobile | `python3 tools/mobile-capabilities-check.py --out /tmp/output/mobile` | 54 | 0 |
| visual | `python3 tools/visual-closure-check.py --out /tmp/output/visual` | 31 | 0 |
| units | `python3 tools/unit-context-check.py --out /tmp/output/units` | 22 | 0 |
| audit | `python3 tools/component-audit-check.py --out /tmp/output/audit` | 67 | 0 |
| shared | `python3 tools/shared-actions-check.py --out /tmp/output/shared` | 40 | 0 |
| readable | `python3 tools/readable-source-check.py --out /tmp/output/readable` | 85 | 0 |
| acceptance | `python3 tools/readable-acceptance-check.py --out /tmp/output/acceptance` | 59 | 0 |
| data | `python3 tools/light-data-check.py --review-scope --out /tmp/output/data` | 40 | 0 |
| families | `python3 tools/ux-continuation-phase3-check.py --out /tmp/output/families` | 84 | 0 |
| release | `python3 tools/light-release-check.py --review-scope --out /tmp/output/release` | 35 | 0 |
| calendar | `python3 tools/light-calendar-check.py --review-scope --out /tmp/output/calendar.json` | 126 | 0 |
| calendar-contract | `python3 tools/calendar-contract-check.py --out /tmp/output/calendar-contract` | 41 | 0 |
| consumption | `python3 tools/component-consumption-contract-check.py --out /tmp/output/consumption` | 37 | 0 |
| clones | `python3 tools/clone-lifecycle-check.py --out /tmp/output/clones` | 31 | 0 |
| compositions | `python3 tools/composition-recipes-check.py --out /tmp/output/compositions` | 91 | 0 |
| boundaries | `python3 tools/integration-boundaries-check.py --out /tmp/output/boundaries` | 77 | 0 |
| runtime | `python3 tools/preview-runtime-check.py --base <preview-server-base> --review-scope --standalone-http --out /tmp/output/runtime` | 28 | 0 |
| product-context | `python3 tools/product-context-check.py --out /tmp/component-closure/product` | 238 | 0 |

**المجموع: 1186 ناجح/0 إخفاق في18 بوابة متصفح.**

Runtime يحتاج خادم معاينة محليًا ويمرر عنوانه لـ--base؛ بقية السكربتات ترفع خادمًا مؤقتًا. Raw process-exits.json يثبت مخارج العمليات، وملفات JSON الفردية تحفظ assertions وبصمات المصدر كما أخرجتها الأدوات. لا تختلط أرقام evidence القديمة منaed8bce بهذا التشغيل.

فحص جديد للسجل داخل Workspace نفسه يحفظ هوية المسودة؛ فحص سحب visibility يثبت زوال العنوان السابق وعدم إرساله. before.json يسجل إعادة إنتاج العيبين قبل إصلاحهما، ولا بيانات منتج حقيقية.

الكتالوج14/8/12 PASS؛ standalone مطابق byte-for-byte و24 أيقونة مطابقة؛ ملفات مراجعة الرسوم/الطلبات/الحالات المولدة كلها byte-identical PASS. فحص MANIFEST وgit diff --check بعد ختم الأدلة مطلوبان قبل commit، ولا تحرير يدوي للملفات المولدة.

Static Light النهائي: **368/368 PASS**؛ compile Python/JavaScript، بنيةCSS والتوكنز والروابط والهوية وحدودdiff. [السجل الخام](static.json) يحتفظ بكل نتائج الفحص؛ بصمات evidence وMANIFEST مستثناة من هذا السجل لتجنب المرجع الذاتي، وMANIFEST يختمها. تحققMANIFEST وgit diff --check للشجرة والفهرس: PASS قبلcommit. لا تغيير assets/shared مقابلmain280b33b، ولا Dark execution.
