# أدوات Micro UI — جرد وتصنيف

هذا الملف هو المرجع الوحيد لتصنيف كل ملف في `tools/` بعد المرحلة 4 من خطة التجهيز للربط. التصنيف:

- **(أ) بوابة حالية:** تفحص الشجرة الحالية وتدخل في القبول عبر `tools/check-all.py`.
- **(ب) أداة بناء/تشغيل:** تولّد مخرجات أو تخدم المعاينة؛ أدوات البناء لها وضع `--check`.
- **(ج) محذوفة:** أدوات تاريخية أُزيلت في المرحلة 4 (انظر جدول الحذف والتغطية أدناه).

كل الأوامر تعمل من جذر المستودع عبر `uv run python tools/<name>.py` ولا تحتاج شبكة أو أسرارًا.

## (أ) البوابات الحالية — كلها داخل `check-all`

| الأداة | الدور |
|---|---|
| `light-static-check.py` | بوابات ثابتة Light-only؛ قيم الهوية من `tools/baselines/identity.json` والمقارنة مقابل `origin/main` (تُغيَّر بـ`--base`) ومنع حذف المصدر القابل للتعديل. |
| `component-audit-check.py` | تدقيق بصري/تفاعلي يقوده الكتالوج لكل العائلات الـ14 ومتغيراتها على 360×780 RTL. |
| `product-context-check.py` | عقود واجهة C07–C12 على هاتف Light RTL. |
| `light-release-check.py` | مصفوفة الإصدار الخفيف للمعرض وعقود الحقول على 320/360/390/430؛ `--review-scope` يضيّقها إلى 360×780 RTL (وهو ما يشغّله `check-all`). |
| `mobile-experience-check.py` | فحوص تجربة الهاتف بما فيها شاشات الدخول الأربع (`--phase login`). |
| `link-check.py` | كل الروابط النسبية في `*.md` و`*.html` المتتبعة؛ يفشل عند رابط مكسور. |
| `light-calendar-check.py` | سلوك التقويم الحالي (ملخص ومهام) على الشجرة الحالية. |
| `light-data-check.py` | سلوك عائلة البيانات والرسوم الحالي (حالات مفقودة/سالبة، إفصاح الوحدة والفترة). |
| `component-consumption-contract-check.py` | عقود استهلاك كل عائلة (API الاستخدام من المضيف). |
| `integration-boundaries-check.py` | صفحات `previews/integration-boundaries/` (الطبقات/الحاويات/دورة الحياة). |
| `clone-lifecycle-check.py` | ضمانات استنساخ/إزالة العناصر دون تسريب مستمعات (تمهيد لعقود المرحلة 6). |
| `numeric-geometry-check.py` | هندسة القراءات الرقمية وعلامات الحالة وأمان overflow عند 390px LTR. |
| `ui-system-showcase-check.py` | أسطح المعرض الثلاثة (`#app`/`#component-review`/`#state-lab`) وحالاتها الـ15. |
| `preview-runtime-check.py` | صفر أخطاء JavaScript وموارد مفقودة عبر كل صفحات `previews/` و`components/*` (يتطلب `--base http://127.0.0.1:5000`؛ `check-all` يبدأ الخادم تلقائيًا). |
| `visual-regression-check.py` | بوابة D12: التقاط 360×780 RTL Light لكل صفحة (بإعادة استخدام `visual-baseline-capture.py`) ومقارنة بكسل-بكسل مع المرجع؛ نجاح الصفحة عند اختلاف ≤ 0.1% من البكسلات. |

## (ب) أدوات البناء والتشغيل

| الأداة | الدور |
|---|---|
| `build-ui-system-showcase-standalone.py` | توليد `previews/ui-system-showcase/standalone.html`؛ وضع `--check` يتحقق أن الملف المولّد مطابق حرفيًا (بوابة داخل `check-all`). |
| `component-catalog-build.py` | اشتقاق جرد المكونات من الكتالوج؛ `--check` (بوابة داخل `check-all`). |
| `manifest-build.py` | بصمات sha256 لملفات التسليم في `MANIFEST.json`؛ `--check` (بوابة داخل `check-all`). |
| `build-package.mjs` | أداة بناء حزمة `@micro/ui` (Node): بلا وسائط يزامن مرايا `src/` ويولّد `dist/` حتميًا مع `dist/MANIFEST.json`؛ `--check` بوابة مقارنة بايت-ببايت. مصدر التعريفات `tools/package/micro-ui.d.ts`. |
| `preview-server.py` | خادم المعاينة على المنفذ 5000؛ `check-all` يشغّله تلقائيًا للبوابات التي تحتاجه. |
| `visual-baseline-capture.py` | التقاط لقطات مرجعية لـD12 إلى مجلد خارج الشجرة (أنشأ `pre-phase1` و`pre-phase4`). |
| `browser_support.py` | وحدة مساعدة لخيارات إطلاق Chromium (تستوردها البوابات). |
| `extract-identity-baselines.py` | أداة لمرة واحدة موثقة: استخراج قيم الهوية المرجعية إلى `tools/baselines/identity.json`. |

## المشغّل الموحد

```bash
uv run python tools/check-all.py               # كل البوابات بما فيها البصري D12
uv run python tools/check-all.py --quick       # البوابات الثابتة وأدوات البناء فقط
uv run python tools/check-all.py --skip-visual # كل البوابات عدا البصري (وضع CI)
```

