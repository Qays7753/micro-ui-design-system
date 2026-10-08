# تقرير الوكيل 4 — SUI-R2-A4 (تغطية وأدوات رجعية) — SAMSUNG-ONEUI-REPAIR-R2

**الوكيل:** A4 — أدوات وتوثيق واختبارات (بلا تغيير سلوك مصدر المكوّنات).
**الجولة:** SUI-R1-05 (صدق عقد قراءة المبلغ الطويل) + SUI-R1-06 (تصحيح التغطية والرجعية وأدوات الفحص).
**بيئة العمل:** worktree نظيف عند البداية `66bc1a8` (شجرة `21d74a9`) — Chromium 143.0.7499.4 عبر `executable_path=/home/z/my-project/evidence/bin/chromium`، خادم ThreadingHTTPServer من جذر worktree، منافذ الوكيل 4460-4479. لا git commit ولا push (القائد يدمج).

---

## 1) SUI-R1-05 — صدق عقد قراءة المبلغ الطويل

### 1.1 `tools/sui-repair-a2-check.py` (ملك حصري — تعديل موثق)

| التغيير | التفصيل |
|---|---|
| صياغات الأرقام/المحارف | كل فحص في قسم SUI-005 صار يصف القيمة بعدد أرقامها ومحارفها المنسقة: «1,240.50» = 6 أرقام/7 محارف، «12,456,789.50» = 10 أرقام/13 محرفًا، «123,456,789.50» = **11 رقمًا/14 محرفًا منسقًا** (تصحيح ادعاء «15 خانة» القديم)، «9,999,999.99» = 9 أرقام/11 محرفًا، «123456789012345» = **15 رقمًا/15 محرفًا غير منسق**. |
| قياس المدخل نفسه | الحد الخام (15 رقمًا) يُقاس على **الـinput نفسه** (clientWidth/scrollWidth) لا على غلاف التحكم: النتيجة الحقيقية الموثقة **client=252 / scroll=288** → scroll>client = يحتاج تمريرًا أثناء التحرير — **PASS بعقد صادق** (نفس المعيار الرقمي القديم cw≥250 وcw<sw، بلا تخفيف؛ أُعيدت الصياغة فقط لتوثّق الحقيقة لا لتدّعي لفًا). |
| فحصا الوصول للبداية/النهاية | بعد تركيز الحقل بنقرة حقيقية: `End` → **selectionStart=15 وscrollLeft=36>0** (الذيل ظاهر)؛ ثم `Home` → **selectionStart=0 وscrollLeft=0** (البداية ظاهرة) — إثبات مقيس أن القيمة تُقرأ كاملة بالتمرير الذي يتبع المؤشر. (نقرة حقيقية أولًا لأن التركيز البرمجي وحده لا يحرك تمرير المدخل مع عدم تغير المؤشر). |
| إزالة ادعاء «يلتف» للمدخل | حُذفت صياغة «مبلغ 15 خانة مقروء كاملًا — اللف مسموح» للمدخل؛ بقي فحص لف **الوحدة وحدها** بصياغة صريحة («لف الوحدة وحدها عند الحاجة — المدخل أحادي السطر»)، وفحص القيمة المنسقة 11 رقمًا/14 محرفًا يوثق أنها «تسع سطر المدخل» (252=252 مقيسًا) بلا أي ادعاء لف أرقام. |
| نطاق المنافذ | PORT_RANGE من 4200-4219 (نطاق وكيل R1-A2) إلى **4460-4479** (نطاق الوكيل 4 في R2) — موثق في السطر نفسه. |

**النتيجة بعد التحديث (وسم after، في worktreeي):** **69/69 فحصًا، صفر فشل** (كانت 67/67 في R1):
SUI-003 10/10 · SUI-004 9/9 · **SUI-005 11/11** (كانت 9/9 — زادت فحصا End/Home) · SUI-006 5/5 · SUI-011 8/8 · SUI-032 2/2 · REV-B02 12/12 · REV-B03 12/12.
الأرقام المفصلية (من JSON الأدلة): «123,456,789.50» client=252=scroll؛ «123456789012345» client=252/scroll=288؛ End: {scrollLeft:36, sel:15}؛ Home: {scrollLeft:0, sel:0}. ملحوظة صدق: git_meta يسجل أن الشجرة «غير نظيفة» بتعديلاتي المملوكة نفسها (spec + الأداة) — الأدلة الرسمية يتولدها القائد من checkout نظيف للدمج النهائي.
**الأدلة:** `evidence/agent4/a2-after/` (JSON + TXT + run-console.log + 9 لقطات، منها لقطة جديدة `after-sui005-amount15-end-tail-320-zoom200.png`).

