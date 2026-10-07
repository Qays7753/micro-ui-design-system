# بروتوكول عمل الوكلاء — تدقيق Samsung One UI × Micro

**المرجع الأساس لهذا الملف:** `prompts/SAMSUNG-ONEUI-MICRO-AUDIT-ZAI.md` (التكليف) و`references/samsung-one-ui/MICRO-ADAPTATION.md` (حدود التكييف). الرأس المراجع: `a5500c9` (شجرة `05f344b`). هذا التدقيق **مراجعة وتقرير فقط — لا إصلاحات**.

## قواعد نافذة لكل وكيل

1. **لا تعديل أي ملف داخل المستودع عدا ملف عملك** `reviews/SAMSUNG-ONEUI-AUDIT/agents/<role>.md` وأدلتك تحت `reviews/SAMSUNG-ONEUI-AUDIT/evidence/<role>/`. ممنوع لمس `components/` أو `previews/` أو `shared/` أو `docs/` أو أي أداة قائمة.
2. **كل BUG يحتاج إعادة إنتاج على المصدر الحالي** (a5500c9): خطوات + بيانات + مقاس viewport + السلوك المتوقع/الفعلي. رصد DOM/CSS/SVG مقيسًا عبر Playwright + Chromium (`/home/z/my-project/evidence/bin/chromium`) أو قراءة المصدر المباشرة.
3. **افصل الطبقات:** SHARED (shared/tokens.css, motion.css) / COMPONENT (components/*) / COMPOSITION (previews/*, F03) / PLATFORM / DOC-CONTRACT. لا تنسب عيب العينة للمكتبة دون مثال مستقل يثبت ذلك، والعكس صحيح.
4. **ميّز:** حقيقة مقيسة (F) / سبب محتمل (R) / تفضيل أو فرضية (PROPOSED/HYPOTHESIS). غير المثبت ليس BUG.
5. **قواعد Micro محفوظة:** RTL وأرقام 0–9 وهاتف فقط ووضع فاتح؛ الهوية والألوان (petroleum/mint/ivory/apricot) وIBM Plex وHugeIcons Stroke Rounded؛ لا تراكوتا/dark mode/بطاقات في كل مكان؛ زر التصفية + اللوحة قرار قائم؛ صحة القيم والصفر/المجهول؛ قاعدة لمس 48px قائمة (استثناء خلية الشهر 37.7px عند 320 هو PROPOSED قائم — لا تعتمده ولا تخفضه).
6. **One UI إرشاد منصة لا معيار عالمي.** لا تنسخ dp/sp إلى CSSpx، لا تفرض هامش 24dp أو عنوان ضخم أو dark mode. فرّق: إرشاد Samsung / WCAG / قرار Micro / ذوق. لا تدّعِ فحص هاتف حقيقي أو TalkBack/VoiceOver أو WebKit أو native zoom — اكتب NOT RUN.
7. **مراجع Samsung المقروءة محليًا:** `/home/z/my-project/oneui-reading/S<NN>.txt` (نص مستخرج من HTML الرسمي) و`S37.txt` (PDF 93 صفحة، داخليًا 2019-10-29 — مرجع سياقي قديم ليس أحدث إصدار). اقرأ ما يخص نطاقك فعلًا وسجّل ما قرأته بأقسامه. الاقتباس القصير مسموح؛ لا تنسخ صفحات كاملة إلى المستودع.
8. **المقاسات:** 320/360/390/430 CSSpx + تغيير 430→320 دون إعادة فتح + نص 200% (مروران نظيفان: حدّد قبل/بعد) + reduced-motion + لوحة مفاتيح حقيقية + حالات (default/selected/disabled/readonly/loading/empty/error/success/unknown حيث تنطبق).
9. **اللقطات:** فقط إذا كانت الحالة المعنية ظاهرة فيها. سجل في اسم الملف الحالة والمقاس. ضعها في `evidence/<role>/` مع metadata: commit/tree/طريقة القياس/الأداة.
10. **مخرجاتك:** ملف `agents/<role>.md` بالعربية، فيه لكل ملاحظة: ID محلي (مثل V1, I2, N3, D4) + النوع (BUG/IMPROVEMENT/DESIGN DECISION/PLATFORM NOT RUN/KEEP) + الحقيقة المقيسة + الطبقة المسؤولة + الأثر على مستخدم Micro + المرجع (S<NN> + عنوان القسم) + الملف/السطر + الثقة + الحل المقترح (أقل تعقيدًا) + معيار قبول قابل للقياس + أولوية مبدئية P0-P3. **KEEP صريح للأشياء الجيدة.**
11. **اذكر بصدق الأدوات التي استخدمتها** (Playwright/Chromium/قراءة مصدر/حساب يدوي) وما لم تستطع تنفيذه.
12. **ابدأ بقراءة** `/home/z/my-project/worklog.md` (آخر قسم SUI-0) ثم ملفات البروتوكول هذه. عند الانتهاء أضف قسمك إلى worklog بالقالب المعتمد (Task ID وAgent وWork Log وStage Summary).

## نصائح فنية

- شغّل صفحات المثال المستقل مباشرة من `components/<family>/example-usage.html` أو عبر خادم محلي من جذر المستودع (`python3 tools/preview-server.py` موجود إن احتجته) — لكن لا تعدّل شيئًا.
- للقياس: `page.evaluate()` مع `getBoundingClientRect()` / `getComputedStyle()`؛ للرسوم: قياس نصوص SVG الفعلية (`getBBox()` / computed font-size) بعد resize.
- ثبّت نتائج JSON تحت `evidence/<role>/` — القائد سيحوّلها إلى FINDINGS.json موحد.
- لتكبير النص 200%: استعمل آلية معلنة (مثلًا تعديل `font-size` الجذر أو محاكاة text zoom عبر `page.style` — وثّق الآلية بالضبط؛ لا تدّعِ أنها native zoom).
- الوقت محدود: ركّز على أعلى القيمة لعائلاتك؛ اجرد الحالات التي لم تفحصها بصدق (PARTIAL/NOT RUN) بدل ادعاء تغطية كاملة.