- يبدأ خادم المعاينة تلقائيًا على المنفذ 5000 للبوابات التي تحتاجه ثم يوقفه.
- بوابة `package` تحتاج Node 20+ مع `npm install` مرة واحدة (esbuild أداة بناء وحيدة؛ بلا اعتماديات تشغيل).
- **البصري (D12) محلي فقط:** المرجع يعيش خارج المستودع في `/home/z/my-project/visual-baseline`، لذا يتخطاه CI بـ`--skip-visual` (انظر `docs/TESTING.md`). المرجع الافتراضي هو أحدث مجلد `pre-phase*` (حاليًا `pre-phase4`).
- `tools/baselines/identity.json` بيانات مرجعية للبوابات الثابتة، وليس أداة.

## (ج) الأدوات المحذوفة في المرحلة 4 — السبب والتغطية البديلة

### مغطاة ببوابات (أ) (كانت تنجح لكن سلوكها مغطى)

| الأداة المحذوفة | التغطية البديلة |
|---|---|
| `calendar-contract-check.py`، `calendar-task-check.py` | `light-calendar-check.py` (سلوك التقويم الحالي) + `visual-regression-check.py` لصفحاته. |
| `chart-mobile-check.py`، `data-scale-state-check.py`، `unit-context-check.py` | `light-data-check.py` (سلوك البيانات/الرسوم/الوحدات) + D12. |
| `component-mobile-check.py` | `mobile-experience-check.py` + `component-audit-check.py`. |
| `composition-recipes-check.py` | `product-context-check.py` (عقود التراكيب) + D12 لصفحات `previews/compositions/`. |
| `mobile-capabilities-check.py` | `light-calendar/light-data` + `mobile-experience` + D12 لصفحات `previews/mobile-capabilities/`. |
| `numeric-chart-geometry-check.py`، `numeric-micro-consistency-check.py` | `numeric-geometry-check.py` + `light-release-check.py` (مصفوفة 320–430) + `component-audit-check.py`. |
| `product-content-check.py` | `product-context-check.py`. |
| `standalone-checkout-check.py` | `build-ui-system-showcase-standalone.py --check` (تطابق حرفي) + D12 الذي يلتقط `standalone.html` فعليًا. |

### متقادمة (فشلت على الشجرة الحالية لسبب في الأداة لا في المصدر) — أُزيلت مع تسجيل الملاحظة في `docs/DECISIONS.md`

| الأداة المحذوفة | السبب |
|---|---|
| `concepts-check.py` | تتطلب `--chromium` مسارًا صريحًا (نمط استدعاء قديم قبل إدارة Playwright عبر uv). صفحات `previews/concepts/` مغطاة بـD12. |
| `clean-mobile-preview-check.py` | 70/72 تنجح؛ حالتا فشل تعتمدان بنية DOM قديمة للمعرض (`data-view`/`.sc-section`/`#sc-ocal-root`). التغطية الحالية: `component-audit-check` (كل العائلات في `#component-review`) و`mobile-experience-check`. أُرجئت الحالتان في `docs/DECISIONS.md`. |
| `numeric-field-controls-check.py` | محدد قديم (`.m-field__control`/ترتيب Tab لعناصر الخطوة) لم يعد يطابق DOM الحقول الحالي. عقود الحقول مغطاة بـ`light-release-check.py` و`component-audit-check.py`. أُرجئت ملاحظة التركيز في `docs/DECISIONS.md`. |
| `readable-acceptance-check.py`، `readable-source-check.py`، `shared-actions-check.py` | محددات لم تعد موجودة في الصفحات الحالية (`#acceptance-case`، `#reading-options > summary`). صفحات القراءة مغطاة بـD12 و`light-data-check.py`. |

### تاريخية بحتة (مراجع محذوفة أو جولات منتهية)

`assistant-actions-check.py`، `build-chart-proposal-review.py`، `build-components-package.py`، `split-components-package.py`، `assemble-components-package.py`، `chart-proposal-check.py`، `complete-repair-chart-check.py`، `complete-repair-lifecycle-check.py`، `complete-repair-mobile-check.py`، `evidence-repair-check.py`، `light-evidence-capture.py`، `owner-remaining-check.py`، `owner-stage2-check.py`، `professional-remediation-check.py`، `professional-ui-repair-check.py`، `product-refinement-check.py`، `ui-release-check.py`، `ui-system-showcase-repair-check.py`، `ux-continuation-phase3-check.py`، `visual-closure-check.py` — كلها تفحص مسارات محذوفة (`docs/audits`، `docs/proposals`، `reviews/`، `handoff/`، `deliverables/`، `docs/replit`، `_audit-resources`، `previews/chart-proposal`) أو جولات إصلاح تاريخية بمرجع `--source-ref`، وحزمة النقل القديمة حل محلها `manifest-build.py`.

## حدود الأدلة

كل البوابات تستخدم Chromium/Playwright على سطح المكتب. لا تعني نجاحها اختبار Android أو iOS أو WebKit/Safari أو اللمس الحقيقي أو قارئات الشاشة أو native zoom (انظر «ما لا يُختبر آليًا» في `docs/TESTING.md`).
