# أدلة الوكيل 3 — SAMSUNG-ONEUI-REPAIR-R1 (SUI-A3)

التنقل والتفاعل والرسائل: F03 (عينة الهاتف «العناصر» عدا standalone) + messages B06 + access-gateway E01 + navigation B07 (مواصفة) + filter-lifecycle + previews/navigation + previews/messages.

## البيانات الوصفية

| البند | القيمة |
|---|---|
| رأس git عند الفحص | `eacfe8ac700a995d76ca450fc2aaca6f7530762a` (شجرة HEAD `11d196e330dc1f592508e59c7be5e3facd4d4a9b`) |
| حالة الشجرة | **متعمدة التعديل أثناء موجة الإصلاح** (before على eacfe8a نظيف المنصّة؛ after/re-verify على شجرة العمل) — ملفات ملكية الوكيل المعدلة تُدرج في `git.dirty_owned` داخل كل results.json (12 ملفًا في re-verify) |
| المتصفح | Chromium **143.0.7499.4** عبر `executable_path=/home/z/my-project/evidence/bin/chromium` (Playwright sync API) |
| الخوادم | خادم مدمج ThreadingHTTPServer من نطاق **A3: 4300-4319** — `sui-repair-a3-check.py` بوسيط `--port` (الافتراضي 4301؛ جلسات الإكمال استعملت 4307/4309/4311/4313). أدوات الرجعية الأخرى تفتح منفذًا زمنيًا (ephemeral) داخل جلستها |
| آلية 200% | **ZOOM2_CLEAN**: محاكاة تكبير نص ×2 **بمرورين نظيفين** — قراءة كل المقاسات المحسوبة ثم تطبيق ×2 ثم قراءة ثانية — **ليست native zoom** (معلنة في كل summary) |
| المقاسات | 320/360/390/430 CSSpx + 390/320 مع 200%؛ RTL أساسًا (النصوص عربية) |
| خروج الأدوات | غير صفري عند أي فشل؛ NOT RUN معلنة في summary/results |

## بنية المجلدات

```
evidence/agent3/
├── README.md                 ← هذا الملف
├── family-review.py          ← فحص عائلات المرحلة الثانية (B06/E01/E04) — أصلحه وأشغله وكيل الإكمال
├── family-review.json        ← نتيجته: 6/6
├── before/                   ← إعادة إنتاج البنود على eacfe8a: 23/57 (results.json + summary.txt + screenshots/)
├── after/                    ← قياس ما بعد الإصلاح (جلسة الوكيل المنفذ، 21:51 UTC): 57/57
├── re-verify/                ← إعادة تشغيل مستقلة كاملة بجلسة الإكمال (22:16 UTC): 57/57 + run.log
└── regression/
    ├── repair-regression/    ← node tools/repair-regression.cjs (جلسة الوكيل المنفذ): 301/301
    ├── ui-repair-r2/         ← python3 tools/ui-repair-r2-check.py --root <نسخة> (الوكيل المنفذ): 130/130
    ├── ui-repair-r2-recheck/ ← إعادتها بعد تغييرات جلسة الإكمال (نسخة ب--root): 130/130 + run.log
    ├── ux-f02/               ← python3 tools/ux-f02-check.py --round round-repair-a3 (الوكيل المنفذ)
    │                            نُقل من reviews/UX-F02/round-repair-a3 الشارد: 31/32 (39 لقطة)
    ├── ux-f03/               ← python3 tools/ux-f03-check.py --round repair-a3 (الوكيل المنفذ)
    │                            نُقل من reviews/UX-F03/repair-a3 الشارد: 45/46 (26 لقطة)
    └── ux-f03-recheck/       ← python3 tools/ux-f03-check.py --out <هذا المجلد> (الإكمال): 45/46 + run.log
```

- اللقطات مسماة بالحالة والمقاس (`f03-after-toast-delete-430.png`، `f03-after-selectbar-320-zoom200.png`، `gateway-after-single-error-channel.png`…) — 17 لقطة لكل مرحلة before/after/re-verify.
- الأدلة التاريخية (`reviews/UX-F02/` و`reviews/UX-F03/` المتتبعة) **لم تُمس** — نقلُ المجلدين الشاردين تم ب`mv` و`git status` نظيف لهما بعده (تحقق جلسة الإكمال).

## النتائج المحورية (قبل → بعد → إعادة التحقق)