### 1.2 `components/fields/specification.md` (عقد قراءة المبلغ فقط — لا شيء آخر في الملف)

استُبدل بند «المبلغ/الرقم بلا خطوة» بعقد قراءة **صادق وموحّد**:
- تصريح صريح: **المدخل `input` أحادي السطر لا يلف أرقامًا على أسطر إطلاقًا** — اللف في التحكم للوحدة وحدها (flex-wrap).
- ما يُقرأ كاملًا دفعة واحدة: حتى 11 رقمًا (14 محرفًا منسقًا) عند 320+200% — بالأرقام المقيسة (252=252).
- ما يتجاوز السعة: 15 رقمًا خامًا — مقيسًا **client=252/scroll=288** (وثّقت مراجعة R1 المستقلة 285 — فرق عرض خط طفيف بين البنيتين، الحد نفسه) → تمرير أثناء التحرير، لا قص فقدًا، لا تصغير خط (محظور)، لا حد أعمال مخترع.
- كيف تُقرأ القيمة كاملة: بالمؤشر — End/Home/الأسهم، التمرير يتبع المؤشر (بالأرقام المقيسة).
- أرضية 11ch باقية كما هي، وسلوك 1× محفوظ، وفقرتا SUI-004 والبقية لم تُمس (diff محصور في بند المبلغ وفحصه).

### 1.3 تصحيح ادعاءات جولة R1 (ملاحظات مؤرخة — بلا حذف النص الأصلي)

- `reviews/SAMSUNG-ONEUI-REPAIR-R1/REPORT.md`: بعد جدول بنود SUI ومباشرة تحت سطر concepts-check أُضيف **تصحيحان مؤرخان «تصحيح R2 (2026-10-08)»**: (أ) SUI-005 — «15 خانة: 252/252 ويلتف بلا قص» كان يعني قيمة 11 رقمًا/14 محرفًا منسقًا، ولفّ الوحدة وحدها؛ و15 رقمًا خامًا تحتاج تمرير تحرير (252/285 و288) مع عقد القراءة بالمؤشر؛ (ب) concepts-check — «لا يمس ملفًا تغير» غير دقيقة (يمس access-gateway والمكوّنات المعدلة؛ المراجعة المستقلة أعادته بتكييف المسار 154/155؛ R2 أكملته).
- `reviews/SAMSUNG-ONEUI-REPAIR-R1/MATRIX.md`: ملاحظتان مؤرختان بالروح نفسها (SUI-005 للجدولين أ/د، وادعاء concepts في فقرة التحقق المستقل).
- النصوص الأصلية كلها باقية حرفيًا؛ الإضافات مُعلَّمة بالتاريخ وتشير لأدلة R2.

---

## 2) SUI-R1-06 — التغطية والرجعية

### 2.1 أداة جديدة `tools/sui-r2-coverage-repair.py` + إعادة توليد CSV

- تحققت أولًا من الملف الحالي بـ`csv.reader`: **34 صف بيانات، 5 معيبة** — سطر 5: 11 عمودًا (rgb(22, 77, 89) غير مقتبسة انقسمت على الفواصل)؛ الأسطر 11/12/13/31: 8 أعمدة (عمود preview_path ساقط).
- أصلحت بيانات الصفوف المعيبة داخل الأداة: قيمة rgb تُقتبس تلقائيًا (QUOTE_MINIMAL)؛ preview_path استُرجع من سياق سجل الجولة (toast وnavbar-height وf03-experience → عينة F03 نفسها `previews/ux-patterns/mobile-record-sample/`؛ filter-panel → `previews/ux-patterns/filter-lifecycle/`).
- مسارات معلقة صُححت (اكتشاف التحقق الذاتي): `evidence/agent2/probe-d-lifecycles` لا وجود له في جولة R1 (دليل الدورات التاريخي في جولة التدقيق: `reviews/SAMSUNG-ONEUI-AUDIT/evidence/agent2/probe-d-lifecycles.py` — أُشير إليه بصراحة)؛ `evidence/agent3/family-review` → `family-review.json` الفعلي؛ `previews/standalone` غير موجود → `previews/ux-patterns/mobile-record-sample/standalone.html`؛ دليل concepts للمراجعة المستقلة → `independent/chatgpt-r1/concepts-verification.json` الموجود.
- **صف مستكمل:** metric-comparison (العائلة الرابعة عشرة) كان غائبًا عن CSV الجولة رغم أدلتها الموجودة (`evidence/agent4/regression/family-metric-comparison`: 4/4 KEEP مقيسًا) — أُضيف صفها من سجل التدقيق وأدلة R1، فاكتملت تغطية العائلات الـ14 الموثقة في REPORT.md §1.
- كُتب الملف في `reviews/SAMSUNG-ONEUI-REPAIR-R1/COVERAGE-REPAIR.csv` (استبدال المستند المعيب — مستند جولة لا دليل تاريخي) + نسخة مطابقة في `reviews/SAMSUNG-ONEUI-REPAIR-R2/COVERAGE-REPAIR.csv`.

