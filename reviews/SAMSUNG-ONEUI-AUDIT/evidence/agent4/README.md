# أدلة الوكيل 4 — البيانات والمكونات المركبة

**الرأس المراجع:** commit `a5500c9` — شجرة `05f344b05ef12284abfc31ad9a1c8633dcd6a058` (نظيفة عدا مجلد reviews غير المتتبع).
**الأداة:** Playwright (sync) + Chromium للفحص `/home/z/my-project/evidence/bin/chromium` (Chrome for Testing)، عبر خادم محلي `http://localhost:5000` (أداة `tools/preview-server.py` القائمة — بلا تعديل).
**آلية تكبير 200%:** الآلية المعلنة في المشروع نفسه (مضاعفة `font-size` المحسوبة لكل عنصر بمرورين نظيفين بعلامة `data-r2z` — نفس `ZOOM2_CLEAN` في `tools/ui-repair-r2-check.py`) — **محاكاة نص لا native zoom**، وموثقة كذلك في كل JSON.
**كيف تقرأ النتائج:** كل ملف `probe-*.py` سكربت قابل لإعادة التشغيل، و`probe-*.json` نتيجته الخام. أسماء اللقطات تحمل الحالة والمقاس.

## الملفات

| الملف | ما يقيسه |
|---|---|
| `probe-a-charts.py/.json` | تسميات bars/line الفعلية عند 430 ثم تصغير حي 430→320 بلا إعادة فتح (مسار ResizeObserver): cssPx ومقاس الشاشة الفعلي، القص والقراءة الكاملة، حفظ الدونات 148، فيض 200% |
| `probe-b-charts-200.py/.json` | 200% بالآلية المعلنة بمرورين نظيفين: تصادم مستطيلات التسميات صفًّا، خارج الحدود، الدونات (مقاس/شرائح/حالات الرفض)، عدّ أحداث `micro-data:rendered` عند تغيير العرض حيًّا |
| `probe-c-f03-reports.py/.json` | وجهة التقارير F03 عبر التطبيق الحقيقي: أعمدة/خط/دونات عند 430 و320 (تصغير حي) و200%، فتح قسم الدونات المطوي، شريط peek (حالة/موضع/inert)، لوحة مفاتيح حقيقية |
| `probe-d-compositions.py/.json` | مصدر الفيض الأفقي في لوحة البيانات عند 200%، لوحة concepts (دوائر metric + سلوك 320/200%)، صفحات info-strip index/comparison (بما فيها فيض جدول المقارنة) |
| `probe-e-carousel.py/.json` | عارض البطاقات: سحب RTL حقيقي (أحداث مؤشر فعلية) فوق العتبة/دونها، لوحة مفاتيح حقيقية، ترتيب Tab، معمل 6 بطاقات (النقاط)، inert، reduced-motion |
| `probe-e2-packed-peek.py/.json` | الدوائر المت packed داخل بطاقة 3: قبل التوسعة (مخفي=0) وبعد نقر توسعة حقيقي (إعادة تخطيط بالرصد)، وسحب peek في F03 (اتجاه RTL + snap-back) |
| `probe-f-calendar.py/.json` | الكالندر: مقاس الخلايا 320/360/390/430 (سياق CAL-D1)، علامتا اليوم/المحدد، سقف النقاط، أزرار ≥48، صفوف اليوم، لوحة مفاتيح roving حقيقية، ظهور `mystery` في المفتاح (تحقق CAL-R1-02) |
| `probe-g-mstat-bubbles.py/.json` + `harness-m-stat-bubbles.html` | عزل مكوّني: m-stat برقم طويل عند 320+200% (فيض بلا التفاف)، والفقاعات (تناسب √ + حالات صفر/مجهول) |
| `probe-h-metric-negative.py/.json` | مسارات الرفض في metric-circles (data-max أصغر/تخطيط مجهول): فصل نص المستخدم عن التشخيص + القراءات في القائمة البديلة، واستعادة بعد الإصلاح |
| `probe-i-peek-affordance.json` | هندسة peek في F03 عند 320/430: البطاقة النشطة وجزء المجاور الظاهر (وثيقة الخطأ D1) |
| `probe-j-carousel-btns-peek-rm.json` | أزرار/نقاط العارض 48×48، وtransition=none للـpeek تحت reduced-motion |
| `probe-k-f03-cells.json` | خلايا شهر F03 عبر 320/360/390/430 (سياق CAL-D1 التركيبي) |

## اللقطات (الحالة والمقاس في الاسم)

- `data-bars-320-live.png` / `data-line-320-live.png` — بعد تصغير حي 430→320 بلا إعادة فتح.
- `data-bars-320-200pct-declared.png` — 200% بالآلية المعلنة (مرور نظيف).
- `data-values-mstat-320-200pct.png` / `mstat-isolated-320-200pct.png` — فيض m-stat عند 200% (لوحة + عزل مكوّني).
- `f03-rep-bars-320.png` / `f03-rep-donut-320-open.png` — رسوم تقارير F03 بعد تصغير حي وقبل/بعد فتح قسم الدونات.
- `f03-rep-peek-320.png` — حالة شريط peek عند دخول التقارير (قبل أي تفاعل) — دليل D1.
- `concepts-packed-320.png`، `carousel-card1-320.png`، `carousel-card3-packed-320.png`، `carousel-card3-packed-expanded-320.png`.
- `ocal-month-320.png` / `ocal-sample-320.png` — شبكة الشهر عند 320 (مثال مستقل + عينة ux-patterns).

ملاحظة تنفيذية: `probe-i/j/k` كُتبت كسكربتات مضمنة في الجلسة وثُبّت نتاجها JSON هنا (بلا ملف .py مستقل) — محتواها قابل لإعادة الإنتاج بالأوامر الموثقة في تقرير الوكيل.