| القياس | before | after / re-verify |
|---|---|---|
| توست delete-single (320/360/390/430) | 0×0 داخل وجهة مخفية | 280/320/350/390 × 80 (×119 عند 200%) |
| تراكب شريط التحديد @320+200% | 17.98px (53px مثبتة) | 0 (المتغير 70.984375px) |
| مراقب navbar | لا شيء (var=None) | مراقب واحد (navbarRO=1) |
| دور ملاحظة خطأ الحفظ | status | alert (والباقي status) |
| أحداث announce مستقلة بنص واحد | 1+1 (ابتُلعا) | 3+5 (تُعلن) |
| reportValidity الأصلية عند خطأ البوابة | rvCalls=1 | rvCalls=0 |
| أول تركيز في اللوحات الثلاث | زر الإغلاق | خانة الفئة / f02f-q / f-search |
| هامش F03 (320/360/390/430) | 16/16/16/16 | 16/16/20/20 |
| عنوان كتلة F03 | 14/21.99 | 16/24 × 600 |
| انتقال الصف تحت reduce | 0.18s | none (0s) |
| نص الحذف | خبري | سؤال (؟) |
| مدخل المراجعة في البوابة | ظاهر 68.47×48 | مخفي 0×0 |

المجاميع: **before 23/57 · after 57/57 · re-verify 57/57 · family-review 6/6 · repair-regression 301/301 · ui-repair-r2 130/130 (+recheck) · ux-f02 31/32 · ux-f03 45/46 (+recheck)**.

## الفشلان المتبقيان في الرجعيات (موصوفان لا مفسران غيبًا)

1. **ux-f03/F03-44 «فحص البناء الحتمي»** (45/46): `tools/build-f03-standalone.py --check` يفشل لأن `standalone.html` لم يُعد بناؤه بعد تغير المصادر — **محظور على الوكيل إعادة بنائه** (القائد يبنيه عند الدمج ثم يعيد تشغيل الأداة فيصبح المسار PASS). باقي تحققات F03-44 الست تمر (صفر طلبات خارجية عبر file://، الخطوط مضمّنة، الأيقونات، تكافؤ الإقلاع، دورة حفظ كاملة).
2. **ux-f02/F02-32** (31/32): أربع تحققات «نظافة أدلة» تفترض شجرة نظيفة وأدلة B03/B07/F01 مثبتة من مصدر مرجعي — بنية موجة الإصلاح متعددة الوكلاء (شجرة متعمدة التعديل + أدلة الجولة في SAMSUNG-ONEUI-REPAIR-R1) تجعلها تفشل بحكم التصميم حتى الدمج. سطر التعديل المقترح للقائد موثق في تقرير الوكيل §7. كل المسارات الوظيفية F02-01..31 تمر (تشمل لوحة filter-lifecycle المعدلة بSUI-015).

## كيفية إعادة التشغيل

```bash
cd /home/z/my-project/micro-ui-design-system
# فحص الوكيل (قبل/بعد — يكتب إلى evidence/agent3/<phase>/):
python3 tools/sui-repair-a3-check.py --phase after --port 4301
# فحص العائلات (يكتب family-review.json بجوار السكربت):
python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent3/family-review.py
# رجعية F03 إلى مجلد أدلة الوكيل (وليس reviews/UX-F03):
python3 tools/ux-f03-check.py --out reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent3/regression/ux-f03-recheck
# رجعية R2 على نسخة من الشجرة (لحماية الأدلة التاريخية في reviews/UI-SOURCE-REPAIR-R2):
mkdir -p /tmp/a3-r2copy && (tar cf - --exclude=.git --exclude=reviews .) | (cd /tmp/a3-r2copy && tar xf -)
python3 tools/ui-repair-r2-check.py --root /tmp/a3-r2copy
# رجعية F02 (أداة الوكيل 2 — بلا تعديل؛ خرجها التاريخي حول ب--round):
node tools/repair-regression.cjs
```

## تحفظات صادقة

- لا قارئ شاشة فعلي ولا هاتف/لمس ولا WebKit ولا native zoom (كل الأدوار والإعلانات مقيسة DOM/mutations).
- عرض الفقاعة الأصلية لـ`reportValidity` بصريًا غير مفحوص (headless) — يقاس **عدم الاستدعاء** برمجيًا (rvCalls).
- إسناد العمل: الإصلاحات والأدلة الأولى للوكيل المنفذ (انتهت جلسته قبل التوثيق)؛ النقل والتشغيلات الثلاث الإضافية وإصلاح فحص العائلات وانتشار عقد SUI-010 (3 مواضع داخل الملكية) وتوثيقها من جلسة الإكمال — تفصيلها في `agents/agent3-navigation-messages.md` §إسناد صادق و§7.
- ملاحظة عرض: سطر `#f03-select-bar[hidden]` في example.css:299 قد يظهر في بعض مخرجات الأدوات محرفًا («baridden]») — **أثر عرض لا مصدر**؛ البايتات سليمة (تحقق `od -c` + فحص الأداة البايتي ruleExists=true).
