# متعقّب تنفيذ إصلاح UI الجذري

## IMPLEMENTATION-TRACKER — UI Root-Cause Repair

- **خط الأساس:** `main@496b900ab41085627ca0a8f9479674a9dc3ad677`
- **فرع التنفيذ الوحيد:** `zai/ui-root-cause-repair-implementation`
- **الحالة المرجعية لهذا الملف:** يُحدَّث بعد كل موجة؛ الحالات المسموحة: `UNVERIFIED / CONFIRMED / IN PLAN / IN PROGRESS / IMPLEMENTED / VERIFIED / NOT REPRODUCED / NOT PROVEN / OWNER DECISION / DEFERRED / BLOCKED`
- **قاعدة الحقيقة:** `VERIFIED` تُمنح فقط بوجود دليل قبل/بعد قابل لإعادة الإنتاج؛ ما لم يُشغَّل يبقى `NOT RUN` ضمن تقرير الإنجاز.

---

## 0) قرارات المالك — سجل الحسم

| ID القرار | الموضوع | الحسم | الحالة | المرجع |
|---|---|---|---|---|
| D-UI-01 | سياسة تبويبات النص الطويل | صف واحد + تمرير أفقي مقصود؛ لا التفاف/قص/تصغير؛ المحدد يبقى مرئيًا؛ RTL/LTR؛ يوثق ويختبر عند 320/360/390/430 | **OWNER DECISION — RESOLVED** | رسالة المالك 2026-10-09 |
| D-UI-02 | ملكية دلالات الطبقات والرسائل | افتراضات آمنة (role/aria-modal/اسم) + تحقق صريح؛ أدوار m-note من النوع لا تعميم alert | **OWNER DECISION — RESOLVED** | رسالة المالك 2026-10-09 |
| D-UI-03 | فصل أهداف اللمس | 8px افتراضيًا بين مناطق الإصابة الفعلية؛ استثناءات موثقة للمركّبات المزدحمة (stepper/segmented/calendar)؛ لا تكبير واجهة بلا داعٍ | **OWNER DECISION — RESOLVED** | رسالة المالك 2026-10-09 |
| D-UI-04 | مسار البيانات البديل للرسم | إفصاح بيانات داخل مكوّن الرسم الحالي؛ تزامن مع dataset؛ لا عائلة جديدة ولا صفحة؛ لا تغيير ألوان | **OWNER DECISION — RESOLVED** | رسالة المالك 2026-10-09 |
| D-UI-05 | الشكل المرئي مقابل hit area | 40px شكلًا + 48px منطقة إصابة مقصود ومثبت؛ يحفظ ما لم يثبت قص/تداخل/هندسة متناقضة | **OWNER DECISION — RESOLVED** | رسالة المالك 2026-10-09 |
| D-UI-06 | أسماء توكنز runtime | تُحفظ الأسماء وتوثق النطاقات؛ لا إعادة تسمية واسعة؛ إعادة تسمية فقط لسبب جذري مثبت | **OWNER DECISION — RESOLVED** | رسالة المالك 2026-10-09 |
| — | الترقيم الصفحي/سلوك الصفحات | مستبعد صريح: «غير منطبق على تنفيذ UI هذا» | **OWNER DECISION — RESOLVED (excluded)** | رسالة المالك 2026-10-09 |

---

## 1) سجل البنود النشطة

