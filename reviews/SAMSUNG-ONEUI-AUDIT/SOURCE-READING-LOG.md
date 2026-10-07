# سجل قراءة مصادر Samsung One UI — ما قُرئ فعلًا

> «تنزيل الصفحة لا يساوي قراءتها.» هذا السجل يثبت ما فُتح وقُرئ فعلًا خلال التدقيق، بأقسامه وتاريخه. التحقق من الوصول (HTTP/البصمات) موثق مسبقًا في `references/samsung-one-ui/SOURCE-REGISTER.json` عند إعداد الحزمة (خط الأساس 15d05f7، 2026-10-07)؛ هذا السجل يخص قراءة **المنفذ**.

## طريقة الجلب والقراءة

- جُلبت المصادر الـ41 كاملة إلى `/home/z/my-project/oneui-reading/` (خارج المستودع) عبر `tools/fetch-samsung-one-ui-references.py` بتاريخ 2026-10-07 — النتيجة: **41 FETCHED، صفر UNAVAILABLE** (سجل retrieval.json محفوظ محليًا خارج المستودع).
- استُخرج نص نظيف من كل HTML (بإسقاط nav/script/cookie-banner) عبر سكربت القائد `scripts/extract-oneui-text.py` (خارج المستودع) إلى ملفات `S<NN>.txt`؛ واستُخرج نص PDF الرسمي S37 (93 صفحة، بيانات داخلية 2019-10-29) عبر pdftotext.
- الصور التابعة للصفحات (على cloudfront) لم تُنزل — قراءة النص والأوصاف alt مع الإشارة للصور؛ لا ادعاء قراءة بصرية كاملة للوسائط. لا نسخ محتوى Samsung إلى المستودع.
- **القراءة الفعلية** تمت بفتح الملفات النصية المستخرجة وقراءتها (وليس مجرد تنزيلها) — الأدلة: الاقتباسات والأقسام المحددة في تقارير الوكلاء وتحته.

## قراءة القائد (المنسق)

| المصدر | الأقسام المقروءة | التطبيق |
|---|---|---|
| S02 Overview | المبادئ الأربعة (focus/naturally/visibly comfortable/responsive) | إطار تقييم عام |
| S03 Basic structure | Lock/Home/Recents/Quick panel/Edge | سياق — N/A للويب، سُجل |
| S04 Visual depth | Blur/Dim/Shadow + Do/Don't | تقييم عمق الطبقات (KEEP) |
| S05 Basic layout | Viewing/Interaction area، Focus blocks، Margin and padding | تقييم تراتب F03 |
| S06 Grid system | 24dp margins، Reject/Grip zones | سُجل كفرق منصة (استُبعد) |
| S07 App bar | Condensed/extended، ≤3 action buttons، More | تقييم appbar F03 (KEEP) |
| S08 Bottom bar | ≤5 أزرار أيقونة+نص، hide-on-scroll | تقييم navbar (KEEP) |
| S09 Bottom navigation | نص فقط <4 (حد أقصى 5)، لا سحب بين التبويبات | تقييم navbar/تبويبات |
| S10 Buttons | Flat/Contained، أسلوب واحد مؤكد لكل شاشة، 18dp | سياق أزرار B01 |
| S11 Dialog | الاختيار/التأكيد أسفل، المعلومة وسط، قواعد الإغلاق | SUI-028 (قرار) |
| S12 Lists | ≤31 حرفًا، subtext، مفتاح يمين الصف، subheaders | سياق صفوف/تسميات |
| S13 Search | تكملة تلقائية واقتراحات قبل الكتابة | SUI-032 (قرار) |
| S14 Toasts | ≤3 أسطر، ثانوي فقط، label toast، snackbar | سياق توست F03 |
| S15 Color system | Calm كبير/bright صغير، أنواع كتل التركيز، system blue | KEEP انضباط الألوان |
| S17 Background | سياق | استُبعد (خلفيات منصة) |
| S18 Symbol | بساطة واكتمال الرموز | سياق أيقونات |
| S19 Icon color | تباين الرمز/الخلفية | سياق |
| S20 Motion intro | علاقة سبب-نتيجة، استجابة فورية | سياق حركة |
| S21 Motion basics | Interpolator [0.22,0.25,0.00,1.00]، أنواع التخامد، 100–500ms، عدم مقاطعة النص | KEEP أزمنة الحركة |
| S24 Focused and purposeful | كل نص لاختيار/فعل/فهم | تقييم كتابة |
| S25 Simple and human | إزالة النص الدفاعي، مقاطعة للمهم فقط، شمول | تقييم كتابة |
| S26 Empowering | أسئلة التأكيد، مساعدة لا حدود، لا لوم | SUI-023 |
| S27 Accessibility intro | مبادئ 4C | سياق |
| S28 Screen reader | مكونات الإعلان الأربعة، جدول الإعلانات الكامل | SUI-010/SUI-012 |
| S29 Focus order | تدفق منطقي، تجميع، لا looping، تركيز موقع الفعل | SUI-015/SUI-022 |
| S30 Color and contrast | 4.5:1/3:1، لون+علامات إضافية | حساب التباين (KEEP) |
| S31 Layout and typography | نص قابل للتكبير 200%، Large text layout، تباعد اللمس | مقياس SUI-002/004/005/008 |
| S32 Interaction and control | لا إغلاق تلقائي، بديل الإيماءات، مسار رجوع، تركيز الفعل التالي، اتساق | مقياس موحد |
| S37 PDF (93 صفحة) | فهرس + هوامش/keylines (24dp، safe area) + popups + بحث + first-time-use — **موسوم مرجعًا سياقيًا قديمًا (2019-10-29 داخليًا)، ليس أحدث إصدار One UI** | سياق |
| S38 One UI 7 story | قصة بصرية 2025-01-23 (فهم عام، ليست جدول قياسات) | سياق |
| S39/S40/S41 | صفحات خدمات Samsung العامة | استُبعدت — أدوار تكميلية لا إرشاد تصميم |

