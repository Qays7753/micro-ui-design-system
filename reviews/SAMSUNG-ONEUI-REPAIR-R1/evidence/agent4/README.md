# أدلة الوكيل 4 — البيانات والعرض والجدولة (SAMSUNG-ONEUI-REPAIR-R1)

## بيانات وصفية

- **الرأس المرجعي (بداية الجولة):** `eacfe8ac700a995d76ca450fc2aaca6f7530762a` (tree `11d196e330dc1f592508e59c7be5e3facd4d4a9b`).
- **حالة الشجرة وقت الفحص:** غير نظيفة (عمل وكلاء متوازٍ في جولة الإصلاح — تسجَّل قائمة dirty_files الفعلية داخل كل JSON أدلة لحظة تشغيله). ملفات الوكيل 4 المتعديّة في كل الفحوص: `components/info-strip/{info-strip-peek.js, specification.md}` · `components/carousel/{carousel.js, specification.md}` · `components/data/{data.css, specification.md}` · `components/order-schedule/specification.md` · `previews/ux-patterns/order-schedule/{order-store.js, example.js, example.css, index.html, README.md}` · `previews/info-strip/comparison.html` — كلها داخل ملكية الوكيل 4 في MATRIX.md. أدوات الوكيل المعدّلة: `tools/{sui-repair-a4-check.py, order-schedule-check.py, a05-peek-check.py, b05-screenshots.py, carousel-screenshots.py, data-scale-state-check.py}` (كلها ملكه).
- **المتصفح:** Chromium **143.0.7499.4** — `/home/z/my-project/evidence/bin/chromium` عبر Playwright (sync) في كل أدوات الوكيل وسكربتات الأدلة؛ الأداة المشتركة `repair-regression.cjs` عبر `--chromium-path` نفسه (node v24.21.0) و`ui-repair-r2-check.py` بمحرك Playwright المثبت.
- **الخوادم:** خادم ThreadingHTTPServer مدمج لكل أداة على منفذ من **نطاق الوكيل 4 (4400-4419)**: a4-check 4405 (ورجعيات 4400/4401/4402/4403/4404 وسكربتات 4406/4407). استثناءان موثقان: الأداتان المشتركتان تملكان خادميهما بمنفذ تلقائي (لا تُعدلان).
- **آلية تكبير النص 200% (ZOOM2_CLEAN):** محاكاة نص ×2 **بمرورين نظيفين** — قراءة computed font-size لكل عنصر (مرور أول) ثم مضاعفتها inline (مرور ثانٍ) كي لا تتضاعف الموروثة — **ليست native zoom** ولا zoom نظام (موثقة في رأس كل أداة وJSON).
- **المقاسات:** 320/360/390/430 CSSpx + RTL أصلي للصفحات العربية.
- **NOT RUN:** أجهزة فعلية/لمس · TalkBack/قارئ شاشة فعلي · WebKit/Safari · native zoom.

## بنية المجلدات

```
evidence/agent4/
├── README.md                    ← هذا الملف
├── checks/                      ← فحص الوكيل sui-repair-a4-check.py (جلسة المنفذ)
│   ├── before-results.json / before-summary.txt        (7/34 — عيوب معاد إنتاجها)
│   ├── after-results.json / after-summary.txt          (34/34)
│   ├── probe-before.json         (أرقام إعادة إنتاج SUI-007/025/008/024/017/009 الخام)
│   └── sui008-before-sim.json    (لوحة data: 14 عنصرًا خارج العرض قبل الإصلاح → 0 بعده)
├── screenshots/                 ← 24 لقطة قبل/بعد/probe بالحالة والمقاس (320 أساسًا + 200%)
├── re-verify/                   ← إعادة فحص الوكيل المستقلة (جلسة الإكمال): 34/34
├── regression/                  ← رجعيات جلسة الإكمال (كلها بمخرجات معزولة — لم تُكتب فوق الأدلة التاريخية)
│   ├── order-schedule-pre-update/   (order-schedule-check قبل تحديث fixtures: 10/16 — 239)
│   ├── order-schedule/              (بعد التحديث: 15/16 — 267؛ الفشل الوحيد = بناء standalone للقائد)
│   ├── a05-peek/                    (24/24)
│   ├── b05/                         (26/26)
│   ├── carousel/                    (53/53)
│   ├── data-scale-state/            (23/23)
│   ├── repair-regression/           (مشتركة node: 301/301)
│   ├── ui-repair-r2/                (مشتركة python: 130/130 + stdout.txt)
│   ├── functional/                  (تحقق وظيفي: 11/11 — المسار النظيف + ?fixtures=edge + F03)
│   └── family-metric-comparison/    (مسبار KEEP لعائلة E03: 4/4)
└── scripts/                     ← سكربتات أدلة قابلة لإعادة التشغيل
    ├── a4_probe_before.py        (جلسة المنفذ — probe-before.json)
    ├── a4_sui008_before_sim.py   (جلسة المنفذ — sui008-before-sim.json)
    ├── a4_functional_verify.py   (جلسة الإكمال — functional/)
    └── a4_family_metric_probe.py (جلسة الإكمال — family-metric-comparison/)
```