**التحقق الذاتي (مخرجات مسجلة في `evidence/agent4/coverage/coverage-repair-run.txt`، خروج 0):**
- صفوف بيانات: **35** (34 أصلية + 1 صف metric-comparison) — **كل صف 9 أعمدة** (المعيبة 5 → 0).
- **العائلات الـ14 كلها حاضرة** (+ 4 صفوف سياق موثقة: concepts/f03-experience/gallery/platforms).
- كل repair_status من المفردات المعلنة (FIXED/FIXED+REVIEWED/REVIEWED/IMPROVED/KEEP/KEEP+DOC/NEEDS OWNER DECISION/NOT RUN).
- كل source_path/preview_path موجود في الشجرة، وكل مسار evidence موجود (نسبيًا لمجلد جولة R1 ثم لجذر المستودع).
- صفوف NOT RUN (2) بسببها الحقيقي الحرفي: **concepts** = مسار متصفح الأداة في بيئة جولة R1 (الأداة تمس access-gateway والمكوّنات المعدلة — لا «لا يمس ملفًا تغير»؛ المراجعة المستقلة 154/155؛ R2 أكملتها 157/157)؛ **platforms** = أجهزة فعلية/لمس/TalkBack/VoiceOver/قارئات صوتية/WebKit/native zoom/لوحة نظام/safe areas/رجوع النظام.

### 2.2 `tools/concepts-check.py` (ملك حصري — تعديل موثق)

- **وسائط CLI جديدة:** `--chromium` (الافتراض `shutil.which("chromium")`)، `--base` (الافتراض `MICRO_TEST_BASE` ثم `http://127.0.0.1:5000`)، `--out` (الافتراض `reviews/CONCEPTS`) — موثقة في docstring مع تصريح أن **عائق المسار لم يعد عذرًا**.
- **استُبدل التوقع الحرفي القديم** (`"لا توجد خدمة مصادقة" in status.inner_text()`) بفحص معنوي صادق: النص لا يدّعي دخولًا (لا يحوي «تم الدخول»/«نجاح»/«تم التحقق») **و** يُظهر إشعار العرض التجريبي الصادق (يحوي «عرض» أو «لن تُرسل»).
- **فحوص صدق نتيجة callback للبوابة (SUI-R1-01)** بعد قسم البوابة بأسلوب `MicroAccessGateway.init` نفسه: onSubmit يرجع `{authenticated:false, message:'لم يتم الدخول'}` → الرسالة **حرفيًا** بنبرة error؛ onSubmit يرجع `undefined` → نص محايد صادق («دون نتيجة مؤكدة») بنبرة info بلا أي ادعاء نجاح؛ الرفض → رسالة الخطأ بنبرة error (فحص قائم في الأداة أصلًا طُوّر معه).

**النتيجة في worktreeي (خادمي 4462، chromium الممرر صراحة):** **157/157 — صفر فشل** (كانت 154/155؛ الفشل الوحيد القديم صار أخضر بالفحص المعنوي + فحصا صدق جديدان). الأدلة: `evidence/agent4/concepts/` (verification.json + run-console.log + 23 لقطة).

### 2.3 سلسلة الرجعية الرسمية الموثقة (للتنفيذ من القائد — لم أشغلها)

**شرط التنفيذ:** checkout نظيف للمصدر النثبت النهائي (بعد الدمج والتثبيت) — الأدلة يجب أن تحمل commit/الشجرة نفسها للسلسلة كلها (b03/b07/f01 تسجلها من `git rev-parse` في جذر الشجرة، وux-f02-check يطابقها بفحص F02-32). الجولة المقترحة: **`sui-r2`**، ومجلد الأدلة المتوقع: **`reviews/UX-F02/round-sui-r2/`** (بمجلدي `regression/` و`f01-regression/`).

تحققت من **وسائط كل أداة الفعلية بقراءة رؤوسها** (وليس كما وردت في التكليف):

