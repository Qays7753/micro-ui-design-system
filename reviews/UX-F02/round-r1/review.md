# UX-F02 — تقرير الجولة R1: إصلاحات P01–P04 + ثلاث عينات + 32 مسارًا

الحالة: **DRAFT FOR REVIEW — بانتظار مراجعة القائد؛ لا اعتماد ذاتي ولا بدء F03.** التاريخ: 2026-10-05.

## 1) المصدر والأدلة

| البند | القيمة |
|---|---|
| رأس البداية (origin/main عند البدء) | `1ad4831c62e3431f042e753ad01ee7e22a4e889e` — «Prepare UX-F02 assignment…» |
| **source commit مثبت للأدلة** | `91f3616c938efd548e08236b9fb9e4adf99105e1` — «Implement UX-F02: fix P01-P04 and add choice/filter/switch lifecycle samples with 32-path check tool» |
| بصمة شجرة المصدر | `bed82d9aadac543bf4cde0e8004d68cec74bfd41` |
| التحقق النظيف | `git worktree` جديد من هذا الالتزام (صفر ملفات متسخة قبل التوليد) — كل الأدلة أدناه وُلدت منه ثم نُسخت كما هي |
| بيئة التشغيل | Chromium headless `143.0.7499.4` · Playwright `1.57.0` (Python sync) · 390×844 افتراضيًا |
| أمر الجولة | `python3 tools/ux-f02-check.py --root <clean-checkout> --round r1` |
| النتيجة | **32/32 PASS** · 179 قياسًا (assertion) · صفر `pageerror` · صفر موارد 4xx/5xx — [verification.json](verification.json) و[verification.txt](verification.txt) و[31 لقطة](screenshots/) |

فحوص رجعية من checkout نظيف لنفس الالتزام (لأن P01–P03 تمست مصادر B03/B07 والطبقات مشتركة مع F01):

| الفحص | النتيجة | الدليل |
|---|---|---|
| `tools/b03-screenshots.py` | 25/25 | [regression/b03-verification.txt](regression/b03-verification.txt) |
| `tools/b07-screenshots.py` | 28/28 | [regression/b07-verification.txt](regression/b07-verification.txt) |
| `tools/ux-f01-check.py --round f02-regression` | 20/20 PASS (232 قياسًا) | [../../UX-F01/round-f02-regression/verification.json](../../UX-F01/round-f02-regression/verification.json) |

لا تُكتب فوق أدلة UX-F01 القديمة؛ نتيجة الجولة الجديدة في مجلد `round-f02-regression` مستقل.

## 2) الإصلاحات P01–P04 — قبل/بعد

الدليل المسبق ([PREFLIGHT.md](../PREFLIGHT.md) و[probes](../preflight-probes.json)) أعاد إنتاج الأخطاء الثلاثة على checkout نظيف من `8791514` — وهو دليل وجود لا نجاح UI. بعد الإصلاح، أُعيد تشغيل السكربت نفسه على المصدر المثبت: [postfix-probes.json](postfix-probes.json) — **`issue_reproduced=false` للبنود الثلاثة وصفر pageerrors**. (ملاحظة صدق: `clean_before_probe=false` في الـJSON لأن مجلد الأدلة غير المتتبع موجود حول الشجرة عند التشغيل؛ بصمات sha256 للملفات المفحوصة مطابقة لشجرة `91f3616` المثبتة).

| البند | الموضع | قبل (preflight) | بعد (postfix) | الإصلاح |
|---|---|---|---|---|
| **P01** | `selection.js` `syncGroup` | مجموعة بلا مفعّلين: `checked=true` و`indeterminate=true` تظلان بعد init | `checked=false` و`indeterminate=false` · eligible=0 | تصفير صريح للحامل عند غياب المفعّلين في init وكل إعادة حساب + إعادة حساب بعد `change` لتحديد الكل — العناصر المعطلة وقيمها لا تُمس. توثيق §2 |
| **P02** | `selection.js` نقر segmented | نقرة مؤشر حقيقية (`page.mouse.click`) على `aria-disabled` غيّرت الاختيار وأطلقت حدثًا (events=1) | selected=«false» وevents=0 | حراسة واحدة `isDisabled` (disabled أو aria-disabled) في النقر — تشمل Enter/Space (أصله click)؛ الأسهم كانت محروسة. توثيق §2 |
| **P03** | `navigation.js` `updateSummary` | «الجاري: 1 فلاتر — only_active_internal» و«العدّاد يخفي 0» | «الجاري: العناصر النشطة» و«الجاري: لا فلاتر» | ملخص بشري: `data-filter-label` اختياري → تسمية مرتبطة (label[for] أو label حاوية) → عدد محايد بلا مفاتيح؛ لا قيمة بحث خام؛ `event.detail.applied/count` وdraft/applied كما هي. توثيق في مواصفة B07 |
| **P04** | `selection/specification.md` §6 | «المنتقي بطبقة مؤقتة حتى B07» يناقض الربط الفعلي | «المنتقي مرتبط بطبقة B07 الحقيقية (m-layer عبر MicroNavigation.openLayer)» | تصحيح توثيقي في الموضع الوحيد المتناقض |