## أوامر إعادة التشغيل (من جذر المستودع)

```bash
# فحص الوكيل (before يعيد إنتاج العيوب — على شجرة ما قبل إصلاحات الوكيل فقط)
python3 tools/sui-repair-a4-check.py --stage after \
  --out reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent4/re-verify --port 4405

# رجعية جدول الطلبات (CAL-01..15 + AGG) — بعد تحديث fixtures (عقد SUI-009)
python3 tools/order-schedule-check.py \
  --out reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent4/regression/order-schedule --port 4400
# النسخة قبل التحديث (توثيق الفشل المرتبط بالبذرة النظيفة) محفوظة في order-schedule-pre-update/

# رجعيات info-strip / data / carousel / data-scale
python3 tools/a05-peek-check.py          --out .../regression/a05-peek          --port 4401
python3 tools/b05-screenshots.py         --out .../regression/b05               --port 4402
python3 tools/carousel-screenshots.py    --out .../regression/carousel          --port 4403
python3 tools/data-scale-state-check.py  --out .../regression/data-scale-state  --port 4404

# سكربتات الأدلة (منافذها مضمّنة: 4406 و4407)
python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent4/scripts/a4_functional_verify.py
python3 reviews/SAMSUNG-ONEUI-REPAIR-R1/evidence/agent4/scripts/a4_family_metric_probe.py

# الأداتان المشتركتان (لا وسيط إخراج لهما — انظر الملاحظة أدناه)
node tools/repair-regression.cjs \
  --playwright-module /home/z/node_modules/playwright \
  --chromium-path /home/z/my-project/evidence/bin/chromium
python3 tools/ui-repair-r2-check.py
```

## ملاحظات تشغيل الأداتين المشتركتين (أمانة توثيق)

- كلا الأداتين تكتب في أدلة تاريخية متتبعة (`reviews/AFTER-DIRECTION/repair/` و`reviews/UI-SOURCE-REPAIR-R2/`) بلا وسيط إخراج، ولا يجوز تعديلهما (ملك القائد).
- الإجراء المتبع (نفس سابقة الوكيل 3 في جولته): تشغيل في مكانه → نسخ المخرجات **كاملة** (results/verification + screenshots + stdout) إلى `regression/repair-regression/` و`regression/ui-repair-r2/` → إعادة الملفات التاريخية المتتبعة إلى حالتها بالضبط (`git restore` للمسارين — **بلا commit/push/branch**) → تحقق `git status` بعدها: **صفر تغييرات متتبعة** في المسارين.
- `reviews/UI-SOURCE-REPAIR-R2/screenshots/r3-*.png` الستة غير المتتبعة هي بقايا تشغيل الوكيل 3 (21:56 UTC) لنفس الأداة؛ إعادة تشغيلنا جدّدتها **مطابقة بايت-ببايت** (diff SAME) — بلا أي أثر على المحتوى المتتبع.
- النتيجتان: **repair-regression 301/301** · **ui-repair-r2 130/130** — صفر فشل مرتبط بعقود الوكيل 4 الجديدة (SUI-007/009/025)، لذا لا سطر مقترح لتعديل أي أداة مشتركة.

## خلاصة النتائج (أرقام فعلية من JSONs أعلاه)

| الفحص | قبل | بعد / إعادة التحقق |
|---|---|---|
| sui-repair-a4-check (بنود الوكيل) | 7/34 | **34/34** ثم re-verify **34/34** |
| order-schedule-check (رجعية) | 10/16 (239 تحقيقًا — قبل تحديث الأداة) | **15/16 (267 تحقيقًا)** — الفشل الوحيد: بناء standalone الحتمي (القائد يعيد البناء ثم يتوقع 16/16) |
| a05-peek-check | — | **24/24** (بلا تعديل توقع) |
| b05-screenshots | — | **26/26** |
| carousel-screenshots | — | **53/53** |
| data-scale-state-check | — | **23/23** |
| repair-regression.cjs (مشتركة) | — | **301/301** |
| ui-repair-r2-check.py (مشتركة) | — | **130/130** |
| تحقق وظيفي (نظيف/fixtures/F03) | — | **11/11** |
| مسبار metric-comparison | — | **4/4** |

**بنود الوكيل:** SUI-007/008/009/024/025 FIX · SUI-017(جزء data) IMPROVE · SUI-030/031 NEEDS OWNER DECISION (سياق مقيس بلا تغيير سلوك) — التفصيل الكامل بالأرقام في `../../agents/agent4-data-scheduling.md`.
