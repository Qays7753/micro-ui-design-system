# Micro UI — دليل الاستخدام والتركيب والتغيير المشترك (UI-USAGE-SOP)

الحالة: DRAFT FOR REVIEW — يصف طريقة عمل فرع التوسعة (B02+) على المصدر نفسه دون إعادة بناء.
المرجع: docs/EDITABLE-DELIVERY.md وdocs/UI-LIBRARY-EXECUTION-BRIEF.md.

## 1) التشغيل السريع

```bash
python3 -m http.server 8080        # من جذر المستودع فقط (وليس من مجلد المعاينة)
# الفهرس:   http://localhost:8080/previews/
# دفعة واحدة: http://localhost:8080/previews/<family>/
```

تشغيل فحوص أي دفعة (Chromium + Playwright): `python3 tools/<batch>-screenshots.py` — السجل والقياسات وcommit مصدر اللقطات في `reviews/<batch>/verification.txt`. دفعة العارض المستقلة: `python3 tools/carousel-screenshots.py` → `reviews/CAROUSEL/`. دفعة اتجاه After: `python3 tools/after-direction-screenshots.py` → `reviews/AFTER-DIRECTION/`.

## 2) استهلاك مكوّن في صفحتك (الحد الأدنى)

1. حمّل بالترتيب: `assets/fonts/fonts.css` ← `shared/tokens.css` ← `components/<family>/<family>.css` (و`shared/motion.css` إذا احتجت طبقات/حركة).
2. انسخ البنية المعلنة في `components/<family>/specification.md` (§ البنية) — أسماء الأصناف هي العقد.
3. السلوك العام عند الحاجة فقط: `components/<family>/<family>.js` (واجهات عامة موثقة: `MicroButtons/MicroFields/MicroSelection/MicroMessages/MicroNavigation/MicroData/MicroOrganization`) — ثم `init()` أو ربط الأحداث المعلنة.
4. أيقونات صفحتك: تُجلب من `assets/icons/*.svg` وتُحوّل إلى `<symbol>` كما تفعل لوحات المعاينة عبر `previews/board.js` — أو استخدم `<img>` مع فقدان `currentColor`.

## 3) تركيب بين العائلات (قواعد مثبتة)

- الحقول تستخدم أزرار B01 داخلها (مسح/خطوة) — لا تنسخ شكل الزر.
- لوحة الفلاتر (B07) تفتح من زر تصفية B01 وعدّادها شارة B01 التي تخفي 0.
- رسائل B06 تُستخدم داخل أي لوحة/صفحة كعنصر مستهلك ثابت.
- ألوان البيانات (B05) لا تنتقل زينةً إلى حقول أو أزرار.
- الأسطح (S01) للأسطح البارزة فقط — القوائم والمدخلات صافية.
- تركيب اتجاه After (دفعة مستقلة PROPOSED): نمط التجميع عنوان+فاصل+صفوف بلا بطاقة لكل عنصر، وسطح بترولي بارز واحد عند الحاجة، وقيمة رئيسية + اتجاه بنص لا لون، ودوائر متداخلة بقيم داخلها (امتداد packed PROPOSED) — مرجع تركيب قابل للتعديل في `previews/after-direction/` وليس شاشة إنتاجية ولا نمط تنقل.
- العارض (دفعة مستقلة) مستقل عن محتوى البطاقات تمامًا: استهلكه بوضع أي محتوى داخل `.m-carousel__card`؛ لا تجعله صفحة رئيسية ولا Dashboard، ولا تعتمد السحب وحده، ولا `autoplay` أصلًا. أمثلة محتواه من عقد B05/التوزيع والدوائر (المتداخلة امتداد PROPOSED opt-in في `components/data/packed-circle.*` لا يغيّر سلوك B05).
- الاختيار داخل المنتقي (B03) يُعاد استخدام طبقة B07 النهائية عند توفرها.

## 4) إضافة نوع جديد لدفعة قائمة (مثال: نوع زر سابع)

1. أضف صنف النوع في `components/buttons/buttons.css` مستخدمًا توكنات `shared/tokens.css` — **لا ألوان مقاسات صريحة داخل المكوّن**.
2. إن احتاج قيمة مشتركة جديدة: عرّفها أولًا في `shared/tokens.css` باسم دلالي ووسّم «مقترح» في التعليق إن لم تثبت في الأسس.
3. حدّث أمثلة `previews/buttons/index.html` + سطرًا في `components/buttons/specification.md` + صفًا في جدول «أين أعدّل؟».
4. شغّل `tools/b01-screenshots.py` وأعد اللقطات المتأثرة، وحدّث `reviews/B01/review.md` ثم MANIFEST (السكربت أدناه).

## 5) التغيير المشترك (توكن واحد يلمس عدة دفعات)

1. عدّل القيمة في `shared/tokens.css` فقط (لا تُكرر القيمة داخل مكوّن).
2. اذكر الدفعات المتأثرة في وصف التغيير، وشغّل سكربتات فحصها بالقدر اللازم (`tools/b0*-screenshots.py`).
3. أعد اللقطات المتأثرة لكل دفعة وحدّث تقاريرها — لا تُنقل نتائج قديمة إلى مصدر تغيّر.

## 6) إعادة توليد اللقطات والفهرس

```bash
python3 tools/b01-screenshots.py   # وكذلك b02..b07 وs01
```
كل سكربت يبني خادمه المؤقت ويكتب سجله باسم `verification.txt`/`r2-verification.txt` مع commit المصدر. حوّل أيقونة جديدة إلى أصل SVG بـ `tools/hugeicons-convert.py` (الطريقة الموثقة في assets/SOURCES.md).

## 7) إعادة توليد MANIFEST (بعد آخر تعديل — مستثنيًا نفسه)

```bash
python3 - <<'PY'
import hashlib, json
from pathlib import Path
m = {}
for p in sorted(Path('.').rglob('*')):
    rel = p.relative_to('.').as_posix()
    if not p.is_file() or p.is_symlink() or rel == 'MANIFEST.json' or rel.startswith('.git/'):
        continue
    m[rel] = hashlib.sha256(p.read_bytes()).hexdigest()
Path('MANIFEST.json').write_text(json.dumps(m, ensure_ascii=False, indent=2, sort_keys=True) + '\n', encoding='utf-8')
print('entries:', len(m))
PY
```

## 8) قواعد ذهبية (ملخص)

- المصدر قابل للتعديل دائمًا — الصورة/PDF/build وحدها ليست تسليمًا.
- لا force-push ولا دمج ذاتي — كل دفعة DRAFT FOR REVIEW حتى مراجعة ChatGPT واعتماد قيس.
- أي قيمة بصرية جديدة = توكن مسمّى موسوم «مقترح» + سبب في review.md، لا قيمة صامتة.
- القيم الداخلية بالمكوّن وحده موثقة بتعليق في موضعها ولا تُقدَّم كقيم مشتركة.
- لا تُنقل ادعاءات فحص قديمة إلى مصدر تغيّر — أعد الفحص أو أعلن النقص.