الإثبات السلوكي داخل مصفوفة 32: F02-01 (P01)، F02-02 (P02)، F02-03+16..22 (P03)، F02-04 (P04 وقراءة العقود).

## 3) العينات الثلاث (مصدر قابل للتعديل)

| العينة | الملفات | ما تثبته |
|---|---|---|
| [choice-lifecycle](../../../previews/ux-patterns/choice-lifecycle/README.md) | index.html · example.css · example.js · mock-adapter.js · README | مجموعات checkboxes/radio/segmented + «تحديد الكل» للمفعّل فقط؛ منتقي في طبقة B07 بقراءة loading/ready/empty/error، بقاء/سقوط الاختيار مع setOptions، رد قديم مُتجاهل، اختيار فوري يغلق الطبقة، مسح بلا حفظ |
| [filter-lifecycle](../../../previews/ux-patterns/filter-lifecycle/README.md) | index.html · example.css · example.js · README (بلا mock — محلية) | draft/applied في لوحة B07، تطبيق بإحداث واحد بنسخة القيم، إلغاء بكل الوسائل يحفظ المطبّق، عدّاد شروط (0 مخفي فعليًا) منفصل عن النتائج، no-results بفعل تصحيح، بحث حرفي بلا حقن |
| [switch-lifecycle](../../../previews/ux-patterns/switch-lifecycle/README.md) | index.html · example.css · example.js · mock-adapter.js · README | تحديث واحد لكل تبديل بمعرف محاولة، pending/saved/not-saved/unknown/checking، حسم على قيمة إرسال المحاولة، رد قديم عبر مسار المستهلك، سياسة تركيز محددة (قبل التعطيل/بعد التفعيل وقبل الإخفاء)، مفتاح معطل أصلًا يحفظ عقد R2-06 |

فهرس العينات: [previews/ux-patterns/index.html](../../../previews/ux-patterns/index.html) — ورابط واحد أُضيف لفهرس المعرض.

## 4) مصفوفة 32 مسارًا — النتيجة

الكل PASS (التفاصيل والقياسات في [verification.json](verification.json)؛ العمود الثالث اللقطة ذات الصلة):