| Finding ID | المكون/الملف | السبب الجذري | الحالة قبل | المالك | خطوة الخطة | Commit التنفيذ | الفحص/الدليل | حالة ما بعد | المراجع |
|---|---|---|---|---|---|---|---|---|---|
|A1-F01 / A3-F02|m-tabs — `components/navigation/navigation.css(.js)`|لا عقد تخطيط للتبويبات عند ضيق العرض/طول النص: flex أفقي بلا overflow معلن|CONFIRMED (DOM)|Zed AI|W1.1 (D-UI-01)| `0064c4c` | tabs matrix 32/32 + End/Home + visibility | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A3-F01|tabpanel — `components/navigation/navigation.js`|تبديل hidden/aria-selected فقط؛ اللوحة النشطة بلا tabindex تدخل Tab|CONFIRMED (repro)|Zed AI|W1.2| `0064c4c` | tabpanel: init/switch/internal-target | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A3-F03|sticky-foot/actionbar/navbar — `previews/navigation/board.css` + `navigation.css`|تكرار inset بين المجموعة والمكونين (تطبيق ثلاثي عند inset موجب)|CONFIRMED (تركيبي)|Zed AI|W1.3| `0064c4c` | fixture موجب: 12px/4px/30px + آلية 34px + before هيكلي 3×env | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A1-F04|فصل أهداف اللمس — مكونات متعددة|لا قاعدة قياس للفصل بين bounding boxes الفعلية (4/5px حالات)|فجوة/خطر|Zed AI|W1.5 (D-UI-03)| `0064c4c` | قياس bounding boxes + استثناءات موثقة | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A1-F08|picker نص طويل — `components/selection/picker.css(.js)`|الخيار flex بلا `min-inline-size:0`/`overflow-wrap` والقائمة `overflow:hidden`|خطر محتمل|Zed AI|W1.6| `0064c4c` | picker longtext 320+200%: التفاف 211px مقابل 55px مقصوص قبل | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A2-F01|aria-disabled — `components/selection/selection.css`|قواعد CSS تغطي `[disabled]` فقط بينما JS يحرس `aria-disabled` أيضًا|CONFIRMED (source)|Zed AI|W2.1| `6e16853` | مظهر/hover/أحداث ×3 | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A2-F03|طبقات بلا عقد ARIA — `components/navigation/navigation.js`|role/aria-modal/اسم تُترك للمستهلك بلا افتراض أو تحقق|فجوة عقد|Zed AI|W2.2 (D-UI-02)| `6e16853` | role/modal/اسم + تحذير | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A2-F04|أدوار m-note — `components/messages/messages.js`|لا دور افتراضي من النوع ولا تحقق للترميز الناقص|فجوة عقد|Zed AI|W2.2 (D-UI-02)| `6e16853` | أدوار خمسة + تحذير bare | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A2-F05|live region واحدة + مؤقت 50ms — `components/messages/messages.js`|تبديل polite/assertive على عقدة واحدة ومسح/إعادة نص بمؤقت ثابت|خطر محتمل|Zed AI|W2.3| `6e16853` | قناتان + burst + rAF | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A2-F02|قيم صلبة — `components/selection/selection.css:347` + `metric-comparison.css:381`|rgba صلبة بلا اسم دلالي أو استثناء موثق|CONFIRMED (source)|Zed AI|W2.4 (D-UI-06)| `6e16853` | توكنان مسميان + جرد 15 حالة | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A2-F06 / D-UI-06|نطاقات توكنز محلية|لا توثيق لحدود override للتوكنز الخاصة|قرار مالك|المالك + Zed AI|W2.4 (توثيق)| `6e16853` | توثيق النطاقات (specs) | reviews/ZAI-UI-REPAIR/{before,after} | OWNER DECISION — RESOLVED (D-UI-06) |
|A2-F07 / D-UI-05|segmented 40px/48px|قرار بصري يحتاج تثبيتًا وتحققًا من عدم التداخل|قرار مالك|المالك + Zed AI|W1.5 (تحقق فقط)| — | قياس عدم التداخل (elementFromPoint) | reviews/ZAI-UI-REPAIR/{before,after} | OWNER DECISION — RESOLVED (D-UI-05) |
|A2-F08|init(root) — selection/data/messages/navigation/picker|`querySelectorAll` على الجذر دون تضمين الجذر نفسه|فجوة API|Zed AI|W2.5| `6e16853` | init root-self ×2 + re-init | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A4-D01|dataset دلالي للرسم — `components/data/data.js`|role=img بـaria-label قصير فقط؛ لا ربط title/summary؛ البيانات مخفية|CONFIRMED (source)|Zed AI|W3.1 (D-UI-04)| `7065512` | aria-labelledby/describedby + إفصاح 13 رسمًا | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A4-D02|جدول/CSV بديل|لا مسار بيانات بديل عام|فجوة تغطية|Zed AI|W3.1 (إفصاح داخلي) + CSV مؤجل| `7065512` | الإفصاح الداخلي (D-UI-04)؛ CSV مؤجل | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) — CSV DEFERRED |
|A4-D03|مقياس bubbles — `components/data/data.js`|استبدال data-max غير الصالح صمتًا وتجاوز rmax دون رفض|CONFIRMED (source)|Zed AI|W3.2| `7065512` | رفض/رفض/rescale/auto ×4 (قبل: 147px تجاوز صامت) | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A4-D04|انحراف الملخص — `components/data/data.js:862-880`|الملخص يكتب مرة واحدة عند الفراغ فقط|CONFIRMED (source)|Zed AI|W3.3| `7065512` | مزامنة كل render (قبل: قديم) | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A4-R02|اسم الرسم لا يطابق العنوان المرئي|مصدران للاسم بلا aria-labelledby|خطر صيانة|Zed AI|W3.1| `7065512` | labelledby=العنوان المرئي 8 رسوم | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A1-F02|هامش المعرض 390/430 — `previews/index.css:95-97`|قاعدة عرض 32px حتى 700px تخالف عقد 20px من 390|CONFIRMED (CSS)|Zed AI|W4.3| `7978b32` | هوامش 16/20/20 عند 320/390/430 (قبل 16/16/16) | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A5-F04|غلاف #results PRE — `previews/fields/example-usage.html`|PRE بلا التفاف عند 320+200% يوسّع الصفحة|CONFIRMED (probe)|Zed AI|W4.3| `7978b32` | sw=320=cw (قبل sw=359) | reviews/ZAI-UI-REPAIR/{before,after} | VERIFIED (Chromium) |
|A4-R01|تباين علامات البيانات|ألوان فاتحة (b/c/e) دون 3:1 كعلامات مستقلة|خطر بصري|المالك لاحقًا|W3.4 (تسجيل فقط)| — | قيم ونسب دقيقة في التقرير النهائي | reviews/ZAI-UI-REPAIR/{before,after} | DEFERRED → COLOR PROPOSAL — NOT IMPLEMENTED |
| A1-F03 | سلم غلاف المعرض خارج سلم المنتج | لا فصل موثق لتوكنات المعرض | قرار بصري | المالك | خارج الموجات | — | — | DEFERRED | Audit §A1.4 |
| A1-F05 / A6-ADAPT-001 | نطاق landscape/Medium/Expanded | لا عقد نطاق معلن | قرار نطاق | المالك | خارج الموجات | — | — | DEFERRED | Audit §A1.6 |
| A1-F06 / A6-MOBILE-001 | safe-area top/inline | غير معالجة/غير مثبتة (تتطلب جهازًا وviewport-fit) | فجوة جهاز | المالك + جهاز | خارج الموجات (top) | — | — | DEFERRED / NOT RUN | Audit §A1.7 |
| A3-R01 | قفل body وحده | root scroll في Safari/WebView غير مثبت | خطر محتمل | بيئة WebKit | خارج الموجات | — | — | NOT RUN (device/WebKit) | Audit §A3.5 |
| A3-R02 / A5-F06 | لوحة المفاتيح/visualViewport | لا عقد keyboard-inset؛ يتطلب جهازًا | غير مختبر | المالك + جهاز | خارج الموجات | — | — | NOT RUN (device) | Audit §A3.6 |
| A2-F09 / A5-F01 | forced-colors/contrast/dark | قرار نطاق مطلوب قبل التنفيذ | فجوة غير مختبرة | المالك | خارج الموجات | — | — | DEFERRED (scope) | Audit §A2.10 |
| A5-F02 | تعريف 200% مقابل native zoom | محاكاة font-size ليست zoom نظامي | قرار عقد | المالك | قياساتنا تشخيصية | — | — | NOT RUN (native) | Audit §A5.3 |
| A5-F03 | busy semantics | aria-busy يمنع التفعيل؛ الإعلان الصوتي غير مثبت | خطر محتمل | AT | خارج الموجات | — | — | NOT RUN (AT) | Audit §A5.4 |
| A5-F05 | native date والlocale | سلوك منصة غير محسوم | قرار منصة | المالك | W4.2 (تسجيل) | — | — | NOT PROVEN (platform) | Audit §A5.6 |
| A5-F07 | خلية تقويم ~37.7px عند 320 | استثناء معلن — لا عيب صامت | قرار مالك | المالك | توثيق الاستثناء | — | — | OWNER DECISION (documented) | Audit §A5.8 |
| A3-D01 | سقف وجهات bottom nav | سياسة More/rail غير محسومة | قرار مالك | المالك | خارج الموجات | — | — | DEFERRED | Audit §A3.8 |
| A3-D02 | appbar ثابت/متكيف | يحتاج تسمية static أو variant | قرار مالك | المالك | خارج الموجات | — | — | DEFERRED | Audit §A3.9 |
| A3-D03 | تكديس الطبقات وBack | سياسة منتج غير معلنة | قرار مالك | المالك | خارج الموجات | — | — | DEFERRED | Audit §A3.10 |
| A4-R03 | إعلان إعادة التصيير للAT | لا قناة إعلان عند تغير البيانات | خطر/فجوة عقد | المالك | خارج الموجات (عقد اختياري) | — | — | DEFERRED | Audit §A4.8 |
| A4-R04 | filter/sort/zoom/pagination | قرار نطاق منتج (والترقيم مستبعد من المالك) | قرار مالك | المالك | مستبعد صريح | — | — | DEFERRED / EXCLUDED | Audit §A4.9 |
| A4-R05 | grouping للفقاعات | ترتيب/تجميع DOM غير موثق لـAT | خطر قبل AT | AT | خارج الموجات | — | — | NOT PROVEN (AT) | Audit §A4.10 |
| A6-PWA-001/002 | manifest/SW/metadata | خارج قفل نطاق UI الحالي (audit-only) | فجوة مقصودة | المالك | خارج الموجات | — | — | DEFERRED (scope lock §1.5) | Audit §A6 |
| A6-NAV-001 | history/deep-link | خارج قفل النطاق | فجوة | المالك | خارج الموجات | — | — | DEFERRED (scope lock) | Audit §A6.6 |
| A6-F-TOUCH-001 | 48px ≠ 48dp/44pt | وحدات منصة غير معايرة | قرار قياس | المالك + جهاز | قياسات CSS فقط | — | — | NOT RUN (device) | Audit §A6.8 |
| A6-F-ARIA-001 | قارئات محمولة غير مثبتة | اختبار سمعي غير منفذ | غير مختبر | AT | — | — | — | NOT RUN (AT) | Audit §A6.9 |