```bash
# 1) B03 — له --out فعلي (تجربتي الآمنة أكدتها: يكتب <out>/verification.txt + screenshots/)
python3 tools/b03-screenshots.py --out reviews/UX-F02/round-sui-r2/regression   # 25/25
mv reviews/UX-F02/round-sui-r2/regression/verification.txt \
   reviews/UX-F02/round-sui-r2/regression/b03-verification.txt   # F02-32 يقرأ هذا الاسم

# 2) B07 — لا وسيط إخراج إطلاقًا (بقراءة المصدر: بلا argparse/sys.argv؛ يكتب reviews/B07 ثابتة)
python3 tools/b07-screenshots.py                                              # 28/28
cp reviews/B07/verification.txt \
   reviews/UX-F02/round-sui-r2/regression/b07-verification.txt
git restore reviews/B07/    # إرجاع الأدلة التاريخية نظيفة (شرط نظافة الشجرة في F02-32)

# 3) F01 — وسيطه الفعلي --round (لا --out): يكتب reviews/UX-F01/round-<اسم>/
python3 tools/ux-f01-check.py --round sui-r2-f01reg                           # 20/20
mkdir -p reviews/UX-F02/round-sui-r2/f01-regression
cp reviews/UX-F01/round-sui-r2-f01reg/verification.json \
   reviews/UX-F02/round-sui-r2/f01-regression/verification.json  # meta.source_commit يطابق checkout نفسه

# 4) الأداة الحاكمة (وسائطها: --root و--round)
python3 tools/ux-f02-check.py --round sui-r2
# يتوقع: 32/32 — F02-32 يجد أدلة رجعية حالية (b03 25 + b07 28 + f01 20/20) بتطابق commit/شجرة
```

**تجربة آلية موثقة (ليست أدلة):** شغّلت `b03-screenshots.py --out …/f02-chain-mechanics/b03-experiment/` في شجرة عملي المعدلة → 25/25، وأكدت هيكل المخرجات وترويسة commit/شجرة المطابقة لمتطلب F02-32 (الترويسة تسجل بصدق «شجرة عمل معدلة (9 مدخلًا)») — التفاصيل في `evidence/agent4/f02-chain-mechanics/README.md`. **لم أشغل b07** (لا وسيط إخراج له — كان سيكتب فوق `reviews/B07` التاريخية، ممنوع) ولا ux-f01/ux-f02 (أدوات جولة رسمية مكانها checkout نظيف).

---

## 3) NOT RUN (صادقة)

- أجهزة فعلية (S25 أو غيره) ولمس حقيقي — كل hit-test بمستطيلات وelementFromPoint.
- قارئات شاشة صوتية فعلية (TalkBack/VoiceOver) — الأدوار والإعلانات مقيسة DOM/mutations.
- WebKit/Safari وnative zoom — التكبير 200% هنا محاكاة نص ×2 بمرورين نظيفين معلنة.
- لوحة مفاتيح نظام حقيقية، safe areas، رجوع النظام، لوحة النظام.
- سلسلة رجعية F02-32 الرسمية — موثقة أعلاه للقائد ولم تُشغل مني (تتطلب checkout نظيف)؛ تجربة b03 وحدها تجربة وسائط معلنة.
- رجعيات باقي عائلات المستودع (f03/order-schedule/repair-regression…) — مسؤولية القائد من الدمج النهائي (خارج ملكيتي هذه الجولة).

## 4) الملفات المتغيّرة (كلها ملكي الحصري)

| الملف | التغيير |
|---|---|
| `tools/sui-repair-a2-check.py` | قسم SUI-005 الصادق (أرقام/محارف + قياس المدخل + End/Home) + docstring + نطاق منافذ 4460-4479 |
| `components/fields/specification.md` | عقد قراءة المبلغ الصادق الموحد (بند المبلغ فقط) |
| `tools/concepts-check.py` | وسائط CLI + فحص معنوي + فحوصا صدق SUI-R1-01 + docstring |
| `tools/sui-r2-coverage-repair.py` | أداة جديدة (إصلاح CSV + تحقق ذاتي) |
| `reviews/SAMSUNG-ONEUI-REPAIR-R1/COVERAGE-REPAIR.csv` | إعادة توليد (35 صفًا سليمة) — مسموح كمستند جولة معيب |
| `reviews/SAMSUNG-ONEUI-REPAIR-R2/COVERAGE-REPAIR.csv` | نسخة الجولة الجديدة |
| `reviews/SAMSUNG-ONEUI-REPAIR-R1/REPORT.md` + `MATRIX.md` | ملاحظات تصحيح مؤرخة فقط (SUI-005 + concepts) — لا حذف تاريخ |
| `reviews/SAMSUNG-ONEUI-REPAIR-R2/agents/agent4.md` + `evidence/agent4/` | هذا التقرير والأدلة |

**بلا فشل متبقٍ في نطاقي.** للمتبقي على القائد: تنفيذ سلسلة الرجعية الرسمية من checkout نظيف، وإعادة b03/b07/f01/f02 في الدمج النهائي، وMANIFEST.

الحالة: DRAFT FOR RE-REVIEW — لا اعتماد ذاتي.
