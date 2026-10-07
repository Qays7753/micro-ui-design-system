# أدلة الوكيل 1 — جولة SAMSUNG-ONEUI-REPAIR-R1 (الأسس والجودة البصرية)

## البيانات الوصفية

| البند | القيمة |
|---|---|
| رأس الشجرة أثناء القياس قبل | `eacfe8ac700a` (main — المصادر المقاسة نظيفة؛ `git status` قبل الإصلاح: ملفات غير متتبعة فقط: مجلد الأدلة + الأداة الجديدة) |
| رأس الشجرة أثناء القياس بعد | `eacfe8ac700a` + تعديلات عمل الوكيل (6 ملفات: previews/organization/index.html، previews/organization/example-usage.html، previews/compositions/index.html، previews/index.css، components/surfaces/specification.md، components/organization/specification.md) |
| المتصفح | Chrome for Testing **143.0.7499.4** — `executable_path=/home/z/my-project/evidence/bin/chromium` (أداة sui-repair-a1-check + b04 + s01؛ أداة b01 المشتركة استخدمت Chromium المثبت مع Playwright وهو النسخة نفسها 143.0.7499.4) |
| الخادم | خادم مدمج خاص (ThreadingHTTPServer) على `127.0.0.1` من نطاق الوكيل 1: **4100** (فحوص a1-check) · **4103** (b04) · **4104** (s01) · **4101** (b01 عبر المشغّل) — لا خادم مشترك |
| محاكاة 200% | ZOOM2_CLEAN بمرورين نظيفين منقولة حرفيًا من `tools/ui-repair-r2-check.py`: قراءة الحجم المرجعي computed font-size لكل عنصر ثم مضاعفته inline ثم إعادة القياس — **محاكاة نص فقط، ليست native zoom** |
| اللغة | عربية · أرقام 0–9 |

## البنية

```
agent1/
├── README.md                     (هذا الملف)
├── checks/                       (أداة الوكيل sui-repair-a1-check)
│   ├── before-results.json       (الأرقام قبل الإصلاح — شجرة نظيفة eacfe8a)
│   ├── before-summary.txt        (23/32 ناجح: بنود SUI الأربعة تفشل كما هو متوقع + اكتشاف S01)
│   ├── after-results.json        (الأرقام بعد الإصلاح)
│   ├── after-summary.txt         (31/32: كل بنود الوكيل ناجحة؛ الفشل الوحيد = اكتشاف خارج الملكية للقائد)
│   ├── pixel-diff.json           (تحليل فرق البكسل قبل/بعد — التغيير موضعي ومحدود)
│   └── screenshots/              (قبل/بعد بالحالة والمقاس: sui026-phones-{320,390,zoom200-390}،
│                                   sui019-{compositions,example-usage}-390، sui021-gallery-head-{1280,390}،
│                                   b01-{types,states}-390، b04-rows-390، s01-{board-current,approved-curves,example-usage}-390)
├── scripts/
│   └── run-b01-redirected.py     (مشغّل أداة B01 المشتركة بلا أي تعديل عليها — توجيه مخرجات فقط)
├── b01/                          (أداة b01-screenshots المشتركة من المصدر: 49/49 ناجح — خرج 0)
│   ├── r2-verification.txt
│   └── screenshots/*.png
├── b04/                          (أداة b04-screenshots بوسيطيّ --out/--port المضافين: 15/15 ناجح)
│   ├── verification.txt
│   └── screenshots/*.png
└── s01/                          (أداة s01-screenshots بوسيطيّ --out/--port المضافين: 35/35 ناجح)
    ├── verification.txt
    └── screenshots/*.png
```

الأداة نفسها (ملك الوكيل): `tools/sui-repair-a1-check.py` — إعادة التشغيل:

```bash
# مرحلة "after" (على شجرة الإصلاح الحالية):
python3 tools/sui-repair-a1-check.py --stage after
# مرحلة "before" (تعيد إنتاج الفشل — تتطلب مصادر eacfe8a النظيفة للملفات الستة؛
# من شجرة العمل الحالية استخدم git stash أو checkout مؤقت قبل التشغيل ثم استرجع):
git stash push -- previews/organization/index.html previews/organization/example-usage.html \
  previews/compositions/index.html previews/index.css components/surfaces/specification.md components/organization/specification.md
python3 tools/sui-repair-a1-check.py --stage before
git stash pop
```