| ID | التجربة | دليل |
|---|---|---|
| F02-01 | P01: مجموعة بلا مفعّلين، init ثم نقر | [01](screenshots/f02-01-zero-group.png) |
| F02-02 | P02: aria-disabled نقرة/Enter/Space/أسهم | [02](screenshots/f02-02-segmented-guard.png) |
| F02-03 | P03: ملخص بشري + تسمية غائبة + event | [03](screenshots/f02-03-human-summary.png) |
| F02-04 | P04 + مطابقة README والعقود | مصدر مستوى ملفات |
| F02-05 | checkboxes دورة كاملة + راديو | [05](screenshots/f02-05-groups.png) |
| F02-06 | مقطّع موجز/تفصيلي | [06](screenshots/f02-06-segmented-detail.png) |
| F02-07 | loading→error→retry→ready | [07a](screenshots/f02-07-picker-error.png) · [07b](screenshots/f02-07-picker-ready.png) |
| F02-08 | empty-source ≠ no-results + مسح البحث | [08a](screenshots/f02-08-picker-empty.png) · [08b](screenshots/f02-08-picker-no-results.png) |
| F02-09 | اختيار → إعادة فتح → مسح | [09](screenshots/f02-09-selected-cleared.png) |
| F02-10 | إغلاق بكل الوسائل بلا اختيار | [10](screenshots/f02-10-closed-preserved.png) |
| F02-11 | إعادة قراءة بمعرف باقٍ وتسمية جديدة | [11](screenshots/f02-11-relabel-kept.png) |
| F02-12 | اختفاء الاختيار من المصدر | [12](screenshots/f02-12-selection-dropped.png) |
| F02-13 | قراءتان متداخلتان + إغلاق أثناء القراءة | [13](screenshots/f02-13-overlapping-reads.png) |
| F02-14 | تركيز خيار ثم استبدال + لوحة مفاتيح | [14](screenshots/f02-14-picker-focus.png) |
| F02-15 | fixtures بديلة (beta/true) | قياسات JSON (سياقان معترضان) |
| F02-16 | draft لا يمس applied/القائمة/العدّاد | [16](screenshots/f02-16-filter-draft.png) |
| F02-17 | إلغاء بكل الوسائل + استعادة draft | [17](screenshots/f02-17-filter-cancel.png) |
| F02-18 | تطبيق q+checkbox: AND وعدّاد شروط | [18](screenshots/f02-18-filter-applied.png) |
| F02-19 | applied → مسح draft → إلغاء | [19](screenshots/f02-19-filter-keep.png) |
| F02-20 | مسح → تطبيق: صفر شروط مخفي فعليًا | [20](screenshots/f02-20-filter-zero.png) |
| F02-21 | no-results + تعديل الفلاتر | [21](screenshots/f02-21-filter-no-results.png) |
| F02-22 | بحث حرفي/مسافات/أحرف شبيهة بـHTML | [22](screenshots/f02-22-filter-literal.png) |
| F02-23 | idle→pending بنقر/مؤشر خام متكرر | [23](screenshots/f02-23-switch-pending.png) |
| F02-24 | pending→saved ثم تبديل معاكس | [24](screenshots/f02-24-switch-saved.png) |
| F02-25 | pending→not-saved ثم إعادة محاولة | [25](screenshots/f02-25-switch-not-saved.png) |
| F02-26 | unknown: لا rollback وزر التحقق فعلي | [26](screenshots/f02-26-switch-unknown.png) |
| F02-27 | checking متكرر وحسمات وتركيز قبل الإخفاء | [27](screenshots/f02-27-switch-check.png) |
| F02-28 | رد قديم update/check ثم تسوية الحالي | [28](screenshots/f02-28-switch-stale.png) |
| F02-29 | قناة واحدة + حفظ المعطل الأصلي (R2-06) | [29](screenshots/f02-29-switch-message.png) |
| F02-30 | B07: حصر Tab واسترجاع overflow والتركيز | [30](screenshots/f02-30-b07-focus.png) |
| F02-31 | 320/360/390/430 + 200% + reduced-motion | [31](screenshots/f02-31-viewport-390.png) + قياسات JSON |
| F02-32 | مصدر قابل للتعديل + رجعية + صفر أخطاء | هذا التقرير §1 |

آليات قياس معلنة: نقرات المعطل بمؤشر خام على الإحداثيات (وفق منهجية PREFLIGHT)؛ التسوية والرد القديم عبر أدوات SIMULATION بـ`evaluate` محايدة التركيز (إذن البطاقة §6) وأفعال المستخدم بالنقر/لوحة المفاتيح الفعلية؛ تكبير 200% بمضاعفة أحجام الخط المحسوبة مع قياس قبل/بعد؛ reduced-motion بتفضيل فعلي على مستوى السياق.

## 5) حدود صادقة — NOT RUN

لم تُنفذ فعليًا ولا تُحسب PASS: **WebKit/Safari**؛ أجهزة Android/iPhone حقيقية؛ **TalkBack/VoiceOver**؛ native zoom للنظام؛ اللمس الحقيقي وsafe areas ولوحة مفاتيح النظام. وجود role=status وaria-* يثبت البنية لا سلوك قارئ شاشة فعلي.

حدود محاكاة موثقة: رد الـSIMULATION بمعرف قديم يمر عبر معالج المستهلك (فلتر attemptId/readId) — يثبت الفلتر والتجاهل واستمرار الحسم، لا وصولًا شبكيًا فعليًا لرد محاولة سابقة؛ الموصلات حتمية بلا شبكة/تخزين/مصادقة؛ `setSwitchPending(false)` المتكرر والمعطل الأصلي محفوظان (عقد R2-06 مُختبر في F02-29).

NEEDS PRODUCT INPUT: لا شيء في نطاق هذه الدفعة. عيوب core إضافية: لم يُرصد ما يتطلب NEEDS REVIEW خارج البنود المأذونة — ما وُجد ضمن P01–P04 حُسم أعلاه.

## 6) الحالة والخطوة التالية

- **DRAFT FOR REVIEW**: المراجعة لصاحب القرار/القائد؛ لا اعتماد ذاتي.
- بعد المراجعة: F03 (وكيل مستقل يطبق العقد) وF04 (معلومات المنتج) خارج هذا التكليف — لم يبدآ.
