# تقرير جولة الملحق 1.6 — تطبيقه على مكوّنات الدفعة الأولى

> **الخطة:** `docs/plans/design-system-1.6/PLAN.md` · **المرجع:** `docs/design-system/BRIEF.md` 1.5 + `docs/design-system/BRIEF-ADDENDUM-1.6.md` (الملحق يتقدم على 1.5، وقسم «و» يتقدم على أ إلى هـ)
> **الفرع:** `design-system` فقط · **المستودع:** `Qays7753/micro-ui-design-system`
> **رابط المالك الثابت لآخر نسخة من المختبر:**
> `https://raw.githack.com/Qays7753/micro-ui-design-system/design-system/previews/ds-lab/standalone.html`

> حالة التقرير عند هذه الوحدة: هيكل أولي — يكتمل قسمًا قسمًا مع كل وحدة، والإغلاق النهائي في الوحدة 18.

---

## نقطة الاستكمال

> سطر واحد لكل بند، تُحدَّث مع كل وحدة.

| البند | الحالة | أين |
|---|---|---|
| الوحدة 0 | **منفذة**: استنساخ نظيف على `ds-v0.1.1`، تجهيز المحركين (Chromium + WebKit بمسار التراجع البرمجي الموثق في tools/README.md)، وcheck-all كاملة على خط الأساس **51/51 صفر فشل** | هذا الجدول |
| خط الأساس | `ds-v0.1.1` — check-all كاملة 51/51 (تشمل سلسلة ds 21/21 على المحركين والعرضين والvisual-regression) | سجل التشغيل في commit الوحدة 0 |
| الوحدة 1 | **منفذة** — الرموز (حذف `brand-signal-text`، أدوار التراكوتا، `signal-line`/`dot-signal`/`quality.*`، إعادة تسمية `row-with-mark`/`row-plain`، رموز `ActionBar`) | commit `0ff6411` |
| الوحدة 2 | **منفذة** — Money: `direction` ← `flow`، و«—» وحدها بلا وحدة | commit `2e14ccb` |
| الوحدة 3 | **منفذة** — ObjectRow: 72 مع العلامة و56 بلا علامة (إلغاء 56 بحشوة 6) | commit `e7de77e` |
| الوحدة 4 | **منفذة** — ActionBar على رموز الوحدة 1 (`--mds-layout-action-bar-*`) | commit `cbf0493` |
| الوحدة 5 | **منفذة** — EmptyState: زر واحد كحد أقصى ولا زر مع زر الرأس | commit `5870ee7` |
| الوحدة 6 | **منفذة** — Sheet/ConfirmSheet: حركة الخروج ثم `onDismiss` ثم إزالة التطبيق | commit `43e23d7` |
| الوحدة 7 | **منفذة** — ObjectCard: البطاقة كلها رابط ممتد والزر أخ شقيق فوقه | commit `adaa48b` (آخر commit مرفوع) |
| استئناف الجولة | بيئة المنفذ أُعيد تشغيلها بعد الوحدة 7: استنساخ نظيف على `adaa48b` (لا عمل محلي غير مرفوع بعده)، وإعادة تجهيز المحركين و`node_modules` في الجذر و`ds/` حسب tools/README.md؛ خط أساس الاستئناف: typecheck نظيف وvitest 278/278 | هذا الجدول |
| التالية | الوحدة 8: `HeroSurface` — الخط الصغير التراكوتا مع نقطته (أ-ج، و-2 البند 2) | PLAN.md الوحدات |
