# تقرير الدفعة الأولى — نظام التصميم الجديد `@micro/ds`

> **الدفعة:** 1 · **المرجع:** `docs/design-system/BRIEF.md` الإصدار 1.5 · **الخطة:** `docs/plans/design-system-batch1/PLAN.md`
> **الفرع:** `design-system` فقط · **المستودع:** `Qays7753/micro-ui-design-system`
> **رابط المالك الثابت لآخر نسخة من المختبر:**
> `https://raw.githack.com/Qays7753/micro-ui-design-system/design-system/previews/ds-lab/standalone.html`

---

## نقطة الاستكمال

| البند | القيمة |
|---|---|
| آخر مرحلة منفذة | S0 — التجهيز |
| حالة العمل | جارٍ التنفيذ (S1 التالية) |
| آخر commit | يُحدَّث مع كل مرحلة |

---

## S0 — التجهيز (القائد)

### التحققات

| البند | المطلوب | النتيجة | الدليل |
|---|---|---|---|
| الفرع | `design-system` فقط | ناجح | `git branch --show-current` → `design-system` |
| سلف `v0.3.0` | سلف لـ`HEAD` | ناجح | `git merge-base --is-ancestor v0.3.0 HEAD` → 0 |
| `tokens.json` مقابل الملحق أ (قسم 19) | نسخة حرفية | **ناجح قيمياً:** تطابق بنيوي كامل (`json.loads` متساوٍ 100%، مفاتيح وقيم). الفرق تنسيقي فقط: الملحق يضغط مفتاحين في السطر أحياناً و`tokens.json` بسطر لكل مفتاح. **لا يوجد أي اختلاف قيمة**، وبالتالي لا ينطبق بند «اختلاف قيمة = خطأ في المستند» (الموجز 0.10). سُجّل هنا للشفافية | `scripts/s0_check_tokens.py` في بيئة القائد |
| البوابات القديمة (30) | كلها خضراء | **ناجح 30/30** | `uv run python tools/check-all.py` — الخرج الكامل عند التنفيذ |
| typecheck الجذر | 0 أخطاء | ناجح | `npm run typecheck` → exit 0 |
| lint الجذر | 0 أخطاء | ناجح | ضمن `check-all` (بوابة lint: OK) |

**ملاحظة بيئة الفحص:** كانت 19 بوابة تفشل عند أول تشغيل لأسباب بيئية في sandbox الفحص فقط (نسخة Chromium المثبتة لا تطابق إصدار Playwright 1.63 الخاص بالمشروع، ونقص مكتبات نظام لـWebKit، وملف core dump من انهيار متصفح). حُلّت كلها بلا أي تعديل على المستودع: تثبيت `chromium-1243`، وتوفير مكتبات WebKit (EGL/GLESv2 برمجياً) — وبعدها **30/30 خضراء من أول تشغيل نظيف للمستودع نفسه**. لا تغيير في أي ملف متتبع.

### ملاحظات الفحص على WebKit

WebKit يعمل في sandbox الفحص عبر رفع برمجي (EGL surfaceless + swrast). كل بوابات المتصفح تُشغَّل على المحركين Chromium وWebKit كما تطلب الخطة. فحوص الأداء الحقيقية (60fps، اللمس، الشمس) تبقى «تنتظر جهاز المالك».

### قائمة مكوّنات الدفعة الأولى (من الملحق ج ومراحل الخطة)

