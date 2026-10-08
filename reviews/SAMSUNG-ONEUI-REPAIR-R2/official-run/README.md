# الأدلة الرسمية لجولة SAMSUNG-ONEUI-REPAIR-R2 / 2026-10-08

**المصدر المثبت النهائي:** commit `3a6adf0794c4df3577c704b523fcde829ccd787d` (شجرة `295046a12728ea1257eb7382d5dcf06cb6941abf`) — عليه أُعيد توليد هذه الأدلة كاملة من **checkout نظيف detached** (worktree `miu-r2-official`) بعد ثبات المصدر؛ لا أداة واحدة شُغّلت على شجرة متوسطة. رأس البداية للجولة: `be5263c` (رأس main البعيد وقت التكليف). الـcommit المصدرية للجولة: `66bc1a8` (إصلاحات SUI-R1-01..04 + تكامل القائد) ثم `3a6adf0` (SUI-R1-05/06 + الأدوات والتغطية).

**البيئة:** Chromium headless عبر Playwright (python وnode) — أدوات الجولة تسجل إصدار المتصفح في ميتا كل أداة؛ محاكاة تكبير النص 200% بممرين نظيفين (ZOOM2_CLEAN) أو بتضخيم التوكنات (TOKX2 عند المستقل) — **ليست native zoom**. standalone فُحص عبر `file://`.

## جدول النتائج (كلها من الـcheckout النظيف)

| المسار/الأداة | النتيجة | الموقع |
|---|---|---|
| بناء standalone `--check` | **مطابق بايت-ببايت** (17 أيقونة مطابقة للأصول) | الأمر أدناه |
| سلسلة رجعية F02-32 (SUI-R1-06): B03 → B07 → F01 → F02 | **B03 25/25 · B07 28/28 · F01 20/20 · F02 32/32** بمطابقة commit/شجرة كاملة (`3a6adf0`/`295046a`) | [f02-chain/](f02-chain/) |
| ux-f03-check (التجربة الكاملة + standalone حتمي) | **46/46 مسارًا · 207 تحقيقًا · صفر أخطاء صفحة وموارد** | [f03/](f03/) |
| order-schedule-check | **16/16 مسارًا · 267 تحقيقًا** (تكافؤ src 14/14 · standalone 13/13 · sample 15/15 · comp 3/3 · صفر أخطاء/موارد) | [order-schedule/](order-schedule/) |
| repair-regression.cjs (node) | **301/301** | [repair-regression/](repair-regression/) |
| ui-repair-r2-check | **130/130** (meta: commit=3a6adf0, clean=True) | [ui-repair-r2/](ui-repair-r2/) |
| ui-repair-r1-check | **54/54** | [ui-repair-r1/](ui-repair-r1/) |
| أدوات جولة R1 (إعادة رسمية): a1 / a2 (المحدثة) / a3 / a4 | **32/32 · 69/69 · 57/57 · 34/34** | [r1-a1/](r1-a1/) · [r1-a2/](r1-a2/) · [r1-a3/](r1-a3/) · [r1-a4/](r1-a4/) |
| أدوات جولة R2 (الوكيل 1/2/3): a1 / a2 / a3 | **30/30 · 36/36 · 11/11 + 144/144** | [r2-a1/](r2-a1/) · [r2-a2/](r2-a2/) · [r2-a3/](r2-a3/) |
| concepts-check (المحدثة: وسائط مسار + فحص معنوي + فحوصا صدق البوابة) | **157/157** (كانت 154/155 عند رأس البداية) | [concepts/](concepts/) |
| b01-screenshots (رجعية) | **49/49** | [b01/](b01/) |
| إعادة توليد COVERAGE-REPAIR.csv | **حتمية**: إعادة التوليد من checkout نظيف = صفر فرق عن المثبت، والتحقق الذاتي ناجح (35 صفًا × 9 أعمدة، 14 عائلة، مسارات محققة) | الأمر أدناه |
| قراءات VLM للقائد (4 لقطات مفصلية) | navbar (320+200% RTL): **لا قص لأي تسمية** (قراءة دقيقة ثانية) · شريط التحديد فوق navbar كاملًا · peek موسّط بعد 3 دورات · بوابة: **لا ادعاء نجاح دخول** | [vlm-readings/](vlm-readings/) |

القياس البرمجي هو الحاكم؛ قراءات VLM مساندة (ضعف قراءة النص العربي الصغير موثق من R1 وملاحظ في قراءة البوابة — الحكم النصي للأداة البرمجية).

