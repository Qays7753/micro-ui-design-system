# تقرير الجولة الثانية — إكمال جاهزية الربط @micro/ui 0.2.0

هذا التقرير يُحدَّث بعد كل مرحلة R0–R9 وفق `PLAN.md` (القسم 5). الحقيقة حرفيًا: لا يُعلن بند مغلق إلا بدليل (أمر + نتيجة). البوابات بعد كل مرحلة: `uv sync && npm ci && uv run python tools/check-all.py && git diff --check`.

## جدول F1–F10 (يُملأ عند الإغلاق الفعلي)

| # | المشكلة | المرحلة | الحالة | الدليل |
|---|---|---|---|---|
| F1 | لا ES modules ولا أنواع لكل عائلة | R2، R3 | مفتوح | — |
| F2 | لا instance بـdestroy() إلا Order Schedule وMicroProduct | R4 | مفتوح | — |
| F3 | مفاتيح نصوص بلا معنى (kNNN) وCarousel/Picker بلا options.labels | R5 | مفتوح | — |
| F4 | C08 يعرض save-local وlocal-saved خلافًا لOnline-only | R6 | مفتوح | — |
| F5 | ثلاث نسخ متتبعة (components/ وsrc/ وdist/) | R2 | مفتوح | — |
| F6 | البوابة البصرية مربوطة بمسار مطلق خارج المستودع | R1 | مفتوح | — |
| F7 | روابط footer في concepts أصبحت نصًا | R1 | مفتوح | — |
| F8 | CI غير مفعّل (الملف في tools/ci) | R7 | مفتوح | — |
| F9 | فحوص تكتب داخل المستودع + قوائم مجلدات قديمة | R1 | مفتوح | — |
| F10 | ملفات product-context JS مضغوطة غير مقروءة | R2 | مفتوح | — |

## R0 — التجهيز

**ما نُفذ (2026-11-22):**

1. المزامنة: `git fetch --tags` ثم `git checkout feature/integration-readiness-2026-11-21 && git pull --ff-only` — الرأس `d757c84` (خطة الجولة الثانية)، متطابق مع البعيد.
2. النسب: `git merge-base --is-ancestor v0.1.0 HEAD` → نجح (exit 0). المستودع كامل غير shallow (`git rev-parse --is-shallow-repository` → false).
3. هذا التقرير أُنشئ بجدول F1–F10.
4. أرقام الأساس من `uv sync && npm ci && uv run python tools/check-all.py`:

| البوابة | العدد |
|---|---|
| standalone | مطابق بايت-ببايت |
| catalog | 14 عائلة / 8 متغيرات / 14 تراكيب |
| manifest | 1062 مدخلًا |
| package | src mirrors + dist متطابقة مع بناء حتمي |
| static | 417/417 |
| link-check | 148 ملفًا / 0 مكسور |
| hardcoded-text | PASS |
| audit | 67/67 |
| product-context | 306/306 |
| light-release | 35/35 |
| mobile-experience | 126/126 |
| light-calendar | 164/164 |
| light-data | 185/185 |
| component-consumption | 37/37 |
| integration-boundaries | 77/77 |
| clone-lifecycle | 31/31 |
| api-lifecycle | 58/58 |
| numeric-geometry | 51/51 |
| ui-system-showcase | 126/126 |
| preview-runtime | 112/112 |
| visual-regression | OK (محليًا — مرجع pre-phase9 موجود خارج الشجرة) |
| git-diff-check | نظيف |

**إجمالي:** 22 بوابة / 22 ناجحة / 0 فاشلة.

**ملاحظات على الأساس مقابل خط الأساس في الخطة (قسم 4):** أرقام الخطة سُجلت عند `v0.1.0` (static 416، link-check 147، manifest 1061)؛ الرأس الحالي `d757c84` يضيف `docs/plans/integration-readiness-round2-2026-11-22/PLAN.md` (ملف md متتبع جديد) فصار static 417 وlink-check 148 وmanifest 1062. لا انخفاض في أي عدد.

**سلوك البوابة البصرية في الأساس:** نجحت محليًا لأن `/home/z/my-project/visual-baseline` موجود على جهاز المنفّذ؛ هذا نفسه عيب F6 (الارتباط بمسار مطلق خارج الشجرة): على أي نسخة نظيفة دون هذا المجلد تُفشل البوابة. يُصلح في R1.

**Commit:** (يُسجل بعد الرفع)
