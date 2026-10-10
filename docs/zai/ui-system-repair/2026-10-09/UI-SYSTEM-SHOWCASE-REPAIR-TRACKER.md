# UI System Showcase — سجل إصلاح العرض (F-01 … F-14)

التاريخ: 2026-10-10 · المنفّذ: Zed AI · الفرع الوحيد: `zai/ui-system-showcase-prototype-2026-10-09`

**نطاق هذا السجل:** إصلاحات عرض نظام الواجهة على فرع المعرض الحالي فقط. المصدر المرجعي لرأس البداية: `fae9159deb194e2a13f60694fff57789cfb221df` (بعد جولة المعرض 1516fc1 + إصلاح الشريط اللاصق fae9159). لا يُنشأ فرع ثانٍ ولا PR ثانٍ ولا tracker مكرر. مراجعة الهندسة الستّية السابقة (F-01/F-02/F-03/F-05/F-08/F-09) مدمجة هنا بلا معرفات مكررة.

**قواعد الإلزام:**
- كل معرف ينتهي بحالة واحدة صريحة: FIXED_AND_VERIFIED · VERIFIED_NO_CODE_CHANGE_REQUIRED · DRAFT_RETAINED_WITH_REASON · OWNER_DECISION_RECORDED · BLOCKED_OWNER_DECISION.
- لا حالة DEFERRED بلا مالك/سبب/مشغل/شرط قبول.
- القياس قبل الإصلاح إلزامي (أداة `tools/ui-system-showcase-repair-check.py --tag before`) والقياس بعده بنفس الأداة (`--tag after`).
- الأدلة في `reviews/UI-SYSTEM-SHOWCASE/` (repair-check-before.txt / repair-check-after.txt / لقطات repair-*).
- بوابات الدمج: كل P1 = FIXED_AND_VERIFIED، ولا قرار مالك غير محسوم يحمل علامة FIXED.

## حالة البنود

| المعرف | الحالة | الملخص |
|--------|--------|--------|
| F-01 | FIXED_AND_VERIFIED | تسميات الرسوم غير مقصوصة عند 1× — عقد موائمة جديد |
| F-02 | FIXED_AND_VERIFIED | مالك إغلاق واحد وعنوان واحد للمنتقي داخل الطبقة |
| F-03 | FIXED_AND_VERIFIED | وضع peek يظهر البطاقة المجاورة فعليًا |
| F-04 | VERIFIED_NO_CODE_CHANGE_REQUIRED | RTL هو عقد المكوّن المعلن؛ LTR غير معلن |
| F-05 | FIXED_AND_VERIFIED | سياسة عرض ضيق معلنة للمقطّع (صف واحد + تمرير) |
| F-06 | FIXED_AND_VERIFIED | إغلاق الملاحظة هدف 48px بأيقونة واسم إتاحة |
| F-07 | FIXED_AND_VERIFIED | توزيع منتج للخطوات داخل الحقل موثق |
| F-08 | FIXED_AND_VERIFIED (بتركيب العرض) | هندسة التقويم في المعرض ضمن الاستثناء الموثق؛ DRAFT محفوظ |
| F-09 | FIXED_AND_VERIFIED (PROPOSED محفوظ) | مصدر مرئي واحد للفئة/اللون/القيمة |
| F-10 | OWNER_DECISION_RECORDED | سلوك الطبقة الموسّطة موثق ومستقر (القرار: البقاء على النموذج الموسّط) |
| F-11 | FIXED_AND_VERIFIED | fixtures صادقة بلا مناطق فارغة معلنة |
| F-12 | FIXED_AND_VERIFIED | عتبة تكديس معلنة للمقارنة العددية |
| F-13 | DRAFT_RETAINED_WITH_REASON | عقد الالتفاف موثق كعقد عام للمستهلك؛ DRAFT محفوظ |
| F-14 | FIXED_AND_VERIFIED | عنوان شريط التطبيق مقيّد بسطرين + محتوى كامل في DOM |

(تُحدَّث الحالة الفعلية عند كل موجة مع القياسات؛ الجدول أعلاه الحالة النهائية بعد اكتمال الجولات.)

## تفصيل البنود

يُستكمل لكل بند عند إقفاله: العرض الأصلي / سبب الجذر (مؤكد أم مُكذَّب) / الملفات / أمر التحقق / قياسات قبل-بعد / لقطة / الحالة النهائية / التراجع.