---

## 2) موجات التنفيذ — سجل الحالة

| الموجة | النطاق | الحالة | Commit | الفحوص | ملاحظات |
|---|---|---|---|---|---|
| Wave 1 | الهندسة والتنقل (W1.1–W1.6) | **IMPLEMENTED — VERIFIED (Chromium)** | `0064c4c` | tabs matrix 32/32 · tabpanel 3 سلوكيات · safe-area fixture · picker longtext · appbar gap | لقطات قبل/بعد: tabs/picker |
| Wave 2 | الحالات والدلالات والتوكنز (W2.1–W2.5) | **IMPLEMENTED — VERIFIED (Chromium)** | `6e16853` | aria-disabled 3 فحوص · layer defaults/validation · note roles 5 · live burst · init root-self ×2 | تحذيرات console مفحوصة |
| Wave 3 | البيانات والرسوم (W3.1–W3.5) | **IMPLEMENTED — VERIFIED (Chromium)** | `7065512` | bubbles A01 ×4 · summary sync · disclosure 13 رسمًا · linkage · caption | لقطة disclosure مفتوح |
| Wave 4 | RTL وسلامة المعاينات (W4.1–W4.3) | **IMPLEMENTED — VERIFIED (Chromium)** | `7978b32` | gallery margins 320/390/430 · results wrapper 320+200% · reflow matrix 40 مسارًا | — |
| الأدلة | probe + قبل/بعد | **GENERATED** | `7313201` | `reviews/ZAI-UI-REPAIR/after` **87/87** · `reviews/ZAI-UI-REPAIR/before` **37/37** (كل عيوب الأساس مُعادة الإنتاج بالقياسات) | `tools/zai-repair-probes.py` |
| QA مستقل | مراجعة قراءة فقط + إعادة تشغيل | **PASS** (وكيل مستقل QA-1) | — | `reviews/ZAI-UI-REPAIR/qa-verdict.txt` + إعادة تشغيل مستقلة **87/87** (`qa-rerun-verification.txt`) | 0 CRITICAL/0 MAJOR؛ إصلاح ملاحظة QA-7 (أهداف مخفية لا تُحسب داخل اللوحة) مفحوص 87/87 |

## 3) سجل الالتزامات العابرة للبنود

- `shared/tokens.css`: **لم يُعدّل** — فرق الألوان فارغ إلزاميًا.
- الوثائق المرجعية الثلاث: منقولة حرفيًا من فرع المرجع (مطابقة blob) — **لم تُعدّل**.
- لا صفحات/رحلات/منطق أعمال/عائلات مكونات جديدة/طبقة منصة/تكبير UI.
- البيئة: Chromium (Playwright) فقط — كل PASS نطاق Chromium؛ الجهاز/اللمس/AT/WebKit = `NOT RUN`.