(أو مرر `--root` إلى نسخة عمل نظيفة من `eacfe8a`.) تحليل فرق البكسل القابل لإعادة التشغيل: `scripts/pixel-diff.py`.

## إثبات «يفشل قبل وينجح بعد» (من before-summary/after-summary)

| البند | قبل (FAIL) | بعد (PASS) |
|---|---|---|
| SUI-018 | css=0.12 · §3=0.10 · §5=0.12 (تعارض) | css=0.12 · §3=0.12 · §5=0.12 (تطابق) |
| SUI-026 (320px) | offsetHeight=[40, 40] inlineMin=['40px','40px'] | offsetHeight=[48, 48] (بلا inline) |
| SUI-026 (390px) | offsetHeight=[40, 40] | offsetHeight=[48, 48] |
| SUI-019 (grep) | استخدامان للصنف الميت في ملفيّ الوكيل | صفر استخدام |
| SUI-019 (compositions) | m-section__title · 16px/26px (ميراث) | m-section-title · 18px/28px/600 |
| SUI-019 (مثال مستقل) | m-section__title · 16px/26px | m-section-title · 18px/28px/600 (رأس 68→100px للتفاف العنوان الأطول) |
| SUI-021 (1280) | مخالفات: eyebrow 0.48px · h1 −2.52px | صفر مخالفات (normal) |
| SUI-021 (390) | eyebrow 0.48px · h1 −1.61px | صفر مخالفات |

## لا انحدار (أرقام مقيسة)

- SUI-026: عرض الزرين كما كان (86.52px — بلا تضخيم عرض)، ارتفاع صف التركيب عند 390 كما كان (131.98px) وعند 320 (183.98px)، عمود الهاتف والصفحة بلا فيض أفقي قبل وبعد، فرق البكسل محصور في مستطيل الأزرار (0.84–0.89% من اللقطة).
- SUI-021: صندوقا h1 (740×162.7 عند 1280؛ 358×103.9 عند 390) وeyebrow (1080×26) متطابقان قبل/بعد — صفر انحدار تخطيطي؛ فرق البكسل 0.18% في منطقة eyebrow اللاتينية فقط (MICRO)، ومنطقة h1 العربية بلا أي بكسل متغير (متوافق مع قياس التدقيق V8: لا أثر للتباعد على العربية المتصلة في Chromium).
- SUI-019: رأس الطي في compositions بقي 48px (الأدنى لللمس محفوظ)؛ فحوص المثال المستقل الذاتية 4/4 PASS بعد التغيير؛ في المثال المستقل الرأس نما 68→100px لأن العنوان الطويل (عمدًا) يلتف على أسطر أكثر بحجم 18px — سلوك مقصود وموثق في مواصفة B04.
- رجعية الأدوات القائمة: b04-screenshots 15/15 · s01-screenshots 35/35 · b01-screenshots (مشتركة، من المصدر عبر مشغّل معاد التوجيه) 49/49 — صفر فشل.

## اكتشاف خارج ملكية الوكيل (موثق للقائد — لم يُعدَّل)

- **لوحة S01 §0 «الاتجاه الحالي» لا تحمّل `curves.css`** (`previews/surfaces/index.html` — خارج ملكية الوكيل 1): القياس (قبل وبعد على السواء): `curvesCssLoaded=false`، أرضية `rgb(22,77,89)` بترولية، نص أبيض، و`wavesDisplay=block` — أي أن اللوحة تعرض سطحًا بتروليًا مجردًا بينما تعنون القسم «منحنيات واسعة خافتة (curves.css)». المصادر الصحيحة للاتجاه (approved-curves.html وexample-usage.html) سليمة ومقاسة (7/7). الاقتراح للقائد عند الدمج: إضافة `<link rel="stylesheet" href="../../components/surfaces/curves.css">` بعد surfaces.css في head اللوحة (وفي الملف نفسه: قيمة مقبض «الإضاءة» الافتراضية `value="0.1"` بينما الافتراضي الموثق 0.12 — سطر 125).

## NOT RUN (معلنة)

- هاتف فعلي / Samsung Internet / لمس / TalkBack / قارئ شاشة صوتي.
- WebKit/Safari — خصوصًا سلوك letter-spacing للعربية خارج Chromium (بند SUI-021 أزيل التصريح نفسه فصار محرك-محايد).
- native zoom / zoom نظام — التكبير محاكاة نص ×2 بمرورين نظيفين معلنة.
