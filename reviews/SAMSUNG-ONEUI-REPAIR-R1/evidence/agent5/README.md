# أدلة الوكيل 5 — المراجع المستقل (SAMSUNG-ONEUI-REPAIR-R1)

## بيانات وصفية

- **رأس الشجرة عند التشغيل:** `eacfe8ac700a995d76ca450fc2aaca6f7530762a` (`git rev-parse HEAD`) — شجرة العمل تحمل إصلاحات الجولة غير المدفوعة (51 ملفًا متتبعًا معدلًا من الوكلاء 1-4 + أدوات `sui-repair-a*-check.py` غير متتبعة؛ لم يضف الوكيل 5 أي تعديل متتبع).
- **المتصفح:** Chromium **143.0.7499.4** — `/home/z/my-project/evidence/bin/chromium` (launch headless مع `--no-sandbox --disable-dev-shm-usage`).
- **الخادم:** ThreadingHTTPServer خاص على **المنفذ 4500** (نطاق احتياطي 4500-4519) يقدم جذر المستودع — نمط `tools/sui-repair-a4-check.py`.
- **محاكاة 200%:** **مروران (ZOOM2_CLEAN):** قياس `computed font-size` لكل عنصر ثم مضاعفتها inline ثم إعادة القياس — نفس عقد لوحة المعاينة وأدوات الجولة (لا مضاعفة موريثة؛ حارس `dataset.r2z`).
- **تاريخ التشغيل النهائي:** 2026-10-07 23:27 تقريبًا (UTC بعامل محلي) — تشغيل واحد نهائي بعد تصحيحين في السكربت نفسه (قراءة نسخة المتصفح كخاصية، وإدخال المقطع في مجال الرؤية قبل hit-test، وفتح لوحة يوم الحقن في H).

## البنية

```
evidence/agent5/
├── README.md                     ← هذا الملف
├── checks/agent5-verify.json     ← كل أرقام A..I خام (القياس الحاكم)
├── checks/vision-*.json          ← مخرجات z-ai vision (مساندة فقط)
├── scripts/agent5-verify.py      ← السكربت الواحد (A..I)
├── scripts/harness/              ← هارنسات جاهزة من محاولة سابقة منقطعة (لم تُستخدم — القياس على الصفحات الحقيقية)
├── screenshots/                  ← لقطات الحالة-المقاس (انظر أدناه)
├── f03-reg/                      ← رجعية ux-f03-check (46/46 و207 تحقيقًا)
└── regression/repair-regression/ ← نسخة محفوظة من مخرجات repair-regression (301/301) قبل git restore للأدلة التاريخية
```

## اللقطات (تسمية حالة-مقاس)

| الملف | ما فيه |
|---|---|
| `A-toast-delete-320-200pct.png` | توست الحذف عند 320+200% (navbar ظاهر) |
| `A-toast-orderform-320-200pct.png` | توست حفظ الطلب من نموذج الجدولة عند 320+200% |
| `A-toast-crop-320-200pct.png` | قصاصة التوست للقراءة البصرية |
| `B-selectbar-320-1x.png` | شريط التحديد 320 عند 1× (53px) |
| `B-selectbar-320-200pct.png` | شريط التحديد 320+200% (overlap=0) |
| `B-selectbar-crop-320-200pct.png` | قصاصة الشريط للقراءة البصرية |
| `D-fields-320-200pct.png` | حقول الكمية/المبلغ عند 320+200% |
| `E-seg-wrapped-320-200pct.png` | المقطع الملفوف 3 صفوف عند 320+200% |
| `G-peek-first-reveal-390.png` | أول كشف peek في التقارير عند 390 |
| `G-peek-after-resize-320.png` | إعادة التوسيط بعد 390→320 بلا تفاعل |

## كيفية إعادة التشغيل

```bash
cd /home/z/my-project/micro-ui-design-system
python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent5/scripts/agent5-verify.py
# يكتب checks/agent5-verify.json ويلتقط اللقطات ويطبع الملخص.
# (يفتح منفذ 4500 تلقائيًا؛ يغلق الخادم عند الانتهاء)

# الرجعيتان (كما في الجولة):
python3 tools/ux-f03-check.py --out reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent5/f03-reg
node tools/repair-regression.cjs --chromium-path /home/z/my-project/evidence/bin/chromium
# ملاحظة: repair-regression يكتب فوق reviews/AFTER-DIRECTION/repair التاريخية —
# انسخ المخرجات ثم `git restore reviews/AFTER-DIRECTION/` (كما فُعل هنا).
```

## حكم المنهج

القياس البرمجي (getBoundingClientRect/getComputedStyle/elementFromPoint/MutationObserver) هو **الحاكم**؛ القراءة البصرية عبر VLM (`z-ai vision`) مساندة فقط وقد أُثبت محدوديتها في قراءة النص العربي الصغير (وثّقت كما هي).