كما قرأ القائد: `prompts/SAMSUNG-ONEUI-MICRO-AUDIT-ZAI.md` كاملًا، حزمة `references/samsung-one-ui/` كاملة (README/SOURCES/MICRO-ADAPTATION/AUDIT-COVERAGE/REPORT-TEMPLATE/SOURCE-REGISTER)، `AGENTS.md`، `docs/CURRENT-STATE.md` (أحدث قسمين)، `docs/COMPONENT-INVENTORY.md`، `docs/UI-VISUAL-SYSTEM.md`، `reviews/ORDER-SCHEDULE/CHATGPT-REVIEW-R1.md`، جرد `components/` و`previews/`، وتقارير الوكلاء الأربعة كاملة + خلاصة الوكيل 5.

## قراءة الوكلاء (من تقاريرهم الموثقة)

| الوكيل | المصادر المقروءة فعليًا (كاملة ما لم يذكر خلاف ذلك) |
|---|---|
| الوكيل 1 (أساس بصري) | S02، S03، S04، S05، S06، S15، S17، S18، S19، S20، S21، S30، S31 |
| الوكيل 2 (إدخالات/اختيارات) | S10، S12، S13، S14، S21، S31، S32 |
| الوكيل 3 (تنقل/تغذية راجعة) | S07، S08، S09، S11، S14، S24، S25، S26، S28، S29، S32 |
| الوكيل 4 (بيانات/مركبة) | S12، S15، S20، S21، S28، S30، S31، S32 |
| الوكيل 5 (مستقل) | أعاد فتح المصادر ذات الصلة بالتحقق (S31 خاصة) وقرأ لقطات الوكيل 1 و3 و2 الفعلية (13 قراءة VLM) |

## ما تعذر / لم يُقرأ

- لا مصدر UNAVAILABLE — الـ41 جُلبت كلها.
- وسائط الصور/الفيديو التابعة لصفحات HTML غير مضمنة في التنزيل (محدودية موثقة في SOURCES.md) — اقتُصر على النص وalt الموجود؛ **لم تدّعِ أي نتيجة استنتاجًا من صورة غير مقروءة**.
- أقسام sound/haptic/dark/large-screen/foldable (S16/S22/S23/S34–S36/S39–S41) قُيّمت لمدى الانطباق فقط وحُسمت N/A أو مؤجلة بقرار المالك — لم تتحول لأي طلب تنفيذ.