## أوامر الإعادة (من checkout نظيف لنفس الرأس)

```bash
git worktree add --detach <dir> 3a6adf0 && cd <dir>
python3 tools/build-f03-standalone.py --check
# سلسلة F02-32 (بهذا الترتيب — تنظف الشجرة بين الخطوات):
python3 tools/b03-screenshots.py --out reviews/UX-F02/round-sui-r2/regression
mv reviews/UX-F02/round-sui-r2/regression/verification.txt reviews/UX-F02/round-sui-r2/regression/b03-verification.txt
python3 tools/b07-screenshots.py            # يكتب reviews/B07 → انسخ ثم git restore
cp reviews/B07/verification.txt reviews/UX-F02/round-sui-r2/regression/b07-verification.txt && git restore reviews/B07
python3 tools/ux-f01-check.py --round suir2  # يكتب reviews/UX-F01/round-suir2
cp reviews/UX-F01/round-suir2/verification.json reviews/UX-F02/round-sui-r2/f01-regression/verification.json
rm -rf reviews/UX-F01/round-suir2
python3 tools/ux-f02-check.py --round sui-r2 # → 32/32 مع F02-32 PASS
# بقية البطارية:
python3 tools/ux-f03-check.py --out <out>/f03
python3 tools/order-schedule-check.py --out <out>/order-schedule --port 4510
node tools/repair-regression.cjs
python3 tools/ui-repair-r2-check.py --root .
python3 tools/ui-repair-r1-check.py          # يكتب داخل reviews/ → انسخ ثم git restore
python3 tools/sui-repair-a1-check.py --stage after --root . --out <out>/r1-a1
python3 tools/sui-repair-a2-check.py --tag after --out <out>/r1-a2
python3 tools/sui-repair-a3-check.py --phase after --port 4512   # يكتب داخل أدلة R1 → انسخ ثم git restore
python3 tools/sui-repair-a4-check.py --stage after --out <out>/r1-a4
python3 tools/sui-r2-a1-check.py --tag after --out <out>/r2-a1
python3 tools/sui-r2-a2-check.py --tag after --out <out>/r2-a2
python3 tools/sui-r2-a3-check.py --tag after --out <out>/r2-a3
python3 tools/concepts-check.py --chromium <path> --base http://127.0.0.1:<port> --out <out>/concepts
python3 tools/b01-screenshots.py             # يكتب داخل reviews/B01 → انسخ ثم git restore
python3 tools/sui-r2-coverage-repair.py      # صفر فرق = حتمية
```

قبل الإصلاح، أنتجت أدوات R2 الثلاث حالات فشل حقيقية على `be5263c` (قبل أي تعديل): a1 ‏15/30، a2 ‏20/36، a3 ‏7/11 و132/144 — محفوظة بمخرجاتها الكاملة في [../evidence/agent1](../evidence/agent1) و[agent2](../evidence/agent2) و[agent3](../evidence/agent3).

## NOT RUN (أسباب حقيقية)

جهاز Samsung Galaxy S25/Samsung Internet وأي جهاز فعلي (لا جهاز في البيئة) · اللمس الفعلي ولوحة النظام وsafe areas ورجوع النظام · TalkBack/VoiceOver والصوت الفعلي (قياسات الإعلان DOM بنيوية عبر MutationObserver — لا ادعاء صوت) · WebKit/Safari (Chromium فقط) · native zoom (محاكاة نص ×2 معلنة بآليتين مستقلتين) · عرض فقاعة reportValidity على متصفح مرئي (يقيس عدم الاستدعاء برمجيًا).

## تنظيف الأدلة

سلاسل لقطات إعادة التشغيل الرجعية (r1-a1/a2/a4، ui-repair-1/2، repair-regression، order-schedule، b01، f02-chain) قُلمت مع بقاء كل القياسات في JSON/TXT؛ لقطات أدوات R2 نفسها وf03 وconcepts ولقطات selectbar/toast المفصلية محفوظة كاملة (100 لقطة، ~7.5MB). مجلدات الأدلة التاريخية للجولات السابقة لم تُمس إطلاقًا — الأدوات التي تكتب داخل مسارات متتبعة (b01/b07/a3/ui-repair-1/f01-round) حُصدت مخرجاتها ثم استعيدت الشجرة بـ`git restore` فور كل تشغيل.
