# أدلة الوكيل 1 — SUI-R2-A1 (SUI-R1-01 بوابة الدخول) — جولة SAMSUNG-ONEUI-REPAIR-R2

الملكية: الوكيل 1 وحده. المصدر المرجعي `be5263c` (رأس main عند بدء الجولة).
المتصفح: Chromium 143.0.7499.4 (`/home/z/my-project/evidence/bin/chromium`) عبر Playwright sync headless.
الخادم: ThreadingHTTPServer من جذر المستودع، نطاق منافذ الوكيل 1 (4400-4419).

## المحتوى

- `before-results.json` / `before-summary.txt` / `screenshots/before-*.png` — تشغيل `--tag before` على الشجرة النظيفة `be5263c` (المصدر بلا تعديل؛ غير المتتبع الوحيد: الأداة نفسها): **15/30** — 15 فشلًا يعيد إنتاج عيب SUI-R1-01 بأرقام (انظر الملخص).
- `after-results.json` / `after-summary.txt` / `screenshots/after-*.png` — تشغيل `--tag after` بعد الإصلاح (5 ملفات مملوكة معدلة): **30/30** PASS، خروج 0.
- `a3-regression/` — رجعية أداة R1 للوكيل 3 `tools/sui-repair-a3-check.py --phase after` (نصوص البوابة SUI-013/014 وقناتها): **57/57 PASS**. (الأداة بلا وسيط `--out` — شُغّلت بمخرجها الافتراضي التاريخي ثم نُسخت كاملة إلى هنا وأُعيد `reviews/SAMSUNG-ONEUI-REPAIR-R1/` إلى حالته بـ`git restore` — تحقق git status بعدها: صفر تغييرات في المسار التاريخي.)
- `f03-regression/` — رجعية `tools/ux-f03-check.py --out …` (الوسيط الفعلي `--out`): **45/46 مسارًا، 207 تحقيقًا، صفر أخطاء صفحة وموارد**. الفشل الوحيد F03-44 «فحص البناء الحتمي يمر» لأن `standalone.html` صار متقادمًا بعد تعديل `example.js` (قسم bindGateway) — إعادة البناء مسؤولية القائد عند الدمج ثم يعود PASS.
- `concepts-preexisting/` — `tools/concepts-check.py` على الشجرة النظيفة `be5263c` (خادم 4404 + chromium في PATH عبر `PATH=/home/z/my-project/evidence/bin:$PATH MICRO_TEST_BASE=…`): **154/155** — الفشل الوحيد مسبق: «Unwired submit does not claim real login» (توقع حرفي قديم «لا توجد خدمة مصادقة»).
- `concepts-after/` — نفس الأداة على الشجرة المصلحة: **154/155** بنفس الفشل الوحيد المسبق — أي أن الفشل ليس من تغيير الوكيل (نص المسار بلا معالج لم يُمس).

## إعادة التشغيل

```sh
python3 tools/sui-r2-a1-check.py --tag before --out reviews/SAMSUNG-ONEUI-REPAIR-R2/evidence/agent1
python3 tools/sui-r2-a1-check.py --tag after  --out reviews/SAMSUNG-ONEUI-REPAIR-R2/evidence/agent1
python3 tools/sui-repair-a3-check.py --phase after        # ثم انسخ مخرجاته هنا وgit restore للمسار التاريخي
python3 tools/ux-f03-check.py --out reviews/SAMSUNG-ONEUI-REPAIR-R2/evidence/agent1/f03-regression
PATH=/home/z/my-project/evidence/bin:$PATH MICRO_TEST_BASE=http://127.0.0.1:4403 python3 tools/concepts-check.py
```

NOT RUN: أجهزة فعلية/لمس، TalkBack/قارئ شاشة فعلي، WebKit، native zoom — القياس DOM برمجي في Chromium headless.
