# بوابات التحقق الفعلية — Light

Chromium156.0.8078.79، هاتف360×780 RTL؛320/LTR موجهتان فقط حيث توضح البوابة. لا تنفيذ Dark أو backend أو جهاز فعلي. sourceCommitAtRun/commitAtRun تشير إلى280b33b مع working tree المعدّل، وبصمات الملفات تربط النتائج بالمصدر الجديد. لا يُفسَّر commit البداية على أنه مصدر سليم بلا هذه التغييرات.

| البوابة | الأمر من جذر المكتبة | نجاح | إخفاق |
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
| product-context | `python3 tools/product-context-check.py --out /tmp/product-context` | 230 | 0 |

**مجموع assertions المتصفح: 1178 ناجح /0 فاشل، في18 بوابة.** المرور ليس شهادة تفويض أو جاهزية تطبيق.

بوابات الملفات الحتمية والساكنة تسجل بعد إنشاء الأدلة النهائية أدناه. خادم runtime محلي من `python3 tools/preview-server.py`؛ استخدم عنوانه لـ`--base`. بقية سكربتات المتصفح ترفع خادمًا مؤقتًا بنفسها.

تشغيل مرحلي محفوظ في intermediate-run.json:217 ناجح/0 فاشل قبل إضافة فحص الحاضن القابل للتركيز. ليس دليل إقفال؛ توسيع التغطية كشف عيب Fields فأُصلح. إخفاقات تطوير سابقة في هندسة الحقول والـprefill صُححت قبل هذا التشغيل، ولم تُحفظ نتائجها الخام داخل هذا الملف. replay مصدر Fields القديم داخل البوابة النهائية يثبت العيب قبل إصلاحه دون تبديل شجرة Git.

## الملفات والبناء

- الكتالوج:14 عائلة/8 متغيرات/12 تركيبًا؛ تحقق المسارات ومطابقة الفهرس والـpayload PASS.
- standalone: مطابق لإعادة التوليد بايت-ببايت؛ فحص الأيقونات24 رمزًا مطابقًا PASS.
- ملفات مراجعة الرسوم/الطلبات/الحالات المولدة: جميعها byte-identical PASS.
- Static Light:366/366 PASS في التشغيل النهائي؛ compile Python/JS، بنية CSS، التوكنز والروابط، الهوية، حدود diff والأسرار عالية الإشارة. فحص تعريف Dark هنا ساكن لإثبات بقائه معطلًا؛ لا تشغيل Dark.
- MANIFEST أعيد توليده من المصدر والأدلة، ثم نجح --check؛ لا تحرير يدوي.
- git diff --check للشجرة والفهرس: PASS. assets/shared وتوكنز/أصول Micro الأصلية بلا تغييرات مقابل280b33b.

البوابة الساكنة تلخص هنا، وJSON الخام مع بصمات source محفوظ في static.json؛ حُذفت بصمات evidence نفسها من نسخة الأرشيف لتجنب مرجع hash ذاتي. سجلات assertions لم تُعدّل.