| # | المكوّن | قسم 9 | قسم 23 | معايير 29.2 | مرحلة البناء |
|---|---|---|---|---|---|
| 1 | `Money` | 9.3 | 8 + 23.22 | `Money` | S3 |
| 2 | `AmountVisibilityToggle` | 9.3 | 23.22 | `AmountVisibilityToggle` | S3 |
| 3 | `StatusBadge` | 9.3 | 23.6 | `StatusBadge` | S3 |
| 4 | `EntityMark` | 9.3 | 23.5 | `EntityMark` | S3 |
| 5 | `Button` | 9.4 | 23.2 + 23.3 | `Button` | S4 |
| 6 | `IconButton` | 9.4 | 23.3 | `IconButton` | S4 |
| 7 | `TextField` | 9.4 | 23.2 + 23.24(10) | `TextField` | S4 |
| 8 | `SegmentedControl` | 9.1 | — | `SegmentedControl` | S4 |
| 9 | `FilterChips` | 9.1 | 23.16 | `FilterChips` | S4 |
| 10 | `Surface` | 9.2 | 23.1 + 23.21 | `Surface` | S5 |
| 11 | `Well` | 9.2 | 23.21 | `Well` | S5 |
| 12 | `Section` | 9.2 | 23.24(16) | `Section` | S5 |
| 13 | `Tile` | 9.2 | 23.9 | `Tile` | S5 |
| 14 | `HeroSurface` | 9.2 | 23.8 | `HeroSurface` | S5 |
| 15 | `ObjectRow` | 9.3 | 23.4 | `ObjectRow` | S6 |
| 16 | `ObjectCard` | 9.3 | 23.21 | `ObjectCard` | S6 |
| 17 | `Metric` | 9.3 | 23.8 | `Metric`/`MetricSmall` | S6 |
| 18 | `MetricSmall` | 9.3 | 23.8 | `Metric`/`MetricSmall` | S6 |
| 19 | `Sheet` | 9.2 | 23.11 | `Sheet` | S7 |
| 20 | `ConfirmSheet` | 9.2 | 23.21 | `ConfirmSheet` | S7 |
| 21 | `ActionBar` | 9.2 | 23.15 + 27(4) | `ActionBar` | S7 |
| 22 | `ContextBar` | 9.1 | 23.16 | `ContextBar` | S8 |
| 23 | `AskButton` | 9.1 | 4.2 + 23.23 | `AskButton` | S8 |
| 24 | `NotificationsButton` | 9.1 | 23.24(2) | `NotificationsButton` | S8 |
| 25 | `ProjectSwitcher` | 9.1 | 23.20 | `ProjectSwitcher` | S8 |
| 26 | `TabBar` | 9.1 | 23.23 | `TabBar` | S8 |
| 27 | `PageHeader` | 9.1 | — | `PageHeader` | S8 |
| 28 | `SaveState` | 9.5 | 11 + 23.17 | `SaveState` | S9 |
| 29 | `Toast` | 9.5 | 23.12 | `Toast` | S9 |
| 30 | `InlineBanner` | 9.5 | — | `InlineBanner` | S9 |
| 31 | `EmptyState` | 9.3 | 23.7 | `EmptyState` | S9 |
| 32 | `Skeleton` | 9.3 | 23.10 | `Skeleton` | S9 |

وإلى جانبها: المختبر `ds/lab/` + `previews/ds-lab/standalone.html` (S3+)، صفحة «تركيب تجريبي» (S10)، تجربة الاستهلاك (S11).

### توزيع العمل على الوكلاء (القسم 5 من الخطة)

| الوكيل | يملك | مراحل |
|---|---|---|
| القائد (هذا الوكيل المنسق) | `REPORT.md`، `ds/package.json`، `ds/src/index.ts`، `CHANGELOG.md`، الالتزام والرفع | S0، الدمج والتقارير في كل مرحلة |
| الأساسات | `ds/src/tokens/`، `fonts/`، `icons/`، `i18n/`، `lib/` وأدوات توليدها | S1 وحده |
| الفحوص | `tools/ds-*` وإعدادات lint/stylelint/vitest | S2 بعد S1 |
| البنّاء | `ds/src/components/`، `ds/lab/`، `ds/consumer-test/` | S3–S11 |
| الناقد | لا يكتب كوداً؛ ملاحظاته هنا | بعد كل مجموعة من S3 |

---

## جداول المعايير

> تُبنى تدريجياً من S1: جدول لكل مكوّن (29.2)، وجدول مؤشرات الخطة (K1–K33)، وملاحظات الناقد، والانحرافات المقصودة، و«تنتظر جهاز المالك». الفاشل أولاً في كل جدول. **لا «ناجح» بلا دليل.**

(لم تُبنِ المكوّنات بعد — تُستكمل الجداول مع كل مرحلة.)

---

## قائمة «تنتظر جهاز المالك»

- كل ما في الموجز (AGENTS.md «ما لا يُختبر آليًا»): الأجهزة الفعلية iPhone 13 وSamsung Galaxy S25، Safari/WebKit الحقيقي، اللمس، قارئات الشاشة، safe areas، الشمس والسطوع المنخفض، الحدود على كثافات 2x/3x، والذوق (29.4).
- يُكتب لها `OWNER-CHECKLIST.md` في S12 (وقد يُكتب قبلها جزئياً مع S4).
